---
{
  "slug": "claude-opus-5",
  "title": "Claude Opus 5",
  "excerpt": "Anthropic's latest flagship Opus-tier model, released July 24, 2026 — approaches Fable 5 coding performance at half the cost, with a new effort-control dial.",
  "category": "Anthropic",
  "tags": [
    "reasoning",
    "coding",
    "agentic",
    "long-context",
    "api"
  ],
  "provider": "Anthropic",
  "input_price": 5.0,
  "output_price": 25.0,
  "context_window": 200000,
  "mmlu": 92.5,
  "humaneval": 95.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-07-29"
}
---

# Claude Opus 5

Anthropic's latest flagship Opus-tier model, released July 24, 2026. It approaches the frontier Fable 5 on most major benchmarks while costing half as much per token, and introduces an effort-control setting that lets teams trade thinking depth against cost and latency.

## Overview

Claude Opus 5 is the generational successor to Opus 4.8, released exactly two months later. The headline is price-performance: Opus 5 posts 96.0% on SWE-bench Verified (above Fable 5's 95.0%) while keeping Opus 4.8's $5/$25 per-million-token pricing. It also scored a perfect 42/42 gold on IMO 2026, set state of the art on OSWorld 2.0 computer use, and quadrupled the ARC-AGI-3 record at 30.16%.

The standout new feature is **effort control** — you can tell Opus 5 to spend low, medium, or high effort on a task. Low burns fewer thinking tokens and returns faster and cheaper; high lets the model reason as long as it needs for hard problems. This is the lever Anthropic built specifically for teams worried about runaway inference bills in long-running agent workflows.

Opus 5 verifies its own work more aggressively than 4.8, with Anthropic claiming significant reductions in flaw-pass rates during code review. It is the default model on Claude Max and powers long-running agents across Cursor, Windsurf, Claude Code, and Devin.

## Pricing

| Token Type | Price (per 1M tokens) |
|---|---|
| Input | $5.00 |
| Output | $25.00 |
| Cache Write | ~$6.25 |
| Cache Read | ~$0.50 |

Pricing is identical to Opus 4.8 — no price increase for the capability jump. The effort-control setting is the primary cost-management lever.

## Key Benchmarks (July 2026)

| Benchmark | Claude Opus 5 | Claude Opus 4.8 | Claude Fable 5 |
|---|---|---|---|
| SWE-bench Verified | 96.0% | 88.6% | 95.0% |
| SWE-bench Pro | 79.2% | 69.2% | 80.3% |
| Terminal-Bench 2.1 | not published | 74.6% | 88.0% |
| Frontier-Bench v0.1 | 43.3% | 18.7% | 33.7% |
| ARC-AGI-3 | 30.16% | — | — |
| IMO 2026 | 42/42 gold | — | — |

## Strengths

- **Coding leadership** — 96% on SWE-bench Verified, above Fable 5 at half the cost
- **Self-verification** — significantly less likely to let flaws pass in code review vs. 4.8
- **Effort control** — dial thinking depth per task to manage cost and latency
- **Computer use** — state of the art on OSWorld 2.0
- **Math reasoning** — perfect IMO 2026 gold, ARC-AGI-3 record

## Weaknesses

- **Terminal-Bench** — Anthropic did not publish a Terminal-Bench score; Fable 5 leads at 88%
- **Frontier-Bench gap** — 43.3% is strong but the hardest terminal-coding tasks remain unsolved by any model
- **No published GPQA/MMLU-Pro** at launch — independent evaluators flagged gaps in transparency
- **Output price** — $25/1M is still premium vs. Gemini 3.6 Flash ($7.50) for high-volume workloads

## When to use it

- Production coding agents where Fable 5's $10/$50 pricing is too expensive
- Long-running agentic workflows that benefit from self-verification
- Computer-use and OSWorld-style tasks
- Teams that need a cost dial (effort control) for variable-difficulty workloads

## Alternatives

- **Claude Fable 5** — higher ceiling on Terminal-Bench and Frontier-Bench, 2× the cost
- **GPT-5.6 Sol** — comparable intelligence index, leads Coding Agent Index, $5/$30 pricing
- **Gemini 3.6 Flash** — 1M context, $1.50/$7.50, strong for high-throughput agentic loops
- **Claude Opus 4.8** — same price, lower capability; only if you haven't migrated yet