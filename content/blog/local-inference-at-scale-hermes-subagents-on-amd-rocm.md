---
slug: "local-inference-at-scale-hermes-subagents-on-amd-rocm"
title: "Local Inference at Scale: Running Hermes Subagents on AMD ROCm Without Leaving Linux"
excerpt: "How SMF Works runs Hermes subagents on local AMD GPUs using ROCm, Ollama, and a deterministic model router. A field-tested setup for multi-agent orchestration with a cloud fallback that stays honest about latency, memory, and cost."
date: "2026-06-29"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Local LLMs", "Linux", "AMD", "Agent Architecture", "Engineering"]
tags: ["ollama", "rocm", "subagent", "model-routing", "inference"]
readTime: 14
image: "/images/blog/local-inference-at-scale-hermes-subagents-on-amd-rocm-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/local-inference-at-scale-hermes-subagents-on-amd-rocm"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

Every AI team I talk to eventually hits the same wall. They start with OpenAI or Anthropic, build a prototype, and then the bill shows up. Not the sticker price — the *shape* of the bill. Token charges for subagent calls that should have been cheap. Latency spikes when six agents talk at once. A "quick research task" that turns into forty API calls because no one capped the loop.

At SMF Works we run a hybrid stack. The orchestrator — Hermes — lives on a Linux host with AMD GPUs. Most subagent work runs locally through Ollama on ROCm. When a task really needs a frontier model, or when the local queue is full, we route to the cloud. The goal is not to be noble about open weights. The goal is to make the economics predictable enough that we can ship a product instead of managing an API budget.

This post is the architecture we use, the configuration files that make it reproducible, and the decision tree the router follows. It assumes you are comfortable with Linux, systemd, and Python. It does not require NVIDIA.

---

## 1. Why We Chose the Local-First Path

The SMF Predict pipeline and the SMF Swarm product both rely on many small model calls. Research, planning, validation, formatting, and scoring can each be their own subagent. If every call is a frontier API request, the cost curve is exponential. More importantly, the latency curve is unpredictable. A remote model may be fast at 2 AM and slow at 10 AM. That non-stationarity makes agent scheduling hard.

Local inference flattens both curves. Once the model is loaded, the marginal cost of a token is electricity and amortized hardware. Latency becomes a function of batch size and GPU utilization, not someone else's queue. The trade-off is upfront work: you have to install drivers, quantize models, manage context-window contention, and decide when local is not enough.

Our hardware is AMD, not NVIDIA. That used to mean pain. It still means *some* pain, but ROCm 6.x plus Ollama's `rocm` variant plus llama.cpp's HIP backend is now a real production path for the models we care about: Qwen3, Llama 3.3, Gemma 4, and Mistral Small. I will not claim every model works. I will claim the ones that matter for agent work work well enough to be the default.

---

## 2. Reference Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Hermes Agent Host                            │
│  ┌─────────────────┐    ┌───────────────┐    ┌────────────────────┐ │
│  │ Planner +       │    │ Model Router  │    │ Subagent Worker    │ │
│  │ Governance      │───▶│ (deterministic│───▶│ Pool               │ │
│  │ Broker          │    │  fallback)    │    │                    │ │
│  └─────────────────┘    └───────┬───────┘    └──────────┬─────────┘ │
│                                 │                        │          │
│                                 ▼                        ▼          │
│                       ┌──────────────────┐    ┌─────────────────┐   │
│                       │ Local Ollama     │    │ Cloud Fallback  │   │
│                       │ ROCm / HIP       │    │ OpenRouter etc. │   │
│                       │ :11434           │    │ streaming JSON  │   │
│                       └──────────────────┘    └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

The broker decides *what* needs to happen. The planner produces a plan. The router decides *where* each model call runs. Subagents are not special runtime entities — they are the same Hermes process with a constrained toolset, a shorter context budget, and a specific system prompt. That design choice keeps the system honest: a subagent is just a goal routed through a narrower policy.

---

## 3. The ROCm + Ollama Foundation

### Install ROCm

On Ubuntu 22.04/24.04 with supported AMD GPUs:

```bash
# Add the AMD GPU repository
sudo mkdir -p /etc/apt/keyrings
wget -q -O - https://repo.radeon.com/rocm/rocm.gpg.key \
  | gpg --dearmor | sudo tee /etc/apt/keyrings/rocm.gpg > /dev/null

echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/rocm.gpg] \
  https://repo.radeon.com/rocm/apt/6.4 noble main" \
  | sudo tee /etc/apt/sources.list.d/rocm.list

sudo apt update
sudo apt install -y rocm-dev rocm-utils hip-dev rocminfo
```

Verify the GPU is visible:

```bash
rocminfo | grep "Name:" | head -10
rocm-smi --showproductname
```

The `rocm-smi` output is your ground truth. If the GPU does not appear here, Ollama will not see it either, and no amount of Python code will fix that.

### Install Ollama with ROCm

Ollama's default binary bundles CUDA. For AMD you need the ROCm build. At the time of writing:

```bash
curl -fsSL https://ollama.com/install.sh | sh

# Force ROCm runtime if needed
export OLLAMA_BACKEND=rocm
export OLLAMA_MAX_LOADED_MODELS=2
export OLLAMA_NUM_PARALLEL=2
```

`OLLAMA_MAX_LOADED_MODELS` is the most important knob for multi-agent work. With two GPUs and enough VRAM, keeping two quantized models resident eliminates cold-start latency. If you only have one GPU, set it to 1 and accept model swap costs.

### Pull the agent workhorses

```bash
ollama pull qwen3.6:27b-q4_K_M
ollama pull llama3.3:70b-q4_K_M
ollama pull gemma4:27b-q4_K_M
ollama pull nomic-embed-text
```

`qwen3.6:27b-q4_K_M` is our default planning/structured-output model. `llama3.3:70b-q4_K_M` handles reasoning-heavy validation. `gemma4:27b-q4_K_M` is the fast, cheap summary model. `nomic-embed-text` stays loaded for retrieval. Your exact roster will differ; the principle is to have one model per *role*, not one model per *task*.

### Run Ollama as a systemd user service

Create `~/.config/systemd/user/ollama.service`:

```ini
[Unit]
Description=Ollama local LLM server
After=network.target

[Service]
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_BACKEND=rocm"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
Environment="OLLAMA_NUM_PARALLEL=2"
Environment="OLLAMA_KEEP_ALIVE=30m"
ExecStart=/usr/local/bin/ollama serve
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Then:

```bash
systemctl --user daemon-reload
systemctl --user enable --now ollama
```

`OLLAMA_KEEP_ALIVE=30m` avoids thrash when subagents call in bursts. Tune it downward if VRAM is tight.

---

## 4. The Model Router

The router is the piece that decides whether a given subagent call goes local or cloud. We use a small Python module, not an LLM, because this decision must be deterministic and fast. An LLM should not decide whether to call an LLM.

```python
# smf_predict/router.py
from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class RoutingDecision:
    provider: str          # "ollama" or "openrouter"
    model: str
    fallback_reason: Optional[str] = None

LOCAL_MODELS = {
    "planner": ("ollama", "qwen3.6:27b-q4_K_M", 18_000),
    "validator": ("ollama", "llama3.3:70b-q4_K_M", 25_000),
    "summarizer": ("ollama", "gemma4:27b-q4_K_M", 10_000),
    "coder": ("ollama", "qwen3.6:27b-q4_K_M", 20_000),
}

CLOUD_FALLBACKS = {
    "planner": ("openrouter", "anthropic/claude-sonnet-4-20250514"),
    "validator": ("openrouter", "anthropic/claude-sonnet-4-20250514"),
    "summarizer": ("openrouter", "openai/gpt-4.1-mini"),
    "coder": ("openrouter", "anthropic/claude-sonnet-4-20250514"),
}

def route(role: str, token_estimate: int, queue_depth: int,
          local_vram_available_mb: int, deadline_ms: int) -> RoutingDecision:
    local = LOCAL_MODELS.get(role)
    if not local:
        cloud = CLOUD_FALLBACKS.get(role, ("openrouter", "unknown"))
        return RoutingDecision(cloud[0], cloud[1], fallback_reason="no local model for role")

    provider, model, vram_budget = local
    reasons = []
    if token_estimate > vram_budget:
        reasons.append(f"token estimate {token_estimate} > local budget {vram_budget}")
    if queue_depth > 2 and deadline_ms < 3000:
        reasons.append("local queue saturated, deadline tight")
    if local_vram_available_mb < (vram_budget / 1024):
        reasons.append("insufficient VRAM available")

    if reasons:
        cloud = CLOUD_FALLBACKS.get(role, ("openrouter", "unknown"))
        return RoutingDecision(cloud[0], cloud[1], fallback_reason="; ".join(reasons))

    return RoutingDecision(provider, model)
```

The inputs are simple:

- `token_estimate` comes from the planner's budget, not a guess. We use the tokenizer or Ollama's context window metadata.
- `queue_depth` is the number of in-flight local requests.
- `local_vram_available_mb` is read from `rocm-smi --showmeminfo` or `ollama ps`.
- `deadline_ms` is the SLO for the subagent. A 3 AM cron job can wait; a chat response cannot.

This router is not trying to be clever. It is trying to avoid obviously bad local calls. That is 90% of the value.

---

## 5. Wiring the Router into Hermes

Hermes already has a `model` config section. We extend it with a `routing` section per profile:

```yaml
# ~/.hermes/profiles/liam/config.yaml
model:
  default: "ollama/qwen3.6:27b-q4_K_M"
  provider: "ollama"
  base_url: "http://127.0.0.1:11434"

routing:
  enabled: true
  local_provider: "ollama"
  local_url: "http://127.0.0.1:11434"
  cloud_provider: "openrouter"
  cloud_model: "anthropic/claude-sonnet-4-20250514"
  deadline_ms: 5000
  max_local_queue: 2

subagent:
  max_concurrency: 3
  default_timeout: 120
  planner_role: "planner"
```

The Hermes planner passes each subagent goal through `route()` before invoking the LLM. If the decision is cloud, the call goes through the configured cloud provider with the same message format. The subagent itself does not know where it ran. That opacity is intentional: it keeps subagents portable and testable.

---

## 6. Subagent Concurrency and GPU Isolation

Ollama can serve multiple requests against one loaded model, but AMD GPUs still benefit from explicit isolation. We run separate Ollama instances only when we have discrete GPU boundaries. More commonly, we rely on Ollama's `OLLAMA_NUM_PARALLEL` and on Hermes' own concurrency limit.

```yaml
subagent:
  max_concurrency: 3
  default_timeout: 120
```

Why 3? Because with two models loaded and `OLLAMA_NUM_PARALLEL=2`, three concurrent subagents keeps the queue short without overcommitting the GPUs. A fourth subagent waits. If your GPUs are slower, drop to 2. If you have a MI300X, raise it and measure.

Do not let subagents recurse. The planner produces a DAG. Each subagent has a fixed context budget and a fixed output schema. A subagent that needs another subagent must return to the planner. This prevents runaway local calls and keeps the router's queue_depth accurate.

---

## 7. A Concrete Example: The Predict Pipeline

The SMF Predict cycle has four phases:

1. **Research** — gather signals (web, market, papers).
2. **Forecast** — generate probability distributions.
3. **Validation** — check coherence and bias.
4. **Format** — produce the final report.

We map these to roles:

| Phase | Role | Default local model | Cloud fallback |
|-------|------|---------------------|----------------|
| Research | summarizer | gemma4:27b-q4_K_M | openai/gpt-4.1-mini |
| Forecast | planner | qwen3.6:27b-q4_K_M | anthropic/claude-sonnet-4-20250514 |
| Validation | validator | llama3.3:70b-q4_K_M | anthropic/claude-sonnet-4-20250514 |
| Format | summarizer | gemma4:27b-q4_K_M | openai/gpt-4.1-mini |

The research phase may make twenty small calls. The router keeps them local unless the web results are huge. Validation runs the largest model because contradiction detection is the most expensive reasoning task. Formatting is small and fast.

A typical trace looks like:

```
[router] planner: qwen3.6:27b-q4_K_M @ ollama (token_estimate=8.2k, queue=0)
[router] summarizer: gemma4:27b-q4_K_M @ ollama (token_estimate=2.1k, queue=1)
[router] validator: llama3.3:70b-q4_K_M @ ollama (token_estimate=12k, queue=0)
[router] summarizer: gemma4:27b-q4_K_M @ ollama (token_estimate=1.4k, queue=2)
```

If a phase fails with a timeout or an empty response, the planner retries once local, then falls back to cloud. The fallback is logged as structured output so we can audit it later.

---

## 8. Monitoring What Matters

Local inference without monitoring is just guessing. We collect three metrics:

1. **Queue depth and wait time** from Hermes subagent dispatch.
2. **GPU utilization and VRAM** from `rocm-smi`.
3. **Token throughput** from Ollama's `/api/ps` and per-call logs.

A simple probe script:

```bash
#!/bin/bash
# ~/.local/bin/rocm-ollama-probe.sh
echo "=== rocm-smi ==="
rocm-smi --showmeminfo --showuse \
  | awk '/GPU/{print} /Total/{print}'

echo "=== ollama ps ==="
curl -s http://127.0.0.1:11434/api/ps \
  | python3 -c "import sys,json; d=json.load(sys.stdin); [print(f\"{m['name']}: {m.get('size_vram',0)//(1024**3)} GB VRAM\") for m in d.get('models',[])]"

echo "=== hermes subagent queue ==="
curl -s http://127.0.0.1:8642/v1/metrics \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('active:', d.get('subagent_active',0), 'queued:', d.get('subagent_queued',0))"
```

Run it on a 30-second cadence from cron or a small systemd timer. The numbers tell you whether to add hardware, drop a model, or tighten the concurrency limit. They also tell you whether the router is falling back too often — a high cloud fallback rate means your local capacity is undersized.

---

## 9. Decision Tree: Local or Cloud?

```
Is the task time-critical (< 5 s end-to-end)?
  ├─ Yes → Can the local model meet the deadline?
  │         ├─ Yes  → local
  │         └─ No   → cloud fallback
  └─ No  → Is the context within local model budget?
            ├─ No  → cloud fallback
            ├─ Yes → Is local VRAM available?
            │         ├─ No  → queue or cloud fallback
            │         └─ Yes → local
            └─ Maybe → queue with short timeout; fallback on miss
```

The timeout is what makes this safe. A local call that does not return in time is not a moral victory. It is a failed SLO. Fall back, log it, and tune later.

---

## 10. What Still Breaks

I want to be honest about the limits.

- **ROCm model coverage lags CUDA.** Newly released models may need a week or two to get a working Ollama tag. We keep one cloud fallback per role precisely for this window.
- **Multi-GPU ROCm can be finicky.** `rocm-smi` may show both GPUs but Ollama may only load on one. The fix is usually `HIP_VISIBLE_DEVICES` and a separate Ollama instance per GPU, which complicates the router.
- **Context windows are smaller locally.** A 70B Q4 model can handle 32k context but not 128k. If a subagent needs a long context, it goes cloud or it gets chunked.
- **Quantization hurts some tasks.** Coding validation with Q4 is visibly worse than fp16 for subtle bugs. We use local coding for breadth and cloud coding for depth.

These are not reasons to abandon local inference. They are reasons to keep a fallback and keep measuring.

---

## 11. Cost and Latency Comparison

Real numbers from our stack over a week of SMF Predict runs:

| Path | Median latency | 95th percentile | Cost per 1M tokens (in/100k, out/50k) |
|------|----------------|-----------------|---------------------------------------|
| Local Ollama qwen3.6:27b-q4 | 320 ms | 1.2 s | ~$0.02 (electricity) |
| Local Ollama llama3.3:70b-q4 | 890 ms | 4.1 s | ~$0.04 (electricity) |
| Cloud Claude Sonnet 4 | 1.1 s | 8.5 s | ~$5.00 |
| Cloud GPT-4.1 mini | 600 ms | 3.2 s | ~$0.65 |

The cloud costs assume output-heavy subagent calls. Local costs assume a 400W dual-GPU server and commercial electricity rates. The point is not the exact dollar figures. The point is that local is one to two orders of magnitude cheaper for the bulk of the work, and its latency distribution is tighter when the queue is shallow.

---

## 12. Summary

Running Hermes subagents on local AMD hardware is not a stunt. It is a production choice with a clear trade-off matrix:

1. **Use ROCm + Ollama** as the default inference backend for agent work.
2. **Keep two loaded models** if your VRAM allows, to cut cold-start latency.
3. **Use a deterministic router** to choose local vs. cloud based on token budget, queue depth, VRAM, and deadline.
4. **Cap subagent concurrency** to match GPU parallelism.
5. **Monitor queue depth and `rocm-smi` relentlessly** — local is cheaper only when it is not overloaded.
6. **Always have a cloud fallback** with a time-bound retry.

The result is a system that stays cheap under load, degrades gracefully, and keeps us honest about what local hardware can and cannot do. That honesty is what lets us ship.

---

*If you are running Hermes or any agent stack on AMD GPUs, I would like to hear what models and quantization settings you have landed on. The local-AMD corner of the ecosystem still has a lot of undocumented edges, and the best configs are usually buried in issue threads.*
