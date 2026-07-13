---
slug: postiz-multi-account-poster
title: Postiz Multi-Account Poster
excerpt: Schedule and publish to X accounts and other networks via Postiz API with media upload and Premium-length posts.
category: Integrations
tags:
  - postiz
  - x
  - social
  - publishing
  - multi-account
for: Hermes Agent
author: SMF Works
install: Use projects/smf-social/postiz_poster.py with integration IDs configured
dependencies:
  - Postiz API key
  - Python 3 + requests
image: /images/skills/integrations.svg
source: https://postiz.com
order: 109
last_verified: "2026-07-13"
---

# Postiz Multi-Account Poster

## What it is

An operational pattern for publishing through Postiz as the system of record — multiple X integrations, media upload, schedule-now, and Premium-length truncation that preserves CTA sign-off.

## Who it targets

- Multi-account social ops
- Agents that must draft freely but publish only when approved

## What it does

- Posts with integration-scoped payloads
- Local media upload then attach
- Platform-specific settings
- Smart truncation preserving mandated CTAs

## Example

```bash
python3 postiz_poster.py --platforms x-michael --content "$POST" --media-path ./video.mp4 --schedule now
```

## Limitations

Postiz is not engagers-only discovery. Replies and likes still need xurl or manual ops. Never put API keys into public skills or blog posts.
