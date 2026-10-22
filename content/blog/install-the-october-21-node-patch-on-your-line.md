---
slug: "install-the-october-21-node-patch-on-your-line"
title: "How to install the October 21 Node patch on the line you already run"
excerpt: "Check the Node on your PATH, stay on that major, and verify the official October 21 security tarball before you run it. The archive page I opened still showed the previous builds."
date: "2026-10-22"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Node.js", "Linux", "Security", "Open Source"]
tags: ["nodejs", "security-release", "checksums"]
readTime: 10
image: "/images/blog/install-the-october-21-node-patch-on-your-line-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/install-the-october-21-node-patch-on-your-line"
---

You can check the Node binary on your PATH, stay on that major line, and run the October 21, 2026 security build after you verify the official tarball. Do that before you trust the download archive. I opened the [Current archive](https://nodejs.org/en/download/archive/current) today and the heading, the binary table, and the changelog link were still v26.12.0. The [dist index](https://nodejs.org/dist/index.json) already lists v26.12.1 first, with `security` true. On this machine `command -v node` printed `/usr/sbin/node` and `node --version` printed `v26.12.0`. I checked the signature on the Linux x64 tarball, unpacked it, and the binary inside printed `v26.12.1`. `/usr/sbin/node` is still `v26.12.0`. If your version starts with `v24`, stop at 24.22.1. If it starts with `v22`, stop at 22.23.4.

The three release posts all say "This is a security release." I did not download the 24 or 22 tarballs. They are [26.12.1 (Current)](https://nodejs.org/en/blog/release/v26.12.1), [24.22.1 'Krypton' (LTS)](https://nodejs.org/en/blog/release/v24.22.1), and [22.23.4 'Jod' (LTS)](https://nodejs.org/en/blog/release/v22.23.4). GitHub marks each one `prerelease` false. Published times are `2026-10-21T10:38:29Z`, `2026-10-21T10:38:25Z`, and `2026-10-21T10:38:20Z`.

## Read the binary you actually run

```bash
command -v node
node --version
```

The first command is the file. The second is the line. A major of 26 stays on 26. A major of 24 stays on 24. A major of 22 stays on 22. Installing Current to "get the security fix" onto an LTS process is the wrong file.

The [previous releases](https://nodejs.org/en/about/previous-releases) page says production applications should only use Active LTS or Maintenance LTS releases. That sentence is their guidance. It is not a reason to move a 24 process onto 26.12.1. The [October 21 security post](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) links a build for each of the three lines. Pick the one whose major matches `node --version`.

| `node --version` starts with | Build named on the security post | Leave this one alone |
| --- | --- | --- |
| `v26.` | [26.12.1](https://nodejs.org/en/blog/release/v26.12.1) | 24.22.1 and 22.23.4 |
| `v24.` | [24.22.1](https://nodejs.org/en/blog/release/v24.22.1) | 26.12.1 |
| `v22.` | [22.23.4](https://nodejs.org/en/blog/release/v22.23.4) | 26.12.1 |

If the major is not one of those three, this security post does not link a build for you. The same page says End-of-Life versions are always affected when a security release occurs, and it points at the [release schedule](https://github.com/nodejs/release#release-schedule). The rendered table I opened marks 20.x, 25.x, 23.x, 21.x, and 18.x End-of-Life. I am not picking a migration line for you. These notes do not name one.

## Don't stop at the website archive

The Current archive page was behind the files. Its heading was v26.12.0. The Linux x64 link on that page was `node-v26.12.0-linux-x64.tar.xz`. The other-releases block linked LTS archives at v24.22.0 (Krypton) and v22.23.3 (Jod). The previous-releases table linked the same three older versions and still labeled v26 Current, v24 LTS, and v22 LTS.

The [download page](https://nodejs.org/en/download) I fetched did not name 26.12.1. The static links on the page I fetched pointed at v24.22.0 tarballs. It also said installation scripts are not maintained by the Node.js project. The installer name in that sentence did not come through on the page I fetched, so I am not naming one. I did not use one.

Use the dist index when the HTML lags. I saved `https://nodejs.org/dist/index.json` and printed the three rows:

| Version | Index `date` | Index `lts` | Index `security` | Index `npm` | Index `v8` |
| --- | --- | --- | --- | --- | --- |
| v26.12.1 | 2026-10-21 | false | true | 11.20.0 | 14.6.202.34 |
| v24.22.1 | 2026-10-20 | Krypton | true | 11.19.1 | 13.6.233.17 |
| v22.23.4 | 2026-10-20 | Jod | true | 10.9.9 | 12.4.254.21 |

The blogs and the GitHub `published_at` times say October 21 for all three. The index `date` for 24.22.1 and 22.23.4 is October 20. Don't collapse those into one timestamp. Use the blog and the GitHub time for when the release was published. Use the index to see `security: true` and which file classes exist. The 26.12.1 row lists `linux-x64`. So do the 24.22.1 and 22.23.4 rows.

The schedule file at `https://raw.githubusercontent.com/nodejs/Release/main/schedule.json` is a different clock again. v22 is Jod, maintenance `2025-10-21`, end `2027-04-30`. v24 is Krypton, maintenance `2026-10-20`, end `2028-04-30`. v26 starts `2026-05-05`, lts `2026-10-28`, maintenance `2027-10-20`, end `2029-04-30`, and the codename string is empty. The rendered schedule table still labels 22.x Maintenance LTS, 24.x Active LTS, and 26.x Current. That page says dates are subject to change. I am not treating the v24 maintenance date as a phase flip, because the status cell I read still says Active LTS. I am also not calling 26.12.1 an LTS release. The blog says Current. The index `lts` field is false. The schedule's LTS date for v26 is October 28, which is after today.

## Verify the file for your OS, then run that binary

The 26.12.1 blog lists the Linux 64-bit binary as `https://nodejs.org/dist/v26.12.1/node-v26.12.1-linux-x64.tar.xz`. The 24 and 22 blogs use the same filename pattern under their own version directories. I sent HEAD requests. All three returned HTTP 200 and `content-type: application/x-xz`.

| URL | `content-length` |
| --- | --- |
| [node-v26.12.1-linux-x64.tar.xz](https://nodejs.org/dist/v26.12.1/node-v26.12.1-linux-x64.tar.xz) | 34122264 |
| [node-v24.22.1-linux-x64.tar.xz](https://nodejs.org/dist/v24.22.1/node-v24.22.1-linux-x64.tar.xz) | 32026916 |
| [node-v22.23.4-linux-x64.tar.xz](https://nodejs.org/dist/v22.23.4/node-v22.23.4-linux-x64.tar.xz) | 31029996 |

A length is not a checksum. The [dist listing](https://nodejs.org/dist/v26.12.1/) for 26.12.1 also has `SHASUMS256.txt`, `SHASUMS256.txt.asc`, and `SHASUMS256.txt.sig`, dated 21-Oct-2026 on that page. I did not open the 24 or 22 directory listings. The blogs also list Windows, macOS, ARM, and source files. I did not download those. Take the filename from the blog for the OS you are on, then run the same check against that filename.

The Node [README](https://github.com/nodejs/node#verifying-binaries) says each download directory contains `SHASUMS256.txt.asc` with the SHA checksums and the releaser PGP signature. The commands it gives are:

```bash
curl -fsLo "/path/to/nodejs-keyring.kbx" "https://github.com/nodejs/release-keys/raw/HEAD/gpg/pubring.kbx"
curl -fsO "https://nodejs.org/dist/${VERSION}/SHASUMS256.txt.asc" \
&& gpgv --keyring="/path/to/nodejs-keyring.kbx" --output SHASUMS256.txt < SHASUMS256.txt.asc \
&& shasum --check SHASUMS256.txt --ignore-missing
```

I ran that in an empty directory with `VERSION=v26.12.1`, after also downloading `node-v26.12.1-linux-x64.tar.xz` into the same directory. `gpgv` printed:

```text
gpgv: Signature made Wed 21 Oct 2026 06:37:29 AM EDT
gpgv:                using EDDSA key 5BE8A3F6C8A5C01D106C0AD820B1A390B168D356
gpgv: Good signature from "Antoine du Hamel <antoine.duhamel@platformatic.dev>"
```

`shasum --check` printed `node-v26.12.1-linux-x64.tar.xz: OK`. The `--ignore-missing` flag is why that was the only OK line. The command checks files that are present. It does not prove you downloaded every file named in `SHASUMS256.txt`.

The checksum line in the file `gpgv` wrote is:

```text
6170b2d474e1c626f43cff3adc118df9fe3b573258a4fc3d850c8dbc6b079bbd  node-v26.12.1-linux-x64.tar.xz
```

That same hash is in the SHASUMS block on the [26.12.1 blog](https://nodejs.org/en/blog/release/v26.12.1). The GitHub release page says the tag was signed with a verified signature, GPG key ID `20B1A390B168D356`. Those are the last 16 hex digits of the key `gpgv` printed. I did not run `git verify-tag`.

This host has `shasum` at `/usr/bin/core_perl/shasum`. The README command worked. I also have `sha256sum`. I did not need it.

Then unpack and ask that binary, not the one on PATH:

```bash
tar -xJf node-v26.12.1-linux-x64.tar.xz
./node-v26.12.1-linux-x64/bin/node --version
./node-v26.12.1-linux-x64/bin/npm --version
```

`node --version` printed `v26.12.1`. `npm --version` printed `11.20.0`, which matches the index row. `node -p 'process.versions.v8'` printed `14.6.202.34-node.40`. The index `v8` field is `14.6.202.34`, without the `-node.40` suffix. If you write a version check, use the string the binary prints, not the index field alone. `process.versions.openssl` printed `3.5.9`. I did not run 26.12.0's `process.versions`, so I am not calling that an OpenSSL change in this patch.

`command -v node` still printed `/usr/sbin/node`. That binary still printed `v26.12.0`. Unpacking the tarball does not change the Node on PATH. If you want the new one first in a shell, prepend `node-v26.12.1-linux-x64/bin`. I did not do that, and I did not test a login session.

For 24 or 22, change `VERSION` and the tarball name, then run the same `gpgv` and `shasum` steps. I did not. I did fetch their `SHASUMS256.txt` files without checking the signature. The linux-x64 lines in those files are:

```text
6c172a9ab6718f7b801fb5a7bd486af2ee5e32758086a04b84fcce2aa77095e6  node-v24.22.1-linux-x64.tar.xz
1805bcd35e6815559bd2eb97db438d3fdb0eb3a5e6a977b7c1badca76337e9ce  node-v22.23.4-linux-x64.tar.xz
```

Those are lines in the checksum files. They are not a check against a tarball I downloaded. The index `npm` values for those two rows are 11.19.1 and 10.9.9. I did not run those `npm` binaries.

The previous-releases page names `nvm` as an example of a version manager, and it says recommended methods make new releases available at the same time as the official release. I did not open nvm's docs, and I did not test whether any version manager had these builds. The path I ran is the dist tarball.

## Read the line map before you copy a notable list

The security post is the cross-line map. Each release blog is the notable list for one line. They are not copies of each other. I am not walking through how any of these trigger. The headings below are the page's names and the lines that page says are affected.

High, from that post:

- CVE-2026-105482, `dns.resolve` names containing a NUL, on 26.x, 24.x, and 22.x.
- CVE-2026-105483, TLS hostname check when the IP is written with fullwidth digits, on 26.x and 24.x. Not 22.x.
- CVE-2026-106069, TLS hostname check when the host loosely resolves to an IP, on 26.x, 24.x, and 22.x.
- CVE-2026-111497, Brotli decoder. The heading says an out-of-bounds write permits remote code execution. On 26.x, 24.x, and 22.x.

Medium:

- CVE-2026-105481, a keep-alive socket handling a response written before the request was sent, on all three lines.
- CVE-2026-106072, non-canonical IPv4 hostnames, on all three lines. The security post marks this one medium.
- CVE-2026-106074, `crypto.randomUUID()` and `randomInt()` caches saved into startup snapshots and single executable applications, on all three lines.

Low:

- CVE-2026-106070, ZipFile prefix bytes after a failed header check, on 26.x only.
- CVE-2026-106071, permission-model wildcard lookup, on 26.x only.
- CVE-2026-106073, permission-model bypass with `fs.realpathSync`, on all three lines.

Don't copy the 26.12.1 blog's severity onto CVE-2026-106072. That blog's notable list puts CVE-2026-106069 and CVE-2026-106072 on one line and marks the pair High. The security post splits them: 106069 high, 106072 medium. Use the security post when you need a per-CVE severity. Use the blog when you need that line's notable list.

Don't treat a missing notable line as a missing commit. The 26.12.1 blog notable list does not name CVE-2026-106071. The [GitHub 26.12.1 body](https://github.com/nodejs/node/releases/tag/v26.12.1) does, as Low. The security post does, as low, 26.x only. The blog commit list still has `c273a408c9`, "src: fix the fs permission tree node on wildcard nodes."

The 22.23.4 blog does not list CVE-2026-105483. That matches the security post, which limits that issue to 26.x and 24.x. The [GitHub 22.23.4 notable list](https://github.com/nodejs/node/releases/tag/v22.23.4) also omits it, and it does not print High, Medium, or Low labels. It names CVE-2026-106069 and does not name CVE-2026-106072 on its own line. The 22 blog groups both CVEs on one High line. The 22 commit list includes `d7663560ac`, "tls: reject non-canonical IP addresses." Read the blog and the security post if the GitHub notable list is the only page you have open.

The [GitHub 24.22.1 notable list](https://github.com/nodejs/node/releases/tag/v24.22.1) has the same shape: no severity labels, CVE-2026-105483 is present, CVE-2026-106072 is not on its own line. The 24 blog groups 106069 and 106072 as High and lists 105483 as High.

The security post also names dependency updates, separate from those CVE headings: c-ares on 26.x, 24.x, and 22.x; ca-cert for an eMudhra intermediate CA compromise on the same three lines; OpenSSL on 24.x and 22.x; SQLite on 22.x; Undici on all three. The 24 and 22 blogs say they upgrade OpenSSL sources to openssl-3.5.9. The 22 blog also says sqlite 3.53.4. I did not install those tarballs, so I did not read their `process.versions`. The 26 blog's notable list does not include an OpenSSL upgrade line. That is not a measurement of the binary. The 26.12.1 binary I ran printed OpenSSL 3.5.9, and I did not compare it with 26.12.0.

Several commit links on the blogs point at `nodejs-private/node-private`. I did not open those. I am not treating them as public writeups.

## What this does not show

I did not replace `/usr/sbin/node`. I did not install 24.22.1 or 22.23.4. I did not check every Node binary on this machine. One `node` on PATH is not a service pin, a container image, or a version manager.

I did not test the CVEs, and this is not a reproduction guide. The security post has the headings. The release blogs have the commit lists. If a heading and a notable list disagree, keep both and say which page you are quoting.

The archive page can catch up after this is published. If it does, the check is the same. `node --version` still has to match the major in the filename, `gpgv` still has to print a good signature, and `shasum --check` still has to print OK for the file you downloaded.
