---
slug: "2026-11-02-preview-the-deploy-before-the-endpoint"
title: "Preview the deploy before you change the AI endpoint"
excerpt: "From a project that already deploys, run azd deploy --preview and read the resolved target before you change an AI endpoint. The provision flag is the resource look. The October 30 post names AI endpoints. The reference flag line I opened this morning does not."
date: "2026-11-02"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-02-preview-the-deploy-before-the-endpoint"
categories: ["Microsoft", "Azure", "AI Agents"]
tags: ["Azure Developer CLI", "azd", "AI endpoints", "how-to"]
readTime: 8
image: "/images/blog/2026-11-02-preview-the-deploy-before-the-endpoint-hero.png"
---

If you already ship an app with the command-line tool that takes a project from your machine to Azure, and you're about to change an AI endpoint, look at the resolved target first. Kristen Womack's October 30 post on the [Azure SDK Blog](https://devblogs.microsoft.com/azure-sdk/azure-developer-cli-azd-october-2026/) shows the command for that look, `azd deploy --preview`. Python put the post's `article:published_time`, `2026-10-30T19:02:14+00:00`, at 64.96 hours before 7:00 AM Eastern on November 2. That clock is `2026-11-02 12:00 UTC`. JSON-LD `datePublished` is the same instant. The saved HTML had no `article:modified_time`. Inside a three-day window, outside 48 hours. Treat this as the October command.

The tool's name is the Azure Developer CLI. After this paragraph I'll call it `azd`. By the end you can run the preview, read the target the page actually names, and keep the provision flag on a resource change.

## Run the preview on the project you already deploy

From that project, the post says to inspect deployment operations without deploying, run:

```bash
azd deploy --preview
```

The highlight on the same page is the post's own line: preview service deployment operations with `azd deploy --preview` before making changes. The post covers releases 1.35.0, 1.35.1, 1.36.0, 1.37.0, 1.37.1, and 1.37.2. It lists all six in one sentence.

The hosts on that look, still the post's list: App Service, Container Apps, Functions, Static Web Apps, Azure Kubernetes Service, and AI endpoints. An AI endpoint sits on that list beside five other hosts. Use the flag when you want the service look for the deploy you already have, including the endpoint if your project has one. The post cites [pull request 10204](https://github.com/Azure/azure-dev/pull/10204) on that bullet.

Results describe the resolved Azure target. That's the everyday phrase: where Azure will send this deploy. Structured target and host details are available in JSON output. The post leaves the sample body and the JSON switch unnamed. Stop at the words on the page: resolved Azure target, target, and host.

## Open the reference, then keep the two flags apart

The October 30 post points at the [Azure Developer CLI reference](https://learn.microsoft.com/azure/developer/azure-developer-cli/reference) and labels that pointer October 27. The page I fetched this morning carries a different stamp. HTML meta `ms.date` is `2026-10-20T00:00:00Z`. HTML meta `updated_at` is `2026-10-28T23:04:00Z`. Python put that update at 108.93 hours before the same 7:00 AM Eastern clock, outside the three-day window. The reference is the docs page the October 30 post points at. Treat the October 28 stamp as a second clock.

On the deploy command, `--preview` reads: "Preview changes to services without deploying them."

On the provision command, `--preview` reads: "Preview changes to Azure resources."

The deploy flag is the service look. The provision flag is the resource look. Keep them on separate lines. If the change you care about is the service, including an AI endpoint, stay on `azd deploy --preview`. If the change is the Azure resources themselves, use `azd provision --preview` and read that flag's own sentence.

A search of the extracted reference text found zero matches for `AI endpoint` and zero matches for `Foundry`. The two `endpoint` hits on that extract are sample paths, `myapp.endpoint`, on `azd env config set` and `azd env config unset`. The blog names AI endpoints on the service look. The reference flag line leaves that phrase off. Keep both sentences. Leave "AI endpoints" off the reference sentence when you quote it.

## Leave the version pin off the flag

The six-release sentence never says which release added `--preview`. Run the command. Skip a version claim the page never makes.

A later bullet is for people building extensions. Read-only service-target deployment previews in the extension SDK graduate to stable v1 in 1.37.0, and existing beta routes and source remain compatible. The post credits @Siglud for the initial SDK support. The citations are [pull request 10055](https://github.com/Azure/azure-dev/pull/10055) and [pull request 10628](https://github.com/Azure/azure-dev/pull/10628). That 1.37.0 stamp belongs to the SDK contracts. The CLI flag's release stays unnamed on this page.

The bugs-fixed list has two bullets that both cite [pull request 10181](https://github.com/Azure/azure-dev/pull/10181). One returns an error when a non-interactive extension install can't apply an explicit version pin without confirmation, and keeps file-based extension sources available after a working-directory change. The next says "Improve selected-file validation in the Foundry SDK." Same number, two bullets. Leave both out of the preview steps.

## Try it before the next endpoint change

1. From the project that already deploys, run `azd deploy --preview`.
2. Read the resolved Azure target. If the output is JSON, look for target and host. Stop when the page runs out of field names.
3. If the next command you were about to type is `azd provision --preview`, save it for a resource change and read that flag's sentence on the reference page.

The same section of the October post also covers Azure Container Apps express environments, with `host: containerapp`, citation [#10223](https://github.com/Azure/azure-dev/pull/10223). That path updates an image and says express doesn't support multiple revisions or traffic splitting. Different command story. Leave it for a sitting about express mode.

The October post lists six releases and never names the one that added `--preview`. If a release note you trust names the tag, which tag is it?
