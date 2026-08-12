---
slug: muse-spark-1-2
title: "Muse Spark 1.2"
excerpt: "Meta's frontier coding model co-trained with the Muse Code agent — improved agentic knowledge-work performance but no published benchmark scores at launch."
category: "Meta"
tags:
  - coding
  - reasoning
  - agents
  - frontier
  - meta
provider: "Meta Superintelligence Labs"
input_price: 3.0
output_price: 6.0
context_window: 128000
mmlu: null
humaneval: null
arena: "Top-tier"
image: "/images/agentmarketplace/llm-hero.svg"
order: 99
last_verified: "2026-08-12"
---

# Muse Spark 1.2

## Overview

Muse Spark 1.2 is Meta Superintelligence Labs' frontier model released on August 5, 2026, co-trained alongside the Muse Code terminal coding agent. It represents Meta's third model release in four months and significantly improves agentic knowledge-work capabilities over prior versions (Muse Spark 1.0 and 1.1). On the Artificial Analysis Intelligence Index v4.1, it scores 54 — putting Meta in a tie for third place among US labs alongside SpaceXAI.

Meta notably did **not** publish standard benchmark scores (MMLU, HumanEval, SWE-bench, MATH, GPQA, LiveCodeBench) at launch. The model's positioning is defined by its agentic performance: GDPval-AA v2 jumped 260 Elo compared to its predecessor, bringing Muse Spark 1.2 to fifth among all models Artificial Analysis had tested on that benchmark.

## Key characteristics

- **Co-trained with an agent**: Muse Spark 1.2 was trained alongside the Muse Code coding agent, meaning the model was optimized for real agentic coding workflows — planning, editing, and validating changes across large repositories — rather than just static benchmarks.
- **Multi-agent harness**: When used with Muse Code, the model distributes complex tasks to persistent background sub-agents rather than having a single agent handle everything, delivering both speed and quality.
- **Closed weights at launch**: Unlike Muse Glimmer (released five days later), Muse Spark 1.2 shipped with closed weights and a proprietary binary. Meta has committed to opening the weights in the coming weeks.
- **API access**: Available via the Meta Model API at dev.meta.ai, with an API contributor tier that trades training rights on customer prompts/completions for a steep input discount.

## Pricing

- API (Meta official): approximately $3.00 input / $6.00 output per 1M tokens (verify on dev.meta.ai before budgeting)
- API contributor tier offers discounted input pricing in exchange for training rights on your prompts and completions
- No open-weight release yet — self-hosting is not currently available

> Pricing numbers are directional from public sources as of August 2026. Meta has not published a formal pricing page. Always verify on the provider's site before budgeting.

## When to use it

- You need a frontier-tier coding model and want an alternative to Claude Opus 5 or GPT-5.6
- Your workflow benefits from multi-agent task distribution (via Muse Code)
- You are building agentic knowledge-work pipelines where GDPval-AA performance matters

## When to skip it

- You need open-weight models for self-hosting or data sovereignty (use Muse Glimmer instead)
- You require published benchmark scores for procurement decisions
- You need multimodal audio or video output

## Alternatives

- **Claude Opus 5** (Anthropic) — higher GDPval-AA scores, published benchmarks, stronger reasoning
- **GPT-5.6 Sol** (OpenAI) — competitive on coding, broader ecosystem
- **Muse Glimmer 30B** (Meta) — open-weight sibling for local deployment