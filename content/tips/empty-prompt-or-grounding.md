---
slug: empty-prompt-or-grounding
title: Send an empty prompt or the word grounding
category: Workflow
excerpt: LightOnOCR-3 documents two prompts. Anything else is out of distribution. Pick the empty string for markdown, or grounding if you also need boxes.
tags:
  - ocr
  - prompts
  - documents
  - layout
order: 117
last_verified: "2026-10-14"
---

# Send an empty prompt or the word grounding

## The principle

When a model card says other instructions are out of distribution, a clever prompt is not a feature. It is a request the model was not trained to answer. Send one of the two strings they named.

## Why it matters

The LightOnOCR-3-1B card says an empty prompt (`""`) returns the page as markdown, and that this is the same interface as the previous LightOnOCR models. The word `grounding`, and only that word as the text prompt, adds a label and a box in page coordinates normalized to 0–1000, plus a short image description and chart data as an HTML table. The Hugging Face blog says the same split for all three sizes.

People will try "extract the tables as JSON" because that is how every other document model gets briefed. The card's answer is that those instructions are out of distribution. You will get something. You will not get the mode they measured.

## How to apply it

1. Decide whether you need layout. If you only need the words, set the text prompt to an empty string. Do not send a space and call it empty unless you have checked what your client actually transmits.
2. If you need boxes, set the text prompt to `grounding`. Do not add a sentence after it. The card's example is that one token of instruction.
3. Expect more output when you ask for grounding. The 1B card says the 4B averages 1,433 tokens per page in that mode against 1,158 for plain transcription, about 25% more. Budget the decode. Do not treat the two modes as the same cost.
4. Parse the marker, not a JSON schema you wished for. A block looks like `![title](80,70,920,140)` followed by the text. Labels include `text`, `title`, `table`, `image`, `chart`, and others listed on the card. A `+` suffix means a continuation block, not a new class.
5. If you need a different format, convert after the fact. The blog points at conversion helpers in the LightOnOCR GitHub repo. Convert the documented output. Do not prompt the model into your format.
6. Pick the size for the column you care about, not for the parameter count. On the blog's olmOCR-Bench table the 0.8B overall is 85.5 and the 1B is 84.5. The 1B is the drop-in for the old architecture. It is not the accuracy default.

## Red flags

- A wrapper that always sends "Transcribe this document carefully."
- A test that fails grounding because the client stripped an empty string and then sent a default system prompt.
- A cost model that uses the transcription token count for the grounding path.
- A parser that treats `header_image` as `image` and then drops the logo.

## Quick win

Take one page you already transcribed with an empty prompt. Run it again with the text prompt set to `grounding` and nothing else. Diff the two strings. If the second one does not start blocks with a `![label](x1,y1,x2,y2)` marker, you did not send the documented prompt. Fix the client before you tune the model.

## Sources

- https://huggingface.co/lightonai/LightOnOCR-3-1B
- https://huggingface.co/blog/lightonai/lightonocr-3
