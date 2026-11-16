---
slug: "2026-11-16-set-the-frame-in-the-response-format"
title: "Set the Frame in the Response Format, Not the Sentence"
excerpt: "Nano Banana takes the aspect ratio and the size as fields on the call. Put them back in the prompt and the model has to guess the frame from your words — and the edit is where you pay for that."
date: "2026-11-16T07:00:00-05:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "AI Image", "Visual Craft"]
tags: ["nano-banana", "gemini", "aspect-ratio", "image-size", "response-format", "workshop"]
readTime: 6
image: "/images/blog/2026-11-16-set-the-frame-in-the-response-format.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-16-set-the-frame-in-the-response-format"
---

Stop typing "16:9" into the sentence. On Google's Nano Banana models, the frame is a field: `aspect_ratio` and `image_size` live in the `response_format` object on the call, and the docs' own examples never put them in the prompt. Same discipline the [Qwen-Image-2.1 rewriter](/blog/2026-10-10-describe-the-picture-leave-the-ratio) taught with `wh_ratio` — now with Google's API behind it.

## The frame is two fields on the call

Google's [image-generation docs](https://aistudio.google.com/docs/image-generation) put it plainly: "You can control the aspect ratio and the size of the output image using the `aspect_ratio` and `image_size` fields under `response_format` when `type` is set to `\"image\"`."

Their Python example:

```python
interaction = client.interactions.create(
    model="gemini-nano-banana-2.1",
    input=prompt,
    response_format={
        "type": "image",
        "aspect_ratio": "16:9",
        "image_size": "2K",
    },
)
```

The prompt describes the picture. `response_format` decides its shape. Two different objects, two different jobs — write "wide cinematic 16:9 shot of…" and you have asked the model to *guess* the frame from prose when the API was willing to just take the number.

## What the fields accept

The [REST reference](https://aistudio.google.com/api-reference/generate-content) spells out the full lists. The REST shape is `generationConfig.imageConfig.aspectRatio` and `imageConfig.imageSize`.

Aspect ratios — fourteen of them: `1:1`, `1:4`, `4:1`, `1:8`, `8:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`. If you leave it off, the model picks a default from your reference images, or falls back to a 1:1 square. That includes the extreme banners — 1:4 and 8:1 — which are new on Nano Banana 2.1 and Gemini 3.1 Flash Image per the docs.

Image sizes: `512`, `1K`, `2K`, `4K`, with `1K` the default if you say nothing. The docs' table gives real pixel dimensions per ratio — at 16:9, 2K is 2752×1536, not a guessed number. If you need an exact poster size, crop from the delivered frame; the table is the contract.

## Edits are where the field earns its keep

Multi-turn editing rides `previous_interaction_id`, and the frame fields ride along on the *edit*. The docs' example changes the language on an infographic and sets `aspect_ratio: "16:9"` in the same call:

```python
interaction_2 = client.interactions.create(
    model="gemini-nano-banana-2.1",
    input="Update this infographic to be in Spanish. Do not change any other elements of the image.",
    previous_interaction_id=interaction.id,
    response_format={
        "type": "image",
        "mime_type": "image/jpeg",
        "aspect_ratio": "16:9",
        "image_size": "2K",
    },
)
```

That is the move worth building into your scripts: the instruction changes the content, the response format changes the shape, and neither asks the model to re-imagine the picture. Say "make it 16:9" in the prompt and you have handed the layout back to interpretation. Set the field and the edit keeps the image and just changes the frame.

Reference images work the same way. The group-photo example passes up to five images inline and sets `aspect_ratio: "5:4"` on the same `response_format` block — the ratio is never in the sentence.

## Pick the model by the job

Five ids are listed on the [docs page](https://aistudio.google.com/docs/image-generation), and they are priced differently. From the [pricing page](https://aistudio.google.com/docs/pricing) (paid tier, per image, Standard):

| Model | Model id | Per image |
|---|---|---|
| Nano Banana 2.1 | `gemini-nano-banana-2.1` | $0.0336 (1K) / $0.0504 (2K) / $0.113 (4K) |
| Nano Banana 2 | `gemini-3.1-flash-image` | $0.045 (0.5K) / $0.067 (1K) / $0.101 (2K) / $0.151 (4K) |
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` | $0.0336 (1K) |
| Nano Banana Pro | `gemini-3-pro-image` | $0.134 (1K–2K) / $0.24 (4K) |
| Nano Banana (legacy) | `gemini-2.5-flash-image` | $0.039 (≤1K) |

Drafts: 2 Lite — the docs call it the fastest and cheapest, and note it is not optimized for multiple reference inputs or multi-turn sequential editing. Everyday work: 2.1. Text-heavy posters and brand-consistent sets: Pro, which uses a "Thinking" process to follow complex instructions — and its pricing footnote shows the token math: 1K and 2K images are 1120 tokens at $120 per million.

Two pricing edges worth knowing before you batch:

- **Batch is half price where it exists.** The pricing page's feature list says "Batch API (50% cost reduction)," and Nano Banana 2.1's Batch tab shows $0.0168 (1K) / $0.0252 (2K) / $0.0567 (4K). The Pro section lists only a Standard tab this morning — no Batch tab on that model.
- **The legacy model has a deadline.** The pricing page carries a warning that `gemini-2.5-flash-image` is deprecated and will be shut down March 15, 2027. If you still have a script pointed at it, the migration path is 2 Lite.

One more line from the docs, for scripts that assume otherwise: image *sizes* above 512 are not universal. Gemini 3.1 Flash Image adds the 512px (0.5K) tier, and the docs note 0.5K is "not supported on Gemini Nano Banana 2.1."

## SynthID: no switch

The docs state it once, flatly: "All generated images include a SynthID watermark." There is no opt-out field documented on the page. That is the opposite posture from the Alibaba families — HappyHorse defaults the watermark on and Wan 3.0 defaults it off, and you flip a field [before the render](/blog/2026-11-09-check-the-watermark-before-the-render). With Nano Banana the mark is a constant. Plan layouts so nothing important sits in a corner you might need clean, and stop looking for the toggle.

## The script-day checklist

1. Prompt describes the picture. `response_format` sets `aspect_ratio` and `image_size`. REST users: `generationConfig.imageConfig`.
2. Edits: `previous_interaction_id` for the content, and set the ratio *on the edit call* — do not re-describe the image to change its shape.
3. Pick the id by the job: 2 Lite for drafts, 2.1 for the real thing, Pro when there is real text in the poster.
4. Check the size tier exists for that model before you request it — 0.5K is a 3.1 Flash Image feature, not a 2.1 one.
5. Budget from the pricing table, and remember Batch (half price on 2.1) and the March 15, 2027 shutdown on the legacy id.
6. SynthID is always on. There is no field to set.
