---
slug: nvidia-based
title: "NVIDIA-Based Self-Hosting"
excerpt: "The complete guide to CUDA-accelerated local AI — from DGX Spark and RTX workstations to A100/H100 datacenter clusters."
category: "Hardware"
tags:
  - NVIDIA
  - CUDA
  - RTX
  - DGX
  - TensorRT
  - self-hosting
  - GPU
order: 1
last_verified: "2026-06-16"
---

# NVIDIA-Based Self-Hosting

## Why NVIDIA is the default choice for local AI

NVIDIA owns the deepest, most mature software stack for AI. CUDA is not just a driver layer — it is a 20-year ecosystem of compilers, libraries, containers, and tooling that nearly every AI framework targets first. If you want the path of least resistance to fast, reliable local inference, NVIDIA is usually the answer.

This guide covers the full NVIDIA self-hosting spectrum: compact DGX units, desktop RTX workstations, and datacenter GPU clusters.

---

## The NVIDIA advantage

| Advantage | What it means for you |
|-----------|----------------------|
| **CUDA ecosystem** | Virtually every inference engine, trainer, and agent framework supports CUDA first. |
| **TensorRT optimization** | Compile models for maximum throughput and minimum latency on NVIDIA hardware. |
| **vLLM + Triton** | Production-grade serving stacks built with NVIDIA in mind. |
| **Container support** | NVIDIA Container Toolkit makes Docker GPU workloads trivial. |
| **Broad model coverage** | GGUF, EXL2, AWQ, FP16, BF16, INT8 — all work well. |
| **Enterprise tooling** | NVIDIA AI Enterprise, NeMo, Triton Management Service, Base Command Manager. |
| **DGX ecosystem** | Validated hardware + software bundles that just work. |

The main tradeoff is cost. NVIDIA hardware commands a premium. The premium usually pays for itself in time saved and ecosystem compatibility.

---

## Compact powerhouse: NVIDIA DGX Spark

The **NVIDIA DGX Spark** is a compact AI supercomputer designed for desks, labs, and edge locations. It is the ideal form factor for a serious local AI setup without building a rack.

### Key specs

- **GPU:** NVIDIA Blackwell architecture
- **Memory:** 128 GB unified memory
- **Storage:** 4 TB NVMe SSD
- **Networking:** Ready for clustering with additional DGX Spark units
- **Software:** DGX OS, CUDA, TensorRT, NVIDIA AI Enterprise support

### Why DGX Spark matters

- **One person can set it up.** No rack, no electricians, no datacenter visit.
- **Enough memory for large models.** 128 GB unified memory lets you run 70B+ parameter models without quantization.
- **Cluster-ready.** Add more DGX Spark units to scale horizontally as your workload grows.
- **Validated stack.** NVIDIA tests the hardware, drivers, containers, and frameworks together.

### Best for

- A local AI development workstation
- A private agent host for sensitive data
- A compact RAG server for a team
- The foundation of a scalable DGX cluster

### Cost perspective

DGX Spark is not cheap, but it replaces a multi-GPU workstation plus the integration time. For teams who value reliability and density, the total cost of ownership is often lower than a DIY build.

---

## Desktop: NVIDIA RTX workstations

For users who want to self-build or buy a tower workstation, RTX cards are the workhorse.

### Minimal configuration

- **GPU:** NVIDIA RTX 3060 12 GB
- **RAM:** 32 GB DDR4/DDR5
- **Storage:** 512 GB NVMe SSD
- **OS:** Ubuntu 24.04 LTS
- **Use case:** 7B parameter models, light local inference, learning and prototyping

### Recommended configuration

- **GPU:** NVIDIA RTX 4090 24 GB or dual RTX 3090 24 GB
- **RAM:** 64 GB DDR5
- **Storage:** 2 TB NVMe SSD
- **OS:** Ubuntu 24.04 LTS
- **Use case:** 13B–70B models, LoRA fine-tuning, local ComfyUI/Stable Diffusion, multi-agent serving

### Premium configuration

- **GPU:** NVIDIA RTX 6000 Ada 48 GB or dual RTX 4090
- **RAM:** 128 GB DDR5
- **Storage:** 4 TB NVMe SSD
- **OS:** Ubuntu 24.04 LTS
- **Use case:** 70B models, heavier fine-tuning, small team inference API

### RTX tips

- **VRAM is the bottleneck.** For unquantized models, you need roughly 2 GB per billion parameters in FP16.
- **Multi-GPU works but adds complexity.** vLLM and TensorRT-LLM support tensor parallelism, but single-GPU setups are simpler.
- **Cooling matters.** A 4090 under sustained load wants good case airflow.

---

## Datacenter: A100, H100, and H200

When local becomes a team or product, datacenter GPUs are the next step.

### NVIDIA A100 80 GB

- **Best for:** Production inference, fine-tuning, multi-tenant serving
- **Strengths:** Mature ecosystem, large memory, strong multi-GPU scaling
- **Tradeoff:** Older architecture; H100 is faster forTransformer workloads

### NVIDIA H100 80 GB

- **Best for:** Large model serving, high-throughput inference, training
- **Strengths:** Transformer Engine, faster memory bandwidth, better scaling
- **Tradeoff:** Expensive and power-hungry

### NVIDIA H200

- **Best for:** Largest models and longest context windows
- **Strengths:** 141 GB HBM3e memory, highest memory bandwidth in the lineup
- **Tradeoff:** Premium pricing and availability

### When datacenter GPUs make sense

- You serve multiple users or agents concurrently.
- You fine-tune models beyond LoRA scale.
- Latency and throughput directly affect revenue.
- You have the power, cooling, and budget for a server.

---

## Edge and embedded: Jetson

For agents that need to run on devices, **NVIDIA Jetson** modules bring CUDA to the edge.

- **Jetson Nano / Orin Nano:** small robots, sensors, basic inference
- **Jetson Orin NX / AGX Orin:** serious edge AI, multiple video streams, autonomous systems

Jetson is not the right choice for a chat agent or RAG server, but it is unbeatable for physical-world agents: robotics, drones, cameras, and industrial automation.

---

## Software stack for NVIDIA self-hosting

### Core drivers and runtime

1. **NVIDIA GPU driver** — install the latest production driver for your GPU.
2. **CUDA Toolkit** — required for compiling and running CUDA applications.
3. **cuDNN** — optimized deep learning primitives.
4. **NVIDIA Container Toolkit** — lets Docker and Podman use the GPU.

### Inference engines

| Engine | Best for | Notes |
|--------|----------|-------|
| **vLLM** | High-throughput serving | PagedAttention, continuous batching, OpenAI-compatible API |
| **TensorRT-LLM** | Maximum NVIDIA performance | Compile models for your exact GPU |
| **Ollama** | Easy local models | Great for developers and agents |
| **llama.cpp** | GGUF quantization | Runs almost anywhere, excellent per-token efficiency |
| **TGI (Hugging Face)** | Production serving | Good ecosystem integration |
| **NVIDIA Triton** | Multi-model inference server | Enterprise feature set |

### Agent frameworks

Most agent frameworks run well on NVIDIA hardware:

- OpenClaw
- LangChain / LlamaIndex
- Pydantic AI
- CrewAI and AutoGen
- Hermes Agent (when GPU-backed)

---

## Performance expectations

These are rough guidelines for tokens per second on common NVIDIA hardware. Actual numbers depend on quantization, context length, batch size, and model architecture.

| Hardware | 7B Q4 | 13B Q4 | 70B Q4 | 70B FP16 |
|----------|-------|--------|--------|----------|
| RTX 3060 12 GB | ~40 t/s | ~25 t/s | swaps | no |
| RTX 4090 24 GB | ~120 t/s | ~75 t/s | ~25 t/s | no |
| RTX 6000 Ada 48 GB | ~140 t/s | ~90 t/s | ~35 t/s | ~12 t/s |
| DGX Spark 128 GB | ~100 t/s | ~70 t/s | ~30 t/s | ~15 t/s |
| A100 80 GB | ~150 t/s | ~100 t/s | ~50 t/s | ~25 t/s |
| H100 80 GB | ~220 t/s | ~150 t/s | ~75 t/s | ~35 t/s |

Use these as orientation, not guarantees. Your model, quantization, and prompt will change the numbers.

---

## Cost framework

| Tier | Hardware | Approximate cost | Best for |
|------|----------|-------------------|----------|
| Entry | RTX 3060 / 4060 Ti build | $800–$1,500 | Learning, light inference |
| Mid | RTX 4070 Ti / 4080 build | $2,000–$3,500 | Personal agent, small RAG |
| High | RTX 4090 / dual 3090 build | $4,000–$6,000 | Power user, small team |
| Pro | DGX Spark | $Call for pricing | Serious local AI, cluster seed |
| Enterprise | A100 / H100 server | $15,000+ | Production, multi-user |

Factor in electricity, cooling, and your time. A cheaper GPU that costs you ten hours of debugging is not cheaper.

---

## Why choose NVIDIA for self-hosting

- **It just works.** The driver, container, and framework stack is the most tested.
- **You can find help.** Forums, documentation, examples, and contractors are abundant.
- **Performance is predictable.** TensorRT and vLLM give you levers to optimize.
- **Clustering is real.** DGX units and multi-GPU servers scale horizontally and vertically.
- **Enterprise path exists.** NVIDIA AI Enterprise and DGX systems are procurement-friendly.

---

## When NVIDIA might not be the right fit

- **Budget is tight and VRAM needs are modest.** AMD or Apple Silicon can be competitive.
- **You value fully open-source drivers.** NVIDIA's proprietary driver is a philosophical or compliance issue for some teams.
- **You want the highest TFLOPS per dollar for raw compute.** AMD Instinct can win on paper in some workloads.

For most agent builders today, NVIDIA is still the safest default.

---

## Getting started checklist

- [ ] Choose your hardware tier
- [ ] Install Ubuntu 24.04 LTS
- [ ] Install the latest NVIDIA production driver
- [ ] Install CUDA Toolkit and NVIDIA Container Toolkit
- [ ] Install Ollama or vLLM
- [ ] Download a target model (start with Qwen 3.5:9b or Llama 3.1 8B)
- [ ] Run a benchmark and measure tokens per second
- [ ] Set up a reverse proxy or API for agent access
- [ ] Document your setup for repeatability

**Related:**
- [Linux Self-Hosting](/self-hosting/linux)
- [AMD-Based Self-Hosting](/self-hosting/amd-based)
- [Deployment Recipes](/deployment-recipes)
