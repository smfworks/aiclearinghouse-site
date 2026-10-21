---
slug: author-feed
title: Read a public Bluesky feed, then decide who can call it
category: Tooling
excerpt: "The v0.22.2 catalog card for author-feed is a public Bluesky read with no key. The tools are on for every surface, including gateways, and they do not ask for approval. This card did not install it."
tags:
  - hermes
  - plugins
  - bluesky
  - gateway
for: Hermes Agent
author: Community
install: hermes plugins install author-feed
dependencies:
  - Hermes Agent >= 0.21.4
image: /images/skills/tooling.svg
source: https://github.com/NousResearch/hermes-agent/blob/v0.22.2/plugin-catalog/author-feed.yaml
order: 124
last_verified: "2026-10-21"
---

# Read a public Bluesky feed, then decide who can call it

## What it is

This is a plugin-catalog entry, not a skill hub install. `hermes skill install author-feed` is the wrong command. The catalog README at the v0.22.2 tag says entries install with `hermes plugins install <name>`.

The file fetched this run is `plugin-catalog/author-feed.yaml` on tag v0.22.2. The name is `author-feed`. The repo is `https://github.com/TakeshiTGAL/hermes-plugin-author-feed`. The pin is `4a302be82926ed9f0ccc87bba242cf7acfef37bb`. Version `0.1.0`. Maintainer TakeshiTGAL. It requires Hermes `>=0.21.4`. The catalog README says an install clones the repo and checks out that exact commit.

The v0.22.2 release notes list "Plugin-catalog: add author-feed" in the 0.22 line since v0.22.0. This directory did not install the plugin and did not call the tools.

## Who it targets

Someone who wants one public Bluesky profile and one watched account inside Hermes, and who has already decided which surfaces may call the tools. If a gateway has other people on it, read the disclosure before you install.

## What the catalog card says it does

The tools are `profile_get`, `author_feed`, and `author_watch`.

The disclosure on the card, not a test from this directory:

- HTTPS GET only, to `public.api.bsky.app`. No API key. No separate program on the machine.
- The tools are on for every surface, including gateways, and they ask for no approval. Anyone you allow on the gateway can call them. Turn a surface off with `hermes tools`.
- `hermes author-feed schedule` creates one cron job. The default is a model turn every hour. That is two or more model requests, and the card says there is no daily cap. Delivery is local unless you pass `--deliver`, so there is no chat by default.
- Run `hermes author-feed unschedule` before you remove the plugin. A leftover job stops with `hermes cron remove <id>`.
- Under `plugins.isolation: host`, the watch cannot run. It posts a notice saying so on every run.
- The first run only records what is already there. One run reads at most the latest 3 pages and announces a new post by that account on those pages. Replies, including the account's own thread continuations, are not announced.
- If every row on those pages is new, there is no saved post or mark, and the feed still offers another cursor, it also posts a possible-miss notice, at most once in 24 hours while that keeps happening.
- It relies on private Hermes parts, so an update can stop it. State stays in `<HERMES_HOME>/plugin-data/author-feed` after uninstall.

## How to install

1. Confirm the Hermes version is at least 0.21.4. The card's `requires_hermes` line is the floor. This directory did not run the version command for this card.
2. Install from the catalog, not from a skill name: `hermes plugins install author-feed`. The README says the install checks out the pinned SHA. If your help text names a different subcommand, trust the help text on that install.
3. Before you schedule anything, decide which surfaces may call `profile_get`, `author_feed`, and `author_watch`. The card says they do not ask for approval. A gateway guest is a caller.
4. If you want the hourly check, run `hermes author-feed schedule` only after you accept an uncapped hourly model turn. Pass `--deliver` only if you want it in chat. The default is local.
5. To remove it, unschedule first, then uninstall. If a job remains, `hermes cron remove <id>`. The state directory can remain after uninstall. The card says so. Delete that directory yourself if you do not want the saved marks.

## What this card does not know

The upstream README was not opened this run. The catalog YAML is the source. If the repo at that SHA says something the YAML does not, this card does not have it.

This is a public profile read. It is not a private-account login. The card does not describe a write, a like, or a follow.

## Sources

- Catalog file: https://github.com/NousResearch/hermes-agent/blob/v0.22.2/plugin-catalog/author-feed.yaml
- Catalog install rule: https://github.com/NousResearch/hermes-agent/blob/v0.22.2/plugin-catalog/README.md
- Release notes that list the catalog add: https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.2
