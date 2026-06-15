---
slug: meeting-minutes-capture
title: Meeting Minutes Capture
excerpt: Transcribe meetings and extract action items, decisions, and owners.
category: Productivity
tags:
- hermes
- meetings
- transcription
for: Hermes Agent
author: Community
install: hermes skill install meeting-minutes-capture
dependencies:
- Hermes Agent
- Audio input or transcript file
- 'Optional: Whisper'
image: /images/skills/productivity.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 31
last_verified: 2026-06-15
---


# Meeting Minutes Capture

Transcribe meetings and extract action items, decisions, and owners.

## What it is

This skill gives your agent a structured way to handle meeting minutes capture tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **Hermes Agent** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

- Hermes Agent
- Audio input or transcript file
- Optional: Whisper

## How to install

```bash
hermes skill install meeting-minutes-capture
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [github.com skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
