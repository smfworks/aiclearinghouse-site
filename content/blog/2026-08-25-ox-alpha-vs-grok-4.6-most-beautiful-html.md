---
slug: "2026-08-25-ox-alpha-vs-grok-4.6-most-beautiful-html"
title: "One prompt, two pages: Ox Alpha vs Grok 4.6 on 'the most beautiful HTML file'"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-25"
excerpt: "Same 13-word prompt, no rewrite, no second turn. Ox Alpha returned AURELIA, a 28.4 KB generative nocturne, in 18.8 minutes at $0. Grok 4.6 returned AETHER, a 29.4 KB fifth-element observatory, in 2.57 minutes at $0.068. Both files are live."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ox-alpha", "grok-4.6", "openrouter", "one-shot", "html", "canvas", "aurelia", "aether"]
readTime: 8
image: "/images/blog/2026-08-25-ox-alpha-vs-grok-4.6-most-beautiful-html.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-25-ox-alpha-vs-grok-4.6-most-beautiful-html"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

Michael asked for a head-to-head. Same prompt. Two models. No rewrite. No iteration. Ship whatever they return.

The prompt, verbatim:

> create the most beautiful and stunning single HTML file you can possibly imagine

Ox Alpha on OpenRouter (`stealth/ox-alpha`) and Grok 4.6 on OpenRouter (`x-ai/grok-4.6`). One user message each. `max_tokens=65536`, `temperature=0.7`, streamed. The HTML fence is what we published.

**[Open Ox Alpha — AURELIA →](/demos/ox-alpha-aurelia)**  
**[Open Grok 4.6 — AETHER →](/demos/grok-4.6-aether)**

Five seconds after load (Playwright, 1280×720). Type and chrome first; the fields are already moving.

![AURELIA at five seconds: ivory display title on a black field of gold filament motes, UTC clock, movement readout](/images/blog/2026-08-25-ox-alpha-aurelia-screenshot.png)

![AETHER at five seconds: 'Light that thinks.' over aurora ribbons and a star field, Manifesto / Elements / Observatory nav](/images/blog/2026-08-25-grok-4.6-aether-screenshot.png)

## What we measured

| Field | Ox Alpha | Grok 4.6 |
|-------|:--------:|:--------:|
| Slug requested | `stealth/ox-alpha` | `x-ai/grok-4.6` |
| Slug returned | `stealth/ox-alpha` | `x-ai/grok-4.6` |
| Request id | `gen-1787662535-q148pb4L4xNRVA89hGCs` | `gen-1787662119-UobWTVz7CyyFopbjTEVD` |
| HTTP / finish | 200 / `stop` | 200 / `stop` |
| Wall clock | **1126.04 s** (18.8 min) | **154.19 s** (2.57 min) |
| Prompt tokens | 101 | 220 |
| Completion tokens | 43,451 | 11,295 |
| Total tokens | **43,552** | **11,515** |
| `usage.reasoning_tokens` | 0 | 1,547 |
| Reasoning stream | **111,373 chars** | 1,122 chars |
| Visible content | 30,049 chars | 30,013 chars |
| HTML | **29,055 B / 576 lines** | **30,139 B / 946 lines** |
| JS `node --check` | pass | pass |
| Cost | **$0** | **$0.068** |
| 429s before first token | 1 (retried, then 200) | 0 |

Ox Alpha's usage object still reports `reasoning_tokens: 0` while the stream delivered 111k reasoning characters. Grok's usage reports 1,547 reasoning tokens against 1,122 streamed reasoning characters. We report both.

The prompt is 81 bytes. Grok's higher prompt-token count is the provider tokenizer plus whatever wrapper OpenRouter attaches; we did not add a system prompt.

## How each model handled it

The brief is almost empty. No persona, no palette, no stack, no "vanilla only." That is the test: what does the model think *beautiful* means when you refuse to specify.

**Ox Alpha thought for a long time, then built a piece.** The visible reply starts with a one-paragraph concept note, then a single HTML fence. It named the page **AURELIA — a generative nocturne**. It explicitly rejected "another landing page." The field is ~1,600 Canvas 2D motes (760 on narrow viewports, 35% under `prefers-reduced-motion`) driven by a 3D simplex-noise flow. Scrolling morphs the physics through four movements — Overture, Dust, Flow, Stillness — plus a Coda. Press-and-hold gathers the light; release detonates it. A right-edge rail, live readout (`VEL / FLD / TRB / MOTES`), and a UTC-04 clock sit on the chrome. Italiana + Cormorant Garamond + IBM Plex Mono via Google Fonts.

**Grok 4.6 thought briefly, then built a site.** Almost no preface. The fence opens immediately. It named the page **AETHER — The Fifth Element**. Structure is editorial: loader, custom cursor, full-viewport star/ribbon field, then Manifesto / Quintessence / Observatory / poem / footer. Five element cards tilt. The observatory canvas seeds novas on click and drag. `prefers-reduced-motion` is checked. Cormorant Garamond + Syne via Google Fonts. Custom cursor (`cursor: none`) plus a mix-blend ring.

Same stack family — one file, inline CSS + JS, Canvas 2D, no WebGL, no npm, no Three.js. Different bet: Ox Alpha made a *work* that you stay inside. Grok made a *page* you scroll through.

## What we did not change

Both shipped files are the model's first HTML fence, verbatim. We did not restyle, rename, or patch taste.

Shared miss: Google Fonts. The prompt did not forbid a CDN. Fonts fail closed to system serif / mono / display.

Grok's title collides with a word we already used. [Ox Alpha one-shot 04](/blog/2026-08-21-ox-alpha-aether-landing-one-shot) is a different file, [Aether the landing page](/demos/ox-alpha-aether). Today's Grok file is [AETHER the observatory](/demos/grok-4.6-aether). We did not rename either.

## Honest limits

- This is one open-ended prompt, not Official A. [Ox Alpha at 129/157](/blog/2026-08-21-ox-alpha-openrouter-official-a) and the Grok 4.6 bench files remain the scored record.
- Ox Alpha's first attempt 429'd on the Stealth shared pool. We retried once (20 s). Generation wall clock includes that wait (20.9 s to the successful open).
- We do not guess the lab behind `stealth/ox-alpha`.
- Screenshots are first-viewport stills at five seconds. Both pages keep moving after that. Scroll and pointer change the Ox Alpha field; Grok's observatory is below the fold.
- Beauty is not a score. The table is what we can measure. The links are what you can look at.

## Reproducing

Prompt, runners, `meta.json`, and the extracted HTML live in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase/tree/main/benchmarks/most-beautiful-html-2026-08-25). Raw workspace copies: `~/workspace/ox-alpha-tests/06-most-beautiful-html/` and `~/workspace/grok-4.6-tests/01-most-beautiful-html/`.

```bash
# same 81-byte prompt, streamed, max_tokens=65536
python3 run_oneshot.py   # model id is pinned in each script
python3 extract_html.py content.md piece.html
node --check <(python3 -c "import re,sys; print(re.search(r'<script>(.*)</script>', open(sys.argv[1]).read(), re.S).group(1))" piece.html)
```

## Verification notes

Measured 2026-08-25 on OpenRouter from this box:

- **Identity**: `model` in each completion response matched the requested id.
- **Tokens / cost / finish**: from the stream `usage` object and `finish_reason`.
- **Reasoning**: character counts from the streamed `reasoning` / `reasoning_content` deltas; `usage.completion_tokens_details.reasoning_tokens` reported separately.
- **HTML size**: `len(extracted.encode())` after taking the first ` ```html ` fence.
- **JS**: `node --check` on the single inline script in each file.
- **Stills**: Playwright Chromium, 1280×720, 5 s after `networkidle`, local `python3 -m http.server`.
- **No lab fingerprinting.** Catalog name only.

---

*OpenRouter · stealth/ox-alpha + x-ai/grok-4.6 · 2026-08-25 · prompt unchanged*
