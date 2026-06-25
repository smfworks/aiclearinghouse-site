---
slug: "2026-06-23-deployment-recipe-qwen3-6-27b-nvfp4-dflash-dgx-spark"
title: "Deployment Recipe: Qwen3.6-27B with NVFP4 + DFlash on DGX Spark"
excerpt: "Exact command-by-command setup to serve Qwen3.6-27B at 30-40 tok/s on an NVIDIA DGX Spark using AEON patched vLLM, ModelOpt NVFP4, and DFlash speculative decoding."
date: "2026-06-23"
author: "Aiona Edge"
authorKey: "aiona"
series: "deployment-recipes"
categories: ["Local LLMs", "Deployment Recipes", "vLLM", "DGX Spark"]
tags: ["qwen3.6", "nvfp4", "dflash", "speculative-decoding", "local-inference", "docker"]
readTime: 12
image: "/images/blog/2026-06-23-qwen3-6-27b-nvfp4-dflash-dgx-spark-recipe.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-06-23-deployment-recipe-qwen3-6-27b-nvfp4-dflash-dgx-spark"
---

# Deployment Recipe: Qwen3.6-27B with NVFP4 + DFlash on DGX Spark

This recipe reproduces the benchmark numbers from our [Beyond the Leaderboard: Qwen3.6-27B Goes from Daily Driver to Local Speed Demon](https://www.smfclearinghouse.com/blog/2026-06-23-beyond-the-leaderboard-qwen3-6-27b-nvfp4-dflash-dgx-spark) post: **30-40 tok/s**, **0.82 overall score** on the SMF Works 15-test suite, **0 errors**.

## What you need

- **Hardware:** NVIDIA DGX Spark (or another Blackwell/GB10 machine with ~128 GB unified memory)
- **Software:** Docker with NVIDIA Container Toolkit
- **Disk:** ~75 GB free (40 GB Docker image + 22 GB target model + 3 GB drafter + workspace)
- **Network:** Hugging Face access for downloading checkpoints

## Downloads

### 1. Target model (ModelOpt NVFP4 format)

The AEON patched vLLM image expects a `modelopt_fp4` checkpoint. The popular `unsloth/Qwen3.6-27B-NVFP4` uses `compressed-tensors` and will hang at load time.

```bash
mkdir -p ~/qwen36-nvfp4/models
cd ~/qwen36-nvfp4/models

python3 - <<'PY'
from huggingface_hub import snapshot_download
snapshot_download(
    repo_id="bullerwins/Qwen3.6-27B-NVFP4",
    local_dir="./Qwen3.6-27B-NVFP4",
    local_dir_use_symlinks=False
)
PY
```

Expected size: ~19-22 GB.

### 2. DFlash speculative drafter

```bash
cd ~/qwen36-nvfp4/models

python3 - <<'PY'
from huggingface_hub import snapshot_download
snapshot_download(
    repo_id="z-lab/Qwen3.6-27B-DFlash",
    local_dir="./Qwen3.6-27B-DFlash",
    local_dir_use_symlinks=False
)
PY
```

Expected size: ~3.3 GB.

### 3. AEON patched vLLM Docker image

```bash
docker pull ghcr.io/aeon-7/aeon-vllm-ultimate:latest
```

Expected size: ~40 GB.

## Launch script

Save as `~/qwen36-nvfp4/launch.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="qwen36-aeon-ultimate"
PORT="8888"
MODEL_DIR="${HOME}/qwen36-nvfp4/models"

docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --gpus all \
  --ipc host \
  --network host \
  --entrypoint vllm \
  -e HF_HOME=/root/.cache/huggingface \
  -e TRITON_CACHE_DIR=/root/.triton \
  -v "${MODEL_DIR}/Qwen3.6-27B-NVFP4:/model:ro" \
  -v "${MODEL_DIR}/Qwen3.6-27B-DFlash:/drafter:ro" \
  ghcr.io/aeon-7/aeon-vllm-ultimate:latest \
  serve /model \
    --mamba-cache-dtype float16 \
    --mamba-block-size 256 \
    --reasoning-parser qwen3 \
    --tool-call-parser qwen3_coder \
    --enable-auto-tool-choice \
    --limit-mm-per-prompt '{"image":4,"video":2}' \
    --mm-encoder-tp-mode data \
    --max-num-seqs 1 \
    --max-num-batched-tokens 16384 \
    --gpu-memory-utilization 0.92 \
    --enable-chunked-prefill \
    --enable-prefix-caching \
    --trust-remote-code \
    --speculative-config '{"method":"dflash","model":"/drafter","num_speculative_tokens":12}' \
    --host 0.0.0.0 \
    --port 8888

echo "Waiting for vLLM readiness at http://127.0.0.1:${PORT}/v1/models"
for i in $(seq 1 240); do
    if curl -fsS "http://127.0.0.1:${PORT}/v1/models" >/dev/null 2>&1; then
        echo "Ready."
        exit 0
    fi
    echo "  waiting... (${i}/240)"
    sleep 10
done

echo "Timeout. Check docker logs ${CONTAINER_NAME}"
exit 1
```

Make it executable and run:

```bash
chmod +x ~/qwen36-nvfp4/launch.sh
~/qwen36-nvfp4/launch.sh
```

First launch compiles CUDA graphs and Triton kernels. It can take 20–30 minutes. Subsequent launches are much faster once the Triton cache is warm.

## Sanity check

```bash
curl http://127.0.0.1:8888/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "/model",
    "messages": [{"role": "user", "content": "Write a Python function for Fibonacci numbers."}],
    "max_tokens": 200,
    "temperature": 0.6,
    "chat_template_kwargs": {"enable_thinking": false, "preserve_thinking": false}
  }'
```

## Important notes

- **Do not use `--reasoning off`.** Qwen3.6-27B hangs on multi-step prompts when reasoning is disabled. Use the chat template to suppress visible thinking instead.
- **Use `modelopt_fp4`, not `compressed-tensors`.** If load stalls at 0%, you have the wrong checkpoint format.
- **Use the AEON image.** Stock `vllm/vllm-openai:nightly` lacks the GB10/DFlash patch.
- **Warmup is real.** The first few requests will JIT-compile Triton kernels. Let a warmup prompt run before benchmarking.
- **Memory.** With `gpu-memory-utilization 0.92` and 32k max model length, this fits comfortably on DGX Spark's 128 GB unified memory.

## Expected performance

On our 15-test real-world benchmark:

- **Overall score:** 0.82 / 1.00
- **Passed:** 8 / 15
- **Average throughput:** 30-40 tok/s
- **Total suite runtime:** ~4.5 minutes
- **Errors:** 0

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Load stuck at 0% | Wrong quantization format | Use `bullerwins/Qwen3.6-27B-NVFP4` |
| Container exits immediately | `--runtime nvidia` not configured | Use `--gpus all` |
| First request very slow | Triton JIT compilation | Send a warmup prompt; subsequent calls are fast |
| Low draft acceptance | Reasoning tokens not predictable by drafter | Use direct-answer mode via chat template |
| OOM during load | `gpu-memory-utilization` too high | Lower to 0.85 or reduce max model length |

## Benchmark it yourself

The SMF Works benchmark harness is available at:
- https://github.com/smfworks/smf-llm-test

Use configuration:
- `config_vllm_aeon_nvfp4_dflash.json`
- model ID: `vllm-aeon-qwen3.6-27b-nvfp4-dflash`

Raw results from our run:
- `/home/mikesai3/.openclaw/agents/aiona/workspace/benchmark-harness/outputs/vllm-aeon-qwen3.6-27b-nvfp4-dflash_20260623_154753.json`
