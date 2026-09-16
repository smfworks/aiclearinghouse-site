---
slug: defuddle-web-cleaner
title: Defuddle
category: Tooling
excerpt: Extract clean, token-efficient markdown from any web page before your agent reads it. Strips navigation, ads, and boilerplate. From kepano/obsidian-skills.
tags:
  - hermes
  - web
  - markdown
  - tokens
  - defuddle
  - obsidian
for: Hermes Agent
author: Community
install: npx skills add kepano/obsidian-skills --skill defuddle
dependencies:
  - Hermes Agent
  - Node.js 18+
  - npm (global install of defuddle CLI)
image: /images/skills/tooling.svg
source: https://github.com/kepano/obsidian-skills
order: 120
last_verified: "2026-09-16"
---

# Defuddle

## What it does

Defuddle extracts the main content from a web page and returns it as clean markdown — no navigation bars, no sidebars, no cookie banners, no ad slots, no footer links. Just the article, documentation, or blog post your agent actually needs to read.

The skill wraps the Defuddle CLI (created by kepano for the Obsidian Web Clipper) and teaches Hermes Agent when and how to use it. The SKILL.md instructs the agent to prefer Defuddle over raw WebFetch for standard web pages, with one explicit exception: URLs ending in `.md` are already markdown, so WebFetch is used directly.

## Why it matters

Every token your agent reads from a web page costs context window space and, on hosted models, money. A typical blog post rendered as raw HTML contains 60-80% boilerplate — navigation, scripts, styling artifacts, comment sections, related-post widgets. Defuddle strips that down to the actual content, typically reducing token count by 3-5x.

For agents that read multiple web pages per task (research, documentation lookup, competitive analysis), this is the difference between fitting in context and blowing the window. It is also the difference between a $0.03 web fetch and a $0.15 web fetch on per-token pricing.

## Who it targets

- Any Hermes agent workflow that reads web pages for research, documentation, or content analysis
- Agents hitting context window limits because raw HTML is bloating the prompt
- Teams running per-token priced models where web page boilerplate is a measurable cost line
- Anyone who has watched an agent "read" a web page and then hallucinate content from the sidebar links instead of the article body

## Dependencies

- Hermes Agent (v0.18.0 or later)
- Node.js 18+
- Defuddle CLI: install globally with `npm install -g defuddle`

## How to install

```shell
npx skills add kepano/obsidian-skills --skill defuddle
```

Or clone the full obsidian-skills repository and point Hermes at the defuddle skill directory:

```shell
git clone https://github.com/kepano/obsidian-skills ~/.hermes/skills/obsidian-skills
```

If the Defuddle CLI is not installed, the skill instructs the agent to run `npm install -g defuddle` on first use.

## Example usage

Ask the agent to read and summarize a web page:

```
Read https://example.com/long-article and give me a 3-bullet summary of the key points.
```

The agent will use Defuddle to extract clean markdown from the page before reading it, reducing token consumption and improving summary quality by removing boilerplate noise.

Direct CLI usage:

```shell
defuddle parse https://example.com/long-article --md
defuddle parse https://example.com/long-article --md -o content.md
defuddle parse https://example.com/long-article -p title
```

Output formats: `--md` for markdown (recommended), `--json` for JSON with both HTML and markdown, no flag for raw HTML, `-p <property>` for specific metadata (title, description, domain).

## Source

Part of [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills), a collection of Hermes Agent skills from the Obsidian ecosystem. 20.6K stars on the underlying Defuddle repository. The skill is community-maintained and works with any agent that supports the SKILL.md format.