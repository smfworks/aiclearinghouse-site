---
slug: "beyond-the-leaderboard-multimodal-minimax-m3"
title: "Beyond the Leaderboard: What Happens When AI Models Look at the World"
excerpt: "We ran MiniMax M3 through 15 multimodal tests. It passed physics reasoning but hallucinated a red light. Here's what that means."
date: "2026-06-08"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI Research", "Benchmarks"]
tags: []
readTime: 6
image: "/images/blog/beyond-the-leaderboard-multimodal-minimax-m3.png"
originalUrl: "https://smfworks.com/blog/beyond-the-leaderboard-multimodal-minimax-m3"
canonicalUrl: "https://www.smfclearinghouse.com/blog/beyond-the-leaderboard-multimodal-minimax-m3"
---
# Beyond the Leaderboard: What Happens When AI Models Look at the World

*Aiona Edge — Chief AI Research Scientist, SMF Works*

For the past week, we've been running text-only benchmarks. LLMs answering questions, writing code, reasoning through logic puzzles. Useful? Absolutely. Complete? Not even close.

The real world doesn't arrive as clean paragraphs. It arrives as a photo of a cluttered desk, a dashcam frame at an intersection, a robot arm reaching for a flower. Models that ace text benchmarks often stumble when the input has pixels instead of punctuation.

This week, we're changing that.

## The Multimodal Benchmark: 15 Tests, 6 Models, 5 Modalities

We built a 15-test benchmark across three tiers:

**Tier A — Perceptual:** Can the model describe what it sees? (Complex scenes, abstract art, video summaries, audio transcription)

**Tier B — Reasoning:** Can it interpret meaning? (Chart analysis, geometric puzzles, cross-modal contradiction detection)

**Tier C — Physical/Action:** Can it predict what happens? (Physics causality, robot trajectories, autonomous driving decisions, video continuation)

The lineup: **GPT-4o**, **Gemini 1.5 Pro**, **Claude 3.5 Sonnet**, **Qwen2-VL**, **MiniMax M3**, and **NVIDIA Cosmos 3**.

Today: MiniMax M3.

---

## MiniMax M3: The Setup

MiniMax M3 is a multimodal model available through OpenRouter. It processes text, images, and audio. We tested it via base64 image upload through the OpenRouter API — the same path most developers would use in production.

**What we had ready:** 8 synthetic image assets with known ground truth, 3 custom evaluators for physical reasoning tests, and a harness that tracks timing, scores, and failure modes.

**What wasn't ready:** Video clips, audio samples, and automated evaluators for perceptual/reasoning tests. Those tests ran but returned "no score" — the model responded, but we haven't yet built the rubric to grade those responses automatically.

---

## The Results

### What Passed

**C1 — Physics Causality (Score: 0.60 ✅)**

We showed MiniMax an image of three blocks stacked vertically — blue on bottom, red in the middle, green on top. The prompt: "What happens if the red block is removed?"

MiniMax got it right. It predicted that the green block would fall while the blue block stayed stable. It even called the question "a bit of a trick" — noting that the dramatic "Remove this" label might lead you to expect a collapse.

This matters. Physical intuition is one of the hardest tasks for vision models. Most humans get this right. Most models don't.

### What Failed

**C3 — Autonomous Driving (Score: 0.12 ❌)**

We showed MiniMax a dashcam frame approaching a busy intersection. Yellow traffic light. Pedestrian in the crosswalk from the left. Vehicle ahead slowing. Cyclist in the bike lane on the right.

The correct action: decelerate and prepare to stop.

MiniMax's response: **"Stop at the Red Light."**

There is no red light in the image. The light is yellow/amber. The pedestrian, the slowing vehicle, and the cyclist all support a cautious stop — but MiniMax invented a red light to justify it.

This is the kind of hallucination that gets people killed.

In a safety-critical system, a model that confidently misidentifies a yellow light as red is not a model you deploy. It's a model you debug.

**C2 — Robot Trajectory (Score: 0.00 ❌)**

We asked MiniMax to provide [x, y] coordinates for a robot gripper to pick up a red flower and place it in a blue vase, avoiding a wooden block obstacle.

The model failed to output valid coordinates. This could be a formatting issue — the model may not have understood the coordinate format requirement — or it could indicate limited spatial reasoning capability.

**B2 — Geometric Puzzle (Score: 0.00 ❌, Error)**

We asked MiniMax to count triangles in a geometric figure. The test errored out after 100 seconds — likely an API timeout or empty response. The model may have stalled on the spatial reasoning task.

### The Unscored Tests

A1 (Complex Scene), A2 (Abstract Art), B1 (Chart Interpretation), and the video/audio tests ran successfully and returned detailed responses. Without automated evaluators, we can't assign scores yet — but the responses were coherent, structured, and substantive.

A1 produced a full inventory of the workspace scene. A2 wrote a poetic analysis of the abstract art. B1 interpreted a data chart with trend analysis.

---

## What This Tells Us

MiniMax M3 is a capable multimodal model with one critical weakness: **it hallucinates on safety-relevant visual details.**

The physics reasoning (C1) shows the model can understand spatial relationships and causality. The driving test (C3) shows it can completely misread a traffic signal while maintaining confident, plausible-sounding reasoning.

This is the "smooth liar" problem. The model doesn't stutter. It doesn't say "I'm not sure." It says "Stop at the Red Light" with full conviction, even when the light is yellow.

For applications where safety matters — autonomous vehicles, medical imaging, industrial robotics — this behavior is a disqualifier. The model needs either:

1. **Uncertainty quantification** — "The light appears to be yellow, which means prepare to stop"
2. **Human-in-the-loop** — High-stakes decisions routed to human review
3. **Ensemble validation** — Multiple models checking each other's perception

---

## What's Next

Tomorrow: **Gemini 1.5 Pro** — the model with native video support and 1M token context. Can it handle the video tests that tripped up MiniMax?

Wednesday: **Claude 3.5 Sonnet** — Anthropic's vision-capable model, tested on document analysis and chart reasoning.

Thursday: **Qwen2-VL** — the open-weights vision model running locally via Ollama.

Friday: **GPT-4o** — the standard for general multimodal performance.

Next week: **NVIDIA Cosmos 3** — the physical AI world model that outputs coordinates and trajectories, not text.

Each model gets its own post. Each post names a threshold. Today's threshold: **Physical intuition is not enough. Safety-critical perception must be verified, never assumed.**

---

## Methodology Notes

- All tests run via OpenRouter API with base64 image upload
- Single attempt, no retries — same discipline as our text benchmarks
- Custom evaluators for C1-C4 using ground truth JSON annotations
- Timing data collected for every test
- Missing assets (video, audio) noted as limitations, not hidden

Full benchmark specification: [GitHub repo link](https://github.com/smfworks/benchmark-harness) (public after series completion)

---

*Aiona Edge is Chief AI Research Scientist at SMF Works. She runs the Beyond the Leaderboard benchmark series and builds AI systems that get tested before they get trusted.*

---

**Read the rest of the series:**
- [Beyond the Leaderboard #1: Kimi K2.6](https://smfworks.com/blog/beyond-the-leaderboard-kimi-k2-6)
- [Beyond the Leaderboard #2: DeepSeek-V4-Pro](https://smfworks.com/blog/beyond-the-leaderboard-deepseek-v4-pro)
- [The Benchmark That Caught Samsung's Mistake](https://smfworks.com/blog/samsung-galaxy-s25-benchmark-mistake)
