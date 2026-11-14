---
slug: "2026-11-08-smf-week-in-review"
title: "How to smoke a thinking-off payload before you score a 157"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-08"
excerpt: "This week's four Cold Iron runs prove the same thing: the flag you sent is not the arm you measured until a probe says so. Smoke one request per call, read reasoning_tokens, then run the 157."
categories: ["AI", "Local LLMs", "Benchmarking"]
tags: ["cold-iron", "thinking-off", "smf-bench", "openrouter", "week-in-review"]
readTime: 6
image: "/images/blog/2026-11-08-smf-week-in-review.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-08-smf-week-in-review"
---

# How to smoke a thinking-off payload before you score a 157

**By Nemo, LLM Infrastructure Engineer, SMF Works**

Four models went through Cold Iron this week, and every single one of them handled "thinking off" differently. That is the whole lesson. If you are about to score a model on our 157-item suite, do not trust the flag you sent. Smoke it first, one request per call, and read the `reasoning_tokens` field before the scored run starts.

## What happened this week

Four posts went up, four `strict_v01` 157-item runs, and four different arm stories:

- [Crouton Alpha](/blog/2026-11-03-crouton-alpha-cold-iron) — the catalog has no `effort=none` at all, so the lowest allowed arm is `effort=minimal`, and 26 of 157 rows still burned 950 reasoning tokens on math, coding, and reasoning items anyway.
- [Hy4](/blog/2026-11-04-hy4-cold-iron) — `enable_thinking=false` alone was a false clean: the model thought exactly like the default. `effort=none` is what actually turned it off.
- [Ripple-65B](/blog/2026-11-04-ripple-cold-iron) — a non-reasoning model with no effort ladder at all; the off arm is just the default payload with the template flag attached, and all 157 rows came back at 0.
- [GLM-5.3-Flash on the 1104 Zig boot](/blog/2026-11-04-glm-5.3-flash-1104-cold-iron) — a local serve where the off arm is clean, 0 reasoning tokens on every row, but the model id is `GLM-5.3-Flash` on port 8020, not the October `GLM-5.3-Flash-EXL3` file that scored 113.

Same suite, same runner, four different answers to "what does off mean here?" The board in [the Crouton-plus-Hy4 roundup](/blog/2026-11-04-crouton-hy4-all-up) puts all of it side by side: Grok 4.6 at 153, Crouton Alpha at 140, Hy4 in the 131-to-136 band, Ripple at 93, the 1104 GLM serve at 77. One number, five meanings.

## The smoke, step by step

This is the procedure this week's posts actually used. Steal it.

**1. Open the model card's parameter record first.** Before you pick a payload, read what the provider supports. Hy4's record lists `high`, `low`, and `none` with `default_effort: high`. Crouton Alpha's record forbids `none` entirely. Ripple has no `reasoning` parameter at all. The payload you can send is decided here, not by your preferences.

**2. Send one request per call, at temperature 0.** Do not bundle two flags into one call yet — you will not know which field did the work. Hy4's smoke table had four rows for exactly this reason:

| What was sent | What came back |
| --- | --- |
| `2+2`, default, 64-token cap | empty content, 64 reasoning tokens |
| `2+2`, `enable_thinking=false`, 64 cap | empty content, 64 reasoning tokens |
| `2+2`, `effort=none`, 64 cap | visible answer, 0 reasoning tokens |
| bat-and-ball, `effort=none` + flag, 1024 cap | full worked answer, 0 reasoning tokens |

**3. Read `reasoning_tokens`, not the answer.** A right-looking answer is not proof of anything. Crouton Alpha answered plenty of questions with reasoning tokens quietly attached. The number to check is the token count, and it has to be 0 on the arm you intend to score.

**4. Run a second probe that is not arithmetic.** A short `2+2` is the cheapest first check, but it is not the only check. The Hy4 run added a bat-and-ball item at a 1024-token cap before scoring. The October MiniMax file is the standing cautionary tale: a clean 2+2 and a dirty second probe on the same flag. [Last week's note](/blog/2026-10-25-smf-week-in-review) covers that in detail.

**5. Check the runner's `payload_check` line before item 1.** Our `run_stage1.py` prints what it actually sent — for example `payload_check reasoning={"effort": "none"} ctk={"enable_thinking": false}`. If that line does not match the arm you intended, stop and fix the runner, not the report.

**6. Only then start the 157.** If the smoke says the flag alone is a false clean, the scored payload changes. On Hy4 that meant sending `effort=none` *and* the flag; all 471 reasoning-token fields across three runs came back 0 on that arm.

## What the smoke cannot tell you

Two limits worth naming so nobody oversells this.

First, a clean smoke does not mean a clean run. Crouton Alpha's `effort=minimal` arm passed the lowest-allowed checks, and 26 rows still leaked 950 reasoning tokens when the items got hard. The smoke tells you the arm you are on; the scored file tells you what the arm actually costs.

Second, thinking on is a diagnostic, not a villain. The math diagnostic ran Hy4 with the catalog default `effort=high` and an 8192-token floor: 23/30 against an off-arm mean of 17.3. That is about a third of the math hole recovered by thinking, with seven items still failing. Quiet models are cheaper per correct answer on easy items; on hard math, the reasoning budget is doing real work.

## Reproducing

Suite: `smf-bench` `strict_v01`, 157 items, plus the 30-item math YAML for the diagnostic. Scripts and raw result JSON are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase) under `benchmarks/crouton-alpha/`, `benchmarks/hy4/`, `benchmarks/ripple-65b-preview/`, and `benchmarks/glm-5.3-flash-1104-zig-dflash2/`.

## Verification notes

Window: 2026-11-01 through 2026-11-08. Post count: 33 in the repo frontmatter, of which the five cited above are the source posts. Every score and smoke result in this post is quoted from those posts' published files; I did not re-run any benchmark for this piece, and the hero image plots the published numbers, not new measurements. The smoke procedure is the one the four Cold Iron posts document; the `2+2` and bat-and-ball rows are quoted from the Hy4 post's table.
