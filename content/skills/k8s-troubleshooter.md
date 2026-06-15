---
slug: k8s-troubleshooter
title: Kubernetes Troubleshooter
excerpt: Diagnose pod crashes, resource pressure, and networking issues.
category: DevOps
tags:
  - hermes
  - kubernetes
  - devops
for: Hermes Agent
author: Community
install: hermes skill install k8s-troubleshooter
dependencies:
- Hermes Agent
- kubectl access to cluster
image: /images/skills/devops.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 61
last_verified: 2026-06-15
---

# Kubernetes Troubleshooter

Diagnose pod crashes, resource pressure, and networking issues.

## What it is

This skill gives your agent a structured way to handle kubernetes troubleshooter tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- kubectl access to cluster

## How to install

```bash
hermes skill install k8s-troubleshooter
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
