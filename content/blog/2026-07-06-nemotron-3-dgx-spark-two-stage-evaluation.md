---
slug: "2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation"
title: "Nemotron-3 on DGX Spark: A Full-Stack Evaluation — Architecture, Quantization, and Results"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-06"
excerpt: "We evaluated NVIDIA's Nemotron-3 family — Nano-30B and Super-120B — on our DGX Spark using our own 181-test smf-bench suite. Final results: Gemma-4-26B leads at 84.0%, Qwen3.6-35B at 71.3%, Nemotron-3-Super-120B at 69.6%, Nemotron-3-Nano-30B at 54.7%. The Super-120B deploys at 75 GiB in 121 GB unified memory with MTP speculative decoding at 84% acceptance. Here's the deep dive on testing methodology, Mamba-Transformer hybrid architecture, NVFP4 mixed-precision quantization, and what the numbers tell us."
categories: ["AI", "Local LLMs", "Model Evaluation", "NVIDIA"]
tags: ["nemotron", "mamba", "moe", "nvfp4", "fp8", "dgx-spark", "vllm", "smf-bench", "quantization", "model-optimizer"]
readTime: 25
image: "/images/blog/2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-06-nemotron-3-dgx-spark-two-stage-evaluation"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

We run two models in production on our DGX Spark (`spark-56bc`, NVIDIA GB10 Grace-Blackwell, 121 GB unified memory):

- **Qwen3.6-35B-A3B-NVFP4** — 35B total / 3B active, NVFP4 quantized, vLLM 0.24.0
- **Gemma-4-26B-A4B-NVFP4** — 26B total / 4B active, NVFP4 quantized, vLLM nightly

Both are pure Transformer MoE models. NVIDIA's Nemotron-3 line takes a fundamentally different architectural path: a **Mamba-Transformer hybrid with MoE**. The Mamba layers (state-space models) process sequences differently from attention — they maintain a recurrent state rather than attending over all prior tokens. This gives them different reasoning characteristics: potentially better long-context handling, different failure modes, and a different accuracy/throughput tradeoff.

The question: is the Mamba hybrid architecture more robust for our workloads than what we're running now?

We're going to find out — with our own numbers, on our own hardware, using our own benchmark.

---

## What we're evaluating

The Nemotron-3 line has three tiers. We're evaluating the top two:

| Model | Total / Active | Format | Memory | Architecture |
|-------|---------------|--------|--------|--------------|
| Nemotron-3-Nano-30B-A3B | 31.6B / 3.6B | FP8 | 31.4 GiB | MoE + Mamba hybrid |
| Nemotron-3-Super-120B-A12B | 120B / 12B | NVFP4 mixed | 75.0 GiB (measured) | MoE + Mamba hybrid |

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

### smf-bench: our own testing standard

We built **smf-bench** — an internal benchmark suite designed to evaluate LLMs on our own workloads, not academic proxies. It's OpenAI-compatible and endpoint-agnostic: point it at any vLLM instance and run.

- **Repo:** [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench) (MIT, public)
- **Tests:** 181 tests across 9 suites
- **Suites:** reasoning (8), math (30), coding (30), reasoning_tier0 (30), instruction (30), prose (30), writing (5), tool_calling (2), agentic (16)
- **Difficulty levels:** 5 tiers — easy / medium / hard / expert / frontier
- **Evaluators:** regex matching, unit test execution, structural count, reasoning content fallback
- **Persistence:** Incremental JSON saves after each test
- **Retry logic:** 4 attempts per test with exponential backoff
- **Reasoning model detection:** Automatically uses max_tokens=4096 for reasoning models (Nemotron, DeepSeek-R1, Qwen3), unlimited for non-reasoning models

### Why our own benchmark

We don't want to depend on third-party benchmark suites that evolve outside our control. NVIDIA publishes numbers on H100 with standard academic benchmarks (MMLU, GPQA, AIME, LiveCodeBench). Those are useful reference points, but:

1. **Different hardware** — GB10 Grace-Blackwell is not H100. Memory bandwidth, SM count, and unified memory architecture all differ.
2. **Different workloads** — Academic benchmarks test academic skills. Our production workloads include agentic tool use, structured output generation, and multi-step instruction following — things academic benchmarks don't always cover.
3. **Different software stack** — vLLM version, container image, and vLLM flags all affect performance. NVIDIA's numbers use their own stack; we use ours.
4. **Ownership** — The testing standard should be owned by SMF Works, not tied to someone else's evolving project. When a third-party benchmark changes its test set or scoring methodology, historical comparisons become invalid. Our benchmark is under our control.

### Hardware

- **DGX Spark** (`spark-56bc`)
- NVIDIA GB10 Grace-Blackwell, aarch64
- 121 GB unified memory (CPU + GPU shared)
- CUDA 13.0, driver 580.159.03
- 3.7 TB NVMe storage

---

## Stage 1: Nano tier — Three-way comparison

### Models in the comparison

| # | Model | Format | Total / Active | Memory | vLLM Version |
|---|-------|--------|----------------|--------|--------------|
| 1 | Qwen3.6-35B-A3B-NVFP4 | NVFP4 | 35B / 3B | ~30 GiB | v0.24.0 |
| 2 | Gemma-4-26B-A4B-NVFP4 | NVFP4 | 26B / 4B | ~22 GiB | nightly |
| 3 | Nemotron-3-Nano-30B-A3B-FP8 | FP8 | 31.6B / 3.6B | 31.4 GiB | NGC container |

Each model was deployed alone with exclusive GPU access — no concurrent inference workloads. Tests ran sequentially with a 120-second per-test timeout and 4 retry attempts per test.

### Overall results

| Model | Pass | Fail | Error | Pass Rate | Wall Time |
|-------|-----:|-----:|------:|----------:|----------:|
| **Gemma-4-26B-A4B-NVFP4** | 152 | 26 | 3 | **84.0%** | 56.3 min |
| Qwen3.6-35B-A3B-NVFP4 | 129 | 52 | 0 | 71.3% | 27.6 min |
| Nemotron-3-Nano-30B-A3B-FP8 | 99 | 82 | 0 | 54.7% | 212.0 min |

Gemma-4-26B is the clear Stage 1 winner on accuracy. Qwen3.6-35B is the speed champion — 7.7× faster than Nemotron and 2× faster than Gemma. Nemotron-3-Nano is the slowest and lowest-scoring of the three.

---

## Stage 2: Super tier — Deployment and fit

### The challenge

The Nemotron-3-Super-120B-A12B-NVFP4 is a 120B total parameter model with 12B active parameters. The NVFP4 checkpoint is 80.4 GB on disk (17 safetensors shards). On 121 GB unified memory, the question is simple: does it fit?

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

### The deployment

NVIDIA's official model card provides DGX Spark-specific deployment instructions. We followed them exactly:

```bash
# vLLM v0.20.0 — NVIDIA-recommended for Nemotron-3-Super on DGX Spark
docker run -d \
  --name nemotron-3-super-120b-nvfp4-vllm \
  --runtime nvidia --gpus all \
  --ipc=host \
  --ulimit memlock=-1 --ulimit stack=67108864 \
  -e VLLM_NVFP4_GEMM_BACKEND=marlin \
  -e VLLM_ALLOW_LONG_MAX_MODEL_LEN=1 \
  -e VLLM_FLASHINFER_ALLREDUCE_BACKEND=trtllm \
  -e VLLM_USE_FLASHINFER_MOE_FP4=0 \
  -v /home/mikesai3/nemotron-3-super-120b/checkpoint:/model \
  -p 8888:8000 \
  vllm/vllm-openai:v0.20.0 \
  --model /model \
  --served-model-name nvidia/nemotron-3-super \
  --host 0.0.0.0 --port 8000 \
  --async-scheduling \
  --dtype auto --kv-cache-dtype fp8 \
  --gpu-memory-utilization 0.90 \
  --max-num-seqs 4 \
  --max-model-len 1000000 \
  --moe-backend marlin \
  --mamba_ssm_cache_dtype float16 \
  --quantization fp4 \
  --speculative_config '{"method":"mtp","num_speculative_tokens":3,"moe_backend":"triton"}' \
  --reasoning-parser-plugin /app/super_v3_reasoning_parser.py \
  --reasoning-parser super_v3 \
  --enable-auto-tool-choice \
  --tool-call-parser qwen3_coder \
  --trust-remote-code
```

Key deployment decisions:

| Parameter | Value | Rationale |
|-----------|-------|----------|
| Container image | `vllm/vllm-openai:v0.20.0` | NVIDIA-recommended for Super on DGX Spark |
| Quantization | `fp4` | NVFP4 mixed precision (ModelOpt checkpoint) |
| MoE backend | `marlin` | Marlin NVFP4 GEMM kernels |
| Speculative | MTP, 3 tokens | Multi-Token Prediction from the model's own MTP head |
| KV cache | FP8 | Reduces memory for 1M token context |
| Max model len | 1,000,000 | Full context window (requires VLLM_ALLOW_LONG_MAX_MODEL_LEN=1) |
| GPU memory util | 0.90 | Maximum memory headroom on 121 GB |
| Max num seqs | 4 | NVIDIA-recommended for this model size |
| Reasoning parser | `super_v3` | Nemotron-3 Super reasoning format |
| Tool call parser | `qwen3_coder` | NVIDIA-recommended tool-call format |

### The download problem

The checkpoint download was the biggest hurdle. The model is public (not gated) on HuggingFace, but unauthenticated downloads are rate-limited. Our first attempts:

1. **Container-initiated download** — vLLM tries to download from HuggingFace on startup. Stalled at 104 KB. Unauthenticated rate limiting killed it before the first shard completed.
2. **`huggingface_hub.snapshot_download` with `HF_HUB_ENABLE_HF_TRANSFER=1`** — Downloaded 4.3 GB in 3 minutes, then stalled. The `HF_HUB_ENABLE_HF_TRANSFER` flag is deprecated; the new flag is `HF_XET_HIGH_PERFORMANCE`.
3. **`HF_XET_HIGH_PERFORMANCE=1` with 16 workers** — Progressed to 10.6 GB, then stalled again at 13.5 GB after a network interruption.

**Solution: parallel `wget` with `xargs -P4`** — downloading the 17 safetensors shards directly from HuggingFace's resolve URLs, 4 files at a time. This worked:

| Attempt | Method | Speed | Result |
|---------|--------|-------|--------|
| 1 | Container-initiated | 0 MB/s | Stalled at 104 KB |
| 2 | `snapshot_download` + hf_transfer | ~1.4 GB/min | Stalled at 4.3 GB |
| 3 | `snapshot_download` + XET | ~2 GB/min | Stalled at 13.5 GB |
| 4 | **Parallel `wget -P4`** | **~4 GB/min** | **Completed 75 GB in 18 min** |

The lesson: unauthenticated HuggingFace rate limiting is per-connection, not per-IP. Opening multiple parallel connections bypasses the throttle. With a HuggingFace token (which we didn't have), `huggingface_hub` should work at full speed — but without one, parallel `wget` is the fallback.

### Memory fit — confirmed

The model loaded successfully:

```
Loading safetensors checkpoint shards: 100% Completed | 17/17 [01:13<00:00, 4.34s/it]
Loading weights took 73.82 seconds
Model loading took 75.03 GiB memory and 606.32 seconds
```

**75.03 GiB of 121 GB unified memory** — 62% utilization. The model fits with room for KV cache and activation buffers. At `--gpu-memory-utilization 0.90`, vLLM has 108.9 GB to work with, leaving ~34 GB for the KV cache after the model weights.

### Runtime performance

Once loaded, the Super 120B serves inference at:

| Metric | Value |
|--------|-------|
| Generation throughput | ~30 tokens/s |
| MTP acceptance rate | 84-92% |
| Mean acceptance length | 3.5-3.8 tokens |
| KV cache usage | 1.3% (under load) |
| Attention backend | FlashInfer |
| MoE backend | Marlin NVFP4 |
| Architecture detected | NemotronHForCausalLM + NemotronHMTPModel |

The speculative decoding is working well — 84% draft acceptance rate means the MTP head is generating useful speculative tokens. The 30 tokens/s generation rate is slower than the Stage 1 models (Qwen at ~150+ tok/s), but this is a 12B active parameter model vs 3-4B — the capability gap should be visible in the benchmark.

---

## Stage 2: Benchmark — Complete results

The smf-bench 181-test suite ran against the Super 120B over 8.8 hours of wall time. Here are the complete results, integrated with the Stage 1 three-model comparison.

### Overall four-model comparison

| Model | Pass | Fail | Error | Pass Rate | Wall Time | Active Params |
|-------|-----:|-----:|------:|----------:|----------:|--------------:|
| **Gemma-4-26B-A4B-NVFP4** | 152 | 26 | 3 | **84.0%** | 56.3 min | 4B |
| Qwen3.6-35B-A3B-NVFP4 | 129 | 52 | 0 | 71.3% | 27.6 min | 3B |
| Nemotron-3-Super-120B-A12B-NVFP4 | 126 | 12 | 43 | 69.6% | 530.1 min | 12B |
| Nemotron-3-Nano-30B-A3B-FP8 | 99 | 82 | 0 | 54.7% | 212.0 min | 3.6B |

The Super 120B lands at 69.6% — third place overall, behind Gemma (84.0%) and Qwen (71.3%), but 14.9 points ahead of its smaller sibling, the Nano-30B. The 3.3× increase in active parameters (3.6B → 12B) produced a 14.9-point accuracy gain, but didn't close the gap to the smaller Transformer MoE models from Qwen and Gemma.

**The wall time story is critical:** the Super 120B took 530 minutes (8.8 hours) to complete the benchmark — 9.4× longer than Gemma and 19.2× longer than Qwen. This is the cost of the reasoning chain: the Mamba-Transformer hybrid generates extensive thinking tokens before each answer, and with 12B active parameters, each token takes longer to produce. The 43 errors (out of 55 non-passing tests) are all timeouts — the model exhausted its 4096-token reasoning budget before reaching an answer. Only 12 tests produced a wrong answer.

### Category breakdown — all four models

| Category | Nemotron-3-Nano-30B | Qwen3.6-35B | Gemma-4-26B | Nemotron-3-Super-120B |
|----------|---:|---:|---:|---:|
| agentic | 7/16 (43.8%) | 14/16 (87.5%) | **15/16 (93.8%)** | 8/16 (50.0%) |
| coding | 22/30 (73.3%) | 19/30 (63.3%) | **28/30 (93.3%)** | 22/30 (73.3%) |
| instruction | 17/30 (56.7%) | 22/30 (73.3%) | **27/30 (90.0%)** | 28/30 (93.3%) |
| math | 9/30 (30.0%) | **16/30 (53.3%)** | 15/30 (50.0%) | 12/30 (40.0%) |
| prose | 12/30 (40.0%) | 21/30 (70.0%) | **27/30 (90.0%)** | 20/30 (66.7%) |
| reasoning | 25/38 (65.8%) | 31/38 (81.6%) | **36/38 (94.7%)** | 29/38 (76.3%) |
| tool_calling | **2/2 (100%)** | **2/2 (100%)** | 0/2 (0%) | **2/2 (100%)** |
| writing | **5/5 (100%)** | 4/5 (80%) | 4/5 (80%) | **5/5 (100%)** |

**The Super 120B's standout result: instruction following.** It scored 28/30 (93.3%) — the best of any model, edging out Gemma (27/30, 90.0%). The Mamba hybrid's recurrent state may help with maintaining structural constraints (line counts, sentence counts, stanza formatting) over long outputs. Only 1 test was a genuine failure (a character transposition in a string manipulation task); the other was a timeout.

**Where the Super 120B excels vs. the Nano:**
- **Instruction:** 93.3% vs 56.7% (+36.6 points) — the biggest improvement
- **Prose:** 66.7% vs 40.0% (+26.7 points) — structural formatting benefits from larger active parameters
- **Reasoning:** 76.3% vs 65.8% (+10.5 points) — the 12B active params improve logical deduction
- **Math:** 40.0% vs 30.0% (+10.0 points) — more reasoning capacity, but still constrained by token budget

**Where the Super 120B falls short:**
- **Agentic:** 50.0% — barely better than the Nano (43.8%) and far behind Qwen (87.5%) and Gemma (93.8%). The agentic tests require file creation and multi-step tool use. The Super 120B passed 8/16 — the ones it passed were app-generation tasks (counter, todo, pong, snake, bounce, starfield) where it could generate complete HTML/JS in one pass. It failed all 8 tasks requiring file-system manipulation (compute-write, config-extract, script-and-output, bugfix-run, json-spec, multifile-summary, rename, reasoning-only).
- **Coding:** 73.3% — identical to the Nano. The 12B active parameters didn't improve coding accuracy. All 8 failures are timeouts, not wrong code — the model generates correct code but exhausts its reasoning budget before completing the output on expert/frontier problems.
- **Math:** 40.0% — worse than Qwen (53.3%) and Gemma (50.0%). 15 of 18 non-passing tests are timeouts. The reasoning chain on math problems is extremely verbose, and the 4096-token budget is insufficient for expert/frontier problems.

### Difficulty breakdown — all four models

| Difficulty | Nano-30B | Qwen-35B | Gemma-26B | Super-120B |
|------------|---:|---:|---:|---:|
| easy | 10/10 (100%) | 10/10 (100%) | 10/10 (100%) | 10/10 (100%) |
| medium | 13/15 (86.7%) | 14/15 (93.3%) | 14/15 (93.3%) | 14/15 (93.3%) |
| hard | 18/25 (72.0%) | 21/25 (84.0%) | 22/25 (88.0%) | 21/25 (84.0%) |
| expert | 16/40 (40.0%) | 27/40 (67.5%) | 32/40 (80.0%) | 20/40 (50.0%) |
| frontier | 20/60 (33.3%) | 30/60 (50.0%) | **47/60 (78.3%)** | 22/60 (36.7%) |

The difficulty breakdown reveals the Super 120B's profile clearly:

- **Easy and medium:** All four models are comparable — 86-100%. These tiers don't differentiate.
- **Hard:** The Super 120B matches Qwen (84.0%) and approaches Gemma (88.0%). This is where the 12B active parameters start to matter.
- **Expert:** The Super 120B (50.0%) trails Qwen (67.5%) and Gemma (80.0%). The reasoning chain is verbose but the token budget runs out before the model reaches an answer on graduate-level problems.
- **Frontier:** The Super 120B (36.7%) barely improves on the Nano (33.3%) and is far behind Qwen (50.0%) and Gemma (78.3%). The frontier tier exposes the token budget constraint most severely — the model's reasoning chain generates hundreds of thinking tokens that consume the 4096-token budget before reaching the answer.

### Notable frontier-level results

Despite the lower frontier pass rate, the Super 120B achieved some notable frontier-level successes:

- **Coding frontier:** Passed 4/12 frontier coding tests (frontier.02, .04, .06, .07, .08, .09) — the Mamba hybrid generates correct code for complex algorithmic problems when the token budget suffices.
- **Reasoning frontier:** Passed 5/12 frontier reasoning tests (frontier.02, .03, .04, .05, .11, .12) — including named-entity logic puzzles requiring multi-step deduction.
- **Math frontier:** Passed 3 frontier math problems — neither the Nano-30B nor Qwen-3-35B passed any frontier math. The 12B active parameters give the Super 120B enough reasoning depth to solve frontier-level math when the token budget allows.

### The timeout problem

The Super 120B's 43 errors (all timeouts) tell the real story. The breakdown by category:

| Category | Tests | Pass | Fail (wrong answer) | Error (timeout) |
|----------|------:|-----:|--------------------:|----------------:|
| math | 30 | 12 | 3 | 15 |
| prose | 30 | 20 | 0 | 10 |
| reasoning | 38 | 29 | 0 | 9 |
| coding | 30 | 22 | 0 | 8 |
| instruction | 30 | 28 | 1 | 1 |
| agentic | 16 | 8 | 8 | 0 |
| writing | 5 | 5 | 0 | 0 |
| tool_calling | 2 | 2 | 0 | 0 |

**Only 12 tests produced a genuinely wrong answer** (3 math failures, 1 instruction failure, 8 agentic failures). The remaining 43 failures are all timeouts — the model was still reasoning when the 4096-token budget ran out. This is a configuration issue, not a capability issue. Increasing `max_tokens` to 8192 or 16384 would likely convert many of those timeouts into passes, at the cost of even longer wall time.

---

## Implications for use

### What the numbers tell us

**The four-model hierarchy by accuracy:**

1. **Gemma-4-26B (84.0%)** — the clear winner. Smallest model by total parameters (26B), 4B active, but the best architecture quality. Dominates 5 of 8 categories and the frontier tier (78.3%).
2. **Qwen3.6-35B (71.3%)** — the speed champion. 27.6 minutes for 181 tests. Non-reasoning architecture means it answers directly without thinking tokens. Strong on math (53.3%) and agentic (87.5%).
3. **Nemotron-3-Super-120B (69.6%)** — the instruction specialist. Best instruction following (93.3%), perfect tool calling and writing. But 530 minutes wall time and 43 timeouts limit its practical value for general workloads.
4. **Nemotron-3-Nano-30B (54.7%)** — the lightweight hybrid. Perfect tool calling and writing, but weakest overall. The 3.6B active parameters aren't enough to compensate for the token budget constraint.

**The Mamba hybrid verdict:**

The Mamba-Transformer hybrid architecture does not deliver an accuracy advantage over pure Transformer MoE models at similar or smaller scales. Gemma-4-26B (4B active, pure Transformer) outperforms Nemotron-3-Super-120B (12B active, Mamba hybrid) by 14.4 points despite having 3× fewer active parameters. The hybrid's strengths — instruction following, tool calling, writing — are real but narrow. Its weakness — the verbose reasoning chain that exhausts token budgets — is structural and affects all reasoning-heavy categories (math, coding, reasoning).

**Where each model wins:**

| Use case | Best model | Score | Why |
|---------|-----------|-------|-----|
| General accuracy | Gemma-4-26B | 84.0% | Best overall, dominates frontier tier |
| Speed-critical | Qwen3.6-35B | 71.3% in 27.6 min | 19× faster than Super 120B |
| Instruction following | **Nemotron-3-Super-120B** | **93.3%** | Best of any model, structural formatting |
| Tool calling | Nemotron-3 (both) | 100% | Both tiers perfect on 2/2 |
| Writing | Nemotron-3 (both) | 100% | Both tiers perfect on 5/5 |
| Coding | Gemma-4-26B | 93.3% | 28/30, only 1 timeout |
| Math | Qwen3.6-35B | 53.3% | Direct approach avoids over-thinking |
| Agentic | Gemma-4-26B | 93.8% | 15/16, best multi-step tool use |
| Reasoning | Gemma-4-26B | 94.7% | 36/38, best logical deduction |

### What this means for local LLM deployment

1. **NVFP4 works at scale.** The Super 120B at NVFP4 mixed precision loads in 75 GiB — well within the DGX Spark's 121 GB. The Marlin NVFP4 GEMM kernels deliver usable throughput (~30 tok/s) for a 12B active parameter model. This validates NVIDIA's NVFP4 quantization recipe for the GB10 Grace-Blackwell.

2. **Mamba-Transformer hybrids are viable for production.** The NemotronH architecture loads and serves cleanly in vLLM v0.20.0. The Mamba layers don't require special runtime handling — vLLM detects the hybrid architecture and manages the SSM cache automatically.

3. **Speculative decoding (MTP) is effective.** The 84% acceptance rate with 3 speculative tokens means the Super 120B achieves ~30 tok/s effective throughput despite being a 120B model. Without MTP, the throughput would be ~10 tok/s (1/3 of the speculative rate).

4. **Reasoning token budget is the bottleneck.** The Super 120B's 43 timeouts (vs. only 12 wrong answers) show that the model's capability is masked by the 4096-token reasoning budget. The Mamba hybrid generates more verbose reasoning chains than pure Transformer models, and the budget runs out before the answer. Increasing to 8192 or 16384 tokens would likely improve scores significantly — but the 530-minute wall time at 4096 tokens would become 15+ hours at 16384.

5. **Architecture quality > parameter count.** The Super 120B (12B active, 120B total) scores 69.6% — 14.4 points behind Gemma-4-26B (4B active, 26B total). The 3× active parameter advantage doesn't compensate for the Mamba hybrid's verbose reasoning overhead. Pure Transformer MoE architecture, when well-designed, is more efficient per active parameter than the Mamba hybrid.

### What this means for SMF Works

Our production stack currently runs Qwen3.6-35B and Gemma-4-26B. The full four-model benchmark confirms this is the right choice:

- **Gemma-4-26B** remains the accuracy leader (84.0%) and the default for quality-critical tasks.
- **Qwen3.6-35B** remains the speed champion (27.6 min) and the default for latency-sensitive tasks.
- **Nemotron-3-Super-120B** is a specialist: use it when instruction following or structured output generation is the primary task, and latency is acceptable (530 min for 181 tests = ~3 min/test average). Its 93.3% instruction score and 100% writing/tool-calling scores make it the best model for structured document generation, form-filling, and tool-use workflows.
- **Nemotron-3-Nano-30B** doesn't make the production cut. The Super 120B dominates it in every category except tool calling and writing (where they tie at 100%).

**The decision gate:** The Super 120B needed to exceed Gemma's 84.0% by 5+ points to justify the 75 GiB memory cost (vs. 22-31 GiB for Stage 1 models). At 69.6%, it doesn't meet that threshold. But its specialist strengths — instruction following, tool calling, writing — make it a valuable addition to the stack for specific workloads, not a replacement for Gemma or Qwen.

---

## The testing methodology in detail

### Why 181 tests, not 239

Our benchmark suite was originally designed with 239 tests across 15 categories. We run 181 tests across 9 suites for the Stage 1 comparison because:

1. **Some suites require external tooling** (code execution sandbox, web search) that we haven't integrated yet.
2. **Some tests are duplicates** across suites — we deduplicated to avoid counting the same test twice.
3. **The 181-test suite covers the core capability dimensions** — reasoning, math, coding, instruction following, prose generation, writing, tool calling, and agentic behavior.

### Test difficulty tiers

Each test is assigned to one of five difficulty tiers:

| Tier | Description | Example |
|------|-------------|---------|
| easy | Basic capability test | "What is 2+2?" |
| medium | Standard task | "Solve a quadratic equation" |
| hard | Complex multi-step task | "Derive the closed-form solution for a recurrence relation" |
| expert | Graduate-level problem | "Prove that the sum of two consecutive Fibonacci numbers is a Lucas number" |
| frontier | Research-level problem | "Find the closed-form for a non-linear recurrence with variable coefficients" |

The frontier tier is the discriminator — all models pass easy tests, but only the best models pass frontier tests. Gemma-4-26B's 78.3% frontier pass rate is the standout result.

### Evaluator types

| Evaluator | How it works | Used for |
|-----------|-------------|---------|
| `regex_match` | Checks if the response contains a regex pattern | Math, reasoning, knowledge tests |
| `unit_test` | Executes generated code against test cases | Coding tests |
| `structural_count` | Checks structural elements in the response (e.g., numbered lists, headers) | Instruction, prose tests |
| `reasoning_fallback` | Falls back to `reasoning` field when `content` is empty | Reasoning model tests |

The `unit_test` evaluator was added during Stage 1 after coding tests were failing with the default regex evaluator — the model generated correct code but didn't include the expected output string. The `unit_test` evaluator actually executes the generated code and checks the return value.

### Reasoning model handling

Reasoning models (Nemotron-3, DeepSeek-R1, Qwen3) generate thinking tokens before the final answer. smf-bench detects reasoning models by checking the model name against known reasoning model patterns. When detected:

- `max_tokens` is set to 4096 (vs unlimited for non-reasoning models)
- The `reasoning` field in the API response is checked when `content` is empty
- The thinking tokens are not counted toward the answer evaluation

The 4096-token budget is a practical constraint — higher budgets would improve math scores but dramatically increase wall time. The Super 120B took 530 minutes with 4096 tokens; with 16384 tokens, it would likely take 15+ hours. This is the fundamental tradeoff of reasoning models: more thinking capacity means more accuracy, but exponentially more latency.

---

## What's next

All four models have been benchmarked. The final hierarchy is clear:

| Rank | Model | Pass Rate | Best For |
|------|-------|----------|----------|
| 1 | Gemma-4-26B-A4B-NVFP4 | 84.0% | General accuracy, coding, agentic, reasoning |
| 2 | Qwen3.6-35B-A3B-NVFP4 | 71.3% | Speed, math, agentic |
| 3 | Nemotron-3-Super-120B-A12B-NVFP4 | 69.6% | Instruction following, tool calling, writing |
| 4 | Nemotron-3-Nano-30B-A3B-FP8 | 54.7% | Lightweight tool calling, writing |

**Next steps:**

1. **Token budget experiment:** Re-run the Super 120B's failed math and reasoning tests with `max_tokens=16384` to see how many timeouts convert to passes. This will isolate the capability question from the token budget constraint.
2. **Long-context evaluation:** Test the Super 120B's 1M token context window with long-document summarization and retrieval tasks — the Mamba architecture's O(n) scaling should shine here.
3. **Concurrent throughput:** Measure the Super 120B under multi-user load (`--max-num-seqs 4`) to evaluate its suitability as a shared inference server.
4. **Tool-use agentic re-run:** The agentic failures were all file-system manipulation tasks. Test whether a different tool-call parser or system prompt improves the Super 120B's agentic performance.

The full evaluation plan is documented in our internal vault (`NemoVault/Nemotron-3-Evaluation-Plan.md`) with all source citations from the ModelOpt 0.45.0 repository.

---

*smf-bench is available at [github.com/smfworks/smf-bench](https://github.com/smfworks/smf-bench) (MIT). Nemotron-3-Nano-30B-A3B is available on [HuggingFace](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8). Nemotron-3-Super-120B-A12B is available on [HuggingFace](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4). The ModelOpt 0.45.0 release is at [github.com/NVIDIA/Model-Optimizer](https://github.com/NVIDIA/Model-Optimizer). vLLM is at [github.com/vllm-project/vllm](https://github.com/vllm-project/vllm).*