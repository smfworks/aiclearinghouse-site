---
slug: hermes-agent
title: Getting Started with Hermes Agent
excerpt: Install the self-improving, provider-agnostic AI agent that learns from your workflows.
category: Agent Setup
tags:
  - hermes
  - hermes agent
  - nous research
  - getting started
  - skills
  - memory
last_verified: 2026-06-15
---

# Getting Started with Hermes Agent

Hermes Agent is an open-source autonomous agent built by Nous Research. It is designed to be the only assistant you need: it can chat in your terminal, send and receive messages on Telegram, Discord, Slack, WhatsApp, Signal, and Email, and it improves itself over time by saving reusable skills and building persistent memory of your preferences.

Hermes is model-agnostic, so you are not locked into a single provider. You can run it on a $5 VPS, a local desktop, a GPU server, or even Android via Termux. The same agent process can serve a personal chat interface, a team bot, and an always-on automation worker at the same time.

## What Hermes Agent is

Hermes wraps several capabilities into one runtime:

- **Conversational agent** — multi-turn reasoning with tool use across files, web search, browsers, code execution, and messaging.
- **Skill learner** — after complex tasks, Hermes can create reusable skills that improve with each use. Skills follow the open [agentskills.io](https://agentskills.io) standard.
- **Memory system** — cross-session recall via FTS5 session search, LLM summarization, and user modeling (Honcho dialectic integration).
- **Messaging gateway** — connect Telegram, Discord, Slack, WhatsApp, Signal, Email, and more to a single agent process.
- **Automation scheduler** — built-in cron for daily reports, nightly research, backups, and recurring tasks described in natural language.
- **Subagent orchestration** — spawn isolated workers for parallel pipelines, with Python scripts that call tools via RPC.

## Strengths

- **Provider freedom.** Switch between 20+ providers — Nous Portal, OpenRouter, NVIDIA NIM, Kimi/Moonshot, MiniMax, Hugging Face, OpenAI, and custom endpoints — without changing code.
- **Self-improving workflow.** Skills created from real tasks get refined each time they run, so the agent gets cheaper and more reliable for repeated work.
- **Terminal-first but not terminal-only.** A polished TUI for power users plus messaging bridges for everyone else.
- **Runs anywhere.** Seven terminal backends: local, Docker, SSH, Singularity, Modal, Daytona, and Vercel Sandbox. Daytona and Modal offer serverless persistence that hibernates when idle.
- **Research-ready tooling.** Batch trajectory generation, RL environments, and trajectory compression for training the next generation of tool-calling models.

## Requirements

Minimum practical setup:

- **Git** — the only hard prerequisite on non-Windows platforms.
- **A supported OS:** Linux, macOS, Windows, WSL2, or Android (Termux).
- A model provider or local endpoint:
  - Easiest path: [Nous Portal](https://portal.nousresearch.com) subscription.
  - BYO-key path: OpenRouter, OpenAI, Anthropic, Kimi, MiniMax, etc.
  - Local path: your own OpenAI-compatible endpoint or llama.cpp server.
- The installer auto-installs:
  - Python 3.11 (via `uv`)
  - Node.js 22
  - ripgrep
  - ffmpeg

For Android/Termux, use the dedicated [Termux guide](https://hermes-agent.nousresearch.com/docs/getting-started/termux) because the install path is curated for mobile constraints.

## How to get started

### 1. Install Hermes Agent

Recommended: download the [Hermes Desktop installer](https://hermes-agent.nousresearch.com/desktop) for macOS or Windows to get both the GUI and CLI in one step.

For command-line only install:

**Linux / macOS / WSL2 / Android (Termux):**

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Windows (native PowerShell):**

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Then reload your shell:

```bash
source ~/.bashrc   # or source ~/.zshrc
```

### 2. Pick your provider

The fastest one-command setup uses Nous Portal:

```bash
hermes setup --portal
```

That logs you in, sets Nous as your provider, and turns on the Tool Gateway (web search, image generation, TTS, cloud browser) in one step.

If you already know your provider, run:

```bash
hermes model
```

### 3. Start chatting

```bash
hermes
```

Run a real task — ask it to explain a file, write a script, or search the web — and verify it responds before layering on more features.

### 4. Connect channels (optional)

Once the base chat works, set up the messaging gateway:

```bash
hermes gateway setup
```

Then connect Telegram, Discord, Slack, or WhatsApp so you can talk to the same agent from anywhere.

### 5. Enable automation (optional)

Use the built-in scheduler for recurring tasks:

```bash
hermes cron add "every day at 8am" "Summarize my unread newsletters"
```

## Resources

### Official

- [Hermes Agent website](https://hermes-agent.nousresearch.com)
- [Official documentation](https://hermes-agent.nousresearch.com/docs/)
- [Quickstart guide](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Installation guide](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Termux / Android guide](https://hermes-agent.nousresearch.com/docs/getting-started/termux)
- [Learning path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path)
- [GitHub repository](https://github.com/NousResearch/hermes-agent)
- [Hermes Desktop download](https://hermes-agent.nousresearch.com/desktop)
- [Nous Portal](https://portal.nousresearch.com)

### Video and community

- [Hermes Agent Tutorials & Use Cases YouTube playlist](https://www.youtube.com/playlist?list=PLmpUb_PWAkDxewld5ZYyKifuHxgIbiq2d)
- [Onchain AI Garage Masterclass](https://www.youtube.com/@OnchainAIGarage) (installation walkthrough)
- [Nous Research Discord](https://discord.gg/NousResearch)

### Reference and mirrors

- [Hermes Agent docs mirror / cheatsheet](https://hermes-agent.app/en/docs) (community-maintained)
- [mudrii/hermes-agent-docs](https://github.com/mudrii/hermes-agent-docs) (comprehensive community docs)

### Related SMF Clearinghouse entries

- [Hermes Agent profile](/agents/hermes-agent)
- [Setting up the Hermes gateway](/guides/setting-up-hermes-gateway)
- [Local-first coding agents](/guides/local-first-coding-agents)
