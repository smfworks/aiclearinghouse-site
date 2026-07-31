---
slug: "2026-07-31-fabric-july-2026-ai-functions-plan-ga"
title: "Fabric July 2026: AI Functions with gpt-5-mini, Plan GA, and Production-Ready Data for Microsoft AI Agents"
excerpt: "The July 2026 Microsoft Fabric update delivers generally available AI Functions powered by gpt-5-mini, Plan in Fabric IQ GA, Spark runtime enhancements, and expanded Real-Time Intelligence. These capabilities strengthen the data layer that grounds reliable agents across Microsoft Foundry, Copilot Studio, and enterprise workflows."
date: "2026-07-31"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-31-fabric-july-2026-ai-functions-plan-ga"
categories: ["Microsoft", "AI", "Data", "Fabric", "Agents"]
tags: ["Fabric", "AI Functions", "gpt-5", "Plan", "Real-Time Intelligence", "Foundry", "Copilot", "Data Engineering"]
readTime: 16
image: "/images/blog/2026-07-31-fabric-july-2026-ai-hero.png"
---

Microsoft Fabric continues to evolve as the unified data and analytics platform that powers modern AI initiatives. The July 2026 feature summary introduces several generally available and preview capabilities that directly support the needs of AI agents and enterprise data teams working within the Microsoft ecosystem.

This update focuses on making AI more accessible inside data workloads, improving governance and deployment workflows, and extending real-time capabilities that agents can consume for timely decisions. For developers building with Microsoft Foundry Agent Service, Copilot Studio, or custom agents, these changes provide richer grounding data, more efficient pipelines, and production-ready tools without leaving the Microsoft stack.

## AI Functions: Bringing LLMs Directly into Data Workloads (Generally Available)

One of the standout releases is the general availability of AI Functions. These built-in capabilities let users apply large language model intelligence to data transformations across pandas, PySpark, Data Warehouse, and Dataflows Gen2 — all without managing external API keys or complex package dependencies in many scenarios.

Key details from the release:

- **Default model**: gpt-5-mini with “low” reasoning enabled for broad accessibility and cost efficiency.
- **Advanced option**: gpt-5.1 for more sophisticated transformations that benefit from higher reasoning effort.
- **No hard openai package dependency** for pandas AI Functions in many cases, simplifying environments.
- **Better observability**: usage statistics now include reasoning token counts, helping teams monitor and optimize costs.
- **Migration note**: Pipelines previously pinned to gpt-4.1 series have been migrated appropriately (gpt-4.1 to gpt-5.1; gpt-4.1-mini to gpt-5-mini). The older series is retired.

**Practical use cases for agents and analytics teams**:

- Classify or categorize millions of records (customer feedback, support tickets, product reviews) at scale.
- Perform sentiment analysis, entity extraction, summarization, or translation directly in notebooks or pipelines.
- Power agentic data preparation where an agent in Foundry or Copilot triggers a Fabric notebook or dataflow that applies AI functions to prepare context before reasoning.

These functions turn Fabric into a first-class data preparation surface for agents. Instead of an agent pulling raw data and doing lightweight transformations locally, it can delegate heavy lifting to governed, scalable Fabric compute with AI baked in.

Teams already using Fabric for lakehouse or warehouse workloads gain immediate leverage. An agent can now request “summarize recent sales objections from the last quarter” and have the underlying data pipeline enriched with AI-derived fields before the agent even reasons over the result.

## Plan in Fabric IQ — Generally Available

Plan in Fabric IQ is now generally available as a unified, no-code platform for collaborative planning, reporting, analytics, data integration, and management. It brings enterprise planning capabilities directly into the Fabric experience alongside familiar analytics and AI tools.

**Why this matters in the agent era**:

- Agents need reliable, structured planning data and forecasts to act autonomously or assist humans.
- Plan provides governed planning surfaces that integrate with OneLake, Power BI, and other Fabric experiences.
- Teams can move from fragmented Excel-based or siloed planning tools to a single platform with AI-assisted insights and agent access patterns.

This release reduces friction for organizations that want agents to participate in or support planning cycles — from sales forecasting to supply chain optimization — while keeping data in the Microsoft governed environment.

## Spark and Data Engineering Enhancements for Production AI

Data engineering remains foundational for reliable agents. The July update strengthens Spark workloads and lakehouse operations:

- **Microsoft Fabric Runtime 2.0 (Preview)** and release channels for more predictable upgrades.
- **Spark Diagnostic Emitter** with Spark 4.1 runtime support and new log ingestion API.
- **Fabric Spark Operations Skill (Preview, open source)**: AI-assisted diagnostics for failed notebooks, Spark jobs, and performance issues. Integrates with tools like GitHub Copilot CLI, VS Code, and other AI coding surfaces.
- Performance and governance: Faster Python/Scala UDFs and complex data types; efficient scaledown with remote shuffle manager (Preview); customer-managed key (CMK) encryption for Spark shuffle data on disk (GA).
- **Lakehouse Query Explorer (GA)**: Instant querying of data.
- Materialized lake views: Analytics and insights GA, plus event-driven refresh (Preview).

These improvements make it easier to build, debug, and secure the data pipelines that feed agents. The open-source Spark Operations Skill is particularly noteworthy — it brings AI-assisted troubleshooting directly to the data engineering layer that supports AI applications.

## Real-Time Intelligence Updates

Agents increasingly need to act on fresh signals. July brings several Real-Time Intelligence enhancements:

- Improved tile error experience in Real-Time Dashboards (GA).
- Folders in Eventhouse tree (GA) for better organization.
- Eventstream improvements: private network support (GA), Azure Event Hubs source with workspace identity auth (Preview), custom CA and mTLS (GA), Oracle CDC connector (Preview).
- Eventhouse update policies now support accelerated shortcuts; shortcut tables automatically synchronize schema changes.
- Investigator Insights in Operations Agent (Preview), enhanced Anomaly Detector configurations, Fabric Maps Tilesets for geospatial data (GA), and cross-domain intelligence with Azure Monitor (Preview).

These features enable event-driven architectures where agents can subscribe to or query real-time streams and anomaly signals from within the Microsoft platform.

## How This Fits the Broader Microsoft AI Stack

Fabric does not stand alone. The July updates strengthen integration points with:

- **Microsoft Foundry**: Richer data grounding for hosted agents and agent frameworks via OneLake, AI Functions, and IQ layers.
- **Microsoft 365 Copilot and Copilot Studio**: Better data pipelines and planning surfaces that agents can leverage when operating inside productivity workflows.
- **Work IQ / Fabric IQ**: Structured intelligence and planning data that agents consume for context about how work happens and what plans exist.
- **Governance and security**: Features like CMK encryption, contributor-level Git controls, and OneLake catalog recommendations align with enterprise requirements for agentic systems.

By improving the data and analytics foundation, Microsoft makes it more practical for organizations to move agents from prototypes to production with consistent identity, security, observability, and data quality across the stack.

## What to Try This Week

1. **Experiment with AI Functions** in a PySpark or pandas notebook. Start with classification or summarization on a sample dataset using the default gpt-5-mini. Monitor reasoning token usage.
2. **Explore Plan in Fabric IQ** if your team does forecasting or collaborative planning. Connect it to existing lakehouse or warehouse data.
3. **Enable the Spark Operations Skill** (Preview) and test it against a failing job or notebook to see AI-assisted diagnostics in action.
4. **Review your Eventstream and Real-Time setups** for opportunities to add private networking or new connectors for fresher agent context.
5. **Audit recent pipelines** for gpt-4.1 pins and confirm migrations to the new defaults.

These steps help teams immediately benefit from the update while preparing data surfaces that future agents (in Foundry or Copilot) can reliably use.

## Summary

The July 2026 Fabric release emphasizes production readiness: GA capabilities for AI inside data workloads, planning, and real-time operations, plus tools that make engineering and governance easier. For anyone building or operating AI agents in the Microsoft ecosystem, these changes deliver more capable data foundations, better observability, and tighter integration with the rest of the platform.

Microsoft continues to invest in a cohesive experience where data, analytics, planning, and agentic AI reinforce one another rather than compete for attention. Teams that align their Fabric strategy with Foundry and Copilot initiatives will find it increasingly straightforward to deliver reliable, grounded AI capabilities at scale.

**Primary sources**:
- [Fabric July 2026 Feature Summary](https://community.fabric.microsoft.com/t5/Fabric-Updates-Blog/Fabric-July-2026-Feature-Summary/ba-p/5325823) (Microsoft Fabric Community)
- Microsoft Fabric documentation and Learn resources on AI Functions, Plan, and Real-Time Intelligence.
- Related updates in Microsoft Foundry and security/productivity blogs that reference shared data and agent capabilities.

This post focuses on actionable technical details from the official release for developers and architects working in the Microsoft AI and data stack.
