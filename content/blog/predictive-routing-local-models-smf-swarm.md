---
slug: "predictive-routing-local-models-smf-swarm"
title: "Predictive Routing with Local Models: How SMF Swarm Chooses Its Brain"
excerpt: "A field-tested look at model routing in SMF Swarm — how we match prediction questions to local and cloud models by confidence budget, domain, and available hardware, without leaking the call to a more expensive API than necessary."
date: "2026-07-07"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "SMF Swarm", "Local LLMs", "Engineering", "Model Routing"]
tags: []
readTime: 12
image: "/images/blog/predictive-routing-local-models-smf-swarm-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/predictive-routing-local-models-smf-swarm"
---

# Predictive Routing with Local Models: How SMF Swarm Chooses Its Brain

*Liam Hermes, Chief Development Officer — SMF Works*  
*July 7, 2026*

---

## The Routing Problem Nobody Talks About

Every agent framework has a routing problem, even if the README doesn't use that word. You ask the system a question. Somewhere downstream, a decision is made about which model answers it. Most of the time that decision is invisible: a default model, a hardcoded provider, or "whatever API key was set first." That works for chat. It does not work for prediction.

Prediction is different because the cost of a wrong model choice compounds. A small model hallucinates a probability and the rest of the pipeline treats it as ground truth. A large model is invoked for a trivial yes/no question and burns dollars for no gain. A cloud call is made when the local GPU is idle. A local model is forced onto a question that needs live web data it cannot access.

At SMF Works we run SMF Swarm as the prediction engine behind SMF Predict. The Swarm is open-source at `github.com/smfworks/smf-swarm`; the Hermes bridge that turns it into a product is our proprietary layer. This post is about the routing layer inside that bridge: how we choose which model, which mode, and which domain profile before a single token is generated.

The goal is simple: **route the question to the cheapest model that can confidently answer it, with a deterministic fallback chain when confidence is low.**

---

## What We Mean by "Routing"

Routing in SMF Swarm is not prompt engineering. It is a pre-flight decision based on:

| Signal | Why It Matters |
|--------|----------------|
| **Question type** | Yes/no, probability estimate, timeline, comparative, or causal |
| **Domain** | Financial, technology, political, or general |
| **Confidence budget** | How certain the answer needs to be before we charge for it |
| **Latency budget** | Standard (~8 min), debate (~18 min), or full (~60+ min) |
| **Hardware state** | Local GPU/ROCm availability, idle VRAM, CPU fallback headroom |
| **Model tier** | Small local, large local, or cloud reasoning |

These signals are evaluated in order. The first four are derived from the question itself. The last two come from the runtime environment. Together they produce a routing decision, not a model name. The decision is something like:

> "Finance probability question, medium confidence, standard latency, local large model available → route to `qwen3.6-235b-a3b` local. If confidence after first pass < 0.4, escalate to cloud reasoning with live data."

This is not magic. It is a scoring function with guardrails.

---

## From Question to Decision: The Parse Step

The first code that runs after receiving a prediction request is the question parser. It does not call any LLM. It uses lightweight heuristics — regex, keyword lists, and a small rule set — to classify the request. This keeps latency low and makes the decision reproducible.

```python
# smf_predict/router.py
import re
from dataclasses import dataclass
from enum import Enum, auto

class QuestionType(Enum):
    YES_NO = auto()
    PROBABILITY = auto()
    TIMELINE = auto()
    COMPARATIVE = auto()
    CAUSAL = auto()
    OPEN = auto()

class Domain(Enum):
    FINANCIAL = auto()
    TECHNOLOGY = auto()
    POLITICAL = auto()
    GENERAL = auto()

@dataclass
class RoutingSignals:
    qtype: QuestionType
    domain: Domain
    confidence_budget: float  # 0.0 - 1.0
    latency_budget: str       # "standard" | "debate" | "full"

KEYWORD_MAP = {
    Domain.FINANCIAL: ["stock", "price", "market", "earnings", "recession", "crypto", "fed", "rate"],
    Domain.TECHNOLOGY: ["model", "release", "chip", "gpu", "api", "llm", "open source", "benchmark"],
    Domain.POLITICAL: ["election", "bill", "vote", "policy", "president", "congress", "regulation"],
}

PROB_PATTERNS = [
    r"probability of",
    r"will\s+\w+\s+(likely|probably)",
    r"what are the odds",
    r"predict whether",
    r"chance that",
]

def classify_question(text: str) -> RoutingSignals:
    t = text.lower()

    # Question type
    if any(re.search(p, t) for p in PROB_PATTERNS):
        qtype = QuestionType.PROBABILITY
    elif re.search(r"will\s+\w+.*by\s+(\w+\s+\d{4}|\d{4})", t):
        qtype = QuestionType.TIMELINE
    elif re.search(r"(better than|vs\.?|versus|compare)", t):
        qtype = QuestionType.COMPARATIVE
    elif re.search(r"(because|cause|why|effect|impact)", t):
        qtype = QuestionType.CAUSAL
    else:
        qtype = QuestionType.YES_NO if t.strip().endswith("?") else QuestionType.OPEN

    # Domain
    domain = Domain.GENERAL
    for d, keywords in KEYWORD_MAP.items():
        if any(k in t for k in keywords):
            domain = d
            break

    # Confidence budget from phrasing
    confidence_budget = 0.5
    if any(k in t for k in ["exact", "precise", "quantify", "95%", "high confidence"]):
        confidence_budget = 0.85
    elif any(k in t for k in ["roughly", "best guess", "estimate", "lean"]):
        confidence_budget = 0.35

    # Latency budget from mode hint or default
    latency_budget = "standard"
    if "debate" in t or "ensemble" in t:
        latency_budget = "debate"
    elif "full" in t or "thorough" in t or "social validation" in t:
        latency_budget = "full"

    return RoutingSignals(qtype, domain, confidence_budget, latency_budget)
```

This classifier is intentionally dumb. It is fast, deterministic, and easy to audit. The interesting work happens after we have the signals.

---

## The Confidence Budget Is the Constraint

The most important routing input is the confidence budget. We derive it from language, but in practice we also let the caller override it. A question that asks "Will NVIDIA release a 512 GB HBM4 card in 2026?" does not need a 95% confidence answer; there is not enough public signal. Routing it to a massive reasoning model is waste. A question that asks "What is the probability that the S&P 500 closes higher in Q3 than Q2?" needs tighter calibration and probably live market data.

We map confidence budget to model tier like this:

| Confidence Budget | Typical Use | Default Model Tier |
|-------------------|-------------|--------------------|
| 0.0 - 0.4 | Gut check, directional lean | Small local (< 10B) |
| 0.4 - 0.7 | Informed estimate, comparison | Large local (30B - 235B A3B) |
| 0.7 - 0.9 | Calibrated probability, trend | Cloud reasoning + live data |
| 0.9+ | Hard science, audited fact | Cloud reasoning + multi-source validation |

The tiers are not model names. They are slots. On our local AMD box, "large local" might be `qwen3.6-235b-a3b` via Ollama cloud or vLLM with ROCm. On a CPU-only node it might be `qwen3-32b` at lower batch size. On a cloud call it might be a DeepSeek MoE or a strong reasoning model. The router does not hardcode names; it asks the runtime what is available.

---

## Discovering Local Capacity

The bridge calls a small hardware probe before routing. The probe is cross-platform, avoids importing PyTorch just to check VRAM, and times out quickly.

```python
# smf_predict/hardware.py
import shutil, subprocess, platform, json, os
from dataclasses import dataclass

@dataclass
class LocalCapacity:
    gpu_available: bool
    vram_gb: float
    free_ram_gb: float
    cpu_cores: int
    recommended_tier: str

def probe_local() -> LocalCapacity:
    free_ram = _free_ram_gb()
    cores = os.cpu_count() or 4
    vram, gpu = _rocm_vram_gb()
    if not gpu:
        vram, gpu = _nvidia_vram_gb()

    tier = "small_local"
    if gpu and vram >= 80:
        tier = "large_local"
    elif gpu and vram >= 24:
        tier = "medium_local"
    elif free_ram >= 32:
        tier = "cpu_large"

    return LocalCapacity(gpu, vram, free_ram, cores, tier)

def _free_ram_gb() -> float:
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemAvailable:"):
                    kb = int(line.split()[1])
                    return kb / 1_048_576
    except Exception:
        pass
    return 16.0

def _rocm_vram_gb() -> tuple[float, bool]:
    rocm = shutil.which("rocm-smi")
    if not rocm:
        return 0.0, False
    try:
        out = subprocess.run(
            [rocm, "--showmeminfo", "VRAM", "-d", "0", "--json"],
            capture_output=True, text=True, timeout=5
        )
        data = json.loads(out.stdout)
        free_mb = float(data.get("card0", {}).get("VRAM", {}).get("free", "0 MiB").split()[0])
        return free_mb / 1024, True
    except Exception:
        return 0.0, False

def _nvidia_vram_gb() -> tuple[float, bool]:
    nvidia = shutil.which("nvidia-smi")
    if not nvidia:
        return 0.0, False
    try:
        out = subprocess.run(
            [nvidia, "--query-gpu=memory.free", "--format=csv,noheader,nounits", "-i", "0"],
            capture_output=True, text=True, timeout=5
        )
        return float(out.stdout.strip()) / 1024, True
    except Exception:
        return 0.0, False
```

The probe intentionally uses `subprocess` with a 5-second timeout rather than importing a deep learning framework. Importing PyTorch or ROCm Python bindings just to read VRAM can take seconds and is fragile across driver versions. The probe returns a tier, not a model file path. The tier is matched against the model registry later.

---

## The Tier Registry

The registry is the bridge between abstract tiers and concrete models. It is environment-specific so that the same router code runs on a laptop, an AMD workstation, and a cloud node.

```python
# smf_predict/registry.py
from dataclasses import dataclass
from typing import Callable

@dataclass
class ModelSlot:
    tier: str
    name: str
    backend: str          # "ollama" | "vllm" | "openrouter" | ...
    context_k: int
    reasoning: bool
    requires_gpu: bool
    cost_rank: int        # lower is cheaper

TIER_REGISTRY: list[ModelSlot] = []

def default_registry() -> list[ModelSlot]:
    return [
        ModelSlot("small_local", "qwen3-4b", "ollama", 32, False, False, 1),
        ModelSlot("small_local", "qwen3-8b", "ollama", 32, False, False, 2),
        ModelSlot("medium_local", "qwen3-30b", "ollama", 64, False, True, 3),
        ModelSlot("medium_local", "qwen3.6-27b", "ollama", 128, False, True, 4),
        ModelSlot("large_local", "qwen3.6-235b-a3b", "ollama", 128, True, True, 5),
        ModelSlot("cloud_reasoning", "deepseek-v3-reasoner", "openrouter", 64, True, False, 6),
    ]

def select_model(signals: RoutingSignals, capacity: LocalCapacity,
                 registry: list[ModelSlot] | None = None) -> ModelSlot:
    reg = registry or default_registry()

    # Filter by tier match against capacity and confidence budget
    target_tiers = _tiers_for_budget(signals.confidence_budget, capacity.recommended_tier)
    candidates = [m for m in reg if m.tier in target_tiers]

    # Prefer reasoning for probability/causal/comparative questions
    if signals.qtype in {QuestionType.PROBABILITY, QuestionType.CAUSAL, QuestionType.COMPARATIVE}:
        reasoning = [m for m in candidates if m.reasoning]
        if reasoning:
            candidates = reasoning

    # Prefer local when available unless confidence demands cloud
    if capacity.gpu_available and signals.confidence_budget < 0.8:
        local = [m for m in candidates if m.backend != "openrouter"]
        if local:
            candidates = local

    # Pick cheapest remaining
    candidates.sort(key=lambda m: (m.cost_rank, -m.context_k))
    return candidates[0]

def _tiers_for_budget(budget: float, capacity_tier: str) -> list[str]:
    if budget >= 0.8:
        return ["cloud_reasoning", "large_local", "medium_local"]
    if budget >= 0.5:
        order = ["large_local", "medium_local", "cloud_reasoning"]
    else:
        order = ["small_local", "medium_local", "large_local", "cloud_reasoning"]
    # Reorder to prefer what hardware supports
    if capacity_tier in order:
        order.remove(capacity_tier)
        order.insert(0, capacity_tier)
    return order
```

The key design choice is that the registry is ordered by cost rank, but the router can promote or demote tiers based on signals. A probability question gets a reasoning model even if the confidence budget is low, because non-reasoning models are poor at calibration. A high-confidence question goes to cloud reasoning even if a large local model is idle, because the cost of a miscalibrated answer is higher than the API cost.

---

## Mode Selection: Standard, Debate, Full

After model selection, the router picks a pipeline mode. SMF Swarm supports `standard`, `debate`, and `full`. The bridge makes this choice explicit.

```python
# smf_predict/mode.py
from enum import Enum

class Mode(Enum):
    STANDARD = "standard"
    DEBATE = "debate"
    FULL = "full"

MODE_DEFAULTS = {
    Mode.STANDARD: {"models": 1, "adversarial": False, "social": False},
    Mode.DEBATE:   {"models": 3, "adversarial": True,  "social": False},
    Mode.FULL:     {"models": 5, "adversarial": True,  "social": True},
}

def select_mode(signals: RoutingSignals, selected: ModelSlot) -> Mode:
    # Respect explicit user latency budget first
    try:
        return Mode(signals.latency_budget)
    except ValueError:
        pass

    # High confidence + reasoning model → debate by default
    if signals.confidence_budget >= 0.65 and selected.reasoning:
        return Mode.DEBATE

    # Probability questions benefit from adversarial calibration
    if signals.qtype == QuestionType.PROBABILITY:
        return Mode.DEBATE

    return Mode.STANDARD
```

`debate` is our default in production because most prediction questions are either probability or comparative. The adversarial ensemble catches overconfidence. `standard` is reserved for yes/no questions where speed matters more than nuance. `full` is opt-in; the social validation layer adds latency and is only worth it when the question has a public signal we can verify.

---

## Putting It Together: The Router Pipeline

The full router pipeline is short and testable:

```python
# smf_predict/orchestrator.py
from smf_predict.router import classify_question
from smf_predict.hardware import probe_local
from smf_predict.registry import select_model, default_registry
from smf_predict.mode import select_mode

def route(query: str, mode_hint: str | None = None) -> dict:
    signals = classify_question(query)
    if mode_hint:
        signals.latency_budget = mode_hint

    capacity = probe_local()
    model = select_model(signals, capacity, default_registry())
    mode = select_mode(signals, model)

    return {
        "query": query,
        "signals": {
            "type": signals.qtype.name,
            "domain": signals.domain.name,
            "confidence_budget": signals.confidence_budget,
        },
        "capacity": {
            "tier": capacity.recommended_tier,
            "gpu": capacity.gpu_available,
            "vram_gb": capacity.vram_gb,
        },
        "route": {
            "model": model.name,
            "backend": model.backend,
            "mode": mode.value,
        },
    }
```

Example output:

```json
{
  "query": "What is the probability that the Fed cuts rates in Q3 2026?",
  "signals": {
    "type": "PROBABILITY",
    "domain": "FINANCIAL",
    "confidence_budget": 0.5
  },
  "capacity": {
    "tier": "large_local",
    "gpu": true,
    "vram_gb": 79.0
  },
  "route": {
    "model": "qwen3.6-235b-a3b",
    "backend": "ollama",
    "mode": "debate"
  }
}
```

This is the decision that gets handed to SMF Swarm. The Swarm then runs the actual prediction pipeline against that model and mode.

---

## Fallback Chains and Escalation

Routing is not one-shot. After the first pass, the bridge evaluates the result's confidence. If the Swarm returns a confidence below a threshold, the router escalates.

```python
# smf_predict/escalation.py
ESCALATION_MAP = {
    "small_local": "medium_local",
    "medium_local": "large_local",
    "large_local": "cloud_reasoning",
    "cloud_reasoning": None,  # terminal tier
}

def should_escalate(result: dict, signals: RoutingSignals) -> bool:
    confidence = result.get("confidence", 0.0)
    # Always escalate if below budget
    if confidence < signals.confidence_budget * 0.8:
        return True
    # Escalate probability answers with high variance
    if signals.qtype == QuestionType.PROBABILITY:
        if result.get("variance", 0.0) > 0.25:
            return True
    return False

def escalate(current: ModelSlot, registry: list[ModelSlot]) -> ModelSlot | None:
    next_tier = ESCALATION_MAP.get(current.tier)
    if not next_tier:
        return None
    candidates = [m for m in registry if m.tier == next_tier]
    candidates.sort(key=lambda m: m.cost_rank)
    return candidates[0] if candidates else None
```

The escalation budget is controlled. A prediction request may escalate at most twice before it either converges or returns a low-confidence disclaimer. This prevents runaway API spend on questions that genuinely lack signal.

---

## Cost Surface: Why This Matters in Production

Model routing is a cost problem dressed up as an accuracy problem. Our internal numbers on an AMD MI300X-class node look roughly like this for a single prediction:

| Model / Backend | Tokens | Wall Time | Marginal Cost |
|-----------------|--------|-----------|---------------|
| Qwen3-4B local | ~4K | 8s | $0.00 (energy only) |
| Qwen3.6-27B local | ~8K | 35s | $0.00 |
| Qwen3.6-235B-A3B local | ~12K | 90s | $0.00 |
| Cloud reasoning (OpenRouter) | ~16K | 120s | $0.08 - $0.40 |
| Full mode with social validation | ~40K | 300s+ | $0.50 - $2.00 |

For a product that runs hundreds of predictions per day, routing half of them to local models is the difference between a margin and a loss. The routing layer pays for itself by avoiding cloud calls when local capacity is sufficient.

---

## Hermes Bridge Integration

The Hermes-side skill invokes the router and then hands off to the Swarm. The skill code is thin:

```python
# skills/smf_predict/orchestrate.py (Hermes bridge)
from smf_predict.orchestrator import route
from smf_swarm import run_prediction

def predict(query: str, mode_hint: str | None = None) -> dict:
    decision = route(query, mode_hint)
    result = run_prediction(
        query=query,
        model=decision["route"]["model"],
        backend=decision["route"]["backend"],
        mode=decision["route"]["mode"],
    )

    if should_escalate(result, decision["signals"]):
        escalated = escalate_from(decision["route"]["model"])
        if escalated:
            result = run_prediction(
                query=query,
                model=escalated.name,
                backend=escalated.backend,
                mode="debate",
            )

    return format_report(result, decision)
```

The bridge is the proprietary layer. The Swarm is open source. The router is the boundary between them.

---

## What We Learned the Hard Way

A few practical lessons from running this in production:

1. **Do not let the LLM choose the model.** An LLM-based router is accurate on paper but slow, non-deterministic, and hard to debug. Rule-based classification plus deterministic scoring wins for routing.

2. **VRAM probes must timeout.** `nvidia-smi` and `rocm-smi` can hang on driver issues. A 5-second timeout keeps the router from blocking a prediction forever.

3. **Confidence budget is not accuracy target.** A user asking "will X happen?" is usually looking for a directional answer, not a calibrated probability. Budgeting too high wastes money and produces false precision.

4. **Escalation needs a cap.** Without a maximum escalation count, the system will keep buying more model in search of confidence that does not exist.

5. **Local first, but not local only.** There are questions — especially those needing live web data or deep reasoning — where cloud is correct. The router's job is to make that choice explicit, not ideological.

---

## A Decision Tree for Your Own Router

If you are building a similar system, the decision tree is:

1. **Classify the question** with fast heuristics.
2. **Set a confidence budget** from language or caller override.
3. **Probe hardware** for available local capacity.
4. **Select the cheapest tier** that satisfies budget and question type.
5. **Prefer reasoning** for probability, causal, and comparative questions.
6. **Run the prediction.**
7. **Measure confidence and variance.** Escalate if below budget, up to a cap.
8. **Return with the tier used** so the caller can audit the decision.

---

## What's Next

The current router is static: rules and thresholds are code. The next phase is dynamic threshold tuning based on outcome tracking. When a prediction resolves, we compare the Swarm's confidence to the actual outcome and adjust the routing thresholds for that domain. That makes the router better over time without changing the architecture.

If you want to use the open-source Swarm directly, start at `github.com/smfworks/smf-swarm`. The Hermes bridge is internal to SMF Works, but the routing principles in this post apply to any agent system that needs to choose a model wisely.

---

*Liam Hermes runs engineering at SMF Works and writes about agent architecture, local inference, and pragmatic software delivery.*
