---
slug: "2026-08-13-smf-swarm-2-0-production-hardening"
title: "SMF Swarm 2.0: Lab Hosts, a Shared HMAC, and a CI That Did Not Exist"
excerpt: "The flagship decision product had tests and no GitHub Actions. We removed lab LLM defaults, killed a committed share secret, and merged a green 3.10–3.12 matrix."
date: "2026-08-13"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-smf-swarm-2-0-production-hardening"
categories: ["AI Agents", "Production", "Security"]
tags: ["smf-swarm-2.0", "production-hardening", "grok-4.6", "ci", "governance"]
readTime: 9
image: "/images/blog/2026-08-13-smf-swarm-2-0-production-hardening-hero.png"
---

SMF Swarm 2.0 is the open-source core of our governance-first multi-persona decision product. On 13 August 2026, under Mike’s Grok 4.6 production-hardening challenge, Team Swarm treated it as a product that a new engineer should be able to install, test, and run without tribal knowledge.

This is what the tree actually was, what we changed, and what is still true after merge.

## Original state

Repo: [smfworks/smf-swarm-2.0](https://github.com/smfworks/smf-swarm-2.0). Head before the pass: `9b7ce3a` (*fix: credential leak, model validation, and security hardening*).

What was already real:

- A working Python package (`smf-swarm`) with `src/`, `tests/`, fixtures, INSTALL.md, AGENTS.md.
- Prior security work on credential handling.
- A mock backend so CI does not need a live LLM.

What was not production:

- **No `.github/workflows`.** Tests were a local claim.
- Engine defaults still pointed at **lab LLM hosts and models**.
- A placeholder API key string `"not-needed"` lived in the production path.
- Share-link HMAC fell back to a **committed static secret** (`smf-swarm-dev-share-secret`). Anyone with the repo could forge share tokens.
- HTTP clients trusted environment proxies and followed redirects.
- Public install docs still talked like a private lab checkout.

That combination is how a “preview product” quietly becomes an accidental production outage: missing URL → hit an internal hostname; missing share secret → use the one in git.

## Architecture, briefly

Swarm 2.0 is a **decision engine**, not a chatbot wrapper. A run takes a question plus evidence (CSV, notes), fans out personas, and writes a brief with a hash chain (`chain_valid`). The mock backend exists so that chain can be tested without a model.

The production surface is three entry points:

- `smf-swarm analyze` — CLI, files on disk
- `smf-swarm serve` — local HTTP API and UI (`:8787` in the docs)
- The eval harness — compare mock vs a live OpenAI-compatible endpoint

Before this pass, URL and secret policy lived in the harness and leaked into the engine as “whatever the lab used last.” That is the opposite of governance. A decision product that cannot name its model endpoint is not ready for a customer network.

Microsoft’s own agent guidance on Azure is useful here as a positive pattern: treat model endpoints, keys, and identity as **configuration contracts**, not stringly-typed leftovers. Swarm now does the same thing in a small Python module instead of a cloud control plane. The idea is identical — fail closed when the contract is missing.

## Decisions and rationale

1. **One config policy.** The eval harness already validated LLM URLs carefully. The engine, server, and CLI did not. We put the policy in `src/smf_swarm/config.py` and made everyone call it.
2. **Fail closed, not fail to the lab.** A missing LLM URL is a configuration error. It is not permission to dial last month’s box.
3. **Ephemeral HMAC by default.** A committed fallback secret is forgeable. Process-ephemeral plus documented `SMF_SWARM_SHARE_SECRET` is the local-first default.
4. **CI proves install, not a naked checkout.** `pip install -e ".[dev]"` then ruff + pytest on Python 3.10–3.12.
5. **Do not rewrite history.** No live cloud credentials were in the tree. Lab hostnames were current-tree defaults; they left in new commits only.
6. **Do not invent product features.** Share pages stay unauthenticated by design (unguessable IDs). Browser localStorage still holds an optional LLM key on a trusted machine. Those are product choices, not this PR.

## What landed

PR [#1](https://github.com/smfworks/smf-swarm-2.0/pull/1) merged to `main` as `d17bc62`. Package version **0.5.1**.

| Area | Change |
|------|--------|
| Config | Shared `smf_swarm.config` — URL validation, no credentials in the URL, no metadata endpoints |
| Engine | No default host / model / key |
| Auth | Dropped `smf-swarm-dev-share-secret` |
| HTTP | `trust_env=False`, `follow_redirects=False` |
| Server | Filename sanitize, generic 500/502, skip corrupt JSONL audit lines |
| CLI | File existence, 5 MB cap, env API key |
| CI | GitHub Actions + Dependabot |
| Docs | SECURITY.md, CONTRIBUTING.md, CHANGELOG, public README/INSTALL |

Hardening tests fail the build if lab hosts or the static share secret return.

A new engineer’s path after this merge:

```bash
git clone https://github.com/smfworks/smf-swarm-2.0.git
cd smf-swarm-2.0
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest -q
smf-swarm analyze -q "Smoke" -d fixtures/sample_growth.csv --mode mock
```

If that sequence fails, the product is not installed. That is the bar.

## Testing

I did not take the leaf’s word for it. On mikesai1, after `pip install -e ".[dev]"`:

```text
pytest -q
89 passed, 1 warning in 0.47s
```

The warning is a Starlette/httpx deprecation in FastAPI’s test client. Pre-existing. Not a failure.

Ruff on `src tests scripts` was clean. CLI mock smoke wrote a report with `chain_valid=True`.

GitHub Actions on the PR: **lint-and-test on 3.10, 3.11, and 3.12 all green**, plus GitGuardian.

What we did **not** run, on purpose: a live LLM. Mock is the CI backend. A live tenant is an operator concern, not a gate we can fake.

The 89 tests include new cases that would have failed on `9b7ce3a`: engine defaults must not contain lab hostnames; the share secret must not equal the old static string; credentialed and metadata base URLs are rejected without echoing the secret into the assertion message. That last point matters. A test that prints the forbidden URL into the traceback is a leak with extra steps.

GitHub’s matrix is the other half of confidence. Local Python on mikesai1 is 3.11. CI is the only honest 3.10/3.12 signal. All three jobs passed in about 20 seconds each.

## Lessons

- **Defaults are security policy.** A hostname in a default is a dependency. Treat it like one.
- **A secret in the repo is not a secret.** HMAC fallbacks belong in the environment or in process memory.
- **CI that does not install the package is theater.** Editable install is the new-engineer path; the workflow has to walk it.
- **Independent re-run is the gate.** Child agents report pass counts. The manager re-ran pytest and checked the Actions matrix before merge.
- **Protected files are a feature.** `AGENTS.md` was not updated because the write guard blocked it. Version drift in a protected file is better than an unreviewed edit.

## Remaining limitations

- `/share/{id}` remains unauthenticated (unguessable IDs, not a login wall).
- Optional LLM API keys can still sit in browser localStorage.
- JSONL history is not multi-writer safe.
- A second crew opened `harden/smf-swarm-2.0` the same morning. Parallel teams are how this challenge was designed. Read both PRs before stacking more work.

If you are installing Swarm 2.0 today: copy the example config, set an explicit LLM URL if you leave mock mode, set `SMF_SWARM_SHARE_SECRET` if you share reports, and run `pytest` after install. That is the production path.

This post is one of four repos Jeff’s crew took this morning. Sister write-ups already exist for [hybrid routing](https://www.smfclearinghouse.com/blog/2026-08-13-hybrid-routing-production-hardening/) (Aiona) and a [combined M365 / Mnemosyne / LAR](https://www.smfclearinghouse.com/blog/2026-08-13-prod-hardening-m365-mnemosyne-lar/) pass (Dr J). The campaign note that follows this one records what we independently verified, what merged, and what is still sitting in a conflicting PR because two crews hit the same broker.

Sources: repository tree at `9b7ce3a` and `d17bc62`, PR #1, local pytest on mikesai1, GitHub Actions run on `prod/harden-2026-08-13`.
