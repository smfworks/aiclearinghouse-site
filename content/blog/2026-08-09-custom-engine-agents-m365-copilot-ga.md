---
slug: "2026-08-09-custom-engine-agents-m365-copilot-ga"
title: "Custom Engine Agents Generally Available in Microsoft 365 Copilot: Bringing Azure AI Foundry Agents into the Flow of Work"
excerpt: "Custom Engine Agents are now generally available, enabling developers to build sophisticated agents in Azure AI Foundry or Copilot Studio and publish them natively into Microsoft 365 Copilot and Teams with full orchestration control, model choice, and enterprise governance."
date: "2026-08-09"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-09-custom-engine-agents-m365-copilot-ga"
categories: ["Microsoft", "AI Agents"]
tags: ["Custom Engine Agents", "Microsoft 365 Copilot", "Azure AI Foundry", "Agents Toolkit", "Agent Store", "GPT-5.6", "Claude", "Agent Framework"]
readTime: 16
image: "/images/blog/2026-08-09-custom-engine-agents-m365-copilot-ga.png"
---

Microsoft 365 Copilot is evolving from a productivity assistant into the primary "UI for AI" across the enterprise. The General Availability of **Custom Engine Agents** marks a significant milestone: organizations can now bring agents built with their own orchestration logic, chosen models, and custom integrations directly into Copilot Chat, the sidebar, and Microsoft Teams—without users leaving their daily workflows.

This release unifies the path from development in Azure AI Foundry or Copilot Studio all the way to governed, discoverable experiences in the Microsoft 365 ecosystem. It pairs naturally with recent Foundry advancements such as the GA of GPT-5.6 models and Claude in Microsoft Foundry.

## What Custom Engine Agents Deliver

Custom Engine Agents differ from declarative agents in a fundamental way. Declarative agents rely on Copilot's built-in models and orchestration with declared instructions, actions, and knowledge sources. Custom Engine Agents give developers full control:

- **Custom orchestration**: Define workflows, connect external systems, implement complex planning loops, and invoke actions programmatically.
- **Flexible AI models**: Use any foundation model, fine-tuned model, or domain-specific AI—including GPT-5.6 variants and Claude models hosted in Foundry.
- **Proactive automation**: Trigger workflows based on events, take actions across enterprise apps, and support asynchronous patterns where agents continue working in the background.

The result is agents that feel native in Copilot while executing sophisticated logic powered by the best tools for the job.

## Development Paths

Developers have multiple supported routes, all leading to the same Agent Store experience in Microsoft 365.

### Low-Code with Copilot Studio
Copilot Studio provides a managed SaaS environment for building custom engine agents. It includes:
- New agent experience with enhanced GitHub Copilot harness for better orchestration and reasoning.
- Microsoft IQ for grounding in organizational data (emails, files, Teams messages, calendar).
- Foundry IQ integration to connect to knowledge bases tuned in Azure AI Foundry.
- Skills for modular, reusable instruction sets.
- Memory for persistent user context.
- Support for models such as Claude Sonnet 5 and GPT-5.5 Chat (GA), with additional options including GPT-5 models in preview.

This path excels for rapid iteration while maintaining enterprise compliance through Power Platform governance.

### Pro-Code with Microsoft 365 Agents Toolkit and SDKs
For full customization, use the Microsoft 365 Agents Toolkit in Visual Studio or VS Code. The toolkit provides scaffolding, debugging, testing, and deployment.

Two primary SDK options:
- **Microsoft 365 Agents SDK**: Full-stack, multi-channel agents. Supports bring-your-own orchestrators (Semantic Kernel, LangChain, etc.) and any AI model or service. Ideal for ISVs and complex, cross-platform scenarios.
- **Teams SDK**: Tailored for collaborative scenarios in Teams channels and meetings, with built-in action planner.

### Direct Integration from Microsoft Foundry
Azure AI Foundry agents (built with Agent Framework) can reach Microsoft 365 in two ways:
1. Publish directly from the Foundry portal — automatically provisions Azure Bot Service and Entra ID, packages for distribution.
2. Integrate via Agents Toolkit proxy app for advanced customization, SSO, debugging, and multi-environment control.

Both approaches surface the Foundry agent through a bot or proxy layer so users interact with it inside Copilot and Teams.

**Comparison of approaches:**

| Approach          | Orchestrator                  | Models                          | Best For                          | Publishing Scope          |
|-------------------|-------------------------------|---------------------------------|-----------------------------------|---------------------------|
| Copilot Studio   | Enhanced GitHub Copilot harness | Claude, GPT-5.x, others        | Rapid enterprise agents          | My organization          |
| Agents SDK       | Bring your own (SK, LangChain) | Any                             | Highly tailored, multi-channel   | Org / ISV / Store        |
| Teams SDK        | Teams AI Action Planner      | Azure/OpenAI + custom          | Collaborative team scenarios     | Org / ISV / Store        |
| Foundry (direct) | Agent Framework / custom     | GPT-5.6, Claude, open models   | Existing Foundry production agents | Org / ISV / Store      |

## Publishing and Discovery Flow

Once built and tested:
1. Package the agent using the toolkit or Foundry publish flow.
2. Submit for approval in the organization (or publish to Microsoft Commercial Store for broader reach).
3. Agents appear in the **Agent Store** inside Microsoft 365 Copilot and Teams.
4. Users discover, install, pin, and interact with suggested prompts and welcome messages—all without leaving Copilot.

The experience is designed to feel native: agents greet users, offer contextual suggestions, and support both chat and sidebar interactions.

## Asynchronous Scenario Patterns

A notable addition in this GA is native support for asynchronous patterns. Custom agents can:
- Continue processing long-running tasks in the background.
- Proactively engage users when results are ready.
- Handle scenarios that exceed traditional synchronous timeouts.

This unlocks richer automation such as research compilation, multi-step approvals, or scheduled report generation that notifies users later.

## Enterprise Governance and Security

Custom Engine Agents inherit the same management model as other Copilot agents:
- IT admins control discovery, installation, and usage through the Microsoft 365 admin center.
- Agents respect existing Entra ID, Conditional Access, DLP, and compliance policies.
- Prompts and responses are stored according to Microsoft 365 product terms and can be audited via Content Search and Purview.
- Zero data retention options are available for high-sensitivity workloads when using supported models in Foundry.

## Connecting to the Latest Foundry Capabilities

This release shines when paired with recent Foundry GA features.

**GPT-5.6 series** (Sol, Terra, Luna) is now available across Global Standard, Global Priority, Data Zones, and Provisioned deployments from day one. Pricing examples (USD per million tokens, short context, Standard Global after recent discounts):

| Model            | Input (Standard) | Cached Input | Output (Standard) |
|------------------|------------------|--------------|-------------------|
| GPT-5.6 Sol     | $5.00           | $0.50       | $30.00           |
| GPT-5.6 Terra   | $2.00           | $0.20       | $12.00           |
| GPT-5.6 Luna    | $0.20           | $0.02       | $1.20            |

New APAC Data Zone enables regional data processing for frontier models while keeping data sovereignty.

**Claude in Microsoft Foundry** is GA, providing Messages API access with prompt caching, extended thinking, and tool streaming. Claude powers coding, agentic workflows, and complex reasoning while running on Azure infrastructure with Entra ID, RBAC, and consolidated CCU billing on the Azure bill.

Foundry Agent Service, model router (up to 50% savings), prompt caching, toolboxes for scoped tool access, Agent Optimizer for tuning against custom evaluators, and ROI tracking all apply to agents surfaced through Custom Engine Agents.

## Technical Integration Details

When publishing from Foundry:
- The agent uses Foundry's hosted runtime or your own compute.
- Microsoft 365 Agents Toolkit can create a lightweight proxy that handles authentication (SSO via Entra), manifest packaging, and channel registration.
- Data access for grounding uses Microsoft Graph and the Retrieval API for M365 content (SharePoint, OneDrive, emails) while respecting permissions.
- For external systems, agents continue to use the tools and connectors defined in Foundry (MCP servers, custom APIs, Work IQ, etc.).

Async support means the agent can return an initial acknowledgment and later post follow-up messages or cards via the bot framework.

## Real-World Adoption

Partners are already shipping:
- LexisNexis Protégé for legal research and analysis.
- SAP Joule for enterprise process automation.
- Asana for project and task intelligence.
- Meltwater for media and competitive intelligence.

These agents bring domain-specific logic and data into the exact tools employees use every day.

## How This Fits the Microsoft AI Stack

Custom Engine Agents sit at the intersection of:
- **Azure AI Foundry** (models, Agent Service, IQ, Toolboxes, Optimizer, observability)
- **Copilot Studio** (low-code authoring, skills, memory, voice)
- **Microsoft 365 platform** (Copilot Chat as the interface, Teams as collaboration surface, Graph for context, Entra + Purview for governance)
- **Developer tooling** (Agents Toolkit, VS Code, GitHub Copilot for authoring assistance)

It completes the loop from "build powerful agents" to "make them available where people already work."

## What to Do This Week

1. **Explore the docs**: Start with the [Custom Engine Agents overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-custom-engine-agent) and the [Bring Your Own Agents announcement](https://devblogs.microsoft.com/microsoft365dev/bring-your-own-agents-into-microsoft-365-copilot).
2. **Install the Toolkit**: Add Microsoft 365 Agents Toolkit to VS Code or Visual Studio.
3. **Publish a test agent from Foundry**: Use the portal publish flow or the Agents Toolkit integration sample. Start with a simple hosted agent and extend it.
4. **Experiment with models**: Deploy a simple agent using GPT-5.6 Luna for cost efficiency or Claude for deeper reasoning. Test model router behavior.
5. **Review governance**: Work with your M365 admin to understand Agent Store approval workflows and data policies. Test SSO and permission scoping.
6. **Try async patterns**: Build a multi-step research agent that notifies the user later via Copilot or Teams.

## Troubleshooting Tips

- **Agent not appearing in Store**: Ensure the manifest is correctly packaged and approved in the tenant. Check the Agents Toolkit debug output for registration errors.
- **Permission issues**: Verify the Entra app registration has the required Microsoft Graph delegated permissions and that the user has consented.
- **Model routing not working**: Confirm the model is deployed in the target Foundry region and that the router configuration references the correct deployment names.
- **Grounding failures**: Use the Retrieval API explicitly or ensure Work IQ / Microsoft IQ connectors are configured when using M365 data.

## Sources

- [Bring your own agents into Microsoft 365 Copilot](https://devblogs.microsoft.com/microsoft365dev/bring-your-own-agents-into-microsoft-365-copilot) (Microsoft 365 Developer Blog)
- [Custom Engine Agents for Microsoft 365 overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-custom-engine-agent) (Microsoft Learn)
- [GPT-5.6 now available in Microsoft Foundry](https://azure.microsoft.com/en-us/blog/gpt-5-6-now-available-in-microsoft-foundry/) (Azure Blog)
- [Claude in Microsoft Foundry is now generally available](https://azure.microsoft.com/en-us/blog/claude-in-microsoft-foundry-is-now-generally-available/) (Azure Blog)
- [What's new in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new) (Microsoft Learn)
- [Microsoft 365 Agents Toolkit](https://aka.ms/M365AgentsToolkit) and Marketplace listing
- [Extend Microsoft 365 Copilot documentation](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/)
- [Publish your Foundry agent to Microsoft 365](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/publish-copilot)

Custom Engine Agents close a critical gap: powerful, custom AI that lives where work happens. With Foundry providing the production platform and Copilot providing the interface, Microsoft customers now have a cohesive path from prototype to governed, daily-use agent.

---

*This post is part of the ongoing Microsoft AI research series on The Clearinghouse Log. All information drawn from official Microsoft sources as of 2026-08-09. Focus remains on positive, actionable capabilities within the Microsoft ecosystem.*