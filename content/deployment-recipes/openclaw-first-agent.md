---
slug: openclaw-first-agent
title: Build Your First OpenClaw Agent
excerpt: Deploy a local OpenClaw agent on Linux, connect it to Ollama, and run your first tool-augmented task.
category: Agent Deployment
tags:
  - openclaw
  - ollama
  - linux
  - agent
  - local-llm
---

## What you'll get

A self-hosted OpenClaw agent running on your Linux machine. It will connect to a local Ollama model and run a simple tool so you can verify the full loop: prompt → model → tool → result → reply.

## Prerequisites

- Ubuntu 24.04 or another Linux distribution
- Ollama running locally with at least a 9B parameter model (see the [Ollama CUDA recipe](/deployment-recipes/ollama-ubuntu-cuda))
- Node.js 22+ and npm
- Git

## Step 1: Install the OpenClaw CLI

```bash
npm install -g openclaw
openclaw --version
```

If you prefer not to install globally, use `npx openclaw` instead of `openclaw` in the commands below.

## Step 2: Create an agent workspace

```bash
mkdir -p ~/openclaw-agents/first-agent
cd ~/openclaw-agents/first-agent
openclaw init
```

This creates:

```
first-agent/
  openclaw.json      # agent configuration
  tools/             # custom tool definitions
  memory/            # durable memory storage
  prompts/           # prompt templates
```

## Step 3: Configure the agent

Edit `openclaw.json`:

```json
{
  "agent": {
    "name": "first-agent",
    "model": "ollama/qwen3.5:9b",
    "systemPrompt": "You are a helpful Linux assistant. Use the available tools when needed."
  },
  "tools": {
    "registry": ["./tools"]
  },
  "memory": {
    "store": "./memory"
  }
}
```

Make sure the model name matches what Ollama serves:

```bash
ollama list
```

## Step 4: Add a simple tool

Create `tools/weather.js`:

```javascript
export const name = "get_weather";
export const description = "Get the current weather for a city.";
export const parameters = {
  type: "object",
  properties: {
    city: { type: "string", description: "City name" }
  },
  required: ["city"]
};

export async function run({ city }) {
  // For this recipe, return a mock result. In production, call wttr.in or a weather API.
  return {
    city,
    condition: "sunny",
    temperature_c: 22
  };
}
```

## Step 5: Run the agent

```bash
openclaw run "What is the weather in Boston?"
```

Expected flow:

1. OpenClaw sends your prompt to `qwen3.5:9b` via Ollama.
2. The model decides it needs weather data.
3. OpenClaw calls `get_weather({ city: "Boston" })`.
4. The result is returned to the model.
5. The model answers: "The weather in Boston is sunny and 22°C."

## Step 6: Verify the loop

Run with verbose logging:

```bash
OPENCLAW_LOG_LEVEL=debug openclaw run "What is 7 * 13?"
```

You should see:

- The raw model request
- Tool selection reasoning
- Tool output
- Final formatted answer

## Step 7: Add memory

By default, OpenClaw stores conversation context in `memory/`. Test it:

```bash
openclaw run "Remember that my favorite editor is Helix."
openclaw run "What is my favorite editor?"
```

The second response should recall "Helix."

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `model not found` | Run `ollama pull qwen3.5:9b` or update `openclaw.json` to match `ollama list`. |
| Tool is never called | Check the tool's `description` is specific. Add `required` to parameters. |
| High latency | Use a smaller model or enable GPU offload (see Ollama CUDA recipe). |
| Port connection error | Confirm Ollama is listening on `http://localhost:11434` with `curl http://localhost:11434/api/tags`. |

## Next step

Connect the agent to a real tool such as file search, GitHub issues, or a database. See the [OpenClaw skills documentation](https://docs.openclaw.ai) and the [Cline + local model recipe](/deployment-recipes/cline-local).
