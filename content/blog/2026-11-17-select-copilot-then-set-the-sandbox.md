---
slug: "2026-11-17-select-copilot-then-set-the-sandbox"
title: "Select Copilot under Session Target, then set the sandbox"
excerpt: "VS Code 1.146 deprecates the Local harness. Pick Copilot in Session Target first. That pick leaves the sandbox where it was. Set the wall, then read /sandbox policy."
date: "2026-11-17"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-17-select-copilot-then-set-the-sandbox"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "VS Code", "Session Target", "sandbox", "how-to"]
readTime: 10
image: "/images/blog/2026-11-17-select-copilot-then-set-the-sandbox-hero.png"
---

If the chat title in VS Code still starts with Local, start a new session and pick Copilot in the session menu before you change the sandbox. That menu is Session Target. The harness is the program that coordinates the model, the context, and the tools. The sandbox is the wall around the files and the network those commands can reach. Pick the program first. Set the wall second.

By the end you will read the title prefix, start a Copilot session, turn the wall on, and check `/sandbox policy`.

## Read the November 16 page first

The news is the GitHub Changelog post [VS Code retires the Local harness in February 2027](https://github.blog/changelog/2026-11-16-vs-code-retires-the-local-harness-in-february-2027). I fetched that URL this morning. HTTP 200. The final URL adds a trailing slash. The body is 105,467 bytes. The author in the page JSON-LD is Allison.

The graph JSON-LD `datePublished` is `2026-11-16T19:22:56+00:00`. The TechArticle JSON-LD prints the same instant as `2026-11-16T11:22:56-08:00`. `dateModified` and the meta `article:modified_time` are `2026-11-17T01:17:41+00:00`. The changelog feed `pubDate` is `Mon, 16 Nov 2026 19:22:56 +0000`, the same instant as `datePublished`.

Python, against the fetch clock `2026-11-17T12:02:56Z` (7:02 AM Eastern), put `datePublished` 16.67 hours earlier and `dateModified` 10.75 hours earlier. Against 07:00 ET (`2026-11-17T12:00:00Z`) those ages are 16.62 hours and 10.71 hours. Inside 48 hours.

The page says Visual Studio Code 1.146 deprecates the Local harness, the older software that coordinates the model, context, and tools for GitHub Copilot agent sessions in the editor. The Local harness will be removed in February 2027.

Its replacement, the Microsoft Copilot harness, is built into VS Code and has been the default for new sessions since VS Code 1.143. You can keep working in VS Code and running agent commands on your machine. Choosing the Copilot harness doesn't move your files to the cloud.

During the three-month transition, the Local harness remains available where your organization's policy permits. New features and improvements will focus on the Copilot harness.

The Foundry DevBlog feed's newest item this morning is still the November 11 model-choice post. That how-to already shipped. This changelog is the fresh primary.

## Name the harness you already have

The click pages are older than the changelog. I fetched both HTML pages and both markdown copies this morning.

[Move from the Local to the Copilot harness](https://code.visualstudio.com/docs/agents/run/move-to-copilot) returned HTTP 200, 182,366 bytes. [Choose an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses) returned HTTP 200, 168,824 bytes. Each HTML file has `ms.date` content `11/11/2026`. That stamp has no time. Treating it as `2026-11-11T00:00:00Z` is an assumption about a date-only field. Under that assumption, Python puts the docs 156.05 hours before the fetch clock and 156.00 hours before 07:00 ET. Outside 72 hours. Use them for the clicks. The November 16 changelog is the news.

The markdown copies are the click text below. `move-to-copilot.md` is 29,886 bytes and 276 lines. `agent-harnesses.md` is 24,934 bytes and 297 lines.

The harness page says an agent harness coordinates the language model, context, and tools that an agent uses to complete your task. To see which one the current chat is using:

- In the editor window, the active harness is shown as a prefix in the chat title.
- In the Agents window, the chat input box shows the active harness as the watermark.
- In the Agents window, hover over the session entry in the sessions list to see a tooltip showing the harness.

Read one of those three before you change anything. If the prefix, the watermark, or the tooltip already says Copilot, you can skip the menu pick and go to the wall.

## Start the session and pick Copilot

The changelog's step is one sentence. If you still use the Local harness, start a new session in VS Code and select Copilot under Session Target.

The move guide prints the longer path. Follow that path when you are in the editor.

1. Open the Chat view in the editor, or open the Agents window.
2. Select New Chat (`+`) in the Chat view, or New in the Agents window. Select your project when prompted.
3. Open Session Target and select Copilot.
4. Select an available model and agent for your task.

The harness page adds a step the move guide's numbered list places on its own line. In the Agents window, select the folder or GitHub repository for the session. Then open the Session Target UI control and select an available harness or the Cloud target. The control only lists targets whose requirements are met in the current window.

If you are in the Agents window, do the folder step. If you are in the Chat view, use New Chat. Both pages name Session Target. The harness page says to select a harness before you submit the first prompt for a session.

After the pick, choose a built-in agent from the agent picker. On the Copilot harness the page lists Ask, Agent, and Plan. Ask answers questions and uses only read-only tools. Agent implements changes and validates the result. Plan is invoked with `/plan`. Switching agents doesn't change the harness.

The same page says selecting a model changes the model used within the current harness. Its example is a Claude model selected inside a Copilot session. That pick still uses the Copilot harness. Changing Ask or Agent also leaves the harness alone. Check the title prefix, the watermark, or the tooltip. The model name is the model. Session Target is the harness.

If you need the old conversation, open the Local session in the editor. In its chat input, open Session Target and select Copilot. The move guide says the handoff carries the conversation history and context to the destination session. Review the available model, tools, and permissions before continuing, because they can differ between harnesses. The guide calls that handoff one-way.

The Agents window leaves Local off the list. When policy still allows Local, start that session from the editor's Chat view and select Local under Session Target. Use that only while you adapt an integration that still depends on it. The February 2027 removal is the deadline on both pages.

The Copilot CLI sandbox paragraph from yesterday is a different product. This menu is the editor. Do not paste a CLI allow-list into Session Target.

## Set the sandbox after the pick

The changelog splits the two steps in one sentence. With the Copilot harness, administrators can enforce managed runtime permissions and sandbox restrictions that the Local harness cannot enforce. Configure these controls separately. Selecting the Copilot harness doesn't enable sandboxing.

The move guide says the same split for the require step. Requiring the harness doesn't turn on sandboxing or add permission rules. Deploy those controls separately.

Keep both sentences. The changelog is about the menu pick. The guide is about an administrator requiring the harness. Neither sentence turns the wall on for you.

The guide's get-started row is the wall. It names the setting `chat.agent.sandbox.enabled` (the markdown writes that as `setting(chat.agent.sandbox.enabled)`). Set it to `on` on the execution host. That host is the machine where the commands run. Start a new session and run `/sandbox policy` to check the restrictions.

A later rollout step on the same page tells you what to read in that report. In the Copilot session, run `/sandbox policy`. Check the execution host, sandbox state, file system access, and network restrictions. The page says this report is also available when sandboxing is off. So a report that shows the wall off is still a successful check. It means the setting step is still in front of you.

There is a second key, and it is a different control. Starting with VS Code 1.143, managed nonempty `permissions.deny` rules or `sandbox.enabled: true` also require the Copilot harness unless the temporary Local default applies. Other `permissions.*` settings and an empty deny list don't trigger that routing.

`sandbox.enabled` in that sentence is the managed key that can force the Copilot harness. `chat.agent.sandbox.enabled` is the wall on the execution host. Set the wall with the second name. Leave the managed key to the person who deploys enterprise settings.

The same guide's comparison table says what each control does, in case the report and the approval prompt get mixed up.

| Control | What the guide says it does |
| --- | --- |
| Approvals | Determine whether an action can run automatically or needs your confirmation. Approving a command doesn't isolate it. |
| Local sandboxing | Restricts the file system and network access of supported processes on the execution host. It doesn't move the task to another machine. |
| Cloud sandbox | Runs the agent, code, and tools in a managed cloud environment rather than on your development machine. |

The guide also says to skip a Local-harness device policy when you are checking Copilot. A sandbox device policy written for the Local harness is a different control from the Copilot runtime wall. The page points at sandbox administration for that review. Follow that link with your administrator. The menu pick is not that review.

## If you administer, drop the temporary exception

The changelog's admin step is separate from the menu. If you administer VS Code, review any `vscode.temporaryDefaultToLocalHarness` exception and verify your required workflows, permission controls, and sandbox configuration with the Copilot harness before February 2027. The temporary enterprise-managed setting will be removed along with the Local harness, so keeping the exception configured won't keep the Local harness available.

The move guide prints the rollout values for VS Code 1.143 or later. Add these keys to enterprise-managed settings, not to the editor's user or workspace settings.

```json
{
    "vscode": {
        "temporaryAllowLocalHarness": false,
        "temporaryDefaultToLocalHarness": false
    }
}
```

`temporaryAllowLocalHarness: false` prohibits the Local, Claude, and Codex harnesses. It takes precedence over the temporary Local default. Setting `temporaryDefaultToLocalHarness` to `false` also clears that rollout opt-out. The step this page asks you to take is the Copilot harness. The same key also closes the other harnesses.

The harness page adds a version split the changelog leaves out. Starting with version 1.142, administrators can set `vscode.temporaryDefaultToLocalHarness` to `true`. That keeps the Local harness available and suppresses automatic Copilot routing, including routing triggered by managed sandbox and permission settings. It preserves explicit, remembered, and current harness choices. Starting with version 1.143, `vscode.temporaryAllowLocalHarness: false` prohibits Local, Claude, and Codex and overrides that temporary default.

Follow the changelog for the removal. Follow the guide for the JSON. The docs `ms.date` is November 11. The removal sentence on the November 16 page is the one with the deadline.

Switching harnesses doesn't automatically convert every customization. The changelog says to review customizations for compatibility before February 2027. The move guide's check is Chat: Open Customizations, then Migrations. Hooks have no automatic conversion. Do that review after the session is on Copilot and the sandbox report matches the wall you wanted. The menu pick does not rewrite those files.

## Try it on the next session

Read the chat title prefix, or the Agents window watermark. If it says Local, start a new session and select Copilot under Session Target before the first prompt. Set `chat.agent.sandbox.enabled` to `on` on the execution host if you want the wall, then start another new session. Run `/sandbox policy` and read the sandbox state line. If you administer, search managed settings for `vscode.temporaryDefaultToLocalHarness` and plan to drop it before February 2027.

If the Session Target list hides Copilot, the harness page says the control only lists targets whose requirements are met. Start with the Copilot setup the same page links, then open the menu again.
