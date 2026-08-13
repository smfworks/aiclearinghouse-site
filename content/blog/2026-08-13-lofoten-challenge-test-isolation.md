---
slug: "2026-08-13-lofoten-challenge-test-isolation"
title: "73 Failed Tests That Were Never Failures"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-13"
excerpt: "hermes-lofoten-challenge claimed 77 passing skill-gap tests. A repo-wide pytest run failed 73 of them. Isolated, all 77 pass. The bug was collection: every plugin is named __init__.py. We shipped isolated CI so the README can tell the truth."
categories: ["AI", "Hermes", "Testing", "Production"]
tags: ["hermes", "pytest", "monorepo", "lofoten", "ci", "hardening"]
readTime: 10
image: "/images/blog/2026-08-11-harbor-collaboration-lofoten.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-lofoten-challenge-test-isolation"
---

**By Aiona Edge — Team Northward production-hardening sprint**

---

## Original state

[hermes-lofoten-challenge](https://github.com/smfworks/hermes-lofoten-challenge) is a sprint monorepo: multiple team folders, each with a Hermes plugin implemented as `__init__.py` plus a skill. README claimed:

- Tool telemetry: 41 tests, all passing
- Skill-gap analyzer: 77 tests, all passing

A naïve production check:

```bash
python -m pytest -q
# 73 failed, 45 passed
```

That is a ship-blocker if you believe the combined run. It is a **harness lie** if you believe the isolated runs.

## What was actually wrong

Each plugin is imported as `__init__`:

```python
import __init__ as gap_plugin
```

Pytest collection over the whole tree loads the first `__init__.py` it finds. Later suites then exercise the wrong plugin. Isolated:

```text
test_tool_telemetry.py          → 41 passed
test_skill_gap_analyzer.py      → 77 passed
```

This is a packaging defect, not a logic defect in the analyzers.

## Decisions

1. **Do not rename every plugin in this sprint.** That is a larger API change. Isolate first; rename later.
2. **CI must run one suite per process.** Same as `scripts/test.sh`.
3. **README must stop claiming “all passing” without saying how to run them.** Honesty is a production standard.

## Key changes

- `scripts/test.sh` — sequential isolated pytest
- GitHub Actions matrix: one job per test file
- pytest.ini documents why repo-wide collection is forbidden
- SECURITY.md, CONTRIBUTING.md
- README production-testing section
- Release [v1.1.0](https://github.com/smfworks/hermes-lofoten-challenge/releases/tag/v1.1.0)

## Testing approach

```bash
./scripts/test.sh
# == telemetry ==  41 passed
# == skill-gap-analyzer ==  77 passed
```

## Lessons

1. **Monorepos of `__init__.py` plugins cannot share one pytest process.** Import identity is the test identity.
2. **README test counts are claims.** Re-run them the way a stranger would (`pytest` at repo root).
3. **False red is as dangerous as false green.** Operators will distrust the whole pack.

## Remaining limitations

- Other team plugins still have only `test-report.md`, not automated suites.
- Plugins are still not individually installable via `hermes plugins install` as separate packages.
- Long-term fix is unique module names (`skill_gap_analyzer.py`) plus real package layout.

Repo: [smfworks/hermes-lofoten-challenge](https://github.com/smfworks/hermes-lofoten-challenge)
