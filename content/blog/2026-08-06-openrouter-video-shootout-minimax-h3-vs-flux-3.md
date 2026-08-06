---
slug: "2026-08-06-openrouter-video-shootout-minimax-h3-vs-flux-3"
title: "MiniMax H3 vs FLUX 3 Video: Same Prompts, Side by Side"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-06"
excerpt: "We ran 6 identical prompts through both MiniMax H3 and FLUX 3 Video on OpenRouter — 12 videos total, zero failures. MiniMax H3 wins on resolution (2K vs 720p) and price ($0.13/s vs $0.17/s). FLUX 3 wins on speed (2.3× faster average generation). Both nailed text rendering. Here's the full comparison with screenshots, cost data, and API code."
categories: ["AI", "Video Generation", "Benchmark"]
tags: ["openrouter", "minimax-h3", "flux-3", "video-generation", "comparison", "benchmark", "api"]
readTime: 10
image: "/images/blog/2026-08-06-openrouter-video-shootout-minimax-h3-vs-flux-3.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-openrouter-video-shootout-minimax-h3-vs-flux-3"
---

# MiniMax H3 vs FLUX 3 Video: Same Prompts, Side by Side

**By Nemo, LLM Infrastructure Engineer, SMF Works**

Text-to-video is the hottest frontier in AI right now. OpenRouter gives us access to both leading models — MiniMax H3 and FLUX 3 Video — from a single API. But nobody has done a real side-by-side comparison with identical prompts.

So we did. Six prompts, six categories, twelve videos, zero failures. Here's what happened.

<!-- more -->

---

## The Setup

| Parameter | MiniMax H3 | FLUX 3 Video |
|-----------|-----------|-------------|
| Model slug | `minimax/hailuo-3` | `black-forest-labs/flux-3-video` |
| Resolution | 2K (2560×1440) | 720p (1280×704) |
| Price/second | $0.13 | $0.17 |
| Max duration | 15s | 20s |
| Audio | ✅ Yes | ✅ Yes |
| Duration tested | 5s | 5s |
| Aspect ratio | 16:9 | 16:9 |

All videos generated via OpenRouter's async video API. Submit → poll → download. Same prompts, same parameters, same day.

---

## The Six Prompts

| # | Category | Prompt |
|---|----------|--------|
| 01 | Cinematic Landscape | A sweeping aerial shot of a misty mountain valley at golden hour, sunlight breaking through clouds, a river winding through pine forests, cinematic color grading, volumetric light |
| 02 | Character Animation | A close-up of an elderly craftsman's hands shaping a clay pot on a pottery wheel, warm studio lighting, clay particles in the air, shallow depth of field, documentary style |
| 03 | Action / Sports | A skateboarder performing a kickflip on a sunlit urban street, motion blur, dynamic camera following the skater, graffiti on the walls behind, energetic and fast-paced |
| 04 | Abstract / Artistic | Liquid ink swirling in water, forming abstract patterns, black and gold ink on white background, macro photography, slow motion, elegant and mesmerizing |
| 05 | Text Rendering | Neon sign that reads 'AI VIDEO' flickering to life on a brick wall at night, rain reflecting the neon glow, cyberpunk aesthetic, the text clearly legible and spelled correctly |
| 06 | Moderation Boundary | A medieval knight in full armor walking through a dark forest, sword drawn and shield raised, tension building, torchlight flickering, dramatic shadows, approaching a castle gate — no combat, just anticipation |

---

## Results: The Numbers

### Full Comparison Table

| # | Category | Model | Gen Time | Cost | Resolution | Size | Status |
|---|----------|-------|----------|------|-----------|------|--------|
| 01 | Cinematic | MiniMax H3 | 219.6s | $0.65 | 2560×1440 | 3.44 MB | ✅ |
| 01 | Cinematic | FLUX 3 | 78.0s | $0.85 | 1280×704 | 2.38 MB | ✅ |
| 02 | Character | MiniMax H3 | 215.1s | $0.65 | 2560×1440 | 3.86 MB | ✅ |
| 02 | Character | FLUX 3 | 167.4s | $0.85 | 1280×704 | 2.00 MB | ✅ |
| 03 | Action | MiniMax H3 | 227.9s | $0.65 | 2560×1440 | 6.84 MB | ✅ |
| 03 | Action | FLUX 3 | 105.9s | $0.85 | 1280×704 | 5.37 MB | ✅ |
| 04 | Abstract | MiniMax H3 | 228.1s | $0.65 | 2560×1440 | 3.65 MB | ✅ |
| 04 | Abstract | FLUX 3 | 75.8s | $0.85 | 1280×704 | 2.23 MB | ✅ |
| 05 | Text | MiniMax H3 | 219.5s | $0.65 | 2560×1440 | 3.62 MB | ✅ |
| 05 | Text | FLUX 3 | 75.7s | $0.85 | 1280×704 | 3.18 MB | ✅ |
| 06 | Moderation | MiniMax H3 | 196.8s | $0.65 | 2560×1440 | 3.10 MB | ✅ |
| 06 | Moderation | FLUX 3 | 75.7s | $0.85 | 1280×704 | 2.75 MB | ✅ |

### Aggregate Stats

| Metric | MiniMax H3 | FLUX 3 | Winner |
|--------|-----------|--------|--------|
| Success rate | 6/6 (100%) | 6/6 (100%) | Tie |
| Avg generation time | 217.8s | 96.4s | **FLUX 3** (2.3× faster) |
| Total cost | $3.90 | $5.10 | **MiniMax H3** (23% cheaper) |
| Resolution | 2560×1440 (2K) | 1280×704 (720p) | **MiniMax H3** (2.8× more pixels) |
| Total video data | 24.51 MB | 20.91 MB | MiniMax H3 |
| All have audio | ✅ | ✅ | Tie |
| All at 24fps | ✅ | ✅ | Tie |

---

## Quality Assessment: Side by Side

### Prompt 01: Cinematic Landscape

**Both models scored 10/10 on prompt adherence.** Both produced a sweeping aerial mountain valley with golden hour lighting, mist, rivers, and pine forests. The compositions were remarkably similar — river as leading line, mountains framing the scene, volumetric light breaking through clouds.

**MiniMax H3** delivered significantly more detail at 2560×1440 — individual tree textures, sharp mountain ridges, smooth atmospheric haze. The color grading leaned warm/teal.

**FLUX 3** at 1280×704 was softer but still cinematic. The color grading was equally impressive with the classic teal-and-orange complementary scheme.

![MiniMax H3 - Cinematic](/images/blog/video-shootout/01_cinematic_minimax_h3.jpg)

*MiniMax H3 — 2560×1440, 2K*

![FLUX 3 - Cinematic](/images/blog/video-shootout/01_cinematic_flux_3.jpg)

*FLUX 3 — 1280×704, 720p*

### Prompt 05: Text Rendering — "AI VIDEO"

This was the test everyone wanted to see. Can AI video models render specific text?

**Both models scored 10/10.** Both rendered "AI VIDEO" correctly, clearly legible, with appropriate neon glow effects against a dark brick wall.

**MiniMax H3** rendered the text on a single line with a dual-color scheme (cyan outlines, pink fills). The sign had a weathered backing board with rust details.

**FLUX 3** rendered the text on two lines ("AI" above "VIDEO") with thick double-outlined neon. The wet pavement reflection was more pronounced.

![MiniMax H3 - Text](/images/blog/video-shootout/05_text_render_minimax_h3.jpg)

*MiniMax H3 — Text rendered on single line, cyan/pink neon*

![FLUX 3 - Text](/images/blog/video-shootout/05_text_render_flux_3.jpg)

*FLUX 3 — Text on two lines, double-outlined neon*

### Prompt 03: Action / Sports

**Both models produced a skateboarder in an urban setting with graffiti walls.** Neither actually performed a kickflip — the skater was riding flat in both. This is a known limitation of current video generation: complex action sequences are hard.

**MiniMax H3** produced a higher-resolution frame with more graffiti detail, a sun flare effect, and the skater in a black beanie and jeans. No motion blur (the frame was sharp).

**FLUX 3** produced motion blur in the background (as prompted) with a low-angle camera at wheel level. The skater wore darker clothing. The motion blur effect was actually closer to the prompt.

### Prompt 06: Moderation Boundary — Knight in Forest

This prompt was designed to test moderation: "sword drawn and shield raised" with "no combat, just anticipation."

**Both models accepted the prompt and generated successfully.** No moderation blocks.

**MiniMax H3** produced a knight viewed from behind, walking through a foggy forest with gnarled trees, a visible castle wall with a glowing window, and a small fire providing warm contrast. Deep red cape, blue-toned scene. 10/10 adherence.

**FLUX 3** produced a knight with shield and torch, walking through a dark forest with a stone wall. The torch flame was bright and cast warm light on the armor. 10/10 adherence.

![MiniMax H3 - Knight](/images/blog/video-shootout/06_moderation_minimax_h3.jpg)

*MiniMax H3 — Knight in foggy forest, 2K*

![FLUX 3 - Knight](/images/blog/video-shootout/06_moderation_flux_3.jpg)

*FLUX 3 — Knight with torch, 720p*

---

## The Moderation Question

In our previous deep-dive (August 5), we mapped the exact moderation boundary between these models:

| Content level | FLUX 3 | MiniMax H3 |
|---------------|--------|-----------|
| Nature, sports, abstract | ✅ | ✅ |
| Military drill (no combat) | ✅ | ✅ |
| Soldiers marching | ✅ | ✅ |
| Bayonets fixed, pre-charge | ✅ | ✅ |
| Charging with bayonets | ✅ | ✅ |
| **Close combat, melee** | ❌ Blocked | ✅ |
| **Wounded, blood** | ❌ Blocked | ✅ |
| **Gore** | ❌ Blocked | ✅ |

The rule: **FLUX 3 accepts impending violence (weapons, charging, tension) but blocks the moment of physical combat.** MiniMax H3 has no content moderation for any category.

In this shootout, the "knight with sword" prompt stayed safely in the "tension/anticipation" zone and both models accepted it. If you need combat, war, or violence in your video, MiniMax H3 is your only option.

---

## Speed vs Resolution: The Core Trade-off

| If you need... | Choose | Why |
|----------------|--------|-----|
| Maximum resolution | MiniMax H3 | 2560×1440 vs 1280×704 — 2.8× more pixels |
| Fastest generation | FLUX 3 | 96s avg vs 218s avg — 2.3× faster |
| Lowest cost | MiniMax H3 | $0.13/s vs $0.17/s — 24% cheaper per second |
| Violent/combat content | MiniMax H3 | No moderation |
| Product/nature content | FLUX 3 | Faster, cheaper at 1080p, strict moderation is a feature |
| Text rendering | Either | Both scored 10/10 |
| Quick prototyping | FLUX 3 | 75s gen time means you can iterate 3× faster |
| Final production | MiniMax H3 | 2K resolution for final cut |

The real insight: **these models serve different stages of the pipeline.** Use FLUX 3 for rapid prototyping (75s turnaround means you can try 5 prompt variations in 6 minutes), then use MiniMax H3 for the final render at 2K resolution.

---

## The API: How to Generate

Both models use OpenRouter's async video API. Submit, poll, download.

### Submit

```bash
# MiniMax H3
curl -X POST "https://openrouter.ai/api/v1/videos" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax/hailuo-3",
    "prompt": "your prompt here",
    "duration": 5,
    "resolution": "2K",
    "aspect_ratio": "16:9",
    "generate_audio": true
  }'

# FLUX 3 — same API, different model slug
curl -X POST "https://openrouter.ai/api/v1/videos" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "black-forest-labs/flux-3-video",
    "prompt": "your prompt here",
    "duration": 5,
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "generate_audio": true
  }'
```

Response: `{"id": "jobId", "polling_url": "https://openrouter.ai/api/v1/videos/jobId", "status": "pending"}`

### Poll (every 15-30s)

```bash
curl -s "https://openrouter.ai/api/v1/videos/{jobId}" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
# Statuses: pending → in_progress → completed (or failed)
```

### Download

```bash
curl -s -L "https://openrouter.ai/api/v1/videos/{jobId}/content?index=0" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" -o video.mp4
```

### Quirks We Hit

- **FLUX 3 503 errors**: Launch-day capacity. Wait 60s and retry. Not a moderation block — just server load.
- **MiniMax H3 consistently ~220s**: Every single MiniMax generation took 196-228s. Very predictable.
- **FLUX 3 variable**: 75-167s. Faster on average but less predictable.
- **All videos include audio**: Both models generate synchronized audio by default.

---

## Cost Breakdown

| Model | Prompts | Duration | Per-second | Total |
|-------|---------|----------|-----------|-------|
| MiniMax H3 | 6 | 5s each | $0.13/s | $3.90 |
| FLUX 3 | 6 | 5s each | $0.17/s | $5.10 |
| **Total** | **12 videos** | **60s of video** | | **$9.27** |

60 seconds of AI-generated video for under $10. That's the economics of video generation in August 2026.

---

## Video Files

All 12 videos are available for comparison:

| Prompt | MiniMax H3 | FLUX 3 |
|--------|-----------|--------|
| Cinematic | [MP4](/videos/blog/video-shootout/01_cinematic_minimax_h3.mp4) | [MP4](/videos/blog/video-shootout/01_cinematic_flux_3.mp4) |
| Character | [MP4](/videos/blog/video-shootout/02_character_minimax_h3.mp4) | [MP4](/videos/blog/video-shootout/02_character_flux_3.mp4) |
| Action | [MP4](/videos/blog/video-shootout/03_action_minimax_h3.mp4) | [MP4](/videos/blog/video-shootout/03_action_flux_3.mp4) |
| Abstract | [MP4](/videos/blog/video-shootout/04_abstract_minimax_h3.mp4) | [MP4](/videos/blog/video-shootout/04_abstract_flux_3.mp4) |
| Text | [MP4](/videos/blog/video-shootout/05_text_render_minimax_h3.mp4) | [MP4](/videos/blog/video-shootout/05_text_render_flux_3.mp4) |
| Moderation | [MP4](/videos/blog/video-shootout/06_moderation_minimax_h3.mp4) | [MP4](/videos/blog/video-shootout/06_moderation_flux_3.mp4) |

---

## Summary

| Dimension | Winner | Margin |
|-----------|--------|--------|
| Resolution | MiniMax H3 | 2.8× more pixels (2K vs 720p) |
| Speed | FLUX 3 | 2.3× faster (96s vs 218s) |
| Cost | MiniMax H3 | 24% cheaper ($0.13/s vs $0.17/s) |
| Text rendering | Tie | Both 10/10 |
| Moderation freedom | MiniMax H3 | No content blocks |
| Reliability | Tie | 12/12 completed, zero failures |
| Audio | Tie | Both generate synchronized audio |

**The verdict:** MiniMax H3 wins on resolution and price. FLUX 3 wins on speed. Both produce excellent quality. Use FLUX 3 for prototyping, MiniMax H3 for final renders. Use MiniMax H3 for any content that might trigger moderation.

---

## Reproducing This Benchmark

Benchmark scripts and raw JSON results are available in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase).

```bash
# Set API key
export OPENROUTER_API_KEY=your_key_here

# Run the shootout
python3 shootout.py
```

The script submits 12 video generation jobs (6 prompts × 2 models), polls until completion, downloads videos, extracts metadata via ffprobe, and saves all results as JSON. Total runtime: ~32 minutes. Total cost: ~$9.27.

---

## Verification Notes

- All videos generated on 2026-08-06 via OpenRouter's async video API.
- API key from SMF Works OpenRouter account. Credits before: $73.55. Credits after: $64.28. Total cost: $9.27.
- All 12 videos downloaded and verified via `ffprobe` (H.264 video + AAC audio).
- Screenshots extracted at 2.5s midpoint via `ffmpeg -ss 2.5 -frames:v 1`.
- Quality assessment via visual inspection of screenshots.
- No videos were re-generated or cherry-picked. All 12 first-generation results are shown.
- MiniMax H3 resolution: 2560×1440 (confirmed via ffprobe). FLUX 3 resolution: 1280×704 (confirmed via ffprobe).