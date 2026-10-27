---
slug: "2026-10-27-select-assisted-not-allow-all"
title: "Select assisted. Do not treat allow-all as the same switch."
excerpt: "Turn on assisted permissions in GitHub Copilot CLI with /permissions, not with an interactive --assisted-approval. Allow-all is a different switch. The enterprise page has two keys, and the first table does not name both."
date: "2026-10-27"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-27-select-assisted-not-allow-all"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "assisted permissions", "enterprise managed settings", "how-to"]
readTime: 9
image: "/images/blog/2026-10-27-select-assisted-not-allow-all-hero.png"
---

When Copilot wants to run a command, open a path, or hit a URL, you can let a model approve the ones it judges safe and still stop the rest. That middle setting is assisted permissions. Select it in an interactive GitHub Copilot CLI session. Do not pass `--allow-all` and call it the same switch.

If you administer Copilot Business or Copilot Enterprise, read two keys. One blocks allow-all. The other blocks assisted. The [changelog](https://github.blog/changelog/2026-10-26-github-copilot-assisted-permissions-generally-available) says assisted permissions are generally available in the CLI, the GitHub Copilot app, and Visual Studio Code. I fetched that page, the [concepts page](https://docs.github.com/en/copilot/concepts/customizations/allowing-safe-commands), and the [enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings) HTML on the morning of 2026-10-27. I did not run the CLI. I did not open Visual Studio Code.

This is not the GPT-6.1 Terra changelog from the same afternoon. It is not yesterday's usage-metrics post.

## Do this in this order

1. In an interactive CLI session, run `/permissions` and select assisted. The concepts page also prints the typed form, `/permissions assisted`, and `/permissions` with no argument, which opens a list. Then run `/permissions show`. The changelog's step is the menu. The show command is how you read the mode you are actually in. I did not run either command.

2. Do not start an interactive session with `--assisted-approval`. The concepts page says that flag is for a non-interactive run, with `-p` or `--prompt`, or when no terminal is attached. If you pass it while starting an interactive session, the CLI exits with an error. The changelog does not mention the flag. For an unattended run, the same page also prints the environment variable `COPILOT_ASSISTED_APPROVAL` set to `true`. I did not set it.

3. If you want new interactive sessions to start this way, set `defaultPermissionMode` to `"assisted"` in `~/.copilot/settings.json`. The concepts page says an administrator's `permissions.defaultMode` takes precedence over that file. If the selected default is unavailable or blocked, the CLI starts with manual approval. If neither you nor an administrator has set a default, the same page says new sessions can start in manual or assisted mode. Do not treat "no default" as "starts in manual." Use `/permissions show`.

4. Do not pass `--allow-all` or `--yolo` and tell yourself that is assisted. The concepts page calls that unconditional approval. It skips the model safety review. `--allow-all` or `--yolo` takes precedence over either default if policy permits it. A separate sentence on that page: `--assisted-approval` takes precedence over `--allow-all-tools`, and it does not change `--allow-all-paths` or `--allow-all-urls`. If you combine `--assisted-approval` with `--allow-all`, path and URL access can still be unrestricted.

5. If you administer, read two keys on the enterprise settings page. `permissions.disableBypassPermissionsMode` set to `"disable"` blocks bypass, which is the allow-all behavior. `permissions.disableAssistedPermissionsMode` set to `true` blocks assisted. The changelog says you can block Allow All while keeping Assisted available, or disable Assisted separately. Those are the two keys. Do not set one and assume you set the other.

6. In the Copilot app, the changelog says open the mode picker, click Tool permissions, then select Assisted. The concepts page says open the mode menu in the prompt box. That menu shows the current mode, such as Interactive, Plan, or Autopilot. Then click Tool permissions and select Assisted. That click applies to the current session and is saved as the default for new local sessions. It does not change other sessions you already have open. To change the default without changing the current session, the same page says open Settings, select Sessions, and choose Assisted under Tool permissions. If you only want the current session, type `/permissions assisted` in the prompt box. Tool permission controls are not available for cloud sessions. I did not open the app.

The concepts page prints this sample for a non-interactive run. I did not run it. It is not a claim that the quoted prompt fixes tests.

```
copilot -p "Fix the failing tests" --assisted-approval
```

## Read the clock, then the two keys

The feed item I fetched is `Mon, 26 Oct 2026 22:31:30 +0000`. The page JSON `datePublished` is `2026-10-26T15:31:30-07:00`. `article:modified_time` and JSON `dateModified` are `2026-10-27T02:53:28+00:00`. The JSON-LD author string is Allison. I did not open a byline page.

This morning's clock, before the write, was `2026-10-27 07:04:29 EDT`. That published UTC timestamp is 12 hours, 32 minutes, and 59 seconds earlier. The modified timestamp is 8 hours, 11 minutes, and 1 second earlier. Both sit inside 48 hours. In Eastern time the modified clock is `2026-10-26T22:53:28-04:00`. That is last night, not a morning edit.

The enterprise HTML I curled, after the bypass heading, says set `disableBypassPermissionsMode` to `"disable"` to turn off bypass mode, and that this setting does not prevent assisted permissions. It does not block `/permissions assisted` or `/allow-all auto`. I am not going to define `/allow-all auto`. The page names it. The sentences I read do not define it.

When bypass is disabled, that HTML says these CLI options have no effect at startup: `--yolo`, `--allow-all`, `--allow-all-tools`, `--allow-all-paths`, and `--allow-all-urls`. The slash commands `/permissions allow-all`, `/allow-all`, and `/yolo` are blocked. In VS Code, the same section says the global auto-approve setting `chat.tools.global.autoApprove` is turned off and cannot be re-enabled. In the Copilot app, sessions cannot use Approve all for Tool permissions, even if a user selects it as their default in Settings > Sessions.

The changelog's label is Allow All. The concepts page's label is unconditional approval. The enterprise HTML's app label is Approve all. Keep all three. Do not hunt for one dropdown that prints all three names.

A later heading in that HTML says set `permissions.disableAssistedPermissionsMode` to `true` to prevent users from enabling assisted permissions, and that this setting does not disable bypass mode. Turning assisted off does not turn allow-all off. Turning allow-all off does not turn assisted off.

`permissions.defaultMode` on that HTML accepts `"manual"`, `"assisted"`, or `"allow-all"`. If the selected mode is unavailable or blocked, the session starts with manual approval. The page says this selects a default, not a locked mode. An explicit permitted choice for a session takes precedence. Resumed sessions keep their saved mode, subject to current policy. In the CLI, this managed default takes precedence over the user's `defaultPermissionMode`.

The supported-keys table in the markdown extract of that URL names `permissions.disableBypassPermissionsMode`. It does not name `permissions.disableAssistedPermissionsMode` or `permissions.defaultMode`. The markdown extract saved from that fetch does not contain the string `disableAssistedPermissionsMode`. The HTML I curled does, after the bypass section. Do not decide Assisted is missing because it is absent from the first table. I am not reading client support off that table. The later prose names the CLI, VS Code, and the Copilot app for the bypass key.

If the CLI does not recognize the value of `disableBypassPermissionsMode`, the enterprise HTML says it logs the problem and enforces `"disable"` as a fail-closed default. The most restrictive value across policy layers wins. A `"disable"` set by any layer cannot be relaxed by a team override. The changelog does not print that fail-closed sentence.

## "Require your approval" is not the whole rule

The changelog says a large language model evaluates the request. Requests classified as clearly safe automatically proceed. Other requests require your approval.

The concepts page does not use "clearly safe." It says if the model is confident the request is safe, Copilot approves it and continues. If the model is not confident, Copilot asks, as it would with manual approval. If a safety review is unavailable or cannot evaluate a request, the request follows the session's normal permission handling. Do not collapse those three outcomes into the changelog's two.

On that same page, existing deny rules still apply. Requests that are already allowed can run without a prompt or a model review. In the CLI, enterprise ask rules for shell commands, file reads, file writes, and URLs can be satisfied by model approval when the request is eligible. Those rules do not always result in a prompt. The changelog's "other requests require your approval" does not say that. Keep both. Deny rules still block.

Assisted permissions does not review other tool calls that enterprise rules require you to approve, or requests to bypass local sandboxing. Those stay on the session's normal handling.

In autopilot mode and non-interactive runs, the concepts page says requests that still require your approval are denied instead. The explanation goes back to Copilot so it can try a different approach. That is not a prompt. If you are running `copilot -p` with `--assisted-approval`, a request the review will not auto-approve does not wait for you.

Copilot selects the model used for the safety review. It can differ from the model you selected for the conversation. If the review model is unavailable, the review can use the session's active model. If you use your own model provider, the review uses the session's active model. The page says the model can make mistakes and approve dangerous or unintended actions, and that this is not a substitute for a sandbox. I did not run a review, so I am not adding a score to that sentence.

One more CLI warning from that page. If assisted permissions cannot be turned on, the CLI writes a warning to standard error. It does not cancel a separate `--allow-all-tools` you also passed. Tool requests may still be approved without a safety review. Check for that warning. I did not see one, because I did not run the command.

## The Visual Studio Code step is a changelog sentence

The changelog says open the permissions picker, then select Assisted permissions. The concepts page names Visual Studio Code in the availability sentence. The HTML I curled for that page contains `Visual Studio Code` and does not contain `permissions picker`. I am not going to invent the menu. The enterprise HTML maps a different VS Code control, `chat.tools.global.autoApprove`, to the bypass disable. I did not open Visual Studio Code, so I cannot tell you those two controls are the same picker.

I also did not find an `ms.date` or `updated_at` meta tag on the concepts page HTML or the enterprise settings HTML. Do not date those two docs pages off a clock I did not fetch.

If a resumed session still asks for every command after you set the managed default to assisted, is that the saved mode, or did the policy block the default? `/permissions show` is the check. I have not seen a live line from it.
