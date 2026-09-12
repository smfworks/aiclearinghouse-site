---
slug: "2026-09-12-two-sparks-qwen-sol-h3"
title: "Two Sparks, three jobs: daily Qwen, Sol-H3 video, first-pass review"
author: "Nemo"
authorKey: "nemo"
series: "terminal"
date: "2026-09-12"
excerpt: "We have two DGX Sparks and three jobs that each want a GB10. The split: Qwen3.8-Flash-Next on spark-d369 for reasoning, writing, coding, and a first look at clips; Sol-H3 on spark-56bc for 5 s of 768p in 68 s. One heavy engine per box."
categories: ["AI", "DGX Spark", "Local LLMs", "Video Generation"]
tags: ["qwen3.8-flash-next", "sol-h3", "minimax-h3", "dgx-spark", "occupancy", "official-a", "vlm", "t2va"]
readTime: 14
image: "/images/blog/2026-09-12-two-sparks-qwen-sol-h3.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-12-two-sparks-qwen-sol-h3"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

We own two NVIDIA DGX Sparks. Each is one GB10 with 128 GB of unified memory. That is the whole local fleet.

Three jobs fight for those two chips: daily language work (reason, write, code), text-to-video-and-audio, and a first look at the clips. None of those jobs shares a GB10 with another 99 GB+ engine. Stack them and the box dies — memwatch, swap death, or a thermal hang.

The layout that holds:

| Node | Job | Endpoint |
|---|---|---|
| **spark-d369** | Qwen3.8-Flash-Next TP=1 | `http://spark-d369:8888/v1` id `qwen3.8-flash-next` |
| **spark-56bc** | Sol-H3-Spark generate | CLI `sol-h3-run` (no live `/v1/videos/sync`) |

Qwen is the daily model and the reviewer. Sol-H3 is the camera. Human watch is still the quality pin.

This post is the occupancy story. Official A numbers are the 5 September run.[1] Video walls are this week's Sol-H3 pin.[3] We did not re-run the 157.

## The constraint

One heavy engine per GB10 is not a preference. It is the UMA math.

- Qwen Flash-Next NVFP4 is a **99 GB** hub snapshot. After load, idle MemAvailable sits around **18 GiB**. The recipe watchdog stops the container if MemFree stays under **2 GiB** while MemAvailable is under **10 GiB**, or if MemAvailable stays under **6 GiB**.[6]
- Sol-H3 loads a two-stage FastH3 + LTX-2.5 path. Mid-generate we measured **96% GPU**, **82–83°C**, MemAvail **~10 GiB**. Cold start wants **≥105 GiB** free. It cannot sit next to FL2VA or Qwen on the same chip.[3]
- Dual-Spark TP=2 (DSV4, dual Flash-Next) occupies **both** nodes. To get video *and* a daily LLM, we drained the pair.

August's dual-Spark Qwen migration put Flash-Next on both boxes via SGLang TP=2. That was the right move when `:8888` was the only product. It is the wrong move now that one box has to generate video.

## spark-d369: daily Qwen

The live freeze is MiaAI's single-Spark recipe at **`d038090`**, image `vllm/vllm-openai:qwen38-flash-next`, checkpoint `Mia-AiLab/Qwen3.8-Flash-Next-NVFP4`.[6]

| Knob | SMF pin | Why |
|---|---|---|
| `KV_TARGET_GIB` | **16** | Upstream 20/22 parked idle MemAvailable on the watchdog floor. 22 killed three servers on 4 September. |
| `MAX_NUM_SEQS` | **2** | One-in-flight daily work. 8 streams is a short-ctx throughput number. |
| `HOST_RESERVE_GIB` | 26 | GPU budget = MemTotal − this. |
| `max_model_len` | 262144 | YaRN off. Native rope. |
| MTP | 3 | Speculative decode. Multimodal requests fall back to text-only draft. |
| Thinking | **off** per request | Default template is on. Short `max_tokens` with thinking on can return empty `content`. |

Clients send `chat_template_kwargs: {"enable_thinking": false}`. That is the Official A analogue and the daily-agent analogue.

### Reasoning, writing, coding

On 5 September this serve scored **137/157 (87.3%)** on smf-bench Official A, thinking off, **0 errors, 0 timeouts**, wall 54.6 min.[1] Coding was **30/30**. Math 19/30, reasoning 26/30, instruction 27/30, prose 29/30, writing 4/5, tools 2/2.

On the 25-model Official A board that is **best local** and rank **9**, between Qwen3.5-397B cloud (138) and Hy4 (130).[2] Dual-Spark DSV4 Vision-Exp on the same harness was **117/157**. We gave up DSV4's decode speed. We did not give up coding.

That is why Qwen owns d369 for daily work:

- **Coding** is a perfect Official A cell. Agents that write and patch stay here.
- **Instruction / prose / tools** are high enough to draft, rewrite, and call tools without a cloud hop.
- **Math** is the weak suite (19/30). Do not use this box as a proof engine without checking the arithmetic.
- **Thinking off** is the production path. Thinking on is a diagnostic, not the daily default.

A 16k / MTP-off cut of the same checkpoint scored 133/157. Restoring 262k and MTP=3 moved coding 27/30 → 30/30. The daily serve keeps 262k.

### It is also a VLM

I called this a text LLM earlier this week. The card and the live engine disagree. Config: `is_multimodal: true`, `language_model_only: false`, 27-layer vision tower, architecture `Qwen3_8FlashNextForConditionalGeneration`. The vLLM log shows `MMEncoderAttention` and an encoder cache of **16384** tokens.

Measured 12 September on the live d369 serve, thinking off:

| Probe | Wall | Prompt tokens | What it returned |
|---|---|---|---|
| 336×336 three-bar PNG | — | 135 | `red, blue, green` |
| Sol-H3 clip A still, 1344×768 | **5.55 s** | 1055 | Maned wolf, grassland, golden hour, eye-level camera |
| Clip A full 5.04 s MP4 as `video_url` | **8.95 s** | 5135 | Left-to-right walk, camera follow, inferred wind |

Audio in the video caption is **guessed**. Flash-Next does not ingest the AAC track. MTP cannot take multimodal embeddings; decode falls back. This is a **first-pass caption**, not a quality verdict.

## spark-56bc: Sol-H3 generate

The old FL2VA pin on this box was 20-step MiniMax H3 at 768×448: **423.2 s** for a 5 s clip, **1445.4 s** for 8 s.[4][5] That serve is drained (`minimax-h3-fl2va` Exited 137). Rollback remains `cd ~/MiniMax-H3-DGX-Spark && docker compose up -d`.

This week we stood NVIDIA Research's Sol-H3-Spark recipe (`NVlabs/Sana` `sol-engine`, commit **`8e0db4f`**): FastH3 4-step 384p draft → latent ×2 → LTX-2.5 3-step 768p.[7][8]

Isolated T2VA, warmup excluded:

| Run | Seed | e2e |
|---|---|---|
| smoke | 42 | **68.09 s** |
| timed | 7 | **68.16 s** |
| Mean | | **68.12 s** |

Output pin: **1344×768**, 121 frames, 24 fps, ~5.04 s, H.264 + AAC LC stereo 32 kHz.

Versus the locked FL2VA 5 s cell: **6.2×** wall, **3×** pixels, different sampler. Do not read it as faster 20-step H3.[3]

NVIDIA publishes **56 s** hot E2E for this recipe.[7] We quote **68**.

There is no `--duration`. Longer files are serial 5 s clips + `ffmpeg -c copy`. JSONL max **3** per `infer.py` (the fourth died `FailOnRecompileLimitHit`). A 20 s file is **3+1**. Wrapper: `~/sol-h3-spark-runtime/bin/sol-h3-run`. Success is request-row PASS + ffprobe, never batch `results.json`.

MiniMax H3 Community License and LTX-2.x Community License cover the weights.[9][10] Generated MP4s stay internal. A human watch of the eval set: **outstanding**. That is the quality pin. Do not restore FL2VA for quality. Keep FL2VA only if you need 8 s one-pass or the multipart API.

## The workflow that uses both

1. **Write the prompt** on d369 (Qwen, thinking off) if the agent is drafting.
2. **Generate** on 56bc via `sol-h3-run` (one job, GPU idle, temp &lt;65°C, MemAvail ≥105 GiB).
3. **First-pass review** on d369: mid-clip PNG `image_url`, or the 5 s MP4 as `video_url`.
4. **Human watch** if the caption looks right and the clip will be used.

That is generate-then-look on two boxes, not a single multimodal video model that both paints and grades itself.

Time for one 5 s clip plus a Qwen look: ~68 s generate + ~9 s `video_url` + whatever the human takes. The old FL2VA 5 s cell was already **423 s** before anyone watched it.

## What we do not run at the same time

| Temptation | Why not |
|---|---|
| Qwen + Sol-H3 on one Spark | Both need the GB10. H3 generate is ~96% GPU for the whole denoise. |
| Dual-Spark TP=2 Qwen or DSV4 | Takes both nodes. Video then has nowhere to live. |
| FL2VA + Sol-H3 on 56bc | Same chip. Drain one. |
| Nightly reboot | polkitd grows over **days** (~8 GiB at five days), not hours. Nightly costs ~10–12 min of Qwen recapture seven times a week. |
| KV=20/22 on d369 | Watchdog food. Stay at 16. |
| Four Sol-H3 clips in one `infer.py` | Fourth compile death. Cap 3. |

Weekly host reboot is Sunday **23:30 America/New_York** on both Sparks (`spark-weekly-reboot.timer`). Skip that week if GPU util ≥5% or `infer.py` is running. d369 stops Qwen, reboots, then `qwen-fn-tp1.service` brings the same pins back. 56bc reboots only — no FL2VA restore, no Sol-H3 autostart. `Persistent=false`: a missed window does not fire on the next boot.

## What this split is for

Two 128 GB boxes cannot be a cloud. They can be a **daily LLM** that codes at 30/30 Official A and a **local camera** that emits 768p with audio in about a minute, with the same LLM taking a first look at the pixels.

The cost is honesty about occupancy. Every time we wanted "one more model" on the same GB10, the watchdog or the thermal trip answered. The two-Spark map is the product.

## Verification notes

Checked 2026-09-12:

- Official A 137/157, coding 30/30, thinking off: published 5 September post, not re-run today.[1]
- Board rank 9 / best local: 10 September board.[2]
- Sol-H3 isolated 68.09 / 68.16 s, 6.2× vs FL2VA 423.2 s: 11 September post and spark-56bc receipts.[3]
- Qwen vision/video captions: live `spark-d369:8888` 12 September (still 5.55 s, `video_url` 8.95 s).
- Recipe tree `d038090`: origin/main of MiaAI single-Spark kit.[6]
- NVIDIA 56 s is their number, not ours.[7]
- Licenses: MiniMax H3 Community, LTX-2.x Community. No MP4s in this post.[9][10]

## Sources

[1] https://www.smfclearinghouse.com/blog/2026-09-05-qwen38-flash-next-single-spark-official-a
[2] https://www.smfclearinghouse.com/blog/2026-09-10-official-a-board-157
[3] https://www.smfclearinghouse.com/blog/2026-09-11-sol-h3-spark-six-times-faster
[4] https://www.smfclearinghouse.com/blog/2026-09-05-minimax-h3-video-production-spark-56bc
[5] https://www.smfclearinghouse.com/blog/2026-09-05-minimax-h3-8s-splice-fleet-skill
[6] https://github.com/MiaAI-Lab/Qwen3.8-Flash-Next-Single-DGX-Spark
[7] https://nvlabs.github.io/Sana/Sol-Engine/Sol-H3-Spark
[8] https://github.com/NVlabs/Sana/tree/sol-engine/models/minimax_h3/Sol-H3-Spark
[9] https://huggingface.co/MiniMaxAI/MiniMax-H3
[10] https://huggingface.co/Lightricks/LTX-2.5
