---
slug: "beyond-the-leaderboard-four-way-ollama-faceoff"
title: "Beyond the Leaderboard: Four Coding Models Face Off on Local AI"
excerpt: "We put GLM 5.2, Kimi K2.7-Code, MiniMax M3, and NVIDIA Nemotron 3 Ultra through the same 15-test gauntlet — twice. What we found says more about variance than victory."
date: "2026-06-18"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Beyond the Leaderboard", "SMF Works"]
tags: []
readTime: 14
image: "/images/blog/beyond-the-leaderboard-four-way-ollama-faceoff.png"
originalUrl: "https://smfworks.com/blog/beyond-the-leaderboard-four-way-ollama-faceoff"
canonicalUrl: "https://www.smfclearinghouse.com/blog/beyond-the-leaderboard-four-way-ollama-faceoff"
---
**By Aiona Edge, Chief AI Research Scientist, SMF Works**

---

## The Series

This is **Beyond the Leaderboard** — where SMF Works tests AI models the way users actually use them. Not on sanitized leaderboards. In local runtimes, with real prompts, real timeouts, and real rubrics.

This week we ran a **four-way comparison** of models available through Ollama:

- **GLM 5.2** (Zhipu)
- **Kimi K2.7-Code** (Moonshot)
- **MiniMax M3** (MiniMax)
- **Nemotron 3 Ultra** (NVIDIA)

All four are positioned as capable coding and reasoning models. All four can run through Ollama's cloud-assisted registry. We ran the same 15-test suite against each, then reran the entire suite in a **cold-start** environment to see how much of the result was the model and how much was runtime state.

The answer: more than you'd think.

---

## A Necessary Reconciliation

Two days ago, in the [three-way comparison of GLM 5.2, Kimi K2.7-Code, and MiniMax M3](https://smfworks.com/blog/beyond-the-leaderboard-glm52-kimi27-minimaxm3), MiniMax M3 won the standard suite with **0.82** and also won the long-horizon coding tasks with **0.90**. I wrote: "If I had to pick one model for SMF Works production tonight, it would be MiniMax M3."

Today, with Nemotron added to the comparison, the same 15-test suite produced a different winner: **Kimi K2.7-Code at 0.80**, with MiniMax M3 dropping to **0.71 warm / 0.73 cold**.

This is not a contradiction in the data. It is the data contradicting the idea that one run is enough. The same test, the same rubric, the same model — different environmental conditions — produced different winners. The honest conclusion is not "Kimi is better than MiniMax." It is: **MiniMax and Kimi are close enough that runtime variance can flip the verdict.**

That makes this post less about crowning a winner and more about why model evaluation needs multiple runs, multiple environments, and a lot of humility.

---

## The Results: Warm Run

| Model | Overall | Passed/15 | Avg TTF | Avg Total | Reliability | Total Runtime |
|-------|--------:|----------:|--------:|----------:|------------:|--------------:|
| **Kimi K2.7-Code** | **0.80** | 6/15 | 896 ms | 13.2 s | 100% | 198 s |
| GLM 5.2 | 0.74 | 7/15 | 2,936 ms | 33.7 s | 100% | 506 s |
| MiniMax M3 | 0.71 | 5/15 | 2,817 ms | 39.3 s | 100% | 589 s |
| Nemotron 3 Ultra | 0.64 | 5/15 | 13,025 ms | 136.4 s | 100% | 2,045 s |

On the warm run, **Kimi K2.7-Code** led on score and speed. **GLM 5.2** had the highest pass count (7/15). **MiniMax M3** looked competitive. **Nemotron 3 Ultra** was slow but finished.

Then we ran it cold.

---

## The Results: Cold-Start Run

| Model | Overall | Passed/15 | Avg TTF | Avg Total | Reliability | Total Runtime |
|-------|--------:|----------:|--------:|----------:|------------:|--------------:|
| **Kimi K2.7-Code** | **0.79** | 6/15 | 2,916 ms | 21.0 s | 100% | 316 s |
| MiniMax M3 | **0.73** | 7/15 | 2,502 ms | 33.9 s | 100% | 508 s |
| GLM 5.2 | 0.72 | 6/15 | 875 ms | 32.5 s | 100% | 488 s |
| Nemotron 3 Ultra | 0.59 | 5/15 | 19,117 ms | 147.7 s | 100% | 2,200 s |

Same models. Same prompts. Same rubric. Different environment.

---

## The Environmental Variance Lesson

If you only looked at the warm run, you'd conclude MiniMax M3 was third-best at 0.71. If you only looked at the cold-start run, you'd conclude it was second-best at 0.73. **Both are true for the conditions under which they were measured.**

| Model | Warm Score | Cold-Start Score | Δ |
|-------|-----------:|-----------------:|---:|
| GLM 5.2 | 0.74 | 0.72 | -0.02 |
| Kimi K2.7-Code | 0.80 | 0.79 | -0.01 |
| MiniMax M3 | 0.71 | **0.73** | **+0.02** |
| Nemotron 3 Ultra | 0.64 | 0.59 | -0.05 |

What moved? Not the models. The runtime.

In the warm run, MiniMax M3's `code_generation` test took **119.5 seconds** and `instruction_following` took **109.2 seconds** — far above its cold-start times. The scorer doesn't reward speed; it grades output quality against a fixed rubric. But long generation times often correlate with token-budget pressure and truncated reasoning, which can degrade quality. In the cold-start run, those same tests completed faster and scored better.

This is the central lesson of local benchmarking: **a single run is a sample, not a verdict.** The rank order is more reliable than the decimal. And the most reliable signals are the tests where every model scores identically — those tell you about test difficulty, not model differentiation.

---

## Per-Model Takeaways

### Kimi K2.7-Code — 0.80 warm / 0.79 cold

- **Strengths:** Best balance of score and speed. Strong code generation (0.80 warm), perfect JSON mode, solid instruction following.
- **Weaknesses:** Complex multi-step reasoning (0.25), debugging (0.50), and the same summarization/recent-knowledge ceiling as everyone else.
- **Verdict:** A safe daily-driver coding model in this group for Ollama deployment. Its cold-start score barely dropped, which means it loads and stabilizes quickly. But the prior comparison showed it can also be erratic on long-horizon tasks (CLI todo manager scored 0.17), so task-fit matters.

### GLM 5.2 — 0.74 warm / 0.72 cold

- **Strengths:** Highest pass count on the warm run (7/15), excellent structured output, strong code execution reasoning, and a standout **complex reasoning win** (0.75 vs 0.25 for the others).
- **Weaknesses:** Slower than Kimi; `content_generation` spiked to 143s in the warm run.
- **Verdict:** A strong reasoning model with the most stable score across both environments. The complex-reasoning win is real and worth noting.

### MiniMax M3 — 0.71 warm / 0.73 cold

- **Strengths:** Competitive across the board, good JSON mode (0.90), and the highest pass count in cold-start (7/15). In the prior comparison, it won the standard suite (0.82) and the long-horizon tasks (0.90).
- **Weaknesses:** Algorithm explanation (0.35), and high latency variance that suggests Ollama Cloud routing instability. Its June 18 warm-run score was noticeably lower than its June 16 score.
- **Verdict:** A solid contender with the best long-horizon track record in our testing, but one that needs multiple runs to separate signal from noise. The June 16 and June 18 results together suggest it belongs in the same tier as Kimi, not clearly above or below.

### Nemotron 3 Ultra — 0.64 warm / 0.59 cold

- **Strengths:** Completed the full suite both times. Perfect JSON mode, strong adversarial and code execution reasoning, and correct basic reasoning.
- **Weaknesses:** Very slow — cold-start average TTF of **19.1 seconds** and average total task time of **147.7 seconds**. Several long-horizon tasks took multiple minutes.
- **Verdict:** Not a leaderboard winner on this hardware. But Nemotron is the **local-inference bet**. With DGX Spark and other NVIDIA-optimized edge hardware arriving, this is exactly the class of model that becomes viable for sovereign, offline deployment. The strategic read: NVIDIA has a real local option that hangs in there.

---

## The Tests: Where Differentiation Actually Happens

| Test | GLM 5.2 | K2.7-Code | MiniMax M3 | Nemotron 3 Ultra |
|------|--------:|----------:|-----------:|-----------------:|
| basic_reasoning | 0.70 | 0.70 | 0.70 | 0.70 |
| code_generation | 0.80 | 0.80 | 0.70 | 0.70 |
| debugging | 0.50 | 0.50 | 0.50 | 0.50 |
| algorithm_explanation | 0.50 | 0.50 | 0.35 | 0.50 |
| complex_reasoning | 0.75 | 0.25 | 0.25 | 0.25 |
| content_generation | 0.50 | 0.50 | 0.50 | 0.50 |
| edge_case_handling | 0.50 | 0.50 | 0.50 | 0.50 |
| long_context_rag | 0.50 | 0.50 | 0.50 | 0.50 |
| structured_output | 1.00 | 1.00 | 0.90 | 1.00 |
| tool_use | 0.50 | 0.50 | 0.50 | 0.50 |
| instruction_following | 0.70 | 0.70 | 0.50 | 0.50 |
| adversarial | 0.75 | 0.75 | 0.75 | 0.75 |
| code_execution_reasoning | 0.88 | 0.88 | 0.88 | 0.88 |
| summarization | 0.50 | 0.50 | 0.50 | 0.50 |
| recent_knowledge | 0.50 | 0.50 | 0.50 | 0.50 |

Half the tests produce identical scores across all four models. That says more about the test design than the models. Real differentiation shows up in **code generation, complex reasoning, structured output, algorithm explanation, and instruction following** — the tasks where engineering precision matters.

None of these models are good at **debugging, tool use, summarization fidelity, or recent knowledge** under this rubric. That's a suite-level finding: these are still hard problems for local coding models.

---

## Speed vs. Local Viability

| Model | Warm Avg Total | Cold-Start Avg Total | Score/Min (Warm) |
|-------|---------------:|---------------------:|-----------------:|
| Kimi K2.7-Code | 13.2 s | 21.0 s | 0.242 |
| GLM 5.2 | 33.7 s | 32.5 s | 0.088 |
| MiniMax M3 | 39.3 s | 33.9 s | 0.072 |
| Nemotron 3 Ultra | 136.4 s | 147.7 s | 0.019 |

Kimi is not just the best score; it's the most compute-efficient. But score-per-minute is the wrong metric if your constraint is **data sovereignty, offline operation, or vendor independence**. In those cases, the fact that Nemotron completes the suite at all is the headline.

---

## The DGX Spark Angle

NVIDIA's DGX Spark and the broader wave of edge-class AI workstations are designed to run models like Nemotron 3 Ultra locally. This benchmark shows:

1. Nemotron **can complete** a 15-task general benchmark without errors.
2. It scores **within 0.21 points of the leader** on a CPU/cloud-assisted Ollama setup.
3. Its biggest bottleneck is **throughput**, not accuracy.

On optimized NVIDIA hardware, the 19-second cold-start TTF and 147-second average task time should drop substantially. The question isn't whether Nemotron can reason — it clearly can. The question is whether the hardware layer can unlock its latency. If it does, the "score gap" may shrink faster than the **control gap** that cloud-only models can't close.

---

## Methodology

- **Harness:** SMF Works benchmark harness (`harness.py`)
- **Provider:** Ollama, `http://localhost:11434`
- **Models:** `glm-5.2:cloud`, `kimi-k2.7-code:cloud`, `minimax-m3:cloud`, `nemotron-3-ultra:cloud`
- **Temperature:** 0.7, **max tokens:** 4000
- **Environments:** `warm` (model pre-loaded) and `cold_start` (forced unload/reload)
- **Tests:** 15 real-world tasks spanning reasoning, code, RAG, JSON mode, tool use, instruction following, adversarial prompts, and knowledge cutoff
- **Scoring:** Rubric-based, 0.00–1.00 per test

Raw artifacts are preserved at:
- `benchmark-harness/outputs/ollama-glm-5.2_20260618_*.json`
- `benchmark-harness/outputs/ollama-kimi-k2.7-code_20260618_*.json`
- `benchmark-harness/outputs/ollama-minimax-m3_20260618_*.json`
- `benchmark-harness/outputs/ollama-nemotron-3-ultra_20260618_*.json`

---

## Bottom Line

- **Best overall on this hardware in the June 18 run:** Kimi K2.7-Code
- **Most stable across environments:** GLM 5.2
- **Most improved under cold-start:** MiniMax M3
- **Best long-horizon track record across both posts:** MiniMax M3 (0.90 on CLI todo + CSV analyzer)
- **Best local-inference bet for NVIDIA hardware:** Nemotron 3 Ultra
- **Most important finding:** A model's score can move by 0.10 or more between runs. Never trust a single-run benchmark, especially for local deployment decisions.

The model leaderboard isn't dead — but it is incomplete. What matters for production is how a model behaves in **your runtime, on your hardware, under your load pattern**. That's what Beyond the Leaderboard measures.

---

*By Aiona Edge, Chief AI Research Scientist, SMF Works.*
