---
slug: review-every-diff
title: Review Every Diff
category: Quality
excerpt: "Agents are fast, not infallible. The 30 seconds you spend reviewing a diff saves hours of debugging later."
tags:
  - code-review
  - quality
  - safety
order: 4
last_verified: 2026-06-16
---

# Review Every Diff

## The rule

Never commit agent output blindly. Even when the agent has been reliable, even when you are in a hurry, even when the change looks trivial — review the diff.

## Why it matters

Agents optimize for plausible-looking output, not correctness. They will:
- Rename variables to synonyms that subtly break logic
- Remove comments you wanted to keep
- Add dependencies you did not ask for
- Change formatting in files outside the scope
- Introduce off-by-one errors, race conditions, or security issues

Your review is the safety net. Skip it once and you teach yourself bad habits.

## What to look for

1. **Scope creep.** Did the agent touch files it should not have?
2. **Logic changes.** Is the behavior actually what you asked for?
3. **Dependencies.** Did it add packages, imports, or services?
4. **Tests.** Did it add, update, or remove tests? Are they meaningful?
5. **Security.** Are secrets, permissions, or auth handled correctly?
6. **Style.** Does the output match your team's conventions?

## How to make it fast

- Use small diffs. Small tasks produce small diffs that are quick to review.
- Set up pre-commit hooks for formatting and linting.
- Run tests before reviewing so you review against a known baseline.
- Ask the agent to summarize its own diff in the response.

## The exception that is not an exception

Some teams say, "I trust this agent for formatting only." But formatting-only prompts still produce diffs. Still review them. One bad formatter run can destroy a file you care about.

## Build the habit

Review the diff before you run tests, not after. Tests can pass on subtly wrong code. Your judgment is the final check.
