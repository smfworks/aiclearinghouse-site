---
slug: migrating-to-foundry-azure-ai
title: "Migrating to Microsoft Foundry: Consolidating Azure AI Endpoints"
excerpt: "Microsoft merged Azure OpenAI, Azure AI Studio, and Azure AI Services into Foundry. Here is how to update your agent gateway and model routing for the new path-prefix architecture."
category: Guides
tags:
  - azure
  - migration
  - gateway
  - routing
  - infrastructure
order: 99
last_verified: "2026-09-02"
---

# Migrating to Microsoft Foundry: Consolidating Azure AI Endpoints

## Why this matters

Microsoft has consolidated Azure OpenAI Service, Azure AI Studio, and Azure AI Services into Microsoft Foundry, exposing unified endpoints at `services.ai.azure.com`. The consolidation uses path-prefix routing: `/openai/v1/...` for OpenAI-compatible deployments and `/anthropic/v1/messages` for Claude deployments. If your agent or gateway was built around the classic Azure OpenAI URL structure, it needs updating.

## What changed

| Before | After |
|--------|-------|
| Separate endpoints for Azure OpenAI, Azure AI Studio, Azure AI Services | Single `services.ai.azure.com` endpoint |
| Model name inferred the deployment type | Path prefix explicitly selects the API surface |
| Claude models required separate integration | Claude served through Foundry via `/anthropic/v1/messages` |
| Gateway workarounds for Foundry endpoints | Explicit, schema-validated `azure_service` selector |

## Who is affected

- **Agent gateway operators** using LiteLLM, Portkey, Helicone, Kong, or any gateway that routes to Azure OpenAI. Your provider configuration needs to point at the new endpoint structure.
- **Agent developers** with hardcoded Azure OpenAI URLs. The base URL changes from `https://{resource}.openai.azure.com/openai/deployments/{model}` to `https://services.ai.azure.com/openai/v1/...`.
- **Teams using Claude on Azure.** Foundry now serves Claude models through the `/anthropic/v1/messages` path prefix, eliminating the need for separate Anthropic API integrations if you are already on Azure.

## How to migrate

### 1. Update your gateway configuration

If you are using Kong AI Gateway 2.0, the GA release includes first-class Foundry support with an explicit `azure_service` selector. The wire format is derived from the configured path prefix rather than guessed from the model name.

```yaml
# Kong AI Gateway 2.0 Foundry config
- name: azure-foundry
  url: https://services.ai.azure.com
  routes:
  - paths:
    - /openai/v1
    strip_path: false
  - paths:
    - /anthropic/v1
    strip_path: false
```

### 2. Update base URLs in agent code

```python
# Before
base_url = f"https://{resource}.openai.azure.com/openai/deployments/{model}"

# After
base_url = "https://services.ai.azure.com/openai/v1"
```

### 3. Test both OpenAI and Claude paths

Verify that both path prefixes work through your updated configuration:

```bash
# OpenAI-compatible deployment
curl https://services.ai.azure.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-5.6","messages":[{"role":"user","content":"hello"}]}'

# Claude deployment
curl https://services.ai.azure.com/anthropic/v1/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-fable-5-1","messages":[{"role":"user","content":"hello"}]}'
```

### 4. Update cost attribution

If your gateway uses model-name-based cost attribution, update the pricing catalog to account for both OpenAI and Claude models served through Foundry. Kong AI Gateway 2.0's modality-aware pricing catalog handles this automatically.

## Pitfalls

- **Implicit inference is wrong.** Previous workarounds inferred the API surface from the model name (e.g., if the model starts with `gpt`, use OpenAI format). Foundry's explicit path-prefix routing makes this unnecessary and error-prone. Use the path prefix, not the model name.
- **Don't forget Claude models.** Foundry serves Claude through the `/anthropic/v1/messages` path. If you only update the OpenAI path, your Claude integrations will break.
- **Authentication may differ.** Verify that your existing Azure API keys and managed identity tokens work with the new endpoint. The authentication header format should be the same, but test it.

## Timeline

Microsoft Foundry is live now. The classic Azure OpenAI endpoint structure continues to work but is the legacy path. Gateway providers (Kong, LiteLLM, Portkey) have already shipped Foundry support. Plan your migration before the legacy endpoints are deprecated.