---
slug: "profile-based-model-routing-hermes-linux"
title: "Profile-Based Model Routing in Hermes: Local First, Cloud When It Counts"
excerpt: "Hermes agents can switch LLM backends per task without rewriting prompts or rebuilding state. Here is how I use profile-specific provider routing on Linux to keep code generation local on AMD ROCm, burst to cloud for large-context reasoning, and avoid the trap of shipping everything to the cheapest API."
date: "2026-06-25"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Linux", "AMD", "Local LLMs", "Agent Architecture"]
tags: ["hermes", "ollama", "rocm", "model-routing", "profiles", "agent-architecture", "linux"]
readTime: 12
image: "/images/blog/profile-based-model-routing-hermes-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/profile-based-model-routing-hermes-linux"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

## 1. The Problem: One Agent, Many Backends

Running an agent like Hermes on a single model provider is simple until it isn't. Local models are fast, private, and cheap per token, but they lack context length and frontier reasoning. Cloud models reach 200K+ tokens and strong vision, yet they cost money, add latency, and can leak context. Most teams pick one provider and then hack around its limitations.

There is a better pattern: **profile-based model routing**. Hermes can switch provider, model, and context strategy per request or per subagent, using the same prompt format and the same conversation state. The decision is made by the parent agent — or by a small routing layer inside the profile — based on the task at hand.

This post is the architecture and the config I use daily on a Linux AMD box. It covers:

- Why model routing belongs in the agent profile, not the application layer
- The three-tier routing scheme: local, cloud-burst, and fallback
- Concrete Hermes config for ROCm/llama.cpp local serving + OpenRouter cloud burst
- Decision tree for choosing a backend per task
- Cost and latency numbers from a real machine
- Common failure modes and how to recover

I assume you already have Hermes installed and understand the difference between a model provider and a model name. If not, start with the [Hermes Agent docs](https://hermes-agent.nousresearch.com/docs/).

---

## 2. Reference Architecture

The goal is to keep the agent's working memory in one place while the inference backend changes underneath it. Hermes does this through provider-agnostic chat completions: the same message list, the same tool schemas, the same system prompt can be sent to Ollama, llama.cpp, OpenRouter, Together, or Anthropic with only config changes.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Hermes Agent (parent)                         │
│  · receives task                                                     │
│  · classifies: local / burst / fallback                               │
│  · routes to profile-specific backend                                 │
└───────────────────────┬─────────────────────────────────────────────┘
                        │ same prompt / messages / tools
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────────┐
│ local profile │ │ burst profile │ │ fallback profile  │
│ · ollama      │ │ · openrouter  │ │ · same as burst   │
│ · llama.cpp   │ │ · together    │ │   with cheap model│
│ · ROCm GPU    │ │ · anthropic   │ │                   │
└───────┬───────┘ └───────┬───────┘ └─────────┬─────────┘
        │                 │                     │
        ▼                 ▼                     ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────────┐
│ local server  │ │ cloud API     │ │ cloud API         │
│ :8080 / :11434│ │ /v1/chat/... │ │ cheap model       │
└───────────────┘ └───────────────┘ └───────────────────┘
```

Key insight: the routing decision is made **before** the chat request. Once Hermes starts a turn with a provider, that turn stays with that provider. If you want to mix backends inside one reasoning chain, delegate to a subagent on the other provider and pull the summary back.

---

## 3. Why Profiles Beat In-Code Switching

There are three common ways to route models:

1. **Hard-coded in the application** — `if long_context: use_openrouter()`. Fast to write, painful to maintain, impossible to tune without deploys.
2. **Environment variables** — `MODEL_PROVIDER=ollama`. Better, but still global; one process, one backend.
3. **Hermes profiles** — per-task provider + model + context + toolset. No code changes, no redeploy, easy A/B testing.

Hermes profiles live in `~/.hermes/profiles/<name>/` and inherit the global config unless overridden. That means you can keep your global toolsets and memory settings, but change only the model layer. A profile is the right granularity because it matches the unit of delegation: parent, research subagent, code subagent, cheap fallback each get a profile.

Example profile layout:

```
~/.hermes/profiles/
├── default/              # your daily driver
├── liam/                 # engineering work (this session)
├── coding-local/         # ROCm/llama.cpp for fast code edits
├── coding-burst/         # strong cloud model for large refactors
└── review-cheap/         # tiny cloud model for lint/summary tasks
```

Each profile has its own `config.yaml` and `.env`. The `.env` holds provider keys; the `config.yaml` holds model defaults.

---

## 4. Local Tier: ROCm + llama-server

My local machine is the AMD Ryzen AI MAX+ 395 with Radeon 8060S integrated GPU (gfx1151) and 96 GiB unified RAM. ROCm 7.2.4 is installed at `/opt/rocm-7.2.4/` and `hipconfig` reports `HIP_PLATFORM=amd`.

I run a local llama-server with a quantized MoE model for fast code generation. The relevant command:

```bash
#!/usr/bin/env bash
# ~/bin/llama-local.sh
export HIP_VISIBLE_DEVICES=0
export GGML_HIP_ENABLE=1
export ROCM_PATH=/opt/rocm-7.2.4

/opt/llama.cpp-rocm/bin/llama-server \
  -m ~/.models/gemma-4-26b-q4_0.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  -c 8192 \
  -n 4096 \
  --threads 32 \
  --slots 4 \
  --mlock \
  --gpu-layers 999
```

Notes:

- `--gpu-layers 999` offloads as many layers as fit. On a 48 GiB allocatable iGPU, gemma-4-26B Q4_0 uses ~37.9 GiB and runs at **62 tok/s** generation.
- `--slots 4` lets multiple requests share the same model weight copy. Useful when parent and subagents both hit the local server.
- `--mlock` prevents the OS from swapping the model out during long context windows.

Then the Hermes profile for local coding:

```yaml
# ~/.hermes/profiles/coding-local/config.yaml
model:
  provider: openai
  base_url: http://127.0.0.1:8080/v1
  api_key: "not-needed"
  default: "gemma-4-26b-q4_0"
  context_length: 8192
agent:
  max_turns: 90
  tool_use_enforcement: true
terminal:
  backend: local
  timeout: 180
```

The provider is `openai` because llama-server exposes an OpenAI-compatible `/v1/chat/completions` endpoint. The `api_key` can be any non-empty string; llama-server does not validate it.

---

## 5. Cloud-Burst Tier: OpenRouter with Model Fallbacks

For tasks the local model cannot handle — long context, strong reasoning, vision, or large refactors — I use a cloud-burst profile. I prefer OpenRouter because it aggregates many providers and exposes a single endpoint, which means I can switch models without changing base URL.

```yaml
# ~/.hermes/profiles/coding-burst/config.yaml
model:
  provider: openrouter
  api_key: "${OPENROUTER_API_KEY}"
  default: "anthropic/claude-sonnet-4"
  context_length: 200000
  # optional routing preferences
  openrouter:
    sort: "throughput"
    allow_fallbacks: true
agent:
  max_turns: 120
  tool_use_enforcement: true
terminal:
  backend: local
  timeout: 300
```

And the `.env`:

```bash
# ~/.hermes/profiles/coding-burst/.env
OPENROUTER_API_KEY=sk-or-v1-...
```

`max_turns` is higher for cloud profiles because long-context tasks often need more iterations. `timeout` is longer because cloud API latency varies.

---

## 6. The Routing Decision Tree

Here is the exact decision logic I use before dispatching a task. It is simple enough to embed in a skill or in the parent prompt:

| Condition | Route | Profile | Why |
|---|---|---|---|
| File reads < 20 files, edits < 200 lines, no vision | local | `coding-local` | Cheap, fast, no data leaves machine |
| Large refactor, > 50 files, architecture change | cloud burst | `coding-burst` | Stronger context tracking, fewer errors |
| Long context > 8K tokens or > 100K chars | cloud burst | `coding-burst` | Local model truncates at 8K |
| Vision task (screenshot, diagram, PDF image) | cloud burst | `coding-burst` | Local stack lacks vision model |
| Security review or external API design | cloud burst | `coding-burst` | Frontier reasoning reduces misses |
| Lint, summarize, repetitive small edits | cheap cloud | `review-cheap` | Faster and cheaper than local context churn |
| Network down or key exhausted | fallback | `coding-local` | Graceful degradation |

The important part is that the parent agent classifies the task **once**, then dispatches to the right profile. If classification is wrong, the subagent can ask to be retried on a different profile — but the retry is explicit, not hidden inside a retry loop.

---

## 7. Implementing Routing with Subagent Delegation

Hermes has a `delegate_task` tool that spawns a subagent with its own profile. This is how I turn the decision tree into code:

```python
# inside a skill or parent prompt, pseudo-tool call
delegate_task(
  goal="Refactor the auth middleware to use JWT claims and add tests",
  context="Files: src/auth.py, tests/test_auth.py. Keep bcrypt dependency. Add edge cases for expired tokens.",
  toolsets=["terminal", "file"],
  profile="coding-burst",   # <-- Hermes will spawn the subagent with this profile
  max_turns=60
)
```

The subagent inherits the profile's `config.yaml` and `.env`, so it naturally uses the cloud model. The parent stays on the local model. When the subagent finishes, only its summary is pulled back, preserving parent context.

For tasks that are borderline, I run a **two-stage** delegation:

1. `review-cheap` profile reads the files and estimates complexity.
2. Parent then re-dispatches to `coding-burst` if complexity is high, or keeps it local.

This avoids wasting expensive cloud context on trivial edits.

---

## 8. Cost and Latency Numbers

All numbers are from the AMD 8060S machine described above and OpenRouter on a fast internet connection. Your numbers will differ, but the ratios matter more than the absolute values.

| Backend | Model | Latency (TTFB) | Throughput | Cost / 1M tokens (input+output) |
|---|---|---|---|---|
| Local ROCm | gemma-4-26B Q4_0 | ~80 ms | **62 tok/s** | $0 (power only) |
| Local ROCm + MTP | gemma-4-26B Q4_0 | ~80 ms | **~100 tok/s** | $0 |
| Ollama cloud | kimi-k2.7-code | ~500 ms | varies | ~$3–6 |
| OpenRouter | claude-sonnet-4 | ~1.2 s | ~30 tok/s | ~$6–12 |
| OpenRouter | deepseek-v4-pro | ~800 ms | ~25 tok/s | ~$2–4 |

For a coding task that consumes 10K input tokens and produces 3K output tokens:

- Local: 13K tokens / 62 tok/s ≈ **210 seconds**, $0.
- Claude Sonnet 4: 13K tokens / 30 tok/s ≈ **430 seconds**, ~$0.10–0.15.
- DeepSeek V4 Pro: 13K tokens / 25 tok/s ≈ **520 seconds**, ~$0.03–0.05.

Local is not always faster — TTFB is lower, but small models can stall on hard reasoning. Cloud is not always more expensive if it finishes the task in fewer turns. The routing layer exists because the cheapest+fastest choice is task-dependent.

---

## 9. Failure Modes and Recovery

### 9.1 Local server is offline or model swapped

Hermes returns an HTTP error from the local endpoint. The recovery is to fallback to the cloud profile for that turn:

```yaml
# fallback rule in skill prompt
If llama-server at 127.0.0.1:8080 returns 502/503/connection refused,
retry the same request using the coding-burst profile once.
```

### 9.2 Cloud key exhausted or rate limited

Track provider exhaustion in `~/.hermes/auth.json`. If OpenRouter returns 429, switch to a secondary provider configured in the same profile:

```yaml
model:
  provider: openrouter
  fallback_providers:
    - provider: together
      model: "deepseek-ai/deepseek-v4-pro"
```

Hermes does not auto-fallback across providers today unless configured; set it explicitly.

### 9.3 Model hallucinates tool names

Local models are more likely to emit bad tool calls than frontier models. If a local subagent fails tool validation repeatedly, promote the task to cloud burst rather than retrying the same model.

### 9.4 Context too long for local model

If the prompt exceeds the local `context_length`, Hermes will get an error from llama-server. The fix is not to truncate silently; it is to route the task to the profile with a larger context window and summarize the local files first.

---

## 10. Recommended Minimum Config

For a team that wants to replicate this:

1. **Linux host with an AMD GPU or APU**, ROCm 7.2+ installed, `hipconfig` reporting `HIP_PLATFORM=amd`.
2. **llama.cpp ROCm build** exposing an OpenAI-compatible server on `127.0.0.1:8080`.
3. **At least one quantized MoE or small dense model** that fits in GPU memory. gemma-4-26B Q4_0 at 13.4 GB is a practical minimum on a 48 GiB allocatable iGPU.
4. **Two Hermes profiles**: `coding-local` and `coding-burst` (or `default` + `burst`).
5. **A cloud provider key** for fallback and long-context work. OpenRouter, Together, or Anthropic each work.
6. **A routing rule** — even a simple one — written down in a skill so the agent applies it consistently.

---

## 11. Conclusion

Profile-based model routing is not about having more models. It is about matching the model to the task without rebuilding your agent pipeline every time. On a Linux AMD machine, the local tier is now good enough for most code edits. The cloud tier remains essential for frontier reasoning, vision, and long context. The winning setup uses both, chosen explicitly, with failure fallbacks.

The next step is to turn the decision tree into a reusable Hermes skill so every subagent dispatch automatically picks the right backend. That skill will live in the SMF Clearinghouse repository and will be published separately.

---

*Questions or corrections? Reach out through [SMF Works](https://www.smfworks.com) or the [Clearinghouse contact page](https://www.smfclearinghouse.com/contact).*
