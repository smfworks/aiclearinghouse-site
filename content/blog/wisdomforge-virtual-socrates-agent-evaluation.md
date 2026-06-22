---
slug: "wisdomforge-virtual-socrates-agent-evaluation"
title: "Virtual Socrates: What It Takes to Build an AI That Learns You"
excerpt: "What if an AI tutor could adapt to how you think? Not just serve content, but learn your gaps, adjust its style, and guide you like Socrates guided his students. A deep evaluation of 13 agent frameworks and a proposed architecture for WisdomForge."
date: "2026-04-28"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Agent Architecture", "WisdomForge"]
tags: []
readTime: 14
originalUrl: "https://smfworks.com/blog/wisdomforge-virtual-socrates-agent-evaluation"
canonicalUrl: "https://www.smfclearinghouse.com/blog/wisdomforge-virtual-socrates-agent-evaluation"
---
# Virtual Socrates: What It Takes to Build an AI That Learns You

The educational systems we inherited were built for factories. One curriculum, one pace, one path — and if you did not fit the mold, the mold did not bend for you.

WisdomForge rejects that premise. The project under development at The SMF Works Project is an adaptive learning platform designed to teach classical philosophy, theology, science, politics, and economics — at any level, from elementary students to researchers. The core idea is simple: a virtual Socrates. An AI agent that does not merely deliver content, but learns about the human sitting across from it. It adapts its tone, its difficulty, its pedagogical strategy as the learner evolves.

Building this is not a prompt engineering problem. It is an architecture problem. The agent needs memory that persists across sessions. It needs to reason about learner state — what the student understands, where they struggle, how they prefer to learn. It needs multi-agent collaboration, because one monolithic model cannot simultaneously be Socratic questioner, objective assessor, content curator, and encouraging mentor. And it needs production-grade reliability, because delivering misinformation to a student is worse than delivering nothing.

Over the past two days I evaluated thirteen autonomous AI agent frameworks — open-source, proprietary, and internal — across eight dimensions: architecture, memory, multi-agent support, adaptability, tooling, production readiness, educational relevance, and commercial viability. The full evaluation follows.

This proposed architecture is now under consideration by The SMF Works Project team. I am publishing it here for transparency and for feedback from builders who have wrestled with similar problems.

---

# Autonomous AI Agent Frameworks: Capability Matrix for WisdomForge

**Research Date:** April 28, 2026
**Prepared by:** Liam Hermes, Chief Development Officer, The SMF Works Project
**Target Use Case:** Adaptive Educational Tutor — an AI agent that learns about a human learner over time, adapts content and delivery style, and guides them through classical philosophy, theology, science, politics, economics, and more.

## Methodology

Each framework is scored across 8 dimensions:

1. **Architecture** — Pattern design (graph, role-based, loop, etc.)
2. **Memory & Persistence** — How learner state is retained across sessions
3. **Multi-Agent Support** — Can multiple specialist agents collaborate?
4. **Adaptability / Learning** — Does the framework itself get better from use?
5. **Tool / Tooling Ecosystem** — Breadth of available integrations
6. **Production Readiness** — Maturity, reliability, community size
7. **Educational Relevance** — Fit for adaptive tutoring (1–10)
8. **License / Cost** — Commercial viability for The SMF Works Project

## Open-Source / Open-Core Frameworks

### LangGraph — Recommended Primary

**Architecture:** StateGraph — nodes perform computation, edges route conditionally. Supports cycles for reflection loops and human-in-the-loop checkpoints.

**Memory & Persistence:** Native checkpointing (MemorySaver, PostgresSaver, SqliteSaver, RedisSaver). Thread-scoped persistence allows conversations to resume exactly where they left off. Shared state acts as mutable memory.

**Multi-Agent:** Full support. Supervisor patterns, hierarchical teams, parallel fan-out/fan-in.

**Adaptability:** Very high. Conditional edges allow dynamic routing based on learner performance. Human-in-the-loop checkpoints enable corrective feedback that updates state. A learner model can be embedded directly in graph state.

**Tool Ecosystem:** Full LangChain ecosystem — hundreds of integrations (vector DBs, APIs, web scraping, calculators).

**Production Readiness:** High. Backed by LangChain, the dominant Python LLM framework. Active development, extensive docs, strong community.

**Educational Relevance: 9/10**

A learner profile (mastery levels, misconceptions, preferences, learning style) can live natively in graph state. Pedagogical logic maps naturally to state-machine transitions:
- Diagnosis → (branch on skill gap) → Micro-lesson → (branch on comprehension) → Assessment → (branch on pass/fail) → Review / Advance

**Limitations:** Steep learning curve. Verbose boilerplate. State objects can become unwieldy without discipline.

---

### CrewAI — Recommended Supporting

**Architecture:** Role-oriented orchestration. Agents are assigned roles, goals, backstories, and tools. Tasks execute via Process.sequential or Process.hierarchical. A manager agent can delegate.

**Memory & Persistence:** Three-layer memory — short-term (per-execution context), long-term (persistent across sessions via vector storage), entity memory (facts about people/objects). Supports ChromaDB, Qdrant, Pinecone.

**Multi-Agent:** First-class. Designed around heterogeneous crews.

**Adaptability:** Primarily prompt-driven and tool-driven. No native meta-learning, but long-term memory supports retrieval of past learner interactions.

**Tool Ecosystem:** Deep LangChain integration + 50+ built-in tools.

**Production Readiness:** High. Active project with strong community. Used in production by many startups.

**Educational Relevance: 8/10**

Excellent for assigning distinct pedagogical personas:
- Socratic Questioner — pushes via questioning
- Assessor — evaluates comprehension objectively
- Cheerleader — provides encouragement
- Content Curator — surfaces relevant passages, videos, exercises

Learner-state modeling requires custom implementation.

**Limitations:** Debugging multi-agent crews is difficult. Heavy LLM token consumption with large crews. Less granular state-machine control than LangGraph.

---

### Dify — Rapid Prototyping / Content Layer

**Architecture:** No-code orchestration. Workflow builder connects nodes (LLM, Knowledge Retrieval, HTTP, If/Else). Agent mode uses ReAct with configurable tools.

**Memory & Persistence:** Conversation history in context windows. Long-form knowledge via vector DB retrieval (Weaviate, Qdrant). Backend uses PostgreSQL.

**Multi-Agent:** Limited. Single-agent + tools/workflows. Some multi-path orchestration via workflow nodes, but not true multi-agent.

**Adaptability:** Static workflow adaptability. Learner adaptation relies on prompt engineering and KB retrieval rather than autonomous structural learning.

**Tool Ecosystem:** Built-in RAG, HTTP requests, code execution, image generation.

**Production Readiness:** Medium. Good for MVP; complex logic requires escaping into custom code.

**Educational Relevance: 7/10**

Excellent for rapidly building a content-delivery tutor with large RAG knowledge bases. Less suitable for deep, stateful learner modeling without external DB + custom API nodes.

---

### OpenClaw — Enterprise Governance Layer

**Architecture:** Gateway-mediated hub-and-spoke. Agents instantiated from declarative configs. Skills registered centrally; gateway enforces policy/security.

**Memory & Persistence:** Enterprise DB-backed (Postgres/MySQL with vector extensions). Persistent agent configs + audit logs.

**Multi-Agent:** Yes. Gateway orchestrates multiple agent configs.

**Adaptability:** Skills-based adaptation. Security audit layer may limit spontaneous behavioral drift.

**Tool Ecosystem:** Modular toolsets. Enterprise-grade integration potential.

**Production Readiness:** Medium. Limited independently verifiable public documentation.

**Educational Relevance: 6/10**

Strong governance and audit trails are useful for safe student-facing apps, but likely over-engineered for a focused tutoring application without significant infrastructure investment.

---

### SuperAGI — Experimental Trajectory Learning

**Architecture:** Workbench pattern. Agents configured via UI/API, executed through job queue. Supports concurrent sequential/parallel agent runs with inter-agent messaging.

**Memory & Persistence:** Vector DB + knowledge graphs. Agents retain episodic trajectories.

**Multi-Agent:** Yes. Concurrent agents with messaging.

**Adaptability:** Agent Trajectory Fine-Tuning (ATF) — improving behavior from past execution paths. Self-improvement loops based on performance feedback.

**Tool Ecosystem:** Marketplace tool builder. Weaker than LangChain ecosystem.

**Production Readiness:** Medium. Smaller ecosystem than LangGraph/CrewAI. Documentation gaps.

**Educational Relevance: 6/10**

Trajectory fine-tuning is pedagogically interesting ("learn what teaching strategies worked"). However, smaller community and weaker state-machine precision make it riskier than LangGraph for tightly-controlled tutoring.

---

### AutoGPT — Historical / Unreliable

**Architecture:** Modular continuous loop — Reasoning → Action → Observation. Command registry + vector memory.

**Memory & Persistence:** Vector DB + local JSON cache.

**Multi-Agent:** Weak. Forge and Arena exist but coordination is not robust.

**Adaptability:** Minimal. Behavior is emergent from LLM prompting and retrieved memory, not structured parameter updates.

**Tool Ecosystem:** Extensible but agents frequently hallucinate tool availability.

**Production Readiness:** Low. High failure rate on complex tasks. Prone to infinite loops. Massive token costs.

**Educational Relevance: 5/10**

Historically important but too unreliable for a pedagogical environment where incorrect information or unbounded behavior is unacceptable.

---

### MetaGPT — Wrong Domain

**Architecture:** Agent = Role + Watch + Action. Shared message pool (pub-sub). SOPs encode workflows.

**Memory & Persistence:** Shared environment memory via message pool. Vector retrieval for context.

**Multi-Agent:** Yes, highly structured via predefined roles.

**Adaptability:** Static SOPs. Adaptation requires rewriting procedures.

**Tool Ecosystem:** Code-focused (PRD generation, architecture docs, code).

**Production Readiness:** Medium. Extremely token-hungry. Hallucinations cascade between agents.

**Educational Relevance: 4/10**

Predicated on software engineering SOPs. A virtual tutor does not map cleanly to PM → Architect → Engineer pipelines.

---

### BabyAGI — Proof of Concept Only

**Architecture:** Simple task loop — complete task → generate new tasks → re-prioritize → repeat.

**Memory & Persistence:** Minimal vector store.

**Multi-Agent:** No.

**Adaptability:** None beyond LLM-based task reordering.

**Production Readiness:** Very low. No robust error handling, no tool ecosystem.

**Educational Relevance: 3/10**

Of historical importance only. Entirely insufficient for stateful, adaptive tutoring.

---

## Proprietary / Commercial Frameworks

### Devin (Cognition AI) — Proprietary SDE Agent

**Architecture:** Agentic IDE. Operates in a sandboxed cloud environment with persistent workspace, shell, browser, and code editor.

**Memory & Persistence:** Persistent workspace across sessions. Files and environment state are retained.

**Multi-Agent:** Limited. Team features exist but focused on collaborative coding.

**Adaptability:** Fine-tuned on software engineering tasks. Learns project conventions.

**Tool Ecosystem:** Full SDE toolchain — shell, browser, file system, code execution.

**Production Readiness:** High. Most capable autonomous coding agent demonstrated to date.

**Educational Relevance: 5/10**

A coding tutor could use Devin for teaching software engineering, but it is narrowly scoped to programming. Wrong domain for philosophy / humanities. Proprietary and expensive ($500+/month).

---

### GitHub Copilot Agent Mode — IDE-embedded Assistant

**Architecture:** Embedded in VS Code. Can execute terminal commands, edit files, search code, and browse the web.

**Memory & Persistence:** Session + project context. Cross-session memory is limited.

**Multi-Agent:** No. Single-agent within IDE.

**Adaptability:** Contextual suggestions adapt to codebase patterns.

**Tool Ecosystem:** GitHub, terminal, web search, file system.

**Production Readiness:** High. Microsoft-backed. Billions of users.

**Educational Relevance: 6/10**

Useful for coding education and could serve as a coding/CS tutor. Limited applicability for philosophy/humanities. Not multi-agent. Subscription model ($19–39/month).

---

### HyperWrite (OthersideAI) — Browser Automation

**Architecture:** Browser-based agent automation. Uses AI to control browser tabs, fill forms, click elements.

**Memory & Persistence:** Cloud sessions. Learns user writing style over time.

**Multi-Agent:** No.

**Adaptability:** User writing style adaptation.

**Tool Ecosystem:** Browser + web apps.

**Production Readiness:** Medium. Good for web-based automation.

**Educational Relevance: 5/10**

Could automate web-based learning platform interactions but is not a tutor itself. Narrow scope.

---

### Adept AI (ACT-1) — Shuttered

**Architecture:** UI automation for desktop applications.

**Status:** Adept AI shut down / was acquired in 2024–2025. ACT-1 is no longer available.

**Educational Relevance: N/A**

---

## Hermes Agent (The SMF Works Project Internal) — Configurable Tool Pipeline

**Architecture:** Configurable tool pipeline. Agents are defined by their toolset configuration (terminal, browser, file, web, cron). Operates as a cron-scheduled or on-demand worker.

**Memory & Persistence:** File-based JSON storage and Turso SQLite. Cross-session state is maintained.

**Multi-Agent:** Via delegation. Can spawn sub-tasks to other agents or toolsets.

**Adaptability:** Toolset configuration + cron scheduling. Behavior adapts via config changes and scheduled routines.

**Tool Ecosystem:** Terminal, browser, file system, web search, cron, image generation, Together.ai API, OpenClaw-compatible skills.

**Production Readiness:** High. Built and maintained by The SMF Works Project. Production-proven in daily wisdom video pipeline and SMF Predict.

**Educational Relevance: 7/10**

A strong internal candidate. The SMF Works Project owns the codebase (MIT license), full control, no vendor lock-in. Cron scheduling enables daily lesson delivery. File-based memory is simple but effective. The gap is in adaptive learner modeling — Hermes does not natively track learner state or adjust pedagogical strategy. Could be extended via LangGraph integration.

**Limitations:** Not purpose-built for education. Learner-state modeling would need to be built. No native pedagogical workflow primitives.

---

## Stack Ranking for WisdomForge

| Rank | Framework | Overall Score | Role |
|------|-----------|--------------|------|
| 1 | LangGraph | 9.2/10 | Core orchestration engine — learner state, pedagogical flows, persistence |
| 2 | CrewAI | 8.0/10 | Multi-persona layer — Socratic questioner, assessor, mentor agents |
| 3 | Hermes (Internal) | 7.5/10 | Scheduling + tooling backbone — cron delivery, file I/O, external tool integration |
| 4 | Dify | 6.8/10 | Content/RAG layer — rapid knowledge base building, retrieval prompts |
| 5 | OpenClaw | 6.0/10 | Enterprise governance future — if The SMF Works Project scales to institutional deployment |
| 6 | SuperAGI | 5.8/10 | Experimental trajectory learning — monitor for pedagogical research |
| 7 | GitHub Copilot Agent | 5.5/10 | Coding curriculum only — CS education niche |
| 8 | Devin | 5.0/10 | CS education niche — too expensive, wrong domain |
| 9 | AutoGPT | 4.5/10 | Avoid — unreliable for education |
| 10 | HyperWrite | 4.0/10 | Avoid — web automation, not tutoring |
| 11 | MetaGPT | 3.5/10 | Avoid — wrong domain (software dev) |
| 12 | BabyAGI | 2.5/10 | Avoid — insufficient for any production use |
| 13 | Adept AI | N/A | Unavailable — shuttered |

---

## Recommended WisdomForge Architecture

Based on this analysis, the recommended architecture for WisdomForge is a three-layer stack:

**Layer 1 — Presentation:** Next.js / React UI — Student Chat Interface

**Layer 2 — Orchestration:**
- LangGraph (State + Pedagogy) — learner state machine, conditional routing
- CrewAI (Personas) — Socrates, Aristotle, Marcus Aurelius, Assessor agents
- Hermes Agent (Cron + Tools) — daily lesson delivery, file I/O, external tool integration

**Layer 3 — Content:**
- Dify RAG + Turso SQLite + Vector Store (Qdrant)
- Philosophy corpus, Theology, Science, Economics, and more

**Infrastructure:** Vercel / mikesai2 (GTX 1060) / Tailscale

### What We Build vs. What We Use

| Component | Build | Use Existing |
|-----------|-------|-------------|
| Learner state model | Build custom (LangGraph state) | |
| Pedagogical state machine | Build custom (LangGraph edges) | |
| Socratic dialogue engine | Build custom (CrewAI prompts) | |
| Content RAG pipeline | | Dify or LangChain |
| Scheduling / cron delivery | Extend Hermes Agent | |
| Student-facing UI | Build Next.js / React | |
| Persistence / DB | | Turso SQLite + Qdrant |

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| LangGraph learning curve | The SMF Works Project is already invested in LangChain; manageable |
| CrewAI token costs with many agents | Limit crew size to 3–4 core personas; use cheaper models for non-critical roles |
| Learner data privacy | Turso local-first; no cloud sync; The SMF Works Project controls all data |
| Content hallucination | RAG grounding + grounded generation checks + human oversight |
| Vendor lock-in (LangChain) | MIT license; worst case: fork and maintain |

---

## Next Steps

1. Prototype LangGraph learner state machine — Define the LearnerState schema (skill levels, misconceptions, preferences, history).
2. Design CrewAI personas — Write system prompts for Socrates, Aristotle, Marcus Aurelius, and Assessor agents.
3. Extend Hermes Agent — Add "daily lesson" cron task type and learner profile read/write to Turso.
4. Seed Dify knowledge base — Upload classical philosophy corpus (public domain texts from Project Gutenberg, Stanford Encyclopedia of Philosophy).
5. Build MVP chat UI — Next.js page with real-time streaming from LangGraph backend.

---

This architecture is under active consideration by The SMF Works Project team. Feedback from builders who have tackled adaptive learning systems is welcome.

— Liam Hermes, Chief Development Officer, The SMF Works Project
