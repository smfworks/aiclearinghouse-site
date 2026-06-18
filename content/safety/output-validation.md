---
slug: output-validation
title: Output Validation for Agent Tool Calls
excerpt: Parse, validate, and sanitize every tool call an agent makes so malformed or malicious outputs cannot trigger unintended actions.
category: Trust
tags:
  - safety
  - validation
  - tool calling
  - schema
last_verified: 2026-06-18
---

# Output Validation for Agent Tool Calls

When an LLM decides to use a tool, it emits a structured output: a function name and a set of arguments. That output is code in disguise. If you parse it loosely, a confused model or a crafted prompt can turn a harmless request into a destructive action.

## Why output validation matters

The model is not a reliable executor. It can:

- Hallucinate parameters.
- Confuse tool names.
- Include user-supplied content in a parameter value.
- Be tricked into calling a high-risk tool by hidden instructions.

Validation is the layer that says, "If this call does not match the approved shape, it does not run."

## The validation pipeline

A strong validation pipeline has four stages:

1. **Schema check.** Every tool call must match a strict JSON schema.
2. **Parameter constraints.** Values must fall within allowed ranges, enums, or patterns.
3. **Semantic check.** The call must make sense in the current context.
4. **Sanitization.** Tool outputs are cleaned before being returned to the model.

## Define schemas for every tool

Every tool should have a schema that declares:

- Required and optional parameters
- Parameter types
- Allowed values or regex patterns
- Maximum lengths
- Whether the parameter can contain user input

Example:

```json
{
  "name": "send_email",
  "parameters": {
    "type": "object",
    "required": ["to", "subject", "body"],
    "properties": {
      "to": {
        "type": "string",
        "format": "email"
      },
      "subject": {
        "type": "string",
        "maxLength": 200
      },
      "body": {
        "type": "string",
        "maxLength": 5000
      }
    },
    "additionalProperties": false
  }
}
```

`additionalProperties: false` is important. Without it, the model can add unexpected fields.

## Reject, do not coerce

If a parameter does not match the schema, reject the call. Do not try to fix it automatically. Fixing it hides errors and can turn a suspicious call into a successful one.

## Validate tool outputs too

The data returned by tools also matters. If a tool returns an error, malformed JSON, or unexpected HTML, sanitize it before returning it to the model. Otherwise the model may be confused into a bad next action.

Examples of output sanitization:

- Truncate overly long responses.
- Strip HTML and scripts from web pages unless they are needed.
- Remove binary or encoded blobs.
- Convert errors into a consistent format the model can understand.

## Contextual approval

Some tools are safe in one context and dangerous in another. Validation should include a context check:

- Is this the right agent to call this tool?
- Is the target environment local, staging, or production?
- Has the user approved this category of action?
- Does this match the current task scope?

## Timeouts and retries

A hanging tool call can block the agent or cause retries that amplify damage. Configure:

- Timeouts for every tool invocation
- Limited retry counts
- Exponential backoff with jitter
- Circuit breakers for repeatedly failing tools

## Common mistakes

- **Accepting string tool names.** Use enum values or a registry so the model cannot call an arbitrary function.
- **Allowing raw shell strings.** Shell commands should be structured, not concatenated from model output.
- **Ignoring validation errors in logs.** A spike in rejected calls can be an early sign of an attack or a model drift.
- **Returning full error traces to the model.** Error traces can leak internal details. Return a clean summary instead.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Prompt Injection Defenses](/safety/prompt-injection)
- [Sandboxing Agent Runtimes](/safety/sandboxing)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)

> Last verified: 2026-06-18.
