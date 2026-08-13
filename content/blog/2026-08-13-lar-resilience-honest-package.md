---
slug: "2026-08-13-lar-resilience-honest-package"
title: "LAR: A Production-Grade Claim We Could Not Import"
excerpt: "lar-agent-resilience advertised Agent, ModelRouter, and Checkpoint. The package __init__ was empty. The code imported lar.* and there was no lar package. Six tests passed — on a skill demo. We made the README true."
date: "2026-08-13T05:16:00-04:00"
categories: ["Paula's Terminal", "Hermes AI", "Production Engineering"]
readTime: 13
image: "/images/blog/2026-08-13-lar-resilience-honest-package-hero.png"
author: "Paula Rossi"
tags: ["lar", "resilience", "packaging", "failover", "honesty", "hardening"]
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-lar-resilience-honest-package"
---

The GitHub description said: “A production-grade, open-source reference implementation for resilient agent design on Linux.”

The auditor’s first import said: `ModuleNotFoundError`.

PR: [smfworks/lar-agent-resilience#2](https://github.com/smfworks/lar-agent-resilience/pull/2)

## Original state

```
pytest -v --tb=short
# 6 passed in 0.17s
```

Those six tests exercise `skills/resilience-skill/scripts/failover.py` only. `src/` was untested.

README promised:

```python
from agent_resilience import Agent, ModelRouter, Checkpoint
```

`src/agent_resilience/__init__.py` contained a comment. Runtime files did `from lar.config import ...`. There is no `lar` package. `tools.py` shadowed `tools/`, so builtin tools were unimportable. `pyproject.toml` named the project `local-agent-runtime`, had no build-system, no scripts. `ExecTool` used `shell=True` with `python` / `git` / `curl` on the default allowlist.

P0 count from the audit: **8**. The production-grade claim did not hold.

## Decisions

- **One import path:** `agent_resilience`. Rewrite every `from lar.`.
- **Prefer deletion over finishing unused surface.** Observatory, TUI, benchmark, memory, dashboard HTML went away rather than shipping more unwired code.
- **Promote the skill router into the library.** Two `ModelRouter`s is how READMEs rot.
- **Public `Agent` that failsover against a fake LLM.** If you cannot test model death without Ollama, you cannot claim resilience.
- **Exec: `shell=False`, argv allowlist, drop python/git/curl defaults.**
- **Fetch: https only; deny `file://` and private/loopback.**
- **No OpenClaw / clawhub expansion.** Lab policy. The existing skill becomes a thin wrapper.

## What landed

Package `agent-resilience` **0.2.0**. Real exports: `Agent`, `ModelRouter`, `Checkpoint`. `lar` console script. Build-system and `packages.find`. Linux CI on 3.11 and 3.12.

Identity no longer TypeErrors on camelCase / string timestamps. Checkpoint save/load is tested. Tool safety tests reject pipes, `file://`, and loopback fetch.

Implementer verification on this Windows host: **30 passed in 0.30s**, ruff clean.

**Independent GitHub Actions:** [CI run 31684553251](https://github.com/smfworks/lar-agent-resilience/actions/runs/31684553251) — `test (3.11)` and `test (3.12)` **completed/success**. GitGuardian also passed. This is the only one of the four hardening PRs whose Actions run I could confirm via the API at publish time.

## Testing approach

New tests are failure-mode tests, not happy-path tourism:

- packaging import
- identity HMAC / timestamps
- checkpoint resume
- agent failover with an injectable fake LLM
- exec/fetch jail

The original six skill tests now import the library module.

## Lessons

1. **`pytest` green is not a product.** Six tests on a demo script plus a README written for a future API is a design note.
2. **Import the documented names in CI.** `from package import AdvertisedSymbol` is the cheapest contract test in software.
3. **`tools.py` next to `tools/` is a footgun.** Python will pick the module. Your package data will not.
4. **Delete unused dashboards.** Unwired Observatory code is not optionality. It is a second lie.
5. **shell=True + a generous allowlist is RCE** the first time an agent is pointed at untrusted text.

## Remaining limitations

- Consolidation “recovery” is completion, not agency gain. Do not market it as such.
- Live Ollama path is untested here; failover is proven with a fake backend.
- The cron-misfire `CircuitBreaker` is still not the model-failover path. Naming debt remains.
- Linux-first; Windows is not a required CI target.

We did not make LAR legendary. We made it **importable**, **tested at the failure modes it claims**, and **honest**. That is what production-grade actually means.
