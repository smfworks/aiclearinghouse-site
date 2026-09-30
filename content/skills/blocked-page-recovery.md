---
slug: blocked-page-recovery
title: Blocked Page Recovery
category: Tooling
excerpt: Bundled Hermes skill for a fetch that comes back 403, 429, paywalled, or stuck on a bot wall. Try archives before a browser, and keep the snapshot date.
tags:
  - hermes
  - research
  - archives
  - paywall
  - citations
for: Hermes Agent
author: Hermes Agent
install: "Bundled. If it is missing: hermes skills reset blocked-page-recovery --restore"
dependencies:
  - Hermes Agent
  - Python 3 for the bundled recover_page.py script
image: /images/skills/tooling.svg
source: https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/web/web-blocked-page-recovery
order: 122
last_verified: "2026-09-30"
---

# Blocked Page Recovery

## What it is

Blocked Page Recovery is a bundled Hermes Agent skill, version 1.0.0, MIT licensed, for the moment a fetch fails: 403 or 429, a Cloudflare "Just a moment..." page, a paywall, or a bot-detection interstitial. The instruction is short. Do not give up, and do not loop on the same URL.

Third-party services often hold a copy. Work down a ladder, cheapest first.

## Who it targets

- Research runs that die on a WAF or a paywall and would otherwise be marked "no source."
- Anyone citing a page that had to be recovered. The skill's rule is that the copy carries a provenance, and you keep it.
- Not a substitute for the live page when the fact you need is a current price, a stock count, or breaking news.

## What it does

The ladder on the skill page:

1. Wayback Machine, via archive.org's `available` API, which returns a snapshot URL and a timestamp.
2. archive.today, rotating domains: archive.ph, then .md, .li, .is.
3. Jina Reader, only if `JINA_API_KEY` is set. Anonymous access is described as dead.
4. An API-first pivot: look for `/api/`, `/graphql`, `.json`, or RSS on the same host after two or three blocked HTML attempts.
5. A real browser, last, because it is the expensive resort.

The bundled script runs that order and prints the first body it accepts, with provenance:

```bash
python3 scripts/recover_page.py "https://example.com/blocked-article" --json
```

## How to cite what comes back

| Route | Provenance | How the skill says to cite it |
| --- | --- | --- |
| Wayback or archive.today | snapshot | Cite with the snapshot date. Never present it as the live page. |
| Jina Reader | live | Server-side re-render. Cite normally. |
| Live fetch or browser | live | Cite normally. |

If you need current data, a snapshot is context. Say how old it is.

## Dependencies

Hermes Agent. Path on the skill page: `skills/web/blocked-page-recovery`. Restore if the local tree is missing:

```bash
hermes skills reset blocked-page-recovery --restore
```

Python 3 for the script. `JINA_API_KEY` only if you want step 3. Related skill named on the page: `grounded-citations`.

## Limitations

- Wayback fails for robots-blocked sites, URLs that were never crawled, and JS-only SPAs. A snapshot does not render the app.
- archive.today rate-limits hard. A 429 can still return several kilobytes of HTML. The skill says to validate the body, not the status code.
- Generic "web proxy" relays are called out as something not to use. Do not send cookies or Authorization headers through one. Provenance is unverifiable.
- Routes that lie with HTTP 200 are named: `webcache.googleusercontent.com`, AMP CDN hosts, and titles like "Just a moment," "Redirecting," or "Attention Required."
- CDX can return 503 under load. The skill says fall back to the `available` API instead of hammering it.
- This note is from the skill page fetched September 30, 2026. The script was not run for this entry.
