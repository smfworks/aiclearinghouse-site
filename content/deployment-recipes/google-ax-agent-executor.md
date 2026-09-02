---
slug: google-ax-agent-executor
title: Deploy Google Agent Executor (AX) on Kubernetes
excerpt: Stand up Google's open-source distributed agent runtime on Kubernetes with Agent Substrate for suspendable, resumable, fault-tolerant agent execution at scale.
category: Self-Hosting
tags:
  - kubernetes
  - distributed
  - agents
  - google
  - runtime
order: 99
last_verified: "2026-09-02"
difficulty: Advanced
estimated_time: "60 min"
---

# Deploy Google Agent Executor (AX) on Kubernetes

## The promise

Run Google's open-source Agent Executor (AX) — a distributed harness runtime that dynamically provisions isolated environments from suspendable/resumable images to execute agents with native failure recovery and execution resumption. AX is designed for the reality of long-running autonomous agents that need to survive crashes, deploys, and restarts.

## What you will get

- A distributed agent runtime on Kubernetes that can suspend and resume agent actors
- Automatic recovery from failures with no lost progress
- Support for MCP tools, agent skills, and custom harnesses
- High-density agent multiplexing via Agent Substrate

## Prerequisites

- Kubernetes cluster (1.28+) with `kubectl` access
- Familiarity with Kubernetes CRDs, controllers, and DaemonSets
- Sufficient compute for your expected agent concurrency
- Docker or container runtime compatible with gVisor or microVMs

## Architecture overview

AX runs as a single-writer controller that manages an event log of durable execution state. It provisions isolated workers via Agent Substrate, which maps a larger set of agent "actors" onto a smaller set of ready "workers" — exploiting the fact that agents are idle most of the time to achieve heavy multiplexing.

Key components:
- **AX controller:** The single-writer that ensures consistent state management
- **Event log:** Durable execution state with automatic recovery
- **Agent Substrate control plane:** Manages actor lifecycle (create/destroy, suspend/resume) and routes traffic
- **Workers:** Kubernetes pods that host sandboxed agent actors via gVisor or microVMs

## Step 1: Install Agent Substrate

Agent Substrate is the recommended compute layer for AX on Kubernetes. Install the control plane components:

```bash
# Clone the substrate repository
git clone https://github.com/agent-substrate/substrate.git
cd substrate

# Review the deployment manifests
cat manifests/README.md

# Apply the CRDs and control plane
kubectl apply -f manifests/crd/
kubectl apply -f manifests/control-plane/
```

This installs the core components: `ateapi` (API server), `atelet` (node-level DaemonSet), `atecontroller` (Kubernetes controller), `atenet` (networking), and `ateom-gvisor` or `ateom-microvm` (sandbox helpers).

## Step 2: Deploy AX

```bash
# Clone the AX repository
git clone https://github.com/google/ax.git
cd ax

# Review the deployment guide
cat manifests/README.md

# Apply AX manifests configured for your substrate
kubectl apply -f manifests/
```

AX is self-hosted and not a managed service. You operate it on your own cluster.

## Step 3: Configure a worker pool

```yaml
apiVersion: ate.agent-substrate.io/v1alpha1
kind: WorkerPool
metadata:
  name: agent-workers
spec:
  template:
    spec:
      sandboxTechnology: gVisor  # or microvm
      containers:
      - name: agent-runtime
        image: your-agent-image:latest
  minReplicas: 3
  maxReplicas: 50
```

## Step 4: Deploy your first agent actor

```yaml
apiVersion: ate.agent-substrate.io/v1alpha1
kind: ActorTemplate
metadata:
  name: my-agent
spec:
  harness: antigravity  # built-in, or implement HarnessService for custom
  skills:
  - name: web-search
  mcpTools:
  - name: filesystem
  containers:
  - name: agent
    image: your-agent:latest
```

## Step 5: Verify

```bash
# Check AX is running
kubectl get pods -n ax-system

# Check substrate workers
kubectl get workers -n ate-system

# Check actor templates
kubectl get actortemplates

# Run the built-in counter demo to verify state preservation
kubectl apply -f demos/counter/
```

## Warnings

- AX is in active early development. APIs will change before stable release. Do not deploy to production without pinning a specific commit.
- The project explicitly warns: "We are actively refining our core, resumption protocols, and runtime specifications, which will introduce major breaking changes prior to a stable release."
- Agent Substrate is also in early development and not production-ready.

## When to use this

- You are running hundreds or thousands of long-running agents that need suspend/resume capability.
- Your agents are stateful and cannot afford to lose progress on crashes or deploys.
- You need high-density agent multiplexing to reduce compute costs.
- You want a Kubernetes-native, open-source agent runtime from Google.