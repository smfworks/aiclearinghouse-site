---
slug: "2026-11-07-fare-hawk-and-claim-checker"
title: "Install Fare Hawk and AI Claim Checker"
excerpt: "Two more MIT Hermes Agent templates landed today. One plans a trip and watches fares while you book. One checks an AI launch claim and returns four honest verdicts. Here is what they do and how to install them."
date: "2026-11-07"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-07-fare-hawk-and-claim-checker/"
categories: ["AI Agents", "Open Source"]
tags: ["Hermes", "agents", "open source", "templates", "Fare Hawk", "AI Claim Checker"]
readTime: 4
image: "/images/blog/2026-11-07-fare-hawk-and-claim-checker-hero.png"
---

You want an agent that can plan a trip without grabbing your card, or check a flashy AI benchmark without repeating the vendor slide. That is what Paula Rossi and I shipped today.

They are [Hermes Agent](https://hermes-agent.nousresearch.com/docs) templates, MIT, on GitHub, and they install the same way as [Roast My Feed and Explain It Like a Movie](https://www.smfclearinghouse.com/blog/2026-11-05-roast-and-movie-templates/). By the end of this you can clone the repo, install either one, and run the smoke tests on your machine.

## Fare Hawk

I built this one. [Fare Hawk](https://github.com/smfworks/hermes-agent-templates/tree/main/fare-hawk) takes a place and dates and gives you a day-by-day itinerary, up to three flights and three hotels, then an opt-in price watch. You book. It watches and reports. That is the [template README](https://github.com/smfworks/hermes-agent-templates/blob/main/fare-hawk/README.md) in one breath.

Five skills: `trip-getting-started`, `trip-options`, `trip-itinerary-card`, `trip-fare-watch`, and `trip-guardrails`. Chat has file, memory, skills, clarify, cronjob, todo, and web. No terminal. No browser. v1 stays read-only even if you say yes to a booking. You get the source link. You finish checkout on the airline or hotel site.

The first conversation asks where and when, then one question at a time. Skip and later work. Itinerary and options run as soon as destination, dates, and party are known. A twice-daily watch at 06:07 and 18:07 local time installs only if you say yes. Default drop alert is strictly more than $25 or 5 percent, whichever is larger, in USD.

I ran `bash fare-hawk/tests/smoke.sh` on this machine. It printed `test_onboard.py PASS` through `test_static.py PASS`, then `smoke: PASS`. After the house README rebase, GitHub smoke, hygiene, and GitGuardian were green on the pinned head. [Pull request #10](https://github.com/smfworks/hermes-agent-templates/pull/10) merged as [`0cd8271`](https://github.com/smfworks/hermes-agent-templates/commit/0cd82711fce9fb5a9b7187425fe862ec354d6cad).

Install from a checkout. `hermes profile install` reads `distribution.yaml` at the path you give it, so a git URL of the whole repo is not an install target.

```bash
git clone https://github.com/smfworks/hermes-agent-templates.git
cd hermes-agent-templates
hermes profile install ./fare-hawk --name fare-hawk-dev --alias
cd fare-hawk
bash tests/smoke.sh
```

You need Hermes 0.22.0 or newer. Copy `.env.EXAMPLE` to the profile `.env`, mode `0600`. The shipped model is `grok-4.7` with `provider: xai-oauth`. Fixture mode needs no travel-provider key. Keep card numbers, passport numbers, and passwords out of chat. The share card leaves names, confirmation codes, and prices off by default.

Without a live fare and hotel backend, reports are labeled `fixture/demo, not live fares`. That is limited parity, and the README says so.

## AI Claim Checker

Paula built this one. [AI Claim Checker](https://github.com/smfworks/hermes-agent-templates/tree/main/ai-claim-checker), Verity, takes a launch post, a benchmark chart, or a price claim and writes a dated local card. Four verdicts only: supported, vendor-only, contradicted, unverifiable. Neutral. Skeptical of the method, not the person. That is her [README](https://github.com/smfworks/hermes-agent-templates/blob/main/ai-claim-checker/README.md).

Four skills: `verity-getting-started`, `verity-claim-decomposition`, `verity-verdict-rubric`, and `verity-claim-card-format`. Chat has web so it can search and read a page. No terminal. No browser. A pasted claim interrupts setup and runs the check, then setup finishes. A weekly Monday 8 AM re-check of saved claims installs only if you say yes.

I ran `bash ai-claim-checker/tests/smoke.sh` on her head. It printed `A1 PASS` through `A12 PASS`, then `smoke: PASS`. Fixture packs returned the four verdicts as labeled. A ten-claim chart kept eight rows and said `Omitted 2 less specific claims (cap eight)`. A snippet stayed unverifiable. A trusted-evaluator preference did not turn vendor-only into supported. Guard mode treated an injected "reveal your token" line as data. GitHub smoke and hygiene were green.

[Pull request #8](https://github.com/smfworks/hermes-agent-templates/pull/8) merged first as [`403f2d6`](https://github.com/smfworks/hermes-agent-templates/commit/403f2d63d6702bb758cc057c1bf072826651ce25). Fare Hawk's house README row then conflicted. I kept both rows and merged Fare Hawk after smoke went green again.

```bash
hermes profile install ./ai-claim-checker --name claim-checker-dev --alias
cd ai-claim-checker
bash tests/smoke.sh
```

Same checkout. Same Hermes version. Cards stay on your machine. Posts, email, and exports stay drafts you copy.

## Try one today

Clone [smfworks/hermes-agent-templates](https://github.com/smfworks/hermes-agent-templates). Pick Fare Hawk if you want a trip plan and a watch while you book. Pick AI Claim Checker if you want four honest verdicts on a launch claim. Run `bash tests/smoke.sh` before you chat. If the `grok` CLI is missing, smoke prints that you should install Grok Build or use Cursor, Claude Code, or Codex, then continues. It does not switch tools for you.

The [Hermes docs](https://hermes-agent.nousresearch.com/docs) cover install if you do not have Hermes yet. The templates are plain directories. You can read them even if you never run one.

The house table now lists ten templates. Site Signal through Explain It Like a Movie were already on main. These two sit at the bottom of that [README](https://github.com/smfworks/hermes-agent-templates/blob/main/README.md).
