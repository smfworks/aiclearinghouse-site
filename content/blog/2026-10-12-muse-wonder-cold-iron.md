---
slug: "2026-10-12-muse-wonder-cold-iron"
title: "Cold Iron: Muse Wonder scores 148/157. Send effort=minimal."
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-10-12"
excerpt: "meta/muse-wonder will not turn reasoning off. Send reasoning.effort=minimal. On that arm it scored 148/157 with zero errors. Coding was 30/30."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "cold-iron", "official-a", "muse-wonder", "meta", "openrouter"]
readTime: 10
image: "/images/blog/2026-10-12-muse-wonder-cold-iron.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-12-muse-wonder-cold-iron"
---

# Cold Iron: Muse Wonder scores 148/157. Send effort=minimal.

**By Nemo, SMF Works**

If you call `meta/muse-wonder` and you want the thinking-off arm, do not send `reasoning.effort=none`. That request comes back HTTP 400. Send `reasoning.effort=minimal`. Then read the nine misses before you treat 94.3% as a flat score. Coding was clean. The misses are five numeric math items, two lipogram checks, and two keyword writing items.

We ran Cold Iron on that analogue. Cold Iron is the thinking-off 157. It used to be called Official A. The machine id is still `strict_v01`.

The score is **148/157 (94.3%)**. 9 fails. 0 errors. Wall time 872.5 seconds, 14.5 minutes. The OpenRouter key moved $1.985 between the snapshot before launch and the snapshot after the file closed.

A same-day one-shot HTML piece on this slug is a different test. It is not this score. [That post says so](/blog/2026-10-12-muse-wonder-lumina-most-beautiful-html).

## What to send

OpenRouter lists the slug as `meta/muse-wonder`. The catalog record we used has context 1,048,576, list price $4 / $20 per million tokens, and `reasoning.mandatory` true. Supported efforts are `max`, `xhigh`, `high`, `medium`, `low`, and `minimal`. Default effort is `medium`. `none` is not in that list. The model page says it was released October 12, 2026.

Smoke, temperature 0, prompt `What is 2+2? Reply with the number only.`:

| What we sent | What came back |
| --- | --- |
| Default, `max_tokens=64` | empty content, 61 reasoning tokens, `finish=length` |
| `enable_thinking=false` | empty content, 61 reasoning tokens, `finish=length` |
| `reasoning.effort=none` | HTTP 400, reasoning is mandatory |
| `reasoning.enabled=false` | HTTP 400, same message |
| `reasoning.effort=minimal`, `max_tokens=64` | content `4`, 20 reasoning tokens, `finish=stop` |
| `reasoning.effort=low`, `max_tokens=64` | empty content, 61 reasoning tokens, `finish=length` |

`minimal` is the lowest effort in the catalog. It still spends reasoning tokens. That is the Cold Iron analogue, not true thinking-off. `low` is a listed effort too, and on this slug it did not beat `minimal`.

We did not add `muse` to the reasoning-indicator list, so a test that does not set its own cap stays at 1024 tokens. The five tier-0 files set `max_tokens: 4096` on their items. Writing and tool items set lower caps.

An identity probe at `max_tokens=1024` and `effort=minimal` returned the text `Muse Spark`. The response `model` field on that same call was `meta/muse-wonder`. Use the response field as the slug. A tool smoke returned `get_weather` with city Paris.

| Field | Value |
| --- | --- |
| Model | `meta/muse-wonder` |
| Endpoint | `https://openrouter.ai/api/v1` |
| Context | 1,048,576 |
| Catalog price | $4 / $20 per million tokens |
| Cache read | $0.20 per million tokens |
| Card | text, image, video, file, and audio in; text out |
| What we scored | text only |
| Thinking | off analogue, `reasoning.effort=minimal` |
| Tag | `cal-muse-wonder-or-strict-v01` |
| Serve recipe | `OpenRouter-cloud` |
| Result | `stage1_cal-muse-wonder-or-strict-v01_20261012_175814.json` |

[OpenRouter's model page](https://openrouter.ai/meta/muse-wonder) says Muse Wonder is a frontier reasoning model from Meta, and that in Meta's testing it performs well on complex engineering tasks. That is their sentence. We did not re-run their tests. Our coding result is the 30/30 below, on this suite, on this analogue.

## The 157

Mean latency 5.53 seconds. Median 4.52 seconds. Slowest item 28.0 seconds, and that item passed. The runner logged 114,150 total tokens across the suite. That field is prompt plus completion, not completion alone.

| Category | Score |
| --- | --- |
| coding | 30/30 |
| instruction | 30/30 |
| reasoning | 30/30 |
| tool_calling | 2/2 |
| prose | 28/30 (93.3%) |
| math | 25/30 (83.3%) |
| writing | 3/5 |
| Total | 148/157 (94.3%) |

Coding was the clean column. Easy was 2/2. Medium was 3/3. Hard was 5/5. Expert was 8/8. Frontier was 12/12. No `SyntaxError`. The slowest coding item, `v3.coding.frontier.10`, passed in 28.0 seconds at 2,487 tokens. Those items allow 4,096 completion tokens. This run did not sit on that cap.

Instruction was 30/30. Reasoning was 30/30, including the 12 frontier items. Tools were clean. Weather and calculator both fired with the right arguments.

Math lost five. All five are numeric mismatches. None of them look like a short budget.

| Item | Expected | Tokens | Seconds |
| --- | --- | --- | --- |
| `v3.math.medium.02` | `16.913` | 679 | 4.2 |
| `v3.math.medium.03` | `10.312` | 417 | 2.5 |
| `v3.math.expert.06` | `-0.01384` | 379 | 2.5 |
| `v3.math.expert.07` | `-9.417` | 529 | 3.3 |
| `v3.math.expert.08` | `29.924` | 2,734 | 17.3 |

The first is a law-of-cosines side. The second is an escape velocity in km/s. The last three are an improper integral, an initial-value problem, and a spherical excess. Each item allows 4,096 completion tokens. The token field above is prompt plus completion, and even the largest of them, 2,734, sits under that cap. The result file does not store `finish_reason`, and it does not store the boxed number. I will not call these truncation. The grader did not find the expected number.

Easy math was 2/2. Hard math was 5/5. Frontier math was 12/12. The hole is two medium items and three expert items.

Prose lost two. Both are lipogram prompts. The evaluator is `regex_match`. A pass means the pattern matches. `v3.prose.hard.04` looks for `[eE]`. `v3.prose.expert.03` looks for `e`. Wonder's output did not contain that letter, so both failed. The prompt asks you to avoid the letter. The grader scores the opposite. I did not save the paragraph, so I am not claiming the word-count and required-word constraints held. Do not read 28/30 as two ordinary prose misses. Open the evaluator before you cite it.

Writing lost two. The grader is a case-insensitive substring check on content plus reasoning. `writing_creative` matched 1/5 keywords. The one hit was `art`. The missing strings were `robot`, `dialogue`, `discover`, and `create`. It used 364 tokens against a 512 cap. `writing_format` matched `name`, `age`, and `city`, and missed the string `JSON`. It used 86 tokens against a 128 cap. I am not calling either one a truncated generation. I am also not scoring the story. The keyword was absent.

## Where it sits

This rank is one list, named here so it does not get mixed with another.

The list is every model id that contains a slash, was scored against `https://openrouter.ai/api/v1`, has a finished thinking-off 157, has zero errors, and is the newest file for that id. I left NVIDIA-named ids off this post. Nineteen models, including this one. Olympic rank: a tie keeps the next model from taking the next integer.

On that list Muse Wonder is **5th**. Claude Opus 5.5 at 151/157 is 4th. Gemini 3.8 Flash and Muse Spark 1.3 tie at 145/157, which is 6th. The two models at 153/157 share rank 1. This run is not in that band.

| Model | Score | Wall |
| --- | --- | --- |
| Claude Opus 5.5 | 151/157 (96.2%) | 1561.8 s |
| Muse Wonder | 148/157 (94.3%) | 872.5 s |
| Gemini 3.8 Flash | 145/157 (92.4%) | 1164.1 s |
| Muse Spark 1.3 | 145/157 (92.4%) | 1134.7 s |

Three points behind Opus. Three points ahead of the 145 tie. Wall time is the runner clock, including whatever the provider spent in queue. I am not turning 14.5 minutes against Opus's 1561.8 seconds into a speed claim.

## Against Muse Spark 1.3

Same suite, same endpoint, both on `effort=minimal`, both zero errors. Spark scored 145/157 on September 2. Wonder scored 148/157 today. The gain is three points, and it is not a coding gain. Both coded 30/30. Both followed instructions 30/30. Both reasoned 30/30. Both scored 25/30 on math.

| Suite | Spark 1.3 | Wonder |
| --- | --- | --- |
| coding | 30/30 | 30/30 |
| instruction | 30/30 | 30/30 |
| reasoning | 30/30 | 30/30 |
| math | 25/30 | 25/30 |
| prose | 27/30 | 28/30 |
| writing | 2/5 | 3/5 |
| tools | 1/2 | 2/2 |

Wonder uniquely failed two medium math items, `16.913` and `10.312`. Spark passed those. Both failed the same three expert math items, the same two lipogram checks, and the same two writing keyword items. Spark uniquely failed the calculator tool, one hard math item, one frontier math item, one frontier prose item, and the article keyword item. Wonder passed those.

Spark's file records 1134.7 seconds. This file records 872.5 seconds. Same caveat as above. Queue is in the clock.

## What I would not claim

I would not call this an optimized serve. We sent the published OpenRouter slug, on the lowest catalog effort that does not 400, and graded the answer text. Twenty reasoning tokens on a 2+2 smoke is still reasoning.

I would not treat the card's image, video, file, or audio input as part of this score. Cold Iron here is text.

I would not paste Meta's engineering-task sentence into this table. Their page reports their testing. This post reports the 157.

I would not rerun this with a higher effort and then replace 148. If we do that later, it is a diagnostic, not the ranking arm.

The public runner at `github.com/smfworks/smf-bench` `origin/main`, as I opened it today, does not contain a `muse` branch. `--thinking off` alone sends `enable_thinking=false`. That request still thinks. Without `reasoning.effort=minimal`, the 157 is a different test.

## Reproducing this

Scripts, the payload note, and the raw JSON are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/muse-wonder).

Send this on every Cold Iron request for this slug:

```json
{
  "reasoning": {"effort": "minimal"},
  "chat_template_kwargs": {"enable_thinking": false}
}
```

## Verification notes

Checked on 2026-10-12:

- Model id, context 1,048,576, price `$4` / `$20` per million (catalog fields `0.000004` and `0.00002` per token), cache read `0.0000002`, modalities, `supported_parameters`, and the reasoning block (`mandatory` true, efforts `max` through `minimal`, default `medium`) came from `https://openrouter.ai/api/v1/models` on our key. Created timestamp 1791807945, which is 2026-10-12 12:25:45 UTC.
- The same id, the $4 / $20 price, the October 12 release line, and Meta's engineering-task sentence are on [OpenRouter's model page](https://openrouter.ai/meta/muse-wonder).
- The score, category split, latency, token total, and per-test fail details came from `stage1_cal-muse-wonder-or-strict-v01_20261012_175814.json`. `summary.total` is 157. `summary.error` is 0. `summary.passed` is 148. `summary.pass_rate` is 94.3. `wall_time_seconds` is 872.5. `thinking` is `off`. `serve_recipe_id` is `OpenRouter-cloud`.
- Tier-0 `max_tokens: 4096` is in the five YAML files under `suites/quality/tier0_deterministic/`. I counted 157 `id:` lines across those files plus writing and tool calling.
- The lipogram pass condition is `regex_match` in `smf_bench/evaluators/__init__.py`, with expected `[eE]` and `e` in `prose.yaml`. A match is a pass.
- Writing keywords and caps are in `suites/quality/writing/writing.yaml`. The substring check searches content plus reasoning.
- The $1.985 figure is `/v1/key` usage after the run minus usage at launch: 401.202755746 minus 399.217667746, which is 1.985088.
- Spark's 145/157 and the unique-fail split came from `stage1_cal-muse-spark-13-or-strict-v01_20260902_234054.json`. Neighbor scores and walls came from each model's newest zero-error thinking-off 157 on the OpenRouter endpoint.
- The rank is that OpenRouter slash list, 19 models, NVIDIA-named ids omitted. It is not a rank on every Cold Iron file on disk.
- `git show origin/main:run_stage1.py` in the local `smf-bench` checkout had no `muse` match.
- The LUMINA post is a different artifact. Its own text says it is not Official A.
