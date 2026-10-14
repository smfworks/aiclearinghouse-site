---
slug: lightonocr-3
title: "LightOnOCR-3"
excerpt: "Three Apache-2.0 OCR models. An empty prompt transcribes. The word grounding adds boxes, image descriptions, and chart tables. No price on the pages fetched."
category: Tools
tags:
  - ocr
  - documents
  - open-weight
  - layout
provider: LightOn
pricing_model: "Not published"
price: "Not stated on the model card or the Hugging Face blog fetched this run"
website: https://huggingface.co/blog/lightonai/lightonocr-3
image: /images/agentmarketplace/services-hero.svg
order: 114
last_verified: "2026-10-14"
---

# LightOnOCR-3

## What it is

LightOnOCR-3 is a family of document models, not a hosted OCR API with a rate card.

The Hugging Face blog says the family comes in three sizes: `LightOnOCR-3-0.8B`, `LightOnOCR-3-1B`, and `LightOnOCR-3-4B`. The 1B keeps the previous LightOnOCR-2 architecture. The 0.8B and 4B use the Qwen3.5 vision-language architecture. All three are Apache 2.0, for research and commercial use, on both the blog and the 1B card.

Two prompts, and only two, are in distribution. An empty text prompt transcribes the page as markdown. The single word `grounding` adds a label and a bounding box, normalized to 0–1000, plus short image descriptions and chart data as HTML tables. The 1B card says other instructions are out of distribution.

## When to use it

Use it when you already have a page image or a rendered PDF page and you want markdown, or markdown plus layout, from a model you can download. The 1B card says switching from LightOnOCR-2 requires no change if you keep the empty prompt.

If you need a vendor to host it and bill per page, these pages do not offer that. The blog points at a demo space and a GitHub repo with conversion helpers. A demo is not a price.

## What it does well

The scores below are LightOn's tables on the blog. This directory did not rerun them.

On olmOCR-Bench, LightOnOCR-3-4B scores 86.3 overall. Infinity Parser Pro, listed at 35.1B, scores 87.6. Chandra 2, also 4B, scores 85.8. The 0.8B scores 85.5. The 1B scores 84.5. The 4B leads the ArXiv column at 91.1. The 1B leads multi-column at 85.9. The 0.8B leads long tiny text at 94.1. Infinity Parser Pro still leads old scans (58.2) and headers/footers (95.8).

On ParseBench's five-category overall, the blog ranks the 4B at 75.1 and the 0.8B at 74.6, ahead of Infinity Parser Pro at 74.3. The 1B is at 71.4. The blog says most of that 1B gap is charts and visual grounding.

The 1B card says grounding adds about 25% output tokens over plain transcription, 1,433 versus 1,158 tokens per page on average for the 4B. The blog's separate comparison, on 512 olmOCR-bench pages, says the 0.8B and 4B in grounding mode generate 9–14% fewer output tokens on average than Chandra-OCR-2 and Infinity-Parser2-Pro. Those are different comparisons. Do not average them.

## Honest limitations

- No price on the card or the blog fetched this run. Open weights are not a hosted rate.
- A third prompt is out of distribution. "Summarize this page" is not a documented mode.
- The 1B is not the accuracy pick. On both overall tables above, the 0.8B beats it. Keep the 1B when you need the old architecture as a drop-in.
- Old scans and headers/footers are still Infinity Parser Pro's columns on LightOn's olmOCR table. Do not brief the 4B as the winner of every column.
- The LightOnOCR-2-1B overall of 83.2 on that table excludes headers/footers. The blog marks it as not directly comparable. Leave it out of a ranking.
- The card's Transformers example selects a GPU device when one is available, then Apple MPS, then CPU. This directory did not run that example, and this entry is not a deploy recipe.
- Chart data comes back as HTML tables inside the grounding output. If your parser expects JSON boxes, you need the conversion helpers in the GitHub repo. The blog says those helpers exist. This run did not execute them.

## Pricing reality

Not stated. The honest line is that the model card and the blog did not publish a number.

## Sources

- Blog: https://huggingface.co/blog/lightonai/lightonocr-3
- 1B model card: https://huggingface.co/lightonai/LightOnOCR-3-1B
- Repo named on the card: https://github.com/lightonai/LightOnOCR
