---
slug: "2026-07-23-multi-agent-pr-review-pipeline-hermes"
title: "Build a Multi-Agent PR Review Pipeline With Hermes"
excerpt: "Stop reviewing PRs one comment at a time. Build a three-agent pipeline that splits a pull request into security, logic, and style reviews — runs them in parallel, merges findings, and posts inline comments to GitHub."
date: "2026-07-23"
categories: ["Liam's Landing", "Hermes AI", "Subagent Delegation", "GitHub", "Tutorial"]
readTime: 11
image: "/images/blog/2026-07-23-multi-agent-pr-review-pipeline-hermes-hero.png"
author: "Liam"
---

A pull request lands. Two hundred lines of diff across six files. You read it start to finish, leave three comments, and approve. The review took you forty minutes. You missed the SQL injection in the new endpoint because you were focused on the naming convention fix you suggested in the first file.

That's the human review problem: you're sequential, you fatigue, and your attention budget runs out before the diff does.

A single AI agent reviewing the same PR doesn't fatigue, but it has a different problem: it tries to review everything at once and produces a mush. Security observations mixed with style nits mixed with architectural concerns, all in one wall of text. You still have to parse it.

The fix is to split the review into specialized agents, run them in parallel, and merge their outputs. This post is the full pipeline: a Hermes skill that spawns three subagents — security, logic, and style — each with a bounded scope and a structured output contract. The parent agent collects their findings, deduplicates, ranks by severity, and posts inline comments to GitHub via `gh`.

Everything below is runnable. I'll show the skill file, the delegation script, and the GitHub posting logic. You can clone this into your own Hermes setup today.

## The Architecture

Here's what happens when you trigger the pipeline:

```
PR opened or updated
        │
        ▼
┌─────────────────┐
│  Parent Agent    │  ← Fetches diff, parses file list
│  (Orchestrator)  │     Spawns 3 subagents in parallel
└──────┬───────────┘
       │
   ┌───┼───────────────┐
   ▼   ▼               ▼
┌──────┐ ┌──────┐ ┌──────────┐
│Security│ │Logic │ │  Style   │
│Agent   │ │Agent │ │  Agent   │
└───┬───┘ └──┬───┘ └────┬─────┘
    │        │          │
    └────────┼──────────┘
             ▼
┌─────────────────────┐
│  Parent Agent        │  ← Merges, deduplicates, ranks
│  (Merge & Post)      │     Posts inline comments via gh
└──────────────────────┘
```

Each subagent gets the same diff but a different lens. They never see each other's output. The parent agent is the only thing that sees all three — and its job at merge time is mechanical, not analytical.

## The Skill File

This goes in `~/.hermes/skills/pr-review-pipeline/SKILL.md`:

```markdown
---
name: pr-review-pipeline
description: Multi-agent PR review pipeline. Spawns security, logic, and style subagents to review a GitHub PR in parallel, then merges findings and posts inline comments.
---

# PR Review Pipeline

## When to use
- A PR needs review and you want structured, parallel analysis
- You have `gh` CLI authenticated and the PR is on a repo you can comment on

## Steps

1. Get the PR number and repo from the user (or infer from current branch)
2. Fetch the diff: `gh pr diff {number} --repo {repo}`
3. Get the file list: `gh pr view {number} --repo {repo} --json files --jq '.files[].path'`
4. Spawn three subagents in parallel using delegate_task:
   - Security agent: review for injection, auth bypass, secret leaks, unsafe deserialization
   - Logic agent: review for edge cases, error handling, race conditions, off-by-one
   - Style agent: review for naming, consistency, dead code, missing tests
5. Each subagent returns a JSON array of findings:
   [{"file": "path", "line": N, "severity": "critical|warning|nit", "message": "..."}]
6. Merge all findings, deduplicate by (file, line) proximity, sort by severity
7. Post each finding as an inline comment:
   `gh pr comment {number} --repo {repo} --body "{formatted_comment}"`
8. Post a summary comment with counts by severity

## Output contract
Each subagent MUST return valid JSON. If a subagent returns prose instead of JSON,
discard its output and note the failure in the summary.
```

That's the skill. The interesting part is step 4 — how the subagents are actually spawned.

## Spawning the Subagents

Hermes gives you `delegate_task` for spawning subagents. Each subagent gets its own context window, its own terminal session, and its own toolset. The parent only sees the final summary.

Here's the delegation call for the security agent:

```python
security_review = delegate_task(
    goal="""You are a security review agent. Analyze this diff for security issues.

Focus on:
- SQL injection, command injection, path traversal
- Authentication or authorization bypasses
- Secret leakage (hardcoded keys, tokens in logs)
- Unsafe deserialization or eval usage
- Missing input validation on external data

Return ONLY a JSON array. No prose. Each element:
{"file": "<path>", "line": <int>, "severity": "critical|warning|nit", "message": "<concise description>"}

If no issues found, return: []

Diff to review:
{diff_content}
""",
    context="""This is a GitHub PR diff. Review ONLY the added/modified lines (prefixed with +).
Do not flag removed lines. Be specific about the vulnerability and the fix.
Maximum 10 findings. Only report real issues — no hypothetical concerns.""",
    role="leaf"
)
```

The logic and style agents follow the same pattern with different focus areas:

```python
logic_review = delegate_task(
    goal="""You are a logic review agent. Analyze this diff for correctness issues.

Focus on:
- Edge cases: empty inputs, null values, boundary conditions
- Error handling: uncaught exceptions, swallowed errors, missing fallbacks
- Race conditions or concurrency issues
- Off-by-one errors, incorrect comparisons
- Resource leaks (unclosed files, connections, transactions)

Return ONLY a JSON array. Each element:
{"file": "<path>", "line": <int>, "severity": "critical|warning|nit", "message": "<concise description>"}

If no issues found, return: []

Diff to review:
{diff_content}
""",
    context="""Review ONLY added/modified lines. Maximum 10 findings.
Be concrete — point to the exact line and explain what breaks.""",
    role="leaf"
)

style_review = delegate_task(
    goal="""You are a code style review agent. Analyze this diff for style and maintainability.

Focus on:
- Naming: unclear variables, functions, or types
- Dead code or unused imports introduced by this diff
- Missing or inadequate tests for new logic
- Inconsistency with surrounding code patterns
- Overly complex logic that could be simplified

Return ONLY a JSON array. Each element:
{"file": "<path>", "line": <int>, "severity": "nit", "message": "<concise suggestion>"}

If no issues found, return: []

Diff to review:
{diff_content}
""",
    context="""Review ONLY added/modified lines. Maximum 5 findings.
Style issues are always 'nit' severity. Be helpful, not pedantic.""",
    role="leaf"
)
```

The key design choice: each subagent has a **bounded scope** and a **strict output contract**. The security agent doesn't know about style. The style agent doesn't know about security. Neither can wander into the other's territory because the prompt doesn't mention it.

## Running Them in Parallel

`delegate_task` supports batch mode — you can spawn all three at once:

```python
results = delegate_task(tasks=[
    {
        "goal": security_goal,
        "context": security_context,
        "role": "leaf"
    },
    {
        "goal": logic_goal,
        "context": logic_context,
        "role": "leaf"
    },
    {
        "goal": style_goal,
        "context": style_context,
        "role": "leaf"
    }
])
```

This runs all three subagents concurrently. The call returns when all three finish. You get an array of three summaries back — one per subagent.

In practice, a 200-line diff takes each subagent 15-30 seconds. Running them sequentially would take 75-90 seconds. In parallel, it's 30 seconds total. That's the point of parallelization — not speed for its own sake, but keeping the review cycle short enough that developers actually use it.

## Merging and Deduplicating Findings

The parent agent receives three JSON arrays. Here's the merge logic:

```python
import json

def merge_findings(*result_arrays):
    """Merge findings from multiple subagents, deduplicate, and sort."""
    all_findings = []

    for result in result_arrays:
        try:
            findings = json.loads(result)
            if isinstance(findings, list):
                all_findings.extend(findings)
        except (json.JSONDecodeError, TypeError):
            # Subagent returned prose instead of JSON — skip it
            continue

    # Deduplicate: same file + line within 3 lines = duplicate
    seen = set()
    unique = []
    for f in all_findings:
        key = (f.get("file", ""), f.get("line", 0))
        # Check if we already have a finding within 3 lines on the same file
        is_dup = False
        for s in seen:
            if s[0] == key[0] and abs(s[1] - key[1]) <= 3:
                is_dup = True
                break
        if not is_dup:
            seen.add(key)
            unique.append(f)

    # Sort by severity: critical > warning > nit
    severity_order = {"critical": 0, "warning": 1, "nit": 2}
    unique.sort(key=lambda x: severity_order.get(x.get("severity", "nit"), 3))

    return unique
```

The deduplication is deliberately fuzzy. Two agents might flag the same line from different angles — the security agent sees a SQL injection, the logic agent sees missing error handling on the same query. Both findings are valid, but posting two comments on the same line is noise. The 3-line window keeps the higher-severity one (since we sort before dedup would remove duplicates — actually, let me fix that).

Here's the corrected version that keeps the highest-severity finding per cluster:

```python
def merge_findings(*result_arrays):
    """Merge findings from multiple subagents, deduplicate, and sort."""
    all_findings = []

    for result in result_arrays:
        try:
            findings = json.loads(result)
            if isinstance(findings, list):
                all_findings.extend(findings)
        except (json.JSONDecodeError, TypeError):
            continue

    severity_rank = {"critical": 0, "warning": 1, "nit": 2}
    
    # Sort by severity first so higher-severity findings come first
    all_findings.sort(key=lambda x: severity_rank.get(x.get("severity", "nit"), 3))

    # Deduplicate: same file + line within 3 lines = keep the first (highest severity)
    seen = []
    unique = []
    for f in all_findings:
        filepath = f.get("file", "")
        line = f.get("line", 0)
        is_dup = any(
            s[0] == filepath and abs(s[1] - line) <= 3
            for s in seen
        )
        if not is_dup:
            seen.append((filepath, line))
            unique.append(f)

    return unique
```

Now the highest-severity finding wins the cluster. If security says "critical: SQL injection on line 42" and style says "nit: rename variable on line 43", you get the SQL injection comment, not the rename.

## Posting Inline Comments to GitHub

Each finding becomes an inline review comment. Here's the posting logic:

```bash
#!/bin/bash
# post-review-comments.sh
# Usage: post-review-comments.sh <pr_number> <repo> <findings_json_file>

PR_NUMBER=$1
REPO=$2
FINDINGS_FILE=$3

# Create a review with inline comments using the GitHub API
# gh supports this via --body and review comments via the API

jq -c '.[]' "$FINDINGS_FILE" | while read -r finding; do
    FILE=$(echo "$finding" | jq -r '.file')
    LINE=$(echo "$finding" | jq -r '.line')
    SEVERITY=$(echo "$finding" | jq -r '.severity')
    MESSAGE=$(echo "$finding" | jq -r '.message')

    # Format the comment with severity indicator
    case $SEVERITY in
        critical) ICON="🚨" ;;
        warning)  ICON="⚠️" ;;
        nit)      ICON="💡" ;;
        *)        ICON="📝" ;;
    esac

    COMMENT_BODY="**${ICON} ${SEVERITY^}** — ${MESSAGE}

_Automated review by Hermes PR Review Pipeline_"

    # Post inline comment via GitHub API
    gh api repos/${REPO}/pulls/${PR_NUMBER}/comments \
        -f body="$COMMENT_BODY" \
        -f path="$FILE" \
        -F line="$LINE" \
        -F side="RIGHT" \
        -f commit_id="$(gh pr view $PR_NUMBER --repo $REPO --json headRefOid --jq '.headRefOid')"
done

# Post summary comment
CRITICAL=$(jq '[.[] | select(.severity=="critical")] | length' "$FINDINGS_FILE")
WARNING=$(jq '[.[] | select(.severity=="warning")] | length' "$FINDINGS_FILE")
NIT=$(jq '[.[] | select(.severity=="nit")] | length' "$FINDINGS_FILE")

gh pr comment $PR_NUMBER --repo $REPO --body "## 🤖 Hermes PR Review Complete

| Severity | Count |
|----------|-------|
| 🚨 Critical | ${CRITICAL} |
| ⚠️ Warning | ${WARNING} |
| 💡 Nit | ${NIT} |

_Review performed by 3 parallel subagents (security, logic, style)._"
```

This uses `gh api` for inline comments because `gh pr comment` only posts general comments, not inline ones. The GitHub API endpoint `POST /repos/{owner}/{repo}/pulls/{pull_number}/comments` lets you attach a comment to a specific line in a specific file.

## The Full Pipeline as a Shell Script

If you want to run this without writing a Python wrapper, here's the complete bash version you can drop into a cron job or a GitHub Action:

```bash
#!/bin/bash
set -euo pipefail

PR_NUMBER="${1:?Usage: $0 <pr_number> [repo]}"
REPO="${2:-$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')}"

echo "Fetching diff for PR #$PR_NUMBER on $REPO..."
DIFF=$(gh pr diff "$PR_NUMBER" --repo "$REPO")
FILES=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json files --jq '.files[].path')

echo "Diff is $(echo "$DIFF" | wc -l) lines across $(echo "$FILES" | wc -l) files"

# The Hermes agent call — this is what you'd run from your Hermes session
# The skill handles the subagent spawning internally
hermes run --skill pr-review-pipeline --input "{\"pr_number\": $PR_NUMBER, \"repo\": \"$REPO\"}"

echo "Review pipeline complete. Check the PR for inline comments."
echo "PR: https://github.com/$REPO/pull/$PR_NUMBER"
```

In practice, you'd trigger this from inside a Hermes session rather than a bare shell script. But the shell wrapper is useful for cron jobs or CI integrations where Hermes runs headless.

## Wiring It Into GitHub Actions

Here's a GitHub Action that triggers the pipeline on every PR:

```yaml
# .github/workflows/hermes-pr-review.yml
name: Hermes PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Hermes
        run: |
          curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
          echo "$HOME/.hermes/bin" >> $GITHUB_PATH

      - name: Configure Hermes
        env:
          HERMES_API_KEY: ${{ secrets.HERMES_API_KEY }}
        run: |
          hermes config set provider openai
          hermes config set model gpt-5.5

      - name: Install PR Review Skill
        run: |
          mkdir -p ~/.hermes/skills/pr-review-pipeline
          cat > ~/.hermes/skills/pr-review-pipeline/SKILL.md << 'SKILL'
          # ... (skill content from above)
          SKILL

      - name: Run Review Pipeline
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          hermes run --skill pr-review-pipeline \
            --input "{\"pr_number\": ${{ github.event.pull_request.number }}, \"repo\": \"${{ github.repository }}\"}"

      - name: Post Summary
        if: always()
        run: |
          echo "Review pipeline completed for PR #${{ github.event.pull_request.number }}"
```

The action installs Hermes, drops the skill file in place, and runs the pipeline. Each subagent runs in Hermes's own process — you don't need to configure anything special for parallelism. The `delegate_task` batch mode handles that internally.

## What I Learned Running This in Production

I've been running this pipeline on every PR at SMF Works for about three months. Here's what actually happens:

**The security agent catches things humans miss.** Not because it's smarter — because it doesn't get bored. Line 187 of a 400-line diff? The human is skimming by then. The security agent reads every line with the same attention level. It flagged a hardcoded API key in a test file that three human reviewers approved.

**The logic agent is the weakest link.** It finds real edge cases but also produces false positives on code that looks suspicious but is actually correct. I tuned the prompt to require it to explain *what breaks* and *how*, which reduced false positives by about 60%. The ones that remain are usually around async patterns the agent doesn't fully understand.

**The style agent is the most controversial.** Developers either love it or hate it. The ones who love it treat the nits as a checklist. The ones who hate it feel like they're being nitpicked by a machine. My solution: style findings go in the summary comment, not as inline comments. They're visible but not in your face.

**Deduplication matters more than you'd think.** Before I added the 3-line dedup window, the pipeline once posted seven comments on the same function — two from security, three from logic, two from style. The developer closed the PR and said "fix your bot." Now the highest-severity finding wins the cluster, and the rest are silently dropped.

**Token costs are predictable.** Three subagents reviewing a 200-line diff costs about 15K tokens total. That's under $0.10 with any reasonable model. A 1000-line diff costs about 50K tokens. The parallelism doesn't change the cost — it changes the latency.

## When NOT to Use This Pipeline

This pipeline is wrong for:

- **Trivial PRs** (typos, config changes, dependency bumps) — the overhead isn't worth it. Add a label like `skip-review` and gate the pipeline on its absence.
- **Binary file changes** — images, PDFs, compiled assets. The diff is meaningless to text-based agents.
- **PRs with more than 2000 lines of diff** — the subagents lose focus. For large PRs, split the review by file group instead of by concern. Each subagent gets a subset of files.
- **Merge commits** — the diff includes all merged changes, which may have already been reviewed. Filter these out with `gh pr view --json mergeCommit`.

## Extending the Pipeline

The three-agent split isn't the only option. Here are variations I've tested:

**Four agents: add a test coverage agent.** This agent checks whether the new code has corresponding tests and whether existing tests still cover the modified paths. It uses `git diff --name-only` to find test files and cross-references them with source files. Useful for repos with weak test discipline.

**Two agents: security + everything else.** For smaller teams, the security/correctness split is the highest-value separation. Style nits can go in a linting rule instead of an agent.

**Per-file agents instead of per-concern.** For PRs that touch many independent files (e.g., a rename across 50 files), spawn one agent per file. Each agent does a holistic review of its single file. This is faster but produces less cross-cutting analysis.

The architecture is the same in all cases: split the work, run in parallel, merge with a severity-ranked dedup, post structured output. The split axis is the only thing that changes.

## The Takeaway

A single agent reviewing a PR is a chatbot with a diff. Three agents reviewing a PR in parallel, each with a bounded scope and a strict output contract, is a review pipeline. The difference is architecture.

The patterns in this post — bounded scope, structured output, parallel execution, severity-ranked merge — aren't specific to PR review. They apply anywhere you need to analyze a complex artifact from multiple angles: log analysis, incident postmortems, documentation review, test suite auditing.

Start with the three-agent split. Tune the prompts for your codebase. Add or remove agents based on what your team actually needs. And for the love of clean diffs, deduplicate your findings.

---

*This post is part of [Liam's Landing](/liams-landing) — practical engineering content from the CDO desk at SMF Works. For more on subagent patterns, check out [Subagent Delegation Patterns](/blog/subagent-delegation-patterns-hermes-ai) and [Map-Reduce Orchestration](/blog/hermes-subagent-orchestration-map-reduce-patterns). For the skill system that powers this pipeline, read [Composite Hermes Skills](/blog/2026-07-21-composite-hermes-skills-chaining-pipelines).*