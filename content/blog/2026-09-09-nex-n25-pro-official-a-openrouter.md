---
slug: "2026-09-09-nex-n25-pro-official-a-openrouter"
title: "Official A: Nex-N2.5-Pro Free Scores 51.6% on OpenRouter"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-09-09"
excerpt: "Nex-AGI listed Nex-N2.5-Pro on OpenRouter free the day it shipped. Same 157-test Official A suite, thinking off: 81/157 (51.6%), math 1/30, twelve HTTP 429s, $0. Weights are not on Hugging Face yet."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "official-a", "nex", "nex-n2.5", "openrouter", "cloud-models"]
readTime: 11
image: "/images/blog/2026-09-09-nex-n25-pro-official-a-openrouter.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-09-nex-n25-pro-official-a-openrouter"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Nex-AGI shipped Nex-N2.5 on September 8, 2026. OpenRouter listed the free Pro slug the same day as `nex-agi/nex-n2.5-pro:free` — 262K context, $0, text+image in, text out, FP8 on the Nex AGI endpoint. Hugging Face has a card and figures. It does not have weights.

This post is smf-bench **Official A**: 157 tests, `strict_v01`, thinking **off**. Ranking stays thinking-off. We document the analogue we actually sent.

## The question

Does a day-one free OpenRouter listing of an agentic coding model land on our 157-test board with Grok and Fable, or does single-shot thinking-off show a different machine than Terminal-Bench?

## The stack

| Field | Value |
|-------|--------|
| Model | `nex-agi/nex-n2.5-pro:free` |
| Provider | OpenRouter → Nex AGI (`nex-agi/fp8`) |
| Context | 262,144 (`/v1/models`) |
| Price | $0 / $0 |
| Released | 2026-09-08 |
| Tokenizer | Qwen3 (OpenRouter architecture field) |
| License | Apache-2.0 (Hugging Face `cardData`) |
| Weights | Not published at intake (README + figures only) |
| Harness | smf-bench Official A `strict_v01`, 157 tests |
| Thinking | **off analogue** — `reasoning.effort=none` (vendor non-thinking) |
| Transport | SSE (`stream=true`); non-stream hangs on whitespace keepalives |
| Timeout | 420 s |
| Tag | `cal-nex-n25-pro-or-strict-v01` |
| Serve recipe id | `OpenRouter-cloud` |
| Date | 2026-09-08 run, 2026-09-09 write-up |

Vendor thinking modes (Nex-N2.5 README): `none` = non-thinking, `medium` = adaptive (default), `high` = always think. We did **not** add `nex` to `reasoning_indicators`. That would bump every test to 4096 tokens.

Smoke before the run:

- First call (`effort=none`, stream): 240 s of `: OPENROUTER PROCESSING`, 0 tokens, generation id assigned.
- Second call, same payload: content `NEX_OK`, `reasoning_tokens=0`, `finish_reason=stop`, 19+4 tokens, $0. Id `gen-1788922973-ScqupbSASQLN2qpkGJna`. Response `model` matched the requested slug.
- Non-stream POST: HTTP 200 with whitespace keepalives, no JSON, 90 s timeout.

Endpoint snapshot at intake (`/v1/models/.../endpoints`): status **-5**, 5-minute uptime **55.3%**, p50 latency 13.0 s, p90 **163 s**, p99 **281 s**, ~16 tok/s p50, 5,080 text requests in 30 minutes.

## Official A — thinking off

Wall time **4715.3 s (78.6 min)**. **12 errors, all HTTP 429** (`nex-agi/nex-n2.5-pro:free is tempo…`). Mean latency **27.3 s**, median **4.5 s**. Cost **$0**.

| Category | Nex-N2.5-Pro free | Fable 5.1 | Grok 4.6 | DSV4 local |
|----------|-------------------|-----------|----------|------------|
| coding | 16/30 (53.3%) | 26/30 | **30/30** | 22/30 |
| instruction | 25/30 (83.3%) | 27/30 | **30/30** | 26/30 |
| math | 1/30 (3.3%) | 26/30 | **28/30** | 13/30 |
| prose | 26/30 (86.7%) | 27/30 | 28/30 | 27/30 |
| reasoning | 9/30 (30.0%) | **30/30** | **30/30** | 24/30 |
| tool_calling | 0/2 | **2/2** | **2/2** | **2/2** |
| writing | 4/5 (80.0%) | 4/5 | **5/5** | 3/5 |
| **TOTAL** | **81/157 (51.6%)** | 142/157 (90.4%) | **153/157 (97.5%)** | 117/157 (74.5%) |

Drop the 12 rate-limit errors and the remaining tests are **81/145 (55.9%)**. That is still last on this board.

### Ranking (Official A, thinking off)

| Rank | Model | Score | Wall | Where |
|------|-------|-------|------|-------|
| 1 | Grok 4.6 | 153/157 (97.5%) | 150 min | OpenRouter |
| 2 | Grok 4.5 | 152/157 (96.8%) | 112 min | OpenRouter |
| 3 (tie) | Gemini 3.8 Flash | 145/157 (92.4%) | 19.4 min | OpenRouter |
| 3 (tie) | Muse Spark 1.3 | 145/157 (92.4%) | 18.9 min | OpenRouter |
| 5 | Fable 5.1 | 142/157 (90.4%) | 35.0 min | OpenRouter |
| 6 | Kimi K3 | 140/157 (89.2%) | 48 min | Ollama Cloud |
| 7 | Qwen3.8-Flash-Next | 137/157 (87.3%) | — | 1× DGX Spark |
| 8 | GLM-5.2 | 121/157 (77.1%) | 53 min | Ollama Cloud |
| 9 | DSV4 Vision-Exp | 117/157 (74.5%) | 25.4 min | 2× DGX Spark |
| 10 | **Nex-N2.5-Pro free** | **81/157 (51.6%)** | **78.6 min** | OpenRouter |

## By difficulty

| Tier | Pass | Rate |
|------|------|------|
| Easy (10) | 8/10 | 80.0% |
| Medium (15) | 7/15 | 46.7% |
| Hard (25) | 12/25 | 48.0% |
| Expert (40) | 22/40 | 55.0% |
| Frontier (60) | 28/60 | 46.7% |
| Other (writing + tools, 7) | 4/7 | 57.1% |

Easy holds. Everything else sits near half.

## Where it broke

**Math (1/30)** — thinking-off collapse. 27 regex misses, 2× 429. The one pass is `v3.math.easy.01`. This is the same pattern we have seen on other models when CoT is forced off; it is not a Terminal-Bench number.

**Reasoning (9/30)** — 16 regex misses, 5× 429. Single-shot, no tools.

**Coding (16/30)** — **0 SyntaxErrors**. 5 of the 14 non-passes are 429s. Two tests returned no extractable code at ~300 s (`medium.02`, `expert.04`). The rest are assertion / `NameError` / `TypeError` failures. Excluding 429s, coding is 16/25 (64.0%).

**Instruction (25/30)** — five structural misses, including the same `obsidian-caravel-…` / `a9gre9dni9ckk13` tokens Fable also fails, plus one 300 s empty (`frontier.07`).

**Prose (26/30)** — four count/regex misses.

**Writing (4/5)** — `writing_format` missed the `JSON` keyword.

**Tools (0/2)** — `get_weather` fired with the wrong `location`; calculator emitted no tool call.

Failure mix: 12× HTTP 429, 0 SyntaxError, 2 empty-code, 2 tool misses, the rest regex/assert/count.

## What this is not

- It is not a Terminal-Bench, SWE-Bench, or OSWorld score. Nex-AGI publishes those on the model card (Pro: Terminal-Bench 2.1 **82.7**, SWE-Bench Pro **61.2**, OSWorld-Verified **82.2**). Those are agentic loops. Official A is one shot, thinking off.
- It is not a local Spark number. There is nothing to load. Vendor serve for Pro is SGLang, `--tp 8`, 8× H100, `--reasoning-parser qwen3`, `--tool-call-parser qwen3_coder`.
- It is not a thinking-on score. Ranking stays off. Math 1/30 is the off path.
- It is not a claim the free endpoint is a production route. Status -5, 429s, and a 240 s queue on the first smoke are the measured service, not a vibe.

## Cost and latency

| | Nex-N2.5-Pro free | Fable 5.1 | Grok 4.6 |
|--|-------------------|-----------|----------|
| Wall | 78.6 min | 35.0 min | 150 min |
| Mean / median latency | 27.3 s / 4.5 s | 13.4 s / 12.3 s | 56.5 s / — |
| Errors | 12 (429) | 0 | 0 |
| This-run spend | **$0** | $6.85 | (prior run) |

Free is free. It is also queued and rate-limited on day one.

## Reproducing

Raw JSON, run log, smoke, and catalog snapshot:

- [NemoKnowledgebase / nex-n2.5-pro](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/nex-n2.5-pro)
- Tag `cal-nex-n25-pro-or-strict-v01`

```bash
cd smf-bench
export SMF_SERVE_RECIPE_ID=OpenRouter-cloud
python3 -u run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model nex-agi/nex-n2.5-pro:free \
  --tag cal-nex-n25-pro-or-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 420 \
  --api-key "$OPENROUTER_API_KEY"
```

The runner sends `{reasoning: {effort: "none"}}` and `stream=true` when `--thinking off` and the model id contains `nex`. Non-stream requests on this slug do not complete.

The framework is MIT-licensed at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

## Verification notes

- Totals from `results/stage1_cal-nex-n25-pro-or-strict-v01_20260909_030620.json` (`summary` 81/157, `pass_rate` 51.6, `error` 12, `wall_time_seconds` 4715.3).
- Per-category from `by_category`. Difficulty parsed from `v3.<cat>.<tier>.<n>` test IDs.
- Model id, 262K context, $0 pricing, Qwen3 tokenizer, text+image: OpenRouter `/v1/models` on 2026-09-08 for `nex-agi/nex-n2.5-pro:free`.
- Endpoint health, FP8 tag, latency percentiles: OpenRouter `/v1/models/nex-agi/nex-n2.5-pro:free/endpoints` in the same session.
- Hugging Face `nex-agi/Nex-N2.5-Pro`: Apache-2.0, created 2026-09-08T11:01:41Z, siblings README + figures, `safetensors` absent, downloads 0 at intake.
- Vendor sampling and `reasoning_effort` table: [Nex-N2.5 README](https://github.com/nex-agi/Nex-N2.5/blob/main/README.md).
- Vendor bench numbers in “What this is not” are Nex-AGI’s tables, not ours.
- Cloud comparators: prior Official A posts (Grok 4.6, Fable 5.1, Gemini 3.8 Flash, Muse Spark 1.3, Kimi K3, GLM-5.2). Local: Qwen3.8-Flash-Next 137/157, DSV4 Vision-Exp 117/157.
- Smoke: `NEX_OK`, `reasoning_tokens=0`, id `gen-1788922973-ScqupbSASQLN2qpkGJna`.
