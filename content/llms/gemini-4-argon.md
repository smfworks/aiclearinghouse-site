---
{
  "slug": "gemini-4-argon",
  "title": "Gemini 4 Argon",
  "excerpt": "Google's public Argon model, id gemini-4-argon. The Oct 13 blog prices the intro at $2 / $10 per million tokens through November 30, 2026. The Cloud page also prints two other tables.",
  "category": "Google",
  "tags": ["reasoning", "long-context", "agentic", "coding", "google", "api"],
  "provider": "Google",
  "input_price": 2.0,
  "output_price": 10.0,
  "context_window": 1048576,
  "arena": "Frontier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 113,
  "last_verified": "2026-10-14"
}
---

# Gemini 4 Argon

## Overview

Use this row for the public model, not for a lab story. The model code on the Gemini API docs page is `gemini-4-argon`. That page was last updated 2026-10-13 UTC. It calls Argon a flagship reasoning model for complex software engineering, math and science, autonomous multi-step agents, and long decode.

The October 13, 2026 Keyword post says Argon is globally available that day for developers and enterprises via the API in AI Studio and the Gemini platform, for Google AI Ultra subscribers in Google Antigravity, and for Google AI Ultra and Pro subscribers in the Gemini app and AI Mode in Search. The developer post the same day, by Anca Dragan and Raluca Ada Popa, says developers build on the paid Gemini API tier in Google AI Studio and Android Studio, and that Ultra subscribers can try it in AI Studio and Antigravity. Neither post walks a menu. This directory did not open the app and invent the clicks.

## Pricing

The numbers in the frontmatter are the introductory public rate, and they expire.

The Keyword post states an introductory price of $2 per million input tokens and $10 per million output tokens, with cached input tokens at 95% off. Footnote 1 on that post says that after November 30, 2026 the price is $4 per million input tokens and $20 per million output tokens, and that this applies to the Argon model intended for public access only.

The Agent Platform pricing page, fetched the same run, prints three Argon tables in the Gemini 4 section. The extract did not keep a tab or tier label between them. Do not collapse them into one rate.

| What the first table prints | Global, through Nov 30, 2026 | Global, from Dec 1, 2026 |
| --- | --- | --- |
| Input | $2 | $4 |
| Text output (response and reasoning) | $10 | $20 |
| Cached input | $0.10 | $0.20 |

Non-global on that same first table is $2.20 / $11, then $4.40 / $22, with cached input $0.11 then $0.22. The 95% figure on the blog matches the cached column: $2 times 0.05 is $0.10, and $4 times 0.05 is $0.20. That arithmetic is on the printed numbers. It is not a second source.

The next table in that section prints $3.60 / $18 through November 30, then $7.20 / $36. The one after that prints $1 / $5, then $2 / $10. Those are 1.8 times and 0.5 times the first table's input and output. The page does not name those multipliers in the text this run saved. Leave them unlabeled.

A star on those tables says promotional pricing is 50% credits back on net spend, and that the promotion does not apply to Gemini 4 Argon Cyber Permissive. Cyber Permissive sits on the December 1 row, not on the intro row. Do not budget it at $2.

Two other sections on the same Cloud page use different Argon lines. CodeMender lists Argon input at $4, cached tokens at $0.20, and output at $20. AlphaEvolve lists a Gemini model price of $2 input and $10 output, then an agent price of $8 input and $40 output. Those are product rows. They are not the API intro rate.

The Developer API pricing page at `ai.google.dev/gemini-api/docs/pricing` was last updated 2026-10-01 UTC. A search of the fetched text found no Argon row. The AI Studio pricing URL returned a docs shell, not a price table. Until that page lists Argon, cite the blog footnote and the Cloud table you actually matched.

## Key capabilities

From the model docs page, not from a run:

- Inputs: text, image, video, audio, and PDF. Output: text.
- Unified input and output token limit: 1,048,576. Default synchronous max output is 65,536. Long decode can go up to 1,048,576. The Keyword post calls that a 1M unified input-output limit and points at a continuation protocol. This card did not open that protocol page.
- Thinking levels: low, medium, high.
- Supported: code execution, function calling, structured outputs, search grounding, Maps grounding, file search, URL context, batch, flex, and priority. Computer use is marked Preview. Agentic video understanding defaults to `static`.
- Caching is implicit only. The page says explicit caching is not supported.
- Not supported: audio generation, image generation, Live API.

The Keyword post says Argon ranks number one on the Vals Index. That sentence is Google's. This directory did not open the Vals page this run, so the score itself is not copied here.

## Limitations

- The intro rate ends November 30, 2026. A budget that stops at $2 / $10 is wrong on December 1.
- The Cloud page prints three Argon tables and the fetch did not preserve the labels. If your invoice does not match $2 / $10, you are probably on a different table, a non-global endpoint, Cyber Permissive, CodeMender, or AlphaEvolve.
- The Developer API pricing page fetched this run does not list the model. Do not treat a missing row as free.
- The 1,048,576 figure is a unified input-output limit, not an input window you can fill and then still take a full million tokens out.
- Explicit caching is off. The 95% cached-input line does not mean you can pin a cache the way older Gemini pages describe explicit caching.
- No image generation and no Live API. If the job is a picture or a live session, this is the wrong model id.
- Access is not one door. Pro and Ultra are named for the app and AI Mode. The paid API tier is named for developers. The posts do not publish a click path.
- This directory did not call the API.

## When to pick it

Pick the public `gemini-4-argon` id when the work is a long coding, research, or agent run and you have checked which surface your account actually opens. Write both prices in the runbook before the first call: $2 / $10 through November 30, 2026, then $4 / $20. If the Cloud table in front of you is not the first one, stop and match the heading. Do not average the three tables.

## Sources

- Keyword post, October 13, 2026: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon
- Developer post, October 13, 2026: https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-4-argon/
- Model docs, last updated 2026-10-13 UTC: https://ai.google.dev/gemini-api/docs/models/gemini-4-argon
- Developer API pricing page, last updated 2026-10-01 UTC, no Argon row in the fetch: https://ai.google.dev/gemini-api/docs/pricing
- Agent Platform pricing: https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing
