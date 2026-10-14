---
{
  "slug": "clef-omni",
  "title": "Cloudflare Clef-Omni",
  "excerpt": "A 30B-A3B decision model that scores typed questions over text, images, audio, or video. The Workers AI model page lists $0.15 per million input tokens and no output charge.",
  "category": "Cloudflare",
  "tags": ["decision", "multimodal", "audio", "video", "open-weight", "workers-ai"],
  "provider": "Cloudflare",
  "input_price": 0.15,
  "output_price": null,
  "context_window": 64000,
  "arena": "Decision model",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 114,
  "last_verified": "2026-10-14"
}
---

# Cloudflare Clef-Omni

## Overview

Clef-Omni is the audio and video sibling of Clef, not a chat model with a new name.

The Hugging Face card describes a 30B-A3B mixture-of-experts model, post-trained from Qwen/Qwen3-Omni-30B-A3B-Instruct. You send a state plus a schema of typed questions. It returns a probability for every allowed option in one forward pass. The card says there is no free-form text generation and no output parsing. License is Apache-2.0, following the base model.

Workers AI hosts it as `@cf/cloudflare/clef-omni`. The model page lists a 64,000-token context window. The card's `encode_record` default `max_length` is also 64,000 tokens. That is a closer pair than Clef's hosted window and local helper default. Do not copy Clef's 65,536 into this row.

## Pricing

The frontmatter uses the Workers AI model page, fetched this run: $0.15 per million input tokens. The same page says Clef models bill media as input tokens at that rate, and do not charge for output tokens. The output field here is blank on purpose.

The Workers AI pricing table fetched the same run lists `@cf/cloudflare/clef` at $0.240 per million input tokens and `@cf/cloudflare/clef-flash` at $0.090. It does not list a clef-omni row. Budget from the model page, and recheck the table before you treat $0.15 as the ledger rate. The general meter is still $0.011 per 1,000 neurons, with 10,000 neurons per day in the free allocation. Do not invent a neuron count for Omni from the Clef row.

## Benchmarks

These scores are Cloudflare's Decision Index 0.2.1 table on the model card. Scores are percentages. ForecastBench on that table is a Brier score, where lower is better. This directory did not run the suite.

| Benchmark | Clef-Omni | Clef | Clef-flash | Jev |
| --- | --- | --- | --- | --- |
| MMLU | 92.7 | 90.3 | 91.8 | 91.7 |
| GPQA Diamond | 47.4 | 48.0 | 51.0 | 78.3 |
| RAGTruth (hallucination F1) | 42.0 | 79.4 | 35.6 | 76.5 |
| Home appliance simulator | 69.3 | 83.0 | 97.7 | 52.3 |
| BANKING77 (macro-F1) | 94.8 | 94.2 | 90.9 | 79.7 |

Read the row. Omni leads MMLU and BANKING77 on that table. It does not lead RAGTruth. Clef's 79.4 against Omni's 42.0 is a reason not to "upgrade" a hallucination check because the new model accepts audio. GPQA Diamond stays in the high 40s for the Clef family on this table. Jev is at 78.3. A closed support label and a science question are different jobs.

Workflow evals on the same card, Typesafe Evals, same cohort: invoice exact-action accuracy is 60.2 for Omni and 64.7 for Clef. Agent-trace primary action is 65.8 for Omni and 71.6 for Jev. Audio support is not a free accuracy upgrade.

## Key capabilities

- Question types on the card and the Workers example: `noul`, `choice`, and `score`.
- The card says the API shape is compatible with Jev and SystemOne, including a `systemone()` helper that accepts a `POST /v1/systemone` body.
- Media, from the Workers page: up to 4 audio clips and 2 videos. Images are resized, counted as 32 by 32 patches, and capped at 1,024 tokens each, plus 3 marker tokens. Audio is about 780 tokens per minute. Video is up to about 15,400 tokens per minute at maximum resolution, plus about 780 per minute if it has sound. A 480p clip is about 8,600 frame tokens per minute.
- If media tokens exceed the context window, the request fails. Otherwise the text `state` is truncated to fit.
- The card's local example was tested with torch 2.11 and transformers 5.10.2. It says the backbone needs about 64 GB of GPU memory in bfloat16. This directory did not run it.
- SGLang on the card is marked coming soon. Do not write a serve flag for it.

## Limitations

- It will not draft, summarize, or emit a tool-call argument in prose. If you need a sentence, use a chat model.
- RAGTruth at 42.0 on their table is the warning. Cheaper and multimodal is not the same as better at catching a bad citation.
- The $0.15 rate is on the model page and missing from the pricing table fetched this run. Treat that gap as open, not as a discount.
- No question-count cap was on the pages saved this run. Do not paste Clef's 1-to-64 limit onto Omni until a page says it.
- A 64 GB weight note is a hosting constraint, not a Workers AI bill. The hosted route does not ask you to hold the weights.
- POP909-CL on the same card is 2.6 for Omni. If the decision is music-structure classification, this table says don't.

## When to pick it

Pick Omni when the state is a call recording, a clip, or an image and the legal answers are already a list. Stay on Clef when the job is text-only and the row you care about is RAGTruth or invoice exact-action. Stay on a chat model when the output is a paragraph.

## Sources

- Model card: https://huggingface.co/Cloudflare/clef-omni
- Workers AI model page: https://developers.cloudflare.com/workers-ai/models/clef-omni/
- Pricing table, no Omni row in this fetch: https://developers.cloudflare.com/workers-ai/platform/pricing/
