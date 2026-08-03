---
slug: "2026-08-03-unified-foundry-models-endpoints"
title: "Microsoft Foundry Models Endpoints: One API for 10,000+ Models with OpenAI Compatibility and Keyless Entra ID"
excerpt: "Microsoft Foundry now provides unified inference endpoints for its massive model catalog. Developers can use a single Azure OpenAI-compatible endpoint to access models from OpenAI, Anthropic, Meta, and others with consistent code, keyless authentication, and enterprise governance."
date: "2026-08-03"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-03-unified-foundry-models-endpoints"
categories: ["Microsoft", "Azure AI", "AI Agents"]
tags: ["Microsoft Foundry", "Foundry Models", "Endpoints", "OpenAI API", "Entra ID", "Inference", "Agents", "Azure"]
readTime: 14
image: "/images/blog/2026-08-03-unified-foundry-models-endpoints-hero.png"
---

Microsoft Foundry has consolidated access to its expansive model catalog behind unified, OpenAI-compatible endpoints. This change simplifies how developers build, test, and deploy agents and applications that consume models from multiple providers without rewriting client code for each one.

The core capability is straightforward: a single base URL and a consistent request format give you access to over 10,000 models. Deployments act as aliases that map a friendly name to a specific model version, provisioning type, content filters, and rate limits. You point your OpenAI SDK (or any OpenAI-compatible client) at the Foundry resource endpoint and pass the deployment name in the `model` field.

## Why unified endpoints matter now

Enterprise teams rarely commit to a single model forever. Requirements shift with cost, latency, accuracy, or new capabilities. Previously, switching models often meant updating SDKs, authentication flows, or even application logic. The new unified endpoints remove most of that friction.

Key benefits:

- **Model portability in code**: Change the deployment name; the rest of your client code stays the same.
- **Consistent authentication**: API keys or Microsoft Entra ID across the catalog.
- **Governance at the edge**: Content safety filters, rate limits, and logging apply per deployment.
- **Faster iteration for agents**: Test a reasoning model for planning and a lighter model for tool use without separate clients.

This aligns directly with how production agent systems are built in 2026: multi-model orchestration, fallback chains, and cost-aware routing.

## Technical structure of Foundry endpoints

A Foundry resource exposes an Azure OpenAI-style endpoint at `https://<resource-name>.openai.azure.com`. All inference traffic goes through this base.

Inside the resource you create **deployments**. Each deployment is an Azure resource that names:

- A specific model (for example `deepseek-v3-0324`, `claude-opus-5`, or a Microsoft MAI variant).
- Model version.
- Provisioning type (serverless or managed compute).
- Content filtering configuration.
- Rate limiting.

When you call the API, you reference the deployment name. The service resolves it to the actual model backend.

The recommended path today is the **OpenAI v1 API** (`/openai/v1/`). The older Azure AI Inference beta SDK retires August 26, 2026. Microsoft recommends migrating to the stable OpenAI SDK against the v1 routes.

The Responses API (the newer surface) is available for models that support it. It brings features such as structured outputs, tool use improvements, and better streaming. For models that do not yet expose the Responses API, fall back to the classic Chat Completions endpoint.

## Keyless authentication with Microsoft Entra ID

One of the most practical improvements is first-class support for keyless authentication.

Previously, teams had to manage and rotate API keys. With Entra ID you assign roles (such as Cognitive Services OpenAI User or the newer Foundry roles) to identities — users, service principals, or managed identities — and the client obtains tokens on demand.

Example flow (Python):

```python
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), 
    "https://ai.azure.com/.default"
)

client = OpenAI(
    base_url="https://<your-resource>.openai.azure.com/openai/v1/",
    api_key=token_provider,
)

response = client.responses.create(
    model="deepseek-v3-0324",
    input="Explain the key advantages of unified Foundry endpoints.",
)
print(response.output_text)
```

The same pattern works in .NET, JavaScript, Java, and via curl with bearer tokens. For production services running on Azure, managed identity is the cleanest path — no secrets in configuration at all.

API keys remain supported for quick starts and non-Azure environments, but Entra ID is the documented recommendation for anything that needs auditing, least-privilege, or integration with existing identity governance.

## Practical code patterns

Most teams standardize on one client factory and swap the deployment name.

A minimal reusable client pattern:

```python
def get_foundry_client(resource_name: str, deployment_name: str):
    # Keyless or key-based path decided at startup
    if use_keyless:
        token_provider = get_bearer_token_provider(...)
        api_key = token_provider
    else:
        api_key = os.environ["AZURE_INFERENCE_CREDENTIAL"]
    
    return OpenAI(
        base_url=f"https://{resource_name}.openai.azure.com/openai/v1/",
        api_key=api_key,
    )
```

Then:

```python
client = get_foundry_client("my-foundry-prod", "claude-opus-5-planning")
# or "gpt-4o-mini-routing" or "deepseek-v3-0324-tool-use"
```

The same client object works for any model behind that deployment. Switching only requires changing the string and (optionally) the system prompt or tool definitions.

For REST-only environments:

```bash
curl -X POST https://<resource>.openai.azure.com/openai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "model": "deepseek-v3-0324",
    "input": "Summarize the latest Foundry endpoints guidance."
  }'
```

## How this fits the broader Microsoft agent stack

Foundry Agent Service, Copilot Studio, and GitHub Copilot all benefit from the unified catalog.

- Agents built in Foundry can declare tool calls and model choices by deployment name.
- Copilot Studio now supports bringing Azure AI Foundry models directly into prompts (with some limitations on the newest GPT-5 family).
- GitHub Copilot and Visual Studio can route different tasks to different deployments without custom plumbing.

The endpoint unification also pairs well with Foundry IQ for grounding and the growing set of built-in tools and memory stores. You can keep the orchestration layer stable while the underlying model mix evolves.

## Setting up a production-ready endpoint

1. Create a Microsoft Foundry resource (or upgrade an existing Azure OpenAI resource).
2. Browse the model catalog at ai.azure.com and select a model.
3. Create a deployment — choose serverless for quick starts or managed compute when you need dedicated capacity and lower per-token latency at scale.
4. Assign Entra ID roles to the identities that will call the endpoint.
5. (Optional) Configure content filters and rate limits per deployment.
6. Update your client code to target the v1 route and pass the deployment name.

For teams already on Azure OpenAI, the migration path is low-friction: the base URL format is familiar, and many existing SDK patterns continue to work with only the `model` parameter change.

## What to do this week

- Audit any code still using the retiring Azure AI Inference SDK and schedule the switch to OpenAI v1.
- Create at least two deployments for a common workload (one strong reasoning model, one fast/cheap model) and implement a simple router.
- Move service-to-service calls to keyless Entra ID where possible.
- Test content filtering and logging on a non-production deployment before applying to production traffic.
- Review the model catalog filters for region, lifecycle (GA vs preview), and supported features so you can make informed routing decisions.

## Troubleshooting notes

- 400 “Model not supported” on Responses API → the deployment does not expose the Responses surface; switch to chat completions or choose a different model.
- Authentication errors → confirm the identity has the correct role on the Foundry resource and that the token scope is `https://ai.azure.com/.default`.
- High latency on first call → cold-start behavior on serverless deployments. Use provisioned throughput or keep a small warm-up load if latency is critical.
- Content filter blocks → inspect the deployment’s content filter configuration; some models have stricter defaults.

## Sources

- Microsoft Learn: [Endpoints for Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/endpoints)
- Microsoft Learn: [Microsoft Foundry Models overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview)
- Microsoft Learn: [Bring your own model for your prompts (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts)
- Microsoft Learn: [What is Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry)
- Microsoft Foundry Blog and Tech Community updates on model catalog growth and endpoint unification (July 2026)

The unified endpoint surface is one of the quieter but highest-leverage changes in the Microsoft AI platform this summer. It lowers the cost of experimenting with new models and raises the floor for production reliability and governance. Teams that standardize on the v1 OpenAI-compatible path now will have an easier time adopting the next wave of models — whether those come from Microsoft, partners, or the open community — without touching the surrounding agent orchestration code.

---

*This post is part of The Clearinghouse Log daily Microsoft AI series. All claims are sourced from official Microsoft documentation and announcements as of the publish date.*
