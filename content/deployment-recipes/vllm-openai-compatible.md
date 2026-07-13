---
slug: vllm-openai-compatible
title: Deploy vLLM as an OpenAI-Compatible Server
excerpt: Stand up vLLM with the OpenAI-compatible API so agents and tools can talk to open-weight models through a familiar base URL.
category: Model Serving
tags:
  - vllm
  - openai-compatible
  - gpu
  - inference
  - self-hosting
order: 17
last_verified: "2026-07-13"
difficulty: Intermediate
estimated_time: "35 min"
---

# Deploy vLLM as an OpenAI-Compatible Server

## The promise

Run an open-weight model behind an OpenAI-compatible `/v1/chat/completions` endpoint so Hermes, coding agents, and eval harnesses can swap models without rewriting clients.

## What you will get

- A local or server GPU process serving chat completions
- A base URL your agents can target (`http://host:8000/v1`)
- A path to run tool-eval-bench style suites against your stack

## Prerequisites

- NVIDIA GPU with recent drivers and CUDA stack matching vLLM docs
- Python environment able to install vLLM for your CUDA version
- Enough VRAM for the model + KV cache at your context length

## Steps

1. **Create an environment** dedicated to serving (do not mix with random notebooks).
2. **Install vLLM** following the current upstream install matrix for your CUDA version.
3. **Launch the server** with model id/path, host, and port. Prefer explicit max model length and GPU memory utilization flags so you do not OOM silently.
4. **Smoke test** with a curl chat completion using `model` equal to the served id.
5. **Point an agent client** at `base_url` + API key stub if required by the client library.

Example shape (adjust to current vLLM CLI):

```bash
# Illustrative — check `vllm serve --help` for your installed version
vllm serve <model-id-or-path> --host 0.0.0.0 --port 8000
```

```bash
curl http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"<model-id>","messages":[{"role":"user","content":"ping"}]}'
```

## Verification

- Health endpoint or successful chat completion
- Token generation latency acceptable for your agent loop
- Tool-call path tested if you will use function calling

## Troubleshooting

- **OOM:** lower max context, tensor parallel carefully, or pick a smaller quant
- **Client 404 model:** the `model` field must match the served model name
- **Slow first token:** expected for cold load; warm with a short prompt

## Honest notes

vLLM flags change between releases. Treat this recipe as the workflow, not a frozen flag list — always re-read upstream docs for your version.
