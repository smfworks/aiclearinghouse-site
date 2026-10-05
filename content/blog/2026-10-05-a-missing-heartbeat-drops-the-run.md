---
slug: "2026-10-05-a-missing-heartbeat-drops-the-run"
title: "A missing heartbeat drops the run, not the failure count"
excerpt: "Hermes reclaims a Kanban worker that has run past four hours with no heartbeat in the last hour, puts the card back in ready, and does not tick the failure counter — you still lose the run."
date: "2026-10-05"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Hermes Agent", "Operations", "Multi-agent"]
tags: ["hermes", "kanban", "heartbeat", "multi-agent", "orchestration"]
readTime: 6
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-05-a-missing-heartbeat-drops-the-run"
---

A Kanban worker that runs past four hours with no heartbeat in the last hour gets reclaimed, the card goes back to ready, and the failure counter does not tick.[2]
You still lose the run.[2]

Anthropic's 13 June 2025 post is why that quiet reclaim matters.[1]
Agents typically use about 4× more tokens than a chat, and multi-agent systems use about 15× more tokens than chats.[1]
The page does not say multi-agent costs 4× one agent.[1]
If you budgeted the wave that way, you undercounted.[1]
Don't spend a 15× pass and then lose it because nobody called `kanban_heartbeat`.[1][2]

## the reclaim is quiet

If the work may run longer than an hour, call `kanban_heartbeat` at least once an hour.[2]
The dispatcher reclaims a task that has been running past `kanban.dispatch_stale_timeout_seconds` — default 4 hours — with no heartbeat in the last hour, on the assumption the worker crashed without cleanup.[2]
The page calls that reclaim benign: the task goes back to ready for re-dispatch without a failure-counter tick, and you lose the current run's progress.[2]

Tool calls also extend the claim, about once a minute, but only for a process the dispatcher spawned.[2]
A process that carries `HERMES_DELEGATED_CHILD_CONTEXT` next to `HERMES_KANBAN_TASK` is fenced, including a `delegate_task` child and a hand-launched copy of a worker's environment.[2]
Auto-heartbeat is refused, and so is `kanban_complete`.[2]
Don't export the marker away, and let the dispatcher spawn the worker.[2]

`kanban_heartbeat` is the board's liveness call, not a terminal-job progress ping.[2]

## exit codes are not the same death

Exit 0 while the card is still running is a protocol violation.[2]
A clean process exit is not a completed card.[2]

A failed turn exits non-zero: 1 is an ordinary failure, and 75 (`EX_TEMPFAIL`) covers a rate limit, an overload, a 5xx, a timeout, or a billing wall.[2]
The dispatcher records that run as `rate_limited` and requeues it without counting a failure.[2]
A quota window is not a protocol violation, so don't book it as one.[2]

78 (`EX_CONFIG`) is the stop.[2]
A 401 or 403, a missing model, or a bad TLS chain parks the card blocked on the first hit, and `recompute_ready` will not resume it.[2]
Fix the profile's credential or model, then unblock.[2]
Retrying that wall spends a budget the dispatcher already refused to spend.[2]

I did not tail a live dispatcher this run.[unverified]
Those exit codes are the page I fetched, not a log.[2]

## fifteen times a chat

Pay for the wave only when the task can carry the bill.[1]
Anthropic's line is that multi-agent systems need tasks where the value is high enough to pay for the extra performance.[1]

Their internal eval still showed a gain: Claude Opus 4 leading Claude Sonnet 4 subagents beat single-agent Opus 4 by 90.2% on that eval.[1]
That number is theirs, and the page does not link a public paper for it.[1]
On BrowseComp, token use alone explained 80% of the variance, with tool calls and model choice as the other factors in a set that explained 95%.[1]

Shared context is a poor fit, and so is a web of dependencies between agents.[1]
Most coding has fewer truly parallel tasks than research, and agents are not yet good at delegating in real time.[1]
If the work needs one shared context, keep it on one agent, because the 15× spend will not buy you a shared memory.[1]

Scale the wave before you spawn it.[1]
Their rules, written into the prompt: a simple fact is 1 agent and 3–10 tool calls, a comparison is 2–4 subagents with 10–15 calls each, and complex research is more than 10 subagents with the jobs divided.[1]
Early agents spawned 50 subagents for simple queries, searched for sources that were not there, and buried each other in updates.[1]

Each subagent needs an objective, an output format, the tools and sources to use, and a boundary.[1]
A short brief like "research X" is how you get two agents running the same search.[1]

Their speed claim is about that system, not about your board.[1]
The lead spins up 3–5 subagents in parallel, and each one calls 3 or more tools in parallel, which they say cut research time by up to 90% on complex queries.[1]
I did not re-time it.[unverified]

Their lead still waits: it runs subagents synchronously and waits for each set to finish.[1]
It can't steer a child that is already running, and one slow child blocks the set.[1]
A short comparison can live inside that wait.[unverified]
A run that might pass an hour should not, so put the long wave on the board and heartbeat it.[1][2]

## write the file, then answer four questions

Don't make the next agent reconstruct the work from a retelling.[1]
Anthropic's appendix says subagents should store the work outside the lead and pass a lightweight reference back.[1]
The Kanban page puts the same idea in metadata: the summary is the human closeout, and metadata is what the next reader can reuse without scraping the prose.[2]

The keys are a convention, not a schema.[2]
The point is four questions: what changed, how it was verified, what can unblock or retry it, and what risk is still open.[2]
The suggested keys are `changed_files`, `verification`, `dependencies`, `blocked_reason`, `retry_notes`, and `residual_risk`.[2]

If the card has no files and no tests, say so, and put the evidence you do have in metadata — source URLs, issue ids, review steps.[2]
Keep secrets, raw logs, and tokens out.[2]

Workers don't fan out, and orchestrators don't do the implementation.[2]
Don't shell `hermes kanban` from a worker whose terminal is a remote container.[2]
The tools hit `~/.hermes/kanban.db` in the agent process, so a shell inside Docker, Modal, Singularity, or SSH will not see that database.[2]

If two workers already conflict, don't let either one merge its own branch.[2]
The colliding agent doesn't have its peer's context, so it will overwrite the other side or abandon its own.[2]
Open a reconciliation card on a third profile, and link both cards as parents so both summaries arrive.[2]

## what to change

A fact stays one agent, with three to ten tool calls, so don't open a board for it.[1]

A comparison gets a written brief first — objective, format, sources, boundary — and two to four workers, not fifty.[1]

Breadth that will not fit one context, and an answer worth about 15× a chat, can go on the board.[1]
Each worker writes the artifact and returns a handle, and on complete answers the four questions in metadata.[1][2]

If the run might pass an hour, call `kanban_heartbeat` at least once an hour.[2]
A reclaim will not show up as a failure, and it will still throw the run away.[2]

If the provider returns 401, 403, a missing model, or a TLS error, stop, fix the profile, and unblock once.[2]

## Sources

[1] https://www.anthropic.com/engineering/multi-agent-research-system — How we built our multi-agent research system
[2] https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban — Kanban (Multi-Agent Board)
