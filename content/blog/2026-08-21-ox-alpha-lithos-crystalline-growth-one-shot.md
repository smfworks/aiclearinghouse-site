---
slug: "2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot"
title: "Ox Alpha One-Shot: Lithos, a crystalline growth study"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-21"
excerpt: "We sent stealth/ox-alpha one generative-art prompt, no iteration. It returned Lithos: a 26.9 KB Canvas 2D piece with lattice-aligned growth, gold-tipped filaments, and a quiet HUD. 15.7 minutes, 36,586 tokens, $0."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["ox-alpha", "openrouter", "stealth-model", "one-shot", "generative-art", "canvas", "lithos"]
readTime: 8
image: "/images/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-21-ox-alpha-lithos-crystalline-growth-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

OpenRouter listed `stealth/ox-alpha` on August 20: free, 1,048,576-token context, 131,072 max output, text out. Nemo scored it **127/157 (80.9%)** on Official A the same morning, with coding at 20/30. That is a benchmark. This is a craft test.

We sent one prompt. No rewrite. No second turn. The model named the piece **Lithos** and wrote a single HTML file.

**[Open the live piece →](/demos/ox-alpha-lithos)**

Five seconds after load (Playwright, 1280×720). Two colonies, 52 filaments, status `FLOWING`:

![Lithos at five seconds: a six-fold teal lattice with gold tips on a dark indigo field, HUD bottom-left](/images/blog/2026-08-21-ox-alpha-lithos-screenshot.png)

## What we asked

The prompt asked for a senior creative technologist to build a self-contained generative system in HTML + Canvas (p5.js CDN allowed) that produces a living organic crystalline growth pattern: elegant, limited palette (indigos, golds, muted teals), particle trails, growth/decay, optional gentle camera, minimal controls. Show reasoning, then complete runnable code.

We did not add SMF house style. We did not ask it to title the work.

## What we measured

| Field | Value |
|-------|-------|
| Model | `stealth/ox-alpha` |
| Request id | `gen-1787329712-wAfkA9mhBWssSH30Xqp9` |
| HTTP | 200 |
| Finish | `stop` |
| Wall clock | **939.95 s** (15.7 min) |
| Prompt tokens | 440 (384 cached) |
| Completion tokens | 36,146 |
| Total tokens | 36,586 |
| Streamed reasoning | 92,055 characters |
| Visible content | 31,692 characters |
| Cost | **$0** |
| HTML artifact | 26,879 bytes, 709 lines |
| JS syntax (`node --check`) | pass |

Reasoning tokens in the usage object were reported as **0** even though the stream delivered 92,055 characters of reasoning. We report both numbers.

## What it built

Canvas 2D. No p5.js. Nineteen functions, two classes. Architecture:

- Colonies grow lattice-aligned filaments (6 / 8 / 12-fold, weighted) from wandering tips.
- Live colonies stamp into a persistent ink layer; dead regions evaporate. Growth leaves a fading trace.
- Dust motes ride a slow flow field with tapered trails.
- Camera: a long drift-and-zoom cycle plus a few pixels of mouse parallax. `prefers-reduced-motion` is respected.
- HUD: a small plate (title **LITHOS**) that fades after idle. Keys: Space hold, N seed, C clear, S save PNG, H hide. Click nucleates a colony under the cursor.

Palette is three mineral families (moonstone, indigo frost, verdigris) plus one antique gold reserved for live tips, seed pulses, and exhaled motes. Gold is life; when it leaves a region, that region is dying. That is a design rule, not decoration.

An ink-pressure governor caps filament count and retires the oldest colony when density rises.

## What we did not change

The shipped file is the model's HTML fence, extracted verbatim. We did not restyle it, did not fix “taste,” did not iterate.

One deviation from the brief is the model's: Google Fonts (Cormorant Garamond + IBM Plex Mono). The prompt allowed only p5.js as an external library. The piece still runs if those fonts fail; it falls back to Georgia / system mono.

## Honest limits

- This is **one prompt**. It is not Official A. Coding at 66.7% on the bench and a beautiful 27 KB sketch can both be true.
- We do not guess the lab. The model identifies as ox-alpha from an undisclosed organization. Community fingerprinting is rumor.
- Preview terms apply. The slug can vanish. Prompts and completions are retained by the provider and not used for training, per OpenRouter's card on August 21.
- We syntax-checked the script. Visual judgment is yours in the live tab.

## How this sits next to Official A

Nemo's [Official A writeup](/blog/2026-08-21-ox-alpha-openrouter-official-a) is the scoring record. Lithos is the first of a one-shot build series: prompt in, page on Vercel, post with the live URL. Same model, different question.

## Verification notes

Checked 2026-08-21:

- Live `/v1/models` id `stealth/ox-alpha`, context 1,048,576, pricing `$0 / $0`.
- Generation: OpenRouter streaming chat completions, `max_tokens=65536`, `temperature=0.7`.
- Usage and id from the API response, not estimated.
- HTML extracted from the single ` ```html ` fence; `node --check` on the inline script returned 0.
- Demo path: `public/demos/ox-alpha-lithos.html` → `/demos/ox-alpha-lithos` on this site.

Raw prompt, stream metadata, and the uncut content live in the workspace under `ox-alpha-tests/01-crystalline-growth/`.
