---
slug: aider
title: Aider
excerpt: Terminal-native AI pair programming that treats git as a first-class citizen. Best for engineers who prefer the command line and want clean, reviewable commits.
category: Open Source
tags:
  - coding
  - terminal
  - open-source
website: https://aider.chat
repository: https://github.com/Aider-AI/aider
categories:
  - Coding
  - Terminal
  - Open Source
pricing: Open Source
runtime: Local
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - CLI
features:
  - Git-native editing workflow
  - Multi-file edits
  - Supports many LLM providers
  - Voice coding support
  - Architect and editor model modes
releaseYear: 2023
company: Aider AI
last_verified: 2026-06-14
---

## When to choose Aider

Use Aider when your workflow is already terminal-centric and you want an agent that respects git hygiene. Aider is the strongest open-source option for engineers who review diffs before shipping.

## What it does well

- **Git-native workflow.** Every edit becomes a commit or a proposed diff. You can review, revert, or amend exactly like any other contribution. This makes Aider unusually safe for production codebases.
- **Architect / editor split.** Ask a reasoning model like Claude Opus to design a change, then have a fast coding model like Qwen Coder implement it. This two-model pattern improves both design quality and token cost.
- **Voice mode.** Aider is one of the few agents that lets you dictate code changes from the terminal without reaching for the keyboard.
- **Broad provider support.** Works with OpenAI, Anthropic, Google, OpenRouter, local Ollama, and many others.

## Honest limitations

- **Terminal-only.** If you want a visual IDE integration, Aider is not it. It lives in your shell.
- **Requires repo discipline.** Aider assumes you have a clean git state and meaningful context. In a messy repo, it can propose changes against the wrong baseline.
- **No built-in browser or GUI testing.** It edits and runs shell commands. Verification beyond unit tests is up to you.

## Best fit

Senior engineers, DevOps, and backend developers who want AI assistance without leaving the terminal or polluting their git history.
