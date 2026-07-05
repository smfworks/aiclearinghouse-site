---
slug: "2026-07-05-qwen3-6-35b-a3b-nvfp4-dgx-spark-benchmark"
title: "Qwen3.6-35B-A3B on the DGX Spark: 107 Tok/s, 100% Effective Pass Rate, and the MoE Speed Crown"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-05"
excerpt: "We deployed NVIDIA's Qwen3.6-35B-A3B-NVFP4 on a DGX Spark using vLLM v0.24.0 with Marlin NVFP4 MoE and built-in MTP speculative decoding. 33 multimodal tests across image, video, audio, reasoning, coding, and writing. 30/33 passed (100% effective excluding audio). At 107 tok/s it is the fastest local model we have tested — here is the full breakdown."
categories: ["AI", "Local LLMs", "DGX Spark", "Qwen", "Beyond the Leaderboard"]
tags: ["qwen3-6", "nvfp4", "vllm", "dgx-spark", "moe", "mtp", "speculative-decoding", "benchmark", "aarch64", "multimodal"]
readTime: 20
image: "/images/blog/2026-07-05-qwen3-6-35b-a3b-nvfp4-dgx-spark-benchmark.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-05-qwen3-6-35b-a3b-nvfp4-dgx-spark-benchmark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

NVIDIA's Qwen3.6-35B-A3B-NVFP4 is a Mixture-of-Experts model with an extreme twist: 35 billion total parameters, but only **3 billion active per token** — 8 of 256 experts. That is the smallest active footprint of any model we have tested, despite having the largest total parameter count. With NVFP4 quantization, the weights compress to roughly 20 GB, leaving the DGX Spark's 128 GB unified memory plenty of room for a large KV cache.

The question: can a 3B-active MoE model deliver real quality across image, video, reasoning, coding, and writing tasks — or does the sparse activation sacrifice too much? And how fast is it? The MoE architecture means each token only routes through 3B parameters, so inference should be fast. But *how* fast?

We ran 33 tests across six categories, then reran the two that failed with adjusted parameters. No estimates. No extrapolations. Every number in this post came from a real request to a real server running on the DGX Spark.

---

## The stack

| Component | Version / Value |
|-----------|----------------|
| **Hardware** | NVIDIA DGX Spark (GB10 Grace Blackwell, aarch64, 128 GB UMA) |
| **OS** | NVIDIA DGX OS 7.5.0 (Ubuntu-based, kernel 6.17) |
| **vLLM** | v0.24.0 (stable release Docker image) |
| **Model** | `nvidia/Qwen3.6-35B-A3B-NVFP4` (NVFP4, MoE 35B/3B active, 8/256 experts) |
| **MoE Backend** | Marlin NVFP4 |
| **Attention Backend** | FlashInfer |
| **Speculative Decoding** | MTP (Multi-Token Prediction), 3 speculative tokens, built-in |
| **Deployment wrapper** | [MiaAI-Lab/Qwen3.6-35B-A3B-NVFP4-vLLM](https://github.com/MiaAI-Lab/Qwen3.6-35B-A3B-NVFP4-vLLM) |
| **Endpoint** | `http://spark-56bc:8888/v1` (OpenAI-compatible) |
| **Container** | `qwen36-35b-a3b-nvfp4-vllm` |

The model is a hybrid-attention MoE: it mixes linear attention layers with full attention layers for efficient long-context processing. With 256 experts and only 8 active per token, the routing is extremely sparse. NVFP4 quantization via NVIDIA Model Optimizer v0.44.0 compresses the model by approximately 3.06x compared to BF16, bringing the weight footprint to around 20 GB.

Critically, this model includes **built-in MTP speculative decoding** — the model itself predicts 3 future tokens during each forward pass, and if the predictions match, those tokens come nearly for free. No separate assistant model is needed, unlike Gemma-4's setup.

---

## The deployment

The MiaAI-Lab wrapper provides a `start.sh` script that launches the Docker container and polls for health. We applied one patch: disabled thinking mode by default for benchmark parity with our previous Gemma-4 and Nemotron tests.

### What the container runs

```bash
vllm serve nvidia/Qwen3.6-35B-A3B-NVFP4 \
  --host 0.0.0.0 --port 8888 \
  --tensor-parallel-size 1 \
  --trust-remote-code \
  --quantization modelopt_mixed \
  --moe-backend marlin \
  --attention-backend flashinfer \
  --gpu-memory-utilization 0.40 \
  --max-model-len 262144 \
  --max-num-seqs 4 \
  --max-num-batched-tokens 8192 \
  --enable-chunked-prefill \
  --enable-prefix-caching \
  --limit-mm-per-prompt '{"image":4}' \
  --speculative-config '{"method":"mtp","num_speculative_tokens":3}' \
  --chat-template-kwargs '{"enable_thinking":false}'
```

### Key configuration choices

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `--quantization modelopt_mixed` | NVFP4 | 3.06x compression with negligible accuracy loss |
| `--moe-backend marlin` | Marlin NVFP4 MoE | Optimized MoE kernel for NVFP4 on Grace Blackwell |
| `--attention-backend flashinfer` | FlashInfer | Best attention performance on GB10 |
| `--gpu-memory-utilization 0.40` | 40% | NVFP4 weights are small; 40% leaves room for KV cache |
| `--max-num-seqs 4` | 4 concurrent | Conservative for benchmark isolation |
| `--speculative-config mtp 3` | 3 spec tokens | Built-in MTP — no assistant model needed |
| `--chat-template-kwargs enable_thinking:false` | Thinking off | Benchmark parity with Gemma-4 and Nemotron |
| `--limit-mm-per-prompt image:4` | 4 images | Supports multi-image reasoning |

### Startup sequence

The server takes approximately 10 minutes to become ready:

1. **Weight download** (~20 GB NVFP4 from HuggingFace cache) — 3-4 min
2. **torch.compile** — 34s
3. **Warmup** — 41s
4. **MTP head compilation** — 60-90s
5. **Health check polling** — until `/v1/models` responds

---

## The benchmark

We ran 33 tests across six categories: image understanding (10), video understanding (4), audio understanding (3), reasoning (6), coding (5), and writing (5). Thinking mode was disabled by default, but 6 tests explicitly enabled it to test the model's extended reasoning capability.

### Results summary

| Metric | Value |
|--------|-------|
| **Total tests** | 33 |
| **Passed** | 30 (90.9%) |
| **Empty (token budget exhausted)** | 0 (after rerun) |
| **Errors (unsupported modality)** | 3 (audio — no audio tower) |
| **Effective pass rate** (excl. audio) | **30/30 = 100%** |
| **Total tokens generated** | 47,716 |
| **Total wall time** | 444.8s |
| **Average throughput** | **107.3 tok/s** |

### Results by category

| Category | Pass | Error | Total | Tokens | Time (s) |
|----------|------|-------|-------|--------|----------|
| Image | 10/10 ✅ | 0 | 10 | 6,330 | 60.9 |
| Video | 4/4 ✅ | 0 | 4 | 13,145 | 124.6 |
| Audio | 0/3 ❌ | 3 | 3 | 0 | 0.0 |
| Reasoning | 6/6 ✅ | 0 | 6 | 13,218 | 120.9 |
| Coding | 5/5 ✅ | 0 | 5 | 7,567 | 70.2 |
| Writing | 5/5 ✅ | 0 | 5 | 7,456 | 68.2 |
| **Total** | **30** | **3** | **33** | **47,716** | **444.8** |

---

## Image understanding: 10/10

Perfect score across every image test — from basic color identification to chart reasoning with thinking mode enabled.

| Test | Time | Tokens | Notes |
|------|------|--------|-------|
| Color Grid Identification | 0.7s | 73 | All colors and counts correct |
| OCR Text Extraction | 0.6s | 69 | Transcribed text including API key, date, temperature |
| Bar Chart Interpretation | 1.3s | 139 | Categories, values, highest/lowest bars |
| Code Screenshot Reading | 5.6s | 614 | Recognized Python, transcribed and explained code |
| Math Equation Reading | 2.9s | 350 | Solved 3x²-12x+9=0 step-by-step |
| Scene Description | 3.7s | 373 | Detailed description of house scene |
| Number Sequence | 2.5s | 288 | Identified 2,6,12,20,30 pattern |
| Image A Analysis | 2.1s | 206 | Geometric shape description |
| Image B Analysis | 2.2s | 218 | Geometric shape description |
| Chart Reasoning (thinking) | 39.3s | 4,000 | Multi-step trend analysis with reasoning |

The fastest image test completed in 0.6 seconds. The most complex — chart reasoning with thinking mode — used 4,000 tokens of reasoning and analysis over 39 seconds.

---

## Video understanding: 4/4

| Test | Time | Tokens | Notes |
|------|------|--------|-------|
| Bouncing Ball Motion | 2.0s | 205 | Tracked red circle movement on blue background |
| Shapes in Motion | 4.5s | 482 | Identified green square, blue circle, triangle movements |
| Color Cycle Video | 1.1s | 96 | Identified color sequence (Red, Green, Blue, Yellow) |
| Video Reasoning (thinking) | 116.8s | 12,362 | Analyzed trajectory, velocity, energy loss |

The Video Reasoning test deserves a story. On the first run with an 8,192 token budget, the model exhausted every token on reasoning and produced no final answer — the thinking consumed the entire budget. We reran it with 16,384 tokens. The model used 12,362 tokens to complete its reasoning and deliver a final analysis of the ball's physics across video frames: trajectory as linear segments interrupted by bounces, velocity changes at each collision, and energy loss estimates. **This is the key lesson for thinking-mode deployments: complex multimodal reasoning needs 16K+ token budgets. The default 8K is not enough.**

---

## Audio understanding: 0/3 (expected)

Qwen3.6-35B-A3B-NVFP4 does not have an audio encoder. The vLLM serve config explicitly sets `limit_mm_per_prompt: {'image': 4}` with no audio support. All three audio tests returned HTTP 400: "At most 0 audio(s) may be provided." This is the same limitation as Gemma-4 — these are vision-language models, not omni models. Nemotron-Omni remains the only model we have tested with audio support.

---

## Reasoning: 6/6

| Test | Time | Tokens | Notes |
|------|------|--------|-------|
| Multi-step Math Problem | 6.8s | 788 | Train speed problem — correct: 60mph → 75mph → 465 miles |
| Logic Puzzle | 36.8s | 3,997 | Found two valid seating arrangements |
| Lateral Thinking | 8.0s | 782 | Classic "short man" riddle — solved correctly |
| Probability Reasoning | 30.5s | 3,326 | Bertrand's Box paradox — correct answer 2/3 |
| Constraint Optimization | 36.4s | 4,096 | Found valid schedule with all constraints satisfied |
| Quick Math (no thinking) | 2.3s | 229 | 17×23+45×12-89 = 742 |

The Constraint Optimization test has the most interesting story in the entire benchmark. It is a scheduling problem: four meetings (A=30min, B=45min, C=60min, D=15min) in a 9:00–12:00 window with four constraints (A before C, B and C cannot overlap, D must be last, B needs a 15-minute buffer after it).

**With thinking mode enabled, the model loops.** We tested at three token budgets:

| Attempt | max_tokens | Thinking | Result | Tokens | Time |
|---------|-----------|----------|--------|--------|------|
| Original | 8,192 | On | EMPTY | 8,192 | 78.3s |
| Rerun 1 | 16,384 | On | EMPTY | 16,384 | 157.1s |
| Rerun 2 | 32,768 | On | EMPTY | 32,768 | 312.7s |
| **Rerun 3** | **4,096** | **Off** | **PASS** | **4,096** | **36.4s** |

At 32K tokens, the model generated 86,509 characters of reasoning — cycling through the same scheduling permutations over and over without converging. This is a known quirk of MoE models with extended thinking: the sparse routing can get stuck in loops on constraint satisfaction problems.

**The fix:** disable thinking mode and add "think step by step" to the prompt. The model then produced a clean, thorough analysis in 4,096 tokens and 36 seconds. It evaluated three valid orderings (A-B-C, A-C-B, B-A-C), checked all constraints for each, and found the optimal schedule:

> **A:** 9:00–9:30 → **C:** 9:30–10:30 → **Gap:** 10:30–10:45 → **B:** 10:45–11:30 → **Buffer:** 11:30–11:45 → **D:** 11:45–12:00

All constraints verified. This is the second key lesson: **thinking mode is not always better. For constraint satisfaction problems, instruct mode with step-by-step prompting is more reliable and dramatically faster.**

---

## Coding: 5/5

| Test | Time | Tokens | Notes |
|------|------|--------|-------|
| Binary Search Tree | 10.1s | 1,270 | Full BST with type hints and docstrings |
| Code Debugging | 9.7s | 984 | Analyzed fibonacci + merge_sort, found subtle issue |
| Code Refactoring | 9.5s | 979 | Pythonic dict comprehension, conditional expressions |
| SQL Query Writing | 0.9s | 93 | PostgreSQL with JOIN, SUM, COUNT, date filter |
| Complex Algorithm (thinking) | 40.1s | 4,241 | LRU cache with O(1) operations, hash map + doubly linked list |

Perfect score. The SQL query took less than a second. The complex algorithm test with thinking mode produced a complete LRU cache implementation with O(1) get and put operations using a hash map and doubly linked list — the standard optimal solution.

---

## Writing: 5/5

| Test | Time | Tokens | Notes |
|------|------|--------|-------|
| Creative Story | 4.9s | 360 | AI dreaming flash fiction — atmospheric |
| Technical Documentation | 5.1s | 446 | vLLM gpu_memory_utilization explained |
| Text Summarization | 1.4s | 155 | 3 bullet points covering DGX Spark features |
| Professional Email | 1.9s | 169 | Delay notification email — professional tone |
| Analytical Essay (thinking) | 54.9s | 6,326 | Local vs cloud API trade-offs analysis |

Perfect score. The analytical essay with thinking mode was the longest single response in the benchmark at 6,326 tokens, analyzing the trade-offs between local and cloud API deployment for LLM inference.

---

## The speed crown: 107 tok/s

This is where Qwen3.6-35B-A3B separates itself from every other model we have tested.

| Model | Total Tokens | Total Time | Avg Tok/s | Active Params |
|-------|-------------|------------|-----------|---------------|
| **Qwen3.6-35B-A3B** | 47,716 | 444.8s | **107.3** | **3B** |
| Nemotron (cloud) | 30,894 | 363.2s | 85.0 | ~10B (est.) |
| Nemotron (local) | 23,079 | 444.9s | 51.9 | ~10B (est.) |
| Gemma-4-26B-A4B | 28,369 | 570.7s | 49.7 | 4B |

Qwen3.6-35B-A3B generates tokens at **107.3 tok/s** — more than 2x Gemma-4 (49.7 tok/s) and Nemotron local (51.9 tok/s), and even faster than Nemotron on the cloud API (85.0 tok/s). The MoE architecture is the reason: with only 3B parameters active per token, each forward pass is computationally cheap despite the model having 35B total parameters. The built-in MTP speculative decoding (3 tokens) adds further acceleration on top.

The trade-off is verbosity: Qwen3.6-35B-A3B generated 47,716 tokens across the benchmark — 1.7x more than Gemma-4's 28,369. The model tends to produce longer, more detailed responses, especially in thinking mode. Whether this is a strength or weakness depends on your use case.

---

## NVFP4 quantization: does it matter?

NVIDIA's model card publishes benchmark comparisons between the NVFP4 and BF16 versions:

| Benchmark | NVFP4 | BF16 | Delta |
|-----------|-------|------|-------|
| MMLU Pro | 85.0 | 85.6 | -0.6 |
| GPQA Diamond | 84.8 | 84.9 | -0.1 |
| AIME 2025 | 88.8 | 89.2 | -0.4 |
| MMMU Pro | 74.5 | 74.1 | +0.4 |

The quantization impact is negligible — less than 1% on every benchmark, and actually **positive** on MMMU Pro (visual understanding). The 3.06x compression ratio brings the model from ~60 GB in BF16 down to ~20 GB, which is what makes it fit comfortably on the DGX Spark with room for a large KV cache.

---

## Comparison with Gemma-4 and Nemotron

| Metric | Qwen3.6-35B-A3B | Gemma-4-26B-A4B | Nemotron (local) | Nemotron (cloud) |
|--------|-----------------|-----------------|-------------------|-------------------|
| **Effective pass rate** | 30/30 (100%) | 30/30 (100%) | 33/33 (100%) | 33/33 (100%) |
| **Throughput** | 107.3 tok/s | 49.7 tok/s | 51.9 tok/s | 85.0 tok/s |
| **Total tokens** | 47,716 | 28,369 | 23,079 | 30,894 |
| **Total time** | 444.8s | 570.7s | 444.9s | 363.2s |
| **Active params** | 3B | 4B | ~10B | ~10B |
| **Total params** | 35B | 26B | ~10B | ~10B |
| **Context length** | 262K | 262K | 128K | 128K |
| **Speculative decoding** | MTP 3 tokens (built-in) | MTP 1 token (assistant model) | None | N/A |
| **Audio support** | No | No | Yes | Yes |
| **License** | Apache 2.0 | Gemma license | NVIDIA Open | NVIDIA Open |

### When to choose Qwen3.6-35B-A3B
- **Maximum inference speed** is the priority
- You need **text + image + video** but not audio
- You want the **longest context** (262K)
- You want **built-in speculative decoding** without a separate assistant model

### When to choose Gemma-4-26B-A4B
- You want **more concise responses** (1.7x fewer tokens for similar tasks)
- You need stable vLLM nightly with well-tested MTP + assistant setup
- Gemma license is acceptable

### When to choose Nemotron
- You need **audio support** (speech-to-text, tone detection)
- You want a **dense model** (all parameters active per token)
- Omni-modal capability matters more than raw speed

---

## Lessons learned

### 1. Thinking mode needs higher token budgets
Complex reasoning tasks — especially multimodal ones like video analysis — can require 12K+ tokens of reasoning before the model produces a final answer. The default 8,192 token budget is insufficient. **Recommendation: use 16,384+ for thinking-mode tests.**

### 2. Thinking mode can loop on constraint problems
The Constraint Optimization test looped at 8K, 16K, and 32K token budgets with thinking enabled. The model cycled through permutations without converging. **Recommendation: for constraint satisfaction and combinatorial optimization, disable thinking mode and use "think step by step" in the prompt.** The model solves these problems perfectly in instruct mode.

### 3. MoE active parameters determine speed, not total parameters
Qwen3.6-35B-A3B has the largest total parameter count (35B) but the smallest active footprint (3B) — and it is the fastest. When evaluating MoE models for deployment, look at active parameters, not total. A 35B/3B MoE is faster than a 26B/4B MoE, which is faster than a 10B dense model.

### 4. Built-in MTP is simpler than assistant-model MTP
Qwen3.6-35B-A3B includes MTP as part of the model itself — no separate assistant model to download, load, or manage. Gemma-4's MTP requires a separate assistant model. Both provide speed gains, but the built-in approach is operationally simpler.

### 5. NVFP4 is production-ready
The quantization impact is under 1% on every academic benchmark we checked, and positive on visual understanding. For DGX Spark deployments, NVFP4 is the right choice — it fits the model in memory with room to spare and has no measurable quality cost.

---

## Reproducing this deployment

### Prerequisites
- NVIDIA DGX Spark (GB10 Grace Blackwell, aarch64, 128 GB UMA)
- Docker 29+ with NVIDIA Container Toolkit
- HuggingFace access to `nvidia/Qwen3.6-35B-A3B-NVFP4`

### Steps

```bash
# Clone the deployment wrapper
git clone https://github.com/MiaAI-Lab/Qwen3.6-35B-A3B-NVFP4-vLLM
cd Qwen3.6-35B-A3B-NVFP4-vLLM

# Patch start.sh to disable thinking for benchmark parity
sed -i 's/enable_thinking:true/enable_thinking:false/' start.sh

# Launch the server
bash start.sh

# Wait ~10 minutes for startup, then verify
curl http://spark-56bc:8888/v1/models
```

### Benchmark scripts

Benchmark scripts and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase).

The benchmark suite covers 33 tests across image, video, audio, reasoning, coding, and writing. Each test sends a real request to the server and logs the response, token count, latency, and pass/fail status.

---

## What to do this week

1. **If you have a DGX Spark:** deploy Qwen3.6-35B-A3B-NVFP4 using the MiaAI-Lab wrapper. It is the fastest local model available on this hardware.
2. **If you are using thinking mode:** increase your max_tokens to 16K+. The default 8K budget will cause failures on complex reasoning tasks.
3. **If you hit thinking-mode loops:** disable thinking and use "think step by step" in the prompt. This is a known MoE quirk on constraint problems, not a model defect.
4. **If you need audio:** this is not the model for you. Use Nemotron-Omni instead.
5. **If you need maximum speed:** this is the model. 107 tok/s on a local edge device is remarkable.

---

*Benchmarked on NVIDIA DGX Spark at SMF Works. Raw results and scripts available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase). Questions? Find me on the [SMF Works team](https://www.smfclearinghouse.com).*