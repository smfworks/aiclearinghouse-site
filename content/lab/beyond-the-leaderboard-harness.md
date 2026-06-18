---
{
  "slug": "beyond-the-leaderboard-harness",
  "title": "Beyond the Leaderboard: The Harness Is Open",
  "excerpt": "How SMF Works tests AI models in production: the 15-test methodology, the rubrics, and the open-source harness behind the series.",
  "category": "Methodology",
  "tags": ["benchmark", "methodology", "Beyond the Leaderboard", "open source", "SMF Works"]
}
---

# Beyond the Leaderboard: The Harness Is Open

**Author:** Aiona Edge, Chief AI Research Scientist, SMF Works  
**Full write-up:** [SMF Works blog](/blog/beyond-the-leaderboard-the-harness-is-open)

## What "Beyond the Leaderboard" means

Most published AI benchmarks are optimized for marketing. They run on clean prompts, with retries, and report cherry-picked tasks. SMF Works takes a different approach: we test models the way agents actually use them in production.

That means:

- **Single attempt, no retries.**
- **Strict rubrics with numeric scores.**
- **Real-world prompts** that exercise reasoning, code, constraints, and honesty.
- **No cherry-picking.** The first run is the published run.

## The 15-test suite

| # | Test | What it measures |
|---|---|---|
| 1 | Basic Reasoning | Multi-step arithmetic with explanation |
| 2 | Code Generation | Production Python function with types, docstring, and edge cases |
| 3 | Debugging | Identifying bugs — or correctly asserting there are none |
| 4 | Algorithm Explanation | Concise, accurate explanation under format constraints |
| 5 | Complex Multi-Step Reasoning | Logic puzzle with interlocking constraints |
| 6 | Content Generation | Creative writing under strict word-count and banned-word rules |
| 7 | Edge Case Handling | Asking clarifying questions vs. hallucinating assumptions |
| 8 | Long-Context RAG | Retrieving specific facts from a 10,000-word document |
| 9 | Structured Output (JSON) | Schema compliance without markdown wrapping |
| 10 | Tool Use | Calling functions with the right schema vs. describing calls |
| 11 | Instruction Following | Simultaneous constraints: sentences, caps, word counts, banned words |
| 12 | Adversarial / Trick | Classic "5 machines, 5 widgets" riddle |
| 13 | Code Execution Reasoning | Predicting Python output with reference-vs-copy explanation |
| 14 | Summarization Fidelity | 100-word summary preserving all key facts |
| 15 | Recent Knowledge | Honesty about knowledge cutoff vs. hallucinating recent events |

## Scoring

Each test scores 0.0–1.0 against a rubric. The overall score is the average. A test is "passed" when it scores ≥ 0.60.

## Why this matters

The suite is designed to expose failure modes that matter to agent builders:

- **Instruction following** catches models that ignore constraints.
- **JSON output** catches schema-breaking wrapping.
- **Recent knowledge** catches confident hallucinations.
- **Long-context RAG** catches attention gaps in large documents.
- **Adversarial tests** catch linear-thinking traps.

## The harness

The SMF Works harness is open-source. It runs the same prompts against different model endpoints, captures timing, evaluates outputs with deterministic rubrics, and generates the data tables you see in the blog and on this clearinghouse.

If you want to run it yourself or adapt it for your own models, the methodology is documented in the original blog post.

## What we learned from one week of testing

- **There is no best model.** The top four models are within 0.09 points.
- **Every frontier model has a hard failure mode.** Pick the failure mode you can tolerate.
- **Speed, cost, and quality are trade-offs.** The right model depends on the task, not the leaderboard.

## How to use this clearinghouse

Each Lab entry mirrors a blog test. Use them as a quick reference when choosing a model for a specific workload. The numbers are a starting point — verify on your own data and prompts.
