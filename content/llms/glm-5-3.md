---
{
  "slug": "glm-5-3",
  "title": "GLM-5.3",
  "excerpt": "Z.ai's post-training upgrade to GLM-5.2 — same 743B base model, but coding and cybersecurity benchmarks jump sharply. The strongest open-weight coding model on launch-day numbers, with an emergent cyber capability.",
  "category": "Z.ai",
  "tags": ["coding", "agents", "open-weight", "cybersecurity", "chinese-llm", "reasoning"],
  "provider": "Z.ai",
  "input_price": 0.8,
  "output_price": 3.0,
  "context_window": 128000,
  "mmlu": 88.5,
  "humaneval": 92.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-08-19"
}
---

# GLM-5.3

## Overview

GLM-5.3 is Z.ai's latest model, released on August 14, 2026. What makes it unusual for a point release is that the base model is unchanged from GLM-5.2 — same 743B parameters, same architecture, same pre-training. Every gain comes from post-training alone. Yet the coding and agent numbers jump sharply, and the model picked up a cybersecurity capability that Z.ai says was unplanned.

The independent datapoint that matters most: on GDPval-AA v2 — the one benchmark row not run by Z.ai, scored by Artificial Analysis — GLM-5.3 posts 1769, ahead of Claude Fable 5 at 1743 and GPT-5.6 Sol at 1730. That is the strongest independent signal on launch day.

## Benchmarks

- **Terminal-Bench 3.0**: 4.6 → 28.3 (massive jump from GLM-5.2)
- **DeepSWE**: 46.2 → 66.9
- **Agents' Last Exam CLI**: 23.8 → 28.5
- **GDPval-AA v2** (independently scored by Artificial Analysis): 1769 — ahead of Fable 5 (1743) and GPT-5.6 Sol (1730)
- **CyberGym**: State of the art for vulnerability discovery; more than doubles GLM-5.2 on exploitation benchmarks

> Most eye-catching numbers (internal Code Bench, in-harness cyber scores) are vendor-reported and have not been independently replicated. The weight release, expected around end of August 2026, is when outside testing begins.

## Pricing

- API (Z.ai Coding Plan): approximately $0.80 input / $3.00 output per 1M tokens (same as GLM-5.2)
- Open-weight release expected ~August 28, 2026 (staged approach with safety evaluation first)
- OpenRouter and other aggregators expected to offer it shortly after API availability

> Pricing numbers are directional from public sources as of August 2026. Verify on the provider's pricing page before budgeting.

## Key capabilities

- **Coding agent performance**: Terminal-Bench 3.0 jump from 4.6 to 28.3 is the headline gain — this model is now competitive with frontier coding agents
- **Emergent cybersecurity skill**: State of the art on CyberGym for vulnerability discovery, with gains largest further up the exploitation chain
- **Same efficient base**: 743B parameters with cost-effective inference, unchanged from GLM-5.2
- **Open-weight roadmap**: Weights will be released after safety hardening — the first open-weight frontier coding model from a Chinese lab at this level
- **API available now**: Accessible via Z.ai's Coding Plan or API, though open weights are still staged

## Limitations

- **Weights not yet available**: Open weights expected end of August 2026; until then, API-only access
- **Vendor-reported benchmarks**: The most impressive numbers are Z.ai's own; independent replication pending
- **Dual-use cyber risk**: The cybersecurity capability creates genuine dual-use concerns, which is why Z.ai is taking a staged release approach
- **Smaller ecosystem**: Fewer SDKs, tutorials, and community tooling compared to OpenAI/Anthropic
- **Documentation**: Primarily in Chinese; English docs lag behind
- **Context window**: 128K is smaller than the 1M-class windows on Claude and Gemini flagships

## When to pick it

Choose GLM-5.3 when you want frontier-class coding agent performance at a fraction of Western flagship pricing, or when you need strong cybersecurity analysis capabilities. The post-training gains over GLM-5.2 are real and significant. For maximum ecosystem support and the largest context windows, Claude Fable 5 or GPT-5.6 Sol remain safer bets. For cost-sensitive agent stacks where coding is the primary workload, GLM-5.3 is one of the best value propositions available — once the weights drop, it will also be self-hostable.