---
slug: open-webui
title: Deploy Open WebUI with Ollama
category: Self-Hosting
tags:
  - Open WebUI
  - Ollama
  - self-hosting
  - chat
---

## What you'll get

A self-hosted ChatGPT-style web interface that talks to your local Ollama models and any OpenAI-compatible API. You can switch models, manage conversations, and expose the UI to your LAN if needed.

## Prerequisites

- Ollama running locally (see the [Ollama CUDA recipe](/deployment-recipes/ollama-ubuntu-cuda))
- Docker or a local Python environment
- At least 2 GB free disk space

## Option 1: Docker (recommended)

```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

Visit `http://localhost:3000`.

If Ollama is also in Docker, connect to it using the same network. If Ollama is on the host, use `http://host.docker.internal:11434` as the Ollama API URL in Open WebUI settings.

## Option 2: Local Python install

```bash
# Requires Python 3.11+
git clone https://github.com/open-webui/open-webui.git
cd open-webui
pip install -r requirements.txt -U
bash start.sh
```

Visit `http://localhost:8080`.

## Step 1: Connect Ollama

The first time you open Open WebUI, it prompts for an Ollama endpoint:

```
http://host.docker.internal:11434
```

If running Open WebUI directly on the host, use:

```
http://localhost:11434
```

Click **Save**. The models you have pulled will appear in the model selector.

## Step 2: Pull models through the UI

Open WebUI can pull Ollama models directly:

```
Settings → Models → Pull a model
```

Enter a model name such as `qwen3.5:9b` and wait for the download.

## Step 3: Add an OpenAI-compatible API key

To compare local models against cloud models in the same interface:

1. Go to **Settings → Connections**.
2. Add an OpenAI API base URL and key, or an Anthropic/OpenRouter key.
3. The new provider appears in the model dropdown.

## Step 4: LAN access (optional)

To expose Open WebUI to other devices on your network:

```bash
docker run -d -p 3000:8080 \
  -e ENV=prod \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

Then access it at `http://your-lan-ip:3000`.

> Do not expose Open WebUI to the public internet without authentication.

## Sanity check

| Check | Command / Action |
|-------|------------------|
| Container running | `docker ps` |
| Ollama reachable | `curl http://localhost:11434/api/tags` |
| WebUI logs | `docker logs open-webui` |
| Model list loads | Refresh the browser and check the dropdown |

## Common gotchas

- **"Cannot connect to Ollama"** — If using Docker, verify `--add-host=host.docker.internal:host-gateway` is set and the Ollama endpoint is correct.
- **No models listed** — Pull at least one model with `ollama pull qwen3.5:9b`.
- **Slow first load** — Docker image download can take several minutes depending on connection speed.

## Next step

Use Open WebUI as a chat playground to test prompts before using them with agents like Cline, Aider, or OpenClaw. Then move the best prompts into versioned prompt files for your agents.
