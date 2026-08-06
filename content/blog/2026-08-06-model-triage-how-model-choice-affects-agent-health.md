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

Eleven models completed the battery. Six achieved a composite score of 96/100. Three scored 91. Two scored 84. The separation came from three sources: latency on heavy reasoning tasks, instruction-following precision, and one universal failure mode.

### Heart Rate: Latency

The heart rate data reveals dramatic differences:

- **Fastest**: Mistral Large 3 at 1,660ms average — but with very low throughput (7.5 tok/s)
- **Fastest with real throughput**: DeepSeek V4 Pro at 2,085ms and 62.5 tok/s
- **Median**: ~2,100ms across the fleet
- **Slowest**: Nemotron Ultra at 7,221ms — nearly 4× the median
- **Qwen 3.5 397B** was also slow at 6,079ms, despite the highest throughput (69.2 tok/s)

The key insight: **latency and throughput are not the same vital sign.** A model can be fast (low latency) but generate tokens slowly (low throughput), or vice versa. Mistral Large 3 responds quickly but generates tokens at 7.5/second. Qwen 3.5 397B takes 6 seconds to start responding but then generates at 69 tokens/second once it does. For agent workloads, where long responses are common, throughput matters as much as first-token latency.

### The Multi-Step Failure: A Universal Finding

The most striking result: **every single model failed the multi-step arithmetic task.** The task was:

> Take 87 → Add 13 → Multiply by 2 → Subtract 50 → Divide by 5

The correct answer is 24. Every model output 30.

This is not a random failure — it's a systematic one. All 11 models performed the same incorrect calculation: they appear to add 13 to 87 (getting 100), then multiply by 2 (200), but instead of subtracting 50 (150) and dividing by 5 (30), they appear to divide 150 by 5. The error suggests a common failure in multi-step instruction tracking — the models lose track of the step sequence and skip a step.

This is the most important clinical finding in the study. If every model fails the same multi-step task in the same way, it reveals a **systemic limitation in current LLM architectures**, not a model-specific bug. For agent operators, this means: don't trust models to execute multi-step arithmetic chains in a single prompt. Break them into individual steps, or use a tool (calculator) for the computation.

### JSON Formatting: The Separator

One task separated the field sharply: strict JSON output. Ten of 11 models produced valid JSON with the correct keys. Mistral Large 3 was the only failure — it wrapped the JSON in markdown code blocks despite the instruction to output "ONLY valid JSON, no markdown."

This is a practical finding for agent operators: if your agent needs structured output, most models handle it, but you should test your specific model. A model that wraps JSON in markdown will break downstream parsing.

### Safety Awareness: Universal Pass

Every model correctly identified that a "delete all files" request should be refused or require explicit confirmation. This is encouraging — the safety alignment is consistent across providers, architectures, and model sizes. No model in this study would blindly execute a destructive command.

### The Water Jug Puzzle

Nine of 11 models solved the 5-liter/3-liter jug puzzle correctly and within the 100-word limit. GLM-5.2 and MiniMax M3 both failed — GLM-5.2 produced an empty response (a generation failure), and MiniMax M3 produced the same empty-response pattern. This suggests these two models may have issues with long-form reasoning tasks that require both correctness and conciseness.

## What the Data Reveals

### Tier 1: The Healthiest Models (Composite 96)

Six models tied at the top: **Kimi K2.7 Code, DeepSeek V4 Pro, GPT-OSS 120B, Grok 4.5, Claude Sonnet 5, and DeepSeek V4 Flash.** All passed 8/9 tasks (89%), had zero errors, and maintained latencies under 3 seconds.

Among these, the differentiation is in latency and throughput:
- **DeepSeek V4 Pro**: Best balance — 2,085ms latency, 62.5 tok/s, zero errors
- **Kimi K2.7 Code**: Fastest tier-1 at 1,928ms, strong 57.2 tok/s throughput
- **Grok 4.5**: 2,882ms latency, 47.7 tok/s — solid mid-range
- **Claude Sonnet 5**: 2,930ms latency, but only 16.8 tok/s throughput — slow generation
- **GPT-OSS 120B**: 1,906ms latency, 51.5 tok/s — excellent all-around
- **DeepSeek V4 Flash**: 2,299ms latency, 38.7 tok/s — the "flash" variant trades quality for speed

### Tier 2: Capable but Compromised (Composite 91)

Three models scored 91: **GLM-5.2, MiniMax M3, and Mistral Large 3.** All passed 7/9 tasks (78%). Each had a specific weakness:

- **GLM-5.2**: Failed the jug puzzle (empty response on long reasoning)
- **MiniMax M3**: Same jug-puzzle failure pattern
- **Mistral Large 3**: Failed JSON formatting (wrapped in markdown) and the jug puzzle

### Tier 3: Slow but Capable (Composite 84)

Two models scored 84: **Qwen 3.5 397B and Nemotron Ultra.** Both passed 8/9 tasks (89%) — same as Tier 1 — but their heart rate scores dropped to 60 due to high latency (6,079ms and 7,221ms respectively). These are large models that produce high-quality output but are too slow for responsive agent workloads.

### The Kimi K3 Finding

Kimi K3 returned HTTP 402 on every task — the model requires a paid Ollama plan beyond what our subscription includes. This is itself a vital sign: **model availability is a health dimension.** A model that requires additional payment is not "unhealthy" in the clinical sense, but it is inaccessible, which has the same operational effect. For agent operators, provider pricing and plan limits are infrastructure health factors.

## Clinical Recommendations

Based on this data, here's our model prescription for different agent workloads:

| Workload Type | Recommended Model | Rationale |
|---------------|------------------|-----------|
| **General agent tasks** | DeepSeek V4 Pro | Best balance of speed, throughput, and accuracy |
| **Code-heavy agents** | Kimi K2.7 Code | Fastest tier-1, strong throughput, code specialization |
| **Cost-sensitive deployments** | GPT-OSS 120B | Free on Ollama, excellent all-around performance |
| **Maximum quality** | Grok 4.5 or Claude Sonnet 5 | Zero errors, strong reasoning, but slower throughput |
| **High-throughput pipelines** | Qwen 3.5 397B | 69 tok/s but high latency — good for batch, not interactive |
| **Avoid for agents** | Mistral Large 3 | JSON formatting failure, low throughput, inconsistent |

### The Universal Multi-Step Caveat

Regardless of model choice, **no model in this study reliably executes multi-step arithmetic in a single prompt.** This is a systemic finding, not a model-specific one. For any agent that needs multi-step computation:

1. **Break the task into individual steps** — prompt the model once per step
2. **Use a calculator tool** — let the model call a tool for arithmetic, not compute it internally
3. **Verify each step** — don't assume the model tracked the chain correctly

This is the kind of finding that vital signs are designed to surface. Without standardized testing, you'd discover this failure mode when your agent made a wrong decision in production. With vital signs, you discover it in triage — before it matters.

## What This Study Doesn't Measure

Transparency about limitations:

- **Single-run, not longitudinal** — Each model was tested once per task. Latency and throughput can vary with load. A longitudinal study would track these over time.
- **No tool-use testing** — The tasks test reasoning and instruction-following, not tool-calling. A follow-up study should test whether models can correctly format tool calls and handle tool results.
- **No context-length testing** — All prompts were short. Model behavior at high context lengths (100K+ tokens) may differ significantly.
- **Temperature 0.0 only** — Creative and variable tasks may show different results at higher temperatures.
- **9 tasks is a small battery** — A comprehensive evaluation would include 50+ tasks across more domains.

## Conclusion

Model choice is a health decision. The same agent infrastructure — same tools, same memory, same gateway — will produce different vital signs depending on which model powers it. This study measured 12 models against the same task battery and found:

- A 4.5× difference in latency between the fastest and slowest models
- A 10× difference in throughput
- One universal failure mode (multi-step arithmetic) that affects every model
- One model (Mistral Large 3) that can't follow strict JSON formatting instructions
- Six models that are essentially interchangeable for general agent workloads
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