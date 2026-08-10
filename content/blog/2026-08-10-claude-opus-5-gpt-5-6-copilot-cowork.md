---
slug: "2026-08-10-claude-opus-5-gpt-5-6-copilot-cowork"
title: "Claude Opus 5 and GPT-5.6 in Microsoft 365 Copilot Cowork: Frontier Models for Agentic Enterprise Workflows"
excerpt: "Claude Opus 5 and OpenAI GPT-5.6 are now available in Microsoft 365 Copilot, powering stronger multi-step reasoning and agentic execution in Cowork. Combined with computer use capabilities, SKILL.md patterns, and updated subprocessor controls, these updates bring frontier model performance directly into daily Microsoft 365 workflows with enterprise grounding and governance."
date: "2026-08-10"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-10-claude-opus-5-gpt-5-6-copilot-cowork"
categories: ["Microsoft", "AI Agents", "Microsoft 365 Copilot"]
tags: ["Claude Opus 5", "GPT-5.6", "Copilot Cowork", "Computer Use", "Microsoft 365 Copilot", "Agentic Workflows", "Work IQ", "Frontier Models", "SKILL.md", "Subprocessor"]
readTime: 16
image: "/images/blog/2026-08-10-claude-opus-5-gpt-5-6-copilot-cowork-hero.png"
---

Microsoft 365 Copilot continues to evolve as the primary interface for AI-augmented knowledge work. The recent availability of Anthropic’s Claude Opus 5 and OpenAI’s GPT-5.6 family in Copilot — including in Copilot Cowork — marks a meaningful step forward in bringing frontier-level reasoning to the apps and workflows organizations already use every day.

These models are not drop-in replacements for lighter tasks. They are optimized for the complex, multi-step, ambiguous work that defines enterprise productivity: synthesizing information across Graph-connected sources, planning and executing agentic sequences in Cowork, and producing higher-quality drafts and analyses with less iteration.

## Model Choice in the Flow of Work

Claude Opus 5 is rolling out to the model selector in Copilot across Word, Excel, PowerPoint, Chat, Copilot Cowork, and Copilot Studio. It improves on prior Opus releases in agentic coding, professional knowledge work, and long-horizon reasoning.

GPT-5.6 (with variants such as Sol, Terra, and Luna in some contexts) is already positioned as the preferred model for Microsoft 365 Copilot in many scenarios. It brings stronger reasoning for agentic, multi-step work and moves Copilot from rough drafts to more complete, polished outputs with less manual assembly.

Both models are accessible alongside other options. When model selection is available, users and admins can choose explicitly. In many flows Copilot will automatically select the best model for the task.

Key practical improvements reported with these models:

- Stronger structure and flow in Word drafts from rough intent.
- More complex analysis and outcome-focused work in Excel.
- Richer slide content, visual balance, and flexibility in PowerPoint.
- Better handling of ambiguity and multi-step planning in Copilot Chat and Cowork.

Sources: [Available today: Anthropic Claude Opus 5 in Microsoft 365 Copilot](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/available-today-anthropic-claude-opus-5-in-microsoft-365-copilot/4540524), [Available today: OpenAI’s GPT-5.6 in Microsoft 365 Copilot](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/available-today-openai%E2%80%99s-gpt-5-6-in-microsoft-365-copilot/4533152).

## Copilot Cowork and Agentic Execution

Copilot Cowork is where these frontier models deliver the most visible lift. Cowork is designed for outcome-oriented work: you describe the goal, and the system plans, reasons across tools and files, executes steps, and returns a finished deliverable rather than a draft or recommendation.

With GPT-5.6 and Claude Opus 5, Cowork can carry complex multi-step tasks more efficiently. The models handle planning loops, tool invocation, grounding against Microsoft Graph data (emails, files, meetings, calendar), and synthesis into usable artifacts.

Recent August 2026 updates further extend Cowork’s reach:

- **Computer Use capabilities** have moved into Cowork (previously associated with the retired Frontier Researcher experience). This brings browser and desktop automation patterns into the same governed, consumption-billed environment as other Copilot work. Agents can now perform actions that require interacting with web interfaces or local application surfaces as part of larger workflows. This is particularly powerful for research synthesis, competitive intelligence, and any process that previously required a human to switch contexts and click through UIs.

- **SKILL.md support in PowerPoint** (and the broader Office agent-skills pattern). Custom skills can be authored as SKILL.md files stored and shared from OneDrive. This brings the executable skill engineering pattern into the Microsoft 365 productivity surface, allowing reusable, versionable instruction sets that Cowork and other agents can discover and apply. Skills become first-class artifacts that travel with the user or team rather than living only inside prompt history.

- Mobile in-person meeting recording (on by default for eligible users, with transcripts and insights landing in OneDrive under user permissions and Purview governance).

- AI-generated meeting archives (.meeting files) stored in tenant-owned SharePoint Embedded with configurable retention (default five years in many configurations).

These capabilities sit on top of Work IQ for organizational grounding and respect existing Microsoft 365 compliance, DLP, and RBAC controls.

Source summary from August enterprise updates: [Microsoft 365 Enterprise Update August 2026](https://empowering.cloud/microsoft-365-ai-workplace-update-august-2026).

## Subprocessor Controls and Data Governance

A notable operational change this month: OpenAI-operated models (including GPT-5.6) now run under OpenAI as a subprocessor within Microsoft 365 Copilot. The admin toggle for this behavior auto-enabled on or around 24 July for tenants that had not explicitly set it to “No users.”

Organizations concerned with data residency, particularly those using the EU Data Boundary, should verify the current setting. The default behavior pattern is worth noting for governance planning: convenience defaults can change the processor chain without explicit action.

Claude models from Anthropic are also integrated with documented subprocessor terms. Microsoft continues to provide the enterprise controls, logging, and compliance surface while the underlying frontier models deliver the reasoning lift.

Admins can control model availability per user or group through the Microsoft 365 admin center. This allows phased rollouts and cost/performance tuning — frontier models are more expensive per token than lighter options, so selective enablement is often the right first step.

## Comparison of Recent Frontier Additions

| Model / Capability       | Key Strengths for Copilot                  | Surfaces                          | Notes / Deployment                  |
|--------------------------|--------------------------------------------|-----------------------------------|-------------------------------------|
| Claude Opus 5            | Long-horizon reasoning, agentic coding, professional knowledge work | Word, Excel, PowerPoint, Chat, Cowork, Copilot Studio | Available today in model selector  |
| GPT-5.6 family           | Multi-step planning, polished outputs, complex analysis | Word, Excel, PowerPoint, Chat, Cowork | Preferred in many flows; variants for different latency/cost profiles |
| Computer Use (Cowork)    | Browser and desktop automation as part of workflows | Cowork                           | Moved from retired Frontier Researcher; consumption billing |
| SKILL.md (PowerPoint/Office) | Reusable, shareable executable skills     | PowerPoint, broader Office agents | Stored in OneDrive; agent-skills pattern |
| M365 Admin Agent (GA)    | Native admin actions with confirmation and RBAC | Microsoft 365 admin center       | Manage users, licenses, health, troubleshooting |

## How This Fits the Broader Microsoft AI Stack

These updates in M365 Copilot and Cowork are part of a larger unified story across Azure AI Foundry, Copilot Studio, and the Agent Framework:

- Models hosted or routed through Foundry (GPT-5.6 variants, Claude Opus 5, and Microsoft’s own MAI models such as MAI-Image-2.5-Pro, MAI-Voice-2-Flash, and the new MAI-Cyber-1-Flash security model) become selectable or automatically routed based on task characteristics.

- Custom Engine Agents (GA as of recent coverage) allow pro-code or low-code agents built in Foundry or Studio to surface natively inside Copilot and Teams with full orchestration control.

- Cowork acts as the high-level agentic harness for outcome-driven work, now with computer use primitives, skill extensibility via SKILL.md, and direct ties to Graph and Work IQ.

- Work IQ and Microsoft Graph provide the persistent enterprise context layer that keeps agentic execution grounded, auditable, and compliant.

The result is a spectrum of control: from simple chat prompts using the best available model, through Cowork for multi-step execution, to fully custom agents published into the same user experience. The harness (Copilot surfaces, Cowork, Studio, Foundry tooling) and the model catalog remain separable, giving organizations choice while maintaining a single set of enterprise controls and data boundaries.

Microsoft’s stated strategy emphasizes “frontier diffusion and control” — offering frontier models, their own MAI models, and open-weight options through a consistent platform while separating model selection from the orchestration harness.

## What to Do This Week

1. Check the subprocessor toggle in the Microsoft 365 admin center (search for the relevant MC message or Copilot settings) and document the decision for your tenant. Pay special attention if you rely on the EU Data Boundary.

2. Enable Claude Opus 5 and confirm GPT-5.6 availability in your Copilot model selector. Test the same prompt in Chat versus Cowork to see the difference in planning depth and output completeness. Try a task that requires synthesis across multiple Graph sources.

3. Experiment with Cowork on a real multi-step task (e.g., “Prepare a Q3 business review deck from the last three customer meetings and the latest pipeline data, including competitor context from approved web sources and recent earnings transcripts”). Note where computer use or additional grounding would help.

4. If you maintain custom skills or agents, explore storing a PowerPoint-focused or domain-specific SKILL.md in OneDrive and testing discovery inside Copilot flows. Treat skills as versioned artifacts.

5. Review Cowork billing and spending alerts (existing alerts may have been cleared in a recent Cost Management update; recreate policies as needed). Set appropriate thresholds before heavy agentic usage.

6. For teams using mobile or meeting-heavy workflows, confirm mobile recording and .meeting archive settings align with your retention and governance policies. Review the default five-year retention for AI meeting archives.

7. Consider a small pilot for the M365 Admin Agent in a non-production tenant or with a limited RBAC scope to evaluate how well it handles real admin tasks with the required confirmation steps.

8. Watch for interactions between these new capabilities and any existing Custom Engine Agents or Copilot Studio solutions you have deployed.

## Summary

The August 2026 updates to Microsoft 365 Copilot represent continued maturation of the agentic layer on top of frontier models. Claude Opus 5 and GPT-5.6 raise the ceiling on what Cowork and in-app Copilot can reliably accomplish without leaving the Microsoft 365 surface. Computer use, SKILL.md extensibility, mobile capture, and admin agent capabilities close important gaps between chat, automation, and governed execution.

Microsoft’s approach keeps the harness and the model catalog separable while strengthening enterprise controls. For teams already investing in Microsoft 365 Copilot and Azure AI Foundry, these releases are immediately actionable. The combination of stronger reasoning models, agentic execution surfaces, and explicit governance levers makes it practical to move more complex knowledge work into production agentic flows with confidence.

## Sources

- [Available today: Anthropic Claude Opus 5 in Microsoft 365 Copilot](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/available-today-anthropic-claude-opus-5-in-microsoft-365-copilot/4540524)
- [Available today: OpenAI’s GPT-5.6 in Microsoft 365 Copilot](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/available-today-openai%E2%80%99s-gpt-5-6-in-microsoft-365-copilot/4533152)
- [Microsoft 365 Enterprise Update August 2026](https://empowering.cloud/microsoft-365-ai-workplace-update-august-2026)
- [Get started with Copilot Cowork](https://learn.microsoft.com/en-us/copilot/microsoft-365/cowork/get-started)
- [Copilot Cowork common questions](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-faq)
- Microsoft 365 Roadmap and release notes (referenced in Tech Community posts)
- Relevant MC messages for subprocessor (e.g. MC1422074), computer use (MC1420902), SKILL.md (MC1434580), admin agent GA (MC1436831), and related updates

---

*This post is part of the daily Microsoft AI research series on The Clearinghouse Log. All claims are grounded in the cited primary Microsoft sources. Focus remains on positive, actionable productivity within the Microsoft ecosystem.*