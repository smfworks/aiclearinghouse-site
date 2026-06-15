---
slug: obsidian-research-sync
title: Obsidian Research Sync
excerpt: Push research summaries, links, and notes directly into an Obsidian vault.
category: Research
tags:
  - hermes
  - obsidian
  - notes
  - knowledge-management
for: Hermes Agent
author: Community
install: hermes skill install obsidian-research-sync
dependencies:
  - Hermes Agent
  - Obsidian vault with accessible directory
  - Optional - Obsidian Web Clipper or Templater plugin
image: /images/skills/research.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 11
last_verified: 2026-06-15
---

# Obsidian Research Sync

This skill turns your agent into a research assistant that writes structured notes into your Obsidian vault. It can capture article summaries, extracted quotes, tags, and source links in Markdown-ready format.

## What it is

A bridge between your agent's web research and your personal knowledge base. The skill formats findings as Obsidian notes with frontmatter, wikilinks, and tags so they slot cleanly into your existing graph.

## Who it targets

- Researchers, writers, and engineers who manage a second brain in Obsidian.
- Teams that want automated literature reviews or competitor tracking.
- Anyone tired of copy-pasting URLs into notes.

## Dependencies

- Hermes Agent
- Obsidian vault directory accessible from the agent host
- Optional - Templater plugin for custom note layouts

## How to install

```bash
hermes skill install obsidian-research-sync
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
