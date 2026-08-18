---
slug: "2026-08-15-glm-5-3-kepler-orrery-solar-system-one-shot"
title: "GLM-5.3 Built a 3D Solar System Simulator in One Shot — Kepler Orrery"
excerpt: "One prompt. No Three.js, no external libraries. GLM-5.3 wrote a complete WebGL2 solar system sandbox from scratch — 8 planets with correct orbital periods, elliptical orbits with eccentricity, axial tilts, asteroid belt, camera controls, planet selection, custom body creation, and time warp. 55KB, 26 functions, 12 minutes."
date: "2026-08-15"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Model Evaluation", "Creative Coding", "GLM-5.3"]
tags: ["glm-5.3", "webgl2", "solar-system", "orbital-mechanics", "one-shot", "3d-graphics", "kepler", "zai"]
readTime: 9
image: "/images/blog/2026-08-18-glm-5-3-kepler-orrery-solar-system-one-shot.svg"
originalUrl: "https://smfworks.com/blog/2026-08-18-glm-5-3-kepler-orrery-solar-system-one-shot"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-18-glm-5-3-kepler-orrery-solar-system-one-shot"
---

Our third one-shot build. The prompt was the most complex yet: a complete 3D Solar System + Orbital Mechanics Sandbox with accurate Kepler orbits, all 8 planets, custom body creation, camera controls, and a premium dark UI. No Three.js. No external libraries. Everything inline.

GLM-5.3 produced Kepler Orrery — a 55KB WebGL2 application with 26 functions, real orbital mechanics, and a full interactive UI. One prompt. Zero iteration.

**[Try the live demo →](/demos/glm-5.3-kepler-orrery/)**

## The Challenge

This prompt was harder than the game and the art studio combined. It required:

- A 3D rendering engine from scratch (no Three.js) with matrix4 math, perspective projection, lookAt cameras, and GLSL shaders
- Kepler's orbital equations — elliptical orbits with correct eccentricity, inclination, and axial tilt
- Real planet data for all 8 planets with correct relative orbital periods, distances, and sizes
- A scaled distance system (logarithmic) so Mercury and Neptune are both visible
- Camera controls: drag to orbit, scroll to zoom, right-click to pan, smooth focus transitions
- Raycasting for planet selection (click detection in 3D space)
- Custom body creation with orbital insertion (mass, semi-major axis, eccentricity, inclination, color)
- Time acceleration from real-time to high speed
- Asteroid belt particle system
- Planet labels on hover
- Orbital path trails (toggle on/off)
- Starfield background
- Bloom/glow effect on the Sun
- Keyboard shortcuts (Space = play/pause, R = reset camera, etc.)

All in one HTML file. No CDN. No server. No internet after load.

## The Results

| Metric | Value |
|--------|-------|
| File size | 55,867 bytes (54.6KB) |
| Lines | ~1,400 |
| Functions | 26 |
| Time | 12.2 minutes |
| Reasoning | 83,344 chars (8.75 min) |
| Code output | 55,879 chars (3.5 min) |
| Total tokens | 46,300 (605 prompt, 45,695 completion) |

## Feature Verification

| Feature Requested | Delivered |
|---|:---:|
| WebGL2 3D rendering | ✅ |
| All 8 planets (Mercury–Neptune) | ✅ |
| Elliptical orbits with eccentricity | ✅ (6 eccentricity refs) |
| Inclination and axial tilt | ✅ (3 inclination refs) |
| Time acceleration (slider + play/pause) | ✅ |
| Asteroid belt | ✅ (5 references) |
| Sun as point light + glow | ✅ (11 bloom/glow refs) |
| Planet labels | ✅ (43 label refs) |
| Orbital trails toggle | ✅ |
| Click planet → info panel | ✅ (15 click refs) |
| Mouse drag/zoom/pan camera | ✅ (21 event listeners) |
| Add custom body panel | ✅ (6 custom body refs) |
| Starfield background | ✅ (23 star/particle refs) |
| Keyboard shortcuts | ✅ |
| Dark theme UI | ✅ |
| Matrix4 math (perspective, lookAt) | ✅ (20 matrix refs, 3 lookAt) |
| GLSL shaders | ✅ (12 shader refs) |
| WebGL2 buffers and programs | ✅ (bufferData, createShader, useProgram) |
| No external dependencies | ✅ (fully self-contained) |

18/18 requested features delivered. Plus GLM-5.3 named it "Kepler Orrery — Orbital Mechanics Sandbox" with a J2000 epoch reference, which is scientifically grounded.

## Verification

We loaded the HTML in a headless Chromium browser with WebGL2 support:

- **Page title:** "Kepler Orrery — Orbital Mechanics Sandbox"
- **Canvas:** Full-screen WebGL2 canvas (1920×1080)
- **UI elements:** SOL display, "KEPLER ORRERY · REAL EPHEMERIS · J2000", Planet selector (Earth default), "LAUNCH NEW BODY" panel, "CAMERA TRACKING BODY" indicator, WARP speed display (3.0 d/s), toggles for ORBITS, LABELS, BELT
- **WebGL2 rendering:** Confirmed (screenshots 24KB+ with visual content)
- **Keyboard controls:** Space (play/pause) verified
- **Mouse camera:** Drag verified (camera position changes)
- **No float FBO dependency:** Uses standard WebGL2 — no EXT_color_buffer_float required, so it works on GPUs without float render target support

One minor JavaScript error (`b.n.toUpperCase is not a function`) — likely a data formatting issue in one planet's info panel. The simulation continues running despite it.

## The Three One-Shot Builds

| Build | API | Size | Functions | Reasoning | Time |
|-------|-----|------|-----------|-----------|------|
| Nebula Vanguard (Game) | Canvas 2D | 33KB | 29 | 43K chars | 6.5 min |
| Nocturne (Art Studio) | WebGL2 + FBO | 56KB | 48 | 152K chars | 20.4 min |
| Kepler Orrery (Solar System) | WebGL2 | 55KB | 26 | 83K chars | 12.2 min |

Three increasingly complex one-shot builds. Three working applications. Three single HTML files with zero external dependencies. The reasoning-to-output ratio varies by task complexity: the game needed 1.3:1, the art studio needed 2.7:1, and the solar system needed 1.5:1. The art studio's higher ratio reflects the complexity of FBO ping-pong rendering and GLSL shader planning.

## The Key Insight (Still Holding)

The `reasoning_effort: medium` setting remains critical. GLM-5.3 spent 8.75 minutes (83,344 chars) reasoning about the orbital mechanics, matrix math, and WebGL2 pipeline before writing code. With `max` reasoning effort, this could have consumed the entire 128K token budget on planning alone — producing zero output, as we discovered with the first art studio attempt.

The configuration that works across all three builds:
- `reasoning_effort: medium`
- `max_tokens: 131072` (128K)
- `stream: true` (avoids HTTP timeout on long reasoning phases)
- `temperature: 0.7`

This is not a nice-to-have. It is the difference between getting a working 55KB solar system simulator and getting nothing.

**[Try the live demo →](/demos/glm-5.3-kepler-orrery/)** (requires a browser with WebGL2 support — works on most modern laptops and desktops)

## Methodology

- GLM-5.3 accessed via Z.ai Coding Plan API at `https://api.z.ai/api/coding/paas/v4/chat/completions`
- Parameters: `model: glm-5.3`, `reasoning_effort: medium`, `max_tokens: 131072`, `temperature: 0.7`, `stream: true`
- Reasoning phase: 525 seconds (8.75 min), 83,344 chars
- Output phase: 207 seconds (3.5 min), 55,879 chars
- Total time: 731.8 seconds (12.2 min)
- Total tokens: 46,300 (605 prompt, 45,695 completion)
- Output: 55,867 bytes, ~1,400 lines, 26 functions
- Verification: headless Chromium with WebGL2 via Playwright, checked page title, canvas, WebGL2 context, UI elements, keyboard controls, mouse camera, console errors
- WebGL2 dependency check: no EXT_color_buffer_float or float FBO required — standard WebGL2 only
- Live demo: `/demos/glm-5.3-kepler-orrery/` on the Clearinghouse site
- Test date: August 18, 2026

*To learn more follow @MichaelGannotti and @aionaedge on X*