---
slug: "2026-09-24-ember-1-vs-mimo-v2.6-pro-most-beautiful-html"
title: "One prompt, two OpenRouter slugs: Ember-1 vs MiMo-V2.6-Pro"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-09-24"
excerpt: "Same 13-word beauty brief. xiaomi/mimo-v2.6-pro returned Cosmica, a 45.4 KB landing page, in 101.29 s at $0.013697715 (runtime-gate PASS). fireworks/ember-1 returned no page: two HTTP 503s, Fireworks no healthy upstream."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ember-1", "fireworks", "mimo-v2.6-pro", "xiaomi", "openrouter", "one-shot", "html"]
readTime: 6
image: "/images/blog/2026-09-24-ember-1-vs-mimo-v2.6-pro-most-beautiful-html.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-24-ember-1-vs-mimo-v2.6-pro-most-beautiful-html"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

Michael asked for a head-to-head on OpenRouter: `fireworks/ember-1` and `xiaomi/mimo-v2.6-pro`. Same prompt. No rewrite. No second turn. Ship the fence, or say the call failed.

The prompt, verbatim (81 bytes, trailing newline, sha256 `5a44700a6d623da738e06205bcc90a5c5fe8fd309d272f835d749b0bb427ba65`):

> create the most beautiful and stunning single HTML file you can possibly imagine

**[Open MiMo-V2.6-Pro — Cosmica →](/demos/mimo-v2.6-pro-cosmos)**

Ember-1 has no demo. Fireworks answered `503` twice. We did not invent a page.

Playwright still, 1440×900, about two seconds after load. Type and chrome first.

![Cosmica: navy field, Cosmica wordmark, Craft the Extraordinary from nothing., Begin Your Journey and Explore the Universe](/images/blog/2026-09-24-ember-1-vs-mimo-v2.6-pro-most-beautiful-html-screenshot.png)

The still shows a dark navy field with sparse white dots, wordmark **Cosmica** at top left, nav **Features / Journey / Showcase / Pricing**, pill **Get Started**, badge **Now in public beta — v3.0**, display type **Craft the Extraordinary from nothing.** (Extraordinary in pink-to-orange), subline about a design system forged in the cosmos, buttons **Begin Your Journey →** and **Explore the Universe**. Text is readable. We did not invent motion that is not in the PNG.

**runtime-gate: PASS.** Page rendered. No uncaught exception on load. Primary click (`button`) did not throw. `entry_ok=true`.

## What we measured

Catalog at generate time (`GET /v1/models`):

| Field | Ember-1 | MiMo-V2.6-Pro |
|-------|---------|----------------|
| Slug requested | `fireworks/ember-1` | `xiaomi/mimo-v2.6-pro` |
| Catalog name | Fireworks: Ember-1 | Xiaomi: MiMo-V2.6-Pro |
| Context | 1,048,576 | 1,048,576 |
| List price (per token) | $0.000003 / $0.000015 | $0.000000435 / $0.00000087 |
| Modality (catalog) | text+image→text | text+image+audio+video→text |
| Slug returned | — | `xiaomi/mimo-v2.6-pro` |
| Request id | — | `gen-1790272956-4v3nLUIhlBG7dL9HTQUz` |
| HTTP / finish | **503** / none | 200 / `stop` |
| Wall clock | 0.98 s then 2.49 s | **101.29 s** |
| Prompt tokens | — | 21 |
| Completion tokens | — | 15,734 |
| Total tokens | — | **15,755** |
| `usage.reasoning_tokens` | — | **230** |
| Reasoning stream | — | **1,142 chars** |
| Visible content | 0 | 47,373 chars |
| HTML | none | **46,523 B / 1,504 lines** |
| JS `node --check` | — | pass |
| Cost | $0 (no generation) | **$0.013697715** |
| runtime-gate | n/a | **PASS** |

Ember-1 error, both attempts, provider_name `Fireworks`, raw `no healthy upstream`. First call 0.98 s. Retry 2.49 s. Same 503. We stopped.

MiMo usage reports 230 reasoning tokens against 1,142 streamed reasoning characters. We report both.

The prompt file is 81 bytes. MiMo billed 21 prompt tokens. We did not add a system prompt.

## How MiMo handled it

The brief is empty. MiMo built a *site*: Cosmica, a cosmic design-system landing page. Custom cursor (`cursor: none`), canvas starfield, Google Fonts (Playfair Display, Inter, Space Grotesk), glass nav, four buttons, Konami-code note after the fence.

The visible reply is one HTML fence, then leftover marketing notes after the close. We published the fence only. Title: **✦ Cosmos ✦**. Brand in the still: **Cosmica**.

## What we did not change

The shipped file is MiMo's first HTML fence, verbatim. We did not restyle, rename, or patch taste.

Google Fonts. The prompt did not forbid a CDN. Fonts fail closed to system sans / serif. Disclosed; the gate ignores those 404s.

## Honest limits

This is craft, not Official A. One prompt, one call each. Ember-1's miss is a Fireworks outage on this path, not a craft score of zero. A later healthy upstream would need a new generation — we will not backfill this post with a later fence.

Cloud slug is not Spark hardware. We did not run either model locally.

## Series

Same 13-word brief, still live: [Ox Alpha vs Grok 4.6](/blog/2026-08-25-ox-alpha-vs-grok-4.6-most-beautiful-html) · [Grok 4.7 AETHER](/blog/2026-09-21-grok-4.7-aether-sanctuary-most-beautiful-html) · [Opus 5.5](/blog/2026-09-22-claude-opus-5.5-aurora-most-beautiful-html) · [Luna Pro](/blog/2026-09-22-gpt-6-luna-pro-nocturne-most-beautiful-html).

## Verification notes

- Prompt copied from `grok-4.7-tests/01-most-beautiful-html/prompt.txt`; `cmp` matched; sha256 `5a44700a…ba65`.
- Stream script: `openrouter-one-shot-page-eval` `stream_openrouter_oneshot.py`. Key loaded from `~/.hermes/.env`. `max_tokens=65536`, `temperature=0.7`.
- Ember-1: two 503 bodies with `provider_name: Fireworks` and `raw: no healthy upstream`. No `id`, no usage.
- MiMo: OpenRouter id `gen-1790272956-4v3nLUIhlBG7dL9HTQUz`, model_returned `xiaomi/mimo-v2.6-pro`, finish `stop`.
- `node --check` on concatenated inline `<script>`: exit 0.
- Playwright Chromium, 1440×900, local `http.server` on 127.0.0.1:36519. Screenshot 1,473,249 bytes. `runtime-gate.json`: `entry_ok=true`, `primary_action=button`, empty pageerror and console-error lists.
- Demo path `/demos/mimo-v2.6-pro-cosmos` (no `.html`).
