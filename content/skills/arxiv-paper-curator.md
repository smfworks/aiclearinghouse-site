---
slug: arxiv-paper-curator
title: arXiv Paper Curator
excerpt: Monitor arXiv categories, summarize abstracts, and surface papers worth reading.
category: Research
tags:
  - hermes
  - arxiv
  - papers
  - research
for: Hermes Agent
author: Community
install: hermes skill install arxiv-paper-curator
dependencies:
  - Hermes Agent
  - arXiv API access (no key required)
  - Optional - Zotero or Obsidian for storage
image: /images/skills/research.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 12
last_verified: 2026-06-15
---

# arXiv Paper Curator

Stay on top of academic releases without drowning in abstracts. This skill queries arXiv categories of interest, scores abstracts against your research keywords, and delivers a ranked digest with one-line takeaways.

## What it is

A research radar that runs on a schedule. It fetches the latest papers from selected arXiv categories, filters by keyword relevance, summarizes abstracts, and exports the results to a note or chat message.

## Who it targets

- ML researchers and engineers tracking new model releases.
- Students doing literature reviews.
- Technologists monitoring adjacent fields.

## Dependencies

- Hermes Agent
- arXiv API access (key-free)
- Optional - Zotero or Obsidian for long-term curation

## How to install

```bash
hermes skill install arxiv-paper-curator
```

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
