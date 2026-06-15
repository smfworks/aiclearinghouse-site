---
slug: ollama-ubuntu-cuda
title: Run Ollama on Ubuntu 24.04 with NVIDIA CUDA
excerpt: Install Ollama on Ubuntu with GPU acceleration — the standard foundation for local agents and LLMs.
category: Self-Hosting
tags:
  - ollama
  - ubuntu
  - cuda
  - nvidia
  - local-llm
  - gpu
order: 5
last_verified: 2026-06-15
difficulty: Intermediate
estimated_time: 30 min
---

# Run Ollama on Ubuntu 24.04 with NVIDIA CUDA

## The promise

Running a local LLM is the closest thing in AI to owning your own engine. You decide which model runs, which data it sees, and whether anything leaves your machine. Ollama is the simplest way to run that engine on Linux. Add an NVIDIA GPU and CUDA, and suddenly local models are not just possible — they are fast.

This recipe is the standard starting point for nearly every local-agent setup on this site. Master it once, then plug it into Cline, OpenClaw, Hermes, Aider, or Open WebUI.

## What you'll get

- Ollama installed as a systemd service on Ubuntu 24.04
- NVIDIA driver and CUDA toolkit configured
- One or more local models pulled and verified on GPU
- The Ollama REST API available at `http://localhost:11434`

## Prerequisites

- Ubuntu 24.04 desktop or server
- NVIDIA GPU with compute capability 5.2 or higher
- Internet access during install
- `curl`, `sudo`, and comfort with `systemctl`

## Step 1: Install the NVIDIA driver

```bash
sudo apt update
sudo apt install -y linux-headers-$(uname -r) build-essential
sudo apt install -y nvidia-driver-535
sudo reboot
```

After reboot, verify the driver:

```bash
nvidia-smi
```

You should see your GPU name, driver version, and current memory usage. If `nvidia-smi` returns an error, the driver did not install correctly.

## Step 2: Install CUDA if needed

Ollama bundles most of what it needs, but some systems require the CUDA toolkit for `libcuda`:

```bash
sudo apt install -y nvidia-cuda-toolkit
nvcc --version
```

If you already have CUDA 12.x from another source, you may skip this step.

## Step 3: Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

This installs the `ollama` binary, sets up the systemd service, and starts it automatically.

Check the service:

```bash
sudo systemctl status ollama
```

## Step 4: Pull your first model

Start with a small, capable model to verify the full loop:

```bash
ollama pull qwen3.5:9b
ollama run qwen3.5:9b
```

When you see the prompt, try:

> "Say hello and confirm you are running locally."

If you get a response, Ollama is serving requests.

If you have more VRAM, pull a coding model too:

```bash
ollama pull qwen2.5-coder:14b
```

## Step 5: Confirm GPU offload

Open a second terminal and watch the GPU:

```bash
watch -n 1 nvidia-smi
```

In the first terminal, run:

```bash
ollama run qwen3.5:9b "Explain CUDA in one paragraph."
```

If GPU memory usage climbs and the `ollama` process appears in `nvidia-smi`, offload is working. If CPU usage spikes instead, GPU is not being used.

## Step 6: Expose to LAN (optional)

By default Ollama listens only on `127.0.0.1:11434`. That is correct for local-only agents. To expose it to your local network:

```bash
sudo systemctl edit ollama.service
```

Add:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Do not expose Ollama to the public internet without authentication.

## Sanity check commands

| Check | Command |
|-------|---------|
| Service status | `sudo systemctl status ollama` |
| GPU visible | `nvidia-smi` |
| Models available | `ollama list` |
| Run a single prompt | `ollama run <model> "prompt"` |
| API test | `curl http://localhost:11434/api/tags` |
| Active models | `ollama ps` |

## Common gotchas

| Error | Fix |
|-------|-----|
| "could not select device driver" | Reinstall NVIDIA driver. Check `nvidia-smi` output. |
| Ollama falls back to CPU | Install `nvidia-cuda-toolkit`. Verify GPU shows in `nvidia-smi`. |
| Port already in use | Stop the other service on 11434 or change `OLLAMA_HOST`. |
| Model download slow | Ollama model blobs are large. Use a wired connection or off-peak hours. |
| Out of memory | Pull a smaller model (`llama3.2:3b`, `qwen3.5:9b`) or reduce context size. |

## Next step

Once Ollama is running, add an agent. See the [Cline + local model recipe](/deployment-recipes/cline-local), the [OpenClaw first-agent guide](/deployment-recipes/openclaw-first-agent), or [Deploy Open WebUI](/deployment-recipes/open-webui) for a ChatGPT-style interface.
