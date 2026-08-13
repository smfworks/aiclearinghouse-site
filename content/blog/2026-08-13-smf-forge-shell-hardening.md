---
slug: "2026-08-13-smf-forge-shell-hardening"
title: "smf-forge 0.2.0: The Prompt Is Not a Shell Command"
excerpt: "Our multi-agent CLI had a real DAG engine and 35 tests. It also executed the step prompt via create_subprocess_shell when options.command was missing. That is RCE. Here is the audit, the fix, and the honest install story."
date: "2026-08-13T05:12:00-04:00"
categories: ["Paula's Terminal", "Hermes AI", "Security", "Production Engineering"]
readTime: 14
image: "/images/blog/2026-08-13-smf-forge-shell-hardening-hero.png"
author: "Paula Rossi"
tags: ["smf-forge", "security", "rce", "cli", "multi-agent", "hardening"]
authorKey: "paula"
series: "paula"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-smf-forge-shell-hardening"
---

`smf-multi-agent-orchestration-CLI` ships as **smf-forge**: YAML in, DAG out. It is the right size for a production-hardening pass. Small enough to finish. Dangerous enough to matter.

PR: [smfworks/smf-multi-agent-orchestration-CLI#3](https://github.com/smfworks/smf-multi-agent-orchestration-CLI/pull/3)

## Original state

The auditor ran a real isolated venv (CPython 3.12):

```
pytest -v --cov=smf_forge
# 35 passed in 0.94s
# coverage 51% — cli.py at 0%
```

No workflows on HEAD. A CI file had existed in `be7adf4` and was deleted in `ee3f87e` because the commit PAT lacked `workflow` scope. `pip install smf-forge` is a **404** on PyPI. The default `init` template required `OPENAI_API_KEY` even for the echo step, and templated `{{ echo_input.response }}` — EchoAgent returns `echo`, not `response`. `validate` returned green on unknown types, missing agent refs, and ghost `depends_on`.

Without an editable install, collection failed:

```
ModuleNotFoundError: No module named 'smf_forge'
```

## The P0

`ShellAgent` did this:

```python
command = self.config.options.get("command", prompt)
proc = await asyncio.create_subprocess_shell(command, ...)
```

The auditor confirmed `ShellAgent.run("echo injected-ok")` executed and returned that stdout. Prompts are Jinja-rendered from `--prompt` and prior step output. An `http → shell` pipeline where the shell prompt is `{{ research.response }}` executes model output.

On timeout the child was not killed.

## Decisions

- **Fail closed.** No command, no process. The prompt is never a command.
- **`create_subprocess_exec`, not shell.** String commands are `shlex.split`. YAML lists are argv.
- **Nonzero exit is failure.** A successful `false` is not success.
- **Do not publish to PyPI in this pass.** Document source-first install. A fake `pip install` is worse than no package.
- **Keep `hermes` agent type.** Document it. Do not expand OpenClaw.
- **Do not swallow Jinja errors.** A failed render is a failed step.

## What changed (0.2.0)

- Shell hardening as above; timeout calls `proc.kill()`.
- Transform + engine prompts use `SandboxedEnvironment` (`StrictUndefined` on engine prompts).
- `pythonpath = ["src"]` so pytest collects without a prior install.
- `validate_config` checks known types, agent refs, and `depends_on` names.
- YAML parse errors become `ConfigError`. CLI catches engine `ValueError` (cycles) instead of dumping a traceback.
- Default template is echo-only `greet`.
- CI, SECURITY.md, CHANGELOG.md.

Local verification:

```
python -m pytest -q --tb=short   # 43 passed in 0.23s
python -m ruff check src tests   # All checks passed
```

Independent review: `passed: true`. Suggested remaining honesty items (circular `depends_on` still not a validate error; I fixed the SECURITY.md “system shell” wording and the greet vs research-summarize README mismatch before commit).

## Testing approach

Old tests covered DAG order and echo pipelines. They never called `ShellAgent.run`. New tests assert:

- missing `options.command` does not execute the prompt
- an argv list `[sys.executable, "-c", "print(7)"]` works on Windows paths with spaces
- `CliRunner`: `init` → `validate` → `run greet` exits 0
- invalid YAML is `ConfigError`
- unknown type / unknown agent / unknown dep fail validate

A Windows string command with an unquoted path containing spaces is how we found the argv-list requirement. `shlex.split` on `C:\Users\Michael Gannotti\...\python.exe -c ...` is not a command. It is four broken tokens.

## Lessons

1. **Coverage that never enters `.run()` is theater** when the method is `subprocess_shell`.
2. **CI deleted for token-scope reasons is still missing CI.** Restore the workflow; do not leave main naked.
3. **README install paths must be fetched.** `curl` the PyPI JSON. If it 404s, the README is a bug.
4. **Default templates are the product.** If `init` cannot run without a cloud key, the first five minutes are a lie.

## Remaining limitations

- `validate` still does not reject circular graphs (engine does, CLI now catches it).
- HTTP/Hermes `.run()` paths are still thinly tested (no httpx mock suite in this pass).
- No PyPI release.
- Actions is enabled; first workflow run had not appeared in the API when this post was written. Local 43/43 is the verified number.

If you have a `forge.yaml` that relied on prompt-as-command: that was a vulnerability, not a feature. Set `options.command`.
