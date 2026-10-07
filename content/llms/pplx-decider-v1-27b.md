---
{
  "slug": "pplx-decider-v1-27b",
  "title": "pplx-decider-v1-27b",
  "excerpt": "Perplexity's 27B decision model on the Hub since October 1, 2026. The card publishes an 11-benchmark table and no token price.",
  "category": "Perplexity",
  "tags": ["decision", "open-weight", "classification", "perplexity"],
  "provider": "Perplexity",
  "input_price": null,
  "output_price": null,
  "context_window": null,
  "arena": "Decision model",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 112,
  "last_verified": "2026-10-07"
}
---

# pplx-decider-v1-27b

## Overview

Read the provenance line before the overall score. The Hugging Face page says this repo was duplicated from `denis-pplx/autojev-27b`. The model API record was created October 1, 2026, license Apache 2.0, pipeline tag text-classification. The card calls it a decision model fine-tuned from Qwen3.8-27B.

It is not a chat model. The published `predict` call takes a string and a question object, and the comment on the card says it returns a selected choice and calibrated probabilities. A yes/no question uses `{"type": "noul", "instructions": "..."}`. The card also shows an image path: `images=["screenshot.png"]`. It does not document a `score` type. Do not assume the Clef schema.

## Pricing

No token price appears on the model card. This directory leaves both price fields blank. Do not treat a missing price as zero.

The local note on the card: Python 3.12+, and a GPU with room for about 49 GiB of weights plus working memory. That is their requirement for the published example. This entry does not claim that example was run here.

## Benchmarks

The card's table is the source. It says the pplx-decider column was measured through the Perplexity API. Bold on their page marks the best score in the row. Overall is their average of these 11.

| Benchmark | Jev | Qwen3.8-27B | pplx-decider-v1-27b |
| --- | --- | --- | --- |
| WinoGrande | 90.70% | 73.10% | 83.30% |
| RAGTruth | 77.27% | 61.53% | 88.80% |
| JudgeBench | 78.57% | 68.86% | 78.29% |
| BBH | 94.27% | 72.80% | 82.80% |
| JevBench public hard | 73.27% | 72.28% | 70.30% |
| TruthfulQA binary | 92.00% | 82.80% | 85.40% |
| Overall | 84.51% | 74.76% | 85.71% |

The overall edge over Jev is 1.2 points on their average. It is not a sweep. Jev still leads WinoGrande, JudgeBench, BBH, JevBench public hard, and TruthfulQA binary on this table. RAGTruth is the clearest win for the decider column (88.80% versus 77.27%). Quote the row, not the overall, if you are picking a model for one job.

## Key capabilities

- Closed choice and yes/no probability, from the card's two examples.
- Image input in the published script, via a local path.
- Install path on the card: download `inference.py` from the repo and run it with `uv`. A second path imports `Decider.from_pretrained("perplexity-ai/pplx-decider-v1-27b")` once those dependencies are present.

## Limitations

- The Hub page says the repo was duplicated from another user's repo. That is a provenance limit, not a footnote to skip.
- No context length is on the card. Do not borrow 65,536 from Clef, or 27B-class defaults from somewhere else.
- No public token price on the card. A Perplexity API measurement for the benchmark column is not a rate card.
- The card does not show a `score` question type. If you need ordered levels, confirm that on a newer card before you send one.
- Several rows lose to Jev. An overall win does not make this the judge model.
- No independent run was done for this entry.

## When to pick it

Pick it when you want an open Apache 2.0 decision checkpoint from the Perplexity org, you can hold about 49 GiB of weights, and the question is a choice or a yes/no. If you need a hosted price, a published context window, or generated text, this card does not give you those. Clef is the one with a Workers AI rate and a documented `score` type. A chat model is still the one that writes.

## Sources

- Model card: https://huggingface.co/perplexity-ai/pplx-decider-v1-27b
- Hub record, created October 1, 2026: https://huggingface.co/api/models/perplexity-ai/pplx-decider-v1-27b
