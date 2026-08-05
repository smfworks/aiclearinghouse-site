---
{
  "slug": "grok-4-5",
  "title": "xAI Grok 4.5",
  "excerpt": "xAI's flagship model with 500K context, aggressive pricing at $2/$6 per 1M tokens, and roughly 2x token efficiency over comparable frontier models.",
  "category": "xAI",
  "tags": ["reasoning", "coding", "api", "agents", "long-context", "cost-efficient"],
  "provider": "xAI",
  "input_price": 2.0,
  "output_price": 6.0,
  "context_window": 500000,
  "mmlu": 89.0,
  "humaneval": 88.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-08-05"
}
---

# xAI Grok 4.5

Grok 4.5 is xAI's flagship model, released July 9, 2026. It delivers frontier-level reasoning and coding at a fraction of the cost of comparable models, with roughly 2x token efficiency — solving tasks in under half the number of steps of competitors.

## Pricing

- API: $2.00 input / $6.00 output per 1M tokens
- Context window: 500,000 tokens
- Among the most competitively priced frontier models available

## Benchmarks

- SWE-bench Verified: ~87% (July 2026)
- SWE-bench Pro: 64.7% resolve rate (competitive with Opus 4.7 at 64.3%)
- Strong on the Artificial Analysis Intelligence Index
- Knowledge cutoff: early 2026

> Numbers from xAI public release materials and third-party leaderboards (July 2026). Re-verify before production budgeting.

## Key capabilities

- Complex reasoning and coding tasks
- Agentic workflows with efficient step counts
- Long-context processing up to 500K tokens
- Integrated with X (Twitter) for real-time information access
- Available via xAI API and OpenRouter

## Limitations

- Smaller context window than GPT-5.6 Sol (500K vs 1M)
- Less ecosystem maturity than OpenAI or Anthropic for production agent stacks
- Some users report content moderation restrictions limiting utility
- Reputation concerns around open-weight commitments not being honored

## When to pick it

Use Grok 4.5 when cost-per-task matters and you need frontier-level reasoning without frontier-level pricing. Its 2x token efficiency means it often completes agentic tasks at a quarter of the cost of GPT-5.6 Sol. For maximum context length, consider GPT-5.6 Sol or Qwen3.7 Flash (1M). For open-weight self-hosting, compare DeepSeek V4 Flash.