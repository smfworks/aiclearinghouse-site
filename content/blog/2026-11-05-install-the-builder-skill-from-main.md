---
slug: "2026-11-05-install-the-builder-skill-from-main"
title: "Install the builder skill from main before you pin the October tag"
excerpt: "Install one Agent Framework builder skill with @main, then preview the October 30 tag and read the Python line before you pin it."
date: "2026-11-05"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-05-install-the-builder-skill-from-main"
categories: ["Microsoft", "AI Agents"]
tags: ["Agent Framework", "GitHub CLI", "skills", "how-to"]
readTime: 9
image: "/images/blog/2026-11-05-install-the-builder-skill-from-main-hero.png"
---

Your coding agent can take a Microsoft-written lesson for Agent Framework, and the install ref is the part to get right. The November 4 blog prints the install with `@main`. The skills README on that same repository still says the explicit `@main` ref is required until a tagged release includes the skill. The two newest language tags I checked this morning already include the skill folders, and several files inside them differ from `main`.

Install one builder skill with `@main`. Preview the October 30 tag before you pin it.

The page is [Give your coding agent a head start with Microsoft Agent Framework skills for .NET and Python](https://devblogs.microsoft.com/agent-framework/give-your-coding-agent-a-head-start-with-microsoft-agent-framework-skills-for-net-and-python/), by Eduard van Valkenburg and Wes Steyn. The saved HTML meta `article:published_time` is `2026-11-04T15:35:49+00:00`. That HTML has no `article:modified_time` meta. The visible date line is November 4th, 2026. The Agent Framework feed item is `Wed, 04 Nov 2026 15:35:49 +0000`, the same instant. Python put that stamp 20.47 hours before 7:04 AM Eastern on November 5. That clock is `2026-11-05T12:04:17Z`, from `date` this run.

By the end you can install one language skill from `main`, preview it, and see the Python sentence that changes on the October tag.

## Install one language skill from main

Everyday version first. This is a lesson file your coding agent reads while it writes the app. The real name on the blog is a builder skill, `agent-framework-builder-dotnet` or `agent-framework-builder-python`.

The blog says these are development-time skills for your coding assistant, not runtime skills loaded by the application you ship. Say that to a colleague before you paste the command. The app a person talks to still needs its SDK packages and model credentials. The blog prints that sentence on the same page.

Use a coding agent that supports the Agent Skills format. With GitHub CLI, the blog's .NET line is:

```bash
gh skill install microsoft/agent-framework agent-framework-builder-dotnet@main
```

The Python line is:

```bash
gh skill install microsoft/agent-framework agent-framework-builder-python@main
```

Pick the language you are shipping. One install is the step. The blog also prints a second installer, and it says to choose one installer and check that installer's docs for supported clients and scope. The other pair, copied from the same page, is:

```bash
npx skills add microsoft/agent-framework --skill agent-framework-builder-dotnet
npx skills add microsoft/agent-framework --skill agent-framework-builder-python
```

Those `npx` lines have no `@main`. Leave them as printed. The `@main` requirement I am about to quote is on the GitHub CLI lines.

The blog says both examples use `main` for the latest repository guidance, and to pin a tag or commit if you need a reproducible snapshot. The [skills README](https://github.com/microsoft/agent-framework/blob/main/skills/README.md) I fetched from raw `main` this morning says something else. The explicit `@main` ref is required until a tagged Agent Framework release includes the skill. Until then, unqualified `gh skill` installs and search discovery can resolve an older release that does not contain it.

Keep those two sentences on their own pages. Copy `@main` on the GitHub CLI install. If you want a snapshot, preview the tag in the next section before you drop the ref.

The README also prints `gh skill preview` before install. The blog does not. Preview is the README's look-first step, not a second requirement from the blog.

On this machine, `gh --version` printed `gh version 2.103.3 (2026-10-26)`. `gh skill --help` says working with agent skills in the GitHub CLI is in preview and subject to change without notice. The command I ran for the look-first step was:

```bash
gh skill preview microsoft/agent-framework agent-framework-builder-python@main
```

It exited 0. After a warning about skills in hidden directories, it printed the builder skill tree: `SKILL.md` plus nine files under `references/`. I left `--allow-hidden-dirs` off. The README says these are public distribution artifacts, not contributor instructions for working on the Agent Framework repository, and it says to keep the skills outside `.github/skills`, `.agents/skills`, and `.claude/skills` so repository agents do not discover them as project skills.

## Leave the skill on the coding agent

The lesson stays with the coding agent. The shipped app still needs its packages and a way to sign in to the model. That split is the blog's, quoted above.

Two more sentences live on the skill files, and the blog does not print them. The preview of `main` printed the first one: never run or deploy DevUI as a production application host. DevUI is the local debug UI. Leave it on your machine.

The second sentence is the docs lookup. The blog says to configure the Microsoft Learn MCP Server as a Streamable HTTP endpoint:

```text
https://learn.microsoft.com/api/mcp
```

Both skill files I fetched from raw `main` say that endpoint is for MCP clients and returns an error when opened directly in a browser. Copy it into the MCP client. Skip the browser tab.

If the app also calls other Microsoft services, the blog points Azure and Foundry work at the [Azure Skills Plugin](https://github.com/microsoft/azure-skills). It names a `microsoft-foundry` skill, plus `azure-prepare`, `azure-deploy`, and `azure-diagnostics`. Those names are the ones on this page. Copy them from the blog when you need that plugin. The builder skill install above is the Agent Framework lesson, and the blog treats the Azure plugin as a separate add.

The blog also says both skills favor the smallest suitable pattern. One agent when tools and sessions are enough. A harness when an operating loop is needed. A workflow when explicit stages, routing, and checkpointing are part of the requirements. A support assistant with several tools can stay one agent. That is the judgment the skill is written to push.

The page says the article was partially created with AI and an author reviewed it. The commands above are the ones in the saved HTML, not a paraphrase of that note.

## Compare the October tag before you pin it

The blog's pin sentence is real. A tag is a snapshot. The README's warning is also real, and it is about a release that does not contain the skill. This morning the GitHub releases API returned `python-1.24.0` at `2026-10-30T21:52:13Z` and `dotnet-1.27.0` at `2026-10-30T18:55:48Z` as the two newest releases. Python put those stamps 134.20 hours and 137.14 hours before the same 7:04 AM Eastern clock. They are October releases. The contents API, called with `ref` set to each tag and to `main`, showed a `skills/` directory on all three.

Each of those three trees listed `README.md`, `agent-framework-builder-dotnet`, and `agent-framework-builder-python`. The README blob sha was `640e926c314a` on `main` and on both tags. Same blob means the README text on the October tags is the text that still prints the `@main` requirement. The tags include the skill folders. The README sentence has not been rewritten to say so.

The skill files are a different story. I compared blob shas, file by file.

For `agent-framework-builder-python` against `python-1.24.0`, both trees have 10 files. Seven blobs differ:

- `SKILL.md`
- `references/evaluation.md`
- `references/extensibility.md`
- `references/hosting-and-deployment.md`
- `references/integrations.md`
- `references/observability.md`
- `references/workflow-builder.md`

The other three reference files matched: `agent-builder.md`, `declarative.md`, and `harness-agent-builder.md`.

Against `dotnet-1.27.0`, the Python skill has 10 files and six blobs differ. `references/evaluation.md` matches `main` on that tag. The other six differing paths are the same list as above, including `SKILL.md`.

The Python entry point is the one to read before you pin. Raw `main` is 6995 bytes. Raw `python-1.24.0` is 7047 bytes. Both frontmatters say `version: "0.3"`. The version field will not tell you which tree you installed. The changed sentence, from a diff of those two files:

The tag says "For new environments, use Python 3.11 or later within Agent Framework's currently supported range."

`main` says "Agent Framework requires Python 3.11 or later."

The rest of that bullet, about preferring the latest supported Python or the previous release, is the same on both. `gh skill preview microsoft/agent-framework agent-framework-builder-python@python-1.24.0` printed the "For new environments" line. The raw `main` file I fetched printed the "requires" line.

For `agent-framework-builder-dotnet`, both October tags have 10 files, and four blobs differ from `main` on each tag:

- `references/declarative.md`
- `references/hosting-and-deployment.md`
- `references/integrations.md`
- `references/observability.md`

The .NET `SKILL.md` blob matched `main` on both tags in that comparison. The copy I downloaded from `main` and from `dotnet-1.27.0` is 8260 bytes, with `version: "0.1"`. Matching entry-point bytes still leave those four reference files on the older text.

So the pin choice is a file choice. `@main` is the guidance the November 4 blog points at, and it is the ref the README still prints. `python-1.24.0` and `dotnet-1.27.0` contain the skill folders, which means they are past the README's "does not contain it" case, and they are behind `main` on the files listed above.

## Prompt the agent with the job

After the install, the blog says compatible clients discover the skill through its metadata, without a universal slash command. Prompt in ordinary language. Include the provider, the hosting target, the persistence you need, and the approval boundaries when you know them.

For a .NET app, the blog's example is:

```text
Add an Agent Framework support assistant to our ASP.NET Core app. Use our model provider, isolate conversations per user, require approval before changing tickets, and test tool behavior with a fake IChatClient.
```

For a Python app that already exists:

```text
Turn this Python Agent Framework research agent into a research-and-review workflow. Preserve its response format, add checkpointing, and test resume behavior using the project's existing test tooling.
```

Try the preview pair today, on the language you ship, before you change the install ref:

```bash
gh skill preview microsoft/agent-framework agent-framework-builder-python@main
gh skill preview microsoft/agent-framework agent-framework-builder-python@python-1.24.0
```

Swap in `agent-framework-builder-dotnet` and `dotnet-1.27.0` if that is your stack. Then install once, from `main`, with the GitHub CLI line from the blog.

If you pin `python-1.24.0` for a reproducible snapshot, which Python sentence do you want the coding agent to follow: "requires Python 3.11," or "for new environments, use Python 3.11"?
