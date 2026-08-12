---
slug: agentgateway-kubernetes-deploy
title: "Deploy agentgateway on Kubernetes for MCP and A2A Traffic"
excerpt: "Set up Solo.io's Rust-based AI gateway on Kubernetes to manage MCP tool routing, A2A agent communication, cost controls, and LLM inference proxying."
category: Self-Hosting
tags:
  - kubernetes
  - gateway
  - mcp
  - a2a
  - infrastructure
  - self-hosting
order: 99
last_verified: "2026-08-12"
difficulty: Advanced
estimated_time: "45 min"
---

# Deploy agentgateway on Kubernetes for MCP and A2A Traffic

## Overview

agentgateway is a Rust-based, Linux Foundation-governed AI gateway that unifies MCP tool routing, A2A agent communication, LLM inference proxying, and Kubernetes Gateway API support. This recipe deploys it on a Kubernetes cluster to manage traffic between your agents, MCP tool servers, and remote A2A agents — with cost controls, RBAC policies, and observability built in.

## Prerequisites

- **Kubernetes cluster**: v1.28+ (any provider — EKS, GKE, AKS, or self-managed)
- **kubectl**: Configured and connected to your cluster
- **Gateway API CRDs**: Installed on the cluster
- **Helm**: v3.8+ (for agentgateway installation)

## Step 1: Install Gateway API CRDs

```bash
# Install the Gateway API CRDs
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/standard-install.yaml

# Verify CRDs are installed
kubectl get crd | grep gateway
```

## Step 2: Install agentgateway

```bash
# Add the agentgateway Helm repository
helm repo add agentgateway https://agentgateway.dev/charts
helm repo update

# Install agentgateway in the agentgateway namespace
helm install agentgateway agentgateway/agentgateway \
  --namespace agentgateway \
  --create-namespace \
  --set gateway.enabled=true
```

## Step 3: Configure MCP tool routing

Create a Gateway and HTTPRoute to manage MCP server traffic:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: agent-gateway
  namespace: agentgateway
spec:
  gatewayClassName: agentgateway
  listeners:
    - name: mcp
      port: 8080
      protocol: HTTP
    - name: a2a
      port: 8081
      protocol: HTTP
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: mcp-tools-route
  namespace: agentgateway
spec:
  parentRefs:
    - name: agent-gateway
      sectionName: mcp
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /mcp/filesystem
      backendRefs:
        - name: mcp-filesystem-server
          port: 3000
    - matches:
        - path:
            type: PathPrefix
            value: /mcp/github
      backendRefs:
        - name: mcp-github-server
          port: 3001
```

Apply:
```bash
kubectl apply -f mcp-routes.yaml
```

## Step 4: Configure cost controls

Set up per-team budget enforcement:

```yaml
apiVersion: agentgateway.io/v1
kind: AIBudget
metadata:
  name: engineering-monthly
  namespace: agentgateway
spec:
  limitUsd: 500.00
  scope: team
  team: engineering
  resetCycle: monthly
  rejectionStatusCode: 429
```

When the budget is exhausted, agentgateway returns:
```json
{
  "error": "budget_exhausted",
  "budget_id": "engineering-monthly",
  "remaining_usd": "0.000000",
  "resets_at": "2026-09-01T00:00:00Z"
}
```

## Step 5: Configure A2A agent communication

Register remote A2A-capable agents:

```yaml
apiVersion: agentgateway.io/v1
kind: A2AAgent
metadata:
  name: research-agent
  namespace: agentgateway
spec:
  endpoint: https://remote-agent.example.com
  protocol: a2a
  transport: jsonrpc-over-http
  streaming: sse
```

## Step 6: Configure RBAC for MCP tools

Use CEL-based policy to restrict which agents can call which tools:

```yaml
apiVersion: agentgateway.io/v1
kind: MCPToolPolicy
metadata:
  name: filesystem-restrict
  namespace: agentgateway
spec:
  tool: /mcp/filesystem
  allowedAgents:
    - coding-agent
    - research-agent
  deniedOperations:
    - delete
    - move
```

## Step 7: Verify the deployment

```bash
# Check agentgateway is running
kubectl get pods -n agentgateway

# Test MCP routing
curl http://$(kubectl get gateway agent-gateway -n agentgateway -o jsonpath='{.status.addresses[0].value}'):8080/mcp/filesystem/health

# Check the built-in UI
kubectl port-forward svc/agentgateway-ui -n agentgateway 9090:9090
# Open http://localhost:9090
```

## Observability

agentgateway exposes Prometheus metrics at `/metrics`:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: agentgateway
  namespace: agentgateway
spec:
  selector:
    matchLabels:
      app: agentgateway
  endpoints:
    - port: metrics
      path: /metrics
```

## Key metrics to watch

- **Request rate per tool**: Identify which MCP tools are hot
- **Budget consumption**: Track spend against limits before they're hit
- **A2A task latency**: Monitor cross-agent delegation time
- **Policy rejections**: Track RBAC denials to catch misconfigured agents

## References

- agentgateway docs: https://agentgateway.dev/docs/kubernetes
- Solo.io blog: "Designing agentgateway" (June 5, 2026)
- Solo.io blog: "Building Real-Time AI Cost Controls with agentgateway"