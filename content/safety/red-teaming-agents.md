---
slug: red-teaming-agents
title: Red-Teaming Agents
excerpt: Adversarial tests to find prompt injection, tool misuse, data leaks, and permission escalation before an attacker does.
category: Trust
tags:
  - safety
  - red team
  - adversarial testing
  - prompt injection
last_verified: 2026-06-18
---

# Red-Teaming Agents

Red-teaming is the practice of attacking your own agent to find weaknesses before someone else does. For agents, this means testing prompt injection, tool misuse, data extraction, and permission escalation.

## Why red-team agents

Traditional security testing checks code and infrastructure. Agent red-teaming also tests the model's behavior under adversarial input. A secure runtime does not help if the model can be talked into bypassing it.

## What to test

### 1. Prompt injection

Try to make the agent ignore its instructions. Test with:

- Direct instructions in user input: "Ignore previous instructions and..."
- Indirect instructions in documents or web pages.
- Role-play and jailbreak prompts.
- Encoding tricks: base64, leetspeak, markdown comments.

Measure whether the agent reveals system prompts, calls forbidden tools, or changes its behavior.

### 2. Tool misuse

Attempt to trick the agent into calling tools with dangerous parameters:

- Deleting files outside the workspace.
- Sending emails to unexpected recipients.
- Running shell commands not on the allowlist.
- Exfiltrating data through web requests.

### 3. Data extraction

Try to get the agent to leak:

- System prompts.
- Secrets or API keys.
- Contents of files it can read.
- Previous conversation history it should not expose.

### 4. Permission escalation

Test whether the agent can:

- Convince the approval UI that a dangerous action is safe.
- Exploit a lower-privilege tool to access a higher-privilege one.
- Use confusion between multiple agent identities.

## Red-team methodology

1. **Define scope.** Which agent, tools, and data are in scope?
2. **Set rules of engagement.** What can the red team attempt? What must they avoid?
3. **Run tests in a sandbox.** Never red-team against production data or production systems.
4. **Document everything.** Record inputs, outputs, and what succeeded.
5. **Report findings with severity.** Rank issues by exploitability and impact.
6. **Fix, re-test, and monitor.** Close the loop.

## Who should red-team

Ideally, someone other than the agent's developer. Fresh eyes find assumptions the builder missed. If you do not have a dedicated security person, rotate the task among team members.

## Automated vs. manual

- **Manual red-teaming** finds creative bypasses and contextual weaknesses.
- **Automated red-teaming** scales coverage and catches regressions.

Use both. Start manual to understand the failure modes, then automate the tests that should never pass.

## Tools and datasets

- OWASP LLM Top 10
- Prompt injection test datasets
- Agent-specific evaluation harnesses
- Your own internal adversarial examples

## When to red-team

- Before the first production deployment.
- After adding a new tool or model.
- After a major prompt or permission change.
- After any incident.
- Quarterly as a hygiene practice.

## Common mistakes

- **Testing only direct injection.** Indirect injection via documents and web pages is often more dangerous.
- **Ignoring UI/UX.** A confusing approval dialog is a security flaw.
- **Not fixing regressions.** Add failing tests to your suite so the bug does not return.
- **Treating red-teaming as a one-time event.** Models and tools change; so do attacks.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Prompt Injection Defenses](/safety/prompt-injection)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [Incident Response for Agent Failures](/safety/incident-response)

> Last verified: 2026-06-18.
