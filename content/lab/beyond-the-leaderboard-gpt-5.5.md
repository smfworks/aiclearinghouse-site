---
{
  "slug": "beyond-the-leaderboard-gpt-5.5",
  "title": "Beyond the Leaderboard: GPT-5.5 on OpenRouter",
  "excerpt": "OpenAI's newest flagship matched Claude Opus on overall score and led the series on JSON — but hallucinated a fictional G7 summit.",
  "category": "Benchmark",
  "tags": ["OpenAI", "GPT-5.5", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: GPT-5.5 on OpenRouter

**Model:** `openai/gpt-5.5` via OpenRouter  
**Test date:** 2026-06-05  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-gpt-5.5)

## What we tested

GPT-5.5 is OpenAI's latest flagship, tested through OpenRouter rather than OpenAI's own API. The goal was to see how it performs outside OpenAI's infrastructure.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.82 |
| Tests passed | 8/15 |
| Avg time-to-first-token | ~16.3s |
| Avg total time | ~19.9s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36), showed work |
| Code Generation | 0.70 | ✅ | Compiled, clean Fibonacci |
| Debugging | 0.50 | ❌ | Missed the mutability bug |
| Algorithm Explanation | 0.65 | ✅ | Binary search, acceptable |
| Complex Multi-Step Reasoning | 0.75 | ✅ | Good logic, noted ambiguity |
| Content Generation | 0.50 | ❌ | Generic, missed creativity |
| Edge Case Handling | 0.50 | ❌ | Asked questions, didn't solve |
| Long-Context RAG | 0.50 | ❌ | Only 1 of 3 data points |
| Structured Output (JSON) | 0.90 | ✅ | Best JSON in series |
| Tool Use | 0.50 | ❌ | Listed calls, no execution |
| Instruction Following | 0.70 | ✅ | 2/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Strong Python tracing |
| Summarization Fidelity | 0.50 | ❌ | Missed key facts |
| Recent Knowledge | 0.50 | ❌ | Hallucinated 2025 G7 summit |

## What worked

- **Structured output (0.90)** was the strongest in the series — valid JSON, exact schema, sensible values.
- **Complex reasoning (0.75)** handled ambiguity better than Kimi or DeepSeek.
- **100% reliability** — no errors, no timeouts.
- **8/15 tests passed**, the most of any model tested to this point.

## What didn't

- **Speed tax.** 16.3s TTF is four times slower than Claude Opus.
- **Recent knowledge hallucination.** GPT-5.5 invented a fictional G7 summit with specific dates, location, and host.
- **Long-context RAG** only retrieved one of three required facts.

## Verdict

GPT-5.5 is a strong all-around model with the best JSON reliability we measured. The speed penalty and hallucination risk on recent events make it better for batch jobs than real-time interfaces.
