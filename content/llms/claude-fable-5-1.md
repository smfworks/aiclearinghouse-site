---
{
  "slug": "claude-fable-5-1",
  "title": "Claude Fable 5.1",
  "excerpt": "Anthropic's new flagship for coding and knowledge work — same $10/$50 pricing as Fable 5, but a 75% cache-read price cut makes long agentic sessions dramatically cheaper.",
  "category": "Anthropic",
  "tags": ["coding", "reasoning", "agents", "long-context", "anthropic"],
  "provider": "Anthropic",
  "input_price": 10.0,
  "output_price": 50.0,
  "context_window": 1000000,
  "mmlu": 92.0,
  "humaneval": 95.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-02"
}
---

# Claude Fable 5.1

## Overview

Claude Fable 5.1 (and its companion Claude Mythos 5.1) is Anthropic's flagship model for coding and knowledge work, released September 1, 2026. The headline change is not a new base model but a pricing restructure: per-token input and output rates are unchanged from Fable 5 at $10/$50 per million tokens, but cache reads drop 75% from $1.00 to $0.25 per million tokens. For long agentic sessions that repeatedly re-read cached prefixes, Anthropic estimates a 25% cost reduction on typical workloads and up to 45% on highly agentic ones.

The model retains a 1M-token context window (default and maximum, no beta header required) and 128K max output tokens. Adaptive thinking is always on, controlled via the `effort` parameter. The knowledge cutoff is June 2026.

## Key specifications

- **Context window:** 1,000,000 tokens
- **Max output:** 128,000 tokens
- **Input:** $10 / MTok
- **Output:** $50 / MTok
- **Cache read:** $0.25 / MTok (0.025x base input — down from 0.1x on Fable 5)
- **5m cache write:** $12.50 / MTok
- **1h cache write:** $20 / MTok
- **Batch API:** 50% discount ($5 input / $25 output per MTok)
- **Thinking:** Adaptive (always on), `effort` parameter controls depth
- **Knowledge cutoff:** June 2026

## Benchmark performance

On Terminal-Bench v2.1 (independently scored by Artificial Analysis), Claude Fable 5.1 leads the leaderboard at 91.4% resolution rate with Max Effort, followed by its own Xhigh Effort variant at 91.0% and High Effort at 89.9%. This is the highest score on the benchmark as of September 2, 2026.

The model also posts strong results on SWE-bench Verified and coding agent benchmarks, maintaining Anthropic's lead in the coding agent space.

## When to use it

- **Long agentic coding sessions** where cached prefixes are re-read frequently — the cache-read price cut is the biggest economic win.
- **Complex multi-step knowledge work** requiring 1M context and deep reasoning.
- **Tool-heavy agent workflows** where adaptive thinking improves tool-call sequencing.
- **Production agents** where you need the strongest available Terminal-Bench and SWE-bench scores.

## When not to use it

- **Cost-sensitive high-volume workloads** — $10/$50 is premium pricing. Consider Claude Opus 5 ($5/$25) or Gemini 3.7 Flash ($0.75/$3.75) for simpler tasks.
- **Latency-sensitive applications** — Fable 5.1 is classified as "Slower" in Anthropic's comparative latency tier.

## Tokenizer note

Fable 5.1 uses the same tokenizer introduced with Claude Opus 4.7. Compared to models older than Opus 4.7, the same text produces roughly 30% more tokens. If you are migrating from Claude Opus 4.5 or earlier, budget for higher token counts.

## API access

Use model ID `claude-fable-5-1` via the Claude API. US-only inference is available at 1.1x pricing for input and output tokens.