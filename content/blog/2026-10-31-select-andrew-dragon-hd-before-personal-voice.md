---
slug: "2026-10-31-select-andrew-dragon-hd-before-personal-voice"
title: "Select Andrew Dragon HD before Personal Voice"
excerpt: "If you want a Foundry voice agent that answers from your documents, pick the platform voice and a preset face first. Personal Voice waits until you hold a consent recording."
date: "2026-10-31"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-31-select-andrew-dragon-hd-before-personal-voice"
categories: ["Microsoft", "Azure", "AI Agents"]
tags: ["Microsoft Foundry", "Voice Agent", "Personal Voice", "Foundry IQ", "how-to"]
readTime: 9
image: "/images/blog/2026-10-31-select-andrew-dragon-hd-before-personal-voice-hero.png"
---

If you want a Foundry voice agent that answers from your documents, select the platform voice and a preset face first. The name on the announcement and on the setup guide is Andrew Dragon HD. Personal Voice is the later pass, after you hold a consent recording for that speaker.

I fetched the [announcement](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/turn-enterprise-knowledge-into-a-personalized-voice-and-avatar-agent-in-minutes-/4564809), the [setup guide](https://github.com/microsoft/voice-agent/blob/main/samples/create_agent_with_iq_avatar_voice/README.md), and the [Foundry blog RSS](https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=azure-ai-foundry-blog) this morning. The announcement HTML `postTime` is `2026-10-30T10:00:00.105-07:00`. JSON-LD `datePublished` is `10/30/2026, 5:00:00 PM` with no timezone on that string. If you read `5:00 PM` as UTC, it matches `postTime`. `article:modified_time` and `lastEditTime` are `2026-10-27T20:50:29.696-07:00`. `revisionNum` is 12. JSON-LD `dateModified` is `10/28/2026, 3:50:29 AM`, also with no timezone. The HTML `latestVersion` is major `1`, minor `0`. The RSS `pubDate` for this item is `Fri, 30 Oct 2026 17:00:00 GMT`, which matches `postTime`. Keep those clocks. The edit stamp and the publish stamp sit on different days.

The announcement says that once the assets are prepared, combining them takes a few minutes in the Foundry portal: create a Voice Agent, connect the knowledge, select the voice and avatar, and start talking. The playground handles speech, the avatar, and the app code for that try. "A few minutes" is the page's claim.

The same page then prints four steps that open Personal Voice and a custom photo avatar. A sentence beside those steps says you can also start right away with platform-provided voices and avatars and personalize later. The demo on that page uses Andrew Dragon HD and a preset photo avatar named Marcel. The setup guide's default face is Standard Harry / Business. Follow the guide when you want the documented default. Follow the demo when you want the face in the video. For the first session, stay on a platform voice and a preset face.

## Prepare the knowledge base

Use a Foundry project. The setup guide is the page that says "not a hub-based project." The announcement leaves that sentence out, so name the page you are following. Native voice agents are preview on the guide. Confirm the resource and region support the voice and avatar you pick. The announcement says available models, regions, and preview features vary. The guide points at the [voice list](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) and the [standard avatar list](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech-avatar/standard-avatars) for that check.

The knowledge base is Foundry IQ. The announcement assumes it is already prepared. The guide is the page with the clicks.

1. Open [Foundry](https://ai.azure.com/), select the project, and use the New Foundry experience.
2. Open Knowledge and start a knowledge base, or reuse one you already have.
3. Under Basic configuration, enter a name. For a minimal extractive setup, select Retrieval reasoning effort: Minimal, and Output mode: Extractive data. Follow any Chat completions model requirement the portal shows for those settings.
4. Under Knowledge sources (Foundry IQ), select Upload files and choose documents you are allowed to use. That upload sits on the knowledge-base page, next to Add sources.
5. Wait until file processing finishes, and clear any errors the portal reports.
6. In the knowledge playground, ask one question the documents cover and one they do not. Keep the knowledge base name. You need it when you attach the agent.

The guide's recorded check on its sample corpus is 219 PASS / 18 FAIL (92.41%) on 237 knowledge-covered questions. That score lives on the guide. The announcement leaves it out. Your two playground questions are the check that belongs to your documents.

## Create the agent

The two pages use different labels for the same door. Use the label on the screen you have open.

On the announcement: open Agents, then Build an agent. Enter a name, select Voice as the interaction mode, choose the appropriate use case, and select Create agent and open playground. Then review the model and the default instructions.

On the guide: open Agents and use the agent creation action. Give the agent a name and open its Playground. Select a model available for voice interaction, enable Voice mode, and set Instructions.

Voice, as the interaction mode, is what makes this a voice agent. The guide's Python field for the same idea is `definition.kind` set to `voice`.

Put a short instruction in before you talk. The announcement's example is:

> Use the connected knowledge base for factual answers. Give a brief, direct answer and use conversation context for follow-up questions. If the available materials do not contain the answer, say so rather than guessing.

The guide adds one clause: include source references. Put that in the same box. Keep spoken answers short. The announcement asks for concise answers.

## Connect the knowledge

Expand Knowledge, select Add, and choose the knowledge base from Available knowledge bases. If this project still needs the connection, the guide says to use Connect to Foundry IQ and finish that flow. Confirm the selected knowledge base shows up in the Knowledge section.

The agent screen also has Tools, then Upload files. That is a different door. Attach the knowledge base with Knowledge, then Add. The file upload you already finished belongs on the knowledge-base page.

## Select Andrew Dragon HD and a preset face

Open the gear for Configuration. Under Speech output, then Voice, search the prebuilt voices for Andrew and select the Dragon HD version. The voice name on the guide is `en-US-Andrew:DragonHDLatestNeural`. Preview it.

Enable Avatar. Open More avatars, then Standard. Choose Harry / Business and select Save. The guide's Python template stores that face as `character` `harry`, `style` `business`, `customized` false, and `output_protocol` `webrtc`, with output modalities text, audio, and avatar.

The announcement's step 3 starts on the optional path: under Voice, select Personal Voice (Custom, then Personal), enable Avatar, and choose the custom photo avatar (Custom, then Photo avatar). Skip that for the first session. The announcement's own demo used Andrew Dragon HD and Marcel. Marcel is the preset face in the video. Harry / Business is the preset face in the guide. Pick one preset and write down which page you followed.

Preview the selections and confirm they are available for the project's resource and region. Then reopen the same agent and check Knowledge, the voice, and the avatar before you start a session. The guide is the page that asks for that reopen. Also review the project's conversation storage, access, and retention settings before the first conversation. The Python templates set `store` to false, and they say to turn storage on only after you have decided retention and access.

## Ask one question inside the documents and one outside

Select Save, then Start session, and allow the browser microphone. The guide's try steps say Start, after you pick a microphone.

Ask a question the documents cover. Then ask a follow-up that needs the first answer. Then ask something the documents do not contain. The announcement's demo uses three prompts on a Theodore Roosevelt knowledge base: his main contributions to conservation, one specific example and why it mattered, and Microsoft's closing stock price yesterday. The third prompt is the limit check. The page says the agent should say the available materials do not contain the answer. Swap in your own documents. The historical topic is the announcement's compact example.

Check the spoken answer against the source documents before you share the agent. Also check the selected voice, playback, and whether a person can interrupt mid-answer when the voice configuration supports interruption. The announcement says interruptions work in a supported voice configuration. If an avatar is on, the guide says to check the likeness and whether the audio and the video stay together.

The guide says the default Andrew plus Standard Harry / Business combination needs no personal photo, no prompt audio, no consent upload, and no asset-training task. That is the first session.

## Leave Personal Voice for the second pass

Come back to a custom voice and a custom face when you already hold consent for that person. The file limits are on the setup guide. The announcement points there for eligibility.

For a photo avatar, the photo and the consent video have to be the same person. The consent dialog accepts `.mp4` or `.mov`, smaller than 500 MB, longer than 3 seconds and shorter than 1 minute. Keeping Andrew as the voice still leaves that consent video required. The guide says to use the person's consent video, and to skip a synthesized consent statement.

For Personal Voice, the training sample on the guide is a clean, single-speaker recording of 5 to 90 seconds, separate from the consent recording. Wait until creation reaches Succeeded, and keep the created voice name. On the Python personal template, `voice_type` is `azure-personal`, and `personal_voice_model` is the synthesis base model, `DragonLatestNeural` or `DragonHDOmniLatestNeural`, not a profile ID. To come back to Andrew, set `voice_type` to `azure-standard`, set `voice` to `en-US-Andrew:DragonHDLatestNeural`, and delete `personal_voice_model`.

If you want the service-issued IDs, start from `agent.example.json`. That file already selects Andrew Dragon HD and Standard Harry / Business. `agent.personal.example.json` is the custom path, and it already includes a custom photo avatar. The creator validates, creates, and reads the agent definition. Knowledge, roles, personal media, and Speech assets stay on the preparation steps above. The recorded install note on the guide is Python 3.13 in WSL Ubuntu, and the requirements use `azure-ai-projects>=2.7.0`. `allowed_tools` on that sample is only `knowledge_base_retrieve`. Copy the existing RemoteTool connection's full target, including the `api-version` already on it, into `server_url`, and copy that connection's name into `project_connection_id`.

If create and the exact-version show both report `definition_verified=true` and the agent is still missing from the portal list, the guide's preview troubleshooting step is the URL parameter `flight=voice_agent_bundle`. Treat that as a portal URL setting for this preview. It is a step for an empty list, not a step every project needs. Leave the agent you already created in place, and search again for the returned name.

## Try this on one knowledge base

Open the project, confirm file processing has finished, and create the voice agent with the label your screen shows. Select Andrew Dragon HD. Select Harry / Business, unless you are matching the announcement video, in which case select Marcel. Ask one question the documents cover and one they do not. Save Personal Voice and a custom photo for the day you have the consent video and the voice sample.

If the portal's voice search leaves Dragon HD off your resource, which preset voice did it offer, and did the screen say Build an agent or enable Voice mode?
