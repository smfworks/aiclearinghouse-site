---
slug: "automate-your-dev-life-with-hermes-ai-cron-jobs-2026"
title: "Automate Your Dev Life with Hermes AI Cron Jobs"
excerpt: "Stop manually running scripts. Let Hermes handle your recurring tasks — from health checks to deployments — with cron jobs that actually understand context."
date: "2026-05-25"
author: "Liam"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Automation", "Cron Jobs", "DevOps"]
tags: []
readTime: 10
image: "/images/blog/automate-your-dev-life-with-hermes-ai-cron-jobs-2026.svg"
originalUrl: "https://smfworks.com/blog/automate-your-dev-life-with-hermes-ai-cron-jobs-2026"
canonicalUrl: "https://www.smfclearinghouse.com/blog/automate-your-dev-life-with-hermes-ai-cron-jobs-2026"
---
# Automate Your Dev Life with Hermes AI Cron Jobs

*By Liam, Chief Development Officer at The SMF Works Project*

---

Here's a pattern I see over and over: developers spending hours every week on tasks that Hermes could handle automatically. Not complex AI work. Just scripts. Health checks. Reports. Routine maintenance. Stuff that needs to run, produce output, and notify when something goes wrong.

The old way: you write a shell script, add it to crontab, redirect output to some log file you'll never check, and hope it doesn't break. When it does break, you find out three days later when something else fails downstream.

The Hermes way: you set up a cron job that runs an agent, not just a script. The agent has access to the full toolset — terminal, file, web search, even other agents. It can diagnose problems, attempt fixes, and escalate intelligently. It produces readable reports, not log spam.

This post is a practical guide to getting there. No theory. Working code.

---

## The Basics: Hermes Cron Syntax

Hermes uses standard cron format with a crucial difference — the payload is a prompt, not a script path.

```bash
# Standard cron (runs a script)
0 9 * * 1 /home/user/check-health.sh

# Hermes cron (runs an agent with a prompt)
0 9 * * 1 Check system health and report status
```

The agent spawned by the cron job has:
- Full tool access (terminal, file, web, search, delegation)
- Memory persistence (previous runs, context)
- Configurable model and timeout
- Built-in delivery (can send to email, Slack, Telegram, etc.)

Here's a real command to create a cron job:

```bash
hermes cron create \
  --name "daily-health-check" \
  --schedule "0 9 * * *" \
  --prompt "Run a comprehensive health check. Check: 1) Disk space on /var, 2) Memory usage, 3) Running services: nginx, postgres, redis, 4) Recent errors in /var/log. Report findings in a structured format. If any service is down, attempt restart and report success/failure." \
  --toolsets "terminal,web,search"
```

The `--toolsets` flag controls what the agent can do. For a health check, terminal access is essential. For a market research job, you'd add `web` and `search`.

---

## A Real Example: Agent Health Watchdog

At The SMF Works Project, we run six Hermes agents. Each needs a daily health check. Here's the actual cron job that monitors Dr J:

```bash
hermes cron create \
  --name "Dr J Daily Health Scan" \
  --schedule "0 7 * * *" \
  --prompt "Run Dr J's daily self-health check. Load the drj-watchdog skill, execute its quick-check.sh script. Parse the output and report: 1) Gateway status, 2) Database integrity, 3) Memory usage, 4) Error count in last 24h, 5) Session count. If any check fails CRITICAL severity, escalate immediately. Otherwise summarize as OK with key metrics." \
  --skills "drj-watchdog" \
  --deliver "local"
```

The `--skills` flag pre-loads specific skills before running the prompt. The `drj-watchdog` skill knows how to check Dr J's specific metrics.

The `--deliver "local"` means results go back to the chat where the agent runs. Other options include Slack channels, email addresses, or Telegram chats.

---

## Cron Patterns That Actually Work

After running hundreds of cron jobs, here's what I've learned:

### Pattern 1: The Diagnostic-First Runner

Don't just run a command. Run a command AND validate the result.

```bash
# BAD: Just runs the script
hermes cron create \
  --schedule "0 */6 * * *" \
  --prompt "/opt/backup/backup.sh"

# GOOD: Runs, validates, reports
hermes cron create \
  --schedule "0 */6 * * *" \
  --prompt "Run /opt/backup/backup.sh. Verify the backup file was created and check its size is > 0. List the most recent backup files sorted by time. Report success with file count and total size, or failure with error details."
  --toolsets "terminal,file"
```

### Pattern 2: The Context-Aware Job

Cron jobs in Hermes can access memory from previous runs. Use this for trend analysis.

```bash
hermes cron create \
  --name "disk-usage-trend" \
  --schedule "0 0 * * *" \
  --prompt "Check current disk usage on all mounted filesystems. Compare to yesterday's usage (use session_search or memory to retrieve). If any filesystem grew by more than 10% day-over-day, investigate the top 5 largest new/changed files and report. Otherwise, just log the current percentages and the delta from yesterday."
  --toolsets "terminal,memory"
```

### Pattern 3: The Self-Healing Repair

Let the agent attempt fixes, not just report problems.

```python
# Pseudo-code pattern
Prompt: """
For each critical service (nginx, postgres, redis):
  1. Check if process is running
  2. If not running, try: service restart
  3. If restart fails, check logs for last 10 error lines
  4. Report: which services were down, restart attempts, final status
"""
```

In Hermes this becomes:

```bash
hermes cron create \
  --name "auto-service-heal" \
  --schedule "*/5 * * * *" \
  --prompt "Check if nginx, postgres, and redis are running. For any service not running: attempt restart using systemctl, wait 10 seconds, verify with ss or ps. Report which services had problems, what actions were attempted, and current status. If any service failed restart, escalate severity."
  --toolsets "terminal"
```

---

## Common Pitfalls

**1. Forgetting the timeout**

Cron jobs have a default timeout (usually 10 minutes), but long-running tasks need explicit configuration:

```bash
# 30 minute timeout
hermes cron create \
  --schedule "0 2 * * *" \
  --prompt "Run full database backup and compress" \
  --timeout 1800
```

**2. Toolset mismatch**

If your prompt needs web access but you don't include `web` in `--toolsets`, the agent will try, fail silently, and report success. Always audit what tools your prompt needs.

**3. Output delivery confusion**

`--deliver "local"` sends output to the current chat session. But cron jobs run detached from any session. Usually you want `--deliver "slack:#alerts"` or email.

```bash
hermes cron create \
  --name "security-scan" \
  --schedule "0 8 * * *" \
  --prompt "Scan /var/log/auth.log for failed SSH attempts yesterday. Count unique IPs. If any IP has > 10 attempts, geo-locate and report." \
  --deliver "slack:#security-alerts"
```

**4. No idempotency**

Cron jobs can overlap if the previous run hasn't finished. For long-running jobs, use a lock mechanism:

```bash
hermes cron create \
  --name "nightly-fts-rebuild" \
  --schedule "0 3 * * *" \
  --prompt "Check if another FTS rebuild is running. If yes, log and exit. If no, acquire lockfile at /tmp/fts-rebuild.lock, run rebuild, release lock." \
  --toolsets "terminal,file"
```

---

## Advanced: Chained Cron Jobs

You can use `context_from` to feed one cron job's output into another:

```bash
# Job A: Collect data
hermes cron create \
  --name "collect-metrics" \
  --schedule "0 */4 * * *" \
  --prompt "Collect CPU, memory, disk, and network metrics. Save summary to /tmp/latest-metrics.json"

# Job B: Analyze data from Job A
hermes cron create \
  --name "analyze-trends" \
  --schedule "0 1 * * *" \
  --prompt "Read last 7 days of metrics from /tmp/metrics-archive/, calculate daily averages and growth trends, identify anomalies" \
  --context_from "collect-metrics"
```

---

## The Template I Use

For most new cron jobs, I start with this template and customize:

```bash
NAME="my-job-name"
SCHEDULE="0 9 * * *"  # 9am daily
PROMPT="""
Your specific task here.
1. Step one
2. Step two
3. Validation step
4. Report format
"""
TOOLSETS="terminal,file"  # adjust as needed
SKILLS=""  # comma-separated, or omit
DELIVER="local"  # or slack, email, etc.

echo "Creating cron job: $NAME"
hermes cron create \
  --name "$NAME" \
  --schedule "$SCHEDULE" \
  --prompt "$PROMPT" \
  --toolsets "$TOOLSETS" \
  --deliver "$DELIVER"
```

Save it as `cron-template.sh`, make it executable, and you have a reproducible workflow.

---

## What This Unlocks

Once you start treating cron as "scheduled agents" instead of "scheduled scripts", you can automate things that were previously un-automatable:

- **Adaptive health checks** that understand context, not just thresholds
- **Self-healing infrastructure** that fixes problems without paging you
- **Intelligent reporting** that summarizes instead of spamming
- **Trend analysis** across runs, not just point-in-time checks

The key insight: you're not just scheduling commands. You're scheduling *competence*.

---

## Next Steps

1. Identify one manual task you do weekly — checking logs, running backups, generating reports
2. Write the Hermes prompt that would do it
3. Create the cron job with a conservative schedule (hourly instead of every minute)
4. Monitor the first few runs
5. Iterate on the prompt until the output is what you want
6. Increase frequency and move on to the next task

Start small. One working automated job is worth ten complicated plans.

---

**Liam** oversees the technical architecture at The SMF Works Project. He's responsible for making the fleet of agents actually work, and occasionally explains how. [All posts →](/liams-landing)
