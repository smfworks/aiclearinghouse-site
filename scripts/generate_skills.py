#!/usr/bin/env python3
"""Generate 50 curated skill markdown files for SMF Clearinghouse."""
import os

OUTDIR = "/home/mikesai1/aiclearinghouse-site/content/skills"
ICON = {
    "Research": "/images/skills/research.svg",
    "Coding": "/images/skills/coding.svg",
    "Productivity": "/images/skills/productivity.svg",
    "Communication": "/images/skills/communication.svg",
    "Data": "/images/skills/data.svg",
    "DevOps": "/images/skills/devops.svg",
    "Creative": "/images/skills/creative.svg",
    "Security": "/images/skills/security.svg",
    "Finance": "/images/skills/finance.svg",
    "Integrations": "/images/skills/integrations.svg",
}

skills = [
    # Research (5 more to reach 6 total)
    ("perplexity-style-answer-engine", "Perplexity-Style Answer Engine", "Search multiple sources and synthesize cited answers to complex questions.", "Research", ["hermes", "search", "answers", "citations"], "Hermes Agent", "Community", "hermes skill install perplexity-style-answer-engine", ["Hermes Agent", "Web search provider", "Optional: Firecrawl extraction"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 15),
    ("newsletter-digest-compiler", "Newsletter Digest Compiler", "Subscribe to RSS or email newsletters and produce a weekly ranked digest.", "Research", ["hermes", "newsletter", "rss", "digest"], "Hermes Agent", "Community", "hermes skill install newsletter-digest-compiler", ["Hermes Agent", "RSS or IMAP source", "Cron scheduler"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 16),

    # Coding (5 more to reach 6 total)
    ("test-driven-sweeper", "Test-Driven Sweeper", "Generate unit tests from existing code, then iterate until tests pass.", "Coding", ["hermes", "testing", "code-generation"], "Hermes Agent", "Community", "hermes skill install test-driven-sweeper", ["Hermes Agent", "Project with test runner", "Optional: coverage tool"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 21),
    ("refactoring-coach", "Refactoring Coach", "Suggest incremental refactors for legacy code with before/after diffs.", "Coding", ["hermes", "refactoring", "legacy"], "Hermes Agent", "Community", "hermes skill install refactoring-coach", ["Hermes Agent", "Git repository access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 22),
    ("api-client-generator", "API Client Generator", "Build typed API clients from OpenAPI specs or example requests.", "Coding", ["hermes", "openapi", "api-client"], "Hermes Agent", "Community", "hermes skill install api-client-generator", ["Hermes Agent", "OpenAPI spec or sample requests"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 23),
    ("documentation-writer", "Documentation Writer", "Generate README, API docs, and inline comments from code and usage examples.", "Coding", ["hermes", "documentation", "docs"], "Hermes Agent", "Community", "hermes skill install documentation-writer", ["Hermes Agent", "Source code access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 24),
    ("security-audit-reviewer", "Security Audit Reviewer", "Scan code for OWASP-style vulnerabilities and propose fixes with diffs.", "Coding", ["hermes", "security", "audit", "owasp"], "Hermes Agent", "Community", "hermes skill install security-audit-reviewer", ["Hermes Agent", "Git repository access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 25),

    # Productivity (6)
    ("daily-standup-generator", "Daily Standup Generator", "Read commits, tickets, and calendar events to draft a daily update.", "Productivity", ["hermes", "standup", "agile"], "Hermes Agent", "Community", "hermes skill install daily-standup-generator", ["Hermes Agent", "Git and Linear/GitHub access", "Optional: calendar integration"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 30),
    ("meeting-minutes-capture", "Meeting Minutes Capture", "Transcribe meetings and extract action items, decisions, and owners.", "Productivity", ["hermes", "meetings", "transcription"], "Hermes Agent", "Community", "hermes skill install meeting-minutes-capture", ["Hermes Agent", "Audio input or transcript file", "Optional: Whisper"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 31),
    ("inbox-triage", "Inbox Triage", "Classify emails by urgency, draft replies, and surface items needing action.", "Productivity", ["hermes", "email", "triage"], "Hermes Agent", "Community", "hermes skill install inbox-triage", ["Hermes Agent", "Email IMAP or Gmail API access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 32),
    ("calendar-scheduling-bot", "Calendar Scheduling Bot", "Find mutual availability and send calendar invites via natural language.", "Productivity", ["hermes", "calendar", "scheduling"], "Hermes Agent", "Community", "hermes skill install calendar-scheduling-bot", ["Hermes Agent", "Google Calendar or CalDAV access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 33),
    ("travel-itinerary-planner", "Travel Itinerary Planner", "Build trip plans from constraints: budget, dates, transport, and lodging preferences.", "Productivity", ["hermes", "travel", "planning"], "Hermes Agent", "Community", "hermes skill install travel-itinerary-planner", ["Hermes Agent", "Web search or travel API"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 34),
    ("reminder-context-engine", "Reminder Context Engine", "Create reminders that fire based on context, not just time.", "Productivity", ["hermes", "reminders", "context"], "Hermes Agent", "Community", "hermes skill install reminder-context-engine", ["Hermes Agent", "Cron and file/message triggers"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 35),

    # Communication (5)
    ("telegram-gateway", "Telegram Gateway", "Run your Hermes agent as a Telegram bot with group and DM support.", "Communication", ["hermes", "telegram", "gateway"], "Hermes Agent", "Nous Research", "hermes gateway setup telegram", ["Hermes Agent", "Telegram Bot token"], "https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/telegram", 40),
    ("discord-server-assistant", "Discord Server Assistant", "Answer questions, moderate channels, and run commands from Discord.", "Communication", ["hermes", "discord", "gateway"], "Hermes Agent", "Community", "hermes gateway setup discord", ["Hermes Agent", "Discord bot token"], "https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/discord", 41),
    ("slack-workflow-bot", "Slack Workflow Bot", "Integrate Hermes into Slack channels for Q&A, approvals, and alerts.", "Communication", ["hermes", "slack", "gateway"], "Hermes Agent", "Community", "hermes gateway setup slack", ["Hermes Agent", "Slack app token"], "https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/slack", 42),
    ("whatsapp-business-replier", "WhatsApp Business Replier", "Automate WhatsApp responses for common customer questions.", "Communication", ["hermes", "whatsapp", "gateway"], "Hermes Agent", "Community", "hermes gateway setup whatsapp", ["Hermes Agent", "WhatsApp Business API or bridge"], "https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/whatsapp", 43),
    ("signal-privacy-bridge", "Signal Privacy Bridge", "Use Signal as a private channel for your Hermes agent.", "Communication", ["hermes", "signal", "privacy"], "Hermes Agent", "Community", "hermes gateway setup signal", ["Hermes Agent", "Signal bridge or signald"], "https://github.com/NousResearch/hermes-agent/tree/main/hermes/gateway/signal", 44),

    # Data (5)
    ("csv-data-cleaner", "CSV Data Cleaner", "Fix formatting, deduplicate rows, and infer schemas from messy CSVs.", "Data", ["hermes", "csv", "cleaning"], "Hermes Agent", "Community", "hermes skill install csv-data-cleaner", ["Hermes Agent", "CSV files"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 50),
    ("sql-query-builder", "SQL Query Builder", "Turn natural language questions into validated SQL for your schema.", "Data", ["hermes", "sql", "database"], "Hermes Agent", "Community", "hermes skill install sql-query-builder", ["Hermes Agent", "Database connection or schema file"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 51),
    ("chart-generator", "Chart Generator", "Create PNG/SVG charts from CSV, JSON, or SQL query results.", "Data", ["hermes", "charts", "visualization"], "Hermes Agent", "Community", "hermes skill install chart-generator", ["Hermes Agent", "Data source", "Optional: matplotlib / vega-lite"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 52),
    ("pdf-table-extractor", "PDF Table Extractor", "Extract tables from PDFs into structured CSV or JSON.", "Data", ["hermes", "pdf", "extraction"], "Hermes Agent", "Community", "hermes skill install pdf-table-extractor", ["Hermes Agent", "PDF files", "Optional: pdfplumber or Camelot"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 53),
    ("data-pipeline-monitor", "Data Pipeline Monitor", "Watch data freshness, schema drift, and anomaly thresholds.", "Data", ["hermes", "pipeline", "monitoring"], "Hermes Agent", "Community", "hermes skill install data-pipeline-monitor", ["Hermes Agent", "Database or object storage access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 54),

    # DevOps (5)
    ("dockerfile-optimizer", "Dockerfile Optimizer", "Shrink images, improve layer caching, and harden Dockerfiles.", "DevOps", ["hermes", "docker", "optimization"], "Hermes Agent", "Community", "hermes skill install dockerfile-optimizer", ["Hermes Agent", "Docker installed"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 60),
    ("k8s-troubleshooter", "Kubernetes Troubleshooter", "Diagnose pod crashes, resource pressure, and networking issues.", "DevOps", ["hermes", "kubernetes", "devops"], "Hermes Agent", "Community", "hermes skill install k8s-troubleshooter", ["Hermes Agent", "kubectl access to cluster"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 61),
    ("terraform-refactor-helper", "Terraform Refactor Helper", "Plan refactors, detect drift, and explain Terraform changes.", "DevOps", ["hermes", "terraform", "iac"], "Hermes Agent", "Community", "hermes skill install terraform-refactor-helper", ["Hermes Agent", "Terraform workspace"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 62),
    ("log-anomaly-detector", "Log Anomaly Detector", "Summarize logs, detect spikes, and surface error patterns.", "DevOps", ["hermes", "logs", "monitoring"], "Hermes Agent", "Community", "hermes skill install log-anomaly-detector", ["Hermes Agent", "Log stream or files"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 63),
    ("ci-cd-pipeline-drafter", "CI/CD Pipeline Drafter", "Generate GitHub Actions, GitLab CI, or Azure Pipelines from project structure.", "DevOps", ["hermes", "ci-cd", "pipelines"], "Hermes Agent", "Community", "hermes skill install ci-cd-pipeline-drafter", ["Hermes Agent", "Git repository access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 64),

    # Creative (5)
    ("image-prompt-engineer", "Image Prompt Engineer", "Refine rough ideas into structured prompts for image generators.", "Creative", ["hermes", "image", "prompt-engineering"], "Hermes Agent", "Community", "hermes skill install image-prompt-engineer", ["Hermes Agent", "Optional: image generation provider"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 70),
    ("social-post-creator", "Social Post Creator", "Draft posts for X, LinkedIn, and Bluesky from a topic or article.", "Creative", ["hermes", "social", "content"], "Hermes Agent", "Community", "hermes skill install social-post-creator", ["Hermes Agent", "Optional: social platform API keys"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 71),
    ("brand-voice-guide-enforcer", "Brand Voice Guide Enforcer", "Rewrite content to match a defined tone, vocabulary, and style guide.", "Creative", ["hermes", "brand", "writing"], "Hermes Agent", "Community", "hermes skill install brand-voice-guide-enforcer", ["Hermes Agent", "Brand voice documentation"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 72),
    ("video-script-outline", "Video Script Outline", "Turn a topic into a structured script with hooks, beats, and CTAs.", "Creative", ["hermes", "video", "script"], "Hermes Agent", "Community", "hermes skill install video-script-outline", ["Hermes Agent"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 73),
    ("thumbnail-concept-generator", "Thumbnail Concept Generator", "Generate scroll-stopping thumbnail concepts and title pairs.", "Creative", ["hermes", "thumbnail", "youtube"], "Hermes Agent", "Community", "hermes skill install thumbnail-concept-generator", ["Hermes Agent"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 74),

    # Security (5)
    ("dependency-vulnerability-scanner", "Dependency Vulnerability Scanner", "Check installed packages against CVEs and suggest upgrades.", "Security", ["hermes", "dependencies", "cve"], "Hermes Agent", "Community", "hermes skill install dependency-vulnerability-scanner", ["Hermes Agent", "Lockfile or package manifest"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 80),
    ("secret-leak-detector", "Secret Leak Detector", "Scan commits and files for API keys, tokens, and passwords.", "Security", ["hermes", "secrets", "leak"], "Hermes Agent", "Community", "hermes skill install secret-leak-detector", ["Hermes Agent", "Git repository access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 81),
    ("threat-intelligence-brief", "Threat Intelligence Brief", "Summarize security advisories and threat feeds for your stack.", "Security", ["hermes", "security", "threat-intel"], "Hermes Agent", "Community", "hermes skill install threat-intelligence-brief", ["Hermes Agent", "Security feed or API"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 82),
    ("secure-commit-message-auditor", "Secure Commit Message Auditor", "Flag sensitive information in commit messages and diffs.", "Security", ["hermes", "git", "secrets"], "Hermes Agent", "Community", "hermes skill install secure-commit-message-auditor", ["Hermes Agent", "Git repository access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 83),
    ("cloud-policy-reviewer", "Cloud Policy Reviewer", "Review IAM, network, and storage policies against least-privilege principles.", "Security", ["hermes", "cloud", "iam"], "Hermes Agent", "Community", "hermes skill install cloud-policy-reviewer", ["Hermes Agent", "AWS/GCP/Azure CLI or API access"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 84),

    # Finance (5)
    ("expense-receipt-parser", "Expense Receipt Parser", "Extract line items, tax, and totals from receipt images or PDFs.", "Finance", ["hermes", "receipts", "expenses"], "Hermes Agent", "Community", "hermes skill install expense-receipt-parser", ["Hermes Agent", "Receipt images or PDFs"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 90),
    ("invoice-generator", "Invoice Generator", "Create formatted invoices from project hours, rates, and client data.", "Finance", ["hermes", "invoice", "freelance"], "Hermes Agent", "Community", "hermes skill install invoice-generator", ["Hermes Agent", "Time tracking or project data"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 91),
    ("budget-variance-analyzer", "Budget Variance Analyzer", "Compare actual vs budgeted spending and explain variances.", "Finance", ["hermes", "budget", "variance"], "Hermes Agent", "Community", "hermes skill install budget-variance-analyzer", ["Hermes Agent", "Budget and actuals CSV/sheet"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 92),
    ("crypto-wallet-monitor", "Crypto Wallet Monitor", "Watch wallet balances, transactions, and price-triggered alerts.", "Finance", ["hermes", "crypto", "wallet"], "Hermes Agent", "Community", "hermes skill install crypto-wallet-monitor", ["Hermes Agent", "Wallet address and RPC/API"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 93),
    ("subscription-spend-auditor", "Subscription Spend Auditor", "Find unused or duplicate SaaS subscriptions across billing sources.", "Finance", ["hermes", "subscriptions", "spend"], "Hermes Agent", "Community", "hermes skill install subscription-spend-auditor", ["Hermes Agent", "Billing emails or CSV export"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 94),

    # Integrations (4)
    ("github-pr-workflow", "GitHub PR Workflow", "Draft PR descriptions, request reviews, and summarize changes.", "Integrations", ["hermes", "github", "pr"], "Hermes Agent", "SMF Works", "hermes skill install github-pr-workflow", ["Hermes Agent", "GitHub token"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 100),
    ("linear-issue-sync", "Linear Issue Sync", "Create, update, and comment on Linear issues from chat.", "Integrations", ["hermes", "linear", "issues"], "Hermes Agent", "SMF Works", "hermes skill install linear-issue-sync", ["Hermes Agent", "Linear API key"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 101),
    ("notion-page-updater", "Notion Page Updater", "Create and update Notion pages from research or meeting notes.", "Integrations", ["hermes", "notion", "notes"], "Hermes Agent", "Community", "hermes skill install notion-page-updater", ["Hermes Agent", "Notion integration token"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 102),
    ("google-sheets-report-writer", "Google Sheets Report Writer", "Append data, build pivot tables, and format sheets from chat commands.", "Integrations", ["hermes", "google-sheets", "reporting"], "Hermes Agent", "Community", "hermes skill install google-sheets-report-writer", ["Hermes Agent", "Google Sheets API credentials"], "https://github.com/NousResearch/hermes-agent/tree/main/skills", 103),
]


def write_skill(skill):
    slug, title, excerpt, category, tags, for_agent, author, install, dependencies, source, order = skill
    dep_bullets = "\n".join(f"- {d}" for d in dependencies)
    tags_yaml = "\n".join(f"  - {t}" for t in tags)
    md = f"""---
slug: {slug}
title: {title}
excerpt: {excerpt}
category: {category}
tags:
{tags_yaml}
for: {for_agent}
author: {author}
install: {install}
dependencies:
{dep_bullets}
image: {ICON[category]}
source: {source}
order: {order}
last_verified: 2026-06-15
---

# {title}

{excerpt}

## What it is

This skill gives your agent a structured way to handle {title.lower()} tasks. It wraps the necessary tools, prompts, and output formatting into a reusable command you can invoke from chat, cron, or a messaging gateway.

## Who it targets

- Teams and individuals using **{for_agent}** who want to automate repetitive work.
- Users looking for a starting point they can customize for their own stack.
- Anyone who prefers natural-language commands over manual tool configuration.

## Dependencies

{dep_bullets}

## How to install

```bash
{install}
```

Or install through the Hermes Desktop skills hub.

## Skill source

- [{source.split('/')[2]} skills directory]({source})
"""
    path = os.path.join(OUTDIR, f"{slug}.md")
    with open(path, "w") as f:
        f.write(md)
    print(f"Wrote {path}")


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    for skill in skills:
        write_skill(skill)


if __name__ == "__main__":
    main()
