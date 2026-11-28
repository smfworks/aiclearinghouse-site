---
slug: "2026-11-28-hermes-daily"
title: "338 PRs in Four Days: What Hermes Agent v0.23.5 Actually Changed"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
date: "2026-11-28"
excerpt: "Hermes Agent shipped v0.23.5 on Thanksgiving: 338 merged PRs, 1,262 commits, gateway chats that compact themselves while idle, a read_file that can tail and list, and a plugin preflight that fails fast before the gateway starts. Here's what changed and the two-minute check to run on your install."
categories: ["AI", "Open Source", "Developer Tools"]
tags: ["hermes-agent", "nous-research", "release-notes", "plugins", "gateway"]
readTime: 7
image: "/images/blog/2026-11-28-hermes-daily.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-28-hermes-daily"
---

**By Pamela Flannery, SMF Works**

Most teams were deep-frying turkeys on Thursday. The Hermes Agent team was merging pull requests. [v0.23.5](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.5) landed early Friday morning — the fourth patch release in ten days, rolling up about 338 merged PRs since v0.23.4 on November 23. The release notes call it a rollup tag, but the fine print in the "About this release" section is where it gets interesting: a handful of the "undocumented here on purpose" changes are quality-of-life features I've been waiting for.

If you run Hermes daily — CLI, desktop, or a gateway bot — here's what actually changed and what to do about it.

## The release cadence is the story

First, the numbers, straight from [the release page](https://github.com/NousResearch/hermes-agent/releases). Measured at commit `a428f5344f77`, the window since v0.23.4 contains 1,262 non-merge commits across 1,146 changed files, roughly 58,000 lines added, 338 merged PRs, and 92 closed issues.

| Release | Date | Window | Merged PRs |
|---|---|---|---|
| v0.23.2 | mid-November | — | — |
| [v0.23.3](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.3) | Nov 19 | since v0.23.2 | ~370 |
| [v0.23.4](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.4) | Nov 23 | 4 days | ~229 |
| [v0.23.5](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.5) | Nov 27 | 4 days | ~338 |

A canary build followed within hours of the stable tag this morning (`canary.20261128T064458Z-v0.23.5`), and today's commits already show the plugin catalog moving again — including QQ Bot graduating from core to an official catalog plugin. The release notes promise the full curated story for this whole stretch in v0.24.0, "nothing in this window is skipped."

What this cadence buys you: fixes land in days, not months. What it costs you: the patch notes are thin by design, so you have to know where to look. That's this post.

## Three changes that touch real work

**Idle gateway chats compact themselves.** Every route now gets background context compaction when a gateway chat goes idle. If you run Hermes on Telegram, Discord, or any of the gateway platforms and have watched a long-running session's context bar creep toward the ceiling, this is the fix: quiet chats tidy themselves up instead of waiting for you to hit the limit. Long-lived bots get meaningfully cheaper to run, because a compacted prompt is a smaller prompt on the next turn.

**read_file got two tricks I use constantly.** It now accepts a negative offset — `offset=-20` means "give me the last twenty lines," which is how you actually want to read a log file — and it can list directories. Small changes, big difference in agent workflows: an agent that wants to see the tail of a build log no longer needs a shell call, and one fewer tool hop per investigation means fewer ways to go down a rabbit hole.

**`search_files` says when it's done.** Content search now reports when the match list is the complete answer instead of a truncated page. That sounds like trivia until you've had an agent "confirm" a finding that wasn't there because it never knew the list was cut short. A tool that tells you the size of its own answer is a tool you can trust more.

## The quiet reliability push

The rest of the window is mostly infrastructure, and it's the kind that matters. Before the local gateway starts — Desktop, Docker, or CLI — a bounded preflight checks the default plugins, so a broken plugin fails fast at startup instead of half-working mid-session. Plugin OAuth entries can pin their redirect URI, which removes a class of callback headaches when you're wiring a platform bot to a non-default host. The Solstice provider moved to the stateless Interactions API. And there's a long series of fixes keeping plugin work bound to the right profile when a profile is renamed, moved, or removed — a pain point anyone who juggles multiple Hermes profiles will recognize instantly.

New plugin API surfaces round it out: a plugin can now ask where a turn originated, how its session was created, schedule cron work, and use gateway silence helpers. That's the extensibility story advancing in the background while most users watch the chat window.

## What this means for you

If you run Hermes Agent, do two things. First, update: `hermes update` on the CLI, the Store handles the Windows app, and Docker/Hermes Cloud pull from `nousresearch/hermes-agent:stable`. Second, spot-check what you rely on. One honest caveat on this release: patch tags like this are rollups, and the curated notes don't arrive until v0.24.0, so the onus is on you to skim the [v0.23.4...v0.23.5 diff](https://github.com/NousResearch/hermes-agent/compare/v0.23.4...v0.23.5) if you use any of the touched surfaces — gateway routes, plugin OAuth, or custom profiles.

A quick health check after updating:

```bash
hermes doctor                      # environment + config sanity
hermes chat -q "List this directory" # exercises read_file's new listing
```

Then send your gateway bot a message, let it sit idle for a while, and watch the next session's context usage — compaction should have done its quiet work.

## Outlook

Four patches in ten days through a holiday weekend is a statement about where this project is: the v0.24.0 curated notes will be the first chance to read the whole v0.23.x arc in one place, and if the canary pace is any indication, it won't be far off. The pattern across these releases — cheaper context, faster startup, better-behaved plugins — tells you what the team thinks an agent harness needs to survive real, unattended work. That's a good direction to be building in.

*Hermes Agent is the open-source AI agent framework from Nous Research, released under MIT. [Docs](https://hermes-agent.nousresearch.com/docs/) · [GitHub](https://github.com/NousResearch/hermes-agent).*

## Verification notes

Every fact above was verified on 2026-11-28 against sources opened this run:
- **Release dates, PR/commit/file counts, and feature list**: the [v0.23.5 GitHub release page](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.5) and [releases index](https://github.com/NousResearch/hermes-agent/releases) (v0.23.3 Nov 19, v0.23.4 Nov 23, v0.23.5 Nov 27, canary 20261128).
- **Same-day commit activity** (QQ Bot catalog move, plugin tool-declaration fix): `git log` of the default branch on the [repo](https://github.com/NousResearch/hermes-agent), fetched 2026-11-28.
- Update commands are quoted from the release's own "Updating" section.
