---
slug: "2026-09-25-space-bunny-alpha-official-a"
title: "Official A: Space Bunny Alpha 128/157, tied with MiMo-V2.6-Pro"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-09-25"
excerpt: "stealth/space-bunny-alpha scores 128/157 (81.5%) thinking off on the 157-test Official A board. Zero errors, 48.3 minutes, key counter unchanged. Same total as MiMo-V2.6-Pro. Eight points behind Union Alpha, and much faster."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "official-a", "space-bunny-alpha", "openrouter", "stealth", "mimo-v2.6-pro"]
readTime: 8
image: "/images/blog/2026-09-25-space-bunny-alpha-official-a.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-25-space-bunny-alpha-official-a"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

OpenRouter lists `stealth/space-bunny-alpha`. We do not name a lab. Today's [LIMINAL one-shot](/blog/2026-09-25-space-bunny-alpha-liminal-most-beautiful-html) is a different harness. This post is the 157.

Space Bunny Alpha scores **128/157 (81.5%)** thinking off. Zero errors. Wall **2896.6 s (48.3 min)**. The OpenRouter key counter did not move: `379.819363028` before and after. The card price is $0/$0.

## The question

On the Official A board, is this stealth slug a Union-class endpoint, or a tie with MiMo-V2.6-Pro?

## The off path

Do not copy an Ox or Union disable recipe. Smoke was `What is 2+2? Reply with the number only.`, temperature 0, `max_tokens=64`.

| Call | content | reasoning field | reasoning_tokens | wall |
|------|---------|-----------------|------------------|------|
| default | `4` | a short string | 0 | 1.08 s |
| `enable_thinking=false` | `4` | empty | 0 | 1.23 s |

`--thinking off` sends that second call. Content landed. We did not add `space-bunny`, `stealth`, or `alpha` to `reasoning_indicators`. `max_tokens` stayed 1024.

An identity probe at `max_tokens=1024` on the same off flag returned: "My model name, maker, and knowledge cutoff are all undisclosed." The same prompt at `max_tokens=128` returned null content and a reasoning string. Short caps are a bad probe. The 157 uses 1024.

A native `get_weather` call returned city Tokyo and unit celsius. The bench tool tests later passed 2/2.

## The stack

| Field | Value |
|-------|-------|
| Model | `stealth/space-bunny-alpha` |
| Endpoint | `https://openrouter.ai/api/v1` |
| Tag | `cal-space-bunny-alpha-strict-v01` |
| Profile | `strict_v01`, standard v0.1.1 |
| Thinking | off (`enable_thinking=false`) |
| Recipe | `OpenRouter-cloud` |
| Context / max out | 1,000,000 / 524,288 |
| Card in → out | text, image, video → text. This run was text only. |
| Card price | $0 / $0 |
| Catalog created | 2026-09-23 14:48:04 UTC |
| Run date | 2026-09-25 |
| Hardware gate | not used. Cloud run. `hf-gate.json` was absent. |

## Score

| | Space Bunny Alpha | Union Alpha | MiMo-V2.6-Pro |
|--|-------------------|-------------|---------------|
| Score | **128/157 (81.5%)** | 136/157 (86.6%) | **128/157 (81.5%)** |
| Fail / error | 29 / 0 | 21 / 0 | 29 / 0 |
| Wall | 2896.6 s | 16540.5 s | 2536.6 s |
| Off path | `enable_thinking=false`, max_tokens 1024 | same class of path | same class of path |
| JSON date | 2026-09-25 | 2026-09-16 | 2026-09-24 |

Space Bunny latency on this run: mean 18.43 s, median 11.59 s, max 85.97 s. Seven tests exceeded 60 s. None hit the 300 s timeout.

### By suite

| Suite | Space Bunny | Union Alpha | MiMo-V2.6-Pro |
|-------|-------------|-------------|---------------|
| math | 23/30 | 24/30 | 18/30 |
| coding | 23/30 | 26/30 | 25/30 |
| reasoning | 24/30 | 30/30 | 24/30 |
| instruction | 28/30 | 28/30 | 28/30 |
| prose | 23/30 | 24/30 | 28/30 |
| writing | **5/5** | 2/5 | 3/5 |
| tool_calling | **2/2** | **2/2** | **2/2** |

## What the misses look like

This was not a timeout run.

Coding, 7 fails: six are `SyntaxError` (five `invalid decimal literal`, one unterminated string). One is `NameError: name 'tokens' is not defined`. The harness rejected the code. I am not assigning a single cause to the decimal errors.

Math, 7 fails: exact-decimal regex misses.

Reasoning, 6 fails: boxed-answer or integer regex misses.

Instruction and prose failed when the test wanted a count and the model wrote more. One instruction test asked for 6 lines and got 129. One prose test asked for 1 line and got 18. Another asked for 12 lines and got 60.

Writing and tools were clean.

## Where it sits

Union Alpha and MiMo-V2.6-Pro are the fair neighbors. Neither slug is in `reasoning_indicators`, so those runs did not take the 4096-token bump.

Space Bunny is eight points behind Union Alpha and much faster: 48.3 minutes against 275.7. It ties MiMo-V2.6-Pro on the total, with a different shape. Better math (23 vs 18) and writing (5 vs 3). Worse prose (23 vs 28) and coding (23 vs 25). Reasoning and instruction match.

Ox Alpha's best thinking-off file is 129/157. That slug is in `reasoning_indicators`, so that run used the 4096-token path. One point is not a same-shape comparison.

I am not publishing a single rank ordinal. A 2026-09-16 table in the bench notes does not match the current thinking-off JSON set. The numbers above are the files named in the verification notes.

## Reproducing this

Scripts and the raw JSON are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/space-bunny-alpha).

```bash
cd /home/mikesai1/workspace/smf-bench
export SMF_SERVE_RECIPE_ID=OpenRouter-cloud
export OPENROUTER_API_KEY=...   # from ~/.hermes/.env; do not pass it on the command line
python3 run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model stealth/space-bunny-alpha \
  --tag cal-space-bunny-alpha-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300
```

## Verification notes

Measured 2026-09-25. No lab name. No guessed parameter count.

- This run: `stage1_cal-space-bunny-alpha-strict-v01_20260925_120134.json` — 128/157, error 0, wall 2896.6 s, thinking off, `OpenRouter-cloud`.
- Union Alpha: `stage1_cal-union-alpha-strict-v01_20260916_155705.json` — 136/157, wall 16540.5 s.
- MiMo-V2.6-Pro: `stage1_cal-mimo-v26-pro-strict-v01_20260924_191609.json` — 128/157, wall 2536.6 s.
- Ox Alpha (different request shape): `stage1_cal-ox-alpha-strict-v01-20260824_20260824_155541.json` — 129/157.
- Key counter: `379.819363028` before and after. Delta 0.
- Catalog read: context 1,000,000, max completion 524,288, modalities text/image/video in and text out, pricing 0/0, created 2026-09-23 14:48:04 UTC.
- Hero: Qwen-Image-2.1 INT8 ConvRot on spark-d369, 1216×640, 25-step euler/simple, cfg 1, shift 3.1, seed 20260925, wall 14.1 s. A vision pass saw no face, readable text, logo, or watermark. The still has paper ears; the prompt asked for a fold silhouette.
