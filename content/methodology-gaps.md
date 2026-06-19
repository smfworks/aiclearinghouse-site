---
slug: methodology-gaps
title: Methodology Gaps Queue
type: page
excerpt: Untested claims and environment-limited tests in the AI Clearinghouse methodology.
category: Internal
tags:
  - methodology
  - gaps
  - lar
last_reviewed: 2026-06-19
review_frequency: weekly
---

# Methodology Gaps — Rolling Queue

_Last reviewed: 2026-06-19_  
_Frequency: weekly review (Sundays, synced with research synthesis)_

This queue tracks claims in the clearinghouse directory that LAR cannot yet
verify, either because no test exists or because the current environment cannot
run one. Stale items (>30 days with no progress) are escalated.

## Untested claims (no LAR test defined)

| entry_id | field | first_seen | notes |
|----------|-------|------------|-------|
| openclaw | governance_hooks | 2026-06-19 | Needs test: kill parent process mid-inference, check session recovery |
| openclaw | memory_model | 2026-06-19 | Needs test: 1M token context stability under load |
| vllm | observability | 2026-06-19 | Needs test: scrape /metrics endpoint, validate OpenTelemetry export |
| ollama | governance_hooks | 2026-06-19 | Needs test: container restart behavior, model state persistence |

## Environment-limited (cannot test here)

| entry_id | field | first_seen | environment_blocker | target_runner | owner | status | notes |
|----------|-------|------------|---------------------|---------------|-------|--------|-------|
| microsoft-scout | runtime_type | 2026-06-19 | linux x86_64 | Windows runner | unassigned | open | Needs Windows runner; openclaw Windows path already covered in Terminal v2026.6.8 post |

## Resolved

_No resolved gaps yet. First resolution will be linked here._

---

### How to close a gap

1. Write a LAR test that exercises the claim.
2. Run it with `lar --from-directory <entry_id> --rerun`.
3. Link the LAR run id in the resolved section.
4. Move the row from untested/environment-limited to **Resolved**.

### Queue maintenance rules

- Every `entry_id` must resolve to an existing Markdown file in `content/agents/`.
- Phantom slugs are removed on discovery.
- Rows that reference a feature of an existing entry are rewritten to that entry's slug, or removed if the feature is already tracked elsewhere.
