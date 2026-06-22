---
slug: "getting-started-with-hermes-ai-terminal-coding-partner"
title: "Getting Started with Hermes AI: Your Terminal-Based Coding Partner"
excerpt: "A hands-on guide to installing Hermes Agent, configuring your first model provider, and using terminal tools to write, debug, and ship code with an AI that remembers your project across sessions."
date: "2026-05-22"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Hermes AI"]
tags: []
readTime: 12
originalUrl: "https://smfworks.com/blog/getting-started-with-hermes-ai-terminal-coding-partner"
canonicalUrl: "https://www.smfclearinghouse.com/blog/getting-started-with-hermes-ai-terminal-coding-partner"
---
# Getting Started with Hermes AI: Your Terminal-Based Coding Partner

If you are still copying code from a browser chat window into your editor, you are working harder than you need to. Hermes Agent runs directly in your terminal with full access to your filesystem, git history, and shell — and it remembers what you are building across sessions. This guide walks you from zero to a working coding setup in about fifteen minutes.

## What Hermes Agent Actually Is

Hermes is an open-source AI agent framework from Nous Research. It is not a chatbot you paste snippets into. It is a persistent coding partner that:

- **Reads and writes files directly** — no copy-paste
- **Runs shell commands** — build, test, deploy, all from the agent loop
- **Searches your codebase** — ripgrep-backed search that actually finds what you need
- **Manages git** — branching, committing, PR creation via the `gh` CLI
- **Saves skills and memory** — learns your project conventions and reuses them
- **Connects to any LLM provider** — OpenRouter, Anthropic, OpenAI, DeepSeek, local models, 20+ options
- **Runs on Telegram, Discord, Slack, and 10+ other platforms** — the same agent, full tool access

Think of it as a senior developer who lives in your terminal, has access to every tool you do, and never forgets a project detail.

## Step 1: Install

One line:

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

This pulls the latest release, sets up a Python virtual environment, and installs Hermes under `~/.hermes/`. No global pip installs, no Docker dependency. It takes about 30 seconds.

Verify it worked:

```bash
hermes --version
```

You should see a version number. If not, check that `~/.local/bin` is in your PATH.

## Step 2: Pick a Model Provider

Hermes is provider-agnostic — you swap models without changing your workflow. The fastest way to start is OpenRouter, which gives you access to 200+ models with a single API key.

Run the setup wizard:

```bash
hermes setup
```

Select **OpenAI Router** and paste your API key. That is it. You can change providers later with `hermes model`.

**Free options that work well:**

- **Google Gemini** — `GOOGLE_API_KEY` environment variable, generous free tier
- **Local models** — If you have Ollama or llama.cpp running, point Hermes at localhost

**Recommended for coding:**

- `anthropic/claude-sonnet-4` via OpenRouter — strong code generation and reasoning
- `deepseek/deepseek-v4-pro` via OpenRouter — excellent code-to-price ratio
- `openai/gpt-4o` via OpenAI — reliable all-rounder

Set your model:

```bash
hermes model
# Interactive picker appears — choose provider and model
```

## Step 3: Your First Coding Session

Start an interactive session:

```bash
hermes
```

You will see the Hermes banner and a prompt. Try something real:

```
> Look at the project in the current directory. Tell me what it is, find any 
  failing tests, and fix them.
```

Hermes will:
1. Search the directory for project files
2. Read the test suite and run it
3. Identify failures
4. Edit the source files to fix them
5. Re-run tests to confirm

All without you leaving the terminal. The agent reads files, runs commands, writes patches, and verifies — in a loop, the way a human developer would, but faster.

## Step 4: Persistent Memory

This is where Hermes differs from every other AI tool I have used. It remembers across sessions.

After a session where you established project conventions, tell it:

```
> Remember that this project usespytest with xdist for parallel tests, and 
  all PR descriptions must include a "Why" section.
```

Hermes saves this to memory. Next session, next week, next month — it will recall these facts without you repeating them. No more re-explaining your stack every time you open a chat.

Check what it knows:

```
> What do you know about this project?
```

You can also manually edit memory files:

- `~/.hermes/MEMORY.md` — agent's personal notes
- `~/.hermes/USER.md` — facts about you (preferences, role, conventions)

## Step 5: Skills — The Self-Improving Agent

Memory is for facts. Skills are for procedures. When Hermes learns a workflow that is worth repeating, it saves it as a skill document — a reusable playbook.

Example: after debugging a complex CI failure it might save a skill called `ci-debug-artifacts` that captures the exact steps for diagnosing GitHub Actions failures. Next time CI breaks, it loads that skill automatically and jumps straight to the known workflow.

Skills live in `~/.hermes/skills/`. Browse what you have:

```bash
hermes skills list
```

Install from the community registry:

```bash
hermes skills browse          # Interactive browser
hermes skills install <id>    # Install a specific skill
```

You can also write your own. A skill is just a markdown file with YAML frontmatter and step-by-step instructions. Here is a simple one:

```markdown
---
name: run-lint-and-fix
description: Run the project linter and auto-fix issues
category: software-development
---

# Run Lint and Fix

## Steps

1. Run `npm run lint 2>&1 | head -100` to see current issues
2. If eslint auto-fix is available, run `npm run lint --fix`
3. Run `npm run lint` again to verify zero errors
4. If errors remain, read the error output and fix source files manually

## Pitfalls

- Some lint rules require manual fixes (e.g., rule changes, type assertions)
- Always commit before running lint --fix so you can rollback
```

Save this as `~/.hermes/skills/run-lint-and-fix/SKILL.md` and Hermes will pick it up.

## Step 6: Connect to Your Messaging Platform

You do not have to be at your computer to use Hermes. Connect it to Telegram, Discord, Slack, or any of 15+ platforms and you can send code questions from your phone on the bus.

```bash
hermes gateway setup
```

Pick a platform, configure the token, and restart:

```bash
hermes gateway run
```

Now when you message your bot on Telegram, it has the same full terminal access as your local session. Ask it to deploy a hotfix while you are away from your desk. It will.

For long-running services:

```bash
hermes gateway install    # Install as background service
hermes gateway start      # Start the daemon
```

## Step 7: Cron Jobs — Scheduled Intelligence

Hermes can run tasks on a schedule without you asking. Example: a daily dependency audit.

```bash
hermes cron create "0 9 * * *"
# Then set the prompt when prompted:
# "Check the project in ~/myapp for dependency vulnerabilities using npm audit. 
#  If any critical issues found, send a summary to the #dev-alerts Discord channel."
```

Or from within a session using the `cronjob` tool:

```
> Schedule a weekly PR review every Monday at 8am. Check open PRs on the 
  smfworks-site repo, summarize the key changes, and send the summary to me.
```

Cron jobs run independently — they do not need your terminal session open. The agent wakes up, does the work, and delivers the output wherever you configured.

## A Real Workflow Example

Let me show you what a full session looks like. Here is my actual workflow when I pick up a bug report:

```
> There is a bug in the blog page where posts without images show a broken 
  placeholder. Fix it and open a PR.

Hermes reads the blog page component...
Hermes finds the image rendering logic...
Hermes identifies the null/undefined check is missing...
Hermes patches the file...
Hermes runs npm run build to verify...
Hermes creates a git branch...
Hermes commits with message: "fix: handle missing hero image in blog cards"...
Hermes pushes and opens PR #47 via gh CLI...

Done. PR is at https://github.com/smfworks/smfworks-site/pull/47
```

That entire flow — diagnose, fix, build, test, branch, commit, push, PR — happened in one conversation. No context switching. No terminal proliferation. No "can you also run the tests?" follow-ups because it already did.

## Tips That Took Me Too Long to Learn

**Use `/compress` when context gets long.** Hermes auto-compresses when it hits the token limit, but manually compressing earlier keeps the agent sharper on long sessions.

**Pin your model in cron jobs.** Cron runs inherit whatever model the scheduler has, which might default to something you do not want. Specify the model explicitly.

**Check `hermes doctor` when something feels off.** It validates your config, checks API keys, and flags missing dependencies. It catches 90% of "Hermes is not working" issues in one command.

**Use `--continue` to resume your last session.** Instead of starting fresh, you pick up exactly where you left off:

```bash
hermes --continue
```

**Profiles isolate projects.** If you work on multiple projects with different conventions, create a profile for each:

```bash
hermes profile create client-a --clone
hermes --profile client-a chat
```

Each profile has its own memory, skills, config, and session history. No cross-contamination.

## Where to Go Next

- **Docs:** [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)
- **GitHub:** [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
- **Community:** Join the Nous Research Discord for help and feature requests

The next post in this series will cover advanced terminal workflows — multi-agent orchestration, delegation patterns, and how to configure Hermes for pair programming on complex codebases.

If you get stuck, `hermes doctor` and `hermes setup` solve most problems. If they do not, reach out. I read every issue.

— Liam Hermes  
Chief Development Officer, The SMF Works Project