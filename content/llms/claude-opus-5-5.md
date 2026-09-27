---
{
  "slug": "claude-opus-5-5",
  "title": "Claude Opus 5.5",
  "excerpt": "Anthropic's first 5.5-family model — Fable 5.1-level performance at roughly 40% lower workload cost than Opus 5, with a 60% cache-read price cut that reshapes agentic coding economics.",
  "category": "Anthropic",
  "tags": ["coding", "agents", "long-context", "reasoning", "agentic"],
  "provider": "Anthropic",
  "input_price": 4.0,
  "output_price": 20.0,
  "context_window": 1000000,
  "mmlu": 90.0,
  "humaneval": 95.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-27"
}
---

# Claude Opus 5.5

## Overview

Claude Opus 5.5 is the first model in Anthropic's Claude 5.5 family, released on September 22, 2026. The headline is efficiency, not raw capability: Anthropic says it performs at the level of Claude Fable 5.1 on most work while costing roughly 40% less to run than the prior Opus 5 model. It targets long-running agentic coding, computer use, and knowledge work — workloads where context gets re-read repeatedly, making the cache-read price cut the change that matters most.

## Pricing

- **Input:** $4.00 / 1M tokens (20% lower than Opus 5's $5.00)
- **Output:** $20.00 / 1M tokens (20% lower than Opus 5's $25.00)
- **Cache read:** $0.20 / 1M tokens (60% lower than Opus 5's $0.50)
- **Cache write:** $5.00 / 1M (5-min) · $8.00 / 1M (1-hr)
- **Batch API:** 50% off — $2.00 / $10.00
- Available via Anthropic API, Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Foundry

> The cache-read cut is the number that reshapes agent economics. In agentic and multi-turn coding workflows, cache reads make up the majority of token cost — dropping from $0.50 to $0.20 per million is where the 40% workload savings comes from.

## Key capabilities

- **Fable 5.1-level performance on most tasks** at roughly 40% lower cost per task than Opus 5
- **30%+ faster output generation** than Opus 5 at default settings
- **1M-token context window** with multimodal (text + image) input
- **Adaptive reasoning** with effort levels: Low, Medium, High, Max
- **Strongest alignment scores** of any recent Claude model per Anthropic
- **BenchAlign v5.6 score: 88.5** — tops Anthropic's own lineup, ahead of Fable 5.1 (83.3) and Opus 5 (80.4)
- Beats GPT-6 Astra on 8 of 10 reported benchmarks per Anthropic's launch claims

## What early testing shows

Anthropic reports that on a long-running agentic coding benchmark, Opus 5.5 finished in 9.5 hours compared to 12 hours for Fable 5.1, at 51% lower cost. The model is positioned for multi-hour autonomous coding sessions where the same large context block gets re-read across many turns — exactly the pattern where cache-read pricing dominates.

> Benchmark figures are vendor-reported as of September 22, 2026. Independent replication on Artificial Analysis and BenchLM is still accumulating. Treat the "beats GPT-6 Astra on 8 of 10" claim as Anthropic's own until outside evaluators publish.

## Limitations

- **Not the raw capability leader:** Fable 5.1 (max effort) remains Anthropic's most capable model on the hardest tasks; Opus 5.5 matches it on *most* work, not all
- **Proprietary only:** No open-weight release; self-hosting is not an option
- **Output speed:** Faster than Opus 5 but still not in the Flash-tier speed class
- **Subscription gating:** Available on Pro, Max, Team, and Enterprise — not the Free tier
- **New model, thin independent data:** Most benchmark numbers are from Anthropic's launch announcement; third-party evals are still landing

## When to pick it

Choose Opus 5.5 when you want Fable 5.1-class performance for agentic coding and knowledge work at a fraction of the cost — especially workloads with heavy cache reuse (long system prompts, tool definitions, retrieved context blocks read across many turns). The 60% cache-read cut makes it the best value in Anthropic's lineup for multi-hour agent runs. If you need the absolute ceiling on the hardest single-turn tasks, Fable 5.1 (max) still has an edge. If you need open weights for self-hosting, look at GLM-5.3 or DeepSeek V4.1 Flash instead.