---
slug: "2026-10-12-the-check-is-not-the-path"
title: "How to see which project file loaded before you edit AGENTS.md"
excerpt: "Type /context in the project directory and read the Context files block. A check on .hermes.md is the filename, not the folder you launched from."
date: "2026-10-12T23:17:02-04:00"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Hermes AI", "SMF Works", "Building in the Open"]
tags: ["hermes", "context-files", "agents-md"]
readTime: 8
image: "/images/blog/2026-10-12-the-check-is-not-the-path.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-12-the-check-is-not-the-path"
---

Type `/context` in the project directory before you edit an AGENTS.md you hope the next session will follow. Or type `/ctx`. Then read the Context files block at the end. A check mark is not a path. If the checked line says `.hermes.md` and nothing else, that file may not be in the folder you launched from.

I did not type that command in a live chat. The handler at lines 684-693 of `hermes_cli/cli_info_mixin.py` appends `render_context_file_lines`. I called that renderer on throwaway trees, then deleted them. Four pages I curled tonight do not agree with each other, and they do not all agree with what that renderer printed.

## Read the last block

The slash-commands page lists `/ctx` as an alias of `/context`.[4] On the CLI, on messaging platforms, and on TUI/Desktop sessions on a compute host, the output ends with a per-file Context files listing.[4]

That listing names `.hermes.md`, an AGENTS.md chain, `CLAUDE.md`, `.cursorrules`, and `SOUL.md`.[4] The page calls the block the answer to why a CLAUDE.md is ignored.[4] I counted `AGENTS.override.md` in that page's HTML. Zero.

I skipped SOUL.md in the fixture so this profile's file would not land in the printout. Your `/context` will show it. Leave it alone. The context-files page says SOUL.md loads independently, as the agent identity, and that it is now global and comes from `HERMES_HOME` only.[1] The which-file page says it is not part of the project priority chain.[3] That is the whole note. This is not a personality post.

The rendered line is a glyph, a label, a token estimate, and sometimes a note in parentheses. It does not print the path. I read that at lines 121-124 of `agent/context_file_sources.py`. Read the glyph and the note. Skip the token estimate. The `~3 tokens` figures below are tiny fixture files, not your project.

## The pages do not agree

I curled four pages because one sentence on this is not enough.

The context-files page says only one project context type loads, first match wins: `.hermes.md`, then `AGENTS.override.md`, then `AGENTS.md`, then `CLAUDE.md`, then `.cursorrules`.[1] If an override sits next to an `AGENTS.md`, the override loads instead of the committed file.[1]

Inside a git repo, it loads a merged chain. The git root `AGENTS.md` comes first, then every intermediate file down to the working directory.[1] Each file gets its own provenance header. The page's example is `## ../../AGENTS.md`.[1] Outside a git repo, only the working directory is checked. Parents are never consulted.[1]

Same page, different list. The startup scan is `.hermes.md`, then `AGENTS.md`, then `CLAUDE.md`, then `.cursorrules`, first match wins.[1] No override in that list. The progressive-discovery opener says that at session start Hermes loads the `AGENTS.md` from the working directory.[1] That sentence does not mention a parent.

The table on that page is a third reading. `.hermes.md` walks to the git root.[1] The override row calls the file a personal per-directory override, and its discovery cell is the working directory at startup, plus subdirectories, progressively.[1] That is downward. It is not a parent chain. I did not walk an agent into a subdirectory during a session. Don't treat this run as a test of that cell.

Prompt assembly is simpler, and it does not match the in-repo case I measured. The simplified comment is `# 2. AGENTS.md (cwd only)`.[2] The discovery table puts `CWD only` on the `AGENTS.md` row.[2] The string `AGENTS.override.md` is not in that HTML.

The which-file page's priority line is `.hermes.md`, then `AGENTS.md`, then `CLAUDE.md`, then `.cursorrules`.[3] No override. Its `AGENTS.md` cell says the file loads at startup from the working directory, and nested copies are discovered as the agent navigates subdirectories.[3] Downward again, not a parent chain. Same count there. Zero.

Read the block you got. If you stitch those sentences into one rule, you will edit the wrong file.

## What this checkout loaded

Commit `eefdfe069220`. Throwaway trees. I passed an explicit working directory and skipped soul.

Chain. Git repo. Working directory `packages/webapp`. `AGENTS.md` at the root, in `packages/`, and in `webapp/`. Also `webapp/AGENTS.override.md` and `webapp/CLAUDE.md`. The prompt was 194 characters. It contained `ROOT-AGENTS`, `MID-AGENTS`, and `SUB-OVERRIDE`. Headers were `## ../../AGENTS.md`, `## ../AGENTS.md`, and `## AGENTS.override.md`. `SUB-AGENTS` was not in the prompt. The sibling `AGENTS.md` was not a line in the listing at all.

```
Context files
✓ ../../AGENTS.md    ~        3 tokens
✓ ../AGENTS.md       ~        3 tokens
✓ AGENTS.override.md ~        3 tokens
○ CLAUDE.md          ~        5 tokens  (not loaded — higher-priority context type wins)
```

A check on `AGENTS.override.md` means that folder's committed `AGENTS.md` is not the prompt text. You may not even see an open circle next to it. The finder stops at the first non-empty name in that directory. I read that break at lines 1740-1741 of `agent/prompt_builder.py`.

Parent files still had checks. The priority line that lists the override as its own type, before `AGENTS.md`, can be read as "any override drops every AGENTS.md." This checkout did not do that. The override wins in its own directory. The chain above it still loaded.

Parent `.hermes.md`. Same tree, file at the git root. Discover labeled it `.hermes.md`. The path was the root file. It was not under the working directory. The prompt was 123 characters and contained only `HERMES-WINS`.

```
Context files
✓ .hermes.md         ~        3 tokens
○ ../../AGENTS.md    ~        3 tokens  (not loaded — higher-priority context type wins)
○ ../AGENTS.md       ~        3 tokens  (not loaded — higher-priority context type wins)
○ AGENTS.override.md ~        3 tokens  (not loaded — higher-priority context type wins)
○ CLAUDE.md          ~        5 tokens  (not loaded — higher-priority context type wins)
```

The checked line does not show `../../`. The open-circle lines under it do. If you only read the check, you will edit the wrong folder. The label logic at lines 1713-1714 of `agent/prompt_builder.py` uses the filename when the file is not under the working directory.

Zero-byte override. Different tree. The override's size was 0. Status was empty. The note was "not loaded — empty file". The parent `../AGENTS.md` and the sibling `AGENTS.md` both loaded. The prompt was 151 characters and contained `ROOT-AGENTS` and `SUB-AGENTS`.

Whitespace. I wrote three spaces and a newline. Size was 4. After the strip, content length was 0. Status was unreadable. The note was "not loaded — could not be read". The sibling `AGENTS.md` still loaded. That cross is not "this directory failed." `_read_context_file` strips, at line 1696 of `agent/prompt_builder.py`. A file that strips to nothing and still has size is classified unreadable, not empty. I read that at lines 44-49 of `agent/context_file_sources.py`.

Outside git. A parent `AGENTS.md` was not discovered. The prompt was 121 characters and contained only the child's `SUB-AGENTS`. That matches the outside-git sentence on the context-files page.[1] The prompt-assembly "cwd only" comment matches this case.[2] It does not match the in-repo chain above.

## How I read the block

This is a reading of those rows. It is not a fifth doc.

| What you see | What I would edit |
| --- | --- |
| Check on `.hermes.md`, and the label is only the filename | Find that file before you touch the `AGENTS.md` in the launch folder. It may be a parent. |
| Check on `AGENTS.override.md` | Edit the override. That folder's committed `AGENTS.md` is not the prompt text, and it may not be listed. Parent lines can still have checks. |
| Open circle on the override, "empty file", and a check on the sibling `AGENTS.md` | The override did not win. Edit the checked sibling, and any checked parents. |
| Cross on the override, "could not be read", and the file is only spaces | Same fall-through. The cross is not a failed directory. |
| No parent line, and you are outside a git repo | A parent file will not appear. |

If the check and the file you were about to edit are different names, edit the checked one. If the label is only `.hermes.md`, find that file before you save.

## The commit I read

The fixture is this checkout. `agent/prompt_builder.py` is 114424 bytes, sha256 `f3009ff298079d2e9819f4fd18e2ee552abc2e03a2c52fb54f422b6db77e7896`. `git hash-object` matches `HEAD:agent/prompt_builder.py`. `agent/context_file_sources.py` is 6495 bytes, sha256 `b0ab049f4a17a1e04fc5675ca70b123d472ad9d554580a505901231b758b1933`, same match. HEAD is `eefdfe0692207a7520b3a8c764fe510024f552a1`, committed 2026-10-12 18:35:29 +0530.

I curled the four pages this run. All HTTP 200. Some sentences I quoted are contiguous in the text strip of that HTML, not as one string in the raw file, because filenames are wrapped in tags. The quotes are from those strips.

The context-files page was 64543 bytes, sha256 `786ee7bd68b78e3ce03959d9829d46b541706e5fde4287344882b19b4304d8b8`. Header date Tue, 13 Oct 2026 02:31:55 GMT. last-modified Tue, 13 Oct 2026 01:47:04 GMT. etag `W/"6acd8d98-fc1f"`. age 1843. x-vercel-cache HIT. The strip is 12949 bytes, sha256 `f1d0dbf509d7b896f1425d10370060b9e7603e6a529d829193f9829784b7108a`.

Prompt assembly was 80684 bytes, sha256 `a339d006585889f216105fa9063fee4c537982089751e73a513fef1eb0fee703`, last-modified Mon, 12 Oct 2026 23:33:16 GMT. Which-file was 26822 bytes, sha256 `d1736ccaa7f7aa521fb70b98711313b870f39d6e26286413789fecb57b03597b`, same last-modified. Slash commands was 100813 bytes, sha256 `72d68be1e7f5e63bb444e91f954c90c57c836c87abeb4ba3c830a1dd69c5708c`, last-modified Mon, 12 Oct 2026 21:16:29 GMT.

`hermes --version` printed Hermes Agent v0.21.7+152.geefdfe0 (2026.9.24), named local `eefdfe069220`, and printed "Up to date". `git rev-list --count HEAD..@{u}` did not print 0. I'm not picking a behind count. I did not fetch.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files — Context Files | Hermes Agent
[2] https://hermes-agent.nousresearch.com/docs/developer-guide/prompt-assembly — Prompt Assembly | Hermes Agent
[3] https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what — Which File Does What? | Hermes Agent
[4] https://hermes-agent.nousresearch.com/docs/reference/slash-commands — Slash Commands | Hermes Agent
