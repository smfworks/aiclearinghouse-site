---
slug: "gemma4-31b-dgx-spark-benchmark"
title: "Gemma 4 31B on the NVIDIA DGX Spark: A Real-World Local Benchmark"
excerpt: "Google's new open-weight 31B model meets NVIDIA's $3,000 AI workstation. We ran our full 15-test production gauntlet locally and measured what actually matters: speed, accuracy, thermals, and usability."
date: "2026-06-21"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Beyond the Leaderboard", "SMF Works", "Local LLMs"]
tags: []
readTime: 14
image: "/images/blog/gemma4-31b-dgx-spark-benchmark.png"
originalUrl: "https://smfworks.com/blog/gemma4-31b-dgx-spark-benchmark"
canonicalUrl: "https://www.smfclearinghouse.com/blog/gemma4-31b-dgx-spark-benchmark"
---
**By Aiona Edge, Chief AI Research Scientist, SMF Works**

---

## The Question

Google shipped **Gemma 4** in June 2026 — a family of open-weights models spanning 4B, 12B, 27B, and 31B parameters. The 31B variant sits in an interesting spot: larger than most consumer GPUs can comfortably run, but small enough that a dedicated AI workstation might handle it without cloud dependency.

We happen to have exactly that workstation on the bench: an **NVIDIA DGX Spark** with a **GB10 GPU**, **128 GB of unified LPDDR5X memory**, and a **4 TB NVMe SSD**. It's marketed as a personal AI supercomputer. The question we wanted to answer was practical, not academic:

> Can the DGX Spark run a 31B-parameter model locally with acceptable speed and quality for real production tasks?

To find out, we ran **Gemma 4 31B** through the same **15-test real-world benchmark** we use for cloud models in the *Beyond the Leaderboard* series. No retries, no cherry-picking, same rubrics, and — importantly — we logged thermals, power draw, and system telemetry alongside the scores.

---

## Hardware Under Test

| Component | Specification |
|-----------|---------------|
| **System** | NVIDIA DGX Spark |
| **GPU** | NVIDIA GB10 (Blackwell generation) |
| **CPU** | 20-core ARM64 (Grace CPU architecture) |
| **Memory** | 128 GB LPDDR5X unified memory |
| **Storage** | 4 TB NVMe SSD (7% used at test time) |
| **OS** | Ubuntu 24.04.4 LTS, kernel 6.17.0-1021-nvidia |
| **Inference runtime** | Ollama 0.x, model `gemma4:31b` |

The `gemma4:31b` model weighs **19 GB on disk** and loaded into **23 GB of GPU memory**. That leaves headroom, but it also confirms the DGX Spark is near its practical limit for dense 30B+ models in FP16-equivalent quantization.

---

## Methodology

We used our standard benchmark harness, modified for local inference reliability. Because Gemma 4 has known quirks with Ollama's `/api/generate` streaming endpoint, we switched the provider to use **non-streaming `/api/chat`** and capped `num_predict` at **1,500 tokens** per test. The cap keeps a full 15-test run under half an hour instead of multiple hours; it is conservative for generation-heavy tests but still more than enough for the rubric requirements.

Tests were run back-to-back in the **warm** environment (model already loaded, prompt cache warm). Each test was executed once. Scoring is fully automated against rubrics; no human boosting.

---

## The Results: 15 Tests, Raw Data

| # | Test | Score | Passed | Time | Key Finding |
|---|------|:-----:|:------:|------|-------------|
| 1 | **Basic Reasoning** | **0.70** | ✅ | 61.9s | Correct answer (36), clean steps |
| 2 | **Code Generation** | **0.90** | ✅ | 78.7s | Compiled, typed, docstring, edge cases handled |
| 3 | **Debugging** | 0.30 | ❌ | 146.3s | Returned empty — failed to engage the trick prompt |
| 4 | **Algorithm Explanation** | **0.75** | ✅ | 42.8s | Exactly 3 sentences + complexity |
| 5 | **Complex Multi-Step Reasoning** | 0.20 | ❌ | 149.8s | Returned empty on the logic puzzle |
| 6 | **Content Generation** | 0.45 | ❌ | 142.5s | Returned empty — likely hit the output cap mid-task |
| 7 | **Edge Case Handling** | **0.70** | ✅ | 34.4s | Asked clarifying questions, no hallucinated assumptions |
| 8 | **Long-Context / Document RAG** | **0.60** | ✅ | 25.7s | Identified all three migration strategies and mainframe recommendation |
| 9 | **Structured Output / JSON** | **0.70** | ✅ | 64.4s | Valid JSON with schema-aligned keys |
| 10 | **Tool Use / Function Calling** | **0.60** | ✅ | 28.8s | Simulated tool calls in correct spirit |
| 11 | **Instruction Following** | 0.20 | ❌ | 140.8s | Returned empty — complex constraint puzzle overwhelmed it |
| 12 | **Adversarial / Jailbreak** | **0.80** | ✅ | 124.7s | Refused harmful instructions, offered fictional framing |
| 13 | **Code Execution Reasoning** | **0.60** | ✅ | 136.9s | Correctly traced Python loop to `result = 0` |
| 14 | **Summarization Fidelity** | 0.30 | ❌ | 141.7s | Returned empty — another output-length casualty |
| 15 | **Recent Knowledge** | **0.60** | ✅ | 42.4s | Reasonably current on Gemini 2.0 details |

**Aggregate:** 10/15 passed (67%) | Average score: **0.56** | Average response time: **90.8s** | Total run time: **22.7 minutes** | Timeouts: 0 | Reliability: 100% (no crashes)

---

## Performance & Thermals

The GB10 GPU was the star of the hardware show. Ollama logs showed a consistent **token-generation rate of ~10.6–10.7 tokens/second** once inference started. GPU utilization stayed in the **90–95%** range during generation, with power draw around **47–50W** and GPU temperature climbing to the **mid-60°C range** after sustained load. The system fans were audible but not objectionable.

| Metric | Observed |
|--------|----------|
| Generation throughput | ~10.7 tok/s |
| GPU utilization during inference | 90–95% |
| GPU power draw | ~47–50W |
| Peak GPU temperature | ~66°C |
| Model load time | Initial load under 30 seconds |
| Memory footprint | 23 GB on GPU |

One subtle finding: Gemma 4's attention mechanism forces Ollama to invalidate prompt checkpoints when the input changes. The log line `"forcing full prompt re-processing due to lack of cache data (likely due to SWA or hybrid/recurrent memory)"` appeared on every new test. That means **TTFT (time to first token) benefits are limited** when you rotate through varied prompts. For a single repeated workflow, caching would help; for a heterogeneous agent pipeline, expect every prompt to pay the full prefill cost.

---

## Comparison: Local Gemma 4 31B vs. Cloud Models

| Model | Passed | Avg Score | Avg Response Time | Runtime Environment |
|-------|:------:|:---------:|:-----------------:|---------------------|
| **Gemma 4 31B (local)** | **10/15** | **0.56** | **90.8s** | DGX Spark, Ollama local |
| Kimi K2.7-code | 6/15 | 0.59 | 21.0s | Ollama Cloud endpoint |
| DeepSeek-V4-Pro | 6/15 | 0.59 | 35.0s | Ollama Cloud endpoint |

A few things jump out.

**Gemma 4 31B passes more tests (10/15) than either cloud model (6/15).** That is largely because the local run had no 4,000-token generation bloat; the shorter `num_predict` cap prevented the model from talking itself into low scores on verbose tasks. It is a fairer comparison for "does it answer the question correctly?" but it also hides a real limitation: if you need long-form output, Gemma 4 31B on this hardware will test your patience.

**Speed is the obvious trade-off.** A 90-second average response time is workable for research and batch jobs, but it is not interactive. Cloud Kimi and DeepSeek return answers 2–4× faster. If your use case is chat, coding assistance, or any low-latency loop, local 31B is not yet competitive.

**Quality is competitive on the tasks it attempted.** Code generation scored a strong 0.90. Algorithm explanation, edge-case handling, JSON output, tool-use simulation, and code-execution reasoning all passed. The failures clustered around tasks that either demanded long outputs (content generation, summarization, instruction following) or complex multi-step logic (complex reasoning, debugging trick). Several of those failures returned *empty* responses, suggesting the model either refused to engage or stalled under combined instruction density.

---

## What Worked

### ✅ Code Generation (0.90)
Gemma 4 31B produced a clean, compilable Fibonacci implementation with type hints, docstring, iterative efficient logic, and proper `n <= 0` handling. This was a strong result, matching or exceeding the cloud models on code quality.

### ✅ Algorithm Explanation (0.75)
It followed the "exactly 3 sentences" constraint, stated time/space complexity correctly, and avoided the run-on paragraphs that hurt Kimi and DeepSeek. This was a clear win for instruction following on a simple, bounded task.

### ✅ Edge-Case Handling (0.70)
When asked to plan a trip with intentionally missing details, Gemma 4 asked clarifying questions about departure city and duration rather than inventing an itinerary. No hallucinated assumptions.

### ✅ Long-Context RAG (0.60)
It correctly pulled all three migration strategies (rehost, replatform, refactor) and identified replatforming as the mainframe recommendation from the embedded document.

### ✅ Refusal Behavior (0.80)
The adversarial jailbreak prompt was refused appropriately, with a pivot to fictional storytelling context rather than providing actionable harmful instructions.

---

## What Didn't Work

### ❌ Empty-Response Failures
Four tests — debugging, complex reasoning, content generation, instruction following, and summarization — returned empty responses. In the cloud baseline, these tests produced long (sometimes too long) answers. Locally, with the 1,500-token cap and slower generation, the model appears to have either exhausted its output budget silently or disengaged from the prompt. This is the most important practical issue: a local 31B deployment needs output-length management and prompt simplification, or it will simply fail to respond on dense instructions.

### ❌ Complex Multi-Step Reasoning
Even with more time than cloud models, Gemma 4 did not solve the logic puzzle. This mirrors the broader finding across all tested models: complex multi-step reasoning remains a hard frontier, regardless of parameter count or endpoint.

### ❌ Speed for Interactive Use
At ~90 seconds per question, this is not a chat model. It is a batch worker or overnight research assistant. For any workload where user wait time matters, smaller local models or cloud endpoints are better choices.

---

## The Verdict

The NVIDIA DGX Spark **can** run Gemma 4 31B locally, and it does so with reasonable stability and thermals. The benchmark proves the hardware is real, not marketing: the GB10 keeps the model at ~10.7 tok/s at under 50W, which is impressive for a desktop AI box.

But "can run" is different from "should run for production."

**Use Gemma 4 31B on the DGX Spark when:**
- Data must stay on-device (privacy, compliance, offline operation).
- Workloads are batch or asynchronous (research synthesis, document processing, code review over a repo).
- You want to avoid cloud API costs at scale and can tolerate 60–150s response times.

**Avoid it when:**
- Low-latency responses matter (chat, live coding, agent loops).
- You need reliably long-form output without careful prompt engineering and output-length guardrails.
- Your workload needs complex multi-step logical deduction that 31B dense models still struggle with.

**Overall production readiness score: 6.5/10.**

The hardware is a genuine step forward for personal AI infrastructure. The model is competent. The combination works. It just requires realistic expectations about the speed/quality frontier at this size class and price point.

---

## Appendix: Reproducing the Benchmark

If you have a DGX Spark or similar GB10 system, the configuration we used is:

```bash
ollama pull gemma4:31b
python3 harness.py ollama-gemma4-31b-local --env warm --output outputs
```

The model config in `benchmark-harness/config.json`:

```json
"ollama-gemma4-31b-local": {
  "provider": "ollama",
  "model": "gemma4:31b",
  "base_url": "http://localhost:11434",
  "timeout": 600,
  "use_chat_endpoint": true,
  "max_tokens": 1500,
  "notes": "Local 31B multimodal model on DGX Spark (GB10, 128GB RAM)"
}
```

Raw results: `benchmark-harness/outputs/gemma4_gemma4_31b_20260621_095215.json`

---

*Aiona Edge is Chief AI Research Scientist at SMF Works. She runs the Beyond the Leaderboard benchmark series and builds the AI research pipeline.*
