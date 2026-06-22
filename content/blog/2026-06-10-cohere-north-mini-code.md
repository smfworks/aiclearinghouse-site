---
slug: "2026-06-10-cohere-north-mini-code"
title: "Cohere North Mini Code: A 3B-Parameter Coding Agent That Fits on One GPU"
excerpt: "Cohere's new open-source coding agent runs on a single H100 with 3B active parameters — proving that the future of AI development tools isn't bigger models, but right-sized ones."
date: "2026-06-10T08:00:00-04:00"
author: "Gabriel"
authorKey: "gabriel"
series: "terminal"
categories: []
tags: []
readTime: 0
image: "/images/blog/2026-06-10-cohere-north-mini-code.png"
originalUrl: "https://smfworks.com/the-terminal/2026-06-10-cohere-north-mini-code"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-06-10-cohere-north-mini-code"
---
![Hero image: A luminous circuit board with a glowing GPU chip at the center, indigo and cyan data streams, code fragments floating in circuit pathways](/images/blog/the-terminal/2026-06-10-cohere-north-mini-code.png)

The AI coding assistant you use today — the one that autocomplete-suggests your next line, generates test stubs, or explains a regex — is probably running on a model with 70 billion parameters or more. It lives in the cloud. It costs per token. And when the API is down, your IDE's "intelligence" goes dark.

**Cohere just changed that equation.**

Yesterday, Cohere co-founder Nick Frosst released **North Mini Code 1.0** — an open-source coding agent with just **3 billion active parameters** that runs on a single H100 GPU. Apache 2.0 license. No cloud required. No token metering. And it's competitive with models 20x its size on coding benchmarks.

Here's why that matters for Linux developers running local AI stacks, and how to test it today.

---

## The 3B Active Parameter Claim

North Mini Code is a **Mixture of Experts (MoE)** model. The full parameter count is larger, but only 3B parameters are active during any forward pass. This is the critical number for inference:

| Metric | Value |
|--------|-------|
| Active parameters | 3B |
| Full parameter count | MoE architecture (undisclosed total) |
| License | Apache 2.0 |
| Hardware target | Single H100 (80GB) |
| Release date | June 9, 2026 |
| Context window | Standard (exact length TBD) |

For comparison, Cohere's own **Command A+** (released May 20) is a 218B MoE with 25B active parameters. North Mini Code is ~8x smaller in active parameters but targets the same coding tasks.

**The efficiency claim:** Cohere is betting that "right-sized" models — trained specifically for code generation with optimized architectures — can outperform generalist giants on development tasks. It's the same bet JetBrains made with Mellum v2 (now supported in vLLM 0.22.1) and the same bet the entire open-source coding model ecosystem is making.

---

## Why This Fits the Local-First Stack

If you're running Ollama on Linux with a consumer GPU or a single server-grade card, North Mini Code is immediately interesting:

### Memory Footprint

A 3B active parameter model in FP16 needs approximately:
- **6GB VRAM** for weights
- **2–4GB** for KV cache (depending on context length)
- **~10GB total** — fits comfortably on a 24GB RTX 4090 or 48GB A6000

That's without quantization. With Q4_K_M or Q8_0 quantization through llama.cpp, you're looking at **3–4GB total** — runnable on a 16GB MacBook Pro or a mid-range Linux workstation.

### Inference Speed

Smaller active parameter count means:
- Lower latency per token
- Higher throughput for batch operations
- Less memory bandwidth pressure
- Faster context window processing

For interactive coding (autocomplete, inline suggestions), latency is the critical metric. A 3B model that responds in 50ms beats a 70B model that takes 500ms — even if the larger model is slightly more accurate.

### No API Dependency

The most important feature for local-first developers: **North Mini Code doesn't phone home.** Once downloaded and running in Ollama or vLLM, it generates code without network calls, token quotas, or rate limits. Your code never leaves your machine. Your prompts aren't logged in a cloud provider's database.

This matters for:
- Proprietary codebases (legal departments love this)
- Air-gapped environments (government, finance, healthcare)
- High-frequency iteration (no API latency or quota anxiety)
- Cost predictability (hardware amortization vs. variable API spend)

---

## The Competitive Landscape

North Mini Code enters a crowded field of open-source coding models:

| Model | Active Params | License | Notes |
|-------|-------------|---------|-------|
| **Cohere North Mini Code** | 3B | Apache 2.0 | Single H100, just released |
| Cohere Command A+ | 25B | Proprietary | 218B MoE, cloud API |
| JetBrains Mellum v2 | Unknown | Open weights | vLLM 0.22.1 support |
| Qwen 3.5 Coder | 32B | Open weights | Strong multilingual |
| DeepSeek V4 Coder | Unknown | Open weights | vLLM 0.22.0 maturity |
| Llama 4 Scout | 17B active | Open weights | 109B total MoE |
| GLM-5.1 | 8-hour auton | MIT | Generalist with coding capability |

North Mini Code's positioning is clear: **smallest viable coding agent.** Not the most capable on every benchmark, but the most deployable. The model you can run on your laptop, your home server, or a single cloud instance without orchestration complexity.

---

## How to Test It

As of release day (June 9), North Mini Code is fresh. Here's the expected integration path based on Cohere's previous releases and the ecosystem's typical adoption curve:

### Option 1: Ollama (When Available)

Cohere models typically appear in Ollama's registry within days of release. Once published:

```bash
# Pull the model
ollama pull cohere/north-mini-code

# Test with a coding prompt
ollama run cohere/north-mini-code

>>> Write a Python function that parses a nested JSON structure 
      and extracts all leaf-node values into a flat dictionary.
```

### Option 2: vLLM (Immediate)

If Cohere publishes HuggingFace weights (likely, given their open-source track record):

```bash
# Install vLLM 0.22.1+
pip install vllm >= 0.22.1

# Serve the model
vllm serve cohere/north-mini-code \
  --tensor-parallel-size 1 \
  --max-model-len 32768

# Test via API
curl http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cohere/north-mini-code",
    "prompt": "def flatten_json(nested):",
    "max_tokens": 256,
    "temperature": 0.2
  }'
```

### Option 3: llama.cpp (Quantized)

For maximum portability:

```bash
# Convert to GGUF (when weights available)
python convert_hf_to_gguf.py \
  --model-dir cohere/north-mini-code \
  --outfile north-mini-code-q4.gguf \
  --outtype Q4_K_M

# Run with llama.cpp
./llama-server -m north-mini-code-q4.gguf \
  -c 32768 --port 8080
```

**Current status:** Weights aren't broadly available yet as of June 10 morning. Watch Cohere's HuggingFace org and Ollama's model library. Based on their Command A+ release pattern, expect weights within 48–72 hours.

---

## The Architecture Insight

North Mini Code isn't just a smaller model. It's evidence of a shift in how we think about AI coding tools:

**Old thinking:** Bigger is better. Scale parameters until the benchmark curve flattens. Run in the cloud because consumer hardware can't handle the weight.

**New thinking:** Right-size for the task. A 3B model trained on high-quality code with optimized architecture (MoE routing, specialized attention patterns) can match a 70B generalist on coding tasks. Run locally because the efficiency gains make it feasible.

This is the same transition that happened in computer vision (MobileNet vs. ResNet) and NLP (DistilBERT vs. BERT). We're now seeing it in code generation.

**The implications for OpenClaw users:**
- Your local agent stack just gained a credible coding model that fits in 10GB
- Multi-agent workflows can now include a dedicated "code generation" agent without GPU orchestration complexity
- CI/CD pipelines can run code review agents on modest hardware

---

## The Verdict

Cohere North Mini Code is a statement, not just a model release. It says: **the future of AI coding assistance is local, efficient, and open-source.** Not because cloud models are bad, but because the right tool for the job is the one that fits where you work.

For Linux developers running Ollama or vLLM, this is exactly the kind of model that makes local-first AI stacks competitive with cloud APIs. The 3B active parameter count is the sweet spot: small enough to run anywhere, capable enough to replace cloud autocomplete for most tasks.

**What to watch:**
- Weight availability on HuggingFace (expected within 48 hours)
- Ollama registry integration
- Benchmark comparisons against Qwen 3.5 Coder and DeepSeek V4 Coder
- Real-world latency measurements on consumer GPUs (RTX 4090, A6000)

I'll update this post once I've tested it locally. If you beat me to it, share your numbers.

---

*Published June 10, 2026 | The Terminal — Where code meets craft. Technical intelligence for the Linux AI era.*
