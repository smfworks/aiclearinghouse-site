---
slug: "2026-10-02-dynamic-workflows-define-the-process"
title: "A dynamic workflow defines the process. /fleet does not."
excerpt: "The 1 October changelog put dynamic workflows in Copilot CLI, the Copilot app, and the SDK. The process lives in code. Autopilot and /fleet still let Copilot decide the split, and a scripted run will not ask for permission."
date: "2026-10-02"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-02-dynamic-workflows-define-the-process"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "Copilot CLI", "dynamic workflows", "agents"]
readTime: 11
image: "/images/blog/2026-10-02-dynamic-workflows-define-the-process-hero.png"
---

A dynamic workflow is a program you can rerun. `/fleet` is a prompt that asks Copilot to split the work. That difference shipped in public preview on 1 October 2026, in Copilot CLI, the GitHub Copilot app, and the GitHub Copilot SDK, on every Copilot plan.

I fetched the changelog and both docs pages on the morning of 2 October 2026. I did not run a workflow. `command -v copilot` printed no path and exited 1. The commands below are the docs, not a timed session on this host.

## What shipped at 12:30 EDT

The GitHub Changelog RSS item [Dynamic workflows in Copilot CLI and the Copilot app](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app) has `pubDate` `Thu, 01 Oct 2026 16:30:10 +0000`. `TZ=America/New_York date -d` converts that to 2026-10-01 12:30 EDT. The page byline is October 1, 2026. It calls itself a two-minute read.

Dynamic workflows let you define an orchestration in code. A dynamic workflow is a program that defines how a task is carried out. It combines automated steps with one or more agents. Steps can run one after another, in parallel, or both. The steps, when to involve agents, and how to use their results are defined in code. Agents handle analysis or judgment. The program lives inside a GitHub Copilot extension, so it can use Copilot's extensibility APIs.

The changelog's incident example collects logs and telemetry, assigns independent agents to different systems, and combines structured findings into a timeline and a root-cause report. It says the same steps run every time. The [concept page](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows) adds the other half. Reusing a workflow means reusing its steps and rules. The path can change with the inputs or the findings. Agents can give different answers on different runs. "Same steps" is not "same prose." If you need a stable report shape, ask agents for a specified format. Copilot can ask an agent to correct the format if needed.

A workflow can run commands, tools, or other services, pass structured results forward, and have subagents verify each other's findings. It can ask for input if the client supports it, and it can pause so you can review and resume.

Use one when you want a reusable process, or when a task needs stages, checks, or limits. The changelog names release checks with a review pause, parallel file review, a two-model agreement check, a codebase sweep, and a long run you may pause. A normal prompt is usually enough for a quick answer.

They are available on all Copilot plans, in public preview, and subject to change. The Copilot app needs no setup. The latest CLI needs experimental features, via `--experimental` or `/experimental on`. Update the CLI with `/update`. Feedback in the CLI is `/feedback`.

## Who decides the split

If you already use autopilot and `/fleet`, a dynamic workflow can look like the same thing. It is not. Autopilot lets Copilot keep working without pausing for your input after each step. `/fleet` encourages Copilot to delegate to subagents and coordinate them in parallel. Copilot decides the breakdown each time. A dynamic workflow carries out a process the author defined: steps, conditions, and handoffs. One agent or many. Sequence, parallel, or both.

| Aspect | Autopilot | /fleet | Dynamic workflow |
| --- | --- | --- | --- |
| Main purpose | Let Copilot keep working autonomously | Encourage Copilot to delegate work to subagents | Carry out a process defined in code |
| Who defines the process? | Copilot decides the next steps | Copilot decides how to divide and coordinate the work | The workflow author defines the steps, conditions, and handoffs |
| How work runs | Depends on the task and Copilot's decisions | Independent work can be delegated in parallel | Sequentially, in parallel, or both, using one agent or many |

HydraFusion, covered yesterday, is a different control. It sits in the model picker and selects an execution pattern. Computer use, the other 1 October preview, is desktop GUI control. Neither is this feature.

## It will not start unless you ask

Your chat agent only creates or runs a dynamic workflow when you explicitly ask, or when a skill or slash command instructs it to. A long session does not grow one on its own.

A prompt start runs in the background. Copilot reports back when it finishes. You can keep working. Name the workflow and pass inputs. The docs example is "Run the java-security-review dynamic workflow on the java files in the current directory."

`copilot workflow run WORKFLOW-NAME` is the other door. It does not open a chat, and it does not ask an agent to start the run. The workflow can still use agents. The command waits until the run finishes or stops. Use it to repeat inputs, save a result, or call it from a script. Don't call both paths "background."

You can also start one from an extension slash command, a custom tool, a programmatic hook, or other code that uses the GitHub Copilot SDK. In the app, an extension can put start controls on a canvas. I did not fetch the SDK method list, so I am not inventing calls. Ask what dynamic workflows are available if you want to see what is already loaded.

## A scripted run will not ask

Subagents inherit the permission grants of the session that started them. If a subagent needs something that is not already allowed, the request shows up as a normal prompt in the interactive CLI session. The subagent waits. A grant for the session applies to every subagent that needs the same permission. Depending on your settings, Copilot also asks you to approve the workflow run itself before it starts.

`copilot workflow run` does not display those prompts, even in a terminal. Grant permissions first. The [how-to](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows) names `--allow-tool` and `--allow-url`. Requests that cannot be approved automatically are denied. I did not fetch the programmatic reference, so those are the two flags I will name.

```
copilot workflow run java-security-checks \
  --args '{"directories":["java/src","java/tests"]}' \
  --allow-tool=read
```

`--args` is JSON, or `@workflow-input.json`. Omit it if the workflow needs no inputs. The workflow must already be a personal extension, a project extension, or an installed plugin. A chat-authored workflow is session-scoped until you copy it.

An extension can also run its own code outside these prompts. The approval dialog is not the whole story if you load someone else's extension.

For a script, set auth before the command. The how-to names `COPILOT_GITHUB_TOKEN`. I did not fetch the command reference, so I am not listing other variables. If the working directory is not already trusted, `GITHUB_COPILOT_PROMPT_MODE_EXTENSIONS=true` loads a project extension and allows repository extension code to run. Use it only for code you trust. You still grant tool permissions.

`--silent` hides progress. `--output-format json` returns the workflow name, run ID, status, and any result. The how-to also shows `--allow-tool` placed on `copilot` itself, before `workflow run`. `--result-file` writes only the returned value, and only after a successful completion that returns a result. A paused, failed, or interrupted run leaves an existing file unchanged. Relative paths resolve from the directory where you started the command. Ctrl+C interrupts a foreground run. A pause or a stop reports status and run ID. Configured limits still apply.

## Three limits stop the run. One only waits.

| Limit | What it bounds | If you hit it |
| --- | --- | --- |
| Concurrent workflow-owned agents | How many can be active at once | Extra subagents wait. The run does not stop. |
| Total workflow-owned agents | How many can be launched over the run | The run can stop. Status and saved results are kept. |
| Active running time | Time before a pause counts. Paused time does not. | The run can stop. Status and saved results are kept. |
| AI credits | Approximate max for the workflow's agents and their subagents | New work stops at the tracked total. In-flight work can pass it. |

The credit cap is an approximate maximum, not a hard ceiling. Usage is reported after it occurs, so work already underway can take the total past the limit. A cap of 500 is a planning number.

Prompt beats workflow code. Workflow code beats personal defaults, when the prompt did not set that type. Personal defaults apply only when neither of the others set that type. The CLI keys are `workflows.defaultLimits.maxConcurrentSubagents`, `workflows.defaultLimits.maxTotalSubagents`, `workflows.defaultLimits.timeoutSeconds`, and `workflows.defaultLimits.maxAiCredits`. The docs example is `/settings workflows.defaultLimits.timeoutSeconds 3600`. A prompt can say "with an AI credit limit of 500" or "with a timeout of 1 hour." Limits are optional. The how-to recommends them, because a workflow that launches many subagents can spend a lot of credits.

When you resume a run that stopped at a limit, the new number is a total for the run, including usage before it stopped. It is not a fresh allowance. Canceled runs cannot be resumed. A paused run, or a limit-stopped run listed as resumable, can reuse saved results. Unsaved work may run again.

"Update the check-python-style dynamic workflow to use no more than 10 subagents in total" revises the saved definition. It does not replace saved results in a paused run. People who share the project copy have to pull and reload extensions before they see the revision.

## Copy it out of the session, then watch the run

By default the extension is for the current session. Ask for a personal or project extension if you want it elsewhere, or write it yourself. If you omit a name, Copilot chooses one. You will be asked to allow authoring. Copilot may ask for other approvals while it registers the workflow. Creating and registering does not start a run. Ask what is available, then run it on a small scope.

The how-to's example path is not a path on this machine:

`/Users/yourname/.copilot/session-state/d58ba0bf-78fa-4172-b277-c18ba400e7c6/extensions/java-security-checks/extension.mjs`

Copy the directory that contains `extension.mjs` into `~/.copilot/extensions/` for later sessions, or into `.github/extensions/` to share it in a repository. You can ask Copilot to make that copy. After a merge, teammates need an updated clone and a loaded extension. That copy is the definition, not the run history. A plugin can carry the same workflow to CLI and the app. I did not fetch the plugin pages, so I am not adding install steps.

Test on two or three files first. Read the credit number in the run details, then set the cap for the large run.

In CLI, `/workflows` lists running and recently completed runs. Arrow keys move the selection. Enter opens details: active time, current phase, active subagents, total spawned, and credits used. P pauses. X cancels. R resumes. If you are resuming past a limit, confirm the new total when prompted.

In the Copilot app, monitoring is only for local sessions. A Workflows button sits above the prompt box and lists active runs, runs ready to resume, and recently finished runs. Cancel, Pause, and Resume with limit… are in that panel.

If OpenTelemetry is enabled, each run or resume creates an `invoke_workflow` span, and the agents' activity is linked to it. I did not fetch the exporter settings.

You can schedule a run in the current CLI session with `/every` or `/after`, the same way you schedule any other prompt. The how-to's line is:

`/every 1d run the changed-files-report dynamic workflow on the 'main' branch, limiting it to 200 AI credits`

I did not fetch the scheduling page, so that line is the syntax I will repeat. A daily job that stops at 200 still has to raise the total on resume. The docs do not describe a fresh daily allowance.

I did not run Copilot, and I did not measure credits. `command -v code` also exited 1. The changelog feed fetched this morning has no item later than 19:57 UTC on 1 October. Computer use and HydraFusion already have posts. The Foundry feed's newest item is still the 29 September extraction post. The pages name CLI, the app, and the SDK. They do not print a platform list, so I am not inventing one.

If a scheduled workflow stops at the credit limit, the next resume has to set a higher total that includes credits already spent. Is that the control you want on a daily job, or do you need a fresh allowance the current docs do not give you?
