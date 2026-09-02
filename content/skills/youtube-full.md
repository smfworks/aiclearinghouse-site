---
slug: youtube-full
title: YouTube Full
category: Media
excerpt: Get YouTube transcripts, search videos, browse channels, and extract playlists from any Hermes agent — a community skill for video research workflows.
tags:
  - hermes
  - youtube
  - transcripts
  - media
  - research
for: Hermes Agent
author: ZeroPointRepo
install: hermes skills install skills-sh/ZeroPointRepo/youtube-skills/skills/youtube-full
dependencies:
  - Hermes Agent
  - Python 3.11+
image: /images/skills/media.svg
source: https://github.com/ZeroPointRepo/awesome-hermes-skills
order: 99
last_verified: "2026-09-02"
---

# YouTube Full

## What it does

The `youtube-full` community skill gives Hermes agents the ability to retrieve YouTube transcripts, search for videos, browse channel contents, and extract playlists. It bridges the gap between video content and agent workflows, enabling research, summarization, and content analysis pipelines that reference video sources.

## Why it matters

Video is one of the largest sources of technical content, tutorials, conference talks, and product demos. Without a transcript extraction skill, agents cannot process video content. This skill makes YouTube a first-class data source for research agents, content curators, and knowledge management workflows.

## Key capabilities

- **Transcript retrieval:** Pull full transcripts from any YouTube video with captions.
- **Video search:** Search YouTube for videos matching a query, with results formatted for agent consumption.
- **Channel browsing:** List videos from a channel, enabling systematic content audits.
- **Playlist extraction:** Extract video lists from playlists for batch processing.

## Who it targets

- Research agents that need to synthesize information from video sources.
- Content curators building knowledge bases from conference talks and tutorials.
- Marketing agents monitoring competitor video content.
- Any Hermes workflow that benefits from video transcript data.

## Installation

```shell
hermes skills install skills-sh/ZeroPointRepo/youtube-skills/skills/youtube-full
```

## Dependencies

- Hermes Agent (v0.20.0 or later recommended)
- Python 3.11+
- Internet access for YouTube API calls

## Source

Listed in the [awesome-hermes-skills](https://github.com/ZeroPointRepo/awesome-hermes-skills) community catalog as the featured skill.