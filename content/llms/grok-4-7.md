---
{
  "slug": "grok-4-7",
  "title": "Grok 4.7",
  "excerpt": "xAI's September 2026 flagship for coding and knowledge work — a larger base model with longer RL training, held at Grok 4.6's $2/$6 token rates, but independent testing shows high token consumption that complicates the value story.",
  "category": "xAI",
  "tags": ["coding", "agents", "reasoning", "long-context", "agentic"],
  "provider": "xAI",
  "input_price": 2.0,
  "output_price": 6.0,
  "context_window": 500000,
  "mmlu": 88.0,
  "humaneval": 93.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-27"
}
---

# Grok 4.7

## Overview

Grok 4.7 is xAI's (branded SpaceXAI on launch materials) flagship model for coding, agentic tasks, and knowledge work, released on September 21, 2026. It uses a new, larger base model than Grok 4.6 and was trained with a longer reinforcement learning run on a harder mix of tasks, weighted toward problems that take many hours to complete. xAI trained it to work longer on difficult tasks and check its own work more carefully. The token price stays at $2 / $6 per million — the same rate card as Grok 4.6 — which is what makes this release interesting from a market perspective.

## Pricing

- **Standard (prompt < 200K tokens):** $2.00 / 1M input · $0.50 / 1M cached input · $6.00 / 1M output
- **Long-context (prompt ≥ 200K tokens):** $4.00 / 1M input · $1.00 / 1M cached input · $12.00 / 1M output
- **Fast variant:** Twice the output speed at twice the price ($4 / $12)
- **500K-token context window** with text and image input, text output
- Available via xAI API, Grok Build, Cursor, and supported model gateways

> The decision to hold the line at $2 / $6 — rather than raise prices for a larger model — is what's rattling the coding-assistant market. Cursor and Vercel moved within hours; Vercel's AI Gateway offered a promotional 40% discount through September 27.

## Benchmarks

- **Artificial Analysis Intelligence Index:** 46 (xHigh) vs Grok 4.6's 44 — a modest gain
- **GDPval (Elo):** Grok 4.7 (xHigh) 1,695 vs Fable 5.1 (max) 1,735 vs Grok 4.6 (high) 1,605
- **CursorBench 4.0:** 46.3% — slightly behind Fable 5.1
- **Terminal-Bench 4.0 (agent-level):** Grok Build + Grok 4.7 (xHigh) 37.6% — well behind Codex + GPT-6 Astra (58.2%) and Claude Code + Fable 5.1 (57.9%)
- **Output speed:** ~39.5 tokens/sec — ranks 152nd of 202 models on the same harness; a slow model

> The benchmark gap is real but nuanced. xAI's own charts mostly compare Grok 4.7 at xHigh effort against Grok 4.6 at High — an apples-to-oranges comparison. Artificial Analysis scores both effort levels and found only a 2-point Intelligence Index gain, with about 2.5× higher token use than Grok 4.6.

## Key capabilities

- **Larger base model** with extended RL training on multi-hour tasks
- **Explicit reasoning mode** with effort levels: Low, Medium, High (default), xHigh
- **500K context window** — large but below the 1M-class windows on Claude and Gemini flagships
- **Self-checking behavior:** trained to verify its own work more carefully on difficult tasks
- **Multimodal input:** accepts text and images
- **Same price as Grok 4.6** — no price increase despite a larger model

## Limitations

- **High token consumption:** Independent testing shows ~2.5× the token use of Grok 4.6 at comparable effort levels — the per-token price is low, but the token count is high, so real-world cost per task can be higher than expected
- **Slow output:** 39.5 tokens/sec is genuinely slow for a frontier model; for multi-hour agentic work, verbose + slow is a throughput tax
- **Benchmark gap:** Sits behind Fable 5.1 and GPT-6 Astra on most independent measures, not alongside them
- **Proprietary:** No open-weight release
- **Apples-to-oranges vendor benchmarks:** Most impressive numbers compare xHigh vs High effort

## When to pick it

Choose Grok 4.7 when coding and agentic tasks are your primary workload and you want a cost-efficient model at frontier-adjacent capability — especially if you're already in the xAI/Cursor/Grok Build ecosystem. The $2 / $6 rate card is aggressive. But budget for token volume: this model is verbose, and the real cost per task may be higher than the headline price suggests. If you need the absolute frontier on agentic coding, GPT-6 Astra or Fable 5.1 still lead. If you need open weights at similar cost, DeepSeek V4.1 Flash ($0.30 / $1.20) is dramatically cheaper per token.