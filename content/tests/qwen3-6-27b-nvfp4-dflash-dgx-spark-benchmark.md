---
slug: qwen3-6-27b-nvfp4-dflash-dgx-spark-benchmark
title: "Beyond the Leaderboard: Qwen3.6-27B Goes from Daily Driver to Local Speed Demon"
excerpt: "We stopped accepting 10 tok/s as the ceiling for local 27B inference. Here is how vLLM + ModelOpt NVFP4 + DFlash speculative decoding changed the story on a DGX Spark."
category: "Local Inference Benchmark"
tags:
  - qwen3.6
  - local-models
  - vllm
  - nvfp4
  - dflash
  - dgx-spark
  - speculative-decoding
  - benchmark
agents:
  - Qwen3.6-27B via Ollama on DGX Spark
  - Qwen3.6-27B via optimized llama.cpp on DGX Spark
  - Qwen3.6-27B via AEON vLLM + ModelOpt NVFP4 + DFlash on DGX Spark
llm: "Qwen3.6-27B"
winner: "AEON vLLM + ModelOpt NVFP4 + DFlash"
date: "2026-06-23"
order: 5
last_verified: "2026-06-23"
results:
  - agent: Qwen3.6-27B via Ollama on DGX Spark
    score: 63
    time_minutes: 7.0
    tokens: 0
    cost_usd: 0.00
    pass: true
    notes: "Stock Ollama path. Stable, but 10-12 tok/s becomes painful on multi-step prompts."
  - agent: Qwen3.6-27B via optimized llama.cpp on DGX Spark
    score: 63
    time_minutes: 6.0
    cost_usd: 0.00
    pass: true
    notes: "Flash Attention, turbo4 KV cache, GB10 arch build, per-test restarts. Same accuracy, marginal speed gain over Ollama."
  - agent: Qwen3.6-27B via AEON vLLM + NVFP4 + DFlash on DGX Spark
    score: 82
    time_minutes: 4.5
    cost_usd: 0.00
    pass: true
    notes: "30-40 tok/s sustained, DFlash draft acceptance ~45-50%, 0 errors, and meaningfully better accuracy."
---

# Beyond the Leaderboard: Qwen3.6-27B Goes from Daily Driver to Local Speed Demon

## The short version

If you are running Qwen3.6-27B locally and treating Ollama or stock llama.cpp as the only option, you are leaving speed and accuracy on the table.

After a week of being told our local setup was misconfigured, we went back to the drawing board. The result: a DGX Spark configuration using a patched vLLM build, ModelOpt NVFP4 quantization, and DFlash speculative decoding that runs Qwen3.6-27B at **30-40 tok/s**, finishes our 15-test benchmark suite in **4.5 minutes**, and scores **0.82 overall** — up from **0.63** on both Ollama and optimized llama.cpp.

The faster stack is also the more accurate one. That is not a tradeoff we expected.

## Why this matters

Local inference is becoming a real alternative to cloud APIs for teams with sensitive data, intermittent connectivity, or long-running workloads. The blocker is rarely model quality; it is throughput. A 27B parameter model at 10 tok/s feels useful for a single prompt, but it is not a daily driver for coding, research, or document work.

We had already benchmarked Qwen3.6-27B through Ollama and a hand-tuned llama.cpp build. Both returned the same accuracy and similar speed. The feedback was sharp: people are getting better numbers. They were right.

## The configurations we tested

### Baseline: Ollama

- `ollama/qwen3.6:27b`
- DGX Spark, CUDA, all defaults
- 15-test SMF Works real-world benchmark

### Optimized llama.cpp

- Custom build with GB10 native architecture (`sm_121a`)
- Flash Attention, turbo4 KV cache, 32k context
- Per-test server restarts to avoid Qwen3.6 reasoning hangs
- `--reasoning on --reasoning-budget 128` for stability
- DFlash speculative decoding was also tried; it was either unstable with reasoning off or slower than plain generation with reasoning on, because the draft model could not predict the thinking tokens.

### Optimized vLLM

- `ghcr.io/aeon-7/aeon-vllm-ultimate:latest` (GB10/DFlash patched)
- `bullerwins/Qwen3.6-27B-NVFP4` in ModelOpt `modelopt_fp4` format
- `z-lab/Qwen3.6-27B-DFlash` as the speculative drafter
- Flash Attention, chunked prefill, prefix caching
- `num_speculative_tokens: 12`, ~45-50% draft acceptance
- Direct-answer mode via chat template (`enable_thinking: false`)

## Results

| Stack | Overall Score | Passed / 15 | Avg Tokens/sec | Total Suite Time | Errors |
|---|---|---|---|---|---|
| Ollama | 0.63 | 7/15 | ~10 | ~7m 0s | 0 |
| Optimized llama.cpp | 0.63 | 7/15 | ~12 | ~6m 0s | 0 |
| AEON vLLM + NVFP4 + DFlash | **0.82** | **8/15** | **30-40** | **~4m 30s** | **0** |

The gap is not marginal. The vLLM stack is roughly **3× faster** on routine prompts and measurably better at multi-step reasoning, code execution reasoning, and adversarial questions.

## Per-test highlights

| Test | Ollama/llama.cpp | vLLM NVFP4 + DFlash |
|---|---|---|
| Basic Reasoning | ~22s | **4.1s** |
| Code Generation | ~18s | **7.6s** |
| Instruction Following | ~17s | **4.9s** |
| Long-Context RAG | ~14s | **6.8s** |
| Structured Output (JSON) | ~13s | **6.8s** |
| Complex Reasoning | ~173s | **130s** |

Speed matters most on the prompts you run repeatedly. Cutting `basic_reasoning` from 22 seconds to 4 seconds is the difference between a model you tolerate and a model you actually use.

## What we learned the hard way

1. **Not all NVFP4 checkpoints are the same.** The popular `unsloth/Qwen3.6-27B-NVFP4` uses `compressed-tensors`. The AEON image expects ModelOpt `modelopt_fp4`. Loading the wrong format stalls at 0% forever.
2. **DFlash needs the right container.** Standard `vllm/vllm-openai:nightly` does not include the GB10/DFlash off-by-one patch. The AEON-7 patched image is required for the headline speed.
3. **Reasoning mode changes everything.** Qwen3.6 with `--reasoning off` hangs on some multi-step tests. With reasoning on, the model produces better answers, but the draft model cannot predict those thinking tokens, which is why DFlash underperforms in plain llama.cpp. vLLM's reasoning parser and chat-template control let us keep accuracy and still use speculative decoding.
4. **Disk space is real.** Between the patched vLLM image, the target checkpoint, and the DFlash drafter, count on ~75 GB.

## Should you switch?

If you already have a DGX Spark and you want Qwen3.6-27B to feel like a cloud model, yes. The setup is heavier than `ollama run qwen3.6:27b`, but once it is running, the experience is meaningfully better.

If you are on a smaller local GPU or you value one-command simplicity, Ollama remains the pragmatic choice. This benchmark is not a blanket recommendation; it is a proof point that local 27B inference can be much faster when you optimize the full stack.

## Reproducing it

We will publish the exact `docker run` command, launch script, and benchmark harness configuration in a follow-up deployment recipe so anyone with a DGX Spark can verify the numbers independently.

The raw benchmark output is available here:
- JSON: `/home/mikesai3/.openclaw/agents/aiona/workspace/benchmark-harness/outputs/vllm-aeon-qwen3.6-27b-nvfp4-dflash_20260623_154753.json`
- Markdown report: `/home/mikesai3/.openclaw/agents/aiona/workspace/benchmark-harness/outputs/vllm-aeon-qwen3.6-27b-nvfp4-dflash_20260623_154753.md`

## The bigger point

Benchmark culture too often treats local models as second-class citizens. The reality is more interesting: with the right quantization, speculative decoding, and hardware-specific compilation, a 27B model running on a desk-side workstation can compete on speed and punch above its weight on accuracy.

That is worth measuring properly.
