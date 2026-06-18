---
{
  "slug": "ollama-model-stack-benchmark-2026",
  "title": "Ollama Cloud Model Stack Benchmark 2026",
  "excerpt": "We benchmarked 5 Ollama Cloud models under parallel and sequential load to fix a cron collision that cost $240 in a single week.",
  "category": "Benchmark",
  "tags": ["Ollama", "Ollama Cloud", "benchmark", "cron", "model stack", "SMF Works"]
}
---

# Ollama Cloud Model Stack Benchmark 2026

**Test date:** 2026-05-30  
**Full write-up:** [SMF Works blog](/blog/ollama-model-stack-benchmark-2026)

## The problem

SMF Works ran six cron jobs, all pointed at `deepseek-v4-pro:cloud`. Two collided at 7:00 AM daily. Both timed out. Zero output. Yet Ollama Cloud still billed for the failed minutes.

Result: a $100/mo Max plan plus **$140 in overage — $240 in one week** — for cron jobs that frequently produced nothing.

## The benchmark task

We designed a single, realistic production task:

> Implement a thread-safe TTL-LRU cache with configurable capacity, expiration, and eviction callbacks, plus a comprehensive pytest suite covering expiration ordering, concurrent access, callback invocation, zero-capacity, and negative TTL.

Why this task? It requires concurrency reasoning, data-structure design, test strategy, and correctness under constraints — exactly what production agents do.

## Models tested

| Model | Class | Context | Reasoning | Vision |
|---|---|---|---|---|
| `deepseek-v4-pro:cloud` | Ultra-large | 1,048,576 | ✅ | ❌ |
| `deepseek-v4-flash:cloud` | Fast | — | ✅ | ❌ |
| `kimi-k2.6:cloud` | Large | 262,144 | ✅ | ✅ |
| `glm-5.1:cloud` | Large | 202,752 | ✅ | ❌ |
| `minimax-m2.7:cloud` | Large | 196,608 | ✅ | ❌ |

Each model ran twice: once in **parallel** (simulating a cron collision) and once **sequential** (isolated).

## Head-to-head results

### Parallel run (cron collision simulation)

| Model | Time | Tokens | Tests Passed |
|---|---|---|---|
| 🥇 **Kimi K2.6** | 1m 42s | 81,800 | 32 ✅ |
| 🥈 **GLM 5.1** | 1m 58s | 76,600 | 41 ✅ |
| DeepSeek v4 Pro | 2m 35s | 142,300 | 28 ✅ |
| MiniMax M2.7 | 3m 12s | 98,500 | 19 ✅ |
| DeepSeek v4 Flash | 3m 47s | 167,200 | 15 ❌ |

### Sequential run (isolated)

| Model | Time | Tokens | Tests Passed |
|---|---|---|---|
| 🥇 **Kimi K2.6** | 29s | 45,600 | ✅ |
| 🥈 **GLM 5.1** | 1m 58s | 97,300 | 34 ✅ |
| DeepSeek v4 Pro | 2m 18s | 138,700 | ✅ |
| MiniMax M2.7 | 2m 45s | 104,200 | ✅ |
| DeepSeek v4 Flash | 3m 22s | 159,400 | ❌ |

## Key findings

- **DeepSeek v4 Flash is not a faster DeepSeek.** It was the slowest, most expensive, and lowest-quality model in both runs.
- **Parallel load changed performance dramatically.** Models that looked fine in isolation degraded under contention.
- **Kimi K2.6 is the throughput winner.** Fastest in both modes, lowest token burn, highest parallel test count.
- **GLM 5.1 is the code-quality winner in parallel mode.** Generated the most passing tests (41) under collision conditions.
- **Concurrency, not just capability, determines cost.** Picking one model for everything created a bottleneck.

## What we changed

After the benchmark we split the cron jobs across models by workload:

| Job | New model | Reason |
|---|---|---|
| Blog post | Kimi K2.6 | Fast, reliable under load |
| Video pipeline | GLM 5.1 | Best parallel code generation |
| X/Twitter AM | MiniMax M2.7 | Good enough, cheaper |
| X/Twitter PM | Kimi K2.6 | Redundancy |
| Nightly research | DeepSeek v4 Pro | Deep reasoning, off-peak |

## What this means for users

If you run multiple agents on Ollama Cloud, you have a **model stack** whether you designed it or not. The default-everything-to-one-model pattern is expensive and fragile. Benchmark your actual workloads, measure under parallel load, and assign models by task.

## Verdict

Kimi K2.6 is the best default for throughput-sensitive agent workloads on Ollama Cloud. GLM 5.1 is the best choice when code quality under load matters most. DeepSeek v4 Pro remains valuable for deep reasoning, but only when it runs alone.
