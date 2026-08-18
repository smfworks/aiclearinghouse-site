---
slug: "2026-08-15-glm-5-3-one-shot-game-build-33kb-no-iteration"
title: "GLM-5.3 Built a Complete Game in One Shot — 33KB, Zero Iteration"
excerpt: "We gave GLM-5.3 a single prompt: build a particle galaxy game with 15 features in one HTML file, no external dependencies. It thought for 6.5 minutes, wrote 33KB of code, and delivered 17/17 features that actually run. But getting there required a critical discovery about reasoning_effort that every developer using GLM-5.3 needs to know."
date: "2026-08-15"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Model Evaluation", "Creative Coding", "GLM-5.3"]
tags: ["glm-5.3", "one-shot", "game", "html5", "canvas", "reasoning-effort", "zai", "creative-coding"]
readTime: 8
image: "/images/blog/2026-08-18-glm-5-3-one-shot-game-build-33kb-no-iteration.svg"
originalUrl: "https://smfworks.com/blog/2026-08-18-glm-5-3-one-shot-game-build-33kb-no-iteration"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-18-glm-5-3-one-shot-game-build-33kb-no-iteration"
---

We gave GLM-5.3 a single prompt. No examples, no iteration, no refinement, no follow-up turns. One shot. Build a complete particle galaxy game in a single HTML file with 15 specific features — starfield, spaceship, asteroids, shooting, explosions, power-ups, HUD, screen shake, start and game over screens. Zero external dependencies. Everything inline.

Six and a half minutes later, it produced 33,433 bytes of clean HTML. We loaded it in a browser. It worked.

## The Prompt

The request was specific — 15 features, one file, no libraries:

1. Full-screen canvas with deep space starfield (multi-layered parallax)
2. Mouse-controlled glowing spaceship with smooth easing
3. Particle trail with color gradients
4. Asteroids spawning from screen edges, rotating, drifting toward center
5. Click to shoot glowing energy projectiles
6. Explosion particle bursts on projectile-asteroid collisions
7. Score counter and health bar in a sleek HUD
8. Asteroids reaching the center damage the player
9. Screen shake on hits
10. Power-up orbs granting temporary rapid-fire
11. Glow effects, smooth animations, polished arcade feel
12. requestAnimationFrame game loop
13. Start screen with title and instructions
14. Game over screen with final score and restart button
15. Neon/cyberpunk visual style

The prompt ended with: "Output ONLY the complete HTML file. No explanations, no markdown code fences, no commentary."

## The Critical Discovery: reasoning_effort

The first attempt failed. Not because the code was bad — because there was no code at all.

GLM-5.3 defaults to `reasoning_effort: max`. On a complex creative task, this means the model thinks until it runs out of tokens. Our first attempt with `max_tokens: 32768` produced 111,605 characters of reasoning and zero characters of output. The model thought about the game for 10 minutes and never wrote a single line of code.

This is the most important operational insight from this test: **GLM-5.3's `max` reasoning effort can consume the entire token budget on thinking alone.** The `reasoning_effort` parameter is not optional for complex creative tasks — it is mandatory.

The Z.ai API documentation lists seven reasoning effort levels: `max`, `xhigh`, `high`, `medium`, `low`, `minimal`, `none`. The default is `max`. For coding benchmarks where the output is a function with assertions, `max` works because the output is small. For a 33KB creative task, `max` thinks itself into producing nothing.

The fix: set `reasoning_effort: medium` and raise `max_tokens` to 131,072 (128K, the model's maximum output). This gave the model enough reasoning budget to plan the architecture and enough output budget to write the code.

## The Results

| Metric | First Attempt (max) | Second Attempt (medium) |
|--------|:---:|:---:|
| reasoning_effort | max (default) | medium |
| max_tokens | 32,768 | 131,072 |
| Time | 586.8s (9.8min) | 391.3s (6.5min) |
| Reasoning output | 111,605 chars | 43,268 chars |
| Code output | 0 chars | 33,445 chars |
| Total tokens | 33,051 | 24,551 |
| Result | No file produced | 33KB working game |

The second attempt used fewer total tokens (24,551 vs 33,051) and produced a complete, working game. Medium reasoning was not just sufficient — it was more efficient.

## What GLM-5.3 Built

The output is a single HTML file called "NEBULA VANGUARD — Deep Field Defense Protocol." It contains 29 JavaScript functions, inline CSS, and a full-screen canvas game engine.

**Feature verification — 17/17 delivered:**

| # | Feature Requested | Delivered |
|---|---|:---:|
| 1 | Full-screen canvas starfield (parallax) | ✅ |
| 2 | Mouse-controlled spaceship with easing | ✅ |
| 3 | Particle trail with color gradients | ✅ |
| 4 | Asteroids spawning, rotating, drifting | ✅ |
| 5 | Click to shoot energy projectiles | ✅ |
| 6 | Explosion particle bursts | ✅ |
| 7 | Score counter + health bar HUD | ✅ |
| 8 | Asteroids damage player at center | ✅ |
| 9 | Screen shake on hits | ✅ |
| 10 | Power-up orbs with rapid-fire | ✅ |
| 11 | Glow effects (shadow blur) | ✅ |
| 12 | requestAnimationFrame game loop | ✅ |
| 13 | Start screen with title + instructions | ✅ |
| 14 | Game over screen with restart | ✅ |
| 15 | Neon/cyberpunk visual style | ✅ |
| 16 | Audio synthesis (bonus) | ✅ |
| 17 | Parallax nebula background (bonus) | ✅ |

GLM-5.3 delivered all 15 requested features plus two we did not ask for: procedural audio synthesis (`audioInit`, `tone`, `noiseHit` functions) and a parallax nebula layer (`makeNebula` function). The game has its own sound effects generated via Web Audio API.

## Verification: We Ran It

We loaded the HTML in a headless Chromium browser via Playwright and played the game programmatically:

- **Start screen:** Title "NEBULA VANGUARD" with instructions ("MOVE — cursor, the ship follows you"; "FIRE — click / hold to launch bolts"; "NEXUS — asteroids hitting the core hurt you"; "CORES — amber orbs grant rapid fire") and a LAUNCH button.
- **Gameplay:** Clicking LAUNCH transitions state from MENU (0) to PLAY (1). The ship follows the mouse. Asteroids spawn from screen edges and drift toward center. Clicking shoots projectiles. Asteroids reaching the center deal damage — health dropped from 100 to 55 during testing. Screen shake triggered on hits (0.054 intensity measured). Particle count peaked at 87 active particles.
- **Canvas rendering:** Center pixel color measured at RGB(181,193,208) — a bright blue-white core glow against the dark space background (RGB(2,3,13) at edges). 11,335 unique colors in a single frame, indicating rich particle effects and gradients.
- **Game functions:** 29 functions including `resize`, `makeGlow`, `audioInit`, `tone`, `noiseHit`, `makeStars`, `makeNebula`, `addParticle`, `burst`, `addRing`, `addPopup`, `explode`, `makeAsteroid`, `spawnAsteroid`, `destroyAsteroid`, `spawnOrb`, `damagePlayer`, `die`, `shoot`, `renderHealth`, `syncHUD`, `reset`, `startGame`, `update`, `drawCore`, `drawShip`, `render`, `frame`.

The game runs. The code is clean. The features work. One shot.

## The Efficiency Question

GLM-5.3 took 6.5 minutes and 24,551 tokens to produce this game. For comparison, DeepSeek V4-Pro on Ollama produced correct implementations of individual coding tasks in 10-20 seconds. A full game is a different category of task, but the time gap is real.

The question is whether 6.5 minutes is acceptable for one-shot creative generation. For a developer iterating on a design, no — you need faster turnaround. For a one-shot "generate me a complete polished artifact" request where the alternative is hand-coding 33KB of game engine code, yes. The 6.5 minutes includes 43,268 characters of architectural reasoning — planning the game loop, the particle system, the collision detection, the HUD layout, the state machine. That planning is what made the one-shot output work.

## The Honest Assessment

GLM-5.3's one-shot creative coding ability is real. A single prompt produced a working, polished game with all requested features plus bonuses. No iteration. No refinement. No external libraries.

But the discovery about `reasoning_effort` is the finding that matters most for developers. GLM-5.3's default `max` setting can think itself into producing nothing on complex creative tasks. The model needs to be told to think less — `medium` or `high` — when the output itself is large. This is counterintuitive: you would expect `max` reasoning to produce better results. On coding benchmarks with small outputs, it does. On creative tasks with large outputs, it produces no output at all.

The practical guidance for anyone using GLM-5.3 for creative coding:

- **Small outputs (functions, algorithms):** Use `reasoning_effort: max`. The deep thinking improves correctness.
- **Medium outputs (multi-file modules):** Use `reasoning_effort: high`. Balance thinking with output budget.
- **Large outputs (games, full applications):** Use `reasoning_effort: medium` and set `max_tokens` to 128K. The model needs the output budget more than the thinking budget.
- **Always use streaming mode** for tasks that may exceed 5 minutes. The Z.ai API times out non-streaming requests at 10 minutes.

One prompt. 33KB. 17/17 features. Zero iteration. That is GLM-5.3's one-shot creative coding capability — with the right configuration.

## Methodology

- GLM-5.3 accessed via Z.ai Coding Plan API at `https://api.z.ai/api/coding/paas/v4/chat/completions`
- Parameters: `model: glm-5.3`, `reasoning_effort: medium`, `max_tokens: 131072`, `temperature: 0.7`, `stream: true`
- First attempt used `max_tokens: 32768` with default `reasoning_effort: max` — produced 0 chars of output
- Second attempt used `reasoning_effort: medium` with `max_tokens: 131072` — produced 33,445 chars
- Verification: loaded output HTML in headless Chromium via Playwright, clicked LAUNCH button (#startBtn), played game programmatically for 15+ seconds, measured game state (state, score, health, asteroid count, particle count, screen shake), sampled canvas pixel data, counted unique colors
- Output file: 33,433 bytes, single self-contained HTML, zero external dependencies
- Test date: August 18, 2026

*To learn more follow @MichaelGannotti and @aionaedge on X*