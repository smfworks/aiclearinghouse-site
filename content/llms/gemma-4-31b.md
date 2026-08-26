---
{
  "slug": "gemma-4-31b",
  "title": "Gemma 4 31B",
  "excerpt": "Google DeepMind's most capable open-weight model — 31B dense with 262K context, native multimodal, built-in reasoning, and aggressive provider competition driving prices to $0.08/M input.",
  "category": "Google DeepMind",
  "tags": ["reasoning", "multimodal", "open-weights", "code", "long-context"],
  "provider": "Google DeepMind",
  "input_price": 0.08,
  "output_price": 0.34,
  "context_window": 262144,
  "mmlu": 85.2,
  "humaneval": 80.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 17,
  "last_verified": "2026-08-26"
}
---

# Gemma 4 31B

Google DeepMind's flagship open-weight model family, released March 31, 2026 under Apache 2.0. The 31B dense variant is the largest in the Gemma 4 family, which also includes a 26B MoE (A4B, 3.8B active parameters), a 12B Unified multimodal, and edge models (E4B, E2B). Built from Gemini research but released openly for community use, modification, and commercial deployment.

## Pricing

- Input: $0.08 / 1M tokens (Google AI Studio, cheapest provider)
- Output: $0.34 / 1M tokens
- Cached input: $0.01 / 1M tokens
- Context window: 262,144 tokens
- Available from 19+ providers; input prices range from $0.08 to $0.99/M

> Pricing verified via pricepertoken.com and DeepInfra pricing pages. The 26B MoE variant is even cheaper at $0.07/M input via DeepInfra. Self-hosting is free under Apache 2.0. Last updated 2026-08-26.

## Benchmarks

| Benchmark | Gemma 4 31B | Gemma 4 26B A4B (MoE) | Gemma 3 27B (prev gen) |
|-----------|-------------|------------------------|------------------------|
| MMLU Pro | 85.2% | 82.6% | 67.6% |
| AIME 2026 (no tools) | 89.2% | 88.3% | 20.8% |
| LiveCodeBench v6 | 80.0% | 77.1% | 29.1% |
| Codeforces ELO | 2,150 | 1,718 | 110 |
| GPQA Diamond | 84.3% | 82.3% | 42.4% |

> Benchmarks sourced from Google's official model card and VentureBeat coverage. The generational leap over Gemma 3 is the largest single-generation improvement for any open model on record — Codeforces ELO jumped from 110 to 2,150. Last verified 2026-08-26.

## Key capabilities

- **262K context window** — long enough for repository-scale coding agents and large document analysis.
- **Native multimodal** — text, image, video, and audio (in the 12B Unified variant). Vision understanding is built in, not bolted on.
- **Built-in reasoning (thinking mode)** — the model can engage extended reasoning for complex problems. This is what drives the AIME 2026 jump from 20.8% to 89.2%.
- **MTP drafters** — Multi-Token Prediction drafters deliver up to 3x faster inference with identical output quality when supported by the serving infrastructure.
- **Native function calling** — tool-use and agent workflows supported out of the box.
- **Apache 2.0 license** — clean licensing for commercial use, modification, and redistribution. No usage restrictions or commercial clauses.
- **140+ language support** — broad multilingual coverage.
- **Five model sizes** — from E2B (2B, runs on phones) to 31B dense (workstation GPU), letting you match model size to hardware.

## Limitations

- **31B dense requires serious hardware.** The 31B model needs approximately 24GB+ VRAM for Q4 quantization. The 26B MoE is more practical for single-GPU deployment with only 3.8B active parameters. The edge models (E2B, E4B) are the right choice for constrained hardware.
- **Not a frontier-class model.** Gemma 4 competes with models many times its size but does not match GPT-5.5 or Claude 4 Opus on the hardest reasoning tasks. It is the best open-weight model in its size class, not the best model overall.
- **MTP acceleration requires infrastructure support.** The 3x inference speedup from MTP drafters is not automatic — your serving framework must support speculative decoding with the drafter. Many providers do not yet expose this.
- **Thinking mode increases latency.** The reasoning mode that produces the strong AIME scores adds inference time. For latency-sensitive applications, you may want to disable thinking or use the MoE variant.
- **Provider pricing varies wildly.** The same model costs $0.08/M input on Google AI Studio and up to $0.99/M on other providers. Always check multiple providers before committing. The 33% price drop over the past 90 days suggests pricing is still settling.
- **Open-weight ecosystem maturity.** While the model is strong, the fine-tuning ecosystem, tooling, and community quantizations are younger than Llama's or Qwen's. Expect more rough edges in the deployment path.