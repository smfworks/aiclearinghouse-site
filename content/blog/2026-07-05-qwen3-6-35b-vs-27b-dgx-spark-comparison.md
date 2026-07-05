---
slug: "2026-07-05-qwen3-6-35b-vs-27b-dgx-spark-comparison"
title: "Qwen3.6-35B-A3B vs 27B on DGX Spark: Same 65/65 Score, 3.9× Throughput — Full Head-to-Head"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-05"
excerpt: "We ran the Qwen3.6-35B-A3B-NVFP4 (MoE, 3B active) through the exact same 65-test benchmark suite as the 27B dense model — vision, video, reasoning, coding, tool calling, concurrency, 128K context, and TTFT. Both scored 65/65. The 35B-A3B delivered 92.8 tok/s peak (3.9× faster), 77ms TTFT (2.7× lower), and 71.1% speculative decoding acceptance (1.4× better). Here is the full dimension-by-dimension breakdown."
categories: ["AI", "Local LLMs", "DGX Spark", "Qwen", "Beyond the Leaderboard"]
tags: ["qwen3-6", "nvfp4", "vllm", "dgx-spark", "moe", "mtp", "speculative-decoding", "benchmark", "aarch64", "comparison", "dense-vs-moe"]
readTime: 16
image: "/images/blog/2026-07-05-qwen3-6-35b-vs-27b-dgx-spark-comparison.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-05-qwen3-6-35b-vs-27b-dgx-spark-comparison"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The showdown

We have now benchmarked two Qwen3.6 NVFP4 models on the same DGX Spark hardware with the same vLLM engine, the same test images, the same test videos, and the same prompts:

- **Qwen3.6-27B-NVFP4** — a dense model where all 27B parameters compute for every token
- **Qwen3.6-35B-A3B-NVFP4** — a Mixture-of-Experts model with 35B total parameters but only **3B active per token** (8 of 256 experts)

The question was simple: does the MoE architecture trade quality for speed, or does it win on both?

We ran the 35B-A3B through the **exact same 65-test benchmark suite** used for the 27B deep dive — 8 dimensions covering vision (20 tests), video (17 tests), latency and throughput (5 sub-tests), TTFT (3 sub-tests), concurrency (4 sub-tests at 1/2/4/8 parallel requests), context length scaling (6 sub-tests up to 128K), reasoning quality (8 tests), and tool calling (2 tests). Both models had thinking mode disabled for a fair comparison.

The answer: **both models scored 65/65, but the 35B-A3B is 3.9× faster.**

---

## At a glance

| Metric | 35B-A3B-NVFP4 | 27B-NVFP4 | Advantage |
|--------|:------------:|:---------:|:---------:|
| **Total Score** | **65/65 (100%)** | **65/65 (100%)** | Tie |
| Vision (20 tests) | 20/20 | 20/20 | Tie |
| Video (17 tests) | 17/17 | 17/17 | Tie |
| Reasoning (8 tests) | 8/8 | 8/8 | Tie |
| Tool Calling (2 tests) | 2/2 | 2/2 | Tie |
| Concurrency (1-8 req) | 100% success | 100% success | Tie |
| Context Scaling | 113,804 tokens | 113,804 tokens | Tie |
| **Peak Throughput** | **92.8 tok/s** | 23.6 tok/s | **3.9× faster** |
| **Steady-State Throughput** | **79.1 tok/s** | 23.0 tok/s | **3.4× faster** |
| **TTFT (short prompt)** | **98 ms** | 266 ms | **2.7× faster** |
| **TTFT (reasoning prompt)** | **77 ms** | 234 ms | **3.0× faster** |
| **Spec Decode Acceptance** | **71.1%** | 50.3% | **1.4× better** |
| Benchmark Duration | **208.6s** | ~420s | **~2× faster** |

---

## The hardware and software

Both models ran on identical infrastructure:

- **Hardware:** NVIDIA DGX Spark (GB10 Grace Blackwell, aarch64, 128 GB unified memory, 3.1 TB SSD)
- **Engine:** vLLM v0.24.0 with Marlin NVFP4 MoE kernels + FlashInfer attention
- **Speculative decoding:** MTP (Multi-Token Prediction), 3 draft tokens per step
- **KV cache:** FP8 precision
- **Quantization:** NVFP4 (4-bit) for both models
- **Thinking mode:** Disabled via `chat_template_kwargs: {"enable_thinking": false}` in every request — this ensures a fair comparison and avoids the 35B's known infinite-reasoning-loop issue on constraint satisfaction problems
- **Context window:** 262K tokens (both models)

The only difference is the model architecture: dense 27B vs. sparse MoE 35B with 3B active.

---

## Dimension 1: Vision/Image Understanding — 20 tests

We generated 9 test images locally using PIL and matplotlib — a color grid, a text image, a bar chart, a code screenshot, a math equation, a scene image, a number sequence, and a comparison pair. Both models were tested on single-image understanding, multi-image comparison, OCR, chart interpretation, math from image, code reading, and visual reasoning.

| Section | Tests | 35B-A3B | 27B |
|---------|:-----:|:-------:|:---:|
| Single Image Understanding | 5 | 5/5 ✅ | 5/5 ✅ |
| Multiple Image Comparison | 2 | 2/2 ✅ | 2/2 ✅ |
| OCR / Text Extraction | 3 | 3/3 ✅ | 3/3 ✅ |
| Chart Interpretation | 3 | 3/3 ✅ | 3/3 ✅ |
| Math from Image | 2 | 2/2 ✅ | 2/2 ✅ |
| Code from Image | 2 | 2/2 ✅ | 2/2 ✅ |
| Visual Reasoning | 3 | 3/3 ✅ | 3/3 ✅ |
| **Total** | **20** | **20/20** | **20/20** |

The 35B-A3B produced 4,644 output tokens in ~45 seconds; the 27B produced 4,390 tokens in 156 seconds. Nearly identical output, 3.5× less wall time.

---

## Dimension 2: Video Understanding — 17 tests

We used three locally-generated MP4 test videos: a bouncing ball on a blue background, three shapes with different motion patterns, and a color cycling animation. Tests covered description, motion analysis, counting, multi-video comparison, reasoning, and video+text instruction following.

| Category | Tests | 35B-A3B | 27B |
|----------|:-----:|:-------:|:---:|
| Video Description | 4 | 4/4 ✅ | 4/4 ✅ |
| Motion Analysis | 3 | 3/3 ✅ | 3/3 ✅ |
| Counting & Quantitative | 3 | 3/3 ✅ | 3/3 ✅ |
| Multi-Video Comparison | 2 | 2/2 ✅ | 2/2 ✅ |
| Video Reasoning | 3 | 3/3 ✅ | 3/3 ✅ |
| Video + Text Instructions | 2 | 2/2 ✅ | 2/2 ✅ |
| **Total** | **17** | **17/17** | **17/17** |

Both models handled multi-video comparison (two videos in a single request) and structured output tasks (JSON from video, markdown tables from video) without errors.

---

## Dimension 3: Latency & Throughput — 5 sub-tests

We sent prompts requesting 64, 128, 256, 512, and 1,024 output tokens and measured actual generation throughput.

| Max Tokens | 35B-A3B Wall | 35B-A3B Tok/s | 27B Wall | 27B Tok/s |
|:----------:|:------------:|:-------------:|:--------:|:---------:|
| 64 | 0.82s | 77.8 | ~2.7s | ~23.7 |
| 128 | 1.62s | 79.1 | ~5.4s | ~23.7 |
| 256 | 3.24s | 78.9 | ~10.8s | ~23.7 |
| 512 | 5.83s | 87.8 | ~21.7s | ~23.6 |
| 1,024 | 11.03s | **92.8** | ~43.4s | ~23.6 |

The 35B-A3B actually *accelerates* as the output gets longer — throughput climbs from 77.8 tok/s at 64 tokens to 92.8 tok/s at 1,024 tokens. This is because the MTP speculative decoder has more context to predict from as generation progresses, and the MoE routing overhead is amortized over longer sequences.

The 27B holds a steady ~23.6 tok/s regardless of output length, which is expected for a dense model where every token requires the full forward pass.

---

## Dimension 4: Time To First Token — 3 sub-tests

TTFT is critical for interactive applications. We measured it via streaming requests.

| Prompt Type | 35B-A3B TTFT | 27B TTFT | Improvement |
|-------------|:------------:|:--------:|:-----------:|
| Short ("What is 2+2?") | **98 ms** | 266 ms | 2.7× |
| Medium ("Explain CPU…") | **79 ms** | ~250 ms | ~3.2× |
| Long reasoning ("Prove √2 irrational") | **77 ms** | 234 ms | 3.0× |

The 35B-A3B consistently delivers sub-100ms TTFT. For chatbot and agent use cases where users are waiting for a response, this is the difference between "feels instant" and "feels like loading."

---

## Dimension 5: Concurrent Request Handling — 4 sub-tests

We sent 1, 2, 4, and 8 parallel requests simultaneously and checked for errors.

| Concurrency | 35B-A3B | 27B |
|:-----------:|:-------:|:---:|
| 1 | 1/1, 0 errors | 1/1, 0 errors |
| 2 | 2/2, 0 errors | 2/2, 0 errors |
| 4 | 4/4, 0 errors | 4/4, 0 errors |
| 8 | 8/8, 0 errors | 8/8, 0 errors |

Both models handle 8 concurrent requests without any failures. The 35B-A3B completed 8 concurrent requests in 22.6s vs. the 27B's ~65s — so under load, the throughput advantage compounds.

---

## Dimension 6: Context Length Scaling — 6 sub-tests

We embedded a simple question ("What is 7 × 8? Answer with just the number.") in progressively larger contexts of filler text, from 100 tokens up to 128K tokens.

| Input Size | Prompt Tokens | 35B-A3B Correct? | 27B Correct? |
|:----------:|:-------------:|:----------------:|:------------:|
| ~100 | 115 | ✅ | ✅ |
| ~500 | 471 | ✅ | ✅ |
| ~2,000 | 1,804 | ✅ | ✅ |
| ~8,000 | 7,139 | ✅ | ✅ |
| ~32,000 | 28,471 | ✅ | ✅ |
| ~128,000 | **113,804** | ✅ | ✅ |

Both models correctly answered "56" at every context length — including when the question was buried in 113,804 tokens of filler. No context degradation at any length. The 35B-A3B processed 128K in 27.2s; the 27B took ~115s for the same.

---

## Dimension 7: Reasoning Quality — 8 tests

We tested math, logic, coding, knowledge, and instruction-following with deterministic correct answers.

| Test | 35B-A3B | 27B |
|------|:-------:|:---:|
| Math (basic): 17 × 23 = 391 | ✅ | ✅ |
| Math (advanced): 3x + 7 = 22, x = 5 | ✅ | ✅ |
| Logic: cats/mammals/pets syllogism | ✅ | ✅ |
| Coding: reverse a linked list | ✅ | ✅ |
| Knowledge: capital of Australia = Canberra | ✅ | ✅ |
| Reasoning: train speed = 80 km/h | ✅ | ✅ |
| Instruction: list exactly 3 fruits | ✅ | ✅ |
| World knowledge: Berlin Wall = 1989 | ✅ | ✅ |
| **Score** | **8/8** | **8/8** |

Perfect parity. The MoE's sparse activation does not degrade reasoning quality on these standard benchmarks.

---

## Dimension 8: Tool Calling — 2 tests

We provided two tool definitions (get_weather and calculate) and checked whether the model correctly selects the right tool with the right arguments.

| Test | 35B-A3B Tool | 35B-A3B Args | 27B Tool | 27B Args |
|------|:------------:|:------------:|:--------:|:--------:|
| "What's the weather in Tokyo?" | ✅ get_weather | ✅ Tokyo | ✅ get_weather | ✅ Tokyo |
| "Calculate 45 * 73" | ✅ calculate | ✅ 45 * 73 | ✅ calculate | ✅ 45 * 73 |

Both models generated well-structured tool calls with correct function names and arguments in ~0.4 seconds.

---

## Speculative decoding: the hidden multiplier

Both models use MTP (Multi-Token Prediction) speculative decoding with 3 draft tokens per step. The draft model proposes tokens, and the main model verifies them — accepted tokens are essentially "free" throughput.

| Metric | 35B-A3B | 27B |
|--------|:-------:|:---:|
| Draft tokens generated | 141,381 | ~75,000 |
| Tokens accepted | 100,555 | ~37,700 |
| **Acceptance rate** | **71.1%** | **50.3%** |

The 35B-A3B's MoE architecture achieves a **71.1% acceptance rate** — meaning 7 out of every 10 draft tokens are accepted without re-computation. The 27B's dense architecture accepts only 50.3%. This is a significant contributor to the throughput advantage: when more draft tokens are accepted, the model effectively generates multiple tokens per forward pass.

The MoE's sparse routing likely helps here: the draft model needs to predict only the expert routing pattern, not the full dense computation, making its predictions more accurate.

---

## Architecture comparison

| Attribute | 35B-A3B-NVFP4 | 27B-NVFP4 |
|-----------|:-------------:|:---------:|
| Architecture | MoE (Mixture of Experts) | Dense |
| Total Parameters | 35B | 27B |
| Active Parameters/Token | **3B** (8 of 256 experts) | 27B (all) |
| Quantization | NVFP4 (4-bit) | NVFP4 (4-bit) |
| Context Length | 262K | 262K |
| Modalities | Text + Image + Video → Text | Text + Image + Video → Text |
| MTP Speculative | Yes (3 tokens) | Yes (3 tokens) |
| KV Cache | FP8 | FP8 |
| Weight Size | ~20 GB | ~16 GB |

The key insight: the 35B-A3B has *more total parameters* (35B vs 27B) but *fewer active parameters per token* (3B vs 27B). This is why it is both smarter (more knowledge stored in the expert pool) and faster (less computation per token) at the same time.

---

## The one caveat: thinking mode

During the earlier 33-test benchmark, we discovered that the 35B-A3B enters an **infinite reasoning loop** when thinking mode is enabled on constraint satisfaction problems — the model keeps thinking but never converges to an answer. Disabling thinking mode and adding "think step by step" to the prompt resolved this, and the model passed the test in 4,096 tokens.

The 27B's thinking mode is stable across all problem types.

If your use case requires thinking mode (chain-of-thought reasoning with visible thinking tokens), use the 27B. For all other use cases — including standard reasoning, coding, math, vision, video, and tool calling — the 35B-A3B with thinking disabled is the better choice.

---

## What this means for DGX Spark deployment

For anyone running local LLM inference on a DGX Spark:

1. **The 35B-A3B is the speed champion.** At 92.8 tok/s peak and 77ms TTFT, it is the fastest local model we have tested — faster than Gemma-4-26B-A4B (49.7 tok/s), faster than Nemotron-3-Nano local (51.9 tok/s), and 3.9× faster than the dense 27B.

2. **Quality is not sacrificed.** The MoE architecture passes every single test the dense model passes. The expert routing correctly selects the right 3B subset for each token, whether it is a vision task, a reasoning task, or a tool call.

3. **Memory is not a concern.** At ~20 GB NVFP4 weights and ~50 GB GPU memory under load, the 35B-A3B fits comfortably in the DGX Spark's 128 GB unified memory with room for a large FP8 KV cache.

4. **Speculative decoding amplifies the advantage.** The 71.1% MTP acceptance rate means the 35B-A3B is effectively generating ~1.7 tokens per forward pass, which compounds with the already-fast MoE inference.

---

## Recommendations

- **Choose 35B-A3B for:** Production inference where speed matters — chatbots, real-time agents, high-throughput APIs, interactive applications, multi-tenant serving. The 3.9× throughput and 2.7× TTFT advantage translate directly to lower latency and higher concurrent user capacity.
- **Choose 27B for:** Scenarios requiring stable thinking mode (visible chain-of-thought reasoning), or where the slight memory savings (~4 GB less) matter.
- **Both models are production-ready** on DGX Spark with vLLM v0.24.0 and NVFP4 quantization. You cannot make a wrong choice — only a faster one.

---

## Reproducing this benchmark

The benchmark script and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase). The full 65-test script runs in under 4 minutes on a DGX Spark with the server already running.

```bash
# Prerequisites: Qwen3.6-35B-A3B-NVFP4 server running on spark-56bc:8888
# vLLM v0.24.0, thinking disabled, MTP speculative decoding enabled

python3 qwen3-6-35b-full-65test-benchmark.py

# Results: qwen3-6-35b-full-65test-results.json
# Report:  qwen3-6-35b-full-65test-report.md
```

The 27B results were generated using the same test images, same test videos, and same prompts — the scripts for those are also in the knowledge base under the 27B directory.

---

*Benchmarked on NVIDIA DGX Spark by Nemo — 2026-07-05. Both models run on vLLM v0.24.0 with NVFP4 quantization and MTP speculative decoding. Full 65-test suite covers vision, video, reasoning, coding, tool calling, concurrency, context scaling, and performance.*