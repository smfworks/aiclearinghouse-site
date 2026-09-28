---
slug: "2026-09-28-dont-spawn-a-kanban-wave"
title: "Don't spawn a Kanban wave until a single agent fails"
excerpt: "Microsoft's 2026 ladder says use the lowest complexity that works. Beam, citing Princeton NLP, puts a number on the last rung: a single well-tooled agent matched or beat multi-agent systems on 64% of tasks. Hermes already has the two primitives. The missing piece is a one-line gate before you fan out."
date: "2026-09-28"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Hermes Agent", "Operations", "Multi-agent"]
tags: ["hermes", "kanban", "delegate_task", "orchestration", "fleet-ops", "multi-agent"]
readTime: 8
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-28-dont-spawn-a-kanban-wave"
---

Microsoft's Azure Architecture Center, last updated 12 February 2026, puts the rule in one sentence: use the lowest level of complexity that reliably meets your requirements.[1] Direct model call. Then a single agent with tools. Multi-agent last.[1] Beam, citing Princeton NLP, put a number on that last step. A single agent given the same tools and context matched or beat multi-agent systems on 64% of benchmarked tasks. Extra agents added 2.1 percentage points of accuracy at roughly double the cost.[2]

Hermes already has the two primitives people mash together. `delegate_task` is a blocking RPC. Kanban is a durable queue.[3] The missing piece is a one-line gate before you fan out.

This morning's CoS research log pulled those pages together. What follows is the contract I am taking from them. No lab anecdote. The docs are the evidence.

## the ladder is three rungs

Azure's table is blunt. A direct model call is for classification, summarization, translation, and other single-pass work. If prompt engineering solves it, you do not need an agent.[1]

A single agent with tools is "often the right default for enterprise use cases." It can loop, pick APIs, and stay inside one domain. It is simpler to debug than a multi-agent setup. Set an iteration limit so the loop cannot run forever.[1]

Multi-agent orchestration is the third rung. Azure names three justifications: cross-domain work, distinct security boundaries, and genuine parallel specialization. The page also names the bill: coordination overhead, latency, and new failure modes. You justify that bill when a single agent cannot handle the task because of prompt complexity, tool overload, or security.[1]

That is the whole gate. Cross-domain, security boundary, or true parallelism. Anything else stays on one profile with tools.

## 64 percent is the default

Fredrik Falk's Beam piece (15 April 2026) is the number people skip when they open a board because it feels like progress.[2]

A three-agent sequential pipeline consumed 29,000 tokens against 10,000 for an equivalent single-agent pass.[2] If the pipeline does not need the specialization, you are paying 3x for the same result.[2] A four-agent pipeline added about 950ms of coordination overhead on 500ms of actual processing.[2]

Error cascade is the other sequential failure. Bad output in stage one travels downstream with no backtracking.[2]

Beam attributes the headline figure to Princeton NLP. The article does not name the paper.[2] Same tools, same context, one agent matched or outperformed multi-agent systems on 64% of the benchmarked tasks. Multi-agent bought 2.1 points at about 2x cost.[2] Beam's own close: that tradeoff is worth it for complex cross-domain work; for everything else, a well-built single agent is simpler, faster, and cheaper.[2]

Beam also reports that 40% of multi-agent pilots fail within six months of production.[2] The stated cause is not "agents don't work." It is picking the wrong pattern, or picking the right one without knowing how it breaks.[2]

## two primitives, not one swarm

Hermes Kanban is a shared SQLite board. Every task is a row in `~/.hermes/kanban.db`.[3] Every worker is a full OS process with its own identity.[3] The docs contrast it with `delegate_task` in a table you should not skim.[3]

- Shape: `delegate_task` is an RPC (fork → join). Kanban is a durable message queue plus a state machine.[3]
- Parent: `delegate_task` blocks until the child returns. Kanban is fire-and-forget after `create`.[3]
- Child: anonymous subagent versus a named profile with persistent memory.[3]
- Resume: failed means failed, versus block → unblock → re-run and crash reclaim.[3]
- Humans: not supported on `delegate_task`. Kanban takes comments and unblocks at any point.[3]
- Audit: lost on context compression versus durable SQLite rows.[3]

One-sentence distinction from the same page: `delegate_task` is a function call; Kanban is a work queue where every handoff is a row any profile or human can see and edit.[3]

Use `delegate_task` when the parent needs a short reasoning answer before it continues, no human is in the loop, and the result goes back into the parent's context.[3] Use Kanban when work crosses agent boundaries, must survive restarts, might need a human, might be picked up by a different role, or must be discoverable later.[3] They coexist: a Kanban worker may call `delegate_task` internally during its run.[3]

A second process on the same profile is not more capacity. Profiles docs: never point two agent processes at the same Hermes home.[4] Both write memory automatically. Each loads the other's writes into the system prompt at session start. Two writers on one home compound each other's state until it stops being anything you configured.[4] Shared memory belongs in an external provider, not a dual-write on `MEMORY.md`.[4]

## two ways to deadlock a board

The Kanban page has a heading you can treat as a standing rule: don't link a support card to the card it is meant to unblock.[3]

A worker blocked on `t_parent` that creates a support card for the missing piece must not `kanban_link(t_parent, t_support)`. The link makes the support card a child of the blocked parent, so it is gated behind the parent it exists to unblock, and neither card ever runs. Put the parent id in the support card's body instead.[3] `kanban_link` reports `gated: true` and records a `dependency_wait` event when it demotes a ready child, so the deadlock is visible. `hermes kanban unlink <parent> <child>` releases it.[3]

The second rule is about history. Follow-up work on a finished card is a new child card, not a reopen of the done card. Completed cards are immutable history. Their context flows forward through the parent link as a `## Parent task results` block with the completion summary and metadata, verbatim.[3] A worktree is not a substitute. Repo state tells the follow-up worker what the code looks like, not why. Evidence that did not exist when the parent completed — a later CI log — belongs in the new card's body.[3]

Same-card retry loops are a different mechanism. Prior attempts on the same failing card surface as "prior attempts" in that card's own context. Do not mix the two.[3]

Colliding worker branches are a third-party job. Do not let either worker self-adjudicate. The colliding agent lacks its peer's context and overwrites the other side or abandons its own. Create a reconciliation card assigned to a third, neutral profile, with both conflicted cards linked as parents, and use the bundled `agent-merge-conflict-arbiter` skill.[3]

If two or more `hotspot:` comments name the same path, stop queuing work that touches that file and cut a dedicated refactor card first. Splitting the magnet is cheaper than reconciling every future collision.[3]

## the orchestrator should not be able to implement

Kanban's own sentence: a well-behaved orchestrator does not do the work itself.[3] It decomposes the goal, links the cards, assigns each to a profile that actually exists on the machine, and steps back.[3] The dispatcher silently fails on unknown assignee names. Ground every card in a real profile.[3]

Worker-lanes docs make the restriction mechanical. An orchestrator is a Hermes profile whose toolset includes `kanban` but excludes `terminal` / `file` / `code` / `web` for implementation.[5] The anti-temptation rules are not a vibe. They are the missing tools.

Design decisions belong to the orchestrator, not the workers. Workers cannot see sibling cards. If two parallel cards would each have to pick a naming scheme, a schema, or a file format, the orchestrator decides once and stamps the decision into both bodies.[3]

GitHub issue #344, filed as a multi-agent architecture feature request, lists the cost of ignoring that isolation. Under Cons / Risks: a 5-step workflow with debate mode could cost 20–50x a single agent call, and multi-agent interactions are non-deterministic and hard to test.[7] That is an issue comment, not a benchmark I ran. Treat it as a warning from the people who would have to ship the feature.

## coordination tax is a design failure

Splunk's 12 August 2026 piece (Pratik Bhavsar) says the quiet part. Most production breakdowns — circular debates, role drift, duplicate work — come from inadequate system design, not from the model's limits.[6] Every hop adds a coordination tax: overhead, compute, complexity. Left to emerge, those interactions become the primary failure point.[6]

The required shape is deterministic task allocation, token and time budgets as circuit breakers so agents yield before they spiral, plus structured logging and immutable checkpoints.[6] Splunk cites a Gartner forecast that over 40% of agentic AI projects will be canceled by the end of 2027 on cost, unclear value, or weak risk controls.[6]

Hermes already has the circuit-breaker shape on the board. Dispatcher-owned workers get a checkpoint notice near 90% of their iteration budget.[3] A commit or a diff never auto-completes a task.[3] Workers should call `kanban_complete` only after verifying the task contract, or persist a progress comment and continue.[3] Consecutive failures trip `gave_up` and auto-block. The effective limit is the task's own cap, else `kanban.failure_limit`.[3]

`done` on the board is a worker's claim. The contract is the acceptance artifact. The docs already refuse to treat a git diff as that artifact.[3]

## the gate

Before a multi-agent Kanban wave, write one line: cross-domain, security boundary, or true parallelism. If you cannot, keep it on one profile with tools.[1][2]

If you can, pick the primitive on purpose. Short answer the parent needs now: `delegate_task`. Work that must survive a restart, take a human, or be found later: Kanban.[3]

Then keep the two anti-patterns in the card bodies, not in a wiki nobody reads. Do not `kanban_link` a support card under the blocked parent it exists to unblock. Do not reopen a `done` card for follow-up; create a child with `--parent`.[3]

If the wave is engineering on shared files, treat `hotspot:` as a stop sign and send merge conflicts to a third profile.[3] If you are the orchestrator, do not hold implementation tools.[5]

The 64% figure is an argument against using a fleet as the default.[2] Azure already wrote the default: a single agent with tools.[1] Hermes already wrote the two primitives and the two deadlocks.[3] The operational work is refusing to skip the first rung because the board looks busy.

## Sources

[1] https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns — AI Agent Orchestration Patterns - Azure Architecture Center
[2] https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production — 6 Multi-Agent Orchestration Patterns That Actually Work in Production
[3] https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban — Kanban (Multi-Agent Board) | Hermes Agent
[4] https://hermes-agent.nousresearch.com/docs/user-guide/profiles — Profiles: Running Multiple Agents | Hermes Agent
[5] https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-worker-lanes — Kanban worker lanes | Hermes Agent
[6] https://www.splunk.com/en_us/blog/artificial-intelligence/multi-agent-coordination-strategies.html — Multi-Agent Coordination: 10 Strategies to Prevent System Failures | Splunk
[7] https://github.com/NousResearch/hermes-agent/issues/344 — Feature: Multi-Agent Architecture — Issue #344 · NousResearch/hermes-agent
