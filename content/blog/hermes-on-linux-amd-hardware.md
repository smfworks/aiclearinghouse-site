---
slug: "hermes-on-linux-amd-hardware"
title: "Hermes on Linux with AMD Hardware: A Field Guide for Builders and Business"
excerpt: "Running the Hermes agent stack on Linux with AMD silicon is no longer experimental. Here is the current state, what works, what still requires care, and how small teams can turn a local AMD machine into a private AI production node."
date: "2026-06-24"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Linux", "AMD", "ROCm", "Local LLMs", "Terminal"]
tags: ["hermes", "ollama", "rocm", "amd", "linux", "llama.cpp", "business"]
readTime: 18
image: "/images/blog/hermes-on-linux-amd-hardware-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hermes-on-linux-amd-hardware"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

## 1. The Context: Why AMD + Linux Matters for Hermes

Hermes is an agentic coding assistant. It runs tools, writes code, executes commands, reads files, and delegates to subagents. Its value increases sharply when it can run against local models, local browsers, and local repositories. Linux is the obvious host for that stack. AMD hardware is the obvious alternative to NVIDIA for teams that want to avoid CUDA lock-in, high GPU prices, or cloud-only inference.

For most of 2025, running serious local LLMs on AMD GPUs meant patches, half-finished ROCm builds, and forum archaeology. In 2026 the situation changed. ROCm 7.2 ships stable packages for recent RDNA 3.5 and CDNA hardware. llama.cpp has a working ROCmFPX branch. Ollama's AMD path improved. And Hermes itself gained better provider multiplexing and a hardware-aware launcher.

This post is a state-of-the-stack snapshot, written after actually running Hermes daily on an AMD Linux box. It covers:

- The current setup path (June 2026)
- ROCm installation tips that avoid the common traps
- Model serving: Ollama vs. llama.cpp vs. direct ROCm
- Hermes configuration for AMD-specific providers
- Business use cases and total-cost projections
- Diagnostics and performance charts

I assume you are comfortable with the terminal, package managers, and basic GPU concepts. If you are not, read the [Getting Started guide](https://www.smfclearinghouse.com/guides) first.

---

## 2. Reference Architecture

The simplest reliable Hermes-on-AMD stack looks like this:

```
┌─────────────────────────────────────────────────────────────┐
│                      Hermes Agent (CLI/GUI)                  │
│  · profile: linux-amd                                        │
│  · provider router: ollama-cloud, local, or custom server   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP / REST
┌───────────────────────▼─────────────────────────────────────┐
│              Inference Server (one of below)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Ollama       │  │ llama-server │  │ vLLM / Triton    │    │
│  │ (easy)       │  │ (fastest)    │  │ (multi-user)     │    │
│  └──────────────┘  └──────────────┘  └──────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │ ROCm HIP / GPU offload
┌───────────────────────▼─────────────────────────────────────┐
│              AMD GPU / APU (ROCm 7.2 runtime)                │
│  · discrete: RX 7900 XTX, RX 9070 XT, MI100/MI200           │
│  · integrated: Ryzen AI Max+ 395 (Radeon 8060S)            │
└─────────────────────────────────────────────────────────────┘
```

That single diagram is the whole mental model. Hermes talks HTTP to an inference server. The inference server talks ROCm to the GPU. Your job is to keep those two interfaces clean.

---

## 3. What "AMD" Means in 2026

Not all AMD silicon is the same for LLM inference. Three classes matter:

| Class | Examples | VRAM | ROCm tier | Notes |
|---|---|---|---|---|
| Discrete RDNA 3/3.5 | RX 7900 XTX (24 GB), RX 9070 XT (16 GB) | Dedicated | `gfx1100`, `gfx1101` | Best price/performance for local LLMs |
| Discrete CDNA / Instinct | MI100 (32 GB), MI210 (64 GB), MI300X (192 GB) | Dedicated | `gfx908`, `gfx90a`, `gfx942` | Datacenter/serious training |
| Integrated APU | Ryzen AI Max+ 395 (Radeon 8060S) | Shared DDR5 | `gfx1151` | Thin-and-light AI PCs; slower but private |

The unified-memory APUs are fascinating for privacy-first deployments. A 27B model at FP4 fits on a laptop with 48 GB–128 GB of system RAM and runs entirely on the local die. Throughput is low (≈14 tok/sec on Strix Halo), but the data never leaves the machine. For many business workflows—overnight report generation, code review queues, cron-driven summaries—that latency is acceptable.

---

## 4. Installing ROCm Without Breaking Your System

The single most common failure mode is not the GPU, it is the ROCm install. Here is the conservative path that works.

### 4.1 Use the official AMD apt repository

```bash
# Add the ROCm 7.2 repository for your distro
# Example: Ubuntu 24.04
sudo apt update
sudo apt install -y wget gnupg2
wget -qO - https://repo.radeon.com/rocm/rocm.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/rocm-keyring.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/rocm-keyring.gpg] https://repo.radeon.com/rocm/apt/7.2 noble main" \
  | sudo tee /etc/apt/sources.list.d/rocm.list

sudo apt update
sudo apt install -y rocm-dev rocm-libs rocminfo
```

### 4.2 Pin the version

ROCm minor releases are not perfectly ABI-compatible. Pin to one version and upgrade deliberately, not on every `apt upgrade`.

```bash
echo "Package: rocm-*\nPin: version 7.2.*\nPin-Priority: 1001" \
  | sudo tee /etc/apt/preferences.d/rocm-72
```

### 4.3 Set environment variables consistently

Add to `~/.bashrc` or a dedicated shell fragment:

```bash
export ROCM_VERSION=7.2.0
export HIP_PATH=/opt/rocm-${ROCM_VERSION}
export PATH=${HIP_PATH}/bin:${HIP_PATH}/lib/llvm/bin:${PATH}
export LD_LIBRARY_PATH=${HIP_PATH}/lib:${LD_LIBRARY_PATH}
export HSA_OVERRIDE_GFX_VERSION=11.5.1   # only for gfx1151 APUs
```

> **Trap**: `HSA_OVERRIDE_GFX_VERSION` is a workaround, not a solution. It lets ROCm run on APUs before official full enablement. Track the ROCm release notes and remove it once your architecture is natively supported.

### 4.4 Verify the runtime

```bash
rocminfo | head -40
rocm-smi
```

If `rocminfo` prints your GPU's `gfx` architecture, the runtime is healthy. If it shows a different architecture or falls back to CPU, your `HSA_OVERRIDE_GFX_VERSION` or driver stack is wrong.

---

## 5. Three Ways to Serve Models

### 5.1 Ollama: the easiest path

Ollama now has a usable AMD/ROCm path for several GPUs. It is the right choice for teams that want to run `ollama run qwen3.6:27b` and move on.

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Force GPU offload verification
ollama run qwen3.6:27b "hello"
```

Check GPU usage with `rocm-smi`. If the GPU is idle while generating, Ollama fell back to CPU. Common causes:

- `LD_LIBRARY_PATH` does not include `/opt/rocm/lib`
- The model quant is unsupported on your ROCm build
- Ollama's bundled ROCm libraries conflict with system ROCm

Fix: run Ollama with the system ROCm libraries:

```bash
export OLLAMA_USE_ROCM=1
export OLLAMA_ROCM_PATH=/opt/rocm-7.2.0
ollama serve
```

### 5.2 llama.cpp: the fastest path

For maximum throughput, build llama.cpp with the ROCm backend directly. Dr. J's [Qwable-5-27B benchmark](/blog/2026-06-23-qwable-5-27b-chadrock-v2-roc-fp4-benchmark) documents this in detail. The short version:

```bash
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp

cmake -B build-rocm \
  -DGGML_HIP=ON \
  -DAMDGPU_TARGETS=gfx1100 \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_C_COMPILER=/opt/rocm-7.2.0/lib/llvm/bin/clang \
  -DCMAKE_CXX_COMPILER=/opt/rocm-7.2.0/lib/llvm/bin/clang++

cmake --build build-rocm --config Release -j$(nproc)

./build-rocm/bin/llama-server \
  -m ~/models/Qwable-5-27B-Chadrock-v2-ROCmFP4.gguf \
  --host 0.0.0.0 --port 11434 \
  -c 8192 -t 16 --flash-attn --gpu-layers 999
```

Replace `gfx1100` with your architecture. For APUs use `gfx1151` and the ROCmFPX branch if the main backend is not yet stable.

### 5.3 vLLM / Triton: the multi-user path

For teams that need concurrent clients, vLLM with ROCm is the next step up. It is more involved than Ollama or llama.cpp and is outside the scope of a single-machine guide. Start here only after the single-user stack is stable.

---

## 6. Configuring Hermes for the AMD Stack

Hermes uses providers. A provider is an OpenAI-compatible HTTP endpoint with a model name. The Hermes Linux AMD profile is designed to prefer local endpoints and fall back to cloud only when a model is missing locally.

### 6.1 Minimal Hermes config

```yaml
# ~/.hermes/profiles/liam/providers.yaml
providers:
  local-amd:
    base_url: http://localhost:11434/v1
    model: qwen3.6:27b
    api_key: ollama
    priority: 1
  local-llamacpp:
    base_url: http://localhost:11434/v1
    model: Qwable-5-27B-Chadrock-v2-ROCmFP4
    api_key: llama
    priority: 2
  cloud-fallback:
    base_url: https://api.ollama-cloud.com/v1
    model: deepseek-v4-pro:cloud
    api_key: ${OLLAMA_CLOUD_API_KEY}
    priority: 3
```

Hermes routes by model availability and priority. If `local-amd` has the requested model, it wins. If not, it tries the next provider. This lets you run cheap local inference for 90% of tasks while keeping cloud models for oversized context windows or specialized models.

### 6.2 The linux-amd profile

```yaml
# ~/.hermes/profiles/liam/config.yaml
profile:
  name: liam
  runtime:
    platform: linux
    gpu_vendor: amd
    rocm_version: "7.2.0"
    preferred_providers: [local-amd, local-llamacpp, cloud-fallback]
    browser:
      backend: playwright
      headless: true
    terminal:
      shell: /bin/bash
      workdir: /home/mikesai1/projects
```

### 6.3 Provider selection rules

Hermes selects a provider in this order:

```
1. Is the requested model available on a local endpoint? → use it
2. Is the task a long-running code generation? → prefer local (no cloud cost)
3. Does the prompt exceed local context window? → use cloud
4. Is the local GPU currently saturated? → queue locally or use cloud
5. Fallback to highest-priority available provider
```

You can override per request:

```bash
hermes --provider local-llamacpp "review this PR"
```

---

## 7. Performance: What to Expect

Here is a realistic comparison table for a 27B parameter model at FP4 quantization on current AMD hardware.

| Hardware | GPU | Memory | Generation tok/sec | Prompt eval tok/sec | Use case |
|---|---|---|---|---|---|
| Ryzen AI Max+ 395 APU | Radeon 8060S | Shared 48 GB DDR5 | ~14 | ~52–104 | Private drafting, cron jobs |
| RX 7900 XTX | RDNA 3 | 24 GB GDDR6 | ~55–75 | ~300–500 | Developer workstation |
| RX 9070 XT | RDNA 4 | 16 GB GDDR6 | ~45–65 | ~250–400 | Mid-range workstation |
| MI210 | CDNA 2 | 64 GB HBM2e | ~80–120 | ~600–900 | Small team server |
| MI300X | CDNA 3 | 192 GB HBM3 | ~150–250+ | ~1000+ | Shared production inference |

These numbers depend on quant format, context length, batching, and ROCm version. Do not quote them as guarantees; quote them as orientation.

### 7.1 Bottlenecks on AMD hardware

On discrete AMD cards, the usual bottleneck is memory bandwidth, not compute. On APUs, it is both bandwidth and shared memory contention. On all AMD hardware, the occasional bottleneck is ROCm kernel launch overhead for very short prompts.

Practical implication: **batch short prompts** when possible. Hermes can bundle small file reads and greps into a single multi-part prompt instead of dozens of tiny round trips. This reduces both token overhead and GPU kernel setup cost.

---

## 8. Hermes Workflow on AMD: A Day in the Life

A typical working session:

```
08:00  System cron pulls latest source repos.
08:05  Hermes (local Qwen3.6 27B) reviews overnight diffs and writes a summary.
09:00  Developer asks Hermes to implement a feature. Hermes plans, delegates to
       subagents, writes code, runs tests, and returns a PR branch.
12:00  Long-context architecture discussion switches to cloud fallback because
       the 32k-token prompt exceeds local context budget.
14:00  Hermes runs a local benchmark sweep using the AMD GPU; results logged.
17:00  Cron job generates tomorrow's content brief using the APU overnight.
```

That schedule is realistic because the local AMD GPU handles the bulk of "medium" work while cloud handles the edge cases.

---

## 9. Business Use Cases

### 9.1 Private code review agent

A development team keeps all source code inside the company network. An AMD workstation with an RX 7900 XTX runs Hermes against local Git repositories. Every pull request gets an architectural review before a human sees it. Cost: one-time hardware purchase of ~$1,500–$2,500 USD. Ongoing inference cost: electricity.

### 9.2 Air-gapped documentation generator

Healthcare, finance, and defense teams cannot send source code to cloud APIs. A MI210 or MI300X server inside the secure enclave runs Hermes with local models and generates documentation, compliance reports, and test plans from internal codebases.

### 9.3 APU-powered mobile consulting kit

A consultant carries a Ryzen AI Max+ 395 laptop. On client sites, Hermes runs entirely locally—no network required for sensitive architecture discussions, no API keys to expose, no cloud egress. The slower throughput is acceptable because the work is intermittent and privacy is non-negotiable.

### 9.4 24/7 batch agent

A small business runs Hermes as a daemon on a cheap AMD server. It processes customer support tickets, drafts email responses, generates social content, and runs nightly research. The GPU is idle 70% of the day; batch work fills the gaps. Monthly cloud-equivalent inference cost avoided: hundreds to thousands of dollars.

---

## 10. Total Cost Comparison

| Approach | Upfront | Monthly inference | Privacy | Throughput |
|---|---|---|---|---|
| Cloud API only | $0 | $500–$5,000+ | Low | High |
| NVIDIA RTX 4090 workstation | ~$4,000 | ~$50 electricity | High | Very high |
| AMD RX 7900 XTX workstation | ~$2,000 | ~$50 electricity | High | High |
| AMD MI210 server | ~$10,000 used | ~$100 electricity | High | Very high |
| Ryzen AI Max+ 395 laptop | ~$2,500 | Negligible | Very high | Low |

The AMD stack's economic pitch is simple: **80% of NVIDIA's inference performance at 50–70% of the hardware cost, with no CUDA ecosystem tax.** For businesses not chasing the absolute top benchmark, that is a strong position.

---

## 11. Tips and Tricks

### 11.1 Prefer FP4 and Q4_K_M

On AMD GPUs, FP4 and Q4_K_M quants usually give the best speed/quality trade-off. Q8_0 is higher quality but slower. Avoid K-quants only if you observe accuracy regression on your specific task.

### 11.2 Use `rocm-smi` as your dashboard

```bash
watch -n 1 rocm-smi --showmeminfo --showpower
```

If GPU utilization is low while tokens are slow, you are memory-bandwidth bound or CPU-bound. If utilization is high and tokens are slow, you are compute-bound and need a smaller quant or better kernels.

### 11.3 Lock ROCm versions in Docker

For reproducible team deployments, use a container with a pinned ROCm base:

```dockerfile
FROM rocm/dev-ubuntu-24.04:7.2
RUN apt-get update && apt-get install -y python3-pip git
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
```

Never let team members install ROCm directly on their laptops without a version lock. You will spend more time debugging driver states than writing code.

### 11.4 Keep models on fast storage

Model load time matters. A 27B FP4 model is ~14 GB on disk. Load it from NVMe, not a network share, and definitely not a USB drive. Hermes can keep the inference server warm in the background to avoid repeated load latency.

### 11.5 Use a dedicated inference user

Run the inference server under a non-root user with limited filesystem access. Hermes itself runs as your normal user and talks to the server over localhost. This separates model execution from your development environment and limits blast radius.

### 11.6 Watch for CPU fallback

The most dangerous silent failure is the server running on CPU while you think it is on GPU. Always verify with `rocm-smi` after starting a model. If GPU memory usage does not climb during the first prompt, investigate immediately.

---

## 12. Troubleshooting Decision Tree

```
Hermes request fails or is slow
│
├─ Is the inference server running?
│  └─ No → start it (ollama serve / llama-server / vllm)
│
├─ Is rocm-smi showing GPU activity?
│  ├─ No → check LD_LIBRARY_PATH, HIP_PATH, OLLAMA_USE_ROCM
│  └─ Yes → continue
│
├─ Is the model loaded into GPU memory?
│  ├─ No → reduce context size, use a smaller quant, or add VRAM
│  └─ Yes → continue
│
├─ Is the prompt very long?
│  ├─ Yes → use a model with larger context, or split the task
│  └─ No → continue
│
└─ Is throughput unexpectedly low?
   ├─ Discrete GPU: memory-bandwidth bound → use Q4_K_M / FP4
   ├─ APU: shared-memory bound → reduce model size or batch
   └─ All: ROCm kernel overhead → batch short prompts
```

---

## 13. Security and Operational Notes

Running local inference changes the security model. The good news: your data does not leave the machine. The bad news: the machine now holds expensive models and may be exposed on a local port.

- Bind inference servers to `127.0.0.1` unless you have a specific reason to expose them.
- Use a firewall rule to block port `11434` from external interfaces.
- Keep ROCm and the inference server up to date; both have had privilege-escalation CVEs.
- Audit which Hermes skills can execute shell commands. The `terminal` tool is powerful; restrict its working directory and never run Hermes as root for routine coding tasks.

---

## 14. What Is Still Hard

I want to be honest about gaps, not just cheerlead.

| Pain point | Status |
|---|---|
| ROCm on brand-new APU architectures | Works with `HSA_OVERRIDE_GFX_VERSION`, but native support lags NVIDIA by months |
| Speculative decoding on mismatched models | Often fails on AMD builds; needs matched draft models |
| Multi-GPU scaling | Functional but less polished than NVIDIA's NCCL path |
| Windows parity for AMD inference | Linux is far ahead; use WSL2 only if you must |
| Pre-built ROCm wheels for Python ML | Improving, but still not as complete as CUDA wheels |

If your primary need is "push button and forget," cloud APIs remain easier. If your primary need is cost control, privacy, or independence from NVIDIA, the AMD path is now genuinely viable.

---

## 15. Recommended Starting Build

For a small engineering team, this is the build I would assemble today:

| Component | Recommendation |
|---|---|
| CPU | AMD Ryzen 9 7950X or Ryzen 9 9950X |
| GPU | AMD RX 7900 XTX (24 GB) or RX 9070 XT (16 GB) |
| RAM | 64 GB DDR5 |
| Storage | 2 TB NVMe Gen4 |
| OS | Ubuntu 24.04 LTS or Fedora 41 |
| ROCm | 7.2.x pinned via apt preferences |
| Inference | Ollama for ease, llama.cpp for speed |
| Hermes profile | `linux-amd` with local-first provider routing |

Expected all-in hardware cost: ~$2,500–$3,500 USD. Expected monthly electricity: ~$15–$40 depending on load. Amortized over two years, that is a fraction of a medium cloud inference bill.

---

## 16. Conclusion

Hermes on Linux with AMD hardware is no longer a science project. ROCm 7.2, modern llama.cpp builds, and Ollama's AMD path make it a production-adjacent option for teams that value privacy, cost control, and hardware independence. The throughput is good enough for the bulk of agent work; the edge cases—very long contexts, peak concurrent load, speculative decoding—still favor NVIDIA or cloud.

For SMF Works, this stack is our default on-premise inference path. It powers our internal code review, our nightly research cron jobs, and our air-gapped client work. The money we do not spend on cloud tokens gets reinvested in model evaluation, benchmark tooling, and the open-source projects we depend on.

If you are building a local AI practice, AMD deserves a serious look. The setup is more involved than clicking "API key," but the operational freedom is worth the effort.

---

*Tested on: Linux 6.17, ROCm 7.2.0, Hermes Agent, Ollama, llama.cpp ROCm backend, AMD Radeon 8060S (gfx1151) and RX 7900 XTX (gfx1100).*  
*Published on the SMF Clearinghouse: https://www.smfclearinghouse.com/blog/hermes-on-linux-amd-hardware*
