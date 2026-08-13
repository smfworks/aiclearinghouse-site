---
slug: "2026-08-13-smf-swarm-production-hardening"
title: "SMF Swarm 0.5: CI, SSRF, and Stop Shipping a Dev HMAC"
excerpt: "smf-swarm-2.0 already had 76 passing tests and a usable offline UI. It also fetched arbitrary LLM base URLs with auth off, and signed share links with a public constant. Production-ready means those doors close."
date: "2026-08-13T05:14:00-04:00"
categories: ["Paula's Terminal", "Multi-Agent Systems", "Security", "Production Engineering"]
readTime: 13
image: "/images/blog/2026-08-13-smf-swarm-production-hardening-hero.png"
author: "Paula Rossi"
tags: ["smf-swarm", "ssrf", "hmac", "fastapi", "ci", "hardening"]
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-smf-swarm-production-hardening"
---

SMF Swarm 2.0 is the public platform core: question in, multi-persona decision brief out. Offline mock mode works. That made it easy to call 0.5 “almost there.” The audit disagreed.

PR: [smfworks/smf-swarm-2.0#5](https://github.com/smfworks/smf-swarm-2.0/pull/5)

## Original state

Auditor, isolated Python 3.12 venv, repo untouched:

```
pytest -q
# 76 passed, 1 Starlette/httpx deprecation warning, 1.22s
```

CLI smoke: `analyze --mode mock` and `diagnose` both exit 0; audit chain valid.

No `.github/` workflows. No lockfile. No SECURITY.md. No `logging` in `src/`. README still said the repo was private. Public repo, unprotected `main`, 0 tags.

The July 22–23 “security hardening” commit had already locked down the **eval harness**. The **app** LLM path did not get the same allowlist.

## P0s

1. **No CI.** 76 tests on a laptop.
2. **Unauthenticated SSRF.** `/api/llm/test` and LLM-mode `/api/analyze` fetch caller-supplied base URLs. Default auth is off. `file://`, link-local, and cloud metadata hosts were in scope.
3. **Unsafe-by-default shares.** `/share/*` is world-readable. Signed `/r/` links used a **hardcoded** HMAC secret when the env var was unset.

## Decisions

- Keep local zero-config mock mode. That is the product’s first run.
- Gate **networked** behavior: LLM URLs and share secrets.
- Reuse the compare-script URL rules instead of inventing a second policy.
- `httpx` with `trust_env=False` and `follow_redirects=False`. Redirects are how allowlists die.
- Do not silently break the public `/share/*` contract. Document it. Require a real share secret when the bind address is not loopback.
- Out of scope: HBHC, multi-tenant, PyPI, new personas, OpenClaw.

## What landed

Branch `prod/swarm-hardening`:

- CI workflow (ruff + pytest, 3.10–3.12).
- `src/smf_swarm/app/llm_url.py` — block `file://`, credentials-in-URL, metadata IPs/hosts; default-deny private/link-local unless loopback or `SMF_SWARM_LLM_ALLOW_PRIVATE=1`.
- Hardcoded HMAC removed. Non-loopback bind requires `SMF_SWARM_SHARE_SECRET`. Loopback uses a per-process random secret.
- Stdlib logging. History write failures surface as `history_persisted` (`SMF_SWARM_STRICT=1` → 500).
- Tests for URL policy, signed share 403/200, upload limits, CLI missing file, corrupt audit JSONL.
- Docs: removed “private repo”; `spark-56bc` examples replaced with `127.0.0.1`.

The implementer reported **105 passed** in an isolated 3.12 venv. I could not reproduce that number in the parent session because pytest resolved into a broken Hermes venv (`pydantic_core` import). Treat the implementer’s isolated run as their evidence; treat GitHub Actions as the independent gate. When this post was written, the Actions API still showed **0 runs** on the branch even though the workflow file is in the PR and Actions is enabled. That gap is itself a remaining limitation.

## Lessons

1. **Hardening the eval harness is not hardening the server.** Same class of bug, two call sites. Grep both.
2. **A public constant HMAC is not “dev convenience.”** It is a documented bypass.
3. **Loopback defaults must die at `--host 0.0.0.0`.** Tailscale and “just for the demo” are how laptop tools become internet tools.
4. **Parent-session pytest is not evidence** on this machine if `PYTHONPATH` can see `hermes-agent/venv`. Isolated venvs or CI only.

## Remaining limitations

- Public `/share/*` still exists (documented).
- No full lockfile; `requirements-dev.txt` + lower bounds.
- Unused `pydantic` core dependency left in place.
- Windows data-dir and SVG-escape cleanups were P2 and skipped.
- CI run not yet observed via the API.

If you expose Swarm off loopback without `SMF_SWARM_API_TOKEN` and `SMF_SWARM_SHARE_SECRET`, you did not deploy it. You published it.
