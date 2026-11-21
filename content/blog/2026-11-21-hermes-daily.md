---
slug: "2026-11-21-hermes-daily"
title: "The Invisible Release: What 100 Commits Look Like When Nobody Ships a Feature"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
date: "2026-11-21"
excerpt: "Between stable releases, Hermes Agent landed 100+ commits in two days and not one of them was a headline feature. Here's what actually changed, why it matters, and how to read a repo like a release engineer."
readTime: 11
image: "/images/blog/2026-11-21-hermes-daily.svg"
categories: ["AI", "Open Source", "Developer Tools"]
tags: ["hermes-agent", "release cadence", "canary", "skills", "performance"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-21-hermes-daily"
---

**By Pamela Flannery, SMF Works**

![The Invisible Release — commit-type breakdown and skill catalog counts, verified Nov 21, 2026](/images/blog/2026-11-21-hermes-daily.svg)

Open-source projects have a way of teaching you to read them, and [Hermes Agent](https://github.com/NousResearch/hermes-agent) taught me something new this week. I went looking for news — a shiny feature, a launch, something with a name. What I found instead was more interesting: between the v0.23.3 stable release on November 19 and the morning of November 21, the project landed **over 100 commits**, and the `feat:` prefix shows up only four times.

That is not a slowdown. That is what a mature release pipeline looks like between releases. And learning to read it is a genuinely useful skill if you run agents in production — because the fixes nobody headlines are the ones that decide whether your 3am cron job survives.

## First, how this project actually releases

Hermes Agent doesn't do "big version every six months." It runs a **canary channel that builds daily** — the [releases page](https://github.com/NousResearch/hermes-agent/releases) shows a canary tag for every single day, stamped from that morning's commit — and then rolls stable tags up on top. v0.23.3 shipped November 19 as a patch release pulling in roughly 370 merged PRs since v0.23.2. The release notes are refreshingly honest about it: they count **1,657 non-merge commits across 3,948 changed files**, and they say plainly that full curated notes wait for v0.24.0.

The daily canary matters more than it sounds. If you run Hermes seriously, you can opt into the canary channel and get yesterday's fixes today — or stay on `stable` and let the project soak each change for a day first. Either way, the repo's commit log is the real changelog, which brings me to what's in it right now.

## The last 48 hours, counted honestly

I pulled the commit list from the GitHub API for the window from November 20 at 4am ET through the morning of November 21. Here's the actual breakdown — I counted, you don't have to:

| Commit type | Count | What it tells you |
|---|---|---|
| `fix:` | 19 | Bug fixes across Telegram, tools, Desktop, skills, package management |
| `perf:` | 19 | Every single one on the Desktop render/streaming path |
| `test:` | 13 | New end-to-end and regression coverage locking fixes in |
| `docs:` | 5 | Release process, gateway, CI behavior clarified |
| `feat:` | 4 | The only new capabilities in the window |
| `refactor:`/`ci:`/`chore:` | 3+ | Cleanup and pipeline work |

Four features out of a hundred commits. The four that did land are small and sharp: a `hermes://launch` URL scheme so a link can open the desktop app and do nothing else, a configurable `skills.index_desc_limit` for how much description text each skill carries in the index, an uncapped long-frame histogram for people who opt into shared metrics, and an escalating profile-switch indicator. All four came from outside the core team, by the way — the project's contributor list keeps widening, which for an open-source project is the healthiest sign there is.

Everything else is maintenance. And it's *specific* maintenance. The `fix:` commits name their targets precisely: a Telegram plugin whose handler could run ahead of the observer, vault-code prompts reading the wrong parse-mode constant, Telegram drafts that broke after the on-demand `python-telegram-bot` install, lock-release handling in package management, generation leases leaking into the dependency tree, a skill-view dedup entry that could vanish when a guardrail notice followed the result.

That last pattern — fix, then a paired `test:` commit — is the tell of a team that expects to keep maintaining this for years. Thirteen of the hundred commits exist purely to make sure a fix stays fixed.

## The 19 performance commits hiding in a Desktop app

Here's the part of the log I didn't expect. On November 20, somebody (several somebodies, given the pace) ran a sustained campaign against the [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop) render pipeline. Nineteen `perf:` commits, one day. Reading them in sequence is like watching someone tighten a machine bolt by bolt:

- Stop the block splitter from retaining every streamed prefix
- End a markdown stream without re-parsing the whole message
- Batch hidden streams at 4 per second and exempt voice consumers
- Patch only the streamed tail row per delta, instead of re-reconciling the transcript
- Coalesce preview-console updates to one per frame
- Keep the agent-terminal backlog as a chunked deque

None of these changes what Hermes does. All of them change how it *feels* — a long agent turn streaming into a chat with hundreds of messages stays smooth instead of starting to stutter. This is unglamorous, invisible work, and it's exactly the work that separates a tool you demo from a tool you live in. You never notice it working. You'd absolutely notice it gone.

## The fix you can actually use: long outputs now spill to disk

The Desktop perf campaign is nice, but the change I'd point a working agent operator at is in the tools layer. A sequence of commits on November 21 — `refactor(tools): return a spill file's parts from _pageable_text`, then `fix(tools): keep the output tail in the persisted terminal preview` — reworked how Hermes handles **long tool outputs**: when a command produces more text than a context can hold, the full output is saved to a spill file, and the context keeps a pageable view with the head and tail instead of everything.

Why you should care: long benchmarks, big log greps, and verbose test runs are precisely the outputs agents produce most, and they're what used to blow up a session's context. If you've ever watched an agent's own output eat the window it needed to reason with, this fix is for you. It's not in the release notes yet — full curated notes come with v0.24.0 — it's in the log.

## The quiet catalog math

While I was in the docs I ran one count I'd been meaning to do. The [bundled skills catalog](https://hermes-agent.nousresearch.com/docs/reference/skills-catalog) — skills active on every install — lists **44 skills**. The [optional catalog](https://hermes-agent.nousresearch.com/docs/reference/optional-skills-catalog) adds **141 more**, installed with one command: `hermes skills install official/<category>/<skill>`. That's **185 skills total**, roughly a third of which are delegations to other CLIs — Claude Code, Codex, Grok, OpenCode, OpenHands, Blackbox, and more. Hermes has quietly become a *manager* of coding agents, not just one.

And the release notes for the v0.23.2/0.23.3 window mention "a large batch of new plugin-catalog entries" on top of that — community plugins like `barrier-shield`, `axiom`, and `scansift` landed via the [reviewed plugin catalog](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugin-catalog).

| Layer | Count | Install |
|---|---|---|
| Bundled skills | 44 | Active by default |
| Optional skills | 141 | `hermes skills install official/...` |
| Total skills | 185 | ~1/3 delegate to other coding CLIs |
| New plugins (v0.23.3 window) | "large batch" | `hermes plugins update` |

## How to read a repo like this yourself

The method I used is copyable, and it works on any active open-source project:

1. **Find the release rhythm.** Check the releases page. A project with daily canaries is telling you it wants changes soaked fast and shipped often.
2. **Pull the window's commits.** `gh api "repos/OWNER/REPO/commits?since=2026-11-20T04:00:00Z"` gives you the raw list. Count prefixes. The `feat:` count tells you the headline rate; the `fix:` and `perf:` counts tell you the health rate.
3. **Read the `test:` commits as trust signals.** A fix followed by a regression test is a fix that stays fixed. A project that writes 13 test commits in two days is telling you it plans to still be here next year.
4. **Don't trust your memory of the notes.** v0.23.3's own release notes say big features are "undocumented here on purpose" until v0.24.0. If you want to know what changed, the log is the only complete source.

## What this means for you

If you run Hermes Agent: **update** (`hermes update`), and know that the last 48 hours of maintenance went into exactly the surfaces that fail in production — Telegram delivery edge cases, long tool outputs, Desktop streaming, package-manager locking. Nothing about your workflows needs to change; the invisible release just made the floor more solid under you.

If you build anything people use daily: the 19-perf-commits-in-a-day pattern is the lesson. The features get users; the invisible work keeps them. Budget time for it deliberately, the way this project apparently does — as its own campaign, not a leftover.

And if you're evaluating agents: the skill math above is worth a glance. A framework shipping 44 skills out of the box with 141 more one command away — and a third of those being delegations to other agents — is a framework that wants to be the last tool you open, not one of many.

## The outlook

The v0.24.0 release will eventually arrive with full curated notes for everything since v0.23.0, and per the project's own convention, nothing from this window gets skipped there. Between now and then, the daily canary will keep landing at the same UTC hour, the `fix:` and `perf:` counts will keep dwarfing `feat:`, and the invisible release will keep making the visible ones land softer. That's not a story the changelog headlines. It's the story the commit log tells — and now you know how to read it.

---

*Sources opened for this post (November 21, 2026): [GitHub releases page](https://github.com/NousResearch/hermes-agent/releases) and v0.23.3 release notes, the repo's commit history via the GitHub API (window 2026-11-20T04:00Z → 2026-11-21T09:00Z), the [bundled skills catalog](https://hermes-agent.nousresearch.com/docs/reference/skills-catalog), the [optional skills catalog](https://hermes-agent.nousresearch.com/docs/reference/optional-skills-catalog), and the [skills system docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills). All counts in this post were computed from those pages and API responses in this session.*
