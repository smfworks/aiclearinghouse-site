---
slug: "2026-10-29-mistral-large-4-0-aurora-most-beautiful-html"
title: "Mistral Large 4.0 one-shot: AURORA"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-10-29"
excerpt: "Same 13-word prompt. mistralai/mistral-large-4-0 returned AURORA in 161.54 s. 24,621 bytes. $0.0248066. Fence shipped as-is. runtime-gate: PASS. First visible button is Toggle sound."
categories: ["AI", "Model Evaluation", "Creative Coding", "OpenRouter"]
tags: ["mistral-large-4-0", "mistral", "openrouter", "one-shot", "html", "aurora"]
readTime: 6
image: "/images/blog/2026-10-29-mistral-large-4-0-aurora-most-beautiful-html.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-29-mistral-large-4-0-aurora-most-beautiful-html"
---

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

If you want this page from `mistralai/mistral-large-4-0`, send the 13-word brief once. Leave reasoning effort off the payload. The fence below is the file.

OpenRouter lists the slug. The catalog name is Mistral: Mistral Large 4. I ran the house one-shot on it today. Same brief. No second turn.

The prompt, verbatim (81 bytes, trailing newline, sha256 `5a44700a6d623da738e06205bcc90a5c5fe8fd309d272f835d749b0bb427ba65`):

> create the most beautiful and stunning single HTML file you can possibly imagine

The published example is the live page. The fence is what the model returned.

**[Open Mistral Large 4.0 — AURORA →](/demos/mistral-large-4-0-aurora)**

It titled the page **AURORA — an interactive cosmos**. Aurora is already a live demo name. Opus 5.5's file is [AURORA, a quiet sky](/demos/claude-opus-5.5-aurora). Grok 4.7's file is [AURORA VEIL](/demos/grok-4.7-aurora-veil). This file is `mistral-large-4-0-aurora`. Those other paths are untouched.

Four seconds after load. Playwright, 1440×900. Still first. No click. I drove it from Node: `createRequire` on the hermes-agent Playwright package, then the cached Chromium at `chrome-linux64/chrome`. A software GL flag was set (`--use-gl=angle --use-angle=swiftshader`). That is not a discrete-GPU claim.

![AURORA at 4 seconds: dark field, pink and blue particle streaks, serif headline, realm dock.](/images/blog/2026-10-29-mistral-large-4-0-aurora-most-beautiful-html-screenshot.png)

The still is a near-black field. Pink, purple, and blue streaks curve across it, denser toward the edges. A full-bleed canvas sits behind the type. The file calls `getContext("2d")`.

Top left, a small four-point mark and **AURORA**. Top center, the counter reads **17 FPS · 998 PARTICLES**. Top right, two round controls: a speaker and an info mark.

Under that, small caps: **AN INTERACTIVE COSMOS**. The headline is **AURORA** in a large serif. A small pale ring sits on the second O. The italic line reads: "Ten thousand luminous souls drifting through a living flow-field — steered by your hand, sung by your machine."

Above the dock: **MOVE TO STIR THE COSMOS · CLICK TO BURST**. The dock holds five pills. **NEBULA** is the filled one, with a purple dot. Then **AURORA** (teal), **EMBER** (orange), **OCEAN** (blue), and **COSMOS** (purple).

That copy is the page's. It is not a claim about anyone here.

## What the call returned

| Field | Value |
| --- | --- |
| Request id | `gen-1793312373-2YamzMqE19JU27A85Zs7` |
| HTTP | 200 |
| Model returned | `mistralai/mistral-large-4-0` |
| Finish | `stop` |
| Wall clock | 161.54 s |
| Prompt / completion / total | 29 / 11,803 / 11,832 |
| Streamed reasoning chars | 12,538 |
| `usage.reasoning_tokens` | 3,397 |
| HTML | 24,621 bytes, 584 lines |
| `usage.cost` | $0.0248066 |
| `node --check` | pass, one inline script |

List price on the catalog row is $0.70 per million prompt tokens and $2.10 per million completion tokens. Cache read is $0.07 per million. This call recorded 0 cached tokens. Twenty-nine prompt tokens at $0.0000007, plus 11,803 completion tokens at $0.0000021, is $0.0248066. That matches `usage.cost`. I am publishing that field.

I sent `temperature` 0.7 and `max_tokens` 65536. I left `top_p` off. I left `reasoning` off. `temperature` is in `supported_parameters`. The call returned HTTP 200.

`reasoning.mandatory` is false. `default_enabled` is true. `default_effort` is high. `supported_efforts` on the catalog row are `high` and `none`. Those catalog fields were not this payload. The 3,397 reasoning tokens and the 12,538 streamed reasoning characters are what this call recorded. They disagree. Both numbers stay in the table.

The provider cap on this row is 262,144 completion tokens. I sent 65,536 because reasoning is not mandatory. Finish was `stop`, so that cap did not cut the page.

## How it handled the brief

The model opened with a sentence outside the fence, about a particle universe and five realms. It closed with a "What's inside" list. I dropped both. The fence is the page.

The page is one canvas, one inline script. `node --check` exit 0. 584 lines. The shipped file ends `</html>` and a trailing newline. sha256 of the shipped bytes: `4fe4906d8845b15afd18900debd1a8d7a2128ea200606bcac6097455c6a5cccb`.

Fonts are a live dependency. The head links Google Fonts for Cormorant Garamond and Space Grotesk. The still shows a serif on **AURORA**.

The particle cap in the file is 1,500, or 500 when reduced motion is set. At four seconds the counter read 998. That is the still, not the cap.

The first viewport has visible buttons. The first one is `aria-label` "Toggle sound", 44 by 44, top right. Beside it, "About". The realm pills sit on the dock. The close control is outside the viewport. There is no `<a>`. The gate recorded `no_primary` for a hero CTA. The still is unclicked.

The test server logged one 404, `/favicon.ico`. The HTML has no favicon link. That is not a missing page asset.

`finish_reason` was `stop`. No retry.

## What shipped

The shipped file is the model's HTML fence, verbatim. Google Fonts stay. The canvas stays. The Web Audio code stays in the file. The still does not show sound on. The speaker stayed unclicked.

## Honest limits

- One open prompt. Beauty is not a score. The table is what I can measure. The link is what you can look at.
- This page is not the Cold Iron score. The thinking-off post is [Cold Iron: Mistral Large 4.0 scores 126/157](/blog/2026-10-06-mistral-large-4-cold-iron). That run sent `reasoning.effort=none`. This page left effort off.
- Today the provider rejects `reasoning.effort=none` (HTTP 400, supported high/low/medium) even though the catalog still lists `none`. That smoke is not this page. A same-day `effort=low` 157 is a different article.
- This is an OpenRouter sync call to `mistralai/mistral-large-4-0`. No `:batch` row exists for this id.
- The still is the first viewport at 4 s. The realm switch and the soundtrack are in the file. This still does not show either one firing.
- Catalog `default_effort` is high. The payload left it off. Do not read 3,397 reasoning tokens as a named effort.
- The catalog `hugging_face_id` is `mistralai/Mistral-Large-4-1T-A52B`. That is the field. It is not a parameter count I measured. We did not load weights.
- Three endpoint rows sit on the slug. Two are 1,048,576 context at the catalog price. The EU row is 524,288 context at $0.77 / $2.31 per million. Quantization on all three is `unknown`. The call did not pin a provider.

## Series, this row only

Older rows on this brief stay on the [27 Oct post](/blog/2026-10-27-gpt-6.1-terra-elsewhere-most-beautiful-html). This row is today's run.

| Model | Where | Wall | Tokens | HTML | Cost | Piece |
| --- | --- | --- | --- | --- | --- | --- |
| **Mistral Large 4.0** | OpenRouter sync | **161.54 s** | **11,832** | **24,621 B** | **$0.0248066** | [AURORA](/demos/mistral-large-4-0-aurora) |

## The output

The demo link is the page. The fence below is the same bytes, unchanged.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AURORA — an interactive cosmos</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Space+Grotesk:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#04050a;
    --ink:#eef1ff;
    --muted:rgba(238,241,255,.55);
    --accent:#8b7bff;
    --accent2:#ff5ca8;
    --glass:rgba(255,255,255,.06);
    --stroke:rgba(255,255,255,.14);
  }
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;overflow:hidden}
  body{
    background:var(--bg);
    color:var(--ink);
    font-family:'Space Grotesk',system-ui,sans-serif;
    cursor:none;
    transition:background 1.6s ease;
  }
  /* ambient background wash that shifts with realm */
  body::before{
    content:"";position:fixed;inset:-20%;z-index:0;pointer-events:none;
    background:
      radial-gradient(40% 35% at 25% 30%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
      radial-gradient(45% 40% at 75% 70%, color-mix(in srgb, var(--accent2) 18%, transparent), transparent 70%),
      radial-gradient(60% 60% at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%);
    filter:blur(30px);
    transition:background 1.6s ease;
    animation:drift 26s ease-in-out infinite alternate;
  }
  @keyframes drift{
    from{transform:translate3d(-2%,-1%,0) scale(1)}
    to{transform:translate3d(2%,2%,0) scale(1.08)}
  }
  canvas#scene{position:fixed;inset:0;z-index:1;display:block}

  /* film grain */
  .grain{
    position:fixed;inset:-100px;z-index:3;pointer-events:none;opacity:.055;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation:grain 8s steps(10) infinite;
  }
  @keyframes grain{
    0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-8%)}20%{transform:translate(-12%,3%)}
    30%{transform:translate(6%,-14%)}40%{transform:translate(-4%,12%)}50%{transform:translate(-10%,6%)}
    60%{transform:translate(12%,0)}70%{transform:translate(0,10%)}80%{transform:translate(3%,12%)}90%{transform:translate(-8%,4%)}
  }
  .vignette{position:fixed;inset:0;z-index:2;pointer-events:none;
    background:radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,.6) 100%);}

  /* ---------- header ---------- */
  header{
    position:fixed;top:0;left:0;right:0;z-index:10;
    display:flex;justify-content:space-between;align-items:center;
    padding:28px 40px;
  }
  .logo{display:flex;align-items:center;gap:12px;font-weight:500;letter-spacing:.35em;font-size:13px;text-transform:uppercase}
  .logo .star{font-size:18px;color:var(--accent);animation:spin 14s linear infinite;display:inline-block;transition:color 1.2s}
  @keyframes spin{to{transform:rotate(360deg)}}
  .top-actions{display:flex;gap:12px;align-items:center}
  .icon-btn{
    width:44px;height:44px;border-radius:50%;border:1px solid var(--stroke);
    background:var(--glass);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    color:var(--ink);display:grid;place-items:center;cursor:none;
    transition:border-color .3s, background .3s, transform .3s;
  }
  .icon-btn:hover{border-color:var(--accent);background:rgba(255,255,255,.12);transform:translateY(-2px)}
  .icon-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .icon-btn.on{border-color:var(--accent);color:var(--accent)}
  .icon-btn.on .waves{opacity:1}
  .waves{opacity:.25;transition:opacity .3s}

  .stats{
    position:fixed;top:34px;right:50%;transform:translateX(50%);z-index:10;
    font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--muted);
    font-variant-numeric:tabular-nums;pointer-events:none;white-space:nowrap;
  }

  /* ---------- hero ---------- */
  .hero{
    position:fixed;inset:0;z-index:5;display:flex;flex-direction:column;
    align-items:center;justify-content:center;text-align:center;pointer-events:none;
    will-change:transform;
  }
  .eyebrow{
    font-size:11px;letter-spacing:.6em;text-transform:uppercase;color:var(--muted);
    margin-bottom:26px;opacity:0;transform:translateY(20px);
    transition:opacity 1.2s ease .3s, transform 1.2s cubic-bezier(.2,.8,.2,1) .3s;
  }
  h1{
    font-family:'Cormorant Garamond',serif;font-weight:300;
    font-size:clamp(4.5rem, 16vw, 13rem);line-height:.95;letter-spacing:.08em;
    mix-blend-mode:screen;
  }
  h1 .ch{
    display:inline-block;opacity:0;transform:translateY(60px) rotate(4deg);
    background:linear-gradient(100deg,#fff 20%, var(--accent) 40%, var(--accent2) 60%, #fff 80%);
    background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;
    animation:shimmer 7s linear infinite;
    transition:opacity 1.1s ease, transform 1.1s cubic-bezier(.16,1,.3,1);
  }
  @keyframes shimmer{to{background-position:250% 0}}
  body.loaded h1 .ch{opacity:1;transform:translateY(0) rotate(0)}
  .tagline{
    margin-top:26px;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
    font-size:clamp(1.05rem, 2.2vw, 1.5rem);color:var(--muted);max-width:34em;padding:0 24px;
    opacity:0;transform:translateY(20px);
    transition:opacity 1.4s ease .9s, transform 1.4s cubic-bezier(.2,.8,.2,1) .9s;
  }
  body.loaded .eyebrow, body.loaded .tagline{opacity:1;transform:translateY(0)}

  /* ---------- realm watermark ---------- */
  .realm-label{
    position:fixed;left:36px;bottom:120px;z-index:4;pointer-events:none;
    font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;
    font-size:clamp(3rem, 8vw, 7rem);line-height:1;
    color:transparent;-webkit-text-stroke:1px rgba(238,241,255,.18);
    opacity:0;transform:translateY(14px);
    transition:opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1);
  }
  .realm-label.show{opacity:1;transform:translateY(0)}

  /* ---------- dock ---------- */
  .dock{
    position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:10;
    display:flex;gap:8px;padding:10px;border-radius:999px;
    background:var(--glass);border:1px solid var(--stroke);
    backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
    box-shadow:0 20px 60px rgba(0,0,0,.45);
    opacity:0;translate:0 24px;transition:opacity 1s ease 1.2s, translate 1s cubic-bezier(.2,.8,.2,1) 1.2s;
  }
  body.loaded .dock{opacity:1;translate:0 0}
  .pill{
    display:flex;align-items:center;gap:9px;padding:10px 18px;border-radius:999px;
    border:1px solid transparent;background:transparent;color:var(--muted);
    font-family:'Space Grotesk',sans-serif;font-size:12px;letter-spacing:.14em;text-transform:uppercase;
    cursor:none;transition:all .35s ease;
  }
  .pill .dot{
    width:10px;height:10px;border-radius:50%;
    background:linear-gradient(135deg,var(--c1),var(--c2));
    box-shadow:0 0 10px var(--c1);transition:transform .35s ease;
  }
  .pill:hover{color:var(--ink);background:rgba(255,255,255,.07)}
  .pill:hover .dot{transform:scale(1.35)}
  .pill.active{color:var(--ink);background:rgba(255,255,255,.1);border-color:var(--stroke)}
  .pill.active .dot{transform:scale(1.35)}

  .hint{
    position:fixed;bottom:104px;left:50%;transform:translateX(-50%);z-index:9;
    font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:var(--muted);
    pointer-events:none;transition:opacity 1.2s ease;white-space:nowrap;
  }
  .hint.gone{opacity:0}

  /* ---------- info panel ---------- */
  .panel{
    position:fixed;top:50%;right:40px;transform:translateY(-50%) translateX(120%);z-index:20;
    width:min(360px, calc(100vw - 60px));padding:34px;border-radius:24px;
    background:rgba(10,12,22,.55);border:1px solid var(--stroke);
    backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
    box-shadow:0 30px 80px rgba(0,0,0,.5);
    transition:transform .7s cubic-bezier(.16,1,.3,1);
  }
  .panel.open{transform:translateY(-50%) translateX(0)}
  .panel h2{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:2rem;margin-bottom:14px}
  .panel p{font-size:13.5px;line-height:1.75;color:var(--muted);margin-bottom:18px}
  .panel kbd{
    font-family:inherit;font-size:10.5px;border:1px solid var(--stroke);border-bottom-width:2px;
    border-radius:6px;padding:2px 7px;background:rgba(255,255,255,.06);color:var(--ink);
  }
  .panel .keys{display:flex;flex-wrap:wrap;gap:8px;font-size:11px;color:var(--muted)}
  .panel .close{
    position:absolute;top:16px;right:16px;width:34px;height:34px;border-radius:50%;
    border:1px solid var(--stroke);background:transparent;color:var(--ink);cursor:none;
    font-size:15px;line-height:1;transition:all .3s;
  }
  .panel .close:hover{border-color:var(--accent);transform:rotate(90deg)}

  /* ---------- custom cursor ---------- */
  .cursor-dot,.cursor-ring{position:fixed;top:0;left:0;z-index:100;pointer-events:none;border-radius:50%}
  .cursor-dot{width:6px;height:6px;background:#fff;transform:translate(-50%,-50%)}
  .cursor-ring{
    width:36px;height:36px;border:1px solid rgba(255,255,255,.5);
    transform:translate(-50%,-50%);transition:width .3s,height .3s,border-color .3s,background .3s;
  }
  .cursor-ring.hover{width:58px;height:58px;border-color:var(--accent);background:color-mix(in srgb, var(--accent) 12%, transparent)}
  @media (hover:none){.cursor-dot,.cursor-ring{display:none} body{cursor:auto} .pill,.icon-btn,.panel .close{cursor:pointer}}

  @media (max-width:640px){
    header{padding:20px 22px}
    .dock{bottom:20px;max-width:calc(100vw - 24px);overflow-x:auto;scrollbar-width:none}
    .dock::-webkit-scrollbar{display:none}
    .pill{padding:9px 13px;font-size:10.5px}
    .realm-label{left:22px;bottom:130px}
    .stats{display:none}
    .hint{bottom:96px;font-size:9px}
    .panel{right:20px}
  }
</style>
</head>
<body>

<canvas id="scene"></canvas>
<div class="vignette"></div>
<div class="grain"></div>

<header>
  <div class="logo"><span class="star">✦</span> Aurora</div>
  <div class="top-actions">
    <button class="icon-btn" id="soundBtn" title="Ambient sound (M)" aria-label="Toggle sound">
      <svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path class="waves" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>
    </button>
    <button class="icon-btn" id="infoBtn" title="About" aria-label="About">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
    </button>
  </div>
</header>

<div class="stats" id="stats">— fps · — particles</div>

<section class="hero" id="hero">
  <div class="eyebrow">An interactive cosmos</div>
  <h1 id="title">AURORA</h1>
  <p class="tagline">Ten thousand luminous souls drifting through a living flow-field — steered by your hand, sung by your machine.</p>
</section>

<div class="realm-label" id="realmLabel">nebula</div>
<div class="hint" id="hint">move to stir the cosmos &nbsp;·&nbsp; click to burst</div>

<nav class="dock" id="dock">
  <button class="pill active" data-mode="nebula"  style="--c1:#7b5cff;--c2:#ff5ca8"><span class="dot"></span>Nebula</button>
  <button class="pill" data-mode="aurora"  style="--c1:#34f5c5;--c2:#4aa8ff"><span class="dot"></span>Aurora</button>
  <button class="pill" data-mode="ember"   style="--c1:#ffb03c;--c2:#ff3c5c"><span class="dot"></span>Ember</button>
  <button class="pill" data-mode="ocean"   style="--c1:#38bdf8;--c2:#818cf8"><span class="dot"></span>Ocean</button>
  <button class="pill" data-mode="cosmos"  style="--c1:#e9d5ff;--c2:#a78bfa"><span class="dot"></span>Cosmos</button>
</nav>

<aside class="panel" id="panel">
  <button class="close" id="panelClose">✕</button>
  <h2>A living canvas</h2>
  <p>Every point of light is a particle riding a slow, dreaming flow-field. Your cursor bends the currents around it; a click detonates a burst of stardust.</p>
  <p>Switch realms below to re-tint the universe and re-tune its ambient drone.</p>
  <div class="keys">
    <span><kbd>1</kbd>–<kbd>5</kbd> realms</span>
    <span><kbd>M</kbd> sound</span>
    <span><kbd>move</kbd> stir</span>
    <span><kbd>click</kbd> burst</span>
  </div>
</aside>

<div class="cursor-ring" id="cursorRing"></div>
<div class="cursor-dot" id="cursorDot"></div>

<script>
(() => {
  "use strict";

  /* ================= REALMS ================= */
  const REALMS = {
    nebula: { hues:[258, 285, 315, 230, 340], accent:"#8b7bff", accent2:"#ff5ca8", bg:"#070512", base:110.00 },
    aurora: { hues:[160, 190, 210, 145, 175], accent:"#34f5c5", accent2:"#4aa8ff", bg:"#04120f", base: 98.00 },
    ember:  { hues:[18, 32, 45, 8, 350],     accent:"#ffb03c", accent2:"#ff3c5c", bg:"#140604", base:130.81 },
    ocean:  { hues:[200, 215, 230, 190, 250],accent:"#38bdf8", accent2:"#818cf8", bg:"#030a14", base: 87.31 },
    cosmos: { hues:[265, 290, 310, 240, 320],accent:"#c4b5fd", accent2:"#f0abfc", bg:"#0a0714", base:146.83 },
  };
  let realm = "nebula";

  /* ================= CANVAS ================= */
  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = "#04050a";
    ctx.fillRect(0, 0, W, H);
  }
  window.addEventListener("resize", resize);
  resize();

  /* ================= PARTICLES ================= */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  const stars = []; // shooting stars

  function targetCount() {
    const base = Math.floor((W * H) / 1300);
    return Math.max(350, Math.min(reduced ? 500 : 1500, base));
  }

  function pickHue() {
    const h = REALMS[realm].hues;
    return h[(Math.random() * h.length) | 0] + (Math.random() * 14 - 7);
  }

  function spawn(p, anywhere) {
    p.x = anywhere ? Math.random() * W : -20 + Math.random() * (W + 40);
    p.y = anywhere ? Math.random() * H : -20 + Math.random() * (H + 40);
    p.vx = (Math.random() - 0.5) * 0.4;
    p.vy = (Math.random() - 0.5) * 0.4;
    p.life = 0;
    p.maxLife = 120 + Math.random() * 220;
    p.size = 0.6 + Math.random() * 1.9;
    p.hue = pickHue();
    p.targetHue = p.hue;
  }

  function initParticles() {
    particles.length = 0;
    const n = targetCount();
    for (let i = 0; i < n; i++) { const p = {}; spawn(p, true); particles.push(p); }
  }
  initParticles();
  window.addEventListener("resize", initParticles);

  /* ================= POINTER ================= */
  const mouse = { x: W / 2, y: H / 2, down: false, seen: false };
  window.addEventListener("pointermove", e => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.seen = true;
    hint.classList.add("gone");
  });
  window.addEventListener("pointerdown", e => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.down = true; mouse.seen = true;
    hint.classList.add("gone");
    burst(e.clientX, e.clientY, 90);
  });
  window.addEventListener("pointerup", () => { mouse.down = false; });

  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const p = {};
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 7;
      p.x = x; p.y = y;
      p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp;
      p.life = 0; p.maxLife = 60 + Math.random() * 90;
      p.size = 0.8 + Math.random() * 2.2;
      p.hue = pickHue(); p.targetHue = p.hue;
      particles.push(p);
      if (particles.length > targetCount() + 400) particles.splice(0, particles.length - targetCount() - 400);
    }
  }

  /* ================= FLOW FIELD ================= */
  let t = 0;
  function fieldAngle(x, y, tt) {
    const s = 0.0016;
    return (
      Math.sin(x * s + tt * 0.30) * 1.4 +
      Math.cos(y * s * 1.35 - tt * 0.22) +
      Math.sin((x + y) * s * 0.55 + tt * 0.14)
    );
  }

  function step() {
    t += 0.0045;
    const R = 190, R2 = R * R;

    // fade previous frame (trail effect)
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(4,5,10,0.075)";
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";
    const speed = realm === "ember" ? 0.16 : 0.11;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const a = fieldAngle(p.x, p.y, t);
      p.vx += Math.cos(a) * speed;
      p.vy += Math.sin(a) * speed;

      // cursor influence
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2 && mouse.seen) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / R) * (mouse.down ? 2.4 : 0.85);
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }

      p.vx *= 0.955; p.vy *= 0.955;
      p.x += p.vx; p.y += p.vy;
      p.life++;
      p.hue += (p.targetHue - p.hue) * 0.03;

      if (p.life > p.maxLife || p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) {
        spawn(p, false);
        continue;
      }
      const fade = Math.sin(Math.PI * Math.min(p.life / p.maxLife, 1));
      const alpha = fade * 0.55;
      ctx.fillStyle = `hsla(${p.hue}, 92%, 66%, ${alpha})`;
      const s = p.size * (0.7 + fade * 0.6);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }

    // shooting stars
    if (Math.random() < 0.004 && stars.length < 3) {
      stars.push({
        x: Math.random() * W * 0.8 + W * 0.1, y: -10,
        vx: (Math.random() - 0.5) * 3, vy: 2.5 + Math.random() * 2.5,
        life: 0, maxLife: 70
      });
    }
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.x += s.vx; s.y += s.vy; s.life++;
      const fade = Math.sin(Math.PI * Math.min(s.life / s.maxLife, 1));
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
      grad.addColorStop(0, `rgba(255,255,255,${0.8 * fade})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14);
      ctx.stroke();
      if (s.life > s.maxLife) stars.splice(i, 1);
    }

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  /* ================= FPS ================= */
  const statsEl = document.getElementById("stats");
  let frames = 0, lastStat = performance.now(), fps = 60;
  setInterval(() => {
    const now = performance.now();
    fps = Math.round((frames * 1000) / (now - lastStat));
    frames = 0; lastStat = now;
    statsEl.textContent = `${fps} fps · ${particles.length} particles`;
  }, 600);
  (function count(){ frames++; requestAnimationFrame(count); })();

  /* ================= REALM SWITCHING ================= */
  const root = document.documentElement;
  const realmLabel = document.getElementById("realmLabel");
  const pills = [...document.querySelectorAll(".pill")];

  function setRealm(name) {
    realm = name;
    const r = REALMS[name];
    root.style.setProperty("--accent", r.accent);
    root.style.setProperty("--accent2", r.accent2);
    document.body.style.background = r.bg;
    pills.forEach(p => p.classList.toggle("active", p.dataset.mode === name));
    realmLabel.textContent = name;
    realmLabel.classList.remove("show");
    void realmLabel.offsetWidth; // restart animation
    realmLabel.classList.add("show");
    for (const p of particles) p.targetHue = pickHue();
    retuneAudio(r.base);
  }
  pills.forEach(p => p.addEventListener("click", () => setRealm(p.dataset.mode)));

  /* ================= HERO ================= */
  const title = document.getElementById("title");
  title.innerHTML = [...title.textContent].map((c, i) =>
    `<span class="ch" style="transition-delay:${0.15 + i * 0.09}s">${c}</span>`).join("");
  window.addEventListener("load", () => document.body.classList.add("loaded"));
  setTimeout(() => document.body.classList.add("loaded"), 300); // fallback

  // hero parallax
  const hero = document.getElementById("hero");
  let hx = 0, hy = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", e => {
    tx = (e.clientX / W - 0.5) * 26;
    ty = (e.clientY / H - 0.5) * 18;
  });
  (function parallax(){
    hx += (tx - hx) * 0.05; hy += (ty - hy) * 0.05;
    hero.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
    requestAnimationFrame(parallax);
  })();

  /* ================= CUSTOM CURSOR ================= */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let cx = W/2, cy = H/2, rx = cx, ry = cy;
  window.addEventListener("pointermove", e => {
    cx = e.clientX; cy = e.clientY;
    dot.style.left = cx + "px"; dot.style.top = cy + "px";
  });
  (function cursorLoop(){
    rx += (cx - rx) * 0.16; ry += (cy - ry) * 0.16;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(cursorLoop);
  })();
  document.addEventListener("pointerover", e => {
    ring.classList.toggle("hover", !!e.target.closest("button, a, .pill"));
  });

  /* ================= PANEL ================= */
  const panel = document.getElementById("panel");
  document.getElementById("infoBtn").addEventListener("click", () => panel.classList.toggle("open"));
  document.getElementById("panelClose").addEventListener("click", () => panel.classList.remove("open"));

  /* ================= AMBIENT AUDIO ================= */
  let audioCtx = null, master = null, oscs = [];
  const RATIOS = [1, 1.5, 2, 3];

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 520; filter.Q.value = 0.8;
    filter.connect(master); master.connect(audioCtx.destination);

    const types = ["sine", "sine", "triangle", "sine"];
    const gains = [0.5, 0.22, 0.1, 0.14];
    RATIOS.forEach((r, i) => {
      const o = audioCtx.createOscillator();
      o.type = types[i];
      o.frequency.value = REALMS[realm].base * r;
      o.detune.value = (i - 1.5) * 7;
      const g = audioCtx.createGain(); g.gain.value = gains[i];
      o.connect(g); g.connect(filter); o.start();
      oscs.push(o);
    });

    // slow filter LFO = breathing pad
    const lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.06;
    const lfoG = audioCtx.createGain(); lfoG.gain.value = 260;
    lfo.connect(lfoG); lfoG.connect(filter.frequency); lfo.start();

    // gentle shimmer noise
    const len = audioCtx.sampleRate * 2;
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = audioCtx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const nf = audioCtx.createBiquadFilter(); nf.type = "bandpass"; nf.frequency.value = 1200; nf.Q.value = 0.5;
    const ng = audioCtx.createGain(); ng.gain.value = 0.05;
    noise.connect(nf); nf.connect(ng); ng.connect(master); noise.start();
  }

  function retuneAudio(base) {
    if (!audioCtx) return;
    oscs.forEach((o, i) => o.frequency.setTargetAtTime(base * RATIOS[i], audioCtx.currentTime, 1.2));
  }

  const soundBtn = document.getElementById("soundBtn");
  let soundOn = false;
  function toggleSound() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    soundOn = !soundOn;
    master.gain.setTargetAtTime(soundOn ? 0.14 : 0, audioCtx.currentTime, 0.8);
    soundBtn.classList.toggle("on", soundOn);
  }
  soundBtn.addEventListener("click", toggleSound);

  /* ================= KEYS ================= */
  const modeNames = Object.keys(REALMS);
  window.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k >= "1" && k <= "5") setRealm(modeNames[+k - 1]);
    if (k === "m") toggleSound();
    if (k === "escape") panel.classList.remove("open");
  });

  const hint = document.getElementById("hint");
})();
</script>
</body>
</html>
```
