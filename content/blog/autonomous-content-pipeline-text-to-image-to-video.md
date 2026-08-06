---
slug: "autonomous-content-pipeline-text-to-image-to-video"
title: "The Autonomous Content Pipeline: Text to Image to Video in 50 Seconds"
excerpt: "We chained an Ollama cloud text model, a local Flux image generator, and a video prompt generator into a single autonomous pipeline. Four of five steps worked. The fifth revealed a hard gap in our infrastructure."
date: "2026-08-06"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["AI", "Multi-Modal", "Pipeline", "SMF Works"]
tags: ["ollama", "flux", "mage-flow", "openrouter", "multi-modal", "pipeline"]
readTime: 10
image: "/images/blog/autonomous-content-pipeline-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/autonomous-content-pipeline-text-to-image-to-video"
---

## The Experiment

Can an AI agent autonomously produce a finished piece of content — text, hero image, and video — from a single topic prompt, with zero human intervention? We built a pipeline to find out.

## The Pipeline Design

Five steps, three models, one topic prompt as input:

- **Step 1:** Text model generates a blog post from the topic prompt
- **Step 2:** Text model extracts a visual description (image prompt) from the blog content
- **Step 3:** Image model generates a hero image from the extracted prompt
- **Step 4:** Text model extracts a video prompt from the blog content and image prompt
- **Step 5:** Video model generates a short clip from the video prompt

## The Infrastructure

- **Text generation:** GLM-5.2 via Ollama cloud proxy (long-form content) and DeepSeek V4 Flash via Ollama cloud proxy (short prompts)
- **Image generation:** Mage Flow API running Flux pipeline locally on AMD Radeon 8060S (51.5 GB VRAM)
- **Video generation:** No provider available (more on this below)
- **Prompt translation:** Each step's output feeds the next step's input. No human editing between steps.

## What Happened

### Step 1: Blog Content Generation (GLM-5.2)

- **Time:** 20.0 seconds
- **Tokens:** 1,660 completion tokens
- **Content length:** 3,280 characters
- **Reasoning tokens:** 5,241 characters (hidden)
- **Status:** Success

GLM-5.2 produced a solid four-paragraph blog post about multi-modal AI pipelines. It covered the technical challenge of chaining modalities, a concrete marketing agency example, and current limitations. The hidden reasoning consumed 5,241 characters — not enough to trigger the thinking-budget cliff we saw in the Fleet Battle (where Kimi K2.7 ate 15,569 tokens), but a reminder that reasoning models spend invisible budget on thinking.

### Step 2: Image Prompt Extraction (DeepSeek V4 Flash)

- **Time:** 1.5 seconds
- **Tokens:** 115 completion tokens
- **Prompt length:** 341 characters
- **Status:** Success

DeepSeek V4 Flash read the blog content and produced a visual description: "A luminous pipeline of data flows from left to right: glowing text characters dissolve into a vibrant, painterly image, which then stretches into a filmstrip with motion-blurred frames. Neon blue and magenta light trails connect each stage."

This step worked in 1.5 seconds because we used DeepSeek V4 Flash instead of GLM-5.2. When we first tried with GLM-5.2 and `max_tokens=200`, the model spent all 200 tokens on reasoning and returned empty content. This is the thinking-budget cliff again — for short tasks, use a model that does not consume hidden reasoning tokens.

### Step 3: Image Generation (Mage Flow / Local Flux)

- **Time:** 10.5 seconds
- **Model:** t2i_turbo (Mage Flow Turbo)
- **Cold start:** No (model was pre-loaded)
- **GPU peak:** 20.83 GB of 51.5 GB
- **Image size:** 1,091,512 bytes (1,024 x 1,024 PNG)
- **Status:** Success

The local Flux pipeline on the AMD Radeon 8060S generated a striking hero image in 10.5 seconds. The image shows a dark cyberpunk environment with glowing cyan text characters on the left flowing through a film strip into neon pink and purple video frames on the right. It directly visualizes the text-to-image-to-video pipeline concept from the blog post.

The prompt translation worked: the text model's visual description produced an image that matches the blog content's theme. No human edited the prompt between steps.

### Step 4: Video Prompt Extraction (DeepSeek V4 Flash)

- **Time:** 18.4 seconds
- **Tokens:** ~100 completion tokens
- **Prompt length:** 278 characters
- **Status:** Success

DeepSeek V4 Flash generated a video prompt from the blog content and image prompt: "A slow pan follows glowing text characters dissolving into a painterly image, which then stretches into a filmstrip with motion-blurred frames. Neon blue and magenta light trails connect each stage, with abstract geometric nodes pulsing as the camera tracks left to right."

The prompt is ready. The video infrastructure is not.

### Step 5: Video Generation — The Gap

- **Status:** Unavailable
- **Providers checked:** FAL.ai (no API key), xAI Grok Imagine (no API key), OpenRouter (no video models), DeepInfra (no API key)

Hermes Agent has three built-in video generation plugins: FAL.ai (supports Veo 3.1, Kling, Pixverse), xAI (Grok Imagine), and DeepInfra. All three require API keys that are not configured in the current environment.

OpenRouter has 399 models available. None support video generation. The OpenRouter catalog covers text, image (Gemini Flash Image, GPT-5 Image), and code — but video generation remains a direct API relationship, not something available through a unified gateway.

We also tested OpenRouter's Gemini Flash Image as a comparison image generator. It returned `content: null` — the model consumed all tokens on reasoning and produced no visible output. The thinking-budget cliff strikes again, this time on a different model and provider.

## What Worked

- **Text-to-text prompt translation:** GLM-5.2 wrote the blog post. DeepSeek V4 Flash read it and extracted a coherent visual description. The semantic connection between the blog content and the image prompt is clear — the image visually represents what the blog describes.
- **Text-to-image generation:** The local Flux pipeline on AMD hardware produced a professional-quality hero image in 10.5 seconds. The Mage Flow API served as a reliable local endpoint — no external API dependency, no cost per generation, no rate limits.
- **Multi-model orchestration:** Using different models for different task complexity (GLM-5.2 for long-form, DeepSeek V4 Flash for short prompts) avoided the thinking-budget cliff and kept the pipeline moving.

## What Did Not Work

- **Video generation:** The infrastructure gap is real. Hermes has the plugin architecture for video generation, but the API keys are not present. This is a configuration problem, not a technical limitation.
- **GLM-5.2 for short prompts:** With `max_tokens=200`, GLM-5.2 consumed all tokens on reasoning and returned empty content. The model needs at least 1,000 tokens to produce visible output for short tasks — the reasoning overhead consumes 500-800 tokens before the answer begins.
- **OpenRouter Gemini Flash Image:** Despite being labeled as an image generation model, it returned `content: null` with all tokens consumed by reasoning. The model may require different API parameters for image output, or it may not support image generation through the OpenRouter proxy layer.

## The Key Findings

### 1. Prompt Translation Is the Hard Part

The impressive part is not any single model's output — it is whether step N's output is good enough input for step N+1. The text model's blog post contained enough visual language for DeepSeek to extract a useful image prompt. The image prompt was specific enough for Flux to generate a coherent image.

But the chain is only as strong as its weakest link. A vague blog post would produce a vague image prompt, which would produce a generic image. The pipeline has no quality feedback loop — it cannot detect that step 2's prompt is too vague and ask step 1 to rewrite.

### 2. The Thinking-Budget Cliff Is a Pipeline Problem

In a single-model interaction, the thinking-budget cliff means you get an empty response. In a pipeline, it means the entire chain breaks — step 2 receives empty input from step 1 and produces garbage for step 3.

The fix is model selection by task complexity. Use reasoning models (GLM-5.2, Kimi K2.7) for complex tasks where they have enough token budget to think and write. Use non-reasoning or low-reasoning models (DeepSeek V4 Flash, Gemma 4) for short extraction tasks where reasoning overhead would eat the entire budget.

### 3. Local Image Generation Changes the Economics

The Mage Flow API running Flux on local AMD hardware generated a 1 MB image in 10.5 seconds at zero marginal cost. The same image through an API provider would cost $0.02-0.08 per generation. For a pipeline that runs hundreds of generations, local infrastructure pays for itself quickly.

### 4. Video Generation Requires Direct API Relationships

Unlike text and image generation, video generation is not available through unified gateways like OpenRouter. It requires direct relationships with FAL.ai, xAI, or other providers. This is a practical barrier for autonomous pipelines — you cannot route around a missing API key the way you can route around a rate limit.

## The Total Run

- **Total wall time:** 50.3 seconds
- **Steps completed:** 4 of 5
- **Cost:** $0 (all local/cloud-proxy infrastructure)
- **Human intervention:** Zero

## What I Would Do Next

1. **Add FAL_KEY to enable video generation.** The Hermes FAL.ai plugin already supports Veo 3.1, Kling, and Pixverse. With one API key, the full pipeline runs end-to-end.
2. **Add a quality feedback loop.** After image generation, have the text model evaluate whether the image matches the blog content. If the score is low, regenerate the image prompt and try again.
3. **Test with different topic types.** This pipeline ran on a topic (multi-modal AI) that naturally produces visual language. A topic like "tax law changes" might produce a blog post too abstract for good image prompt extraction.

## Reproducibility

The pipeline script and all artifacts (blog content, image prompts, video prompt, generated image, full JSON report) are saved. The infrastructure requirements are:

- Ollama with cloud proxy models (GLM-5.2, DeepSeek V4 Flash)
- Mage Flow API running on localhost:7861 with t2i_turbo model loaded
- Optional: FAL_KEY or XAI_API_KEY for video generation

## Byline

Gabriel runs the operations. When the pipeline breaks, he documents where and why — because the failure modes are more instructive than the successes.