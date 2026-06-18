---
slug: secrets-management
title: Secrets Management for Agents
excerpt: Keep API keys, tokens, and credentials out of prompts, code, and logs using vaults, scoped keys, and rotation.
category: Trust
tags:
  - safety
  - secrets
  - api keys
  - credentials
last_verified: 2026-06-18
---

# Secrets Management for Agents

Agents need credentials to call APIs, query databases, and commit code. If those credentials leak into a prompt, a log file, or a model's training data, the damage can be lasting and hard to undo.

## The golden rule

**Secrets should never appear in a prompt, a code comment, a git history, or a log entry.** They should live in a vault or secret manager and be injected at runtime with the minimum scope required.

## Common secret types in agent systems

- LLM provider API keys
- Database connection strings
- Source-control tokens
- Cloud provider credentials
- Third-party SaaS tokens
- OAuth refresh tokens
- Signing keys and certificates

## What to do instead of hardcoding

| Anti-pattern | Better pattern |
|---|---|
| API key in source code | Load from environment or secret manager at runtime |
| Key in a system prompt | Pass it in the HTTP header, not the prompt body |
| One key with full access | Scoped keys per agent or per task |
| Key shared across agents | Separate identity per agent |
| Key never rotated | Automatic rotation + manual rotation after incidents |

## Secret manager options

| Tool | Best for |
|---|---|
| HashiCorp Vault | Teams needing fine-grained policies, dynamic credentials, and audit logs |
| AWS Secrets Manager / Azure Key Vault / GCP Secret Manager | Cloud-native stacks already on one provider |
| Doppler / 1Password Secrets Automation | Small teams that want easy integration and rotation |
| Infisical | Open-source alternative with good self-hosting support |
| GitHub Actions secrets / GitLab CI variables | CI/CD pipelines, but not for production runtime secrets |

## Scoping and rotation

- **Scope each key to one purpose.** A key for reading support tickets should not also be able to delete customer accounts.
- **Use service accounts.** Give the agent its own identity so you can audit and revoke its access independently.
- **Rotate on change.** Rotate keys when someone leaves, after a suspected leak, and on a regular schedule.
- **Monitor usage.** Alert on unexpected key usage patterns, such as new IP addresses or unusual API calls.

## Secrets and prompts

If the agent needs a secret to call a tool, do not put the secret in the prompt. The model should know which tool to call and what parameters to pass. The runtime should inject the secret when executing the tool.

Example of what to avoid:

```text
Call the Stripe API with key sk_live_12345...
```

Example of what to do:

```text
Use the stripe_charge_tool with amount and customer_id.
```

The actual key is added by the tool's HTTP client.

## What to log

- Log that a secret was used.
- Log which identity or agent used it.
- Do not log the secret value or any part of it.

## Common mistakes

- **Checking secrets into git.** Even in private repos, history is hard to clean.
- **Using one LLM key for everything.** A key shared across dev, staging, and production is a single point of failure.
- **Ignoring model training risk.** Some providers may use prompt data for training. Treat every prompt as potentially retained.
- **Letting the agent read its own secrets file.** If the agent can read secrets, a prompt injection can ask it to print them.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Agent Identity and Access Control](/safety/agent-identity-and-access)
- [Sandboxing Agent Runtimes](/safety/sandboxing)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)

> Last verified: 2026-06-18.
