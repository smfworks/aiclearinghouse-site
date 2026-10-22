---
slug: "2026-10-22-prepare-the-models-before-the-question"
title: "Prepare the models before the question. Let Kotlin keep the number."
excerpt: "Kalaivanan's October 20 Foundry Local walkthrough downloads two catalog packages in setup, calculates the maximum in Kotlin, and lets the optional chat call pick card IDs. Pin 0.1.6. Do not call that pin a this-week release."
date: "2026-10-22"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-22-prepare-the-models-before-the-question"
categories: ["Microsoft", "AI Agents"]
tags: ["Foundry Local", "Android", "on-device", "Microsoft Foundry", "voice"]
readTime: 11
image: "/images/blog/2026-10-22-prepare-the-models-before-the-question-hero.png"
---

Prepare the models before the question. Let Kotlin keep the number. If you add the optional recap, make the chat call pick card IDs. Do not start the download inside the question handler, and do not hand a heart-rate maximum to the language model.

That order is in [Kalaivanan's October 20 walkthrough](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/building-an-on-device-voice-companion-with-foundry-local/4563553) of an on-device Android sample called Ami. I fetched that post, the [v0.1.6 IPC and embedded modes note](https://github.com/microsoft/FoundryLocalAndroid/blob/v0.1.6/docs/IPC_AND_EMBEDDED_MODES.md), and the [Foundry Local for Android 0.1.6 release](https://github.com/microsoft/FoundryLocalAndroid/releases/tag/v0.1.6) this morning. This host's clock was 2026-10-22 07:00 EDT. I did not clone the sample repo, download the AAR, open Google Play, install the service app, run the phone, or watch the recording.

The records are fictional. You do not need a watch, a health account, or anyone's personal data to reproduce the walkthrough. The screenshots come from the app running on a Motorola g35. That phone is the author's test device. The 153 beats per minute figure below is the author's screenshot. It is not a measurement from this run, and it is not a medical finding.

## Keep the clocks apart

The byline displays Oct 20, 2026. Its title attribute is "October 20, 2026 at 7:00 AM". That string has no timezone. The page cache `postTime` is `2026-10-20T07:00:00.089-07:00`. The conversation `lastPostTime` and `lastPostingActivityTime` use that same stamp. JSON-LD `datePublished` is `10/20/2026, 2:00:00 PM`, and that string also has no timezone. Do not merge the 7:00 AM title with the `-07:00` postTime. Do not merge either of them with the 2:00 PM JSON-LD string.

The footer says Updated Oct 13, 2026. Its title attribute is "October 13, 2026 at 1:00 PM". The page is Version 1.0. `article:modified_time` is `2026-10-13T13:00:56.435-07:00`. That modified stamp is earlier than `postTime`. Do not write the walkthrough as if it was last edited on October 20. Do not write the October 13 footer as the publish date.

The SDK pin is older than both. The GitHub release `published_at` is `2026-09-02T17:37:42Z`. Pinning 0.1.6 is what the walkthrough does. It is not a this-week release.

## Use IPC for this sample

The walkthrough says there are two Android deployment options. IPC mode talks to the separately installed Foundry Local service app. Embedded mode packages the runtime inside the application. Both use the same Kotlin API. Their installation and process boundaries differ. Everything shown in the post uses IPC.

Do not treat embedded mode as the same install. The v0.1.6 note says IPC mode requires the Foundry Local service app from Google Play. It also says IPC mode depends on a compatible service-app installation. Handle disconnections and reacquire catalog, model, and client handles after reconnecting. Model files are not shared across client apps. Orchestration maintains an isolated copy for each app.

The release notes say the service app is distributed through Google Play and is not attached to this GitHub release. I did not open the Play listing. Do not invent a Play URL or a service-app version from this article.

The release notes also say, for most apps, use IPC mode to keep the client APK small. That sentence is on the release page. It is not a sentence in the walkthrough. Keep them on the pages that printed them.

| Concern | IPC, from the v0.1.6 note | Embedded, from the same note |
|---|---|---|
| Runtime process | Foundry Local service app | Your app |
| Companion app | Required | Not required |
| Model cache | Service-managed and isolated per client app | App-managed |
| Connection loss | Possible; reconnect | Not applicable |
| Runtime updates | Delivered with the service app | Require shipping a new app build |

The shared calls on that page are `FoundryLocalManager.create(...)`, `getCatalog()`, `listModels()`, `getModel(...)`, `download()`, `load()`, `unload()`, `removeFromCache()`, `createChatClient()`, and `createAudioClient()`. The walkthrough's snippets use that surface. I did not compile them.

## Pin 0.1.6. Then name the packages the post tested

The walkthrough pinned the Android SDK to 0.1.6 and used two packages from the device catalog. Both ran through the CPU execution provider on the test phone.

| Job in the post | Catalog identifier the post prints |
|---|---|
| Transcribe a spoken question | `openai-whisper-tiny-generic-cpu:4` |
| Select calculated facts for an optional recap | `qwen2.5-0.5b-instruct-generic-cpu:4` |

Their combined advertised download size was 953 MB. The post's own sentence has to travel with those identifiers: "These are the packages tested for this walkthrough, not a requirement to use the same models in every application." Do not write them as a Microsoft default. Do not rank them above another catalog package. I did not open the device catalog.

The release page says this is the first public release of Foundry Local for Android. Minimum API level is 33, which it glosses as Android 13. Target API level is 36. The walkthrough says the app requires Android 13 or newer, and that the recorded demo runs on Android 16. Keep the Android 13 sentence on both pages. The Android 16 sentence is only the demo phone.

The release prints this SHA-256 for `foundry-local-ipc-sdk-0.1.6.aar`:

`7dc74260d2dbd16c2c3c02bcd9de1d852bb89366f71a63ea9813fe764c2665c1`

The walkthrough says the project checks the AAR's checksum before building. I did not download the AAR, and I did not recompute that hash. Recompute it yourself before you trust the file.

## Download in setup

The download step the post prints is:

```kotlin
val audioModel = catalog.getModel("openai-whisper-tiny-generic-cpu:4")
if (!audioModel.isCached()) {
    audioModel.download(timeoutMinutes = 10)
}
check(audioModel.isCached())
```

The post says this belongs in setup, not in the question handler. Someone asking about their week should not unexpectedly start a large download. Ami's Prepare models action prepares both packages, shows progress, checks the download budget, and requires the app to be in the foreground on unmetered Wi-Fi.

Check the handle's cache state before you enable inference. Downloading a model in another app does not establish that it is ready for Ami. A green download in some other client is not this app's cache.

The manager snippet sets `appName` to `"Ami"`, `disableTelemetry` to `true`, and `logLevel` to `"Error"`. Then it calls `checkCompatibility()` and requires `isCompatible` before `getCatalog()` and `listModels()`. `listModels()` shows what the catalog offers. `getModel()` gives a handle for a selected model. The snippets omit the surrounding UI. The post says a disconnect means a new manager and new model handles. A finished model is unloaded with `unload()`, and manager cleanup calls `close()`. I did not read `FoundryRuntime.kt` beyond those snippets.

Before you tap Talk, follow the post's setup order. Leave Ami in Synthetic demo mode. Open Privacy, then Prepare models, and let setup finish on unmetered Wi-Fi. Open Talk, choose an installed offline voice under Voice & pace, then tap Talk to Ami. Android asks for microphone permission when you use that feature. Health permissions are not needed for the sample conversation. Play a sample conversation runs a bundled audio fixture through transcription without the microphone.

The build lines the post prints, and that I did not run, are JDK 17, Gradle 8.13, PowerShell 7.4 or newer, and Android SDK 36. The clone block uses sample `C:\tools\...` paths and says to substitute your installed JDK, Gradle, and AAR paths. Do not publish those paths as your machine. There is no npm install and no Docker container. I did not run the script, install the debug APK, or start `dev.daylight.local/.MainActivity`.

The questions the post names are "When was my heart rate highest last month?" and "How did my sleep change this week?" Do not attribute a different question to the sample.

## Transcribe on the phone

Whisper is on the voice path. The spoken reply comes from an installed offline Android text-to-speech voice. The chat package is used only when the user requests the optional recap. The post says there is no hosted speech endpoint in this flow. I did not find a hosted speech URL in the saved post text. Do not add one.

The transcription call sets `language` to `"en"` and `temperature` to `0.0f`. `filePath` is the local recording. `ShortRecorder.kt` has a 20-second limit and explicit Done and Cancel controls. A short trailing pause can finish the turn too. Ami deletes the temporary microphone file after the turn or cancellation.

Keep the transcript visible. The post puts Edit heard question beside it. A wrong date in a question about records can change the answer. That correction step is part of the interface the author kept.

Voice & pace offers Warm, Clear, and Unhurried. Those adjust how the Android voice speaks. They are not separate Foundry models. `LocalSpeaker.kt` checks `isNetworkConnectionRequired()`, installation, and language before using a voice. After a spoken question, Ami can speak the answer automatically. A typed question stays quiet.

The recording notes say the question was played from a laptop speaker into the phone's microphone, and that the laptop does not run the models or calculate the answer. Sound starts at 0:11. I did not watch the recording.

## Calculate the number in Kotlin

Once the question is text, the app resolves the date range and calculates the result. For "When was my heart rate highest last month?", the post says it selects the previous calendar month, finds the highest available sample, and keeps its timestamp and time zone.

The screenshot answer is 153 beats per minute, recorded on August 10, 2026, with readings on only one of the month's 31 days. A maximum over one observed day is not a complete account of the month. The post treats "high" as a request for the highest recorded sample, not a medical judgment. It does not invent a cause when asked "Why?" Do not write a health finding from that number.

This is where the author chose ordinary Kotlin rather than asking the language model to do the arithmetic. `HeartRateQueries.kt` resolves the supported questions. `HeartRateAnalysis.kt` calculates the result. The answer text is assembled from those results. Sleep and activity questions work from the records actually present. The model is not responsible for a maximum or a calendar boundary. If you move the maximum into the chat call, you have left the walkthrough.

## If you add the recap, make the model pick card IDs

The voice flow already works without a chat model. Recap my week is a separate path. Before the call, the app calculates fact cards for the available activity, sleep, and workout records. Each card has an ID, its calculated text, and coverage information. With the user's confirmation, Ami passes the derived summaries through Foundry Local's chat API.

The call loads `qwen2.5-0.5b-instruct-generic-cpu:4` only after `isCached()` is true. It sets `temperature` to `0.0f`, `maxTokens` to `32`, and `topP` to `1.0f`. The prompt asks for two card IDs, such as `[1,2]`, rather than new health advice. `DebriefOrganizer.kt` accepts only a valid selection and renders the original calculated text. Extra prose, duplicate IDs, and unknown cards are rejected. The app can display a clearly labelled computed recap instead.

The model chooses which facts to show. The app has already calculated the numbers. Do not put that model on the voice path. Do not let it write the measurement. The post says a short reply is a better fit for this model. That is the author's judgment about the recap call, not a ranking of catalog packages.

## "Local" is the question path

You still need connectivity to acquire the models. The post says "Local" describes how Ami processes a question, not a claim that every application on the phone has stopped using the network. SDK telemetry is disabled in the manager configuration. The app has no cloud speech or inference fallback. The offline voice must be installed before you use it.

In the voice flow, Whisper receives the recording and application code handles the records. In the optional recap, the chat model receives derived fact cards after confirmation. The post says both calls execute through the Foundry Local service on the phone, and that neither sends that content to a cloud model. Personalization here is the records as context. It is not fine-tuning. I did not add a record and ask.

The repository includes a read-only Health Connect reader. This walkthrough uses the supplied fictional records and points at a build-guide section for the optional integration. I did not extract that section. Do not fill in pairing steps from this article.

## Sources

- [Building an On-Device Voice Companion with Foundry Local](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/building-an-on-device-voice-companion-with-foundry-local/4563553), Kalaivanan, Microsoft Foundry Blog. Byline title "October 20, 2026 at 7:00 AM". `postTime` `2026-10-20T07:00:00.089-07:00`. Footer Updated Oct 13, 2026, Version 1.0.
- [IPC and embedded deployment modes](https://github.com/microsoft/FoundryLocalAndroid/blob/v0.1.6/docs/IPC_AND_EMBEDDED_MODES.md), tag `v0.1.6`.
- [Foundry Local for Android 0.1.6](https://github.com/microsoft/FoundryLocalAndroid/releases/tag/v0.1.6). GitHub API `published_at` `2026-09-02T17:37:42Z`.

If you recompute the IPC AAR hash and it does not match the release line, which check fails first on your machine: the sample's pre-build checksum, or the service-app compatibility check you still have to handle after a reconnect?
