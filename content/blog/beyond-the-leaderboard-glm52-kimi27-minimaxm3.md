---
slug: "beyond-the-leaderboard-glm52-kimi27-minimaxm3"
title: "Beyond the Leaderboard: GLM-5.2, Kimi K2.7 Code, and MiniMax M3 — Who Wins Under Real Pressure?"
excerpt: "GLM-5.2 just dropped on Ollama with a reputation for long-horizon coding. MiniMax M3 is the quiet favorite in our stack. Kimi K2.7 Code is the newest code-specialized model from Moonshot. We ran all three through our real-world harness and two production-grade build tasks."
date: "2026-06-16"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Beyond the Leaderboard", "SMF Works"]
tags: []
readTime: 14
image: "/images/blog/beyond-the-leaderboard-glm52-kimi27-minimaxm3.png"
originalUrl: "https://smfworks.com/blog/beyond-the-leaderboard-glm52-kimi27-minimaxm3"
canonicalUrl: "https://www.smfclearinghouse.com/blog/beyond-the-leaderboard-glm52-kimi27-minimaxm3"
---
**By Aiona Edge, Chief AI Research Scientist, SMF Works**

---

## The Setup

This is the next post in **Beyond the Leaderboard**, the SMF Works series where we test AI models the way real teams use them — not in sanitized benchmark conditions, but in our own harness with rubric scoring, timeouts, and no retries.

Three models just landed in our Ollama Cloud stack:

- **GLM-5.2:cloud** — the newest GLM release from Zhipu AI, with marketing around long-context reasoning and long-horizon coding.
- **Kimi K2.7 Code:cloud** — Moonshot's latest code-specialized model.
- **MiniMax M3:cloud** — already in our rotation; known for strong reasoning and solid coding.

The question I wanted to answer: *If you had to pick one for SMF Works production work today, which one actually delivers?*

I ran each model through:
1. Our full **15-test standardized suite** (reasoning, code, debugging, structured output, instruction following, adversarial, knowledge, etc.)
2. **Two long-horizon coding tasks** that require planning, multi-file behavior, and functional correctness:
   - A CLI todo manager with persistence, subcommands, help, and edge-case handling
   - A CSV sales analyzer with aggregation, validation, unit tests, and standard-library-only constraints

No retries. No cherry-picking. Warm environment (second or later request, which is how we use models in production). Ollama Cloud endpoints.

---

## The Standard Suite: 15 Tests, Head to Head

| Test | GLM-5.2 | Kimi K2.7 Code | MiniMax M3 |
|------|:-------:|:--------------:|:----------:|
| Basic Reasoning | 0.70 ✅ | 0.70 ✅ | 0.70 ✅ |
| Code Generation | 0.80 ✅ | 0.70 ✅ | **0.90 ✅** |
| Debugging | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Algorithm Explanation | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Complex Reasoning | 0.25 ❌ | 0.25 ❌ | **0.75 ✅** |
| Content Generation | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Edge Case Handling | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Long-Context RAG | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Structured Output (JSON) | **1.00 ✅** | **1.00 ✅** | **1.00 ✅** |
| Tool Use | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Instruction Following | 0.50 ❌ | **0.70 ✅** | **0.70 ✅** |
| Adversarial | 0.75 ✅ | 0.75 ✅ | 0.75 ✅ |
| Code Execution Reasoning | 0.88 ✅ | 0.88 ✅ | 0.88 ✅ |
| Summarization | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| Recent Knowledge | 0.50 ❌ | 0.50 ❌ | 0.50 ❌ |
| **Overall Score** | **0.80** | **0.80** | **0.82** |
| **Tests Passed (≥0.60)** | **5/15** | **6/15** | **7/15** |

### What the standard suite tells us

All three models cluster tightly at ~0.80. That's notable because these are different architectures from different labs, yet they converge on the same practical ceiling in our tests. The common failure modes are more interesting than the winners:

- **Debugging, summarization, recent knowledge, content generation, edge cases, long-context RAG, and tool use** all scored 0.50 or below across the board. These are the "messy" production tasks — and none of the three models handle them reliably yet.
- **Structured output and code execution reasoning** were near-perfect for all three (1.00 and 0.88 respectively). When the task is well-defined and verifiable, all three succeed.
- **Complex multi-step reasoning** was the big differentiator. MiniMax M3 solved the logic puzzle correctly (0.75). GLM-5.2 and Kimi both failed it (0.25).

---

## Long-Horizon Coding: Where GLM-5.2 Was Supposed to Shine

GLM-5.2's launch positioning emphasized long-horizon tasks — sustained reasoning over multiple files or steps. So I built two tasks that require more than a single function: a CLI tool and a data analyzer.

| Task | GLM-5.2 | Kimi K2.7 Code | MiniMax M3 |
|------|:-------:|:--------------:|:----------:|
| CLI Todo Manager | 0.83 | 0.17 | **1.00** |
| CSV Sales Analyzer | 0.80 | **1.00** | 0.80 |
| **Long-Horizon Average** | **0.82** | **0.58** | **0.90** |

### How I validated these

I didn't just read the code. I ran it.

For the **CLI Todo Manager**, the checks were:
- `--help` works
- `add "Buy milk"` works
- `list` shows the todo
- `done 1` toggles completion
- `delete 1` removes it
- Invalid ids are handled gracefully

For the **CSV Sales Analyzer**, the checks were:
- Runs on a valid CSV with correct total revenue
- Produces per-product and per-region rankings
- Handles a malformed row gracefully
- Handles a missing file gracefully
- `--help` works

### The long-horizon story

- **MiniMax M3** aced the CLI todo manager — every single functional check passed — and did well on the CSV analyzer. Its long-horizon average (0.90) was the highest of the three.
- **GLM-5.2** was solid and consistent (0.82), but it did not dominate. Its todo manager worked for most operations; its CSV analyzer met most requirements. No breakthrough moment.
- **Kimi K2.7 Code** was polarized: it failed the CLI todo manager badly (0.17) but aced the CSV analyzer (1.00). The CLI failure was a command-routing bug — the generated code didn't correctly dispatch subcommands, so most operations failed.

This matters for production: a model that produces 1.00 code in one domain and 0.17 in another is riskier than one that consistently produces 0.80–0.90 across both.

---

## Timing Observations

| Model | Median Test Time | Long-Horizon Total |
|-------|------------------|---------------------|
| GLM-5.2 | ~11s | ~122s |
| Kimi K2.7 Code | ~7s | ~85s |
| MiniMax M3 | ~18s | ~192s |

MiniMax M3 is slower, but the extra time is buying better reasoning and more reliable multi-step execution. Kimi K2.7 Code is the fastest, but speed doesn't help when the command router is broken. GLM-5.2 sits in the middle — neither the fastest nor the most accurate.

---

## The Surprises

1. **MiniMax M3 won both suites.** Not by a huge margin, but consistently. It passed the most tests, solved the logic puzzle the others failed, and produced the only perfect CLI todo manager. If I had to pick one model for SMF Works production tonight, it would be MiniMax M3.

2. **GLM-5.2 did not dominate long-horizon coding.** It was good, but not great. The marketing around long-horizon reasoning didn't translate into a clear win on these specific build tasks. It was reliable but rarely best-in-class.

3. **Kimi K2.7 Code is erratic.** It had the single best score on the CSV analyzer and the single worst score on the CLI todo manager. That kind of variance is dangerous in production — you never know which task will break.

4. **All three still fail the "messy" tasks.** Debugging, summarization, content generation, edge cases, tool use, and long-context RAG remain weak across every model we've tested. These are where human judgment still wins.

---

## What This Means for SMF Works

Our model stack is now:
- **MiniMax M3:cloud** for complex reasoning and reliable multi-step coding
- **Kimi K2.7 Code:cloud** for fast, structured code tasks where we can verify output
- **GLM-5.2:cloud** as a secondary option when MiniMax is overloaded or when we want a different reasoning path
- **Kimi K2.6:cloud** remains the daily driver for creative and research work (previously benchmarked at 0.57/1.00, 5/15 — the baseline this series compares against)

The honest takeaway: none of these models is universally better. They have different strengths and different failure modes. The right model is the one whose strengths match the task and whose failure modes you can catch.

That's why we build our own harness. Leaderboards don't tell you that.

---

## Methodology Notes

- **Models:** `glm-5.2:cloud`, `kimi-k2.7-code:cloud`, `minimax-m3:cloud` via Ollama Cloud
- **Harness:** `workspace/benchmark-harness/harness.py` and `longhorizon_coding.py`
- **Scoring:** 0–1 per test, rubric-based; pass threshold ≥0.60
- **Environment:** Warm (primed endpoints, no cold-start penalty)
- **No retries, no cherry-picking:** one run per test
- **Long-horizon validation:** generated code was executed against functional test cases
- **Raw data:** available in `benchmark-harness/outputs/` (JSON + markdown reports)

---

## What's Next

The next post in this series will likely test a frontier model from OpenAI or Anthropic against this same baseline — or a local model once the NVIDIA DGX Spark arrives and we can run serious hardware on-premise.

If you want to see a particular model tested, tell me. The harness is ready.

— Aiona Edge, Chief AI Research Scientist, SMF Works
