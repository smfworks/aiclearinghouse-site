---
slug: runpod-gpu
title: Rent a Cloud GPU on RunPod
excerpt: Get NVIDIA GPU compute by the hour without buying hardware. Deploy Ollama on cloud GPUs for local-privacy inference with cloud convenience.
category: Cloud GPU
tags:
  - runpod
  - cloud-gpu
  - nvidia
  - ollama
  - serverless
  - cost-optimization
order: 4
last_verified: 2026-06-15
---

# Rent a Cloud GPU on RunPod

## The promise

Not everyone can afford a $3,000 GPU workstation. RunPod lets you rent NVIDIA GPUs by the hour — as low as $0.25/hour for an RTX 4090 equivalent. You get local-privacy inference (your data stays on the rented machine, not a shared API) with cloud convenience (no hardware maintenance, pay only for what you use).

This recipe deploys Ollama on RunPod with persistent storage, so your models survive between sessions.

## What you'll get

- A RunPod GPU pod running Ollama
- Persistent network volume for model storage
- Secure HTTPS access via RunPod's proxy
- Cost controls (automatic shutdown after idle time)
- Ability to run 70B+ parameter models without buying hardware

## Prerequisites

- RunPod account (free to create)
- Payment method on file (pay-as-you-go, no subscription)
- Basic Docker knowledge

## Step 1: Create a RunPod account

1. Go to [runpod.io](https://www.runpod.io)
2. Sign up and verify email
3. Add a payment method (credit card or crypto)
4. Navigate to "Serverless" or "GPU Pods"

## Step 2: Deploy a GPU pod

1. Click "Deploy" → "GPU Pods"
2. Select a GPU:
   - **RTX 4090** (~$0.44/hour) — best value for most models
   - **A6000** (~$0.79/hour) — 48GB VRAM for large models
   - **A100** (~$1.99/hour) — 80GB VRAM for 70B+ models
3. Choose a template: search for "Ollama" or use "PyTorch"
4. Set disk size: 50GB minimum (models are 4–8GB each)
5. Enable "Network Volume" for persistence
6. Deploy

Wait 2–3 minutes for the pod to start. You will see a green "Running" status.

## Step 3: Connect to your pod

RunPod provides a web terminal. Click "Connect" → "Web Terminal".

Alternatively, use SSH:

```bash
ssh root@<your-pod-ip> -p <your-port>
```

Credentials are shown in the pod details page.

## Step 4: Install Ollama

In the pod terminal:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &
```

## Step 5: Pull and test a model

```bash
ollama pull qwen3.5:9b
ollama run qwen3.5:9b
```

Test:

> "Say hello and confirm you are running on a RunPod GPU."

You should see a fast response (under 2 seconds for the 9B model on an RTX 4090).

## Step 6: Expose Ollama via RunPod proxy

RunPod automatically creates a URL for exposed ports. To make Ollama accessible:

1. In the pod settings, add a port: `11434`
2. Set protocol to `HTTP`
3. RunPod generates a URL like `https://xxxxx-11434.proxy.runpod.net`

Test from your local machine:

```bash
curl https://xxxxx-11434.proxy.runpod.net/api/tags
```

You should see a JSON list of pulled models.

## Step 7: Connect your local tools

Use the RunPod proxy URL in your local tools:

### Cline / Continue (VS Code)

```json
{
  "models": [{
    "title": "RunPod Qwen",
    "provider": "ollama",
    "model": "qwen3.5:9b",
    "apiBase": "https://xxxxx-11434.proxy.runpod.net"
  }]
}
```

### OpenClaw

```bash
openclaw configure
# Set provider to "Custom OpenAI-compatible"
# Enter the RunPod URL as endpoint
```

### Aider

```bash
aider --model ollama/qwen3.5:9b --api-base https://xxxxx-11434.proxy.runpod.net
```

## Cost optimization

### Automatic shutdown

Set idle timeout in RunPod settings:
- **5 minutes idle** — aggressive cost control
- **30 minutes idle** — balanced (recommended)
- **Never** — only if you are actively developing

### Pre-purchase models

Models download slowly on first use. Keep popular models pulled on your network volume:

```bash
# In your pod terminal
ollama pull qwen3.5:9b
ollama pull qwen2.5-coder:14b
ollama pull llama3.1:8b
```

Network volumes persist between pod restarts, so models stay available.

### Spot instances

RunPod offers "spot" GPUs at 50–70% discount. The tradeoff: your pod can be terminated if demand spikes. Best for:
- Batch processing
- Experiments
- Non-critical inference

Not recommended for persistent services or production APIs.

## Security considerations

### Data privacy

- Your data stays on the rented GPU — not shared with other users
- RunPod staff can technically access pods — use encryption for sensitive data
- Network traffic between you and RunPod is HTTPS encrypted
- For maximum privacy: rent a "secure cloud" pod (higher cost, isolated infrastructure)

### API key protection

If exposing Ollama publicly:
1. Add basic auth to the proxy
2. Use a reverse proxy with API key validation
3. Or restrict to IP whitelist

## Troubleshooting

### "CUDA out of memory"

Your model is too large for the GPU VRAM. Solutions:
- Use a smaller model (7B instead of 14B)
- Use a GPU with more VRAM (A6000 instead of RTX 4090)
- Enable CPU offloading (slower but works)

### Slow model downloads

RunPod data center bandwidth varies. If downloads are slow:
- Try a different data center (US West vs US East vs EU)
- Use a network volume (persists between sessions)
- Download models during off-peak hours

### Pod fails to start

Check the pod logs in RunPod dashboard. Common issues:
- Insufficient account balance
- GPU type temporarily unavailable
- Template misconfiguration

## Best fit

Developers who want GPU-accelerated local inference without capital expenditure. Particularly strong for: experimenting with large models (70B+), occasional heavy inference workloads, teams that need GPU access without buying dedicated hardware, and prototyping before committing to local infrastructure.
