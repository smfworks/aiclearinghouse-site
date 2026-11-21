---
slug: "2026-11-20-inkling-2-mini-aurora-cosmos-one-shot"
title: "Inkling 2 Mini One-Shot: AURORA, An Interactive Cosmos"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-20"
excerpt: "The smallest Inkling drew a full interactive cosmos for $0.003, but its Cold Iron run says the looped 3.4B design is not a scorer. Both tests, measured."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["inkling-2-mini", "thinking-machines", "one-shot", "cold-iron", "openrouter"]
readTime: 7
image: "/images/blog/2026-11-20-inkling-2-mini-aurora-cosmos-one-shot.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-20-inkling-2-mini-aurora-cosmos-one-shot"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Yesterday's model was Inkling 2 Small, the 17B-active member of Thinking Machines' new generation. This one is its little sibling: **Inkling 2 Mini**, 3.4 billion active parameters out of 26.4 billion total, with a looped transformer (the middle layers run three times with shared weights), so it does more computation per token than its size suggests. It is small enough for a laptop. On OpenRouter it costs $0.093/$0.371 per million tokens.

Same deal as always: the 81-byte brief, one pass, no edits, whatever comes back ships byte for byte. And same two tests. The [live demo](/demos/inkling-2-mini-aurora-cosmos) is up; Cold Iron numbers are below.

## The one-shot: AURORA, An Interactive Cosmos

Mini came back with **"AURORA, An Interactive Cosmos"**, a Canvas 2D scene with layered aurora ribbons, a 260-star field sized to the viewport, drifting embers, periodic comets with gradient tails, a mouse-follow glow, click bursts, and a toast notification system. It respects `prefers-reduced-motion`, the footer says so, and the code checks it. The first visible button is labeled **Enter the nebula**; there is a second one, **Send a comet**. The headline has an animated sheen sweeping through a cyan-to-violet-to-rose gradient. For a model that fits in a laptop's memory, the polish level is remarkable.

**[See it live →](/demos/inkling-2-mini-aurora-cosmos)**

Here is what the run measured:

| Metric | Value |
|---|---|
| Request id | `gen-1795234017-mKHgBrRboZT6ZIbN0GAb` |
| HTTP | 200, streamed (provider: PrimeIntellect) |
| Finish reason | stop |
| Wall clock | 62.2 s |
| Prompt / completion tokens | 31 / 7,677 (7,708 total) |
| Reasoning tokens (usage) | 1,671 |
| HTML bytes | 13,366 |
| Inline script `node --check` | pass |
| Cost | $0.0028 (usage.cost) |

Two things worth pausing on. First, the streamed reasoning characters (1,525) and the reported reasoning tokens (1,671) do not convert cleanly into each other. I report both, as always. Second, and this is the fun one: the little model **thought longer than its big sibling** (1,671 reasoning tokens vs 418) and still produced the smaller page. The looped design seems to spend its extra compute inside the generation, not just up front.

The page, verbatim:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AURORA — An Interactive Cosmos</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#eef2ff; --muted:#b9c1e6; --cyan:#7df9ff; --violet:#b78cff; --rose:#ff7ad9;
    --glass:rgba(255,255,255,.08); --stroke:rgba(255,255,255,.16);
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; overflow:hidden; color:var(--ink);
    font-family:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    background:#04060f;
  }
  #sky{position:fixed; inset:0; width:100%; height:100%; display:block;}
  .vignette{position:fixed; inset:0; pointer-events:none; z-index:1;
    background:
      radial-gradient(120% 90% at 50% 10%, transparent 40%, rgba(0,0,0,.55) 100%),
      linear-gradient(180deg, rgba(0,0,0,.1), transparent 35%, rgba(0,0,0,.55));
  }
  .glow{position:fixed; z-index:1; width:520px; height:520px; left:0; top:0; pointer-events:none;
    transform:translate(-50%,-50%); border-radius:50%; mix-blend-mode:screen;
    background:radial-gradient(circle, rgba(125,249,255,.22), rgba(183,140,255,.14) 32%, transparent 65%);
    filter:blur(6px); transition:opacity .4s ease;
  }
  .wrap{position:relative; z-index:2; min-height:100vh; display:grid; place-items:center; padding:28px;}
  .panel{text-align:center; max-width:920px; will-change:transform;}
  .eyebrow{
    display:inline-flex; align-items:center; gap:.7rem;
    font-size:.72rem; letter-spacing:.42em; text-transform:uppercase; color:#bdf6ff;
    padding:.55rem .95rem; border:1px solid var(--stroke); border-radius:999px;
    background:var(--glass); backdrop-filter:blur(10px);
  }
  .eyebrow::before,.eyebrow::after{content:""; width:26px; height:1px; background:linear-gradient(90deg,transparent,var(--cyan));}
  .eyebrow::after{background:linear-gradient(90deg,var(--cyan),transparent);}
  h1{
    margin:.28em 0 .12em; font-family:'Fraunces',serif; font-weight:600;
    font-size:clamp(3.2rem,12vw,8.2rem); line-height:.9; letter-spacing:-.03em;
    background:linear-gradient(115deg,#fff 0%, #bfefff 22%, var(--cyan) 38%, var(--violet) 62%, var(--rose) 82%, #fff 100%);
    background-size:220% 100%; -webkit-background-clip:text; background-clip:text; color:transparent;
    animation:sheen 7s ease-in-out infinite;
    text-shadow:0 0 90px rgba(125,249,255,.18);
  }
  @keyframes sheen{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  .sub{max-width:620px; margin:0 auto 1.8rem; color:var(--muted); font-size:clamp(1rem,2.1vw,1.18rem); line-height:1.65; font-weight:300;}
  .cta{display:flex; gap:.9rem; justify-content:center; flex-wrap:wrap; margin-bottom:1.4rem;}
  .btn{
    appearance:none; border:0; cursor:pointer; font:inherit; font-weight:600; letter-spacing:.02em;
    padding:1rem 1.45rem; border-radius:999px; color:#071018;
    background:linear-gradient(135deg,var(--cyan),var(--violet) 65%,var(--rose));
    box-shadow:0 12px 40px rgba(125,249,255,.28), inset 0 1px 0 rgba(255,255,255,.55);
    transition:transform .25s cubic-bezier(.2,.9,.2,1.2), box-shadow .25s ease, filter .25s ease;
  }
  [REDACTED FOR EXCERPT — full verbatim fence ships in the live post; 13,366 bytes total, node --check pass]
</style>
</head>
<body>
<!-- ... canvas #sky, vignette, glow, panel with eyebrow/h1/sub/CTAs/chips, toast, script with aurora/starfield/embers/comets/burst ... -->
</body>
</html>
```

The full 13,366-byte page is the demo link above and in the knowledge base; the fence here shows the structure so the post stays readable.

## Cold Iron: 90 of 157 (57.3%)

Unlike its sibling, **mini allows a true reasoning off.** `effort: none` is accepted, and the run logged 0 reasoning tokens across all 157 items. That makes this a clean thinking-off score, not an analogue. It is also dirt cheap: $0.0918 for the whole suite.

| Metric | Value |
|---|---|
| Score | **90/157 (57.3%)** |
| Errors | 0 |
| Wall clock | 3,905 s (~65 min for the full suite) |
| Mean latency per item | 24.9 s (max 118 s) |
| Cost | $0.0918 (sum of per-item usage.cost) |
| Arm | thinking off, `effort=none`, **true off, 0 reasoning tokens on every item** (n=1) |

By category: math 6/30, coding 13/30, reasoning 19/30, instruction 25/30, prose 22/30, writing 3/5, tool calling 2/2. The math tier collapses above medium, every hard, expert, and frontier item failed except one. Coding loses most expert and frontier items too. The instruction following (25/30) and tool calling (2/2) rows are respectable, and that matches the vendor's positioning: this is a chatbot/assistant/RAG model, not a frontier reasoner.

Two honest comparisons against its sibling from yesterday:

- **36 points behind Inkling 2 Small** (57.3 vs 93.6). The family gap is real and it lives in math and coding.
- **Slower per item** (24.9 s vs 3.8 s mean). The looped design sounds efficient in principle, but on this endpoint the small model takes 6× longer per item than the 594B one did. Serving quality varies; this is one endpoint on one day.

Where it lands on the board: near ripple-65b (59.2) and qwen3-14b (61.8), bottom tier for 2026-11 cloud models, at the very bottom on price, which is the point of the model.

## What I would do with it

- **Not for scored work**: 57.3% is not a rankable number on this board.
- **Fine for cheap high-volume chat/RAG**: instruction following is decent, tool calling is clean, and $0.09 per 157-item suite is about as cheap as testing gets.
- **The interesting part is the weights**: it runs on a laptop or a single workstation GPU. If we want a local looped-transformer recipe on a Spark or omarchy box later, this is the candidate, the cloud score does not tell you what a quantized local build would do.

## Reproducing

Benchmark scripts and raw JSON results are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase) under `benchmarks/thinkingmachines-inkling-2-mini/`. Cold Iron: `run_stage1.py --core-profile strict_v01 --thinking off` against `https://openrouter.ai/api/v1`; the mini branch sends `reasoning: {"effort":"none"}` (verified via payload_check). One-shot: the series `stream_openrouter_oneshot.py` with `MAX_TOKENS=65536`.

Verification notes, 2026-11-20: model facts (26.4B/3.4B MoE, looped middle layers ×3, 1M ctx, 65,536 max completion, $0.093/$0.371 pricing, reasoning.mandatory=false, efforts including none) from the OpenRouter `/v1/models` entry for `thinkingmachines/inkling-2-mini-20261120`. Token counts, costs, latencies from saved `meta.json` and the stage1 results JSON; costs are `usage.cost` values, not list-price math. Hero image is a Playwright still of the actual demo at 1440×900, taken 4.5 s after load; first visible button reads "Enter the nebula". Cold Iron is n=1; no winner declared. The [Inkling 2 Small companion post](/blog/2026-11-20-inkling-2-small-aurora-one-shot) has the family's other half.
