---
{
  "slug": "macos",
  "title": "macOS Self-Hosting",
  "excerpt": "Apple Silicon native inference with MLX, llama.cpp Metal backends, and local agent tools.",
  "category": "Operating System",
  "tags": ["macOS", "Apple Silicon", "MLX", "Metal", "self-hosting"]
}
---

## Recommended approach

- Install Xcode Command Line Tools
- Use Homebrew to install Python, Ollama, and MLX tools
- Prefer MLX or llama.cpp with Metal for best Apple Silicon utilization

## Minimal configuration

- Device: Mac mini M2 16 GB
- OS: macOS Sonoma
- Use case: 3B–7B models, local experimentation

## Recommended configuration

- Device: Mac Studio M2 Max 64 GB
- OS: macOS Sonoma or later
- Use case: 7B–13B models, MLX LoRA fine-tuning

## Premium configuration

- Device: Mac Studio M2 Ultra 192 GB
- OS: macOS Sonoma or later
- Use case: 30B–70B MLX models, production local serving

## Notes

macOS is not suitable for NVIDIA GPUs. Choose macOS when unified memory and MLX-optimized workflows matter most.
