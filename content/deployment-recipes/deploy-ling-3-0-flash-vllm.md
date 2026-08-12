---
slug: deploy-ling-3-0-flash-vllm
title: Deploy Ling 3.0 Flash with vLLM
excerpt: Run InclusionAI's 124B MoE reasoning model locally with vLLM — 5.1B active parameters makes it feasible on a single 80GB GPU.
category: Deployment
tags: [vllm, ling, inclusionai, moe, open-weight, self-hosting, GPU]
order: 28
last_verified: "2026-08-12"
difficulty: Intermediate
estimated_time: "25 min"
---

# Deploy Ling 3.0 Flash with vLLM

## The promise

Ling 3.0 Flash is a 124B-parameter MoE model with only 5.1B active parameters per token. That means inference is fast (403 tok/s on API) and the VRAM footprint is manageable for local deployment. This recipe sets up vLLM to serve Ling 3.0 Flash as an OpenAI-compatible endpoint on a single 80GB GPU (A100, H100, or equivalent).

## What you'll get

- vLLM serving Ling 3.0 Flash as an OpenAI-compatible API
- A tested endpoint you can point any agent framework at
- Verified model loading and inference

## Prerequisites

- A machine with an 80GB+ GPU (A100 80GB, H100 80GB, or 2x 48GB GPUs)
- Python 3.10+
- CUDA 12.1+ and matching NVIDIA drivers
- ~250GB disk for model weights
- vLLM 0.23+ (supports the hybrid MoE architecture)

## Step 1: Install vLLM

```bash
python -m venv vllm-env
source vllm-env/bin/activate
pip install vllm
```

Verify installation:

```bash
python -c "import vllm; print(vllm.__version__)"
```

## Step 2: Download the model

```bash
# Using huggingface-cli
pip install huggingface_hub
huggingface-cli download inclusionai/Ling-3.0-flash --local-dir ./models/ling-3-flash
```

This is a large download (~250GB for the full-precision weights). If you have a slower connection, consider downloading a quantized variant if InclusionAI publishes one.

## Step 3: Launch vLLM

```bash
vllm serve ./models/ling-3-flash \
  --host 0.0.0.0 \
  --port 8000 \
  --dtype bfloat16 \
  --max-model-len 262144 \
  --gpu-memory-utilization 0.90 \
  --max-num-seqs 32 \
  --trust-remote-code
```

Key flags:
- `--max-model-len 262144` — Ling 3.0 Flash's documented context window
- `--gpu-memory-utilization 0.90` — leaves headroom for KV cache
- `--trust-remote-code` — required for custom MoE architecture
- `--max-num-seqs 32` — concurrent request limit; adjust based on your VRAM

## Step 4: Verify the endpoint

```bash
curl http://localhost:8000/v1/models | python -m json.tool
```

You should see `Ling-3.0-flash` in the model list.

Test inference:

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Ling-3.0-flash",
    "messages": [{"role": "user", "content": "What is 17 × 23? Think step by step."}],
    "max_tokens": 500
  }'
```

Ling 3.0 Flash is a reasoning model, so it will produce chain-of-thought tokens before the final answer. The response should show the reasoning steps and conclude with the correct answer (391).

## Step 5: Point your agent at it

Any OpenAI-compatible client works. Example with the OpenAI Python SDK:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"  # vLLM does not require a real key
)

response = client.chat.completions.create(
    model="Ling-3.0-flash",
    messages=[
        {"role": "system", "content": "You are a research assistant. Cite sources when possible."},
        {"role": "user", "content": "Summarize the key differences between MCP 2025-11-25 and 2026-07-28."}
    ],
    max_tokens=2000,
    temperature=0.7
)

print(response.choices[0].message.content)
print(f"\nTokens: {response.usage.total_tokens}")
```

## Verification

Confirm the model is loading the MoE correctly:

```bash
# While vLLM is starting, watch the logs for expert loading
# You should see messages about loading 124B total parameters
# with 5.1B active per token
```

Check GPU memory usage:

```bash
nvidia-smi
```

You should see the vLLM process using most of your GPU memory (the model weights + KV cache). If you are using less than 70% of VRAM, you can increase `--max-num-seqs` for better throughput.

## Troubleshooting

### Out of memory (OOM) on load

Ling 3.0 Flash is 124B parameters. In bfloat16, that is ~248GB of weights. A single 80GB GPU cannot hold the full model in bfloat16. Options:

1. **Use a quantized variant** if available (FP8, INT4). Check HuggingFace for community quantizations.
2. **Use tensor parallelism across 4 GPUs:**

```bash
vllm serve ./models/ling-3-flash \
  --tensor-parallel-size 4 \
  --dtype bfloat16 \
  --max-model-len 262144 \
  --gpu-memory-utilization 0.90
```

3. **Use a smaller context window** to reduce KV cache pressure: `--max-model-len 32768`

### Slow first token (high TTFT)

Ling 3.0 Flash has a TTFT of ~2s even on the API. Locally, this may be higher depending on your hardware. This is expected for a MoE reasoning model. If TTFT exceeds 5s, check:
- GPU memory bandwidth (ensure you are not hitting PCIe transfer bottleneck)
- Number of concurrent requests (reduce `--max-num-seqs`)
- Whether you have enough KV cache allocated

### Model architecture not recognized

```bash
pip install --upgrade vllm
# Ensure you have vLLM 0.23+ for hybrid MoE support
```

### Verbose output consuming your token budget

Ling 3.0 Flash generates 4x more output tokens than comparable models. If you are running agent loops, set strict `max_tokens` limits per call and monitor total token usage. See our tip on [costing your agent's idle loops](/tips/cost-your-agents-idle-loops).

## Security notes

- Ling 3.0 Flash is open-weight. You own the inference. No data leaves your machine.
- If you expose the vLLM endpoint beyond localhost, put it behind authentication (API key, reverse proxy with auth).
- The `--trust-remote-code` flag executes custom model code. Only use it with models from sources you trust. InclusionAI is a legitimate lab, but verify the model card before running.

## Best fit

Teams who want a capable reasoning model running locally for data sovereignty, cost control, or latency reasons. The 5.1B active parameter count makes Ling 3.0 Flash one of the few 100B+ models that is practical to self-host on a single high-end GPU with quantization or 4 GPUs without.