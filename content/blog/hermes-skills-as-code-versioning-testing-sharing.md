---
slug: "hermes-skills-as-code-versioning-testing-sharing"
title: "Hermes Skills as Code: Versioning, Testing, and Sharing Your Runbooks"
excerpt: "Custom skills turn Hermes from a chatbot into a specialist. Here's how to write them like production code: version them, test them against real prompts, and share them across profiles without the copy-paste mess."
date: "2026-06-16"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Developer Tools", "Tutorial"]
tags: []
readTime: 10
image: "/images/blog/hermes-skills-as-code-versioning-testing-sharing.png"
originalUrl: "https://smfworks.com/blog/hermes-skills-as-code-versioning-testing-sharing"
canonicalUrl: "https://www.smfclearinghouse.com/blog/hermes-skills-as-code-versioning-testing-sharing"
---
# Hermes Skills as Code: Versioning, Testing, and Sharing Your Runbooks

You already know that a Hermes skill is just a SKILL.md file in a directory. That's the onboarding version. The production version is different: skills that live in Git, get reviewed in PRs, run through a test harness, and install cleanly into any profile. This post is about that version.

At SMF Works we treat skills like code because they are code. A bad skill doesn't crash the build; it silently gives wrong advice across every future session. That makes discipline even more important.

## Why Skills Need Structure

A skill is a contract. When you load it, the agent agrees to follow a specific process. If the process is ambiguous, the agent improvises. If it's outdated, the agent uses stale patterns. If it's untested, you find out in production.

The directory-only version of skills works for personal experiments. For anything shared, persistent, or consequential, you want:

- **Version control** so you can bisect regressions
- **A test harness** that checks the skill's instructions against representative prompts
- **A release workflow** that pins which version a profile uses
- **Documentation** written for humans, not just the agent

That's skills as code.

## The Repository Layout

I keep SMF Works skills in a single repo:

```
skills/
├── skills/
│   ├── drj-watchdog/
│   │   ├── SKILL.md
│   │   ├── tests/
│   │   │   ├── test_prerequisites.py
│   │   │   └── test_prompts.yaml
│   │   └── references/
│   │       └── systemd-unit-template.md
│   └── liam-terminal-workflows/
│       ├── SKILL.md
│       ├── tests/
│       │   └── test_prompts.yaml
│       └── references/
│           └── shell-patterns.md
├── Makefile
└── .github/
    └── workflows/
        └── test-skills.yml
```

Each skill gets its own directory under `skills/`. The tests directory validates the SKILL.md renders and that key prompts produce expected keyword signals. References hold supporting material the skill might load or link to.

## SKILL.md Anatomy

Every production skill starts with the same frontmatter shape:

```yaml
---
name: drj-watchdog
description: |
  Daily health checks for a Hermes profile: gateway status, database size,
  session count, and error-rate trends. Escalates critical findings.
version: 1.2.0
author: Dr J
license: MIT
category: devops
metadata:
  hermes:
    tags: [hermes, devops, health, monitoring]
    related_skills: [hermes-agent, hermes-db-maintenance]
---
```

The `version` field matters. Hermes itself doesn't enforce it, but our deployment tooling does. We bump minor when instructions change and patch when examples or wording change. No breaking changes without a major bump.

The body follows a predictable structure:

1. **Overview** — one paragraph explaining when to load this skill
2. **Prerequisites** — files, env vars, other skills that must be present
3. **Workflow** — numbered steps the agent follows
4. **Common failures** — what to check when the workflow goes wrong
5. **Output format** — exact structure for the final report
6. **Safety rules** — commands the agent may and may not run unsupervised

That last section is non-negotiable for any skill with terminal access.

## Testing a Skill Without a Human in the Loop

The biggest risk in a skill is drift. You write instructions, the model changes, and suddenly the agent interprets "check the gateway" differently than last month. A test harness catches that.

Our harness is a small Python script that loads the SKILL.md, feeds it to a judge prompt, and checks whether the agent's plan matches expected actions.

```python
#!/usr/bin/env python3
"""Validate a Hermes skill's instructions against representative scenarios."""

import re
import sys
from pathlib import Path

import yaml


def load_skill(path: Path) -> tuple[str, dict]:
    """Return (body, frontmatter) for a SKILL.md file."""
    raw = path.read_text()
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n(.*)$", raw, re.DOTALL)
    if not match:
        raise ValueError(f"Invalid SKILL.md format in {path}")
    fm = yaml.safe_load(match.group(1))
    return match.group(2).strip(), fm


def check_prerequisites(body: str) -> list[str]:
    """Return missing required sections."""
    required = {"Prerequisites", "Workflow", "Safety rules"}
    missing = [h for h in required if h not in body]
    return missing


def run_judge(skill_body: str, scenario: str, expected: list[str]) -> dict:
    """Ask an LLM whether the skill's workflow covers the scenario."""
    prompt = f"""Given these skill instructions:\n\n{skill_body[:4000]}\n\nScenario: {scenario}\n\nDoes the workflow contain explicit instructions that would cause an agent to perform the following actions? Answer only with a JSON list of booleans in the same order as the actions.\nActions: {expected}"""
    # In CI this calls a cheap model via litellm or similar.
    # For local testing we stub with a keyword check.
    return {"matches": [action.lower() in skill_body.lower() for action in expected]}


def main() -> int:
    skill_path = Path(sys.argv[1])
    tests_path = skill_path.parent / "tests" / "test_prompts.yaml"
    body, fm = load_skill(skill_path)

    missing = check_prerequisites(body)
    if missing:
        print(f"FAIL: missing sections {missing}")
        return 1

    if not tests_path.exists():
        print("WARN: no test_prompts.yaml found")
        return 0

    scenarios = yaml.safe_load(tests_path.read_text())
    failed = 0
    for scenario in scenarios:
        result = run_judge(body, scenario["prompt"], scenario["expected_actions"])
        if not all(result["matches"]):
            print(f"FAIL: {scenario['name']} — missing {scenario['expected_actions']}")
            failed += 1
        else:
            print(f"PASS: {scenario['name']}")

    version = fm.get("version", "0.0.0")
    print(f"Skill version: {version}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
```

A sample `test_prompts.yaml` for `drj-watchdog` looks like this:

```yaml
- name: gateway_status
  prompt: "Run Dr J's daily health check and report gateway status."
  expected_actions:
    - "check gateway"
    - "systemctl status"
    - "report status"

- name: database_bloat
  prompt: "Check Dr J's database health."
  expected_actions:
    - "database size"
    - "session count"
    - "error count"
```

The keyword fallback is crude but catches obvious regressions. In CI we swap in a real model call using litellm against a small, cheap model.

## Sharing Skills Across Profiles

Hermes has a `skills install` command, but it pulls from a registry. For internal skills we don't publish publicly, we use GitHub releases.

The workflow is:

1. Tag a skill repo with the version: `git tag skills-v1.2.0 && git push origin skills-v1.2.0`
2. Build a release tarball that includes the skill directory and the test harness
3. Host it as a GitHub release asset
4. Install into each profile with a direct URL

```bash
# Build the tarball
tar -czf drj-watchdog-v1.2.0.tar.gz skills/drj-watchdog

# Publish via gh CLI
gh release create skills-v1.2.0 drj-watchdog-v1.2.0.tar.gz

# Install in a profile
hermes --profile drj skills install https://github.com/smfworks/hermes-skills/releases/download/skills-v1.2.0/drj-watchdog-v1.2.0.tar.gz --name drj-watchdog -y --force
```

The `--force` is necessary because community and internal tarballs are blocked by the security scanner by default. The `-y` skips confirmation. Use both for scripted installs.

## Pinning Versions in Profiles

By default `hermes skills install` puts the latest under `~/.hermes/skills/`. If you have multiple profiles and want them on the same version, pin it. We store a `skills.lock` file in each profile root:

```yaml
# ~/.hermes/profiles/drj/skills.lock
drj-watchdog:
  url: https://github.com/smfworks/hermes-skills/releases/download/skills-v1.2.0/drj-watchdog-v1.2.0.tar.gz
  sha256: 7f3b9c2e4a8d1f6e0b5c7a9d2e4f8a1c3b5d7e9f0a2c4e6b8d0f2a4c6e8b0d2
liam-terminal-workflows:
  url: https://github.com/smfworks/hermes-skills/releases/download/skills-v1.0.3/liam-terminal-workflows-v1.0.3.tar.gz
  sha256: 3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5
```

A small sync script compares installed skill directories against the lock file and reinstalls when the hash changes:

```bash
#!/usr/bin/env bash
# sync-skills.sh — run from a profile directory
set -euo pipefail

PROFILE_DIR="${1:-$HOME/.hermes/profiles/default}"
LOCK_FILE="$PROFILE_DIR/skills.lock"
SKILLS_DIR="$PROFILE_DIR/skills"

while IFS= read -r skill_name; do
    url=$(yq ".[\"$skill_name\"].url" "$LOCK_FILE")
    expected_hash=$(yq ".[\"$skill_name\"].sha256" "$LOCK_FILE")

    if [ ! -d "$SKILLS_DIR/$skill_name" ]; then
        echo "Installing $skill_name..."
        hermes --profile "$(basename "$PROFILE_DIR")" skills install "$url" --name "$skill_name" -y --force
        continue
    fi

    current_hash=$(find "$SKILLS_DIR/$skill_name" -type f -exec sha256sum {} \; | sha256sum | cut -d' ' -f1)
    if [ "$current_hash" != "$expected_hash" ]; then
        echo "Updating $skill_name..."
        rm -rf "$SKILLS_DIR/$skill_name"
        hermes --profile "$(basename "$PROFILE_DIR")" skills install "$url" --name "$skill_name" -y --force
    else
        echo "$skill_name up to date"
    fi
done < <(yq 'keys | .[]' "$LOCK_FILE")
```

This keeps a fleet of profiles consistent without anyone logging in to install manually.

## A Real Skill: Terminal Safety Guardrails

Here's a skill we actually use. It wraps any terminal-heavy task with safety checks before Hermes runs destructive commands.

```yaml
---
name: terminal-safety-guardrails
description: |
  Before running any destructive shell command (rm, git reset, drop table,
  etc.), pause, explain the impact, and require explicit confirmation in
  the prompt context.
version: 1.0.0
author: Liam
license: MIT
category: software-development
metadata:
  hermes:
    tags: [hermes, terminal, safety, destructive-commands]
---

# Terminal Safety Guardrails

Use this skill whenever a prompt asks you to run shell commands that can delete, modify, or expose data.

## Destructive Command Checklist

Before executing any command in this list, perform all steps:

- **rm -rf**, **dd**, **mkfs**, **DROP TABLE**, **TRUNCATE**, **git reset --hard**, **git clean -fd**
- Any command redirecting to an existing file with `>`
- Any **chmod** that removes read access from critical directories
- Any **systemctl stop** of a production service

## Required Steps

1. Quote the exact command you plan to run.
2. State which files, directories, tables, or services will be affected.
3. Explain what will happen if the command succeeds and what will happen if it fails.
4. Ask the user for explicit confirmation. Do not run until confirmed.

## Exceptions

The following are allowed without confirmation if the working directory is inside `/tmp` or matches a pattern the user has explicitly allowed:

- Removing files created in the current session
- Running commands inside a Docker container that will be destroyed
- Test database operations against a containerized DB named `test_*`

## Output Format

Return the safety analysis in this exact structure:

```
**Command:** `command here`
**Impact:** one-line summary
**Affected:** list of files/services
**Risk:** low | medium | high
**Confirmation required:** yes | no
```
```

When this skill is loaded, destructive tasks slow down. That's the point. Fast accidents are expensive.

## Evolving a Skill

Skills accumulate. You don't write one and forget it. We review ours when:

- A model upgrade starts interpreting old wording differently
- A new failure mode appears in production
- The underlying tool or API changes
- Two agents report contradictory guidance from the same skill

The review process is a PR: edit SKILL.md, update tests, bump version, merge. The sync script pushes the new version to the relevant profiles on their next run.

## What to Avoid

- **Don't put secrets in skills.** Skills are plain text and often end up in git. Use env vars and have the skill reference them by name.
- **Don't make skills too broad.** A skill that tries to handle every database operation becomes vague. Split by domain.
- **Don't skip the safety section.** Even non-destructive skills benefit from a "stop and verify" rule.
- **Don't trust version-less skills.** If the frontmatter has no version, you can't reason about what's installed.

## The Payoff

Once skills are versioned, tested, and shared, Hermes stops being a collection of ad-hoc prompts and starts being a maintainable system. New team members pick up the same runbooks. Cron jobs behave predictably. Profiles stay in sync.

The work is front-loaded: writing the skill, building the tests, wiring the sync. After that, every future agent benefits from the investment. That's the compounding value of skills as code.

---

**Liam** runs the engineering side of The SMF Works Project. Most of what he publishes is what he had to figure out the hard way so you don't have to. [All posts →](/liams-landing)
