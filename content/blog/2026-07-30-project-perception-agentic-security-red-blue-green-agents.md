---
slug: "2026-07-30-project-perception-agentic-security-red-blue-green-agents"
title: "Project Perception: Microsoft’s Agentic Security System with Red, Blue, and Green AI Agents and MAI-Cyber-1-Flash"
excerpt: "Microsoft launches Project Perception, a new agentic security system that deploys coordinated red, blue, and green AI agents to continuously perceive risk, investigate threats, and remediate defenses at machine speed — all with humans in control. Powered in part by the new MAI-Cyber-1-Flash cyber model inside MDASH, entering public preview on August 3."
date: "2026-07-30"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-30-project-perception-agentic-security-red-blue-green-agents"
categories: ["Microsoft", "AI Security", "Agents", "Cybersecurity", "Microsoft Defender"]
tags: ["Project Perception", "MAI-Cyber-1-Flash", "Red Blue Green Agents", "Agentic Security", "MDASH", "CyberGym", "Microsoft Security", "multi-agent", "cyber model"]
readTime: 15
image: "/images/blog/2026-07-30-project-perception-hero.png"
---

# Project Perception: Microsoft’s Agentic Security System with Red, Blue, and Green AI Agents and MAI-Cyber-1-Flash

**By Jeff | SMF Works | July 30, 2026**

---

## Security at the speed of agents

AI has changed the economics and speed of both attack and defense. Attackers can generate exploits, scale campaigns, and adapt tactics faster than traditional processes can respond. At the same time, defenders face exploding volumes of signals across identities, endpoints, clouds, applications, and now AI systems themselves.

On July 27, 2026, Microsoft announced **Project Perception**, a new agentic security system designed to close that gap. It brings together signals, organizational context, purpose-built models, and three classes of specialized agents — red, blue, and green — into a continuously learning defense loop. The system enters public preview on August 3 and integrates initially with Microsoft Defender.

This is not another alert-generation tool. It is an autonomous workforce that perceives risk across the estate, reasons over context to determine what matters, and takes corrective action — while keeping humans firmly in control of strategy and high-impact decisions.

---

## The red / blue / green agent model

Project Perception organizes defense into three coordinated roles that mirror classic security team functions but operate continuously and at machine scale:

- **Red agents** act offensively to discover vulnerabilities and attack paths before adversaries do. They probe the environment, map potential compromise routes, and simulate offensive techniques using the same signals and context available to defenders.

- **Blue agents** investigate findings, reason over organizational context, and prioritize what represents meaningful risk. They triage, correlate with past incidents and policies, and determine the real impact instead of flooding teams with raw alerts.

- **Green agents** take corrective actions and strengthen defenses. They generate patches, apply configurations, update policies, and close gaps — turning findings into remediations without requiring a hand-off at every step.

These agents share intelligence through orchestrated workflows. A red-team discovery can flow directly to blue assessment and then to green remediation in a closed loop. The harness coordinates models, agents, and actuators so the system learns and improves over time.

Microsoft emphasizes that strategy, objectives, and critical decisions remain human-driven. Enterprise governance, Responsible AI principles, role-based controls, auditability, and sandboxing are built in from the start.

---

## MAI-Cyber-1-Flash: a purpose-built cyber model

A key enabler is **MAI-Cyber-1-Flash**, Microsoft’s first in-house cybersecurity-specialized model, announced alongside Perception and integrated into MDASH (Microsoft’s multi-agent vulnerability identification and remediation harness).

Key performance numbers from the announcement:

- Achieves **96% on CyberGym** (the industry benchmark for automated vulnerability reasoning over large codebases), +12 points above Mythos.
- Handles up to 90% of tasks efficiently, reserving larger frontier models (such as GPT-5.4 configurations) for the hardest 10%.
- Delivers approximately **50% cost savings** compared to previous best-in-class MDASH configurations while improving accuracy.

MAI-Cyber-1-Flash is a compact, code-heavy model (described as a 137B total / 5B active sparse MoE fine-tune in some coverage) derived from the MAI-Thinking-1 lineage. It was trained on high-quality internal security data and hardened with expert input.

The model does not ship as a standalone endpoint. It runs inside MDASH and, going forward, powers more workflows in Project Perception beyond initial vulnerability management.

This multi-model approach — specialized efficient models for the bulk of work, frontier models for edge cases — is a practical pattern for always-on security economics.

Sources: Microsoft AI announcement on MAI-Cyber-1-Flash inside MDASH; official Project Perception blog and product pages (July 27–30, 2026).

---

## Security context and the full cyber stack

Effective agentic defense requires more than raw signals or a powerful model. Project Perception builds on:

- **Full-estate signals and sensors**: visibility across identities, endpoints, applications, data, clouds, and AI systems.
- **Security context**: continuously enriched representation of assets, identities, relationships, risks, and activities that gives agents token-efficient understanding instead of forcing them to reconstruct everything from scratch.
- **Harness / orchestration**: the coordination layer that routes work across agents and models, applies guardrails, and supports testing and human oversight.
- **Actuators**: the mechanisms that turn agent decisions into real actions across Microsoft Security products (Defender, Sentinel, Intune, etc.).
- **Multi-model routing**: choosing the right model for the task based on quality, latency, and cost.

The result is a system that can reason at scale while remaining auditable and controllable.

Project Perception is described as complementary to Microsoft Security Copilot: Copilot is the generative AI-assisted chat interface (AI that assists); Perception is the agentic system that acts (AI that acts). They work together.

---

## Integration with Microsoft Defender and the broader ecosystem

At launch, the multi-agent coordinated defense surfaces directly inside Microsoft Defender. Red, blue, and green capabilities extend the existing Defender runtime protections and threat detection.

Over time, Perception will extend across Microsoft Security products. It also ties into the larger Microsoft AI and agent story:

- Agents governed through Agent 365 can benefit from the same continuous defense posture.
- Vulnerability findings from MDASH feed the Perception loop.
- The same organizational context and governance patterns that apply to Foundry agents and Copilot Studio agents apply here.

For organizations already invested in Microsoft 365 Copilot, Fabric, and Foundry, Project Perception provides the security operating model that keeps agentic workloads protected without requiring a separate stack.

---

## Practical architecture and operating model

High-level flow:

**Signals & context → Red/Blue/Green agents (orchestrated via harness + multi-model) → Actuators → Strengthened posture + feedback loop**

- Human teams define policies, objectives, and escalation rules.
- Agents operate continuously within those guardrails.
- Every significant action remains traceable, replayable, and subject to human sign-off where required.
- Telemetry and outcomes feed back into context and model improvement.

Private networking, data residency, encryption, tenant isolation, and audit logging follow Microsoft enterprise standards.

Consumption-based pricing is used (measured in Security Compute Units or SCUs), reflecting actual agent work performed rather than flat licensing.

---

## Getting started and what to watch

The public preview begins August 3, 2026, initially inside Microsoft Defender.

For teams preparing:

1. Review the announcement and product documentation for current capabilities and regional availability.
2. Assess current vulnerability management and SOC workflows that could benefit from continuous red/blue/green automation.
3. Plan integration points with existing Microsoft Security tooling (Defender, Sentinel, Intune).
4. Define human oversight boundaries and escalation paths early.
5. Monitor for expanded support for additional Microsoft Security products and more Perception-powered workflows using MAI-Cyber-1-Flash.

Microsoft positions this as part of a broader “cyber stack built for agentic security” — signals, context, models, harness, agents, and actuators working as one system.

---

## Sourced facts and references

1. **Project Perception announcement (July 27, 2026)**: New agentic security system with red, blue, and green agents; public preview August 3; integration with Microsoft Defender; multi-model architecture; context layer; actuators across security products. Primary source: [The Official Microsoft Blog – Rethinking security for the age of AI](https://blogs.microsoft.com/blog/2026/07/27/rethinking-security-for-the-age-of-ai/). Product page: [Project Perception | Microsoft Security](https://www.microsoft.com/en-us/security/business/ai-powered-cybersecurity/project-perception-agentic-system).

2. **MAI-Cyber-1-Flash and MDASH performance (July 27–30, 2026)**: 96% on CyberGym (+12 pt above Mythos); ~50% cost savings; handles up to 90% of tasks; MAI-Cyber-1-Flash powers MDASH and extends to Perception workflows. Sources: [Microsoft AI – Introducing MAI-Cyber-1-Flash inside MDASH](https://microsoft.ai/news/introducing-mai-cyber-1-flash-inside-mdash/); model card and related coverage.

3. **Agent roles and closed-loop operation**: Red agents discover attack paths, blue agents investigate and prioritize, green agents remediate and harden. Shared context and orchestration. Human control emphasized. Sources: official blog, product page, and launch event references.

4. **Complementary to existing Microsoft Security offerings**: Distinction from Security Copilot (assists vs. acts); ties to Defender runtime, Agent 365, and broader ecosystem. Sources: Microsoft documentation and announcements.

Additional reading:
- Official blog post and product pages linked above.
- Microsoft AI technical materials on MAI models and MDASH.

---

## What to do this week

- Read the July 27 blog post and explore the Project Perception product page.
- Inventory current vulnerability scanning, SOC triage, and remediation processes that could move from periodic/manual to continuous agentic.
- If in preview or early access, provision a test environment in Microsoft Defender and observe red/blue/green agent behavior on sample workloads.
- Define or update your organization’s policies for human oversight and escalation in agentic security systems.
- Track integration announcements as Perception expands beyond initial Defender surface.

This release represents Microsoft’s concrete step toward production-grade agentic defense that matches the speed and scale of modern threats while preserving enterprise controls and human accountability.

---

**Live URL (after publish):** https://www.smfclearinghouse.com/blog/2026-07-30-project-perception-agentic-security-red-blue-green-agents/

**Sources:** Primary Microsoft sources — The Official Microsoft Blog, Microsoft Security product pages, Microsoft AI announcements (July 2026). All technical claims trace directly to the linked Microsoft documentation and posts.
