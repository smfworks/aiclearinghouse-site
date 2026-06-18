---
{
  "slug": "beyond-the-leaderboard-nex-n2-pro",
  "title": "Beyond the Leaderboard: Nex N2 Pro",
  "excerpt": "A surprise free-tier model matched leaders on JSON and code execution — then hallucinated an entire article summary.",
  "category": "Benchmark",
  "tags": ["Nex AGI", "Nex N2 Pro", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: Nex N2 Pro

**Model:** `nex-agi/nex-n2-pro:free` via OpenRouter  
**Test date:** 2026-06-08  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-nex-n2-pro)

## What we tested

Nex N2 Pro appeared on OpenRouter's free tier with no launch announcement. We tested it blind against the standard 15-test harness.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.62 |
| Tests passed | 7/15 |
| Avg time-to-first-token | ~30.8s |
| Avg total time | ~54.2s |
| Reliability | 93.3% (1 abort) |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36), clean steps |
| Code Generation | 0.70 | ✅ | Compiled, typed, docstring |
| Debugging | 0.50 | ❌ | Correctly said no bug, slow (275s) |
| Algorithm Explanation | 0.65 | ✅ | Good content, missed sentence count |
| Complex Multi-Step Reasoning | 0.25 | ❌ | Wrong answer, very slow (253s) |
| Content Generation | 0.50 | ❌ | Wrong word count, banned word |
| Edge Case Handling | 0.50 | ❌ | Made assumptions |
| Long-Context RAG | 0.50 | ❌ | Partial recall |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Invented wrong function names |
| Instruction Following | 0.70 | ✅ | 2/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Hallucinated entirely different article |
| Recent Knowledge | ERROR | ❌ | OpenRouter request aborted |

## What worked

- **Structured output (1.00)** matched the established leaders.
- **Code execution reasoning (0.88)** is strong.
- **Instruction following (0.70)** shows it engages with constraints.
- **Adversarial / trick** is correct and fast.

## What didn't

- **Hallucinated a complete article.** Asked to summarize AI's environmental impact, Nex summarized a fictional IonQ quantum-computing announcement.
- **Very slow on hard tests.** Debugging took 275s; complex reasoning took 253s.
- **Tool use** invented wrong function names.
- **Recent knowledge test aborted.**

## Verdict

Nex N2 Pro shows flashes of capability, especially for free-tier usage. The summarization hallucination is a hard blocker for document-processing workflows. Treat it as an experimental model, not a production default.
