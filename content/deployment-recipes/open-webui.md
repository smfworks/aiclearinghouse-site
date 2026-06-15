---
{
  "slug": "open-webui",
  "title": "Deploy Open WebUI",
  "excerpt": "Self-hosted ChatGPT-style interface for Ollama and OpenAI-compatible APIs.",
  "category": "Deployment",
  "tags": ["Open WebUI", "Ollama", "self-hosting", "chat"]
}
---

# Deploy Open WebUI

```bash
# With an existing Ollama host
docker run -d -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

Visit `http://localhost:3000`. Connect to Ollama at `http://host.docker.internal:11434`.
