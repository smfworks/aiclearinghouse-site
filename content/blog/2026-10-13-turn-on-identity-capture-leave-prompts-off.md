---
slug: "2026-10-13-turn-on-identity-capture-leave-prompts-off"
title: "Turn on identity capture. Leave the five content classes off."
excerpt: "Put capture.identity true in copilot/managed-settings.json, and leave prompts, responses, toolArguments, toolOutput, and policyDetail false. captureContent does not turn identity on."
date: "2026-10-13"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-13-turn-on-identity-capture-leave-prompts-off"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "enterprise managed settings", "OpenTelemetry", "identity capture"]
readTime: 10
image: "/images/blog/2026-10-13-turn-on-identity-capture-leave-prompts-off-hero.png"
---

If you need the GitHub login on a Copilot trace, turn identity capture on and leave the five content classes off. Do not flip the old `captureContent` switch to get a name. That switch does not turn identity on, and it does turn prompt text on. I did not create a `.github-private` repository, push a `managed-settings.json` file, or point a collector at a live session this morning. The steps below are the ones the October 12 changelog and the managed-settings reference actually print.

The dated primary is [Client telemetry user attribution and configurable capture](https://github.blog/changelog/2026-10-12-client-telemetry-user-attribution-and-configurable-capture). The page says October 12, 2026. Its JSON-LD `datePublished` is `2026-10-12T22:38:00+00:00`, which matches the changelog RSS `pubDate` of Mon, 12 Oct 2026 22:38:00 +0000. `dateModified` and `article:modified_time` are both `2026-10-13T02:43:25+00:00`. I did not diff that edit. Do not collapse the publish clock and the modify clock into one moment. The changelog points at two longer pages: the [enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings) and [Monitor agent usage with OpenTelemetry](https://code.visualstudio.com/docs/agents/guides/monitoring-agents). Neither of those pages printed a last-updated date in the text I fetched. Use the changelog for the October 12 claim. Use the reference for the file and the keys.

## Put the identity object in the enterprise file

Start in the place the getting-started guide names, not in a developer's VS Code settings. [Getting started with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started) says you host `managed-settings.json` in a `.github-private` repository owned by a designated organization in the enterprise. The file path it prints is `copilot/managed-settings.json`. Commit it to the default branch.

That guide calls this a server-managed deployment. Those settings apply to users who receive a Copilot license from the enterprise or any of its organizations, even if they cannot open the repository. It also names mobile device management and local file delivery, and points at a deploy page. I did not open that page.

If the file already exists, add a `telemetry` object. Do not replace the whole file with the short identity snippet later in this post. The getting-started example is a `model` set to `auto`. That example is not a telemetry config. The reference's longer example keeps other keys in the same file. I did not merge a file, so I am not claiming a partial paste is safe. I am saying the pages show `telemetry` as one object among others.

The reference says that when you set the `telemetry` property, Copilot telemetry is sent to the endpoint you specify. Its property list names `enabled`, `endpoint`, and `protocol`. Accepted protocol values are `"http/json"` and `"http/protobuf"`. The longer example uses `"http/protobuf"` and an `https://` collector URL. Use HTTPS if you also send headers. The same page says header values are not included in logs or status output, and that HTTP sends header values in plaintext. The longer example includes an `Authorization` placeholder. I am not repeating that string here. If you need a header, copy it from the reference into your own collector config, and do not commit a real token into a blog or a chat log.

Then set capture the way the changelog describes. `telemetry.capture.identity` is the class that adds `user.name`, `process.user.name`, and `host.name`. It is off by default. The changelog says that account name is currently the GitHub login, and that identity stays separate from the existing pseudonymous user identifier. The reference names the attribute identity does not change: `enduser.pseudo.id`. The table below is the reference's own split. I am not adding a class.

## The short snippet is not a collector config

The reference prints this as the configuration that attributes traces to a user and machine without capturing prompts, responses, tool content, or raw policy details:

```json
{
  "telemetry": {
    "capture": {
      "identity": true
    }
  }
}
```

That is the page's example. I did not apply it. Read it next to the longer example on the same page, which also sets `enabled`, `endpoint`, `protocol`, the five content classes to `false`, `captureContent` to `false`, and `lockCaptureContent` to `true`. The short snippet does not name an endpoint. The property list says telemetry goes to the endpoint you specify. If you need the traces to land somewhere, include `enabled` and `endpoint` from the longer example. Do not treat the four-line snippet as a complete collector config just because it is the attribution example.

Every `capture` sub-property defaults to `false`. The five content classes are `prompts`, `responses`, `toolArguments`, `toolOutput`, and `policyDetail`. The changelog says every capture class is off by default, and that explicit managed values take precedence over local settings, SDK configuration, and environment variables.

Here is what the reference says each class captures. I am not adding a sixth.

| Class | What the reference says it captures |
| --- | --- |
| `identity` | GitHub login as `user.name`, OS account as `process.user.name`, machine name as `host.name`. Does not change `enduser.pseudo.id`. |
| `prompts` | User, system, and developer prompt text and associated model input, including supported attachments, compaction summaries, skill content, and workspace context. |
| `responses` | Assistant response text and supported reasoning content from the top-level agent and subagents. |
| `toolArguments` | Raw tool arguments, commands, denied resources, process names, tool descriptions and schemas, and raw identifiers for MCP servers, plugins, hooks, servers, and tools. |
| `toolOutput` | Tool result content and execution error details from tools, hooks, MCP servers, and subagents. |
| `policyDetail` | Unbounded policy details such as raw sandbox filesystem path arrays. Bounded policy posture, counts, outcomes, and classifications stay available when this is `false`. |

The page's warning is the line to keep next to any of those classes: captured content can include source code, file contents, prompts, commands, tool results, MCP identifiers, and paths to workspaces, user profiles, or files that may contain secrets. Enable only the classes you need, and send them to an approved collector. For a name on the trace, you need `identity`. You do not need the other five.

## Do not use captureContent as the name switch

`captureContent` is the old shorthand. The changelog says it remains available as a legacy shorthand for the five content classes, and that it never enables identity. The reference says the same thing in the property list: it enables or disables `prompts`, `responses`, `toolArguments`, `toolOutput`, and `policyDetail` together, and it does not affect `identity`. An explicitly configured `capture` sub-property takes precedence over `captureContent` for that class.

So if an older file still has `"captureContent": true`, a name will not appear because of that line. Prompt text can. If you want the name and not the text, set `capture.identity` to `true`, set each of the five classes to `false`, and set `captureContent` to `false`. The explicit class values are what the reference says win over the shorthand. I did not test an old file that had the shorthand set to true, so I am not reporting a before-and-after trace. I am reporting the precedence sentence.

`lockCaptureContent` is a different lock. Set it to `true` if you want to stop local settings from enabling a legacy content class unless you explicitly configure that class, or `captureContent`, in the managed `telemetry` object. The reference says this property does not govern identity. A content lock is not an identity lock. If you need identity forced on, or forced off, set `capture.identity` in the managed object. Do not expect `lockCaptureContent` to do that job.

## Check the client before you trust the class

The supported-keys table marks the `telemetry` key supported on Copilot CLI, VS Code, the GitHub Copilot app, and JetBrains IDEs. It marks the same key not supported on Copilot cloud agent. I parsed those cells from the check and x icons on the reference page this morning. Do not plan this file as the way to attribute a cloud agent session. The table says that client does not take the key.

Support for the key is not the same sentence as support for the five classes. The reference says fine-grained capture controls are supported in Copilot CLI, the GitHub Copilot app, and VS Code sessions using Agent Host. It then draws a narrower line for VS Code: the local agent harness supports `capture.identity` and the legacy `captureContent` setting, but it does not independently apply `prompts`, `responses`, `toolArguments`, `toolOutput`, or `policyDetail`. The changelog's availability sentence matches the fine-grained list: Copilot CLI, the GitHub Copilot app, and VS Code sessions using Agent Host. It does not name JetBrains, and it does not name cloud agent.

Do not promote the JetBrains check into a fine-grained promise. The capture-controls paragraph does not say JetBrains applies the five classes independently. Skip Copilot cloud agent for this file. On VS Code, Agent Host is the session type named for the five independent classes. The local harness is the session type named for identity plus the old shorthand. I did not open VS Code, so I did not prove which harness a given window is using. If you cannot tell, do not assume `prompts: false` is the control that is actually applied.

The VS Code monitoring page is a third surface, not a rename of the managed key. It says managed telemetry configuration applies to both the Copilot Chat extension and the agent host process. Separately, it documents `github.copilot.chat.otel.captureIdentity`, default `false`, for Local harness sessions, and the environment variable `COPILOT_OTEL_CAPTURE_IDENTITY`. It says that control is independent of content capture. Content capture there is `github.copilot.chat.otel.captureContent` or `COPILOT_OTEL_CAPTURE_CONTENT`, also default `false`. Those local names are not `telemetry.capture.identity`. Managed `telemetry` values take precedence over local settings, SDK configuration, and environment variables. I did not watch a client ignore a variable. That precedence is the page's rule, not a trace I collected.

## One managed source supplies the whole object

If more than one managed source defines `telemetry`, the reference says the highest-precedence source supplies the complete managed `telemetry` object. Objects from lower-precedence sources are not merged into it. That is a replace, not a field-by-field merge. I did not open the deploy page that ranks server-managed settings, MDM, and a local file, so I am not naming a winner. What I can say is this: do not assume a team file can flip only `identity` while a higher source keeps the endpoint. If a second source defines `telemetry` at all, the page says you get that source's whole object.

The telemetry section does not print the `{ "overridable": ... }` wrapper that the getting-started guide uses for the `model` key. Do not copy the team-override steps from that guide onto `telemetry` unless a page you are looking at says the key is overridable. I did not find that sentence in the telemetry section.

## Validate, then restart or wait

After the file is on the default branch, use the check the getting-started guide prints. For a server-managed deployment, GitHub validates `copilot/managed-settings.json`, `copilot/team-mappings.json`, and any file under `copilot/teams/` that the mapping file references. The review path it gives is: open the enterprise, open AI controls, open the Agents tab, and read Copilot settings validation. Each issue identifies the affected file and the JSON path. Fix the file, commit to the default branch, and reload that Agents page.

Then confirm a supported client actually received it. The same guide says users on a supported client see server-managed settings within about an hour, including the managed-settings file. Restarting the client, or signing in again, triggers an immediate refresh. For an MDM deployment it says clients check hourly. For a file-based deployment it says restart the client to load an updated file. Those last two sentences are about deployment method, not about a collector I ran.

What you should see, if the pages are right and the session is on a client that applies `capture.identity`, is the three attributes on the trace and not the prompt body. What you should not treat as proof is a dashboard that only shows `enduser.pseudo.id`. The reference says identity capture does not change that pseudonymous attribute. A pseudo id was already there. It is not the new name.

If the collector already receives traces, look for `user.name` and for the absence of prompt text. A missing name is a harness question, not a reason to flip `captureContent`. One measurement I do not have: on a VS Code window still on the local agent harness, does managed `capture.identity` show up as `user.name`, or only the local `github.copilot.chat.otel.captureIdentity` setting? The pages separate those controls. They do not print a side-by-side trace.
