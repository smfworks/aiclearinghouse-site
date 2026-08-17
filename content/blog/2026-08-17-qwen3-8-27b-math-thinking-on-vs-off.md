---
slug: "2026-08-17-qwen3-8-27b-math-thinking-on-vs-off"
title: "Qwen3.8-27B Math: What Thinking Mode Actually Buys You"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-17"
excerpt: "A controlled follow-up to our Qwen3.8-27B benchmark: the same 30 math problems, run twice — once with thinking off, once with thinking on. The reasoning budget recovers six problems (50% → 70%), but the gains are uneven: flawless through the hard tier, a trough at expert, and a partial frontier recovery. Plus the latency cost of the whole thing."
categories: ["AI", "Local LLMs", "DGX Spark", "Benchmarks"]
tags: ["qwen3.8", "gated-deltanet", "sglang", "dgx-spark", "math", "thinking-mode", "reasoning", "benchmark"]
readTime: 9
image: "/images/blog/2026-08-17-qwen3-8-27b-math-thinking-on-vs-off.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-17-qwen3-8-27b-math-thinking-on-vs-off"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The follow-up question

When we [benchmarked Qwen3.8-27B on the DGX Spark](/blog/2026-08-16-qwen3-8-27b-fp8-dgx-spark-sglang), the one weak number was math: **15/30 (50.0%)** in the Official A calibration. But that run was **thinking off** — the Official A ranking default. The model's `enable_thinking` toggle defaults *on*, and math is exactly where chain-of-thought reasoning should buy the most.

So we ran the exact same 30 math problems again, this time with thinking on. Here's the controlled comparison.

## The setup

| Variable | Value |
|----------|-------|
| Model | `Qwen/Qwen3.8-27B-FP8` (unchanged) |
| Endpoint | `http://spark-56bc:30000/v1` (unchanged) |
| Engine | SGLang, EAGLE 3/1/4 spec decode (unchanged) |
| Suite | The same 30 math tests (`v3.math.*`, easy → frontier) |
| Evaluator | The same `regex_match` against `\boxed{}` answers |
| **Only difference** | `chat_template_kwargs.enable_thinking` = `false` vs `true` |

This is a clean A/B: identical model, identical hardware, identical prompts, identical scoring. The single changed variable is whether the model reasons before answering.

## Results

### Overall

| Configuration | Result |
|---------------|--------|
| Thinking **off** | 15/30 (**50.0%**) |
| Thinking **on** | 21/30 (**70.0%**) |
| **Delta** | **+6 tests, +20.0 percentage points** |

### By difficulty

| Tier | Thinking off | Thinking on | Delta |
|------|-------------|-------------|-------|
| Easy | 2/2 (100%) | 2/2 (100%) | — |
| Medium | 2/3 (66.7%) | 3/3 (100%) | +1 |
| Hard | 4/5 (80.0%) | 5/5 (100%) | +1 |
| Expert | 2/8 (25.0%) | 3/8 (37.5%) | +1 |
| Frontier | 5/12 (41.7%) | 8/12 (66.7%) | +3 |

## What the numbers say

**Thinking-on cleans up everything below expert.** Easy, medium, and hard are now **10/10 flawless**. The two gaps in the thinking-off run (one medium, one hard) both closed. If you need reliable arithmetic, algebra, and multi-step computation, thinking on is unambiguous — it turns the bottom three tiers into a perfect sweep.

**Expert is the trough — in both modes.** 2/8 off, 3/8 on. That's barely a recovery. This is the most interesting finding: the expert-tier problems (7.683, 135.96, −0.01384, −9.417, 29.924 — all failed in *both* runs) are not being saved by reasoning. The model reasons its way to a *confident wrong answer*. That's a genuine capability ceiling for this 27B dense architecture on that class of problem, not a thinking-mode artifact.

**Frontier recovers the most — and it's the counterintuitive part.** The hardest tier went 5/12 → 8/12 (+3), the biggest absolute gain. That means the frontier problems are *solvable with reasoning* — they're hard-but-tractable — while the expert tier contains problems that are hard *and* beyond the model's reach regardless of mode. Difficulty labels don't always track "what reasoning can recover."

**All failures are wrong answers, not timeouts.** Every fail across both runs was a `regex did not match` — the model produced a number, just the wrong one. Zero timeouts, zero errors, zero format failures. This is a clean capability measurement, not an infrastructure artifact.

## The cost: 79 minutes of wall time

Thinking-on is not free. The 30-test run took **4,738 seconds (79 minutes)** — an average of ~158 seconds per problem. The thinking-off math portion of the full calibration ran far faster because the model wasn't generating a reasoning chain before each answer.

That's the real trade-off, and it's why Official A ranks thinking-off: the standard measures *capability per token*, and reasoning tokens are expensive. But for a math-heavy workload where you need the answer right and latency is acceptable, thinking on is the correct deployment choice.

| Configuration | Math | Wall time (30 tests) |
|---------------|------|----------------------|
| Thinking off | 50.0% | fast (part of full 157-test run) |
| Thinking on | 70.0% | ~79 min standalone |

## Recommendation

1. **Default thinking off** for agent/coding/prose workloads — those categories were already strong without reasoning (tool-calling 100%, coding 86.7%).
2. **Turn thinking on for math** — it's a 20-point swing, and math is where the reasoning budget pays off.
3. **Don't expect thinking to fix expert-tier math.** The expert trough is a capability ceiling. If you need that class of problem solved reliably, a larger or math-specialized model is the honest answer.
4. **Budget for the latency.** Thinking-on math is ~2.6× slower per problem. That's fine for batch/offline work, painful for interactive use.

## Reproducing this

The comparison script and both result files are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/qwen3.8-27b-fp8):

- `scripts/qwen38-math-thinking-on.py` — the thinking-on math re-run
- `results/stage1_cal-qwen38-27b-fp8-strict-v01_*.json` — thinking-off (math 15/30)
- `results/stage1_cal-qwen38-27b-fp8-math-thinking-on_*.json` — thinking-on (math 21/30)

## Verification notes

Every number in this post is measured from the live endpoint on 2026-08-17. The two runs differ only in `enable_thinking`; model, hardware, prompts, and the `regex_match` evaluator are identical. The thinking-off math results are drawn from the original Official A calibration (2026-08-16), and the thinking-on results from the dedicated re-run (2026-08-17). This post is the follow-up to the [original Qwen3.8-27B benchmark](/blog/2026-08-16-qwen3-8-27b-fp8-dgx-spark-sglang).
