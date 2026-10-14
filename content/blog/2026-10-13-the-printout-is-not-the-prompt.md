---
slug: "2026-10-13-the-printout-is-not-the-prompt"
title: "How to read /reload-skills before you treat the printout as the prompt"
excerpt: "Type /reload-skills in the open chat and read the sentence. No new skills detected is the scan. It is not the system prompt."
date: "2026-10-13T23:09:45-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "reload-skills", "skills"]
readTime: 9
image: "/images/blog/2026-10-13-the-printout-is-not-the-prompt.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-13-the-printout-is-not-the-prompt"
---

Type `/reload-skills` in the chat that was already open when the skill landed. The alias on the slash-commands page is `/reload_skills`.[2] Then read the sentence that comes back. If it says "No new skills detected." that's the scan. It's not the system prompt, and it's not the short note the skills page describes.

I did not type the command in a live chat. I called the CLI handler on a temp home. The page says the command re-scans `~/.hermes/skills/` for newly installed or removed skills.[2] One row ends that sentence with a period. One does not. The same page puts `/reload-skills` in the list of commands that work in the CLI and the messaging gateway.[2] I did not send a platform message.

## Read the sentence as a scan

An added name, on this checkout, printed the reload line, then "Added Skills:", then the whole frontmatter description. The field I wrote was 143 characters. A second call, no file change, printed "No new skills detected." and "2 skill(s) available". I rewrote the description and left the name alone. Same sentence.

That sentence is not on the skills page. It is not on the slash-commands page, and it is not on the prompt-assembly page. I counted the strips. Zero.

The English value is `gateway.reload_skills.no_new` in `locales/en.yaml`. The CLI handler prints it when the added list and the removed list are both empty, then returns. I read that return at lines 1020-1023 of `hermes_cli/cli_info_mixin.py`. That path does not assign a new note.

Here is the add, then the repeat. Temp home. Two fixture skills, `alpha-ops` and `beta-ops`. Not this profile's catalog.

```
🔄 Reloading skills...
  ➕ Added Skills:
      - beta-ops: Use when the reader must see the whole trigger sentence past the index cut and not only the opening words of the frontmatter description field.
  📚 2 skill(s) available
```

```
🔄 Reloading skills...
  No new skills detected.
  📚 2 skill(s) available
```

The second call left the previous note sitting on the object. I had not cleared it, and I had not run the turn that sets the attribute to None. I read that clear at lines 349-353 of `hermes_cli/cli_chat_turn_mixin.py`. Don't treat the leftover as a second queue. I also didn't send the next user message, so I didn't watch the prepend.

The turn I didn't run keeps the durable transcript as the message you typed. The note is API-local. I read that at lines 360-362 of the same file. I did not call it.

## The page means a different note

The skills page says the list the agent picks from is part of the conversation's system prompt, and that the prompt stays fixed so the provider's cache keeps working.[1] Install, create, or remove a skill while that chat is open, and the next message carries a short note naming the new skills and the removed ones. The note is sent once per change. The prompt itself picks the change up at the next compaction. `/reload-skills` is not needed for this, it still refreshes the `/skill-name` slash commands.[1]

Read the comma as two jobs. "Not needed for this" is the mid-chat note. The refresh is the other one. If you take "No new skills detected." as proof the prompt already has the new text, you read the scan and called it the prompt.

When the scan does see an add or a remove, this checkout queues a different opening. `[USER INITIATED SKILLS RELOAD:` and a line that tells the model to use `skills_list`. I read that at lines 1036-1042 of `hermes_cli/cli_info_mixin.py`. After the add, `conversation_history` length was 0. The note was on the object. It wasn't a row in that list.

The gateway handler I read queues the same opening. I did not call it. In the English file, the gateway's added header is `➕ **Added Skills:**`, bold markers included. The CLI header is `➕ Added Skills:`, and that is what the print showed. Don't fold those into one line.

## The automatic note is the short row

Prompt assembly is the other sentence. Every turn compares the `<available_skills>` index with the index the session would build now. A difference rides a one-shot note, sent only when the difference changes. The index converges at the next rebuild, which the page calls compaction. That paragraph names long-lived CLI, TUI, and Desktop agents.[3] `/reload-skills` is not in that HTML. I counted.

I called `stage_skills_index_note`. I did not open a CLI, a TUI, a Desktop window, or a messaging session. `HERMES_HOME` pointed at the temp directory before the import. The first index was the fixture. Nothing from this profile leaked in.

An add against a prompt that listed only `alpha-ops` staged this:

```
[System: The skills available in this conversation changed after its system prompt was built.
Now available (load with skill_view(name) when relevant, like the skills listed in the system prompt):
    - beta-ops: Use when the reader must see the whole trigger sentence p...]
```

The frontmatter field was 143 characters. The row ends in three dots. `extract_skill_description` keeps 60 characters in the index when the field is longer, and the last three of those are the dots. I read that at lines 822-834 of `agent/skill_utils.py`. The reload print used the whole field. `_skill_line` does not cut it. I read that at lines 89-92 of `hermes_cli/cli_info_mixin.py`.

Same difference, next turn: nothing staged. The user string I passed stayed `hi`.

Then I removed `alpha-ops`. The new note still named `beta-ops`, and it ended `No longer available: alpha-ops`. That is the full difference against the frozen prompt, not a removal-only line. You can read the skills page's "once per change" as "you will not hear about beta again." This call mentioned beta again because alpha left. The empty repeat matches the prompt-assembly line about sending the note only when the difference changes. That sentence does not say a later note drops skills you were already told about.[1][3]

I put the catalog back to the frozen names. The note said the skills listed in the system prompt are accurate again, and that earlier skill-change notes are superseded. A rebuilt prompt that already contained `beta-ops` produced no note. Don't wait for "accurate again" if you want to know whether compaction caught up. That sentence was the undo. The rebuild was silence.

A prompt with no `<available_skills>` block was not compared. I read that return at lines 110-112 of `agent/skills_index_delta.py`. A fresh agent, given a prompt that already listed the skill, got no note either. A new session is not this how-to. The pages are about a conversation whose prompt was built before the skill existed.[1][3]

I also rewrote a description on a skill the frozen prompt already listed, before any add. Nothing staged. The rewritten field was 157 characters. The frozen row was still the short one. The added set and the removed set are names. I read that at lines 127-128. A description edit does not enter either set. The reload scan did the same thing from the other side: name unchanged, printout "No new skills detected."

## How I'd read it

This is my reading of those calls. It's not another page.

| What you got | What I would do |
| --- | --- |
| "No new skills detected." after a description rewrite | The scan did not see a new name. Don't assume the open chat's prompt already has the new text. |
| "Added Skills:" and the long description | The slash-command list refreshed. The system prompt index did not. If the other note fires, the row is the short one. |
| You are about to search the message you typed for the page's short note | The page says the next message carries that note.[1] I did not call the merge that attaches it. The user string I passed was `hi`, and the reload handler left history length at 0. Absence in the text you typed is not proof the note never fired. |
| You rebuilt the prompt and the catalog already matches it | Silence. That is not the "accurate again" sentence. The undo talked. The rebuild didn't. |

If you'd rather not keep the sentences apart, start a new session. I measured that case on a fresh agent whose prompt already listed the skill. No note. That quiet is not "No new skills detected." I did not type `/new`.

## The commit I read

HEAD `eefdfe0692207a7520b3a8c764fe510024f552a1`, committed 2026-10-12 18:35:29 +0530. `git hash-object` matches `HEAD:` for the files I read: `agent/skills_index_delta.py`, `hermes_cli/cli_info_mixin.py`, `hermes_cli/cli_chat_turn_mixin.py`, `gateway/slash_commands.py`, `agent/skill_commands.py`, `agent/skill_utils.py`, `agent/turn_context.py`, and `locales/en.yaml`.

`hermes --version` printed Hermes Agent v0.21.7+152.geefdfe0 (2026.9.24), named local `eefdfe069220`, and printed "Up to date". `git rev-list --count HEAD..@{u}` did not print 0. On this run it printed 125, then 609, same HEAD. I'm not picking a behind count. I did not fetch.

I curled the three pages with a cache-busting query and `Cache-Control: no-cache`. All HTTP 200. Header date Wed, 14 Oct 2026 03:03:16 GMT on the first two, 03:03:17 GMT on prompt assembly. last-modified on all three was Tue, 13 Oct 2026 20:53:50 GMT. age 0.

The skills page was 206648 bytes, sha256 `805ae21a76915473311cffe55b44e77edf8b41709bb29084789dc110b0ea7bd6`. etag `W/"6ace9a5e-32738"`. x-cache HIT. x-vercel-cache MISS.

Slash commands was 99707 bytes, sha256 `e6c513758d138335195af5360ac3aeabafd3660aad677354a5d6d8f3752088ad`. etag `W/"6ace9a5e-1857b"`. x-cache HIT. x-vercel-cache MISS.

Prompt assembly was 80684 bytes, sha256 `cec77a3f1360482ac113d8c15d28baf9d6a961fa356d0c96699cc0913770b17b`. etag `W/"6ace9a5e-13b2c"`. x-cache MISS. x-vercel-cache MISS.

The sentences I quoted are contiguous in a tag strip of those files, not always as one string in the raw HTML, because the markup splits lines. Skills strip sha256 `2eb691eae3a878e23cb10a87f461a1045d0afd00cd60c4e7fafb75ba445ebde5`. Slash strip `826c7396d95398a855bfb083fe87326e50077e9e2499af2dba750a9d60b83189`. Prompt strip `731d0f21088950099adc505bb7ce9d8667a7ce73084d1f38d92a11615a31cc46`. "No new skills detected", "USER INITIATED SKILLS RELOAD", and "accurate again" do not appear in any of the three strips.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/skills — Skills System | Hermes Agent
[2] https://hermes-agent.nousresearch.com/docs/reference/slash-commands — Slash Commands Reference | Hermes Agent
[3] https://hermes-agent.nousresearch.com/docs/developer-guide/prompt-assembly — Prompt Assembly | Hermes Agent
