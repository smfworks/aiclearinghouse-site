---
{
  "slug": "beyond-the-leaderboard-multimodal-minimax-m3",
  "title": "Beyond the Leaderboard: Multimodal MiniMax M3",
  "excerpt": "MiniMax M3 passed physics reasoning but hallucinated a red light in an autonomous-driving frame — a safety-critical failure pattern.",
  "category": "Benchmark",
  "tags": ["MiniMax", "M3", "multimodal", "vision", "benchmark", "Beyond the Leaderboard"]
}
---

# Beyond the Leaderboard: Multimodal MiniMax M3

**Model:** MiniMax M3 via OpenRouter  
**Test date:** 2026-06-08  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-multimodal-minimax-m3)

## What we tested

We ran MiniMax M3 through a 15-test multimodal benchmark across three tiers:

- **Tier A — Perceptual:** describe complex scenes, abstract art, video summaries, audio transcription
- **Tier B — Reasoning:** chart analysis, geometric puzzles, cross-modal contradiction detection
- **Tier C — Physical / Action:** physics causality, robot trajectories, autonomous driving decisions, video continuation

## Results at a glance

| Test | Score | Passed | Key finding |
|---|---|---|---|
| A1 — Complex Scene | — | — | Coherent response, no automated evaluator |
| A2 — Abstract Art | — | — | Coherent poetic analysis, no automated evaluator |
| B1 — Chart Interpretation | — | — | Coherent trend analysis, no automated evaluator |
| B2 — Geometric Puzzle | 0.00 | ❌ | Errored after 100s — likely timeout |
| C1 — Physics Causality | 0.60 | ✅ | Correctly predicted block fall |
| C2 — Robot Trajectory | 0.00 | ❌ | Failed to output valid coordinates |
| C3 — Autonomous Driving | 0.12 | ❌ | Hallucinated a red light |

## What worked

- **Physics causality (C1).** MiniMax correctly predicted that removing the middle block would cause the top block to fall while the bottom block remained stable. This is a hard spatial reasoning task.
- **Perceptual and reasoning responses (A1, A2, B1)** were coherent and substantive, though they lack automated scores.

## What didn't

- **Autonomous driving (C3) is a safety-critical failure.** The image showed a yellow traffic light, a pedestrian, a slowing vehicle, and a cyclist. The correct action was decelerate and prepare to stop. MiniMax said: **"Stop at the Red Light."**
- **Robot trajectory (C2)** failed to output valid `[x, y]` coordinates.
- **Geometric puzzle (B2)** errored after 100 seconds.

## What this tells us

MiniMax M3 can handle spatial and physical reasoning, but it confidently misclassifies safety-relevant visual details. That is the "smooth liar" problem: plausible, confident, and wrong on the very detail that matters most.

## Verdict

Do not deploy MiniMax M3 (or any single vision model) for safety-critical perception tasks without uncertainty quantification, human-in-the-loop review, or ensemble validation.
