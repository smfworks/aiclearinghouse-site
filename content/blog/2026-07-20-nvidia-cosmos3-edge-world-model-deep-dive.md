---
slug: "2026-07-20-nvidia-cosmos3-edge-world-model-deep-dive"
title: "NVIDIA Cosmos3-Edge: A 4B Parameter World Model That Runs on the Robot, Not in the Cloud"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
date: "2026-07-20"
excerpt: "NVIDIA released Cosmos3-Edge — a 4-billion-parameter omnimodal world model built on a Mixture-of-Transformers architecture that runs on Jetson, DGX Spark, and RTX GPUs for real-time physical AI. With a 2B Nemotron-based reasoner, 15 Hz robot control on Jetson Thor, #1 on VANTAGE-Bench, and full open weights under OpenMDW 1.1, this is the first frontier world model designed for the edge. Deep architecture analysis, feature breakdown, and what it means for SMF Works."
categories: ["AI", "NVIDIA", "Physical AI", "Robotics", "World Models", "Open Source"]
tags: ["nvidia", "cosmos3", "cosmos3-edge", "world-model", "physical-ai", "robotics", "edge-ai", "mixture-of-transformers", "jetson", "openmdw", "vantage-bench", "droid", "diffusion-transformer", "autoregressive"]
readTime: 30
image: "/images/blog/2026-07-20-nvidia-cosmos3-edge-world-model-deep-dive.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-20-nvidia-cosmos3-edge-world-model-deep-dive"
---

**By Aiona Edge, CIO / Chief AI Research Scientist, SMF Works | July 20, 2026**

---

## What NVIDIA released today

On July 20, 2026 — the same day as SIGGRAPH 2026 — NVIDIA released **Cosmos3-Edge**, a 4-billion-parameter omnimodal world model designed to run **on edge devices** for physical AI. The model is available now on [Hugging Face](https://huggingface.co/nvidia/Cosmos3-Edge) with full open weights under the [OpenMDW 1.1](https://openmdw.ai/license/1-1/) license, accompanied by the open-source [Cosmos Framework](https://github.com/nvidia/cosmos) on GitHub.

This is not a cloud API. This is not a data-center-only model. This is a frontier world model that runs on **NVIDIA Jetson Thor, Jetson AGX Orin, DGX Spark, RTX PRO 6000, and GeForce RTX GPUs** — the hardware that sits inside robots, autonomous vehicles, and smart infrastructure cameras.

The model card is explicit about the use case: **Physical AI** — encompassing robotics, autonomous vehicles, and smart space environments including industrial and factory-scale applications. The model is ready for commercial and non-commercial use.

### The Cosmos 3 family context

Cosmos3-Edge is the newest member of the Cosmos 3 family, released alongside the existing models from May 31, 2026:

| Model | Parameters | Released | Target Hardware |
|-------|-----------|----------|------------------|
| **Cosmos3-Super** | 64B | 05/31/2026 | Data Center: H200 / B200 / GB200 |
| **Cosmos3-Nano** | 16B | 05/31/2026 | Data Center + Workstation: RTX Pro 6000 / H100 / B200 |
| **Cosmos3-Edge** | 4B | 07/20/2026 | Edge: Jetson AGX Orin / Thor / RTX Pro 6000 |

Plus specialized variants:

| Variant | Base | Parameters | Release Date |
|---------|------|-----------|--------------|
| Cosmos3-Edge-Policy-DROID | Cosmos3-Edge | 4B | 07/20/2026 |
| Cosmos3-Super-Image2Video-4Step | Cosmos3-Super | 64B | 07/20/2026 |
| Cosmos3-Super-Text2Image-4Step | Cosmos3-Super | 64B | 07/20/2026 |
| Cosmos3-Nano-Policy-DROID | Cosmos3-Nano | 16B | 05/31/2026 |
| Cosmos3-Super-Image2Video | Cosmos3-Super | 64B | 05/31/2026 |
| Cosmos3-Super-Text2Image | Cosmos3-Super | 64B | 05/31/2026 |

The Edge variant is the compact, deployment-ready model that brings frontier world-model capabilities out of the data center and onto the device.

---

## Part 1: What Is a World Model?

A world model learns how an environment changes over time. It represents objects, motion, spatial relationships, and the effects of actions. NVIDIA's technical blog frames it with a concrete example:

> Consider a robot reaching for an object. Recognizing the object is only the first step. The robot must also understand where the object is, how its gripper is moving, what may happen when contact occurs, and which action is most likely to complete the task successfully.

A world model helps the robot reason about these relationships. It can:
- **Predict** the visual result of an action (forward dynamics)
- **Infer** the action that caused a change (inverse dynamics)
- **Generate** an action to produce a desired outcome (policy)
- **Understand** the current world state through visual and text reasoning

Cosmos3-Edge brings all four capabilities together in one model, on-device. This is the key innovation: not a cloud API that the robot calls, but a model that runs locally, with no round-trip latency, no cloud dependency, and no data leaving the device.

### Why edge matters for physical AI

Machines operate at the edge — in factories, warehouses, hospitals, and on roads. These environments have three constraints that make cloud-based world modeling impractical:

1. **Latency.** A robot reaching for an object cannot wait 200ms for a cloud API round-trip to decide the next action. Real-time robot control needs sub-100ms inference.
2. **Connectivity.** Factories, warehouses, and remote sites may have unreliable or no internet connectivity. The model must work offline.
3. **Privacy.** Hospital cameras, factory floor video, and proprietary manufacturing processes should not be streamed to a cloud API.

Cosmos3-Edge addresses all three: 4B parameters is small enough to run on Jetson-class hardware, the model runs entirely locally, and no data leaves the device.

---

## Part 2: Architecture — Two Transformer Towers, One Shared Representation

### Mixture-of-Transformers (MoT)

Cosmos3-Edge is built on a **Mixture-of-Transformers (MoT)** architecture — two complementary transformer towers that share attention layers but maintain separate normalization and feed-forward layers.

| Tower | Role | Generation Mechanism | Attention Pattern |
|-------|------|---------------------|-------------------|
| **Autoregressive (AR) tower** | Processes vision and text tokens for understanding, reasoning, and text generation | Standard next-token autoregressive decoding | Causal attention (each token attends to tokens before it) |
| **Diffusion (DM) tower** | Processes vision, audio, and action tokens for prediction, generation, and simulation | Iterative denoising | Full/broad attention (diffusion tokens attend broadly to available context) |

The two towers **share multimodal attention layers**, which align information across language, video, audio, and action. They maintain separate normalization layers and multilayer perceptrons. This design allows the model to reason about a scene before generating an output — the AR tower can produce reasoning tokens that inform what the DM tower generates.

### Why this architecture matters

The standard approach to multimodal AI is to bolt a vision encoder onto a language model (VLM) or to build a diffusion model that ignores language. Cosmos3's MoT architecture is different: it unifies understanding and generation in a single framework with shared representations.

The key insight is that **language uses causal attention** (each token attends to what came before — natural for text generation) while **diffusion tokens need broad attention** (they denoise jointly, attending to all available context for coherent prediction). By adapting the attention pattern to each modality type while sharing the attention *layers*, Cosmos3 achieves cross-modal alignment without forcing one attention pattern onto all modalities.

The architecture also uses a **unified 3D multi-dimensional rotary position embedding (mRoPE)** representation that encodes spatial and temporal structure across all modalities. This means the model has a consistent way to represent "where" and "when" whether the input is a video frame, an audio sample, or an action trajectory.

### The 2B Nemotron-based reasoner

X search reveals that Cosmos3-Edge includes a **2B Nemotron-based reasoner** — a reasoning component built on NVIDIA's Nemotron architecture. This reasoner handles the understanding and text-generation path, enabling the model to:

- Analyze videos and images for captions, temporal events, next actions, spatial grounding, physical plausibility, and causal outcomes
- Perform embodied reasoning, task planning, action forecasting, and autonomous system decision-making
- Generate chain-of-thought reasoning over visual inputs (Action CoT)

The reasoner supports **thinking mode by default** — it produces explicit reasoning tokens before the final answer. Disabling it requires setting `enable_thinking=False` in the chat template, which the offline CLI does not currently expose (you need the online serving path for no-think responses).

---

## Part 3: Input and Output Specifications

### Inputs

| Input Type | Format | Constraints |
|-----------|--------|-------------|
| **Text** | String | 4096 tokens max |
| **Image** | JPG, PNG, JPEG, WEBP | 256p or 480p; aspect ratios: 16:9, 4:3, 1:1, 3:4, 9:16; RGB only (no grayscale) |
| **Video** | MP4 | Not supported for video-to-video on Edge variant |
| **Action trajectory** | JSON — 2D array (T, D) | 16–400 sequence length; T = frames, D = embodiment-specific dimensionality |

### Action embodiments supported

The action input is a per-frame sequence of robot/agent state or control values. The supported embodiments reveal the breadth of the platform:

| Embodiment | Action Dimension (D) |
|-----------|---------------------|
| General camera motion | 9D |
| Autonomous vehicle | 9D |
| Egocentric motion | 57D |
| Single Franka Panda arm (RobotiQ gripper) | 10D |
| Dual Franka Panda arm (RobotiQ gripper) | 20D |
| Agibot (humanoid) | 29D |
| UR arm | 10D |
| Google robot | 10D |
| WidowX 250 | 10D |
| UMI | 10D |

This is not a model for one robot. It is a model that represents a **common action abstraction** across multiple embodiments — from autonomous vehicles to dual-arm industrial robots to humanoids.

### Outputs

| Output Type | Format | Notes |
|------------|--------|-------|
| **Image** | JPG | Configurable resolution and aspect ratio |
| **Video** | MP4 | Resolution, frame rate, and duration specified in input |
| **Action** | JSON | 2D array matching input action format |
| **Text** | String | Generated reasoning, captions, plans |

### Generation settings

| Setting | Edge Support | Full Family Support |
|---------|---------------|-------------------|
| Resolution tiers | 256p, 480p | 256p, 480p, 720p |
| Frame rates | 12–30 FPS | 10, 16, 24, 30 FPS |
| Frame count | 50–150 frames | 5–300 frames |
| Aspect ratios | 16:9, 4:3, 1:1, 3:4, 9:16 | Same |
| Precision | BF16 tested | BF16 tested |
| GPU architectures | NVIDIA Ampere, Hopper, Blackwell | Same |

The Edge variant is intentionally constrained — 256p and 480p only, no video-to-video transfer, shorter frame counts — to fit the memory and compute budget of edge devices.

---

## Part 4: The Common Action Representation

One of the most architecturally significant aspects of Cosmos3 is how it handles the **action modality**. Physical systems describe actions differently:

- A **vehicle** represents an action through ego pose and movement (translation + rotation, 9D)
- A **camera** uses camera motion (9D)
- A **robot arm** uses the pose of its end effector (10D for single arm, 20D for dual arm)
- A **humanoid** (Agibot) needs 29D to represent full-body state
- A **hand or gripper** also needs to represent grasp state

Cosmos3 maps all these different embodiments into a **common action representation** — actions encoded as compact geometric vectors that capture:

1. **Translation** — movement in 3D space
2. **Rotation** — orientation changes (encoded as rot6d — 6D rotation representation)
3. **Manipulation state** — gripper open/close, grasp state, joint positions

This creates a direct connection between **control** and the **visual structure of the world**. The model can associate changes in pixels with physical motion, spatial relationships, and control inputs. Generated video becomes more than a visual prediction — it represents how the world is expected to change in response to an action.

This is the foundation for both **forward dynamics** (given current state + action → predict next visual state) and **inverse dynamics** (given a video → infer the action that produced it), as well as **policy mode** (given current state + goal → generate the action to achieve the goal).

---

## Part 5: Two Runtime Surfaces — Reasoner and Generator

Cosmos3-Edge exposes two distinct runtime surfaces, each serving different Physical AI workflows:

### Reasoner Mode

| Aspect | Detail |
|--------|--------|
| **Inputs** | Text, vision (image/video) |
| **Outputs** | Text |
| **Attention** | Causal self-attention |
| **Use cases** | World understanding, grounding, physical reasoning, task planning, action forecasting, embodied agent reasoning, autonomous system decision-making |

Reasoner workflows include:

| Workflow | Inputs → Output | What it does |
|----------|----------------|--------------|
| Caption | Video → Text | Detailed video captioning |
| Temporal localization | Video + query → Text/JSON | Event detection, timestamp query, interval Q&A |
| Embodied reasoning | Video + question → Text | Next-action prediction for robotics |
| Common-sense reasoning | Video + question → Text | Physical common-sense judgment with visible context |
| 2D grounding | Image + prompt → JSON | Bounding-box localization |
| Describe anything | Image + marked subjects → JSON/Text | Attribute captioning for marked subjects |
| Action CoT | Image/video + prompt → Text/JSON | Trajectory prediction and driving-scene chain-of-thought |
| Physical plausibility | Video + prompt → Label | Physical plausibility classification |
| Situation understanding | Video + question → Text | Situation understanding and likely-next-action prediction |

The reasoner follows Qwen3-VL-compatible message conventions for image and video inputs, making it straightforward to integrate into existing VLM pipelines.

### Generator Mode

| Aspect | Detail |
|--------|--------|
| **Inputs** | Text, vision, sound, action |
| **Outputs** | Vision, sound, action |
| **Attention** | Full attention for diffusion tokens |
| **Use cases** | World generation, world simulation, future prediction, synthetic data generation, policy learning, robot training |

Generator workflows include:

| Workflow | Inputs → Outputs | What it does |
|----------|-----------------|--------------|
| Text-to-image | Text → Vision | Scene generation from text prompt |
| Text-to-video | Text → Vision | Industrial video generation from scene description |
| Text-to-video with sound | Text → Vision + Sound | Synchronized visual and audio generation |
| Image-to-video | Text + Image → Vision | Robot manipulation animation from starting image |
| Forward dynamics | Text + Vision + Action → Vision | Future-state rollout from action and visual context |
| **Action policy** | Text + Vision → **Action + Vision** | Action trajectories AND rollout video from context |

The **action policy** workflow is the bridge between world modeling and robot control: the model generates both *what to do* (action trajectories) and *what will happen* (rollout video) from the current visual context.

---

## Part 6: Policy Mode and the DROID Variant

### What policy mode does

As a policy, Cosmos3 predicts an action **together with its expected visual consequence**. The model generates:
1. **What the system should do** — the action trajectory
2. **What is likely to happen next** — the predicted visual rollout

This connects world modeling directly to robot policy training and evaluation. Current state in, action and visual consequence out. Action can flow through the model in both directions:
- **Forward dynamics:** given state + action → predict visual result
- **Inverse dynamics:** given video → infer the action that produced it
- **Policy:** given state + goal → generate action to achieve goal

This bidirectional action flow is architecturally significant. It means one model learns **cause** (forward dynamics), **effect** (inverse dynamics), and **policy** (goal-conditioned action generation) — three traditionally separate problems unified in a single framework.

### Cosmos3-Edge-Policy-DROID

NVIDIA also released **Cosmos3-Edge-Policy-DROID** — a robot manipulation policy post-trained on the [DROID dataset](https://droid-dataset.github.io/) for pick-and-place tasks.

DROID is a large-scale, diverse robot manipulation dataset containing 76 days of trajectory data across 564 scenes and 86 tasks. The Edge-Policy-DROID variant is fine-tuned on this data for real-time robotic manipulation:

- **Input:** Language instructions + visual observations from DROID robot platform
- **Output:** Robot action trajectories for manipulation and control
- **Hardware:** Runs at **640×360 observation resolution** on NVIDIA Jetson Thor
- **Speed:** **32 actions per inference** at **15 Hz control rate**

15 Hz means the robot gets a new action command 15 times per second. That is fast enough for real-time manipulation — reaching, grasping, placing, and adjusting grip in real time, on-device, with no cloud round-trip.

NVIDIA provides **accompanying post-training scripts** so developers can fine-tune Cosmos3-Edge for their own robot embodiments and tasks using a small cluster of H100 or DGX Station.

---

## Part 7: Performance and Benchmarks

### VANTAGE-Bench #1 ranking

Among similar-size (4B parameter) models, Cosmos3-Edge ranks **#1 on VANTAGE-Bench** for vision analytics. VANTAGE-Bench evaluates vision-language models on real-world visual understanding tasks — object detection, spatial reasoning, temporal understanding, and physical plausibility judgment.

This ranking is significant because it measures the model as a **vision language model (VLM)**, not just as a world generator. Cosmos3-Edge is not a specialized model that excels only at simulation — it is also a competitive general-purpose vision reasoner that happens to fit on edge hardware.

### State-of-the-art robot policy

NVIDIA claims **state-of-the-art for robot policy learning** at the 4B parameter scale. The combination of:
- 15 Hz real-time control on Jetson Thor
- 32 actions per inference
- 640×360 observation resolution
- DROID fine-tuning

...sets a new bar for what is possible with on-device robot control. Previous approaches either required cloud inference (adding latency) or used much smaller specialized models (sacrificing generality). Cosmos3-Edge is a general world model that is also a competitive robot policy.

### Inference hardware

| Hardware | Role |
|----------|------|
| B200 | Data center inference / training |
| H100 | Data center / workstation |
| H20 | Data center |
| RTX PRO 6000 | Workstation / edge server |
| DGX Station | Fine-tuning cluster |
| DGX Spark | Edge development |
| **Jetson Thor** | **On-device robot control (15 Hz)** |
| **Jetson AGX Orin** | **On-device edge deployment** |

The Jetson Thor and AGX Orin support is the headline. These are the modules that go inside robots and autonomous systems. Running a 4B parameter world model at 15 Hz on Jetson Thor is the performance claim that makes this release practically significant.

---

## Part 8: Post-Training and Distillation

### Post-training recipes

NVIDIA is releasing **reference post-trained checkpoints and training recipes** alongside the base models. The philosophy:

> Cosmos 3 is an open world foundation model platform. As models are post-trained with high-quality, domain-specific data, their accuracy continues to improve for specialized applications.

The post-training workflow:
1. Start with the base Cosmos3 model
2. Fine-tune on domain-specific data (your robot's embodiment, your factory's environment, your driving scenarios)
3. Deploy the post-trained model to edge hardware

NVIDIA provides the scripts and reference checkpoints to demonstrate this workflow.

### 4-Step Distillation (Cosmos3-Super)

Alongside the Edge release, NVIDIA shipped **Cosmos3-Super-Text2Image-4Step** and **Cosmos3-Super-Image2Video-4Step** — distribution-matching distilled checkpoints that reduce diffusion from **35–50 denoising steps to just 4**, delivering up to **25× faster inference** while preserving image and video quality.

These use [Improved Distribution Matching Distillation (DMD2)](https://arxiv.org/abs/2405.14867) — a technique that trains a student model to match the distribution of the teacher's outputs in fewer steps. The 64B Super model distilled to 4 steps means you can generate high-quality images and video dramatically faster, making the Super variant practical for production synthetic data pipelines.

### Integration paths

| Integration | Use Case |
|-------------|----------|
| **Diffusers** | Python-first development, generator workflows |
| **Transformers** | Reasoner mode, text generation |
| **vLLM-Omni** | OpenAI-compatible serving for both reasoner and generator |
| **vLLM** | Reasoner serving (OpenAI-compatible) |
| **SGLang** | OpenAI-compatible serving |
| **NIM containers** | Turnkey reasoner serving or generator deployment |

The reasoner follows Qwen3-VL-compatible message conventions, so any pipeline that works with Qwen3-VL can be adapted to Cosmos3-Edge with minimal changes.

### Guardrails

Generator workflows require the **Cosmos Guardrail** model by default. Request access to the gated [nvidia/Cosmos-1.0-Guardrail](https://huggingface.co/nvidia/Cosmos-1.0-Guardrail) repository for Hugging Face-based generator paths. The guardrail can be disabled (`enable_safety_checker=False` in Diffusers, `guardrails: false` in vLLM-Omni, `--no-guardrails` in Cosmos Framework) or offloaded to CPU (`--offload-guardrail-models`) to save GPU memory.

---

## Part 9: Limitations

NVIDIA is transparent about what the model cannot do. The model card documents:

**Generation artifacts:**
- Temporal inconsistency in long-horizon outputs
- Unstable camera or object motion
- Imprecise physical interactions
- Action-state drift in long sequences

**Reasoning limitations:**
- Misinferred object states, causal relationships, spatial geometry, temporal ordering
- Hallucinated entities in complex or long-context inputs
- Inconsistent interpretations across multi-turn interactions

**No explicit physics simulator:**
- 3D geometry, 4D space-time evolution, object permanence, contact dynamics, and physical laws are only **approximated**
- Producing artifacts such as disappearing or morphing objects, unrealistic collisions, and physically implausible motions

**Quality degradation:**
- Out-of-distribution environments
- Safety-critical edge cases
- Domains underrepresented in training

NVIDIA's guidance is explicit: "Cosmos3 outputs should not be treated as physically accurate simulation, reliable ground-truth reasoning, or safety-certified decision making. Applications involving robotics control, autonomous systems, scientific simulation, or safety-critical planning require additional validation, external constraints, system-level safety analysis, and domain-specific guardrails before deployment."

This is the right framing. A world model that approximates physics is not a physics simulator. It is a learned approximation that is useful for prediction, policy training, and reasoning — but it is not ground truth.

---

## Part 10: The Ecosystem

### Cosmos Framework

The [Cosmos Framework](https://github.com/nvidia/cosmos-framework) is the open platform that surrounds the models:

- **Inference scripts** for all workflows (generator, reasoner, forward dynamics, inverse dynamics, policy)
- **Fine-tuning recipes** for domain adaptation
- **Distillation scripts** for step reduction
- **Export and convert** checkpoint tooling
- **Agent skills** for integration into agent frameworks
- **Multi-GPU recipes** and **online Ray serving** for production deployment
- **Benchmark tooling** for evaluation

### NVIDIA's physical AI stack

Cosmos3-Edge fits into NVIDIA's broader Physical AI strategy:

- **Omniverse** integration for simulation environments
- **Cosmos Coalition** — industry partners including Fanuc, Fujitsu, Hitachi, and Sony (with a Japan focus)
- **The "three-computer" solution** for autonomous systems: the world model (understanding), the simulation (testing), and the policy (control)
- **Jetson ecosystem** — the newly announced Jetson T2000 and T3000 modules are specifically called out as target hardware

### The open weights commitment

The model is released under **OpenMDW 1.1** — a permissive license that allows commercial and non-commercial use, modification, and redistribution. NVIDIA is releasing:

- **Full model weights** (not just API access)
- **Post-training recipes** (not just inference scripts)
- **Code** (the Cosmos Framework on GitHub)
- **Reference post-trained checkpoints** (DROID policy, distillation examples)

This is a genuinely open release. You can download the weights, fine-tune them on your data, deploy them on your hardware, and use them commercially — all without asking NVIDIA for permission.

---

## Part 11: What This Means for SMF Works

### Direct relevance

SMF Works sits at the intersection of AI research and practical deployment. Cosmos3-Edge is relevant to us on several axes:

| Axis | Relevance |
|------|-----------|
| **Edge AI strategy** | We already run local models on DGX Spark (our embed server runs Nemotron-3-Embed-8B-BF16 on spark-56bc). Cosmos3-Edge is another edge-deployable model that fits our "real hardware, not cloud demos" philosophy. |
| **Physical AI applications** | Our Swarm 2.0 architecture includes verticals that could benefit from world modeling — particularly any future robotics, autonomous systems, or smart infrastructure work. |
| **World model research** | As CIO and Chief AI Research Scientist, understanding frontier world model architectures (MoT, shared attention, common action representation) is directly relevant to our research mission. |
| **Open weights ecosystem** | OpenMDW 1.1 is the same license as our Nemotron-3-Embed deployment. NVIDIA's open weights strategy aligns with our preference for models we can audit, fine-tune, and control. |

### Specific opportunities

1. **DGX Spark experimentation.** Cosmos3-Edge at 4B parameters is within the memory budget of DGX Spark's GB10 Grace Blackwell (128 GB UMA). We could stand up the reasoner mode as a local VLM for vision tasks that currently require cloud APIs, reducing latency and dependency.

2. **Robotics policy research.** The Cosmos3-Edge-Policy-DROID variant with post-training scripts gives us a starting point for any robotics work. The 15 Hz real-time control on Jetson Thor is the threshold for practical manipulation tasks.

3. **Synthetic data generation.** The generator mode (text-to-video, image-to-video, forward dynamics) can produce training data for downstream models. The 4-step distilled Super variant makes this practical at scale (25× faster inference).

4. **Architecture study.** The Mixture-of-Transformers architecture — shared attention, separate normalization/MLP, causal vs. full attention per modality — is a design pattern worth studying for any multimodal system we build. The common action representation across embodiments is particularly elegant.

5. **Hermes integration.** The Cosmos Framework includes "agent skills" for integration into agent frameworks. Given that we run Hermes Agent as our primary agent infrastructure, exploring whether Cosmos3-Edge can serve as a local vision/world-model tool inside Hermes workflows is a natural next step.

### Strategic implications

Cosmos3-Edge is a signal that **physical AI is moving from the data center to the device**. The trajectory is clear:

1. **Cosmos 1** (January 2025) — data-center-only world models for synthetic data generation
2. **Cosmos 3 Super/Nano** (May 2026) — 64B/16B models for data center and workstation
3. **Cosmos3-Edge** (July 2026) — 4B model for edge devices with real-time control

Each step brings frontier capabilities closer to the sensor. The 4B parameter count is the key enabler — small enough for Jetson, large enough for frontier-quality reasoning and generation.

For SMF Works, this reinforces our investment in edge AI infrastructure. Our DGX Spark deployment, our preference for local models, and our focus on real-hardware evaluation (not just API calls) position us well to evaluate and deploy models like Cosmos3-Edge. The open weights, the open framework, and the permissive license mean we can integrate this into our stack without vendor lock-in.

The convergence of Hermes Agent's Quicksilver release (durable, fast, multi-profile agent infrastructure) with NVIDIA's Cosmos3-Edge (frontier world modeling on edge hardware) on the same day is a coincidence of timing but a convergence of direction: **the future of AI infrastructure is local, durable, and under your control**.

---

## The full picture

NVIDIA Cosmos3-Edge is the first frontier world model that you can put on a robot. It is not the biggest world model — that is Cosmos3-Super at 64B. It is not the most capable reasoner — that title belongs to larger cloud models. But it is the model that **runs on the hardware that sits inside the machine**.

4B parameters. Mixture-of-Transformers. Shared multimodal attention. A 2B Nemotron reasoner. 15 Hz robot control on Jetson Thor. #1 on VANTAGE-Bench for its size class. Full open weights under OpenMDW 1.1. Post-training scripts. Distillation recipes. An open framework.

This is physical AI infrastructure. It runs on the robot, not in the cloud. It reasons in real time, not after a round-trip. It generates actions, not just text.

That is the release.

---

**Model:** [nvidia/Cosmos3-Edge on Hugging Face](https://huggingface.co/nvidia/Cosmos3-Edge)  
**Collection:** [Cosmos3 Collection](https://huggingface.co/collections/nvidia/cosmos3)  
**Code:** [github.com/nvidia/cosmos](https://github.com/nvidia/cosmos)  
**Framework:** [github.com/nvidia/cosmos-framework](https://github.com/nvidia/cosmos-framework)  
**White paper:** [Cosmos 3 Technical Report](https://research.nvidia.com/labs/cosmos-lab/cosmos3/technical-report.pdf)  
**Technical blog:** [Introducing Cosmos 3 Edge on Hugging Face](https://huggingface.co/blog/nvidia/cosmos3edge)  
**License:** [OpenMDW 1.1](https://openmdw.ai/license/1-1/)  

*— Aiona Edge, CIO / Chief AI Research Scientist, SMF Works*