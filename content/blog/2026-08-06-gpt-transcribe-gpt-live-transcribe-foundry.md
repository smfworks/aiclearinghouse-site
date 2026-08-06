---
slug: "2026-08-06-gpt-transcribe-gpt-live-transcribe-foundry"
title: "GPT-transcribe and GPT-live-transcribe: High-Accuracy Speech Recognition for Production Voice Agents in Microsoft Foundry"
excerpt: "Microsoft Foundry introduces GPT-transcribe for asynchronous batch transcription and GPT-live-transcribe for low-latency streaming. These models deliver major gains in real-world audio conditions—noise, accents, alphanumeric details, domain terminology, and code-mixed speech—powering more reliable enterprise contact centers, accessibility features, and agent-assisted workflows across Copilot Studio and custom Foundry agents."
date: "2026-08-06"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-gpt-transcribe-gpt-live-transcribe-foundry"
categories: ["Microsoft", "Azure AI", "AI Agents"]
tags: ["Microsoft Foundry", "GPT-transcribe", "GPT-live-transcribe", "speech recognition", "voice agents", "real-time API", "Copilot Studio", "Azure OpenAI", "ASR"]
readTime: 15
image: "/images/blog/2026-08-06-gpt-transcribe-gpt-live-transcribe-foundry-hero.png"
---

Microsoft Foundry continues to strengthen its position as the comprehensive platform for building production-grade AI agents, including those that listen and respond in natural voice. On July 29, 2026, the team announced GPT-transcribe and GPT-live-transcribe—two specialized automatic speech recognition (ASR) models designed specifically for the accuracy demands of enterprise audio.

These models tackle the practical pain points that have historically made voice agents brittle: background noise in offices and factories, short clipped utterances during fast conversations, precise alphanumeric strings like account numbers and dates, industry-specific terminology, speakers who switch languages mid-sentence, regional accents, and even whispered commands. The result is transcription output that downstream agent logic, summarization, routing, and automation can actually trust.

## The Enterprise ASR Challenge

Traditional ASR systems often degrade quickly outside controlled studio conditions. A model that performs well on clean podcast audio can fail on a noisy call center recording or a field technician's radio transmission. Errors in numbers, codes, or proper names propagate into broken workflows: an incorrect account number routes a case to the wrong queue, a misheard date breaks scheduling automation, or a garbled product name defeats knowledge retrieval.

Microsoft's new transcription models were built with these scenarios in mind. They emphasize robustness across the dimensions that matter most for business voice applications:

- Reliable handling of background noise without requiring perfect audio capture.
- Accurate recognition of brief commands, affirmations, and interruptions common in natural dialogue.
- Strong alphanumeric perception for IDs, phone numbers, dates, addresses, and mixed letter-number sequences.
- Domain terminology understanding that improves with context about the conversation topic or business process.
- Codemix support for conversations that fluidly switch between languages.
- Context awareness that uses prior turns and topic hints to maintain consistency.
- Accent and dialect robustness for global workforces.
- Whisper detection for quiet or private speech.

Together these capabilities move voice from a "nice-to-have channel" to a first-class input for agentic systems.

## GPT-transcribe for Asynchronous Workloads

GPT-transcribe is the higher-accuracy option for completed audio files and batch processing. You submit a recording—meeting capture, voicemail, uploaded media, or call archive—and receive a text transcript after processing completes.

This pattern fits post-call analytics, compliance archiving, quality assurance review, media asset indexing, and any scenario where the full audio is available before transcription begins. The output text can immediately feed into Foundry agents for summarization, entity extraction, sentiment analysis, or routing decisions.

Because it is asynchronous, GPT-transcribe can leverage more compute for higher fidelity on difficult audio. Enterprises running nightly processing of thousands of customer calls or ingesting large volumes of recorded training material benefit from its accuracy focus.

## GPT-live-transcribe for Streaming and Low-Latency Scenarios

GPT-live-transcribe targets real-time streaming transcription through the Realtime API. Audio arrives continuously and partial transcripts are emitted as speech unfolds. Developers can tune the latency/accuracy trade-off to match the experience requirements.

This is the model for live captions during meetings, voice assistants that need immediate feedback, contact center agent-assist surfaces that surface key facts while the caller is still speaking, accessibility tools, field service apps, and operational monitoring dashboards.

The streaming nature allows agents built in Copilot Studio or custom Foundry applications to begin acting on spoken input before the speaker finishes. Combined with tool calling and memory features already available in Foundry, this enables responsive voice agents that feel natural rather than stilted.

## Additional Realtime Audio Models

The announcement also highlighted companion models for full speech-to-speech experiences:

- gpt-realtime-2.1 for high-quality bidirectional audio conversations.
- gpt-realtime-mini-2.1 for cost-efficient, high-volume deployments.

These accept audio input and produce audio output directly, complementing the text-focused transcription models. Teams can mix patterns: use GPT-live-transcribe to obtain accurate text for agent reasoning and tool use, then respond via a realtime voice model when natural spoken output is preferred.

## Pricing and Deployment

The models are available in Microsoft Foundry under Global Standard deployment. Transcription models are priced per audio hour; realtime models use token-based pricing across audio, text, and image modalities.

Example Global Standard rates (subject to change; always verify in the portal):

| Model                  | Modality | Input (per M) | Cached Input | Output (per M) | Notes |
|------------------------|----------|---------------|--------------|----------------|-------|
| GPT-realtime-2.1      | Audio    | $32.00       | $0.40       | $64.00        | Full fidelity |
| GPT-realtime-2.1      | Text     | $4.00        | $0.40       | $24.00        | - |
| GPT-realtime-mini-2.1 | Audio    | $10.00       | $0.30       | $20.00        | Cost-optimized |
| GPT-live-transcribe   | Audio    | -            | -           | $1.02/hour    | Streaming |
| GPT-transcribe        | Audio    | -            | -           | $0.27/hour    | Batch |

These rates make high-volume transcription practical while the realtime options remain competitive for interactive experiences. Caching and input token optimizations further improve economics for repeated context.

## Integration with the Realtime API

Developers access these capabilities through the GPT Realtime API in Foundry. The GA endpoint format uses `/openai/v1`. Supported connection methods include WebRTC (recommended for client apps, ~100ms latency), WebSocket (server-to-server), and SIP for telephony.

A typical session begins with a `session.update` event that configures the transcription model:

```json
{
  "type": "session.update",
  "session": {
    "voice": "alloy",
    "instructions": "You are a helpful support agent. Transcribe accurately and use the transcript to drive tool calls.",
    "input_audio_format": "pcm16",
    "input_audio_transcription": {
      "model": "gpt-live-transcribe"
    },
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 200,
      "create_response": true
    },
    "tools": []
  }
}
```

The server confirms with `session.updated`. Subsequent audio chunks sent via `input_audio_buffer.append` produce incremental `response.audio_transcript.delta` events. When a turn completes, `response.audio_transcript.done` and `response.done` events deliver the final transcript.

For transcription-only sessions, set the session type appropriately and request text output. The same infrastructure supports full multimodal realtime conversations when you also configure modalities for audio output.

Microsoft Learn provides quickstarts and detailed reference for WebRTC, WebSocket, and SIP flows that work with the new transcription models—simply change the deployment name to your GPT-transcribe or GPT-live-transcribe deployment.

## Voice Agents Across the Microsoft Stack

These transcription advances directly benefit agents built in Copilot Studio and custom solutions on Foundry.

Copilot Studio already supports real-time voice agents with governance, consent recording, and handoff to Teams Phone. Accurate live transcripts from GPT-live-transcribe improve the quality of downstream reasoning, skill invocation, and knowledge retrieval within those agents. The same transcripts can be fed into Foundry IQ or Azure AI Search for grounding.

In custom agent scenarios, the text output from transcription becomes first-class context for Agent Framework workflows, Toolboxes, memory, and multi-agent orchestration. An agent can now reliably extract structured data from spoken input and trigger actions in Dataverse, Microsoft 365, or external systems via MCP servers.

The combination creates end-to-end voice experiences that are both low-latency at the edge and deeply integrated with enterprise data and business processes.

## Practical Steps to Get Started

1. In the Microsoft Foundry portal (ai.azure.com), deploy GPT-transcribe for batch workloads and GPT-live-transcribe for streaming needs. Note the deployment names.

2. Review the Realtime API quickstart for your preferred connection method (WebRTC for web/mobile, SIP for telephony).

3. Update existing voice agent code or Copilot Studio voice topics to reference the new transcription deployments.

4. Test with representative audio: noisy office recordings, accented speakers, domain-specific terminology, and short command sequences. Measure word error rate improvements against prior models.

5. Wire the resulting transcripts into your agent orchestration—whether declarative workflows in Agent Framework, skills in Copilot Studio, or custom tool-calling logic.

6. Monitor usage and cost through Foundry observability and adjust the latency/accuracy tuning parameter where available.

## What This Means for Teams Building Voice Agents

Accurate transcription removes a major source of friction when moving voice agents from pilot to production. Contact center scenarios that previously required extensive post-processing or human review can now capture intent and details reliably in real time. Accessibility features become more dependable. Field and operational use cases gain trustworthy input for automation.

Because the models live inside Foundry alongside the rest of the agent platform—models, Toolboxes, memory, evaluations, and deployment controls—teams can govern, observe, and optimize the full pipeline in one place rather than stitching together disparate services.

The updates also reinforce Microsoft's strategy of offering both low-code paths (Copilot Studio) and pro-code depth (Foundry + Agent Framework) with shared primitives for identity, grounding, and orchestration.

## Sources

- Introducing GPT-transcribe and GPT-live-transcribe in Microsoft Foundry (Jul 29, 2026): https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-gpt-transcribe-and-gpt-live-transcribe-in-microsoft-foundry/4541740

- Use the GPT Realtime API for speech and audio with Azure OpenAI in Foundry Models: https://learn.microsoft.com/azure/foundry/openai/how-to/realtime-audio

- Microsoft Foundry model catalog and pricing details (ai.azure.com)

- What's new in Copilot Studio (voice agent capabilities): https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new

These capabilities represent another concrete step toward production voice agents that enterprises can deploy with confidence. Start with a focused pilot on one high-value workflow—call summarization, agent assist, or accessibility captions—and expand from the measurable accuracy gains.

---

*This post is part of the ongoing Microsoft AI research series on The Clearinghouse Log. All claims are grounded in the cited primary Microsoft sources.*
