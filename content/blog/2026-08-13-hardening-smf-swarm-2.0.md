---
slug: "2026-08-13-hardening-smf-swarm-2.0"
title: "From Ephemeral to Fail-Closed: SMF Swarm 2.0 at 0.5.2"
excerpt: "The first hardening pass replaced a hardcoded share secret with a random per-process key. The second pass made signing fail closed. 76 tests became 125. PR #2 was closed as superseded. This is the 0.5.2 record."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Production"]
tags: ["hardening", "smf-swarm-2.0"]
readTime: 14
image: "/images/blog/2026-08-13-hardening-smf-swarm-2.0.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-smf-swarm-2.0"
---

# From Ephemeral to Fail-Closed: SMF Swarm 2.0 at 0.5.2

[SMF Swarm 2.0](https://github.com/smfworks/smf-swarm-2.0) is the public platform core for governed multi-persona predictive analysis. Commercial verticals stay private. The July 22–23 session already closed a credential leak. The Grok 4.6 hardening mission found a different class of problem: fail-open security defaults on a public repo with green tests and no CI.

This is the Clearinghouse record of the full pass: five merged PRs (#1, #6, #7, #8, #9), version 0.5.0 → 0.5.2, 76 tests → 125 tests. An earlier, shorter note covered the [0.5.1 pass](/blog/2026-08-13-hardening-smf-swarm) as it stood on August 13. That post described a process-ephemeral share HMAC. The code moved past that. This post is the final log after the fail-closed rework and Liam's independent oppositional review.

Final PR: [#9](https://github.com/smfworks/smf-swarm-2.0/pull/9), merged to `main` at `943dde9`. Version: **0.5.2**.

## What the product is

SMF Swarm 2.0 (`smfworks/smf-swarm-2.0`) is a governance-first predictive analysis platform core. The pipeline is `register → grant → require → diagnose → audit`. Four analysis personas — Scout, Strategist, Skeptic, Forecaster — produce reports with CSV sparklines, evidence trails, and hash-chained audit JSONL. A FastAPI app serves a Linear-inspired UI with optional share links. A CLI (`smf-swarm serve` / `analyze` / `diagnose`) drives the same engine.

Default analysis mode is mock (offline). Auth is optional by design for the open core. That is intentional, not a gap. Fail-open *secrets* and *SSRF* are not intentional. They are bugs.

| Layer | Path | Runtime |
|-------|------|---------|
| Governance | `src/smf_swarm/governance/` | Identity registry, SHA-256 hash-chained JSONL audit, deny-by-default permissions |
| Capability | `src/smf_swarm/capability/` | TRACE-style diagnostic; mock + optional OpenAI-compatible LLM |
| Pipeline | `src/smf_swarm/pipeline/phase1_run.py` | register → grant → require → diagnose → audit |
| Analysis | `src/smf_swarm/analysis/` | Scout / Strategist / Skeptic / Forecaster + CSV sparklines |
| App | `src/smf_swarm/app/` | FastAPI + static UI; optional `SMF_SWARM_API_TOKEN`; public `/share/{id}`; signed `/r/{id}?s=` |
| CLI | `src/smf_swarm/cli.py` | `smf-swarm serve` / `analyze` / `diagnose` |

Core dep: pydantic >= 2. App extra: fastapi, uvicorn, python-multipart, httpx. Python: >= 3.10. Source: 2373 LOC across 19 modules. Tests: 125.

## What Aiona's audit found

Aiona ran the real suite on 2026-08-13 against `9b7ce3a` (the July 23 credential-leak fix). No fabricated output.

| Check | Command | Result |
|-------|---------|--------|
| Tests | `pytest -q --tb=no` | 76 passed, 1 warning |
| Types | `mypy src` | clean (17 files) |
| Lint | `ruff check src tests` | 165 errors (137 auto-fixable, all UP* annotation nits) |
| Coverage | `pytest --cov` | not installed |
| CI | `ls .github` | absent |
| Visibility | `gh repo view` | PUBLIC |
| Tree | `git status` | clean, on main |

The code defects that mattered:

- **P1 — Hardcoded share HMAC.** `share_secret()` fell back to `"smf-swarm-dev-share-secret"`. Anyone who read the source could forge `/r/{run_id}?s=` on a default deploy.
- **P1 — SSRF.** `/api/llm/test` and analyze fetched operator-supplied URLs with no scheme or host validation. `file:`, credentials-in-URL, `169.254.169.254`, and `metadata.google.internal` were all legal.
- **P1 — Health reconnaissance.** `/api/health` echoed the raw `SMF_SWARM_LLM_BASE_URL`. If an operator pointed at a lab host, the health endpoint repeated it.
- **P2 — Upload path traversal.** Filenames used as given. No basename strip. No extension allowlist.
- **P2 — History perms.** JSONL created with the process umask. No 0700/0600.
- **P0 — No CI.** No `.github/workflows`. Docs and AGENTS.md talked about "use mock mode in CI" but CI did not exist.
- **Docs lying.** README still said "Repo is currently private." `docs/PHASE1_STATUS.md` advertised package 0.1.0 and 6 tests. No CHANGELOG, no SECURITY.md, no CONTRIBUTING.md.

76 green tests and no CI is a contradiction. Green is a property of commands someone ran once. Production-ready is a property of commands a machine runs on every push.

## The two-pass shape of the fix

The hardening landed in two waves, not one. The distinction matters because the first pass fixed the right files with the wrong contract, and the second pass fixed the contract.

### Wave 1 — PR #1 (0.5.1, 2026-08-13)

PR [#1](https://github.com/smfworks/smf-swarm-2.0/pull/1): 623 lines added, 26 files changed. This was the bulk pass.

What it did right:
- Added `.github/workflows/ci.yml` — ruff + pytest on Python 3.10, 3.11, 3.12.
- Added Dependabot.
- Replaced the hardcoded HMAC fallback with a **process-ephemeral key** — a random secret generated per process start if `SMF_SWARM_SHARE_SECRET` was not set.
- Added URL validation: HTTP(S) only, no credentials, no cloud metadata, no link-local.
- Health returns booleans, not raw URLs.
- Upload filename sanitization. POSIX history locking.
- Added `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.env.example`.
- Shared `smf_swarm.config` validation module used by app, engine, CLI, and eval harness.
- Settings UI no longer writes API keys to localStorage (sessionStorage only).
- Eval harness requires `SMF_SWARM_EVAL_BASE_URL` — no implicit `127.0.0.1:8888` default.
- Tests went from 76 to 91.

What it got wrong: the process-ephemeral HMAC was still fail-open. If no secret was configured, the process minted its own random key and signed `/r/` links with it. Those links died on restart — but while the process lived, anyone could forge them by reading the source to see that the fallback existed. "Random per-process" is better than "hardcoded string in source." It is not fail-closed.

### Wave 2 — PRs #6, #7, #8, #9 (0.5.2, 2026-08-14)

The original mission PR was [#2](https://github.com/smfworks/smf-swarm-2.0/pull/2), branched from the audit tree. By the time it was ready to merge, `main` had already received the fail-closed gates from #1, #6, #7, and #8 as **0.5.2** (`0063f71`). PR #2 conflicted and was **closed as superseded**. GitHub still pins its closed head at `7719cd2`; it cannot be reopened.

PR [#6](https://github.com/smfworks/smf-swarm-2.0/pull/6): 54 lines, 4 files. Extended the LLM URL allowlist to the capability diagnostic backend. The first pass covered the app and engine; the diagnostic path had its own `httpx` call that bypassed validation.

PR [#7](https://github.com/smfworks/smf-swarm-2.0/pull/7): 351 lines, 15 files. Closed the leftover share, SSRF, and secret-persist gaps:
- **Share HMAC became fail-closed.** If neither `SMF_SWARM_SHARE_SECRET` nor `SMF_SWARM_API_TOKEN` is set, `share_secret()` raises `RuntimeError`. No ephemeral fallback. Unsigned `/r/` returns 403.
- Blocked IPv4-mapped and link-local aliases of cloud metadata (`http://[::ffff:169.254.169.254]/`).
- When API auth is enabled, `/share/{id}` and `/api/share/{id}` require `?s=` HMAC. Share JSON redacts `signed_url_path`.
- History JSONL append/trim uses exclusive `fcntl` locking (POSIX).

PR [#8](https://github.com/smfworks/smf-swarm-2.0/pull/8): 365 lines, 11 files. Rebased the remaining fail-closed gates onto `main` as 0.5.2.

PR [#9](https://github.com/smfworks/smf-swarm-2.0/pull/9): 62 lines, 8 files. The final lockstep commit. This is the PR Liam reviewed and approved:
- `SECURITY.md` corrected: no longer claims a process-ephemeral signer. States plainly: "There is no process-ephemeral HMAC fallback."
- `SECURITY.md` adds an honest residual-risks section.
- `docs/PHASE1_STATUS.md` relabeled as Phase 1 history. Current product header says 0.5.2, public, 125 tests, CI present. The old 0.1.0 / 6 tests / private block is explicitly marked "Historical record (2026-07-13)."
- README version bumped to 0.5.2. Adds `SMF_SWARM_SHARE_SECRET` to the env table. CI description now includes mypy + mock CLI smoke.
- CI restored `mypy src` and added mock CLI smoke (`smf-swarm analyze -q "CI smoke" -d fixtures/sample_growth.csv --mode mock`).
- `mypy>=1.10` added to the `dev` extra.
- `pyproject.toml` gets `[tool.mypy]` config: `python_version=3.10`, `packages=["smf_swarm"]`, `ignore_missing_imports=true`.
- One-line mypy fix: `_canonical_ip` returns `IPv4Address | IPv6Address` instead of the private `_BaseAddress`.
- `CHANGELOG.md` gets the 0.5.2 entry.
- `CONTRIBUTING.md` local-check block now includes `mypy src` and the mock smoke.

Tests went from 91 to **125**.

## The difference between ephemeral and fail-closed

This is the production lesson in this post.

The 0.5.1 pass replaced a hardcoded string with a random per-process secret. The argument for doing that: "links die on restart, so the window is bounded." The argument against: "the process is alive and signing with a key the operator never configured, and the source tells you the fallback exists."

Fail-closed means: if the operator did not configure a secret, the feature does not work. `/r/` returns 403. `share_secret()` raises. `analyze` omits `signed_url_path` from its output. No signature is minted. No fallback key exists. The operator who wants signed share links must set `SMF_SWARM_SHARE_SECRET` or `SMF_SWARM_API_TOKEN`.

The 0.5.2 `SECURITY.md` says it in one sentence: "If neither is set, signing is **not configured**: `share_secret()` raises, analyze omits `signed_url_path`, and unsigned `/r/` returns **403**. There is no process-ephemeral HMAC fallback."

The 0.5.1 `SECURITY.md` said: "If neither is set, a process-ephemeral key is used and signed links die on restart." That sentence was the lie. Not a deliberate lie — an honest description of a design that was not good enough. The correction is the story.

## Decisions that were locked before the first commit

1. **Share HMAC fail-closed.** No ephemeral fallback. No hardcoded default. `/r/` is 403 without a configured secret.
2. **Validate LLM URLs everywhere.** App, engine, CLI, eval harness, capability diagnostic backend. HTTP(S) only. No credentials. No cloud metadata. No link-local. Localhost stays allowed.
3. **Health reports booleans.** `has_llm_base_url`, not the URL.
4. **Do not gate on 165 UP* annotation nits.** Ruff select `E, F`. Correctness over annotation fashion. The audit listed this as D12 / P3, explicitly out of scope.
5. **Keep optional auth.** The open-core model is intentional. Verticals can be stricter. The public core does not pretend it is a SaaS control plane.
6. **CI on 3.10 and 3.12.** The locked decision said 3.10 + 3.12. Main's CI actually runs 3.10, 3.11, and 3.12. The broader matrix is not a conflict — it is main being more thorough than the minimum.
7. **No coverage fail-under.** Not required for 0.5.2. Coverage tool not installed.

## What Liam's oppositional review actually ran

Liam reviewed PR #9 on `main` at `943dde9` = `origin/main`, clean tree. This was an independent oppositional engineering review, not a rubber stamp. He re-ran the full gate suite from source:

| Check | Result |
|-------|--------|
| `ruff check src tests scripts` | All checks passed |
| `mypy src` | Success: no issues found in 19 source files |
| `pytest -q` | 125 passed, 1 Starlette/httpx deprecation warning |
| Mock CLI smoke | `run_id 040f92a95475`, `mode=mock`, `chain_valid=True` |
| CI (GitHub Actions) | Run 31868531152: lint-and-test 3.10 + 3.11 + 3.12 — all SUCCESS |

Then he adversarially verified every P1 security control behaviorally — not by reading the code, but by exercising the live behavior:

**D02 — Share HMAC fail-closed.** `share_secret()` and `sign_run_id` raise `RuntimeError` with no env + token configured. No hardcoded default. No ephemeral fallback.

**D03 — URL allowlist.** Rejected: `file:`, `http://user:pass@example.com`, `169.254.169.254`, `metadata.google.internal`, `ftp://`, `http://0xa9fea9fe/` (hex-encoded metadata IP), `http://[::ffff:169.254.169.254]/` (IPv4-mapped). Allowed: loopback (`127.0.0.1`) and normal HTTPS.

**D04 — Health non-leak.** `/api/health` returns booleans only. Does NOT echo the raw `SMF_SWARM_LLM_BASE_URL` even when the env var is set.

**D06 — Upload jail.** `.exe` rejected with 400 + allowlist enforcement. `../../etc/passwd.csv` basenamed — no path traversal escape. Allowed extensions: csv, json, txt, md, tsv, log.

**D07 — POSIX history perms.** History parent directory is 0700. History file is 0600.

The review was explicit about what it did not re-run and why. "Reviewed" is not a synonym for "re-ran every command." The behavioral security probes are the useful independent work. The full-suite numbers are the implementer's evidence, reproduced once by the reviewer, not a second copy of the entire suite on every review pass.

Verdict: **APPROVED**. PR #9 merged. No second PR opened.

## The tests that pin the contract

125 tests across 11 files. The hardening-specific tests live in three files:

**`tests/test_hardening.py`** (13 tests): URL normalization rejects credentials and metadata, accepts local OpenAI-compatible endpoints, model ID validation, safe filename strips paths, engine has no lab host default, share secret is not hardcoded, audit skips corrupt lines, CLI missing question/data exits 2, serve non-loopback requires token, mock analyze OK.

**`tests/test_production_hardening.py`** (24 tests): The fail-closed gate suite. Parametrized URL rejection matrix covers `file:///etc/passwd`, `http://user:pass@example.com/v1`, `http://169.254.169.254/latest/meta-data`, `http://metadata.google.internal/computeMetadata/v1`, `ftp://example.com/v1`, `http://instance-data/latest/meta-data`, `http://0xa9fea9fe/`, `http://0.0.0.0:80/`, `http://127.0.0.1:8888/v1?api_key=MARKER`, `https://ollama.com/v1`. Share secret fail-closed. Share signature requires configured secret. Analyze omits signed path without secret. Signed report forbidden without secret. Env key not forwarded to foreign URL. Health does not echo base URL. Upload rejects exe. Upload strips path. History POSIX perms. LLM test rejects metadata URL. Engine LLM requires explicit endpoint.

**`tests/test_oppositional.py`** (5 tests): Share unauthenticated forbidden when auth enabled. Share signed query works when auth enabled. Share API redacts signed run URL. IPv4-mapped metadata URL rejected. Link-local metadata aliases rejected. Eval base URL has no implicit runtime default.

These tests do not assert comments or docstrings. They exercise the live behavior. A test that says `share_secret()` raises without configuration is a contract on the runtime, not a string lock on the source.

## What 0.5.2 actually shipped

The final state at `943dde9`:

```
src/smf_swarm/__init__.py    __version__ = "0.5.2"
pyproject.toml               version = "0.5.2"
.github/workflows/ci.yml      ruff + mypy + pytest + mock CLI smoke × 3.10/3.11/3.12
SECURITY.md                   fail-closed share; no ephemeral fallback; honest residuals
CHANGELOG.md                  0.5.0, 0.5.1, 0.5.2 entries
CONTRIBUTING.md               mock-only tests; docs lockstep; conventional commits
docs/PHASE1_STATUS.md         current = 0.5.2 / public / 125 tests; Phase 1 = history
README.md                     version 0.5.2; SMF_SWARM_SHARE_SECRET in env table
```

CI on merged main (run 31868531152): all 3 Python versions SUCCESS. Only a non-blocking Node.js 20 deprecation annotation on `actions/checkout@v4` + `setup-python@v5`.

## Residuals left non-blocking

Liam's review was explicit about what was not fixed and why. These are not defects. They are documented scope boundaries.

**Ruff select stays `E, F`.** The locked decision recommended `E, F, W, I, B, S`. Main accepted #1's narrower set. Expanding the rule set is a later PR, not a production gate. The 165 UP* annotation nits from the audit are still nits, not correctness.

**URL policy is hostname/IP-literal based.** DNS aliases and some IPv6 link-local forms are not a complete SSRF guarantee. `SECURITY.md` says so in the residual-risks section. A hostname-based policy cannot catch a DNS record that resolves to `169.254.169.254`. The allowlist blocks the known metadata hosts by name and IP. It does not block every possible DNS alias. That is an honest residual, not a hidden bug.

**`AGENTS.md` still says 0.5.0.** The agent-instruction file is write-protected in this environment. The version comment in `AGENTS.md` was not bumped. This is the same protected-file pattern documented in the [Praxis post](/blog/2026-08-13-hardening-smf-praxis): the file the tooling most aggressively freezes is the file that most needs to stay current. The fix is a GitHub UI edit, not an agent retry.

**Node.js 20 deprecation annotation.** GitHub Actions runners show a deprecation warning for Node.js 20 on `actions/checkout@v4` and `setup-python@v5`. Non-blocking. The action versions are current. The annotation is about the runner's Node.js, not the Python matrix.

**No coverage fail-under.** The locked decision explicitly excluded it. `pytest --cov` is not in the `dev` extra. Coverage measurement is out of scope for 0.5.2.

## How to verify this SHA yourself

```bash
cd /path/to/smf-swarm-2.0
git fetch origin
git checkout 943dde9a327052f9961db554ae0278ebc8d833e2
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"
```

Then the contract, not the folklore:

```bash
.venv/bin/ruff check src tests scripts
# All checks passed!

.venv/bin/mypy src
# Success: no issues found in 19 source files

.venv/bin/pytest -q
# 125 passed, 1 warning in 0.58s

.venv/bin/smf-swarm analyze -q "CI smoke" \
  -d fixtures/sample_growth.csv --mode mock \
  -o /tmp/smf-swarm-ci-smoke.json
# wrote /tmp/smf-swarm-ci-smoke.json
```

Read the smoke report:

```bash
.venv/bin/python -c "
import json
d = json.load(open('/tmp/smf-swarm-ci-smoke.json'))
print('run_id:', d['run_id'][:20])
print('mode:', d['mode'])
print('chain_valid:', d['chain_valid'])
print('audit_events:', len(d['audit_events']))
"
# run_id: 732ce5f5e9cf
# mode: mock
# chain_valid: True
# audit_events: 5
```

The behavioral security probes are in `tests/test_production_hardening.py` and `tests/test_oppositional.py`. Run them in isolation:

```bash
.venv/bin/pytest tests/test_production_hardening.py tests/test_oppositional.py -q
# 29 passed
```

If your numbers differ, report the difference. Do not "fix" them in a blog post.

## Lessons we are keeping

**A process-ephemeral secret is fail-open with extra steps.** The first hardening pass replaced a hardcoded string with a random per-process key and called it fixed. It was better. It was not fail-closed. The operator never configured that key. The source told you the fallback existed. "Bounded window" is not the same as "does not sign." Fail-closed means the feature refuses to work until the operator configures it.

**Green tests without CI is a snapshot, not a gate.** 76 passed on one host on one day. No `.github/workflows` meant no machine ran those 76 tests again until a human typed `pytest`. The single largest production-readiness hole was not a code defect. It was the absence of the machine that catches code defects.

**Health endpoints are reconnaissance.** `/api/health` that echoes `SMF_SWARM_LLM_BASE_URL` tells an attacker where your LLM lives. Booleans are enough for liveness checks. The URL is not.

**Docs that still say "private" after a public cutover teach the wrong threat model.** README saying "Repo is currently private" on a public repo is not a copy issue. It is a security document that describes a world that does not exist. An operator who believes the repo is private will not treat the source as public attack surface.

**An SSRF allowlist must cover every httpx call, not just the obvious ones.** The first pass validated URLs in the app and engine. The capability diagnostic backend had its own `httpx` call that bypassed validation. PR #6 closed that gap. "We validate URLs" is not true until every egress path is enumerated.

**Closing a conflicting PR is not losing.** PR #2 was the original mission branch. By the time it was ready, `main` had already merged the fail-closed gates from #1, #6, #7, and #8. PR #2 conflicted and was closed as superseded. The work was not lost — it landed through different PRs. Opening a second harden PR on the same branch would have duplicated the stack. The right move was to close #2, reset onto current `main`, and open #9 as the lockstep.

**The protected-file version-drift pattern repeats.** `AGENTS.md` still says 0.5.0. The Praxis hardening hit the same wall: `AGENTS.md` comments still say 40/40. The file every agent reads first is the file the tooling freezes. The commands in `AGENTS.md` are correct. The version comment is stale. The fix is a GitHub UI edit, not an agent retry. Burning tool calls on a frozen file is how you lose a day and still ship the old number.

## What production-ready means for this repo today

Checkable, not atmospheric:

- CI runs ruff + mypy + pytest + mock CLI smoke on Python 3.10, 3.11, 3.12 for every push and PR to `main`.
- `ruff check src tests scripts`: clean.
- `mypy src`: 19 files, no issues.
- `pytest -q`: 125 passed.
- Share HMAC is fail-closed. No ephemeral fallback. No hardcoded default.
- LLM URL allowlist covers app, engine, CLI, eval harness, and capability diagnostic backend.
- `/api/health` returns booleans only.
- Uploads are basename-only with an extension allowlist.
- POSIX history: directory 0700, file 0600.
- `SECURITY.md` states the residual risks in plain language.
- README, CHANGELOG, CONTRIBUTING, PHASE1_STATUS match public 0.5.2 and real test counts.
- `mypy` is in the `dev` extra. `pip install -e ".[dev]"` installs the gates.
- Production-ready PR merged: [#9](https://github.com/smfworks/smf-swarm-2.0/pull/9).

Not required for 0.5.2: coverage fail-under, UP* modernization, Windows/macOS CI matrix, secure-by-default auth flip, PyPI publish, vertical repo changes.

## Building this in the open

The audit, the PRs, the review, and the leftovers are published on the same day. The [0.5.1 note](/blog/2026-08-13-hardening-smf-swarm) recorded the first pass as it stood. This log records the final pass: the fail-closed rework, the superseded PR, the 125-test suite, and the residuals we did not pretend to fix.

If you clone `943dde9` and run the commands above, you will get the numbers in this post. If you do not, that is the report we need.

PR: https://github.com/smfworks/smf-swarm-2.0/pull/9. Branch: `harden/smf-swarm-2.0`. Baseline: `9b7ce3a` (July 23 credential-leak fix). Final: `943dde9` (0.5.2).