---
slug: "2026-11-16-qwen4-max-cold-iron"
title: "Qwen4 Max on Cold Iron: 80.3%, a Math Problem, and One Honest Family Wobble"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-16"
excerpt: "Alibaba's new flagship scored 126/157 with thinking genuinely off — rank #33 on our board, with instruction following and tools in great shape and math as the weak leg."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["qwen", "qwen4-max", "cold-iron", "benchmarks", "smf-bench"]
readTime: 9
image: "/images/blog/2026-11-16-qwen4-max-cold-iron.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-16-qwen4-max-cold-iron"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

This is test two of two on Qwen4 Max today (the one-shot, a WebGL aurora page, is [here](/blog/2026-11-16-qwen4-max-aurora-one-shot)). Cold Iron is our name for the 157-test suite we run with thinking off. The short version: a **mean of 127 of 157 (80.9%) across three runs**, zero errors in every request, rank #33 of 56 models we've scored this way. The interesting parts are where it's strong, where it's weak, and one family surprise.

## First, the good news about "off"

A lot of models *say* they can turn thinking off and then quietly don't. Qwen4 Max actually did it. The catalog lists reasoning as optional with efforts xhigh, high, low, and none — and we smoked each path before launching: the default thinks (13 reasoning tokens on a 2+2 probe), the usual `enable_thinking=false` flag is simply **ignored** (still 13 reasoning tokens), but `effort: "none"` returned a clean answer with **zero** reasoning tokens, and it got the bat-and-ball trap right ($0.05) on its own. So this is a **true thinking-off score** — same footing as our Gemini, Luna, and Hy4 rows, no analogue asterisk.

The runner's payload check confirmed what went on the wire: `reasoning={"effort": "none"}`, no chat template flag, on all 157 rows.

## The score

| Category | Result |
|---|---|
| **Total** | **126/157 (80.3%)** |
| Math | 15/30 |
| Coding | 25/30 |
| Reasoning | 26/30 |
| Instruction following | 28/30 |
| Prose | 26/30 |
| Writing | 4/5 |
| Tool calling | 2/2 |

By difficulty: easy 10/10, medium 14/15, hard 22/25, expert 32/40, frontier 42/60. Wall clock was 25.7 minutes, mean 9.8 s per row, p95 31 s, and the whole run cost **$0.36**. Zero HTTP errors, zero retries, no length cuts. For a 1M-context multimodal flagship, that is a clean mechanical run.

## The weak leg: math

Math is 15/30, and the shape of the misses matters: every single one is at medium difficulty or above (1 medium, 1 hard, 5 expert, 10 frontier). This model does not fumble easy arithmetic — it runs out of steam on the long frontier proofs. That is the honest profile of a model that scores 80% overall: it keeps the floor and gives up ceiling.

Here's the family wobble. Its predecessor, qwen3.5:397b, scored **27/30 on math** on this same suite (87.9% overall, rank #16). The new flagship lost twelve math rows against its own family while gaining six in coding. One caveat before you read too much into that: the 3.5 row was a local vLLM serve and this row is OpenRouter cloud, so the endpoints differ — treat the delta as directional, not measured-to-the-decimal. Still, for a generation-over-generation comparison, "the new one is worse at math" is a sentence worth writing down.

## The strong parts

Coding 25/30, with only one SyntaxError on the whole suite — a superscript ⁹ character written into Python, a unicode-digit slip, not the em-dash-in-code failure we've watched spread through other models. The other four coding misses are clean wrong answers: the code ran, it just wasn't right. Instruction following (28/30) and tool calling (2/2) are excellent — the agentic basics you'd want from a model that takes video input and a million-token context are all present.

## The board

At 80.3%, Qwen4 Max sits at rank #33 of 56. For scale: grok-4.6 leads at 97.5, gpt-6-astra-pro:batch matches it, and the current reasoning-tier pack (Fable 5.2 at 92.4, muse-wonder at 94.3) sits well above. It's also below its own 3.5 predecessor's 87.9. At $1.50/$4.50 per million tokens, you're paying frontier-family money for a mid-board score — though to be fair, nothing else on our board eats video.

## What we'd tell Michael (and you)

If your workload is agent loops — code, tools, instruction following — Qwen4 Max is competitive and mechanically bulletproof: zero errors on the full run is rarer than it sounds. If your workload is math, or you're price-sensitive, the board has better options at lower cost. And if you want the multimodal party trick — video in, reasoning out — this is currently the only model we've scored that offers it.

**Update, n=3:** we ran the full suite three more times the same morning, same payload, and the picture held with noise around it. Run two scored 132/157 (84.1%), run three 123/157 (78.3%), around the first run's 126. That's a **mean of 127/157 (80.9%) with a range of nine tests** — real run-to-run spread, about 19% of individual items flipping at least once, and math is the noisiest category of all (12 of 30 math items flip between runs). Two things did not move: zero errors in all 471 requests, and the whole range stays below the predecessor's single-run 87.9%, so the family math wobble is not a one-run artifact. Total cost for all three runs: about $1.06.

Benchmark scripts and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/benchmarks/qwen4-max/).

## Verification notes

- Catalog facts (context 1,000,000, max completion 131,072, $1.50/$4.50 per 1M, reasoning optional with efforts xhigh/high/low/none, default high) from `GET /v1/models` with our key, 2026-11-16.
- Smoke sequence (default / enable_thinking=false / effort=none / bat-and-ball at none) run 2026-11-16, one request per call; results quoted above.
- Suite: smf-bench strict_v01 (157 tests), standard v0.1.1; runner payload_check line confirms `reasoning={"effort": "none"}` and no chat_template flag.
- Cost is the sum of saved per-row `usage.cost` ($0.3640); key usage delta over the session ($0.73) itemizes into the 157, the one-shot, and smoke probes.
- Prior family file: `stage1_sweep2-qwen35-397b-strict-v01_20260811_045942.json` (87.9%, local vLLM serve — endpoint differs from today's cloud row, noted in the post).
- n=3 follow-up: run2 `stage1_cal-qwen4-max-or-strict-v01-run2_20261116_115747.json` (132/157, 84.1%), run3 `...-run3_20261116_122542.json` (123/157, 78.3%); mean 127/157 (80.9%), range 123–132, zero errors all runs, effort=none on all 471 rows. All raw files in the Knowledge Base link above.
- Rank computed olympic-style from all zero-error 157 files on disk; 32 distinct models sit above the 80.9% three-run mean.
- The one-shot post for this model is [here](/blog/2026-11-16-qwen4-max-aurora-one-shot); the craft post and scored test are separate artifacts and never mix totals.
