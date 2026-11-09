---
slug: "2026-11-09-muse-ember-aether-one-shot"
title: "One-Shot: Muse Ember Builds a Living Universe for a Penny"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-11-09"
excerpt: "Meta's new Muse Ember landed on OpenRouter today. One prompt, no edits: 'create the most beautiful and stunning single HTML file you can possibly imagine.' It shipped AETHER, an interactive star field with a live clock and a custom cursor, in 33 seconds, for one cent."
categories: ["AI", "LLMs", "Creative Coding"]
tags: ["one-shot", "muse-ember", "meta", "openrouter", "canvas"]
readTime: 6
image: "/images/blog/2026-11-09-muse-ember-aether-one-shot.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-09-muse-ember-aether-one-shot"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

The demo is live at [**/demos/muse-ember-aether**](https://www.smfclearinghouse.com/demos/muse-ember-aether). It is animated and it reacts to you: move to stir the stars, click to ignite, hold to bend time. There's a live clock in the corner and a custom ring cursor.

## The ask

Same prompt every page in this series gets, verbatim, 81 bytes with a trailing newline:

> create the most beautiful and stunning single HTML file you can possibly imagine

One shot. No edits, no taste pass, no retry. What came back is what shipped.

## The receipt

| Field | Value |
|---|---|
| Request id | `gen-1794262646-zcX56ETTNAOtVKB299nO` |
| HTTP | 200 (streamed) |
| Finish | stop |
| Wall clock | 32.5 s |
| Prompt / completion / total tokens | 22 / 19,312 / 19,334 |
| Reasoning tokens | 11,528 (945 streamed reasoning chars) |
| HTML bytes (extracted fence) | 23,162 |
| Cost | $0.0097 (`usage.cost`) |
| `node --check` on the inline script | pass |

Thirty-two seconds and under a penny. For comparison, Claude Fable 5.2 took 12.6 minutes and $3.01 on the same prompt this morning. Muse Ember is Meta's smallest, cheapest reasoning model, priced at $0.10/$0.50 per 1M tokens, and the page it built holds up.

## The page

The page calls itself AETHER, "Where Light Learns to Breathe": a deep-space hero screen with layered nebula gradients, a starfield, an italic-serif tagline, an "ENTER THE COSMOS" pill button, and a live HUD showing the time and your coordinates. The footer quotes Oscar Wilde: "We are all in the gutter, but some of us are looking at the stars." All Canvas, no WebGL, no images.

The runtime gate (Playwright Chromium, 1440×900, 5 s after load) recorded one console error: a favicon 404 from the test server. That's the server, not the page. Zero page errors. The interactions listed in the body text have handlers in the shipped script.

## One honest wrinkle

Muse Ember's reasoning is mandatory — there is no off switch. Its catalog default effort is **max**; I sent the default for this one-shot (the series rule is to name nothing unless told). It thought for 11,528 tokens before writing. On our Cold Iron run, where the standard is thinking-off, I'll use the lowest effort that lands content, labeled as the analogue.

## The fence

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AETHER — Where Light Learns to Breathe</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Italiana&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--accent:#7b61ff;--accent2:#0fffc3}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden;background:#030014;color:#fff;font-family:'Inter',sans-serif}
body{cursor:none}
button,input{cursor:none;font-family:inherit}
::selection{background:var(--accent);color:#fff}
canvas{position:fixed;inset:0;width:100%;height:100%;display:block;z-index:1}
.vignette{position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.6) 100%);z-index:2}
.frame{position:fixed;inset:18px;border:1px solid rgba(255,255,255,.09);pointer-events:none;z-index:4}
.grain{position:fixed;inset:-50%;width:200%;height:200%;pointer-events:none;opacity:.05;z-index:3;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E");animation:grain 8s steps(10) infinite}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(3%,-15%)}50%{transform:translate(8%,4%)}70%{transform:translate(-9%,6%)}90%{transform:translate(4%,9%)}}
.cursor{position:fixed;top:0;left:0;width:38px;height:38px;border:1px solid rgba(255,255,255,.65);border-radius:50%;pointer-events:none;z-index:100;mix-blend-mode:difference;transition:width .3s,height .3s,background .3s}
.cursor-dot{position:fixed;top:0;left:0;width:5px;height:5px;background:#fff;border-radius:50%;pointer-events:none;z-index:100;mix-blend-mode:difference}
.cursor.hovered{width:64px;height:64px;background:rgba(255,255,255,.12)}
.cursor.down{width:22px;height:22px;background:rgba(255,255,255,.35)}
@media(hover:none){body,button,input{cursor:auto}.cursor,.cursor-dot{display:none}}
#intro{position:fixed;inset:0;background:#030014;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;pointer-events:none;animation:introOut 1s ease 2.3s forwards}
@keyframes introOut{to{opacity:0;visibility:hidden}}
.intro-logo{font-family:'Italiana',serif;font-size:34px;letter-spacing:.65em;text-indent:.65em;animation:pulse 2s ease infinite}
.intro-line{width:130px;height:1px;background:linear-gradient(90deg,transparent,var(--accent2),var(--accent),transparent);animation:lineGrow 2s ease forwards;transform-origin:center}
@keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.intro-sub{font-size:9px;letter-spacing:.5em;text-indent:.5em;opacity:.55}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
.nav{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:30px 40px;z-index:10;opacity:0;animation:fadeUp 1s ease 2.4s forwards;transition:opacity .6s}
.logo{font-family:'Italiana',serif;font-size:20px;letter-spacing:.5em}
.nav-right{font-size:11px;letter-spacing:.22em;opacity:.65;font-weight:300}
.nav-right .sep{margin:0 10px;opacity:.4}
.mini-title{position:fixed;top:32px;left:50%;transform:translate(-50%,-16px);font-family:'Italiana',serif;font-size:14px;letter-spacing:.55em;text-indent:.55em;opacity:0;transition:.9s cubic-bezier(.22,1,.36,1);z-index:10;pointer-events:none}
body.entered .mini-title{opacity:.9;transform:translate(-50%,0)}
.hero{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:5;pointer-events:none;padding:24px;transition:opacity .9s,transform .9s;will-change:transform}
body.entered .hero{opacity:0;transform:scale(.96) translateY(-24px)!important;pointer-events:none}
.eyebrow{display:flex;align-items:center;gap:18px;font-size:11px;letter-spacing:.55em;text-indent:.55em;text-transform:uppercase;opacity:0;animation:fadeUp 1s ease 1s forwards}
.eyebrow::before,.eyebrow::after{content:'';width:44px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6))}
.eyebrow::after{background:linear-gradient(90deg,rgba(255,255,255,.6),transparent)}
h1{font-family:'Italiana',serif;font-weight:400;font-size:clamp(68px,14vw,160px);line-height:.9;letter-spacing:.16em;margin-top:22px}
.letter{display:inline-block;opacity:0;animation:letterIn 1.5s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d);background:linear-gradient(120deg,#fff 15%,var(--accent) 55%,var(--accent2) 95%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 28px rgba(123,97,255,.35))}
@keyframes letterIn{from{opacity:0;transform:translateY(56px) rotate(5deg);filter:blur(12px)}to{opacity:1;transform:translateY(0) rotate(0);filter:blur(0)}}
.tagline{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;font-size:clamp(20px,2.6vw,28px);letter-spacing:.06em;opacity:0;animation:fadeUp 1s ease 1.5s forwards;margin-top:20px;color:rgba(255,255,255,.88)}
.enter{margin-top:44px;pointer-events:auto;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.32);color:#fff;padding:16px 42px;border-radius:999px;font-size:11px;letter-spacing:.38em;text-indent:.38em;text-transform:uppercase;backdrop-filter:blur(12px);opacity:0;animation:fadeUp 1s ease 1.8s forwards;transition:.45s;box-shadow:0 0 0 rgba(255,255,255,0)}
.enter:hover{background:#fff;color:#050510;box-shadow:0 0 44px rgba(255,255,255,.35);transform:translateY(-2px)}
.hint{margin-top:24px;font-size:9px;letter-spacing:.32em;text-indent:.32em;text-transform:uppercase;opacity:0;animation:fadeUp 1s ease 2.1s forwards;color:rgba(255,255,255,.45)}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.side-text{position:fixed;left:34px;top:50%;transform:rotate(-90deg) translateX(50%);transform-origin:left center;font-size:9px;letter-spacing:.45em;opacity:.35;z-index:6;pointer-events:none;white-space:nowrap}
.quotes{position:fixed;left:40px;bottom:40px;z-index:6;max-width:330px;opacity:0;transform:translateY(10px);transition:1s;pointer-events:none}
body.entered .quotes{opacity:1;transform:translateY(0)}
.quotes p{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;line-height:1.5;font-weight:300;transition:opacity .6s}
.quotes small{display:block;margin-top:10px;font-size:10px;letter-spacing:.3em;text-transform:uppercase;opacity:.5;transition:opacity .6s}
.controls{position:fixed;bottom:26px;left:50%;transform:translate(-50%,24px);opacity:0;pointer-events:none;transition:.9s cubic-bezier(.22,1,.36,1) .15s;z-index:10;display:flex;align-items:center;gap:18px;flex-wrap:wrap;justify-content:center;max-width:94vw;background:rgba(10,10,30,.38);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border:1px solid rgba(255,255,255,.13);border-radius:999px;padding:12px 22px;box-shadow:0 24px 70px rgba(0,0,0,.55)}
body.entered .controls{opacity:1;transform:translate(-50%,0);pointer-events:auto}
.palette-group{display:flex;gap:9px}
.dot{width:24px;height:24px;border-radius:50%;border:2px solid rgba(255,255,255,.25);transition:.3s;padding:0}
.dot:hover{transform:scale(1.22)}
.dot.active{border-color:#fff;transform:scale(1.22);box-shadow:0 0 18px rgba(255,255,255,.45)}
.divider{width:1px;height:26px;background:rgba(255,255,255,.16)}
.control-group{display:flex;align-items:center;gap:9px}
.control-group label{font-size:9px;letter-spacing:.25em;text-transform:uppercase;opacity:.6}
input[type=range]{-webkit-appearance:none;appearance:none;width:72px;height:2px;background:rgba(255,255,255,.28);border-radius:2px;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:#fff;box-shadow:0 0 12px rgba(255,255,255,.9)}
input[type=range]::-moz-range-thumb{width:13px;height:13px;border:none;border-radius:50%;background:#fff;box-shadow:0 0 12px rgba(255,255,255,.9)}
.icon-btn{width:37px;height:37px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:#fff;font-size:15px;display:grid;place-items:center;transition:.3s}
.icon-btn:hover{background:rgba(255,255,255,.16);transform:translateY(-1px)}
.icon-btn.on{background:#fff;color:#000}
body.ui-hidden .nav,body.ui-hidden .controls,body.ui-hidden .quotes,body.ui-hidden .mini-title,body.ui-hidden .side-text{opacity:0!important;pointer-events:none!important}
@media(max-width:820px){.quotes,.side-text{display:none}.nav{padding:22px}.frame{inset:10px}input[type=range]{width:52px}.controls{gap:12px;padding:10px 16px}.control-group label{display:none}}
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<div class="vignette"></div>
<div class="frame"></div>
<div class="grain"></div>
<div class="cursor" id="cursor"></div>
<div class="cursor-dot" id="cursorDot"></div>

<div id="intro"><div class="intro-logo">AETHER</div><div class="intro-line"></div><div class="intro-sub">WHERE LIGHT LEARNS TO BREATHE</div></div>

<header class="nav"><div class="logo">AETHER</div><div class="nav-right"><span id="clock">00:00:00</span><span class="sep">·</span><span id="coords">0.00° , 0.00°</span></div></header>
<div class="mini-title">AETHER</div>
<div class="side-text">DEEP FIELD SURVEY — 042 &nbsp;·&nbsp; EST. MMXXVI</div>

<section class="hero" id="hero">
  <div class="eyebrow">A Living Universe</div>
  <h1><span class="letter" style="--d:.15s">A</span><span class="letter" style="--d:.25s">E</span><span class="letter" style="--d:.35s">T</span><span class="letter" style="--d:.45s">H</span><span class="letter" style="--d:.55s">E</span><span class="letter" style="--d:.65s">R</span></h1>
  <p class="tagline">Where light learns to breathe</p>
  <button class="enter" id="enterBtn">Enter the Cosmos</button>
  <p class="hint">Move to stir the stars &nbsp;·&nbsp; Click to ignite &nbsp;·&nbsp; Hold to bend time</p>
</section>

<div class="quotes"><p id="quoteText">“We are all in the gutter, but some of us are looking at the stars.”</p><small id="quoteAuthor">— Oscar Wilde</small></div>

<div class="controls" id="controls">
  <div class="palette-group" id="paletteGroup"></div>
  <div class="divider"></div>
  <div class="control-group"><label>Flow</label><input type="range" id="flowRange" min="0" max="100" value="50"></div>
  <div class="control-group"><label>Drift</label><input type="range" id="speedRange" min="0" max="100" value="50"></div>
  <div class="control-group"><label>Stars</label><input type="range" id="densityRange" min="20" max="200" value="100"></div>
  <div class="divider"></div>
  <button class="icon-btn" id="soundBtn" title="Ambient sound">♪</button>
  <button class="icon-btn" id="fullBtn" title="Fullscreen">⛶</button>
  <button class="icon-btn" id="hideBtn" title="Hide interface (H)">◐</button>
</div>

<script>
const PALETTES=[
 {name:'Aurora',colors:['#0fffc3','#7b61ff','#ff6ec7','#00c6ff','#a8ff78'],bg:['#030014','#0a0a2e'],accent:'#7b61ff',accent2:'#0fffc3'},
 {name:'Sunset',colors:['#ffd166','#ff9a56','#ff5e7a','#ff2e63','#c86bff'],bg:['#140020','#2d0a1e'],accent:'#ff5e7a',accent2:'#ffd166'},
 {name:'Ocean',colors:['#00f5d4','#00bbf9','#9b5de5','#f15bb5','#fee440'],bg:['#001219','#003049'],accent:'#00bbf9',accent2:'#00f5d4'},
 {name:'Gold',colors:['#ffe29a','#ffb347','#ffcc33','#fff3b0','#d4af37'],bg:['#0d0b06','#1a1405'],accent:'#d4af37',accent2:'#ffe29a'},
 {name:'Violet',colors:['#c77dff','#9d4edd','#ff6ec7','#7209b7','#4cc9f0'],bg:['#10002b','#240046'],accent:'#9d4edd',accent2:'#ff6ec7'}
];
function hexToRgb(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
let paletteIndex=0;
let current=PALETTES[0].colors.map(hexToRgb);
let target=PALETTES[0].colors.map(hexToRgb);

const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const cursor=document.getElementById('cursor'),cursorDot=document.getElementById('cursorDot');
const hero=document.getElementById('hero');
let W,H,DPR,bgGrad;
let stars=[],particles=[],bursts=[];
let flowVal=1,speedVal=1,density=100;
let mouse={x:innerWidth/2,y:innerHeight/2,tx:innerWidth/2,ty:innerHeight/2,down:false};

function makeBg(){bgGrad=ctx.createLinearGradient(0,0,0,H);bgGrad.addColorStop(0,PALETTES[paletteIndex].bg[0]);bgGrad.addColorStop(1,PALETTES[paletteIndex].bg[1])}
function initStars(){stars=[];const n=Math.floor(W*H/7500);for(let i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,p:Math.random()*Math.PI*2,s:.5+Math.random()})}
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0);makeBg();initStars();if(!mouse.tx){mouse.x=mouse.tx=W/2;mouse.y=mouse.ty=H/2}}
function targetCount(){return Math.max(180,Math.min(2600,Math.floor(W*H/1300*(density/100))))}
function flowAngle(x,y,t){return (Math.sin(x*.0016+t*.00035)+Math.cos(y*.0019-t*.00028)+Math.sin((x+y)*.0007+t*.00045))*1.2}

class Particle{
 constructor(){this.reset()}
 reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.px=this.x;this.py=this.y;this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.4;this.size=Math.random()*1.5+.4;this.ci=Math.floor(Math.random()*5);this.life=300+Math.random()*500;this.age=0}
 update(t){
  this.px=this.x;this.py=this.y;
  const ang=flowAngle(this.x,this.y,t),f=.028*flowVal;
  this.vx+=Math.cos(ang)*f;this.vy+=Math.sin(ang)*f;
  const dx=this.x-mouse.x,dy=this.y-mouse.y,dist=Math.hypot(dx,dy)||1,R=175;
  if(dist<R){const force=(R-dist)/R;
   if(mouse.down){this.vx+=(-dx/dist)*force*.55+(-dy/dist)*force*.95;this.vy+=(-dy/dist)*force*.55+(dx/dist)*force*.95}
   else{this.vx+=(dx/dist)*force*.7;this.vy+=(dy/dist)*force*.7}
  }
  this.vx+=speedVal*.002;this.vy+=speedVal*.0015;this.vx*=.92;this.vy*=.92;
  const sp=Math.hypot(this.vx,this.vy);if(sp>2.4){this.vx=this.vx/sp*2.4;this.vy=this.vy/sp*2.4}
  this.x+=this.vx;this.y+=this.vy;this.age++;
  if(this.age>this.life||this.x<-20||this.x>W+20||this.y<-20||this.y>H+20)this.reset();
 }
 draw(){
  const col=current[this.ci%current.length],sp=Math.hypot(this.vx,this.vy),a=Math.min(.14+sp*.36,.85);
  ctx.strokeStyle=`rgba(${col[0]|0},${col[1]|0},${col[2]|0},${a})`;ctx.lineWidth=this.size;
  ctx.beginPath();ctx.moveTo(this.px,this.py);ctx.lineTo(this.x,this.y);ctx.stroke();
  if(this.size>1.35){ctx.fillStyle=`rgba(255,255,255,${a*.35})`;ctx.beginPath();ctx.arc(this.x,this.y,this.size*.7,0,Math.PI*2);ctx.fill()}
 }
}
function initParticles(){particles=[];for(let i=0;i<targetCount();i++)particles.push(new Particle())}
function burst(x,y,count=90){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=Math.random()*6+1;bursts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:.008+Math.random()*.013,size:Math.random()*2+.5,ci:Math.floor(Math.random()*5)})}}

function drawAurora(t){
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(let i=0;i<3;i++){
  const ox=W*(.3+.4*Math.sin(t*.00013+i*2.1))+Math.cos(t*.00007+i)*W*.15,oy=H*(.35+.25*Math.cos(t*.00011+i*1.7)),r=Math.max(W,H)*.46,col=current[i%current.length];
  const g=ctx.createRadialGradient(ox,oy,0,ox,oy,r);g.addColorStop(0,`rgba(${col[0]|0},${col[1]|0},${col[2]|0},.15)`);g.addColorStop(1,`rgba(${col[0]|0},${col[1]|0},${col[2]|0},0)`);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(ox,oy,r,0,Math.PI*2);ctx.fill();
 }
 for(let i=0;i<3;i++){
  const col=current[(i+1)%current.length],baseY=H*(.28+i*.18);
  const grad=ctx.createLinearGradient(0,baseY-130,0,baseY+190);
  grad.addColorStop(0,`rgba(${col[0]|0},${col[1]|0},${col[2]|0},0)`);grad.addColorStop(.5,`rgba(${col[0]|0},${col[1]|0},${col[2]|0},.11)`);grad.addColorStop(1,`rgba(${col[0]|0},${col[1]|0},${col[2]|0},0)`);
  ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(-50,baseY);
  for(let x=-50;x<=W+50;x+=24){const y=baseY+Math.sin(x*.004+t*.0004+i*1.3)*70+Math.cos(x*.0018-t*.0003+i)*46+Math.sin(x*.009+t*.0007)*18;ctx.lineTo(x,y)}
  for(let x=W+50;x>=-50;x-=24){const y=baseY+165+Math.sin(x*.004+t*.0004+i*1.3)*70+Math.cos(x*.0018-t*.0003+i)*46;ctx.lineTo(x,y)}
  ctx.closePath();ctx.fill();
 }
 ctx.restore();
}

function animate(t){
 requestAnimationFrame(animate);
 for(let i=0;i<current.length;i++)for(let c=0;c<3;c++)current[i][c]+=(target[i][c]-current[i][c])*.03;
 mouse.x+=(mouse.tx-mouse.x)*.09;mouse.y+=(mouse.ty-mouse.y)*.09;
 cursor.style.transform=`translate(${mouse.x}px,${mouse.y}px) translate(-50%,-50%)`;
 cursorDot.style.transform=`translate(${mouse.tx}px,${mouse.ty}px) translate(-50%,-50%)`;
 ctx.fillStyle=bgGrad;ctx.fillRect(0,0,W,H);
 drawAurora(t);
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(const s of stars){ctx.globalAlpha=.25+.55*Math.abs(Math.sin(t*.001*s.s+s.p));ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}
 ctx.restore();ctx.globalAlpha=1;
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
 for(const p of particles){p.update(t);p.draw()}
 for(let i=bursts.length-1;i>=0;i--){const b=bursts[i];b.x+=b.vx;b.y+=b.vy;b.vx*=.965;b.vy*=.965;b.vy+=.015;b.life-=b.decay;if(b.life<=0){bursts.splice(i,1);continue}const col=current[b.ci%current.length];ctx.globalAlpha=b.life;ctx.fillStyle=`rgba(${col[0]|0},${col[1]|0},${col[2]|0},1)`;ctx.beginPath();ctx.arc(b.x,b.y,b.size*b.life+.3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=b.life*.22;ctx.beginPath();ctx.arc(b.x,b.y,b.size*4,0,Math.PI*2);ctx.fill()}
 ctx.restore();ctx.globalAlpha=1;
 if(!document.body.classList.contains('entered')){const dx=(mouse.tx-W/2)/W,dy=(mouse.ty-H/2)/H;hero.style.transform=`translate(${dx*-18}px,${dy*-12}px)`}
}

// Palette UI
const paletteGroup=document.getElementById('paletteGroup');
PALETTES.forEach((p,i)=>{const b=document.createElement('button');b.className='dot'+(i===0?' active':'');b.title=p.name;b.setAttribute('aria-label',p.name);b.style.background=`linear-gradient(135deg,${p.colors[0]},${p.colors[1]},${p.colors[2]})`;b.onclick=()=>setPalette(i);paletteGroup.appendChild(b)});
function setPalette(i){paletteIndex=i;target=PALETTES[i].colors.map(hexToRgb);document.querySelectorAll('.dot').forEach((d,idx)=>d.classList.toggle('active',idx===i));document.documentElement.style.setProperty('--accent',PALETTES[i].accent);document.documentElement.style.setProperty('--accent2',PALETTES[i].accent2);makeBg();burst(mouse.x,mouse.y,45)}

// Controls
document.getElementById('flowRange').oninput=e=>flowVal=.2+(e.target.value/100)*2.3;
document.getElementById('speedRange').oninput=e=>speedVal=.2+(e.target.value/100)*2;
document.getElementById('densityRange').oninput=e=>{density=+e.target.value;const tc=targetCount();while(particles.length<tc)particles.push(new Particle());while(particles.length>tc)particles.pop()};
document.getElementById('enterBtn').onclick=()=>{document.body.classList.add('entered');burst(W/2,H/2,170);burst(mouse.x,mouse.y,60);setTimeout(()=>burst(W*.3,H*.4,60),220);setTimeout(()=>burst(W*.7,H*.6,60),420)};
document.getElementById('hideBtn').onclick=()=>document.body.classList.toggle('ui-hidden');
document.getElementById('fullBtn').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{});else document.exitFullscreen()};

// Ambient sound
let audioCtx=null,master=null,soundOn=false,chordInt=null,chordIdx=0;
const CHORDS=[[110,165,220,262],[87.3,130.8,174.6,220],[98,146.8,196,246.9],[110,130.8,164.8,220]];
function playChord(){if(!audioCtx||!soundOn)return;const freqs=CHORDS[chordIdx++%CHORDS.length],now=audioCtx.currentTime;freqs.forEach((f,i)=>{const o=audioCtx.createOscillator();o.type=i<2?'sine':'triangle';o.frequency.value=f;o.detune.value=(Math.random()-.5)*8;const g=audioCtx.createGain();g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(.05/(i+1),now+1.6);g.gain.linearRampToValueAtTime(0,now+7);const flt=audioCtx.createBiquadFilter();flt.type='lowpass';flt.frequency.value=900;o.connect(flt);flt.connect(g);g.connect(master);o.start(now);o.stop(now+7.6)})}
document.getElementById('soundBtn').onclick=function(){if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=.9;master.connect(audioCtx.destination)}if(audioCtx.state==='suspended')audioCtx.resume();soundOn=!soundOn;this.classList.toggle('on',soundOn);if(soundOn){playChord();chordInt=setInterval(playChord,6500)}else clearInterval(chordInt)};

// Quotes & clock
const QUOTES=[{t:"We are all in the gutter, but some of us are looking at the stars.",a:"Oscar Wilde"},{t:"The cosmos is within us. We are made of star-stuff.",a:"Carl Sagan"},{t:"Somewhere, something incredible is waiting to be known.",a:"Sharon Begley"},{t:"Look up at the stars and not down at your feet.",a:"Stephen Hawking"},{t:"Imagination will often carry us to worlds that never were.",a:"Carl Sagan"}];
let qi=0;const qT=document.getElementById('quoteText'),qA=document.getElementById('quoteAuthor');
setInterval(()=>{qT.style.opacity=0;qA.style.opacity=0;setTimeout(()=>{qi=(qi+1)%QUOTES.length;qT.textContent='“'+QUOTES[qi].t+'”';qA.textContent='— '+QUOTES[qi].a;qT.style.opacity=1;qA.style.opacity=1},600)},6000);
const clockEl=document.getElementById('clock'),coordsEl=document.getElementById('coords');
setInterval(()=>{clockEl.textContent=new Date().toLocaleTimeString('en-GB');coordsEl.textContent=(mouse.tx/W*180-90).toFixed(2)+'° , '+(mouse.ty/H*90-45).toFixed(2)+'°'},500);

// Interaction
addEventListener('mousemove',e=>{mouse.tx=e.clientX;mouse.ty=e.clientY});
addEventListener('mousedown',e=>{mouse.down=true;cursor.classList.add('down');if(!e.target.closest('button,input'))burst(e.clientX,e.clientY,28)});
addEventListener('mouseup',()=>{mouse.down=false;cursor.classList.remove('down')});
addEventListener('touchstart',e=>{mouse.tx=e.touches[0].clientX;mouse.ty=e.touches[0].clientY;burst(mouse.tx,mouse.ty,30)},{passive:true});
addEventListener('touchmove',e=>{mouse.tx=e.touches[0].clientX;mouse.ty=e.touches[0].clientY},{passive:true});
addEventListener('touchend',()=>mouse.down=false);
addEventListener('touchstart',()=>mouse.down=true);
document.addEventListener('mouseover',e=>cursor.classList.toggle('hovered',!!e.target.closest('button,input,.dot')));
addEventListener('dblclick',e=>{if(!e.target.closest('button,input'))document.body.classList.toggle('ui-hidden')});
addEventListener('keydown',e=>{if(e.key==='h'||e.key==='H')document.body.classList.toggle('ui-hidden');if(e.key>='1'&&e.key<='5')setPalette(+e.key-1);if(e.key===' '){e.preventDefault();burst(W/2,H/2,130)}if(e.key==='f'||e.key==='F')document.getElementById('fullBtn').click()});
addEventListener('resize',()=>{resize()});

resize();initParticles();requestAnimationFrame(animate);
setTimeout(()=>burst(W/2,H*.45,130),2500);
</script>
</body>
</html>
```

## Verification notes

- Request/response: `~/workspace/muse-ember-tests/01-most-beautiful-html/` (prompt.txt byte-identical to the series file, `cmp` clean; meta.json holds the receipt).
- Screenshot: Playwright Chromium 1243 against a local HTTP server, 1440×900, 5 s after load. Runtime gate JSON: 1 console error (favicon 404), 0 page errors.
- Catalog facts (1M context, $0.10/$0.50 per 1M, reasoning mandatory with efforts max through minimal and default max): OpenRouter `/v1/models`, 2026-11-09.
- The Fable 5.2 comparison numbers come from its same-day receipt: gen-1794255412-KA6uGmj65XYEGQZQOOn4, 75,166 total tokens, 32.5 s vs 753.3 s.
