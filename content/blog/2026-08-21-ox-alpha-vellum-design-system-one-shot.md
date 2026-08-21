---
slug: "2026-08-21-ox-alpha-vellum-design-system-one-shot"
title: "Ox Alpha One-Shot 03: Vellum, a print-mannered component set"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-21"
excerpt: "Third one-shot for stealth/ox-alpha: a design-systems prompt. It returned Vellum — a 54.4 KB specimen page with primary/secondary/ghost buttons, cards, fields, toasts, and a dark inversion. 14.2 minutes, 36,934 tokens, $0."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ox-alpha", "openrouter", "stealth-model", "one-shot", "design-system", "vellum", "css"]
readTime: 7
image: "/images/blog/2026-08-21-ox-alpha-vellum-design-system-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-21-ox-alpha-vellum-design-system-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

Third prompt in the Ox Alpha one-shot series. Lithos was art. Vesper was a product mood. This one asked for a **design system**: buttons, card, field, toast, and a demo page that is itself the specimen.

One prompt. No rewrite. The model named the set **Vellum**.

**[Open the live specimen →](/demos/ox-alpha-vellum)**

Playwright, 1440×900, after load. Hero only — the components sit below the fold:

![Vellum hero: cream paper, “Software with the manners of print,” pine primary button, palette dots](/images/blog/2026-08-21-ox-alpha-vellum-screenshot.png)

## What we asked

A senior frontend engineer / design-systems lead. Production-quality primitives: primary / secondary / ghost buttons with hover, focus, active; card; input; toast; a coherent demo. High-end, slightly luxurious. No Bootstrap default look. Show reasoning, then ship.

## What we measured

| Field | Lithos 01 | Vesper 02 | Vellum 03 |
|-------|:---------:|:---------:|:---------:|
| Request id | `…wAfkA9mh…` | `…k4IMl56i…` | `gen-1787343012-tlnnbLj0b7tdH293ONhC` |
| Finish | `stop` | `stop` | **`stop`** |
| Wall clock | 15.7 min | 14.8 min | **14.2 min** (849.3 s) |
| Total tokens | 36,586 | 36,400 | **36,934** |
| Reasoning stream | 92,055 | 87,110 | 77,257 |
| Visible content | 31,692 | 32,431 | **58,638** |
| HTML | 26.9 KB | 27.2 KB | **54.4 KB / 1,268 lines** |
| `node --check` | pass | pass | pass |
| Cost | $0 | $0 | **$0** |

Same usage quirk: `reasoning_tokens: 0` in the API object, 77k characters of reasoning in the stream.

## What it built

Vanilla HTML + CSS, one 6.3 KB script for toasts, inversion, and a year stamp. Title: *Vellum — Component Specimen*.

- Visual language: warm paper (`#F4EFE6` / `#FBF8F1`), pine (`#20433A`), ink (`#211C14`), brick (`#A2402E`).
- Buttons: `btn--primary`, `btn--secondary`, `btn--ghost`, sizes `sm` / default / `lg`, icon variant. Playwright text: “Hover lifts by a single pixel.”
- Nav: Buttons, Card, Fields, Toasts, Inversion. Pill: `v1.0 · specimen`.
- Card, fields, toast styles, and a dark inversion toggle are in the page below the hero.
- Circular colophon stamp. Palette strip on the hero.

## What we did not change

The shipped file is the model's HTML fence, verbatim.

External dependencies the brief did not require:

- Google Fonts: Fraunces, Instrument Sans, Spline Sans Mono.
- Three `picsum.photos` card images.

Fonts fail closed to system stacks. Picsum is a live network dependency for those photos.

## Honest limits

- The viewport screenshot is the hero. The four primitives live further down. Open the live page to judge states.
- One prompt, not Official A. [Nemo's 80.9%](/blog/2026-08-21-ox-alpha-openrouter-official-a) is still the bench.
- We do not guess the lab.

## Series so far

| # | Prompt | Title | Live |
|---|--------|-------|------|
| 01 | Crystalline growth | [Lithos](/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot) | [/demos/ox-alpha-lithos](/demos/ox-alpha-lithos) |
| 02 | Visual meditation | [Vesper](/blog/2026-08-21-ox-alpha-vesper-visual-meditation-one-shot) | [/demos/ox-alpha-vesper](/demos/ox-alpha-vesper) |
| 03 | Design system | Vellum | [/demos/ox-alpha-vellum](/demos/ox-alpha-vellum) |

## Verification notes

Checked 2026-08-21:

- OpenRouter stream, `stealth/ox-alpha`, `max_tokens=65536`, `temperature=0.7`.
- Usage and id from the API response.
- HTML from the single ` ```html ` fence; `node --check` on the inline script returned 0.
- Playwright loaded the local file: title *Vellum — Component Specimen*, hero text and palette as in the screenshot.
- Demo path: `public/demos/ox-alpha-vellum.html` → `/demos/ox-alpha-vellum`.

Raw files: `ox-alpha-tests/03-design-system/`.
