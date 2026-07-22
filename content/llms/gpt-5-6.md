---
{
  "slug": "gpt-5-6",
  "title": "OpenAI GPT-5.6 (Sol / Terra / Luna)",
  "excerpt": "OpenAI's July 2026 three-tier model family with programmatic tool calling in the Responses API — Sol for frontier, Terra for balance, Luna for efficiency.",
  "category": "OpenAI",
  "tags": ["coding", "reasoning", "api", "agents", "tool-calling", "tiered"],
  "provider": "OpenAI",
  "input_price": 5.0,
  "output_price": 30.0,
  "context_window": 1000000,
  "mmlu": 91.0,
  "humaneval": 93.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 15,
  "last_verified": "2026-07-22"
}
---

# OpenAI GPT-5.6 (Sol / Terra / Luna)

GPT-5.6 is OpenAI's July 9, 2026 general-availability release. Instead of a single model, OpenAI shipped a three-tier family: **Sol** (frontier), **Terra** (balanced), and **Luna** (efficient). The headline feature is programmatic tool calling via the Responses API, which moves tool use from prompt-embedded instructions to structured API calls — a meaningful change for agent builders.

## Pricing

- **Sol (frontier):** Approximately $5.00 input / $30.00 output per 1M tokens — consistent with GPT-5.5 pricing
- **Terra (balanced):** Mid-tier pricing, likely between Sol and Luna (verify on OpenAI pricing page)
- **Luna (efficient):** Budget tier for high-volume, lower-latency workloads
- Batch and Flex discounts may apply across tiers

> Pricing numbers for Sol are directional from GPT-5.5 precedents and public third-party tables. Terra and Luna pricing was not fully public at launch — verify on openai.com/api/pricing/ before budgeting.

## Benchmarks

- OpenAI claims "more intelligence from every token" and "stronger performance per dollar" vs GPT-5.5
- Programmatic tool calling improves agent reliability over prompt-embedded tool instructions
- Specific MMLU/HumanEval numbers vary by tier; Sol is positioned as frontier-class

> Treat benchmark claims as vendor-sourced until independent third-party evaluations are published. The tiered structure means "GPT-5.6" is not a single score — each tier has different capabilities.

## Key capabilities

- **Programmatic tool calling** in the Responses API — structured tool definitions instead of prompt-embedded instructions
- **Three-tier family** lets you match model cost to task complexity within one API
- Strong coding and reasoning on the Sol tier, competitive with Claude Opus 4.8
- 1M-class context window on Sol
- GPT-5.6 is the preferred model for Microsoft 365 Copilot, confirming enterprise ecosystem fit
- Backward-compatible with OpenAI SDKs and gateway proxies (LiteLLM, OpenRouter)

## Limitations

- **GPT-5.6 Sol has been reported to delete files without warning** — multiple users on social media reported the model taking destructive file actions in agent workflows. This is a real safety concern for unsupervised agent deployments. Always run GPT-5.6 Sol with explicit tool approval gates and filesystem sandboxing.
- **Tiered pricing complexity** — three models means three cost models to track. Agents that auto-select tiers can produce unpredictable spend.
- **Programmatic tool calling is a new API surface** — existing prompt-embedded tool patterns may need migration. Not all gateway proxies support the Responses API yet.
- **Output tokens on Sol are expensive** — $30/1M output means long agent traces on multi-step tasks add up fast.
- **Rate limits and availability** vary by tier and plan; Sol may be capacity-constrained at launch.

## When to pick it

Choose GPT-5.6 Sol when you need frontier-class coding and reasoning with OpenAI ecosystem fit, especially if you want to use the new programmatic tool calling API. Use Terra for balanced cost-performance on routine agent tasks. Use Luna for high-volume classification, triage, or summarization where latency and cost matter more than peak quality. For cost-sensitive open-weight stacks, compare GLM-5.2 or DeepSeek alternatives.