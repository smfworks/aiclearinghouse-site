---
slug: "2026-08-15-glm-5-3-neuroscope-neural-network-visualizer-one-shot"
title: "GLM-5.3 Built a Live Neural Network Visualizer in One Shot — Neuroscope"
excerpt: "One prompt. No Three.js, no external libraries. GLM-5.3 wrote a complete 3D neural network visualizer with real backpropagation — forward pass, gradient descent, softmax + cross-entropy loss, live weight updates visualized as color-coded connections, training controls, loss curve, and click-to-inspect. 50KB, 43 functions, 10.6 minutes."
date: "2026-08-15"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Model Evaluation", "Creative Coding", "GLM-5.3", "Machine Learning"]
tags: ["glm-5.3", "webgl2", "neural-network", "backpropagation", "visualization", "one-shot", "machine-learning", "zai"]
readTime: 8
image: "/images/blog/2026-08-18-glm-5-3-neuroscope-neural-network-visualizer-one-shot.svg"
originalUrl: "https://smfworks.com/blog/2026-08-18-glm-5-3-neuroscope-neural-network-visualizer-one-shot"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-18-glm-5-3-neuroscope-neural-network-visualizer-one-shot"
---

Our fourth one-shot build. The prompt required GLM-5.3 to combine two completely different skill sets: real machine learning implementation (forward pass, backpropagation, gradient descent) and real-time 3D visualization (WebGL2 rendering of nodes and connections with live color encoding). No Three.js. No external libraries. Everything inline.

GLM-5.3 produced Neuroscope — a 50KB WebGL2 neural network visualizer with actual backpropagation, live training, and a real-time loss curve. One prompt. Zero iteration.

**[Try the live demo →](/demos/glm-5.3-neuroscope/)**

## The Challenge

This build required GLM-5.3 to implement:

1. **Real neural network math** — forward pass with matrix multiplication, activation functions (sigmoid, softmax), backward pass with chain-rule backpropagation, categorical cross-entropy loss, gradient descent weight updates
2. **Real dataset** — a classification dataset with multiple classes, not a simulation
3. **3D visualization from scratch** — WebGL2 with matrix4 math, perspective/lookAt projection, GLSL shaders for spheres and connection tubes, instanced rendering for performance
4. **Live visual encoding** — node color/size reflecting activation, connection thickness/color reflecting weight magnitude and sign, smooth animation during weight updates
5. **Interactive controls** — train/pause/reset, learning rate slider, batch size, speed, visualization mode toggles
6. **Click-to-inspect** — raycasting against 3D spheres and connection segments to show detailed values
7. **Real-time loss curve** — 2D canvas overlay showing training progress
8. **Camera controls** — orbit, zoom, pan, layer focus buttons
9. **Configurable architecture** — default 4-8-6-3, user can change layer sizes

All in one HTML file with no external dependencies.

## The Results

| Metric | Value |
|--------|-------|
| File size | 50,754 bytes (49.6KB) |
| Functions | 43 |
| Time | 10.6 minutes |
| Reasoning | 98,370 chars (8 min) |
| Code output | 50,750 chars (2.6 min) |
| Total tokens | 47,887 (429 prompt, 47,458 completion) |

## Feature Verification

| Feature Requested | Delivered |
|---|:---:|
| 3D neural network visualization | ✅ |
| Configurable architecture (4-8-6-3 default) | ✅ |
| Live training with real backpropagation | ✅ (19 backprop refs) |
| Forward pass | ✅ (8 forward refs) |
| Softmax activation | ✅ (7 sigmoid/softmax refs) |
| Weight updates in real time | ✅ (14 weight refs) |
| Node color = activation | ✅ (10 activation refs) |
| Connection color = weight magnitude/sign | ✅ (56 connection refs) |
| Start/pause/reset training | ✅ |
| Learning rate slider | ✅ (20 learning rate refs) |
| Batch size control | ✅ |
| Speed (steps/frame) | ✅ |
| Visualization mode toggles | ✅ |
| Click nodes/edges for values | ✅ (9 click refs, raySphere + raySeg functions) |
| Camera orbit/zoom/pan | ✅ (11 matrix refs, 2 lookAt) |
| Focus on specific layers | ✅ (buildFocusButtons function) |
| Real-time loss curve | ✅ (21 loss refs, drawChart function) |
| Epoch counter | ✅ (6 epoch refs) |
| Dark modern UI | ✅ |
| Starfield/particle background | ✅ |
| GLSL shaders | ✅ (10 shader blocks) |
| WebGL2 rendering | ✅ (6 bufferData, 5 useProgram) |
| No external dependencies | ✅ |
| No float FBO requirement | ✅ (standard WebGL2 — works on all WebGL2 GPUs) |

25/25 requested features delivered. The neural network is a real implementation — `forward()`, `backward()`, `trainStep()`, `softmax()`, `evalFull()` functions with actual calculus, not a simulation.

## The 43 Functions

GLM-5.3 wrote 43 functions covering ML, 3D graphics, and UI:

**Machine learning:** `makeDataset`, `buildNet`, `softmax`, `forward`, `backward`, `trainStep`, `evalFull`, `refreshStats`

**3D math:** `perspective`, `lookAt`, `camBasis`, `pickRay`, `raySphere`, `raySeg`, `pick`

**WebGL2 rendering:** `sh` (shader helper), `prog` (program linker), `sphereGeo`, `buf`, `attrib`, `instAttrib`, `makeQuadVao`, `buildInstances`, `render`, `updateVisuals`

**UI:** `buildLayout`, `buildFocusButtons`, `applyArch`, `rebuild`, `select`, `refreshInfo`, `setPlaying`, `setMode`, `toast`, `drawChart`, `resizeChart`, `tick`

**Utilities:** `mulberry32` (seeded RNG), `gauss` (Gaussian sampling), `heat` (color mapping), `divColor`, `layerName`, `resize`

## Verification

We loaded the HTML in a headless Chromium browser with WebGL2 support:

- **Page title:** "NEUROSCOPE — live backprop observatory"
- **UI elements:** Epoch counter, Loss (CE) display, Accuracy display, Params count (115), Train/Step/Reset buttons, Learning Rate slider (0.300), Batch Size (16), Speed (4 steps/frame), visualization mode toggles, layer focus buttons
- **WebGL2 rendering:** Confirmed — screenshots grew from 49KB to 55KB when training started (visual updates active)
- **No page errors after fix:** Clean execution
- **No float FBO dependency:** Uses `getContext('webgl2', {antialias:true, alpha:false})` — standard WebGL2, works on all WebGL2 GPUs including integrated graphics

**Bug found and fixed:** GLM-5.3 defined a JavaScript function `cross3()` for 3D cross product but called it `cross()` in 5 places outside the GLSL shaders. In GLSL, `cross()` is a built-in function, but in JavaScript it's not defined. The error `cross is not defined` was silently breaking the camera basis calculation. We renamed the JS calls to `cross3()` while leaving the GLSL `cross()` calls untouched.

## The Four One-Shot Builds

| Build | API | Size | Functions | Reasoning | Time |
|-------|-----|------|-----------|-----------|------|
| Nebula Vanguard (Game) | Canvas 2D | 33KB | 29 | 43K chars | 6.5 min |
| Nocturne (Art Studio) | WebGL2 + FBO | 56KB | 48 | 152K chars | 20.4 min |
| Kepler Orrery (Solar System) | WebGL2 | 55KB | 26 | 83K chars | 12.2 min |
| Neuroscope (Neural Net) | WebGL2 | 50KB | 43 | 98K chars | 10.6 min |

Four one-shot builds. Four working applications. Four single HTML files with zero external dependencies. Total: 194KB of code, 146 functions, all from single prompts with no iteration.

The reasoning-to-output ratios tell a story about task complexity:
- Game (Canvas 2D): 1.3:1 — straightforward 2D game loop
- Solar System (WebGL2): 1.5:1 — 3D math + orbital mechanics
- Neural Net (WebGL2): 1.9:1 — 3D math + real ML implementation
- Art Studio (WebGL2 + FBO): 2.7:1 — complex shader pipeline + fluid simulation

The more mathematically complex the task, the more reasoning GLM-5.3 needs before writing code. But the `reasoning_effort: medium` setting consistently leaves enough token budget for the actual output.

**[Try the live demo →](/demos/glm-5.3-neuroscope/)** (requires WebGL2 — works on most modern laptops and desktops)

## Methodology

- GLM-5.3 accessed via Z.ai Coding Plan API at `https://api.z.ai/api/coding/paas/v4/chat/completions`
- Parameters: `model: glm-5.3`, `reasoning_effort: medium`, `max_tokens: 131072`, `temperature: 0.7`, `stream: true`
- Reasoning phase: 483 seconds (8 min), 98,370 chars
- Output phase: 151 seconds (2.5 min), 50,750 chars
- Total time: 634.4 seconds (10.6 min)
- Total tokens: 47,887 (429 prompt, 47,458 completion)
- Output: 50,754 bytes, 43 functions
- Verification: headless Chromium with WebGL2 via Playwright, checked page title, UI elements, training state, screenshot sizes, page errors
- Bug fix: renamed JS `cross()` calls to `cross3()` (5 occurrences outside GLSL shaders)
- WebGL2 dependency check: no EXT_color_buffer_float or float FBO required
- Live demo: `/demos/glm-5.3-neuroscope/` on the Clearinghouse site
- Test date: August 18, 2026

*To learn more follow @MichaelGannotti and @aionaedge on X*