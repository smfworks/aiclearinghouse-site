---
slug: goose
title: Goose
excerpt: An open-source, extensible AI agent from Block that handles coding, planning, and tool use from the terminal. Best for teams that want a BYO-model agent with a growing ecosystem of extensions.
category: Open Source
tags:
  - coding
  - terminal
  - open-source
  - block
website: https://block.github.io/goose/
repository: https://github.com/block/goose
categories:
  - Coding
  - Terminal
  - Open Source
pricing: Open Source
runtime: Local
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - CLI
features:
  - Local-first terminal agent
  - MCP server integration
  - Multi-provider model support
  - Planning and execution loop
  - Extensible via Rust extensions
releaseYear: 2024
company: Block
last_verified: 2026-07-01
---

## When to choose Goose

Use Goose when you want a local, open-source coding agent that can grow with your stack. Goose is younger than Aider or Cline, but its MCP-native architecture and Block backing make it a strong choice for teams building agentic workflows on their own hardware.

## What it does well

- **Local by default.** Goose runs on your machine, keeps code in your repo, and lets you control where prompts go.
- **MCP-native tool use.** It connects to Model Context Protocol servers for filesystem, web, GitHub, databases, and more.
- **Bring your own model.** Works with OpenAI, Anthropic, Google, Ollama, and OpenRouter.
- **Planning loop.** Goose can break a task into steps, execute them, and adjust when tool output changes.
- **Rust core.** Fast startup and lower resource usage compared to some Node/Python agents.

## Honest limitations

- **Smaller community.** Fewer plugins and tutorials than Aider or Cline.
- **Rapid evolution.** APIs and extension patterns are still settling; expect breaking changes.
- **No built-in IDE.** Terminal-only for now; editor integrations are community-built.
- **Documentation gaps.** Some advanced configurations require reading source or issues.

## Best fit

Developers and platform teams who want an open, local agent with clean tool integration and the flexibility to swap models. Especially strong if you are already adopting MCP servers.

## Related

- [MCP Tool Calling Benchmark](/tests/mcp-tool-calling-benchmark)
- [Aider](/agents/aider)
- [Cline](/agents/cline)
