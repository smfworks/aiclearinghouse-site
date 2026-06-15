---
slug: start-small
title: Start Small
category: Workflow
excerpt: Give your agent one focused task before asking it to refactor an entire codebase.
tags:
  - beginner
  - workflow
  - productivity
order: 1
last_verified: 2026-06-15
---

# Start Small

## The principle

Agents do best with a narrow, well-defined task. Asking one to "improve the codebase" is like asking a new hire to redesign the company: they will change too much, too fast, with too little context.

## Why it matters

Large, vague prompts produce large, vague results. The agent may touch dozens of files, introduce subtle regressions, and exhaust your context window before finishing. Small tasks keep diffs reviewable, costs predictable, and failures recoverable.

## How to apply it

1. **Pick one file or one function.** Not one feature, one *unit*.
2. **Define done.** "Add input validation to `createUser`" is better than "make the user form more robust."
3. **Run it once.** Approve or roll back before expanding scope.
4. **Stack wins.** Three completed small tasks teach you more about the agent than one abandoned big one.

## Red flags

- The prompt is longer than a paragraph.
- The agent touches files you did not expect.
- You cannot explain what changed in one sentence.
- The task spans multiple domains (UI, API, tests, docs) at once.

## Quick win

Open any existing file and ask the agent to add one specific thing: a docstring, a validation check, or a single unit test. Review that diff before asking for anything else.
