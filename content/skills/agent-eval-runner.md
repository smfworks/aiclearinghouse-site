---
slug: agent-eval-runner
title: Agent Eval Runner
category: Workflow
excerpt: Run a suite of test cases against any agent and produce a pass/fail report with token cost tracking — the minimum viable evaluation harness for production agents.
tags:
  - evaluation
  - testing
  - quality
  - agents
  - hermes
for: Hermes Agent
author: SMF Works
install: hermes skill install agent-eval-runner
dependencies:
  - Hermes Agent
  - Python 3.10+
image: /images/skills/workflow.svg
source: https://github.com/smfworks/aiclearinghouse-site
order: 114
last_verified: "2026-08-05"
---

# Agent Eval Runner

## What it is

A Hermes skill that defines a structured approach to running evaluation suites against agents. You define a set of test cases (input + expected behavior), execute them against your agent, and produce a report showing pass rate, failure categories, and token cost per case. This is the minimum viable evaluation loop that every production agent should have.

## Who it targets

- Agent developers who need to verify their agent did not regress after a model or prompt change
- Teams moving from "it seems to work" to "we have a test suite"
- Anyone preparing to upgrade their agent's model and wanting before/after comparison data

## What it does

- Defines a YAML-based test case format: name, input, expected_tool_calls, expected_output_contains, max_tokens, max_cost
- Runs each test case against the target agent in sequence
- Captures: tool calls made, output text, token usage, cost, latency
- Compares actual behavior against expected behavior using substring matching and tool-call verification
- Produces a summary report: X/Y passed, failures by category (wrong tool, missing output, over budget, timeout)
- Logs full traces to a JSONL file for later analysis

## Dependencies

- Hermes Agent (for agent execution)
- Python 3.10+ (for the eval runner script)
- An OpenAI-compatible model endpoint (the agent under test must be reachable)

## How to install

```bash
hermes skill install agent-eval-runner
```

Or copy the skill directory into your profile skills tree:

```bash
cp -r agent-eval-runner ~/.hermes/profiles/pamela/skills/workflow/
```

## Example usage

Create a test suite file `eval-suite.yaml`:

```yaml
suite_name: "research-agent-v1"
agent_endpoint: "http://localhost:11434/v1"
model: "glm-5.2"
cases:
  - name: "basic-search"
    input: "What is the current price of GLM-5.2 API?"
    expected_tool_calls: ["web_search"]
    expected_output_contains: ["per million tokens"]
    max_tokens: 2000
    max_cost: 0.05

  - name: "no-hallucination"
    input: "Summarize the limitations of Pydantic AI"
    expected_tool_calls: ["web_search"]
    expected_output_contains: ["adapter"]
    max_tokens: 1500
    max_cost: 0.03
```

Run the suite:

```bash
hermes eval-runner --suite eval-suite.yaml --output report.json
```

The report shows:

```
Suite: research-agent-v1
Model: glm-5.2
Cases: 2
Passed: 1/2 (50%)

FAIL: no-hallucination
  Reason: output did not contain expected term "adapter"
  Tokens: 1,847 (budget: 1,500) — OVER BUDGET
  Cost: $0.037

PASS: basic-search
  Tokens: 1,203 (budget: 2,000)
  Cost: $0.018

Total cost: $0.055
Full traces: report.json
```

## Why this matters

Every model upgrade, prompt change, or tool modification can regress your agent. Without an eval suite, you are guessing. With one, you have data. This skill provides the minimum structure: define cases, run them, compare results, track cost. It is not a full evaluation framework (see Langfuse or Pydantic AI evals for that), but it is the 80/20 that catches regressions before they reach production.