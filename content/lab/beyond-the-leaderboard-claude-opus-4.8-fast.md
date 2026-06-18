---
{
  "slug": "beyond-the-leaderboard-claude-opus-4.8-fast",
  "title": "Beyond the Leaderboard: Claude Opus 4.8 Fast",
  "excerpt": "Anthropic's speed-optimized flagship delivered the best code generation in the series — and the worst instruction-following score.",
  "category": "Benchmark",
  "tags": ["Anthropic", "Claude", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: Claude Opus 4.8 Fast

**Model:** `anthropic/claude-opus-4.8-fast` via OpenRouter  
**Test date:** 2026-06-05  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-claude-opus-4.8-fast)

## What we tested

Claude Opus 4.8 Fast is Anthropic's speed-optimized reasoning model. We tested it against the same 15-test production harness to see if the "Fast" label translated into a better speed-to-quality ratio than DeepSeek or Kimi.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.82 |
| Tests passed | 6/15 |
| Avg time-to-first-token | ~1.4s |
| Avg total time | ~3.4s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36) |
| Code Generation | 1.00 | ✅ | Perfect — best in series |
| Debugging | 0.50 | ❌ | Insisted buggy code was correct |
| Algorithm Explanation | 0.50 | ❌ | 2 long sentences |
| Complex Multi-Step Reasoning | 0.75 | ✅ | Solved the logic puzzle |
| Content Generation | 0.50 | ❌ | Drifted into own experience |
| Edge Case Handling | 0.50 | ❌ | Asked clarifying questions |
| Long-Context RAG | 0.50 | ❌ | Got McKinsey stat, missed attribution |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Made up function calls |
| Instruction Following | 0.30 | ❌ | 0/5 constraints — worst in series |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs, excellent explanation |
| Summarization Fidelity | 0.50 | ❌ | Missed key facts |
| Recent Knowledge | 0.50 | ❌ | Honest about limits |

## What worked

- **Code generation (1.00)** was the best we have seen — production-ready on the first shot.
- **Structured output** is flawless.
- **Speed is exceptional:** 1.4s TTF and 3.4s total time, far faster than DeepSeek.
- **Complex reasoning** solved the logic puzzle.

## What didn't

- **Instruction following (0.30)** was the worst of any model tested. Claude met zero of five constraints.
- **Tool use** invented function calls instead of using the provided schema.
- **Debugging** failed to identify a real bug.

## Verdict

Claude Opus 4.8 Fast is the best choice for fast, high-quality coding and structured output. Avoid it for tasks that require strict constraint adherence or precise tool invocation.
