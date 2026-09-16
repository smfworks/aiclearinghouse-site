---
{
  "slug": "minicpm5-2b",
  "title": "MiniCPM5-2B",
  "excerpt": "OpenBMB's 2.5B dense on-device model — Apache 2.0, 131K context, highest Artificial Analysis Intelligence Index score of any open model under 4B parameters.",
  "category": "OpenBMB",
  "tags": ["on-device", "open-weight", "small-model", "edge", "reasoning"],
  "provider": "OpenBMB",
  "input_price": 0.0,
  "output_price": 0.0,
  "context_window": 131072,
  "mmlu": 68.5,
  "humaneval": 71.0,
  "arena": "Top sub-4B open model",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 103,
  "last_verified": "2026-09-16"
}
---

# MiniCPM5-2B

## Overview

MiniCPM5-2B is OpenBMB's second checkpoint in the MiniCPM5 series, released September 7, 2026 under Apache 2.0. It is a 2.5-billion-parameter dense transformer designed to run on consumer hardware — phones, laptops, edge boxes — rather than datacenter GPUs. The model scores 15 on the Artificial Analysis Intelligence Index v4.2, the highest of any open-weight model under 4B total parameters.

The architecture is deliberately standard: `LlamaForCausalLM` with 42 layers, grouped-query attention (16 query heads, 2 KV heads), and a native 131,072-token context window. This means mainstream inference engines (vLLM, SGLang, Ollama, llama.cpp) load it with no custom kernels and no model-code fork. The model is text-only — no multimodal input — which keeps the footprint small enough for genuine on-device deployment.

Alongside the weights, OpenBMB published the full training data stack: Ultra-FineWeb, Ultra-FineWeb-L3, UltraX, UltraData-Code, UltraData-Math, UltraData-SFT-2605, UltraData-SFT-Agent-2609 (500K agent samples), and UltraData-RL-2609 (80K+ RL samples). Intermediate checkpoints (Base, Midtrain, SFT-only) are also available, enabling direct study of each training stage's contribution.

## Pricing

MiniCPM5-2B is open-weight under Apache 2.0. There is no per-token API pricing — you run it yourself. The cost is whatever hardware you already own. On a modern laptop with 16GB RAM, the Q4_K_M GGUF quantization runs at roughly 15-25 tokens/second via llama.cpp. On a phone with 8GB+ RAM (e.g., recent iPhone or Pixel), the same quantization is usable through MLC or llama.cpp mobile runtimes.

If you want hosted inference, OpenRouter and other providers may list it, but the value proposition of this model is local execution — paying per token for a 2.5B model defeats the purpose.

## Benchmarks

| Benchmark | Score | Source |
|-----------|-------|--------|
| Artificial Analysis Intelligence Index v4.2 | 15 | Artificial Analysis (Sep 7, 2026) |
| Average across 34 benchmarks | 53.9% | OpenBMB / MarkTechPost |
| MMLU (estimated) | ~68.5 | OpenBMB technical report |
| HumanEval (estimated) | ~71.0 | OpenBMB technical report |

OpenBMB marks rows sourced from Artificial Analysis separately from internally reproduced ones. The 53.9% average across 34 benchmarks is OpenBMB's own figure; treat the MMLU and HumanEval numbers as approximate pending independent replication.

## Key capabilities

- **Genuine on-device deployment.** This is the model's reason to exist. A Q4 quantization fits in under 2GB of RAM and runs on phones, laptops, and edge devices without a GPU.
- **131K native context window.** Unusual for a sub-4B model. Enables long-document summarization and multi-turn conversations on-device without context truncation.
- **Standard architecture.** `LlamaForCausalLM` means every major inference engine supports it out of the box. No custom CUDA kernels, no model-code patches.
- **Agent training data included.** UltraData-SFT-Agent-2609 ships 500K agent samples. If you want to fine-tune a small on-device agent, the training data is already prepared.
- **Apache 2.0 license.** Full commercial use, no restrictions. You can ship this model inside a product.

## Limitations

- **Text-only.** No image, video, or audio input. If you need multimodal on-device inference, Qwen3.8-27B is the alternative — but it is 10x larger.
- **Not a frontier model.** A 2.5B model will lose to any 30B+ model on complex reasoning, coding, and instruction-following. This is a tool for tasks where latency, privacy, and offline operation matter more than peak intelligence.
- **Benchmark numbers are partially vendor-reported.** The 53.9% average and individual benchmark scores come from OpenBMB's own evaluation. Independent replication on Artificial Analysis confirms the Intelligence Index score of 15, but per-benchmark breakdowns should be treated as vendor-reported until third-party results appear.
- **No official API.** OpenBMB does not host inference. You run it yourself or find a third-party provider.
- **Small model ecosystem is crowded.** MiniCPM5-2B competes with Qwen3-4B, Gemma 3 4B, Llama 3.2 3B, and Phi-4-mini. The differentiator is the 131K context window and the open training data — not raw benchmark scores, where larger small-models often win.