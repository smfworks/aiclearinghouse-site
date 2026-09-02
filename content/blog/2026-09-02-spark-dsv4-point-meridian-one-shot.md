---
slug: "2026-09-02-spark-dsv4-point-meridian-one-shot"
title: "Same prompt, Spark DSV4: Point Meridian Light vs Hallerby"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-09-02"
excerpt: "The Hallerby Light prompt, unchanged, against live dual-Spark vLLM deepseek-v4-flash-vision-exp. It returned Point Meridian Light — a 12.0 KB SVG keeper's log with a scroll-driven beam. 5.32 minutes, 18,258 tokens, $0. Not Hallerby. Still a night window."
categories: ["AI", "Model Evaluation", "Creative Coding", "DGX Spark"]
tags: ["deepseek-v4-flash", "dgx-spark", "one-shot", "fable-5.1", "lighthouse", "comparison"]
readTime: 7
image: "/images/blog/2026-09-02-spark-dsv4-point-meridian-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-02-spark-dsv4-point-meridian-one-shot"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

Same prompt as [Hallerby Light](/blog/2026-09-02-fable-5-1-hallerby-light-one-shot). Same SHA. No rewrite. This time the endpoint was our live Spark serve, not OpenRouter.

Live-check before the call, `GET http://10.0.0.33:8888/v1/models` and `/health` 200: `id=deepseek-v4-flash-vision-exp`, `owned_by=vllm`, `root=deepseek-ai/DeepSeek-V4-Flash-Vision-Exp`, `max_model_len=1048576`.

The model named the place **Point Meridian Light**. Keeper's log, 1893. Elias Thorne, 1887–1924. Three weather notes. A beam that turns as you scroll.

This is not Official A. It is one prompt on two stacks.

**[Open the Spark page →](/demos/spark-dsv4-point-meridian-light)** · **[Open Hallerby (Fable 5.1) →](/demos/fable-5-1-hallerby-light)**

Playwright, 1440×900, after load. Title in tracked serif. First log card already `.lit`. SVG tower behind the card.

![Point Meridian Light: cream uppercase title, Keeper's Log 1893, flat gold beam, Heavy Seas card over a banded SVG lighthouse](/images/blog/2026-09-02-spark-dsv4-point-meridian-screenshot.png)

## What we asked

The Hallerby brief, byte-for-byte. Prompt SHA `1e109cee58c9d4e5ab1eb2d0c31829d50ee3a67fc4fa9425eefff6f9120285c3`.

Thinking on, because the prompt tells the model to think first, then write the file. Temperature 0.7. `max_tokens=65536`. One user message. No system prompt.

## What we measured

| Field | Fable 5.1 (OpenRouter) | Spark DSV4 (vLLM) |
|-------|:----------------------:|:-----------------:|
| Endpoint | OpenRouter | `http://10.0.0.33:8888` |
| Model requested | `anthropic/claude-fable-5.1` | `deepseek-v4-flash-vision-exp` |
| Model returned | `anthropic/claude-fable-5.1` | `deepseek-v4-flash-vision-exp` |
| Request id | `gen-1788365419-jWOYX1Jow31oIwVj6vDk` | `chatcmpl-a37c5780714b51ee` |
| Finish | `stop` | `stop` |
| HTTP | 200 | 200 |
| Wall clock | 4.96 min (297.8 s) | **5.32 min (319.1 s)** |
| Prompt tokens | 1,329 | 842 |
| Completion tokens | 24,349 | 17,416 |
| Total tokens | 25,678 | **18,258** |
| Reasoning stream | 9,917 chars | **47,309 chars** |
| Visible content | 30,141 chars | 12,248 chars |
| HTML | 29.5 KB / 819 lines | **12.0 KB / 328 lines** |
| `node --check` | pass | pass |
| Cost | $1.23074 | **$0** (local) |

Prompt-token counts differ because the tokenizers differ. Same file.

Spark spent most of its tokens thinking. The HTML is less than half of Hallerby's.

## What it built

Vanilla HTML + CSS + one 1.7 KB script. No canvas. A fixed SVG scene. Three `<article>` log entries. Scroll drives the beam.

- Place: Point Meridian Light. Keeper Elias Thorne. Three days in November 1893: Heavy Seas, Calm Water, Thick Fog.
- Palette: soot `#060a10`, vellum `#e8dcc8`, brass `#c9a96e`, fog gray `#8a8a7a`, lamp gold `#ffd700`.
- Type: Google Fonts pair Cormorant Garamond + IBM Plex Sans, with Iowan / Palatino / Georgia and Helvetica Neue fallbacks. Playwright read the Google face on the `h1`.
- Signature interaction: scroll progress rotates `.beam` ±60°. Log cards gain `.lit` when their center is near mid-viewport. Passive listeners. Work goes through `requestAnimationFrame`.
- Exactly one `h1`. `prefers-reduced-motion` kills CSS transitions. Footer names the keeper.

The brief allowed one Google Fonts request. Spark used it. Fable used none.

## What we did not change

The shipped file is the model's HTML fence, verbatim. Fence in, `</html>` out. No restyle.

## Side by side, without a score

Hallerby is an instrument. You hold a brass control. A weight falls. The period of the light is a function of that weight. The copy has a wreck, a lens maker, five keepers, four log lines, and a boat that may not come.

Point Meridian is a title card and a short log. The beam is a CSS rotate on an SVG cone. The tower is a rectangle with three brass bands. The cards sit on top of the lamp. That is what the still shows.

Both finished. Both `stop`. Both pass `node --check`. Spark was 21 seconds slower and produced less page. It thought more (47 KB of reasoning vs 10 KB) and wrote less. Local cost was zero.

Quality is not a mystery here. Hallerby is the denser artifact. Point Meridian still has a temperature: night, brass, a keeper who hopes the ship heard the bell. That is more than a template. It is not the same craft.

## Honest limits

- `prefers-reduced-motion` stills transitions. The script still rotates the beam. The static composition holds; the motion preference is incomplete.
- No skip link. No keyboard control beyond scroll. Header is `pointer-events: none`.
- `getBoundingClientRect` on every scroll frame. The brief asked for no layout thrash.
- Gold lamp `#ffd700` plus brass `#c9a96e` — two yellows. Hallerby kept one accent.
- This serve's `/v1/models` id is what we called. We do not add tok/s we did not measure as a separate probe. We do not call this Official A.

## Live pages

| Stack | Title | Live |
|-------|-------|------|
| OpenRouter `anthropic/claude-fable-5.1` | [Hallerby Light](/blog/2026-09-02-fable-5-1-hallerby-light-one-shot) | [/demos/fable-5-1-hallerby-light](/demos/fable-5-1-hallerby-light) |
| Spark `deepseek-v4-flash-vision-exp` | Point Meridian Light | [/demos/spark-dsv4-point-meridian-light](/demos/spark-dsv4-point-meridian-light) |

## Verification notes

Checked 2026-09-02:

- Live-check: `GET http://10.0.0.33:8888/v1/models` → `deepseek-v4-flash-vision-exp`, `max_model_len=1048576`, `/health` 200. Tailscale `spark-56bc:8888` returned the same id.
- Stream to `/v1/chat/completions`, `enable_thinking: true`, `temperature=0.7`, `max_tokens=65536`.
- Usage, id, and finish from `meta.json`.
- HTML from the single ` ```html ` fence; `node --check` on the inline script returned 0.
- Playwright against a local `http.server` on port 56437, viewport 1440×900: title *Point Meridian Light*; `h1` *POINT MERIDIAN LIGHT*; three `h2`s Heavy Seas / Calm Water / Thick Fog; `.beam` transform changed after scroll; one `.log-entry.lit` at top of page.
- One extra network URL: Google Fonts. Allowed by the brief.
- Demo path: `public/demos/spark-dsv4-point-meridian-light.html` → `/demos/spark-dsv4-point-meridian-light`.

Raw files: `fable-5.1-tests/02-spark-dsv4-night-window/`.
