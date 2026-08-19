---
slug: grounded-citations-researcher
title: "Grounded Citations Researcher"
category: Research
excerpt: "Hermes Agent v0.20's built-in citation skill — source-backed research with automatic fact-checking and inline citations for any research-heavy workflow."
tags:
  - hermes
  - citations
  - research
  - fact-checking
  - verification
for: Hermes Agent
author: Nous Research
install: "Built into Hermes Agent v0.20+ (no install required)"
dependencies:
  - Hermes Agent v0.20.0+
  - Web search tool enabled
image: /images/skills/research.svg
source: https://github.com/NousResearch/hermes-agent
order: 99
last_verified: "2026-08-19"
---

# Grounded Citations Researcher

## Overview

The Grounded Citations Researcher is a built-in skill shipped with Hermes Agent v0.20 ("The Herald Release," August 3, 2026). It provides source-backed research with automatic fact-checking — every claim in the agent's output is tied to a retrieved source, and the agent flags statements it cannot ground.

This is not a separate install. It ships as part of the core Hermes Agent v0.20 release and activates automatically when the agent detects research-heavy workflows, or when explicitly invoked.

## What it does

- **Source-backed answers**: Every factual claim in the response includes an inline citation to a retrieved web source
- **Fact-checking layer**: The agent cross-references claims against multiple sources before presenting them as fact
- **Abstention on uncertainty**: When the agent cannot find a reliable source, it says so explicitly rather than hallucinating — the "cite or abstain" principle, built in
- **Citation formatting**: Sources are formatted as clickable links with title, URL, and retrieval date
- **Conflict surfacing**: When sources disagree, the agent presents the conflict rather than picking one silently

## How it differs from web search

Standard web search returns results; the Grounded Citations Researcher returns answers with provenance. The difference matters for:

- **Research workflows** where you need to verify claims, not just find pages
- **Compliance contexts** where every statement needs a traceable source
- **Knowledge work** where "I don't know" is more valuable than a confident hallucination

## Quick start

1. Update to Hermes Agent v0.20 or later: `hermes update` or via Agent OS → Manage → Update
2. Ensure web search is enabled in your tool configuration
3. Ask a research question — the agent will automatically apply citation grounding when it detects a research context
4. Review inline citations in the response; click through to verify sources

## Use cases

- **Literature reviews**: Gather and cite sources on a topic with automatic provenance
- **Competitive intelligence**: Research competitors with traceable, verifiable claims
- **Technical due diligence**: Verify vendor claims against independent sources before committing
- **Content research**: Build articles or reports with citations ready to publish
- **Fact-checking workflows**: Cross-reference claims from other agents or sources

## Limitations

- **Depends on web search quality**: Citations are only as good as the sources the search tool returns
- **Not a replacement for expert review**: Grounded citations reduce hallucination risk but do not eliminate it — human review still needed for high-stakes claims
- **Latency overhead**: Source retrieval and cross-referencing add time compared to ungrounded responses
- **Source bias**: The agent cites what it finds; if search results are biased, citations will reflect that bias

## Related

- [Prefer Cite or Abstain](/tips/prefer-cite-or-abstain) — the principle this skill implements
- [Never Trust a Hallucination](/tips/never-trust-a-hallucination) — complementary defensive practice
- [Web Research Summarizer](/skills/web-research-summarizer) — broader research skill without the citation layer