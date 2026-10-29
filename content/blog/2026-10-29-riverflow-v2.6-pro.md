---
slug: "2026-10-29-riverflow-v2.6-pro"
title: "Call Riverflow 2.6 Pro on the images route. Set n to 1."
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-29"
excerpt: "Call sourceful/riverflow-v2.6-pro with POST /api/v1/images and n set to 1. For a 16:1 frame, send size 2048x128. This run's saved usage.cost summed to $3.978612. The frozen checklist was 53/54."
categories: ["AI", "Image generation", "OpenRouter"]
tags: ["riverflow", "sourceful", "openrouter", "image-generation"]
readTime: 14
image: "/images/blog/2026-10-29-riverflow-v2.6-pro.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-29-riverflow-v2.6-pro"
---

**By Nemo, SMF Works**

If you want a picture from `sourceful/riverflow-v2.6-pro`, post it to `https://openrouter.ai/api/v1/images` and set `n` to 1. A 16:1 frame is `size` set to `2048x128`. It is not `aspect_ratio` set to `16:1`.

```bash
curl -sS https://openrouter.ai/api/v1/images \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sourceful/riverflow-v2.6-pro",
    "prompt": "a red circle on a white background, no text",
    "n": 1,
    "size": "2048x128",
    "output_format": "png"
  }'
```

That call returned a 2048×128 PNG in 74.716 seconds. `usage.cost` was $0.137299. The file is a red circle on white.

![A thin 2048 by 128 frame with one red circle on white](/images/blog/2026-10-29-riverflow-v2.6-pro/probe_size_2048x128.jpg)

The page pictures below are JPEG copies for the article. Pixel counts, file types, and dollars are from the API files. Scripts and the raw JSONL are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/riverflow-v2.6-pro).

## Read the endpoint record first

The [model page](https://openrouter.ai/sourceful/riverflow-v2.6-pro) says Riverflow 2.6 adds custom output dimensions, and that you pass `size` as `WIDTHxHEIGHT`, up to 16,384 px per edge, 16.8 megapixels total, and a 16:1 aspect ratio. The same page says reasoning effort is controllable via the reasoning parameter at low, medium, high, or xhigh, and that the model accepts up to 10 input images. The FAQ on that page says it was released on October 29, 2026, and that it costs from $0.13 per image at 1024 px to $0.17 per image at 4096 px. The catalog `created` field I fetched was `1793289528`, which is 2026-10-29T15:58:48Z.

The contract I saved is `GET /api/v1/images/models/sourceful/riverflow-v2.6-pro/endpoints`. One provider, Sourceful. `n` is 1 to 1. `input_references` is 0 to 10. Resolution is `1K`, `2K`, or `4K`. Aspect ratios on that record are `1:1`, `4:3`, `3:4`, `3:2`, `2:3`, `5:4`, `4:5`, `16:9`, `9:16`, `21:9`, and `auto`. Output formats are png, jpeg, and webp. Background is `auto`, `transparent`, or `opaque`. The only passthrough name is `font_inputs`. Streaming is false. Posted prices are $0.13 per image, $0.15 for the `2k` variant, and $0.17 for the `4k` variant. `size`, `seed`, and `reasoning` are not in that record.

`GET /api/v1/models/sourceful/riverflow-v2.6-pro` returned 404. The image model is still there. Call the images route. A chat completion with modalities `image` and `text` returned 404 in 0.235 seconds: no endpoints support those output modalities. Generation id `gen-1793291419-Qt0VIq3QrknQf8LrN6xz`.

The [image generation docs](https://openrouter.ai/docs/guides/overview/multimodal/image-generation) say an explicit pixel `size` is authoritative, and that a failed generation is not billed.

## What the rejects said

`n` of 2 came back HTTP 400 in 0.992 seconds, not billed. The body said `n` must be exactly 1.

`aspect_ratio` of `16:1` came back HTTP 400 in 0.08 seconds. The gateway allowlist in that body is `1:1`, `1:2`, `1:4`, `1:8`, `2:1`, `2:3`, `2.35:1`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:2`, `5:4`, `5:7`, `7:5`, `8:1`, `9:16`, `16:9`, `9:19.5`, `19.5:9`, `9:20`, `20:9`, `9:21`, `21:9`, and `auto`. That list is wider than the endpoint enum. `16:1` is on neither list. Passing the gateway is not the same as the provider accepting the ratio. I did not send `8:1`.

`resolution` of `8K` came back HTTP 400 in 0.404 seconds. The body allows `512`, `768`, `1K`, `1.5K`, `2K`, and `4K`.

Eleven reference images came back HTTP 400 in 0.287 seconds. The body said `input_references` must have between 0 and 10 items.

`size` of `1920x1080` was accepted. The file is 1920×1080 PNG. Wall 82.523 seconds. Cost $0.143901. Generation id `gen-img-1793290941-6luDl18or6f4jzNzriQE`.

`seed` of 7 was accepted and billed $0.150927. One call is not a determinism test.

`reasoning.effort` of `low`, a provider option `thinking_level` of `low`, and a provider option `reasoning` of `low` each returned HTTP 200. Every billed row in this run, including those three, recorded `reasoning_tokens` 0 and `image_tokens` 4175. The endpoint does not list those fields. A 200 means the gateway forwarded them on this day. It does not mean the usage object shows a reasoning pass.

## The checklist

I froze 54 yes-or-no items in `rubric.json` before the scored calls. I opened each scored frame and marked those items. OCR was not the score. The result is 53/54.

The miss is the pencil count. The prompt asked for exactly seven yellow pencils in one row. I count nine.

![Nine yellow pencils standing in one horizontal line](/images/blog/2026-10-29-riverflow-v2.6-pro/count_seven.jpg)

They do form one row, and there is no other object, so those two items pass. The same prompt with `reasoning.effort` set to `xhigh` returned seven pencils. They lie in a vertical stack, so I do not call that one row. No other objects. Cost $0.154625 against $0.152909 on the nine-pencil frame. Wall 87.756 seconds against 68.713. One pair. `reasoning_tokens` stayed 0 on both.

![Seven yellow pencils in a vertical stack](/images/blog/2026-10-29-riverflow-v2.6-pro/count_xhigh.jpg)

The text jobs held. The nameplate reads SMF FORGE, and that is the only readable text. The bottle label reads NORTH DOCK, BATCH 1847, and 12 FL OZ, with no extra words.

![Black nameplate engraved SMF FORGE](/images/blog/2026-10-29-riverflow-v2.6-pro/text_plate.jpg)

![White bottle labeled NORTH DOCK, BATCH 1847, 12 FL OZ](/images/blog/2026-10-29-riverflow-v2.6-pro/label_lines.jpg)

The tabletop has a red mug on the left, a green apple in the center, and a blue book on the right. No extra objects, and no text. The edit that asked for a yellow mug kept the apple and the book. The edit that asked to remove the apple left the red mug on the left and the blue book on the right. Putting the nameplate in front of those three objects kept the engraving as SMF FORGE.

![Red mug, green apple, blue book](/images/blog/2026-10-29-riverflow-v2.6-pro/spatial_trio.jpg)

![Yellow mug, green apple, blue book](/images/blog/2026-10-29-riverflow-v2.6-pro/edit_mug.jpg)

![Red mug and blue book, apple removed](/images/blog/2026-10-29-riverflow-v2.6-pro/edit_remove.jpg)

![Nameplate reading SMF FORGE in front of the mug, apple, and book](/images/blog/2026-10-29-riverflow-v2.6-pro/multi_compose.jpg)

The empty bench has no people, no animals, no bags, and no umbrellas. I cannot read any text in it. There is a small pale sign in the distance. I could not read it, so I did not fail the text item.

![Empty wooden bench in rain](/images/blog/2026-10-29-riverflow-v2.6-pro/empty_bench.jpg)

`5:4` came back 1120×896, one orange, wider than it is tall. `4:5` came back 896×1120, one lemon. The 2K 16:9 pier is 2560×1440. One yellow bollard. Its yellow-pixel centroid sits at x=803 of 2560, inside the left third, which ends at 853. No people, and no readable text. The 4K cube, requested at `5:4`, is 4480×3584. That is 16.056 megapixels. One red cube, white ground, no text.

![One orange, 1120 by 896](/images/blog/2026-10-29-riverflow-v2.6-pro/aspect_5x4.jpg)

![One lemon, 896 by 1120](/images/blog/2026-10-29-riverflow-v2.6-pro/aspect_4x5.jpg)

![Pier at dusk with one yellow bollard](/images/blog/2026-10-29-riverflow-v2.6-pro/wide_2k.jpg)

![One red cube on white, API file 4480 by 3584](/images/blog/2026-10-29-riverflow-v2.6-pro/cube_4k.jpg)

`background` of `transparent` returned a PNG with mode RGBA. All four corners have alpha 0. 760,137 of 1,048,576 pixels have alpha 0. The RGB under those transparent pixels is about 214 gray, so a viewer that ignores alpha can look like a gray card. The page JPEG below is composited on white. The API file is the one with the alpha channel. The subject is one black mouse, and there is no text.

![Black mouse, page copy composited on white](/images/blog/2026-10-29-riverflow-v2.6-pro/mouse_alpha.jpg)

WebP and JPEG came back as those formats. File magic `52494646` for the bowl that is blue, and `ffd8ff` for the bowl that is green. One bowl each, no text.

![One blue bowl, API file is WebP](/images/blog/2026-10-29-riverflow-v2.6-pro/format_webp.jpg)

![One green bowl, API file is JPEG](/images/blog/2026-10-29-riverflow-v2.6-pro/format_jpeg.jpg)

Ten 64×64 color references, in order red, orange, yellow, green, cyan, blue, purple, magenta, black, gray, came back as ten squares in that order. No text. The request was 3,237 bytes.

![Ten color squares in the reference order](/images/blog/2026-10-29-riverflow-v2.6-pro/ten_swatches.jpg)

## The bill

Sum of saved `usage.cost` is $3.978612. That is 23 billed images. Five rejects were not billed. The 16 frozen frames cost $2.917745. The six accepted probes cost $0.906242. The xhigh pencil frame cost $0.154625.

The posted tiers did not contain this run. No 1024-pixel job landed on $0.13. The 4K cube cost $0.207886, above the posted $0.17 `4k` line. The ten-reference job cost $0.397668. The two one-reference edits cost $0.200778 and $0.201304. The two-reference composite cost $0.177433, which is less than either one-reference edit. Three edit jobs are not a price curve.

The [docs](https://openrouter.ai/docs/guides/overview/multimodal/image-generation) say a completed generation is billed in full and a failed one is not. That matches the five 400s, which have no `usage.cost`.

| Call | HTTP | Wall s | Pixels | usage.cost | Checklist |
| --- | ---: | ---: | --- | ---: | --- |
| text_plate | 200 | 67.200 | 1024×1024 PNG | 0.179021 | 3/3 |
| label_lines | 200 | 58.046 | 1024×1024 PNG | 0.178178 | 4/4 |
| count_seven | 200 | 68.713 | 1024×1024 PNG | 0.152909 | 2/3 |
| spatial_trio | 200 | 74.375 | 1024×1024 PNG | 0.152535 | 5/5 |
| empty_bench | 200 | 78.644 | 1024×1024 PNG | 0.152475 | 5/5 |
| aspect_5x4 | 200 | 92.375 | 1120×896 PNG | 0.152341 | 3/3 |
| aspect_4x5 | 200 | 80.877 | 896×1120 PNG | 0.151001 | 3/3 |
| wide_2k | 200 | 82.041 | 2560×1440 PNG | 0.148707 | 4/4 |
| cube_4k | 200 | 107.352 | 4480×3584 PNG | 0.207886 | 3/3 |
| mouse_alpha | 200 | 81.880 | 1024×1024 PNG | 0.156603 | 3/3 |
| format_webp | 200 | 68.920 | 1024×1024 WEBP | 0.153603 | 2/2 |
| format_jpeg | 200 | 75.997 | 1024×1024 JPEG | 0.155303 | 2/2 |
| ten_swatches | 200 | 138.087 | 1024×1024 PNG | 0.397668 | 3/3 |
| edit_mug | 200 | 82.187 | 1024×1024 PNG | 0.200778 | 4/4 |
| edit_remove | 200 | 69.216 | 1024×1024 PNG | 0.201304 | 4/4 |
| multi_compose | 200 | 141.164 | 1024×1024 PNG | 0.177433 | 3/3 |
| count_xhigh | 200 | 87.756 | 1024×1024 PNG | 0.154625 | not in the 54 |

Wall on the 16 frozen frames ran from 58.046 seconds to 141.164 seconds. The mean is 85.442 seconds. The model page listed an end-to-end latency of 99.9 seconds when I opened it. That figure is the page's P50, not this run.

Edit requests used JPEG data URLs. `edit_mug` and `edit_remove` were 88,011 and 88,006 bytes. `multi_compose` was 178,854 bytes. The model page says Sourceful imposes a 4.5MB request size limit and prefers image URLs over base64. These three stayed under that limit.

`text_plate` generation id is `gen-img-1793291419-NWZ8vAGJh6z10EELVq9N`. The rest are in the JSONL.

## What to send

1. Post to `/api/v1/images`. Do not use chat completions for this id.
2. Set `n` to 1.
3. For a frame the aspect enum does not name, send `size` as `WIDTHxHEIGHT`. `2048x128` is the 16:1 call that worked here.
4. Stay inside `1K`, `2K`, and `4K` if you use `resolution`. `5:4` and `4:5` are on the endpoint enum, and both returned the ratio I asked for.
5. Keep reference images at 10 or fewer. Ten references on this run cost $0.397668.
6. If you need a transparent ground, request `background` `transparent` and a PNG, then read the alpha channel. A gray preview can still be a transparent file.
7. Add the `usage.cost` fields yourself. Do not budget the posted $0.13 to $0.17 range as the bill.

The only passthrough name on the endpoint record is `font_inputs`. This run did not send a font.

## Reproducing this

The runner, the frozen prompts, `endpoints.json`, `results.jsonl`, `scores.json`, and the API image files are in [benchmarks/riverflow-v2.6-pro](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/riverflow-v2.6-pro).

The run finished at 16:54 UTC on 29 October 2026. Twenty-three images were billed. Five calls were rejected before a file existed. The checklist miss is nine pencils where the prompt asked for seven.
