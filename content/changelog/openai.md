---
slug: openai
title: OpenAI
excerpt: Recent updates to OpenAI models, APIs, and developer tools.
category: Model / API
tags:
  - OpenAI
  - GPT-4o
  - o3
  - o4-mini
  - Codex
  - Responses API
  - changelog
last_updated: 2026-06-18
last_verified: 2026-06-18
---

# OpenAI Changelog

## 2026-06

### Responses API adds image search
Web search through the Responses API can now return image results alongside text. This matters for agents that need to verify visual information — pricing cards, UI screenshots, product photos — without building a separate pipeline.

### GPT-4o and legacy ChatGPT models deprecated in ChatGPT
OpenAI deprecated GPT-4o and several older ChatGPT-only models on February 13, 2026. They remain available through the API, but teams relying on the ChatGPT app should confirm which model is actually serving their requests.

### Codex CLI and agentic coding
Codex CLI continues to roll out as OpenAI's terminal-native coding agent. It can plan, edit, run tests, and push to git. The big question for teams is whether it fits into existing review workflows or creates a parallel shadow development path.

## 2026-05

### o-series reasoning models
OpenAI expanded the o-series with o3 and o4-mini. These models spend more compute at inference time on hard reasoning tasks. They are useful for math, debugging, and multi-step planning, but they are slower and more expensive than standard GPT-4o-class models.

### Developer platform improvements
- Better token usage dashboards.
- Finer-grained API key scoping.
- Improved structured output reliability for JSON and function calling.

## What this means for users

If you are building agents on OpenAI, the Responses API is becoming the unified surface for chat, search, and tool use. It is worth evaluating whether to migrate from the older Chat Completions + Assistants pattern. For coding, Codex is a genuine competitor to Claude Code and Cursor agent mode, but tool-lock-in is real.

## What to watch

- Pricing changes for reasoning models as competition heats up.
- Whether Codex gets deeper IDE and CI integrations.
- OpenAI's long-term plan for the Assistants API versus Responses API.

Source: [OpenAI release notes](https://openai.com/products/release-notes/)
