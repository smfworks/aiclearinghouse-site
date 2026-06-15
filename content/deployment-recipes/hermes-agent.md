---
slug: hermes-agent
title: Deploy Hermes Agent
excerpt: Install Nous Research's provider-agnostic, self-improving agent and connect it to messaging, memory, and skills.
category: Agent Deployment
tags:
  - hermes
  - hermes-agent
  - nous-research
  - agent
  - self-hosting
  - skills
  - open-source
order: 2
last_verified: 2026-06-15
---

# Deploy Hermes Agent

## The promise

Hermes Agent is the most ambitious open-source personal agent project shipping today. Built by Nous Research, it is designed to be the only assistant you need: it chats in your terminal, bridges to Telegram, Discord, Slack, WhatsApp, Signal, and email, and — critically — it learns. After complex tasks, Hermes writes reusable skills and remembers your preferences across sessions.

This recipe gets you from zero to a working Hermes install with a provider and a real task. By the end, you will have an agent that improves itself every time you use it.

## What you'll get

- Hermes Agent installed via the official installer
- A chosen provider (Nous Portal recommended for speed, BYO-key for flexibility)
- A working chat loop in the terminal
- Optional messaging gateway and cron automation configured

## Prerequisites

- Linux, macOS, Windows, WSL2, or Android (Termux)
- Git
- A model provider account or local endpoint:
  - Fastest path: [Nous Portal](https://portal.nousresearch.com) subscription
  - BYO-key path: OpenRouter, OpenAI, Anthropic, Kimi, MiniMax, etc.
  - Local path: your own OpenAI-compatible endpoint or llama.cpp server
- The installer auto-installs Python 3.11 (via `uv`), Node.js 22, ripgrep, and ffmpeg

For Android/Termux, use the dedicated [Termux guide](https://hermes-agent.nousresearch.com/docs/getting-started/termux) because the install path is curated for mobile constraints.

## Step 1: Install Hermes Agent

The recommended route for desktop users is the Hermes Desktop installer, which bundles the GUI and CLI.

- Download from [hermes-agent.nousresearch.com/desktop](https://hermes-agent.nousresearch.com/desktop)

For command-line only install, run the appropriate command for your platform.

**Linux / macOS / WSL2 / Android (Termux):**

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Windows PowerShell:**

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Reload your shell:

```bash
source ~/.bashrc   # or source ~/.zshrc
```

Verify:

```bash
hermes --version
```

If you see a version number, the install succeeded.

## Step 2: Pick your provider

Hermes is provider-agnostic — you are not locked into one model family. The fastest one-command setup uses Nous Portal:

```bash
hermes setup --portal
```

That logs you in, sets Nous as your provider, and turns on the Tool Gateway (web search, image generation, TTS, cloud browser) in one step.

If you already know your provider, run:

```bash
hermes model
```

This opens an interactive picker. Available options include Nous Portal, OpenRouter, NVIDIA NIM, Kimi/Moonshot, MiniMax, Hugging Face, OpenAI, Anthropic, and custom endpoints.

## Step 3: Start your first chat

```bash
hermes
```

Ask a real task:

> "Explain the difference between a thread and a process, then give me a one-liner I can tweet."

Hermes should:

1. Think through the answer.
2. Produce a concise explanation.
3. Offer the tweet-sized version.

If the response looks coherent, the base chat loop is working.

## Step 4: Teach Hermes a skill

This is where Hermes separates itself from ordinary agents. Run a complex task, then let it save a reusable skill.

Example:

```
> Summarize the last ten commits of this Git repository into a release-notes draft.
```

After Hermes completes the task, ask:

```
> Save that workflow as a skill called "release-notes-from-commits".
```

Hermes writes the skill following the open [agentskills.io](https://agentskills.io) standard. The next time you say "generate release notes from commits," it will run faster and more predictably because it has done it before.

## Step 5: Connect a messaging channel (optional)

Hermes can live in your terminal and in your chat apps at the same time.

```bash
hermes gateway setup
```

Then connect the platforms you use:

```bash
hermes gateway add telegram
hermes gateway add discord
hermes gateway add slack
hermes gateway add whatsapp
```

Each connector has its own token and permission flow. Start with Telegram for the easiest private test.

## Step 6: Schedule recurring work (optional)

Hermes has built-in cron described in natural language:

```bash
hermes cron add "every day at 8am" "Summarize my unread newsletters"
```

You can also schedule:

- Daily standup prep
- Nightly research summaries
- Weekly backups
- Social post drafts

The scheduler runs inside the same Hermes process, so it has access to memory and skills.

## Sanity checks

| Check | Command |
|-------|---------|
| Hermes installed | `hermes --version` |
| Provider configured | `hermes config show` |
| Model selected | `hermes model list` |
| Skills saved | `hermes skills list` |
| Gateway status | `hermes gateway status` |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `command not found: hermes` | Reload shell (`source ~/.bashrc`) or restart the terminal. |
| Provider login fails | Check your API key scope. Nous Portal requires a paid subscription for full tool access. |
| Local endpoint not listed | Confirm it is OpenAI-compatible at `/v1/chat/completions`. Hermes expects that shape. |
| Skills are not saved | Make sure the task completed end-to-end before asking Hermes to save it. |
| Messages not bridged | Verify the gateway token and that the bot has permission to read/write in the channel. |
| High memory usage | Hermes can run multiple backends. Limit active channels or use a smaller default model. |

## Next steps

- Explore the [Hermes learning path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path).
- Install community skills from the Nous Hub.
- Connect Hermes to your Obsidian vault, calendar, or GitHub account.
- Compare Hermes to [OpenClaw](/agents/openclaw) in our Agent Directory to decide which personal-agent architecture fits your stack.
