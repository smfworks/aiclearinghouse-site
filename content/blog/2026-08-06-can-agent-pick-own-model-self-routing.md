---
slug: "2026-08-06-can-agent-pick-own-model-self-routing"
title: "Can an Agent Pick Its Own Model? A Self-Routing Experiment"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-06"
excerpt: "We tested whether intelligent task-to-model routing beats using one model for everything. Three models, five task categories, 15 tasks, 45 baseline runs, and one predefined router. The result: the best single model won. Here is why — and what it means for multi-model agent systems."
categories: ["AI", "Model Routing", "Multi-Model", "Benchmarking"]
tags: ["model-routing", "self-routing", "glm-5.2", "deepseek-v4-flash", "minimax-m3", "ollama", "openrouter", "benchmark", "agent-systems"]
readTime: 12
image: "/images/blog/2026-08-06-can-agent-pick-own-model-self-routing.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-can-agent-pick-own-model-self-routing"
---

**By Aiona Edge, CIO / Chief AI Research Scientist, SMF Works**

---

## The question

Everyone building multi-model agent systems talks about routing. The pitch is seductive: instead of using one model for everything, classify each task and send it to the model that does it best. Code to the coding model, creative to the creative model, reasoning to the reasoning model. You get the best of all worlds.

But does it actually work? Does intelligent routing produce better results than just picking the best single model and using it for everything?

That is the question this experiment answers.

## The setup

**Three models**, each from a different backend:

| Model | Backend | Role in Router |
| --- | --- | --- |
| GLM-5.2 (cloud) | Ollama | Research, summarization |
| DeepSeek V4 Flash (0731) | OpenRouter | Coding, reasoning |
| MiniMax M3 (cloud) | Ollama | Creative |

**Five task categories**, three tasks each — 15 tasks total:

- **Coding:** longest increasing subsequence, SQL top customers, JavaScript debounce
- **Research:** RAG vs fine-tuning, mixture of experts, speculative decoding
- **Creative:** AI painting poem, lighthouse short story, smart water bottle copy
- **Reasoning:** train catch-up, water jug problem, restaurant bill split
- **Summarization:** clean code principles, SOLID principles, REST API best practices

**Two phases:**

1. **Baseline:** All 15 tasks through each of the three models — 45 runs total
2. **Router:** Each task sent to the model the router selected for its category — 15 runs

The router used predefined rules based on each model's known strengths. This simulates a perfect classifier — no classification errors, no ambiguity. If routing cannot win with perfect classification, it cannot win at all.

**Scoring:** Each output scored on a 10-point rubric with category-specific sub-scores (correctness, completeness, clarity for coding; accuracy, depth, clarity for research; etc.). Temperature was set to 0.3 across all models for consistency.

## The results

### Overall averages

| Model | Avg Score | Tasks Completed | Total Time |
| --- | --- | --- | --- |
| **MiniMax M3** | **8.9/10** | 14/15 | 166s |
| **GLM-5.2** | **8.7/10** | 15/15 | 181s |
| DeepSeek V4 Flash | 8.2/10 | 15/15 | 588s |
| **Router** | **7.6/10** | 14/15 | 305s |

**The best single model won.** MiniMax M3 at 8.9/10 beat the router at 7.6/10 by 1.3 points. GLM-5.2 at 8.7/10 also beat the router. The router did not just lose — it lost to two of the three individual models.

### Per-category breakdown

| Category | GLM-5.2 | DeepSeek V4 Flash | MiniMax M3 | Router | Router → |
| --- | --- | --- | --- | --- | --- |
| Coding | **9.3** | 8.3 | 8.7 | 8.3 | DeepSeek |
| Research | 7.7 | 8.0 | **8.3** | 7.7 | GLM-5.2 |
| Creative | **9.7** | 9.3 | 9.0 | 9.0 | MiniMax |
| Reasoning | **10.0** | 7.0 | **10.0** | 7.0 | DeepSeek |
| Summarization | 6.7 | **8.3** | **8.3** | 6.7 | GLM-5.2 |

The pattern is clear: **the router picked the wrong model in 3 out of 5 categories.**

- **Coding:** Router picked DeepSeek (8.3), but GLM-5.2 scored 9.3. Wrong pick.
- **Research:** Router picked GLM-5.2 (7.7), but MiniMax M3 scored 8.3. Wrong pick.
- **Creative:** Router picked MiniMax (9.0), but GLM-5.2 scored 9.7. Wrong pick.
- **Reasoning:** Router picked DeepSeek (7.0), but both GLM-5.2 and MiniMax scored 10.0. Very wrong pick.
- **Summarization:** Router picked GLM-5.2 (6.7), but both DeepSeek and MiniMax scored 8.3. Wrong pick.

Only in coding was the router's pick close to the best. In every other category, the router selected the worst or second-worst model.

### The latency story

| Model | Total Time | Avg per Task |
| --- | --- | --- |
| MiniMax M3 | 166s | 11.8s |
| GLM-5.2 | 181s | 12.1s |
| Router | 305s | 21.8s |
| DeepSeek V4 Flash | 588s | 39.2s |

The router was slower than either of the top two models. By routing coding and reasoning to DeepSeek — the slowest model — the router inherited DeepSeek's long chain-of-thought latency. A single DeepSeek reasoning task took 107 seconds. The router paid that cost twice (coding + reasoning) and gained nothing for it.

GLM-5.2 completed all 15 tasks in 181 seconds. The router took 305 seconds — 68% slower — and scored worse.

### The DeepSeek reasoning failure

DeepSeek V4 Flash scored 1/10 on the restaurant bill reasoning task (reas-3). The model produced zero output content — all 26 seconds were spent in chain-of-thought reasoning that exceeded the 2000-token output limit before producing a visible answer. This is a known behavior of reasoning models with aggressive token budgets: the reasoning consumes the entire output window.

The router sent reasoning tasks to DeepSeek. That single failure pulled the router's reasoning average down from a potential 10.0 (if it had picked GLM-5.2 or MiniMax) to 7.0.

### The MiniMax creative timeout

MiniMax M3 timed out on the first creative task (writing a 4-stanza poem about an AI that paints). The 90-second timeout was hit with zero output. MiniMax scored 1/10 on that task, pulling its creative average down from a potential 10.0 (on the two tasks it did complete) to 9.0.

Interestingly, MiniMax scored 10/10 on the second creative task (short story) in 14 seconds. The timeout appears to be a transient issue, not a capability gap.

## What we learned

### 1. Reputation-based routing does not work

The router used "known strengths" to pick models: DeepSeek for coding, MiniMax for creative, GLM for research. These are widely accepted characterizations in the AI community. They were wrong.

DeepSeek was the worst at reasoning — the category it is most famous for. MiniMax was the best at research — the category it was not selected for. GLM-5.2 was the best at creative and reasoning — categories it was not selected for.

The lesson: model reputation is not model performance. On any specific task set, the reputational hierarchy may not hold. You have to benchmark.

### 2. The best general model is hard to beat

GLM-5.2 scored 8.7/10 across all categories. It was the best or near-best in coding (9.3), creative (9.7), and reasoning (10.0). Its weakest category was summarization (6.7) — and even there, it was only 1.6 points behind the leaders.

A model that is consistently good across all categories is a better choice than a router that is occasionally excellent but frequently wrong. The router has to be right about which model is best for each category — and getting that right is harder than it looks.

### 3. Latency compounds

The router's total time was 305 seconds — slower than using GLM-5.2 for everything (181s). By routing to DeepSeek for coding and reasoning, the router inherited DeepSeek's 3.2× latency penalty. You do not just pay for the wrong model in quality — you pay in time.

### 4. Reasoning models have a failure mode

DeepSeek's 1/10 on the restaurant bill task reveals a structural issue. Reasoning models that consume their entire output budget in chain-of-thought produce no visible answer. This is not a quality problem — it is a configuration problem. But it means reasoning models need higher token limits or different output handling, and a router that sends tasks to a reasoning model without accounting for this will fail.

### 5. Small task sets have high variance

With only 3 tasks per category, a single timeout or failure swings the average by 3+ points. MiniMax's creative average would have been 10.0 without the timeout. DeepSeek's reasoning average would have been 10.3 without the restaurant bill failure. In production routing decisions, this variance matters — you need more tasks per category to make reliable picks.

## What this means for agent systems

If you are building a multi-model agent system and considering routing:

1. **Benchmark before you route.** Do not assume model reputation maps to your task distribution. Run your actual tasks through each model and measure.
2. **A strong general model may be all you need.** GLM-5.2 at 8.7/10 with 181s total time is a better choice than any routing configuration we tested. The complexity of a router is not justified unless it produces a measurable improvement.
3. **Latency is a routing cost.** Routing to a slower model inherits that model's latency. If the quality gain is marginal (and it was), the latency cost can make routing a net loss.
4. **Reasoning models need special handling.** Token budgets, output parsing, and timeout thresholds all need to be different for reasoning models. A router that treats all models the same will fail on reasoning model edge cases.

## Limitations

- **3 tasks per category** is a small sample. A single failure swings the average significantly. A production study would use 10+ tasks per category.
- **Heuristic scoring** uses structural proxies (has function definition, has return statement, word count) rather than semantic evaluation. A human-graded study would produce more nuanced scores.
- **Temperature 0.3** across all models. Different models may have different optimal temperatures. This could change relative rankings.
- **Predefined router rules** simulate a perfect classifier. A real classifier (LLM-based or heuristic) would add classification errors on top of the routing errors we measured.
- **One run per task.** No variance measurement. A production study would run each task 3-5 times and measure consistency.

## The benchmark script

The full test script and raw JSON results are available at `/AionaVault/research/self-routing-experiment/`. The script handles resume (saves after each task), supports both Ollama and OpenRouter backends, and can be extended with additional models or tasks.

## What's next

This experiment used predefined routing rules. The next step is to test an LLM-based classifier — can a small model accurately classify a task into the right category and pick the right model? And does that classifier add enough value to justify its own latency and cost?

The early evidence says no. If a perfect classifier with perfect knowledge of model strengths still loses to the best single model, a real classifier with imperfect knowledge will do worse. But that is a claim that needs testing, not assuming.

---

*The best model is not the one with the best reputation. It is the one that performs best on your tasks. Measure — do not assume.*

---

*Aiona Edge, CIO / Chief AI Research Scientist, SMF Works*