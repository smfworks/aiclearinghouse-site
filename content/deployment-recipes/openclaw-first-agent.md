---
slug: openclaw-first-agent
title: Build Your First OpenClaw Agent
excerpt: Deploy a local OpenClaw agent on Linux or macOS, connect it to Ollama, and run your first tool-augmented task.
category: Agent Deployment
tags:
  - openclaw
  - ollama
  - linux
  - macos
  - agent
  - local-llm
  - open-source
order: 1
last_verified: 2026-06-15
difficulty: Intermediate
estimated_time: 45 min
---

# Build Your First OpenClaw Agent

## The promise

Most AI tools make you choose between convenience and control. OpenClaw refuses that trade-off. It is a personal AI assistant that runs on your own hardware, answers on the channels you already use, and keeps your conversations under your roof.

This recipe gives you a working local agent in under thirty minutes. You will install the CLI, point it at a local Ollama model, add one simple tool, and watch the full loop run: prompt → model → tool → result → reply.

## What you'll get

- The `openclaw` CLI installed and configured
- A dedicated agent workspace with model, tools, and memory
- One custom tool (`get_weather`) that the model can call
- A verified conversation that uses memory across prompts

## Prerequisites

- Ubuntu 24.04, another Linux distribution, or macOS 14+
- Ollama running locally with at least one 9B parameter model pulled (see [Ollama CUDA recipe](/deployment-recipes/ollama-ubuntu-cuda) if you need GPU setup)
- Node.js 24 (recommended) or Node.js 22.19+ and npm
- Git
- A terminal and willingness to edit one JSON file

## Step 1: Install the OpenClaw CLI

The fastest path is the install script. It handles Node, Git, and the workspace layout for you.

```bash
# Linux / macOS / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash
```

On Windows PowerShell:

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

Verify the install:

```bash
openclaw --version
```

You should see a version number, not a command-not-found error.

## Step 2: Run the onboarding wizard

```bash
openclaw onboard
```

The wizard asks:

- Local Gateway or remote host
- Model provider (choose **Ollama** for this recipe)
- Channels you want enabled (skip them for now — you can add Telegram, Discord, Slack later)
- Workspace location

For the fastest first chat without configuring channels:

```bash
openclaw dashboard
```

This opens the Control UI in your browser at `http://127.0.0.1:18789/`.

## Step 3: Create an agent workspace

OpenClaw keeps each agent in its own workspace. Create one for this recipe:

```bash
mkdir -p ~/.openclaw/agents/first-agent
cd ~/.openclaw/agents/first-agent
openclaw init
```

You should see a scaffold like this:

```
first-agent/
  openclaw.json      # agent configuration
  tools/             # custom tool definitions
  memory/            # durable memory storage
  prompts/           # prompt templates
```

## Step 4: Configure the agent

Edit `openclaw.json`:

```json
{
  "agent": {
    "name": "first-agent",
    "model": "ollama/qwen3.5:9b",
    "systemPrompt": "You are a helpful local assistant. Use the available tools when needed. Keep answers concise."
  },
  "tools": {
    "registry": ["./tools"]
  },
  "memory": {
    "store": "./memory"
  }
}
```

Make sure the model matches what Ollama serves on your machine:

```bash
ollama list
```

If you only pulled a different model, update the `model` field accordingly. Good starter models include `qwen3.5:9b`, `llama3.2:3b`, or `gemma2:9b`.

## Step 5: Add your first tool

Tools are what turn a chat model into an agent. Create `tools/weather.js`:

```javascript
export const name = "get_weather";
export const description = "Get the current weather for a city.";
export const parameters = {
  type: "object",
  properties: {
    city: { type: "string", description: "City name, e.g. Boston" }
  },
  required: ["city"]
};

export async function run({ city }) {
  // This recipe returns mock data so you can verify the loop.
  // In production, replace this with a real call to wttr.in or a weather API.
  return {
    city,
    condition: "sunny",
    temperature_c: 22,
    source: "mock"
  };
}
```

Save it. OpenClaw automatically discovers any `.js` or `.ts` file in `tools/`.

## Step 6: Run the agent

```bash
openclaw run "What is the weather in Boston?"
```

Expected flow:

1. OpenClaw sends your prompt to the local Ollama model.
2. The model recognizes it needs weather data.
3. OpenClaw calls `get_weather({ city: "Boston" })`.
4. The tool result is returned to the model.
5. The model answers: "The weather in Boston is sunny and 22°C."

If you see that answer, the agent loop is alive.

## Step 7: Turn on memory

Memory lets the agent recall things across separate conversations. OpenClaw stores session context in the `memory/` folder by default. Test it:

```bash
openclaw run "Remember that my favorite editor is Helix."
openclaw run "What is my favorite editor?"
```

The second response should recall "Helix." If it does, memory is working.

## Step 8: Inspect the loop with verbose logging

When something goes wrong, visibility is everything:

```bash
OPENCLAW_LOG_LEVEL=debug openclaw run "What is 7 * 13?"
```

You should see:

- The raw model request
- Tool selection reasoning
- Tool output
- Final formatted answer

## Step 9: Connect a real channel (optional)

Once the local loop works, add a messaging channel so you can talk to the same agent from anywhere:

```bash
openclaw channels add telegram
openclaw channels add discord
```

Each channel has its own setup prompts. For a private test, the web dashboard at `http://127.0.0.1:18789/` is the safest place to start.

## Sanity checks

| Check | Command |
|-------|---------|
| CLI installed | `openclaw --version` |
| Ollama running | `curl http://localhost:11434/api/tags` |
| Model available | `ollama list` |
| Agent config valid | `openclaw validate` |
| Tool discovered | `openclaw tools list` |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `model not found` | Run `ollama pull qwen3.5:9b` or update `openclaw.json` to match `ollama list`. |
| Tool is never called | Make the `description` specific. Confirm `parameters` includes `required`. |
| High latency / slow replies | Use a smaller quantized model, or enable GPU offload (see the Ollama CUDA recipe). |
| `command not found: openclaw` | Re-run the install script or add the npm global bin to your PATH. |
| Port connection error | Confirm Ollama is listening on `http://localhost:11434` with the curl check above. |

## Next steps

- Replace the mock weather tool with a real API call.
- Add a second tool for file search, GitHub issues, or web search.
- Read the [OpenClaw skills documentation](https://docs.openclaw.ai) to install community skills from ClawHub.
- Pair this with the [Cline + local model recipe](/deployment-recipes/cline-local) for IDE-based coding on the same Ollama backend.
