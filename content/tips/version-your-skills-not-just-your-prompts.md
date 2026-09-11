---
slug: version-your-skills-not-just-your-prompts
title: Version Your Skills, Not Just Your Prompts
category: Workflow
excerpt: Skills are code, not configuration. Treat them like any other dependency — version, test, and review changes before they ship to your agent.
tags:
  - skills
  - versioning
  - hermes
  - agent-ops
  - workflow
order: 102
last_verified: "2026-09-09"
---

# Version Your Skills, Not Just Your Prompts

## The principle

You version your prompts. You version your models. But most teams treat skills as static configuration files that never change. That is wrong. Skills are code — they contain logic, tool invocations, and behavioral instructions that your agent executes on every run. When a skill changes, your agent's behavior changes. If you cannot answer "what was in the skill that ran this task?", you are flying blind.

## Why it matters

Skills evolve. You fix a bug in a skill's script. You tighten a permission scope. You change which tools the skill is allowed to call. Each of these changes can alter agent behavior in ways that are invisible until something breaks.

The failure pattern is familiar: an agent that worked perfectly last week starts failing this week. The model did not change. The prompt did not change. But someone edited a skill file — maybe tightened a tool allowlist, maybe changed a script's error handling — and now the agent's tool loop breaks on a task that used to work.

If your skills are in version control with meaningful commit messages, you can `git log` the skill, find the change, and understand the regression. If they are not, you are reverse-engineering your own agent's behavior from memory.

## How to apply it

1. **Put skills in version control.** If you use Hermes Agent, your skills live in `~/.hermes/skills/`. That directory should be a git repo, not a pile of untracked files.
2. **Tag skill versions in frontmatter.** Use the `version` field in `SKILL.md`. When you change a skill's logic, bump the version. The curator and the audit trail depend on it.
3. **Write commit messages that describe behavior change, not file change.** "Tightened tool allowlist in social-post-creator" is useful. "Updated skill" is not.
4. **Review skill diffs before they go live.** A skill change is a behavioral change to your agent. Treat it like a code review — diff it, read it, test it before it ships.
5. **Pin skill versions for production agents.** If a production agent depends on a specific skill behavior, pin the version. Do not let auto-updates silently change what your agent does.

## Red flags

- Your skills directory is not in git.
- You edit skill files directly in production without testing.
- A skill's `version` field has not changed but the file content has.
- You cannot reproduce a past agent run because you do not know which skill version was active.
- Someone says "I just tweaked the skill" and you have no diff to review.

## Quick win

Run `git init` in your skills directory today. Commit the current state. Next time you edit a skill, commit with a message that describes what behavior changed. In a month, you will have a behavioral history of your agent — and when something breaks, you will have the diff.