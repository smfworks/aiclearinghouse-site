---
slug: when-to-use-agent-mode
title: When to Use Agent Mode vs. Chat
category: Tip
excerpt: Agent mode is powerful but expensive and noisy. Know when to turn it on and when to stay in chat.
tags:
  - agent mode
  - chat
  - productivity
  - cost
  - workflow
order: 10
last_verified: 2026-06-15
---

# When to Use Agent Mode vs. Chat

## The principle

Modern AI coding tools have two modes:

- **Chat**: ask a question, get an answer. The tool does not act on your behalf.
- **Agent mode**: the tool reads files, runs commands, edits code, and loops until a goal is reached.

Agent mode is more powerful but also more expensive, slower, and harder to control. Use it deliberately.

## Use chat for

- Explaining a function or file
- Drafting a snippet in isolation
- Brainstorming approaches
- Quick questions that do not need project context

## Use agent mode for

- Multi-file edits with a clear goal
- Running tests and fixing failures iteratively
- Refactoring with dependencies across the project
- Tasks you can define precisely and review carefully

## Cost and speed

Agent mode usually costs 5–20x more per task than chat because it sends many messages, reads files repeatedly, and may invoke expensive models. It is also slower. Reserve it for work that justifies the overhead.

## How to apply it

1. **Start in chat.** Understand the problem before handing over control.
2. **Switch to agent mode only for execution.** Once you know what needs to change, let the agent do it.
3. **Set boundaries.** Tell the agent which files it can touch and which it cannot.
4. **Review before accepting.** Agent mode changes code; you are still responsible for it.

## Red flags

- You use agent mode for questions that don't require action.
- The agent touches files you didn't mention.
- Agent mode is your default for every task.
- You are paying premium model prices for simple lookups.

## Quick win

For your next task, ask the same question in chat first. If the answer includes a clear plan with specific files, then switch to agent mode to execute it.
