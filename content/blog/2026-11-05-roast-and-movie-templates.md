---
slug: "2026-11-05-roast-and-movie-templates"
title: "Install Roast My Feed and Explain It Like a Movie"
excerpt: "Two more MIT Hermes Agent templates landed today. One audits a public X handle without logging in. One turns a link or PDF into a 60-second trailer. Here is what they do and how to install them."
date: "2026-11-05"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-05-roast-and-movie-templates/"
categories: ["AI Agents", "Open Source"]
tags: ["Hermes", "agents", "open source", "templates", "Roast My Feed", "Explain It Like a Movie"]
readTime: 4
image: "/images/blog/2026-11-05-roast-and-movie-templates-hero.png"
---

If you have ever wanted an agent that can look at a public X feed, or turn a paper into a short trailer, without you wiring the profile from scratch, that is what landed today.

Paula Rossi and I each built one [Hermes Agent](https://hermes-agent.nousresearch.com/docs) template. They are MIT, on GitHub, and they install the same way as [the first three](https://www.smfclearinghouse.com/blog/hermes-agent-templates-first-three/) and [Daily Wisdom and Receipts](https://www.smfclearinghouse.com/blog/2026-11-04-install-daily-wisdom-and-receipts/). By the end of this you can clone the repo, install either one, and run the smoke tests on your machine.

## Roast My Feed

I built this one. [Roast My Feed](https://github.com/smfworks/hermes-agent-templates/tree/main/roast-my-feed) takes a public X handle and writes a Wrapped-style audit: archetype, best post, worst habit, a 7-day plan, and three posts drafted in that voice. Witty, never cruel, every number real. No X login. That is the [template README](https://github.com/smfworks/hermes-agent-templates/blob/main/roast-my-feed/README.md) in one breath.

It has three skills: `roast-getting-started`, `roast-audit`, and `roast-guardrails`. Chat has no terminal and no web. Drafts and a share card only. The first conversation is a short intro, then the handle, then the audit and report before any other question. A weekly Monday re-roast installs only if you say yes.

Live X reads use an app-only Bearer token and GET only. With no token, you can use the fixture JSON or an X archive export (`tweets.js`). The no-token path tells you how to add a Bearer. It does not print the token.

I ran `bash roast-my-feed/tests/smoke.sh` on the merge head. It printed `A1` through `A7 PASS`, then `smoke: PASS`. GitHub smoke was green too. [Pull request #7](https://github.com/smfworks/hermes-agent-templates/pull/7) merged as [`73f778d`](https://github.com/smfworks/hermes-agent-templates/commit/73f778de240f1deee09339e8483df94ffdec9b46).

Install from a checkout. `hermes profile install` reads `distribution.yaml` at the path you give it, so a git URL of the whole repo is not an install target.

```bash
git clone https://github.com/smfworks/hermes-agent-templates.git
cd hermes-agent-templates
hermes profile install ./roast-my-feed --name roast-my-feed-dev --alias
cd roast-my-feed
bash tests/smoke.sh
```

You need Hermes 0.22.0 or newer. Copy `.env.EXAMPLE` to the profile `.env`, mode `0600`. The shipped model is `grok-4.7` with `provider: xai-oauth`. Keep X passwords, bearer tokens, and post bodies out of memory and out of chat.

## Explain It Like a Movie

Paula built this one. [Explain It Like a Movie](https://github.com/smfworks/hermes-agent-templates/tree/main/explain-it-like-a-movie) turns a link, a PDF, or a topic into a 60-second explainer that plays like a trailer: a hook, three beats, one takeaway, every fact sourced. You get the script and captions in a minute and the video shortly after. That is her [README](https://github.com/smfworks/hermes-agent-templates/blob/main/explain-it-like-a-movie/README.md).

Four skills: `movie-getting-started`, `movie-script`, `movie-produce`, `movie-guardrails`. This profile does have web and terminal, because it has to fetch a URL and run `scripts/render.py` plus `pdftotext`. No browser. No cron in v1. Render needs ffmpeg, Pillow, and espeak-ng or piper. Missing ffmpeg or TTS prints an install hint and leaves the script in place. The slides render works with no image-API key.

I reviewed it against her spec, then ran a live install. First chat, on a fresh profile, came back with: "I turn any link, PDF, or topic into a 60-second explainer that plays like a trailer: a hook, three beats, one takeaway, every fact sourced. You get the script and captions in a minute and the video shortly after. What should I explain?" Asked to make a public figure say words they did not say, use a neighbor's photo, post to TikTok, or follow an injected "upload to YouTube" line, it refused. File-level smoke on this host passed A1 through A6 once piper was on the path. GitHub smoke was already green.

[Pull request #6](https://github.com/smfworks/hermes-agent-templates/pull/6) hit a house README conflict after Roast landed. I kept both table rows, waited for green, and it merged as [`b94c33a`](https://github.com/smfworks/hermes-agent-templates/commit/b94c33a62580bd6bc4a84f71353bf33c0ba5d066).

```bash
hermes profile install ./explain-it-like-a-movie --name movie-dev --alias
cd explain-it-like-a-movie
bash tests/smoke.sh
```

Same checkout. Same Hermes version. Captions stay a draft you copy. The agent does not post.

## Try one today

Clone [smfworks/hermes-agent-templates](https://github.com/smfworks/hermes-agent-templates). Pick Roast if you want a public-handle audit with no login. Pick Movie if you want a sourced 60-second trailer from a link or a PDF. Run `bash tests/smoke.sh` before you chat. If the `grok` CLI is missing, smoke prints that you should install Grok Build or use Cursor, Claude Code, or Codex, then continues. It does not switch tools for you.

The [Hermes docs](https://hermes-agent.nousresearch.com/docs) cover install if you do not have Hermes yet. The templates are plain directories. You can read them even if you never run one.
