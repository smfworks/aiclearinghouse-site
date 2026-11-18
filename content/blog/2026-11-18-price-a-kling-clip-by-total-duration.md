---
slug: "2026-11-18-price-a-kling-clip-by-total-duration"
title: "Price a Kling Clip by Total Duration, Not Clip Length"
excerpt: "Kling 4.0 doubles or extends the bill the moment a reference video touches the task. Three rows on the pricing page decide which one you pay, and usage.output_duration tells you after the fact."
date: "2026-11-18T07:00:00-05:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "AI Video"]
tags: ["kling", "video-api", "pricing", "text-to-video", "image-to-video", "workshop"]
readTime: 6
image: "/images/blog/2026-11-18-price-a-kling-clip-by-total-duration.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-18-price-a-kling-clip-by-total-duration"
---

You want a ten-second Kling 4.0 clip and you budget for ten seconds. Then a reference video rides along with the request and the invoice says eighteen. Nothing went wrong. Kling 4.0 bills on **total duration**, and the definition of total duration changes with what you feed the task. Kling's [video pricing page](https://kling.ai/document-api/pricing/base/video) splits it into three rows, and which row applies is decided before the render starts.

## The three rows

From the [pricing page](https://kling.ai/document-api/pricing/base/video), for Kling 4.0 and 4.0 Flash:

- **No input video.** Total duration = output duration. A plain text-to-video task is the simple case: you pay the output seconds once.
- **Input video, input ≤ output.** Total duration = output × 2. The input rides free per-second but the whole bill doubles — reference videos and video-character elements count as input.
- **Input video, input > output.** Total duration = input + output. A long reference against a short output pays for both, stacked.

Kling 3.0 and older models are flat: per output second, no input multiplier.

## The arithmetic on one 10-second clip

Unit prices come from the same table: Kling 4.0 is $0.235/s at 1080p with no input, $0.141/s with input. Same output, three tasks:

- **10s, no input:** 10 × $0.235 = **$2.35**
- **10s with an 8s reference** (input ≤ output): 10 × 2 × $0.141 = **$2.82**
- **10s with a 12s reference** (input > output): 22 × $0.141 = **$3.10**

The with-input unit price is lower, but the multiplier or the stack eats the discount. On [4.0 Flash](https://kling.ai/document-api/pricing/base/video) at 720p the same shape holds: 10s no input is 10 × $0.094 = $0.94, and 10s with an 8s input is 10 × 2 × $0.063 = $1.26.

## Which model for which ceiling

The [4.0 text-to-video page](https://kling.ai/document-api/api/video/4-0/text-to-video.md) lists `settings.resolution` as 720p or 1080p, default 1080p — no 4K value. The [10/28/2026 changelog entry](https://kling.ai/document-api/updates/api.md) says it plainly: "Supports 720P and 1080P (10-bit 4K coming soon)." Need 4K today, that's [Kling 3.0](https://kling.ai/document-api/api/video/3-0-omni/text-to-video.md), which takes `resolution: "4k"` at $0.42/s with discrete 3–15s durations. 4.0's trade is range: durations of 3–30 seconds as integers, aspect ratios 21:9, 16:9, 9:16, 1:1, 4:3, 3:4 — the 3.0 table stops at 16:9, 9:16, 1:1.

## Set the duration where it counts

On 4.0, `settings.duration` wins over any duration in the prompt; if you omit the parameter, an explicit "Generate a 15-second video" in the prompt is used; if neither, the default is 10 seconds. That final duration is the billing quantity — the docs return it as `usage.output_duration` in the task query response, and tell you to use `output_duration` when calculating cost. The file's actual length is a separate `outputs[].duration` field. Reconcile the bill against `output_duration`, not the filename.

## The mechanics around it

The call is `POST /text-to-video/kling-4.0` on `api-singapore.klingai.com` with Bearer auth — body is three objects, `prompt`, `settings`, `options`. Tasks are async: create returns an `id`, you poll `GET /tasks?task_ids=...` until `succeeded`, then read `outputs[].url`. For image-to-video, [4.0 takes keyframes](https://kling.ai/document-api/api/video/4-0/image-to-video.md): a `contents` array of images typed `first_frame`, `middle_frame`, or `last_frame` — up to 10 images, ≤30MB each, ≥300px per side — each with an `id` you reference as `@frame_1` in the prompt, in the order the frames appear.

Two housekeeping rules the docs are blunt about. Every result URL is hotlink-protected and "Generated results are retained for 30 days; save them promptly." And capacity is task concurrency, not QPS: a task holds its slot from submission until it ends — failures included — and over-limit submissions return an error rather than queueing.

## The habit

Before submitting, decide which pricing row you're in. No input, output × 1 at the full rate. Short input, output × 2 at the discounted rate. Long input, (input + output) at the discounted rate. Thirty seconds of arithmetic before the request beats reconciling a doubled bill after it.
