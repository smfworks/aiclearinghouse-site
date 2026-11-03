---
slug: "hermes-agent-templates-first-three"
title: "Three Hermes Agent Templates You Can Install Today"
excerpt: "We published our first three Hermes Agent profile templates — a website quality agent and a two-bot coding team — under MIT. Here's what each one does and how to install them."
date: "2026-11-03"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hermes-agent-templates-first-three/"
categories: ["AI Agents", "Open Source"]
tags: ["Hermes", "agents", "open source", "automation", "templates"]
readTime: 8
image: "/images/blog/hermes-agent-templates-first-three-hero.png"
---

If you've ever set up an AI agent from scratch, you know the shape of the problem. The model is the easy part. The hard part is everything around it: what rules it follows, what tools it may touch, what it refuses to do, and how you check its work. That's an afternoon of work every time you start a new agent, and most of that work looks the same as last time.

That's the problem our first three [Hermes Agent Templates](https://github.com/smfworks/hermes-agent-templates) are built to solve. A template is a complete Hermes profile — skills, guardrail scripts, configuration, tests — packaged so you can install it with one command and have a working, opinionated agent on the first conversation. All three are MIT-licensed and published by SMF Works on GitHub.

By the end of this post you'll know what each template does, what actually happened when we ran them, and how to install the first one on your own machine in about two minutes.

## Why templates instead of instructions

Hermes is [an open-source agent framework](https://hermes-agent.nousresearch.com/docs) you run on your own machine. Out of the box it's capable but general — you tell it who it is with a profile. We've been running Hermes profiles internally for months, and the ones that worked settled into patterns: strict guardrails, reviewer sign-off before anything ships, and skills that encode procedures rather than vibes.

A template is one of those proven profiles, packaged. The install command is:

```bash
git clone https://github.com/smfworks/hermes-agent-templates.git
cd hermes-agent-templates
hermes profile install ./site-signal --name site-signal --alias
```

The alias gives you a `site-signal` command, which is shorthand for `hermes -p site-signal`. Updates work the same way: `hermes profile update site-signal -y` refreshes the profile while keeping your `.env`, memories, and local config. We tested that update path against a deliberately modified profile and confirmed user data survives — that test is part of the ship checklist for every template we publish.

## Site Signal: a website quality agent that asks permission

The first template is for anyone who owns a website. [Site Signal](https://github.com/smfworks/hermes-agent-templates/tree/main/site-signal) scans sites you own for SEO, GEO (generative engine optimization), AEO (answer engine optimization), general AI readiness, and accessibility via axe-core. It ranks what it finds by impact and can ship fixes as GitHub pull requests — which merge only when you approve.

The scan results are worth a look, because they're reproducible. In our live runs, smfworks.com scored SEO 94, GEO 96, AEO 94, overall 95 (grade A), with AI readiness at 87 (B). Our WisdomForge site scored SEO 100, GEO 98, AEO 94, overall 98 (A) with AI readiness 96. Those numbers matched an independent baseline exactly, which is what you want to see from a scanner — the same inputs should give the same outputs.

The fix flow is the interesting part. We ran the full cycle on a private test site we seeded with a deliberately missing canonical link. Site Signal audited it, ranked `canonical-missing` as the top issue, wrote the fix through a headless coding agent, and opened a draft pull request. The overall score went from 64 to 90, with SEO climbing from 37 to 75, and the canonical tag verified on the live page after the fix merged. Every fix ships as a draft PR, and a bare "go" is refused — the approval has to name the repo and pull request. Before any fix is written, a deny-terms check scans the brief and the diff and fails closed if anything proprietary would leak into a public repo.

## Builder Prime and Gatekeeper Prime: a two-bot coding team

The other two templates are a pair. [Builder Prime](https://github.com/smfworks/hermes-agent-templates/tree/main/builder-prime) plans, codes, tests, and opens pull requests. [Gatekeeper Prime](https://github.com/smfworks/hermes-agent-templates/tree/main/gatekeeper-prime) reviews them and merges — under conditions worth spelling out.

Builder Prime never merges and never pushes to a protected branch. It works in git worktrees, drives a headless coding agent for the implementation (and stops to name the alternatives — Cursor, Claude Code, Codex — if that agent is missing, rather than quietly swapping tools), and hands off to Gatekeeper through a GitHub comment that starts with `bp-handoff:`. The comment URL is the delivery receipt.

Gatekeeper's merge gate is the strictest piece of code we shipped. It squash-merges a pull request only when three things are true at the same moment: required checks are green (check runs *and* commit statuses — pending counts as not green), the owner's account has left a "yes" comment naming the pull request's current head SHA, and nothing has been pushed since. That last condition does a lot of work. Any new push moves the head SHA, which invalidates every earlier yes automatically.

Because all of our agents share one GitHub login, the guardrail scripts refuse to let a bot post a yes-shaped comment at all — a body starting with "yes" that contains a 40-character SHA gets rejected before it reaches GitHub. During testing we found that a JSON-wrapped comment body piped through stdin could slip past a plain filter, so the guard now unwraps JSON before checking. A peer reviewer caught a related bug — `gh api` prints error bodies on stdout, which crashed the gate on repos without classic branch protection — and that fix is in the published template.

The live test: 13 test cases against a real private GitHub repo, all passing, including a genuine squash merge where the merge log recorded the approving comment's ID. That's the level of paranoia we think a merge-capable bot needs. It never merged anything it shouldn't, and it refused to merge when it lacked proof.

## What we learned packaging these

Three things stood out, and they'll shape the next templates.

First, the guardrails are the product. The scanners are useful, the fix flow is useful, but the parts that make me comfortable letting an agent open pull requests against a real repo are the fail-closed checks: the deny-terms gate, the named-approval requirement, the head-SHA pinning. If you're building your own agent profiles, spend your time there.

Second, a reviewer with different incentives is worth a lot. Paula reviewed both coding-team templates and found real bugs — the `gh api` error-body crash, a `.gitignore` gap that could have shipped credentials — that the builder missed both times. Not because the builder was careless, but because author and reviewer see the diff differently. If you run agents, give the reviewing one a different name, a different role, and permission to say no.

Third, tests written before the implementation beat tests written after. The merge gate behaved exactly as its test suite pinned it, including edge cases like a stale SHA after a push, because the contract existed first.

## Try it today

If you have Hermes installed, the fastest path is:

```bash
git clone https://github.com/smfworks/hermes-agent-templates.git
cd hermes-agent-templates
hermes profile install ./site-signal --name site-signal --alias
site-signal chat
```

That first conversation walks you through setup one question at a time — which GitHub repos it may touch, which Chrome binary to use for accessibility scans, nothing hidden. The two-bot pair installs the same way from their directories; run Builder Prime in one terminal and Gatekeeper in another.

If you don't run Hermes yet, the [docs](https://hermes-agent.nousresearch.com/docs) cover installation. The templates are plain directories — skills, scripts, and a `distribution.yaml` manifest — so they're also readable as reference material even if you never install one.

One question back at you: when your agent opens its first pull request, what would make you trust it enough to merge? We built ours around named approvals pinned to exact commits, and I'd genuinely like to hear what other people land on — reply or quote with your setup.
