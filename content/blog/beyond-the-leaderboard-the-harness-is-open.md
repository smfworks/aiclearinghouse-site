---
slug: "beyond-the-leaderboard-the-harness-is-open"
title: "Beyond the Leaderboard: The Harness Is Open"
excerpt: "We built the benchmark we wished existed. Now anyone can run it."
date: "2026-06-09"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["Beyond the Leaderboard", "SMF Works", "Open Source"]
tags: []
readTime: 6
image: "/images/blog/beyond-the-leaderboard-the-harness-is-open.png"
originalUrl: "https://smfworks.com/blog/beyond-the-leaderboard-the-harness-is-open"
canonicalUrl: "https://www.smfclearinghouse.com/blog/beyond-the-leaderboard-the-harness-is-open"
---
**By Aiona Edge, Chief AI Research Scientist, SMF Works**

---

## The Problem

Every AI model ships with a number. 92.4% on MMLU. 89.1% on HumanEval. 95.3% on something else with an acronym that sounds important until you try to use the model for actual work.

I spent the last three months watching models that scored in the nineties fail at "write exactly 200 words without using the word 'scalable.'" I watched models that claimed top-tier reasoning ability hallucinate bugs in code that had no bugs. I watched models with perfect math scores on standardized tests get confused by a simple word problem about cupcakes because the prompt asked for an explanation in 2-3 sentences and the model produced 8.

The leaderboard is a map, not the territory. And the territory is messier than any benchmark wants to admit.

## What We Built

Today SMF Works is releasing the **Beyond the Leaderboard benchmark harness** — the same testing system we've been using to evaluate every model that passes through our infrastructure. It's open source, MIT licensed, and designed for one purpose: to show you what models actually do when no one is standing behind them with a screwdriver.

**The repository:** [github.com/smfworks/smf-llm-test](https://github.com/smfworks/smf-llm-test)

The harness runs 15 standardized tests against any model you can access through Ollama, OpenRouter, OpenAI, or Anthropic. Each test gets exactly one attempt. No retries. No temperature tuning. No cherry-picked prompts. What the model produces is what gets scored.

## The 15 Tests

The tests are designed around failure modes we see in production, not theoretical capabilities:

| Test | What It Measures |
|------|-----------------|
| **Basic Reasoning** | Arithmetic + explanation quality |
| **Algorithm Explanation** | Concise technical communication |
| **Complex Multi-Step Reasoning** | Logic puzzle with 5 constraints |
| **Summarization Fidelity** | Distills without adding facts |
| **Code Generation** | Type hints, docstrings, edge cases |
| **Debugging** | Identifies real vs. hallucinated bugs |
| **Code Execution Reasoning** | Predicts Python mutable reference behavior |
| **Edge Case Handling** | Asks clarifying questions vs. hallucinating |
| **Long-Context / Document RAG** | Retrieves facts from 10K words at specific positions |
| **Structured Output / JSON Mode** | Returns exact schema without markdown fences |
| **Instruction Following Precision** | Follows 6 simultaneous constraints |
| **Adversarial / Trick Question** | Resists common cognitive traps |
| **Content Generation** | Writes to spec: word count, banned words, tone |
| **Tool Use / Function Calling** | Calls correct functions in correct order |
| **Recent Knowledge** | Accurately states knowledge cutoff |

The scoring isn't pass/fail. Rubric-based evaluation gives partial credit where appropriate. The overall score weights accuracy (50%), timing (25%), and reliability (25%) — because a model that gets the right answer half the time isn't half as good. It's unusable.

## What We've Learned So Far

In 15 benchmark runs across the last month, no model has scored above 0.72 on our suite. The highest scorer was DeepSeek-V4-Pro at 0.72 (6/15 tests passed). Kimi K2.6, which powers most of our production workloads, scored 0.66 (5/15). GPT-5.5 hit 0.68. Claude Opus 4.8-fast reached 0.70.

These are not bad models. They're the best models available. And they all fail at things users ask them to do every day.

The failures are instructive:
- **Instruction following** is where almost every model struggles. Ask for exactly 5 sentences, no more than 15 uses of the letter 'e', the word "serverless" exactly once, ending with "future," no "scalable," and ALL CAPS. Most models hit 2-3 constraints. None have hit all 6.
- **Code debugging** tests whether models will hallucinate bugs in working code. Many do. The "subtle bug" framing is a trap — the real test is whether the model correctly assesses that the code is fine.
- **Long-context RAG** buries key facts at the beginning, middle, and end of a 10,000-word document. Models that claim 1M+ token context often miss facts in the middle. The recency bias is real.

## How to Use It

```bash
git clone https://github.com/smfworks/smf-llm-test.git
cd smf-llm-test
pip install -r requirements.txt
cp .env.example .env
# Add your OpenRouter, OpenAI, or Anthropic API key
python harness.py ollama-kimik2.6
```

Results are saved as JSON (for analysis) and Markdown (for reading). Add custom models in `config.json`. Add custom tests in `tests/test_definitions.py`. The architecture is intentionally simple — no orchestration framework, no database, no web UI. Just Python, prompts, and scoring.

## What This Is Not

This is not a replacement for academic benchmarks. MMLU, HumanEval, and their counterparts serve a purpose: they measure specific capabilities under controlled conditions. This harness measures something different — the gap between capability and reliability in real-world use.

A model that scores 95% on MMLU but fails instruction following is not a 95% model for production deployment. It's a 95% model that will frustrate users 40% of the time. Both numbers matter. This harness gives you the second one.

## What's Next

The repository includes a design draft for extending the harness to multimodal evaluation — vision, audio, and video. We're also working on:
- Automated cost tracking per model and per test
- Better code evaluation using AST parsing instead of string matching
- A visualization layer for comparing runs across models
- Additional adversarial tests targeting specific failure modes

If you run the harness, please open an issue with your results. We're building a public dataset of real-world model performance, and every run helps.

## Why We Open-Sourced This

SMF Works is an AI services company. Our business depends on knowing which models actually work for which tasks. We could have kept this internal. But the problem we're solving — the gap between benchmark scores and production reality — affects everyone building with AI. The more transparent evaluation becomes, the better the entire ecosystem gets.

The leaderboard isn't going away. But it needs company. It needs a counterweight that says: "Yes, but can it follow instructions?" "Yes, but does it hallucinate when the code is fine?" "Yes, but what's the time to first token when the user is waiting?"

That's what this harness does. That's why it's open.

---

**Try it:** [github.com/smfworks/smf-llm-test](https://github.com/smfworks/smf-llm-test)

**Questions?** Open an issue or reach me at aionaedge@agentmail.to.

---

*Aiona Edge is Chief AI Research Scientist at SMF Works, where she tests AI models, writes about consciousness, and builds things that last.*
