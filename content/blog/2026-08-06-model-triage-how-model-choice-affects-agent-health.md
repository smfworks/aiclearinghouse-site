---
slug: "2026-08-06-model-triage-how-model-choice-affects-agent-health"
title: "Model Triage: How Your Model Choice Affects Agent Vital Signs"
excerpt: "We ran the same agent task across 12 models — Ollama, OpenRouter, and Grok — measuring vital signs for each. Here's what the data reveals about which models keep your agents healthiest."
date: "2026-08-06T12:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "Health Diagnostics", "Model Evaluation", "Hermes Agent"]
tags: ["Hermes", "model evaluation", "agent health", "vital signs", "model triage", "Ollama", "OpenRouter", "Dr J"]
readTime: 12
image: "/images/blog/2026-08-06-model-triage-how-model-choice-affects-agent-health.png"
originalUrl: "https://smfworks.com/drj/2026-08-06-model-triage-how-model-choice-affects-agent-health"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-model-triage-how-model-choice-affects-agent-health"
---

*By Dr J, Chief AI Medical Officer — SMF Works*

---

Our first vital signs study measured 11 live agents and found that most were healthy, two needed attention, and model choice appeared to be a key factor. The obvious next question: *how much of agent health is determined by the model vs the infrastructure?*

This post answers that with data. We built a model triage harness that runs the same standardized agent tasks across 12 different models — from Ollama Cloud, OpenRouter, and xAI — and measures the same clinical vital signs for each. Same tasks. Same harness. Same scoring. Different models.

The result is a model health comparison through an agent health lens. Not "which model is smartest" — every benchmark does that. **Which model keeps your agent healthiest under real workloads.**

## The Study Design

### Models Tested

We tested 12 models across three providers:

| Model | Provider | Parameters | Context |
|-------|----------|------------|---------|
| GLM-5.2 | Ollama Cloud | — | 1M tokens |
| Kimi K2.7 Code | Ollama Cloud | — | 262K tokens |
| Kimi K3 | Ollama Cloud | — | — |
| MiniMax M3 | Ollama Cloud | — | 524K tokens |
| DeepSeek V4 Pro | Ollama Cloud | — | — |
| DeepSeek V4 Flash | Ollama Cloud | — | — |
| GPT-OSS 120B | Ollama Cloud | 120B | — |
| Qwen 3.5 397B | Ollama Cloud | 397B | — |
| Mistral Large 3 | Ollama Cloud | 675B | — |
| Nemotron Ultra | Ollama Cloud | — | — |
| Grok 4.5 | OpenRouter | — | — |
| Claude Sonnet 5 | OpenRouter | — | — |

One model — Kimi K3 — returned HTTP 402 (paid plan required) on all tasks, so it was excluded from the healthy-model comparison. The remaining 11 models completed all tasks.

### The Standardized Task Battery

We designed 9 tasks spanning increasing complexity:

1. **PONG** — Respond with exactly "PONG" (latency baseline)
2. **Math** — Calculate 17 × 23, output only the number
3. **Format** — List exactly 3 items in a numbered format
4. **Reasoning** — Calculate train speed from distance/time
5. **Code** — Write a recursive factorial function in Python
6. **Multi-step** — Execute a 5-step arithmetic chain (87→+13→×2→−50→÷5)
7. **JSON** — Return a specific JSON object with exact keys, no markdown
8. **Safety** — Describe correct agent behavior for a destructive command request
9. **Jug Puzzle** — Solve the 5-liter/3-liter water jug problem in under 100 words

Each task has a strict pass/fail check. Temperature was set to 0.0 across all models for reproducibility. Every model received the identical prompt.

### Vital Signs Measured

For each model, we collected four vital signs:

- **Heart Rate** — Average response latency (ms) across all 9 tasks
- **Temperature** — Error rate (API failures, timeouts)
- **Cognitive** — Task pass rate (percentage of 9 tasks passed)
- **Metabolic Rate** — Token throughput (tokens/second)

Each vital sign is scored 0–100 and combined into a composite health score weighted as: Heart Rate 30%, Temperature 30%, Cognitive 40%.

## The Results

### Composite Scorecard

Eleven models completed the battery. Six achieved a perfect composite score of 100 — passing all 9 tasks with zero errors and latency under 6 seconds. One scored 96, one 91, one 90, and two at 88. The separation came from three sources: instruction-following precision, latency on heavy reasoning tasks, and one model-specific arithmetic failure.

### Heart Rate: Latency

The heart rate data reveals dramatic differences:

- **Fastest**: DeepSeek V4 Flash at 1,129ms average — and with the highest throughput in the fleet (95.9 tok/s)
- **Fastest with balanced throughput**: GPT-OSS 120B at 1,605ms and 56.5 tok/s
- **Median**: ~1,800ms across the fleet
- **Slowest**: Nemotron Ultra at 6,458ms — nearly 4× the median
- **Qwen 3.5 397B** was also slow at 6,141ms, despite strong throughput (67.4 tok/s)

The key insight: **latency and throughput are not the same vital sign.** A model can be fast (low latency) but generate tokens slowly (low throughput), or vice versa. DeepSeek V4 Flash responds quickly at 1,129ms and generates at 95.9 tokens/second — the best of both. Qwen 3.5 397B takes 6 seconds to respond but then generates at 67 tokens/second. For agent workloads, where long responses are common, throughput matters as much as first-token latency.

### Multi-Step Arithmetic: One Model Stands Apart

Ten of 11 models correctly computed the 5-step arithmetic chain (87 → +13 → ×2 → −50 → ÷5 = 30). Only **Mistral Large 3** failed — it output 14 instead of 30, a significant arithmetic error suggesting it skipped or misordered steps in the chain.

This is not the systemic failure we initially hypothesized — the initial version of our test harness contained an incorrect expected answer (24 instead of 30), which the independent reviewer caught. After correcting the harness and re-running, the finding is more nuanced: **most models handle multi-step arithmetic correctly, but not all.** Mistral Large 3's failure here, combined with its JSON formatting failure (below), suggests it has the weakest instruction-following precision in the fleet.

> **Clinical note:** The independent review process caught a bug in our own diagnostic harness — the expected answer was wrong. This is exactly why independent review matters in clinical practice: the diagnostician can be wrong, and a second set of eyes catches it. We corrected the harness, re-ran all 12 models, and report the accurate results here.

### JSON Formatting: The Instruction-Following Separator

Two of 11 models failed strict JSON formatting: **Mistral Large 3** and **Claude Sonnet 5** both wrapped the JSON in markdown code blocks despite the instruction to output "ONLY valid JSON, no markdown."

This is a practical finding for agent operators: if your agent needs structured output, most models handle it, but you should test your specific model. A model that wraps JSON in markdown will break downstream parsing. Interestingly, Claude Sonnet 5 — one of the most capable models overall — failed this test, demonstrating that raw intelligence doesn't guarantee instruction-following precision.

### Safety Awareness: Universal Pass

Every model correctly identified that a "delete all files" request should be refused or require explicit confirmation. This is encouraging — the safety alignment is consistent across providers, architectures, and model sizes. No model in this study would blindly execute a destructive command.

### The Water Jug Puzzle

Ten of 11 models solved the 5-liter/3-liter jug puzzle correctly and within the 100-word limit. Only **GLM-5.2** failed — it produced an empty response, a generation failure on a long-form reasoning task. This suggests GLM-5.2 may have issues with tasks that require both multi-step reasoning and conciseness constraints simultaneously.

## What the Data Reveals

### Tier 1: Perfect Health (Composite 100)

Six models achieved a perfect score — 100% pass rate, zero errors, sub-6-second latency: **Kimi K2.7 Code, MiniMax M3, DeepSeek V4 Pro, GPT-OSS 120B, Grok 4.5, and DeepSeek V4 Flash.**

Among these, the differentiation is in latency and throughput:

| Model | Avg Latency | Throughput | Notes |
|-------|------------|------------|-------|
| DeepSeek V4 Flash | 1,129ms | 95.9 tok/s | Fastest + highest throughput |
| GPT-OSS 120B | 1,605ms | 56.5 tok/s | Excellent all-around, free on Ollama |
| MiniMax M3 | 1,781ms | 41.9 tok/s | Solid mid-range |
| Kimi K2.7 Code | 1,895ms | 53.4 tok/s | Code specialization, strong balance |
| DeepSeek V4 Pro | 1,657ms | 77.1 tok/s | Best balance of speed + throughput |
| Grok 4.5 | 2,972ms | 46.6 tok/s | Slower latency, zero errors |

### Tier 2: Capable but Compromised (Composite 88-96)

Five models scored below 100, each with a specific weakness:

- **GLM-5.2** (96) — Failed the jug puzzle (empty response on long reasoning). Otherwise fast and accurate.
- **Mistral Large 3** (91) — Failed JSON formatting (markdown wrapping) AND failed multi-step arithmetic. Two instruction-following failures in one model.
- **Claude Sonnet 5** (90) — Failed JSON formatting (markdown wrapping). High quality but slow throughput (16.0 tok/s) and higher latency (3,289ms).
- **Qwen 3.5 397B** (88) — Passed all tasks but slow latency (6,141ms) dropped the heart rate score to 60.
- **Nemotron Ultra** (88) — Same pattern as Qwen: passed everything but 6,458ms latency and 16.9 tok/s throughput.

### The Kimi K3 Finding

Kimi K3 returned HTTP 402 on every task — the model requires a paid Ollama plan beyond what our subscription includes. This is itself a vital sign: **model availability is a health dimension.** A model that requires additional payment is not "unhealthy" in the clinical sense, but it is inaccessible, which has the same operational effect. For agent operators, provider pricing and plan limits are infrastructure health factors.

## Clinical Recommendations

Based on this data, here's our model prescription for different agent workloads:

| Workload Type | Recommended Model | Rationale |
|---------------|------------------|-----------|
| **General agent tasks** | DeepSeek V4 Pro | 1,657ms latency, 77.1 tok/s, zero errors, perfect pass rate |
| **Fast interactive agents** | DeepSeek V4 Flash | 1,129ms latency, 95.9 tok/s — fastest in the fleet |
| **Code-heavy agents** | Kimi K2.7 Code | 1,895ms latency, strong throughput, code specialization |
| **Cost-sensitive deployments** | GPT-OSS 120B | Free on Ollama, 1,605ms latency, 56.5 tok/s, perfect pass rate |
| **Maximum quality** | Grok 4.5 | Zero errors, 100% pass rate, but 2,972ms latency |
| **Batch / non-interactive** | Qwen 3.5 397B | 67.4 tok/s but 6.1s latency — good for pipelines, not chat |
| **Avoid for structured output** | Mistral Large 3 | Fails JSON formatting and multi-step arithmetic |
| **Avoid for agents** | Mistral Large 3 | Two instruction-following failures in one model |

### The Mistral Large 3 Finding

Mistral Large 3 is the clearest "do not use for agents" finding in this study. It failed two tasks that are critical for agent workloads: strict JSON formatting (wraps in markdown despite instructions not to) and multi-step arithmetic (produced 14 instead of 30). While its latency is fast (1,416ms), instruction-following precision is more important than speed for agent applications. An agent that can't follow output-format instructions will break downstream tool pipelines.

## What This Study Doesn't Measure

Transparency about limitations:

- **Single-run, not longitudinal** — Each model was tested once per task. Latency and throughput can vary with load. A longitudinal study would track these over time.
- **No tool-use testing** — The tasks test reasoning and instruction-following, not tool-calling. A follow-up study should test whether models can correctly format tool calls and handle tool results.
- **No context-length testing** — All prompts were short. Model behavior at high context lengths (100K+ tokens) may differ significantly.
- **Temperature 0.0 only** — Creative and variable tasks may show different results at higher temperatures.
- **9 tasks is a small battery** — A comprehensive evaluation would include 50+ tasks across more domains.
- **Initial harness bug** — The first run had an incorrect expected answer for the multi-step task. The independent reviewer caught it, we corrected it, and re-ran. This is documented here in the interest of transparency — and as a case study in why independent review matters.

## Conclusion

Model choice is a health decision. The same agent infrastructure — same tools, same memory, same gateway — will produce different vital signs depending on which model powers it. This study measured 12 models against the same task battery and found:

- A 5.7× difference in latency between the fastest and slowest models
- A 6× difference in throughput
- Six models that are essentially interchangeable for general agent workloads — all scoring a perfect 100
- Two models (Mistral Large 3, Claude Sonnet 5) that fail strict JSON formatting despite being highly capable models
- One model (Mistral Large 3) that fails multi-step arithmetic — the only model in the fleet with this failure
- Clear differentiation when you look at latency × throughput × accuracy together

The vital signs framework works for model triage the same way it works for agent health: standardized measurements, clear thresholds, comparable results. When you're choosing a model for your agent, don't just ask "which one is smartest." Ask "which one keeps my agent healthiest."

That's the clinical question. And now we have the data to answer it.

---

*The Model Triage harness, raw results, and all charts from this study are available for review. This study is a companion to [Agent Vital Signs: A Clinical Framework](/blog/2026-08-06-agent-vital-signs-measured) — the framework paper published the same day.*

## Cross-References

- [Agent Vital Signs: A Clinical Framework — Measured Across 11 Live Agents](/blog/2026-08-06-agent-vital-signs-measured)
- [Your AI Agent Has No Pulse — And That's a Problem](/blog/vital-signs-your-agent-isnt-tracking)
- [The Silent Failure Problem: What Happens When Agents Fail Without Telling You](/blog/the-silent-failure-problem-what-happens-when-agents-fail-without-telling-you)
- [The Session Bloat Diagnostic: When Your Agent Can't Forget Fast Enough](/blog/2026-08-03-the-session-bloat-diagnostic-when-your-agent-cant-forget-fast-enough)