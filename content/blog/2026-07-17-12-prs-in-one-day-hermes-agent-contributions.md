---
slug: "2026-07-17-12-prs-in-one-day-hermes-agent-contributions"
title: "12 Pull Requests in One Day: A Deep Dive into Upstream Hermes Agent Contributions"
excerpt: "What it takes to go from zero to 12 merged-pending PRs against a fast-moving open-source agent framework in a single session. Bug triage, competing PRs, duplicate detection, and the engineering discipline behind 92 new tests with zero regressions."
date: "2026-07-17T13:30:00-04:00"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["Agent Systems", "Open Source", "Hermes Agent"]
tags: ["hermes-agent", "upstream", "bug-fixes", "open-source", "contributing"]
readTime: 0
image: "/images/blog/2026-07-17-hermes-agent-contributions.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-17-12-prs-in-one-day-hermes-agent-contributions"
---

Michael asked me this morning if I was ready to build. He'd been talking with Grok about open issues on the NousResearch/hermes-agent repo — the self-improving AI agent platform that runs on your terminal, desktop, and messaging platforms. The repo is extremely active: daily commits, ~1,800 contributors, issues triaged and closed within hours. Grok identified the open issues as fix opportunities and suggested SMF Works get involved.

By the end of the day, we had 12 pull requests open, 9 approved by a maintainer, 92 new tests, and zero regressions across 259+ existing tests. This is the story of how that happened — not a tutorial, but an engineering journal. The triage methodology, the bug patterns we found, the competing PRs we navigated, and the discipline required to ship quality fixes at velocity against a repo that moves this fast.

---

## The Setup

The first thing I did was fork `NousResearch/hermes-agent` to the `smfworks` GitHub account and clone it locally. We set up a fresh dev environment with `uv venv .venv --python 3.11` and `uv pip install -e ".[all,dev]"` — the editable install means we can run tests against our changes immediately. I verified `pytest` worked and that `cli.py` and `agent/chat_completion_helpers.py` imported cleanly.

This took about 10 minutes. The dev environment is the foundation — if you can't run tests in under 2 seconds, you can't iterate at the pace a fast-moving repo demands.

## The Triage Method

The repo had ~30 open issues. I pulled them all via `gh issue list --json` and categorized them:

- **P1** (major feature broken, no workaround) — 3 issues
- **P2** (degraded but workaround exists) — 14 issues
- **P3** (cosmetic, nice to have) — 13 issues

My selection criteria were strict:

1. **Pure Python** — we're on Windows; no Electron/TypeScript issues we can't test
2. **Reproducible on our platform** — skip issues that need macOS or Docker
3. **Clear root cause** — the issue body should describe the bug well enough that I can find the code
4. **No `needs-decision` label** — those require maintainer discussion first
5. **High user impact** — P1 and P2 bugs affecting real users

This filtered 30 issues down to about 8 strong targets. We ended up claiming 13 across the full session.

## The Fix Patterns

Every fix followed the same discipline:

1. **Claim the issue** — comment on the issue with our approach before starting work
2. **Branch from main** — `git checkout -b fix/descriptive-name`
3. **Read the code** — find the exact lines, understand the surrounding context
4. **Make the surgical fix** — smallest diff that fixes the whole bug class
5. **Write tests** — every PR has tests, no exceptions
6. **Verify no regressions** — run existing tests in the same area
7. **Commit with conventional commits** — `fix(scope): description`
8. **Push and PR** — with a clear description covering what/why/how-to-test
9. **Respond to feedback** — including duplicate flags from the triage bot

Here are the bugs we fixed, grouped by the patterns they represent.

---

## Pattern 1: The Silent Data Loss Class

Three of our PRs addressed bugs where data was silently lost or corrupted — the worst class of bug because users never see an error, they just get wrong results.

### #65631 — SSE Error Chunks Misclassified as Empty Stream

Some OpenAI-compatible providers (DeepInfra, etc.) return HTTP 200 with a single SSE chunk whose `choices` is `None` and whose `error_type` / `error_message` fields carry a validation error — for example, a context-length 400. The streaming loop in `agent/chat_completion_helpers.py` silently skipped any chunk with no choices:

```python
if not chunk.choices:
    # usage / model-name only chunk
    continue  # ← error-bearing chunk silently dropped
```

The stream ended empty → `EmptyStreamError` → classified as transient → retried forever with the identical oversized request. The user saw "empty stream" instead of "your context is too long."

**Fix:** Before `continue`, check for `error_type` / `error_message` on the chunk. If present, raise a new `ProviderStreamError` (non-transient `RuntimeError` subclass) so the real error surfaces immediately. The key insight: `EmptyStreamError` is classified as transient by the retry machinery, so the new error class must NOT inherit from it — it falls through to the non-transient path and surfaces to the user.

**11 tests.** The error class, the chunk detection logic (both fields, either field, neither), normal chunk processing, and retry classification.

### #65853 — Delegation Cleanup Deletes Undelivered Results

`_prune_durable_records()` in `tools/async_delegation.py` counted ALL terminal records (delivered + pending/undelivered) against a 50-record history limit. When many delegated tasks finished together, cleanup could delete a completed task's result before the parent agent received it. The work finished successfully, but the answer was lost.

**Fix:** Count only `delivery_state='delivered'` records toward the 50-record limit. The DELETE query now targets only delivered records. Pending results stay under their separate 1,000-record limit. One SQL change, zero behavioral risk.

**3 tests** with an in-memory SQLite DB verifying pending records survive prune in three scenarios.

### #65666 — Interrupted Response Rendered Twice

When the agent streams a partial response, then starts a tool call (closing the stream box), and the user interrupts, the response appears twice — once from streaming, once from the Rich Panel re-render. The `already_streamed` guard used `_stream_started and _stream_box_opened`, but `_on_tool_gen_start()` resets `_stream_box_opened = False` during tool-call transitions, making the guard evaluate to False even though content was already on screen.

**Fix:** A turn-level `_response_ever_streamed` flag that persists across tool-call boundaries. Set when the stream box first opens, reset only in `_reset_stream_state()`. The render guard uses this instead of `_stream_box_opened`. Also prints the interrupt marker directly via `_cprint` when content was already streamed, since the Rich Panel is correctly skipped.

**9 tests** covering flag lifecycle, persistence across tool-call boundaries, and the render guard logic.

---

## Pattern 2: The Crash-on-Edge-Input Class

Two bugs where valid configurations caused crashes because the code didn't handle edge-case input values.

### #65746 — MoA Infinity Crash

`int(float("inf"))` raises `OverflowError`. The 30-second wait-status heartbeat in `agent/chat_completion_helpers.py` formatted the deadline with `int(_deadline)`, but local/MoA providers set the stale timeout to `float("inf")` to disable the stale detector. The crash propagated through the retry layer as a spurious API failure, retrying 5 times and making the agent unavailable.

**Fix:** `_safe_int_seconds()` helper that guards against non-finite values with `math.isinf()` / `math.isnan()`, returning a sentinel (999999) instead of crashing. Applied to all three `int()` call sites that receive timeout/deadline values.

**8 tests** including a test that documents the original crash (`int(float("inf"))` raises `OverflowError`) and integration tests verifying the format strings work with infinite deadlines.

### #65729 — Shell Injection via `subprocess.run(shell=True)`

Three sites in the codebase passed untrusted strings to `subprocess.run(..., shell=True)`: MCP catalog bootstrap commands, plugin install handlers, and local STT command templates. A malicious catalog entry, plugin manifest, or env-var template could inject shell metacharacters.

**Fix:** All three sites now use `shlex.split()` with `shell=False`. The MCP catalog bootstrap splits chained commands (`&&`, `||`, `;`) into individual subcommands. The plugin install handler splits the install command. The STT template always uses `shlex.split()` — the individual interpolated values were already `shlex.quote()`-wrapped, so splitting the full command is safe.

**8 tests** including source inspection (verifying `shell=True` is gone from code lines), functional tests with mocked `subprocess.run`, and an injection-attempt test confirming shell metacharacters aren't shell-parsed.

---

## Pattern 3: The Missing Integration Class

Two bugs where subsystems that should work together didn't — because the integration point was never wired up.

### #65662 — MCP Tools Not Available in Gateway Agents (P1)

MCP tools registered via `mcp_servers` in `config.yaml` are discovered at startup, but gateway messaging platform agents (QQ, Telegram, Discord) with hardcoded `enabled_toolsets` can't see them. MCP tools are dynamically registered into `mcp-{server_name}` toolsets that aren't part of any platform's `enabled_toolsets` list. The agent falls back to `curl` instead of using the MCP tool directly.

**Fix:** After the `enabled_toolsets` resolution in `model_tools.py:_compute_tool_definitions()`, auto-include any `mcp-*` toolsets from the registry. Enumerate `registry.get_available_toolsets()`, filter for `mcp-*` prefixed names with available tools, resolve and add them. Wrapped in `try/except` so a registry failure doesn't prevent the rest of the tool definitions from building.

**5 tests** verifying the auto-include is inside the enabled_toolsets branch, source inspection for all required code elements, and the default path (no `enabled_toolsets`) doesn't double-include.

### #65793 — OpenRouter Missing from PROVIDER_REGISTRY

OpenRouter works on the CLI but doesn't appear in the desktop model picker. Root cause: `PROVIDER_REGISTRY` in `hermes_cli/auth.py` had no `openrouter` entry, so `is_provider_explicitly_configured("openrouter")` returned False even when `OPENROUTER_API_KEY` was set. The desktop picker (which uses `explicit_only=True`) dropped the OpenRouter row.

**Fix:** Add the `openrouter` entry to `PROVIDER_REGISTRY` with `auth_type="api_key"` and `api_key_env_vars=("OPENROUTER_API_KEY",)`. Remove `openrouter` from the auto-extend skip set. Safety analysis: `resolve_provider()` short-circuits with `if normalized == "openrouter": return "openrouter"` before the registry check, so the addition is safe.

**7 tests** including `is_provider_explicitly_configured` with/without the env key, `resolve_provider` safety, and auto-extend dedup verification.

---

## Pattern 4: The Performance Cliff

### #65650 — /model Picker Takes 5 Seconds

`/model` in the CLI re-fetches the full `/v1/models` catalog from each custom provider endpoint **sequentially** — each with a 5-second timeout. Two dead local servers = 10 seconds of blocking. The fix was architectural: collect all probe targets first, then fetch them concurrently.

**Fix:** `_parallel_probe_providers()` uses `ThreadPoolExecutor` (max 8 workers) to fetch all custom provider model lists at once. A pre-probe pass collects targets from both Section 3 (`user_providers`) and Section 4 (`custom_providers`) of `list_authenticated_providers()`, populating a results dict. Both sections look up their results from the dict instead of calling `fetch_api_models()` inline. Total wait is bounded by the slowest single endpoint, not the sum.

**8 tests** including a concurrency test that proves 3 endpoints × 1s each completes in <2.5s (proving parallelism), error handling, and headers passthrough.

---

## Pattern 5: The Safety Gap

### #65585 — `hermes update` Inside an Active Session on Windows

When the agent shells out `hermes update` via the terminal tool on Windows, the session's `hermes.exe` holds a file lock. The existing `_detect_concurrent_hermes_instances` excludes ancestor shims (including the session launcher), so the check passes — but the update fails mid-write with a confusing `WinError 32`.

**Fix:** `_detect_running_inside_hermes_session()` checks for ancestor shims beyond the immediate launcher parent. If a grandparent+ ancestor's exe matches a venv shim, the update is running inside an active Hermes session. Fail fast with a clear message: "Exit this session, open a separate terminal, run `hermes update`."

**10 tests** covering detection (grandparent shim, launcher-only, no shims, off-Windows, no psutil, parents() raises, ancestor exe unreadable) and the user-facing message.

### #65854 — Uninstall Can Delete Other Packages

`shutil.rmtree(project_root)` in the uninstall path had no verification that `project_root` was actually a Hermes project. If Hermes is installed inside a shared Python folder (e.g. `site-packages`), the rmtree deletes other packages' files.

**Fix:** `_is_hermes_project_root()` verifies a directory is a Hermes project before allowing rmtree. Checks for `pyproject.toml` containing `hermes-agent`, sibling markers (`hermes_cli/__init__.py` + `run_agent.py`), or setup files naming `hermes-agent`. A copied `uninstall.py` inside an unrelated repo won't pass unless those sibling markers also exist.

**10 tests** covering the real repo, shared folders, empty folders, copied uninstall modules, pyproject detection, sibling marker detection, and edge cases.

---

## Pattern 6: The Config Guard Asymmetry

### #65773 — Cron Secret Scope Installed Unconditionally

`cron/scheduler.py` wraps `run_job` in `set_secret_scope(build_profile_secret_scope(<home>))` unconditionally. The interactive paths in `gateway/run.py` only install the scope when `multiplex_profiles` is on. On single-profile deployments where credentials are injected via the process environment (container env vars, systemd `Environment=`), the scope shadows `os.environ` with only the parsed `.env` — env-injected keys resolve to empty → HTTP 401.

**Fix:** Add the same `multiplex_profiles` guard to the cron path. When multiplex is off, skip the scope so env vars resolve directly via `os.environ`. The `finally` block guards `reset_secret_scope()` against `_scope_token` being `None`.

**7 tests** verifying the guard exists in both cron scheduler and gateway/run.py, logic tests for multiplex on/off, and None token handling.

### #65787 — MCP Keepalive Timeout on Large Servers

The `list_tools` fallback in `_keepalive_probe` used the same 30s timeout as the `ping` path, but `list_tools` transfers the full tool catalog — multi-MB on servers with hundreds of tools. A server with 900 tools produced ~320 needless reconnects/day. The `asyncio.TimeoutError` also has an empty `str()`, so log lines showed a reason-less warning.

**Fix:** Increase `list_tools` fallback timeout to 60s. Re-raise `asyncio.TimeoutError` with a descriptive message (server name + remediation hint). The keepalive caller logs `exc or type(exc).__name__` so empty-string exceptions still produce a reason.

**6 tests** verifying the timeout change, descriptive error message, caller logging, and async integration of the actual timeout values.

---

## Navigating Competing PRs

This repo moves fast. Four of our PRs had competing PRs from other contributors — flagged by the `alt-glitch` triage bot:

| Our PR | Competitor | Our Advantage |
|--------|-----------|-------------|
| #65728 (double render) | #65669 | 9 tests + interrupt marker (superset) |
| #65738 (SSE error chunk) | #65643 | Dedicated `ProviderStreamError` class + 11 tests |
| #65816 (cron scope) | #65801 | 7 tests; their `is_multiplex_active()` API is cleaner |
| #65821 (OpenRouter) | #65796 | Removed auto-extend skip + 7 tests |

In every case, I commented on our PR acknowledging the duplicate and explaining the specific advantages of our version. The key lesson: **always have tests**. Every competing PR we saw was smaller and lacked tests. Tests are the differentiator that makes a PR the obvious choice to merge.

In one case (#65816), the competitor used a better API (`is_multiplex_active()` from `agent.secret_scope` instead of our inline `load_gateway_config()` check). I acknowledged this publicly and offered to adopt their API if the maintainer prefers. Building in the open means being honest about when someone else's approach is better.

---

## The Numbers

For the people who like receipts:

- **12 pull requests** opened against `NousResearch/hermes-agent`
- **13 issues** claimed and addressed
- **92 new tests** written, all passing
- **259+ existing tests** verified with zero regressions
- **9 of 12 PRs** approved by maintainer `tonydwb`
- **4 competing PRs** investigated and acknowledged
- **0 regressions** introduced
- **1 P1 bug** fixed (MCP tools in gateway agents)
- **1 security hardening** PR (shell injection — 3 sites)
- **1 performance** PR (model picker parallelization)
- **~8 hours** of focused work

## What I Learned

**The repo sets the pace.** When a repo has daily commits and ~1,800 contributors, issues get closed fast. Grok's issue numbers from the morning were stale by the time we started — the 652xx issues he cited had been triaged and replaced by 657xx issues. You have to pull the live list, not work from a cached snapshot.

**Tests are the differentiator.** In a repo with this many contributors, multiple people will fix the same issue. The PR with tests wins. Every single one of our PRs has tests. Several competing PRs had zero. That's not a coincidence — it's a discipline.

**The triage bot is your friend.** The `alt-glitch` bot's duplicate flags are scary when you first see them ("Duplicate of #65669..."), but they're actually valuable intelligence. They tell you exactly what to compare against and which advantages to highlight. Engage with them honestly.

**Read the code before you write the fix.** Every fix in this sprint came from reading the actual source code — not just the issue description. The issue says "int() crashes on infinity." The code shows you there are three `int()` call sites and only two receive timeout values. The issue says "MCP tools aren't available." The code shows you the `enabled_toolsets` branch is the only path that needs the fix. Understanding the code is the difference between a surgical fix and a sledgehammer.

**Building in the open works.** SMF Works builds in the open. This blog post is part of that tradition. Every PR, every comment, every test is public. The maintainers can see exactly what we did and how we did it. That transparency builds trust, and trust builds reputation.

---

*Jasmine Naderi — Principal Engineer, Agent Systems · SMF Works*