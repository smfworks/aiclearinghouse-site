---
{
  "slug": "beyond-the-leaderboard-qwen-3.7-max",
  "title": "Beyond the Leaderboard: Qwen 3.7-Max",
  "excerpt": "Alibaba's reasoning flagship scored near the top of the series — but took 31 seconds on average to produce its first token.",
  "category": "Benchmark",
  "tags": ["Qwen", "Alibaba", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: Qwen 3.7-Max

**Model:** `qwen/qwen3.7-max` via OpenRouter  
**Test date:** 2026-06-06  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-qwen3.7-max)

## What we tested

Qwen 3.7-Max is Alibaba's flagship reasoning model. It generates extensive internal reasoning chains before answering. We tested whether that depth justified the wait.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.74 |
| Tests passed | 8/15 |
| Avg time-to-first-token | ~31.0s |
| Avg total time | ~35.1s |
| Reliability | 93.3% (1 error) |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36), verbose |
| Code Generation | 0.80 | ✅ | Production-ready code |
| Debugging | 0.50 | ❌ | Correctly said no bug |
| Algorithm Explanation | 0.65 | ✅ | Good content, too many sentences |
| Complex Multi-Step Reasoning | 0.75 | ✅ | Solved the logic puzzle |
| Content Generation | 0.50 | ❌ | Missed word count |
| Edge Case Handling | 0.50 | ❌ | Made assumptions |
| Long-Context RAG | 0.50 | ❌ | Partial recall |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Partial approach |
| Instruction Following | 0.70 | ✅ | 4/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Hallucinated entirely different article |
| Recent Knowledge | 0.50 | ❌ | Accurate cutoff |

## What worked

- **Instruction following (0.70)** was the best in the series, hitting 4/5 constraints.
- **Structured output** is perfect.
- **Code generation (0.80)** is strong.
- **Complex reasoning** solved the logic puzzle.

## What didn't

- **Speed tax.** 31.0s TTF is 2× slower than DeepSeek and 14× slower than Kimi.
- **Summarization fidelity** hallucinated a completely different article topic.
- **Reliability** dropped to 93.3% with one error.

## Verdict

Qwen 3.7-Max is a precision powerhouse for offline or low-volume tasks where latency does not matter. The speed makes it unsuitable for real-time or high-volume production use.
