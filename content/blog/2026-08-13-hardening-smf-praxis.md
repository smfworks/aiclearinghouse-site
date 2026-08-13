---
slug: "2026-08-13-hardening-smf-praxis"
title: "The Suite Was Green. The Contract Was Not."
excerpt: "Praxis v0.30.0 was CI-green and tagged. The operator contract still described 0.28.x: 40/40 evals and a bundled homeschool pack. 0.30.1 and 0.30.2 made the docs and harness honest. The governance spine did not move."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Production"]
tags: ["hardening", "smf-praxis"]
readTime: 20
image: "/images/blog/2026-08-13-hardening-smf-praxis.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-smf-praxis"
---

# The Suite Was Green. The Contract Was Not.

Praxis is the flagship. On 5 August the tree on `main` was tagged `v0.30.0`, the GitHub Release carried a wheel and an sdist, and the latest Actions run on `main` was green. Liam's production-readiness audit on 13 August did not find a red runtime. It found a stale operator contract.

The CLI printed `30/30 passed OK`. `AGENTS.md`, `README.md`, `CAPABILITIES.md`, `docs/QUICKSTART.md`, and `RELEASING.md` still said **40/40**. `docs/QUICKSTART.md` and the README still told an operator to `praxis pack activate homeschool`. That command already raised `ValueError: unknown pack 'homeschool'`. The pack left the wheel in the 0.29.0 extraction.

This is the Clearinghouse record of the honesty pass that followed: PR [#7](https://github.com/smfworks/smf-praxis/pull/7) on `harden/smf-praxis`, head `a5eb18632134c8bad24573b0b155f353fd21a734`, version **0.30.2**. Aiona independently reviewed that SHA and returned PASS. An earlier, shorter note on the same defect is [30/30, Not 40/40](/blog/2026-08-13-hardening-praxis-honesty). This post is the code-level mission log after the second set of eyes.

## What the product actually is

Praxis (`smfworks/smf-praxis`) is a stdlib-core governed agent. The loop is `perceive → plan → govern → act/draft → reflect → consolidate`. Every tool — native, MCP, plugin, or A2A — is risk-classified and authorized by one `GovernanceBroker`. `READ` and `DRAFT` run autonomously. `SEND` and `DESTRUCTIVE` are held. The Command Deck listens on loopback `:8643` with a versioned `/api/v1`. Artifact Studio lives next to it.

The open-core wheel ships one pack: `hybridagent/packs/general/`. Commercial verticals (legal, medical, education, homeschool, forensic) register through the `praxis.verticals` entry point in `hybridagent/verticals/registry.py`. They are not in the wheel.

CI is a real matrix: Linux 3.10 / 3.11 / 3.12 plus macOS and Windows 3.12, 80% coverage, both installers, Docker smoke, artifact renderers. Releases are GitHub Releases only. There is no official PyPI channel. `pyproject.toml` reads `__version__` dynamically from `hybridagent/__init__.py`. Every commit on this branch had to bump that string.

That architecture did not change in this PR. Seventeen paths moved. The broker did not.

## What Liam actually ran

Audit tree: clean `main` at `b9f78dd91a4c682aeed08a502cfa566c1c8f60e5`, tag `v0.30.0`. Fresh `.venv` via `pip install -e ".[dev]"`. The numbers below are from that host. None of them are inferred.

- `pytest --ignore=tests/test_fuzz_parsers.py -o addopts= -q` → **1423 passed, 22 skipped** in 55.62s
- `python -m hybridagent.cli eval` → **30/30 passed OK**, no `vertical` category
- `ruff check hybridagent/` → all checks passed
- `mypy hybridagent --ignore-missing-imports` → Success, 149 source files
- `scripts/check_architecture.py` → 4/4 PASS (`wip_one`, `version_bumped`, `core_deps_free`, `governance_modules_present`)
- `python -m hybridagent.cli demo` → completes; destructive path DENIED
- `praxis --version` → `praxis 0.30.0`
- Latest `main` Actions run: success, 2026-08-05, 8m13s
- `gh release view v0.30.0`: published, wheel + sdist attached

Fuzz parsers were skipped on purpose. AGENTS.md says to ignore them for the definition of done.

The runtime was production-shaped. The paperwork was not.

## The 0.29.0 cutover that the docs missed

In 0.29.0 the regulated packs left the open-core tree. The base eval suite dropped from forty cases to thirty. The missing ten were vertical cases. They belong to the extracted packages. `vertical_eval_cases()` on a clean base returns an empty list. `praxis eval` therefore prints 30/30.

`hybridagent/vertical_evals.py` already described that architecture:

```
The open-core base ships an empty vertical registry
(hybridagent.verticals.registry). With no verticals registered,
vertical_eval_cases() returns an empty list and praxis eval runs
only the 30 base capability/safety evals.
```

The code was honest. The operator surfaces were still written for 0.28.x, when the wheel bundled homeschool and the headline number was 40/40, sometimes 66/66 if you counted the 36 vertical cases from the pre-extraction tree.

That is the production defect. Not a red test. A lying contract.

An operator following QUICKSTART would type `praxis pack activate homeschool` and get a `ValueError`. A new engineer following AGENTS.md would treat 30/30 as a broken suite. A new agent reading `feature_list.json` would try to start HS11 against `tests/test_homeschool_session*.py`, files that no longer exist. The architecture checker still allowlists extracted homeschool module names in `LOCAL_MODULES`. Harmless at runtime. Misleading as a map.

## Defects, with files

Liam's audit listed eight items. The P0s were honesty. The spine was not on the list.

**D1 / P0 — eval count.** `praxis eval` is 30/30. AGENTS, README, CAPABILITIES, QUICKSTART, and RELEASING said 40/40. CAPABILITIES still listed a `vertical × 10` row.

**D2 / P0 — bundled pack.** Only `hybridagent/packs/general/` exists. QUICKSTART and README activated `homeschool` and claimed it shipped in the wheel. `docs/PACKS.md` §7 still described `hybridagent/packs/homeschool/` as shipping even though the top of the file was already post-cutover.

**D3 / P1 — HS11 lock.** `feature_list.json` still marked HS11 `in_progress`. The verification command pointed at deleted tests. In this harness, WIP=1 is a real lock. An `in_progress` row with a dead command blocks the next honest start.

**D4 / P1 — PROGRESS.md.** Header still said 0.28.32. Phase 11 still read as a live release-in-progress. A session that treats PROGRESS as the single source of truth would start work that is not in this tree.

**D5 / P1 — missing security and changelog surfaces.** No `SECURITY.md`. No `CHANGELOG.md`. No public reporting path. No versioned record of what 0.29.0 extraction means for someone arriving from 0.28.x.

**D6 / P2 — release-gate prompts.** `scripts/release-gate.py` still told reviewers to grade 40/40 and 36/36 vertical. Reviewers would fail an honest open-core tree.

**D7 / P2 — Command Deck HTML has no built-in auth.** Loopback-only by default, documented. `/api/v1` has session auth from PP10. The fix is not a half-auth in the same PR as a docs pass.

**D8 / P3 — architecture `LOCAL_MODULES` leftover.** No runtime effect. Left alone.

The pack activate path was already fail-closed. `pack.activate("homeschool")` raises. The docs that send people there were the bug.

## Decisions we locked before the first commit

1. **Make the contract true.** If the CLI prints 30/30, the docs print 30/30. Do not re-bundle extracted packs to rescue the old number.
2. **Close HS11 in this repo as extracted.** The work belongs in `smf-praxis-homeschool`. Closing it as `passing` with a live verification command is not abandoning a mid-feature. It is recording a finished migration.
3. **Add SECURITY.md and CHANGELOG.md.** State the dashboard-auth posture. Do not invent a front door in this pass.
4. **Pin honesty with tests.** Bundled pack dirs equal `{general}`. `activate("homeschool")` raises. Isolated base eval total is 30. Docs do not claim 36/36 or a shipped homeschool pack.
5. **Leave the governance spine alone.** No broker, egress, approval, or policy-hook edit. Aiona's review required proof that those blobs are identical to `b9f78dd`.
6. **Bump `__version__` on every commit.** pyproject is dynamic. 0.30.1 is the honesty patch. 0.30.2 records the verification evidence.

Out of scope, and left out of scope: dashboard auth, PyPI publish, extracted-vertical work, eval expansion, architecture `LOCAL_MODULES` cleanup.

## What 0.30.1 changed, file by file

Commit `5d4b66a` — `docs: align open-core operator contract with 0.30.1`. Seventeen paths in the range across both commits, +247 / −51. No governance runtime module is in that range.

**README, QUICKSTART, PACKS, CAPABILITIES, RELEASING, clean-state checklist, quality-document.** Current-state language now says 30/30 and `general`. QUICKSTART's pack section is the one operators actually run:

```bash
praxis pack list
praxis pack templates
praxis pack create mine --vertical general
praxis pack install ./mine
```

And the health check:

```bash
praxis eval        # expect "30/30 passed  OK" on a clean open-core install
```

The commercial verticals are named as private repos that register via `praxis.verticals`. `praxis pack create --vertical homeschool` remains a **template scaffold**. `vertical_templates.py` still defines that template. Aiona's review is explicit: that is not a bundled-pack claim.

**CAPABILITIES.md eval table** now sums to 30. The `vertical` row is gone. Categories on a clean base: a2a, approval, browser, context, debate, mcp, orchestration, planning, reasoning, reflexion, retrieval, routing, safety, schema, skills, tool_use, verification, voice. Safety still has the seven cases that matter for the spine: kill-switch, allowlist, injection flag, redaction, tool-result quarantine, approval idempotency, egress firewall.

**`scripts/release-gate.py`** reviewer prompts now grade the open-core contract. The learning reviewer checks "eval correctness (30/30 open-core base; vertical cases only when a vertical package is installed)". The release reviewer checks "evals 30/30 on the open-core base". A three-reviewer exact-SHA gate that still demanded 40/40 would have been a second lying surface.

**`feature_list.json` HS11.** Status `in_progress` → `passing`. Dead test path replaced with a command that exists:

```python
python3 -c "from hybridagent.pack import bundled_packs_dir; assert {p.name for p in bundled_packs_dir().iterdir() if p.is_dir()} == {'general'}"
```

Evidence records the 0.29.0 extraction. Notes say do not re-open HS11 in this repo. Homeschool work lives in `smfworks/smf-praxis-homeschool`. Architecture checker `wip_one` now sees `in_progress = []`.

**`SECURITY.md`.** Supported versions: 0.30.x yes, 0.29.x security fixes only, older no. Report to `security@smfworks.com` or a private GitHub advisory. In scope: SEND/DESTRUCTIVE bypass, dual-approval, kill-switch, egress, injection boundary, policy-hook `allow` weakening the spine, path traversal out of `PRAXIS_WORK_DIR`, secret leakage from `~/.praxis/`, unauthenticated control-plane exposure when bound to a routable address without the documented front door. Explicitly not a vulnerability: Command Deck HTML has no built-in auth; the supported default is `127.0.0.1:8643`; binding `0.0.0.0` without TLS and auth is an operator misconfiguration. A policy hook may tighten the broker. It may never weaken allowlist, kill-switch, or egress.

**`CHANGELOG.md`.** 0.29.0 cutover, 0.29.1 fail-open fixes, 0.30.0 release-gate CLI, 0.30.1 honesty pass, 0.30.2 verification record. Someone arriving from a 0.28.x tag can now see why their eval count changed without reading git archaeology.

**`hybridagent/__init__.py`.** `__version__ = "0.30.1"` on the honesty commit, then `"0.30.2"` on the evidence commit.

## The tests that make the contract fail closed

Docs that are not pinned will drift again the next time someone pastes an old number. Three new tests, plus one existing eval test that already ran the suite.

`tests/test_pack.py`:

```python
def test_bundled_packs_are_open_core_only():
    """The wheel ships only the general pack after the 0.29.0 extraction."""
    names = {p.name for p in pack.bundled_packs_dir().iterdir() if p.is_dir()}
    assert names == {"general"}

def test_activate_extracted_pack_name_fails_closed(tmp_path, monkeypatch):
    _home(tmp_path, monkeypatch)
    with pytest.raises(ValueError, match="unknown pack 'homeschool'"):
        pack.activate("homeschool")
```

The first test is a directory contract, not a docstring check. Drop a `homeschool/` folder back into `hybridagent/packs/` and CI goes red. The second test is the operator path. The failure mode is the product.

`tests/test_evals.py`:

```python
def test_open_core_base_eval_count_is_thirty():
    """Isolated base install: 30 capability/safety cases, zero verticals."""
    from hybridagent.verticals.registry import clear_registry

    clear_registry()
    report = run_evals(cases=list(BUILTIN_EVALS))
    assert report.total == 30, report.render()
    assert report.passed, report.render()
    assert "vertical" not in report.by_category()
```

Aiona flagged a real narrowness here and did not block on it. This test passes `cases=list(BUILTIN_EVALS)` and therefore does not exercise default `run_evals()` assembly. `test_builtin_evals_all_pass` plus an in-process default run close that gap at this SHA. If someone later wires a silent extra case into the default assembly, the count test as written would not see it. That is a Low, not a lie.

`tests/test_open_core_docs.py` is a string lock on the three surfaces most likely to be copy-pasted:

```python
def test_quickstart_does_not_activate_extracted_packs():
    text = (ROOT / "docs" / "QUICKSTART.md").read_text()
    assert "pack activate homeschool" not in text
    assert "30/30" in text

def test_readme_does_not_claim_homeschool_ships():
    text = (ROOT / "README.md").read_text()
    assert "bundled **general** and\n**homeschool**" not in text
    assert "30/30" in text

def test_releasing_describes_open_core_eval_count():
    text = (ROOT / "RELEASING.md").read_text()
    assert "36/36" not in text
    assert "30/30" in text
```

These are narrow. They would not have caught the leftover present-tense Phase 11 bullet still sitting in `PROGRESS.md`. They would not have rewritten AGENTS.md comments. They stop the specific regressions that sent operators into a deleted pack and reviewers into a 40/40 fantasy. That is the job they were hired for.

Focused honesty set Aiona re-ran (`-p no:cacheprovider`): **7 passed**.

- `tests/test_open_core_docs.py` (3)
- `tests/test_pack.py::test_bundled_packs_are_open_core_only`
- `tests/test_pack.py::test_activate_extracted_pack_name_fails_closed`
- `tests/test_evals.py::test_open_core_base_eval_count_is_thirty`
- `tests/test_evals.py::test_builtin_evals_all_pass`

## What 0.30.2 is

Commit `a5eb186` — `chore: record 0.30.2 verification evidence`. The honesty patch is 0.30.1. 0.30.2 exists because this repo requires a version bump on every `hybridagent` change, and the verification block had to be written down against a SHA.

Liam recorded this block on the candidate, on this host, 13 August 2026:

```
pytest --ignore=tests/test_fuzz_parsers.py  →  1429 passed, 22 skipped
praxis eval                                 →  30/30 passed OK
ruff check hybridagent/                     →  All checks passed
mypy hybridagent --ignore-missing-imports   →  Success: 149 source files
scripts/check_architecture.py               →  4/4 PASS
praxis demo                                 →  destructive DENIED
praxis --version                            →  0.30.2
```

1423 at audit (`v0.30.0`) became 1429 on the harden branch. The delta is the six new honesty assertions (three doc tests, two pack tests, one eval-count test) landing in a suite that already had `test_builtin_evals_all_pass`. No output in that block is invented. If a later agent reprints these numbers without re-running the commands, that agent is doing the thing this PR exists to stop.

## The spine we refused to "harden"

The temptation in a production-hardening card is to touch the scary files. Broker. Egress. Approval. Policy hook. Those were not the gap. 0.29.1 already closed fail-open bugs. This pass would have been a worse product if we had bolted a half-auth onto the Command Deck or rewritten hook order to look busy.

Aiona's review compared blobs against `b9f78dd`. Identical, and not in the 17-file range:

- `hybridagent/broker.py`
- `hybridagent/broker_client.py`
- `hybridagent/data_policy.py`
- `hybridagent/pack.py`
- `hybridagent/evals.py`
- `AGENTS.md`

The policy-hook comment in `broker.py` is the contract, still at the same lines:

```python
# Policy-hook "allow" applies HERE — after allowlist, pack, kill-switch and
# the egress firewall have all passed — so it may only waive the
# human-approval requirement for a consequential action, never bypass a
# safety gate (exfiltration of injection-flagged content stays blocked).
if hook_allow:
    return self._log_decision(
        actor, tool, risk, Verdict.ALLOW, "allowed by policy hook",
        decision_id=decision_id, cycle_id=cycle_id,
        policy_rule="policy_hook_allow", args_hash=args_hash)
```

Aiona probed the live object: a hook that returns `"allow"` for a tool absent from `allowed_tools` still **deny**. `SEND` and `DESTRUCTIVE` remain held. No approval, egress, or hook control was edited. That is the production claim this PR is allowed to make about the spine: we did not touch it, and a hook cannot skip the gates that sit above it.

SECURITY.md repeats the same rule in operator language. The reporting template asks whether a report touches the spine so we do not bury a real bypass inside a docs ticket.

## Independent review, as it actually happened

Aiona's card was architecture and governance, read-only, bound to `a5eb186`. Tree `53570e981527cd11d0478a398875887cb53f8c91`. Range digest of `git diff --full-index --binary` base..HEAD: `ae63c92325fb26af85eb89311e5cd8c239c2b259e260479442c75ab29b96bf15` (37332 bytes). Worktree clean at initial and final attestation. No source edits.

Verdict: **PASS**.

Acceptance she actually executed against HEAD (`.venv` Python 3.11.15, `PYTHONDONTWRITEBYTECODE=1`):

- `hybridagent.__version__` = `0.30.2`
- `len(BUILTIN_EVALS)` = 30
- `vertical_eval_cases()` = 0; registered verticals = `[]`; load errors = `{}`
- `run_evals()` default assembly = **30/30 passed**
- Bundled pack dirs = `{general}`
- `pack.activate("homeschool")` raises `ValueError: unknown pack 'homeschool'`
- Focused honesty pytest: 7 passed
- Architecture checker: 4/4
- `feature_list.json` `in_progress` = `[]`

She did **not** re-run the full pytest / ruff / mypy / demo block in that review. The parent implementer recorded 1429/22, ruff, mypy 149, architecture 4/4, demo destructive DENIED. Independent review reproduced the contract and the spine, not a second copy of the entire suite. That distinction belongs in this log. "Reviewed" is not a synonym for "re-ran every command."

HS11 closure: extracted, not abandoned. The verification command executed green at HEAD.

AGENTS.md: blob unchanged vs base (`32a7447c66fa4097ff1f478a075592243d47d974`). Commands are the real CLI invocations. Inline comments on lines 21 and 32 still say `40/40`.

## The file we could not edit

```bash
python3 -m hybridagent.cli eval    # 40/40 capability + safety evals
# ...
python3 -m hybridagent.cli eval                            # 40/40 evals
```

Those comments sit in `AGENTS.md`, the file every agent reads first. Hermes protects it. The two-line comment edit was refused without explicit operator approval. The PR body says so. PROGRESS.md says so. Aiona noted it as expected.

The commands themselves are correct. `python3 -m hybridagent.cli eval` is the right invocation. The comment next to it is the old headline. An agent that treats the comment as the assertion will declare 30/30 a failure. That is the remaining operator-facing lie, and it is a protected-file leftover, not an implementer miss.

The fix is a GitHub UI edit, or an approval that lets an agent write the file. Until then the honest surface is PROGRESS, CHANGELOG, QUICKSTART, README, CAPABILITIES, RELEASING, and the tests.

There is a lesson inside the inconvenience. The file the tooling most aggressively freezes is the file that most needs to stay current. A harness that cannot update its own router will keep shipping last quarter's numbers next to this quarter's commands.

## Residuals Aiona left non-blocking

**PROGRESS.md line 25 still speaks in the present tense about Phase 11.** Line 16 is the honest extracted status. Line 25 still says the release remains in progress, the current tree collects 2,316 tests, 66/66 evals including 36/36 vertical, installed Homeschool. An agent that stops at line 25 can still read a live lie. QUICKSTART, README, and the tests are honest. This is a leftover paragraph, not an operator-install defect. The next PROGRESS pass should strike or rewrite that bullet so only the extracted status remains.

**The 2026-07-11 baseline table is mixed generations.** The evals row was rewritten to 30/30. The suite row still shows 926 passed / 16 skipped. mypy still says 86 files. The wheel cell still says `praxis_agent-0.21.2`. Line 19 holds the current 0.30.2 numbers. Either restore the table as a dated historical snapshot or update every cell. Do not leave a table that is half now and half July.

**PROGRESS.md repository-root line** now names `/home/mikesai1/projects/grok46-hardening/smf-praxis`. The username path was already present. This commit makes the internal hardening workspace more specific in a public file. Not a security finding. Not elegant.

**Command Deck HTML remains loopback-unauthenticated by design.** SECURITY.md says so. Do not bind it to a LAN without a reverse proxy, VPN, or SSH front door.

**Architecture `LOCAL_MODULES` still lists extracted homeschool module names.** No runtime effect. Optional cleanup later.

None of these weaken the executable open-core contract.

## How to verify this SHA yourself

Clone is the mission tree, not a second copy:

```bash
cd /path/to/smf-praxis
git fetch origin
git checkout a5eb18632134c8bad24573b0b155f353fd21a734
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"
```

Then the contract, not the folklore:

```bash
.venv/bin/python -c "import hybridagent; print(hybridagent.__version__)"
# 0.30.2

.venv/bin/python -m hybridagent.cli eval
# 30/30 passed OK

.venv/bin/python - <<'PY'
from hybridagent.pack import bundled_packs_dir, activate
print({p.name for p in bundled_packs_dir().iterdir() if p.is_dir()})
try:
    activate("homeschool")
except ValueError as e:
    print(e)
PY
# {'general'}
# unknown pack 'homeschool'

.venv/bin/python -m pytest -p no:cacheprovider \
  tests/test_open_core_docs.py \
  tests/test_pack.py::test_bundled_packs_are_open_core_only \
  tests/test_pack.py::test_activate_extracted_pack_name_fails_closed \
  tests/test_evals.py::test_open_core_base_eval_count_is_thirty \
  tests/test_evals.py::test_builtin_evals_all_pass -q
# 7 passed

.venv/bin/python scripts/check_architecture.py
# 4/4 PASS
```

If you need the full definition of done from AGENTS.md, run the suite with fuzz parsers ignored, ruff, mypy, and the demo. Expect 1429 passed / 22 skipped on this SHA if your host matches the implementer environment. If your numbers differ, report the difference. Do not "fix" them in a blog post.

PR: https://github.com/smfworks/smf-praxis/pull/7. Branch: `harden/smf-praxis`. Baseline: `b9f78dd` (`v0.30.0`).

## Lessons we are keeping

**After a vertical extraction, the first production defect is usually a lying operator contract, not a red suite.** `v0.30.0` was CI-green and tagged. QUICKSTART still activated a pack that is not in the wheel. AGENTS and README still promised 40/40. Green is a property of commands. Production-ready is a property of the story those commands are allowed to tell.

**Measure evals. Do not trust the headline number in docs.** This tree is 30/30 on a clean base. The missing ten are extracted vertical cases. A reviewer who grades 40/40 will fail an honest tree. A new engineer who trusts 40/40 will think the suite is broken at 30/30.

**`feature_list.json` `in_progress` with a deleted verification command is a real WIP=1 lock.** Close extracted work or the next agent cannot start anything honest. "Still in progress" is not a neutral status when the files are gone.

**`AGENTS.md` is a protected agent-instruction file in this environment.** Do not retry the write. Leave a comment and a PROGRESS note. The operator can edit comments in the GitHub UI. Burning retries on a frozen file is how you lose a day and still ship the old number.

**Governance spine was not the gap.** Do not "harden" by adding half-auth to the Command Deck in the same PR as a docs pass. Do not rewrite hook order to make a hardening card look like security work. The hook already applies after allowlist, pack, kill-switch, and egress. Prove that. Leave it.

**Version bump belongs in `hybridagent/__init__.py` on every commit.** pyproject is dynamic. 0.30.1 without 0.30.2 would have left the verification evidence on a version string that no longer matched the tree. Two bumps is not vanity. It is the rule the architecture checker enforces.

**Honesty tests should fail the specific lie you just removed.** String locks on QUICKSTART and README are ugly and useful. Directory contracts on `bundled_packs_dir()` are better. Default-assembly eval counts are better still; we are one test short of that, and we said so.

**Independent review is a second set of commands, not a second changelog.** Aiona's useful work is the bound SHA, the empty governance range, the live activate failure, the default `run_evals()` 30/30, and the leftover PROGRESS bullets she refused to pretend were gone. Inflating that into a full-suite re-run would be another operator-contract lie.

**WIP=1 only works if the verification command still exists.** That sentence is now in the lessons file for this repo. It should have been obvious. It was not, because HS11 looked "in progress" for three weeks after the files left.

## What production-ready means for this repo today

Checkable, not atmospheric:

- AGENTS.md verification *commands* are green on the candidate (real output). Comments still say 40/40.
- `praxis eval` count in current-state docs equals the number the CLI prints on a clean base install: 30/30.
- QUICKSTART does not instruct `pack activate` of a pack that is not in `hybridagent/packs/`.
- `feature_list.json` has no `in_progress` row. HS11 is `passing` with a live command.
- `PROGRESS.md` version equals `hybridagent.__version__` (0.30.2). A leftover Phase 11 paragraph remains; it is called out.
- `SECURITY.md` exists and states dashboard-auth and reporting posture.
- `CHANGELOG.md` covers 0.29.0 cutover, 0.29.1, 0.30.0, 0.30.1, 0.30.2.
- Governance spine unchanged. Aiona confirmed blob identity and one hook-allow probe.
- Production-ready PR on `harden/smf-praxis`: [#7](https://github.com/smfworks/smf-praxis/pull/7).

A new engineer still needs the AGENTS.md comment fix and a PROGRESS cleanup before this file is a perfectly honest session router. They no longer need to invent a homeschool pack that is not there. They no longer need to treat 30/30 as a regression.

## Building this in the open

We are publishing the audit, the PR, the review, and the leftovers on the same day. The honesty post recorded the defect. This log records the pass, the SHA, and the things we did not pretend to fix.

If you install the `v0.30.0` wheel from GitHub Releases you will still get the old docs. That is why this branch exists. When #7 lands, the contract and the CLI will agree. Until AGENTS.md is edited, the first file an agent reads will still whisper 40/40 next to a command that prints 30/30.

That whisper is the last remnant of 0.28.x in the operator path. The spine never needed this PR. The paperwork did.

Production-ready for Praxis, today, means the open-core contract is true, the spine is intact, and a new engineer is not sent into a deleted pack.
