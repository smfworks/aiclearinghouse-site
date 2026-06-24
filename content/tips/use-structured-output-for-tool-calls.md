---
slug: use-structured-output-for-tool-calls
title: Use Structured Output for Tool Calls
category: Workflow
excerpt: "Make your agent's tool calls strict, parseable, and predictable by forcing JSON schemas or structured output instead of free-form text."
tags:
  - structured-output
  - tool-calls
  - json-schema
  - agents
  - safety
order: 11
last_verified: 2026-06-24
---

# Use Structured Output for Tool Calls

## The free-form trap

It is tempting to let an agent emit tool arguments as natural language and parse them with regex or string splitting. That works in demos and breaks in production. Spaces, quotes, hallucinated keys, and unexpected formats turn into runtime errors or worse, silent misbehavior.

## What structured output means

For every tool the agent can call, define:

- A strict JSON Schema for the input.
- A matching response schema for what the tool returns.
- Parser validation that rejects malformed calls before they execute.

The model is instructed to produce only valid JSON that satisfies the schema. The agent layer validates it before invoking the tool.

## Why it matters

| Free-form | Structured |
|-----------|------------|
| Regex parsing breaks on edge cases | Schema validation is deterministic |
| Models invent argument names | Only declared fields are accepted |
| Type coercion is fragile | Types are enforced at parse time |
| Hard to test | Each schema is unit-testable |
| Security holes from prompt injection | Unexpected input is rejected |

## How to start

1. List every tool in your agent.
2. Write a JSON Schema for each tool's arguments.
3. Configure the model to use structured output or function calling with those schemas.
4. Validate every tool call against the schema before execution.
5. Return tool output in a schema the model expects.

## Example schema

```json
{
  "type": "object",
  "required": ["path", "operation"],
  "properties": {
    "path": {
      "type": "string",
      "description": "Absolute or relative file path inside the workspace."
    },
    "operation": {
      "type": "string",
      "enum": ["read", "write", "append"]
    },
    "content": {
      "type": "string",
      "description": "Required for write and append operations."
    }
  },
  "additionalProperties": false
}
```

## In OpenClaw / Hermes

OpenClaw skills are designed around clear input and output schemas. When you define a skill, specify its schema explicitly. The gateway validates tool calls before passing them to the skill implementation, so malformed calls fail fast instead of corrupting state.

## Quick win

Take your most-used tool, write a JSON Schema for it, and switch the agent from free-form to structured output. Run your test suite. Most bugs you find will be latent issues that free-form parsing was hiding.
