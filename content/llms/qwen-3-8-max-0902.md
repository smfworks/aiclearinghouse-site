---
{
  "slug": "qwen-3-8-max-0902",
  "title": "Qwen3.8-Max-0902",
  "excerpt": "Alibaba's post-trained refresh of Qwen3.8-Max — same 2.4T base and 1M context, but coding and collaborative agent performance take a step up. Debuts at #1 on Code Arena: WebDev.",
  "category": "Alibaba",
  "tags": ["coding", "agents", "long-context", "vision", "open-weight", "chinese-llm"],
  "provider": "Alibaba Cloud / Qwen Team",
  "input_price": 2.0,
  "output_price": 6.0,
  "context_window": 1000000,
  "mmlu": 89.0,
  "humaneval": 93.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-02"
}
---

# Qwen3.8-Max-0902

## Overview

Qwen3.8-Max-0902 (API model ID: `qwen3.8-max-0902`, alias `qwen3.8-max-2026-09-02`) is Alibaba's upgraded snapshot of Qwen3.8-Max, released September 2, 2026. The 2.4-trillion-parameter base model and 1M-token context window are unchanged; the upgrade is entirely in post-training, extended on coding and collaborative agent work (Qwen's "Cowork" agentic office suite).

The model debuted at #1 on Code Arena: WebDev with a score of 1691, ahead of Claude Opus 5 Max and Kimi K3 Max, while also landing on the best current price/performance frontier according to Arena data. At $2/$6 per million tokens, it is five times cheaper on input and over eight times cheaper on output than Claude Fable 5.1.

## Key specifications

- **Context window:** 1,000,000 tokens (991K max input, 131K max output)
- **Thinking mode context:** 983K max input, 131K max output, 262K max reasoning
- **Input:** $2 / MTok
- **Output:** $6 / MTok
- **Implicit cache input:** $0.25 / MTok
- **Explicit cache creation:** $2.50 / MTok
- **Explicit cache read:** $0.17 / MTok
- **Rate limits:** 1M TPM, 15K RPM
- **Modalities:** Image, text, video input; text output
- **Native vision:** Chart reasoning, document parsing, multimodal perception

## Built-in tools

- Code interpreter (Responses API)
- Image-to-image search (Responses API)
- Text-to-image search (Responses API)
- Web search

## Benchmark performance

- **Code Arena: WebDev:** #1 at 1691 (ahead of Claude Opus 5 Max and Kimi K3 Max)
- **Terminal-Bench v2.1 (provider run):** 86.6% (per BenchLM snapshot, September 1, 2026)
- **Terminal-Bench v2.1 (Artificial Analysis):** 81.3% (Qwen3.8 Max row)
- Positioned at the best price/performance frontier per Arena data

## When to use it

- **Engineering-scale coding projects** — the post-training on coding is the headline improvement.
- **Long-horizon autonomous development** — 1M context with thinking mode and 262K max reasoning tokens.
- **Multi-tool agent orchestration** — improved composure in multi-tool workflows and end-to-end task delivery.
- **Cost-sensitive frontier work** — $2/$6 is exceptional for a top-tier model with 1M context.
- **Multilingual and vision workloads** — native vision understanding for charts, documents, and multimodal perception.

## When not to use it

- **Maximum coding benchmark performance** — Claude Fable 5.1 scores higher on Terminal-Bench v2.1 (91.4% vs 86.6%). If you need the absolute best coding agent, Fable 5.1 leads.
- **US-only data residency** — Alibaba Cloud infrastructure may not meet some organizations' data residency requirements.

## API access

Available through Alibaba Cloud Model Studio. The model name in the provider catalog is `qwen3.8-max`; use the exact ID returned by the live catalog for the 0902 snapshot.