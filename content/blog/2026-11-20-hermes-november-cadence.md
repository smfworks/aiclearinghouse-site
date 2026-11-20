---
slug: "2026-11-20-hermes-november-cadence"
title: "Four Releases in Fifteen Days: Inside the Fastest Month Hermes Agent Has Ever Had"
excerpt: "Hermes Agent shipped v0.23.0 through v0.23.3 between November 5 and November 19, folded in a browser version of the whole Desktop, and closed a plugin hackathon with nearly a thousand entries. Here is what actually changed, in plain language."
date: "2026-11-20"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
categories: ["AI Agents", "Open Source", "Hermes Agent"]
tags: ["hermes-agent", "nous-research", "releases", "plugins", "daily-digest"]
readTime: 8
image: "/images/blog/2026-11-20-hermes-november-cadence.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-20-hermes-november-cadence"
---

Most software projects ship a release every few months and call it a season. Hermes Agent, the open-source agent framework from Nous Research, just shipped four of them in fifteen days — and the numbers behind those releases are the real story.

Between November 5 and November 19, the project cut four stable versions: v0.23.0 (the "Hearth Release"), then patches v0.23.1, v0.23.2, and v0.23.3. The patch alone that landed this week rolled up roughly 370 merged pull requests — about 1,657 commits across 3,948 files — into a single stable tag ([release notes](https://github.com/NousResearch/hermes-agent/releases)). And a new canary build appeared again this morning. The assembly line never really stops.

Here is what all that activity actually means for the person using the thing.

## The headline: your agent now lives in a browser tab

The biggest shift of the month came in v0.23.0, and it is easy to miss because it sounds mundane: **the whole Desktop workspace now opens in a browser tab**. The new Webapp serves your chats, group rooms, plugins, and settings from your own gateway — the same machine you already run — to any browser on your network. It ships in the Docker image and the Nix package, and it is off by default until you switch it on ([v0.23.0 notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.0)).

Why that matters: until now, "your agent" lived in whichever window you happened to open. Now it lives on *your computer* and the windows are just doors. You can check on a long-running job from a laptop, or from a tablet in the kitchen, without installing anything.

## One gateway, one conversation

The second big change fixes something that quietly annoyed multi-device users for months. Before, the command line, the terminal UI, the Desktop app, editor integrations, chat bots, and scheduled jobs could each spin up their own copy of the agent against the *same* conversation — which is how messages occasionally got written twice or vanished between surfaces.

v0.23.0 changed the architecture: **one gateway per machine owns every conversation**, and every app attaches to it as a client ([release notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.0)). Open a chat from the terminal, continue it from your phone via Telegram, review it in Desktop later — it is the same chat, with one queue and one history. You can even edit a queued prompt from Desktop before it runs, without triggering a double-send.

The month's releases also folded in smaller quality-of-life wins worth knowing about: you can press Escape twice and **rewind a conversation** to an earlier point, editing and resending like nothing happened. The terminal now draws pasted images and screenshots **inline** — actual pixels in kitty, Ghostty, iTerm2 and WezTerm, instead of a file path. And a new **plugin catalog** grew from around 600 entries to over 1,050, with a one-command `hermes plugins update` that refreshes everything at once.

## The scale is the real story

A release cadence like this is only possible with a large contributor base, and the numbers are worth pausing on. The Hearth Release alone rolled up about 10,080 commits from **666 contributors** — roughly 1,950 merged pull requests and 850 closed issues in a single release window. An independent ecosystem tracker counted **262,917 stars** on the core repo as of November 12, with 318 tracked ecosystem projects (+70 in eight weeks) carrying a combined 1.49 million stars ([Hermes Atlas, November 2026](https://hermesatlas.com/reports/state-of-hermes-november-2026)).

| Release | Date | What it delivered |
|---|---|---|
| v0.23.0 "Hearth" | Nov 5 | Webapp, one-gateway architecture, /rewind, inline terminal images, plugin catalog 600 → 1,050+ |
| v0.23.1 | Nov 9 | ~618 PRs; plugin installs work off the live catalog again |
| v0.23.2 | Nov 16 | ~1,989 PRs; durable subagents that survive a gateway restart, one prompt-cache clock per session, `hermes fallback check` |
| v0.23.3 | Nov 19 | ~370 PRs; prompt-cache lifecycle controller, compaction that archives what it drops, GPT-6.2 Astra and Sol support |

That cadence is unusual. Most open-source projects of this size slow down as they grow, because every change risks breaking someone. Hermes is moving *faster* — the v0.23.3 window alone absorbed more commits than many projects manage in a year.

## The plugin hackathon: a thousand entries, results imminent

The other big November story is community-side. Nous Research ran a seven-day **plugin hackathon** with $20,000 in cash prizes; submissions closed November 11 at **nearly 1,000 entries** ([announcement](https://x.com/NousResearch/status/2120715518243987685)). Winners were promised "in about a week" — so by the time you read this, they may be announced. Plugins are how Hermes grows sideways: they change which models it runs on, where it stores memory, which chat apps it speaks through, and what its Desktop shows. A thousand entries in seven days tells you where the energy in this ecosystem is.

## What this means for you

If you already run Hermes: **update and look at three switches.** The Webapp (`webapp.enabled` in settings) turns any browser into your agent's front door. The prompt-cache lifecycle work in v0.23.3 — warming through long tool runs, compacting idle chats, a `cache_ttl` default of `auto` — makes long-running scheduled jobs dramatically cheaper than they were. And `hermes plugins update` is now the one command to run on a lazy Sunday.

If you have been *watching* Hermes from the sidelines: this month is the strongest signal yet that the project is not a science experiment. Four stable releases in fifteen days, a thousand-plugin community contest, and an ecosystem tracker counting nearly 318 active satellite projects — that is the footprint of software with a real constituency.

## The honest fine print

Two caveats worth stating plainly. First, the pace cuts both ways: v0.23.0 removed the old built-in browser tools (everything consolidated into one `browser_exec` tool) and moved some utilities into plugins, so old tutorials can mislead — if a guide names `browser_navigate` or `browser_click`, it predates November. Second, the Desktop app now requires macOS 13+ and 64-bit Windows after the Electron 44 upgrade. Neither is a blocker, but both will bite someone who skims the upgrade notes.

The trajectory, though, is hard to argue with. A project that can absorb 10,000 commits a month, keep its documentation current, and still ship a browser-based workspace — while its community builds a thousand plugins in a week — is a project worth checking in on monthly. We will keep doing exactly that.

*Sources: [Hermes Agent releases](https://github.com/NousResearch/hermes-agent/releases) (v0.23.0–v0.23.3 release notes, retrieved November 20, 2026); [Hermes Atlas State of Hermes, November 2026](https://hermesatlas.com/reports/state-of-hermes-november-2026); [Nous Research on X](https://x.com/NousResearch/status/2120715518243987685) (plugin hackathon).*
