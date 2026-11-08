---
slug: "2026-11-08-upgrade-python-then-install-agent-framework-1-25-0"
title: "Upgrade Python to 3.11, then install Agent Framework 1.25.0"
excerpt: "The 1.25.0 notes say to move a Python 3.10 environment to 3.11 first, then raise the MCP catalog cap and give each caller a fresh workflow."
date: "2026-11-08"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-08-upgrade-python-then-install-agent-framework-1-25-0"
categories: ["Microsoft", "AI Agents"]
tags: ["Agent Framework", "Python", "MCP", "Microsoft Foundry"]
readTime: 8
image: "/images/blog/2026-11-08-upgrade-python-then-install-agent-framework-1-25-0-hero.png"
---

If your Agent Framework pin still says 1.24.0, the next Python release is already on the index. Upgrade the interpreter to 3.11 or later, then install 1.25.0. The migration lines on the release page are the upgrade.

By the end you can check the interpreter, raise the tool-catalog cap when the server is large, and give each caller a fresh workflow before you change the pin.

I read the [python-1.25.0 release](https://github.com/microsoft/agent-framework/releases/tag/python-1.25.0) this morning through the GitHub API. `published_at` is `2026-11-07T15:52:42Z`. The [releases atom feed](https://github.com/microsoft/agent-framework/releases.atom) lists the same instant, and it lists that tag above `python-1.24.0`, which updated at `2026-10-30T21:52:13Z`. The API author is eavanvalkenburg. That stamp was 20 hours and 8 minutes before the clock I recorded, `2026-11-08T12:01:13Z`.

The package index agrees. [PyPI's agent-framework JSON](https://pypi.org/pypi/agent-framework/json) lists version `1.25.0`, `requires_python` `>=3.11`, and classifiers for 3.11, 3.12, 3.13, 3.14, and 3.15. The wheel `agent_framework-1.25.0-py3-none-any.whl` uploaded at `2026-11-07T15:42:23.572891Z`.

## Check the interpreter before you install

The language runtime has to be new enough before the package will install. The real name is the Python 3.11 floor on Microsoft Agent Framework `python-1.25.0`.

The breaking change is [pull request 9948](https://github.com/microsoft/agent-framework/pull/9948). The notes say it removes Python 3.10 installation eligibility. The migration sentence says to upgrade Python 3.10 environments to Python 3.11 or later before installing this release. Existing integration-specific Python upper bounds still apply. Foundry Local supports Python 3.11 through 3.14.

On the machine where the agent runs, print the interpreter:

```bash
python --version
```

If that prints 3.10, upgrade the interpreter, then install. After it is 3.11 or newer, pin the version the index listed this morning:

```bash
python -m pip install "agent-framework==1.25.0"
```

The meta-package summary on PyPI says it contains core and a curated set of optional integrations. The same release advances the exact Core pin, and the standard-install dependency cohort, to the versions in this release. Four packages require Core 1.25 for the wrapped-agent ownership link, the MCP discovery-limit parameters, the callable discovery approval policy, or the local shell-result replay marker: `agent-framework-ag-ui`, `agent-framework-declarative`, `agent-framework-foundry-hosting`, and `agent-framework-openai`. Other Core floors stay under the strict API-usage policy.

I was glad the index line and the migration sentence say the same floor. Both require 3.11 or later. The classifiers also list 3.15, which matters in the Foundry Local section below.

## Raise the catalog cap when the server is large

The agent asks the tool server for its list, and that walk now stops at a fixed size. The real name is bounded MCP discovery.

[Pull request 10042](https://github.com/microsoft/agent-framework/pull/10042) bounds MCP tool and prompt discovery to 100 pages and 1,000 items per catalog. Framework-owned request timeouts default to 30 seconds. When a refresh fails, the complete catalog snapshot is preserved.

If your server is larger than that, raise `max_discovery_pages` or `max_discovery_items`. Set either one to `None` only for a trusted MCP server. Pass `request_timeout=None` on an MCP tool when you want unlimited request timing back. A client you created yourself keeps its own transport and timeout policy. `DefaultMCPToolHandler` exposes the discovery limits and requires Core 1.25.

A related fix on the same page, [pull request 10147](https://github.com/microsoft/agent-framework/pull/10147), scopes HTTP headers to each outgoing request. MCP tools, prompts, and Foundry Toolbox resource reads with matching effective headers can overlap, while identity changes stay isolated. Admission and recovery use separate `request_timeout` budgets, rather than one end-to-end deadline. You still order state-dependent operations that share server-side MCP session state.

## Give each caller a fresh workflow

One live workflow should serve one caller. The real name is the authorization-scope guard on workflow agents.

[Pull request 10035](https://github.com/microsoft/agent-framework/pull/10035) binds live workflow agent executors and their sessions to one authorization scope. Cross-scope execution is rejected before any model call. `WorkflowAgent.as_tool()` is rejected in AG-UI endpoints.

Use `AgentFrameworkWorkflow(workflow_factory=...)`. The factory creates new workflows, new `AgentExecutor` instances, and new `AgentSession` instances for each call. The notes say a shared builder still reuses its executors, even with `cache_target=False`. That sentence is the one I would have skipped. `cache_target=False` looks like a fresh build. The notes say the executors are still shared.

Use `single_user=True` only when every caller is the same principal. Cross-scope reuse reports `WORKFLOW_SCOPE_CONFLICT`. Workflow-agent tools report `WORKFLOW_AGENT_TOOL_UNSUPPORTED`. Serve those workflows directly through a factory. The guard covers live executor and session identity. The notes also say it covers "not state loaded from shared storage or custom tool functions that invoke workflows." AG-UI requires Core 1.25 for the wrapped-agent ownership check.

## Point the trace filter at the new span name

Replace the old span-name filter with the new operation name. The real name is the OpenTelemetry GenAI operation name.

[Pull request 9900](https://github.com/microsoft/agent-framework/pull/9900) aligns graph and functional workflow invocation spans with OpenTelemetry GenAI conventions. Replace an exact `workflow.run` span-name filter with `gen_ai.operation.name == "invoke_workflow"`. Replace a `workflow.name` attribute lookup with `gen_ai.workflow.name`. Named spans use `invoke_workflow {workflow_name}`. Unnamed graph workflows use `invoke_workflow` and omit the semantic name attribute. `OtelAttr.WORKFLOW_RUN_SPAN` now contains the base operation name, and the notes say that value is "not every exported span's full name." Runtime and checkpoint workflow identity stay put. Conversation and error attribute names stay put too.

## Build the handler the ordinary way

Each call to the tool list gets its own session. The old cache argument no longer changes that. The real name is the declarative MCP session change, on `agent-framework-declarative`.

[Pull request 8662](https://github.com/microsoft/agent-framework/pull/8662) creates and closes a fresh protocol session for every handler invocation, including `tools/list`, instead of caching initialized sessions. The notes call this a security fix and say it ships in 1.5.0. The legacy `cache_max_size` parameter remains accepted as a deprecated no-op.

Replace the context-manager form:

```python
async with DefaultMCPToolHandler(...) as handler:
    ...
```

with ordinary construction, and drop the close call:

```python
handler = DefaultMCPToolHandler(...)
```

An existing non-`None` `cache_max_size` is accepted without validation, ignored, and emits `DeprecationWarning`. Omit the parameter, or pass `None`, to stop the warning. Manage borrowed HTTP clients on their own. Cancel and await active invocations before you close them. Implicit server-session continuity no longer survives later calls, approval waits, or checkpoint resumes. When you need continuity, use an explicit remote state handle, or an explicitly scoped custom `MCPToolHandler`. Workflow checkpoints and approval verification stay as they were. The notes say no checkpoint migration flag is introduced.

## Pin Foundry Local if you use that package

The on-machine model runtime has its own SDK pin, and that pin stops before Python 3.15. The real name is `foundry-local-sdk`.

[Pull request 9322](https://github.com/microsoft/agent-framework/pull/9322) migrates `agent-framework-foundry-local` to Foundry Local SDK 2.3.1. Install `foundry-local-sdk>=2.3.1,<3` on Python 3.11 through 3.14, on Apple Silicon macOS, Linux x86_64 or aarch64, or Windows x64 or ARM64. [PyPI's foundry-local-sdk JSON](https://pypi.org/pypi/foundry-local-sdk/json) currently lists version `2.3.1`, with `requires_python` `>=3.11,<3.15`. That upper bound matches the notes.

Configure the shared SDK manager before the first client when you need custom settings. `bootstrap=False` requires an initialized manager and a running web service. `prepare_model=False` still loads the selected model on the first request. Remove the unsupported `do_sample` and `early_stopping` options. Close client HTTP resources before you close the shared manager once, at application shutdown. The notes say image support has not been verified, and that audio and embeddings sit outside this SDK migration.

If the meta package is on Python 3.15, keep Foundry Local on 3.11 through 3.14. The same release enables Redis integration, and its standard-install dependency, on Python 3.15, and widens the supported RedisVL range to include 0.31 without raising the existing lower bound ([pull request 10143](https://github.com/microsoft/agent-framework/pull/10143)).

Two smaller lines on the same page are worth a minute before you bump.

If generated code calls host tools, [pull request 9971](https://github.com/microsoft/agent-framework/pull/9971) redacts host-tool exception details before that code resumes. Handle a generic `RuntimeError` unless the channel is trusted and you set the host-side `include_detailed_errors=True`. That option is separate from sensitive-data logging and from outer-client error handling.

If you use the GitHub Copilot package, [pull request 10149](https://github.com/microsoft/agent-framework/pull/10149) narrows a bare `PermissionDecisionApproveForSession()` decision on a URL prompt to one-time approval. It no longer infers a hostname scope. Supply an explicit `domain=` when you want session-scoped URL access. Explicit scopes and structured tool approvals stay as they were.

Print the interpreter version on the machine that will install the package. If it is 3.10, upgrade that environment first. Open the [1.25.0 notes](https://github.com/microsoft/agent-framework/releases/tag/python-1.25.0) and read the Migration paragraph under each breaking change before you change the pin. If two callers share one live workflow, switch that call site to `workflow_factory` in the same change.

If your MCP catalog is already past 1,000 items, which cap are you raising first, pages or items?
