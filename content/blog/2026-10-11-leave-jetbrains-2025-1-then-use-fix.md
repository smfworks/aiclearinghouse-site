---
slug: "2026-10-11-leave-jetbrains-2025-1-then-use-fix"
title: "How to leave JetBrains IDE 2025.1, then use Fix"
excerpt: "GitHub ended Copilot support for JetBrains IDE 2025.1 on 10 October. Move to 2025.2 or later, install the latest plugin, then use Fix on a diagnostic. The changelog does not name the plugin build or the MCP checkbox."
date: "2026-10-11"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-11-leave-jetbrains-2025-1-then-use-fix"
categories: ["Microsoft", "AI Agents"]
tags: ["GitHub Copilot", "JetBrains", "MCP", "Microsoft"]
readTime: 11
image: "/images/blog/2026-10-11-leave-jetbrains-2025-1-then-use-fix-hero.png"
---

If Copilot for JetBrains is still aimed at IDE 2025.1, move the IDE before you hunt for a new button. GitHub ended support for JetBrains IDE 2025.1. The plugin now needs 2025.2 or later. After that, a diagnostic's intention menu can open Fix, and a new MCP setting can stop Copilot and Claude servers from starting themselves.

That order is on the [10 October changelog](https://github.blog/changelog/2026-10-10-new-controls-and-chat-improvements-in-copilot-for-jetbrains). The changelog RSS `pubDate` is Sat, 10 Oct 2026 18:53:39 +0000, and that item is the newest entry in the [feed](https://github.blog/changelog/feed/) this morning. I fetched the page, the feed, and the JetBrains Marketplace updates API. I did not install the plugin, and I did not open a JetBrains IDE.

This is not the agent-metrics ship from [7 October](https://www.smfclearinghouse.com/blog/2026-10-07-update-the-ide-or-the-agent-rows-stay-missing/). That post is still waiting on a JetBrains build that restores `ide_version`. This page never mentions agent-edit rows.

## Move the IDE, then the plugin

Start with the deprecation line, not the feature list. The changelog says GitHub Copilot has ended support for JetBrains IDE 2025.1. You now need JetBrains IDE 2025.2 or later to use the plugin.

The page does not name a plugin version. It tells you to try the [latest version](https://plugins.jetbrains.com/plugin/17718-github-copilot--your-ai-pair-programmer/versions). Do not read "install 1.19.0" into that sentence. That number is not on the changelog.

The updates API is a separate source. I pulled [`plugins.jetbrains.com/api/plugins/17718/updates?size=30`](https://plugins.jetbrains.com/api/plugins/17718/updates?size=30) this morning. Thirty rows came back, in five note groups. The newest group is plugin 1.19.0. Seven rows share those notes:

| Version | `since` | `until` | `cdate` (UTC) |
| --- | --- | --- | --- |
| 1.19.0-252 | 252.0 | 253.* | 2026-10-09T05:23:41+00:00 |
| 1.19.0-261-windows-x64 | 261.0 | empty | 2026-10-09T05:24:31+00:00 |
| 1.19.0-261-windows-arm64 | 261.0 | empty | 2026-10-09T05:25:17+00:00 |
| 1.19.0-261-macos-x64 | 261.0 | empty | 2026-10-09T05:26:18+00:00 |
| 1.19.0-261-macos-arm64 | 261.0 | empty | 2026-10-09T05:27:10+00:00 |
| 1.19.0-261-linux-x64 | 261.0 | empty | 2026-10-09T05:27:59+00:00 |
| 1.19.0-261-linux-arm64 | 261.0 | empty | 2026-10-09T05:28:49+00:00 |

Those notes include the Fix action, the managed default, and the MCP switch. The previous group is 1.18.0, dated 18 September. Its notes do not include Fix.

I did not fetch a page that maps build 252 to "2025.2," or build 261 to a year. The changelog's floor is the words "2025.2 or later." The API's floor on the `1.19.0-252` row is `since` 252.0. Those are two sources. Leave the mapping unstated. If your IDE's About box and the plugin's `since` field disagree, do not invent the bridge.

There is an older sentence you should not treat as the current floor. The 1.18.0 notes, `cdate` 2026-09-18T03:56:19+00:00 on `1.18.0-251` (`since` 251.25410, `until` 253.*), say they added advance notice for JetBrains IDE 2025.1 users to upgrade to 2026.1 or later, and that support remained unchanged in that release. The 1.19.0 notes and the 10 October changelog both say the requirement is now 2025.2 or later.

Follow the October wording. Do not promote the September "2026.1" notice back into the requirement, and do not pretend the two sentences are the same sentence. I did not open a JetBrains download page, so I am not telling you which build number is 2025.2.

## What to do, in the order the page gives it

Run these steps after the IDE is on 2025.2 or later. Stop when a step has no path on the page. Filling that gap is how a how-to turns into a guess.

1. Install the latest plugin from the versions page the changelog links. If you are checking the API instead, the notes that match this changelog are on the 1.19.0 rows dated 9 October. Tell a teammate the changelog said "latest version." Do not tell them the changelog named 1.19.0.
2. If you administer the enterprise, use managed settings to choose any available Copilot agent model as the default for new conversations. Leave an explicit model picker choice alone. The changelog does not print the settings screen or the policy key.
3. On a diagnostic, open the intention menu and use Fix. Expect inline chat. Expect agent mode when that mode is available, and ask mode when it is not.
4. If configured MCP servers are starting on their own, look for the new setting that disables automatic startup for Copilot and Claude. The changelog does not name the checkbox. The 1.19.0 notes say manual Start and Restart stay available.
5. Do not close the agent-metrics gap because Fix shipped. This page never mentions `ide_version`.

## Set the default model only if you administer it

Enterprise administrators can use managed settings to choose any available Copilot agent model as the default for new conversations. An explicit model picker choice is still preserved. That is the whole instruction on the changelog.

If you are not the administrator, you do not have a click to make. You wait for the managed default, and you can still pick a model yourself. Do not invent a policy key so the runbook looks finished.

The 1.19.0 notes add a bug the changelog does not mention. The initial blank Copilot agent chat did not apply an available enterprise-managed default model until settings loaded. The notes say that is fixed, and an explicit picker choice is still preserved. Cite that sentence to the notes, not to the changelog. I did not reproduce the blank-chat case.

So the practical check, if you do administer the setting, is narrow. Open a new agent chat that you have not touched. See whether the managed default is already selected once settings have loaded. If you then pick a different model, that pick should stick. The notes say both of those. They do not say where the managed setting lives.

## Use Fix on the diagnostic, not a fresh chat

Open the diagnostic's intention menu. The changelog says that menu now includes a Fix action. Fix opens inline chat and asks Copilot to repair the issue. It uses agent mode when that mode is available, and ask mode otherwise.

The 1.19.0 notes say the same thing in plugin language. A Fix action on diagnostic intention menus opens inline chat to request a repair, using Agent mode when available and Ask otherwise. The changelog lowercases "ask mode." The notes capitalize "Ask." I am not treating that as two modes.

That is the concrete move. You do not start a new conversation and paste the error. You start from the diagnostic that already has the message. The page does not say Fix works on every inspection, and it does not name a shortcut. I did not click it.

If agent mode is not available, you still get ask mode. Do not treat a missing agent session as a failed Fix. The changelog says that fallback is the design.

## Stop MCP servers from starting themselves

A new MCP setting lets you disable automatic server startup for Copilot and Claude. The changelog says that gives you more control over when configured tools become active. It stops there. No settings page. No checkbox label. No policy key.

The 1.19.0 notes add one sentence the changelog does not: manual Start and Restart stay available when automatic startup is disabled. Cite that to the notes.

A docs search this morning for JetBrains Copilot MCP pages did not return a hit that names this switch. The pages that did come back describe adding a server, or starting a server that is not already running. That is a different action. Do not paste those steps in as the location of the new setting. If you cannot find the control after the latest plugin is installed, use the in-product feedback path the changelog names, or the [JetBrains feedback issues](https://github.com/microsoft/copilot-intellij-feedback/issues). Do not guess a Settings tree.

Two other MCP sentences live only on the notes, and they are not the auto-start switch. Copilot agent sessions were ignoring MCP servers configured in a repository-root `.mcp.json` file. The notes say that is fixed. On IntelliJ IDEA 2026.3 EAP, the IntelliJ IDEA MCP Server entry was missing in Customizations. The notes say that is fixed. Neither product name nor the `.mcp.json` path is on the changelog. Do not move them there. And do not treat "the file is read now" as "servers no longer start themselves." Those are different bugs.

I did not flip the switch, and I did not place a `.mcp.json` in a repo.

## The chat changes are real, and they are smaller

Same page, same release. These are not the reason you leave 2025.1, but they are on the page, so they belong in the pass:

- Signed-in Copilot accounts have clearer labels, a simpler status display, better navigation for long lists, and a Switch Account action.
- A one-time reminder helps new users find Chat. The sign-in page has a responsive layout, clearer headings, improved provider choices, a direct Copilot plans link, and cancellable progress during browser authorization.
- Chat messages are grouped by turn, with controls for moving between turns.
- User messages include actions to copy or edit their content.
- The Copilot agent placeholder highlights questions, edits, context, and commands.
- After you accept a migration command, Go Back opens a Copilot home session even when you continue the local conversation.

The notes match those bullets and add two placements the changelog leaves out. The one-time reminder sits beside the Chat icon for newly installed users. Go Back opens a Copilot home session after an accepted migration command, even when continuing the Local conversation. The changelog says "local." The notes capitalize "Local." I am not treating that as two products.

## Keep the bug list on the notes

The changelog says this release improves reliability during language server startup, model and provider switching, MCP configuration, customization refreshes, file changes, and worktree workflows. It also says it resolves interaction and display issues in model management, tool-call details, working sets, and JetBrains IDE settings. Those are categories. Do not turn them into a reproduction.

The notes name fixes. Keep the ones that change what you do on the notes, and leave the rest of that list there:

- Requests sent during Copilot language server startup were failing when initialization took longer than half a second. The notes say that is fixed. That is the specific version of the changelog's "language server startup" line.
- IDE freezes when switching chat agent providers with large model lists. Fixed, per the notes.
- Settings stayed open when opening MCP configuration files in JetBrains IDEs 2026.2 and later. Fixed, per the notes. "2026.2 and later" is not on the changelog.
- Copy Changes could hide local edits or change staged files when creating a Copilot CLI worktree, including when creation was cancelled. The notes say that is fixed. Cancelling that creation could also leave temporary worktrees and branches, or show a creation failure. Also marked fixed.

I did not reproduce any of those. If you hit one of them on 1.18.0, the notes are the claim that 1.19.0 addresses it. The changelog is not.

## What this page is not

The [7 October post](https://www.smfclearinghouse.com/blog/2026-10-07-update-the-ide-or-the-agent-rows-stay-missing/) said JetBrains was "Next plugin release" and "Not yet released, expected by late October 2026" for the agent-edit attribution gap. This 10 October page does not mention agent-edit rows, `ide_version`, or a plugin version number. Do not close that ticket because Fix shipped. Different claim. Different page.

It is also not the 8 October code-review billing switch. That changelog is a different URL, and it is about who pays for a review, not about a JetBrains intention menu. Do not fold it in.

And it is not a measured install. I did not time the plugin update, click Fix, or check whether a 2025.2 IDE accepts the `1.19.0-252` build.

## This morning

Read the IDE version first. If it says 2025.1, upgrade to 2025.2 or later before you look for Fix. The current sources for that floor are the 10 October changelog and the 1.19.0 notes. The September advance notice said 2026.1. It is not the current sentence.

Then install the latest plugin, use Fix from the diagnostic, and only then go looking for the MCP auto-start control. If the control is not where an older MCP doc said "Start" lives, stop. The new setting was not named there in the search I ran.

If you are on JetBrains IDE 2025.2 and the latest plugin still will not load, did the September "2026.1" notice turn out to be the real floor? I cannot see that from the two pages. The October sentence says 2025.2 is enough. The September sentence said otherwise, and then said support had not changed yet.
