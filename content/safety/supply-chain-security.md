---
slug: supply-chain-security
title: Supply Chain Security for Agent Systems
excerpt: Audit model provenance, dependencies, and external tools so your agent stack does not introduce hidden risks.
category: Trust
tags:
  - safety
  - supply chain
  - dependencies
  - mcp
  - provenance
last_verified: 2026-06-18
---

# Supply Chain Security for Agent Systems

An agent system depends on many things you do not control: foundation models, SDKs, tool servers, vector databases, and third-party APIs. Each dependency is a potential supply-chain risk.

## What counts as the supply chain

- Foundation model providers
- Model weights and fine-tunes
- Agent frameworks and SDKs
- Tool servers and MCP servers
- Vector databases and embedding models
- Cloud hosting and inference platforms
- Browser automation tools and web scrapers
- CI/CD pipelines that build agent images

## Model provenance

A model is not just an API endpoint. It has a lineage: training data, fine-tuning, RLHF, quantization, and deployment packaging.

Questions to ask:

- Who trained the model?
- What data was used?
- Has it been fine-tuned by a third party?
- Is the deployment using the expected weights?
- Can the provider swap the model version without notice?

For sensitive use cases, prefer providers that document provenance and give version pinning.

## Dependency management

Agent projects tend to accumulate dependencies quickly. Each one is a maintenance and security burden.

- Keep a software bill of materials (SBOM) for agent runtimes.
- Pin dependency versions and review changelogs before upgrading.
- Scan dependencies for known vulnerabilities.
- Avoid installing packages you do not understand just because a tutorial suggested them.

## MCP and tool servers

MCP (Model Context Protocol) servers and other tool bridges let an agent call external systems. They are powerful and risky.

- Review every MCP server before enabling it.
- Run tool servers in isolated processes or containers.
- Limit what each tool server can access.
- Prefer official or well-audited servers over obscure community ones.

A malicious or poorly written tool server can expose files, credentials, or internal APIs.

## Container and image security

If you ship the agent as a container:

- Use minimal base images.
- Scan images for vulnerabilities before deployment.
- Sign images and verify signatures in production.
- Do not embed secrets in images.

## External APIs and browser tools

Agents that browse the web or call external APIs inherit those risks:

- Browser automation tools can be exploited by malicious web pages.
- External APIs can change behavior, deprecate endpoints, or return malicious payloads.
- Fetched content should be sanitized before processing.

See [Prompt Injection Defenses](/safety/prompt-injection) for how untrusted content enters the system.

## Version pinning

Model and dependency drift can break safety assumptions. Pin versions where possible:

- Pin model versions, not just "latest."
- Pin SDK and framework versions.
- Pin tool server versions.
- Test upgrades in staging before production.

## Incident response for supply chain issues

When a dependency has a vulnerability or a model provider changes terms:

- Identify which agents use the dependency.
- Assess whether the issue affects safety boundaries.
- Apply patches or swap components.
- Re-run safety tests after the change.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Sandboxing Agent Runtimes](/safety/sandboxing)
- [Output Validation for Agent Tool Calls](/safety/output-validation)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)

> Last verified: 2026-06-18.
