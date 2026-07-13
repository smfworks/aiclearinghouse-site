---
{
  "slug": "claude-opus-4-8",
  "title": "Claude Opus 4.8",
  "excerpt": "Anthropic's current flagship for coding, long-context work, and multi-step agent loops — 1M context with aggressive price cuts vs prior Opus tiers.",
  "category": "Anthropic",
  "tags": ["reasoning", "coding", "long-context", "api", "agents"],
  "provider": "Anthropic",
  "input_price": 5.0,
  "output_price": 25.0,
  "context_window": 1000000,
  "mmlu": 90.5,
  "humaneval": 93.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 11,
  "last_verified": "2026-07-13"
}
---

# Claude Opus 4.8

Anthropic's current production flagship for hard coding, long documents, and multi-step agent work. Released late May 2026, it is widely treated as the practical default when you need frontier quality among generally available models.

## Pricing

- Input: $5.00 / 1M tokens
- Output: $25.00 / 1M tokens
- Context window: up to 1,000,000 tokens (product-tier dependent)
- Cache / batch discounts commonly available on the API (verify current Anthropic pricing page)

## Benchmarks

- Public coding trackers place Opus 4.8 near the top of SWE-bench Verified among generally available models (vendor and third-party trackers differ; treat as directional).
- Strong multi-step tool use and long-horizon instruction following in agent harnesses.

> Pricing and context numbers are taken from public third-party aggregators and Anthropic product messaging as of mid-2026. Always re-check the provider pricing page before budgeting.

## Key capabilities

- Long-context coding and document synthesis
- Reliable tool calling for agent frameworks (Hermes, Claude Code, custom ReAct loops)
- Vision + text in enterprise workflows
- Better cost envelope than older high-priced Opus SKUs

## Limitations

- Still premium spend on high-output agent runs
- 1M context availability and pricing can depend on product surface (API vs chat product)
- Not a substitute for a verification harness — strong models still need Definition-of-Done checks

## When to pick it

Choose Opus 4.8 when coding quality and multi-step reliability matter more than token cost. Pair with a mid-tier model for routine classification and summarization.
