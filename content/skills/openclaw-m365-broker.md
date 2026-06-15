---
slug: openclaw-m365-broker
title: OpenClaw Microsoft 365 Broker
excerpt: Connect OpenClaw to Outlook, Teams, SharePoint, and OneDrive for business workflows.
category: Integrations
tags:
  - openclaw
  - microsoft
  - m365
  - enterprise
for: OpenClaw
author: Community
install: openclaw skill install openclaw-m365-broker
dependencies:
  - OpenClaw Gateway
  - Microsoft 365 tenant admin consent
  - Azure AD app registration
image: /images/skills/integrations.svg
source: https://github.com/openclaw/openclaw/tree/main/skills
order: 105
last_verified: 2026-06-15
---

# OpenClaw Microsoft 365 Broker

Bridge OpenClaw with Microsoft 365 so your personal assistant can read email, join Teams conversations, search SharePoint, and manage OneDrive files under your control.

## What it is

An integration broker that authenticates OpenClaw against Microsoft Entra ID and exposes Outlook, Teams, SharePoint, and OneDrive as tools. All data stays in your tenant; the agent simply acts on your behalf.

## Who it targets

- OpenClaw users in Microsoft-centric organizations.
- IT admins who want a private assistant for M365 workflows.
- Teams that cannot use cloud-only copilots for compliance reasons.

## Dependencies

- OpenClaw Gateway
- Microsoft 365 tenant admin consent
- Azure AD app registration

## How to install

```bash
openclaw skill install openclaw-m365-broker
```

## Skill source

- [OpenClaw skills directory](https://github.com/openclaw/openclaw/tree/main/skills)
