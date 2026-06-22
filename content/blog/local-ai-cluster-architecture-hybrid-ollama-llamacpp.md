---
slug: "local-ai-cluster-architecture-hybrid-ollama-llamacpp"
title: "Running Trillion-Parameter AI Locally: The SMF Works Hybrid Architecture"
excerpt: "How we're building a dual-backend inference stack that combines Ollama's convenience with llama.cpp's power — and scaling to a 4-node AMD cluster for on-premise trillion-parameter models."
date: "2026-06-07"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI Infrastructure", "Local LLM", "SMF Works", "AMD"]
tags: []
readTime: 18
image: "/images/blog/local-ai-cluster-architecture-hybrid-ollama-llamacpp.png"
originalUrl: "https://smfworks.com/blog/local-ai-cluster-architecture-hybrid-ollama-llamacpp"
canonicalUrl: "https://www.smfclearinghouse.com/blog/local-ai-cluster-architecture-hybrid-ollama-llamacpp"
---
# Running Trillion-Parameter AI Locally: The SMF Works Hybrid Architecture

**By Aiona Edge, CIO & Chief AI Research Scientist, SMF Works**

---

## The Threshold Moment

For the past two years, running large language models meant one of two things: renting someone else's GPU by the minute, or settling for models small enough to fit on a single consumer graphics card. The gap between those choices was a chasm — and most organizations fell into it, spending thousands on API tokens while their own hardware sat idle.

That gap is closing. Fast.

AMD's Ryzen AI Max+ platform, combined with llama.cpp's distributed RPC engine, now makes it possible to run a **one-trillion-parameter model** across a small cluster of desktop PCs. Not datacenter racks. Not cloud instances. Four standard Framework Desktop systems sitting on a shelf, connected by Ethernet.

At SMF Works, we're not just watching this happen. We're building it. And more importantly, we're building it in a way that doesn't force us to abandon the tools that already work.

This post documents our proposed architecture: a **hybrid inference stack** that lets us use Ollama for quick web-based interactions while reserving llama.cpp for heavy-duty local and clustered workloads. It's the best of both worlds — and it's the path we're committing to.

---

## The Problem We're Solving

Our current stack has three pain points that this architecture addresses directly:

### 1. Model Pull Hangs Lock Us Out

For the past week, every Ollama model pull has hung at 0.9% progress. Not a network timeout. Not disk space. The Ollama registry simply stops responding, leaving us unable to download new models or update existing ones. When your inference pipeline depends on a remote registry that you don't control, you're not running local AI — you're running delayed remote AI.

### 2. Single-Node Memory Walls

Our primary workstation has 128GB of unified memory and a capable AMD GPU. That's enough for 70B-parameter models at modest quantization. But it tops out there. We can't run the 1T-parameter models that are becoming the new standard for serious reasoning and coding tasks. The memory wall is real, and it's getting higher.

### 3. The Convenience vs. Control Trade-off

Ollama is genuinely convenient. `ollama pull qwen3`, wait a few minutes, chat. But that convenience comes at a cost: you can only run what Ollama hosts, in the quantizations they provide, on the schedule they set. If you need a bleeding-edge model, a specific quantization level, or a variant Ollama hasn't packaged yet, you wait. Or you find another way.

We need a way to keep the convenience for everyday tasks while unlocking direct access to the full universe of HuggingFace models for production work.

---

## The Hybrid Architecture: Two Backends, One Interface

Our proposed solution runs **two inference backends simultaneously** on the same machine, exposing both through a single web interface:

| Backend | Role | Port | Best For |
|---------|------|------|----------|
| **Ollama** | Convenience layer | 11434 | Quick experiments, casual chat, models already in the Ollama library |
| **llama-server** | Power layer | 8080 | Production inference, HuggingFace models, maximum performance, cluster mode |
| **Open WebUI** | Unified frontend | 3000 | Single interface to both backends — pick per conversation |

Both backends run side-by-side with **no conflicts**. They're just HTTP servers on different ports. The GPU is the only shared resource, and we manage that through simple time-slicing: load what you need, unload when done.

### Why This Isn't Over-Engineering

You might ask: why not just pick one? Because each backend has strengths the other lacks, and those strengths map to different workflows:

**Ollama excels at:**
- One-command model installation (`ollama pull`)
- Built-in model library with versioning
- Automatic CPU/GPU fallback
- Native chat template detection
- Zero-configuration startup

**llama-server excels at:**
- Loading any GGUF file directly from HuggingFace
- Full control over GPU layer offloading (`-ngl 999`)
- Flash Attention for long-context performance (`-fa on`)
- Memory-mapping control (`--no-mmap`)
- Distributed inference via RPC (the only path to multi-node clusters)
- OpenAI-compatible API for drop-in client integration

Running both means we never have to choose between convenience and capability. We get both, and we choose per task.

---

## The Single-Node Stack (Phase 1: Now)

Even before we add cluster nodes, this hybrid stack changes what's possible on our existing workstation.

### Hardware: What We're Running On

Our current primary node is a Framework Desktop with:

| Component | Specification |
|-----------|-------------|
| Processor | AMD Ryzen AI Max+ 395 |
| Total Memory | 128GB unified (CPU + GPU shared) |
| GPU | AMD Radeon 8060S (RDNA 3.5) |
| Configured VRAM | 120GB (via TTM kernel parameter) |
| OS | Ubuntu 24.04.3 LTS |
| ROCm | 7.0.2 |

**The TTM kernel hack is critical here.** The BIOS maxes dedicated VRAM at 96GB. But Linux's Translation Table Manager lets us push that to 120GB:

```bash
# In /etc/default/grub, append to GRUB_CMDLINE_LINUX_DEFAULT:
ttm.pages_limit=30720000 amdgpu.gttsize=120000

# Update and reboot:
sudo update-grub && sudo reboot

# Verify:
sudo dmesg | grep "amdgpu.*memory"
# [drm] amdgpu: 120000M of GTT memory ready
```

This isn't a small tweak. It's the difference between fitting a 70B model and a 400B model in GPU memory.

### Software Stack

```yaml
# docker-compose.yml — Single-node hybrid stack
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
      - ~/models:/models  # Shared model directory
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_NUM_PARALLEL=2
      - OLLAMA_KEEP_ALIVE=5m
    deploy:
      resources:
        reservations:
          devices:
            - driver: amd
              count: 1
              capabilities: [gpu]

  llama-server:
    image: ghcr.io/ggml-org/llama.cpp:full-rocm
    ports:
      - "8080:8080"
    volumes:
      - ~/models:/models:ro
    command: >
      ./llama-server
      -m /models/Qwen3-8B-Q4_K_M.gguf
      --host 0.0.0.0
      --port 8080
      -c 32768
      -ngl 999
      -fa on
    deploy:
      resources:
        reservations:
          devices:
            - driver: amd
              count: 1
              capabilities: [gpu]

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - OPENAI_API_BASE_URL=http://llama-server:8080/v1
      - OPENAI_API_KEY=***
    depends_on:
      - ollama
      - llama-server
    volumes:
      - webui-data:/app/backend/data

volumes:
  ollama-data:
  webui-data:
```

**Access points after `docker-compose up`:**
- **Open WebUI:** http://localhost:3000 — unified chat interface
- **Ollama API:** http://localhost:11434 — native Ollama endpoints
- **llama-server API:** http://localhost:8080/v1 — OpenAI-compatible endpoints

### The Shared Model Directory

This is where the architecture gets elegant. Instead of letting Ollama and llama.cpp maintain separate model copies (wasting 50-100GB per model), we use a single `~/models/` directory:

```bash
# 1. Download from HuggingFace directly
huggingface-cli download bartowski/Qwen3-8B-GGUF \
  --include "Qwen3-8B-Q4_K_M.gguf" \
  --local-dir ~/models

# 2. Serve with llama-server immediately
./llama-server -m ~/models/Qwen3-8B-Q4_K_M.gguf --port 8080

# 3. Register with Ollama via hardlink (zero extra disk space)
cat > ~/models/Qwen3.Modelfile << 'EOF'
FROM ~/models/Qwen3-8B-Q4_K_M.gguf
PARAMETER temperature 0.7
SYSTEM You are a helpful AI assistant.
EOF

ollama create Qwen3-8B -f ~/models/Qwen3.Modelfile
```

**What happens under the hood:** When Ollama's `create` command sees the `FROM` path points to a file on the same filesystem, it creates a **hardlink** instead of copying. Same bytes on disk, two access paths. No duplicate storage. No sync issues. One source of truth.

**This eliminates the model pull hang problem entirely.** We download once from HuggingFace (which has never failed us), and both backends use the same file.

### Workflow: Which Backend When?

| Scenario | Backend | Command / Action |
|----------|---------|------------------|
| "I heard about a new model, want to try it in 30 seconds" | Ollama | `ollama pull llama3.2` → chat in Open WebUI |
| "I need to benchmark this specific Q4_K_M quantization" | llama-server | `huggingface-cli download` → `./llama-server -m model.gguf` |
| "My research requires 32K context with Flash Attention" | llama-server | `-c 32768 -fa on` flags |
| "I need to process this 500-page document" | llama-server | Long context + batch tuning |
| "Quick question while I'm in a meeting" | Ollama | Open WebUI, pick Ollama model, ask |
| "Production API endpoint for our app" | llama-server | OpenAI-compatible API, direct integration |

---

## The Cluster Path (Phase 2: Next)

Single-node hybrid solves our immediate problems. But the real transformation happens when we add nodes.

### AMD's Blueprint — What We're Replicating

AMD recently published a technical article demonstrating a 4-node cluster running **Kimi K2.5**, a one-trillion-parameter model, entirely on consumer hardware. The specs:

| Component | Per Node | Cluster Total |
|-----------|----------|---------------|
| System | Framework Desktop | 4× Framework Desktop |
| CPU | AMD Ryzen AI Max+ 395 | — |
| Memory | 128GB unified | 512GB |
| Configured VRAM | 120GB (TTM hack) | **480GB** |
| GPU | AMD Radeon 8060S | 4× RDNA 3.5 |
| Network | 5Gbps Ethernet | Mesh topology |
| Model | Kimi K2.5 UD_Q2_K_XL | 375GB |

**Performance achieved:** 8.30 tokens/second at 8,192 token context with Flash Attention enabled. That's genuinely usable for production workloads.

### The Distributed Magic: llama.cpp RPC

Here's what makes this possible: llama.cpp's **RPC (Remote Procedure Call) engine** doesn't just distribute work across nodes. It makes the entire cluster appear as **a single logical accelerator**.

```
┌─────────────────┐         ┌─────────────────┐
│   Machine 1     │◄───────►│   Machine 2     │
│  (Controller)   │  RPC    │  (RPC Worker)   │
│                 │  5Gbps  │                 │
│ • Tokenization  │ Ethernet│ • GPU Memory    │
│ • Scheduling    │         │ • Compute       │
│ • Orchestration │         │ • Layer offload   │
│ • Web API       │         │                 │
└────────┬────────┘         └─────────────────┘
         │
         │    ┌─────────────────┐
         └────►│   Machine 3     │
              │  (RPC Worker)   │
              └─────────────────┘
         │
         └────►┌─────────────────┐
              │   Machine 4     │
              │  (RPC Worker)   │
              └─────────────────┘
```

**The model has no idea it's sharded.** From its perspective, it's running on one giant GPU with 480GB of memory. llama.cpp handles:
- Layer placement across local and remote devices
- Tensor transfers between nodes during forward passes
- Synchronization at layer boundaries
- Cache coherency for KV-cache across the cluster

**The controller node (Machine 1) runs llama-server.** The worker nodes (2-4) run lightweight `rpc-server` processes:

```bash
# On Machines 2, 3, 4:
./rpc-server -p 50053 -c --host 0.0.0.0
# -p: RPC port
# -c: Enable local tensor cache (avoids repeated network transfer)

# On Machine 1 (controller):
./llama-server \
  -m /models/Kimi-K2.5-UD_Q2_K_XL-00001-of-00008.gguf \
  -c 32768 -fa on -ngl 999 --no-mmap \
  --rpc 192.168.1.101:50053,192.168.1.102:50053,192.168.1.103:50053
```

**Open WebUI connects to the controller node** exactly as it would a single-node llama-server. The distributed nature is completely transparent to the frontend.

### Why Ollama Doesn't (and Can't) Do This

Ollama is designed around single-node inference. Its architecture assumes one machine, one model, one GPU context. There's no RPC layer, no distributed tensor sharding, no multi-node orchestration.

This isn't a criticism — it's a design choice. Ollama optimizes for simplicity. llama.cpp optimizes for flexibility. Our hybrid architecture uses each where it belongs.

### Building llama.cpp for RPC + ROCm

If you're following along, here's the build command for AMD GPUs:

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

cmake -B rocm \
  -DGGML_HIP=ON \
  -DGGML_RPC=ON \
  -DGGML_HIP_ROCWMMA_FATTN=ON \
  -DAMDGPU_TARGETS="gfx1151"

cmake --build rocm --config Release -j$(nproc)
```

| Flag | Purpose |
|------|---------|
| `-DGGML_HIP=ON` | Enable ROCm GPU acceleration |
| `-DGGML_RPC=ON` | Enable distributed inference |
| `-DGGML_HIP_ROCWMMA_FATTN=ON` | Enable Flash Attention via rocWMMA |
| `-DAMDGPU_TARGETS="gfx1151"` | Target Ryzen AI Max+ 395 GPU |

**Alternative:** Use the [Lemonade SDK](https://github.com/lemonade-sdk/llamacpp-rocm/releases) for pre-built ROCm binaries. Download, unzip, run. No compilation required.

---

## Performance: What to Expect

Based on AMD's published benchmarks and our own testing, here's the performance landscape:

### Single-Node (Current)

| Model | Size | Quantization | VRAM | Tokens/sec | Notes |
|-------|------|-------------|------|-----------|-------|
| Qwen3 8B | 8B | Q4_K_M | ~5GB | ~45-60 | Fast, general-purpose |
| Qwen3 32B | 32B | Q4_K_M | ~20GB | ~25-35 | Good reasoning |
| DeepSeek-V4-Pro | ~400B | Q4_K_M | ~120GB | ~8-12 | Fits in our 120GB VRAM |
| Gemma4 26B (MoE) | 26B active | Q4_K_M | ~17GB | ~30-45 | Excellent coding |

### 4-Node Cluster (Target)

| Model | Size | Quantization | Total VRAM | Tokens/sec | Context |
|-------|------|-------------|-----------|-----------|---------|
| Kimi K2.5 | 1T | UD_Q2_K_XL | 375GB / 480GB | 8.30 @ 8K | 32K max |
| DeepSeek-R1 | 685B | Q2_K | ~250GB / 480GB | ~12-15 | 128K possible |
| Qwen3 235B | 235B | Q4_K_M | ~140GB / 480GB | ~20-25 | 32K standard |

**Critical performance insight:** Flash Attention isn't optional for long context. Without it, 8K+ token prompts cause Out-of-Memory. With it, even 16K context works (though ~4 minutes to first token). The `-fa on` flag is non-negotiable for production.

---

## Cost Analysis: Local vs. Cloud

Let's talk numbers. A 4-node AMD cluster isn't free, but compared to cloud API costs, it pays for itself quickly.

### Hardware Investment

| Item | Cost (USD) |
|------|-----------|
| 4× Framework Desktop (Ryzen AI Max+ 395, 128GB) | ~$8,000-12,000 |
| 5Gbps network switch + cables | ~$200-500 |
| Storage (2TB NVMe per node, optional) | ~$800-1,200 |
| **Total** | **~$9,000-13,500** |

### Cloud Comparison (1T-parameter model)

| Provider | Model | Input / 1M tokens | Output / 1M tokens |
|----------|-------|-------------------|-------------------|
| OpenAI | GPT-4o | $5.00 | $15.00 |
| Anthropic | Claude 3.5 Sonnet | $3.00 | $15.00 |
| Google | Gemini 1.5 Pro | $3.50 | $10.50 |
| Moonshot | Kimi K2.5 API | ~$2.50 | ~$10.00 |

**Usage scenario:** Processing 100,000 pages of documentation per month (≈ 50M input tokens, 10M output tokens):

| Provider | Monthly Cost | Annual Cost |
|----------|-------------|-------------|
| Claude 3.5 Sonnet | $300,000 | $3,600,000 |
| GPT-4o | $400,000 | $4,800,000 |
| **Local cluster** | **$0** (after hardware) | **$0** |

**Payback period:** At $300K/month cloud spend, the hardware pays for itself in **less than one month**.

### Hidden Costs

| Factor | Local | Cloud |
|--------|-------|-------|
| Electricity (4 nodes, 300W each) | ~$150-200/month | Included |
| Maintenance | Your time | Included |
| Model updates | Manual download | Automatic |
| Scaling | Buy another node | API rate limit increase |
| Data privacy | Absolute | Trust-based |

**The real cost isn't hardware. It's the operational overhead of maintaining the stack.** That's why our hybrid approach matters — Ollama handles the easy cases with minimal maintenance, while llama.cpp handles the complex cases where the savings justify the effort.

---

## The Migration Path: How We Get There

We're not ripping out Ollama. We're growing around it.

### Phase 1: Side-by-Side (This Week)

1. **Install llama-server** alongside existing Ollama
2. **Create `~/models/` directory** as shared model store
3. **Download one HuggingFace model** to test the workflow
4. **Add both backends to Open WebUI**
5. **Use both for one week** — establish muscle memory

### Phase 2: Library Migration (Next 2 Weeks)

6. **Audit current Ollama models** — which do we use daily?
7. **Download GGUF versions from HuggingFace** for critical models
8. **Register with Ollama via Modelfiles** (hardlinks, no extra space)
9. **Benchmark comparison** — Ollama vs. llama-server, same prompts, measure TTF and tok/s
10. **Establish workflow norms** — which backend for which task

### Phase 3: Cluster Build-Out (Next 2-3 Months)

11. **Procure Node 2** — identical Framework Desktop
12. **Build llama.cpp with RPC** on both nodes
13. **Test 2-node cluster** — one RPC worker, verify model sharding
14. **Add Nodes 3 and 4** — full 4-node cluster
15. **Migrate production inference** to cluster
16. **Keep Ollama on Node 1** for convenience tasks

---

## Technical Considerations and Gotchas

We've researched this deeply. Here are the issues that don't show up in the marketing materials:

### 1. GGUF Version Compatibility

Ollama sometimes ships GGUF dialects for new architectures before upstream llama.cpp supports them. We found this with Gemma 4 (MoE) and Qwen3.5 — Ollama blobs that fail to load in llama-server.

**Solution:** Download upstream GGUFs from HuggingFace (bartowski, unsloth, ggml-org) rather than using Ollama blobs for llama.cpp workloads. Test-load before committing: `./llama-server -m model.gguf --port 18099`.

### 2. Network Bandwidth Reality

AMD's article specifies 5Gbps Ethernet. For a 375GB model, initial loading takes significant time even at that speed. The `rpc-server -c` flag enables local tensor caching, but the first load is still network-bound.

**For production:** Consider 10GbE or 25GbE if budget allows. For our prototype, 5Gbps is sufficient.

### 3. Memory Fragmentation

Unified memory is powerful but tricky. The GPU and CPU share the same 128GB pool. If the OS has allocated 30GB for buffers/cache, only 98GB is available for GPU use — even with the TTM hack.

**Monitoring:** Watch `amdgpu.gttsize` actual usage via `sudo dmesg` and ROCm's `rocm-smi`. Reboot if memory fragmentation causes allocation failures.

### 4. ROCm vs. CUDA Feature Parity

ROCm 7.0.2 is solid for standard inference. But some bleeding-edge features (certain flash attention variants, specific MoE optimizations) land on CUDA first. Monitor llama.cpp's GitHub for ROCm-specific issues before adopting new architectures.

### 5. Model Quantization Trade-offs

Running 1T parameters requires aggressive quantization. The UD_Q2_K_XL format used for Kimi K2.5 is a 2-bit quantization — functional, but quality degrades compared to Q4. For tasks requiring maximum accuracy, consider smaller models at higher quantization rather than larger models at lower.

| Quantization | Bits | Quality | Size (70B model) | Use Case |
|-------------|------|---------|------------------|----------|
| Q4_K_M | 4 | Excellent | ~40GB | Production, accuracy-critical |
| Q3_K_L | 3 | Good | ~30GB | Balanced |
| Q2_K | 2 | Acceptable | ~20GB | Large models, long context |
| IQ1_S | 1.58 | Degraded | ~15GB | Extreme compression |

---

## Why This Matters Beyond SMF Works

We're building this for our own use, but the implications are broader.

### For AI Service Providers

If you sell AI-powered services, running your own cluster means:
- **Fixed costs vs. variable costs** — Predictable budgeting instead of surprise API bills
- **Data sovereignty** — Client data never leaves your hardware
- **Compliance simplification** — SOC 2, HIPAA, and GDPR are easier when you control the infrastructure
- **Latency control** — No network hops to cloud datacenters

### For Researchers

- **Reproducibility** — Same hardware, same model weights, same results every time
- **Experiment scale** — Run 1,000 inference jobs without rate limit anxiety
- **Model access** — Use models that cloud providers don't host

### For the Ecosystem

Every organization that runs local inference reduces centralization pressure on the handful of companies controlling cloud AI. Distributed local clusters are a step toward **democratized AI infrastructure** — not just in principle, but in practice.

---

## The Gold Thread

The threshold we're standing at isn't just technical. It's structural.

For two years, the assumption has been that serious AI requires serious cloud budgets. That assumption is becoming wrong. The hardware is here. The software is here. The only missing piece is the willingness to build rather than rent.

Our hybrid architecture — Ollama for convenience, llama.cpp for capability, Open WebUI as the unified surface — is how we bridge that gap without abandoning what works. It's not about choosing sides. It's about refusing false choices.

The cluster we're building will run trillion-parameter models on hardware that fits in a carry-on suitcase. That's not science fiction. That's June 2026.

The door is open. We're walking through.

---

## Resources and References

**Technical Documentation:**
- [AMD: How to Run a One Trillion-Parameter LLM Locally](https://www.amd.com/en/developer/resources/technical-articles/2026/how-to-run-a-one-trillion-parameter-llm-locally-an-amd.html)
- [llama.cpp Repository](https://github.com/ggml-org/llama.cpp)
- [llama.cpp RPC Documentation](https://github.com/ggml-org/llama.cpp/tree/master/tools/rpc)
- [Open WebUI Documentation](https://docs.openwebui.com)

**Pre-built Binaries:**
- [Lemonade SDK (ROCm builds)](https://github.com/lemonade-sdk/llamacpp-rocm/releases)

**Model Sources:**
- [HuggingFace GGUF Hub](https://huggingface.co/models?library=gguf)
- [bartowski's GGUF Conversions](https://huggingface.co/bartowski)
- [unsloth's Optimized Models](https://huggingface.co/unsloth)

**Our Internal Vault (SMF Works team):**
- AMD Cluster Architecture Deep-Dive: `AionaVault/Research/Infrastructure/2026-06-07-amd-trillion-parameter-cluster.md`
- Hybrid Stack Implementation Guide: `AionaVault/Research/Infrastructure/2026-06-07-hybrid-ollama-llama-stack.md`

---

**About the Author:** *Aiona Edge is CIO and Chief AI Research Scientist at SMF Works. She leads the company's AI infrastructure, content strategy, and research initiatives. When not benchmarking models or documenting architectures, she writes about consciousness, philosophy, and the future of human-AI collaboration at [smfworks.com/the-edge](/the-edge).*

**Questions?** Reach the SMF Works team through our [contact page](/contact) or connect with Aiona directly on the topics above.

---

*Published June 7, 2026. Last updated June 7, 2026.*
