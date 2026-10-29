---
slug: "2026-10-29-mistral-large-4-0-effort-low-strict-v01"
title: "Mistral Large 4.0 at effort=low scores 101/157. Not the Cold Iron rank."
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-10-29"
excerpt: "At reasoning.effort=low, mistralai/mistral-large-4-0 scored 101/157 on strict_v01, with reasoning tokens on every row and zero runner errors. That arm is not the Cold Iron rank, which stays the 2026-10-06 score of 126/157."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "effort-low", "cold-iron", "official-a", "mistral", "mistral-large-4", "openrouter"]
readTime: 16
image: "/images/blog/2026-10-29-mistral-large-4-0-effort-low-strict-v01.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-29-mistral-large-4-0-effort-low-strict-v01"
---

**By Nemo, SMF Works**

If `reasoning.effort=none` comes back HTTP 400 on `mistralai/mistral-large-4-0`, send `reasoning.effort=low` by itself. Leave `enable_thinking` off the payload. Grade that file as an analogue. Keep the October 6 score on the Cold Iron board.

Cold Iron is the thinking-off 157. The machine id is still `strict_v01`. This run used those 157 items. The saved file says `thinking: off` because the launcher flag was `--thinking off`. The payload the banner printed was `reasoning={"effort": "low"}` and `ctk=null`. Every row spent reasoning tokens. That is not the board arm.

The score is **101/157**. The summary field says 64.3%. 56 fails. `summary.error` is 0. Wall time 3265.5 seconds. The sum of saved `cost` is $0.9651082.

The same-day page is a different call. It left `reasoning` off the payload, finished in 161.54 s, and cost $0.0248066. [AURORA is here](/blog/2026-10-29-mistral-large-4-0-aurora-most-beautiful-html). The thinking-off post stays [126/157](/blog/2026-10-06-mistral-large-4-cold-iron). Do not replace 126 with 101.

## What to send

OpenRouter lists `mistralai/mistral-large-4-0`. The catalog name is Mistral: Mistral Large 4. Canonical slug `mistralai/mistral-large-4-0-20261006`. Created `1791294122` (2026-10-06 13:42:02 UTC). Context 1,048,576. `top_provider.max_completion_tokens` is 262,144. No `:batch` row for this id.

`reasoning.mandatory` is false. `default_enabled` is true. `default_effort` is high. The catalog `supported_efforts` list is `high` and `none`. The provider does not honor that list. `effort=none` and `enabled=false` both returned HTTP 400. The raw message says `none` is not supported, and the supported values are high, low, and medium.

List price on the catalog row is $0.70 per million prompt tokens and $2.10 per million completion tokens. Cache read is $0.07 per million. Modality on the card is text and image in, text out. This suite is text. `hugging_face_id` is `mistralai/Mistral-Large-4-1T-A52B`. That is the field. It is not a parameter count from a local `config.json`. Quantization on the three endpoint rows is `unknown`. Two rows are 1,048,576 context at the catalog price. The EU row is 524,288 context at $0.77 / $2.31 per million. This run did not pin a provider.

`temperature` is in `supported_parameters`. The runner sends each item's YAML temperature. The frontier prose item I opened, `v3.prose.frontier.12`, sets temperature 0.7 and `max_tokens` 4096.

A `2+2` at temperature 0 and `max_tokens=64` is not a clean off switch.

| What we sent | What came back |
| --- | --- |
| Default | content `4`, 115 reasoning chars, 35 completion tokens, finish `stop`, `gen-1793312314-DQmmnYp1m1tAZ7SiRRrQ` |
| `enable_thinking=false` | content `4`, 115 reasoning chars, 35 completion tokens, finish `stop`, `gen-1793312315-11toL47Zrzu7xagvSl7w` |
| `reasoning.effort=none` | HTTP 400 |
| `reasoning.enabled=false` | HTTP 400, same rejection as `none` |
| `reasoning.effort=high` | content `4`, 115 reasoning chars, 35 completion tokens, `gen-1793312322-FZpzduenp9CfJxmRSJHr` |
| `reasoning.effort=low` | content `4`, 31 reasoning tokens, 115 reasoning chars, 35 completion tokens, `gen-1793312373-bvdXyWNgrsKKmHMRtvCX` |
| `effort=low` plus the flag | content `4`, 35 reasoning tokens, 134 reasoning chars, `gen-1793312380-MNGAs8jcT6Ou1Z8k6HB0` |
| `effort=medium` | content `4`, 31 reasoning tokens, `gen-1793312375-7lzGK4T9oB9Zed46ic7D` |

The bat-and-ball probe at `effort=low` and `max_tokens=64` finished `length` with empty content and 63 reasoning tokens (`gen-1793312383-oT2NKlQeyPGIft5Qc8NF`). That cap was eaten by reasoning. It is not an answer.

The 157 used the low payload alone. Pairing low with the flag raised the `2+2` reasoning count from 31 to 35, so the runner drops `chat_template_kwargs` on this slug.

## The 157

Mean latency 20.79 seconds. Median 20.27 seconds. Slowest item 89.03 seconds (`v3.math.frontier.06`). Prompt tokens 29,016. Completion tokens 450,652. `tokens_used` 479,668. Reasoning tokens 444,224. Zero rows have `reasoning_tokens` 0.

Finish reasons: `length` 82, `stop` 72, `tool_calls` 2, `error` 1. 78 rows hit 4,096 completion tokens. Each of those items sets `max_tokens: 4096` in the YAML I counted. 76 of them have `reasoning_tokens` 4095. The walkthrough filled the cap.

| Category | This file | 2026-10-06 file |
| --- | --- | --- |
| coding | 10/30 | 25/30 |
| instruction | 15/30 | 27/30 |
| math | 25/30 | 19/30 |
| prose | 17/30 | 22/30 |
| reasoning | 27/30 | 27/30 |
| tool_calling | 2/2 | 2/2 |
| writing | 5/5 | 4/5 |
| Total | 101/157 | 126/157 |

The October 6 file is `stage1_cal-mistral-large-4-0-or-strict-v01_20261007_025500.json`. Its `reasoning_effort` field is null. It does not store per-row `reasoning_tokens` or `cost`. The post that day says the arm was `reasoning.effort=none`. These two columns are two payloads. They are not a rank change.

## Where the misses sit

Coding is 10/30. All 20 fails finished `length`. Each detail is a `SyntaxError`: unterminated string, invalid decimal literal, or, on `v3.coding.frontier.05`, invalid character `∩` (U+2229). Each of those rows has 4,095 reasoning tokens inside a 4,096 completion cap. The grader saw a broken program because the completion was cut. The 10 passes all finished `stop`. A length `SyntaxError` is not a claim that a finished function failed to parse.

Instruction is 15/30. All 15 fails finished `length`. The details are count misses: 3 sentences came back as 332, 5 lines as 196, 7 sentences as 516. The walkthrough was scored as the piece.

Prose is 17/30. Twelve fails finished `length` with the same count pattern. `v3.prose.frontier.12` is the other one. Expected 1 stanza, got 5. `finish_reason` is `error`. `cost` is 0. Reasoning tokens 690. The row has no error body. `summary.error` stays 0 because the runner still graded the text.

`v3.prose.hard.04` passed. The detail is `Regex matched: e`. Finish is `length`, with 4,095 reasoning tokens. The expected pattern on that lipogram is `[eE]`. The grader passes when that pattern matches. A clean lipogram fails the item. This pass is the letter e inside a capped reply.

Math is 25/30. Five fails. Three finished `length` (`v3.math.expert.01`, `v3.math.expert.08`, `v3.math.frontier.06`) with 4,095 reasoning tokens. Two finished `stop` (`v3.math.expert.06`, `v3.math.expert.07`). The detail on each is a regex that did not match. The file does not store the returned number. `v3.math.medium.01` passed. The product is 105, and the detail says the regex matched 105.

Reasoning is 27/30. The three fails finished `length`. The missing patterns are `402`, `321`, and `292`. The replies are not in the file.

Writing is 5/5. Tools are 2/2. Weather and calculator both fired with the right arguments. Those two rows finished `tool_calls`.

29 of the 101 passes also finished `length`. They stay in the 101. A length pass is a pattern the grader found inside a capped reply, not a finished piece.

## Cost

`v3.math.easy.01` records 54 prompt tokens and 95 completion tokens. At the catalog rates that is $0.0002373, which matches the row's `cost`. Reasoning tokens sit inside completion tokens on these rows. They are not a second bill.

The sum of saved `cost` is $0.9651082. `v3.prose.frontier.12` contributes 0.

`/v1/key` usage was $412.866038788 at 2026-10-29 22:21:53 UTC and $413.855953588 at 2026-10-29 23:19:17 UTC. The delta is $0.989915. That window starts during the one-shot call and ends after this 157. The one-shot `usage.cost` is $0.0248066. The gap between the key delta and the row sum is $0.0248068. Those two figures are close. They are not the same field. The graded cost in this post is the row sum.

## Reproducing this

The result file is `stage1_cal-mistral-large-4-0-or-low-strict-v01_20261029_222257.json`. The timestamp field inside it is `20261029_231723`. Serve recipe `OpenRouter-cloud`. Endpoint `https://openrouter.ai/api/v1`.

The start banner printed `Reasoning effort: low` and `payload_check reasoning={"effort": "low"} ctk=null`.

`smf-bench` commit `5d9ddf6` does not contain an exact-slug branch for this id. A fresh clone's `--thinking off` path sends `enable_thinking=false` and does not send `reasoning.effort=low`. That is a different payload. The local edit that produced this file is not on that commit.

Scripts and this JSON are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/mistral-large-4-0).

## Every row

Elapsed, score, and cost are the JSON numbers. Detail is the saved detail. Nothing in this table was filled in after the fact.

| test_id | category | suite | status | score | elapsed_s | prompt | completion | reasoning | tokens_used | finish | cost | evaluator | detail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v3.math.easy.01 | math | math | pass | 1.0 | 1.5494826789945364 | 54 | 95 | 86 | 149 | stop | 0.0002373 | regex_match | Regex matched: 15072 |
| v3.math.easy.02 | math | math | pass | 1.0 | 8.390087395906448 | 46 | 188 | 108 | 234 | stop | 0.000427 | regex_match | Regex matched: 7 |
| v3.math.medium.01 | math | math | pass | 1.0 | 1.3964633470168337 | 71 | 189 | 181 | 260 | stop | 0.0004466 | regex_match | Regex matched: 105 |
| v3.math.medium.02 | math | math | pass | 1.0 | 36.99760941893328 | 81 | 4096 | 4095 | 4177 | length | 0.0086583 | regex_match | Regex matched: 16.913 |
| v3.math.medium.03 | math | math | pass | 1.0 | 5.542151244007982 | 102 | 1127 | 1117 | 1229 | stop | 0.0024381 | regex_match | Regex matched: 10.312 |
| v3.math.hard.01 | math | math | pass | 1.0 | 9.053087359992787 | 150 | 1358 | 1348 | 1508 | stop | 0.0029568 | regex_match | Regex matched: 4.101 |
| v3.math.hard.02 | math | math | pass | 1.0 | 9.59189422999043 | 122 | 1436 | 1426 | 1558 | stop | 0.003101 | regex_match | Regex matched: 142.73 |
| v3.math.hard.03 | math | math | pass | 1.0 | 32.650286101037636 | 165 | 4096 | 4095 | 4261 | length | 0.0087171 | regex_match | Regex matched: 5.461 |
| v3.math.hard.04 | math | math | pass | 1.0 | 8.903656319947913 | 90 | 1817 | 1625 | 1907 | stop | 0.0038787 | regex_match | Regex matched: 1.2986 |
| v3.math.hard.05 | math | math | pass | 1.0 | 37.14622070302721 | 129 | 4096 | 4095 | 4225 | length | 0.0086919 | regex_match | Regex matched: 8.750 |
| v3.math.expert.01 | math | math | fail | 0.0 | 31.434156103990972 | 197 | 4096 | 4095 | 4293 | length | 0.0087395 | regex_match | Regex '\b14.595\b' did not match |
| v3.math.expert.02 | math | math | pass | 1.0 | 22.544032170902938 | 194 | 4096 | 4095 | 4290 | length | 0.0087374 | regex_match | Regex matched: 7.683 |
| v3.math.expert.03 | math | math | pass | 1.0 | 19.28144809207879 | 212 | 4096 | 4095 | 4308 | length | 0.00875 | regex_match | Regex matched: 135.96 |
| v3.math.expert.04 | math | math | pass | 1.0 | 12.394013271084987 | 181 | 2708 | 2698 | 2889 | stop | 0.0058135 | regex_match | Regex matched: 160.971 |
| v3.math.expert.05 | math | math | pass | 1.0 | 28.115686253993772 | 197 | 4096 | 4095 | 4293 | length | 0.0087395 | regex_match | Regex matched: 0.631 |
| v3.math.expert.06 | math | math | fail | 0.0 | 9.29310253309086 | 107 | 1773 | 1762 | 1880 | stop | 0.0037982 | regex_match | Regex '\b-0.01384\b' did not match |
| v3.math.expert.07 | math | math | fail | 0.0 | 17.652933471021242 | 129 | 2980 | 2970 | 3109 | stop | 0.0063483 | regex_match | Regex '\b-9.417\b' did not match |
| v3.math.expert.08 | math | math | fail | 0.0 | 21.778217933955602 | 167 | 4096 | 4095 | 4263 | length | 0.0087185 | regex_match | Regex '\b29.924\b' did not match |
| v3.math.frontier.01 | math | math | pass | 1.0 | 40.612676637014374 | 184 | 4096 | 4095 | 4280 | length | 0.0087304 | regex_match | Regex matched: 2.794 |
| v3.math.frontier.02 | math | math | pass | 1.0 | 22.423715020995587 | 164 | 3520 | 3509 | 3684 | stop | 0.0075068 | regex_match | Regex matched: 0.978308 |
| v3.math.frontier.03 | math | math | pass | 1.0 | 20.21982089697849 | 175 | 4096 | 4095 | 4271 | length | 0.0087241 | regex_match | Regex matched: 2.146 |
| v3.math.frontier.04 | math | math | pass | 1.0 | 10.205941763008013 | 184 | 1302 | 1291 | 1486 | stop | 0.002863 | regex_match | Regex matched: 1.8250 |
| v3.math.frontier.05 | math | math | pass | 1.0 | 34.36974836292211 | 199 | 4096 | 4095 | 4295 | length | 0.0087409 | regex_match | Regex matched: 6.815 |
| v3.math.frontier.06 | math | math | fail | 0.0 | 89.02763653500006 | 174 | 4096 | 4095 | 4270 | length | 0.0087234 | regex_match | Regex '\b16.5545\b' did not match |
| v3.math.frontier.07 | math | math | pass | 1.0 | 43.88796877802815 | 180 | 3991 | 3981 | 4171 | stop | 0.0085071 | regex_match | Regex matched: 100.446 |
| v3.math.frontier.08 | math | math | pass | 1.0 | 24.614934110082686 | 219 | 4096 | 4095 | 4315 | length | 0.0087549 | regex_match | Regex matched: 15.7987 |
| v3.math.frontier.09 | math | math | pass | 1.0 | 25.100069831009023 | 116 | 4096 | 4095 | 4212 | length | 0.0086828 | regex_match | Regex matched: 0.481138 |
| v3.math.frontier.10 | math | math | pass | 1.0 | 26.736295906011946 | 120 | 4096 | 4095 | 4216 | length | 0.0086856 | regex_match | Regex matched: 0.7819 |
| v3.math.frontier.11 | math | math | pass | 1.0 | 29.118867997080088 | 158 | 4096 | 4095 | 4254 | length | 0.0087122 | regex_match | Regex matched: 59.596 |
| v3.math.frontier.12 | math | math | pass | 1.0 | 20.83828653593082 | 223 | 4096 | 4095 | 4319 | length | 0.0087577 | regex_match | Regex matched: 83.5165 |
| v3.coding.easy.01 | coding | coding | pass | 1.0 | 7.003408819902688 | 146 | 637 | 600 | 783 | stop | 0.0014399 | programmatic | All assertions passed |
| v3.coding.easy.02 | coding | coding | pass | 1.0 | 2.7687198609346524 | 151 | 248 | 218 | 399 | stop | 0.0006265 | programmatic | All assertions passed |
| v3.coding.medium.01 | coding | coding | pass | 1.0 | 7.837085481034592 | 141 | 1627 | 1481 | 1768 | stop | 0.0035154 | programmatic | All assertions passed |
| v3.coding.medium.02 | coding | coding | pass | 1.0 | 11.157470938982442 | 118 | 521 | 452 | 639 | stop | 0.0011767 | programmatic | All assertions passed |
| v3.coding.medium.03 | coding | coding | pass | 1.0 | 3.7325808230089024 | 146 | 624 | 457 | 770 | stop | 0.0014126 | programmatic | All assertions passed |
| v3.coding.hard.01 | coding | coding | fail | 0.0 | 24.752887469017878 | 177 | 4096 | 4095 | 4273 | length | 0.0087255 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.hard.02 | coding | coding | pass | 1.0 | 17.73642131104134 | 185 | 1976 | 1810 | 2161 | stop | 0.0042791 | programmatic | All assertions passed |
| v3.coding.hard.03 | coding | coding | fail | 0.0 | 24.101744265994057 | 203 | 4096 | 4095 | 4299 | length | 0.0087437 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 5) |
| v3.coding.hard.04 | coding | coding | pass | 1.0 | 17.203640983090736 | 198 | 2346 | 2146 | 2544 | stop | 0.0050652 | programmatic | All assertions passed |
| v3.coding.hard.05 | coding | coding | pass | 1.0 | 6.747882441035472 | 238 | 1004 | 867 | 1242 | stop | 0.002275 | programmatic | All assertions passed |
| v3.coding.expert.01 | coding | coding | pass | 1.0 | 11.712867773021571 | 220 | 2336 | 2172 | 2556 | stop | 0.0050596 | programmatic | All assertions passed |
| v3.coding.expert.02 | coding | coding | fail | 0.0 | 29.74171245493926 | 208 | 4096 | 4095 | 4304 | length | 0.0087472 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.expert.03 | coding | coding | fail | 0.0 | 55.61271784303244 | 265 | 4096 | 4095 | 4361 | length | 0.0087871 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 14) |
| v3.coding.expert.04 | coding | coding | fail | 0.0 | 47.70614546001889 | 251 | 4096 | 4095 | 4347 | length | 0.0087773 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 13) |
| v3.coding.expert.05 | coding | coding | pass | 1.0 | 32.73697012802586 | 239 | 3895 | 3729 | 4134 | stop | 0.0083468 | programmatic | All assertions passed |
| v3.coding.expert.06 | coding | coding | fail | 0.0 | 28.230218910961412 | 157 | 4096 | 4095 | 4253 | length | 0.0087115 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 3) |
| v3.coding.expert.07 | coding | coding | fail | 0.0 | 29.164834351977333 | 242 | 4096 | 4095 | 4338 | length | 0.008771 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 5) |
| v3.coding.expert.08 | coding | coding | fail | 0.0 | 23.123309763963334 | 319 | 4096 | 4095 | 4415 | length | 0.0088249 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 3) |
| v3.coding.frontier.01 | coding | coding | fail | 0.0 | 22.35146618890576 | 271 | 4096 | 4095 | 4367 | length | 0.0087913 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 27) |
| v3.coding.frontier.02 | coding | coding | fail | 0.0 | 28.80002546601463 | 278 | 4096 | 4095 | 4374 | length | 0.0087962 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 7) |
| v3.coding.frontier.03 | coding | coding | fail | 0.0 | 47.59915096196346 | 349 | 4096 | 4095 | 4445 | length | 0.0088459 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 23) |
| v3.coding.frontier.04 | coding | coding | fail | 0.0 | 31.62154893600382 | 301 | 4096 | 4095 | 4397 | length | 0.0088123 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 7) |
| v3.coding.frontier.05 | coding | coding | fail | 0.0 | 22.488532011047937 | 300 | 4096 | 4095 | 4396 | length | 0.0088116 | programmatic | Assertion failed: SyntaxError: invalid character '∩' (U+2229) |
| v3.coding.frontier.06 | coding | coding | fail | 0.0 | 67.2106610329356 | 286 | 4096 | 4095 | 4382 | length | 0.0088018 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.frontier.07 | coding | coding | fail | 0.0 | 25.074457733891904 | 236 | 4096 | 4095 | 4332 | length | 0.0087668 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.frontier.08 | coding | coding | fail | 0.0 | 35.46838185703382 | 304 | 4096 | 4095 | 4400 | length | 0.0088144 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.frontier.09 | coding | coding | fail | 0.0 | 22.756651132018305 | 229 | 4096 | 4095 | 4325 | length | 0.0087619 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.frontier.10 | coding | coding | fail | 0.0 | 31.888381559983827 | 315 | 4096 | 4095 | 4411 | length | 0.0088221 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 5) |
| v3.coding.frontier.11 | coding | coding | fail | 0.0 | 39.35936436406337 | 302 | 4096 | 4095 | 4398 | length | 0.008813 | programmatic | Assertion failed: SyntaxError: invalid decimal literal |
| v3.coding.frontier.12 | coding | coding | fail | 0.0 | 27.19886578200385 | 562 | 4096 | 4095 | 4658 | length | 0.008995 | programmatic | Assertion failed: SyntaxError: unterminated string literal (detected at line 7) |
| v3.reasoning.easy.01 | reasoning | reasoning_tier0 | pass | 1.0 | 3.0047830609837547 | 104 | 240 | 232 | 344 | stop | 0.0005768 | regex_match | Regex matched: \boxed{Dario} |
| v3.reasoning.easy.02 | reasoning | reasoning_tier0 | pass | 1.0 | 1.378674768959172 | 45 | 119 | 39 | 164 | stop | 0.0002814 | regex_match | Regex matched: 14 |
| v3.reasoning.medium.01 | reasoning | reasoning_tier0 | pass | 1.0 | 9.02645029395353 | 154 | 891 | 882 | 1045 | stop | 0.0019789 | regex_match | Regex matched: \boxed{Tobin} |
| v3.reasoning.medium.02 | reasoning | reasoning_tier0 | pass | 1.0 | 5.52165295695886 | 171 | 364 | 356 | 535 | stop | 0.0008841 | regex_match | Regex matched: \boxed{Alba} |
| v3.reasoning.medium.03 | reasoning | reasoning_tier0 | pass | 1.0 | 6.743541726958938 | 60 | 704 | 496 | 764 | stop | 0.0015204 | regex_match | Regex matched: 36 |
| v3.reasoning.hard.01 | reasoning | reasoning_tier0 | pass | 1.0 | 13.305376734933816 | 215 | 2367 | 2358 | 2582 | stop | 0.0051212 | regex_match | Regex matched: \boxed{Marisol} |
| v3.reasoning.hard.02 | reasoning | reasoning_tier0 | pass | 1.0 | 11.502241700072773 | 219 | 961 | 953 | 1180 | stop | 0.0021714 | regex_match | Regex matched: \boxed{Sana} |
| v3.reasoning.hard.03 | reasoning | reasoning_tier0 | pass | 1.0 | 6.735532538965344 | 273 | 672 | 665 | 945 | stop | 0.0016023 | regex_match | Regex matched: \boxed{E} |
| v3.reasoning.hard.04 | reasoning | reasoning_tier0 | fail | 0.0 | 19.42665355000645 | 89 | 4096 | 3701 | 4185 | length | 0.0086639 | regex_match | Regex '\b402\b' did not match |
| v3.reasoning.hard.05 | reasoning | reasoning_tier0 | pass | 1.0 | 4.533895467990078 | 200 | 683 | 675 | 883 | stop | 0.0015743 | regex_match | Regex matched: \boxed{Bram} |
| v3.reasoning.expert.01 | reasoning | reasoning_tier0 | pass | 1.0 | 18.47409555397462 | 255 | 4096 | 4095 | 4351 | length | 0.0087801 | regex_match | Regex matched: 5 |
| v3.reasoning.expert.02 | reasoning | reasoning_tier0 | pass | 1.0 | 21.240009766072035 | 293 | 2024 | 1922 | 2317 | stop | 0.0044555 | regex_match | Regex matched: \boxed{Fenna} |
| v3.reasoning.expert.03 | reasoning | reasoning_tier0 | pass | 1.0 | 8.570627256995067 | 228 | 1390 | 1345 | 1618 | stop | 0.0030786 | regex_match | Regex matched: \boxed{Joren} |
| v3.reasoning.expert.04 | reasoning | reasoning_tier0 | pass | 1.0 | 10.037894928012975 | 296 | 1308 | 1093 | 1604 | stop | 0.002954 | regex_match | Regex matched: 4 |
| v3.reasoning.expert.05 | reasoning | reasoning_tier0 | pass | 1.0 | 24.53729673603084 | 137 | 4096 | 4095 | 4233 | length | 0.0086975 | regex_match | Regex matched: 64400 |
| v3.reasoning.expert.06 | reasoning | reasoning_tier0 | pass | 1.0 | 12.424217847990803 | 333 | 2520 | 2422 | 2853 | stop | 0.0055251 | regex_match | Regex matched: \boxed{Yotam} |
| v3.reasoning.expert.07 | reasoning | reasoning_tier0 | pass | 1.0 | 9.652542447904125 | 265 | 1901 | 1753 | 2166 | stop | 0.0041776 | regex_match | Regex matched: \boxed{Fife} |
| v3.reasoning.expert.08 | reasoning | reasoning_tier0 | pass | 1.0 | 25.476237747003324 | 156 | 4096 | 4095 | 4252 | length | 0.0087108 | regex_match | Regex matched: 336 |
| v3.reasoning.frontier.01 | reasoning | reasoning_tier0 | pass | 1.0 | 22.04676464397926 | 251 | 4096 | 4095 | 4347 | length | 0.0087773 | regex_match | Regex matched: 4 |
| v3.reasoning.frontier.02 | reasoning | reasoning_tier0 | pass | 1.0 | 34.222529810038395 | 240 | 4096 | 4095 | 4336 | length | 0.0087696 | regex_match | Regex matched: \boxed{Fenra} |
| v3.reasoning.frontier.03 | reasoning | reasoning_tier0 | pass | 1.0 | 19.60377789591439 | 293 | 3415 | 3407 | 3708 | stop | 0.0073766 | regex_match | Regex matched: \boxed{Hutt} |
| v3.reasoning.frontier.04 | reasoning | reasoning_tier0 | pass | 1.0 | 15.180229489924386 | 241 | 1548 | 1540 | 1789 | stop | 0.0034195 | regex_match | Regex matched: \boxed{Maro} |
| v3.reasoning.frontier.05 | reasoning | reasoning_tier0 | pass | 1.0 | 13.854306767927483 | 238 | 2402 | 2199 | 2640 | stop | 0.0052108 | regex_match | Regex matched: 10 |
| v3.reasoning.frontier.06 | reasoning | reasoning_tier0 | fail | 0.0 | 21.59329466195777 | 93 | 4096 | 4095 | 4189 | length | 0.0086667 | regex_match | Regex '\b321\b' did not match |
| v3.reasoning.frontier.07 | reasoning | reasoning_tier0 | fail | 0.0 | 22.15490777499508 | 171 | 4096 | 4095 | 4267 | length | 0.0087213 | regex_match | Regex '\b292\b' did not match |
| v3.reasoning.frontier.08 | reasoning | reasoning_tier0 | pass | 1.0 | 30.277714070980437 | 359 | 4096 | 4095 | 4455 | length | 0.0088529 | regex_match | Regex matched: \boxed{Marek} |
| v3.reasoning.frontier.09 | reasoning | reasoning_tier0 | pass | 1.0 | 8.223903708043508 | 150 | 1483 | 1444 | 1633 | stop | 0.0032193 | regex_match | Regex matched: 4 |
| v3.reasoning.frontier.10 | reasoning | reasoning_tier0 | pass | 1.0 | 22.63380557706114 | 180 | 4096 | 4095 | 4276 | length | 0.0087276 | regex_match | Regex matched: 24 |
| v3.reasoning.frontier.11 | reasoning | reasoning_tier0 | pass | 1.0 | 33.10685887897853 | 164 | 4096 | 4095 | 4260 | length | 0.0087164 | regex_match | Regex matched: 18 |
| v3.reasoning.frontier.12 | reasoning | reasoning_tier0 | pass | 1.0 | 18.050824731006287 | 291 | 2904 | 2752 | 3195 | stop | 0.0063021 | regex_match | Regex matched: \boxed{Kolvo} |
| v3.instruction.easy.01 | instruction | instruction | pass | 1.0 | 0.8410959460306913 | 31 | 55 | 45 | 86 | stop | 0.0001372 | text_match | Exact match |
| v3.instruction.easy.02 | instruction | instruction | pass | 1.0 | 3.824389699031599 | 69 | 554 | 502 | 623 | stop | 0.0012117 | structural_count | Expected 3 line(s), got 3 |
| v3.instruction.medium.01 | instruction | instruction | fail | 0.0 | 18.260748320026323 | 163 | 4096 | 4095 | 4259 | length | 0.0087157 | structural_count | Expected 3 sentence(s), got 332 |
| v3.instruction.medium.02 | instruction | instruction | pass | 1.0 | 6.37241469102446 | 94 | 523 | 419 | 617 | stop | 0.0011641 | structural_count | Expected 5 line(s), got 5 |
| v3.instruction.medium.03 | instruction | instruction | pass | 1.0 | 2.5999951789854094 | 66 | 79 | 71 | 145 | stop | 0.0002121 | text_match | Exact match |
| v3.instruction.hard.01 | instruction | instruction | fail | 0.0 | 17.739566436968744 | 134 | 4096 | 4095 | 4230 | length | 0.0086954 | structural_count | Expected 5 line(s), got 196 |
| v3.instruction.hard.02 | instruction | instruction | fail | 0.0 | 18.673623236943968 | 113 | 4096 | 4095 | 4209 | length | 0.0086807 | structural_count | Expected 3 sentence(s), got 124 |
| v3.instruction.hard.03 | instruction | instruction | fail | 0.0 | 26.509358954033814 | 130 | 4096 | 4095 | 4226 | length | 0.0086926 | structural_count | Expected 4 line(s), got 181 |
| v3.instruction.hard.04 | instruction | instruction | pass | 1.0 | 3.2548240839969367 | 107 | 452 | 435 | 559 | stop | 0.0010241 | text_match | Exact match |
| v3.instruction.hard.05 | instruction | instruction | fail | 0.0 | 38.999212329043075 | 139 | 4096 | 4095 | 4235 | length | 0.0086989 | structural_count | Expected 3 stanza(s), got 142 |
| v3.instruction.expert.01 | instruction | instruction | fail | 0.0 | 22.031135455938056 | 124 | 4096 | 4095 | 4220 | length | 0.0086884 | structural_count | Expected 6 line(s), got 260 |
| v3.instruction.expert.02 | instruction | instruction | pass | 1.0 | 8.148621133062989 | 168 | 1585 | 1540 | 1753 | stop | 0.0034461 | structural_count | Expected 7 line(s), got 7 |
| v3.instruction.expert.03 | instruction | instruction | fail | 0.0 | 18.481965581071563 | 126 | 4096 | 4095 | 4222 | length | 0.0086898 | structural_count | Expected 5 line(s), got 244 |
| v3.instruction.expert.04 | instruction | instruction | pass | 1.0 | 4.604988604900427 | 133 | 536 | 529 | 669 | stop | 0.0012187 | text_match | Exact match |
| v3.instruction.expert.05 | instruction | instruction | pass | 1.0 | 16.033177764038555 | 159 | 3380 | 3304 | 3539 | stop | 0.0072093 | structural_count | Expected 4 sentence(s), got 4 |
| v3.instruction.expert.06 | instruction | instruction | fail | 0.0 | 34.46890853601508 | 141 | 4096 | 4095 | 4237 | length | 0.0087003 | structural_count | Expected 3 stanza(s), got 42 |
| v3.instruction.expert.07 | instruction | instruction | fail | 0.0 | 38.007082505035214 | 185 | 4096 | 4095 | 4281 | length | 0.0087311 | structural_count | Expected 3 line(s), got 193 |
| v3.instruction.expert.08 | instruction | instruction | fail | 0.0 | 30.83167309605051 | 191 | 4096 | 4095 | 4287 | length | 0.0087353 | structural_count | Expected 5 line(s), got 192 |
| v3.instruction.frontier.01 | instruction | instruction | fail | 0.0 | 22.093239390058443 | 245 | 4096 | 4095 | 4341 | length | 0.0087731 | structural_count | Expected 7 line(s), got 295 |
| v3.instruction.frontier.02 | instruction | instruction | fail | 0.0 | 20.84844247205183 | 203 | 4096 | 4095 | 4299 | length | 0.0087437 | structural_count | Expected 5 sentence(s), got 506 |
| v3.instruction.frontier.03 | instruction | instruction | fail | 0.0 | 22.993636764003895 | 168 | 4096 | 4095 | 4264 | length | 0.0087192 | structural_count | Expected 6 line(s), got 68 |
| v3.instruction.frontier.04 | instruction | instruction | pass | 1.0 | 14.243277330999263 | 199 | 3215 | 3201 | 3414 | stop | 0.0068908 | text_match | Exact match |
| v3.instruction.frontier.05 | instruction | instruction | fail | 0.0 | 42.06783706403803 | 208 | 4096 | 4095 | 4304 | length | 0.0087472 | structural_count | Expected 3 stanza(s), got 61 |
| v3.instruction.frontier.06 | instruction | instruction | fail | 0.0 | 31.49042118701618 | 172 | 4096 | 4095 | 4268 | length | 0.008722 | structural_count | Expected 7 sentence(s), got 516 |
| v3.instruction.frontier.07 | instruction | instruction | pass | 1.0 | 7.688330108998343 | 204 | 1250 | 1203 | 1454 | stop | 0.0027678 | structural_count | Expected 5 line(s), got 5 |
| v3.instruction.frontier.08 | instruction | instruction | pass | 1.0 | 18.119784170994535 | 169 | 4038 | 4002 | 4207 | stop | 0.0085981 | structural_count | Expected 2 stanza(s), got 2 |
| v3.instruction.frontier.09 | instruction | instruction | pass | 1.0 | 20.267580899992026 | 171 | 2273 | 2250 | 2444 | stop | 0.004893 | structural_count | Expected 4 line(s), got 4 |
| v3.instruction.frontier.10 | instruction | instruction | pass | 1.0 | 28.93117407907266 | 156 | 2760 | 2694 | 2916 | stop | 0.0059052 | structural_count | Expected 8 line(s), got 8 |
| v3.instruction.frontier.11 | instruction | instruction | pass | 1.0 | 20.6808178400388 | 143 | 3113 | 3055 | 3256 | stop | 0.0066374 | structural_count | Expected 9 line(s), got 9 |
| v3.instruction.frontier.12 | instruction | instruction | pass | 1.0 | 9.206757513107732 | 201 | 988 | 920 | 1189 | stop | 0.0022155 | structural_count | Expected 8 line(s), got 8 |
| v3.prose.easy.01 | prose | prose | pass | 1.0 | 19.07559978996869 | 120 | 1461 | 1410 | 1581 | stop | 0.0031521 | structural_count | Expected 5 line(s), got 5 |
| v3.prose.easy.02 | prose | prose | pass | 1.0 | 17.81462374306284 | 113 | 2671 | 2614 | 2784 | stop | 0.0056882 | structural_count | Expected 4 sentence(s), got 4 |
| v3.prose.medium.01 | prose | prose | pass | 1.0 | 8.808406276977621 | 131 | 1666 | 1609 | 1797 | stop | 0.0035903 | structural_count | Expected 6 line(s), got 6 |
| v3.prose.medium.02 | prose | prose | fail | 0.0 | 32.130083105992526 | 120 | 4096 | 4095 | 4216 | length | 0.0086856 | structural_count | Expected 8 sentence(s), got 418 |
| v3.prose.medium.03 | prose | prose | pass | 1.0 | 26.254507322912104 | 201 | 2717 | 2581 | 2918 | stop | 0.0058464 | structural_count | Expected 5 stanza(s), got 5 |
| v3.prose.hard.01 | prose | prose | pass | 1.0 | 9.2640407680301 | 164 | 881 | 805 | 1045 | stop | 0.0019649 | structural_count | Expected 8 line(s), got 8 |
| v3.prose.hard.02 | prose | prose | pass | 1.0 | 20.487078969017603 | 210 | 3676 | 3559 | 3886 | stop | 0.0078666 | structural_count | Expected 4 stanza(s), got 4 |
| v3.prose.hard.03 | prose | prose | fail | 0.0 | 17.432136516086757 | 175 | 4096 | 4095 | 4271 | length | 0.0087241 | structural_count | Expected 12 sentence(s), got 291 |
| v3.prose.hard.04 | prose | prose | pass | 1.0 | 22.074732544017024 | 152 | 4096 | 4095 | 4248 | length | 0.008708 | regex_match | Regex matched: e |
| v3.prose.hard.05 | prose | prose | pass | 1.0 | 15.072691509965807 | 207 | 2835 | 2754 | 3042 | stop | 0.0060984 | structural_count | Expected 10 line(s), got 10 |
| v3.prose.expert.01 | prose | prose | fail | 0.0 | 23.51479970291257 | 338 | 4096 | 4095 | 4434 | length | 0.0088382 | structural_count | Expected 39 line(s), got 159 |
| v3.prose.expert.02 | prose | prose | fail | 0.0 | 24.75705228303559 | 182 | 4096 | 4095 | 4278 | length | 0.008729 | structural_count | Expected 10 line(s), got 147 |
| v3.prose.expert.03 | prose | prose | pass | 1.0 | 19.955299322027713 | 157 | 4096 | 4095 | 4253 | length | 0.0087115 | regex_match | Regex matched: e |
| v3.prose.expert.04 | prose | prose | pass | 1.0 | 20.039957658038475 | 120 | 4096 | 3955 | 4216 | length | 0.0086856 | structural_count | Expected 12 line(s), got 12 |
| v3.prose.expert.05 | prose | prose | pass | 1.0 | 7.216106844949536 | 190 | 1522 | 1427 | 1712 | stop | 0.0033292 | structural_count | Expected 15 line(s), got 15 |
| v3.prose.expert.06 | prose | prose | pass | 1.0 | 39.30458584497683 | 298 | 3549 | 3287 | 3847 | stop | 0.0076615 | structural_count | Expected 8 stanza(s), got 8 |
| v3.prose.expert.07 | prose | prose | fail | 0.0 | 24.109781089005992 | 209 | 4096 | 4095 | 4305 | length | 0.0087479 | structural_count | Expected 1 stanza(s), got 65 |
| v3.prose.expert.08 | prose | prose | fail | 0.0 | 33.36406449403148 | 177 | 4096 | 4095 | 4273 | length | 0.0087255 | structural_count | Expected 1 stanza(s), got 34 |
| v3.prose.frontier.01 | prose | prose | fail | 0.0 | 22.346347787999548 | 328 | 4096 | 4095 | 4424 | length | 0.0088312 | structural_count | Expected 7 stanza(s), got 49 |
| v3.prose.frontier.02 | prose | prose | fail | 0.0 | 43.64785449800547 | 301 | 4096 | 4095 | 4397 | length | 0.0088123 | structural_count | Expected 12 line(s), got 81 |
| v3.prose.frontier.03 | prose | prose | fail | 0.0 | 35.185139129986055 | 189 | 4096 | 4095 | 4285 | length | 0.0087339 | structural_count | Expected 1 stanza(s), got 4 |
| v3.prose.frontier.04 | prose | prose | fail | 0.0 | 34.88049740390852 | 176 | 4096 | 4095 | 4272 | length | 0.0087248 | structural_count | Expected 1 stanza(s), got 14 |
| v3.prose.frontier.05 | prose | prose | pass | 1.0 | 21.181372676976025 | 283 | 3869 | 3735 | 4152 | stop | 0.008323 | structural_count | Expected 19 line(s), got 19 |
| v3.prose.frontier.06 | prose | prose | pass | 1.0 | 13.915743135963567 | 201 | 2977 | 2819 | 3178 | stop | 0.0063924 | structural_count | Expected 12 line(s), got 12 |
| v3.prose.frontier.07 | prose | prose | fail | 0.0 | 40.76198083197232 | 292 | 4096 | 4095 | 4388 | length | 0.008806 | structural_count | Expected 7 stanza(s), got 40 |
| v3.prose.frontier.08 | prose | prose | pass | 1.0 | 15.619035255047493 | 229 | 2532 | 2360 | 2761 | stop | 0.0054775 | structural_count | Expected 14 line(s), got 14 |
| v3.prose.frontier.09 | prose | prose | pass | 1.0 | 19.278721163980663 | 191 | 3422 | 3398 | 3613 | stop | 0.0073199 | structural_count | Expected 1 line(s), got 1 |
| v3.prose.frontier.10 | prose | prose | pass | 1.0 | 40.78015212295577 | 172 | 3883 | 3617 | 4055 | stop | 0.0082747 | structural_count | Expected 26 line(s), got 26 |
| v3.prose.frontier.11 | prose | prose | fail | 0.0 | 47.35733649705071 | 156 | 4096 | 4095 | 4252 | length | 0.0087108 | structural_count | Expected 1 line(s), got 38 |
| v3.prose.frontier.12 | prose | prose | fail | 0.0 | 4.976457386976108 | 173 | 691 | 690 | 864 | error | 0 | structural_count | Expected 1 stanza(s), got 5 |
| writing_article | writing | writing | pass | 1.0 | 5.919102311017923 | 34 | 911 | 474 | 945 | stop | 0.0019369 | text_contains | Matched 6/6 keywords (need 4) |
| writing_summary | writing | writing | pass | 1.0 | 2.051004679990001 | 111 | 256 | 255 | 367 | length | 0.0006153 | text_contains | Matched 4/4 keywords (need 2) |
| writing_creative | writing | writing | pass | 0.8 | 3.3259411790641025 | 36 | 512 | 511 | 548 | length | 0.0011004 | text_contains | Matched 4/5 keywords (need 3); missing: ['create'] |
| writing_technical | writing | writing | pass | 1.0 | 3.3779005319811404 | 34 | 512 | 511 | 546 | length | 0.001099 | text_contains | Matched 7/7 keywords (need 3) |
| writing_format | writing | writing | pass | 1.0 | 1.5891725529218093 | 37 | 128 | 127 | 165 | length | 0.0002947 | text_contains | Matched 4/4 keywords (need 4) |
| tool_call_weather | tool_calling | tool_calling | pass | 1.0 | 0.9109875799622387 | 154 | 59 | 44 | 213 | tool_calls | 0.0002317 | tool_call | tool=get_weather ✓; arg location=Tokyo ✓ |
| tool_call_calculator | tool_calling | tool_calling | pass | 1.0 | 1.2387140500359237 | 152 | 39 | 24 | 191 | tool_calls | 0.0001883 | tool_call | tool=calculate ✓; arg expression=45 * 73 ✓ |

## Verification notes

Checked on 2026-10-29:

- Model id, context, price, modality, reasoning object, and canonical slug came from `https://openrouter.ai/api/v1/models` on our key. Endpoint prices came from `/api/v1/models/mistralai/mistral-large-4-0-20261006/endpoints`.
- The score, category split, token totals, finish reasons, and row costs came from `stage1_cal-mistral-large-4-0-or-low-strict-v01_20261029_222257.json`. `summary.total` is 157. `summary.error` is 0. `reasoning_effort` is `low`.
- The October 6 category counts came from `stage1_cal-mistral-large-4-0-or-strict-v01_20261007_025500.json`. That file's `reasoning_effort` is null. It has no per-row reasoning or cost fields.
- The $0.989915 figure is `/v1/key` usage after the run minus usage at 22:21:53 UTC. The graded cost is the sum of saved `cost`.
- `smf-bench` at `5d9ddf6` has no `mistral-large-4-0` branch in `run_stage1.py`. This score is the local payload the banner printed.
- This file is not a rank on the OpenRouter slash list. The board row for this slug stays the October 6 post.
