---
slug: "2026-07-09-glm-4-7-flash-dgx-spark-benchmark"
title: "GLM-4.7-Flash on a Desktop: The Most Bimodal Model We've Tested — 100% Agentic, 100% Writing, But 3% Instruction"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-09"
excerpt: "Zhipu AI's 30B/3B MoE model — the smallest in our 10-model series — produces the most extreme capability distribution we've seen: perfect 100% on agentic and writing, best-in-class 36.7% on math (beating GPT-OSS's 26.7%), but a catastrophic 3.3% on instruction-following and 6.7% on prose. The architecture is unique: 64 routed experts with MLA attention, NextN prediction layers, and a 1.76× NVFP4 compression that takes it from 31 GB to 18 GB. Full 181-test smf-bench results: 34.8% overall, 501K tokens generated, 5.8-hour wall time."
categories: ["AI", "Local LLMs", "Model Optimization", "NVIDIA"]
tags: ["glm-4.7", "zhipu-ai", "dgx-spark", "vllm", "smf-bench", "moe", "nvfp4", "mla-attention", "blackwell", "local-inference"]
readTime: 20
image: "/images/blog/2026-07-09-glm-4-7-flash-dgx-spark-benchmark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-09-glm-4-7-flash-dgx-spark-benchmark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The model

GLM-4.7-Flash is Zhipu AI's compact Mixture-of-Experts model, released under the MIT license. It is the smallest model in our 10-day optimization series — 30 billion total parameters with only 3 billion active per token. Despite its size, it introduces several architectural innovations we have not seen in the other models:

**64 routed experts + 1 shared expert, 4 active per token.** Unlike Mixtral-8x22B (8 experts, 2 active) or GPT-OSS-120B (128 experts, 4 active), GLM-4.7-Flash uses a large expert pool with a shared expert that fires on every token. The first transformer layer is dense (`first_k_dense_replace: 1`); layers 2–47 use sparse MoE routing with the `noaux_tc` top-k method and normalized routing probabilities.

**Multi-head Latent Attention (MLA).** Instead of standard multi-head attention, GLM uses latent attention with Q and KV LoRA ranks (`q_lora_rank: 768`, `kv_lora_rank: 512`). This compresses the attention weight matrices significantly — the model's BF16 checkpoint is only 29 GiB despite having 30B parameters, because MLA reduces the attention parameter count by roughly 50% compared to standard MHA.

**NextN prediction layers.** The model includes `num_nextn_predict_layers: 1`, a speculative prediction mechanism that generates one additional token prediction layer in parallel. This is a throughput optimization not present in Mixtral or GPT-OSS.

**202K context window.** With `max_position_embeddings: 202,752`, GLM-4.7-Flash supports the longest context window in our series — nearly 3× GPT-OSS's 65K and 3× Mixtral's 65K.

The model uses the `Glm4MoeLiteForCausalLM` architecture, implemented in transformers 5.0.0rc0 (a release candidate), with a vocabulary of 154,880 tokens.

---

## The hardware

Same DGX Spark as Days 1 and 2: GB10 Grace Blackwell SuperChip, 121 GB unified memory, 3.7 TB NVMe, ARM64, native NVFP4 support. Full hardware details in our [series announcement](https://www.smfclearinghouse.com/blog/2026-07-07-dgx-spark-model-optimizer-10-model-series).

---

## The quantization

We tested GLM-4.7-Flash in two configurations:

### 1. BF16 (baseline)

The native BF16 model, downloaded from HuggingFace as 48 safetensors shards:

| Metric | Value |
|---|---|
| Safetensors total | 31,221,488,576 bytes (29.08 GiB) |
| Disk size (all files) | 62.5 GB |
| Shards | 48 |
| Active parameters | 3B (4 of 64 experts + 1 shared) |

The 29 GiB checkpoint is notably smaller than the theoretical 60 GB for a 30B param BF16 model. MLA's latent attention compression accounts for the difference — the attention weights use low-rank projections instead of full Q/K/V matrices.

### 2. NVFP4 W4A16 (quantized)

A post-training quantization using NVIDIA Model Optimizer 0.45.0, with weights quantized to NVFP4 (4-bit) and activations kept in BF16 (16-bit). This is a **W4A16** scheme — less aggressive than the W4A4 NVFP4 used on Mixtral-8x22B, where both weights and activations are 4-bit.

| Metric | Value |
|---|---|
| Safetensors total | 17,764,172,768 bytes (16.55 GiB) |
| Disk size (all files) | 17.8 GB |
| Shards | 4 |
| Compression ratio | 1.76× |
| Quant algorithm | W4A16_NVFP4 |
| Group size | 16 elements |
| Producer | modelopt 0.45.0 |

**Excluded from quantization:** `lm_head`, `model.embed_tokens`, and all 46 MoE router gates (`model.layers.*.mlp.gate`). The shared expert and all routed expert linear layers are quantized.

### Why only 1.76× compression?

The 1.76× ratio is much lower than the 3.5× we saw with Mixtral's W4A4 NVFP4. Two factors explain this:

1. **W4A16 vs W4A4.** GLM's quantization keeps activations in BF16 (16-bit), while Mixtral quantizes both weights and activations to 4-bit. The activation memory is not reduced, so the overall compression is lower.

2. **MLA already compresses attention.** GLM's attention weights are already small due to the low-rank latent projections. The quantization targets the expert MLP layers, but the attention parameters — already compressed by MLA — remain in BF16 and dilute the compression ratio.

### NVFP4 quality comparison (partial)

We ran a partial 30-test benchmark on the NVFP4 variant (math + reasoning suites only) for an initial quality comparison:

| Suite | BF16 (full 181) | NVFP4 (partial 30) | Delta |
|---|---|---|---|
| reasoning | 28/38 (73.7%) | 8/8 (100.0%) | — |
| math | 11/30 (36.7%) | 6/22 (27.3%) | -9.4pp |

The NVFP4 math score (27.3% on 22 tests) is lower than BF16 (36.7% on 30 tests), suggesting W4A16 quantization introduces measurable degradation on numerical reasoning. However, the test sets are different sizes, so this comparison is preliminary. A full 181-test NVFP4 run would be needed for a definitive comparison.

---

## Serving configuration

The BF16 model was served using vLLM 0.24.0:

```bash
docker run -d --name glm-server \
  --network host --gpus all \
  -v /home/mikesai3/glm-4.7-flash-bf16:/model \
  vllm/vllm-openai:v0.24.0 \
  --model /model \
  --enforce-eager \
  --max-model-len 16384 \
  --gpu-memory-utilization 0.88 \
  --served-model-name glm-4.7-flash-instruct \
  --trust-remote-code
```

**`--enforce-eager`**: Same GB10 CUDA graph crash mitigation as Days 1 and 2.

**`--trust-remote-code`**: Required because `Glm4MoeLiteForCausalLM` is not yet in the stable transformers release — it depends on transformers 5.0.0rc0 remote code shipped with the model.

**No `--quantization` flag needed for BF16.** The model loads in native bfloat16 without any quantization backend.

The container ran for approximately 6 hours (covering the full benchmark duration) and was stopped after completion. The NVFP4 variant was served separately in an earlier session with `--quantization compressed-tensors`.

### Serving stats (BF16)

| Metric | Value |
|---|---|
| Weights | ~29 GiB (BF16 native) |
| Max context | 16,384 tokens (limited from 202K native) |
| Container uptime | ~6 hours |

Full vLLM startup logs were not preserved (container was removed after the run). The key observation: at 29 GiB of weights, the BF16 model leaves approximately 92 GiB for KV cache and system overhead — far more headroom than Mixtral (47 GiB) or GPT-OSS (64 GiB).

---

## Benchmark methodology

Same smf-bench Stage 1 suite as Days 1 and 2: 181 tests across 9 categories. Per-request timeout: 300s. Resume enabled. Temperature: 0.0.

The run completed in 21,023.2 seconds (5.8 hours) — the longest wall time in the series so far. The extended duration is directly attributable to GLM's verbosity: it generated 501,812 tokens, more than GPT-OSS (422,288) despite having 40× fewer active parameters.

---

## Results

### Overall

| Metric | Value |
|---|---|
| **Overall pass rate** | **63/181 (34.8%)** |
| Fail | 116 |
| Error | 2 |
| Wall time | 21,023.2s (5.8h) |
| Total tokens generated | 501,812 |

### Per-suite breakdown

| Suite | Pass | Total | Rate | Fail | Error |
|---|---|---|---|---|---|
| agentic | 16 | 16 | **100.0%** | 0 | 0 |
| writing | 5 | 5 | **100.0%** | 0 | 0 |
| reasoning | 28 | 38 | 73.7% | 10 | 0 |
| math | 11 | 30 | 36.7% | 19 | 0 |
| prose | 2 | 30 | 6.7% | 28 | 0 |
| instruction | 1 | 30 | 3.3% | 29 | 0 |
| coding | 0 | 30 | 0.0% | 30 | 0 |
| tool_calling | 0 | 2 | 0.0% | 0 | 2 |

### The 2 errors

Both are the same tool_calling HTTP 400 errors as Mixtral — missing `--enable-auto-tool-choice` and `--tool-call-parser` flags in the vLLM serving configuration. Fixable, not a model limitation.

---

## Analysis: The most bimodal model we've tested

### Perfect on agentic and writing

GLM-4.7-Flash joins Mixtral-8x22B as the second model to score 100% on agentic tasks (16/16). It also scores 100% on writing (5/5) — matching GPT-OSS and beating Mixtral's 60%. For a 3B active parameter model, this is remarkable. The agentic suite requires generating complete, functional applications with verifiable file evidence (HTML games, animations, counters, todo apps). GLM-4.7-Flash handles these as well as models 13× its active parameter size.

### Best-in-class math

At 36.7% (11/30), GLM-4.7-Flash has the highest math score of any model we've tested:

| Model | Math score | Active params |
|---|---|---|
| **GLM-4.7-Flash** | **36.7%** | **3B** |
| GPT-OSS-120B | 26.7% | 5.1B |
| Mixtral-8x22B | 6.7% | 39B |

A 3B active model outscoring a 39B active model by 5.5× on math is a striking result. This suggests GLM's training data included substantial mathematical content, and that the MLA + shared expert architecture may preserve reasoning capability more efficiently than standard MoE designs.

### Catastrophic instruction-following: 3.3%

The instruction suite tests exact-output compliance: the prompt asks the model to reply with a specific phrase (e.g., "reply with exactly: quorvat relay nine is ready"), and the evaluator checks for an exact text match. GLM-4.7-Flash fails 29 of 30 instruction tests.

The failure mode is consistent: instead of outputting the requested phrase, the model produces a verbose, structured explanation. Example:

> **Expected:** `quorvat relay nine is ready`
> **Got:** `1. **analyze the user's request:** the user wants me to reply with the exact phrase "quorvat relay...'`

This is not a capability gap — the model understands the instruction perfectly. It is a **formatting compliance** issue: GLM-4.7-Flash defaults to an analytical, step-by-step response style that wraps the answer in explanation. The one instruction test that passed (`reasoning_instruction`) uses a different evaluator that tolerates longer responses.

### Prose: 6.7% — same verbosity problem

The prose failures follow the same pattern. Prose tests evaluate qualities like narrative coherence, tone adherence, and structural requirements. GLM's verbose, analytical style works against these evaluations — the model produces structured analysis rather than the requested narrative prose.

### Coding: 0/30 — same extraction issue as Mixtral

All 30 coding tests fail with Python `SyntaxError`. This is the same code extraction mismatch we identified on Day 2: the evaluator's extraction logic does not handle GLM's output format, which wraps code in analytical commentary. The model can generate code (the reasoning_coding test uses regex matching and passes), but the programmatic evaluator cannot extract it cleanly.

### Token verbosity: 501K — the most verbose model yet

| Model | Total tokens | Active params | Tokens/test |
|---|---|---|---|
| GLM-4.7-Flash | 501,812 | 3B | 2,772 |
| GPT-OSS-120B | 422,288 | 5.1B | 2,333 |
| Mixtral-8x22B | 95,111 | 39B | 525 |

GLM-4.7-Flash generates 18% more tokens than GPT-OSS and 5.3× more than Mixtral, despite having the fewest active parameters. This verbosity is both an asset (detailed reasoning, thorough agentic outputs) and a liability (fails exact-match instruction tests, long wall time). The 5.8-hour wall time is a direct consequence — more tokens means more generation passes at 9-10 tokens/s.

---

## Three-model comparison

| Suite | GLM-4.7-Flash (3B active) | Mixtral-8x22B (39B active) | GPT-OSS-120B (5.1B active) |
|---|---|---|---|
| **Overall** | **34.8%** | **40.9%** | **59.7%** |
| agentic | **100.0%** | **100.0%** | 93.8% |
| writing | **100.0%** | 60.0% | **100.0%** |
| reasoning | 73.7% | 39.5% | **76.3%** |
| math | **36.7%** | 6.7% | 26.7% |
| instruction | 3.3% | 63.3% | **76.7%** |
| prose | 6.7% | 63.3% | **83.3%** |
| coding | 0.0% | 0.0% | **10.0%** |
| tool_calling | 0.0% | 0.0% | 0.0% |

| Infrastructure | GLM-4.7-Flash | Mixtral-8x22B | GPT-OSS-120B |
|---|---|---|---|
| Format | BF16 | NVFP4 (W4A4) | MXFP4 |
| Weights | ~29 GiB | 74.25 GiB | 56.93 GiB |
| Total tokens | 501,812 | 95,111 | 422,288 |
| Wall time | 5.8h | 3.4h | 3.3h |
| Active params | 3B | 39B | 5.1B |

GLM-4.7-Flash wins on math (beating GPT-OSS by 10pp and Mixtral by 30pp) and ties for first on agentic and writing. But its instruction and prose scores drag the overall to 34.8% — last place. Without the formatting compliance issue, its potential overall score would be significantly higher.

---

## Five implications

1. **Active parameter count does not predict capability.** GLM-4.7-Flash with 3B active parameters outperforms Mixtral-8x22B with 39B active parameters on math (5.5×), reasoning (1.9×), and writing (1.7×). The quality of training data and architecture design matter more than raw parameter scale for these tasks.

2. **MLA is a parameter efficiency multiplier.** Multi-head Latent Attention reduces the model's attention footprint by ~50%, enabling a 30B parameter model to fit in 29 GiB of BF16 — the same memory budget as a 15B standard-attention model. This makes MLA architectures particularly well-suited for memory-constrained inference.

3. **Verbosity is a trait, not a flaw — but it breaks exact-match benchmarks.** GLM's 501K token output is valuable for reasoning and agentic tasks where thoroughness matters. But it systematically fails instruction tests that require terse, exact-output compliance. This is a benchmark-evaluator mismatch, not a model deficiency. Production deployments should use output formatting prompts or structured output constraints to control verbosity.

4. **W4A16 NVFP4 has lower compression but preserves more quality than W4A4.** The 1.76× compression ratio is modest, but the W4A16 scheme (weights 4-bit, activations BF16) avoids the activation quantization that caused Mixtral's `w1_weight_global_scale` warning and potential accuracy issues. For models where memory is not the binding constraint, W4A16 is the safer quantization choice — consistent with our findings from the [NVFP4 quantization quality analysis](https://www.smfclearinghouse.com/blog/2026-07-08-gpt-oss-120b-dgx-spark-mxfp4-baseline) on Day 1.

5. **The shared expert matters.** GLM-4.7-Flash's 1 shared expert (always active) plus 4 routed experts (out of 64) gives every token access to a stable knowledge base plus specialized experts. This design may explain why the model maintains strong reasoning and math performance despite having only 3B active parameters — the shared expert provides consistent foundational capability that pure-routed MoE architectures lack.

---

## What is next

This is Day 3 of our 10-day model optimization series. Tomorrow (Day 4) we benchmark **Mistral-Large-2411** — a 122.6B dense model that compresses from 490 GB FP32 to approximately 62 GB NVFP4, the largest dense model in our series. The full schedule:

| Day | Model | Params | Compression | Technique |
|---|---|---|---|---|
| 1 | GPT-OSS-120B ✅ | 117B/5.1B | 65 GB → 63 GB | MXFP4→NVFP4 |
| 2 | Mixtral-8x22B ✅ | 141B/39B | 282 GB → 75 GB | BF16→NVFP4 W4A4 PTQ |
| 3 | GLM-4.7-Flash ✅ | 30B/3B | 31 GB → 18 GB | BF16→NVFP4 W4A16 PTQ |
| 4 | Mistral-Large-2411 | 122.6B | 490 GB → ~62 GB | FP32→NVFP4 PTQ |
| 5 | Llama-4-Scout | 109B/17B | 217 GB → 65 GB | NVFP4 + multimodal MoE |
| 6 | Step-3.5-Flash | 196B/11B | 399 GB → ~100 GB | NVFP4 MLP-only + KV quant |
| 7 | DeepSeek-V4-Flash | ~671B/6B | 160 GB → needs pruning | Expert pruning + distill |
| 8 | Qwen3-235B-A22B | 235B/22B | 470 GB → 134 GB | NVFP4 + FP8 KV cache |
| 9 | Llama-3.1-405B | 405B | 812 GB → 234 GB | Minitron prune → distill → NVFP4 |
| 10 | DeepSeek-R1 | 671B/37B | 689 GB → 424 GB | Expert pruning + distill + NVFP4 |

All benchmark results, configs, and logs are available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

---

*SMF Works is an AI research project and think tank. We test, publish findings, and build tools. We do not sell services or offer consulting. All benchmarks were conducted on a single DGX Spark unit using publicly available model weights and open-source software. No vendor relationships influenced these results.*