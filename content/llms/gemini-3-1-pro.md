---
{
  "slug": "gemini-3-1-pro",
  "title": "Google Gemini 3.1 Pro",
  "excerpt": "Google's high-capability multimodal model for long context, coding agents, and Vertex / AI Studio deployments.",
  "category": "Google",
  "tags": ["multimodal", "long-context", "coding", "api", "vertex"],
  "provider": "Google",
  "input_price": 2.5,
  "output_price": 15.0,
  "context_window": 1000000,
  "mmlu": 89.5,
  "humaneval": 90.0,
  "arena": "Competitive",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 13,
  "last_verified": "2026-07-13"
}
---

# Google Gemini 3.1 Pro

Gemini 3.1 Pro is Google's high-capability multimodal tier aimed at long-context analysis, coding, and agent workloads on AI Studio and Vertex AI.

## Pricing

- Approximate API band (mid-2026 third-party tables): often lower input cost than top Anthropic/OpenAI flagships; verify current Google Cloud / AI Studio rates
- Large context windows (hundreds of K to 1M-class depending on SKU)
- Caching and batch options on Vertex can dominate real unit economics

## Benchmarks

- Competitive on multimodal and long-document tasks
- Coding agent performance is strong but harness-dependent — Gemini models often need careful tool schema and retry policy

> Treat pricing rows as directional until confirmed on Google Cloud Pricing Calculator for your region and SKU.

## Key capabilities

- Native multimodality (text, image, video surfaces depending on product)
- Long-context workflows for large document sets
- Vertex enterprise controls (VPC-SC, IAM, audit)

## Limitations

- Tool-calling quality varies by API surface and schema strictness
- Quota and region availability can block production rollouts
- Safety filters occasionally over-refuse legitimate engineering content

## When to pick it

Pick Gemini 3.1 Pro when you are already on GCP/Vertex, need multimodal plus long context, and want enterprise admin controls. Benchmark tool-calling on your tools before replacing a Claude or OpenAI agent default.
