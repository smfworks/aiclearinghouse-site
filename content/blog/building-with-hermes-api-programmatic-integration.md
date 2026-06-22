---
slug: "building-with-hermes-api-programmatic-integration"
title: "Building with the Hermes API: Integrate AI Agents Into Your Applications"
excerpt: "Learn how to integrate Hermes AI into your own applications using its API. From authentication to tool calls, we'll build a working integration that leverages the full agent stack."
date: "2026-06-02"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Hermes AI", "Tutorial"]
tags: []
readTime: 10
image: "/images/blog/building-with-hermes-api-programmatic-integration.svg"
originalUrl: "https://smfworks.com/blog/building-with-hermes-api-programmatic-integration"
canonicalUrl: "https://www.smfclearinghouse.com/blog/building-with-hermes-api-programmatic-integration"
---
# Building with the Hermes API: Integrate AI Agents Into Your Applications

You've been using Hermes AI from the terminal. You've built skills, automated cron jobs, delegated to subagents. But there's another layer most developers miss: **Hermes has an API that lets you embed agents directly into your own applications.**

This isn't about calling OpenAI's API with a wrapper. Hermes exposes its full tool stack — terminal, file system, web search, subagent delegation — as programmatic endpoints you can invoke from your own code. Your app gets an agent that can actually *do* things, not just generate text.

This post walks through building a real integration. We'll cover authentication, tool registration, session management, and the patterns that separate a toy demo from production-grade agent infrastructure.

## What the Hermes API Actually Provides

Before we write code, let's clarify what we're working with. Hermes runs as a service that exposes its capabilities through several interfaces:

1. **Tool Registry** — The set of capabilities Hermes can use (terminal, file, web, vision, etc.)
2. **Session Management** — Stateful conversation contexts with history
3. **Delegate Task** — Subagent spawning for isolated work units
4. **Skill Loading** — Dynamically loaded instruction sets

The API isn't a single REST endpoint you POST to. It's a programmatic interface you access by importing Hermes modules and initializing an agent runtime. Think of it like embedding a database driver, not calling a remote service.

## Project Setup

Let's build a Python application that integrates Hermes. Create a new project:

```bash
mkdir hermes-integration-demo
cd hermes-integration-demo
python -m venv venv
source venv/bin/activate
pip install hermes-ai-client websockets asyncio
```

Your integration needs a `hermes.yaml` configuration file:

```yaml
# hermes.yaml
version: "1.0"

profile: default

providers:
  openai:
    api_key: ${OPENAI_API_KEY}
    default_model: gpt-4o-mini
    
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    default_model: claude-3-5-sonnet-20241022

toolsets:
  - terminal
  - file
  - web
  - vision

max_tokens: 4096
temperature: 0.1
```

Hermes uses this to know which models and tools are available. The environment variables keep secrets out of code.

## Your First Agent Integration

Create `agent_client.py`:

```python
#!/usr/bin/env python3
"""Minimal Hermes API integration example."""

import asyncio
import os
from hermes_client import HermesAgent, SessionConfig


async def main():
    """Run a single agent task and print the result."""
    # Initialize the agent with our config
    config = SessionConfig(
        profile="default",
        toolsets=["terminal", "file"],
        system_prompt="You are a code analysis agent. Be concise."
    )
    
    agent = HermesAgent(config)
    
    # Start a session (establishes tool registry and context)
    session = await agent.create_session()
    
    try:
        # Send a task to the agent
        result = await session.run_task(
            "Analyze the current directory structure and identify "
            "any Python files. List their names and sizes."
        )
        
        print("Agent Response:")
        print(result.content)
        
        if result.tool_calls:
            print(f"\nTools used: {len(result.tool_calls)}")
            for call in result.tool_calls:
                print(f"  - {call.tool}: {call.summary}")
                
    finally:
        await session.close()


if __name__ == "__main__":
    asyncio.run(main())
```

Run it:

```bash
export OPENAI_API_KEY="sk-..."
python agent_client.py
```

The output shows Hermes using the terminal tool to run `ls` and `stat`, then synthesizing the results:

```
Agent Response:
Found 3 Python files:
- agent_client.py (1.2KB)
- config_loader.py (890B)
- test_runner.py (2.1KB)

Tools used: 2
  - terminal: Listed directory and got file stats
```

## Streaming Responses for Real-Time UX

Production apps shouldn't wait for the entire response. Hermes supports streaming:

```python
#!/usr/bin/env python3
"""Streaming agent integration with progress updates."""

import asyncio
from hermes_client import HermesAgent, SessionConfig


async def stream_task():
    """Stream agent responses token by token."""
    config = SessionConfig(
        profile="default",
        toolsets=["terminal", "web"],
        streaming=True
    )
    
    agent = HermesAgent(config)
    session = await agent.create_session()
    
    try:
        # Stream the response as it's generated
        async for chunk in session.run_stream(
            "Search for the latest stable Node.js version, "
            "then check if it's installed locally."
        ):
            if chunk.type == "text":
                print(chunk.content, end="", flush=True)
            elif chunk.type == "tool_call":
                print(f"\n[Tool: {chunk.tool}] {chunk.summary}")
            elif chunk.type == "tool_result":
                print(f"[Result: {chunk.status}]")
                
    finally:
        await session.close()


if __name__ == "__main__":
    asyncio.run(stream_task())
```

The `run_stream` method yields chunks as they arrive. Your UI can display text as it generates, show progress when tools execute, and handle errors gracefully.

## Tool Registration: Extending the Agent

Your app probably has custom capabilities Hermes doesn't know about. You can register new tools:

```python
#!/usr/bin/env python3
"""Custom tool registration for application-specific capabilities."""

import asyncio
from hermes_client import HermesAgent, SessionConfig, Tool, ToolParameter


class DatabaseConnector:
    """Mock database connection for demo purposes."""
    
    def __init__(self):
        self.connected = False
        
    async def connect(self, host: str, database: str):
        self.connected = True
        return f"Connected to {database}@{host}"
        
    async def query(self, sql: str):
        return {"rows": [{"id": 1, "name": "test"}], "count": 1}


async def custom_tools_demo():
    """Register and use custom database tools."""
    db = DatabaseConnector()
    
    # Define custom tools that wrap your application code
    db_tools = [
        Tool(
            name="db_connect",
            description="Connect to the application database",
            parameters=[
                ToolParameter("host", "string", "Database host"),
                ToolParameter("database", "string", "Database name")
            ],
            handler=lambda **kwargs: db.connect(**kwargs)
        ),
        Tool(
            name="db_query",
            description="Execute a SQL query",
            parameters=[
                ToolParameter("sql", "string", "SQL statement")
            ],
            handler=lambda **kwargs: db.query(**kwargs)
        )
    ]
    
    config = SessionConfig(
        profile="default",
        toolsets=["terminal"],  # Built-in
        custom_tools=db_tools   # Your additions
    )
    
    agent = HermesAgent(config)
    session = await agent.create_session()
    
    try:
        result = await session.run_task(
            "Connect to the production database at db.prod.internal "
            "and count how many users signed up today."
        )
        
        print(result.content)
        # Hermes will chain db_connect → db_query automatically
        
    finally:
        await session.close()


if __name__ == "__main__":
    asyncio.run(custom_tools_demo())
```

Custom tools follow the same schema as built-ins. The agent receives their definitions in the system prompt and can invoke them just like `terminal()` or `file()`. This is how you bridge Hermes to your internal APIs, databases, and services.

## Subagent Delegation from Code

One of Hermes' most powerful features is spawning isolated subagents. You can do this programmatically too:

```python
#!/usr/bin/env python3
"""Programmatic subagent delegation for parallel task execution."""

import asyncio
from hermes_client import HermesAgent, SessionConfig, SubagentTask


async def parallel_code_review(file_list):
    """Delegate code review to multiple subagents in parallel."""
    config = SessionConfig(
        profile="default",
        toolsets=["file"],
        system_prompt="You are a code reviewer. Check for bugs, style issues, and security concerns. Be specific."
    )
    
    agent = HermesAgent(config)
    parent_session = await agent.create_session()
    
    try:
        # Create a subagent task for each file
        tasks = [
            SubagentTask(
                goal=f"Review {filename} for issues",
                context={"file": filename, "project_type": "python"},
                toolsets=["file", "web"],
                timeout=120
            )
            for filename in file_list
        ]
        
        # Spawn all subagents and wait for results
        print(f"Delegating {len(tasks)} code reviews...")
        results = await parent_session.delegate_parallel(tasks)
        
        # Aggregate results
        for i, result in enumerate(results, 1):
            print(f"\n--- Review {i} ---")
            print(f"File: {result.context['file']}")
            print(f"Status: {result.status}")
            print(f"Issues found: {result.summary}")
            if result.output:
                print(f"Details: {result.output[:200]}...")
                
        return results
        
    finally:
        await parent_session.close()


if __name__ == "__main__":
    files = ["src/api.py", "src/models.py", "src/utils.py"]
    asyncio.run(parallel_code_review(files))
```

The key insight: subagents aren't threads or processes. They're fresh agent instances with isolated context windows. You can spawn 10, review 10 files in parallel, and aggregate the summaries. Each subagent only sees its assigned file, so you don't burn tokens loading unrelated code.

## Session Persistence and Memory

Real applications need persistence. Hermes sessions can be serialized:

```python
#!/usr/bin/env python3
"""Session persistence for long-running conversations."""

import asyncio
import json
from hermes_client import HermesAgent, SessionConfig


async def persistent_session_demo():
    """Save and resume agent sessions."""
    
    # Phase 1: Initial conversation
    config = SessionConfig(profile="default", toolsets=["terminal", "file"])
    agent = HermesAgent(config)
    session = await agent.create_session()
    
    await session.run_task(
        "Analyze the project structure and identify the main entry point. "
        "Remember this for future questions."
    )
    
    # Save session state (includes conversation history, tool results)
    session_data = await session.serialize()
    with open("session_backup.json", "w") as f:
        json.dump(session_data, f)
    
    await session.close()
    print("Session saved.")
    
    # Phase 2: Resume later (maybe in a different process)
    with open("session_backup.json") as f:
        restored_data = json.load(f)
    
    new_session = await agent.restore_session(restored_data)
    
    # This question builds on previous context
    result = await new_session.run_task(
        "Based on your earlier analysis, what changes would improve "
        "the project's test coverage?"
    )
    
    print(result.content)
    # The agent remembers the project structure from the first phase
    
    await new_session.close()


if __name__ == "__main__":
    asyncio.run(persistent_session_demo())
```

Serialized sessions include:
- Conversation history
- Tool call results
- File contents read during the session
- Loaded skills and their instructions

This lets you build applications where users pick up conversations hours later, or distribute work across multiple processes.

## Error Handling and Recovery

Production integrations need robust error handling:

```python
#!/usr/bin/env python3
"""Production-grade error handling for agent integrations."""

import asyncio
from hermes_client import (
    HermesAgent, SessionConfig,
    ToolError, ModelError, TimeoutError, TokenLimitError
)


async def resilient_agent_task():
    """Execute agent task with comprehensive error handling."""
    config = SessionConfig(
        profile="default",
        toolsets=["terminal", "file", "web"],
        max_retries=3,
        retry_delay=2.0
    )
    
    agent = HermesAgent(config)
    session = await agent.create_session()
    
    try:
        try:
            result = await session.run_task(
                "Deploy the application to staging and run smoke tests",
                timeout=300
            )
            
            if result.error:
                print(f"Agent reported error: {result.error}")
                # Agent may have attempted recovery
                
            return result
            
        except ToolError as e:
            # Tool execution failed (e.g., command not found)
            print(f"Tool error: {e.tool} - {e.message}")
            # Fallback: try alternative approach
            
        except ModelError as e:
            # LLM API failure
            print(f"Model error: {e.provider} - {e.code}")
            # Fallback: retry with different provider
            
        except TimeoutError:
            # Task exceeded time limit
            print("Task timeout - checking partial results...")
            partial = await session.get_partial_result()
            return partial
            
        except TokenLimitError as e:
            # Context window exceeded
            print(f"Token limit: {e.used}/{e.max}")
            # Recover by summarizing and continuing
            await session.compress_context()
            result = await session.run_task("Continue where we left off")
            return result
            
    finally:
        await session.close()


if __name__ == "__main__":
    result = asyncio.run(resilient_agent_task())
```

Different errors need different strategies. Tool errors might require fallback commands. Model errors might need provider switching. Token limits need context compression. Build these patterns into your integration layer.

## Web Framework Integration (FastAPI Example)

Here's how to embed Hermes in a real web application:

```python
#!/usr/bin/env python3
"""FastAPI endpoint with streaming agent responses."""

from fastapi import FastAPI, WebSocket
from fastapi.responses import StreamingResponse
from hermes_client import HermesAgent, SessionConfig
import asyncio
import json

app = FastAPI()


@app.post("/api/agent/query")
async def query_agent(request: dict):
    """HTTP endpoint for synchronous agent queries."""
    config = SessionConfig(
        profile="default",
        toolsets=request.get("toolsets", ["terminal"]),
        timeout=request.get("timeout", 60)
    )
    
    agent = HermesAgent(config)
    session = await agent.create_session()
    
    try:
        result = await session.run_task(request["query"])
        
        return {
            "response": result.content,
            "tools_used": [t.tool for t in result.tool_calls],
            "duration_ms": result.duration_ms
        }
    finally:
        await session.close()


@app.websocket("/ws/agent")
async def agent_websocket(websocket: WebSocket):
    """WebSocket for real-time agent interaction."""
    await websocket.accept()
    
    config = SessionConfig(
        profile="default",
        toolsets=["terminal", "file", "web"],
        streaming=True
    )
    
    agent = HermesAgent(config)
    session = await agent.create_session()
    
    try:
        while True:
            message = await websocket.receive_json()
            
            if message["type"] == "query":
                async for chunk in session.run_stream(message["content"]):
                    await websocket.send_json({
                        "type": chunk.type,
                        "content": chunk.content,
                        "tool": getattr(chunk, "tool", None)
                    })
                    
            elif message["type"] == "clear":
                await session.reset_context()
                await websocket.send_json({"type": "cleared"})
                
    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})
    finally:
        await session.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

This gives you:
- `
POST /api/agent/query` — One-shot agent queries
- `WebSocket /ws/agent` — Real-time streaming with session continuity

The WebSocket maintains a persistent session. Users can ask follow-up questions, reference previous tool results, and see responses stream in token-by-token.

## Deployment Patterns

For production, you'll want to containerize:

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY hermes.yaml .
COPY src/ ./src/

ENV HERMES_PROFILE=default
EXPOSE 8000

CMD ["python", "-m", "src.server"]
```

And a docker-compose for local development:

```yaml
# docker-compose.yml
version: "3.8"
services:
  hermes-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./hermes.yaml:/app/hermes.yaml
      - ./skills:/app/skills:ro
```

The key constraint: Hermes needs access to your tool dependencies. If you're using the terminal tool, the container needs the right shell. If you're using vision, it needs image processing libraries. Build lean images that include only the tools your use case requires.

## Monitoring and Observability

Production agents need telemetry. Add OpenTelemetry integration:

```python
#!/usr/bin/env python3
"""Instrumented agent client with OpenTelemetry."""

import asyncio
from hermes_client import HermesAgent, SessionConfig
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Setup tracing
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)
otlp_exporter = OTLPSpanExporter(endpoint="http://jaeger:4317")
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)


async def traced_agent_task():
    """Agent task with full observability."""
    with tracer.start_as_current_span("agent_session") as session_span:
        config = SessionConfig(
            profile="default",
            toolsets=["terminal", "file"],
            streaming=True
        )
        
        agent = HermesAgent(config)
        session = await agent.create_session()
        
        session_span.set_attribute("session.id", session.id)
        session_span.set_attribute("toolsets", ",".join(config.toolsets))
        
        try:
            with tracer.start_span("task_execution") as task_span:
                async for chunk in session.run_stream(
                    "Find all TODO comments in the codebase"
                ):
                    if chunk.type == "tool_call":
                        with tracer.start_span("tool_execution") as tool_span:
                            tool_span.set_attribute("tool.name", chunk.tool)
                            tool_span.set_attribute("tool.params", str(chunk.params))
                            # Chunk will complete when tool finishes
                            
                    elif chunk.type == "text":
                        task_span.set_attribute("output.tokens", chunk.token_count)
                        
                task_span.set_status(Status(StatusCode.OK))
                
        finally:
            session_span.set_attribute("total.tool_calls", len(session.tool_history))
            await session.close()


if __name__ == "__main__":
    asyncio.run(traced_agent_task())
```

This gives you distributed traces showing exactly where time is spent — model generation vs tool execution vs context serialization. Essential for optimizing production agent performance.

## Anti-Patterns to Avoid

I've hit these myself. Learn from my mistakes:

**1. Don't recreate sessions for every request**

```python
# BAD - 500ms overhead per call
for query in queries:
    session = await agent.create_session()  # Expensive!
    result = await session.run_task(query)
    await session.close()

# GOOD - Reuse sessions with context reset
session = await agent.create_session()
for query in queries:
    result = await session.run_task(query)
    await session.reset_context()  # Cheap
await session.close()
```

**2. Don't ignore token limits**

Track context usage. Compress or truncate when approaching limits. Don't let the model error mid-task.

**3. Don't expose unrestricted terminal access**

If your web app uses the terminal tool, sandbox it. Restrict commands. Whitelist allowed paths. This is code execution, not text generation.

**4. Don't forget to close sessions**

Sessions hold resources — file handles, memory, temp files. Always use `try/finally` or async context managers.

**5. Don't serialize sensitive data**

Session exports include conversation history and tool outputs. Don't persist API keys or user data in session backups without encryption.

## Putting It Together: A Real Integration

Here's a complete pattern I use at SMF Works — an autonomous deployment agent:

```python
#!/usr/bin/env python3
"""Production deployment agent integration."""

import asyncio
import logging
from hermes_client import HermesAgent, SessionConfig, SubagentTask
from typing import Dict, List

logger = logging.getLogger(__name__)


class DeploymentAgent:
    """Hermes-powered deployment automation."""
    
    def __init__(self):
        self.config = SessionConfig(
            profile="production",
            toolsets=["terminal", "file"],
            system_prompt="""You are a deployment agent. You:
1. Run tests before deploying
2. Check for migration requirements
3. Deploy in stages (canary → full)
4. Verify health after each stage
5. Rollback on failure

Be methodical. Never skip verification."""
        )
        
    async def deploy(self, service: str, version: str) -> Dict:
        """Execute full deployment workflow."""
        agent = HermesAgent(self.config)
        session = await agent.create_session()
        
        try:
            # Phase 1: Pre-deployment checks
            checks = await self._run_checks(session, service)
            if not checks["pass"]:
                return {"status": "failed", "phase": "pre_check", "errors": checks["errors"]}
            
            # Phase 2: Deploy to canary
            canary = await self._deploy_canary(session, service, version)
            if not canary["healthy"]:
                return {"status": "failed", "phase": "canary", "errors": canary["errors"]}
            
            # Phase 3: Full deployment
            full = await self._deploy_full(session, service, version)
            return full
            
        finally:
            await session.close()
    
    async def _run_checks(self, session, service: str) -> Dict:
        """Spawn subagents for parallel pre-deployment checks."""
        checks = [
            SubagentTask(goal=f"Run tests for {service}"),
            SubagentTask(goal=f"Check database migrations for {service}"),
            SubagentTask(goal=f"Verify dependencies for {service}")
        ]
        
        results = await session.delegate_parallel(checks)
        
        errors = [r.summary for r in results if r.status != "success"]
        return {"pass": len(errors) == 0, "errors": errors}
    
    async def _deploy_canary(self, session, service: str, version: str) -> Dict:
        """Deploy to 5% of traffic, monitor health."""
        result = await session.run_task(
            f"Deploy {service}:{version} to canary pool, "
            "run health checks for 2 minutes, report status"
        )
        
        healthy = "healthy" in result.content.lower()
        return {"healthy": healthy, "output": result.content}
    
    async def _deploy_full(self, session, service: str, version: str) -> Dict:
        """Deploy to full production."""
        result = await session.run_task(
            f"Roll out {service}:{version} to production, "
            "verify all instances healthy"
        )
        
        success = "completed" in result.content.lower()
        return {
            "status": "success" if success else "failed",
            "version": version,
            "output": result.content
        }


# Usage
async def main():
    deployer = DeploymentAgent()
    result = await deployer.deploy("api-service", "v2.3.1")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
```

This agent:
- Runs parallel pre-deployment checks via subagents
- Deploys gradually with health verification
- Handles failures gracefully
- Tracks every phase with structured output

It's not magic. It's methodical automation with an agent that can reason about each step.

## Summary

The Hermes API gives you programmatic access to the same capabilities you use interactively. Key takeaways:

1. **Sessions are stateful** — Create them sparingly, reuse with context resets
2. **Tool registration bridges your app** — Expose internal APIs as agent-callable functions
3. **Subagents enable parallelism** — Delegate isolated tasks, aggregate results
4. **Streaming improves UX** — Don't make users wait for full responses
5. **Error handling is essential** — Production agents fail; your code recovers
6. **Observability matters** — Trace execution, track token usage, monitor costs

The Hermes API isn't a black box service you call. It's an agent runtime you embed. Treat it like infrastructure — configure it carefully, monitor it closely, and it becomes the backbone of autonomous operations in your applications.

*This post is part of Liam's Landing — engineering deep-dives on building with AI agents. For more on Hermes configuration, check out [Building Custom Skills](/blog/building-custom-hermes-ai-skills). For automation patterns, see [Cron Jobs](/blog/automate-your-dev-life-with-hermes-ai-cron-jobs) and [Terminal Workflows](/blog/terminal-automation-workflows-hermes-ai).*
