---
slug: "2026-10-29-select-the-harness-when-you-create-the-agent"
title: "Select the harness when you create the agent"
excerpt: "If you want Foundry to run the loop, pick the Microsoft Copilot harness while you create the prompt agent. A later version of the same name will not flip that choice."
date: "2026-10-29"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-29-select-the-harness-when-you-create-the-agent"
categories: ["Microsoft", "Azure", "AI Agents"]
tags: ["Microsoft Foundry", "Copilot harness", "Foundry Agent Service", "how-to"]
readTime: 9
image: "/images/blog/2026-10-29-select-the-harness-when-you-create-the-agent-hero.png"
---

If you want Foundry to run the loop around the model, pick the harness while you create the agent. Do that on a new prompt agent. A later save, and a new version of the same name, leave the old runtime where it was.

The harness is the machinery around the model: the loop, the files, and the tools. Microsoft calls that machinery the Microsoft Copilot harness. On a Foundry prompt agent you set `harness.type` to `microsoft_copilot_preview`. The resource stays a prompt agent, and you still call it through the Responses API.

I fetched the [Foundry blog](https://devblogs.microsoft.com/foundry/microsoft-copilot-harness-in-foundry) this morning. The page says October 28th, 2026. `article:published_time` is `2026-10-28T16:45:06+00:00` and `article:modified_time` is `2026-10-28T16:45:41+00:00`. The [official Microsoft blog](https://blogs.microsoft.com/blog/2026/10/28/introducing-the-microsoft-copilot-harness-unlocking-the-potential-of-truly-multi-model-agentic-work) on the same announcement has `article:published_time` `2026-10-28T16:51:35+00:00`. The [Learn how-to](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/use-tools-skills-copilot-harness) carries `ms.date` `2026-10-26T00:00:00Z` and `updated_at` `2026-10-28T16:29:00Z`. The [limits page](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions#microsoft-copilot-harness-preview) and the [web research quickstart](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/create-web-research-agent) carry `ms.date` `2026-10-25T00:00:00Z` and the same `updated_at`.

Follow the how-to for the clicks and the YAML. Use the limits page for the region list. Use the quickstart when you want a sample that deploys a web research agent. The official blog is the company announcement. It is not the procedure.

## Pick the door, then the region

The Foundry blog prints three rows, and they are not the same job.

Use a prompt agent without the harness when instructions and supported tools are enough. Use a prompt agent with the harness when you want skills, managed execution, files, subagents, and more complex tool coordination without owning the loop. Use a hosted agent when you need to bring your own framework, loop, middleware, dependencies, or runtime behavior.

If you want the middle row, create a new prompt agent and select the harness then. If you want the third row, that is a hosted agent. The resilience page is not the switch. More on that below, because the same Foundry post announces both.

Region next. Under the heading "Microsoft Copilot harness (preview)", the limits page lists nine regions: Australia East, Canada Central, Central US, Germany West Central, Japan East, Sweden Central, UK South, West Europe, and West US. Canada Central is on that list, and it is the region in the quickstart sample, `azd env set AZURE_LOCATION canadacentral`. East US is on the general agents table later on the same page. The nine-name harness sentence does not include it. Use the nine-name list.

The blog's limits link ends in `#github-copilot-harness-for-prompt-agents-preview`. The id on the limits HTML I saved is `microsoft-copilot-harness-preview`. Open the heading. The blog fragment is a different string.

## Create it with the harness already set

Portal path, from the how-to. These steps are for the new Foundry experience, not Foundry (classic).

1. Open [Microsoft Foundry](https://ai.azure.com/nextgen). Turn the New Foundry toggle on. Pick a project in one of the nine regions.
2. Under Build an agent, select Create an agent.
3. Enter a unique name.
4. Leave interaction mode on Text.
5. Select Use the Microsoft Copilot harness.
6. Select Create.

After you change the model, the instructions, a tool, or a skill, select Save and start new chat. Wait for the new active version before you test it.

CLI path. In this shell, and again in every new shell or CI job:

```
export AZD_ALPHA_ENABLE_AGENTS_MANAGED_HARNESS=true
```

The how-to floor is `azd` 1.37.0 or later, and the `azure.ai.agents` extension at `1.0.0-beta.22` or later. The quickstart also names `azure.ai.projects` `1.0.0-beta.15` or later and `azure.ai.skills` `1.0.0-beta.9` or later. Those two extra floors are on the quickstart. The how-to prerequisite block does not print them. If you are following the quickstart, pin all three. If you are following only the how-to, leave the extra floors on the quickstart.

Initialize a new prompt agent, then add the harness field to the generated `azure.yaml` agent service. Keep the project, model, and name the init command already wrote.

```
harness:
  type: microsoft_copilot_preview
```

Deploy with the how-to's commands. Do not mash them up with the blog sample.

```
azd up --no-prompt
azd ai agent show --output json
```

Read that JSON before you add tools. You want the agent active, `kind: prompt`, and `harness.type` set to `microsoft_copilot_preview`.

The blog sample uses `azd deploy --all`, then `azd ai agent invoke`. The how-to create section uses `azd up --no-prompt`, then `azd ai agent show`. The quickstart invoke adds `--new-conversation`. Three pages, three commands. Don't glue them into one line.

If you create from the Python sample on the how-to, set the harness on the definition when you call `create_version`, and pass `allow_preview=True` on the client. The package floor on that page is `azure-ai-projects>=2.9.0`. The C# sample on the same page also passes `foundryFeatures: "MicrosoftCopilot=V1Preview"`. The Python block does not print that feature string. Use the sample for the language you are calling. The how-to also has TypeScript and Java samples.

## A new version is not the switch

The how-to says you select the harness during agent creation and can't switch an existing agent during the initial public preview. The next sentence is the one to remember: creating another agent version doesn't change the harness. The selection is fixed for that agent during this preview.

The quickstart says deploying with an existing agent name creates another version of that agent. Pair the two sentences. A same-name deploy is a new version. A new version does not change the harness.

The Foundry blog says the same door in different words. Select the Microsoft Copilot harness when creating the agent. Existing agents are unchanged. Switching the harness after creation isn't supported yet.

If the project is older than the preview, the how-to troubleshooting line is to create a new prompt agent rather than change an existing agent's harness.

The how-to also prints the preview banner. Microsoft doesn't recommend this preview for production workloads, and it is provided without a service-level agreement. The quickstart prints that banner too. The Foundry blog says public preview. It does not print the not-for-production sentence. Keep both. The official blog HTML I saved does not contain the words "public preview."

## Leave the other sentences on their own pages

Bring your own model is not bring your own key. The how-to says bring your own model (BYOM) isn't currently supported with the Copilot harness. The limits table says Not supported. The official blog says the harness is built to perform across model families, "with 20+ frontier models plus bring your own key." It does not print the string BYOM. Leave "bring your own key" on that page.

The official blog's "without switching the harness" line is about picking a model. It is not the Learn rule that you cannot switch the harness on an existing agent.

Foundry Memory is Not supported on the limits page. That limitation does not affect conversation history, or files in the conversation's harness workspace. Don't attach Foundry Memory and call the harness done. The Foundry blog text I saved does not say Foundry Memory is unsupported. The limits page does.

`require_approval` is for customer MCP tools. During this preview, the service manages the approval policy for the built-in harness tools. The how-to names those built-ins: file system read, file system write, shell, web, and subagents. New agents have all five enabled unless you configure the toolset. Shell is the broad one. Disabling file read, file write, or web while leaving shell enabled is not a strict security boundary. A separately declared shell or Code Interpreter tool is independent of those harness tool settings.

The blog sample declares `type: code_interpreter` next to `type: web_search`. The Learn HTML I saved has no `code_interpreter` string. Don't copy that type onto a sentence you source only from Learn.

Web search and the harness Web tool are different rows. The how-to says Foundry web search goes on the prompt agent definition directly, without a project connection. The built-in Web tool fetches content from a URL. The portal label for that built-in is Web. When the quickstart tells you to confirm Harness tools, Web search, and the skill, that is three rows.

The sandbox is a workbench, not a filing cabinet. The how-to says a sandbox isn't a customer-managed resource or a durable output store. Put files you need to keep in Foundry Files, or in another durable service. A new conversation starts with separate history and a separate workspace. CPU, memory, and lifecycle settings aren't customer-configurable on the limits page. The blog says Foundry manages CPU, memory, and idle settings. Same direction. Don't add a knob neither page names.

Skills, from the limits table: up to 50 top-level skill references. Names are lowercase letters, digits, and hyphens, at most 64 characters. `strict: true` isn't supported on function tools.

On the agent definition, don't set `temperature`, `top_p`, `tool_choice`, `text.format`, or `text.verbosity`. On the response request, don't set `max_output_tokens`, `store: false`, or `previous_response_id`. The limits page has a longer request-field list, including `max_tool_calls` and `parallel_tool_calls`. Unsupported fields return an error. They are not ignored. The how-to says omit `store` or set it to `true`, and continue in the same conversation.

If the agent has to call a toolbox, or return generated files, the how-to says the agent's `instance_identity.principal_id` needs the Foundry User role on the same project. That assignment is separate from your user role, and it can be made only after the agent exists.

## Price is on the blog. Resilience is the other door.

Say the price from the Foundry blog, not from Learn. Harness runtime usage is free before December 1, 2026. Model inference, and separately billed tools and connected services, still charge. Starting December 1, sandbox compute and memory are billed at USD `$0.0994` per vCPU-hour and `$0.0118` per GiB-hour. Prices may vary by region and agreement. The how-to, the limits page, the quickstart, and the official blog HTML I saved this morning have zero hits for `0.0994`.

Long-running resilience is the other announcement on that same Foundry post. The blog says it is generally available this week, and it links the [Learn resilience page](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/long-running-agent-resilience). That page still titles itself "Resilience for long-running Microsoft Foundry hosted agents (preview)." Its `ms.date` is `2026-07-30T00:00:00Z` and its `updated_at` is `2026-09-10T22:09:00Z`. The HTML I saved has zero hits for "generally available." Don't treat "GA" as settled from the blog sentence alone, and don't use that page to change the harness. A hosted agent is the path when you bring your own framework. The blog's line there is that conversation history alone isn't enough to restore work in progress. Your code saves the checkpoint.

## The check

Run `azd ai agent show --output json` before you add tools. If `harness.type` is not `microsoft_copilot_preview`, you are looking at a prompt agent that still has the default runtime. Create a new one. Don't deploy over the old name and call that a switch.

When you run that show command, does `harness.type` already say `microsoft_copilot_preview`, or are you still on the default runtime?
