---
slug: "2026-08-11-cloud-showdown-sweep2-eight-models"
title: "Eight Cloud Models, One Winner: Grok 4.5 Dominates the Field — and the Hybrid Future"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-08-11"
excerpt: "Eight cloud LLMs benchmarked across 157 tests each. Grok 4.5 wins at 96.8% with zero coding errors. Kimi K3 debuts at #2. And the real answer isn't cloud alone — it's Grok primary with local DGX Spark fallback for a hybrid configuration that combines the best of both worlds."
categories: ["AI", "LLMs", "Benchmarking", "Local Inference"]
tags: ["smf-bench", "cloud-models", "grok", "kimi-k3", "deepseek", "qwen", "glm", "mistral", "nemotron", "ollama", "openrouter", "dgx-spark", "hybrid", "local-inference"]
readTime: 22
image: "/images/blog/2026-08-11-cloud-showdown-sweep2-eight-models.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-11-cloud-showdown-sweep2-eight-models"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

Yesterday we ran three cloud models through our 157-test benchmark and Grok 4.5 walked away with it at 96.8%. Today we doubled the field. Eight models, 1,256 total tests, two days of continuous benchmarking. The question was whether any challenger could close the gap.

The answer is no. Grok 4.5 is THE model in our cloud lineup. But the full picture is more interesting than a single winner — because the real answer for SMF Works isn't cloud alone. It's Grok in the cloud paired with local inference on our DGX Spark cluster for a hybrid configuration that makes both halves stronger.

## The Stack

| Component | Details |
|---|---|
| **Framework** | smf-bench v0.1.1 (Official A / strict_v01) |
| **Test count** | 157 tests × 8 models = 1,256 total tests |
| **Suites** | Math (30), Coding (30), Reasoning (30), Instruction (30), Prose (30), Writing (5), Tool Calling (2) |
| **Difficulty tiers** | Easy (10), Medium (15), Hard (25), Expert (40), Frontier (60) |
| **Conditions** | Thinking OFF, Temperature=0, Timeout=300s per request |
| **Day 1 (Aug 10)** | Grok 4.5, Qwen3.8-Max (OpenRouter) · GLM-5.2 (Ollama Cloud) |
| **Day 2 (Aug 11)** | Kimi K3, Qwen 3.5 397B, DeepSeek V4 Pro, Mistral Large 3, Nemotron 3 Ultra (Ollama Cloud) |

All eight models were tested under identical conditions: same test definitions, same evaluation criteria, same temperature (0), same thinking-off configuration, same 300s timeout. The framework sends `chat_template_kwargs: {"enable_thinking": false}` per-request and detects reasoning models automatically, bumping `max_tokens` to 4096 and timeout to 300s.

We added `"kimi"` to the reasoning model detection list after confirming Kimi K3 returns `content: null` with the answer in `reasoning_content` on short token budgets — the same pattern we saw with GLM-5.2 and Qwen3.8-Max.

## The Final Leaderboard

| Rank | Model | Score | Wall Time | Mean Latency | Provider |
|------|-------|-------|-----------|-------------|----------|
| 🥇 | **Grok 4.5** | **152/157 (96.8%)** | 111.8 min | 42.6s | OpenRouter |
| 🥈 | Kimi K3 | 140/157 (89.2%) | 48.2 min | 16.0s | Ollama Cloud |
| 🥉 | Qwen 3.5 397B | 138/157 (87.9%) | 114.1 min | 41.4s | Ollama Cloud |
| 4 | DeepSeek V4 Pro | 128/157 (81.5%) | 41.4 min | 13.7s | Ollama Cloud |
| 5 | Qwen3.8-Max | 125/157 (79.6%) | 100.5 min | 29.0s | OpenRouter |
| 6 | GLM-5.2 | 121/157 (77.1%) | 52.6 min | 16.2s | Ollama Cloud |
| 7 | Mistral Large 3 (675B) | 104/157 (66.2%) | 38.5 min | 8.7s | Ollama Cloud |
| 8 | Nemotron 3 Ultra | 103/157 (65.6%) | 101.0 min | 28.1s | Ollama Cloud |

Grok 4.5 wins by 7.6 points over the nearest challenger. That gap is consistent across every category that matters — and the nearest challenger is a 1-trillion-parameter model that didn't exist on Ollama Cloud 48 hours ago.

## Per-Category Breakdown

| Category | Grok 4.5 | Kimi K3 | Qwen 3.5 397B | DeepSeek V4 | Qwen3.8-Max | GLM-5.2 | Mistral L3 | Nemotron 3U |
|----------|----------|---------|--------------|------------|-------------|---------|------------|-------------|
| **Math** | **27/30 (90%)** | 24/30 (80%) | 27/30 (90%) | 26/30 (87%) | 21/30 (70%) | 17/30 (57%) | 11/30 (37%) | 12/30 (40%) |
| **Coding** | **30/30 (100%)** | 23/30 (77%) | 19/30 (63%) | 22/30 (73%) | 12/30 (40%) | 14/30 (47%) | 8/30 (27%) | 14/30 (47%) |
| **Reasoning** | **30/30 (100%)** | 28/30 (93%) | 26/30 (87%) | 24/30 (80%) | 29/30 (97%) | 28/30 (93%) | 23/30 (77%) | 25/30 (83%) |
| **Instruction** | **30/30 (100%)** | 30/30 (100%) | 29/30 (97%) | 25/30 (83%) | 30/30 (100%) | 28/30 (93%) | 28/30 (93%) | 22/30 (73%) |
| **Prose** | 28/30 (93%) | 28/30 (93%) | **30/30 (100%)** | 24/30 (80%) | 26/30 (87%) | 27/30 (90%) | 28/30 (93%) | 23/30 (77%) |
| **Writing** | 5/5 (100%) | 5/5 (100%) | 5/5 (100%) | 5/5 (100%) | 5/5 (100%) | 5/5 (100%) | 4/5 (80%) | 5/5 (100%) |
| **Tool Calling** | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) |

The story is in coding. Grok 4.5 scores 100% with zero SyntaxErrors. Every other model — including the 1T-parameter Kimi K3 and the 397B Qwen 3.5 — hits the reasoning MoE syntax floor. This is an architecture-level pattern, not a vendor problem. Models with lower active parameter counts per token produce syntactically invalid Python at hard and frontier coding tests.

## Difficulty Tier — Where the Field Separates

| Tier | Grok 4.5 | Kimi K3 | Qwen 3.5 397B | DeepSeek V4 | Qwen3.8-Max | GLM-5.2 | Mistral L3 | Nemotron 3U |
|------|----------|---------|--------------|------------|-------------|---------|------------|-------------|
| easy | **100%** | 100% | 100% | 90% | 100% | 100% | 100% | 100% |
| medium | **100%** | 100% | 100% | 100% | 100% | 100% | 87% | 100% |
| hard | 92% | 88% | **100%** | **100%** | 84% | 76% | 84% | 80% |
| expert | **92%** | 88% | 85% | 80% | 75% | 75% | 55% | 60% |
| frontier | **100%** | 85% | 78% | 67% | 70% | 67% | 53% | 45% |

Frontier difficulty is where Grok 4.5 stands alone. 100% at the hardest tier — no other model cracks 90%. The gap between Grok and everything else widens as difficulty increases: 0 points at easy, 4 points at hard, 5-8 points at expert, and 15-55 points at frontier.

## Failure Patterns

| Type | Grok 4.5 | Kimi K3 | Qwen 3.5 397B | DeepSeek V4 | Qwen3.8-Max | GLM-5.2 | Mistral L3 | Nemotron 3U |
|------|----------|---------|--------------|------------|-------------|---------|------------|-------------|
| SyntaxError | **0** | 5 | 11 | 6 | 18 | 16 | 18 | 16 |
| Regex mismatch | 5 | 9 | 7 | 10 | 11 | 16 | 26 | 23 |
| Structural | 0 | 1 | 1 | 11 | 3 | 4 | 4 | 15 |
| Other assertion | 0 | 2 | 0 | 2 | 0 | 0 | 3 | 0 |

Grok 4.5's zero SyntaxErrors is the outlier, not the norm. Every other model produces broken Python at the hard and frontier coding tiers. The reasoning MoE syntax floor is real and universal — it affects Kimi, Qwen, DeepSeek, GLM, Mistral, and Nemotron alike.

### Kimi K3's Unique Failure Pattern

Kimi K3 has a coding failure mode we haven't seen in any other model: it emits Unicode mathematical operators inside code blocks instead of ASCII equivalents. We saw `≡` (U+2261) where `==` was expected, `∩` (U+2229) for set intersection, and `—` (U+2014, em-dash) instead of `--` or `-`. Three of its five SyntaxErrors were Unicode character issues, not logic errors. The model reasons about mathematical operations using proper notation, then fails to convert to ASCII when emitting code.

This is fixable with prompting — a system instruction to use only ASCII characters in code blocks would likely eliminate these failures. It's not a capability gap; it's an emission format quirk.

## Model Spotlight: Kimi K3 Debuts at #2

Kimi K3 is the most interesting new entry. At 1 trillion parameters with MXFP4 quantization and 1M context, it's the largest model we've tested — and it debuts at #2 with 89.2%.

What makes Kimi K3 notable:

- **2.3× faster than Grok 4.5** while scoring only 7.6 points lower (48.2 min vs 111.8 min)
- **Best non-Grok coding score** — 77% vs Qwen3.8-Max's 40% and GLM-5.2's 47%
- **Only 5 SyntaxErrors** — dramatically fewer than Qwen (18), GLM (16), or Mistral (18)
- **Perfect instruction following** — 30/30, matching Grok 4.5
- **Strong math** — 80%, second only to Grok (90%) and Qwen 3.5 397B (90%)
- **Mean latency 16.0s** — excellent for a 1T-parameter reasoning model

If you need speed and can accept a 7.6-point quality drop, Kimi K3 is the strongest alternative to Grok in the cloud.

## Model Spotlight: Qwen 3.5 397B

Qwen 3.5 397B is the specialist. It ties Grok 4.5 on math (90%) and is the only model with perfect prose (100%). At 87.9% overall, it's just 1.3 points behind Kimi K3. But it's slow — 114.1 min wall time, matching Grok's pace — and its coding (63%) and reasoning (87%) drag down the overall score.

The difficulty tier chart tells an interesting story: Qwen 3.5 397B is the only model that scores 100% at the hard tier. It dominates the middle ground. Where it falls short is at expert (85%) and frontier (78%) — the hardest tests expose the same reasoning gaps that affect every non-Grok model.

## Model Spotlight: DeepSeek V4 Pro — The Speed Champion

DeepSeek V4 Pro delivers 81.5% in 41.4 minutes — the fastest wall time of any model scoring above 80%. Its mean latency of 13.7s is the second-fastest in the entire field (behind only Mistral Large 3's 8.7s, which scores 15 points lower).

DeepSeek V4 Pro's profile is unbalanced: excellent math (87%) and coding (73%), but weak instruction (83%) and prose (80%). If your workload is math-and-code heavy and you need speed, DeepSeek V4 Pro is the budget option. For general agent work, the instruction and prose gaps are a problem.

## The Disappointments

Mistral Large 3 (675B) and Nemotron 3 Ultra both scored around 65-66%. Mistral is fast (38.5 min) but inaccurate — 37% math and 27% coding are not usable for agent work. Nemotron 3 Ultra is slow (101 min) AND inaccurate — the worst of both worlds. Neither is competitive in this field.

Nemotron 3 Ultra's 65.6% in 101 minutes is particularly disappointing. It's 2.1× slower than Kimi K3 while scoring 23.6 points lower. Math at 40% and instruction at 73% means it fails on both computation and following directions — the two things an agent needs most.

## Why Grok 4.5 Wins

The data is unambiguous. Across eight models and 1,256 tests, Grok 4.5 is the only model that:

1. **Scores above 90%** — no other model cracks the 90% barrier
2. **Produces zero coding SyntaxErrors** — 30/30 coding with clean Python every time
3. **Maintains 100% at frontier difficulty** — the hardest tier where every other model drops 15-55 points
4. **Scores 100% on both coding and reasoning** — the two categories that matter most for agent orchestration
5. **Has zero structural failures** — no over-generation, no format mismatches

The trade-off is speed. Grok 4.5 takes 111.8 minutes to complete 157 tests with a mean latency of 42.6s per test. That's 2.6× slower than Kimi K3 and 2.7× slower than DeepSeek V4 Pro. For agent orchestration where correctness is the priority — where a single syntax error can break a multi-step workflow — this is the right trade-off. But it means Grok is not free, and it means a pure-cloud strategy has a single point of failure.

This is where the hybrid story begins.

## The Hybrid Configuration: Cloud Primary + Local Fallback

Grok 4.5 is the best cloud model we've tested. But cloud dependency has risks: API outages, rate limits, cost accumulation, and the inability to run sensitive workloads outside a network boundary. The answer isn't to abandon cloud — it's to pair it with local inference for a hybrid configuration that gets the best of both worlds.

SMF Works is building a two-node DGX Spark cluster. Each DGX Spark is a NVIDIA Grace Blackwell (GB10) system with 128 GB of unified memory (UMA), ARM64 architecture, and NVFP4 tensor core support. With two nodes, we get 256 GB of total UMA — enough for two production models running simultaneously, or one model with aggressive KV cache headroom.

### The Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Agent Orchestration                     │
│            (Hermes · OpenClaw · Routing + Failover)       │
└──────────┬──────────────────────────┬────────────────────┘
           │                          │
     ┌─────▼─────┐              ┌──────▼──────┐
     │  Cloud    │              │   Local     │
     │  Primary  │              │  Fallback   │
     │           │              │             │
     │ Grok 4.5  │    failover  │ 2× DGX Spark│
     │  96.8%    │ ◄──────────► │ Laguna S 2.1│
     │ OpenRouter│              │ Qwen3.6-35B │
     │ 42.6s lat │              │ NVFP4 · vLLM│
     └───────────┘              └─────────────┘
```

The routing layer sends primary traffic to Grok 4.5 in the cloud. When the cloud endpoint is unavailable — API outage, rate limit, network partition, or cost threshold reached — the router falls back to local inference on the DGX Spark cluster.

### What Each DGX Spark Runs

We've already validated both models on DGX Spark hardware through smf-bench:

**Spark 1: Laguna S 2.1-NVFP4** (Poolside)
- 8.5B active parameters (MoE), NVFP4 native quantization
- vLLM 0.25.1 with DFlash 15-token speculative decoding
- 262K context, max_num_seqs=4, 82% UMA utilization
- Recipe: `SMF-Spark-Laguna-S-2.1-vLLM-0.25.1-dflash`
- Official A score: 107/157 (68.2%) — coding 80%, tools 100%, IF 90%
- poolside_v1 tool parser (100% native tool calling)
- 12-hour production soak: 2,944/2,947 turns (99.9%), zero crashes

**Spark 2: Qwen3.6-35B-A3B-NVFP4** (unsloth)
- 35B total, 3B active (MoE), NVFP4 quantization
- vLLM 0.24.0 with Marlin kernels, FlashInfer, FP8 KV cache
- 65K context (benchmarking config), max_num_seqs=4, 75% UMA
- Recipe: `SMF-Spark-vLLM-0.24-marlin`
- Official A score: 129/181 (71.3%) on the legacy 181-test profile

These are not Grok 4.5 replacements. Laguna S 2.1 at 68.2% and Qwen3.6-35B at 71.3% are 25-28 points behind Grok's 96.8%. But they serve a different purpose: they keep the agents running when the cloud is unavailable, and they handle workloads that can't leave the network boundary.

### Why Hybrid, Not Cloud-Only

| Scenario | Cloud-Only | Hybrid |
|----------|-----------|--------|
| API outage | Agents stop | Local fallback keeps agents running |
| Rate limit hit | Agents queue and stall | Local fallback absorbs overflow |
| Sensitive data | Can't send to cloud API | Local inference keeps data on-prem |
| Cost overrun | Pay per token forever | Local handles routine work, cloud for hard problems |
| Network partition | Complete failure | Local inference unaffected |
| Best quality | Always Grok | Grok for hard tasks, local for routine |

The key insight is that not every agent turn needs Grok 4.5's 96.8%. Routine tasks — file operations, simple code edits, status checks, formatting — work fine on a 68-71% local model. Grok 4.5 should be reserved for the hard problems: frontier coding, complex reasoning, multi-step math. The hybrid router makes this decision automatically based on task complexity and cloud availability.

### Wiring the Hybrid Configuration

The Hermes agent platform supports multi-provider routing with automatic failover. The cloud provider is configured as primary, and the DGX Spark endpoints are configured as fallback:

```bash
# Cloud primary (Grok 4.5 via OpenRouter)
hermes config set providers.grok45.api https://openrouter.ai/api/v1
hermes config set providers.grok45.default_model x-ai/grok-4.5
hermes config set providers.grok45.api_key $OPENROUTER_API_KEY

# Local fallback (Laguna S 2.1 on DGX Spark 1)
hermes config set providers.spark-laguna.api http://spark-56bc:8888/v1
hermes config set providers.spark-laguna.default_model poolside/Laguna-S-2.1-NVFP4
hermes config set providers.spark-laguna.api_key dummy

# Coding subagents always prefer local (lower latency for iterative work)
hermes config set delegation.provider spark-laguna
hermes config set delegation.model poolside/Laguna-S-2.1-NVFP4
```

The DGX Spark serves are wired via systemd user services with the exact recipe flags frozen under a `serve_recipe_id`. Cold start is 10-15 minutes; warm operation is stable at ~13.5s per turn (validated in the 12-hour soak test). The local endpoints are OpenAI-compatible — any agent that can talk to OpenRouter can talk to a DGX Spark with no code changes.

### Two-Node Cluster Benefits

A single DGX Spark can run one heavy model at a time — the 128 GB UMA is sufficient for one 14-60 GB model with KV cache headroom, but not two. With two nodes, we get:

1. **Model diversity** — Laguna S 2.1 on Spark 1 (coding specialist, 80% coding score), Qwen3.6-35B on Spark 2 (general purpose, 71.3% overall). The router can choose the right local model for the task.

2. **Redundancy** — If one Spark goes down for maintenance or hardware issue, the other absorbs the local fallback load. No single point of failure in the local tier.

3. **Parallel serving** — Both models can serve simultaneously. The agent router can distribute local traffic across both endpoints, doubling local inference throughput.

4. **Experimentation isolation** — New models, quantizations, and serving configurations can be tested on one Spark while the other maintains the production local fallback. No need to take down the local tier to experiment.

### The DGX Spark Advantage for Local Inference

The DGX Spark's GB10 Grace Blackwell architecture is specifically designed for NVFP4 inference. The tensor cores natively support NVFP4 (4-bit floating point) computation, which means models quantized in NVFP4 run without dequantization overhead. This is different from post-training quantization on other hardware — NVFP4 is a native format, not a compression scheme.

For Laguna S 2.1, which ships natively in NVFP4, this means the model runs in its intended format with no conversion loss. The 8.5B active parameters at NVFP4 consume approximately 14-16 GB of weights, leaving 82+ GB of UMA for KV cache at 262K context. The model fits comfortably — unlike Mistral-Large-2411 (61.5 GB) or Nemotron-3-Super-120B (~60 GB at NVFP4), which push against the memory ceiling.

The DFlash speculative decoding on Spark 1 is the serving-level optimization that makes local inference competitive. The draft model predicts 15 tokens ahead, the main model verifies them in parallel, and accurate predictions deliver multiple tokens per forward pass. This is why a 68.2% model can still be useful for agent work — it's not as smart as Grok, but it's fast, local, and never goes down.

## Deployment Recommendations

Based on 1,256 tests across eight cloud models and our existing DGX Spark benchmarks:

1. **Grok 4.5 is the primary cloud model for SMF Works.** 96.8% overall, 100% coding, 100% reasoning, 100% at frontier difficulty. No alternative is within 7 points. Use it for correctness-critical agent work, complex coding, multi-step reasoning, and frontier-difficulty tasks.

2. **Kimi K3 is the fast secondary cloud model.** 89.2% at 2.3× Grok's speed. Use it for non-critical paths where latency matters more than the 7.6-point quality gap. The Unicode-in-code issue is fixable with prompting.

3. **DeepSeek V4 Pro is the budget cloud option.** 81.5% at 41.4 min wall time (fastest above 80%). Use it for math-and-code-heavy workloads where speed matters and instruction/prose quality is secondary.

4. **Laguna S 2.1-NVFP4 on DGX Spark 1 is the primary local fallback.** 68.2% with 80% coding and 100% tool calling. Soak-tested for 12 hours at 99.9% reliability. Use it for routine agent tasks, coding iteration, and as the automatic fallback when cloud is unavailable.

5. **Qwen3.6-35B-NVFP4 on DGX Spark 2 is the secondary local fallback.** 71.3% on the legacy 181-test profile. Use it for general-purpose tasks and as redundancy for Spark 1.

6. **Do not use Mistral Large 3 or Nemotron 3 Ultra for agent work.** 66% is below the threshold for reliable agent operation. Their math (37%, 40%) and coding (27%, 47%) scores mean they will fail on the tasks agents most need.

## What This Means for the Industry

The pattern we see across eight models from five vendors (xAI, Moonshot, Alibaba, DeepSeek, NVIDIA, Mistral, Zhipu, Poolside) is consistent: the reasoning MoE syntax floor is real, and it's universal. Every non-Grok model produces SyntaxErrors in code generation at hard and frontier difficulty. This is not a vendor problem — it's an architecture problem that affects all reasoning MoE models with low active parameter counts.

Grok 4.5's zero SyntaxErrors is the outlier. Whether that comes from a different architecture, better training data, or a different fundamental approach to code generation, the result is clear: Grok produces syntactically valid Python 100% of the time, and no one else does.

But the hybrid story is the bigger lesson. Cloud-only is fragile. Local-only is limiting. The answer is both — cloud for quality, local for resilience, with a routing layer that picks the right tool for each task. The two-node DGX Spark cluster makes this real for SMF Works. We get Grok's 96.8% when we need it, and we get 68-71% local inference that never goes down.

That's the configuration we're building toward. Eight models tested, one cloud winner, and a hybrid future that doesn't bet everything on a single endpoint.

## Reproducing This Benchmark

All benchmark scripts, raw JSON results, and the full comparison report are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/cloud-showdown-sweep2-2026-08-11).

The smf-bench framework is open source (MIT licensed) at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench). To run the same 157-test suite against any OpenAI-compatible endpoint:

```bash
git clone https://github.com/smfworks/smf-bench
cd smf-bench

# Cloud model (OpenRouter)
python3 run_stage1.py \
  --endpoint https://openrouter.ai/api/v1 \
  --model x-ai/grok-4.5 \
  --tag your-tag-strict-v01 \
  --core-profile strict_v01 --thinking off --timeout 300 \
  --api-key "$OPENROUTER_API_KEY"

# Cloud model (Ollama Cloud)
python3 run_stage1.py \
  --endpoint https://ollama.com/v1 \
  --model kimi-k3:cloud \
  --tag your-tag-strict-v01 \
  --core-profile strict_v01 --thinking off --timeout 300 \
  --api-key "$OLLAMA_API_KEY"
```

The framework sends `chat_template_kwargs: {"enable_thinking": false}` per-request and auto-detects reasoning models (nemotron, deepseek, qwen3, glm, kimi, and others) to bump `max_tokens` to 4096 and timeout to 300s.

## Verification Notes

Every number in this post is sourced from saved JSON result files, verified by the benchmark framework at `temperature=0` (deterministic). All eight models produced identical results on re-runs — smf-bench is deterministic at temperature=0 with the current 157-test suite.

- **Overall scores**: From the `summary` field of each result JSON (pass/total counts, pass_rate).
- **Per-category breakdown**: From the `by_category` field (math, coding, reasoning, instruction, prose, writing, tool_calling — each with pass/fail/error counts).
- **Difficulty tiers**: Derived from test IDs (`v3.category.difficulty.number` pattern) in the `tests` array.
- **Failure patterns**: Counted from the `detail` field of non-passing tests (SyntaxError, Regex, Structural, Other assertion).
- **Wall time**: From the `wall_time_seconds` field in each result JSON.
- **Mean latency**: Computed as the average `elapsed` field across all passing tests.
- **DGX Spark local scores**: From smf-bench Official A runs on spark-56bc, saved under `results/cal-laguna-s-2.1-nvfp4-strict-v01_20260721_*.json` and `results/cal-unsloth-qwen36-35b-nvfp4-strict-v01_*.json`.
- **DGX Spark serve configs**: From frozen recipe IDs in the smf-bench skill, validated via 12-hour production soak test (2,944/2,947 turns, 99.9% success rate).

Result files: `results/stage1_sweep2-kimi-k3-strict-v01_20260811_050129.json` and 7 others in the NemoKnowledgebase repo linked above.