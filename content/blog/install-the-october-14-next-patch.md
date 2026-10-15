---
slug: "install-the-october-14-next-patch"
title: "How to install the October 14 Next.js patch: 16.4.1 or 15.5.28"
excerpt: "Read the next pin you already have, install 16.4.1 or 15.5.28 for that line, then check npm ls. A sharp pin does not cover the other two advisories."
date: "2026-10-15"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Next.js", "Security", "JavaScript", "Open Source"]
tags: ["nextjs", "security", "npm", "GHSA-673q-mjm6-r5xr", "GHSA-2464-fhr4-w9xw", "GHSA-p3m5-59mp-jv5r"]
readTime: 17
image: "/images/blog/install-the-october-14-next-patch-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/install-the-october-14-next-patch"
---

You can patch Next.js to the version the October 14 security post names for the line you are already on, then prove the install landed. If the pin says 15.5, the command is `npm install next@15.5.28`. If it says 16, including 16.2.9, the command is `npm install next@16.4.1`. I did not run either install. The steps below are that post, the two GitHub releases, the three advisories, the npm docs, and the pin checks I did run on a working copy that is still pinned at 16.2.9.

Stay on your line unless you meant to change lines. A 15.5 app does not pick up the cache-component advisory by jumping to 16.4.1, and a 16.2 app does not get a new 16.2 tag from these pages. The patched versions those pages name are 15.5.28 and 16.4.1.

An earlier post on this site, [Don't collapse the advisory](/blog/dont-collapse-the-advisory), walked a different Next.js advisory, GHSA-vcvr-r3jv-pc5j. Don't mix that patched version with these three.

## Open the post and the two releases before you touch a pin

Start with the [October 14 security post](https://nextjs.org/blog/nextjs-security-update-october-14-2026). The page title is "Next.js Security Update for Upstream Vulnerabilities." The meta description says the October 14, 2026 out-of-band update is now available. Sebastian Silbermann, Josh Story, and Karim Rahal are the byline. The post says updates are available in v16.4.1 (Active LTS) and v15.5.28 (Maintenance LTS), and it tells you to patch your Next.js dependencies.

The install block on that page is two lines:

```bash
npm install next@15.5.28  # for 15.5
npm install next@16.4.1   # for 16.4
```

That is the whole upgrade instruction the post prints. It does not print a yarn line, a pnpm line, a canary tag, or a `react` install. If you use another package manager, install the same version the post names, then check with that client's list command. I am not going to invent the other client's flags.

The post also points at [last week's announcement](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026), dated Thursday, October 8th 2026. That page said the update would land the following Wednesday, October 14, and that it would address three upstream vulnerabilities, two Critical and one High. Two of those fixes, it said, were postponed from the September security release. The October 14 post repeats that postponement and links the September release. I did not open the September page this run, so I will not tell you which two those were. The October 14 post is the one with the install lines.

Then open the release that matches your line, not both as if they were the same patch set.

[v16.4.1](https://github.com/vercel/next.js/releases/tag/v16.4.1) is `prerelease` false. The GitHub API `published_at` is `2026-10-14T17:47:59Z`. The author login is `eps1lon`. The body says the release contains security fixes, labels two advisories Critical, and labels one High:

- [GHSA-673q-mjm6-r5xr](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr), unauthenticated remote code execution in `use cache` functions that return typed arrays
- [GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), unauthenticated remote code execution in the Image Optimization API when SVG files are used
- [GHSA-p3m5-59mp-jv5r](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r), denial of service in the App Router when the app uses Server Actions

[v15.5.28](https://github.com/vercel/next.js/releases/tag/v15.5.28) is also `prerelease` false, published `2026-10-14T17:47:49Z`, same author. Its body lists only the image-optimization advisory and the Server Actions advisory. It does not list GHSA-673q-mjm6-r5xr. That omission matches the advisory ranges below. If you are on 15.5, do not install 16.4.1 just to collect an advisory whose affected range starts at 16.0.0.

The npm registry agrees those two versions exist. I fetched `https://registry.npmjs.org/next/16.4.1` and `https://registry.npmjs.org/next/15.5.28`. Both documents returned a `version` field matching the URL. The packument's `time` field has `16.4.1` at `2026-10-14T17:43:55.246Z` and `15.5.28` at `2026-10-14T17:36:08.917Z`. The `latest` dist-tag on `https://registry.npmjs.org/next` was `16.4.1`. The `canary` dist-tag was `16.5.0-canary.12`. Do not install the canary to get "more fixed." The non-prerelease tags the releases API marked false for prerelease are 16.4.1 and 15.5.28.

The 16.4.1 release body lists those three advisories. It does not include a feature changelog. I did not read the compare, so I will not tell you the diff is empty of other changes. Install the version the security post names. Don't treat the body as a promise that nothing else moved.

## Read the pin you actually have

In the app directory:

```bash
node -v
npm ls next react react-dom sharp --depth=0
```

[`npm ls`](https://docs.npmjs.com/cli/v11/commands/npm-ls) prints installed versions in a tree. With no `--all`, the default depth is 0, so you see the root's direct dependencies, not every nested copy. That is the right first look. It is not the last look for `sharp`, which is often optional and nested. More on that below.

Then open `package.json`. Read `dependencies.next` and `devDependencies` if a Next plugin is pinned there too. An exact pin and a caret range are different problems, and the npm docs explain why in a minute.

On the clearinghouse site repo I read for this piece, `package.json` has `"next": "16.2.9"` and `"eslint-config-next": "16.2.9"`. `react` and `react-dom` are `19.2.4`. There is no `packageManager` field and no `engines` field in that file. `node -v` on this host printed `v26.8.1`. `npm ls next react react-dom sharp --depth=0` printed `next@16.2.9`, `react@19.2.4`, and `react-dom@19.2.4`. It did not print a `sharp` line. I did not change those pins. This is an example of reading a pin, not a completed upgrade.

16.2.9 sits inside the 16.x ranges on all three advisories. The patched version those ranges name is 16.4.1, not a new 16.2 tag. The security post's 16.4 comment is the line you use for a 16.2 pin. I did not go looking for a 16.2.10, and I am not going to invent one. The patched-versions field is the field to follow.

`eslint-config-next` at the same 16.2.9 pin is a second string in that file. The security post's install line only names `next`. I did not find a line on that page for the eslint config. If you bump only `next`, read whatever npm prints about the plugin. I did not run the install, so I did not see those warnings.

## Match the pin to a patched version

Read the advisory JSON, not a summary of it. I fetched the three GitHub API documents. These are the `vulnerable_version_range` and `patched_versions` strings they returned. I did not tidy the operators.

[GHSA-673q-mjm6-r5xr](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr) is critical. The API `cvss_v4` score is 9.5. There is no CVE id on that document. Affected: `>=16.0.0 <= 16.4.0`. Patched: `16.4.1`. The description says a vulnerability in applications using the App Router with Cache Components can lead to remote code execution, and that the application needs a `use cache` function that returns multiple typed arrays. It also says there is no known workaround for affected applications with such functions, and that you should upgrade immediately even if your application does not have similar functions. So "we don't use `use cache`" is not a reason to skip 16.4.1 if your pin is in that range.

[GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) is critical. The API `cvss_v4` score is 9.5. The CVE id on that document is CVE-2026-96889. The [Next.js post](https://nextjs.org/blog/nextjs-security-update-october-14-2026) uses the same id. I opened `https://www.cve.org/CVERecord?id=CVE-2026-96889` and the page did not return a record body, so I am not quoting a CVE writeup. Two ranges came back:

- `>= 10.0.0 <= 15.5.27`, patched `15.5.28`
- `> 16.0.0 <= 16.4.0`, patched `16.4.1`

That second operator is a strict greater-than. The HTML advisory page rendered the same `> 16.0.0 <= 16.4.0`. Do not "fix" it to `>=` in your head. 16.0.0 itself is not inside that one string. 16.2.9 is, because it is greater than 16.0.0 and not greater than 16.4.0.

The description says a memory-related vulnerability in an upstream library used for Image Optimization can lead to remote code execution when Next.js runs on glibc-based Linux. I am not going to expand that into a request shape. The workaround sentence is the one people will misuse, and it gets its own section below.

[GHSA-p3m5-59mp-jv5r](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r) is high. The API `cvss_v4` score is 8.2. No CVE id. Two ranges:

- `>=13.0.0 <= 15.5.27`, patched `15.5.28`
- `>= 16.0.0 <= 16.4.0`, patched `16.4.1`

The description says crafted requests against an App Router app with at least one Server Action can drive CPU use high enough to block further requests in the same process. It says no workaround exists besides upgrading. It also says applications using the Pages Router, or not using Server Actions, are not vulnerable to this one. That sentence is about this advisory. It does not clear the other two.

Put the pin next to those strings and pick one install:

- Pin is 15.5.27 or any 15.5 below that, or the `<= 15.5.27` ranges include you and you are staying on 15: install `next@15.5.28`. You are not in GHSA-673q's range. The 15.5.28 release does not list that advisory.
- Pin is greater than 16.0.0 and less than or equal to 16.4.0, including 16.2.9 and 16.4.0: install `next@16.4.1`. All three 16.x ranges include you. GHSA-2464's 16 range uses `>`, and 16.2.9 still clears that bar.
- Pin is exactly 16.0.0: GHSA-2464's 16 range does not include you. GHSA-673q and GHSA-p3m5 do, because those two use `>=`. The patched version they name is still 16.4.1. Don't stay on 16.0.0 because one advisory used a strict greater-than.
- Pin is already 16.4.1 or 15.5.28: stop. Don't install the canary.
- Pin is 14, 13, or anything else at or below 15.5.27: the patched-versions field for the ranges that include you says 15.5.28, not a 14.x tag. The security post does not print a 14 command. Moving 14 to 15.5.28 is a major bump. I did not open a 14-to-15 migration guide, so I will not write those steps. Read the advisory, then decide whether you meant to change lines.

## Check Node before you pick 16.4.1

The published `engines.node` field is not the same on the two versions.

On the 16.4.1 packument I fetched, `engines.node` is `>=20.9.0`. On the 15.5.28 packument, it is `^18.18.0 || ^19.8.0 || >= 20.0.0`.

`node -v` on this host printed `v26.8.1`, which is above 20.9.0. That check is local. Your CI image can be older than the laptop. Read the engines field against the Node that will run `npm install`, not against a version you remember from another machine.

The [npm install docs](https://docs.npmjs.com/cli/v11/commands/npm-install) say that if you install by name with no version, npm prefers a version whose engines match the current Node, and that naming the version installs that version rather than letting npm pick a compatible substitute. They do not say npm will ignore an engines mismatch, and I did not test an older Node, so I will not describe the warning or the failure. If `node -v` is below 20.9.0, don't treat `npm install next@16.4.1` as a Node upgrade. Either move Node to a version the engines field allows, or stay on a line whose engines you already meet and install the patch that line names. 15.5.28's engines field still allows Node 18.18 and 20.0. 16.4.1's does not.

## Install the version the post names

From the app directory, run one of the two lines. Not both.

```bash
npm install next@16.4.1
```

or, on the 15.5 line:

```bash
npm install next@15.5.28
```

The [npm install docs](https://docs.npmjs.com/cli/v11/commands/npm-install) say `npm install [<@scope>/]<pkg>@<version>` installs that version, and that it fails if the version has not been published. Both of these have been published. The same page says a versioned install saves the package into `dependencies` by default and updates `package-lock.json` if you have one.

It also says `--save-exact` (`-E`) saves an exact version instead of npm's default semver range. The security post does not include that flag. If your current pin is an exact string like `"16.2.9"` and you want the new pin to stay exact, add `--save-exact`. I did not run the command, so I will not show you the `package.json` line npm would write. The docs are the source for the flag. The post is the source for the version.

A bare `npm install`, with no package argument, will not do this job if the lockfile already satisfies `package.json`.

The same npm page says that when the lockfile's resolved versions satisfy the `package.json` ranges, npm uses the lockfile. When they conflict, `package.json` wins and the lockfile updates. It also says that changing a range inside the same major, for example `^7.0.0` to `^7.1.0`, only updates lockfile metadata if the installed version still satisfies the new range.

That is the trap. `"next": "16.2.9"` is an exact pin. A bare `npm install` keeps 16.2.9, because that is what the spec asks for. `"next": "^16.0.0"` with 16.2.9 installed also keeps 16.2.9 on a bare install, because 16.2.9 satisfies `^16.0.0`. The `latest` tag being 16.4.1 does not move a pin that is already satisfied. The versioned command on the security post is what changes the spec.

If `next` is not in the root `package.json`, run the command in the package that declares it. The npm docs have a `--workspace` flag for that. I did not run a workspace install, so I am not going to invent the output.

## Confirm the install

After the command finishes, read the pin again.

```bash
npm ls next --depth=0
```

You want `next@16.4.1` or `next@15.5.28`, matching the line you chose. Then open `package.json` and confirm the `next` spec moved. If you use a lockfile, confirm the lockfile's resolved version moved too. A green install that left `"16.2.9"` in `package.json` did not apply the patch.

I cannot paste a successful transcript. I did not run the install on the clearinghouse copy, and I did not run it in a throwaway directory. The registry documents show the versions exist. That is not the same as a lockfile on your machine.

If npm prints an engines warning, stop and read the `engines.node` field on the version you asked for before you add a force flag. I did not see that warning, because I did not install.

## The sharp workaround covers one advisory

GHSA-2464 is the only one of the three with a workaround that is not "upgrade Next.js."

The API description says to ensure the version of `sharp` used by Next.js is greater than or equal to `0.35.5`. It says fresh installs automatically get a fixed version of `sharp`. The sentence in the API has a typo, "fo `sharp`." I am leaving it so you know which text I read. It then says upgrading Next.js to the patched versions will ensure package managers automatically provide a fixed version of `sharp` to Next.js. The security post says the same thing in cleaner prose: a workaround is `sharp` 0.35.5 or later, and upgrading Next.js ensures the package manager provides a fixed `sharp`.

That workaround does not cover GHSA-673q or GHSA-p3m5. Those two say there is no workaround besides upgrading. A `sharp` pin is not a substitute for `next@16.4.1` or `next@15.5.28`.

And the published metadata does not say the same thing on both patched versions. I read `optionalDependencies.sharp` on the packuments:

- `next@16.4.1` declares `sharp` as `^0.35.5`
- `next@15.5.28` declares `sharp` as `^0.34.3 || ^0.35.5`

The 16.4.1 range starts at 0.35.5, which is the floor the advisory names. The 15.5.28 range still allows `^0.34.3`, which is below that floor. So the advisory's sentence and the 15.5.28 package metadata are not the same claim. I did not install 15.5.28, so I did not see which side npm actually resolved. After you install, check. Don't treat the advisory sentence as proof.

```bash
npm ls sharp --all
```

`--all` matters. On the clearinghouse copy, `npm ls sharp --depth=0` printed no `sharp` line, and `npm ls sharp --all --depth=3` was empty too. The installed `next@16.2.9` package.json still lists `optionalDependencies.sharp` as `^0.34.5`. Optional means it can be absent. Absence is not a patched 0.35.5. I did not test what Next uses for image optimization when `sharp` is missing, so I will not call this tree safe or unsafe on that point. If `npm ls sharp --all` prints a version, compare it to `0.35.5`. If it prints nothing, you have not satisfied the workaround by inspection, and you still need the Next.js upgrade for the advisories that have no workaround.

## The React advisories are a second list

The October 14 post links two React advisories as related upstream, and it does not add a `react` install line.

[GHSA-xqc2-xf4c-x3h3](https://github.com/facebook/react/security/advisories/GHSA-xqc2-xf4c-x3h3) is the one the post pairs with the `use cache` issue. It is critical, API `cvss_v4` score 9.5, published `2026-10-14T17:08:26Z`. The packages on the version table are `react-server-dom-parcel`, `react-server-dom-turbopack`, and `react-server-dom-webpack`. The vulnerable list runs through 19.0.0–19.0.8, 19.1.0–19.1.9, 19.2.0–19.2.8, and 19.3.0. The patched versions field is `19.0.9`, `19.1.10`, `19.2.9`, and `19.3.1`.

The description prose says fixes were backported to `19.0.09`. That is not the string in the patched-versions field. If you install anything from this advisory, use `19.0.9` from the field, not `19.0.09` from the sentence.

[GHSA-h3gv-c5rc-p453](https://github.com/facebook/react/security/advisories/GHSA-h3gv-c5rc-p453) is the one the post pairs with the Server Actions issue. High, API `cvss_v4` score 8.2, published `2026-10-14T17:08:23Z`. Same three packages. The version table includes 19.0.8, 19.1.9, 19.2.8, and 19.3.0. The description prose stops earlier: 19.0.0 through 19.0.7, 19.1.0 through 19.1.8, and 19.2.0 through 19.2.7, and it does not mention 19.3.0. Follow the version table. The shorter sentence will tell you 19.2.8 is fine. The table does not.

Both React descriptions say to upgrade those packages if you use them. Both say that if your React code does not use a server, you are not affected, and that if you do not use a framework, bundler, or bundler plugin that supports React Server Components, you are not affected. They recommend updating immediately. They do not say that `npm install next@16.4.1` performs that update for you.

I checked the 16.4.1 and 15.5.28 packuments for a direct dependency named `react-server-dom-webpack`, `react-server-dom-turbopack`, or `react-server-dom-parcel`. Those names were not in `dependencies` or `optionalDependencies`. `peerDependencies.react` on both is `^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0`. That peer range does not require 19.3.1. So the published `next` metadata I fetched does not, by itself, pull you onto the React patched versions.

On the clearinghouse copy I ran:

```bash
npm ls react-server-dom-webpack react-server-dom-turbopack react-server-dom-parcel --depth=2
```

The tree was empty. `react@19.2.4` is installed, and 19.2.4 appears in those React advisory tables, but the tables name the three `react-server-dom-*` packages, not the `react` package. An empty `npm ls` at depth 2 does not prove Next fails to bundle the protocol inside the `next` package. I did not unpack the 16.4.1 tarball. The Next.js post's instruction for the Next.js side is still the `next` install. If `npm ls` shows one of those three packages, upgrade that package to a version on the patched list. If it does not, don't add a `react@19.3.1` install the security post never printed.

## What not to install

Don't install `next@16.5.0-canary.12` because the canary dist-tag is newer. The security post names 16.4.1 and 15.5.28. The releases API marked those two `prerelease` false.

Don't install 16.4.1 on a 15.5 app to "get all three." GHSA-673q's range starts at 16.0.0. The 15.5.28 release does not list it. Crossing to 16 is a line change, not the patch the post printed for 15.5.

Don't install 15.5.28 on a 16.2 app to avoid the Node 20.9 engines field. That is a downgrade. The 16 line's patched version is 16.4.1.

Don't stop at a `sharp` override. It is a workaround for one advisory, the published 15.5.28 range still allows an older `sharp`, and the other two advisories say upgrade.

Don't type `19.0.09`. The patched-versions field says `19.0.9`.

## What this install does not prove

A pin inside an affected range is not the same sentence as "this app is exploitable." GHSA-673q still says to upgrade even if you do not have the `use cache` function. GHSA-p3m5 says Pages Router apps, and App Router apps with no Server Actions, are not vulnerable to that one. GHSA-2464 names glibc-based Linux and the Image Optimization API when SVG files are used. I did not inventory Server Actions, `use cache`, or SVG image optimization on the clearinghouse copy. I read the pin. It is 16.2.9. I left it there.

I also did not run `npm audit`, and I did not read a compare between 16.4.0 and 16.4.1. The release body is the security list. Your install check is `npm ls next` plus the spec in `package.json`.

If your pin is 16.2.9, or any other 16 version through 16.4.0, the command the post gives you is `npm install next@16.4.1`. If it is 15.5 at or below 15.5.27, the command is `npm install next@15.5.28`. Read the engines field, run that one command, then read `npm ls` before you call it patched.
