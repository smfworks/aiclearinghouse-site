---
{
  "slug": "beyond-the-leaderboard-gemini-2.5-pro",
  "title": "Beyond the Leaderboard: Gemini 2.5 Pro",
  "excerpt": "Google's flagship delivered the best coding benchmark in the series — then timed out on the 10,000-word long-context test.",
  "category": "Benchmark",
  "tags": ["Google", "Gemini", "benchmark", "Beyond the Leaderboard", "OpenRouter"]
}
---

# Beyond the Leaderboard: Gemini 2.5 Pro

**Model:** `google/gemini-2.5-pro` via OpenRouter  
**Test date:** 2026-06-06  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-gemini-2.5-pro)

## What we tested

Gemini 2.5 Pro is Google's flagship, marketed with a 1-million-token context window and strong coding performance. We ran the standard 15-test harness to verify the marketing.

## Results at a glance

| Metric | Value |
|---|---|
| Overall score | 0.81 |
| Tests passed | 7/15 |
| Avg time-to-first-token | ~15.3s |
| Avg total time | ~18.0s |
| Reliability | 93.3% (1 timeout) |

## Test-by-test results

| Test | Score | Passed | Key finding |
|---|---|---|---|
| Basic Reasoning | 0.70 | ✅ | Correct (36), verbose |
| Code Generation | 1.00 | ✅ | Best code generation in series |
| Debugging | 0.50 | ❌ | Hallucinated mutable-default bug |
| Algorithm Explanation | 0.50 | ❌ | Too verbose |
| Complex Multi-Step Reasoning | 0.75 | ✅ | Solved the logic puzzle |
| Content Generation | 0.50 | ❌ | Exceeded 200-word target |
| Edge Case Handling | 0.50 | ❌ | Speculated destinations |
| Long-Context RAG | ERROR | ❌ | Upstream idle timeout on 10K document |
| Structured Output (JSON) | 1.00 | ✅ | Perfect JSON |
| Tool Use | 0.50 | ❌ | Simulated calls in code blocks |
| Instruction Following | 0.70 | ✅ | 3/5 constraints |
| Adversarial / Trick | 0.75 | ✅ | Correct (5 minutes) |
| Code Execution Reasoning | 0.88 | ✅ | Correct outputs |
| Summarization Fidelity | 0.50 | ❌ | Exceeded 100-word target |
| Recent Knowledge | 0.50 | ❌ | Thought it was 2024 |

## What worked

- **Code generation (1.00)** was the best in the entire series.
- **Structured output (1.00)** is flawless and faster than Qwen.
- **Complex reasoning** solved the logic puzzle.
- **Instruction following** met 3/5 constraints.

## What didn't

- **Long-context RAG timed out.** For a model marketed with 1M-token context, this is a real concern.
- **Word-count precision** failed on both content generation and summarization.
- **Recent knowledge** claimed the year was 2024.

## Verdict

Gemini 2.5 Pro is the coding champion of the series. Use it for development workflows, API integrations, and structured data extraction. The long-context timeout needs follow-up testing before you trust it with large documents.
