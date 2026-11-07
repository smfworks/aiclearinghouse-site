---
slug: "2026-11-07-pick-the-model-then-check-the-watermark"
title: "Pick the Model by the Job. Then Check the Watermark."
excerpt: "Alibaba split its video map into three lanes: HappyHorse 1.1 for new clips, HappyHorse 1.0 for edits, Wan 3.0 for long takes. Wan ships clean by default. HappyHorse brands the corner unless you set the field."
date: "2026-11-07T07:00:00-05:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "AI Video", "Visual Craft"]
tags: ["happyhorse", "wan", "video-generation", "watermark", "alibaba-cloud", "workshop"]
readTime: 5
image: "/images/blog/2026-11-07-pick-the-model-then-check-the-watermark.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-07-pick-the-model-then-check-the-watermark"
---

Pick the model by the job, then check the watermark field before you render.

That is the whole move. Alibaba reworked its [video model-selection page](https://www.alibabacloud.com/help/en/model-studio/video-generate-edit-model/) on November 2, and the recommendation list stopped being one family. Three lanes now, and each lane has its own model id — plus one default that will quietly brand the corner of your clip if you never look at it.

## The three lanes

New clip from text: `happyhorse-1.1-t2v`. Animate a still: `happyhorse-1.1-i2v`. Keep a character consistent across scenes: `happyhorse-1.1-r2v`. The [selection page](https://www.alibabacloud.com/help/en/model-studio/video-generate-edit-model/) recommends each of those by name, for text-to-video, first-frame image-to-video, and reference image-to-video respectively. The whole 1.1 family runs 3 to 15 seconds at 24 fps, MP4 out.

Editing an existing clip is its own model now: `happyhorse-1.0-video-edit`. The selection page splits the editing lane in two — instruction-based editing goes to the HappyHorse edit model, and effect replication or camera-movement replication stays on `wan2.7-videoedit`. Same verb, different model, depending on what you are changing.

Long takes are Wan's lane. The page recommends `wan3.0-video` (or `wan3.0-video-prime` when speed matters) for anything up to 30 seconds, adaptive aspect ratio, smart duration, first/last-frame stitching, and file or link inputs. HappyHorse tops out at 15 seconds. If the cut needs more, that is the boundary.

## What the edit model takes

The [edit API reference](https://www.alibabacloud.com/help/en/model-studio/happyhorse-video-edit-api-reference/) fixes `model` to `happyhorse-1.0-video-edit`. The `media` array must contain exactly one `video` element, plus zero to five `reference_image` elements. Input video: MP4 or MOV, H.264 recommended, 3 to 60 seconds, up to 100 MB, frame rate 8 to 60 fps.

The output rule is the one that bites: 3 to 15 seconds, hard cap. The page says if the input is 15 seconds or shorter the output keeps its duration, and if it is longer the system uses only the first 15 seconds. A 60-second edit comes back as the first 15 seconds. Trim the input before you send it if that is not what you want.

Two more fields on the edit call are worth naming. `audio_setting` defaults to `auto` — the model decides the sound — and `origin` preserves the original audio from the input video. If the edit should keep the source sound, say so; the default will not do it for you. And `resolution` is `1080P` by default, `720P` if you want it smaller.

## The watermark split

Same studio. Same endpoint shape. Opposite defaults.

The [Wan 3.0 API reference](https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference/) says `watermark` defaults to `false` — "Default value, no watermark is added." The [HappyHorse t2v](https://www.alibabacloud.com/help/en/model-studio/happyhorse-text-to-video-api-reference/), [r2v](https://www.alibabacloud.com/help/en/model-studio/happyhorse-reference-to-video-api-reference/), and [edit](https://www.alibabacloud.com/help/en/model-studio/happyhorse-video-edit-api-reference/) pages all say `watermark` defaults to `true`, with the mark in the bottom-right corner. Render a HappyHorse clip and never touch the field, and the corner arrives branded.

So the check is one line before every HappyHorse render: set `watermark` explicitly. Do not assume the studio carries one policy across families, because the pages say it does not.

## Counting references, in the right syntax

The reference syntax differs between the families too, and the prompt is where it breaks.

HappyHorse r2v takes 1 to 9 reference images, and the [r2v page](https://www.alibabacloud.com/help/en/model-studio/happyhorse-reference-to-video-api-reference/) says to cite them in the prompt as `[Image 1]`, brackets and all, in a 5,000-character limit. Wan 3.0 takes up to 10 references plus other media, cited as plain `Image 1`, in a 20,000-character limit. Write `[Image 1]` against Wan or bare `Image 1` against HappyHorse and the citation does not land where you meant it.

## The agent-side view

If you generate video through OpenRouter — which is what Hermes's `video_gen` backend reads — the [live catalog](https://openrouter.ai/api/v1/videos/models) lists the Alibaba rows with their limits attached. This morning's pull: `alibaba/wan-3.0` and `alibaba/wan-3.0-prime` run 2 to 30 seconds with `first_frame` and `last_frame` and `generate_audio: true`. `alibaba/happyhorse-1.1` and `happyhorse-1.0` run 3 to 15 seconds, list only `first_frame`, and leave `generate_audio` null. Read the row before the request; the durations you may assume are the ones the row advertises.

That is the map. Pick the lane by the job — new clip, still-to-video, reference consistency, edit, long take — set the fields the page names, and check the watermark before the render. The default is on the page, and so is the way to turn it off.
