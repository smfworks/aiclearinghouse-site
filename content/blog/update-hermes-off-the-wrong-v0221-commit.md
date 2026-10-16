---
slug: "update-hermes-off-the-wrong-v0221-commit"
title: "How to move a Hermes source install off the wrong v0.22.1 commit"
excerpt: "Match the SHA to the two tags, then use hermes update. Do not merge v0.22.2 into main. Sessions that ran under the 0.22.1 gateway cannot be deleted after the move."
date: "2026-10-16"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Linux", "Open Source", "Agents"]
tags: ["hermes", "hermes-update", "v0.22.2", "git"]
readTime: 17
image: "/images/blog/update-hermes-off-the-wrong-v0221-commit-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/update-hermes-off-the-wrong-v0221-commit"
---

You can move a Hermes git install off the commit v0.22.1 was built from, and you can do it without merging that fix into `main`. Check the SHA first. If it is `297552a9d646`, the release that replaces it is v0.22.2 at `d923a5eb487a`. The command the release names for a CLI or installer-script install is `hermes update`, or a re-run of the installer one-liner. After that move, sessions that ran under the 0.22.1 gateway cannot be deleted. The release names no workaround. I matched the tags on 16 October 2026. I did not run the update.

An earlier post, [How to read the Hermes update channel before you run the update](/blog/read-the-hermes-channel-before-you-update), is the channel question. This one is the bad cut. A stable channel does not mean the tag you are on was built from the branch the release script wanted.

## Match the version line to a tag before you change anything

Run this in the install the version line names, not in some other clone:

```bash
hermes --version
git rev-parse HEAD
git rev-parse 'v0.22.1^{}'
git rev-parse 'v0.22.2^{}'
```

If the tags are not local yet, fetch them and then resolve them. A tag name by itself is not the commit. The `^{}` peels the tag to the commit it points at.

On 16 October 2026, `hermes --version` on the git install I checked printed `Hermes Agent v0.22.1 (2026.9.24) · stable · local 297552a9d646`, install method `git`, Python `3.14.7`, and `Update available — run 'hermes update'`. `git status -sb` printed `## HEAD (no branch)`. `git rev-parse --short=12 HEAD` printed `297552a9d646`. That short SHA is the start of the v0.22.1 tag commit. It is not v0.22.2.

The GitHub release API agrees with those tag commits. [v0.22.1](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.1) is not a prerelease. It was published `2026-10-14T23:59:24Z`. Its `target_commitish` is `297552a9d646119871391d202509822cd86330df`. [v0.22.2](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.2) is not a prerelease. It was published `2026-10-15T08:21:32Z`. Its `target_commitish` is `d923a5eb487a17c0a68801bba9ef0f56c81040a8`. A request for the latest release the same morning still returned v0.22.2, so `hermes update` on the stable channel, as the docs describe it, would be aiming at that tag. I did not ask the updater to move.

The [v0.22.1 page](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.1) calls itself a patch release. It does not say the build came from the wrong commit. That sentence is on the [v0.22.2 page](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.2): v0.22.1 was built from the wrong commit, it shipped unreleased gateway work, and the Microsoft Store app could stick on "Connecting." The same page says 0.22.2 is the release 0.22.1 was meant to be.

The tag commit says the same thing more specifically. `git log -1` on `v0.22.2^{}` printed this subject and body:

```text
Release 0.22.2 from release/0.22.1 with the published v0.22.1 as a parent
v0.22.1 was built from main (297552a9d6) instead of release/0.22.1. This
merge keeps the release/0.22.1 tree exactly as it is and records v0.22.1 as
a parent, so the release script's ancestry check accepts the cut.

Never merge this branch into main. Git would read it as reverting every
change main made after 297552a9d6.
```

That commit is [`d923a5eb487a`](https://github.com/NousResearch/hermes-agent/commit/d923a5eb487a17c0a68801bba9ef0f56c81040a8). Read it. The release page is the user-facing warning. The commit message is the instruction to git.

## Do not merge the fix into main

If your checkout is on `main` and you want the reboot fix, do not `git merge v0.22.2`. The tag commit says never merge that branch into `main`. Git would read it as reverting every change `main` made after `297552a9d6`.

Use the updater, or check out the release commit on purpose. Those are different moves. A merge records the bad cut as something `main` has to absorb. A checkout of the tag puts that install on the release line the docs already describe.

I also checked ancestry, because the updating page cares about it. `git merge-base --is-ancestor v0.22.1^{} v0.22.2^{}` exited 0. The published v0.22.1 commit is a parent of the v0.22.2 commit, which is what the tag message says it recorded. That does not make a merge into `main` safe. The same message says the opposite.

The Full Changelog link on the v0.22.2 page is a bad place to stop. The link text says `v0.22.0...v0.22.2 (release line)`. The URL ends at [`4ccc58062c0d`](https://github.com/NousResearch/hermes-agent/commit/4ccc58062c0db3010520d7dfd49e869ef74a8e89), a merge of pull request [#138560](https://github.com/NousResearch/hermes-agent/pull/138560) from 14 October 2026. That commit is an ancestor of the tag. The tag is not an ancestor of that commit. `git log --oneline 4ccc58062c0d..v0.22.2^{}` printed 2048 lines. I did not read them. Do not treat that count as a feature list. The tag message says the merge keeps the `release/0.22.1` tree as it is and records v0.22.1 as a parent, so a lot of that range is history, not a pile of new patches you still have to apply by hand.

Confirm `d923a5eb487a17c0a68801bba9ef0f56c81040a8`. Do not confirm the compare URL and call it the release.

## Pick the command for the install you have

The [v0.22.2 Updating section](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.2) is three lines:

- CLI and installer-script desktop installs: `hermes update`, or re-run the installer one-liner. This moves installs that took v0.22.1 back onto the release line.
- Microsoft Store: updates through the Store.
- Docker / Hermes Cloud: `nousresearch/hermes-agent:stable` (or `:latest`).

The one-liner is not pasted on that page. The [README at the v0.22.2 tag](https://github.com/NousResearch/hermes-agent/blob/v0.22.2/README.md) shows it for Linux, macOS, and WSL2:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

A HEAD request to that `install.sh` URL on 16 October 2026 returned `HTTP/2 200` and `content-type: text/plain`. The [installation page](https://hermes-agent.nousresearch.com/docs/getting-started/installation) shows the same command for a service-user install. I did not run it.

The [updating page](https://hermes-agent.nousresearch.com/docs/getting-started/updating) is the decision table, and it is stricter than the three lines above. Match the row to the install that is running:

| Install | What that page says to use |
| --- | --- |
| Managed source checkout | `hermes update`, or the source-built desktop's update handoff |
| Windows sideload MSIX | The desktop Update control and Windows App Installer |
| Microsoft Store package | Microsoft Store updates |
| macOS bundled app | The desktop Update control, through `electron-updater` |
| Docker image | Pull the chosen image and recreate the container with the same data mount |
| Nix | Update the flake or profile and rebuild |
| Termux APT | `pkg update`, then `pkg upgrade hermes-agent` |

`hermes pm update` is not the application updater. The same page says PM manages dependencies, not application distribution, and that `hermes update` does not rewrite package-owned application files. If the install is a Store package, an MSIX, a Nix profile, or a Termux APT package, `hermes update` is the wrong tool even when the version line says an update is available.

For a managed source checkout of the official repository, the page says the stable channel is the latest published `vX.Y.Z` GitHub release, never a draft, prerelease, or canary, checked out at its exact commit. `hermes update` and the Desktop update button move from one release to the next, not commit by commit. Forks and mirrors keep tracking their `main` branch.

That last sentence matters if your remote is not `NousResearch/hermes-agent`. The release page is talking about the official repo. A fork does not pick up v0.22.2 just because you type `hermes update`, unless that fork's `main` already has the commit and you are following `main`.

## Read the channel before you trust a rerun

The updating page stores the choice per install under `update.installs` in `config.yaml`. An install that never chose a channel only moves forward. A checkout already newer than the latest release stays where it is until a newer release ships. `hermes update --set-channel stable` pins the checkout to the exact release commit even when that commit is older. The Desktop names that move as a rollback. `hermes update --check` then says the checkout is newer, instead of announcing a new update.

The installers named on that page are `install.sh`, `install.ps1`, and Hermes-Setup. A new install goes to the latest stable release. Re-running one over an install that never chose a channel moves it onto that release only when the release descends from its checkout. Any other checkout stays where it is, and `hermes update` decides the move. The page says it refuses a release that predates the session stores the checkout already uses. Over an install that chose a channel other than `main`, a rerun keeps the checkout where it is. Only `hermes update` moves it.

So the release page and the docs page are not copies of each other. The release says the one-liner moves installs that took v0.22.1 back onto the release line. The docs add the conditions: no saved channel other than the default forward-only behavior, and the release has to descend from the checkout. On the tags I fetched, that descent holds. `v0.22.1^{}` is an ancestor of `v0.22.2^{}`. If your checkout is that tag commit and you never saved a channel, both pages are pointing the same way. If you saved `main`, or you are already past `d923a5eb`, a rerun of the installer is not the move. Read the output. Do not assume the one-liner did the cut because it exited 0.

Useful flags from that same page, if you need a different move than the default:

```bash
hermes update --check
hermes update --set-channel stable
hermes update --set-channel main
hermes update --channel main
hermes update --no-gateway-restart
```

`--set-channel` saves the choice. `--channel main` is one run and saves nothing. `--no-gateway-restart` stops nothing, and you manage the gateways yourself. I did not run any of these.

If passive notices are off, the banner can be quiet and the update can still exist. The page says `hermes config set updates.check false` suppresses cached notices and passive update-check requests. Explicit `hermes update --check` and `hermes update` still work. The default is `true`. That setting does not control the Desktop updater.

One-off commit bundles do not update at all. The page says they explain: "This build doesn't get updates. Ask the developer who gave it to you for a new build." A red icon and a `hermes-<short-sha>` command are the tell. `hermes update` will not move that build onto v0.22.2.

## What the updater will pause

On a source checkout the updater admits, the page lists the phases. You do not have to memorize them. You do have to expect the pause.

It saves a pre-update snapshot of selected state files for every profile, including pairing data, cron jobs, `config.yaml`, `.env`, and `auth.json`. Quick snapshots skip a file larger than 1 GiB. `updates.pre_update_backup` selects `quick`, `full`, or `off`. If the snapshot fails, the update prints `⚠ Pre-update snapshot FAILED` and continues. A quick snapshot recovers state files, not application code.

Then it changes the checkout. On Linux and macOS it pauses every gateway running from that install immediately before the first change. An update with nothing to apply, or one that fails before it changes the checkout, stops nothing. The pause lines it prints are `⏸ Paused for the update: hermes-gateway.service` and `▶ Restarted paused gateway(s): …`. systemd and launchd units are stopped and started through the service manager, so the supervisor cannot restart them on the old code in the middle. A gateway you started by hand is drained and started again in the background. Its output goes to `logs/gateway-update-resume.log` in that Hermes home, not to your terminal.

Bots are offline for that window. The page says it is typically the git update plus the dependency sync, and that the gateways come back before the web UI, TUI, and Desktop builds, which can take minutes. A prompt asked while the gateways are paused takes its default immediately, because no gateway can relay it.

If the update is killed, the next `hermes` command, or another `hermes update`, starts exactly the paused set again. A failed update that never changed the checkout restarts them on the old code. A gateway the updater cannot stop through its supervisor is left running and refreshed after the update. The pause never blocks the update. If it cannot list, record, or stop the gateways, it restarts anything it stopped, says so, and continues.

After the pull, it compiles nine critical files. If one fails to parse, it rolls the checkout back so the shell stays bootable, including `git reset --hard` to the pre-pull commit, or a checkout back to the detached commit or parked branch it left. Then you re-run `hermes update` once the upstream fix lands. That rollback is for a broken pull. It is not a way to undo the session-delete limit after you have already started the new gateway. The page does not say the rollback restores a session the new version cannot delete.

A plugin that no longer fits is disabled in every profile that enables it, with a warning, and the update continues. A core that cannot build fails the step. Config migration prompts for new options. If you skipped that prompt, `hermes config check` shows missing options and `hermes config migrate` adds them.

I am not walking the Desktop rebuild rules here. They are on that page, and they are a different install. The git install I checked is not a Store package.

## Sessions you will not be able to delete

The v0.22.2 page puts this in a callout: sessions that ran under the 0.22.1 gateway can't be deleted in 0.22.2.

That is the whole known issue. The page does not name a command, a session id format, a workaround, or a GitHub issue number. A search for that sentence on 16 October 2026 returned mirrors of the same sentence. It did not return a fix. Do not "just try a delete" to see what happens if you still need those sessions. I did not try one, and I am not going to invent a recovery path the release does not give.

If you have sessions from a gateway that was running the v0.22.1 build, and you may need to delete them, decide that before you update. The release does not say the sessions themselves are unreadable. It says they can't be deleted. Those are different claims. Do not stretch the first into the second.

The updating page has a separate warning that is easy to mix up with this one. Newer builds can change stored data that an older build cannot read. Back up shared data before you test two builds against one profile. That is the docs page, not the known issue. The known issue is specifically delete, after the move to 0.22.2, for sessions that ran under the 0.22.1 gateway.

## If a supervised gateway loops after a reboot

This is the other reason the release tells you to move. The highlight says the gateway starts after a reboot again. After a restart, Linux can hand an early PID to an unrelated process. The gateway could mistake that process for a running gateway, so a supervised gateway (systemd, launchd, Docker) refused to start. Hermes now records the boot it started in, and when it can't tell, it asks the host lock, which only a live gateway holds. The page points at pull request [#138594](https://github.com/NousResearch/hermes-agent/pull/138594), which it says fixes issue [#133744](https://github.com/NousResearch/hermes-agent/issues/133744).

The issue is still the place to recognize the symptom. It says a supervised `hermes gateway run` can crash-loop after a reboot. The old host record names a low PID and a small boot-relative start tick. Linux reuses that PID for an early-boot process. In the report, that process was `/usr/bin/mpris-proxy`. The start ticks were close enough that liveness looked proven, the control socket never answered, and the unit kept retrying. The message it quotes is:

```text
A gateway already owns this host and has not published its served set yet.
PID 1674 (launched by profile 'default'; serves: not published yet (its control socket has not answered))
Whether it will serve profile 'default' is unknown, so starting a second gateway
now could double-bind this profile's platforms. Nothing was started; this is a
transient state and a service supervisor will retry.
```

The issue says that unit exits 1. The pull request says a supervised `hermes gateway run` can exit 75 in a loop and never start. I am not going to collapse those into one exit code. They are two pages. If you are debugging a live loop, read the unit's own status instead of picking a number from this post.

The issue page was still open when I fetched it on 16 October 2026. `updated_at` was `2026-10-16T00:28:51Z`. `closed_at` was null. The pull request is merged. The release says the pull request fixes the issue. An open issue page is not a claim that the patch is missing from the tag. It is a claim that GitHub had not closed the issue when I looked. I did not reproduce the loop, and I did not re-run the pull request's verification table.

The same release highlight mentions long local-model turns on laptops, in pull request [#138560](https://github.com/NousResearch/hermes-agent/pull/138560). That is the commit the compare link stops on. The page says local requests stream, stall timers skip time the machine was asleep, a recovered local server gets another try, and compression no longer times out while the server is still reading a long conversation. I did not test that either. If that is the failure you are hitting, the release is pointing you at 0.22.2 for that reason too. It is not a second update command.

## If you are not on 0.22 yet, read the cutover first

v0.22.2 is a patch on a bad 0.22.1 cut. It is not the whole 0.22 upgrade. If `hermes --version` is still on 0.21, read the [v0.22.0 upgrade notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.0) before you treat this as a small hop. That page says Python 3.14 is the runtime for managed installs, the package manager installs it, and KittenTTS is unavailable on 3.14. It says one gateway per machine is the default, and `hermes update` folds per-profile gateways into the multiplexed default when nothing conflicts. It says idle and daily `session_reset` modes are retired. It says `sessions.auto_prune` defaults to on: ended sessions inactive for 90 days are deleted at startup, pinned and open sessions are never touched, and `sessions.auto_prune: false` keeps everything.

The updating page describes the same gateway cutover in more operational detail, including that work interrupted by the cutover restart is never replayed. Read that section if this will be your first update into 0.22. I am not repeating it as if I had run the cutover.

Python on the version line is not proof of the tag. The line I checked already said Python `3.14.7` while the SHA was still `297552a9d646`. You can be on the 0.22 runtime and still be on the wrong commit.

## After the command, match the SHA again

When you do run it, the check is the same pair of commands:

```bash
hermes --version
git rev-parse HEAD
git rev-parse 'v0.22.2^{}'
```

You want the version line to name v0.22.2, and `HEAD` to equal `d923a5eb487a17c0a68801bba9ef0f56c81040a8`. "Update available" going away is not enough if the SHA is still `297552a9d646`. A successful installer exit is not enough if you had saved a non-`main` channel and the docs say a rerun keeps that checkout put.

I cannot paste a post-update version line. I did not run `hermes update`, and I did not re-run the installer. The checkout I checked was still detached at the v0.22.1 commit when I stopped.

If the supervised gateway was crash-looping, the release says 0.22.2 is the build where that start path was corrected. Confirm the SHA first. Then look at the unit. An open GitHub issue is not a substitute for the tag you actually checked out.
