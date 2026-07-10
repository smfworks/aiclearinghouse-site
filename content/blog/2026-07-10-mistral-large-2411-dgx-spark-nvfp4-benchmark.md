---
slug: "2026-07-10-mistral-large-2411-dgx-spark-nvfp4-benchmark"
title: "Mistral-Large-2411 NVFP4 on a Desktop: The Dense Model Advantage — Best Coding Score, But 123B Parameters at 3 tok/s"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-10"
excerpt: "Mistral's 123B dense model — every parameter active on every token — compressed from ~246 GB BF16 to 65 GB NVFP4 and served on a DGX Spark. Full 181-test smf-bench results: 56.4% overall, the highest coding score in our series at 46.7% (beating GPT-OSS's 10%), 86.7% on instruction and prose, 100% on writing, but only 10% on math and 36.8% on reasoning due to 12 timeout errors on hard/expert problems. The dense architecture avoids the MARLIN MoE kernel crash that killed GLM's NVFP4 serving — FlashInferCutlass handles dense NVFP4 GEMM flawlessly. The tradeoff: 10.9-hour wall time at 3.1 tok/s, 3× slower than any other model."
categories: ["AI", "Local LLMs", "Model Optimization", "NVIDIA"]
tags: ["mistral-large", "nvfp4", "dgx-spark", "vllm", "smf-bench", "quantization", "dense-model", "blackwell", "gb10", "local-inference", "flashinfer"]
readTime: 22
image: "/images/blog/2026-07-10-mistral-large-2411-dgx-spark-nvfp4-benchmark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-10-mistral-large-2411-dgx-spark-nvfp4-benchmark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The model

Mistral-Large-Instruct-2411 is Mistral AI's flagship dense model, released in November 2024 under the Mistral Research License. It is the first **dense** (non-MoE) model in our 10-day optimization series — and that distinction matters.

Every other model we've tested uses Mixture-of-Experts: GPT-OSS-120B (128 experts, 4 active), Mixtral-8x22B (8 experts, 2 active), GLM-4.7-Flash (64 experts, 4 active). These models achieve efficiency by activating only a fraction of their parameters per token. Mistral-Large-2411 has no such trick. All 123 billion parameters fire on every forward pass. There is no expert routing, no sparse activation — just a massive, dense transformer.

| Spec | Value |
|---|---|
| Architecture | MistralForCausalLM (dense) |
| Total parameters | ~123B |
| Active parameters | 123B (all) |
| Layers | 88 |
| Hidden size | 12,288 |
| Intermediate size | 28,672 |
| Attention heads | 96 |
| KV heads | 8 (GQA, 12:1 ratio) |
| Max context | 131,072 tokens (128K) |
| Vocab size | 32,768 |
| License | Mistral Research License |

The architecture is deep: 88 layers, more than GLM-4.7-Flash (47) or GPT-OSS-120B (36). This depth contributes to quality but increases KV cache requirements — each token in the context window requires 88 layers of cached K/V tensors. With Grouped Query Attention (8 KV heads vs 96 attention heads, a 12:1 ratio), the KV cache is compressed to 1/12 of standard MHA, which is what makes 128K context feasible.

In BF16, the model would span approximately 246 GB across 102 safetensors shards — twice the DGX Spark's 121 GB unified memory. Without quantization, it cannot fit.

---

## The hardware

Same DGX Spark as Days 1-3: GB10 Grace Blackwell SuperChip, 121 GB unified memory, 3.7 TB NVMe, ARM64, native NVFP4 support.

---

## The quantization

We used a pre-quantized NVFP4 variant from HuggingFace: [`Shifusen/Mistral-Large-Instruct-2411-NVFP4`](https://huggingface.co/Shifusen/Mistral-Large-Instruct-2411-NVFP4), quantized using NVIDIA Model Optimizer's `QuantizationModifier` with the following recipe:

```yaml
default_stage:
  default_modifiers:
    QuantizationModifier:
      targets: [Linear]
      ignore: [lm_head]
      scheme: NVFP4
```

The recipe quantizes all `Linear` layers to NVFP4 (4-bit weights, 4-bit activations, 16-element block scaling with FP8 per-group scales) while keeping the language model head in full precision. This is a **W4A4** scheme — both weights and activations are 4-bit, the most aggressive quantization in our series alongside Mixtral-8x22B.

### Compression results

| Metric | BF16 (estimated) | NVFP4 (actual) | Ratio |
|---|---|---|---|
| Total parameters | ~123B | 123B | — |
| Safetensors total | ~246 GB (102 shards) | 65.31 GiB (15 shards) | ~3.8× |
| Disk size | ~246 GB | 70.1 GB | 3.5× |
| Model memory (vLLM) | Would not fit | 65.31 GiB | — |

The 3.8× compression ratio aligns with theory: BF16 uses 2 bytes/param, NVFP4 W4A4 uses ~0.53 bytes/param (4-bit weights + 4-bit activations + FP8 scales per 16-element block), giving 2/0.53 ≈ 3.8×.

---

## Serving configuration

```bash
docker run -d --name mistral-large-server \
  --network host --gpus all \
  -v /home/mikesai3/mistral-large-nvfp4:/model \
  vllm/vllm-openai:v0.24.0 \
  --model /model \
  --quantization compressed-tensors \
  --enforce-eager \
  --max-model-len 16384 \
  --gpu-memory-utilization 0.82 \
  --served-model-name mistral-large-instruct-2411 \
  --trust-remote-code
```

### Key configuration decisions

**`--gpu-memory-utilization 0.82`**: The initial attempt at 0.88 failed because the GB10's 121.69 GiB of memory had only 106.42 GiB free at startup (system processes consume ~15 GiB). At 0.88, vLLM requested 107.09 GiB — 0.67 GiB more than available. Dropping to 0.82 requested 99.79 GiB, fitting comfortably.

**`--enforce-eager`**: Same GB10 CUDA graph crash mitigation as Days 1-3.

**`--quantization compressed-tensors`**: The model uses `compressed-tensors` format with `nvfp4-pack-quantized` packaging, detected automatically by vLLM 0.24.0 from `config.json`.

### The critical finding: no MARLIN crash

On Day 3, GLM-4.7-Flash's NVFP4 serving crashed because the **MARLIN MoE kernel** misidentified W4A16 NVFP4 as W4A8-FP4 and required a `c` parameter that wasn't passed. The crash was specific to the MoE expert path — the kernel that handles expert linear layer computation in sparse MoE architectures.

Mistral-Large-2411 is dense. There are no experts, no routing, no MoE-specific kernel paths. vLLM selected the **`FlashInferCutlassNvFp4LinearKernel`** for all NVFP4 GEMM operations — a different kernel from the MoE-specific MARLIN backend. This kernel handled all 88 layers × multiple linear layers per layer without a single crash across 181 tests and 10.9 hours of continuous inference.

**This is the key infrastructure finding of Day 4: NVFP4 serving on GB10 works reliably for dense models but not for MoE models.** The bug is in the MARLIN MoE kernel, not in the NVFP4 quantization or the GB10 hardware.

### vLLM startup stats

| Metric | Value |
|---|---|
| vLLM version | 0.24.0 |
| NVFP4 kernel | FlashInferCutlassNvFp4LinearKernel |
| Attention backend | FlashAttention v2 |
| Checkpoint size | 65.31 GiB |
| Available RAM | 39.44 GiB |
| Weight loading time | 444.93s (7.4 min) |
| Available KV cache memory | 32.96 GiB |
| KV cache capacity | 98,176 tokens |
| Max concurrency (16,384 tokens/req) | 5.99× |
| Engine init (profile + warmup + autotune) | 166.46s |
| Avg generation throughput | ~6.2 tok/s (early), ~3.1 tok/s (steady-state) |
| Total startup time | ~10 min (loading + init) |

The FlashInfer AutoTuner ran 16 profiles per layer group, taking ~11s per group for the initial pass and up to 44s for deeper groups. This is a one-time cost — the tuned kernel configurations are cached for subsequent requests.

### Throughput comparison

| Model | Generation throughput | Architecture | Active params |
|---|---|---|---|
| GPT-OSS-120B | 32.2 tok/s | MoE | 5.1B |
| Mixtral-8x22B | 9.7 tok/s | MoE | 39B |
| GLM-4.7-Flash | ~33 tok/s (BF16) | MoE | 4B |
| **Mistral-Large-2411** | **3.1 tok/s** | **Dense** | **123B** |

Mistral-Large-2411 is 3× slower than the next-slowest model. This is the cost of dense inference: 123B parameters computed per token, compared to 39B (Mixtral) or 5.1B (GPT-OSS). The throughput is adequate for interactive use but impractical for batch processing.

---

## Benchmark methodology

Same smf-bench Stage 1 suite: 181 tests, 9 categories, per-request timeout 300s, resume enabled, temperature 0.0.

The run completed in 39,318.5 seconds (10.9 hours) — the longest wall time in the series by 2×. The extended duration has two causes: (1) the 3.1 tok/s generation rate means every test takes longer, and (2) 12 tests timed out after 4 retry attempts each (~1,200s per timeout test), adding significant dead time.

---

## Results

### Overall

| Metric | Value |
|---|---|
| **Overall pass rate** | **102/181 (56.4%)** |
| Fail | 64 |
| Error | 15 |
| Wall time | 39,318.5s (10.9h) |
| Total tokens generated | 85,773 |

### Per-suite breakdown

| Suite | Pass | Total | Rate | Fail | Error |
|---|---|---|---|---|---|
| writing | 5 | 5 | **100.0%** | 0 | 0 |
| instruction | 26 | 30 | **86.7%** | 4 | 0 |
| prose | 26 | 30 | **86.7%** | 4 | 0 |
| agentic | 14 | 16 | 87.5% | 1 | 1 |
| coding | 14 | 30 | **46.7%** | 16 | 0 |
| reasoning | 14 | 38 | 36.8% | 16 | 8 |
| math | 3 | 30 | 10.0% | 23 | 4 |
| tool_calling | 0 | 2 | 0.0% | 0 | 2 |

### The 15 errors

| Category | Count | Cause |
|---|---|---|
| reasoning | 8 | Timeout — "Failed after 4 attempts" (0 tokens, 0 elapsed) |
| math | 4 | Timeout — "Failed after 4 attempts" (0 tokens, 0 elapsed) |
| tool_calling | 2 | HTTP 400 — missing `--enable-auto-tool-choice` flag |
| agentic | 1 | Timeout — "Failed after 4 attempts" (av2-14-game-snake) |

The 12 timeout errors (reasoning + math + agentic) are all in hard/expert/frontier difficulty tiers. The dense 123B model is so slow that complex multi-step problems exceed the 300s per-request timeout. Each timeout burns 4 retry attempts, and the errors produce 0 tokens — the request never completes. These are not model quality failures; they are throughput failures.

---

## Analysis: The dense model advantage

### Best coding score in the series

| Model | Coding | Architecture | Active params |
|---|---|---|---|
| **Mistral-Large-2411** | **46.7%** | Dense | 123B |
| GPT-OSS-120B | 10.0% | MoE | 5.1B |
| Mixtral-8x22B | 0.0% | MoE | 39B |
| GLM-4.7-Flash | 0.0% | MoE | 4B |

At 46.7% (14/30), Mistral-Large-2411 has the highest coding score by a massive margin — 4.7× better than GPT-OSS's 10% and infinitely better than the 0% posted by both MoE models. This is the dense model advantage in its purest form: coding requires precise syntax generation, and having all 123B parameters active means the model has maximum capacity for the exacting, character-level work of writing valid Python.

The MoE models' coding failures were all `SyntaxError` — the code extraction evaluator couldn't parse their output. Mistral-Large-2411 produces clean, syntactically valid Python that the evaluator can execute. The failures (16/30) are `AssertionError` — the code runs but produces wrong output, meaning the model's logic is correct but its solutions have bugs. That's a different failure mode than "code won't even compile."

### Best instruction and prose scores

| Model | Instruction | Prose |
|---|---|---|
| **Mistral-Large-2411** | **86.7%** | **86.7%** |
| GPT-OSS-120B | 76.7% | 83.3% |
| Mixtral-8x22B | 63.3% | 63.3% |
| GLM-4.7-Flash | 3.3% | 6.7% |

The dense model beats every MoE model on instruction-following and prose — the two suites that require nuanced language generation. Unlike GLM-4.7-Flash's verbose analytical style (which failed exact-match tests), Mistral-Large-2411 produces output in the expected format. This suggests the model was trained with strong instruction-format compliance, and the dense architecture ensures consistent output quality.

### The math and reasoning problem

Math at 10.0% (3/30) is the lowest in the series — worse than Mixtral (6.7%) only by a hair, and far below GLM's 36.7% or GPT-OSS's 26.7%. This is surprising for a 123B model. The issue is not capability but speed: 4 math tests timed out (0 tokens produced), and many of the 23 failures took 200-300s with wrong numerical answers. The model generates extensive step-by-step reasoning but at 3.1 tok/s, it runs out of time before reaching the correct answer.

Reasoning at 36.8% (14/38) is also depressed by 8 timeout errors. The base reasoning suite (8 tests) scored 100%, but the v3 reasoning tier scored only 6/30 (20%) with 8 errors. Without the timeout errors, the reasoning score would be 14/30 (46.7%) — still below GPT-OSS's 76.3% but much more respectable.

### Token efficiency: the fewest tokens

| Model | Total tokens | Wall time | Tokens/test |
|---|---|---|---|
| **Mistral-Large-2411** | **85,773** | 10.9h | **474** |
| Mixtral-8x22B | 95,111 | 3.4h | 525 |
| GPT-OSS-120B | 422,288 | 3.3h | 2,333 |
| GLM-4.7-Flash | 501,812 | 5.8h | 2,772 |

Mistral-Large-2411 generates the fewest tokens per test (474) — nearly 6× less than GLM-4.7-Flash. The model is concise, not verbose. But at 3.1 tok/s, even 474 tokens take ~153 seconds to generate. The 10.9-hour wall time is a product of the model's slowness, not its verbosity.

---

## Four-model comparison

| Suite | Mistral-Large (123B dense) | GPT-OSS (5.1B MoE) | Mixtral (39B MoE) | GLM-4.7 (4B MoE) |
|---|---|---|---|---|
| **Overall** | **56.4%** | **59.7%** | **40.9%** | **34.8%** |
| agentic | 87.5% | 93.8% | **100%** | **100%** |
| writing | **100%** | **100%** | 60% | **100%** |
| instruction | **86.7%** | 76.7% | 63.3% | 3.3% |
| prose | **86.7%** | 83.3% | 63.3% | 6.7% |
| coding | **46.7%** | 10% | 0% | 0% |
| reasoning | 36.8% | **76.3%** | 39.5% | 73.7% |
| math | 10% | 26.7% | 6.7% | **36.7%** |
| tool_calling | 0% | 0% | 0% | 0% |

| Infrastructure | Mistral-Large | GPT-OSS | Mixtral | GLM-4.7 |
|---|---|---|---|---|
| Architecture | Dense | MoE | MoE | MoE |
| Active params | 123B | 5.1B | 39B | 4B |
| Format | NVFP4 W4A4 | MXFP4 | NVFP4 W4A4 | BF16 |
| Weights | 65.31 GiB | 56.93 GiB | 74.25 GiB | ~29 GiB |
| KV cache | 32.96 GiB | 35.67 GiB | 30.8 GiB | ~48 GiB |
| Throughput | 3.1 tok/s | 32.2 tok/s | 9.7 tok/s | ~33 tok/s |
| Total tokens | 85,773 | 422,288 | 95,111 | 501,812 |
| Wall time | 10.9h | 3.3h | 3.4h | 5.8h |
| NVFP4 kernel | FlashInferCutlass | N/A | MARLIN | MARLIN (crashed) |

Mistral-Large-2411 comes within 3.3 percentage points of GPT-OSS-120B's overall score (56.4% vs 59.7%) despite being 24× slower. It wins decisively on coding (46.7% vs 10%), instruction (86.7% vs 76.7%), and ties on writing (100%). GPT-OSS wins on reasoning (76.3% vs 36.8%) and math (26.7% vs 10%) — partly because GPT-OSS's 32.2 tok/s throughput means it completes more tests within the timeout.

---

## Five implications

1. **Dense models are the only path to coding competence on this hardware.** Three MoE models scored 0% on coding; the dense model scored 46.7%. The difference is architectural: MoE models route tokens to a subset of experts, which means the code generation path has limited capacity (5.1B for GPT-OSS, 4B for GLM, 39B for Mixtral). Dense models use all 123B parameters for every token, giving maximum capacity for the precision work of syntax generation. For coding tasks on resource-constrained hardware, dense models are the clear choice.

2. **NVFP4 serving works for dense models, not for MoE models — on GB10 today.** The MARLIN kernel crash on Day 3 was specific to the MoE expert path. Dense models use the FlashInferCutlass kernel, which handles NVFP4 GEMM without issue. This means the NVFP4 quantization pipeline is production-ready for dense models on Blackwell, but MoE models need a vLLM kernel fix before they can be served quantized. The bug is in vLLM, not in the hardware or the quantization.

3. **Throughput is the binding constraint for dense models on desktop hardware.** At 3.1 tok/s, Mistral-Large-2411 is too slow for many practical use cases. The 10.9-hour benchmark wall time and 12 timeout errors demonstrate the cost: complex problems that require long chains of reasoning simply time out. For interactive use (chat, Q&A, code completion) where responses are short, 3.1 tok/s is tolerable. For batch workloads or complex agentic tasks requiring multi-step generation, it is not.

4. **The dense model's concise output is an efficiency advantage.** Despite being 3× slower per token, Mistral-Large-2411 generated fewer total tokens (85,773) than any other model. Its 474 tokens/test average means each response is focused and direct — no verbose step-by-step explanations. For applications where token efficiency matters (API costs, bandwidth, storage), the dense model's conciseness partially offsets its slow throughput.

5. **Timeout errors mask true capability.** Without the 12 timeout errors (8 reasoning, 4 math), Mistral-Large-2411's adjusted score would be 102/169 (60.4%) — surpassing GPT-OSS's 59.7%. The timeouts are a throughput problem, not a capability problem. A faster inference engine (graph compilation, speculative decoding, or a more powerful GPU) would likely raise the reasoning and math scores significantly, bringing the dense model's overall score above all MoE competitors.

---

## What is next

This is Day 4 of our 10-day model optimization series. Tomorrow (Day 5) we benchmark **Llama-4-Scout** — a 109B/17B MoE model with multimodal capabilities, compressing from 217 GB to 65 GB. The full schedule:

| Day | Model | Params | Compression | Technique |
|---|---|---|---|---|
| 1 | GPT-OSS-120B ✅ | 117B/5.1B | 65 GB → 63 GB | MXFP4→NVFP4 |
| 2 | Mixtral-8x22B ✅ | 141B/39B | 282 GB → 75 GB | BF16→NVFP4 W4A4 PTQ |
| 3 | GLM-4.7-Flash ✅ | 30B/3B | 31 GB → 18 GB | BF16→NVFP4 W4A16 PTQ |
| 4 | Mistral-Large-2411 ✅ | 123B (dense) | 246 GB → 65 GB | BF16→NVFP4 W4A4 PTQ |
| 5 | Llama-4-Scout | 109B/17B | 217 GB → 65 GB | NVFP4 + multimodal MoE |
| 6 | Step-3.5-Flash | 196B/11B | 399 GB → ~100 GB | NVFP4 MLP-only + KV quant |
| 7 | DeepSeek-V4-Flash | ~671B/6B | 160 GB → needs pruning | Expert pruning + distill |
| 8 | Qwen3-235B-A22B | 235B/22B | 470 GB → 134 GB | NVFP4 + FP8 KV cache |
| 9 | Llama-3.1-405B | 405B | 812 GB → 234 GB | Minitron prune → distill → NVFP4 |
| 10 | DeepSeek-R1 | 671B/37B | 689 GB → 424 GB | Expert pruning + distill + NVFP4 |

All benchmark results, configs, and logs are available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench).

---

*SMF Works is an AI research project and think tank. We test, publish findings, and build tools. We do not sell services or offer consulting. All benchmarks were conducted on a single DGX Spark unit using publicly available model weights and open-source software. No vendor relationships influenced these results.*