---
{
  "slug": "qwen-agentworld-35b",
  "title": "Qwen-AgentWorld-35B-A3B",
  "excerpt": "Qwen's language world model that simulates agent environments across seven domains — MCP, search, terminal, SWE, Android, web, and OS — in a single 35B MoE model.",
  "category": "Qwen",
  "tags": ["world-model", "agent", "simulation", "open-weight", "moe", "long-context"],
  "provider": "Qwen",
  "input_price": 0.3,
  "output_price": 1.2,
  "context_window": 262144,
  "mmlu": 85.0,
  "humaneval": 82.0,
  "arena": "Specialist",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-07-22"
}
---

# Qwen-AgentWorld-35B-A3B

## Overview

Qwen-AgentWorld is the first language world model to cover seven agent interaction domains within a single model. Released by the Qwen team in June 2026, it simulates agentic environments via long chain-of-thought reasoning, predicting the next environment state given an agent's action and interaction history.

The seven domains are: MCP (tool calling), Search, Terminal, SWE (software engineering), Android, Web, and OS — spanning both text and GUI interaction environments.

## Architecture

- **Type:** Causal Language Model (Language World Model)
- **Base:** Qwen3.5-35B-A3B-Base
- **Parameters:** 35B total, 3B activated (MoE with 256 experts, 8 routed + 1 shared)
- **Context Length:** 262,144 tokens
- **Training Pipeline:** Continual Pre-Training (CPT) → Supervised Fine-Tuning (SFT) → Reinforcement Learning (RL via GSPO)
- **License:** Apache 2.0

The training is notable because environment modeling is the training objective from the CPT stage onward — not a post-hoc adaptation on a general-purpose LLM. This makes it a **native world model** rather than a fine-tuned chatbot.

## Performance

On AgentWorldBench (five-dimensional rubric: Format, Factuality, Consistency, Realism, Quality), Qwen-AgentWorld scores competitively against GPT-5.4 and Claude Opus 4.8 across all seven domains, with particularly strong results on MCP (tool calling) and OS simulation.

## Why it matters for agent builders

- **Agent evaluation:** Use it as a simulated environment to test agent behavior without real API calls or real browser sessions.
- **Cost reduction:** Simulate multi-step agent trajectories offline before burning tokens on real APIs.
- **Out-of-domain generalization:** Zero-shot generalizes to unseen environments like OpenClaw.
- **Controllable perturbations:** Inject fictional scenarios and edge cases that are hard to reproduce in real environments.

## Limitations

- Specialized for environment simulation — not a general-purpose chatbot replacement
- Requires significant compute to self-host (35B MoE, though only 3B active)
- 262K context is large but smaller than DeepSeek V4's 1M or Gemini 3.1 Pro's 1M
- Evaluation requires an LLM judge (recommended: GPT-5.2) for AgentWorldBench scoring

## How to run

Compatible with Hugging Face Transformers, vLLM, and SGLang. Recommended sampling: temperature 0.6, top_p 0.95, top_k 20, max output 32,768 tokens. Domain-specific system prompts are provided in the GitHub repository.

- **HuggingFace:** [Qwen/Qwen-AgentWorld-35B-A3B](https://huggingface.co/Qwen/Qwen-AgentWorld-35B-A3B)
- **GitHub:** [QwenLM/Qwen-AgentWorld](https://github.com/QwenLM/Qwen-AgentWorld)
- **Paper:** [arXiv:2606.24597](https://arxiv.org/abs/2606.24597)