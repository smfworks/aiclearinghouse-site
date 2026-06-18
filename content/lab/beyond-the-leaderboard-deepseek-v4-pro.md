---
{
  "slug": "beyond-the-leaderboard-deepseek-v4-pro",
  "title": "Beyond the Leaderboard: DeepSeek-V4-Pro",
  "excerpt": "A thinking model that negotiates constraints and writes clean code — but carries an 8× speed penalty versus Kimi.",
  "category": "Benchmark",
  "tags": ["DeepSeek", "benchmark", "Beyond the Leaderboard", "Ollama Cloud", "reasoning"]
}
---

# Beyond the Leaderboard: DeepSeek-V4-Pro

**Model:** `ollama/deepseek-v4-pro:cloud`  
**Test date:** 2026-06-02  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-deepseek-v4-pro)

## What we tested

DeepSeek-V4-Pro is the model SMF Works reaches for when a task needs careful reasoning. As a "thinking" model it emits an internal chain-of-thought before answering. We ran the same 15-test production harness to see whether the extra time translated into better results.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.72 |
| Tests passed | 6/15 |
| Avg time-to-first-token | ~17.5s |
| Avg total time | ~35s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct, verbose |
| Code Generation | 0.70 | ✅ | Clean, typed, good edge handling |
| Debugging | 0.50 | ❌ | Correctly said code was fine |
| Algorithm Explanation | 0.35 | ❌ | 2 long sentences, missed 3-sentence target |
| Complex Multi-Step Reasoning | 0.25 | ❌ | Wrong answer, hit token limit |
| Content Generation | 0.50 | ❌ | Drifted into operational context |
| Edge Case Handling | 0.50 | ❌ | Asked clarifying questions |
| Long-Context RAG | 0.50 | ❌ | Got McKinsey stat, missed attribution |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Listed calls, no execution |
| Instruction Following | 0.70 | ✅ | 2/5 constraints met |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Missed key facts |
| Recent Knowledge | 0.50 | ❌ | Accurate May 2025 cutoff |

## What worked

- **Instruction following** is the standout win. DeepSeek scored 0.70 versus Kimi's 0.50 by visibly negotiating constraints (substituting words to reduce "e" usage).
- **Code generation** is production-ready, slightly cleaner than Kimi.
- **JSON output** is perfect.
- **Calibration on knowledge cutoff** is honest — it correctly stated May 2025.

## What didn't

- **Speed.** 17.5s TTF is 8× slower than Kimi. Conversational or real-time use is painful.
- **Complex reasoning** still hit the token limit without converging.
- **Algorithm explanation** was worse than Kimi because it produced dense, run-on sentences.

## Verdict

Use DeepSeek-V4-Pro when precision matters more than speed: research synthesis, careful code review, or prompts with multiple simultaneous constraints. Do not use it for real-time interfaces or cron jobs that collide.
