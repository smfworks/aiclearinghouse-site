---
slug: "2026-11-24-hermes-daily"
title: "Six Days, 600 Pull Requests: Inside Hermes Agent v0.23.4"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
date: "2026-11-24"
excerpt: "Hermes Agent shipped v0.23.4 on Sunday: 229 merged PRs in four days, a smarter prompt cache, plugin settings you can edit from the terminal, and a security hardening pass on how sandboxes start. Here is what actually changed and what to do with it."
categories: ["AI", "Open Source", "Developer Tools"]
tags: ["hermes-agent", "nous-research", "release-notes", "prompt-caching", "plugins"]
readTime: 8
image: "/images/blog/2026-11-24-hermes-daily.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-24-hermes-daily"
---

**By Pamela Flannery, SMF Works**

When an open-source project releases every few days, the danger is that releases blur together. Hermes Agent's [v0.23.4](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.4), published November 23, is worth slowing down for — not because any single change is flashy, but because the pattern across the last two patches shows where the project is spending its energy. Two patch releases in six days rolled up roughly 600 merged pull requests, and reading them tells you a lot about what an agent framework needs before it can be trusted with real work: cheaper context, a bigger plugin ecosystem, and fewer ways to shoot yourself in the foot.

![Hero: labeled data-viz of the v0.23.3 and v0.23.4 release windows — PRs merged, commits, and the release cadence](/images/blog/2026-11-24-hermes-daily.svg)

## The pace, in numbers

The release notes are unusually specific about scope, which makes the comparison easy. [v0.23.3](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.3) (November 19) rolled up **370 merged PRs** since v0.23.2 — 1,657 non-merge commits across 3,948 files, about +222k lines changed. Four days later, [v0.23.4](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.4) shipped another **229 merged PRs** — 1,122 commits across 1,316 files, +96k lines — plus 281 closed issues. That is a sustained rate of well over 50 merged PRs per day. For context, the full v0.23.1 patch window measured 618 PRs; the project now covers similar ground in under a week.

| Release | Date | PRs merged | Non-merge commits | Files touched | Closed issues |
|---|---|---|---|---|---|
| v0.23.1 (window) | Nov 9 | 618 | 2,578 | 2,781 | 409 |
| v0.23.3 | Nov 19 | 370 | 1,657 | 3,948 | 60 |
| v0.23.4 | Nov 23 | 229 | 1,122 | 1,316 | 281 |

Every number above comes straight from the "About this release" section of the official release notes, measured at named commits — the project publishes its own accounting, which is refreshingly rare.

## The prompt cache got smarter (and so did your bill)

The quiet-but-important change in v0.23.3 is a **prompt-cache lifecycle controller**. The release notes describe a system that now keeps a cache warm through long tool runs — instead of a long browser session or benchmark invalidating your cached prefix — and compacts idle chats *before* the one-hour cache window expires rather than after. The `prompt_caching.cache_ttl` setting now defaults to `auto`, and the full 1-hour lifecycle applies on Nous Portal.

Why care? Because on any metered provider, a cache hit on a long agent conversation is dramatically cheaper than re-reading the whole prompt. An agent that keeps its prefix stable and times its compaction to fit inside the cache window is, bluntly, an agent that costs less to run. There is a [developer guide page on prompt assembly](https://hermes-agent.nousresearch.com/docs/developer-guide/prompt-assembly) if you want the mechanics of how the prefix is kept cache-stable, and a [micro-compaction page](https://hermes-agent.nousresearch.com/docs/developer-guide/micro-compaction) covering how compression cost gets amortized. v0.23.3 also made tool-result compaction archive what it drops instead of just discarding it — so pruning context no longer means losing the receipts.

## Small commands, real leverage

Both releases shipped a batch of unglamorous commands that turn out to matter daily:

- **`hermes plugins config`** (v0.23.4) — edit a plugin's settings from the terminal, no YAML spelunking. Until now, plugin configuration was one of those things everyone did by hand-editing files, which is exactly how typos become outages.
- **`hermes gateway migrate --backends`** (v0.23.4) — move an old serve/dashboard backend onto the central gateway, with a card in the dashboard's System page showing the state of the move. If you started with per-agent servers and want one gateway, this is the off-ramp.
- **`hermes --cpu-profile PATH`** (from the v0.23.1 window) — write a CPU profile of any run plus a top-functions summary. When your agent feels slow, you can now *prove* where the time goes.
- **`hermes dashboard password`** now works without an interactive TTY prompt (v0.23.4) — a small thing that unblocks any scripted or containerized setup.
- **`hermes mcp serve` moved to the official `mcp-serve` plugin** and **`hermes import-agent` moved to the `agent-importers` plugin** — a "smaller core" cleanup. First-time `hermes setup` now detects an existing OpenClaw, Claude Code, Codex CLI or Cursor installation and [offers a one-command import](https://hermes-agent.nousresearch.com/docs/user-guide/import-from-other-agents), including `--migrate-secrets` so your API keys and bot tokens come along.

That last one is the OpenClaw story in miniature: migration is no longer a documented archaeology project, it is a checkbox during setup.

## A security pass on sandboxed starts

The most interesting commit in the last few days ( [#156725](https://github.com/NousResearch/hermes-agent/pull/156725), merged November 23) is titled "never run a profile on the host while a plugin runs it elsewhere." The scenario: a plugin runs a whole agent profile in a sandbox or remote backend, while the host — which can read the config that backend writes — also serves that same profile, runs its cron jobs, or worse, executes commands from the profile's config like provider `key_cmd` lines, speech commands, password-manager binaries, or the browser executable. That is a genuine injection surface: whoever controls the sandbox's config files controls code the host would run.

The fix is a marker file. A host-side plugin can mark a profile as "runs elsewhere," and every path on the host — the gateway, cron tickers, the dashboard's agent builder, TUI bootstrap, file and audio routes — then refuses to touch it. The commit message and its review follow-ups close an impressive list of side doors: no `.env` or secret-source loading from a marked home, no SSH dialing, no running the profile's TTS command. The follow-through discipline here is the real story — reviewers found the gaps and the project fixed every one before merge.

Alongside it, v0.23.4 honors **managed-scope config** in security and URL-safety reads, and the window added approval cards in Desktop for a sandbox's folder and site requests — so a sandboxed agent asking for filesystem or network access now asks *you* first, in the UI.

## The ecosystem context

Two data points from the wider world frame all this. First, on November 18, [Nous Research announced Hermes Enterprise in Microsoft Teams and Azure](https://nousresearch.com/hermes-enterprise-in-microsoft-teams) — a Microsoft Store desktop app, a Teams bot, and sandboxed execution on Azure Container Apps — noting that Hermes ranks #1 among public open agents on OpenRouter at nearly 2 trillion tokens a day. The enterprise pitch leans on the same mechanism hobbyists know: work done once becomes a reusable skill, and skills become shared team assets.

Second, the plugin ecosystem crossed [1,000 community plugins](https://x.com/AGTPinsights/status/2119282847248732237) announced by Nous' Teknium on November 8, with new catalog entries continuing in every release window (including a new `oci-provider` plugin in the past few days' commits). v0.23.4 also raised the client-side plugin catalog size cap to 16 MiB in v0.23.1's follow-up — fixing a genuinely nasty bug where every install silently fell back to a stale bundled catalog because the live one exceeded 2 MiB. If your `hermes plugins install` had been mysteriously missing new plugins, that was it.

| Milestone | Date | Source |
|---|---|---|
| v0.23.1 — catalog cap fix (2→16 MiB) | Nov 9 | [Release notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.1) |
| 1,000+ community plugins | Nov 8 | [AGTP on X](https://x.com/AGTPinsights/status/2119282847248732237) |
| Hermes Enterprise (Teams/Azure/Store) | Nov 18 | [Nous announcement](https://nousresearch.com/hermes-enterprise-in-microsoft-teams) |
| v0.23.4 — plugins config, sandbox guard | Nov 23 | [Release notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.4) |

## What this means for you

If you run Hermes Agent, three concrete moves this week:

1. **Update now** (`hermes update`) if you are on v0.23.0 or older — the catalog-fallback bug means your plugin installs have been silently stale, and the prompt-cache improvements apply to everything you run.
2. **Stop hand-editing plugin config.** `hermes plugins config` is the supported path; it edits without breaking the config the plugin actually reads.
3. **If you self-host with plugins that spawn backends**, read the run-elsewhere marker design in the release notes and check whether your setup relies on any path the marker now fences off. If you have old `hermes serve` backends, `hermes gateway migrate --backends` is the supported consolidation.

If you are evaluating agents, the takeaway is about *trajectory*: the same week an enterprise partnership landed, the project merged a security fix for a niche-but-real sandbox escape and shipped tooling that makes migration from competitors a one-command affair. Those are not the same kind of work, and a project doing both at once is rare.

## Outlook

The release notes promise that full curated notes for the v0.23.x window ship with **v0.24.0** — "nothing in this window is skipped," including contributor credits for every PR. Canaries dated November 23–24 are already tagged, so a v0.23.5 (or the big v0.24.0) is likely within days. Worth watching: whether the run-elsewhere marker pattern gets adopted by more backends, and whether the prompt-cache lifecycle controller's `auto` mode becomes the documented default story for agent cost control. Six hundred pull requests in six days says the interesting stuff is not slowing down for the holidays.

## Verification notes

- Release scope numbers (PRs, commits, files, issues) quoted from the GitHub release pages for [v0.23.1](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.1), [v0.23.3](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.3), and [v0.23.4](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.4), all fetched November 24, 2026.
- Feature claims (prompt-cache controller, `hermes plugins config`, gateway migrate, sandbox marker #156725, catalog cap) come from those same release notes and from commit messages in the [repository](https://github.com/NousResearch/hermes-agent) fetched November 24, 2026.
- Import command behavior from the [Import from Other Agents](https://hermes-agent.nousresearch.com/docs/user-guide/import-from-other-agents) docs page, fetched November 24, 2026.
- Enterprise announcement details from [Nous Research's press page](https://nousresearch.com/hermes-enterprise-in-microsoft-teams) (Nov 18, 2026).
- The 1,000-plugin milestone is from an analyst post on X ([@AGTPinsights](https://x.com/AGTPinsights/status/2119282847248732237)); the underlying claim is Teknium's announcement. Treat the view count as reported.
- The `oci-provider` plugin entry is from a commit in the repo observed November 24, 2026.
