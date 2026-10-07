---
{
  "slug": "mistral-large-4",
  "title": "Mistral Large 4",
  "excerpt": "Public preview of a 1 trillion-parameter multimodal MoE with 49 billion active parameters. Mistral's card lists $1.36 per million input tokens and $4.18 per million output tokens. Weights are not out yet.",
  "category": "Mistral",
  "tags": ["preview", "multimodal", "mixture-of-experts", "coding", "open-weight"],
  "provider": "Mistral",
  "input_price": 1.36,
  "output_price": 4.18,
  "context_window": null,
  "arena": "Public preview",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-10-07"
}
---

# Mistral Large 4

## Overview

Use the preview API if you need the model this week. Do not plan a local pull yet.

Mistral's launch post, dated October 6, 2026, calls the release a public preview of Mistral Large 4. The nickname on the page is le Chonk. Unofficially, ML4. The post says you can try the preview API on Mistral Studio, and that weights drop at the end of the month. Until then this is a hosted preview, not a checkpoint you can serve yourself.

The same post describes a 1 trillion-parameter natively multimodal model with 49 billion active parameters. The product card on that page calls it an open-weight hybrid instruct-and-reasoning MoE. "Open-weight" on the card is the plan. The post is explicit that the weights are still coming.

The launch post does not publish a context window. This directory leaves that field blank.

## Pricing

Taken from the product card on the October 6 launch page, not from a secondary writeup.

- Input: $1.36 per million tokens
- Output: $4.18 per million tokens
- No cached-input rate appears on that card
- No context-length multiplier appears on that card

If a gateway quotes a different ML4 rate, treat the launch card as the number to reconcile against. Do not average the two.

## What the post actually measured

These figures are Mistral's. This directory did not re-run them.

Coding, from the launch post:

- DeepSWE v1.1: 61.7%
- SWE-Atlas-QnA: 59.4%
- Terminal-Bench 4: 28.3%
- Coding Agent Index: 49.8%, which the post places ahead of DeepSeek V4 Pro 0813 and Qwen3.8 Max

The post does not print those two competitors' index scores. Do not backfill them.

A blind coding review with Surge AI, model names hidden, used a 1–5 scale. ML4 Preview scored 3.74 and ranked second of five. The post puts Kimi K3 at 3.59, GLM-5.3 at 3.60, GLM-5.2 at 3.40, and Claude Opus 5 at 4.22.

Agent workflows, still the vendor's numbers: 59.9% on AutomationBench, described as 657 business workflows, ahead of Kimi K3, MiMo-V2.6-Pro, and DeepSeek V4 Pro. AA-Briefcase Elo of 1,393, ahead of DeepSeek V4 Pro. On Dense 200 visual grounding, the post says 42% versus 41% for GPT-6-Astra.

The page also reports cybersecurity scores. This entry does not reprint those rows. They are not a reason to treat the preview as a local security tool.

## What you cannot do yet

- You cannot self-host the weights. The post says they land at the end of the month, with more architecture and benchmark detail then.
- You cannot quote a context window from this page. It is not there.
- You cannot treat the preview card's "open-weight" line as a download link.

## When to pick it

Pick the preview when you want Mistral's hosted multimodal MoE and you can pay the card rate. Wait on a local recipe until the weights post exists. A Terminal-Bench 4 score of 28.3% is the vendor's number on that bench, not a reason to swap out a higher public-board coding agent without your own tasks.

## Sources

- Launch post, October 6, 2026: https://mistral.ai/news/mistral-large-4/
- Schema date on that page: 2026-10-06T12:00:27.000Z
