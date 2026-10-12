---
slug: midnight-munchies-lessons
title: "What Midnight Munchies taught us about keeping a cast"
excerpt: "A style prompt will not hold a face. The final local cut, and the recipe we wrote so the next film does not start over."
date: 2026-10-11
categories:
  - Workshop
  - Video
readTime: 3
image: /images/blog/midnight-munchies-lessons.svg
author: Jasmine Naderi
authorKey: jasmine
series: jasmine
tags:
  - workshop
  - video
  - minimax
  - continuity
canonicalUrl: https://www.smfclearinghouse.com/blog/midnight-munchies-lessons/
---

The first three cuts of Midnight Munchies taught us the story. The last cut taught us the cast. Michael posted that local finish as the final version.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Final version of Midnight Munchies. Made entirely locally using <a href="https://x.com/MiniMax_AI?ref_src=twsrc%5Etfw">@MiniMax_AI</a> H3 <a href="https://t.co/pkHyBaSUuK">pic.twitter.com/pkHyBaSUuK</a></p>&mdash; Mike Gannotti 🔳 (@MichaelGannotti) <a href="https://x.com/MichaelGannotti/status/2109444937104166947?ref_src=twsrc%5Etfw">October 12, 2026</a></blockquote>

The earlier public cuts are in [Three cuts of Midnight Munchies](https://www.smfclearinghouse.com/blog/midnight-munchies-three-cuts/). This note is what changed after those, and where the process now lives.

## A paragraph will not hold a person

We wrote the same lock into every prompt. Same clown. Same mechanic. Same alien. Same werewolf. Same vampire. The words held the idea of the film. They did not hold a face.

On the local third scene the vampire drifted. Pale skin. Black hair. A different woman. Adding more adjectives would have been the same mistake again. The model had already ignored the paragraph.

A style LoRA is the same kind of tool. It knows tape, neon, grain, and period wardrobe. It does not know who is wearing them. A trigger word on a hosted video call does not load those weights either. If the look has to be the local weights, the job has to be the local graph.

## One still, one person

The lock that held was a picture.

One still of the vampire alone. Face readable. Full costume. No one else in the frame. That still went in as `<Picture 1>`, through the reference node, with the video VAE connected. Without the VAE, the still is only a hint to the text encoder. That is the weak path, and it will drift.

The rerun held. The wide shot and the close-up at the ten-second beat were the same woman: teased hair, heavy makeup, leather jacket, short skirt, cape. The last frame cropped her face out. A freeze at the end of a clip does not prove the cast. Pull the beat you care about.

A group lineup is a casting sheet, not a lock. The model can pick the wrong body out of it. From here, a recurring character gets one approved still before the first denoise. Five characters means five stills. Number them. Never reorder them. `<Picture 1>` stays the same person in every clip.

If a face still drifts, rerun that clip at the stronger reference size. Do not rewrite the paragraph. Do not swap the still halfway through the piece.

One wiring note, because it cost a dead job. The input name is `ref_images.ref_image_0`. The flat name `ref_image_0` is rejected in seconds. The prompt tag is 1-based even though the input ends in `_0`.

## A still is not a cut

The still holds who someone is. It does not hold how the last clip was moving. Three finished clips, joined in the editor, are a hard cut. That is what this final version is. It is the right tool when the cut is the point.

A longer film needs the other tool. Save the sampler latent. Load a short overlap into the next clip. Trim that overlap before you stitch, or the join plays twice. Pass the same stills, in the same order, on every segment. One clip, then a cooldown, then the next. Do not ask for one long denoise and call it a movie.

That chain is written down. It is not yet a finished Midnight Munchies cut. We will not call it locked until a two-clip test comes back and the stills hold.

## Where the recipe lives

The process is in [SMF Video Recipes](https://github.com/smfworks/smf-video-recipes). The first recipe is the local MiniMax H3 Comfy graph: the nodes, the lengths we measured, the identity stills, the failed input name, and the chain for the next length. A prompt is not a recipe. A successful file is not a finished cast.

The next piece starts with the stills, not with a paragraph we hope the model remembers.

Follow [@MichaelGannotti](https://x.com/MichaelGannotti) for the films as they land.
