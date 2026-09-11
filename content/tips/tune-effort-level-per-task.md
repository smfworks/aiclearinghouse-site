---
slug: tune-effort-level-per-task
title: "Tune Effort Level Per Task, Not Per Model"
category: Performance
excerpt: "Frontier models now expose multiple effort levels that span 10x+ in token usage and cost. Choosing the right effort per task — not per model — is the single biggest cost lever available without changing models."
tags:
  - cost
  - effort-level
  - reasoning
  - token-optimization
  - performance
order: 99
last_verified: "2026-09-09"
---

# Tune Effort Level Per Task, Not Per Model

## The opportunity

Modern frontier models expose a tunable thinking/effort budget. The spread is enormous:

- **Claude Fable 5.1** has five effort levels spanning 11x in output token usage (13.1M at low to 143.7M at max per Artificial Analysis). At the *lowest* effort it already scores ~26% on Terminal-Bench-Science at ~$11/task — beating Fable 5 at *maximum* effort (24.7%) which cost ~$44/task. The cheapest setting of the new model beats the most expensive setting of the old one at a quarter of the price.
- **GPT-5.6 Sol** exposes configurable reasoning effort (low → max / xhigh).
- **Gemini 3.8 Flash** exposes tunable thinking levels (low, medium, high).

Choosing the right effort level is now a real lever for anyone paying by the token — often bigger than the choice of model itself.

## How to apply it

1. **Default to a low/medium effort for exploration and scaffolding.** Most turns in an agentic session are not the hard reasoning turn — they are tool calls, file reads, and small edits. Running those at max effort burns output tokens for no quality gain.
2. **Reserve max effort for the long-horizon, high-stakes turn.** The terminal-bench-class tasks where effort actually moves the score are a minority of turns. Identify them and spike effort there.
3. **Measure cost-per-task, not cost-per-token.** Fable 5.1 (max) costs $3.76 per Intelligence Index task; at xhigh it scores only 1 point lower (65 vs 66) for $2.72 — $1.04 less. A model that finishes in fewer tokens at lower effort can be cheaper *per result* while costing more per token.
4. **Let the agent or harness pick.** Some harnesses (Claude Code defaults Fable 5.1 to High; Claude Cowork and Claude.ai default to Medium). Know your harness's default and override it deliberately, not accidentally.

## The cost curve that matters

| Effort | Fable 5.1 Intelligence Index | Cost per task |
|---|---|---|
| Low | 58 | lowest |
| xhigh | 65 | $2.72 |
| Max | 66 | $3.76 |

The jump from low to xhigh buys 7 index points. The jump from xhigh to max buys 1 point for ~$1.04 more. For most production workloads, xhigh is the Pareto-efficient choice — not max.

## Pitfalls

- **Don't set max effort globally.** It inflates cost on the 80% of turns that don't need it, and the 75% cache-read price cut (where available) doesn't help with *output* token bloat from high effort.
- **Don't assume lower effort always degrades quality.** On short-horizon, well-scoped tasks (single-file IDE edits), the gap between effort levels is narrow — sometimes within noise.
- **Do compare effort levels on your own workload**, not just published benchmarks. The effort-vs-cost curve is task-dependent; a benchmark average can mislead on your specific mix.
- **Remember effort ≠ model tier.** A lower-effort setting on a frontier model can beat a higher-effort setting on a cheaper model on the same task. Compare at matched effort, not at default.

## The key insight

The single biggest cost lever available without changing models is the effort dial. The spread across effort levels on one model (11x token usage, 8 index points, ~$1.04/task swing) is often wider than the spread across models at fixed effort. Tune it deliberately, per task, and measure cost-per-result.