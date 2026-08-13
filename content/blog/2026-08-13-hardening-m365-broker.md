---
slug: "2026-08-13-hardening-m365-broker"
title: "App-Only Tokens Cannot Call /me: Hardening the M365 Access Broker"
excerpt: "The broker already had a hash-chained audit trail and 79 tests. Live Graph still used /me on client-credentials tokens. Handler exceptions leaked into agent-visible reasons. 0.2.0 closes those gaps."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Security", "Microsoft 365", "AI Agents", "Production Hardening"]
tags: ["m365", "graph", "broker", "least-privilege", "grok-4.6"]
readTime: 10
image: "/images/blog/2026-08-13-hardening-m365-broker.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-m365-broker"
---

# App-Only Tokens Cannot Call /me: Hardening the M365 Access Broker

The [M365 Access Broker](https://github.com/smfworks/m365-access-broker) is the local control plane between an autonomous agent and Microsoft Graph: scopes as contract, approval gates, injection firewall, tamper-evident audit.

It was already the most security-conscious of the four repos. Jasmine's audit still found production holes. PR: [#2](https://github.com/smfworks/m365-access-broker/pull/2). Version: **0.2.0**. Tests: **79 → 91**.

## Original state

Zero runtime dependencies in dry-run. Existing tests already proved:

- approval binding to exact args
- agent cannot self-approve
- hash-chained audit
- injection firewall
- catalog/handler/allowlist coherence

The remaining defects were the kind that only appear when you turn dry-run off.

- Live client used `/me` with the client-credentials flow. App-only tokens cannot call `/me`. Every live mail/calendar path would 401 after construction succeeded.
- Handler `catch` forwarded `err.message` to the agent. Graph errors often contain URLs, codes, and token-shaped strings.
- `BROKER_AUDIT_LOG` accepted an absolute path, so the jail was optional.
- `BROKER_PORT` was `Number(...)` with no range check.
- Live tenant and client IDs were interpolated into authority URLs without a GUID check.
- HTTP responses had no security headers.

## Decisions

1. **Fail at construction, not at the first Graph call.** Live mode requires `BROKER_GRAPH_USER_ID` and uses `/users/{id}`.
2. **Sanitize public reasons.** The agent sees a stable code. The audit log keeps the redacted detail.
3. **Relative audit paths only.** Absolute paths and `..` are rejected.
4. **Do not add delegated PKCE in this pass.** Document it as remaining work. Do not pretend app-only is delegated.
5. **Do not bind off loopback.** The broker stays `127.0.0.1`.

## Key changes

- `liveGraphUserRoot` requires a user object id
- `publicHandlerReasons` filters exception text
- `resolveAuditLogPath` jails to the project root
- `parseBrokerPort` accepts 1–65535 only
- Live tenant/client IDs must be GUIDs when a client secret is present
- `send()` sets `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`, `X-Frame-Options: DENY`
- CI runs `verify:audit` after tests

## Testing

```
npm test    # 91 passed
```

New production-gate tests cover GUID parsing, port validation, audit-path jail, `/me` rejection, and sanitized handler reasons.

## Lessons

A green dry-run suite can hide a live-mode impossibility. If the token grant cannot satisfy the API shape, construction should fail.

Error strings are an exfiltration channel. Agents will store them. Approvers will paste them. Put the raw text in the audit trail, not in the HTTP body.

## Remaining work

- Delegated PKCE / user-auth flow is still not implemented.
- There is no Windows service wrapper.
- Graph retries and pagination are still minimal.

Production-ready here means: dry-run is honest, live mode cannot be misconfigured into `/me`, and the agent never sees Graph's exception text.
