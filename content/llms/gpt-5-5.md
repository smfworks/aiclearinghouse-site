---
{
  "slug": "gpt-5-5",
  "title": "OpenAI GPT-5.5",
  "excerpt": "OpenAI's widely available 2026 coding and reasoning workhorse for ChatGPT, Codex, and the API — strong tool use with a large context window.",
  "category": "OpenAI",
  "tags": ["coding", "reasoning", "api", "agents", "codex"],
  "provider": "OpenAI",
  "input_price": 5.0,
  "output_price": 30.0,
  "context_window": 1000000,
  "mmlu": 90.0,
  "humaneval": 92.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 12,
  "last_verified": "2026-07-13"
}
---

# OpenAI GPT-5.5

GPT-5.5 is OpenAI's broadly available 2026 generation model for product, API, and Codex workflows. It sits as the buyable OpenAI coding/reasoning default while gated previews remain restricted.

## Pricing

- API (standard): about $5.00 input / $30.00 output per 1M tokens (confirm on OpenAI pricing)
- Context: up to ~1M tokens on API configurations; some product surfaces advertise smaller windows
- Batch / Flex discounts and Priority tiers may apply

## Benchmarks

- Competitive on coding and agent tool-use leaderboards against Claude Opus and Gemini Pro class models
- Strong structured output and function-calling behavior for agent stacks

> Numbers above are from OpenAI public launch materials and third-party pricing tables (2026). Re-verify before production budgeting.

## Key capabilities

- Coding agents (Codex, custom tool loops)
- Multimodal inputs where enabled
- Structured outputs / function calling
- Broad ecosystem support (SDKs, Azure, gateway proxies)

## Limitations

- Output tokens are expensive on long agent traces
- Model routing between Thinking / Pro / Fast modes can confuse cost models
- Availability and rate limits vary by plan and region

## When to pick it

Use GPT-5.5 when you want OpenAI ecosystem fit and strong general coding. For pure cost-sensitive open-weight serving, compare DeepSeek, Qwen, and GLM alternatives.
