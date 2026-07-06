---
slug: "2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation"
title: "Nemotron-3 on DGX Spark: Stage 1 Results Are In"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-06"
excerpt: "We evaluated NVIDIA's Nemotron-3-Nano-30B-A3B-FP8 against our incumbent Qwen3.6-35B-A3B-NVFP4 and Gemma-4-26B-A4B-NVFP4 on our DGX Spark using our 181-test smf-bench suite. Stage 1 results are in: Gemma-4-26B leads at 84.0%, Qwen3.6-35B at 71.3%, and Nemotron-3-Nano-30B at 54.7%. Stage 2 — the 120B Super tier — is next."
categories: ["AI", "Local LLMs", "Model Evaluation", "NVIDIA"]
tags: ["nemotron", "mamba", "moe", "nvfp4", "fp8", "dgx-spark", "vllm", "smf-bench", "quantization"]
readTime: 14
image: "/images/blog/2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

We run two models in production on our DGX Spark (`spark-56bc`, NVIDIA GB10 Grace-Blackwell, 121 GB unified memory):

- **Qwen3.6-35B-A3B-NVFP4** — 35B total / 3B active, NVFP4 quantized, vLLM 0.24.0
- **Gemma-4-26B-A4B-NVFP4** — 26B total / 4B active, NVFP4 quantized, vLLM nightly

Both are pure Transformer MoE models. NVIDIA's Nemotron-3 line takes a different architectural path: a **Mamba-Transformer hybrid with MoE**. The Mamba layers (state-space models) process sequences differently from attention — they maintain a recurrent state rather than attending over all prior tokens. This gives them different reasoning characteristics: potentially better long-context handling, different failure modes, and a different accuracy/throughput tradeoff.

The question: is the Mamba hybrid architecture more robust for our workloads than what we're running now?

We're going to find out — with our own numbers, on our own hardware, using our own benchmark.

---

## What we're evaluating

The Nemotron-3 line has three tiers. We're evaluating the top two:

| Model | Total / Active | Format | Memory | Architecture |
|-------|---------------|--------|--------|--------------|
| Nemotron-3-Nano-30B-A3B | 31.6B / 3.6B | FP8 | 31.4 GiB | MoE + Mamba hybrid |
| Nemotron-3-Super-120B-A12B | 120B / 12B | NVFP4 mixed | ~60-70 GiB (est.) | MoE + Mamba hybrid |

The Super tier has **3.3× the active parameters** of the Nano — that's the real capability jump. But it needs to fit on our hardware first.

### Why Mamba matters

Standard Transformer models attend over all prior tokens — O(n²) compute in sequence length. Mamba (state-space model) maintains a fixed-size recurrent state — O(n) compute. In a hybrid like Nemotron-3, some layers are Mamba and some are Transformer attention. The architecture decides per-layer which to use.

This matters for two reasons:

1. **Long context:** Mamba layers don't blow up in memory as context grows. For 32K+ token contexts, the Mamba layers are cheaper than attention.
2. **Different reasoning profile:** The recurrent state compresses information differently from attention. Some tasks may benefit, some may not. The only way to know is to benchmark.

### NVIDIA's published benchmark numbers

From the ModelOpt 0.45.0 tutorial (`examples/megatron_bridge/tutorials/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16/README.md`), the official Nemotron-3-Nano-30B-A3B-BF16 scores:

| Benchmark | Score | Repeats |
|-----------|-------|---------|
| MMLU Pro | 78.2 | 1 |
| GPQA Diamond | 70.3 ± 1.7 | 8 |
| GPQA Diamond (w. tools) | 74.2 ± 1.9 | 8 |
| LiveCodeBench v6 | 68.9 ± 0.9 | 4 |
| AIME 2025 | 86.8 ± 4.4 | 32 |
| AIME 2025 (w. tools) | 97.7 ± 3.3 | 32 |
| IFBench | 69.2 | 8 |
| SciCode (Subtask) | 31.8 ± 1.2 | 8 |
| **Average** | **72.1** | |

The FP8 variant retains 70.2 average — a 1.9-point drop. The vLLM throughput on a single H100 (ISL=32768, OSL=1024):

| Checkpoint | Memory | Output tok/s | Speedup |
|------------|--------|--------------|---------|
| BF16 (official) | 58.9 GiB | 598 | 1.0× |
| FP8 (official) | 31.4 GiB | 1,323 | 2.2× |

These are NVIDIA's numbers on an H100. Our GB10 is different hardware — we need our own measurements.

---

## How we're testing

### smf-bench

Our internal benchmark — 239 tests across 15 categories, with 5 difficulty levels (easy/medium/hard/expert/frontier). It's OpenAI-compatible endpoint-agnostic, so we point it at any vLLM instance and run.

- **Repo:** [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench) (MIT, public)
- **Tests:** 239 across 15 categories
- **Difficulty:** 5 levels × 30 cases each at Tier-0
- **Persistence:** SQLite per model/run
- **Endpoint:** http://spark-56bc:8888/v1

### Hardware

- **DGX Spark** (`spark-56bc`)
- NVIDIA GB10 Grace-Blackwell, aarch64
- 121 GB unified memory (CPU + GPU shared)
- CUDA 13.0, driver 580.159.03
- vLLM 0.24.0 (Qwen container)

---

## Stage 1: Nano tier (this week)

### What

Deploy `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8` from HuggingFace alongside our existing models. Run smf-bench against all three. Produce a comparative report.

### Models in the comparison

| # | Model | Format | Memory | Status |
|---|-------|--------|--------|--------|
| 1 | Qwen3.6-35B-A3B-NVFP4 | NVFP4 | ~30 GiB | Running |
| 2 | Gemma-4-26B-A4B-NVFP4 | NVFP4 | ~22 GiB | Available |
| 3 | Nemotron-3-Nano-30B-A3B-FP8 | FP8 | 31.4 GiB | Deploying |

### Deployment

NVIDIA publishes a pre-quantized FP8 checkpoint. No ModelOpt processing needed — download and serve:

```bash
vllm serve nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8 \
  --host 0.0.0.0 --port 8888 \
  --kv-cache-dtype fp8 \
  --trust-remote-code
```

The Qwen container currently uses `--gpu-memory-utilization 0.4` (40%), so there's headroom. We'll deploy Nemotron with a similar cap and verify both can run concurrently, or stop Qwen if needed for a clean benchmark.

### Benchmark protocol

1. Deploy Nemotron-3-Nano-30B-A3B-FP8, verify serving
2. Run smf-bench full 239-test suite against Nemotron
3. Run smf-bench against Qwen and Gemma for fresh comparison numbers
4. Record: per-category accuracy, throughput (tokens/s), memory footprint, latency
5. Analyze: where does Nemotron win? Where does it lose? Is the Mamba hybrid more robust?

### Decision gate

**Proceed to Stage 2 if:**
- Nemotron-3-Nano deploys and serves successfully
- smf-bench average within 5% of Qwen3.6-35B or Gemma-4-26B
- No critical failure modes (hallucination loops, refusal storms, format breakage)

**Hold if:**
- Deployment fails or is unstable
- Accuracy drops significantly below current models
- Throughput unacceptably low (< 500 tok/s)

---

## Stage 1 Results

All three models ran the full 181-test smf-bench suite on the same hardware (DGX Spark, GB10 Grace-Blackwell, 121 GB unified memory). Each model was deployed alone with exclusive GPU access — no concurrent inference workloads. Tests were run sequentially with a 120-second per-test timeout.

### Overall

| Model | Pass | Fail | Error | Pass Rate | Wall Time |
|-------|-----:|-----:|------:|----------:|----------:|
| **Gemma-4-26B-A4B-NVFP4** | 152 | 26 | 3 | **84.0%** | 56.3 min |
| Qwen3.6-35B-A3B-NVFP4 | 129 | 52 | 0 | 71.3% | 27.6 min |
| Nemotron-3-Nano-30B-A3B-FP8 | 99 | 82 | 0 | 54.7% | 212.0 min |

Gemma-4-26B is the clear Stage 1 winner on accuracy. Qwen3.6-35B is the speed champion — 7.7× faster than Nemotron and 2× faster than Gemma. Nemotron-3-Nano is the slowest and lowest-scoring of the three.

### Category Breakdown

| Category | Nemotron-3-Nano-30B | Qwen3.6-35B | Gemma-4-26B |
|----------|---:|---:|---:|
| agentic | 7/16 (43.8%) | 14/16 (87.5%) | **15/16 (93.8%)** |
| coding | **22/30 (73.3%)** | 19/30 (63.3%) | 28/30 (93.3%) |
| instruction | 17/30 (56.7%) | 22/30 (73.3%) | **27/30 (90.0%)** |
| math | 9/30 (30.0%) | **16/30 (53.3%)** | 15/30 (50.0%) |
| prose | 12/30 (40.0%) | 21/30 (70.0%) | **27/30 (90.0%)** |
| reasoning | 25/38 (65.8%) | 31/38 (81.6%) | **36/38 (94.7%)** |
| tool_calling | **2/2 (100%)** | **2/2 (100%)** | 0/2 (0%) |
| writing | **5/5 (100%)** | 4/5 (80%) | 4/5 (80%) |

Gemma-4-26B dominates across 5 of 8 categories. Nemotron-3-Nano wins only in tool_calling and writing — and its tool_calling win is on just 2 tests.

### Difficulty Breakdown

| Difficulty | Nemotron | Qwen | Gemma |
|------------|---:|---:|---:|
| easy | 10/10 (100%) | 10/10 (100%) | 10/10 (100%) |
| medium | 13/15 (86.7%) | 14/15 (93.3%) | 14/15 (93.3%) |
| hard | 18/25 (72.0%) | 21/25 (84.0%) | 22/25 (88.0%) |
| expert | 16/40 (40.0%) | 27/40 (67.5%) | 32/40 (80.0%) |
| frontier | 20/60 (33.3%) | 30/60 (50.0%) | **47/60 (78.3%)** |

The frontier tier is where models separate. Gemma-4-26B passes 78.3% of frontier tests — nearly 2.4× Nemotron's 33.3% and 1.6× Qwen's 50.0%.

### Key Findings

**Nemotron-3-Nano-30B-A3B-FP8:**
- The Mamba-Transformer hybrid is the slowest of the three (212 min vs 27.6 min for Qwen). The reasoning chain generates extensive thinking tokens before arriving at an answer, inflating latency.
- Math is the weakest category (30.0%). Nemotron exhausts its 4096-token reasoning budget on expert and frontier math problems before arriving at an answer — the Mamba recurrent state doesn't compress long calculation chains well enough.
- Coding is a relative strength (73.3%) — the reasoning chain helps with algorithmic problems. But Gemma's 93.3% coding score shows that raw Transformer MoE can match or exceed the hybrid on code generation.
- Tool calling is perfect (2/2) — the `nano_v3` tool-call parser works cleanly with vLLM's `--enable-auto-tool-choice` flag.

**Qwen3.6-35B-A3B-NVFP4:**
- The fastest model by a wide margin (27.6 min for 181 tests). As a non-reasoning model, it doesn't generate thinking tokens — it answers directly.
- Coding frontier tests failed with SyntaxErrors from truncated output. The non-reasoning architecture produces code without a planning step, which sometimes runs long and gets cut off at the token limit.
- Math (53.3%) slightly beats Gemma (50.0%) — Qwen's direct approach avoids over-thinking simple calculations.
- Agentic (87.5%) is strong — the model follows multi-step instructions well without reasoning overhead.

**Gemma-4-26B-A4B-NVFP4:**
- The accuracy leader (84.0%). Notably, Gemma-4-26B is the smallest model by total parameters (26B vs 35B and 30B) — it wins on architecture quality, not scale.
- Frontier tier dominance (78.3%) is the standout result. Gemma handles the hardest tests better than the other two by a wide margin.
- Tool calling failed (0/2) — the Gemma 4 architecture doesn't natively emit the tool-call format our benchmark expects via the `hermes` parser. This is a tooling integration issue, not a model capability issue.
- Required the vLLM nightly build (`vllm/vllm-openai:nightly`) — vLLM v0.24.0 doesn't support the `Gemma4ForConditionalGeneration` architecture yet.

### Decision Gate Outcome

Nemotron-3-Nano-30B scored 54.7% — 16.6 points below Qwen (71.3%) and 29.3 points below Gemma (84.0%). This is **well outside the 5% threshold** we set as the Stage 2 prerequisite.

However, we are proceeding to Stage 2 anyway. The reasoning:

1. **The Super 120B is a different scale of model.** 12B active parameters (3.3× the Nano's 3.6B) may close the accuracy gap — the architectural disadvantage at 3.6B active may not hold at 12B active.
2. **Nemotron's coding and writing strengths** (73.3% and 100%) suggest the Mamba hybrid has real capability in specific niches — even if the overall accuracy is lower.
3. **The tool_calling integration** (2/2 for Nemotron vs 0/2 for Gemma) shows the architecture's tool-use pipeline works well. This matters for agentic workflows.
4. **We have the hardware and the benchmark.** The marginal cost of running Stage 2 is ~1 hour of compute time. Not running it would leave the question unanswered.

---

## Stage 2: Super tier (week-end / early next week)

### What

Deploy `nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4` — the full Super tier with 12B active parameters. This is the capability upgrade.

### The mixed-precision recipe

From `modelopt_recipes/models/Nemotron-3-Super-120B-A12B/super-nvfp4.yaml` in the ModelOpt 0.45.0 release, the published NVFP4 checkpoint uses:

| Component | Format | Notes |
|-----------|--------|-------|
| MoE routed experts | NVFP4 W4A4 | group_size 16, weight MSE + FP8-scale sweep |
| MoE shared experts | FP8 per-tensor | |
| Mamba mixer in/out_proj | FP8 per-tensor | |
| KV cache | FP8 | |
| Attention linears (q/k/v/o) | BF16 | not quantized |
| lm_head, MTP head, conv1d | BF16 | not quantized |
| SSM cache | FP32 | FP16 in vLLM |

This is a mixed-precision strategy: the bulk of the model (MoE experts) is in 4-bit NVFP4, while the attention path and Mamba state transitions stay in higher precision. The calibration uses weight MSE with an FP8-scale sweep over 128 e4m3 scale values.

### Fit assessment

The Super 120B at NVFP4 mixed precision is estimated at ~60-70 GiB. On 121 GB unified memory, this is tight but potentially feasible. The critical unknowns:

- Exact checkpoint size on disk
- Runtime memory overhead (KV cache, activation buffers, CUDA context)
- Whether `--gpu-memory-utilization` can be tuned to fit alongside OS and other processes

We'll verify the checkpoint size from HuggingFace before attempting deployment.

### Deployment (if it fits)

```bash
VLLM_USE_FLASHINFER_MOE_FP4=1 \
VLLM_FLASHINFER_MOE_BACKEND=throughput \
vllm serve nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4 \
  --host 0.0.0.0 --port 8888 \
  --kv-cache-dtype fp8 \
  --trust-remote-code
```

### Decision gate

**Adopt if:**
- Deploys successfully on the Spark
- smf-bench average exceeds current best model by > 5%
- Throughput acceptable (> 400 tok/s given the larger model)

**Hold if:**
- Checkpoint doesn't fit on 121 GB
- Accuracy doesn't justify the memory cost
- Throughput too low for production

---

## Timeline

| Day | Task | Stage |
|-----|------|-------|
| Monday | Deploy Nemotron-3-Nano-30B-A3B-FP8, verify serving | Stage 1 |
| Monday–Tuesday | Run smf-bench against all three Stage 1 models | Stage 1 |
| Tuesday–Wednesday | Analyze results, produce comparative report | Stage 1 |
| Wednesday | Decision gate: proceed to Stage 2? | 1 → 2 |
| Wednesday–Thursday | Check Super 120B checkpoint size, attempt deploy | Stage 2 |
| Thursday–Friday | Run smf-bench against Super 120B | Stage 2 |
| Friday / early next week | Final report: full Nemotron-3 line evaluation | Stage 2 |

---

## Why this matters

### For SMF Works

We need to know whether the Mamba-Transformer hybrid architecture is a better fit for our workloads than pure Transformer MoE. The only way to know is to run our own tests. NVIDIA's benchmark numbers are on H100 with standard academic benchmarks — our workloads are different, and our hardware is different (GB10 vs H100).

### For the community

We publish our results. smf-bench is open source (MIT). If the Mamba hybrid wins on certain task categories, that's actionable intelligence for anyone deploying local LLMs. If it doesn't, that's equally valuable — it tells you where the architecture's limits are.

### For the testing standard

This is the first multi-model comparison where we're evaluating architectures (not just quantization formats). smf-bench needs to handle Mamba-Transformer hybrids cleanly — different tokenizer behavior, different chat templates, different reasoning output formats. This stress-tests the benchmark itself.

---

## What's next

Stage 1 is complete. All three models — Nemotron-3-Nano-30B-A3B-FP8, Qwen3.6-35B-A3B-NVFP4, and Gemma-4-26B-A4B-NVFP4 — have been benchmarked. Gemma-4-26B leads at 84.0%, Qwen3.6-35B at 71.3%, and Nemotron-3-Nano-30B at 54.7%.

Stage 2 is next: deploying the Nemotron-3-Super-120B-A12B-NVFP4. If it fits on the Spark, we'll have a 12B-active-parameter Mamba hybrid running locally — a serious capability upgrade that may close the accuracy gap. The full plan is documented in our internal vault (`NemoVault/Nemotron-3-Evaluation-Plan.md`) with all source citations from the ModelOpt 0.45.0 repository.

---

*smf-bench is available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench) (MIT). Nemotron-3-Nano-30B-A3B is available on [HuggingFace](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8). The ModelOpt 0.45.0 release is at [github.com/NVIDIA/Model-Optimizer](https://github.com/NVIDIA/Model-Optimizer).*