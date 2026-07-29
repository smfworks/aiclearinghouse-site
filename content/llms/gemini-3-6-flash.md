---
{
  "slug": "gemini-3-6-flash",
  "title": "Gemini 3.6 Flash",
  "excerpt": "Google's high-efficiency workhorse model released July 21, 2026 — 1M-token context, 17% fewer output tokens than 3.5 Flash, and $1.50/$7.50 pricing for agentic coding at scale.",
  "category": "Google",
  "tags": [
    "reasoning",
    "long-context",
    "agentic",
    "multimodal",
    "coding"
  ],
  "provider": "Google",
  "input_price": 1.5,
  "output_price": 7.5,
  "context_window": 1000000,
  "mmlu": 85.0,
  "humaneval": 88.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-07-29"
}
---

# Gemini 3.6 Flash

Google's high-efficiency workhorse model, released July 21, 2026 alongside Gemini 3.5 Flash-Lite and Gemini 3.5 Flash Cyber. It builds directly on Gemini 3.5 Flash with a focus on token efficiency, coding quality, and knowledge-work performance — delivering 17% fewer output tokens on the Artificial Analysis Index at a lower output price.

## Overview

Gemini 3.6 Flash is positioned as the Flash-tier model for developers running agentic and coding workloads at scale. It keeps the 1-million-token context window from 3.5 Flash, drops output pricing from $9.00 to $7.50 per million tokens, and uses 17% fewer output tokens — compounding into meaningful cost savings for long-horizon agent loops.

The model uses explicit chain-of-thought reasoning with adjustable thinking levels (low, medium, high). It accepts text, images, audio, video, and documents as input, outputs text up to 64,000 tokens, and has a knowledge cutoff of March 2026. It is generally available via the Gemini API, Google AI Studio, Android Studio, Google Antigravity, and Gemini Enterprise.

On the Artificial Analysis Intelligence Index, Gemini 3.6 Flash scores 75.3, ranking #9 of 215 tracked models — behind Claude Opus 4.8, Muse Spark 1.1, and Grok 4.5, but ahead of GPT-5.4 and GPT-5.5.

## Pricing

| Token Type | Price (per 1M tokens) |
|---|---|
| Input | $1.50 |
| Output | $7.50 |
| Cached Input | ~$0.15 (90% discount) |

The input price matches 3.5 Flash exactly. The output price drops 17% from $9.00. Cached input gets a 90% discount, making repeated-context workloads extremely cheap.

## Key Benchmarks (July 2026)

| Benchmark | Gemini 3.6 Flash | Gemini 3.5 Flash |
|---|---|---|
| AA Intelligence Index | 75.3 | 55 |
| DeepSWE | 49% | 37% |
| Terminal-Bench 2.1 | 54% | 76.2% |
| SWE-Bench Pro | — | 55.1% |
| MMLU Pro | 47.1% | — |
| SimpleQA | 42% | — |

## Strengths

- **1M context window** — the largest among frontier-tier models at this price point
- **Token efficiency** — 17% fewer output tokens vs. 3.5 Flash, compounding cost savings in agent loops
- **Multimodal** — text, image, audio, video, and document input in a single model
- **DeepSWE gains** — 49% vs. 37% on the previous generation, a 12-point jump
- **Vision performance** — #3 of 19 models on Roboflow Vision Evals, 82.8% average

## Weaknesses

- **Terminal-Bench regression** — 54% vs. 76.2% on 3.5 Flash, a notable drop in terminal-driven tasks
- **Mid-pack on coding** — trails GPT-5.6 Luna and Grok 4.5 on SWE-Bench Pro and DeepSWE
- **Long-context recall** — MRCR 1M pointwise remains a weak spot across the Gemini 3.x family
- **Not a frontier model** — scores below Opus 4.8, Muse Spark 1.1, and Grok 4.5 on the Intelligence Index

## When to use it

- High-volume agentic workflows where token cost dominates (search agents, document processing)
- Multimodal pipelines needing 1M-token context (video analysis, long-document reasoning)
- Teams already on Google Cloud / Gemini API infrastructure
- Cost-sensitive coding agents where Sol/Opus pricing is prohibitive

## Alternatives

- **Gemini 3.5 Flash-Lite** — $0.30/$2.50, even cheaper for high-throughput tasks
- **Claude Opus 5** — far higher coding benchmarks, 13× the output price
- **GPT-5.6 Luna** — $1/$6, higher Intelligence Index, lower context window
- **Gemini 3.5 Flash** — being phased out but still available; higher Terminal-Bench score