---
slug: agent-substrate-gke-deploy
title: "Deploy Agent Substrate on Google Kubernetes Engine"
excerpt: "Run millions of agent sandboxes with 10x higher density than standard containers on GKE using Google's open-source Agent Substrate — sub-500ms resume, zero-trust kernel isolation."
category: Self-Hosting
tags:
  - kubernetes
  - gke
  - agent-runtime
  - sandbox
  - production
  - google-cloud
order: 99
last_verified: "2026-09-16"
difficulty: Advanced
estimated_time: "45 min"
---

# Deploy Agent Substrate on Google Kubernetes Engine

## What you will build

A high-density, secure agent execution runtime on Google Kubernetes Engine (GKE) using Agent Substrate — Google's open-source, secure-by-default agent runtime designed to run millions of sandboxes with sub-500ms resume operations.

## Prerequisites

- A Google Cloud project with GKE cluster access
- `gcloud` CLI installed and authenticated
- `kubectl` installed
- Basic Kubernetes and GKE familiarity

## Why Agent Substrate

Standard container runtimes are not built for the agent workload pattern: many short-lived, stateful, frequently suspended/resumed sandboxes. Agent Substrate is purpose-built for this:

| Property | Standard containers | Agent Substrate |
|----------|-------------------|-----------------|
| Resume time | Seconds | Sub-500ms |
| Suspend/resume rate | Limited | 500+ activations/sec |
| Density | Baseline | 10x higher |
| Isolation | Container-level | Zero-trust kernel + network |
| Stateful workspaces | Persistent volumes | Filestore agent volumes (ms attach/detach) |

## Step 1: Create a GKE cluster (if you don't have one)

```bash
gcloud container clusters create agent-substrate-cluster \
  --region=us-central1 \
  --machine-type=e2-standard-4 \
  --num-nodes=3 \
  --enable-dataplane-v2
```

## Step 2: Install Agent Substrate

Agent Substrate is open-source and runs on any Kubernetes infrastructure, optimized for GKE.

```bash
# Clone the repository
git clone https://github.com/google/agent-substrate.git
cd agent-substrate

# Apply the Kubernetes manifests
kubectl apply -f deploy/
```

Verify the installation:

```bash
kubectl get pods -n agent-substrate
```

## Step 3: Configure ComputeClasses

Agent Substrate on GKE uses custom ComputeClasses to dynamically manage machine pools:

```yaml
apiVersion: substrate.google.com/v1
kind: ComputeClass
metadata:
  name: agent-compute
spec:
  machineTypes:
    - e2-standard-4
    - e2-standard-8
  poolStrategy: Mixed  # Use spot + on-demand
  minReplicas: 3
  maxReplicas: 100
```

Apply:

```bash
kubectl apply -f compute-class.yaml
```

## Step 4: Enable Filestore agent volumes (optional but recommended)

For stateful agent workspaces that need near-instant resume:

```bash
# Create a Filestore instance
gcloud filestore instances create agent-volumes \
  --zone=us-central1-a \
  --tier=BASIC_HDD \
  --file-share=name=agent-volumes,capacity=1TB

# Configure Agent Substrate to use it
kubectl apply -f deploy/filestore-integration.yaml
```

Filestore agent volumes attach and detach NFS mounts in milliseconds, enabling:
- Near-instantaneous agent start/resume
- Native Read-Write-Many (RWX) access
- POSIX-compliant file locking for safe multi-agent collaboration

## Step 5: Deploy your first agent sandbox

```yaml
apiVersion: substrate.google.com/v1
kind: AgentSandbox
metadata:
  name: my-first-agent
spec:
  computeClass: agent-compute
  image: my-agent:latest
  tools:
    - name: filesystem
      mcpServer: filesystem-mcp
    - name: web-search
      mcpServer: tavily-mcp
  env:
    - name: MODEL_PROVIDER
      value: "openai"
  suspendAfter: 300s  # Auto-suspend after 5 min idle
```

```bash
kubectl apply -f agent-sandbox.yaml
```

## Step 6: Verify sub-500ms resume

```bash
# Suspend the agent
kubectl substrate suspend my-first-agent

# Resume and measure
time kubectl substrate resume my-first-agent
# Should show <500ms
```

## Step 7: Scale test

Agent Substrate is designed for millions of sandboxes. To test density:

```bash
# Deploy 100 agent sandboxes
kubectl scale agentsandbox --replicas=100

# Monitor density vs standard containers
kubectl substrate density-report
```

## Use Google Axion for better price-performance

Agent Substrate on GKE supports Google Axion (custom Arm-based processors), delivering up to 30% better price-performance for sandbox workloads:

```yaml
spec:
  architecture: arm64
  machineTypes:
    - t2a-standard-4  # Axion
```

## When to use this recipe

- You need to run hundreds or thousands of agent sandboxes in production
- Sub-second resume time is critical for your agent UX
- You want 10x higher sandbox density than standard containers
- You need zero-trust kernel isolation for untrusted agents
- You are building a multi-agent platform that needs safe file sharing (RWX + POSIX locking)

## Pitfalls

- **GKE-specific optimization**: While Agent Substrate runs on any K8s, the GKE optimizations (ComputeClasses, Filestore, Axion) are Google Cloud features
- **Production allowlist**: GA support for production is available via allowlist — contact Google Cloud for access
- **Filestore cost**: NFS volumes add storage cost; use only for stateful agents that need resume
- **Learning curve**: Agent Substrate introduces new CRDs (AgentSandbox, ComputeClass) that differ from standard Kubernetes deployments