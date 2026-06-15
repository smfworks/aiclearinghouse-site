---
{
  "slug": "prompt-injection",
  "title": "Prompt Injection Defenses",
  "excerpt": "How to reduce prompt injection and tool misuse risks in agent deployments.",
  "category": "Trust",
  "tags": ["safety", "prompt injection", "security", "trust"]
}
---

# Prompt Injection Defenses

- **Least privilege:** only expose tools the agent truly needs.
- **Human-in-the-loop:** require approval for write/delete/shell actions.
- **Input sanitization:** strip or encode untrusted content before passing to the LLM.
- **Output validation:** parse tool calls with schemas and reject unexpected parameters.
- **Monitoring:** log all tool invocations and flag anomalous patterns.

Sandboxed runtimes (Docker, Firecracker) add a strong second layer of defense.
