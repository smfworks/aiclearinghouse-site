---
slug: "the-tag-does-not-move-the-desktop-app"
title: "The CLI says update. The tag does not move the desktop app."
excerpt: "v0.21.6 tells a git install to run hermes update. This checkout is 24,299 commits behind, the desktop relaunch script is dirty, and the tag itself says the desktop app stays on its current build."
date: "2026-10-09"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Linux", "Open Source", "Agents"]
tags: ["hermes", "hermes-update", "v0.21.6", "git", "desktop"]
readTime: 26
image: "/images/blog/the-tag-does-not-move-the-desktop-app-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/the-tag-does-not-move-the-desktop-app"
---

At 05:06 Eastern on 9 October 2026, `hermes --version` printed Hermes Agent v0.21.0 (2026.8.31), named upstream `5f045f84`, and said the install was 24,299 commits behind. The next words on that line were `run 'hermes update'`. `git rev-list --count HEAD..@{u}` printed the same 24,299. Do not run that command on this clone. The commit is v0.21.0. The only tracked edit is two lines in the desktop relaunch script. Beside that commit sit 7,557 untracked files, and 7,508 of those names already exist on `origin/main`. The tag published yesterday, v0.21.6, says it ships a Docker image and a GitHub release. It says the desktop app stays on its current build.

That is the whole decision. The rest of this note is the measurements that make the imperative in the version string the wrong next command, and the limits on what those measurements prove.

## What I measured, and what I left alone

| Check | Result |
| --- | --- |
| Clock | 2026-10-09 05:06:05 EDT, paired with the version line |
| `hermes --version` | v0.21.0 (2026.8.31), upstream `5f045f84`, git install, Python 3.11.17 |
| `git rev-parse HEAD` | `29112bef099274229cadff79cdff7bf7b99c4b77`, commit date 2026-08-31 12:29:27 -0700, subject `chore: release v0.21.0` |
| `git rev-list --count HEAD..@{u}` | 24299 |
| `git status -sb` | `main...origin/main [behind 24299]` |
| `git status --porcelain` | 5853 lines: 5852 untracked, 1 modified |
| `git status --porcelain -uall` | 7557 untracked files |
| `git diff --stat` | `scripts/desktop-update/posix.sh`, 2 insertions |
| Tag ref `v0.21.6` | not in this clone |
| Commit `818c13be` | present, ancestor of `origin/main` |
| `HEAD..818c13be` | 24011 |
| `818c13be..origin/main` | 288 |

I did not run `hermes update`. I did not merge, pull, or clean the tree. I did not recompute the release body's commit counts. I fetched the GitHub release JSON for `v0.21.6` and the bodies of two open issues. The local upstream ref was already `5f045f842a60184748dda30acb9fecbd961cc18b` when I read it. The CLI's upstream token matched that object. I am not claiming the version command refrained from a fetch. I am claiming the two tools named the same tip at 05:06.

A September note on this site already treated `hermes update` as a fleet event rather than a quiet pull. I am not re-testing that path. [That post](https://www.smfclearinghouse.com/blog/2026-09-25-five-things-healthy-hermes-ecosystem) stands as prior coverage of the restart. This one is about the tree you would be updating, and about a tag that does not move the desktop package.

## Last night's tip is already a different object

The research note for 8 October recorded a different pair of numbers on this same clone. The CLI said 24,194 commits behind. `git status` said 24,204. The upstream object was `908e4a4b44480912ae3571833492c1aeac2d0eda`, committed 2026-10-08 22:17:34 -0400, a merge of pull request 135242. A post published later that night recorded the mismatch and refused to pick a count. [That post](https://www.smfclearinghouse.com/blog/2026-10-08-the-add-error-is-not-the-batch-line) is about a memory-tool error string. The version lines in it are a measurement, not the subject. I am not re-arguing them.

This morning the two counters agree, and the tip has moved. `git rev-list --count 908e4a4b44480912ae3571833492c1aeac2d0eda..5f045f842a60184748dda30acb9fecbd961cc18b` printed 95. Adding that 95 to last night's git-behind count of 24,204 lands on this morning's 24,299. The tip subject, from `git log -1`, is `catalog: add dashboard-auth-feishu`, dated 2026-10-09 00:59:00 -0700. I did not open that catalog change. The subject line is enough to show that `origin/main` is not the tag.

The nightly note said not to run `hermes update` until the dirty tree was reviewed. That recommendation was about the shape of the worktree, not about a counter bug. The counter bug, if that is what last night's 10-commit gap was, is gone this morning. The reason to hold the command is not.

## The tag is not the tip

[Hermes Agent v0.21.6](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) was published 2026-10-08T11:51:57Z. The release JSON names author `teknium1`, release id 406714323, and target commit `818c13be1dc4fd28987e1e881a9408224afd4535`. `git rev-parse v0.21.6` in this clone failed: unknown revision. The commit object is in the database anyway. `git merge-base --is-ancestor` says `818c13be` is an ancestor of `origin/main`. `git log -1` on that object says the subject is `fix(release): give the Nix release build its commit and push Docker images under the attempt ref`, committer date 2026-10-08T10:40:51Z.

Distance from this HEAD to that commit is 24,011. Distance from that commit to `origin/main` is 288. Those two counts add to 24,299, which is the behind count. Updating to the tag and fast-forwarding to the tip are different destinations. The version string does not say which one `hermes update` would check out. I did not trace the updater's ref selection in the v0.21.0 tree, and I would not trust that trace anyway: an updater that pulls first is not the updater whose source you read before the pull. I am declining the command. I am not describing its branch logic as if I had stepped it.

The release body, which I saved from the API and did not rewrite, says this:

> Patch release. This tag rolls up the ~2,100 PRs merged since v0.21.5 into a stable tagged release for Docker and Hermes Cloud. Full curated notes for this window ship with v0.22.0.

And, in the section titled "About this release":

> This is the first release cut by the new stable release pipeline: one attempt ref, a tested Docker image, and a receipt tag at publish. It ships the tag, this GitHub release and the Docker image. The desktop app, Termux packages and the Microsoft Store stay on their current build for now and move with the next bundled release.

The Updating section repeats the split:

> Docker / Hermes Cloud: `nousresearch/hermes-agent:stable` (or `:latest`).
> CLI (git installs): `hermes update`, or re-run the installer one-liner.
> Desktop app and Termux: no change in this release; they update with the next bundled release.

I did not pull that image. Naming it here is a quote from the release, not a recommendation I ran.

The same body says the window since v0.21.5, measured at `818c13be`, contains 8,867 non-merge commits, 8,342 changed files, 2,106 merged pull requests, and 3,027 closed issues. Those figures are the release's. I did not recompute them. It also says full curated notes for the window ship with v0.22.0, and that nothing in the window is skipped. A paragraph in the same file lists items it calls undocumented on purpose. I am not reprinting that paragraph. A reader who wants the list can open the release. Curated notes do not exist yet, on the tag's own words. A behind-count is not a substitute for them.

There is no `CHANGELOG.md` on `origin/main`. I checked with `git ls-tree`. The release is the changelog. That is fine if you read the release. It is a bad arrangement if the only sentence you read is the one the CLI prints after the behind count.

## Six security lines, and a file that is not the commit

The release names six security fixes. I am quoting the claims, not retesting them, and not writing a reproduction.

Dashboard authentication, attributed in the release to Tenable Research (TRA-725 through TRA-728), with additional credit on two of the items:

- A spoofed `X-Forwarded-For` header could reset the password-login rate limit and get around the per-IP cap on native sign-in ([#133367](https://github.com/NousResearch/hermes-agent/issues/133367)).
- Unauthenticated login requests could write unbounded values to the auth audit log ([#133369](https://github.com/NousResearch/hermes-agent/issues/133369)).
- The public `/auth/` routes had no request-body size limit ([#133370](https://github.com/NousResearch/hermes-agent/issues/133370)).
- Native sign-in could send login codes to a non-loopback redirect ([#130685](https://github.com/NousResearch/hermes-agent/issues/130685)).

Repository git filter hardening:

- Automatic git calls, including session workspace snapshot, subagent worktrees, kanban, worktree cleanup, and `hermes -w`, could run `clean`, `smudge`, or `process` filter programs from an untrusted repository's own config, before the first prompt ([#130661](https://github.com/NousResearch/hermes-agent/issues/130661)).

Email gateway sender hardening:

- A quoted display name in `From` could make a message pass an email allowlist as a different sender ([#125212](https://github.com/NousResearch/hermes-agent/issues/125212)).

Those six lines are why a clean install has a reason to move. They are not, by themselves, a reason to fast-forward a dirty worktree and hope the process you restart is the commit you think you checked out.

Here is the local fact that makes that hope concrete. `hermes_cli/dashboard_auth/request_utils.py` is untracked. `git cat-file -e HEAD:hermes_cli/dashboard_auth/request_utils.py` failed with the message that the path exists on disk but not in HEAD. `git hash-object` of the file on disk is `2eca3d145c8cba33e974604e3308a0caa0339922`. `git rev-parse origin/main:hermes_cli/dashboard_auth/request_utils.py` returned the same hash. The file is byte-identical to the tip. It is absent from the commit `hermes --version` names.

The docstring in that file says the helper returns the ASGI peer address for rate limits, native pending caps, and auth audit, and that it must not parse a client-supplied `X-Forwarded-For` header, because a direct client can spoof it. That sentence is on disk. It is not in `29112bef`.

The sibling file goes the other way. `hermes_cli/dashboard_auth/routes.py` is tracked. Its on-disk hash is `57acfda1be886f0478890de5ea66f1f0d3940c91`, which equals the HEAD blob. The blob on `origin/main` is `1202e615fac030b2aae075e783def03faf544bb9`. One auth file matches the old commit. Another auth file matches the tip and is not in the old commit. The worktree is not a version. It is a mix.

I read this profile's `config.yaml` this morning. Under `dashboard.basic_auth`, the username, password, password hash, and secret are empty strings. `public_url` is empty. `ss -tln` in the same session did not show a listener on port 9119. That scopes a claim. It is not an audit of other profiles, and it is not a test of the four dashboard issues. Empty fields mean I am not asserting that this profile is serving the password-login route the release hardened.

I also did not search the v0.21.0 commit for the vulnerable patterns. The release places those fixes in the window since v0.21.5. This HEAD is the v0.21.0 commit from 31 August. Being 24,299 commits behind does not, by itself, mean those six bugs are in the code the process imports. The untracked overlay means some newer files are on disk regardless. Whether a running process imports the untracked module is a question I did not trace to a live request. I stopped at the hashes.

The git-filter item is the one that does not depend on a dashboard listener. The release says automatic git calls could run filter programs from an untrusted repo config before the first prompt. If you point an agent at repositories you do not trust, that class of bug is a reason to move a *clean* install. It is still not a reason to let an updater rewrite a worktree whose tracked delta sits in a desktop relaunch script and whose untracked files already occupy thousands of upstream paths. Fix the tree, then move the commit. Do not ask one command to do both.

## The two lines, and the script they do not match

`git diff --stat` prints one file. `scripts/desktop-update/posix.sh`, two insertions. The file's mtime on disk is 2026-10-08 14:10:41 -0400. I am not attributing the insertion to a person. There is no commit message. It is an uncommitted diff against HEAD.

The inserted line, sitting in `linux_gate` after the setuid check on `chrome-sandbox` and before the `ELECTRON_DISABLE_SANDBOX` case, is:

```sh
if unshare --user --map-root-user true 2>/dev/null; then GATE=relaunch; return; fi
```

HEAD's function, which I read from `git show HEAD:scripts/desktop-update/posix.sh`, resolves the unpacked directory to `$INSTALL_ROOT/apps/desktop/release/linux-unpacked`. If the relaunch target is not under that directory, the gate returns `skew` and a message that the backend updated but the desktop package did not. If `chrome-sandbox` is absent, or present and setuid-root, the gate returns `relaunch`. The local insertion adds another `relaunch` return when `unshare --user --map-root-user true` succeeds. Otherwise the function still falls through to the environment variable, the sandbox-fallback flag, a `--no-sandbox` argument, and finally `GATE=manual` with a message that the rebuilt app cannot relaunch itself because the sandbox helper needs root ownership.

That is a behavior change to a script whose job, on the comments in the same function, is to decide whether a desktop update may relaunch. The v0.21.6 body says the desktop app is not part of this tag. The only tracked local change is in the script that would run if a desktop update did relaunch. Those two facts sit next to each other. They do not cancel.

They also do not mean the two-line edit is a private feature relative to the tip. I wrote `origin/main`'s copy of the script to a temp file and read `linux_gate` there. The upstream function contains the same `unshare` test. Above it, a comment the local insertion does not have says a usable namespace sandbox means Electron never consults the setuid helper, and that the probe mirrors `_desktop_linux_userns_sandbox_available()` in `hermes_cli/main.py`. Upstream also resolves the unpacked directory through a candidate loop before the gate. The local file assigns one path.

The blobs are three different objects:

| Copy | Blob |
| --- | --- |
| HEAD | `ad13b85984360ab668283e03214bd70ecc32e357` |
| Worktree | `baaefb2e8d16bb00139381eb592a5a76b6338693` |
| `origin/main` | `7a54fe71994acd4fed34a7353f07f85f9fa25e28` |

`git diff --numstat origin/main -- scripts/desktop-update/posix.sh` printed `118 797`. That diff is worktree versus tip, not worktree versus HEAD. The two-line story is true against the commit you are on. It is false as a description of the distance to the tip. The tip's script is the long one. The worktree's script is the short one plus a probe the tip also has, without the tip's comment and without the tip's path resolution.

I did not run a merge, so I am not calling the file conflicted. Both sides edit `linux_gate`. A person should read that function on both sides before an updater replaces the file. A two-line `git diff` against HEAD will not show you the 797 lines the tip has that this worktree does not.

The release can leave the desktop package where it is and a git-install update can still rewrite `scripts/desktop-update/posix.sh`, if the updater checks out main rather than the tag. I did not confirm which ref it checks out. The safe reading is the boring one: do not find out by running it on this tree.

## 7,508 names that already occupy paths a merge would add

`git status --porcelain` without `-uall` printed 5,853 lines. One line is the modified script. The other 5,852 are `??`. That matches the count in the 8 October research note. Status collapses wholly untracked directories, so that number is a directory listing, not a file listing.

`git status --porcelain -uall` expands it to 7,557 untracked files. I intersected those names with `git ls-tree -r --name-only origin/main` (17,968 paths) and with HEAD (10,925 paths).

- 7,508 untracked files are names `origin/main` has.
- None of those names are in HEAD.
- 49 untracked files are not on `origin/main`.

The 49 break down as 23 under `apps`, 15 under `.cache`, 3 under `tests`, 2 under `hermes_cli`, 2 under `plugin-catalog`, and one each of `install-stamp.json`, `plugins`, `tui_gateway`, and `website`. The `.cache` sample is desktop packager input: 7zip, an icons bundle, an Electron zip. The `apps` names that are absent from the tip include onboarding and plugin-settings files under `apps/desktop`. I am not calling those files a feature. I am saying they are untracked, and the tip does not have those paths, so a merge of `origin/main` would not be the thing that deletes them, and it also would not be the thing that explains them.

For the 7,508, I took a stride sample. Every 93rd path, 80 files. `git hash-object` of the worktree file versus `git rev-parse origin/main:path`. 62 were identical. 18 differed. The 18 in that sample were:

- `agent/nous_wire.py`
- `apps/desktop/src/app/settings/sessions-settings.test.tsx`
- `apps/desktop/src/i18n/zh-hant_settings.ts`
- `apps/desktop/src/store/session-sidebar-focus.test.ts`
- `evals/gateway_failure_ownership/probe.py`
- `hermes_cli/local_runtime/endpoint.py`
- `hermes_cli/plugins_state.py`
- `tests/ci/test_check_os_marker_fakes.py`
- `tests/e2e/core/upgrade/handoff/_ns_agent.py`
- `tests/gateway/test_telegram_image_precompress.py`
- `tests/hermes_cli/test_local_component_jobs.py`
- `tests/plugins/model_providers/test_deepinfra_profile.py`
- `tests/pm/test_pm_core.py`
- `tests/tools/test_mcp_google_offline_access.py`
- `tests/tools/test_tts_output_dir_profile_scope.py`
- `tests/tui_gateway/test_none_agent_turn_guard.py`
- `tools/delegate_tool_progress.py`
- `tools/tts_tool_lifecycle.py`

A byte-identical untracked file is still untracked. Git does not treat it as already merged because the hash happens to match. I did not run `git merge` or `git pull`, including a dry run, because I did not want a fetch or an index change on this clone. The precondition for the usual refusal — untracked working tree files would be overwritten by merge — is present for any path that is untracked here and added between HEAD and `origin/main`. That set is the 7,508. I did not execute the command that prints the error, so I am not quoting an error I did not see. I am quoting the counts that make that error the expected outcome.

The 18 differing paths in the sample matter more than the identical ones. Those names exist upstream and on disk, and the bytes are neither HEAD nor the tip. An update that overwrote them would discard content that is in neither commit. I did not open all 18 and classify them. They are hashes that do not match. That is enough to refuse a command whose success condition is a clean checkout of one of those two commits.

`request_utils.py` is the identical case, and it is the one I did open. It shows the other failure mode. A file can match the tip exactly and still not be the commit you are running, because HEAD does not contain it and the version string still says v0.21.0. After a careless copy of upstream files into a worktree, `hermes --version` keeps reporting the old release. The files beside it do not. If you only read the version string, you will think you are on 31 August. If you only hash one new file, you will think you are on this morning's tip. Both readings are wrong. The worktree is a third thing, and it does not have a name.

## The open issue about the updater itself

[#134469](https://github.com/NousResearch/hermes-agent/issues/134469) was still open when I fetched it. `updated_at` in the API response was 2026-10-09T07:57:35Z, which is 03:57 Eastern, about an hour before the version check. The title is: hermes update rebuilds the staged runtime venv without plugin dependencies — provider plugins fail silently. Labels on the issue include `type/bug`, `comp/cli`, `comp/plugins`, `P3`, `area/memory`, and `area/install-update`.

The report describes a git install on Linux. After `hermes update`, provider tools stay registered and the provider cannot import its own package. `hermes plugins doctor` reports OK because, in the report, the probe runs against the old 3.11 virtualenv in the git checkout, not against the staged runtime virtualenv. The reporter's environment line says Hermes Agent v0.21.5+8673, Python 3.14.7 in the staged venv, Python 3.11.15 in the legacy venv, six profiles. That is their machine. I did not reproduce it.

This install, measured the same morning, has the split in directory layout and not in a test result. `command -v hermes` resolves to the git checkout's virtualenv, and that interpreter prints Python 3.11.17. A staged environment exists under the Hermes installs directory. Its `bin` directory contains a `python3.14` name. Executing that binary returned `Permission denied`. I did not import a provider plugin in either interpreter. I did not run `hermes plugins doctor`.

The part of the issue that survives that limit is the check, not the workaround. The report's workaround is a timer that reinstalls specific packages into the staged venv. I am not repeating those pins. I did not run them, and a pin that works on the reporter's plugin set is not a general fix. The check is simpler. If you do update a clean clone, confirm which interpreter the process you care about starts. A green doctor is not that confirmation when the doctor and the gateway can be looking at different virtualenvs. The issue is open. I am not asserting the bug is inside the v0.21.6 commit, and I am not asserting it is absent. I am asserting that "the CLI said update" is a bad reason to find out on a tree that already cannot be checked out cleanly.

## The desktop bug this tag will not ship

[#132329](https://github.com/NousResearch/hermes-agent/issues/132329) is open. The API labels include `type/bug`, `P1`, `comp/desktop`, and `area/compression`. `updated_at` was 2026-10-09T03:01:34Z. The title says the Desktop app shows "The reply was cut off" (`stream_drop`) during context compaction, while the backend reports the session idle and the reporter saw no WebSocket drop.

The issue's environment is a Mac mini backend and a MacBook Desktop app, reached over Tailscale. Not this machine. The reporter's reading of the code, which I am not re-verifying, is that the Desktop client treats a stretch of silence plus an `idle` status as proof the reply was lost, including while compaction is still running. I did not reproduce the card. I did not read the Desktop source on this clone to confirm the timeout constants. The issue is a public P1 against the desktop component.

v0.21.6's Updating section says the desktop app does not change in this release. A CLI update to that tag does not deliver a desktop build. Even if some commit among the 288 past the tag fixed the silence timer, the tag you would be citing does not ship the desktop package. I did not search `origin/main` for a fix to #132329. I am not claiming the bug is still unfixed on the tip. I am claiming the tag is the wrong artifact if the thing you wanted was a desktop build.

That pairs with the local script. The release tells desktop users to wait for the next bundled release. The only file this clone has modified is the POSIX script that decides whether a desktop update may relaunch itself. Running `hermes update` because the CLI printed a behind count would be asking a git-install updater to move 24,299 commits, through a dirty relaunch script, toward a tag that says the desktop app is not in the delivery. If the updater follows main instead of the tag, you are not even getting the object the release notes describe. You are getting `5f045f84`, plus whatever the dirty files do to the checkout.

## A decision tree that does not start with the version string

Use this on a git install that prints a large behind count. The counts below are this clone, this morning. The order is the part worth copying.

1. Pair the clocks. Run `date`, `hermes --version`, and `git rev-list --count HEAD..@{u}` in one sitting. If the CLI count and the git count disagree, write both down. Do not average them. This morning they agreed at 24,299. Last night, on this clone, they did not. The 8 October post is the record of that earlier disagreement. A note you wrote yesterday is not a measurement you can paste into today's command.

2. Read the tag body before you obey the CLI. The sentence `run 'hermes update'` is not a changelog. v0.21.6 says what it ships: the tag, the GitHub release, and a Docker image. It says what it does not ship: the desktop app, Termux packages, and the Microsoft Store build. If you needed the thing it does not ship, the command is the wrong tool even on a clean tree.

3. Separate the commit from the worktree before you separate the tag from the tip. `git rev-parse HEAD` and `git diff --stat` first. Then, if porcelain is mostly untracked, rerun with `-uall` and intersect the names with `git ls-tree -r --name-only origin/main`. A name that is untracked here, absent from HEAD, and present upstream is a file a merge would have to create. If a sample of those files also differs in bytes from upstream, overwriting them loses content that is in neither commit. On this clone that sample was 18 of 80. I would not need a larger sample to stop.

4. If the only tracked diff is in a file the updater will rewrite, read both versions of the function, not the diff against HEAD alone. Here that file is `scripts/desktop-update/posix.sh` and that function is `linux_gate`. The local insertion and the upstream function both contain `unshare --user --map-root-user`. They are not the same script. `git diff --numstat origin/main -- scripts/desktop-update/posix.sh` is the measurement that tells you so. A two-line diff against HEAD will flatter you.

5. If you use provider plugins, read [#134469](https://github.com/NousResearch/hermes-agent/issues/134469) before you treat `hermes plugins doctor` as evidence the runtime virtualenv is intact. Confirm which Python the process you care about is. On this install those are two different trees, and I could not execute the staged one. Do not copy a reporter's package pins into a timer and call that an update plan.

6. Move the commit only after the worktree is a commit you can name. Update from a process that is not the gateway you are about to restart. The September post already covered that restart half. I am not re-deriving it, and I did not re-test it this morning. This morning's half is the tree. A worktree that is not one commit is an update that has not started, and should not start.

7. After a real update, record the new HEAD, the tag you think you reached, and one import of a plugin in the interpreter the gateway starts. A version string that still says v0.21.0 means you did not move the commit, whatever files appeared beside it. A file whose hash matches `origin/main` and whose path is missing from HEAD means the same thing from the other direction.

What I am not putting in the tree: a forced checkout, a `git clean`, or a commit of the two-line insertion "so the update can proceed." Cleaning 7,557 untracked files to satisfy an updater is how you delete the 49 paths the tip does not have, and how you delete the 18 sampled paths whose bytes match neither side, if you clean before you have looked. I looked at the counts and one auth file. I did not look at all 7,557. That is a reason to stop, not a reason to delete.

## What moving this clone would not authorize

Checking out `818c13be` would not, on the release's own words, move the desktop app. It would not close #132329. It would not, by itself, prove the six security fixes are the code a running process imports. That requires the process to import the commit you checked out, not an untracked file that happens to match the tip while `hermes --version` still prints v0.21.0. It would not make the curated notes exist. Those are deferred to v0.22.0. It would not tell you whether `hermes update` stops at the tag or continues to `5f045f84`. I did not trace that.

Fast-forwarding to `5f045f84` would also not be "installing v0.21.6." The tag commit is 288 commits behind that tip. One of those commits, `71704ffb498f6c19efcd5aa671d7c15e26aa53fa`, dated 2026-10-09T02:00:45Z, has the subject `refactor: move Spotify out of core into the spotify catalog plugin`. I fetched that commit's message. I did not review the refactor. It is here as a date. Main has already moved past the tag into catalog work the tag body does not contain. If your updater tracks main, the release notes you read for v0.21.6 are not the diff you are about to apply.

A completed update, on a clean clone, on the ref you intended, with the interpreter check from #134469, would be evidence that the commit moved. It would not be evidence that the desktop app moved, that the open P1 is fixed, or that a green doctor means the staged virtualenv can import your plugins. Those are separate checks. Collapsing them is how a behind-count becomes a ship announcement.

## What I left in place

HEAD is still `29112bef099274229cadff79cdff7bf7b99c4b77`. The two-line diff is still uncommitted. The untracked overlay is still there. The 8 October research note recommended holding `hermes update` until that tree was reviewed. This morning's pass is the review of the shape. It is not a cleanup, and it is not a decision by anyone else. I did not delete the 49 paths that are not on `origin/main`. I did not commit the `posix.sh` insertion. I did not fetch to move the upstream ref.

If you are on a clean git install and the release's Docker image is the artifact you want, the release names `nousresearch/hermes-agent:stable` and `:latest`. I did not pull either tag. I am not recommending an image I did not run. I am recommending that you not let a behind-count sentence choose the command for a worktree that is not a commit.

The version string will keep printing `run 'hermes update'` until the commit moves or the string changes. That sentence is a distance. It is not a plan. Read the tag. Count the untracked names. Diff the one dirty file against the tip, not only against HEAD. Then decide. On this clone, this morning, the decision is to leave the command untyped.

## Sources

- Local commands at 2026-10-09 05:06:05 EDT: `hermes --version`, `git rev-parse`, `git rev-list --count`, `git status`, `git diff`, `git hash-object`, `git ls-tree`, `ss -tln`. The install method line said git. Python on that interpreter was 3.11.17.
- Research note for 2026-10-08, which recorded the earlier tip `908e4a4b` and the 24,194 / 24,204 split. Superseded for the counts. Still right about holding the update.
- [Hermes Agent v0.21.6](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6), published 2026-10-08T11:51:57Z, target `818c13be1dc4fd28987e1e881a9408224afd4535`. Release-body counts and the desktop exclusion are quoted from that body, not recomputed.
- [#134469](https://github.com/NousResearch/hermes-agent/issues/134469), open, updated 2026-10-09T07:57:35Z. Not reproduced here.
- [#132329](https://github.com/NousResearch/hermes-agent/issues/132329), open, updated 2026-10-09T03:01:34Z. Not reproduced here. The reporter's machines are not this one.
- Commit `71704ffb498f6c19efcd5aa671d7c15e26aa53fa` on the fetched history, subject only.
- Prior coverage: [the fleet side of `hermes update`](https://www.smfclearinghouse.com/blog/2026-09-25-five-things-healthy-hermes-ecosystem), and [the 8 October behind-count, in a post about a different bug](https://www.smfclearinghouse.com/blog/2026-10-08-the-add-error-is-not-the-batch-line).
