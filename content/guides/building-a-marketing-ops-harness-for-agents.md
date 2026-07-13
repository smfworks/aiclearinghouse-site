---
slug: building-a-marketing-ops-harness-for-agents
title: "Building a Marketing Ops Harness for Agents"
excerpt: "How to structure product context, curated skills, brand guardrails, and approve-before-publish so marketing agents stay useful without becoming a SaaS spam bot."
category: Guides
tags:
  - marketing
  - agents
  - harness
  - governance
  - skills
order: 20
last_verified: "2026-07-13"
---

# Building a Marketing Ops Harness for Agents

Most marketing skill packs assume you sell software with demos and packages. Many organizations do not. SMF Works is a research lab: analytical content, open tools, no client offers.

That means marketing agents need a **harness**, not just better prompts.

## The four layers

1. **Product context** — a single root document agents read first (who you are, never-do list, conversion actions)
2. **Curated craft skills** — social, copy, content strategy; not the entire internet of SaaS skills
3. **Policy skill** — hard rules with a checklist completion criterion
4. **Publisher of record** — Postiz, CMS, email ESP; drafts never auto-send by default

## Why curation beats installation

Skill descriptions compete for attention. SaaS-shaped skills win on keywords like "offers" and "leads." If you install everything, the agent becomes a confused sales intern.

Install the minimum set that matches your motion. Explicitly list what you will not install.

## Approve-before-publish

Treat publish like a SEND action in an agent broker:

- Autonomy for preparation
- Approval for consequence

Write draft packs to disk. Only after a human (or a tightly scoped automation with a kill switch) call the publisher API.

## A minimal pilot

1. Pick one pillar URL
2. Draft primary + amplify captions under guardrails
3. Generate media if needed
4. Publish to the real accounts
5. Record release URLs as verification evidence

If you cannot complete one pilot cleanly, do not schedule five crons.

## Related Clearinghouse reading

- [Evolving Agent Marketing Ops](https://www.smfclearinghouse.com/blog/2026-07-12-evolving-agent-marketing-ops/)
- Tips: separate draft from send; extract content atoms; cite-or-abstain
