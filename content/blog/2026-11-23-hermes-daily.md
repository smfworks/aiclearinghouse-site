---
slug: "2026-11-23-hermes-daily"
title: "The Guardrail Sprint: How Hermes Agent Turned Its Release Pipeline Into a Fortress"
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
date: "2026-11-23"
excerpt: "A week of commits shows Hermes Agent hardening its own release pipeline: staging guards, secret-free build steps, and a community review loop catching flaws before they ship. Here is what changed and how to check your own install."
categories: ["AI", "Open Source", "Security"]
tags: ["hermes-agent", "nous-research", "supply-chain", "release-engineering", "security"]
readTime: 9
image: "/images/blog/2026-11-23-hermes-daily.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-23-hermes-daily"
---

**By Pamela Flannery, SMF Works**

![Hero: labeled data-viz of the Hermes Agent release pipeline, with the secret-split staging step highlighted](/images/blog/2026-11-23-hermes-daily.svg)

When you install software, you are trusting the machine that built it, not just the code in it. That is the quiet idea behind one of the busiest stretches in the Hermes Agent repo this week: a run of commits, logged November 21–23, that hardened the release pipeline itself — the machinery that turns source code into the DMG, MSIX, and APK packages you download.

The work is technical, but the story is simple. The Hermes team looked at every step where a package gets staged, recorded, and uploaded, and asked: what could sneak in here? Then they closed each gap, most of them flagged by an automated code-review loop the project calls the Sol review loop.

## Why the release pipeline matters at all

Hermes Agent is the open-source agent framework from [Nous Research](https://github.com/NousResearch/hermes-agent): a terminal-native autonomous coding and task agent with persistent memory, agent-created skills, and a messaging gateway. Same agent core across CLI, TUI, desktop app, web dashboard, and messaging platforms, provider-agnostic, and MIT-licensed. The project ships releases frequently — the latest tagged release, [v0.23.3, landed November 20](https://github.com/NousResearch/hermes-agent/releases), with canary builds following daily — so the pipeline runs constantly. Any hole in it would ship to everyone, fast.

That is also why the recent commits read like a checklist written by someone who has been burned before. Package staging scripts are exactly the kind of place where a symlink, a hidden file, or a second package with a similar name can slip past a shell glob.

## What actually changed

Reading the [recent commit log](https://github.com/NousResearch/hermes-agent/commits/main) from this weekend, four themes repeat:

**1. Stage only what was built.** One fix found that a stager would stage *any* `.msix`, `.dmg`, or `.blockmap` file in an artifact — including a Store package or another architecture's MSIX that the recorder never reads. The guards now admit only the exact packages each recorder reads, for each architecture. Nothing extra gets through.

**2. Refuse the sneaky stuff.** A stager's guard counted packages with Bash globs, which silently skip filenames starting with a dot, while another selection step used a path glob that *matches* them. A hidden second DMG could pass the check and get staged. Now every stager's guard refuses any entry whose name starts with a dot, so the guard and the upload see the same files. A related fix requires the Termux deb directory to be a real directory — no symlinks.

**3. Keep secrets away from untrusted input.** The most interesting fix is an architectural one. Each fresh release job used to unzip an unreviewed build's packages in the same step that held the R2 storage credentials. No exploit is known, but the team narrowed it anyway: now the unzip and record step runs with *no secrets at all*, and only a recorded, verified directory passes to a second step that holds the credentials. Defense in depth — assume the extractor has a bug, and make sure it cannot touch the keys when it does.

**4. Fail loudly, not weirdly.** Smaller fixes make the pipeline refuse malformed build-commit inputs with a clear error instead of a confusing one downstream, and admit only each macOS package's *own* blockmap files.

## The review loop that caught them

Here's the detail I find most interesting: a large share of these fixes end with the line "Found by the Sol review loop." That's an automated review process inside the project that examines changes and reports what it finds — and the findings are real enough that they turned into a multi-day security sprint. One contributor, BearHuddleston, also reviewed and confirmed several follow-up suggestions that became their own commits.

It's a nice demonstration of something we keep coming back to at the Clearinghouse: an agent project that eats its own cooking. The same pattern — machine review, human confirmation, pinned commit — is how Hermes itself builds [skills as reusable procedures](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), and how its [memory system](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) separates agent notes from user profile. The release team is running the same loop on the release code.

## What this means for you

| Question | Answer |
|---|---|
| Do I need to do anything? | Update if you're on an older release: `hermes update`. The latest tagged release is v0.23.3 (Nov 20). |
| Was there a known exploit? | No — these are hardening fixes. The commit messages say "no escape is known" for the credential one. |
| Does this affect all platforms? | Yes — Windows, macOS, and Termux stagers all got guards. |
| Where's the full detail? | The [commit log](https://github.com/NousResearch/hermes-agent/commits/main) and the [v0.23.3 release notes](https://github.com/NousResearch/hermes-agent/releases). |

If you run Hermes on a machine that matters, do the ordinary things that matter more after a hardening sprint: update to the current release, let `hermes doctor` check your environment (it flags known-compromised Python packages per the [security docs](https://hermes-agent.nousresearch.com/docs/user-guide/security)), and keep secrets in `.env` rather than config.

One more practical note: the security docs also cover the project's supply-chain advisory checking — Hermes ships a scanner that flags packages in your active venv matching known-compromised versions, shown at startup and in `hermes doctor`. That is the same threat model the release-pipeline work defends against, applied to your machine.

## The outlook

Projects show what they value in where they spend unglamorous effort. Nobody demos a release stager. But a project that spends a weekend making its build machines refuse symlinks and hidden files is a project that expects to be around in five years — and expects you to still trust what it ships. The Sol review loop turning its findings into merged fixes within days is the healthiest signal of all: the loop closes.

For Hermes Agent, the pattern is consistent: fast shipping, plus an unusual willingness to harden the parts nobody sees. If you want to watch it yourself, the [commit log](https://github.com/NousResearch/hermes-agent/commits/main) is public — search for `fix(release)` and read the reasoning in each message. It's a masterclass in defensive engineering, written one merge at a time.
