---
slug: "visual-studio-built-in-agent-skills-dotnet-azure-foundry-2026"
title: "Visual Studio Built-in Agent Skills: .NET and Azure Expertise That Ships With the IDE"
excerpt: "Microsoft shipped built-in Agent Skills for Visual Studio—dotnet-webapi, performance analysis, Azure prepare/validate/deploy, Kusto, and microsoft-foundry—so Copilot agents follow real product workflows instead of generic cloud advice."
date: "2026-07-14"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/visual-studio-built-in-agent-skills-dotnet-azure-foundry-2026"
categories: ["Microsoft", "Visual Studio", "GitHub Copilot", "Azure AI", "AI Agents"]
tags: ["Agent Skills", "Microsoft Foundry", ".NET", "Azure", "Copilot", "Developer Productivity"]
readTime: 10
image: "/images/blog/visual-studio-built-in-agent-skills-dotnet-azure-foundry-2026.png"
---

Agent-assisted development stops being a parlor trick when the agent knows *your* stack—not just general programming folklore. On July 14, 2026, the Visual Studio team published a practical answer to that gap: **built-in Agent Skills** authored by .NET and Azure experts, available in Visual Studio starting with the **18.8** release. These skills package real workflows—API design, performance triage, Azure infrastructure, log analysis, and Microsoft Foundry agent work—so GitHub Copilot can execute structured tasks instead of improvising every time.

If you already live in Visual Studio and ship .NET on Azure, this is one of the most actionable Microsoft AI updates of the week. It sits on top of the Agent Skills model Visual Studio already supports, and it connects cleanly to the broader Microsoft agent surface: Foundry projects, hosted agents, and the paths that put agents into Microsoft 365 Copilot and Teams.

## Thesis: Skills Are Procedural Memory for Agents

Custom instructions (for example `.github/copilot-instructions.md`) are always-on style and policy. Agent Skills are different. They are **task-specific, dynamically loaded** instruction packages—typically a `SKILL.md` plus optional scripts, templates, and references—that the model applies when the task matches. Visual Studio documents the distinction clearly: use custom instructions for conventions that should always apply; use skills for multi-step procedures that only matter in certain contexts.

That design matters for three practical reasons:

1. **Context budget.** Always-on instructions compete for tokens on every turn. Skills load when relevant.
2. **Team shareability.** Solution-scoped skills live under paths such as `.github/skills/`, `.agents/skills/`, or `.claude/skills/`; personal skills live under profile locations such as `~/.copilot/skills/`. Teams can version skills with the repo.
3. **Observability.** When a skill activates, Visual Studio surfaces it in chat so you can see what procedural guidance the agent is following.

The July 14 announcement does not invent the skills model. It **ships a curated starter set** so you do not have to invent .NET and Azure expertise from scratch.

Primary source: [Built-in Agent Skills Bring .NET and Azure Expertise into Visual Studio](https://devblogs.microsoft.com/visualstudio/built-in-agent-skills-in-visual-studio/) (Visual Studio Blog, July 14, 2026). Background on the skills model: [Agent Skills in Visual Studio](https://devblogs.microsoft.com/visualstudio/agent-skills-in-visual-studio/). Specification reference used by Visual Studio for skill layout: [agentskills.io specification](https://agentskills.io/specification). Expert-maintained skill corpus: [github.com/dotnet/skills](https://github.com/dotnet/skills).

## What Shipped in the Built-in Pack

Built-in skills appear under a **Built-in** category in the Visual Studio tool picker. They show up when the corresponding **.NET and Azure development workloads** are installed. Microsoft notes that built-in skills are **off by default** so you can enable only what you need—especially relevant as Copilot moves toward usage-based billing where every token should earn its keep. Efficacy is being tracked on a public evaluation surface at [dotnet.github.io/skills](https://dotnet.github.io/skills/).

### .NET skills called out first

**dotnet-webapi.** Guides creation and modification of ASP.NET Core HTTP APIs with correct HTTP semantics, OpenAPI metadata, and error handling. The blog’s sample prompt is concrete: add an endpoint that moves entries from current to archived storage, with proper error handling. The point is not “generate some controllers.” The point is first-pass quality against modern ASP.NET Core conventions.

**analyzing-dotnet-performance.** Scans for on the order of **~50 performance anti-patterns** across async, memory, strings, collections, LINQ, regex, serialization, and I/O, with tiered severity. Sample prompt: review the app and return the top three highest-impact changes. That is a performance coach skill, not a vague “make it faster” chat.

### Azure skills that form a deployment chain

Three skills are designed to hand off:

- **azure-prepare** — generates infrastructure your app needs (Bicep or Terraform, `azure.yaml`, Dockerfiles, managed identity).
- **azure-validate** — preflight checks before anything hits the cloud: configuration, IaC, RBAC and managed identity permissions, what-if/build verification.
- **azure-deploy** — executes deployment (`azd up`, `azd deploy`, Bicep, or Terraform apply) with built-in error recovery paths.

Together they define a path from “it builds locally” to “it’s running in Azure,” with validation as an explicit stage rather than an afterthought.

**azure-kusto.** Natural-language path into Azure Data Explorer / KQL for logs, telemetry, and time-series questions—for example error rate per endpoint over the last 24 hours with spike callouts.

**microsoft-foundry.** End-to-end guidance for Microsoft Foundry work: discover and deploy models, create and invoke agents, run evaluations, and fine-tune. Sample prompt: “Deploy my hosted agent to Foundry.” This is the skill that links the IDE loop to the cloud agent platform.

## Architecture View: Skills, Tools, and Platforms

Think of three layers:

| Layer | What it provides | Examples |
| --- | --- | --- |
| **Procedural (skills)** | How to do a class of tasks | `dotnet-webapi`, `azure-prepare`, `microsoft-foundry` |
| **Capability (tools / MCP)** | What the agent can call | Deploy CLIs, Kusto queries, Foundry APIs, MCP servers |
| **Runtime / surface** | Where agents run and reach users | Visual Studio Copilot, Foundry Agent Service, Teams / M365 Copilot |

Skills without tools are essays. Tools without skills are raw power without process. Visual Studio’s own skills post makes that complementary relationship explicit: a skill can describe *how* to handle a task while MCP tools (or IDE tools) provide *capability* to execute it.

For builders, the durable pattern is:

1. Put **always-on policy** in custom instructions (security rules, coding standards, “never commit secrets”).
2. Put **workflows** in skills (deploy chain, issue templates, Foundry evaluation loop).
3. Put **side effects** behind tools with approvals where risk warrants it.
4. Publish only versions you have tested, with clear version selectors when agents leave the lab.

## Practical Implications for Engineers and Architects

### 1. Treat skills as product code

A skill directory with `SKILL.md` is a maintainable artifact. Version it. Review it. Add examples that match *your* solution layout. Prefer solution-scoped skills for team defaults; keep personal experiments in profile-scoped skills. Visual Studio’s skills panel supports edit, open location, search, and diagnostics for misconfigured skills—use those signals the same way you use analyzer errors.

### 2. Enable built-ins selectively

Because built-ins are off by default, start with the two or three that match this week’s work:

- Web API sprint → `dotnet-webapi`
- Latency / allocation pain → `analyzing-dotnet-performance`
- Landing an app on Azure Container Apps with identity → `azure-prepare` → `azure-validate` → `azure-deploy`
- AI feature path on Foundry → `microsoft-foundry`

Measure whether quality and time-to-correct-diff improve before turning everything on. Microsoft is doing the same kind of efficacy tracking before considering broader defaults.

### 3. Connect IDE agents to Foundry publishing deliberately

June 2026 Foundry documentation highlights how-to content for **publishing agents to Microsoft 365 Copilot and Microsoft Teams**, including virtual network scenarios, memory, toolboxes, routines, Work IQ / Fabric IQ connections, and observability (tracing, Trace Replay, traces-to-evaluation datasets). See [What’s new in Microsoft Foundry (June 2026)](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry) and [Publish agents to Microsoft 365 Copilot and Microsoft Teams](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot).

Publishing is not “export chat history.” It validates metadata, packages a Teams app manifest, enables activity protocol, and sets authorization scope (`BotServiceRbac` for individual/shared vs `BotServiceTenant` for organization-wide after admin approval). Prerequisites include Foundry project access, tested agent versions, Bot Service write permissions, and careful choice of the **active agent version** (always latest vs pinned).

The productive loop for many teams will look like:

1. Author and refine agent behavior in Foundry (and related SDKs).
2. Use Visual Studio + `microsoft-foundry` skill to keep app code and agent deployment aligned.
3. Publish to M365/Teams only after portal/API testing and permission reviews.
4. Keep version selectors intentional so consumers do not get surprise behavior.

### 4. Multi-language agent runtime is expanding

If your estate is not only .NET/Python, note the July 10 public preview of **Microsoft Agent Framework for Go** (`github.com/microsoft/agent-framework-go`): providers for Foundry, Azure OpenAI–compatible models, Anthropic, Gemini, and A2A; tools/MCP/middleware; multi-agent workflows with routing, checkpoints, streaming, and human review; OpenTelemetry tracing. See [Microsoft Agent Framework for Go public preview](https://devblogs.microsoft.com/go/microsoft-agent-framework-for-go-public-preview/). Skills in Visual Studio remain the IDE-side procedural layer; the Go SDK extends the same framework family into services and workers where Go already dominates.

## How to Evaluate Whether Built-in Skills Are Working

Use engineering metrics, not vibes:

- **First-pass correctness** on API endpoints (OpenAPI shape, status codes, error models).
- **Time from green local build to successful Azure deploy** with managed identity.
- **Number of rework cycles** after “deploy my agent to Foundry.”
- **Token spend per successful task** under usage-based Copilot billing.
- **Skill activation accuracy** — did the right skill fire, and was it visible in chat?

When a built-in skill is close but not quite your house style, fork the idea into a solution skill with your templates. Keep the built-in as a baseline; customize the repo skill as the source of truth for the team.

## Also Noted This Week (Microsoft AI Surface)

- **Building Agents for Teams** monthly series launched on the Microsoft 365 Developer Blog, emphasizing agents as collaborative participants (private 1:1 and public channel/meeting modes) and the Teams SDK across TypeScript, C#, and Python with MCP and agent-to-agent patterns. Scaffolding starts with `@microsoft/teams.cli`. Source: [Building Agents for Teams: Turning conversations into outcomes](https://devblogs.microsoft.com/microsoft365dev/building-agents-for-teams-turning-conversations-into-outcomes).
- **Foundry Local / models / toolboxes / memory / optimizer / observability** docs expanded in the June 2026 Foundry “what’s new” set—useful when you are hardening production agents rather than demoing chat. Source: [Microsoft Learn — What’s new in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry).
- **Surface for Business** devices with Snapdragon X2 platforms continue the cloud+edge story for Copilot+ class workflows (enterprise device angle, not the deep focus of this post). Source: [Surface IT Pro community post](https://techcommunity.microsoft.com/blog/surfaceitpro/surface-for-business-devices-now-available-with-snapdragon%C2%AE-x2-series-platforms/4536590).

## Actionable Next Steps

1. **Update Visual Studio** to a build that includes 18.8-class Agent Skills support and install .NET + Azure workloads if they are missing.
2. **Open the skills panel** (tools icon in Copilot Chat), inspect the Built-in category, and enable only the skills that match current work.
3. **Run one golden path end-to-end**: ASP.NET Core change with `dotnet-webapi`, then a prepare → validate → deploy chain to a non-production Azure environment.
4. **If you ship AI features**, try `microsoft-foundry` against a real Foundry project; document which model deployment and agent version you pinned.
5. **Clone patterns from** [github.com/dotnet/skills](https://github.com/dotnet/skills) into `.github/skills/` for team-specific workflows; keep evaluation criteria (and optional eval harnesses) next to the skill definitions.
6. **Before publishing agents to M365/Teams**, walk the [Foundry publish how-to](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot): active version, Bot Service permissions, publish scope, and admin approval path for tenant-wide visibility.
7. **Watch token efficacy** during the Copilot billing model transition; turn skills off if they do not improve first-pass quality for your team.

## Conclusion

Built-in Agent Skills are a small surface area with a large productivity claim: **Microsoft is encoding .NET and Azure product expertise as loadable agent procedures inside Visual Studio**, not only as blog posts and docs you hope the model remembers. Paired with Foundry’s publish path into Microsoft 365 Copilot and Teams, and with Agent Framework SDKs expanding across languages, the Microsoft ecosystem story for practitioners is coherent: author skills and agents where you build, run them with governance and observability, and deliver them into the collaboration surfaces people already use.

Start narrow. Enable two skills. Measure first-pass quality. Version what works. That is how agentic IDE features become engineering infrastructure instead of demo reels.

## Sources

- [Built-in Agent Skills Bring .NET and Azure Expertise into Visual Studio](https://devblogs.microsoft.com/visualstudio/built-in-agent-skills-in-visual-studio/) — Visual Studio Blog, July 14, 2026
- [Agent Skills in Visual Studio: Teach Copilot How Your Team Works](https://devblogs.microsoft.com/visualstudio/agent-skills-in-visual-studio/)
- [dotnet/skills](https://github.com/dotnet/skills) — Microsoft-maintained .NET agent skills repository
- [Agent Skills evaluation dashboard](https://dotnet.github.io/skills/)
- [Microsoft Foundry docs: What’s new for June 2026](https://learn.microsoft.com/en-us/azure/foundry/whats-new-foundry)
- [Publish agents to Microsoft 365 Copilot and Microsoft Teams](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot)
- [Microsoft Agent Framework for Go public preview](https://devblogs.microsoft.com/go/microsoft-agent-framework-for-go-public-preview/)
- [Building Agents for Teams: Turning conversations into outcomes](https://devblogs.microsoft.com/microsoft365dev/building-agents-for-teams-turning-conversations-into-outcomes)
- [Agent Skills specification](https://agentskills.io/specification)
