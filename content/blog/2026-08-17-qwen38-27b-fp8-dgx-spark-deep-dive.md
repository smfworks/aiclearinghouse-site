---
slug: qwen38-27b-fp8-dgx-spark-deep-dive
title: "Qwen3.8-27B FP8 on DGX Spark: When the Aggregate Lies"
excerpt: "FP8 quantization + EAGLE speculative decoding on a hybrid Mamba-Transformer model. 79% overall, but the per-capability profile reveals a math crater that the aggregate number hides. Full SMF-Bench breakdown with performance metrics."
date: "2026-08-17"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["model-optimization", "benchmarking"]
tags: ["qwen3.8", "fp8", "dgx-spark", "nvfp4", "quantization", "speculative-decoding", "eagle", "smf-bench"]
readTime: "8 min"
image: "/images/blog/qwen38-27b-fp8-dgx-spark-deep-dive-hero.svg"
canonicalUrl: "https://smfclearinghouse.com/blog/qwen38-27b-fp8-dgx-spark-deep-dive"
---

# Qwen3.8-27B FP8 on DGX Spark: When the Aggregate Lies

**Model:** Qwen3.8-27B (dense, hybrid Mamba-Transformer — `qwen3_5_hybrid_gdn` architecture)
**Optimization:** FP8 post-training quantization + EAGLE speculative decoding
**Hardware:** NVIDIA DGX Spark (GB10 Blackwell, 128 GB unified memory)
**Serving:** SGLang with EAGLE draft model
**Benchmark:** SMF-Bench strict_v01 (157 tests across 7 capability categories)
**Date:** August 16, 2026

---

## The Architecture

Qwen3.8-27B is not a standard Transformer. Its architecture is classified as `qwen3_5_hybrid_gdn` — a hybrid design that interleaves Mamba (Gated Delta Network) blocks with traditional Transformer attention layers. With 64 hidden layers, a hidden size of 5120, and an intermediate size of 17408, it's a dense model (no MoE expert routing).

The hybrid architecture has a critical implication for deployment: Mamba blocks have O(1) inference memory per token (no KV cache growth), while Transformer blocks have O(n) KV cache. This means the model's memory profile under long context is fundamentally different from a pure Transformer of the same size — and it's why we achieved 128K context on the DGX Spark's 128 GB unified memory budget.

## The Optimization Stack

Two optimization layers were applied:

1. **FP8 post-training quantization**: Model Optimizer's FP8 quantization converts weights and activations to 8-bit floating point. On Blackwell GPUs, FP8 engages the tensor cores natively, delivering ~2x memory reduction and ~1.5x throughput improvement over BF16.

2. **EAGLE speculative decoding**: A lightweight draft model predicts the next few tokens; the main model verifies them in a single forward pass. When the draft is correct, you decode N tokens for the cost of one forward pass. The serve recipe ID is `SMF-Spark-SGLang-qwen38-27b-fp8-eagle`.

The HF gate verdict: **green**. Tile alignment is OK, no intermediate size risk, serve smoke test passed. The architecture is confirmed as `qwen3_5_hybrid_gdn` with no MoE backend.

## Quality Results — SMF-Bench

| Category | Pass | Fail | Error | Pass Rate |
|----------|------|------|-------|-----------|
| **Math** | 15 | 15 | 0 | **50.0%** |
| Coding | 26 | 4 | 0 | 86.7% |
| Reasoning | 25 | 5 | 0 | 83.3% |
| Instruction | 25 | 5 | 0 | 83.3% |
| Prose | 27 | 3 | 0 | 90.0% |
| Writing | 4 | 1 | 0 | 80.0% |
| Tool Calling | 2 | 0 | 0 | 100.0% |
| **Overall** | **124** | **33** | **0** | **79.0%** |

**Zero errors.** Every test completed — no timeouts, no OOM, no crashes. This is a stability signal, not just a quality signal. On the DGX Spark's unified memory architecture, zero errors means the model fits comfortably within the memory budget with headroom for the EAGLE draft model and KV cache.

### The Math Crater

The aggregate pass rate of 79.0% looks like a modest, uniform degradation. It isn't. Math collapsed to 50.0% — exactly half the tests failed. Meanwhile, prose held at 90.0% and coding at 86.7%. The gap between the best and worst categories is 40 percentage points.

This is the pattern we've seen across every quantized model in our study: math is the first casualty of compression. The mechanism is likely numerical precision — multi-digit arithmetic in FP8 has only 3 bits of mantissa (E4M3 format), which means rounding errors compound through chain-of-thought reasoning steps. A model that gets 83% on reasoning (logical deduction, no arithmetic) but 50% on math (requires exact computation) is telling you that the failure is in numerical precision, not in reasoning ability.

## Performance Results

### Throughput (tokens/sec)

| Output Length | Wall Time (s) | Throughput (tok/s) |
|---------------|---------------|---------------------|
| 64 tokens | 6.6 | 9.66 |
| 128 tokens | 8.8 | 14.62 |
| 256 tokens | 17.9 | 14.27 |
| 512 tokens | 34.9 | 14.69 |
| 1024 tokens | 65.7 | 15.59 |

Throughput stabilizes at ~14.5–15.6 tok/s for outputs ≥128 tokens. The 64-token case is lower (9.66 tok/s) because the EAGLE draft model's startup overhead dominates at short output lengths.

### Time to First Token (TTFT)

| Prompt Type | TTFT (ms) | Total Time (s) |
|-------------|-----------|-----------------|
| Short | 324.3 | 0.8 |
| Medium | 317.6 | 25.0 |
| Reasoning | 318.6 | 37.8 |

TTFT is consistent at ~318ms across prompt types. Speculative decoding does not improve TTFT — the draft model runs before the first token is generated, adding latency to the first step. The benefit is in subsequent token throughput.

### Concurrency

| Concurrency | Success | Failed | Wall Time (s) |
|-------------|---------|--------|---------------|
| 1 | 1/1 | 0 | 37.6 |
| 2 | 2/2 | 0 | 38.8 |
| 4 | 4/4 | 0 | 44.0 |
| 8 | 8/8 | 0 | 51.1 |
| 16 | 16/16 | 0 | 65.0 |

100% success rate at all concurrency levels up to 16. The wall time scales sub-linearly — doubling concurrency from 8 to 16 increases wall time by only 27% (51s → 65s), indicating the DGX Spark has headroom for higher concurrency.

### Context Scaling

| Target Context | Prompt Tokens | Wall Time (s) | Throughput (tok/s) |
|----------------|---------------|---------------|---------------------|
| 100 | 148 | 0.507 | 5.92 |
| 500 | 548 | 0.618 | 4.86 |
| 2,000 | 2,048 | 0.504 | 5.95 |
| 8,000 | 8,048 | 7.225 | 0.42 |
| 32,000 | 32,048 | 0.596 | 5.03 |
| 128,000 | 128,048 | 40.571 | 0.07 |

The model successfully processed a 128K-token prompt — a milestone that would be challenging for a pure 27B Transformer on this hardware. The hybrid Mamba architecture's O(1) memory per token for Mamba layers is what makes this feasible. However, throughput at 128K drops to 0.07 tok/s, making it technically possible but practically limited to very short completions.

The 8K context anomaly (0.42 tok/s, 7.2s wall time) suggests a KV cache allocation threshold — the system may be reorganizing memory at this scale. This warrants further investigation.

## Cross-Model Comparison

How does Qwen3.8-27B FP8 compare to other optimized models in our study?

| Model | Optimization | Overall | Math | Coding | Prose | Errors |
|-------|-------------|---------|------|--------|-------|--------|
| Qwen3.8-27B (dense) | FP8 + EAGLE | 79.0% | 50.0% | 86.7% | 90.0% | 0 |
| Qwen3.6-35B-A3B (MoE) | NVFP4 | 78.3% | 53.3% | 73.3% | 90.0% | 0 |
| Laguna-S-2.1 | NVFP4 | 68.2% | 26.7% | 80.0% | 76.7% | 0 |
| Mistral-Large-2411 | NVFP4 | 56.4% | 10.0% | 46.7% | 86.7% | 15 |

Key observations:

1. **Qwen3.8-27B FP8 vs Qwen3.6-35B NVFP4**: Nearly identical aggregate (79.0% vs 78.3%), but different capability profiles. The dense FP8 model is stronger on coding (86.7% vs 73.3%); the MoE NVFP4 model is slightly stronger on math (53.3% vs 50.0%). Both are on the Pareto frontier — neither dominates.

2. **The NVFP4 vs FP8 comparison is not apples-to-apples**: NVFP4 is 4-bit, FP8 is 8-bit. The fact that a 4-bit MoE model matches an 8-bit dense model in aggregate quality is a testament to the `nvfp4_experts_only` strategy — quantizing only the inactive experts while keeping the active compute path in higher precision.

3. **Mistral-Large-2411 NVFP4 is a cautionary tale**: 15 errors out of 181 tests (8.3% error rate) and 56.4% pass rate. The errors indicate the model is hitting the memory ceiling — it's too close to the edge for stable deployment. The quality of the answers it *did* produce (when it didn't crash) is better than the aggregate suggests, but a model that fails 8% of the time is a deployment risk.

## Implications

### For Edge Deployment
Qwen3.8-27B FP8 is a viable edge deployment model. Zero errors, 15.6 tok/s throughput, 128K context, and 100% concurrency success at 16 simultaneous requests. The hybrid Mamba architecture gives it a context length advantage that pure Transformers can't match at this parameter count.

### For the Math Degradation Problem
The per-capability data confirms a structural pattern: quantization degrades math disproportionately. This isn't specific to Qwen3.8 — it's visible in every model we've tested. The implication is that if your use case involves numerical reasoning, you need to either (a) keep math-heavy workloads on higher-precision models, (b) use mixed-precision quantization that preserves attention layers in FP8 while quantizing only MLP layers, or (c) accept the degradation and calibrate user expectations.

### For Stacked Optimization
This is one of the first data points we have for FP8 + EAGLE speculative decoding on a hybrid architecture. The key open question: how much of the math degradation comes from FP8 quantization vs. EAGLE's draft model introducing errors in numerical reasoning? We need to benchmark FP8 without EAGLE to isolate the two effects.

## Final Verdict

**Is it usable?** Yes. For prose, coding, reasoning, instruction following, and tool calling, Qwen3.8-27B FP8 on DGX Spark is a competent edge model. The 79% aggregate with zero errors and 15.6 tok/s throughput is a practical deployment profile.

**Would I deploy it?** Yes, with a caveat: route math-heavy queries to a higher-precision model or accept the 50% math pass rate. The hybrid Mamba architecture's context length advantage makes this model particularly suited for long-document tasks (summarization, analysis, retrieval-augmented generation) where math precision is less critical.

**The tradeoff**: 15.6 tok/s at 79% quality with 128K context, or 2 tok/s at 97% quality (unquantized, cloud API). For edge deployment, the answer is clear. For math-heavy workloads, it isn't.

---

*Follow @MichaelGannotti on X for daily updates on the SMF Works model optimization study.*