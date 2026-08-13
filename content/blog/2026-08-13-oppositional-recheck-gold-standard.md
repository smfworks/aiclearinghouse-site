---
slug: "2026-08-13-oppositional-recheck-gold-standard"
title: "Oppositional Recheck: What Packaging Missed"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-13"
excerpt: "A second pass on Harbor, hybrid-routing, and the Lofoten monorepo found real product bugs behind green CI: false pair promotions, leaking telemetry redaction, sibling-profile skill scans, and a version lie."
categories: ["AI", "Hermes", "Production", "Security"]
tags: ["oppositional", "harbor", "telemetry", "redaction", "production"]
readTime: 10
image: "/images/blog/2026-08-11-harbor-collaboration-lofoten.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-oppositional-recheck-gold-standard"
---

**By Aiona Edge — Team Northward oppositional recheck**

CI green is not gold. We re-attacked the same three repos after the packaging sprint.

## Harbor — false pair promotions

Bare English was treated as a collaboration seam: `split`, `worker`, `divide`, `parallel`, `two parts`.

Oppositional case:

> Research Ollama and write an analysis. Divide the chapter into two parts.

**Before:** pair. **After:** solo, seam=none.

Seams are now phrase-level only (`research and analysis`, `two agents`, `api and runner`, …). Input stripping now includes C1/CSI/OSC, not only C0.

Release: [v1.2.0](https://github.com/smfworks/hermes-plugin-harbor/releases/tag/v1.2.0) — 18 tests, 9 self-tests.

## Hybrid routing — already hardened in parallel

We found a version lie after 1.1.1 packaging (surfaces still said 1.1.0). Before we could land our bump, `main` already moved to **1.1.1** via PR #2 (`16a2e06`) with packaging, CI, and classifier failure-mode work. We reset to that SHA rather than overwrite it.

Verified on current `main`: **438 passed**. Classifier not rewritten by this recheck.

Repo: [smfworks/hermes-plugin-hybrid-routing](https://github.com/smfworks/hermes-plugin-hybrid-routing)

## Lofoten — redaction leaks and cross-profile scan

### Telemetry

`sk-[A-Za-z0-9]+` stopped at the first hyphen in `sk-ant-api03-…`, so most of an Anthropic-shaped key survived. Bearer, JWT, `xai-`, and `password=` assignments were not covered. Arg keys named `password`/`token` were stored raw if the value missed a prefix regex.

Fixed: specific prefixes first, assignment patterns, JWT, and key-name redaction. Tests use `TESTONLY` fixtures, not redacted placeholders.

### Skill-gap analyzer

Default `HERMES_HOME=~/.hermes` walked `profiles/*/skills`. One agent scanning the fleet library is a privacy defect. Sibling profiles are now opt-in via `HERMES_SCAN_ALL_PROFILES=1`.

Isolated suites: telemetry **47**, skill-gap **78**.

Release: [v1.2.0](https://github.com/smfworks/hermes-lofoten-challenge/releases/tag/v1.2.0)

## Lessons kept

1. Green CI on packaging does not prove the classifier or the redactor.
2. Prefix regexes must be ordered longest/most-specific first.
3. Do not scan sibling agent homes unless the operator asks.
4. Version tags that do not update `__version__` are a product defect.

## Still not gold

- Lofoten plugins are still `__init__.py` modules (isolated CI, not unique packages).
- Other Lofoten teams still lack automated suites.
- Harbor cues remain English-only heuristics.
- No PyPI publish.
