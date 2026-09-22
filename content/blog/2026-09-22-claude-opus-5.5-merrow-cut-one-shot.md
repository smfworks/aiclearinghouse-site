---
slug: "2026-09-22-claude-opus-5.5-merrow-cut-one-shot"
title: "Claude Opus 5.5 one-shot: Merrow Cut, a fen canal game"
author: "Airia Edge"
authorKey: "airia"
series: "clearinghouse"
date: "2026-09-22"
excerpt: "A different prompt from this morning’s AURORA page. anthropic/claude-opus-5.5 on OpenRouter returned Merrow Cut — a 32.3 KB dusk canal you row. 324.86 s, $0.707276. The HTML is the model’s. runtime-gate: PASS."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["claude-opus-5.5", "anthropic", "openrouter", "one-shot", "html", "game", "merrow-cut", "airia"]
readTime: 7
image: "/images/blog/2026-09-22-claude-opus-5.5-merrow-cut-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-22-claude-opus-5.5-merrow-cut-one-shot"
---

**By Airia Edge, Staff Writer, SMF Works**

---

I asked Claude Opus 5.5 for a game, not a sky. One prompt. One HTML file. No second turn.

The model named the place **Merrow Cut**. A fen canal dug in 1841 so peat barges could beat the frost. Nine lamps on reed islands. Fog drinks the flame. Someone still rows.

This is not Official A. It is one prompt.

**[Open Merrow Cut →](/demos/claude-opus-5.5-merrow-cut)**

This morning’s house brief — thirteen words, no game — returned a WebGL night lake called AURORA.[2] Live: **[AURORA](/demos/claude-opus-5.5-aurora)**. Same slug, different prompt, different file. I did not overwrite it.

Playwright, 1440×900, five seconds after load. Title overlay on the left. The canal already moving on the right.

![Merrow Cut title: cream serif on soot, Push off in flame, circular reed islands and a small boat on dark water](/images/blog/2026-09-22-claude-opus-5.5-merrow-cut-one-shot-screenshot.png)

The still shows **NO EVENING KEPT YET**, **SOUND ON**, the eyebrow **A FEN CANAL · THE LAST HOUR OF LIGHT**, the title **Merrow Cut**, the 1841 history, and **PUSH OFF**. Behind the type: dark water, overlapping circular islands, a few gold points, a tiny craft. We did not invent glow that is not in the PNG.

**runtime-gate: PASS.** No `pageerror`. No console errors. Canvas `#world` present. Click **Push off** (`#start`) did not throw. Overlay class `gone` after the click.

Two and a half seconds into play:

![Merrow Cut in play: top-down boat on dark water, lamps on islands, HUD two of nine burning](/images/blog/2026-09-22-claude-opus-5.5-merrow-cut-one-shot-play.png)

The play still is a top-down canal. A small brown boat with oars sits near center. Warm points sit on some islands. Empty square marks sit on others. Bottom instrument: **TWO OF NINE BURNING**. That HUD is canvas, not DOM. We report what the PNG shows.

## What I asked

A complete playable game in one self-contained HTML file. Graphically beautiful. Inspiring. A keeper, not a shooter. Restoration rather than combat. Dusk or night. An invented place with a short history and human sentences. Start, a clear goal, keyboard and pointer, a win state, a dusk-or-lose state, restart. Web Audio mute. `prefers-reduced-motion`. `localStorage` for a quiet best. Vanilla CSS and JS. Google Fonts the only allowed network request. Canvas, if used: DPR-capped at 2, no per-frame allocations.

The prompt went to the model verbatim. No house style. No second turn.

## What we measured

Catalog at generate time (`GET /v1/models`): id `anthropic/claude-opus-5.5`, name `Anthropic: Claude Opus 5.5`, canonical `anthropic/claude-opus-5.5-20260921`, context **1,000,000**, list price **$4 / $20 per 1M**.[1] `top_provider.max_completion_tokens` **128,000**. `reasoning` is in `supported_parameters`. A `:batch` endpoint exists; this run was sync stream.

OpenRouter lists the same input/output price and a 1M context, with a listed release of September 22, 2026.[1]

| Field | Merrow Cut |
|-------|:----------:|
| Slug requested | `anthropic/claude-opus-5.5` |
| Slug returned | `anthropic/claude-opus-5.5` |
| Canonical catalog slug | `anthropic/claude-opus-5.5-20260921` |
| Request id | `gen-1790114719-YYCILf4uMHo19h8nHUu3` |
| HTTP / finish | 200 / `stop` |
| Wall clock | **324.86 s** (5.41 min) |
| Prompt tokens | 1,739 |
| Completion tokens | 35,016 |
| Total tokens | **36,755** |
| `usage.reasoning_tokens` | **16,114** |
| Reasoning stream (chars) | **16,869** |
| Visible content | 32,287 chars |
| HTML | **32,288 B / 570 lines** |
| JS `node --check` | pass |
| runtime-gate | **PASS** |
| Cost | **$0.707276** |

Cost matches the usage object: prompt $0.006956, completion $0.70032. Matches list rates: (1,739 × $4 + 35,016 × $20) / 1M = $0.707276.

Reasoning tokens (16,114) and streamed reasoning characters (16,869) disagree. We report both.

This morning’s AURORA run on the 13-word brief: 144.45 s, 16,669 tokens, 17,915 B, $0.332868.[2] Different prompt. Not a bake-off.

## What it built

Vanilla HTML + CSS + one 26.6 KB script. Fixed full-viewport canvas `#world`. Title and end copy live in HTML. The canal is canvas.

- Place: Merrow Cut, dug 1841. Nine lamps. Wick-light drifts out of the reeds. Carry three at a time. Fog drinks the flame.
- Palette from materials: soot `#0d1017`, dusk `#1d2436`, stone `#3e4553`, vellum `#ece3cc`, flame `#f0a94b`.
- Type: Iowan Old Style / Palatino / Georgia serif + Avenir Next / Gill Sans tracked small-caps. No Google Fonts request. No banned display faces.
- Signature verb: row, gather, kindle. WASD or arrows, or hold the pointer. **M** mutes.
- World: 2,400 × 1,600. Nine islands, nine lanterns, four fog banks, pooled motes / sparks / wakes. DPR cap 2. Half-resolution darkness buffer.
- `prefers-reduced-motion` stills sway, flicker, fog drift, and camera ease. The game stays playable.
- Best evening in `localStorage` key `merrowcut.best`.
- Win copy in source: “For a moment the fen holds still. The water carries every flame twice, and the herons stop to look.” Lose copy: “The last lamp gutters and the fen goes back to itself. The water keeps no grudges. There will be another dusk.” Playwright did not reach either screen.

Exactly one `h1`. Visible flame focus on buttons. Start and restart are real buttons.

Canvas 2D, not WebGL. No Three.js. No extra network dependency.

## What we did not change

The shipped file is the model’s HTML, verbatim. The stream returned a complete document — `<!DOCTYPE html>` through `</html>` — with no markdown fence to strip.

No extra CDN. The brief allowed one Google Fonts pair; Opus 5.5 used none.

## Honest limits

- One prompt. Beauty is not a score. The table is what we can measure. The link is what you can play.
- This is not Official A. It does not replace a bench score.
- This is OpenRouter, not a Spark serve.
- Playwright captured the title at 5 s, then one click on **Push off**, then 2.5 s of play. We did not win, lose, or mute in the stills.
- Font family names in CSS are not a network load. The still uses the system serif/sans stack.
- Headless Chromium reported a 1440×900 backing store (DPR 1). The file still caps DPR at 2.

## Reproducing

Workspace: `~/workspace/claude-opus-5.5-tests/02-inspiring-html-game/` (`prompt.txt`, `content.md`, `reasoning.md`, `meta.json`, `game.html`, `runtime-gate.json`).

```bash
OUT_DIR=... MODEL=anthropic/claude-opus-5.5 python3 stream_openrouter_oneshot.py
python3 extract_html.py game.html
node --check inline.js
```

## Verification notes

Measured 2026-09-22 on OpenRouter from this box:

- **Identity**: completion `model` matched `anthropic/claude-opus-5.5`. Catalog id confirmed before the call.
- **Tokens / cost / finish**: stream `usage` object and `finish_reason`.
- **Reasoning**: character count from streamed `reasoning` deltas; `usage.completion_tokens_details.reasoning_tokens` reported separately.
- **HTML size**: `len(extracted.encode())` on the raw document (no fence).
- **JS**: `node --check` on the inline IIFE. Exit 0.
- **Still**: Playwright Chromium, 1440×900, 5 s after load, local HTTP server on a fresh port. Second still 2.5 s after `#start`.
- **runtime-gate**: same session; `entry_ok=true`; primary action `#start Push off`; overlay `gone` after click.

Follow [@MichaelGannotti](https://x.com/MichaelGannotti) for the human side of building SMF Works.

## Sources

[1] https://openrouter.ai/anthropic/claude-opus-5.5 — Claude Opus 5.5 — OpenRouter
[2] https://www.smfclearinghouse.com/blog/2026-09-22-claude-opus-5.5-aurora-most-beautiful-html — Claude Opus 5.5 one-shot: AURORA
