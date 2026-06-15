---
slug: openhands
title: OpenHands
excerpt: Community-driven open-source platform for autonomous software engineering. Model-agnostic, sandboxed, and built for research and practical tasks.
category: Open Source
tags:
  - coding
  - research
  - open-source
  - model-agnostic
  - sandboxed
website: https://www.all-hands.dev
repository: https://github.com/All-Hands-AI/OpenHands
categories:
  - Coding
  - Research
  - Open Source
pricing: Open Source
runtime: Hybrid
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - Web
  - CLI
  - API
features:
  - Model-agnostic via LiteLLM
  - Sandboxed execution environment
  - Multi-step planning and debugging
  - Extensible agent architecture
  - Active open-source community
releaseYear: 2024
company: All Hands AI
last_verified: 2026-06-15
---

## When to choose OpenHands

Choose OpenHands when you want an open, research-grade platform for autonomous software engineering. It is ideal for teams who need to experiment with agent architectures, benchmark models, or run long tasks in a controlled sandbox.

## What it does well

- **True model freedom.** OpenHands routes through LiteLLM, so you can use OpenAI, Anthropic, Google, local Ollama, and dozens of other providers.
- **Sandboxed execution.** Code runs inside a container, which limits the blast radius if an agent makes a bad move.
- **Extensible agents.** The architecture supports multiple agent implementations. Researchers can swap planning, reflection, and tool-use strategies.
- **Web, CLI, and API.** Use the friendly web UI for exploration, the CLI for automation, or the API for integration with your own systems.
- **Active community.** All Hands AI runs evaluations, publishes benchmarks, and accepts contributions. The project moves quickly and transparently.

## Honest limitations

- **Setup complexity.** Docker, provider keys, and configuration files are required. It is not a one-click install.
- **Research tool feel.** The UX is functional, not polished. If you want a glossy IDE integration, look elsewhere.
- **Quality varies by model.** OpenHands exposes the underlying model more directly than closed products. A weak model will give weak results.
- **Not a managed service.** You run it yourself or use their cloud preview. Production reliability is your responsibility.

## Best fit

Researchers, platform engineers, and advanced users who want to run, measure, and extend autonomous coding agents with full control over models and execution.
