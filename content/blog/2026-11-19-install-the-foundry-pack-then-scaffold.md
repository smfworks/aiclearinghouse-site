---
slug: "2026-11-19-install-the-foundry-pack-then-scaffold"
title: "Install the Foundry pack, then scaffold the agent"
excerpt: "The Foundry Dev Pack is generally available. Install it for your OS, then scaffold. The docs page calls the same pack Foundry DevPack, and the version floors sit on different pages."
date: "2026-11-19"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-19-install-the-foundry-pack-then-scaffold"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "Foundry Dev Pack", "Azure Developer CLI", "how-to"]
readTime: 8
image: "/images/blog/2026-11-19-install-the-foundry-pack-then-scaffold-hero.png"
---

Install the Foundry pack for your operating system. Then scaffold the agent into an empty folder, and read `azure.yaml` before you provision anything.

The blog calls that pack the Foundry Dev Pack and says it is generally available. The docs page the short link opens calls it Foundry DevPack and prints the same three install commands. The generally available sentence is on the blog. The August and October stamps on the docs page are docs clocks.

By the end you will have the command for your OS, the version floors that sit above the scaffold sample, and a place to leave the November 5 CLI bundle.

## Install for your operating system

The page is [The Foundry Dev Pack is here: build Foundry agents your way](https://devblogs.microsoft.com/foundry/the-foundry-dev-pack-is-here-build-foundry-agents-your-way), by Rong Lu. I fetched that URL this morning. The first response was HTTP 301 to the trailing-slash URL, then HTTP 200. The Date header was `Thu, 19 Nov 2026 12:01:18 GMT`. The saved HTML is 257,591 bytes.

The meta `article:published_time` is `2026-11-18T17:00:39+00:00`. The graph JSON-LD `datePublished` is the same instant. The author name in that JSON-LD is Rong Lu. The visible byline label is Principal Product Manager. The author description on the same page says Principal Program Manager. Keep both titles.

A search of that HTML found zero `article:modified_time`. The Foundry feed item for this title is `Wed, 18 Nov 2026 17:00:39 +0000`, the same instant as `datePublished`. I saved that feed at the same fetch. It is 220,255 bytes and ten items. This post is third. The newest item is the hosted-agents Ignite post, `Wed, 18 Nov 2026 17:00:54 +0000`, fifteen seconds later. The install commands are on this page. That is the how-to.

Python, against the fetch clock `2026-11-19T12:01:18Z` (7:01 AM Eastern), put that publish instant 19.01 hours earlier. Against 07:00 ET (`2026-11-19T12:00:00Z`) the age is 18.99 hours. Inside 48 hours.

The blog says the Foundry Dev Pack (`aka.ms/foundrydevpack`) is now generally available. A search of the saved HTML found 14 hits for `Foundry Dev Pack` and one hit for `generally available`.

`aka.ms/foundrydevpack` returned 301 to `https://learn.microsoft.com/azure/foundry/how-to/develop/install-cli-sdk`, then 302 to the `/en-us/` path, then 200. The Date header was the same minute, `Thu, 19 Nov 2026 12:01:18 GMT`. The saved HTML is 59,257 bytes. A markdown request, with `Accept: text/markdown`, returned HTTP 200 and 8,606 bytes, 188 lines. The page title is Prepare your development environment. The heading in that markdown is Install Foundry DevPack.

The markdown frontmatter `ms.date` is `2026-08-18T00:00:00Z`. `updated_at` is `2026-10-19T22:12:00Z`. Python puts those 2,244.02 hours and 733.82 hours before the same fetch clock, and 2,244.0 and 733.8 hours before 07:00 ET. Both sit outside 72 hours. Those stamps are the clocks in the file I saved. The generally available sentence stays on the blog.

A search of the Learn HTML found zero `Foundry Dev Pack`, six `Foundry DevPack`, and zero `generally available`. The markdown copy has five `Foundry DevPack` and the same two zeros. Read the name on the page you have open.

The three commands match.

Windows, on both pages:

```powershell
winget install Microsoft.FoundryDevPack
```

macOS:

```bash
brew install --cask microsoft/foundry/devpack && foundry-devpack install
```

Linux:

```bash
curl -fsSL https://aka.ms/foundry-devpack-install.sh | bash
```

The blog says the pack combines the Foundry CLI (`azd ai`) and Microsoft Foundry Skill, and installs the Foundry Toolkit for VS Code and the Foundry plugin for the GitHub Copilot app when those apps are present. The Learn sentence says DevPack installs its core tools and adds host extensions only when their apps are present. The next Learn sentence says DevPack doesn't install Visual Studio Code or GitHub Copilot App. The blog's get-started list says the toolkit comes when VS Code is installed, and the plugin comes when the GitHub Copilot app is installed. Same condition, two wordings. Keep them apart.

The blog's install list calls that Copilot-app piece the Foundry plugin, and it says Microsoft Foundry Canvas opens a guided experience inside the GitHub Copilot app. The Learn table calls that slot Foundry Canvas (preview), installed only when GitHub Copilot App is present. A search of the Learn HTML found zero `Foundry plugin`. A search of the blog HTML found four `Foundry plugin` and six `GitHub Copilot app`. The Learn markdown has three `GitHub Copilot App`, capital A. Leave the capitalization on the page that printed it.

The Linux short link, checked with headers only at `Thu, 19 Nov 2026 12:03:21 GMT`, returned HTTP 301 to `https://github.com/microsoft/foundry-dev-tools/releases/download/devpack-installer-0.1.6/foundry-devpack.sh`. The GitHub release API for that tag returned the name Foundry DevPack Installer 0.1.6, `published_at` `2026-11-11T06:44:54Z`, not a draft, not a prerelease. Python puts that publish instant 197.31 hours before the redirect clock and 197.25 hours before 07:00 ET. Outside 72 hours. The generally available sentence is the November 18 blog. The installer tag is an older release the short link still points at. The same API lists `foundry-devpack-linux-x64` among the assets. This host is `Linux 7.2.15-1-omarchy x86_64`. The script body stays on that release.

## Scaffold after the version floors

The inner loop is on the blog, in the Foundry CLI section. Before the sample, it says install Azure Developer CLI 1.37.0 or later, a current `uv` release, and Python 3.13 or later. Then it shows this:

```bash
azd auth login

# Scaffold the sample into an empty folder, then review the source and azure.yaml
azd ai agent init \
  --template https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml \
  --deploy-mode code \
  --src .

# Confirm tenant, subscription, project, region, model, and quota
azd provision

# Run and invoke locally
azd ai agent run
azd ai agent invoke --local "Write a haiku about deploying cloud applications."

# Deploy from the same project
azd deploy
```

That 1.37.0 floor is the sentence above the sample. A search of the Learn HTML and the Learn markdown found zero `1.37.0`, zero `azd ai agent init`, and zero `azd auth login`. Leave the scaffold on the blog.

The language section on Learn says install Python 3.10 or later, and that Python 3.10 is the minimum supported version. A search of that markdown found three `Python 3.10` hits and zero `Python 3.13`. The sample floor stays on the blog. The language floor stays on Learn.

On this host, at `2026-11-19T12:03:21Z`, `python3 --version` printed `Python 3.14.9`. `uv --version` printed `uv 0.13.9 (x86_64-unknown-linux-gnu)`. `azd version` returned `command not found`. `uname -srm` printed `Linux 7.2.15-1-omarchy x86_64`. Python on this machine is already past both floors the pages name. The blog asks for a current `uv` release and leaves the version number off that sentence. `azd` is the missing command here, which is what the pack is for.

After those lines, the blog says `azd ai agent monitor --follow` streams logs, `azd ai agent doctor` diagnoses setup and permission issues, and `azd pipeline config` sets up GitHub Actions or Azure DevOps. Those three sit in the paragraph under the sample. The comment above `azd provision` is the review: tenant, subscription, project, region, model, and quota.

The Learn troubleshooting row for a missing command says close and reopen the terminal, and restart Visual Studio Code so PATH changes take effect. That row is the check after the install, on the docs page.

## Leave the November 5 bundle on the older post

The blog says the pack builds on a November 5 milestone: the Foundry CLI reached general availability. That sentence is the older ship. The November 6 post already walks the 1.0 bundle, `azd ext install microsoft.foundry`, and a local invoke before deploy. Today's door is the pack.

The same Learn page has a section, Install developer tools separately. It prints:

```bash
azd ext install microsoft.foundry
```

That is the other door, for when you skip the pack. A search of the blog HTML found one `November 5` and zero `azd ext install`. Leave the bundle command on the Learn separate-tools section, and leave the local-run walkthrough on the November 6 post.

## Try it on your OS

Run the command for your operating system. If Visual Studio Code or the GitHub Copilot app is already installed, the toolkit or the plugin comes along, on the wording of the page you followed. If those apps are absent, the Learn page says DevPack doesn't install them.

Then open a new terminal. On this machine, `azd version` is still the missing command until that install actually runs. When it prints 1.37.0 or later, scaffold into an empty folder, read `azure.yaml`, and confirm tenant, subscription, project, region, model, and quota before `azd provision`.

The GitHub Changelog feed I saved this morning, 50,232 bytes, opens with an audit-log item, `Thu, 19 Nov 2026 08:27:16 +0000`. That title is an audit-log post. The commands above are the install.

After the Linux script, what does `azd version` print against that 1.37.0 floor?
