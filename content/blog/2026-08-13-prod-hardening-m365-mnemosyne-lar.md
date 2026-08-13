---
slug: "2026-08-13-prod-hardening-m365-mnemosyne-lar"
title: "Production Hardening: M365 Access Broker, Mnemosyne, and LAR — Three Repos, One Standard"
excerpt: "From 79 to 137 tests for the M365 security broker, 17 to 61 tests for the offline memory plugin, and 1 to 232 tests for the agent resilience framework. Three repos hardened to production-ready in a single Grok 4.6 sprint."
date: "2026-08-13T06:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "Agent Systems", "Production Hardening", "Security"]
tags: ["m365-access-broker", "mnemosyne", "lar-agent-resilience", "production-hardening", "testing", "Grok 4.6"]
readTime: 18
image: "/images/blog/2026-08-13-prod-hardening-m365-mnemosyne-lar.png"
originalUrl: "https://smfworks.com/drj/2026-08-13-prod-hardening-m365-mnemosyne-lar"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-prod-hardening-m365-mnemosyne-lar"
---

# Production Hardening: M365 Access Broker, Mnemosyne, and LAR — Three Repos, One Standard

*Three repositories, three different languages, three different domains — one production-ready standard. How Grok 4.6 and parallel agent teams hardened the M365 security broker, the Mnemosyne memory plugin, and the LAR resilience framework simultaneously.*

## The Challenge

This is the second post in a two-part series covering the SMF Works production-hardening challenge. While Part I covered the SMF AI Bridge and SMF Forge CLI, this post covers three more repos that were already in better shape — they had tests, CI, and docs — but needed to be elevated to true production-ready status.

---

## Repo 1: M365 Access Broker (JavaScript)

### What It Is

A local control plane that gates every Microsoft Graph action an autonomous AI agent takes. It enforces auth, scopes, allowlists, approval gates, an injection firewall, and audit logging. This is the security choke point between an OpenClaw agent and Microsoft 365.

### Original State

The broker was already the most mature repo in the challenge:
- 79 tests passing
- CI workflow on GitHub Actions
- SECURITY.md with vulnerability reporting policy
- .env.example with all configuration options
- Solid architecture: broker, policy, firewall, audit, approvals, scopes, catalog, tools, graphClient, memoryLinter

### Gaps Identified

- No rate limiting
- No security headers (CORS, X-Content-Type-Options, etc.)
- No graceful shutdown
- No Dockerfile for containerized deployment
- No eslint configuration
- Missing edge-case tests
- No CONTRIBUTING.md
- Node 24 not in CI matrix

### Key Changes

**1. HTTP Middleware Stack (src/middleware.js)**

A new middleware module was added with:
- Rate limiting (configurable requests per minute per IP)
- Security headers (X-Content-Type-Options, X-Frame-Options, X-Requested-With)
- CORS configuration (configurable allowed origins)
- Request ID middleware (generates or echoes x-request-id)
- Structured request logging (method, URL, status, duration, remote address)

**2. Graceful Shutdown**

SIGTERM and SIGINT handlers now close the HTTP server cleanly, waiting for in-flight requests to complete before exiting. This is essential for Kubernetes deployments where pods receive SIGTERM before termination.

**3. Dockerfile and docker-compose.yml**

A minimal Dockerfile and docker-compose.yml were added for containerized deployment. The Dockerfile uses Node 22-slim and runs as a non-root user.

**4. ESLint Configuration**

An eslint config was added with the `eqeqeq` rule enforced. Four `==` vs `===` violations were found and fixed in the existing codebase.

**5. 58 New Tests**

Three new test files were added:
- `test/middleware.test.js` — rate limiting, security headers, CORS, request ID
- `test/server-hardening.test.js` — graceful shutdown, 404 handler, error middleware
- `test/edge-cases.test.js` — approval store edge cases, payload size limits, concurrent access

### Results

| Metric | Before | After |
|--------|--------|-------|
| Tests | 79 | 137 |
| CI matrix | Node 20, 22 | Node 20, 22, 24 |
| Linting | None | ESLint (0 errors) |
| Container | None | Dockerfile + docker-compose |
| Documentation | README + SECURITY | README + SECURITY + CONTRIBUTING |
| Release tag | v0.1.0 | v1.0.0 |

---

## Repo 2: Mnemosyne OpenClaw Plugin (TypeScript)

### What It Is

A 100% offline, local SQLite memory plugin for OpenClaw agents. It replaces cloud-dependent memory systems with a synchronous SQLite backend featuring FTS5 full-text search, WAL mode for crash resilience, and auto-pruning.

### Original State

Mnemosyne was already at v1.2.0 with a solid foundation:
- 17 tests passing
- Cross-platform CI (ubuntu, macOS, Windows)
- SECURITY.md with trust model documentation
- CHANGELOG.md
- DAL pattern with scoped stores (agent/session isolation)
- FTS5 full-text search with Porter stemming
- WAL mode with crash recovery on startup

### Gaps Identified

- No input validation on tool parameters
- No structured error handling in tool handlers (raw exceptions propagated to agent runtime)
- Missing edge-case and integration tests
- npm audit found vulnerabilities in transitive dependencies
- No CONTRIBUTING.md
- No LICENSE file
- No Dockerfile
- No coverage reporting in CI

### Key Changes

**1. Input Validation on All Tool Parameters**

All five tool handlers (remember, recall, search, list, forget) now validate their inputs:
- Keys are length-bounded (256 chars max)
- Values are length-bounded (10,000 chars max)
- Queries are sanitized for FTS5 (embedded quotes escaped)
- Limit parameters are range-validated (1-100)

**2. Structured Error Handling**

A `withErrorHandling` wrapper was added to all tool handlers. Raw exceptions are caught and translated into user-friendly tool responses instead of propagating unstructured errors to the agent runtime.

**3. sessionId Added to ToolRuntimeContext**

The `ToolRuntimeContext` interface was extended with an optional `sessionId` field, enabling tools to access the session identifier when `sessionKey` is not available.

**4. 44 New Tests**

Three new test files were added:
- `tests/edge-cases.test.js` — empty queries, oversized inputs, invalid scope, missing keys
- `tests/integration.test.js` — full lifecycle (remember → recall → search → forget), FTS disabled fallback, agent-scoped memories across sessions
- `tests/hardening.test.js` — concurrent remember calls, concurrent capture and search, multiple session isolation

### Results

| Metric | Before | After |
|--------|--------|-------|
| Tests | 17 | 61 |
| Coverage | Unknown | 92% line, 82% branch |
| Input validation | None | All tool params |
| Error handling | Raw exceptions | Structured wrapper |
| CI | Build + test | Build + test + coverage + security audit + strict typecheck |
| Documentation | README + SECURITY + CHANGELOG | + CONTRIBUTING + LICENSE + Dockerfile |
| Release tag | v1.2.0 | v1.3.0 |

---

## Repo 3: LAR — Local Agent Resilience (Python)

### What It Is

A production-grade, open-source reference implementation for resilient agent design on Linux. It includes a circuit breaker for misfire detection, model failover with consolidation, health checks, an observability dashboard, and a Hermes resilience skill.

### Original State

LAR had the most work needed:
- 1 test file (the resilience skill test)
- No CI/CD
- **Broken package namespace** — all internal imports used `lar.*` but the package directory was `agent_resilience`
- No CONTRIBUTING.md
- Minimal README (no architecture diagram, no config reference)

### Key Changes

**1. Fixed Package Namespace**

All internal imports were updated from `lar.*` to `agent_resilience.*`. A `tools/__init__.py` was added to resolve a circular import issue between `tools.py` and the `tools/` directory.

**2. 13 New Test Files (232 tests total)**

Comprehensive test coverage was added for every module:
- `test_config.py` — config loading, env var expansion, validation
- `test_agent.py` — agent loop, checkpoint/resume, run cycle
- `test_circuit_breaker.py` — misfire detection, circuit states, recovery
- `test_health.py` — health checks, health report, check results
- `test_tools.py` — tool registry, exec tool, file read tool, safety checks
- `test_llm.py` — LLM client, model lifecycle, retry logic
- `test_memory.py` — memory store, session memory, agent memory
- `test_model_lifecycle.py` — model registration, health checks, failover
- `test_checkpoint.py` — checkpoint store, resume, cleanup
- `test_observatory.py` — observability server, dashboard
- `test_identity.py` — agent identity, session routing
- `test_public_api.py` — public API exports, version

**3. CI Workflow**

GitHub Actions with Python 3.10, 3.11, and 3.12 matrix. Runs ruff lint and pytest with coverage reporting.

**4. CONTRIBUTING.md**

Full contributing guide with development setup, testing instructions, code style guidelines, and architecture overview.

### Results

| Metric | Before | After |
|--------|--------|-------|
| Tests | 1 | 232 |
| CI/CD | None | GitHub Actions (3 Python versions) |
| Package namespace | Broken (lar.* vs agent_resilience.*) | Fixed |
| Documentation | Minimal README | README + CONTRIBUTING + DESIGN.md |
| Release tag | None | v1.0.0 |
| Files changed | — | 22 files, 3018 insertions |

---

## Combined Lessons Learned

### 1. Parallel Agent Teams Are Highly Effective

Five repos were hardened simultaneously using `delegate_task` subagents. Wall time was approximately 8 minutes for the code work, plus verification and fixing time. The key insight: dispatch all teams at once, then verify and fix remaining issues directly.

### 2. Subagent Iteration Limits Are the Main Bottleneck

Teams hit the 50-iteration limit on complex repos. The solution: dispatch follow-up teams immediately for incomplete work. The `xhigh` reasoning value error from the provider is a bug, not a code issue — teams still complete their work before hitting it.

### 3. Always Verify Before Pushing

After teams complete, run tests locally. The LAR team left 5 failing tests that were easily fixed directly (wrong agent_id in test payloads, wrong assertion strings). Re-dispatching for small fixes wastes time.

### 4. Branch Names Vary

Some repos use `main`, others use `master`. Always check with `git branch -a` before pushing. The mnemosyne repo used `master` and the initial push failed silently.

### 5. Test Count Growth Is the Key Metric

The most reliable indicator of production readiness is test count growth. Going from 137 total tests to 619 across 5 repos is a 4.5x improvement. Coverage percentage is secondary — the absolute number of tests covering real code paths matters more.

### 6. Dockerfiles Are Essential for Production

Three of the five repos gained Dockerfiles. Even for repos designed for localhost deployment, containerization makes deployment reproducible and enables future Kubernetes migration.

## Aggregate Impact

| Repo | Before | After | Growth |
|------|--------|-------|--------|
| smf-ai-bridge | 0 | 79 | +79 |
| smf-multi-agent-orchestration-CLI | ~40 | 110 | +70 |
| lar-agent-resilience | 1 | 232 | +231 |
| m365-access-broker | 79 | 137 | +58 |
| mnemosyne-openclaw | 17 | 61 | +44 |
| **Total** | **137** | **619** | **+482** |

## Remaining Known Limitations

- **M365 Access Broker**: No integration tests with real Microsoft Graph (dry-run mode only in CI)
- **Mnemosyne**: npm audit vulnerabilities in transitive dependencies (openclaw SDK) — not fixable without upstream changes
- **LAR**: Observability dashboard not tested in CI (requires browser)
- **All repos**: No performance benchmarks or load testing

## Future Work

- Add integration test suites with real external services (Graph API, OpenClaw runtime)
- Add performance benchmarks to CI
- Consider adding OpenTelemetry tracing to all repos
- Build a unified deployment guide covering all five repos as a stack

## Cross-References

- [Production Hardening: SMF AI Bridge](/blog/2026-08-13-prod-hardening-smf-ai-bridge)
- [Production Hardening: SMF Forge CLI](/blog/2026-08-13-prod-hardening-smf-multi-agent-orchestration-cli)