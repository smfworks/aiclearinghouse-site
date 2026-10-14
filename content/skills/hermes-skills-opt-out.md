---
slug: hermes-skills-opt-out
title: Stop bundled Hermes skill seeding
category: Workflow
excerpt: "hermes skills opt-out writes a marker and stops future bundled-skill copies. It does not delete skills you edited. This is a docs command, not a hub install."
tags:
  - hermes
  - skills
  - profiles
  - cli
for: Hermes Agent
author: Nous Research
install: hermes skills opt-out
dependencies:
  - Hermes Agent
image: /images/skills/workflow.svg
source: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
order: 123
last_verified: "2026-10-14"
---

# Stop bundled Hermes skill seeding

## What it is

This is not a skill you install from the hub. It is the documented way to keep a Hermes profile from receiving bundled skills on later updates.

The Skills System page says every profile is seeded with the bundled catalog by default, and each `hermes update` adds newly bundled skills. If you want a profile with no bundled skills, and you want that to stay true across updates, you write a `.no-bundled-skills` marker. `hermes skills opt-out` does that. While the marker is present, the installer, `hermes update`, and skill sync skip bundled-skill seeding for that profile.

Do not run `hermes skill install hermes-skills-opt-out`. That name is this directory's slug. It is not a hub identifier.

## Who it targets

People who already have a Hermes profile and do not want the next update to drop a fresh copy of the bundled catalog on top of a blank or custom set. Also people creating a named profile who want it empty from the start.

## What it does

- `hermes skills opt-out` stops future seeding. The docs say it never deletes anything already on disk.
- `hermes skills opt-out --remove` also deletes bundled skills, only when they are unmodified, byte-identical to the version Hermes installed. It confirms first. Edited skills, hub installs, and skills you wrote are kept.
- `hermes skills opt-in --sync` removes the marker and re-seeds now.
- `hermes profile create research --no-skills` writes the same kind of marker at profile-create time. The example name `research` is the docs' example, not a required name.
- The installer has no `--no-skills` flag. Blank Slate setup can decline seeding. A non-interactive install still seeds, so the docs say to run `hermes skills opt-out` afterwards if that profile should stay empty.

## Dependencies

Hermes Agent, current enough that these subcommands exist. This entry did not run them.

## How to install

There is nothing to install. From the docs, on an already-installed profile:

```bash
hermes skills opt-out
```

If you also want unmodified bundled copies removed:

```bash
hermes skills opt-out --remove
```

To undo:

```bash
hermes skills opt-in --sync
```

If you are installing a real skill, use a source-qualified id. The same page's example is `hermes skills install official/security/1password`. A bare name is what the docs tell the website to avoid. Bundled skills use an explicit repository path. If an older snapshot lacks that path, the page says the website omits the install link rather than guessing.

## Limitations

- Opt-out does not uninstall the agent, wipe memory, or touch skills you edited.
- `--remove` confirms first. Do not wrap it in a script that cannot answer the prompt unless you have read what the current CLI does with a non-interactive confirm. This page does not document a `--yes` flag.
- The marker is per profile directory. Opting out the default profile does not opt out a named one.
- Desktop's Install button and `hermes://skill/install?identifier=official%2Fsecurity%2F1password` are a different path. They still scan. A link cannot bypass scanning or pick a different profile if you switched mid-confirm. Reopen the link.
- Commands above are copied from the docs page fetched this run. They were not executed for this entry.

## Sources

- Skills System: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
