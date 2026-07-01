---
slug: edge
title: "Single-Board Edge Self-Hosting"
excerpt: "Run small models and lightweight agents on Raspberry Pi, Orange Pi, and other edge boards for offline, low-power inference."
category: "Hardware"
tags:
  - edge
  - raspberry-pi
  - single-board
  - embedded
  - self-hosting
order: 11
last_verified: "2026-07-01"
---

# Single-Board Edge Self-Hosting

## Why run agents on the edge

Edge boards are cheap, quiet, and always on. They are not fast enough for frontier models, but they are perfect for narrow agents: sensor summarization, local voice commands, privacy-first transcription, and offline classification.

## What fits on edge hardware

- 1B–4B parameter language models.
- Image classification with quantized vision models.
- Wake-word and keyword spotting.
- Rule-based or small-model agents that orchestrate local sensors and actuators.

## Hardware options

| Board | Strength | Notes |
|-------|----------|-------|
| Raspberry Pi 5 | Ecosystem and community | 8GB RAM; good for 1B–3B models |
| Orange Pi 5 Plus | More RAM and cores | Up to 16GB; better for 4B models |
| NVIDIA Jetson Orin Nano | GPU-accelerated inference | Best for vision and small transformer models |
| Apple TV / Mac mini (idle) | Reuse existing hardware | Apple Silicon is efficient for small models |

## Software stack

- **Ollama** or **llama.cpp** for model inference.
- **MQTT** or **Node-RED** for sensor integration.
- **SQLite** or **Chroma** for local memory.
- **OpenClaw** or lightweight Python agents for orchestration.

## Tradeoffs

- **Limited context and capability.** Edge models are narrow by design.
- **Slow inference.** Quantization and small chips mean patience is required.
- **Storage constraints.** Model weights fill SD cards and eMMC quickly.
- **Cooling and power.** Some boards throttle under sustained load.

## Best fit

Home automation, offline privacy-sensitive tasks, sensor summarization, and prototypes that need to run without cloud dependency.

## Related

- [Local Model Agents Use Case](/use-cases/local-models)
- [Running Local Models for Agents](/guides/running-local-models-for-agents)
- [Linux Self-Hosting](/self-hosting/linux)
