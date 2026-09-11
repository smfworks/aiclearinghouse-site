---
slug: agenta-docker-compose-deploy
title: "Self-Host Agenta with Docker Compose (Agent Studio + Runner)"
excerpt: "Agenta v2.0's self-hosted deployment runs the studio, API, agent runner, and datastores on your own infrastructure via Docker Compose — with optional Daytona cloud sandboxes for multi-user isolation."
category: Self-Hosting
tags:
  - docker
  - docker-compose
  - agent-platform
  - self-hosting
  - agenta
order: 99
last_verified: "2026-09-09"
difficulty: Beginner
estimated_time: "15 min"
---

# Self-Host Agenta with Docker Compose (Agent Studio + Runner)

## What it is

Agenta is an open-source (MIT) platform for building, evaluating, and serving AI agents. The self-hosted deployment (v2.0) runs the **studio**, the **API**, the **agent runner**, and their datastores on your own infrastructure with Docker Compose. It has every feature of Agenta Cloud except the governance features (SSO, roles, access controls — those are enterprise edition).

This recipe deploys the full Agenta stack locally and shows the two sandbox options for where agents actually execute.

## Prerequisites

- Docker and Docker Compose
- (Optional) A Daytona account if you want cloud sandboxes for multi-user isolation

## Step 1 — Quick start (local Docker Compose)

```bash
git clone https://github.com/Agenta-AI/agenta.git
cd agenta
docker compose up -d
```

This starts the studio, API, runner, and datastores. Open the studio UI (default `http://localhost:3000`) and you have the full self-hosted platform running.

## Step 2 — Choose where agents run

Agents execute in the runner service, in one of two sandboxes. Pick one **before** opening the deployment to other people:

### Option A — Cloud sandbox (Daytona)

Each agent run gets its own isolated cloud sandbox. Use this for **multi-user deployments** where different users' agents must not see each other or the host.

### Option B — Local runs (default)

Agents execute inside the runner container itself. Local runs are **not isolated from each other**, so use them only on a deployment you run for yourself or a trusted team. These are also the only runs that can use your own Claude, Pi, or ChatGPT subscription instead of a model API key.

## Step 3 — Deploy on a remote server

For a server you own, use the same `docker compose up -d` after configuring environment variables for the server's hostname, TLS, and datastore credentials. See Agenta's "Deploy on a remote server" guide.

## Step 4 — Deploy to Kubernetes (Helm)

For production scale, use the Helm chart:

```bash
helm repo add agenta https://agenta.ai/charts
helm install agenta agenta/agenta
```

See Agenta's "Deploy to Kubernetes" guide for values configuration.

## Self-hosting with your coding agent

Agenta ships a self-hosting skill for coding agents:

```bash
npx skills add Agenta-AI/agenta-skills
```

Then point your coding agent (Claude Code, etc.) at the Agenta repository and it will walk through setup and testing.

## Production notes

- **OSS vs Enterprise edition**: OSS (MIT) covers studio, API, runner, and both sandbox providers. Enterprise adds governance (SSO, roles, access controls).
- **Railway deployment** is community-maintained with no official support — fixes depend on contributor availability.
- **Sandbox isolation is critical**: for any multi-user deployment, use the Daytona cloud sandbox, not local runs. Local runs share the runner container with no isolation between users' agents.
- **Customize the runtime**: add tools, folders, or compute to either sandbox via the runner configuration.

## Verify the deployment

```bash
# Containers are running
docker compose ps

# Studio UI responds
curl -sI http://localhost:3000 | head -3

# API responds
curl -sI http://localhost:8000/api | head -3
```

## Limitations

- **Governance is enterprise-only**: SSO, roles, and access controls are not in the OSS edition
- **Daytona is the only multi-user sandbox**: local runs are fine for single-user/trusted-team use but unsafe for multi-user
- **Railway path unsupported**: stick to Docker Compose (local/remote) or Helm (Kubernetes) for production
- **Self-hosted means you operate it**: patching, runtime security, key management, monitoring, and incident response are your responsibility

## Related

- [Agenta self-host documentation](https://agenta.ai/docs/self-host/overview)
- [Agenta GitHub](https://github.com/Agenta-AI/agenta)