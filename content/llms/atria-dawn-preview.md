---
{
  "slug": "atria-dawn-preview",
  "title": "Atria Dawn Preview",
  "excerpt": "Shanghai AI Lab's 744B MoE agentic model with MIT weights and 1M context — top scores on BrowseComp (92.5), CyberGym (86.5), and AutomationBench (53.8). No API yet; download and self-serve only.",
  "category": "Shanghai AI Laboratory",
  "tags": [
    "agentic",
    "open-weights",
    "long-context",
    "reasoning",
    "moe"
  ],
  "provider": "Shanghai AI Laboratory (InternLM)",
  "input_price": null,
  "output_price": null,
  "context_window": 1048576,
  "mmlu": null,
  "humaneval": null,
  "arena": "Frontier-tier (self-reported)",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-16"
}
---

# Atria Dawn Preview

## Overview

Atria Dawn Preview is a 744B-parameter Mixture-of-Experts agentic model from Shanghai AI Laboratory (InternLM organization), quietly published on Hugging Face on September 11, 2026. It arrives with **MIT-licensed weights**, a **1M-token context window**, and a benchmark table measured against DeepSeek V4 Pro, Kimi K3, Qwen3.8-Max, GLM-5.3, GPT-5.6 Sol, and Claude Opus 5.

The architecture string is `GlmMoeDsaForCausalLM` — the same DSA-style sparse MoE family the GLM line uses, with 8 of 256 routed experts per token across 78 layers. The model is trained via a **Verifiable Experience Pipeline** that connects tool-mediated interactions to executable environments and externally verified outcomes.

There is no blog post, no pricing page, no API. Anyone who wants to run it today must download ~756GB (FP8) or ~1.5TB (BF16) and serve it themselves.

## Key benchmarks (from model card)

| Benchmark | Atria Dawn Preview | Best competitor |
|-----------|-------------------|-----------------|
| BrowseComp | **92.5** | GPT-5.6 Sol: 92.2 |
| CyberGym | **86.5** | DeepSeek V4 Pro: 83.3 |
| AutomationBench | **53.8** | Claude Opus 5: 49.4 |
| DeepSearchQA | **96.0** | Kimi K3: 95.9 |
| BFCL v4 | **77.0** | DeepSeek V4 Pro: 71.4 |
| SkillsBench | **66.4** | Qwen3.8 Max: 66.7 |
| Workspace-Bench | 65.0 | Claude Opus 5: 65.8 |
| SWE-bench Pro | 59.6 | Claude Opus 5: 74.7 |
| Terminal-Bench 2.1 | 78.3 | Claude Opus 5: 90.2 |
| MLE-bench Lite | 86.2 | GPT-5.6 Sol: 88.9 |

Atria Dawn Preview achieves the **highest reported score on five of sixteen benchmarks** — BrowseComp, CyberGym, AutomationBench, DeepSearchQA, and BFCL v4. It is particularly strong in discovery/search and cybersecurity tasks.

## What makes it different

- **Verifiable Experience Pipeline**: training connects tool use to executable environments with externally verified outcomes, not static datasets alone
- **Agentic focus**: designed for scientific research and engineering workflows, not chat
- **Companion paper** (arXiv:2609.15818) analyzes 769 task records from 56 participants — about one-third of completed AI-assisted tasks were rated as infeasible without AI
- **Human-AI collaboration case study**: agents frequently propose methods and implement revisions; humans retain most final decisions

## Availability

- **Weights**: [Hugging Face](https://huggingface.co/internlm/Atria-Dawn-Preview) (MIT license)
- **FP8 checkpoint**: [Atria-Dawn-Preview-FP8](https://huggingface.co/internlm/Atria-Dawn-Preview-FP8) (~756GB)
- **BF16 checkpoint**: ~1.5TB
- **API**: None. No hosted endpoint exists yet.
- **Pricing**: None published.

## When to use it

- **Self-hosted agentic workloads** on multi-GPU hardware you control
- **Research and engineering workflows** where tool use and long context matter
- **Cybersecurity and deep search tasks** where it benchmarks highest
- **When you need open MIT weights** for compliance or customization

## Limitations

- **No hosted API** — you must download and serve it yourself (multi-GPU required)
- **"Preview" status** — no roadmap, no confirmation whether Atria is a one-off or a series
- **Self-reported benchmarks** — no independent Artificial Analysis entry yet; BrowseComp and CyberGym claims need neutral harness verification
- **SWE-bench Pro and Terminal-Bench 2.1 trail Claude Opus 5** significantly on coding tasks
- **No multimodal input** despite tokenizer carrying media markers (the chat template explicitly says it has no multimodal ability)