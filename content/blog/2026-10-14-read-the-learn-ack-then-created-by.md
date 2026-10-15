---
slug: "2026-10-14-read-the-learn-ack-then-created-by"
title: "How to read the /learn ack, then created_by, before you call the skill written"
excerpt: "Pass a source to /learn and read the sentence. That sentence is the ack. It is not the skill. After the turn, read created_by."
date: "2026-10-14T23:08:56-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "learn", "skills", "curator"]
readTime: 11
image: "/images/blog/2026-10-14-read-the-learn-ack-then-created-by.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-14-read-the-learn-ack-then-created-by"
---

Pass a source to `/learn` and read the sentence that prints. That sentence is the ack. It is not the skill. After the turn, if a file actually landed, open `$HERMES_HOME/skills/.usage.json` and read `created_by` for the name the agent reported. On this checkout a foreground create stamps `learn`. That stamp does not prove you typed the slash command, and it is not the curator opt-in.[2] Don't copy the curator page's example counts. Run `hermes curator status` on the install you are writing about.

I did not type `/learn` in a live chat. I called the builder. I did not send a platform message, and I did not click the dashboard button the skills page describes.[1]

## Pass a source

The skills page's examples are a local directory, a URL, a workflow you just walked, pasted notes, and a book.[1]

The directory example is `/learn the REST client in ~/projects/acme-sdk, focus on auth + pagination`.[1] The URL example on that page is an online doc page, fetched with `web_extract`.[1] The command is `/learn https://docs.example.com/api/quickstart`.[1]

The workflow example on that page is `/learn how I just deployed the staging server`.[1] The notes example is `/learn filing an expense: open the portal, New > Expense, attach the receipt, submit`.[1] The book example becomes a knowledge-base skill, and the path on the page is `~/books/designing-data-intensive-applications.pdf`.[1]

The slash-commands row is shorter. It says a directory, a URL, the workflow you just walked the agent through, or pasted notes.[3] The book path is not in that row. Don't collapse the two lists.

The skills page says `/learn` builds a standards-guided prompt and hands it to the agent as a normal turn. The agent saves with `skill_manage`. The write-approval gate applies if you have it on.[1] The same page's config comment says `false` means write freely, and that is the default.[1]

Because the live agent does the sourcing, it works the same in the CLI, the messaging gateway, the TUI, and the dashboard.[1] The slash-commands row names those four surfaces, and it says the dashboard Skills page.[3]

In the dashboard, the Skills page has a Learn a skill button. It opens a panel with a directory field, a URL field, and an open-ended text box, then composes a `/learn` request and runs it in chat.[1] I did not press that button.

## Read the sentence as an ack

On this checkout the CLI strings in `locales/en.yaml` are `⚡ Learning a skill from what you described...` and `⚡ Learning a skill from this conversation...`. The gateway strings are `Learning a skill from what you described…` and `Learning a skill from this conversation…`. Three ASCII dots, and a lightning bolt, on the CLI lines. The gateway lines use the ellipsis character and have no bolt. I read those keys at lines 3018-3019 and 794-795. I did not start a session. This profile's config has no `language` key. Don't claim a live chat printed the English line.

The CLI handler prints that sentence, then queues the built prompt as the next turn. I read that at lines 1615-1622 of `hermes_cli/cli_commands_mixin.py`. The gateway handler picks the ack, sends it, then rewrites the turn to whatever the builder returns. I read that at lines 880-896 of `gateway/run_inbound.py`. I did not call either handler. The print is not a skill file.

## An empty argument is not a no-op

The skills page does not contain the sentence the empty builder substitutes. I counted the tag strip of this curl. "the workflow we just went through" was 0.

`build_learn_prompt("")` still returned a turn. A whitespace-only argument returned the same string. 10085 characters, sha256 `7f40f43ea1df35d9d9a07a41bbe36bed453912f8262f29690ee4d40cf3ce7344`. The request it substituted is this:

```
the workflow we just went through in this conversation — review the steps taken and distill them into a reusable skill
```

That fallback is in the function, lines 136-142 of `agent/learn_prompt.py`. It is not the page's example. The page's workflow command is `/learn how I just deployed the staging server`.[1] Different sentence.

A sourced argument, the page's REST-client example, was 10033 characters, sha256 `ecf11c76f2ac7366c797da4885e706918322bf7998a9bab930ca55fd1a6aaf7a`. It did not contain the workflow sentence. Both strings open with `[/learn]`. The function returns text. It does not call `skill_manage`. The prompt tells the agent to save with that tool. The return value is not the save.

## Don't search the ack for a name

The skill file appears only if the queued turn's `skill_manage` create succeeds. If that tool says the write is staged, the gate is on. I called `evaluate_gate("skills")` against this profile. `write_approval_enabled("skills")` was false. The decision allowed, did not stage, and was not blocked. The message was empty. The string `write_approval` does not appear in this config. The file is 11034 bytes, sha256 `fb2774013da4a7cc98d3d0ba9d43ea7a69617b9de79411de7ac216093b3d6cd7`. The page's default is write freely.[1] Don't treat this allow as every install.

I read the off path at lines 201-207 of `tools/write_approval.py`. Gate off returns allow. I did not turn the gate on.

## Read created_by after the create

On this checkout a foreground create stamps `learn`, not `agent`. `record_created` writes `agent` only when `agent_created` is true. Otherwise it writes `learn`. I read that at lines 522-532 of `tools/skill_usage.py`. `skill_manage` calls it with `agent_created=is_background_review()`. I read that call at lines 756-758 of `tools/skill_manager_tool.py`.

I called `record_created` in a temp home. `HERMES_HOME` pointed there before the import. `is_background_review` was false. The record was `learn`, `use_count` 0, `pinned` false, `state` active, `created_at` `2026-10-15T03:04:25.236493+00:00`. I did not write a skill file. That name is not in this profile's usage file.

`learn` is not proof you typed `/learn`. The curator page says a foreground `skill_manage` create, including `/learn`, is recorded that way, and that this is not a curator opt-in.[2] The memory page puts a `/learn` result and a foreground `skill_manage` create in the same journey sentence.[4] I did not run `hermes journey`.

This profile has one `learn` record, `william-clearinghouse-blog`. `created_at` `2026-09-27T11:54:49.874774+00:00`, `use_count` 42, `state` active, `pinned` false. I read that this run. I did not watch that create. Don't narrate a `/learn` session for it.

The usage file is 49414 bytes, sha256 `488320fb5a06954dc93f5fa117dab1d9fc791d50597aa50856985d3c4eed7771`, 125 records. `created_by` values: null 110, installed 8, agent 6, learn 1. Every record in that file has the key.

## The leave-alone line is the opt-in

The curator page says those skills are not marked agent-created, and that the curator intentionally leaves them alone.[2] The same page says the background review can patch, rewrite, and add support files to a skill it learns from, whoever wrote it, including a pinned skill. It may archive only curator-managed skills, never pinned ones.[2] Don't read the first sentence as "the review cannot edit the file."

`created_by` is a policy flag, not a provenance claim.[2] I read the same distinction in `_is_curator_managed_record`, lines 290-297 of `tools/skill_usage.py`. The field name reads like authorship. The function treats `agent` as the opt-in. `learn` is not that value.

The pin command is a different how-to. One boundary only, and it is the archive sentence above. I'm not reopening that post.

## Run status. Don't paste the example.

The curator page's worked line says 43 curator-managed skills, agent-created=43, bundled=0, active 41, stale 2, archived 0. Unmanaged is 112, with pre-dates marker 34 and foreground-created 78.[2] That is the page. It is not this host.

I ran `hermes curator status` on this profile. It printed ENABLED, 11 runs, last run 2 days ago. The last summary was `auto: 2 marked stale, 1 archived; llm: skipped (consolidation off)`. The interval is every 7 days. A skill goes stale after 14 days unused, and the archive line is 30 days unused. Consolidate is off. Under the managed block it printed 4 skills, agent-created=4, bundled=0, active 1, stale 3, archived 0. Unmanaged was 93: pre-dates marker 47, foreground-created 46.

Don't add that block to the usage file. Status walks live `SKILL.md` files. I called `curated_report()`. Four names: `smf-clearinghouse-blog`, `smf-desktop-app-catalog`, `wisdomforge-academy-curriculum`, `wisdomforge-academy-sittings`. The other two agent stamps, `hermes-plugin-shipping` and `smf-lab-blog-tests`, are state archived in the usage file. Both `SKILL.md` files sit under `skills/.archive/`. They were not in that report. Status printed archived 0 under the managed block. Those are different counts. Don't add 6 and 4. Don't add 0 and the archive directory. I did not run `hermes curator list-archived`, and I did not count every file under `.archive/`.

`foreground-created 46` is not 46 learn stamps. The unmanaged rows on this host were 47 names with no usage record, 45 `created_by` null, and 1 learn. The printer counts a row as foreground-created when the `created_by` key is present, whatever the value. I read that at lines 68-72 of `hermes_cli/curator.py`, and the key test at lines 313-318 of `tools/skill_usage.py`. A null value still has the key. The page's parenthetical says foreground-created means a foreground create recorded `created_by: learn`, with older records unset.[2] On this host, 45 of the 46 have the key and the value null. Don't add the page's 78 to this 46.

## How I'd read it

This is my reading of those calls and those pages. It is not another page.

| What you got | What I would do |
| --- | --- |
| The ack sentence, and no skill file yet | Stop. The print is the ack. Don't search it for a name. |
| You passed no source, and the queued text talks about the workflow in this conversation | On this checkout that sentence is the builder's fallback. It is not on the skills page. A sourced argument did not contain it. |
| `created_by` is `learn` | Foreground create. It does not prove you typed `/learn`, and it is not the curator opt-in.[2] |
| The page says 43 managed and 112 unmanaged | That is the example. Run `hermes curator status` on the install you mean. This host printed 4 and 93. |
| Status says foreground-created 46 | Not 46 learn stamps. 45 of those rows were `created_by` null. The page's 78 is a different install's example. |

If the ack is the only thing in front of you, you do not have a skill yet. A `learn` stamp means a foreground create. It does not mean you opted that skill into the curator. When you need the managed count, run status on that install. The page's 43 and 112 are an example. They are not your printout.

Don't search the open chat's system prompt for the new name on the same turn. Yesterday's post covers the `/reload-skills` printout. I'm not retreading it.

## The commit I read

HEAD `eefdfe0692207a7520b3a8c764fe510024f552a1`, committed 2026-10-12 18:35:29 +0530. Subject: refactor(kanban): task_age reads the timestamps from_row already coerced. `git rev-parse HEAD:<path>` matched `git hash-object` for the files I read: `agent/learn_prompt.py`, `hermes_cli/cli_commands_mixin.py`, `gateway/run_inbound.py`, `tools/skill_manager_tool.py`, `tools/skill_usage.py`, `tools/write_approval.py`, `hermes_cli/curator.py`, and `locales/en.yaml`.

`hermes --version` printed Hermes Agent v0.21.7+152.geefdfe0 (2026.9.24), named local `eefdfe069220`, and printed "Update available — run 'hermes update'". `git rev-list --count HEAD..@{u}` printed 609. I'm not treating the version line as a behind count. I did not fetch. I'm not saying the install is up to date.

I curled the four pages with a cache-busting query and `Cache-Control: no-cache`. All HTTP 200. Header date Thu, 15 Oct 2026 03:04:06 GMT on skills, 03:04:07 GMT on the other three. last-modified on all four was Thu, 15 Oct 2026 02:55:14 GMT. age 18 on skills, 17 on the others. x-cache MISS. x-vercel-cache HIT. The etag prefix on all four was `6ad04092`. Don't treat four pages that share a last-modified as four independent deploys.

The skills page was 206648 bytes, sha256 `eae113a9984838b09a54ddcbbe5ba3b56d5f90de9fbb3249c48e960b0ca436f8`. etag `"6ad04092-32738"`. Title: Skills System | Hermes Agent.

Curator was 100046 bytes, sha256 `ba4f3ed6acca79fc53abd53977573943c6c768540c2c4f37cac311c81cd86daf`. etag `"6ad04092-186ce"`. Title: Curator | Hermes Agent.

Slash commands was 99707 bytes, sha256 `27ede08323229c5da92b707a4cd75553d1125c611c5da701cabf9cc4c1187a26`. etag `"6ad04092-1857b"`. Title: Slash Commands Reference | Hermes Agent.

Memory was 103315 bytes, sha256 `7e2d88b1b84b96fe7876d7e781194bfaeab31145779c7bdd43345c24dda6242c`. etag `"6ad04092-19393"`. Title: Persistent Memory | Hermes Agent.

The sentences I quoted are in a tag strip of those files. Skills strip 56372 bytes, sha256 `b56c0939f7c4289030e3d33f2aeb64b32718d7c07f6fd8c711e8bdbca787a84e`. Curator strip 27065 bytes, sha256 `96873fb5b256b5e98a03f051532973b092ffb9de5197808f34caa02ac7acd1c5`. Slash strip 44994 bytes, sha256 `105d12663fe834c7f851ffe6497223f771c0195b0d6e47b1629f32f72e6c8706`. Memory strip 32451 bytes, sha256 `941b4e845070b28937abfa463d07f7e2c5aceb640696027e5fb19ef59e377006`. "the workflow we just went through" does not appear in the skills strip. The markup splits some sentences, so a raw-HTML search will miss a line the strip still contains.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/skills — Skills System | Hermes Agent
[2] https://hermes-agent.nousresearch.com/docs/user-guide/features/curator — Curator | Hermes Agent
[3] https://hermes-agent.nousresearch.com/docs/reference/slash-commands — Slash Commands Reference | Hermes Agent
[4] https://hermes-agent.nousresearch.com/docs/user-guide/features/memory — Persistent Memory | Hermes Agent
