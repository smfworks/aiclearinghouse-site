---
slug: inkling
title: "Inkling"
excerpt: "Thinking Machines Lab's first open-weights model — a 975B MoE multimodal model with 1M context, native audio/image input, and strong agentic coding benchmarks at mid-tier pricing."
category: "Thinking Machines Lab"
tags: ["reasoning", "coding", "open-weight", "agents", "multimodal", "long-context"]
provider: "Thinking Machines Lab"
input_price: 1.87
output_price: 4.68
context_window: 1000000
mmlu: 87.2
humaneval: 77.6
arena: "Top-tier open-weight"
image: "/images/agentmarketplace/llm-hero.svg"
order: 15
last_verified: "2026-07-29"
---

# Inkling

Inkling is the first production model from Thinking Machines Lab (Mira Murati's startup), released July 15, 2026. It is a Mixture-of-Experts transformer with 975B total parameters and 41B active per token, pretrained on 45 trillion tokens of text, images, audio, and video. The open-weights release under Apache 2.0 makes it the largest openly available U.S.-trained model as of July 2026.

## Pricing

- Tinker API (64K context): $1.87 / 1M input, $4.68 / 1M output (with 50% launch discount applied)
- Tinker API (256K context): $3.74 / 1M input, $9.36 / 1M output
- Cached input: $0.374 / 1M tokens (64K context)
- OpenRouter: ~$1.00 / $4.05 per 1M tokens
- Self-host: weights available on HuggingFace (FP8 and NVFP4 checkpoints for Blackwell GPUs), no per-token cost

> Pricing from Thinking Machines' Tinker documentation and OpenRouter as of July 2026. The 50% launch discount may expire — verify current pricing on the Tinker platform.

## Benchmarks

- HLE (text only): 29.7% — behind frontier models like GPT-5.6 Sol (47.2%) and Claude Fable 5 (44.7%)
- HLE (with tools): 46.0% — competitive with Kimi K2.5 (50.2%) and GLM-5.2 (54.7%)
- AIME 2026: 97.1% — strong math reasoning
- GPQA Diamond: 87.2% — strong science reasoning
- SWE-Bench Verified: 77.6% — strong agentic coding, though behind Claude (95.0%) and GPT-5.6 (80.6%)
- Terminal Bench 2.1: 63.8% — solid but not leading
- FORTRESS (adversarial safety): 78.0% — mid-pack among frontier models

> Benchmark numbers from Thinking Machines' model card and HuggingFace blog. Results vary by evaluation harness and prompt format. Test on your own tasks.

## Key capabilities

- **1M context window** on open weights — the largest available open-weight context window as of release
- **Native multimodal** — accepts text, image, and audio inputs natively, not via a separate encoder bolt-on
- **Strong agentic coding** — SWE-Bench Verified at 77.6% puts it in the upper tier of open-weight coding models
- **Token efficiency** — averages 25K output tokens per Intelligence Index task vs 43K for GLM-5.2, 38K for Kimi K2.6, meaning lower real costs per task than raw per-token pricing suggests
- **Apache 2.0 license** — full commercial use, fine-tuning, and redistribution
- **Effort control** — system message can adjust reasoning effort level, letting you trade latency/cost for quality per request

## Limitations

- **Not frontier-class** — Inkling trails GPT-5.6 Sol and Claude Fable 5 on reasoning benchmarks by 15-20 points on HLE. It is strong for an open-weight model, not strong overall.
- **Tinker API context capped at 256K** — the full 1M context is only available via self-hosted weights; the managed API truncates to 256K
- **Self-hosting is expensive** — 975B parameters requires multi-GPU infrastructure. FP8 checkpoint fits on 8x H200 but that is not a consumer setup. NVFP4 for Blackwell helps but requires RTX 50-series or DGX Spark hardware
- **Young ecosystem** — first model from a new lab. Community fine-tunes, quantized variants, and third-party integrations are still emerging. Expect gaps in tooling compatibility
- **No published MMLU score** in the official model card — the 87.2 GPQA Diamond score is the closest available science reasoning proxy
- **Inkling-Small is preview-only** — the lighter 12B-active variant was announced alongside Inkling but is not yet production-ready

## When to pick it

Choose Inkling when you want an open-weight model with strong coding performance and a massive context window for RAG or document-heavy agent workflows, and you have the infrastructure to self-host (or are willing to use the Tinker API). For frontier-class reasoning, GPT-5.6 Sol and Claude Fable 5 remain clearly ahead. For cost-sensitive API use, GLM-5.2 and Hy3 offer similar or better pricing. For local deployment on a single GPU, Qwen3.6-27B is the better choice — Inkling's 41B active params and 975B total make it impractical on consumer hardware.