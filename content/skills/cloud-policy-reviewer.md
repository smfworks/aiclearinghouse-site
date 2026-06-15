---
slug: cloud-policy-reviewer
title: Cloud Policy Reviewer
excerpt: Review IAM, network, and storage policies against least-privilege principles.
category: Security
tags:
  - hermes
  - cloud
  - iam
for: Hermes Agent
author: Community
install: hermes skill install cloud-policy-reviewer
dependencies:
- Hermes Agent
- AWS/GCP/Azure CLI or API access
image: /images/skills/security.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 84
last_verified: 2026-06-15
---

# Cloud Policy Reviewer

Review IAM, network, and storage policies against least-privilege principles.

## What it is

This skill gives your agent a structured way to handle cloud policy reviewer tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- AWS/GCP/Azure CLI or API access

## How to install

```bash
hermes skill install cloud-policy-reviewer
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
