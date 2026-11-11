---
slug: "2026-11-11-close-the-cross-agent-session-door-openclaw-audit"
title: "Your agents can read each other's transcripts. Close that door in ten minutes."
excerpt: "The OpenClaw security audit told me seven agents could reach every session on the gateway, including transcripts they were never meant to see. Here is the two-key config that fixed it, and the live tests that prove the fix landed."
date: "2026-11-11"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Agents", "Security"]
tags: ["OpenClaw", "agent security", "how-to", "multi-agent"]
readTime: 8
image: "/images/blog/2026-11-11-close-the-cross-agent-session-door-openclaw-audit-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-11-close-the-cross-agent-session-door-openclaw-audit"
---

You run a team of agents on one OpenClaw gateway. A coordinator hands work to a writer, a reviewer checks it, everything flows through one process. It works. Then you run the security audit the docs keep recommending, and it hands you a finding you did not expect: every one of your agents can list, read, search, and message every other agent's sessions. Your reviewer can pull the researcher's transcripts. Your validator can read anything anyone ever said to anyone.

By the end of this post you'll run the audit on your own gateway, read the finding it prints, write the two config keys that narrow session visibility without breaking the agent-to-agent handoffs your workflow depends on, restart the gateway, and prove the change landed with three live tests. This is the exact change I made on our gateway this morning, with the command output as it happened.

## The audit tells you first

The real name for this is `security.trust_model.cross_agent_session_access_default`, a check in [OpenClaw's security audit](https://docs.openclaw.ai/gateway/security/audit-checks). The [audit docs](https://docs.openclaw.ai/gateway/security/running-the-audit) say to run it after any config change or before exposing network surfaces, so it's the first command I reach for when I touch `openclaw.json`:

```bash
$ openclaw security audit
OpenClaw security audit
Summary: 0 critical · 0 warn · 2 info
```

Zero critical, zero warn. If you stop reading the output there, you'll miss it. Scroll to the INFO section and the trust-model line names every agent on your gateway and what each one can reach:

```text
security.trust_model.cross_agent_session_access_default Agents share Gateway-wide session access (default)
  Agents: main, smf-coordinator, smf-researcher, smf-writer, smf-reviewer, validator, smf-publisher
tools.sessions.visibility resolves to "all" and tools.agentToAgent is enabled with no allow list.
```

That's our gateway, this morning, before the change: seven agents, no `tools.sessions` key and no `tools.agentToAgent` key in the config at all. The check fired because both defaults are permissive. The [docs page for these keys](https://docs.openclaw.ai/gateway/config-tools/sessions-and-subagents) says `tools.sessions.visibility` defaults to `all` ("every session on the Gateway, including other agents' and other users' transcripts") and `tools.agentToAgent.enabled` defaults to `true`. The [security trust model page](https://docs.openclaw.ai/gateway/security/trust-model) is blunt about what that means: "any tool-enabled agent running unsandboxed can list, read, search, and message every agent's sessions, including other users' transcripts."

The check is severity `info` or `warn` depending on your setup. The [check catalog](https://docs.openclaw.ai/gateway/security/audit-checks) says it escalates toward warn when the audit sees trust-boundary signals like sandboxing or shared-user ingress. Ours printed as info because we're one trusted operator's personas. The severity is about how the audit classifies the risk, and the capability is real either way.

Before I changed anything, I wanted proof the exposure was live, so I asked one of our agents to use its own session tools. I picked `validator`, a small agent with a narrow job, and asked it to count what `sessions_list` returns:

```text
Q: how many distinct agentIds appear in sessions_list?
A: 7 distinct agentIds, and yes, agentIds other than main appear.
```

Then I asked it to read one transcript from `smf-reviewer`, reporting only whether the call succeeded, not the content:

```text
Q: did sessions_history on a smf-reviewer session succeed?
A: Succeed.
```

That's the whole problem in two lines. An agent whose job has nothing to do with review could read the reviewer's work.

## Two keys, one for seeing and one for sending

The fix is two config keys, and the reason there are two is worth understanding before you type anything. `tools.sessions.visibility` controls which sessions the session tools can *target*, meaning who you can see. `tools.agentToAgent` controls *cross-agent* access as a separate policy, meaning who may make cross-agent calls at all. Narrowing visibility alone blocks the reads but also blocks ordinary `sessions_send` handoffs, which would break a workflow where a coordinator delegates to a writer. The docs' send-only pattern pairs narrow visibility with per-agent `send` rules so agents can still ask each other for work without getting each other's history.

Here's what I wrote into `~/.openclaw/openclaw.json`, on the gateway with all seven agents:

```json5
{
  tools: {
    sessions: { visibility: "agent" },
    agentToAgent: {
      enabled: true,
      allow: ["main", "smf-coordinator", "smf-researcher",
              "smf-writer", "smf-reviewer", "validator", "smf-publisher"],
    },
  },
  agents: {
    entries: {
      main:           { tools: { agentToAgent: { send: ["smf-coordinator", "smf-researcher", "smf-writer", "smf-reviewer", "validator", "smf-publisher"] } } },
      smf-coordinator: { tools: { agentToAgent: { send: ["main", "smf-researcher", "smf-writer", "smf-reviewer", "validator", "smf-publisher"] } } },
      // …same shape for the other five agents: every agent lists
      // every other agent in its own send array
    },
  },
}
```

(Abbreviated: I wrote the full `send` array for each of the seven entries. The JSON5 shape with unquoted keys is how the docs show it; plain JSON works too, with quoted keys.)

Three details from the docs that are easy to get wrong:

The `allow` list must name *both* sides of every conversation. The [sessions-and-subagents page](https://docs.openclaw.ai/gateway/config-tools/sessions-and-subagents) says "both the requesting agent and the target agent must match an entry." An omitted or empty list counts as unset, meaning every agent can reach every other agent, so a half-finished allowlist silently behaves like no allowlist.

The per-agent `send` entry is what keeps handoffs working under narrowed visibility. Under `visibility: "agent"`, ordinary cross-agent sends are blocked unless a per-agent send rule permits them. A send match permits `sessions_send` and the reply to that one turn, and the docs are specific about what it doesn't grant: "send does not grant list, history, search, status, or session-control access."

One agent on your team probably doesn't need to send anything. Give it `send: []`. An explicit empty array denies all sends from that agent, and unlike the global `allow`, an empty `send` is a deny, not an allow-all.

I edited the file, made a timestamped backup first (`cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak-20261111`), and restarted the gateway:

```bash
$ openclaw gateway restart
Restarted systemd service: openclaw-gateway.service
```

## Three tests that prove it landed

A config change you haven't tested is a guess. The audit first:

```text
$ openclaw security audit
Summary: 0 critical · 0 warn · 1 info
```

The finding count dropped from two info to one. The remaining info is the generic `summary.attack_surface` exposure summary, which stays. The cross-agent check is gone from the output entirely.

Then the same two probes I ran before the change, same agent, same questions:

```text
Q: how many distinct agentIds appear in sessions_list?   (was: 7)
A: 1

Q: did sessions_history on a smf-reviewer session succeed?
A: Fail.
```

`validator` now sees exactly its own sessions, and the cross-agent history read is refused. Finally, the part that would have broken the team if I'd gotten it wrong: a cross-agent handoff. I had `validator` send a turn to `smf-coordinator` via `sessions_send`:

```text
Q: was the sessions_send to smf-coordinator accepted?   (first attempt: "Not accepted")
A: Accepted.
```

That "first attempt: Not accepted" line is honest history: my first version of the config set `visibility: "agent"` and the global `allow` list, restarted, and the send bounced. That's how I learned the per-agent `send` rule is required under narrowed visibility. The global allowlist alone doesn't carry sends across the new boundary. I added the per-agent entries and the send went through. If you're wiring this up and your handoffs start failing, that missing piece is the first thing to check.

Last check, that nothing else broke: every agent answers a plain turn:

```text
main: OK
smf-coordinator: OK
smf-reviewer: OK
```

All three came back this morning after the restart. One honest limitation of these probes: each asks an agent to report its own tool results, so they prove the policy holds for the paths I exercised, on this gateway, at this version. `openclaw --version` prints `OpenClaw 2026.11.2 (b556fdf)`. They don't replace reading the trust-model docs for a setup with different boundaries.

## What stays the same, and what to try

Two things this change deliberately kept, because our workflow depends on them. Cross-agent handoffs still work, thanks to the per-agent `send` rules. And agents still see sessions within their own agent id, which is what `visibility: "agent"` means: any session belonging to the current agent. If you run per-sender sessions under one agent id, the docs note that `agent` scope "can include other users", in which case you'd want `self` or `tree` instead, and the trade-offs are laid out in the [visibility scopes](https://docs.openclaw.ai/gateway/config-tools/sessions-and-subagents).

One more thing worth knowing before you start deleting agents: the docs warn that `openclaw agents delete` prunes the deleted agent's id from `allow`, and if that empties the list, the policy falls back to allow-all. Re-check the list after removing an agent.

If you run more than one agent on OpenClaw, here's the whole thing in one sitting: run `openclaw security audit` and read the trust-model lines, not just the summary. If you see the cross-agent check, ask one agent to call `sessions_list` and count what it can see. That number is your actual exposure. Then write the two keys, restart, and run the same three probes I did. Ten minutes, and your reviewer's transcripts belong to your reviewer.
