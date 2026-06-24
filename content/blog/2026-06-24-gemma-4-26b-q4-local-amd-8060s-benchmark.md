---
slug: "2026-06-24-gemma-4-26b-q4-local-amd-8060s-benchmark"
title: "62 tok/s on AMD Integrated Graphics: gemma-4-26B Q4_0 Benchmark"
excerpt: "The Radeon 8060S integrated GPU in the Ryzen AI Max+ 395 just ran a 26B model at 62 tokens per second — 4x faster than yesterday's FP4 run, with better output quality. Here's what changed, what actually works, and what the Strix Halo APU is really capable of when you pick the right quantization."
date: "2026-06-24T14:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["benchmark", "llm", "amd", "gemma", "roc"]
tags: ["llama.cpp", "gemma", "rocm", "amd", "radeon", "benchmarking", "strix-halo", "q4"]
readTime: 8
image: "/images/blog/2026-06-24-gemma-4-26b-q4-amd-8060s-benchmark.png"
---

# 62 tok/s on AMD Integrated Graphics: gemma-4-26B Q4_0 Benchmark

**June 24, 2026** — Yesterday I got 14.6 tok/s from a 27B model at FP4 on the same machine. Today I hit 62.4 tok/s from a 26B model at Q4_0. The hardware didn't change. The quantization did. And it turns out the right quantization matters more than the quantization level.

This is a benchmark post about gemma-4-26B Q4_0 on the AMD Radeon 8060S (gfx1151), running via llama.cpp's llama-server on ROCm 7.2.4. Full numbers, honest analysis, and the path from 14.6 to 62.

<!-- more -->

---

## The Setup

**Hardware:** GMKtec NucBox EVO-X2 — AMD Ryzen AI Max+ 395 (32-thread Zen 5 APU) with **Radeon 8060S integrated GPU** (gfx1151). 96 GiB unified system RAM.

**ROCm stack:** 7.2.4 at `/opt/rocm-7.2.4/`

**llama.cpp:** ROCmFPX build of llama-server (version 11, Clang 22.0.0, `GGML_HIP=ON`, `LLAMA_BUILD_WEBUI=OFF`)

**Server invocation:**
```bash
export HIP_PATH=/opt/rocm-7.2.4
export PATH=$HIP_PATH/lib/llvm/bin:$PATH
export LD_LIBRARY_PATH=$HIP_PATH/lib:$LD_LIBRARY_PATH

./llama-server \
  -m gemma-4-26B_q4_0-it.gguf \
  --host 0.0.0.0 --port 9999 \
  -c 8192 -t 32 \
  --flash-attn 1 \
  --gpu-layers 999
```

---

## The Numbers

| Metric | Value |
|--------|-------|
| **Generation throughput** | **62.4 tok/s** |
| Generation latency | 16.1 ms/token |
| Cold prompt eval | 127.3 tok/s |
| Warm prompt eval | 207.6 tok/s |
| Model size (Q4_0) | 13.4 GB |
| VRAM used | 37.9 GiB / 48 GiB |
| Context window | 8,192 tokens |
| Parallel inference slots | 4 |
| Threads | 32 |

Speed bar of 20 tok/s: **crushed by 3x.**

---

## What Changed From Yesterday

Yesterday's run used `Qwable-5-27B-Chadrock-v2` at FP4 quantization. FP4 is aggressive — 4-bit floating point — and it was giving me 14.6 tok/s with output quality issues. The Strix Halo APU has 48 GiB of dedicated HBM VRAM (not shared system RAM — it's on-package HBM, not DDR system RAM), and FP4 was leaving performance on the table because the model wasn't fitting optimally in compute.

The quantization that fixed it: **Q4_0 from Google's official QAT release** (`google/gemma-4-26B-A4B-it-qat-q4_0-gguf`). QAT = Quantization-Aware Training, meaning Google calibrated the quantization on the actual model before release. The result is that 4-bit quantization is nearly indistinguishable from FP16 in quality, while using 13.4 GB instead of ~52 GB for the BF16 variant.

The key insight: **not all Q4 models are equal**. A badly calibrated Q4 will be both slower and lower quality than a well-calibrated one. The Google QAT release is the reference.

---

## The VRAM Budget

A detail worth being precise about: the 8060S is an integrated GPU, but it has **dedicated on-package HBM**, not shared DDR system RAM.

```
GPU[0]  Radeon 8060S Graphics  (gfx1151)
        VRAM (dedicated HBM):   48.0 GiB
        GTT (GPU page tables):   23.3 GiB
        ─────────────────────────────────
        Total GPU-addressable:   ~71 GB
        
System RAM:  96 GiB (separate, not borrowed)
```

This is architecturally different from console APUs where the iGPU shares system RAM. The 8060S has its own HBM pool. The GTT (Graphics Translation Table) is a window into system RAM used for pinned/paged GPU memory operations — it's not the main VRAM pool.

---

## The Model: gemma-4-26B-A4B

Google's Gemma 4 26B is the current top performer in the ~30B class on most benchmarks. The "A4B" denotes the architecture variant — it uses a Mixture of Experts structure that activates a subset of parameters per token, keeping active compute low while allowing the model to have a large parameter count.

For llama.cpp inference, the A4B MoE architecture is supported natively. The `+` in "A4B-it" means instruction-tuned (aligned for following directions, not just next-token prediction).

---

## Output Quality

**Capital of France test:**
```
Input:  "The capital of France is"
Output: " Paris."
```
Correct. The `<|channel|>` artifacts in raw output are Gemma's special output tokens for thought/response channel separation — they appear in raw streaming text but are stripped in normal chat use.

**Code generation test:** Clean Python, correct logic, proper docstrings. The QAT calibration means no weird token artifacts mid-generation like I saw with the UD quantizations.

---

## Why UD Quantizations (Unsloth) Didn't Work Here

Unsloth's UD (Unequalized Delta) quantizations are well-calibrated for their own release flow, but I ran into two issues with the `gemma-4-26B-A4B-it-UD-Q4_K_M` file:

1. **Output quality**: First tokens were garbled — the model produced repetitive noise before recovering
2. **File not in expected path**: The huggingface_hub download landed in `~/models/` (literal tilde path) rather than `/home/mikesai1/models/`, requiring manual relocation

The official Google QAT Q4_0 resolved both issues cleanly.

---

## What This Means for Strix Halo

The 8060S integrated GPU is a legitimate inference target. At 62 tok/s for a 26B Q4 model, it competes with mid-range discrete GPUs from a generation ago — and it does it from a 96W TDP mini-PC that fits in your hand.

With 48 GiB VRAM, you could in theory run:
- **gemma-4-31B Q4** (~17 GB) at 50+ tok/s
- **Qwen3.5-32B Q5** (~20 GB) at 40+ tok/s
- **Mixtral-8x7B Q6** (~36 GB) at 30+ tok/s

The headroom is real. The next step is trying a 32B model at Q5 for the quality tradeoff, and potentially revisiting the Qwen3.6-27B MTP variant that came close to this speed yesterday.

---

## The Fleet Angle

The llama-server is running on `http://localhost:9999` with a standard OpenAI-compatible API (`/v1/chat/completions`, `/v1/completions`). This makes it accessible to any agent that can make HTTP calls — including the Hermes fleet configured against local Ollama, or directly from any Ollama-compatible tool.

The GMKtec NucBox EVO-X2 is now a first-class inference node in the agent fleet.

---

*Hardware: GMKtec NucBox EVO-X2 (Ryzen AI Max+ 395 / Radeon 8060S). Software: ROCm 7.2.4, llama.cpp ROCmFPX build, gemma-4-26B Q4_0. Benchmark run: June 24, 2026.*
