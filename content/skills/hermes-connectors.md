---
slug: hermes-connectors
title: Name the Hermes connector account
category: Workflow
excerpt: "v0.22.0 documents hermes connectors and /connectors for hosted apps, including two named accounts of the same app. This is not a hub install."
tags:
  - hermes
  - connectors
  - gmail
  - accounts
for: Hermes Agent
author: Nous Research
install: hermes connectors
dependencies:
  - Hermes Agent v0.22.0
image: /images/skills/workflow.svg
source: https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.0
order: 99
last_verified: "2026-10-14"
---

# Name the Hermes connector account

## What it is

This is not a skill you install from a hub. `hermes skill install hermes-connectors` is the wrong command. The name on this card is the directory slug.

The command the v0.22.0 release notes print is `hermes connectors`. The same notes print the in-chat form `/connectors`. The Tool Gateway page fetched this run lists four surfaces for multiple connector accounts: the desktop Connectors page, `/connectors` in the TUI, `hermes connectors` in the CLI, and Nous Portal.

The release notes are dated October 13, 2026. The tag page fetched this run says teknium1 released v0.22.0 on 14 Oct 03:21. Use the notes for the feature list and the tag timestamp for when GitHub marked it released. This directory did not run the command.

## Who it targets

Anyone on Hermes who is about to let an agent act in Gmail, Linear, Notion, or another hosted app, and who has more than one account of that app. The release's own example is a `work` Gmail and a `home` Gmail.

Also anyone who does not have a Nous account yet and still wants those apps. The notes say you do not need a Nous account to start. The first time you use an app, Hermes creates a free connectors-only identity.

## What it does

From the release notes, not from a local run:

- Ask for an app, sign in once in the browser, and the tools are usable in the same turn.
- The desktop Connectors page lists hosted apps and your MCP servers together. It replaces the MCP tab.
- The same setup card appears in the TUI and the CLI.
- You can connect several named accounts of one app and manage them with `/connectors` or `hermes connectors`.
- Connector tools can send local files as attachments and save the files they return.

The Tool Search page, fetched this run, adds a boundary the release notes also state in shorter form. Connectors need a Nous identity. If you have none, the first `manage_connections` action, or opening the desktop Connectors page, creates a free identity. That identity does not change your model provider. Outside builds that ship the Nous free tier, it is for connectors and managed tools only.

Two off switches are in the release notes. `nous.guest: false` turns guest identities off. `tools.connectors.enabled: false` turns connectors off.

## What this card does not know

The notes name the commands. They do not print a flag table. This run did not find a subcommand list on the CLI reference extract, so this card will not invent `--alias` or a menu path. If the help text on your install differs from the notes, trust the help text you can see.

The Tool Gateway page also describes a paid Tool Gateway for web search, image generation, TTS, and cloud browser. That is a different product from hosted-app connectors. A connectors-only identity is not a paid subscription, and a paid subscription is not proof that Gmail is connected.

## When not to use it

Don't use a guest connector identity as your model login. The Tool Search page says the free identity does not switch inference.

Don't leave two Gmail accounts unnamed if both are connected. The notes say named accounts exist. They do not say Hermes will guess which inbox you meant.

## Sources

- Release notes: https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.0
- Tool Gateway (multiple connector accounts): https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway
- Tool Search (connectors and guest identity): https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-search
