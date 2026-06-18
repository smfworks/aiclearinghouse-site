---
slug: prompt-injection
title: Prompt Injection Defenses
excerpt: How to reduce prompt injection, indirect prompt injection, and tool misuse risks in agent deployments.
category: Trust
tags:
  - safety
  - prompt injection
  - security
  - trust
last_verified: 2026-06-18
---

# Prompt Injection Defenses

Prompt injection happens when an attacker hides instructions inside untrusted content that the agent will process. The agent then follows the hidden instructions instead of its system prompt. Indirect prompt injection happens when the malicious content lives in an external source the agent retrieves, such as a web page, email, or document.

No defense is perfect, but a layered approach makes exploitation much harder.

## Layer 1: least privilege

Only expose tools the agent truly needs. If the agent does not need to send email, delete files, or call APIs, do not give it those tools. Every extra tool is an instruction an attacker can try to trigger.

- Remove unused tools from the agent's environment.
- Scope file access to a dedicated directory.
- Require separate approval for high-impact tools.

See [Agent Permission Models](/safety/permission-models) for a fuller treatment.

## Layer 2: separate trusted and untrusted content

The system prompt is trusted. User input, fetched web pages, and uploaded files are not. Keep them apart.

- Place user content inside delimiters, such as `### BEGIN USER CONTENT` and `### END USER CONTENT`.
- For files, consider base64 encoding with a clear wrapper so the model knows the content is opaque data.
- Never let user content appear before the system prompt unless you have a specific reason and understand the risk.

## Layer 3: require human approval for dangerous actions

Even if an attacker crafts a perfect injection, they still need the agent to perform a real action. Human approval for write, delete, shell, network, and commit operations breaks most attack chains.

- Approval should show the exact action, not a generic summary.
- Approval logs should include user identity and timestamp.
- Avoid "remember my choice" options for destructive actions.

## Layer 4: validate tool calls with schemas

Do not let the model emit free-form commands. Define strict JSON schemas for every tool, and reject any call that does not match.

- Unexpected parameters are rejected, not corrected.
- Parameter values are validated against allowlists or ranges where possible.
- Tool outputs are sanitized before being returned to the model.

See [Output Validation for Agent Tool Calls](/safety/output-validation).

## Layer 5: sandbox the runtime

If an injection succeeds, limit what the attacker can reach. Containers, VMs, restricted user accounts, and network egress controls all reduce blast radius.

- Run the agent in an isolated environment.
- Mount the host filesystem read-only where possible.
- Restrict outbound network access to known endpoints.

See [Sandboxing Agent Runtimes](/safety/sandboxing).

## Layer 6: monitor for anomalous behavior

Prompt injection often produces unusual patterns: repeated attempts to call restricted tools, unexpected file reads, or instructions in retrieved content.

- Log every LLM request and tool call.
- Alert on sequences that look like escalation attempts.
- Sample and review model outputs regularly.

See [Monitoring and Auditing Agents](/safety/monitoring-and-auditing).

## Indirect prompt injection: the harder problem

Indirect injection is harder because the malicious content is not coming from the user directly. It may be in a PDF, a web page, an email, a code comment, or a database record.

Defenses include:

- **Content origin tracking.** Know whether a piece of text came from a trusted internal source or an untrusted external one.
- **Rendering isolation.** Convert documents to a neutral format before passing them to the model.
- **Retrieval filtering.** Do not blindly inject retrieved content into the system prompt.
- **Markup stripping.** Remove HTML, CSS, and JavaScript from fetched web pages when they are not needed for the task.

## What to put in the system prompt

A system prompt alone cannot stop prompt injection, but it can help:

- State clearly that system instructions take precedence over user content.
- Warn the model that text inside delimiters is untrusted.
- Instruct the model to ask for confirmation before any high-risk action.

Do not rely on the system prompt as your only defense. It is one layer among several.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Output Validation for Agent Tool Calls](/safety/output-validation)
- [Sandboxing Agent Runtimes](/safety/sandboxing)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [Tip: Never Trust a Hallucination](/tips/never-trust-a-hallucination)

> Last verified: 2026-06-18.
