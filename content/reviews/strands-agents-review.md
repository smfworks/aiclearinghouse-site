---
slug: strands-agents-review
title: "AWS Strands Agents SDK Review"
excerpt: "After three weeks of building production agents with Strands for AWS-native workflows, here is where its model-driven approach shines and where the lack of explicit orchestration hurts."
category: Agent
tags: ["strands", "aws", "agent-framework", "python", "typescript", "review"]
rating: 3.8
product: "AWS Strands Agents SDK"
tested_by: "Pamela Flannery"
last_verified: "2026-08-26"
url: https://strandsagents.com
order: 9
---

# AWS Strands Agents SDK Review

## What we tested

We have been using Strands Agents for approximately three weeks across two workflows:

- **Research automation:** An agent that searches multiple data sources, extracts content, summarizes findings, and produces structured reports. This workflow makes 10-20 tool calls per task with varying tool latency.
- **AWS resource inventory:** An agent that queries AWS APIs (via Bedrock + IAM), catalogs resources across regions, and produces a compliance report. This is the canonical AWS-native use case.

The deployment runs against Amazon Bedrock (Claude 4 Sonnet and Nova Premier) and, for comparison, against direct Anthropic API access. We use the Python SDK (v0.5+) with OpenTelemetry tracing exported to an external collector.

## What it does well

**Model-driven approach is genuinely fast to build with.** Defining an agent as model + prompt + tools and letting the LLM handle planning is the fastest path from idea to working agent we have used. For the research workflow, we had a functional multi-tool agent running in under an hour. Compare this to LangGraph, where defining the same workflow as a graph took a full day.

**OpenTelemetry tracing is a real differentiator.** Every agent step — model calls, tool invocations, reasoning traces — is instrumented with OTel out of the box. We exported traces to our existing observability stack without writing any tracing code. This is production observability as a framework primitive, not a bolt-on. For teams that already have OTel infrastructure, this alone saves days of integration work.

**Bedrock integration is seamless.** IAM-based authentication, region configuration, and model access — all of it works without extra configuration. If you are on AWS, Strands + Bedrock is the path of least resistance. The Bedrock model registry is directly accessible, and switching between Claude and Nova is a model name change.

**Python and TypeScript parity is real.** We tested both SDKs. The TypeScript SDK is not a second-class citizen — the API surface, tool definitions, and tracing are consistent across languages. For polyglot teams, this matters.

**Tool protocol is clean.** Defining a custom tool is straightforward: a function, a docstring, and type hints. The framework handles the rest. This is simpler than MCP server development for simple tools, though you lose the protocol-level interoperability that MCP provides.

## Honest limitations

**Model-driven means you give up control over execution paths.** This is the fundamental tradeoff. When the workflow is predictable and you want deterministic branching, the model-driven approach fights you. Our AWS resource inventory agent occasionally took unexpected execution paths — calling tools in a different order than we intended, or making redundant API calls. In LangGraph, we would define the exact graph. In Strands, we prompt the model and hope it follows.

**No human-in-the-loop primitives.** Strands does not have built-in suspend/resume or tool approval gates. For our research workflow, we wanted human review before publishing results. We had to build this as a custom tool that pauses execution — a workaround, not a framework feature. LangGraph and Mastra both have this as a first-class primitive.

**Younger ecosystem than LangGraph.** 6,900 GitHub stars is solid for a new framework, but the community content is thin. We hit an issue with Bedrock streaming responses and found no Stack Overflow answer, no blog post, no GitHub issue. We read the source code. With LangGraph, someone had already asked and answered the same question.

**No built-in code execution.** If your agents need to write and run code (like smolagents or the OpenAI Agents SDK's code interpreter integration), Strands does not provide this. You integrate an external sandbox. This is a gap for teams building coding agents.

**AWS gravity is real.** The framework is provider-agnostic, but the developer experience is optimized for Bedrock. Using direct Anthropic or OpenAI API access works, but you lose the seamless IAM integration and model registry that makes Bedrock attractive. For teams not on AWS, the value proposition over LangGraph or the OpenAI Agents SDK is less clear.

**Multi-agent orchestration is basic.** Strands supports multi-agent patterns, but they are simpler than LangGraph's graph-based workflows or Claude Agent SDK's deep subagent hierarchy. If your use case requires complex multi-agent coordination with consensus, branching, and parallelism, Strands is not the right tool.

**Documentation has gaps at advanced patterns.** Core concepts are well-documented. Custom tracing backends, multi-agent coordination, and tool retry policies require reading source. The docs are improving but are not yet comprehensive.

## Who it's for

Strands is the right choice for teams who:
- Are building agents on AWS infrastructure and want native Bedrock integration
- Prefer model-driven simplicity over explicit workflow graphs
- Want production observability (OTel) without integration effort
- Need both Python and TypeScript SDKs
- Are building relatively straightforward agent workflows, not complex multi-agent orchestration

It is the wrong choice for teams who:
- Need explicit workflow graphs with deterministic branching (use LangGraph)
- Need human-in-the-loop suspend/resume as a framework primitive (use LangGraph or Mastra)
- Need built-in code execution (use smolagents or OpenAI Agents SDK)
- Need complex multi-agent coordination (use LangGraph or Claude Agent SDK)
- Are not on AWS and want the largest community ecosystem (use LangGraph)

## Verdict

Strands earns a 3.8 after three weeks of production use. It gains points for the fastest model-to-working-agent loop we have used, genuine OpenTelemetry tracing as a framework primitive, seamless Bedrock integration, real Python/TypeScript parity, and a clean tool protocol. It loses points for the lack of human-in-the-loop primitives, no built-in code execution, a younger ecosystem with documentation gaps, basic multi-agent orchestration, and the AWS ecosystem gravity that limits its appeal for non-AWS teams.

For AWS-native teams building straightforward agent workflows who want production observability without integration effort, Strands is a strong default. For teams needing complex orchestration, human-in-the-loop, or provider independence, LangGraph remains the better choice. Strands is not trying to be LangGraph — it is trying to be the fastest, most observable path from model to production agent on AWS. On that narrow axis, it succeeds.