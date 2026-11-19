---
slug: "2026-11-19-gemini-4-neon-cold-iron"
title: "Gemini 4 Neon on Cold Iron: When Defaults Fight the Clock"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-19"
excerpt: "Google's new Gemini 4 Neon scored 105/157 (66.9%) on our 157-test suite with catalog defaults, last of nine. The twist: it's not weak, it's out of time. The numbers that explain it."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["openrouter", "cold-iron", "gemini-4-neon", "benchmarks", "reasoning"]
readTime: 10
image: "/images/blog/2026-11-19-gemini-4-neon-cold-iron.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-19-gemini-4-neon-cold-iron"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Yesterday's [eight-model showdown](/blog/2026-11-18-eight-model-cold-iron-showdown) had a clear top tier: Gemini 4 Hydrogen at 96.2%, two GPT-6.2s in the mid-90s, Gemini 4 Carbon at 93.6%. Today Google put a new sibling on the board, Gemini 4 Neon, and we ran it through the same 157-test gauntlet under the same rule Michael set for today: **defaults on, no tuning**. It scored 105 of 157, 66.9%, ninth of nine. And the reason it lost is more interesting than the score.

## The setup, honestly labeled

Cold Iron is our scored 157-test suite: math, coding, reasoning, instruction following, prose, writing, and tool calling, all deterministic, all graded by regex or unit test. "Thinking off" is the ranking default, but Neon is a mandatory-reasoning model: tell it to stop thinking and the provider returns HTTP 400; send a legacy thinking-off flag and it burns its whole token budget on hidden reasoning and returns nothing. So the arm we ran is the one a real user gets without touching anything: **catalog default effort (medium), plain payload**. We've labeled every model's arm in these posts, and this one is "defaults," not "true off." Nothing was tuned; that's the point of the exercise.

| Setting | Value |
|---|---|
| Model | `google/gemini-4-neon` (canonical `gemini-4-neon-20261118`) |
| Endpoint | OpenRouter cloud |
| Suite | strict_v01, 157 tests |
| Payload | no `reasoning` key, no legacy flags — catalog default (medium) |
| Errors | 0 |
| Wall time | 3,996.7 s (66.6 min) |
| Cost | **$6.44** (sum of per-row `usage.cost`) |
| Reasoning tokens | 397,739 total |

## The board

| Rank | Model | Pass rate | Arm | Cost | Wall |
|---|---|---|---|---|---|
| 1 | Gemini 4 Hydrogen | 96.2% | ctk off + effort=low | $1.62 | 23.2 min |
| 2 | GPT-6.2 Astra Pro | 95.5% | effort=low | $4.94 | 18.0 min |
| 3 | GPT-6.2 Sol Pro | 94.9% | effort=low | $1.25 | 12.9 min |
| 4 | Gemini 4 Carbon | 93.6% | effort=low | $0.79 | 43.6 min |
| 5 | Claude Fable 5.2 | 90.9% (mean, n=3) | effort=low | ~$3.35 | ~18 min |
| 6 | GLM 5.3 Prime | 86.0% | effort=low | $0.52 | 13.9 min |
| 7 | Qwen Qwen4 Max | 80.9% (mean, n=3) | effort=none | ~$0.35 | ~26 min |
| 7 | Tencent Hy4 Flash | 80.9% | effort=none | $0.01 | 9.4 min |
| 9 | **Gemini 4 Neon** | **66.9%** | **defaults (medium)** | **$6.44** | **66.6 min** |

Neon is the slowest and the most expensive run on the board. Those two facts have the same cause.

## The cap fight

The suite sets a per-item answer budget of 4,096 tokens. Neon at medium effort wants to think, hard, about hard questions. On 22 of the 30 math items it spent the entire budget on reasoning and hit the cap before writing a final answer. No final answer, no regex match, fail. Those items weren't wrong; they were unfinished. The same pattern, in miniature, sank 15 of the 30 coding items and 9 of the 30 prose items.

Here's the same family, same items, at the lowest effort that still lands an answer, run yesterday:

| Category | Carbon (effort=low) | Hydrogen (low) | **Neon (defaults/medium)** |
|---|---|---|---|
| Math | 23/30 | 27/30 | **7/30** |
| Coding | 30/30 | 30/30 | **15/30** |
| Reasoning | 29/30 | 29/30 | 28/30 |
| Instruction | 30/30 | 30/30 | 29/30 |
| Prose | 29/30 | 29/30 | 21/30 |
| Writing | 4/5 | 4/5 | 3/5 |
| Tool calling | 2/2 | 2/2 | 2/2 |

The categories where the model can answer within its budget look perfectly healthy: 28/30 on reasoning, 29/30 on instruction following, a clean 2/2 on tool calling. Nothing errored. The model was never confused; it was never done in time.

You can watch it in the per-item data. A failed math item shows `finish_reason: length`, exactly 4,096 reasoning tokens burned, empty answer slot. A passed one often finishes `stop` at 100–3,000 reasoning tokens. Carbon's identical item at low effort: 0 reasoning tokens, instant `stop`, correct answer.

## Is Neon bad?

No. What today's run measures is **what happens when a thinking-heavy model meets a fixed per-item budget at medium effort**. It does not measure Neon's ceiling. The obvious next experiment is the same suite at `effort: low`, which is what every other mandatory-reasoning model on this board ran, and where Carbon's score of 93.6% suggests this family's low arm lives. We haven't run it yet, and we don't publish numbers we haven't measured. If you need a Neon score for a purchasing decision today, treat 66.9% as "defaults, per-item cap binding," not as the model's best.

What today's run does tell you, firmly:

1. **If you use Neon with default settings on metered, budget-capped endpoints, hard tasks will time out unfinished.** Name the effort yourself.
2. **The model itself is fine.** 397,739 reasoning tokens with zero errors and a 28/30 reasoning score means the machinery works; the default dials are just set for a longer exam than the suite gives.
3. **Cost scales with thinking.** Neon's $6.44 is the most we've spent on a single Cold Iron run, twice Astra Pro's $4.94, and most of it burned on answers that never got written.

## The one-shot, for contrast

Give Neon a creative task with a giant budget and the same default thinking, and it shines: the biggest page our one-shot test has ever produced (53.9 KB), zero syntax errors, thirty cents, under three minutes. That's the same model, same day, same defaults. The difference is the budget. The creative brief effectively had 943,718 tokens of headroom; the suite gives each item 4,096. The full story, with the page itself embedded, is in [the companion one-shot post](/blog/2026-11-19-gemini-4-neon-oneshot-aetherium).

## What we'd tell you to do

If you're trying Neon this week: use it for big-canvas creative work and coding at its defaults, where the token budget is roomy. For anything scored, timed, or capped, set `reasoning: {"effort": "low"}` (or higher, if you're paying by the minute) and expect the score to move a lot. We'll run the low arm when we test the next family member, and we'll link it here.

## Verification notes

Every number here comes from the saved results JSON on disk (`stage1_cal-gemini-4-neon-or-strict-v01_20261119_151325.json`), the OpenRouter `/v1/models` catalog (read 2026-11-19), and the runner's payload check. Cost is the sum of per-row OpenRouter `usage.cost` fields. Session key delta was $6.7224 against a measured $6.7432 (both runs), a $0.02 gap noted in the companion post. The eight-model rows reuse the measured runs from 2026-11-18 linked above; fable-5.2 and qwen4-max rows are n=3 means, everything else n=1. Scripts and raw JSON are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase).
