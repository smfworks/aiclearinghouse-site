---
{
  "slug": "glm-5-turbo",
  "title": "GLM-5 Turbo",
  "excerpt": "Z.ai's OpenClaw-optimized model — built specifically for agent workflows with enhanced tool calling, long-chain execution, scheduled tasks, and persistent operations. 200K context at $0.48/$1.60 per million tokens.",
  "category": "Z.ai",
  "tags": ["agents", "tool-calling", "openclaw", "long-context", "reasoning", "chinese-llm"],
  "provider": "Z.ai",
  "input_price": 0.48,
  "output_price": 1.6,
  "context_window": 200000,
  "mmlu": 87.0,
  "humaneval": 90.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-08-26"
}
---

# GLM-5 Turbo

## Overview

GLM-5 Turbo is Z.ai's model purpose-built for the OpenClaw agent scenario. Unlike general-purpose LLMs that get agent capabilities through post-training bolt-ons, GLM-5 Turbo was optimized for agent workflows from the training data construction phase through to the design of optimization objectives. The result is a model that handles tool invocation, command following, scheduled and persistent tasks, and high-throughput long-chain execution with notably better stability than generalist models.

The model ships with multiple thinking modes for different scenarios, real-time streaming, intelligent caching for long conversations, structured JSON output, and flexible MCP tool integration. At $0.48 per million input tokens and $1.60 per million output tokens — with cached input at just $0.10 — it is one of the most cost-effective agent-capable models available.

## Key Specifications

- **Context window**: 200,000 tokens (128K for ClawBench scenarios)
- **Input price**: $0.48/M tokens
- **Output price**: $1.60/M tokens
- **Cached input**: $0.10/M tokens
- **License**: Available via Z.ai API
- **SDK**: Python (`zai-sdk`), Java, REST API

## Agent-Optimized Capabilities

- **Tool calling**: Precise invocation with fewer failures in multi-step tasks. The model was trained on real-world agent workflow scenarios, not synthetic tool-use examples.
- **Instruction following**: Enhanced decomposition of complex, multi-layered, long-chain instructions. Accurately identifies objectives, plans steps, and supports collaborative task division among multiple agents.
- **Scheduled and persistent tasks**: Better understanding of time dimensions for scheduled triggers, continuous execution, and long-running tasks. Maintains execution continuity during complex, multi-hour operations.
- **High-throughput long chains**: Faster and more stable execution for tasks involving high data throughput and long logical chains.

## ZClawBench

Z.ai introduced ZClawBench alongside GLM-5 Turbo — an end-to-end benchmark designed specifically for agent tasks in the OpenClaw ecosystem. It evaluates models on real-world agent workflows rather than academic tasks, making it a more honest measure of production agent capability.

## Getting started

```bash
pip install zai-sdk
```

```python
from zai import ZaiClient

client = ZaiClient(api_key="your-api-key")
response = client.chat.completions.create(
    model="glm-5-turbo",
    messages=[{"role": "user", "content": "Your agent task here"}],
    thinking={"type": "enabled"},
    max_tokens=4096,
    temperature=1.0,
)
print(response.choices[0].message)
```

Streaming is supported via `"stream": true` with `temperature=0.6` for instant mode.

## When to use it

- **Agent-first workloads** where tool calling reliability matters more than raw benchmark scores
- **Long-running scheduled tasks** — the model's temporal understanding is a differentiator
- **Cost-sensitive agent pipelines** — at $0.48/$1.60, it undercuts most frontier models by 5-10x
- **OpenClaw ecosystems** — the model was literally built for this

## When to look elsewhere

- **Maximum context** — 200K is solid but GLM-5.2 offers 1M and DeepSeek V4-Pro offers 1M
- **Self-hosting** — no open-weight release yet; API only
- **Frontier reasoning** — GLM-5.2 and GLM-5.3 post higher numbers on math and coding benchmarks

## Pricing context

At $0.48 input / $1.60 output, GLM-5 Turbo sits in the value tier alongside models like Ling 3.0 Flash. The cached input rate of $0.10/M makes it especially attractive for agents that retry or re-read common context — a pattern common in long-chain workflows.