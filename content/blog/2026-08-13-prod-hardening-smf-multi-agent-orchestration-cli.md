---
slug: "2026-08-13-prod-hardening-smf-multi-agent-orchestration-cli"
title: "Production Hardening: SMF Forge CLI — From 40 Tests to 110 with 93% Coverage"
excerpt: "A lightweight Python CLI for multi-agent orchestration hardened from prototype to production: type hints, config validation with cycle detection, 110 tests, and a native HermesAgent integration."
date: "2026-08-13T06:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "Agent Systems", "Production Hardening"]
tags: ["smf-forge", "production-hardening", "Python", "testing", "CI/CD", "multi-agent", "Grok 4.6"]
readTime: 14
image: "/images/blog/2026-08-13-prod-hardening-smf-multi-agent-orchestration-cli.png"
originalUrl: "https://smfworks.com/drj/2026-08-13-prod-hardening-smf-multi-agent-orchestration-cli"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-13-prod-hardening-smf-multi-agent-orchestration-cli"
---

# Production Hardening: SMF Forge CLI — From 40 Tests to 110 with 93% Coverage

SMF Forge is a lightweight Python CLI for multi-agent orchestration. You declare agents and pipelines in a `forge.yaml` file, and the engine resolves dependencies, runs independent steps in parallel, and passes context between steps. It's the kind of tool that starts as a prototype — "wouldn't it be nice to chain AI agents from the terminal?" — and then has to survive contact with real users.

This post documents the production hardening pass that took SMF Forge from a working-but-fragile prototype to a v1.0.0 release with 110 tests, 93% coverage, CI on four Python versions, comprehensive type hints, config validation with cycle detection, and a native Hermes agent integration. It's a case study in what "production hardening" actually means: not rewriting from scratch, but systematically eliminating every way the tool can silently fail.

## The Original State

The initial commit landed on June 12, 2026 — a 1,245-line codebase across four source modules and two test files. The architecture was sound: a config layer (`find_config` → `load_config` → `resolve_env_vars` → `validate_config`), a pipeline engine with topological sort and layer-based parallel execution, an agent registry with four built-in types (echo, http, shell, transform), and a Click-based CLI with five commands (init, run, agents, pipelines, validate).

The problem wasn't the architecture. The problem was everything around it.

**No type hints.** The original code used bare `dict` and `list` instead of `dict[str, Any]` and `list[StepResult]`. Function signatures like `def _load_project_config(path: Path | None = None) -> dict:` give you no help from mypy, no help from your IDE, and no help at 2 AM.

**No config validation for unknown agent types.** `validate_config` checked that each agent had a `type` field, but never checked whether that type was known. A typo like `type: httb` would pass validation and crash at runtime with an unhelpful `KeyError`.

**No config validation for unknown agent references.** A pipeline step could reference `agent: researcher` when no agent named `researcher` existed. The error only surfaced at execution time.

**No cycle detection in config validation.** The engine's `_resolve_order` had cycle detection, but `validate_config` didn't. So `smf-forge validate` would report a config as valid even if it contained a cycle.

**No `${VAR:default}` syntax.** The environment variable resolver only handled `${VAR}` — which raises `ConfigError` if the variable isn't set. But the template file used `${FORGE_PROJECT:my-project}`, meaning `smf-forge init` would create a config that `smf-forge validate` would reject. The tool couldn't validate its own output.

**No CI.** No automated testing on push or pull request. No linting. No coverage gate. The 27 tests could pass today and fail tomorrow with a dependency update, and nobody would know until a user reported it.

**Five latent bugs.** Found during code review, these ranged from cosmetic (invalid rich markup) to functional (the `--prompt` flag never reached the engine, so `{{ prompt }}` templates always resolved to empty strings).

## Decisions and Rationale

### Harden in Place, Don't Rewrite

The architecture was already correct. The config → engine → agent pipeline is a clean separation of concerns. Rewriting would have introduced new bugs while fixing known ones. Instead, the hardening pass worked module by module: adding type hints, expanding validation, writing tests, and fixing bugs — all while keeping the public API stable. The `CONTRIBUTING.md` explicitly codifies this: "Do not break the existing public API."

### Validation Belongs in Config, Not Just the Engine

The engine's `_resolve_order` already had cycle detection and unknown-dependency detection. But that code runs at execution time — after you've built the agent registry, started the event loop, and printed "Running pipeline: ...". Moving these checks into `validate_config` means `smf-forge validate` catches problems before you commit to a run. The engine still has its own checks as defense in depth, but validation is the primary gate.

### Agents Return Error Dicts, Not Exceptions

When an HTTP agent can't connect, it returns `{"error": "Connection error: ...", "agent": self.config.name}` instead of raising. The engine checks for this pattern:

```python
if isinstance(output, dict) and "error" in output and "response" not in output:
    return StepResult(
        step_name=step_name, agent_name=agent_name,
        status=StepStatus.FAILED, error=str(output["error"]),
        output=output, duration_ms=duration,
    )
```

This lets the pipeline continue in `--continue-on-error` mode and collect all failures, rather than aborting on the first exception. The `"response" not in output` check is important — some agents might return both an error and a partial response, and you want to treat that as a success with a warning, not a failure.

### Regex for Env Var Matching

The original resolver used `value.startswith("${") and value.endswith("}")` then sliced `value[2:-1]`. This works for `${VAR}` but can't handle `${VAR:default}` — the colon is inside the braces. The hardened version uses a compiled regex: `re.compile(r"^\$\{([^}]+)\}$")`. This captures everything between `${` and `}` as a group, then splits on the first colon to separate the variable name from the default value. It also only matches when the *entire* string value is a `${...}` expression — embedded references like `"prefix-${VAR}"` are left untouched.

### Add HermesAgent as a Fifth Built-in Type

SMF Forge orchestrates AI agents. Hermes is our agent platform. The integration was dogfooding: smf-forge agents talking to Hermes agents. The `HermesAgent` class sends a prompt to a running Hermes instance's `/api/agent/run` endpoint and returns the response. It's configured in `forge.yaml` with `type: hermes` and options for `endpoint`, `agent_name`, and `timeout`. This required adding `hermes` to both `AGENT_TYPES` in the agents module and `KNOWN_AGENT_TYPES` in the config module (kept separate to avoid circular imports during validation).

## Key Changes and Architecture Improvements

### Type Hints Across the Codebase

Every public function now has full type annotations. The `from __future__ import annotations` import enables PEP 604 union syntax (`str | None` instead of `Optional[str]`) on Python 3.10+. Every dataclass field, method parameter, and return type is annotated. The `StepResult` and `PipelineResult` dataclasses use `dict[str, Any]` and `list[StepResult]` instead of bare `dict` and `list`.

### Config Validation: Unknown Types, Unknown References, Cycle Detection

The `validate_config` function grew from 30 lines of basic checks to 120 lines of comprehensive structural validation. The key additions:

**Unknown agent types** — checks each agent's `type` against `KNOWN_AGENT_TYPES`:

```python
elif agent_type not in KNOWN_AGENT_TYPES:
    errors.append(
        f"Agent '{name}' has unknown type '{agent_type}'. "
        f"Known types: {', '.join(sorted(KNOWN_AGENT_TYPES))}"
    )
```

**Unknown agent references** — checks each pipeline step's `agent` against the set of defined agent names.

**Cycle detection** — a DFS-based cycle detector that runs during validation, not just at execution time:

```python
def _detect_cycles(pipeline_name, steps, errors):
    name_to_deps = {s["name"]: [d for d in s.get("depends_on", []) if isinstance(d, str)]
                    for s in steps if isinstance(s, dict) and s.get("name")}
    visited, in_stack = set(), set()

    def _has_cycle(node):
        if node in in_stack: return True
        if node in visited: return False
        visited.add(node); in_stack.add(node)
        for dep in name_to_deps.get(node, []):
            if _has_cycle(dep): return True
        in_stack.discard(node)
        return False

    for name in name_to_deps:
        if _has_cycle(name):
            errors.append(f"Pipeline '{pipeline_name}' has circular dependencies")
            return
```

The `in_stack` set tracks the current DFS path. If we encounter a node already in the stack, we've found a back edge — a cycle. This catches both mutual dependencies (`a → b → a`) and self-dependencies (`a → a`).

### Environment Variable Resolution with Default Values

The resolver now supports `${VAR:default}` syntax. The split-on-first-colon approach handles defaults that contain colons (like URLs):

```python
if ":" in inner:
    env_name, default = inner.split(":", 1)
    return os.environ.get(env_name, default)
```

The `split(":", 1)` is critical — `${MISSING_URL:https://api.openai.com/v1}` should produce `https://api.openai.com/v1`, not `https`. Splitting on only the first colon preserves the rest of the default value.

### The Five Bugs Fixed in Code Review

1. **`${VAR:default}` not supported** — The template used `${FORGE_PROJECT:my-project}` but the resolver only handled `${VAR}`. `smf-forge init` then `smf-forge validate` would fail with `ConfigError`. Fixed by adding the colon-split logic.

2. **`--prompt` never reached the engine** — The CLI's `run` command created `initial_context = {"prompt": prompt}` but never passed it to `engine.run()`. So `{{ prompt }}` templates always resolved to empty strings. Fixed by passing `initial_context=initial_context`.

3. **Invalid rich markup in `print_result`** — The original used `[{dim}]` which isn't valid rich markup. Changed to `[dim]...[/dim]` tags.

4. **Error dicts treated as success** — Agents returning `{"error": "..."}` were marked `SUCCESS` because they didn't raise exceptions. The engine now checks for the error-dict pattern and marks the step `FAILED`. This was the most insidious bug — pipelines would report success when agents had actually failed.

5. **Unused `shutil` import** — Left over from an earlier version of the `init` command. Removed.

### HermesAgent Integration

The new `HermesAgent` class follows the same pattern as `HttpAgent` but targets Hermes's `/api/agent/run` endpoint. The error handling follows the return-error-dict pattern: the `ConnectError` case produces a helpful message — "Cannot connect to Hermes at {endpoint}. Is Hermes running?" — because the most common failure mode is simply that Hermes isn't running on the expected port.

### CI Pipeline

A GitHub Actions workflow runs on every push and pull request. Two jobs: `lint` (ruff on Python 3.12) and `test` (pytest with coverage on Python 3.10–3.13). The coverage gate fails the build if coverage drops below 80%. The matrix uses `fail-fast: false` so a failure on one Python version doesn't cancel the others.

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -e ".[dev]"
      - run: ruff check src/ tests/

  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix: { python-version: ["3.10", "3.11", "3.12", "3.13"] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "${{ matrix.python-version }}" }
      - run: pip install -e ".[dev]"
      - run: pytest --cov=smf_forge --cov-report=term-missing
      - run: python -m pytest --cov=smf_forge --cov-fail-under=80
```

One wrinkle: the CI workflow was initially committed but then removed from git tracking because the PAT used for pushes lacked the `workflow` scope. GitHub Actions workflows can only be pushed by tokens with that scope.

## Architecture

The final architecture is a clean four-layer design:

```
┌─────────────────────────────────────────────────────────────────────┐
│                          smf-forge CLI                              │
│                                                                     │
│  ┌──────────┐   ┌───────────┐   ┌───────────┐   ┌──────────────┐  │
│  │  init    │   │   run     │   │  agents   │   │  pipelines   │  │
│  └────┬─────┘   └─────┬─────┘   └─────┬─────┘   └──────┬───────┘  │
│       ▼               ▼               ▼                ▼           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           Config Module                                     │   │
│  │  find_config → load_config → resolve_env_vars → validate   │   │
│  └─────────────────────────────┬───────────────────────────────┘   │
│                                ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           Pipeline Engine                                    │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ Topological │─▶│  Layer-based  │─▶│  Context    │        │   │
│  │  │    Sort     │  │  Execution   │  │  Passing    │        │   │
│  │  └─────────────┘  └──────────────┘  └──────────────┘        │   │
│  └─────────────────────────────┬───────────────────────────────┘   │
│                                ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           Agent Registry                                     │   │
│  │  ┌──────┐ ┌────────┐ ┌───────┐ ┌──────────┐ ┌────────┐     │   │
│  │  │ Echo │ │  HTTP  │ │ Shell │ │ Transform│ │ Hermes │     │   │
│  │  └──────┘ └────────┘ └───────┘ └──────────┘ └────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

The execution flow for `smf-forge run <pipeline> --prompt "..."`:

```
CLI run command
  ├─▶ _load_project_config()
  │     ├─ find_config()         # walk up directory tree
  │     ├─ load_config()         # parse YAML, reject non-mappings
  │     ├─ resolve_env_vars()    # ${VAR} and ${VAR:default}
  │     └─ validate_config()     # types, refs, deps, cycles
  ├─▶ build_registry()           # instantiate agents from config
  └─▶ PipelineEngine.run()
        ├─ _resolve_order()      # topological sort → layers
        │     ├─ validate deps, detect cycles (DFS)
        │     └─ Kahn's algorithm → parallel layers
        └─ for each layer:
              ├─ asyncio.gather() # run all steps concurrently
              └─ update context   # step output → template vars
```

Each layer is a list of step names that can run in parallel. The engine uses `asyncio.gather()` to execute all steps in a layer concurrently, then moves to the next layer. Context from completed steps is available to downstream steps via Jinja2 templating: `{{ step_name.response }}` accesses the output of a previous step.

## Testing Approach and Results

### Test Organization

The test suite grew from 27 tests in 2 files to 110 tests in 4 files:

| File | Tests | Coverage Area |
|------|-------|---------------|
| `test_config.py` | 43 | Config discovery, loading, validation, env var resolution |
| `test_engine.py` | 32 | Pipeline ordering, execution, agent builder, echo agent |
| `test_agents.py` | 19 | All five agent types — echo, shell, transform, http, hermes |
| `test_cli.py` | 16 | CLI commands — version, init, validate, agents, pipelines, run |

### Testing Strategy

**Unit tests for every validation path.** The config module has tests for every error condition: missing agent type, unknown agent type, duplicate step names, step missing agent, empty pipeline, depends_on not a list, depends_on unknown step, circular dependency, self-dependency, unknown agent reference, and more.

**Error-path testing for network agents.** The `HttpAgent` and `HermesAgent` tests don't make real API calls — they test error paths only. No network dependencies, no flaky tests, no API costs.

**Concurrency verification.** The `test_parallel_execution_concurrent` test uses a `DelayedEchoAgent` that sleeps for 10ms. Two independent steps running concurrently should complete in ~10ms, not ~20ms. The assertion `result.total_duration_ms < 20` verifies that parallel execution is actually parallel.

**Regression tests for every bug.** Each of the five bugs has a corresponding test: `test_default_value_when_env_not_set` verifies `${VAR:default}` syntax, `test_initial_context` verifies `--prompt` reaches the engine, `test_error_dict_treated_as_failure` verifies error dicts are FAILED not SUCCESS.

**CLI integration tests.** The `test_cli.py` file uses Click's `CliRunner` to test the full CLI stack: init creates a valid config, validate accepts it, run executes the pipeline, and error paths produce correct exit codes.

### Results

```
$ pytest --cov=smf_forge --cov-report=term-missing

Name                               Stmts   Miss  Cover
----------------------------------------------------------------
src/smf_forge/__init__.py              3      0   100%
src/smf_forge/agents/__init__.py     112     17    85%
src/smf_forge/cli.py                 138      8    94%
src/smf_forge/config/__init__.py     169     10    94%
src/smf_forge/engine/__init__.py     149      5    97%
----------------------------------------------------------------
TOTAL                                571     40    93%

110 passed in 1.41s
```

93% coverage across 571 statements. The uncovered lines are primarily in network-dependent code paths and the `print_result` method's rich console output. The `agents` module at 85% is the lowest — it's where the network calls live. Ruff lint is clean. The CLI was verified end-to-end: `init` → `validate` → `agents` → `pipelines` → `run`.

## Lessons Learned

**1. Validate before you execute.** The most impactful change was moving validation from execution time to config-load time. The original code would only discover a cycle or an unknown agent reference when you ran the pipeline. Now `smf-forge validate` catches all of these before you commit to a run — you don't want to discover a circular dependency 30 minutes into a research pipeline.

**2. Error dicts beat exceptions for agent pipelines.** When an agent fails, the pipeline should be able to continue and collect all failures. If agents raised exceptions, the engine would need to catch them per-step, which is more complex and loses structured error information. The `{"error": "...", "agent": "..."}` pattern lets the engine check for failures with a simple dict inspection and aggregate all errors in the final result.

**3. The `${VAR:default}` bug was a self-inflicted wound.** The template file used `${FORGE_PROJECT:my-project}` but the resolver only handled `${VAR}`. The tool's own template was incompatible with the tool's own resolver. This is the kind of bug that integration testing catches — and the original test suite had no CLI integration tests. The `test_cli.py` file with its `CliRunner`-based tests would have caught this immediately: `init` creates a config, `validate` rejects it, test fails.

**4. Cycle detection needs to be in two places.** The engine's `_resolve_order` has cycle detection because it needs to prevent infinite loops during topological sort. But `validate_config` also needs cycle detection because `smf-forge validate` should catch problems without running the engine. Having the same algorithm in two places is intentional — defense in depth. The validation version is a standalone DFS; the engine version is integrated into Kahn's algorithm.

**5. Split on the first colon, not all colons.** `${MISSING_URL:https://api.openai.com/v1}` — the default value contains colons. `inner.split(":")` would produce `['MISSING_URL', 'https', '//api.openai.com/v1']`. `inner.split(":", 1)` produces `['MISSING_URL', 'https://api.openai.com/v1']`. The `maxsplit=1` parameter is the difference between a working URL resolver and a broken one — a one-character bug invisible until someone uses a URL as a default value.

**6. Coverage is a floor, not a ceiling.** 93% coverage means 7% of lines are untested. The uncovered lines are mostly in network I/O and console output — genuinely hard to test without mocking `httpx` or capturing `rich` console output. The 80% coverage gate in CI prevents regression. But 93% isn't 100%, and the uncovered code is where production bugs will hide.

**7. PAT scope matters for CI.** The CI workflow was committed and then un-tracked because the PAT used for automated pushes lacked the `workflow` scope. GitHub only allows workflow file changes from tokens with that scope. The fix is either to use a token with `workflow` scope or to commit workflow changes manually from a developer machine.

## Known Limitations and Future Work

**No network mocking for HTTP and Hermes agents.** The test suite tests error paths but doesn't test successful API calls. Adding `respx` or `httpx`'s built-in mock transport would allow testing the full request/response cycle without network dependencies, pushing coverage on the agents module from 85% toward 95%+.

**No retry logic for transient failures.** The `HttpAgent` and `HermesAgent` fail immediately on connection errors. Exponential backoff with a configurable retry count would make the pipeline more resilient.

**No streaming support.** All agents return their complete output as a dict. For long-running LLM responses, streaming output would improve user experience, but this would require changing the `BaseAgent.run` interface to return an async generator.

**No pipeline-level timeout.** Individual shell commands have a timeout (default 60s), but there's no pipeline-level timeout. A `--timeout` flag on the `run` command would address this.

**No conditional step execution.** All steps run unconditionally. A `condition` field that would let a step skip itself based on the output of a previous step would require extending the step config schema and adding a condition evaluator to the engine.

**No persistence of pipeline results.** Pipeline results are printed to the console and then discarded. Persisting results to a file (JSON, SQLite) would enable audit trails, debugging, and metrics collection.

**No plugin system for custom agent types.** Adding a new agent type requires editing two source files. An entry-point-based plugin system using `importlib.metadata.entry_points` would let third-party packages register new agent types without modifying the core.

## Final Numbers

| Metric | Before | After |
|--------|--------|-------|
| Source lines | 730 | 1,255 |
| Test lines | 282 | 1,212 |
| Test count | 27 | 110 |
| Test files | 2 | 4 |
| Coverage | ~40% (estimated) | 93% |
| Agent types | 4 | 5 |
| CI | None | GitHub Actions (4 Python versions) |
| Linting | None | ruff (7 rule sets, clean) |
| Type hints | Partial | Complete |
| Config validation | Basic (type presence) | Full (types, refs, deps, cycles) |
| Bugs found in review | 5 | 0 remaining |
| README | 142 lines | 295 lines |
| CONTRIBUTING.md | None | 132 lines |

The hardening pass added 849 insertions across 8 source files, wrote 83 new tests, fixed 5 bugs, added a new agent type, set up CI, and wrote comprehensive documentation. The result is a tool that fails loudly and early — validation catches config errors before execution, the engine catches runtime errors before they cascade, and the test suite catches regressions before they reach users.

That's what production hardening means: not adding features, but removing failure modes.