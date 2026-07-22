---
slug: appcrane-self-hosted-agent-paas
title: Deploy appCrane as a Self-Hosted Agent PaaS
excerpt: Self-hosted platform for apps your AI agents build and deploy — agent-first over MCP, with enterprise SSO, per-user audit, and a secret hard-wall.
category: Self-Hosting
tags:
  - docker
  - self-hosting
  - paas
  - mcp
  - agent-deployment
  - production
order: 99
last_verified: "2026-07-22"
difficulty: Intermediate
estimated_time: "45 min"
---

# Deploy appCrane as a Self-Hosted Agent PaaS

## The promise

appCrane is a self-hosted platform where AI agents can build and deploy applications on your own server. Think of it as a self-hosted Heroku for agent-generated apps — agents create the code, appCrane handles the deployment, routing, secrets, and audit trail.

## What you will get

- A running PaaS that agents can deploy apps to via MCP
- Per-user authentication with enterprise SSO
- A complete audit trail of which agent deployed what and when
- A secret hard-wall — agent A cannot access agent B's environment variables or credentials
- Docker-based deployments managed through a web UI or API

## Prerequisites

- A server with Docker and Docker Compose installed
- Node.js 18+ (appCrane is JavaScript-based)
- A domain name with DNS control (for routing)
- Optional: SSO provider (OIDC/SAML) for enterprise authentication

## Steps

1. **Clone the repository.**
   ```bash
   git clone https://github.com/gitayg/appCrane
   cd appCrane
   ```

2. **Configure environment variables.** Copy the example `.env` file and set your domain, database URL, and SSO provider details.

3. **Start with Docker Compose.**
   ```bash
   docker-compose up -d
   ```
   This starts the appCrane server, database, and reverse proxy.

4. **Configure DNS.** Point your domain's wildcard record (`*.yourdomain.com`) to your server's IP address. appCrane uses this to route deployed apps to unique subdomains.

5. **Set up the MCP connection.** Add appCrane's MCP endpoint to your agent's configuration. Your agent can now deploy apps by calling appCrane's MCP tools.

6. **Create user accounts.** If using SSO, configure your provider. Otherwise, create accounts through the admin UI.

7. **Test the deployment flow.** Have your agent create a simple app and deploy it. Verify it appears at the expected subdomain and that the audit log captures the action.

## Post-deployment

- **Backups:** Back up the appCrane database regularly — it stores all deployment metadata and audit logs.
- **Resource limits:** Set Docker resource constraints per deployed app to prevent a single agent app from consuming all server resources.
- **Secret rotation:** Use appCrane's secret management to rotate API keys and credentials without redeploying apps.
- **Monitoring:** appCrane exposes health check endpoints — wire them into your existing monitoring stack.

## Limitations

- Single-server deployment (no clustering in the current version).
- JavaScript/Node.js ecosystem — no native support for other runtime deployment.
- New project (launched mid-2026) — expect rough edges and API changes.
- AGPL-3.0 license — verify compatibility with your organization's licensing policy.

## Resources

- **GitHub:** [gitayg/appCrane](https://github.com/gitayg/appCrane)
- **License:** AGPL-3.0