---
slug: budget-argon-before-you-call-it
title: "Budget Gemini 4 Argon before you call it"
excerpt: "Match the account surface, then write both prices. The intro rate is $2 and $10 through November 30, 2026. The Cloud page also prints tables this fetch could not label."
category: Guides
tags:
  - gemini
  - pricing
  - agents
  - api
order: 117
last_verified: "2026-10-14"
---

# Budget Gemini 4 Argon before you call it

## The decision

Argon is not one door and not one price. If you put `gemini-4-argon` in a gateway because a blog said it launched, you will bill the wrong surface or the wrong table. Do the two checks below before the first call. This guide did not call the API. The pages are the source.

## Which surface you actually have

The October 13, 2026 Keyword post names the doors. It does not name the clicks.

| Who you are | Where the post says to try it | What it does not say |
| --- | --- | --- |
| Developer or enterprise, API | AI Studio and the Gemini platform. The platform link in that post carries `model=gemini-4-argon`. | A menu path inside the console |
| Google AI Ultra | Google Antigravity, and also the Gemini app and AI Mode in Search | That Pro includes Antigravity |
| Google AI Pro or Ultra | Gemini app and AI Mode in Search | That a free Gemini account includes Argon |
| Developer on the paid API tier | Google AI Studio and Android Studio, from the same-day developer post | A free-tier model id |
| Scientist applying for access | A form for six months of Antigravity's highest usage tier, rolling, subject to eligibility, capacity, and selection | That the form is an approval |
| Cyber defender | The Fairwind Program, for Argon without cyber guardrails, rolling | That this is the public `$2` model |

The developer post, also October 13, 2026, repeats the paid-tier and Ultra lines. It adds Android Studio. It still does not list clicks. If your note says "open the model picker and choose Argon," delete that sentence until you have done it yourself.

The model docs page, last updated 2026-10-13 UTC, gives the id: `gemini-4-argon`. Unified input and output limit: 1,048,576 tokens. Default synchronous max output: 65,536. Long decode can use the rest of that unified limit. Explicit caching is not supported. Image generation and the Live API are not supported. A gateway config that assumes those three will fail for reasons that are not "the model is down."

## Which price you are allowed to write down

Write two lines, not one.

The Keyword post's introductory price is $2 per million input tokens and $10 per million output tokens, cached input at 95% off. Footnote 1 says that after November 30, 2026 the price is $4 and $20, and that this applies to the Argon model intended for public access only. Today is before that date. December is not.

The Agent Platform pricing page agrees with that pair on the first Gemini 4 table: global $2 / $10 through November 30, cached input $0.10, then $4 / $20 with cached input $0.20. Non-global on that table is 10% higher ($2.20 / $11, then $4.40 / $22). Five percent of $2 is $0.10. The blog's "95% off" and that cached cell are the same arithmetic.

Then stop. The same Gemini 4 section prints two more tables. The fetch did not keep a heading between them. One is $3.60 / $18 through November 30, then $7.20 / $36. The next is $1 / $5, then $2 / $10. Those are 1.8 times and half of the first table. The page text saved this run does not name the multiplier. Do not label them Priority or Flex because other Gemini families use those words. Label them "unlabeled table on the Cloud page" until you can see the control that selects them.

Three more traps on that same Cloud fetch:

- Gemini 4 Argon Cyber Permissive is on the December 1 row. The star says the 50% credits-back promotion does not apply to it. Do not quote $2 for a Fairwind or permissive endpoint.
- The CodeMender section lists Argon at $4 input, $0.20 cached, and $20 output. That is the standard pair, not the intro pair.
- The AlphaEvolve section lists a Gemini model price of $2 / $10 and then an agent price of $8 / $40. The agent line is extra. It is not a cheaper Argon.

The Developer API pricing page fetched this run was last updated 2026-10-01 UTC and did not contain the word Argon. Absence there is not a free tier. Recheck it. If a row appears, use that row for API calls and keep the Cloud tables for Agent Platform calls. They are allowed to differ. Collapse them only after both pages show the same number.

## What to put in the gateway note

1. Model id: `gemini-4-argon`.
2. Surface: the one your account actually opens, copied from the table above.
3. Price through November 30, 2026, and price from December 1, with the table heading you matched.
4. Cached input only if you are on implicit caching. The model page says explicit caching is not supported.
5. Output cap: 65,536 unless you have turned on the long-decode path the Keyword post points at. This guide did not open that protocol page. Do not invent the request field.

## Recommendations

Do not average $2, $3.60, and $1 into a planning rate. Pick the table your project uses, or leave the price blank.

Do not tell a Pro subscriber they can open Antigravity. The Keyword post reserves that name for Ultra.

Do not tell a free-tier script to send `gemini-4-argon` because the model docs exist. The developer post says paid tier.

If the job is an image or a live session, pick a different model. Argon's docs page says both are unsupported.

## Sources

- https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon
- https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-4-argon/
- https://ai.google.dev/gemini-api/docs/models/gemini-4-argon
- https://ai.google.dev/gemini-api/docs/pricing
- https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing
