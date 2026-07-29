---
slug: openrouter-multi-model-routing
title: Deploy Multi-Model Routing with OpenRouter and LiteLLM
excerpt: Set up a cost-optimized routing layer that sends routine tasks to cheap models and complex reasoning to frontier models — with automatic fallback and cost tracking.
category: Deployment
tags:
  - openrouter
  - litellm
  - model-routing
  - cost-optimization
  - api-gateway
  - agents
order: 22
last_verified: "2026-07-29"
difficulty: Intermediate
estimated_time: "30 min"
---

# Deploy Multi-Model Routing with OpenRouter and LiteLLM

## The promise

Running every agent task through a frontier model is expensive and often unnecessary. A routing layer lets you match each task to the model that handles it adequately at the lowest cost — routine lookups go to Qwen3.6-27B or Hy3 at $0.14/1M, complex reasoning goes to Claude Opus 4.8 at $25/1M. This recipe sets up LiteLLM as the routing gateway with OpenRouter as the multi-model backend, plus a simple Python classifier that makes routing decisions.

## What you'll get

- A LiteLLM proxy that exposes a single OpenAI-compatible endpoint
- A Python routing classifier that tags each request by complexity
- Cost tracking per request, broken down by model
- Automatic fallback if a model is unavailable
- A setup you can point any OpenAI-compatible agent at (Hermes, LangChain, custom scripts)

## Prerequisites

- Python 3.11+
- An OpenRouter API key (get one at openrouter.ai/keys)
- LiteLLM installed (`pip install litellm`)
- Docker (optional, for containerized deployment)

## Step 1: Install dependencies

```bash
pip install litellm
```

## Step 2: Configure LiteLLM with routing models

Create `litellm_config.yaml`:

```yaml
model_list:
  - model_name: cheap
    litellm_params:
      model: openrouter/qwen/qwen3.6-27b
      api_key: os.environ/OPENROUTER_API_KEY

  - model_name: mid-tier
    litellm_params:
      model: openrouter/tencent/hy3
      api_key: os.environ/OPENROUTER_API_KEY

  - model_name: frontier
    litellm_params:
      model: openrouter/anthropic/claude-opus-4.8
      api_key: os.environ/OPENROUTER_API_KEY

  - model_name: fallback
    litellm_params:
      model: openrouter/zhipuai/glm-5.2
      api_key: os.environ/OPENROUTER_API_KEY
```

## Step 3: Write the routing classifier

Create `router.py`:

```python
import re
from litellm import Router

# Initialize LiteLLM router with fallback chains
router = Router(
    model_list=[
        {"model_name": "cheap", "litellm_params": {"model": "openrouter/qwen/qwen3.6-27b"}},
        {"model_name": "mid-tier", "litellm_params": {"model": "openrouter/tencent/hy3"}},
        {"model_name": "frontier", "litellm_params": {"model": "openrouter/anthropic/claude-opus-4.8"}},
        {"model_name": "fallback", "litellm_params": {"model": "openrouter/zhipuai/glm-5.2"}},
    ],
    fallbacks=[
        {"cheap": ["mid-tier", "fallback"]},
        {"mid-tier": ["fallback", "frontier"]},
        {"frontier": ["fallback", "mid-tier"]},
    ],
)

COMPLEXITY_SIGNALS = [
    "debug", "architect", "design", "refactor", "optimize",
    "analyze", "compare", "evaluate", "reason", "decide",
    "multi-step", "coordinate", "orchestrat",
]

SIMPLE_SIGNALS = [
    "format", "summarize", "list", "count", "lookup",
    "extract", "convert", "translate", "rename",
]

def classify_task(prompt: str) -> str:
    """Classify a prompt's complexity and return the model name to route to."""
    prompt_lower = prompt.lower()

    complex_score = sum(1 for s in COMPLEXITY_SIGNALS if s in prompt_lower)
    simple_score = sum(1 for s in SIMPLE_SIGNALS if s in prompt_lower)

    # Long prompts tend to be more complex
    if len(prompt) > 3000:
        complex_score += 2

    if complex_score > simple_score + 1:
        return "frontier"
    elif complex_score > simple_score:
        return "mid-tier"
    else:
        return "cheap"

def route_request(prompt: str, system_prompt: str = ""):
    """Route a request to the appropriate model with fallback."""
    model_name = classify_task(prompt)
    print(f"Routing to: {model_name}")

    response = router.completion(
        model=model_name,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
    )

    # Log the routing decision and cost
    usage = response.usage
    print(f"Model used: {response.model}")
    print(f"Tokens: {usage.prompt_tokens} in / {usage.completion_tokens} out")

    return response

# Example usage
if __name__ == "__main__":
    import os
    os.environ["OPENROUTER_API_KEY"] = os.getenv("OPENROUTER_API_KEY", "")

    # Simple task → should route to cheap
    r1 = route_request("Format this list as a table: apples, oranges, bananas")
    print(r1.choices[0].message.content[:200])

    # Complex task → should route to frontier
    r2 = route_request("Analyze the architectural tradeoffs of microservices vs monolith for a team of 5 developers building a healthcare scheduling system. Consider deployment complexity, debugging, team autonomy, and regulatory compliance.")
    print(r2.choices[0].message.content[:200])
```

## Step 4: Run the router

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
python router.py
```

You should see routing decisions printed, with the simple task going to the cheap model and the complex task going to frontier.

## Step 5: Deploy as a proxy server

LiteLLM can run as a proxy server that any OpenAI-compatible client can hit:

```bash
litellm --config litellm_config.yaml --port 4000
```

Then point your agent at `http://localhost:4000/v1` as the base URL, using any of the configured model names (`cheap`, `mid-tier`, `frontier`, `fallback`).

## Step 6: Add cost tracking

Create `cost_tracker.py`:

```python
import json
from datetime import datetime

COST_LOG = "routing_costs.jsonl"

# Per-1M-token costs (OpenRouter as of July 2026)
MODEL_COSTS = {
    "qwen3.6-27b": {"input": 0.20, "output": 0.20},
    "hy3": {"input": 0.14, "output": 0.58},
    "claude-opus-4.8": {"input": 25.0, "output": 25.0},
    "glm-5.2": {"input": 0.80, "output": 3.0},
}

def log_cost(model_used: str, prompt_tokens: int, completion_tokens: int, task_type: str):
    model_key = model_used.split("/")[-1].lower()
    costs = MODEL_COSTS.get(model_key, {"input": 1.0, "output": 1.0})

    input_cost = (prompt_tokens / 1_000_000) * costs["input"]
    output_cost = (completion_tokens / 1_000_000) * costs["output"]
    total = input_cost + output_cost

    entry = {
        "timestamp": datetime.now().isoformat(),
        "model": model_used,
        "task_type": task_type,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "input_cost": round(input_cost, 6),
        "output_cost": round(output_cost, 6),
        "total_cost": round(total, 6),
    }

    with open(COST_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")

    return total
```

## Verification

```bash
# Test the proxy is running
curl http://localhost:4000/v1/models

# Test routing through the proxy
curl http://localhost:4000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "cheap", "messages": [{"role": "user", "content": "Summarize this in one line: AI is transforming how developers write code"}]}'
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| OpenRouter 401 errors | Check your API key is set and valid. OpenRouter keys start with `sk-or-v1-`. |
| Model not found errors | Verify the model slug exists on OpenRouter. Use `openrouter.ai/models` to find exact slugs. |
| Fallback not triggering | LiteLLM fallbacks require the model to return an error, not just poor quality. Check your fallback config syntax. |
| Costs higher than expected | The classifier may over-route to frontier. Review your COMPLEXITY_SIGNALS and adjust thresholds. |
| Latency spikes | The classification step adds one model call. Consider caching classification for repeated task types. |

## Honest notes

This is a keyword-based classifier, not an ML model. It works well for clear-cut cases but will misclassify edge cases. Cursor Router (Cursor's product) uses a trained classifier on 600K+ requests — that is a better approach if you have the traffic volume to train one. For a self-hosted setup with moderate volume, keyword routing plus manual tuning based on your cost logs is a practical starting point. Expect 30-50% cost reduction on mixed workloads, not 60% — that number assumes a classifier tuned on your specific traffic patterns.