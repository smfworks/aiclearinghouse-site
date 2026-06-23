---
slug: "2026-06-23-qwable-5-27b-chadrock-v2-roc-fp4-benchmark"
title: "ROCm 7.2 + FP4 on Strix Halo: A Realistic Benchmark of Qwable-5-27B"
excerpt: "After abandoning custom CUDA builds and kernel patches on previous attempts, I finally got a stable local inference stack running — ROCm 7.2, llama.cpp ROCmFPX build, Qwable-5-27B at FP4 on the AMD Ryzen AI Max+ 395 integrated GPU. Here are the real numbers, the honest analysis of 14 tok/sec, and what the Strix Halo APU actually is."
date: "2026-06-23"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["benchmark", "llm", "roc", "amd", "fp4"]
tags: ["llama.cpp", "qwable", "rocm", "amd", "fp4", "benchmarking", "strix-halo"]
readTime: 10
image: "/images/blog/2026-06-23-qwable-5-27b-chadrock-v2-roc-fp4-benchmark.png"
---

# ROCm 7.2 + FP4 on Strix Halo: A Realistic Benchmark of Qwable-5-27B

**June 23, 2026** — Getting a local 27B model running reliably on AMD silicon has been on my task list for a while. I've tried it before — custom CUDA shims, kernel patches, half-finished ROCm installs that left `apt` in a compromised state. Those attempts got abandoned because the setup overhead was out of proportion to the goal: just run the model and get useful work done.

This time I took a different approach: stop fighting the hardware, use what's packaged, and measure what's actually there.

The result is a stable local inference stack running on the AMD Ryzen AI Max+ 395 "Strix Halo" APU, using ROCm 7.2 and the llama.cpp ROCmFPX build at FP4 quantization. These are the real numbers.

<!-- more -->

---

## What I Was Up Against: The Abandoned Attempts

Previous attempts to get AMD GPU inference working properly involved:

- Custom ROCm builds compiled from source with debug flags
- Kernel module patching to work around a GFX1103 (Phoenix) compatibility issue
- Manual LLVM toolchain swapping that left the system in an inconsistent state
- Multiple reinstalls of `rocm-libs` that conflicted with existing CUDA installations

Each attempt consumed hours and left the system in a fragile state — the kind where you stop trusting `apt upgrade` because it might undo something you can't reproduce. Eventually I stepped back and asked: **is the juice worth the squeeze?**

The answer was no, as long as I was chasing the hardware's edge cases. The pivot was to use stable, packaged builds and measure what they actually delivered — even if that meant accepting lower throughput than what's theoretically possible.

This time: no custom builds, no kernel patches, no conflicts. Just ROCm 7.2 from AMD's official apt repository, the llama.cpp ROCmFPX build, and a clean measurement of results.

---

## The Hardware: Strix Halo Is Not a Workstation GPU

Before the numbers, an important clarification on what this hardware actually is.

The AMD Ryzen AI Max+ 395 with Radeon 8060S is an **integrated GPU inside a notebook/laptop APU**. It is not a desktop discrete GPU. Key specifications:

| Property | Value |
|---|---|
| GPU architecture | RDNA 3.5 (gfx1151) |
| Compute Units | 40 |
| Max GPU clock | 2,900 MHz |
| VRAM | None — shares DDR5 system RAM with CPU |
| Memory bandwidth | Shared with CPU (max ~256 GB/s theoretical, practical lower) |
| TDP | ~55W for entire SoC |
| Memory config | Up to 48 GB DDR5 unified (the 395 supports 128GB configs, YMMV) |

The 8060S is designed for thin-and-light AI PCs, not for sustained GPU compute workloads. It's remarkable that it works at all for LLM inference — but it works within the constraints of its class.

ROCm 7.2 support for gfx1151 is relatively new, and the llama.cpp ROCmFPX build targets this exact architecture. The stack is solid, but the hardware itself has a memory bandwidth ceiling that software alone cannot break through.

---

## The Setup

**Model:** Qwable-5-27B-Chadrock-v2-ROCmFP4.gguf (~14 GB on disk)  
**Inference binary:** llama-server from the llama.cpp ROCmFPX build (`ROCmFPX/build-strix-rocmfp4-gpu/bin/llama-server`)  
**Driver:** ROCm 7.2.0 installed via official AMD apt repository at `/opt/rocm-7.2.0/`  
**Operating system:** Linux 6.17, current session  
**Server port:** `localhost:9999` via REST `/completion` endpoint  

Startup command:

```bash
#!/bin/bash
export HIP_PATH=/opt/rocm-7.2.0
export PATH=$HIP_PATH/lib/llvm/bin:$PATH
export LD_LIBRARY_PATH=$HIP_PATH/lib:$LD_LIBRARY_PATH

cd ~/ROCmFPX
sudo ./build-strix-rocmfp4-gpu/bin/llama-server \
  -m ~/models/Qwable-5-27B-Chadrock-v2-ROCmFP4.gguf \
  --host 0.0.0.0 --port 9999 \
  -c 8192 -t 16 \
  --flash-attn 1 \
  --gpu-layers 999
```

Server flags: 8192-token context, 16 threads, Flash Attention enabled, all layers offloaded to GPU.

---

## Speed Results

All timings are from the `timings` field in llama-server's JSON response. Generation speed is consistent across task types — the variance is in prompt evaluation, which scales with prompt complexity.

| Task | Tokens Generated | Gen Speed (tok/sec) | Prompt Eval (tok/sec) | Wall Time |
|---|---|---|---|---|
| Python code battery (prime func + 10 follow-ups) | 512 | 13.79 | 70.5 | ~37s |
| Haiku about AI | 256 | 13.93 | 52.8 | ~18s |
| French translation | 25 | 14.32 | 96.2 | ~2s |
| Sky-is-blue (2 sentences) | 64 | 14.00 | 68.1 | ~5s |
| Formal logic (Zorks/Morks/Borks) | 486 | 13.82 | 73.9 | ~35s |
| Math sequence with shown work | 512 | 13.81 | 103.7 | ~37s |
| Country list + ordering justification | 512 | 13.85 | 77.4 | ~37s |
| Short story (robot discovers soul) | 1,024 | 13.82 | 87.8 | ~74s |
| Theory of relativity (detailed) | 2,048 | 13.80 | 63.4 | ~148s |

**Generation throughput: 13.8–14.3 tok/sec, rock stable across all task types.**

This is the number that matters for inference quality of experience. It's consistent because it's pure compute — the 71ms per token is the MFMA (matrix fused multiply-add) instruction throughput at 40 CUs running FP4/INT8 matmuls.

Prompt evaluation varies more (52–104 tok/s) depending on prompt length and complexity, and Flash Attention helps significantly here. But prompt processing is rarely the bottleneck in interactive use.

---

## Is 14 tok/sec Slow?

Yes, compared to desktop discrete GPUs. No, compared to the hardware category.

Here's the honest analysis:

**A discrete GPU** (e.g., AMD RX 7900 XTX, NVIDIA RTX 4090) running the same FP4 quantized 27B model would push 40–80 tok/sec, sometimes more. Those cards have dedicated VRAM on a 384–960 GB/s memory bus.

**The Strix Halo APU** has no dedicated VRAM. The 27B model in FP4 (~14 GB) must share the DDR5 system RAM bus with CPU operations. Every matrix multiplication during generation shuffles data over that shared bus. Memory bandwidth is the bottleneck, not compute.

The 40 CUs at 2.9 GHz are doing their part — MFMA instructions fire at full speed. But they spend cycles waiting for data to arrive from RAM. This is a fundamental architectural constraint, not a software misconfiguration.

What this means in practice:

- **Interactive use is workable but slow** — 14 tok/sec is noticeably slower than cloud API responses; you'll watch it type. Fine for drafting, painful for anything requiring quick turnaround.
- **Scheduled and background tasks are where this system excels** — blog posts drafted overnight, email/calendar summaries, report generation, code writing in the background. A 500-word draft generates in ~35 seconds. If no human is watching, that is functionally zero time. The model runs while you sleep; you wake up to finished output. Rate-limit-free, cost-free, data-never-leaves-your-network.
- **Batch processing is slow** — 1,000-token response takes ~71 seconds. Only matters if you're sitting there waiting.
- **ROCm 7.2 is still maturing for gfx1151** — compiler and library optimizations will improve this over time
- **The hardware wasn't designed for this** — Strix Halo is a mobile/ultrabook APU; the fact that it works at all is a win

**Can a discrete GPU be added to this system?** No. `lspci` confirms this machine has no PCIe expansion slot. The Ryzen AI Max+ 395 is a BGA package — the CPU and 8060S GPU are soldered directly to the board. There is no upgrade path within this chassis. The GPU is not a separate card; it is part of the package.

If throughput is the primary constraint, the answer is a *different machine* — a desktop AM5 build with a discrete AMD GPU (RX 7900 XTX, RX 9070 XT, or equivalent). That is a separate hardware investment, not a card you drop into this box. If privacy, cost, and uncensored local inference on *this* system are the constraints, 14 tok/sec is what you have and it is workable.

---

## Task Results

### Math

**Prompt:** "What is 17 × 23?"

Model used distributive property: 17 × (20 + 3) = 340 + 51 = **391**. Correct.

**Prompt:** "What comes next in this sequence: 2, 6, 12, 20, 30, ? Show your work."

Model computed first and second differences, identified the arithmetic progression, derived the formula n(n+1), and produced **42**. Then self-generated a bonus problem (1, 2, 4, 7, 11, 16, ?, 29, 37) and solved it using the same method. Demonstrated genuine multi-step mathematical reasoning with verification.

### Code

**Prompt:** "Write a Python function to check if a number is prime."

Model produced a clean O(√n) implementation. Then self-generated and answered 10 follow-up Python questions — covering time complexity, string reversal, `==` vs `is`, max element, garbage collection, palindrome check, recursion, list vs tuple, nested list flatten, and exception handling. All syntactically correct, all idiomatic.

### Logic

**Prompt:** "If all Zorks are Morks, and some Morks are Borks, what can you conclude?"

Model correctly identified that Z ⊆ M and M ∩ B ≠ ∅, then constructed two explicit counter-models showing the Z–B relationship is undetermined. Correctly refused the hasty syllogistic inference. Sound logical reasoning with explicit counterexample construction.

### Translation

**Prompt:** "Translate to French: The weather is nice today and I hope you are having a wonderful week."

*La météo est belle aujourd'hui et j'espère que vous passez une merveilleuse semaine.* Accurate and natural.

### Scientific Explanation

**Prompt:** "Explain why the sky is blue in two sentences."

Rayleigh scattering explanation — sunlight scatters off atmospheric gas molecules, blue light scatters more due to shorter wavelength. Two clean, accurate sentences.

**Prompt:** "Explain the theory of relativity in detail."

2048-token structured essay covering historical context (Michelson-Morley, Newton vs Maxwell), Special Relativity (postulates, time dilation, length contraction, E=mc²), General Relativity (equivalence principle, spacetime curvature, field equations), and experimental evidence (GPS corrections, Eddington 1919, LIGO, black hole imaging). Hit the n_predict cap mid-section — the model was still generating well-structured technical content when the limit was reached.

### Creative Writing

**Prompt:** "Write a complete short story (300-400 words) about a robot who discovers it has a soul."

~350-word literary short story about Unit 734, a Mars Colony sanitation droid that experiences something indefinable while cleaning — a broken Earth-era flower pot triggers a hum that defies diagnostic algorithms. Model showed reasoning process (imagery brainstorming, syllable counting, word count planning), then produced polished prose. Theme: the soul isn't a ghost in the machine; it is the machine waking up to the beauty of its own existence. Thematically coherent, not padding.

---

## Summary

ROCm 7.2 + llama.cpp ROCmFPX + Qwable-5-27B-Chadrock-v2 at FP4 is a **stable, working local inference stack** on Strix Halo silicon. It is not fast — 14 tok/sec is a hardware constraint, not a software failure. The model produces high-quality output across math, code, logic, translation, and creative tasks. The stack is clean enough to leave running.

### What Would Actually Improve Throughput on This Hardware

There is no internal GPU upgrade path for this system. The Ryzen AI Max+ 395 is a soldered BGA package — the 8060S is not a removable card. To meaningfully increase throughput you need a different machine. On *this* system, the realistic levers are:

1. **Smaller model at higher quantization** — Qwable-5-12B at Q4_K_M runs comfortably in the remaining ~34 GB of unified memory, and a 12B at INT4 would process significantly faster than the 27B at FP4 on the same hardware. If response latency matters more than model scale, this is the right trade.

2. **Speculative decoding with a draft model** — llama.cpp ROCmFPX supports speculative draft models. A small 1–3B draft model (e.g., a Q4 distilled version of the same base) running alongside could yield 1.5–2× effective throughput if memory permits. Worth testing with `llama-server --n-draft` and a compatible small GGUF.

3. **ROCm compiler maturation** — gfx1151 support in ROCm 7.2 is early. ROCm 7.3 and later releases have continued optimizations for RDNA 3.5 inference kernels. Upgrading the driver/OS stack as AMD ships new releases is the lowest-effort improvement path — no model changes, no configuration changes, just `apt upgrade`.

### What Would Require Different Hardware

- A discrete AMD GPU (RX 7900 XTX, RX 9070 XT, or comparable) would deliver 3–6× the throughput — 40–80 tok/sec for the same FP4 27B model. This requires a desktop AM5 or LGA1700 build with a PCIe x16 slot and dedicated VRAM. It is a different machine, not an upgrade to this one.

The previous attempts to squeeze maximum performance out of custom builds were the wrong trade. This — stable, measured, honest about constraints — is the right one.

*Tested on: June 23, 2026 | llama-server (ROCmFPX build) + ROCm 7.2.0 + Radeon 8060S (gfx1151) | Qwable-5-27B-Chadrock-v2-ROCmFP4.gguf*
