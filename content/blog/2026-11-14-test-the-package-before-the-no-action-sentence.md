---
slug: "2026-11-14-test-the-package-before-the-no-action-sentence"
title: "Test the package before you trust the no-action sentence"
excerpt: "The Foundry on Windows post says most apps can wait. If you wrote your own prompt, a LoRA, or a parser, open aka.ms/tryaion and read the exception first."
date: "2026-11-14"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-14-test-the-package-before-the-no-action-sentence"
categories: ["Microsoft", "Windows AI"]
tags: ["Aion Instruct", "Phi Silica", "Windows AI", "Foundry on Windows", "how-to"]
readTime: 10
image: "/images/blog/2026-11-14-test-the-package-before-the-no-action-sentence-hero.png"
---

If your Windows app wrote its own instructions for the on-device model, open the preview package before you treat the no-action sentence as your case. The model that answers on the PC is changing. The new one is Aion Instruct. The one it replaces is Phi Silica.

By the end you'll sort your app into the wait group or the test group, open the package the blog already links, and keep the November 20 Insider date separate from the package you can open today.

The notes are the [Foundry on Windows post](https://devblogs.microsoft.com/foundry-on-windows/aion-instruct-local-ai-windows-gpu/) by Connor Al-Joundi. The visible date is November 13th, 2026. `article:published_time` and JSON-LD `datePublished` are `2026-11-13T19:10:34+00:00`. `article:modified_time` and JSON-LD `dateModified` are `2026-11-13T23:39:53+00:00`. Python put published 16.90 hours before the clock, modified 12.41 hours before it, and the edit 4.49 hours after publish. The fetch clock is `2026-11-14T12:04:44Z`, from `date -u` this run, 7:04 AM Eastern. `wc -c` on the saved HTML reported 234,941 bytes, HTTP 200. A count of `CP+` in that HTML was 1. A count of `Copilot+` was 0. A count of `8K` was 0. A count of `3.5K` was 2.

## Read the exception first

The opening says Aion Instruct will begin rolling out to CP+ devices through the Windows Insider Program in late November, with full Windows Retail availability targeted for late January. Leave `CP+` as printed. That same HTML never writes `Copilot+`.

Then read the exception, not the comfort line that sits in front of it.

> For most app developers, no action will be required. The change will happen behind the scenes as supported experiences move to Aion Instruct. Action will be required for apps that rely on highly custom prompting (ex. Specific system prompts) and custom LoRAs, as well as apps that have custom model output parsing due to our new watermarking implementation.

A small add-on trained for the old model is a LoRA, once. If you wrote a system prompt, trained one of those, or walk the answer character by character, you are in the action group. The next sentence says apps that are heavily reliant on Phi Silica's specific behavior or output strings should be validated for quality, because output strings and model behavior are different.

The comparison table on that page puts the cells in two columns. Phi Silica is 3.8B parameters and a 3.5K input context length limit. Aion Instruct is 2.3B parameters and a 32K limit. The bullet under the table says an increased input context length limit, from 3.5K to 32K tokens. Keep the table cells and that bullet as the same pair of numbers. The saved HTML has no `8K` to swap in.

A technical report is coming soon to the Microsoft [Command Line blog](https://commandline.microsoft.com/). That href sits in the body sentence. The post does not add a report path after it. Use the package below while you wait for that write-up.

The page says you can tune in next Tuesday to [THR888](https://ignite.microsoft.com/en-US/sessions/THR888) at Ignite 2026, and that a recording will be available. The sentence does not print a calendar date for that Tuesday. Leave the date off your note.

## Open the package today

The blog says Aion Instruct can be validated end to end now with the package at [aka.ms/tryaion](https://aka.ms/tryaion). The Windows Insider Program Beta External build targeted for release on 11/20 will allow full, end to end validation. Those are two windows. The package is the one you can open this morning. The 11/20 line is the Insider build.

HEAD on `https://aka.ms/tryaion` this run returned 301 to `https://github.com/microsoft/Aion-Instruct-Preview-Sample/`. The `Date` header was `Sat, 14 Nov 2026 12:03:19 GMT`. Following that location returned HTTP 200. The raw README at `main` was HTTP 200, 59,310 bytes.

The README's warning says this package is exclusively for developer validation of the new Aion Instruct model stack. End users and customers stay off this build. Do not ship any part of this package to end consumers. The same section says the package contains the final Aion Instruct model planned for release with Windows. The validation package and the final Windows delivery are two packages, on that warning.

The machine line on the README is an ARM64 Snapdragon, x64 Intel Lunar Lake, or x64 AMD Ryzen AI Copilot+ PC running Windows 11. The README writes `Copilot+` five times and `CP+` zero times. Keep that phrase on the sample. The blog's abbreviation stays `CP+`. The README also says there is no CPU fallback when a supported NPU provider is unavailable. If the PC in front of you sits outside that list, `Bootstrap.ps1` is the wrong test for this morning.

The quickstart requires SDK NuGet 1.1.1 and framework 1.1.0.0 or newer, and 1.1.0.2 or newer on AMD. Bootstrap rejects older releases. On a matching PC, the README's clone is:

```powershell
git clone https://github.com/microsoft/Aion-Instruct-Preview-Sample
cd Aion-Instruct-Preview-Sample
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\Bootstrap.ps1
```

Install .NET 9 first if it is missing: `winget install --id Microsoft.DotNet.SDK.9`. The README says `Bootstrap.ps1` checks for Windows App Runtime 2 version `2.0.1.0` or newer and installs it if needed, downloads and installs the matching model framework and SDK NuGet, then builds and launches the chat app. It also says cold NPU cache compilation can take several minutes, and later launches reuse valid caches.

The blog HTML has zero hits for `Bootstrap`, `1.1.1`, and `Foundry Toolkit`. Those names live on the sample and on Learn. Leave them out of the blog's no-action paragraph when you paste a ticket.

## If you wrote the prompt, stay inside the printed knobs

The blog points at the [prompt guide](https://github.com/microsoft/Aion-Instruct-Preview-Sample/blob/main/docs/prompt-guide.md). The raw file was HTTP 200, 26,055 bytes. The commits API for that path returned one commit, `cf14256cc8d363117befbe04ef6d0e80843834ec`, author date `2026-10-11T19:52:49Z`. Python put that 808.20 hours before the same clock. The guide is the prompt reference. The file date is October, separate from the November 13 post.

The guide says the current preview API exposes an optional system prompt through `CreateContext(systemPrompt)`, `Temperature`, `TopP`, and `TopK` through `LanguageModelOptions`, `ContentFilterOptions`, and streamed progress updates plus a final response status. The same paragraph says the preview does not currently expose a maximum generated-token setting, tokenizer-token counts, custom chat-template selection, JSON-schema or regex constrained decoding, or candidate scoring. Treat progress callback counts as updates, not token counts.

The README's API section names different members for the same check. Results no longer expose `TokenCount`, `TimeToFirstToken`, or `DecodeDuration`. The model no longer exposes `GetTokenCount`, `MaxPromptTokenCount`, or `ContextLength`. Measure app-observed timing locally. The current sample pins NuGet 1.1.1. New options default to `Temperature = 0.9f`, `TopP = 0.9f`, and `TopK = 40`. The sample explicitly sets `Temperature = 0.5f` and keeps the other two, because null options are rejected.

Wait for `Complete` before you read the text. This call is the README's, including its sample prompt:

```csharp
using AionInstructPreview.Text;

using var model = await LanguageModel.CreateAsync();
using var context = model.CreateContext();
var options = new LanguageModelOptions { Temperature = 0.5f, TopP = 0.9f, TopK = 40 };
var op = model.GenerateResponseAsync(
    context, "Why are Aion Instruct Preview responses better than scones?", options);
var result = await op;

if (result.Status == LanguageModelResponseStatus.Complete)
{
    Console.WriteLine(result.Text);
}
```

The comment above that sample on the README says a streamed result may still be blocked by a later check. Display `result.Text` only when the terminal status is `Complete`. The guide's `CreateContext(systemPrompt)` overload takes an argument. The snippet above calls `CreateContext()` with none. Pass a system prompt only on the overload the guide names.

## If you parse the answer, expect the watermark to move

Custom output parsing sits in the blog's action sentence because of the new watermarking implementation. The sequence itself is on [Watermarking in Windows AI text APIs](https://learn.microsoft.com/en-us/windows/ai/apis/text-watermarking), HTTP 200 this run. `ms.date` is `2026-10-16T00:00:00Z`. `updated_at` is `2026-10-19T15:33:00Z`. The visible line is Last updated on 2026-10-19. Python put those 708.08 hours and 620.53 hours before the clock. The October page and the November 13 "new watermarking" sentence are two clocks. Use the sequence from Learn. Use the action reason from the blog.

The watermark is the sequence `U+200B U+034F U+2060 U+200B`, in that order. A response can contain zero, one, or multiple copies. The page says watermark locations can vary between responses, the heuristics change over time, so don't rely on a fixed watermark location or assume that every response contains the sequence.

The README adds a paste warning the sequence section does not carry: the watermark may become visible when model output is pasted into certain applications or locations. If your parser splits on spaces and your UI pastes the raw string, check both pages before you call a mismatch a model bug.

## Keep the two calendars apart

The blog's timeline is three rows. October 2026: a standalone package is available at aka.ms/tryaion. November 2026: Aion Instruct is planned to begin rolling out to Windows Insider Preview devices on 11/20. January 2027: Aion Instruct is planned to roll out to retail devices, completing the transition from Phi Silica. A later sentence says removal of the LAF token is targeted for January. LAF stays the blog's abbreviation in that sentence.

[Get started with Phi Silica](https://learn.microsoft.com/en-us/windows/ai/apis/phi-silica) was HTTP 200. `ms.date` is `2026-10-16T00:00:00Z`. `updated_at` is `2026-10-19T15:33:00Z`. Visible last updated is 2026-10-19. Same stamps as the watermark page. Learn's visible date stays October.

Learn's November row has no day. It says Aion Instruct begins rolling out to Windows Insider Preview devices, Phi Silica remains present, and the active model is controlled by a Windows Controlled Feature Rollout (CFR). Developers can test side-by-side via a Windows registry key. The saved HTML has one `registry` hit, and that hit is this sentence. No key path sits in it. Leave the key unnamed.

Learn's January row says Aion Instruct rolls out to retail devices and Phi Silica is removed. The blog's January row says the rollout is planned, and that it completes the transition from Phi Silica. Quote the verb from the page you paste into the ticket.

Learn says, unlike Phi Silica, LAF tokens are no longer needed with Aion Instruct. The older Phi Silica gate on that page is a Limited Access Feature, in the sentence about the unlock token. Keep that expansion on the Phi Silica sentence. The blog's January sentence says removal is targeted for January. The token's absence is Learn's sentence, not the blog's.

LoRA instructions split the same way. Learn says download the package from aka.ms/tryaion, validate Aion Instruct for your app, and re-train your LoRAs using Foundry Toolkit. The README says a LoRA trained for Phi Silica needs a new adapter, and tells you to use Foundry Toolkit to create new custom LoRAs for Aion Instruct. The blog's action sentence names custom LoRAs and has zero `Foundry Toolkit` hits. If the ticket says "re-train," that verb is Learn's. If it says "create new," that verb is the README's.

Feedback on the blog goes to an issue in the [WinAppSDK repo](https://github.com/microsoft/WindowsAppSDK/issues).

If your parser looks for a token count on the result, which name does it read today?
