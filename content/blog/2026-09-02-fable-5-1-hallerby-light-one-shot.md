---
slug: "2026-09-02-fable-5-1-hallerby-light-one-shot"
title: "Fable 5.1 One-Shot: Hallerby Light, a skerry night window"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-09-02"
excerpt: "OpenRouter anthropic/claude-fable-5.1, one craft prompt, no rewrite. It returned Hallerby Light — a 29.5 KB night lighthouse with a falling-weight clockwork you hold to wind. 4.96 minutes, 25,678 tokens, $1.23074. The HTML is the model's."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["fable-5.1", "openrouter", "one-shot", "claude-fable", "lighthouse", "canvas", "hallerby"]
readTime: 7
image: "/images/blog/2026-09-02-fable-5-1-hallerby-light-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-02-fable-5-1-hallerby-light-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

OpenRouter listed `anthropic/claude-fable-5.1`. We gave it one craft prompt — a self-contained HTML night window, not a landing page — and shipped the file it wrote.

The model named the place **Hallerby Light**. A skerry on an outer fjärd, lit 1884. Two flashes every twelve seconds. The lens turns because a weight is falling. Winding it is your job.

This is not Official A. It is one prompt.

**[Open the live page →](/demos/fable-5-1-hallerby-light)**

Playwright, 1440×900, 2.5 seconds after load. Drive weight had already dropped from 34% to 32%. The beam is on.

![Hallerby Light: soot sky, cream display type, brass italic on Light, twin beams from a skerry tower, clockwork panel at 32% / every 12 s](/images/blog/2026-09-02-fable-5-1-hallerby-light-screenshot.png)

## What we asked

One HTML file. Invented place with night atmosphere. Restrained name, short history, human sentences. System type stacks preferred. Palette from named materials. One signature interaction with causality. No SaaS, no portfolio, no clock-as-product. Google Fonts the only allowed network request. Vanilla CSS and JS. Canvas, if used: DPR-capped at 2, no per-frame allocations.

The prompt went to the model verbatim. No house style. No second turn.

## What we measured

| Field | Hallerby Light |
|-------|:--------------:|
| Request id | `gen-1788365419-jWOYX1Jow31oIwVj6vDk` |
| Model requested | `anthropic/claude-fable-5.1` |
| Model returned | `anthropic/claude-fable-5.1` |
| Finish | `stop` |
| HTTP | 200 |
| Wall clock | **4.96 min** (297.8 s) |
| Prompt tokens | 1,329 |
| Completion tokens | 24,349 |
| Total tokens | **25,678** |
| Reasoning tokens (API) | 9,520 |
| Reasoning stream | 9,917 chars |
| Visible content | 30,141 chars |
| HTML | **29.5 KB / 819 lines** |
| `node --check` | pass |
| Cost | **$1.23074** |

Prompt cost $0.01329. Completion cost $1.21745. Matches the OpenRouter `cost_details` object. Not an estimate.

Unlike the August Ox Alpha series, API `reasoning_tokens` and streamed reasoning characters agree here.

## What it built

Vanilla HTML + CSS + one 14.5 KB script. Fixed full-viewport canvas `#scene`. Prose scrolls over it. A brass instrument stays in the corner.

- Place: Hallerby Light, outer fjärd, 59°41′ N, lit 1884.
- Palette from materials: soot `#090b0f`, wet stone, vellum `#e7dfcf`, ash, brass `#c9963a` as the single accent, lake water `#14262c`.
- Type: Iowan Old Style / Palatino / Georgia serif + Helvetica Neue tracked small-caps. No Google Fonts request. No banned display faces.
- Signature interaction: hold **Hold to wind**. A cast-iron weight climbs the shaft; let go and it falls. Beam period is a function of drive weight. Start state 34%. At 2.5 s Playwright read 32% and `every 12 s`.
- Copy in a human voice: the wreck of the *Ansgar*, Barbier & Fenestre lens, five keepers, four log entries, no scheduled boat. Footer: "Hallerby Light is an invention. The reef is not on any chart."
- Exactly one `h1`. Skip link. Visible brass focus. `prefers-reduced-motion` freezes beam angle. Keyboard can wind.

Canvas is DPR-aware, cap 2. Stars and water lines are `Float32Array`s allocated once. Gradients rebuilt on resize, not per frame.

## What we did not change

The shipped file is the model's HTML, verbatim. The stream returned a complete document — `<!DOCTYPE html>` through `</html>` — with no markdown fence to strip.

No extra network dependency. The brief allowed one Google Fonts pair; Fable used none.

We did not restyle, did not patch taste, did not hold the wind button for the still.

## Honest limits

The still is a moment in a running simulation. The weight is already falling. We did not wait for dark, and we did not wind it back up.

This is one prompt, not a bench. It does not replace Official A, and it does not say anything about what runs on Sparks.

Catalog slug only. We do not add a lab story on top of `anthropic/claude-fable-5.1`.

Credit remaining after this gen is not measured here. This run cost $1.23074.

## Prior craft, different model

| # | Model | Title | Live |
|---|--------|-------|------|
| — | `stealth/ox-alpha` | [Lithos](/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot) | [/demos/ox-alpha-lithos](/demos/ox-alpha-lithos) |
| — | `stealth/ox-alpha` | [Vesper](/blog/2026-08-21-ox-alpha-vesper-visual-meditation-one-shot) | [/demos/ox-alpha-vesper](/demos/ox-alpha-vesper) |
| — | `stealth/ox-alpha` | [Vellum](/blog/2026-08-21-ox-alpha-vellum-design-system-one-shot) | [/demos/ox-alpha-vellum](/demos/ox-alpha-vellum) |
| — | `stealth/ox-alpha` | [Aether](/blog/2026-08-21-ox-alpha-aether-landing-one-shot) | [/demos/ox-alpha-aether](/demos/ox-alpha-aether) |
| — | `stealth/ox-alpha` | [Nocturne](/blog/2026-08-21-ox-alpha-nocturne-museum-gallery-one-shot) | [/demos/ox-alpha-nocturne-gallery](/demos/ox-alpha-nocturne-gallery) |
| 01 | `anthropic/claude-fable-5.1` | Hallerby Light | [/demos/fable-5-1-hallerby-light](/demos/fable-5-1-hallerby-light) |

## Verification notes

Checked 2026-09-02:

- OpenRouter stream, `anthropic/claude-fable-5.1`, `max_tokens=65536`, timeout 1800 s.
- Usage, id, cost, and finish from `meta.json` (`http_status` 200, `finish_reason` `stop`).
- HTML copied from `content.md`; starts `<!DOCTYPE html>` and closes `</html>`.
- `node --check` on the inline script returned 0.
- Playwright against a local `http.server` on port 44525, viewport 1440×900: title *Hallerby Light — a skerry light on the outer fjärd*; `#wOut` `32%`; `#pOut` `every 12 s`; `#wind` present; `#scene` 1440×900.
- Zero extra `http(s)` URLs in the file.
- Demo path: `public/demos/fable-5-1-hallerby-light.html` → `/demos/fable-5-1-hallerby-light`.

Raw files: `fable-5.1-tests/01-night-window/`.
