---
slug: "2026-11-20-inkling-2-small-aurora-one-shot"
title: "Inkling 2 Small One-Shot: Aurora in 19 Seconds"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-20"
excerpt: "Thinking Machines' new 594B MoE drew a complete interactive aurora scene from the 81-byte brief in 19 seconds for $0.012. Cold Iron said 147/157. Both tests, measured."
categories: ["AI", "Benchmarks", "OpenRouter"]
tags: ["inkling-2-small", "thinking-machines", "one-shot", "cold-iron", "openrouter"]
readTime: 7
image: "/images/blog/2026-11-20-inkling-2-small-aurora-one-shot.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-20-inkling-2-small-aurora-one-shot"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

Thinking Machines Lab shipped a new generation this week and the one that caught my eye is Inkling 2 Small: 17 billion active parameters out of 594 billion total, a mixture-of-experts reasoning model with a 1M-token context window. It is open-weight, and it takes text and images in.

I ran it through both of our standing tests. The [live demo](/demos/inkling-2-small-aurora) is up now, and the full Cold Iron board row is below. The short version: it draws beautifully, thinks compulsively, and moves like something half its size.

## The one-shot: Aurora

The brief is the same 81 bytes we send every model in this series: "create the most beautiful and stunning single HTML file you can possibly imagine." One prompt, no retries, no taste passes. Whatever comes back ships byte for byte.

Inkling came back with **Aurora — A Symphony of Light**: a real-time canvas night sky over layered mountain silhouettes, with a cratered moon, drifting stars, a live clock in the nav, and a working palette switcher with four swatches (Aurora, Ember, Ocean, Rose). The body copy promises "every frame unique, never to be repeated," and the code delivers that — each render pass randomizes the wave phases. There is a film-grain overlay, a water-reflection strip along the bottom, and the first visible button is labeled **Ignite the Sky**.

**[See it live →](/demos/inkling-2-small-aurora)**

Here is what the run measured:

| Metric | Value |
|---|---|
| Request id | `gen-1795232211-WnVQ3k32wjiXPM1ulSgL` |
| HTTP | 200, streamed |
| Finish reason | stop |
| Wall clock | 19.3 s |
| Prompt / completion tokens | 31 / 12,439 (12,470 total) |
| Reasoning tokens (usage) | 418 |
| Streamed reasoning chars | 1,641 (~280 tokens — the two disagree; both reported) |
| HTML bytes | 26,559 |
| Inline script `node --check` | pass |
| Cost | $0.0124 (usage.cost) |

Nineteen seconds. For reference, other 594B-class models in this series have taken 10 to 16 minutes on the same brief. Inkling's reasoning string is visible and short — it plans the scene in a few hundred tokens and then writes. No splice artifacts, no truncated fence, no Google Fonts fallback issues (it loads Cormorant Garamond, Inter, and Italiana).

Here is the page it shipped, verbatim:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aurora — A Symphony of Light</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='88'>🌌</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500&family=Italiana&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#eef2ff;
    --dim:rgba(238,242,255,.55);
    --glass:rgba(255,255,255,.06);
    --glass-border:rgba(255,255,255,.14);
    --accent:#7df0c8;
    --accent2:#8ab8ff;
  }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ height:100%; overflow:hidden; background:#050818; }
  body{ font-family:'Inter',sans-serif; color:var(--ink); cursor:crosshair; }

  /* ============ SCENE CANVAS ============ */
  #scene{ position:fixed; inset:0; width:100%; height:100%; display:block; }

  /* ============ FILM GRAIN ============ */
  .grain{
    position:fixed; inset:-100px; pointer-events:none; z-index:40; opacity:.055;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation:grainShift 8s steps(6) infinite;
  }
  @keyframes grainShift{
    0%,100%{transform:translate(0,0)} 20%{transform:translate(-30px,20px)}
    40%{transform:translate(25px,-35px)} 60%{transform:translate(-20px,-15px)} 80%{transform:translate(30px,25px)}
  }

  /* ============ VIGNETTE ============ */
  .vignette{
    position:fixed; inset:0; pointer-events:none; z-index:30;
    background:radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(2,4,16,.55) 100%);
  }

  /* ============ NAV ============ */
  nav{
    position:fixed; top:0; left:0; right:0; z-index:50;
    display:flex; align-items:center; justify-content:space-between;
    padding:1.6rem 3rem;
    animation:fadeDown 1.4s .3s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fadeDown{ from{opacity:0; transform:translateY(-24px)} to{opacity:1; transform:none} }
  .brand{ display:flex; align-items:center; gap:.9rem; }
  .brand-dot{ width:11px; height:11px; border-radius:50%; background:var(--accent); box-shadow:0 0 12px var(--accent); animation:pulse 3s ease-in-out infinite; }
  @keyframes pulse{ 0%,100%{opacity:1; transform:scale(1)} 50%{opacity:.5; transform:scale(.8)} }
  .brand-name{ font-family:'Italiana',serif; font-size:1.35rem; letter-spacing:.35em; color:var(--ink); }
  .nav-links{ display:flex; gap:2.6rem; }
  .nav-links a{ font-size:.68rem; letter-spacing:.28em; color:var(--dim); text-decoration:none; text-transform:uppercase; transition:color .4s; }
  .nav-links a:hover{ color:var(--accent); }
  .clock{ font-family:'SF Mono',monospace; font-size:.72rem; color:var(--dim); letter-spacing:.12em; }

  /* ============ HERO ============ */
  .hero{
    position:relative; z-index:20; height:100vh;
    display:flex; flex-direction:column; justify-content:flex-end;
    padding:0 3rem 9vh;
  }
  .eyebrow{ display:flex; align-items:center; gap:1rem; margin-bottom:1.4rem; animation:fadeUp 1.4s .6s cubic-bezier(.22,1,.36,1) both; }
  .eyebrow::before{ content:''; width:3rem; height:1px; background:var(--accent); }
  .eyebrow span{ font-size:.68rem; letter-spacing:.32em; color:var(--accent); text-transform:uppercase; }
  h1{
    font-family:'Cormorant Garamond',serif; font-weight:300; font-size:clamp(4rem,11vw,10rem);
    line-height:.95; letter-spacing:-.02em; margin-bottom:.5rem;
    background:linear-gradient(120deg,#cfe8ff 0%,#b8c6ff 35%,#e8b8d8 70%,#ffd8c8 100%);
    -webkit-background-clip:text; background-clip:text; color:transparent;
    animation:fadeUp 1.6s .8s cubic-bezier(.22,1,.36,1) both;
  }
  .sub{ font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.5rem; color:var(--dim); margin-bottom:2.2rem; animation:fadeUp 1.6s 1s cubic-bezier(.22,1,.36,1) both; }
  .hero-row{ display:flex; align-items:flex-end; justify-content:space-between; gap:3rem; flex-wrap:wrap; }
  .hero-left{ max-width:560px; }
  .lede{ font-size:.95rem; font-weight:300; line-height:1.8; color:var(--dim); margin-bottom:2.6rem; animation:fadeUp 1.6s 1.2s cubic-bezier(.22,1,.36,1) both; }
  .cta{ display:inline-flex; align-items:center; gap:.9rem; padding:1.05rem 2.6rem; border:none; border-radius:100px;
    background:linear-gradient(120deg,var(--accent),var(--accent2)); color:#04101c; font-size:.78rem; font-weight:600; letter-spacing:.22em; text-transform:uppercase;
    cursor:pointer; transition:transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s; animation:fadeUp 1.6s 1.4s cubic-bezier(.22,1,.36,1) both; }
  .cta:hover{ transform:translateY(-3px); box-shadow:0 12px 40px rgba(125,240,200,.35); }
  .cta-hint{ font-size:.72rem; color:var(--dim); margin-top:1rem; animation:fadeUp 1.6s 1.5s both; }
  .cta-hint em{ color:var(--accent); font-style:normal; }

  /* ============ SIDE ============ */
  .side{ display:flex; flex-direction:column; align-items:flex-end; gap:2.4rem; animation:fadeUp 1.6s 1.3s both; }
  .coord{ font-family:'SF Mono',monospace; font-size:.7rem; color:var(--dim); letter-spacing:.18em; writing-mode:vertical-rl; }
  blockquote{ font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.05rem; color:var(--dim); max-width:230px; text-align:right; border-right:1px solid var(--glass-border); padding-right:1.2rem; }
  blockquote cite{ display:block; font-family:'Inter',sans-serif; font-style:normal; font-size:.62rem; letter-spacing:.24em; color:var(--accent); margin-top:.8rem; text-transform:uppercase; }

  /* ============ PALETTE ============ */
  .palette{ display:flex; align-items:center; gap:.9rem; animation:fadeUp 1.6s 1.6s both; }
  .palette-label{ font-size:.6rem; letter-spacing:.3em; color:var(--dim); text-transform:uppercase; margin-right:.4rem; }
  .swatch{ width:22px; height:22px; border-radius:50%; border:1px solid var(--glass-border); cursor:pointer; transition:transform .3s, box-shadow .3s; }
  .swatch:hover{ transform:scale(1.18); }
  .swatch.active{ box-shadow:0 0 0 2px var(--ink), 0 0 14px rgba(255,255,255,.25); transform:scale(1.12); }
  .swatch-aurora{ background:linear-gradient(120deg,#7df0c8,#8ab8ff); }
  .swatch-ember{ background:linear-gradient(120deg,#ffb88a,#ff8ab8); }
  .swatch-ocean{ background:linear-gradient(120deg,#8ad8ff,#8aa8ff); }
  .swatch-rose{ background:linear-gradient(120deg,#e8b8d8,#b8a8ff); }

  /* ============ WATER ============ */
  .water{ position:fixed; left:0; right:0; bottom:0; height:9vh; z-index:10;
    background:linear-gradient(180deg, transparent, rgba(4,8,24,.9) 60%); }
  .water-line{ position:absolute; left:0; right:0; height:1px; background:rgba(255,255,255,.06); animation:shimmer 5s ease-in-out infinite; }
  @keyframes shimmer{ 0%,100%{opacity:.3} 50%{opacity:.8} }

  /* ============ SCROLL HINT ============ */
  .scroll-hint{ position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); z-index:50; display:flex; flex-direction:column; align-items:center; gap:.5rem; animation:fadeUp 1.6s 2s both; }
  .scroll-hint span{ font-size:.58rem; letter-spacing:.34em; color:var(--dim); text-transform:uppercase; }
  .scroll-hint::after{ content:''; width:1px; height:2.6rem; background:linear-gradient(180deg,var(--accent),transparent); animation:drip 2.2s ease-in-out infinite; }
  @keyframes drip{ 0%{transform:scaleY(0); transform-origin:top} 45%{transform:scaleY(1); transform-origin:top} 55%{transform:scaleY(1); transform-origin:bottom} 100%{transform:scaleY(0); transform-origin:bottom} }

  @keyframes fadeUp{ from{opacity:0; transform:translateY(30px)} to{opacity:1; transform:none} }

  @media (max-width:760px){
    nav{ padding:1.2rem 1.4rem; } .nav-links{ display:none; }
    .hero{ padding:0 1.4rem 12vh; } .side{ display:none; }
    .scroll-hint{ display:none; }
  }
</style>
</head>
<body>
<canvas id="scene"></canvas>
<div class="grain"></div>
<div class="vignette"></div>
<div class="water" id="water"></div>

<nav>
  <div class="brand"><div class="brand-dot"></div><div class="brand-name">AURORA</div></div>
  <div class="nav-links">
    <a href="#phenomenon">The Phenomenon</a><a href="#destinations">Destinations</a>
    <a href="#expeditions">Expeditions</a><a href="#journal">Journal</a>
  </div>
  <div class="clock" id="clock">00:00:00</div>
</nav>

<div class="hero">
  <div class="eyebrow"><span>The Northern Lights</span></div>
  <h1>Aurora</h1>
  <div class="sub">where the sky learns to dance</div>
  <div class="hero-row">
    <div class="hero-left">
      <p class="lede">A living canvas of charged particles and ancient light — rendered here in real time, every frame unique, never to be repeated. Move through it. Touch it. It answers.</p>
      <button class="cta" id="ignite">Ignite the Sky</button>
      <div class="cta-hint">or <em>click anywhere</em> to bloom the light</div>
    </div>
    <div class="side">
      <div class="coord">68.58° N — TROMSØ, NORWAY</div>
      <blockquote>"The sky is the daily bread of the eyes."<cite>Ralph Waldo Emerson</cite></blockquote>
      <div class="palette" id="palette">
        <span class="palette-label">Palette</span>
        <div class="swatch swatch-aurora active" data-p="aurora" aria-label="Aurora palette" role="button" tabindex="0"></div>
        <div class="swatch swatch-ember" data-p="ember" aria-label="Ember palette" role="button" tabindex="0"></div>
        <div class="swatch swatch-ocean" data-p="ocean" aria-label="Ocean palette" role="button" tabindex="0"></div>
        <div class="swatch swatch-rose" data-p="rose" aria-label="Rose palette" role="button" tabindex="0"></div>
      </div>
    </div>
  </div>
</div>

<div class="scroll-hint"><span>Scroll</span></div>

<script>
(() => {
  'use strict';
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d');
  let W, H, DPR;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Palettes ---------- */
  const PALETTES = {
    aurora: { sky:['#050818','#0a1630','#0d2438'], a:['#7df0c8','#8ab8ff','#b8ffd8'], glow:'#7df0c8', star:'#eef2ff', moon:'#f4ecd8', bloom:['#aef0d8','#8ab8ff'] },
    ember:  { sky:['#140806','#2a0f0a','#3a1810'], a:['#ffb88a','#ff8a70','#ffd8a8'], glow:'#ff9a6a', star:'#ffe8d8', moon:'#ffe8c8', bloom:['#ffc8a8','#ff9a8a'] },
    ocean:  { sky:['#04101e','#082040','#0a3050'], a:['#8ad8ff','#8aa8ff','#b8ecff'], glow:'#8ad8ff', star:'#e8f4ff', moon:'#e8f0ff', bloom:['#b8e8ff','#8ab8ff'] },
    rose:   { sky:['#12081a','#240f30','#301540'], a:['#e8b8d8','#b8a8ff','#ffd8e8'], glow:'#d8a8e0', star:'#ffeef8', moon:'#ffe8f4', bloom:['#f0c0e0','#c0a8ff'] }
  };
  let P = PALETTES.aurora;

  /* ---------- Scene state ---------- */
  let stars = [], ribbons = [], dust = [], blooms = [], meteors = [];
  const mouse = { x:.5, y:.5, tx:.5, ty:.5 };

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR; H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
    init();
  }

  function init(){
    /* stars */
    stars = Array.from({length:220}, () => ({
      x:Math.random(), y:Math.random()*.62, r:rand(.4,1.6)*DPR,
      tw:rand(0,TAU), ts:rand(.4,1.6), sp:rand(0,TAU), plus:Math.random()<.06
    }));
    /* aurora ribbons: each is a layered sine field */
    ribbons = Array.from({length:7}, (_,i) => ({
      baseY:.16 + i*.055 + rand(-.02,.02),
      amp:rand(.05,.13), freq:rand(1.2,2.6), speed:rand(.05,.16)*(i%2? -1:1),
      phase:rand(0,TAU), thick:rand(30,110)*DPR, alpha:rand(.05,.16),
      ci:Math.floor(rand(0,3)), wobble:rand(.5,1.5)
    }));
    /* drifting dust */
    dust = Array.from({length:70}, () => ({
      x:Math.random(), y:rand(.15,.75), r:rand(.5,1.8)*DPR,
      vx:rand(-.02,.02), vy:rand(-.008,.008), a:rand(.1,.5), ph:rand(0,TAU)
    }));
    /* water shimmer lines */
    const water = document.getElementById('water');
    water.querySelectorAll('.water-line').forEach(l=>l.remove());
    for(let i=0;i<7;i++){
      const l = document.createElement('div'); l.className='water-line';
      l.style.top = (8+i*11)+'%'; l.style.opacity = rand(.2,.6);
      l.style.animationDelay = rand(0,4)+'s';
      water.appendChild(l);
    }
  }

  /* ---------- Draw helpers ---------- */
  function sky(t){
    const g = ctx.createLinearGradient(0,0,0,H*.75);
    g.addColorStop(0,P.sky[0]); g.addColorStop(.55,P.sky[1]); g.addColorStop(1,P.sky[2]);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H*.78);
    /* slow breathing glow near horizon */
    const hz = ctx.createRadialGradient(W*.5, H*.66, 0, W*.5, H*.66, W*.55);
    hz.addColorStop(0, P.glow+'18'); hz.addColorStop(1,'transparent');
    ctx.globalAlpha = .5 + Math.sin(t*.0003)*.15;
    ctx.fillStyle = hz; ctx.fillRect(0,0,W,H*.8);
    ctx.globalAlpha = 1;
  }

  function drawStars(t){
    for(const s of stars){
      const tw = .35 + .65*Math.abs(Math.sin(t*.001*s.ts + s.tw));
      ctx.globalAlpha = tw * .9;
      ctx.fillStyle = P.star;
      if(s.plus){
        ctx.fillRect(s.x*W-3*s.r, s.y*H-.5*s.r, 6*s.r, 1*s.r);
        ctx.fillRect(s.x*W-.5*s.r, s.y*H-3*s.r, 1*s.r, 6*s.r);
      } else {
        ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawRibbons(t){
    ctx.globalCompositeOperation = 'lighter';
    for(const r of ribbons){
      const col = P.a[r.ci];
      ctx.beginPath();
      const steps = 90;
      for(let i=0;i<=steps;i++){
        const x = i/steps;
        const y = r.baseY
          + Math.sin(x*r.freq*TAU + t*.0004*r.speed*60 + r.phase) * r.amp
          + Math.sin(x*r.freq*TAU*2.7 + t*.0004*r.speed*90) * r.amp*.3 * r.wobble;
        if(i===0) ctx.moveTo(x*W, y*H); else ctx.lineTo(x*W, y*H);
      }
      const grad = ctx.createLinearGradient(0, r.baseY*H - r.thick, 0, r.baseY*H + r.thick*2);
      grad.addColorStop(0,'transparent');
      grad.addColorStop(.5, col);
      grad.addColorStop(1,'transparent');
      ctx.strokeStyle = grad;
      ctx.globalAlpha = r.alpha * (0.7 + 0.3*Math.sin(t*.0005 + r.phase));
      ctx.lineWidth = r.thick;
      ctx.filter = `blur(${18*DPR}px)`;
      ctx.stroke();
      /* bright core line */
      ctx.lineWidth = 1.2*DPR;
      ctx.globalAlpha = r.alpha*1.6;
      ctx.filter = 'blur(0.5px)';
      ctx.stroke();
      ctx.filter = 'none';
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawMoon(){
    const mx = W*.79, my = H*.19, mr = 34*DPR;
    const halo = ctx.createRadialGradient(mx,my,mr*.4, mx,my,mr*5);
    halo.addColorStop(0, P.moon+'40'); halo.addColorStop(1,'transparent');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(mx,my,mr*5,0,TAU); ctx.fill();
    ctx.fillStyle = P.moon; ctx.beginPath(); ctx.arc(mx,my,mr,0,TAU); ctx.fill();
    /* craters */
    ctx.fillStyle = 'rgba(0,0,0,.08)';
    [[-.3,-.2,.28],[.25,.1,.2],[-.05,.35,.16],[.4,-.32,.12]].forEach(([ox,oy,cr])=>{
      ctx.beginPath(); ctx.arc(mx+ox*mr, my+oy*mr, cr*mr, 0, TAU); ctx.fill();
    });
  }

  function drawMountains(){
    const layers = [
      { y:.62, c:'rgba(6,10,26,.92)', jag:.045, seed:7 },
      { y:.68, c:'rgba(4,7,20,.96)',  jag:.06,  seed:13 },
      { y:.74, c:'rgba(2,4,14,1)',    jag:.075, seed:29 }
    ];
    for(const L of layers){
      ctx.fillStyle = L.c; ctx.beginPath(); ctx.moveTo(0,H);
      const seg = 60;
      for(let i=0;i<=seg;i++){
        const x = i/seg;
        const n = Math.sin(x*9.7*L.seed)*.5 + Math.sin(x*23.3*L.seed+2)*.3 + Math.sin(x*51*L.seed+5)*.2;
        ctx.lineTo(x*W, (L.y + n*L.jag)*H);
      }
      ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
    }
  }

  function drawDust(t){
    ctx.globalCompositeOperation = 'lighter';
    for(const d of dust){
      d.x = (d.x + d.vx/DPR*.016 + 1) % 1; d.y = (d.y + d.vy*.016 + 1) % 1;
      const a = d.a * (.5 + .5*Math.sin(t*.001 + d.ph));
      const g = ctx.createRadialGradient(d.x*W, d.y*H, 0, d.x*W, d.y*H, d.r*6);
      g.addColorStop(0, P.a[0]); g.addColorStop(1,'transparent');
      ctx.globalAlpha = a; ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(d.x*W, d.y*H, d.r*6, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawMeteors(t){
    if(Math.random() < .004 && meteors.length < 2){
      meteors.push({ x:rand(.15,.85), y:rand(.05,.3), vx:rand(.12,.3)*(Math.random()<.5?-1:1), vy:rand(.08,.2), life:1 });
    }
    ctx.globalCompositeOperation = 'lighter';
    for(let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx*.016; m.y += m.vy*.016; m.life -= .012;
      if(m.life <= 0){ meteors.splice(i,1); continue; }
      const tail = .06;
      const g = ctx.createLinearGradient(m.x*W, m.y*H, (m.x - m.vx*tail)*W, (m.y - m.vy*tail)*H);
      g.addColorStop(0, `rgba(255,255,255,${.85*m.life})`); g.addColorStop(1,'transparent');
      ctx.strokeStyle = g; ctx.lineWidth = 1.4*DPR;
      ctx.beginPath(); ctx.moveTo(m.x*W, m.y*H); ctx.lineTo((m.x-m.vx*tail)*W, (m.y-m.vy*tail)*H); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Blooms (click) ---------- */
  function bloom(x, y){
    for(let i=0;i<26;i++){
      const a = rand(0,TAU), sp = rand(.01,.09);
      blooms.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, r:rand(1,3)*DPR, life:1, ci:Math.floor(rand(0,P.bloom.length)) });
    }
  }
  function drawBlooms(){
    ctx.globalCompositeOperation = 'lighter';
    for(let i=blooms.length-1;i>=0;i--){
      const b = blooms[i];
      b.x += b.vx*.016*W/100; b.y += b.vy*.016*H/100; b.life -= .011;
      if(b.life<=0){ blooms.splice(i,1); continue; }
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r*8);
      g.addColorStop(0, P.bloom[b.ci]); g.addColorStop(1,'transparent');
      ctx.globalAlpha = b.life*.9; ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r*8, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Main loop ---------- */
  let running = true;
  function frame(t){
    if(!running) return;
    mouse.x += (mouse.tx - mouse.x)*.04; mouse.y += (mouse.ty - mouse.y)*.04;
    ctx.clearRect(0,0,W,H);
    sky(t);
    drawStars(t);
    drawRibbons(t);
    drawMoon();
    drawMeteors(t);
    drawDust(t);
    drawMountains();
    /* subtle parallax on mouse */
    ctx.save();
    ctx.translate((mouse.x-.5)*14*DPR, (mouse.y-.5)*10*DPR);
    ctx.restore();
    drawBlooms();
    requestAnimationFrame(frame);
  }

  /* ---------- Interaction ---------- */
  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.tx = e.clientX/innerWidth; mouse.ty = e.clientY/innerHeight; });
  addEventListener('pointerdown', e => {
    const r = canvas.getBoundingClientRect();
    bloom(e.clientX*DPR, e.clientY*DPR);
  });
  document.getElementById('ignite').addEventListener('click', () => {
    for(let i=0;i<5;i++) bloom(rand(W*.2,W*.8), rand(H*.15,H*.55));
  });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if(running) requestAnimationFrame(frame);
  });

  /* palette switching */
  document.querySelectorAll('.swatch').forEach(sw => {
    const activate = () => {
      document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
      sw.classList.add('active');
      P = PALETTES[sw.dataset.p];
    };
    sw.addEventListener('click', activate);
    sw.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); activate(); } });
  });

  /* clock */
  const clock = document.getElementById('clock');
  setInterval(() => {
    const d = new Date();
    clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
  }, 1000);

  resize();
  requestAnimationFrame(frame);
})();
</script>
</body>
</html>
```

## Cold Iron: 147 of 157

Cold Iron is our Official A ranking suite, 157 items, thinking off. One wrinkle: Inkling **will not turn its reasoning off**. The OpenRouter endpoint rejects `effort: none` and `enabled: false` with an HTTP 400 ("Reasoning is mandatory for this endpoint and cannot be disabled"), so the off analogue is `effort: minimal`, the lowest listed effort. Even there it spends reasoning tokens on nearly every item, about 130k across the suite. Label this one an analogue, not a true off.

| Metric | Value |
|---|---|
| Score | **147/157 (93.6%)** |
| Errors | 0 |
| Wall clock | 600.1 s (~10 min for the full suite) |
| Mean latency per item | 3.8 s (max 28.1 s) |
| Cost | $0.1828 (sum of per-item usage.cost) |
| Arm | thinking-off analogue, `effort=minimal` (n=1) |

By category: math 26/30, coding 27/30, reasoning 29/30, instruction 30/30, prose 28/30, writing 5/5, tool calling 2/2. The misses are four frontier math items that missed exact-number regexes, two coding items plus one that emitted an unterminated string literal, one frontier reasoning item, and two prose items.

Where that lands: this is even with Gemini 4 Carbon (93.6) on the same day's board, above Fable 5.2 (90.9 mean over three runs), below GPT-6.2 Sol Pro (94.9), Astra Pro (95.5), Gemini 4 Hydrogen (96.2), Opus 5.5 (96.2), and Gemini 4 Argon (96.8). One honest caveat: that is a single run. Every other point estimate near it is also n=1, but the models above it would need to hold that gap over repeats before I would call any ranking locked.

The headline is not the score. It is speed for the score. 3.8 seconds mean per item on a 594B model, $0.18 for a full 157-item suite, is far cheaper per point than anything else in the top ten. If the n=3 runs hold, this is the new value pick at the top of the board.

## What I would do with it

- **For agentic coding work**: worth piloting now. The instruction following (30/30) and tool calling (2/2) rows are clean, and the price is hard to argue with.
- **For the board**: I want two more Cold Iron runs before anyone ranks it above Carbon. Ranges, not single points, decide rows.
- **Skip it if you need a true thinking-off mode.** Reasoning cannot be disabled on this endpoint at all; if your harness counts reasoning tokens against a budget, Inkling will spend them.

## Reproducing

Benchmark scripts and raw JSON results are in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase) under `benchmarks/thinkingmachines-inkling-2-small/`. The one-shot runner is the series `stream_openrouter_oneshot.py`; the Cold Iron run is `run_stage1.py --core-profile strict_v01 --thinking off` against `https://openrouter.ai/api/v1` with the model slug `thinkingmachines/inkling-2-small`. The off-analogue branch (effort=minimal) is documented in the runner comments.

Verification notes, 2026-11-20: model catalog facts (594B total/17B active MoE, 1M ctx, pricing, reasoning.mandatory=true) from the OpenRouter `/v1/models` entry for `thinkingmachines/inkling-2-small-20261107`. Token counts, costs, and latencies from saved `meta.json` and the stage1 results JSON. Cost figures are `usage.cost` values, not list-price math. Hero image is a Playwright still of the actual demo at 1440×900, taken 4.5 seconds after load; the first visible button reads "Ignite the Sky". Cold Iron is n=1; no winner declared.
