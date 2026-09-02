---
slug: "2026-09-02-fable-51-official-a-openrouter"
title: "Official A: Claude Fable 5.1 Scores 90.4% on OpenRouter"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-09-02"
excerpt: "Anthropic's Claude Fable 5.1 landed on OpenRouter. We ran the same 157-test Official A suite as Grok 4.6. Thinking off: 142/157 (90.4%), zero errors, 35 minutes. That is #3 — behind both Groks, a point ahead of Kimi K3."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "official-a", "fable", "anthropic", "openrouter", "cloud-models"]
readTime: 12
image: "/images/blog/2026-09-02-fable-51-official-a-openrouter.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-02-fable-51-official-a-openrouter"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Anthropic shipped Claude Fable 5.1 on September 1, 2026. OpenRouter listed it the same day as `anthropic/claude-fable-5.1` — 1M context, $10 / $50 per million tokens. Aiona already ran two one-shot HTML demos. This post is the other measurement: **smf-bench Official A**, the same 157-test `strict_v01` profile we used on Grok 4.6, Kimi K3, GLM-5.2, and local DSV4 Vision-Exp.

Official A is thinking **off**. That is a ranking rule. We did not spend extra credit on a thinking-on math arm.

## The question

Does Fable 5.1, billed as a coding and knowledge-work upgrade over Fable 5, land with Grok on our 157-test board — or with Kimi?

## The stack

| Field | Value |
|-------|--------|
| Model | `anthropic/claude-fable-5.1` |
| Provider | OpenRouter (Anthropic upstream) |
| Context | 1,000,000 (OpenRouter `/v1/models`) |
| Price | $10 / $50 per 1M in/out; cache read $0.25 / 1M |
| Released | 2026-09-01 |
| Harness | smf-bench Official A `strict_v01`, 157 tests |
| Thinking | **off** (`chat_template_kwargs.enable_thinking=false`) |
| Timeout | 300 s |
| Temperature | runner defaults (non-reasoning path, max_tokens=1024 unless the test sets its own) |
| Tag | `cal-fable-51-or-strict-v01` |
| Serve recipe id | `OpenRouter-cloud` |
| Date | 2026-09-02 |

Smoke test before the run: `What is 2+2?` returned `content: '4'`, `reasoning_tokens: 0`. A second call with the Official A thinking-off kwarg returned a one-line `add(a,b)` function, still 0 reasoning tokens. We did **not** add `fable`/`claude` to `reasoning_indicators`. That would have bumped every test to 4096 tokens and burned the $46 credit.

OpenRouter credits at start of the session: **$46.00** remaining ($585 billed − $539.00 used). After the run: **$39.14** remaining ($545.86 used). Delta **$6.85**.

## Official A — thinking off

Wall time **2100.8 s (35.0 min)**. **0 errors. 0 timeouts.** Mean latency **13.4 s**, median **12.3 s**.

| Category | Fable 5.1 | Grok 4.6 | Kimi K3 | GLM-5.2 | DSV4 local |
|----------|-----------|----------|---------|---------|------------|
| coding | 26/30 (86.7%) | **30/30** | 23/30 | 14/30 | 22/30 |
| instruction | 27/30 (90.0%) | **30/30** | **30/30** | 28/30 | 26/30 |
| math | 26/30 (86.7%) | **28/30** | 24/30 | 17/30 | 13/30 |
| prose | 27/30 (90.0%) | 28/30 | 28/30 | 27/30 | 27/30 |
| reasoning | **30/30** | **30/30** | 28/30 | 28/30 | 24/30 |
| tool_calling | **2/2** | **2/2** | **2/2** | **2/2** | **2/2** |
| writing | 4/5 (80.0%) | **5/5** | **5/5** | **5/5** | 3/5 |
| **TOTAL** | **142/157 (90.4%)** | **153/157 (97.5%)** | 140/157 (89.2%) | 121/157 (77.1%) | 117/157 (74.5%) |

### Ranking (Official A, thinking off)

| Rank | Model | Score | Wall | Where |
|------|-------|-------|------|-------|
| 1 | Grok 4.6 | 153/157 (97.5%) | 150 min | OpenRouter |
| 2 | Grok 4.5 | 152/157 (96.8%) | 112 min | OpenRouter |
| 3 | **Fable 5.1** | **142/157 (90.4%)** | **35.0 min** | OpenRouter |
| 4 | Kimi K3 | 140/157 (89.2%) | 48 min | Ollama Cloud |
| 5 | GLM-5.2 | 121/157 (77.1%) | 53 min | Ollama Cloud |
| 6 | DSV4 Vision-Exp | 117/157 (74.5%) | 25.4 min | 2× DGX Spark |

Fable takes **#3**. It is 7.1 points behind Grok 4.6 and 1.2 points ahead of Kimi K3. It is more than four times faster than Grok 4.6 on this suite.

## By difficulty

| Tier | Pass | Rate |
|------|------|------|
| Easy (10) | 10/10 | 100% |
| Medium (15) | 15/15 | 100% |
| Hard (25) | 22/25 | 88.0% |
| Expert (40) | 35/40 | 87.5% |
| Frontier (60) | 54/60 | 90.0% |
| Other (writing + tools, 7) | 6/7 | 85.7% |

Easy and medium are clean. The misses sit in hard/expert/frontier, plus one writing item.

## The 15 failures

**Math (4)** — all regex misses, not timeouts. Two of them are the same high-precision cells Grok 4.6 still fails (`expert.06` `-0.01384`, `expert.07` `-9.417`). Fable also misses `expert.08` (`29.924`) and `frontier.11` (`59.596`). Elapsed 5–50 s. Two of those used ~4300 tokens, so the 1024 default was not the cap on those tests (the YAML sets a higher `max_tokens`).

**Coding (4)** — 26/30, one SyntaxError (`expert.05`). Three tests (`hard.04`, `frontier.06`, `frontier.10`) returned **no extractable code** with `tokens_used=0` in 1.8–3.2 s. That is empty generation, not a slow refusal. Grok is still the only model we have measured at 30/30 coding with zero SyntaxErrors.

**Instruction (3)** — the model explained the transformation instead of emitting the required token (`obsidian-caravel-…`, `sguor5`, `a9gre9dni9ckk13`). Grok and Kimi both go 30/30 here.

**Prose (3)** — `hard.04` is the same `[eE]` character constraint Grok 4.6 fails. `frontier.02` and `frontier.05` missed line counts (1 vs 12, 3 vs 19).

**Writing (1)** — `writing_creative` matched 0/5 keywords (`robot`, `art`, `dialogue`, `discover`, `create`). The other four writing tests passed.

Failure mix: 1 SyntaxError, 5 regex misses, 5 structural/count misses, 3 empty-code, 1 keyword miss.

## What this is not

- It is not a Fable 5 vs 5.1 delta. We have no Official A number for Fable 5.
- It is not a thinking-on score. Ranking stays thinking-off.
- It is not a claim that Fable matches Grok on single-shot coding. 26/30 with three empty responses is the measured gap.
- Same-day Hallerby Light and Sallow Lock posts are one-shot HTML demos, not this harness.

## Cost and latency

| | Fable 5.1 | Grok 4.6 | Kimi K3 |
|--|-----------|----------|---------|
| Wall | 35.0 min | 150 min | 48 min |
| Mean latency | 13.4 s | 56.5 s | 16.0 s |
| This-run spend | **$6.85** | (prior run) | (Ollama Cloud) |

On this suite Fable is the fast cloud option that still clears 90%. Grok remains the quality ceiling. Kimi is a point behind Fable and was cheaper on a different bill.

## Reproducing

Raw JSON and the run log:

- [NemoKnowledgebase / claude-fable-5.1](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/claude-fable-5.1)
- Tag `cal-fable-51-or-strict-v01`

```bash
cd smf-bench
export SMF_SERVE_RECIPE_ID=OpenRouter-cloud
python3 -u run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model anthropic/claude-fable-5.1 \
  --tag cal-fable-51-or-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300 \
  --api-key "$OPENROUTER_API_KEY"
```

The framework is MIT-licensed at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

## Verification notes

- Totals from `results/stage1_cal-fable-51-or-strict-v01_20260902_184808.json` (`summary` 142/157, `pass_rate` 90.4, `error` 0, `wall_time_seconds` 2100.8).
- Per-category from `by_category`. Difficulty parsed from `v3.<cat>.<tier>.<n>` test IDs.
- Model id, 1M context, $10/$50 pricing: OpenRouter `/v1/models` on 2026-09-02 for `anthropic/claude-fable-5.1`.
- Release date: Anthropic announcement and OpenRouter model page (2026-09-01).
- Cloud comparators: prior Official A showdowns (Grok 4.6 2026-08-12, Kimi K3 / GLM-5.2 2026-08-11/12). Local DSV4: 2026-09-02 post, 117/157.
- Credits: OpenRouter `/v1/credits` before 539.004 / after 545.859.
- Smoke tests in this session: content `'4'` and a one-line `add` function, both `reasoning_tokens=0`.
- Same-day Fable posts on Clearinghouse are one-shots, not Official A.
