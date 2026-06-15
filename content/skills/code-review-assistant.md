---
slug: code-review-assistant
title: Code Review Assistant
excerpt: Review diffs for bugs, style issues, security risks, and missing tests.
category: Coding
tags:
  - hermes
  - code-review
  - git
  - quality
for: Hermes Agent
author: Community
install: hermes skill install code-review-assistant
dependencies:
  - Hermes Agent
  - Git repository access
  - Optional - GitHub or GitLab API token
image: /images/skills/coding.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 20
last_verified: 2026-06-15
---

# Code Review Assistant

This skill reads pull request diffs and produces structured code reviews. It flags potential bugs, performance issues, security concerns, style inconsistencies, and missing test coverage.

## What it is

A repeatable review workflow that can be triggered on demand or via webhook. The skill parses the diff, groups feedback by file, and formats comments so they can be pasted into GitHub, GitLab, or a chat channel.

## Who it targets

- Senior engineers doing high-volume reviews.
- Solo developers who want a second pair of eyes.
- Teams rolling out consistent review standards.

## Dependencies

- Hermes Agent
- Git repository access
- Optional - GitHub / GitLab API token for PR comments

## How to install

```bash
hermes skill install code-review-assistant
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
