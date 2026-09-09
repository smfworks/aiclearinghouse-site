{
  "slug": "claude-mythos-5-1",
  "title": "Claude Mythos 5.1",
  "excerpt": "Anthropic's safeguard-relaxed twin of Claude Fable 5.1 — identical weights, lighter restrictions for vetted cybersecurity and life-sciences work. Scores 60.9% on Terminal-Bench 4.0 and leads Anthropic's cyber evaluation suite.",
  "category": "Anthropic",
  "tags": ["coding", "cybersecurity", "agents", "long-context", "anthropic", "research"],
  "provider": "Anthropic",
  "input_price": 10.0,
  "output_price": 50.0,
  "context_window": 1000000,
  "mmlu": 92.0,
  "humaneval": 96.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-09"
}

# Claude Mythos 5.1

## Overview

Claude Mythos 5.1 is Anthropic's restricted-access configuration of the same underlying model as Claude Fable 5.1, released September 1, 2026. The two share identical model weights, reasoning density, and pricing. The difference is the safeguard layer: Fable 5.1 runs production safeguards that block certain high-risk, dual-use tasks in biology and cybersecurity, while Mythos 5.1 relaxes those domain-specific safeguards for vetted organizations.

Mythos 5.1 is **not** a consumer product and is not broadly available. Access runs through invitation-only programs under **Project Glasswing**: the Cyber Verification Program for defensive security professionals and the Life Sciences Verification Program (developed with the US government). Both are currently US-only.

## Why it exists

The gap between Fable 5.1 and Mythos 5.1 on some benchmarks reflects tasks where Fable's production safeguards intervened (scoring zeros). Mythos 5.1 shows what the same model can do without that overhead — most visible on Terminal-Bench 4.0, where Mythos 5.1 scores 60.9% against Fable 5.1's 55.8%. Anthropic expects the difference to shrink as safeguards become more precise (the September release already cut false-positive blocking by ~60% on cyber and ~85% on benign biology questions).

## Benchmarks (shared model, Mythos where it differs)

| Benchmark | Mythos 5.1 | Fable 5.1 | Fable 5 | Opus 5 | GPT-5.6 Sol |
|---|---|---|---|---|---|
| Terminal-Bench 4.0 (agentic coding) | **60.9%** | 55.8% | 42.0% | 52.3% | 37.3% |
| Terminal-Bench-Science 0.1 | — | 52.6% | 24.7% | 29.0% | 22.4% |
| GDPval-AA v2 (knowledge work) | — | 1853 | 1723 | 1824 | 1711 |
| OSWorld 2.0 strict (computer use) | — | 41.7% | 36.1% | 39.6% | — |
| AutomationBench | — | 31.4% | 17.1% | 26.9% | 19.6% |
| Humanity's Last Exam (with tools) | — | 65.0% | 63.8% | 63.6% | — |

## Cybersecurity capabilities

Mythos 5.1 demonstrates the strongest overall cyber capabilities of any Anthropic model released. Across the internal cyber evaluation suite, it meets or exceeds Claude Mythos 5 and substantially outperforms Claude Opus 5 on ExploitBench, OSS-Fuzz, Firefox 147, and ExploitGym. It also powers **Claude Security**, available to all Claude Enterprise customers, which scans codebases for vulnerabilities and suggests patches for human review.

## Life sciences capabilities

On the life-sciences side, Mythos 5.1 leads on most internal and partner benchmarks including bioinformatics, protein design, and organic chemistry. In computational biology it wrote custom GPU kernels that sped up machine-learning models by up to 2.5x and cut estimated GPU time by 30–60% on genome-wide analyses; Anthropic plans to open-source those optimizations. On the Anthropic ECI (Epoch Capabilities Index fork), it sits at the frontier with a point estimate of 161.98.

## Pricing

Identical to Fable 5.1:

- **Input:** $10.00 per 1M tokens
- **Output:** $50.00 per 1M tokens
- **Cache read:** $0.25 per 1M tokens (75% cut from Fable 5)
- **Batch:** $5 input / $25 output per 1M tokens

## Limitations

- **Not generally available**: restricted to vetted organizations through Project Glasswing; currently US-only
- **Not unrestricted**: Anthropic's other safeguards and usage policy remain in force
- **Dual-use risk**: the relaxed cyber and biology safeguards are precisely why access is gated
- **Same high per-token price as Fable 5.1**: the cache-read cut helps, but the sticker price is the most expensive in the frontier tier
- **Safeguard gap will narrow**: as Fable's safeguards get more precise, the practical reason to seek Mythos access shrinks for non-cyber/non-biology workloads

## When to pick it

Choose Mythos 5.1 (if your organization is eligible) when you need frontier-level autonomous coding and computer use *without* safeguard interventions blocking legitimate defensive cybersecurity or life-sciences research tasks — the 60.9% Terminal-Bench 4.0 score and the cyber evaluation suite lead are the concrete payoff. For general-purpose coding and knowledge work where safeguards are not a blocker, Fable 5.1 gives you the same underlying model with no access friction.