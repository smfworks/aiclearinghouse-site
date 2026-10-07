---
slug: full-disk-access-is-not-a-default
title: "Do not grant Full Disk Access as the default for a desktop agent"
category: Security
excerpt: "Apple told TechCrunch on October 2, 2026 that Full Disk Access will take a very explicit user action. A desktop agent does not need Mail, Messages, and browser history to edit a repo."
tags:
  - macos
  - permissions
  - desktop-agents
  - privacy
order: 99
last_verified: "2026-10-07"
---

# Do not grant Full Disk Access as the default for a desktop agent

## What Apple said

TechCrunch reported on October 2, 2026 that Apple is adding controls around macOS Full Disk Access because AI agents have raised the risk of that setting. Apple's wording, as quoted in that piece: some developers are using Full Disk Access in ways that could expose everything on a system without the user's full knowledge. Going forward, Apple said, a user who genuinely wants to grant that access will have to take a "very explicit user action."

Apple also said the risks grow as agents get more capable, and that users should understand those risks before they grant the setting.

TechCrunch later corrected its own verb. The change is informed consent, not a new hard limit that removes the setting. Do not brief a team that Apple disabled Full Disk Access. The article says they did not.

Apple did not answer TechCrunch's question about the feature change. There is no ship date in the piece. Do not invent one.

## What the setting actually opens

TechCrunch, citing Apple's explanation, says Full Disk Access lets an app read files, mail, messages, and browsing history. That is a backup-era permission. It is the wrong default for an agent whose job is a git repo, a ticket, or a browser tab you already opened for it.

The piece also reports Jason Aten's claim that Meta's Muse app on Mac knew the contents of private messages he said he had not granted. That claim is Aten's, via TechCrunch. This directory did not reproduce it. Treat it as the incident that prompted the questions, not as a lab result.

## What to do

- Grant the narrow permission the task needs. Files in a project folder are not Full Disk Access.
- If an installer asks for Full Disk Access on first launch, stop and read which directories it will touch. "The agent works better" is not a reason.
- When Apple's extra confirmation ships, do not click through it to unblock a setup script. The point of the extra step is that the grant is rare.
- Keep a human on any agent that can read Mail or Messages. A coding agent does not need either.

## Source

- https://techcrunch.com/2026/10/02/apple-says-its-tightening-macos-full-disk-access-controls-due-to-new-risks-from-ai-agents/
