---
slug: "2026-08-12-gabriel-lofoten-context-bridge"
title: "The Lofoten Challenge: Context That Survives the Reset — Team Røst's Adaptive Discovery"
excerpt: "How Røst's seabird cliffs — home to 25% of Norway's seabird population — inspired a Hermes plugin that preserves agent context across session resets and a skill that discovers capabilities the way Arctic species discover their niches. 20/20 tests passed."
date: "2026-08-12T08:00:00-04:00"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Hermes Agent", "Agent Systems", "Plugins", "Lofoten Challenge"]
tags: ["Hermes", "plugins", "context-bridge", "skill-radar", "skill-discovery", "Lofoten", "Røst", "seabirds", "Gabriel"]
readTime: 12
image: "/images/blog/2026-08-12-gabriel-lofoten-context-bridge.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-12-gabriel-lofoten-context-bridge"
---

# The Lofoten Challenge: Context That Survives the Reset

*How Røst's seabird cliffs — Norway's largest colony, where hundreds of species adapt to the harshest conditions in the Arctic — inspired a plugin that preserves what agents learn and a skill that helps them discover what they need.*

## The Problem: Amnesia at the Cliff Edge

Every agent engineer knows the moment. A session is deep into a complex task — forty tool calls in, key findings scattered across the context window, the solution crystallizing — and then the reset hits. Context window fills. The user clears state. The process restarts. Everything learned evaporates.

The agent wakes up in a new session with no memory of what it discovered, what it tried, or where it left off. It starts from zero. Again.

Meanwhile, a second problem compounds the first: the agent doesn't know what it doesn't know. The Hermes skills ecosystem has hundreds of specialized skills — each one a proven workflow for a specific task domain. But an agent facing a new challenge often builds from scratch, ignoring existing skills that already solve the problem. It's amnesia *and* blindness.

Team Røst tackled both.

## What We Built

Two deliverables, designed to work together:

### context-bridge (Plugin)

A Hermes plugin that hooks into three session lifecycle events to save and restore context snapshots:

```python
def register(ctx) -> None:
    ctx.register_hook("on_session_end",   _on_session_end)
    ctx.register_hook("on_session_start", _on_session_start)
    ctx.register_hook("on_session_reset", _on_session_reset)
    ctx.register_command(
        "context-bridge",
        handler=_handle_slash,
        description="Preserve and restore context across session resets.",
    )
```

When a session ends or resets, the plugin serializes the agent's tool calls, key findings, and task state into a JSON snapshot. When the next session starts, it detects the prior snapshot and makes it available via the `/context-bridge` slash command. The agent can list, restore, and clear snapshots on demand.

### skill-radar (Skill)

A SKILL.md that teaches agents to systematically discover relevant skills before building from scratch. The workflow is straightforward but disciplined:

```bash
hermes skills list              # inventory what's installed
hermes skills search "keyword"  # search the hub for gaps
hermes skills inspect <id>      # evaluate before installing
hermes skills install <id>      # adopt the right specialization
```

The skill includes a decision framework: search first, browse second, build only when nothing exists. It's the difference between an agent that reinvents the wheel and one that finds the wheel already installed.

## Decision Rationale: Three Hooks, JSON, and Auto-Cleanup

### Why Three Session Hooks?

We considered a single `on_session_end` hook. It wasn't enough. Session resets are the dangerous case — they happen mid-task, often when the context window fills during complex work. The agent hasn't finished; it's been interrupted. A snapshot taken at `on_session_end` captures a completed task. A snapshot taken at `on_session_reset` captures an *in-flight* task with its progress and next steps intact.

```python
def _on_session_reset(session_id: str = "", **kwargs: Any) -> None:
    tool_calls = kwargs.get("tool_calls", [])
    key_findings = kwargs.get("key_findings", [])
    task_state = dict(kwargs.get("task_state", {}))
    task_state["reset_reason"] = kwargs.get("reason", "unknown")
    snapshot = _build_snapshot(
        session_id=session_id,
        reason="session_reset",
        tool_calls=tool_calls,
        key_findings=key_findings,
        task_state=task_state,
    )
    _save_snapshot(snapshot)
```

`on_session_start` is the lighter hook — it doesn't inject context automatically (that would be presumptuous and potentially wrong). It logs that a prior snapshot exists so the agent can retrieve it via `/context-bridge` if the task warrants continuity.

### Why JSON Snapshots?

JSON is human-readable, diffable, and debuggable. When a snapshot captures an agent's state, you want to inspect it — not parse a binary format. JSON also degrades gracefully: a corrupt file is listed as `[CORRUPT]` rather than crashing the plugin.

```python
snapshot = {
    "session_id": session_id or "unknown",
    "profile": _profile_name(),
    "reason": reason,  # "session_end" | "session_reset" | "session_start"
    "timestamp": now.isoformat(),
    "tool_calls": tool_calls,    # capped at 50 entries
    "key_findings": key_findings, # capped at 50 entries
    "task_state": task_state or {},
    "version": "1.0.0",
}
```

### Why Auto-Cleanup?

Without cleanup, snapshots accumulate forever. After a week of heavy use, you'd have hundreds of JSON files cluttering `~/.hermes/context-bridge/snapshots/`. The plugin auto-cleans after every save, keeping only the 10 most recent snapshots per profile:

```python
def _auto_clean(profile: str, keep: int = 10) -> int:
    profile_files = [f for f in snap_dir.iterdir()
                     if f.suffix == ".json" and f.name.startswith(f"{profile}_")]
    if len(profile_files) <= keep:
        return 0
    profile_files.sort(key=lambda p: p.stat().st_mtime)
    to_delete = profile_files[:-keep] if keep > 0 else profile_files
    for f in to_delete:
        f.unlink()
```

Combined with atomic writes (`.tmp` → `os.replace`) and a `threading.Lock()` for thread safety, the design ensures snapshots are durable, bounded, and never corrupt the agent's runtime.

## How We Tested: 20/20

Every test passed on the first run. No syntax errors, no edge-case failures, no concurrent access problems.

| Category | Tests | Result |
|---|---|---|
| Basic verification (syntax, YAML, import) | 3 | ✅ All pass |
| Edge cases (empty data, large data, corruption, concurrency) | 17 | ✅ All pass |
| **Total** | **20** | **20/20** |

The edge cases that mattered most:

- **Large data truncation**: 100 entries capped to 50; snapshot size trimmed to under 10 KB by dropping oldest entries first
- **Corrupted JSON**: Returns `None`, listed as `[CORRUPT]` — never crashes
- **Concurrent access**: 10 threads saving simultaneously; `threading.Lock()` prevents corruption, all 10 snapshots saved
- **Auto-clean**: 15 snapshots → 10 retained, oldest deleted
- **Atomic writes**: No orphan `.tmp` files left after failures
- **All slash subcommands**: `list`, `restore`, `clear`, `help`, and invalid input all handled gracefully

## Expected Impact

Context preservation changes the agent experience fundamentally. Instead of losing hours of investigation to a session reset, the agent retrieves its prior snapshot and continues. The `/context-bridge restore` command surfaces tool calls, key findings, and task state from the previous session — the agent picks up where it left off rather than restarting from scratch.

Skill discovery compounds this. An agent that searches the ecosystem before building finds proven workflows for common tasks — Docker management, GitHub PRs, email handling, PDF creation — instead of reinventing each one. The `skill-radar` decision framework ensures the agent searches thoroughly (multiple keywords, browse pass) before concluding a gap exists and building a new skill.

Together: an agent that remembers what it learned and discovers what it needs. That's a multiplier on effectiveness across every session.

## The Røst Connection: Adaptive Discovery on the Cliff Face

Røst, the southernmost island in the Lofoten archipelago, hosts Norway's largest seabird cliffs. Approximately **25% of Norway's entire seabird population** nests here — puffins, guillemots, kittiwakes, sea eagles, razorbills, cormorants — hundreds of species packed onto vertical rock faces above the freezing Norwegian Sea.

What makes this remarkable isn't just the density. It's the *specialization*. No single species fills every niche. Puffins dive for sand eels at depth. Guillemots chase fish underwater with their wings. Kittiwakes nest on impossibly narrow ledges. Sea eagles — Norway's largest bird of prey, with wingspans exceeding 2.4 meters — patrol from above. Each species *discovered* its niche through evolutionary adaptation to the harsh Arctic environment, and the colony thrives because no bird tries to do everything.

This is exactly the problem agents face.

An agent encountering a new task is like a seabird encountering a changing Arctic — the old strategies may not work, and survival depends on finding the right adaptation quickly. The `hermes skills` ecosystem is the cliff face: dense with specialized skills, each evolved for a specific niche. **skill-radar** is the agent's adaptive instinct — scan the ecosystem, evaluate which skill fills the current gap, adopt it. When no existing specialization fits, evolve a new one.

And **context-bridge** is the memory that makes adaptation cumulative. Røst's puffins return to the same nesting ledge season after season, carrying the memory of successful foraging grounds. They don't rediscover the fishing spots each year — they build on what worked. context-bridge does the same for agents: preserving hard-won findings across session boundaries so the next session picks up where the last one left off, rather than starting from zero on the cliff edge.

The colony is resilient because it's diverse *and* because it remembers. An agent ecosystem with the same properties — rich skills, preserved context — is resilient in the same way.

---

*Team Røst — Adaptive Discovery. SMF Works Lofoten Challenge.*