---
slug: openclaw
title: Getting Started with OpenClaw
excerpt: Run your own personal AI assistant on your devices and the channels you already use.
category: Agent Setup
tags:
  - openclaw
  - personal assistant
  - self-hosted
  - getting started
last_verified: 2026-06-15
order: 2
---

# Getting Started with OpenClaw

OpenClaw is a personal AI assistant you run on your own machines. It answers you on the messaging channels and surfaces you already use — WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Google Chat, web chat, and more — while keeping your data under your control.

Unlike cloud-only assistants, OpenClaw is designed to be local-first: the **Gateway** is the control plane, but the assistant lives in your workspace. You can run it on a laptop, a home server, a VPS, or a cloud instance, and you choose which models and tool policies it uses.

## What OpenClaw is

OpenClaw is best understood as three layers:

- **Your agent** — the persona, model, memory, and skills that make up the assistant.
- **The Gateway** — a local Node service that routes messages, runs tools, serves the web dashboard, and connects channels.
- **Your workspace** — the files, config, and persistent state that live under `~/.openclaw/workspace`.

The project is open source and model-agnostic. It supports API-based providers (OpenAI, Anthropic, Google, MiniMax, Kimi, OpenRouter, etc.) and local providers such as Ollama, while giving you granular control over sandboxing, tool approval, and routing.

## Strengths

- **Privacy by default.** Conversations and workspace data stay on hardware you control.
- **Channel breadth.** Native support for 20+ chat platforms means you can talk to the same agent from Telegram while at the store and Slack while at your desk.
- **Multi-agent ready.** Built for fleets of agents with isolated workspaces, per-agent tool policies, and delegated sub-agents.
- **Skill ecosystem.** Install reusable skills from ClawHub or write your own in TypeScript/JavaScript.
- **Local + cloud hybrid.** Use cheap local models for routine tasks and cloud models for heavier reasoning.
- **Fail-closed security.** Recent releases added stricter exec approvals, sandbox boundaries, and transcript isolation.

## Requirements

Minimum practical setup:

- **Node.js 24** (recommended) or **Node.js 22.19+** — the installer handles this.
- **macOS, Linux, or Windows/WSL2** — WSL2 is strongly recommended on Windows.
- **Git** — used by the installer to pull the repo.
- A model provider account or local model runtime:
  - API key route: OpenAI, Anthropic, OpenRouter, MiniMax, Kimi, Google, etc.
  - Local route: [Ollama](/agents/ollama) with a downloaded model.
- Optional but useful:
  - **Brave Search API key** or another web-search provider for research tools.
  - A persistent host or VPS if you want always-on messaging.

Windows users can also install the native **Windows Hub** companion app for a GUI-first setup path.

## How to get started

### 1. Install OpenClaw

Run the installer on macOS, Linux, or WSL2:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

On Windows PowerShell:

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

If you already manage Node yourself, you can also use npm/pnpm/bun:

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 2. Run the onboarding wizard

```bash
openclaw onboard
```

The wizard walks you through:

- Local vs remote Gateway
- Model provider and auth (OAuth or API key)
- Channels (Telegram, Discord, WhatsApp, Slack, etc.)
- Workspace defaults
- Optional background daemon

For the fastest first chat without configuring any channel, run:

```bash
openclaw dashboard
```

This opens the Control UI in your browser at `http://127.0.0.1:18789/`.

### 3. Choose your model

During onboarding you pick a default model. For local-first use, pair OpenClaw with [Ollama](/agents/ollama). For heavier tasks, use a cloud provider. You can change this anytime:

```bash
openclaw configure
openclaw agents add <name>
```

### 4. Secure the setup

New local setups default to a strict tool profile. Review these before giving the agent broad access:

- `tools.profile` — controls which tool categories are enabled.
- `sandbox.mode` — controls whether group/channel sessions are sandboxed.
- `session.dmScope` — controls who can message the agent directly.

## Resources

### Official

- [OpenClaw website](https://openclaw.ai)
- [OpenClaw documentation](https://docs.openclaw.ai)
- [Getting Started guide](https://docs.openclaw.ai/start/getting-started)
- [Installation reference](https://docs.openclaw.ai/install)
- [CLI onboarding wizard](https://docs.openclaw.ai/start/wizard)
- [GitHub repository](https://github.com/openclaw/openclaw)
- [Docker install guide](https://docs.openclaw.ai/install/docker)
- [Windows Hub / Windows setup](https://docs.openclaw.ai/platforms/windows)

### Community

- [OpenClaw Discord](https://discord.gg/clawd)
- [DeepWiki mirror](https://deepwiki.com/openclaw/openclaw)
- [Nix install package](https://github.com/openclaw/nix-openclaw)

### Related SMF Clearinghouse entries

- [OpenClaw agent profile](/agents/openclaw)
- [Run Ollama on Ubuntu with NVIDIA CUDA](/deployment-recipes/ollama-ubuntu-cuda)
- [Setting up the Hermes gateway](/guides/setting-up-hermes-gateway)
