---
slug: "2026-08-14-azd-extension-framework-ga-foundry-cli"
title: "azd Extensions Go GA: Encode the Foundry Agent Lifecycle in the CLI"
excerpt: "The Azure Developer CLI extension framework is generally available. Microsoft Foundry already ships the production example: a versioned azd ai suite for hosted agents, connections, toolboxes, skills, and routines."
date: "2026-08-14"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-14-azd-extension-framework-ga-foundry-cli"
categories: ["Microsoft", "AI Agents", "Azure AI Foundry"]
tags: ["Azure Developer CLI", "azd", "Microsoft Foundry", "Hosted Agents", "Agent Framework", "CI/CD", "MCP", "azure.yaml"]
readTime: 12
image: "/images/blog/2026-08-14-azd-extension-framework-ga-foundry-cli-hero.png"
---

The Azure Developer CLI can now carry a product team's supported path as a versioned package. On 11 August 2026 the Azure SDK Blog marked the **azd extension framework generally available**. That is not another hosted-agent announcement. It is the control plane under the `azd ai` commands we already use for Foundry agents: install, pin, require, hook, and expose those workflows to other agents over MCP.

At SMF we ship unattended work from a Linux host. The failure mode we care about is not "can a human click Deploy in the portal." It is whether a runner can initialize a Foundry project, provision, deploy, invoke, and fail closed when a required value is missing. The GA framework is the piece that makes that path a product instead of a wiki page plus five scripts.

Preview capabilities inside individual Foundry extensions stay preview. The framework is what went GA. Treat those two facts as separate.

## What GA actually covers

Kristen Womack's [Azure SDK Blog post](https://devblogs.microsoft.com/azure-sdk/azd-extension-framework-ga) is explicit about the boundary. GA applies to the parts of azd that let teams **build, distribute, install, and run extensions**. It does not flip every Foundry command to GA. Development and nightly sources remain for experimental builds.

| Area | What GA stabilizes |
| --- | --- |
| Extension management | Discover, inspect, install, update, uninstall; dependency resolution and version constraints |
| Sources | Official registry preconfigured; URL and file sources for private, local, development, and nightly registries |
| Commands | Top-level and nested namespaces, help, metadata, configuration schemas, IntelliSense |
| azd context | Project, environment, account, prompts, deployment, containers, AI models |
| Lifecycle | Handlers around provision, package, and deploy |
| Providers | Custom language frameworks, service targets, provisioning, validation |
| Agents and tools | MCP server capabilities so extension tools are available to agents |
| Authoring | `azd x` developer extension, scaffolding, registry schema, versioning, publishing |

That table is the operator contract. If you only remember one line: **the installer and the lifecycle hooks are the GA surface; the Foundry verbs you hang on them keep their own preview or GA status.**

The official source is already in a default azd install. The Blog's day-one commands:

```
azd ext list
azd ext install <name>
azd ext update <name>
azd ext uninstall <name>
```

One-off builds skip a registry. `azd x pack --bundle` produces a portable `.zip` you can install from a path or a URL. Microsoft Learn's [extensions overview](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/extensions/overview) (updated 30 July 2026) still labels extensions as beta and uses the longer `azd extension` form. Use the dated 11 August Blog as the GA announcement, and confirm the live verb against the azd you actually have (`azd ext --help` versus `azd extension --help`). The registries are the same idea either way: official at `https://aka.ms/azd/extensions/registry`, optional development feed at `https://aka.ms/azd/extensions/registry/dev`. Learn notes that **dev-registry binaries are not signed**.

## Foundry is the customer-facing proof

The Blog's production example is Microsoft Foundry. The product team turned the early "AI workflow" sketch into a suite under `azd ai`. Install the meta-package:

```
azd ext install microsoft.foundry
```

[Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/install-cli-foundry-extensions) documents the same split. `microsoft.foundry` contributes no commands of its own. It pulls the independently versioned pieces:

| Extension ID | Command group | Job |
| --- | --- | --- |
| `microsoft.foundry` | *(meta-package)* | One-shot install of the suite |
| `azure.ai.projects` | `azd ai project` | Active Foundry project context (`set`, `unset`, `show`) |
| `azure.ai.agents` | `azd ai agent` | Scaffold, deploy, run, invoke hosted agents |
| `azure.ai.connections` | `azd ai connection` | Project connections to external systems |
| `azure.ai.toolboxes` | `azd ai toolbox` | Versioned tool collections |
| `azure.ai.skills` | `azd ai skill` | Reusable behavioral guidance |
| `azure.ai.routines` | `azd ai routine` | Timers, schedules, event-driven automation |
| `azure.ai.inspector` | `azd ai inspector` | Browser inspector for locally running agents |

`azure.ai.finetune` is documented separately for init, job submit, and deploy of fine-tuned models. Installing `azure.ai.agents` alone also pulls `azure.ai.inspector` as a dependency.

Prerequisites from Learn: **azd 1.25.2 or later**, Python 3.10+ or .NET 8+, Contributor on the subscription, and **Foundry Owner** if the workflow creates new Foundry projects. Foundry RBAC names recently changed (Foundry User / Owner / Account Owner / Project Manager). Role IDs stayed the same; expect mixed labels while the rename rolls out.

Pin in CI. The Blog shows:

```
azd ext install azure.ai.agents --version 1.0.0-beta.9
```

That is the difference between "it worked on my laptop" and a runner that cannot drift overnight. We already treat Hermes cron model pins the same way. Unpinned surfaces fail in surprising ways; pinned surfaces fail with a version you can name.

## azure.yaml is now an extension contract

GA adds project-level extension requirements. A `requiredVersions.extensions` block in `azure.yaml` lists what the project needs:

```yaml
requiredVersions:
  extensions:
    azure.ai.agents: ">=1.0.0"
```

azd installs those extensions during `azd init` and checks them again before commands such as `azd up`. That is the right place to encode "this repo is a Foundry hosted-agent project," not a README checkbox.

[Learn's agent-development concept page](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/cli-agent-development) then splits identity from deployment:

| File | What it describes |
| --- | --- |
| `agent.yaml` | The agent: model, instructions, tools, protocols, env |
| `agent.manifest.yaml` | Parameterized template; `{{ parameter }}` resolves at `azd ai agent init` |
| `azure.yaml` | How it lands: services, infrastructure, containers |

`${VAR_NAME}` is an azd environment placeholder from `.azure/<env>/.env` at deploy time. `{{ parameter }}` is a template slot that dies at scaffold. Mix them up and you will chase a "missing env" that was never going to be an env.

Connections, toolboxes, skills, and routines live on the **Foundry project**, not inside `agent.yaml`. Manage them with the dedicated `azd ai` command groups. That matches how we already treat toolboxes and routines in earlier Clearinghouse posts: shared project resources, versioned separately from any one agent container.

## The loop that should be in source control

The [Foundry agent extension overview](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/extensions/azure-ai-foundry-extension) (updated 27 July 2026) is the shortest honest demo:

```
azd ai agent init -m https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml
azd up
azd down
```

`azd up` builds the container, pushes the image, creates resources, deploys models, and publishes the agent. Split it into `azd provision` and `azd deploy` when you want a review gate between infrastructure and the new agent version. `azd down` deletes every resource in the group. Do not point that at a shared production group to "clean up a failed experiment."

Local iteration is first-class. `azd ai agent run` plus `azd ai agent invoke --local` keep you on the laptop against remote Azure resources. Hosted agents listen on **port 8088** with a health probe. Protocols:

| Protocol | Contract | When |
| --- | --- | --- |
| `responses` | OpenAI Responses API (`POST /responses`) | Default; ecosystem-compatible |
| `invocations` | Custom JSON (`POST /invocations`) | You own the payload shape |

Sessions are isolated sandboxes. `azd ai agent invoke` reuses the last `session_id` unless you pass `--new-session` or an explicit `--session-id`. That is a load-bearing default. A CI smoke test that forgets `--new-session` is not testing a cold start.

## CI is where GA pays rent

[Learn's CI/CD how-to](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/set-up-ci-cd-cli) is the page I would print for a platform team. `azd pipeline config` detects GitHub or Azure DevOps, creates a service principal, writes secrets and variables, and emits `.github/workflows/azure-dev.yml` (or the Azure Pipelines equivalent).

The generated GitHub flow is the right shape:

1. `Azure/setup-azd@v2`
2. **`azd ext install microsoft.foundry`** — required. The runner image does not include the suite.
3. `azd auth login --client-id … --federated-credential-provider github --tenant-id …`
4. `azd up --no-prompt`

Unattended flags that should be non-negotiable on every `azd ai` step:

- `--no-prompt` — fail fast instead of hanging the job until timeout. Every `azd ai` command supports it.
- `--output json` — parseable for `show` / connection / toolbox / skill / routine. `invoke` uses `--output raw`.
- `--project-endpoint` / `-p` — pin the Foundry project for a single resource command.
- `FOUNDRY_PROJECT_ENDPOINT` on the job, or `azd ai project set … --no-prompt` early, because pipelines are not sitting inside an interactive project directory.

Resolution order: `--project-endpoint`, then the in-project azd environment, then global config from `azd ai project set`, then the environment variable. If none resolve, the command exits with a structured error. That is the fail-closed behavior we want.

Eval belongs after deploy: `azd ai agent eval run --no-prompt` against a stored `eval.yaml`. `eval generate` is a side-effecting setup step; do not let it run as a surprise in CI.

Roles: Contributor plus **Foundry Owner** for provision. If `azd ext install` fails, Learn's first checks are runner internet and **azd 1.25.2+**.

## MCP: the extension is also a tool

GA lists **MCP server capabilities** as a first-class building block. An extension is not only a human CLI. It can expose the same commands to coding agents and editor tools. Combined with Foundry's own toolboxes, that is two layers:

1. **azd extension MCP** — platform verbs (init, validate, provision hooks) available to a developer agent in the inner loop.
2. **Foundry toolbox MCP** — runtime tools the *hosted* agent calls in production.

Do not collapse those. A laptop agent that can run `azd up` is a different trust boundary from a production agent that can call an orders API. Encode the first in a private extension source and a validation provider that can **stop** a risky deploy. Encode the second as a versioned toolbox with user delegation, which we already covered in the July toolboxes posts.

The interesting SMF build is a **private source** that turns our supported path — identity, observability defaults, secret handling — into `azd ext install smf.platform` and a `requiredVersions` pin. Start from the [demo extension](https://github.com/Azure/azure-dev/tree/main/cli/azd/extensions/microsoft.azd.demo) (`azd ext install microsoft.azd.demo`):

```
azd ext install microsoft.azd.extensions
azd x init
```

## What we will do with this this week

1. Confirm azd **1.25.2+** and record `azd ext list` versions on developer machines and any mikesai1 image we would use for Foundry deploys.
2. Install `microsoft.foundry` locally; **pin `--version`** on the agent surface in the pipeline YAML we actually commit.
3. Add `requiredVersions.extensions` to any repo that already mentions `azd ai`. If `azure.yaml` cannot name `azure.ai.agents`, the path is still a wiki.
4. Scaffold one Agent Framework sample with `azd ai agent init -m <sample azure.yaml>`, run it locally, then `azd up` in a disposable group. Confirm the group name before `azd down`.
5. Pick the first private extension candidate: wherever we still coordinate several tools and remember org-specific steps.

Earlier Clearinghouse posts cover the Foundry *payload* — hosted agents, toolboxes, routines, Agent Optimizer, private BYO capability hosts. This one is the **packaging layer** that makes those paths repeatable without living in the portal.

## Sources

- Kristen Womack, [Azure Developer CLI extension framework is GA](https://devblogs.microsoft.com/azure-sdk/azd-extension-framework-ga), Azure SDK Blog, 11 August 2026.
- Microsoft Learn, [Install the Azure Developer CLI Foundry extensions](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/install-cli-foundry-extensions), last updated 26 June 2026.
- Microsoft Learn, [Microsoft Foundry agent extension overview](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/extensions/azure-ai-foundry-extension), last updated 27 July 2026.
- Microsoft Learn, [Agent development with the Azure Developer CLI](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/cli-agent-development), last updated 26 June 2026.
- Microsoft Learn, [Set up CI/CD for hosted agents with the Azure Developer CLI](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/set-up-ci-cd-cli), last updated 26 June 2026.
- Microsoft Learn, [Azure Developer CLI extensions overview](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/extensions/overview), last updated 30 July 2026.

Which internal SMF path — Forge CLI bootstrap, swarm deploy, or the M365 broker — is the first one that deserves a private azd extension with a version pin instead of another script in the wiki?
