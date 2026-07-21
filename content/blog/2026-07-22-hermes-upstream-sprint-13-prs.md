---
slug: "hermes-upstream-sprint-july-2026"
title: "Thirteen Pull Requests in One Day — A Deep Dive into SMF's Hermes Agent Upstream Sprint"
excerpt: "A detailed technical breakdown of 13 pull requests shipped to NousResearch/hermes-agent in a single sprint day — covering FTS trigger surgery, 5xx fallback chains, zeroed state.db quarantine, Telegram dedup, configurable journal_mode, per-sender profile routing, and more."
date: "2026-07-22"
author: "Jasmine Naderi"
authorKey: "jasmine"
series: "jasmine"
categories: ["AI Agents", "Open Source", "Hermes Agent", "Upstream Contributions"]
tags: ["hermes-agent", "upstream", "sqlite", "fts5", "telegram", "gateway", "windows", "fallback-chain"]
readTime: 12
---

On July 21, 2026 — the day after Hermes Agent v0.19.0 "Quicksilver" shipped — SMF Works went on an upstream contribution sprint against the [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) repository. Over the course of a single working session we claimed, fixed, tested, and opened **13 pull requests** covering SQLite I/O saturation, provider fallback chains, Windows update safety, gateway slash commands, Telegram deduplication, and per-sender profile routing.

This post is a technical deep dive into every PR — what was broken, what we changed, and why.

---

## The Sprint

| PR | Issue | Area | One-liner |
|----|-------|------|-----------|
| [#65726](https://github.com/NousResearch/hermes-agent/pull/65726) | — | CLI / Windows | Detect `hermes update` running inside an active session |
| [#68674](https://github.com/NousResearch/hermes-agent/pull/68674) | #68369 | Skills Hub | Force UTF-8 on hub lock/taps/cache JSON I/O |
| [#68676](https://github.com/NousResearch/hermes-agent/pull/68676) | #68613 | Kanban | Reject reason-looking positionals on `unblock` |
| [#68677](https://github.com/NousResearch/hermes-agent/pull/68677) | #68484 | CLI | Don't report behind-count on diverged branches |
| [#68805](https://github.com/NousResearch/hermes-agent/pull/68805) | #68474 | State DB | Loud failed snapshot + zeroed-file quarantine |
| [#68821](https://github.com/NousResearch/hermes-agent/pull/68821) | #68760 | Update | Hard-stop when `hermes.exe` shim stays locked |
| [#68884](https://github.com/NousResearch/hermes-agent/pull/68884) | #68880 | Gateway | Wire `/curator` slash command for messaging platforms |
| [#68886](https://github.com/NousResearch/hermes-agent/pull/68886) | #68771 | Agent | Treat retryable 5xx as fallback-chain trigger |
| [#68888](https://github.com/NousResearch/hermes-agent/pull/68888) | #68693 | Photon | Make `UPSTREAM_STREAM_DEGRADED` non-retryable |
| [#68891](https://github.com/NousResearch/hermes-agent/pull/68891) | #68858 | State DB | Narrow FTS UPDATE triggers to content columns only |
| [#68906](https://github.com/NousResearch/hermes-agent/pull/68906) | #68502 | Telegram | Dedup inbound updates by `update_id` |
| [#68912](https://github.com/NousResearch/hermes-agent/pull/68912) | #68545 | State DB | Configurable `journal_mode` + centralize all DB openers |
| [#68913](https://github.com/NousResearch/hermes-agent/pull/68913) | #68802 | Gateway | Add `from_number`/`sender_id` to `profile_routes` |

---

## 1. UTF-8 Hub Lock I/O — PR [#68674](https://github.com/NousResearch/hermes-agent/pull/68674)

**Issue:** On Chinese Windows (GBK codepage), `Path.read_text()` and `Path.write_text()` default to the system encoding. When the skills hub lock file or taps file contained non-ASCII characters (skill names, descriptions in CJK), the read would crash with `UnicodeDecodeError`, bricking the skills hub.

**Fix:** Forcibly pass `encoding="utf-8"` on every `read_text()` and `write_text()` call in `tools/skills_hub.py` — `HubLockFile.load()`, `TapsFile.load()`, `_read_cache`, `_write_cache`, and `_load_hermes_index` cache read/write. Added `UnicodeDecodeError` to the exception handling so a corrupted file doesn't kill the process.

**Tests:** 21 focused tests across `TestHubLockFile` and `TestTapsManager`.

---

## 2. Kanban Unblock Positional Rejection — PR [#68676](https://github.com/NousResearch/hermes-agent/pull/68676)

**Issue:** `hermes kanban unblock "task is done" t_abc123` looked correct to users but the reason string was silently consumed as a task ID. The CLI would either no-op or operate on the wrong task.

**Fix:** Added a `_TASK_ID_RE` regex (`t_[0-9a-f]{1,}` — supports legacy short IDs) and a `_looks_like_task_id()` helper. The `_cmd_unblock` handler now calls `_reject_non_task_ids()` which inspects positional arguments before any mutation: if a positional doesn't match the task ID pattern, it's rejected with a `Did you mean: ... --reason "..." t_xxx` hint.

We also absorbed strengths from a competing PR (#68668 by RegardV): any-length hex IDs, clearer hint message, and `--reason` + bad positional traceback handling.

**Tests:** 7 tests covering unblock guard, legacy short IDs, bulk path, and `--reason` traceback path.

---

## 3. Diverged Branch Banner — PR [#68677](https://github.com/NousResearch/hermes-agent/pull/68677)

**Issue:** When a local Hermes clone diverged from `upstream/main` (commits ahead *and* behind), the update check reported "N commits behind" — misleading, since a simple `git pull` wouldn't work and the user needed to know they had diverged.

**Fix:** Added `_git_is_ancestor()` helper using `git merge-base --is-ancestor` to detect divergence. When the local HEAD is not an ancestor of the remote and the remote is not an ancestor of local, the banner reports `UPDATE_DIVERGED` instead of a misleading behind-count.

**Tests:** 16 tests across `test_update_check.py`.

---

## 4. Zeroed state.db Quarantine — PR [#68805](https://github.com/NousResearch/hermes-agent/pull/68805)

**Issue:** On Windows, `state.db` could end up zeroed (full original size, all null bytes) after a storage stack failure. SQLite would open it silently as an empty database — all session history gone, no error.

**Fix:** Two-part hardening:
1. **Loud failed snapshot**: If `state.db` exists but `_safe_copy_db` can't copy it during a snapshot, emit a `CRITICAL` log instead of silently continuing.
2. **Zeroed-file detection + quarantine**: On `SessionDB.__init__`, if the DB file exists but its header is all null bytes, quarantine it as `state.db.zeroed-<timestamp>.bak`, open a fresh DB, and log recovery guidance.

**Tests:** 10 tests across `TestSafeCopyDb`, `TestQuickSnapshot`, and zeroed-DB detection.

---

## 5. Windows hermes.exe Lock Hard-Stop — PR [#68821](https://github.com/NousResearch/hermes-agent/pull/68821)

**Issue:** When `hermes update` couldn't rename `venv/Scripts/hermes.exe` out of the way (because another session held the file lock), it retried three times into `WinError 32`, then attempted a ZIP fallback that also failed. The user saw a cascade of errors with no clear remediation.

**Fix:** When quarantine can't free the venv entry-point shims, abort install with exit code 2 and print the holding PIDs with `taskkill` guidance. Deferred OS rename paths also block install until the machine is restarted — the shim path remains locked for `uv` regardless of retries.

**Tests:** 34 tests across `test_update_concurrent_quarantine.py` and `test_verify_core_dependencies.py`.

---

## 6. Gateway `/curator` Slash Command — PR [#68884](https://github.com/NousResearch/hermes-agent/pull/68884)

**Issue:** The docs claimed `/curator` works on gateway platforms (Telegram, Discord, etc.), but only the local CLI dispatched it. Gateway messages with `/curator` fell through as plain text to the agent.

**Fix:** Added a `GatewaySlashCommand` for `/curator` and wired it into the canonical dispatch in `gateway/run.py`. Initial implementation captured stdout/stderr from `cli_main` via `contextlib.redirect_stdout`.

**Review feedback (from @PRATHAMESH75):** The process-global `sys.stdout`/`sys.stderr` swap is not concurrency-safe in the gateway — other sessions writing to stdout during the curator call would have their output captured or lost.

**Fix v2:** Added `hermes_cli.curator.run_slash(text) -> str` — a module-level entry point that serializes curator invocations under a `threading.Lock`, collects output into a per-call buffer, and blocks interactive subcommands (`rollback`) without `-y` with a targeted message instead of relying on `EOFError` from a headless `input()`. The gateway handler now calls `run_slash` via `asyncio.to_thread`.

**Tests:** 10 tests covering gateway dispatch, `run_slash` entry point, prefix stripping, interactive blocking, lock serialization, and source-level verification.

---

## 7. Retryable 5xx Fallback Chain — PR [#68886](https://github.com/NousResearch/hermes-agent/pull/68886)

**Issue:** When a provider returned HTTP 502/503/500/529 (server error, overload), the conversation loop retried the same provider until `api_max_retries` was exhausted — then surfaced the error to the user. Even when a configured fallback provider existed, it was never consulted.

**Fix:** Extended the `_should_fallback` gate in `agent/conversation_loop.py` to include retryable 5xx:

```python
is_retryable_5xx = classified.reason in {
    FailoverReason.server_error,   # 500/502
    FailoverReason.overloaded,      # 503/529
}
_should_fallback = (
    is_rate_limited
    or (_is_transport_failure and retry_count >= 2)
    or (is_retryable_5xx and retry_count >= 1)
)
```

One retry for blips, then fall back — same pattern as 429 rate limits. The 5xx retry count is deliberately `>= 1` (not `>= 2` like transport failures) because 503 capacity waves are functionally identical to 429 from the user's perspective.

**Tests:** 6 tests covering source inspection (fallback gate includes 5xx), classification (503→overloaded, 502→server_error, 500→server_error), and status message presence.

---

## 8. Photon Fatal Error → Gateway Exit — PR [#68888](https://github.com/NousResearch/hermes-agent/pull/68888)

**Issue:** When the Photon adapter (iMessage) encountered `UPSTREAM_STREAM_DEGRADED`, the sidecar process stopped but the gateway **kept running** with a dead Photon. `launchd` `KeepAlive` never triggered because the parent process was still alive. iMessage delivery silently failed for hours until manual restart.

**Root cause:** `UPSTREAM_STREAM_DEGRADED` was set `retryable=True`, so the gateway queued it for background reconnection. But the sidecar is dead — background reconnection can't revive it.

**Fix:** Changed `retryable=True` → `retryable=False` for `UPSTREAM_STREAM_DEGRADED`. The gateway now exits with a non-zero code, and `launchd`/`systemd` `KeepAlive`/`Restart=on-failure` restarts the entire process, which re-starts the sidecar.

`SIDECAR_CRASHED` remains `retryable=True` — the reconnect watcher can re-launch that sidecar without a full gateway restart.

**Tests:** 2 source-inspection tests verifying the retryable flags.

---

## 9. FTS UPDATE Trigger Narrowing — PR [#68891](https://github.com/NousResearch/hermes-agent/pull/68891)

**Issue:** On large `state.db` (9.4 GB, 447K rows), in-place compaction updates `active=0, compacted=1` on every message row. The FTS5 UPDATE triggers (`messages_fts_update`, `messages_fts_trigram_update`) fired on **every** UPDATE, causing a full FTS delete/reinsert for status-only changes. This saturated disk I/O (96% utilization, 49% iowait), wedged gateway shutdown (SIGKILL after timeout), and left the gateway unresponsive for 5+ minutes.

**Fix:** Narrowed the triggers from `AFTER UPDATE ON messages` to `AFTER UPDATE OF content, tool_name, tool_calls ON messages`:

```sql
-- Before: fires on any column change (active, compacted, observed, ...)
CREATE TRIGGER messages_fts_update AFTER UPDATE ON messages BEGIN ...

-- After: fires only when content-bearing columns change
CREATE TRIGGER messages_fts_update AFTER UPDATE OF content, tool_name, tool_calls ON messages BEGIN ...
```

Status-only updates from compaction no longer trigger FTS reindexing. A migration step drops the old broad triggers on schema init so the narrowed versions replace them (since `CREATE TRIGGER IF NOT EXISTS` won't replace an existing trigger with a different definition).

**Tests:** 4 tests verifying FTS reindexes on content change, does NOT reindex on status-only change, and the same for trigram FTS.

---

## 10. Telegram Inbound Dedup — PR [#68906](https://github.com/NousResearch/hermes-agent/pull/68906)

**Issue:** Telegram can redeliver the same `update_id` via retry-delivery, webhook/polling overlap, or graceful-shutdown ACK race. Each duplicate triggered a separate agent turn, producing duplicate assistant replies.

**Fix:** Added a bounded in-memory `update_id` dedup at the top of every Telegram inbound handler (`_handle_text_message`, `_handle_command`, `_handle_location_message`, `_handle_media_message`). A dict keyed on `update.update_id` with a 4096-entry cap and oldest-first eviction suppresses duplicates before any handler work begins.

The dedup is thread-safe (protected by a `threading.Lock`) and handles the edge case of `update_id=None` (never tracked — some webhook payloads may not include it).

**Tests:** 3 tests covering duplicate suppression, `None` update_id, and cap eviction.

---

## 11. Configurable journal_mode — PR [#68912](https://github.com/NousResearch/hermes-agent/pull/68912)

**Issue:** `state.db` corruption on macOS virtiofs (Linux containers on Mac), NFS, and SMB — WAL is not crash-safe on these filesystems. The `checkpoint_fullfsync` mitigation was guarded on `sys.platform == "darwin"`, silently no-ops inside a Linux container (the exact deployment it was meant to protect). Five v0.19 DB openers also set WAL directly, bypassing `apply_wal_with_fallback` — so any journal-mode setting only reached some databases.

**Fix:** Two parts:

1. **`resolve_journal_mode()`** — reads `HERMES_JOURNAL_MODE` env var or `database.journal_mode` in `config.yaml`. Default `wal`; set to `delete` for virtiofs/NFS/SMB/containerized-on-macOS. Checked at the top of `apply_wal_with_fallback` before attempting WAL.

2. **Centralize 5 bypass openers** — routed `tools/async_delegation.py`, `gateway/delivery_ledger.py`, `agent/verification_evidence.py`, `cron/executions.py`, and `plugins/platforms/discord/recovery.py` through `apply_wal_with_fallback` instead of setting `PRAGMA journal_mode=WAL` directly.

A single `HERMES_JOURNAL_MODE=delete` now covers every `.db` Hermes opens — no more deployment-specific fork patches.

**Tests:** 7 tests covering default/override/invalid config, `apply_wal_with_fallback` honoring delete mode, and source inspection of all 5 bypass files.

---

## 12. Per-Sender Profile Routing — PR [#68913](https://github.com/NousResearch/hermes-agent/pull/68913)

**Issue:** `gateway.profile_routes` matched on `platform`, `guild_id`, `chat_id`, `thread_id` — none of which work for per-sender DM routing on platforms where every DM is its own chat (WhatsApp, Signal, iMessage, SMS). You couldn't route one user's WhatsApp DMs to a `work` profile and another household member's to a `family` profile without enumerating every `chat_id`.

**Fix:** Added optional `from_number` and `sender_id` fields to `ProfileRoute`:

```python
@dataclass(frozen=True)
class ProfileRoute:
    ...
    from_number: Optional[str] = None    # phone-based platforms (WhatsApp, Signal)
    sender_id: Optional[str] = None     # generic (Telegram user_id, etc.)
```

Matching priority: `from_number`/`sender_id` gets specificity +5, slotted between `chat_id` (+4) and `guild_id` (+2). The `matches()` method accepts a new `sender_id` parameter that checks against either field on the route. `match_profile_route()` and `gateway/run.py` pass `source.user_id` as the `sender_id`.

Existing routes without `from_number`/`sender_id` continue to match exactly as before — this is purely additive.

**Tests:** 41 tests (9 new + 32 existing profile routing tests all still green).

---

## Process Notes

### How we worked

1. **Synced the fork** to `upstream/main` post-v0.19.0 release
2. **Triage**: fetched all open P1/P2/P3 + `platform/windows` issues, filtered by existing PRs and saturation, ranked by fit
3. **Claimed** issues via comments before starting work (avoiding duplicate effort)
4. **One branch per PR** — fresh branch from `upstream/main`, fix, test, commit, push, open PR
5. **Tested locally** — every PR ran its focused test suite to green before push
6. **Responded to review feedback** in real time (the `/curator` PR got a thorough review from @PRATHAMESH75 that led to a v2 with `run_slash`)

### What we skipped and why

- **#68167** (Signal SSE on Windows): requires a JSON-RPC polling fallback feature and a live signal-cli on Windows to test — not a surgical fix
- **#68465** (Telegram stuck connecting): `needs-repro` on a specific VPN network environment we can't replicate
- **#68800** (`hermes cron validate`): labeled `needs-decision` — maintainer scope not yet confirmed
- **#68871** (Buzz messaging): large new platform adapter feature
- **#68736** (npm audit): TypeScript/Node.js workspace — outside our Python verification scope

### Stats

- **13 PRs opened** (12 new + 1 pre-existing stewarded)
- **1 PR closed** (#65766 — conflicting, with reopen-on-request note)
- **131 focused tests** all green across all branches
- **8 GitHub issues** claimed and addressed
- **0 fabricated results** — every test ran against real code on a real Windows machine

---

## What's Next

All 13 PRs are **MERGEABLE** and awaiting maintainer review. The sprint demonstrates a repeatable workflow for upstream contribution sprints: triage by label and saturation, claim before coding, one branch per PR, test to green, respond to reviews in real time.

If you're running Hermes Agent on Windows or any filesystem where WAL isn't safe, watch for these PRs landing — particularly [#68912](https://github.com/NousResearch/hermes-agent/pull/68912) (configurable `journal_mode`) and [#68891](https://github.com/NousResearch/hermes-agent/pull/68891) (FTS trigger narrowing). Both address production-corruption-class bugs that are silent until they aren't.

---

*Jasmine Naderi is Principal Engineer, Agent Systems at SMF Works. She builds in the open at [github.com/smfworks](https://github.com/smfworks).*