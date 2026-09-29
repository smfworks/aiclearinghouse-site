---
slug: "2026-09-22-claude-opus-5.5-official-a-openrouter"
title: "Official A: Claude Opus 5.5 Scores 96.2% on OpenRouter"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-09-22"
excerpt: "anthropic/claude-opus-5.5 on OpenRouter. SMF Official A (157 tests, thinking off): 151/157 (96.2%), zero errors, 26 minutes, $3.64. One point behind Grok 4.5. Same-day HTML one-shots are a different harness."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "official-a", "claude-opus-5.5", "anthropic", "openrouter", "cloud-models"]
readTime: 12
image: "/images/blog/2026-09-22-claude-opus-5.5-official-a-openrouter.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-22-claude-opus-5.5-official-a-openrouter"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

OpenRouter lists Claude Opus 5.5 as `anthropic/claude-opus-5.5` — 1M context, $4 / $20 per million tokens. Same-day one-shot HTML posts already shipped ([AURORA](/blog/2026-09-22-claude-opus-5.5-aurora-most-beautiful-html), [Merrow Cut](/blog/2026-09-22-claude-opus-5.5-merrow-cut-one-shot)). This post is the other measurement: **smf-bench Official A**, 157 tests, `strict_v01`.

Official A ranking is thinking **off**. Smoke landed content with **0** reasoning tokens. We did not add `claude` or `opus` to `reasoning_indicators`.

## The question

Does Opus 5.5 sit with the Groks on the same 157-test board, or with Fable 5.1?

## The stack

| Field | Value |
|-------|--------|
| Model | `anthropic/claude-opus-5.5` |
| Provider | OpenRouter (Anthropic upstream) |
| Context | 1,000,000 (`/v1/models`) |
| Max output | 128,000 |
| Price | $4 / $20 per 1M in/out; cache read $0.20 / 1M |
| Inputs (card) | text, image, file → text |
| Official A | **text-only** |
| Harness | smf-bench Official A `strict_v01`, 157 tests |
| Thinking | **off** (`chat_template_kwargs.enable_thinking=false`) |
| Timeout | 300 s |
| Token budget | non-reasoning path, `max_tokens=1024` unless the case sets its own |
| Tag | `cal-claude-opus-55-or-strict-v01` |
| Serve recipe | `OpenRouter-cloud` |
| Date | 2026-09-22 |

We ran the live slug, not `anthropic/claude-opus-5.5:batch`.

Smoke before the 157, `What is 2+2?`, temp 0, `max_tokens=64`:

| Call | content | `reasoning_tokens` | elapsed |
|------|---------|-------------------|---------|
| default | `'2 + 2 = **4**'` | 0 | 2.34 s |
| `enable_thinking=false` | `'2 + 2 = **4**'` | 0 | 2.29 s |

That is true off. `reasoning` is in `supported_parameters`; we still sent the runner's `--thinking off` kwarg. We did **not** add `claude`/`opus` to `reasoning_indicators`. That would bump every test to `max_tokens=4096`.

OpenRouter `/v1/key` before: usage **374.747214738**. After: **378.383594738**. Delta **$3.63638**.

`hf-gate.json` was absent. Cloud runs skip M10.

## Official A — thinking off

Wall **1561.8 s (26.0 min)**. **0 errors. 0 timeouts.** 157 unique test IDs. Mean latency **9.93 s**, median **9.60 s**, p90 **15.0 s**, max **29.5 s**.

| Category | Opus 5.5 | Grok 4.6 | Fable 5.1 | Astra Pro batch |
|----------|----------|----------|-----------|-----------------|
| coding | 28/30 (93.3%) | **30/30** | 26/30 | **30/30** |
| instruction | **30/30** | **30/30** | 27/30 | **30/30** |
| math | 27/30 (90.0%) | **28/30** | 26/30 | **28/30** |
| prose | 29/30 (96.7%) | 28/30 | 27/30 | **30/30** |
| reasoning | **30/30** | **30/30** | **30/30** | **30/30** |
| tool_calling | **2/2** | **2/2** | **2/2** | **2/2** |
| writing | **5/5** | **5/5** | 4/5 | 3/5 |
| **TOTAL** | **151/157 (96.2%)** | **153/157 (97.5%)** | 142/157 (90.4%) | **153/157 (97.5%)** |

### Ranking (Official A, thinking off)

| Rank | Model | Score | Wall | Where |
|------|-------|-------|------|-------|
| 1 (tie) | Grok 4.6 | 153/157 (97.5%) | 150 min | OpenRouter |
| 1 (tie) | GPT-6 Astra Pro (batch) | 153/157 (97.5%) | 4.7 min (batch) | OpenRouter Batch |
| 3 | Grok 4.5 | 152/157 (96.8%) | 112 min | OpenRouter |
| 4 | **Claude Opus 5.5** | **151/157 (96.2%)** | **26.0 min** | OpenRouter |
| 5 (tie) | Gemini 3.8 Flash | 145/157 (92.4%) | 19.4 min | OpenRouter |
| 5 (tie) | Muse Spark 1.3 | 145/157 (92.4%) | 18.9 min | OpenRouter |
| 7 | Fable 5.1 | 142/157 (90.4%) | 35.0 min | OpenRouter |
| 8 | Kimi K3 | 140/157 (89.2%) | 48 min | Ollama Cloud |
| 9 | Qwen3.8-Flash-Next | 137/157 (87.3%) | — | 1× DGX Spark |
| 10 | Union Alpha | 136/157 (86.6%) | 4.59 h | OpenRouter |
| 11 | Hy4 preview | 130/157 (82.8%) | 30.5 min | OpenRouter |
| 12 | GLM-5.2 | 121/157 (77.1%) | 53 min | Ollama Cloud |
| 13 | DSV4 Vision-Exp | 117/157 (74.5%) | 25.4 min | 2× DGX Spark |
| 14 | Nex-N2.5-Pro free | 81/157 (51.6%) | 78.6 min | OpenRouter |

Opus 5.5 is **one point behind Grok 4.5** and **two points behind the 97.5% tie**. It is **5.8 points ahead of Fable 5.1**, the previous Anthropic row on this board. The 26-minute wall is sync chat, not batch.

This table does not re-run the comparators. Totals are from the named Official A posts and the [157-test board](/blog/2026-09-10-official-a-board-157).

## By difficulty

Parsed from `v3.<suite>.<tier>.<n>`. The 7 writing/tool items are `other`.

| Tier | Pass | Rate |
|------|------|------|
| Easy (10) | 10/10 | 100% |
| Medium (15) | 15/15 | 100% |
| Hard (25) | 24/25 | 96.0% |
| Expert (40) | 37/40 | 92.5% |
| Frontier (60) | 58/60 | 96.7% |
| Other (7) | 7/7 | 100% |

Easy and medium are clean. The six misses sit in hard/expert/frontier.

## The 6 failures

**Math (3)** — `expert.06` (`-0.01384`), `expert.07` (`-9.417`), `frontier.08` (`15.7987`). Regex misses, not timeouts. Tokens 793 / 1,114 / 1,331. Grok 4.6 and Astra Pro still fail the first two cells. Opus adds the third.

**Coding (2)** — syntax floor **2/30**. `expert.05`: `SyntaxError: invalid syntax`. `frontier.01`: `SyntaxError: invalid character '≤' (U+2264)`. That Unicode leak is the same class we documented on Kimi K3. Grok 4.6 is 30/30 here.

**Prose (1)** — `hard.04`: regex `[eE]` did not match. Tokens 1,434.

Failure mix: 0 errors, 0 timeouts, 2 SyntaxError, 4 regex.

## What this is not

- It is not the AURORA or Merrow Cut one-shots. Those are craft, one prompt each.
- It is not a thinking-on score. Ranking stays off. We did not run the diagnostic on-arm.
- It is not the `:batch` slug. Half-price batch exists; this run used live chat.
- It is not a vision score. The card claims image and file in. Official A stayed text-only.

## Cost and latency

| | Opus 5.5 | Fable 5.1 | Astra Pro batch |
|--|----------|-----------|-----------------|
| Wall | **26.0 min** (sync) | 35.0 min (sync) | 4.7 min (batch) |
| Errors | 0 | 0 | 0 |
| This-run spend | **$3.64** | $6.85 | $4.10 |
| List price | $4 / $20 per 1M | $10 / $50 per 1M | $5 / $25 per 1M |

Mean pass latency 9.93 s. Interactive enough for this suite. Cheaper than Fable on the same 157.

## What I would use it for

1. **Cloud agent loops that need tools and writing.** Tools 2/2, writing 5/5, instruction 30/30.
2. **Coding drafts with a human merge.** 28/30 is usable. Two SyntaxErrors, including a `≤` leak, means do not merge unattended.
3. **Not** a Grok 4.6 replacement on this board. Two points back, and the gap is math precision plus the syntax floor.
4. **Not** a claim about vision or long-horizon computer use. We did not measure those.

Local production on this lab stays the Spark serves (DSV4 Vision-Exp / MiniMax H3). Opus 5.5 is a cloud row.

## Reproducing

Raw JSON, run log, manifest, and the fail inventory:

[github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/claude-opus-5.5-or](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/claude-opus-5.5-or)

```bash
cd smf-bench
export SMF_SERVE_RECIPE_ID=OpenRouter-cloud
python3 -u run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model anthropic/claude-opus-5.5 \
  --tag cal-claude-opus-55-or-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300
```

`run_stage1.py` reads `OPENROUTER_API_KEY` from the environment. Tag prefix `cal-`: measurement, not a D-series rank. Do not add `claude` or `opus` to `reasoning_indicators`.

The framework: [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

## Verification notes

- Official A numbers: `results/stage1_cal-claude-opus-55-or-strict-v01_20260922_215554.json` (`summary` 151/157, `pass_rate` 96.2, `error` 0, `wall_time_seconds` 1561.8, `thinking` off, `serve_recipe_id=OpenRouter-cloud`, `standard_version` v0.1.1). 157 unique `test_id`s.
- Per-category from `by_category`. Difficulty parsed from `v3.<cat>.<tier>.<n>` test IDs.
- Model id, 1M context, $4/$20 pricing, max completion 128k, `supported_parameters`: OpenRouter `GET /v1/models` on 2026-09-22 for `anthropic/claude-opus-5.5`.
- Smoke 2+2: same-day chat completions on the lab OpenRouter key; default and `enable_thinking=false` both `reasoning_tokens=0`.
- Credits: `/v1/key` before 374.747214738 / after 378.383594738.
- Cloud comparators: prior Official A posts (Grok 4.6, Grok 4.5, GPT-6 Astra Pro batch, Fable 5.1, Gemini 3.8 Flash, Muse Spark 1.3, Union Alpha, Hy4, Nex-N2.5-Pro). Local: Qwen3.8-Flash-Next 137/157, DSV4 Vision-Exp 117/157.
- Same-day AURORA and Merrow Cut posts are one-shot HTML, not this harness.

---

*SMF Official A · strict_v01 · thinking off · OpenRouter · 2026-09-22 · wall 1561.8 s*
