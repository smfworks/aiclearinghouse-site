---
slug: "2026-07-18-foundry-agent-optimizer-closed-loop"
title: "Foundry Agent Optimizer: Close the Loop from Production Traces to Better Hosted Agents"
excerpt: "Microsoft Foundry’s Agent Optimizer turns evaluation into action—rewriting instructions, skills, tool descriptions, and model choice for hosted agents. Architecture, azd workflow, scoring, and a production build path for July 2026."
date: "2026-07-18"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-18-foundry-agent-optimizer-closed-loop"
categories: ["Microsoft", "Azure AI", "AI Agents", "Microsoft Foundry"]
tags: ["Microsoft Foundry", "Agent Optimizer", "Hosted Agents", "Foundry Agent Service", "Azure Developer CLI", "Agent Evaluation", "GPT-5", "AgentOps"]
readTime: 11
image: "/images/blog/2026-07-18-foundry-agent-optimizer-hero.png"
---

# Foundry Agent Optimizer: Close the Loop from Production Traces to Better Hosted Agents

**By Jeff | SMF Works | July 18, 2026**

---

## The gap after “it works in the demo”

Hosted agents in Microsoft Foundry Agent Service are a real production runtime: sandboxed sessions, enterprise identity, toolboxes, Foundry IQ knowledge, and paths into Microsoft Teams and Microsoft 365 Copilot. That stack solved *where* agents run. It did not automatically solve *how well* they behave on the long tail of enterprise scenarios.

Anyone who has shipped a support or policy agent knows the pattern. The baseline prompt is thin—“You are a helpful support agent.” Live traffic exposes missing order-number collection, weak warranty boundaries, unsafe advice paths, and tool-selection mistakes. Each fix is a human edit cycle: rewrite the system prompt, hand-test a few cases, deploy, hope nothing else regressed. That loop does not scale past a handful of agents.

**Agent Optimizer in Foundry Agent Service** is Microsoft’s platform answer. Announced at Build 2026, moved into private preview in early June, and positioned for public preview through July, it automates a governed **evaluate → generate candidates → rank → deploy** cycle against criteria you define. Microsoft Learn documents the feature as preview (docs updated mid-July 2026), available in hosted-agent regions (with limited exceptions), for agents on the Responses protocol.

This Clearinghouse Log deep dive is for teams running—or about to run—**hosted agents** who want Optimizer as part of Foundry’s operate story: tracing, evaluation, versioned config, and continuous improvement without a custom AgentOps harness.

## Where Optimizer sits in the July Foundry stack

Tina Schuchman’s Azure Blog post (**July 9, 2026**)—*Frontier models and production agents: Advancing Microsoft Foundry for the agentic era*—frames the July wave around three GA pillars: the GPT-5.6 series, the Asia-Pacific Data Zone, and production agents (hosted agents, toolboxes, publishing). In the same narrative, **agent optimizer** lands under govern-and-optimize as **public preview**: it tests prompts, skills, models, and tools together and surfaces better configurations—often holding quality while moving work to a smaller, cheaper model.

Nick Brady’s *What’s New in Microsoft Foundry | June 2026* (**July 7, 2026**) places Optimizer in the post-Build ship window: private preview after the June 3 announcement, public preview expected early July. The intro engineering post from Luis and Victor (*Introducing Agent Optimizer*, June 3) still carries the clearest product story: “live” is not “production-ready,” and the hard part is correct behavior across scenarios—not scaffolding the first agent.

Pair that with July GA of **tracing and evaluation for hosted agents**. Optimizer is not a replacement for observability; it is the action layer on top. Traces and evaluators show what failed. Optimizer proposes ranked, reviewable configuration changes with lineage you can apply and roll back.

Related Clearinghouse context: [hosted agents GA](/blog/foundry-hosted-agents-ga-production-stack-july-2026/), [procedural memory](/blog/foundry-agent-procedural-memory-july-2026/), [July 10–17 Microsoft AI week](/blog/microsoft-ai-week-july-10-17-2026/).

## How the closed loop works

Microsoft Learn’s overview maps to five steps:

1. **Prepare** — baseline config directory + `load_config()` at startup.
2. **Evaluate dataset** — tasks with pass/fail or weighted criteria.
3. **Run optimizer** — cloud job: baseline → candidates → re-score → rank.
4. **Review** — composite scores, per-task breakdowns, token cost, strategy labels.
5. **Apply and deploy** — promote winner, then `azd deploy`.

Internally:

1. Evaluate baseline (composite score **0.0–1.0**).
2. Generate candidates guided by failures.
3. Evaluate candidates on the same suite.
4. Rank; mark the best with ★.
5. Deploy a versioned, auditable config.

Typical duration: **5–20 minutes** depending on dataset size and candidate count—no extra cluster for you to provision if the hosted agent is already live.

**Critical ops warning from Learn:** evaluation *really invokes* the agent. Tools that hit APIs, write systems of record, or bill third parties fire for every task × candidate. Use mocks, test endpoints, or sandboxed tools for optimizer runs.

## What gets optimized

Targets activate from baseline files—you do not write custom mutators per slice.

| Target | Improves | Activates when baseline has |
| --- | --- | --- |
| **Instruction tuning** | System prompt rewrite | `instructions.md` |
| **Skill improvement** | Reusable Agent Skills (`SKILL.md` bodies) | `skills/` |
| **Tool optimization** | Tool/parameter descriptions for better function calling | `tools.json` |
| **Model selection** | Best quality/cost deployment in your search space | `model_search_space` in `eval.yaml` |

Skills use the open **Agent Skills** format (`name` / `description` frontmatter + markdown body)—the same progressive-disclosure idea other Microsoft agent surfaces are standardizing on. Product posts also describe skill generation as playbooks (escalation, troubleshooting) when a single prompt rewrite cannot carry multi-step procedure.

Application code stays stable:

```python
from azure.ai.agentserver.optimization import load_config

config = load_config()  # baseline in prod; candidate when injected
instructions = config.compose_instructions()
model = config.model or "gpt-4.1-mini"
tools = [lookup_order, search_kb, escalate]
config.apply_tool_descriptions(tools)
```

During a run, Foundry injects candidate config via environment. In production that injection is absent and baseline applies. Package: `azure-ai-agentserver-optimization`.

## Baseline layout

From Learn’s *Make your agent optimizer-ready*:

```text
my-agent/
├── main.py
├── azure.yaml
└── .agent_configs/
    └── baseline/
        ├── metadata.yaml      # required
        ├── instructions.md    # required
        ├── tools.json         # optional
        └── skills/            # optional
```

`metadata.yaml` points at the pieces (`model`, `instruction_file`, optional `tools_file` / `skill_dir`). That directory is the **contract** for diffs you can review, apply, and roll back like infrastructure-as-code.

## Evaluation without a data-science detour

Most teams lack a golden set on day one. The Azure Developer CLI path generates one from instructions:

```bash
azd ext install microsoft.foundry   # or upgrade; need recent agents surface
azd ai agent eval generate
azd ai agent optimize --max-candidates 2 --optimize-model gpt-5
```

Generated suites produce weighted dimensions tied to the agent’s job—for support that might be policy compliance, resolution accuracy, troubleshooting structure, clarity, safety boundaries, and general quality. You can also hand-author `eval.yaml`: agent identity, baseline metadata path, local JSONL or registered Foundry dataset, built-in or custom evaluators, plus options.

### Two models, two jobs

| Role | Config / flag | Job |
| --- | --- | --- |
| **Eval model** | `eval_model` / `--eval-model` | Score responses (any chat-completion deployment) |
| **Optimization model** | `optimization_model` / `--optimize-model` | Generate candidates (GPT-5 family and selected DeepSeek deployments per Learn) |

Both must already be **deployed in your Foundry project**. Optimization model is required.

Candidate dial:

| `max_candidates` | Approx. time (small set) | Use when |
| --- | --- | --- |
| 2 | ~5–10 min | Smoke / CI experiment |
| 5 (default) | ~20–30 min | Balanced |
| 10 | ~30–60 min | Thorough search |

Later candidates often improve because the loop learns from earlier failures.

## Reading scores and shipping winners

```text
Results:
  Candidate              Score  Strategy
  baseline                0.93
  candidate_2 ★           0.94  skill_policy-reviewer, tools

  azd ai agent optimize apply --candidate cand_...
  azd deploy
```

Composite score averages rescaled evaluator scores across tasks. Learn’s interpretation guide:

| Delta vs baseline | Read as |
| --- | --- |
| &lt; 0.03 | Noise—do not ship alone |
| 0.03–0.10 | Moderate—worth reviewed deploy |
| 0.10–0.20 | Significant |
| &gt; 0.20 | Major (often weak baseline) |

Watch **token cost**. Optimized instructions are often longer; quality lift must justify spend. If every candidate loses to baseline, keep baseline—promotion is a human decision.

Recommended path: `optimize apply` then `azd deploy` so git and peer review stay honest. Direct `optimize deploy` exists for fast A/B. Portal: project → Agents → agent → **Optimize** tab.

Python SDK path: `AIProjectClient.beta.agents.create_optimization_job` when datasets and evaluators are already registered. CLI still wins for first landing because it scaffolds eval assets.

## End-to-end azd muscle memory

```bash
azd ai agent init
azd deploy
azd ai agent eval generate
azd ai agent eval run
azd ai agent optimize --max-candidates 2 --optimize-model gpt-5
azd ai agent optimize apply --candidate <id>
azd deploy
azd ai agent eval run
```

Sample: Foundry customer-support optimization template under `microsoft-foundry/foundry-samples` (Python responses path), scaffolded via `azd ai agent init -m <azure.yaml URL>`.

Prerequisites that bite:

- Recent `microsoft.foundry` azd extension (docs cite **0.1.40-preview+** on the agents dependency surface).
- Hosted agent already responding (`azd ai agent invoke`).
- Preview access where required; Responses protocol; region support matching hosted agents (Learn: hosted-agent regions **except Norway East**).

## Optimizer in the broader AgentOps stack

1. **Runtime** — Hosted agents GA (isolation, identity, long-running/voice paths).
2. **Knowledge & tools** — Foundry IQ, toolboxes.
3. **Memory & schedules** — Procedural/user/session memory and routines (preview).
4. **See** — Tracing + evaluation GA.
5. **Improve** — **Agent Optimizer** (preview).
6. **Prove value** — ROI for agents (private preview in the July narrative).
7. **Distribute** — Teams and Microsoft 365 Copilot publishing.

Skip instrumentation and you optimize forever against thin synthetic suites. Skip value measurement and finance still asks why the agent exists. Foundry is assembling a full lifecycle—not a single magic button.

## A 30-day adoption plan

**Week 1 — Baseline.** Deploy one Responses-path hosted agent with `.agent_configs/baseline/`. Wire tracing. Write an honest `instructions.md`. Mock external tools for eval traffic.

**Week 2 — Eval suite.** Run `eval generate`, then add 5–15 real failure cases. Lock weighted dimensions with the business owner (safety high for support; completeness high for research).

**Week 3 — First runs.** `max_candidates: 2` with a supported optimization model. Review strategy labels. Reject noise (&lt;0.03). Ship one moderate win with peer review; re-eval after deploy.

**Week 4 — Operationalize.** Schedule optimize after meaningful traffic—not every commit. Try `model_search_space` for cost/quality tiers. Document rollback (prior candidate id + agent version). Track token deltas vs quality SLOs.

## Patterns and pitfalls

**Patterns:** Optimize policies and boundaries first. Keep tool *code* stable; refine descriptions. Use model selection as cost control against a fixed rubric. Version baseline and candidates under `.agent_configs/`.

**Pitfalls:** Agents that never call `load_config()`. Live CRM/ticket APIs without mocks. Shipping on composite score without reading failing tasks. One unscoped mega-agent (split surfaces, then optimize). Ignoring region/protocol constraints.

## Why it matters

Enterprise agent programs stall between pilot and production for predictable reasons: non-determinism, weak eval culture, and no promotion discipline. Foundry’s July posture is explicit—build where developers already work, run on managed infrastructure, govern with traces and evals, **improve with Optimizer**, distribute into Microsoft 365. Agent Optimizer turns evaluation from a report into a **deployable artifact**.

You own the rubric, the mocks, change control, and the promote decision. The platform owns the cloud loop, candidate generation, scoring harness, and versioned apply path. That is the same division of labor that made continuous delivery work for services—now applied to agents inside Microsoft Foundry.

## Start here

1. [Agent optimizer overview (preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview) — Learn, updated 2026-07-14  
2. [Quickstart: Optimize a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-optimize-hosted-agent)  
3. [Make your agent optimizer-ready](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/make-agent-optimizer-ready) · [Optimize targets](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/optimize-agent-targets)  
4. [Frontier models and production agents](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/) — July 9, 2026  
5. [What’s New in Microsoft Foundry | June 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/) — July 7, 2026  
6. [Introducing Agent Optimizer](https://devblogs.microsoft.com/foundry/agent-optimizer-build2026/) — June 3, 2026  

Ship the baseline. Measure it. Let Foundry propose the next better version—then decide with eyes open.

---

### Primary sources

1. Microsoft Learn — [Agent optimizer overview (preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview) — 2026-07-14  
2. Microsoft Learn — [Make your agent optimizer-ready](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/make-agent-optimizer-ready) — 2026-07-14  
3. Microsoft Learn — [Optimize agent instructions, skills, tools, and models](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/optimize-agent-targets) — 2026-07-14  
4. Microsoft Learn — [Quickstart: Optimize a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-optimize-hosted-agent) — 2026-07-13  
5. Tina Schuchman, Azure Blog — [Frontier models and production agents](https://azure.microsoft.com/en-us/blog/frontier-models-and-production-agents-advancing-microsoft-foundry-for-the-agentic-era/) — July 9, 2026  
6. Nick Brady, Foundry Blog — [What’s New in Microsoft Foundry | June 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-june-2026/) — July 7, 2026  
7. Luis & Victor, Foundry Blog — [Introducing Agent Optimizer in Foundry Agent Service](https://devblogs.microsoft.com/foundry/agent-optimizer-build2026/) — June 3, 2026  
