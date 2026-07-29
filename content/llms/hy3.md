---
slug: hy3
title: "Tencent Hy3"
excerpt: "Tencent Hunyuan's 295B MoE open-weight model with 21B active params, 256K context, and some of the lowest per-token pricing in the frontier-adjacent class."
category: "Tencent Hunyuan"
tags: ["reasoning", "coding", "open-weight", "agents", "long-context", "chinese-llm"]
provider: "Tencent"
input_price: 0.14
output_price: 0.58
context_window: 256000
mmlu: 88.4
humaneval: 82.0
arena: "Competitive"
image: "/images/agentmarketplace/llm-hero.svg"
order: 16
last_verified: "2026-07-29"
---

# Tencent Hy3

Hy3 is Tencent Hunyuan's third-generation large model, released July 6, 2026 under Apache 2.0. It is a Mixture-of-Experts architecture with 295B total parameters and 21B active per token, featuring 192 experts with top-8 routing and a 3.8B multi-token prediction (MTP) layer. The model topped OpenRouter's weekly usage leaderboard shortly after release, driven by an aggressive free tier during launch.

## Pricing

- Tencent Hunyuan API: ~1 RMB / 1M input, ~4 RMB / 1M output (approximately $0.14 / $0.58 USD)
- Cached input: ~0.25 RMB / 1M tokens (approximately $0.035 USD)
- OpenRouter: $0.14 / 1M input, $0.58 / 1M output (free tier ran through July 21, 2026)
- Self-host: FP8 checkpoint under 300GB, fits on a single 8x H200 node — less than half the infrastructure required for GLM-5.2

> Pricing from Tencent Cloud and OpenRouter as of July 2026. Currency conversion at ~7.1 RMB/USD. Verify on the provider's pricing page before budgeting.

## Benchmarks

- Tsinghua University math PhD qualifying exam (Spring 2026): 88.4 avg@3 — topped all Chinese competitors
- CHSBO 2025 (national biology olympiad): 87.8 — highest among Chinese models
- GPQA Diamond: 86.7 — competitive with frontier-tier models
- Intelligence Index: 33.6 (85th percentile across tracked models)
- Context window: 256K tokens

> Benchmark numbers from Tencent's official release, third-party benchmark aggregators, and university exam results. Results vary by evaluation harness. Test on your own tasks.

## Key capabilities

- **Aggressively low pricing** — at $0.14/$0.58 per 1M tokens, Hy3 is one of the cheapest frontier-adjacent models available, roughly 71x cheaper than Claude Fable 5 for input tokens
- **Strong reasoning** — scores competitively on real-world exams (not curated benchmarks), which Tencent specifically prioritizes to avoid benchmark gaming
- **Agent-optimized** — enhanced agent capabilities, function-calling, and tool-use support
- **Apache 2.0 license** — full commercial use and modification rights
- **Multi-token prediction** — the 3.8B MTP layer improves inference efficiency beyond what the MoE architecture alone provides
- **Broad platform availability** — accessible via Tencent Cloud, OpenRouter, and integrations with Hermes, Cline, OpenClaw, Cherry Studio

## Limitations

- **Not frontier-class** — Intelligence Index of 33.6 puts it at the 85th percentile, not the top. GLM-5.2, DeepSeek V4 Pro, and all Western frontier models score higher
- **Self-hosting requires serious hardware** — FP8 at under 300GB still needs an 8x H200 node. Consumer GPU deployment is not viable for the full model
- **Ecosystem maturity** — while more mature than Inkling (which launched 9 days later), Hy3's third-party tooling, fine-tunes, and community integrations are still developing
- **Documentation primarily in Chinese** — English documentation lags. Developers outside China may face friction with Tencent Cloud's API setup, billing, and support
- **Safety alignment differs from Western models** — test thoroughly for your compliance requirements, especially for content that may touch Chinese regulatory sensitivities
- **Hallucination control improved but unverified independently** — Tencent claims improvements in hallucination rate control, but independent verification is limited

## When to pick it

Choose Hy3 when you want the lowest per-token cost for a frontier-adjacent model and your use case involves reasoning, coding, or agent workflows with Chinese-language support. For maximum reasoning quality, GLM-5.2 or DeepSeek V4 Pro score higher. For English-only use with Western infrastructure, the Tencent Cloud API setup may add friction. For local deployment on consumer hardware, this model is too large — look at Qwen3.6-27B instead.