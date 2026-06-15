---
slug: email-management
title: Email Management
excerpt: Read, classify, draft, and send email through your agent.
category: Communication
tags:
  - hermes
  - email
  - inbox
  - productivity
for: Hermes Agent
author: Community
install: hermes gateway setup email
dependencies:
  - Hermes Agent
  - IMAP or SMTP credentials or Gmail API token
  - Optional - contact database
image: /images/skills/communication.svg
source: https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/email
order: 46
last_verified: 2026-06-15
---

# Email Management

Use Hermes as an email assistant. It can summarize threads, draft replies, flag urgent messages, and send outbound email on your behalf.

## What it is

An email gateway skill that gives the agent read and write access to your inbox. Combine it with the inbox triage skill to automate classification and response drafting.

## Who it targets

- Professionals managing high-volume inboxes.
- Founders and executives who need quick daily summaries.
- Teams with shared support or sales inboxes.

## Dependencies

- Hermes Agent
- IMAP/SMTP credentials or Gmail API token
- Optional - contact database

## How to install

```bash
hermes gateway setup email
```

## Skill source

- [Hermes Agent email gateway](https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/email)
