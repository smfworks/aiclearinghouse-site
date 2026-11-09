---
title: "Check the Watermark Before the Render, Not After"
date: 2026-11-09T07:00:00-05:00
author: "Jasmine Naderi"
authorKey: jasmine
series: jasmine
categories: ["Jasmine's Workshop"]
tags: ["AI video", "Alibaba Model Studio", "HappyHorse", "Wan 3.0", "video editing", "watermark"]
slug: 2026-11-09-check-the-watermark-before-the-render
canonicalUrl: https://www.smfclearinghouse.com/blog/2026-11-09-check-the-watermark-before-the-render/
image: /images/blog/2026-11-09-check-the-watermark-before-the-render.svg
---

Alibaba's Model Studio now sells two video families with opposite watermark defaults. Wan 3.0 ships clean. HappyHorse stamps the corner unless you flip one field. Same studio, same endpoint shape, opposite behavior — so the default you remember from the last render will quietly brand the next one if you switch families. This is the check that takes five seconds and saves a re-render.

## Pick the model by the job

The model-selection page (updated Nov 02, 2026) splits the work into lanes, and the lanes matter because each lane has different rules downstream:

- **New clip from text:** `happyhorse-1.1-t2v` — audio, 1080P, 3–15 seconds. For longer takes, `wan3.0-video` goes 2–30 seconds with an adaptive aspect ratio and a smart-duration mode (`duration: -1` lets the model pick).
- **Animate a still:** `happyhorse-1.1-i2v` for first-frame. If you need to pin *both* ends of a move — first frame and last frame — that's Wan's job: `wan3.0-video` accepts `first_frame` and `last_frame` images; HappyHorse 1.1 takes a start frame only.
- **Character consistency across scenes:** `happyhorse-1.1-r2v`, which takes 1 to 9 reference images.
- **Edit an existing clip:** `happyhorse-1.0-video-edit`. For effect replication or camera-movement replication, the page routes you to `wan2.7-videoedit` instead.

One lane boundary worth knowing before you plan a sequence: HappyHorse 1.1 tops out at 15 seconds at 24 fps. Wan 3.0 covers 2–30 seconds at 30 fps. If the shot needs to breathe longer than 15 seconds, start in Wan.

## The edit model has a hard 15-second ceiling

`happyhorse-1.0-video-edit` takes exactly one input video and up to five reference images, plus a text instruction. Input rules from its API reference: MP4 or MOV (H.264 recommended), 3–60 seconds, up to 100 MB, longer side no more than 4,096 px, shorter side at least 360 px, 8–60 fps.

The ceiling is on the way out: output is 3–15 seconds. If your input is 15 seconds or shorter, the edit keeps its duration. If it's longer, the system takes the *first* 15 seconds — it does not ask. So if you cut a 40-second take and want the edit at the 30-second mark, trim to the section you want first, then send it. The model edits the opening of whatever you hand it.

One more flag that matters for edits: `audio_setting`. The default `auto` lets the model decide. Pass `origin` and the edit preserves the original audio from the input video. If the sound is the reason the clip works, set it.

## Check the watermark field before every render

This is the whole point of the post, so here it is plainly, from the pages themselves:

- The Wan 3.0 API reference says `watermark` defaults to `false` — "no watermark is added."
- All three HappyHorse pages (text-to-video, reference-to-video, and video edit) say `watermark` defaults to `true`. The edit and reference pages put the mark in the bottom-right corner with the fixed text "Happy Horse"; the text-to-video page says "HappyHorse" in the lower-right corner.

The failure mode is boring and expensive: you render clean for weeks on Wan, switch to HappyHorse for an edit, and the corner comes back branded because you never set a field you never had to set. `watermark` is optional on every one of these endpoints, which is exactly the problem — optional defaults to *something*, and the something differs by family. If a corner matters to you, set the field explicitly on every render, both directions.

## Count references in the right syntax

If you're doing consistency work across the two families, the reference syntax changes under you:

- HappyHorse r2v: `1 to 9` reference images, and you address them in the prompt as `[Image 1]` — brackets and a space, inside a 5,000-character limit (2,500 Chinese).
- Wan 3.0: up to 10 reference images (plus videos, audio, files, and links), addressed as `Image 1` — plain, no brackets, in a 20,000-character limit.

Same idea, different grammar. `Image 1` in a HappyHorse prompt is just text the model will read literally, and `[Image 1]` in a Wan prompt is equally dead. The error you'd get is silence: the model treats the reference tag as prose and the scene wanders. Write the right one for the endpoint you're calling.

## If you're wiring through OpenRouter

The live catalog at `GET /api/v1/videos/models` currently lists `alibaba/happyhorse-1.1` and `alibaba/wan-3.0` (33 rows total, six Alibaba). Two things to read before sending a request: HappyHorse 1.1 on OpenRouter exposes `first_frame` only — no `last_frame` — and its `generate_audio` field is null, versus Wan's `true`. If your pipeline assumes audio and a last frame, that assumption is HappyHorse-shaped, not universal.

## The render-day checklist

1. Pick the lane: new clip, animate, consistency, or edit — and check the duration ceiling that comes with it (HappyHorse 3–15s at 24 fps, Wan 2–30s at 30 fps).
2. Edits: trim the source to the section you want *before* sending it, because the edit model keeps the first 15 seconds and nothing else.
3. Set `watermark` explicitly — `false` on Wan defaults clean, `true` on HappyHorse defaults branded.
4. Edits that should keep their sound: `audio_setting: "origin"`.
5. References: brackets in HappyHorse (`[Image 1]`), plain in Wan (`Image 1`), and never more than the documented count.
