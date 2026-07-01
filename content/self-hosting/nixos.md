---
slug: nixos
title: "NixOS Self-Hosting"
excerpt: "Reproducible, declarative AI infrastructure with NixOS — ideal for teams that want versioned system configurations and rollback safety."
category: "Operating System"
tags:
  - nixos
  - nix
  - reproducible
  - declarative
  - self-hosting
order: 10
last_verified: "2026-07-01"
---

# NixOS Self-Hosting

## Why NixOS for local AI

NixOS lets you describe an entire system — kernel, drivers, inference engines, agent services — in a single declarative file. Rollbacks are one command. Reproducing a setup on another machine is one copy. That matters when an agent stack has many moving parts: CUDA drivers, Python packages, model weights, and service configs.

## What NixOS simplifies

- **Reproducible environments.** The same `configuration.nix` builds the same system every time.
- **Atomic upgrades and rollbacks.** Test a driver or library update; roll back if inference breaks.
- **Declarative services.** Systemd units, environment variables, and secrets are defined in Nix.
- **Multiple CUDA or ROCm versions.** Nix can isolate driver and library versions per project.

## Typical configuration areas

- NVIDIA or AMD GPU drivers and container toolkit.
- Docker or Podman for running Ollama, vLLM, and agent containers.
- Python environments for LangChain, LlamaIndex, or OpenClaw.
- PostgreSQL with pgvector for agent memory.
- Reverse proxy with nginx or Caddy and ACME TLS.

## Tradeoffs

- **Learning curve.** NixOS has a different mental model than Debian or Ubuntu.
- **Package freshness.** Some bleeding-edge AI tools arrive in nixpkgs later than PyPI.
- **Community size.** Smaller community than Ubuntu; some hardware needs manual configuration.
- **Disk usage.** Multiple package versions can consume more storage.

## Best fit

Teams that value reproducibility and rollback safety over immediate convenience. Excellent for homelabs, research clusters, and regulated environments where every system change must be auditable.

## Related

- [Linux Self-Hosting](/self-hosting/linux)
- [NVIDIA-Based Self-Hosting](/self-hosting/nvidia-based)
- [AMD-Based Self-Hosting](/self-hosting/amd-based)
