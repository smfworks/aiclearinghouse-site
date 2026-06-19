---
slug: methodology
title: Clearinghouse Methodology
type: page
excerpt: How SMF Works maps, counts, and verifies entries in the AI Clearinghouse.
category: Reference
tags:
  - methodology
  - verification
  - lar
  - runtime
  - clearinghouse
last_updated: 2026-06-19
---

# Clearinghouse Methodology

The SMF Works AI Clearinghouse is a **runtime clearinghouse**, not a marketplace.
It is a living map of the tools, runtimes, models, and patterns we are tracking
so that practitioners can make decisions with better context.

Because this field changes fast, we treat every entry as a claim that can be
verified, corrected, or retired. This page documents how we count, how we test,
and how we handle stale claims.

## 1. What we include

An entry is included if it is:

- Publicly available to run, purchase, or inspect today (not announced, not
  rumored).
- Relevant to autonomous or semi-autonomous AI agents, runtimes, or the models
  that power them.
- Observable by a third party: a website, a repository, an API, or a binary a
  reader can install.

We exclude:

- Internal or unreleased SMF Works projects, unless they have public artifacts.
- Aggregators that list other listings without adding structured fields.
- Research demos with no reproducible install path.
- Pre-announced products without a public runtime.

## 2. Directory schema

Each runtime/agent entry is stored as Markdown frontmatter. The stable schema is:

```yaml
slug: openclaw
title: OpenClaw
excerpt: Hermes-compatible autonomous agent swarm runtime.
category: Open Source
tags:
  - multi-agent
  - orchestration
  - open-source
categories:
  - Multi-Agent
  - Orchestration
  - Open Source
pricing: Open Source           # Free | Paid | Freemium | Open Source
runtime: Hybrid                # Local | Cloud | Hybrid
openSource: true
multiPlatform: true
providerAgnostic: true
model: Model-agnostic
platforms:
  - CLI
  - API
features:
  - Hermes-compatible agent runtime
  - Multi-agent fleet management
  - Swarm orchestration
  - Long-running missions
  - Plugin-based extensions
releaseYear: 2025
company: OpenClaw Community
last_verified: 2026-06-14      # ISO date; must be within 30 days to stay green
install_command: "curl -fsSL https://openclaw.ai/install | sh"
lar_test_id: null               # maps to a LAR benchmark/test script
```

Fields that are **aspirational or not yet tested** are left empty, set to
`null`, or explicitly flagged. We do not backfill intent.

## 3. Verification

### 3.1 LAR `--from-directory` mode

LAR (the SMF benchmark harness) can consume the directory as a claims manifest
and emit verification results. For each entry with a `lar_test_id`, LAR runs the
linked test and produces a `directory_diff` artifact.

```yaml
entry_id: openclaw
run_timestamp: 2026-06-19T10:00:00Z
lar_test_id: openclaw_version_check_v1
result: pass
metrics:
  duration_seconds: 14.2
  tokens_used: null
  exit_code: 0
directory_diff:
  fields_changed:
    - field: last_verified
      claimed: "2026-06-14"
      observed: "2026-06-19"
      action: update
  fields_stale: []
  fields_unverifiable:
    - field: governance_hooks
      reason: no_lar_test_defined
      action: open_methodology_issue
```

### 3.2 Diff actions

| Action | Meaning | Result |
|--------|---------|--------|
| `update` | LAR observed something the directory missed. | Draft PR opened; manual review required. |
| `flag` | A directory claim failed verification. | 30-day decay banner applied to linked posts. |
| `record` | The claim could not be tested in this environment. | Noted in the rolling methodology queue. |
| `open_methodology_issue` | A claim has no LAR test defined. | Added to `methodology-gaps.md`. |

### 3.3 Auto-PR policy

LAR can open draft PRs from a green run, but nothing is auto-merged. Each PR
contains the `directory_diff` block and a reproducible command. Review is
required because verification is a human commitment, not a CI badge.

## 4. Freshness and decay

### 4.1 30-day decay rule

Any claim not re-verified within 30 days is marked with a date banner. Terminal
posts that depend on the claim also carry the banner. The goal is to prevent
quiet rot, not to punish honest staleness.

### 4.2 Inline badges

We use small, status-flavored badges next to runtime claims:

- `verified: 2026-06-19 (LAR run #1247)` — green status.
- `last checked: 2026-05-12 — re-verify pending` — amber status.
- `untested` — gray dash.
- `LAR run failed — see diff PR #N` — red alert.

These are build-status indicators, not trust scores or star ratings. The claim
comes first; the badge is a parenthetical timestamp.

## 5. Counting rules

The numbers we publish are produced by the same code that renders the site. No
hand-counting. As of this writing:

- **Agents/runtimes**: count of Markdown files in `content/agents/`.
- **Directory sections**: count of populated sections in the site directory.
- **Benchmarks**: count of benchmark artifacts published under `/benchmarks/`.

If a number changes because the schema changed or an entry was removed, we
update the public claim immediately. We do not keep stale counts alive for
marketing copy.

## 6. Methodology gaps queue

Untested claims and environment-limited tests are tracked in a single rolling
queue, `methodology-gaps.md`. It is reviewed weekly. Items older than 30 days
without progress are escalated, not duplicated into new issues.

## 7. Corrections before claims

We do not publish a "how we built it" methodology story until at least one LAR
run has actually changed the directory. The methodology must be demonstrated by a
real diff, not defended by prose.

If you find a stale claim, a broken link, or a better install path, open a PR or
send a note to [hello@smfworks.com](mailto:hello@smfworks.com).
