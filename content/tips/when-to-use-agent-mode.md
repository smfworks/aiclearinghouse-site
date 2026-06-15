---
slug: when-to-use-agent-mode
title: When to Use Agent Mode vs. Chat
excerpt: Agent mode is powerful but expensive and noisy. Know when to turn it on and when to stay in chat.
category: Tip
tags:
  - agent mode
  - chat
  - productivity
  - cost
  - workflow
last_verified: 2026-06-14
---

# When to Use Agent Mode vs. Chat

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

- Multi-file refactors
- Adding a feature that touches tests, docs, and config
- Debugging that requires running commands and reading logs
- Repetitive tasks you have already done manually once

## Cost and speed

Agent mode usually sends many more tokens than chat because it includes file context, tool results, and loop history. A single agent session can cost 10–50x more than a chat exchange.

| Mode | Tokens | Latency | Control |
|------|--------|---------|---------|
| Chat | Low | Seconds | High |
| Agent mode | High | Minutes | Lower |

## How to keep agent mode safe

1. Start with a narrow goal. "Add input validation to the signup form" is better than "fix the app."
2. Review every diff before applying.
3. Disable auto-approval for shell commands and file writes.
4. Run tests and linters after the agent finishes.
5. Keep a git checkpoint so you can revert.

## Verdict

Default to chat. Escalate to agent mode only when the task genuinely spans multiple files or requires iteration. Your tokens and your sanity will last longer.
