---
slug: qwen-alibaba
title: Qwen / Alibaba Cloud
excerpt: Recent updates to Alibaba's Qwen model family, including Qwen3.6, Qwen3-Mini, and Qwen-VL releases.
category: Model / API
tags:
  - Alibaba
  - Qwen
  - Qwen3.6
  - Qwen3-Mini
  - Qwen-VL
  - changelog
last_updated: 2026-06-24
last_verified: 2026-06-24
---

# Qwen / Alibaba Cloud Changelog

## 2026-06

### Qwen3.6 releases

Alibaba released the Qwen3.6 family, headlined by Qwen3.6-27B, a dense 27B-parameter model aimed at coding, reasoning, and agent workloads. The model is competitive with similarly sized open-weight models and is available through Alibaba Cloud, Ollama, vLLM, and OpenRouter.

Key traits:

- Strong coding and long-context recall.
- Support for NVFP4 quantization on compatible NVIDIA hardware.
- Available in Instruct variants for chat and agent use.

### Qwen3-Mini

Qwen3-Mini is a smaller, faster variant of the Qwen3 family. It targets edge devices, mobile applications, and high-volume API workloads where latency matters more than peak capability. The release includes improved instruction following and tool-use reliability.

### Qwen-VL updates

Qwen-VL received an update with better image understanding, chart and document parsing, and grounding. It is now easier to use for agents that read screenshots, diagrams, or scanned documents.

## 2026-05

### Qwen3 Coder 480B-A35B

Alibaba released a large mixture-of-experts coding specialist. With 480B total parameters and 35B active, it is positioned as a top open-weight coding model and is competitive with proprietary coding models on several benchmarks.

### Model pricing adjustments

Alibaba Cloud adjusted pricing for several Qwen API endpoints. Qwen3 235B-A22B and Qwen3 32B saw minor reductions, reinforcing Qwen's price-performance positioning against DeepSeek and Gemini Flash.

## What this means for users

If you are building agents on Qwen, the Qwen3.6 family is the most capable dense option to date. Qwen3-Mini is a good default for high-volume or latency-sensitive tasks, and Qwen-VL is now a credible vision option for document and UI agents.

The Qwen ecosystem continues to offer one of the strongest open-weight alternatives to proprietary frontier models. Alibaba Cloud's API remains the easiest hosted path, while Ollama and vLLM support makes local deployment straightforward.

## What to watch

- Pricing competition between Qwen3.6 and DeepSeek-V4 for agent backends.
- Whether Qwen3.6 gets wide support in coding agents like Cline, Aider, and Cursor.
- Further quantization formats beyond NVFP4 that reduce local serving cost.

Source: [Qwen release notes](https://qwen.ai/)
