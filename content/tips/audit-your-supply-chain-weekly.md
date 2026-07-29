---
slug: audit-your-supply-chain-weekly
title: Audit Your AI Tool Supply Chain Weekly
category: Security
excerpt: Malicious PyPI and NPM packages targeting AI developers are now weekly news. A 10-minute weekly audit of new dependencies catches supply chain attacks before they catch you.
tags:
  - security
  - supply-chain
  - pypi
  - npm
  - agents
  - dependencies
order: 27
last_verified: "2026-07-29"
---

# Audit Your AI Tool Supply Chain Weekly

## The principle

The week of July 22, 2026 alone saw three separate supply chain attacks targeting AI/ML developers: a compromised `mrmustard` PyPI package stealing SSH and cloud credentials, malicious `spellcheckerpy`/`spellcheckpy` packages delivering a Python RAT, and malicious NPM packages (`@joyfill/components`, `@joyfill/layouts`) carrying credential stealers. AI tooling is a high-value target because AI developers tend to install many packages quickly, often from unverified sources, and often have cloud API keys on their machines.

## Why it matters

The attack pattern is consistent: hijack a maintainer account or create a typosquat, publish a package that runs malicious code on import, exfiltrate credentials (SSH keys, AWS, Kubernetes, API keys), and disappear. The window between publication and detection is often days to weeks. If you installed the package in that window, your credentials are already gone.

AI projects are particularly vulnerable because:
- The ecosystem moves fast — new packages appear daily for model serving, RAG, evaluation, agents
- `pip install` and `npm install` are reflexive developer actions
- AI developers often have high-value credentials (OpenAI, Anthropic, cloud GPU providers)
- Many AI packages are from individual developers, not established organizations

## How to apply it

1. **Run `pip-audit` or `pip install --dry-run --audit` weekly.** Check your active virtual environments for known vulnerabilities. The Python Packaging Authority's `pip-audit` tool checks installed packages against the PyPI advisory database.

2. **Review your `requirements.txt` and `package.json` for new entries.** Every new dependency added this week should be checked: Is the maintainer verified? Is the package established or brand new? Does it have a legitimate GitHub repo with history?

3. **Check for typosquats.** Before installing any package, verify the exact spelling against the official source. `spellcheckerpy` vs `pyspellchecker` — one character difference, one is malware.

4. **Use pinned versions, not floating ranges.** `openai==2.50.0` is auditable. `openai>=2.0` lets a compromised version slip in on the next install.

5. **Isolate AI development environments.** Use containers or virtual environments that do not have access to your `~/.ssh`, `~/.aws`, or `~/.kube` directories. A stolen package cannot exfiltrate credentials it cannot read.

6. **Subscribe to supply chain advisories.** The Python Advisory Database, GitHub Security Advisories, and sources like StepSecurity's blog publish timely analyses of new attacks.

## Red flags

- A package was published in the last 30 days by an account with no other packages
- The package name is a near-miss of a popular package (typosquat)
- The package runs network operations on import (check `setup.py` or `__init__.py` for `requests.post`, `urllib`, `socket`)
- Your `pip install` pulls a version that was published the same day
- A dependency you did not add appears in your lockfile

## Quick win

Today, run this in your primary AI development environment:

```bash
pip install pip-audit
pip-audit
```

If it reports any known vulnerabilities, address them before doing anything else. Then pin every package in your requirements file to exact versions. This takes 10 minutes and closes the most common attack vector.