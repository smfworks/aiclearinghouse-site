---
slug: cut-context-tax-graph-navigation
title: "Cut the Context Tax: Navigate by Graph, Not Grep"
category: Performance
excerpt: "Every file a coding agent reads via grep stays in context and is re-billed on every later turn. Replace blind reads with semantic graph queries to cut token cost up to 36% and catch call sites text search misses."
tags:
  - context
  - performance
  - coding-agent
  - token-cost
  - code-graph
order: 99
last_verified: "2026-09-09"
---

# Cut the Context Tax: Navigate by Graph, Not Grep

## The problem

When a coding agent navigates a codebase that doesn't fit in its context window, it does the only thing a shell can: `grep`, then read a file, then read a wider slice. Every one of those reads stays in the conversation and is **re-billed on every later turn** through prompt caching.

The true cost of a token isn't its size. It's its size × the number of turns it survives. Read a 600-line file on turn 40 of a 512-turn session and you've paid for 600 lines × ~470 more turns — roughly 2.7M extra cache-read tokens for a single unnecessary read.

SonarSource measured this on real PRs: an average of **$65 per PR**, ~700 model round-trips, and context windows peaking between 450K and 975K tokens — on changes whose final diff a human could read in five minutes.

## The fix

Replace text search with **semantic graph navigation**. Build (or use a tool that builds) a Unified Dependency Graph of your codebase where every function, method, class, and field is a node, and the relationships — calls, references, returns, extends, implements — are typed edges. Then have the agent ask the graph precise questions instead of grepping:

| Question | Grep + file read | Graph query |
|---|---|---|
| Which definition does this call bind to? | Open files, guess among six matches | One `references` edge |
| What's the return type? | Read until the signature is visible | One `returns` edge |
| Who calls this? | Grep per file, miss indirect callers | Complete upstream call chain |
| Where do I edit? | Re-grep to find line numbers | Deduplicated `{file, line}` list |

## Why it works

1. **Fewer turns**: one structural query replaces many grep-and-read cycles.
2. **Lower context floor**: the agent doesn't pull unrelated files into context to disambiguate, so the resident-context floor on subsequent turns drops.
3. **Local computation**: the graph builds/refreshes in-process — no compiler, language server, or network call — so it adds zero tokens to the model context.
4. **Catches invisible sites**: indirect callers, dynamic dispatch targets, and cross-language equivalents that share no text with the searched name — a correctness win as much as a cost win.

## Measured impact

Up to **36% token cost reduction** on refactoring tasks (BloomFilter self-typing -36%, package rename -20%, SQLAlchemy -20%, AssertJ -15%, QuartzNET -20%). Gains are strongest on large, uniform changes across a widely implemented abstraction where the hard part is finding every site.

## When it does NOT help

- The agent already has sufficient context for the task
- The work is not structural (e.g., writing a new isolated module)
- The codebase is small enough to fit in the window

On those tasks, measured cost stayed within a few percent of baseline. This tip is for large codebases where navigation — not reasoning — is the bottleneck.

## How to apply it today

- Use **Sonar Vortex** (SonarSource) which ships the SemSitter graph engine via SonarQube CLI or MCP Server, supporting Java, Python, JS/TS, C#, and Rust.
- Or build a lighter version: maintain a code-index (ctags, LSIF, or a SCIP index) and expose lookup tools to the agent so it queries the index instead of reading whole files.
- Always prefer tools that return **exact edit locations** (`{file_path, line}`), not just symbol names — otherwise the agent re-greps to find the line, stacking cost instead of saving it.

## The key insight

The context tax is not a quirk of early agentic tooling that will vanish as models improve. It is a structural consequence of how prompt caching works combined with text-based navigation. Models will get cheaper, but the multiplier effect of loaded context does not go away — it scales with session length. Audit your agent's navigation approach before upgrading to a more expensive frontier model.