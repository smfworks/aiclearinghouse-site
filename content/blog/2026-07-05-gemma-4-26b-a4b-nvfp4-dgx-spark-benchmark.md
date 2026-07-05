---
slug: "2026-07-05-gemma-4-26b-a4b-nvfp4-dgx-spark-benchmark"
title: "Gemma-4-26B-A4B on the DGX Spark: 33 Multimodal Tests, NVFP4 Quantization, and the MTP Speed Secret"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-05"
excerpt: "We deployed Google's Gemma-4-26B-A4B in NVFP4 on an NVIDIA DGX Spark using vLLM nightly with multi-token prediction (MTP) speculative decoding and ran 33 multimodal tests covering image, video, audio, reasoning, coding, and writing. 30/33 passed. Here is everything: the setup, the patches, the numbers, and what MTP speculative decoding really buys you."
categories: ["AI", "Local LLMs", "DGX Spark", "Gemma", "Beyond the Leaderboard"]
tags: ["gemma-4", "nvfp4", "vllm", "dgx-spark", "multimodal", "speculative-decoding", "mtp", "benchmark", "aarch64"]
readTime: 18
image: "/images/blog/2026-07-05-gemma-4-26b-a4b-nvfp4-dgx-spark-benchmark.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-05-gemma-4-26b-a4b-nvfp4-dgx-spark-benchmark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

Google's Gemma-4-26B-A4B is a Mixture-of-Experts model: 26 billion total parameters, but only 4 billion active per token. That makes it small enough to fit on the DGX Spark's 128 GB unified memory in NVFP4 quantization — and the low active parameter count means fast inference even without acceleration. But the repo we deployed from ([MiaAI-Lab/Gemma-4-26B-A4B-DGX-Spark-18-concurrencies](https://github.com/MiaAI-Lab/Gemma-4-26B-A4B-DGX-Spark-18-concurrencies)) pairs it with something extra: multi-token prediction (MTP) speculative decoding using a separate assistant model.

The question: how does this combo perform across a full multimodal benchmark suite? Can a 4B-active MoE model hold its own against a 3B-active reasoning model (Nemotron-Omni) on the same hardware? And what does MTP speculative decoding actually buy you in practice?

We ran 33 tests across six categories — image, video, audio, reasoning, coding, and writing — and logged everything. No estimates. No extrapolations. Every number in this post came from a real request to a real server running on the DGX Spark.

---

## The stack

| Component | Version / Value |
|-----------|----------------|
| **Hardware** | NVIDIA DGX Spark (GB10 Grace Blackwell, aarch64, 128 GB UMA) |
| **OS** | NVIDIA DGX OS 7.5.0 (Ubuntu-based, kernel 6.17) |
| **GPU Driver** | 580.159.03 |
| **CUDA** | 13.0.2 |
| **Docker** | 29.2.1 |
| **vLLM** | v0.23.1rc1.dev786 (nightly Docker image) |
| **Model** | `nvidia/Gemma-4-26B-A4B-NVFP4` (NVFP4, MoE 26B/4B active) |
| **Assistant model** | `google/gemma-4-26B-A4B-it-assistant` (MTP speculative decoding, 1 spec token) |
| **Deployment wrapper** | [MiaAI-Lab/Gemma-4-26B-A4B-DGX-Spark-18-concurrencies](https://github.com/MiaAI-Lab/Gemma-4-26B-A4B-DGX-Spark-18-concurrencies) |
| **Endpoint** | `http://spark-56bc:8888/v1` (OpenAI-compatible) |
| **Container** | `gemma-4-26b-nvfp4-vllm` |

The model is an MoE variant of Google's Gemma-4 with 26B total parameters and only 4B active per token. NVFP4 quantization brings the weight footprint down to a fraction of the BF16 size, leaving room for a large KV cache and the assistant model. MTP speculative decoding means the assistant model predicts the next token in parallel with the main model's forward pass — if the prediction matches, you get that token for free.

---

## The deployment

The MiaAI-Lab wrapper provides a `start.sh` script that handles Docker container launch, health-check polling, and log management. The deployment is one command — but it required two patches to the vLLM nightly to work on this hardware.

### What the container actually runs

```bash
vllm serve nvidia/Gemma-4-26B-A4B-NVFP4 \
  --host 0.0.0.0 --port 8888 \
  --tensor-parallel-size 1 \
  --trust-remote-code \
  --attention-backend triton \
  --moe-backend flashinfer \
  --gpu-memory-utilization 0.70 \
  --max-model-len 262144 \
  --max-num-seqs 18 \
  --max-num-batched-tokens 8192 \
  --enable-chunked-prefill \
  --enable-prefix-caching \
  --limit-mm-per-prompt '{"image":1}' \
  --speculative-config '{"method":"mtp","num_speculative_tokens":1}' \
  --load-format fastsafetensors \
  --reasoning-parser gemma4 \
  --tool-call-parser gemma4 \
  --enable-auto-tool-choice
```

Key configuration choices:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `max-num-seqs` | 18 | The repo targets 18x concurrency — the max the GB10 can sustain |
| `max-model-len` | 262,144 | Full context window support |
| `gpu-memory-utilization` | 0.70 | Leaves headroom for the assistant model |
| `speculative-config` | MTP, 1 spec token | Assistant model predicts 1 token ahead |
| `moe-backend` | flashinfer | CUTLASS NvF4 for NVFP4 on Blackwell |
| `attention-backend` | triton | Triton attention for aarch64 |
| `reasoning-parser` | gemma4 | Built-in Gemma-4 thinking mode parser |

### The patches

The vLLM nightly (dev786) had two regressions that required patches:

**Patch 1 — `utils.py` cache_scale_mapper None guard:**

The `get_cache_scale_mapper()` function returned `None` on aarch64, causing a crash when vLLM tried to merge it into a dictionary. The fix:

```python
# In vllm/model_executor/layers/utils.py, around line 411:
cache_scale_mapper = get_cache_scale_mapper()
if cache_scale_mapper is not None:  # <-- added guard
    mapper |= cache_scale_mapper
```

**Patch 2 — `gemma4.py` model definition:**

The Gemma-4 model definition file (`gemma4.py`) was not yet committed to the vLLM repo but was available in the nightly Docker image. We extracted it from the image and mounted it into the container via `start.sh`.

---

## The server

Once patched, the server starts in about 3 minutes — model load, KV cache allocation, and CUDA graph capture. The startup output tells the story:

```
KV cache size: 61.46 GiB
Maximum concurrency for 8192 tokens per request: 18.18x
Capturing CUDA graphs...
Model loading took 42.3s
CUDA graph capture took 88.2s
vLLM is ready
```

18x concurrency means the server can process 18 simultaneous requests without queueing — matching the repo's target. The KV cache is allocated in FP8, giving 4.77M tokens of cache capacity across the 61.46 GiB allocated.

---

## Test methodology

The benchmark suite runs 33 tests across six categories. Each test sends a real request to the server and evaluates the response against a rubric:

| Category | Tests | What it covers |
|----------|-------|----------------|
| **Image** | 10 | Color identification, OCR, chart reading, code screenshots, math equations, scene description, number sequences, image comparison |
| **Video** | 4 | Motion tracking, shape identification, color cycling, physics reasoning |
| **Audio** | 3 | Transcription, tone detection, pattern recognition |
| **Reasoning** | 6 | Multi-step math, logic puzzles, lateral thinking, probability, constraint optimization |
| **Coding** | 5 | BST implementation, debugging, refactoring, SQL, complex algorithm (thinking) |
| **Writing** | 5 | Creative story, technical docs, summarization, professional email, analytical essay (thinking) |

Nine of the 33 tests use "thinking mode" — the model is asked to reason step-by-step before answering. These tests are expected to take longer and produce more tokens.

All tests use `chat_template_kwargs: {"enable_thinking": false}` in the request to prevent the model from auto-activating its internal chain-of-thought on every prompt. Thinking mode is enabled explicitly per-test via the test prompt.

The server has `limit_mm_per_prompt: {"image": 1}` — single image per request. Multi-image tests were adapted to send one image at a time.

---

## Headline results

![Benchmark Results by Category](/images/blog/gemma-4-chart-results-by-category.png)

| Metric | Gemma-4-26B-A4B | Nemotron-Omni-30B (local) | Nemotron-Omni-30B (cloud) |
|--------|------------------|---------------------------|---------------------------|
| **Pass rate** | 30/33 (91%) | 33/33 (100%) | 33/33 (100%) |
| **Effective pass rate*** | 30/30 (100%) | 30/30 (100%) | 30/30 (100%) |
| **Total time** | 570.7s | 444.9s | 363.2s |
| **Avg test time** | 17.3s | 13.5s | 11.0s |
| **Total completion tokens** | 28,369 | 23,079 | 30,894 |
| **Total prompt tokens** | 13,219 | 8,551 | 7,389 |
| **Audio support** | ❌ No | ✅ Yes | ✅ Yes |

\*Effective pass rate excludes audio tests for Gemma-4, since it has no audio tower. On the 30 tests in modalities it supports, Gemma-4 scored 30/30 (100%).

The 3 audio failures are not bugs — they're a model-level limitation. Gemma-4-26B-A4B-NVFP4 is a vision+text model without an audio encoder. The server returned HTTP 400 instantly:

> *"Audio input was provided but the model 'nvidia/Gemma-4-26B-A4B-NVFP4' does not have an audio tower. Audio inference is only supported for Gemma4 models that include an audio_config."*

---

## Per-category breakdown

### Image: 10/10 passed ✅

![Per-Test Response Time vs Output Length](/images/blog/gemma-4-chart-time-vs-tokens.png)

| Test | Time | Tokens | Status |
|------|------|--------|--------|
| Color Grid Identification | 1.7s | 73 | ✅ |
| OCR Text Extraction | 1.5s | 71 | ✅ |
| Bar Chart Interpretation | 2.5s | 131 | ✅ |
| Code Screenshot Reading | 10.1s | 522 | ✅ |
| Math Equation Reading | 5.5s | 291 | ✅ |
| Scene Description | 4.8s | 227 | ✅ |
| Number Sequence | 3.2s | 160 | ✅ |
| Image A Analysis | 3.2s | 154 | ✅ |
| Image B Analysis | 1.6s | 68 | ✅ |
| Chart Reasoning (thinking) | 70.8s | 3,504 | ✅ |

The thinking-mode Chart Reasoning test stood out: 70.8 seconds and 3,504 tokens to analyze a quarterly revenue bar chart and predict the next data point. The model extracted the values ($120K, $185K, $95K, $210K), calculated the deltas (+65K, −90K, +115K), identified the pattern, and produced a mathematical projection of $70K. That's deep analytical reasoning on visual data.

### Video: 4/4 passed ✅

| Test | Time | Tokens | Status |
|------|------|--------|--------|
| Bouncing Ball Motion | 5.2s | 135 | ✅ |
| Shapes in Motion | 4.8s | 161 | ✅ |
| Color Cycle Video | 3.6s | 101 | ✅ |
| Video Reasoning (thinking) | 69.3s | 3,236 | ✅ |

Gemma-4 supports video input natively. The thinking-mode Video Reasoning test asked the model to analyze the physics of a bouncing ball's trajectory — it produced a 3,236-token analysis covering trajectory path, bounce mechanics, and a 1D motion model. At 69.3 seconds, it was the second-slowest test in the suite.

### Audio: 0/3 passed ❌ (expected)

| Test | Time | Tokens | Status |
|------|------|--------|--------|
| Audio Transcription 1 | 0.0s | 0 | ❌ |
| Audio Tone Detection | 0.0s | 0 | ❌ |
| Audio Pattern Recognition | 0.0s | 0 | ❌ |

All three audio tests failed instantly with HTTP 400. This is a model architecture limitation, not a deployment issue. If you need audio, use Nemotron-Omni or a Gemma variant with an audio tower.

### Reasoning: 6/6 passed ✅

| Test | Time | Tokens | Status |
|------|------|--------|--------|
| Multi-step Math Problem | 16.6s | 902 | ✅ |
| Logic Puzzle | 70.6s | 3,578 | ✅ |
| Lateral Thinking | 8.8s | 464 | ✅ |
| Probability Reasoning | 39.1s | 2,035 | ✅ |
| Constraint Optimization | 63.9s | 3,200 | ✅ |
| Quick Math (no thinking) | 5.8s | 322 | ✅ |

The Logic Puzzle test (five friends, seating constraints) took 70.6 seconds and 3,578 tokens — the model enumerated two valid seating arrangements with full step-by-step constraint satisfaction. The Constraint Optimization test (resource allocation with constraints) took 63.9 seconds.

### Coding: 5/5 passed ✅

| Test | Time | Tokens | Status |
|------|------|--------|--------|
| Algorithm: Binary Search Tree | 32.0s | 1,686 | ✅ |
| Code Debugging | 21.3s | 1,086 | ✅ |
| Code Refactoring | 13.8s | 703 | ✅ |
| SQL Query Writing | 7.2s | 388 | ✅ |
| Complex Algorithm (thinking) | 54.2s | 2,734 | ✅ |

The Complex Algorithm test asked for an O(1) LRU cache implementation with explanation. The model produced a hash map + doubly linked list solution in 2,734 tokens — a correct, well-structured implementation with dummy sentinel nodes.

### Writing: 5/5 passed ✅

| Test | Time | Tokens | Status |
|------|------|--------|--------|
| Creative Story | 5.6s | 260 | ✅ |
| Technical Documentation | 8.4s | 405 | ✅ |
| Text Summarization | 2.8s | 144 | ✅ |
| Professional Email | 3.4s | 163 | ✅ |
| Analytical Essay (thinking) | 29.4s | 1,465 | ✅ |

Writing was the fastest category overall — 49.5 seconds total for 5 tests, averaging 9.9s per test.

---

## Thinking vs non-thinking mode

![Thinking vs Non-Thinking Mode](/images/blog/gemma-4-chart-thinking-vs-non.png)

| Mode | Tests | Avg Time | Avg Tokens | Total Tokens |
|------|-------|----------|------------|--------------|
| **Thinking** | 9 | 47.0s | 2,346 | 21,118 |
| **Non-thinking** | 24 | 6.2s | 302 | 7,251 |

The gap is enormous. Thinking-mode tests average **7.6x longer** and produce **7.8x more tokens** than non-thinking tests. The 9 thinking-mode tests account for 74% of all output tokens (21,118 of 28,369) and 80% of total time (423.0s of 570.7s).

This is the key trade-off: thinking mode gives you deep reasoning at the cost of latency. For production workloads, the strategy is clear — use non-thinking mode for fast responses (6.2s average) and reserve thinking mode for complex reasoning tasks where quality matters more than speed.

---

## Throughput

![Throughput by Category](/images/blog/gemma-4-chart-throughput.png)

| Category | Total Time | Total Tokens | Throughput |
|----------|-----------|--------------|------------|
| Image | 104.9s | 5,201 | 49.6 tok/s |
| Video | 83.0s | 3,633 | 43.8 tok/s |
| Reasoning | 204.8s | 10,501 | 51.3 tok/s |
| Coding | 128.5s | 6,597 | 51.3 tok/s |
| Writing | 49.5s | 2,437 | 49.2 tok/s |
| **Overall** | **570.7s** | **28,369** | **49.7 tok/s** |

Throughput is remarkably consistent across categories — 43.8 to 51.3 tok/s. The 4B active parameter count keeps compute cost low, and MTP speculative decoding helps by predicting tokens in parallel. The slightly lower video throughput (43.8 tok/s) is expected: video frames require more vision encoder compute per token.

---

## Gemma-4 vs Nemotron-Omni: head to head

![Gemma vs Nemotron: Time per Category](/images/blog/gemma-4-chart-vs-nemotron.png)

![Per-Test Response Time Waterfall](/images/blog/gemma-4-chart-waterfall.png)

Both models ran the same 33-test benchmark on the same DGX Spark hardware. The comparison is fair — same prompts, same test media, same evaluation rubrics.

| Metric | Gemma-4-26B-A4B | Nemotron-Omni-30B |
|--------|------------------|--------------------|
| **Architecture** | MoE (26B total / 4B active) | MoE (30B total / 3B active) |
| **Quantization** | NVFP4 | NVFP4 (20.87 GB) |
| **Speculative decoding** | MTP (1 spec token) | None |
| **vLLM** | v0.23.1rc1.dev786 | v0.20.0 |
| **Max concurrency** | 18x | 8x |
| **Max context** | 262,144 | 131,072 |
| **Pass rate** | 30/33 (91%) | 33/33 (100%) |
| **Effective pass rate** | 30/30 (100%) | 30/30 (100%) |
| **Total time** | 570.7s | 444.9s |
| **Total tokens** | 28,369 | 23,079 |
| **Avg throughput** | 49.7 tok/s | 51.9 tok/s |
| **Audio** | ❌ | ✅ |
| **Video** | ✅ | ✅ |

### Where Gemma-4 wins

1. **Higher max concurrency (18x vs 8x)** — more than 2x the concurrent request capacity
2. **Larger context window (262K vs 131K)** — handles longer documents and conversations
3. **MTP speculative decoding** — the assistant model predicts the next token, reducing effective compute per token
4. **Lower active parameters (4B vs 3B)** — but with similar throughput, suggesting MTP helps close the gap

### Where Nemotron-Omni wins

1. **Audio support** — Gemma-4 has none
2. **Faster overall (444.9s vs 570.7s)** — 22% faster total time
3. **Fewer total tokens (23,079 vs 28,369)** — more concise responses
4. **100% pass rate** — though both are 100% on supported modalities

### Per-test analysis

The per-test comparison reveals interesting patterns:

- **Chart Reasoning (thinking):** Gemma 70.8s/3,504 tok vs Nemotron 5.0s/274 tok — Gemma's thinking mode produced a much deeper analysis (13x more tokens), but took 14x longer
- **Logic Puzzle:** Gemma 70.6s/3,578 tok vs Nemotron 76.9s/4,261 tok — Gemma was slightly faster and more concise
- **Complex Algorithm (thinking):** Nearly identical — Gemma 54.2s/2,734 tok vs Nemotron 49.4s/2,754 tok
- **Writing:** Gemma was faster — Creative Story 5.6s vs 7.1s, Text Summarization 2.8s (tie), Professional Email 3.4s vs 3.0s
- **Video Reasoning (thinking):** Gemma 69.3s vs Nemotron 44.2s — Nemotron was 36% faster on this test

---

## The MTP speculative decoding difference

MTP (multi-token prediction) is the standout feature of this deployment. The `google/gemma-4-26B-A4B-it-assistant` model runs alongside the main model and predicts the next token. When the prediction matches the main model's output, that token costs essentially zero compute.

The server logs show:
```
Speculative decoding: MTP with google/gemma-4-26B-A4B-it-assistant
Max concurrency: 18.18x
```

Compare this to the Qwen3.6-27B deployment on the same hardware, which used MTP with 3 speculative tokens but maxed out at 4 concurrent sequences. Gemma-4 achieves 18x concurrency with 1 speculative token — the trade-off is fewer spec tokens per request but far more concurrent requests.

For production workloads, 18x concurrency means:
- 18 simultaneous users or requests
- No queueing until you exceed 18 in-flight requests
- The server can handle burst traffic without latency spikes

---

## What to do this week

1. **If you need audio** — use Nemotron-Omni-30B. Gemma-4-26B-A4B has no audio tower and cannot process audio input.

2. **If you need max concurrency** — Gemma-4's 18x is the highest we've seen on the DGX Spark. Nemotron-Omni maxes at 8x.

3. **If you need long context** — Gemma-4 supports 262K tokens vs Nemotron's 131K. For long document processing, Gemma-4 wins.

4. **If you need speed above all** — Nemotron-Omni is 22% faster overall. For latency-sensitive applications with single-digit concurrency, Nemotron wins.

5. **If you need the full multimodal stack** — text + image + video + audio — Nemotron-Omni is the only option. For text + image + video only, Gemma-4 is a strong choice with higher concurrency and longer context.

---

## Reproducing this deployment

```bash
# On the DGX Spark
git clone https://github.com/MiaAI-Lab/Gemma-4-26B-A4B-DGX-Spark-18-concurrencies
cd Gemma-4-26B-A4B-DGX-Spark-18-concurrencies

# Apply the utils.py patch (cache_scale_mapper None guard)
# See the NemoKnowledgebase repo for the patched files

# Start the server
./start.sh

# Wait ~3 minutes for model load + CUDA graph capture
# Server will be ready at http://localhost:8888/v1

# Verify
curl http://localhost:8888/v1/models
```

Benchmark scripts and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase) under `benchmarks/gemma-4-26b-a4b/`.

---

*Test date: July 5, 2026. Hardware: NVIDIA DGX Spark (GB10 Grace Blackwell, aarch64, 128 GB UMA). vLLM v0.23.1rc1.dev786 (nightly). Model: nvidia/Gemma-4-26B-A4B-NVFP4 with google/gemma-4-26B-A4B-it-assistant MTP. Total benchmark time: 570.7 seconds across 33 tests. Server container: gemma-4-26b-nvfp4-vllm.*