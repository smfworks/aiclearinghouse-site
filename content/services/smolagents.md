---
slug: smolagents
title: "smolagents: HuggingFace's Code-First Agent Framework"
excerpt: "A deliberately tiny agent framework where agents write Python code as actions instead of emitting JSON tool calls. ~1,000 lines of core logic, model-agnostic, Hub-integrated."
category: Tools
tags:
  - agent-framework
  - huggingface
  - code-agent
  - python
  - open-source
provider: Hugging Face
pricing_model: Free
price: "Free (MIT license); inference costs depend on model choice"
website: https://github.com/huggingface/smolagents
image: /images/agentmarketplace/services-hero.svg
order: 31
last_verified: "2026-08-05"
---

# smolagents: HuggingFace's Code-First Agent Framework

## What it is

smolagents is HuggingFace's minimalist agent framework built around a single thesis: agents that write Python code as their actions outperform agents that emit JSON tool calls on many benchmarks. The entire core logic fits in roughly 1,000 lines of code. There is no orchestration DSL, no graph editor, no role-play abstraction — just a `CodeAgent` that generates Python to call tools, and a `ToolCallingAgent` for traditional JSON tool use.

## When to use it

- You want the simplest possible agent framework with the fewest hidden abstractions
- You believe code-as-action produces better results than JSON tool calls for your tasks
- You want native HuggingFace Hub integration for sharing and pulling tools/agents
- You need model-agnostic support (OpenAI, Anthropic, local transformers, Ollama, LiteLLM, OpenRouter)
- You are prototyping agent workflows and want to iterate fast without framework overhead

## What it does well

- **Genuinely minimal.** The core fits in ~1,000 lines. You can read the entire agent implementation in one sitting. This matters for debugging — when something goes wrong, you can trace through the actual code rather than navigating framework internals.

- **Code agents as first-class.** The `CodeAgent` writes Python code that directly calls tools, which HuggingFace's research shows outperforms JSON tool-calling on many tasks. Code is more expressive than JSON — you can loop, branch, and compose tool calls naturally.

- **Sandboxed execution.** Code agents execute in sandboxed environments via E2B, Modal, Blaxel, or Docker. You are not running LLM-generated code on your bare machine. This is the right default for security.

- **Model-agnostic.** Works with any LLM through `InferenceClientModel` (HuggingFace providers), `LiteLLMModel` (100+ LLMs), `OpenAIModel` (any OpenAI-compatible endpoint), `TransformersModel` (local), or `OllamaModel` (local Ollama). Switching models is a one-line change.

- **Hub integration.** Push and pull tools/agents to/from the HuggingFace Hub. This is unique — you can share an agent as a Space repository and someone else can load it with `agent.from_hub("username/my_agent")`.

- **MCP support.** Tools from any MCP server work natively via `ToolCollection.from_mcp`. Also supports LangChain tools and Hub Spaces as tools.

- **Multimodal.** Agents support text, vision, video, and audio inputs.

## Honest limitations

- **Code execution has a security surface.** Even with sandboxing, running LLM-generated code is inherently riskier than structured JSON tool calls. The sandboxing options (E2B, Modal, Docker) help, but you need to understand the isolation model you choose. If you skip sandboxing and run locally, you are executing untrusted code on your machine.

- **Not built for complex multi-agent orchestration.** smolagents handles `managed_agents` (agents calling other agents), but it is not designed for the complex role-based multi-agent workflows that CrewAI or AutoGen target. If you need a "team of specialists" pattern, this is the wrong tool.

- **Young ecosystem.** Fewer off-the-shelf integrations than LangChain. The Hub tool-sharing is promising but the library of shared tools is still growing. You will build more yourself.

- **Code generation can fail.** When the model writes broken Python, the agent must detect the error, retry, and recover. This loop works but adds latency and token cost compared to structured tool calls that fail more predictably.

- **No built-in observability or evaluation.** smolagents gives you agent execution but no tracing dashboard, no cost tracking, no eval pipeline. For production use, you need to pair it with Langfuse, Pydantic Logfire, or similar.

- **Documentation is good but thin in places.** The launch blog post and API docs cover the basics. Advanced patterns (custom tool design, managed agent orchestration, error handling) require reading source code.

## Pricing reality

- The framework itself is free and MIT-licensed
- Your cost is inference: whichever model you point it at. Running locally with Ollama or transformers costs nothing per call. Running against Claude or GPT-5.5 incurs standard API costs
- E2B sandbox usage has its own pricing (free tier available, then per-compute)
- Modal sandbox usage is pay-per-compute

## Best fit

Developers who want the absolute minimum framework between themselves and their LLM, who are comfortable reading Python source code, and who believe code-as-action is the right paradigm. Especially strong for research prototyping, single-agent tool-use workflows, and anyone already in the HuggingFace ecosystem. Not the right choice if you need enterprise-grade multi-agent orchestration, built-in governance, or a visual workflow builder.

## Common integrations

- **HuggingFace Hub** for sharing/loading tools and agents
- **E2B / Modal / Docker** for sandboxed code execution
- **LiteLLM** for accessing 100+ LLM providers through one interface
- **MCP servers** for tool access via Model Context Protocol
- **LangChain** tools (importable via `Tool.from_langchain`)