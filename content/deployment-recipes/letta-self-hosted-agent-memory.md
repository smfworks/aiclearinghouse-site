---
slug: letta-self-hosted-agent-memory
title: Self-Host Letta for Stateful Agents with Memory
excerpt: Deploy Letta (formerly MemGPT) on your own infrastructure to run stateful AI agents with persistent memory blocks, archival storage, and self-editing context.
category: Self-Hosting
tags:
  - letta
  - memgpt
  - memory
  - stateful-agents
  - docker
  - self-hosting
  - postgres
order: 99
last_verified: "2026-07-29"
difficulty: Intermediate
estimated_time: "45 min"
---

# Self-Host Letta for Stateful Agents with Memory

## The promise

Letta (formerly MemGPT) is an open-source platform for stateful AI agents with advanced memory that can learn and self-improve over time. Unlike stateless API wrappers, Letta agents persist across restarts, maintain editable memory blocks, and retrieve from archival storage — giving you agents that actually remember your preferences, past conversations, and task history.

This recipe deploys Letta on your own infrastructure with Docker, Postgres for persistence, and your choice of LLM provider (OpenAI, Anthropic, OpenRouter, or local models via Ollama).

## What you need

- **Docker** and **Docker Compose**
- **PostgreSQL 14+** (or use the included container)
- An LLM API key (OpenAI, Anthropic, or OpenRouter) OR a local Ollama instance
- 4GB+ RAM

## Step 1: Clone the Letta repository

```bash
git clone https://github.com/letta-ai/letta
cd letta
```

## Step 2: Configure environment

Create a `.env` file:

```env
# LLM provider (choose one)
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# OPENROUTER_API_KEY=sk-or-...

# For local models via Ollama
# LETTA_MODEL=ollama/glm-5.2
# OLLAMA_BASE_URL=http://host.docker.internal:11434

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=letta
POSTGRES_USER=letta
POSTGRES_PASSWORD=change-me-in-production
```

## Step 3: Deploy with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  letta:
    image: letta/letta:latest
    ports:
      - "8283:8283"
    env_file: .env
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: letta
      POSTGRES_USER: letta
      POSTGRES_PASSWORD: change-me-in-production
    volumes:
      - letta-pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  letta-pgdata:
```

```bash
docker compose up -d
```

## Step 4: Verify the deployment

```bash
# Check Letta is running
curl http://localhost:8283/v1/health
# Should return {"status": "ok"}

# Check the ADE (Agent Development Environment) is accessible
# Open http://localhost:8283 in your browser
```

## Step 5: Create your first stateful agent

```python
from letta import Letta

client = Letta(base_url="http://localhost:8283")

agent = client.agent.create(
    name="my-assistant",
    memory={
        "human": "User prefers concise answers and works in Python.",
        "persona": "You are a helpful coding assistant.",
    },
    model="openai/gpt-5.6-terra",  # or ollama/glm-5.2 for local
)

# Send a message
response = client.agent.message(
    agent_id=agent.id,
    message="What language do I prefer?",
)
print(response)
# The agent remembers "User prefers concise answers and works in Python."
```

## How Letta memory works

### Core memory (in-context)
- Always in the prompt — the agent's persona and facts about the user
- Editable by the agent via tool calls
- Small and high-signal

### Archival memory (out-of-context)
- Stored in Postgres with vector search
- The agent retrieves from it via tool calls when needed
- Holds longer histories, documents, and accumulated knowledge

### Memory blocks
- Named, editable sections of core memory
- The agent can update "human" and "persona" blocks as it learns
- No temporal supersession — blocks are edited manually or by the agent

## When to use this setup

- Long-lived personal assistants that should remember preferences across sessions
- Coding agents that need to recall project context and past decisions
- Customer support agents with persistent customer history
- Research agents that accumulate knowledge over time
- Self-hosted stacks where you want full control over memory and data

## Trade-offs

- **Framework lock-in** — Letta is a full agent runtime, not just a memory layer. Adopting it means running agents inside Letta, not just plugging memory into LangGraph or CrewAI.
- **No temporal supersession** — memory blocks are edited, not versioned with temporal invalidation. For changing facts, consider Zep or Graphiti alongside.
- **You own the runtime** — updates, backups, and scaling are your responsibility.

## Alternatives

- **Mem0** — pluggable memory API for existing apps, no runtime lock-in
- **Zep** — temporal graph memory with invalidation, requires Neo4j
- **Cognee** — poly-store graph memory with LLM-driven pipelines
- **Plain Postgres + custom code** — if you only need simple persistence