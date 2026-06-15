---
slug: microsoft-scout
title: Pilot Microsoft Scout
excerpt: Set up Microsoft's always-on Autopilot agent for desktop and Microsoft 365, with guardrails for safe piloting.
category: Enterprise Pilot
tags:
  - microsoft-scout
  - scout
  - autopilot
  - microsoft-365
  - enterprise
  - frontier
  - preview
order: 4
last_verified: 2026-06-15
difficulty: Intermediate
estimated_time: 60 min
---

# Pilot Microsoft Scout

## The promise

Microsoft Scout is not another chat window. It is an always-on autonomous agent — what Microsoft calls an "Autopilot" — that sits on your Windows 11 or macOS desktop, watches for the cues that matter, and takes action across your files, browser, shell, and Microsoft 365 account. It can schedule meetings, flag stalled decisions, block time for deliverables, and generate prep materials, all while pausing for your approval before anything sensitive leaves your hands.

This recipe is for controlled piloting, not production deployment. Scout is currently in the Microsoft Frontier preview program, which means availability, features, and behavior can change. But the organizations that learn to run agents like Scout safely now will have a real head start when the category goes mainstream.

## What you'll get

- Understanding of whether your organization qualifies for the Frontier preview
- A safe pilot scope with clear boundaries
- Desktop agent connected to Microsoft 365 and local resources
- A governance checklist before expanding permissions

## Prerequisites

- Windows 11 or macOS Sonoma (14.0+) device
- Microsoft 365 E3 or E5 tenant
- Entra ID with administrative consent capability
- Enrollment in the Microsoft Frontier preview program (request through your Microsoft account team)
- One designated pilot owner who can approve Scout actions
- Read access to the [Microsoft Learn Scout documentation](https://learn.microsoft.com/en-us/microsoft-scout/use-microsoft-scout)

## Step 1: Confirm Frontier preview access

Scout is not generally available. Before you install anything:

1. Contact your Microsoft account team or tenant admin.
2. Request enrollment in **Microsoft Frontier** for Scout.
3. Accept the preview terms and confirm the tenant is allow-listed.

Without Frontier enrollment, the installer will not authenticate against your organization.

## Step 2: Review governance first

Scout acts with its own Entra identity. That is powerful and risky. Before you enable it, document:

- **Scope:** What can Scout read? (email, calendar, files, chats, local disk, browser)
- **Actions:** What can it do without approval? (read, draft, schedule) and what requires human sign-off? (send, delete, spend)
- **Audience:** Which users are in the pilot? Start with one.
- **Audit:** Who reviews Scout's activity log weekly?
- **Kill switch:** How do you revoke the Scout identity and uninstall if needed?

Microsoft Purview sensitivity labels and Data Loss Prevention policies should already be in place. Scout does not bypass them; it operates within them.

## Step 3: Download and install the Scout desktop app

Once your tenant is enrolled, download the installer from the official Microsoft Download Center:

- [Microsoft Scout (Frontier)](https://www.microsoft.com/en-us/download/details.aspx?id=108685)

Run the installer with admin rights. It will:

1. Install the desktop runtime.
2. Register a Scout identity in your tenant's Entra ID.
3. Prompt for organizational consent.

Your Entra admin must approve the consent request before Scout can access Microsoft 365 data.

## Step 4: Configure the Scout identity and permissions

In the Microsoft 365 admin center:

1. Go to **Entra ID → Enterprise applications**.
2. Find the Microsoft Scout application.
3. Review and assign permissions:
   - Read calendar
   - Read/send email as user (restricted to pilot owner)
   - Read Teams chat
   - Read files in OneDrive/SharePoint
4. Enable **human-in-the-loop** for any action that sends communication or modifies shared resources.

## Step 5: Set the pilot scope in Scout

Open the Scout desktop app and configure the pilot workspace:

- **Allowed local paths:** Limit to one test folder, e.g. `C:\ScoutPilot` or `~/ScoutPilot`.
- **Allowed browsers:** Chrome or Edge with Scout extension enabled.
- **Allowed shell commands:** Disable for the first week. Enable only after you understand Scout's reasoning.
- **Allowed hours:** Restrict Scout to business hours so it does not send messages at night.

## Step 6: Run your first controlled task

Start with a read-only observation task:

> "Review my calendar for next week and identify any meetings without an agenda."

Scout should:

1. Read your calendar.
2. List the meetings missing agendas.
3. Ask if you want it to draft agenda emails.

Do not approve send actions until you have reviewed several read-only results and trust the agent's judgment.

## Step 7: Enable a single write action

Once read-only tasks are reliable, enable one write action with approval required:

> "Draft a meeting agenda for the weekly standup and show it to me before sending."

Scout will generate the draft and wait. You approve or edit. This is the loop to practice before granting broader autonomy.

## Step 8: Audit weekly

Scout produces an activity log. Review it every week during the pilot:

- What did Scout read?
- What actions did it propose?
- How many were approved vs. rejected?
- Did any action violate the documented scope?

Use the log to tighten scope and retrain user expectations.

## Sanity checks

| Check | Action |
|-------|--------|
| Frontier enrollment | Confirm with Microsoft account team |
| Entra consent | Verify in **Enterprise applications → Microsoft Scout** |
| Desktop app running | Check system tray / menu bar icon |
| Scout identity visible | Look for the Scout service account in Entra |
| Activity log enabled | Confirm in Scout settings |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Tenant not enrolled" | Contact Microsoft. Scout is Frontier-only until general availability. |
| Consent prompt fails | Ensure the approving account has Global Administrator or privileged role admin rights. |
| No local file access | Check allowed-path settings in Scout. It defaults to restricted. |
| Scout sends without asking | Disable auto-approval in settings. Re-enable only after governance review. |
| High token usage | Scout may index files and mail. Scope it to specific folders and date ranges. |

## Important: this is a preview

Microsoft Scout is experimental. Features, pricing, availability, and security posture may change before general release. Do not route critical workflows through it. Use the pilot to learn what autonomous agents mean for your organization, not to replace humans.

## Next steps

- Compare Scout to [OpenClaw](/agents/openclaw) and [Hermes](/agents/hermes-agent) to see how open-source personal agents differ from enterprise Autopilots.
- Read our [AI Safety checklist](/safety/agent-safety-checklist) before expanding Scout's permissions.
- Document your pilot findings and decide whether to expand, pause, or shut down at the 30-day mark.
