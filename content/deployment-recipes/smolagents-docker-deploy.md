---
slug: smolagents-docker-deploy
title: Deploy smolagents with Docker Sandboxing
excerpt: Run HuggingFace's code-first agent framework with Docker-based code execution isolation — the safest local setup for agents that write Python as actions.
category: Deployment
tags:
  - smolagents
  - docker
  - sandboxing
  - code-agent
  - huggingface
  - security
order: 23
last_verified: "2026-08-05"
difficulty: Intermediate
estimated_time: "20 min"
---

# Deploy smolagents with Docker Sandboxing

## The promise

smolagents lets agents write Python code as their actions. That is powerful — code is more expressive than JSON tool calls. But running LLM-generated code on your machine is a security risk. This recipe sets up smolagents with Docker-based code execution, so the agent's generated code runs in an isolated container, not on your host.

## What you'll get

- smolagents installed in a virtual environment
- Docker as the code execution sandbox
- A working CodeAgent that can write and execute Python safely
- A tested setup with a real agent run

## Prerequisites

- Docker installed and running
- Python 3.10+
- An LLM endpoint (we use Ollama locally, but any OpenAI-compatible endpoint works)
- 4GB RAM minimum

## Step 1: Install smolagents

```bash
python -m venv smolagents-env
source smolagents-env/bin/activate
pip install "smolagents[toolkit]"
```

Verify installation:

```bash
python -c "import smolagents; print(smolagents.__version__)"
```

## Step 2: Ensure Docker is running

```bash
docker info
```

If this fails, start Docker:

```bash
sudo systemctl start docker
```

smolagents uses Docker to create ephemeral containers for code execution. Each agent run gets a fresh container. The container is destroyed after the run completes.

## Step 3: Set up a local model (Ollama)

If you do not already have Ollama running:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen3:8b
```

Verify Ollama is serving:

```bash
curl http://localhost:11434/v1/models | python -m json.tool
```

## Step 4: Create the agent script

Create `agent_docker.py`:

```python
import os
from smolagents import CodeAgent, WebSearchTool, OllamaModel

# Use local Ollama model — no API costs
model = OllamaModel(
    model_id="qwen3:8b",
    api_base="http://localhost:11434",
)

# Create agent with Docker sandboxing
agent = CodeAgent(
    tools=[WebSearchTool()],
    model=model,
    use_docker=True,  # This is the key line — code executes in Docker
    stream_outputs=True,
)

# Run a task that requires code execution
result = agent.run(
    "Calculate the factorial of 15 using Python, then tell me the result."
)

print(f"\nResult: {result}")
```

## Step 5: Run the agent

```bash
python agent_docker.py
```

You should see the agent write Python code to calculate the factorial, execute it in a Docker container, and return the result.

Expected output (abbreviated):

```
[Code execution in Docker container]
Result: The factorial of 15 is 1307674368000.
```

## Step 6: Test with a more complex task

Create `agent_research.py`:

```python
from smolagents import CodeAgent, WebSearchTool, OllamaModel

model = OllamaModel(
    model_id="qwen3:8b",
    api_base="http://localhost:11434",
)

agent = CodeAgent(
    tools=[WebSearchTool()],
    model=model,
    use_docker=True,
    stream_outputs=True,
)

# Task that requires web search + code execution
result = agent.run(
    "Search for the current population of Tokyo, "
    "then write Python code to calculate what percentage "
    "of Japan's total population that represents."
)

print(f"\nResult: {result}")
```

Run:

```bash
python agent_research.py
```

The agent should: search the web for Tokyo's population, search for Japan's total population, write Python code to calculate the percentage, execute it in Docker, and return the answer.

## Verification

Confirm the Docker sandbox is actually being used:

```bash
# While the agent is running, in another terminal:
docker ps
```

You should see a container running with a name like `smolagents-exec-XXXXX`. This is the ephemeral code execution container. It will disappear when the run completes.

Confirm no code runs on your host:

```bash
# Check that no Python subprocess was spawned on your host
# The agent's code should only run inside the Docker container
ps aux | grep python | grep -v agent_docker.py
```

If you see only the `agent_docker.py` process and no additional Python processes, the sandbox is working correctly.

## Troubleshooting

### "Docker not available" or "Docker daemon not running"

```bash
sudo systemctl status docker
sudo systemctl start docker
# Add your user to the docker group if permission denied
sudo usermod -aG docker $USER
# Log out and back in for group change to take effect
```

### "Model not found" with Ollama

```bash
ollama list  # Check available models
ollama pull qwen3:8b  # Pull if not present
```

### Agent generates broken code

This happens — the model writes Python with syntax errors or wrong imports. smolagents handles this by catching the error, feeding it back to the model, and asking for a corrected version. If it fails repeatedly, try a stronger model:

```python
model = OllamaModel(model_id="qwen3:32b", api_base="http://localhost:11434")
```

### Docker image pull is slow on first run

smolagents uses a Python Docker image for code execution. The first run pulls it. Subsequent runs use the cached image. If you have a slow connection, pre-pull:

```bash
docker pull python:3.11-slim
```

### "use_docker" not recognized

Ensure you have the latest smolagents:

```bash
pip install --upgrade "smolagents[toolkit]"
```

## Security notes

- Docker sandboxing isolates code execution but is not a complete security boundary. A determined attacker with a compromised model could attempt container escape. For high-risk scenarios, use E2B (cloud sandbox) or Modal instead of local Docker.
- Never run agents with `use_docker=False` on a machine with sensitive credentials (`~/.ssh`, `~/.aws`, API keys in environment variables). The LLM-generated code can read your filesystem.
- Mount only the directories the agent needs. Do not mount your home directory.

## Best fit

Developers who want to run smolagents locally with a real code execution sandbox without paying for cloud sandboxes like E2B. This setup is good for development, testing, and low-stakes production. For high-stakes or high-throughput production, use E2B or Modal sandboxes which provide stronger isolation and managed scaling.