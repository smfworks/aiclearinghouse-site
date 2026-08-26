---
slug: aws-strands-agents
title: "AWS Strands Agents"
excerpt: "An open-source, model-driven agent SDK from AWS — define a model, tools, and prompt; the LLM handles planning and execution. Apache 2.0, Python and TypeScript."
category: Infrastructure
tags:
  - agent-framework
  - aws
  - open-source
  - python
  - typescript
  - bedrock
provider: Amazon Web Services
pricing_model: Free
price: "Open source (Apache 2.0). Infrastructure costs apply when using AWS Bedrock."
website: https://strandsagents.com
image: /images/agentmarketplace/services-hero.svg
order: 100
last_verified: "2026-08-26"
---

# AWS Strands Agents

## What it is

Strands Agents is an open-source SDK from AWS for building production AI agents. It takes a model-driven approach: you define a language model, a system prompt, and a set of tools, and the LLM autonomously handles planning, tool selection, and execution. No handcrafted workflow graphs or state machines — the model's reasoning drives the loop.

The SDK ships for both Python (3.10+) and TypeScript (Node.js 20+), with first-class support for Amazon Bedrock as the default provider, plus Anthropic, OpenAI, and Google Gemini. OpenTelemetry-based tracing is built in for every agent step.

AWS open-sourced Strands after building and using it internally for production agent systems at Amazon. It has 6,900+ GitHub stars as of August 2026.

## When to use it

- You are building agents on AWS infrastructure and want native Bedrock integration.
- You prefer a model-driven approach (the LLM decides tool sequencing) over explicit workflow graphs.
- You want production observability without bolting on a separate tracing layer.
- You need both Python and TypeScript SDKs for the same framework.
- You want an open-source framework you can self-host with no vendor lock-in on the SDK itself.

## What it does well

- **Model-driven simplicity.** The core abstraction is minimal: model + prompt + tools. The LLM figures out the execution path. This is faster to build with than graph-based frameworks when your workflow is not fully predictable.
- **Native Bedrock integration.** First-class support for Amazon Bedrock models (Nova, Claude via Bedrock, etc.) with IAM-based auth. No extra configuration for AWS-native teams.
- **Multi-provider support.** Anthropic, OpenAI, Google Gemini, and any OpenAI-compatible endpoint work without code changes beyond model configuration.
- **OpenTelemetry tracing built in.** Every agent step — model calls, tool invocations, reasoning — is traced with OTel. You get observability without integrating a third-party tool.
- **Tool ecosystem.** Rich set of tools for AWS service interaction, with extensibility for custom tools. The tool protocol is straightforward.
- **Both Python and TypeScript.** Real SDK parity across languages, not a Python-first framework with a TS port as an afterthought.
- **Apache 2.0.** Clean license, no commercial restrictions, self-hostable.

## Honest limitations

- **AWS ecosystem gravity.** Strands is provider-agnostic in principle, but the tightest integration is with Bedrock. For teams not on AWS, the value proposition over LangGraph or the OpenAI Agents SDK is less clear.
- **Model-driven means less control.** If you need explicit workflow graphs, branching logic, or deterministic execution paths, Strands' model-driven approach is the wrong abstraction. LangGraph or Microsoft Agent Framework give you graph-based orchestration; Strands gives you the model and gets out of the way.
- **Younger community than LangGraph.** 6,900 GitHub stars is solid, but the ecosystem of tutorials, community integrations, and Stack Overflow answers is thinner than LangChain's. Expect to read source code for edge cases.
- **No built-in human-in-the-loop.** Strands does not have first-class suspend/resume or human approval gates like Mastra or LangGraph. You can build them, but they are not framework primitives.
- **No built-in code execution sandbox.** If your agents need to write and run code, you integrate an external sandbox. This is a gap for teams building coding agents.
- **Bedrock pricing applies.** The SDK is free, but Bedrock model invocation costs money. For teams used to direct API access, routing through Bedrock may add cost or latency depending on your region and model.

## Pricing reality

The Strands Agents SDK is free and open source under Apache 2.0. You pay for:

- **AWS Bedrock model invocation** if you use Bedrock as your provider (usage-based, per model pricing).
- **Direct provider API costs** if you configure Anthropic, OpenAI, or Google directly.
- **Compute infrastructure** if you self-host agents on EC2, ECS, EKS, or Lambda.
- **OpenTelemetry backend** if you use a managed OTel collector (AWS Distro for OpenTelemetry is free; managed backends like Honeycomb or Datadog have their own pricing).

Install: `pip install strands-agents` (Python) or `npm install @strands-agents/sdk` (TypeScript).