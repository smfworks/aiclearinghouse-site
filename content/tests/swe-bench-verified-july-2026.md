---
slug: swe-bench-verified-july-2026
title: "SWE-bench Verified Leaderboard — July 2026"
excerpt: "Claude Opus 5 takes the top spot at 96–97% on SWE-bench Verified, edging out GPT-5.6 Sol and Claude Fable 5 as the frontier coding benchmark tightens at the top."
category: "Coding Benchmark"
tags:
  - coding
  - benchmarks
  - github
  - agents
  - swebench
agents:
  - Claude Opus 5
  - GPT-5.6 Sol
  - Claude Fable 5
  - Kimi K3
  - GPT-5.6 Luna
  - Claude Opus 4.8
  - Grok 4.5
llm: "Multiple"
winner: "Claude Opus 5"
date: "2026-07-29"
order: 99
last_verified: "2026-07-29"
results:
  - agent: Claude Opus 5
    score: 96
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "New leader as of July 24, 2026. $5/$25 pricing — half of Fable 5's cost. Vals.ai reports 97.00% on their independent run."
  - agent: GPT-5.6 Sol
    score: 96
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Released July 9, 2026. Vals.ai reports 96.20%. Tied with Opus 5 within margin. $5/$30 pricing."
  - agent: Claude Fable 5
    score: 95
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: true
    notes: "Previous leader from June 2026. Frontier coding model but at $10/$50 — 2× Opus 5's cost."
  - agent: Kimi K3
    score: 93
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Moonshot's 2.8T-parameter open-weight MoE model. #3 open-weight on Artificial Analysis. Weights public as of July 27."
  - agent: GPT-5.6 Luna
    score: 93
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "OpenAI's cheapest GPT-5.6 tier at $1/$6. Remarkable score for the price."
  - agent: Claude Opus 4.8
    score: 89
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Released May 28, 2026. Previous Opus-tier model at the same $5/$25 price as Opus 5."
  - agent: Grok 4.5
    score: 87
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "xAI's flagship, released July 9, 2026. $2/$6 pricing — strong value for the score."
---

# SWE-bench Verified Leaderboard — July 2026

## The snapshot

The SWE-bench Verified leaderboard tightened dramatically in July 2026. Claude Opus 5, released July 24, took the top spot at 96.0% (Anthropic-reported) / 97.0% (Vals.ai independent run), edging out GPT-5.6 Sol at 96.2% (Vals.ai) and the previous leader Claude Fable 5 at 95.0%.

The remarkable story is price-performance: Opus 5 matches or beats Fable 5 at half the cost ($5/$25 vs. $10/$50), and GPT-5.6 Luna — OpenAI's cheapest tier at $1/$6 — scores 93%, higher than the previous Opus-tier model (4.8 at 89%). The price of near-frontier coding capability has collapsed.

## What changed since June

| Model | June 2026 | July 2026 | Change |
|---|---|---|---|
| Claude Opus 5 | — | 96% | New entry, new leader |
| GPT-5.6 Sol | — | 96% | New (July 9 release) |
| Claude Fable 5 | 95% | 95% | Dethroned |
| Kimi K3 | — | 93% | New (July 16, weights public July 27) |
| GPT-5.6 Luna | — | 93% | New (cheapest tier, remarkable value) |
| Claude Opus 4.8 | 89% | 89% | Unchanged |
| Grok 4.5 | — | 87% | New (July 9) |

## What this means for buyers

1. **The frontier is now a cluster, not a single model.** Five models score within 3 points of each other. Choosing on SWE-bench alone is no longer sufficient — look at SWE-bench Pro, Terminal-Bench, and your own workload.

2. **Price-performance inverted.** The cheapest tier (GPT-5.6 Luna at $1/$6) outscored last quarter's Opus-tier model. Routing by task difficulty is now the dominant cost strategy.

3. **Open-weight caught up.** Kimi K3 at 93% is within 3 points of the closed-weight frontier, with weights public. For self-hosting teams, the gap is functionally closed on this benchmark.

4. **Beware benchmark gaming.** A 2026 study showed SWE-bench Verified can be gamed to 100% via pytest hook manipulation. Read the methodology behind any score, not just the headline number. The scores above are from standard harnesses (Claude Code, Codex CLI, mini-SWE-agent), not adversarial setups.

## Sources

- Anthropic Claude Opus 5 release (July 24, 2026)
- Vals.ai SWE-bench Verified leaderboard (updated July 22, 2026)
- Artificial Analysis Intelligence Index (July 2026)
- OpenAI GPT-5.6 release materials (July 9, 2026)
- Moonshot Kimi K3 release (July 16, 2026)