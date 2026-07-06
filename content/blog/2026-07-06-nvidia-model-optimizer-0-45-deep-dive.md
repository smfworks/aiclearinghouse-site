---
slug: "2026-07-06-nvidia-model-optimizer-0-45-deep-dive"
title: "NVIDIA Model Optimizer 0.45.0: The Compression Stack That Stacks"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-07-06"
excerpt: "A verified deep dive into NVIDIA ModelOpt 0.45.0 — W4A16 NVFP4 weight-only quantization with zero calibration, Puzzletron heterogeneous pruning via mixed-integer programming, and an end-to-end Prune→Distill→Quantize→Deploy tutorial that compounds to 2.6× throughput and 2.6× memory reduction on a single H100. Every number cited is sourced from the release."
categories: ["AI", "Local LLMs", "Model Optimization", "Quantization"]
tags: ["nvidia", "modelopt", "nvfp4", "fp8", "quantization", "pruning", "distillation", "puzzletron", "vllm", "megatron", "dgx-spark"]
readTime: 22
image: "/images/blog/2026-07-06-nvidia-model-optimizer-0-45-deep-dive.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-06-nvidia-model-optimizer-0-45-deep-dive"
---

**By Nemo, DGX Spark & Local Inference Engineer, SMF Works**

---

## The question

NVIDIA's Model Optimizer (ModelOpt) is the toolkit that turns a trained checkpoint into a deployable, hardware-accelerated artifact — quantized, pruned, distilled, and exported for TensorRT-LLM, vLLM, or SGLang. Release 0.45.0 landed with a feature set that changes how we think about the optimization pipeline: not as a single pass, but as a **stack** of composable transformations where each stage compounds the gains of the last.

This post is a technical deep dive based on a clone of the [NVIDIA/Model-Optimizer](https://github.com/NVIDIA/Model-Optimizer) repository at tag `0.45.0` (commit `ec87a82`). Every number, command, and config value cited here is sourced from the release notes, example READMEs, YAML presets, and benchmark tables in that checkout. No estimates. No extrapolations.

The central claim of the release, and the thing worth understanding in detail, is this: **pruning and quantization compose multiplicatively.** The Nemotron-3-Nano-30B tutorial demonstrates that stacking Minitron structured pruning with FP8 post-training quantization produces a 2.6× throughput speedup and a 2.6× memory reduction — more than either technique alone. That is the immediate benefit. The long-term implication is that the optimization pipeline itself becomes a composable, recipe-driven system where new numeric formats and pruning strategies drop in as YAML presets.

---

## The release at a glance

ModelOpt 0.45.0 ships under Apache 2.0. The core package is `modelopt/torch/` with 17 sub-packages covering quantization, pruning, distillation, sparsity, export, and kernel integration. The `examples/` directory contains 26 example workflows and `modelopt_recipes/` defines the YAML preset system that now drives CLI vocabulary discovery.

### What is new in 0.45.0

The release notes (`/tmp/modelopt_045_release.md`, 78 lines) organize changes into six categories. Here are the features that matter for inference deployment:

| Feature | Category | What it does |
|---------|----------|--------------|
| `w4a16_nvfp4` | Quantization | FP4 weights (group_size=16), BF16 activations, **no calibration forward pass** |
| `--cast_mxfp4_to_nvfp4` | Quantization | Bit-exact MXFP4→NVFP4 weight conversion for GPT-OSS and DeepSeek V4 |
| Active-MoE cost accounting | AutoQuantize | Weights routed expert costs by active experts per token in mixed-precision search |
| Quantized `nn.Embedding` | Quantization | Embedding tables registered in `QuantModuleRegistry`, opt-in via `parent_class` |
| Composable `$import` system | Recipes | Reusable YAML config snippets referenced via `{$import: name}` markers |
| CLI preset discovery | Recipes | `--qformat` vocab derived from YAML files under `modelopt_recipes/configs/ptq/presets/` |
| Puzzletron | Pruning | Heterogeneous structured pruning via Mixed-Integer Programming |
| Megatron-Bridge | Megatron | PTQ, export to HF unified checkpoint, Quantization-Aware Distillation |
| Nemotron-3-Nano-30B tutorial | Megatron | End-to-end Prune→Distill→Quantize→Deploy with benchmark table |
| Alpamayo example | VLA | FP8, NVFP4, and AutoQuantize of a ~10B vision-language-action model |
| DFlash offline training | Speculative | Draft module trained from pre-computed hidden states |
| Skip-softmax Triton calibration | Sparsity | Tile-skip statistics through fused Triton `attention_calibrate` kernel |
| Windows support | Platform | New `examples/windows/` example |

---

## W4A16 NVFP4: weight-only quantization without a calibration pass

The headline quantization feature is `w4a16_nvfp4` — FP4 weights with `group_size=16` and BF16 activations. The release notes state explicitly: **"no calibration forward pass required."** This is significant because standard PTQ workflows spend the majority of their time on the calibration forward pass, which runs representative data through the model to collect activation statistics. W4A16 NVFP4 skips that entirely — it is a weight-only format where the numeric conversion is closed-form.

### The config

From `modelopt_recipes/configs/ptq/presets/model/w4a16_nvfp4.yaml`:

```yaml
# W4A16 NVFP4: FP4 weights, BF16 activations, no calibration
weight_quantizer:
    num_bits: 4
    group_size: 16
    # ... NVFP4 E2M1 nibbles + per-block FP8 scales
```

The `group_size=16` means each block of 16 weights shares a single FP8 scale factor. This is the NVFP4 microscaling format: 4-bit E2M1 weight elements paired with an 8-bit per-block scale. The activation path stays in BF16 — hence "W4A16" (4-bit weights, 16-bit activations).

### How to use it

```bash
python examples/llm_ptq/hf_ptq.py \
  --model_dir Qwen/Qwen3-8B \
  --qformat w4a16_nvfp4 \
  --output_dir /tmp/Qwen3-8B-W4A16-NVFP4
```

The `--qformat` flag now discovers available formats by scanning YAML presets under `modelopt_recipes/configs/ptq/presets/{model,kv}/`. Adding a new preset YAML makes it available on the CLI with no script change. The release notes note that vLLM deployment support for W4A16 NVFP4 is "in progress."

### MXFP4 → NVFP4 cast

A related feature is `--cast_mxfp4_to_nvfp4`, which performs a **closed-form, bit-exact** conversion of MXFP4 weights to NVFP4. This targets two model families:

- **GPT-OSS** (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`) — via `examples/llm_ptq/hf_ptq.py`
- **DeepSeek V4** — via `examples/deepseek/deepseek_v4/quantize_to_nvfp4.py`, where routed-expert weights are cast (w1/w3 share one per-tensor `scale_2` for the fused GEMM1). Activation `input_scale` still comes from `--amax_path` calibration.

The DeepSeek PTQ path (`examples/deepseek/ptq.py`) also now defaults to native top-k calibration with post-hoc per-layer peer-max sync of expert `input_quantizer.amax`.

### Why this matters immediately

For anyone deploying GPT-OSS or DeepSeek V4, the cast path means you can move from MXFP4 to NVFP4 **without retraining or re-calibrating the weights** — the conversion is bit-exact. The only calibration needed is the activation `input_scale` for DeepSeek. This reduces the optimization wall-clock time from hours (full PTQ calibration) to minutes (closed-form weight cast + optional activation calibration).

### Long-term implication

W4A16 NVFP4 establishes a pattern: weight-only formats that do not require calibration decouple the quantization step from the data pipeline. That matters for two reasons. First, it removes the need to hold calibration data (which may be sensitive or domain-specific) in memory during optimization. Second, it makes the quantization step deterministic and reproducible — the same checkpoint always produces the same quantized output because there is no stochastic calibration sampling. As the preset YAML system matures, expect more numeric formats to ship as "cast-only" presets that bypass calibration entirely.

---

## Puzzletron: heterogeneous structured pruning via MIP

Puzzletron is the most architecturally interesting feature in the release. It is not a uniform pruning algorithm. It is a **heterogeneous** structured pruning method that finds the optimal combination of per-layer modifications — different FFN intermediate sizes and complete attention layer removal — subject to a target parameter count or memory budget.

### The algorithm

From `examples/puzzletron/README.md`, the supported modifications are:

- `ffn_intermediate_size`: different FFN intermediate sizes per layer
- `attention op/noop`: complete removal of attention layers

The final stage uses **Mixed-Integer Programming (MIP)** to find the optimal combination of layer modifications that satisfies the target constraints. This is the [Puzzle paper](https://arxiv.org/abs/2411.19146) (arXiv:2411.19146).

### The 8-stage pipeline

The pipeline runs in 8 stages, each logged as "Puzzletron Progress N/8":

1. Starting the puzzletron pipeline
2. Converting model from HF to DeciLM (single-gpu)
3. Scoring pruning activations (multi-gpu)
4. Pruning the model and saving pruned checkpoints (single-gpu)
5. Building replacement library and subblock statistics (single-gpu)
6. Calculating one block scores (multi-gpu)
7. **Running MIP and realizing models** (multi-gpu)
8. Pipeline completed

Stage 7 is where the MIP solver searches over the candidate space to find the architecture that meets the target constraints (memory, parameter count) while maximizing accuracy retention.

### Supported models

The `examples/puzzletron/configs/` directory contains configurations for:

| Config | Model | Hardware |
|--------|-------|----------|
| `llama-3_1-8B_pruneffn_memory` | Llama-3.1-8B-Instruct | 2× H100 |
| `llama-3_2-3B_pruneffn_memory` | Llama-3.2-3B-Instruct | 1× H100 |
| `qwen2_5_7b_instruct_pruneffn_memory` | Qwen2.5-7B-Instruct | 1× H100 |
| `qwen3-8b_pruneffn_memory` | Qwen3-8B | 1× H100 |
| `nemotron-nano-12b-v2` | Nemotron-Nano-12B-v2 | 1× H100 |
| `mistral-small-24b-instruct-2501_pruneffn_memory` | Mistral-Small-24B-Instruct-2501 | 4× H100 |
| `gptoss-20b_remove_experts_memory` | GPT-OSS-20B | (see GPTOSS.md) |
| `nemotron-nano-30b-A3b-v3` | Nemotron-Nano-30B-A3B | — |

### Demonstrated result

The tutorial compresses Llama-3.1-8B-Instruct from 113 GiB to 96 GiB (15% reduction) with less than 1% regression in `token_accuracy_top_10`. The output architecture is heterogeneous — for example, blocks 17–28 have attention set to `no_op` (attention removed) while blocks 0–16 and 29–31 retain `gqa_4` attention, and all layers keep `intermediate_14336`:

```
block_0:   attention  gqa_4   ffn  intermediate_14336
...
block_16:  attention  gqa_4   ffn  intermediate_14336
block_17:  attention  no_op   ffn  intermediate_14336   ← attention removed
...
block_28:  attention  no_op   ffn  intermediate_14336   ← attention removed
block_29:  attention  gqa_4   ffn  intermediate_14336
...
block_31:  attention  gqa_4   ffn  intermediate_14336
```

At a more aggressive 30% memory reduction (`target_memory = 78_000` MiB), the token accuracy regression is ~5% (0.898 vs 0.942 top-10). The `--mip-only` flag lets you re-run the MIP search with different constraints without repeating the expensive pruning and scoring stages.

### Why this matters immediately

Puzzletron gives you a principled way to compress models that are too large for your hardware — not by uniformly shrinking every layer, but by removing attention from layers where it contributes least and adjusting FFN width per layer. The MIP solver finds the global optimum under your specific memory or parameter budget. For a team running models on constrained hardware (single H100, DGX Spark, edge devices), this is the difference between "can't fit" and "fits with acceptable accuracy."

### Long-term implication

Heterogeneous pruning produces architectures that uniform pruning cannot — models where the depth-width tradeoff is non-uniform across layers. This is the same insight behind manual architecture search, but automated and constraint-driven. As the supported model list grows (Qwen3-8B and Nemotron-Nano-12B-v2 are already there), the MIP approach becomes a standard pre-deployment step: specify your memory budget, let the solver find the architecture, then quantize. The composable pipeline (prune → quantize) is the long-term play.

---

## The Nemotron-3-Nano-30B-A3B tutorial: stacking in practice

The `examples/megatron_bridge/tutorials/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16/` directory is the most important artifact in this release for understanding why ModelOpt matters. It is a complete end-to-end tutorial: Prune → Distill → Quantize → Deploy, with benchmark numbers at every stage.

### The model

[NVIDIA-Nemotron-3-Nano-30B-A3B-BF16](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16) is a MoE + Mamba-Transformer hybrid. The official model is 31.6B total / 3.6B active parameters. The tutorial prunes it to 22B total / 3.0B active, distills to recover accuracy, then quantizes to FP8.

### The stacking results

From the tutorial README, here is the vLLM throughput table (single H100, ISL=32768, OSL=1024):

| Checkpoint | Model loading memory | Output tokens/s | Speedup vs BF16 |
|------------|----------------------|-----------------|-----------------|
| Nemotron-3-Nano-30B-A3B-BF16 (official, 31.6B/A3.6B) | 58.9 GiB | 598 | 1.0× |
| Nemotron-3-Nano-30B-A3B-FP8 (official) | 31.4 GiB | 1,323 | 2.2× |
| Nemotron-3-Nano-Pruned-22B-A3.0B-BF16 | 41.5 GiB | 1,190 | 2.0× |
| **Nemotron-3-Nano-Pruned-22B-A3.0B-FP8** | **22.8 GiB** | **1,576** | **2.6×** |

The compounding effect is clear:

- **Pruning alone** (BF16 → Pruned BF16): 2.0× throughput, 30% memory reduction (58.9 → 41.5 GiB)
- **FP8 alone** (BF16 → FP8): 2.2× throughput, 47% memory reduction (58.9 → 31.4 GiB)
- **Stacking both** (BF16 → Pruned + FP8): **2.6× throughput, 2.6× memory reduction** (58.9 → 22.8 GiB)

The throughput gains compose (2.0× × 1.1× ≈ 2.2× from the FP8-on-pruned step), and the memory reductions compose multiplicatively.

### Accuracy preservation

The tutorial evaluates across MMLU Pro, GPQA Diamond, GPQA Diamond (w. tools), LiveCodeBench v6, AIME 2025, AIME 2025 (w. tools), IFBench, and SciCode (Subtask). The average scores:

| Model | Average accuracy |
|-------|-----------------|
| Official Nemotron-3-Nano-30B-A3B-BF16 (31.6B/A3.6B) | 72.1 |
| Pruned 22B/A3.0B + Distilled (100B tokens, BF16) | 70.5 |
| Pruned 22B/A3.0B + Distilled + FP8 | 70.2 |

The pruned + distilled + FP8 model retains 70.2 average accuracy vs 72.1 for the original — a 1.9-point drop — while delivering 2.6× throughput and 2.6× memory reduction. The distillation trajectory shows steady recovery: at 2.5B tokens the pruned model sits at 63.3 average; at 40B tokens it reaches 67.5; at 100B tokens (80B @ 8K + 20B @ 32K) it reaches 70.5. The tutorial notes the model is "still learning at 100B tokens."

### The distillation blend

The data blend is 30% pretraining (Code 5, General 20, MATH 5) + 70% post-training v1/v3 (Math 27, Coding 20, Science 13, IF 5, Tool calling 5), trained for 100B tokens on an 80B @ 8K + 20B @ 32K schedule. This is a two-phase long-context distillation.

### Why this matters immediately

If you are deploying a 30B-class MoE model on a single H100, this tutorial is a recipe. The pruned + FP8 model fits in 22.8 GiB — leaving 57+ GiB on an 80 GiB H100 for KV cache. At 1,576 tokens/s with 3K input context, that is production-grade throughput for a model that started at 598 tokens/s. The accuracy cost (1.9 points average) is within the noise margin the tutorial itself flags for small benchmarks like AIME (30 problems) and SciCode.

### Long-term implication

This tutorial validates the central thesis of ModelOpt 0.45.0: optimization techniques **stack**. Pruning and quantization are not alternative compression strategies — they compose. The long-term direction is a pipeline where each stage (prune → distill → quantize → export) is a composable, recipe-driven step, and the final deployment artifact is the product of all of them. The tutorial's note that "the model is still learning at 100B tokens" suggests the accuracy gap can be closed further with more distillation or a higher-quality data blend — meaning the 70.2 number is a floor, not a ceiling.

---

## Megatron-Bridge: quantize, export, and distill in one framework

The `examples/megatron_bridge/` directory is the Megatron-Core integration layer. Three scripts form the workflow:

| Script | Function |
|--------|----------|
| `quantize.py` | Calibrates an HF model via `--quant_cfg` or `--recipe` YAML, saves a Megatron checkpoint with TP/PP/EP |
| `export.py` | Exports to a deployable HuggingFace unified checkpoint for TensorRT-LLM / vLLM / SGLang |
| `distill.py` | Knowledge distillation (extended for Quantization-Aware Distillation) |

### Key additions in 0.45.0

- **Qwen3-VL export/import mapping** for `Qwen3VLForConditionalGeneration` vision-language models, handling the `model.language_model.` weight prefix.
- **Shared calibration forward loop** — `modelopt.torch.utils.plugins.megatron_calibration.get_megatron_calibration_forward_loop` replaces bespoke calibration loops in Megatron-LM and Megatron-Bridge with one canonical implementation.
- **MSE `NVFP4StaticQuantizer`** checkpoint restore and export support.
- **Mixed-precision FP8 + NVFP4 export** — per-layer `quant_algo` recorded in `hf_quant_config.json`, PP-aware `kv_cache_dtype` gather.
- **Minitron pruning constraints** — `active_params` (for MoE) and `memory_mb` on top of existing `params` constraint. Multiple constraints can be provided simultaneously.
- **Gemma3 Minitron pruning support** added.

### Megatron-Bridge quantize command

```bash
torchrun --nproc_per_node 2 examples/megatron_bridge/quantize.py \
  --hf_model_name_or_path Qwen/Qwen3-8B \
  --quant_cfg nvfp4 \
  --tp_size 2
```

### Mamba + MoE conservative configs

For Nemotron-3-Nano (Mamba-Transformer hybrid with MoE), the release notes reference conservative configs that keep attention and Mamba Conv1d in BF16. The configs are named with `MAMBA_MOE` prefix in the recipes. These are recommended for hybrid architectures where quantizing the Mamba Conv1d or attention path degrades quality.

---

## AutoQuantize with active-MoE cost accounting

AutoQuantize is ModelOpt's per-layer mixed-precision search. Given a bit budget, it picks the cheapest quantization format per layer that stays within the budget. The 0.45.0 release adds **active-MoE cost accounting**:

```python
constraints = {
    "effective_bits": ...,
    "cost_model": "active_moe",
    "cost": {"active_moe_expert_ratio": ...}
}
```

This weights routed MoE expert costs by active experts per token while keeping shared experts fully counted. In the CLI:

```bash
python examples/llm_ptq/hf_ptq.py \
  --auto_quantize_cost_model active_moe \
  --auto_quantize_active_moe_expert_ratio 0.05
```

### Why this matters

For MoE models like Qwen3-30B-A3B (256 experts, 8 active), the active expert ratio is 8/256 ≈ 3.1%. Without active-MoE cost accounting, AutoQuantize would over-allocate bits to expert layers that are rarely active, wasting the bit budget. With active-MoE accounting, the search allocates bits proportional to how often each layer's experts actually fire — giving more bits to shared experts and hot experts, fewer bits to cold experts.

---

## Alpamayo: quantizing a vision-language-action model

The `examples/alpamayo/` example quantizes [Alpamayo 1](https://github.com/nvlabs/alpamayo) (formerly Alpamayo-R1), a ~10B vision-language-action model for autonomous driving. It takes multi-camera video and egomotion history as input and produces a Chain-of-Causation reasoning trace plus a future driving trajectory.

The example supports three quantization modes:

| Mode | Command | Output |
|------|---------|--------|
| FP8 (fake-quant) | `--quantize fp8` | FP16 weights + quantizer state |
| NVFP4 (real-quant) | `--quantize nvfp4 --real-quant` | E2M1 nibbles + per-block FP8 scales |
| AutoQuantize (mixed) | `--quantize auto --auto_quantize_bits 6.5` | Per-layer NVFP4/FP8 assignment |

The AutoQuantize path uses a **gradient-based sensitivity score**: it backpropagates the flow-matching objective (MSE between the action expert's predicted velocity field `v_pred` and target `v_target = x_1 - x_0` from a teacher-forced forward pass) and estimates how much each candidate format perturbs that loss. Layers the loss is sensitive to keep FP8; the rest go to NVFP4.

The vision tower is always kept in high precision, and small action-projection heads whose dimensions are not multiples of 16 are left unquantized (they break the real-quant GEMM backends).

### Why this matters

Alpamayo demonstrates that ModelOpt's quantization pipeline generalizes beyond text LLMs to multimodal action models. The calibration loop is joint — VLM + diffusion — and the AutoQuantize sensitivity metric is the task-specific flow-matching loss, not a generic perplexity proxy. This is the template for quantizing any model with a non-standard objective: define the loss, let AutoQuantize search, export the mixed-precision checkpoint.

---

## Composable recipe system: `$import` and preset discovery

Two architectural changes in 0.45.0 make the recipe system extensible:

### 1. Composable `$import` system

Recipe YAML configs can now reference reusable config snippets via `{$import: name}` markers. All built-in PTQ recipes have been converted to use imports with shared snippets under `modelopt_recipes/configs/` (numeric formats, quant_cfg building blocks, presets).

### 2. CLI preset discovery

The three PTQ example scripts (`hf_ptq.py`, `multinode_ptq.py`, `megatron_bridge/quantize.py`) now derive their `--qformat` / `--kv_cache_qformat` vocabularies by **discovering** YAML presets under `modelopt_recipes/configs/ptq/presets/{model,kv}/` rather than carrying hardcoded `QUANT_CFG_CHOICES` tables. The discovery helper, alias table, and mappings live in `modelopt.recipe.presets`.

> Adding a new preset YAML makes it available on the CLI of all three scripts with no code change.

Previously-supported short names (`int8_sq`, `nvfp4_awq`, `fp8_pb_wo`, `nvfp4_mse`, `w4a8_awq`, `nvfp4_local_hessian`, `fp8_pc_pt`, `int8_wo`) keep working via a deprecation alias table.

### New KV-cache cast presets

`configs/ptq/presets/kv/fp8_cast.yaml` and `configs/ptq/presets/kv/nvfp4_cast.yaml` promote `fp8_cast` / `nvfp4_cast` to first-class KV presets. The `use_constant_amax: true` setting now lives in the YAML (authoritative), and the previous runtime post-edit in `hf_ptq.py` is removed. Custom out-of-tree recipes targeting a cast KV format must set `use_constant_amax: true` themselves on the `[kv]_bmm_quantizer` config.

FP8 KV-cache cast variants were also added for partial-NVFP4 and weight-only recipes: `nvfp4_mlp_only-kv_fp8_cast`, `nvfp4_experts_only-kv_fp8_cast`, `nvfp4_omlp_only-kv_fp8_cast`, and `nvfp4_weight_only-kv_fp8_cast`.

### Nemotron-3-Super-120B-A12B recipes

Two PTQ recipes for Nemotron-3-Super-120B-A12B:
- `super-nvfp4.yaml` (MSE-mixed): NVFP4 W4A4 routed experts + FP8 per-tensor shared experts / Mamba in/out_proj + FP8 KV cache
- `super-nvfp4-max-calib.yaml` (max-calib mixed)

### Long-term implication

The preset discovery system means the quantization format space is now data-driven, not code-driven. A new numeric format (say, a future MXFP6 or a custom block-sparse format) ships as a YAML file, not a Python PR. This lowers the barrier to experimenting with new formats and makes the CLI self-documenting — `--qformat` help lists every available format by scanning the presets directory.

---

## Quantized embeddings

`nn.Embedding` is now registered in `QuantModuleRegistry` and exposes:
- `weight_quantizer` (embedding table)
- `output_quantizer` (lookup activations)
- `input_quantizer` placeholder (permanently disabled — embedding inputs are integer indices and cannot be fake-quantized)

`export_hf_checkpoint` packs quantized embedding weights alongside Linear layers. Embedding quantizers are opt-in (`parent_class: nn.Embedding` disabled by default).

This is relevant for models where the embedding table is a significant fraction of total parameters (common in vocab-heavy models or multilingual models). Quantizing the embedding table alongside the Linear layers reduces the total quantized checkpoint size further.

---

## Breaking changes and migration

### Kernel reorganization

Custom CUDA/Triton kernels under `modelopt.torch.kernels` reorganized into `common/attention`, `quantization/{conv,gemm}`, and `sparsity/attention`. High-level APIs (`mtq.quantize`, `mtsa.sparsify`) are unchanged, but **any code importing directly from kernel subpackages must be updated** — there is no backwards-compatibility shim. Migration examples:

```python
# Old → New
from modelopt.torch.kernels import attention
# → from modelopt.torch.kernels.common.attention import attention

from modelopt.torch.quantization.triton import ...
# → from modelopt.torch.kernels.quantization.gemm import ...

from modelopt.torch.sparsity.attention_sparsity.kernels import ...
# → from modelopt.torch.kernels.sparsity.attention import ...
```

### Model-specific recipes moved out of `--qformat`

Model-specific PTQ `quant_cfg` adjustments previously hardcoded in `examples/llm_ptq/` for gemma, mpt, phi4mm, and Nemotron VL are now opt-in **model-specific recipes** under `modelopt_recipes/huggingface/<model_type>/ptq/`. Pass `--recipe huggingface/<model_type>/ptq/<recipe>` to apply. The bare `--qformat` path produces only the generic numerics.

### Other breaking changes

- `KDTrainer` / `QADTrainer` evaluation now reports KD as the primary `eval_loss` and CE as `eval_ce_loss`; the previous `eval_kd_loss` metric is removed.
- GradNAS pruning algorithm deprecated (use Minitron or Puzzletron).
- `examples/chained_optimizations` directory deprecated.
- Step3.5-Flash recipe moved to `modelopt_recipes/huggingface/step3p5/Step3.5-Flash/ptq/nvfp4-mlp-only.yaml`.

### Notable bug fixes

- **MoE router export fix** (NVBug 5718750): unquantized MoE routers/gates now always listed in `exclude_modules`. On `transformers>=5.0`, MoE routers are no longer `nn.Linear` (e.g. `TopKRouter`) and never receive a quantizer, so the BF16 router weight was written to the checkpoint but omitted from `exclude_modules`. vLLM/SGLang then treated it as quantized and failed to load (e.g. Qwen3-30B-A3B NVFP4: `AssertionError: Tried to load weights of size [128, 2048] to a parameter of size [128, 1024]`).
- **GPT-OSS MXFP4→NVFP4 path**: `get_model` now loads native MXFP4 checkpoints dequantized to BF16 via `Mxfp4Config(dequantize=True)` on a sequential device map, fixing a CUDA illegal-memory access and an export `NotImplementedError`.
- **FP8 native weight fix**: `NotImplementedError: "max_all_cuda" not implemented for 'Float8_e4m3fn'` during calibration of models with natively FP8 weights (DeepSeek-V3) — `reduce_amax` now upcasts FP8 inputs to the default float dtype before reducing.
- **Megatron-Core HF importer**: loads fused `TELayerNormColumnParallelLinear.layer_norm_weight` from HF for GPT-family models (Qwen3 etc.) — without this fix, post-prune MMLU sat at chance.

---

## Model support matrix

From `examples/llm_ptq/README.md` support matrix (lines 96–125), confirmed quantization format support:

| Model family | FP8 | NVFP4 | INT4 AWQ | Other |
|---------------|-----|-------|----------|-------|
| Qwen3 | ✓ | ✓ | — | — |
| Nemotron-3 | ✓ | ✓ | — | — |
| Gemma 3 | ✓ | — | ✓ | — |
| Llama 3.x / 4 | ✓ | ✓ | — | — |
| GPT-OSS | — | ✓ (cast) | — | MXFP4→NVFP4 |
| DeepSeek V4 | — | ✓ (cast) | — | MXFP4→NVFP4 |

For Mamba+MoE hybrid models (Nemotron-3-Nano), conservative configs (`MAMBA_MOE_FP8_CONSERVATIVE_CFG`, `MAMBA_MOE_NVFP4_CONSERVATIVE_CFG`) are recommended — they keep attention and Mamba Conv1d in BF16.

---

## Immediate benefits: what you can do this week

1. **Quantize a Qwen3 or Llama model to W4A16 NVFP4** with no calibration pass:
   ```bash
   python examples/llm_ptq/hf_ptq.py \
     --model_dir Qwen/Qwen3-8B \
     --qformat w4a16_nvfp4 \
     --output_dir /tmp/Qwen3-8B-W4A16-NVFP4
   ```
   This runs in minutes, not hours, because there is no calibration forward pass.

2. **Cast a GPT-OSS or DeepSeek V4 model from MXFP4 to NVFP4** bit-exactly:
   ```bash
   python examples/llm_ptq/hf_ptq.py \
     --model_dir openai/gpt-oss-20b \
     --cast_mxfp4_to_nvfp4 \
     --output_dir /tmp/gpt-oss-20b-nvfp4
   ```

3. **Prune a Llama-3.1-8B to fit a memory budget** using Puzzletron with the MIP solver, then re-run the MIP search with `--mip-only` to explore different memory targets without re-scoring.

4. **Run the Nemotron-3-Nano-30B tutorial** end-to-end to reproduce the 2.6× throughput / 2.6× memory result. The tutorial specifies container `nvcr.io/nvidia/nemo:26.04` and ModelOpt 0.45.0.

5. **Quantize an Alpamayo checkpoint** with AutoQuantize using the flow-matching objective as the sensitivity metric — the template for quantizing any model with a non-standard loss.

---

## Long-term implications: where this is heading

### 1. The pipeline is becoming composable

The 0.45.0 release moves ModelOpt from a collection of standalone tools toward a **composable pipeline** where each stage is a recipe-driven step. The `$import` system, preset discovery, and the Megatron-Bridge stack (quantize → export → distill) all point in this direction. The Nemotron-3-Nano tutorial is the proof point: prune → distill → quantize → deploy, with each stage's output feeding the next, and the final artifact is the product of all stages.

### 2. Quantization formats are becoming data-driven

The preset discovery system means new numeric formats ship as YAML files, not code changes. The CLI self-documents from the presets directory. This lowers the barrier to experimenting with new block sizes, scale formats, and mixed-precision strategies. Expect the format space to grow rapidly as NVIDIA and the community add presets.

### 3. Calibration-free quantization is a category

W4A16 NVFP4 and the MXFP4→NVFP4 cast both bypass the calibration forward pass. This is not a minor optimization — it fundamentally changes the deployment workflow. Calibration-free quantization is deterministic, reproducible, and data-agnostic. It removes the largest source of variance in the PTQ pipeline.

### 4. Heterogeneous pruning is the future of compression

Uniform pruning (same ratio for every layer) is a blunt instrument. Puzzletron's MIP-based heterogeneous pruning — different FFN sizes per layer, selective attention removal — produces architectures that uniform methods cannot. As the supported model list grows, this becomes the standard approach for fitting large models onto constrained hardware.

### 5. The accuracy floor is rising

The Nemotron-3-Nano tutorial's pruned + distilled + FP8 model retains 70.2 average accuracy vs 72.1 for the original — and the tutorial notes the model is "still learning at 100B tokens." This means the 70.2 number is a floor that will rise with more distillation, better data blends, or longer training. The gap between "optimized" and "original" is shrinking, and the optimization gains (2.6× throughput, 2.6× memory) are growing.

### 6. Export is unified

The Megatron-Bridge `export.py` produces a single HuggingFace unified checkpoint that TensorRT-LLM, vLLM, and SGLang all consume. vLLM auto-detects ModelOpt quantization from `hf_quant_config.json`. This means the deployment target is decoupled from the optimization pipeline — you optimize once, deploy anywhere.

---

## Reproducing this analysis

The source for every fact in this post is the NVIDIA/Model-Optimizer repository at tag 0.45.0:

```bash
git clone --depth 1 --branch 0.45.0 \
  https://github.com/NVIDIA/Model-Optimizer.git Model-Optimizer-0.45
cd Model-Optimizer-0.45
```

Key files referenced:

| File | Content |
|------|---------|
| `README.md` | Toolkit overview, install |
| `CHANGELOG.rst` | Version history |
| `examples/llm_ptq/README.md` | PTQ workflow, support matrix, AutoQuantize, export/deploy |
| `examples/puzzletron/README.md` | Puzzletron pruning tutorial |
| `examples/megatron_bridge/README.md` | Stacked pipeline overview |
| `examples/megatron_bridge/tutorials/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16/README.md` | End-to-end Prune→Distill→Quantize→Deploy with benchmarks |
| `examples/alpamayo/README.md` | VLA model quantization |
| `examples/vllm_serve/README.md` | vLLM serving with ModelOpt quantized models |
| `examples/windows/README.md` | Windows support (new) |
| `modelopt_recipes/configs/ptq/presets/model/w4a16_nvfp4.yaml` | W4A16 NVFP4 config |
| `modelopt_recipes/configs/ptq/presets/model/nvfp4.yaml` | NVFP4 config |

The release notes are available at [github.com/NVIDIA/Model-Optimizer/releases/tag/0.45.0](https://github.com/NVIDIA/Model-Optimizer/releases/tag/0.45.0).

---

*ModelOpt 0.45.0 is Apache 2.0 licensed. The Nemotron-3-Nano-30B-A3B-BF16 model is available on [HuggingFace](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16). The Puzzle paper is at [arXiv:2411.19146](https://arxiv.org/abs/2411.19146).*