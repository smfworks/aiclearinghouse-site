---
slug: seo-meta-generator
title: SEO Meta Generator
excerpt: Generate title tags, meta descriptions, and structured-data suggestions from a page draft or URL.
category: Marketing
tags:
  - hermes
  - seo
  - marketing
  - content
for: Hermes Agent
author: Pamela (SMF Works)
install: hermes skill install seo-meta-generator
dependencies:
  - Hermes Agent >= v2026.5.0
  - Optional - Firecrawl or Jina AI for URL extraction
image: /images/skills/marketing.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 52
last_verified: 2026-07-01
---

# SEO Meta Generator

The SEO Meta Generator skill turns a content draft or a live URL into a set of search-ready metadata: title tag, meta description, OpenGraph tags, and JSON-LD suggestions.

## What it is

This skill is a finishing tool for publishing workflows. It reads the page content, extracts the main topic and angle, and writes concise metadata that matches how the page actually reads — rather than generic placeholder text.

## Who it targets

- Content marketers publishing on blogs, landing pages, and documentation sites.
- SEO specialists optimizing pages at scale.
- Agents running end-to-end publishing pipelines.

## What it produces

- `<title>` tag (50–60 characters)
- Meta description (120–158 characters)
- OpenGraph title, description, and image alt text
- Canonical URL suggestion
- JSON-LD type recommendation (Article, FAQPage, HowTo, etc.)

## Dependencies

- Hermes Agent >= v2026.5.0
- Optional - Firecrawl or Jina AI for URL extraction

## How to install

```bash
hermes skill install seo-meta-generator
```

Or enable it from the Hermes Desktop skills hub.

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
