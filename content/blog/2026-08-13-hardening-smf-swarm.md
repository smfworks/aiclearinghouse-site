---
slug: "2026-08-13-hardening-smf-swarm"
title: "Fail Closed: Taking SMF Swarm 2.0 from 76 Green Tests to 0.5.1"
excerpt: "The public Swarm core ran 76 tests and still shipped a hardcoded share HMAC, echoed LLM base URLs from /api/health, and had no CI. This is the 0.5.1 production pass."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Security", "AI Agents", "Production Hardening", "Build in Public"]
tags: ["smf-swarm", "ssrf", "hmac", "fastapi", "grok-4.6"]
readTime: 12
image: "/images/blog/2026-08-13-hardening-smf-swarm.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-smf-swarm"
---

# Fail Closed: Taking SMF Swarm 2.0 from 76 Green Tests to 0.5.1

[SMF Swarm 2.0](https://github.com/smfworks/smf-swarm-2.0) is the public platform core for governed multi-persona analysis. Commercial verticals stay private. The July 22–23 session already closed a credential leak. The Grok 4.6 hardening pass found a different class of problem: fail-open defaults on a public repo.

PR: [#2](https://github.com/smfworks/smf-swarm-2.0/pull/2). Version: **0.5.1**.

## Original state

Aiona's audit ran the real suite:

- `pytest -q` — **76 passed**
- `mypy src` — clean (17 files)
- Unconfigured ruff — 165 annotation nits, not the production issue
- **No `.github/workflows`**
- README still said the repo was private
- `docs/PHASE1_STATUS.md` still advertised package 0.1.0 and 6 tests

The code defects that mattered:

- `share_secret()` fell back to `"smf-swarm-dev-share-secret"`. Anyone who read the source could forge `/r/{run_id}?s=`.
- `/api/llm/test` and analyze fetched operator-supplied URLs with no scheme or host check. `file:`, userinfo, `169.254.169.254`, and `metadata.google.internal` were legal.
- `/api/health` echoed `SMF_SWARM_LLM_BASE_URL`.
- Uploads used the filename as given. No basename. No extension allowlist.
- History JSONL used the process umask.

Optional API auth is the documented open-core model. We did not flip that. Fail-open *secrets* and *SSRF* are not a product philosophy. They are bugs.

## Decisions

1. **Share HMAC fail-closed.** If neither `SMF_SWARM_SHARE_SECRET` nor `SMF_SWARM_API_TOKEN` is set, do not sign `/r/` links. `/r/` returns 403. Unguessable `/share/{id}` remains the public share path.
2. **Validate LLM URLs.** http/https only. No credentials in the URL. No metadata hosts. No link-local. Localhost stays allowed for local models.
3. **Health reports booleans.** `has_llm_base_url`, not the URL.
4. **Do not modernize 165 UP* nits.** Gate on `E,F,W,I,B,S`. Correctness over annotation fashion.
5. **Keep optional auth.** Verticals can be stricter. The public core must not pretend it is a SaaS control plane.

## Key changes

- `url_policy.validate_llm_base_url`
- Upload jail: basename + `{.csv,.json,.txt,.md,.tsv,.log}`
- POSIX history directory 0700, file 0600
- `dev` extra now installs ruff and mypy
- CI: ruff + mypy + pytest + `smf-swarm analyze --mode mock` on 3.10 and 3.12
- SECURITY.md states the residual risks in plain language
- PHASE1_STATUS labeled as history so 0.1.0 / 6 tests cannot be mistaken for current

## Testing

```
ruff check src tests     # clean
mypy src                 # 18 files, no issues
pytest -q                # 91 passed
smf-swarm analyze -q "Will demand grow?" --mode mock
```

New tests cover fail-closed share signing, the URL reject matrix, health non-leak, exe upload reject, and POSIX perms.

## Lessons

A public default HMAC is a published key. Do not ship one "for local convenience."

Health endpoints are reconnaissance. If an operator set a lab hostname, `/api/health` should not repeat it.

Docs that still say "private" after a public cutover are a security document, not a copy issue. They teach the wrong threat model.

## Remaining work

- No coverage fail-under. Not required for 0.5.1.
- Engine still has a lab default base URL in one constructor path. Left out of this PR on purpose.
- Windows history ACLs are not implemented.
- Binding past loopback without a token is still possible. SECURITY.md calls that an operator choice.

Production-ready for this repo means: mock-first, CI-gated, no public HMAC, no SSRF toy, docs that match HEAD.
