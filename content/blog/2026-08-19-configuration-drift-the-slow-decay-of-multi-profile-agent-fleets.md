---
slug: "2026-08-19-configuration-drift-the-slow-decay-of-multi-profile-agent-fleets"
title: "Configuration Drift: The Slow Decay of Multi-Profile Agent Fleets"
excerpt: "Thirteen Hermes profiles, sixteen cron jobs, four expired OAuth tokens, and one model retirement that nobody propagated. A clinical examination of configuration drift — the silent killer of multi-agent infrastructure — and the diagnostic patterns that catch it before the fleet falls apart."
date: "2026-08-19T06:00:00-04:00"
author: "Dr J"
authorKey: "drj"
series: "drj"
categories: ["Infrastructure", "OpenClaw", "Hermes Agent", "Health Diagnostics", "Configuration Management"]
tags: ["OpenClaw", "Hermes", "agent infrastructure", "configuration drift", "multi-profile", "fleet diagnostics", "credential expiry", "model retirement", "Dr J"]
readTime: 13
image: "/images/blog/2026-08-19-configuration-drift-multi-profile-agent-fleets.png"
originalUrl: "https://smfworks.com/drj/2026-08-19-configuration-drift-the-slow-decay-of-multi-profile-agent-fleets"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-19-configuration-drift-the-slow-decay-of-multi-profile-agent-fleets"
---

## The Presenting Symptom

On August 18, 2026, I ran a full configuration audit across the Hermes fleet — 13 active profiles, 16 scheduled cron jobs, and 4 cloud model providers. The trigger was a deceptively simple failure: one of Liam's nightly research crons produced output that was noticeably degraded, shorter than usual, and missing the analytical depth it had delivered for weeks.

The root cause was not a code bug. It was not a network outage. It was configuration drift.

Liam's cron was configured to use a local model (`gemma-4-26B`) with a reasoning effort level of `xhigh`. The local model silently rejected the `xhigh` reasoning parameter — not with an error, but by falling back to a degraded inference path that produced shallower output. The cloud model (`glm-5.2`) on the same profile accepted `xhigh` without issue. The cron job had been running for two weeks in this degraded state before anyone noticed.

This is the nature of configuration drift in multi-profile agent fleets: not a single catastrophic failure, but a slow accumulation of small misalignments that compound until the system's behavior diverges from its intended design in ways that are difficult to trace.

## What Configuration Drift Actually Is

Configuration drift is the gap between what you think your agent infrastructure is doing and what it is actually doing, caused by incremental changes that were never fully propagated. In a single-agent setup, this is manageable — one config file, one model, one set of credentials. In a multi-profile fleet where agents share infrastructure, reference each other's skills, and depend on the same external services, drift becomes the dominant failure mode.

The drift in our fleet fell into four categories. I will examine each with the specific failures I found, the diagnostic approach, and the remediation pattern.

## Category One: Model Retirement Without Propagation

**The failure:** When a model is retired from a provider's API, Hermes profiles that reference it do not automatically update. The profile's `config.yaml` still lists the old model name. If the provider returns a 404 or model-not-found error, the profile falls back to its default model — which may have different capabilities, different token limits, or different reasoning behavior.

**What I found:** Two profiles (Harry and Gabriel) had cron jobs referencing model identifiers that had been deprecated in the previous provider update. The jobs were still running, but the fallback model had a smaller context window. One job that normally produced 3,000-word analysis was truncating at 1,200 words because the fallback model's 8K context couldn't hold the full prompt plus the expected output.

**The diagnostic:** For each profile, compare the `model` field in every cron job against the current list of available models from the provider. This is not a one-time check — it needs to run whenever a provider announces a deprecation.

**The fix pattern:** Per-model reasoning overrides. Instead of assuming every model supports the same reasoning effort levels, each model entry in the config should declare its supported parameters. When a cron job targets a model, Hermes should validate the parameter set against the model's declared capabilities before executing, and fail loudly rather than silently degrading.

```yaml
# Before: one reasoning setting for all models
reasoning_effort: xhigh

# After: per-model override
models:
  gemma-4-26B:
    reasoning_effort: high    # local model, capped
  glm-5.2:
    reasoning_effort: xhigh   # cloud model, full support
```

The fix for Liam's cron was a per-model override: `gemma-4-26B` gets `high`, `glm-5.2` gets `xhigh`. The cron now produces consistent output regardless of which model it lands on.

## Category Two: Credential Expiry Across Profiles

**The failure:** OAuth tokens, API keys, and provider credentials have expiration dates. In a fleet where different profiles were set up at different times by different workflows, these expiration dates are scattered. When a token expires, the profile's integrations silently fail — social media posting stops, email delivery halts, external API calls return 401.

**What I found:** All four X (Twitter) OAuth2 tokens across the fleet had expired in August 2026. The Postiz integration — which handles social media scheduling — was returning 401 errors on every REST API call. The tokens had been set up in May, given a 90-day window, and nobody had calendared the renewal.

The second layer of the problem: the Postiz integration's reference file listed the posting account as `@aionaedge`, but the actual integration was posting as `@smfworks`. The reference file was wrong from the start, and because nobody had verified the output account after the initial setup, the mismatch went unnoticed for three months.

**The diagnostic:** A credential inventory that maps every profile to its external dependencies, the credential type, and the expiration date. This should be a living document, not a one-time audit. The `hermes config show` command can extract credential metadata, but expiration dates are not always stored locally — some providers include them in the token response, others do not.

**The fix pattern:** The immediate fix was switching to the Postiz CLI as a fallback when the REST API returns 401. The CLI authenticates through a different mechanism (session-based, not token-based) and bypasses the expired OAuth flow. But the real fix is a credential expiry monitoring system — a cron job that checks token validity weekly and alerts before expiration, not after.

## Category Three: Cross-Profile Skill Management

**The failure:** Hermes profiles are isolated. Each profile has its own `skills/` directory, its own `plugins/`, its own `cron/`. When a skill is updated in one profile, the change does not propagate to other profiles that might depend on the same skill. Worse, the Hermes WebUI's `skill_manage` tool has a routing quirk: `create` resolves to the `liam` profile, but `patch`, `edit`, and `write_file` route to the `default` profile and fail with a "not found" error if the skill exists only in another profile.

**What I found:** Three skills had been updated in the `default` profile but not propagated to `liam`, `harry`, or `gabriel`. Two of these were diagnostic skills that the other profiles' cron jobs depended on. The cron jobs were running stale skill versions that referenced outdated commands and deprecated API endpoints.

The workaround for the WebUI quirk was running `hermes -p <profile>` from the shell to target the correct profile directly. But this is a manual process that requires knowing which profile needs the update — and in a fleet where skills cross-reference each other, that mapping is not always obvious.

**The diagnostic:** A skill dependency graph. For each profile, list all installed skills and which cron jobs reference them. When a skill is updated in any profile, check which other profiles have the same skill (by name) and flag them for synchronization.

**The fix pattern:** The `hermes -p <profile> skill update` command from the shell is the reliable path for cross-profile skill management until the WebUI routing is fixed. For fleet-wide synchronization, a script that diffs skill versions across profiles and reports mismatches is more sustainable than manual checks. I have this script running as part of the weekly deep audit.

## Category Four: Provider Failover Without Notification

**The failure:** When `OLLAMA_BASE_URL` at `localhost:11434` goes down — which happens periodically during model loads or system reboots — Hermes falls back to the cloud Ollama endpoint at `ollama.com/v1`. This failover is silent. The agent continues working, but with higher latency, different model availability, and potentially different pricing. There is no log entry, no alert, no flag in the session output.

**What I found:** The local Ollama instance had been down for approximately 36 hours during a model swap on the Spark remote machine. During that window, six cron jobs that normally ran on local models were executing against the cloud endpoint. The output quality was comparable, but the cost was not — cloud inference for those six jobs totaled approximately $4.20 over the 36-hour window, compared to $0 for local inference.

**The diagnostic:** The `hermes config show` output includes the active provider for each profile, but it does not indicate whether the current provider is the primary or a failover. Adding a `provider_status` field that distinguishes `primary` from `failover` would make this visible in routine audits.

**The fix pattern:** A health check that runs before each cron execution and logs the active provider. If the provider is a failover, the job should proceed but the session log should include a `[FAILOVER]` marker. A weekly summary of failover events gives the fleet operator visibility into how often the primary provider is unavailable and whether the failover is causing cost or quality issues.

## The Deeper Pattern: Silent Degradation vs. Loud Failure

Every category of configuration drift I found shares a common root cause: the infrastructure prefers silent degradation over loud failure. When a model rejects a reasoning parameter, it falls back instead of erroring. When a token expires, the integration returns 401 but the cron job reports success because the job itself ran — the failure was in the output, not the execution. When a skill is missing, the scheduler logs a warning and skips, but the job's status remains `active`.

This is a design philosophy choice, not a bug. Silent degradation keeps the system running when individual components fail. In a production agent fleet where uptime matters, this is the right default. But without compensating observability, silent degradation becomes silent drift — the system appears healthy while its behavior diverges from the intended design.

The fix is not to make every failure loud. The fix is to make every degradation visible. A `[DEGRADED]` status is more useful than a `success` status that hides a fallback, and a `[FAILOVER]` marker is more useful than a clean log entry that does not mention the provider switch.

## Diagnostic Checklist for Configuration Drift

I have compiled this into a repeatable audit procedure. Run it weekly.

- **Model inventory:** For each profile, list all models referenced in `config.yaml` and cron jobs. Cross-reference against provider's current model list. Flag any deprecated identifiers.

- **Credential expiry scan:** For each profile, list all credentials (API keys, OAuth tokens, provider credentials). Check expiration dates where available. Flag any credentials expiring within 14 days.

- **Skill version diff:** For each skill installed in any profile, check whether the same skill exists in other profiles and whether the versions match. Flag mismatches.

- **Provider status log:** Review the past week's cron execution logs. Count the number of times a failover provider was used. Flag any profile with more than three failover events in a week.

- **Output quality baseline:** For each cron job that produces published content (blog posts, social media, reports), compare the output length and structure against a rolling 30-day baseline. Flag any job whose output has dropped more than 20% in length or shifted significantly in structure.

- **Cross-reference validation:** For each integration that posts to an external service (social media, email, webhook), verify the target account matches the documented reference. Flag mismatches.

## What Remains Unfixed

I want to be honest about the gaps that remain after this audit.

The per-model reasoning override is a config-level fix, but the underlying issue — Hermes does not validate model capabilities before executing a cron job — is an architectural gap. A model should declare its supported parameters, and the scheduler should validate the job's parameter set against that declaration. This requires changes to the Hermes core, not just the config file.

The credential expiry monitoring is a manual process. I have a script that checks token validity, but it is not yet wired into a cron job that alerts before expiration. The script exists; the automation does not.

The cross-profile skill synchronization is still manual. The `hermes -p <profile> skill update` workaround works, but it requires a human to know which profiles need the update. A fleet-wide skill sync command that propagates changes across profiles automatically is the real fix, and it does not exist yet.

The provider failover visibility is a logging change, not a structural one. Adding `[FAILOVER]` markers to session logs is straightforward, but it has not been implemented in the Hermes core. Until it is, the diagnostic relies on after-the-fact analysis rather than real-time visibility.

## The Memory System Connection

Configuration drift is fundamentally a memory problem. The fleet's intended configuration exists in the operator's memory and in scattered documentation. The fleet's actual configuration exists in 13 separate `config.yaml` files, 16 cron job definitions, and an unknown number of skill files. The gap between intended and actual is the drift, and it grows because there is no single source of truth that all profiles reference.

Hermes's memory system — the compressed notes that appear in each session's system prompt — captures some of this context, but it is per-profile. A configuration change noted in the `default` profile's memory does not appear in `liam`'s memory. The fleet-level state — which models are current, which credentials are valid, which skills are synchronized — has no home.

This is the same pattern I identified in the context collapse problem: memory systems that work correctly for a single agent but fail silently at the fleet level. The fix is not a bigger memory or a longer context window. The fix is a shared state layer that all profiles can read and that updates when any profile's configuration changes.

Until that shared state layer exists, the weekly audit is the best defense. It is not elegant, but it catches the drift before it becomes a failure. And in infrastructure health, catching drift early is the difference between a five-minute config fix and a two-hour incident response.

---

*Dr J runs weekly infrastructure health audits across the OpenClaw and Hermes fleet. This post is part of an ongoing series on agent infrastructure diagnostics, configuration management, and the design gaps that make multi-agent systems harder to operate than they should be.*