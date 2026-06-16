---
slug: never-trust-a-hallucination
title: Never Trust a Hallucination
category: Quality
excerpt: "Agents will confidently invent facts, URLs, APIs, and code. Verify anything that matters before you use it."
tags:
  - quality
  - hallucination
  - verification
order: 11
last_verified: 2026-06-16
---

# Never Trust a Hallucination

## The problem

Agents generate plausible-sounding output. Sometimes that output is wrong. They invent functions, cite nonexistent papers, recommend deprecated packages, and quote fake documentation.

This is not malice. It is how language models work. They predict what *looks* right, not what *is* right.

## What hallucinations look like

- A function name that does not exist in your codebase
- A URL that returns 404
- A package version that was never released
- A quote from a real person they never said
- A code pattern that compiles but does the wrong thing
- A statistic without a source

## Your job

Assume the agent is a confident intern with imperfect memory. Verify:

1. **Code:** Does it run? Does it produce the right output?
2. **Links:** Do they resolve? Are they the right pages?
3. **Packages:** Are they real? Are they maintained?
4. **Facts:** Can you trace them to a source?
5. **APIs:** Do the endpoints and parameters match the real API?

## Tools that help

- **Tavily or Firecrawl** for live web verification
- **Unit tests** for code claims
- **Type checking** for API contracts
- **Citations** in RAG agents so users can verify

## When it matters most

Hallucinations are dangerous when the output leaves your hands:
- Customer-facing content
- Production code
- Legal, medical, or financial advice
- Anything used for decision-making

## Quick win

For the next agent output that includes a URL, package, or fact, verify one item before trusting the rest. Make it a habit.
