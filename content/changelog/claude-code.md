---
slug: claude-code
title: Claude Code
excerpt: Recent updates to Anthropic's terminal coding agent.
category: Agent
tags:
  - Claude Code
  - Anthropic
  - agent
  - changelog
last_updated: 2026-06-14
last_verified: 2026-06-15
---

# Claude Code Changelog

## 2026-06

### Context and reliability
- **Larger context windows.** Claude Code now supports extended context for long files and multi-file sessions, reducing the need to manually chunk code into prompts.
- **Checkpoint rollback.** You can save checkpoints mid-task and roll back to a previous state if the agent goes off track.
- **CI integration previews.** Bash commands now show a preview before execution, making it easier to catch dangerous operations before they run.

## 2026-05

### General availability
- Claude Code moved out of limited preview and is now available to Claude Pro and Team subscribers.
- New `/cost` command estimates token spend before long agent runs.
- Improved diff rendering for multi-file edits.

## What this means for users

If you are using Claude Code for production work, the checkpoint and preview features are the big wins. They reduce the risk of unrecoverable agent mistakes. The cost command is also essential for teams sharing an API budget.

## What to watch

Anthropic tends to release model improvements quietly. Keep an eye on the [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code/overview) for changes to the planning loop and tool-calling behavior.
