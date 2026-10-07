---
slug: openai-decisions-api
title: "OpenAI Decisions API"
excerpt: "Public beta as of October 6, 2026. POST /v1/decisions on gpt-6-luna returns a probability, a choice, or a score. The decisions guide prices that endpoint at $0.10 per million input tokens and no output charge."
category: Infrastructure
tags:
  - openai
  - routing
  - classification
  - decisions
  - agents
provider: OpenAI
pricing_model: Usage-based
price: "$0.10 / 1M input tokens on /v1/decisions. No output charge on that endpoint."
website: https://platform.openai.com/docs/guides/decisions
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-10-07"
---

# OpenAI Decisions API

## What it is

Use it when the answer is already a type. Do not use it to write the reply.

OpenAI's API changelog for October 6, 2026 says the Decisions API shipped in beta with `gpt-6-luna`. The guide says it returns typed answers about 10x faster than the Responses API. That speed line is OpenAI's. This directory did not time the two endpoints.

The only model on the guide is `gpt-6-luna`. The route is `POST /v1/decisions`. The guide says public beta, with GA expected in the coming weeks. It also names the SDK floors for the examples: Python 3.26.0, JavaScript 7.30.0, Go 3.73.0, Ruby 0.101.0, and Java 4.78.0, or later.

## What you send

Three fields. `model`. `input`, a string or user messages with text and images. `questions`, each with a type, a unique `name`, and instructions.

| Type | You get back |
| --- | --- |
| `predicate` | `probability` from 0 to 1 that the condition is true |
| `choice` | one of your values, plus probabilities and a separate `confidence` |
| `score` | a probability-weighted average of level indices, which can fall between levels |

`choice` is for unordered labels, such as a department. `score` is for ordered levels, such as severity. The guide's score example uses indices 0, 1, and 2 and shows an illustrative score of 1.1 from probabilities 0.1, 0.7, and 0.2. That JSON is an illustration in the docs, not a measurement from this directory.

Images have to be inline base64 data URLs. Hosted HTTP or HTTPS image URLs and `file_id` inputs are not supported on this endpoint.

If the next question depends on the first answer, send a second request. Independent questions can share one `questions` array.

The guide says to include a fallback such as `other` when your categories do not cover the input, and to set thresholds from labeled examples in your own app. A probability is not a policy until you pick the cutoff.

Use Structured Outputs on the Responses API when you need a JSON object or a written explanation. Use function calling when you need a tool call. The decisions guide draws that line itself.

## Price

On `gpt-6-luna`, the decisions guide says input costs $0.10 per million tokens. You pay only for input tokens. No cache-read, cache-write, or output-token charges on `/v1/decisions`.

Regional processing premiums and long-context input multipliers still apply. Other `gpt-6-luna` calls follow the normal model pricing page, not this endpoint's input-only rate.

The guide says Zero Data Retention and HIPAA are available for eligible customers, and that data residency and regional processing are supported in the United States and in Europe (EEA and Switzerland). Eligibility is on OpenAI's data-controls page, not in this note.

## Same-day tier change

The October 6 changelog also says usage tiers were simplified from five to three: Build, Launch, and Grow. The rate-limits page fetched this run lists:

- Free: allowed geography, $100 / month
- Build: $5 in total credit purchases, $500 / month
- Launch: $100 in total credit purchases, $5,000 / month
- Grow: $500 in total credit purchases, $200,000 / month

Those are monthly usage limits, not the per-token price. Check the limits page in the console for the RPM and TPM on your tier. This note does not copy a per-model cap that was not on the page.

## Sources

- Guide: https://platform.openai.com/docs/guides/decisions
- Changelog, Oct 6: https://platform.openai.com/docs/changelog
- Rate limits: https://platform.openai.com/docs/guides/rate-limits
