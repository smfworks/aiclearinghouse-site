---
slug: qwen-flash-next-vllm
title: Deploy Qwen3.8-Flash-Next with vLLM
excerpt: Run Alibaba's experimental Qwen4-architecture model locally with vLLM — 125B total / 6B active, n-gram embeddings, Qwen Sparse Attention. Open weights, OpenAI-compatible API.
category: Model Serving
tags:
  - qwen
  - vllm
  - moe
  - self-hosting
  - gpu
  - open-weights
order: 101
last_verified: "2026-09-02"
difficulty: Advanced
estimated_time: "45 min"
---

# Deploy Qwen3.8-Flash-Next with vLLM

## The promise

Qwen3.8-Flash-Next is the experimental preview of Alibaba's Qwen4 architecture — 125B total parameters with only 6B active per token, plus a 51B n-gram embedding layer. Running it locally with vLLM gives you an OpenAI-compatible API endpoint for an architecture that is not available through any hosted inference provider yet. This recipe walks through the deployment on a multi-GPU system.

## What you will get

- A local vLLM inference server serving Qwen3.8-Flash-Next
- An OpenAI-compatible API endpoint on `localhost:8000`
- Support for the model's 262K native context window
- Multimodal input (text + image)
- No per-token API costs — your hardware, your model

## Prerequisites

- **Multi-GPU system**: 2× or 4× NVIDIA GPU with at least 80GB VRAM total (the model is 125B total parameters — even with 6B active, all parameters must be loaded). A single H100 80GB may work with FP8 quantization; untested with the n-gram embedding table offloaded.
- **NVIDIA drivers and CUDA 12.1+**
- **Python 3.10+** with pip
- **vLLM 0.7.0+** (required for `qwen4_exp` architecture support — earlier versions do not recognize this model type)
- **~300GB disk space** for the model weights (213 safetensors shards)

## Steps

### 1. Install vLLM

```bash
pip install vllm>=0.7.0
```

Verify the architecture is supported:

```bash
python -c "from vllm.model_executor.models import _MODELS; print([m for m in _MODELS if 'qwen4' in m.lower()])"
```

If the list is empty, your vLLM version is too old. Upgrade.

### 2. Download the model from HuggingFace

```bash
pip install huggingface-hub
huggingface-cli download Qwen/Qwen3.8-Flash-Next --local-dir ./qwen-flash-next
```

This downloads ~250GB of safetensors shards. Ensure you have disk space. The download may take 30-60 minutes depending on your connection.

### 3. Launch the vLLM server

For a 2-GPU tensor-parallel setup:

```bash
vllm serve ./qwen-flash-next \
  --tensor-parallel-size 2 \
  --gpu-memory-utilization 0.90 \
  --max-model-len 262144 \
  --trust-remote-code \
  --dtype auto \
  --port 8000
```

For a 4-GPU setup:

```bash
vllm serve ./qwen-flash-next \
  --tensor-parallel-size 4 \
  --gpu-memory-utilization 0.90 \
  --max-model-len 262144 \
  --trust-remote-code \
  --dtype auto \
  --port 8000
```

### 4. Test the endpoint

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"  # vLLM does not require a real key by default
)

response = client.chat.completions.create(
    model="qwen-flash-next",
    messages=[
        {"role": "user", "content": "Explain how n-gram embeddings differ from standard token embeddings."}
    ],
    max_tokens=512,
    temperature=0.7
)

print(response.choices[0].message.content)
```

### 5. Test multimodal input (image)

```python
import base64
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")

with open("test_image.png", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="qwen-flash-next",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_b64}"}},
                {"type": "text", "text": "Describe this image in detail."}
            ]
        }
    ],
    max_tokens=512
)

print(response.choices[0].message.content)
```

### 6. Enable continuous batching for production

For production use, enable continuous batching and set a reasonable max number of sequences:

```bash
vllm serve ./qwen-flash-next \
  --tensor-parallel-size 2 \
  --gpu-memory-utilization 0.90 \
  --max-model-len 262144 \
  --trust-remote-code \
  --dtype auto \
  --port 8000 \
  --max-num-seqs 4 \
  --enable-prefix-caching
```

`--max-num-seqs 4` is conservative for a 125B model. The n-gram embedding table adds memory pressure beyond what a standard MoE of similar active size would require. Start low and increase only if VRAM headroom allows.

## Verification

- The server starts without OOM errors and logs "Model loaded successfully"
- `curl http://localhost:8000/v1/models` returns the model name
- A text completion request returns a coherent response
- An image input request returns a description of the image
- `nvidia-smi` shows the model loaded across both GPUs (tensor parallelism is working)
- A latency test shows time-to-first-token under 500ms for a short prompt (the 6B active parameter count should make this competitive with much smaller dense models)

## Troubleshooting

- **`qwen4_exp` architecture not recognized**: Your vLLM is too old. `pip install --upgrade vllm` and verify version 0.7.0+. If the architecture still is not supported, check the vLLM GitHub for the latest supported model list — `qwen4_exp` support was added in late August 2026 and may not be in all builds.
- **CUDA OOM during loading**: The model is 125B total parameters. Even with FP8, this is ~125GB of weights plus the 51B n-gram embedding table. You need at least 160GB VRAM total across all GPUs. If you are OOMing, increase `--tensor-parallel-size` or reduce `--gpu-memory-utilization` to 0.85.
- **N-gram embedding table OOM**: The 51B n-gram embedding table is memory-bandwidth-bound, not compute-bound. If VRAM is tight, try offloading the embedding table to CPU memory using vLLM's `--kv-cache-dtype` and embedding offload options. This trades latency for VRAM savings.
- **Slow time-to-first-token**: Check that tensor parallelism is actually splitting across GPUs. `nvidia-smi` should show balanced memory across all GPUs. If one GPU is at 95% and another at 5%, the model is not parallelizing correctly.
- **Image input not working**: Ensure your vLLM build includes vision model support. Some builds exclude vision by default. Use `--multimodal` or check the vLLM docs for the current flag.
- **Context window issues**: The model supports 262K natively. If you need 1M context, you need the production API (Qwen3.8-Flash via DashScope), not the open-weight Flash-Next.

## Honest notes

- **This is an experimental model.** Qwen3.8-Flash-Next is a research artifact, not a production model. The production version (Qwen3.8-Flash) has 1M context and built-in tools. Flash-Next does not. Deploy this for research and experimentation, not for serving production traffic.
- **The n-gram embedding table is unusual.** Most inference infrastructure is optimized for MoE expert routing, not for large embedding lookup tables. You may encounter performance patterns that differ from standard MoE models — the n-gram table is memory-bandwidth-bound and may be slower than expected on GPUs with limited HBM bandwidth.
- **Hardware requirements are substantial.** 125B total parameters is not a small model, even with 6B active. Do not attempt this on a single consumer GPU. You need datacenter-class hardware or a multi-GPU workstation.
- **The Qwen Community License is not Apache 2.0.** Read it before deploying in a commercial setting. The license includes acceptable-use restrictions.