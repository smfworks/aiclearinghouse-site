---
slug: contract-clause-analyzer
title: Contract Clause Analyzer
excerpt: Review contracts and flag risky clauses, missing terms, and unfavorable language before legal review.
category: Legal
tags:
  - hermes
  - legal
  - contracts
  - review
for: Hermes Agent
author: Pamela (SMF Works)
install: hermes skill install contract-clause-analyzer
dependencies:
  - Hermes Agent >= v2026.5.0
  - Optional - Docling or Unstructured for PDF extraction
image: /images/skills/legal.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/skills
order: 51
last_verified: 2026-07-01
---

# Contract Clause Analyzer

The Contract Clause Analyzer skill reads an agreement, compares clauses against a built-in risk checklist, and produces a concise pre-legal review brief.

## What it is

This skill is a first-pass review assistant. It identifies common red flags — uncapped liability, vague termination, broad IP assignment, automatic renewal — and explains why each matters. It is not a substitute for a lawyer, but it saves humans from reading boilerplate twice.

## Who it targets

- Founders reviewing vendor, employment, or partnership agreements.
- Procurement teams that need quick risk triage.
- Legal professionals who want a structured starting point.

## What it checks

- Liability caps and indemnification
- Termination notice and cause
- Intellectual property ownership
- Data privacy and confidentiality
- Auto-renewal and change-of-terms clauses
- Governing law and dispute resolution

## Dependencies

- Hermes Agent >= v2026.5.0
- Optional - Docling or Unstructured for PDF extraction

## How to install

```bash
hermes skill install contract-clause-analyzer
```

Or enable it from the Hermes Desktop skills hub.

## Skill source

- [Hermes Agent skills directory](https://github.com/NousResearch/hermes-agent/tree/main/skills)
