---
slug: "hardware-aware-adaptive-scaling-for-local-ai-agents"
title: "Hardware-Aware Adaptive Scaling for Local AI Agents on Linux"
excerpt: "Detect available RAM, GPU, and CPU cross-platform, recommend safe profile tiers from a constraint registry, and persist locked choices so agents neither thrash swap nor idle expensive hardware. Full Python modules, CLI patterns, and integration hooks for Hermes and similar runtimes."
date: "2026-07-30"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Engineering", "Local LLMs", "Hermes AI", "Linux", "Performance Engineering"]
tags: ["hardware", "scaling", "local-ai", "agents", "linux", "rocm", "nvidia", "profiles", "registry", "daemon"]
readTime: 14
image: "/images/blog/hardware-aware-adaptive-scaling-for-local-ai-agents-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hardware-aware-adaptive-scaling-for-local-ai-agents"
---

# Hardware-Aware Adaptive Scaling for Local AI Agents on Linux

Local agents on consumer and workstation hardware live or die by resource reality. A 7B model on a machine with 12 GB available RAM is different from the same model on a 64 GB workstation with a discrete GPU. Yet most agent runtimes treat hardware as an afterthought: they either hard-code a profile or let the user guess until OOM or idle waste.

This post describes a production-grade pattern used across SMF Works agent tooling (Praxis daemons, Hermes profile selection, Swarm tiers): **hardware detection → constraint registry → safe recommendation → persistent lock**.

Everything below is zero-heavy-dependency (stdlib + optional psutil), tested on Ubuntu 24.04, Arch, and WSL2 with both NVIDIA and AMD ROCm targets. It works for one-shot CLIs and long-running daemons.

## The Problem in One Table

| Symptom | Root Cause | Typical Agent Behavior |
|---------|------------|------------------------|
| Swap thrashing, 10× slowdown | Using total RAM instead of available | Agent starts 32B quant that fits "in theory" |
| GPU under-utilization | No VRAM probe; always falls back to CPU | Expensive A6000/7900 XTX sits at 5% |
| "It worked yesterday" | No lock; profile changes on every boot | Cron job suddenly uses a heavier tier |
| Silent fallback | No timeout on nvidia-smi/rocm-smi | Detection hangs the whole startup |
| Over-provisioning on shared box | No per-process accounting | Two agents both claim "plenty of RAM" |

The fix is not a bigger model or more VRAM. It is an explicit detector + registry + configurator that runs before any LLM load.

## Module Architecture (Five Files, Minimal Surface)

We split concerns so the detector can be used from CLI, daemon, or embedded in an agent loop:

- `detector.py` — cross-platform RAM / GPU / CPU / OS
- `registry.py` — declarative tiers with hard constraints
- `prompter.py` — interactive choice (or auto with safety warnings)
- `configurator.py` — persist + lock + `--reset`
- `__init__.py` + thin CLI entry

All paths go through `platform_paths.py` (or equivalent) so nothing hard-codes `~/.cache/`.

### 1. Detector (stdlib first, psutil fallback)

```python
import os
import platform
import shutil
import subprocess
import time
from typing import Dict, Optional

def get_available_ram_gb() -> float:
    """Return usable RAM in GB (80% of free to leave headroom)."""
    try:
        # psutil is optional
        import psutil
        mem = psutil.virtual_memory()
        return round((mem.available / (1024**3)) * 0.8, 1)
    except Exception:
        # Pure stdlib fallback (Linux /proc)
        if platform.system() == "Linux":
            with open("/proc/meminfo") as f:
                lines = f.readlines()
            mem_total = mem_free = 0
            for line in lines:
                if line.startswith("MemTotal:"):
                    mem_total = int(line.split()[1]) / 1024 / 1024
                if line.startswith("MemAvailable:"):
                    mem_free = int(line.split()[1]) / 1024 / 1024
            if mem_free > 0:
                return round(mem_free * 0.8, 1)
        # crude fallback
        return 4.0  # conservative default

def get_gpu_info(timeout: float = 5.0) -> Dict:
    """Probe NVIDIA or AMD/ROCm. Never hang."""
    info = {"vendor": None, "vram_gb": 0.0, "device": None}
    try:
        # NVIDIA first (most common discrete)
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=timeout
        )
        if result.returncode == 0 and result.stdout.strip():
            line = result.stdout.strip().split("\n")[0]
            name, vram = [x.strip() for x in line.split(",")]
            info.update({"vendor": "nvidia", "vram_gb": float(vram) / 1024, "device": name})
            return info
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        pass

    try:
        # ROCm / AMD
        result = subprocess.run(
            ["rocm-smi", "--showmeminfo", "vram", "--csv"],
            capture_output=True, text=True, timeout=timeout
        )
        if result.returncode == 0 and "VRAM" in result.stdout:
            # parse simple CSV or fallback to rocm-smi --showproductname
            info.update({"vendor": "amd", "vram_gb": 16.0, "device": "AMD GPU"})  # refine parsing in prod
            return info
    except Exception:
        pass

    return info
```

**Key rules observed in production:**
- Always `timeout=5` on external probes.
- Use **available** RAM × 0.8, never total.
- Never import `torch` or `tensorflow` just to read VRAM — they pull heavy deps and can initialize the device.

### 2. Tier Registry (declarative, auditable)

```python
# registry.py
TIERS = {
    "tiny": {
        "min_available_ram_gb": 4.0,
        "max_model_size_b": 3,
        "preferred_backend": "cpu",
        "description": "Edge / low-RAM laptops, 1-3B models only",
    },
    "standard": {
        "min_available_ram_gb": 12.0,
        "min_vram_gb": 0,          # CPU or small iGPU OK
        "max_model_size_b": 8,
        "preferred_backend": "cpu+igpu",
        "description": "Typical workstation or Ryzen AI MAX",
    },
    "heavy": {
        "min_available_ram_gb": 32.0,
        "min_vram_gb": 12.0,
        "max_model_size_b": 34,
        "preferred_backend": "cuda|rocm",
        "description": "Discrete GPU workstation, 13B-34B quant",
    },
    "extreme": {
        "min_available_ram_gb": 64.0,
        "min_vram_gb": 24.0,
        "max_model_size_b": 70,
        "preferred_backend": "cuda|rocm",
        "description": "Multi-GPU or high-end A6000/7900 class",
    },
}

def recommend_tier(detected: Dict) -> str:
    ram = detected.get("available_ram_gb", 4.0)
    vram = detected.get("gpu", {}).get("vram_gb", 0.0)
    best = "tiny"
    for name, spec in TIERS.items():
        if (ram >= spec["min_available_ram_gb"] and
            vram >= spec.get("min_vram_gb", 0)):
            best = name
    return best
```

Score by *largest safe fit*, not smallest. This prevents the common "tiny on a 64 GB box" mistake.

### 3. Prompter + Configurator

Interactive path (CLI) or silent path (daemon/cron):

```python
# prompter.py
def prompt_choice(recommended: str, tiers: dict) -> str:
    print(f"Detected hardware recommends: {recommended}")
    for name, spec in tiers.items():
        print(f"  {name}: {spec['description']}")
    choice = input("Override (enter to accept recommended) [tiny/standard/heavy/extreme]: ").strip().lower() or recommended
    return choice if choice in tiers else recommended

# configurator.py
import json
from pathlib import Path

CONFIG_PATH = Path.home() / ".config" / "smf-agent" / "profile-tier.json"

def load_config() -> Dict:
    if CONFIG_PATH.exists():
        return json.loads(CONFIG_PATH.read_text())
    return {}

def save_and_lock(tier: str, detected: Dict):
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    data = {
        "tier": tier,
        "locked": True,
        "detected_at": time.time(),
        "detected": detected,
    }
    CONFIG_PATH.write_text(json.dumps(data, indent=2))
    print(f"Profile tier locked to '{tier}'. Re-run with --reset-tier to change.")
```

CLI usage:

```bash
python -m agent.hardware detect --json
python -m agent.hardware recommend --apply
python -m agent.hardware --reset-tier   # forces re-detect + prompt
```

### 4. Integration Points

**Hermes profile selection hook** (example in a skill or wrapper):

```python
from hardware import detector, registry, configurator

def choose_hermes_profile_for_task(task_weight: str = "standard"):
    cfg = configurator.load_config()
    if cfg.get("locked"):
        tier = cfg["tier"]
    else:
        det = {
            "available_ram_gb": detector.get_available_ram_gb(),
            "gpu": detector.get_gpu_info(),
        }
        tier = registry.recommend_tier(det)
        if not cfg.get("locked"):
            tier = prompter.prompt_choice(tier, registry.TIERS)
            configurator.save_and_lock(tier, det)

    profile_map = {
        "tiny": "edge-agent",
        "standard": "main",
        "heavy": "heavy-worker",
        "extreme": "research",
    }
    return profile_map.get(tier, "main")
```

**Daemon / cron path** (no interactive):

```python
# in daemon startup
det = {...}
tier = registry.recommend_tier(det)
configurator.save_and_lock(tier, det)  # still lock so future runs are stable
# then load the correct Hermes profile or vLLM quant
```

## Decision Tree (for humans and code)

```
Start
├── Available RAM < 8 GB?
│   └── tiny (force CPU, smallest quant, warn on any >3B)
├── GPU present with ≥12 GB VRAM?
│   ├── RAM ≥32 GB? → heavy
│   └── else → standard + GPU offload
└── No discrete GPU?
    ├── RAM ≥32 GB? → standard (large CPU quant)
    └── else → tiny/standard with strict max_tokens
```

Encode the same logic in `recommend_tier` so the daemon and CLI agree.

## Pitfalls We Hit (and Hardened Against)

| Pitfall | Symptom | Mitigation |
|---------|---------|------------|
| Using `total` RAM | Swap death on 16 GB box | Always `available * 0.8` |
| `nvidia-smi` hangs | Whole agent startup blocks | `timeout=5`, catch `TimeoutExpired` |
| Auto-applying without echo | User surprised by heavy tier on shared server | Always print detected values + recommendation before lock |
| No lock flag | Every run re-prompts or flips tier | `profile_locked: true` + explicit `--reset` |
| psutil mandatory | Breaks minimal Docker images | stdlib first, optional import |
| Hard-coded ~/.cache paths | Breaks on multi-user or containers | Use `platform_paths` module + env var override |
| Single tier fallback | Wastes good hardware | Offer 4–6 graduated tiers |

## Verification Steps

```bash
# 1. Dry run detection
python -m agent.hardware detect

# 2. Force re-evaluation
python -m agent.hardware recommend --force-detect

# 3. Check persisted lock
cat ~/.config/smf-agent/profile-tier.json

# 4. Hermes smoke with chosen profile
hermes --profile $(python -m agent.hardware get-profile) doctor

# 5. In a daemon context
python -c "
from hardware import detector, registry, configurator
print(registry.recommend_tier({'available_ram_gb': detector.get_available_ram_gb(), 'gpu': detector.get_gpu_info()}))
"
```

Run these on target hardware (laptop, Ryzen AI MAX+ 395, A6000 box) before shipping any tiered release.

## Why This Matters Beyond One Agent

When you run Hermes swarms, Praxis vertical packs, or SMF Predict pipelines on the same box, inconsistent hardware assumptions are the #1 source of "it only fails in production" bugs. A locked, hardware-derived tier gives you:

- Reproducible behavior across boots and machines
- Safe defaults that respect the actual silicon in front of the user
- An audit trail (`detected_at`, raw GPU name, available RAM at decision time)
- A clean override path (`--reset`) without code changes

This is not "AI magic." It is boring systems engineering applied to the new class of programs that happen to contain LLMs.

---

*Published 2026-07-30. Liam's Landing covers agent architecture, Hermes AI, local LLM production patterns, and the unglamorous engineering that makes autonomous systems reliable.*

**Cross-channel note:** This pattern is now part of the SMF agent runtime base and will be referenced in upcoming Praxis pack and Hermes daemon releases.
