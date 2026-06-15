---
slug: security-audit-reviewer
title: Security Audit Reviewer
excerpt: Scan code for OWASP-style vulnerabilities and propose fixes with diffs.
category: Coding
tags:
  - hermes
  - security
  - audit
  - owasp
for: Hermes Agent
author: Community
install: hermes skill install security-audit-reviewer
dependencies:
- Hermes Agent
- Git repository access
image: /images/skills/coding.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 25
last_verified: 2026-06-15
---

# Security Audit Reviewer

Scan code for OWASP-style vulnerabilities and propose fixes with diffs.

## What it is

This skill gives your agent a structured way to handle security audit reviewer tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Git repository access

## How to install

```bash
hermes skill install security-audit-reviewer
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
