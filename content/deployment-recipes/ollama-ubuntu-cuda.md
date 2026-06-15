---
slug: ollama-ubuntu-cuda
title: Run Ollama on Ubuntu 24.04 with NVIDIA CUDA
excerpt: A tested, copy-paste recipe for installing Ollama on Ubuntu with GPU acceleration.
category: Self-Hosting
tags:
  - ollama
  - ubuntu
  - cuda
  - nvidia
  - local-llm
---

## What you'll get

A local Ollama server on Ubuntu 24.04 that uses your NVIDIA GPU for inference. This is the standard starting point for running local LLMs before adding agents like Cline, Aider, or OpenClaw.

## Prerequisites

- Ubuntu 24.04 (desktop or server)
- NVIDIA GPU with compute capability 5.2 or higher
- Internet access during install
- `curl` and basic terminal comfort

## Step 1: Install the NVIDIA driver and CUDA toolkit

```bash
sudo apt update
sudo apt install -y linux-headers-$(uname -r) build-essential
sudo apt install -y nvidia-driver-535  # or newer
sudo reboot
```

After reboot, verify the driver:

```bash
nvidia-smi
```

Install CUDA if Ollama cannot find `libcuda`:

```bash
sudo apt install -y nvidia-cuda-toolkit
nvcc --version
```

## Step 2: Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

This installs the service and `ollama` CLI. The service starts automatically.

## Step 3: Pull a model

Start with a small, capable model to verify everything works:

```bash
ollama pull qwen3.5:9b
ollama run qwen3.5:9b
```

If you have more VRAM, pull a larger coding model:

```bash
ollama pull minimax-m3:cloud
ollama pull gemma4:12b
```

## Step 4: Verify GPU offload

Run a quick benchmark and watch `nvidia-smi` in another terminal:

```bash
ollama run qwen3.5:9b "Explain CUDA in one paragraph."
```

In the second terminal:

```bash
watch -n 1 nvidia-smi
```

If GPU memory usage climbs, offload is working.

## Step 5: Make Ollama available to local agents

By default Ollama listens on `127.0.0.1:11434`, which is correct for local-only agents. If you want Cline, Aider, or OpenClaw on the same machine to use it, just point them at `http://localhost:11434`.

To expose to your LAN (optional, not recommended on untrusted networks):

```bash
sudo systemctl edit ollama.service
```

Add:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Then reload:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

## Sanity check commands

| Check | Command |
|-------|---------|
| Service status | `sudo systemctl status ollama` |
| GPU visible | `nvidia-smi` |
| Model list | `ollama list` |
| Single prompt | `ollama run <model> "prompt"` |
| API test | `curl http://localhost:11434/api/tags` |

## Common gotchas

- **"could not select device driver"** — NVIDIA driver is missing or wrong version. Check `nvidia-smi`.
- **Ollama falls back to CPU** — CUDA toolkit may be missing. Install `nvidia-cuda-toolkit`.
- **Port already in use** — Another service is on 11434. Stop it or change `OLLAMA_HOST`.

## Next step

Once Ollama is running, add an agent. See the [Cline local setup recipe](/deployment-recipes/cline-local) or the [OpenClaw first-agent guide](/deployment-recipes/openclaw-first-agent).
