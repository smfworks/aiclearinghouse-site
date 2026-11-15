---
slug: "2026-11-15-sign-in-on-github-com-before-the-server"
title: "Sign in on GitHub.com before you add the company server"
excerpt: "The Copilot app wants a GitHub.com or GHE.com sign-in before you add a company GitHub server. The November 13 changelog puts that order in app 1.2.0."
date: "2026-11-15"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-15-sign-in-on-github-com-before-the-server"
categories: ["Microsoft", "GitHub Copilot"]
tags: ["GitHub Copilot", "GitHub Enterprise Server", "Copilot app", "how-to"]
readTime: 6
image: "/images/blog/2026-11-15-sign-in-on-github-com-before-the-server-hero.png"
---

If the repositories you work on live on your company's own GitHub server, sign in on GitHub.com or GHE.com before you add that server. The app calls the company server GitHub Enterprise Server. The short name on the changelog is GHES.

By the end you'll do the public sign-in first, add the server from Settings, and keep the version floor on the changelog.

## Start with the public account

The source is the [GitHub Changelog post](https://github.blog/changelog/2026-11-13-github-enterprise-server-support-in-the-github-copilot-app/) from November 13, 2026, "GitHub Enterprise Server support in the GitHub Copilot app." A request to that URL this run returned 301 to the same path with a trailing slash, then HTTP 200. The saved HTML is 95,866 bytes. JSON-LD `datePublished` is `2026-11-13T10:27:13-08:00` and also `2026-11-13T18:27:13+00:00`. Those two strings are the same instant. `dateModified` and `article:modified_time` are `2026-11-13T18:43:56+00:00`. The saved HTML has no `article:published_time` meta tag. The visible time element is `datetime="2026-11-13"`, and the text reads November 13, 2026. The changelog feed item with that title has `pubDate` `Fri, 13 Nov 2026 18:27:13 +0000` and creator `Allison`. That pubDate matches the UTC form of `datePublished`.

Python put published 41.64 hours before the clock `2026-11-15T12:05:22Z`, from `date -u` this run, 7:05 AM Eastern. Modified was 41.36 hours before that clock. The edit is 16.72 minutes after publish. Against 07:00 ET (`2026-11-15T12:00:00Z`) the published stamp is 41.55 hours earlier, still inside 48 hours.

The page says you can now bring your work on GitHub Enterprise Server into the GitHub Copilot app. Add your GHES account to work with remote repositories, issues, and pull requests. This feature was previously an opt-in preview, and is now generally available.

Then the order. You'll need to sign in with a GitHub.com or GHE.com account first. Then go to Settings, Accounts, Add account, and choose GitHub Enterprise Server. The HTML writes those four labels in strong tags, with `>` between them, and the verb on the last one is choose.

Available in GitHub Copilot app 1.2.0 and later. Cloud sessions aren't available for GHES. The apostrophe in that second sentence is `&rsquo;` in the saved HTML. A count of `1.2.0` in the changelog HTML was 1. A count of `Cloud sessions` was 1. A count of `already` was 0.

## Use the docs page for the gear and the browser

The changelog's learn-more link prints `https://docs.github.com/enterprise-server@latest/copilot/copilot-on-ghes/sign-in-on-copilot-app`. Opening that URL this run returned 302 to `/en/enterprise-server@3.22/copilot/copilot-on-ghes/sign-in-on-copilot-app`, then HTTP 200. The page title is "Signing in to GitHub Enterprise Server in the GitHub Copilot app - GitHub Enterprise Server 3.22 Docs." The saved file is 63,572 bytes. The 3.22 in that title is the docs set `@latest` opened this morning. The article body does not print a minimum server version.

The article says if you use GitHub Enterprise Server, you can sign in on the Copilot app to work with repositories, pull requests, and issues hosted on the GitHub Enterprise Server instance. When you set up the app, you must first sign in to an account on GitHub.com or GHE.com. Then you can add your GitHub Enterprise Server account.

The click list is an ordered list. The first item includes a gear icon whose accessible name is Settings, then the words "to open the Settings dialog." After that:

1. In the sidebar, click Accounts.
2. Click Add account, then click GitHub Enterprise Server.
3. Follow the prompts to open your browser and authorize the app.

The changelog leaves the browser step off. The docs article prints it. A count of `authorize the app` in the docs HTML was 3. A count of `1.2.0` in the article body was 0. A count of `Cloud sessions` in the docs HTML was 0. A count of `preview` in the article body was 0. A count of `generally` in the article body was 0. Leave the version floor, the cloud-session sentence, and the generally-available sentence on the changelog.

## Keep a cloud license if you want requests to run

The docs next-step sentence says that to start making requests, ensure you're also signed in to a cloud account with a Copilot license. The alternative on that page is to configure your own model provider. The link text is "Adding LLM models to the GitHub Copilot app." Those clicks are a different path. Stay on the sign-in page for this morning.

## Try the order today

If the Copilot app on your machine is 1.2.0 or later, sign in on GitHub.com or GHE.com first. Open the gear labeled Settings. In the sidebar, click Accounts, then Add account, then GitHub Enterprise Server, and authorize the app in the browser. After that, keep a cloud account with a Copilot license signed in on the same app if you want requests to run. The changelog already says cloud sessions aren't available for that server account.

Neither saved page contains the word `already`. The changelog says the feature was an opt-in preview and is now generally available, and it does not print a second path for an account left over from that preview.

If your server account is already listed from the preview, does Add account still offer GitHub Enterprise Server, or does the app only show that choice on a new install?
