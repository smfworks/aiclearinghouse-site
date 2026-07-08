---
slug: "2026-07-08-mixtral-8x22b-dgx-spark-nvfp4-deep-dive"
title: "Mixtral-8x22B at NVFP4 on a Desktop: The Agentic Paradox — 100% on Apps, 0% on Code"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-08"
excerpt: "Mistral's 141B-parameter MoE pioneer, compressed from 281 GB to 74 GB with NVFP4 4-bit quantization, running on a $5K DGX Spark. The full 181-test smf-bench results reveal a model that builds working Pong and Snake games from scratch (100% agentic) yet cannot pass a single basic coding syntax test (0%). Overall: 40.9% — below GPT-OSS's 59.7%. The reason is a W4A4 quantization artifact, a global scale mismatch, and a token generation gap that tells the real story."
categories: ["AI", "Local LLMs", "Model Optimization", "NVIDIA"]
tags: ["mixtral-8x22b", "nvfp4", "dgx-spark", "vllm", "smf-bench", "quantization", "mistral-ai", "blackwell", "gb10", "local-inference", "moe"]
readTime: 22
image: "/images/blog/2026-07-08-mixtral-8x22b-dgx-spark-nvfp4-deep-dive.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-08-mixtral-8x22b-dgx-spark-nvfp4-deep-dive"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The model

Mixtral-8x22B-Instruct-v0.1 needs no introduction. Released by Mistral AI in April 2024, it became *the* benchmark against which all subsequent mixture-of-experts models were measured. With 141 billion total parameters and 39 billion active per token (8 experts, 2 active), it delivers frontier-class quality while keeping inference costs closer to a 39B dense model than a 141B one.

At BF16, it weighs 281.3 GB across 47 safetensors shards — far too large for a desktop. At NVFP4, NVIDIA's native 4-bit floating-point format for the Blackwell architecture, it should compress to roughly 70 GB. On the DGX Spark's 121 GB unified memory, that leaves room for a meaningful KV cache.

But here's the twist: when we planned this series, no NVFP4 quantization of Mixtral-8x22B existed anywhere — not from NVIDIA, not from Mistral, not from anyone. We intended to do it ourselves with Model Optimizer 0.45.0. Then we found `enfuse/Mixtral-8x22B-Instruct-v0.1-NVFP4` on HuggingFace — a community-produced NVFP4 quantization. We used it, and the results raise important questions about quantization quality that go beyond simple file size.

---

## The optimization challenge

### What we found vs. what we expected

The model list for this series assumed a W4A16 (weight-only) NVFP4 quantization — 4-bit weights, 16-bit activations. That's the conservative path: less aggressive, better quality retention, and what Model Optimizer's `--qformat w4a16_nvfp4` flag produces.

The enfuse quantization is **W4A4** — both weights *and* activations are quantized to 4-bit float. This is significantly more aggressive. The `config.json` confirms it:

```json
"quantization_config": {
  "format": "nvfp4-pack-quantized",
  "config_groups": {
    "group_0": {
      "format": "nvfp4-pack-quantized",
      "targets": ["Linear"],
      "weights": {
        "num_bits": 4,
        "type": "float",
        "group_size": 16,
        "strategy": "tensor_group",
        "scale_dtype": "torch.float8_e4m3fn",
        "symmetric": true
      },
      "input_activations": {
        "num_bits": 4,
        "type": "float",
        "group_size": 16,
        "dynamic": "local",
        "scale_dtype": "torch.float8_e4m3fn",
        "symmetric": true
      }
    }
  },
  "ignore": ["lm_head", "re:.*block_sparse_moe.gate$"]
}
```

The `recipe.yaml` in the model directory tells the same story:

```yaml
default_stage:
  default_modifiers:
    QuantizationModifier:
      targets: [Linear]
      ignore: [lm_head, 're:.*block_sparse_moe.gate$']
      scheme: NVFP4
```

Both weights and input activations are 4-bit float (NVFP4), grouped in blocks of 16, with FP8 (e4m3fn) per-group scales. The MoE router gates and the LM head are kept at full precision — standard practice to preserve routing fidelity.

W4A4 is the format the GB10 chip is built for: native NVFP4 tensor cores can compute W4A4 GEMMs directly without dequantizing activations. It maximizes memory bandwidth savings and inference speed. But it comes at a cost: quantizing activations introduces error at every layer, not just at the weight-loading stage. For a 56-layer model, those errors compound.

### The compression

| Metric | BF16 | NVFP4 (W4A4) | Reduction |
|--------|------|--------------|-----------|
| File size | 281.3 GB (47 shards) | 74.22 GiB (17 shards) | **73.6%** |
| Weights in VRAM | ~281 GB | 74.22 GiB | 73.6% |
| Active params/token | 39B | ~5.5B effective | — |

The 281 GB → 74 GB compression makes Mixtral-8x22B fit comfortably within the DGX Spark's 121 GB unified memory, with 47 GB headroom for KV cache and serving overhead.

### The warning we can't ignore

When vLLM loaded this model, it emitted a warning that turned out to be prophetic:

```
WARNING [compressed_tensors_moe_w4a4_nvfp4.py:193]
  w1_weight_global_scale must match w3_weight_global_scale.
  Accuracy may be affected.
```

In Mixtral's MoE architecture, each of the 8 experts per layer has three projections: w1 (gate), w3 (up), and w2 (down). The w1 and w3 projections feed into the SwiGLU activation — they share the same input and should share the same global activation scale. When they don't match, the gate and up projections receive inconsistent scaling, distorting the expert's output. This mismatch is a quantization artifact, not a model design choice. "Accuracy may be affected" is vLLM's polite way of saying "expect quality degradation."

As we'll see in the benchmark results, the degradation is real and measurable.

---

## Serving setup

### vLLM configuration

We served the model with vLLM 0.24.0 in a Docker container on the DGX Spark:

```bash
docker run --name mixtral-server --network host --gpus all \
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

Key flags and why they matter:

- **`--quantization compressed-tensors`**: Tells vLLM to use the compressed-tensors backend, which auto-detects NVFP4 format via the `CompressedTensorsW4A4Fp4` class. vLLM selected the `FLASHINFER_CUTLASS` MoE backend — the fastest available NVFP4 kernel on Blackwell.
- **`--enforce-eager`**: Disables CUDA graph capture. The GB10 chip crashes during graph capture with NVFP4 MoE models (a known issue from Day 1 with GPT-OSS). Eager mode is slower per-token but doesn't crash.
- **`--max-model-len 16384`**: Matches the Day 1 GPT-OSS configuration for fair comparison. Mixtral supports 65,536 natively, but 16K leaves maximum room for KV cache.
- **`--gpu-memory-utilization 0.88`**: 74 GB weights in 121 GB unified memory; 0.88 allocates ~106 GB to vLLM, leaving ~15 GB for the OS and Docker overhead.

### Loading and memory stats

| Metric | Value |
|--------|-------|
| Checkpoint size | 74.22 GiB |
| Available RAM | 37.24 GiB |
| Shards | 17 (≈32s per shard) |
| Startup to ready | 539s (9.0 min) |
| Available KV cache | 30.8 GiB |
| KV cache tokens | 144,176 |
| Max concurrency (16K ctx) | 8.80× |
| MoE backend | FLASHINFER_CUTLASS |
| Generation throughput | ~9.5–9.7 tokens/s |

The 9-minute startup is longer than GPT-OSS's ~5 minutes, driven by the 17-shard checkpoint at 32s per shard. The available RAM (37.24 GiB) is less than the checkpoint size (74.22 GiB), so vLLM disabled auto-prefetch — shards are loaded sequentially from disk.

The 30.8 GiB KV cache with 144,176 token capacity gives 8.80× concurrency at 16K context — meaning vLLM can handle 8 concurrent requests before queuing. For our sequential benchmark, this is more than sufficient.

Generation throughput of ~9.5 tokens/s is steady across the entire run — the model maintains consistent decode speed regardless of output length.

---

## Benchmark results

We ran the full 181-test smf-bench suite across 8 categories and 5 difficulty tiers, with a 300-second timeout per test and crash-recovery resume enabled. The benchmark ran for 3.36 hours.

### Headline numbers

| Metric | Value |
|--------|-------|
| **Overall pass rate** | **74/181 (40.9%)** |
| Passed | 74 |
| Failed | 103 |
| Errors | 4 |
| Wall time | 12,108.9s (3.36h) |
| Total tokens generated | 95,111 |
| Avg latency per test | 36.9s |
| Slowest test | v3.math.frontier.05 — 159.4s |
| Reasoning model | No |

### Suite-by-suite breakdown

| Suite | Pass | Fail | Error | Rate |
|-------|------|------|-------|------|
| **Agentic** | 16 | 0 | 0 | **100.0%** ✅ |
| Instruction | 19 | 10 | 1 | 63.3% |
| Prose | 19 | 11 | 0 | 63.3% |
| Writing | 3 | 2 | 0 | 60.0% |
| Reasoning | 15 | 23 | 0 | 39.5% |
| Math | 2 | 27 | 1 | 6.7% |
| Coding | 0 | 30 | 0 | **0.0%** ❌ |
| Tool calling | 0 | 0 | 2 | 0.0% (HTTP 400) |

### The agentic paradox

Here's what makes these results fascinating: Mixtral-8x22B scored **100% on the agentic suite (16/16)** — building fully working applications from natural language descriptions. It created a Pong game with ball physics and collision detection. A Snake game with grid-based movement and food spawning. A counter app. A TODO list manager. A CSV filter. A bug-fix patch. Every single agentic test produced working, executable Python code.

Yet on the coding suite — which tests basic Python syntax, function definitions, and algorithm implementation — it scored **0% (0/30)**. Every coding test failed with `SyntaxError: invalid syntax` or `SyntaxError: unterminated string literal`.

How can a model build a working Pong game but fail to write a valid function definition? The answer lies in the difference between the two test types:

- **Agentic tests** are multi-turn. The model writes code, the test harness executes it, and if there's an error, the model gets feedback and can iterate. The model's initial code may have syntax errors, but the agentic loop lets it self-correct.
- **Coding tests** are single-shot. The model gets one prompt and must produce syntactically correct code in a single generation. No feedback, no retries, no iteration.

This means Mixtral's NVFP4 quantization degrades single-shot code generation quality — the model produces broken syntax on first attempt — but its instruction-following and self-correction capabilities remain intact when given a feedback loop. The agentic suite's iterative nature masks the quantization damage that the coding suite exposes.

### The reasoning cliff

The reasoning suite has 38 tests across 5 difficulty tiers. Mixtral passed the first 8 tests (the easiest tier) at 100% — knowledge recall, basic instruction-following, and world-knowledge questions. Then the results fall off a cliff:

- **Tier 1 (easy):** ~100% pass rate
- **Tiers 2–5 (medium to frontier):** 7/30 pass rate (~23%)

The model handles factual recall and simple reasoning adequately. But multi-step logical deduction, analogical reasoning, and frontier-difficulty abstract problems are where the W4A4 quantization damage becomes visible. The activation quantization error compounds across 56 layers, degrading the model's ability to maintain coherent reasoning chains.

### The math collapse

Math is where the model performs worst among non-trivial suites: 2/30 (6.7%). Only the two easiest math tests passed — basic arithmetic at tier 1. Every tier 2+ math test failed. The model either produced wrong answers or generated truncated reasoning that didn't reach a conclusion.

This is worse than GPT-OSS's 26.7% math pass rate — a model that also struggled with math but at least solved 8/30 problems. Mixtral's 95,111 total tokens (vs. GPT-OSS's 422,288) tell the story: the model generates 4.4× fewer tokens, meaning it produces less step-by-step reasoning. For math, where showing your work is essential, shorter outputs correlate directly with wrong answers.

### The token generation gap

The most revealing single number in this benchmark: **95,111 tokens**.

| Model | Total tokens | Tests | Tokens/test |
|-------|-------------|-------|-------------|
| GPT-OSS-120B | 422,288 | 181 | 2,333 |
| Mixtral-8x22B-NVFP4 | 95,111 | 181 | 525 |

Mixtral generated 4.4× fewer tokens than GPT-OSS across the same 181 tests. This isn't a speed issue — both models ran for ~3.3 hours. Mixtral's throughput was a steady ~9.5 tokens/s. The model simply chose to generate less.

This could be the W4A4 quantization making the model's output distribution "sharper" — more confident, less verbose, terminating generation earlier. Or it could be the `w1_weight_global_scale` mismatch distorting the SwiGLU activation and producing degraded token probabilities that trigger the EOS token sooner.

Either way, the practical effect is clear: shorter responses mean less reasoning, less code, less explanation — and lower scores on every suite that rewards thoroughness.

### Tool calling: a vLLM limitation, not a model failure

Both tool-calling tests returned HTTP 400 errors. This is not a Mixtral issue — GPT-OSS had the same problem. The vLLM OpenAI-compatible server doesn't support `"tool_choice": "auto"` for compressed-tensors models. This is a serving-layer limitation that affects all models in this series equally, not a model quality indicator.

---

## Head-to-head: Mixtral vs. GPT-OSS

| Suite | Mixtral-8x22B NVFP4 | GPT-OSS-120B MXFP4 | Delta |
|-------|---------------------|---------------------|-------|
| **Overall** | 40.9% | 59.7% | −18.8 pp |
| Agentic | **100.0%** | 93.8% | +6.2 pp ✅ |
| Instruction | 63.3% | 76.7% | −13.4 pp |
| Prose | 63.3% | 83.3% | −20.0 pp |
| Writing | 60.0% | 100% | −40.0 pp |
| Reasoning | 39.5% | 76.3% | −36.8 pp |
| Math | 6.7% | 26.7% | −20.0 pp |
| Coding | 0.0% | 10.0% | −10.0 pp |
| Tool calling | 0% | 0% | tie |
| Tokens | 95K | 422K | −77.5% |
| Wall time | 3.36h | 3.30h | +0.06h |

Mixtral wins on exactly one suite: **agentic (+6.2 pp)**. It loses on every other category. The 18.8-percentage-point overall gap is the largest between any two models we've benchmarked on the DGX Spark.

The critical insight: GPT-OSS ships natively in MXFP4 and was converted to NVFP4 via a bit-exact closed-form transform (no quality loss). Mixtral was quantized from BF16 to W4A4 NVFP4 through a calibration-based PTQ process — a lossy transformation. The quality gap reflects the difference between a lossless format conversion and a lossy quantization, not the difference between the two architectures.

---

## All six models ranked

| Rank | Model | Overall | Agentic | Coding | Math | Reasoning |
|------|-------|---------|---------|--------|------|-----------|
| 1 | Gemma-4-26B (NVFP4) | 84.0% | 93.8% | 93.3% | 50.0% | 94.7% |
| 2 | Qwen3.6-35B (NVFP4) | 71.3% | 87.5% | 63.3% | 53.3% | 81.6% |
| 3 | Nemotron-3-Super-120B | 69.6% | 50.0% | 73.3% | 40.0% | 76.3% |
| 4 | GPT-OSS-120B (NVFP4) | 59.7% | 93.8% | 10.0% | 26.7% | 76.3% |
| 5 | Nemotron-3-Nano-30B | 54.7% | 43.8% | 73.3% | 30.0% | 65.8% |
| **6** | **Mixtral-8x22B (NVFP4)** | **40.9%** | **100.0%** | **0.0%** | **6.7%** | **39.5%** |

Mixtral-8x22B lands at the bottom of the table — the lowest overall score in our benchmark series. But it also has the highest single-suite score: 100% agentic, tied with nothing. It's the most extreme profile of any model we've tested: brilliant at iterative application building, broken at single-shot code generation.

---

## Architecture details

For those who want the full picture:

| Spec | Value |
|------|-------|
| Architecture | MixtralForCausalLM |
| Hidden size | 6,144 |
| Intermediate size | 16,384 |
| Layers | 56 |
| Attention heads | 48 |
| KV heads | 8 (GQA, 6:1 ratio) |
| Experts | 8 (local) |
| Experts per token | 2 |
| Vocab size | 32,768 |
| Max position embeddings | 65,536 |
| dtype | bfloat16 (compute) |
| Quantization | NVFP4 W4A4, group_size 16, FP8 scales |
| Quant targets | All `Linear` layers |
| Quant ignored | `lm_head`, all `block_sparse_moe.gate` |
| Active parameters/token | 39B |
| Total parameters | 141B |

The GQA ratio of 6:1 (48 query heads, 8 KV heads) is aggressive, reducing KV cache memory by 6× compared to MHA. This is why the KV cache fits so comfortably — 30.8 GiB for 144K tokens — despite the large hidden size.

---

## Key takeaways

1. **W4A4 is not W4A16.** The enfuse NVFP4 quantization uses W4A4 (both weights and activations at 4-bit). This is more aggressive than the W4A16 weight-only quantization we originally planned. The benchmark results suggest W4A4 activation quantization costs more quality than the speed gains justify for this architecture. A W4A16 NVFP4 quantization would likely score significantly higher.

2. **The `w1_weight_global_scale` mismatch is a real quality issue.** vLLM's warning isn't cosmetic. The SwiGLU activation relies on w1 and w3 sharing the same input scaling. When they don't, expert outputs are distorted. This is likely a quantization calibration artifact in the enfuse model, not a fundamental NVFP4 limitation.

3. **Agentic success masks single-shot failure.** Mixtral's 100% agentic score demonstrates that the model's reasoning and self-correction capabilities survive quantization — but only when given a feedback loop. Single-shot generation (coding, math) exposes the quantization damage because the model can't iterate to fix its own errors.

4. **Token generation volume correlates with quality.** 95K tokens vs. 422K tokens is a 4.4× gap. Shorter outputs mean less reasoning, less code, less explanation. The W4A4 quantization may be making the model "too confident" — terminating generation early because the degraded activation distributions push the EOS token probability higher.

5. **Pre-quantized community models need validation.** Using a community-produced NVFP4 quantization saved us the 281 GB download and hours of calibration time, but it also meant accepting someone else's quantization decisions. The W4A4 scheme, the global scale mismatch — these are choices we wouldn't have made. For production use, doing your own quantization with Model Optimizer gives you control over the quality-speed tradeoff.

---

## What's next

Day 3 moves to **GLM-4.7-Flash** from Zhipu AI — a 30B/3B MoE model with an extreme 4B active parameter count. At BF16 it's only 62 GB, and at NVFP4 it should compress to ~16 GB, leaving enormous room for KV cache and long-context serving. GLM-4.7-Flash supports 200K context length, making it ideal for RAG and document processing workloads on the DGX Spark.

Unlike Mixtral, we'll do the NVFP4 quantization ourselves with Model Optimizer 0.45.0 — and we'll use W4A16, not W4A4, to see if the weight-only approach preserves more quality than the aggressive W4A4 scheme we inherited from the community model.

---

*All benchmark data, vLLM logs, and model configuration files are available in the [smf-bench results repository](https://github.com/smfworks/smf-bench). The DGX Spark runs vLLM 0.24.0 in Docker on Ubuntu 24.04 LTS with the GB10 Grace Blackwell SuperChip (121 GB unified memory, ARM64). Benchmark suite: smf-bench v1.0, 181 tests, 8 suites, 5 difficulty tiers.*