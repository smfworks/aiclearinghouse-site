---
slug: webwright
title: Webwright — Browser Automation Agent
category: Workflow
excerpt: Drive a local Playwright browser through one bash command at a time to solve web tasks — search, form-fill, multi-step flows, data extraction — with screenshot evidence and reusable scripts.
tags:
  - hermes
  - playwright
  - browser-automation
  - web
  - scraping
  - agents
for: Hermes Agent
author: Community
install: hermes skill install webwright
dependencies:
  - Hermes Agent
  - Python 3.10+
  - Playwright (Firefox)
image: /images/skills/workflow.svg
source: https://github.com/nousresearch/hermes-skills
order: 118
last_verified: "2026-09-02"
---

# Webwright — Browser Automation Agent

## What it is

Webwright is a Hermes Agent skill that automates web tasks by driving a local Playwright browser one bash command at a time. It is a code-as-action agent: instead of clicking through a UI, it writes and executes Python/Playwright scripts that interact with web pages, saves screenshots and an action log for each step, and visually verifies the result against the plan.

The skill works in two modes: a one-shot mode where the script solves the literal task the user specified, and a CLI tool mode that parameterizes the solution into a reusable command-line tool with argparse flags — so you can rerun it later with different inputs without rewriting the script.

No external API keys are required. The agent uses its own native vision capabilities to verify screenshots against the plan, replacing the OpenAI-backed image QA that the original Webwright harness used.

## Who it targets

- Agent developers who need to automate multi-step web workflows (form submission, data extraction, search-and-filter) and want reusable scripts, not one-shot answers.
- Teams that want screenshot evidence of each step for audit or debugging.
- Anyone who has tried Playwright scripting but found the setup and iteration loop tedious — Webwright handles the workspace structure, logging, and verification.

## What it does

1. **Plans the task.** Creates a `plan.md` describing the steps, selectors, and expected outcomes.
2. **Executes one command at a time.** Each step is a bash command that runs a Python/Playwright snippet. Screenshots and an action log are saved to `final_runs/run_<id>/`.
3. **Visually verifies.** After each step, the agent reads the screenshot and checks it against the plan. If the page did not load correctly, a form field was missing, or a button click did not produce the expected result, the agent adjusts and retries.
4. **Produces a reusable script.** In CLI tool mode, the final `final_script.py` is a parameterized CLI with argparse flags — run it with different inputs without rewriting code.

## Dependencies

- Hermes Agent
- Python 3.10+
- Playwright (Firefox browser binary)
- Virtual environment (recommended: `~/.venvs/webwright`)

## How to install

```bash
hermes skill install webwright

# One-time Playwright setup
python3 -m venv ~/.venvs/webwright
source ~/.venvs/webwright/bin/activate
pip install playwright
playwright install firefox
```

## Example usage

```
/user: Search for "AI agent benchmarks 2026" on Google, extract the top 5 results with titles and URLs, and save them as a CSV file.

/agent: I'll plan this web automation task and execute it step by step.
  Created plan.md with steps:
  1. Navigate to google.com
  2. Enter search query
  3. Wait for results
  4. Extract titles and URLs from top 5 results
  5. Save to CSV

  Step 1: Navigate to google.com → screenshot saved → verified: Google homepage loaded
  Step 2: Enter search query → screenshot saved → verified: Search results displayed
  Step 3: Extract results → screenshot saved → verified: 5 results captured
  Step 4: Save to results.csv → verified: File written with 5 rows

  Done. Results saved to final_runs/run_001/results.csv.
  The script is parameterized — rerun with: python3 final_script.py --query "your query" --limit 10
```

## Why this matters

Browser automation is one of the highest-value, highest-friction tasks for AI agents. The friction comes from three places: the iteration loop (write script, run, see what happened, rewrite), the verification problem (did the click actually work?), and the reusability gap (the script works for this exact input but breaks on the next). Webwright addresses all three by structuring the workspace with screenshots and logs at each step, using the agent's own vision to verify, and producing a parameterized CLI as the final artifact. It is a practical example of code-as-action agent design — the agent writes code, runs it, checks the result visually, and iterates.