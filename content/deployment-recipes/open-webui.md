---
slug: open-webui
title: Deploy Open WebUI with Ollama
excerpt: Run a self-hosted ChatGPT-style interface that talks to your local Ollama models and any OpenAI-compatible API.
category: Self-Hosting
tags:
  - open-webui
  - ollama
  - self-hosting
  - chat
  - docker
order: 6
last_verified: 2026-06-15
difficulty: Intermediate
estimated_time: 25 min
---

# Deploy Open WebUI with Ollama

## The promise

Every powerful local model deserves a good interface. Open WebUI gives you a ChatGPT-style web app that runs on your own hardware, connects to Ollama, and can even bridge to cloud APIs for side-by-side comparison. It is the fastest way to turn a raw Ollama server into something the rest of your team will actually use.

This recipe deploys Open WebUI with Docker, connects it to a local Ollama instance, and shows you how to add a cloud provider so you can compare local and frontier models in the same conversation.

## What you'll get

- Open WebUI running in Docker on port `3000`
- Connection to your local Ollama instance
- One or more local models available in the dropdown
- Optional cloud API bridge for comparison

## Prerequisites

- Ollama running locally (see the [Ollama CUDA recipe](/deployment-recipes/ollama-ubuntu-cuda))
- Docker installed
- At least 2 GB free disk space for the Open WebUI image
- One pulled Ollama model, such as `qwen3.5:9b`

## Step 1: Pull Open WebUI with Docker

One command starts the container and persists its data:

```bash
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

Visit `http://localhost:3000`. The first user to sign up becomes the admin.

## Step 2: Connect Ollama

The first time you open Open WebUI, it asks for an Ollama API URL:

```
http://host.docker.internal:11434
```

Use that exact value if Ollama is running on the Docker host. If Ollama is also in Docker, put both containers on the same network and use the Ollama container name as the host.

Click **Save**. The models you have pulled appear in the model selector.

## Step 3: Pull a model through the UI

Open WebUI can pull Ollama models directly without touching the terminal:

1. Go to **Settings → Models**.
2. Click **Pull a model**.
3. Enter `qwen3.5:9b` and wait.

You can also pull from the admin panel in bulk.

## Step 4: Add a cloud API for comparison

This is where Open WebUI becomes more than a local chat app:

1. Go to **Settings → Connections**.
2. Add an OpenAI-compatible API base URL and key:
   - OpenAI: `https://api.openai.com/v1`
   - Anthropic: use the Anthropic connector
   - OpenRouter: `https://openrouter.ai/api/v1`
3. Save. The new provider appears in the model dropdown.

Now you can ask the same question to a local model and a cloud model and compare the answers.

## Step 5: Enable LAN access (optional)

To let other devices on your network reach Open WebUI:

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

> Do not expose Open WebUI to the public internet without authentication. The first signup becomes admin, and there is no rate limit by default.

## Sanity checks

| Check | Command / Action |
|-------|------------------|
| Container running | `docker ps` |
| Ollama reachable | `curl http://localhost:11434/api/tags` |
| WebUI logs | `docker logs open-webui` |
| Model list loads | Refresh the browser and check the dropdown |

## Common gotchas

| Symptom | Fix |
|---------|-----|
| "Cannot connect to Ollama" | Verify `--add-host=host.docker.internal:host-gateway` and that the Ollama endpoint is `http://host.docker.internal:11434`. |
| No models listed | Pull at least one model with `ollama pull qwen3.5:9b`. |
| Slow first load | The Docker image is large. Allow several minutes for the initial pull. |
| Admin lockout | The first user to sign up is admin. There is no password recovery without database access. |

## Next step

Use Open WebUI as a playground to test prompts before using them with agents like Cline, Aider, or OpenClaw. Then move the best prompts into versioned prompt files for your agents.
