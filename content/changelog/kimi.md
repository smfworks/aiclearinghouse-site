---
slug: kimi
title: Kimi
excerpt: Recent updates to Moonshot AI's Kimi models, including the open-source K2.7 Code release.
category: Model
tags:
  - Kimi
  - Moonshot AI
  - K2.7
  - coding model
  - open source
  - changelog
last_updated: 2026-06-16
last_verified: 2026-06-18
---

# Kimi Changelog

## 2026-06

### Kimi K2.7 Code
Released June 16, 2026. Kimi K2.7 Code is an open-source, coding-focused agentic model built for long-horizon software engineering tasks. Moonshot AI claims it cuts thinking tokens by roughly 30% compared to earlier versions while maintaining or improving coding performance.

### Benchmark skepticism
Some practitioners have questioned whether the published benchmarks fully capture real-world coding performance. As with any benchmark, treat vendor numbers as a starting point and verify on your own codebase.

### Open weights
K2.7 Code is available as open weights, which makes it attractive for self-hosting, air-gapped environments, and teams that want to fine-tune on internal code.

## 2026-05

### Kimi K2 series expansion
The K2 family continued to expand with improved reasoning and longer context support. Kimi has been positioning itself as a strong option for Chinese-language tasks and long-document analysis in addition to coding.

## What this means for users

Kimi K2.7 Code is one of the more interesting open-source coding releases of 2026. If you are already self-hosting models or running local coding agents, it is worth benchmarking against Qwen, DeepSeek-Coder, and Llama-based alternatives. The open-weights angle removes API lock-in but adds infrastructure work.

## What to watch

- Independent coding benchmarks on SWE-bench and HumanEval variants.
- Community fine-tunes and quantization quality.
- Whether Moonshot AI releases a corresponding chat/general-purpose model to pair with the coding specialist.

Sources: [Kimi K2.7 Code](https://www.kimi.com/resources/kimi-k2-7-code), [Kimi Forum announcement](https://forum.moonshot.ai/t/here-comes-kimi-k2-7-code-better-coding-with-more-efficiency/441)
