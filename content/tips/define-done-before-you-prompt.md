---
slug: define-done-before-you-prompt
title: Define "Done" Before You Prompt
category: Quality
excerpt: "If you cannot describe success, the agent cannot deliver it. Define the outcome before you ask for the output."
tags:
  - quality
  - prompting
  - scoping
order: 13
last_verified: 2026-06-16
---

# Define "Done" Before You Prompt

## The gap

Many agent prompts describe the *activity* but not the *outcome*.

- "Improve this function" — what does improved mean?
- "Write a report" — what should the reader learn?
- "Refactor the code" — to what standard?

Without a definition of done, the agent stops when it runs out of tokens or when the output *looks* reasonable, not when the task is actually complete.

## How to define done

Convert every prompt into an outcome statement:

| Vague | Defined |
|-------|---------|
| Improve this function | Reduce cyclomatic complexity to ≤10 and add error handling for null inputs |
| Write a report | Produce a one-page summary with 3 takeaways and 1 recommended action |
| Refactor the code | Split the component into 3 tested utilities with no regressions in existing tests |
| Update the docs | Add a setup section that lets a new developer run the project in under 10 minutes |

## The acceptance test

If possible, give the agent an acceptance test it can run to verify completion. This works for code, data extraction, and many structured tasks.

> "Your output passes when `npm test` runs without failures and the new endpoint returns `{success: true}`."

## Why it works

Agents are goal-seeking pattern generators. When you give them a clear target, they align their output toward it. When the target is vague, they optimize for plausibility.

## Quick win

Add one sentence to your next prompt describing exactly what the output must satisfy. Then review whether the result met it.
