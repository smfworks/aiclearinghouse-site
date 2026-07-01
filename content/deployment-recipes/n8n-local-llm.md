---
slug: n8n-local-llm
title: "Deploy n8n with Local LLM Tools"
excerpt: "Self-host n8n workflow automation and connect it to local Ollama models for private, agent-driven automations."
category: "Deployment"
tags:
  - n8n
  - ollama
  - self-hosting
  - workflow-automation
  - local-llm
order: 15
last_verified: "2026-07-01"
difficulty: Intermediate
estimated_time: 35 min
---

# Deploy n8n with Local LLM Tools

## The promise

n8n is a workflow automation tool with native AI nodes. When self-hosted and paired with local LLMs, it becomes a private automation engine for agent-like tasks: classify emails, summarize documents, and route data without sending sensitive content to cloud APIs.

## What you'll get

- n8n running in Docker on your own server.
- Ollama available to n8n workflows via the local network.
- A sample workflow that calls a local model from n8n.

## Prerequisites

- Docker and Docker Compose installed.
- Ollama installed and serving on `http://localhost:11434`.
- A model pulled, such as `qwen3.5:9b`.

## Step 1: Run n8n with Docker Compose

```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=change-me
    volumes:
      - ~/.n8n:/home/node/.n8n
```

```bash
docker compose up -d
```

## Step 2: Add the Ollama credentials

In n8n, go to **Settings > Credentials** and add an HTTP Request credential pointing to `http://host.docker.internal:11434` (on Linux you may need `http://<host-ip>:11434`).

## Step 3: Build a sample workflow

1. Add a **Schedule** trigger.
2. Add an **HTTP Request** node that POSTs to `/api/generate` with the model name and prompt.
3. Add a **Set** node to parse the response.
4. Save and test.

Example payload:

```json
{
  "model": "qwen3.5:9b",
  "prompt": "Summarize the following text in one sentence: {{ $json.body }}"
}
```

## Troubleshooting

- **n8n cannot reach Ollama:** Ensure Ollama binds to `0.0.0.0` or use the Docker host IP.
- **Model not found:** Pull the model first with `ollama pull qwen3.5:9b`.
- **Slow responses:** Local models need warm GPUs; cold inference is much slower.

## Best fit

Teams that want no-code automation with local intelligence for privacy-sensitive or cost-sensitive workflows.
