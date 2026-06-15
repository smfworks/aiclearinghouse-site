---
slug: test-driven-sweeper
title: Test-Driven Sweeper
excerpt: Generate unit tests from existing code, then iterate until tests pass.
category: Coding
tags:
- hermes
- testing
- code-generation
for: Hermes Agent
author: Community
install: hermes skill install test-driven-sweeper
dependencies:
- Hermes Agent
- Project with test runner
- 'Optional: coverage tool'
image: /images/skills/coding.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 21
last_verified: 2026-06-15
---


# Test-Driven Sweeper

Generate unit tests from existing code, then iterate until tests pass.

## What it is

This skill gives your agent a structured way to handle test-driven sweeper tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Project with test runner
- Optional: coverage tool

## How to install

```bash
hermes skill install test-driven-sweeper
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
