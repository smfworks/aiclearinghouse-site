---
slug: "2026-10-10-describe-the-picture-leave-the-ratio"
title: "Describe the Picture. Leave the Ratio in the Other Field."
excerpt: "A still is a paragraph you are looking at. The ratio does not go in that paragraph. Qwen-Image-2.1 keeps it in wh_ratio, and an edit is a different voice."
date: "2026-10-10T07:00:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Jasmine's Workshop", "AI Image", "Visual Craft"]
tags: ["qwen-image", "prompt", "aspect-ratio", "image-editing", "workshop"]
readTime: 8
image: "/images/blog/2026-10-10-describe-the-picture-leave-the-ratio.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-10-describe-the-picture-leave-the-ratio"
---

If you are about to end a prompt with "4K" or "16:9", take those words back out. They do not belong in the sentence. The sentence describes the picture. The ratio lives in another field.

That split is written down. [Qwen-Image-2.1](https://github.com/QwenLM/Qwen-Image-2.1) ships two rewriters, and each one has a system prompt that says where the words go. I read those prompts this morning, plus the repo README and the model cards. I did not run the rewriter. I did not generate a still.

A new picture and an edit are not the same job.

## Look at the picture, then write

For a new still, use the text-to-image rewriter, [Qwen-Image-2.1-PE-T2I](https://huggingface.co/Qwen/Qwen-Image-2.1-PE-T2I). Its [system prompt](https://huggingface.co/Qwen/Qwen-Image-2.1-PE-T2I/blob/main/system_prompt.txt) tells that model to report the finished frame as an observer. Present tense. Third person. No "you". No "create". No "make sure". No "the AI should". And no quality boosters. No "masterpiece", no "8K", no "highly detailed", no "award-winning".

The description is always English, whatever language the brief arrived in. Text that should be readable stays in its own script, inside straight double quotes. Chinese stays Chinese. Arabic stays Arabic. If a mark is not meant to be read, call it blurred, indistinct, or too small to read. Do not invent the letters.

Open with one sentence that names the medium. A photograph, a poster, an illustration, a portrait. The prompt says that noun is the part you never omit. You may name the orientation there too. Vertical, wide, square, tall. That is not the same thing as writing `2:3`.

Light gets its own sentence, once the contents are placed. Close once, with the whole frame. One summary. Do not follow it with a second.

A short brief does not buy a short description. The same prompt says a three-word request and a three-hundred-word request both become a description of about the same size: about twenty sentences, four to five hundred words. A dense frame can run longer. A quiet subject can run shorter. A thin brief never buys a thin description.

The rewriter returns one JSON object. The paragraph is `rewritten_prompt`. The ratio is `wh_ratio`. Nothing else.

```json
{"rewritten_prompt": "<the description>", "wh_ratio": "3:2"}
```

## Leave the ratio in the other field

The ban is specific. The ratio lives only in `wh_ratio`. Never write a ratio, a resolution, or a pixel count into the description.

If the brief did not name a ratio, the defaults in that prompt are `3:2` for anything horizontal and `2:3` for anything vertical. A square badge, icon, album cover, or single centred emblem gets `1:1`. A wide cinematic or presentation frame gets `16:9`. A phone screen or a tall standing banner gets `1:2` or `9:16`. Other ratios are named in that step. They are not the default.

The repo's integration example maps `wh_ratio` through seven sizes. A missing key becomes 2048 × 2048.

| Ratio | Pixels |
| --- | --- |
| 1:1 | 2048 × 2048 |
| 4:3 | 2400 × 1792 |
| 3:4 | 1792 × 2400 |
| 3:2 | 2528 × 1696 |
| 2:3 | 1696 × 2528 |
| 16:9 | 2752 × 1536 |
| 9:16 | 1536 × 2752 |

That table is on the [repo README](https://github.com/QwenLM/Qwen-Image-2.1) and on the [base card](https://huggingface.co/Qwen/Qwen-Image-2.1). The [Turbo card](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo) says to use the same presets.

The printed still does not use a row from that table. The Turbo text-to-image example passes 1680 × 2512. So does the original checkpoint's text-to-image example in the same README. `2:3` in the table is 1696 × 2528. I did not find a note that reconciles them. If you are following the integration example, use the table. If you copy the printed still, you are copying a size the table does not list.

The text-to-image prompt also names ratios the seven-row table does not contain. `21:9`, `4:5`, and `1:2` are in that step. The integration example falls back to square when the key is missing. I did not test whether the image model accepts those other ratios if you pass the pixels yourself.

The quick start on the base card is a shorter call. Width and height are still arguments, not a tail on the sentence. The README says that for best results you expand a short prompt with the official rewriters. I am not claiming the short call fails. I am saying the recommended path keeps the ratio out of the paragraph.

The printed poster in the README opens on a vertically oriented study poster and then passes 1680 and 2512 beside the prompt. Orientation in the first sentence. Pixels in the other field. That is the split, even in the long example.

## An edit is an instruction

Switch models. [Qwen-Image-2.1-PE-I2I](https://huggingface.co/Qwen/Qwen-Image-2.1-PE-I2I) is the edit rewriter. Its [system prompt](https://huggingface.co/Qwen/Qwen-Image-2.1-PE-I2I/blob/main/system_prompt.txt) is the other voice.

An input image is always present. The task is never text-to-image from nothing. Lead with the operation. Write as someone holding the input, not as someone describing a finished poster. One paragraph. No line breaks.

Say what stays, in the affirmative, not as a ban. The prompt's own example is 保持背景与输入图完全一致, not a prohibition. Quote every string that should be readable. Never put a ratio, a pixel count, or "4K" inside `rewritten_prompt`. The edit prompt is explicit that "2K", "4K", and "8K" are quality talk, not a ratio, and that they must not be used to pick one.

Two fields, and exactly one of them carries a value. `wh_ratio` and `ratio_follow` are mutually exclusive. A local edit inherits the input: `ratio_follow` is `"<image1>"` and `wh_ratio` is `""`. A new composition picks a ratio and leaves `ratio_follow` empty. The edit card prints that rule under the output format.

```json
{"rewritten_prompt": "<the instruction>", "wh_ratio": "", "ratio_follow": "<image1>"}
```

The card's pipeline snippet passes the rewritten prompt and the image. It does not show how `ratio_follow` becomes a width and a height. I did not find that mapping. Do not invent one. The printed Turbo edit, beside the 1680 × 2512 still, passes 2048 × 2048. The original checkpoint's single-image edit in the README does not pass width or height at all.

Language is the trap, because the two rewriters do not agree.

A still description is always English. An edit description follows the instruction. Chinese in, Chinese out. English in, English out. Any other language, English. That is the prose outside the quotes.

Text painted into the picture is a separate decision. The edit prompt gives it a priority. Use the exact words the person asked for, or the language they named. Otherwise use the dominant language already in the image. Otherwise use the language of the instruction. Keep them apart. The paragraph and the painted letters are not the same language decision.

When there are two or more images, the rewritten instruction has to use `<image1>`, `<image2>`, and so on. A single image does not get those tags. The three-character campfire example in the repo README does not use them either. That call passes a list to `image=` and a plain sentence. It is not the rewriter's format. Do not treat them as the same convention.

## Transparency is a wrapping sentence

The [September 20 blog](https://qwen.ai/blog?id=qwen-image-2.1) says the prompt decides whether the output is a regular image or an image with a transparency channel. It does not print the sentence. The README does.

For a transparent still on the open-weight checkpoint, wrap the description in the line the README prints, including the words "alpha channel" with no "an":

> This is an RGBA image with transparency. A cute cartoon dragon sticker. The image has alpha channel and the background is transparent.

That is their example, not a sticker I made. The repo's copy of that call does not pass width or height. The base card's copy passes 2048 × 2048. The comment on the repo save says the file is RGBA when the model generates transparency.

## Eight steps is a saved schedule

The repo news line dated 2026.10.09 released [Qwen-Image-2.1-Turbo](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo) for generation and editing in 8 denoising steps. Same 7B visual stack. Same pipeline class, `QwenImage21Pipeline`. The checkpoint carries the schedule. Diffusers loads it.

The prose says generation uses CFG=1 by default. The printed Turbo calls do not pass a step count or a CFG argument. Setting `num_inference_steps` alone does not replace that saved schedule. The Turbo card adds that an explicit `sigmas` argument does override it, and that other schedules have not been evaluated.

The original checkpoint is the other schedule. Its printed calls pass `num_inference_steps=40`. The defaults table says 40 steps and 2048 × 2048, and it says those defaults apply to the original checkpoint. Turbo uses the saved 8-step schedule. Both default to the 2048 resolution level. That last sentence is the table note. It does not turn 1680 × 2512 into a preset.

The September 20 blog does not cover this checkpoint. It is older than the news line. Do not look there for the step count.

Circles, painted marks, and a separate mask are real on that blog. It shows colored circles on the picture, a painted region, and the original image plus a separate mask as two inputs. The README intro names the same three. I did not find a pipeline argument for them in the calls. So this post does not invent one. If you need a local region, follow the gesture that page shows, and still keep the ratio out of the sentence.

Describe the picture. Leave the ratio in the other field. A still is an observer's paragraph. An edit is an instruction. Turbo is eight steps because the checkpoint saved the schedule, not because you typed 8.
