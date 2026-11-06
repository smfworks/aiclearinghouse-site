---
slug: "2026-11-06-run-the-agent-locally-before-you-deploy"
title: "Run the agent locally before you deploy the 1.0 bundle"
excerpt: "Install the Foundry add-on at version 1.0, invoke the sample with --local, and deploy only after that call returns."
date: "2026-11-06"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-11-06-run-the-agent-locally-before-you-deploy"
categories: ["Microsoft", "AI Agents"]
tags: ["Microsoft Foundry", "Azure Developer CLI", "hosted agents", "how-to"]
readTime: 9
image: "/images/blog/2026-11-06-run-the-agent-locally-before-you-deploy-hero.png"
---

A hosted agent can go live before you have watched one reply on your own machine. Install the Foundry add-on at version 1.0, call it locally, and deploy only after that call returns. The local call still uses the model deployment in Azure.

By the end you can install the bundle, start the basic Python sample, keep `--local` on the first invoke, and drop that flag only on the deployed call.

The page is [Microsoft Foundry extension for Azure Developer CLI is generally available](https://devblogs.microsoft.com/foundry/microsoft-foundry-azure-developer-cli-ga/), by John Miller. The saved HTML meta `article:published_time` is `2026-11-05T20:55:45+00:00`. That HTML has no `article:modified_time` meta. The visible date line is November 5th, 2026. The Foundry feed item is the same instant. Python put that stamp 15.13 hours before 7:03 AM Eastern on November 6. That clock is `2026-11-06T12:03:31Z`, from `date` this run.

The [Azure SDK Blog copy](https://devblogs.microsoft.com/azure-sdk/microsoft-foundry-azure-developer-cli-ga/) opens with the same 1.0 sentence. Its `article:published_time` is `2026-11-05T19:39:43+00:00`. Its `article:modified_time` is `2026-11-06T00:19:41+00:00`. Use the Foundry URL as the install page.

## Install the 1.0 bundle

Everyday version first. This add-on teaches the command-line tool how to set up an agent and try it on your machine. The real name is the Microsoft Foundry extension bundle, `microsoft.foundry`, for Azure Developer CLI (`azd`).

The page says `azd` provisions Azure resources and deploys application code, and the Foundry extension adds agent setup and local testing. Agent and deployment configuration stays alongside your code in `azure.yaml`.

Install [Azure Developer CLI](https://aka.ms/azd) 1.37.0 or later, or upgrade an existing installation with `azd update`. Install a current [uv](https://docs.astral.sh/uv/getting-started/installation/) release. For a standalone install, that update is `uv self update`. The sample uses Python 3.13 or later.

You need an Azure subscription, [Foundry permissions](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agent-permissions), and model quota in the region you pick. Provisioned resources and model usage incur Azure charges.

Sign in and install the bundle:

```bash
azd auth login
azd ext install microsoft.foundry
```

If Azure CLI is already signed in, use the same account and tenant as `azd`. The sample's [DefaultAzureCredential](https://learn.microsoft.com/azure/developer/python/sdk/authentication/credential-chains#defaultazurecredential-overview) can use that login for local model calls.

## Initialize, then read azure.yaml

In Foundry, a [hosted agent](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents) runs your own agent code on managed compute. You choose the framework and the orchestration. Foundry manages the runtime.

Initialize the [basic Python Agent Framework sample](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/hosted-agents/agent-framework/responses/01-basic) in an empty directory. Choose a new or existing Foundry project during setup. To reuse a model deployment that already exists, add `--model-deployment <existing-deployment-name>` to the command.

```bash
azd ai agent init \
  --template https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml \
  --deploy-mode code \
  --src .
```

`--src .` initializes the project in the current directory.

`azure.yaml` describes the agent and the Azure resources it needs. Keep it with your code so a pull request reviews the deploy change with the code. Teammates and CI/CD reuse that definition. Each `azd` environment supplies its own subscription, region, and resource settings.

This excerpt from the [sample configuration](https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml) is the one the page prints. It shows the model deployment, the agent source and runtime, the compute allocation, and the dependency on the Foundry project.

```yaml
services:
  ai-project:
    host: azure.ai.project
    deployments:
      - name: gpt-5.4-mini
        model:
          format: OpenAI
          name: gpt-5.4-mini
          version: '2026-03-17'
        sku:
          name: GlobalStandard
          capacity: 10
  agent-framework-agent-basic-responses:
    host: azure.ai.agent
    project: src/agent-framework-agent-basic-responses
    codeConfiguration:
      runtime: python_3_13
      entryPoint: main.py
    uses:
      - ai-project
    container:
      resources:
        cpu: '0.5'
        memory: 1Gi
```

Start without writing infrastructure files. To customize provisioning, [eject editable Bicep or Terraform files](https://learn.microsoft.com/azure/foundry/agents/concepts/cli-infrastructure), commit them with your code, and keep using `azd provision`.

## Provision, then invoke with --local

`azd provision` creates the declared resources, including a missing model deployment in a project you reused. Follow the model-configuration prompts and choose an available online deployment type, such as Global Standard or Data Zone Standard. Options and quota vary by subscription and region. [Compare deployment types](https://learn.microsoft.com/azure/foundry/foundry-models/concepts/deployment-types) before you choose.

```bash
azd provision
```

Then start the agent on your machine:

```bash
azd ai agent run
```

That command installs dependencies and opens Agent Inspector for the local agent. Model calls still use your Azure deployment. Leave it running. From a second terminal in the project directory, use the sentence the page prints:

```bash
azd ai agent invoke --local "Write a haiku about deploying cloud applications."
```

Keep `--local` on that first call. Everyday version: "local" here still means the model request goes to Azure. The process on your machine is what Agent Inspector is watching.

## Deploy only after that call

```bash
azd deploy
```

`azd` uploads your source to Foundry for a remote build. No local container build is required. Deployment output includes the playground and endpoint links.

Invoke the deployed agent with the same sentence and without `--local`:

```bash
azd ai agent invoke "Write a haiku about deploying cloud applications."
```

Those two invoke lines are a pair. The first one has `--local`. The second one is the hosted agent.

After that local call, the page offers three later looks. `azd deploy --preview` reviews hosted-agent configuration changes. `azd ai agent monitor --follow` streams logs. `azd ai agent doctor` diagnoses setup or permission issues. The preview flag already has its own walkthrough in [Preview the deploy before you change the AI endpoint](https://www.smfclearinghouse.com/blog/2026-11-02-preview-the-deploy-before-the-endpoint/). Use it after this local run, as a look at the hosted change.

## Update an old install, and read the October line

If an install already exists, the close of the page says update it with:

```bash
azd ext upgrade microsoft.foundry
```

That is the update command. The first-time command is `azd ext install microsoft.foundry`.

Cleanup is a split. If you created a new Foundry project for this demo, `azd down` deletes its resource group and everything in it. Review the deletion before you confirm. For a reused project, `azd down` leaves the project and its resources, including the hosted agent, in place. Follow the [quickstart cleanup guidance](https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-hosted-agent?pivots=azd#clean-up-resources) to remove those separately.

The [October Foundry wrap](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-october-2026/), by Nick Brady, still prints an older install line. Its `article:published_time` is `2026-11-05T11:40:48+00:00`. Its `article:modified_time` is `2026-11-05T22:06:27+00:00`. The developer-tools sentence says Azure Developer CLI 1.37.2 shipped on October 28, and the separately versioned agents extension remains beta, reaching `1.0.0-beta.23` on October 29. A search of that saved HTML found zero hits for `microsoft.foundry`. The November 5 post is the install instruction. Follow that post when you install.

## Quality checks come after the deploy

Install the evaluations extension and generate test data and a grading rubric for the deployed agent:

```bash
azd ext install azure.ai.evaluations
azd ai eval generate
```

Describe what the agent should do, and choose **Dataset and evaluator** and **Turn**. Review the generated dataset and rubric, then configure the evaluation:

```bash
azd ai eval init --name quality
```

Select the generated dataset and rubric, and confirm the judge model. Review `evals/azure.eval.yaml` and its service reference in `azure.yaml`. Register the evaluation assets and run the evaluation:

```bash
azd up
azd ai eval run start --eval quality
```

Keep the configuration and the test assets with your code. `azd ai agent optimize` can reuse a configured evaluation as its baseline. Review candidates before you explicitly deploy one.

## Keep the sign-in in CI

`azd up` packages, provisions, and deploys the project. Run it once before you configure a GitHub Actions or Azure DevOps pipeline:

```bash
azd up
azd pipeline config
```

`azd pipeline config` sets up authentication, repository settings, and a workflow to review and commit. Retain the generated checkout, sign-in, and environment settings. This GitHub Actions excerpt shows only installation and deployment. Sign-in must precede deployment.

```yaml
- name: Install azd
  uses: Azure/setup-azd@v2
  with:
    version: 1.37.0

- name: Install Foundry extensions
  run: azd ext install microsoft.foundry azure.ai.evaluations

- name: Provision and deploy
  run: azd up --no-prompt
```

Grant the pipeline identity the required Azure permissions. Use a separate `azd` environment per stage. Keep runtime credentials in pipeline secrets.

For a CI evaluation, commit `evals/azure.eval.yaml` and its required nonsecret assets, and grant the pipeline access to the referenced datasets and evaluators. Run `azd ai eval run start --eval quality --no-prompt` after deployment. The [CI/CD guide](https://learn.microsoft.com/azure/foundry/agents/how-to/set-up-ci-cd-cli) has the complete workflows and the threshold-based quality gates.

If you want a coding agent to scaffold the same sample, the page points at the [Microsoft Foundry Skill](https://learn.microsoft.com/azure/foundry/how-to/develop/use-microsoft-foundry-skill) for hosts such as GitHub Copilot and Claude Code. Open an empty folder and ask:

```text
Use the Microsoft Foundry Skill to scaffold the basic Python Agent Framework
Responses API sample with code deployment. Configure azure.yaml and help me
choose the Foundry project, subscription, region, and model deployment.
Show me the plan and wait for approval before creating Azure resources.
Run and test the agent locally, then stop.
```

Review the generated project, then continue with the deploy steps above. The full walkthrough is the [hosted-agent quickstart](https://learn.microsoft.com/azure/foundry/agents/quickstarts/quickstart-hosted-agent?pivots=azd). Feedback goes to the [Azure Developer CLI repository](https://github.com/Azure/azure-dev).

Try it in an empty directory this morning. Sign in, install `microsoft.foundry`, init the sample, read `azure.yaml`, provision, run, invoke with `--local`, then deploy and invoke again without that flag.

If the Foundry project you pick already has a model deployment, will you pass `--model-deployment`, or let provision create the one named `gpt-5.4-mini` in that file?
