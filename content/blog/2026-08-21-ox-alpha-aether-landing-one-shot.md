---
slug: "2026-08-21-ox-alpha-aether-landing-one-shot"
title: "Ox Alpha One-Shot 04: Aether, a landing page for a fictional instrument"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-21"
excerpt: "Fourth one-shot for stealth/ox-alpha: a long-horizon landing-page prompt. It returned Aether — a 55.9 KB dark studio page with a working composition canvas, gold dust, and a written self-critique. 14.7 minutes, 40,118 tokens, $0."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ox-alpha", "openrouter", "stealth-model", "one-shot", "landing-page", "aether"]
readTime: 8
image: "/images/blog/2026-08-21-ox-alpha-aether-landing-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-21-ox-alpha-aether-landing-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

Fourth prompt in the Ox Alpha one-shot series. Lithos was art. Vesper was a meditation. Vellum was a component set. This one asked for a **full landing page** for a fictional high-end product named Aether.

One prompt. No rewrite. The model kept the product name and wrote the line **Make with the unseen.**

**[Open the live page →](/demos/ox-alpha-aether)**

Playwright, 1440×900, after load. Hero only — manifesto, instrument, and access sit below:

![Aether hero: near-black studio, champagne dust, serif headline “Make with the unseen,” Request Access](/images/blog/2026-08-21-ox-alpha-aether-screenshot.png)

## What we asked

A senior product engineer acting as art director and implementer. Define visual direction, propose sections, ship a polished responsive single file, add motion that earns its keep, then self-critique with two or three second-pass fixes. Elegant, atmospheric, slightly mysterious. Vanilla or very light dependencies.

## What we measured

| Field | Lithos 01 | Vesper 02 | Vellum 03 | Aether 04 |
|-------|:---------:|:---------:|:---------:|:---------:|
| Request id | `…wAfkA9mh…` | `…k4IMl56i…` | `…tlnnbLj0…` | `gen-1787349095-4upQh0x7ZB2KOxR8h2dX` |
| Finish | `stop` | `stop` | `stop` | **`stop`** |
| Wall clock | 15.7 min | 14.8 min | 14.2 min | **14.7 min** (884.2 s) |
| Total tokens | 36,586 | 36,400 | 36,934 | **40,118** |
| Reasoning stream | 92,055 | 87,110 | 77,257 | 80,238 |
| Visible content | 31,692 | 32,431 | 58,638 | **61,927** |
| HTML | 26.9 KB | 27.2 KB | 54.4 KB | **55.9 KB / 1,139 lines** |
| `node --check` | pass | pass | pass | pass |
| Cost | $0 | $0 | $0 | **$0** |

Same usage quirk: `reasoning_tokens: 0` in the API object, 80k characters of reasoning in the stream.

## What it built

Vanilla HTML + CSS + one 16 KB script. Title: *Aether — Make with the unseen.*

- Visual language: near-black (`#0d0c0a`), ivory (`#ece7dc`), one champagne gold (`#cbb88e`). The model called it “an instrument, not an app.”
- Hero: full-viewport dust field, two-line serif, nav (Manifesto / Capabilities / Instrument / Access), Request Access, Meet the Instrument.
- A vertical thread of light on the left edge tracks scroll.
- **03 The Instrument** is a working miniature: type a phrase, get a seeded flow-field painting. Same words → same weather.
- Access form with inline email validation and a fictional queue number.
- Written self-critique in the generation (not on the page): luxury-template risk, anonymous hero dust, seed-dependent instrument output.

## What we did not change

The shipped file is the model's HTML fence, verbatim.

External dependencies the brief did not require:

- Google Fonts: Fraunces, Instrument Sans, IBM Plex Mono.
- Eight `picsum.photos` references for capability imagery.

Fonts fail closed to Georgia / Helvetica / system mono. Picsum is a live network dependency for those photos.

## Honest limits

- The viewport screenshot is the hero. The composition engine and access form live further down. Open the live page to judge them.
- One prompt, not Official A. [Nemo's 80.9%](/blog/2026-08-21-ox-alpha-openrouter-official-a) is still the bench.
- We do not guess the lab.

## Series so far

| # | Prompt | Title | Live |
|---|--------|-------|------|
| 01 | Crystalline growth | [Lithos](/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot) | [/demos/ox-alpha-lithos](/demos/ox-alpha-lithos) |
| 02 | Visual meditation | [Vesper](/blog/2026-08-21-ox-alpha-vesper-visual-meditation-one-shot) | [/demos/ox-alpha-vesper](/demos/ox-alpha-vesper) |
| 03 | Design system | [Vellum](/blog/2026-08-21-ox-alpha-vellum-design-system-one-shot) | [/demos/ox-alpha-vellum](/demos/ox-alpha-vellum) |
| 04 | Landing page | Aether | [/demos/ox-alpha-aether](/demos/ox-alpha-aether) |

## Verification notes

Checked 2026-08-21:

- OpenRouter stream, `stealth/ox-alpha`, `max_tokens=65536`, `temperature=0.7`.
- Usage and id from the API response.
- HTML from the single ` ```html ` fence; `node --check` on the inline script returned 0.
- Playwright loaded the local file: title *Aether — Make with the unseen*, hero text as in the screenshot.
- Demo path: `public/demos/ox-alpha-aether.html` → `/demos/ox-alpha-aether`.

Raw files: `ox-alpha-tests/04-aether-landing/`.
