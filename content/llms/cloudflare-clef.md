---
{
  "slug": "cloudflare-clef",
  "title": "Cloudflare Clef",
  "excerpt": "A 27B decision model that scores a schema of typed questions in one pass. Workers AI lists $0.24 per million input tokens and no output rate.",
  "category": "Cloudflare",
  "tags": ["decision", "open-weight", "classification", "multimodal", "workers-ai"],
  "provider": "Cloudflare",
  "input_price": 0.24,
  "output_price": null,
  "context_window": 65536,
  "arena": "Decision model",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 111,
  "last_verified": "2026-10-07"
}
---

# Cloudflare Clef

## Overview

Use Clef when the answers are already a list. Do not use it to write the reply.

The Hugging Face card describes a 27B multimodal model, post-trained from Qwen3.8-27B, that takes a state plus a schema of typed questions and returns a probability for every allowed option. There is no free-form text generation and no output parsing. The Hub record was created September 30, 2026 and last modified October 1, 2026. Weights are Apache 2.0. The safetensors index fetched with the model API lists 27,356,728,560 parameters.

Workers AI hosts it as `@cf/cloudflare/clef`. The smaller sibling, Clef-flash, is a 9B model at `@cf/cloudflare/clef-flash`. Same request shape. Different price, and a different error profile on Cloudflare's own table.

## Pricing

Verified on Cloudflare's pages this run, not on a secondary writeup.

- Clef: $0.24 per million input tokens on the model page. The pricing table lists the same rate as $0.240 per million input tokens, and 21,818 neurons per million input tokens.
- Clef-flash: $0.09 per million input tokens on its model page. The pricing table lists $0.090 and 8,182 neurons per million input tokens.
- Neither page publishes an output token price. The unit is input tokens. The output field in this directory is blank on purpose.
- Workers AI's general meter is still $0.011 per 1,000 neurons, with 10,000 neurons per day in the free allocation. The model row is the rate to budget. Do not invent a second Clef price from the neuron headline alone.

## Benchmarks

The scores below are from Cloudflare's Decision Index 0.2.1 table on the Clef model card. They are the vendor's run. Scores are percentages except latency.

| Benchmark | Clef | Clef-flash | Jev |
| --- | --- | --- | --- |
| MMLU | 90.3 | 91.8 | 91.7 |
| GPQA Diamond | 48.0 | 51.0 | 78.3 |
| RAGTruth (hallucination F1) | 79.4 | 35.6 | 76.5 |
| Home appliance simulator | 83.0 | 97.7 | 52.3 |
| Median latency (ms) | 209.3 | 38.8 | 524.1 |

Two readings, both on their table. Clef is not the winner on GPQA Diamond. Jev is, by a wide margin. And flash is not a strict downgrade: it wins the home-appliance row and the latency row, and it collapses on RAGTruth (35.6 versus 79.4). Pick the size from the row you care about, not from the parameter count.

Workflow evals on the same card, Typesafe Evals, same cohort: invoice exact-action accuracy is 64.7 for Clef, 57.1 for flash, 61.8 for Jev. Agent-trace primary action is 68.5, 69.8, and 71.6. Closed-set routing is the stronger story. Open trace judgment is closer, and Jev still leads that row.

## Key capabilities

- Question types on the card and the Workers AI page: `noul` (yes/no probability), `choice` (labeled options), `score` (ordered levels).
- Workers AI limits: 1 to 64 questions. Long text state is truncated to the token limit. Context window on the model page is 65,536 tokens.
- Images are optional, embedded PNG, JPEG, or WebP, max 4. The docs reject remote URLs. Caps on that page: 4 MiB and 16 megapixels each, 8 MiB total decoded, whole request body max 13 MiB.
- The local card example is a single forward pass through `joint_schema_model.py`. It is not a chat completion.
- Clef-flash uses the same schema. Set `model` to `clef-flash` on the flash route.

## Limitations

- It will not draft, summarize, or emit a tool-call argument in prose. If the next step needs generated text, this is the wrong model.
- The card's local `encode_record` default `max_length` is 16,384 tokens. Workers AI lists 65,536. Do not treat those as the same budget.
- The card says the local example was tested with torch 2.11 and transformers 5.10.2. That is Cloudflare's note. This directory did not run it.
- GPQA Diamond at 48.0 on their table is a real gap if the decision needs scientific reasoning rather than a closed label.
- Flash's RAGTruth score on that table is a reason not to "just use the cheaper one" for hallucination checks.
- No output price is published. Budget the input.

## When to pick it

Pick Clef for support routing, invoice status, urgency, and other questions whose legal answers you can write down in advance. Use flash when the vendor row you care about holds and the latency matters. Stay on a chat model when the output is a paragraph, a plan, or a tool call you have to read.

## Sources

- Model card: https://huggingface.co/Cloudflare/clef
- Workers AI model page: https://developers.cloudflare.com/workers-ai/models/clef/
- Clef-flash model page: https://developers.cloudflare.com/workers-ai/models/clef-flash/
- Pricing table: https://developers.cloudflare.com/workers-ai/platform/pricing/
