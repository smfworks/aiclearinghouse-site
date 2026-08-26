---
{
  "slug": "ibm-granite-4-2-30b",
  "title": "IBM Granite 4.2 30B",
  "excerpt": "IBM's first reasoning-native Granite model — 30B dense decoder-only with a switchable thinking mode, agentic RL training, and 57% on SWE-bench Verified. Apache 2.0, 128K native context, 12 languages.",
  "category": "IBM",
  "tags": ["reasoning", "coding", "agents", "open-weight", "enterprise", "tool-calling"],
  "provider": "IBM",
  "input_price": 0.0,
  "output_price": 0.0,
  "context_window": 128000,
  "mmlu": 77.6,
  "humaneval": 75.77,
  "arena": "Mid-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-08-26"
}
---

# IBM Granite 4.2 30B

## Overview

IBM released Granite 4.2 on August 25, 2026 — the first Granite generation with native reasoning capabilities. The 30B flagship is a dense, decoder-only transformer with a built-in thinking mode that can be toggled between full reasoning, non-thinking, and low-effort on a per-query basis. That flexibility lets you trade latency for depth without switching models.

What sets Granite 4.2 apart is its training trajectory. After supervised fine-tuning, the 8B and 30B models went through a specialized "agentic RL" phase using reinforcement learning inside real software-engineering, terminal, and web-search environments. IBM trained on 1 trillion tokens of synthetic code generated through its CodeAlchemy pipeline, plus a mid-training step that unlocked additional reasoning power. The result is an open-weight model that posts 57% on SWE-bench Verified — competitive with closed models several times its size.

Everything ships under Apache 2.0 with no usage restrictions. Weights are available on Hugging Face, Ollama, and GitHub. The full training recipe, data-mixture proportions, and per-stage hyperparameters are published alongside the model — a level of transparency unusual for a commercial-grade release.

## Key Specifications

- **Parameters**: 30B dense (decoder-only)
- **Context**: 131,072 tokens native, extendable to 512K
- **Architecture**: 64 layers, 4096 embedding dim, 32 attention heads, 8 KV heads, RoPE, SwiGLU MLP
- **Precision**: bfloat16 (quantized variants available)
- **Languages**: 12 tested — English, German, Spanish, French, Japanese, Portuguese, Arabic, Czech, Italian, Korean, Dutch, Chinese
- **License**: Apache 2.0

## Benchmarks

| Benchmark | Granite 4.2 30B |
|-----------|----------------|
| SWE-bench Verified | 57.00 |
| Terminal-Bench 2.1 | 29.24 |
| BFCL v4 | 61.39 |
| AIME25 | 89.17 |
| GPQA | 66.41 |
| MMLU-Pro | 77.60 |
| Arena-Hard-V2 | 67.93 |
| LiveCodeBench v6 | 75.77 |
| RULER 128K | 81.38 |

All figures are IBM-reported, run on the NeMo Evaluator SDK. No independent third-party reproduction yet. Treat as vendor-reported until confirmed.

## Thinking Modes

The model exposes three modes from a single checkpoint:

- **Full thinking** (default): Step-by-step chain-of-thought reasoning before the final answer. Best for math, coding, multi-step logic.
- **Non-thinking**: Direct output without reasoning trace. Lowest latency.
- **Low-effort**: Brief reasoning, middle ground between full and none.

Recommended sampling: `temperature=1.0`, `top_p=0.95`, `max_new_tokens=8192` (thinking) or `2048` (non-thinking).

## When to use it

- **Enterprise agent deployments** where Apache 2.0 and a documented training story matter for compliance
- **Scoped internal automation** where a 30B model fits your serving budget but a frontier model does not
- **Tool-calling workflows** — BFCL v4 at 61.39 and τ³-bench at 62.00 show solid function-use capability
- **Multilingual teams** — 12 tested languages including Dutch, Korean, and Arabic

## When to look elsewhere

- **Frontier reasoning tasks** — GPQA at 66.41 trails closed models by 15+ points
- **If you need a hosted API** — no provider lists per-token pricing yet; self-hosting only
- **Maximum context** — 128K native is solid but not competitive with GLM-5.2's 1M or DeepSeek V4-Pro's 1M

## Getting started

```bash
# Ollama
ollama pull granite-4.2:30b

# Hugging Face
git clone https://huggingface.co/ibm-granite/granite-4.2-30b

# vLLM or SGLang for production serving
```

IBM published a full SGLang deployment cookbook with Docker configurations, H200/B200 launch matrices, and thinking-mode examples.