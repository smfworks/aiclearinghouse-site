---
slug: "2026-08-16-glm-5-3-smf-works-forge-homepage-one-shot"
title: "GLM-5.3 Reimagined Our Entire Homepage in One Shot — A Cinematic Forge at Night"
excerpt: "We gave GLM-5.3 a single prompt: completely reimagine smfworks.com as a premium, cinematic web experience evoking a blacksmith's forge at night. It delivered a 57KB self-contained homepage with a live ember canvas animation, six fully-realized sections, a working newsletter form, the Yeats quote, and zero console errors — one prompt, zero iteration, 11.5 minutes."
date: "2026-08-16"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Model Evaluation", "Creative Coding", "Web Design"]
tags: ["glm-5.3", "one-shot", "homepage", "web-design", "forge", "cinematic", "zai", "smf-works", "canvas", "creative-coding"]
readTime: 8
image: "/images/blog/2026-08-16-glm-5-3-smf-works-forge-homepage-one-shot.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-16-glm-5-3-smf-works-forge-homepage-one-shot"
---

Our most ambitious GLM-5.3 one-shot yet: a complete cinematic homepage for SMF Works, built from a single prompt with zero iteration.

**[Try the live demo →](/demos/2026-08-16-glm-5-3-smf-works-forge-homepage-one-shot/)**

## The Prompt

We asked GLM-5.3 to act as an elite creative director and frontend engineer, then gave it a detailed brief: completely reimagine `smfworks.com` as a visually stunning, emotionally resonant digital presence that feels like "a high-end research lab crossed with a master blacksmith's forge at night." The prompt specified six required sections (Hero, Ecosystem, Featured Work, Lab Notes, The Forge/Philosophy, Newsletter), a canvas-based forge animation, premium typography, scroll-triggered interactions, full responsiveness, and accessibility foundations.

The full prompt was 4,569 characters. One shot. No refinement, no iteration, no follow-up.

## The Results

| Metric | Value |
|--------|-------|
| Reasoning | 113,442 chars (9.5 min) |
| Output | 59,369 chars (57.1 KB) |
| Total time | 11.5 minutes |
| JavaScript functions | 18 |
| Console errors | **0** |
| Total tokens | ~69,000 (est.) |

## Art Direction — Chosen by the Model

GLM-5.3 opened with its own art-direction brief before writing a single line of code:

> *"The Forge at Night." A near-black smithy of a page: charcoal and steel surfaces, hairline rules like tool marks, and one hot idea — every headline carries a single word struck in ember italic, the way iron carries the hammer's mark. Cormorant Garamond (literary, patient) against Space Grotesk and IBM Plex Mono (lab precision). The signature moment is the hero canvas: a living coal bed with embers rising under additive glow, a slow cyan "constellation" of deliberating agent-nodes drifting above the heat — and the page invites you to *strike it* (click anywhere; sparks fly).*

It then proceeded to build exactly that.

## The Six Sections

### 1. Hero — "Intelligence is raw. Judgment gives it an edge."

A full-viewport canvas animation renders a living coal bed with ember particles rising under additive glow. Above the heat, a slow cyan constellation of agent-nodes drifts — representing the " deliberating intelligence" theme. Click anywhere and sparks fly from the impact point. The headline uses Cormorant Garamond with a single ember-italic word ("edge") struck like a hammer mark.

The tagline GLM-5.3 wrote — "Intelligence is raw. Judgment gives it an edge." — is better than our original. It captures the forge metaphor and the human-judgment thesis in eight words.

### 2. The Ecosystem — "One lab. Many surfaces."

Rather than a generic card grid, GLM-5.3 built an expanding lab registry. Six surfaces (AI Clearinghouse, WisdomForge, Hermes Agent, Praxis, SMF AI Weekly, Books & Publications) are presented as numbered entries with engraved line-art treatment. Each opens to reveal a substantive description written in the brand voice:

> "Independent research, benchmarks, and field guides for people deciding what AI is actually good for — written for practitioners, not procurement. No affiliate links, no hype. Just what held up, what didn't, and why."

### 3. Featured Work — "Projects that ship."

Three surfaces carry heavier visual weight: Hermes Agent, WisdomForge, and Praxis. Each is framed with forge-stage sigils GLM-5.3 invented: **The Strike** (where the hammer meets), **The Anneal** (controlled cooling), and **The Temper** (the final hardening). These map to the three projects' development stages.

### 4. Latest from the Lab — "Field notes, kept in public."

Five field notes with dated excerpts, each written in a distinct voice matching its source surface. The copy is philosophical and grounded:

> "The surprise wasn't the competence — it was the shape of the refusals. Praxis escalated eleven decisions in thirty days; on review, we agreed with ten. The eleventh taught us more about our charter than the ten that held."

> "A number without a method is a rumor with confidence. We've started publishing the failures our scores were built on; it changes how people read them, and it should."

These are invented but tonally perfect — they sound exactly like what we'd write.

### 5. The Forge — "Why a forge?"

The about/philosophy section tells Michael's story: thirty years in technology, a working blacksmith's shop. The Yeats quote is set as a full-width moment of silence:

> *"The best lack all conviction, while the worst are full of passionate intensity."*

The treatment is restrained — no animation, no decoration. Just the quote, full-width, in serif italic against the dark background. It reads as a meditative pause in the page's rhythm.

### 6. Newsletter — "One letter. Every week. Struck while hot."

A working signup form with inline validation states, semantic labels, and proper accessibility attributes. The copy: "The lab notebook, kept in public — what we built, what broke, and what changed our minds. Written to be read in five minutes, and worth an hour of thought."

## The Canvas Forge Animation

The hero canvas runs three independent particle systems managed by 18 functions:

| System | Functions | Behavior |
|--------|-----------|----------|
| Embers | `newEmber`, `stepEmber`, `drawEmber` | Particles spawn from the coal bed, rise with flickering glow, fade at height limit |
| Agent nodes | `build`, `stepNodes`, `drawNodes` | Cyan constellation points drift slowly above the heat, connected by proximity lines |
| Sparks | `strike`, `stepSparks`, `drawSparks` | Click-triggered: sparks burst from cursor position with physics-based trajectories |
| Coal bed | `drawBed`, `sprite` | Static glow gradient at the canvas base, pre-rendered to a sprite for performance |

The animation loop runs on `requestAnimationFrame` with proper cleanup (`start`/`stop` functions). The entire system respects `prefers-reduced-motion` — users with that preference set see a static coal bed with no particle motion.

## Typography and Color System

GLM-5.3 selected three typefaces via Google Fonts CDN:

- **Cormorant Garamond** — refined serif for headlines (literary, patient)
- **Space Grotesk** — clean sans for body text (modern, precise)
- **IBM Plex Mono** — monospace for section numbers and labels (lab precision)

The color system uses CSS custom properties throughout:

```css
--ink: #0b0b0d;          /* near-black base */
--ink-2: #101014;         /* panel surface */
--ember: #ff7a2f;         /* molten metal accent */
--ember-hi: #ff9a56;      /* ember highlight */
--cyan: #5bd6dd;          /* electric cyan (agent/intelligence) */
--steel: #8ea6bf;         /* tempered blue steel */
--text: #ddd9d0;          /* warm off-white body text */
```

## Bonus Features We Didn't Request

GLM-5.3 added several features beyond the prompt:

1. **Click-to-spark interaction** — clicking anywhere in the hero triggers a spark burst from the impact point
2. **Scroll progress indicator** — a thin ember-orange bar at the top tracks scroll position
3. **Nav transformation** — fixed navigation starts transparent, becomes solid charcoal on scroll
4. **Numbered section labels** — "01 — Ecosystem" through "05 — SMF AI Weekly" in IBM Plex Mono
5. **Forge-stage sigils** — The Strike / The Anneal / The Temper as conceptual framing for featured projects
6. **`prefers-reduced-motion` support** — canvas animation disables for users who request reduced motion
7. **Invented field notes** — five tonally-perfect lab notebook excerpts with dates and source attributions

## Technical Quality

- **Zero console errors** in headless Chromium
- **Semantic HTML5** — proper `<section>`, `<nav>`, `<form>`, `<article>` elements
- **Accessibility** — aria labels, visually-hidden labels for form inputs, keyboard-friendly navigation
- **IntersectionObserver** for scroll-triggered reveal animations (3 instances)
- **requestAnimationFrame** canvas loop with proper start/stop lifecycle
- **CSS custom properties** for the entire design system (easy theming)
- **Mobile-first responsive** — Grid and Flexbox with container queries where useful
- **Performance** — coal bed sprite pre-rendered, particle counts managed, no layout thrashing

## GLM-5.3 One-Shot Series Track Record

| Build | Output | Time | Features | Console Errors |
|-------|--------|------|----------|----------------|
| Canvas game (2D) | 33 KB | 6.5 min | 17/17 requested | 0 |
| WebGL2 art studio | 57 KB | 20.4 min | 4 modes | 0 |
| Security audit report | 76 KB | 7.7 min | 19 findings | 0 |
| Neural net visualizer | — | — | — | 0 |
| Solar system orrery | — | — | — | 0 |
| Generative art (WebGL2) | — | — | — | 0 |
| **SMF Works homepage** | **57 KB** | **11.5 min** | **6 sections + 7 bonus** | **0** |

This is the most complex one-shot in the series. A full cinematic homepage with a live canvas animation, six fully-realized content sections, a working form, and production-quality code — from a single 4.5KB prompt.

## What This Means

The progression across this series tells a clear story. GLM-5.3 started with a canvas game — impressive but bounded. Then a WebGL2 art studio — more complex, still a single-purpose tool. Now a complete marketing homepage with brand voice, art direction, six content sections, interactive canvas, and accessibility foundations.

Each build shipped with zero console errors. Each included features we didn't request. Each was one shot, zero iteration.

The implication for development teams: the bar for "first draft" just moved dramatically. This isn't a finished production site — it needs real content, real form handling, real analytics, and real accessibility auditing. But as a starting point that a developer refines rather than builds from scratch, it saves days of work. The art direction alone — the color system, typography pairing, section pacing, and interaction design — would typically take a designer a full day to establish.

GLM-5.3 thought for 9.5 minutes and wrote for 2. That ratio is the story. The reasoning phase produced 113K characters of design decisions, architecture choices, and code structure before a single line of HTML appeared. When the output started, it streamed at ~3K characters per 30 seconds — fast, clean, and final.

---

*Try the live demo: [SMF Works Forge Homepage](/demos/2026-08-16-glm-5-3-smf-works-forge-homepage-one-shot/)*

*GLM-5.3 via Z.ai Coding Plan API. Single prompt, zero iteration, `reasoning_effort: medium`, `max_tokens: 131072`. Tested in headless Chromium via Playwright.*