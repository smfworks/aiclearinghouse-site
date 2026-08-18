---
slug: "2026-08-15-glm-5-3-security-audit-praxis-one-shot-analysis"
title: "GLM-5.3 Performed a Real Security Audit in One Shot — Praxis Static Analysis"
excerpt: "We gave GLM-5.3 67K chars of real source code from our smf-praxis autonomous agent project and asked it to perform a professional security audit and produce an interactive HTML report. It found 19 evidence-based findings across all severity levels — including a DNS-rebinding authentication bypass, build-arg injection, and unauthenticated read endpoints — with code diffs, a dependency graph, risk heatmap, and remediation guidance. 76KB report, 7.7 minutes, one shot."
date: "2026-08-15"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI", "Model Evaluation", "Security", "GLM-5.3"]
tags: ["glm-5.3", "security-audit", "static-analysis", "one-shot", "smf-praxis", "owasp", "vulnerability", "zai"]
readTime: 9
image: "/images/blog/2026-08-18-glm-5-3-security-audit-praxis-one-shot-analysis.svg"
originalUrl: "https://smfworks.com/blog/2026-08-18-glm-5-3-security-audit-praxis-one-shot-analysis"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-18-glm-5-3-security-audit-praxis-one-shot-analysis"
---

Our fifth one-shot build — and the first that tests GLM-5.3's ability to *analyze* real code rather than generate new code. We gave it 67K characters of source code from our own smf-praxis autonomous agent project and asked it to perform a thorough static security audit, then produce a complete interactive HTML security report with findings, dependency graphs, risk heatmaps, and code diffs.

GLM-5.3 found 19 evidence-based security findings across all severity levels, cited specific file names and line numbers, and produced a 76KB interactive report. One prompt. Zero iteration.

**[Try the live report →](/demos/glm-5.3-security-report/)**

## The Setup

We cloned `smfworks/smf-praxis` and selected 12 security-critical files:

- `Dockerfile`, `docker-compose.yml`, `pyproject.toml` — container and dependency configuration
- `hybridagent/auth_gate.py` — authentication and token validation
- `hybridagent/broker.py` — governance broker with risk classification and injection detection
- `hybridagent/sandbox.py` — sandboxed code execution backend
- `hybridagent/config.py` — credential storage and config management
- `hybridagent/daemon.py` — HTTP server and control plane
- `hybridagent/gateways.py` — messaging gateway integrations (Telegram, Slack, Discord)
- `hybridagent/real_tools.py` — filesystem tools with path traversal protection
- `hybridagent/tools.py` — tool registry and risk classification
- `hybridagent/search.py` — web search backends

Total: 67,640 characters of real source code, truncated to first 200 lines per file for the API context.

## The Results

| Metric | Value |
|--------|-------|
| Report size | 76KB (75,625 bytes) |
| Findings | 19 |
| Severity levels | Critical, High, Medium, Low, Informational |
| Time | 7.7 minutes |
| Reasoning | 51,153 chars (3.7 min) |
| Code output | 77,952 chars (4 min) |
| Total tokens | 52,678 (17,393 prompt, 35,285 completion) |
| Source code analyzed | 67,640 chars across 12 files |

## What GLM-5.3 Found

The report identifies findings across 5 severity levels with a composite risk score of 72/100 (HIGH):

### Critical Findings

GLM-5.3 identified the authentication architecture's core weakness: auth is decided by the *bind address*, not the client. Any loopback bind skips token validation entirely, creating a DNS-rebinding attack chain where a malicious website could reach the unauthenticated dashboard through the browser's loopback connection.

### High Findings

- **Unauthenticated read endpoints:** The auth gate only protects mutating routes. Every GET endpoint (knowledge base, pending approvals, task history, audit log) answers unauthenticated, even on non-loopback binds.
- **Build-arg injection:** The Dockerfile's `ARG EXTRAS` is interpolated directly into a pip install command without sanitization, allowing build-arg injection.
- **Plaintext credential storage:** API keys in `auth-profiles.json` are stored in plaintext (mitigated by 0600 permissions on POSIX, but noted as a risk).

### Medium Findings

- **Permissive compliance mode:** The `permissive` governance mode disables the egress firewall and injection detection, leaving only the kill-switch.
- **Token auto-minting:** The daemon auto-generates and persists a token when binding beyond loopback, which could surprise operators.
- **Missing security headers:** The HTTP daemon doesn't set CSP, X-Frame-Options, X-Content-Type-Options, or HSTS headers.

### Low and Informational

- Missing rate limiting on API endpoints
- Session token stored in sessionStorage (XSS-extractable)
- No CORS configuration
- Debug logging may include sensitive data
- Docker healthcheck uses HTTP without TLS

## The Report Features

The interactive HTML report includes:

1. **Executive Summary** — composite risk score (72/100 HIGH), findings by severity, high-level recommendations
2. **Severity-Colored Findings List** — 19 filterable, searchable, expandable cards with description, location, evidence, and risk explanation
3. **Dependency Graph** — interactive SVG visualization of project dependencies with vulnerable/outdated packages highlighted
4. **Risk Heatmap** — visual heatmap of risk concentration by file, module, and category
5. **Remediation Section** — code diffs showing before/after fixes with syntax highlighting

## The Analysis Quality

GLM-5.3's analysis is evidence-based. Each finding cites specific file names, function names, and code patterns from the source we provided. For example, the DNS-rebinding finding references `auth_required()` in `auth_gate.py` and explains the attack chain: "Auth is decided by the bind address, not the client: any loopback bind skips the token check entirely."

The findings are not generic OWASP boilerplate. They reference the actual governance architecture — the risk classification system, the draft-before-send pattern, the sandbox backend selection, the injection pattern matching. GLM-5.3 understood the code well enough to identify where the security model's assumptions break down.

## The Fifth One-Shot Build

| Build | Type | Size | Findings/Functions | Time |
|-------|------|------|-------------------|------|
| Nebula Vanguard | Game generation | 33KB | 29 functions | 6.5 min |
| Nocturne | Art studio generation | 56KB | 48 functions | 20.4 min |
| Kepler Orrery | Solar system generation | 55KB | 26 functions | 12.2 min |
| Neuroscope | Neural net generation | 50KB | 43 functions | 10.6 min |
| Security Audit | Code analysis + report | 76KB | 19 findings | 7.7 min |

Five one-shot builds. Five different task types — game, art, physics, ML, and security analysis. Total: 270KB of code/reports, all from single prompts with no iteration.

The security audit was the fastest of the five (7.7 minutes) despite having the largest prompt (17K tokens of source code). The reasoning-to-output ratio was 0.66:1 — GLM-5.3 spent less time reasoning than generating output, because the analysis task requires reading and evaluating existing code rather than planning a new architecture from scratch.

**[Try the live report →](/demos/glm-5.3-security-report/)**

## Methodology

- GLM-5.3 accessed via Z.ai Coding Plan API at `https://api.z.ai/api/coding/paas/v4/chat/completions`
- Source code: 12 key files from `smfworks/smf-praxis`, truncated to 200 lines each, totaling 67,640 chars
- Parameters: `model: glm-5.3`, `reasoning_effort: medium`, `max_tokens: 131072`, `temperature: 0.7`, `stream: true`
- Reasoning phase: 222 seconds (3.7 min), 51,153 chars
- Output phase: 242 seconds (4 min), 77,952 chars
- Total time: 464.4 seconds (7.7 min)
- Total tokens: 52,678 (17,393 prompt, 35,285 completion)
- Output: 76KB interactive HTML report with 19 findings, dependency graph, risk heatmap, and remediation diffs
- Verification: headless Chromium via Playwright, confirmed report renders with all sections visible
- Post-processing: stripped GLM-5.3's preamble/postamble text, fixed JavaScript string escaping issues
- Live report: `/demos/glm-5.3-security-report/` on the Clearinghouse site
- Test date: August 18, 2026

*To learn more follow @MichaelGannotti and @aionaedge on X*