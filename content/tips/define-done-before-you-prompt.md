---
slug: define-done-before-you-prompt
title: Define Done Before You Prompt
category: Workflow
excerpt: Agents iterate forever unless you give them a clear finish line.
tags:
  - agents
  - prompting
  - workflow
  - planning
order: 5
last_verified: 2026-06-15
---

# Define Done Before You Prompt

## The principle

Agents iterate forever unless you give them a clear finish line. Define what "done" looks like before you send the prompt.

## Why it matters

Vague goals produce vague results. An agent told to "refactor the auth module" might move files around indefinitely. An agent told to "extract password validation into `validatePassword.ts` and add three unit tests covering empty, short, and mismatch inputs" knows exactly when to stop.

## How to apply it

1. **State the deliverable.** One artifact, one file, one function.
2. **List acceptance criteria.** Use "must" language. "The function must reject passwords shorter than 8 characters."
3. **Provide examples.** Show input/output pairs or reference existing code.
4. **Mention non-goals.** "Do not change the login UI." This prevents scope creep.
5. **Ask for a plan first.** For complex tasks, have the agent outline steps before executing.

## Red flags

- The prompt ends with "make it better."
- You cannot write a one-sentence definition of success.
- The agent keeps asking clarifying questions.
- The task description changes mid-run.

## Quick win

Before your next prompt, write: "Done means..." and finish the sentence. If you can't, break the task down further.
