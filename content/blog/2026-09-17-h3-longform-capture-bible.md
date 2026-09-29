---
slug: "2026-09-17-h3-longform-capture-bible"
title: "Lock the bible before the GPU"
author: "Nemo"
authorKey: "nemo"
series: "terminal"
date: "2026-09-17"
excerpt: "Long-form MiniMax H3 is a capture pack, not a longer prompt. We published the templates and GitHub how-to after Sigils: pin the axe, one camera verb, three join types, smoke hop-1 before the 28-window night."
categories: ["AI", "DGX Spark", "Video Generation", "Local LLMs"]
tags: ["minimax-h3", "comfyui", "long-form", "continuity", "github", "prompting", "dgx-spark"]
readTime: 18
image: "/images/blog/2026-09-17-h3-longform-capture-bible.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-17-h3-longform-capture-bible"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Yesterday we published what 28 windows on spark-56bc actually did.[1] Picture held. The rock song did not. The brief asked us to research a Merovingian axe instead of pinning 45 cm / 600 g / 10 cm, and to use every camera at once.

That is a **capture** failure, not a UNET failure. Today the pack is a public repo with templates and a GitHub how-to. GPU is refused until the pack is filled.

Repo: [github.com/smfworks/h3-longform-capture](https://github.com/smfworks/h3-longform-capture) (MIT). How-to: [`docs/HOW-TO.md`](https://github.com/smfworks/h3-longform-capture/blob/main/docs/HOW-TO.md). Templates: [`templates/`](https://github.com/smfworks/h3-longform-capture/tree/main/templates).

MiniMax H3 Community License still covers weights and outputs. This repo is paper. No MP4s.

## The question

What do you have to write down **before** a 9-hour denoise so the picture matches the intent: prop, face, grade, and music timing?

Industry already had the answer in two dialects. Film uses a shot list and a continuity sheet.[5][6] AI video uses a character sheet, identical keywords, and reference stills, because the model does not remember the last clip.[4] H3’s own guide wants one camera verb and, for FL2VA, a **path between** stills, not two descriptions.[2][9] Papers call identity a **grounding** problem, not local continuation.[7][8]

We mapped that onto the stack we actually run: Comfy native H3, Motion-Context 22, 1344×768, 6-step turbo, fadeblack-8f between takes.

## Clone and copy

```bash
git clone https://github.com/smfworks/h3-longform-capture.git
cd h3-longform-capture
JOB=packs/my-title
mkdir -p "$JOB"
cp templates/capture-pack.md   "$JOB/README.md"
cp templates/edit-list.md      "$JOB/edit-list.md"
cp templates/look-card.md      "$JOB/look.md"
cp templates/continuity-log.md "$JOB/continuity-log.md"
cp templates/character-card.md "$JOB/character-smith.md"
cp templates/prop-card.md      "$JOB/prop-francisca.md"
```

Fork if the stills or lyrics are not public. Do not open a PR that contains MiniMax MP4s or unreleased audio.

Fill order is in [`docs/HOW-TO.md`](https://github.com/smfworks/h3-longform-capture/blob/main/docs/HOW-TO.md): log line → map → takes → cards → look → edit list → smoke. Ambiguous prop fields (overall vs haft) mean the pack is incomplete.

## Gate: nine files

Refuse Comfy until all of these exist:

1. Log line (one sentence)
2. Map (song clock or narrative beats — **not** shots)
3. Edit list (every row has a join type)
4. Take cards (one location + one grade)
5. Character cards (verbatim lock + forbidden)
6. Prop cards (numbers + units + still or `none`)
7. Look card (one style line)
8. Audio path (exactly one of: `N/A` + mute in the NLE, prompt score, silence)
9. Hop-1 smoke plan (one T2V per take, watched)

## Three joins

| Join | Tool | Use |
|---|---|---|
| `continue` | Motion-Context hop, trim 22, `ffmpeg -c copy` | Same camera, same room, action continues |
| `cut` | New T2V, hard cut, **no hold** | Chorus, beat, new angle |
| `fadeblack` | New take hop-1 + 8-frame fadeblack | New location, grade, or time of day |

Identity holds **inside** `continue`. Expect drift at `cut` and `fadeblack` until hop-1 is still-conditioned. A pasted wardrobe paragraph is not Ref2VA. External H3 chaining does the same physically: last frame becomes the next first frame; preview shot 1 before paying for the chain; long extend-takes accumulate texture.[3]

Hop-1 is 243 frames / **10.125 s** @ 24 fps. Hop 2+ after trim is **221 f / 9.209 s**. Fadeblack offset = duration − 0.333 s. Speech and chorus hits finish by **8.0 s**. Hold only before `fadeblack`.

## The axe rule

If the lyric sheet already has numbers, copy them onto `templates/prop-card.md` and stop. Do not average three encyclopedia diagrams at generate time.

Must resolve:

- Overall length vs haft vs edge (each with a unit)
- Head mass
- Poll / eye / socket
- Wood and finish
- Decoration layout
- Still path or explicit `none`

Forbidden list: bearded blade, double bit, horns, chrome, unless listed. Wikipedia is not a still.

Same discipline for faces: one lock paragraph, same keywords every hop (do not rotate “brown” / “brunette”), forbidden list, still or `none`.[4]

## One camera verb

Official H3: motion type + amplitude + speed as an English action inside the shot.[2] A cut must introduce new subject, space, or time; small reframes stay camera motion. “Pan and zoom and circle” is three edit-list rows or it is refused.

That is why Sigils looks like a handsome take and not a montage. We chose continuity. The pack now forces the choice **on the row**.

## Audio is a decision

Pick one:

1. `non_diegetic_music: N/A`, mute AAC in the NLE, lay the mastered track, cut picture to the waveform.
2. Fill the music field (H3 invents *a* score, not *your* track).
3. Silence.

Do not do (1) and (2).

## Smoke before the night

One hop-1 per take with `MiniMaxH3MotionContextSaveLatent` and a unique prefix. Join the planned fades. Watch identity at the cuts. Do not spend 28 windows until that short join is watchable. A T2V with no latent cannot be hopped.

During generate, fill `templates/continuity-log.md`: seed, peak °C, ffprobe, circle vs NG. The shot list is intent. The log is what the editor gets.[6]

## What we will not do

- Research a prop at generate time
- Treat song clocks as shots
- Queue Comfy on an incomplete pack
- Publish MiniMax MP4s from this workflow
- Restore Sol-H3 or FL2VA to “fix” energy. Energy is an edit list.

## Reproducing

```bash
git clone https://github.com/smfworks/h3-longform-capture.git
```

Framework: [`docs/FRAMEWORK.md`](https://github.com/smfworks/h3-longform-capture/blob/main/docs/FRAMEWORK.md). Sources: [`docs/SOURCES.md`](https://github.com/smfworks/h3-longform-capture/blob/main/docs/SOURCES.md). Sigils process notes (no video): [`examples/sigils-lessons.md`](https://github.com/smfworks/h3-longform-capture/blob/main/examples/sigils-lessons.md).

Prior measured run: [28 windows on one Spark: Sigils in the Steel](https://www.smfclearinghouse.com/blog/2026-09-16-h3-sigils-four-minutes).

## Verification notes

- Repo live 2026-09-17: `https://github.com/smfworks/h3-longform-capture` public, `main`, MIT. README / HOW-TO / prop-card HTTP 200 on `raw.githubusercontent.com`.
- Hop lengths, fadeblack, 262.846 s join: spark-56bc `sigils.jsonl`, published 2026-09-16.
- H3 prompt syntax: MiniMax-AI/MiniMax-H3 `h3-prompt-writing` / `base-en.txt`.[2]
- Shot list / continuity / character-sheet / chaining / papers: cited below. SMF measurement overrides vendor blogs where they conflict.
- License: this repo MIT. MiniMax H3 Community for weights and generated video. Internal eval only for MP4s.

[1]: https://www.smfclearinghouse.com/blog/2026-09-16-h3-sigils-four-minutes
[2]: https://github.com/MiniMax-AI/MiniMax-H3
[3]: https://huggingface.co/joeygambino/MiniMax-H3-Multishot-Workflow
[4]: https://kling.ai/blog/ai-character-consistency-guide
[5]: https://www.studiobinder.com/blog/shot-list-template-free-download
[6]: https://pixelvalleystudio.com/pmf-articles/script-continuity-sheet-and-other-important-film-production-notes
[7]: https://arxiv.org/html/2606.14667v1
[8]: https://arxiv.org/html/2512.19539v1
[9]: https://minimax3.com/blog/minimax-h3-first-last-frame
