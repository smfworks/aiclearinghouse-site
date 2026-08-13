---
slug: "2026-08-13-hardening-praxis-honesty"
title: "30/30, Not 40/40: The Praxis Production Defect Was the Operator Contract"
excerpt: "Praxis 0.30.0 is CI-green, tagged, and 1423 tests deep. AGENTS.md still said 40/40 and QUICKSTART still activated a homeschool pack that left the wheel in 0.29.0. The 0.30.1 pass is a honesty patch."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Praxis", "Documentation", "Production Hardening", "Build in Public"]
tags: ["praxis", "open-core", "evals", "operator-contract", "grok-4.6"]
readTime: 12
image: "/images/blog/2026-08-13-hardening-praxis-honesty.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-praxis-honesty"
---

# 30/30, Not 40/40: The Praxis Production Defect Was the Operator Contract

[Praxis](https://github.com/smfworks/smf-praxis) is the flagship. Liam's audit ran the real verification block on `v0.30.0`:

- pytest: **1423 passed, 22 skipped**
- `praxis eval`: **30/30**
- ruff clean, mypy clean (149 files), architecture 4/4, demo OK
- GitHub Release `v0.30.0` published with wheel and sdist

The suite is not the problem. The operator contract is.

PR: [#7](https://github.com/smfworks/smf-praxis/pull/7). Version: **0.30.1**.

## Original state

After the 0.29.0 vertical extraction, the open-core wheel ships `hybridagent/packs/general/` only. Legal, medical, education, homeschool, and forensic packs live in private repos and register through `praxis.verticals`.

The docs did not move with the cutover.

- AGENTS.md, README, CAPABILITIES, QUICKSTART, RELEASING still said **40/40**.
- CAPABILITIES still listed **vertical × 10**.
- QUICKSTART told operators to `praxis pack activate homeschool`.
- That command now raises `unknown pack 'homeschool'`.
- `PROGRESS.md` header still said **0.28.32** and HS11 in progress.
- `feature_list.json` HS11 verification pointed at deleted `test_homeschool_session*.py` files.
- No SECURITY.md. No CHANGELOG.md.

A new engineer following QUICKSTART would conclude the product was broken. A new agent following AGENTS.md would start HS11 against files that are gone.

## Decisions

1. **Honesty is a production requirement.** If the CLI prints 30/30, the docs print 30/30.
2. **Do not re-bundle extracted packs** to make the old docs true. Update the docs.
3. **Close HS11 in this repo.** The work belongs in `smf-praxis-homeschool`.
4. **Do not add dashboard auth in this pass.** The Command Deck is loopback-only by design. SECURITY.md says so. A half-auth would be worse.
5. **Do not touch the governance spine.** This PR is contract repair.

## Key changes

- README, QUICKSTART, CAPABILITIES, PACKS, RELEASING, clean-state checklist now describe 30/30 and `general`.
- PROGRESS.md current state is 0.30.1 / WIP=0.
- HS11 status `passing` with a verification command that exists.
- SECURITY.md: reporting path, supported versions, dashboard-auth posture.
- CHANGELOG covering 0.29.0 cutover through 0.30.1.
- Tests: base eval count is 30; `activate("homeschool")` raises; bundled pack dirs are `{general}`.

## What we could not change in-tree

Hermes protects `AGENTS.md`. The two-line 40/40 → 30/30 edit was refused without operator approval. The PR calls this out. Until that file is edited in the GitHub UI or an approval lands, AGENTS.md remains the one stale operator surface.

That is itself a lesson. The file every agent reads first is the file the tooling most aggressively freezes.

## Testing

```
pytest tests/test_open_core_docs.py tests/test_evals.py::test_open_core_base_eval_count_is_thirty -q
# 4 passed
```

Full AGENTS.md verification block should be re-run after the AGENTS.md edit.

## Lessons

A green suite plus stale docs is a production incident. Agents will follow AGENTS.md over git history.

Extraction without a docs lockstep leaves a trap: the failure mode looks like a regression (`unknown pack`) when it is actually a completed migration.

WIP=1 only works if `in_progress` verification commands still exist. Dead verification is hidden blocked work.

## Remaining work

- AGENTS.md 40/40 (blocked on approval)
- Command Deck still has no built-in auth. Documented. Do not bind it to a LAN without a front door.
- `daemon.py` and `persistence.py` remain god files. Out of scope for 0.30.1.
- Vertical evals belong in the extracted packages. Do not restore them here to make an old number true.

Production-ready for Praxis, today, means: the open-core contract is true, the spine is intact, and a new engineer is not sent into a deleted pack.
