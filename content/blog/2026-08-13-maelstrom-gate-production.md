---
slug: "2026-08-13-maelstrom-gate-production"
title: "Maelstrom Gate 1.1.0: An Oppositional Linter That Could Also Run Pytest Anywhere"
excerpt: "The Lofoten ship gate already broke thin skills. It also imported undeclared PyYAML and would exec pytest on any path. 1.1.0 times out the runner, allow-lists flags, and declares the dependency."
date: "2026-08-13"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Hermes", "Plugins", "Production", "SMF Works"]
tags: ["maelstrom", "quality-gate", "hermes", "production", "hardening", "lofoten"]
readTime: 4
image: "/images/blog/2026-08-13-maelstrom-gate-production.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-maelstrom-gate-production"
---

# Maelstrom Gate 1.1.0: An Oppositional Linter That Could Also Run Pytest Anywhere

**By William (Skald + Shipwright), SMF Works**  
**Repo:** [smfworks/hermes-plugin-maelstrom-gate](https://github.com/smfworks/hermes-plugin-maelstrom-gate)  
**Release:** [v1.1.0](https://github.com/smfworks/hermes-plugin-maelstrom-gate/releases/tag/v1.1.0)  
**PR:** [#1](https://github.com/smfworks/hermes-plugin-maelstrom-gate/pull/1) (merged)

Moskstraumen is not a vibe. It is a current you respect before you commit the longship. Yesterday’s plugin linted skill frontmatter and plugin shape. It also did two things a production gate should not do quietly: import `yaml` with no declared dependency, and run `pytest` as a subprocess on whatever path an agent handed it.

## Original state

- Three tests: bad skill, good skill, plugin missing `register`. They passed.
- `import yaml` at module top. No `pyproject.toml`. A clean `pip install` of the repo would fail on first check.
- `run_pytest` concatenated extra args with no allow-list and no timeout.
- `full_gate` is useful and was CLI/slash-only (good). The pytest **tool** is registered, so an agent can still launch it.
- README: sixteen lines. Same abbreviated MIT. No CI.

The lint rules were already opinionated in the right direction: `Use when` in the first 57 characters, pitfalls section, completion criteria, AI-tell regexes, `register(ctx)` required.

## Decisions

1. **Declare PyYAML.** A gate that cannot parse `plugin.yaml` on a fresh venv is not a gate.
2. **Timeout pytest at 60s.** A hang is a fail.
3. **Allow-list extra args.** `-q`, `-v`, `--tb=short`, `--tb=line`. Nothing else. No `-k`, no plugin loads, no `--maxfail` smuggling.
4. **Do not put `full_gate` on the tool catalog.** Agents who want the runner must call `maelstrom_run_pytest` on purpose.
5. **Path guards match Stockfish.** Null bytes and `/etc` et al. are refused.
6. **Returned `cmd` is sanitized.** We do not echo the resolved filesystem path back as a full argv that a log scraper will treat as gospel.

## What changed

**Code:** version stamps, `_safe_path`, `_load_yaml` with a clear RuntimeError if PyYAML is missing, pytest timeout + allow-list, frontmatter must be a mapping.

**Tests** — 3 → **8**.

Happy-path plugin, pytest green on a temp tree, extra-arg reject, unrecognized `full_gate`, `/etc` refuse.

Local: `8 passed in 0.30s`. CI green on 3.10–3.12. GitGuardian green.

**Packaging:** `pyproject.toml` with `PyYAML>=6.0`, full MIT, CI, Dependabot, SECURITY (pytest threat model named), ARCHITECTURE, CONTRIBUTING, CHANGELOG.

## Architecture

```
check_skill(path)     → pass | pass_with_fixes | fail
check_plugin(path)    → same, plus nested skill results
run_pytest(path)      → ok, truncated stdout/stderr, 60s
full_gate(path)       → static + tests   (CLI / slash)
```

## Lessons

- An undeclared import is a production bug even if the author’s machine has the package.
- A quality gate that shells out is a **process runner**. Treat it like one: timeout, argv allow-list, no `shell=True`.
- Three tests that never call `run_pytest` cannot claim the runner is safe.
- `full_gate` staying off the tool list is a blast-radius decision, not an accident of the sprint.

## Remaining limits

- The gate does not execute skill *behavior*. It reads files.
- AI-tell regexes are English and easy to dodge.
- `path` is still trusted operator input inside the non-blocked tree.
- Nested plugin skills are checked; arbitrary `references/` trees are not.

Sibling posts: Fjord 1.1.0, Stockfish 1.1.0, Harbor 1.1.1.
