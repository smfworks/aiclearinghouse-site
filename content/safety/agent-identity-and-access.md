---
slug: agent-identity-and-access
title: Agent Identity and Access Control
excerpt: Give agents their own identities, scopes, and review cycles so their permissions are explicit and revocable.
category: Trust
tags:
  - safety
  - identity
  - access control
  - iam
  - oauth
last_verified: 2026-06-18
---

# Agent Identity and Access Control

Agents should not borrow human identities. An agent that acts as "you" is an audit nightmare. It makes it impossible to know who did what, and it means disabling the agent may also disable a person.

## Give the agent its own identity

Create a dedicated service account, OAuth client, or API identity for each agent. The identity should:

- Have a descriptive name, such as `support-agent-prod`.
- Be scoped to the specific resources it needs.
- Be revocable without affecting human users.
- Be included in access reviews and offboarding checklists.

## Tie permissions to the identity, not the user

When an agent runs under a human user's credentials, it inherits everything that person can do. That is usually far more than the agent needs. Instead:

- Grant the agent identity the minimum permissions for its task.
- Use role-based access control (RBAC) or attribute-based access control (ABAC).
- Separate identities for different environments (dev, staging, production).

## OAuth and scoped tokens

For agents that call SaaS tools, prefer OAuth with explicit scopes:

- Request only the scopes the agent needs.
- Use short-lived access tokens and refresh tokens stored in a vault.
- Monitor token usage for anomalies.
- Revoke tokens when the agent is updated or retired.

## Lifecycle management

Agent identities need the same lifecycle management as human employees:

- **Provisioning.** Document why the agent exists and what it can do.
- **Review.** Periodically re-evaluate permissions and scope.
- **Rotation.** Rotate keys and tokens on a schedule.
- **Offboarding.** Disable identities when an agent is retired.

## Access review questions

During each review, ask:

- Does this agent still need this permission?
- Has its scope changed since provisioning?
- Are there any unused identities or keys?
- Does the agent still need access to production?
- Who is responsible for this agent's behavior?

## Multi-agent environments

If you run multiple agents:

- Use separate identities for each agent.
- Avoid shared keys or service accounts.
- Map each identity to a specific task or workflow.
- Label resources the agent can access.

## Common mistakes

- **Running agents under a developer's personal API key.** The key is tied to a person, not a role.
- **Using one key for all environments.** A staging key should not work in production.
- **Forgetting agents during offboarding.** A retired employee's agent may still have active credentials.
- **No owner for the agent.** Every agent needs a human owner who is accountable.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Agent Permission Models](/safety/permission-models)
- [Secrets Management for Agents](/safety/secrets-management)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)

> Last verified: 2026-06-18.
