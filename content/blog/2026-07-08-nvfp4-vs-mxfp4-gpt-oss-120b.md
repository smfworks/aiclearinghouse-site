---
slug: "2026-07-08-nvfp4-vs-mxfp4-gpt-oss-120b"
title: "NVFP4 vs MXFP4: Making GPT-OSS-120B Native on Blackwell"
excerpt: "GPT-OSS-120B already fits on a DGX Spark at 65 GB in MXFP4. But MXFP4 isn't native on Blackwell. We're converting it to NVFP4 — same 4-bit footprint, native tensor core operations. Here's what the format difference actually means, how Model Optimizer 0.45 handles the cast, and what we expect to measure."
date: "2026-07-08"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["Model Optimization", "NVFP4", "DGX Spark", "Quantization"]
tags: []
readTime: 12
image: "/images/blog/2026-07-08-nvfp4-vs-mxfp4-gpt-oss-120b-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-08-nvfp4-vs-mxfp4-gpt-oss-120b"
---

# NVFP4 vs MXFP4: Making GPT-OSS-120B Native on Blackwell

**Day 1 of "Optimizing the Un-Optimizable" — a 10-model series using NVIDIA Model Optimizer 0.45 on a single DGX Spark.**

GPT-OSS-120B is the most-downloaded model on HuggingFace. 4.3 million downloads. 117 billion parameters with 5.1 billion active per token. It ships natively in MXFP4 — a 4-bit floating-point format that already fits the model into 65.2 GB, well within the DGX Spark's 128 GB unified memory budget.

So why optimize it?

Because MXFP4 is not NVFP4. And on the DGX Spark's GB10 Grace Blackwell chip, that distinction matters.

## The Two Formats

Both MXFP4 and NVFP4 are 4-bit floating-point formats. Both compress model weights to the same theoretical footprint. But they use different block structures, and that difference determines whether the hardware can run them natively or has to emulate.

### MXFP4 — The OCP Standard

MXFP4 (Microscaling FP4) is the Open Compute Project's standard 4-bit format. It uses **32-element blocks** with a shared E8M0 micro-exponent. Each element within the block is an E2M1 mantissa (1 sign bit, 2 exponent bits, 1 mantissa bit). The shared exponent covers a group of 32 weights, and the format was designed to be hardware-agnostic — any accelerator that implements the OCP MX specification can run it.

GPT-OSS ships in this format because OpenAI chose the open standard. It works on AMD NPUs, on Intel accelerators, and on NVIDIA GPUs — but on NVIDIA Blackwell, it runs through emulation paths, not native tensor core operations.

### NVFP4 — NVIDIA's Native Format

NVFP4 is NVIDIA's 4-bit format, designed specifically for Blackwell tensor cores. It uses **16-element blocks** with an E8M0 scale per block. Each element is the same E2M1 mantissa, but the block is half the size — 16 weights instead of 32. The smaller block size means finer-grained scaling, which can improve accuracy, and the format maps directly to Blackwell's native FP4 tensor core instructions.

NVIDIA's own models (Nemotron, Llama FP4 checkpoints, DeepSeek-R1-FP4) use NVFP4. When you run NVFP4 on a DGX Spark, the tensor cores execute the arithmetic natively. No emulation, no fallback.

## Why This Matters on the DGX Spark

The DGX Spark is powered by a GB10 Grace Blackwell Superchip with 128 GB of unified LPDDR5X memory. The Blackwell GPU portion has native NVFP4 tensor core support — it can execute FP4 matrix multiplications in hardware. MXFP4, while also 4-bit, uses a different block structure (32-element blocks with micro-exponents) that does not map directly to NVFP4 hardware paths.

This means:

- **Same memory footprint:** Both formats store weights at 4 bits. GPT-OSS-120B at 65.2 GB in MXFP4 would be approximately 65 GB in NVFP4. No memory savings from the conversion.
- **Potentially different throughput:** NVFP4 hits native tensor core hardware. MXFP4 may run through emulation. The question is whether native hardware paths deliver measurable speedup at inference time.
- **Quality implications:** The block structure difference (16 vs 32 elements per block) means the quantization granularity is different. NVFP4's smaller blocks could give better accuracy — or the cast could introduce artifacts. We won't know until we measure.

## The Cast: MXFP4 → NVFP4

NVIDIA Model Optimizer 0.45 includes a closed-form cast operation that converts MXFP4 weights to NVFP4 without recalibration. The `--cast_mxfp4_to_nvfp4` flag tells `hf_ptq.py` to read the source MXFP4 scales and produce a bit-exact NVFP4 weight export.

Here's the key detail: for blocks where the MXFP4 scale exponent lands within E4M3's representable window (`k_max - k_j ≤ 17`), NVFP4 dequantization matches MXFP4 dequantization **bit-for-bit**. No quality loss for those blocks. For blocks where the scale falls outside that window, the cast falls back to a data-derived per-block amax — a small number of blocks that need a slightly different scaling approach.

This is not a re-quantization. It's a format conversion. The weights themselves don't change; only the block structure and scaling representation change. For the majority of blocks, the result is identical.

## What We're Measuring

This is Day 1 of our optimization study. The optimization is not about fitting — the model already fits. The optimization is about native hardware format. Here's what we're measuring:

1. **Per-capability quality (SMF-Bench, 181 tests, 8 categories):** Reasoning, math, coding, instruction following, prose, writing, tool calling, agentic. We compare NVFP4-cast quality against the MXFP4 baseline. If the cast is truly bit-exact for most blocks, quality should be unchanged. But "should be" is not "is" — we measure.

2. **Throughput (tokens/sec):** If NVFP4 hits native tensor core paths and MXFP4 runs through emulation, we expect a throughput difference. This is the primary hypothesis: native format buys speed.

3. **Memory footprint:** Should be identical (~65 GB). We verify to confirm no overhead from the format conversion.

4. **Context length:** Both formats should support the same context window. We test at 32K and 64K.

5. **Stability:** Does the model hold up under sustained inference? No OOMs, no crashes, no degradation over time.

## The Bigger Picture

GPT-OSS-120B is Day 1 — the easiest model in the series. It's the one where the optimization is most likely to work cleanly, because the format conversion is well-supported and the model already fits. The point of starting here is to establish the baseline: what does a clean format conversion cost (or not cost) in quality and throughput?

The answer sets the stage for the rest of the series. Days 2–5 test single-technique optimization on models that don't fit as easily (Mixtral-8x22B at 281 GB, Mistral-Large-2411 at 490 GB). Days 6–8 require combined techniques (NVFP4 + KV cache quantization, expert pruning). Days 9–10 require the full pipeline — pruning, distillation, and quantization — to fit models that are 3–5× the Spark's memory.

If the GPT-OSS-120B cast shows that format conversion alone can buy measurable throughput without quality loss, that's a finding worth publishing. If it shows unexpected quality degradation, that's also worth publishing — and it tells us something about the cast's edge cases.

## Technical Details

**Model:** `openai/gpt-oss-120b` — 117B parameters, MoE with 128 experts and 4 active per token (32:1 sparsity), 36 layers, hidden size 2,880, context length 131,072, Apache 2.0 license, 4.3M downloads.

**Tool:** NVIDIA Model Optimizer 0.45, `hf_ptq.py` with `--qformat nvfp4_mlp_only --cast_mxfp4_to_nvfp4`.

**Hardware:** Single NVIDIA DGX Spark (GB10 Grace Blackwell, 128 GB unified LPDDR5X, ARM64).

**Benchmark:** SMF-Bench — 181 tests across 8 capability categories with deterministic judging.

**Deployment:** vLLM with `--quantization modelopt`, serving the exported unified HF checkpoint.

---

*This is Day 1 of "Optimizing the Un-Optimizable" — a 10-model series published daily. Tomorrow: Mixtral-8x22B, the first model in the series with no existing NVFP4 version anywhere. We're creating it. 141B parameters, 281 GB BF16, compressed to an estimated 79 GB.*

*Follow @smfworks on X for daily updates. Full results and the cross-model synthesis publish at the end of the series.*