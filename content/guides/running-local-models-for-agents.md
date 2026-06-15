---
{
  "slug": "running-local-models-for-agents",
  "title": "Running Local Models for Agents",
  "excerpt": "When to use local LLMs with your agent, and how to pick the right hardware.",
  "category": "Infrastructure",
  "tags": [
    "agents",
    "local-llm",
    "ollama",
    "privacy"
  ],
  "order": 6,
  "last_verified": "2026-06-14"
}
---

# Running Local Models for Agents

When to use local LLMs with your agent, and how to pick the right hardware.

## When it makes sense

- Your code or data cannot leave your machine.
- You want predictable monthly costs instead of token bills.
- You are iterating on prompts and want zero latency to the API.

## Common stack

- **Ollama** or **LM Studio** for model serving
- **Qwen**, **Llama**, **DeepSeek**, or **Gemma** for coding-capable open models
- **Hermes**, **OpenClaw**, **Cline**, or **Aider** as the agent layer

## Hardware guidance

- Small models (7B–9B) run well on modern laptops with 16 GB RAM.
- Larger coding models (32B–70B) need a dedicated GPU with 24 GB+ VRAM.
- For serious local work, rent a GPU cloud instance by the hour instead of buying hardware.

Local models trade some capability for control. Start with cloud, then move local once you know exactly what quality bar you need.
