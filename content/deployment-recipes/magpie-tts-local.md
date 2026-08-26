---
slug: magpie-tts-local
title: Deploy NVIDIA Magpie TTS Multilingual Locally
excerpt: Run NVIDIA's 357M open-weight text-to-speech model on your own GPU for low-latency multilingual voice agents — 12 languages, 32ms time-to-first-audio on B200.
category: Model Serving
tags:
  - nvidia
  - tts
  - voice-agents
  - self-hosting
  - open-weights
  - multilingual
order: 100
last_verified: "2026-08-26"
difficulty: Intermediate
estimated_time: "30 min"
---

# Deploy NVIDIA Magpie TTS Multilingual Locally

## The promise

NVIDIA released Magpie TTS Multilingual as open weights under the NVIDIA Open Model License (commercial use permitted). It is a 357M-parameter transformer encoder-decoder that synthesizes speech in 12 languages using 5 English speaker voices. On an NVIDIA B200, time-to-first-audio is 32ms — fast enough for real-time conversational voice agents. Running it locally eliminates cloud TTS API round trips, giving you full control over latency, privacy, and cost.

## What you will get

- A local Magpie TTS inference server generating speech from text
- Support for 12 languages: English, Spanish, German, French, Italian, Vietnamese, Mandarin, Hindi, Japanese, Arabic, Korean, Portuguese
- 5 English speaker voices (Aria, Jason, Leo, Sofia, John Van Stan)
- No per-character or per-request API costs
- Full deployment control — no data leaves your infrastructure

## Prerequisites

- **NVIDIA GPU:** A10, A30, A100, or H100 (NeMo framework). For CPU-only deployment, use the magpie-tts.cpp port.
- **NVIDIA drivers and CUDA 12+** (for GPU inference)
- **Python 3.10+** with pip
- **Docker** (recommended for NeMo deployment)

## Steps

### Option A: Deploy with NeMo Framework (GPU)

### 1. Pull the model from HuggingFace

```bash
pip install huggingface-hub
huggingface-cli download nvidia/magpie_tts_multilingual_357m --local-dir ./magpie-tts
```

The model is 357M parameters. The full-precision checkpoint is approximately 1.3GB.

### 2. Install NeMo Speech Framework

```bash
pip install nemo-toolkit[asr,tts]
```

NeMo 25.11 or later is required for Magpie TTS Multilingual support.

### 3. Write the inference script

```python
import torch
from nemo.collections.tts.models import MagpieTTSModel

# Load the model
model = MagpieTTSModel.from_pretrained("nvidia/magpie_tts_multilingual_357m")
model.eval()

# Set device
if torch.cuda.is_available():
    model = model.to("cuda")

# Generate speech
text = "Hello, this is a test of the Magpie TTS multilingual model."
audio = model.generate(text, speaker="Aria")

# Save output
model.save_audio("output.wav", audio)
print("Saved output.wav")
```

### 4. Serve as an API

```python
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from nemo.collections.tts.models import MagpieTTSModel

app = FastAPI()
model = MagpieTTSModel.from_pretrained("nvidia/magpie_tts_multilingual_357m")
if torch.cuda.is_available():
    model = model.to("cuda")
model.eval()

class TTSRequest(BaseModel):
    text: str
    speaker: str = "Aria"
    language: str = "en"

@app.post("/tts")
def tts(req: TTSRequest):
    audio = model.generate(req.text, speaker=req.speaker)
    path = f"/tmp/tts_{req.speaker}.wav"
    model.save_audio(path, audio)
    return {"audio_path": path}
```

Run with: `uvicorn server:app --host 0.0.0.0 --port 8000`

### Option B: Deploy with magpie-tts.cpp (CPU)

### 1. Clone the C++ inference engine

```bash
git clone https://github.com/mudler/magpie-tts.cpp
cd magpie-tts.cpp
```

### 2. Download GGUF weights

```bash
# Q8_0 quantization (624MB) — recommended for quality
huggingface-cli download mudler/magpie-tts-multilingual-357m-GGUF \
  --local-dir ./weights --include "*q8_0*"
```

### 3. Build and run

```bash
mkdir build && cd build
cmake .. && make -j

# Generate speech
./magpie-tts --model ../weights/magpie-tts-multilingual-357m-q8_0.gguf \
  --text "Hello, this is a test." \
  --output output.wav
```

The C++ port runs on CPU with no CUDA or Python dependency. It is orders of magnitude faster than the NeMo reference pipeline on CPU and numerically parity-gated against NeMo output.

## Verification

- The generated WAV file plays intelligible speech in the requested language
- `nvidia-smi` shows the model loaded in GPU memory (if using GPU path)
- A latency test shows time-to-first-audio under 100ms on A100/B200 (32ms on B200)
- A round-trip test: generate speech, run it through an ASR model, verify the transcription matches the input text

## Troubleshooting

- **NeMo import errors:** Ensure you installed `nemo-toolkit[asr,tts]`, not just `nemo-toolkit`. The TTS collection has separate dependencies.
- **CUDA out of memory:** Magpie TTS is only 357M parameters — it should fit comfortably on any modern GPU. If you see OOM, another process is likely using the GPU. Run `nvidia-smi` to check.
- **Audio quality issues:** Try different speakers. The 5 voices have different characteristics. Aria and Jason are the most neutral. Also ensure your text is in a supported language — the model handles code-switching (e.g., English terms in Japanese sentences) but works best with clean monolingual input.
- **magpie-tts.cpp build failures:** The C++ port requires a C++17 compiler (GCC 9+, Clang 10+). On older systems, use the NeMo Python path instead.
- **G2P errors for non-English languages:** Magpie uses grapheme-to-phoneme dictionaries for each language. If a language is not working, verify you have the correct model version — v2607 (July 2026) added Arabic, Korean, and Portuguese. Earlier versions support 9 languages.

## Honest notes

- **NeMo framework has a learning curve.** The NeMo Speech framework is powerful but not lightweight. If you only need TTS and not the full NeMo ecosystem, magpie-tts.cpp is simpler to deploy.
- **CPU inference is viable but slower.** The magpie-tts.cpp port makes CPU inference practical, but latency will be higher than GPU. For real-time voice agents, you need GPU inference.
- **5 voices only.** Magpie TTS Multilingual ships with 5 English speaker voices. If you need custom voices, voice cloning is not supported out of the box — you would need to fine-tune the model.
- **NVIDIA Open Model License is not Apache 2.0.** It permits commercial use but has specific terms. Read the license before deploying in a commercial product. The key difference from Apache 2.0 is that NVIDIA's license includes acceptable-use restrictions.
- **The model is 357M, not 3.5B.** It is a compact TTS model, not a large language model. Its job is speech synthesis, not reasoning. You still need a separate LLM for the conversational intelligence in a voice agent pipeline.