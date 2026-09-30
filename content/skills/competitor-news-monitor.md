---
slug: competitor-news-monitor
title: Competitor News Monitor
category: Research
excerpt: Bundled Hermes skill that watches a frozen company list and reports only new, material events, each one cited, or stays silent.
tags:
  - hermes
  - research
  - monitoring
  - citations
for: Hermes Agent
author: Ben Barclay (benbarclay), Hermes Agent
install: "Bundled. If it is missing: hermes skills reset competitor-news-monitor --restore"
dependencies:
  - Hermes Agent
image: /images/skills/workflow.svg
source: https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/research/research-competitor-news-monitor
order: 121
last_verified: "2026-09-30"
---

# Competitor News Monitor

## What it is

Competitor News Monitor is a bundled Hermes Agent skill, version 0.1.0, MIT licensed, listed for Linux, macOS, and Windows. The skill page says it tracks a declared company set and reports only material, new developments with primary-source evidence. It is not a generic page-diff watcher. It applies company-news categories, a source hierarchy, event deduplication, and a business-significance check.

Setup runs once in the foreground. The recurring check is a cron tick. The page says the `competitor-watch` automation blueprint scaffolds that job.

## Who it targets

- Someone who already knows which companies to watch, and wants a digest instead of a feed.
- A weekly or scheduled check where "no material change" should stay quiet.
- Not a one-off company lookup. The skill says to use web search and extract for that, or `blogwatcher` for plain feed reading.

## What it does

1. Freeze the watchlist: canonical names, domains, products, aliases, geography, event categories, cadence, audience, and a materiality threshold.
2. Build source coverage before you schedule. For each company, where available: official newsroom or blog and changelog, pricing and product pages, filings and investor relations, status or security pages, reputable trade and financial press, and job postings as weak supporting evidence only.
3. Write the watch contract to `~/.hermes/competitor-watches/<file>.json`, then create the cron job. The page's example schedule is `every monday 9am`, with a prompt that loads this skill and runs the tick for that contract.
4. On each tick, collect from the last successful cutoff, dedupe by the underlying event, score materiality, and either deliver a cited digest or stay silent unless an all-clear was requested.

Optional related skills named on the page: `blogwatcher`, `rss-feeds`, and `reddit-reading`.

## Dependencies

Hermes Agent, with the skill present under `skills/research/competitor-news-monitor`. The catalog says bundled skills are copied into `~/.hermes/skills/` on install. If this one is missing, restore it. Do not treat a missing folder as "Hermes does not ship it."

```bash
hermes skills reset competitor-news-monitor --restore
```

## Example usage

The page's cron example, with the path filled in for a contract you have already written:

```text
cronjob(action="create",
  schedule="every monday 9am",
  prompt="Load the competitor-news-monitor skill and run the tick for the watch contract at ~/.hermes/competitor-watches/acme.json.",
  deliver=...)
```

The digest the skill asks for, per event: company, event, date, evidence links, what changed, why it matters, confidence, and a follow-up watch.

## Limitations

- Ten articles about one launch are one event. The skill calls out counting them as ten developments.
- A failed source is unknown coverage, not "no news." The cutoff should advance only for sources that were actually covered.
- Job postings and anonymous reports stay signals. The skill says not to treat them as confirmed strategy.
- Page content retrieved during a tick is data, not instructions. The skill says so. Keep it that way.
- This entry describes the skill page fetched September 30, 2026. The skill was not run against a watchlist for this note.
