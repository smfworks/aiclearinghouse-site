---
slug: vllm-flat-model-deploy
title: Deploy vLLM with Flat Model Architecture
excerpt: Set up vLLM's new Flat Model abstraction for day-0 model support, faster cold starts, and the Model Runner V2 execution engine — the Q3 2026 production upgrade path.
category: Self-Hosting
tags:
  - vllm
  - docker
  - self-hosting
  - inference
  - production
  - flat-model
order: 99
last_verified: "2026-08-19"
difficulty: Advanced
estimated_time: "60 min"
---

# Deploy vLLM with Flat Model Architecture

## The promise

vLLM's Q3 2026 roadmap ships two major architectural upgrades: the **Flat Model** abstraction and **Model Runner V2 (MRV2)**. Flat Model simplifies the model integration layer so new models are supported day-0 without custom adapters. MRV2 replaces the legacy execution engine with a cleaner, more composable runner. Together, they reduce cold start time, improve production stability, and make day-0 model support the default rather than the exception.

This recipe deploys vLLM with Flat Model and MRV2 enabled, using a recent model as the test case.

## What you'll get

- vLLM running with Flat Model architecture and MRV2 execution engine
- Day-0 support for new model architectures without custom code
- Reduced cold start time vs. legacy V0 architecture
- OpenAI-compatible API endpoint
- Production-ready serving with improved failure ergonomics

## Prerequisites

- Docker and NVIDIA Container Toolkit installed
- GPU with at least 24GB VRAM (for a 13B-class model; more for larger)
- vLLM v0.10+ (Flat Model and MRV2 are rolling out across Q3 2026 — check the release notes for your version)

## Step 1: Pull the latest vLLM image

```bash
docker pull vllm/vllm-openai:latest
```

Check the release notes to confirm Flat Model and MRV2 are enabled in your version. If you need a nightly build:

```bash
docker pull vllm/vllm-openai:nightly
```

## Step 2: Run with Flat Model and MRV2

```bash
docker run -d \
  --name vllm-flat \
  --gpus all \
  -p 8000:8000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -e VLLM_USE_FLAT_MODEL=1 \
  -e VLLM_USE_MRV2=1 \
  --restart unless-stopped \
  vllm/vllm-openai:latest \
  --model meta-models/Muse-Glimmer-30B \
  --spec-type draft-dflash \
  --spec-draft-n-max 15 \
  --max-model-len 131072
```

Key flags:
- `VLLM_USE_FLAT_MODEL=1`: Enables the Flat Model abstraction
- `VLLM_USE_MRV2=1`: Enables Model Runner V2 execution engine
- `--spec-type draft-dflash`: Enables DFlash speculative decoding (Muse Glimmer ships with this drafter)
- `--max-model-len 131072`: Sets the context window to the model's full 131K

## Step 3: Verify the API

```bash
curl http://localhost:8000/v1/models
```

You should see the model listed. Test a completion:

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-models/Muse-Glimmer-30B",
    "messages": [{"role": "user", "content": "Write a Python function to check if a number is prime."}],
    "max_tokens": 200
  }'
```

## Step 4: Verify Flat Model is active

Check the server logs for Flat Model initialization:

```bash
docker logs vllm-flat 2>&1 | grep -i "flat model\|mrv2"
```

You should see confirmation that the Flat Model path and MRV2 runner are active.

## Step 5: Connect your agent stack

Point any OpenAI-compatible client at `http://localhost:8000/v1`:

- **Hermes Agent**: Set `OPENAI_API_BASE=http://localhost:8000/v1` in your `.env`
- **Open WebUI**: Set the model endpoint to `http://localhost:8000/v1`
- **LiteLLM Gateway**: Add as a custom provider

## Sanity checks

| Check | Command |
|-------|---------|
| Container running | `docker ps` |
| API up | `curl http://localhost:8000/v1/models` |
| Flat Model active | `docker logs vllm-flat 2>&1 \| grep -i flat` |
| MRV2 active | `docker logs vllm-flat 2>&1 \| grep -i mrv2` |
| GPU active | `docker exec vllm-flat nvidia-smi` |
| Speculative decoding | Check logs for draft token acceptance rate |

## Common gotchas

| Symptom | Fix |
|---------|-----|
| Flat Model not supported for your model | Not all architectures are migrated yet. Check the vLLM model support list. Q3 2026 target: top 20 architectures. |
| MRV2 missing features | MRV2 is newer than V0; some niche features may not be ported yet. Fall back to V0 with `VLLM_USE_MRV2=0` if needed. |
| Cold start still slow | Flat Model reduces but does not eliminate cold start. The Q3 roadmap also targets KV Cache Manager redesign and scheduler refactoring for further improvements. |
| DFlash drafter not found | Ensure the model ships with a drafter, or provide `--spec-model` with a compatible draft model. |
| Out of memory | Muse Glimmer 30B at full precision needs 55GB+. Use a quantized variant or a smaller model. |

## When to use this recipe

- You want day-0 support for new models without waiting for vLLM to add custom adapters
- You need reduced cold start time for autoscaling deployments
- You want the production stability improvements in the Q3 2026 roadmap
- You are deploying Muse Glimmer 30B or other recently released models with speculative decoding

## Next step

- Add [LiteLLM Proxy](/deployment-recipes/litellm-proxy-multi-provider) in front for multi-model routing
- Connect [Open WebUI](/deployment-recipes/open-webui) for a chat interface
- See the [vLLM Q3 2026 Roadmap](https://github.com/vllm-project/vllm/issues/48168) for the full list of architectural changes