---
slug: testing-agent-prompts
title: "Testing Agent Prompts with Synthetic Data"
excerpt: "Generate realistic test inputs to stress-test prompts before they reach real users."
category: Guides
tags:
  - prompts
  - testing
  - synthetic-data
  - quality
order: 18
last_verified: 2026-07-01
---

# Testing Agent Prompts with Synthetic Data

## The prompt testing gap

Most prompts are tested on one or two examples that the author already understands. Real users bring messy inputs, edge cases, and ambiguous phrasing. Synthetic data helps you discover how the prompt fails before it matters.

## What synthetic data is good for

- **Coverage.** Generate hundreds of variations quickly.
- **Adversarial inputs.** Test spelling errors, mixed languages, contradictory instructions, and missing context.
- **Privacy.** Test prompts without exposing real customer data.
- **Regression tests.** Re-run the same synthetic set after every prompt change.

## How to generate useful synthetic inputs

1. **Define the input schema.** What fields does the prompt expect?
2. **List real failure modes.** Where have past runs gone wrong?
3. **Use a model to generate variants.** Ask a strong model to produce 50 realistic but challenging examples.
4. **Curate manually.** Remove examples that are too easy or nonsensical.
5. **Label expected outputs.** Know what good looks like for each synthetic input.

## Running the test

- Feed each synthetic input through the prompt.
- Score the output against your expected result.
- Track pass rate, common failure patterns, and token cost.
- Compare results across model versions and prompt iterations.

## Tools and tactics

- Use a separate model to generate adversarial examples.
- Store synthetic datasets in version control alongside prompts.
- Combine synthetic tests with a small set of real, anonymized examples.
- Update the synthetic set when you discover new failure modes in production.

## Limitations

- Synthetic data can miss real-world context.
- It may over-represent the failure modes you already know.
- Generating and maintaining it takes time.

## Quick win

Pick one prompt that is critical to your agent. Generate 20 adversarial inputs. Run them and fix the two most common failure patterns. Repeat monthly.

**Related:**
- [Keep Prompts Under Review](/tips/keep-prompts-under-review)
- [Building Agent Evaluation Pipelines](/guides/building-agent-evaluation-pipelines)
