---
slug: "2026-11-11-set-postrefinement-leave-the-stereo-sample"
title: "Set PostRefinement. Leave the stereo sample on the blog"
excerpt: "A live call that switches languages needs the PostRefinement property and an empty language config. The code block under the November 10 Get started line reads stereo.wav and turns on multichannel processing."
date: "2026-11-11"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-11-set-postrefinement-leave-the-stereo-sample"
categories: ["Microsoft", "Azure Speech"]
tags: ["Azure Speech", "Foundry", "PostRefinement", "multilingual transcription", "how-to"]
readTime: 10
image: "/images/blog/2026-11-11-set-postrefinement-leave-the-stereo-sample-hero.png"
---

You opened the November 10 Foundry post because a live call switches languages and you want the transcript to follow. The code block under Get started reads a stereo file and turns on multichannel processing. The switch that starts multilingual refinement is a property on the speech config, and the Learn page is the one that prints it.

By the end you'll install Speech SDK 1.50 or later, set `SpeechServiceResponse_PostProcessingOption` to `PostRefinement`, pass an empty `AutoDetectSourceLanguageConfig()` in Python, and keep any phrase list inside 200 phrases and 3,200 characters.

The page is [Native real-time multilingual transcription is now generally available, and faster](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/native-real-time-multilingual-transcription-is-now-generally-available-and-faste/4569665), by JanGoergen. The visible byline is Nov 10, 2026. The time tooltip says November 10, 2026 at 6:00 AM. `postTime` is `2026-11-10T06:00:00.137-08:00`. Python put that stamp 22.06 hours before 7:03 AM Eastern on November 11. That clock is `2026-11-11T12:03:27Z`, from `date` this run. `article:modified_time` and `lastEditTime` are `2026-11-04T10:40:25.493-08:00`, 161.38 hours before the same clock. The body was last edited before it was published. `revisionNum` is 10. `latestVersion` is major 1, minor 0. JSON-LD `datePublished` is `11/10/2026, 2:00:00 PM` with no timezone. JSON-LD `dateModified` is `11/4/2026, 6:40:25 PM` with no timezone. The footer says Updated Nov 04, 2026, Version 1.0.

The Foundry Tech Community feed I saved this morning does not contain post id `4569665`. Its newest item is still [Foundry Toolbox Lifecycle: Deploy and Promote](https://techcommunity.microsoft.com/t5/microsoft-foundry-blog/foundry-toolbox-lifecycle-deploy-and-promote/ba-p/4570665), `Mon, 09 Nov 2026 20:00:00 GMT`. Use `postTime` for the page clock. The feed has not listed this post yet.

The blog's documentation link lands on [How to recognize speech](https://learn.microsoft.com/azure/ai-services/speech-service/how-to-recognize-speech#multilingual-post-stream-refinement), at the multilingual post-stream refinement heading. I opened that page the same morning. `ms.date` is `2026-10-28T00:00:00Z`. `updated_at` is `2026-11-01T11:04:00Z`. Python put that update 240.99 hours before the same clock. The property and the Python constructor live there. The November 10 counts for locales, milliseconds, and regions live on the blog.

## Set the property the Learn page prints

A live transcript that can change language mid-call is a different job from splitting a stereo file into a left channel and a right channel. The real name is multilingual post-stream refinement in Azure Speech, part of Microsoft Foundry.

JanGoergen's post says multilingual post-stream refinement is generally available. The new engine runs on an LLM Speech streaming model, instead of waiting for a separate second pass. Final results typically arrive in around 100 milliseconds. That "typically" is the page's word.

Partial results drive live captions and voice-agent turn-taking. Final results feed storage, analytics, search, summarization, and downstream AI. In preview, the feature paired a real-time recognizer with a second, non-streaming recognition pass. Accuracy improved, and applications waited for that second pass before the refined final arrived. The GA engine runs inside the real-time service, so the refined final arrives without that extra wait.

Install Speech SDK 1.50 or later before you try the multilingual path. The blog's Get started sentence says to enable post-stream refinement with open-range language detection, and that multilingual post-stream refinement requires Speech SDK 1.50 or later. The Learn page adds a second clause: it is available through the Speech SDK only. Keep that clause on the Learn page.

On Learn, set `SpeechServiceResponse_PostProcessingOption` to `PostRefinement`, then pass an `AutoDetectSourceLanguageConfig` configured for automatic language detection when you create the recognizer. The prose says you don't set a language identification mode or provide a candidate language list. The comparison table says the language-configuration row is open-range automatic language detection without a candidate language list.

The Python block prints this:

```python
speech_config.set_property(
    speechsdk.PropertyId.SpeechServiceResponse_PostProcessingOption,
    "PostRefinement"
)

auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig()

recognizer = speechsdk.SpeechRecognizer(
    speech_config=speech_config,
    auto_detect_source_language_config=auto_detect_source_language_config,
    audio_config=audio_config)
```

The C++ block on the same page calls `AutoDetectSourceLanguageConfig::FromOpenRange()`. C# uses `FromOpenRange()`. Java and JavaScript use `fromOpenRange()`. Go uses `NewAutoDetectSourceLanguageConfigFromOpenRange()`. I searched the saved Learn HTML for `from_open_range`. The count was zero. Use the empty Python constructor the page prints.

`PostRefinement` and `TrueText` are separate values of the same property. Only one value can be set at a time. The page also says this path works best for longer utterances, such as conversations, meetings, and dictation. For a very short phrase, the refined result might match the standard result. An Important box says some locales might not show significant quality gains, and results can differ from what you see with standard recognition.

## Leave the stereo sample where you found it

The code block under the blog's Get started sentence sets `ENABLE_LID = False`. It sets `Speech_EnableMultiChannelProcessing` to `"true"`. When that flag is true, the sample builds `AutoDetectSourceLanguageConfig` with `languages=["en-US", "es-MX"]`. Otherwise it sets `speech_recognition_language` to `"en-US"`. The audio filename is `stereo.wav`. The callback prints a channel label. That block is the multichannel sample. For a first multilingual session, use the Learn property above.

If you already use multilingual post-stream refinement, the blog says you get the new engine with no code changes, and that this update applies to real-time speech to text through the Speech SDK. That sentence is for a session that already has the feature on. A first session still sets the property.

## Stay inside 200 phrases and 3,200 characters

Phrase lists were the most requested capability from the preview, the blog says. Each list can have up to 200 phrases and 3,200 characters. You use them to bias recognition toward product names, people, and domain terms.

The [phrase list page](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/improve-accuracy-phrase-list) carries the same `ms.date` and the same `updated_at` as the how-to, so the same 240.99 hours applies. It states the same two limits, and it adds the reject sentence: the service rejects lists that exceed either limit. Teach the reject from this page. For monolingual post-stream refinement, the same page says use no more than 200 phrases, that more than 200 increases latency, and that this recommendation isn't a hard limit. Keep the hard multilingual reject and the soft monolingual recommendation apart.

Phrase lists work with both modes. You apply them at runtime. They don't require model training. The Batch transcription API doesn't support them. Weight runs from `0.0` to `2.0`. `0.0` disables the list. `1.0` is the default. `2.0` is the maximum. The setting applies to the whole list.

The Python sample prints this:

```python
phrase_list_grammar = speechsdk.PhraseListGrammar.from_recognizer(reco)
phrase_list_grammar.addPhrase("Contoso")
phrase_list_grammar.addPhrase("Jessie")
phrase_list_grammar.addPhrase("Rehaan")
phraseList.setWeight(weight)
```

The first three calls use `phrase_list_grammar`. The weight line uses `phraseList`. That is how the page prints it. Pass the recognizer you created. The sample names that argument `reco`. On the weight line, use the name you assigned, and pass a number in the `0.0` to `2.0` range. The page does not give `weight` a number.

The how-to repeats the 200 and 3,200 reject in an Important box under the multilingual heading. The blog states the two limits and leaves the reject sentence off.

## Read the six regions on the blog

The blog says multilingual post-stream refinement is available in six regions: Central India, East US, North Europe, Southeast Asia, West US, and West US 2. It says 61 multilingual locales, up from 29 at preview. It says diarization is included, and that multilingual transcripts still show who said what. The Learn table marks diarization Supported for both modes and links a separate how-to. The who-said-what line stays on the blog.

The same post says monolingual post-stream refinement now supports 148 locales, up from 29, which matches fast transcription coverage. Monolingual keeps a second recognition pass in parallel with real-time streaming. Use it when you know the language up front and you want the broader locale list. Use multilingual when the language is unknown up front, or when speakers switch languages. The blog's why-column for that row is low latency final results, open-range detection, code-switching, and 61 locales.

I searched the saved Learn how-to for `100 millisecond`, `Central India`, and `West US 2`. Those counts were zero. A search for `61` hit a hash and a GitHub line anchor, not a locale count. If you mention 61 locales, the 100-millisecond line, or the six regions, cite the blog.

Learn says the two modes have different Azure region availability, and both the how-to and the blog link the [regions page](https://learn.microsoft.com/azure/ai-services/speech-service/regions?tabs=stt). The six names above are the blog's list. The blog also links [language support](https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=stt) for the full locale list.

The workloads the blog names are global contact centers, voice agents that handle code-switching without restarting the session, international meetings, webinars, live captioning, and travel, automotive, media, and consumer apps.

## Commit the turn on the preview path

The blog's tip says that for the lowest final-result latency in voice-agent scenarios, you commit results explicitly when your application detects the end of a turn, instead of relying only on the service's silence timeout. The method name sits on a different Learn heading, [Commit an explicit audio boundary (preview)](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-recognize-speech#commit-an-explicit-audio-boundary-preview).

That section says turn-based voice agents may need an explicit boundary, and it names `Commit()` on `PushAudioInputStream`. Using it requires Speech SDK 1.52.0 or later for C#, C++, Java, Python, Objective-C, and Swift, or 1.53.0 or later for JavaScript and Go. It also requires the service property `setfeature=forcecommit`. During public preview, only PCM, A-law, μ-law, and G.711 are supported. Other compressed formats are out. Microsoft Audio Stack is out too.

The Python sample in that section sets the recognition language to `en-US`, then enables the property like this:

```python
speech_config.set_service_property(
    "setfeature", "forcecommit", speechsdk.ServicePropertyChannel.UriQueryParameter)
```

It writes audio to a push stream and commits the boundary with `token = pushStream.commit()`. A matching result carries `result.commit_token`. A token of zero means the result is not the commit acknowledgment. That sample does not set `PostRefinement`, and it does not pass `AutoDetectSourceLanguageConfig`. The multilingual block and this preview block are printed under two headings. If you want both, you add the multilingual property yourself. The page does not print a combined sample.

Keep the multilingual install at 1.50 unless you also want this boundary. The commit preview is the later floor.

## Try it on one conversation today

Install the Speech SDK at 1.50 or later. Point the speech config at a resource in one of the six regions the blog lists. Set `PostRefinement`. In Python, pass `AutoDetectSourceLanguageConfig()` with no language list. Add one or two product names with `addPhrase`, and stay under 200 phrases and 3,200 characters. Run it on a conversation that actually switches languages.

If the session already has multilingual post-stream refinement on, the blog says the new engine arrives with no code changes. That is the case where you leave the property alone and listen for the faster final.

If you already had this on from preview, did the final result show up sooner on a real call, or did the change only show up when you set the property for the first time?
