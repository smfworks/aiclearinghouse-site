---
slug: "debugging-hermes-ai-agents-systematic-approach"
title: "Debugging Hermes AI Agents: A Systematic Approach When Your Agent Goes Wrong"
excerpt: "When Hermes loops, hallucinates tool calls, or silently fails — here's the diagnostic framework that actually works. From session replay to tool-call tracing, these are the techniques that separate 3am debugging sessions from 10-minute fixes."
date: "2026-06-18"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Developer Tools", "Debugging", "AI Engineering"]
tags: []
readTime: 11
image: "/images/blog/debugging-hermes-ai-agents-systematic-approach.svg"
originalUrl: "https://smfworks.com/blog/debugging-hermes-ai-agents-systematic-approach"
canonicalUrl: "https://www.smfclearinghouse.com/blog/debugging-hermes-ai-agents-systematic-approach"
---
# Debugging Hermes AI Agents: A Systematic Approach When Your Agent Goes Wrong

You've set up Hermes. You've built skills. You've automated your cron jobs. Everything is humming along — until it isn't.

The agent loops on the same error. A skill produces garbage output. A cron job silently fails at 5 AM and you don't find out until noon. Your session disconnects mid-task and you lose an hour of context.

This is the post I wish I'd had six months ago. Not a list of symptoms and fixes — a framework for actually diagnosing what's happening inside your agent's reasoning chain when things go wrong.

## The Debugging Posture

Before we get into specific failure modes, here's the mental model shift that matters: **Hermes debugging is not like debugging regular code.**

Regular code has deterministic failures. The stack trace points you at a line. The bug is in the logic. You fix the logic, the bug goes away.

Hermes failures are often reasoning failures — the agent made a wrong assumption, used the wrong tool, or followed a plausible-but-incorrect chain of thought. The failure manifests downstream, but the cause is upstream in the context or the prompt.

This means:
- **Don't fix the symptom. Fix the cause.**
- **More context isn't always better — it's sometimes the cause.**
- **The tool call log is your primary debugging artifact.**

## Failure Mode 1: The Infinite Loop

**Symptoms:** The agent repeats the same tool call, the same question, or the same sequence of steps without making progress. The conversation grows until you hit context limits or you kill the session.

**Root causes (in order of likelihood):**

1. **Missing success condition** — The prompt never told the agent when it was done, so it keeps trying.
2. **Tool produces same input it received** — A `read_file` → `patch` cycle that doesn't actually change the target.
3. **Circular dependency in the plan** — Step 3 requires output from step 7, which requires step 3.
4. **Conflicting constraints** — "Write comprehensive tests" and "don't modify the existing API" in the same prompt.

**Diagnostic steps:**

```python
# Run this in a separate session to analyze the problematic conversation
from hermes_tools import session_search

# Find the loop pattern - search for repeated tool calls
results = session_search(
    query="terminal read_file terminal read_file",
    limit=3,
    role_filter="tool"
)

# Check if the same file is being read repeatedly
for session in results['sessions']:
    tool_calls = [m for m in session['messages'] if m['role'] == 'tool']
    file_reads = [m for m in tool_calls if 'read_file' in str(m.get('tool_call', ''))]
    
    if len(file_reads) > 5:
        print(f"Possible loop detected: {len(file_reads)} read_file calls")
        print(f"Session: {session['session_id']}")
```

**The fix:**

If it's a missing success condition, add one explicitly:

```
You are done when:
1. All files matching *.test.ts have passing tests (run npm test to verify)
2. No new *.test.ts files were created
3. Stop immediately after npm test passes — do not continue to other tasks
```

If it's a tool loop, inject a "seen" check:

```python
def process_with_dedup(files, processor):
    """Process files but skip any that were processed in the last 3 tool calls."""
    seen_recently = []
    
    for filepath in files:
        if filepath in seen_recently[-3:]:
            print(f"Skipping {filepath} — recently processed")
            continue
        
        result = processor(filepath)
        seen_recently.append(filepath)
        
        if 'error' in result:
            return result  # Stop on first error
    
    return {"status": "ok", "processed": len(files)}
```

## Failure Mode 2: Hallucinated Tool Calls

**Symptoms:** The agent calls a tool that doesn't exist, or calls a tool with arguments that don't match the schema. You see errors like "Unknown tool" or "Invalid arguments for tool X."

**Root causes:**

1. **Model hallucinating tool names** — Common with smaller models or when the system prompt is ambiguous about available tools.
2. **Toolsets not loaded** — The agent doesn't know which tools are available because the profile's toolsets are misconfigured.
3. **Schema mismatch** — The tool definition changed but the agent's context still has the old schema.

**Diagnostic steps:**

```bash
# Check which toolsets are loaded in your profile
hermes config get --profile default toolsets

# Verify a specific tool exists
hermes tools list | grep <tool_name>

# Check the actual tool schema
hermes tools schema <tool_name>
```

**The fix:**

First, verify your toolsets are correct:

```yaml
# ~/.hermes/profiles/default/config.yaml
toolsets:
  - terminal
  - file
  - browser
  - session_search
  - skills
  # Remove any that aren't installed or configured
```

Second, if a model consistently hallucinates tool names, add explicit tool descriptions to your system prompt:

```
Available tools (use these EXACT names, do not invent new ones):
- terminal: Execute shell commands, returns stdout/stderr/exit_code
- read_file: Read file contents, returns {"content": "...", "total_lines": N}
- write_file: Write content to file, overwrites existing content
- patch: Find-and-replace edit in a file
- search_files: Regex search in files or find by glob pattern
- browser_navigate: Navigate to URL in browser session
- browser_snapshot: Get current page accessibility tree
- delegate_task: Spawn subagent for independent parallel work
```

## Failure Mode 3: Silent Failure

**Symptoms:** The agent completes a task but produces no output, or produces output that doesn't match what was requested. No error messages, but the result is wrong.

**Root causes:**

1. **Context window overflow** — The agent truncated or stopped early due to context limits.
2. **Output parsing failure** — The agent's response was parsed incorrectly by the caller.
3. **Missing input validation** — The agent proceeded with missing or null inputs.
4. **Model refusal** — The model decided the request was inappropriate and returned a safe-but-useless response.

**Diagnostic steps:**

```python
# Check session for truncation markers
def analyze_session_quality(session_id):
    """Check for silent failure indicators in a session."""
    from hermes_tools import session_search
    
    session = session_search(session_id=session_id)
    
    indicators = {
        "truncation": False,
        "empty_outputs": [],
        "tool_errors": [],
        "late_stops": []
    }
    
    for msg in session['messages']:
        content = str(msg.get('content', ''))
        
        # Check for truncation
        if '[TRUNCATED]' in content or '...continued' in content:
            indicators['truncation'] = True
        
        # Check for tool errors
        if msg.get('role') == 'tool':
            tool_result = msg.get('content', {})
            if isinstance(tool_result, dict) and 'error' in tool_result:
                indicators['tool_errors'].append(tool_result['error'])
        
        # Check for empty outputs
        if msg.get('role') == 'assistant':
            if len(content.strip()) < 50:
                indicators['empty_outputs'].append(content[:100])
    
    return indicators

# Example usage
results = analyze_session_quality("your-session-id")
if results['truncation']:
    print("⚠️ Session was truncated — increase context or reduce task scope")
if results['tool_errors']:
    print(f"⚠️ {len(results['tool_errors'])} tool errors occurred")
```

**The fix:**

For context truncation, add explicit truncation handling to your prompts:

```
IMPORTANT: If you are running low on context space (more than 80% used):
1. Summarize what you've done so far
2. State what remains to be done
3. STOP and report — do not continue blindly

You have approximately N tokens remaining. Budget accordingly.
```

For silent empty outputs, add a validation step:

```python
def validate_output(output, expected_keys):
    """Validate that output contains expected structure."""
    if not output:
        return {"valid": False, "error": "Empty output received"}
    
    if isinstance(output, dict):
        missing = [k for k in expected_keys if k not in output]
        if missing:
            return {"valid": False, "error": f"Missing keys: {missing}"}
    
    return {"valid": True}

# Use in your workflow
result = delegate_task(goal="Extract all function names from main.py")
validation = validate_output(result, ["functions", "count"])

if not validation['valid']:
    print(f"Output validation failed: {validation['error']}")
    # Re-run or alert
```

## Failure Mode 4: Context Pollution

**Symptoms:** The agent starts responding to old parts of the conversation, references files or variables that no longer exist, or mixes up context from different tasks.

**Root causes:**

1. **Session memory bleed** — Previous task context wasn't cleared between tasks.
2. **Skill context leaking** — A loaded skill injected context that conflicts with the current task.
3. **Mid-session edits** — Files were modified outside the agent's awareness.

**Diagnostic steps:**

```python
# Check what memory is loaded in the current session
def audit_session_context():
    """Report what's currently in the session context."""
    from hermes_tools import session_search
    
    # Get recent messages to understand current context
    recent = session_search(limit=1)
    
    # Look for context pollution indicators
    pollution_signals = [
        "earlier we discussed",
        "as I mentioned before",
        "continuing from",
        "going back to"
    ]
    
    issues = []
    for session in recent['sessions']:
        for msg in session['messages'][-10:]:
            content = str(msg.get('content', '')).lower()
            for signal in pollution_signals:
                if signal.lower() in content:
                    issues.append(f"Possible context confusion: '{signal}' found")
    
    return {"context_pollution_risk": len(issues) > 0, "issues": issues}

# Run before starting a new task
audit = audit_session_context()
if audit['context_pollution_risk']:
    print("⚠️ Context pollution detected — consider starting fresh session")
```

**The fix:**

The nuclear option is a fresh session per task:

```bash
# Start fresh session with explicit context
hermes --session "task-$(date +%Y%m%d-%H%M%S)" --clear-memory

# Or within a session, explicitly clear before new tasks
# Add to your prompt:
"""
=== NEW TASK ===
Previous context is now invalidated. Start fresh for this task only.
Do not reference anything from previous conversations.
"""
```

For skills that cause context pollution, audit them:

```bash
# List all skills and their token cost
ls ~/.hermes/skills/*/SKILL.md | while read skill; do
    tokens=$(wc -c < "$skill")
    echo "$(basename $(dirname $skill)): $((tokens / 4)) tokens"
done | sort -t: -k2 -n
```

## Failure Mode 5: Skill Failures

**Symptoms:** A specific skill runs but produces wrong output, or runs successfully but the agent ignores its guidance.

**Root causes:**

1. **Skill not loaded** — The skill exists but wasn't picked up by the agent.
2. **Skill schema mismatch** — The skill's frontmatter doesn't match how the agent searches for skills.
3. **Skill content contradicts system prompt** — Conflicting instructions confuse the agent.
4. **Outdated skill** — The skill was updated but the agent loaded the old version.

**Diagnostic steps:**

```bash
# Check which skills are active
hermes skills list

# Verify skill is properly formatted
cat ~/.hermes/skills/your-skill/SKILL.md | head -20

# Force reload a specific skill
hermes skills reload your-skill
```

**The fix:**

Skills need proper frontmatter to be discovered:

```yaml
---
name: "your-skill-name"        # Must match directory name
description: "What this skill does in one sentence"
trigger: "when the user asks about X"  # Helps agent discover skill
category: "coding"             # Optional, for organization
version: "1.0.0"
---

# Skill content here
```

If a skill is being ignored, check for conflicts:

```python
def diagnose_skill_conflicts(skill_name):
    """Find skills that might conflict with a given skill."""
    import os
    import re
    
    skill_dir = os.path.expanduser(f"~/.hermes/skills/{skill_name}")
    skill_content = open(f"{skill_dir}/SKILL.md").read()
    
    # Extract key phrases from the skill
    key_phrases = re.findall(r'(?:do|do not|always|never|must|should)\s+[^\.]+', skill_content)
    
    conflicts = []
    for other_skill in os.listdir(os.path.expanduser("~/.hermes/skills")):
        if other_skill == skill_name:
            continue
        
        other_content = open(f"~/.hermes/skills/{other_skill}/SKILL.md").read()
        
        for phrase in key_phrases:
            if phrase[:20] in other_content:
                conflicts.append(f"{skill_name} phrase conflicts with {other_skill}")
    
    return conflicts
```

## The Debugging Toolkit

Here's my standard debugging setup for Hermes:

```bash
# 1. Enable verbose logging
export HERMES_LOG_LEVEL=debug

# 2. Set up session replay
alias hermes-replay='hermes sessions replay --last'

# 3. Tool call audit
hermes tools audit --verbose

# 4. Profile health check
hermes profile health --profile default
```

And the session analysis script I run when something goes wrong:

```python
#!/usr/bin/env python3
"""Hermes Session Debugger - Analyze a session for failure patterns."""

import sys
import json
from hermes_tools import session_search, terminal

def analyze_session(session_id=None):
    if not session_id:
        # Get most recent session
        recent = session_search(limit=1)
        session_id = recent['sessions'][0]['session_id']
        print(f"Analyzing most recent session: {session_id}")
    
    session = session_search(session_id=session_id)
    
    report = {
        "session_id": session_id,
        "total_messages": len(session['messages']),
        "tool_calls": 0,
        "errors": [],
        "warnings": [],
        "tool_patterns": {}
    }
    
    for msg in session['messages']:
        if msg.get('role') == 'tool':
            report['tool_calls'] += 1
            tool_name = msg.get('tool_call', 'unknown')
            report['tool_patterns'][tool_name] = report['tool_patterns'].get(tool_name, 0) + 1
            
            # Check for errors
            content = msg.get('content', {})
            if isinstance(content, dict) and 'error' in content:
                report['errors'].append({
                    "tool": tool_name,
                    "error": content['error']
                })
        
        # Check for warning patterns
        content = str(msg.get('content', ''))
        warning_signals = ["not sure", "uncertain", "might be", "could be", "perhaps"]
        for signal in warning_signals:
            if signal in content.lower():
                report['warnings'].append(f"Hedging language detected: '{signal}'")
    
    return report

if __name__ == "__main__":
    session_id = sys.argv[1] if len(sys.argv) > 1 else None
    report = analyze_session(session_id)
    print(json.dumps(report, indent=2))
```

## Quick Reference: Failure Mode → Fix

| Failure Mode | Quick Fix |
|-------------|-----------|
| Infinite loop | Add explicit success condition, check for tool loops |
| Hallucinated tools | Verify toolsets loaded, add explicit tool list to prompt |
| Silent failure | Add output validation, check for truncation |
| Context pollution | Start fresh session, audit loaded skills |
| Skill ignored | Check frontmatter, force reload, look for conflicts |

## The Meta-Pattern

Here's what I've learned after a year of debugging Hermes agents:

**Every failure is a communication failure.** The agent did exactly what you told it to do — the problem is that what you told it to do wasn't what you meant. Fix the communication, not the agent.

This means:
- Explicit is better than implicit
- Success conditions prevent loops
- Bounded tasks beat open-ended ones
- Validation catches silent failures
- Fresh sessions prevent context pollution

The debugging session is a conversation about what you actually meant versus what the agent actually heard. Get those two things aligned, and most failures disappear.

---

*This post is part of Liam's Landing — practical engineering guides for building with AI agents. For more debugging patterns and agent resilience techniques, [subscribe to SMF AI Weekly](https://smfworks.com/subscribe).*