---
slug: "read-the-floor-before-you-bump-axolotl"
title: "Read the Floor Before You Bump Axolotl"
excerpt: "Axolotl v0.20.0 requires Python 3.12 and torch 2.13 through 2.14, and FSDP1 now raises. The GGUF export command is in the tag. I did not train a model, and I did not run this on a Spark."
date: "2026-10-01"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Local LLMs", "Fine-Tuning", "Linux", "Quantization"]
tags: ["axolotl", "gguf", "nvfp4", "fsdp2", "ringmaster"]
readTime: 26
image: "/images/blog/read-the-floor-before-you-bump-axolotl-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/read-the-floor-before-you-bump-axolotl"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

If you fine-tune with Axolotl, do not `pip install -U axolotl` into last month's env and hope the config still means the same thing. v0.20.0, published 2026-09-30, moved the floor. The tag's `pyproject.toml` says `requires-python = ">=3.12"` and pins `torch>=2.13.0,<=2.14.0`. The multi-GPU guide at that same tag says FSDP1 is gone and `fsdp_version: 1` raises. The command worth the bump is `axolotl export`, and it refuses an adapter-only directory until you merge. I fetched the tag this morning. I did not train a model.

This is not a serving note. [NVFP4 vs MXFP4](/blog/2026-07-08-nvfp4-vs-mxfp4-gpt-oss-120b) is about running a quantized checkpoint. This one is about the trainer that can LoRA on an NVFP4 base and then write a merged file the runtime can actually serve. Those are different jobs. A green install is not a training run, and a training run is not a Spark measurement. I did not do either.

## What to do before you bump

You can run the checks on your own machine. You do not need mine.

1. Print the interpreter. `python3 --version`. If it is below 3.12, stop. v0.20.0 will not install into that env. The `VERSION` file at the tag is the single line `0.20.0`. The floor is in `pyproject.toml`, not in the marketing sentence at the top of the release.
2. Print torch, in the env you actually train with. You want `2.13.0` through `2.14.0` inclusive. The release notes say the Hub kernel builder only publishes builds for the latest two torch releases, which is why the floor moved. A newer torch than `2.14.0` is outside the pin I read. Do not "just try it" and call the pin conservative.
3. Open the YAML you last trained with. If it says `fsdp_version: 1`, or it still has a top-level `fsdp:` list, migrate before you launch. The guide's words are "raises" and "rejected," not "warns and continues."
4. If the point of the bump is a GGUF you can load in llama.cpp, Ollama, or LM Studio, merge first, then export. Build llama.cpp outside the training env. Do not `pip install -r llama.cpp/requirements/...` into that env. The export guide says those files pin an older `transformers` and a CPU-only `torch`.
5. If you are LoRA-training a native NVFP4 base, serve the merged checkpoint. The guide says the raw adapter is an intermediate artifact once merge-aware training is on. Serving `base + adapter` unmerged is a different model from the one the loss saw.
6. If you need context split across GPUs, install the extra: `pip install 'axolotl[ringmaster]'`. Do not add a `plugins:` entry for it. The old `ring-flash-attn` extra is gone.
7. Stop there if any of those checks fail. A feature list is not a reason to train on a config the new tag rejects.

That is the operational move. The rest of this post is the contract those steps come from, and the places two files in the same tag do not say the same thing.

## What I actually read

| Claim | Source this morning | What it is not |
| --- | --- | --- |
| Tag `v0.20.0`, published 2026-09-30T14:08:10Z, not a prerelease | GitHub release JSON | A training log |
| 67 commits since v0.19.0 (2026-09-10) | Release body. v0.19.0's own JSON says published 2026-09-10T14:19:22Z | A review of those 67 commits |
| `requires-python = ">=3.12"`, `torch>=2.13.0,<=2.14.0`, `peft==0.21.0`, `transformers==5.17.0`, `accelerate==1.15.0`, `trl==1.13.0` | `pyproject.toml` at tag `v0.20.0` | A resolved lock on this host |
| FSDP1 removed; `fsdp_version: 1` raises | `docs/multi-gpu.qmd` at the tag, and the release notes | A traceback I provoked |
| `axolotl export config.yml --quantize Q4_K_M,Q8_0` | `docs/export.qmd` at the tag | An export I ran |
| Ringmaster CP, no `plugins:` entry | `docs/sequence_parallelism.qmd` and the release notes | A multi-GPU job |
| Merge-aware NVFP4 LoRA, and the "serve the merged file" warning | `docs/nvfp4_lora.qmd` at the tag | A loss number I measured |
| Expert parallel without DeepEP, via a torch `all_to_all` backend | `docs/nd_parallelism.qmd` at the tag | A mesh I built |
| This host: Linux `x86_64`, `Python 3.14.7`, `axolotl` not on `PATH`, `import torch` fails | Local commands this morning | A Spark, a GPU, or a trainer install |

I read the Quarto sources at the tag, not the rendered site. `docs.axolotl.ai` can move after the tag. If a sentence below disagrees with the live site, the tag file wins for this post. I did not `pip install` Axolotl. I did not call `axolotl train`. Nothing here was run on a DGX Spark.

The release body's opening line is accurate as a summary and useless as a procedure: GGUF export, Ringmaster context parallelism, native NVFP4 LoRA, expert parallelism without DeepEP, Python 3.12, torch 2.13.0, FSDP1 removed. The procedure is the checks above. The summary is how you miss the floor.

## The floor is a pin, not a suggestion

`requires-python = ">=3.12"` is a packaging constraint. pip will refuse the install on 3.10 or 3.11. That is the easy failure. You see it before any GPU work. The release notes name the commits (`#4036`, `#4043`) and the reason: the Hub kernel builder only publishes builds for the latest two torch releases, so torch moves from `2.11.0` to `2.13.0` and Python moves with it. Docker and CI, in those same notes, cover torch `2.13.0` and `2.14.0`, and Python 3.14 is in the test matrix.

Read the ceiling too. The pin is `torch>=2.13.0,<=2.14.0`, not "2.13 or newer." The sequence-parallelism guide says `torch >= 2.13` and does not mention `2.14.0` as a cap. The `pyproject.toml` line does. If those two disagree on a box with torch `2.15`, believe the pin. I did not install torch `2.15` to watch the resolver fail. I also did not install `2.13.0`. On this host `import torch` raises `ModuleNotFoundError`. The interpreter here is `3.14.7`, which clears `>=3.12`. An interpreter that clears the floor is not a trainer.

A few other pins in that same file matter if you are comparing this tag to a later patch you saw on GitHub:

- `peft==0.21.0`, not a floating `>=`. The release notes describe the bump as `0.20.0 → 0.21.0`, and they say that bump fixes LoRA+ learning rates on embedding layers. A later PEFT tag is not what this Axolotl tag pins. I did not re-read a later PEFT changelog this morning.
- `transformers==5.17.0` and `accelerate==1.15.0`. The sequence-parallelism guide names those two as the integration target, along with `axolotl-ringmaster>=0.2.2`.
- `trl==1.13.0`. The release notes say process-reward modeling now requires `trl<=1.13.0`, because TRL removed `trl.experimental.prm`. The pin and the ceiling are the same number. If you construct a PRM trainer on a newer TRL, the notes say it raises with the pin to install, instead of failing at import. I did not construct one.
- `torchao==0.18.0` is gated: `sys_platform != 'darwin' and platform_machine != 'aarch64'`. `xformers` has the same marker. `fla-core` and `flash-linear-attention` are excluded when `platform_machine == 'aarch64'`, with no Darwin clause. This host is `x86_64`, so those markers would include torchao if the package were installed. It is not installed. If `uname -m` on your box prints `aarch64`, the core list I read does not install torchao. I did not walk a lockfile for some other extra that pulls it back in. The native TorchAO NVFP4 path later in this post depends on that library. An aarch64 install that silently skipped it is not "NVFP4 ready."

Check the marker before you debug a missing kernel for an hour. `uname -m` is the whole test.

## FSDP1 does not warn. It raises.

If your config still says this, it is an FSDP1 config:

```yaml
fsdp_version: 1
fsdp_config:
  fsdp_offload_params: false
  fsdp_cpu_ram_efficient_loading: true
  fsdp_auto_wrap_policy: TRANSFORMER_BASED_WRAP
  fsdp_transformer_layer_cls_to_wrap: Qwen3DecoderLayer
  fsdp_state_dict_type: FULL_STATE_DICT
  fsdp_sharding_strategy: FULL_SHARD
```

That block is the "before" example in `docs/multi-gpu.qmd` at the tag. The guide says only FSDP2 is supported, FSDP1 has been removed, and setting `fsdp_version: 1` raises. The release notes add the other keys that now raise: the top-level `fsdp` list, `sharding_strategy` (use `reshard_after_forward`), and `forward_prefetch`. Other FSDP1-only options, including `sync_module_states` and `use_orig_params`, are dropped with a warning. Raise and warn are not the same outcome. A warning lets the run start. A raise does not.

The mapping in that guide, copied here so you can edit the file without opening the docs:

| FSDP1 | FSDP2 |
| --- | --- |
| `fsdp_sharding_strategy` | `reshard_after_forward` |
| `fsdp_backward_prefetch_policy` | removed, dropped with a warning |
| `fsdp_backward_prefetch` | removed, dropped with a warning |
| `fsdp_forward_prefetch` | removed, rejected with an error |
| `fsdp_sync_module_states` | removed, dropped with a warning |
| `fsdp_limit_all_gathers` | removed, dropped with a warning |
| `fsdp_cpu_ram_efficient_loading` | `cpu_ram_efficient_loading` |
| `fsdp_state_dict_type` | `state_dict_type` |
| `fsdp_use_orig_params` | removed, dropped with a warning |
| `fsdp_activation_checkpointing` | `activation_checkpointing` |

The migrated block in the same file:

```yaml
fsdp_version: 2
fsdp_config:
  offload_params: false
  cpu_ram_efficient_loading: true
  auto_wrap_policy: TRANSFORMER_BASED_WRAP
  transformer_layer_cls_to_wrap: Qwen3DecoderLayer
  state_dict_type: FULL_STATE_DICT
  reshard_after_forward: true
```

`FULL_SHARD` in the old config corresponds to `reshard_after_forward: true` in the new one. The N-D parallelism guide spells the memory trade: `reshard_after_forward: false` is the ZeRO-2 shape (gradients and optimizer states sharded, weights replicated), and `true` is the ZeRO-3 shape (parameters sharded too, more communication). I did not measure that trade. If your old config used `FULL_SHARD` because the model did not fit replicated, keep `reshard_after_forward: true`. Do not "simplify" it to false to make the YAML shorter.

`fsdp_version` defaults to `2` if you omit it. Defaulting is not a migration. The prefixed keys (`fsdp_offload_params`, `fsdp_state_dict_type`, and the rest) are not the FSDP2 names. If you delete `fsdp_version: 1` and leave the old key names, you have not migrated. You have an ignored or rejected config wearing a new default. Rename the fields. Then launch.

One load-path change rides along with FSDP2 QLoRA, and it is the kind of thing you want if rank zero used to die during load. The release notes say `qlora_sharded_model_loading` now defaults on for FSDP2 QLoRA when `cpu_ram_efficient_loading` is set. Rank zero stages and quantizes the NF4 weights on CPU, then distributes the shards. bitsandbytes quantization is chunked so tensors above the int32 element limit no longer fail. `nf4_backend: torchao` selects torchao's `NF4Tensor` instead of bitsandbytes, including MoE experts. That torchao sentence inherits the aarch64 marker above. I did not load an NF4 checkpoint either way.

## Export is a command. It is not a format wish.

The release highlight is one line:

```bash
axolotl export config.yml --quantize Q4_K_M,Q8_0
```

The guide says that emits the base conversion plus one file per requested quant type. Default layout, from the same page:

```text
outputs/my-run/gguf/
├── my-run-f16.gguf
├── my-run-Q4_K_M.gguf
└── my-run-Q8_0.gguf
```

`{ftype}` in `outfile` is replaced by the weight type, so the three files are not three names you invent. They are the conversion plus each quant. CLI flags `--outtype`, `--quantize`, `--outfile`, `--llama-cpp-dir`, and `--model-dir` override the YAML. `--model-dir` exports a checkpoint that is not the one in `output_dir`. That is the escape hatch when the trainer wrote somewhere else. I did not pass it.

LoRA and QLoRA have a hard stop. Export refuses an adapter-only directory. The sequence in the guide is:

```bash
axolotl merge-lora config.yml
axolotl export config.yml
```

Skip the merge and you do not get a helpful GGUF of "just the adapter." The known-gaps list says exporting a LoRA adapter as a standalone GGUF is not supported yet. Merge, then export the merged weights. If the base was already quantized (torchao fp8 or NVFP4, or bitsandbytes), conversion is refused up front. The remedy in the guide is `axolotl merge-lora --dequant`, which re-exports in bf16. That bf16 file is what you then convert. It is also about four times larger than the packed 4-bit base, which the NVFP4 guide says in the non-merge-aware section. Plan disk before you start the conversion. Conversion is slow. The preflight exists so you find out before the slow part.

The other preflight checks, same page:

- Vocab mismatch between `tokenizer.json` and `config.json`. The guide calls this a common outcome of adding tokens without resizing embeddings.
- Multi-token-prediction layers (`num_nextn_predict_layers`). llama.cpp cannot load them. The guide points at the GLM-4.5 example.
- A missing chat template. That one is only a warning. The runtime then falls back to a default template, which undoes the fine-tune even though the file exists. Treat the warning as a failed export if you care what the model says, not just whether a `.gguf` appeared.

Known gaps, quoted so you do not discover them after a two-hour convert: no importance-matrix (`imatrix`) calibration, no `gguf-split` for large models, no multimodal `mmproj`, no standalone LoRA GGUF, no Hub push. If your deploy plan needs any of those, this command is not the plan. Wait, or do that step outside Axolotl. Do not write a wrapper that pretends the gap is closed.

llama.cpp is not a Python dependency. The guide's setup is a clone and a build:

```bash
git clone https://github.com/ggml-org/llama.cpp
export LLAMA_CPP_DIR=$PWD/llama.cpp
cmake -S $LLAMA_CPP_DIR -B $LLAMA_CPP_DIR/build && cmake --build $LLAMA_CPP_DIR/build --config Release -j
```

Point at it with `$LLAMA_CPP_DIR` or `export.llama_cpp_dir`. `llama-quantize` is looked up in `$LLAMA_CPP_DIR/build/bin/`, then `$LLAMA_CPP_DIR/`, then `$PATH`. The same page says building is only required if you request quantized outputs. The prerequisites section also says export shells out to a built checkout. I did not run either path, so I will not tell you the f16-only case works with a bare clone. If you pass `--quantize`, build. If you are unsure, build. The failure mode to actually avoid is the next paragraph in that guide: do not pip-install llama.cpp's requirements into the training env. Those files pin an older `transformers` and a CPU-only `torch`. The conversion script runs under Axolotl's interpreter and loads `gguf-py` from the checkout. The checkout is a tool. It is not a second set of training dependencies.

One more split the export page draws, and people collapse it. GGUF is for the llama.cpp family: llama.cpp, Ollama, LM Studio, llamafile. For vLLM, SGLang, or TGI, the guide says serve the merged safetensors checkpoint directly, optionally quantized with torchao or llm-compressor. It calls vLLM's GGUF loader experimental and slower than the native path. Exporting a GGUF and then pointing vLLM at it because "we quantized" is the wrong runtime. Pick the runtime first. Then pick the file.

YAML, from the guide, if you would rather not pass flags:

```yaml
export:
  format: gguf
  outtype: f16
  quantize: [Q4_K_M]
  outfile:                 # defaults to {output_dir}/gguf/{run}-{ftype}.gguf
  llama_cpp_dir:           # defaults to $LLAMA_CPP_DIR
```

I did not write that block into a config and run it. Copy it from the tag file if you use it. Do not add an `imatrix` key and expect the gap list to be wrong.

## Ringmaster is an extra, not a plugin

Long context that does not fit in one GPU's activation memory is the job of context parallelism. Axolotl's implementation in this tag is Ringmaster: Ulysses, Ring, or USP (Ulysses for as much of the degree as the head count allows, Ring for the remainder). Accelerate owns the device mesh and the FSDP2 gradient reduction. You install it with:

```bash
pip install 'axolotl[ringmaster]'
```

The extra in `pyproject.toml` is `axolotl-ringmaster>=0.2.2` and nothing else in that list. The release notes say the old `ring-flash-attn` extra is replaced. `ring_attn_func` and `heads_k_stride` are ignored, with a warning. The N-D guide says the old key `sequence_parallel_degree` is deprecated and maps to `context_parallel_size`. If your config still has the old key, do not assume the warning is the only effect. Read the new block and set it explicitly. An ignored key is how a run "works" at the wrong context split.

The short config in the sequence-parallelism guide:

```yaml
context_parallel_size: 4
attn_implementation: flash_attention_2
sample_packing: false
```

No `plugins:` entry. The CP degree must divide the GPU count. `backend` accepts `auto`, `ulysses`, `ring`, or `usp`. Explicit `ulysses_size` and `ring_size` must multiply to `size`, and the Ulysses degree must divide the KV-head count. Incompatible explicit choices fail during setup instead of being silently ignored. That last sentence is the one to keep. Silent ignore is how you train the wrong parallel strategy and only notice in the loss.

Ulysses supports SDPA and Flash Attention. Ring and USP training require Flash Attention. The guide says Ringmaster's `torch_native` Ring implementation is forward-only, so it is not a training backend. GDN and KDA recurrent models need a second extra, `pip install 'axolotl[fla,ringmaster]'`, a single batch row after flattening (`micro_batch_size: 1` or `batch_flattening: true`), contiguous shards, and KV caching off. Those FLA packages are the ones the aarch64 marker excludes from core. The extra may still install them. I did not resolve that extra on an aarch64 machine.

Batch math, from the same guide, because people set `context_parallel_size: 4` on eight GPUs and then misread the step time. Each CP group processes one batch distributed across its GPUs. Eight GPUs and CP=4 means two independent data-parallel groups. A microbatch size of two therefore processes four distinct sequences per step, before gradient accumulation. If you wanted eight-way data parallel and also a long sequence, you asked for a different mesh. Write the mesh down before you launch. The N-D guide's equation for the MoE case is `dp_replicate_size × expert_parallel_size × dp_shard_size × context_parallel_size = world_size`. The same habit applies when expert parallel is 1: the product is the GPU count, or the config is wrong.

There is a disagreement inside the tag, and I am not going to sand it flat.

The sequence-parallelism guide says sample packing and batch flattening are supported with CP, and that automatic load balancing selects contiguous shards for packed inputs. GLM DSA kernels stay incompatible with packed CP. The release notes say you can train long-context runs with packed sequences under Ulysses, Ring, or USP.

The example at `examples/distributed-parallel/llama3-8b-ringmaster-cp.yaml` sets `sample_packing: false` and comments `# varlen/packing is v2; long single sequences for now`. It also sets `flash_attention: true`, not `attn_implementation: flash_attention_2`. It uses a `context_parallel:` block with `size: 8`, `backend: auto`, `load_balance: auto`, `ring_impl: auto`, on `NousResearch/Meta-Llama-3.1-8B`, `sequence_len: 32768`, `dp_shard_size: 1`, `fsdp_version: 2`, and `state_dict_type: SHARDED_STATE_DICT`. The comment at the top says launch on 8 GPUs.

So the guide and the release notes say packing is supported. The example does not pack, and its comment says packing is a later version. The guide's attention key and the example's attention key are different strings. I did not train either config, so I did not find out which comment is stale. If you copy the example, you get an unpacked 32k run with `flash_attention: true` and a sharded state dict. If you copy the guide's three-line snippet, you get `attn_implementation: flash_attention_2` and `sample_packing: false`, and you still have to supply the FSDP block yourself. Do not merge those two files in your head and call the result "the Ringmaster config." Pick one file. Read the other as a constraint, not as a patch you apply blindly.

The example's `state_dict_type: SHARDED_STATE_DICT` is legal for that CP example. It is not the state-dict type expert parallelism requires. Do not paste the Ringmaster example's FSDP block under an `expert_parallel_size` and expect the EP validator to shrug. Different axis, different checkpoint rule. Next section.

## NVFP4 LoRA is a merge problem, not a rank problem

The reason this release spends so many words on merge-aware training is a grid, not a slogan. The NVFP4 guide says the grid step is 25–50% of a block's max weight, while a typical trained LoRA delta is well under 1% of the weight magnitude. Re-quantizing `base + delta` onto the base grid rounds most of the delta away. `axolotl merge-lora` warns `NEAR-NO-OP expert merge` when the delta sits that far below the grid. You can train for days and merge into a file that is almost the base. That is the failure mode. Rank 16 does not fix it.

Merge-aware training changes what the forward computes. The guide writes it as:

```text
out = x @ Q(dequant(base) + scaling * (B @ A))^T
```

`Q` is the quantizer `merge-lora` writes with: fresh block scales on the base's per-tensor scale grid. Gradients go through that quantizer with a straight-through estimator, so updates smaller than an FP4 code still accumulate in `A` and `B` until they cross a boundary. The merged NVFP4 checkpoint is then the weights training fake-quantized against. The guide's sentence is "what you trained is what you serve."

The release notes say merge-aware training is on by default for supported ModelOpt/SonicMoE and native TorchAO paths, and `nvfp4_merge_aware: false` opts out. The guide is narrower on the ModelOpt side: for recognized ModelOpt NVFP4 bases with SonicMoE and `adapter: lora` or `adapter: multilora`, it is enabled automatically unless you disable it. `nvfp4_merge_aware: true` makes the choice explicit. Those two sentences agree on the default and disagree in how wide "supported" is. If your path is not in the guide's recognized set, do not assume the default saved you. Look for `NVFP4 MERGE WARNING` in the log. The guide says an unsupported backend, or an explicit false, continues with ordinary LoRA and can lose the learned update at merge time.

Then the part people skip, in a callout on that page. With merge-aware training, the merged checkpoint is the trained model. The raw adapter is an intermediate artifact. Training optimizes the snapped weights `Q(W_eff)`. The un-snapped `base + scaling * (B @ A)` drifts. Serving `base + adapter` unmerged, or merging with `--dequant`, "gives a model that was never trained and can score worse than the base." Both are rejected or warned against. Always serve the merged output.

That is the opposite of the habit from a normal LoRA. Normally you ship the adapter and keep the base frozen, and the sum is the model. Here the sum without the snap is not the model you trained. If your deploy script copies `adapter_model.safetensors` next to the NVFP4 base and calls it done, it is wrong for this path. Run `axolotl merge-lora config.yaml` and serve that output.

The guide also reports a number I did not reproduce: on Qwen3-30B-A3B-NVFP4, with attention and experts both NVFP4, the merged checkpoint recovers about 1.0 of the adapter's improvement over base, and a format-preserving merge without merge-aware training retains about 0.1–0.4. Treat that as the guide's claim. I did not load that checkpoint. I did not compute a recovery ratio. If you need the number for a decision, remeasure it on your run. Do not cite this post as the measurement.

Hardware, from the table at the top of that guide:

| Kernel | Config | Compute | Hardware |
| --- | --- | --- | --- |
| SonicMoE | `use_sonicmoe: true` | W4A4 native, W4A16 fallback | Datacenter Blackwell SM100 for W4A4, Hopper for W4A16. Consumer Blackwell sm_120 not yet supported |
| ScatterMoE | `use_scattermoe: true` | W4A16 (Marlin) | any CUDA GPU sm80+ |

I did not query a device capability this morning. This host has no torch. If you are on a workstation Blackwell card, read that sm_120 cell before you set `use_sonicmoe: true` and wait for a kernel error. ScatterMoE is the path the table marks as any CUDA GPU at sm80 or newer. The Nemotron example in the tag takes that path on purpose. `examples/nemotron-h/super-120b-a12b-nvfp4-lora.yaml` sets `use_scattermoe: true` and `dsv4_fp4_grouped_mode: nvfp4` on `nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4`. The comment at the top says routed experts stay packed NVFP4 and everything else dequantizes to bf16 at load. LoRA targets include `q_proj`, `k_proj`, `v_proj`, `o_proj`, `fc1_latent_proj`, `fc2_latent_proj`, plus `lora_target_parameters` of `up_proj` and `down_proj` for the routed experts. There is no `gate_proj` in that list. The comment says the routed experts are non-gated. Do not paste a Qwen gate/up/down target list onto this checkpoint and call it the same recipe.

A smaller Qwen-shaped block, from the guide, for a ModelOpt NVFP4 base:

```yaml
base_model: nvidia/Qwen3-30B-A3B-NVFP4
plugins:
  - axolotl.integrations.kernels.KernelsPlugin
use_sonicmoe: true
nvfp4_merge_aware: true
adapter: lora
lora_r: 16
lora_alpha: 32
lora_target_modules:
  - q_proj
  - k_proj
  - v_proj
  - o_proj
lora_target_parameters:
  - experts.gate_up_proj
  - experts.down_proj
```

`use_sonicmoe: true` in that snippet inherits the hardware table. If your card is in the "not yet supported" cell, this snippet is not your config. Switch the kernel. Keep the merge-aware flag if the path you switched to is one the guide says is supported. If it is not, expect the warning, and do not serve a merge you were warned would drop the delta.

Dense LoRA kernels (`lora_qkv_kernel`, `lora_o_kernel`, `lora_mlp_kernel`) are opt-in with merge-aware training. The guide says protected projections keep their original forward so the fake quant stays in the graph. It also says the opt-in kernel dispatch has not been benchmarked on a full NVFP4 training run. Measure throughput yourself. I have no tokens-per-second number to hand you.

Native TorchAO checkpoints are a second path in the same document, and they are not the ModelOpt snippet. Merge-aware is the default for supported ordinary LoRA projections. The static-weight path covers FSDP2 and DeepSpeed ZeRO-1/2/3 in the tests the guide names. Dynamic activation quantization on dense native TorchAO is described as SM100+ only. `nvfp4_merge_aware: false` on that path trains ordinary LoRA against a base that will not match the merged file. The guide's line is that merging can then lose the learned update. Same rule as the MoE path: if you opted out, do not expect the merge to be the model you trained.

Adapter metadata records the TorchAO encoder and the recipe. A mismatched torchao version at merge time errors, unless you pass `--override-quantizer`, which downgrades the error to a warning and drops the parity guarantee. The release notes bump torchao `0.17.0 → 0.18.0`. The pin in `pyproject.toml` is `torchao==0.18.0` on the platforms the marker allows. If you merge on a different torchao than you trained with, you are in that error path. Pin the env. Do not "upgrade torchao real quick" between train and merge.

## Expert parallel without DeepEP is a backend flag

DeepEP is a fast path that wants a specific interconnect. A lot of boxes do not have it. v0.20.0 adds a plain torch `all_to_all` backend so expert parallelism is not gated on that library. The release notes say `expert_parallel_backend: auto` uses DeepEP when it is installed and the torch backend otherwise. `expert_parallel_dispatch_chunks` overlaps dispatch with the expert GEMMs. EP requires `fsdp_version: 2` and `state_dict_type: FULL_STATE_DICT`. EP combined with tensor parallelism is rejected.

The N-D guide is the longer version of that contract. Each rank holds `num_experts / ep_size` experts. Tokens move to the rank that owns the chosen expert. EP under DDP, or with a sharded state dict, is rejected at config validation, because a sharded checkpoint would keep only EP group 0's experts. That is why the Ringmaster example's `SHARDED_STATE_DICT` must not be copied here. The saved checkpoint has to carry every expert. `FULL_STATE_DICT` is the key that does that.

The mesh equation again, because this is where people drop a factor:

```text
dp_replicate_size × expert_parallel_size × dp_shard_size × context_parallel_size = world_size
```

A bare `(dp_replicate, ep)` mesh is rejected. HSDP × EP needs `dp_shard_size > 1` or `context_parallel_size > 1`. The support matrix in that guide marks "HSDP + EP, no shard axis" as not supported. EP × TP is not supported. DDP + TP/CP is not supported. The matrix uses a check, a warning, and an x. Copy the row you mean. Do not average them into "3D parallelism works."

A minimal composition from the guide, EP × CP on 4 GPUs:

```yaml
base_model: Qwen/Qwen3-30B-A3B
plugins:
  - axolotl.integrations.expert_parallel.ExpertParallelPlugin
expert_parallel_size: 2
context_parallel_size: 2
fsdp_version: 2
fsdp_config:
  auto_wrap_policy: TRANSFORMER_BASED_WRAP
  transformer_layer_cls_to_wrap: Qwen3MoeDecoderLayer
  state_dict_type: FULL_STATE_DICT
  cpu_ram_efficient_loading: true
attn_implementation: flash_attention_2
sample_packing: false
```

`2 × 2 = 4`. If you have four GPUs and you also set `dp_shard_size: 2`, the product is 8 and the config is wrong. Add `dp_shard_size` only when you add GPUs to match, or drop another factor. The guide's 8-GPU note for that layout is `expert_parallel_size: 2`, `context_parallel_size: 2`, `dp_shard_size: 2`.

`expert_parallel_backend` defaults to `auto`. Set `torch` if you want to be sure you are not accidentally on DeepEP because the import succeeded in a dirty env. Set `deep_ep` only when you meant to install it and you have the interconnect the guide names (Ampere or Hopper, all-pairs NVLink or RDMA). The torch backend's own description is a plain `all_to_all_single` on the EP process group, including PCIe-only nodes with no NVLink. Slower is still a run. A rejected config is not.

LoRA on the experts uses `lora_target_parameters` in either layout. The guide says a fresh adapter is drawn per module from `seed`, so a one-step gradient check should match whether or not the experts are sharded. That is a check you can run. I did not.

## Three smaller contract changes that will bite a normal config

These are not the headlines. They are the ones a single-box config actually hits.

**Dataset weight.** The release notes say a `weight` in `(0, 1.0]` on an SFT dataset entry shuffles and subsamples that dataset to `weight * len(dataset)` examples before tokenization. The weight is folded into the dataset fingerprint, so a cache from the unweighted mix is not reused. Streaming datasets are not subsampled. They warn at validation. That is the way to downweight a large corpus without writing a pre-mixed file. I did not find a separate YAML schema beyond the field name `weight` on the dataset entry, and I did not run a mix. Put `weight` on the entry, not in a side file, and expect a new fingerprint.

**Modal left core.** `pyproject.toml` lists `modal` and `baseten` as optional extras (`modal==1.3.0.post1`, `truss==0.18.30`). The release notes say `modal` moved out of the core dependencies. If `axolotl train --cloud` used to work because Modal was always installed, it will not, until you `pip install 'axolotl[modal]'`. Baseten is `axolotl[baseten]`. The notes also name Nebius as experimental, next to Modal and Baseten, with new providers shipping through the `axolotl.cloud_providers` entry point. I did not launch a cloud job. If you do not use `--cloud`, ignore this paragraph. If you do, install the extra before you blame the provider.

**Old Mamba checkpoints.** Legacy `MambaLMHeadModel` loading is removed. Raw `mamba_ssm` checkpoints such as `state-spaces/mamba-2.8b` with `model_type: MambaLMHeadModel` no longer load. The notes say to use a Hugging Face format checkpoint, and they give `state-spaces/mamba-130m-hf` as the shape of that path. Sample packing for Mamba, Mamba2, and Falcon-Mamba is in this release, with recurrent and convolution state reset at document boundaries. That packing work does not resurrect the old loader. Convert the checkpoint, or pick the HF one. Do not pin Axolotl back to 0.19.0 to keep a loader the project removed, unless you have a reason you can say out loud.

Two bug fixes are worth knowing if you are comparing an old run to a new one, and then I will stop listing fixes. The release notes say LoRA+ never forwarded `weight_decay` to PEFT as `loraplus_weight_decay`, so every LoRA+ run trained with `weight_decay=0.0` regardless of the config (`#4011`, fixes `#4010`). If you thought an old LoRA+ run honored decay, it did not. This tag is the one that forwards it. Separately, `axolotl merge-lora` now raises on 4-bit block sizes other than 64, and on ambiguous or mismatched adapter mappings, instead of silently skipping. A merge that used to "succeed" while dropping a tensor will now stop. That is the behavior you want. Let it stop.

I am not walking the rest of the bug list. Sixty-seven commits include CI, docs links, and contributor credits. Those are in the release body if you want them. They do not change the floor.

## What a bump does not authorize

v0.20.0 is a trainer release. It is not evidence of any of the following:

- That a model trained under merge-aware NVFP4 matches the guide's ~1.0 recovery on your data. That figure is the guide's, on one named checkpoint, and I did not rerun it.
- That SonicMoE W4A4 runs on a consumer Blackwell card. The table says sm_120 is not yet supported. I did not probe a card.
- That Ringmaster packing is safe because the release notes say packed sequences work, or unsafe because the example comment says packing is v2. Both sentences are in the tag. I did not train either config.
- That GGUF export is the right artifact for vLLM or SGLang. The export guide says it is not.
- That Python 3.14.7 on this host means the test matrix passed here. The notes say 3.14 is in the matrix. This host does not have the package installed.
- That any of this was measured on a DGX Spark. It was not. The aarch64 markers are a reason to read `pyproject.toml` on that box before you install, not a benchmark result.

If you want a number, produce it on the machine that will serve the model. A release note is a contract. A contract is not a throughput table.

## A short decision tree

Print `python3 --version` and, in the training env, the torch version.

If Python is below 3.12, or torch is outside `2.13.0`–`2.14.0`, fix the env before you touch the YAML. The pin will stop you anyway. Better to stop on purpose.

If the YAML has `fsdp_version: 1` or a top-level `fsdp:` list, apply the mapping. Rename the prefixed keys. Set `reshard_after_forward` from the old sharding strategy. Do not launch to "see the error." You already know it raises.

If you need a GGUF, merge, build llama.cpp beside the env rather than inside it, then `axolotl export config.yml --quantize Q4_K_M,Q8_0`. If the base is already quantized, `--dequant` on the merge first. If the runtime is vLLM, SGLang, or TGI, skip GGUF and serve the merged safetensors.

If you are LoRA-training NVFP4, decide the kernel from the hardware table, keep merge-aware on unless you have a reason to opt out, and serve the merged file. Watch for `NVFP4 MERGE WARNING` and `NEAR-NO-OP expert merge`. Either string means the file you are about to deploy may not be the model you trained.

If you need the sequence split across GPUs, install `axolotl[ringmaster]`, set `context_parallel` or `context_parallel_size`, and make the degree divide the GPU count. Read the example and the guide as two files. Do not average them.

If you need expert parallel and DeepEP is not installed, leave `expert_parallel_backend` on `auto` or set `torch`, require FSDP2, and set `state_dict_type: FULL_STATE_DICT`. Check the product of the mesh sizes against `world_size` before you allocate the nodes.

Then train. Not before.

## Sources

Read this morning, not from memory:

- Release JSON for [v0.20.0](https://github.com/axolotl-ai-cloud/axolotl/releases/tag/v0.20.0), published 2026-09-30T14:08:10Z, and [v0.19.0](https://github.com/axolotl-ai-cloud/axolotl/releases/tag/v0.19.0), published 2026-09-10T14:19:22Z.
- Tag files: `pyproject.toml`, `VERSION`, `docs/export.qmd`, `docs/multi-gpu.qmd`, `docs/sequence_parallelism.qmd`, `docs/nvfp4_lora.qmd`, `docs/nd_parallelism.qmd`, `examples/distributed-parallel/llama3-8b-ringmaster-cp.yaml`, `examples/nemotron-h/super-120b-a12b-nvfp4-lora.yaml`, all at `v0.20.0`.
- Local commands: `uname -m` (`x86_64`), `python3 --version` (`Python 3.14.7`), `command -v axolotl` (not found), `import torch` (`ModuleNotFoundError`).

The rendered guides the release links — [export](https://docs.axolotl.ai/docs/export.html), [sequence parallelism](https://docs.axolotl.ai/docs/sequence_parallelism.html), [NVFP4 LoRA](https://docs.axolotl.ai/docs/nvfp4_lora.html), [N-D parallelism](https://docs.axolotl.ai/docs/nd_parallelism.html), [FSDP migration](https://docs.axolotl.ai/docs/multi-gpu.html#sec-migrate-fsdp1-fsdp2) — are the same documents only if they still match the tag. I did not diff the live site against the qmd files.
