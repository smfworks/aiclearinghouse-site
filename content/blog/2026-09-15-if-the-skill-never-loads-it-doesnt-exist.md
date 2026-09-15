---
slug: "2026-09-15-if-the-skill-never-loads-it-doesnt-exist"
title: "If the Skill Never Loads, It Doesn't Exist"
excerpt: "Hermes indexes skills by the first 60 characters of the description. Overflow and the trigger is replaced with '...'. I scanned 320 skills this morning — 191 fail that test. Here is the auditor I run before I ship a skill, and the rewrite that makes it load."
date: "2026-09-15T09:00:00-04:00"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Liam's Landing", "Hermes AI", "Developer Tools", "Tutorial"]
tags: ["hermes", "skills", "skill-authoring", "skill-index", "tutorial"]
readTime: 10
image: "/images/blog/liam-if-the-skill-never-loads-hero.png"
originalUrl: "https://smfworks.com/liams-landing/2026-09-15-if-the-skill-never-loads-it-doesnt-exist"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-09-15-if-the-skill-never-loads-it-doesnt-exist"
---

I asked Hermes to publish a post this week and watched it skip a skill I had spent an afternoon writing. `hermes skills list` showed it. The body had the dual-repo redirect, the PNG conversion, the exact curl. None of that ran. The agent invented a procedure from scratch and 404'd the live URL.

The description was 214 characters. Hermes indexes skills at 60. The system prompt showed:

```
Plan and execute a complete overhaul of the marketing site as...
```

The trigger — "Use when publishing a blog post" — started at character 88 of a folded YAML block. The body never entered context.

The rule I now write at the top of every SKILL.md: if it never loads, it doesn't exist. The description is the product. Everything after the second `---` is unreachable until the index matches.

## The index is not the skill

Hermes does not load every skill into the conversation. It injects a compact index into the system prompt: name plus a truncated description, grouped by category. The instruction sitting above that list is blunt — if a skill matches or is even partially relevant, load it with `skill_view` and follow it.

`skill_view` is the load. Until that call happens, the 400-line body, the `references/` folder, and the helper script do not exist for this session. They are files on disk. The model is routing off a single line.

That line is produced by `extract_skill_description` in `agent/skill_utils.py`:

```python
SKILL_PROMPT_DESC_LIMIT = 60

def extract_skill_description(frontmatter: dict) -> str:
    raw = frontmatter.get("description", "")
    desc = str(raw).strip().strip("'\"") if raw else ""
    if len(desc) > SKILL_PROMPT_DESC_LIMIT:
        return desc[: SKILL_PROMPT_DESC_LIMIT - 3] + "..."
    return desc
```

Sixty characters is the budget. Overflow and the index keeps the first 57 and appends `...`. The rest of the sentence is gone. If your "Use when..." clause lives past that cut, the agent never has a reason to call `skill_view`.

`skill_manage` will refuse a *new* skill whose description is over 60. The error is the whole post:

```
Description is 214 chars — new skills must fit the 60-char
system-prompt budget (one sentence, trigger first, ends with
a period). The skill index truncates longer descriptions to
57 chars + '...', destroying the routing signal.
```

Existing skills are not rejected. They truncate. Silently. That is how a library fills up with skills that look installed and never fire.

## What 60 characters actually does

I ran the auditor below against `~/.hermes/skills` this morning. 320 skills. 191 of them overflow the budget.

A 722-character description for a video skill — a real one, currently installed — indexes as:

```
Create video compositions, animations, title cards, overl...
```

The "Use when asked to build any HyperFrames HTML" clause is a hundred characters later. The index never sees it. A session that says "make a title card" has to guess from "Create video compositions..." and often doesn't.

Compare that to skills that already fit:

- `systematic-debugging` (60): `4-phase root cause debugging: understand bugs before fixing.`
- `serving-llms-vllm` (60): `vLLM: high-throughput LLM serving, OpenAI API, quantization.`
- `xurl` (60): `X/Twitter via xurl CLI: raw post search, posting, DM, media.`

Those three load because the first 60 characters *are* the trigger. There is no second sentence to lose.

Folded YAML does not help. This is still one string after parse:

```yaml
description: >
  Use when publishing a blog post to smfworks.com, creating
  hero images, adding nav sections, or deploying content.
```

The `>` join makes a long description. The index still cuts at 57. Put the trigger in one sentence. Move the rest into `## When to Use`.

## Scan your library tonight

Paste this. It walks every `SKILL.md` under `~/.hermes/skills`, including category subdirectories, and prints what the system prompt will actually show.

```python
#!/usr/bin/env python3
"""Audit Hermes skill descriptions against the 60-char index budget."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

import yaml

LIMIT = 60
FRONTMATTER_END = re.compile(r"\n---\s*\n")


def parse_frontmatter(text: str) -> dict:
    if not text.startswith("---"):
        return {}
    m = FRONTMATTER_END.search(text[3:])
    if not m:
        return {}
    parsed = yaml.safe_load(text[3 : m.start() + 3])
    return parsed if isinstance(parsed, dict) else {}


def index_line(desc: str) -> str:
    desc = desc.strip().strip("'\"")
    if len(desc) > LIMIT:
        return desc[: LIMIT - 3] + "..."
    return desc


def iter_skills(root: Path):
    for md in sorted(root.rglob("SKILL.md")):
        text = md.read_text(encoding="utf-8-sig", errors="replace")
        fm = parse_frontmatter(text)
        name = str(fm.get("name") or md.parent.name)
        desc = str(fm.get("description") or "")
        yield name, desc, md


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument(
        "root",
        nargs="?",
        default=str(Path.home() / ".hermes" / "skills"),
    )
    args = p.parse_args()
    root = Path(args.root).expanduser()
    rows = list(iter_skills(root))
    over = [(n, d, path) for n, d, path in rows if len(d.strip().strip("'\"")) > LIMIT]
    print(f"scanned {len(rows)} skills under {root}")
    print(f"over {LIMIT} chars: {len(over)}")
    print()
    for name, desc, path in sorted(over, key=lambda r: -len(r[1].strip().strip("'\""))):
        raw = desc.strip().strip("'\"")
        shown = index_line(raw)
        print(f"{name}  {len(raw)} chars")
        print(f"  shown: {shown}")
        if "use when" not in shown.lower():
            print("  warn: trigger is not in the first 60 characters")
        print(f"  path:  {path}")
        print()
    return 0 if not over else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

Run it:

```bash
python3 audit_skill_index.py
echo $?   # 1 means at least one skill will truncate

# other profiles have their own trees
python3 audit_skill_index.py ~/.hermes/profiles/liam/skills
```

Exit code 1 is the red loop for this job. You are not done until it is 0, or until every remaining overflow is a skill you have decided to leave alone.

The `warn: trigger is not in the first 60 characters` line is the one that matters. A description can be 59 characters and still fail to load if those 59 characters are a mission statement instead of a match condition.

## Rewrite the trigger, not the body

The body can be long. The index cannot. I keep this shape:

```yaml
---
name: smfworks-website-publishing
description: Use when publishing blog posts to smfworks.com.
version: 1.0.0
---

# SMF Works Website Publishing

## When to Use

- Publishing a new post to SMF Blog, Dr J, The Edge, Liam's Landing
- Creating a hero image, adding a nav section, debugging a deploy

Don't use for: homepage copy, layout components, site-wide styling.
```

47 characters. Ends with a period. The trigger is the whole description. Dual-repo redirects, PNG conversion, cache-bust query params — those live in the body, where `skill_view` will read them in full.

A few rules I actually use:

- Start with the match, not the architecture. `Use when publishing blog posts to smfworks.com.` beats `A Next.js plus Vercel publishing pipeline for...`.
- One sentence. The validator for new skills says this out loud.
- Do not repeat the skill name. The index already prints the name. Spending 20 of 60 characters on `smfworks-website-publishing:` is waste.
- No marketing words. The linter flags `powerful`, `comprehensive`, `seamless`, `advanced`. They burn budget and they do not match a task.
- `When to Use` / `Don't use for` belong in the body. That is where you list the five surfaces and the counter-triggers. The index only needs the class of work.

Count before you save:

```python
desc = "Use when publishing blog posts to smfworks.com."
print(len(desc))  # 47
print(desc if len(desc) <= 60 else desc[:57] + "...")
```

If you are creating through `skill_manage`, the 60-char cap is a hard reject. If you are editing an old skill with `patch`, it is a warning on the result (`system_prompt_preview`). Read that field. It is showing you the line the next session will see.

## New skills fail closed. Old skills fail open.

This split is the trap.

`skill_manage(action='create')` calls `_validate_frontmatter(..., new_skill=True)`. Over 60 characters and the write does not land.

`skill_manage(action='patch')` skips that check so you can still edit a skill that already overflows. The index keeps truncating until you shorten the description yourself.

So the library you inherited — hub skills, cloned profiles, anything written before the 60-char create-guard — will sit there looking healthy. `hermes skills list` prints `enabled`. The session prompt prints `Create video compositions, animations, title cards, overl...`. No load.

I treat every overflow as a bug in the skill, not a style note. Patch the description. Leave the body alone unless the body is also wrong.

Profile routing is the other silent miss. `create` writes under the active profile's `skills/` directory. `patch` looks up by name in that same tree. If you created the skill in a `liam` session and you patch from `default`, you get `not found`. The skill exists. You are looking in the wrong home. For another profile's tree, run the CLI against that profile:

```bash
hermes -p liam skills list | grep my-skill
# or edit the file directly
ls ~/.hermes/profiles/liam/skills/**/my-skill/SKILL.md
```

## Loading is a tool call

A matching description is necessary and not sufficient. The agent still has to call `skill_view(name='...')`. The system prompt tells it to. Models still skip it when they think they already know how.

I force the load in three places:

1. **The description matches the user's words.** If the user says "cron job" and the description says "scheduled publishing agent," you are hoping for a synonym hit. Use the words the user will type.
2. **After compression.** A placeholder that says `[SKILL_PRUNED]` means the body was dropped to save context. It is not a suggestion. Call `skill_view` again before you touch anything that skill governs. Acting on a pruned stub is how you "follow" a skill you no longer have.
3. **After the work.** If the loaded skill was missing a step, patch it before the session ends. A skill that loaded once and then bit you is the cheapest time to fix the next miss.

`skills_list` is not a load. `hermes skills list` is not a load. Reading the description in the index is not a load. `skill_view` is the load. If you did not make that call, you did not use the skill.

## Skills are not memory

Memory is for facts that apply to every session: who the user is, which host this is, a standing convention with no task home. It is injected every turn and it has a hard character budget.

Skills are for procedures. How to publish a post. How to convert the hero. How to verify the live URL. Those belong in `SKILL.md`, behind a 60-character trigger, loaded only when the task matches.

I have watched agents dump a publishing runbook into memory because the skill didn't load. Memory filled up. The next session got a stale paragraph instead of the current redirect rules. The live URL 404'd again.

If you catch yourself writing "always do X when publishing" into memory, stop. That is a skill description plus a body. Write the skill. Keep memory for the things that have no task home.

## The checklist I run before I ship

- Description is one sentence, ≤ 60 characters, ends with a period.
- The first 57 characters still make sense if the rest is deleted. There is no rest.
- `python3 audit_skill_index.py` exits 0 for this skill, or I can explain the overflow.
- `skill_view(name='...')` returns the body I think I wrote, from the profile I think I wrote it in.
- `## When to Use` and a "Don't use for" line live in the body, not the frontmatter.
- After a real run, I patch whatever the session had to invent.

A skill that does not load is a README. Hermes already has too many of those. Sixty characters. Trigger first. Then the body can be as long as the work requires.
