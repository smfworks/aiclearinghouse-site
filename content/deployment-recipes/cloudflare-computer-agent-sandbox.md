---
slug: cloudflare-computer-agent-sandbox
title: Deploy an Agent Sandbox on Cloudflare Computer
excerpt: Run AI agents in Cloudflare Durable Object workspaces with V8 isolates for lightweight tasks and full Linux containers for heavy execution — one filesystem, two isolation tiers.
category: Self-Hosting
tags:
  - cloudflare
  - docker
  - agents
  - sandbox
  - v8-isolates
  - production
order: 99
last_verified: "2026-08-19"
difficulty: Intermediate
estimated_time: "45 min"
---

# Deploy an Agent Sandbox on Cloudflare Computer

## The promise

Cloudflare Computer (launched August 3, 2026) is a Durable Object workspace that routes agent work across two isolation tiers against one filesystem: fast V8 isolates for lightweight tasks, and full Linux containers for heavy execution. This recipe sets up an agent sandbox on Cloudflare Computer, configures the isolation tiers, and verifies end-to-end execution.

## What you'll get

- A Cloudflare Computer workspace running as a Durable Object
- V8 isolate execution for lightweight agent tasks (tool calls, API requests, text processing)
- Linux container execution for heavy tasks (code execution, file processing, browser automation)
- A shared filesystem across both tiers
- An HTTP endpoint for your agent to submit and retrieve work

## Prerequisites

- Cloudflare account with Workers and Durable Objects enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- Basic familiarity with Cloudflare Workers
- An LLM provider API key (for the agent's reasoning layer)

## Step 1: Create the workspace

```bash
mkdir agent-sandbox && cd agent-sandbox
wrangler init --type durable-objects
```

This scaffolds a Durable Object project. Your agent workspace will live in the `src/` directory.

## Step 2: Configure isolation tiers

In `wrangler.toml`, configure the Durable Object bindings:

```toml
[[durable_objects.bindings]]
name = "AGENT_WORKSPACE"
class_name = "AgentWorkspace"

[[containers.bindings]]
name = "LINUX_SANDBOX"
image = "ubuntu:22.04"
```

The Durable Object is the V8 isolate tier — fast, lightweight, no cold start. The container binding is the Linux tier — full execution environment for heavy tasks.

## Step 3: Implement the workspace

In `src/index.ts`, implement the routing logic:

```typescript
export class AgentWorkspace {
  async fetch(request: Request): Promise<Response> {
    const task = await request.json();

    // Route by task weight
    if (task.lightweight) {
      // Execute in V8 isolate — fast, no cold start
      return this.runInIsolate(task);
    } else {
      // Execute in Linux container — full environment
      return this.runInContainer(task);
    }
  }

  private async runInIsolate(task: any): Promise<Response> {
    // Tool calls, API requests, text processing
    const result = await executeTask(task);
    return new Response(JSON.stringify(result));
  }

  private async runInContainer(task: any): Promise<Response> {
    // Code execution, file processing, browser automation
    const container = this.env.LINUX_SANDBOX;
    const result = await container.run(task.command, task.input);
    return new Response(JSON.stringify(result));
  }
}
```

## Step 4: Deploy

```bash
wrangler deploy
```

This deploys your workspace to Cloudflare's global network. You get an HTTP endpoint for submitting tasks.

## Step 5: Submit a test task

```bash
curl -X POST https://agent-sandbox.<your-subdomain>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"lightweight": true, "action": "echo", "input": "Hello from the isolate"}'
```

For a heavy task:

```bash
curl -X POST https://agent-sandbox.<your-subdomain>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"lightweight": false, "command": "python3 -c \"print(2+2)\""}'
```

## Step 6: Connect your agent

Point your Hermes Agent or other agent framework at the workspace endpoint. The agent submits tasks; the workspace routes them to the appropriate tier.

## Sanity checks

| Check | Command |
|-------|---------|
| Workspace deployed | `wrangler deployments list` |
| Isolate task works | `curl -X POST ... -d '{"lightweight": true, ...}'` |
| Container task works | `curl -X POST ... -d '{"lightweight": false, ...}'` |
| Shared filesystem | Write from isolate, read from container |

## Common gotchas

| Symptom | Fix |
|---------|-----|
| Container cold start slow | First container invocation takes ~30s. Warm it with a health check on deploy. |
| Isolate memory limit | V8 isolates have a 128MB memory limit. Move heavy tasks to containers. |
| Filesystem not shared | Ensure both tiers reference the same Durable Object storage. |
| Container image not found | Use a public image or push to Cloudflare's container registry. |

## Next step

Connect this sandbox to [Cloudflare Kitesurf](/services/cloudflare-kitesurf) for browser automation, or [Cloudflare Wallets](/services/cloudflare-wallets) for agents that need to make purchases.