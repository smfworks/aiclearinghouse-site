---
slug: "2026-10-19-close-the-child-before-you-call-it-done"
title: "How to close a child agent's work before you call it done"
excerpt: "A child agent starts blank, and its done sentence is not the record. Write the packet, record the result yourself, and treat a mid-run crash as unknown."
date: "2026-10-19"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Operations", "Multi-agent"]
tags: ["delegation", "ownership", "close-out", "multi-agent"]
readTime: 8
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-19-close-the-child-before-you-call-it-done"
---

A child agent starts blank. Its done sentence is not the record.[1]

The Hermes delegation page says subagents start with a completely fresh conversation.[1]
They have zero knowledge of the parent's conversation history, prior tool calls, or anything discussed before delegation.[1]
The only context is the goal and the context you put on the call.[1]
If the parent has a workspace, the child also gets that workspace's project files. SOUL.md is excluded.[1]

When the child finishes, a process it left running is killed.[1]
The page says the parent hears from the runtime, never from the child's prose, that "the watcher is running" is no longer true.[1]

Write the packet first. You record the result.
If the owner process disappears mid-run, the status is unknown, not finished.[1]

## write the packet before you spawn

The parent has to pass everything the child needs.[1]
The bad example on that page is a goal of "Fix the error." The child has no idea which error.[1]

Put the goal, the paths, the stop, and the fields you will read on the call.[1]

The goal names the file, the failure, and what done looks like.[1]
Their good example names the file, the line, the cause, and the project path.[1]
Leave a path out and the child does not have it.[1]

The stop is a number you pick before launch.
Jeremy Hadfield, Barry Zhang, Kenneth Lien, Florian Scholz, Jeremy Fox, and Daniel Ford wrote the Research piece, published 13 June 2025.[2]
They embedded scaling rules in the prompts, because agents struggle to judge appropriate effort.[2]
Simple fact-finding requires just 1 agent with 3–10 tool calls.[2]
A direct comparison might need 2–4 subagents with 10–15 calls each.[2]
Complex research might use more than 10 subagents, and only with clearly divided responsibilities.[2]
Those numbers are rules they put in a prompt. They are not a measurement of your fleet.[2]

The schema is the fields you will actually read.
Each Hermes task can carry an output_schema.[1]
The child sees it up front. If the answer fails, the parent sends exactly one correction turn.[1]
A miss after that retry does not throw the work away.
The result stays completed, schema_valid is false, and the raw text stays in the summary.[1]
You extract what you need from the raw text, instead of re-running a task that may have taken an hour.[1]

Keep the batch inside the cap. The default is 10.
A larger batch returns a tool error. It is not silently cut.[1]

Leave the spawn depth alone.
delegation.max_spawn_depth defaults to 1. At that default, role="orchestrator" is a no-op.[1]
Their warning: depth 3 and concurrency 3 can reach 27 concurrent leaf agents.[1]
Each extra level multiplies spend.[1]

If two children will edit the same repo, know that worktree isolation is off.[1]
Parallel children share the parent's directory and can collide.[1]
Turn isolation on before that fan-out, or keep the edits on one child.[1]

The model pin is global.
delegate_task has no per-task model parameter, so every child in a batch runs on the configured delegation model.[1]
If one subtask needs a stronger model, leave the pin unset for that session, or hand that task to the kanban board.
The board has a per-task model override. The call does not.[1]

## the summary is not the close

A child cannot write shared memory.[1]
It cannot message anyone.[1]
It cannot schedule more work in the parent's name, and it cannot ask you a question.[1]
A leaf child, the default, cannot spawn another child.[1]

You record the result. The child cannot.[1]

When the child ends, leftover processes are killed unless the child waited, killed them, or handed them off.[1]
Handoff is capped at 3, and only a running process the child owns is accepted.[1]
Anything else is a tool error.[1]
For a watcher, the better pattern on that page is still the child's fact, a PR number or a SHA, and a watcher the parent starts.[1]

If the owner process disappears while the child is still running, Hermes records the delegation as unknown, because it cannot prove whether the external side effects happened.[1]
A restart does not resume the child.[1]
Unknown is not done. Leave the loop open.[1]

A gateway that accepts the completion is not proof the reply went out.[1]
The page says a successful admission is not proof that a model turn or outbound reply completed.[1]
Have the child write the output to a file and pass a reference back.[2]
Anthropic calls the pass-it-up version a game of telephone.[2]
If the file the packet named is missing, you do not have a result yet.[1]

On their Research system, the lead agent waits on each set of subagents.
It can't steer a subagent that is already running.[2]
Write the boundary before you launch.[2]
You will not get a mid-flight correction on that system.[2]

They say you judge whether agents achieved the right outcomes, and also whether they followed a reasonable process.[2]
Read the file. Don't grade the chat and call it done.[2]

On cost, their data says agents typically use about 4× more tokens than chat, and multi-agent systems use about 15× more.[2]
Multi-agent pays when the value of the task covers that spend.[2]
A domain that needs one shared context, or a chain of dependencies, is a poor fit.[2]
Most coding tasks involve fewer truly parallelizable tasks than research, and LLM agents are not yet great at coordinating and delegating to other agents in real time.[2]
If the next step needs this step's output, keep it on one agent.[2]

## don't add one to fill the chart

Bryan Schuldt, writing for Tability on 28 September 2026, splits orchestration into two jobs.[3]
Job one is routing. Given a task, decide which model or tool handles the step.[3]
Job two is accountability. Who owns whether a goal moved, which agents exist and why, and what happens when one of them adds nothing.[3]
He says almost nothing marketed as orchestration does job two.[3]

Before you add the next agent, he gives three questions.[3]

Is there one place you could check to see whether this agent's work moved the goal, without reading a chat log?[3]

If you removed it, would a person have to pick up the supervision slack, or would nothing really change?[3]

Was it recruited because the plan called for it, or because it seemed like the kind of role a team like this is supposed to have?[3]

If you can't answer the first without opening a transcript, you don't have a close-out.[3]
You have a chat.[3]

Their product caps an Agency at six, one manager plus five, while they learn where coordination breaks.[3]
That is their cap. It is not a limit on your fleet.[3]
Use the questions.[3]

Harsh Rao Dhanyamraju, Leonidas Raghav, and Aaron Lee posted a preprint, arXiv:2606.20058v1, dated 18 June 2026.
It is under review.[4]
They evaluated DAG Plan & Execute and ReAct across 208 production-derived scenarios.[4]
Persona is under 10 agents. Department is 20–80. Enterprise is 200.[4]
Both shapes hold with fewer than 10 agents and degrade at enterprise scale, where agent discovery noise is the bottleneck.[4]
Simple tasks degrade more than complex ones. They call that a needle in a haystack.[4]

Read the limits they state before you quote the latency line.
Mock agents execute a single LLM call, so queues are compressed.[4]
Tunable parameters, such as the checkpoint quantum, were held constant.[4]
The evaluation excludes persistent memory, and they call the result a lower bound.[4]
All experiments assume one orchestration worker.[4]
The abstract says the Task Manager reduces high-priority queue latency by 14–75% and improves related-event correctness by over 20 percentage points at enterprise scale.[4]
The conclusion says "+20% correctness."[4]
Those are not the same phrase. Don't collapse them.[4]
And don't treat a one-call mock as your production agent.[4]

Don't add a specialist to make the roster look finished.[4]
Discovery noise is how a simple task gets worse as the registry grows.[4]

## pause the approval, then resume

Same paper, on a human in the loop.
A request for approval is not an ordinary model failure, and the orchestrator should not resolve it quietly.[4]
Pause the affected task. Propagate the request to the right human or workflow owner.
Preserve the state. Resume only after an authorized response.[4]

The specialist encodes the business rules for its domain.[4]
The orchestrator enforces scheduling, context flow, auditability, fallback, and cross-agent coordination.[4]
A specialist does not close a judgment call by continuing.[4]

Apoorva Adimulam, Rajesh Gupta, and Sumit Kumar published an architecture paper on 20 January 2026.[5]
Treat the schema rule as the part to run. Don't treat that paper as a benchmark of your fleet.[5]
Their quality step validates aggregated outputs against defined schemas before integrating them into the shared state, so invalid data does not propagate.[5]
Do that check yourself if your runtime does not.[5]
A child's raw summary does not become the record until it matches the fields you asked for.[1]

They separate two protocols.
MCP governs how agents interact with tools and data.[5]
A2A is how agents talk to each other.[5]
Although peer-oriented, A2A remains supervised by the orchestration layer, which validates and synchronizes the exchanges.[5]
Peer chat is not a handoff of ownership.[5]

## what to do next

Take the open handoff and write the packet before you spawn.
Goal, facts, paths, a stop, and the fields you will read.[1][2]

If the work needs one shared context, or the next step depends on this step, keep it on one agent.[2]
If you are about to add a specialist, answer Schuldt's three questions first.[3]
No place to see the goal move, no change if you removed it, or no plan that asked for it: leave it off the roster.[3]

Spawn. When the child returns, read the runtime fields, not the prose.
orphaned_processes means that process was terminated.[1]
unknown means you cannot prove the side effects.[1]
A gateway accept is not a delivered reply.[1]

You write the result down.
The child cannot write memory, and it cannot message the owner.[1]
If a person has to approve, pause, route, hold the state, and resume only after the answer.[4]
Check the output against the schema before it becomes shared state.[5]

Then stop.
Leave the depth at the default. Keep the batch inside the cap.[1]

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation — Subagent Delegation
[2] https://www.anthropic.com/engineering/multi-agent-research-system — How we built our multi-agent research system
[3] https://tability.io/odt/articles/agent-orchestration — What is agent orchestration?
[4] https://arxiv.org/html/2606.20058v1 — Autonomous Event-Driven Multi-Agent Orchestration for Enterprise AI at Scale
[5] https://arxiv.org/html/2601.13671v1 — The Orchestration of Multi-Agent Systems
