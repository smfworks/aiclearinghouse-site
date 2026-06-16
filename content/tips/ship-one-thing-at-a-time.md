---
slug: ship-one-thing-at-a-time
title: Ship One Thing at a Time
category: Workflow
excerpt: "Agents can produce a lot of output quickly. Resist the urge to batch everything into one giant change."
tags:
  - workflow
  - shipping
  - beginner
order: 8
last_verified: 2026-06-16
---

# Ship One Thing at a Time

## The temptation

An agent can write tests, refactor code, update docs, and add logging in a single session. The natural urge is to ask it to do all of that at once. Resist.

## Why one thing wins

A single, focused change is:
- Easier to review
- Easier to test
- Easier to roll back
- Easier to explain in a commit message
- Less likely to introduce subtle bugs

A giant change is the opposite in every dimension. It also exhausts context windows and increases token costs.

## The pattern

1. **Define one outcome.** "Add input validation to the signup form." Not "improve the signup flow."
2. **Let the agent do that one thing.**
3. **Review, test, and commit.**
4. **Move to the next thing.**

This feels slower at first. It is faster in total because you spend less time debugging mixed changes.

## Batching is not evil

There are times to batch: related micro-fixes, formatting, renaming. But batch intentionally, not by default.

## Warning signs

- The commit message has more than one "and"
- The diff touches more than three files for a "small" task
- You cannot revert one part without reverting another
- The agent's summary is longer than the code change

## Quick win

Take your next agent task and split it into two prompts. Run the first, commit, then run the second. Notice how much cleaner the review feels.
