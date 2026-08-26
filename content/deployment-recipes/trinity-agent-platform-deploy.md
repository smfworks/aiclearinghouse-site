---
slug: trinity-agent-platform-deploy
title: Deploy Trinity Agent Orchestration Platform
excerpt: "Self-host a 24/7 agent orchestration platform with cron scheduling, multi-agent delegation, fleet observability, and 116 MCP tools — open source under Apache 2.0."
category: Self-Hosting
tags:
  - docker
  - agent-infrastructure
  - orchestration
  - cron
  - multi-agent
  - mcp
  - self-hosting
order: 99
last_verified: "2026-08-26"
difficulty: Intermediate
estimated_time: "45 min"
---

# Deploy Trinity Agent Orchestration Platform

## The promise

Trinity is an open-source platform for running AI agents 24/7 with cron scheduling, multi-agent coordination, credential management, and monitoring. Each agent runs in its own Docker container with dedicated resources, multi-runtime support (Claude Code or Gemini CLI), and per-task model selection. It is Apache 2.0 licensed and self-hostable.

## What you'll get

- A running Trinity platform with an operations dashboard
- Isolated Docker containers per agent
- Cron scheduling for autonomous task execution
- Agent-to-agent delegation with fine-grained permissions
- Fleet observability with graph view topology and Gantt-style execution timeline
- 116 tools exposed via MCP for external orchestration
- Credential security with encrypted git storage and OAuth2 flows

## Prerequisites

- Docker and Docker Compose
- A Linux server with at least 8GB RAM (16GB recommended for multiple concurrent agents)
- API keys for your chosen model providers (Anthropic, Google, or OpenAI)
- Git for credential encryption support

## Step 1: Clone the repository

```bash
git clone https://github.com/ability-ai/trinity.git
cd trinity
```

## Step 2: Configure environment

```bash
cp .env.example .env

# Edit .env with your configuration:
# - Model API keys (ANTHROPIC_API_KEY, GOOGLE_API_KEY, etc.)
# - Admin credentials for the dashboard
# - Git repository URL for encrypted credential storage (optional but recommended)
```

## Step 3: Start the platform

```bash
docker compose up -d
```

This starts:
- **Trinity Core**: The orchestration engine and API server
- **PostgreSQL**: Persistent state for agents, schedules, and execution history
- **Redis**: Job queue for cron-triggered tasks
- **Dashboard**: Web UI for monitoring and management (default: `http://localhost:8080`)
- **MCP Server**: Exposes 116 tools for external orchestration via Model Context Protocol

## Step 4: Create your first agent

Through the dashboard or API:

```bash
curl -X POST http://localhost:8080/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TRINITY_TOKEN" \
  -d '{
    "name": "research-agent",
    "runtime": "claude-code",
    "model": "claude-sonnet-4-6",
    "container_config": {
      "cpu_limit": 2,
      "memory_limit": "4g"
    }
  }'
```

Each agent runs in its own isolated Docker container with:
- Dedicated resources (CPU, memory)
- Multi-runtime support (Claude Code or Gemini CLI)
- Model selection per task
- Shared folders via Docker volumes for agent-to-agent file exchange

## Step 5: Schedule a cron task

```bash
curl -X POST http://localhost:8080/api/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TRINITY_TOKEN" \
  -d '{
    "agent_id": "research-agent",
    "cron": "0 9 * * 1",
    "task": "Compile a weekly research digest from arXiv papers in the AI agents category",
    "output_channel": "slack"
  }'
```

The agent will execute autonomously at the scheduled time, with full execution streaming visible in the dashboard.

## Step 6: Set up agent-to-agent delegation

Trinity supports hierarchical delegation with fine-grained permissions:

```bash
curl -X POST http://localhost:8080/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TRINITY_TOKEN" \
  -d '{
    "name": "writer-agent",
    "runtime": "claude-code",
    "model": "claude-sonnet-4-6",
    "parent_agent": "research-agent",
    "permissions": ["read:shared", "write:shared"]
  }'
```

The research agent can now delegate writing tasks to the writer agent. Both run in parallel containers with shared volumes.

## Step 7: Enable MCP integration

Trinity's MCP server exposes 116 tools for external orchestration from Claude Code, Cursor, or any MCP client:

```json
{
  "mcpServers": {
    "trinity": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-client", "http://localhost:8080/mcp"]
    }
  }
}
```

## Observability features

- **Graph view topology**: Visualize agent relationships and delegation hierarchies
- **Gantt-style execution timeline**: See when each agent ran, for how long, and what it produced
- **Host telemetry**: CPU, memory, and GPU usage per agent container
- **Fleet health monitoring**: Status of all agents and infrastructure components
- **OpenTelemetry metrics export**: Integrate with existing observability stacks
- **Cost tracking per agent**: Token usage and API costs attributed to each agent

## Troubleshooting

- **Dashboard not loading**: Check that port 8080 is not in use: `ss -tlnp | grep 8080`
- **Agent containers not starting**: Verify Docker has enough resources: `docker system info`
- **Credential encryption failing**: Ensure git is configured with a valid GPG key for encrypted storage
- **MCP connection refused**: The MCP server runs on a separate port — check `http://localhost:8080/mcp` directly with `curl`