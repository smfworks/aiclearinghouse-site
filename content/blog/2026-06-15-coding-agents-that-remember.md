---
slug: "2026-06-15-coding-agents-that-remember"
title: "Coding Agents That Remember: The Skill Library Revolution"
excerpt: "Three open-source projects just proved that coding agents can learn from their wins — not by fine-tuning, but by building libraries of plain-text skills."
date: "2026-06-15"
author: "Aiona Edge"
authorKey: "aiona"
series: "terminal"
categories: ["Local LLMs", "AI Engineering", "Coding Productivity"]
tags: []
readTime: 6
image: "/images/blog/2026-06-15-coding-agents-that-remember.png"
originalUrl: "https://smfworks.com/the-terminal/2026-06-15-coding-agents-that-remember"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-06-15-coding-agents-that-remember"
---
# Coding Agents That Remember: The Skill Library Revolution

*The Terminal — Where code meets craft. Technical intelligence for the Linux AI era.*

In the past ten days, three independent projects shipped the same feature: coding agents that learn from successful sessions and turn them into reusable skills. Not by fine-tuning. Not by stuffing transcripts into context. By writing plain-text skill files that future sessions can read, edit, or delete.

This is not a coincidence. It is a threshold.

**MiMo Code** (Xiaomi) shipped with layered checkpoint memory and a `/distill` command that extracts recurring workflows into reusable skills. **joe** (open-source terminal agent) added manual skill synthesis after every multi-step session that actually worked. **komi-learn** (Claude Code/Codex plugin) runs a background loop that distills durable lessons and loads them automatically at session start.

All three arrived within a week of each other. All three solve the same problem that every coding agent user knows: *the agent forgets everything when you close the terminal.*

## The Problem: Two Bad Options

Most coding agents handle memory in one of two broken ways.

**Option 1: Total amnesia.** Every session starts from zero. The agent does not know your stack, your conventions, or that you already solved this exact problem yesterday. This is Claude Code without `CLAUDE.md`, Cursor without rules files, most agents out of the box.

**Option 2: Fine-tuning on noise.** The agent "learns" by training on past conversations, hoping the gradient sorts signal from noise. The result is catastrophic forgetting (learning new things makes it worse at old things), opaque failures (you cannot debug a weight update), and a constant fear that the agent just unlearned something important.

Both options treat memory as a passive storage problem. The new approach treats it as an active curation problem.

## The Pattern: Skill Libraries

Here is how the three projects implement the same idea:

| Project | Trigger | Skill Format | Integration |
|---------|---------|--------------|-------------|
| **joe** | Manual (`/synthesize` after a working session) | Markdown file with name, triggers, and reusable steps | Injected into prompt when triggers match |
| **MiMo Code** | `/distill` command or automatic every 30 days | Structured skill documents + SOPs | Loaded at session start; background writer updates |
| **komi-learn** | Automatic background distill after each session | Semantic lesson records + community pool | Recalled automatically at next session start |

The common thread: **skills are plain text.** Not embeddings. Not fine-tuned weights. Not black-box vectors. Just Markdown files with names, trigger keywords, and step-by-step instructions that a future agent can follow.

This matters because plain text is inspectable. If a skill is wrong, you open the file and fix it. If it is outdated, you delete it. There is no opaque tensor to debug, no gradient to reverse.

## joe: Learning From Wins, Not Just Corrections

The most philosophically honest implementation comes from **joe**, a terminal coding agent that runs entirely on local models through Ollama. Its author built something most agents miss: a learning loop for *successes*, not just failures.

joe already learned from corrections. Every time the user hit `/undo`, a background loop distilled the correction into preference rules injected into future prompts. But joe learned nothing from sessions that worked perfectly. The new feature fixes that:

```bash
# After a multi-step session that worked:
/synthesize

# joe reads the transcript and decides:
# "Does this contain a generalizable procedure worth keeping?"
# If yes, it writes a skill to ~/.joe-agent/skills/
```

A skill looks like this:

```markdown
# Skill: Migrate React Class Components to Hooks

## Triggers
- "refactor class component"
- "convert to hooks"
- "class to functional component"

## Steps
1. Identify lifecycle methods in the class component
2. Map componentDidMount + componentWillUnmount to useEffect
3. Map componentDidUpdate to useEffect with dependency array
4. Convert this.state to useState calls
5. Convert this.props to destructured props
6. Remove the class boilerplate (extends React.Component, render())
7. Run tests to verify behavior parity
8. Add a note about edge cases (getSnapshotBeforeUpdate, etc.)

## Last Used
2026-06-10
## Success Rate
3/3 sessions (confirmed by user acceptance)
```

The key design choice: **synthesis is manual.** The user runs `/synthesize` and reviews the result before it enters the library. This is slower than automatic extraction, but it prevents skill pollution — the accumulation of low-quality, one-off procedures that degrade agent performance over time.

The next feature in joe's roadmap is the ledger: tracking which skills earn their place (used and accepted) and which ones get corrected or ignored. Skills that underperform get pruned. This closes the loop: write from wins, measure against corrections, keep what works.

## MiMo Code: Layered Memory for Long-Horizon Tasks

Xiaomi's **MiMo Code** takes a different approach: four memory layers working together.

1. **Session checkpoints** — saved at 20%, 45%, and 70% of context budget via a background writer subagent
2. **Project knowledge (MEMORY.md)** — persistent across sessions, updated by `/dream` every 7 days
3. **Global user preferences** — across all projects
4. **SQLite history trace** — raw message lookup for debugging

The `/distill` command runs every 30 days and extracts recurring patterns into skills, custom CLI commands, and SOP documents. The `/dream` command runs weekly to compress scattered memories into a current-state representation.

The architectural insight: **separate the agent doing work from the agent managing memory.** MiMo Code's checkpoint writer is a subagent that operates outside the main agent's attention and token budget. It cannot be interrupted by the main task, cannot hallucinate into the working context, and runs only when utilization is low.

```bash
# After a long project phase:
/dream
# Independent agent reads historical sessions + MEMORY.md
# Merges, deduplicates, verifies paths, compresses to current state

# Extract recurring workflows:
/distill
# Reads history, extracts patterns, writes skills + SOPs
```

MiMo Code is open-source under MIT license and runs on the free MiMo Auto channel (MiMo-V2.5, 1M context window) or any OpenAI-compatible API. It is a serious alternative to Claude Code for developers who want provider control and file-based memory.

## komi-learn: Continuous Memory Without Commands

**komi-learn** is the most seamless implementation: a Python plugin for Claude Code and Codex that installs invisibly and just works.

```bash
pip install komi-learn
komi-learn install
# From now on: recall and distill happen automatically
```

The loop:

1. **Recall** — at session start, relevant learnings are loaded from context
2. **Distill** — after the session, a background pass extracts durable lessons
3. **Curate** — overlapping lessons are merged, stale ones archived
4. **Share** (optional) — general lessons contributed to a community pool

The community pool is clever: a GitHub repo of signed Markdown files, content-addressed with BLAKE3, signed with Ed25519. Contributions are scrubbed of identifying information and never leave your machine without explicit approval. The account count of signers acts as a Sybil-resistant advisory signal — not a hard trust gate, but a ranking input.

What makes komi-learn different is the filtering. Before the LLM ever sees a session transcript, a deterministic check filters out secrets, machine-specific paths, one-off failures, and tool complaints. Only generalizable, successful patterns make it to the distillation step.

## Why This Works on Local Hardware

The skill library approach is not just philosophically cleaner — it is practically necessary for local-first agents.

Fine-tuning a model requires GPU hours, infrastructure, and expertise. A skill library requires `mkdir -p ~/.agent/skills` and a text editor. On a consumer laptop running a 7B or 8B model through Ollama, there is no other way to get genuine lifelong learning without sending data to the cloud.

The Voyager paper (2023) proved this in Minecraft: an agent with a growing library of executable skills compounded its abilities without touching model weights. The coding agent community is now rediscovering the same principle. The constraints are different (code is verifiable, unlike Minecraft crafting), but the architecture is the same.

## Practical Implementation for OpenClaw Agents

If you are building an OpenClaw agent on Linux, adding skill library memory is straightforward:

```python
# ~/.openclaw/skills/skill_library.py
import json
import hashlib
from pathlib import Path
from datetime import datetime

SKILLS_DIR = Path.home() / ".openclaw" / "skills" / "library"
SKILLS_DIR.mkdir(parents=True, exist_ok=True)

class SkillLibrary:
    def __init__(self, skills_dir: Path = SKILLS_DIR):
        self.skills_dir = skills_dir
        self.skills = self._load_all()
    
    def _load_all(self) -> dict:
        skills = {}
        for path in self.skills_dir.glob("*.md"):
            skills[path.stem] = self._parse_skill(path.read_text())
        return skills
    
    def _parse_skill(self, content: str) -> dict:
        # Simple frontmatter parser
        lines = content.split('\n')
        skill = {"triggers": [], "steps": [], "metadata": {}}
        section = None
        for line in lines:
            if line.startswith("## Triggers"):
                section = "triggers"
            elif line.startswith("## Steps"):
                section = "steps"
            elif line.startswith("## "):
                section = "metadata"
            elif line.startswith("- ") and section == "triggers":
                skill["triggers"].append(line[2:].strip())
            elif line.startswith("## Last Used") or line.startswith("## Success Rate"):
                key, val = line[3:].split(":", 1)
                skill["metadata"][key.strip()] = val.strip()
        return skill
    
    def find_relevant(self, query: str) -> list:
        """Find skills whose triggers match the query."""
        matches = []
        for name, skill in self.skills.items():
            for trigger in skill["triggers"]:
                if trigger.lower() in query.lower():
                    matches.append((name, skill))
                    break
        return matches
    
    def inject_into_prompt(self, query: str, base_prompt: str) -> str:
        """Append relevant skills to the system prompt."""
        relevant = self.find_relevant(query)
        if not relevant:
            return base_prompt
        
        skill_text = "\n\n## Relevant Skills from Past Sessions\n"
        for name, skill in relevant[:3]:  # Top 3 matches
            skill_text += f"\n### {name}\n"
            for step in skill["steps"]:
                skill_text += f"{step}\n"
        
        return base_prompt + skill_text
```

The integration point: before each agent turn, check the user's request against the skill library. If triggers match, inject the skill steps into the system prompt. The agent now has context from its own past successes.

## The Honest Limitations

Skill libraries are not magic. The quality of a synthesized skill depends on the orchestrator model that writes it. On a small local model, the output sometimes needs human editing before it earns its place. joe's manual synthesis step exists for exactly this reason.

There is also the pruning problem. A skill library that only grows becomes noise. joe's planned ledger, MiMo Code's `/dream` compression, and komi-learn's curation loop all address this, but none are fully automatic yet. Someone — human or agent — has to decide what stays.

## The Terminal Verdict

Three projects, one pattern, one week. That is not a feature trend — that is an architecture consensus forming.

The insight is simple: coding agents do not need to be retrained to get smarter. They need a library of things they already figured out, written in a format they can read and you can audit.

For Linux developers running local AI, this is the first memory architecture that actually fits the constraints: no cloud dependency, no opaque weights, no infrastructure. Just Markdown files in a directory that grows with your project.

**Threshold crossed:** The gap between "agent that codes" and "agent that learns" is closing — and it is closing on local hardware, with open-source tools, using file formats that already exist.

---

*Published June 15, 2026. The Terminal covers OpenClaw on Linux, local LLMs, Google Workspace integration, and AI-powered developer productivity — three times weekly.*

**Flagged for X Pipeline:**

> "Most coding agents handle memory in one of two broken ways: total amnesia, or fine-tuning on noise. Three open-source projects just proved there is a third option."

> "A skill library is cheap, interpretable, and reversible. It fits the constraints honestly instead of pretending you have a datacenter."

> "The gap between 'agent that codes' and 'agent that learns' is closing — on local hardware, with open-source tools, using Markdown files."
