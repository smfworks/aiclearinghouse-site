---
slug: voxtral-3-local-voice-agent
title: Run a Voxtral 3 voice agent on your machine
excerpt: "Install PortAudio, pip install mistralai with the voice-agents extra, and start a local session against the Mistral API. Steps are from the October 20 quickstart. On-prem is still a contact form, not a compose file."
category: Local runtime
tags:
  - mistral
  - voxtral
  - voice
  - livekit
order: 99
last_verified: "2026-10-21"
difficulty: Intermediate
estimated_time: "20 min"
---

# Run a Voxtral 3 voice agent on your machine

## What this is

Mistral's Voxtral 3 post says the voice agent SDK runs speech in, reasoning, and speech out as one streaming pipeline, built on LiveKit. The quickstart says the Voice Agents API captures your voice, transcribes it, generates an answer, and speaks that answer.

The session runs on your machine. The models run on Mistral's API. That is not an on-prem deploy. The news post says a full on-prem or private-cloud stack is "talk to our team." This recipe stops where the quickstart stops.

This directory did not install PortAudio or open a microphone. The commands are the quickstart's, fetched October 21, 2026 from https://docs.mistral.ai/studio/audio/voice-agents/quickstarts/build-a-voice-agent.

## Prerequisites

The quickstart lists four things: a Mistral API key, a microphone, speakers, and Python or Node.js. The blocks below are the Python path. The page also has a TypeScript tab. This recipe does not reconstruct that tab from a partial extract.

You need PortAudio because the Python SDK uses PyAudio. The page says the `voice-agents` extra pulls in PyAudio, LiveKit, and NumPy.

## Steps

1. Install PortAudio, then the SDK extra.

macOS:

```bash
brew install portaudio
pip install "mistralai[voice-agents]"
```

Linux, as printed on the page:

```bash
sudo apt install libportaudio2 libportaudiocpp0 portaudio19-dev libasound-dev libsndfile1-dev -y
pip install "mistralai[voice-agents]"
```

2. Put the key in the environment variable the sample reads. Create the key in Studio. The quickstart points at "Activate Studio and generate an API key" for that click path. Don't paste the key into a repo.

```bash
export MISTRAL_API_KEY="your-api-key"
```

3. Save this as a Python file and run it. It is the quickstart's script, including the dramatic-instructions string.

```python
import asyncio
import os

from mistralai.client import Mistral
from mistralai.extra.voice_agents import DefaultAudioInterface

MISTRAL_API_KEY = os.environ["MISTRAL_API_KEY"]

async def main():
    async with Mistral(api_key=MISTRAL_API_KEY) as client:
        session = await client.audio.sessions.init(
            audio_interface=DefaultAudioInterface(),
            instructions="Please respond to me in the most dramatic way possible."
        )

        def on_transcript(event):
            print(f"{event.role}: {event.content}")

        session.on("transcript", on_transcript)

        async with session:
            await session.wait()

asyncio.run(main())
```

Talk. The handler prints `role` and `content` as transcript events arrive. Stop the process when you are done. The sample waits until the session ends.

## What the pipeline is, if you need to change a piece

The voice-agents overview, fetched the same morning, splits the job into three stages:

- Transcription turns speech into text and detects the end of the turn.
- A model reads the conversation and writes the answer. Server-side tools run at Mistral. Client-side tools run your functions.
- Speech speaks the answer.

The news post says each stage is a separate model, so you can change the LLM, the voice, or the language without rewriting the agent. The quickstart sample does not set a model id. It sets `instructions` and the default audio interface. If you need a specific voice, open the voices page rather than guessing an id. One code fragment on the quickstart HTML was `tts={"voice_id": "fr_marie_neutral"}`. That fragment was not inside the Python sample above, so it is not part of the script.

## Prices, if you are about to leave this running

From the Voxtral 3 news post, not from a bill this directory paid:

- Voxtral Mini Transcribe 3 (batch): $0.0035 per minute
- Voxtral Mini Transcribe Realtime 3: $0.008 per minute
- Voxtral Small Transcribe 3: $0.0040 per minute
- Voxtral Speech 3, batch and realtime: $13 per 1 million characters

A local mic session will hit the realtime transcribe rate and the speech rate. It will not hit the batch transcribe rate unless you send a file instead. File transcription is a different quickstart: https://docs.mistral.ai/studio/audio/speech-to-text/quickstarts/transcribe-a-file. That page's sample model id is `voxtral-mini-transcribe-3`.

## Source

- Quickstart: https://docs.mistral.ai/studio/audio/voice-agents/quickstarts/build-a-voice-agent
- Overview: https://docs.mistral.ai/studio/audio/voice-agents/overview
- Announcement: https://mistral.ai/news/voxtral-3
