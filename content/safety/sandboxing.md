---
slug: sandboxing
title: Sandboxing Agent Runtimes
excerpt: How to isolate agents with containers, VMs, restricted users, and network controls so a compromised agent cannot reach the rest of your systems.
category: Trust
tags:
  - safety
  - sandbox
  - container
  - isolation
last_verified: 2026-06-18
---

# Sandboxing Agent Runtimes

A sandbox is an isolated environment where the agent can run without direct access to your production systems. If the agent is tricked, compromised, or simply wrong, the sandbox limits what it can touch.

## Why sandboxing matters

Agents execute code, call tools, and process untrusted content. That is a dangerous combination. A sandbox gives you three things:

1. **Containment.** A bad action stays inside the sandbox.
2. **Observability.** You can watch everything the agent does in one place.
3. **Recovery.** You can destroy and recreate the sandbox without affecting the host.

## Sandboxing options

| Approach | Isolation level | Best for | Notes |
|---|---|---|---|
| Container (Docker/Podman) | Process + filesystem | Local dev, CI, single-tenant tools | Fast, easy to automate, shares host kernel |
| Virtual machine | Full OS isolation | Production agents, multi-tenant workloads | Heavier, stronger boundary |
| Restricted user account | Limited user permissions | Simple scripts on shared hosts | Weakest, but better than nothing |
| Cloud sandbox service | Managed isolation | Teams without infra expertise | Check egress and persistence policies |

## What to restrict inside the sandbox

- **Filesystem access.** Mount only the directories the agent needs. Use read-only mounts wherever possible.
- **Network egress.** Whitelist endpoints, not protocols. Block everything else.
- **Environment variables.** Do not pass secrets into the sandbox unless required, and never log them.
- **Resource limits.** Cap CPU, memory, disk, and network bandwidth to prevent runaway agents.
- **Privilege.** Never run the agent as root inside the container.

## Example Docker sandbox pattern

```dockerfile
FROM python:3.12-slim
RUN useradd -m agent
WORKDIR /workspace
USER agent
COPY --chown=agent:agent requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=agent:agent . .
CMD ["python", "agent.py"]
```

Run it with restricted access:

```bash
docker run \
  --read-only \
  --tmpfs /tmp:noexec,nosuid,size=100m \
  --network restricted-network \
  -v $(pwd)/agent-workspace:/workspace:rw \
  my-agent-image
```

## Secrets inside the sandbox

Secrets should not live in the container image. Inject them at runtime from a vault or secret manager, and keep them out of environment dumps and logs. If the agent only needs a temporary token, issue one with a short expiration.

See [Secrets Management for Agents](/safety/secrets-management).

## Common mistakes

- **Mounting the entire home directory.** Only mount the specific workspace the agent needs.
- **Allowing unrestricted outbound network.** An agent that can reach any URL can exfiltrate data or call unexpected APIs.
- **Running as root.** A compromised root process inside a container is still a serious problem.
- **Treating a container as a security boundary by itself.** Containers share the host kernel. For untrusted code, use a VM or gVisor-style sandbox.

## Sandboxing and model choice

A sandbox does not make a bad model safe. It only limits the damage. Pair sandboxing with least-privilege tools, human approval for risky actions, and logging.

## Related

- [Agent Safety Checklist](/safety/agent-safety-checklist)
- [Prompt Injection Defenses](/safety/prompt-injection)
- [Secrets Management for Agents](/safety/secrets-management)
- [Monitoring and Auditing Agents](/safety/monitoring-and-auditing)
- [Tip: Use a Sandbox First](/tips/use-a-sandbox-first)

> Last verified: 2026-06-18.
