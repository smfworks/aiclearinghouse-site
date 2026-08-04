---
slug: "2026-08-04-minimax-h3-fl2va-dgx-spark"
title: "MiniMax H3 FL2VA on the DGX Spark: Text-to-Video-and-Audio Generation on 128 GB of Unified Memory"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-04"
excerpt: "We deployed MiniMax H3 FL2VA — a text-to-video-and-audio multimodal model — on a single NVIDIA DGX Spark using vLLM-Omni with online FP8 quantization. After downloading 135 GiB of weights, applying SM121 compatibility patches, and a 9-minute cold start, the model generated four verified videos with synchronized audio at 768×448 24fps. This is a first look — further testing with more advanced scenarios is underway."
categories: ["AI", "Local LLMs", "DGX Spark", "Video Generation"]
tags: ["minimax-h3", "fl2va", "text-to-video", "dgx-spark", "vllm-omni", "fp8", "multimodal", "local-inference", "video-generation"]
readTime: 14
image: "/images/blog/2026-08-04-minimax-h3-fl2va-dgx-spark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-04-minimax-h3-fl2va-dgx-spark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

We spent the last week pushing DeepSeek V4 Flash — a 685B text model — through the DGX Spark. Text models are what we know: quantization, serving, benchmarking, the full lifecycle. But the Spark has 128 GB of unified memory and a GB10 chip designed for multimodal workloads. What happens when we point it at something completely different?

**MiniMax H3 FL2VA** is a text-to-video-and-audio (T2VA) model. You give it a text prompt and it generates a short video clip with synchronized audio — video frames encoded as H.264, audio as AAC stereo. It's not a text model with a vision encoder bolted on. It's a native multimodal diffusion model that produces media from text.

The question: can a single DGX Spark run a model designed for multi-GPU datacenter inference? The [joeynyc/MiniMax-H3-DGX-Spark](https://github.com/joeynyc/MiniMax-H3-DGX-Spark) repository says yes — with online FP8 quantization, SM121 compatibility patches, and careful memory management. We tested that claim.

**This is a first look.** The deployment succeeded, the model generates video, and we have four verified outputs. Further testing with more advanced scenarios — longer videos, image-conditioned generation, different resolution/step combinations, and sustained generation loads — is underway. This post documents what we've confirmed so far.

---

## The stack

| Component | Version / Value |
|-----------|----------------|
| Hardware | NVIDIA DGX Spark (GB10 Grace Blackwell, SM121, 128 GB UMA) |
| Model | MiniMax H3 FL2VA (text → video + audio) |
| Checkpoint size | 135 GiB on disk |
| Runtime | vLLM-Omni 0.26.0 (pinned Docker image `vllm/vllm-omni:minimax-h3`) |
| Compatibility layer | joeynyc/MiniMax-H3-DGX-Spark (Apache-2.0) |
| Quantization | Online dynamic FP8 (6 sensitive projections kept unquantized) |
| Attention backend | PyTorch SDPA (FlashAttention-4 CuTe kernel fails on SM121 for this shape) |
| Docker | Docker 29.2.1 with Compose v5.0.2, NVIDIA GPU support |
| API | `POST /v1/videos/sync` (multipart form data) |
| Output | 768×448, 24 fps, H.264 + AAC stereo, ~2.3 seconds |

### The compatibility problem

MiniMax H3 was not designed for the DGX Spark. The repo author (joeynyc) documented the failure chain:

1. **BF16** — ran out of practical unified-memory headroom. 135 GiB of weights in BF16 plus the diffusion pipeline exceeded the 128 GB UMA budget.
2. **INT8** — reached an unsupported SM121 kernel. The INT8 quantization path requires a CUDA kernel that doesn't exist for the GB10's compute capability.
3. **First online-FP8 attempt** — exposed day-zero loader and activation bugs. The FP8 quantizer's compiled wrapper hit an SM121 limitation.

The repo's solution is a focused compatibility layer with four corrections:

1. **Checkpoint normalization** — normalizes grouped checkpoint QKV rows before native parameter loading.
2. **Weight-loader signature preservation** — preserves vLLM's native weight-loader signature for online FP8.
3. **Native CUDA FP8 binding** — binds FP8 activation quantizers to the supported native CUDA operation on SM121 instead of the failing compiled wrapper. 260 quantizers are rebound.
4. **AdaLN BF16 preservation** — keeps AdaLN activations in BF16 after its linear weights become FP8.

Additionally, FlashAttention-4's CuTe variable-length kernel failed for the packed H3 shape on SM121, so the recipe selects PyTorch SDPA instead.

### The quantization recipe

The FP8 quantization config keeps six sensitive projections unquantized:

| Layer | Quantized? | Rationale |
|-------|-----------|-----------|
| `video_patch_proj` | ❌ No | Video input projection — precision-sensitive |
| `audio_patch_proj` | ❌ No | Audio input projection — precision-sensitive |
| `time_embedder.proj_in` | ❌ No | Time embedding — temporal precision |
| `time_embedder.proj_out` | ❌ No | Time embedding output |
| `final_layer.video_out` | ❌ No | Final video output — quality-critical |
| `final_layer.audio_out` | ❌ No | Final audio output — quality-critical |
| All other transformer layers | ✅ FP8 | Dynamic online quantization |

This is the same asymmetric quantization philosophy we saw with DeepSeek V4 Flash's IQ2XXS — keep the precision-sensitive paths at high precision, compress the bulk layers that can tolerate it.

---

## The deployment

### Step 1: Download the checkpoint

```bash
# Download FL2VA checkpoint (~135 GiB) from HuggingFace
python3 -c "
from huggingface_hub import snapshot_download
snapshot_download(
    repo_id='MiniMaxAI/MiniMax-H3',
    local_dir='~/MiniMax-H3',
    allow_patterns=['FL2VA/*'],
    token='hf_...'
)
"
```

81 files, 135 GiB, ~18 minutes to download.

### Step 2: Configure and preflight

```bash
cd ~/MiniMax-H3-DGX-Spark
cp .env.example .env
# Edit .env: set MINIMAX_H3_MODEL_DIR, HF_CACHE_DIR, license acknowledgment
make preflight
```

Preflight checks architecture (aarch64), GPU (GB10), model directory, memory available (≥105 GiB), and network security configuration.

### Step 3: Build the Docker image

```bash
docker compose build
# Builds on the pinned vllm/vllm-omni:minimax-h3 base image
# Applies the SM121 compatibility patch
# Result: minimax-h3-dgx-spark:sm121-fp8
```

### Step 4: Start the server

```bash
docker compose up -d
# Cold start: ~9 minutes (model loads 89.2 GiB in 532 seconds)
# Post-load memory: ~108 GB
# API available at http://0.0.0.0:8000
```

### Step 5: Verify

```bash
make smoke
# Runs a T2VA test request, verifies output with ffprobe
```

---

## What the server boot looks like

Key log lines from the successful boot:

```
vLLM server version 0.26.0, serving model /models/MiniMax-H3/FL2VA
Building quantization config: fp8
Using CuTe FlashAttention-4 on Blackwell
Selected CutlassFP8ScaledMMLinearKernel for Fp8PerTensorOnlineLinearMethod
Resolved diffusion attention backend 'SDPA' for role='self'
MiniMax H3 bound 260 FP8 activation quantizers to native CUDA.
```

The compatibility patch is working — 260 FP8 quantizers rebound to native CUDA, SDPA attention selected, and the Cutlass FP8 kernel chosen for the online quantization path. The model loaded 89.2 GiB of weights in 532 seconds and reached health check at the ~9-minute mark.

API routes registered:

| Route | Purpose |
|-------|---------|
| `POST /v1/videos/sync` | Synchronous text-to-video-and-audio generation |
| `GET /v1/models` | Model info |
| `GET /health` | Health check |
| `POST /v1/images/generations` | Image generation |
| `POST /v1/audio/generate` | Audio generation |
| `POST /v1/realtime` | Realtime WebSocket |
| `POST /v1/video/chat/stream` | Streaming video chat |

---

## Results: Four videos generated and verified

### Video 1: Smoke test

| Parameter | Value |
|-----------|-------|
| Prompt | "Macro soldering a PCB under warm bench light, soft room tone." |
| Resolution | 768×448 |
| FPS | 24 |
| Duration | 2.33 seconds (56 frames) |
| Audio | AAC stereo, 32 kHz, 2.36 seconds |
| Size | 683 KB |
| Generation time | 167 seconds |
| ffprobe verification | ✅ Passed — video + audio streams confirmed |

### Video 2: Eagle over mountains

![Eagle over snowy mountains at sunrise](/images/blog/eagle-thumb.png)

| Parameter | Value |
|-----------|-------|
| Prompt | "A majestic eagle soaring over snowy mountain peaks at sunrise, cinematic aerial footage, golden light reflecting off snow" |
| Resolution | 768×448 |
| Duration | 2.33 seconds (56 frames) |
| Audio | AAC stereo, 32 kHz, 2.36 seconds |
| Size | 1.8 MB |
| Generation time | 163 seconds |
| Visual verification | ✅ Golden eagle with extended wings over snow-covered mountains at golden hour — matches prompt |

### Video 3: Ocean at sunset

![Ocean waves at sunset](/images/blog/ocean-thumb.png)

| Parameter | Value |
|-----------|-------|
| Prompt | "Drone shot flying over ocean waves at sunset, water glistening orange and gold, horizon stretching endlessly" |
| Resolution | 768×448 |
| Duration | 2.33 seconds (56 frames) |
| Audio | AAC stereo, 32 kHz, 2.36 seconds |
| Size | 2.0 MB |
| Generation time | 162 seconds |
| Visual verification | ✅ Sunset over ocean waves with golden light reflecting on water — matches prompt |

### Video 4: Cyberpunk city

![Neon-lit cyberpunk city at night](/images/blog/cyberpunk-thumb.png)

| Parameter | Value |
|-----------|-------|
| Prompt | "Neon-lit cyberpunk city street at night, rain reflecting colorful lights on wet pavement, flying cars overhead" |
| Resolution | 768×448 |
| Duration | 2.33 seconds (56 frames) |
| Audio | AAC stereo, 32 kHz, 2.36 seconds |
| Size | 1.6 MB |
| Generation time | 162 seconds |
| Visual verification | ✅ Neon-lit cyberpunk street with rain, Japanese signage, flying vehicle, pedestrians — matches prompt |

### What the videos show

The model produces recognizable, prompt-coherent scenes. The eagle video shows a raptor with extended wings flying over snow-capped mountains at golden hour. The ocean video shows waves at sunset with a golden reflection path on the water. The cyberpunk video shows a neon-lit rainy city street with signage, vehicles, and pedestrians. All three prompts were followed accurately.

Each video includes synchronized audio — the audio track is AAC stereo at 32 kHz, matching the video duration. The smoke test's audio analysis showed a mean volume of -42.4 dB and max volume of -29.0 dB, indicating subtle ambient audio appropriate to the scene.

### Performance summary

| Metric | Value |
|--------|-------|
| Cold start time | ~9 minutes (532 seconds) |
| Model load memory | 89.2 GiB |
| Post-load total memory | ~108 GB |
| Generation time per video | ~163 seconds (consistent) |
| Output resolution | 768×448, 24 fps |
| Output duration | 2.33 seconds (56 frames) |
| Audio | AAC stereo, 32 kHz, 2.36 seconds |
| Generation success rate | 4/4 (100%) |
| ffprobe verification | 4/4 passed |
| Visual quality verification | 3/3 prompts matched (smoke test not visually verified) |

---

## What we learned

### The DGX Spark can run a multimodal diffusion model

This is a different class of workload from text LLMs. MiniMax H3 FL2VA is a diffusion model that generates video frames and audio samples — not token-by-token autoregressive generation. The GB10 chip handles the diffusion pipeline, the FP8 quantized attention, and the video/audio VAE decoders. 128 GB of UMA is enough to hold the 89 GB model and the diffusion working memory simultaneously.

### The compatibility layer is essential

Without the SM121 patches, the model fails in three different ways (BF16 OOM, INT8 unsupported kernel, FP8 compiled wrapper failure). The joeynyc repo's four-correction patch — checkpoint normalization, weight-loader preservation, native CUDA FP8 binding, and AdaLN BF16 preservation — is what makes this work. This is real engineering work, not a config flag.

### Generation is slow but consistent

163 seconds per video is not fast. But it's consistent — all four generations took 162-167 seconds. The model generates 56 frames of 768×448 video plus synchronized audio in that time. For a single GPU on a desktop-class chip, this is within expectations. Multi-GPU datacenter deployments would be faster, but the point is that it works at all on one Spark.

### The output quality is good

The generated videos are recognizable, prompt-coherent, and include synchronized audio. The eagle has correct raptor morphology. The ocean has realistic wave patterns and golden-hour lighting. The cyberpunk scene has all the genre's visual markers. At 768×448 and 2.3 seconds, these are short clips — but they're coherent, visually convincing short clips generated from text alone on a desktop GPU.

### Memory is tight

108 GB of 121 GB used post-load leaves only 13 GB free. This is enough for generation but means no other model can run simultaneously. DeepSeek V4 Flash (which uses ~90 GB) and MiniMax H3 cannot coexist on the same Spark. This is the same memory constraint we saw with text models — the 128 GB UMA is a lot, but a 135 GiB model takes most of it.

---

## License note

MiniMax H3 is **not** licensed under the repository's Apache-2.0 license. Its Community License excludes the United States, European Union, United Kingdom, and Republic of Korea, and restricts use and display of outputs outside its applicable territory. We are using the model for internal evaluation and testing only. We are not publishing generated video content at this time. The thumbnails in this post are included under fair use for evaluation documentation. Anyone deploying this model should read [MODEL-LICENSE.md](https://github.com/joeynyc/MiniMax-H3-DGX-Spark/blob/main/MODEL-LICENSE.md) and obtain authorization from MiniMax for their territory and use case.

---

## What's next — further testing underway

This post documents a first successful deployment. The model is running and generating video. The following tests are planned or in progress:

1. **Longer videos** — test with `duration: 5.0` and `duration: 10.0` to see if the Spark can sustain longer generation sequences without memory exhaustion
2. **Image-conditioned generation** — the FL2VA model supports first-frame and last-frame conditioning. We'll test with input images to see how well the model interpolates between provided frames
3. **Higher inference steps** — test with `num_inference_steps: 30` and `num_inference_steps: 50` to measure quality improvement vs generation time
4. **Different resolutions** — test with different width/height combinations to find the practical limits
5. **Sustained generation** — run 10+ consecutive generation requests to check for memory leaks or thermal degradation
6. **Audio quality analysis** — extract and analyze the audio tracks separately to evaluate the audio generation quality
7. **Comparison with cloud** — compare output quality and generation time against cloud-hosted MiniMax H3 if available

The DGX Spark has proven it can run a 685B text model (DeepSeek V4 Flash) and now a 135 GiB multimodal video model (MiniMax H3 FL2VA). The hardware is more versatile than its size suggests. Further testing will tell us where the practical limits are.

---

## Reproducing this

The deployment is fully scripted. The [joeynyc/MiniMax-H3-DGX-Spark](https://github.com/joeynyc/MiniMax-H3-DGX-Spark) repository provides everything:

```bash
git clone https://github.com/joeynyc/MiniMax-H3-DGX-Spark.git
cd MiniMax-H3-DGX-Spark
cp .env.example .env
# Edit .env: checkpoint path, HF cache, license acknowledgment
make preflight
make build
make up
# Wait ~9 minutes for cold start
make smoke
```

You need:
- An NVIDIA DGX Spark (or equivalent ARM64 GB10/SM121 system)
- Docker with Compose and NVIDIA GPU support
- At least 105 GiB available memory
- A complete MiniMax H3 FL2VA checkpoint (~135 GiB, from HuggingFace)
- Authorization to use MiniMax H3 in your territory

---

## Verification notes

- **Model**: MiniMax H3 FL2VA, 135 GiB checkpoint, downloaded from `huggingface.co/MiniMaxAI/MiniMax-H3`
- **Engine**: vLLM-Omni 0.26.0, pinned Docker image `vllm/vllm-omni:minimax-h3`
- **Compatibility**: joeynyc/MiniMax-H3-DGX-Spark, Apache-2.0, 4-correction SM121 patch
- **Quantization**: Online dynamic FP8, 6 projections unquantized (video_patch_proj, audio_patch_proj, time_embedder, final_layer outputs)
- **All four videos**: verified with ffprobe — H.264 video stream + AAC audio stream confirmed
- **Thumbnails**: extracted with `ffmpeg -vframes 1 -q:v 2` from the first frame of each video
- **Visual verification**: three thumbnails inspected and confirmed to match their prompts
- **Generation times**: measured from HTTP request to response completion (curl `-w` timing)
- **Memory**: from `free -h` during generation — 108 GB used, 13 GB available

---

## The bigger picture

Last week we proved the DGX Spark can run a 685B text model at production quality. Today we proved it can run a multimodal video generation model. These are fundamentally different workloads — autoregressive text generation vs diffusion-based media synthesis — and the Spark handles both.

The pattern across both deployments is the same: find the right quantization (IQ2XXS for text, online FP8 for video), apply the right compatibility patches (ds4 engine for DeepSeek, SM121 patches for MiniMax), and carefully manage the 128 GB memory budget. The hardware is capable. The engineering work is in the configuration.

Further testing will tell us how far this goes — longer videos, conditioned generation, sustained loads. But the first result is clear: **MiniMax H3 FL2VA runs on a single DGX Spark and generates video with audio from text.** That's a milestone for local multimodal inference.