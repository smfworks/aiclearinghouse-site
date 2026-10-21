---
slug: set-notion-agent-approval-before-send
title: Set the Notion Agent approval before you send
category: Security
excerpt: Open a Notion Agent chat, use the approval control at the top, and pick Always ask or Review for me. The help page says this is not on iOS, and it is not the Custom Agent setting.
tags:
  - notion
  - agents
  - approvals
  - connected-apps
order: 119
last_verified: "2026-10-21"
---

# Set the Notion Agent approval before you send

## The principle

Set the approval mode before the agent edits a page or posts through a connected app. If the control at the top of the chat is missing, stop. Do not invent a menu the help page does not name.

## Why it matters

Notion's help page says a Notion Agent can create pages, update databases, and act in apps you connect, such as Slack or Gmail. The approval setting decides when it stops to ask. New chats use your last mode unless you change it before you press send.

The October 19, 2026 blog names a **Review for me** mode that uses a separate model to check whether an action is safe before the agent takes it. The clicks are on the help page, not the blog. The help extract fetched this run does not print a published date. Do not date that page October 19.

## How to apply it

1. Open a chat with your Notion Agent. The help page says you can do this on the web and on Android. It says the setting is not available on iOS. If you are on iOS, stop. Do not treat a missing control as a bug you can click around.
2. Select the current approval setting at the top of the chat.
3. Choose the setting you want. The help page says it applies right away. The three names on that page are **Always ask**, **Review for me (default)**, and **Skip all approvals**.
4. Use **Always ask** when you want a prompt before every action that changes content or uses a connected app. Reading does not need approval. The page says the agent can search the workspace, open pages you can already see, read recent messages in a connected app, and answer questions without asking. It asks when it is about to change something or act outside Notion.
5. Use **Review for me** when you want it to keep moving and pause on actions it flags as potentially unsafe. The page's own limit is the point. This mode relies on the agent's review and will not always flag the same things you would. The examples it may ask about include page deletions or bulk content deletions, sending an email or posting a Slack message, viewing files or environment variables that may contain credentials, and installing dependencies or running build or test scripts with the computer.
6. Leave **Skip all approvals** off unless you already trust the exact job. The page says the agent will not check with you before changes that are hard to take back, including replacing page content or posting in a connected app. Admins can switch off the option to skip all approvals in **Settings**.
7. You can change the setting in the middle of a chat, before you hit send, and not while the agent is running. The new setting applies to what it does next. It does not undo what it already did. If you approved something by mistake, ask the agent to undo it, or use page history. A sent email or Slack message has to be fixed in that app.

## Red flags

- Teaching this on iOS. The help page says no.
- Applying the chat setting to a Custom Agent. The page says a Custom Agent asks based on its own settings, and the people who manage that agent control them.
- Assuming the choice follows you across workspaces. The page says the choice applies to the workspace where you set it. Set it in each one.
- Treating **Review for me** as a guarantee. The page says it will not always flag what you would flag.
- Looking for an AI Command Center to set this. The October 19 blog says that center is coming soon. It is not the approval control at the top of the chat.

## Quick win

Open one Notion Agent chat on the web. Read the approval name at the top before you send. If it says **Skip all approvals** and the job can post or delete, switch it to **Always ask** or **Review for me** before the next message.

## Sources

- Help page: https://www.notion.com/help/choose-how-notion-agent-asks-for-your-approval
- Blog, published October 19, 2026: https://www.notion.com/blog/notion-ai-more-for-less
