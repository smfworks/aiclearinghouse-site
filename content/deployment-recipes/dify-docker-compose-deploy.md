---
slug: dify-docker-compose-deploy
title: "Self-Host Dify with Docker Compose"
excerpt: "Deploy Dify — the open-source LLM app development platform — as a Docker Compose stack with Postgres, Redis, and a vector database for a self-hosted agent-building environment."
category: Self-Hosting
tags:
  - docker
  - docker-compose
  - dify
  - self-hosting
  - llm-platform
  - agents
order: 99
last_verified: "2026-09-27"
difficulty: Intermediate
estimated_time: "30 min"
---

# Self-Host Dify with Docker Compose

## What you're deploying

Dify is an open-source platform for building LLM applications and agents — visual workflow builder, RAG pipeline, model routing, and agent orchestration in one stack. It ships as a Docker Compose stack of about half a dozen containers, including a Postgres database, a Redis cache, and a vector database. This recipe gets it running on your own infrastructure.

## Prerequisites

- **Linux server** with at least 4 GB RAM (2 GB minimum, 4 GB recommended)
- **Docker 20.10+** and **Docker Compose v2+**
- A domain name with DNS pointing to your server (for TLS)
- At least one LLM API key (OpenAI, Anthropic, or any OpenAI-compatible endpoint)

## Step 1: Clone the Dify repository

```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
```

## Step 2: Configure environment

```bash
cp .env.example .env
```

Edit `.env` with critical settings:

```bash
# Generate a strong secret key
SECRET_KEY=$(openssl rand -hex 32)

# Set your domain
CONSOLE_API_URL=https://your-domain.com
APP_API_URL=https://your-domain.com

# Configure the built-in vector database (or point to external)
VECTOR_STORE=weaviate

# Set a strong initial admin password
INIT_PASSWORD=your-strong-password-here
```

## Step 3: Start the stack

```bash
docker compose up -d
```

This brings up:
- **Dify API** (backend)
- **Dify Web** (frontend)
- **PostgreSQL** (metadata and session storage)
- **Redis** (caching and queue)
- **Weaviate** or your configured vector database
- **Sandbox** (code execution for agent tools)
- **SSRF Proxy** (safe outbound requests for RAG ingestion)

## Step 4: Secure the deployment

Dify's bundled web server listens on plain HTTP port 80 on every interface. **Do not expose this directly.**

### Bind to loopback and add a TLS reverse proxy

Edit your `docker-compose.yaml` to bind the web service to `127.0.0.1`:

```yaml
services:
  nginx:
    ports:
      - "127.0.0.1:80:80"
```

Then put Caddy or Nginx in front with TLS:

```bash
# Using Caddy (automatic TLS via Let's Encrypt)
# Caddyfile
your-domain.com {
    reverse_proxy 127.0.0.1:80
}
```

```bash
caddy run --config Caddyfile
```

### Create the admin account immediately

The first visitor to Dify's install page claims the admin account. After bringing the stack up, visit `https://your-domain.com/install` immediately to create your admin account before anyone else does.

## Step 5: Configure your LLM provider

1. Log in to the Dify console
2. Go to Settings → Model Provider
3. Add your API key for your chosen provider (OpenAI, Anthropic, Ollama, OpenRouter, etc.)
4. For local models, point Dify at your Ollama or vLLM endpoint

## Step 6: Verify

```bash
# Check all containers are healthy
docker compose ps

# Test the API
curl https://your-domain.com/console/api/setup
```

## Maintenance

```bash
# Update Dify
cd dify
git pull
cd docker
docker compose pull
docker compose up -d

# Back up the database
docker compose exec postgres pg_dump -U postgres dify > dify_backup_$(date +%Y%m%d).sql
```

## Security checklist

- [ ] TLS reverse proxy in front (not plain HTTP on public interface)
- [ ] Admin account created immediately after first boot
- [ ] Strong `SECRET_KEY` generated (not the default)
- [ ] Firewall restricts access to Postgres, Redis, and vector DB ports (internal only)
- [ ] API keys stored in environment variables, not committed to git
- [ ] Regular database backups configured
- [ ] Docker images kept updated (`docker compose pull` regularly)

## When to choose Dify over alternatives

- **Choose Dify** when you want a visual builder for LLM apps and agents with RAG, model routing, and a UI — without writing orchestration code
- **Choose LangGraph** when you want code-level control over agent state and orchestration
- **Choose n8n** when your workflow is integration-first (connecting SaaS tools) rather than LLM-first
- **Choose Open WebUI** when you primarily want a ChatGPT-like interface for local models without app-building features

## Resource notes

Dify's full stack with a vector database and sandbox needs at least 2 GB free RAM to start, ideally 4 GB for production use. If you're running local model inference (Ollama/vLLM) alongside Dify on the same host, plan for significantly more — the model server will be the dominant memory consumer.