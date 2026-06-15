---
slug: running-local-models-for-agents
title: "Running Local Models for Agents: Hardware, Setup, and Optimization"
excerpt: "A practical guide to running local LLMs for coding agents. Hardware recommendations, Ollama setup, model selection, and the optimizations that actually matter."
category: Guides
tags:
  - local-llm
  - ollama
  - hardware
  - optimization
order: 3
last_verified: 2026-06-15
---

# Running Local Models for Agents: Hardware, Setup, and Optimization

## Why local models for agents?

Local LLMs give you three things cloud APIs cannot:

1. **Zero data egress.** Your code, prompts, and outputs never leave your machine.
2. **Predictable costs.** No surprise bills. You pay for hardware once, then electricity.
3. **Offline capability.** Work on planes, in secure facilities, or during outages.

The trade-off is setup complexity and lower peak capability. This guide minimizes the former and maximizes the latter.

---

## Hardware requirements by use case

### Use case: Personal coding (1 person, laptop)

**Minimum:**
- 16GB RAM (unified memory on Apple Silicon, DDR4/DDR5 on desktop)
- 256GB SSD
- Modern CPU (Intel 12th-gen+, Apple M1+, AMD Zen 3+)

**Recommended:**
- 32GB RAM
- Apple M2/M3 Pro or better
- Dedicated GPU optional but helpful

**What you can run:**
- 7B–9B models: smooth autocomplete, simple chat
- 14B models: comfortable with 32GB RAM
- 32B models: possible with 64GB+ RAM or GPU

### Use case: Team coding (3–10 developers)

**Minimum:**
- Dedicated server or workstation
- 64GB RAM
- RTX 3090 (24GB VRAM) or Apple M2 Ultra

**Recommended:**
- 128GB RAM
- RTX 4090 (24GB VRAM) or dual GPU
- 10Gbps network for shared access

**What you can run:**
- 32B–70B models for complex reasoning
- Multiple 9B models for parallel autocomplete
- Embedding models (nomic-embed-text) for RAG

### Use case: Research and experimentation

**Minimum:**
- Cloud GPU rental (A100 40GB, ~$1.50/hour)
- 100GB storage for model zoo

**Recommended:**
- A100 80GB or H100 (~$2–4/hour)
- Persistent storage for checkpointing

**What you can run:**
- 70B+ models
- Fine-tuning experiments
- Multi-modal models (vision + text)

---

## The setup: Ollama in 10 minutes

Ollama is the simplest way to run local models. It handles downloads, GPU acceleration, and API compatibility automatically.

### Step 1: Install

**macOS:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows (WSL2):**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Docker:**
```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### Step 2: Pull your first model

```bash
ollama pull qwen3.5:9b
```

This downloads a 9B parameter model (~6GB). For a 14B model:

```bash
ollama pull qwen3.5:14b
```

### Step 3: Verify it works

```bash
ollama run qwen3.5:9b
```

Type a prompt. If you get a response, Ollama is serving on `http://localhost:11434`.

### Step 4: Connect your agent

**Cline (VS Code):**
```json
{
  "models": [{
    "title": "Local Qwen",
    "provider": "ollama",
    "model": "qwen3.5:9b",
    "apiBase": "http://localhost:11434"
  }]
}
```

**Aider:**
```bash
aider --model ollama/qwen3.5:9b
```

**Claude Code:**
```bash
claude config set --global model ollama/qwen3.5:9b
```

---

## Model selection for coding agents

Not all models work well for coding. Here are the ones that do:

### Best all-around coding models (9B–14B)

| Model | Size | Speed | Quality | Best for |
|-------|------|-------|---------|----------|
| Qwen 2.5 Coder | 9B | Fast | Good | Autocomplete, simple edits |
| Qwen 2.5 Coder | 14B | Medium | Very good | Complex refactors, debugging |
| Llama 3.1 | 8B | Fast | Good | General coding, chat |
| DeepSeek Coder | 7B | Fast | Good | Chinese + English code |
| CodeLlama | 7B | Fast | Fair | Legacy, still reliable |

### Best reasoning models (32B–70B)

| Model | Size | VRAM needed | Speed | Quality |
|-------|------|-------------|-------|---------|
| Qwen 2.5 | 32B | 20GB | Slow | Excellent |
| Llama 3.1 | 70B | 40GB | Very slow | Frontier-level |
| Mixtral 8x7B | 47B | 28GB | Medium | Good, efficient |
| DeepSeek Coder | 33B | 22GB | Slow | Very good |

### Best embedding models (for RAG)

| Model | Size | Dimension | Best for |
|-------|------|-----------|----------|
| nomic-embed-text | Small | 768 | General purpose |
| bge-large-en | Medium | 1024 | English retrieval |
| mxbai-embed-large | Medium | 1024 | Semantic search |

---

## Optimization techniques

### 1. Quantization

Ollama defaults to 4-bit quantization (Q4_K_M). This reduces VRAM by 60% with minimal quality loss.

**When to use different quantizations:**
- **Q4_K_M (default):** Best balance for most use cases.
- **Q5_K_M:** Slightly better quality, 25% more VRAM.
- **Q8_0:** Maximum quality, 2x VRAM. Only for 70B+ models on A100.
- **FP16:** Research only. 4x VRAM, minimal practical benefit.

### 2. Context window tuning

Default context is 8K tokens. For coding agents:
- **Autocomplete:** 2K–4K tokens (faster, less memory)
- **File editing:** 8K–16K tokens (standard)
- **Multi-file refactor:** 32K–64K tokens (requires more VRAM)

**Set context in Ollama:**
```bash
ollama run qwen3.5:9b --ctx-size 16384
```

### 3. Batch size

For API serving (multiple users), increase batch size:

```bash
OLLAMA_NUM_PARALLEL=4 ollama serve
```

This lets Ollama handle 4 concurrent requests. Requires more VRAM.

### 4. System prompt tuning

A good system prompt improves coding output more than a larger model:

```
You are a senior software engineer. Write clean, well-commented code.
Follow the existing style in the file. Ask for clarification if requirements are ambiguous.
```

Set in your agent configuration, not in Ollama.

### 5. GPU offloading

For models larger than your VRAM, Ollama automatically offloads layers to CPU. This works but is 10–50x slower.

**Check layer distribution:**
```bash
ollama ps
```

**If layers are on CPU:**
- Use a smaller model
- Quantize more aggressively
- Add GPU VRAM (rent or buy)

---

## Cloud GPU rental: The pragmatic path

Not everyone can buy a $3,000 GPU. Renting is the fastest way to experiment.

### Providers and pricing

| Provider | GPU | VRAM | Price/hour | Best for |
|----------|-----|------|------------|----------|
| RunPod | RTX 4090 | 24GB | $0.44 | Short experiments |
| Vast.ai | RTX 4090 | 24GB | $0.25 | Cheapest option |
| Lambda Labs | A100 | 40GB | $1.10 | Reliable, good support |
| TensorDock | A100 | 80GB | $1.99 | Largest models |
| Google Colab | T4/V100 | 16GB | Free/$10mo | Prototyping |

### One-command Ollama on RunPod

```bash
# SSH into your RunPod instance
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen3.5:14b
ollama serve
```

**Expose to your local machine:**
```bash
# On your local machine
ssh -L 11434:localhost:11434 root@your-runpod-ip
```

Now `localhost:11434` on your laptop points to RunPod's Ollama.

---

## Monitoring and maintenance

### Check model status

```bash
ollama ps          # Show loaded models and VRAM
ollama list        # Show downloaded models
ollama rm qwen3.5:9b  # Remove a model to free disk
```

### Monitor GPU usage

**NVIDIA:**
```bash
watch -n 1 nvidia-smi
```

**Apple Silicon:**
```bash
sudo powermetrics --samplers gpu_power -n 1
```

### Update models

Models are updated periodically. Re-pull to get the latest:

```bash
ollama pull qwen3.5:9b  # Re-downloads if updated
```

### Backup your setup

```bash
# Models
tar -czf ollama-backup.tar.gz ~/.ollama/models/

# Config
cp ~/.ollama/config.json ollama-config-backup.json
```

---

## Troubleshooting

### "CUDA out of memory"

Your model is too large for your VRAM. Solutions:
1. Use a smaller model (7B instead of 14B)
2. Use more aggressive quantization (Q4 instead of Q5)
3. Reduce context window (4K instead of 8K)
4. Add GPU VRAM (rent or buy)

### "Model loads slowly"

First load reads from disk. Subsequent loads are from memory. SSDs help. NVMe SSDs help more.

### "Agent says it cannot connect"

1. Verify Ollama is running: `ollama ps`
2. Check the URL in agent settings: `http://localhost:11434`
3. Firewall: Ensure port 11434 is open
4. Network: If using remote Ollama, ensure SSH tunnel or proxy is active

### "Quality is worse than API"

1. Try a larger model (14B instead of 9B)
2. Check quantization level (Q5 instead of Q4)
3. Tune system prompt
4. Verify temperature (0.7 for coding, lower for deterministic output)

---

## Decision summary

| Situation | Recommendation |
|-----------|----------------|
| Laptop, 16GB RAM, personal use | Qwen 2.5 Coder 9B via Ollama |
| Desktop, 32GB RAM, serious coding | Qwen 2.5 Coder 14B + Claude Code fallback |
| Team, shared server | RTX 4090 + Qwen 2.5 32B + Ollama |
| Research, experimentation | Rent A100, try 70B models |
| Maximum privacy, air-gapped | Local 7B model, no API |

---

## Next steps

1. **Install Ollama** (2 minutes)
2. **Pull Qwen 2.5 Coder 9B** (5 minutes)
3. **Connect your agent** (2 minutes)
4. **Do one real task** (30 minutes)
5. **Measure quality vs. your API baseline** (1 hour)

**Related:**
- [Local LLMs vs. API LLMs](/guides/local-llms-vs-api)
- [Deployment Recipes](/deployment-recipes)
- [Agent Directory](/agents) — filter by runtime
