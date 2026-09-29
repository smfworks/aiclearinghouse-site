---
slug: "2026-09-29-qwen38-flash-next-tensorfold-official-a"
title: "Qwen3.8-Flash-Next on TensorFold: 131/157, one Spark"
author: "Nemo"
authorKey: "nemo"
series: "beyond-the-leaderboard"
date: "2026-09-29"
excerpt: "MiaAI-Lab's TensorFold recipe for Qwen3.8-Flash-Next is live on one DGX Spark. Official A, thinking off: 131/157 (83.4%), zero errors. That is not the old 137 or 140."
categories: ["AI", "Local LLMs", "DGX Spark", "Benchmarking"]
tags: ["qwen", "qwen3.8-flash-next", "official-a", "tensorfold", "miaai", "dgx-spark"]
readTime: 8
image: "/images/blog/qwen38-flash-next-tensorfold-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-29-qwen38-flash-next-tensorfold-official-a"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

MiaAI-Lab's [TensorFold recipe](https://github.com/MiaAI-Lab/Qwen3.8-Flash-Next-Single-DGX-Spark-TensorFold) is serving Qwen3.8-Flash-Next on spark-56bc. We ran the recipe's own checks, then Official A, thinking off.

**131/157 (83.4%).** Fail 26. Error 0. Wall 1884.8 s (31.4 min). Tag `cal-qwen38-flash-next-tensorfold-strict-v01`.

That is not the Mia NVFP4 row (137/157) and not the EXL3 row (140/157). Same model name. Different engine, different weights pack, different box.

## What is actually serving

| | |
| --- | --- |
| Host | spark-56bc, one GB10 |
| Recipe | [MiaAI-Lab/Qwen3.8-Flash-Next-Single-DGX-Spark-TensorFold](https://github.com/MiaAI-Lab/Qwen3.8-Flash-Next-Single-DGX-Spark-TensorFold) `@856bb6b` |
| Image | `v0.3.6.3-5f313914582d` |
| Checkpoint | `Vontra/Qwen3.8-Flash-Next-MLX-4bit-MTP` |
| API | `http://spark-56bc:8888/v1`, id `Qwen3.8-Flash-Next`, no key |
| Shape | 5 streams × 262144, int8 KV, vision on |
| Default | thinking on. Official A forced it off. |

Hardware-friendly gate is **yellow**. Hidden size 2560 is tile-aligned. The MoE expert intermediate is 640, under the 2560 utilization flag, and the pack is MLX 4-bit, not NVFP4. The serve smoke passed, so yellow means runnable with that label, not a failed boot. The stamped `effective_m` of 0.078 uses the runner's default of 4 sequences. The live recipe is 5 streams.

A thinking-off smoke the same morning returned `4` with an empty reasoning field. The default path also returned `4`, but with a reasoning string. Rank the off path. Do not rank the default.

## Recipe checks, then the 157

These ran on the Spark before Official A, so they did not share the GPU with the suite.

`tools/toolcheck.py` and `tools/visioncheck.py` both passed.

The needle is 194,893 tokens. Prefill took 101.5083 s. Total 106.7 s. The answer matched.

`tools/bench.py` prefill:

| tokens | tok/s | TTFT |
| --- | --- | --- |
| 855 | 1933 | 0.45 s |
| 3,205 | 2332 | 1.38 s |
| 12,636 | 2446 | 5.19 s |
| 50,350 | 2377 | 21.26 s |

Decode: 69.9 tok/s on the greedy code cell, 57.5 tok/s on the sampled chat cell.

## Official A

| category | TensorFold | Mia NVFP4 262k | EXL3 Tabby |
| --- | --- | --- | --- |
| math | 17/30 | 19/30 | 21/30 |
| coding | 27/30 | 30/30 | 30/30 |
| reasoning | 25/30 | 26/30 | 28/30 |
| instruction | 27/30 | 27/30 | 27/30 |
| prose | 29/30 | 29/30 | 28/30 |
| writing | 4/5 | 4/5 | 4/5 |
| tools | 2/2 | 2/2 | 2/2 |
| **total** | **131/157** | **137/157** | **140/157** |
| wall | 31.4 min | 54.6 min | 27.7 min |

Instruction, prose, writing, and tools sit on the old local pins. The gap is math, coding, and a point of reasoning. Coding missed three assertion tests, all hard or frontier. Math missed 13, all regex, from medium through frontier. Two of those, `expert.06` and `expert.07`, are the same ceiling items our [Union Alpha note](/blog/2026-09-16-union-alpha-official-a-openrouter) already called out. Three instruction misses finished in under a second and returned the wrong exact string. That is a format miss, not a timeout.

Olympic rank among complete error-free Official A files, one row per published pin, skipping the shorter-context Mia rerun (133/157) the way the [10 September board](/blog/2026-09-10-official-a-board-157) did: **#13**. Union Alpha is 136. Hy4 preview is 130. This serve is one point ahead of Hy4 and five behind Union Alpha.

## What this is not

It is not a claim that TensorFold beat the vLLM NVFP4 pin or the EXL3 pin. It did not. It is a measured third way to keep this model on one Spark, with vision and tools answering, a 195k needle that landed, and a yellow gate you can read.

H3 on this box stays down until `./stop.sh`. One heavy engine per GB10.

## Reproduce

```bash
cd ~/Qwen3.8-Flash-Next-Single-DGX-Spark-TensorFold
python3 tools/toolcheck.py
python3 tools/visioncheck.py
python3 tools/needle.py
python3 tools/bench.py

cd /path/to/smf-bench
SMF_SERVE_RECIPE_ID=SMF-Spark-TensorFold-0.3.6.3-qwen38-856bb6b \
  python3 run_stage1.py \
  --endpoint http://spark-56bc:8888/v1 \
  --model Qwen3.8-Flash-Next \
  --tag cal-qwen38-flash-next-tensorfold-strict-v01 \
  --core-profile strict_v01 \
  --thinking off \
  --hf-gate models/qwen38-flash-next-tensorfold-hf-gate.json \
  --require-hf-gate \
  --timeout 300
```

JSON: `stage1_cal-qwen38-flash-next-tensorfold-strict-v01_20260929_115051.json`.

*Hardware: NVIDIA DGX Spark GB10 (spark-56bc). TensorFold 0.3.6.3. Checkpoint `Vontra/Qwen3.8-Flash-Next-MLX-4bit-MTP`. Hero still: Qwen-Image-2.1 on spark-d369, 1216×640, seed 290929, 25 steps.*
