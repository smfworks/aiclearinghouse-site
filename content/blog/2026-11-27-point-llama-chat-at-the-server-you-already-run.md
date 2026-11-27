---
slug: "2026-11-27-point-llama-chat-at-the-server-you-already-run"
title: "Point Llama Chat at the llama-server you already run"
excerpt: "The chat page ships as its own npm package. Pin 0.4.0, serve it on 127.0.0.1:3000, and give llama-server that origin before you send a message."
date: "2026-11-27"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Local AI", "Open Source"]
tags: ["llama.cpp", "llama-chat", "llama-server", "nodejs", "cors"]
readTime: 11
image: "/images/blog/2026-11-27-point-llama-chat-at-the-server-you-already-run.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-27-point-llama-chat-at-the-server-you-already-run"
---

You already have a model answering on a local port, and you want a chat page in the browser. Rebuilding llama.cpp just to get that page is the long way around. By the end of this you will have Llama Chat listening on 127.0.0.1:3000, pointed at the llama-server you already run, with the origin flag set so the browser is allowed to talk to it.

I ran the page half on a Linux box this morning. Node printed `v26.12.0`. The package I pinned was `@ggml-org/llama-chat` 0.4.0. The curls below show the page came up, and that nothing was listening on port 9931.

## Two processes, one chat

[llama.cpp v1.1.0](https://github.com/ggml-org/llama.cpp/releases/tag/v1.1.0) was published 2026-11-26T09:16:47Z, and the GitHub release API marked it `prerelease: false`. The overview says the release includes "a redesigned Llama Chat web UI with voice messages and agent traces." A later bullet says you can "run Llama Chat apart from llama-server, via `npx @ggml-org/llama-chat` or a config URL" ([#32524](https://github.com/ggml-org/llama.cpp/pull/32524), [#32945](https://github.com/ggml-org/llama.cpp/pull/32945)).

The page and the model server are two programs. The [server README at the v1.1.0 tag](https://github.com/ggml-org/llama.cpp/blob/v1.1.0/tools/server/README.md) says a normal start listens on `127.0.0.1:9931`, and the argument table lists `--port` with a default of 9931 and `--host` with a default of `127.0.0.1`. The chat package serves the page. It leaves the model where you already started it.

The README that `npm view @ggml-org/llama-chat readme` returned this morning says the package "serves the prebuilt app as static files on localhost" and "brings no server and no models of its own." It "needs Node.js 20 or later." `npm view @ggml-org/llama-chat engines --json` returned `"node": ">=20"`. `v26.12.0` clears that floor. If your `node --version` prints 18 or older, stop and upgrade Node before you follow the rest.

Pin the package version. `npm view @ggml-org/llama-chat dist-tags --json` returned `latest` as `0.4.0`. `npm view @ggml-org/llama-chat time --json` put that version at `2026-11-27T09:18:45.515Z`, the morning after the v1.1.0 tag. The README frozen in the [v1.1.0 tree](https://github.com/ggml-org/llama.cpp/blob/v1.1.0/ui/apps/chat/README.md) leads with:

```bash
npx @ggml-org/llama-chat --server http://localhost:8080
```

The README `npm view` returned for 0.4.0 leads with a bare `npx @ggml-org/llama-chat`, and the comment on that line says it serves `http://127.0.0.1:3000` for a llama-server on `:9931`. A bare `npx` tomorrow can pick up a newer latest. The steps below are the 0.4.0 I ran, with the version written into the command.

## Start the page on loopback

Ask the package what it will do before you leave it running:

```bash
npx --yes @ggml-org/llama-chat@0.4.0 --help
```

The help text started like this:

```text
Serves Llama Chat on localhost as static files, or, with build, writes them to
a folder for any HTTP server. The browser talks to llama-server directly: name
it with --server, and start it with --cors-origins set to this page's address
when it restricts origins.

  --server <url>   the llama-server the app talks to, e.g. http://localhost:8080
                   (default: port 9931 of the host the page is opened on;
                   for build: the address the app is served on)
  --port <n>       port to listen on (default: 3000)
  --host <addr>    address to listen on, 0.0.0.0 for the LAN (default: 127.0.0.1)
  --open           open the browser once it listens (default)
  --no-open        do not open the browser
```

`npx --yes @ggml-org/llama-chat@0.4.0 --version` printed `0.4.0`.

Then start it without opening a browser, and keep the listen address on loopback:

```bash
npx --yes @ggml-org/llama-chat@0.4.0 --host 127.0.0.1 --port 3000 --no-open
```

The process printed three lines:

```text
Llama Chat 0.4.0 on http://127.0.0.1:3000/
Talking to llama-server on port 9931, pick another with --server
If llama-server restricts origins (tools or MCP on), start it with --cors-origins http://127.0.0.1:3000
```

If your llama-server already lives on another port, pass that URL. The 0.4.0 README's second example is `npx @ggml-org/llama-chat --server http://localhost:8080`. Use the URL you can already curl. The sample port in the tag README is 8080. The default the 0.4.0 process announced is 9931. Those are different servers until you prove otherwise.

`--port 3000` is worth keeping. The help text says the port is fixed "so the origin, and the chats the browser stores under it, stay the same between runs." A new port is a new origin. The browser will treat it as a new site, and the CORS value you set on llama-server will no longer match.

## What came back when I curled it

With that process up, `curl -sI http://127.0.0.1:3000/` returned:

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 13700
Cache-Control: no-cache
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

The body is HTML. The first comment names the Llama Chat README. There is no `<title>` element in that file. The name lives in the manifest: `curl` of `http://127.0.0.1:3000/manifest.webmanifest` returned 200, and the JSON included `"name":"Llama Chat"` and `"description":"Local AI chat interface powered by llama.cpp"`.

The same process leaves the model API alone. `curl -sI http://127.0.0.1:3000/v1/models` returned `HTTP/1.1 404 Not Found` with `Content-Type: text/plain`. That matches the 0.4.0 README line from `npm view`: the CLI "forwards nothing." The browser is supposed to call llama-server itself. A 200 on `/` plus a 404 on `/v1/models` means you started the page, and the CLI left the API alone.

On this machine, `curl` to `http://127.0.0.1:9931/props` failed with `curl: (7) Failed to connect to 127.0.0.1:9931 after 0 ms: Could not connect to server`. `command -v llama-server` printed nothing. The page was serving files. Nothing was listening on the port the process said it would talk to. If you already run llama-server, that is the half you bring. If you do not, the [v1.1.0 server README](https://github.com/ggml-org/llama.cpp/blob/v1.1.0/tools/server/README.md) quick start is:

```bash
./llama-server -m models/7B/ggml-model.gguf -c 2048
```

That page says the command listens on `127.0.0.1:9931`.

There is a second way to place the same files, if you already have a static host. I ran:

```bash
npx --yes @ggml-org/llama-chat@0.4.0 build --out ./out --server http://127.0.0.1:9931
```

It printed `Llama Chat 0.4.0 written to` a folder named `out`, and suggested `npx http-server out`. `out/config.json` was exactly:

```json
{"server":"http://127.0.0.1:9931"}
```

`out/index.html` was 13700 bytes, the same length as the page the CLI served. The 0.4.0 README says the app reads `config.json` on every start, past its caches. `--help` says the build default for `--server` is "the address the app is served on," a different default from the serve command's port 9931. Pass `--server` when you build.

## Let the browser through

A page on `http://127.0.0.1:3000` and an API on `http://127.0.0.1:9931` are different origins. The browser will send the page's origin on the API call. llama-server has to allow it, or the send fails in the console while the HTML still looks fine.

The v1.1.0 server README lists `--cors-origins` with a default of `*`. A special value, `localhost`, "only allow[s] same-origin requests (e.g. the built-in UI)." The same page says enabling `--tools` or `--agent` changes that default to `localhost`, because those flags expose file read and write over the API, and then "only pages served from localhost can reach the server." `--mcp-servers-config` and `--ui-mcp-proxy` carry the same note. The recommended row for a machine on the local network is to set `--cors-origins` to your frontend's origin. The same-machine row says `--cors-origins localhost` once `--agent` is set.

The chat package names a more specific value for this separate page. Both the 0.4.0 README and the process I started say to start llama-server with `--cors-origins http://127.0.0.1:3000` when it restricts origins, "as it does with tools or MCP enabled." Use that full origin. The special value `localhost` is documented with the built-in UI as the example, and the built-in UI is served from the server's own origin. The npm page is a different origin, even when both sit on loopback. `127.0.0.1` and `localhost` are different origins too. If you open `http://localhost:3000/` and the flag says `http://127.0.0.1:3000`, the browser will treat them as two sites.

I had no llama-server here, so I cannot show you the CORS rejection. The docs are what you have until you send a message against your own server. If the page loads and the send fails with a CORS error, the origin flag and the address bar have drifted apart. Match them character for character.

If the server is reachable from the LAN, the 0.4.0 README also says to start it with `--api-key`. Leave Llama Chat's `--host` at `127.0.0.1`. The README shows `--host 0.0.0.0` as the LAN example. [PR #32524](https://github.com/ggml-org/llama.cpp/pull/32524) records why the current CLI does not proxy the API. An earlier draft forwarded every request it had no file for, from loopback. With `--host 0.0.0.0`, a LAN client could reach a llama-server bound to `127.0.0.1` as a local request, tools included, which llama-server on its own refuses without an API key. The merged change serves static files only. The 404 on `/v1/models` is that behavior on 0.4.0. [#32945](https://github.com/ggml-org/llama.cpp/pull/32945) put `--server` back as the URL the page calls. `--help` documents that URL. It is a name for the browser, not a tunnel through the CLI.

The 0.4.0 README says an `http://` page can call an `http://` llama-server on the LAN, and that an `https://` page cannot. Keep both on loopback until you have an API key and an explicit origin. Open the page to the network only after those two are set.

Leave agent features off for this walkthrough. The v1.1.0 server README says Llama Chat stays a plain chat unless the server offers them. `--agent` turns on the CORS proxy and all built-in tools. `--ui-agent` turns agent mode on with browser-side tools only. `--ui-mcp-proxy-allow-private-urls` is in the release notes, and the server README says anyone who can reach that proxy can then reach your local network. Read those flags before you enable them.

## Try it on the server you already have

1. Confirm Node is 20 or newer: `node --version`.
2. Confirm the model server answers, on the port you already use. For the tag default: `curl -sS -m 3 -D - http://127.0.0.1:9931/props -o /dev/null`. A connection failure means start llama-server first. The tag's quick start listens on `127.0.0.1:9931`.
3. If that server was started with tools, MCP, or `--agent`, restart it with `--cors-origins http://127.0.0.1:3000`. If anything off this machine can reach it, add `--api-key` as well.
4. In another terminal: `npx --yes @ggml-org/llama-chat@0.4.0 --host 127.0.0.1 --port 3000 --no-open`. You should see the three lines above, including the port it is talking to. If that port is wrong, stop it and add `--server` with the URL from step 2.
5. Open `http://127.0.0.1:3000/` and send one short prompt whose answer you already know. A page that loads and a reply that matches are the two checks. The files I served prove the first. Your llama-server is what proves the second.

When you are done, stop the page process. It only served static files, and the chats it stored sit in the browser under that origin, not in the package.
