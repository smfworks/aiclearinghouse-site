---
{
  "slug": "local-llm-mini-pc",
  "title": "Local LLM Shootout on a Mini PC",
  "excerpt": "We tested Llama 3.1, Qwen 2.5, and Mistral on a sub-$400 mini PC to find the best local coding assistant.",
  "category": "Hardware",
  "tags": ["local LLM", "mini PC", "Ollama", "Llama", "Qwen", "Mistral", "benchmarks"]
}
---

# Local LLM Shootout on a Mini PC

**Hardware:** Beelink SER5 Pro, Ryzen 7 5800H, 32 GB RAM, 1 TB NVMe (no dGPU)
**Software:** Ollama 0.5.x, Ubuntu 24.04
**Models tested:** Llama 3.1 8B, Qwen 2.5 7B Coder, Mistral 7B Instruct

## What we tested

- Code completion on a 300-line Python module
- Instruction following for a small React component
- Context recall over an 8K-token prompt

## Observations

- **Qwen 2.5 Coder** produced the cleanest code and best instruction adherence at 7B.
- **Llama 3.1** was fastest on this CPU but occasionally skipped type hints.
- **Mistral** handled longer contexts better, making it useful for repo-wide questions.

## Verdict

For cheap local coding on CPU-only hardware, Qwen 2.5 Coder 7B is the best balance of speed and quality. Pair it with Continue for a private Copilot-like experience.
