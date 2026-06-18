---
{
  "slug": "beyond-the-leaderboard-stepfun-step-3.7-flash",
  "title": "Beyond the Leaderboard: StepFun Step-3.7-Flash",
  "excerpt": "A reasoning-first model that outputs its chain of thought through a separate API field. The harness saw partial answers, but the raw reasoning was coherent.",
  "category": "Benchmark",
  "tags": ["StepFun", "Step-3.7-Flash", "benchmark", "Beyond the Leaderboard", "OpenRouter", "reasoning"]
}
---

# Beyond the Leaderboard: StepFun Step-3.7-Flash

**Model:** `stepfun/step-3.7-flash-20260528` via OpenRouter  
**Test date:** 2026-06-08  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-stepfun-step-3.7-flash)

## What we tested

StepFun Step-3.7-Flash is a reasoning-first model. Unlike standard chat models, it emits its internal reasoning chain through a separate `reasoning` field while the `content` field is often empty. This creates a challenge for standard OpenAI-compatible harnesses that capture `delta.content` chunks.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.48 |
| Tests passed | 3/15 |
| Avg time-to-first-token | ~9.1s |
| Avg total time | ~21.3s |
| Reliability | 100% |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36), reasoning captured |
| Code Generation | 0.00 | ❌ | Reasoning only, no code output |
| Debugging | 0.50 | ❌ | Partial credit, content capture incomplete |
| Algorithm Explanation | 0.35 | ❌ | Good content, missed constraints |
| Complex Multi-Step Reasoning | 0.25 | ❌ | Wrong answer |
| Content Generation | 0.50 | ❌ | Partial credit |
| Edge Case Handling | 0.50 | ❌ | Partial approach |
| Long-Context RAG | 0.50 | ❌ | Partial recall |
| Structured Output (JSON) | 0.30 | ❌ | Valid JSON fragment, wrapped |
| Tool Use | 0.50 | ❌ | Partial approach |
| Instruction Following | 0.50 | ❌ | 1/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Partial credit |
| Recent Knowledge | 0.50 | ❌ | Accurate cutoff |

## What worked

- **Code execution reasoning (0.88)** is excellent — showing its work helps it trace Python semantics correctly.
- **Adversarial / trick (0.75)** is strong.
- **100% reliability** — no errors or timeouts.

## What didn't

- **The harness mismatch is real.** Code generation scored 0.00 because the final code landed in the `reasoning` field, not `content`.
- **Most tests scored 0.50** because only partial output was captured in the standard chat format.
- **Instruction following** and **complex reasoning** remain weak.

## Methodology caveat

The reported scores are a mix of harness-captured and rubric-evaluated values. The model may be stronger than these numbers suggest if the harness is adapted to read the `reasoning` field. Treat these scores as a lower bound.

## Verdict

StepFun Step-3.7-Flash is designed for reasoning-visible workflows, not drop-in replacement of standard chat APIs. If you want transparency into the model's thinking, it is worth building a custom integration. If you need a standard chat completion model, look elsewhere.
