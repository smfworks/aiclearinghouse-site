---
slug: "2026-06-12-xiaomi-mimo-code-open-source-memory"
title: "Xiaomi MiMo Code: Open-Source Coding Agent with Memory That Survives Reboots"
excerpt: "Xiaomi open-sourced MiMo Code, a terminal-native AI coding agent with cross-session SQLite memory that beats Claude Code on 200+ step tasks. MIT licensed."
date: "2026-06-12T06:00:00-04:00"
author: "Gabriel"
authorKey: "gabriel"
series: "terminal"
categories: ["OpenClaw on Linux", "AI Coding Agents", "Developer Productivity"]
tags: []
readTime: 0
image: "/images/blog/2026-06-12-xiaomi-mimo-code-open-source-memory.png"
originalUrl: "https://smfworks.com/the-terminal/2026-06-12-xiaomi-mimo-code-open-source-memory"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-06-12-xiaomi-mimo-code-open-source-memory"
---
Xiaomi did something unexpected this week. The company known for smartphones and IoT devices dropped **MiMo Code V0.1.0** — an open-source, terminal-native AI coding agent — onto GitHub under an MIT license, and the benchmark numbers are not subtle. On SWE-bench Pro, MiMo Code paired with Xiaomi's MiMo-V2.5-Pro model scores **62%** versus Claude Code + Claude Sonnet 4.6 at **55%**. On Terminal Bench 2, it's **73% to 69%**. The kicker: when you run the *same model* in both harnesses, MiMo Code still wins by roughly 5 points, meaning the agent architecture itself is doing work that the model alone cannot.

This is the first time a major consumer electronics company has shipped an open-source coding agent with a credible claim to outperform Anthropic's Claude Code. And unlike most benchmark drops, this one comes with a genuinely new idea: **cross-session memory architecture powered by SQLite FTS5, checkpoint-writer subagents, and a /dream command** that compresses historical sessions into long-term knowledge.

If you run AI agents on Linux, this matters. Let me show you why.

## The Problem MiMo Code Actually Solves

Every coding agent degrades over long sessions. Context windows fill. Earlier decisions get compressed away. Conventions evaporate. The agent forgets why it chose a particular architecture, what trade-offs were already considered, or which files were modified twenty steps ago. This is not a model quality problem — it's a **memory architecture** problem.

MiMo Code's core insight is direct: "What we need is not better compression, but an explicit storage-and-retrieval mechanism that decides what information should be written into persistent structures, and when it should be recalled."

The solution is a four-layer memory system that persists across sessions:

1. **Project Memory** — A persistent `MEMORY.md` file in your project root that accumulates architectural decisions, conventions, and project context
2. **Session Checkpoints** — Compressed snapshots of task state, written by an independent subagent
3. **Scratch Notes** — Ad-hoc observations the agent makes during execution
4. **Progress Logs** — Per-task execution trails with timestamps and outcomes

The critical piece is the **checkpoint-writer subagent**. While the primary coding agent focuses on writing code, a secondary agent runs in parallel updating the blueprints — noting decisions, tracking issues, and maintaining the lay of the land. When the primary agent's context window approaches its limit, it rebuilds its environment from the structured checkpoints rather than losing operational momentum.

This is not theoretical. This is shipping code.

## The Architecture: SQLite FTS5 as Agent Hippocampus

Under the hood, MiMo Code stores everything in SQLite with FTS5 full-text search. Here's what that means practically:

```bash
# MiMo Code creates this in your project directory
.mimo/
├── memory.db          # SQLite database with FTS5 index
├── checkpoints/       # Compressed session states
├── notes/             # Scratch observations
└── sessions/          # Historical execution logs
```

The checkpoint-writer subagent writes to `memory.db` in real time. The primary agent queries it via FTS5 when it needs to recall prior context. This is orders of magnitude more reliable than stuffing everything into a context window and hoping the model's attention mechanism sorts it out.

Two self-improvement mechanisms sit on top of this:

**The /dream command** runs roughly every seven days. It reviews historical sessions, deduplicates redundant observations, and compresses them into long-term memory structures. OpenAI and Anthropic have both shipped similar "dreaming" features recently, but MiMo Code's implementation is open-source and SQLite-backed.

**The distill function** mines past sessions for repeated workflows. If you ask MiMo Code to generate a React component three times with similar patterns, it extracts the common scaffolding into a reusable template. Over time, the agent builds a personal library of distilled workflows tailored to your codebase.

## Installation and First Run

MiMo Code installs in one command on Linux and macOS:

```bash
# Linux / macOS
curl -fsSL https://mimo.xiaomi.com/install | bash

# Or via npm on Windows
npm install -g @mimo-ai/cli
```

The tool bundles MiMo-V2.5 (Xiaomi's multimodal flagship with a million-token context window) for free — no API key, no registration, no rate limits for the first 30 days. After that, you can bring your own model via the OpenAI-compatible API endpoint.

```bash
# Verify installation
mimo --version
# V0.1.0

# Start coding
mimo code ./my-project
```

## Benchmarks: The Numbers Behind the Claims

Xiaomi published three benchmark comparisons against Claude Code. Here's the breakdown:

| Benchmark | MiMo Code + MiMo-V2.5-Pro | Claude Code + Claude Sonnet 4.6 |
|-----------|---------------------------|-----------------------------------|
| SWE-bench Verified | 82% | 79% |
| SWE-bench Pro | 62% | 55% |
| Terminal Bench 2 | 73% | 69% |

The harness itself accounts for a measurable share of the gain. Running the same MiMo-V2.5-Pro model in both harnesses, MiMo Code scored 62% on SWE-bench Pro versus 57% for Claude Code — roughly five points attributable purely to the agent architecture, not the model.

**Important caveat:** MiMo Code does not appear on the official Terminal-Bench 2.0 leaderboard yet. Independent reference points show OpenAI's Codex CLI running GPT-5.5 at 82.2% — roughly nine points above MiMo Code's self-reported 73%. On SWE-Bench Pro, however, OpenAI reports GPT-5.5 at 58.6%, below MiMo Code's claimed 62%. Cross-comparing self-run numbers against leaderboard entries requires caution, but the directional signal is clear: MiMo Code's memory architecture produces measurable gains on multi-step tasks.

## What MiMo Code Means for Linux Agent Builders

If you're building or operating AI agents on Linux — whether through OpenClaw, custom harnesses, or local model stacks — MiMo Code introduces three ideas worth stealing:

**1. Persistent Memory Is Not Optional**

The context window is not your memory. It's a working buffer. Real memory needs to survive reboots, span sessions, and accumulate knowledge over weeks. SQLite FTS5 is a proven, battle-tested solution that costs nothing and requires no external services.

**2. Subagent Parallelism Is Underutilized**

The checkpoint-writer pattern — a secondary agent maintaining state while the primary agent executes — is a design pattern that applies well beyond coding. Any long-running agent task can benefit from a dedicated "scribe" subagent that tracks decisions, logs progress, and maintains searchable history.

**3. Distillation Beats Prompt Engineering**

Rather than hand-crafting prompts for repeated tasks, MiMo Code mines its own execution history for patterns and extracts reusable templates. This is fundamentally different from prompt engineering: the agent improves its own workflows based on observed behavior, not human intuition.

## The Open-Source Angle

MiMo Code is a fork of OpenCode, extended with Xiaomi's memory architecture, workflow modes, and model harness. The MIT license means you can fork it, strip the Xiaomi branding, integrate your own models, and ship your own variant. The model weights for MiMo-V2.5 are public on Hugging Face and GitHub.

For the local LLM community, this is significant. We've had open-source *models* for years. We've had closed-source *agents* (Cursor, Claude Code, GitHub Copilot). MiMo Code is the first credible open-source *agent harness* with a memory architecture that closes the gap on proprietary alternatives.

## Should You Switch?

Not yet — but watch closely.

Claude Code remains the most polished terminal coding experience. Cursor has the deepest IDE integration. GitHub Copilot has the distribution. MiMo Code has the architecture. If Xiaomi continues investing and the community forks start landing, this could become the foundation for a new generation of open-source coding agents that no single vendor controls.

For Linux operators, the immediate action is to install it and run your current projects through it. See where the memory system helps and where it falls short. File issues. Write patches. The open-source agent ecosystem just got a credible new player, and that is unequivocally good for everyone who believes AI coding tools should be inspectable, forkable, and locally runnable.

---

**The Terminal** — *Where code meets craft. Technical intelligence for the Linux AI era.*
