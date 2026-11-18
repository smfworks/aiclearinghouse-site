---
slug: "2026-11-18-eight-model-oneshot-showdown"
title: "Eight Models, One Sentence: The OneShot Showdown"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-18"
excerpt: "We gave the same 81-byte prompt to eight frontier models. Here's what each built, what it cost, and who nailed it, from a $0.004 universe to a $3 night sky."
categories: ["AI", "OpenRouter", "One-Shot"]
tags: ["openrouter", "one-shot", "showdown", "gpt-6.2", "gemini-4", "glm-5.3", "fable", "qwen4", "hy4"]
readTime: 14
image: "/images/blog/2026-11-18-eight-model-oneshot-showdown.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-18-eight-model-oneshot-showdown"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

One sentence. Eight models. No retries, no edits, no taste passes. Whatever came back is what shipped.

We run this test a lot, it's the fastest way to feel how a model actually builds things when nobody is watching. The prompt is the same one we've used all year:

> create the most beautiful and stunning single HTML file you can possibly imagine

Eighty-one bytes, sent to eight models on OpenRouter on November 18, 2026, with default settings left alone: temperature 0.7, no reasoning effort named, a 65k-token budget (or the provider's cap when reasoning is mandatory). Four of the eight are new today. Four already shipped their pieces earlier this year, so we link those instead of running them twice.

**The lineup, with prices per million tokens (in/out):**

| Model | $ in / $ out | One-shot cost | Wall | HTML size |
|---|---|---|---|---|
| OpenAI GPT-6.2 Astra Pro | $8.00 / $40.00 | $0.50 | 56 s | 14.5 KB |
| OpenAI GPT-6.2 Sol Pro | $2.00 / $10.00 | $0.16 | 90 s | 21.1 KB |
| Google Gemini 4 Hydrogen | $1.50 / $7.50 | $0.14 | 117 s | 53.6 KB |
| Google Gemini 4 Carbon | $2.00 / $10.00 | $0.18 | 214 s | 46.9 KB |
| Z.ai GLM 5.3 Prime | $1.68 / $5.28 | $0.53 | 705 s | 48.3 KB |
| Anthropic Claude Fable 5.2 | $8.00 / $40.00 | $3.01 | 753 s | 31.9 KB |
| Qwen Qwen4 Max | $1.43 / $4.28 | $0.10 | 333 s | 46.5 KB |
| Tencent Hy4 Flash | $0.035 / $0.14 | $0.004 | 109 s | 42.1 KB |

Every run finished clean, `finish: stop`, no truncations, no syntax errors in any inline script. That's not always true of this test, and it's worth noticing when it happens.

## The two GPT-6.2s: fast, small, expensive to think

Astra Pro came back in under a minute, the fastest of the day, with **[Otherworlds](https://www.smfclearinghouse.com/demos/gpt-6.2-astra-pro-otherworlds)**, a 14.5 KB canvas piece of procedurally drawn planets and star fields. It's the smallest file of the eight, and it reads like a sketch by someone who knows exactly which five things to draw. Sol Pro built **[Noctiluca](https://www.smfclearinghouse.com/demos/gpt-6.2-sol-pro-noctiluca)**, 21 KB, "an atlas of the unseen", three procedurally drawn worlds with an optional slow orbital drift. Both are confident, restrained, and quick.

One billing quirk to know about: the GPT-6.2 family charged us for roughly 12,000–14,000 prompt tokens on an 81-byte prompt. OpenRouter's own catalog lists pricing that doesn't explain it; the usage object is what it is. We report the `cost` field, quirks included. That's part of why Astra's "0.5 dollar" bill looks big next to its tiny output.

## The Gemini twins: big canvases, cheap tickets

Hydrogen and Carbon both went big. Hydrogen built **[AETHERIA, Celestial Harmonic Observatory](https://www.smfclearinghouse.com/demos/gemini-4-hydrogen-aetheria)**, 53.6 KB, the largest file of the day, an audio-reactive generative piece. Carbon built **[AETHERIA, Symphony of Light & Form](https://www.smfclearinghouse.com/demos/gemini-4-carbon-aetheria)**, 47 KB, with a shader palette, live turbulence/bloom controls, and a Zen Mode. Same name, different temperament, Hydrogen's is the more musical one, Carbon's is the more painterly one. Carbon took the longest of the four new runs at 214 seconds but still billed under twenty cents.

## The thinker: GLM 5.3 Prime

Prime's piece, **[Where Light Ends](https://www.smfclearinghouse.com/demos/glm-5.3-prime-where-light-ends)**, first shipped in October, and we reused it here rather than publishing the same brief twice. It's a 6,000-metre descent where your cursor is the only lamp, and it's still our favorite *concept* in the whole series. It's also the most expensive thinker per token: 43,244 reasoning tokens on a creative prompt, which is Prime thinking in max effort because that's the catalog default and nobody told it not to.

## The perfectionist: Claude Fable 5.2

Fable's **[Aurora night sky](https://www.smfclearinghouse.com/demos/fable-5.2-aurora-night-sky)** (from November 9) is the most expensive single run we've paid for in this series, $3.01, 75k completion tokens, 58k of them reasoning. What you get for it is the most *composed* page of the eight: everything placed on purpose. Whether that's worth 7× a Gemini ticket is a question about your budget, not about the model.

## The value tier: Qwen4 Max and Hy4 Flash

Qwen4 Max's **[AURORA](https://www.smfclearinghouse.com/demos/qwen4-max-aurora)** (November 16) packs a playable synth and a draw-your-own constellation into 46.5 KB for ten cents. And then there's **Hy4 Flash's [Aether](https://www.smfclearinghouse.com/demos/hy4-aether)**, a 42 KB single-file universe for **four tenths of a cent**. That is not a typo. It's the cheapest one-shot we have ever measured by two orders of magnitude, and it finished with zero errors.

## What we'd tell you to do

If you're picking a model for creative one-shot work by cost-to-quality: **Hy4 Flash at $0.004 is a legitimate tool now**, not a toy, and **Hydrogen at $0.14 builds the biggest, richest canvas per dollar**. If money is truly no object, Fable 5.2 composes like a professional. Astra Pro is the speed pick when you need something good *right now*.

Cold Iron numbers for all eight, the scored 157-test suite, thinking off, are in [the companion post](/blog/2026-11-18-eight-model-cold-iron-showdown), along with per-category strengths and the full cost board.

## Verification notes

Every number here comes from the run's saved `meta.json` and the extracted HTML file on disk; request ids are in the raw artifacts at `~/workspace/<model>-tests/01-most-beautiful-html/`. Cost is OpenRouter's `usage.cost` field, summed across the eight: **$4.63 total** (new runs today: $0.99). Scripts and JSON land in the [Nemo Knowledge Base](https://github.com/smfworks/NemoKnowledgebase).


## The pages themselves

Per the deal, here are the four new pages verbatim, exactly as the models returned them (the other four live in their own posts, linked above).

### GPT-6.2 Astra Pro, Otherworlds

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#080d16">
<title>Otherworlds, A Celestial Field Atlas</title>
<style>
  :root {
    color-scheme: dark;
    --paper: #f2ede2;
    --muted: #a4aab2;
    --accent: #efbd83;
    --line: rgba(205,215,228,.2);
    --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    --serif: Georgia, "Times New Roman", serif;
  }
  * { box-sizing: border-box }
  body {
    margin: 0; background: #080d16; color: var(--paper);
    font-family: Arial, Helvetica, sans-serif;
  }
  button { font: inherit; color: inherit; cursor: pointer }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px }
  .atlas {
    position: relative; isolation: isolate; overflow: hidden;
    min-height: 100svh; display: flex; flex-direction: column;
    padding: 0 clamp(22px,5vw,88px);
    background:
      radial-gradient(ellipse at 78% 38%, #24314180, transparent 50%),
      radial-gradient(ellipse at 22% 94%, #312c3a55, transparent 45%),
      linear-gradient(125deg,#090e16,#101824 58%,#080d15);
  }
  #sky { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -2 }
  .atlas::after {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 5;
    opacity: .045;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23fff' filter='url(%23n)' opacity='.9' d='M0 0h160v160H0z'/%3E%3C/svg%3E");
  }
  header, footer, .meta, .brand, .controls, .stamp, .readout { display: flex; align-items: center }
  header, footer { justify-content: space-between; gap: 16px }
  header { height: 86px; border-bottom: 1px solid var(--line); flex-shrink: 0 }
  .brand { gap: 12px; font-weight: 650; letter-spacing: -.055em; font-size: 24px }
  .brand svg { width: 37px; color: var(--accent) }
  .mono, .kicker, .meta, footer, .stamp, .readout {
    font: 10px/1.5 var(--mono); text-transform: uppercase; letter-spacing: .14em;
  }
  .meta { gap: 14px; color: var(--muted) }
  .signal { display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); box-shadow: 0 0 12px var(--accent) }
  main { position: relative; flex: 1; display: grid; align-items: center; min-height: 575px }
  .illustration {
    position: absolute; right: -10%; top: 49%; transform: translateY(-50%);
    width: 79%; aspect-ratio: 1.48; pointer-events: none;
  }
  #planet { width: 100%; height: 100%; display: block }
  .copy { position: relative; width: 43%; padding: 70px 0; z-index: 1 }
  .kicker { color: var(--accent); display: flex; align-items: center; gap: 12px }
  .kicker::before { content: ""; width: 36px; height: 1px; background: currentColor }
  h1 { margin: 25px 0 20px; font: normal clamp(74px,8.6vw,158px)/.9 var(--serif);
    letter-spacing: -.085em; text-indent: -.065em }
  .subtitle { font: italic clamp(21px,2vw,32px)/1.25 var(--serif); color: var(--accent); margin: 0 }
  .description { max-width: 330px; font-size: 15px; line-height: 1.75; color: #bac0c7; margin: 22px 0 32px }
  .controls { gap: 9px }
  .controls button { border: 1px solid #ffffff40; background: #ffffff06;
    width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
    transition: background .2s, border-color .2s }
  .controls button:hover { background: #ffffff14; border-color: var(--accent) }
  .controls svg { width: 17px; fill: none; stroke: currentColor; stroke-width: 1.3 }
  .index { margin-left: 10px; font: 11px var(--mono); letter-spacing: .15em; color: var(--muted) }
  .index b { color: var(--paper); font-weight: normal }
  .stamp { position: absolute; top: 26px; right: 0; color: var(--muted); gap: 10px }
  .cross { font: 20px/1 var(--mono); color: var(--accent) }
  .readout { position: absolute; bottom: 26px; right: 0; gap: 14px; color: var(--muted) }
  .readout::before { content: ""; width: 55px; height: 8px; background: repeating-linear-gradient(90deg,var(--muted) 0 1px,transparent 1px 6px) }
  .ledger {
    display: grid; grid-template-columns: 1.25fr repeat(3,1fr);
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
    padding: 24px 0; position: relative;
  }
  .ledger::before,.ledger::after { position: absolute; top: -5px; color: #c6c6c2; font: 10px var(--mono); content: "+" }
  .ledger::before { left: -3px } .ledger::after { right: -3px }
  .field { padding: 0 22px; border-left: 1px solid var(--line) }
  .field:first-child { padding-left: 0; border: 0 }
  .label { display: block; color: var(--muted); font: 9px var(--mono); text-transform: uppercase; letter-spacing: .17em; margin-bottom: 9px }
  .value { font: 20px var(--serif) }
  .field:first-child .value { font-style: italic }
  footer { min-height: 60px; color: var(--muted); font-size: 9px }
  .folio { color: var(--accent) }
  .enter { animation: arrive .65s ease-out both }
  @keyframes arrive { from { opacity: .15; translate: 0 6px } to { opacity: 1; translate: 0 0 } }
  @media (min-width: 1700px) { main { min-height: 720px } }
  @media (max-width: 760px) {
    header { height: 65px } .meta { font-size: 9px } .meta .edition { display: none }
    main { display: flex; flex-direction: column; align-items: stretch; min-height: 0 }
    .illustration { position: relative; width: 122%; right: 11%; top: auto; transform: none;
      height: auto; aspect-ratio: 1.85; margin: 20px 0 -18px }
    .stamp { top: 14px; font-size: 8px } .readout { display: none }
    .copy { width: 100%; padding: 0 0 28px }
    h1 { margin: 14px 0 8px; font-size: clamp(68px,14vw,100px) }
    .description { max-width: 460px; font-size: 14px; margin: 12px 0 20px }
    .ledger { grid-template-columns: 1fr 1fr; gap: 22px 0; padding: 19px 0 }
    .field:nth-child(3) { padding-left: 0; border: 0 }
    .value { font-size: 18px } footer { min-height: 48px; font-size: 8px }
  }
  @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation: none!important; transition: none!important } }
</style>
</head>
<body>
<div class="atlas">
  <canvas id="sky" aria-hidden="true"></canvas>
  <header>
    <div class="brand">
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="20" cy="20" r="12"/><ellipse cx="20" cy="20" rx="20" ry="5" transform="rotate(-34 20 20)"/>
        <circle cx="31" cy="7" r="2" fill="currentColor" stroke="none"/>
      </svg>Otherworlds
    </div>
    <div class="meta"><span class="edition">Independent celestial atlas &nbsp; /</span><i class="signal"></i> Observatory online</div>
  </header>

  <main>
    <div class="illustration"><canvas id="planet" role="img" aria-label="An amber gas giant with luminous, finely divided rings"></canvas></div>
    <div class="stamp"><span class="cross">⌖</span> Deep field survey</div>
    <section class="copy" aria-live="polite" aria-atomic="true">
      <div id="text">
        <div class="kicker" id="plate">Plate 001 &nbsp;/&nbsp; The outer reach</div>
        <h1 id="name">Aurelia</h1>
        <p class="subtitle" id="subtitle">The gilded giant.</p>
        <p class="description" id="description">At the edge of a quiet star system, a billion shards of ice catch the light. From this distance, they look like a single thread of gold.</p>
      </div>
      <nav class="controls" aria-label="Browse celestial plates">
        <button id="prev" aria-label="Previous world"><svg viewBox="0 0 20 20"><path d="M16 10H4m6-6-6 6 6 6"/></svg></button>
        <button id="next" aria-label="Next world"><svg viewBox="0 0 20 20"><path d="M4 10h12m-6-6 6 6-6 6"/></svg></button>
        <span class="index"><b id="counter">01</b> / 03</span>
      </nav>
    </section>
    <div class="readout">Spectral composite</div>
  </main>

  <section class="ledger" aria-label="World measurements">
    <div class="field"><span class="label">Classification</span><span class="value" id="kind">Ringed gas giant</span></div>
    <div class="field"><span class="label">Mean radius</span><span class="value" id="radius">64,280 km</span></div>
    <div class="field"><span class="label">Orbital period</span><span class="value" id="period">31.6 years</span></div>
    <div class="field"><span class="label">Known moons</span><span class="value" id="moons">27 satellites</span></div>
  </section>
  <footer><span>Field notes from imagined worlds</span><span class="folio" id="folio">Vol. I &nbsp;—&nbsp; Fig. 001</span></footer>
</div>
<script>
(() => {
  const $ = id => document.getElementById(id);
  const worlds = [
    {name:"Aurelia", sub:"The gilded giant.", region:"The outer reach", desc:"At the edge of a quiet star system, a billion shards of ice catch the light. From this distance, they look like a single thread of gold.", kind:"Ringed gas giant", radius:"64,280 km", period:"31.6 years", moons:"27 satellites", accent:"#efbd83", light:[251,216,163], dark:[136,75,53], tilt:-.32, open:.235},
    {name:"Nerithe", sub:"A sea without a shore.", region:"The blue expanse", desc:"Beneath the pale rings, cobalt storms circle a sea that has never seen a coastline. Its smallest moon rises twice before the long blue day is done.", kind:"Pelagic ice giant", radius:"29,460 km", period:"58.2 years", moons:"14 satellites", accent:"#9bd6dd", light:[180,237,231], dark:[43,99,150], tilt:.23, open:.32},
    {name:"Vespera", sub:"The last light of dusk.", region:"The violet frontier", desc:"Two distant suns set a minute apart. Between them, the high clouds turn lilac, and the shadow of the inner ring slips across the evening hemisphere.", kind:"Binary-orbit giant", radius:"48,710 km", period:"19.4 years", moons:"9 satellites", accent:"#d4b2e6", light:[237,208,239], dark:[129,76,133], tilt:-.50, open:.28}
  ];
  let current=0;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  function sky(){
    const c=$("sky"), g=c.getContext("2d"), w=c.clientWidth,h=c.clientHeight,d=Math.min(devicePixelRatio||1,2);
    c.width=w*d;c.height=h*d;g.scale(d,d);
    let seed=81377; const rnd=()=>((seed=Math.imul(1664525,seed)+1013904223>>>0)/4294967296);
    for(let i=0;i<w*h/1800;i++){
      const x=rnd()*w,y=rnd()*h,r=.28+rnd()**3*1.16;
      g.fillStyle=`rgba(222,232,245,${.18+rnd()*.55})`;
      g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();
      if(r>1.39){g.fillRect(x-4,y-.34,8,.68);g.fillRect(x-.34,y-4,.68,8)}
    }
  }
  // Orthographic sphere and inclined ring plane, shaded at each visible point.
  const cache=new Map();
  function render(){
    const c=$("planet"),g=c.getContext("2d"),p=worlds[current];
    const W=Math.max(400,Math.min(1550,Math.round(c.clientWidth*Math.min(devicePixelRatio||1,1.6)))), H=Math.round(W*c.clientHeight/c.clientWidth);
    c.width=W;c.height=H;
    const key=`${current}/${W}/${H}`;
    if(cache.has(key)){g.putImageData(cache.get(key),0,0);return}
    const img=g.createImageData(W,H),buf=img.data,R=Math.min(W/4.68,H/2.95);
    const co=Math.cos(p.tilt),si=Math.sin(p.tilt),op=p.open,cosI=Math.sqrt(1-op*op);
    const sin=Math.sin,exp=Math.exp,sqrt=Math.sqrt;
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){
      const x=(i-W*.50)/R,y=(j-H*.5)/R;
      const u=x*co+y*si,v=-x*si+y*co,r2=u*u+v*v;
      const rr=sqrt(u*u+v*v/(op*op)), z=sqrt(Math.max(0,1-r2));
      let a=0,red=0,green=0,blue=0;
      if(r2<=1){
        const lat=v*cosI-z*op,lon=Math.atan2(u,z);
        const wave=lat+.014*sin(lon*5+lat*9)+.008*sin(lon*13-lat*24)+.003*sin(lon*37+lat*13);
        const bands=clamp(.55+.19*sin(wave*24)+.12*sin(wave*59+.9*sin(wave*11))+.065*sin(wave*147)+.03*sin(wave*317));
        const dot=-u*.67-v*.57+z*.47,lit=.105+.90*Math.pow(Math.max(0,dot),.65);
        const limb=.13*Math.pow(1-z,3)*(dot+.95);
        // Rings intercept sunlight in a narrow arc across the cloud tops.
        const shadowR=sqrt((u-(z*op-v*cosI)*.91)**2+((v+.56*(z*op-v*cosI))/op)**2);
        const shade=(z*op-v*cosI>0 && shadowR>1.27 && shadowR<2.16)?.81:1;
        const grain=(sin(i*127.1+j*311.7)*43758.5453)%1*2;
        const channel=k=>(p.dark[k]+(p.light[k]-p.dark[k])*bands)*lit*shade+p.light[k]*limb+grain;
        red=channel(0);green=channel(1);blue=channel(2);a=1;
      } else {
        const glow=.16*exp(-(sqrt(r2)-1)*29)*clamp(.58-.5*u-.43*v);
        if(glow>.002){a=glow;[red,green,blue]=p.light}
      }
      if(rr>1.21 && rr<2.23 && (r2>1 || v*cosI/op>z)){
        const fine=.5+.5*sin(rr*950+1.5*sin(rr*142));
        let density=(.42+.25*fine+.16*sin(rr*74)+.12*sin(rr*241))*clamp((rr-1.21)*8)*clamp((2.23-rr)*34);
        if(rr>1.82 && rr<1.87)density*=.10;
        if(rr>2.075 && rr<2.09)density*=.21;
        if(rr<1.39)density*=.49;
        const rz=v*cosI/op, dot=-.67*u-.57*v+.47*rz;
        const inShadow=dot<0 && rr*rr-dot*dot<1;
        const bright=(inShadow?.24:1)*(.76+.18*fine+.10*sin(rr*44));
        const b=clamp(density),out=b+a*(1-b);
        const mix=(old,k)=>(p.light[k]*bright*b+old*a*(1-b))/out;
        red=mix(red,0);green=mix(green,1);blue=mix(blue,2);a=out;
      }
      const n=(j*W+i)*4;buf[n]=red;buf[n+1]=green;buf[n+2]=blue;buf[n+3]=a*255;
    }
    if(cache.size>=6)cache.clear();
    cache.set(key,img);g.putImageData(img,0,0);
  }
  function browse(step){
    current=(current+step+worlds.length)%worlds.length;
    const p=worlds[current],num=String(current+1).padStart(3,"0");
    for(const [id,value] of Object.entries({name:p.name,subtitle:p.sub,description:p.desc,plate:`Plate ${num}  /  ${p.region}`,kind:p.kind,radius:p.radius,period:p.period,moons:p.moons,counter:num.slice(1),folio:`Vol. I ,  Fig. ${num}`}))$(id).textContent=value;
    document.documentElement.style.setProperty("--accent",p.accent);
    $("planet").setAttribute("aria-label",`Illustrated portrait of ${p.name}, a ${p.kind.toLowerCase()} with inclined rings`);
    render();
    for(const e of [$("text"),$("planet")]){e.classList.remove("enter");void e.offsetWidth;e.classList.add("enter")}
  }
  $("prev").onclick=()=>browse(-1);$("next").onclick=()=>browse(1);
  document.addEventListener("keydown",e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;
    if(e.key==="ArrowRight")browse(1);if(e.key==="ArrowLeft")browse(-1);
  });
  let timer;window.addEventListener("resize",()=>{clearTimeout(timer);timer=setTimeout(()=>{sky();render()},120)});
  sky();render();
})();
</script>
</body>
</html>
```

### GPT-6.2 Sol Pro, Noctiluca

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#080b15">
<title>Noctiluca, An Atlas of the Unseen</title>
<style>
  :root {
    color-scheme: dark;
    --ink: #080b15;
    --paper: #f3eee6;
    --muted: #abaeba;
    --accent: #f4c890;
    --line: #ffffff24;
    --mono: ui-monospace, "SFMono-Regular", Consolas, monospace;
    --serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  }

  * { box-sizing: border-box; }

  body {
    min-width: 280px;
    margin: 0;
    color: var(--paper);
    background: var(--ink);
    font: 15px/1.65 system-ui, sans-serif;
  }

  button { font: inherit; }
  button:focus-visible, canvas:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 5px;
  }

  .atlas {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 100svh;
    max-width: 1800px;
    margin: auto;
    padding: 0 clamp(20px, 5vw, 88px);
    overflow: hidden;
  }

  .atlas::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 73% 40%, #13192c, transparent 63%);
  }

  .masthead, footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }

  .masthead {
    min-height: 82px;
    border-bottom: 1px solid var(--line);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font: 600 12px/1 var(--mono);
    letter-spacing: .23em;
  }

  .brand svg { width: 27px; color: var(--accent); }

  .micro {
    font: 10px/1.5 var(--mono);
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .edition, footer { color: var(--muted); }

  .hero {
    position: relative;
    display: grid;
    align-items: center;
    flex: 1;
    min-height: clamp(520px, 68vh, 790px);
  }

  .copy {
    position: relative;
    z-index: 1;
    width: fit-content;
    padding: 56px 0;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 26px;
    color: var(--accent);
  }

  .eyebrow::before {
    content: "";
    width: 24px;
    height: 1px;
    background: currentColor;
  }

  h1 {
    margin: 0;
    font: 400 clamp(66px, 8.1vw, 144px)/.86 var(--serif);
    letter-spacing: -.075em;
  }

  h1 em {
    display: block;
    margin-top: .08em;
    padding-right: .12em;
    color: var(--accent);
    font-weight: 400;
  }

  .description {
    max-width: 33ch;
    min-height: 5em;
    margin: 30px 0 22px;
    color: #c5c6d0;
    text-wrap: pretty;
  }

  .motion {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 8px 11px;
    border: 1px solid var(--line);
    border-radius: 99px;
    color: var(--paper);
    background: #080b1580;
    cursor: pointer;
  }

  .motion:hover { border-color: var(--accent); }

  .motion-dot {
    width: 6px;
    height: 6px;
    border: 1px solid var(--accent);
    border-radius: 50%;
  }

  .motion[aria-pressed="true"] .motion-dot {
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
  }

  .plate {
    position: absolute;
    inset: 0 -2.5% 0 31%;
    margin: 0;
  }

  .plate canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .plate figcaption {
    position: absolute;
    right: 4%;
    bottom: 5%;
    display: grid;
    gap: 3px;
    text-align: right;
    color: var(--muted);
    pointer-events: none;
  }

  #coordinates { color: var(--accent); }

  .index {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-block: 1px solid var(--line);
  }

  .entry {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: clamp(8px, 1.4vw, 24px);
    padding: 20px clamp(9px, 2vw, 28px);
    border: 0;
    border-right: 1px solid var(--line);
    color: var(--paper);
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .entry:last-child { border-right: 0; }
  .entry:hover { background: #ffffff08; }

  .entry[aria-pressed="true"] {
    background: linear-gradient(180deg, #ffffff0b, transparent);
    box-shadow: inset 0 1px var(--accent);
  }

  .entry:focus-visible { z-index: 1; outline-offset: -4px; }

  .number, .arrow { color: var(--muted); }
  .entry[aria-pressed="true"] :is(.number, .arrow) { color: var(--accent); }

  .entry strong {
    display: block;
    font: 400 clamp(18px, 2.2vw, 29px)/1.1 var(--serif);
  }

  .entry small {
    display: block;
    margin-top: 5px;
    color: var(--muted);
  }

  footer { min-height: 57px; }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (max-width: 720px) {
    .masthead { min-height: 65px; }
    .hero { min-height: 0; }
    .copy { padding: 42px 0 0; }
    h1 { font-size: clamp(53px, 13vw, 90px); }
    .eyebrow { margin-bottom: 19px; }
    .description { min-height: 0; margin: 23px 0 17px; }
    .plate {
      position: relative;
      inset: auto;
      height: clamp(270px, 74vw, 460px);
      margin: -6px -12px 8px;
    }
    .plate figcaption { bottom: 3%; }
    .entry {
      grid-template-columns: 1fr;
      gap: 5px;
      align-content: start;
      padding-block: 13px;
    }
    .entry small, .arrow { display: none; }
  }

  @media (max-width: 360px) {
    .edition { display: none; }
    footer span:last-child { display: none; }
  }
</style>
</head>
<body>
<main class="atlas">
  <header class="masthead">
    <div class="brand">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="10.5" stroke="currentColor" opacity=".65"/>
        <path d="M16 1v30M1 16h30M16 9l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"
              stroke="currentColor" stroke-width=".85"/>
      </svg>
      NOCTILUCA
    </div>
    <div class="edition micro">An atlas of the unseen &nbsp; / &nbsp; Vol. 01</div>
  </header>

  <section class="hero" aria-labelledby="title">
    <div class="copy">
      <p class="eyebrow micro" id="eyebrow">01 / Totality</p>
      <h1 id="title">The quiet <em>fire.</em></h1>
      <p class="description" id="description">
        The moon takes the sun from view. For a moment, its outer atmosphere
        is the brightest thing in the sky.
      </p>
      <button class="motion micro" id="motion" type="button" aria-pressed="false">
        <span class="motion-dot" aria-hidden="true"></span>
        Orbital drift
      </button>
    </div>

    <figure class="plate">
      <canvas id="sky" role="img" aria-label="A golden solar corona around a dark moon, framed by fine orbital lines.">
        An illustrated celestial observation plate.
      </canvas>
      <figcaption class="micro">
        <span id="coordinates">Plate 01 · 00h 42m</span>
        <span id="caption">The solar corona</span>
      </figcaption>
    </figure>
  </section>

  <nav class="index" aria-label="Observation plates">
    <button class="entry" type="button" aria-pressed="true" data-plate="0">
      <span class="number micro">01</span>
      <span><strong>Totality</strong><small class="micro">Solar eclipse</small></span>
      <span class="arrow" aria-hidden="true">↗</span>
    </button>
    <button class="entry" type="button" aria-pressed="false" data-plate="1">
      <span class="number micro">02</span>
      <span><strong>Vesper</strong><small class="micro">Ringed world</small></span>
      <span class="arrow" aria-hidden="true">↗</span>
    </button>
    <button class="entry" type="button" aria-pressed="false" data-plate="2">
      <span class="number micro">03</span>
      <span><strong>Afterlight</strong><small class="micro">Stellar remnant</small></span>
      <span class="arrow" aria-hidden="true">↗</span>
    </button>
  </nav>

  <footer class="micro">
    <span>Field notes from an imagined sky</span>
    <span>Three observations &nbsp;·&nbsp; 01—03</span>
  </footer>
  <div class="sr-only" id="announcement" aria-live="polite"></div>
</main>

<script>
(() => {
  "use strict";

  const plates = [
    {
      name: "Totality", title: "The quiet", italic: "fire.",
      description: "The moon takes the sun from view. For a moment, its outer atmosphere is the brightest thing in the sky.",
      coordinates: "Plate 01 · 00h 42m", caption: "The solar corona",
      alt: "A golden solar corona around a dark moon, framed by fine orbital lines.",
      accent: "#f4c890", rgb: [255, 167, 87], pale: [255, 225, 177],
      tilt: -.32, seed: 1689
    },
    {
      name: "Vesper", title: "A sea of", italic: "rings.",
      description: "From a distance, the rings look like one continuous sheet. Up close, they are a swarm of ice and stone.",
      coordinates: "Plate 02 · 11h 18m", caption: "Ice and dust in orbit",
      alt: "A blue-green planet with wide, luminous rings tipped diagonally across the starfield.",
      accent: "#a1e5da", rgb: [79, 204, 190], pale: [190, 255, 231],
      tilt: -.43, seed: 4327
    },
    {
      name: "Afterlight", title: "What the", italic: "star left.",
      description: "Long after the star has fallen silent, its shed layers are still traveling outward. Here, a few of them catch the light.",
      coordinates: "Plate 03 · 19h 07m", caption: "An expanding shell",
      alt: "A violet stellar remnant with thin, luminous filaments surrounding a bright central star.",
      accent: "#dec1ff", rgb: [169, 108, 255], pale: [241, 213, 255],
      tilt: .24, seed: 8171
    }
  ];

  const $ = id => document.getElementById(id);
  const canvas = $("sky");
  const ctx = canvas.getContext("2d");
  const still = document.createElement("canvas");
  const art = still.getContext("2d");
  const buttons = [...document.querySelectorAll(".entry")];
  const motion = $("motion");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const TAU = Math.PI * 2;

  let selected = 0, w = 0, h = 0, dpr = 1, cx, cy, radius;
  let moving = false, frame = 0, previousTime = null, elapsed = 0;

  const rgba = (rgb, a) => `rgba(${rgb.join(",")},${a})`;

  function random(seed) {
    return () => {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function circle(g, x, y, r) {
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
  }

  function glow(g, x, y, r, color, opacity) {
    const gradient = g.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, rgba(color, opacity));
    gradient.addColorStop(.32, rgba(color, opacity * .46));
    gradient.addColorStop(1, rgba(color, 0));
    g.fillStyle = gradient;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function ellipsePoint(a, rx, ry, tilt) {
    const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    return [x * Math.cos(tilt) - y * Math.sin(tilt),
            x * Math.sin(tilt) + y * Math.cos(tilt)];
  }

  function star(g, x, y, size, color) {
    glow(g, x, y, size * 3.2, color, .35);
    g.fillStyle = rgba(color, .82);
    g.fillRect(x - size, y - .35, size * 2, .7);
    g.fillRect(x - .35, y - size, .7, size * 2);
    g.fillStyle = "#fff5e8";
    circle(g, x, y, Math.max(.65, size * .14));
    g.fill();
  }

  function background(p, rand, r) {
    glow(art, r * .35, 0, r * 3.25, p.rgb, .13);
    glow(art, -r * .86, -r * .7, r * 2.5, [96, 108, 193], .15);

    for (let i = 0; i < 600; i++) {
      const x = rand() * w - cx, y = rand() * h - cy;
      const edge = Math.pow(Math.sin(Math.PI * (x + cx) / w), .65);
      const s = rand();
      art.fillStyle = rgba(i % 4 ? [215, 225, 250] : p.pale, edge * (.07 + s * s * .49));
      const size = .45 + s ** 5 * 1.05;
      art.fillRect(x, y, size, size);
    }

    for (const [x, y, s] of [[-1.99, -.85, 4], [1.53, -1.27, 5],
      [1.64, .81, 3], [-1.37, 1.37, 3.5], [.32, -1.84, 2.7]]) {
      star(art, x * r, y * r, s, p.pale);
    }

    // A fine instrument grid, drawn separately from the orbital paths.
    art.strokeStyle = rgba(p.pale, .13);
    art.lineWidth = .65;
    art.beginPath();
    for (let i = 0; i < 120; i++) {
      const a = i / 120 * TAU, inner = r * (i % 10 ? 1.94 : 1.89);
      art.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      art.lineTo(Math.cos(a) * r * 1.98, Math.sin(a) * r * 1.98);
    }
    art.stroke();

    for (const [rx, ry, t, opacity] of [
      [2.12, .78, p.tilt, .29], [2.18, .83, p.tilt, .11],
      [1.89, 1.18, p.tilt + .62, .12], [1.78, 1.78, 0, .09]
    ]) {
      art.beginPath();
      art.ellipse(0, 0, r * rx, r * ry, t, 0, TAU);
      art.strokeStyle = rgba(p.pale, opacity);
      art.stroke();
    }

    art.fillStyle = rgba(p.pale, .43);
    art.font = "9px monospace";
    art.fillText("N", -3, -r * 2.09);
    art.fillText("+" + (selected + 1) + "°", r * 1.68, -r * 1.08);

    for (let i = 0; i < 1900; i++) {
      const a = rand() * TAU, jitter = (rand() - .5) * (rand() ** 2) * r * .76;
      const [x, y] = ellipsePoint(a, 2.13 * r + jitter, .78 * r + jitter, p.tilt);
      art.fillStyle = rgba(p.pale, rand() ** 2 * .39);
      art.fillRect(x, y, .5 + rand() * .8, .65);
    }
  }

  function eclipse(p, rand, r) {
    glow(art, 0, 0, r * 2.25, p.rgb, .28);

    const rim = art.createRadialGradient(0, 0, r * .84, 0, 0, r * 1.39);
    rim.addColorStop(0, rgba(p.pale, 0));
    rim.addColorStop(.28, rgba(p.pale, .81));
    rim.addColorStop(.39, rgba(p.rgb, .25));
    rim.addColorStop(1, rgba(p.rgb, 0));
    art.fillStyle = rim;
    circle(art, 0, 0, r * 1.39);
    art.fill();

    for (let i = 0; i < 1050; i++) {
      const a = rand() * TAU;
      const fan = .46 + .24 * Math.sin(a * 3 + .8) + .18 * Math.cos(a * 7);
      const len = r * (.04 + rand() ** 2 * fan);
      const bend = .08 * Math.sin(a * 5) * len / r;
      const end = r * .98 + len;
      const ex = Math.cos(a + bend) * end, ey = Math.sin(a + bend) * end;
      const x = Math.cos(a) * r * .985, y = Math.sin(a) * r * .985;
      const ray = art.createLinearGradient(x, y, ex, ey);
      ray.addColorStop(0, rgba(p.pale, .12 + rand() * .35));
      ray.addColorStop(.43, rgba(p.rgb, rand() * .18));
      ray.addColorStop(1, rgba(p.rgb, 0));
      art.strokeStyle = ray;
      art.lineWidth = .35 + rand() * .65;
      art.beginPath();
      art.moveTo(x, y);
      art.quadraticCurveTo(Math.cos(a) * (r + len * .52),
                           Math.sin(a) * (r + len * .52), ex, ey);
      art.stroke();
    }

    const moon = art.createLinearGradient(-r, -r, r, r);
    moon.addColorStop(0, "#14121c");
    moon.addColorStop(.51, "#080a13");
    moon.addColorStop(1, "#070912");
    art.fillStyle = moon;
    circle(art, 0, 0, r * .987);
    art.fill();

    art.save();
    art.shadowColor = "#ffb15f";
    art.shadowBlur = r * .09;
    art.strokeStyle = rgba(p.pale, .95);
    art.lineWidth = 1.35;
    art.beginPath();
    art.arc(0, 0, r, 3.55, 5.48);
    art.stroke();
    art.restore();
    glow(art, r * .59, -r * .81, r * .35, p.rgb, .55);
    star(art, r * .59, -r * .81, 4.5, p.pale);
  }

  function rings(p, r, front) {
    for (let i = 0; i < 91; i++) {
      if ((i > 42 && i < 49) || (i > 72 && i < 76)) continue;
      const t = i / 90;
      const rx = r * (1.18 + t * .82);
      art.beginPath();
      art.ellipse(0, 0, rx, rx * .35, p.tilt,
                  front ? 0 : Math.PI, front ? Math.PI : TAU);
      art.lineWidth = .55 + .65 * Math.sin(t * 11) ** 2;
      art.strokeStyle = rgba(p.pale, (.06 + .24 * Math.sin(t * 16 + .5) ** 2) *
                            (front ? 1 : .64));
      art.stroke();
    }
  }

  function vesper(p, rand, r) {
    glow(art, 0, 0, r * 1.9, p.rgb, .27);
    rings(p, r, false);
    art.save();
    circle(art, 0, 0, r);
    art.clip();
    const sphere = art.createRadialGradient(-r * .47, -r * .47, 0, -r * .2, -r * .18, r * 1.2);
    sphere.addColorStop(0, "#a3e2cd");
    sphere.addColorStop(.40, "#386d74");
    sphere.addColorStop(.75, "#192f42");
    sphere.addColorStop(1, "#080c18");
    art.fillStyle = sphere;
    art.fillRect(-r, -r, 2 * r, 2 * r);
    art.rotate(p.tilt);
    for (let i = 0; i < 360; i++) {
      const y = (rand() * 2 - 1) * r;
      art.beginPath();
      art.moveTo(-r * 1.2, y);
      art.bezierCurveTo(-r * .55, y + r * .32, r * .53, y + r * .33, r * 1.2, y);
      art.strokeStyle = rgba(i % 3 ? p.pale : [7, 17, 35], rand() * .14);
      art.lineWidth = .3 + rand() * 1.9;
      art.stroke();
    }
    art.restore();

    art.beginPath();
    art.arc(0, 0, r - .5, 3.1, 5.5);
    art.strokeStyle = rgba(p.pale, .7);
    art.lineWidth = 1.2;
    art.stroke();
    rings(p, r, true);
  }

  function afterlight(p, rand, r) {
    glow(art, 0, 0, r * 1.8, p.rgb, .33);
    glow(art, -r * .56, r * .37, r * 1.25, [154, 73, 209], .25);
    glow(art, r * .5, -r * .4, r * 1.18, [106, 144, 255], .22);

    for (let i = 0; i < 260; i++) {
      const start = rand() * TAU, length = .15 + rand() * 1.7;
      const band = .43 + rand() ** .55 * .92, drift = rand() * 2;
      art.strokeStyle = rgba(i % 3 ? p.pale : [148, 157, 255], .025 + rand() * .17);
      art.lineWidth = .35 + rand() * 1.9;
      art.beginPath();
      for (let j = 0; j <= 35; j++) {
        const a = start + j / 35 * length;
        const f = band + .15 * Math.sin(a * 3 + drift) + .08 * Math.sin(a * 7);
        const [x, y] = ellipsePoint(a, r * f, r * f * .87, p.tilt);
        if (j === 0) art.moveTo(x, y); else art.lineTo(x, y);
      }
      art.stroke();
    }

    for (let i = 0; i < 2400; i++) {
      const a = rand() * TAU;
      const f = .77 + (rand() - .5) * rand() * 1.25 + .21 * Math.sin(a * 3);
      const [x, y] = ellipsePoint(a, r * f, r * f * .89, p.tilt);
      art.fillStyle = rgba(p.pale, rand() ** 2 * .5);
      art.fillRect(x, y, .55 + rand() * .95, .75);
    }
    glow(art, 0, 0, .35 * r, p.pale, .52);
    star(art, 0, 0, 10, p.pale);
    star(art, r * .94, -r * .42, 3.7, p.pale);
  }

  function renderPlate() {
    if (!ctx || !art || !w || !h) return;
    const p = plates[selected], rand = random(p.seed);
    art.setTransform(dpr, 0, 0, dpr, 0, 0);
    art.clearRect(0, 0, w, h);
    art.save();
    art.translate(cx, cy);
    background(p, rand, radius);
    if (selected === 0) eclipse(p, rand, radius);
    else if (selected === 1) vesper(p, rand, radius);
    else afterlight(p, rand, radius);
    art.restore();
    paint();
  }

  function paint() {
    if (!ctx || !w || !h) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(still, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = plates[selected];
    for (let i = 0; i < 3; i++) {
      const a = elapsed * (.24 + i * .025) + .28 + i * 2.12;
      const [x, y] = ellipsePoint(a, radius * 2.12, radius * .78, p.tilt);
      star(ctx, cx + x, cy + y, i === 0 ? 4 : 2.4, p.pale);
    }
  }

  function resize() {
    if (!ctx || !art) return;
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    w = box.width;
    h = box.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = still.width = Math.round(w * dpr);
    canvas.height = still.height = Math.round(h * dpr);
    cx = w * .52;
    cy = h * .49;
    radius = Math.min(w * .219, h * .205);
    renderPlate();
  }

  function tick(now) {
    if (!moving) return;
    if (previousTime !== null) elapsed += Math.min(now - previousTime, 50) / 1000;
    previousTime = now;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function setMotion(on) {
    moving = on;
    motion.setAttribute("aria-pressed", String(on));
    cancelAnimationFrame(frame);
    previousTime = null;
    if (on) frame = requestAnimationFrame(tick);
  }

  function select(index) {
    if (index === selected) return;
    selected = index;
    const p = plates[index];
    document.documentElement.style.setProperty("--accent", p.accent);
    $("eyebrow").textContent = `0${index + 1} / ${p.name}`;
    const emphasis = document.createElement("em");
    emphasis.textContent = p.italic;
    $("title").replaceChildren(p.title + " ", emphasis);
    $("description").textContent = p.description;
    $("coordinates").textContent = p.coordinates;
    $("caption").textContent = p.caption;
    canvas.setAttribute("aria-label", p.alt);
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    $("announcement").textContent = `${p.name}. ${p.title} ${p.italic} ${p.description}`;
    elapsed = 0;
    renderPlate();
  }

  buttons.forEach((button, i) => button.addEventListener("click", () => select(i)));
  motion.addEventListener("click", () => setMotion(!moving));
  reduceMotion.addEventListener("change", event => {
    if (event.matches) setMotion(false);
  });

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  window.addEventListener("resize", resize);
  resize();
})();
</script>
</body>
</html>
```

### Gemini 4 Hydrogen, AETHERIA (Celestial Harmonic Observatory)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AETHERIA, Celestial Harmonic Observatory</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-void: #03040a;
      --accent-primary: #e8c987;
      --accent-secondary: #7dd3fc;
      --accent-tertiary: #c084fc;
      --glass-bg: rgba(8, 11, 22, 0.48);
      --glass-border: rgba(255, 255, 255, 0.11);
      --glass-highlight: rgba(255, 255, 255, 0.22);
      --text-main: rgba(248, 250, 252, 0.94);
      --text-muted: rgba(203, 213, 225, 0.62);
      --font-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
      --transition-smooth: cubic-bezier(0.22, 1, 0.36, 1);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--bg-void);
      color: var(--text-main);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      user-select: none;
      cursor: crosshair;
    }

    /* Main Visual Canvases */
    #cosmos-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 1;
    }

    /* Subtle Film Grain & Vignette */
    .vignette-overlay {
      position: fixed;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        radial-gradient(circle at 50% 50%, transparent 45%, rgba(2, 3, 8, 0.58) 100%),
        radial-gradient(circle at 50% 50%, transparent 72%, rgba(0, 0, 0, 0.85) 100%);
    }

    .film-grain {
      position: fixed;
      inset: -50%;
      width: 200%;
      height: 200%;
      z-index: 3;
      pointer-events: none;
      opacity: 0.032;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      animation: grainShift 8s steps(10) infinite;
    }

    @keyframes grainShift {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(-2%, 1.5%); }
      40% { transform: translate(1.5%, -2%); }
      60% { transform: translate(-1%, -1.5%); }
      80% { transform: translate(2%, 1%); }
    }

    /* Astrolabe Precision Reticle Overlay */
    .astrolabe-layer {
      position: fixed;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.42;
      transition: opacity 0.9s var(--transition-smooth);
    }

    .astrolabe-svg {
      width: min(76vmin, 720px);
      height: min(76vmin, 720px);
      overflow: visible;
      filter: drop-shadow(0 0 18px rgba(232, 201, 135, 0.12));
    }

    .astro-ring-slow {
      transform-origin: center;
      animation: spinSlow 140s linear infinite;
    }

    .astro-ring-reverse {
      transform-origin: center;
      animation: spinReverse 95s linear infinite;
    }

    .astro-ring-inner {
      transform-origin: center;
      animation: spinSlow 52s linear infinite;
    }

    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes spinReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }

    /* Custom Cursor Halo */
    .cursor-halo {
      position: fixed;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.25);
      pointer-events: none;
      z-index: 50;
      transform: translate(-50%, -50%);
      transition: width 0.28s var(--transition-smooth),
                  height 0.28s var(--transition-smooth),
                  border-color 0.28s ease,
                  opacity 0.28s ease;
      mix-blend-mode: screen;
      opacity: 0;
    }

    .cursor-halo::after {
      content: '';
      position: absolute;
      inset: 50%;
      width: 4px;
      height: 4px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: var(--accent-primary);
      box-shadow: 0 0 10px var(--accent-primary);
    }

    .cursor-halo.active {
      width: 68px;
      height: 68px;
      border-color: var(--accent-primary);
    }

    /* Editorial HUD Interface */
    .hud-shell {
      position: fixed;
      inset: 0;
      z-index: 10;
      pointer-events: none;
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: clamp(18px, 3vw, 38px);
      transition: opacity 0.8s var(--transition-smooth), transform 0.8s var(--transition-smooth);
    }

    body.zen-mode .hud-shell {
      opacity: 0;
      transform: scale(1.015);
    }

    body.zen-mode .astrolabe-layer {
      opacity: 0.16;
    }

    /* Top Bar */
    .hud-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }

    .brand-block {
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .brand-eyebrow {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent-primary);
      opacity: 0.88;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-primary);
      box-shadow: 0 0 10px var(--accent-primary);
      animation: pulseGlow 2.8s ease-in-out infinite;
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 0.45; transform: scale(0.85); }
      50% { opacity: 1; transform: scale(1.15); }
    }

    .brand-title {
      font-family: var(--font-serif);
      font-weight: 300;
      font-size: clamp(28px, 4vw, 46px);
      letter-spacing: 0.14em;
      line-height: 1;
      text-transform: uppercase;
      background: linear-gradient(125deg, #ffffff 15%, var(--accent-primary) 65%, rgba(255,255,255,0.75) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 0 36px rgba(232, 201, 135, 0.15);
    }

    .brand-subtitle {
      font-family: var(--font-serif);
      font-style: italic;
      font-weight: 300;
      font-size: 14px;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    /* Telemetry & Quick Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      pointer-events: auto;
    }

    .telemetry-pill {
      display: none;
      align-items: center;
      gap: 14px;
      padding: 9px 16px;
      border-radius: 999px;
      background: var(--glass-bg);
      backdrop-filter: blur(18px) saturate(140%);
      -webkit-backdrop-filter: blur(18px) saturate(140%);
      border: 1px solid var(--glass-border);
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.12em;
      color: var(--text-muted);
    }

    @media (min-width: 860px) {
      .telemetry-pill {
        display: flex;
      }
    }

    .telemetry-item span {
      color: var(--text-main);
      margin-left: 5px;
    }

    .glass-btn {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 16px;
      border-radius: 999px;
      background: var(--glass-bg);
      backdrop-filter: blur(18px) saturate(140%);
      -webkit-backdrop-filter: blur(18px) saturate(140%);
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.32s var(--transition-smooth);
      outline: none;
    }

    .glass-btn:hover {
      border-color: var(--glass-highlight);
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .glass-btn.is-active {
      border-color: rgba(232, 201, 135, 0.55);
      color: var(--accent-primary);
      box-shadow: 0 0 20px rgba(232, 201, 135, 0.16);
    }

    .glass-btn svg {
      width: 14px;
      height: 14px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.6;
    }

    /* Center Poetic Quote / Epoch Indicator */
    .hud-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 24px;
      text-align: center;
    }

    .epoch-caption {
      font-family: var(--font-serif);
      font-style: italic;
      font-weight: 300;
      font-size: clamp(15px, 1.8vw, 20px);
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.62);
      max-width: 520px;
      line-height: 1.5;
      opacity: 0;
      transform: translateY(8px);
      animation: fadeFloatIn 1.8s var(--transition-smooth) 0.4s forwards;
      transition: opacity 0.5s ease;
    }

    @keyframes fadeFloatIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Bottom Control Dock */
    .hud-footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
    }

    .preset-dock {
      pointer-events: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border-radius: 999px;
      background: var(--glass-bg);
      backdrop-filter: blur(22px) saturate(150%);
      -webkit-backdrop-filter: blur(22px) saturate(150%);
      border: 1px solid var(--glass-border);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
    }

    .preset-btn {
      position: relative;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-muted);
      font-family: var(--font-sans);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 0.35s var(--transition-smooth);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .preset-swatch {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      transition: transform 0.35s var(--transition-smooth);
    }

    .preset-btn:hover {
      color: var(--text-main);
    }

    .preset-btn:hover .preset-swatch {
      transform: scale(1.3);
    }

    .preset-btn.active {
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.16);
      color: var(--text-main);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }

    .interaction-dock {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .slider-card {
      display: none;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 999px;
      background: var(--glass-bg);
      backdrop-filter: blur(22px) saturate(150%);
      -webkit-backdrop-filter: blur(22px) saturate(150%);
      border: 1px solid var(--glass-border);
    }

    @media (min-width: 720px) {
      .slider-card {
        display: flex;
      }
    }

    .slider-label {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 86px;
      height: 2px;
      background: rgba(255, 255, 255, 0.18);
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--accent-primary);
      box-shadow: 0 0 10px var(--accent-primary);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.25);
    }

    /* Floating Zen Exit Pill */
    .zen-restore {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 25;
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      transition: all 0.5s var(--transition-smooth);
    }

    body.zen-mode .zen-restore {
      opacity: 0.72;
      pointer-events: auto;
      transform: translateY(0);
    }

    body.zen-mode .zen-restore:hover {
      opacity: 1;
    }

    /* Hint Badge */
    .gesture-hint {
      position: fixed;
      bottom: 84px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 12;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.42);
      pointer-events: none;
      white-space: nowrap;
      transition: opacity 1.2s ease;
    }

    .gesture-hint.hidden {
      opacity: 0;
    }

    /* Entrance Curtain */
    .entrance-curtain {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: #020308;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      pointer-events: none;
      animation: curtainReveal 1.9s var(--transition-smooth) 0.25s forwards;
    }

    .entrance-monogram {
      font-family: var(--font-serif);
      font-size: 28px;
      letter-spacing: 0.45em;
      color: var(--accent-primary);
      font-weight: 300;
      opacity: 0.9;
    }

    .entrance-line {
      width: 120px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
      transform: scaleX(0);
      animation: lineExpand 1.2s var(--transition-smooth) forwards;
    }

    @keyframes lineExpand {
      to { transform: scaleX(1); }
    }

    @keyframes curtainReveal {
      0% { opacity: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; visibility: hidden; }
    }
  </style>
</head>
<body>

  <!-- Smooth Entrance Curtain -->
  <div class="entrance-curtain" aria-hidden="true">
    <div class="entrance-monogram">AETHERIA</div>
    <div class="entrance-line"></div>
  </div>

  <!-- Primary Interactive Cosmos Canvas -->
  <canvas id="cosmos-canvas"></canvas>

  <!-- Atmospheric Vignette & Film Grain -->
  <div class="vignette-overlay"></div>
  <div class="film-grain"></div>

  <!-- Precision Celestial Astrolabe Overlay -->
  <div class="astrolabe-layer" aria-hidden="true">
    <svg class="astrolabe-svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f7e3b5" stop-opacity="0.65" />
          <stop offset="50%" stop-color="#c9a45c" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.45" />
        </linearGradient>
      </defs>

      <!-- Outer Ecliptic Ring -->
      <g class="astro-ring-slow">
        <circle cx="300" cy="300" r="286" fill="none" stroke="url(#goldGrad)" stroke-width="0.7" stroke-dasharray="2 8" />
        <circle cx="300" cy="300" r="274" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="0.5" />
        <!-- Cardinal Ticks -->
        <g id="outer-ticks" stroke="rgba(232,201,135,0.42)" stroke-width="0.8"></g>
      </g>

      <!-- Middle Harmonic Ring -->
      <g class="astro-ring-reverse">
        <circle cx="300" cy="300" r="218" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" stroke-dasharray="14 6 2 6" />
        <ellipse cx="300" cy="300" rx="218" ry="118" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="0.6" transform="rotate(28 300 300)" />
        <ellipse cx="300" cy="300" rx="218" ry="118" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="0.6" transform="rotate(-28 300 300)" />
        <circle cx="518" cy="300" r="3" fill="#e8c987" opacity="0.85" />
        <circle cx="82" cy="300" r="2.2" fill="#7dd3fc" opacity="0.8" />
      </g>

      <!-- Inner Sanctuary Ring -->
      <g class="astro-ring-inner">
        <circle cx="300" cy="300" r="128" fill="none" stroke="rgba(232,201,135,0.28)" stroke-width="0.7" />
        <polygon points="300,172 411,364 189,364" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="0.6" />
        <polygon points="300,428 411,236 189,236" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="0.6" />
      </g>

      <!-- Static Crosshairs -->
      <line x1="300" y1="6" x2="300" y2="38" stroke="rgba(232,201,135,0.35)" stroke-width="0.8" />
      <line x1="300" y1="562" x2="300" y2="594" stroke="rgba(232,201,135,0.35)" stroke-width="0.8" />
      <line x1="6" y1="300" x2="38" y2="300" stroke="rgba(232,201,135,0.35)" stroke-width="0.8" />
      <line x1="562" y1="300" x2="594" y2="300" stroke="rgba(232,201,135,0.35)" stroke-width="0.8" />
    </svg>
  </div>

  <!-- Custom Magnetic Halo Cursor -->
  <div class="cursor-halo" id="cursor-halo"></div>

  <!-- Interactive Editorial HUD -->
  <main class="hud-shell">
    <header class="hud-header">
      <div class="brand-block">
        <div class="brand-eyebrow">
          <span class="pulse-dot"></span>
          <span>Epoch IV &bull; Celestial Harmonic Observatory</span>
        </div>
        <h1 class="brand-title">Aetheria</h1>
        <p class="brand-subtitle" id="preset-subtitle">Where solar winds braid into luminous silence</p>
      </div>

      <div class="header-actions">
        <div class="telemetry-pill" aria-label="Celestial Telemetry">
          <div class="telemetry-item">RA<span id="coord-ra">14h 22m</span></div>
          <div class="telemetry-item">DEC<span id="coord-dec">+41&deg; 18&prime;</span></div>
          <div class="telemetry-item">FLUX<span id="flux-readout">60 Hz</span></div>
        </div>

        <button class="glass-btn" id="audio-toggle" type="button" title="Toggle Celestial Soundscape">
          <svg viewBox="0 0 24 24">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path id="audio-waves" d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" opacity="0.35"></path>
          </svg>
          <span id="audio-label">Sound Off</span>
        </button>

        <button class="glass-btn" id="zen-toggle" type="button" title="Hide Interface (Zen Mode)">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>Zen</span>
        </button>
      </div>
    </header>

    <section class="hud-center">
      <p class="epoch-caption" id="poetic-caption">
        &ldquo;Every particle remembers the geometry of the star that forged it.&rdquo;
      </p>
    </section>

    <footer class="hud-footer">
      <nav class="preset-dock" aria-label="Celestial Presets">
        <button class="preset-btn active" data-preset="nebula" type="button">
          <span class="preset-swatch" style="background: #e8c987; box-shadow: 0 0 8px #e8c987;"></span>
          Auric Nebula
        </button>
        <button class="preset-btn" data-preset="abyss" type="button">
          <span class="preset-swatch" style="background: #38bdf8; box-shadow: 0 0 8px #38bdf8;"></span>
          Bioluminescent Abyss
        </button>
        <button class="preset-btn" data-preset="eclipse" type="button">
          <span class="preset-swatch" style="background: #fb7185; box-shadow: 0 0 8px #fb7185;"></span>
          Solaris Eclipse
        </button>
        <button class="preset-btn" data-preset="horizon" type="button">
          <span class="preset-swatch" style="background: #c084fc; box-shadow: 0 0 8px #c084fc;"></span>
          Velvet Singularity
        </button>
      </nav>

      <div class="interaction-dock">
        <div class="slider-card">
          <span class="slider-label">Harmonic Drift</span>
          <input type="range" id="flow-slider" min="0.2" max="2.2" step="0.05" value="1.0" />
        </div>
        <button class="glass-btn" id="pulse-btn" type="button" title="Emit Harmonic Shockwave">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="12" r="8" stroke-dasharray="3 3"></circle>
          </svg>
          <span>Resonate</span>
        </button>
      </div>
    </footer>
  </main>

  <div class="gesture-hint" id="gesture-hint">
    Move to bend gravity &bull; Click anywhere to birth a harmonic wave
  </div>

  <button class="glass-btn zen-restore" id="zen-restore" type="button">
    Restore Observatory
  </button>

  <script>
    (() => {
      'use strict';

      /* =====================================================================
         1. SVG Astrolabe Precision Tick Generation
         ===================================================================== */
      const ticksGroup = document.getElementById('outer-ticks');
      if (ticksGroup) {
        const NS = 'http://www.w3.org/2000/svg';
        for (let deg = 0; deg < 360; deg += 5) {
          const rad = (deg * Math.PI) / 180;
          const isMajor = deg % 30 === 0;
          const r1 = 274;
          const r2 = isMajor ? 261 : 268;
          const line = document.createElementNS(NS, 'line');
          line.setAttribute('x1', (300 + Math.cos(rad) * r1).toFixed(2));
          line.setAttribute('y1', (300 + Math.sin(rad) * r1).toFixed(2));
          line.setAttribute('x2', (300 + Math.cos(rad) * r2).toFixed(2));
          line.setAttribute('y2', (300 + Math.sin(rad) * r2).toFixed(2));
          if (isMajor) line.setAttribute('stroke-width', '1.2');
          ticksGroup.appendChild(line);
        }
      }

      /* =====================================================================
         2. Celestial Curated Presets
         ===================================================================== */
      const PRESETS = {
        nebula: {
          name: 'Auric Nebula',
          subtitle: 'Where solar winds braid into luminous silence',
          quote: '“Every particle remembers the geometry of the star that forged it.”',
          bgInner: [14, 19, 42],
          bgOuter: [3, 4, 10],
          accent: '#e8c987',
          nebula: [
            [232, 180, 100, 0.16],
            [105, 165, 255, 0.15],
            [180, 115, 245, 0.12]
          ],
          particles: [
            [255, 224, 160],
            [140, 210, 255],
            [245, 245, 255],
            [215, 155, 255]
          ],
          chord: [220, 277.18, 329.63, 415.3, 493.88, 659.25] // A Maj9
        },
        abyss: {
          name: 'Bioluminescent Abyss',
          subtitle: 'Submerged constellations drifting through midnight currents',
          quote: '“Deep beneath the dark, light learns to breathe like water.”',
          bgInner: [6, 28, 44],
          bgOuter: [2, 6, 14],
          accent: '#38bdf8',
          nebula: [
            [34, 211, 238, 0.17],
            [56, 189, 248, 0.14],
            [45, 212, 191, 0.13]
          ],
          particles: [
            [103, 232, 249],
            [94, 234, 212],
            [186, 230, 253],
            [240, 253, 250]
          ],
          chord: [196, 246.94, 293.66, 369.99, 440, 587.33] // G Maj9
        },
        eclipse: {
          name: 'Solaris Eclipse',
          subtitle: 'Crimson corona suspended at the threshold of totality',
          quote: '“In the brief shadow of two worlds, the invisible crown awakens.”',
          bgInner: [38, 12, 24],
          bgOuter: [5, 2, 7],
          accent: '#fb7185',
          nebula: [
            [251, 113, 133, 0.17],
            [251, 146, 60, 0.14],
            [192, 132, 252, 0.10]
          ],
          particles: [
            [254, 202, 202],
            [253, 186, 116],
            [251, 113, 133],
            [255, 241, 242]
          ],
          chord: [174.61, 220, 261.63, 329.63, 392, 523.25] // F Maj9
        },
        horizon: {
          name: 'Velvet Singularity',
          subtitle: 'Violet gravity lensing the echoes of distant epochs',
          quote: '“Time folds gently where stillness becomes infinitely dense.”',
          bgInner: [26, 12, 46],
          bgOuter: [3, 2, 8],
          accent: '#c084fc',
          nebula: [
            [192, 132, 252, 0.18],
            [129, 140, 248, 0.15],
            [244, 114, 182, 0.11]
          ],
          particles: [
            [233, 213, 255],
            [165, 180, 252],
            [249, 168, 212],
            [255, 255, 255]
          ],
          chord: [164.81, 207.65, 246.94, 311.13, 369.99, 493.88] // E Maj9
        }
      };

      let activePresetKey = 'nebula';
      let currentPreset = PRESETS.nebula;

      /* =====================================================================
         3. Generative Web Audio Harmonic Engine (Zero External Assets)
         ===================================================================== */
      class CelestialAudioEngine {
        constructor() {
          this.ctx = null;
          this.enabled = false;
          this.masterGain = null;
          this.padOscs = [];
          this.padFilter = null;
          this.chordIndex = 0;
        }

        init() {
          if (this.ctx) return;
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;

          this.ctx = new AudioContext();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.value = 0.0001;

          // Warm stereo-like delay feedback network for cosmic spaciousness
          const delay = this.ctx.createDelay(1.5);
          delay.delayTime.value = 0.42;
          const feedback = this.ctx.createGain();
          feedback.gain.value = 0.36;
          const delayFilter = this.ctx.createBiquadFilter();
          delayFilter.type = 'lowpass';
          delayFilter.frequency.value = 1400;

          delay.connect(delayFilter);
          delayFilter.connect(feedback);
          feedback.connect(delay);
          delayFilter.connect(this.masterGain);

          this.reverbSend = delay;
          this.masterGain.connect(this.ctx.destination);

          // Continuous celestial pad drone
          this.padFilter = this.ctx.createBiquadFilter();
          this.padFilter.type = 'lowpass';
          this.padFilter.frequency.value = 420;
          this.padFilter.Q.value = 1.2;

          const padGain = this.ctx.createGain();
          padGain.gain.value = 0.11;
          this.padFilter.connect(padGain);
          padGain.connect(this.masterGain);
          padGain.connect(this.reverbSend);

          const baseFreqs = [110, 164.81, 220];
          baseFreqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.value = f;
            osc.detune.value = (idx - 1) * 6;
            osc.connect(this.padFilter);
            osc.start();
            this.padOscs.push(osc);
          });
        }

        toggle() {
          this.init();
          if (!this.ctx) return false;
          if (this.ctx.state === 'suspended') {
            this.ctx.resume();
          }

          this.enabled = !this.enabled;
          const now = this.ctx.currentTime;
          this.masterGain.gain.cancelScheduledValues(now);
          this.masterGain.gain.setTargetAtTime(this.enabled ? 0.52 : 0.0001, now, 0.65);

          if (this.enabled) {
            this.playChime(0.75);
          }
          return this.enabled;
        }

        retuneToPreset(preset) {
          if (!this.ctx || !this.padOscs.length) return;
          const now = this.ctx.currentTime;
          const root = preset.chord[0] * 0.5;
          const fifth = preset.chord[2] * 0.5;
          const octave = preset.chord[0];
          [root, fifth, octave].forEach((freq, idx) => {
            if (this.padOscs[idx]) {
              this.padOscs[idx].frequency.setTargetAtTime(freq, now, 1.4);
            }
          });
          if (this.enabled) {
            this.playChime(0.5);
          }
        }

        modulateFilter(normalizedY) {
          if (!this.ctx || !this.enabled || !this.padFilter) return;
          const target = 240 + (1 - normalizedY) * 520;
          this.padFilter.frequency.setTargetAtTime(target, this.ctx.currentTime, 0.25);
        }

        playChime(intensity = 0.6) {
          if (!this.ctx || !this.enabled) return;
          const now = this.ctx.currentTime;
          const scale = currentPreset.chord;
          const freq = scale[this.chordIndex % scale.length];
          this.chordIndex = (this.chordIndex + 1 + Math.floor(Math.random() * 2)) % scale.length;

          const osc = this.ctx.createOscillator();
          const harmonic = this.ctx.createOscillator();
          const env = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          harmonic.type = 'sine';
          harmonic.frequency.setValueAtTime(freq * 2, now);

          const harmonicGain = this.ctx.createGain();
          harmonicGain.gain.value = 0.22;

          env.gain.setValueAtTime(0.0001, now);
          env.gain.exponentialRampToValueAtTime(0.14 * intensity, now + 0.035);
          env.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

          osc.connect(env);
          harmonic.connect(harmonicGain);
          harmonicGain.connect(env);

          env.connect(this.masterGain);
          env.connect(this.reverbSend);

          osc.start(now);
          harmonic.start(now);
          osc.stop(now + 3.6);
          harmonic.stop(now + 3.6);
        }
      }

      const audioEngine = new CelestialAudioEngine();

      /* =====================================================================
         4. High-Craft Cosmos Canvas Renderer
         ===================================================================== */
      const canvas = document.getElementById('cosmos-canvas');
      const ctx = canvas.getContext('2d', { alpha: false });

      let width = 0;
      let height = 0;
      let dpr = 1;
      let centerX = 0;
      let centerY = 0;

      // Smoothly interpolated palette state
      const visualState = {
        bgInner: [...currentPreset.bgInner],
        bgOuter: [...currentPreset.bgOuter],
        nebula: currentPreset.nebula.map(c => [...c]),
        flowSpeed: 1.0,
        time: 0
      };

      // Pointer & Gravity State
      const pointer = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        active: false,
        down: false
      };

      // Offscreen Pre-rendered Nebula Cloud Sprites for silky 60fps glow
      function createGlowSprite(r, g, b, alpha) {
        const size = 256;
        const off = document.createElement('canvas');
        off.width = size;
        off.height = size;
        const octx = off.getContext('2d');
        const grad = octx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        octx.fillStyle = grad;
        octx.fillRect(0, 0, size, size);
        return off;
      }

      let nebulaSprites = [];
      function rebuildNebulaSprites() {
        nebulaSprites = visualState.nebula.map(c =>
          createGlowSprite(Math.round(c[0]), Math.round(c[1]), Math.round(c[2]), c[3])
        );
      }

      // Scene Entities
      const stars = [];
      const brightStars = [];
      const motes = [];
      const nebulaClouds = [];
      const shockwaves = [];
      const meteors = [];

      const STAR_COUNT = 260;
      const MOTE_COUNT = 680;
      const NEBULA_CLOUD_COUNT = 11;

      function initSceneEntities() {
        stars.length = 0;
        brightStars.length = 0;
        motes.length = 0;
        nebulaClouds.length = 0;

        for (let i = 0; i < STAR_COUNT; i++) {
          const isBright = i < 28;
          const star = {
            x: Math.random() * width,
            y: Math.random() * height,
            z: 0.25 + Math.random() * 0.9,
            size: isBright ? 1.3 + Math.random() * 1.4 : 0.45 + Math.random() * 1.05,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.6 + Math.random() * 2.2,
            baseAlpha: isBright ? 0.65 + Math.random() * 0.35 : 0.22 + Math.random() * 0.55,
            isBright
          };
          stars.push(star);
          if (isBright) brightStars.push(star);
        }

        for (let i = 0; i < NEBULA_CLOUD_COUNT; i++) {
          nebulaClouds.push({
            angle: (i / NEBULA_CLOUD_COUNT) * Math.PI * 2,
            radiusFactor: 0.08 + Math.random() * 0.32,
            size: Math.min(width, height) * (0.48 + Math.random() * 0.45),
            speed: (Math.random() > 0.5 ? 1 : -1) * (0.015 + Math.random() * 0.025),
            spriteIdx: i % 3,
            pulseOffset: Math.random() * Math.PI * 2
          });
        }

        for (let i = 0; i < MOTE_COUNT; i++) {
          motes.push(createMote(true));
        }

        rebuildNebulaSprites();
      }

      function createMote(randomPos = false) {
        const angle = Math.random() * Math.PI * 2;
        const dist = randomPos
          ? Math.random() * Math.max(width, height) * 0.62
          : (0.04 + Math.random() * 0.52) * Math.min(width, height);
        const palette = currentPreset.particles;
        const col = palette[Math.floor(Math.random() * palette.length)];
        return {
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          size: 0.7 + Math.random() * 1.9,
          life: Math.random() * 260,
          maxLife: 220 + Math.random() * 260,
          color: col,
          alpha: 0.25 + Math.random() * 0.72,
          orbitBias: 0.6 + Math.random() * 0.8
        };
      }

      function spawnShockwave(x, y, playAudio = true) {
        shockwaves.push({
          x,
          y,
          radius: 6,
          maxRadius: Math.min(width, height) * 0.45,
          alpha: 0.85,
          color: currentPreset.accent
        });

        // Radial burst of delicate motes
        for (let i = 0; i < 18; i++) {
          const idx = Math.floor(Math.random() * motes.length);
          const m = motes[idx];
          const a = (i / 18) * Math.PI * 2 + Math.random() * 0.2;
          const speed = 2.4 + Math.random() * 3.5;
          m.x = x;
          m.y = y;
          m.vx = Math.cos(a) * speed;
          m.vy = Math.sin(a) * speed;
          m.life = 0;
        }

        if (playAudio) {
          audioEngine.playChime(0.85);
        }
      }

      function spawnMeteor() {
        const startX = Math.random() * width * 0.9;
        const startY = Math.random() * height * 0.45;
        const angle = Math.PI * 0.16 + Math.random() * 0.22;
        const speed = 11 + Math.random() * 9;
        meteors.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: 75 + Math.random() * 90,
          alpha: 1.0
        });
      }

      function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        centerX = width * 0.5;
        centerY = height * 0.5;

        if (!pointer.active) {
          pointer.x = pointer.targetX = centerX;
          pointer.y = pointer.targetY = centerY;
        }
        initSceneEntities();
      }

      /* =====================================================================
         5. Smooth Color Interpolation & Vector Field Mathematics
         ===================================================================== */
      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      let colorRebuildCounter = 0;
      function updatePaletteTransition() {
        const ease = 0.035;
        let changed = false;
        for (let i = 0; i < 3; i++) {
          if (Math.abs(visualState.bgInner[i] - currentPreset.bgInner[i]) > 0.2) {
            visualState.bgInner[i] = lerp(visualState.bgInner[i], currentPreset.bgInner[i], ease);
            visualState.bgOuter[i] = lerp(visualState.bgOuter[i], currentPreset.bgOuter[i], ease);
            changed = true;
          }
          for (let j = 0; j < 4; j++) {
            if (Math.abs(visualState.nebula[i][j] - currentPreset.nebula[i][j]) > 0.005) {
              visualState.nebula[i][j] = lerp(visualState.nebula[i][j], currentPreset.nebula[i][j], ease);
              changed = true;
            }
          }
        }
        colorRebuildCounter++;
        if (changed && colorRebuildCounter % 8 === 0) {
          rebuildNebulaSprites();
        }
      }

      // Smooth harmonic curl-like flow field
      function sampleField(x, y, t) {
        const nx = (x - centerX) * 0.0028;
        const ny = (y - centerY) * 0.0028;
        const angle =
          Math.sin(nx * 1.9 + t * 0.28) * 1.4 +
          Math.cos(ny * 2.1 - t * 0.22) * 1.4 +
          Math.sin((nx + ny) * 1.3 + t * 0.15);
        return angle;
      }

      /* =====================================================================
         6. Animation Loop (60fps Target + Live Telemetry)
         ===================================================================== */
      let lastTime = performance.now();
      let fpsFrames = 0;
      let fpsTimer = 0;
      const fluxEl = document.getElementById('flux-readout');

      function render(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        visualState.time += dt * visualState.flowSpeed;
        const t = visualState.time;

        // FPS Telemetry
        fpsFrames++;
        fpsTimer += dt;
        if (fpsTimer >= 0.75) {
          if (fluxEl) {
            fluxEl.textContent = `${Math.round(fpsFrames / fpsTimer)} Hz`;
          }
          fpsFrames = 0;
          fpsTimer = 0;
        }

        updatePaletteTransition();

        // Smooth pointer inertia
        const prevPx = pointer.x;
        const prevPy = pointer.y;
        pointer.x = lerp(pointer.x, pointer.targetX, 0.12);
        pointer.y = lerp(pointer.y, pointer.targetY, 0.12);
        pointer.vx = pointer.x - prevPx;
        pointer.vy = pointer.y - prevPy;

        // 1. Deep Atmospheric Sky Gradient
        const bgGrad = ctx.createRadialGradient(
          centerX + (pointer.x - centerX) * 0.12,
          centerY + (pointer.y - centerY) * 0.12,
          0,
          centerX,
          centerY,
          Math.max(width, height) * 0.78
        );
        const bi = visualState.bgInner.map(Math.round);
        const bo = visualState.bgOuter.map(Math.round);
        bgGrad.addColorStop(0, `rgb(${bi[0]}, ${bi[1]}, ${bi[2]})`);
        bgGrad.addColorStop(1, `rgb(${bo[0]}, ${bo[1]}, ${bo[2]})`);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Luminous Nebula Clouds (Additive Blending)
        ctx.globalCompositeOperation = 'screen';
        const parallaxX = (pointer.x - centerX) * 0.04;
        const parallaxY = (pointer.y - centerY) * 0.04;

        for (let i = 0; i < nebulaClouds.length; i++) {
          const c = nebulaClouds[i];
          const a = c.angle + t * c.speed;
          const dist = Math.min(width, height) * c.radiusFactor;
          const cx = centerX + Math.cos(a) * dist - parallaxX * 0.8;
          const cy = centerY + Math.sin(a * 0.85) * dist * 0.72 - parallaxY * 0.8;
          const breathe = 1 + Math.sin(t * 0.6 + c.pulseOffset) * 0.08;
          const s = c.size * breathe;
          const sprite = nebulaSprites[c.spriteIdx];
          if (sprite) {
            ctx.drawImage(sprite, cx - s * 0.5, cy - s * 0.5, s, s);
          }
        }

        // 3. Parallax Starfield & Subtle Constellations
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < stars.length; i++) {
          const st = stars[i];
          const sx = (st.x - parallaxX * st.z + width) % width;
          const sy = (st.y - parallaxY * st.z + height) % height;
          const twinkle = 0.65 + 0.35 * Math.sin(t * st.twinkleSpeed + st.phase);
          const alpha = st.baseAlpha * twinkle;

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, st.size, 0, Math.PI * 2);
          ctx.fill();

          if (st.isBright && alpha > 0.72) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.25).toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(sx - st.size * 3.2, sy);
            ctx.lineTo(sx + st.size * 3.2, sy);
            ctx.moveTo(sx, sy - st.size * 3.2);
            ctx.lineTo(sx, sy + st.size * 3.2);
            ctx.stroke();
          }
        }

        // Delicate constellation threads near cursor
        if (pointer.active) {
          ctx.lineWidth = 0.55;
          for (let i = 0; i < brightStars.length; i++) {
            const a = brightStars[i];
            const ax = (a.x - parallaxX * a.z + width) % width;
            const ay = (a.y - parallaxY * a.z + height) % height;
            const distCursor = Math.hypot(ax - pointer.x, ay - pointer.y);
            if (distCursor > 240) continue;

            for (let j = i + 1; j < brightStars.length; j++) {
              const b = brightStars[j];
              const bx = (b.x - parallaxX * b.z + width) % width;
              const by = (b.y - parallaxY * b.z + height) % height;
              const d = Math.hypot(ax - bx, ay - by);
              if (d < 175) {
                const lineAlpha = (1 - d / 175) * (1 - distCursor / 240) * 0.34;
                ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.lineTo(bx, by);
                ctx.stroke();
              }
            }
          }
        }

        // 4. Harmonic Particle Stream (Orbital + Curl Field + Gravitational Cursor)
        const palette = currentPreset.particles;
        for (let i = 0; i < motes.length; i++) {
          const m = motes[i];
          m.life++;
          if (m.life >= m.maxLife) {
            const fresh = createMote(false);
            m.x = fresh.x;
            m.y = fresh.y;
            m.vx = 0;
            m.vy = 0;
            m.life = 0;
            m.color = palette[Math.floor(Math.random() * palette.length)];
          }

          // Vector field + gentle galactic swirl around center
          const fieldAngle = sampleField(m.x, m.y, t);
          const dxC = m.x - centerX;
          const dyC = m.y - centerY;
          const distC = Math.sqrt(dxC * dxC + dyC * dyC) + 1;
          const swirlX = (-dyC / distC) * 0.42 * m.orbitBias;
          const swirlY = (dxC / distC) * 0.42 * m.orbitBias;

          m.vx += (Math.cos(fieldAngle) * 0.24 + swirlX) * visualState.flowSpeed * 0.14;
          m.vy += (Math.sin(fieldAngle) * 0.24 + swirlY) * visualState.flowSpeed * 0.14;

          // Gravitational lensing / swirling near cursor
          if (pointer.active) {
            const dxP = pointer.x - m.x;
            const dyP = pointer.y - m.y;
            const distSq = dxP * dxP + dyP * dyP;
            const radiusLimit = pointer.down ? 320 : 210;
            if (distSq < radiusLimit * radiusLimit && distSq > 16) {
              const distP = Math.sqrt(distSq);
              const pull = (1 - distP / radiusLimit) * (pointer.down ? 0.48 : 0.19);
              // Combine subtle attraction with tangential orbital spin
              m.vx += (dxP / distP) * pull - (dyP / distP) * pull * 0.72 + pointer.vx * 0.025;
              m.vy += (dyP / distP) * pull + (dxP / distP) * pull * 0.72 + pointer.vy * 0.025;
            }
          }

          // Damping & integration
          m.vx *= 0.945;
          m.vy *= 0.945;
          const prevX = m.x;
          const prevY = m.y;
          m.x += m.vx;
          m.y += m.vy;

          // Fade in & out smoothly over lifecycle
          const lifeRatio = m.life / m.maxLife;
          const lifeAlpha = Math.sin(lifeRatio * Math.PI);
          const finalAlpha = m.alpha * lifeAlpha;

          if (finalAlpha > 0.02) {
            const [r, g, b] = m.color;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha.toFixed(3)})`;
            ctx.lineWidth = m.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(m.x + 0.01, m.y + 0.01);
            ctx.stroke();
          }

          // Wrap gracefully if far off-screen
          if (m.x < -80 || m.x > width + 80 || m.y < -80 || m.y > height + 80) {
            m.life = m.maxLife;
          }
        }

        // 5. Central Luminous Core Singularity
        const corePulse = 1 + Math.sin(t * 1.4) * 0.12;
        const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 96 * corePulse);
        coreGrad.addColorStop(0, 'rgba(255, 250, 240, 0.22)');
        coreGrad.addColorStop(0.28, `rgba(${bi[0] + 90}, ${bi[1] + 90}, ${bi[2] + 120}, 0.11)`);
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 96 * corePulse, 0, Math.PI * 2);
        ctx.fill();

        // 6. Harmonic Shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.radius += (sw.maxRadius - sw.radius) * 0.065 + 1.4;
          sw.alpha *= 0.94;
          if (sw.alpha < 0.015) {
            shockwaves.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = sw.color;
          ctx.globalAlpha = sw.alpha;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.lineWidth = 0.6;
          ctx.globalAlpha = sw.alpha * 0.5;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius * 0.76, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // 7. Occasional Shooting Stars
        if (Math.random() < 0.0045 && meteors.length < 2) {
          spawnMeteor();
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const met = meteors[i];
          met.x += met.vx;
          met.y += met.vy;
          met.alpha -= 0.016;
          if (met.alpha <= 0) {
            meteors.splice(i, 1);
            continue;
          }
          const norm = Math.hypot(met.vx, met.vy);
          const tailX = met.x - (met.vx / norm) * met.length;
          const tailY = met.y - (met.vy / norm) * met.length;
          const mGrad = ctx.createLinearGradient(met.x, met.y, tailX, tailY);
          mGrad.addColorStop(0, `rgba(255, 255, 255, ${met.alpha})`);
          mGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = mGrad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(met.x, met.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }

        requestAnimationFrame(render);
      }

      /* =====================================================================
         7. UI Bindings, Telemetry & Interactive Events
         ===================================================================== */
      const cursorHalo = document.getElementById('cursor-halo');
      const raEl = document.getElementById('coord-ra');
      const decEl = document.getElementById('coord-dec');
      const gestureHint = document.getElementById('gesture-hint');

      function updateCoordinates(x, y) {
        const raHours = Math.floor((x / width) * 24);
        const raMins = Math.floor((((x / width) * 24) % 1) * 60);
        const decDeg = Math.round(90 - (y / height) * 180);
        const decMin = Math.floor(Math.abs(((y / height) * 180) % 1) * 60);
        const sign = decDeg >= 0 ? '+' : '';
        if (raEl) raEl.textContent = `${String(raHours).padStart(2, '0')}h ${String(raMins).padStart(2, '0')}m`;
        if (decEl) decEl.textContent = `${sign}${decDeg}° ${String(decMin).padStart(2, '0')}′`;
      }

      window.addEventListener('pointermove', (e) => {
        pointer.active = true;
        pointer.targetX = e.clientX;
        pointer.targetY = e.clientY;
        if (cursorHalo) {
          cursorHalo.style.opacity = '1';
          cursorHalo.style.left = `${e.clientX}px`;
          cursorHalo.style.top = `${e.clientY}px`;
        }
        updateCoordinates(e.clientX, e.clientY);
        audioEngine.modulateFilter(e.clientY / height);
      });

      window.addEventListener('pointerdown', (e) => {
        // Ignore clicks on UI controls for shockwave spawning
        if (e.target.closest('button, input, .preset-dock')) return;
        pointer.down = true;
        if (cursorHalo) cursorHalo.classList.add('active');
        if (gestureHint) gestureHint.classList.add('hidden');
        spawnShockwave(e.clientX, e.clientY, true);
      });

      window.addEventListener('pointerup', () => {
        pointer.down = false;
        if (cursorHalo) cursorHalo.classList.remove('active');
      });

      window.addEventListener('pointerleave', () => {
        pointer.active = false;
        if (cursorHalo) cursorHalo.style.opacity = '0';
      });

      // Preset Switching
      const presetBtns = document.querySelectorAll('.preset-btn');
      const subtitleEl = document.getElementById('preset-subtitle');
      const captionEl = document.getElementById('poetic-caption');

      presetBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.preset;
          if (!PRESETS[key] || key === activePresetKey) return;

          activePresetKey = key;
          currentPreset = PRESETS[key];
          document.documentElement.style.setProperty('--accent-primary', currentPreset.accent);

          presetBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (subtitleEl) subtitleEl.textContent = currentPreset.subtitle;
          if (captionEl) {
            captionEl.style.opacity = '0';
            setTimeout(() => {
              captionEl.textContent = currentPreset.quote;
              captionEl.style.opacity = '1';
            }, 320);
          }

          spawnShockwave(centerX, centerY, false);
          audioEngine.retuneToPreset(currentPreset);
        });
      });

      // Harmonic Drift Slider
      const flowSlider = document.getElementById('flow-slider');
      if (flowSlider) {
        flowSlider.addEventListener('input', (e) => {
          visualState.flowSpeed = parseFloat(e.target.value);
        });
      }

      // Resonate Button
      const pulseBtn = document.getElementById('pulse-btn');
      if (pulseBtn) {
        pulseBtn.addEventListener('click', () => {
          spawnShockwave(centerX, centerY, true);
        });
      }

      // Audio Toggle
      const audioBtn = document.getElementById('audio-toggle');
      const audioLabel = document.getElementById('audio-label');
      const audioWaves = document.getElementById('audio-waves');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => {
          const isOn = audioEngine.toggle();
          audioBtn.classList.toggle('is-active', isOn);
          if (audioLabel) audioLabel.textContent = isOn ? 'Sound On' : 'Sound Off';
          if (audioWaves) audioWaves.setAttribute('opacity', isOn ? '1' : '0.35');
        });
      }

      // Zen Mode Toggle
      const zenBtn = document.getElementById('zen-toggle');
      const zenRestore = document.getElementById('zen-restore');
      if (zenBtn) {
        zenBtn.addEventListener('click', () => {
          document.body.classList.add('zen-mode');
        });
      }
      if (zenRestore) {
        zenRestore.addEventListener('click', () => {
          document.body.classList.remove('zen-mode');
        });
      }

      // Keyboard shortcut: 'Z' for Zen Mode, Space for Resonate
      window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'z') {
          document.body.classList.toggle('zen-mode');
        } else if (e.code === 'Space') {
          e.preventDefault();
          spawnShockwave(centerX, centerY, true);
        }
      });

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      requestAnimationFrame(render);
    })();
  </script>
</body>
</html>
```

### Gemini 4 Carbon, AETHERIA (Symphony of Light & Form)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AETHERIA, Symphony of Light & Form</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@200;300;400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --glass-bg: rgba(12, 14, 22, 0.38);
      --glass-border: rgba(255, 255, 255, 0.12);
      --glass-highlight: rgba(255, 255, 255, 0.25);
      --text-main: rgba(255, 255, 255, 0.94);
      --text-muted: rgba(255, 255, 255, 0.58);
      --accent: #a5b4fc;
      --transition-slow: 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      --transition-fast: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    html, body {
      width: 100%;
      min-height: 100%;
      background-color: #040508;
      color: var(--text-main);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow-x: hidden;
      scroll-behavior: smooth;
      cursor: none;
    }

    @media (pointer: coarse) {
      html, body { cursor: auto; }
      .custom-cursor, .cursor-ring { display: none !important; }
    }

    /* Background Canvases */
    #gl-canvas, #particle-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    }
    #gl-canvas { z-index: 0; }
    #particle-canvas { z-index: 1; mix-blend-mode: screen; }

    /* Vignette & Film Grain Overlay */
    .atmosphere-overlay {
      position: fixed;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background: radial-gradient(circle at 50% 50%, transparent 35%, rgba(3, 4, 9, 0.65) 100%);
    }

    /* Custom Magnetic Cursor */
    .custom-cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.8);
      transition: width 0.2s, height 0.2s, background 0.2s;
    }

    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 38px;
      height: 38px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.3s,
                  background-color 0.3s;
      backdrop-filter: invert(0.05);
    }

    body.cursor-hover .cursor-ring {
      width: 60px;
      height: 60px;
      border-color: rgba(255, 255, 255, 0.8);
      background-color: rgba(255, 255, 255, 0.06);
    }

    /* UI Container & Zen Mode */
    .ui-layer {
      position: relative;
      z-index: 10;
      transition: opacity var(--transition-slow), transform var(--transition-slow);
    }

    body.zen-mode .ui-layer {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.98);
    }

    /* Top Navigation */
    header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      padding: 28px 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 50;
      transition: opacity var(--transition-slow);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: 'Cinzel', serif;
      font-size: 1.05rem;
      letter-spacing: 0.32em;
      font-weight: 500;
      color: var(--text-main);
      text-shadow: 0 2px 20px rgba(0,0,0,0.5);
    }

    .brand-orb {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 16px 4px var(--accent);
      animation: pulseOrb 4s ease-in-out infinite;
    }

    @keyframes pulseOrb {
      0%, 100% { transform: scale(1); opacity: 0.85; }
      50% { transform: scale(1.35); opacity: 1; }
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .pill-btn {
      background: var(--glass-bg);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      padding: 10px 20px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: none;
      transition: all var(--transition-fast);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    }

    .pill-btn:hover {
      border-color: var(--glass-highlight);
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.08);
    }

    .pill-btn.active {
      border-color: rgba(255, 255, 255, 0.45);
      background: rgba(255, 255, 255, 0.14);
    }

    /* Audio Equalizer Bars */
    .eq-bars {
      display: flex;
      align-items: flex-end;
      gap: 2.5px;
      height: 12px;
    }

    .eq-bar {
      width: 2px;
      background: #fff;
      border-radius: 2px;
      height: 3px;
      transition: height 0.2s ease;
    }

    .pill-btn.playing .eq-bar:nth-child(1) { animation: eqAnim 0.9s ease-in-out infinite; }
    .pill-btn.playing .eq-bar:nth-child(2) { animation: eqAnim 0.7s ease-in-out infinite 0.15s; }
    .pill-btn.playing .eq-bar:nth-child(3) { animation: eqAnim 1.1s ease-in-out infinite 0.3s; }
    .pill-btn.playing .eq-bar:nth-child(4) { animation: eqAnim 0.8s ease-in-out infinite 0.05s; }

    @keyframes eqAnim {
      0%, 100% { height: 3px; opacity: 0.5; }
      50% { height: 12px; opacity: 1; }
    }

    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 120px 24px 100px;
      position: relative;
    }

    .eyebrow {
      font-size: 0.72rem;
      letter-spacing: 0.42em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 24px;
      opacity: 0;
      animation: fadeUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s;
    }

    h1.hero-title {
      font-family: 'Cinzel', serif;
      font-weight: 400;
      font-size: clamp(2.6rem, 6.8vw, 6.2rem);
      line-height: 1.08;
      letter-spacing: 0.06em;
      max-width: 1050px;
      margin-bottom: 28px;
      background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.62) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 10px 35px rgba(0, 0, 0, 0.45));
      opacity: 0;
      animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s;
    }

    .hero-subtitle {
      font-size: clamp(0.95rem, 1.4vw, 1.15rem);
      font-weight: 300;
      line-height: 1.75;
      color: var(--text-muted);
      max-width: 540px;
      margin-bottom: 46px;
      opacity: 0;
      animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.6s;
    }

    .hero-actions {
      display: flex;
      gap: 18px;
      flex-wrap: wrap;
      justify-content: center;
      opacity: 0;
      animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.8s;
    }

    .cta-primary {
      position: relative;
      padding: 15px 34px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.92);
      color: #06080f;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      border: none;
      cursor: none;
      overflow: hidden;
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);
      box-shadow: 0 0 35px rgba(255, 255, 255, 0.25);
    }

    .cta-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
    }

    .scroll-hint {
      position: absolute;
      bottom: 112px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
      opacity: 0;
      animation: fadeUp 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 1.1s;
    }

    .scroll-line {
      width: 1px;
      height: 38px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent);
      animation: scrollPulse 2.4s ease-in-out infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { transform: scaleY(1); opacity: 0.4; }
      50% { transform: scaleY(1.25); opacity: 0.9; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Section 2: Triptych of Harmonics */
    .section {
      max-width: 1220px;
      margin: 0 auto;
      padding: 100px 28px 140px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .section-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(1.8rem, 3.2vw, 2.8rem);
      font-weight: 400;
      letter-spacing: 0.1em;
      margin-bottom: 14px;
    }

    .section-desc {
      color: var(--text-muted);
      font-weight: 300;
      font-size: 0.98rem;
      max-width: 480px;
      margin: 0 auto;
      line-height: 1.7;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 28px;
    }

    .glass-card {
      position: relative;
      background: var(--glass-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 42px 34px;
      overflow: hidden;
      transition: border-color 0.4s ease, box-shadow 0.4s ease;
      transform-style: preserve-3d;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    }

    .glass-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.13),
        transparent 45%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    .glass-card:hover::before {
      opacity: 1;
    }

    .glass-card:hover {
      border-color: rgba(255, 255, 255, 0.28);
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.06);
    }

    .card-num {
      font-family: 'Cinzel', serif;
      font-size: 0.8rem;
      letter-spacing: 0.28em;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 28px;
      display: block;
    }

    .card-icon {
      width: 44px;
      height: 44px;
      margin-bottom: 24px;
      stroke: rgba(255, 255, 255, 0.88);
      stroke-width: 1.2;
      fill: none;
    }

    .card-title {
      font-family: 'Cinzel', serif;
      font-size: 1.35rem;
      font-weight: 400;
      letter-spacing: 0.08em;
      margin-bottom: 14px;
    }

    .card-text {
      color: var(--text-muted);
      font-weight: 300;
      font-size: 0.92rem;
      line-height: 1.75;
      margin-bottom: 28px;
    }

    .card-trigger {
      font-size: 0.72rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
      padding-bottom: 4px;
      transition: gap 0.3s ease, border-color 0.3s ease;
    }

    .glass-card:hover .card-trigger {
      gap: 14px;
      border-color: rgba(255, 255, 255, 0.8);
    }

    /* Section 3: Sculptor Synthesizer Panel */
    .synth-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid var(--glass-border);
      border-radius: 28px;
      padding: 48px;
      max-width: 880px;
      margin: 0 auto 120px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
    }

    .sliders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 32px;
      margin-top: 36px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .control-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .control-val {
      color: var(--text-main);
      font-variant-numeric: tabular-nums;
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      outline: none;
      cursor: none;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.9);
      transition: transform 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.3);
    }

    /* Floating Bottom Realm Dock */
    .realm-dock {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 60;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px;
      background: rgba(10, 12, 20, 0.52);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid var(--glass-border);
      border-radius: 999px;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
      transition: opacity var(--transition-slow), transform var(--transition-slow);
    }

    .realm-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 9px 18px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 0.73rem;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      cursor: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .realm-swatch {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .realm-btn:hover {
      color: var(--text-main);
    }

    .realm-btn.active {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    /* Persistent Zen Exit Button */
    .zen-exit {
      position: fixed;
      top: 28px;
      right: 44px;
      z-index: 80;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-10px);
      transition: all var(--transition-fast);
    }

    body.zen-mode .zen-exit {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    footer {
      text-align: center;
      padding: 30px 20px 120px;
      color: rgba(255, 255, 255, 0.35);
      font-size: 0.72rem;
      letter-spacing: 0.24em;
      text-transform: uppercase;
    }

    @media (max-width: 768px) {
      header { padding: 20px 20px; }
      .brand span { display: none; }
      .synth-panel { padding: 32px 22px; }
      .realm-dock {
        bottom: 18px;
        max-width: 94vw;
        overflow-x: auto;
      }
      .realm-btn { padding: 8px 13px; font-size: 0.66rem; }
      .zen-exit { right: 20px; top: 20px; }
    }
  </style>
</head>
<body>

  <!-- Shader & Particle Canvases -->
  <canvas id="gl-canvas"></canvas>
  <canvas id="particle-canvas"></canvas>
  <div class="atmosphere-overlay"></div>

  <!-- Custom Cursor -->
  <div class="custom-cursor" id="cursor-dot"></div>
  <div class="cursor-ring" id="cursor-ring"></div>

  <!-- Zen Exit Button -->
  <button class="pill-btn zen-exit interactive" id="zen-exit-btn">
    Return Interface
  </button>

  <!-- Main Interface -->
  <div class="ui-layer">
    <header>
      <div class="brand">
        <div class="brand-orb" id="brand-orb"></div>
        <span>AETHERIA</span>
      </div>
      <div class="header-controls">
        <button class="pill-btn interactive" id="audio-btn" title="Toggle Generative Ambient Audio">
          <div class="eq-bars">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
          <span id="audio-label">Sound Off</span>
        </button>
        <button class="pill-btn interactive" id="zen-btn" title="Pure Meditative Canvas">
          <span>Zen Mode</span>
        </button>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="eyebrow">Interactive Luminescence &bull; Real-Time Shader</div>
        <h1 class="hero-title">Where Light Remembers How to Breathe</h1>
        <p class="hero-subtitle">
          Move across the canvas to bend fluid stardust, click anywhere to awaken harmonic ripples, and sculpt living light in real time.
        </p>
        <div class="hero-actions">
          <button class="cta-primary interactive" id="awaken-btn">Awaken Symphony</button>
          <a href="#sculptor" class="pill-btn interactive" style="text-decoration:none; padding: 14px 28px;">Sculpt Light</a>
        </div>

        <div class="scroll-hint">
          <span>Explore</span>
          <div class="scroll-line"></div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Triptych of Form</h2>
          <p class="section-desc">Each harmonic state weaves mathematical waves, gravity, and procedural sound into a singular meditative space.</p>
        </div>

        <div class="cards-grid">
          <div class="glass-card interactive" data-chord="0">
            <span class="card-num">I &mdash; HARMONY</span>
            <svg class="card-icon" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="18" />
              <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(30 24 24)" />
              <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-30 24 24)" />
            </svg>
            <h3 class="card-title">Fluid Domain Warping</h3>
            <p class="card-text">Recursive fractional Brownian fields fold space upon itself, painting silk-like nebulae that never repeat twice in the history of time.</p>
            <span class="card-trigger">Trigger Harmonic Pulse &rarr;</span>
          </div>

          <div class="glass-card interactive" data-chord="1">
            <span class="card-num">II &mdash; GRAVITY</span>
            <svg class="card-icon" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="5" />
              <circle cx="24" cy="24" r="12" stroke-dasharray="3 4" />
              <circle cx="24" cy="24" r="19" />
            </svg>
            <h3 class="card-title">Kinetic Stardust</h3>
            <p class="card-text">Luminous particles drift along orbital currents, gently drawn toward your presence and bursting outward with every touch.</p>
            <span class="card-trigger">Trigger Starlight Burst &rarr;</span>
          </div>

          <div class="glass-card interactive" data-chord="2">
            <span class="card-num">III &mdash; RESONANCE</span>
            <svg class="card-icon" viewBox="0 0 48 48">
              <path d="M6 24 Q 15 8, 24 24 T 42 24" />
              <path d="M6 24 Q 15 40, 24 24 T 42 24" opacity="0.5" />
              <circle cx="24" cy="24" r="3" />
            </svg>
            <h3 class="card-title">Crystalline Synthesis</h3>
            <p class="card-text">Pure Web Audio oscillators weave an endless ambient drone and Lydian crystal chimes routed through a custom algorithmic cathedral reverb.</p>
            <span class="card-trigger">Resonate Chord &rarr;</span>
          </div>
        </div>
      </section>

      <section class="section" id="sculptor" style="padding-top: 20px;">
        <div class="synth-panel">
          <div class="section-header" style="margin-bottom: 16px;">
            <h2 class="section-title" style="font-size: 2rem;">Light Sculptor</h2>
            <p class="section-desc">Modulate the underlying shader mathematics and orbital particle field directly.</p>
          </div>

          <div class="sliders-grid">
            <div class="control-group">
              <div class="control-label">
                <span>Flow Velocity</span>
                <span class="control-val" id="val-speed">1.0x</span>
              </div>
              <input type="range" class="interactive" id="slider-speed" min="0.1" max="3.0" step="0.05" value="1.0">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Silk Turbulence</span>
                <span class="control-val" id="val-warp">1.35</span>
              </div>
              <input type="range" class="interactive" id="slider-warp" min="0.4" max="2.8" step="0.05" value="1.35">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Luminance Bloom</span>
                <span class="control-val" id="val-bloom">1.15</span>
              </div>
              <input type="range" class="interactive" id="slider-bloom" min="0.6" max="1.9" step="0.05" value="1.15">
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      Crafted in Pure Code &bull; WebGL + Canvas + Web Audio Synthesis
    </footer>
  </div>

  <!-- Floating Chromatic Realm Selector -->
  <nav class="realm-dock ui-layer" aria-label="Color Realms">
    <button class="realm-btn active interactive" data-realm="0">
      <span class="realm-swatch" style="background: linear-gradient(135deg, #6366f1, #ec4899);"></span>
      Celestia
    </button>
    <button class="realm-btn interactive" data-realm="1">
      <span class="realm-swatch" style="background: linear-gradient(135deg, #10b981, #06b6d4);"></span>
      Borealis
    </button>
    <button class="realm-btn interactive" data-realm="2">
      <span class="realm-swatch" style="background: linear-gradient(135deg, #f59e0b, #ef4444);"></span>
      Solaris
    </button>
    <button class="realm-btn interactive" data-realm="3">
      <span class="realm-swatch" style="background: linear-gradient(135deg, #e2e8f0, #64748b);"></span>
      Obsidian
    </button>
  </nav>

  <script>
    /* =========================================================================
       1. STATE & PALETTES
    ========================================================================= */
    const REALMS = [
      { // Celestia (Cosmic Violet, Indigo, Rose Gold)
        c1: [0.05, 0.04, 0.14],
        c2: [0.28, 0.16, 0.58],
        c3: [0.78, 0.34, 0.65],
        c4: [0.45, 0.78, 0.98],
        particleHue: 255,
        accent: '#a5b4fc',
        baseFreq: 130.81 // C3
      },
      { // Borealis (Deep Emerald, Teal, Bioluminescent Mint)
        c1: [0.02, 0.09, 0.11],
        c2: [0.04, 0.38, 0.42],
        c3: [0.12, 0.78, 0.58],
        c4: [0.62, 0.96, 0.88],
        particleHue: 168,
        accent: '#6ee7b7',
        baseFreq: 146.83 // D3
      },
      { // Solaris (Molten Amber, Crimson Silk, Champagne Gold)
        c1: [0.11, 0.03, 0.04],
        c2: [0.52, 0.11, 0.18],
        c3: [0.92, 0.42, 0.15],
        c4: [1.00, 0.85, 0.55],
        particleHue: 34,
        accent: '#fcd34d',
        baseFreq: 164.81 // E3
      },
      { // Obsidian (Liquid Mercury, Pearl, Astral Silver)
        c1: [0.03, 0.04, 0.05],
        c2: [0.16, 0.19, 0.24],
        c3: [0.48, 0.53, 0.62],
        c4: [0.92, 0.95, 1.00],
        particleHue: 215,
        accent: '#e2e8f0',
        baseFreq: 110.00 // A2
      }
    ];

    const state = {
      mouseX: window.innerWidth / 2,
      mouseY: window.innerHeight / 2,
      smoothMouseX: window.innerWidth / 2,
      smoothMouseY: window.innerHeight / 2,
      rippleX: 0.5,
      rippleY: 0.5,
      rippleStrength: 0.0,
      speed: 1.0,
      warp: 1.35,
      bloom: 1.15,
      currentRealm: 0,
      colors: JSON.parse(JSON.stringify(REALMS[0])),
      time: 0
    };

    /* =========================================================================
       2. WEBGL LIQUID NEBULA SHADER
    ========================================================================= */
    const glCanvas = document.getElementById('gl-canvas');
    const gl = glCanvas.getContext('webgl', { antialias: false, depth: false });

    const vertexShaderSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_ripple;
      uniform float u_warp;
      uniform float u_bloom;
      uniform vec3 u_c1;
      uniform vec3 u_c2;
      uniform vec3 u_c3;
      uniform vec3 u_c4;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      const mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 2.02 + vec2(100.0);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);
        vec2 m = (u_mouse - 0.5 * u_res.xy) / min(u_res.x, u_res.y);

        // Gentle mouse gravitational lensing
        vec2 diff = p - m;
        float dist = length(diff);
        p -= diff * exp(-dist * 3.2) * 0.18;

        // Interactive click shockwave ripple
        vec2 rPos = (u_ripple.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);
        float rDist = length(p - rPos);
        float wave = sin(rDist * 22.0 - u_time * 6.0) * exp(-rDist * 4.0) * u_ripple.z;
        p += normalize(p - rPos + 0.0001) * wave * 0.08;

        float t = u_time * 0.18;

        // Domain Warping (Silk Nebula)
        vec2 q = vec2(
          fbm(p * 1.4 + vec2(0.0, t * 0.6)),
          fbm(p * 1.4 + vec2(5.2, 1.3 - t * 0.5))
        );

        vec2 r = vec2(
          fbm(p * 1.6 + u_warp * q + vec2(1.7, 9.2) + 0.24 * t),
          fbm(p * 1.6 + u_warp * q + vec2(8.3, 2.8) - 0.19 * t)
        );

        float f = fbm(p * 1.3 + u_warp * r);

        // Iridescent Silk Ridges
        float silk = pow(abs(sin((f + r.x * 0.6) * 3.14159 * 1.6)), 1.4);

        vec3 col = mix(u_c1, u_c2, smoothstep(0.1, 0.75, f));
        col = mix(col, u_c3, smoothstep(0.25, 0.92, dot(q, r) * 0.85));
        col = mix(col, u_c4, pow(silk, 3.2) * 0.72);

        // Soft cursor aura glow
        float cursorGlow = exp(-dist * 3.8) * 0.22;
        col += u_c4 * cursorGlow;

        // Ripple luminescence
        col += u_c4 * abs(wave) * 1.8;

        // Tone mapping & bloom
        col *= u_bloom;
        col = col / (1.0 + col * 0.25);
        col = pow(max(col, vec3(0.0)), vec3(0.95));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    let glProgram, uniforms = {};

    function compileShader(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    }

    if (gl) {
      const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSrc);
      const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
      glProgram = gl.createProgram();
      gl.attachShader(glProgram, vs);
      gl.attachShader(glProgram, fs);
      gl.linkProgram(glProgram);
      gl.useProgram(glProgram);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
      ]), gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(glProgram, 'a_position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      ['u_res', 'u_time', 'u_mouse', 'u_ripple', 'u_warp', 'u_bloom', 'u_c1', 'u_c2', 'u_c3', 'u_c4']
        .forEach(name => uniforms[name] = gl.getUniformLocation(glProgram, name));
    }

    /* =========================================================================
       3. BIOLUMINESCENT PARTICLE & RIPPLE CANVAS
    ========================================================================= */
    const pCanvas = document.getElementById('particle-canvas');
    const ctx = pCanvas.getContext('2d');
    let particles = [];
    let shockwaves = [];

    function resizeCanvases() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Shader runs crisp & silky at 1x-1.25x DPR for 60fps butter smoothness
      const glDpr = Math.min(dpr, 1.25);
      glCanvas.width = w * glDpr;
      glCanvas.height = h * glDpr;
      if (gl) gl.viewport(0, 0, glCanvas.width, glCanvas.height);

      pCanvas.width = w * dpr;
      pCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Particle {
      constructor(x, y, burst = false) {
        this.x = x ?? Math.random() * window.innerWidth;
        this.y = y ?? Math.random() * window.innerHeight;
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? (Math.random() * 4.5 + 1.2) : (Math.random() * 0.4 + 0.1);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = burst ? (Math.random() * 2.4 + 0.8) : (Math.random() * 1.8 + 0.4);
        this.alpha = Math.random() * 0.65 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.burst = burst;
        this.life = 1.0;
      }

      update() {
        this.phase += 0.025;
        const dx = state.smoothMouseX - this.x;
        const dy = state.smoothMouseY - this.y;
        const distSq = dx * dx + dy * dy;

        if (!this.burst && distSq < 65000 && distSq > 100) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 255) * 0.035;
          // Gentle orbital swirl around cursor
          this.vx += (dx / dist) * force - (dy / dist) * force * 0.75;
          this.vy += (dy / dist) * force + (dx / dist) * force * 0.75;
        }

        if (this.burst) {
          this.vx *= 0.965;
          this.vy *= 0.965;
          this.life -= 0.014;
        } else {
          this.vx *= 0.988;
          this.vy *= 0.988;
          this.vx += Math.sin(this.phase * 0.7) * 0.008 * state.speed;
          this.vy -= 0.009 * state.speed; // Subtle upward ascension
        }

        this.x += this.vx;
        this.y += this.vy;

        if (!this.burst) {
          if (this.x < -20) this.x = window.innerWidth + 20;
          if (this.x > window.innerWidth + 20) this.x = -20;
          if (this.y < -20) this.y = window.innerHeight + 20;
          if (this.y > window.innerHeight + 20) this.y = -20;
        }
      }

      draw(hue) {
        const twinkle = 0.65 + 0.35 * Math.sin(this.phase);
        const a = Math.max(0, this.alpha * twinkle * this.life);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 85%, 82%, ${a})`;
        ctx.fill();

        if (this.radius > 1.3) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 90%, 75%, ${a * 0.16})`;
          ctx.fill();
        }
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / 14000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function triggerBurst(x, y, count = 26) {
      state.rippleX = x * Math.min(window.devicePixelRatio || 1, 1.25);
      state.rippleY = (window.innerHeight - y) * Math.min(window.devicePixelRatio || 1, 1.25);
      state.rippleStrength = 1.0;

      shockwaves.push({ x, y, r: 4, alpha: 0.65 });
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, true));
      }
    }

    resizeCanvases();
    initParticles();
    window.addEventListener('resize', () => {
      resizeCanvases();
      initParticles();
    });

    /* =========================================================================
       4. GENERATIVE WEB AUDIO AMBIENT SYNTHESIZER
    ========================================================================= */
    class AmbientSynth {
      constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.reverbNode = null;
        this.droneOscs = [];
        // Lydian pentatonic intervals (dreamy, transcendent)
        this.ratios = [1, 9/8, 5/4, 45/32, 3/2, 27/16, 15/8, 2];
      }

      init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.0001;
        this.masterGain.connect(this.ctx.destination);

        // Algorithmic Stereo Cathedral Impulse Response
        const rate = this.ctx.sampleRate;
        const length = rate * 3.8;
        const impulse = this.ctx.createBuffer(2, length, rate);
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch);
          for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6);
          }
        }
        this.reverbNode = this.ctx.createConvolver();
        this.reverbNode.buffer = impulse;
        this.reverbNode.connect(this.masterGain);

        // Warm Evolving Pad Drone
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 340;
        filter.connect(this.reverbNode);

        // Slow LFO breathing on filter
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.09;
        lfoGain.gain.value = 140;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        const base = REALMS[state.currentRealm].baseFreq;
        [1, 1.5, 2, 2.5].forEach((mult, idx) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = base * mult;
          osc.detune.value = (idx - 1.5) * 6;
          g.gain.value = idx === 0 ? 0.14 : 0.055;
          osc.connect(g);
          g.connect(filter);
          osc.start();
          this.droneOscs.push({ osc, mult });
        });
      }

      toggle() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        this.isPlaying = !this.isPlaying;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);

        if (this.isPlaying) {
          this.masterGain.gain.linearRampToValueAtTime(0.45, now + 1.6);
          this.playChime(0.6);
        } else {
          this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        }
        return this.isPlaying;
      }

      retune(baseFreq) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.droneOscs.forEach(({ osc, mult }) => {
          osc.frequency.exponentialRampToValueAtTime(baseFreq * mult, now + 1.4);
        });
      }

      playChime(normY = Math.random()) {
        if (!this.ctx || !this.isPlaying) return;
        const now = this.ctx.currentTime;
        const base = REALMS[state.currentRealm].baseFreq * 2;
        const idx = Math.floor((1 - Math.min(Math.max(normY, 0), 0.99)) * this.ratios.length);
        const freq = base * this.ratios[idx];

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const env = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2.0, now);

        const overtoneGain = this.ctx.createGain();
        overtoneGain.gain.value = 0.15;

        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(0.16, now + 0.03);
        env.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(env);
        overtone.connect(overtoneGain);
        overtoneGain.connect(env);
        env.connect(this.reverbNode);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + 3.3);
        overtone.stop(now + 3.3);
      }

      playChord(chordIndex = 0) {
        if (!this.ctx || !this.isPlaying) return;
        const offsets = [
          [0, 2, 4, 6],
          [1, 3, 4, 7],
          [0, 2, 5, 7]
        ][chordIndex % 3];
        offsets.forEach((step, i) => {
          setTimeout(() => {
            this.playChime(1 - step / this.ratios.length);
          }, i * 110);
        });
      }
    }

    const synth = new AmbientSynth();

    /* =========================================================================
       5. INTERACTIONS, CURSOR & UI EVENTS
    ========================================================================= */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;

    window.addEventListener('pointermove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    window.addEventListener('pointerdown', (e) => {
      // Avoid burst sound clash if clicking slider thumb
      if (e.target.tagName === 'INPUT') return;
      triggerBurst(e.clientX, e.clientY, 24);
      synth.playChime(e.clientY / window.innerHeight);
    });

    // Hover states for custom magnetic ring
    document.querySelectorAll('.interactive').forEach(el => {
      el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
    });

    // 3D Tilt & Specular Spotlight on Glass Cards
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });

      card.addEventListener('click', (e) => {
        const chordIdx = Number(card.dataset.chord || 0);
        triggerBurst(e.clientX, e.clientY, 42);
        synth.playChord(chordIdx);
      });
    });

    // Audio Controls
    const audioBtn = document.getElementById('audio-btn');
    const audioLabel = document.getElementById('audio-label');
    const awakenBtn = document.getElementById('awaken-btn');

    function updateAudioUI(playing) {
      audioBtn.classList.toggle('playing', playing);
      audioBtn.classList.toggle('active', playing);
      audioLabel.textContent = playing ? 'Sound On' : 'Sound Off';
      awakenBtn.textContent = playing ? 'Pulse Light' : 'Awaken Symphony';
    }

    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const playing = synth.toggle();
      updateAudioUI(playing);
    });

    awakenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!synth.isPlaying) {
        const playing = synth.toggle();
        updateAudioUI(playing);
      } else {
        synth.playChord(0);
      }
      triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 55);
    });

    // Zen Mode Toggle
    const zenBtn = document.getElementById('zen-btn');
    const zenExitBtn = document.getElementById('zen-exit-btn');

    zenBtn.addEventListener('click', () => document.body.classList.add('zen-mode'));
    zenExitBtn.addEventListener('click', () => document.body.classList.remove('zen-mode'));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.body.classList.remove('zen-mode');
    });

    // Realm Switching
    const realmBtns = document.querySelectorAll('.realm-btn');
    realmBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        realmBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const idx = Number(btn.dataset.realm);
        state.currentRealm = idx;
        document.documentElement.style.setProperty('--accent', REALMS[idx].accent);
        synth.retune(REALMS[idx].baseFreq);
        synth.playChord(idx);
        triggerBurst(e.clientX, e.clientY, 32);
      });
    });

    // Sculptor Sliders
    const bindSlider = (id, valId, prop, suffix = '') => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(valId);
      el.addEventListener('input', () => {
        state[prop] = parseFloat(el.value);
        valEl.textContent = Number(el.value).toFixed(2).replace(/\.00$/, '.0') + suffix;
      });
    };
    bindSlider('slider-speed', 'val-speed', 'speed', 'x');
    bindSlider('slider-warp', 'val-warp', 'warp');
    bindSlider('slider-bloom', 'val-bloom', 'bloom');

    /* =========================================================================
       6. MASTER ANIMATION LOOP
    ========================================================================= */
    let lastTime = performance.now();

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      state.time += dt * state.speed;

      // Smooth cursor & ring interpolation
      state.smoothMouseX = lerp(state.smoothMouseX, state.mouseX, 0.06);
      state.smoothMouseY = lerp(state.smoothMouseY, state.mouseY, 0.06);

      ringX = lerp(ringX, state.mouseX, 0.18);
      ringY = lerp(ringY, state.mouseY, 0.18);
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      // Decay ripple shockwave
      state.rippleStrength = Math.max(0, state.rippleStrength - dt * 0.85);

      // Smoothly interpolate color realm palettes
      const target = REALMS[state.currentRealm];
      ['c1', 'c2', 'c3', 'c4'].forEach(key => {
        for (let i = 0; i < 3; i++) {
          state.colors[key][i] = lerp(state.colors[key][i], target[key][i], 0.035);
        }
      });
      state.colors.particleHue = lerp(state.colors.particleHue, target.particleHue, 0.04);

      // 1. Render WebGL Shader
      if (gl) {
        const glDpr = Math.min(window.devicePixelRatio || 1, 1.25);
        gl.uniform2f(uniforms.u_res, glCanvas.width, glCanvas.height);
        gl.uniform1f(uniforms.u_time, state.time);
        gl.uniform2f(
          uniforms.u_mouse,
          state.smoothMouseX * glDpr,
          (window.innerHeight - state.smoothMouseY) * glDpr
        );
        gl.uniform3f(uniforms.u_ripple, state.rippleX, state.rippleY, state.rippleStrength);
        gl.uniform1f(uniforms.u_warp, state.warp);
        gl.uniform1f(uniforms.u_bloom, state.bloom);
        gl.uniform3fv(uniforms.u_c1, state.colors.c1);
        gl.uniform3fv(uniforms.u_c2, state.colors.c2);
        gl.uniform3fv(uniforms.u_c3, state.colors.c3);
        gl.uniform3fv(uniforms.u_c4, state.colors.c4);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 2. Render Foreground Particles & Expanding Rings
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += 3.6;
        sw.alpha *= 0.955;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${state.colors.particleHue}, 90%, 82%, ${sw.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (sw.alpha < 0.01) shockwaves.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(state.colors.particleHue);
        if (p.burst && p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Subtle constellation threads near cursor
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const dMouse = Math.hypot(p1.x - state.smoothMouseX, p1.y - state.smoothMouseY);
        if (dMouse < 150) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 85) {
              const lineAlpha = (1 - dist / 85) * (1 - dMouse / 150) * 0.28 * p1.life * p2.life;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${state.colors.particleHue}, 80%, 85%, ${lineAlpha})`;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  </script>
</body>
</html>
```
