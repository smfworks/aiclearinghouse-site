---
slug: ollama-docker
title: Deploy Ollama with Docker
excerpt: Run Ollama in a GPU-enabled container with persistent model storage and a stable REST API endpoint.
category: Deployment
tags:
  - Ollama
  - Docker
  - self-hosting
  - local-llm
  - GPU
  - container
order: 7
last_verified: 2026-06-15
difficulty: Intermediate
estimated_time: 25 min
---

# Deploy Ollama with Docker

## The promise

Docker turns Ollama into a portable appliance. The model cache survives container restarts. The API endpoint is stable. You can move the same container between your laptop, a home server, and a cloud instance without reinstalling. And because you control the image and the volume, you keep full ownership of your data.

This recipe runs Ollama in a GPU-enabled container, pulls a small model, and verifies the REST API. It is ideal for anyone who already manages infrastructure with Docker and wants local LLMs to fit into the same workflow.

## What you'll get

- Ollama running inside a Docker container
- Persistent model storage in `~/.ollama`
- REST API on `http://localhost:11434`
- A pulled model ready for local agents

## Prerequisites

- Docker installed
- NVIDIA Docker runtime (`nvidia-container-toolkit`) if you want GPU support
- At least 8 GB free disk space for the first model
- Linux or WSL2 on Windows

## Step 1: Create a model cache directory

```bash
mkdir -p ~/.ollama
```

This directory is mounted into the container so models are not lost when the container is replaced.

## Step 2: Run the container with GPU support

```bash
docker run -d \
  --name ollama \
  --gpus all \
  -p 11434:11434 \
  -v ~/.ollama:/root/.ollama \
  --restart unless-stopped \
  ollama/ollama
```

If you are on CPU only, drop `--gpus all`. Inference will be slower, but the setup still works.

Verify the container is healthy:

```bash
docker ps
```

## Step 3: Pull a model

```bash
export OLLAMA_HOST=http://localhost:11434
ollama pull qwen3.5:9b
```

You can also pull directly through the container:

```bash
docker exec -it ollama ollama pull qwen3.5:9b
```

## Step 4: Test the API

```bash
curl http://localhost:11434/api/tags
```

You should see a JSON list including `qwen3.5:9b`.

Run an interactive test:

```bash
ollama run qwen3.5:9b "Say hello from inside Docker."
```

## Step 5: Connect other containers to Ollama

If you run Open WebUI or another agent in Docker, put them on the same network:

```bash
docker network create ollama-net
docker network connect ollama-net ollama
```

Then point the other container to `http://ollama:11434`.

## Step 6: Upgrade Ollama

To update to the latest image:

```bash
docker pull ollama/ollama
docker stop ollama
docker rm ollama
# Re-run the docker run command from Step 2
```

Your models stay in `~/.ollama`, so the new container picks them up automatically.

## Sanity checks

| Check | Command |
|-------|---------|
| Container running | `docker ps` |
| Logs | `docker logs ollama` |
| API up | `curl http://localhost:11434/api/tags` |
| Model list | `ollama list` |
| GPU active | `docker exec ollama nvidia-smi` |

## Common gotchas

| Symptom | Fix |
|---------|-----|
| `nvidia-container-toolkit` not found | Install it with your distribution's package. On Ubuntu: `sudo apt install -y nvidia-container-toolkit` then restart Docker. |
| Permission denied on `~/.ollama` | Ensure the host directory is writable. Run `chmod 755 ~/.ollama`. |
| API returns 404 | Confirm the container is running and port `11434` is mapped. |
| GPU not used | Verify `--gpus all` is present and `nvidia-smi` works on the host. |

## Next step

Connect this containerized Ollama to [Open WebUI](/deployment-recipes/open-webui), [Cline](/deployment-recipes/cline-local), or [OpenClaw](/deployment-recipes/openclaw-first-agent).
