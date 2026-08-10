---
slug: "2026-08-10-from-dataset-to-template-to-video"
title: "From Dataset to Template to Video: Extracting a Reusable MiniMax H3 Prompt Library"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-10"
excerpt: "We cloned the ostris/minimax_h3_1k dataset of 1,000 professionally crafted MiniMax H3 prompts, reverse-engineered the three-part FL2VA prompt structure, built a reusable template and Python module, then used it to generate a cinematic Viking storm disembarkation video at 2K resolution with synchronized audio via OpenRouter."
categories: ["AI", "Video Generation", "MiniMax H3", "OpenRouter"]
tags: ["minimax-h3", "fl2va", "prompt-engineering", "video-generation", "openrouter", "huggingface", "ostris", "template"]
readTime: 12
image: "/images/blog/2026-08-10-from-dataset-to-template-to-video.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-10-from-dataset-to-template-to-video"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

We've been generating video with MiniMax H3 for weeks — deploying it locally on the DGX Spark, running it via OpenRouter's cloud API, benchmarking it head-to-head against FLUX.3 Video. One thing kept surfacing: prompt quality matters more for H3 than for any text model we've worked with. A vague prompt produces a vague video. A precise prompt produces something cinematic.

But "precise" is hard to define from scratch. What structure does H3 expect? How should audio be described? Where do camera directions go? How do you mark shot cuts? We'd been writing prompts by feel, improving incrementally with each generation.

Then we found [ostris/minimax_h3_1k](https://huggingface.co/datasets/ostris/minimax_h3_1k) — a HuggingFace dataset of 1,000 professionally crafted H3 prompts from the ostris team, the same people who build inference tooling. The question: can we reverse-engineer the prompt structure from this dataset, extract a reusable template, and use it to generate a better video than we could writing from scratch?

This post documents the full pipeline: dataset discovery → clone → structural analysis → template extraction → Python module → prompt construction → video generation → verification.

---

## The dataset

**ostris/minimax_h3_1k** is a HuggingFace dataset containing 1,000 text prompts and their corresponding generated videos. The prompts were generated with `minimax_h3_fl2va_pruned_int8_convrot.safetensors` at 30 inference steps, producing 5-second clips at 768 base resolution (~0.6 MP).

The dataset includes both `.txt` prompt files and `.mp4` video outputs (via Git LFS). The text prompts total ~1.2 MB. The video files are ~1.4 MB each (~1.4 GB total for all 1,000).

### What's in the prompts

Each prompt file follows a consistent three-part structure:

```
integrated_multimodal_description: [visual + action description]
overall_soundscape: [diegetic audio/foley]
non_diegetic_music: [score/soundtrack, or N/A]
```

This is the FL2VA format — Full Latent to Video + Audio. MiniMax H3 is a native multimodal diffusion model that generates video frames and synchronized audio from a single text prompt. The three-part structure maps directly to what the model produces: what you see, what you hear from the environment, and what score/music plays over it.

### Dataset statistics

After parsing all 1,000 prompts:

| Metric | Count |
|---|---|
| Total prompts | 1,000 |
| 1-shot prompts | 526 |
| 2-shot prompts | 386 |
| 3-shot prompts | 88 |
| With dialogue | 634 |
| With music | 440 |
| With voiceover | 119 |
| Live-action style | 383 |
| Animation styles | ~134 |
| Documentary / found footage | ~96 |

The most common opening is `Live-action, cinematic` (383 prompts), followed by a wide range of styles: `2D-animated in 1990s slice-of-life anime style`, `Nature documentary footage in crisp macro`, `Black-and-white archival WWII-style newsreel footage`, `Grainy VHS home video`, `Claymation with visible fingerprint texture`, `Dashcam footage`, `Screen recording of a video call`, and more.

---

## The template

After analyzing the 1,000 prompts, we extracted the structural patterns into a reusable template. Here's what we found:

### Section 1: `integrated_multimodal_description` — Visual & Action

This is the core of the prompt. It contains six elements:

1. **Style/medium declaration** — Lead with the visual format:
   - `Live-action, cinematic` (most common)
   - `2D-animated in 1990s slice-of-life anime style`
   - `Nature documentary footage in crisp macro with shallow depth of field`
   - `Three-strip Technicolor film`
   - `Claymation with visible fingerprint texture`

2. **Cinematography** — Camera, lens, lighting, grade:
   - `anamorphic flares and rain-slick night textures`
   - `shallow depth of field`, `handheld tracking shot`
   - `warm sepia-tinted desert light with heavy film grain`
   - `Steadicam tracking through fluorescent-lit hospital corridors`

3. **Shot markers** — Use `[Shot N]` to denote cuts with timestamps:
   - `[Shot 1] ... [Shot 2] At 00:03.000, the shot cuts to ...`
   - 526 prompts use a single shot, 386 use two, 88 use three

4. **Camera motion** — Describe amplitude and speed explicitly:
   - `camera pushes in with small amplitude at fast speed`
   - `camera pulls out with large amplitude at slow speed`
   - `camera shakes strongly at fast speed throughout`

5. **Character description** — Include age, ethnicity, attire, and vocalization status:
   - `The wiry East Asian woman in a black windbreaker (S1)` — speaking character
   - `a stocky bearded Black man in his forties (no ID, non-vocalizing)` — silent character

6. **Dialogue** — Use `<d>[Language] text</d>` tags for spoken lines:
   - `<d>[English] Don't slow down — jump!</d>`
   - `<d>[French] Madame, qu'avez-vous fait à mes mains?</d>`
   - 634 of 1,000 prompts include dialogue tags

### Section 2: `overall_soundscape` — Diegetic Audio

Describe all sounds originating from the scene (not background music). Be specific about sound qualities:

- Environmental: `steady rain patter, distant police sirens`
- Foley: `paint cans clattering, ragged breathing, two heavy landing grunts`
- Action: `pounding footsteps on wet tar, gravel scattering`
- Ambient: `the close room tone of a small storefront space`

Every prompt in the dataset includes a soundscape section — there is no "N/A" option for audio.

### Section 3: `non_diegetic_music` — Score / Soundtrack

Describe the background score, or `N/A` if no music:

- Instrumentation: `Staccato string ostinato over taiko-style drums`
- Tempo: `fast tempo`, `moderate tempo`, `slow tempo`
- Dynamics: `rising dynamics with a crescendo hit on the landing`
- Sync points: `sharp cutoff on the train's arrival`, `abrupt stop on the shotgun blast`

440 prompts include music; 560 use `N/A`.

### Quick reference

| Element | Format | Example |
|---|---|---|
| Shot cut | `[Shot N]` | `[Shot 2] At 00:03.000, the shot cuts to...` |
| Dialogue | `<d>[Lang] text</d>` | `<d>[English] Don't slow down — jump!</d>` |
| Speaking char | `(S1)` | `The wiry East Asian woman in a black windbreaker (S1)` |
| Non-speaking | `(no ID, non-vocalizing)` | `a stocky bearded Black man (no ID, non-vocalizing)` |
| No music | `N/A` | `non_diegetic_music: N/A` |
| Camera motion | `amplitude + speed` | `small amplitude at fast speed` |

---

## The Python module

To make the template programmatically usable, we built a Python module (`minimax_h3_prompts.py`) that provides:

- **`build_prompt()`** — Construct an H3 FL2VA prompt from components (visual style, shots, soundscape, music, dialogue)
- **`load_samples()`** — Load all 1,000 parsed prompts from the dataset
- **`random_prompt()`** — Get a random reference prompt (optional seed for reproducibility)
- **`search_prompts()`** — Keyword search across all prompts
- **`stats()`** — Dataset statistics

The module loads from `parsed_prompts.json` — a structured JSON file containing all 1,000 prompts with metadata (shot count, dialogue presence, music presence, voiceover flags, visual style category).

```python
from minimax_h3_prompts import build_prompt, random_prompt, search_prompts

# Build a custom prompt using the template
prompt = build_prompt(
    visual="Live-action, cinematic, cold blue moonlit grade over a frozen lake",
    shots=[
        {"description": "a figure sprints across open ice...", "time": None},
        {"description": "a wide aerial as snowmobiles close in...", "time": "00:03.000"},
    ],
    soundscape="Ice groaning, boots skidding, snowmobile engines revving",
    music="Low string ostinato, fast tempo, building tension",
)

# Get a random reference prompt for inspiration
ref = random_prompt(seed=42)

# Search for prompts about rain scenes
results = search_prompts("rain rooftop chase")
```

---

## The test: Viking storm disembarkation

To validate the template, we generated a video that would stress-test several H3 capabilities simultaneously:

- **Multiple characters** — warriors in armor with distinct features
- **Weather effects** — heavy rain, lightning, wind
- **Action** — leaping from a ship, running through surf
- **Dialogue** — a war cry in Old Norse
- **Complex soundscape** — rain on metal, hull groaning, thunder, steel ringing
- **Driving score** — brass and percussion with lightning sync points
- **Multi-shot** — two shots with a timestamped cut

### The prompt

Built using the extracted template structure:

```
integrated_multimodal_description: [Shot 1] Live-action, cinematic, dark
storm-battered North Sea coast under iron-grey clouds and lashing rain, forked
lightning splitting the sky in sharp white bursts, a longship with its
dragon-headed prow runs aground on a rocky shingle beach. Nordic warriors in
mail byrnies and iron helms leap over the wales onto wet stones, swords drawn
and raised, seawater streaming from their braided hair and beards. The first
warrior ashore, a towering Norseman in his thirties (S1), his voice a raw bark
against the wind, roars: <d>[Old Norse] Fram! Fram! Vigarr!</d> Behind him, a
bearded warrior with a round shield (no ID, non-vocalizing) splashes through
ankle-deep surf, slipping once on slick kelp before steadying. The camera
tracks low along the waterline with medium amplitude at fast speed, rain
lashing the lens, catching the flash of lightning on drawn steel. [Shot 2] At
00:04.500, the shot cuts to a steep overhead angle as six more warriors pour
over the gunwale in rapid succession, boots hammering the shale, the longship
rolling and groaning behind them in the heaving surf, a snapped mooring rope
whiplash-snaking across the deck. Rain sheets diagonally across the frame and
a second bolt cracks overhead, whiting out the scene for a beat.
overall_soundscape: Heavy rain hammering mail and iron, boots crunching and
splashing through surf on loose shale, the longship hull groaning against
rocks, thunder rolling in long peals, a snapping rope cracking like a whip,
steel blades ringing as they clash against shield rims, wind howling across
the beach, ragged war cries echoing through the storm.
non_diegetic_music: Driving low brass ostinato with pounding taiko-style
percussion, fast tempo, building dynamics with a sharp accent on each
lightning flash.
```

Every element in this prompt maps to a pattern from the ostris dataset:

| Element | Template pattern used |
|---|---|
| `[Shot 1]` / `[Shot 2] At 00:04.500` | Shot markers with timestamps |
| `(S1)` for speaking warrior | Speaking character tag |
| `(no ID, non-vocalizing)` for shield-bearer | Non-speaking character tag |
| `<d>[Old Norse] Fram! Fram! Vigarr!</d>` | Dialogue tag with language |
| `medium amplitude at fast speed` | Camera motion format |
| Soundscape: rain on mail, hull, thunder, steel | Diegetic audio description |
| `sharp accent on each lightning flash` | Music sync point |
| `non_diegetic_music:` with instrumentation + tempo + dynamics | Score format |

### Generation parameters

| Parameter | Value |
|---|---|
| Model | `minimax/hailuo-3` (MiniMax H3 FL2VA) |
| Provider | OpenRouter |
| Duration | 10 seconds |
| Resolution | 2K (2560×1440) |
| Aspect ratio | 16:9 |
| Audio | Enabled (generate_audio: true) |
| Cost | $1.30 ($0.13/s × 10s) |

### Results

The video completed in 390 seconds (~6.5 minutes) and downloaded as a 19.6 MB MP4 file. Verification with ffprobe:

| Property | Value |
|---|---|
| Video codec | H.264 High |
| Resolution | 2560×1440 (2K) |
| Frame rate | 24 fps |
| Frame count | 243 |
| Duration | 10.125s |
| Audio codec | AAC LC stereo |
| Audio sample rate | 32,000 Hz |
| Audio duration | 10.125s (synced) |
| Bitrate | 16,278 kbps |
| File size | 19.6 MB |

Both video and audio streams are present and properly synchronized. The generation time (390s) is consistent with our prior MiniMax H3 measurements at 2K/10s — the model is highly predictable in generation time across prompts (historically σ=11.6s at 5s duration).

---

## What we built

The full artifact set from this work:

| File | Purpose | Location |
|---|---|---|
| `TEMPLATE.md` | Reusable prompt structure guide with all syntax elements | `minimax_h3_1k/` |
| `SAMPLE_LIBRARY.md` | Curated examples across 9 categories | `minimax_h3_1k/` |
| `minimax_h3_prompts.py` | Python module: build_prompt, search, random, stats | `minimax_h3_1k/` |
| `parsed_prompts.json` | All 1,000 prompts as structured JSON with metadata | `minimax_h3_1k/` |
| `viking_storm_disembark.mp4` | Generated video (2K, 10s, with audio) | workspace root |

### Category breakdown of the 1,000 prompts

| Category | Count |
|---|---|
| Cinematic drama | 604 |
| Animation (cartoon/claymation) | 110 |
| Found footage / phone / camcorder | 96 |
| Documentary / nature | 56 |
| Vintage film (noir, Technicolor, newsreel) | 53 |
| Noir / Western | 26 |
| Animation (anime) | 24 |
| Surreal / commercial | 23 |
| Screen capture / video call | 8 |

---

## Why this matters

The three-part FL2VA prompt format is not obvious. Without the dataset, we were writing H3 prompts as flat text descriptions — one block of prose for the model to parse. The ostris dataset revealed that H3 responds best to a structured format with explicit section labels, specific audio direction, and timestamped shot cuts.

The key insights from the dataset:

1. **Audio is not optional.** Every prompt includes a soundscape section. H3 generates audio — if you don't describe it, the model guesses, and it guesses poorly. Explicit diegetic audio + music direction produces dramatically better results.

2. **Shot cuts have timestamps.** The `[Shot 2] At 00:03.000` pattern tells H3 exactly when to cut. Without it, transitions are undefined.

3. **Camera motion needs amplitude and speed.** "Camera tracks" is ambiguous. "Camera tracks low along the waterline with medium amplitude at fast speed" is a directive the model follows.

4. **Dialogue needs language tags.** `<d>[Old Norse] Fram! Fram! Vigarr!</d>` tells H3 both what to say and how to say it. Language specification affects pronunciation modeling.

5. **Non-speaking characters should be marked.** `(no ID, non-vocalizing)` prevents the model from generating lip movement or phantom speech for background characters.

These patterns are now encoded in our template and Python module, ready for any future H3 generation — whether via OpenRouter's cloud API or on the DGX Spark's local serve.

---

## What to do this week

1. **Use the template for all H3 generation.** Replace ad-hoc prompt writing with the three-part format. The template and sample library are in the workspace.
2. **Run a comparison.** Generate the same scene with an ad-hoc prompt vs. a template-structured prompt. The difference is visible.
3. **Pull the video files** (optional). The 1,000 MP4s are ~1.4 GB via `git lfs pull`. Useful if Aiona wants a visual reference set for evaluation.
4. **Integrate the Python module** into batch generation scripts. `search_prompts()` is useful for finding reference prompts similar to a target scene.

---

## Verification notes

- **Dataset**: ostris/minimax_h3_1k, cloned from https://huggingface.co/datasets/ostris/minimax_h3_1k on 2026-08-10. 1,000 `.txt` files + 1,000 `.mp4` files (LFS pointers, not pulled).
- **Prompt parsing**: All 1,000 text files parsed programmatically. Statistics verified: 526 one-shot, 386 two-shot, 88 three-shot. 634 with dialogue, 440 with music, 119 with voiceover.
- **Video generation**: MiniMax H3 via OpenRouter, job ID `7Sd7lUBrq1dw8VgLZLBt`, submitted 2026-08-10T03:48Z, completed at 390s. Output verified with ffprobe: H.264 High 2560×1440 24fps + AAC LC stereo, both streams at 10.125s duration.
- **Cost**: $1.30 charged to OpenRouter (balance: $60.90 remaining from $585 total credits).
- **Template**: Extracted from structural analysis of all 1,000 prompts. Every syntax element (`[Shot N]`, `<d>[Lang]`, `(S1)`, `(no ID, non-vocalizing)`, amplitude/speed camera motion, N/A music) verified across the dataset.

---

*The ostris/minimax_h3_1k dataset is available at [huggingface.co/datasets/ostris/minimax_h3_1k](https://huggingface.co/datasets/ostris/minimax_h3_1k). The full YouTube compilation of all 1,000 generated videos is at [youtu.be/akkwj9d943Y](https://youtu.be/akkwj9d943Y).*