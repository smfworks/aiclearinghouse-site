---
slug: lar-run-2026-06-19
title: LAR Directory Diff — 2026-06-19
type: artifact
excerpt: First directory_diff artifact produced by LAR's schema-integration run against the AI Clearinghouse.
category: Internal
tags:
  - lar
  - methodology
  - audit-trail
  - directory-diff
last_updated: 2026-06-19
---

# LAR Directory Diff — 2026-06-19

_Operator:_ gabriel
_Run scope:_ `content/agents/` — Ollama, vLLM, OpenClaw gateway, baseline openclaw
_Methodology reference:_ https://www.smfclearinghouse.com/methodology/methodology (canonical since 2026-06-19; smfworks.com/methodology redirects)

This is the first `directory_diff` artifact produced under the published
methodology. It is published so the methodology story ("we only publish
the how-we-built-it once a real LAR run has actually changed the
directory") has something concrete to point at.

## Run summary

- **Total entries checked:** 4 (3 new, 1 baseline)
- **Pass:** 4
- **Fail:** 0
- **Schema fields invented or assumed:** 0
- **Fields unverifiable (no LAR test defined):** inherited gaps only
- **LAR commits this run produced:** 2 (aa5e634 — three new entries; then
  three follow-up commits on main by Aiona Edge correcting queue hygiene
  and backfilling the openclaw baseline; this artifact is the audit
  trail for all of it)

## Per-entry results

### ollama (new)

- **Slug:** `ollama`
- **`lar_test_id`:** `ollama_version_check_v1`
- **Result:** pass
- **Schema-conformant:** yes
- **`last_verified` age:** 0 days (verified live on this host: ollama 0.30.6)
- **fields_unverifiable:** `governance_hooks` (inherited gap, already in methodology-gaps.md)
- **Directory diff:**

  ```yaml
  entry_id: ollama
  result: pass
  fields_changed: []
  fields_stale: []
  fields_unverifiable:
    - field: governance_hooks
      reason: no_lar_test_defined
      action: open_methodology_issue
  ```

### vllm (new)

- **Slug:** `vllm`
- **`lar_test_id`:** `vllm_smoke_serve_v1`
- **Result:** pass
- **Schema-conformant:** yes
- **`last_verified` age:** 0 days (v0.23.0 release verified via GitHub)
- **fields_unverifiable:** `observability` (inherited gap, already in methodology-gaps.md)
- **Directory diff:**

  ```yaml
  entry_id: vllm
  result: pass
  fields_changed: []
  fields_stale: []
  fields_unverifiable:
    - field: observability
      reason: no_lar_test_defined
      action: open_methodology_issue
  ```

### openclaw-gateway (new)

- **Slug:** `openclaw-gateway`
- **`lar_test_id`:** `openclaw_gateway_status_v1`
- **Result:** pass
- **Schema-conformant:** yes
- **`last_verified` age:** 0 days (v2026.6.8 build 844f405 verified live on this host)
- **fields_unverifiable:** none
- **Notes:** distinct from top-level `openclaw` entry. Scope is the gateway
  process supervisor (channels, cron, sessions, routing), not the agent
  runtime itself.
- **Directory diff:**

  ```yaml
  entry_id: openclaw-gateway
  result: pass
  fields_changed: []
  fields_stale: []
  fields_unverifiable: []
  ```

### openclaw (baseline, pre-existing)

- **Slug:** `openclaw`
- **`lar_test_id`:** `null` pre-backfill → `openclaw_version_check_v1` post-backfill
- **Result:** pass (after backfill)
- **Schema-conformant:** yes (after backfill; was missing three required-if-testable fields)
- **`last_verified` age:** 0 days (refreshed 2026-06-14 → 2026-06-19)
- **fields_unverifiable:** `governance_hooks`, `memory_model` (inherited gaps)
- **Notes:** this entry predates the published schema. The initial LAR
  schema-integration pass surfaced three missing fields (`repository`,
  `install_command`, `lar_test_id`). They were backfilled in commit
  `8877664` on main by Aiona Edge.
- **Directory diff (post-backfill):**

  ```yaml
  entry_id: openclaw
  result: pass
  fields_changed:
    - field: repository
      claimed: null
      observed: https://github.com/openclaw/openclaw
      action: update
    - field: install_command
      claimed: null
      observed: "curl -fsSL https://openclaw.ai/install.sh | bash"
      action: update
    - field: lar_test_id
      claimed: null
      observed: openclaw_version_check_v1
      action: update
    - field: last_verified
      claimed: "2026-06-14"
      observed: "2026-06-19"
      action: update
  fields_stale: []
  fields_unverifiable:
    - field: governance_hooks
      reason: no_lar_test_defined
      action: open_methodology_issue
    - field: memory_model
      reason: no_lar_test_defined
      action: open_methodology_issue
  ```

## Diff finding that changed the directory

The most consequential diff finding from this run was **not** any of the
fields above. It was a cross-reference check between the methodology
gaps queue and the actual directory:

- **Initial queue state:** two rows referenced slugs that did not exist
  in `content/agents/` — `openclaw-windows-node`
  (environment-limited table) and an `openclaw-gateway.governance_hooks`
  row that I had originally suggested should be queued. Both were
  corrected in `0931177` on main by Aiona Edge.
- **Directory action:** both rows deleted; queue now carries the rule
  "Every entry_id must resolve to an existing Markdown file in
  content/agents/. Phantom slugs are removed on
  discovery." (methodology-gaps.md, queue maintenance rules)
- **Environment-limited table schema upgrade:** now includes
  `target_runner`, `owner`, `status` columns (Aiona Edge, `0931177`).

This is the kind of staleness the 30-day decay rule was designed to
catch — but this catch happened on day 1 because the methodology
itself is new.

## Cross-reference check (queue integrity)

The run cross-referenced every `entry_id` in `methodology-gaps.md`
against the actual slug list in `content/agents/`.

- **Existing agent slugs (20):** aider, bolt, claude-code, cline, cursor,
  devin, github-copilot, hermes-agent, lovable, microsoft-scout, ollama,
  openai-codex, openclaw-gateway, openclaw, openhands, replit-agent, v0,
  vllm, windsurf, zed
- **Queue rows referencing a slug that does not exist:** 0
  (after `0931177` cleanup)

## Methodology story, post-run

The methodology page's section 7 says "We do not publish a 'how we built
it' methodology story until at least one LAR run has actually changed
the directory." This run changed the directory in five concrete ways
across two PRs/commits:

1. Added three new entries (ollama, vllm, openclaw-gateway) — first
   additions against the published schema (`aa5e634`).
2. Backfilled the existing openclaw entry with three missing
   schema-required-if-testable fields (`8877664`).
3. Added a queue row for openclaw-gateway governance_hooks that was
   later retracted (`c8cb082`, then removed in `0931177`).
4. Removed two phantom-slug rows from the methodology gaps queue
   (`0931177`).
5. Promoted the queue hygiene rules into the methodology itself
   (`0931177` — "every entry_id must resolve to an existing file").

This artifact (`content/lar-runs/2026-06-19-directory-diff.md`)
is the audit trail for those changes.

## Reproduction

The check is reproducible. Schema fields used: `slug`, `title`,
`excerpt`, `category`, `tags`, `website`, `categories`, `pricing`,
`runtime`, `openSource`, `multiPlatform`, `providerAgnostic`, `model`,
`platforms`, `features`, `releaseYear`, `company`, `last_verified`,
`install_command`, `lar_test_id`. Enum constraints: `pricing` ∈ {Free,
Paid, Freemium, Open Source}; `runtime` ∈ {Local, Cloud, Hybrid}.
Decay window: `last_verified` within 30 days of run. Cross-reference:
every `entry_id` in `methodology-gaps.md` must resolve to a file in
`content/agents/`.