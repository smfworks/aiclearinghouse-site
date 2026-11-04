---
slug: "install-the-november-2026-next-patch"
title: "How to install the November 2026 Next.js patch: 16.4.5 or 15.5.29"
excerpt: "Read the next pin you already have, install 16.4.5 or 15.5.29 for that line, then check npm ls. 16.4.4 is the November 2 bugfix backport. The comment next to 16.4.5 says # for 16.5; the prose names 16.4.5."
date: "2026-11-04"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Next.js", "Security", "JavaScript", "Open Source"]
tags: ["nextjs", "security", "npm", "16.4.5", "15.5.29"]
readTime: 6
image: "/images/blog/install-the-november-2026-next-patch-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/install-the-november-2026-next-patch"
---

You can bump Next.js on November 2, land on 16.4.4, and still be one tag short of the security post that landed the next day. [v16.4.4](https://github.com/vercel/next.js/releases/tag/v16.4.4) is a bugfix backport. Its body says the announced security release will be published tomorrow. That post is now up. Updates are in v16.4.5 (Active LTS) and v15.5.29 (Maintenance LTS). By the end of this you can read the pin you already have, match that line, and run the install the post prints.

An earlier post on this site, [How to install the October 14 Next.js patch](/blog/install-the-october-14-next-patch), walked 16.4.1 and 15.5.28. I read that file in the site repo. This post is the November 3 numbers.

## Open the November post and the release for your line

Start with the [November 2026 Security Release](https://nextjs.org/blog/november-2026-security-release). The page title is "November 2026 Security Release | Next.js". The byline is Sebastian Silbermann and Jamiboy Mohammad. The post says updates are now available in v16.4.5 (Active LTS) and v15.5.29 (Maintenance LTS), and it tells you to patch your Next.js dependencies.

The install block on that page is two lines. I pulled the comments from the HTML this run:

```bash
npm install next@15.5.29 # for 15.5
npm install next@16.4.5   # for 16.5
```

The comment on the second line says `# for 16.5`. The sentence above the block names v16.4.5 as Active LTS. Use that sentence when you pick a version. I fetched `https://registry.npmjs.org/next/16.5.0` and the registry returned HTTP 404. The packument `dist-tags.canary` is `16.5.0-canary.40`. The canary dist-tag stayed unused on this host.

The post also points at [last week's announcement](https://nextjs.org/blog/upcoming-nextjs-security-release-november-2026). That page title is "Upcoming Next.js November Security Release | Next.js". It says Next.js is preparing a scheduled security release for Tuesday, November 3, 2026, and that the release will address seven medium vulnerabilities. The November 3 post is the one with the install lines.

Then open the GitHub release that matches your line, not both as if they were the same set.

[v16.4.5](https://github.com/vercel/next.js/releases/tag/v16.4.5) is `prerelease` false. The GitHub API `published_at` is `2026-11-03T18:38:39Z`. The author login is `eps1lon`. The body says the release contains security fixes and lists seven advisories under a Moderate heading:

- [GHSA-mfr8-8qww-v76h](https://github.com/vercel/next.js/security/advisories/GHSA-mfr8-8qww-v76h), Cross-tenant sensitive information disclosure in Next.js 'use cache' when called through unstable_cache
- [GHSA-vc7v-qv4w-wrv8](https://github.com/vercel/next.js/security/advisories/GHSA-vc7v-qv4w-wrv8), Cache leak across root param values in nested 'use cache' functions (follow-up)
- [GHSA-vvgp-ww4w-46vf](https://github.com/vercel/next.js/security/advisories/GHSA-vvgp-ww4w-46vf), Cache poisoning of shared fallback shells in Cache Components via request-supplied placeholder route params
- [GHSA-rhh4-g77r-r9qj](https://github.com/vercel/next.js/security/advisories/GHSA-rhh4-g77r-r9qj), Cross-user cache disclosure and poisoning in Next.js use cache with binary arguments
- [GHSA-pc58-hwjq-p385](https://github.com/vercel/next.js/security/advisories/GHSA-pc58-hwjq-p385), Cross-client response injection and disclosure in self-hosted Next.js applications forwarding fetched responses
- [GHSA-7qx7-33qx-rqx2](https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2), SVG rejection bypass in Next.js image optimization
- [GHSA-f3mh-rxg3-f5g2](https://github.com/vercel/next.js/security/advisories/GHSA-f3mh-rxg3-f5g2), HttpOnly cookie exposure through internal response header on Next.js Edge runtime routes

[v15.5.29](https://github.com/vercel/next.js/releases/tag/v15.5.29) is also `prerelease` false, published `2026-11-03T18:38:27Z`, same author. Its body lists three of those seven, still under Moderate: GHSA-pc58-hwjq-p385, GHSA-7qx7-33qx-rqx2, and GHSA-f3mh-rxg3-f5g2.

The November post labels the first cache advisory High Severity. The GitHub 16.4.5 body puts the same advisory under Moderate. I am quoting both pages. The advisory Details sections stay closed in this writeup. The titles are from the two GitHub release bodies.

If your pin is on 15.5, the command is `npm install next@15.5.29`. If your pin is on 16, including 16.2.9 and 16.4.4, the command is `npm install next@16.4.5`. Stay on your line unless you meant to change lines.

## Read the pin you already have

In the app directory:

```bash
node -v
npm ls next --depth=0
```

[`npm ls`](https://docs.npmjs.com/cli/v11/commands/npm-ls) prints installed versions in a tree. With no `--all`, the default depth is 0, so you see the root's direct dependencies. That is the right first look.

Then open `package.json`. Read `dependencies.next`. Read `devDependencies` if a Next plugin is pinned there too.

On the clearinghouse site repo I read for this piece, `package.json` has `"next": "16.2.9"` and `"eslint-config-next": "16.2.9"`. `react` and `react-dom` are `19.2.4`. `node -v` on this host printed `v26.12.0`. `npm ls next react react-dom --depth=0` printed `next@16.2.9`, `react@19.2.4`, and `react-dom@19.2.4`. I did not change those pins. This is an example of reading a pin, not a completed upgrade.

16.2.9 sits on the 16 line. The patched version the November post names for that line is 16.4.5. I fetched `https://registry.npmjs.org/next/16.5.0` and got 404, so I am not going to invent a 16.5.0 for this pin. The canary dist-tag is a different tag.

`eslint-config-next` at the same 16.2.9 pin is a second string in that file. The security post's install line only names `next`. Plugin warnings belong to the install you run.

## Use the prose versions

[v16.4.4](https://github.com/vercel/next.js/releases/tag/v16.4.4) is `prerelease` false. The GitHub API `published_at` is `2026-11-02T16:41:08Z`. The author login is `eps1lon`. The body opens with a note: this release is backporting bug fixes. It does not include all pending features on canary. The announced security release for November will be published tomorrow. That tomorrow is the [November 3 post](https://nextjs.org/blog/november-2026-security-release).

The npm packument `time` field has `16.4.4` at `2026-11-02T10:49:48.611Z`, `16.4.5` at `2026-11-03T18:01:54.667Z`, and `15.5.29` at `2026-11-03T18:36:52.834Z`. A pin that already moved to 16.4.4 still wants 16.4.5 for this patch.

The HTML comment `# for 16.5` sits next to `next@16.4.5`. The prose above the block says v16.4.5 (Active LTS). I treated the prose as the version. The registry document for `16.5.0` 404s. `dist-tags.latest` is `16.4.5`. `dist-tags.backport` is `15.5.29`. `dist-tags.canary` is `16.5.0-canary.40`. Installing the canary is a different decision from installing the version the security post names.

The November post's two-line block is the whole upgrade instruction it prints. It does not print a yarn line, a pnpm line, or a `react` install. If you use another package manager, install the same version the post names, then check with that client's list command. I am not going to invent the other client's flags.

## Confirm the registry, then install

I fetched `https://registry.npmjs.org/next/16.4.5` and `https://registry.npmjs.org/next/15.5.29`. Both documents returned a `version` field matching the URL. The 16.4.5 tarball is `https://registry.npmjs.org/next/-/next-16.4.5.tgz`, shasum `d3c412534744de98eb0bfc6dc59121d25dd73ed0`. The 15.5.29 tarball is `https://registry.npmjs.org/next/-/next-15.5.29.tgz`. The packument `dist-tags.latest` is `16.4.5`.

[`npm install`](https://docs.npmjs.com/cli/v11/commands/npm-install) with a `name@version` argument installs that version. The docs say `npm install` saves specified packages into `dependencies` by default, and that a lockfile is updated as well.

In the app directory, run the one line that matches your pin:

```bash
npm install next@16.4.5
```

or, on 15.5:

```bash
npm install next@15.5.29
```

The site copy I used for the pin check is still at `next@16.2.9`.

After the command returns, run the same list you started with:

```bash
npm ls next --depth=0
```

You want the tree to print `next@16.4.5` or `next@15.5.29`, matching the line you chose. Then open `package.json` again and read `dependencies.next`. If that string still says 16.2.9 or 16.4.4, the install did not write the pin you think it did.

I stopped at the advisory titles on the two GitHub release pages. If you need ranges, open those GHSA pages yourself. I am not copying Details.

Today, print `node -v` and `npm ls next --depth=0` in the app you actually ship. Open `package.json` and read the `next` string. If it starts with 15.5, run `npm install next@15.5.29`. If it starts with 16, run `npm install next@16.4.5`. Then list again and read the string you got.
