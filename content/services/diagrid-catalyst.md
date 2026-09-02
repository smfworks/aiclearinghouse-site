---
slug: diagrid-catalyst
title: "Diagrid Catalyst 2.0: Durable and Verifiable Agent Execution"
excerpt: "Add automatic failure recovery and cryptographic execution attestation to AI agents built on LangGraph, Google ADK, Microsoft Agent Framework, and six other frameworks — without rewriting code."
category: Infrastructure
tags:
  - durable-execution
  - agent-orchestration
  - reliability
  - mcp
  - kubernetes
  - attestation
provider: Diagrid
pricing_model: Subscription
price: "Free tier; Dedicated Cloud from $1,499/mo; BYOC from $1,999/mo"
website: https://www.diagrid.io/catalyst
image: /images/agentmarketplace/services-hero.svg
order: 99
last_verified: "2026-09-02"
---

# Diagrid Catalyst 2.0: Durable and Verifiable Agent Execution

## What it is

Diagrid Catalyst 2.0, released July 28, 2026, brings durable and verifiable execution to AI agent frameworks developers already use. Agents automatically resume from the exact point of failure, and every step of execution can be cryptographically signed and traced back to its source. Built on the Dapr runtime (CNCF project), Catalyst adds a code package to an existing agent application — no re-architecting required.

## Supported frameworks

Ten framework integrations ship in the release:

- LangGraph and LangGraph Deep Agents
- Microsoft Agent Framework
- Google Agent Development Kit (ADK)
- AWS Strands
- OpenAI Agents SDK
- Claude Managed Agents
- CrewAI
- Pydantic AI Agents
- Dapr Agents

## Key features

- **Durable workflows:** Automatic retries, checkpoints, and recovery. Long-running and asynchronous execution. No lost progress on crashes, deploys, or restarts. Durability applies to individual model and tool calls, not just graph boundaries.

- **Verifiable execution:** Every step signed into a tamper-evident record. Cryptographic attestation of who ran what. Full trace and deterministic replay for audit, security, and compliance. Signing is validated when workflow state is loaded, so deleted, reordered, or modified history is detectable.

- **Session management:** First-class session lifecycle management with explicit state ownership and isolation. Safe handoff between agents and workflows.

- **Pub/Sub for agent communication:** Event-driven messaging for decoupled, scalable multi-agent interactions. Supports fan-out, fan-in, and async coordination.

- **Agent identity and zero-trust security:** mTLS by default. Identity-based agent communication. Audit-friendly tracing and logs.

- **Multi-region failover:** Routes traffic between regions and clouds for availability during catastrophic outages.

## What sets it apart

LangGraph offers checkpointing at graph superstep boundaries and persistent task execution through Agent Server. Temporal and Restate provide replay or journal-based execution. Catalyst's differentiator is a single Dapr-based recovery and attestation model spanning several frameworks, applying durability to individual model and tool calls rather than graph boundaries.

## Pricing

- **Cloud:** Free. Durable workflows, native framework integrations, agent/MCP auth, MCP server catalog, workflow visualizers. No credit card required.
- **Dedicated Cloud:** From $1,499/mo. Single-tenant, fully managed, compute/storage/networking included, 99.95% availability.
- **BYOC (Bring Your Own Cloud):** From $1,999/mo. Data plane in your network, control plane in Diagrid's. Data sovereignty and localization.
- **Enterprise Server:** Contact for pricing. On-prem, air-gapped, full control for regulated environments.
- Annual billing saves 20%. Price is set by concurrency band and support tier, not per execution.