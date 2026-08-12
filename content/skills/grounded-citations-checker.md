---
slug: grounded-citations-checker
title: "Grounded Citations Checker"
category: Research
excerpt: "Leverage Hermes Agent v0.20's grounded citations feature to verify research claims against source documents and flag unsupported statements."
tags:
  - hermes
  - research
  - citations
  - fact-checking
  - verification
for: Hermes Agent
author: SMF Works
install: hermes skill install grounded-citations-checker
dependencies:
  - Hermes Agent v0.20+
  - Python 3.11+
image: /images/skills/research.svg
source: https://github.com/smfworks/hermes-skills
order: 99
last_verified: "2026-08-12"
---

# Grounded Citations Checker

## Overview

The Grounded Citations Checker skill leverages the grounded citations and fact-checking improvements shipped in Hermes Agent v0.20 ("The Herald Release") to verify research claims against source documents. It systematically reviews agent output for unsupported statements, checks every citation against the referenced source, and flags claims that cannot be traced to a primary document.

Hermes v0.20 introduced grounded citations for research-heavy workflows — the agent attaches source references to its claims and can verify whether a statement is actually supported by the cited material. This skill operationalizes that capability into a repeatable verification workflow.

## What it does

- **Citation extraction**: Parses agent output to identify all factual claims and their associated citations
- **Source verification**: Checks each citation against the referenced source document or URL to confirm the claim is actually supported
- **Unsupported claim flagging**: Marks statements that have no citation, cite a source that doesn't contain the claimed information, or cite a source that has been modified or removed
- **Confidence scoring**: Assigns a confidence score to each claim based on source quality (primary vs secondary, peer-reviewed vs blog post, date freshness)
- **Verification report**: Generates a structured report showing verified claims, unsupported claims, and missing citations

## Installation

```bash
hermes skill install grounded-citations-checker
```

Requires Hermes Agent v0.20.0 or later.

## Quick start

1. Install the skill
2. Run a research task: `hermes "Summarize the latest GDPval-AA benchmark results"`
3. Verify citations: `hermes skill run grounded-citations-checker --on-last-response`
4. Review the verification report for unsupported claims

## Use cases

- **Research synthesis**: Verify that an agent's summary of multiple papers accurately reflects the source material
- **Market analysis**: Ensure competitive intelligence claims are backed by cited sources
- **Compliance documentation**: Confirm that regulatory citations in agent-generated documents reference the correct sections of law
- **Content publishing**: Fact-check blog posts and articles before publication