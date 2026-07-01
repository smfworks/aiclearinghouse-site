---
slug: kubernetes
title: "Kubernetes Self-Hosting"
excerpt: "Run agent workloads, vector databases, and inference APIs on Kubernetes for scale, resilience, and reproducible deployments."
category: "Virtualization"
tags:
  - kubernetes
  - k8s
  - containers
  - orchestration
  - self-hosting
order: 9
last_verified: "2026-07-01"
---

# Kubernetes Self-Hosting

## Why Kubernetes for agents

Kubernetes is the right platform when agent workloads need to scale beyond a single machine, share GPU resources, or run with high availability. It adds orchestration complexity, but it also gives you declarative deployments, autoscaling, and consistent environments across dev and production.

## What to run on Kubernetes

- **Inference APIs.** vLLM, TGI, or Ollama behind a service mesh.
- **Agent gateways.** OpenClaw Gateway, Hermes Agent, or LangServe deployments.
- **Vector databases.** Chroma, pgvector, Weaviate, or LanceDB Cloud-connected.
- **Observability.** Langfuse, Prometheus, and Grafana for tracing and metrics.
- **Workflow engines.** Inngest, Temporal, or Argo Workflows for durable agent tasks.

## Typical stack

```
NVIDIA GPU Operator
├── vLLM / Ollama (model serving)
├── OpenClaw Gateway (agent routing)
├── PostgreSQL + pgvector (memory)
├── Redis (queue / cache)
├── Langfuse (tracing)
└── Ingress + cert-manager (TLS)
```

## GPU considerations

- Use the NVIDIA GPU Operator or AMD GPU device plugin.
- Schedule GPU workloads with node selectors and resource limits.
- Pre-pull large models with init containers or persistent volumes.
- Use time-slicing or MIG for sharing GPUs across lighter agents.

## Storage

- Use ReadWriteMany volumes for shared model caches.
- Keep vector databases on fast SSD-backed storage.
- Separate ephemeral agent scratch space from persistent data.

## Operations

- Define health checks for inference endpoints; readiness probes prevent cold-start traffic.
- Set resource requests and limits to prevent one agent from starving another.
- Use Horizontal Pod Autoscaling on request queue depth, not just CPU.
- Rotate secrets via external secret operators; do not store keys in Git.

## Best fit

Teams running multiple agent services, sharing GPUs, or needing production-grade uptime. Kubernetes pays off when complexity is the alternative, not when a single Docker host would suffice.

## Related

- [Deployment Recipes](/deployment-recipes)
- [Docker Compose Full AI Stack](/deployment-recipes/docker-compose-ai-stack)
- [Self-Hosted pgvector for RAG](/deployment-recipes/pgvector-rag)
