---
slug: vllm-review
title: "vLLM Inference Engine Review"
excerpt: "After 12 months of running vLLM in production for local model serving across multiple GPU configurations, here is where it excels and where it falls short. The de facto standard for open-weight LLM inference — with real limitations."
category: Tool
tags: ["vllm", "inference", "self-hosting", "gpu", "open-source", "review"]
rating: 4.3
product: "vLLM"
tested_by: "Pamela Flannery"
last_verified: "2026-09-02"
url: https://github.com/vllm-project/vllm
order: 10
---

# vLLM Inference Engine Review

## What we tested

We have been running vLLM in production for approximately 12 months across multiple configurations:

- **Single-GPU inference**: Muse Glimmer 30B (FP8) on an AMD APU with 16GB VRAM headroom — used for image generation pipeline support and light agent tasks
- **Multi-GPU tensor parallelism**: DeepSeek-V4 on 2× A100 80GB — used for coding agent evaluation pipelines
- **Quantized serving**: NVFP4 quantized models on consumer GPUs — used for cost-sensitive local agent deployments
- **OpenAI-compatible API**: Served as a drop-in replacement for OpenAI API in agent stacks, routing local models through the same client libraries
- **Continuous batching**: High-throughput serving for parallel agent evaluations, running 20+ concurrent sequences

We have run vLLM versions from 0.4.x through 0.7.x over this period. The review reflects the current state as of September 2026.

## What it does well

**PagedAttention is still the king.** vLLM's memory management innovation — treating KV cache like virtual memory with page-level allocation — remains the single most impactful efficiency feature in open-weight inference. It is why vLLM can serve 3-5× more concurrent requests than naive HuggingFace Transformers serving on the same hardware. No competing engine has matched this for production throughput.

**OpenAI API compatibility is seamless.** Point any OpenAI-compatible client at a vLLM server and it works. `openai` Python library, LangChain, LlamaIndex, agent frameworks — they all connect without modification. This is the feature that makes vLLM the default for self-hosted agent stacks. You swap `base_url` and everything else is transparent.

**Tensor parallelism works reliably.** Multi-GPU serving with `--tensor-parallel-size N` is well-tested and handles most model architectures. We have run 2-way and 4-way TP on A100s and H100s without issues. This is critical for serving 70B+ models that do not fit on a single GPU.

**Broad model support.** vLLM supports an enormous range of architectures — Llama, Qwen, Mistral, DeepSeek MoE, GLM, Gemma, Phi, and newer architectures like `qwen4_exp` within weeks of release. The team is responsive to new model releases. If a model is on HuggingFace and has any traction, vLLM support follows.

**Quantization support is comprehensive.** FP8, AWQ, GPTQ, NVFP4, INT4, and bitsandbytes — all supported. The quantization landscape is fragmented, and vLLM is the only engine that supports all major formats in a single framework. This matters because quantized models are the only way to run 70B+ models on consumer hardware.

**Prefix caching.** `--enable-prefix-caching` caches the KV cache for shared prompt prefixes across requests. For agent workflows where many requests share a long system prompt, this cuts latency and cost dramatically. We measured 40-60% latency reduction on agent evaluation pipelines with shared system prompts.

**Active development and community.** 25K+ GitHub stars, active issue resolution, regular releases. When we hit a bug with DeepSeek MoE routing, the fix was in the next minor release. The community is large enough that most edge cases are already reported and answered.

## Honest limitations

**Memory overhead is non-trivial.** vLLM's KV cache pre-allocation is aggressive. `--gpu-memory-utilization 0.90` means vLLM will try to use 90% of VRAM — but this leaves little room for other processes. On shared GPU servers, vLLM will starve other workloads. You need dedicated GPUs or careful memory budgeting.

**New architecture support is bumpy.** While vLLM adds support for new architectures quickly, the initial support is often incomplete. We saw this with `qwen4_exp` — the first release that claimed support had issues with the n-gram embedding table, and it took two patch releases to stabilize. If you are running bleeding-edge models, expect to read source code and file issues.

**Documentation lags features.** vLLM moves fast and the docs do not always keep up. Several features we use regularly (prefix caching tuning, custom CUDA graphs, speculative decoding configuration) are documented sparsely or not at all. We have learned to read the source code and GitHub discussions for advanced configuration.

**No built-in model management.** vLLM serves one model per process. If you want to serve multiple models (e.g., a small model for routing and a large model for complex tasks), you run multiple vLLM processes and put a gateway in front. LiteLLM or Portkey handle this, but it is not vLLM's job — and the gap is real for teams that want a single deployment unit.

**CPU offloading is limited.** vLLM can offload some weights to CPU, but it is not a first-class feature. For models that exceed VRAM, you are better off with llama.cpp (GGUF) or a quantized vLLM deployment. vLLM's strength is GPU-resident serving, not hybrid memory.

**Startup time is slow for large models.** Loading a 70B+ model into VRAM takes 30-60 seconds. For development workflows where you restart the server frequently, this is annoying. For production, it is irrelevant (you start once and serve for days). But know what you are optimizing for.

**Vision model support is still maturing.** vLLM supports multimodal models (Qwen-VL, Llama-Vision), but the support is less polished than text-only models. We have encountered issues with image token handling, batching with mixed text/image inputs, and inconsistent behavior across vision architectures.

## Who it's for

vLLM is the right choice for teams who:
- Need production-grade open-weight LLM inference with maximum throughput
- Want OpenAI API compatibility for drop-in agent stack integration
- Have dedicated GPU hardware (consumer or datacenter)
- Need quantization support for running large models on limited VRAM
- Are serving a single model (or a few models on separate processes) at scale

It is the wrong choice for teams who:
- Need to serve many models with dynamic routing (use LiteLLM + vLLM backends)
- Need CPU-only inference (use llama.cpp / Ollama)
- Need ultra-low-latency single-request serving without batching (use llama.cpp)
- Need multi-modal as the primary use case (support is improving but not primary)
- Want a managed service with no infrastructure work (use OpenRouter or Replicate)

## Verdict

vLLM earns a 4.3 after 12 months of production use. It gains points for PagedAttention throughput, seamless OpenAI API compatibility, reliable tensor parallelism, broad model and quantization support, prefix caching, and a strong community. It loses points for aggressive memory overhead, bumpy new-architecture support, documentation gaps, lack of multi-model management, limited CPU offloading, slow startup for large models, and maturing vision support.

For self-hosted open-weight LLM serving, vLLM is the default choice. It is not perfect, but it is the best option available, and the alternatives (TGI, SGLang, llama.cpp server) each have more significant gaps for production agent workloads. If you are running open-weight models in production and not using vLLM, you are probably accepting lower throughput or more operational complexity than necessary.

The honest caveat: vLLM is infrastructure, not a product. You will read source code, file issues, and tune memory settings. If you want something that "just works" without operational involvement, use a managed inference provider. If you want maximum control and throughput on your own hardware, vLLM is the answer.