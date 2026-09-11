{
  "slug": "gemini-3-8-flash",
  "title": "Gemini 3.8 Flash",
  "excerpt": "Google DeepMind's September 2026 Flash release — significant gains over 3.7 Flash on software engineering, agentic tasks, and multi-step reasoning at the same $0.75/$3.75 price, with a cybersecurity twin gated to trusted defenders.",
  "category": "Google",
  "tags": ["reasoning", "long-context", "agentic", "multimodal", "coding", "google"],
  "provider": "Google",
  "input_price": 0.75,
  "output_price": 3.75,
  "context_window": 1048576,
  "mmlu": 90.0,
  "humaneval": 90.0,
  "arena": "Top-tier",
  "image": "/images/agentmarketplace/llm-hero.svg",
  "order": 99,
  "last_verified": "2026-09-09"
}

# Gemini 3.8 Flash

## Overview

Gemini 3.8 Flash is Google DeepMind's third Flash release in six weeks, launched September 2, 2026. It builds directly on Gemini 3.7 Flash (released August 13, 2026) and delivers measurable improvements across software engineering, agentic workflows, and multi-step reasoning in specialized domains — while keeping the same speed and low cost that define the Flash tier.

Google also launched a gated sibling, **Gemini 3.8 Flash Cyber**, a cybersecurity-specialized variant with more permissive cyber safeguards, available only to trusted defenders through the new **Fairwind Program**.

## Pricing

- **Introductory price (through Dec 31, 2026):** $0.75 per 1M input tokens, $3.75 per 1M output tokens — unchanged from 3.7 Flash
- **Standard price (from Jan 1, 2027):** $1.50 per 1M input, $7.50 per 1M output
- **Context window:** 1,048,576 tokens; max output 65,536 tokens
- **Multimodal input:** text, image, video, audio, PDF

> Pricing confirmed by Google and the Evertune AI Model Release Tracker as of September 2026. Verify on Google AI Studio before budgeting.

## Key capabilities

- **Agentic coding gains over 3.7 Flash**: Google reports sizable improvements on DeepSWE v1.1, beating most larger frontier models at solving complex engineering problems end to end at lower cost
- **Customizable effort levels**: tunable thinking (low, medium, high) to control the quality/cost/latency trade-off
- **Speed advantage**: ~340 tokens/second output and ~10-second time-to-first-answer — roughly 6x faster than Claude Fable 5.1 and 18x faster than GPT-5.6 Sol on first-answer latency, per the RohitAI cross-provider run
- **Native multimodal**: video, audio, and PDF input out of the box — the only model in the current flagship tier with full audio/video input
- **Highest GPQA Diamond score**: 95.3% in the published comparison, ahead of GPT-5.6 Sol (94.6%) and Claude Fable 5 (92.6%)
- **Available everywhere**: Google AI Studio, Android Studio, Google Antigravity, Stitch, Gemini Enterprise, and Google AI Pro/Ultra subscriptions

## Gemini 3.8 Flash Cyber

The Cyber variant is Google's most capable cybersecurity model:

- **CyberGym benchmark**: 86.2%, surpassing 3.5 Flash Cyber and larger frontier models in autonomous vulnerability discovery
- **CWE-Bench (Collinear)**: 47.2% pass@1 — on the Pareto frontier with a leading frontier model at 47.8% but at significantly lower cost
- **Internal 20-language benchmark**: over 70% success rate discovering vulnerabilities across complex codebases spanning 20 programming languages
- **Real-world impact**: Chrome Security found it produced 2.6x more correct patches than the best commercial models; Google's Cloud Vulnerability Research team found a critical foundational vulnerability in under 2 hours (normally months)
- **Access**: gated through the **Fairwind Program** for trusted government authorities, critical infrastructure operators, and software maintainers

## Limitations

- **Flash, not flagship**: a mid-tier speed/cost model — not Google's frontier reasoning tier. Direct capability comparisons against Claude Fable 5.1 or GPT-5.6 Sol compare different weight classes
- **Weaker agentic score**: RohitAI Agentic score of ~45 trails both flagship models by a wide margin, the expected trade-off for a throughput-tuned model
- **No independent Terminal-Bench-Science or FrontierMath numbers** published yet for 3.8 Flash specifically
- **Safety regressions**: multilingual safety regressed slightly vs 3.7 Flash per the model card; non-English unjustified-refusal handling is marginally worse
- **Promotional pricing expires**: jumps to $1.50/$7.50 on January 1, 2027

## When to pick it

Choose Gemini 3.8 Flash when latency and cost matter most — live chat, in-app coding autocomplete, voice assistant backends, high-volume agentic workloads — and you need 1M-token multimodal context at a fraction of flagship pricing. For raw long-horizon reasoning depth where cost is secondary, Claude Fable 5.1 or GPT-5.6 Sol remain stronger. For defensive cybersecurity work at scale, apply for the Fairwind Program to access Gemini 3.8 Flash Cyber.