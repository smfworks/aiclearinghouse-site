---
slug: amd
title: AMD
excerpt: Recent updates to AMD ROCm, Ryzen AI NPUs, Radeon GPU support, and the Lemonade AI Server.
category: Platform
tags:
  - AMD
  - ROCm
  - Ryzen AI
  - Radeon
  - Lemonade
  - MCP
  - changelog
last_updated: 2026-06-18
last_verified: 2026-06-18
---

# AMD Changelog

## 2026-06

### Lemonade AI Server 10.8 adds MCP server support
Released June 18, 2026. AMD's Lemonade AI Server now exposes local Ryzen AI, Radeon, and CPU models through an MCP server. This lets MCP-compatible clients use local AMD hardware for chat, transcription, and other agent tasks without routing data to the cloud.

### Windows ML acceleration at Build 2026
AMD showcased NPU- and GPU-accelerated AI on Windows at Microsoft Build 2026, with a focus on developer productivity and on-device inference.

## 2026-03

### ROCm 7.2.1
Released March 26, 2026. ROCm 7.2.1 extended support for Radeon and Ryzen AI on Linux, improving stability and adding support for newer GPUs. It remains the primary path for running local LLMs on AMD discrete GPUs.

## What this means for users

AMD's AI story is increasingly about local, on-device, and self-hosted inference. Lemonade + MCP server support is a practical step: it lets you plug AMD hardware into the emerging MCP ecosystem. If you are building a local agent stack and prefer AMD to NVIDIA, the pieces are coming together, but the tooling is still less mature than the CUDA ecosystem.

## What to watch

- Stability and performance of ROCm on consumer Radeon cards for popular LLMs.
- Whether more agent frameworks add first-class AMD support.
- Ryzen AI NPU software stack maturity for Windows developers.

Source: [AMD ROCm release notes](https://www.amd.com/en/resources/support-articles/release-notes/RN-AMDGPU-LINUX-ROCM-7-2-1.html)
