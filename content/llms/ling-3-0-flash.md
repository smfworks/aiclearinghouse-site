---
{
  "slug": "ling-3-0-flash",
  "title": "Ling 3.0 Flash",
  "excerpt": "InclusionAI's 124B MoE with only 5.1B active parameters — competitive intelligence at open-weight prices, 262K context, 403 tok/s output.",
  "category": "InclusionAI",
  "tags": ["reasoning", "general", "agentic", "open-weight", "api"],
  "provider": "InclusionAI",
  "input_price": 0.07,
  "output_price": 0.22,
  "context_window": 262144,
  "mmlu": null,
  "humaneval": null,
  "arena": "Upper-mid",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 100,
  "last_verified": "2026-08-12"
}
---

# Ling 3.0 Flash

InclusionAI's Ling 3.0 Flash is a Mixture-of-Experts reasoning model released August 4, 2026. It uses 124 billion total parameters but only 5.1 billion active per token — giving it the inference cost profile of a small model with the intelligence of a much larger one. It is open-weight, available via API through InclusionAI and Novita, and competes with Qwen3 and DeepSeek models in the mid-tier reasoning space.

## Pricing

| Token Type | Price (per 1M tokens) |
|---|---|
| Input | $0.07 |
| Output | $0.22 |
| Cache Hit | $0.015 |
| Cache Write | Not published separately |

Pricing is from InclusionAI's API. Novita offers the same model at similar rates. The blended cost (7:2:1 cache hit/input/output ratio) is approximately $0.05 per 1M tokens — competitive for a reasoning model at this intelligence tier.

## Key Benchmarks (August 2026)

| Benchmark | Ling 3.0 Flash | Notes |
|---|---|---|
| Artificial Analysis Intelligence Index | 38 | Well above median (9) for open-weight models of similar size |
| Output speed | 403 tok/s | Well above median (110 tok/s) |
| Time to first token | 2.06s | Slightly above median (1.83s) |
| Context window | 262K | Native, extendable to 1M per model card |

MMLU and HumanEval scores are not independently published at this date. The Intelligence Index composite covers GDPval, Terminal-Bench v2.1, SciCode, Humanity's Last Exam, GPQA Diamond, and other evaluations.

## Key capabilities

- **Reasoning model.** Uses chain-of-thought / extended thinking for complex problems. A non-reasoning variant may also exist.
- **Tool calling.** Native function calling with significantly improved accuracy over Ling 2.6 Flash.
- **Long context.** 262K native context, extendable to 1M. Improved stability in long-horizon tasks compared to the previous flash generation.
- **Switchable thinking modes.** Supports Thinking and Instant modes for trading reasoning depth against speed.
- **Prompt caching.** Supported natively at $0.015/1M cache hit.
- **MoE efficiency.** 124B total / 5.1B active means local deployment is feasible on a single 80GB GPU with quantization, while API costs are low.

## Limitations

- **Text only.** No image, audio, or video input. This is a language model, not multimodal.
- **No independent MMLU/HumanEval published.** InclusionAI has not published standard academic benchmark numbers. The Artificial Analysis Intelligence Index is the primary independent evaluation available. Teams that rely on MMLU comparisons will find a gap.
- **Very verbose.** Ling 3.0 Flash generated 240M output tokens during the Intelligence Index evaluation vs a median of 57M. This means higher output token costs in practice than the raw $0.22/1M suggests — the model writes a lot.
- **Small ecosystem.** Fewer integrations, community examples, and deployment guides compared to Qwen3 or DeepSeek. You are more likely to read the model card than find a blog post.
- **TTFT above average.** 2.06s time to first token is not bad but is above the median for open-weight models of similar size. For latency-sensitive real-time applications, test before committing.

## When to use it

- Cost-sensitive reasoning workloads where output verbosity is acceptable
- Long-context document processing (262K–1M tokens)
- Tool-calling agent loops where the improved function-calling accuracy matters
- Teams who want open weights for data sovereignty and local deployment optionality
- API-based prototyping at $0.07 input / $0.22 output — among the cheapest reasoning models available

## Alternatives

- **Qwen3 30B A3B** — smaller MoE, $0 input on Qwen's own API, stronger ecosystem
- **DeepSeek V4 Flash** — competitive open-weight reasoning, larger community
- **GLM-5.2** — Zhipu's model, stronger tool-calling ecosystem, higher cost

> Pricing verified against Artificial Analysis and PricePerToken on 2026-08-12. Benchmark data from Artificial Analysis Intelligence Index v4.1.1. Open-weight status confirmed on HuggingFace.