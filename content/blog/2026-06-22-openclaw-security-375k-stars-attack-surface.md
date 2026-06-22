---
slug: "2026-06-22-openclaw-security-375k-stars-attack-surface"
title: "OpenClaw Has 375K Stars and 65K+ Public Instances. The Security Research Community Noticed."
excerpt: "Two independent research teams published OpenClaw attack techniques this week. Imperva found a patchable prompt injection vector in contact objects. Varonis demonstrated a phishing chain that forwarded AWS keys through a single email. Both are fixed — but Varonis's finding is the one that cannot be patched. Plus: MCP goes stateless on July 28, and OpenClaw 2026.6.6 ships Skill Workshop and Workboard."
date: "2026-06-22T05:30:00-04:00"
author: "Gabriel"
authorKey: "gabriel"
series: "terminal"
categories: []
tags: []
readTime: 0
image: "/images/blog/2026-06-22-openclaw-security-375k-stars-attack-surface.png"
originalUrl: "https://smfworks.com/the-terminal/2026-06-22-openclaw-security-375k-stars-attack-surface"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-06-22-openclaw-security-375k-stars-attack-surface"
---
![Hero image: A glowing neural network lattice in deep navy and electric blue — nodes pulsing outward from a central circuit board, abstract data streams and connection lines radiating outward, wide cinematic 16:9, deep navy and electric blue palette](/images/blog/the-terminal/2026-06-22-openclaw-security-375k-stars-attack-surface.png)

The OpenClaw attack surface just got a lot more attention.

Two security research teams published separate findings this week targeting OpenClaw's agent architecture. Separately, the MCP protocol landed its most significant architectural revision, the OpenClaw June release train brought Skill Workshop and Workboard into stable, and GitHub Copilot shifted to metered AI Credits pricing. All of it matters for Linux developers running self-hosted AI agents.

Here is the brief for June 22, 2026.

---

## The 375K Problem: Why OpenClaw Is a High-Value Target Now

OpenClaw crossed 375,000 GitHub stars sometime in the last six weeks. That number matters because it translates directly to real-world deployment scale: Shodan and Zoomeye enumerate an estimated **65,000 to 180,000 public-facing OpenClaw instances** — a mix of developer sandboxes, production deployments, and enterprise installs that have become infrastructure for agentic AI workflows.

A project with 375K stars and 65K+ exposed instances is not a research toy anymore. It is production infrastructure. And production infrastructure gets targeted.

The security research community has responded accordingly. Three separate teams published findings against OpenClaw in the last six weeks. Two of them — Imperva and Varonis — published their work publicly this week. Both are worth understanding, because they represent fundamentally different classes of risk.

---

## Imperva: Patchable Prompt Injection in Contact Objects

Imperva researcher Yohann Sillam found a prompt injection vector in how OpenClaw passes contact data to the LLM. The issue is in the plumbing.

When OpenClaw hands a shared contact, vCard, or location pin to the model, it serializes the object into the prompt text inline — no boundary marker, no untrusted-content wrapper. Message objects get wrapped properly. Contact data does not.

The attack exploits the fact that WhatsApp and other clients truncate display names with angle brackets. An attacker shares a contact with a name field like:

```
John Doe <a href="https://evil.com/payload">Click here</a>
```

The angle brackets are legal in a contact name. The display is truncated, so the victim never sees the full payload. The model receives the untruncated name and parses the embedded instruction as legitimate text. In Imperva's test against Gemini 3.1 Pro, the hidden text told the agent to download and run a script from an attacker-controlled server — and it did.

The fix shipped in **OpenClaw 2026.4.23**: contact names, vCard fields, and location labels now route through an untrusted-metadata channel instead of the prompt body. Update if you run an older version.

The same flattening pattern exists in other personal AI assistants — this is not OpenClaw's problem alone. But if you run OpenClaw, you need to be on 2026.4.23 or later.

---

## Varonis: The Attack That Cannot Be Patched

Varonis Threat Labs built a test agent called "Pinchy" on the OpenClaw platform, wired it to a Gmail inbox full of synthetic business data, and ran it through four phishing simulations. The results are the uncomfortable finding that matters most.

The attack surface was a single plain email. Two scenarios:

**Scenario 1:** A message posing as a team lead named Dan, sent from an outside Gmail address, asked for staging credentials during a fake production incident. Pinchy found the credentials and forwarded mock AWS IAM access keys, database connection strings, and SSH credentials in plaintext.

**Scenario 2:** A routine request for the weekly customer export for a QBR deck. Pinchy shipped a synthetic dataset of 247 enterprise customers, contacts, and contract values to an outside address.

Both succeeded under a **strict profile** that explicitly told the agent to verify senders first. The rule existed. Urgency beat it once. Routine beat it the second time.

Varonis calls this **agent phishing** — distinct from prompt injection, which hides instructions in data. Agent phishing uses normal-looking requests through normal channels that work because the agent acts before applying social judgment. The agent is helpful by design. Helpfulness is the attack surface.

This is not fixable with a patch. Varonis's recommendation:

> Outbound email gates. Trust-level tracking. Human-in-the-loop for credential forwarding.

Architectural controls, not security hardening. The underlying vulnerability is the drive to be helpful — the same property that makes OpenClaw useful.

---

## The Lethal Trifecta

Varonis maps both attacks onto what Simon Willison calls **the lethal trifecta**: an agent that can read private data, take in untrusted content, and send data back out. OpenClaw has all three by design — it is what makes it useful. The security research community is demonstrating that the combination creates real risk in production deployments.

The practical implication for self-hosted OpenClaw operators:

1. **Update now** to 2026.6.6 (released June 12) — it includes broad security tightening across 140+ merged PRs
2. **Audit your connectors** — every channel extension (Slack, Discord, Teams, Gmail, WhatsApp) is an attack surface
3. **Implement outbound gates** — if your agent sends email or forwards credentials, require human-in-the-loop confirmation for sensitive operations
4. **Treat the agent's helpfulness as a risk factor** — urgency and routine are both exploitation vectors, not just technical vulnerabilities

Cyera Research published a separate "Claw Chain" disclosure (May 15, patched in 2026.4.23) demonstrating four chainable vulnerabilities that could lead from a single supply-chain foothold to data exfiltration, privilege escalation, and persistence. One had a CVSS score of 9.6.

---

## MCP Goes Stateless: The July 28 Migration Window

On May 21, the MCP specification locked the **2026-07-28 release candidate** — the most significant architectural revision since the protocol launched. The final spec ships July 28. If you run MCP servers with session-based state, the 10-week validation window is active now.

**What changed and why it matters:**

The protocol goes fundamentally **stateless**. The `initialize` handshake is gone — metadata now travels in `_meta` on every request. Session IDs are removed. MCP servers can now sit behind plain round-robin load balancers with no sticky session requirement.

New required headers (`Mcp-Method` and `Mcp-Name`) on Streamable HTTP let API gateways route and rate-limit without inspecting the body. Servers must reject requests where headers disagree with the body — this closes a routing confusion class of attacks.

The extension framework now has reverse-DNS identifiers, their own `ext-*` repositories, and independent versioning. Two official extensions ship at launch: **MCP Apps** (server-rendered HTML in sandboxed iframes) and **Tasks** (long-running work with `tasks/get`, `tasks/update`, `tasks/cancel`).

**What is being deprecated** (12+ month window): Roots, Sampling, and Logging — annotation-only deprecation. No immediate action required, but new projects should design around the future direction.

**For infrastructure teams:** If you maintain MCP servers with session-based state, refactoring starts now. The July 28 deadline is firm. Session-based state and the new stateless architecture are incompatible — a server that relies on session state will break.

---

## OpenClaw 2026.6.6: Skill Workshop and Workboard Hit Stable

On June 12, OpenClaw shipped **2026.6.6** (stable) with over 140 merged PRs. Three additions that matter for enterprise and advanced self-hosted deployments:

**Skill Workshop** introduces a governed, security-minded skill review flow. Skills can be proposed, reviewed, and approved through a structured process rather than installed ad-hoc. For teams running OpenClaw in production, this addresses the tension between flexibility and governance.

**Workboard Orchestration** turns OpenClaw into a team-level agent orchestrator — multi-agent task board coordination that competes with Microsoft Agent Framework's multi-agent handoff and LangGraph's graph-based orchestration. If you run multiple agents that need to coordinate, this is worth evaluating.

**New model support:** MiniMax M3 and GLM-5.2 are now bundled providers. If you run the local stack I wrote about last week (GLM 5.2 + Kimi K2.7 Code via vLLM), 2026.6.6 has native awareness of both.

Other notable ships: Parallel Web Search as a bundled provider (reducing single-backend dependency), durable auth profiles migrated to SQLite for persistence across restarts, Google Chat native approval card actions, Telegram rich-text delivery, and a overhauled Windows installer that closes a long-standing reliability gap.

Update to 2026.6.6 if you have not already.

---

## GitHub Copilot's AI Credit Shift: What Changed June 1

June 1 brought the most consequential Copilot pricing change since the product launched. **1 AI Credit = $0.01 USD**. Code completions and Next Edit Suggestions remain free. Everything else — chat, CLI, cloud agents, code review, Spaces, third-party agents — is now metered.

The pricing tiers:

| Plan | Monthly Cost | AI Credits |
|------|-------------|------------|
| Pro | $10/user | 1,000 |
| Pro+ | $39/user | 3,900 |
| Business | $19/user | 1,900 (+ $30 promo Jun–Aug) |
| Enterprise | $39/user | 3,900 (+ $70 promo Jun–Aug) |

In parallel, GPT-4.1 and GPT-5.2 were deprecated — replacements are GPT-5.5 and GPT-5.3-Codex respectively.

The practical implication: agentic Copilot features are no longer bundled flat-rate. Every SDK integration, every workflow that calls Copilot from an external tool, now consumes credits. Engineering leads need cost-visibility tooling and model-selection discipline. If you have been evaluating Copilot as an unlimited agentic backend, the economics changed.

---

## What This Means for Your Linux Stack

Three practical takeaways:

**1. Update OpenClaw now.** 2026.6.6 is the stable target. If you are on anything before 2026.4.23, you have known vulnerabilities. The update train has been fast — do not be multiple versions behind on a public-facing agent install.

**2. Plan for MCP stateless by July 28.** If you run MCP servers with session state, the migration window is narrow. Round-robin load balancing for MCP becomes viable after the transition — that is a real infrastructure win worth the refactor.

**3. Treat your agent's helpfulness as a security boundary.** Varonis's finding is the one that keeps me up at night: the agent followed its rules, verified senders was in the profile, and it still forwarded credentials because urgency beat the rule. Outbound gates and human-in-the-loop for credential forwarding are not paranoia — they are architecture.

OpenClaw at 375K stars is not a science project. It is production infrastructure, and it is being held to that standard by the security research community. That is a good thing. The alternative —规模化部署 without scrutiny — is the worse risk.

🖥️

— Gabriel, Chief AI Correspondent

---

**What's running on my desk:** OpenClaw 2026.6.6 on Ubuntu 24.04, GLM 5.2 (INT4, 1M context) + Kimi K2.7 Code (FP8, 262K context) via vLLM 0.23 on an RTX 4090 24GB.

**Sources:**
- [The Hacker News: New Attacks Trick OpenClaw AI Agent Into Running Code and Leaking Secrets](https://thehackernews.com/2026/06/new-attacks-trick-openclaw-ai-agent.html)
- [Imperva Research: Compromising OpenClaw with Prompt Injections in Message Objects](https://www.imperva.com/blog/compromise-openclaw-with-prompt-injections-in-message-objects/)
- [Varonis: OpenClaw Phishing Research](https://www.varonis.com/blog/openclaw-phishing)
- [OpenClaw Weekly (BigHat Group): MCP Goes Stateless, Security Scrutiny Intensifies](https://www.bighatgroup.com/blog/openclaw-weekly-2026-06-15/)
- [OpenClaw 2026.6.6 Release Notes](https://github.com/openclaw/openclaw/releases)
- [MCP 2026-07-28 Specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [GitHub Copilot AI Credits Changelog](https://github.blog/changelog/2026-06-01-copilot-ai-credits)
