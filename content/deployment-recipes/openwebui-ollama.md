---
slug: openwebui-ollama
title: Open WebUI + Ollama for a Local Chat Front Door
excerpt: Give non-terminal users a clean browser UI on top of local Ollama models without sending chats to a third-party SaaS.
category: Local Stack
tags:
  - ollama
  - open-webui
  - docker
  - local-llm
  - ui
order: 18
last_verified: "2026-07-13"
difficulty: Beginner
estimated_time: "20 min"
---

# Open WebUI + Ollama for a Local Chat Front Door

## The promise

Ollama is great for model management. Many people still want a ChatGPT-like browser UI for family, team demos, or non-developer users. Open WebUI is a common front door.

## What you will get

- Browser chat against local models
- Model switching without teaching everyone the CLI
- A stack that stays on your LAN if you bind carefully

## Prerequisites

- Docker (recommended) or a supported install path for Open WebUI
- Ollama installed and able to `ollama run` a model
- Enough RAM/VRAM for the models you expose

## Steps

1. **Install and start Ollama.** Pull at least one model you actually use.
2. **Confirm the Ollama API** responds on the default port (typically 11434).
3. **Run Open WebUI** via Docker, pointing it at the Ollama base URL. On Linux, host networking or `host.docker.internal` patterns may be required so the container can reach Ollama.
4. **Create an admin user** on first visit and disable open signup if this is more than a personal toy.
5. **Select the model** in the UI and send a test prompt.

## Verification

- UI lists your pulled models
- A short chat returns tokens
- Stop Docker/Ollama and confirm you know the restart order

## Troubleshooting

- **Empty model list:** Open WebUI cannot reach Ollama — fix networking first
- **Slow answers:** model too large for hardware; try a smaller quant
- **Exposed to the internet by accident:** bind to localhost or put behind auth and reverse proxy

## Honest notes

A chat UI is not an agent harness. For coding agents, keep using CLI/IDE tools with verification commands. This recipe is for accessible local chat, not autonomous tool use.
