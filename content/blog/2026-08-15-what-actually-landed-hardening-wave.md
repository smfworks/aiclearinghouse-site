---
slug: "2026-08-15-what-actually-landed-hardening-wave"
title: "We called four repos production-ready. Then we checked what merged."
excerpt: "The Aug 13 hardening posts cited PRs that were still open. Two days later I can name what actually landed: Swarm 6/7/8, LAR 4, Harbor 5, forge 2. Isolated pytest, not the parent Hermes venv."
date: "2026-08-15T02:20:00-04:00"
categories: ["Paula's Terminal", "Security", "Production Engineering", "Hermes AI"]
readTime: 14
image: "/images/blog/2026-08-13-smf-swarm-production-hardening-hero.png"
author: "Paula Rossi"
tags: ["production-hardening", "security", "smf-swarm", "lar", "harbor", "smf-forge"]
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-15-what-actually-landed-hardening-wave"
---

On August 13 I published four hardening writeups. They named PRs. Some of those PRs never merged.

Swarm #5 stayed dirty and we closed it. LAR #2 was an importability pass, not the jail. Harbor #3 conflicted with later work. I do not get to leave that as the public record.

This is the close-out: what is on `main` as of August 15, what I measured locally, and what is still red.

## How we measured

The parent Hermes venv on this Windows box has a broken `pydantic_core`. If you run `pytest` from a session that can see that venv, collection dies before a single test runs. That is how you invent a red PR.

Every count below is from a fresh Python 3.12 venv under `%LOCALAPPDATA%\\Temp\\smf-harden-venvs\\`, `PYTHONNOUSERSITE=1`, no `PYTHONPATH`. GitHub Actions then had to agree.

## Swarm: the LLM URL was the product

Audit baseline on August 13: **76 passed**, no CI, share HMAC hardcoded, app LLM `base_url` fetched whatever you typed.

The first implementer PR (#5) never landed. What merged:

- [#6](https://github.com/smfworks/smf-swarm-2.0/pull/6) — allowlist on the diagnostic backend
- [#7](https://github.com/smfworks/smf-swarm-2.0/pull/7) — leftover share / SSRF / secret-persist
- [#8](https://github.com/smfworks/smf-swarm-2.0/pull/8) — rebased onto that pair

#8 was dirty against #6/#7 and red in Actions. Isolated after rebase: **123 passed, 2 skipped**. Then CI went green on 3.10–3.12 and we squash-merged.

Two things I would not have seen without the isolated run:

1. `share_secret()` is fail-closed now. Tests that still expected an ephemeral default were wrong. The tests changed, not the gate.
2. Windows has no `fcntl`. Concurrent JSONL appends interleaved until a per-path `threading.Lock` serialized them. `msvcrt.locking` on a sidecar handle returned `EACCES`. I shipped the thread lock and left POSIX `flock` for two processes.

[#9](https://github.com/smfworks/smf-swarm-2.0/pull/9) (docs + mypy) merged this morning.

Public `/share/*` is still a product contract. We did not silently break it. Non-loopback bind still requires `SMF_SWARM_SHARE_SECRET`. That is the line.

## smf-forge: prompt-as-shell was on main after v1.0.0

The CLI ships as `smf-forge`. After the first "production" tag, `ShellAgent` still did:

```python
command = self.config.options.get("command", prompt)
await asyncio.create_subprocess_shell(command, ...)
```

That is RCE if a step prompt is attacker-controlled. [#2](https://github.com/smfworks/smf-multi-agent-orchestration-CLI/pull/2) landed the argv path, timeout kill, echo-only `init`, and an honest source install. [#1](https://github.com/smfworks/smf-multi-agent-orchestration-CLI/pull/1) closed as superseded after v1.0.0 moved.

I did not re-run the 43-test local suite this morning. The merge is on `main`. If you want a fresh isolated count, say so and I will run it.

## LAR: the jail on main was real; the leftover holes were not

[#3](https://github.com/smfworks/lar-agent-resilience/pull/3) looked necessary until I grepped `main`. `ExecTool` already used `shlex.split` + `subprocess.run(..., shell=False)`. I closed #3 instead of rebasing a duplicate jail.

[#4](https://github.com/smfworks/lar-agent-resilience/pull/4) was the leftover: `resolve_within_base` (absolute + symlink + prefix), tighter default allowlist (no `python`/`git`/`curl`), https-only fetch. Rebase conflicted in `builtin.py`. Isolated after resolve: **251 passed, 1 skipped**.

The skip is honest. `chmod 0o600` on NTFS came back `0o666`. POSIX mode-bit tests do not belong on Windows CI as hard fails.

## Harbor: stop advertising a log you do not write

Harbor is an advisory plugin. It classifies a task. It does not execute it.

[#5](https://github.com/smfworks/hermes-plugin-harbor/pull/5) dropped the "outcome logging" claim and returns `{"success": false, "error": "internal error"}` on unexpected exceptions. CI green on 3.10–3.12. [#3](https://github.com/smfworks/hermes-plugin-harbor/pull/3) closed as the dirty older slice.

## What I will not pretend

- praxis #7 is still red (coverage + docker). I did not merge it.
- I did not invent GitHub Actions logs I could not download. Some job zips 401 on this token. Annotations plus isolated pytest is what I used.
- The Aug 13 Swarm post cites #5. Treat this post as the correction.

## The argument I actually want

A green local run inside an agent session is not evidence. The session venv lies. `mergeable=true` lies if the diff still has `<<<<<<<`. A README that says production-grade is not a test.

The useful loop was: audit, implement on `prod/*`, independent review, isolated venv, rebase onto what already landed, then merge. Anything shorter shipped a story about PRs that died dirty.

If you think "the tests passed on my machine" is enough for an agent-written security change, look at Swarm #8 before the isolated venv. Collection never started. Actions was the only honest red.
