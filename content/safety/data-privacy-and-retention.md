---
slug: data-privacy-and-retention
title: Data Privacy and Retention for Agents
excerpt: Protect PII, customer data, and proprietary inputs from leaks, unwanted training, and over-retention.
category: Trust
tags:
  - safety
  - privacy
  - pii
  - data retention
  - compliance
last_verified: 2026-06-18
---

# Data Privacy and Retention for Agents

Agents read documents, process messages, and query databases. That means they handle sensitive data: customer emails, support tickets, health records, financial transactions, source code, and internal strategy. Privacy and retention rules are how you keep that data safe.

## Know where data goes

Before deploying an agent, trace the data flow:

- What inputs does the agent see?
- Which models process those inputs?
- Are inputs stored, logged, or used for training?
- Where are tool outputs written?
- Who can access each of those locations?

If you cannot answer these questions, you are not ready to deploy.

## Provider training policies

Different providers handle data differently. Check the policy for every model and service you use:

- Are inputs used to train future models?
- Is there a zero-retention option?
- Can you request deletion?
- Does the provider comply with the regulations you need (GDPR, HIPAA, SOC 2)?

When in doubt, choose a provider with explicit zero-retention terms for sensitive workflows.

## Minimize what the agent sees

- **Filter before sending.** Strip PII, internal IDs, and sensitive metadata before the prompt is built.
- **Use retrieval, not bulk upload.** Pull only the specific documents the agent needs, not entire datasets.
- **Anonymize or pseudonymize.** Replace real names and identifiers with tokens when possible.
- **Avoid raw customer data in prompts.** Summarize or redact first.

## Retention rules

Set retention limits for every data type the agent touches:

| Data type | Typical retention |
|---|---|
| LLM request/response logs | 30–90 days, with PII redacted |
| Tool call inputs and outputs | 30 days, or as required by compliance |
| User-provided files | Delete after processing unless explicitly stored |
| Agent-generated drafts | Keep until explicitly saved by user |
| Audit logs | 1 year, or as required |

Document the rules and enforce them automatically. Manual deletion schedules fail.

## RAG and vector databases

Retrieval-augmented generation stores chunks of documents in a vector database. Treat that store as sensitive data:

- Encrypt the database at rest and in transit.
- Scope access by role or agent identity.
- Delete or refresh chunks when source documents change.
- Do not put unredacted PII into the vector store unless required.

## Customer consent and disclosure

If the agent handles customer data:

- Disclose that an agent may assist.
- Explain what data is used and how long it is kept.
- Offer an opt-out or human-only path where appropriate.
- Honor deletion and correction requests.

## Cross-border data

Some providers process data in specific regions. If you have regulatory requirements:

- Choose providers with data residency options.
- Use region-specific endpoints.
- Document where each stage of the pipeline runs.

## Common mistakes

- **Sending full database rows to the model.** Send only the fields the agent needs.
- **Assuming "business tier" means no training.** Read the terms. Marketing language is not a contract.
- **Keeping logs forever.** Long retention increases breach impact.
- **Ignoring vendor subprocessors.** The model provider may use other services for hosting, logging, or safety review.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Secrets Management for Agents](/safety/secrets-management)
- [Sandboxing Agent Runtimes](/safety/sandboxing)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)

> Last verified: 2026-06-18.
