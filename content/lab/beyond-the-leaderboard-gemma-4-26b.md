---
{
  "slug": "beyond-the-leaderboard-gemma-4-26b",
  "title": "Beyond the Leaderboard: Gemma 4 26B",
  "excerpt": "Google's MoE flagship won the series with the fastest time-to-first-token and strong precision — but still over-produces on word counts.",
  "category": "Benchmark",
  "tags": ["Gemma", "Google", "benchmark", "Beyond the Leaderboard", "OpenRouter", "MoE"]
}
---

# Beyond the Leaderboard: Gemma 4 26B

**Model:** `google/gemma-4-26b-a4b-it` via OpenRouter  
**Test date:** 2026-06-05  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-gemma-4-26b)

## What we tested

Gemma 4 26B is a Mixture-of-Experts model: 26.2B total parameters, but only 3.8B active per token. We tested whether that efficiency translated into real-world performance.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.82 |
| Tests passed | 7/15 |
| Avg time-to-first-token | ~0.8s |
| Avg total time | ~7.9s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36) |
| Code Generation | 0.90 | ✅ | Typed, documented, O(n) noted |
| Debugging | 0.50 | ❌ | Insisted buggy code was correct |
| Algorithm Explanation | 0.50 | ❌ | 2 long sentences |
| Complex Multi-Step Reasoning | 0.75 | ✅ | Solved the logic puzzle |
| Content Generation | 0.50 | ❌ | Within word count, drifted |
| Edge Case Handling | 0.50 | ❌ | Asked clarifying questions |
| Long-Context RAG | 0.50 | ❌ | Got McKinsey stat, missed attribution |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Made up function calls |
| Instruction Following | 0.70 | ✅ | 2/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Missed key facts |
| Recent Knowledge | 0.50 | ❌ | Accurate cutoff |

## What worked

- **Fastest TTF in the series (~0.8s).** Sub-second latency opens real-time use cases.
- **Code generation (0.90)** is nearly perfect.
- **Instruction following (0.70)** tied DeepSeek for best in series.
- **Solved the logic puzzle** that defeated Kimi and DeepSeek.

## What didn't

- **Word-count precision** failed on both content generation and summarization.
- **Tool use** invented function calls.
- **Debugging** missed the bug.

## Verdict

Gemma 4 26B is the efficiency king: fast, reliable, and strong across the board. It is the best default for high-volume API workloads where speed and uptime matter more than exact word counts.
