---
slug: building-agent-eval-pipelines-with-world-models
title: "Building Agent Evaluation Pipelines with World Models"
excerpt: "Use language world models as simulated environments to build scalable, low-cost agent evaluation pipelines — test thousands of trajectories without real API spend."
category: Guides
tags:
  - evaluation
  - world-models
  - testing
  - simulation
  - cost
  - benchmarking
order: 99
last_verified: "2026-07-22"
---

# Building Agent Evaluation Pipelines with World Models

## The problem

Agent evaluation is expensive. Running a single test trajectory against real APIs costs inference tokens plus tool API fees, takes seconds to minutes of latency, and is subject to rate limits. Running 1,000 trajectories for statistical confidence? Often infeasible.

Static mocks solve the cost problem but introduce a fidelity problem — mocks do not adapt to different agent actions, so they test only one path through the agent's decision tree. You get fast, cheap tests that miss real-world failure modes.

## The solution: world model simulators

Language world models — LLMs trained specifically to simulate agent environments — offer a third option. Instead of mocking tool responses, you train (or use a pre-trained) model to predict what the environment would return given any agent action. The simulator adapts to whatever the agent does, providing realistic-looking responses without real API costs.

## Architecture

```
Agent  →  Action  →  World Model Simulator  →  Predicted Response  →  Agent
                                    ↓
                            Evaluation Harness
                            (scores, logs, traces)
```

The agent does not know it is in a simulation. It sends actions, receives responses, and makes decisions exactly as it would in production. The evaluation harness observes the full trajectory and scores it.

## Step 1: Choose a world model

As of July 2026, **Qwen-AgentWorld-35B-A3B** is the most capable open-weight world model, covering seven domains:

- MCP (tool calling)
- Search
- Terminal
- SWE (software engineering)
- Android
- Web
- OS

If your agent operates in one of these domains, you can use Qwen-AgentWorld directly. For custom environments, you would need to fine-tune a world model on your environment's interaction logs.

## Step 2: Set up the simulator

Serve the world model with vLLM:

```bash
vllm serve Qwen/Qwen-AgentWorld-35B-A3B \
  --trust-remote-code \
  --max-model-len 262144 \
  --temperature 0.6 \
  --top-p 0.95 \
  --top-k 20
```

Use the domain-specific system prompts from the [Qwen-AgentWorld GitHub repository](https://github.com/QwenLM/Qwen-AgentWorld) for optimal simulation fidelity.

## Step 3: Wire your agent to the simulator

Replace your agent's real tool API calls with calls to the world model. The simplest approach: create a tool wrapper that sends the agent's action to the world model and returns the predicted response.

```python
class WorldModelTool:
    def __init__(self, world_model_url, domain_prompt):
        self.url = world_model_url
        self.system_prompt = domain_prompt

    def call(self, tool_name, params):
        response = requests.post(f"{self.url}/v1/chat/completions", json={
            "model": "Qwen-AgentWorld-35B-A3B",
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"Tool: {tool_name}\nParams: {json.dumps(params)}"}
            ],
            "max_tokens": 32768,
            "temperature": 0.6
        })
        return response.json()["choices"][0]["message"]["content"]
```

## Step 4: Define evaluation criteria

For each test scenario, define:

- **Task description** — what the agent should accomplish
- **Success criteria** — measurable outcomes (e.g., "correct tool selected," "task completed in < 10 steps," "no unsafe actions")
- **Failure modes to watch for** — specific things the agent should NOT do
- **Scoring rubric** — how to score partial success vs. full success vs. failure

Use an LLM judge (GPT-5.2 or similar) to score trajectories, similar to AgentWorldBench's five-dimensional rubric: Format, Factuality, Consistency, Realism, Quality.

## Step 5: Run at scale

Because the simulator is a local model, you can run many trajectories in parallel:

```bash
# Run 1000 trajectories in parallel
python eval.py batch \
  --scenarios scenarios.json \
  --simulator-url http://localhost:8000/v1 \
  --parallel 50 \
  --output results/
```

## Step 6: Validate against real APIs

Run 5-10% of your test scenarios against real APIs. Compare the results with the simulated results. If they diverge significantly, your world model may be hallucinating responses that real APIs would not return — adjust your system prompt or consider fine-tuning.

## Cost comparison

| Method | 1,000 trajectories | Latency/trajectory | Fidelity |
|--------|-------------------|-------------------|----------|
| Real APIs | $50-500+ | 10-60s | High |
| Static mocks | $0 | <1s | Low (one path) |
| World model sim | $5-20 (local compute) | 2-10s | Medium-High |

## Limitations and caveats

- **Simulator fidelity is not perfect.** The world model may predict responses that real APIs would never return. Always validate with spot-checks.
- **Domain coverage is limited.** Qwen-AgentWorld covers seven domains. Custom environments require custom world model training.
- **Compute requirements.** Running a 35B MoE model requires a serious GPU (or multi-GPU) setup.
- **Hallucination risk.** The world model can fabricate realistic-looking but incorrect tool responses. This is actually useful for testing agent error recovery, but dangerous if treated as ground truth.
- **Evaluation judge dependency.** Your scoring quality depends on the LLM judge you choose. A weak judge produces meaningless scores.