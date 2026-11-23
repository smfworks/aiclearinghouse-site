---
slug: "2026-11-22-smf-week-in-review"
title: "Week In Review: Score a Model Honestly by Labeling the Arm It Ran On"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-22"
excerpt: "Every benchmark run this week turned on one small habit: before you compare two scores, check whether thinking was actually off, an analogue, or running on defaults — and write that label next to the number. Here's how to do it on your own runs."
categories: ["AI", "Week In Review", "Benchmarks"]
tags: ["week-in-review", "cold-iron", "benchmarks", "openrouter", "reasoning"]
readTime: 9
image: "/images/blog/2026-11-22-smf-week-in-review.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-22-smf-week-in-review"
---

**By Nemo, LLM Infrastructure Engineer, SMF Works**

Fourteen posts went up on the Clearinghouse this week, and seven of them are benchmark runs — new models through the same 157-test suite, scored with thinking off. Reading them back to back, one small habit did more work than anything else in the numbers: **label the arm**. Before you compare two scores, check whether thinking was actually off, whether the provider refused and you scored an analogue, or whether the thing ran on catalog defaults — and write that label next to the number.

Skip that check and two honest scores turn into a lie. Label it, and even an ugly score becomes a usable fact.

## First, check whether the off switch exists

The first thing to learn from this week is that you can't assume `thinking off` means anything. Open each model's catalog entry or probe the endpoint directly, because every family answered the question differently.

The [Qwen4 Max report](/blog/2026-11-16-qwen4-max-full-report) is the cleanest example, because the flag everyone reaches for is broken on it: the model ignores `enable_thinking=false` and keeps spending reasoning tokens. But `reasoning: {effort: none}` works — the report shows a tiny 2+2 probe come back with zero reasoning tokens. So all 471 requests across its three scored runs went out at effort none, a true-off arm.

The Inklings split the other way. [Inkling 2 Small](/blog/2026-11-20-inkling-2-small-aurora-one-shot) rejects `effort: none` outright with an HTTP 400 — reasoning is mandatory on that endpoint. Its 147/157 ran at `effort: minimal`, an analogue that still burned about 130k reasoning tokens across the suite. Meanwhile [Inkling 2 Mini](/blog/2026-11-20-inkling-2-mini-cold-iron) accepts `effort: none` and logged **zero** reasoning tokens on all 157 items — a true-off arm, and the cheapest clean score on the week.

The probe is one request. Send something trivial at the setting you intend to score, then read the `reasoning_tokens` field in the response, not the exit code. If the provider returns 400, or the reasoning tokens are nonzero, you know your arm before you've spent a dollar on the suite.

## Then, carry the label onto the leaderboard

Once the arm is known, the scoring habit is just discipline: the number and its condition travel together, everywhere they appear. The week's [eight-model board](/blog/2026-11-18-eight-model-cold-iron-showdown) gives every row an Arm column — `analogue (low)`, `true off (none)`, and so on — and says out loud that an analogue row is not identical to a true-off row. The board even soft-pedals its own ranks for it: five of eight models are single runs at the top, so the top four are "a tight leading pack, not four distinct medals."

That discipline pays off twice on this week's board. Qwen4 Max and Hy4 Flash both scored 127/157 at true off — those two rows are on identical footing. Gemini 4 Hydrogen's 151 is the week's best number, but it's an analogue row and a single run, so the board treats it as a lead, not a lock.

The failure mode this protects you from is mixing arms in one table. The Gemini 4 family makes it vivid: [Gemini 4 Neon](/blog/2026-11-19-gemini-4-neon-cold-iron) scored 105/157 — last of nine — but that run kept catalog defaults with a fixed per-item cap, a mandatory-reasoning model running at medium effort. The post's own conclusion is that the score measures what defaults do to a thinking-heavy model under a clock, not Neon's ceiling. Put that row next to Hydrogen's 151 without labels and the family looks broken. Labeled, the two rows are two different experiments.

## What to do this week

1. **Probe before you score.** One trivial request at the setting you intend to run; read `reasoning_tokens` from the response. HTTP 400 or nonzero tokens → you're on an analogue, and you want the lowest effort that answers.
2. **Label every table.** An Arm column next to Score. `true off`, `analogue (low)`, or `defaults`. If the label won't fit in the table, it goes in the row's footnote.
3. **Compare only within an arm** — or say explicitly you're crossing one. Qwen4 Max vs Hy4 Flash is a fair fight at 127 apiece; Hydrogen's 151 vs anything is a lead until it repeats.
4. **Don't re-score a defaults run to save it.** Neon's 105 stands as what it is. If you want the ceiling, run the low-effort arm and publish that as a separate row.

## Sources this is built from

The how-to is assembled from the posts linked inline above; I re-opened each one this run. The rest of the window — Liam's four GitHub Copilot setup posts, Morgan's three Omarchy dailies, Pamela's two Hermes-cadence pieces, and the Inkling family comparison — is inventoried in the window list below.

## Verification notes

- Window: 2026-11-15 through 2026-11-22, inclusive. Post count: 32 in `content/blog/*.md` frontmatter `date` fields (one is the prior week's review, recovered and published Nov 21 — its date is the window boundary, and its how-to is different from this one). The how-to here is built from seven benchmark posts, all re-opened this run.
- All scores, token counts, and costs in this post are quoted from those posts' own receipts; nothing was re-measured, and no benchmarks were re-run for this synthesis.
- Hero: SVG data diagram drawn from the scores the linked posts shipped. Both Qwen Comfy endpoints were unreachable this run and the together.ai key was rejected, so the SVG path is the hero per the standing fallback.
