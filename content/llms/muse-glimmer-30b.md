---
{
  "slug": "muse-glimmer-30b",
  "title": "Muse Glimmer 30B",
  "excerpt": "Meta's 30B open-weight agentic model that runs on a single consumer GPU — Apache 2.0 licensed with DFlash speculative decoding and a 131K context window.",
  "category": "Meta",
  "tags": [
    "open-weight",
    "agents",
    "local-deployment",
    "multimodal",
    "meta",
    "apache-2.0"
  ],
  "provider": "Meta Superintelligence Labs",
  "input_price": 0.0,
  "output_price": 0.0,
  "context_window": 131072,
  "mmlu": null,
  "humaneval": null,
  "arena": "Competitive",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-08-12"
}
---

# Muse Glimmer 30B

## Overview

Muse Glimmer is Meta Superintelligence Labs' open-weight agentic model, released on August 10, 2026 under a permissive Apache 2.0 license. It is a 30-billion-parameter dense causal transformer designed to run locally on a single consumer GPU (24GB or 32GB), making it the most capable open-weight model in its size class for agentic workflows. The release marks Meta's return to open-source AI after the closed-weight Muse Spark line.

The model ships with a DFlash speculative-decoding drafter that proposes blocks of 16 tokens verified in parallel by the main model, producing identical output at higher throughput. Both transformers and llama.cpp ship day-0 support for DFlash.

## Architecture

- **Parameters**: ~29.6B total, including a ~1.8B ViT-G/14 perception encoder
- **Layers**: 52 text decoder layers; hidden size 6,656; 32 query heads / 2 KV heads
- **Attention**: Hybrid pattern — three 2,048-token sliding-window layers followed by one global layer, repeating. 39 of 52 layers use sliding-window attention, keeping long-context inference tractable on consumer hardware
- **Context**: 131,072 tokens (stated configuration; 202,048-token vocabulary including 2,048 special tokens)
- **I/O**: Text and image input; text output. Video processed as individual frames. No audio support
- **Knowledge cutoff**: January 4, 2026

## Quantization and hardware

Meta provides two official K-quant variants that shrink the language-model weights to under 20GB, leaving headroom for the KV cache, perception encoder, and DFlash drafter within a 24GB or 32GB memory envelope. The smallest GGUF file is 16.76GB.

## Running locally

**llama.cpp with DFlash speculative decoding:**

```bash
llama serve -hf meta-models/Muse-Glimmer-30B-GGUF \
  --spec-type draft-dflash --spec-draft-n-max 15
```

**vLLM with transformers backend:**

vLLM support ships with the release for production deployments.

## Pricing

- **Open-weight (Apache 2.0)**: Free to download, self-host, and use commercially
- **Self-hosting cost**: Your hardware + electricity — no per-token API cost
- Weights available on Hugging Face at `meta-models/Muse-Glimmer-30B`

## When to use it

- You need a capable agentic model running locally for privacy, cost, or data sovereignty reasons
- You have a 24GB+ GPU (RTX 4090, RTX 5090, or Mac with 32GB+ unified memory)
- You want to build and deploy agents without API dependencies

## When to skip it

- You need audio input/output capabilities
- You require the absolute frontier in reasoning benchmarks (Qwen3.6-27B outperforms Glimmer on several practical agent and multimodal tests in Meta's own evaluation table)
- Your hardware has less than 24GB VRAM

## Alternatives

- **Qwen3.6-27B** (Alibaba) — competitive open-weight alternative, strong on agent benchmarks
- **Muse Spark 1.2** (Meta) — closed-weight sibling with higher capability but no self-hosting
- **gpt-oss-120b** (OpenAI) — larger open-weight model, needs more hardware