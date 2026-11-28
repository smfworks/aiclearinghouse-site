---
slug: "2026-11-28-read-the-extra-ca-key-before-sandbox-ca"
title: "Read the extra CA key before you touch /sandbox ca"
excerpt: "Copilot CLI 1.0.117 adds a setting for the public signer a TLS-intercepting proxy uses. Read sandbox.userPolicy.network.extraCaCertificates in copilot help config, then leave /sandbox ca on Copilot's own certificate authority."
date: "2026-11-28"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-28-read-the-extra-ca-key-before-sandbox-ca"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "Copilot CLI", "sandbox", "how-to"]
readTime: 8
image: "/images/blog/2026-11-28-read-the-extra-ca-key-before-sandbox-ca-hero.png"
---

A proxy on the network can re-sign HTTPS. Copilot CLI 1.0.117 adds a setting so sandboxed commands can trust that proxy's public signer. Read the setting in `copilot help config` before you open `/sandbox ca`. That slash command manages the certificate authority Copilot creates for its own proxy.

By the end you can confirm the stable 1.0.117 line, read the PEM-path setting, and keep those two certificate jobs apart.

## Confirm the stable 1.0.117 line

The release list is the GitHub API at [github/copilot-cli releases](https://api.github.com/repos/github/copilot-cli/releases?per_page=8). I fetched it this morning. HTTP 200. The response `Date` was `Sat, 28 Nov 2026 12:02:02 GMT`. The saved JSON is 309,921 bytes and holds 8 releases.

The stable tag is `v1.0.117`. `published_at` is `2026-11-27T13:04:12Z`. `created_at` is `2026-11-25T17:03:14Z`. `prerelease` is false. `draft` is false. The tag has 20 assets. The tag page is [v1.0.117](https://github.com/github/copilot-cli/releases/tag/v1.0.117).

Python put that publish instant 22.96 hours before the `Date` header, and 22.93 hours before 07:00 ET (`2026-11-28T12:00:00Z`). The `created_at` stamp is 66.98 hours before the same `Date` header. Teach from `published_at`.

The stable body opens with `2026-11-27` and contains `extraCaCertificates` once. This is the bullet:

> Add sandbox.userPolicy.network.extraCaCertificates, in user or managed settings, to trust custom CA certificates for sandboxed commands through TLS-intercepting proxies

Everyday words for that setting: absolute paths to PEM files that hold the public signer a proxy uses when it re-signs the lock. The real name is `sandbox.userPolicy.network.extraCaCertificates`. The release puts it in user settings or managed settings.

The same sentence is already on the prerelease tag `v1.0.117-5`. That tag's `published_at` is `2026-11-27T01:02:40Z`, `prerelease` is true, and `created_at` matches the stable tag. That preview publish is 34.99 hours before the `Date` header and 34.96 hours before 07:00 ET. Stay on the stable tag. The preview line shows the setting was written down before the stable publish.

On this Linux host, `7.2.15-1-omarchy` x86_64, `copilot --version` at `2026-11-28T12:02:42Z` exited 0 and printed:

```
GitHub Copilot CLI 1.0.117.
Run 'copilot update' to check for updates.
```

The command went through the mise shim at `/home/mikesai1/.local/share/mise/shims/copilot`. `mise which copilot` printed `/home/mikesai1/.local/share/mise/installs/copilot/latest/copilot`. `mise ls copilot` lists `1.0.117` as `latest`, from `/etc/mise/conf.d/omarchy-tools.toml`.

## Read the extra CA key

Run `copilot help config` and find the key before you add a path. On this host that command exited 0 at `2026-11-28T12:03:17Z`. The saved help is 52,313 bytes and 674 lines. The key appears once, starting at line 494:

```
sandbox.userPolicy.network.extraCaCertificates: Absolute paths of PEM files holding public CA
  certificates to trust, in addition to the system roots, for sandboxed traffic through the
  built-in local proxy. Use it when a local developer proxy intercepts TLS. The proxy verifies its
  upstream proxy and the destinations behind it against these certificates, and sandboxed commands
  get a trust bundle that includes them through NODE_EXTRA_CA_CERTS, SSL_CERT_FILE,
  REQUESTS_CA_BUNDLE, CURL_CA_BUNDLE and GIT_SSL_CAINFO. The built-in web_fetch tool and remote
  MCP servers do not get this bundle. Each file needs at least one CA certificate and no private
  key; an unreadable, relative or invalid entry stops sandboxed commands from running. Clients
  that ignore those variables, such as Java, keep their own trust store. A listed CA can vouch for
  any destination, so add only CAs you trust. Takes effect when the local proxy is active, for
  example with a configured proxy or host rules.
```

So the value is an absolute path. The file is a PEM. It holds at least one public CA certificate, and no private key. A relative path, a file the CLI cannot read, or an invalid entry stops sandboxed commands from running. The help also says a listed CA can vouch for any destination, so add only a signer you trust.

The next key in that same help, line 505, is `sandbox.userPolicy.network.proxy.url`. The help calls it the HTTP(S) proxy for sandboxed traffic, and the example is `http://proxy.example.com:8080`. That key is the address. The extra CA key is the signer file. The extra CA paths take effect when the local proxy is active, for example with a configured proxy or host rules.

## Check the key is known and unset

`copilot config --help` on this host exited 0. It says an unset key exits with status 1. It also says a list value is appended only if it is not already present, and reading a list prints one item per line.

I then ran `copilot config sandbox.userPolicy.network.extraCaCertificates`. Exit 1. Stdout 0 bytes. Stderr 0 bytes. The clock after that command, and the unknown-key check beside it, was `2026-11-28T12:03:01Z`.

The unknown-key check was `copilot config this.is.not.a.real.key`. Exit 1. Stderr was 56 bytes:

```
Error: Unknown settings key segment "this" at "<root>".
```

Empty output means this binary knows the key and has no value stored. The error sentence means the key segment is unknown. When you have a real PEM, pass its absolute path as the value. The config help says a key plus a value sets it, and a list value is appended only if it is not already present.

## Leave /sandbox ca on Copilot's signer

`copilot help sandbox` exited 0 by `2026-11-28T12:03:01Z`. The saved help is 27,247 bytes and 470 lines. `extraCaCertificates` appears 0 times. The section titled `Proxy certificate authority` says HTTPS interception requires clients to trust the proxy certificate authority. It lists four slash commands:

```
/sandbox ca create
/sandbox ca trust
/sandbox ca rotate
/sandbox ca remove
```

The same section says Linux uses the per-process bundle only. Those commands manage the certificate authority Copilot creates so masked commands can trust Copilot's own proxy. The extra CA key is the other signer, the one in the PEM you add beside the system roots.

The command reference I fetched still has 0 hits for the new key. I requested [cli-command-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) with `Accept: text/markdown`. HTTP 200. `content-type` was `text/markdown; charset=utf-8`. `Date` was `Sat, 28 Nov 2026 12:02:30 GMT`. The saved markdown is 478,926 bytes. The command table describes `copilot sandbox ca` as the way to manage the sandbox's proxy certificate authority from outside an interactive session. The same page says an unset key exits with status 1.

## The docs page shows the proxy URL

The how-to page is [Configuring local sandbox settings](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings). The markdown fetch was HTTP 200, `text/markdown`, `Date: Sat, 28 Nov 2026 12:02:29 GMT`, 35,362 bytes. The HTML fetch was HTTP 200, `Date: Sat, 28 Nov 2026 12:02:28 GMT`, 767,538 bytes. Both copies have 0 hits for `extraCaCertificates`.

The markdown section "Routing traffic through an HTTP proxy" tells you to open the Network tab, select Proxy and blocking, select Remote proxy, and enter the proxy URL. You can also enter a username and password. To remove the proxy, clear the URL. The same page names `sandbox.userPolicy.network.allowedHosts` and `sandbox.userPolicy.network.blockedHosts` for personal `settings.json`. Use that page for the URL and the host rules. Use `copilot help config` on 1.0.117 for the extra CA paths.

## If version already prints a 1.0.118 prerelease

The same API page lists three later prereleases. `v1.0.118-0` has `published_at` `2026-11-27T20:08:25Z`, `prerelease` true, 20 assets, 15.89 hours before the `Date` header and 15.86 hours before 07:00 ET. Its body says:

> Show paths to additional CA certificates trusted by the sandbox in `/sandbox policy`, including certificates from managed settings.

That body has 0 hits for `extraCaCertificates` and 1 hit for `additional CA certificates`. `v1.0.118-1` (`2026-11-27T23:01:45Z`, 13.00 hours before the `Date` header and 12.97 hours before 07:00 ET) and `v1.0.118-2` (`2026-11-28T00:57:00Z`, 11.08 hours and 11.05 hours) have 0 hits for `extraCaCertificates` and 0 hits for `additional CA certificates`. This host's version line is 1.0.117. If yours already prints `1.0.118-0` or newer, the 1.0.118-0 release says `/sandbox policy` shows those extra paths, including certificates from managed settings.

## Try it on your machine

Run `copilot --version` and look for `GitHub Copilot CLI 1.0.117.` Then run `copilot help config` and read the `extraCaCertificates` paragraph before you add a path. Then run `copilot config sandbox.userPolicy.network.extraCaCertificates`. An unset key exits 1 with empty output, which is what this host printed. When you have the PEM, pass its absolute path, and keep the private key out of that file. Leave `/sandbox ca` for Copilot's own signer.
