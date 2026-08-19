---
{
  "slug": "kimi-k3",
  "title": "Kimi K3",
  "excerpt": "Moonshot AI's 2.8-trillion-parameter MoE model with 1M context, native vision, and aggressive cache-hit pricing for coding agents.",
  "category": "Moonshot AI",
  "tags": ["reasoning", "long-context", "multimodal", "open-weights", "code"],
  "provider": "Moonshot AI",
  "input_price": 3.0,
  "output_price": 15.0,
  "context_window": 1000000,
  "mmlu": 88.0,
  "humaneval": 85.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 11,
  "last_verified": "2026-08-19"
}
---

# Kimi K3

Moonshot AI's frontier-class open-weight model. Kimi K3 is a Mixture-of-Experts architecture with 2.8 trillion total parameters, activating 16 of 896 experts per token. It ships with a 1-million-token context window, native visual understanding, and an always-on "thinking mode" for reasoning tasks.

## Pricing

- Input (cache miss): $3.00 / 1M tokens
- Input (cache hit): $0.30 / 1M tokens (90% discount)
- Output: $15.00 / 1M tokens
- Context window: 1,000,000 tokens
- Batch pricing: Not available for K3 (K2.5/K2.6/K2.7 Code support batch at 60% of standard)

> Data sourced from Moonshot's official API pricing page. Last updated 2026-08-19.

## Benchmarks

- MMLU: ~88 (estimated from published comparisons)
- HumanEval: ~85 (estimated from published comparisons)
- SWE-Bench Verified: competitive with frontier closed models
- AIME 2026: strong reasoning performance
- LMSYS Chatbot Arena: Top-tier

> Several benchmark figures are drawn from Moonshot's launch announcements and third-party evaluations. Independent reproduction is still limited. Treat numbers as provisional until more community evals land.

## Key capabilities

- **1M context window** — one of the longest available, useful for repository-scale coding agents and document-heavy research.
- **Cache-hit pricing** — the 90% input discount on repeated prefixes is the real story for coding agents that resend context every turn. Moonshot reports >90% cache-hit rates in coding workloads.
- **Native multimodal** — vision understanding built in, not bolted on.
- **Thinking mode** — always-on reasoning mode for complex problem solving.
- **Open weights** — Moonshot announced full open-source release by late July 2026 under a permissive license.

## Limitations

- **Deployment requirements are extreme.** 2.8T parameters means you need a supernode with at least 64 accelerators for self-hosting. This is not a laptop model. Most teams will use the API, not self-host.
- **China-built model.** U.S. and regulated businesses should weigh data residency and compliance considerations. Self-hosting is the main control path if compliance requires it.
- **Cache-hit rate is workload-dependent.** Moonshot publishes >90% hit rates for coding, but your actual rate depends on prefix stability, provider behavior, compaction, and parallelism. If your agent rewrites context every turn, you pay full price.
- **Benchmark claims need independent verification.** Moonshot's numbers are strong but largely self-reported. Community evaluations are still catching up.
- **No batch discount for K3.** Older Kimi tiers (K2.5–K2.7) support batch at 60% of standard price. K3 does not. If you batch heavily, the older tiers may be cheaper overall.