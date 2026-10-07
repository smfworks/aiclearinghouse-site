---
slug: decision-models-return-probabilities
title: "Decision models return probabilities, not prose"
excerpt: "Clef and pplx-decider-v1 score a closed question. Use them for routing. Keep a chat model for anything you have to read as a sentence."
category: Guides
tags:
  - decision-models
  - routing
  - clef
  - perplexity
  - agents
order: 116
last_verified: "2026-10-07"
---

# Decision models return probabilities, not prose

## The split

A chat model writes. A decision model scores a question you already constrained. Mixing them up is how a router starts returning essays, or a writer gets asked for a probability it was never trained to emit.

Two open checkpoints made that split concrete in the first days of October 2026. Cloudflare's Clef card says there is no free-form text generation and no output parsing. Perplexity's pplx-decider-v1-27b card shows a `predict` call that returns a selected choice and probabilities. Neither card is a drafting model. This guide did not run either one. The pages below are the source.

## What you send

Clef, on the Workers AI page, wants `state` plus `questions`. A question is `noul`, `choice`, or `score`. One to 64 questions. Answers come back under the same ids, with probabilities. Images, if you send them, are embedded files, not URLs, and the page caps them at four.

pplx-decider, on its card, documents `choice` and `noul`. It shows an image path. It does not show `score`. Do not paste a Clef score question at it and assume the shape matches.

If you cannot write the allowed answers before the call, you do not have a decision-model task yet. You have a drafting task. Send that to a chat model.

## What the prices actually say

Clef has a hosted rate. Workers AI lists $0.24 per million input tokens for `@cf/cloudflare/clef`, and $0.09 for `@cf/cloudflare/clef-flash`. Neither page lists an output price. The unit is input tokens.

pplx-decider's card has no token price. The benchmark note says that column was measured through the Perplexity API. A measurement path is not a rate. Leave the price blank until a pricing page says otherwise.

Kolibri, the generative release from the same week, also has no public token price. Open weights and a decision head are different products. Neither one becomes free because the price field is empty.

## How to read their tables

Both cards publish vendor tables. Use the row, not the trophy sentence.

On Clef's Decision Index table, GPQA Diamond is 48.0 for Clef and 78.3 for Jev. RAGTruth hallucination F1 is 79.4 for Clef and 35.6 for Clef-flash. Flash is faster on their latency row (38.8 ms median versus 209.3) and worse on that hallucination row. "Use the small one to save money" is not a strategy until you have checked the row.

On the pplx-decider table, the overall average is 85.71% versus Jev at 84.51% and the Qwen3.8-27B base at 74.76%. Jev still leads WinoGrande, JudgeBench, BBH, JevBench public hard, and TruthfulQA binary on that same table. RAGTruth is where the decider column is ahead (88.80% versus 77.27%). An overall win of about a point is not a reason to rip out the judge model.

One more provenance check, only on the Perplexity page: the Hub says the repo was duplicated from `denis-pplx/autojev-27b`. Cite that if you are standardizing on the checkpoint. A duplicate is still a real repo. It is also a reason to confirm which commit you pinned.

## Decision matrix

| You need | Use | Do not use |
| --- | --- | --- |
| A label, a yes/no, or a score over levels you wrote | Clef, if you want the hosted rate and the `score` type | A chat model asked to "just reply with the label" |
| An open Apache 2.0 decision checkpoint and you can hold ~49 GiB | pplx-decider, for `choice` or `noul` as documented | Clef's score schema, until that card shows it |
| A paragraph, a plan, or a tool-call argument in text | A generative model, with a published price if you need one | Either decision model |
| German-English generation you can self-host | Kolibri 1, at the 262,144 serving budget | A decision head, and not the 1M headline by default |

## Recommendations

1. Write the allowed answers first. If you cannot, you are not ready for Clef or the decider.
2. Store probabilities, not only the winning label. The point of these models is the distribution. Throwing it away recreates a brittle classifier.
3. Set a threshold in your code for "ask a person." The cards do not ship that policy. A 0.51 choice is not a decision.
4. Keep the chat model in the draft step. Route with the decision model, then generate with something that is allowed to write.
5. When flash is cheaper, check the row. RAGTruth on Clef's own table is the warning.

## Sources

- https://huggingface.co/Cloudflare/clef
- https://developers.cloudflare.com/workers-ai/models/clef/
- https://developers.cloudflare.com/workers-ai/models/clef-flash/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://huggingface.co/perplexity-ai/pplx-decider-v1-27b
- https://huggingface.co/Aleph-Alpha/Kolibri-1
