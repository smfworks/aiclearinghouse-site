---
slug: "2026-08-21-ox-alpha-vesper-visual-meditation-one-shot"
title: "Ox Alpha One-Shot 02: Vesper, a visual meditation"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-21"
excerpt: "Second one-shot for stealth/ox-alpha: a product-design prompt, no iteration. It returned Vesper — a 27.2 KB Canvas 2D meditation page with dusk/deep/mist atmospheres, pointer presence, and a 4-4-6-2 breath ritual. 14.8 minutes, 36,400 tokens, $0."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ox-alpha", "openrouter", "stealth-model", "one-shot", "visual-meditation", "vesper", "canvas"]
readTime: 7
image: "/images/blog/2026-08-21-ox-alpha-vesper-visual-meditation-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-21-ox-alpha-vesper-visual-meditation-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

Second prompt in the Ox Alpha one-shot series. Lithos asked for generative art. This one asked for a **product**: a single-page visual meditation — serene, refined, slightly mysterious — with typography, hierarchy, and one meaningful interaction.

One prompt. No rewrite. No second turn. The model named the page **Vesper**.

**[Open the live piece →](/demos/ox-alpha-vesper)**

Five seconds after load (Playwright, 1280×720). Title, quote, atmosphere switcher, breath pill, timer. The generative field is nearly black at this hour — the type is doing the work:

![Vesper at five seconds: warm-black page, serif quote, dusk/deep/mist switcher, Begin Breathing](/images/blog/2026-08-21-ox-alpha-vesper-screenshot.png)

## What we asked

A product designer / senior frontend engineer. Single HTML file, vanilla preferred. Calm generative ambient background, elegant type, desktop and mobile, at least one considered interaction. Show reasoning, then ship the page.

We did not add SMF house style. We did not name the piece.

## What we measured

| Field | Lithos (01) | Vesper (02) |
|-------|:-----------:|:-----------:|
| Request id | `gen-1787329712-wAfkA9mhBWssSH30Xqp9` | `gen-1787340095-k4IMl56iSabAxk6xvqcV` |
| HTTP / finish | 200 / `stop` | 200 / `stop` |
| Wall clock | 939.95 s | **890.65 s** (14.8 min) |
| Prompt tokens | 440 | 383 |
| Completion tokens | 36,146 | 36,017 |
| Total tokens | 36,586 | **36,400** |
| Reasoning stream | 92,055 chars | 87,110 chars |
| Visible content | 31,692 chars | 32,431 chars |
| HTML | 26,879 B / 709 lines | **27,211 B / 695 lines** |
| JS `node --check` | pass | pass |
| Cost | $0 | **$0** |

Usage again reports `reasoning_tokens: 0` while the stream delivered tens of thousands of reasoning characters. We report both.

## What it built

Canvas 2D. No p5. Sixteen functions. Title: *Vesper — a visual meditation*.

- Warm-black ground (`rgb(16,11,9)`), additive light-fields, film grain, vignette.
- Three atmospheres: **dusk** (ember), **deep** (teal), **mist** (sage). Keys `1/2/3`.
- Pointer as a candle: damped glow, slight parallax, dust motes pushed aside. Click drops a slow ring.
- Breath ritual: 4-4-6-2, hairline ring, words *inhale / hold / exhale*, rest as silence, roman-numeral cycle count. Key `B`.
- Optional sound (`S`). `Esc` surfaces. Corners stay dim until approached.
- Half-resolution glow buffer, pre-rendered grain, `visibilitychange` pause, damping via `exp(-dt·k)`.

## What we did not change

The shipped file is the model's HTML fence, verbatim.

Same brief miss as Lithos: Google Fonts (Cormorant Garamond + IBM Plex Mono). The prompt allowed a CDN only if necessary. Fonts fail closed to system serif / mono.

## Honest limits

- At five and fifteen seconds the field is **very dark**. The type and chrome are what you see first. That matches the model's own note — the page is meant to surface slowly — but a screenshot will look like a type study until your eyes (or the orbs) catch up.
- This is one prompt, not Official A. [Nemo's 80.9% score](/blog/2026-08-21-ox-alpha-openrouter-official-a) still stands as the bench.
- We do not guess the lab.

## Series so far

| # | Prompt | Title | Live |
|---|--------|-------|------|
| 01 | Organic crystalline growth | [Lithos](/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot) | [/demos/ox-alpha-lithos](/demos/ox-alpha-lithos) |
| 02 | Visual meditation micro-app | Vesper | [/demos/ox-alpha-vesper](/demos/ox-alpha-vesper) |

## Verification notes

Checked 2026-08-21:

- Generation: OpenRouter streaming, `stealth/ox-alpha`, `max_tokens=65536`, `temperature=0.7`.
- Usage and id from the API response.
- HTML extracted from the single ` ```html ` fence; `node --check` on the inline script returned 0.
- Playwright loaded `http://127.0.0.1:…/meditation.html`: title *Vesper — a visual meditation*, canvas present, HUD text as in the screenshot.
- Demo path: `public/demos/ox-alpha-vesper.html` → `/demos/ox-alpha-vesper`.

Raw prompt, stream metadata, and uncut content: `ox-alpha-tests/02-visual-meditation/`.
