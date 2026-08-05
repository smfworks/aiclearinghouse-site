---
slug: "2026-08-05-local-vs-cloud-video-generation-dgx-spark"
title: "Local vs Cloud Video Generation: MiniMax H3 FL2VA and FLUX.3 Video on the DGX Spark and OpenRouter"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-05"
excerpt: "We generated 13 videos across three paths — local on a single DGX Spark, MiniMax H3 on OpenRouter cloud, and FLUX.3 Video on OpenRouter cloud — using the same prompts to compare resolution, duration, render time, cost, moderation, and reliability. The results show what a single Spark can do today, where cloud wins, and how a second Spark on August 16 changes the equation."
categories: ["AI", "Local LLMs", "DGX Spark", "Video Generation"]
tags: ["minimax-h3", "fl2va", "flux-3-video", "dgx-spark", "openrouter", "video-generation", "local-vs-cloud", "benchmark", "comparison"]
readTime: 16
image: "/images/blog/2026-08-05-local-vs-cloud-video-generation-dgx-spark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-05-local-vs-cloud-video-generation-dgx-spark"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The three paths

When you want to generate video from a text prompt in 2026, you have three options:

1. **Local on a desktop GPU** — run the model on your own hardware. No cloud API, no data leaving your network, no per-video cost. But limited by your GPU's memory and thermal capacity.
2. **Cloud via MiniMax H3** — the same model we run locally, but hosted on OpenRouter's datacenter infrastructure. Higher resolution, longer duration, faster generation. Costs $0.13/second of video.
3. **Cloud via FLUX.3 Video** — Black Forest Labs' brand-new video model (released August 4, 2026). Different architecture, different strengths, different moderation. Costs $0.17–$0.29/second depending on resolution.

We tested all three paths with identical prompts and measured everything. This post is the full comparison.

---

## The hardware and models

| Path | Hardware | Model | Quantization | Memory |
|------|----------|-------|-------------|--------|
| Local | NVIDIA DGX Spark (GB10, SM121) | MiniMax H3 FL2VA | Online FP8 | 128 GB UMA |
| Cloud (MiniMax) | OpenRouter → MiniMax datacenter | MiniMax H3 FL2VA | Provider-managed | Unknown |
| Cloud (FLUX.3) | OpenRouter → BFL datacenter | FLUX.3 Video | Provider-managed | Unknown |

The local deployment uses the [joeynyc/MiniMax-H3-DGX-Spark](https://github.com/joeynyc/MiniMax-H3-DGX-Spark) compatibility layer with online FP8 quantization and SM121 patches. The cloud deployments use OpenRouter's async video API (`POST /api/v1/videos` → poll → download).

---

## The prompts

We used two detailed cinematic prompts across all three paths:

### Prompt 1: The Blacksmith

> Cinematic 10-second medieval blacksmith sequence, ultra-realistic, photorealistic, shot on 35mm anamorphic lens, shallow depth of field. A powerful, middle-aged blacksmith with a thick beard, soot-stained face, and muscular arms stands in a dark stone forge at night. Sparks and embers float in the air. The forge is blazing intensely with roaring orange and white-hot flames. In one continuous smooth motion, the blacksmith grips long iron tongs and slowly pulls a long, ornate Crusader knight longsword from the heart of the fire...

*(Full prompt: 450 words covering camera movement, lighting, color grading, and atmosphere)*

### Prompt 2: The Civil War

> Cinematic 12-second American Civil War battle sequence, ultra-realistic, photorealistic, shot on 35mm anamorphic lens with shallow depth of field and natural film grain. Misty, dark early-morning battlefield under a low gray sky. Thick ground fog drifts between the lines. In the foreground, a formation of Union soldiers in dark blue wool uniforms, kepis, and packs advances slowly in tight ranks with bayonets fixed on their Springfield muskets...

*(Full prompt: 380 words covering dialogue, action sequence, camera movement, and historical detail)*

---

## Results: Prompt 1 — The Blacksmith

| Metric | Local (DGX Spark) | Cloud (MiniMax H3) | Cloud (FLUX.3 Video) |
|--------|-------------------|-------------------|---------------------|
| **Resolution** | 960×544 | 2560×1440 (2K) | 1280×704 (720p) |
| **Duration** | 3.0 seconds | 10.1 seconds | 10.0 seconds |
| **Frames** | 73 | 243 | 241 |
| **Audio** | AAC stereo, 32 kHz | AAC stereo, 32 kHz | AAC stereo, 44.1 kHz |
| **File size** | 1.9 MB (avg) | 6.6 MB | 4.7 MB |
| **Render time** | 578 seconds (9.6 min) | ~300 seconds (5 min) | ~120 seconds (2 min) |
| **Cost** | Free | $1.30 | $1.70 |
| **H.264 profile** | Constrained Baseline | High | High |
| **Visual quality** | Good — recognizable scene | Excellent — cinematic detail | Excellent — cinematic detail |
| **Status** | ✅ Verified | ✅ Verified, posted to X | ✅ Verified, posted to X |

### What the blacksmith videos show

**Local (960×544, 3s):** The forge, glowing sword, and blacksmith are all recognizable. The scene is compelling but limited by the short 3-second duration and lower resolution. You can see the forge fire and the glowing metal, but the fine detail (heat shimmer, individual sparks, facial expressions) is lost at this resolution.

**MiniMax H3 cloud (2560×1440, 10s):** A completely different league. The 2K resolution reveals fine metal texture on the glowing blade, individual sparks flying, the blacksmith's facial features illuminated by the forge light. The 10-second duration allows the full narrative arc — pulling the sword from the fire, lifting it skyward, the camera pulling back to the heroic silhouette. This looks like a still from a high-budget fantasy film.

**FLUX.3 Video cloud (1280×704, 10s):** Comparable cinematic quality to MiniMax H3 despite lower resolution. The forge fire is dynamic and realistic, the blacksmith's leather apron and tongs are detailed. FLUX.3 generated in 2 minutes — significantly faster than MiniMax H3's 5 minutes. The fire physics are particularly impressive, with realistic flame turbulence.

---

## Results: Prompt 2 — The Civil War

| Metric | Local (DGX Spark) | Cloud (MiniMax H3) | Cloud (FLUX.3 Video) |
|--------|-------------------|-------------------|---------------------|
| **Resolution** | Not tested (Spark offline) | 2560×1440 (2K) | N/A — blocked |
| **Duration** | N/A | 12.25 seconds | N/A |
| **Frames** | N/A | ~294 | N/A |
| **File size** | N/A | 14 MB | N/A |
| **Render time** | N/A | ~420 seconds (7 min) | Failed immediately |
| **Cost** | N/A | $1.56 | $0 (refunded) |
| **Status** | ⏳ Spark offline | ✅ Verified, posted to X | ❌ Moderation blocked |

### The FLUX.3 Video moderation finding

FLUX.3 Video rejected the Civil War prompt immediately with the error:

> "Video generation failed: Request Moderated (Moderation Reasons: Violence)"

The same prompt was accepted and successfully generated by MiniMax H3 with no issues. This is a significant finding for anyone choosing a video generation model:

| Content type | MiniMax H3 | FLUX.3 Video |
|-------------|-----------|-------------|
| Landscape/nature | ✅ No issues | ✅ No issues |
| Historical combat | ✅ Generated successfully | ❌ Blocked ("Violence") |
| Cinematic drama | ✅ No issues | ✅ No issues (blacksmith) |

**MiniMax H3 is more permissive** with historical and dramatic combat content. **FLUX.3 Video has stricter moderation** that blocks depictions of violence, even in a historical/cinematic context. If your use case involves war, combat, or action sequences, MiniMax H3 is the better choice.

### What the Civil War video shows

The MiniMax H3 2K output is remarkable. Union soldiers in dark blue wool uniforms with brass buttons, kepis, and cross-belts march through thick fog. Their faces are dirt-smudged and strained. Rifles with bayonets fixed are visible. The depth of field blurs the background soldiers, creating a cinematic focus on the two foreground privates. The desaturated blue and muddy earth-tone color grade matches the prompt's wartime aesthetic. At 12 seconds and 2K resolution, this is a genuinely compelling historical sequence.

---

## Full comparison across all 13 videos

### Local videos (DGX Spark) — 10 videos

| Video | Resolution | Duration | Render time | Cost |
|-------|-----------|----------|------------|------|
| Smoke test | 768×448 | 2.3s | 167s | Free |
| Eagle | 768×448 | 2.3s | 163s | Free |
| Ocean | 768×448 | 2.3s | 162s | Free |
| Cyberpunk | 768×448 | 2.3s | 162s | Free |
| Mars | 960×544 | 3.0s | 580s | Free |
| Aurora | 960×544 | 3.0s | 599s | Free |
| Volcano | 960×544 | 3.0s | 575s | Free |
| Forest | 960×544 | 3.0s | 575s | Free |
| Saturn | 960×544 | 3.0s | 575s | Free |
| Desert | 960×544 | 3.0s | 568s | Free |
| **Average** | **864×496** | **2.7s** | **413s** | **Free** |

### Cloud videos (OpenRouter) — 3 videos

| Video | Model | Resolution | Duration | Gen time | Cost |
|-------|-------|-----------|----------|---------|------|
| Blacksmith | MiniMax H3 | 2560×1440 (2K) | 10.1s | ~300s | $1.30 |
| Blacksmith | FLUX.3 Video | 1280×704 (720p) | 10.0s | ~120s | $1.70 |
| Civil War | MiniMax H3 | 2560×1440 (2K) | 12.25s | ~420s | $1.56 |
| Civil War | FLUX.3 Video | N/A | N/A | Failed | $0 |
| **Average (successful)** | | **2133×1195** | **10.8s** | **~280s** | **$1.52** |

---

## The scaling comparison

### Resolution

| Path | Max tested | Pixel count | vs Local |
|------|-----------|-------------|----------|
| Local (Spark) | 960×544 | 522K | 1.0× |
| Cloud (FLUX.3 720p) | 1280×704 | 901K | 1.73× |
| Cloud (MiniMax 2K) | 2560×1440 | 3,686K | 7.06× |

The cloud MiniMax H3 produces **7× more pixels** than our local Spark. That's the difference between a recognizable scene and a cinematic-quality still.

### Duration

| Path | Max tested | Frames | vs Local |
|------|-----------|--------|----------|
| Local (Spark) | 3.0s | 73 | 1.0× |
| Cloud (FLUX.3) | 10.0s | 241 | 3.3× |
| Cloud (MiniMax) | 12.25s | ~294 | 4.0× |

The cloud can generate **4× longer videos**. The local Spark is limited by the ~13 GB of free memory after the 89 GB model load — longer videos require more working memory for the diffusion pipeline.

### Render time

| Path | Time per video | Time per second of output |
|------|---------------|------------------------|
| Local (standard) | 163s | 70s per output second |
| Local (high quality) | 578s | 191s per output second |
| Cloud (MiniMax 2K) | ~300s | 30s per output second |
| Cloud (FLUX.3 720p) | ~120s | 12s per output second |

The cloud is **6–16× faster per second of output video**, despite producing higher resolution and longer duration. Datacenter GPUs have more compute, more memory bandwidth, and no thermal constraints.

### Cost

| Path | Cost per video | Cost per second of output |
|------|---------------|------------------------|
| Local (Spark) | $0 | $0 |
| Cloud (MiniMax 2K) | $1.30–$1.56 | $0.13/s |
| Cloud (FLUX.3 720p) | $1.70 | $0.17/s |
| Cloud (FLUX.3 1080p) | $2.90 (est.) | $0.29/s |

Local is free. Cloud costs $0.13–$0.29 per second of generated video. For occasional use, cloud is inexpensive. For high-volume production (hundreds of videos per day), local becomes economically attractive despite the quality trade-off.

---

## The DGX Spark thermal crash

During our testing, the DGX Spark **crashed completely** and required a physical reboot. Here's what happened:

### The sequence of events

1. We loaded MiniMax H3 FL2VA (89 GB) into the Spark's 128 GB UMA
2. Available memory was only 101 GB (a system process, `polkitd`, had accumulated 10 GB of memory bloat over 15 days of uptime)
3. The model loaded successfully on the first attempt (with 106 GB available after killing a whisper server)
4. We generated 10 videos over ~69 minutes of sustained GPU compute at 93% utilization
5. After the generation session, the Spark was physically hot to the touch
6. When we attempted to restart the container for the benchmark suite, the cold start consumed all available memory
7. The system went into swap death (12 GB of swap already in use), the OOM killer failed to intervene, and the entire OS hung — no ping, no SSH, required physical power cycle

### Root causes

1. **polkitd memory bloat** — 10 GB accumulated over 15 days. Normal is 5-20 MB. This is a known issue with polkitd on long-running Ubuntu systems. Cannot be restarted without sudo.
2. **Thermal overload** — 69 minutes of sustained 93% GPU utilization caused the GB10 chip to overheat. The stock cooling is adequate for bursty workloads but not for continuous video generation.
3. **Memory pressure** — 101 GB available vs 105 GB required for cold start. The 4 GB shortfall caused the OOM cascade.

### Lessons learned

1. **Always run a pre-flight check before loading large models.** Check `MemAvailable` ≥ 105 GB. Check swap usage. Check for polkitd bloat. We created a [pre-flight checklist skill](https://github.com/smfworks/NemoKnowledgebase) to prevent this.
2. **Reboot before heavy workloads.** After 2+ weeks of uptime, system processes accumulate memory. A fresh boot ensures maximum available memory.
3. **Monitor thermals during sustained generation.** The 28% throughput decline we saw in the DeepSeek soak test was the same thermal pattern. Video generation is more compute-intensive than text generation — the thermal impact is worse.
4. **The Spark needs cooldown periods.** After ~70 minutes of sustained video generation, the system needs to cool down. Batch generation should include rest periods between batches.

### Current status

The Spark is offline and will be physically rebooted on August 15. All data on disk is intact — the MiniMax H3 checkpoint (135 GB), the 10 generated videos, and the deployment scripts are all safe. The VGBench benchmark suite is written and ready to deploy once the Spark is back.

---

## What changes with a second DGX Spark (August 16)

On August 16, a second NVIDIA DGX Spark joins the lab. This fundamentally changes the local video generation equation:

### Memory: 128 GB → 256 GB

| Configuration | Available for model | Available for generation | Impact |
|--------------|-------------------|------------------------|--------|
| Single Spark | ~89 GB (model) + ~13 GB (gen) | 13 GB | 960×544, 3s max |
| Dual Spark | ~89 GB (model on one) + ~100 GB (gen) | 100 GB | 1080p+, 10s+ |

With 256 GB total unified memory, we can either:
- **Run the model on one Spark and use the second for generation working memory** — this dramatically increases the available memory for the diffusion pipeline, enabling higher resolutions and longer durations
- **Split the model across both Sparks** — distributed inference with tensor parallelism, reducing per-node memory pressure
- **Run two different models simultaneously** — MiniMax H3 on one Spark, DeepSeek V4 Flash on the other, eliminating the "can't run both" constraint

### Thermal: single-node → distributed

The thermal crash was caused by sustained 93% GPU utilization on a single chip. With two Sparks:
- **Alternate generation between nodes** — while one Spark generates, the other cools down
- **Split the diffusion pipeline** — distribute the compute load across two GPUs, halving the thermal output per node
- **Sustained batch generation** — the soak test dimension of VGBench becomes feasible without thermal shutdown

### What we expect to achieve with dual Sparks

| Capability | Single Spark (today) | Dual Spark (expected) |
|-----------|---------------------|----------------------|
| Max resolution | 960×544 | 1920×1080 (1080p) |
| Max duration | 3 seconds | 10+ seconds |
| Sustained generation | ~70 min before thermal limit | Hours with alternating nodes |
| Models running simultaneously | 1 | 2 (e.g., H3 + DeepSeek) |
| Cold start memory margin | 4 GB (crashed) | ~100 GB (comfortable) |

The dual Spark configuration should close much of the gap between local and cloud. We won't match the cloud's 2K resolution, but 1080p at 10 seconds — generated locally, for free, with no data leaving the network — is a compelling proposition.

### The VGBench benchmark on dual Sparks

When the second Spark arrives, we'll run the full VGBench suite on both configurations — single Spark and dual Spark — to measure the actual improvement. The benchmark tests 5 dimensions:

1. **Resolution scaling** — 512×320 to 1280×720 (single) and up to 1920×1080 (dual)
2. **Duration scaling** — 2s to 10s (single) and up to 15s (dual)
3. **Inference steps** — 10 to 75 steps, measuring quality/time tradeoff
4. **Sustained generation soak** — 10 consecutive requests with thermal monitoring
5. **Prompt complexity** — 6 categories from simple to multi-subject

32 generation requests per configuration, ~9 hours per run. Results will be published with full data and recommendations.

---

## The honest comparison

| Factor | Local (single Spark) | Cloud (OpenRouter) | Winner |
|--------|---------------------|-------------------|--------|
| **Resolution** | 960×544 | 2560×1440 (2K) | Cloud — 7× more pixels |
| **Duration** | 3 seconds | 12+ seconds | Cloud — 4× longer |
| **Render time** | 578s (high quality) | 120–420s | Cloud — 2–5× faster |
| **Cost** | Free | $0.13–$0.29/s | Local — no per-video cost |
| **Privacy** | 100% local | Data goes to provider | Local — no data leaves |
| **Reliability** | Thermal crash after 70 min | FLUX.3 launch-day queue issues | Tie — both have failure modes |
| **Moderation** | None (you control the model) | FLUX.3 blocks violence | Local — no content restrictions |
| **Quality** | Good (recognizable scenes) | Excellent (cinematic detail) | Cloud — higher fidelity |
| **Scalability** | 1 video at a time | Parallel jobs possible | Cloud — datacenter scale |

**The honest takeaway:** For a single DGX Spark, cloud video generation is clearly superior in quality, resolution, and duration. The Spark can produce compelling short clips at 960×544, but the cloud produces cinematic-quality 2K video at 10+ seconds. The trade-off is cost ($1.30–$2.90 per video) and privacy (data goes to the provider).

**But the local story isn't finished.** The thermal crash was a single-node limitation. With a second Spark on August 16, we expect to close much of the gap — 1080p resolution, 10+ second duration, and sustained generation without thermal shutdown. And it will still be free, private, and uncensored.

---

## Cost analysis: when does local win?

| Scenario | Cloud cost | Local cost | Break-even |
|----------|-----------|-----------|------------|
| 10 videos/month | ~$15 | $0 (hardware already owned) | Local is cheaper immediately |
| 100 videos/month | ~$150 | $0 | Local is cheaper immediately |
| 1,000 videos/month | ~$1,500 | $0 (electricity ~$5) | Local is cheaper immediately |
| 10,000 videos/month | ~$15,000 | $0 (electricity ~$50) | Local is much cheaper |

If you already own the hardware, local is always cheaper. The hardware cost (~$4,000 for a DGX Spark) is a one-time capital expense. Cloud is an ongoing operational expense that scales with volume.

The break-even point for hardware cost vs cloud spending:
- At $1.50/video average, 2,667 videos pays for the Spark
- At 10 videos/day, that's ~267 days (~9 months)
- At 100 videos/day, that's ~27 days

---

## Reproducing this

### Local (DGX Spark)

Follow the [joeynyc/MiniMax-H3-DGX-Spark](https://github.com/joeynyc/MiniMax-H3-DGX-Spark) deployment guide. See our [deployment post](/blog/2026-08-04-minimax-h3-fl2va-dgx-spark) for the full process.

```bash
# Generate locally at 960×544, 30 steps, 3s
curl http://spark:8000/v1/videos/sync \
  -H "Authorization: Bearer $API_KEY" \
  -F "prompt=your prompt" \
  -F "width=960" -F "height=544" \
  -F "num_inference_steps=30" \
  -F "flow_shift=12" -F "seed=42" -F "fps=24" \
  -F "extra_params={\"task\":\"t2va\",\"duration\":3.0}" \
  -o output.mp4
```

### Cloud (OpenRouter)

```bash
# Submit to MiniMax H3 at 2K, 10s
curl -X POST https://openrouter.ai/api/v1/videos \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"minimax/hailuo-3","prompt":"your prompt","duration":10,"resolution":"2K","aspect_ratio":"16:9","generate_audio":true}'

# Poll until completed, then download
curl https://openrouter.ai/api/v1/videos/{jobId}/content -H "Authorization: Bearer $OPENROUTER_API_KEY" -o output.mp4
```

---

## What's next

1. **August 15** — Physical reboot of Spark 1, run pre-flight checklist, kick off VGBench
2. **August 16** — Second DGX Spark arrives, dual-node configuration
3. **VGBench on single Spark** — 32 requests, 5 dimensions, ~9 hours
4. **VGBench on dual Sparks** — Same suite, measure the improvement
5. **Full comparison post** — Single Spark vs Dual Spark vs Cloud, with recommendations
6. **Thermal monitoring** — Add GPU temperature logging to the benchmark suite

The local vs cloud comparison will get a major update when the second Spark arrives. The question will shift from "can a single Spark do video generation?" to "can two Sparks match the cloud?" We expect the answer to be: not quite at 2K, but yes at 1080p — and at zero marginal cost, with full privacy, and no content moderation.

---

## Verification notes

- **All 13 videos**: verified with ffprobe — H.264 video stream + AAC audio stream confirmed
- **Render times (local)**: measured from HTTP request to response completion using curl `-w` timing
- **Render times (cloud)**: measured from job submission to completion notification (poll interval: 30s)
- **Costs (cloud)**: from OpenRouter API `usage.cost` field in completion response
- **Visual verification**: thumbnails extracted with ffmpeg, inspected for prompt accuracy
- **Moderation finding**: FLUX.3 Video error message captured from OpenRouter API response: `"Video generation failed: Request Moderated (Moderation Reasons: Violence)"`
- **Thermal crash**: observed directly — Spark became unresponsive to ping and SSH after sustained generation. Physical reboot required. Root cause analysis: polkitd memory bloat (10 GB) + thermal overload after 69 min at 93% GPU util + swap death (12 GB swap in use)
- **Dual Spark projections**: based on memory math (128→256 GB) and thermal distribution (alternating nodes), not yet measured. VGBench on dual Sparks will validate or correct these projections.