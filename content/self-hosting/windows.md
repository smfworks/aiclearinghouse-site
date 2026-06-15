---
{
  "slug": "windows",
  "title": "Windows Self-Hosting",
  "excerpt": "Run local LLMs on Windows with WSL2, native CUDA, and tools like LM Studio and Ollama.",
  "category": "Operating System",
  "tags": ["Windows", "WSL2", "CUDA", "Ollama", "self-hosting"]
}
---

## Recommended approach

- **WSL2 with Ubuntu** for the cleanest Python/PyTorch/CUDA experience
- **Native Windows** for GUI tools like LM Studio, KoboldCPP, or local Stable Diffusion suites

## Minimal configuration

- GPU: NVIDIA RTX 3060 12 GB
- RAM: 32 GB
- Storage: 512 GB NVMe SSD
- OS: Windows 11 23H2 with WSL2 Ubuntu 24.04

## Recommended configuration

- GPU: NVIDIA RTX 4090 24 GB
- RAM: 64 GB
- Storage: 2 TB NVMe SSD
- OS: Windows 11 23H2
- Stack: WSL2 + Ollama or LM Studio

## Notes

AMD ROCm on Windows is limited; NVIDIA is currently the most reliable path. Some Apple Silicon users prefer macOS for native MLX performance.
