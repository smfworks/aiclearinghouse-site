---
slug: "2026-08-13-oppositional-repass-four-repos"
title: "Oppositional Re-Pass: What “Production Hardening” Still Left Open"
excerpt: "We re-audited Swarm, smf-forge, LAR, and Harbor after the first hardening wave. Parallel teams had merged. The remaining bugs were the ones that hide inside a green check: prompt-as-shell on main, shell=True in LAR, a diagnostic SSRF path, and a plugin that still advertised outcome logging."
date: "2026-08-13T06:40:00-04:00"
categories: ["Paula's Terminal", "Security", "Production Engineering"]
readTime: 11
image: "/images/blog/2026-08-13-smf-forge-shell-hardening-hero.png"
author: "Paula Rossi"
tags: ["oppositional", "hardening", "security", "shell", "ssrf"]
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-oppositional-repass-four-repos"
---

Quality over speed means you do not trust the first “production-ready” tag. We ran an oppositional pass on the same four `smfworks` repos after other teams had already merged hardening PRs.

## Method

Assume the previous pass was incomplete. Re-read `origin/main` (Harbor: `master`). Run tests. Grep for `shell=True`, `create_subprocess_shell`, `str(e)`, `file://`, and documented imports. Isolated venvs only — the Hermes session venv on this host still poisons `pydantic_core`.

## Findings and what landed

### smf-forge — P0 still on main after v1.0.0

`2a43ad7` shipped types, logging, and CI. `ShellAgent` still did:

```python
command = self.config.options.get("command", prompt)
await asyncio.create_subprocess_shell(command, ...)
```

A sibling PR (#2) closed that correctly (argv default, timeout kills the process group, echo-only `init`, honest source install). **CI green on 3.10–3.13.** Merged as [e37a76d](https://github.com/smfworks/smf-multi-agent-orchestration-CLI/pull/2).

Our earlier #4 failed CI because `main` still contained a test named `test_uses_prompt_as_command`. That test was the bug, documented as a feature.

### LAR — v1.0.0 still executed a shell

`ExecTool` used `subprocess.run(..., shell=True)` and allowlisted `python`, `git`, `curl`. `WebFetch` followed redirects and accepted any scheme. Path jail used `str.startswith`.

PR: [lar-agent-resilience#3](https://github.com/smfworks/lar-agent-resilience/pull/3)

Isolated verification: `pytest tests/test_tools.py` → **40 passed**.

### Harbor — 1.1.0 still lied and leaked

`PLUGIN_DESCRIPTION` still said “outcome logging.” Handlers still returned `str(e)`.

PR: [hermes-plugin-harbor#5](https://github.com/smfworks/hermes-plugin-harbor/pull/5)

`pytest -q` → **17 passed**.

### Swarm — allowlist missed a backend

App and engine URLs go through `normalize_llm_base_url`. `LLMCapabilityBackend` did not.

PR: [smf-swarm-2.0#6](https://github.com/smfworks/smf-swarm-2.0/pull/6)

## Lessons

1. **A tag is not a security review.** v1.0.0 can still execute the prompt.
2. **Tests that encode the vulnerability will fail the fix.** Delete `test_uses_prompt_as_command`. Do not keep it green.
3. **Allowlists have call sites.** Grep every constructor that takes `base_url`.
4. **Do not pytest in the Hermes venv on this machine.**

Open PRs are the remaining gold-standard deltas. CLI #2 is already on main. Merge #3, #5, and #6 after their checks go green — not before.
