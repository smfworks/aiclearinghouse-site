---
slug: decisions-api-typed-answers
title: "Use the Decisions API when the answer is a type"
excerpt: "OpenAI's October 6, 2026 endpoint returns a probability, a choice, or a score. If you need a sentence or a JSON object, stay on the Responses API."
category: Guides
tags:
  - decisions-api
  - openai
  - routing
  - structured-output
  - agents
order: 99
last_verified: "2026-10-07"
---

# Use the Decisions API when the answer is a type

## The split

A router that needs a department name should not ask a chat model to "reply with one word." OpenAI's Decisions API, in public beta as of the October 6, 2026 changelog, is the endpoint for that job. It is `POST /v1/decisions`, model `gpt-6-luna` only.

This is not the same product as the open decision checkpoints already in this directory. Those cards describe local weights and a schema you host. This one is a hosted route with a published input price. Do not copy a Clef question onto `/v1/decisions` and assume the field names match.

## Pick the type before you write the prompt

The guide's three types:

- `predicate` when the question is yes or no in substance. You get a probability from 0 to 1. The docs' damage example is illustrative. The 0.92 in that JSON is not a benchmark.
- `choice` when the labels have no order. Departments, categories, routes. Include an `other` value if the list can miss. The answer has the selected value, a probability for every option, and a separate `confidence`.
- `score` when the labels are ordered. Severity, priority, quality bands. Put the lowest level first. The score is a weighted average of the indices, so 1.1 can land between "workaround" and "blocked." If you need exactly one label, use `choice`.

Write the allowed answers before the call. If you cannot, you do not have a decisions task. You have a drafting task.

## What not to send

Images must be base64 data URLs inside the user message. The guide says hosted image URLs and `file_id` are not accepted on this endpoint. A link to a product photo will not do the job the damage example describes.

Dependent questions do not belong in one array. Check for damage, read the probability, then send a second request if you still need a repair category. Independent questions can share the input.

Structured Outputs on the Responses API is the path for an object you defined, or for an explanation a person will read. Function calling is the path for a tool call. The decisions guide says so. Follow that line instead of stuffing a written summary into a score level.

## Price and threshold

The decisions guide prices `/v1/decisions` at $0.10 per million input tokens on `gpt-6-luna`, with no output, cache-read, or cache-write charge on that endpoint. Other Luna calls are not on this rate. Long-context multipliers and regional premiums still apply.

Set the cutoff from labeled examples in your app. The guide's instruction is to weigh false positives against false negatives. A shipped router with no threshold is just a print of the probability.

SDK examples on the guide need Python 3.26.0, JavaScript 7.30.0, Go 3.73.0, Ruby 0.101.0, or Java 4.78.0, or a later release in that line. An older SDK that has no `decisions.create` will not grow the method because the HTTP route exists.

## Sources

- https://platform.openai.com/docs/guides/decisions
- Changelog, October 6, 2026: https://platform.openai.com/docs/changelog
