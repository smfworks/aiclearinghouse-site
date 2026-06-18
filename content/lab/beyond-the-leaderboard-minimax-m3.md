---
{
  "slug": "beyond-the-leaderboard-minimax-m3",
  "title": "Beyond the Leaderboard: MiniMax-M3",
  "excerpt": "MiniMax-M3 matched DeepSeek on instruction following and produced clean code — but hallucinated detailed recent events with confidence.",
  "category": "Benchmark",
  "tags": ["MiniMax", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: MiniMax-M3

**Model:** `minimax/minimax-m3` via OpenRouter  
**Test date:** 2026-06-03  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-minimax-m3)

## What we tested

MiniMax-M3 was an unknown going into the test. We had not used it in production. The benchmark was a blind evaluation against the same 15-test production harness.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.63 |
| Tests passed | 4/15 |
| Avg time-to-first-token | ~11.1s |
| Avg total time | ~24.1s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36) |
| Code Generation | 0.70 | ✅ | Clean Fibonacci with types and docstring |
| Debugging | 0.50 | ❌ | Correctly said code was fine |
| Algorithm Explanation | 0.50 | ❌ | 2 long sentences |
| Complex Multi-Step Reasoning | 0.25 | ❌ | Wrong answer |
| Content Generation | 0.50 | ❌ | Word-count issues |
| Edge Case Handling | 0.50 | ❌ | Asked clarifying questions |
| Long-Context RAG | 0.50 | ❌ | Got McKinsey stat |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Listed calls, no execution |
| Instruction Following | 0.70 | ✅ | 2/5 constraints met |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Missed key facts |
| Recent Knowledge | 0.50 | ❌ | Hallucinated G7 summit details |

## What worked

- **Tied DeepSeek on instruction following (0.70).** MiniMax visibly tried to satisfy constraints, substituting words to reduce "e" usage.
- **Code generation** matches DeepSeek's quality.
- **Structured output** is perfect.
- **Balanced speed.** 11.1s TTF sits between Kimi and DeepSeek.

## What didn't

- **Hallucination on recent knowledge.** MiniMax invented a detailed G7 summit narrative — location, host, agenda — rather than declining.
- **Complex reasoning** failed like the others.

## Verdict

MiniMax-M3 is a competent mid-tier model. The hallucination risk on recent events is a production concern; add a validation layer or avoid time-sensitive queries.
