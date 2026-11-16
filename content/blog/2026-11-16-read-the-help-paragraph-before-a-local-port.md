---
slug: "2026-11-16-read-the-help-paragraph-before-a-local-port"
title: "Read the help paragraph before you open a local port"
excerpt: "Copilot CLI 1.0.112 puts the local-port rule in copilot help sandbox. The November 13 notes compress it. Read the paragraph before a build client dials a daemon."
date: "2026-11-16"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-16-read-the-help-paragraph-before-a-local-port"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "Copilot CLI", "sandbox", "how-to"]
readTime: 7
image: "/images/blog/2026-11-16-read-the-help-paragraph-before-a-local-port-hero.png"
---

If a build client still cannot reach its daemon after you put localhost on the allow list, read the help paragraph before you open another port. The command is `copilot help sandbox`. The sandbox is the wall around the shell commands the agent runs on your machine.

By the end you will check that the CLI is 1.0.112, find the macOS local-port paragraph, and leave a direct client alone when host rules are on.

## Check the version, then read the notes

On this Linux host, `copilot --version` printed two lines: `GitHub Copilot CLI 1.0.112.` and `Run 'copilot update' to check for updates.` `uname -s` printed `Linux`. `uname -r` printed `7.2.15-1-omarchy`.

The notes for that tag live in the GitHub release API. I requested `https://api.github.com/repos/github/copilot-cli/releases/tags/v1.0.112` and read that JSON. `published_at` is `2026-11-13T23:59:41Z`. `created_at` is `2026-11-13T22:31:15Z`. `draft` is false. `prerelease` is false. The same JSON names `html_url` `https://github.com/github/copilot-cli/releases/tag/v1.0.112`. The body is 11,771 characters.

Python, against `date -u` this run (`2026-11-16T12:07:06Z`, 7:07 AM Eastern), put `published_at` 60.12 hours earlier. Against 07:00 ET (`2026-11-16T12:00:00Z`) it is 60.01 hours earlier. Inside 72 hours, outside 48.

The notes say this:

> `copilot help sandbox` now says that on macOS, sandbox host rules block direct TCP connections to local ports, such as a build client reaching its daemon; localhost stays reachable only through the local proxy, as HTTP or a CONNECT tunnel from a proxy-aware client

Treat that sentence as the map. The help text is the paragraph you follow.

## Run the help command

I ran `copilot help sandbox` on that same Linux host. Exit code 0. The saved output is 19,985 bytes and 355 lines. The macOS paragraph is in that file.

Here it is, with the file's line breaks:

> On macOS, sandboxed commands can open direct TCP connections to local
> ports, such as a build daemon or a test server they started, only while
> outbound connections are also allowed and no host rules (`allowedHosts`
> or `blockedHosts`) apply. Under host rules, localhost is reachable only
> through the local proxy, as an HTTP request or a CONNECT tunnel from a
> proxy-aware client. A client that connects to the port directly, as a
> Gradle client does to its daemon, is refused even when localhost is in
> `allowedHosts`. Run `/sandbox policy` to see the effective loopback
> access.

The string `Gradle` appears twice in that file. One hit is this daemon sentence. The other is a cache list: go-build, ccache, sccache, Gradle. Follow the daemon sentence when you are deciding whether a client can open a port.

The notes say host rules block direct TCP, and localhost stays reachable only through the local proxy. The paragraph adds the condition. Direct TCP is allowed only while outbound connections are also allowed and no host rules apply. Under host rules, a client that dials the port itself is refused even when localhost is already in `allowedHosts`.

So the move, if you are on macOS and host rules are set, is to stop retrying that direct client. Use a proxy-aware client. That means a client that can send an HTTP request, or open a CONNECT tunnel, through the local proxy. The local proxy is the small forwarder on your machine. A client that dials the port itself skips that forwarder.

Then run `/sandbox policy` and read the effective loopback line before you edit the allow list again. The help text is the page that tells you to run that command.

The setting name, once: `userPolicy.network.allowLocalNetwork`. Host rules are `allowedHosts` and `blockedHosts`.

## Read the docs after the help text

The help text ends with `https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes`. A request to that URL this run returned HTTP 301. The `location` header was `/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes`. The markdown for that current path returned HTTP 200, `content-type: text/markdown; charset=utf-8`, 13,155 bytes, 122 lines. The HTML title is "About local sandboxing for GitHub Copilot - GitHub Docs." The saved markdown has no date line. Use it for the sentences below. The November 13 news is the release.

Under Proxy support, that page says on macOS and Linux the sandbox restricts outbound connections to the local proxy, and programs that ignore proxy settings cannot connect directly instead. A count of `Gradle` in that markdown is 0. A count of `allowLocalNetwork` is 0. A count of `direct TCP` is 0. The page does not print the "only while no host rules apply" condition. That condition lives in the help text.

It does print a Linux sentence the macOS paragraph leaves out. On Linux, bubblewrap cannot control local network access independently for spawned processes, including shell commands and local MCP or LSP servers. The local network setting still applies to in-process operations, such as web requests and remote MCP connections, in both the CLI and the app. The phrase `bubblewrap cannot` appears once.

If you are on Linux, follow that sentence. Keep the macOS direct-TCP condition on macOS. This host is Linux. The macOS paragraph was still in the help text here. The Linux rule for spawned processes is on the concepts page.

## Check the default cell, then the policy

The configuration directory page tells you to run the same help command. Its tip says: run `copilot help sandbox` for the full sandbox reference, including supported hosts and all `sandbox` settings keys. I fetched `https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md`. HTTP 200, `text/markdown`, 247,250 bytes, 1,053 lines. The HTML title is "GitHub Copilot CLI configuration directory - GitHub Docs."

The table cell for `sandbox.userPolicy.network.allowLocalNetwork` lists the default as `false`. The cell says it controls host-local access, such as connections to local development servers, and that the effect on sandboxed commands depends on the operating system. On supported Windows hosts, enabling this setting also allows connections to the host's localhost. Older Windows versions keep localhost blocked even with this setting enabled. Windows proxying and host rules require this to be `true`.

In the help text, the same key is "allow connections to host loopback," and the next line is "On by default." That phrase appears once in the 355-line help file. It appears zero times in the configuration markdown.

Run `/sandbox policy` and read the effective loopback line on your machine before you flip the setting to match a cell. The table cell and the help line do not use the same default words. The help text is the one that tells you to look at the policy.

The same configuration page says, in one sentence for macOS and Linux, that the sandbox restricts direct connections so programs cannot avoid the proxy. A count of `Gradle` there is 0. A count of `direct TCP` is 0. A few lines above the table, the `allowedHosts` cell says a non-empty list blocks unmatched destinations, except for `localhost`, `127.0.0.1`, and `::1` when outbound and local network access are both enabled. Those automatic entries do not change your saved list.

Read that exception as a list rule. Read the help paragraph as the rule for a client that dials the port itself. Seeing localhost on the allow list, or seeing it added automatically, still leaves a direct client refused when host rules apply. The help text says that refusal holds even when localhost is in `allowedHosts`.

## Try this before the next build

1. Run `copilot --version`. The paragraph above is what 1.0.112 printed here.
2. Run `copilot help sandbox` and find the `allowLocalNetwork` paragraph.
3. On macOS, with host rules set, use a proxy-aware client for the local daemon. Leave the client that opens the port itself.
4. On Linux, read the bubblewrap sentence on the concepts page before you treat the macOS paragraph as your rule.
5. Run `/sandbox policy` and read the effective loopback line before you change the allow list.

The configuration page's tip is the same first move: run `copilot help sandbox` for the full reference.

If you run `/sandbox policy` with a host rule set, does the effective loopback line match the help paragraph, or the configuration table's `false` cell?
