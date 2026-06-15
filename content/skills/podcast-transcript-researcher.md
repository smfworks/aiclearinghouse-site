---
slug: podcast-transcript-researcher
title: Podcast Transcript Researcher
excerpt: Fetch podcast transcripts, identify key claims, and cross-check them with web sources.
category: Research
tags:
  - hermes
  - podcast
  - transcript
  - fact-checking
for: Hermes Agent
author: Community
install: hermes skill install podcast-transcript-researcher
dependencies:
  - Hermes Agent
  - Podcast feed URL or transcript source
  - Optional - Whisper and ffmpeg for audio transcription
image: /images/skills/research.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 14
last_verified: 2026-06-15
---

# Podcast Transcript Researcher

Turn spoken content into searchable, verifiable research. This skill ingests podcast transcripts, extracts claims and named entities, and optionally cross-checks them against web sources.

## What it is

A research skill for long-form audio. It parses transcripts, breaks them into segments, identifies claims, and produces a structured summary with links to supporting or contradicting sources.

## Who it targets

- Researchers who cite podcasts.
- Journalists fact-checking interviews.
- Investors digesting founder podcasts.

## Dependencies

- Hermes Agent
- Podcast RSS feed or transcript file
- Optional - ffmpeg + Whisper for audio-to-text

## How to install

```bash
hermes skill install podcast-transcript-researcher
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
