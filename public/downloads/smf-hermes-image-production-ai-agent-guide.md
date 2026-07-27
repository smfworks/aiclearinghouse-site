# AI-Agent Implementation Guide: Build a Hermes-Native Hosted + Local Image Production Stack

- **Version:** 1.0
- **Published by:** SMF Works AI Clearinghouse
- **Purpose:** Give this file to a capable coding agent and ask it to implement, test, and document a profile-safe image-production workflow around your existing Hermes Agent installation.

> **Suggested instruction to your AI:** “Read this entire guide, inspect my current Hermes version and local GPU environment, then implement the smallest profile-safe version that fits my machine. Do not modify Hermes core, expose credentials, accept legal terms for me, add a paid service, or make a billable generation call without my approval. Work test-first, use explicit backend routing, and verify every claim with real execution.”

---

## 1. What You Are Building

Build two explicit image-production lanes behind one operating workflow:

1. **Hosted quality lane:** Hermes's native `image_generate` tool using the `openai-codex` provider and the user's existing Codex OAuth lifecycle. The default model in the SMF implementation is `gpt-image-2-medium`.
2. **Local zero-marginal-cost lane:** A profile-scoped Hermes plugin that calls a loopback image API. The API manages Mage-Flow for generation/editing and can add `black-forest-labs/FLUX.1-schnell` as a separately selected local model.

Add a workflow layer around those lanes:

- named style presets;
- explicit backend and model selection;
- controlled seeds;
- sequential batches;
- descriptive filenames;
- dated artifact directories;
- structured artifact metadata, with optional JSON sidecars;
- searchable SQLite history;
- generation/edit/load/unload/memory measurements;
- visual review before publication;
- one large local model resident at a time;
- no silent fallback from a failed local request to a billable hosted provider.

This is an **architecture and operating discipline**, not a new inference provider.

---

## 2. Non-Negotiable Guardrails

Your agent must preserve all of these:

1. **No Hermes core fork.** Put custom integration under the active profile's `$HERMES_HOME/plugins/` and in a separate local workspace.
2. **Profile-safe paths.** Resolve state with `get_hermes_home()` in Python and `$HERMES_HOME` operationally. Never hardcode another user's home directory or global `~/.hermes` paths.
3. **Native authentication stays native.** Do not copy, export, print, log, or embed Codex OAuth tokens in plugin code or configuration.
4. **Secrets never enter this implementation brief, source control, prompts, sidecars, or history.**
5. **No silent paid fallback.** If local generation fails, return the local failure. A separate, explicit user decision is required before hosted generation.
6. **One large local model at a time.** Unload and clean allocator state before loading another large model.
7. **Loopback only by default.** Bind the local image API to `127.0.0.1`, not a public interface.
8. **The account owner accepts legal terms.** An agent must not accept gated-model licenses or contact-sharing terms on the user's behalf.
9. **Do not claim a model works until a real generation has completed and been inspected.** Loader tests are not image-generation proof.
10. **Do not spend hosted credits merely to prove plumbing.** Provider resolution and dispatch tests can verify integration without a billable call.

---

## 3. Discovery Before Implementation

The agent should inspect, not assume:

- active Hermes version and repository location;
- active profile and resolved `$HERMES_HOME`;
- existing `image_gen` provider plugins and supported model aliases;
- current Codex OAuth status without printing credentials;
- GPU name and architecture;
- system and GPU-visible memory;
- kernel, driver, ROCm/PyTorch/Diffusers/Transformers/Accelerate versions;
- existing Mage-Flow checkout, weights, patches, API, tests, and service;
- whether FLUX weights are already cached or still gated;
- existing user changes in every repository it may touch.

Record the baseline before editing. Do not overwrite unrelated changes.

---

## 4. Configure the Native Hosted Lane

Use Hermes's supported CLI rather than hand-editing `config.yaml`:

```bash
hermes tools enable image_gen --platform cli
hermes config set image_gen.provider openai-codex
hermes config set image_gen.openai-codex.model gpt-image-2-medium
```

If using a named profile, include its profile selector in every command, for example:

```bash
hermes -p <profile> tools enable image_gen --platform cli
hermes -p <profile> config set image_gen.provider openai-codex
hermes -p <profile> config set image_gen.openai-codex.model gpt-image-2-medium
```

Verify with profile-aware reads and the Hermes image-provider tests. Do **not** reveal token data. Do **not** trigger a hosted generation unless the user explicitly approves the potential cost.

Recommended routing policy:

| Work | Route |
|---|---|
| Local exploration, routine drafts, seed batches | Mage-Flow generation |
| Local instruction-based cleanup | Mage-Flow editing |
| Exact constraints, typography, high-value final work | Native Codex / GPT Image 2 |
| FLUX experiment | Local FLUX, only when explicitly selected and accessible |

---

## 5. Build the Single-Resident Local Runtime

Create a small runtime module outside Hermes core with these responsibilities:

### Canonical model aliases

Map user-facing aliases to canonical internal keys. Example:

- `mage-flow-turbo` → `t2i_turbo`
- `mage-flow-edit` → `edit_turbo`
- `flux1-schnell` → `flux1_schnell`

Reject unknown models with a useful error and a list of supported aliases.

### Dimension validation

Validate before model work begins:

- positive integer width and height;
- dimensions divisible by 16;
- bounded maximum dimensions appropriate for the machine;
- explicit low-resolution defaults for smoke testing.

### Single-model manager

Implement a lock-protected manager with this contract:

1. Resolve the requested model.
2. If it is already resident, reuse it.
3. If another model is resident, unload it first.
4. Drop references to the old pipeline.
5. Run garbage collection.
6. Call guarded GPU allocator cleanup.
7. Load the requested model.
8. Mark it current only after successful loading.
9. If loading fails, leave the manager in a clean, truthful state with no phantom resident model.

For ROCm/PyTorch, cleanup should include:

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

Use a process lock or service serialization so two requests cannot load or execute large pipelines concurrently.

---

## 6. Local API Contract

Expose a minimal loopback API. FastAPI is one reasonable implementation, but the contract matters more than the framework.

### `GET /health`

Return:

- service status;
- GPU name;
- total and currently allocated memory;
- current model;
- loaded models;
- output directory.

### `GET /models`

Return available local models, their local path or repository ID, loaded status, current selection, and whether account access is required.

### `POST /unload`

Explicitly unload the current model and clean allocator state.

### `POST /generate`

Accept:

- prompt;
- explicit model;
- width and height;
- steps;
- guidance/CFG;
- seed.

Return:

- status;
- canonical model;
- output path or safe file URL;
- seed and dimensions;
- model load time;
- execution time;
- cold/warm indicator;
- peak GPU allocated and reserved memory.

### `POST /edit`

Accept:

- instruction;
- local reference-image path or upload;
- maximum size;
- steps;
- guidance/CFG;
- seed.

Use a bounded upload size and validate that the input is actually an image.

### `GET /file/{filename}`

Serve only basename-scoped files from the output directory. Reject path separators, traversal attempts, and files outside the controlled output root.

---

## 7. Mage-Flow Lane

Reuse a working Mage-Flow environment rather than rebuilding it blindly. On unsupported or newly supported AMD architectures, preserve the exact ROCm/PyTorch combination that has already passed GPU execution tests.

The local API should support both:

- text-to-image generation;
- instruction-based image editing.

Measure cold load, warm execution, unload, reload, and edit behavior separately. A successful HTTP response is not a quality judgment: inspect the actual image for composition, anatomy, prompt adherence, invented text, accidental logos, and crop safety.

Mage-Flow may produce a strong composition while inventing letters or interface labels. Treat that as a routing signal, not as a reason to hide the result. A local instruction edit can often repair the output without paying for a new hosted generation.

---

## 8. Optional FLUX.1-schnell Lane

Model:

```text
black-forest-labs/FLUX.1-schnell
```

Recommended low-resolution smoke-test recipe for a capable ROCm host:

```python
from diffusers import FluxPipeline
import torch

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16,
    use_safetensors=True,
)
pipe.enable_model_cpu_offload(device="cuda")

generator = torch.Generator(device="cpu").manual_seed(SEED)
image = pipe(
    prompt=PROMPT,
    width=512,
    height=512,
    num_inference_steps=4,
    guidance_scale=0.0,
    max_sequence_length=256,
    generator=generator,
).images[0]
```

Operational requirements:

- verify BF16 tensor operations, matmul, and scaled-dot-product attention first;
- unload Mage before loading FLUX;
- use a CPU generator so offloaded components do not conflict with generator device state;
- set `PYTORCH_HIP_ALLOC_CONF=expandable_segments:True` in the service environment where appropriate;
- record download result, load time, generation time, peak allocated/reserved memory, output quality, unload behavior, and FLUX-to-Mage reload behavior;
- if Hugging Face returns `403 GatedRepoError`, stop. Report the gate and wait for the account owner to accept the model conditions.

A loader test with a fake pipeline proves orchestration semantics. It does not prove that official weights were downloaded or that FLUX generated an image.

---

## 9. Build the Profile-Scoped Hermes Plugin

Create:

```text
$HERMES_HOME/plugins/smf_image_production/
├── plugin.yaml
├── __init__.py
├── artifact_store.py
├── artifact_cli.py
└── tests/
```

Register local generation and editing tools through Hermes's plugin API. Do not add a permanent core tool.

The tools should:

- call only the loopback API;
- require explicit `model` selection;
- use bounded request timeouts;
- validate responses and files;
- copy completed artifacts into profile-scoped storage;
- record structured metadata and optionally create JSON sidecars;
- record history;
- return structured, useful errors;
- never call the hosted lane automatically.

Keep the native hosted tool as Hermes's existing `image_generate`. Keep the local tools in a separate plugin toolset. If Hermes supports deferred tool discovery, allow the local tools to remain deferred rather than permanently expanding every model request's schema.

---

## 10. Artifact and History Design

Store local artifacts under:

```text
$HERMES_HOME/cache/images/smf/YYYY/MM/DD/
```

Use descriptive, collision-resistant filenames:

```text
HHMMSS_<prompt-slug>_<short-uuid>_seed-<seed>.png
```

Write a SQLite history row containing at least the fields below. A JSON sidecar beside each image is optional when portable per-file provenance is useful:

- timestamp;
- operation (`generate` or `edit`);
- backend;
- canonical model;
- full prompt/instruction;
- style preset;
- seed;
- organized artifact path;
- source path;
- load/execution/memory metrics;
- non-secret metadata.

Store history under:

```text
$HERMES_HOME/data/smf-image-production/history.db
```

Provide CLI commands to list recent work and filter by operation, backend, model, or free-text search.

---

## 11. Workflow Layer

Implement named style presets as prompt layers, not model locks. A useful baseline set includes:

- editorial technology;
- human/AI collaboration;
- Main Street realism;
- cinematic technology;
- clean product studio;
- minimal concept;
- bold social;
- heritage/future;
- exact-typography preset reserved for the hosted precision lane.

For batches:

- use explicit seeds;
- generate sequentially on the local GPU;
- keep the style fixed while varying composition or seed;
- record each item independently;
- report partial failures instead of hiding them;
- inspect outputs before selecting a winner.

For important heroes, a practical workflow is:

1. generate four local seeded variants;
2. select the strongest composition;
3. run local instruction edits for correctable artifacts;
4. use the hosted precision lane only when the remaining quality gap warrants it and the user approves.

---

## 12. Service Hardening

Use a user-level systemd service so the API is inspectable and recoverable. The agent should resolve real paths before writing the unit.

Conceptual unit:

```ini
[Unit]
Description=Local image generation and editing API
After=network.target

[Service]
Type=simple
WorkingDirectory=<LOCAL_WORKSPACE>
Environment=PYTHONUNBUFFERED=1
Environment=PYTORCH_HIP_ALLOC_CONF=expandable_segments:True
Environment=<OTHER_VERIFIED_ROCM_OVERRIDES>
ExecStart=<VENV>/bin/python <LOCAL_WORKSPACE>/mage_flow_api.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Then:

```bash
systemd-analyze --user verify ~/.config/systemd/user/<service>.service
systemctl --user daemon-reload
systemctl --user enable --now <service>.service
systemctl --user is-enabled <service>.service
systemctl --user is-active <service>.service
curl -fsS http://127.0.0.1:<port>/health
```

Do not use unmanaged `nohup`, stray background servers, or multiple processes competing for the same GPU and port.

---

## 13. Test Plan

Work test-first around the lifecycle and artifact contracts.

### Runtime tests

- alias normalization;
- dimension validation;
- same-model reuse;
- unload before switch;
- cleanup after unload;
- failed load leaves no current model;
- BF16 FLUX loader arguments;
- component CPU offload;
- CPU generator;
- guarded allocator cleanup.

### Plugin/history tests

- profile-scoped paths;
- descriptive filenames;
- UUID collision resistance;
- sidecar creation;
- SQLite insert and search;
- mocked local API generation/edit flows;
- plugin registration and enablement;
- file and upload bounds.

### Native hosted-provider tests

Run the Hermes repository's canonical targeted tests for provider resolution, dispatch, and image-to-image behavior. Use the repository's official test wrapper if it has one.

### Live checks

- service enabled and active;
- health endpoint truthful;
- only one process owns the port;
- one model resident;
- local generation produces a real image;
- local edit produces and preserves the intended image;
- unload and reload work;
- no tracked Hermes core changes;
- no billable hosted call was made without approval;
- FLUX remains labeled unverified until a real post-gate generation succeeds.

---

## 14. Attribution

The SMF workflow was positively informed by the studio ergonomics in **Cliff Wade's `hermes-image-studio`**: style presets, seeded batches, generation history, descriptive filenames, and organized output directories. That project is MIT-licensed.

Review the project's current license before reusing code. If you copy a substantial portion, preserve the MIT notice. If you independently reimplement the concepts around Hermes's native provider abstraction and your local runtime, still give clear conceptual credit.

Do not characterize a hosted FAL inference choice as a defect. It is a valid design for that project. This guide chooses a different inference topology because the target environment already has native Codex authentication and a local Mage-Flow runtime.

---

## 15. Definition of Done

Do not stop at scaffolding. The work is complete only when:

- [ ] hosted provider/model resolve through the active Hermes profile;
- [ ] local plugin is enabled and discoverable;
- [ ] local API is systemd-managed and loopback-only;
- [ ] Mage generation and editing have run successfully;
- [ ] load, execution, memory, unload, and reload metrics are recorded;
- [ ] artifacts use deterministic profile-scoped organization;
- [ ] history is searchable;
- [ ] local batches are sequential and seeded;
- [ ] no automatic paid fallback exists;
- [ ] native, runtime, and plugin tests pass;
- [ ] a real output has been visually reviewed;
- [ ] failures and limitations are documented honestly;
- [ ] FLUX is not described as working until its gated weights have actually loaded and generated an inspected image;
- [ ] no credentials or user-specific absolute paths have entered source control.

The goal is not merely “an image tool.” The goal is a production system with explicit economics, visible provenance, controlled lifecycle behavior, and honest quality gates.
