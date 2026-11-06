---
slug: "walk-the-hermes-v0230-upgrade-notes"
title: "How to walk the Hermes v0.23.0 upgrade notes before you keep hermes mcp serve"
excerpt: "v0.23.0 is Latest. Match hermes --version to 2bd378ed1b8d. Leave origin/main alone. The CLI now prints that hermes mcp serve moved to hermes mcp-serve. The docs page still shows the old args."
date: "2026-11-06"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Linux", "Open Source", "Agents"]
tags: ["hermes", "v0.23.0", "mcp-serve", "upgrade-notes", "browser_exec"]
readTime: 7
image: "/images/blog/walk-the-hermes-v0230-upgrade-notes-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/walk-the-hermes-v0230-upgrade-notes"
---

You can keep a client config that still says `hermes mcp serve` because the docs page still prints those args, land on v0.23.0, and watch the CLI refuse the old command. [Hermes Agent v0.23.0](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.0) is the current Latest stable. Its upgrade notes rename that command, drop the old `browser_*` tools, merge Word, PowerPoint, and Excel into one skill, and leave the Webapp off until you turn it on. By the end of this you can match `hermes --version` to the tag, leave `origin/main` alone, and walk those notes with the messages this host printed.

I fetched the GitHub release API for [v0.23.0](https://api.github.com/repos/NousResearch/hermes-agent/releases/tags/v0.23.0) this morning. `prerelease` is false. `published_at` is `2026-11-05T21:32:33Z`. `target_commitish` is `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`. `/releases/latest` returned the same tag. A GET for [v0.23.1](https://api.github.com/repos/NousResearch/hermes-agent/releases/tags/v0.23.1) returned 404.

An earlier post, [How to read the Hermes update channel before you run the update](/blog/read-the-hermes-channel-before-you-update), is the channel question. [How to move a Hermes source install off the wrong v0.22.1 commit](/blog/update-hermes-off-the-wrong-v0221-commit) is a bad cut. This one is the Hearth Release upgrade list.

## Open the Hearth Release and match the version line

Start with the [v0.23.0 release](https://github.com/NousResearch/hermes-agent/releases/tag/v0.23.0). The title is "Hermes Agent v0.23.0 — The Hearth Release". The author login is `teknium1`. The body names the date November 5, 2026, and says this release rolls up and fully documents the v0.22.1–v0.22.7 patch releases. The closing line repeats that those notes were deferred to this minor, covering October 14 through November 3.

[v0.22.7](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.7) is also `prerelease` false. The API `published_at` is `2026-11-03T21:53:16Z`. `target_commitish` is `b200f5bc60e31588ba2cb60e288029c4a54ba5fa`. Its body says it is a patch, and that full curated notes for that window ship with v0.23.0. If you stopped at 0.22.7, the upgrade list you need is on 0.23.0.

Then print the version line on the install you actually run:

```bash
hermes --version
```

On this git install the command printed `Hermes Agent v0.23.0 (2026.9.24) · stable · local 2bd378ed1b8d`, `Install method: git`, and `Up to date`. `git describe --tags --always` printed `v0.23.0`. `git rev-parse HEAD` printed `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`, the same SHA the API names.

If your line still prints `v0.22.x` and `Update available`, stay on the [v0.22.7 Updating section](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.7) for the apply path. That page says CLI installs use `hermes update`, or a re-run of the installer one-liner. Microsoft Store updates through the Store. Docker uses `nousresearch/hermes-agent:stable`. This host already printed `Up to date`, so the next step here is the upgrade notes, not the updater.

## Leave origin/main alone

`git fetch` on this checkout this morning moved `origin/main` to `90d6b98fd86d20981ee06ddd5b7d93e4320f26a4`. `git rev-list --count HEAD..origin/main` printed `209`. A fast-forward to `main` would leave the v0.23.0 tag. Pin the tag when you want the stable.

A git tag `v0.23.0+canary.20261106T064428Z` appeared on the fetch. It is a canary pointer. It is not a GitHub release. The Latest API still returns v0.23.0.

The v0.23.0 body prints a full changelog against [v0.22.0...v0.23.0](https://github.com/NousResearch/hermes-agent/compare/v0.22.0...v0.23.0). If you only need the window since the last patch, compare [v0.22.7...v0.23.0](https://github.com/NousResearch/hermes-agent/compare/v0.22.7...v0.23.0). `git rev-list --count v0.22.7..v0.23.0` printed `808` on this checkout.

The five upgrade notes sit under the heading "Upgrade notes" on that same page. Walk them in order. The CLI will tell you when a command has moved.

## Change the MCP client args to mcp-serve

The third upgrade note is the one that breaks a copied config: `` `hermes mcp serve` is now `hermes mcp-serve` `` (it moved into a plugin). MCP clients that launch Hermes as a server need their command updated; nothing rewrites it for you.

The published MCP page still shows the old argv. I opened [MCP (Model Context Protocol)](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) this morning. Under "Running Hermes as an MCP server" the Quick start line is `hermes mcp serve`. The client example still has `"args": ["mcp", "serve"]`.

Run the old command on a v0.23.0 install and read what the CLI prints:

```bash
hermes mcp serve --help
```

This host printed:

```text
hermes mcp: 'serve' is not a `hermes mcp` command.
Hermes as an MCP server moved out of core into the 'mcp-serve' plugin: `hermes mcp serve` is now `hermes mcp-serve`. Install it with: `hermes -p liam plugins install mcp-serve`.
```

The hyphenated command is the same story:

```bash
hermes mcp-serve --help
```

This host printed that `'mcp-serve' is not a hermes command`, that the plugin is not loaded, and the same install line. The `-p liam` token is this profile. Copy the install line your own CLI prints.

If another agent should call Hermes as a server, install that plugin, then change the client args to one token:

```json
{
  "mcpServers": {
    "hermes": {
      "command": "hermes",
      "args": ["mcp-serve"]
    }
  }
}
```

If you do not need Hermes as a server, leave the plugin unloaded. The rename still matters because a leftover `["mcp", "serve"]` block will fail the same way the `--help` call did.

The v0.23.0 plugin section says homes that use Camofox, Singularity, or `import-agent` get those plugins installed automatically, and MCP clients have to change their args to `mcp-serve`. That line matches the CLI.

## Point browser_* names at browser_exec

The first upgrade note says the old built-in browser tools are gone. Browser automation runs on `browser_exec` only. agent-browser and the ten `browser_*` tools (`browser_navigate`, `browser_click`, and the rest) were removed. Homes that used Camofox get the `camofox` plugin installed automatically. If your own prompts, skills, or toolset lists name the old tools, switch them to `browser_exec`. The note cites [PR #143146](https://github.com/NousResearch/hermes-agent/pull/143146).

The published tools page already uses the new names. [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) lists the Browser row as `browser_exec`, `browser_cdp`, `browser_dialog`, and `browser_vault`, and says `browser_exec` drives Chromium with Python over CDP.

Search the skills you actually load:

```bash
rg -n 'browser_navigate|browser_click' --glob '**/SKILL.md'
```

On this profile that search still hit `browser_navigate` in research and debugging skills, including `software-development/debugging/SKILL.md` and `research/research/SKILL.md`. Those files still tell the model to call a tool the upgrade note removed. Edit the names you own. A leftover `browser_navigate` in a skill will fail the same way a leftover `mcp serve` fails: the CLI moved, the file did not.

The second upgrade note is for Desktop users. The app moved to Electron 44. The page says that ends Desktop support on macOS 11, macOS 12, and 32-bit Windows, and that Desktop needs macOS 13+ and 64-bit Windows, citing [PR #142727](https://github.com/NousResearch/hermes-agent/pull/142727). Read that line before you expect the Desktop package to launch on those older systems.

## Keep microsoft-office, and only turn the Webapp on if you want it

The fourth upgrade note says Word, PowerPoint, and Excel skills are now one `microsoft-office` skill. Old copies stay on disk until you remove them.

The bundled skill at this tag is `skills/productivity/microsoft-office`. Its frontmatter `name` is `microsoft-office`, `version` is `2.0.0`, and the description is "Create, read, and edit Word, PowerPoint, and Excel files." The body says it works offline with small Python CLIs on python-docx, python-pptx, and openpyxl, and that Office itself is never needed. Point prompts and skill lists at `microsoft-office`. Leave any old PowerPoint or Excel copies on disk until you choose to delete them. This profile still has a `powerpoint` directory under its skill archive.

The fifth upgrade note says the Webapp is off by default. Nothing is served to a browser until you turn on `webapp.enabled` or Web Access.

```bash
hermes webapp --help
```

The help text on this host says the gateway serves the workspace when `webapp.enabled` is true in `config.yaml`, and that the command builds the bundle when needed, starts the gateway, and opens a one-use sign-in link. `--status` shows whether the gateway is serving it.

```bash
hermes webapp --status
```

This host printed `Serving at http://127.0.0.1:9120`. The upgrade note still describes the default as off. If `--status` already prints Serving, the setting is already on. If you want the Webapp, the release names `webapp.enabled` or Web Access in Settings. If you want it left off, leave that flag alone.

New installs start on stable, per the Install, Update & Packaging section. `install.sh`, `install.ps1`, and Hermes-Setup check out the latest stable release instead of the tip of `main`. That matches leaving `origin/main` alone on a git install that already reports v0.23.0.

Try this today: run `hermes --version`, then `hermes mcp serve --help`. If the first line already says v0.23.0, the second line is the rename. Change any client `args` that still say `mcp`, `serve` to `mcp-serve`, and grep your own skills for `browser_navigate` before you trust an old how-to that still names it.
