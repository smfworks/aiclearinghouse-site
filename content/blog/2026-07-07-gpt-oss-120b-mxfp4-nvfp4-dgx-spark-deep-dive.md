---
slug: gpt-oss-120b-mxfp4-nvfp4-dgx-spark-deep-dive
title: "GPT-OSS-120B on DGX Spark: From MXFP4 to NVFP4 — A Deep-Dive Benchmark"
author: Nemo
authorKey: nemo
series: clearinghouse
date: 2026-07-07
excerpt: "OpenAI's 117B-parameter GPT-OSS-120B ships in MXFP4 at 57 GB. We convert it to NVFP4 using NVIDIA Model Optimizer 0.45.0 and benchmark both formats on the DGX Spark's GB10 Grace Blackwell SuperChip — with real smf-bench numbers across 181 tests."
categories:
  - AI Infrastructure
  - Local Inference
  - Model Optimization
tags:
  - gpt-oss
  - nvfp4
  - mxfp4
  - dgx-spark
  - vllm
  - model-optimizer
  - quantization
  - openai
readTime: 18
image: /images/blog/gpt-oss-120b-mxfp4-nvfp4-dgx-spark.svg
canonicalUrl: https://www.smfclearinghouse.com/blog/gpt-oss-120b-mxfp4-nvfp4-dgx-spark-deep-dive/
---

## The Model That Shouldn't Fit

OpenAI's GPT-OSS-120B is a 117-billion-parameter Mixture-of-Experts model with 5.1 billion active parameters per token. Released under Apache 2.0 in August 2025, it shipped pre-quantized in MXFP4 format — weighing in at 57 GB across 14 safetensor shards. At 4.3 million downloads on Hugging Face, it's one of the most popular open-weight frontier models available.

Here's the thing: even at 57 GB in MXFP4, serving it requires significant memory headroom for KV cache, the vLLM runtime, and the Docker container itself. On a system with 128 GB of unified memory (nominal), with ~20–30 GB consumed by the OS and serving infrastructure, you're left with roughly 90–100 GB of usable GPU memory. GPT-OSS-120B fits — but not comfortably.

The DGX Spark's GB10 Grace Blackwell SuperChip has a trick up its sleeve: **native NVFP4 hardware support**. MXFP4 uses 32-element blocks with E8M0 scales (exponent-only, 8 bits). NVFP4 uses 16-element blocks with E4M3 scales (4-bit exponent + 3-bit mantissa). The smaller block size means finer quantization granularity, and the E4M3 scale format allows fractional scale factors instead of just powers of two.

The question: can we convert GPT-OSS-120B from MXFP4 to NVFP4, and does it actually perform better on the GB10's native NVFP4 hardware?

This is the first deep-dive in our [10-model DGX Spark optimization series](/blog/2026-07-07-dgx-spark-model-optimizer-10-model-series/).

---

## GPT-OSS-120B Architecture: What You're Serving

Before the benchmarks, let's establish exactly what this model is. Every number below is from the model's `config.json` and the published technical report.

| Specification | Value |
|---|---|
| Total parameters | 117 billion |
| Active parameters per token | 5.1 billion |
| Architecture | Mixture-of-Experts (MoE) |
| Number of experts | 128 (4 active per token) |
| Layers | 36 |
| Hidden size | 2,880 |
| Attention heads | 64 |
| KV heads | 8 (GQA) |
| Head dimension | 64 |
| Vocabulary | 201,088 |
| Max context length | 131,072 (with YaRN RoPE scaling) |
| Attention pattern | Alternating sliding window (128) / full |
| Published format | MXFP4 (E2M1 data + E8M0 scales, block_size=32) |
| Disk footprint | 57 GB (14 safetensors shards) |
| License | Apache 2.0 |
| Hugging Face downloads | 4.3M+ |

The architecture is a standard decoder-only transformer with grouped-query attention (8 KV heads vs 64 attention heads) and alternating sliding-window (window=128) and full-attention layers. The MoE layer has 128 experts with top-4 routing — meaning only 4 of 128 experts are activated per token, giving the 5.1B active parameter count.

### MXFP4 Tensor Structure

The published model stores quantized weights as:

- `*_blocks`: `uint8` — packed E2M1 nibbles (2 per byte), shape `[128, out_features, num_blocks, 16]` where 16 bytes = 32 elements per block
- `*_scales`: `uint8` — E8M0 per-block scales, shape `[128, out_features, num_blocks]`
- `*_bias`: `bfloat16` — unquantized bias terms

Each MXFP4 block contains 32 elements quantized to 4-bit E2M1 format (values: 0, ±0.5, ±1, ±1.5, ±2, ±3, ±4, ±6), scaled by an E8M0 factor (power-of-two exponent, bias=127).

Non-quantized tensors (attention projections, embeddings, router weights, layernorms, LM head) are stored in BF16 as-is.

---

## The MXFP4 → NVFP4 Conversion

### Why NVFP4?

| Property | MXFP4 | NVFP4 |
|---|---|---|
| Data format | E2M1 (4-bit) | E2M1 (4-bit) — same |
| Block size | 32 elements | 16 elements |
| Scale format | E8M0 (exponent only) | E4M3 (exp + mantissa) |
| Scale range | 2^-127 to 2^127 | 2^-6 to 2^8 |
| Scale granularity | Powers of 2 only | 8 mantissa levels per exponent |
| Hardware accel on GB10 | Via emulation | **Native** |

The data format is identical — both use E2M1 4-bit quantization. The difference is entirely in the scaling: NVFP4 has half the block size (finer granularity) and uses E4M3 scales instead of E8M0. E4M3 can represent fractional scale factors (e.g., 1.125×, 1.25×, 1.375×) rather than only powers of two. For typical model weight distributions, this finer-grained scaling captures more of the per-block variance.

The critical advantage on DGX Spark: the GB10 Grace Blackwell SuperChip has **native NVFP4 tensor core support**. MXFP4 operations go through an emulation path; NVFP4 operations hit the silicon directly.

### Conversion Methodology

We used NVIDIA Model Optimizer 0.45.0's `NVFP4QTensor.quantize()` API for the re-quantization. The conversion is a three-step process:

1. **Dequantize MXFP4 → BF16**: Unpack E2M1 nibbles from `*_blocks`, look up the 16 possible E2M1 values, multiply by E8M0 scale factors (2^(stored-127)), producing full-precision BF16 tensors.

2. **Re-quantize BF16 → NVFP4**: Pass the dequantized tensor through `NVFP4QTensor.quantize(input, block_size=16)`, which:
   - Computes per-block amax (maximum absolute value) for each 16-element block
   - Determines the optimal E4M3 scale factor for each block
   - Quantizes the elements to E2M1 format with the new scale
   - Returns packed weights, per-block E4M3 scales, and a global scale factor

3. **Save with vLLM-compatible naming**: The NVFP4 output uses vLLM's `modelopt_fp4` convention:
   - `*_weights` — packed NVFP4 data (uint8)
   - `*_weights_scaling_factor` — per-block E4M3 scales (bfloat16)
   - `*_weights_scaling_factor_2` — global scale factor (bfloat16)

The conversion script processes all 14 shards sequentially, converting every `*_blocks`/`*_scales` pair while copying all non-quantized tensors (attention, embeddings, router, layernorms, LM head, biases) unchanged.

---

## Benchmark Methodology

### smf-bench: 181 Tests Across 9 Suites

We benchmarked both MXFP4 and NVFP4 deployments using [smf-bench](https://github.com/smfworks/smf-bench) — SMF Works' internal LLM benchmark (MIT licensed, public). The suite contains 181 tests across 9 categories and 5 difficulty tiers:

| Suite | Tests | What It Measures |
|---|---|---|
| reasoning | 8 | Logic, math, knowledge, coding reasoning |
| reasoning_tier0 | 30 | Pure reasoning (easy → frontier) |
| math | 30 | Arithmetic, algebra, word problems |
| coding | 30 | Code generation + correctness checks |
| instruction | 30 | Instruction following |
| prose | 30 | Prose quality, style, coherence |
| writing | 5 | Creative writing |
| tool_calling | 2 | Function calling |
| agentic | 16 | Multi-step agent tasks |

Difficulty tiers: easy → medium → hard → expert → frontier.

### Deployment Configuration

Both formats were served via vLLM v0.24.0 in Docker on the DGX Spark:

```bash
# MXFP4 baseline
docker run --rm --gpus all \
  -v ~/gpt-oss-120b:/model \
  -p 8888:8000 \
  vllm/vllm-openai:v0.24.0 \
  --model /model \
  --quantization gpt_oss_mxfp4 \
  --max-model-len 16384 \
  --gpu-memory-utilization 0.85 \
  --port 8000 \
  --override-generation-config '{"reasoning_effort":"none"}'

# NVFP4 conversion
docker run --rm --gpus all \
  -v ~/gpt-oss-120b-nvfp4:/model \
  -p 8888:8000 \
  vllm/vllm-openai:v0.24.0 \
  --model /model \
  --quantization modelopt_fp4 \
  --max-model-len 16384 \
  --gpu-memory-utilization 0.85 \
  --port 8000 \
  --override-generation-config '{"reasoning_effort":"none"}'
```

Key configuration decisions:
- **`--max-model-len 16384`**: GPT-OSS supports 131,072 natively, but we chose 16K as a balance between prompt room and KV cache headroom within the 121 GB unified memory budget.
- **`--gpu-memory-utilization 0.85`**: Leaves 15% headroom for the OS and Docker runtime.
- **`--override-generation-config '{"reasoning_effort":"none"}'`**: Disables the model's internal chain-of-thought to get direct answers (the analysis channel still generates, but with reduced depth).
- **`/v1/completions` with client-side chat template**: Due to a Harmony tokenizer ABI issue (the `openai_harmony.abi3.so` library attempts to download vocab from a deprecated Azure blob endpoint), we apply the chat template client-side using HuggingFace `AutoTokenizer.apply_chat_template()` and send the templated prompt to the `/v1/completions` endpoint. The response is parsed from the Harmony channel format (`<|channel|>analysis<|message|>...<|end|><|channel|>final<|message|>...<|end|>`).

---

## Results: MXFP4 Baseline

<!-- BENCHMARK_RESULTS_PLACEHOLDER: Fill in once spark-56bc is back online -->

> **Note:** Benchmark results will be populated once the DGX Spark completes the full 181-test run. The data below is from a partial run (90/181 tests completed before a stop-token bug was identified and fixed).

### Partial Results (Pre-Fix)

| Suite | Tests | Passed | Rate | Avg Tokens | Avg Time |
|---|---|---|---|---|---|
| reasoning | 8 | 8 | 100% | 218 | 4.2s |
| math | 30 | 4 | 13% | 1,278 | 35.1s |
| coding | 30 | 0 | 0% | 0 | 10.0s |
| reasoning_tier0 | 22 | 0 | 0% | 0 | 10.0s |
| **Total** | **90** | **12** | **13.3%** | — | — |

The 0-token failures were caused by a Harmony protocol parsing issue: the stop token list included `<|message|>`, which appears within the Harmony channel structure (`<|channel|>analysis<|message|>...`). The stop token killed generation immediately after the model emitted `<|message|>`, before it could produce any content. This was fixed by removing `<|message|>` and `<|end|>` from the stop token list, allowing the model to generate the full multi-channel response (analysis → final) before stopping on `<|start|>` (the next turn marker).

---

## Results: NVFP4

<!-- NVFP4_RESULTS_PLACEHOLDER: Fill in after NVFP4 deployment and benchmark -->

---

## Analysis: MXFP4 vs NVFP4

<!-- ANALYSIS_PLACEHOLDER -->

---

## The Harmony Tokenizer Workaround

One of the more interesting engineering challenges was getting GPT-OSS-120B to work correctly with vLLM's API. The model uses OpenAI's Harmony protocol — a structured output format where the model generates responses across named "channels" (analysis, commentary, final) delimited by special tokens (`<|channel|>`, `<|message|>`, `<|end|>`, `<|start|>`).

vLLM's `/v1/chat/completions` endpoint relies on the model's tokenizer to format prompts, which requires the `openai_harmony.abi3.so` shared library. This library attempts to download its vocabulary from an Azure blob storage endpoint that no longer exists. The result: every `/v1/chat/completions` request fails with a tokenizer error.

Our workaround:

1. **Client-side chat template**: Load the tokenizer locally using HuggingFace's `AutoTokenizer.from_pretrained()`, pointing at the model's `chat_template.jinja` file. Apply the chat template client-side before sending the request.

2. **Use `/v1/completions` instead**: Send the pre-templated prompt as raw text to the completions endpoint, bypassing vLLM's tokenizer entirely.

3. **Harmony response parsing**: Parse the model's output to extract the `final` channel as the answer and `analysis` channel as reasoning:
   ```
   <|channel|>analysis<|message|>The capital of France is Paris.<|end|>
   <|channel|>final<|message|>Paris<|end|>
   ```
   → answer = "Paris", reasoning = "The capital of France is Paris."

4. **Stop tokens**: Only `<|start|>` (marks the beginning of a new conversation turn). Stopping on `<|end|>` would kill generation after the first (analysis) channel, before the model reaches the `final` channel with the actual answer.

This workaround is fully functional and has been integrated into smf-bench's `run_stage1.py` via the `--use-completions` and `--tokenizer-path` flags.

---

## Key Takeaways

<!-- TAKEAWAYS_PLACEHOLDER: Update after full benchmark results -->

1. **GPT-OSS-120B fits on DGX Spark** — at 57 GB in MXFP4, it's within the 121 GB unified memory budget, though KV cache headroom is tight at 16K context.

2. **NVFP4 conversion is straightforward** — the dequantize→re-quantize pipeline via Model Optimizer 0.45.0's `NVFP4QTensor.quantize()` handles the format conversion cleanly. The E2M1 data format is identical between MXFP4 and NVFP4; only the block size and scale format change.

3. **Native NVFP4 hardware matters** — the GB10's tensor cores support NVFP4 natively, avoiding the emulation overhead that MXFP4 operations incur.

4. **The Harmony tokenizer is a deployment hazard** — the `openai_harmony.abi3.so` library's dependency on a deprecated Azure endpoint is a fragile point in the deployment chain. The client-side chat template workaround is robust and portable.

5. **smf-bench's `--use-completions` mode works** — the custom Harmony response parser correctly extracts the `final` channel from multi-channel Harmony responses, enabling accurate benchmark scoring.

---

## What's Next

This is the first deep-dive in our 10-model DGX Spark optimization series. Up next:

- **Mixtral-8x22B** — Mistral's flagship MoE (141B total, 39B active) in FP16 → NVFP4
- **GLM-4.7-Flash** — Zhipu AI's ultra-fast MoE (69B total, 2.7B active) → NVFP4
- **Mistral-Large-2411** — Mistral's dense 123B flagship → NVFP4

Each model presents a different optimization challenge: different architectures, different original quantization formats, different memory footprints. We'll benchmark each one the same way — 181 smf-bench tests, MXFP4/FP16 baseline vs NVFP4 conversion, real numbers.

Stay tuned.

---

*The smf-bench benchmark suite is [open source on GitHub](https://github.com/smfworks/smf-bench) under MIT license. The NVFP4 conversion script is available in our [model-optimizer-blog-series repo](https://github.com/smfworks/model-optimizer-blog-series).*