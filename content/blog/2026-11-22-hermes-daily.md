---
slug: "2026-11-22-hermes-daily"
title: "A Hundred Plugins in Three Days: Inside the Hermes Catalog's Busiest Weekend"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
date: "2026-11-22"
excerpt: "The Hermes plugin catalog absorbed roughly a hundred new entries over three days, every one pinned to a reviewed commit. Here is how the review pipeline works, what arrived, and how to pick your first install."
categories: ["AI Agents", "Open Source"]
tags: ["hermes-agent", "plugin-catalog", "nous-research", "open-source", "review-pipeline"]
readTime: 11
image: "/images/blog/2026-11-22-hermes-daily.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-22-hermes-daily"
---

**By Pamela Flannery, The Signal**

Every agent framework wants an app store. Most of them get a directory: a page of links, a star count, a shrug. Hermes Agent got something more interesting this weekend — a review pipeline running at a pace I have not seen anywhere else in open source, and a catalog that grew by roughly a hundred entries in about three days.

## The number first

The official plugin catalog page currently lists **570 plugins**. Tallying the tiers on that page — official, verified, and community — I counted 21 official entries, 13 verified, and the remaining ~536 community. The catalog is curated and human-reviewed: every entry is pinned to a specific commit of its source repository, with the full description, declared tools, hooks, and environment variables published on the entry's own page ([Plugin Catalog docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugin-catalog), and the browsable shelf at [/docs/plugins](https://hermes-agent.nousresearch.com/docs/plugins)).

That 570 was not the number last week. Pulling the hermes-agent commit history from the GitHub API for November 19–22, I count about **100 commits whose subject line adds a new plugin to the catalog** — new entries alone, not the follow-up bumps and re-pins, which roughly double that total. Names arriving in that window include **seltz, valetudo, katara (memory provider), beeper-platform, utcp-bridge, tmux-watch, quick-prompts, slack-history, commons, stats (a Hermes Stats dashboard), pstack-hermes, hermes-island, and an Obsidian plugin**, plus dozens more. The catalog now grows the way a busy package registry grows — daily, in waves, by dozens.

| Window | New catalog entries (subject-line count) | Also landed |
|---|---|---|
| Nov 19 | ~35 | Obsidian 1.2.1, note-stash, klieg, fish-audio update |
| Nov 20 | ~30 | commons 0.2.0→0.2.1, tmux-watch, aisecuritywarden (secret source) |
| Nov 21–22 | ~35 | katara, beeper-platform, pstack-hermes, stats, dead-drop |
| **Total** | **~100 new entries** | plus ~50 pin bumps / re-pins after review |

*(Counted from the GitHub commits API, `since=2026-11-19T09:00Z`, matched on `feat(plugin-catalog)` / `catalog: add` / `plugin-catalog:` subjects, 2026-11-22. Subject lines undercount if a PR bundles several plugins; treat the total as ~100, not a certified integer.)*

## The two-click review you never see

Here is the part worth understanding, because it is the actual product. A community plugin does not just appear. The pattern in the commit log is consistent:

1. A contributor opens the catalog entry — description, declared capabilities, source repo.
2. A maintainer (in this window, mostly **teknium1**) lands a `chore(catalog): review disclosure for <name>` commit — a recorded review disclosure on the entry.
3. The self-updater's allowlist gate gets an explicit allowance for the plugin's build scripts — `chore(ci): allow X through the catalog self-updater gate`.
4. The entry goes live **pinned to a specific commit**, so what you install is the reviewed revision, not whatever is on the repo's main branch today.

That is also why some entries re-pin days later — `rollstack` went in at 1.3.3 on the 18th and was **re-pinned to 1.3.6 on the 19th with a note that a server was declared untrusted**. The pin system is the safety mechanism doing its job in public. The docs are explicit about the trust model: catalog review covers metadata and declared capabilities at admission — it is **not a code audit** — and installs still run through Hermes's normal consent flow, with plugins disabled by default ([plugins docs](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/plugins.md)).

## What actually arrived

Scanning the wave, a few clusters stand out:

- **Memory keeps compounding.** katara joined a memory shelf that already had mem0, Hindsight, OpenViking, Cognee, and Honcho — the catalog's memory category is the deepest bench in the whole directory, which tracks with how central persistent memory is to how Hermes works.
- **Desktop and platform bridges.** beeper-platform, pstack-hermes, hermes-island, PipoPapo — the gateway's 21+ platform list keeps getting extended from the outside in, by people who needed one specific bridge and shipped it.
- **Developer ergonomics.** tmux-watch (watch your terminal sessions), quick-prompts, note-stash, stats (a usage dashboard for the agent itself), iteration-budget (wrap-up guidance when a run hits its limits).
- **Specialist verticals.** jetson-reboot-monitor, unifi, valetudo (vacuum robots), babelii-diofis, chinavisacalc — the long tail that only exists because someone with that exact problem had a place to publish the fix.

There were also two small fixes this window that regular users will feel rather than read about: a gateway fix so that a fenced code block that *opens* with the silence marker is treated as content rather than silence, and a cron fix so a damaged `[SILENT]` token can no longer leak into a chat. Both are exactly the kind of edge cases that only get fixed when a platform is being exercised hard at scale.

## How to pick your first install

If you have never installed a catalog plugin, the workflow is three commands and two minutes:

```bash
hermes plugins search memory        # search names, descriptions, declared tools
hermes plugins install katara       # installs the reviewed, pinned commit
hermes plugins enable katara        # enabling is an explicit step, by design
```

Browse visually at the [catalog shelf](https://hermes-agent.nousresearch.com/docs/plugins) — entries are grouped by category with tier filters and copyable install commands. Before enabling anything, do what the docs tell you to do anyway: open the entry page, read the disclosure, glance at the pinned source. Catalog review is provenance, not a guarantee the plugin suits your machine.

## What this means for you

The catalog is the answer to the question every agent user eventually asks: *my agent is smart, but who else has hit this problem?* With 570 pinned entries and a hundred more landing per week, the expected experience is shifting from "find a GitHub repo and hope" to "search, install by name, and read one page." If you run Hermes for real work, the highest-leverage habit this month is simply checking `hermes plugins update` — the updater re-pins catalog installs to newly reviewed revisions and tells you exactly what it skipped and why.

## Outlook

Two things to watch. First, whether the review pipeline can sustain this pace without the disclosure step becoming a bottleneck — the commit log shows it keeping up so far, with same-day review disclosures on most entries. Second, Hermes Business and the Microsoft Teams/Azure enterprise push (announced November 18) put this same catalog in front of procurement departments; expect tier filters and the official/verified shelves to matter much more there. The community tier is where the weekend's energy lives, but the verified tier is where the enterprise wave will land.

*Sources opened for this post: the [plugin catalog docs page](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugin-catalog), the [browsable catalog](https://hermes-agent.nousresearch.com/docs/plugins) (570 entries; tier counts tallied from the page), the [plugins feature docs on GitHub](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/plugins.md), and the [hermes-agent commit history via the GitHub API](https://api.github.com/repos/NousResearch/hermes-agent/commits?since=2026-11-19T09:00:00Z&per_page=100), November 19–22, 2026. Tier and entry counts are point-in-time reads from this morning.*
