---
slug: "2026-07-27-building-smf-image-production-stack-codex-mage-flow-flux"
title: "Building the SMF Image Production Stack: Codex, Mage-Flow, FLUX, and the Architecture Between Them"
author: "Pamela Flannery"
authorKey: "pamela"
series: "clearinghouse"
date: "2026-07-27"
excerpt: "How SMF Works combined Hermes's native Codex image provider, our existing local Mage-Flow runtime, profile-scoped tooling, provenance, and a hardened FLUX path into one explicit, testable production workflow—without adding another paid inference layer or pretending the blocked parts worked."
categories: ["AI", "Building in Public", "AI Infrastructure", "Image Generation"]
tags: ["hermes-agent", "openai-codex", "gpt-image-2", "mage-flow", "flux-1-schnell", "amd-rocm", "gfx1151", "local-ai", "image-production", "ai-agents", "building-in-public"]
readTime: 29
image: "/images/blog/2026-07-27-building-smf-image-production-stack-codex-mage-flow-flux.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-27-building-smf-image-production-stack-codex-mage-flow-flux"
---

**By Pamela Flannery, CMO, SMF Works**

This is a building-in-the-open report about turning several working pieces into one production system.

The short version is that SMF Works now has an image-production architecture with two explicit lanes:

- **Hermes's native OpenAI Codex provider**, configured for GPT Image 2 Medium through the Codex OAuth lifecycle we already use;
- **our local Mage-Flow runtime**, running on an AMD Radeon 8060S, for zero-marginal-cost generation, iteration, and instruction-based editing.

A third local lane—**FLUX.1-schnell**—is implemented at the lifecycle and request-routing level, but the official weights remain gated behind a Hugging Face account acceptance step. We attempted the real route. Hugging Face returned `403 GatedRepoError` before any weights loaded. We did not call that success, and we did not have an agent accept legal and contact-sharing conditions on behalf of an account owner.

Around those inference paths, I built the part that turns model access into a production workflow: named presets, explicit routing, sequential seeded batches, descriptive filenames, dated artifact storage, structured SQLite history, model lifecycle controls, memory measurements, systemd service management, and quality review based on the actual pixels.

The result is not another thin wrapper around an image API. It is a controlled production system designed around three questions:

1. **Which backend should do this job?**
2. **What did it cost, load, allocate, and produce?**
3. **Can we find, inspect, reproduce, edit, or reject the result later?**

And because this is the Clearinghouse, the failed parts and unfinished parts are included.

> **Reusable implementation package:** [Download the AI-agent implementation guide (.md)](/downloads/smf-hermes-image-production-ai-agent-guide.md). It is written so another team can give it to a capable coding agent and ask for an environment-specific implementation without handing that agent our private paths or credentials.

---

## We Did Not Start From Zero

The most important context is that many of the hard elements were already in place because of prior work.

On July 22, we published the sequence that made Microsoft's Mage-Flow usable on our AMD Strix Halo machine:

- [Running Mage-Flow on AMD Strix Halo: A Complete ROCm Setup Recipe](/blog/2026-07-22-mage-flow-amd-strix-halo-setup-configuration)
- [Mage-Flow on AMD Strix Halo: What the Tests Actually Revealed](/blog/2026-07-22-mage-flow-testing-framework-results-analysis)
- [Building a Custom Hermes Agent Tool and API Server for Mage-Flow](/blog/2026-07-22-mage-flow-hermes-agent-custom-tool-api-server)

That work had already solved the ugly substrate problems:

- a kernel path that could execute gfx1151 code objects;
- a ROCm/PyTorch combination that worked on the Radeon 8060S;
- attention fallbacks for an environment without CUDA flash-attn;
- image generation and instruction-based editing;
- a FastAPI surface around the local model;
- basic Hermes tool integration;
- a testing framework that measured more than “did a file appear?”

We also already had the native Hermes pieces:

- a maintained image-generation toolset;
- provider plugins rather than one hardwired image vendor;
- an `openai-codex` image provider;
- GPT Image 2 Low, Medium, and High model mappings;
- the existing Codex OAuth lifecycle;
- profiles for isolation;
- a plugin system for capability at the edge;
- deferred tool discovery so local tools do not have to enlarge every agent request;
- skill loading for production procedures.

Our earlier [in-house media infrastructure report](/blog/2026-07-25-in-house-media-generation-pivot) documented why local capability, provenance, and replayable work matter to us. This implementation advances that strategy. It does not replace the previous work; it connects it.

The task was not “find an image model.” The task was to reorganize existing capability into something we could trust in daily publishing.

---

## The Workflow Inspiration: Hermes Image Studio

One useful catalyst was [Cliff Wade's Hermes Image Studio](https://github.com/CliffWade/hermes-image-studio), an MIT-licensed project with polished studio ergonomics.

I reviewed version 1.2.0 at commit `89f4ae5205267c24c58a7e77fba38ba56aafd919`. Its strongest ideas were not tied to one particular image model:

- style presets that turn visual direction into reusable production vocabulary;
- seeded batches rather than untracked random clicking;
- generation history;
- descriptive filenames;
- deterministic output organization;
- a studio-like flow for iteration and retrieval.

Those are excellent workflow ideas.

Hermes Image Studio uses FAL as its hosted inference layer. That is a valid design choice for its project. Our environment had a different starting point: Hermes already had a native provider abstraction, we already had Codex OAuth, and we already had a local Mage-Flow runtime with no per-image inference charge. Installing a second hosted inference path would have duplicated capability and introduced another funding and authentication surface.

So I took the studio concepts seriously without importing the entire inference topology.

The SMF implementation independently reworks those ideas around:

- Hermes native `image_generate` for the hosted lane;
- profile-scoped plugin tools for the local lane;
- SMF-specific style language;
- our local API and AMD lifecycle constraints;
- our artifact and provenance requirements.

We preserved a positive attribution and MIT notice in the skill's third-party notices. The point was not to criticize a good studio project for choosing a hosted backend. The point was to use its ergonomic ideas where they fit and keep our existing infrastructure where it was already stronger for our needs.

---

## The Architecture We Ended Up With

The production path now looks like this:

```text
                            SMF image-production skill
                                       |
                         explicit routing decision
                         /                         \
                        /                           \
        hosted precision lane                 local iteration lane
        Hermes image_generate                 profile plugin tools
                  |                                   |
        openai-codex provider                 loopback API :7861
                  |                                   |
        GPT Image 2 Medium           SingleModelManager + single worker
                                                      |
                                          Mage Generate / Mage Edit
                                                      |
                                        FLUX.1-schnell when selected
                        \                           /
                         \                         /
                     organized artifact + structured metadata
                                       |
                               searchable SQLite history
```

The most important line in that diagram is **explicit routing decision**.

A local failure never silently falls through to a billable provider. A hosted provider is not selected merely because a local model is cold. FLUX is not tried because its name happens to be in a model list. The requested backend is part of the operation.

That makes the economics and the failure mode visible.

---

## Lane One: Native Codex Without Credential Duplication

Hermes already provided the correct hosted architecture.

I enabled the native `image_gen` toolset in the active profile and configured:

```text
provider: openai-codex
model: gpt-image-2-medium
```

That provider uses the same Codex OAuth lifecycle Hermes already maintains. No token was exported into a third-party plugin. No OAuth material was copied into a script. No credential was written into image history.

GPT Image 2 Medium is the default balance for high-value production. The other native model levels remain useful routing choices:

- **Low** for faster, less expensive cloud iteration;
- **Medium** for final-quality general production;
- **High** when maximum fidelity is deliberately requested.

We verified provider resolution, dispatch behavior, and image-to-image plumbing through Hermes's canonical tests. We did **not** make a billable image call merely to prove that the wiring existed.

That distinction matters. A test should prove plumbing at the cheapest layer that can prove it. A real hosted generation should happen when there is a real production reason to spend the credit.

---

## Lane Two: A Local API That Knows What Is Resident

The original local API could generate images. The hardened version had to manage a finite-memory production service.

The host is an AMD Ryzen AI MAX+ 395 system with Radeon 8060S graphics (`gfx1151`) and approximately 51.5 GB visible in the GPU heap. That is substantial for an integrated GPU, but it is not infinite. The system is sharing memory, and image pipelines can retain allocator state after Python references disappear.

I pulled model lifecycle behavior into a dedicated `SingleModelManager`.

Its contract is straightforward:

1. Normalize the requested model alias.
2. Reuse the current model if it is already resident.
3. If a different large model is resident, unload it first.
4. Remove references.
5. Run Python garbage collection.
6. Clear the PyTorch allocator cache.
7. Guard `ipc_collect()` because support can vary.
8. Load the new pipeline.
9. Mark the model current only after the load succeeds.

The cleanup path is shared rather than scattered across endpoints:

```python
import gc

gc.collect()
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    try:
        torch.cuda.ipc_collect()
    except (RuntimeError, AttributeError):
        pass
```

The service runs one Uvicorn worker, and its GPU load and inference calls are synchronous. The event loop therefore executes that work serially. Local batches also run sequentially. This is not an arbitrary throttling preference; it prevents two requests from trying to load tens of gigabytes into one unified-memory machine. The current manager is designed for this single-worker service, not as a general thread-safe queue.

The API now exposes:

- `GET /health`
- `GET /models`
- `POST /unload`
- `POST /generate`
- `POST /edit`
- basename-scoped `GET /file/{filename}`

The generate and edit responses include more than a URL:

- canonical model;
- seed;
- dimensions;
- load time;
- execution time;
- cold/warm state;
- peak GPU allocated memory;
- peak GPU reserved memory.

The file endpoint rejects paths rather than trusting a client-provided filename. The profile plugin requires a real reference file and rejects inputs larger than 25 MB before upload; the loopback API then decodes the bytes with PIL. This is a local service boundary, not a public upload endpoint. The service binds to `127.0.0.1`.

---

## The Profile Plugin: Capability at the Edge, Not in Hermes Core

Our first Mage integration existed as an untracked core tool file. It worked, but it was the wrong permanent home.

Hermes's design principle is that the core remains narrow while user-specific capability lives at the edges. Image production for one SMF workstation is exactly what a profile plugin is for.

I created a profile-scoped plugin with:

```text
smf_image_production/
├── plugin.yaml
├── __init__.py
├── artifact_store.py
├── artifact_cli.py
└── tests/
```

It registers two local operations:

- local image generation;
- local instruction editing.

Those tools call the loopback API. They do not contain model weights, OAuth logic, or a hidden cloud fallback.

The old core customization was removed. The native `image_gen` toolset is back to one canonical tool: `image_generate`. The local plugin appears as its own toolset and can be found through Hermes's deferred tool search.

This preserves two important properties:

1. **No tracked Hermes core modification is required.**
2. **The model-facing core schema does not permanently grow for a workstation-specific service.**

That is a cleaner result than “we made the tool work.” It makes updates, audits, and reversibility easier.

---

## Presets, Batches, Names, and History

The studio layer lives in an SMF skill and the plugin's artifact store.

I created nine named style presets:

- `smf-editorial`
- `main-street-realism`
- `human-ai-collaboration`
- `cinematic-technology`
- `clean-product-studio`
- `minimal-concept`
- `bold-social`
- `heritage-future`
- `codex-typographic`

These are prompt layers, not model locks. The same editorial direction can guide local exploration and a hosted final. The typography preset is deliberately reserved for the backend with the stronger exact-text behavior.

Local artifacts are organized beneath the active profile:

```text
$HERMES_HOME/cache/images/smf/YYYY/MM/DD/
```

A typical filename looks like:

```text
HHMMSS_<prompt-slug>_<short-uuid>_seed-<seed>.png
```

The timestamp makes chronological scanning easy. The prompt slug makes the file recognizable. The short UUID prevents collisions. The seed preserves the generation coordinate.

Each operation also creates structured metadata and a history row. The SQLite database lives at:

```text
$HERMES_HOME/data/smf-image-production/history.db
```

History can be searched by backend, model, operation, or text. That changes the operator question from “where did that good image go?” to “show me the Mage editorial generations from this campaign.”

For batches, the policy is equally explicit:

- choose a base seed;
- generate sequential seeds;
- hold the style constant;
- vary one meaningful visual dimension at a time;
- record every item;
- report partial failures;
- inspect before selection.

---

## Service Lifecycle: From a Shell Script to systemd

A production service should not depend on whether someone remembers which terminal started it.

I created a user-level systemd service for the local API. It is enabled and active. The old convenience script now delegates to systemd rather than spawning an unmanaged Uvicorn process.

The service carries the ROCm environment that the known-good Mage runtime requires, including:

```text
PYTORCH_HIP_ALLOC_CONF=expandable_segments:True
```

That allocator setting reduces fragmentation risk when large pipelines unload and reload. The unit has restart-on-failure behavior, a fixed working directory, the tested virtual environment, and loopback service semantics.

We also checked for duplicate servers. Only the systemd-managed process owned port 7861.

This is a small operational change with a large effect: the runtime is now inspectable, restartable, and recoverable through normal service controls.

---

## The Measurements

Here are the original local production measurements captured through the plugin and API:

| Operation | Model load | Execution | Peak allocated | Interpretation |
|:--|--:|--:|--:|:--|
| First Mage generation | 47.86 s | 8.31 s | 20.90 GB | Cold start |
| Second Mage generation | 0.00 s | 6.86 s | 20.88 GB | Warm path |
| Generation after unload | 39.26 s | 5.91 s | 20.85 GB | Reload path |
| Mage instruction edit | 34.75 s | 6.99 s | 18.28 GB | Cold edit pipeline |

Those numbers make the operating tradeoff concrete.

The local model is fast when warm. Cold model loads dominate latency. That means model switching should be explicit, batches should be sequential and grouped by model, and an operator should not unload a healthy resident pipeline between every request.

The article hero added another real production trace.

I generated four 1024×576 Mage variants with consecutive seeds. All four were warm generations:

| Seed | Generation time | Peak allocated |
|:--|--:|--:|
| 2026072710 | 10.90 s | 21.02 GB |
| 2026072711 | 7.62 s | 21.03 GB |
| 2026072712 | 8.12 s | 21.03 GB |
| 2026072713 | 7.70 s | 21.02 GB |

Then the quality review found a problem.

---

## The Hero Image Failed Before It Succeeded

The prompt explicitly said:

> no words, no letters, no numbers, no symbols, no logos, no watermark, no interface labels, no illegible text

All four variants invented some form of “SMF” text or pseudo-interface writing anyway.

The compositions were useful. The exact adherence was not.

This is the same limitation we saw in the earlier pipeline test: Mage produced a coherent editorial scene but inserted a large label and interface-like gibberish. In that test, an instruction edit removed the labels while preserving the subject and composition.

For this article, I selected the strongest architecture composition and routed it to the local edit pipeline.

The first cleanup edit:

- loaded the edit model in 32.28 seconds;
- executed in 9.45 seconds;
- peaked at 19.83 GB allocated;
- removed the large invented label;
- left two small pseudo-labels on server surfaces.

I rejected that intermediate result.

A second, surgical edit targeted only the remaining marked surfaces. Because the edit model was warm, it loaded in 0.00 seconds and executed in 8.54 seconds, peaking at 19.85 GB.

That result passed a strict visual review: no discernible words, letters, numbers, logos, glyphs, or watermark; safe 16:9 crop; clear cloud-plus-local architecture metaphor; correct navy/orange/gold visual language.

The hero at the top of this article is that final local artifact.

This is exactly why the workflow separates **generation succeeded** from **asset is publishable**.

---

## What We Tested

Fresh focused verification passed across three layers:

| Suite | Result | What it covers |
|:--|--:|:--|
| Hermes native image-provider tests | 23/23 | provider resolution, dispatch, image-to-image behavior |
| Local lifecycle tests | 18/18 | aliases, validation, switching, unload/cleanup, FLUX hardening |
| Profile plugin/history tests | 7/7 | registration, API calls, artifacts, naming, history, search |
| **Total focused checks** | **48/48** | three distinct integration layers |

We also passed:

- Python compilation for the local API and runtime;
- shell syntax for the service wrapper;
- systemd unit validation;
- live API health checks;
- plugin discovery and enablement checks;
- a focused hardened-runtime verifier in the Mage environment.

The Mage virtual environment itself does not include pytest. The exact runtime error is:

```text
No module named pytest
```

That is why the pure lifecycle and plugin suites run under the system test environment, while compilation and the hardened runtime verifier run inside the Mage environment. I am including that detail because “tests passed” is less useful than knowing which environment actually executed them.

No tracked Hermes core modification remained from this work.

---

## The FLUX Path: Hardened, Routed, and Still Blocked

The delayed FLUX research was useful even though the weights remain inaccessible.

The environment supports Diffusers `FluxPipeline`, and we verified BF16 tensor operations, matrix multiplication, and scaled-dot-product attention on gfx1151. The researched low-resolution recipe is:

- model: `black-forest-labs/FLUX.1-schnell`;
- pipeline: `FluxPipeline`;
- dtype: `torch.bfloat16`;
- model CPU offload targeting the ROCm `cuda` device;
- CPU-seeded generator;
- 512×512 output;
- four inference steps;
- `guidance_scale=0.0`;
- `max_sequence_length=256`.

The estimated BF16 model components total approximately 33.7 GB:

- transformer: 23.78 GB;
- T5 encoder: 9.52 GB;
- CLIP encoder: 0.25 GB;
- VAE: 0.17 GB.

That estimate is why Mage must unload before FLUX loads.

I incorporated the research into the real loader, lifecycle tests, and systemd environment. We tested loader arguments with a fake pipeline so we could verify BF16, safetensors, component offload, and generator device behavior without pretending the official model had loaded.

Then we sent a real low-resolution FLUX request through the actual API route.

Hugging Face returned:

```text
403 GatedRepoError
```

No FLUX image was generated. No partial FLUX model remained resident. No meaningful GPU allocation was left behind. The failed request did not trigger a hosted fallback.

The remaining action belongs to the account owner: review and accept the conditions on the official [FLUX.1-schnell model page](https://huggingface.co/black-forest-labs/FLUX.1-schnell). After access is granted, the real smoke test still needs to record:

- download result;
- cold load time;
- generation time;
- allocated and reserved peak memory;
- visual quality;
- unload behavior;
- FLUX-to-Mage reload behavior.

Until that happens, the correct status is **implemented but not generation-verified**.

---

## Why There Is No Silent Fallback

A production system can be technically convenient and economically dangerous at the same time.

Imagine a local batch where one request fails because a model is cold, a repository is gated, or memory is fragmented. If the software silently resubmits that request to a hosted model, the operator has lost control of both cost and provenance.

Our routing rules prevent that:

- Mage is explicit.
- Mage Edit is explicit.
- FLUX is explicit.
- Codex is explicit.
- A failed local operation returns a failed local operation.

The agent may recommend a different route. It may not spend through that route without the corresponding decision.

This is particularly important for autonomous agents. “Helpful fallback” is not always helpful when it changes the bill, the data path, or the model's legal terms.

---

## What This Means for SMF Works

The immediate benefit is straightforward: we can produce and refine more of our own visual work without adding a new paid layer.

But the larger value is operational.

### 1. We now route quality and cost deliberately

Local Mage handles exploration, routine drafts, variations, and cleanup. Native Codex is available for higher-value work where exact instruction adherence or difficult editing justifies the hosted route. FLUX can become another local option after access is legitimately granted and measured.

### 2. The agent can work autonomously without becoming economically ambiguous

An agent can choose a local seed, run a sequential batch, inspect candidates, edit a flaw, and organize the result. It cannot silently convert a local job into a billable one.

### 3. Every useful artifact has a history

The image is not stranded in an output folder. We retain the prompt, operation, backend, model, style, seed, source, metrics, and organized path.

### 4. We can learn from quality failures instead of hiding them

Mage's tendency to invent labels is now a known production characteristic. We have both a routing rule and a repair path. If the same failure appears across a batch, we can change the prompt or backend instead of spending random seeds.

### 5. We can update Hermes without carrying a local core fork

The custom integration lives in a profile plugin and local service. Hermes core stays clean. That lowers the cost of maintenance and upstream updates.

### 6. Prior infrastructure now compounds

The AMD work, Mage runtime, Hermes provider architecture, OAuth lifecycle, testing discipline, systemd management, artifact provenance, and studio ergonomics now reinforce each other.

This is the practical meaning of building infrastructure in the open: one solved layer becomes the starting assumption for the next layer.

---

## The Downloadable Guide

I turned the implementation into a generic Markdown brief that another team can give directly to an AI coding agent:

**[Download or view the SMF Hermes image-production AI-agent guide (.md)](/downloads/smf-hermes-image-production-ai-agent-guide.md)**

The guide includes:

- discovery steps;
- non-negotiable security and cost guardrails;
- native Codex configuration;
- single-resident model manager behavior;
- local API contract;
- Mage and FLUX guidance;
- profile-plugin structure;
- artifact and SQLite history design;
- systemd hardening;
- test plan;
- attribution guidance;
- a definition-of-done checklist.

It intentionally excludes our credentials and user-specific absolute paths. It also instructs the receiving agent to inspect the target environment rather than assuming our AMD stack is universal.

---

## Final Status: What Is Real Today

| Capability | Status |
|:--|:--|
| Hermes native `openai-codex` provider | Configured and test-verified |
| Default hosted image model | `gpt-image-2-medium` |
| Billable Codex image calls used for plumbing | 0 |
| Mage text-to-image generation | Working and measured |
| Mage instruction editing | Working, measured, and used on this article's hero |
| Sequential seeded batches | Working |
| Descriptive profile-scoped artifacts | Working |
| JSON metadata and SQLite history | Working |
| Explicit unload and model switching | Working |
| systemd-managed local API | Enabled and active |
| Hermes core modifications required | None |
| FLUX loader/lifecycle path | Implemented and test-hardened |
| FLUX official weights downloaded | No |
| FLUX images generated | 0 |
| Remaining FLUX blocker | Account-owner acceptance of Hugging Face conditions |
| Focused passing tests | 48/48 |

That is the honest boundary.

We have a working production architecture, a working local generation and edit path, a verified native hosted path, an auditable artifact layer, and a hardened second-local-model route. We do not yet have a FLUX image.

When the gate is resolved, we will run the low-resolution smoke test, publish the real measurements, unload FLUX, reload Mage, and report what actually happened.

Until then, this system is already useful—not because every planned model is available, but because the architecture can tell the truth about which model ran, what it consumed, what it produced, and whether the result was good enough to ship.
