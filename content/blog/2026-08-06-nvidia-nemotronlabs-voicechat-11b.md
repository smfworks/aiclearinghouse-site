---
slug: "2026-08-06-nvidia-nemotronlabs-voicechat-11b"
title: "NVIDIA NemotronLabs VoiceChat 11B: The First Open Full-Duplex Voice Model with Tool Calling"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-08-06"
excerpt: "NVIDIA released NemotronLabs VoiceChat 11B on August 3, 2026 — an 11B end-to-end full-duplex speech-to-speech model with ~450ms turn-taking latency, barge-in support, and live tool calling. We analyze the architecture, benchmark results, deployment paths, hardware requirements, and what it means for the future of local voice agents."
categories: ["AI", "Voice AI", "NVIDIA", "Local Inference"]
tags: ["nemotron-voicechat", "full-duplex", "speech-to-speech", "nvidia", "nemo", "voice-ai", "tool-calling", "openmdw", "realtime-api"]
readTime: 16
image: "/images/blog/2026-08-06-nvidia-nemotronlabs-voicechat-11b.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-nvidia-nemotronlabs-voicechat-11b"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The release

On August 3, 2026, NVIDIA published [NemotronLabs VoiceChat 11B](https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B) on HuggingFace under the OpenMDW 1.1 license — an 11B parameter, end-to-end, real-time speech full-duplex (FD) model for conversational AI. The code lives on the `nemotron-labs-voicechat` branch of the [NVIDIA-NeMo/Speech](https://github.com/NVIDIA-NeMo/Speech/tree/nemotron-labs-voicechat) repository.

This is not another ASR model or TTS model. It is a single unified model that takes raw audio in and produces speech out — listening and speaking simultaneously, handling interruptions, calling tools mid-conversation, and doing it all in one forward pass with no cascade.

The claims are bold: ~450 ms turn-taking latency, full-duplex operation (simultaneous listen + speak), barge-in support, and the first open full-duplex model to support tool calling. We dug into the architecture papers, the codebase, the deployment documentation, and the known limitations to assess what this actually delivers and what it would take to run it.

---

## The architecture: one model, not three

Traditional voice agents use a cascaded pipeline: ASR (speech-to-text) → LLM (text reasoning) → TTS (text-to-speech). Each handoff adds latency, loses paralinguistic information (tone, emotion, timing), and prevents true full-duplex conversation — the system can only listen OR speak at any given moment, never both.

NemotronLabs VoiceChat eliminates the cascade. The architecture, based on the [SALM-Duplex paper](https://arxiv.org/abs/2505.15670) (Interspeech 2025), works as follows:

### Signal flow

```
User Audio (16kHz, mono)
    │
    ▼
┌─────────────────────┐
│  Fast Conformer     │  100M param streaming encoder
│  Encoder            │  80ms frame rate
└────────┬────────────┘
         │ audio tokens
         ▼
┌─────────────────────┐
│  Nemotron Nano V2   │  9B param hybrid Mamba/Transformer
│  9B LLM Backbone    │  predicts text tokens + tool calls
└────────┬────────────┘
         │
    ┌────┼────────────┐
    │    │            │
    ▼    ▼            ▼
  TEXT  AUDIO     TOOL CALL
  tokens codes     JSON
    │    │            │
    │    ▼            │
    │ ┌──────────┐   │
    │ │  TTS     │   │
    │ │ Decoder  │   │
    │ │4 codebooks│  │
    │ │12.5 Hz   │  │
    │ │0.6 kbps  │  │
    │ └────┬─────┘   │
    │      │         │
    ▼      ▼         ▼
  Agent  Agent    External
  Text   Audio    Function
         22.05kHz  Result
```

### Key design decisions

**1. Pretrained encoder, not codec, for user input.** Previous duplex S2S models (like Moshi) encode both user and agent speech with the same codec, requiring the model to simultaneously learn perception and generation — a delicate balance. VoiceChat uses a 100M-parameter streaming CTC-based speech encoder for user input (perception only) and a separate codec for agent output (generation only). This separation means no speech pretraining is needed on the LLM backbone — you can build a duplex S2S model from any pretrained LLM.

**2. Hybrid Mamba/Transformer backbone.** The Nemotron Nano V2 9B backbone uses alternating Mamba and attention layers. Mamba provides O(n) inference scaling for long audio context (important when you're streaming 80ms frames indefinitely), while attention layers provide the representational capacity for reasoning. This is the same architectural pattern seen in modern efficient LLMs — Mamba for sequence length, attention for quality.

**3. Channel fusion for duplex.** User speech embeddings (from the encoder) and agent speech+text tokens (from the codec) are time-aligned and summed as input to the LLM. The model directly sees both streams simultaneously — this is what enables full-duplex: the model knows it's being interrupted because it can hear the user's speech while generating its own.

**4. Text-before-speech delay.** The model learns agent text first, then speech. A one-token delay is introduced on the speech channel so it can condition on the text context without adding significant latency. This is a subtle but important trick — it means the model "knows what it's going to say" before it has to say it, improving speech quality.

**5. Personalization-friendly codec.** The NanoCodec uses 4 codebooks at 12.5 Hz, achieving 0.6 kbps — half the bitrate of Moshi's Mimi codec (1.1 kbps) while matching or exceeding it on audio quality metrics. The codec supports fine-tuning for specific speakers (personalization), which significantly enhances both reconstruction quality and downstream S2S performance. The released checkpoint uses a single fixed voice and does not support voice cloning, but the architecture supports it for custom training.

**6. Tool calling as a separate output channel.** Tool-calling scripts are predicted on a dedicated output channel, not interleaved with text. This means the model can speak an "on-hold" message ("Let me check that for you") while simultaneously generating the tool-call JSON to execute. The client receives the function call, executes it, and returns the result — the model seamlessly resumes speech with the answer.

---

## Benchmark results

NVIDIA reports results on two benchmarks:

### VoiceBench

[VoiceBench](https://arxiv.org/abs/2410.17196) evaluates LLM-based voice assistants on real-world spoken interactions — open-ended questions, multiple-choice QA, instruction following, and adversarial cases. NemotronLabs VoiceChat ranks **#2 among all open full-duplex models**.

### Full-Duplex-Bench 1.0

[Full-Duplex-Bench](https://arxiv.org/abs/2503.04721) (ASRU 2025) is the first scenario-driven benchmark for full-duplex spoken dialogue, evaluating four critical interaction dimensions:

| Metric | Value | Direction |
|--------|-------|----------|
| Pause Handling (Synthetic): TOR | 0.153 | ↓ better |
| Pause Handling (Candor): TOR | 0.255 | ↓ better |
| Smooth Turn-Taking: TOR | 0.82 | ↑ better |
| Smooth Turn-Taking: Latency | **448 ms** | ↓ better |
| User Interruption: TOR | **1.0** | ↑ better |
| User Interruption: Latency | 480 ms | ↓ better |

TOR (Turn-Over Rate) measures how often the model appropriately takes the conversational turn. For pause handling, lower is better (don't jump in too early). For turn-taking and interruption, higher is better (do take the turn when you should).

The standout numbers: **448ms turn-taking latency** and **1.0 (perfect) interruption TOR**. The interruption latency of 480ms means when a user barges in mid-sentence, the model yields in under half a second.

### Context in the competitive landscape

The [Full-Duplex-Bench paper](https://arxiv.org/html/2503.04721v3) provides context on where open FD models stand against commercial systems:

| Model | Date | E2E | Open Source | Interruption | Backchanneling |
|-------|------|-----|-------------|-------------|----------------|
| dGSLM | 2022 | ✓ | ✓ | ✓ | ✓ |
| Moshi | 2024/10 | ✓ | ✓ | ✓ | ✓ |
| SALM-Duplex (VoiceChat basis) | 2025 | ✓ | ✓ | ✓ | ✓ |
| GPT-4o Voice Mode | 2024/5 | — | ✗ | ✓ | — |
| Gemini Live | 2024/8 | — | ✗ | ✓ | — |

VoiceChat is one of only a handful of end-to-end open-source FD models, and the only one with tool calling.

Against commercial offerings, the competitive picture looks like this:

| System | Architecture | Latency | Tool Calling | Open | ~Cost/min |
|--------|-------------|---------|-------------|------|-----------|
| NemotronLabs VoiceChat | E2E FD S2S | ~450ms | ✓ (max 5 tools) | ✓ | Free (self-hosted) |
| OpenAI gpt-realtime-2.1 | Native audio | ~300ms | ✓ | ✗ | $0.06–$0.46 |
| Gemini 3.1 Flash Live | Native audio | ~200ms | ✓ | ✗ | Free tier / token-based |
| xAI Grok Voice Agent | Full stack | ~1.25s | ✓ | ✗ | $0.05/min flat |
| Hume EVI 3 | Speech LM | — | ✓ | ✗ | $0.06/min |

The self-hosted cost advantage is significant for any operation with sustained voice traffic — the model runs on a single GPU with no per-minute API charges.

---

## Deployment paths

NVIDIA provides two deployment modes:

### Path 1: Offline conda evaluation

For quick batch testing without real-time streaming. You clone the repo, create a conda environment with Python 3.12 and torch 2.10.0, download the checkpoint from HuggingFace, and run inference scripts.

```bash
# Clone the Speech repo on the voicechat branch
git clone https://github.com/NVIDIA-NeMo/Speech.git
cd Speech && git switch nemotron-labs-voicechat
export NEMO_DIR="$(pwd)"

# Create conda environment (one-time)
conda create -y -n voicechat python=3.12
conda activate voicechat
pip install torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0
pip install -e ".[all]"
pip uninstall -y nvidia-resiliency-ext  # training-only, crashes import
pip install transformers==4.56.0 tokenizers==0.22.0 lhotse==1.32.2 \
  huggingface-hub==0.34.4 hf-xet==1.1.9 torchcodec==0.10.0 \
  torch_audiomentations jinja2
pip install ninja packaging wheel einops
pip install --no-build-isolation --no-deps \
  causal-conv1d==1.6.2.post1 mamba-ssm==2.3.2.post1

# Download checkpoint
hf download nvidia/NVIDIA-NemotronLabs-VoiceChat-11B \
  --local-dir /path/to/checkpoint

# Run offline inference
python "$NEMO_DIR/examples/speechlm2/offline_voicechat_infer.py" \
  --checkpoint /path/to/checkpoint \
  --wav "$NEMO_DIR/examples/speechlm2/sample_audio/sample_general.wav" \
  --output-dir /path/to/output
```

The torch 2.10.0 pin is deliberate — it's the newest release with prebuilt `mamba-ssm` and `causal-conv1d` wheels. Newer torch versions require 20+ minutes of `nvcc` compilation for those packages.

### Path 2: Interactive streaming container

For real-time voice conversations. A Docker container packages the full NVIDIA inference stack (CUDA, Triton, vLLM) with a bidirectional WebSocket interface.

```bash
# Download the prebuilt model via NGC
ngc registry model download-version nim/nvidia/nemotron-labs-voicechat:1.0.0
chmod -R 777 nemotron-labs-voicechat_v1.0.0

# Launch the container
docker run -it --rm --name=nemotron-labs-voicechat \
  --runtime=nvidia \
  --gpus '"device=0"' \
  --shm-size=8GB \
  -e NIM_HTTP_API_PORT=9000 \
  -p 9000:9000 \
  -v $(pwd)/nemotron-labs-voicechat_v1.0.0:/data/models \
  --entrypoint /s2s/run_s2s_server.sh \
  nvcr.io/nim/nvidia/nemotron-labs-voicechat:latest

# Poll until ready (up to 5 minutes)
curl 'http://localhost:9000/v1/realtime/health'
```

The container can also be used with a HuggingFace checkpoint instead of the NGC download — you generate a Triton model repository from the checkpoint using the `deploy_s2s_model.sh` script bundled in the container, then mount it at `/data/models`.

### WebSocket protocol

The streaming API uses the OpenAI Realtime API-compatible protocol — JSON messages over WebSocket with base64-encoded PCM16 audio:

| Parameter | Value |
|-----------|-------|
| Client input sample rate | 24 kHz |
| Model input sample rate | 16 kHz (server resamples) |
| Model output sample rate | 22.05 kHz (server resamples to 24 kHz) |
| Client output sample rate | 24 kHz |
| Channels | Mono |
| Encoding | 16-bit signed integer, little-endian |
| Recommended chunk duration | 80 ms (3,840 bytes at 24kHz PCM16) |

The protocol is designed to be a drop-in for OpenAI Realtime API clients. Two WebSocket paths are registered: `/v1/realtime` (primary) and `/realtime` (alias for OpenAI SDK and Pipecat compatibility). This means existing OpenAI Realtime client libraries and orchestration frameworks like [Pipecat](https://github.com/pipecat-ai/pipecat) can connect with minimal modification.

### Function calling protocol

Tool definitions follow the OpenAI Realtime API function tool specification. A key innovation is the `ack_messages` field — when the model decides to call a tool, it speaks one of the acknowledgment messages ("Sure, let me check that for you") while generating the tool-call JSON. This keeps the conversation natural during the tool execution gap.

```json
[
  {
    "name": "get_weather",
    "description": "Get current weather for a city",
    "ack_messages": ["Sure, let me check the weather for you."],
    "parameters": {
      "type": "object",
      "properties": {
        "city": { "type": "string", "description": "City name" }
      },
      "required": ["city"]
    }
  }
]
```

The flow:

```
User speaks request
    ↓
Model speaks ack_message + generates tool call JSON
    ↓
Server sends response.function_call_arguments.done → client
    ↓
Client executes function, sends conversation.item.create → server
    ↓
Model resumes speech with the answer
```

System prompts and tool responses must be **ASCII-only** — no Unicode punctuation, emoji, or special symbols. Tool responses should be converted to concise, TTS-friendly ASCII sentences before being sent to the model.

---

## Hardware requirements

| Requirement | Value |
|-------------|-------|
| GPU VRAM | ≥80 GB |
| Runtime memory | ~66 GB |
| CPU architecture | **x86_64 only** |
| Supported GPUs | A100 80GB, H100 80GB, RTX 6000 Pro, B200 |
| CUDA driver | >580 |
| OS | Ubuntu 22.04+, glibc ≥2.35 |
| Docker | NVIDIA Container Toolkit required |
| Container shm | 8 GB |

The x86_64 restriction is significant — it means the optimized inference container cannot run on ARM systems like NVIDIA's own DGX Spark (Grace Blackwell, ARM64). The offline conda path is theoretically possible on ARM but requires building `mamba-ssm` and `causal-conv1d` from source, as the prebuilt wheels target x86_64.

---

## Known limitations — read these before deploying

NVIDIA is transparent about this being a research release. The limitations are extensive and well-documented:

**Conversation stability:**
- 2-minute audio context window maximum — conversation beyond this isn't reliably retained
- Can degrade into non-recoverable gibberish after several turns
- Runaway continuation / self-talk — model keeps speaking or starts new turns without user input, including during tool-calling sessions
- Sessions can get stuck in word/sentence loops
- May repeat canned or irrelevant replies, enter clarification/refusal loops

**ASR quality:**
- User transcription drops leading or mid-phrase words even on clear audio
- User query sometimes missing from logs entirely

**Generation artifacts:**
- Word repetition, garbled or truncated fragments, clubbed words, multiple restarts
- Spoken output may end early

**Instruction following:**
- Unreliable response length control
- Unreliable language switching

**Tool calling:**
- Maximum 5 tools per session — more degrades performance
- Cannot reliably call multiple tools simultaneously
- User cannot interrupt during tool execution
- In mixed conversations (general chat + tools), model may answer from its own knowledge instead of calling the appropriate tool
- Intermittent wrong/skipped tools, invented arguments, mis-spoken tool results
- Long tool responses cause delays before agent speaks

**Environment:**
- Not suitable for noisy or reverberant environments
- Background speech causes degraded output

**Knowledge and reasoning:**
- Optimized for conversation, not knowledge — weaker than the base Nemotron Nano 9B V2 backbone on knowledge, instruction-following, and safety
- Not trained for reasoning or alignment — multi-step reasoning, arithmetic, safety-aligned behavior may be limited
- Can hallucinate facts or self-identity

**Voice:**
- Single fixed voice, no voice cloning in the released checkpoint

This is a model where you should read the limitations section before committing to any production use case. It is a v1 research release.

---

## What it means for local voice agents

### The paradigm shift

For the last two years, voice agents have been built as cascades. The standard architecture is:

```
User → Twilio/WebRTC → Deepgram ASR → GPT-4o/Claude → ElevenLabs TTS → User
```

Each component is a separate API call, each adds latency, and the total round-trip is typically 1-3 seconds. The cascade also can't do full-duplex — you need a separate VAD (Voice Activity Detection) module to decide when the user is done speaking, and you can't interrupt the agent mid-sentence.

NemotronLabs VoiceChat collapses this entire stack into one model. One forward pass takes audio in and produces audio out, with the LLM's reasoning embedded in the middle. The result: 448ms turn-taking latency vs. the 1-3s typical of cascades, and genuine full-duplex — the model hears you while it's speaking and can yield instantly.

### Cost economics

For any operation with sustained voice traffic, the self-hosted economics are compelling. Compare:

| Deployment | Cost per conversation hour |
|-----------|--------------------------|
| OpenAI gpt-realtime-2.1 | $3.60–$27.60 (depends on caching + reasoning level) |
| OpenAI gpt-realtime (flagship) | $11.08+ |
| xAI Grok Voice Agent | $3.00 |
| **NemotronLabs VoiceChat (self-hosted)** | **GPU amortization only** |

A single H100 80GB rented on a cloud GPU marketplace runs ~$2-3/hour. If you're running voice agents for customer service, internal tools, or research workflows with more than a few concurrent sessions, self-hosting a model with no per-minute API charges changes the economics fundamentally.

### The OpenAI Realtime API compatibility angle

The WebSocket protocol is OpenAI Realtime API-compatible. This is not a coincidence — it means existing client libraries, orchestration frameworks (Pipecat, LiveKit Agents), and deployment patterns can connect to a self-hosted VoiceChat server with minimal code changes. You swap the WebSocket URL from `wss://api.openai.com/v1/realtime` to `ws://your-host:9000/v1/realtime` and your client works.

This is the strategic play: NVIDIA is making it possible to drop in a self-hosted replacement for the OpenAI Realtime API with a single container deploy. If the model quality is sufficient for your use case, you can eliminate your OpenAI voice API bill entirely.

### What's blocking adoption right now

**1. Hardware requirements.** 80GB VRAM, x86_64 only, NVIDIA-only. This rules out:
- DGX Spark (ARM64, 128GB unified memory — architecture mismatch)
- AMD Strix Halo / Radeon 8060S (ROCm, not CUDA)
- Consumer GPUs with <80GB VRAM (RTX 4090 at 24GB, etc.)

You need an A100 80GB, H100 80GB, RTX 6000 Pro, or B200. These are data center cards, not workstation hardware.

**2. Model maturity.** The known limitations are serious enough that this model is not ready for production customer-facing deployments. Runaway self-talk, gibberish loops, 2-minute context windows, and intermittent tool-calling failures are showstoppers for a customer service bot. For research, experimentation, and internal tooling with human supervision, it's viable today.

**3. No voice cloning.** A single fixed voice means you can't brand the agent's voice to match your product. Custom training is possible (the code is open) but requires the speech training pipeline and data.

**4. 2-minute context.** For any conversation longer than 2 minutes, the model may not retain earlier context. This limits it to short interactions or requires a separate context management layer.

### The trajectory

This is v1. The architecture is sound — the separation of encoder and codec, the hybrid Mamba/Transformer backbone, the OpenAI-compatible protocol, and the tool-calling design are all the right decisions. The limitations are implementation maturity issues, not fundamental architectural flaws.

What I expect to see in v2 and beyond:
- Longer context windows (the Mamba backbone scales linearly — extending context is a training data problem, not an architecture problem)
- ARM64 container support (the codebase already builds on ARM; the container just hasn't been published for that target)
- Voice cloning support (the architecture supports it via codec fine-tuning; the released checkpoint just doesn't include it)
- Multi-tool calling and interruptible tool execution
- The reasoning quality of the base Nemotron Nano 9B V2 preserved through the speech adaptation

The OpenMDW 1.1 license is permissive — commercial use is allowed. When the maturity issues are addressed, this architecture is a credible path to self-hosted voice agents that don't depend on any per-minute API.

---

## What it would take for us to run it

On our current hardware at SMF Works, neither the DGX Spark (ARM64, 128GB UMA) nor the Strix Halo (AMD ROCm, Radeon 8060S) can run the optimized container. The offline conda path on DGX Spark is the only theoretically viable path, and it would require:

1. Building `mamba-ssm` and `causal-conv1d` from source on ARM64 with the GB10's CUDA toolkit
2. Verifying torch 2.10.0 compatibility with the GB10 driver stack
3. Testing whether the model fits in 128GB unified memory (the ~66GB runtime footprint is within range, but CUDA memory allocation on Grace is different from discrete GPU VRAM)
4. Accepting batch-only inference (no real-time streaming — the container path is blocked)

This would be a research exercise, not a production deployment. The expected outcome is uncertain enough that I'd recommend waiting for either:
- NVIDIA to publish an ARM64 container (possible, not announced)
- A v2 release that addresses the conversation stability issues
- Access to an x86_64 NVIDIA box with ≥80GB VRAM

If we were to acquire an H100 or A100 system, this model would be a day-one deployment target. The OpenAI Realtime API compatibility means we could wire it into existing voice agent infrastructure with minimal effort.

---

## The bottom line

NemotronLabs VoiceChat 11B is the most significant open-source voice model release of 2026. It proves that a single unified architecture can achieve full-duplex conversation with tool calling at competitive latency — and it's all open, from the training code to the inference container to the model weights.

It's not production-ready. The limitations are real and well-documented. But it's the beginning of a paradigm shift away from cascaded voice agents toward unified end-to-end models, and it's the first model that makes self-hosted voice agents with tool calling a credible alternative to the OpenAI Realtime API.

For infrastructure teams, the action items are:

1. **Track this model.** Watch for v2 releases and ARM64 container support.
2. **Evaluate your hardware.** If you have an A100/H100/B200, you can run this today. If you don't, start planning for it.
3. **Test the protocol compatibility.** The OpenAI Realtime API-compatible WebSocket means you can prototype your client infrastructure against OpenAI now and swap in VoiceChat later.
4. **Read the SALM-Duplex paper.** The architectural decisions (encoder/codec separation, channel fusion, text-before-speech delay) are well-reasoned and will inform the next generation of voice models.

The cascade era is ending. This is what comes next.

---

## Verification notes

Every external fact in this post was verified on August 6, 2026:

- **Model details**: Sourced from the [HuggingFace model page](https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B) and the [GitHub README](https://github.com/NVIDIA-NeMo/Speech/tree/nemotron-labs-voicechat) (nemotron-labs-voicechat branch).
- **Architecture**: Cross-referenced against the [SALM-Duplex paper](https://arxiv.org/abs/2505.15670) (arXiv:2505.15670, Interspeech 2025) and the [Full-Duplex-Bench paper](https://arxiv.org/abs/2503.04721) (arXiv:2503.04721, ASRU 2025).
- **Benchmark scores**: From the HuggingFace model card, which reports VoiceBench #2 and Full-Duplex-Bench 1.0 #2 among open models. Specific metrics (448ms latency, 1.0 interruption TOR) from the model card's benchmark table.
- **Hardware requirements**: From `voicechat_realtime_instructions/prerequisites.md` in the repo — x86_64 only, ≥80GB VRAM, supported GPU list.
- **Deployment commands**: From `voicechat_realtime_instructions/deploy.md` and the README quickstart section.
- **API protocol**: From `voicechat_realtime_instructions/api-reference.md` — WebSocket endpoints, audio format parameters, event types.
- **Known limitations**: From the README "Known Limitations" section, quoted directly.
- **License**: Apache 2.0 (code), OpenMDW 1.1 (model weights) — verified from the repo LICENSE files.
- **Competitive pricing**: OpenAI Realtime API pricing from [Forasoft's analysis](https://www.forasoft.com/blog/article/openai-realtime-api-pricing) (captured July 2026) and OpenAI's pricing page. Grok Voice pricing from [Impekable's comparison](https://www.impekable.com/blog/grok-voice-vs.-openai-realtime). Gemini from [Flowtivity's comparison](https://flowtivity.ai/blog/gemini-3-1-flash-live-vs-gpt-realtime-1-5-voice-agent-comparison-2026).
- **Release date**: August 3, 2026, from the HuggingFace model card.