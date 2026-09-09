---
slug: comfyui-docker-local-image-gen
title: Deploy ComfyUI with Docker for Local AI Image Generation
excerpt: Stand up ComfyUI in a Docker container on your own GPU for private, unlimited AI image generation — no API bills, no per-image fees, no prompts leaving your machine.
category: Deployment
tags:
  - comfyui
  - docker
  - self-hosting
  - gpu
  - image-generation
  - stable-diffusion
order: 102
last_verified: "2026-09-09"
difficulty: Intermediate
estimated_time: "30 min"
---

# Deploy ComfyUI with Docker for Local AI Image Generation

## The promise

Run ComfyUI — the node-based AI image generation engine — in a Docker container on your own GPU. Generate unlimited images with Stable Diffusion, Flux, or Qwen-Image models with zero per-image cost, zero API dependencies, and zero prompts leaving your machine. This is the setup SMF Works uses for all brand visual production.

## What you will get

- A Dockerized ComfyUI server running on your GPU
- A web interface accessible at `http://localhost:8188`
- Support for SDXL, Flux.1, Qwen-Image, and other open checkpoints
- A persistent models directory that survives container restarts
- API access for programmatic image generation from agents and scripts

## Prerequisites

- NVIDIA GPU with at least 8GB VRAM (12GB+ recommended for Flux; 16GB+ for Qwen-Image)
- Docker and NVIDIA Container Toolkit installed and working
- Enough disk space for model weights (10-50GB depending on models)
- Basic comfort with Docker commands and terminal

## Steps

### 1. Create a persistent directory structure

```bash
mkdir -p ~/comfyui/{models,output,custom-nodes}
mkdir -p ~/comfyui/models/{checkpoints,loras,vae,clip,clip_vision,unet}
```

This keeps your model weights and outputs outside the container so they survive restarts.

### 2. Pull and run the ComfyUI Docker image

The official ComfyUI Docker image handles CUDA setup automatically:

```bash
docker run -d \
  --name comfyui \
  --gpus all \
  -p 8188:8188 \
  -v ~/comfyui/models:/app/models \
  -v ~/comfyui/output:/app/output \
  -v ~/comfyui/custom-nodes:/app/custom-nodes \
  --restart unless-stopped \
  yanwk/comfyui-boot:latest
```

> Adjust the image tag to the current version. Check Docker Hub or the ComfyUI GitHub releases for the latest.

### 3. Download a model checkpoint

Download a model into your persistent models directory. For Flux.1 Schnell (fast, lower quality, Apache-2 license):

```bash
# Download into the unet directory
wget -O ~/comfyui/models/unet/flux1-schnell.safetensors \
  https://huggingface.co/black-forest-labs/FLUX.1-schnell/resolve/main/flux1-schnell.safetensors
```

For Stable Diffusion XL (smaller VRAM requirement):

```bash
wget -O ~/comfyui/models/checkpoints/sd_xl_base_1.0.safetensors \
  https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
```

### 4. Verify the server is running

Open `http://localhost:8188` in your browser. You should see the ComfyUI node-based interface with a default workflow loaded.

### 5. Generate your first image

The default text-to-image workflow should load automatically. If not, go to `Workflows > Templates` and select a text-to-image template. Enter a prompt, click "Queue Prompt," and wait for the image to appear.

### 6. Connect an agent or script

ComfyUI exposes a REST API at `http://localhost:8188/api`. You can queue prompts programmatically:

```bash
curl -X POST http://localhost:8188/api/prompt \
  -H 'Content-Type: application/json' \
  -d '{"prompt": { ... workflow JSON ... }}'
```

For agent integration, the ComfyUI MCP server provides tool-based access. Hermes Agent can call ComfyUI through the MCP interface to generate images as part of a larger workflow.

## Verification

- Browser interface loads at `http://localhost:8188`
- A test image generates successfully within 30-60 seconds (depending on GPU and model)
- `docker logs comfyui` shows no CUDA errors
- `nvidia-smi` inside the container shows the GPU is recognized

## Troubleshooting

- **GPU not detected:** Verify NVIDIA Container Toolkit is installed (`nvidia-ctk --version`). Run `docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi` to confirm Docker can see the GPU.
- **OOM errors:** Use a smaller model (SDXL instead of Flux) or reduce the image resolution. For Qwen-Image, ensure at least 14-16GB VRAM headroom.
- **Model not found:** Check that model files are in the correct subdirectory of `~/comfyui/models/`. ComfyUI looks for checkpoints in `models/checkpoints/`, unets in `models/unet/`, etc.
- **Slow generation:** Confirm the GPU is actually being used — check `nvidia-smi` during generation. If CPU is being used instead, the container's CUDA setup is wrong.

## Honest notes

ComfyUI's Docker image and node ecosystem change frequently. Custom nodes from ComfyUI Manager may have dependencies that break across versions. Pin your image tag and test node updates before deploying. The node-based interface has a learning curve — start with templates, do not build a workflow from scratch on day one.