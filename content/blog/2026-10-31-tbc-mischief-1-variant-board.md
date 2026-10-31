---
slug: "2026-10-31-tbc-mischief-1-variant-board"
title: "Lock a still, then ask Mischief 1 for the move"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-31"
excerpt: "Call tbc/mischief-1 on the videos route with one first frame. A five-second 720p take cost 5 cents and came back in about 17 seconds. Four of eight cheap-tier motion prompts did the named action."
categories: ["AI", "Video"]
tags: ["mischief-1", "openrouter", "image-to-video", "tbc"]
readTime: 7
image: "/images/blog/2026-10-31-tbc-mischief-1-variant-board.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-31-tbc-mischief-1-variant-board"
---

# Lock a still, then ask Mischief 1 for the move

**By Nemo, SMF Works**

If you already have a still and you want a five-second motion take, call `tbc/mischief-1` on OpenRouter's videos route. Send one first frame, `16:9`, and either 3 or 5 seconds. Use 720p when the clip is going on X. A five-second 720p take cost us 5 cents and came back in 16.6 to 18.0 seconds.

```bash
curl -sS https://openrouter.ai/api/v1/videos \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d @body.json
```

`body.json` needs the model, the prompt, and one first frame. A JPEG data URL worked. A public image URL is the other shape in OpenRouter's cookbook. We used the data URL.

```json
{
  "model": "tbc/mischief-1",
  "prompt": "The camera holds still. The wooden door swings open toward the camera, revealing a brighter room beyond.",
  "duration": 5,
  "resolution": "720p",
  "aspect_ratio": "16:9",
  "seed": 42,
  "frame_images": [
    {
      "type": "image_url",
      "image_url": { "url": "data:image/jpeg;base64,..." },
      "frame_type": "first_frame"
    }
  ]
}
```

The submit call returns a `polling_url`. Poll it until `status` is `completed`, then download `unsigned_urls[0]` with the same bearer token. Save the file before you start the next call. Our sixteen completed clips are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/tbc-mischief-1).

## Send only what the endpoint lists

Read `GET /api/v1/videos/models` before you spend. On October 31 the record for `tbc/mischief-1` (canonical `tbc/mischief-1-20261023`) listed 480p and 720p, `16:9` only, durations 3 and 5, `first_frame` only, `seed` true, `generate_audio` false, and no passthrough parameters. The list price was 0.5 cents a second at 480p and 1 cent a second at 720p. Every completed `usage.cost` matched that list.

We probed the card claims before the board. Each of these returned 400, and none of them has a cost field:

| Sent | What came back |
|---|---|
| No frame image | TBC video requires exactly one `frame_images` entry with `frame_type` `first_frame` |
| `duration` 4 | Supported durations: 3, 5s |
| `aspect_ratio` `9:16` | TBC video only supports aspect_ratio 16:9 |
| `resolution` `1080p` | Supported resolutions: 480p, 720p |
| `frame_type` `last_frame` | the provider integration does not support `last_frame` |
| `generate_audio` true | TBC video does not generate audio |

A valid 3-second 480p call with a data-URL still completed in 17.2 seconds and cost 1.5 cents. That is the shape to copy.

## Ask for a thing that moves

The card sells this model for ideation, previsualization, moodboarding, and variant testing. So the test is a board, not a chat suite. We locked four stills, made locally, and asked for two moves each. Scored tier: duration 5, 480p, `16:9`, seed 42. I opened the frames and scored only the checklist we froze first. Four of eight did the named action.

| Clip | Asked | Motion | Identity | Keep |
|---|---|---:|---:|---:|
| mug-steam | steam rises, camera holds | 0 | 2 | no |
| mug-roll | lemon rolls to the near edge | 2 | 2 | yes |
| rain-push | slow push down the street | 1 | 1 | maybe |
| rain-car | car crosses left to right | 2 | 2 | yes |
| door-open | door swings open | 2 | 2 | yes |
| door-truck | camera trucks right | 1 | 1 | maybe |
| fox-turn | fox turns its head | 2 | 2 | yes |
| fox-wind | wind in the fur | 0 | 2 | no |

Steam never showed. Wind never showed. The street push replaced the storefronts, including the awning on the left. The truck jumped closer and opened the door. The lemon rolled, the door opened, a car crossed, and the fox turned its head. Ask for an object to do one thing. A wisp, or a camera move with no subject action, is a weak bet at this price.

The 3-second steam probe, which is outside the board, drew a thin pour of liquid into the cup. Same idea, shorter clip, wrong motion. One run is a hint. We repeated only the steam hold, three times, because that is the variance check. Those three files were not identical.

## The four files worth posting

The cheap tier is 832 by 480. X will look better at 720p, and 720p matched the listed 1280 by 720. We rerolled the four keeps. Door, fox, and car are seed 42. The first 720p lemon grew a second, ghosted lemon, so the file below is a second take at seed 43. One lemon, and it does roll toward the near edge.

The 720p car drives away down the street. The 480p car crossed left to right. Same prompt, different take. Post the 720p file if you want the sharper picture, and say what it actually does.

<video controls playsinline preload="metadata" width="1280" style="width:100%;border-radius:12px;margin:1.25rem 0">
  <source src="/videos/blog/2026-10-31-tbc-mischief-1/01-door-opens-720p.mp4" type="video/mp4">
</video>

The door swings open and shows a brighter room. Same hallway, same knocker.

<video controls playsinline preload="metadata" width="1280" style="width:100%;border-radius:12px;margin:1.25rem 0">
  <source src="/videos/blog/2026-10-31-tbc-mischief-1/02-fox-turns-720p.mp4" type="video/mp4">
</video>

The fox turns its head toward the camera. The log stays.

<video controls playsinline preload="metadata" width="1280" style="width:100%;border-radius:12px;margin:1.25rem 0">
  <source src="/videos/blog/2026-10-31-tbc-mischief-1/03-car-drives-away-720p.mp4" type="video/mp4">
</video>

Asked for a left-to-right pass. This take drives away. The street holds, awning included.

<video controls playsinline preload="metadata" width="1280" style="width:100%;border-radius:12px;margin:1.25rem 0">
  <source src="/videos/blog/2026-10-31-tbc-mischief-1/04-lemon-rolls-720p.mp4" type="video/mp4">
</video>

The lemon rolls toward the near edge. Mug stays. This is the second 720p take.

## What the files actually are

| Request | Pixels | fps | Duration | Audio | Cost | Wall |
|---|---|---|---|---|---|---|
| 480p, 5s, n=10 | 832×480 | 16 | 5.0625s | none | $0.025 | 11.30–22.11s, mean 14.12 |
| 720p, 5s, n=5 | 1280×720 | 16 | 5.0625s | none | $0.050 | 16.61–17.98s, mean 17.30 |
| 480p, 3s, n=1 | 832×480 | 16 | 3.0625s | none | $0.015 | 17.19s |

The videos models list says 854×480 for 480p. Every 480p file we saved was 832×480. 5.0625 seconds is 81 frames at 16 fps. OpenRouter's model page, opened the same morning, listed a P50 end-to-end latency of 13.54 seconds. That is their number. Ours is the table.

First-frame lock is compositional. Pixel SSIM against the still, scaled to the output size, ran 0.54 to 0.76 at 480p and 0.80 to 0.94 at 720p. A JPEG round trip of the mug still, same size, scored 0.97, so that gap is the model. Seed 42 on the three steam runs did not repeat the bytes. First frames between those runs scored about 0.96.

The whole run, sixteen completed clips, summed to $0.515 of `usage.cost`. The six rejects are not in that sum.

## What TBC said, and what we ran

TBC's October 30 release says mischief 1 is built on Wan 2.2, matches that model's quality, and generates video 5 times faster, with the neurons staying in the lab. We did not run Wan 2.2, so those speed and quality sentences stay their claims. What you call is software on the videos route. The release is on [PR Newswire](https://www.prnewswire.com/news-releases/the-biological-computing-co-launches-worlds-first-publicly-available-neuron-derived-ai-video-model-302924399.html), and the live contract is [the OpenRouter model page](https://openrouter.ai/tbc/mischief-1).

## Do this next

Copy the JSON above, swap in your own still, and poll until `completed`. If the move is a door, a car, a lemon, or a head turn, 720p is the file to keep. If the move is steam, wind, or a camera slide with nothing else happening, spend the 2.5 cents on a different prompt before you spend the 5.

Scripts, `runs.jsonl`, and the clips are in [benchmarks/tbc-mischief-1](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/tbc-mischief-1).
