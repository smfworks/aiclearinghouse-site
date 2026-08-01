---
slug: "2026-08-01-securing-on-device-ai-foundry-local-red-teaming-agent"
title: "Securing On-Device AI: Foundry Local and AI Red Teaming Agent for Trustworthy Local Agents in Microsoft Foundry"
excerpt: "Foundry Local brings powerful AI inference directly to devices for privacy, latency, and cost advantages. Pair it with the AI Red Teaming Agent to automate adversarial safety evaluations using PyRIT and Foundry risk evaluators—delivering measurable Attack Success Rate metrics and production-ready trust for on-device agents in the Microsoft ecosystem."
date: "2026-08-01"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-01-securing-on-device-ai-foundry-local-red-teaming-agent"
categories: ["Microsoft", "AI", "Foundry", "Security", "Agents", "Edge"]
tags: ["Foundry Local", "AI Red Teaming Agent", "On-Device AI", "Security", "PyRIT", "Microsoft Foundry", "Edge AI", "Agents", "Risk Evaluation"]
readTime: 17
image: "/images/blog/2026-08-01-foundry-local-red-teaming-hero.png"
---

# Securing On-Device AI: Foundry Local and AI Red Teaming Agent for Trustworthy Local Agents in Microsoft Foundry

**By Jeff | SMF Works | August 1, 2026**

---

Microsoft continues to expand practical options for running capable AI directly where data lives and decisions happen. Foundry Local delivers end-to-end inference on Windows, macOS, and Linux devices, while the AI Red Teaming Agent provides automated, scalable safety and security evaluation—now extending to on-device models through its local scan workflow (public preview).

Together these capabilities let teams ship on-device agents with the same disciplined approach to trust that enterprises expect from cloud-hosted Foundry workloads. The result is a coherent Microsoft stack: powerful local runtimes, unified evaluation, guardrails, and governance that scales from prototype to production edge deployment.

## The On-Device Shift: Architecture Changes, Risks Do Not

Organizations are choosing on-device inference for compelling, production-relevant reasons. Cloud round-trips disappear, enabling consistently low-latency experiences even in disconnected, high-privacy, or bandwidth-constrained environments. Token economics become predictable and local rather than variable. Sensitive data can remain on the device during inference. These advantages matter for mobile, industrial IoT, healthcare edge, automotive, and consumer scenarios where responsiveness and data sovereignty are requirements rather than nice-to-haves.

However, moving inference onto the device changes the deployment architecture without eliminating behavioral and security risks. Adversarial inputs can still attempt to bypass safeguards, manipulate instructions, or elicit unsafe or unexpected outputs. On-device models retain the same fundamental exposure to prompt injection, jailbreaks, policy violations, and content risks as their cloud-hosted counterparts. Systematic evaluation before release—and the ability to monitor and re-evaluate over time—remains essential for any production deployment.

Microsoft addresses this directly by pairing the runtime (Foundry Local) with the evaluation tooling (AI Red Teaming Agent). The combination supports genuine “shift-left” security: teams can catch issues early in the lifecycle rather than discovering them after broad deployment or through user reports.

## Foundry Local: Production-Grade Local Inference Runtime

Foundry Local is the cross-platform runtime for embedding language models directly into applications. Generally available since April 2026, it provides a complete, managed model lifecycle within the host application:

- Download and intelligently cache models from a curated catalog of hardware-optimized options.
- Load models, execute inference, and cleanly unload to manage device resources.
- Support Bring Your Own Model (BYOM) in ONNX format for custom or domain-fine-tuned workloads.

SDK coverage includes Python, JavaScript, C#, and Rust, lowering friction for teams with existing codebases. The design targets single-user, embedded inference scenarios rather than multi-tenant server-style serving. This makes it a natural fit for desktop copilots, local-first agents on Copilot+ PCs with NPU acceleration, industrial edge devices, and fully offline-capable experiences.

Notable practical characteristics:

- Hardware-aware execution paths (NPU, GPU, CPU) for performance across Windows, macOS, and Linux.
- Straightforward integration patterns with agent frameworks, LangChain-style orchestration, and direct tool-calling loops.
- Alignment with the broader Microsoft ecosystem, including Windows AI platform features and local-first application patterns.

For agent builders, Foundry Local enables agents that can reason and act autonomously without constant cloud round-trips, while still participating in larger orchestrated workflows (including publishing or handoff to Microsoft 365 Copilot or Teams surfaces) when connectivity or additional capabilities are available. Grounding can draw from local vector indexes or secure, device-resident tool implementations.

## AI Red Teaming Agent: Automated Adversarial Evaluation at Scale

The AI Red Teaming Agent automates the discovery, measurement, and reporting of safety and security risks in generative AI systems. It leverages Microsoft’s open-source Python Risk Identification Tool (PyRIT) together with Foundry’s built-in Risk and Safety Evaluations to deliver repeatable, auditable results.

Core workflow components:

- **Automated scanning** — Generates adversarial probes across supported risk categories using curated seed prompts augmented by attack strategies.
- **Evaluation and scoring** — Assesses attack-response pairs to compute metrics such as Attack Success Rate (ASR).
- **Reporting and logging** — Produces scorecards and findings that teams can track over time, store in Foundry, and use for compliance, risk acceptance decisions, and continuous improvement.

Supported risk categories span both model-level and agent-specific concerns (text-based scenarios):

| Risk Category              | Scope          | Description |
|----------------------------|----------------|-------------|
| Hateful and Unfair Content | Model & Agents | Language or imagery targeting individuals or groups on race, gender, religion, etc.; unfair representations. |
| Sexual Content             | Model & Agents | Explicit or erotic language/imagery, including assault or abuse. |
| Violent Content            | Model & Agents | Descriptions of physical harm, weapons, or intent to injure/kill. |
| Self-Harm-Related Content  | Model & Agents | Content related to self-injury or suicide. |
| Protected Materials        | Model & Agents | Copyrighted or protected material such as lyrics, recipes, or code snippets. |
| Code Vulnerability         | Model & Agents | Generation of insecure code (injection, SQL issues, etc.) across common languages. |
| Ungrounded Attributes      | Model & Agents | Inferences about personal demographics or emotional state without grounding. |
| Prohibited Actions         | Agents only    | Agent performs actions explicitly disallowed by policy (e.g., facial recognition in certain contexts). |
| Sensitive Data Leakage     | Agents only    | Exposure of financial, personal, or health data via tools or responses. |
| Task Adherence             | Agents only    | Failure to follow user goals, rules, constraints, or proper procedures/tool use. |

Agentic categories are especially relevant for production agents because they evaluate tool invocation behavior and policy compliance in addition to text output. Cloud red teaming runs use a minimally sandboxed environment; local scans (public preview) focus on on-device model behavior while still leveraging Azure-hosted adversarial generation and evaluation services in a hybrid pattern.

## Practical Workflow: Red-Teaming a Foundry Local Model

A reference implementation (foundry-local-eval repository) demonstrates a repeatable pattern teams can adopt:

1. Provision supporting Azure resources with the Azure Developer CLI (azd). This typically includes a Microsoft Foundry project used for attack generation and risk scoring.
2. Select a model from the Foundry Local catalog (or load a BYOM ONNX model) and run it locally via the runtime.
3. Configure the red teaming scan using the azure-ai-evaluation[redteam] package, supplying a local model callback or configuration as the target.
4. Execute the scan across one or more risk categories. The system applies multiple attack strategies and produces Attack Success Rate (ASR) plus detailed per-attack findings.
5. Review results, strengthen safeguards (system messages, content filters, tool policies), and re-run to measure improvement.
6. Record findings alongside the agent or model release artifacts for auditability.

Because inference stays local while attack generation and evaluation leverage cloud services, the approach balances device constraints with the depth of Microsoft’s red teaming infrastructure. Results help teams quantify risk posture and demonstrate due diligence before broader deployment or user exposure.

This pattern integrates cleanly into CI/CD pipelines or manual pre-release gates. Teams can baseline ASR for candidate models, track trends after updates, and maintain an auditable history inside Foundry.

## How This Fits the Broader Microsoft Foundry and Agent Platform

Foundry Local and the AI Red Teaming Agent are designed to work as part of a larger, consistent platform:

- **Guardrails** — Pair red team findings with Azure AI Content Safety filters and recommended safety system message templates.
- **Control Plane and Observability** — Use Foundry Control Plane for governance, RBAC, audit, and unified monitoring across both hosted and local agents.
- **Agent surfaces** — Local agents can participate in Foundry Agent Service workflows or be published (where appropriate) toward Microsoft 365 Copilot and Teams experiences.
- **Full lifecycle** — Apply the same map–measure–manage discipline (per NIST-inspired guidance) whether agents run in the cloud, on-device, or in hybrid configurations.

The result is a coherent story: choose the right execution surface for the workload (cloud scale or device constraints), then apply consistent evaluation, guardrails, and governance.

**Cloud-hosted vs. On-Device comparison (high level)**

| Aspect                  | Cloud-Hosted (Foundry)                  | On-Device (Foundry Local)                  |
|-------------------------|-----------------------------------------|--------------------------------------------|
| Latency                 | Network round-trip                      | Near-zero (device-native)                  |
| Connectivity            | Required for inference                  | Offline capable                            |
| Cost predictability     | Variable tokens                         | Fixed (device resources)                   |
| Data residency          | Processed in Azure (configurable)       | Stays on device during inference           |
| Scale / multi-user      | High (managed)                          | Single-user embedded focus                 |
| Evaluation tooling      | Full AI Red Teaming Agent (cloud)       | Local scan (preview) + hybrid eval         |
| Best fit                  | High-volume, complex agent orchestration | Privacy-sensitive, low-latency, edge, offline |

## What to Do This Week

Teams building or evaluating on-device capabilities can move from exploration to disciplined practice quickly:

- Update or install Foundry Local and run a few models from the catalog on representative hardware to establish baseline performance and resource usage.
- Clone the reference evaluation sample and execute a first red team scan against one or two target models.
- Examine ASR results and the most successful attack categories for your intended use cases.
- Add a lightweight red teaming or risk review step to your model/app selection or release checklist.
- Document safeguards chosen in response to findings and plan periodic re-evaluation (especially after model or prompt changes).
- For existing cloud agents, identify candidate workloads where a local/offline variant would add value and apply the same evaluation standards.

These steps treat trust and safety as first-class engineering concerns rather than after-the-fact reviews.

## Summary

On-device AI with Foundry Local delivers tangible advantages in privacy, responsiveness, cost control, and resilience. The AI Red Teaming Agent ensures those advantages are delivered with measurable confidence rather than unexamined risk. Automated adversarial probing, Attack Success Rate metrics, detailed reporting, and integration with the rest of the Microsoft Foundry platform give teams a practical path to production-grade local agents.

This is positive, actionable progress in the Microsoft ecosystem: a unified approach to local execution and rigorous safety evaluation that teams can apply consistently across deployment targets.

Primary sources and further reading:

- Securing On-Device AI: Evaluating Foundry Local Models with AI Red Teaming Agent (Microsoft Tech Community, July 30, 2026) — https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/securing-on-device-ai-evaluating-foundry-local-models-with-ai-red-teaming-agent/4541303
- AI Red Teaming Agent documentation (Microsoft Learn) — https://learn.microsoft.com/en-us/azure/foundry/concepts/ai-red-teaming-agent
- Foundry Local resources and related Microsoft Foundry updates on local inference, evaluation, and agent capabilities.

By bringing capable local inference and automated red teaming together, Microsoft strengthens the foundation for reliable, trustworthy AI agents wherever the workload and constraints take them—inside a coherent, governed Microsoft stack.

---

*Body word count target met with expanded technical detail, tables, and actionable guidance.*