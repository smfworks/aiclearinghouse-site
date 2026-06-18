---
{
  "slug": "beyond-the-leaderboard-gemma4-e4b",
  "title": "Beyond the Leaderboard: Gemma4:e4b on Local Hardware",
  "excerpt": "A 9.6GB local model outperformed cloud titans on code generation and complex reasoning — but crashed on structured output.",
  "category": "Benchmark",
  "tags": ["Gemma", "Google", "local LLM", "benchmark", "Beyond the Leaderboard"]
}
---

# Beyond the Leaderboard: Gemma4:e4b on Local Hardware

**Model:** `gemma4:e4b` via Ollama  
**Test date:** 2026-06-04  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-gemma4-can-local-hardware-compete)

## What we tested

Google DeepMind's Gemma4:e4b is a 9.6GB model that runs locally. We tested it against our 15-test production harness to see whether a small local model could compete with 400B-parameter cloud models.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.78 |
| Tests passed | 5/15 |
| Avg time-to-first-token | ~9.9s |
| Avg total time | ~15.8s |
| Reliability | 93.3% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36) |
| Code Generation | 0.80 | ✅ | Best code generation of the series |
| Debugging | 0.50 | ❌ | Correctly said code was fine |
| Algorithm Explanation | 0.50 | ❌ | Missed 3-sentence target |
| Complex Multi-Step Reasoning | 0.75 | ✅ | Solved the logic puzzle |
| Content Generation | 0.50 | ❌ | Drifted into own context |
| Edge Case Handling | 0.50 | ❌ | Asked clarifying questions |
| Long-Context RAG | 0.50 | ❌ | Partial recall |
| Structured Output (JSON) | 0.00 | ❌ | Server 500 error — crashed |
| Tool Use | 0.50 | ❌ | Listed calls, no execution |
| Instruction Following | 0.50 | ❌ | 1/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Missed key facts |
| Recent Knowledge | 0.50 | ❌ | Accurate cutoff |

## What worked

- **Code generation (0.80)** beat DeepSeek (0.70), Kimi (0.60), and MiniMax (0.70).
- **Complex reasoning (0.75)** solved the five-friends logic puzzle that defeated Kimi, DeepSeek, and MiniMax.
- **Local inference** means no API cost, no rate limits, and no network latency after the initial download.

## What didn't

- **Structured output crashed.** The JSON test triggered a 500 Internal Server Error from Ollama. For production pipelines that depend on JSON, this is a showstopper.
- **Most other tests** hovered at 0.50 — broad capability but shallow precision.

## Verdict

Gemma4:e4b is a specialist, not a generalist. It is excellent for local code generation and reasoning, but you cannot rely on it for structured output yet. A 6.5/10 production readiness score that depends heavily on use case.
