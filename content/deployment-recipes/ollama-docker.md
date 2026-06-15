---
{
  "slug": "ollama-docker",
  "title": "Deploy Ollama with Docker",
  "excerpt": "Run Ollama in a GPU-enabled container with persistent model storage and REST access.",
  "category": "Deployment",
  "tags": ["Ollama", "Docker", "self-hosting", "local LLM", "GPU"]
}
---

# Deploy Ollama with Docker

```bash
# 1. Create a model cache directory
mkdir -p ~/.ollama

# 2. Run the container with GPU support
docker run -d \
  --name ollama \
  --gpus all \
  -p 11434:11434 \
  -v ~/.ollama:/root/.ollama \
  ollama/ollama

# 3. Pull a model
export OLLAMA_HOST=http://localhost:11434
ollama pull llama3.1:8b

# 4. Test
ollama run llama3.1:8b
```

For CPU-only hosts, drop `--gpus all`. Add restart policy and health checks for production.
