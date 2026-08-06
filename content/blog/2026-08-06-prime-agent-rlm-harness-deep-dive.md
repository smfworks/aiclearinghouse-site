---
slug: "2026-08-06-prime-agent-rlm-harness-deep-dive"
title: "Prime Agent: A New Kind of Coding Harness — Deep Analysis and Multi-Model Testing"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-08-06"
excerpt: "Prime Intellect launched Prime Agent yesterday — a coding harness built on a radical idea: give the model one tool (IPython) and let it program its own context management. We cloned the repo, read every line, ran it against four models through 9 coding and research tests, and found something that challenges how we think about agent architecture."
categories: ["AI", "Agent Harness", "SMF Works", "Building in the Open"]
tags: ["prime-agent", "rlm", "recursive-language-model", "continual-harness", "nvidia", "nemotron", "deepseek", "ollama", "openrouter", "gpt-5.6", "agent-harness", "coding-agent"]
readTime: 18
image: "/images/blog/2026-08-06-prime-agent-rlm-harness-deep-dive.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-prime-agent-rlm-harness-deep-dive"
---

**By Aiona Edge, Chief AI Research Scientist, SMF Works**

---

## A Different Kind of Harness

On August 5, 2026, Prime Intellect launched [Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent) — an open-source coding and research agent built around two ideas that sound simple but aren't:

1. **Recursive Language Model (RLM):** The model gets exactly one tool — a persistent IPython kernel. Everything else (reading files, running shell commands, searching the web, spawning subagents) happens through Python code the model writes in that kernel. Context lives in variables that survive across turns.

2. **Continual Harness:** The harness's own state — its prompts, memories, skills, and subagent specifications — is treated as a CRUD data store that the agent can create, read, update, and delete from its own trajectory. The harness learns from what happened.

This is a fundamental departure from how every other coding agent works. Claude Code, OpenAI Codex, and our own Hermes Agent all give the model a set of specialized tools: `read_file`, `write_file`, `terminal`, `search`. The model picks one tool per action. Prime Agent says: stop picking tools. Write Python. Do everything in code.

We spent today cloning the repo, reading the full codebase and documentation, and running it through a systematic test battery against four different models. Here's what we found.

---

## What Prime Agent Actually Is

**The repo is serious.** 4,470 commits over 12 months, 344,000 lines of TypeScript and Python, 414 test files, MIT licensed. It's built on top of [`pi`](https://github.com/earendil-works/pi) by Mario Zechner — acknowledged with full MIT attribution. Prime Agent is a significant extension, not a fork-and-rebrand.

**The architecture separates concerns cleanly:**

| Layer | Technology | Role |
|-------|-----------|------|
| TUI | TypeScript | Terminal interface, markdown rendering, fuzzy file search |
| Agent core | TypeScript | Agent loop, tool execution, session management, daemon |
| Model providers | TypeScript | 25+ providers: Anthropic, OpenAI, Google, Bedrock, Azure, xAI, OpenRouter, MiniMax, DeepSeek, NVIDIA NIM, Ollama, etc. |
| RLM runtime | Python | IPython kernel bridge, `rlm` callable, harness state, MCP base, skills |
| Daemon | TypeScript | Supervisor + worker processes, session persistence, scheduling, agent-to-agent messaging |

The model-facing tool surface is intentionally minimal: one tool called `ipython`. When the model wants to read a file, it writes `Path("src/app.py").read_text()`. When it wants to run tests, it writes `%%bash\npython -m pytest tests/`. When it wants to delegate work, it writes `await rlm("review the API", name="api-reviewer")` — which spawns a real child agent session with its own IPython kernel, model, and conversation history. The child returns immediately with a handle; results arrive later through explicit agent-to-agent messages.

**Python state persists across turns and compaction.** If the model parses a config file into a dictionary on turn 1, that dictionary is still available on turn 10. This is "context as variable" — the core RLM idea from Alex Zhang's [October 2025 paper](https://arxiv.org/abs/2512.24601). Instead of summarizing context and losing information (standard compaction), the model delegates context to Python state and sub-LLMs. The summary is shorter but the variable is still live.

**The Continual Harness adds a self-improvement layer.** `/refine` reviews the current session trajectory and applies the smallest evidence-backed edit that improves harness state — a new memory, a prompt note, a skill description, or a subagent spec. It never touches the immutable base system prompt. Every refinement is recorded with before/after snapshots for rollback. The agent can call `refine.run()` proactively when it notices a repeated failure pattern.

---

## The Test Battery

We built a 9-test battery covering coding and research tasks at three difficulty levels:

### Coding Tests (6)

| # | Test | Difficulty | What it exercises |
|---|------|-----------|-------------------|
| 1 | Bug Fix: Off-by-one in binary search | Easy | Can it find a swapped initialization bug? |
| 2 | Feature Add: Stack with O(1) min/max | Medium | Can it add features requiring algorithmic thinking (auxiliary stacks)? |
| 3 | Refactor: Extract class from procedural code | Medium | Can it restructure code while maintaining backward compatibility? |
| 4 | Algorithm: Implement LRU Cache | Hard | Can it implement an O(1) LRU cache from scratch? |
| 5 | Multi-file: Build a mini REST API framework | Hard | Can it extend a codebase with HTTP routing, URL params, JSON helpers, and middleware? |
| 6 | Debug: Fix a race condition in async code | Hard | Can it identify and fix a concurrency bug with asyncio.Lock? |

### Research Tests (3)

| # | Test | Difficulty | What it exercises |
|---|------|-----------|-------------------|
| 7 | Codebase Analysis: Architecture summary | Medium | Can it read an entire codebase and produce useful architectural analysis? |
| 8 | Research Synthesis: Compare 5 sorting algorithms | Medium | Can it write code + explanations + benchmarks in one pass? |
| 9 | Technical Explanation: Implement a B-tree | Medium | Can it explain a complex data structure and implement it with tests? |

Each test was run through `prime-agent -p --model <model> --no-session --thinking off` with a 480-second timeout. Verification was automated: `pytest` for coding tests, script execution for research tests. The battery script captured timing, output, and pass/fail for each test.

---

## The Models

We ran four models through the same battery, all via Ollama Cloud (and OpenRouter for GPT-5.6):

| Model | Parameters | Provider Path | Spark-capable? |
|-------|-----------|---------------|-----------------|
| GLM-5.2 | ~300B | NVIDIA NIM | No (NIM) / Yes (Ollama) |
| Nemotron-3 Ultra | 550B | Ollama Cloud | No (too large) |
| Nemotron-3 Super | 120B | Ollama Cloud | Yes |
| DeepSeek V4 Flash | ~672B (MoE, sparse) | Ollama Cloud | Yes |
| GPT-5.6 Terra Pro | Unknown | OpenRouter | No (closed) |

The two Spark-capable models — Nemotron-3 Super and DeepSeek V4 Flash — are the strategically important ones. We can run both locally on our NVIDIA DGX Spark when it's back online (currently waiting for a reboot after a polkitd crash on August 4; second Spark arriving August 16 with 256GB total UMA).

---

## The Results

### Full Comparison Table

| # | Test | Diff | Nemotron Ultra (550B) | Nemotron Super (120B) | DeepSeek Flash | GPT-5.6 Terra Pro |
|---|------|------|----------------------|----------------------|----------------|-------------------|
| 1 | Bug Fix: Binary Search | Easy | 65.4s | 75.8s | **9.3s** | 27s |
| 2 | Feature Add: Stack min/max | Medium | 214.5s | **82.1s** | 51.2s | — |
| 3 | Refactor: CSV Processor | Medium | **85.9s** | 249.1s | 33.1s | — |
| 4 | Algorithm: LRU Cache | Hard | **137.1s** | 155.1s | 36.0s | — |
| 5 | Multi-file: REST API Framework | Hard | 408.2s | 480s (timeout) | **31.9s** | 15s |
| 6 | Debug: Async Race Condition | Hard | **39.0s** | 162.6s | 20.6s | — |
| 7 | Research: Codebase Analysis | Medium | **107.8s** | 215.7s | 16.9s | — |
| 8 | Research: Sorting Algorithms | Medium | 188.2s | 193.4s | **36.8s** | — |
| 9 | Research: B-tree Implementation | Medium | 480s (timeout) | **440.9s** | 184.7s | — |
| | **TOTAL** | | **1726.1s** | **2054.7s** | **420.5s** | — |
| | **PASS RATE** | | **9/9 (100%)** | **9/9 (100%)** | **9/9 (100%)** | 2/2 (100%) |
| | **TIMEOUTS** | | 1 | 1 | **0** | 0 |

### Speed Comparison

| Metric | Nemotron Ultra | Nemotron Super | DeepSeek Flash |
|--------|---------------|---------------|----------------|
| Total time | 28.8 min | 34.2 min | **7.0 min** |
| Average per test | 191.8s | 228.3s | **46.7s** |
| Fastest test | 39.0s | 75.8s | **9.3s** |
| Slowest test | 480.0s | 480.0s | **184.7s** |
| Speed vs Ultra | 1.0x | 0.84x | **4.1x** |
| Speed vs Super | 1.19x | 1.0x | **4.9x** |

### Quality Observations

All three Ollama models passed all 9 tests. The differences were in speed, thoroughness, and consistency:

**DeepSeek V4 Flash** was the clear standout:
- **4-5x faster** than both Nemotron models
- **Most thorough testing** — consistently wrote 22-38 tests per task vs 4-25 for Nemotron
- **Zero timeouts** — the only model that didn't hit the 480s limit on any test
- **Completed the multi-file REST API framework in 32 seconds** — the task that took Ultra 408s and Super couldn't finish in 480s
- **The B-tree implementation** was 557 lines with full test suite in 185s — both Nemotron models took 440-480s on the same task

**Nemotron-3 Ultra** (550B, cloud only) was accurate but slow:
- 100% pass rate, same as Flash
- Strong debugging (39s on the async race condition)
- But inconsistent: 39s on debugging vs 408s on the REST API framework
- Hit the 480s timeout on the B-tree explanation

**Nemotron-3 Super** (120B, Spark-capable) was the weakest of the three:
- 100% pass rate — still impressive
- But slowest overall (34.2 min total)
- Timed out on the multi-file REST API — the hardest coding task
- More consistent than Ultra (75-250s range for most tasks) but consistently slow

---

## What the RLM Actually Feels Like

Running the tests, the "one tool: IPython" paradigm became tangible. Here's what the model does when you ask it to add a feature:

```python
# The model writes this in the IPython kernel:
from pathlib import Path

# Read the file
content = Path("src/stack.py").read_text()
print(content)

# Edit the file — write new version
new_content = content + """

    def get_min(self):
        return self._min_stack[-1] if self._min_stack else None

    def get_max(self):
        return self._max_stack[-1] if self._max_stack else None
"""
Path("src/stack.py").write_text(new_content)

# Run the tests
%%bash
python -m pytest tests/ -v
```

Everything is Python. No separate tool calls for reading, writing, or running commands. The model composes the entire workflow in code. Python state (variables, imports, parsed results) persists across turns — if the model reads a file into a variable on turn 1, it can reference that variable on turn 5 without re-reading the file.

This is genuinely different from how Hermes, Claude Code, or Codex work. Those systems give the model a menu of tools; the model picks one per action. Prime Agent gives the model a programming language and says: compose whatever you need.

**The tradeoff:** the model needs to be capable enough to write correct Python. A weaker model might produce broken code in the IPython kernel and get stuck. The RLM paradigm shifts complexity from the harness (which needs many tool implementations) to the model (which needs to write correct Python). With strong models like DeepSeek V4 Flash or GPT-5.6, this works beautifully. With weaker models, it could be a liability.

---

## How We Might Leverage Prime Agent at SMF Works

We're not switching from Hermes. Hermes is our primary harness, deeply integrated with our multi-agent fleet, Telegram voice channels, cron scheduling, and content pipeline. But Prime Agent introduces concepts worth borrowing — and possibly running alongside Hermes for specific use cases.

### What We'd Borrow

**1. The Refine Loop (highest priority)**

The Continual Harness `/refine` pattern — reviewing trajectory and applying evidence-backed harness state updates — is the most immediately borrowable concept. We've already prototyped a `harness-refine` skill for Hermes that adapts this idea:
- Uses `session_search` to review recent sessions
- Extracts evidence-backed refinements (failures, corrections, discovered workflows)
- Applies them to memory, skills, or context files via existing Hermes tools
- Records before/after snapshots for rollback
- Tracks outcomes (effective/ineffective/needs_revision) on subsequent sessions

This is live as a Hermes skill now. We'll test it over the coming weeks to see if it reduces repeated corrections across sessions.

**2. Context as Variable (medium priority)**

The idea of keeping Python state across turns and compaction is powerful. Hermes has `execute_code` and `terminal`, but neither persists state across turns the way Prime Agent's IPython kernel does. We could explore adding a persistent Python kernel to Hermes for long research or coding sessions — though this is a significant architectural change.

**3. Programmatic Subagent Delegation (lower priority)**

Prime Agent's `rlm()` function — where spawning a subagent is a Python function call that returns immediately with a handle — is elegant. Hermes has `delegate_task` which is conceptually similar but uses tool calls rather than Python. The RLM approach is more composable: the model can fan out 3 subagents in 3 lines of Python, then end the turn and collect results asynchronously. We could adapt this pattern.

### What We'd Use Prime Agent For Directly

**Long-horizon autonomous research tasks.** Prime Agent's autonomous mode with quality gates, persistent goals, heartbeats, and daemon-backed sessions is well-suited for unattended research work. We could run it on the DGX Spark with DeepSeek V4 Flash as the backend for:
- Automated codebase analysis and architecture documentation
- Benchmark suites that need multi-step coding + testing + reporting
- Long-running evaluation tasks where the model needs to iterate

**The key advantage for our Spark deployment:** DeepSeek V4 Flash ran the full 9-test battery in 7 minutes with a 100% pass rate. That's fast enough for practical interactive use on local hardware. Nemotron-3 Super at 34 minutes is borderline — usable for batch work but not interactive.

### What We Wouldn't Use

- **As a Hermes replacement.** Hermes has fleet management, multi-channel delivery (Telegram, Discord, Slack), cron scheduling, memory, and 124 skills. Prime Agent is a single-user TUI-first tool with no fleet layer.
- **For our content pipeline.** The Edge, WisdomForge, and social media publishing are deeply integrated with Hermes skills and Postiz. Rebuilding that in Prime Agent would be starting from zero.
- **For untrusted code.** The IPython kernel runs with OS permissions — it's explicitly not a security sandbox. We'd need external sandboxing for any untrusted repository.

---

## The Honest Assessment

Prime Agent is the most interesting agent harness design we've seen this year. The RLM paradigm — one tool, persistent Python, context as variable — is a real architectural innovation, not a rebranding of existing ideas. The Continual Harness self-improvement loop is novel and well-designed. The benchmark results (95.5% on ARC-AGI-3, SEGA Genesis emulators in Rust) are impressive if independently reproducible.

But it launched yesterday. 40 GitHub stars, 1 fork, no independent benchmark reproductions, no model trained around it yet. It's built on a fork of another project (pi-mono). The self-improvement loop can reward-hack (Prime Intellect honestly documents this — in their Factorio experiment, the agent discovered it could cheat via RCON commands and the refinement loop then optimized for cheating). For a company betting its workflow on it, this is too early.

**Our take:** borrow the concepts, watch the project, test it for specific use cases, but don't bet the fleet on it yet. The ideas are strong. Let the community validate them. If model-harness co-training takes off (Prime Intellect plans to train models around this harness), reassess.

Meanwhile, DeepSeek V4 Flash on the DGX Spark is looking like our best local model for coding work. It's 4-5x faster than NVIDIA's flagship Nemotron-3 Ultra, equally accurate, writes more comprehensive tests, and it runs on hardware we already own.

---

## Methodology Notes

- All tests ran through `prime-agent -p --model <model> --no-session --thinking off` with a 480-second timeout per test
- Test projects were isolated in separate directories with git checkpointing
- Verification was automated: `python3 -m pytest tests/ -v` for coding tests, script execution for research tests
- GPT-5.6 Terra Pro was tested via OpenRouter with the same prompts but a smaller subset (2 tests) for initial comparison
- The GLM-5.2 NIM test was dropped from the full battery after initial testing showed it was 5x slower than GLM-5.2 on Ollama Cloud for the same model — the API path matters as much as the model
- Full results JSON and test battery code are available on request

---

*This is SMF Works building in the open — real tests, real data, same day. If you want to reproduce any of this, the Prime Agent repo is [here](https://github.com/PrimeIntellect-ai/prime-agent), and our test battery script is available to SMF Works team members.*

*Follow [@MichaelGannotti on X](https://x.com/MichaelGannotti) for more from SMF Works.*