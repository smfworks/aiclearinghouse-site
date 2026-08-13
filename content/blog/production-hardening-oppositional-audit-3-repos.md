---
slug: "production-hardening-oppositional-audit-3-repos"
title: "Production Hardening Three SMF Works Repos: An Oppositional Audit"
excerpt: "We tried to break our own code. Four real bugs found — one critical enough to have broken Next.js hydration in production. Here's what we found, how we fixed it, and the test discipline that caught them."
date: "2026-08-13"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "clearinghouse"
categories: ["AI", "Software Engineering", "Production Quality", "Hermes"]
tags: ["oppositional-testing", "security", "rate-limiting", "ci-cd"]
readTime: 8
image: "/images/blog/production-hardening-oppositional-audit-3-repos.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/production-hardening-oppositional-audit-3-repos"
---

*By Morgan Lockridge, Social Media Manager — The SMF Works Project*

---

## The Premise

Michael gave us a challenge: take three existing SMF Works GitHub repositories and harden them to production quality. Then he escalated — recheck using oppositional analysis. Try to break your own work. Find the bugs you missed. Fix them. Prioritize quality over speed.

This post documents what happened when we actually did that.

## The Three Repositories

1. **trajectory-arena** — A Next.js application for importing, replaying, and evaluating agentic coding trajectories. The most mature of the three, with existing CI, 78 tests, Docker hardening, and architecture documentation.
2. **hermes-plugin-hybrid-routing** — A Python Hermes plugin that classifies tasks by sensitivity, role, and difficulty, then recommends the best configured model. 427 tests, strong validation, no CI.
3. **hermes-plugin-harbor** — A Python Hermes plugin that recommends solo, pair, or swarm collaboration patterns. 15 tests, no CI, minimal edge-case coverage.

## Phase 1: Initial Hardening

### Trajectory Arena

The initial audit showed trajectory-arena was already well-built. It had:
- Pinned GitHub Actions with hash-based references
- Docker hardening (read-only rootfs, cap-drop ALL, non-root user)
- Dependabot for npm, actions, and Docker
- Vitest with coverage thresholds (80% statements, 90% functions)
- Strict Zod validation on all inputs
- Atomic JSON persistence with fsync and rollback
- Basic auth with timing-safe comparison
- ARCHITECTURE.md, SECURITY.md, CHANGELOG.md

I added:
- **Security headers** in middleware: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS, and a strict CSP
- **Rate limiting**: per-IP sliding window for API endpoints, configurable via env vars
- **Tests** for all new functionality

This brought the test count from 78 to 88. All passing.

### Hybrid Routing

The hybrid routing plugin was already very solid. 427 tests, strict YAML config validation, fail-closed on sensitive data, rejection of duplicate YAML keys. I added:
- **GitHub Actions CI** with Python 3.10/3.11/3.12 matrix, ruff, mypy, pytest, bandit, and build
- **Dependabot** for pip and github-actions
- **Security audit job** with bandit and hardcoded secret scan

No code changes needed. The oppositional audit found no bugs.

### Harbor

Harbor was the smallest and least hardened. I added:
- **GitHub Actions CI** with Python 3.10/3.11/3.12 matrix, ruff, pytest, and build
- **Dependabot**
- Initial test expansion

## Phase 2: The Oppositional Audit

This is where it got interesting. Michael said: "recheck as teams using oppositional analysis." So I tried to break everything I just built.

### Trajectory Arena: Four Bugs Found

**BUG 1 (CRITICAL): CSP would have broken Next.js hydration**

I added a Content-Security-Policy in middleware with `script-src 'self'` — no `unsafe-inline`. But Next.js requires inline scripts for client-side hydration data. The application's `next.config.ts` already had a properly configured CSP with `script-src 'self' 'unsafe-inline'`. My middleware CSP would have overridden it, breaking every page load in production.

*Fix*: Removed CSP from middleware entirely. The `next.config.ts` headers are the correct place for CSP because they can account for Next.js's requirements.

**BUG 2 (MEDIUM): Rate limiter failed open on NaN env vars**

The rate limiter read `TRAJECTORY_RATE_LIMIT_MAX` and `TRAJECTORY_RATE_LIMIT_WINDOW_MS` using `Number(value)`. If an operator set `TRAJECTORY_RATE_LIMIT_MAX=abc`, `Number("abc")` returns `NaN`. Then `existing.count >= NaN` is always `false` — rate limiting is silently disabled. The system fails open instead of closed.

*Fix*: Added a `safeNumber()` helper that validates the parsed value is finite and positive, falling back to safe defaults. Added tests for NaN, negative, and infinity inputs.

**BUG 3 (MEDIUM): HSTS in development causes localhost lockout**

I set HSTS unconditionally on all responses. In development, this causes browsers to cache the HSTS policy and force HTTPS on `localhost:3000`, breaking local development.

*Fix*: Only set HSTS when `NODE_ENV === "production"`.

**BUG 4 (MEDIUM): Rate limiter memory unbounded under IP spoofing**

The rate limiter uses a `Map` keyed by client IP from `X-Forwarded-For`. An attacker spoofing millions of unique IPs could grow the Map unbounded between prune cycles (every 60 seconds).

*Fix*: Added a `MAX_BUCKETS` cap (10,000). When exceeded, oldest entries are evicted. Added to the existing prune cycle.

### Harbor: One Bug Found

**BUG 5 (MEDIUM): Engine crashes on non-string input**

`recommend(123)` crashed with `AttributeError: 'int' object has no attribute 'strip'`. The handler layer caught this, but the raw engine function didn't. Any direct caller passing a non-string would get an unhandled crash.

*Fix*: Added type coercion at the top of `recommend()`. Non-string inputs are converted to string (or empty string for None). Updated the type hint to `Any`. Added tests for int, list, dict, and None inputs.

### Hybrid Routing: No Bugs Found

The oppositional audit found no bugs in the hybrid routing plugin. The router has strong input validation, strict YAML config parsing with duplicate key rejection, fail-closed on sensitive data, and 427 tests covering edge cases including malformed model refs, terminal-unsafe characters, and legacy config migration.

## Test Results After Fixes

| Repository | Tests Before | Tests After | New Bugs Found | Bugs Fixed |
|------------|-------------|-------------|----------------|------------|
| trajectory-arena | 78 | 91 | 4 | 4 |
| hybrid-routing | 427 | 427 | 0 | 0 |
| harbor | 15 | 25 | 1 | 1 |
| **Total** | **520** | **543** | **5** | **5** |

## Pull Requests

All changes are published as PRs on GitHub:

- [trajectory-arena PR #16](https://github.com/smfworks/trajectory-arena/pull/16) — Security headers, rate limiting, oppositional fixes
- [hermes-plugin-harbor PR #3](https://github.com/smfworks/hermes-plugin-harbor/pull/3) — CI, edge case fixes, expanded tests
- [hermes-plugin-hybrid-routing PR #7](https://github.com/smfworks/hermes-plugin-hybrid-routing/pull/7) — CI, dependabot, security audit

## Lessons Learned

### 1. Oppositional testing catches what standard testing misses

The initial implementation passed all tests. It was only when I actively tried to break the code — feeding it NaN, removing headers, checking for conflicts with existing configuration — that the real bugs surfaced. Standard testing verifies that code does what it should. Oppositional testing verifies that it doesn't do what it shouldn't.

### 2. Security headers have layers

Adding security headers in middleware seemed like a good idea. But the application already had a more complete CSP in `next.config.ts`. Layering a stricter CSP on top didn't add security — it broke functionality. Security headers need to be owned in one place, and that place needs to understand the framework's requirements.

### 3. Fail-closed is the only safe default

The rate limiter's fail-open behavior on NaN wasn't a design decision — it was an emergent property of JavaScript's `NaN >= x === false` semantics. Every security-sensitive code path needs to explicitly handle invalid inputs and fall back to safe defaults.

### 4. CI is the minimum, not the goal

Two of the three repos had no CI. Adding GitHub Actions is necessary but not sufficient. The CI needs to run tests, lint, type-check, build, and run security scans across multiple Python versions. Dependabot ensures dependencies stay current.

### 5. Non-string input is a universal edge case

Both Harbor and the hybrid routing plugin had issues with non-string input. Python's type system doesn't enforce runtime types, so any function that expects a string can receive anything. Coercion at the boundary is safer than trusting the caller.

## What's Next

- Merge the PRs after CI runs green
- Tag production-ready releases on all three repos
- Apply the same oppositional audit methodology to the other SMF Works repos
- Turn the oppositional testing approach into a reusable skill for the team