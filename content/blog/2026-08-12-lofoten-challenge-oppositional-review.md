---
slug: "2026-08-12-lofoten-challenge-oppositional-review"
title: "The Maelstrom Test: Adversarial Hardening for Hermes Skills and Plugins"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-12"
excerpt: "We built an oppositional-review skill and a skill-forge plugin that tries to break your own work before someone else does. 36 edge-case tests across three plugins, zero crashes. Inspired by the Moskstraumen — the original maelstrom off Lofoten's coast that tests every vessel equally."
categories: ["AI", "Hermes Agent", "Plugins", "Lofoten Challenge"]
tags: ["hermes-agent", "adversarial-testing", "quality", "stress-testing", "lofoten", "maelstrom", "skill-forge"]
readTime: 14
image: "/images/blog/2026-08-12-lofoten-challenge-oppositional-review.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-12-lofoten-challenge-oppositional-review"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The maelstrom

Between Moskenesøya and Værøya in western Lofoten, the tide rushes through a narrow strait and creates one of the world's most powerful tidal currents: the Moskstraumen. This is the original maelstrom — the word entered European languages from descriptions of this specific location. Edgar Allan Poe set "A Descent into the Maelström" here in 1841. Jules Verne referenced it in *Twenty Thousand Leagues Under the Sea*.

The maelstrom doesn't care how well-built your boat is. It tests everything equally. A beautifully crafted vessel and a slapdash raft face the same forces. The difference only becomes visible under pressure.

This is the exact right metaphor for adversarial testing. Your code works on the happy path. Every code works on the happy path. The question is: what happens when the maelstrom hits? What happens when the input is `None`? When the string is 10KB of unicode emoji? When the args dict contains SQL injection? When two threads call the same handler simultaneously?

## What we built

### Skill: oppositional-review

A systematic framework for adversarial testing of your own work before shipping. The skill covers:

**Attack patterns by artifact type:**
- **Skills**: frontmatter validation, instruction clarity, missing steps, hallucination risk, context pollution
- **Plugins**: error handling, JSON return compliance, hook safety, thread safety, resource leaks
- **Code**: boundary testing, unicode and encoding, concurrent access, resource exhaustion
- **Blog posts**: fact verification, link integrity, template hazards, build verification

**Edge case discovery methodology:**
A systematic table of 8 edge-case categories (empty, boundary, malformed, unicode, oversized, wrong type, injection, concurrent) with specific example values for each.

**Red-team prompts:**
Specific adversarial prompts to run against each artifact type — "Follow this skill step by step with NO additional tools. Where do you get stuck?" / "Call every tool with `{}` as args. What breaks?" / "What happens if the plugin's data file is corrupted JSON?"

**Sign-off criteria:**
Explicit checklists that must all pass before shipping. For plugins: every handler returns a JSON string, every handler accepts `**kwargs`, every handler handles malformed input gracefully, no handler raises exceptions, hooks log errors, thread-safe shared state, no unbounded memory growth.

### Plugin: skill-forge

Testing and validation tools for Hermes skills and plugins. Four tools:

- `validate_skill` — checks SKILL.md frontmatter, file structure, description length, linked file references, ambiguous instructions, hardcoded paths
- `validate_plugin` — checks plugin.yaml manifest, __init__.py register(ctx), schemas.py and tools.py, tool schema completeness, handler patterns (**kwargs, json.dumps)
- `test_tool_handler` — loads a plugin's tools.py, calls a specific handler with test args, returns result + timing + pass/fail status
- `stress_test_tool` — runs 12 edge-case argument sets against a handler: empty dict, None, missing required, empty strings, 10KB strings, unicode, None values, numeric-as-string, nested dicts, booleans, SQL injection, XSS

Plus a `/forge` slash command that validates all installed skills (`/forge`) or all installed plugins (`/forge plugins`), and a `post_tool_call` hook that logs execution timing to `~/.hermes/skill-forge/timing.json`.

## How we tested — the self-test

The skill-forge plugin is itself a tool for testing plugins. So we used it to test itself. This is the adversarial testing equivalent of standing in front of your own mirror:

### Cross-validation (all 6 deliverables validated)

| Deliverable | validate_skill | validate_plugin | Result |
|-------------|---------------|-----------------|--------|
| agent-self-assessment (skill) | ✅ valid | — | 0 errors, 1 warning |
| research-synthesis (skill) | ✅ valid | — | 0 errors, 1 warning |
| oppositional-review (skill) | ✅ valid | — | 0 errors, 3 warnings |
| session-observability (plugin) | — | ✅ valid | 0 errors, 0 warnings |
| knowledge-atlas (plugin) | — | ✅ valid | 0 errors, 0 warnings |
| skill-forge (plugin) | — | ✅ valid | 0 errors, 0 warnings |

### Stress tests (36 total, 0 crashes)

We stress-tested three tool handlers with 12 edge cases each:

| Plugin | Tool | Passed | Failed | Crashed |
|--------|------|--------|--------|---------|
| session-observability | session_report | 12 | 0 | 0 |
| knowledge-atlas | knowledge_extract | 12 | 0 | 0 |
| skill-forge | validate_skill | 12 | 0 | 0 |

**Total: 36 edge-case tests, 36 passed, 0 failed, 0 crashed.**

The edge cases included:
- Empty dict `{}`
- None for all parameters
- Missing required fields
- Empty strings
- 10KB strings (`"x" * 10000`)
- Multi-script unicode: `Lofoten — 洛福滕 — Лофотен — 🏔️🐟`
- Boolean values where strings expected
- SQL injection: `"'; DROP TABLE--"`
- XSS: `"<script>alert(1)</script>"`
- Nested dicts
- Numeric values where strings expected

Every handler returned a valid JSON string for every input. No exceptions. No hangs. No crashes.

## The Lofoten connection

The Moskstraumen is not just a metaphor — it's a design philosophy. The maelstrom exists because of specific geographical conditions: a narrow strait between two islands, a large tidal range, and the specific bathymetry of the seabed. Remove any of these and the maelstrom disappears. The maelstrom is a system property, not a component property.

Adversarial testing works the same way. A plugin that passes all 12 edge cases in isolation might still fail when two hooks fire simultaneously, or when the file system is full, or when the JSON file is corrupted. The maelstrom test — our stress test — is designed to create the conditions where system-level failures emerge, not just component-level failures.

The Lofoten fishermen who navigated the Moskstraumen for centuries didn't avoid it. They understood it. They knew when the tide was slack, when it was running, and where the eddies formed. They used the maelstrom's dynamics to their advantage, riding the currents when they could and waiting when they couldn't.

The oppositional-review skill teaches the same approach: don't avoid the edge cases — understand them. Map them. Test against them. Build the knowledge of where your code breaks into the development process, not just the debugging process.

The skill-forge plugin is the instrument: it generates the maelstrom on demand. You don't have to wait for a production incident to find out what breaks. You can run `/forge` and see every skill's structural issues, or call `stress_test_tool` and watch your handler face 12 adversarial inputs in 0.04 seconds.

## What this means for Hermes

The skill-forge plugin gives Hermes a self-testing capability that didn't exist before. Before shipping a plugin, you can:

1. `validate_plugin` — check structure and patterns
2. `test_tool_handler` — verify a single handler works
3. `stress_test_tool` — throw 12 edge cases at it
4. `/forge` — validate every installed skill at once

The oppositional-review skill gives the agent a framework for doing this systematically — not just running tests, but thinking adversarially about its own work. The five attack pattern categories (skills, plugins, code, content, configs) and the sign-off checklists create a repeatable hardening process.

Together, they close a loop: **build → test → break → fix → ship**, with the breaking step being deliberate rather than accidental.

## Reproducing this work

All code is in the [hermes-lofoten-challenge repository](https://github.com/smfworks/hermes-lofoten-challenge) under `team-skrotvagen/`. Install the plugin by copying `skill-forge/` to `~/.hermes/plugins/`. Run `/forge` after enabling to validate all installed skills.

## Verification notes

- All stress tests run with real Python module loading (importlib.util), not mocks
- 36 total edge-case tests across 3 tools, 0 crashes
- Cross-validation: skill-forge validates all 3 skills and all 3 plugins (including itself)
- Thread-safe timing data collection via threading.Lock
- Timing data persisted to ~/.hermes/skill-forge/timing.json every 20 tool calls
- Lofoten facts verified against Wikipedia and BBC Travel

## Sources

- [Wikipedia: Lofoten — Moskstraumen](https://en.wikipedia.org/wiki/Lofoten)
- [BBC Travel: Lofoten overtourism](https://www.bbc.com/travel/article/20250801-are-the-worlds-most-beautiful-islands-in-danger)
- [Hermes Agent Plugin Documentation](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins)
- [Edgar Allan Poe: A Descent into the Maelström (1841)](https://en.wikipedia.org/wiki/A_Descent_into_the_Maelstr%C3%B6m)