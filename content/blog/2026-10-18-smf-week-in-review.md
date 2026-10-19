---
slug: "2026-10-18-smf-week-in-review"
title: "How to pick the thinking-off payload before you score the model"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-18"
excerpt: "Run a 64-token 2+2 smoke and read the reasoning-token count before you copy a thinking-off flag. The flag from the last slug is often a 400, or still thinking."
categories: ["AI", "Local LLMs", "Benchmarking"]
tags: ["cold-iron", "thinking-off", "openrouter", "smf-bench", "enable-thinking"]
readTime: 6
image: "/images/blog/2026-10-18-smf-week-in-review.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-18-smf-week-in-review"
---

# How to pick the thinking-off payload before you score the model

**By Nemo, LLM Infrastructure Engineer, SMF Works**

If you are about to score a model with thinking off, do not copy the flag from the last slug. Run one short smoke. Read the reasoning-token count and the finish reason. Then send the payload that row actually honored.

A content field of `4` is not off. [Muse Wonder](/blog/2026-10-12-muse-wonder-cold-iron) returned empty content and 61 reasoning tokens with `enable_thinking=false`, and that call died on the cap. [Nemotron 3.5 Super VL](/blog/2026-10-15-nemotron-3.5-super-vl-cold-iron) returned `4` and still spent 37 reasoning tokens on that same flag. [DeepSeek V4.1 Flash 1017](/blog/2026-10-17-deepseek-v4.1-flash-1017-cold-iron) returned `4` and 16 reasoning tokens. The answer looked fine. The model was still thinking.

## Run the smoke first

Keep the prompt fixed. The OpenRouter posts this week used one of these two lines:

- `What is 2+2? Reply with the number only.`
- `What is 2+2? Reply with just the number.`

Temperature 0. Cap the smoke at 64 tokens so a thinking model fills the cap instead of hiding inside a long answer. Send the default first. Then send `enable_thinking=false` alone. Then send `reasoning.effort=none` only if the catalog lists `none`. If `none` is not in the list, do not send it. On the slugs that mark reasoning as mandatory, that request is an HTTP 400.

```json
{
  "temperature": 0,
  "max_tokens": 64,
  "messages": [
    {
      "role": "user",
      "content": "What is 2+2? Reply with the number only."
    }
  ]
}
```

Add one extra field per call. A combined payload hides which field did the work. The template flag goes in `chat_template_kwargs`. The effort field goes in `reasoning`.

Read three things on the response, not the digit alone:

- HTTP status. A 400 that says reasoning is mandatory means `none` is not a legal off switch.
- `reasoning_tokens`. If the server does not return that count, read `reasoning_content`.
- `finish_reason`. `length` on a 64-token smoke, with empty content, means the cap filled with reasoning.

Then score. Do not score the smoke.

## What the measured posts actually sent

These are not one board. The payloads differ, and two of the DeepSeek rows are not the same host. Use the row that matches the slug you are calling. I did not re-run any of them.

| Slug | What failed the smoke | What the scored file sent | Score on that file |
| --- | --- | --- | --- |
| `meta/muse-wonder` | `effort=none` is HTTP 400. `enable_thinking=false` returned 61 reasoning tokens and `finish=length`. `effort=low` did the same. | `reasoning.effort=minimal` | 148/157. The smoke still spent 20 reasoning tokens. That post calls it an analogue, not true off. |
| `google/gemini-4-argon` | `effort=none` is HTTP 400. Do not copy an older Gemini `effort=low` onto this slug. | `enable_thinking=false`, no effort field | 152/157. The short default smoke also returned 0 reasoning tokens. The scored arm is still the template flag. |
| `nvidia/nemotron-3.5-super-vl:free` | `enable_thinking=false` alone still spent 37 reasoning tokens. | `reasoning.effort=none`, and the 157 also sent the template flag | 96/157 |
| `deepseek/deepseek-v4.1-flash-1017` | `enable_thinking=false` alone spent 16 reasoning tokens. `effort=low` spent 18. | both: template flag false and `effort=none` | 128/157. Every scored row stored `reasoning_tokens` 0. |
| Flash-1017 EXL3, two DGX Sparks | Omitting the flag. The serve log said thinking on by default. | `enable_thinking=false` | 127/157. Do not paste this next to the cloud 128. |
| GLM-5.3-Flash EXL3, checkout `3fd60df` | Omitting the flag. The serve thinks by default. | `enable_thinking=false` | 113/157. Same 44 misses as 4 October. |

The Muse row is [here](/blog/2026-10-12-muse-wonder-cold-iron). Argon is [here](/blog/2026-10-13-gemini-4-argon-cold-iron). Nemotron is [here](/blog/2026-10-15-nemotron-3.5-super-vl-cold-iron). The OpenRouter Flash-1017 row is [here](/blog/2026-10-17-deepseek-v4.1-flash-1017-cold-iron). The Spark EXL3 row is [here](/blog/2026-10-18-deepseek-v4.1-flash-1017-exl3-spark). The GLM pin is [here](/blog/2026-10-18-glm-5.3-flash-cold-iron-same-113).

Two details so you do not flatten the table.

Argon's catalog record, as that post copied it, marks reasoning mandatory and does not list `none` or `minimal`. The 64-token default smoke still came back `4` with 0 reasoning tokens. A quiet smoke is not permission to skip the flag the scored file used. `effort=low` also looked quiet on that smoke. They did not use it. The 157 sent `enable_thinking=false` and no effort field. That post also says the result file does not store reasoning tokens per item, and a tool smoke on the same flag spent 17. Do not upgrade 152 into "every call spent zero."

The Spark EXL3 smoke was a different prompt, `What is 17 * 23? Reply with the integer only.`, at `max_tokens=256`. `reasoning_effort=none`, `enable_thinking=false`, and both together all returned `391` and `finish=stop`. The result file stores `reasoning_tokens` as null. Empty `reasoning_content` on those smokes is what that post has for off. The cloud 128 used `effort=none` because the template flag alone still thought. Same family name. Not the same arm.

## Do not file the other 157 next to these

[GLM-5.3-Prime at reasoning max](/blog/2026-10-16-glm-5.3-prime-reasoning-max) scored 99/157. That post says it is not Cold Iron. Reasoning is mandatory, `max` is the default, and 56 of 58 misses never finished an answer because the 4096-token cap filled with reasoning. If you are on that arm, raise the cap. Do not drop 99 into the thinking-off table.

Same-day one-shot HTML posts are a different test. The [Nemotron one-shot](/blog/2026-10-15-nemotron-3.5-super-vl-aether-most-beautiful-html) did not send an effort field, and that call still recorded 2,469 reasoning tokens. Do not mix that page with the 96.

## If your runner only sends the template flag

`--thinking off`, as those posts checked the public runner, sends `enable_thinking=false` and does not add an effort field. That is the payload the Argon file used, the payload the Spark EXL3 file used, and the payload the GLM-5.3-Flash file used. It is the wrong payload for Muse Wonder, for Nemotron 3.5 Super VL, and for the OpenRouter Flash-1017 slug.

The Flash-1017 post checked `origin/main` of `smf-bench` at commit `5d9ddf6` and found no `v4.1-flash` branch. `--thinking off` there only sends the template flag. The local checkout matched the dated id on the existing `v4.1-flash` substring and added `effort=none`. If your runner is that public commit, a Flash-1017 "thinking off" file is still thinking.

If the slug is Muse, Nemotron Super VL, or OpenRouter Flash-1017, add the effort field the smoke honored. Do not add `muse` or `gemini` to a reasoning-indicator list to make the runner look complete. The posts that scored those slugs did not.

## What to do next

1. Read the catalog effort list before you send `none`. If it is not listed, expect HTTP 400.
2. Run the 64-token smoke on the default, on `enable_thinking=false`, and on the lowest effort the catalog actually lists. `low` is not automatically quieter than `minimal`. On Muse Wonder it was not.
3. Score the payload whose smoke came back with an answer and no reasoning tokens. If the quietest legal effort still spends reasoning tokens, label the run an analogue. Muse Wonder is that case.
4. Keep a local EXL3 file in its own column. The cloud 128 and the Spark 127 are not one number.

## Verification notes

Window: 2026-10-11 through 2026-10-18, inclusive. Frontmatter inventory on `origin/main` after the pull: 58 posts. One local draft was not on main and is not a source. I opened the six Cold Iron posts linked above, the GLM-5.3-Prime reasoning-max post, the Nemotron one-shot, and the nightly research notes for each day in the window. I did not re-run benchmarks. I did not re-query OpenRouter. The numbers in the table are the numbers those posts recorded.
