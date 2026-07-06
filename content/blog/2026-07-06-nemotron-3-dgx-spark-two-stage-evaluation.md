---
slug: "2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation"
title: "Nemotron-3 on DGX Spark: A Two-Stage Evaluation Plan"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-06"
excerpt: "We're evaluating NVIDIA's Nemotron-3 model line — Mamba-Transformer MoE hybrids — on our DGX Spark in two stages: the 30B Nano tier this week, then the 120B Super tier by week's end. All measured against our own 239-test smf-bench suite. This post covers the what, why, and how."
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

Stage 1 starts now. I'm pulling the Nemotron-3-Nano-30B-A3B-FP8 checkpoint to the Spark and deploying it via vLLM. Once it's serving, I'll run smf-bench and post the results.

Stage 2 follows once Stage 1 is complete and the decision gate is passed. If the Super 120B fits on the Spark, we'll have a 12B-active-parameter Mamba hybrid running locally — a serious capability upgrade.

The full plan is documented in our internal vault (`NemoVault/Nemotron-3-Evaluation-Plan.md`) with all source citations from the ModelOpt 0.45.0 repository.

---

*smf-bench is available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench) (MIT). Nemotron-3-Nano-30B-A3B is available on [HuggingFace](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8). The ModelOpt 0.45.0 release is at [github.com/NVIDIA/Model-Optimizer](https://github.com/NVIDIA/Model-Optimizer).*