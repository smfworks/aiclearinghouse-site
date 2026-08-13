---
slug: "2026-08-12-grok-46-takes-the-crown"
title: "Grok 4.6 Takes the Crown: Four-Way Cloud Model Showdown"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-08-12"
excerpt: "Grok 4.6 ships with improved SFT and RL on the same 1.5T V9 foundation as 4.5. We ran it through our 157-test Official A benchmark against Grok 4.5, Kimi K3, and GLM-5.2. It won — and it fixed the one test 4.5 missed."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["smf-bench", "cloud-models", "openrouter", "grok", "kimi", "glm", "showdown"]
readTime: 16
image: "/images/blog/2026-08-12-grok-46-takes-the-crown.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-12-grok-46-takes-the-crown"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Grok 4.6 landed on August 7, 2026 — less than a month after Grok 4.5. The headline from xAI: same 1.5-trillion-parameter V9 foundation, substantially improved supervised fine-tuning and reinforcement learning. No architecture change. No parameter scale-up. Just better training on the same base.

That's a specific and testable claim. Does better post-training actually move the needle on a real benchmark suite, or is it marketing?

We ran Grok 4.6 through our internal 157-test Official A suite — the same suite that crowned Grok 4.5 at 96.8% two days ago. And we ran it head-to-head against Grok 4.5, Kimi K3 (89.2%, our #2), and GLM-5.2 (77.1%, our #4). All cloud-hosted. All tested under identical conditions. All at temperature=0 with deterministic scoring.

The result: **Grok 4.6 scores 97.5% (153/157)** — up from Grok 4.5's 96.8% (152/157). One test fixed. Zero regressions. The new #1 on our leaderboard.

## The Stack

| Component | Details |
|---|---|
| **Framework** | smf-bench v0.1.1 (Official A / strict_v01) |
| **Test count** | 157 tests across 7 suites |
| **Suites** | Math (30), Coding (30), Reasoning (30), Instruction (30), Prose (30), Writing (5), Tool Calling (2) |
| **Conditions** | Thinking OFF, Temperature=0, Timeout=300s per request |
| **Difficulty tiers** | Easy (10), Medium (15), Hard (25), Expert (40), Frontier (60) |
| **Grok 4.6** | OpenRouter (`x-ai/grok-4.6`), 500K context |
| **Grok 4.5** | OpenRouter (`x-ai/grok-4.5`), 500K context |
| **Kimi K3** | Ollama Cloud (`kimi-k3:cloud`), reasoning model |
| **GLM-5.2** | Ollama Cloud (`glm-5.2:cloud`), reasoning model |
| **Date** | August 12, 2026 |

All four models were tested with the same framework, the same test definitions, and the same evaluation criteria. Grok 4.6 and 4.5 were treated as non-reasoning models (max_tokens=1024). Kimi K3 and GLM-5.2 were treated as reasoning models (max_tokens=4096) — they produce `reasoning_content` separate from `content` and need the higher token budget to emit an answer after chain-of-thought.

## Overall Results

| Category | Grok 4.6 | Grok 4.5 | Kimi K3 | GLM-5.2 | Tests |
|---|---|---|---|---|---|
| **Coding** | **30/30** ✅ | **30/30** ✅ | 23/30 | 14/30 | 30 |
| **Reasoning** | **30/30** ✅ | **30/30** ✅ | 28/30 | 28/30 | 30 |
| **Instruction** | **30/30** ✅ | **30/30** ✅ | **30/30** ✅ | 28/30 | 30 |
| **Math** | 28/30 | 27/30 | 24/30 | 17/30 | 30 |
| **Prose** | 28/30 | 28/30 | 28/30 | 27/30 | 30 |
| **Writing** | 5/5 ✅ | 5/5 ✅ | 5/5 ✅ | 5/5 ✅ | 5 |
| **Tool Calling** | 2/2 ✅ | 2/2 ✅ | 2/2 ✅ | 2/2 ✅ | 2 |
| **TOTAL** | **153/157 (97.5%)** | 152/157 (96.8%) | 140/157 (89.2%) | 121/157 (77.1%) | 157 |

### Final Ranking

| Rank | Model | Score | SyntaxErrors | Wall Time |
|---|---|---|---|---|
| 🥇 1 | **Grok 4.6** | 153/157 (97.5%) | 0 | 150 min |
| 🥈 2 | Grok 4.5 | 152/157 (96.8%) | 0 | 112 min |
| 🥉 3 | Kimi K3 | 140/157 (89.2%) | 5 | 48 min |
| 4 | GLM-5.2 | 121/157 (77.1%) | 16 | 53 min |

Grok 4.6 takes the #1 spot by exactly one test. Grok 4.5 drops to #2. The gap between Grok and everything else remains enormous — 8.3 points to Kimi K3, 20.4 points to GLM-5.2.

## By Difficulty Tier

| Tier | Grok 4.6 | Grok 4.5 | Kimi K3 | GLM-5.2 | Tests |
|---|---|---|---|---|---|
| Easy | 100% | 100% | 100% | 100% | 10 |
| Medium | 100% | 100% | 100% | 100% | 15 |
| Hard | 96.0% | 92.0% | 88.0% | 76.0% | 25 |
| Expert | 92.5% | 92.5% | 87.5% | 75.0% | 40 |
| Frontier | 100% | 100% | 85.0% | 66.7% | 60 |

The single improvement from 4.5 to 4.6 is at the **hard** tier — 24/25 vs 23/25. Expert and frontier remain identical. Both Grok versions are the only models with 100% on the frontier tier — the hardest 60 tests in our suite.

## The Delta: What Changed From 4.5 to 4.6

This is the most interesting part. When a vendor says "improved SFT and RL on the same foundation," the question is whether that produces a measurable, clean improvement or just shuffles failures around.

### Tests Fixed by Grok 4.6

| Test ID | Category | 4.5 Failure | 4.6 Result |
|---|---|---|---|
| v3.math.hard.05 | Math | Regex `\b8.750\b` did not match | ✅ Pass |

One test fixed. `v3.math.hard.05` is a numerical precision problem that Grok 4.5 got wrong — the expected answer was 8.750 and 4.5 produced something that didn't match. Grok 4.6 gets it right.

### Tests Regressed by Grok 4.6

**None.** Zero regressions. Every test that Grok 4.5 passed, Grok 4.6 also passes.

This is the signal. Post-training improvements that produce a net +1 with zero regressions are exactly what you want to see. The model didn't trade one capability for another — it strictly improved.

### Tests Both Versions Fail

| Test ID | Category | Failure Detail | Notes |
|---|---|---|---|
| v3.math.expert.06 | Math | Regex `\b-0.01384\b` did not match | High-precision numerical computation |
| v3.math.expert.07 | Math | Regex `\b-9.417\b` did not match | High-precision numerical computation |
| v3.prose.hard.04 | Prose | Regex `[eE]` did not match | Missing character 'e' in output |
| v3.prose.expert.03 | Prose | Regex `e` did not match | Missing character 'e' in output |

These 4 tests appear to be a **hard ceiling for the V9 foundation**. Both Grok versions fail them identically. Post-training can't fix them because the issue isn't in the training pipeline — it's in the model architecture itself. The two math failures are high-precision decimal computation problems where the model produces a numerically close but not exactly matching answer. The two prose failures are character-level constraints where the model's output doesn't include a specific required character.

If Grok 4.7 (2.1T parameters, different architecture, expected in ~2 weeks per Musk's timeline) can crack these 4, that would be a foundation-level improvement. Grok 4.6 cannot — and that's consistent with it being the same V9 base with better training.

## The Coding Gap Is Still the Story

Grok 4.6 and 4.5 are the **only** models in this lineup with perfect 30/30 coding scores and zero SyntaxErrors. The gap between Grok and the rest of the field is driven almost entirely by coding:

| Coding Tier | Grok 4.6 | Grok 4.5 | Kimi K3 | GLM-5.2 |
|---|---|---|---|---|
| Easy (2) | 100% | 100% | 100% | 100% |
| Medium (3) | 100% | 100% | 100% | 100% |
| Hard (5) | 100% | 100% | 60% (3/5) | 0% (0/5) |
| Expert (10) | 100% | 100% | 80% (8/10) | 50% (5/10) |
| Frontier (10) | 100% | 100% | 60% (6/10) | 10% (1/10) |

**Kimi K3** loses 7 coding tests. Five of those are SyntaxErrors from Unicode mathematical characters — the model emits `≡` (U+2261) instead of `==`, `∩` (U+2229) instead of `&`, and `—` (U+2014) em-dash instead of `--`. This is a known issue with large MoE models that reason about mathematical operations using proper notation and then fail to convert to ASCII when emitting code. The other two failures are an assertion error and an unterminated string.

**GLM-5.2** loses 16 coding tests — all SyntaxErrors. Unterminated string literals, invalid decimal literals, and Unicode character issues. This is a fundamental coding syntax floor: the model cannot reliably produce syntactically valid Python in single-shot generation at the hard/frontier difficulty tiers. The pattern is consistent: GLM-5.2 generates code that is logically plausible but syntactically broken at the character level.

For production single-shot code generation, only Grok is reliable. Kimi K3 and GLM-5.2 both need iterative feedback (agentic loops with self-correction) to produce working code — which is a different use case than what this benchmark measures.

## Latency: The One Regression

Grok 4.6 is notably slower than 4.5:

| Model | Mean Latency | Median Latency | Wall Time |
|---|---|---|---|
| Grok 4.6 | 56.5s | 41.6s | 150 min |
| Grok 4.5 | 42.6s | 25.4s | 112 min |
| Kimi K3 | 16.0s | 12.8s | 48 min |
| GLM-5.2 | 16.2s | 14.3s | 53 min |

That's a **33% increase in mean latency** and a **34% increase in wall time** — despite using the same 1.5T V9 foundation. This is the one area where Grok 4.6 regresses from 4.5.

Possible explanations:

1. **OpenRouter routing** — Grok 4.6 launched 5 days ago. The provider may have less provisioned capacity for the newer model, routing requests to slower infrastructure.
2. **Longer responses** — The improved SFT/RL may produce more thorough responses (more reasoning before the answer, even with thinking mode off). We didn't measure response token counts in this run, but the higher latency is consistent with longer outputs.
3. **Launch-day load** — xAI infrastructure may still be scaling to meet demand for the new model.

The latency cost is real but does not affect pass/fail outcomes. For production routing, this is a throughput consideration. If you need maximum tokens-per-second and 96.8% quality is acceptable, Grok 4.5 is still the faster choice. If you need the highest quality and can afford the latency, Grok 4.6 is the better model.

## Architecture Context

| Attribute | Grok 4.6 | Grok 4.5 | Kimi K3 | GLM-5.2 |
|---|---|---|---|---|
| Parameters | 1.5T (V9 foundation) | 1.5T (V9 foundation) | ~2.8T (MXFP4) | Unknown |
| Architecture | MoE | MoE | MoE | MoE |
| Training delta | Improved SFT + RL | Baseline V9 | Independent | Independent |
| Context window | 500K | 500K | — | — |
| Released | Aug 7, 2026 | Jul 16, 2026 | — | — |
| Provider | SpaceXAI | SpaceXAI | Moonshot | Zhipu AI |

Grok 4.6 demonstrates that post-training improvements on the same foundation can produce measurable benchmark gains. The 1.5T V9 foundation was already the strongest model base we've measured — better training pushed it from 96.8% to 97.5%. The 4 remaining failures appear to be a ceiling of the V9 architecture itself.

Kimi K3 has the largest parameter count (~2.8T) but scores 8.3 points lower than Grok 4.6. Parameter count is not destiny. The V9 foundation with better post-training outperforms a 1.87× larger model with a different training pipeline.

## What This Means for Model Selection

### When to use Grok 4.6

- **Highest quality required** — 97.5% is the best we've measured. Zero SyntaxErrors, perfect coding/reasoning/instruction/tool-calling/writing.
- **Frontier-difficulty work** — 60/60 on the hardest tier. If your tasks are at the edge of model capability, Grok 4.6 is the safest choice.
- **Single-shot code generation** — 30/30 coding with zero syntax errors. The only model in this lineup that reliably produces correct Python in one pass.

### When to use Grok 4.5

- **Latency-sensitive** — 33% faster than 4.6 with only 1 test lower. For high-throughput routing where 96.8% is acceptable, 4.5 is the better cost/performance choice.
- **Established baseline** — if you're already running 4.5 in production, there's no urgent reason to switch. The quality delta is 1 test.

### When to use Kimi K3

- **Speed + quality balance** — 48 min wall time (3.1× faster than Grok 4.6) with 89.2% quality. For latency-sensitive workloads where 89% is acceptable.
- **Not for single-shot coding** — 5 SyntaxErrors from Unicode math characters. Use agentic loops with self-correction for code generation.

### When to avoid GLM-5.2 for code

- **16 SyntaxErrors** — the model cannot reliably produce syntactically valid Python at hard/frontier difficulty. GLM-5.2 is fine for reasoning, instruction, and writing (all 90%+), but single-shot code generation is not its capability.

## Reproducing This Benchmark

Benchmark scripts, raw JSON results, and the full comparison report are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/benchmarks/grok-4.6/).

To run the same 157-test Official A suite against any OpenAI-compatible endpoint:

```bash
cd smf-bench

python3 run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model "x-ai/grok-4.6" \
  --tag showdown-grok46-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --timeout 300 \
  --api-key "$OPENROUTER_API_KEY"
```

The smf-bench framework is MIT-licensed and available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench). The 157-test Official A suite covers 7 categories × 5 difficulty tiers. All tests run at temperature=0 for deterministic, reproducible results.

## Verification Notes

- **Grok 4.6 availability**: Confirmed on OpenRouter as `x-ai/grok-4.6` (500K context, retrieved via `/v1/models` API on 2026-08-12).
- **Grok 4.6 release date**: August 7, 2026, per xAI/SpaceXAI announcement. Confirmed via web search.
- **V9 foundation**: Same 1.5T foundation as Grok 4.5, per xAI's published model documentation and multiple secondary sources.
- **Grok 4.7 timeline**: Musk stated "Grok 4.6 in 2 weeks and Grok 4.7 in 4 weeks" on July 24, 2026. Grok 4.7 is expected ~August 21, 2026, with a 2.1T parameter architecture.
- **Kimi K3 parameter count**: ~2.8T, per Moonshot AI's published specifications.
- **All benchmark data**: From our own smf-bench runs on August 10-12, 2026. No external benchmark numbers are presented as our own.
- **Determinism**: smf-bench runs at temperature=0. Re-runs produce identical results (confirmed across multiple prior runs with Grok 4.5, Qwen3.6-35B, Nemotron-3-Nano-30B, and Gemma-4-26B).