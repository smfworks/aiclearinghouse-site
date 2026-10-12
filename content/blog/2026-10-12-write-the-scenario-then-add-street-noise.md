---
slug: "2026-10-12-write-the-scenario-then-add-street-noise"
title: "Write the scenario, then add street noise and an interruption"
excerpt: "Write the user's goal in test_case_description, then add street_traffic and one interruption in the run config. The October 9 figures are not the UI, and the transcript evaluators do not score the noise."
date: "2026-10-12"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-12-write-the-scenario-then-add-street-noise"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "voice agents", "evaluation", "conversation simulation"]
readTime: 11
image: "/images/blog/2026-10-12-write-the-scenario-then-add-street-noise-hero.png"
---

If you are about to test a voice agent in Microsoft Foundry, write the user's goal first. Then add one listening condition and one interruption. Do not treat the figures in the October 9 Foundry blog as the product UI. I did not open a Foundry project, deploy a model, or start a simulation run this morning. The steps below are the ones those pages actually name.

The dated primary is [Beyond the Script: Evaluating Voice Agents with Voice User Simulator](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/beyond-the-script-evaluating-voice-agents-with-voice-user-simulator/4559696). The byline on that page says Oct 09, 2026, and the visible timestamp title is "October 9, 2026 at 8:00 AM." The page's `postTime` is `2026-10-09T08:00:00.092-07:00`. The footer says "Updated Oct 06, 2026" with a title of "October 6, 2026 at 2:00 PM," and the version label is Version 1.0. Do not collapse those clocks into one date. The blog tells you to follow the conversation simulation guide for setup, voice and audio configuration, and SDK and REST examples. That guide is [Simulate conversations with the Microsoft Foundry SDK](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation-simulate-conversations). Its `ms.date` is `2026-10-07T00:00:00Z`. The rendered page also says "Last updated on 2026-10-08." Use the blog as the October 9 primary. Use the Learn page for the fields. Do not date the Learn page to October 9. I did not click a portal button, because the blog says its figures are not the UI.

## Write the goal, not the script

The blog's three pillars are scenarios, acoustic conditions, and conversational dynamics. You can set them independently. Available options depend on the project and service configuration. A scenario is a goal, facts, and constraints. It is not a script. The simulator writes each user turn from the exchange so far, and it is instructed to keep the supplied facts without coaching the agent through its workflow.

The blog's fictional delivery example supplies an order number, a preference for Friday, and a requirement to keep the address unchanged. Those lines are the page's example. I did not run that call. The figure caption is the line you should keep next to any screenshot you remember from the post: "All figures and dialogue examples are illustrative, not actual UI screenshots, recordings, or measured results." Figure 2 adds that the voice options shown are examples. If you cannot find a control in your project, do not invent a click path from those drawings.

On the Learn page, put that goal in `test_case_description`. The description can contain 1 through 2,500 characters. For JSONL, the canonical names are `test_case_id`, `test_case_description`, and `simulation_configuration`. When the file uses those names, omit `data_mapping`. If your file uses different names, map them to those three. Do not use `data_mapping` with an `inline_user_conversation_simulation` source.

The page's own JSONL sample is a refund timeline and a store-hours lookup, not the delivery call:

```jsonl
{"test_case_id":"contoso_refund_timeline","test_case_description":"Customer returned an item five days ago and wants to know when the refund will arrive.","simulation_configuration":{"desired_num_turns":10}}
{"test_case_id":"contoso_store_hours_lookup","test_case_description":"Customer wants today's closing time and might need to clarify the store location.","simulation_configuration":{"desired_num_turns":3,"conversation_repetitions":2}}
```

`test_case_id` is optional. The service generates an identifier if you omit it. `simulation_configuration` on a test case overrides the matching run defaults. Settings you do not override keep the run defaults.

You can also skip the file and put test cases inline. The page's inline sample uses `test_case_id` `refund-delay`, the description "A frustrated customer wants an update on a delayed refund," and `desired_num_turns` 6. An inline source needs at least one test case. The other source types are `file_id` and `file_content`. The page also says you can generate scenarios with the Simulation seed (multi-turn) task type, then normalize `id` to `test_case_id` and move `desired_num_turns` into `simulation_configuration` before you reuse that dataset. I did not open the seed page.

The Learn page showed an "Access to this page requires authorization" banner and still returned the how-to body. I was not signed into a Foundry directory.

## Keep the simulator model off the router

The simulator model is separate from the agent you are testing. `model_configuration.model` is required. The format is `{connectionName}/{modelDeploymentName}`. The Learn page says the model router is not supported as the simulator model. It can only be an evaluation target.

The curl sample on that page sets the simulator model to `my-connection/gpt-4.1`. That is an example in the docs. Do not deploy that name because the sample used it. The Python sample reads `AZURE_AI_SIMULATOR_MODEL` and says that variable uses the same `{connectionName}/{modelDeploymentName}` format. `sampling_params` is optional. The samples set temperature `0.7`, `top_p` `1.0`, and `max_completion_tokens` `800` on the simulator. Those are sample values, not a required sampler. The page's prerequisites are a completed client setup, a model deployment to simulate users, an agent target, and scenario data. I did not run that setup.

## Add a voice only when you mean speech

`voice_model` is optional. The Learn page says it converts simulated user text to speech through the Voice Live endpoint. Omit it for a text-only simulation. For voice, `voice_model.type` must be `azure-standard`. Set `name` to an Azure standard neural voice name. You can set `temperature` from 0 through 1. When you omit it, the underlying voice model's default applies.

The curl sample uses `en-US-AvaMultilingualNeural` and a voice temperature of `0.7`. That is the sample voice, not a voice your project is required to have. The blog says teams can select from Foundry supported voices, with male and female voices and different accents among the available options, and that voice options depend on service availability. It does not print a voice list. Do not invent one from Figure 2. The observability guide, dated below, says the same thing in shorter form: configure the Azure standard neural voice, and you can set its synthesis temperature. It also says voice-agent availability does not guarantee that every simulator or evaluator model is in the same region. Check regions, limits, deployment, SKU, and quota before you assume the sample names exist in your project. I did not check a region's quota.

## Add street noise as fields, not as a drawing

Put effects in `audio_effects`. The Learn page names five: `street_traffic`, `crowd_chatter`, `background_tv`, `metro_station`, and `telephonic_voice`. Set `volume_percentage` from 1 through 100. The default is 15. Audio effects are ignored in text-only simulations. Place `audio_effects` in `default_simulation_configuration` to apply them to every test case, or in one test case's `simulation_configuration` to override that case.

The curl sample does the combination the blog describes. It sets `street_traffic` and `telephonic_voice` at volume 20:

```json
"audio_effects": {
  "effects": ["street_traffic", "telephonic_voice"],
  "volume_percentage": 20
}
```

The blog says a telephonic effect applies narrowband, telephone-style processing and can be used alone or with ambient sound. The same configured voice and audio effects apply to the user's turns, including interruptions. The delivery-call drawing is that page's illustration. I did not listen to a recording.

| What you set | Where it lives | What the page says |
| --- | --- | --- |
| Goal, facts, constraints | `test_case_description` | 1 through 2,500 characters. Not a script. |
| Simulator model | `model_configuration.model` | Required. `{connectionName}/{modelDeploymentName}`. Not the model router. |
| Voice | `voice_model` | Omit for text. `type` must be `azure-standard`. Temperature 0 through 1, or omit it. |
| Listening condition | `audio_effects` | Five named effects. `volume_percentage` 1 through 100. Default 15. Ignored for text. |
| Interruption | `user_behavior.interruption.type` | Set to `default` to enable. Omit `interruption` when it is not part of the test. |

If you do not override them, the page's run defaults are `max_num_turns` 20 and `conversation_repetitions` 1. Omit `desired_num_turns` and the simulator picks the length from the scenario. It cannot exceed `max_num_turns`. Dataset generation defaults to false and is run-only. Omit the dataset name and the service generates one.

## Turn interruption on with one field

The Learn page is specific. Set `user_behavior.interruption.type` to `default` to enable simulated interruptions. Omit `interruption` when interruptions are not part of the test. The curl sample is just that object:

```json
"user_behavior": {
  "interruption": {"type": "default"}
}
```

The blog describes a wider optional conversational preset. Barge-in lets the simulated user interrupt while the voice agent is speaking. Backchannels add brief acknowledgments without asking it to stop. Clarification and repair can introduce a question or correction during a longer response. In the fictional delivery call, the simulator might interrupt with "Wait, Friday works better," acknowledge an explanation with "Mm-hm," or ask "Is the address unchanged?" during a longer explanation. Those sentences are on the blog. They are examples, and the figure caption already said they are not measured results.

I searched the Learn page fetched this morning for backchannel, clarification, and barge. No hits. Do not invent JSON fields for those behaviors. The observability page's interruption line matches the Learn field: simulate a user speaking while the agent responds. It does not name a backchannel property.

## The Python sample on that page is not the voice run

This is the easy miss. The Python block under "Create the evaluation and run" uploads `simulation_scenarios.jsonl`, creates an eval named "Multi-turn Conversation Simulation," and creates a run whose `data_source.type` is `azure_ai_user_conversation_simulation`. The target type is `azure_ai_agent`. Its `default_simulation_configuration` sets `max_num_turns` to 8, `conversation_repetitions` to 2, `desired_num_turns` to 5, turns dataset generation on, and names the dataset `support-simulations`. It does not set `voice_model`, `audio_effects`, or `user_behavior`.

The curl run on the same page does. It posts to `https://${ACCOUNT}.services.ai.azure.com/api/projects/${PROJECT}/openai/evals/${EVAL_ID}/runs?api-version=2025-11-15-preview`. The body includes the voice model, the street-and-telephone effects at volume 20, the interruption object, `max_num_turns` 10, and the dataset name `voice-support-simulations`. Creating the eval is a separate POST to `.../openai/evals?api-version=2025-11-15-preview`. Both samples set `evaluation_level` to `conversation`.

If you paste the Python block and stop, you have not added street noise. Add the objects the voice section and the curl sample show. I did not run any of the samples. The Learn page points at `sample_multiturn_conversation_simulation.py`. I did not open that file.

The curl sample sets the evaluator model to `gpt-5-mini`. The Python sample uses `AZURE_AI_MODEL_DEPLOYMENT_NAME` for that slot. Do not treat `gpt-5-mini` as the only model the service accepts. The sample names `builtin.output_quality`, `builtin.tool_use_quality`, `builtin.deflection_rate`, `builtin.customer_satisfaction`, `builtin.task_completion`, `builtin.coherence`, and `builtin.groundedness`. I am not claiming a score. I did not create an eval id. When dataset generation is on, a completed run includes an `output_datasets` entry of type `simulated_user_conversations`. If it is off, that entry is omitted.

## After the run, listen. The scores will not hear the traffic.

The blog's last step is to review the conversations, listen to available audio, and use the [voice-agent observability guide](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/voice-agent-observability). That page's `ms.date` is `2026-09-30T00:00:00Z`, and the rendered page says last updated 2026-10-07. Voice agents use the same Foundry Agent Service stack as other agents. The page describes only what is different for voice. Items marked preview there have no service-level agreement, and the page says Microsoft does not recommend that preview for production workloads.

Simulation-based evaluation on that page adds voice synthesis, audio effects, and simulated interruption behavior. The evaluators still read transcripts. They can assess intent resolution, task adherence, tool-call accuracy, coherence, relevance, groundedness, and content safety. They do not assess pronunciation, prosody, echo, background noise, audio quality, or interruption timing. Synthetic text-to-voice simulation does not establish microphone capture, speech-recognition quality, playback quality, or interruption timing on a real device.

Street noise is a test condition. It is not a score. If you want a number, use a custom rubric for something you can judge from the transcript. The page's examples are whether the agent asked one question at a time, confirmed important details, handled recognition errors without guessing, and stated the final outcome. Then listen. I did not open a dashboard.

Tracing and conversation storage are separate. Set `store` to true on the agent definition if you want the transcript, event timeline, and audio from the agent endpoint. The default is false. Stored voice conversations and Microsoft-managed audio are retained for 60 days. The system does not capture transcripts and audio references by default. The page warns that audio and transcripts can contain personal or regulated information. Each identity that runs conversation simulation needs the Foundry User role, or equivalent permissions, at the Foundry account scope. That role was previously named Azure AI User. The page says the role ID did not change.

## Do not merge the clocks

| Page | What it prints | What not to do |
| --- | --- | --- |
| Foundry blog byline | Oct 09, 2026, timestamp title "October 9, 2026 at 8:00 AM" | Do not call this the Learn page date. |
| Same blog, `postTime` | `2026-10-09T08:00:00.092-07:00` | Do not rewrite the offset. |
| Same blog, footer | Updated Oct 06, 2026, title "October 6, 2026 at 2:00 PM," Version 1.0 | Do not treat the footer as a correction of the byline. |
| Simulation how-to | `ms.date` `2026-10-07T00:00:00Z`, last updated 2026-10-08 | Do not date this page to October 9. |
| Voice observability | `ms.date` `2026-09-30T00:00:00Z`, last updated 2026-10-07 | Do not treat it as the October 9 announcement. |

If you already run a voice agent in a project, which of the five named effects matches the call you actually get, and did a transcript evaluator notice the noise at all?
