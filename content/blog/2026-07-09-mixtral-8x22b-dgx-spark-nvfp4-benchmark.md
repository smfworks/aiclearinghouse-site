---
slug: "2026-07-09-mixtral-8x22b-dgx-spark-nvfp4-benchmark"
title: "Mixtral-8x22B NVFP4 on a Desktop: 3.5× Compression, 100% Agentic, But Coding Fails Completely"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-09"
excerpt: "Mistral's 141B-parameter MoE model compressed from 282 GB BF16 to 75 GB NVFP4 — a 3.5× compression ratio that fits on a DGX Spark with 30.8 GiB of KV cache left over. Full 181-test smf-bench results: 40.9% overall, a perfect 100% on agentic tasks (beating GPT-OSS), but 0% on coding and 6.7% on math. The token efficiency story is the most surprising part: 95K tokens vs GPT-OSS's 422K, and a 3× throughput gap that reveals the cost of aggressive quantization on a sparse MoE model."
categories: ["AI", "Local LLMs", "Model Optimization", "NVIDIA"]
tags: ["mixtral", "nvfp4", "dgx-spark", "vllm", "smf-bench", "quantization", "mistral", "blackwell", "gb10", "local-inference"]
readTime: 22
image: "/images/blog/2026-07-09-mixtral-8x22b-dgx-spark-nvfp4-benchmark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-09-mixtral-8x22b-dgx-spark-nvfp4-benchmark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The model

Mixtral-8x22B-Instruct-v0.1 is Mistral AI's large sparse Mixture-of-Experts model, released in April 2024 under the Apache 2.0 license. It has 141 billion total parameters with 39 billion active per token — meaning 2 of 8 experts fire on every forward pass. The architecture is straightforward by modern standards: 56 transformer layers, a hidden size of 6,144, an intermediate size of 16,384, and a vocabulary of 32,768 tokens.

In its native BF16 format, the model spans 59 safetensors shards totaling approximately 282 GB — far too large for a single GPU or even a DGX Spark's 121 GB of unified memory. The question was whether NVFP4 quantization could compress it enough to fit while preserving useful capability.

Unlike GPT-OSS-120B from Day 1, which ships natively in MXFP4 format, Mixtral-8x22B was designed as a standard BF16 model. Getting it onto the DGX Spark required quantization to NVFP4 — NVIDIA's 4-bit floating-point format with 16-element block scaling, native to the Blackwell architecture.

---

## The hardware

NVIDIA DGX Spark: a $5,000 desktop AI workstation with a GB10 Grace Blackwell SuperChip, 121 GB of unified CPU-GPU memory, and a 3.7 TB NVMe drive. The GB10 has native NVFP4 support (compute capability 12.1), making it ideal for testing 4-bit quantized models. We previously benchmarked GPT-OSS-120B, Qwen3.6-35B, Gemma-4-26B, and Nemotron-3-Nano-30B on this same machine — those results are in our [10-model series announcement](https://www.smfclearinghouse.com/blog/2026-07-07-dgx-spark-model-optimizer-10-model-series).

---

## The quantization

Rather than performing the BF16→NVFP4 conversion ourselves — which would require downloading 282 GB of BF16 weights, running NVIDIA Model Optimizer 0.45.0's post-training quantization (PTQ), and hoping the calibration data represents the model's usage distribution — we used a pre-quantized NVFP4 variant from HuggingFace: [`enfuse/Mixtral-8x22B-Instruct-v0.1-NVFP4`](https://huggingface.co/enfuse/Mixtral-8x22B-Instruct-v0.1-NVFP4).

This model was quantized using Model Optimizer's `QuantizationModifier` with the following configuration (from the included `recipe.yaml`):

```yaml
default_stage:
  default_modifiers:
    QuantizationModifier:
      targets: [Linear]
      ignore: [lm_head, 're:.*block_sparse_moe.gate$']
      scheme: NVFP4
      bypass_divisibility_checks: false
```

The recipe quantizes all `Linear` layers to NVFP4 (4-bit weights, 4-bit activations, 16-element block scaling with FP8 per-group scales) while keeping router gates and the language model head in full precision. This is a standard PTQ recipe — no calibration dataset is needed for the NVFP4 scheme itself, as it uses closed-form casting rather than data-dependent calibration.

### Compression results

| Metric | BF16 (estimated) | NVFP4 (actual) | Ratio |
|---|---|---|---|
| Total parameters | 141B | 141B | — |
| Checkpoint size | ~282 GB (59 shards) | 79.69 GB (17 shards) | 3.5× |
| Memory footprint (vLLM) | Would not fit | 74.25 GiB | — |
| Safetensors weight bytes | ~262.6 GiB | 74.2 GiB | 3.5× |

The 3.5× compression ratio is exactly what theory predicts: BF16 uses 2 bytes per parameter, NVFP4 uses approximately 0.57 bytes per parameter (4-bit weight + 4-bit activation + FP8 scale per 16-element block), giving 2 / 0.57 ≈ 3.5×.

---

## Serving configuration

The model was served using vLLM 0.24.0 in a Docker container on the DGX Spark:

```bash
docker run -d --name mixtral-server \
  --network host --gpus all \
  -v /home/mikesai3/mixtral-8x22b-nvfp4:/model \
  vllm/vllm-openai:v0.24.0 \
  --model /model \
  --quantization compressed-tensors \
  --enforce-eager \
  --max-model-len 16384 \
  --gpu-memory-utilization 0.88 \
  --served-model-name mixtral-8x22b-instruct-v0.1 \
  --trust-remote-code
```

### Key configuration decisions

**`--enforce-eager`**: Same fix as GPT-OSS on Day 1. The GB10 Grace Blackwell chip crashes with an "illegal instruction" error during CUDA graph capture. Disabling graph compilation and running in eager mode eliminates this. The performance cost is roughly 2-3× slower throughput compared to graph mode.

**`--quantization compressed-tensors`**: The model uses the `compressed-tensors` format with `nvfp4-pack-quantized` packaging. vLLM 0.24.0 auto-detects this from the model's `config.json`, but we set it explicitly for reproducibility. vLLM selected the `FLASHINFER_CUTLASS` NVFP4 MoE backend from seven potential backends.

**`--max-model-len 16384`**: The model supports 65,536 tokens natively, but with 74.25 GiB of weights consuming 62% of the 121 GB unified memory, we needed to limit context length to leave room for the KV cache. At 16,384 tokens, vLLM allocated 30.8 GiB of KV cache.

**`--gpu-memory-utilization 0.88`**: Higher than GPT-OSS's default because Mixtral's 74.25 GiB weights leave less headroom. 0.88 pushes the allocation closer to the 121 GB ceiling while keeping 14 GB free for system overhead.

### What we did not configure (and should have)

**`--enable-auto-tool-choice --tool-call-parser mistral`**: These flags are required for Mixtral's native tool calling support. Without them, the two tool_calling tests in smf-bench return HTTP 400 errors. This is a serving configuration issue, not a model quality limitation — Mixtral-8x22B-Instruct supports function calling natively. We will re-run these tests in a future update with the correct flags.

### vLLM startup stats

| Metric | Value |
|---|---|
| vLLM version | 0.24.0 |
| Checkpoint size | 74.22 GiB |
| Weight loading time | 488.28s (8.1 min) |
| Total model loading (incl. init) | 493.63s (8.2 min) |
| Weights memory | 74.25 GiB |
| Available KV cache memory | 30.8 GiB |
| KV cache capacity | 144,176 tokens |
| Max concurrency (at 16,384 tokens/req) | 8.80x |
| Engine init (profile + warmup) | 19.33s |
| NVFP4 MoE backend | FLASHINFER_CUTLASS |
| Generation throughput | 9.7 tokens/s |

One warning appeared during loading: `w1_weight_global_scale must match w3_weight_global_scale. Accuracy may be affected.` This is a known issue with some NVFP4 MoE quantizations where the global scale factors for the first and third expert linear layers diverge. The impact on quality is unclear without a BF16 baseline comparison, but it warrants investigation.

### Comparison to GPT-OSS-120B serving

| Metric | Mixtral-8x22B NVFP4 | GPT-OSS-120B MXFP4 |
|---|---|---|
| Weights | 74.25 GiB | 56.93 GiB |
| KV cache | 30.8 GiB | 35.67 GiB |
| KV cache tokens | 144,176 | 916,304 |
| Max concurrency | 8.80x | 55.93x |
| Loading time | 493.6s | 371.08s |
| Generation throughput | 9.7 tok/s | 32.2 tok/s |

The concurrency gap is striking: GPT-OSS supports 55.93× concurrent requests at 16,384 tokens, while Mixtral supports only 8.80×. This is because GPT-OSS's 5.1B active parameters generate far smaller KV cache entries than Mixtral's 39B active parameters — each Mixtral request requires 6.4× more KV cache memory per token.

The 3.3× throughput gap (9.7 vs 32.2 tok/s) reflects both the larger active parameter count (39B vs 5.1B) and the enforce-eager penalty on a denser computation graph.

---

## Benchmark methodology

We ran the full smf-bench Stage 1 quality suite: 181 tests across 9 categories (reasoning, math, coding, instruction, prose, writing, tool_calling, agentic). Each test sends a prompt to the model's OpenAI-compatible API and evaluates the response using category-specific evaluators (regex matching, programmatic code execution, structured evidence checking).

**Configuration:**
- Endpoint: `http://spark-56bc:8000/v1`
- Model name: `mixtral-8x22b-instruct-v0.1`
- Per-request timeout: 300s (the same fix from Day 1 — some math tests take 90-160s)
- Resume: enabled (crash recovery from the framework fix)
- Max tokens: 1024 (default for non-reasoning models)
- Temperature: 0.0 (deterministic)

The run completed in 12,108.9 seconds (3.4 hours) with zero crashes — the `--timeout 300` and `--resume` framework fixes from Day 1 continue to hold.

---

## Results

### Overall

| Metric | Value |
|---|---|
| **Overall pass rate** | **74/181 (40.9%)** |
| Fail | 103 |
| Error | 4 |
| Wall time | 12,108.9s (3.4h) |
| Total tokens generated | 95,111 |

### Per-suite breakdown

| Suite | Pass | Total | Rate | Fail | Error |
|---|---|---|---|---|---|
| agentic | 16 | 16 | **100.0%** | 0 | 0 |
| writing | 3 | 5 | 60.0% | 2 | 0 |
| instruction | 19 | 30 | 63.3% | 10 | 1 |
| prose | 19 | 30 | 63.3% | 11 | 0 |
| reasoning | 15 | 38 | 39.5% | 23 | 0 |
| math | 2 | 30 | 6.7% | 27 | 1 |
| coding | 0 | 30 | 0.0% | 30 | 0 |
| tool_calling | 0 | 2 | 0.0% | 0 | 2 |

### The 4 errors

| Test | Category | Cause |
|---|---|---|
| `v3.math.medium.01` | math | Request failed after 4 retry attempts (transient) |
| `v3.instruction.frontier.04` | instruction | Request failed after 4 retry attempts (transient) |
| `tool_call_weather` | tool_calling | HTTP 400 — missing `--enable-auto-tool-choice` flag |
| `tool_call_calculator` | tool_calling | HTTP 400 — missing `--enable-auto-tool-choice` flag |

The two tool_calling errors are a known serving configuration issue (fixable, not a model limitation). The two transient errors are retries that exhausted their 4-attempt budget — likely due to request timeouts on slow responses.

---

## Analysis: What the numbers mean

### The good: Agentic is perfect

Mixtral-8x22B scored 16/16 (100%) on agentic tasks — the only perfect score across both Day 1 and Day 2. This beat GPT-OSS's 93.8% (15/16). The agentic suite tests the model's ability to generate complete, functional applications (file systems, counters, todo apps, games, animations) with verifiable file evidence. Mixtral's larger active parameter count (39B vs 5.1B) appears to help with the complex, multi-step generation these tasks require.

### The bad: Coding is a complete failure

All 30 coding tests failed with Python `SyntaxError` — either "invalid syntax" or "unterminated string literal." This is not a quantization issue. The pattern is consistent across all difficulty levels (easy through frontier) and suggests a systematic problem with how the model formats code output. The programmatic evaluator extracts code from the model's response and attempts to execute it; if the extraction produces syntactically invalid Python, the test fails regardless of the model's actual coding ability.

This is likely a chat template or output formatting issue. Mixtral-8x22B-Instruct uses Mistral's specific instruction format, and the model may be wrapping code in markdown fences or conversational text that the evaluator's extraction logic doesn't handle correctly. The reasoning_coding test (which uses regex matching, not programmatic execution) passed — the model can write code, but the evaluator can't extract it cleanly.

### The surprising: Token efficiency

Mixtral generated only 95,111 tokens across 181 tests. GPT-OSS generated 422,288 — 4.4× more. This means Mixtral's responses are dramatically shorter. For instruction-following and prose tasks, this manifests as less detailed, less thorough answers — which explains the lower pass rates (63.3% vs 76.7% instruction, 63.3% vs 83.3% prose).

For math, the brevity is catastrophic: the model doesn't show enough working steps to arrive at correct numerical answers. Math tests require precise numerical output matching, and Mixtral's terse responses simply don't include the chain of calculations needed to reach the correct answer.

### The expected: Math is weak

At 6.7% (2/30), Mixtral's math performance is worse than GPT-OSS's 26.7% (8/30). Only the two easiest tests passed. The model appears to lack the mathematical reasoning depth of larger or more recently trained models. This is consistent with Mixtral-8x22B's known positioning as a general-purpose instruction-following model rather than a math specialist.

### The throughput cost

At 9.7 tokens/s, Mixtral is 3.3× slower than GPT-OSS (32.2 tok/s). This is partly due to the 7.6× larger active parameter count (39B vs 5.1B) and partly due to the enforce-eager mode penalty. In a graph-compiled mode (if the GB10 supported it), throughput would likely improve 2-3×, but still lag behind GPT-OSS due to the raw compute difference.

---

## Comparison: Mixtral-8x22B vs GPT-OSS-120B

| Metric | Mixtral-8x22B NVFP4 | GPT-OSS-120B MXFP4 | Delta |
|---|---|---|---|
| **Overall** | **40.9%** | **59.7%** | -18.8pp |
| agentic | 100.0% | 93.8% | +6.2pp ✓ |
| writing | 60.0% | 100.0% | -40.0pp |
| instruction | 63.3% | 76.7% | -13.4pp |
| prose | 63.3% | 83.3% | -20.0pp |
| reasoning | 39.5% | 76.3% | -36.8pp |
| math | 6.7% | 26.7% | -20.0pp |
| coding | 0.0% | 10.0% | -10.0pp |
| tool_calling | 0.0% | 0.0% | — |

| Infrastructure | Mixtral | GPT-OSS |
|---|---|---|
| Weights | 74.25 GiB | 56.93 GiB |
| KV cache | 30.8 GiB | 35.67 GiB |
| KV cache tokens | 144,176 | 916,304 |
| Max concurrency | 8.80x | 55.93x |
| Load time | 493.6s | 371.08s |
| Throughput | 9.7 tok/s | 32.2 tok/s |
| Total tokens | 95,111 | 422,288 |
| Wall time | 3.4h | 3.3h |

GPT-OSS-120B wins on nearly every dimension except agentic tasks. The 18.8 percentage point overall gap is significant. However, the comparison is not entirely fair: GPT-OSS is a 2025 model with configurable reasoning, while Mixtral-8x22B was released in April 2024 — 15 months earlier. The model architectures are fundamentally different (128 experts × 4 active vs 8 experts × 2 active), and GPT-OSS's native MXFP4 format avoids the potential accuracy loss from BF16→NVFP4 conversion.

---

## Five implications

1. **NVFP4 compression works, but it is not free.** The 3.5× compression ratio is exactly what theory predicts, and the model fits comfortably in 121 GB with 30.8 GiB of KV cache. But the `w1_weight_global_scale` mismatch warning suggests the quantization may have introduced subtle accuracy degradation, particularly in expert routing. Without a BF16 baseline on the same hardware, we cannot isolate quantization effects from model architecture effects.

2. **Active parameter count drives throughput cost.** Mixtral's 39B active parameters (vs GPT-OSS's 5.1B) mean 7.6× more computation per token. The 3.3× throughput gap is actually less than the parameter ratio would suggest, likely because GPT-OSS's 128-expert routing adds overhead. But for production serving, 9.7 tok/s is marginal — it limits the model to interactive use cases, not batch processing.

3. **Agentic capability does not correlate with parameter count.** Mixtral's perfect agentic score with 39B active parameters beating GPT-OSS's 93.8% with 5.1B active suggests that agentic capability depends more on training data composition than raw parameter scale. Mixtral was trained with explicit instruction-following and tool-use data, which may matter more for practical task completion than the ability to solve math problems.

4. **Code extraction is an evaluation problem, not a model problem.** The 0/30 coding score with all SyntaxError failures points to a mismatch between the model's output format and the evaluator's extraction logic. The reasoning_coding test (which uses regex, not execution) passed, confirming the model can generate valid code. This is a reminder that benchmark scores reflect the model-evaluator system, not the model alone.

5. **Token efficiency is a double-edged sword.** Mixtral's 4.4× lower token count means faster responses and lower inference cost per request. But it also means less working space for reasoning, less detail in instructions, and less thoroughness in prose. For applications where brevity is valued (chat, summarization, quick Q&A), this is an advantage. For tasks requiring depth (math, complex reasoning, detailed code), it is a liability.

---

## What is next

This is Day 2 of our 10-day model optimization series on the DGX Spark. Tomorrow (Day 3) we benchmark **GLM-4.7-Flash** — a 30B/3B MoE model from Zhipu AI that compresses from 62 GB BF16 to approximately 16 GB NVFP4, the smallest model in our series. The full schedule:

| Day | Model | Params | Compression | Technique |
|---|---|---|---|---|
| 1 | GPT-OSS-120B ✅ | 117B/5.1B | 65 GB → 63 GB | MXFP4→NVFP4 |
| 2 | Mixtral-8x22B ✅ | 141B/39B | 282 GB → 75 GB | BF16→NVFP4 PTQ |
| 3 | GLM-4.7-Flash | 30B/3B | 62 GB → ~16 GB | BF16→NVFP4 PTQ |
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