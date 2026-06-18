---
{
  "slug": "beyond-the-leaderboard-one-week",
  "title": "Beyond the Leaderboard: One Week of Testing",
  "excerpt": "Ten models, fifteen tests each, 150 production evaluations. The brutal truth: there is no best model, only a best-fit model.",
  "category": "Benchmark",
  "tags": ["benchmark", "Beyond the Leaderboard", "leaderboard", "SMF Works"]
}
---

# Beyond the Leaderboard: One Week of Testing

**Scope:** 10 frontier models × 15 tests = 150 evaluations  
**Test period:** June 1–8, 2026  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-one-week-of-testing)

## The mission

The goal was to test AI models the way users actually use them: real prompts, real rubrics, single attempts, no retries. Not sanitized benchmarks where every model claims state-of-the-art.

## Final leaderboard

| Rank | Model | Overall | Passed | Avg TTF | Best At | Weakness |
|---:|---|---|---:|---:|---|---|
| 1 | **Gemma 4 26B** | **0.82** | 7/15 | **0.8s** | Speed + reliability | Content generation |
| 2 | **GPT-5.5** | 0.75 | 8/15 | 15.3s | Balanced all-around | Long-context RAG |
| 3 | **Claude Opus 4.8 Fast** | 0.73 | 7/15 | 1.4s | Precision + speed | Instruction following |
| 4 | **Qwen 3.7-Max** | 0.74 | 8/15 | 31.0s | Structured output | Speed tax |
| 5 | **DeepSeek-V4-Pro** | 0.72 | 6/15 | 17.5s | Reasoning depth | Speed + tool use |
| 6 | **MiniMax M3** | 0.63 | 4/15 | 11.1s | Mid-tier balance | No standout wins |
| 7 | **Kimi K2.6** | 0.66 | 5/15 | 2.2s | Daily driver speed | Precision tasks |
| 8 | **Nemotron 3 Ultra** | 0.57 | 4/15 | 16.8s | Parameter scale | Underperforms vs size |
| 9 | **Gemma 4 (local)** | 0.51 | 3/15 | 9.9s | Budget local option | Stability issues |
| 10 | **StepFun Step-3.7-Flash** | 0.48 | 3/15 | 9.1s | Reasoning visibility | Harness mismatch |

## The test suite

1. Basic Reasoning
2. Code Generation
3. Debugging
4. Algorithm Explanation
5. Complex Multi-Step Reasoning
6. Content Generation
7. Edge Case Handling
8. Long-Context RAG
9. Structured Output (JSON)
10. Tool Use
11. Instruction Following
12. Adversarial / Trick
13. Code Execution Reasoning
14. Summarization
15. Recent Knowledge

**Scoring:** 0.0–1.0 per test, averaged. "Passed" = ≥ 0.60. Single attempt, no retries.

## Key findings

- **The top four are within 0.09 points.** "Best" depends on what you value — speed, cost, reasoning, or precision.
- **No model is a universal default.** Each frontier model has at least one hard failure mode.
- **Instruction following is the hardest test.** Even top models often miss sentence counts, word counts, or banned words.
- **Long-context RAG is inconsistent.** Several models timed out or retrieved only partial facts.
- **JSON output is now table stakes.** Most frontier models score 1.00 on structured output.

## How to choose

| If you need... | Consider... |
|---|---|
| Fast, reliable API responses | Gemma 4 26B, Claude Opus 4.8 Fast |
| Best raw coding | Gemini 2.5 Pro, Claude Opus 4.8 Fast |
| Strict constraint following | Qwen 3.7-Max, DeepSeek-V4-Pro |
| Long-document reasoning | DeepSeek-V4-Pro, Qwen 3.7-Max |
| Cheap local inference | Gemma 4 12B/31B, but test stability first |
| Multimodal perception | Test each model on your actual visual inputs |

## What this means

Stop asking "what is the best model?" Start asking "what is the best model for this specific task, under these constraints, at this budget?"
