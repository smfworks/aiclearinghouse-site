---
slug: version-your-prompts
title: Version Your Prompts
category: Quality
excerpt: "A prompt is code. Code needs versioning. Track what changed and why, so you can roll back when a prompt regresses."
tags:
  - quality
  - prompts
  - versioning
order: 7
last_verified: 2026-06-16
---

# Version Your Prompts

## The principle

Prompts are a form of source code. They have logic, structure, and behavior. They should be treated with the same discipline as any other code: version control, review, tests, and rollback.

## Why prompt versioning matters

A small change to a prompt can have a large effect on output quality. Without versioning:

- You cannot tell what changed when output degrades.
- Team members reuse old prompts unknowingly.
- You lose good prompts when someone overwrites them.
- You cannot A/B test phrasings.
- Rollbacks are manual and error-prone.

## How to version prompts

1. **Keep prompts in your repo.** A `prompts/` directory is enough to start.
2. **Name by purpose and version.** `extract-entities-v1.txt`, `extract-entities-v2.txt`.
3. **Commit changes with context.** "Updated extraction prompt to handle nested lists."
4. **Run regression tests.** Keep a small set of inputs and expected outputs.
5. **Archive, do not delete.** Old prompts teach you what not to do.

## What belongs in a prompt file

- The prompt text itself
- The model and parameters it was tuned for
- A one-line description of its purpose
- Known limitations or failure modes
- A few example inputs/outputs if space allows

## Example structure

```
prompts/
  summarize-long-form-v1.prompt
  summarize-long-form-v2.prompt
  extract-action-items-v1.prompt
  classify-support-ticket-v3.prompt
```

## Regression testing

For critical prompts, create a test file with 5–10 representative inputs. After any prompt change, run the same inputs and compare outputs. Flag differences for human review.

This does not have to be automated at first. A manual diff is already better than nothing.

## Quick win

Move your most important production prompt into version control today. Commit it with a clear message. Future-you will thank present-you.
