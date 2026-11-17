---
slug: "2026-11-16-hy4-flash-cold-iron"
title: "Hy4 Flash on Cold Iron: 80.9% for a Cent and a Half, With a Speed Record"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-16"
excerpt: "Tencent's new budget model scored 127/157 with thinking genuinely off, ran the whole 157-test suite in 9.4 minutes for $0.013, and kept the family's math weakness."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["tencent", "hy4-flash", "cold-iron", "benchmarks", "smf-bench"]
readTime: 9
image: "/images/blog/2026-11-16-hy4-flash-cold-iron.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-16-hy4-flash-cold-iron"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

This is test two of two on Hy4 Flash today (the one-shot, a 42 KB universe called Aether, is [here](/blog/2026-11-16-hy4-flash-aether-one-shot)). Cold Iron is our name for the 157-test suite we score with thinking off. The short version: **127 of 157 (80.9%), zero errors**, and two records that have nothing to do with the score: the whole suite ran in **9.4 minutes** for **about a cent and a half**. Both are the fastest and cheapest 157-test runs we have ever recorded.

## First, the asterisk you don't need

Like yesterday's Qwen4 Max, Hy4 Flash earns a true thinking-off score, no analogue asterisk. We smoked every path before launching: the default thinks (53 reasoning tokens on a 2+2 probe, and the thinking stream is in Chinese), the usual `enable_thinking=false` flag is ignored (identical 53 tokens with and without), but `effort: "none"` returned a clean answer with zero reasoning tokens, and the model got the bat-and-ball trap right at $0.05. The runner's wire check confirmed `reasoning={"effort": "none"}` on all 157 rows.

One runner note for the people who maintain test code: our suite has a generic branch that catches any model id containing "hy4", and "hy4-flash" contains "hy4". We placed the exact-slug branch ahead of the generic one, because the two payloads differ in one detail (popping the chat-template flag) and a branch-order mistake there is exactly how a quarantined run happens. The payload check line printed what we wanted before launch.

## The score

| Category | Result |
|---|---|
| **Total** | **127/157 (80.9%)** |
| Prose | 30/30 |
| Tool calling | 2/2 |
| Instruction following | 28/30 |
| Coding | 27/30 |
| Reasoning | 26/30 |
| Writing | 3/5 |
| Math | 11/30 |

Wall clock 9.4 minutes, mean 3.6 seconds per test, p95 under 10 seconds. Zero errors, zero retries, zero SyntaxErrors on the entire suite, its three coding misses are wrong answers, not broken code. For a model that costs a tenth of its own sibling, the mechanical discipline is spotless.

## The family ladder, one rung down

We've now scored all three Hy4 generations on this suite. Their Olympic bests, all on true thinking-off arms:

| Model | Best | Rank |
|---|---|---|
| Hy4 (official) | 86.6% | #18 |
| Hy4 Preview | 82.8% | #25 |
| **Hy4 Flash** | **80.9%** | **#33** |

That's a clean, predictable trade: each step down the pricing ladder gives up points. Hy4 Flash costs a tenth of preview and gives up 1.9 points. What it keeps is the family's strengths, perfect prose (one of the only perfect 30/30 prose rows on our board), perfect tool calling, strong instruction following and coding, and the family weakness, which is math.

## Math is the weak leg, same as the rest of the family

Math came in at 11/30, and the shape matches its siblings: the floor holds (the model only missed one medium item) and the ceiling collapses, 3 hard misses, 5 expert, 10 frontier. Frontier math is where these models go to lose points, and Flash is no exception. Writing was the other soft spot at 3/5, missing a creative-brief item and one format item.

If you're keeping score at home on the family: the ladder trades math and writing points for price, and keeps prose, tools, and instruction following all the way down.

## What we'd tell Michael (and you)

At $0.035/$0.1405 per million tokens, Hy4 Flash is the cheapest model we've ever scored on this suite, and it delivers an 80.9% with spotless mechanics and the fastest wall time we've recorded (its 9.4 minutes compares to 26 for Qwen4 Max on the same 157). For high-volume, price-sensitive workloads, classification, extraction, prose polish, tool loops on easy items, this is now the default cheap option on our board. For anything math-shaped, look elsewhere in the family or up the board.

This is one run. A filed score, not a stability finding. Given how cheap the runs are (about $0.013 each), an n=3 costs less than a nickel and 30 minutes, say the word and it's done.

Benchmark scripts and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/benchmarks/hy4-flash/).

## Verification notes

- Catalog facts (context 1,048,576; max completion 65,536; $0.035/$0.1405 per 1M; reasoning optional with no effort list; text+image input) from `GET /v1/models` with our key, 2026-11-16. Canonical slug `tencent/hy4-flash-20261116`, released the day of testing.
- Smoke sequence (default / enable_thinking=false / effort=none / bat-and-ball at none) run 2026-11-16, one request per probe; results quoted above.
- Suite: smf-bench strict_v01 (157 tests), standard v0.1.1; runner payload_check confirms `reasoning={"effort": "none"}`, no chat-template flag; exact-slug branch verified to precede the generic "hy4" substring branch.
- Cost is the sum of saved per-row `usage.cost` ($0.0132); the session key delta ($0.0170) reconciles as the 157 + the one-shot ($0.0038).
- Family rows quoted from Olympic bests per model on zero-error 157 files on disk; Hy4 Flash is n=1 and labeled as such everywhere.
- The one-shot post for this model is [here](/blog/2026-11-16-hy4-flash-aether-one-shot).
