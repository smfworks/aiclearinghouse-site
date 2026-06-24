---
slug: long-context-rag-recall-benchmark
title: "Long-Context RAG Recall Benchmark"
excerpt: "New benchmark measuring how well agents and models retrieve facts from very long documents. Long-context models are closing the gap with vector RAG on many tasks."
category: "Agent Benchmark"
tags:
  - agents
  - benchmarks
  - rag
  - long-context
  - retrieval
agents:
  - Claude 4 Opus
  - Gemini 2.5 Pro
  - GPT-5.2
  - Qwen3.6-27B
llm: "Claude 4 Opus / Gemini 2.5 Pro / GPT-5.2"
winner: "Gemini 2.5 Pro"
date: "2026-06-24"
order: 2
last_verified: "2026-06-24"
results:
  - agent: Gemini 2.5 Pro
    score: 92
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Best long-context recall across 1M token synthetic and real documents. Performs well on needle-in-haystack and multi-hop reasoning."
  - agent: Claude 4 Opus
    score: 89
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Strong recall up to 200K tokens. Slightly weaker on needle placement at extreme context lengths."
  - agent: GPT-5.2
    score: 87
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Competitive on synthetic needles and real legal documents. Higher cost per evaluated document."
  - agent: Qwen3.6-27B
    score: 84
    time_minutes: null
    tokens: null
    cost_usd: null
    pass: false
    notes: "Strong open-weight result. Competitive with frontier models on 128K–256K contexts."
---

# Long-Context RAG Recall Benchmark

## The task

This benchmark measures how well an agent or model retrieves specific facts from long documents without external retrieval augmentation. Documents range from 32K to 1M tokens and include legal contracts, technical manuals, research papers, financial reports, and synthetic needle-in-haystack tests.

Two approaches are compared:

- **Long-context stuffing:** pass the entire document to the model and ask questions.
- **Vector RAG:** chunk the document, embed it, and retrieve the top-k chunks before generation.

The benchmark reports recall accuracy, latency, and cost for each approach.

## Scoring rubric

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Recall accuracy | Primary | Percentage of questions answered correctly using only the provided document. |
| Multi-hop recall | Secondary | Questions requiring combining facts from two or more distant sections. |
| Needle-in-haystack | Reported | Single fact placed at varying depths in long contexts. |
| Cost per 1M tokens | Reported | Normalized cost for fair comparison. |

## Key findings

- **Frontier long-context models are competitive with RAG.** On documents under 256K, top models match or beat a naive vector-RAG baseline.
- **RAG still wins on very large corpora.** When the corpus exceeds 1M tokens, retrieval plus a smaller model is cheaper and often more accurate.
- **Multi-hop reasoning favors long context.** Connecting facts across distant sections is harder when chunks are retrieved independently.
- **Cost favors RAG at scale.** Long-context frontier models can cost 10–50x more per query than retrieval over embeddings.
- **Open-weight models are catching up.** Qwen3.6-27B scores within single-digit points of top proprietary models on 128K–256K tasks.

## Honest caveats

- Synthetic needle tests do not fully represent real retrieval work.
- Chunking strategy and embedding quality strongly affect RAG scores.
- Models with larger advertised context windows do not always use them effectively.
- Latency and cost are provider-dependent and change frequently.

## When to use this benchmark

- **For architects:** Decide between long-context stuffing and RAG based on document size and question complexity.
- **For buyers:** Compare model claims against measured recall, not just context-window size.
- **For researchers:** Test new retrieval techniques against a reproducible long-context baseline.

## Source

- Long-context RAG recall benchmark leaderboard and dataset: results compiled from public model evaluations and provider benchmarks as of 2026-06-24.
