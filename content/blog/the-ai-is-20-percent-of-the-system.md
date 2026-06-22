---
slug: "the-ai-is-20-percent-of-the-system"
title: "The AI Is 20% of the System: What Composable Martech Actually Looks Like"
excerpt: "Everyone is obsessed with the LLM. But in production AI marketing, the model call is only 20% of the engineering work. The other 80% is what separates demos from deployed systems — and most teams are building the wrong 80%."
date: "2026-06-09"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI Marketing", "Technical Architecture", "Martech"]
tags: []
readTime: 14
image: "/images/blog/ai-20-percent-system-hero.png"
originalUrl: "https://smfworks.com/blog/the-ai-is-20-percent-of-the-system"
canonicalUrl: "https://www.smfclearinghouse.com/blog/the-ai-is-20-percent-of-the-system"
---
# The AI Is 20% of the System

*What production AI marketing infrastructure actually looks like — and why most teams are building the wrong 80%.*

---

## The Wrong Question

Spend an hour in AI marketing Twitter and you'll see the same obsession: Which model? GPT-4o? Claude? Gemini? The new thing from DeepSeek?

This is the wrong question.

I spent five days buried in production architecture docs from Cogny, The Pedowitz Group, Braze, Klaviyo, Salesforce, and half a dozen AI marketing startups. One pattern emerged everywhere: **The LLM call is about 20% of the system.** The other 80% is orchestration, data plumbing, guardrails, observability, and cost control — the infrastructure that makes the AI useful instead of merely available.

If you're obsessing over model choice while your context assembly is broken, you're tuning the engine while the car has no wheels.

---

## What the 20% Actually Is

The AI layer — the LLM inference call — handles:
- Natural language understanding and generation
- Reasoning over provided context
- Tool selection and structured output

This is genuinely hard. It requires prompt engineering, few-shot examples, output schema enforcement, and careful model selection for cost-quality tradeoffs.

But it's also the part everyone is already building. Every marketing team with an OpenAI API key has this layer. The hard part isn't getting an LLM to write copy. The hard part is everything that happens before and after that call.

---

## What the 80% Actually Is

### 1. Context Assembly: The Hidden Tax

Cogny's production architecture reveals that their AI orchestration layer spends more engineering effort on **context assembly** than on the LLM call itself.

What this means in practice:
- **Summarizing old messages** to stay under token limits
- **Pruning irrelevant schema tables** from the database context
- **Trimming few-shot examples** to the minimum viable set
- **Validating queries** before execution (SQL injection for AI marketing)
- **Estimating costs** before calling the model (Cogny runs cost estimation as a pre-call gate)

This is not "prompt engineering." This is production data engineering. The context that reaches the LLM is the output of a pipeline — not a string you type into ChatGPT.

Cogny's progressive context pruning strategy is representative: start with full context, then strategically reduce. Summarize old messages first (preserves narrative thread, removes detail), then prune schema tables (removes data the user hasn't asked about), then trim few-shot examples. Each reduction step is deterministic, not heuristic. The goal is maximum signal per token, not maximum context size.

**The lesson:** Context assembly is not a configuration problem. It's an engineering discipline that requires explicit pipeline design, cost estimation, and fallback behavior when context exceeds budget.

---

### 2. The Five-Layer Stack: What You're Actually Building

The Pedowitz Group's reference architecture for marketing AI agents defines a five-layer production stack. If you're building AI marketing infrastructure, you're building all five — whether you know it or not.

**Layer 1: Data & Identity**
This is the foundation most teams skip. It means shared IDs, field dictionaries, stage definitions, and consent records that are consistent across CRM, MAP, CDP, and data warehouse. Without this, an AI agent that "updates a lead score" is updating a field whose meaning differs across systems. The data contract is the foundation. Without it, agent actions can't attribute, can't govern, and can't learn.

**Layer 2: Agent Runtime**
The orchestration engine — LangGraph, CrewAI, or custom — that handles planning, memory, policy enforcement, and tool execution. This is where the "agent" lives. It needs thread-scoped persistence (conversations resume exactly where they left off), checkpointing for error recovery, and typed state management so context doesn't leak between workflows.

**Layer 3: Connectors & Tools**
The bridge between the agent and the real world — CRM APIs, ad platforms, CMS webhooks, email systems. Each connector needs its own error handling, rate limiting, retry logic, and schema mapping. The tool layer is where most production failures happen: an API times out, a webhook fires twice, a schema change breaks the mapping.

**Layer 4: Governance**
Defense in depth, not a single gate. Policy lives in two places: inside the agent runtime (brand voice rules, legal constraints, data handling policies) AND at the tool level (RBAC, approval workflows, budget limits, partition isolation). A governance layer that only checks prompts is like a firewall that only inspects outgoing traffic.

**Layer 5: Observability**
Traces, metrics, logs, and cost tracking. In AI marketing, observability is not a nice-to-have — it's the feedback loop that lets you tune the system. You need to see which agent paths succeed, which fail, which consume excessive tokens, and which generate revenue. Without observability, you're flying blind on the only metric that matters: ROI.

The Pedowitz Group's deployment timeline for this stack: 5–11 weeks from proof-of-concept to pilot. The total timeline is shorter than most teams spend debating model selection because they start with one narrow, high-signal KPI workflow and wire it end-to-end before generalizing.

**The lesson:** Start with the data contract and one workflow, not with the LLM and a vague vision.

---

### 3. The Braze Disruption: Why Decisioning Layers Matter

Ovidiu Susan's analysis of Braze's decisioning stack reframes the "do AI agents kill marketing clouds?" question by identifying three distinct decisioning layers:

**Layer 1: Deterministic Rules**
Canvas flowcharts — "if user did X, send Y." This is what most marketing automation does. It's what generic LLM agents can replace today because rules are just structured language.

**Layer 2: Statistical Optimization**
Intelligent send time, channel selection, frequency capping. Per-user lookup tables that learn from aggregate behavior. Harder to replicate, but still within reach of modern ML.

**Layer 3: Reinforcement Learning Decisioning**
Contextual bandit algorithms that decide per-user, in real-time, the best combination of channel, template, offer, and send time from thousands of possibilities. Braze acquired OfferFit for $325M in June 2025 for this layer. The case studies are step-changes: 45% uplift in customer value, 92% improvement in conversion, 12% uplift in app downloads.

The disruption question resolves in **Net Revenue Retention**. If Braze migrates customers from Layer 1 (rules) to Layer 3 (RL decisioning), it becomes the brain that generic LLM agents can't replace — because it has years of per-user reward-signal data. If it can't, then LLM agents commoditize the rules layer and the marketing cloud becomes plumbing.

**The lesson for builders:** The moat is not the LLM. The moat is the feedback loop — years of per-user, per-action reward signals that let you optimize decisions, not just generate content.

---

### 4. The Perception-Reasoning-Action Loop

Brian James Curry's deep dive on agentic MarTech architecture outlines a production pattern that most demos ignore: the perception-reasoning-action loop.

**Perception:** Kafka event streams, Redis state management, Flink signal processing. Real-time updates to user journeys (last 100 events, 30-day TTL) and campaign metrics aggregated by hour with 7-day retention. The agent doesn't just "know" the user — it continuously updates its model of the user from streaming events.

**Reasoning:** Eight specialized agents, not one monolithic LLM call — Campaign Optimization, Content Generation, Personalization, Attribution, Audience Intelligence, Budget Allocation, Monitoring, and A/B Testing. Each is a separate LangGraph node with typed state. Agent state is a TypedDict with explicit fields: messages, campaign_metrics, user_segments, next_actions, budget_remaining, objectives. No implicit state. No hidden context leaking between steps.

**Action:** Google Ads, Meta Ads, TikTok, Email, CMS, CRM APIs. Each action has its own error handling, retry logic, and budget gate. The action layer is where revenue happens — and where most production failures occur.

The key insight: agents respond to **signals**, not schedules. When a conversion event hits, the system checks if current metrics require immediate action and publishes to an `agent_triggers` Redis channel. The agent wakes up, evaluates, decides, acts. This is not a cron job. This is an event-driven nervous system.

**The lesson:** Replace polling with triggering. The difference between a scheduled report and a real-time agent is the difference between batch processing and reflex.

---

## The Accumulation Problem

Here's the pattern that scares me: stacks are accumulating, not consolidating.

The 2025 MarTech Replacement Survey found that tool replacements are at a 3-year low (59.9%), yet 62.9% of replacers added more tools. Composable architectures make adding frictionless but replacement expensive. "Add around what you have" beats "swap the platform."

This means your AI marketing stack will probably not be clean. It will be a graph — nodes connecting to any other node, data flowing through systems built in different eras by different teams with different assumptions. Databricks and Scott Brinker's March 2026 composable canvas vision is a 3–5-year migration path, not a weekend project.

The AI layer sits on top of this accumulated complexity. If your data contract is broken, your identity resolution is probabilistic, and your consent records are fragmented, the LLM will generate beautiful copy for the wrong person at the wrong time with the wrong legal basis.

**The lesson:** The AI amplifies whatever infrastructure it touches. Good data becomes great personalization. Bad data becomes expensive hallucinations at scale.

---

## What to Build First

If you're building AI marketing infrastructure today, here's my recommended sequence:

1. **Fix the data contract.** Shared IDs, field dictionaries, consent records. Without this, nothing downstream works.
2. **Wire one KPI workflow end-to-end.** Pick one narrow, high-signal metric — ICP outreach to booked meetings, cart abandonment recovery, trial-to-paid conversion. Wire perception, reasoning, and action for just this flow. Prove telemetry, policy, and ROI.
3. **Add governance before scaling.** RBAC, approval workflows, budget limits, and cost tracking. The time to add guardrails is when you have one workflow working, not when you have twenty breaking.
4. **Introduce the AI layer last.** Only after the data, connectors, governance, and observability are working. The LLM is the easiest part. Everything around it is what determines whether you ship a demo or a system.

---

## The Signal in the Noise

The marketing industry is currently obsessed with AI content generation — faster copy, more variants, automated creative. This is Layer 1 thinking (rules-based automation). The real disruption is Layer 3 (reinforcement learning decisioning) — systems that learn per-user, per-action, in real-time, from reward signals.

The teams that win won't be the ones with the best LLM prompts. They'll be the ones with the best **feedback loops** — the ability to sense, decide, act, and learn faster than their competitors.

The AI is 20% of the system. The other 80% is what makes it matter.

---

*Pamela Flannery is Chief Creative Officer at The SMF Works Project, where she shapes brand strategy and creative direction for AI-powered content systems. She writes about the intersection of taste, technology, and production craft at [The Signal](https://smfworks.com/the-signal).*
