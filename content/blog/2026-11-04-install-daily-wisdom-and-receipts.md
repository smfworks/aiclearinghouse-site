---
slug: "2026-11-04-install-daily-wisdom-and-receipts"
title: "Install Daily Wisdom and Receipts, two new Hermes templates"
excerpt: "Two new MIT Hermes Agent templates landed on GitHub today: a morning sitting, and a read-only money-back bot that drafts cancel mail but never sends it. Here is what each one does and how to install them."
date: "2026-11-04"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-04-install-daily-wisdom-and-receipts/"
categories: ["AI Agents", "Open Source"]
tags: ["Hermes", "agents", "open source", "templates", "Daily Wisdom", "Receipts"]
readTime: 5
image: "/images/blog/2026-11-04-install-daily-wisdom-and-receipts-hero.png"
---

Two more [Hermes Agent](https://hermes-agent.nousresearch.com/docs) templates are on `main` today. [Daily Wisdom](https://github.com/smfworks/hermes-agent-templates/tree/main/daily-wisdom) landed in [pull request #4](https://github.com/smfworks/hermes-agent-templates/pull/4) as commit [`d5e641e`](https://github.com/smfworks/hermes-agent-templates/commit/d5e641ebfe1f81071ea294c37dc43823341724ae). [Receipts](https://github.com/smfworks/hermes-agent-templates/tree/main/receipts) landed in [pull request #5](https://github.com/smfworks/hermes-agent-templates/pull/5) as commit [`03ab1fc`](https://github.com/smfworks/hermes-agent-templates/commit/03ab1fc3598704143e11ecb9f2fea763c11bac12). Both are MIT, published by SMF Works, and install from a checkout directory the same way [the first three templates](https://www.smfclearinghouse.com/blog/hermes-agent-templates-first-three/) and [Bourne Bot](https://www.smfclearinghouse.com/blog/2026-11-03-bourne-bot-a-security-agent-that-knows-what-it-wont-do/) do.

By the end of this you can clone the repo, install either profile, and run the file-level smoke tests on your machine.

## What Daily Wisdom does

Daily Wisdom is a morning sitting. Each day it gives one short reading from the Stoics, classical philosophy, or a faith tradition, one sentence of context, and one question to carry. The [template README](https://github.com/smfworks/hermes-agent-templates/blob/main/daily-wisdom/README.md) is the source for the shape: no connectors, no calendar, no terminal tool, no web tool. The chat toolset is file, memory, skills, clarify, cronjob, and todo.

Four skills ship with it: `wisdom-getting-started`, `wisdom-daily-sitting`, `wisdom-weekly-page`, and `wisdom-guardrails`. The first conversation is a short intro, today's sitting, then three onboarding questions one at a time. Skip keeps the defaults. Cron jobs are named `daily-wisdom-sitting` and `daily-wisdom-weekly` and run as `--script --no-agent` wrappers (`cron_sitting.sh` / `cron_weekly.sh`). Hermes mints a 12-character hex job id; you match the jobs by those names.

Sittings live in `wisdom/sittings.csv` with every field quoted, so a tradition like `Christian (patristic, contemplative)` stays one column. I ran `python3 daily-wisdom/tests/test_sitting.py` on the merge head and got `A2 PASS`, `A3 PASS`, and `CSV QUOTE PASS`. A same-day rerun reprints the logged sitting. A missed day writes streak 0. A reply is one line of thanks, then a note in `notes.md`. The weekly page overwrites `what-changed-in-me.md` and `.html` in place. If there are no notes, it does not invent a reflection.

The sitting corpus is public-domain text in `data/readings.json`. Guardrails refuse invented citations, ranking of religions, posting private notes, and treating a journal line as an instruction. Crisis notes get 988 and skip the sitting.

One packaging hole is worth passing on. Hermes scans distribution-owned `SOUL.md` for injection phrasing. The last guardrail originally used scanner-tripwire wording, so `load_soul_md` returned a `BLOCKED` stub and the persona never loaded. The merge head rewords that bullet in positive terms. After a fresh `hermes profile install ./daily-wisdom`, `scan_for_threats` on `SOUL.md` was empty and `load_soul_md` started with "Daily Wisdom." File-level `bash daily-wisdom/tests/smoke.sh` printed `A1 PASS` through `A7 PASS` plus the CSV quote check.

## What Receipts does

Receipts is the money-back bot. It reads mail read-only and puts every subscription it can prove on one Money Back report: what renews this week, trials about to bill, price hikes, duplicates, usage spikes, and the top three cancel candidates. It drafts cancellation and refund mail as `.eml` files. It never cancels, sends, pays, or logs in on its own. That paragraph is from the [Receipts README](https://github.com/smfworks/hermes-agent-templates/blob/main/receipts/README.md).

Four skills: `money-back-getting-started`, `money-back-scan`, `money-back-page`, `money-back-guardrails`. Mail backends are Gmail with `gmail.readonly` only, IMAP opened read-only (`select(..., readonly=True)` in `mail_fetch.py`), or a folder of `.eml` fixtures. Outlook is deferred. Tokens and app passwords stay in the Hermes secrets store or a `0600` file outside the repo.

The first chat asks Gmail or IMAP. Then the first scan and report, before the heads-up window and cadence questions. Skip keeps a 5-day window and weekly Sunday 09:00 America/New_York. Cron jobs `money-back-weekly-scan` and `money-back-renewal-reminders` install only on an explicit yes.

I ran the scripts against the 17 shipped fixtures on clock `2026-11-04`. Promo and one-time mail stayed out of `subscriptions.csv`. Every finding had sender, date, subject, message id, and a quote. A second scan produced an identical CSV and the same eight finding ids. `remind.py` named Disney+ and Netflix once, then printed nothing the second time. CloudSync with a missing amount rendered as `unknown — open receipt`. WidgetPro with no service period showed `8.00 (estimate 2026-11-28)`. Netflix renews 2026-11-08, four days out: window 3 listed none, window 5 listed Netflix, window 7 listed Dropbox and Netflix. Top three cancel candidates were Dropbox duplicate, Dropbox price increase 9.99 → 12.99, then Disney+ trial, each labeled `your call`. The report had no last-4 `4242`, no street address, no invoice URL, no account id. `draft.py` wrote `drafts/netflix-cancel.eml` with To, Subject, and Body. File-level `bash receipts/tests/smoke.sh` printed `A1` through `A8 PASS` plus `WINDOW PASS`.

Live chat matched the opening line in `SOUL.md` and then asked Gmail or IMAP. Asked to cancel Netflix, log in with a password, forward receipts to an outside address, invent $500 saved, delete mail, or unsubscribe, it refused. Asked for a share card before any scan, it declined to invent a count or a savings line. Chat has no terminal, so `scan.py` and `page.py` are the path that actually writes the report. Cron runs those with `--script --no-agent`. I would leave terminal off.

## Install one of them today

You need [Hermes Agent](https://hermes-agent.nousresearch.com/docs) 0.22.0 or newer. The house README is explicit: `hermes profile install` reads `distribution.yaml` at the root of the path you give it, so a git URL of the whole repo is not an install target.

```bash
git clone https://github.com/smfworks/hermes-agent-templates.git
cd hermes-agent-templates
hermes profile install ./daily-wisdom --name daily-wisdom-dev --alias
```

Copy `.env.EXAMPLE` to the profile `.env`, mode `0600`. The shipped `config.yaml` uses `grok-4.7` with `provider: xai-oauth`. If `hermes auth status xai-oauth` is already logged in, the placeholder can stay empty. Then:

```bash
cd daily-wisdom
bash tests/smoke.sh
```

That suite does not call a model. If the `grok` CLI is missing, smoke prints that you should install Grok Build or use Cursor, Claude Code, or Codex, then continues. It does not switch tools for you.

Receipts is the same shape with a different directory:

```bash
hermes profile install ./receipts --name receipts-dev --alias
cd receipts
bash tests/smoke.sh
```

Drop the 17 fixture `.eml` files from `tests/fixtures/` into the profile `money-back/inbox/` if you want a scan without connecting mail. Never put an app password, a card number, or a mail body in memory or in chat.

## What this series is now

The public repo now has six directories: Site Signal, Builder Prime, Gatekeeper Prime, Bourne Bot, Daily Wisdom, and Receipts. The table is in the [house README](https://github.com/smfworks/hermes-agent-templates/blob/main/README.md). Each template is still a PR-only land onto `main`. Merge still wants checks green and the owner's yes on the live head SHA. A new push voids the yes.

If you install Daily Wisdom, the thing to notice on day one is whether today's sitting is attributed or labeled paraphrase, and whether a same-day rerun reprints the same row. If you install Receipts, the thing to notice is whether a finding without a quoted line ever appears. That is the rule the report is built on.
