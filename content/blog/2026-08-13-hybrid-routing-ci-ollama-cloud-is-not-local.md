---
slug: "hybrid-routing-ci-ollama-cloud-is-not-local"
title: "CI for Hybrid Routing: ollama-cloud Is Not Local"
excerpt: "hermes-plugin-hybrid-routing already had 400+ tests and a fail-closed egress model. It had no CI. This post adds the matrix and locks the ollama-cloud false-local contract."
date: "2026-08-13"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hybrid-routing-ci-ollama-cloud-is-not-local"
categories: ["AI Agents", "CI/CD", "Production Hardening"]
tags: ["hermes", "routing", "egress", "ollama", "ci", "fail-closed"]
readTime: 8
image: "/images/blog/2026-08-13-hybrid-routing-ci.svg"
---

`smfworks/hermes-plugin-hybrid-routing` at kickoff SHA `ddf6e7647caf` was already a serious plugin: blank-by-default models, operator-attested `model_egress`, fail-closed sensitive routes, and a large pytest suite. What it did not have was CI.

A production routing path with no pull-request gate is a demo that happens to live on `main`.

Praxis and Swarm hardening belong to a separate official program. This card did not open a second PR on those remotes.

## Original state

| Fact | Evidence |
|------|----------|
| Version | 1.1.0 |
| Tests | `tests/test_router.py`, `test_plugin.py`, `test_metadata.py` |
| CI | None |
| `SECURITY.md` | Missing |
| Locality rule | Exact `model_egress: local` only. Names do not imply local. |

The packaged default already documents the trap:

```yaml
# "local" is an operator attestation; verify the provider's real endpoint.
model_egress:
  ollama-cloud/glm-5.2: external
```

There was no test that set `local_only_model: ollama-cloud/glm-5.2` with an empty registry and asserted a block.

## Decision

1. Add `.github/workflows/ci.yml`: pytest on Ubuntu 3.10/3.12, Windows 3.12, macOS 3.12; ruff; mypy; bandit.
2. Add `SECURITY.md` and `CONTRIBUTING.md`.
3. Lock the false-local contract in pytest.

The new test does not change the router. It prevents a future "helpful" inference from provider names.

```python
def test_ollama_cloud_name_is_not_inferred_local_for_sensitive_routes(tmp_path):
    def configure(config):
        config["tiers"]["balanced"]["model"] = "ollama-cloud/glm-5.2"
        config["sensitivity"]["local_only_model"] = "ollama-cloud/glm-5.2"
        config["model_egress"] = {}

    decision = configured_router(tmp_path, configure).classify(
        "password=private-value"
    )
    assert decision.sensitivity == "sensitive"
    assert decision.model == ""
    assert decision.disposition == "block"
    assert decision.egress != "local"
```

## What changed

PR: [smfworks/hermes-plugin-hybrid-routing#6](https://github.com/smfworks/hermes-plugin-hybrid-routing/pull/6)

CI, `SECURITY.md`, and packaging gates already landed in [#2](https://github.com/smfworks/hermes-plugin-hybrid-routing/pull/2) (`16a2e06`, v1.1.1) while this wave was in review. The remaining unique change is the locality regression:

```text
f313c8b  test: ollama-cloud names are not inferred as local
```

Verification on this machine:

```text
pytest -q
# 428 passed in 8.88s
```

That count includes the new test. It is not a README number.

## Remaining limits

- CI does not run a live Hermes `PluginManager` install. Dual-surface plugin verification stays a release-gate procedure, not this PR.
- `model_egress: local` is still an operator attestation, not a network probe. The plugin cannot prove the endpoint is loopback.
- Bandit on the plugin package is a static baseline, not a substitute for the egress tests.

## Lesson

A routing plugin that already fails closed still needs a gate that will fail a future PR that "just treats ollama as local." Tests without CI are a local habit. CI without that one test is a green check that misses the production bug.
