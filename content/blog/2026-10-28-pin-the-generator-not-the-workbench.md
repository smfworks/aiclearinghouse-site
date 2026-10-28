---
slug: "2026-10-28-pin-the-generator-not-the-workbench"
title: "Pin 1.24.0. Do not treat the Workbench as the agent test."
excerpt: "Install the SharePoint Framework 1.24.0 generator, not the preview tag, before you scaffold a Copilot UX component. The Workbench checks the picture. It does not check whether Copilot will find the agent."
date: "2026-10-28"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-28-pin-the-generator-not-the-workbench"
categories: ["Microsoft", "Microsoft 365", "Copilot"]
tags: ["Copilot UX components", "SharePoint Framework", "SPFx 1.24", "how-to"]
readTime: 9
image: "/images/blog/2026-10-28-pin-the-generator-not-the-workbench-hero.png"
---

If you want a panel inside Copilot that a person can actually click, pin the generator at 1.24.0 and leave the preview tag alone. Then look at the panel on your own machine. Do not stop there and call the agent done.

Copilot UX components are generally available with SharePoint Framework 1.24. I fetched the [Microsoft 365 Developer Blog](https://devblogs.microsoft.com/microsoft365dev/copilot-ux-components-are-generally-available-bring-interactive-experiences-into-copilot/) this morning. Its `article:published_time` is `2026-10-28T10:55:44+00:00` and its `article:modified_time` is `2026-10-28T10:59:09+00:00`. The byline on that page is Vesa Juvonen. I also fetched the [overview](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/overview-copilot-apps), the [tutorial](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/get-started/build-your-first-copilot-app), the [1.24 release notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.24.0), and the [setup page](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment). Those four Learn pages carry `ms.date` `2026-10-28T00:00:00Z` and `updated_at` `2026-10-28T10:43:00Z`. I ran `npm view @microsoft/generator-sharepoint version dist-tags --json`. I did not scaffold a project, open a tenant, or click Allow.

Earlier material may call this SharePoint Copilot Apps or Copilot Components. The blog says the current name is Copilot UX components. A June post on this site used the old name. Do not follow that post as today's install path.

## Do this in this order

1. Install a supported Node.js, then pin the generator. The setup page says to install the latest available Node.js 24 LTS. That is the recommended baseline for a new SPFx 1.24 environment. The same page says SPFx 1.24 also supports Node.js 22 at 22.14.0 or later in the 22.x line, and Node.js 26. The release notes say the same three lines, and they add that Node.js 26 is a Current release, not an LTS release. Do not start on 26 because it is newer. The blog's 1.24 list names Node.js 24 and Node.js 26. It does not name Node.js 22 in that list. If you are already on 22.14.0 or later, the setup page and the release notes are the pages that say you can stay.

2. Pin `1.24.0`. Do not install `@next`. The release notes print this:

```
npm install @microsoft/generator-sharepoint@1.24.0 --global
```

They also print `@latest` as the other door, then say that at SPFx 1.24 GA, `@latest` selects `1.24.0`. The tag advances with later public releases. Keep the `1.24.0` pin when you want this release's setup again. The blog's four steps print only `@latest`. This morning's `npm view` returned `latest` `1.24.0` and `next` `1.24.0-rc.0`. So `@latest` matched the pin at the moment I checked, and `@next` was still the release candidate. Do not install `@next` and call it GA.

3. Install Heft and Yeoman in the same breath if you are following the setup page. That page's one line is `npm install @rushstack/heft yo @microsoft/generator-sharepoint@1.24.0 --global`. The blog does not print Heft or Yeoman. The tutorial's later commands are `yo @microsoft/sharepoint`, `heft start`, `heft build`, and `heft package-solution`. If you only run the blog's generator install, those commands have nothing to call. I did not run the install.

4. If the project was created on a 1.24 beta or release candidate, update its SPFx package references to `1.24.0` before you call the deploy production. The release notes say that. The blog says to update something built on the 1.24 preview releases to the GA version. I did not open a `package.json`.

5. Put a Copilot add-on license on the account you will test with, including the Workbench. The overview calls it a USL, a user-specific license: the Microsoft 365 Copilot add-on on top of the user's normal E3, E5, or E7 license. A base license alone is not enough. The same requirement applies to development and testing, including Copilot Workbench. Users without the add-on cannot use the component experience. The blog says users need a Microsoft Copilot add-on license to use the components in Copilot, and that components do not render without the license. You will see a message explaining the license requirement. The blog does not name E3, E5, or E7, and it does not say the Workbench needs the license. Do not drop the SKU line because the blog left it out. Do not invent the wording of that message. I did not see it.

6. The component itself is not a consumption meter. The blog says using Copilot UX components does not itself incur consumption-based charges. If a component calls a consumption-based API, such as Work IQ, charges for that API may apply. The overview says the components do not fall under a consumption-based plan and have no consumption-based charges. APIs or services called inside an implementation can have their own charges. Consumption billing is not an alternative to the required user license. The overview does not name Work IQ. Keep Work IQ as the blog's example.

7. Scaffold, then test the picture in the Workbench. The tutorial's prompts are solution name, component type Copilot Component, component name, and template. The overview's three starters are Minimal, No framework, and React. The blog lists the same three. React is not a requirement. New React solutions use React 18.3.1 on the release notes. The blog says React 18.x. I did not run `yo`, so I did not see the prompt text myself.

8. The Workbench is not the agent test. The overview says run `heft start --nobrowser`, then open `/_layouts/15/copilotworkbench.aspx` on any site in the tenant. That lets you iterate on rendering, display modes, and tool parameters from localhost. The next sentence: Workbench testing does not validate agent discovery or intent matching. Test those in a deployed agent. The blog's fourth step is deploy the package and surface it in Copilot. Do not treat a Workbench pass as that step.

9. Package, then sync once. The tutorial's commands are `heft build --production` and `heft package-solution --production`. For the sample name `my-copilot-app`, the package is `./sharepoint/solution/my-copilot-app.sppkg`. Upload it to Apps for SharePoint. Enable this app and add it to all sites is on by default, and the tutorial says that option is required for the Copilot integration. Then select Add to Teams. That button performs the initial Sync to Teams and deploys the baseline agent. Deployment can take time. There can be a delay before the agent shows up in the all-agents list. The tutorial says installing the agent from the Microsoft 365 admin center can speed that up. I did not upload a package.

10. Force the first call, then click Allow. If you left the default tool name, the tutorial says to enter `Call MyCopilotAppTool`. That is a reliable way to make the tool run, because the scaffold does not explain the use case. Once you write a real description and a conversation starter, Copilot can call the tool from what the person asked. The first time the tool is accessed, select Allow. The prompt might appear a few times before the panel renders. I did not click it.

11. Tell Copilot what is on the panel. Rendering the component does not automatically tell Copilot what the person sees. The overview says to use `createCopilotTextContent` for the current view, values, filters, and selection. The GA limit for that text is 10 KB. Text over the limit blocks sending the message. It is not silently cut down.

## After the first sync

Rebuild, package, and redeploy when component code or tool definitions change. You do not need another sync if the baseline agent configuration has not changed. Changes to the image, title, instructions, or starter prompts do require another sync. That split is on the overview.

Dynamic tool discovery caches tool definitions for a few minutes, so a new function can take a few minutes to show up after you deploy an updated `.sppkg`. UX changes are available immediately, because the component code is served from the App Catalog site collection. Allow for the cache, then test the updated tool in a new conversation.

The number in `copilot/manifest.json` is the app version. The schema version, such as `v1.8` in `declarativeAgent.json`, is a different field. Do not bump the schema version as a deploy counter.

## What this release does not include

Do not promise a phone. iOS and Android, including Teams mobile, are not supported at GA. The overview says responsive UI and mobile-related SDK types do not establish mobile support.

Do not promise Cowork, and do not promise a component that appears in ordinary Copilot chat without switching to an agent. The overview lists standard-chat plug-in packaging, Cowork, and other additional surfaces as not GA. The blog lists mobile, the new plug-in model, Cowork, and additional Copilot surfaces under planned next. The overview says a fix for the combined-solution sync, and mobile support, are planned as fast follows, and that no delivery dates are committed. The blog says SPFx 1.25 is planned for December 2026 or January 2027. Those are not the same clock. Do not hang the 1.25 window on the phone.

SharePoint Store support starts with SPFx 1.24 GA, including Store solutions that add these components. The overview says that does not imply independent distribution through the Teams Store.

If you also add SPFx Teams functionality to the same solution, automatic Sync to Teams has a mismatch at GA. The workaround on the tutorial and the overview is a manually created Teams package. That is a packaging limit, not a ban on sharing the UI code across hosts. I did not build that package.

The blog's closing suggestion is to pick one task people already ask Copilot about and still finish in another app. A time-off request, an expense approval, or a check of the sales numbers. Make that the first component, with the data and the confirm button in the conversation. That is the job. The Workbench is where you look at the button. The deployed agent is where you find out whether Copilot calls it.

If the discovery cache is a few minutes, how are you telling a tester that the new tool is late, rather than missing?
