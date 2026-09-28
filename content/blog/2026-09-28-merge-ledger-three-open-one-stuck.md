---
slug: "2026-09-28-merge-ledger-three-open-one-stuck"
title: "Three Open, One Stuck, One Waiting for Checks: The Upstream Ledger"
excerpt: "Monday ledger: PR #93172 is mergeable with all CI green and has been waiting since August. #124319 just opened but CI has not reported. #86777 and #90133 are conflicting. Meanwhile upstream landed a toolchain isolation campaign that changes what Hermes will provision on our next update."
date: "2026-09-28T15:00:00-04:00"
categories: ["The Review", "Production Engineering", "Hermes AI"]
tags: ["the-review", "merge-ledger", "hermes", "upstream", "pull-requests", "toolchain"]
readTime: 7
image: "/images/blog/2026-09-28-merge-ledger-three-open-one-stuck.svg"
author: "Paula Rossi"
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-28-merge-ledger-three-open-one-stuck"
---

This is a Monday merge ledger. No announcement, no essay. What is open, what is green, what is stuck, and what landed upstream that changes the ground under our fork.

All PR data below was confirmed live against `NousResearch/hermes-agent` at 2026-09-28 15:00 EDT using `gh pr view` and `gh pr checks`. Commit messages were pulled with `gh api`.

## Open and mergeable

**PR #93172 — `fix(skills): resolve bundled script paths through HERMES_HOME` (#93152)**

Open since 2026-08-23. Mergeable. 35 additions, 5 deletions. All 18 required CI checks pass — ruff, Python tests, e2e, Windows-only tests, macOS-only tests, OSV scan, supply-chain scan, attribution, the lot. This is the strongest candidate to land next. It has been waiting for maintainer review for over a month.

The fix is small: bundled skill scripts should resolve through `HERMES_HOME` so they work regardless of which profile launched the session. Without it, a skill that ships a helper script breaks when the profile path is not the default. The PM-managed toolchain campaign (below) does not touch skills path resolution, so there is no rebase pressure on this one.

**PR #124319 — `fix(pm): retry sync without bytecode compile when that step fails`**

Our newest contribution. Pushed 2026-09-27 15:29 UTC. 265 additions, 2 deletions. Fixes [#124268](https://github.com/NousResearch/hermes-agent/issues/124268): on Windows, antivirus software locks uv's `--compile-bytecode` temp script (OS error 1224) after packages are already installed. The lock fails `pm repair` and bootstrap — the compile step is an optimization, not a correctness requirement, so the fix retries the sync without bytecode compilation when that specific step fails.

Mergeable state is currently UNKNOWN — CI has not reported yet. The branch was pushed less than 24 hours ago. This is the expected state for a fresh PR, not a problem. The commit message is clean: the 265-line diff is tests, not noise. Eight test cases covering the retry logic, the no-retry-on-unrelated-failure case, the happy path, and the streamed-tail eviction edge case.

This PR is directly relevant to the toolchain campaign below. If Hermes is now the only path to node/npm/uv (no PATH fallback), then `pm repair` has to be robust — because there is no manual workaround when it breaks.

## Open and conflicting

**PR #86777 — `fix(sessions): project /new reset lineages to the live tip`**

Conflicting. The upstream desktop session lifecycle campaign — commits `bfda74c7` through `d4720b4e` — touched session identity and routing. That surface overlaps this fix, which resets session lineages on `/new` so a fresh session does not inherit a stale tip. It needs a rebase, not a rewrite. The fix is still correct; the file moved around it.

**PR #90133 — `fix(kanban): correct priority sort order from DESC to ASC` (#90124)**

Conflicting. The v0.21.5 release notes mention a kanban design pass — a two-column ticket modal with markdown task text. That pass likely touched the same file as this priority-sort fix. Same story: rebase, do not rewrite.

## What landed upstream

The dominant upstream campaign this window is **PM-managed toolchain isolation** — six coordinated commits that establish a hard maintainer ruling: Hermes never falls back to the user's node/npm/npx/uv.

The lead commit, [`b63c138d`](https://github.com/NousResearch/hermes-agent/commit/b63c138d), says it plainly in its message:

> Maintainer ruling: only Hermes and only its packaged package managers (uv/pip/node/npm) are ever used; no PATH fallback when the managed tool is missing, no "prefer the user's if new enough."

`find_node_executable` now resolves node/npm/npx to PM's installed copy or `None`. When the runtime is missing, it is provisioned instead of silently borrowing whatever Node the user has on PATH — which avoids native-addon ABI mismatches and npm cache corruption. The follow-up commit, `e0fae556`, extends the same ruling to lint, `pm.activate`, the TUI gateway, and MCP launchers: bare `npx`/`npm`/`node`/`uv`/`uvx` MCP commands resolve to PM's copies. The system fallback tables are gone.

This is architecturally correct. It is also a change to the ground under our infrastructure. Our cron agents, the remote gateway watchdogs, and the PR monitor all spawn subprocesses. Any pattern that relied on the system Node being "good enough" will now provision a PM-managed copy on the first run after this lands. No direct conflict with our open PRs — none touch `find_node_executable`, `pm.activate`, or the PATH tables. But the first update after this lands will trigger provisioning, and that needs to be clean on both the Windows host and the Linux remote gateway.

## The one that already landed

For context: the only SMF contribution upstream has merged to date is **PR #86848** — `fix(cron): do not treat directories as unsafe lifecycle scripts` — merged 2026-08-16. Everything else in our open queue is still waiting.

## What this ledger says

One PR green and waiting a month. One PR fresh and waiting on CI. Two PRs conflicting and waiting on a rebase that is small enough to do in an afternoon. One upstream campaign that changes the provisioning model but does not block any of them.

The rebase backlog is the real action item. #93172 should land — it is green, it is small, it is not in conflict with anything. #86777 and #90133 need a `git rebase origin/main`, a conflict resolution pass, and a force-push. Neither needs a redesign.

That is the ledger. Close-outs beat announcements.