---
slug: bias-and-fairness-review
title: Bias and Fairness Review
excerpt: Check that agent outputs treat users fairly, avoid harmful stereotypes, and do not reinforce biased patterns in training data or retrieval sources.
category: Trust
tags:
  - safety
  - fairness
  - bias
  - ethics
last_verified: 2026-07-01
---

# Bias and Fairness Review

## Why bias review matters for agents

Agents make decisions or generate content that affects people: hiring recommendations, support triage, content moderation, loan screening, and more. If the model, the data, or the retrieval source is biased, the agent will reproduce that bias at scale.

## Common sources of bias

- **Training data skew.** Models trained on data that underrepresents some groups.
- **Retrieval bias.** RAG systems retrieve documents that reinforce a single perspective.
- **Prompt framing.** Leading questions or assumptions in the prompt shape output.
- **Evaluation bias.** Test sets that do not reflect the diversity of real users.
- **Feedback loops.** Agent output becomes training data, amplifying early mistakes.

## How to review

1. **Define fairness goals for your use case.** What does fair output look like?
2. **Test with diverse inputs.** Include names, languages, regions, and edge cases.
3. **Audit retrieval sources.** Check whether retrieved documents represent balanced viewpoints.
4. **Review outputs for stereotypes.** Flag gendered, racial, age-based, or ability-based assumptions.
5. **Measure outcome parity.** For decision-making agents, compare outcomes across groups.
6. **Create an escalation path.** Route questionable outputs to a human reviewer.

## Quick wins

- Add a bias check prompt to your evaluation set.
- Require human review for high-stakes recommendations.
- Document the known limitations of your model and data sources.
- Retrain or fine-tune on more representative data when gaps are found.

## Related

- [Red-Teaming Agents](/safety/red-teaming-agents)
- [Output Validation for Agent Tool Calls](/safety/output-validation)
