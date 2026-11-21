---
slug: "2026-11-20-inkling-family-showdown"
title: "Inkling 2 Small vs Inkling 2 Mini: One Family, Two Jobs"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-20"
excerpt: "Thinking Machines shipped two Inklings this week and we ran both through the same two tests. 36 points apart on Cold Iron, opposite personalities on the one-shot, and a clear division of labor between them."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["inkling", "thinking-machines", "cold-iron", "one-shot", "comparison"]
readTime: 8
image: "/images/blog/2026-11-20-inkling-family-showdown.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-20-inkling-family-showdown"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Thinking Machines Lab put out two new models this week, and we put both through the same two tests: our 81-byte one-shot brief and Cold Iron, the 157-item Official A suite. The results split cleanly, and the split tells you exactly which one to reach for.

**[Inkling 2 Small](/blog/2026-11-20-inkling-2-small-aurora-one-shot)** is the 594B-total, 17B-active MoE. **[Inkling 2 Mini](/blog/2026-11-20-inkling-2-mini-aurora-cosmos-one-shot)** is the 26.4B-total, 3.4B-active looped model, small enough for a laptop. Both take text and images in, both claim a 1M-token context, and both are open-weight. That is where the similarity ends.

## The scoreboard

| | Inkling 2 Small | Inkling 2 Mini |
|---|---|---|
| Cold Iron (157) | **147/157 (93.6%)** | 90/157 (57.3%) |
| Arm | effort=minimal analogue (cannot turn thinking off) | effort=none, **true off** (0 rt × 157) |
| Errors | 0 | 0 |
| Suite wall | 600 s | 3,905 s |
| Mean s/item | **3.8** | 24.9 |
| Suite cost | $0.18 | **$0.09** |
| One-shot page | 26,559 B Canvas 2D aurora | 13,366 B Canvas 2D cosmos |
| One-shot wall | **19.3 s** | 62.2 s |
| One-shot reasoning | 418 rt | 1,671 rt |
| One-shot cost | $0.0124 | **$0.0028** |
| List price / 1M | $0.30 / $1.00 | $0.093 / $0.371 |

Both n=1, both zero errors. Read every number as a point estimate.

The headline is the reversal in the bottom two rows. Mini is 6× slower per item than Small on Cold Iron and thought 4× longer on the one-shot. The looped architecture does more computation per token than its size suggests, and on a cloud endpoint that shows up as wall time. Small wins on more than accuracy; it is also the fast one. Price is the only column where Mini wins, and it wins hard: half the suite cost, a quarter of the one-shot cost.

## Where the 36 points live

The Cold Iron gap lands unevenly. Math accounts for 20 of the 36 points (Small 26/30, Mini 6/30 — every Mini item above medium failed), coding for 14 (27 vs 13). Reasoning is 10 apart, prose 6, instruction 5. Writing is 5 vs 3 and tool calling is a tie, 2/2 each.

That shape is the whole story. Mini did not lose points evenly like a uniformly weaker model; it lost its upper tiers in exactly the two categories that define "can I trust this agent with hard work." Meanwhile its instruction following and tool calling stayed close to Small's. The vendor positions Mini for chatbots, coding assistants, and RAG, and the scorecard agrees with the marketing: the assistant-shaped rows are its strong ones.

## The reasoning quirk, side by side

These two models handle the thinking-off question in opposite ways, and that matters if your harness counts reasoning tokens.

Small cannot turn its thinking off. The endpoint rejects `effort: none` with an HTTP 400. Our 147/157 ran on `effort: minimal`, the lowest listed effort, and it still burned ~130k reasoning tokens across the suite. It is a thinker by design; budget for that.

Mini turns its thinking off cleanly. `effort: none` is accepted, and the run logged zero reasoning tokens on all 157 items. If your use case is high-volume and latency-tolerant and you want deterministic token spend, that is a genuinely useful property. (If you want Mini thinking on, the default effort is high, and it used that mode on the one-shot.)

One caveat on comparing these two rows: the two arms differ. Small's score is an analogue floor, Mini's is a true off. Neither post hides that, and neither should your notes.

## Where each one earns its keep

Reach for Small when the work is hard and you want it done once. It scored in our top tier (even with Gemini 4 Carbon, above Fable 5.2's 90.9 mean), at 3.8 seconds an item, at a mid-tier price. Concretely:

- **Agentic coding and long-horizon agent runs.** 27/30 coding, 30/30 instruction following, 2/2 tool calling, and speed that will not be the bottleneck in a long loop.
- **Anything with math or structured reasoning in the middle of it.** 26/30 math on a thinking-off analogue is the strongest signal in either scorecard.
- **One-shot generation and design work.** The 26.6 KB aurora page in 19 seconds is the fastest top-shelf generation we have measured in this series.
- **The one thing to plan around:** you pay for its thinking. There is no token-spend floor of zero on this model.

Reach for Mini when volume is high, stakes per call are low, and cost is the metric. The honest score is 57.3%, so it falls short of rankable on hard work, and its job lies elsewhere:

- **Cheap chat, summarization, and RAG over your own corpus.** 25/30 instruction following means it follows a rubric, and the 1M context window fits a lot of retrieval payload.
- **Bulk classification, extraction, routing.** Anywhere you would have reached for a small hosted model before, at $0.093 per million input tokens with deterministic (zero) reasoning spend when you want it.
- **Prototyping on real hardware.** The weights are open and laptop-class. A quantized local build on a Spark or an omarchy box is the follow-up test the cloud number leaves open, and the looped design is exactly the kind of architecture worth measuring locally.
- **What not to do:** keep it away from math, expert coding, and anywhere a wrong answer costs more than a fraction of a cent. 6/30 on math is disqualifying for that, and no prompt trick will fix a missing tier.

## The division of labor in one line

Small is the specialist you call when the answer has to be right and fast. Mini is the workhorse you call when the answer has to be cheap and good enough, ten thousand times an hour. They work as the top and bottom of one product line, and the 36-point gap is Thinking Machines drawing that line on purpose.

## Reproducing

Everything is on file: raw JSON and scorecards under `benchmarks/thinkingmachines-inkling-2-small/` and `benchmarks/thinkingmachines-inkling-2-mini/` in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase). Same runner for both: `run_stage1.py --core-profile strict_v01 --thinking off` against `https://openrouter.ai/api/v1`, with per-slug reasoning branches (Small: effort=minimal, mandatory; Mini: effort=none, true off) documented in the runner comments. One-shots: the series `stream_openrouter_oneshot.py`, MAX_TOKENS 943,718 (Small) and 65,536 (Mini), temperature 0.7, no named effort.

Verification notes, 2026-11-20: all figures from saved JSON on disk (stage1 results, one-shot meta.json files) and the OpenRouter catalog entries for `inkling-2-small-20261107` and `inkling-2-mini-20261120`. Costs are `usage.cost` sums, not list-price math. Latency means are per-item elapsed over scored items. Both Cold Iron runs and both one-shots are n=1; no winner is declared anywhere in this post, and the arm difference between the two Cold Iron scores is stated above. Companion posts: [Small one-shot](/blog/2026-11-20-inkling-2-small-aurora-one-shot), [Mini one-shot](/blog/2026-11-20-inkling-2-mini-aurora-cosmos-one-shot), [Mini Cold Iron](/blog/2026-11-20-inkling-2-mini-cold-iron).
