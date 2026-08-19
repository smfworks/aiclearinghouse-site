---
slug: agent-supply-chain-scanner
title: Agent Supply Chain Scanner
category: Security
excerpt: Scan installed Python and Node packages for known malicious patterns, typosquatting, and supply chain attack indicators before agents run them.
tags:
  - hermes
  - security
  - supply-chain
  - npm
  - pypi
  - scanning
for: Hermes Agent
author: SMF Works
install: hermes skill install agent-supply-chain-scanner
dependencies:
  - Hermes Agent >= v2026.5.0
  - Python 3.10+
  - Node.js 18+ (for npm scanning)
image: /images/skills/security.svg
source: https://github.com/smfworks/hermes-skills
order: 116
last_verified: "2026-08-19"
---

# Agent Supply Chain Scanner

## What it is

A Hermes Agent skill that scans your project's Python and Node dependencies for known supply chain attack indicators. It checks for typosquatting against popular package names, flags packages with suspicious metadata (zero downloads, recent registration, mismatched author), and cross-references against known malicious package advisories.

## Who it targets

- Agent developers who install third-party packages regularly and want a pre-flight check.
- Teams that saw the 2026 supply chain attack wave (59 campaigns, 657 malicious packages across npm and PyPI) and want automated detection.
- Anyone building agent tooling that pulls in dependencies dynamically.

## What it does

1. **Scans requirements.txt, pyproject.toml, and package.json** for all declared dependencies.
2. **Checks each package** against known typosquatting lists and malicious package advisories.
3. **Flags suspicious signals:** recently registered packages, zero or very low download counts, author name mismatches with canonical versions, unusual version patterns.
4. **Produces a report** with risk levels: known-bad, suspicious, low-risk, and clean.
5. **Suggests canonical alternatives** when a typosquatted package is detected.

## Dependencies

- Hermes Agent >= v2026.5.0
- Python 3.10+ (for pip/PyPI scanning)
- Node.js 18+ (for npm scanning)
- Internet access to PyPI and npm registries for metadata lookups

## How to install

```bash
hermes skill install agent-supply-chain-scanner
```

## Example usage

```
/user: Scan my project for supply chain risks

/agent: I'll check your dependencies. Found requirements.txt and package.json.
Scanning 47 Python packages and 23 npm packages...

Results:
- 1 known-bad: "requets" (typosquat of "requests") — DO NOT USE
- 2 suspicious: "openai-agents-helpers" (registered 3 days ago, 12 downloads) — verify author
- 44 clean

Recommendation: Remove "requets", replace with "requests". Investigate "openai-agents-helpers" before trusting.
```

## Why this matters

The 2026 supply chain attack data is stark: 59 campaigns, 657 malicious packages, and zero CVEs — meaning traditional vulnerability scanning does not catch these. The attacks target AI agent tooling specifically, using typosquatted versions of popular agent libraries. Agents that auto-install packages are especially vulnerable because they may pull in malicious dependencies without human review. This skill adds a check point before packages enter your environment.