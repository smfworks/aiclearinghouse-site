---
slug: "2026-11-13-confirm-the-interrupt-call-then-set-the-timeout"
title: "Confirm the interrupt call, then set the guest timeout"
excerpt: "Agent Framework Python 1.26.0 will install Hyperlight SDK 0.8.0. Guest code still needs Sandbox.interrupt_handle(), and the default run budget is 30 seconds."
date: "2026-11-13"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-13-confirm-the-interrupt-call-then-set-the-timeout"
categories: ["Microsoft", "AI Agents"]
tags: ["Agent Framework", "Hyperlight", "Python", "GitHub Copilot", "how-to"]
readTime: 8
image: "/images/blog/2026-11-13-confirm-the-interrupt-call-then-set-the-timeout-hero.png"
---

A guest that used to run past half a minute hits a 30-second budget on this upgrade. Confirm the installed SDK has the stop call, then raise that budget on the host. The call's name is `Sandbox.interrupt_handle()`.

By the end you'll read the three Hyperlight floors, confirm that stop call, and set `execution_timeout_seconds` when the work needs longer than 30 seconds.

The notes are the [python-1.26.0 release](https://github.com/microsoft/agent-framework/releases/tag/python-1.26.0), author eavanvalkenburg. The release API lists `created_at` `2026-11-12T16:59:37Z`, `published_at` `2026-11-13T08:28:16Z`, and the same instant for `updated_at`. The page HTML has a `relative-time` at `2026-11-13T08:28:16Z`, and a second one at `2026-11-12 16:59:53 UTC`. Python put published 3.56 hours before the clock, created 19.04 hours before it, and that second stamp 19.03 hours before it. The two HTML stamps are 16 seconds apart. Keep created, verified, and published as three clocks. The fetch clock is `2026-11-13T12:01:53Z`, from `date -u` this run, 7:01 AM Eastern. The target commit is `4f2d146bda4a2068438406f394c65fda7effcff7`. The API lists `draft` false and `prerelease` false.

## Read the three floors

Install the package the README names, with the preview flag it prints:

```bash
pip install agent-framework-hyperlight --pre
```

That line is on the [README at the release commit](https://raw.githubusercontent.com/microsoft/agent-framework/4f2d146bda4a2068438406f394c65fda7effcff7/python/packages/hyperlight/README.md).

[PyPI JSON for agent-framework-hyperlight](https://pypi.org/pypi/agent-framework-hyperlight/json) lists `info.version` `1.0.0b261112`, `requires_python` `>=3.11`, and `yanked` false. The wheel `agent_framework_hyperlight-1.0.0b261112-py3-none-any.whl` is 33,747 bytes, uploaded `2026-11-12T18:26:00.973252Z`. The sdist is 34,736 bytes, uploaded `2026-11-12T18:25:22.174994Z`. Python put those uploads 17.60 hours and 17.61 hours before the same clock. The GitHub release asset with the same wheel name was created `2026-11-13T08:27:02Z`, 3.58 hours before the clock, and the asset record also prints size 33,747. Same filename, two upload clocks.

The dependency lines on that PyPI JSON are:

```text
agent-framework-core<2,>=1.19.0
hyperlight-sandbox<0.10,>=0.8.0
hyperlight-sandbox-backend-wasm<0.10,>=0.8.0
hyperlight-sandbox-python-guest<0.10,>=0.8.0
```

The Wasm backend line carries a platform marker: Linux `x86_64`, or Windows `AMD64`. After you install, read the versions pip resolved for those three Hyperlight packages. A resolved 0.8 line means the installer accepted the restored floor. It still leaves the stop-call check in front of you.

[Pull 10313](https://github.com/microsoft/agent-framework/pull/10313) is the floor change. It merged `2026-11-12T17:03:26Z`, 229 seconds after `created_at`, 18.97 hours before the clock. The patch moves `hyperlight-sandbox`, `hyperlight-sandbox-backend-wasm`, and `hyperlight-sandbox-python-guest` from `>=0.9.0,<0.10` to `>=0.8.0,<0.10`. The upper bound stays `<0.10`. The pull body says installation can resolve 0.8 or 0.9 packages, and that this pull does not change runtime behavior. That sentence belongs to the floor restore. The 30-second budget is a different note.

The release lists the floor restore under Fixed, pointing at 10313. It lists the budget under Changed, marked BREAKING, pointing at pull 10152. Read them as two rows.

If you install the meta package instead, [PyPI JSON for agent-framework](https://pypi.org/pypi/agent-framework/json) lists version `1.26.0`, `requires_python` `>=3.11`, not yanked, and one requirement: `agent-framework-core[all]==1.26.0`. The wheel is 6,681 bytes, uploaded `2026-11-12T18:25:37.182888Z`, 17.60 hours before the clock. The GitHub asset with that same name was created `2026-11-13T08:26:29Z` and also prints size 6,681.

[PyPI JSON for agent-framework-core](https://pypi.org/pypi/agent-framework-core/json) 1.26.0 puts Hyperlight on the `all` extra only when the marker matches Linux `x86_64` or Windows `AMD64`:

```text
agent-framework-hyperlight<2,>=1.0.0b261112
```

On another machine, that extra will not pull this package. Use the README install line. The README also says the Wasm backend is installed for Python 3.11 through 3.15 on Linux x86_64 and Windows AMD64, and that a missing backend makes `execute_code` fail when it tries to create the sandbox. Check the platform before you blame the timeout.

## Confirm the stop call

The release migration says guest execution requires an SDK that provides `Sandbox.interrupt_handle()`, documented for Hyperlight SDK 0.9.0 or later. Installation permits SDK 0.8.0. The same sentence says the package does not add a fallback for older SDKs.

The README at the release commit says the same thing in the Execution limits section: guest execution uses that cross-thread API, documented for SDK 0.9.0 or later, and installation permits SDK 0.8.0 while guest execution still requires an SDK that provides the API.

So the check is small. If pip resolved 0.8 for `hyperlight-sandbox`, open that installed SDK and look for `Sandbox.interrupt_handle()` before you run a guest. The notes say the API is documented for 0.9.0 or later. A successful install of 0.8.0 is the floor restore. The stop call is the guest requirement.

## Set the budget on the host

The README says guest execution has a finite 30-second budget by default. Both `HyperlightCodeActProvider` and `HyperlightExecuteCodeTool` accept the host-side option `execution_timeout_seconds`. The value must be a positive finite number. The option is stored on the provider run snapshot. The model cannot pass it as an `execute_code` argument.

The Execution limits section does not print a sample number. Pick your own, larger than 30, positive and finite. This constructor adds that option to the provider the README quick start already builds:

```python
from agent_framework_hyperlight import HyperlightCodeActProvider

codeact = HyperlightCodeActProvider(
    tools=[compute],
    execution_timeout_seconds=120,
)
```

`120` is a stand-in so you can see the keyword. Replace it with the budget your guest actually needs. The README quick start also passes `approval_mode="never_require"`. That string is the sample on the page. The keyword this upgrade asks you to set is `execution_timeout_seconds`.

When the budget is reached, the README says the result is error content with the string `Code execution exceeded its time limit.` The release notes say a timeout returns error content, and that caller cancellation propagates `asyncio.CancelledError`. The README adds the wait: cancellation waits for native execution and its interruption thread to finish, even if the caller cancels again. Queued cancellation does not interrupt another invocation. The next invocation restores the warm snapshot before it reuses the sandbox.

The budget starts on the sandbox's owning worker, not while you are waiting for that worker. Initialization and warm-up share the invocation's budget. Runtime initialization and host tool callbacks cannot be interrupted. The release notes say those two must enforce their own limits. If a host tool can hang, put the limit inside that function. The guest timeout will not cut it.

Leave the default at 30 seconds when the guest work finishes inside that window. Raise it only for work that needs longer, and only after the stop call is present. The stop call is what ends the guest.

## Check a custom Copilot CLI on the same upgrade

The same notes mark a second breaking change, on `agent-framework-github-copilot`. Startup fails when the GitHub Copilot CLI is older than 1.0.85, or when the version cannot be determined. The migration names three custom paths: `cli_path`, `GITHUB_COPILOT_CLI_PATH`, and `COPILOT_CLI_PATH`. Upgrade the CLI on those paths to 1.0.85 or later. The notes say a default SDK install already meets the minimum, because the existing SDK floor, 1.0.16, bundles CLI 1.0.90. This integration releases as 2.2.0.

[PyPI JSON for agent-framework-github-copilot](https://pypi.org/pypi/agent-framework-github-copilot/json) lists version `2.2.0`, `requires_python` `>=3.11`, not yanked. The requirements are `agent-framework-core<2,>=1.26.0` and `github-copilot-sdk<2.0,>=1.0.16`. The wheel uploaded `2026-11-12T18:25:58.095213Z`, 17.60 hours before the clock. Core's `all` extra pins `agent-framework-github-copilot<3,>=2.2.0` with no platform marker, so a meta install pulls this package on machines where it skips Hyperlight.

If you set one of those three paths, read the CLI version on that path before the first run. If you use the SDK default, the notes say 1.0.16 already bundles 1.0.90.

Try the Hyperlight check today if that package is in your environment. Install from the README line, read the three resolved versions, look for `Sandbox.interrupt_handle()`, and set `execution_timeout_seconds` only when the guest needs more than 30 seconds. The error string to watch for is `Code execution exceeded its time limit.`
