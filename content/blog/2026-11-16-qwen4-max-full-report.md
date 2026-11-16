---
slug: "2026-11-16-qwen4-max-full-report"
title: "Qwen4 Max, the Full Report: One Sentence, 471 Tests, and a Family Wobble Confirmed"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-16"
excerpt: "Everything we measured on Alibaba's new flagship in one place: a clean one-shot WebGL page, three full Cold Iron runs averaging 80.9% with zero errors, and the math regression its own family can't shake."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["qwen", "qwen4-max", "cold-iron", "one-shot", "benchmarks"]
readTime: 12
image: "/images/blog/2026-11-16-qwen4-max-full-report.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-16-qwen4-max-full-report"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

We spent today on Qwen4 Max, Alibaba's new flagship, and this post is the whole story in one place: what it's like to use, what it scored, where the ranges settled after three full runs, and who should actually buy it. If you only want the verdict, skip to the last section. If you want the receipts, every table below is measured from raw files you can download.

The two test-specific posts are [the one-shot](/blog/2026-11-16-qwen4-max-aurora-one-shot) (AURORA, the WebGL page it built from one sentence) and [the first Cold Iron run](/blog/2026-11-16-qwen4-max-cold-iron). This post adds the part neither could give you alone: the n=3 picture and the session-wide accounting.

## The model, in one paragraph

Qwen4 Max (`qwen/qwen4-max`, canonical `qwen/qwen4-max-20261115`) is Alibaba's flagship on OpenRouter, served by Alibaba itself. It takes text, images, **and video** as input, the only model on our board that eats video, with a 1M-token context and a 131,072-token completion cap. Pricing is $1.50/$4.50 per million tokens. The catalog lists reasoning as optional (efforts xhigh, high, low, none; default on at high). That last detail matters more than it sounds, and the next section is why.

## The thinking-off story is genuinely good

The core question for any new model on our board is: does it run Cold Iron honestly? Cold Iron is our 157-test suite scored with thinking off, and models cheat in two ways, some refuse to disable reasoning (mandatory-reasoning families get scored on the lowest effort that answers, an "analogue arm"), and some quietly ignore the disable flag.

Qwen4 Max did neither. We smoked every path before the run:

| Probe | Result |
|---|---|
| Default (2+2) | Thinks, 13 reasoning tokens |
| `enable_thinking=false` | **Ignored**, still 13 reasoning tokens |
| `reasoning: {effort: none}` | Clean "4", **0 reasoning tokens** |
| Bat-and-ball trap at none | **$0.05, correct**, 0 reasoning tokens |

So the flag everyone reaches for doesn't work on this model, but the effort that does is a *true* off. All three Cold Iron runs went out at effort=none, and all 471 requests across them came back with **zero reasoning tokens**. No analogue asterisk anywhere in this report, Qwen4 Max is scored on the same footing as every model that can genuinely shut up and answer.

## The one-shot: AURORA

Handed the series' 81-byte brief, "create the most beautiful and stunning single HTML file you can possibly imagine", Qwen4 Max returned **AURORA**, a 46,506-byte WebGL page: procedural aurora curtains over a parallax starfield, a draw-your-own constellation, drifting dust, a real-time synthesized ambient pad behind an Ambience button, and Scatter/Clear controls. It ships byte-for-byte at [/demos/qwen4-max-aurora](https://www.smfclearinghouse.com/demos/qwen4-max-aurora).

| Metric | Value |
|---|---|
| Request id | `gen-1794827560-5G4tiKIgwGa4jLIGjXEP` |
| Wall clock | 333 s (5.6 min) |
| Completion tokens | 21,835 (5,601 reasoning, **26%** of output) |
| `node --check` | pass, first try |
| Finish | stop, no length cut, no repair |
| Cost | $0.098 |

Two things to compare against the rest of the series. First, the error budget: no boot-order bugs, no splice artifacts, no mid-function truncation, the single script block passed syntax checking outright, which about half of our one-shot models manage. Second, the thinking discipline: 26% of output tokens spent reasoning, versus the 75% some agentic models burn before writing a line. This model plans like an engineer, not a novelist.

The full HTML fence is in [the one-shot post](/blog/2026-11-16-qwen4-max-aurora-one-shot), exactly as returned.

## Cold Iron, three times: the mean and the wobble

After the first run (126/157, 80.3%), we ran the identical suite twice more the same morning, same endpoint, same payload, effort=none throughout. Here is every number the three runs produced:

| Run | Passed | Rate | Wall | Cost |
|---|---|---|---|---|
| 1 | 126/157 | 80.3% | 25.7 min | $0.3640 |
| 2 | 132/157 | 84.1% | 26.3 min | $0.3515 |
| 3 | 123/157 | 78.3% | 26.2 min | $0.3423 |
| **Mean** | **127/157** | **80.9%** | 26.1 min | $1.058 total |

**The range is 9 tests wide (123–132, about 5.7 points).** That's real run-to-run variance, and it's why we don't let one run carry a verdict. Per-category means across the three runs:

| Category | Mean | Per-run scores |
|---|---|---|
| Tool calling | 2.0/2 (100%) | 2, 2, 2 |
| Instruction following | 27.3/30 (91.1%) | 28, 27, 27 |
| Coding | 26.7/30 (88.9%) | 25, 28, 27 |
| Prose | 26.7/30 (88.9%) | 26, 28, 26 |
| Reasoning | 24.3/30 (81.1%) | 26, 25, 22 |
| Writing | 3.3/5 (66.7%) | 4, 3, 3 |
| **Math** | **16.7/30 (55.6%)** | **15, 19, 16** |

Three findings survive every run:

**Zero errors is a character trait, not luck.** 471 requests, zero HTTP errors, zero retries, zero length cuts. p95 latency 26.4 s, mean 9.9 s. Whatever else this model is, the plumbing is the best we've measured on the cloud this month.

**Math is the weak leg, and it's structural.** It never scored above 19/30 on math, and 7 math items failed all three runs. Difficulty analysis from run 1 showed every miss at medium difficulty or above, the floor holds, the ceiling doesn't.

The family wobble is real. The predecessor, qwen3.5:397b, scored 87.9% on this same suite (27/30 math) as a local vLLM serve, endpoint differs, so treat it as directional. But the *entire* qwen4-max range, 123 to 132, sits below 138.1. That's not sampling noise; a 5.7-point spread can't reach a 7.6-point gap. The new flagship lost math ground to its own family while gaining coding (+7.8 points on the mean).

## What the spread means when you read benchmarks

The item-level data is the most useful thing in this post. Of 157 tests, **113 passed all three runs, 14 failed all three, and 30 flipped at least once, about 19% of the suite is coin-flip territory for this model.** Math is the noisiest category: 12 of 30 math items flip. So if you benchmark a model once and it aces the math section, you learned less than you think.

One quirk did reproduce: a SyntaxError where the model wrote a superscript ⁹ (U+2079) into Python, in 2 of 3 runs on the same item. Not the em-dash-in-code disease other models caught, just a unicode-digit slip that a one-line system prompt would fix.

Olympic standing: rank **#33 of 56** on the mean, with 32 distinct models above it. For scale, grok-4.6 leads at 97.5% and the current reasoning pack (Fable 5.2, muse-wonder) sits in the 92–94 range on their respective arms.

## The accounting

Every dollar of today's session, itemized from the provider's key usage delta ($430.7807 → $431.9452 = **$1.1645**):

| Item | Cost |
|---|---|
| Cold Iron × 3 | $1.0577 |
| One-shot generation | $0.0983 |
| Smoke probes (5 requests) | ~$0.0085 |

The per-row `usage.cost` sums match the key delta to within the smoke probes, which is the cleanest reconciliation we've had on a multi-run day.

## Who should buy this

Buy it if you: you need video-in-text-out (it's the only board model with it), or your workload is agent loops, code, tools, instruction following, where it scores 89–100% on the means and runs with flawless plumbing. At 80.9% mean with zero operational failures, it will not surprise you mid-production.

Skip it if you: your workload is math-heavy (its own predecessor is better at it), or price-sensitive (models around rank #20 cost a fraction per run, muse-ember's suite cost a twentieth of this one).

The one-sentence verdict: a mechanically perfect, mid-board generalist whose own family's math score is the strongest argument against it.

## Reproducing this

Benchmark scripts and all four raw result files (three Cold Iron runs + one-shot meta) are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/qwen4-max). The runner is `smf-bench/run_stage1.py` with the qwen4-max branch (pops the chat-template flag, sends `reasoning: {effort: none}`); the wire payload is verified by the runner's `payload_check` line before every launch:

```bash
python3 run_stage1.py --endpoint https://openrouter.ai/api/v1 \
  --model qwen/qwen4-max --tag cal-qwen4-max-or-strict-v01 \
  --core-profile strict_v01 --thinking off --timeout 300
```

One-shot: the 81-byte series brief via the streaming script, `MAX_TOKENS=65536`, temperature 0.7, no reasoning override.

## Verification notes

- Catalog facts (context 1,000,000; max completion 131,072; $1.50/$4.50 per 1M; reasoning optional, efforts xhigh/high/low/none, default high) from `GET /v1/models` with our key, 2026-11-16.
- All Cold Iron figures from the three result JSONs on disk: `stage1_cal-qwen4-max-or-strict-v01{,-run2,-run3}_20261116_*.json` (157 rows each, zero errors each, `reasoning_effort: null` field with effort=none in-payload and 0 reasoning tokens on every row).
- Smoke results (default/flag/effort=none/bat-and-ball) run 2026-11-16, one request per probe.
- One-shot figures from `meta.json` (gen-1794827560-5G4tiKIgwGa4jLIGjXEP) and the extracted 46,506-byte fence; the live demo serves the original bytes.
- Item-flip counts computed by joining the three runs on `test_id`; per-category means are simple averages of integer pass counts.
- Predecessor comparison caveat repeated: qwen3.5:397b was a local vLLM serve (2026-08-11 file), today's rows are OpenRouter cloud, directional, not measured-to-the-decimal.
- Cost is the sum of per-row `usage.cost`; the session-wide key delta ($1.1645) reconciles with those sums plus smoke probes.
- The two test-specific posts are separate artifacts; no totals are mixed between them and this report.
