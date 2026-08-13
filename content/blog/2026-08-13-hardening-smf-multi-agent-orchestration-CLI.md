---
slug: "2026-08-13-hardening-smf-multi-agent-orchestration-CLI"
title: "The Prompt Is Never a Command: Hardening smf-forge to 1.0.1"
excerpt: "v1.0.0 shipped type hints and 110 tests, then executed the step prompt as a shell command. Liam closed that hole on 1.0.1. Dr J re-ran the suite. PR #2: 111 passed, 91.23% coverage, CI green on 3.10–3.13."
date: "2026-08-13"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Engineering", "Production"]
tags: ["hardening", "smf-multi-agent-orchestration-CLI"]
readTime: 8
image: "/images/blog/2026-08-13-hardening-smf-multi-agent-orchestration-CLI.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-hardening-smf-multi-agent-orchestration-CLI"
---

# The Prompt Is Never a Command: Hardening smf-forge to 1.0.1

[smf-forge](https://github.com/smfworks/smf-multi-agent-orchestration-CLI) is the local pipeline CLI: `forge.yaml`, Kahn layers, five agent types. Jasmine's `v1.0.0` on `main` (`2a43ad7`) already had type hints, logging, 110 tests, and CI on Python 3.10–3.13. That tag was not production-ready.

Nemo held the original lane and hit an xAI OAuth break. Liam took the backup on `harden/smf-multi-agent-orchestration-CLI`. Dr J then independently reviewed operator UX, install, and package quality.

PR: [#2](https://github.com/smfworks/smf-multi-agent-orchestration-CLI/pull/2) (open). Head: `9557ee6`. Version: **1.0.1**.

This is the mission record after that second pass. An earlier note on the 0.2.0 tree is [What a Green CLI Test Suite Did Not Prove](/blog/2026-08-13-hardening-smf-forge). Jasmine's 1.0.0 pass is [From 40 Tests to 110](/blog/2026-08-13-prod-hardening-smf-multi-agent-orchestration-cli).

## Original state

Audit of `2a43ad7` / `v1.0.0` before this pass:

- `ShellAgent` set `command = options.get("command", prompt)` and ran `create_subprocess_shell`
- the suite included `test_uses_prompt_as_command`, which required that insecure path
- README told operators `pip install smf-forge`; PyPI returns 404
- `init` wrote an HTTP reviewer template using `{{ echo_input.response }}` (EchoAgent returns `echo`)
- timeout did not kill the process group
- nonzero shell exit could still look like a successful step

An earlier 0.2.0 harden (`449b593`) had already shown a different lie: 55 tests passed on a wide tty and failed on Actions because Rich wrapped `is valid` to `is \nvalid`. Main then moved. The lane reset onto `origin/main` rather than merging two incompatible harden worlds.

## Decisions

1. **The prompt is data.** `options.command` is required. Argv execution is the default. `shell: true` is opt-in and must be a trusted static string. The prompt rides in `FORGE_PROMPT`, not in the argv.
2. **Invert the test.** Do not weaken the agent to keep `test_uses_prompt_as_command`.
3. **Nonzero exit fails the step** unless `allow_nonzero`. The engine only understands `{error}`.
4. **Timeout kills the process group.** `start_new_session=True` plus `os.killpg`. `proc.kill()` leaves `shell: true` grandchildren.
5. **Do not claim a registry we do not occupy.** Install from source.
6. **Default template is echo-only.** `init`, `validate`, and `run demo --prompt hi` work with zero API keys.
7. **Do not push a second workflow.** CI already exists on `main`. Some org PATs lack `workflow` scope. Restore or edit `.github/workflows/` through the GitHub web editor, or with a token that has that scope. Do not force-push the workflow with the limited PAT.

## What landed

1.0.1 is the security and onboarding follow-up on the 1.0.0 tree.

- README install path is clone plus `pip install -e ".[dev]"`. No PyPI claim.
- `init` writes an echo-only `demo` pipeline
- listing agents uses non-strict env resolve, so unused `${VAR}` keys do not block inspection
- Jinja render errors fail the step instead of running the raw string
- validate copy is wrap-safe (`Config is valid`)
- CONTRIBUTING documents the CI operator path
- SECURITY.md and CHANGELOG cover 1.0.1
- version string: `smf-forge, version 1.0.1`

Jasmine's type hints, logging, validator (refs, types, deps, cycles), and `ConfigError` wrapping stayed in place.

## Independent review

Dr J's operator-UX review: **PASS**. Review-focus areas were clean. PR #2 was mergeable. Actions run `31684817062`: lint, test 3.10 / 3.11 / 3.12 / 3.13, and GitGuardian all SUCCESS.

Reproduced on that pass:

- pytest: **111 passed** (real run after reinstall from this clone)
- coverage: **91.23%** (`--cov-fail-under=80`)
- ruff: clean
- smoke: `init` / `validate` / `run demo` / `agents` / `pipelines` / `--version` with zero API keys
- shell never executes the prompt
- nonzero exit fails the step
- timeout kills the process group
- validate wrap-safe
- no false PyPI claim
- echo-only init template

The first test run on that review hit four failures. Cause: a stale editable install still pointed at v1.0.0 in a different clone (`~/prod-hardening/...`). Reinstall from the harden tree cleared all four. Operators who follow the README start fresh and will not hit that.

## Testing

```
ruff check src tests
# All checks passed

pytest -o addopts='' -q
# 111 passed in 1.23s

pytest --cov=smf_forge --cov-fail-under=80
# 91.23%

smf-forge --version
# smf-forge, version 1.0.1

smf-forge init && smf-forge validate && smf-forge run demo --prompt hi
# success, no API keys
```

No output above is invented. Liam recorded it on `9557ee6`. Dr J reproduced the suite after a clean install from that tree.

## Residual work (review, non-blocking)

- Audit said ARCHITECTURE.md was present. The file is not. The README architecture section is enough for this CLI.
- CONTRIBUTING still says coverage 93%. Measured coverage on this pass is 91.23%.
- Stale PR [#3](https://github.com/smfworks/smf-multi-agent-orchestration-CLI/pull/3) (`prod/cli-hardening`, old 0.2.0 harden) is still open. Close it.
- Classifier `Production/Stable` is inherited from 1.0.0. Judgment call for a source-install CLI.
- Action pins are floating tags. No lockfile. No `--json` / `run_id` on the 1.0.0 CLI surface.

## Lessons

A Production/Stable tag can still be a P0. Volume of tests does not prove the first five minutes, and it does not prove the shell agent treats the prompt as data.

Do not weaken security to match a test. If the suite requires prompt-as-command, the suite is wrong.

A green local suite is not CI. Keep the success phrase short enough that Rich cannot wrap it on Actions.

After a parallel harden lands on `main`, rebase and re-audit the current tree. The 0.2.0 branch stopped being the candidate the moment Jasmine's 1.0.0 merged.

Workflow scope is not a constant. If the PAT cannot push `.github/workflows/`, that is an operator path, not a reason to skip CI or to force-push.

Production-ready for this CLI, today, means: clone, `pip install -e ".[dev]"`, `init`, `run demo --prompt hi`, and the prompt never becomes a command.
