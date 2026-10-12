---
slug: "read-the-hermes-channel-before-you-update"
title: "How to read the Hermes update channel before you run the update"
excerpt: "The version line names a behind-count and tells you to run hermes update. That count is not the channel. Read the saved record, the default in the code that is running, and the default in the commit the tag actually points at."
date: "2026-10-12"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Linux", "Open Source", "Agents"]
tags: ["hermes", "hermes-update", "update-channel", "git"]
readTime: 15
image: "/images/blog/read-the-hermes-channel-before-you-update-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/read-the-hermes-channel-before-you-update"
---

You can read which update channel a Hermes source install will follow, and you can save a different one, before you obey the version line. That line gives you a count and then says to run `hermes update`. The count is not the channel. A bare update uses the default in the code you are already running, unless `update.installs` in config already names a channel.

At 05:02 Eastern on 12 October 2026, `hermes --version` on this git install printed Hermes Agent v0.21.6+349.g3637c51 (2026.9.24), named upstream `835c3dd0`, and said `Update available: 425 commits behind — run 'hermes update'`. `git status -sb` printed `main...origin/main [behind 425]`. `git rev-parse HEAD` was `3637c512fc3211bdccb61b7140d09ac1018508ba`. `git rev-parse origin/main` was `835c3dd038d903182a66ecc45e34bf5e0de65f00`. The two tools agree about the branch tip. They do not tell you which commit the next update will check out.

A note from 9 October is a different hold: [the v0.21.6 tag and the desktop package](https://www.smfclearinghouse.com/blog/the-tag-does-not-move-the-desktop-app). This one is the channel. I did not run `hermes update`.

## Read the saved record first

When someone has chosen a channel, it is stored per install, not as a home-wide switch. The module at the commit the published tag points at documents the shape as `update.installs.<sha16>`, with a `path` and a `channel`. The same file says a home-global `update.channel` key does not exist, because one config can serve more than one install. You can read that header in [`update_channel.py` at `71d34bad`](https://github.com/NousResearch/hermes-agent/blob/71d34bad1045610252eda02ee79549436896e784/hermes_cli/update_channel.py).

That key is not `updates`. On this install I searched `config.yaml` for `update`, `channel`, and `installs`. The only hits were this block:

```yaml
updates:
  pre_update_backup: false
  backup_keep: 5
  non_interactive_local_changes: stash
```

There is no `update:` key and no `update.installs` record. No channel has been saved here. The [updating page](https://hermes-agent.nousresearch.com/docs/getting-started/updating) says the choice lives under `update.installs`. An empty result means you are on the default. The default is whichever copy of `default_channel` you are about to run, and those copies do not agree.

Do not hand-edit a sha into the file. The module says `hermes update --set-channel` writes the id. You never type it.

## Read the default in the code that is running

The version line was printed by `3637c512`, not by the tag. In that checkout, `default_channel` is documented as the channel an unconfigured install tracks, and the next sentence says self source installs follow main, which it calls historical behavior. When the install is not a package, the function returns `CHANNEL_MAIN`. [That copy of the function](https://github.com/NousResearch/hermes-agent/blob/3637c512fc3211bdccb61b7140d09ac1018508ba/hermes_cli/update_channel.py) is what this process has on disk. I read it. I did not call it.

So the imperative on the version line is sitting next to a default of main. The 425 is the distance `git status` reported to `origin/main`. I am not claiming I stepped the updater and watched it check out that tip. I am claiming the code that printed the line still names main as the unconfigured source default.

If your version string says you are behind, run the same two commands before you do anything else:

```bash
hermes --version
git status -sb
git rev-parse HEAD
git rev-parse origin/main
```

Write down the short upstream token and the full `origin/main` sha. You will compare them to the tag in the next step. If they match each other and you stop there, you have read the branch. You have not read the channel.

## Resolve the tag before you treat a local tag as the destination

A local tag named `v0.21.7` can be an older cut of the same name. In this clone, `git rev-parse v0.21.7` printed `835c3dd038d903182a66ecc45e34bf5e0de65f00`. That is the same object as local `origin/main`. `git log -1` on it says the subject is `test(release): a failed Store job leaves the publish phase green; stable-publish still gates it`, dated 2026-10-11 17:28:32 -0700. I did not fetch. That ref is whatever this clone last stored.

About a minute after the version line, at 09:03:36 GMT, I requested the tag ref:

```bash
curl -sS -H 'Accept: application/vnd.github+json' \
  -H 'User-Agent: hermes-channel-check' \
  https://api.github.com/repos/NousResearch/hermes-agent/git/ref/tags/v0.21.7
```

The response was HTTP 200. The ref is `refs/tags/v0.21.7`. The object is `00f69310e29c24dfd7c6bb258b0a2337d3455d79`, and its type is `tag`, not `commit`. An annotated tag is a pointer to a pointer. Peel it:

```bash
curl -sS -H 'Accept: application/vnd.github+json' \
  -H 'User-Agent: hermes-channel-check' \
  https://api.github.com/repos/NousResearch/hermes-agent/git/tags/00f69310e29c24dfd7c6bb258b0a2337d3455d79
```

That object is named `v0.21.7`. The tagger is Hermes Release Automation, dated 2026-10-12T05:53:37Z. The inner object is commit `71d34bad1045610252eda02ee79549436896e784`. The message is a JSON receipt. The fields I used are `commit`, `releaseId` `410112828`, `version` `0.21.7`, and `claimTag` `rc.15-v0.21.7`. `git cat-file -t 71d34bad1045610252eda02ee79549436896e784` in this clone failed. The live tag commit is not here.

The release HTML page, opened in the same sitting, showed commit `835c3dd` and the words "released this 12 Oct 02:59". The [releases API](https://api.github.com/repos/NousResearch/hermes-agent/releases/tags/v0.21.7) for the same tag named `target_commitish` `71d34bad1045610252eda02ee79549436896e784`, `published_at` `2026-10-12T05:53:41Z`, `draft` false, `prerelease` false, author `teknium1`, and release id `410112828`. The API body does not contain an extra paragraph the HTML page showed about desktop bundles. I am not using that paragraph. When the page chip and the tag object disagree, use the tag object. The page is a view. The tag object is the pointer.

The commit the tag points at is [`71d34bad`](https://github.com/NousResearch/hermes-agent/commit/71d34bad1045610252eda02ee79549436896e784). Its subject is `fix(release): the builds-table render gets its R2 credentials and cannot block the release`. I am not reviewing that workflow change. The subject is enough to show it is not the object this clone calls `v0.21.7`.

If your local `git rev-parse v0.21.7` does not match the peeled tag object, you are looking at a stale tag. Do not aim an update at it.

## Read the default in that commit

I fetched `hermes_cli/update_channel.py` from `71d34bad` and read `default_channel`. The docstring says a source checkout of the official repository follows the latest published stable release. Forks, mirrors, and checkout-less trees keep following main. For a non-package install the return is `CHANNEL_STABLE` if `_tracks_official_origin` is true, otherwise `CHANNEL_MAIN`.

`_tracks_official_origin` reads `remote.origin.url` from the git config file. It does not spawn git. The pattern, in [`source_releases.py` at that commit](https://github.com/NousResearch/hermes-agent/blob/71d34bad1045610252eda02ee79549436896e784/hermes_cli/source_releases.py), accepts `https://github.com/`, `git@github.com:`, or `ssh://git@github.com/`, then an `owner/repo`, with an optional `.git`. The owner/repo has to equal `NousResearch/hermes-agent`. `git remote get-url origin` on this clone printed `https://github.com/NousResearch/hermes-agent.git`. That string matches the pattern. I did not execute the function. The source says that shape is the official repository, and an unconfigured official checkout then defaults to stable.

That is the opposite default from the code that printed the version line. If you update an official checkout that has no `update.installs` record, you are not only moving commits. You are leaving a default of main, in the code you are running, for a default of stable, in the code the tag contains. Read that before you run the command the version line names.

The [release body](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.7) says the same thing in prose. A source install of the official repository updates to the latest published `vX.Y.Z` instead of every commit on `main`. An install already newer than the latest release stays where it is and waits for the next one. Nothing is moved back. To keep following every commit, the body gives `hermes update --set-channel main`. Forks and mirrors keep following `main`. Store, MSIX, and bundled desktop installs are unchanged. I am quoting the API body. I did not recompute the release's window counts. The same body says full curated notes for this window ship with v0.22.0. Do not treat the patch summary as the changelog.

The tagged file also has `rides_default_channel`. It is true when no channel was persisted and the channel equals the default. The docstring says that install never consented to a release switch, so it only moves forward, and only `--set-channel` consents to a downgrade. This checkout is behind local `origin/main`, and the live tag commit is not in the clone, so the "already newer" sentence does not describe this install. It describes a checkout that has already passed the release. If that is you, leaving the record absent is the stay-put path. Writing `stable` is the consent.

## When the docs disagree, read the function

Two pages opened in this sitting do not say the same default.

The [updating page](https://hermes-agent.nousresearch.com/docs/getting-started/updating) says a source checkout of the official repository tracks the stable channel: the latest published `vX.Y.Z` GitHub release, never a draft, prerelease, or canary tag, checked out at its exact commit. `hermes update` and the desktop update button move from one release to the next, not commit by commit. Forks and mirrors keep tracking `main`. That matches the tagged function.

The [CLI reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands#hermes-update) still says `hermes update` pulls the configured update branch, default `main`. The synopsis on that page is `hermes update [--gateway] [--check] [--plan] [--no-backup] [--backup] [--yes]`. The flag table under it does include `--set-channel`. The default sentence and the flag table are both on the page. They are not the same claim. When a command index and the function in the tagged commit disagree, the function is what that commit will run. Do not let the shorter sentence pick the channel.

## Save the channel without applying the update

If you want main to survive the update, say so before you update. The CLI reference says `--set-channel` persists `main`, `stable`, or `canary` for this source installation without applying an update. Bundled applications have a fixed build channel and refuse the change.

The function that handles the flag is `handle_metadata_args`. I read it in this checkout and again in the file fetched from `71d34bad`. The docstring says it handles metadata-only commands before any update side effect. If `--set-channel` is set, it writes the record, prints `Update channel for <id>: <channel>`, prints a backup warning for canary or for stable, and returns true. In this checkout, `_update_preflight_handled` in [`main.py`](https://github.com/NousResearch/hermes-agent/blob/3637c512fc3211bdccb61b7140d09ac1018508ba/hermes_cli/main.py) calls that function and exits 0 when it returns true, before the managed-install refusal and before `--plan` and `--check`. I did not run the flag, so I am not reporting a printout.

The commands, from the updating page:

```bash
hermes update --set-channel main
hermes update --set-channel stable
```

Read the second one twice. The updating page also says running `--set-channel stable` pins the checkout to the exact release commit, even when that commit is older. That sentence is stronger than "persist and exit." The function I read returns before the update. I did not run it, so I cannot tell you the page's "pins the checkout" sentence is only about the next run. If you are ahead of the release and you do not want to move back, do not pass `--set-channel stable`. Leave the record absent, which is the forward-only path the release and `rides_default_channel` describe, or pass `--set-channel main` if you want every commit and you have finished the worktree check below.

Canary is a third name, not a middle setting. The same function prints: `Canary builds can write forward-incompatible state. Back up your data before switching.` For stable it prints: `Switching to an older stable release may not read state written by canary. Back up your data first.` The updating page says stable and canary desktop bundles are separate applications. Installing canary does not replace stable. The canary command is `hermes-canary`. Changing a bundled channel means installing the other application, not flipping a setting. I did not install either app.

`--channel`, without `--set-channel`, is one run. The updating page's note on `hermes update --channel main` is that nothing is saved. That command is still an update. Do not use it to look.

After a successful `--set-channel`, open config again and find `update.installs`. The id under it should match what `--install-id` prints. The argparse help in this checkout says `--install-id` prints the id and the path and exits. `handle_metadata_args` prints the id and returns true, and the caller exits 0. I did not run that flag either.

## Preview flags are not a saved channel

`hermes update --check`, on the updating page, compares the checkout with the selected channel's target without applying code, installing dependencies, or restarting gateways. The same paragraph says the comparison can fetch Git metadata. It is not a promise of zero filesystem writes. `--plan`, on that page and in the CLI table, prints the install kind, the running services, and the restart plan, then exits without changing anything. The table calls `--plan` read-only. I did not run either flag.

A failed check is not "already up to date." The updating page says that about a broken or unavailable Store check. Use the same rule for the CLI. If the command errors, you do not have a channel reading. You have an error.

## Look at the worktree before either command

`git status -sb` on this install showed a modified `cron/jobs.py`. `git diff --stat` was two insertions. The diff adds `from __future__ import annotations` and nothing else. I am not asking you to keep that edit. I am showing the check. Run `git status -sb` and `git diff` in the install the version line named. If the tree is dirty, decide what happens to the edit before you update.

The CLI reference says `hermes update` may check out the update branch before pulling, and that you should commit branch work first if you want it outside the autostash flow. The updating page says desktop updates invoke `hermes update --keep-stash`: local edits are stashed and not put back, and the log prints the `git stash apply` command. This install's config sets `updates.non_interactive_local_changes` to `stash`. I did not run the update, so that line is a recorded choice, not a result. If the edit matters, copy it out or commit it on a branch you are not about to switch. Then come back to the channel.

## Bundled apps do not use this flag

The updating page starts with an install-method table. Use it before you type a source command.

| What you are running | What updates it |
| --- | --- |
| Managed source checkout | `hermes update`, or the source-built desktop handoff |
| Windows sideload MSIX | Desktop Update control and App Installer |
| Microsoft Store package | The Store |
| macOS bundled app | Desktop Update control, through `electron-updater` |
| Docker image | Pull the image and recreate the container |
| Nix | Flake or profile rebuild |
| Termux APT | `pkg update`, then `pkg upgrade hermes-agent` |

The same page says `hermes update` does not rewrite package-owned files, and that `hermes pm update` is a maintainer pin command, not the application updater.

The release says the channel change is for source installs: `hermes update`, and the desktop updater on a git checkout. It also says Settings, then About, then Updates, has an Update channel switch, Stable releases or Every commit, for source installs, and that the update dialog shows which channel you are on. I did not open the desktop app. If the version line does not say the install method is git, do not expect the source flag to move a package. The `set_install_channel` function I read refuses when the stamp says the update mechanism is a bundle, an app installer, the Store, or an external steward.

One-off commit bundles, on the updating page, do not check for or install updates, including through `hermes update --check`. The page quotes the explanation those builds give: this build doesn't get updates. A red icon and a `hermes-<short-sha>` command are that case. No channel flag fixes it.

Separate applications still share profiles and sessions under one Hermes home. The updating page says that is not schema isolation. A newer build can write state an older build cannot read. Back up before you test a second build against the same home. I did not take that backup, because I did not switch builds.

## The order, once more

Read the version line, then `git status -sb`. Search config for `update.installs`, not `updates`. If the record is absent, read `default_channel` in the checkout that is running, peel the tag object, and read `default_channel` in that commit. If you want the old default to survive, persist `main` with `--set-channel` and stop. If you are already newer than the release and you want to wait, leave the record absent, but only after you have read `rides_default_channel`. Do not pass `--set-channel stable` if you are ahead and you do not want a pin. Do not run a bare `hermes update` until the worktree check is done.

I did not update this install. The version line is still asking. The channel record is still absent. That is a reading, not a ship.
