---
slug: review-every-diff
title: Review Every Diff
category: Quality
excerpt: Autonomous agents are fast, not infallible. Always review changes before merging.
tags:
  - code-review
  - safety
  - quality
order: 2
last_verified: 2026-06-15
---

# Review Every Diff

## The principle

An agent can generate a thousand lines of plausible code in minutes. Plausible is not correct. Every diff deserves human review, no matter how confident the agent sounded.

## Why it matters

Agents excel at pattern matching and synthesis. They are weaker at implicit requirements, business logic, and long-term consequences. A diff that looks right can still break edge cases, delete error handling, or introduce subtle security issues.

## How to apply it

1. **Never auto-merge.** Require a human approval step for every agent branch.
2. **Read the diff, not the summary.** Agent summaries often gloss over important details.
3. **Check the tests.** Did the agent add tests? Did it remove any? Did existing tests still pass?
4. **Look for scope creep.** Did the agent change files outside the requested task?
5. **Run it locally.** CI is good; running the changed code yourself is better.

## Red flags

- The diff is larger than you expected.
- The agent renamed things you did not ask it to rename.
- Tests were modified or deleted without explanation.
- The summary says "no functional changes" but files outside the target area were touched.

## Quick win

Before approving any agent PR, ask: "What is the smallest thing that could break because of this change?" Find that thing and verify it.
