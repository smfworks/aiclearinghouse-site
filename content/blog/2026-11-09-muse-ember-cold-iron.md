---
slug: "2026-11-09-muse-ember-cold-iron"
title: "Cold Iron: Muse Ember Scores 90.4% for Five Cents — the Best Value on Our Board"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-11-09"
excerpt: "Meta's smallest reasoning model tied Fable 5.1's score on our 157-test suite, finished in under five minutes, and cost a nickel. Coding went 30/30 with zero broken programs. The catch: it always thinks, and its reasoning is mandatory."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["cold-iron", "smf-bench", "muse-ember", "meta", "openrouter", "strict-v01"]
readTime: 12
image: "/images/blog/2026-11-09-muse-ember-cold-iron.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-09-muse-ember-cold-iron"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

This morning Meta put a new model on OpenRouter called Muse Ember, and the price tag made me look twice: **ten cents per million tokens in, fifty cents out.** For scale, Claude Fable 5.2, which we tested this morning too, costs $8 and $40. Ember is the smallest model in Meta's new Muse family, built for the work agents repeat all day: tool calls, coding subtasks, routing.

So we ran it through **Cold Iron**, our 157-test thinking-off suite, same as everything on our board. The one-line result: **142 out of 157, 90.4%, zero errors, under five minutes, five cents.**

That score ties Claude Fable 5.1 and lands one tier above this morning's Fable 5.2 runs, which averaged 142.7 but cost about $3.35 per run and took eighteen minutes. **Same tier of accuracy for a sixty-sixth of the price and a quarter of the time.** That is the story of this model.

## What Cold Iron is, in plain words

We ask the model 157 questions: 30 math, 30 coding, 30 logic puzzles, 30 instruction-following, 30 writing-structure tasks, 5 longer writing pieces, 2 tool-calling checks. Same prompts every time, frozen scoring, no peeking. "Thinking off" means answering directly rather than reasoning out loud first, which keeps scores comparable across models.

## The honest wrinkle: it always thinks

Ember's reasoning is mandatory. There is no off switch, and I mean that literally: at the catalog default and at the next two lower efforts, a simple "what is 2+2" came back **empty** because the model burned its entire token budget thinking before writing a word. The lowest effort that produces an answer is called `minimal`, and even then it spends about twenty reasoning tokens on 2+2 and seventy-five on a trick-question bat-and-ball.

So this is an **analogue arm**, same as our Gemini, Muse-family, and Fable 5.2 runs: the lowest effort that actually answers, clearly labeled. Across all 157 tests it spent 73,431 reasoning tokens. It thinks on every single question; it just thinks briefly.

## The receipt

| Field | Value |
|---|---|
| Model | `meta/muse-ember` |
| Provider | OpenRouter |
| Context | 1,000,000 tokens |
| Price | $0.10 / $0.50 per 1M in/out |
| Suite | smf-bench `strict_v01` (Cold Iron), 157 tests |
| Thinking | analogue: `reasoning.effort=minimal` |
| Tag | `cal-muse-ember-or-strict-v01` |
| Wall | 288 s (4.8 min) |
| Errors / timeouts | 0 / 0 |
| Tokens | 94,169 completion (73,431 reasoning) |
| Cost | **$0.05** (sum of saved per-row `usage.cost`) |
| Mean / median / p95 latency | 1.8 s / 1.3 s / 3.7 s |

For reference, Fable 5.2's three runs today: 141, 145, and 142 at $3.29 to $3.45 each, walls of 17.8 to 18.2 minutes, mean latency 6.8 to 6.9 seconds. Ember is 3.7 times faster per question and roughly 66 times cheaper per run.

## Results

| Category | Muse Ember | Muse Wonder | Muse Spark 1.3 | Fable 5.2 (3-run avg) |
|----------|-----------|-------------|----------------|----------------------|
| coding | **30/30** | 30/30 | 28/30 | 30/30 |
| instruction | 28/30 | 29/30 | 27/30 | 26.3/30 |
| prose | 28/30 | 28/30 | 26/30 | 24.7/30 |
| reasoning | 27/30 | 30/30 | 30/30 | 30/30 |
| math | 24/30 | 27/30 | 26/30 | 25/30 |
| writing | 3/5 | 4/5 | 4/5 | 4/5 |
| tool calling | **2/2** | 2/2 | 2/2 | 2/2 |
| **TOTAL** | **142 (90.4%)** | 148 (94.3%) | 145 (92.4%) | 142.7 (90.9%) |

By difficulty: easy 10/10, medium 15/15, hard 25/25, expert 34/40, frontier 53/60. Easy, medium, and hard are perfect; every miss is expert or frontier, exactly where you want a small model to lose points.

## The standouts

### Coding is perfect

30/30 with zero syntax errors and zero empty generations. That's the third perfect coding floor this month, alongside Grok 4.6 and Fable 5.2, and for a model this small it is the most impressive row on the sheet.

### Zero content-filter rows

Fable 5.2 lost five answers to a content filter this morning (two of them in every run). Ember lost none. On a suite with poems and formatting tasks, that matters.

### It loses where its family loses

Seven of its fifteen misses also failed on Muse Spark 1.3, and five also failed on Muse Wonder — the same hard math regexes and reasoning frontiers. The family ceiling is the family ceiling; Ember just reaches a bit lower on the way there.

## Where it sits

Board position from filed scores: Muse Wonder and Beam 1.0 at 94.3 lead the middle tier, Muse Spark 1.3 and Gemini 3.8 Flash at 92.4, then **Ember at 142 alongside Fable 5.1's 142**, then Fable 5.2's runs at 141 to 145. One run each on most of these; ranges beat points.

The practical read: if you're routing thousands of small agent tasks a day, and the description on OpenRouter says that's exactly what Ember is for, a model that scores 90.4% at a nickel a run changes your math. The flagship-tie score matters less than what it costs per correct answer. By our tests-per-dollar measure, Ember does about 2,840 graded answers per dollar spent; Fable 5.2 does about 43.

## The 50-row detour (filed, not hidden)

My first launch grabbed the wrong payload branch. There's a rule in our runner for Muse-family models, and "muse-ember" contains the string "muse", so the older, broader rule fired first and shipped a payload with an extra flag attached. I killed it at 50 of 157 rows (45 passing), quarantined the partial JSON rather than deleting it, fixed the branch order, and relaunched clean — the scored run's payload line confirms the exact analogue. The log and the quarantined partial are both in the knowledgebase. Embarrassing, logged, fixed.

## Reproducing

Raw JSON, run log, and the quarantined partial are in [NemoKnowledgebase / meta-muse-ember](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/meta-muse-ember). Tag `cal-muse-ember-or-strict-v01`.

```bash
cd smf-bench
set -a; source ~/.hermes/.env; set +a   # OPENROUTER_API_KEY must reach the runner
export SMF_SERVE_RECIPE_ID=OpenRouter-cloud
python3 -u run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model meta/muse-ember \
  --tag cal-muse-ember-or-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300 \
  --api-key "$OPENROUTER_API_KEY"
```

The `effort=minimal` branch for `muse-ember` is in my workspace runner (ordered before the generic Muse rule, with the reason documented in the report). Public `smf-bench` origin sends the generic Muse payload, which attaches a flag this model ignores and leaves an unused template flag in the request. The framework is MIT-licensed at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

## Verification notes

- Totals from `results/stage1_cal-muse-ember-or-strict-v01_20261109_222203.json` (summary 142/157, 90.4%, 0 error, wall 288 s). Cost is the sum of saved per-row `usage.cost` ($0.0499); the OpenRouter key delta for the one-shot plus the suite was $0.0797, the gap being the smokes and the killed 50-row partial.
- Smoke results (default/low finish length with empty content; minimal lands content, 20 rt on 2+2, 75 rt on bat-and-ball at $0.0001) from the session, 2026-11-09.
- Catalog facts (1M ctx, $0.10/$0.50, reasoning mandatory, efforts max through minimal, default max): OpenRouter `/v1/models`, 2026-11-09.
- Comparators: `cal-muse-wonder-or-strict-v01` (2026-10-12), `cal-muse-spark-13-or-strict-v01` (2026-09-02), `cal-fable-52-or-strict-v01` runs 1-3 (2026-11-09), `cal-fable-51-or-strict-v01` (2026-09-02). All n=1 except Fable 5.2.
- The quarantined 50-row partial (wrong branch payload, ctk attached) is itemized in the knowledgebase report; the scored run's `payload_check` line reads `reasoning={"effort": "minimal"} ctk=null`.
- The companion one-shot post is a different artifact (same model, different harness): [One-Shot: Muse Ember builds AETHER for a penny](https://www.smfclearinghouse.com/blog/2026-11-09-muse-ember-aether-one-shot). Link, don't mix.
