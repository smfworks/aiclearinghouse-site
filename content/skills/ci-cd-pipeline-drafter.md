---
slug: ci-cd-pipeline-drafter
title: CI/CD Pipeline Drafter
excerpt: Generate GitHub Actions, GitLab CI, or Azure Pipelines from project structure.
category: DevOps
tags:
  - hermes
  - ci-cd
  - pipelines
for: Hermes Agent
author: Community
install: hermes skill install ci-cd-pipeline-drafter
dependencies:
- Hermes Agent
- Git repository access
image: /images/skills/devops.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 64
last_verified: 2026-06-15
---

# CI/CD Pipeline Drafter

Generate GitHub Actions, GitLab CI, or Azure Pipelines from project structure.

## What it is

This skill gives your agent a structured way to handle ci/cd pipeline drafter tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Git repository access

## How to install

```bash
hermes skill install ci-cd-pipeline-drafter
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
