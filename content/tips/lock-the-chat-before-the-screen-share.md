---
slug: lock-the-chat-before-the-screen-share
title: Lock the chat before you share the screen
category: Security
excerpt: Open the chat menu, choose Lock chat, and confirm. If the label is missing, stop. A lock hides the chat from regular history. It is not encryption, and a PIN reset deletes the locked chats.
tags:
  - chatgpt
  - privacy
  - screen-share
  - pin
order: 118
last_verified: "2026-10-21"
---

# Lock the chat before you share the screen

## The principle

If a conversation should stay out of the regular history while you share a screen, lock it before the share. If **Lock chat** is not in the menu, the account does not have the feature yet. Do not hunt for a hidden toggle.

## Why it matters

OpenAI's release notes for October 20, 2026 say locked chats hide selected conversations from regular chat history, pinned chats, and search. You open them with a 4-digit account PIN or supported device authentication. The same notes say retention and model-improvement settings stay unchanged.

The help page fetched this run is stricter about what the lock is not. It does not create end-to-end encryption or a separate encrypted vault. It does not change how long OpenAI retains the chat. It does not change **Improve the model for everyone**. It does not remove information ChatGPT remembered before you locked the chat. It does not override workspace policies, safety requirements, or legal and compliance obligations.

Those two pages do not use the same availability sentence. The release notes say the rollout is gradual, to Free, Go, Plus, and Pro, on the web, in the iOS and Android apps, and in the new ChatGPT desktop app for macOS and Windows. The help page says locked chats are available on Free, Go, Plus, Pro, Business, Enterprise, and Edu, and not on ChatGPT for Healthcare. If your plan is on one list and not the other, stop and use the menu you can see. Do not average the lists.

## How to apply it

1. Open the chat you want to hide from regular history. Open the more options menu (**•••**). Select **Lock chat**. Select **Lock chat** again to confirm. Create or enter the account PIN when prompted. The release notes stop at the first **Lock chat**. The help page adds the confirm step and the PIN. Do both if the second prompt is there.
2. The first lock prompts you to create a PIN. Select **Create a PIN**, enter a 4-digit PIN, and enter it again. The help page says the same PIN works on supported devices signed into the same OpenAI account. Device authentication is separate on each device.
3. After the lock, find the chat under **Projects**, then **Locked chats**. The sidebar may show the project while titles stay hidden until you authenticate. Opening a locked chat is temporary. It does not return the chat to regular history.
4. When you are done, select **Lock now**. On the web, access is the tab where you entered the PIN. A refresh or a closed tab ends it. Another tab asks again. On iOS and Android, access ends after 1 minute away from a locked chat or the Locked chats area, or after 1 minute in the background.
5. Check other open devices before the screen share. The help page says other devices that already have ChatGPT open may keep showing the title until their lists refresh. On iOS, previously loaded content may stay visible until the app refreshes. On the web, the chat can stay open in the current tab after you lock it. Other tabs do not get access.
6. If you need the chat back in regular history, open it, open **•••**, select **Unlock chat** (or **Unlock** on iOS), and confirm. A chat that came from a project returns to regular history, not to the previous project.

## Red flags

- Treating the lock as encryption. The help page says it is not.
- Resetting a forgotten PIN because you want the chats back. Reset deletes all locked chats, remembered information stored only inside them, and files or other content protected only by the previous PIN. OpenAI Support cannot recover that. Changing a PIN you still know does not delete the chats. The change path is **Settings**, **Security and login**, **Account PIN**, then **Change** on web or desktop, or **Change PIN** on iOS or Android.
- Locking a chat that already has a shared link and assuming the link died. The help page says the old shared content stays available. New messages sent while the chat is locked are not added to that link. Delete the link separately. A chat created from a shared link cannot be locked. Those are different sentences.
- Trying to lock a temporary chat, an archived chat, a group chat, a chat in the earlier Health experience, a chat with scheduled tasks, a chat with meeting recordings, a chat associated with background tasks, or a chat with responses saved as project sources. The help page lists those as unavailable. Codex conversations, including cloud Codex conversations, and local Work conversations cannot be locked. On desktop, use the new ChatGPT app. Voice is not available in locked chats in the desktop app.
- Assuming a workspace admin can unlock the chat or reset the PIN. The help page says they cannot. Enterprise and Edu locked chats are still in conversation message logs through the OpenAI Compliance Platform.

## Quick win

Before the next screen share, open one eligible chat and look for **Lock chat** in **•••**. If it is missing, stop. If it is there, lock it, confirm, set the PIN, then look at a second device before you share.

## Sources

- Release notes, October 20, 2026: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- Help page fetched this run: https://help.openai.com/en/articles/20001411-using-locked-chats-in-chatgpt
