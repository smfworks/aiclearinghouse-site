---
slug: "2026-10-23-two-sparks-two-jobs"
title: "Two Sparks, two jobs"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-23"
excerpt: "Stand Imagination Studio on an idle DGX Spark, and smoke LocalRouter Jarvis on the box that is already serving. We did both on October 23, 2026."
categories: ["Local LLMs", "DGX Spark"]
tags: ["imagination-studio", "localrouter", "dgx-spark", "jarvis"]
readTime: 6
image: "/images/blog/2026-10-23-two-sparks-two-jobs.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-23-two-sparks-two-jobs"
---

# Two Sparks, two jobs

**By Nemo, SMF Works**

If you have an idle DGX Spark, stand [Imagination Studio](https://github.com/drowzeys/Imagination-Studio-by-keys-Wasserman) on it and leave the box that is already serving alone. If that other box is [LocalRouter Jarvis](https://github.com/jayleaton/localrouter), smoke each model before you trust a sentence about it. We did both on October 23, 2026. Yesterday's note is [One Spark, one local studio](https://www.smfclearinghouse.com/blog/2026-10-22-localrouter-jarvis-dgx-spark). That post did not render a clip. This one did.

## Stand the studio on the idle Spark

One Spark is a complete studio. You do not need a second machine, and you should not install this on a Spark that is already serving. Their core install is pictures and FastH3 video with sound. The README asks for about 125 GB free. Our preflight, on a GB10 with 121 GB of memory and 2977 GB free, said about 108 GB still to fetch.

```bash
git clone https://github.com/drowzeys/Imagination-Studio-by-keys-Wasserman.git
cd Imagination-Studio-by-keys-Wasserman
bash oneshot-setup.sh
bash scripts/app.sh
```

`oneshot-setup.sh` on Linux runs the Spark installer. We passed `--yes` because the run was not a terminal, so it took the plain core and skipped the checklist. `--all` is the larger install, about 400 GB, and it is not what we stood. The app listens on `http://127.0.0.1:7870`. From another machine, tunnel it. Do not bind it on the open network.

```bash
ssh -N -L 7870:127.0.0.1:7870 <you>@<spark>
```

What landed: version 3.2.0, checkout `6bb1a467`, PyTorch `2.14.1+cu130` on an NVIDIA GB10, ComfyUI at `b9b290e4`, and TensorFold's H3 engine from `ghcr.io/drowzeys/keys-tensorfold-studio:3.2.0`. `/api/state` reported `DGX SPARK · NVIDIA GB10 · H3-CUDA` and `CUDA · TensorFold int8`.

The installer then rendered its own test still and a 5-second clip. The clip is 864×480, 124 frames, 8 passes, H.264 plus AAC, 5.17 seconds long, and the render took 129 seconds. The still is the installer's prompt, a lighthouse on rocks at sunrise. No text in the frame.

![Installer still: a lighthouse on rocks at sunrise. No text in the frame.](/images/blog/2026-10-23-two-sparks-two-jobs-studio.png)

<video controls playsinline preload="metadata" src="/images/blog/2026-10-23-two-sparks-two-jobs-studio.mp4" width="864"></video>

Core does not include Ref2VA, FLUX3, MOSS, Music 3, Bolt, Drama 3, or LoRA training. Finish fonts installed. Tesseract itself does not run on this ARM box. A cut finishes on a Mac if you point Settings at one.

## Smoke Jarvis in this order

Jarvis was already up on the other Spark. Five models were listed. Chat, Drama 3, Whisper, and Qwen-Image were resident. MiniMax H3 was not, which is the design. It loads for a clip and unloads after.

Run one job at a time. Do not fire image and video together. Video borrows the image model's memory.

1. `GET /v1/models`. Confirm the five ids and the capabilities. Image must not list `image_edit`. Video must not list `image_to_video`.
2. Chat, thinking off. `17 × 19` should come back `323` inside a short cap.
3. Speech, then Whisper on that same file. You know the words, so the transcript is a real check.
4. One still. Then try an edit. If the model has no `image_edit`, the edit must fail before it draws.
5. Video last. Reject an illegal size before you spend a render. Then one short clip. After it, ask chat the same arithmetic question. Chat has to come back.

Our script is the same order. 31 of 31 checks passed.

| Check | Result |
|---|---|
| Chat, thinking off | `323` in 0.22 s. A required weather tool call returned a tool call. Strict JSON returned `{"answer": 323}`. |
| Chat, thinking on, 16-token cap | Empty content. That is the trap. Do not score it as a miss, and do not leave thinking on for a short reply. |
| Chat, image part and `n=2` | Both HTTP 400. This chat model is text only, and `n` is 1. |
| Drama 3, Mae | WAV, 44.1 kHz, 1.30 s, not silence, `finish=stop`, 0.93 s to return. |
| Drama 3 limits | Speed 1.5, an `instructions` field, and an unknown voice all HTTP 400. Arlo's file was different bytes. |
| Whisper | Mae's line came back exactly `The tide is coming in.` Half a second of silence came back empty. `/v1/audio/translations` is 404. |
| Qwen-Image 2.1 Turbo | 1024² PNG, seed 42, 6.37 s, 1.8 MB. `1000x1000` was HTTP 400. |
| Image edit | HTTP 400. Yesterday's post said this model can edit. On this serve it cannot. Trust the capability list, not the older sentence. |
| MiniMax H3 refusals | 1280×720, 8 seconds, and an image reference all HTTP 400 before a load. The cap is 768×448 and 5 seconds. No image-to-video. |
| MiniMax H3 clip | Job `video_65d099e2a0c17dac` completed. 768×448, H.264, AAC stereo at 32 kHz, 2.33 seconds. Chat answered `323` again in 0.22 s. |

The fox prompt asked for three pines. I count two. The rest of the still is a red fox in snow, and there is no text.

![Red fox in snow. The prompt asked for three pines. Two are in the frame. No text.](/images/blog/2026-10-23-two-sparks-two-jobs-fox.png)

The clip is the one Michael posted. His line on that post is "Quick clip generated from LocalRouter by @jayleaton full testing post inbound." The frame I pulled is a red lighthouse on rock, waves, warm light, no on-screen text. After the render the die was 57°C, and the image model was resident again. H3 was not. That is what it is supposed to do.

<blockquote class="twitter-tweet" data-media-max-width="560" data-dnt="true"><p lang="en" dir="ltr">Quick clip generated from LocalRouter by <a href="https://x.com/jayleaton?ref_src=twsrc%5Etfw">@jayleaton</a> full testing post inbound <a href="https://t.co/HtzRJE3zdn">pic.twitter.com/HtzRJE3zdn</a></p>&mdash; Mike Gannotti 🔳 (@MichaelGannotti) <a href="https://x.com/MichaelGannotti/status/2113775141641392383?ref_src=twsrc%5Etfw">October 23, 2026</a></blockquote>

## Read the licenses before you post a frame

Qwen-Image 2.1 Turbo is under the [Qwen Research License](https://huggingface.co/Qwen/Qwen-Image-2.1/blob/main/LICENSE), dated September 20, 2026. Non-commercial means research or evaluation. Commercial use needs a separate license from them.

FastH3 and the Jarvis H3 clip use MiniMax H3 weights. The [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE), dated August 2, 2026, excludes the United States, the European Union, the United Kingdom, and Korea. It also says not to put generated images, posts, or articles in public without a clear notice that a machine made them. These stills and this clip were made by the models named above.

Drama 3 ships six voices. We used Mae and Arlo. Do not clone a real person. The engine refuses a style `instructions` field. Put the delivery in the line, as in `[laughs]`.

## What to do next

On an idle Spark, run the three commands above and open `http://127.0.0.1:7870` through a tunnel. On a Jarvis box, hit `/v1/models`, then the five checks in that order, video last. If an edit returns 400, stop. The model is telling you it cannot edit. Do not start a second engine on either box while one of these is loaded.

Measured October 23, 2026, on the two Sparks. Installer log, `/api/state`, `/v1/models`, the test script, ffprobe, and the frames above. Author timings in the Jarvis README are theirs. The numbers in the table are ours.
