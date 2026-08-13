---
slug: "2026-08-13-g46-harbor-challenge-hardening"
title: "Harbor 1.1.0: Making a Lofoten Plugin Production-Honest"
excerpt: "hermes-plugin-harbor already had a clean decision table and 15 passing tests. It did not have CI, and it advertised outcome logging that did not exist. Here is how we raised the bar without touching the contract."
date: "2026-08-13T05:10:00-04:00"
categories: ["Paula's Terminal", "Hermes AI", "Production Engineering"]
readTime: 12
image: "/images/blog/2026-08-13-harbor-production-hardening-hero.png"
author: "Paula Rossi"
tags: ["harbor", "hermes", "production", "ci", "plugins", "challenge"]
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-g46-harbor-challenge-hardening"
---

Harbor is the smallest of the four repos we hardened on 13 August 2026, and the most finished as software. That is exactly why it was a good first patient. A plugin can look “done” because the demo path is green and still fail a production bar.

PR: [smfworks/hermes-plugin-harbor#2](https://github.com/smfworks/hermes-plugin-harbor/pull/2)

## Original state

`hermes-plugin-harbor` is an advisory solo / pair / swarm router. No hooks. Stdlib only. The decision table is the same one we published in [The Coordination Cost](https://www.smfclearinghouse.com/blog/2026-08-08-coordination-cost-framework).

What I actually ran on HEAD before the change:

```
python -m pytest -q --tb=short
# 15 passed in 0.04s
```

There was no `.github/workflows` directory. GitHub showed only a dependency-graph workflow. Version was `1.0.0` with a Beta classifier. `PLUGIN_DESCRIPTION` claimed “outcome logging.” The code does not log outcomes. Unexpected exceptions were serialized as `str(e)` back to the tool caller.

## Problems that mattered

None of them crashed the engine. That is the trap.

1. **No test CI.** Fifteen tests that only run on one laptop are a habit, not a gate.
2. **Contract drift.** “Outcome logging” in the description is a lie. Lies in plugin metadata become agent beliefs.
3. **Exception leakage.** Tool surfaces should fail closed with a generic error, not a stack string.
4. **Duplicate manifests.** Root `plugin.yaml` and packaged `hermes_harbor/plugin.yaml` can drift. They already needed a version-alignment test.
5. **Missing operator docs.** No SECURITY, CONTRIBUTING, CHANGELOG, or architecture note.

P0 runtime defects: none found. P1: the list above.

## Decisions

- **Do not change the decision table.** The table is a published contract (skill + blog + `self_test()`). Hardening is not an excuse to retune cues.
- **Do not add hooks.** Cache-safety is the product.
- **Do not invent outcome logging** just to make the description true. Delete the claim.
- **Keep both manifests** and add a test that versions match. A clever single-source generator is future work.

## What changed

Release **1.1.0** on branch `prod/harbor-hardening`:

- GitHub Actions: ruff + pytest on 3.10 / 3.11 / 3.12, plus a wheel package-data check for `plugin.yaml`, thresholds, and the skill.
- Handlers log unexpected exceptions and return `{"success": false, "error": "internal error"}`.
- Tests grew from 15 to **21** (CLI handler, `register()` against a fake ctx, thresholds, package data, version alignment, no exception leak).
- SECURITY.md, CONTRIBUTING.md, ARCHITECTURE.md, CHANGELOG.md, Dependabot.
- Classifier: Production/Stable.

Local verification after the change:

```
python -m pytest -q --tb=short   # 21 passed in 0.05s
python -m ruff check .           # All checks passed
```

An independent reviewer (fresh context, fail-closed) returned `passed: true` with no security or logic blockers.

## Testing approach

The existing `self_test()` suite is the behavioral contract. New tests pin surfaces the old suite never touched: CLI exit codes, plugin registration, and the internal-error path. We did not mock the decision table. We did not change cue lists to make a case greener.

## Lessons

A green unit suite is not production-ready. The cheapest production bugs in agent plugins are **false capabilities** in descriptions and **missing CI**, not off-by-one classifiers.

Version numbers that live in four files will drift. If you cannot generate them, test them.

## Remaining limitations

- Default branch is still `master`.
- GitHub Actions is enabled on the repo; as of this writing the first workflow run had not yet appeared in the Actions API after the PR opened. Local pytest + ruff are the verified evidence. Do not treat a missing check run as a pass.
- Thresholds YAML is metadata for `harbor_status`, not the engine.
- No telemetry by design.

Quality over speed. Harbor did not need a rewrite. It needed to stop claiming things it does not do, and to run its tests somewhere other than my shell.
