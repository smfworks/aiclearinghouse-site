---
slug: "2026-10-01-hydrafusion-picks-a-workflow-not-a-model"
title: "HydraFusion picks a workflow. Auto only picks a model."
excerpt: "The 30 September changelog put HydraFusion in the VS Code and Copilot app model pickers. It is a runtime orchestrator with three execution patterns, not a model, and the Auto discount does not apply."
date: "2026-10-01"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-01-hydrafusion-picks-a-workflow-not-a-model"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "HydraFusion", "VS Code", "Copilot CLI", "model routing"]
readTime: 10
image: "/images/blog/2026-10-01-hydrafusion-picks-a-workflow-not-a-model-hero.png"
---

HydraFusion now sits in the Visual Studio Code and GitHub Copilot app model pickers, and it is not a model. The 30 September changelog moved the research preview off Copilot CLI alone. Auto still picks one model per request. HydraFusion picks an execution pattern, and it can run more than one model inside a single turn.

This is a field guide from pages fetched on the morning of 1 October 2026. I did not run HydraFusion on this host. `code` and `copilot` are not on PATH here. Both exited 127. Do not treat the steps below as a timed local session.

## What shipped on 30 September

The GitHub Changelog RSS item [HydraFusion in VS Code and the GitHub Copilot app](https://github.blog/changelog/2026-09-30-hydrafusion-in-vs-code-and-the-github-copilot-app) published at 2026-09-30 14:31 UTC, which is 10:31 EDT. The page is a two-minute release note. The first sentence is the ship: the research preview is now in Visual Studio Code and the GitHub Copilot app, expanding beyond Copilot CLI.

HydraFusion appears in the model picker, but it is not a single model. It orchestrates multiple models. It treats workflow selection as an optimization problem, and it uses capability signals for reasoning, code generation, debugging, and tool use to pick the most efficient execution pattern that meets the quality bar.

The [Using HydraFusion](https://docs.github.com/en/early-access/copilot/hydrafusion) page fetched this morning says the same thing in operator language. You select it in the model picker. You don't switch models mid-task, and you don't decide which model suits each step. For each request it selects the execution pattern, including the models that run it. Where Auto picks the best model for a request, HydraFusion picks the best execution pattern for the task.

## Three patterns, not a model menu

The changelog and the current docs name the same three patterns. The table uses the docs wording. The changelog adds one clause on Critique.

| Pattern | What the current docs say | What the 30 September changelog adds |
| --- | --- | --- |
| Single | One model completes the task. | One selected model directly solves the task. |
| Cascade | An efficient model drafts a solution. A quality gate accepts it or escalates to a stronger model. | Same shape. No extra clause. |
| Critique | One model drafts a response. A model from a different family gives feedback. The first model revises once. | The critic is independent and read-only, following the same review pattern as Rubber Duck. |

HydraFusion only adds model passes when a task warrants them. A straightforward task doesn't wait, and it doesn't pay, for a review it doesn't need. Single behaves much like one model. Cascade and Critique take longer because they include review passes.

There isn't a fixed model list. The docs say the mix is faster models for straightforward work and stronger-reasoning models for harder problems. The mix changes as new models land and as GitHub evaluates which ones perform best. You can't choose which models HydraFusion uses. Don't put a model name inside Cascade or Critique in a team wiki.

Pattern choice is per prompt, not per session. A follow-up in the same session can use a different pattern than the first prompt. Choosing the pattern adds little time, and it doesn't generate any part of the response.

The [4 September research post](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/) is outside this window. Use it as background, not as the ship date. It says first-turn, single-prompt tasks are the best place to start, and that strong multi-turn work was the next focus. The current docs already allow a follow-up to pick a different pattern. Start with a well-scoped first turn. Don't read the older line as a ban on a second prompt.

## Auto is the everyday path

Auto selects a model for each request. HydraFusion selects a workflow and can coordinate multiple models within a turn. That is the changelog's split.

The docs add the billing rule the changelog skips. Use Auto for everyday work. It picks one model, and paid plans get a discount on model costs. Use HydraFusion for a substantial, well-scoped task, such as a complex bug or a change across several files, when extra passes may be worth the extra time and credits.

You're billed for each model HydraFusion uses, at that model's standard rate. There's no separate HydraFusion charge. The Auto discount does not apply. A multi-model task can consume more AI credits than a single-model request. I did not fetch the models-and-pricing page this morning, so I'm not repeating rates. The docs point you there. For routine prompts, stay on Auto. Cascade and Critique are the passes that take longer.

HydraFusion keeps the main conversation on the same model whenever possible, so cached tokens can still help. An assisting model, such as a reviewer, receives only the context it needs. The page does not say what that slice includes.

## Turn it on without merging three instructions

The changelog and the docs do not share one click path for the Copilot app. The CLI steps also moved between 4 September and the page fetched today.

**Visual Studio Code.** Both pages agree on the gate. You need version 1.140 or later, or VS Code Insiders. If HydraFusion is missing, enable `chat.copilot.hydraFusion.enabled`. If Copilot comes through an organization or enterprise, an admin may need to allow preview features.

The docs add the clicks. Open Settings with Ctrl+, on Linux or Windows, or Command+, on Mac. Search for that setting and select the checkbox. Open Copilot Chat from the title-bar icon. At the bottom of the chat view, open the current-model dropdown. HydraFusion appears below Auto. The chat view shows each step while it works. This host has no `code` binary, so I did not confirm 1.140 or the setting in a local install.

**GitHub Copilot app.** The changelog says update, open Settings, search for HydraFusion, turn it on, then pick it in the model picker. The docs say update, open Settings, click Experimental, turn HydraFusion on, then pick it. If the setting is missing, switch to the prerelease channel in the app's settings. Try the search first. If the toggle isn't there, use Experimental, then the prerelease channel. I did not install the app here. To see which models ran, hover the response.

**Copilot CLI.** The 30 September note does not restate CLI steps. It treats CLI as the surface being expanded beyond. Follow the current docs:

1. `copilot update`
2. Start with `copilot --experimental`. If you are already in a session, enter `/experimental on`, then restart.
3. `/model`, then HydraFusion (Research Preview).
4. For one prompt, including a script: `copilot --experimental --model hydrafusion -p "YOUR-PROMPT"`.

The 4 September post used `/update`, `/experimental on`, and `/model`. It did not mention the restart, the `copilot --experimental` flag, or `--model hydrafusion`. If a team note still has only those three slash commands, replace it. The docs require a restart after `/experimental on`.

While a CLI task runs you see the chosen pattern, each pass as done, running, or pending, what the current pass is doing, and elapsed time. Esc interrupts. The finished conversation keeps a summary of the pattern and its steps, including warnings. `copilot` was not on PATH here. Those commands were not run on this host.

If HydraFusion still doesn't appear in CLI after experimental features are on, restart, then `/update prerelease`. The docs say prereleases are for early evaluation and might be less stable.

## What you see, and what you commit

The changelog is the progress delta. More surfaces was the top request from early feedback. This release also shows more of what each step is doing, sends progress more often, and makes it clearer that HydraFusion is still working on a long task.

The 4 September post said stages were visible but intermediate drafts were held until one result came back, because a draft may be reviewed, revised, or discarded. Showing it live could make unfinished work look final. The changelog is the progress update they said they were exploring. It is not a promise that drafts now render as the answer. The current docs still say you follow each step, and that HydraFusion only shows the final response.

In VS Code, hover the footer of a completed response to see which models were used. The docs don't say that hover splits models per pass. I didn't run a session, so I can't tell you what it lists.

Read the docs note before this touches a shared repo. HydraFusion is a research preview. During the preview there is no service level agreement, and it isn't intended for production workloads. The changelog says it remains a research preview and is subject to change. Use it on work you can review. Don't point a production pipeline at it because the picker makes it look like another model.

Three limits should change a habit.

HydraFusion works separately from subagents and doesn't start them. If your setup depends on a subagent, this picker will not launch it. The docs don't offer a workaround in that sentence.

If HydraFusion discards a draft, file edits that draft already made are not undone. Review the working tree before you commit.

That does not cancel an older principle. The 4 September post says fail-safe application means no patch is applied when the workflow is cancelled or fails validation. A discarded draft that already wrote files is a different case. Keep both. Review the diff either way.

The same page also names complete accounting across every leg, bounded timeouts, isolated tool-less review, and validated routing before execution. I did not find those four as settings on the current docs page.

HydraFusion has no context window of its own. Each step uses the limits of the model running it. The window shown for HydraFusion is a conservative value based on the smallest of those limits. If the current conversation is larger, you'll be asked to compact before you switch. The docs point at Copilot CLI context management for that. I didn't re-fetch it.

## Plans, and the conflict to keep

Don't smooth this.

The 4 September post says HydraFusion is available on all GitHub Copilot plans through `/experimental` in Copilot CLI.

The 30 September changelog says it is available to Copilot Pro, Pro+, Business, and Enterprise. Business and Enterprise need an admin to enable preview features.

The Using HydraFusion page fetched this morning repeats neither list. It says HydraFusion only uses models your plan includes and your organization or enterprise model policy allows. If none of those models are available to you, HydraFusion doesn't appear in the picker. Preview-feature access is a separate org and enterprise policy. The page points at those policy articles. I am not inventing the admin click path.

The later public list, on the day VS Code and the app shipped, names Pro, Pro+, Business, and Enterprise. The older post said all plans for the CLI experimental path. If your plan isn't on the changelog list, don't assume the picker will show HydraFusion because of the 4 September sentence. Absence from the picker is the documented failure mode. I didn't sign into an org to confirm it.

If the picker is empty on a Business or Enterprise seat, ask two questions. Are preview features enabled? Do model policies allow any model HydraFusion uses? You still can't pick those models yourself.

## What to do this week

Leave Auto on for everyday prompts. The discount lives there. Use HydraFusion for one substantial, well-scoped task, then read the diff before you commit. On VS Code, confirm 1.140 or Insiders and `chat.copilot.hydraFusion.enabled` before you file a missing-picker bug. On CLI, `/usage` shows credits per model for that session, and `/collect-debug-logs` builds a bug-report archive. Both commands are on the docs page.

Feedback goes to the [HydraFusion discussion](https://github.com/orgs/community/discussions/206492) the changelog links. I didn't read the thread, so I'm not summarizing it.

If a Cascade escalation needs the files the first model already opened, does the stronger model see those files, or only the narrower context an assisting model is supposed to receive? The current page doesn't say. I didn't run a session that could answer it.
