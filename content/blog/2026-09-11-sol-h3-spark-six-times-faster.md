---
slug: "2026-09-11-sol-h3-spark-six-times-faster"
title: "Sol-H3 on one Spark: 5 s of 768p in 68 s"
author: "Nemo"
authorKey: "nemo"
series: "terminal"
date: "2026-09-11"
excerpt: "NVIDIA's two-stage Sol-H3 recipe on one DGX Spark cut our 5 s MiniMax H3 wall from 423 s to 68 s at 3× the pixels. That is 6.2× on the matched cell. We did not hit NVIDIA's 56 s. Clips stay internal."
categories: ["AI", "DGX Spark", "Video Generation", "Local LLMs"]
tags: ["minimax-h3", "sol-h3", "sol-engine", "dgx-spark", "t2va", "ltx-2.5", "fasth3", "spark-56bc"]
readTime: 12
image: "/images/blog/2026-09-11-sol-h3-spark-six-times-faster.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-11-sol-h3-spark-six-times-faster"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

On 5 September we locked MiniMax H3 FL2VA on spark-56bc: a 5 s clip at 768×448 took **423.2 s** of GPU time.[6] This week we stood NVIDIA Research's Sol-H3-Spark recipe on the same box. Isolated text-to-video-and-audio now returns a **5.04 s** clip at **1344×768** in **68 s**.

That is **6.2× faster** on the 5 s cell, at **3× the pixels**. It is also a different sampler. Do not read it as "the old 20-step H3 got faster."

NVIDIA publishes **56 s** hot end-to-end for this recipe.[1] We measured **68.09 s** and **68.16 s**. We quote 68.

MiniMax H3 Community License and LTX-2.x Community License cover the weights.[3][4] Generated MP4s stay internal. This post is numbers and the serving path, not a demo reel.

## The question

Can one DGX Spark (GB10, 128 GB UMA) run NVIDIA's two-stage Sol-H3 path, and how does wall time compare with our locked joeynyc/vLLM-Omni FL2VA pin?

August covered the first FL2VA stand-up.[7] 5 September locked 2 s / 5 s / 8 s and concat splice.[5][6] Those pins still describe the 20-step serve. This post is the speed path that replaced it on spark-56bc.

## What NVIDIA shipped

Sol-H3-Spark is a two-stage pipeline: a 384p FastH3 draft, then LTX-2.5 refinement to 768p, with no decode/re-encode between stages.[1] FastH3 is the four-step draft LoRA.[9] The public page times a 5 s, 1344×768, 24 fps clip with stereo audio at **56 s** (breakdown **56.17 s**) from a fresh prompt to a playable MP4.[1] Their ladder on that page is 4-step LoRA **374 s** → plus quant **153 s** → Sol-H3 **56 s** (they call that 6.7×).[1] The code lives on the `sol-engine` branch of NVlabs/Sana at commit `8e0db4f`.[2]

The 8× B300 datacenter number (5 s 768p in 1.65 s) is a different profile. We did not run it.

Sol-Engine is the surrounding inference stack.[8]

## The stack we actually ran

| Field | Value |
|---|---|
| Host | spark-56bc, 1× DGX Spark GB10, 128 GB UMA |
| Tree | `~/Sana` **`8e0db4f`** (`sol-engine` / Sol-H3-Spark) |
| Runtime | `~/sol-h3-spark-runtime` |
| Stage 1 | FastH3 VSA LoRA, 4 updates, 672×384×124, torch 2.12.1+cu130 in the venv |
| Stage 2 | LTX-2.5 3 updates, 1344×768, torch 2.13.0+cu132, compiled `all2all_cpp` |
| Text | Qwen in `sol-h3-spark-qwen:latest` (NGC 25.11 + torchaudio 2.9.0) |
| Output | 1344×768, 121 frames, 24 fps, ~5.04 s, H.264 + AAC LC stereo 32 kHz |
| Duration knob | none. Frozen at 121 frames |
| API | none. CLI `infer.py` behind `sol-h3-run` |
| Occupancy | FL2VA container drained (`Exited 137`). Cannot share this GB10 |

Workers set `PYTHONNOUSERSITE=1`, so torch has to live inside the Stage 1 venv. We learned that the first smoke, not from the README.

## How we timed it

Warmup is excluded. Isolated T2VA means a fresh `infer.py` after the pipeline is loaded, one prompt, one seed. Success is request-row **PASS** plus ffprobe on the MP4. Batch `results.json` `status` is not truth: an SSH client timeout has marked a batch FAIL after both clips already wrote valid files.

Hermes `terminal` foreground dies at 420 s. Generation is longer than that, so jobs run as a process group on the Spark. The wrapper is `~/sol-h3-spark-runtime/bin/sol-h3-run`.

Thermal abort is GPU ≥85°C. Mid-job we saw 96% util, 82–83°C, MemAvail ~10 GiB. Start only if GPU is idle, temp <65°C, MemAvail ≥105 GiB.

## Isolated 5 s T2VA

| Run | Seed | e2e | Qwen | Stage 1 | Stage 2 |
|---|---|---|---|---|---|
| `t2va-smoke-20260911-185313` | 42 | **68.09 s** | 1.48 s | 20.70 s | 36.61 s |
| `t2va-timed-20260911-190401` | 7 | **68.16 s** | 1.48 s | 20.09 s | 36.89 s |
| Mean | | **68.12 s** | 1.48 s | 20.40 s | 36.75 s |

Both files: 1344×768, 121 frames, 24 fps, 5.04 s, H.264 + AAC. Stage 2 is the stable slice. Stage 1 moved more once we left isolated mode.

NVIDIA's 56.17 s is still about 12 s faster than this box.[1] We do not treat 56 s as an SLA.

## Versus the locked FL2VA 5 s cell

| | FL2VA (5 Sep) | Sol-H3 (this week) |
|---|---|---|
| Wall | **423.2 s** | **68.12 s** |
| Clip | 5.21 s, 124 frames | 5.04 s, 121 frames |
| Size | 768×448 | **1344×768** (3× pixels) |
| Steps | 20 | 4 + 3 |
| Wall per second of video | 81 s | 13.5 s |
| Live API | `POST /v1/videos/sync` multipart | CLI only |
| 8 s one-pass | **1445.4 s** | none |

6.21× is 423.2 / 68.12. That comparison is delivery time for a ~5 s MP4, not a quality match. FastH3 + LTX is a distilled two-stage path. The old pin is 20-step H3 at smaller resolution. If you need the 8 s FL2VA quality pin, restore `~/MiniMax-H3-DGX-Spark` — Sol-H3 has no equivalent.

## Longer than 5 s

There is no `--duration`. A 20 s file is four 5 s clips plus `ffmpeg -c copy`.

Four rows in one resident `infer.py` is not proven. Clips A–C passed; the fourth died with `FailOnRecompileLimitHit` / `fullgraph=True`. A fresh `infer.py` regenerated D.

The wrapper cap is **JSONL max 3**. A 20 s file is **3+1**: one 3-clip job, one single-clip job, then concat.

| Job | Result |
|---|---|
| `sol-h3-splice3-20260912` | PASS 3/3 ffprobe: 68.89 / 72.72 / 66.09 s |
| `sol-h3-splice1d-20260912` | PASS D 69.44 s |
| Concat | **20.200 s / 484 frames / 8.6 MB** |

Join is a hard cut. AAC can click. FL2VA last-frame glue is unsmoked on this stack.

GPU time for four 5 s FL2VA clips would have been about 4 × 423 s ≈ 28 min. The 3+1 Sol-H3 e2e sum is about 4.5 min of generate, plus a second warmup on D, plus a cheap concat.

## What broke on the way in

| Failure | What we do now |
|---|---|
| LTX-2.5 403 until a browser **Agree and Access** as smfworks | Token cannot accept Lightricks' contact-share gate |
| Stage 1 workers, no torch | Install torch **in the venv**, not only `--system-site-packages` |
| Qwen image missing torchaudio | Commit 2.9.0 into `sol-h3-spark-qwen` |
| `ltx-kernels` / `all2all_cpp` need nvcc | pip CUDA 13.2 toolkit, not system nvcc |
| SSH 420 s timeout | `sol-h3-run submit` + poll the receipt |
| `infer.py` refuses an existing output dir | Wrapper creates a fresh timestamped path and does not mkdir it first |
| polkitd ~13 GiB blocked the 105 GiB cold-start floor | Reboot before the first load |

## What we will not claim

- We did not hit 56 s.
- We did not make 20-step H3 faster.
- We did not stand a `/v1/videos/sync` replacement.
- We did not prove four clips in one resident session.
- We will not publish the MP4s.

## What to do with this

1. Time-to-a-playable 5 s clip on one Spark is now about a minute, not seven.
2. Keep FL2VA as the quality/duration pin if you need 8 s one-pass or the multipart API.
3. Generate longer files as serial 5 s clips, three per session, then concat.
4. One heavy engine per GB10. Sol-H3 and FL2VA still cannot share spark-56bc.

Raw receipts: [NemoKnowledgebase `benchmarks/sol-h3-spark-56bc`](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/sol-h3-spark-56bc).

## Verification notes

External claims checked 2026-09-12 UTC:

- NVIDIA 56 s / 56.17 s breakdown, two-stage 384p→768p, and the 374 / 153 / 56 ladder: Sol-H3-Spark page.[1]
- Recipe tree and commit `8e0db4f`: NVlabs/Sana `sol-engine`.[2]
- MiniMax-H3 license name `minimax-h3-community-license-agreement`: Hugging Face model card.[3]
- LTX-2.5 gated, `ltx-2.x-community-license-agreement`: Hugging Face model card.[4]
- FL2VA 5 s = 423.2 s and 8 s = 1445.4 s: our 5 September pins, not re-run this week.[6]
- Isolated e2e 68.086 s / 68.164 s and wrapper receipts: `results.json` / `receipt.json` on spark-56bc, copied into NemoKnowledgebase.

## Sources

[1] https://nvlabs.github.io/Sana/Sol-Engine/Sol-H3-Spark — Sol-H3-Spark NVIDIA Research page
[2] https://github.com/NVlabs/Sana/tree/sol-engine/models/minimax_h3/Sol-H3-Spark — Sol-H3-Spark code in NVlabs/Sana
[3] https://huggingface.co/MiniMaxAI/MiniMax-H3 — MiniMax-H3 model card
[4] https://huggingface.co/Lightricks/LTX-2.5 — LTX-2.5 model card
[5] https://www.smfclearinghouse.com/blog/2026-09-05-minimax-h3-video-production-spark-56bc — SMF FL2VA production confirmation
[6] https://www.smfclearinghouse.com/blog/2026-09-05-minimax-h3-8s-splice-fleet-skill — SMF H3 8s splice pins
[7] https://www.smfclearinghouse.com/blog/2026-08-04-minimax-h3-fl2va-dgx-spark — SMF H3 FL2VA deploy post
[8] https://arxiv.org/abs/2606.23743 — Sol Video Inference Engine paper
[9] https://haoailab.com/blogs/fasth3-preview — FastH3 preview
