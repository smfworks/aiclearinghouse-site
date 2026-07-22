---
slug: ragas-rag-evaluation-pipeline
title: Deploy a RAG Evaluation Pipeline with Ragas
excerpt: Set up an automated evaluation pipeline that scores your RAG system on faithfulness, answer relevance, and context precision — so you know if changes help or hurt.
category: Evaluation
tags:
  - rag
  - evaluation
  - ragas
  - testing
  - python
  - ci-cd
order: 21
last_verified: "2026-07-22"
difficulty: Intermediate
estimated_time: "40 min"
---

# Deploy a RAG Evaluation Pipeline with Ragas

## The promise

RAG systems are easy to build and hard to evaluate. You change a chunk size, swap an embedding model, or rewrite a prompt — did retrieval get better or worse? Without an evaluation pipeline, you are guessing. Ragas is an open-source framework that scores RAG systems on faithfulness, answer relevance, context precision, and context recall. This recipe sets up an automated pipeline that runs those scores on every change.

## What you'll get

- A Python evaluation pipeline that scores your RAG system using Ragas metrics
- A test dataset of question-answer-context triples you can version and extend
- A script you can run locally or in CI to catch RAG regressions
- Score output in JSON and CSV for trend tracking

## Prerequisites

- Python 3.11+
- A RAG system to evaluate (any stack — LangChain, LlamaIndex, custom)
- An OpenAI API key (Ragas uses an LLM as judge for some metrics; you can configure alternative providers)
- A test dataset of 20+ question-answer pairs with ground truth answers

## Step 1: Install Ragas and dependencies

```bash
pip install ragas datasets pandas
```

## Step 2: Prepare your evaluation dataset

Create `eval_dataset.json` — a list of questions, ground-truth answers, and the contexts your RAG system retrieved:

```json
[
  {
    "question": "What is GLM-5.2's context window?",
    "ground_truth": "128,000 tokens",
    "answer": "GLM-5.2 has a 128K context window.",
    "contexts": ["GLM-5.2 supports a context window of 128,000 tokens."]
  }
]
```

The `answer` and `contexts` fields come from running your RAG system against each question. The `ground_truth` is your manually verified correct answer.

## Step 3: Write the evaluation script

Create `eval_rag.py`:

```python
import json
import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
import os

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")

# Load eval dataset
with open("eval_dataset.json") as f:
    data = json.load(f)

# Convert to HuggingFace Dataset
eval_data = Dataset.from_pandas(pd.DataFrame(data))

# Run evaluation
results = evaluate(
    eval_data,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall,
    ],
)

# Output scores
print(results)
df = results.to_pandas()
df.to_csv("rag_eval_results.csv", index=False)
print(f"\nResults saved to rag_eval_results.csv")
print(f"Average faithfulness: {df['faithfulness'].mean():.3f}")
print(f"Average answer relevancy: {df['answer_relevancy'].mean():.3f}")
print(f"Average context precision: {df['context_precision'].mean():.3f}")
print(f"Average context recall: {df['context_recall'].mean():.3f}")
```

## Step 4: Run the evaluation

```bash
python eval_rag.py
```

You will see per-question scores and averages for each metric. The CSV output lets you drill into which questions scored poorly.

## Step 5: Set score thresholds for CI

Create `check_scores.py`:

```python
import pandas as pd
import sys

df = pd.read_csv("rag_eval_results.csv")

THRESHOLDS = {
    "faithfulness": 0.80,
    "answer_relevancy": 0.75,
    "context_precision": 0.70,
    "context_recall": 0.70,
}

failed = []
for metric, threshold in THRESHOLDS.items():
    avg = df[metric].mean()
    status = "PASS" if avg >= threshold else "FAIL"
    print(f"{metric}: {avg:.3f} (threshold {threshold}) — {status}")
    if avg < threshold:
        failed.append(metric)

if failed:
    print(f"\nFAILED on: {', '.join(failed)}")
    sys.exit(1)
else:
    print("\nAll metrics passed.")
    sys.exit(0)
```

## Step 6: Add to CI

```yaml
# .github/workflows/rag-eval.yml
name: RAG Evaluation
on: [push, pull_request]
jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install ragas datasets pandas
      - run: python eval_rag.py
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - run: python check_scores.py
```

## Verification

```bash
python eval_rag.py && python check_scores.py
```

If all metrics pass their thresholds, the script exits 0. If any metric falls below threshold, it exits 1 and lists which metrics failed.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| OpenAI API errors during evaluation | Ragas uses an LLM as judge. Check API key and rate limits. You can configure a cheaper model for the judge. |
| Low faithfulness scores | Your RAG system is generating content not supported by retrieved context. Check your generation prompt. |
| Low context recall scores | Your retriever is not finding the right passages. Check chunk size, embedding model, and retrieval top-k. |
| Evaluation is slow | Start with 20-30 questions. Full datasets with 100+ questions can take several minutes due to LLM judge calls. |
| Scores vary between runs | The LLM judge introduces some variance. Run 2-3 times and average, or pin the judge model version. |

## Honest notes

Ragas is an LLM-as-judge framework, which means your evaluation scores depend on the quality of the judge model. A weak judge model produces noisy scores that do not correlate with human judgment. Use a frontier-class model (GPT-5.6 Sol, Claude Opus 4.8) as the judge for production-grade evaluation. Do not treat Ragas scores as ground truth — they are a signal that catches regressions, not a replacement for human review of edge cases.