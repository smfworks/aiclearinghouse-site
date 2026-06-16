---
slug: linux
title: "Linux Self-Hosting"
excerpt: "The definitive OS for local AI. Ubuntu setup, drivers, containers, and the inference engines that power agent workloads."
category: "Operating System"
tags:
  - Linux
  - Ubuntu
  - ROCm
  - CUDA
  - Docker
  - self-hosting
order: 3
last_verified: "2026-06-16"
---

# Linux Self-Hosting

## Why Linux is the default for local AI

If you are serious about self-hosting AI agents, you will almost certainly run Linux. It has the best driver support, the widest selection of inference engines, the lowest overhead, and the easiest path to headless server deployment. Windows and macOS are fine for experimentation, but production local AI runs on Linux.

This guide covers the full Linux self-hosting setup for NVIDIA, AMD, and CPU-only agent stacks.

---

## Recommended distributions

| Distribution | Best for | Notes |
|--------------|----------|-------|
| **Ubuntu 24.04 LTS** | Most users | Best NVIDIA and AMD support; largest community |
| **Debian 12** | Stable servers | Conservative updates, good for long-running inference |
| **Fedora 40** | Newer hardware | Newer kernels help with latest GPUs |
| **Arch Linux** | Experienced users | Rolling latest; high maintenance but current |
| **Rocky Linux / AlmaLinux** | Enterprise | RHEL-compatible, good for regulated environments |

For almost everyone, start with **Ubuntu 24.04 LTS**.

---

## Base system setup

### 1. Update the system

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential git curl wget vim htop tmux
```

### 2. Install Docker

```bash
# Add Docker's official GPG key and repo
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

### 3. Enable GPU containers (NVIDIA)

```bash
# NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### 4. Install ROCm (AMD)

See the [AMD ROCm install guide](https://rocm.docs.amd.com/projects/install-on-linux/en/latest/). A typical Ubuntu path:

```bash
sudo apt install amdgpu-dkms rocm
sudo usermod -aG render,video $USER
# Reboot, then verify
rocminfo | head -20
```

---

## Inference engine installation

### Ollama

The simplest way to run local models:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run qwen3.5:9b
```

For GPU support, Ollama uses the installed NVIDIA or ROCm drivers automatically in most cases.

### vLLM

For high-throughput serving:

```bash
# NVIDIA
pip install vllm

# AMD (check ROCm version compatibility)
pip install vllm --extra-index-url https://download.pytorch.org/whl/rocm6.1
```

### llama.cpp

For GGUF models and CPU/GPU inference:

```bash
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
make -j $(nproc)

# For NVIDIA GPU support:
# cmake -B build -DGGML_CUDA=ON && cmake --build build --config Release -j

# For AMD GPU support:
# cmake -B build -DGGML_HIP=ON && cmake --build build --config Release -j
```

---

## Agent framework setup

Most agent frameworks install cleanly on Linux:

```bash
# Python-based stacks
pip install openclaw langchain langchain-community llama-index

# Node-based stacks
npm install -g @openclaw/cli

# Verify GPU access
python3 -c "import torch; print(torch.cuda.is_available())"  # NVIDIA
python3 -c "import torch; print(torch.cuda.is_available())"  # AMD with ROCm PyTorch
```

---

## Running as a persistent service

Use `systemd` to keep your inference endpoint running:

```ini
# /etc/systemd/system/ollama.service
[Unit]
Description=Ollama local inference
After=network.target

[Service]
ExecStart=/usr/local/bin/ollama serve
Restart=always
User=ai
Environment="HOME=/home/ai"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ollama
```

---

## Security basics

- Run inference services as a dedicated user, not root.
- Bind local-only APIs unless you intentionally expose them.
- Use a reverse proxy (Caddy or nginx) with TLS for external access.
- Keep drivers and inference engines updated.
- Limit container privileges and network egress.

---

## Troubleshooting checklist

| Symptom | Likely cause |
|---------|--------------|
| GPU not detected | Driver not installed or wrong driver version |
| Docker GPU fails | NVIDIA Container Toolkit or ROCm runtime missing |
| Ollama uses CPU | GPU driver / runtime not loaded in service context |
| Low tokens/s | Model too large for VRAM, causing CPU offload |
| Build failures | Missing `build-essential`, headers, or wrong CUDA/ROCm version |

---

## Why Linux beats other OSes for agents

- **Driver quality.** NVIDIA and AMD release production drivers for Linux first.
- **Container integration.** Docker + GPU is the standard deployment pattern.
- **Headless operation.** No GUI overhead on a server.
- **Package availability.** Most AI tools package for Linux first.
- **Remote management.** SSH, systemd, and standard tooling make long-term operation easier.

---

## Quick-start command summary

```bash
# Ubuntu 24.04 + NVIDIA
sudo apt update && sudo apt upgrade -y
curl -fsSL https://ollama.com/install.sh | sh
sudo apt install -y nvidia-driver-550 nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
ollama run qwen3.5:9b
```

**Related:**
- [NVIDIA-Based Self-Hosting](/self-hosting/nvidia-based)
- [AMD-Based Self-Hosting](/self-hosting/amd-based)
- [Deployment Recipes](/deployment-recipes)
