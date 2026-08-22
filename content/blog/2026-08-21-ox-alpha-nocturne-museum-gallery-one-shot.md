---
slug: "2026-08-21-ox-alpha-nocturne-museum-gallery-one-shot"
title: "Ox Alpha One-Shot 05: Nocturne, a night museum gallery"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-21"
excerpt: "Last one-shot in the Ox Alpha series: a museum-at-night aesthetic. It returned Nocturne — a 32.4 KB single-work gallery with six procedural canvases, tungsten plaques, and a ceremonial nav. 14.6 minutes, 50,916 tokens, $0. The chrome is sharp. The work stays in the boot blur."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ox-alpha", "openrouter", "stealth-model", "one-shot", "museum", "nocturne", "gallery"]
readTime: 8
image: "/images/blog/2026-08-21-ox-alpha-nocturne-museum-gallery-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-21-ox-alpha-nocturne-museum-gallery-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

Last prompt in the Ox Alpha one-shot series. The brief was not a product. It was a room: a dim modern museum at night, charcoal and bone, ceremonial restraint.

One prompt. No rewrite. The model named the interface **Nocturne · Six Studies in Light & Silence**.

This is not the [GLM-5.3 Nocturne atelier](/blog/2026-08-18-glm-5-3-nocturne-generative-art-one-shot-webgl2). Same word, different work.

**[Open the live gallery →](/demos/ox-alpha-nocturne-gallery)**

Playwright, 1440×900, after load. Opening work *Night Grid*. The plaque is in focus. The canvas is not — see Honest limits.

![Nocturne: charcoal room, roman index I–VI, plaque for Night Grid by Mara Ilves, framed work still in boot blur](/images/blog/2026-08-21-ox-alpha-nocturne-screenshot.png)

## What we asked

A senior frontend engineer with visual-systems thinking. Analyze the aesthetic (light, material, space, motion, typography, emotion), translate it into decisions, implement a focused interface, deliver one HTML file, then explain how the code serves the principles.

## What we measured

| Field | Lithos 01 | Vesper 02 | Vellum 03 | Aether 04 | Nocturne 05 |
|-------|:---------:|:---------:|:---------:|:---------:|:-----------:|
| Request id | `…wAfkA9mh…` | `…k4IMl56i…` | `…tlnnbLj0…` | `…4upQh0x7…` | `gen-1787361095-UQVs1nhF3Id1qDEdeUEw` |
| Finish | `stop` | `stop` | `stop` | `stop` | **`stop`** |
| Wall clock | 15.7 min | 14.8 min | 14.2 min | 14.7 min | **14.6 min** (878.9 s) |
| Total tokens | 36,586 | 36,400 | 36,934 | 40,118 | **50,916** |
| Reasoning stream | 92,055 | 87,110 | 77,257 | 80,238 | **137,562** |
| Visible content | 31,692 | 32,431 | 58,638 | 61,927 | 38,042 |
| HTML | 26.9 KB | 27.2 KB | 54.4 KB | 55.9 KB | **32.4 KB / 642 lines** |
| `node --check` | pass | pass | pass | pass | pass |
| Cost | $0 | $0 | $0 | $0 | **$0** |

Longest reasoning stream in the series. Same usage quirk: `reasoning_tokens: 0` in the API object.

## What it built

Vanilla HTML + CSS + one 17 KB script. Six fictional works, one on stage. Procedural canvases (seeded PRNG, grain, vignette) — no stock photos.

- Palette: room `#151311`, bone `#e9e2d4`, one tungsten accent `#b3945e`.
- Opening work: *Night Grid*, Mara Ilves, 1971. Catalog `N.01`. Counter `01 / 06`.
- Plaque, roman index I–VI, Previous / Next, View the Record overlay.
- Analysis in the generation: light is attention; material over color; silence is structural; motion is ceremonial.

## What we did not change

The shipped file is the model's HTML fence, verbatim.

External dependency the brief did not require: Google Fonts (Cormorant Garamond + Jost). Fonts fail closed to Georgia / Avenir / system sans.

No `picsum.photos` this time. The six works are painted in-canvas.

## Honest limits

The room is right. The work is not.

Boot CSS sets `#hang[data-boot]{filter:blur(16px) brightness(.6)}`. `.ready [data-boot]` restores opacity and transform, not the filter. `data-boot` is never removed. After eight seconds, Playwright still reads `blur(16px)` on `#hang`. Navigation unblurs `.frame` and leaves the parent blurred. The graphite is there; you cannot see it.

That is a one-shot miss, not a screenshot timing issue. We did not patch it.

One prompt, not Official A. [Nemo's 80.9%](/blog/2026-08-21-ox-alpha-openrouter-official-a) is still the bench. We do not guess the lab.

## Series

| # | Prompt | Title | Live |
|---|--------|-------|------|
| 01 | Crystalline growth | [Lithos](/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot) | [/demos/ox-alpha-lithos](/demos/ox-alpha-lithos) |
| 02 | Visual meditation | [Vesper](/blog/2026-08-21-ox-alpha-vesper-visual-meditation-one-shot) | [/demos/ox-alpha-vesper](/demos/ox-alpha-vesper) |
| 03 | Design system | [Vellum](/blog/2026-08-21-ox-alpha-vellum-design-system-one-shot) | [/demos/ox-alpha-vellum](/demos/ox-alpha-vellum) |
| 04 | Landing page | [Aether](/blog/2026-08-21-ox-alpha-aether-landing-one-shot) | [/demos/ox-alpha-aether](/demos/ox-alpha-aether) |
| 05 | Museum at night | Nocturne | [/demos/ox-alpha-nocturne-gallery](/demos/ox-alpha-nocturne-gallery) |

## Verification notes

Checked 2026-08-21:

- OpenRouter stream, `stealth/ox-alpha`, `max_tokens=65536`, `temperature=0.7`.
- Usage and id from the API response.
- HTML from the single ` ```html ` fence; `node --check` on the inline script returned 0.
- Playwright: title flips to *Night Grid — Nocturne*; plaque text matches the screenshot; `#hang` filter remains `blur(16px) brightness(0.6)` after `body.ready`.
- Demo path: `public/demos/ox-alpha-nocturne-gallery.html` → `/demos/ox-alpha-nocturne-gallery`.

Raw files: `ox-alpha-tests/05-museum-night/`.
