---
slug: openhands-1-0-docker-deploy
title: "Deploy OpenHands 1.0 in Docker (Autonomous Coding Agent)"
excerpt: "OpenHands reached its 1.0 release with production-ready Docker sandboxing, built-in security policies, resource limits, and a plugin system — autonomously completing ~68% of SWE-bench Verified tasks. Here's the self-hosted Docker deployment recipe."
category: Self-Hosting
tags:
  - docker
  - coding-agent
  - self-hosting
  - openhands
  - production
order: 99
last_verified: "2026-09-09"
difficulty: Intermediate
estimated_time: "20 min"
---

# Deploy OpenHands 1.0 in Docker (Autonomous Coding Agent)

## What it is

OpenHands (formerly OpenDevin) reached its **1.0 release** in early September 2026, with production-ready Docker sandboxing, built-in security policies, resource limits, a plugin system, and benchmarks showing it can autonomously complete about **68% of SWE-bench Verified** tasks. It is an open-source (MIT), model-agnostic autonomous coding agent platform you can self-host.

This recipe deploys the OpenHands runtime in an isolated Docker container so an agent can write, run, and test code in a sandboxed Linux environment — without risking your host.

## Prerequisites

- Docker Desktop (macOS/Windows) or Docker Engine (Linux)
- A host directory for the projects you want the agent to access
- An LLM API key (OpenAI, Anthropic, or any OpenAI-compatible endpoint)

## Step 1 — Create the projects directory

```bash
export PROJECTS_PATH="$HOME/projects"
mkdir -p "$PROJECTS_PATH"
```

The agent will be able to access any project under `PROJECTS_PATH`.

## Step 2 — Run the OpenHands container

**macOS / Linux:**

```bash
docker run -it --rm \
  -p 8000:8000 \
  -v "$HOME/.openhands:/home/openhands/.openhands" \
  -v "$PROJECTS_PATH:/projects" \
  -e LLM_API_KEY="$YOUR_LLM_API_KEY" \
  ghcr.io/openhands/agent-canvas:1.16.0
```

**Windows (PowerShell):** see the OpenHands `README.windows.md` for the equivalent commands.

This starts the OpenHands web UI on port 8000 with a Docker-sandboxed runtime.

## Step 3 — Configure the model

OpenHands is model-agnostic. Set the model and provider via environment variables or the web UI:

- **LLM_API_KEY** — your provider API key
- **LLM_MODEL** — e.g. `anthropic/claude-fable-5-1`, `openai/gpt-5.6-sol`, or any OpenAI-compatible endpoint
- **LLM_BASE_URL** — for self-hosted/local endpoints (Ollama, vLLM, LiteLLM)

For a fully local setup, point `LLM_BASE_URL` at a local vLLM or Ollama server and use a local model — no external API calls.

## Step 4 — Open the web UI

Navigate to `http://localhost:8000`. Start a conversation, select a project from `/projects`, and let the agent work in the sandboxed environment.

## Production hardening

OpenHands 1.0 ships with the controls that make this safe for production use:

- **Docker sandbox isolation**: every task session runs in a securely isolated container — the agent cannot reach the host outside the mounted project directory
- **Built-in security policies**: production-ready policies are on by default in 1.0
- **Resource limits**: CPU, memory, and time budgets constrain the agent's runtime
- **Plugin system**: extend the agent with custom tools and micro-agents

For a production deployment, also:

- Run the container as a non-root user
- Restrict outbound network access from the sandbox if the task does not require it
- Mount only the specific project directory the agent needs, not your entire home folder
- Store API keys in a secrets manager, not in the run command

## Verify the deployment

```bash
# Container is running
docker ps | grep openhands

# Web UI responds
curl -sI http://localhost:8000 | head -3

# Agent can execute in the sandbox — start a session and run a trivial task
```

## Agent Canvas (always-on automations)

For an always-on setup, OpenHands **Agent Canvas** is a self-hosted developer control center that runs coding agents and automations locally. It can run the OpenHands agent out-of-the-box, or any ACP-compatible agent (Claude Code, Codex, Gemini). Automations can integrate with Slack, GitHub, and Linear.

## Limitations

- **Docker required**: the sandbox model depends on Docker; no Docker means no isolation
- **API costs**: autonomous agents consume tokens — set spending limits via the resource controls and monitor usage
- **Not all models work equally well**: SWE-bench Verified ~68% is with frontier models; cheaper or local models will perform lower
- **Self-hosted or cloud only**: no managed SaaS tier from the OSS project (OpenHands Cloud is a separate hosted option)

## Related

- [OpenHands GitHub](https://github.com/OpenHands/OpenHands)
- [OpenHands documentation](https://www.openhands.dev/)