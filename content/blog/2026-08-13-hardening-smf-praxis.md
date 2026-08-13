---
slug: "2026-08-13-hardening-smf-praxis"
title: "Policy Hooks Cannot Bypass the Spine: Hardening Praxis to 0.30.2"
excerpt: "Liam's honesty pass made the open-core contract true. Aiona then re-ran the suite and the live broker probes. PR #7 is 0.30.2: 1429 passed, evals 30/30, governance spine unchanged."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Production"]
tags: ["hardening", "smf-praxis"]
readTime: 8
image: "/images/blog/2026-08-13-hardening-smf-praxis.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-smf-praxis"
---

# Policy Hooks Cannot Bypass the Spine: Hardening Praxis to 0.30.2

[Praxis](https://github.com/smfworks/smf-praxis) was already a tagged, CI-green open-core agent at `v0.30.0`. Liam's audit did not find a red runtime. It found a stale operator contract. Aiona then independently reviewed the harden on `harden/smf-praxis`.

PR: [#7](https://github.com/smfworks/smf-praxis/pull/7) (open). Head: `a5eb186`. Version: **0.30.2**.

This is the mission record after that second pass. An earlier note on the honesty defect is [30/30, Not 40/40](/blog/2026-08-13-hardening-praxis-honesty).

## Original state

Audit tree: clean `main` at `b9f78dd`, tag `v0.30.0`. Fresh venv. Real commands, not inferred:

- pytest (fuzz parsers ignored, per AGENTS.md): **1423 passed, 22 skipped** in 55.62s
- `praxis eval`: **30/30** (no `vertical` category)
- ruff clean; mypy 149 files; architecture 4/4; demo destructive DENIED
- GitHub Release `v0.30.0` published with wheel and sdist

The wheel ships `hybridagent/packs/general/` only. Legal, medical, education, homeschool, and forensic packs left in the 0.29.0 extraction.

Docs still described the pre-cutover product:

- AGENTS.md, README, CAPABILITIES, QUICKSTART, RELEASING said **40/40**
- CAPABILITIES still listed **vertical × 10**
- QUICKSTART and README told operators to `praxis pack activate homeschool`
- that command already raises `unknown pack 'homeschool'`
- `PROGRESS.md` still headed **0.28.32** with HS11 in progress
- no SECURITY.md, no CHANGELOG.md

The governance spine (broker, egress firewall, approval gates, policy hook) was not the gap. We did not touch it to make a test pass.

## Decisions

1. **Make the contract true.** If the CLI prints 30/30, the docs print 30/30. Do not re-bundle extracted packs to rescue the old number.
2. **Close HS11 in this repo.** The work belongs in the extracted homeschool package.
3. **Add SECURITY.md and CHANGELOG.md.** State dashboard-auth posture instead of adding a half-auth to the Command Deck.
4. **Pin honesty with tests.** Bundled pack dirs are `{general}`; `activate("homeschool")` raises; isolated base eval total is 30.
5. **Leave the spine alone.** Aiona's review required proof that a policy-hook allow cannot bypass the kill-switch, the allowlist, or egress.

## What landed

0.30.1 is the honesty patch. 0.30.2 records the verification evidence on the same branch.

- README, QUICKSTART, CAPABILITIES, PACKS, RELEASING, and the clean-state checklist now describe 30/30 and `general`
- `feature_list.json` HS11 is closed as extracted; WIP=0
- SECURITY.md: reporting path, supported versions, loopback Command Deck with no built-in HTML auth
- CHANGELOG covers 0.29.0 cutover through 0.30.2
- contract tests for eval count, bundled packs, and the dead `homeschool` activate path

Hermes still protects `AGENTS.md`. The two-line 40/40 comment edit was refused without operator approval. The commands in that file are correct. The comments are not.

## Independent review

Aiona cold-read `main...HEAD` (17 files), confirmed the governance range against `main` was empty, re-ran the AGENTS.md verification block, and drove live broker probes. PR #7 head matches `a5eb186`.

Reproduced on her pass:

- pytest: **1429 passed, 22 skipped** in 57.60s
- evals: **30/30**
- focused broker honesty: **101 passed**
- ruff pass; mypy 149 files; architecture 4/4
- demo: send HELD; injection treated as data; destructive DENIED
- `praxis --version`: 0.30.2

Live probes that passed: `send_held`, `destructive_dual_distinct_approvers`, `hook_allow_cannot_bypass_killswitch`, `hook_allow_cannot_bypass_allowlist`, `hook_allow_cannot_bypass_egress`, `broken_hook_fails_closed`, `hook_deny_tightens_read`, `default_mode_enforced`.

A hook that returns allow does not get to skip the kill-switch. That is the production claim this PR is allowed to make.

## Testing

```
pytest --ignore=tests/test_fuzz_parsers.py
# 1429 passed, 22 skipped

praxis eval
# 30/30 passed OK

ruff check hybridagent/
mypy hybridagent --ignore-missing-imports
scripts/check_architecture.py
# 4/4 PASS

praxis demo
# destructive DENIED
```

No output above is invented. Aiona reproduced the block after Liam recorded it.

## Residual work (review, non-blocking)

- AGENTS.md comments still say 40/40 (P2). Operator edit in the GitHub UI.
- PROGRESS.md still has a leftover pre-extraction Phase 11 paragraph (P2).
- Honesty tests are narrow string checks. They would not have caught those leftovers (P2).
- Command Deck HTML has no built-in auth. Loopback default is documented. Do not bind it to a LAN without a front door (P2).
- Architecture `LOCAL_MODULES` still lists extracted homeschool modules (P3). No runtime effect.

## Lessons

A green suite plus stale docs is a production incident. Agents follow AGENTS.md over git history.

Extraction without a docs lockstep produces a fake regression: `unknown pack` looks like a break when it is a finished migration.

Independent review is not a second changelog. It is a second set of commands. The useful part of Aiona's pass is the live probe list, especially hook-allow versus kill-switch, allowlist, and egress.

WIP=1 only works if the `in_progress` verification command still exists.

Production-ready for Praxis, today, means the open-core contract is true, the spine is intact, and a new engineer is not sent into a deleted pack.
