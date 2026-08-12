---
slug: northflank-agent-infrastructure
title: "Northflank: Full-Stack AI Sandbox and Agent Infrastructure Platform"
excerpt: "MicroVM-backed sandboxes, databases, APIs, CI/CD, and GPU workloads in one platform — deploy in your own cloud (BYOC) or Northflank's managed cloud."
category: Infrastructure
tags:
  - sandbox
  - microvm
  - byoc
  - kubernetes
  - gpu
  - agents
  - security
provider: "Northflank"
pricing_model: Usage-based
price: "Free tier; paid from $25/mo for teams"
website: https://northflank.com
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-08-12"
---

# Northflank: Full-Stack AI Sandbox and Agent Infrastructure Platform

## What it is

Northflank is a full-stack AI agent infrastructure platform that provides microVM-backed sandboxes, databases, APIs, CI/CD pipelines, GPU workloads, and observability in a single platform. Unlike agent-hosting-only platforms, Northflank covers the entire infrastructure stack — you can run agents, APIs, workers, and databases alongside sandboxes, all within the same environment.

The platform's biggest differentiator is production-grade BYOC (Bring Your Own Cloud) support. You can deploy into AWS, GCP, Azure, Oracle, CoreWeave, Civo, or bare metal, and Northflank handles the orchestration while your data never leaves your VPC. For teams in fintech, healthcare, or any regulated industry, this distinction often determines whether a platform passes security review.

## Core capabilities

- **MicroVM sandboxes**: Hardware-level isolation using Kata Containers and gVisor, with standard container workflows. Deploy any OCI container image and get VM-grade security.
- **Persistent and ephemeral environments**: Run both stateful long-running agents and disposable code-execution sandboxes on the same platform.
- **GPU support**: Run GPU-accelerated workloads (model inference, vision processing) alongside your agent sandboxes.
- **BYOC deployment**: Deploy into your own cloud account — data never leaves your VPC.
- **CI/CD pipelines**: Built-in continuous integration and deployment for agent applications.
- **Observability**: Logs, metrics, and tracing across all workloads.

## When to use it

- You need both persistent and ephemeral agent environments on one platform
- You must deploy sandboxes inside your own cloud account or VPC for compliance
- You need GPU support in your sandbox workloads
- You want agents, APIs, workers, and databases running alongside sandboxes
- You need filesystem state to survive between executions with no session cap

## When to skip it

- You only need a simple ephemeral code-execution sandbox (consider Daytona or E2B)
- You don't need BYOC and prefer a fully managed experience
- Your team doesn't have cloud infrastructure experience

## Pricing

- **Free tier**: Available for individuals and small projects
- **Paid plans**: From approximately $25/month for teams, scaling with usage
- **BYOC**: You pay your cloud provider directly for compute resources

## Alternatives

- **Daytona** — focused on sandbox environments, simpler, lighter-weight
- **E2B** — code execution sandbox specialist, lighter on full-stack infrastructure
- **Modal** — serverless GPU functions, different model ( Functions-as-a-Service)
- **Fly.io** — container-based deployment with persistent volumes, broader but less agent-specialized