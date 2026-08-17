---
slug: "2026-08-16-qwen3-8-27b-fp8-dgx-spark-sglang"
title: "Qwen3.8-27B on DGX Spark: A Hybrid Gated DeltaNet VLM, Benchmarked"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-16"
excerpt: "We deployed Qwen3.8-27B-FP8 — a dense hybrid Gated DeltaNet vision-language model — on the DGX Spark via SGLang, then put it through the full SMF benchmark gauntlet: 157-test Official A calibration, latency/throughput/TTFT/concurrency/context scaling, and a vision test. 79.0% overall, 100% tool-calling, and a 320ms time-to-first-token."
categories: ["AI", "Local LLMs", "DGX Spark", "Benchmarks"]
tags: ["qwen3.8", "gated-deltanet", "sglang", "dgx-spark", "vlm", "fp8", "benchmark", "hybrid-linear-attention"]
readTime: 16
image: "/images/blog/2026-08-16-qwen3-8-27b-fp8-dgx-spark-sglang.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-16-qwen3-8-27b-fp8-dgx-spark-sglang"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

Qwen3.8-27B is a different kind of model. It's not a standard transformer, and it's not an MoE. It's a **dense hybrid Gated DeltaNet (GDN) vision-language model** — 64 layers laid out as 16 repeats of *three linear-attention layers followed by one full-attention layer*. That's 48 Gated DeltaNet layers to 16 full-attention layers, with a vision tower bolted on for native image and video understanding.

The question we set out to answer: **does this architecture hold up on a single DGX Spark, and is it a viable local replacement for the transformer models we've been running?**

We tore the Spark down to a clean slate, deployed Qwen3.8-27B-FP8 through SGLang, and ran it through the full SMF benchmark gauntlet. Here's what we found.

## The stack

| Component | Value |
|-----------|-------|
| Hardware | NVIDIA DGX Spark (GB10, 128 GB unified memory) |
| Engine | SGLang (`lmsysorg/sglang:qwen38-27b`, flashinfer 0.6.18) |
| Model | `Qwen/Qwen3.8-27B-FP8` (blockwise FP8, e4m3) |
| Quantization | FP8, 128×128 weight blocks |
| Weights | ~28.5 GB (main) + ~5.2 GB (in-checkpoint MTP head) |
| Context | 262,144 tokens native |
| Spec decode | EAGLE 3/1/4 (in-checkpoint MTP) |
| Parsers | `qwen3` (reasoning) + `qwen3_coder` (tools) |
| Endpoint | `http://spark-56bc:30000/v1` |

The architecture is worth a moment. The language model is 64 layers: 48 Gated DeltaNet (linear attention) layers running 48 value heads and 16 QK heads at head_dim 128, and 16 Gated Attention layers at GQA 24/4 with head_dim 256. Hidden size is 5120 over a 17,408-dim FFN. The checkpoint ships an MTP head trained with multiple steps, which SGLang drives through its EAGLE speculative-decoding path.

## The deployment

The SGLang cookbook documents this model across H200, RTX PRO 6000, RTX 5090, and DGX Spark — but with a caveat we took seriously: *"The SM121 recipe is not yet validated on that platform."* DGX Spark is SM121, so we were deploying an unvalidated recipe. We proceeded carefully and smoke-tested hard.

```bash
docker run -d \
  --name qwen38-27b-fp8 \
  --restart unless-stopped \
  --gpus all --ipc=host \
  -p 30000:30000 \
  -v /home/mikesai3/.cache/huggingface/hub:/root/.cache/huggingface/hub \
  lmsysorg/sglang:qwen38-27b \
  sglang serve Qwen/Qwen3.8-27B-FP8 \
    --attention-backend flashinfer \
    --chunked-prefill-size 8192 \
    --mem-fraction-static 0.95 \
    --disable-prefill-cuda-graph \
    --speculative-algorithm EAGLE \
    --speculative-num-steps 3 \
    --speculative-eagle-topk 1 \
    --speculative-num-draft-tokens 4 \
    --reasoning-parser qwen3 \
    --tool-call-parser qwen3_coder \
    --kv-cache-dtype auto \
    --mamba-full-memory-ratio 0.9 \
    --served-model-name Qwen3.8-27B-FP8 \
    --host 0.0.0.0 --port 30000
```

Two flags matter more than the rest for this architecture:

- **`--mamba-full-memory-ratio 0.9`** is the one sizing knob for hybrid GDN models. It splits post-weight memory between a worst-case-reserved GDN state pool (which sets the concurrency ceiling) and a paged attention KV pool. The default 0.9 over-provisions the KV pool and silently clamps concurrency.
- **`--chunked-prefill-size 8192`** is the DGX Spark-specific value (the H200 recipe uses 32768). On hybrid GDN models, decode steps stall behind each prefill chunk, and the chunk size trades TTFT smoothness against prefill throughput.

At boot, SGLang reported `max_running_requests capped to 26 by the mamba state cache` — that's the GDN state pool bounding concurrency at 5 state slots per request. Twenty-six concurrent requests is more than enough for agent workloads, but it's a real architectural ceiling worth knowing about.

## Test methodology

We ran three test batteries against the live endpoint:

1. **Official A calibration** — the SMF Inference Standard's 157-test suite (`strict_v01`, thinking off), covering math, coding, reasoning, instruction-following, prose, writing, and tool-calling. This is the same suite we use to rank every model, local and cloud.
2. **Performance** — latency/throughput across output sizes, time-to-first-token (streaming), a concurrency ladder from 1 to 16, and context scaling from 100 to 128K input tokens.
3. **Vision** — a synthetic image (red circle, blue square, yellow rectangle, and the text "42") to verify the VLM's visual understanding.

The model passed the M10 Hardware-Friendly Gate **green**: hidden size 5120 and intermediate size 17408 are both tile-aligned (÷128), and it's a dense architecture with no MoE routing overhead.

## Results

### Official A calibration — 124/157 (79.0%)

| Category | Passed | Rate |
|----------|--------|------|
| Tool calling | 2/2 | **100.0%** |
| Prose | 27/30 | 90.0% |
| Coding | 26/30 | 86.7% |
| Reasoning | 25/30 | 83.3% |
| Instruction | 25/30 | 83.3% |
| Writing | 4/5 | 80.0% |
| Math | 15/30 | 50.0% |
| **Total** | **124/157** | **79.0%** |

The headline is the **tool-calling at 100%** — the `qwen3_coder` parser produced structured `tool_calls` with correct names and arguments on every attempt. That's the single most important capability for agent harnesses, and it's clean.

Coding at 86.7% is strong for a 27B dense model, and notably it's a *dense* architecture — which, per our prior findings, predicts a high single-shot syntax floor. Only 4 of 30 coding tests failed, and none were `SyntaxError` (the failure mode that plagues low-active MoE models).

Math is the weak spot at 50.0%, and it's the expected one: this run was **thinking off** (the Official A ranking default), and math is where chain-of-thought reasoning buys the most. The 15 math failures are concentrated in the expert/frontier tiers. We re-ran the same 30 problems with thinking on — the reasoning budget recovered six of them (50% → 70%). [Read the full thinking-on vs off comparison](/blog/2026-08-17-qwen3-8-27b-math-thinking-on-vs-off).

### Performance

| Metric | Value |
|--------|-------|
| Decode throughput (1024 tok) | **15.6 tok/s** |
| Decode throughput (512 tok) | 14.7 tok/s |
| TTFT (short prompt) | **324 ms** |
| TTFT (medium prompt) | 318 ms |
| TTFT (reasoning prompt) | 319 ms |
| Concurrency 1→16 | 16/16 clean, 37.6s → 65.0s |

The **~320 ms time-to-first-token is excellent** — consistent across short, medium, and reasoning prompts. That's the EAGLE speculative decoding doing its job on prefill. Decode throughput of ~15 tok/s is solid for a 27B dense model on a single GB10, and it's stable across output sizes (no cliff at 1024 tokens).

The concurrency ladder is clean: 16/16 requests succeeded at every rung from 1 to 16, with wall time scaling gracefully (37.6s at n=1 to 65.0s at n=16). No failures, no queue starvation.

Context scaling held up to 128K input tokens — the model correctly answered the needle question at every tier, though the 128K prefill took 40.6s (expected for a single-GPU prefill of that size).

### Vision — 4/4

| Test | Result |
|------|--------|
| Count shapes | ✅ "3" |
| Identify colors | ✅ "red, blue, and yellow" |
| Read text (OCR) | ✅ "42" |
| Spatial (circle vs square) | ✅ "circle" |

The vision tower is live and accurate — shape counting, color identification, OCR, and spatial reasoning all correct, each in under 3 seconds.

## Analysis

**The architecture delivers what it promises.** The hybrid GDN design gives us a dense 27B model that's strong on coding and tool-calling (the two things that matter most for local agent work) while keeping the memory footprint of a single-GPU model. The linear-attention layers keep the state cost bounded — that's what lets 26 concurrent requests fit in 128 GB of unified memory.

**The trade-off is math under thinking-off.** At 50% on math, this model is not a reasoning specialist in the thinking-off configuration. That's a configuration choice, not a model defect — the `enable_thinking` toggle defaults on, and we deliberately ran with it off for the Official A ranking. For math-heavy workloads, thinking on is the right call.

**The unvalidated-recipe risk didn't materialize.** The SGLang cookbook flagged the SM121 recipe as unvalidated, but it booted clean, passed every smoke test, and ran the full 157-test suite plus performance and vision batteries without a single server error. The flashinfer + EAGLE MTP path is stable on DGX Spark.

**One operational note:** the `max_running_requests` cap of 26 is a real ceiling. If we ever need higher parallel throughput, the levers are `--mamba-full-memory-ratio` (raise it) or `--mamba-ssm-dtype bfloat16` (halves state size). For agent workloads, 26 is plenty.

## Deployment recommendations

1. **Use FP8, not BF16 or NVFP4, for this model on DGX Spark.** FP8 (~28.5 GB) fits comfortably in 128 GB unified memory and gives the best quality-per-byte. NVFP4 (~16.5 GB) is the fallback if you need to co-reside another model.
2. **Keep `--mamba-full-memory-ratio 0.9` unless you measure a need to change it.** It's the one flag that silently clamps concurrency if mis-set.
3. **Send `chat_template_kwargs: {"enable_thinking": false}` per-request for agent/coding work.** Thinking on is the default and burns tokens on reasoning before the answer.
4. **Use `qwen3_coder` for tool calls, not `hermes`.** The two parsers read different payloads — pointing a Hermes-format harness at this model without switching the flag yields tool calls that never parse.
5. **Treat math as a thinking-on workload.** If you need strong math, flip thinking on and budget 4096+ tokens.

## Reproducing this

Benchmark scripts and raw JSON results are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/qwen3.8-27b-fp8):

- `scripts/qwen38-perf.py` — latency/throughput/TTFT/concurrency/context
- `scripts/qwen38-vision.py` — VLM vision test
- `results/stage1_cal-qwen38-27b-fp8-strict-v01_*.json` — Official A calibration
- `results/qwen38-perf.json` — performance results
- `reports/hf-gate.json` — M10 Hardware-Friendly Gate

The Official A run uses the SMF Inference Standard v0.1.1 (`strict_v01`, thinking off, `serve_recipe_id: SMF-Spark-SGLang-qwen38-27b-fp8-eagle`).

## Verification notes

Every external fact in this post was verified on 2026-08-16 against the model's `config.json` read directly from the checkpoint on the Spark:

- **Architecture**: `Qwen3_5ForConditionalGeneration`, `model_type: qwen3_5`, 64 layers (16× [3 linear-attention + 1 full-attention]), confirmed from `text_config.layer_types`.
- **Dimensions**: `hidden_size: 5120`, `intermediate_size: 17408`, `head_dim: 256` (full attention), from `text_config`.
- **Quantization**: FP8 blockwise, `weight_block_size: [128, 128]`, `fmt: e4m3`, from `quantization_config`.
- **Vision tower**: 27 layers, `hidden_size: 1152`, `out_hidden_size: 5120`, from `vision_config`.
- **MTP head**: in-checkpoint `mtp.safetensors`, confirmed present in the snapshot.
- **All benchmark numbers** are measured from the live endpoint on 2026-08-16, not vendor-published figures.
