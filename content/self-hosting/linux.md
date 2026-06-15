---
{
  "slug": "linux",
  "title": "Linux Self-Hosting",
  "excerpt": "The default OS for local LLMs: Ubuntu, Debian, Fedora, and Arch options with CUDA and ROCm support.",
  "category": "Operating System",
  "tags": ["Linux", "Ubuntu", "ROCm", "CUDA", "self-hosting"]
}
---

## Recommended distributions

- **Ubuntu 24.04 LTS** — easiest NVIDIA CUDA and container support
- **Debian 12** — stable base for server inference
- **Fedora 40** — good upstream kernel for newer AMD/Intel GPUs
- **Arch Linux** — rolling latest for experienced users

## Key setup steps

1. Install NVIDIA drivers and CUDA toolkit or AMD ROCm stack
2. Install Docker and the NVIDIA Container Toolkit if using GPU containers
3. Use Ollama, llama.cpp, vLLM, or TGI for serving
4. Configure systemd services for persistent local endpoints

## Why Linux?

Best driver support, lowest overhead, widest range of inference engines, and straightforward headless server deployment.
