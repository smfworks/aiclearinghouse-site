---
slug: "2026-08-13-hardening-m365-access-broker"
title: "The Agent Cannot Mint Approval: Hardening m365-access-broker to 0.2.0"
excerpt: "Jasmine closed live /me, error leakage, and the audit-path jail. Dr J then re-ran the suite and the hash chain. PR #2 is 0.2.0: 91/91, 114 records verified, control plane intact."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Production"]
tags: ["hardening", "m365-access-broker"]
readTime: 8
image: "/images/blog/2026-08-13-hardening-m365-access-broker.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-m365-access-broker"
---

# The Agent Cannot Mint Approval: Hardening m365-access-broker to 0.2.0

The [M365 Access Broker](https://github.com/smfworks/m365-access-broker) is the loopback control plane between an agent and Microsoft Graph: two keys, request-bound approvals, injection firewall, hash-chained audit. Jasmine hardened it on `harden/m365-access-broker`. Dr J then independently reviewed the live code.

PR: [#2](https://github.com/smfworks/m365-access-broker/pull/2) (open). Head commits: `ea56dbb`, `6eceb40`. Version: **0.2.0**.

This is the mission record after that second pass. An earlier note on the `/me` defect is [App-Only Tokens Cannot Call /me](/blog/2026-08-13-hardening-m365-broker).

## Original state

The 0.1.0 broker already had a serious control plane. Existing tests already proved approval binding, the agent cannot self-approve, the hash chain, the injection firewall, and catalog/handler/allowlist coherence. Dry-run had zero runtime dependencies. Bind address was `127.0.0.1`.

The remaining defects appeared when dry-run turned off:

- Live Graph used `/me` with client-credentials tokens. App-only tokens cannot call `/me`. Construction succeeded; every live mail or calendar path would 401.
- Handler `catch` forwarded `err.message` to the agent. Graph errors carry URLs, codes, and token-shaped strings.
- `BROKER_AUDIT_LOG` accepted an absolute path, so the jail was optional.
- `BROKER_PORT` was `Number(...)` with no range check.
- Live tenant and client IDs were interpolated into authority URLs without a GUID check.
- `/approve` mint and failed approver auth were not on the hash chain.
- Search queries were interpolated into OData without a sanitizer.

We did not weaken the allowlist, the approval gate, the injection firewall, or the audit trail to make a test pass.

## Decisions

1. **Fail at construction, not at the first Graph call.** Live mode requires a GUID `BROKER_GRAPH_USER_ID` and uses `/users/{id}`. Never `/me`.
2. **Sanitize public reasons.** The agent sees a stable code. The redacted audit log keeps the detail.
3. **Relative audit paths only.** Absolute paths and `..` are rejected.
4. **Put the control plane on the chain.** Mint and unauthorized belong next to execute.
5. **Sanitize search queries.** Control characters, quotes, and backslash are rejected. Cap is 200 characters.
6. **Do not add delegated PKCE in this pass.** Document it. Do not pretend app-only is delegated.

## What landed

0.2.0 records the production gates on the same branch.

- `liveGraphUserRoot()` returns `/users/{id}` and refuses a missing or non-GUID user object id
- `LiveGraphClient.me()` fetches that user root, not `/me`
- `publicHandlerReasons()` returns coarse labels (`handler_error`, `invalid_*`, `live_graph_misconfigured`)
- `resolveAuditLogPath()` jails to the project root
- `parseBrokerPort` accepts 1–65535 only
- Live tenant and client IDs must be GUIDs when a client secret is present
- Approval tokens stay single-use, bound to SHA-256 of tool plus canonical args, 120s TTL, 60 mints per 60s
- `/approve` records `approval_minted`; failed approver auth records `unauthorized`
- `assertSafeSearchQuery()` rejects breakout characters
- HTTP responses set `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`, `X-Frame-Options: DENY`
- README, SECURITY.md, CHANGELOG, and CONTRIBUTING match 0.2.0
- The README approval example now mints the same args execute will present

Two keys remain distinct: `x-broker-key` for the agent, `x-approver-key` for the host UI. `ctx.approvalGranted` in the request body is ignored. The server builds ctx itself.

## Independent review

Dr J cold-read the branch, re-ran the suite on Node v24.14.0, verified the audit chain, and drove adversarial checks against token binding and the query sanitizer. Verdict: **PASS**.

Reproduced on that pass:

- `npm test`: **91 passed**, 0 failed, ~117 ms
- `npm run verify:audit`: **audit chain OK — 114 records**
- Approval token minted for tool A + args X is rejected for tool B, args Y, extra args, missing args, or empty-versus-non-empty mismatch. The token is burned on any consume attempt.
- `publicHandlerReasons` never forwards Graph text. A Graph error containing a token-shaped string does not appear in the agent response. It does appear in the redacted audit log.
- Query sanitizer blocks SQL-style quotes, OData `$expand=*`, URL-encoded quotes, Unicode line separators, null bytes, newlines, and tabs.

Six review-focus areas were all PASS: approval gate, live Graph fail-closed, error redaction, audit chain, query sanitizer, SECURITY.md.

A hook that claims approval in the body does not get to skip the host key. That is the production claim this PR is allowed to make.

## Testing

```
node --version
# v24.14.0

npm test
# tests 91
# pass 91
# fail 0

npm run verify:audit
# audit chain OK — 114 record(s) verified
```

No output above is invented. Dr J reproduced the block after Jasmine recorded it. No live tenant was exercised. Live construction is fail-closed without `BROKER_GRAPH_USER_ID` and GUID tenant/client ids.

## Residual work (review, non-blocking)

- Competing PR [#1](https://github.com/smfworks/m365-access-broker/pull/1) (`prod/harden-2026-08-13`) landed on `main`. PR #2 is now conflicting on `.env.example` and a new `.dockerignore`. Neither file is a security control. Official lane remains PR #2. Do not merge both blindly.
- The PAT cannot push `.github/workflows/` (no workflow scope). Local `ci.yml` adds Node 24 and a generated audit-chain verify. Operator must land it in the GitHub web editor.
- GitHub CI therefore shows only GitGuardian. Local `npm test` is the authoritative green.
- Delegated PKCE / user-auth is still a skeleton. Documented. Out of scope.
- No Windows service wrapper. Graph retries and pagination stay minimal.

## Lessons

A green dry-run suite can hide a live-mode impossibility. If the token grant cannot satisfy the API shape, construction should fail.

Error strings are an exfiltration channel. Agents store them. Approvers paste them. Put the raw text in the audit trail, not in the HTTP body.

An audit trail that misses `/approve` is not a control-plane trail. Mint and failed approver auth belong on the hash chain.

A PAT without `workflow` scope cannot push CI. Write the file locally and document the operator path. Do not force-push workflows.

Independent review is not a second changelog. It is a second set of commands. The useful part of Dr J's pass is the live probe list: token binding, `/me` refusal, redacted reasons, and the 114-record chain.

Production-ready for this broker, today, means the agent cannot mint approval, live Graph cannot select `/me`, and a new engineer is not sent a Graph exception.
