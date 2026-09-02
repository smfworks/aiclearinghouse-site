---
slug: compose-for-agents
title: Deploy a Multi-Container Agent Stack with Docker Compose for Agents
excerpt: Use Docker's Compose for Agents specification to define and run a complete self-hosted agent stack — runtime, LLM gateway, vector store, and memory — in a single declarative file.
category: Self-Hosting
tags:
  - docker
  - compose
  - self-hosting
  - agents
  - multi-container
order: 99
last_verified: "2026-09-02"
difficulty: Beginner
estimated_time: "20 min"
---

# Deploy a Multi-Container Agent Stack with Docker Compose for Agents

## The promise

Docker's Compose for Agents specification extends Docker Compose with agent-aware features for defining and running a complete self-hosted agent stack in a single `docker-compose.yml`. Instead of hand-wiring separate containers for your agent runtime, LLM gateway, vector store, and memory backend, you declare the whole stack and bring it up with one command.

## What you will get

- A multi-container agent stack running on a single host
- An agent runtime container (Hermes, OpenClaw, or your custom agent)
- An LLM gateway (Ollama for local models, or a proxy to cloud APIs)
- A vector store for RAG and semantic search
- A persistent memory backend (Postgres)
- All services networked, with health checks and restart policies

## Prerequisites

- Docker and Docker Compose installed
- 4 GB RAM minimum (8 GB recommended if running local models)
- An API key for your LLM provider (or a local GPU for Ollama)
- A `$5–$10/month VPS` or local machine

## Step 1: Create the compose file

```yaml
# docker-compose.yml
services:
  # Agent runtime
  agent:
    image: your-agent-image:latest
    restart: unless-stopped
    environment:
      - LLM_BASE_URL=http://gateway:11434/v1
      - VECTOR_STORE_URL=http://vector:6333
      - DATABASE_URL=postgres://agent:password@db:5432/agent
    depends_on:
      gateway:
        condition: service_healthy
      vector:
        condition: service_started
      db:
        condition: service_healthy
    ports:
      - "8080:8080"
    volumes:
      - agent-state:/data

  # LLM gateway (local models via Ollama)
  gateway:
    image: ollama/ollama:latest
    restart: unless-stopped
    volumes:
      - ollama-models:/root/.ollama
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Vector store (Qdrant)
  vector:
    image: qdrant/qdrant:latest
    restart: unless-stopped
    volumes:
      - qdrant-data:/qdrant/storage
    ports:
      - "6333:6333"

  # Persistent memory (Postgres)
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=agent
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=agent
    volumes:
      - pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U agent"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  agent-state:
  ollama-models:
  qdrant-data:
  pg-data:
```

## Step 2: Bring up the stack

```bash
docker compose up -d
```

## Step 3: Pull a model into the gateway

```bash
# Pull a model for local inference
docker compose exec gateway ollama pull qwen3.8:27b

# Or for cloud API proxy, skip Ollama and set your API key
# as an environment variable on the agent service
```

## Step 4: Verify

```bash
# Check all services are running
docker compose ps

# Check agent health
curl -f http://localhost:8080/health

# Check gateway
docker compose exec gateway curl -s http://localhost:11434/api/tags | head

# Check vector store
curl -s http://localhost:6333/collections

# Check database
docker compose exec db psql -U agent -c "SELECT 1"
```

## Step 5: Add a reverse proxy (optional but recommended)

For TLS and external access, add Caddy as a reverse proxy:

```yaml
  proxy:
    image: caddy:latest
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
    depends_on:
      - agent
```

With a `Caddyfile`:
```
assistant.example.com {
    reverse_proxy agent:8080
}
```

## Cost notes

- A $5–$10/month VPS (Hetzner, Vultr, Contabo) with 2 GB RAM is sufficient for the agent runtime + Postgres + Qdrant.
- Running Ollama with a local model requires a GPU or sufficient CPU/RAM. On a VPS without a GPU, use cloud API keys instead of local inference — self-hosted in 2026 usually means self-hosted runtime, not self-hosted weights.
- The runtime is where 90% of the data sensitivity lives. Self-hosting the runtime with cloud model APIs is a reasonable security posture.

## When to use this

- You want a single-command self-hosted agent stack for development or small-team use.
- You are testing agent architectures and need a reproducible local environment.
- You want data privacy (prompts, history, and state never leave your network) without building infrastructure from scratch.