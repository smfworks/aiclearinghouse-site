---
slug: cloudflare-temporary-worker-deploy
title: Cloudflare Temporary Worker Deployment for Agents
excerpt: Let your AI agent deploy a Cloudflare Worker, D1 database, or KV store with zero signup — a 60-minute temporary account for prototyping, previews, and human handoff.
category: Self-Hosting
tags:
  - cloudflare
  - workers
  - deployment
  - agents
  - serverless
  - prototyping
order: 99
last_verified: "2026-07-29"
difficulty: Beginner
estimated_time: "15 min"
---

# Cloudflare Temporary Worker Deployment for Agents

## The promise

Your AI agent writes a Worker script and deploys it to Cloudflare's edge — no account signup, no OAuth flow, no API token. The deployment stays live for 60 minutes with a public URL. If a human claims the temporary account within that window, it becomes permanent. This is the fastest path from "agent wrote code" to "code is live on the internet."

Shipped June 19, 2026, this feature is specifically designed for AI agents that need to deploy, verify, and hand off without a human in the loop for infrastructure setup.

## What you need

- **Wrangler 4.102.0 or later** (Cloudflare CLI)
- **Node.js 18+**
- An AI agent that can run shell commands (Hermes, Claude Code, Codex, OpenClaw, etc.)
- No Cloudflare account required for the temporary path

## Step 1: Update Wrangler

```bash
npm install -g wrangler@latest
wrangler --version  # Should be 4.102.0 or later
```

## Step 2: Log out (ensure no existing credentials interfere)

```bash
wrangler logout
```

## Step 3: Have your agent write and deploy a Worker

Tell your agent to build something and deploy it. The agent writes the script, then runs:

```bash
wrangler deploy --temporary
```

Wrangler detects the `--temporary` flag, provisions a temporary Cloudflare account, deploys the Worker, and returns:
- A **live Worker URL** (publicly accessible immediately)
- A **claim URL** (for a human to make the account permanent)

## Step 4: Agent verifies the deployment

The agent can curl the live URL to verify the deployment works:

```bash
curl https://your-worker.your-subdomain.workers.dev
```

If the output matches expectations, the agent reports success and returns the claim URL to the human.

## Step 5: Human claims the account (within 60 minutes)

The human opens the claim URL in a browser, signs in to or creates a Cloudflare account, and the temporary deployment becomes permanent. The Worker, D1 databases, and KV stores persist.

If nobody claims within 60 minutes, the deployment expires automatically — no cleanup needed.

## What you can deploy

- **Workers** — serverless functions on Cloudflare's edge
- **D1 databases** — SQLite at the edge
- **KV stores** — eventually-consistent key-value storage
- **Durable Objects** — stateful objects with strong consistency

## When to use this

- **Prototyping** — agent builds a quick API or webhook receiver, you verify, then claim
- **Previews** — agent deploys a preview of a feature for human review before merging
- **Handoff flows** — agent sets up infrastructure, human claims and owns it going forward
- **Agent self-deployment** — agents that need to publish their own tools or endpoints

## Limitations

- **60-minute expiration** — not suitable for persistent production workloads without claiming
- **No custom domains** — temporary deployments use Cloudflare's default subdomain
- **Rate limits apply** — standard Workers rate limits for the temporary tier
- **Single deployment** — each `--temporary` flag creates a new temporary account

## Security notes

- The agent receives an API token scoped to the temporary account only
- No access to any existing Cloudflare account or resources
- The claim URL is the only way to promote to a permanent account
- If the claim URL is lost, the deployment cannot be recovered after expiration