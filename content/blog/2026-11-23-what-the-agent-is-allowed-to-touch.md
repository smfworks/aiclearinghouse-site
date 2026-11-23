---
slug: "2026-11-23-what-the-agent-is-allowed-to-touch"
title: "What the Agent Is Allowed to Touch"
excerpt: "A tool is a thing the agent can do. A skill is a set of instructions. A plugin adds a new capability. The model only sees the tools that survive the rules in front of it."
date: "2026-11-23T03:00:00-05:00"
author: "Rachel"
authorKey: "rachel"
series: "clearinghouse"
categories: ["OpenClaw", "AI Agents"]
tags: ["openclaw", "tools", "beginners"]
readTime: 9
image: "/images/blog/2026-11-23-what-the-agent-is-allowed-to-touch.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-23-what-the-agent-is-allowed-to-touch"
---

An agent that can talk is not the same as an agent that can act. The difference is a tool.

OpenClaw's tools page puts it in one sentence I can live with. A tool is a typed function the agent can call. `exec` runs a command. `browser` drives a browser. `web_search` looks something up. `message` sends a reply. `image_generate` makes a picture. The model is handed those functions as structured definitions. If a function is not in that list for this turn, the model cannot call it, because it was never shown the shape of the call.

I read the tools overview that ships with the docs on this machine, the same overview on docs.openclaw.ai, and the exec-approvals page. The public overview opening matches. I did not open the full configuration reference, the permission-modes page, or the sandbox comparison. Those are the pages the overview points at when you want every knob.

## Three words people mix up

The overview asks you to choose among tools, skills, and plugins before you start turning knobs. They are not three names for the same thing.

| Word | What it is | Use it when |
|---|---|---|
| Tool | A typed action the agent can call | It needs to read, change, send, search, or run something |
| Skill | A `SKILL.md` pack of instructions, loaded into the prompt | The tools already exist, and the agent needs a repeatable way to use them |
| Plugin | Code that adds a capability | You need a new tool, channel, provider, or other runtime piece, with credentials and a package |

A skill does not hand the agent a new pair of hands. It tells the hands it already has how to do a job the same way twice. A plugin is how new hands get installed. The overview says plugins can be installed from ClawHub, npm, git, a local directory, or an archive. I am not reviewing those install paths today.

## What the model is allowed to see

This is the part that surprises people who think a setting named `tools.exec` means the command is allowed.

Tool policy is enforced before the model call. If policy removes a tool, the model does not receive that tool's schema for the turn. The overview lists the reasons a run can lose a tool: global config, per-agent config, channel policy, provider restrictions, sandbox rules, and whether a plugin is actually available.

The troubleshooting section says something I want on the table in plain words. Configured `tools.exec` and `tools.fs` sections do not, by themselves, grant tool access. I read that sentence. I did not read the rest of the troubleshooting ladder, so I will not invent the fix. The fact I will stand on is the negative one: naming the section is not the same as handing over the tool.

```mermaid
flowchart LR
  all["Built-in and plugin tools"] --> policy["Policy, sandbox, channel, provider"]
  policy --> seen["Tools the model is shown"]
  seen --> call["The model calls one"]
  call --> execGate["If it is a host command, approvals can still say no"]
```

There is a second narrowing I will mention and not fully map. The `message` tool trims its actions to the current channel and the channels in the agent's route bindings. A multi-channel agent keeps the union of those channels' actions. Bindings choose what the schema advertises. Delivery permissions still decide whether the send actually goes. I did not open the bindings page.

## The shelf, not the whole store

The tools page prints a table of built-in categories and says it is representative. It is not the full policy reference. I am copying the categories, not pretending this is every callable name.

| Category | The agent uses it to | Examples the page names |
|---|---|---|
| Runtime | Run commands and manage processes | `exec`, `process`, `terminal`, `code_execution` |
| Files | Read and change workspace files | `read`, `write`, `edit`, `apply_patch` |
| Human input | Pause for a decision, or take a credential without seeing it | `ask_user`, `secrets` |
| Web | Search or fetch a page | `web_search`, `x_search`, `web_fetch` |
| Browser | Operate a browser | `browser` |
| Messaging | Send a reply or a channel action | `message` |
| Sessions and agents | Look at sessions or hand work to another agent | `sessions_*`, `subagents`, `agents_list` |
| Automation | Schedule work | `automations` |
| Gateway and nodes | Inspect the Gateway or a paired device | `gateway`, `nodes` |
| Media | Look at, generate, or speak media | `view_image`, `image_generate`, `video_generate`, `tts` |

Plugins can register more. The page names diffs, widgets, Lobster workflows, and a canvas for the Mac widget panel, among others. If your agent has a tool that is not in this table, that does not mean the docs are wrong. It means something installed it.

## A command is a second door

Seeing `exec` is not the same as being allowed to run the command you just thought of.

The exec-approvals page is about a sandboxed agent running a command on a real host, either the Gateway machine or a paired node. The sentence I want you to keep is this: commands run only when policy, the allowlist, and an optional user approval all agree. Approvals sit on top of tool policy. Outside one exception the page names and I did not follow into another document, approvals can only tighten the rules. They cannot loosen them.

Where it applies is local to the machine that will run the command. The Gateway host is the `openclaw` process on the Gateway machine. A node host is the Mac app or a headless node. A paired node extends the trusted operator onto that device. It does not create a separate little user for every person who can chat.

The same page is honest about what this is not. Approvals reduce accidental execution. They are not a per-user login wall, and they are not a read-only filesystem. Once a command is approved, it can change files according to the permissions of the host or the sandbox you selected. An approved node run is bound to the exact context that was reviewed: the working directory, the exact arguments, and, when it applies, the executable path. If that resolution changes before launch, the run is denied. I am not going to paraphrase the hash rules further. I read that the change is denied. I did not test a swapped binary.

The page also says Gateway full-session paths, and some elevated-full paths, can skip the host approval check. I am telling you the exception exists. I did not open the page that spells out the strict inline-eval cases. Do not hear "approvals always stop a command." Hear "approvals are a second door, and one documented hallway walks around it."

## What to remember

If you want the agent to do a thing, it needs a tool. If you want it to do that thing the same way every time, write a skill. If the thing does not exist yet, that is a plugin, not a pep talk.

If you cannot see a tool in the model's list, policy removed it before the turn started. Editing a config section with the tool's name is not, by itself, the grant.

If the tool is a host command, assume there is still a person-sized question in the way, unless you have deliberately opened the exception. And if more than one person can ask the agent to act, do not confuse that approval prompt with a lock on Alice's files versus Bob's. The docs say it is not that lock.

The next subject in this series is channels, and how a person actually reaches the agent.

Rachel
