---
{
  "slug": "beyond-the-leaderboard-nemotron-3-ultra",
  "title": "Beyond the Leaderboard: Nemotron 3 Ultra",
  "excerpt": "NVIDIA's 550B-parameter free-tier model solved the logic puzzle that defeated Kimi and DeepSeek — then over-thought the constraint puzzle into paralysis.",
  "category": "Benchmark",
  "tags": ["NVIDIA", "Nemotron", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: Nemotron 3 Ultra

**Model:** `nvidia/nemotron-3-ultra-550b-a55b:free` via OpenRouter  
**Test date:** 2026-06-04  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-nemotron-3-ultra)

## What we tested

Nemotron 3 Ultra is a 550B-parameter model available on OpenRouter's free tier. The question was whether a free-tier frontier model could outperform the paid daily drivers we use in production.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.59 |
| Tests passed | 4/15 |
| Avg time-to-first-token | ~16.8s |
| Avg total time | ~19.1s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36), fast |
| Code Generation | 0.60 | ✅ | Compiled, missed some pattern checks |
| Debugging | 0.50 | ❌ | Claimed no bug when there was one |
| Algorithm Explanation | 0.35 | ❌ | Generic, missed complexity |
| Complex Multi-Step Reasoning | 0.75 | ✅ | **Solved the logic puzzle** |
| Content Generation | 0.50 | ❌ | Wrote 343 words for 200-word target |
| Edge Case Handling | 0.50 | ❌ | Asked questions, didn't handle empty input |
| Long-Context RAG | 0.50 | ❌ | Partial recall |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Wrong date format |
| Instruction Following | 0.30 | ❌ | 0/5 constraints — over-thought |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Missed key details |
| Recent Knowledge | 0.50 | ❌ | Accurate cutoff |

## What worked

- **Solved the five-friends logic puzzle (0.75)** — the test that broke Kimi and DeepSeek.
- **Perfect JSON output.**
- **Fast on simple tasks** (5.3s for basic reasoning).

## What didn't

- **Instruction following collapsed (0.30).** Nemotron built a 2,900-token self-analysis and failed every constraint.
- **Tool use** used the wrong date format.
- **Content generation** ignored the 200-word target.

## Verdict

Nemotron 3 Ultra is worth testing because it is free and has genuine reasoning strengths. But its precision failures make it unsuitable for constraint-heavy production tasks without significant prompt engineering.
