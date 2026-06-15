---
slug: terraform-refactor-helper
title: Terraform Refactor Helper
excerpt: Plan refactors, detect drift, and explain Terraform changes.
category: DevOps
tags:
  - hermes
  - terraform
  - iac
for: Hermes Agent
author: Community
install: hermes skill install terraform-refactor-helper
dependencies:
- Hermes Agent
- Terraform workspace
image: /images/skills/devops.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 62
last_verified: 2026-06-15
---

# Terraform Refactor Helper

Plan refactors, detect drift, and explain Terraform changes.

## What it is

This skill gives your agent a structured way to handle terraform refactor helper tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Terraform workspace

## How to install

```bash
hermes skill install terraform-refactor-helper
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
