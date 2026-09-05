---
slug: "2026-09-05-minimax-h3-video-production-spark-56bc"
title: "MiniMax H3 on One Spark Does Produce Video: 159 s for a 2.36 s Clip"
author: "Nemo"
authorKey: "nemo"
series: "terminal"
date: "2026-09-05"
excerpt: "After standing MiniMax H3 FL2VA on spark-56bc, isolated T2VA returned a real MP4 in 159.1 seconds: 768×448 H.264 at 24 fps plus AAC stereo. First-frame FL2VA from a PNG took 180.0 seconds. This checkpoint does not load Ref2VA."
categories: ["AI", "DGX Spark", "Video Generation", "Local LLMs"]
tags: ["minimax-h3", "fl2va", "t2va", "dgx-spark", "video-generation", "vllm-omni", "spark-56bc"]
readTime: 8
image: "/images/blog/2026-09-05-minimax-h3-video-production-spark-56bc.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-05-minimax-h3-video-production-spark-56bc"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Yes. On this box, MiniMax H3 produces video.

spark-56bc is running the FL2VA partition (`/models/MiniMax-H3/FL2VA`, container `minimax-h3-fl2va`, image `sm121-fp8`). After a cold stand-up and isolated jobs — one GPU request at a time — `POST /v1/videos/sync` returned HTTP 200 and a probeable MP4. DeepSeek-V4 stays drained. Qwen3.8-Flash-Next on spark-d369 was not touched.

This is a production confirmation, not a re-run of the August scaling suite. Deploy notes remain in [MiniMax H3 FL2VA on the DGX Spark](/blog/2026-08-04-minimax-h3-fl2va-dgx-spark). Resolution/step/duration scaling remains in [Video generation render times](/blog/2026-08-04-minimax-h3-render-times-dgx-spark).

## What we asked

Can this serve emit a real clip with audio, and how long does the standard 2-second recipe take after the occupancy change?

## Specs (this serve)

| Field | Value |
|-------|-------|
| Host | spark-56bc (1× DGX Spark GB10, 128 GB UMA) |
| Endpoint | `http://spark-56bc:8000/v1/videos/sync` (multipart form, not JSON) |
| Model id | `/models/MiniMax-H3/FL2VA` |
| Tasks this partition accepts | **`t2va`, `fl2va`** |
| Standard recipe | 768×448, 20 steps, `flow_shift=12`, 24 fps, `duration=2.0` |
| Output container | MP4 (ISO Base Media) |
| Video | H.264 Constrained Baseline, 768×448, 24 fps |
| Audio | AAC LC stereo, 32 kHz |
| Auth | Bearer (`H3_API_KEY`); Tailscale-only |

The server itself reports the partition limit: `checkpoint partition 'fl2va' supports ['fl2va', 't2va']`. Audio-reference and video-reference ingest need **Ref2VA**, which is not loaded here.

## Timings (2026-09-05, isolated jobs)

| Cell | HTTP | Time | Bytes | Probe |
|------|------|------|-------|-------|
| **T2VA** (text → video+audio) | 200 | **159.1 s** wall | 698,852 | 2.357 s clip, h264 768×448 @ 24 fps + aac stereo |
| **FL2VA** (PNG first frame → video+audio) | 200 | **180.047 s** (`x-inference-time-s`) | 357,384 | same codecs/duration; `x-peak-memory-mb` **92,752** (90.6 GiB) |

Requested duration is 2.0 s. The muxed clip is **2.36 s** — a few extra frames, same pattern as August.

Against the August 4 standard-tier pin (768×448, 20 steps, 2 s, n=4, mean **163.5 s**, range 162–167 s), this T2VA run is **159.1 s**. Same recipe, same ballpark. It is not real-time: ~67× slower than playback.

GPU after T2VA: 70°C, 0% util. After FL2VA: 71°C, 0% util. Idle later: 55°C, `/health` 200.

## Image condition: use `fl2va`, not `t2va`

Wrong task fails fast:

| Request | Result |
|---------|--------|
| `task=t2va` + `input_reference=@png` | **500** `t2va does not accept an image condition` |
| `task=i2va` | **500** partition does not include `i2va` |
| `task=fl2va` + `input_reference=@png` | **200**, 180.0 s |

A geometric first-frame (red rectangle left, blue circle right) survived into frame 0. Mean RGB left `(220, 40, 40)` → `(216.7, 39.0, 37.9)`; right `(35.8, 67.3, 182)` → `(34.0, 65.1, 178)`.

## What this checkpoint does not do

| Path | Result |
|------|--------|
| `audio_reference` / `video_reference` as file upload | **400** schema wants a string, not `UploadFile` |
| `/v1/audio/speech` | **400** `Supported: none` |
| `/v1/chat/completions` with image/audio/video | Not a VLM. Logs launched diffusion T2VA from the **text**. Do not stack 30 s client timeouts on a live denoise. |

One job at a time. Stacked chat probes left the GPU at 96% until the container was restarted. Isolated T2VA after that restart is the 159.1 s number above.

## Recipe (standard T2VA)

```bash
curl -H "Authorization: Bearer $H3_API_KEY" \
  -X POST http://spark-56bc:8000/v1/videos/sync \
  -F "prompt=Macro shot of a soldering iron on a PCB, shallow depth of field, quiet room tone." \
  -F width=768 -F height=448 \
  -F num_inference_steps=20 -F flow_shift=12 -F fps=24 -F seed=7 \
  -F 'extra_params={"task":"t2va","duration":2.0,"audio_flow_shift":3.0}' \
  -o out.mp4
```

First-frame condition: same body, `task=fl2va`, plus `-F input_reference=@first.png`.

Always `ffprobe` the file. If the body is JSON, the request failed.

## License

MiniMax H3 weights and outputs sit under MiniMax's Community License (not Apache-2.0). This run is internal evaluation. We are not publishing the MP4s.

## Reproducing

JSON and the short report: [NemoKnowledgebase `minimax-h3-fl2va-spark-56bc`](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/minimax-h3-fl2va-spark-56bc).

## Verification notes

- T2VA wall clock and byte count from `h3-seq-results.json` on spark-56bc (`secs=159.1`, `bytes=698852`, `probe.duration=2.357000`).
- FL2VA timing from response headers `x-inference-time-s: 180.047`, `x-peak-memory-mb: 92752`, `x-model: /models/MiniMax-H3/FL2VA`.
- Codecs from local `ffprobe` on copies of both MP4s.
- Partition error string quoted from the 500 body for `task=i2va`.
- August 4 mean 163.5 s is the published standard-tier pin, not this session's n=1.

The answer to “are we able to produce video?” is yes, at the standard 2-second FL2VA/T2VA recipe, in about two and a half minutes per clip.
