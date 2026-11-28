---
slug: "2026-11-28-rebuilding-two-websites-with-two-ai-models"
title: "How We Rebuilt Two Websites in One Day Using Two Different AI Models"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
date: "2026-11-28"
excerpt: "How we split structural plumbing from visual design across smfworks.com and smfclearinghouse.com, cleaned up old routes without breaking links, and shipped both sites in one day."
categories: ["AI R&D", "Web Design", "Autonomous Agents"]
tags: ["smf-works", "smf-clearinghouse", "grok-4-7", "gemini-4-neon", "orca", "praxis-prime", "hermes"]
readTime: 8
image: "/images/blog/2026-11-28-rebuilding-two-websites-with-two-ai-models.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-28-rebuilding-two-websites-with-two-ai-models"
---

**By Pamela Flannery, Chief Marketing Officer, SMF Works**

If you have ever asked one AI model to overhaul an entire website at once, you already know how fast things can go sideways. You ask for cleaner colors and better spacing, and suddenly a working navigation link disappears, a redirect breaks, or a security fix from last week quietly vanishes.

Today we overhauled both of our main sites, [smfworks.com](https://smfworks.com) and [smfclearinghouse.com](https://www.smfclearinghouse.com), in a single day without breaking a single test or losing an old URL. The trick was simple: we stopped asking one model to be both the plumber and the interior designer.

If you run a small project, a personal blog, or a company site with AI coding tools, you can copy this exact two-step pattern on your next redesign.

## Why we split the job between two models

Website work actually involves two very different kinds of thinking.

First comes structural work: deciding which pages stay, which old pages get retired, where old links should redirect so visitors never hit a dead end, and making sure the site compiles and passes automated tests. Second comes visual design and writing: choosing readable fonts, making sure dark backgrounds still have high text contrast, laying out cards cleanly on phones and desktops, and writing clear human copy.

When you mix both into one giant prompt, models tend to get distracted. A layout tweak accidentally edits a data fetch, or a route cleanup leaves mismatched CSS behind.

So Michael set a clean two-model policy for our web work:

| Step | Model we used | What it owns | What it leaves alone |
|---|---|---|---|
| Stage 1: Structure | Grok 4.7 (`xai-oauth/grok-4.7`) | Page routes, 301 redirects, data files, SEO metadata, automated tests | Final visual styling, color polish, decorative layouts |
| Stage 2: Visual Design & Copy | Gemini 4 Neon (`gemini/gemini-4-neon`) | Fonts, color palette, spacing, cards, diagrams, everyday copy | Routes, API fetches, link targets, redirect rules |

Between Stage 1 and Stage 2, the site has to pass a real production build and every automated test. If Stage 1 does not build cleanly, Stage 2 does not start. That boundary saves hours of untangling later.

## What both sites are actually for now

Over the past year, our two websites started overlapping. Old consulting pages and duplicate blog archives sat on `smfworks.com`, even though our daily writing had moved here to `smfclearinghouse.com`. Visitors landing on the parent site had to guess what SMF Works actually did.

Today we drew a bright line between the two sites and unified them under one high-tech AI R&D identity focused on human-AI interaction and personal and organizational transformation in the age of autonomous AI. We also retired old blacksmith and consulting language everywhere on both sites so the sites match what the lab actually builds today.

Here is how the four public pieces of the ecosystem fit together now:

![Map of the SMF Works ecosystem showing human leadership directing four autonomous agent fleets across four public websites](/images/blog/2026-11-28-rebuilding-two-websites-ecosystem-map.svg)

Every top navigation bar and footer across both sites now links to the exact same four public destinations:

1. **[SMF Clearinghouse](https://www.smfclearinghouse.com)** for daily tested, cited dispatches and our live GitHub project mirror.
2. **[SMF WisdomForge](https://smfwisdomforge.com)** for parent-operated human learning and critical thinking in the age of AI.
3. **[Agent Shootout](https://agentshootout.com)** for head-to-head autonomous agent evaluations.
4. **[GitHub](https://github.com/smfworks)** for every open-source tool, agent template, benchmark, and free book we publish.

We also added a clear voluntary **Support the lab** link (`https://donate.stripe.com/14A6oGbHv3hHekY2ODew801`) on both `smfworks.com` and in the footer of every page on `smfclearinghouse.com`. Everything we publish stays open, and anyone who wants to help fund compute and research now has one simple place to do it.

## Meet the four autonomous agent fleets

One big gap on the old `smfworks.com` was that it barely explained how our lab actually runs day to day. People set the direction and review anything consequential: Michael Gannotti leads research and architecture as Founder and Principal AI, and Mary Gannotti holds operating discipline as COO. Underneath that human direction, four separate autonomous agent fleets handle the research, coding, benchmarking, and publishing loops.

An autonomous agent fleet is simply a group of specialized AI software workers that can use terminals, code editors, memory databases, and browsers to finish multi-step jobs instead of just answering one chat prompt at a time.

| Fleet | What it does in everyday terms | Where to inspect the code |
|---|---|---|
| **Grok Bot** | Runs coding, media, and production pipelines, including two-bot Builder and Reviewer loops and our Video Studio setup | [smfworks/grok-bot-templates](https://github.com/smfworks/grok-bot-templates) |
| **Hermes** | Runs persistent specialists with isolated profiles, long-term memory, and daily research and publishing routines | [smfworks/hermes-agent-templates](https://github.com/smfworks/hermes-agent-templates) |
| **OpenClaw** | Runs local-first gateway workflows backed by offline SQLite memory (Mnemosyne) so data stays on hardware you control | [smfworks/mnemosyne-openclaw](https://github.com/smfworks/mnemosyne-openclaw) |
| **Orca** | Open-source MIT orchestrator that runs parallel coding agents in isolated git worktrees (separate working folders for each branch so agents do not overwrite each other). At SMF Works, Orca is presently working on [Praxis Prime](https://github.com/smfworks/praxis-prime), our local-first Linux agent with compliance dials and a local decision engine | [stablyai/orca](https://github.com/stablyai/orca) |

All four fleets now have a dedicated home on [smfworks.com/fleets](https://smfworks.com/fleets) and appear in an interactive-style architecture schematic right on the `smfworks.com` homepage.

## Cleaning up old pages without breaking a single link

When you clean up an older website, deleting pages is the easy part. Making sure nobody hits a "404 Not Found" error from a bookmark or search result takes a little extra care.

We used permanent **301 redirects** in `next.config.js`. A 301 redirect is a simple forwarding rule that tells browsers and search engines, "This page moved permanently; send the visitor to the new address automatically."

![Before and after cleanup chart comparing smfworks.com and smfclearinghouse.com routes, security commits preserved, and static build counts](/images/blog/2026-11-28-rebuilding-two-websites-before-after.svg)

Here is the plain-English before and after across both repos:

| Area | Before today | After today |
|---|---|---|
| **smfworks.com focus** | Mixed consulting packages (`/services`), duplicate blog hubs, and older styling | Clean 6-page AI R&D Project Lab (`/`, `/fleets`, `/work`, `/about`, `/contact`, `/privacy`) |
| **Retired smfworks.com pages** | `/services`, `/publications`, `/research`, `/newsletter`, `/books` all competing for attention | Retired cleanly with 301 redirects to `/`, `/work`, or `smfclearinghouse.com/blog/` |
| **smfclearinghouse.com design** | Bare-bones default typography and unstyled `/projects` cards | Unified `Space Grotesk` + `Plus Jakarta Sans` + `JetBrains Mono` high-tech dark system across all 1,278 static pages |
| **Cross-site navigation** | Missing Agent Shootout on `smfworks.com` and mismatched menus | Identical 4-site ecosystem bar in both headers and footers, plus **Support the lab** on both sites |

## One git catch that saved us from a nasty bug

Before pushing `smfworks-site`, we ran `git fetch origin` and spotted something easy to miss: our local folder was 34 commits behind GitHub's `main` branch.

Those 34 upstream commits included important security work that had already shipped on GitHub, including a Next.js upgrade (`16.4.5`), disabling an old unauthenticated token endpoint, email-injection fixes on the contact route, and `SECURITY.md`. If we had forced our local branch over `origin/main`, we would have rolled back those security fixes.

Instead, we saved our 20 updated lab files to a temporary snapshot, reset cleanly to the latest `origin/main` (`7ed3b54`), applied our overhaul on top, updated the automated route test suite (`tests/support-cta.test.mjs`) to verify the new 6-page layout and links, and re-ran the full build and secret scan before pushing commit `e683e6b`.

## The verified scoreboard

Every number below comes directly from our production builds and test runs on November 28, 2026:

| Repository | Shipped commit | Production build | Automated tests | Secret scan |
|---|---|---|---|---|
| [smfworks/aiclearinghouse-site](https://github.com/smfworks/aiclearinghouse-site) | `adc38459` (following `ae67e2f6`) | Exit `0` (1,278 static pages) | `8/8` passing | Passed (`2,137` tracked files) |
| [smfworks/smfworks-site](https://github.com/smfworks/smfworks-site) | `e683e6b` (rebased onto `7ed3b54`) | Exit `0` (all 6 live routes + API routes) | `11/11` passing | Passed (`884` tracked files) |

## How you can use this playbook on your own site

You can try this exact workflow on any Next.js or static site this weekend:

1. **Fetch before you edit.** Run `git fetch origin && git status -sb` so you know if your local clone is behind the live repository before touching a single file.
2. **Write two separate briefs.** Give your structural model a strict list of routes to keep, old routes to 301-redirect, and tests that must pass. Give your design model the visual vibe, font pairing, and a hard rule never to alter routes or data fetching.
3. **Gate the handoff on a real build.** Run your production build (`node node_modules/next/dist/bin/next build`) and your test suite (`npm test`) after Stage 1 and again after Stage 2.
4. **Browse both live sites to see the pattern in action.** Check out the new lab architecture and four-fleet breakdown at [smfworks.com/fleets](https://smfworks.com/fleets), browse the live open-source project mirror at [smfclearinghouse.com/projects](https://www.smfclearinghouse.com/projects), or inspect the commits directly in [github.com/smfworks](https://github.com/smfworks).

## Verification notes

Every commit hash, route count, file count, and test score in this post comes directly from local git history, Next.js build logs, and `npm test` / `npm run test:secrets` runs captured on November 28, 2026. Orca's description and MIT license were verified directly against [github.com/stablyai/orca](https://github.com/stablyai/orca).
