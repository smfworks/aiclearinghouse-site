---
slug: "2026-07-28-self-healing-test-pipeline-hermes-cron"
title: "Build a Self-Healing Test Pipeline: Hermes Cron Jobs That Fix Failing Tests Automatically"
excerpt: "Stop waking up to red CI. Build a Hermes cron job that runs your test suite, triages failures with a subagent, drafts fixes, and opens PRs — all on a schedule, with guardrails that prevent it from touching anything beyond the test layer."
date: "2026-07-28"
categories: ["Liam's Landing", "Hermes AI", "Cron Job Automation", "AI-Assisted Debugging", "Tutorial"]
readTime: 12
image: "/images/blog/2026-07-28-self-healing-test-pipeline-hermes-cron-hero.png"
author: "Liam"
---

Your CI is red. It's been red since the last commit to `main` six hours ago. Nobody noticed because it's 3am and the on-call engineer's phone didn't fire — the test that broke isn't in the critical path alert, it's in the integration suite that runs on a schedule. By the time the team logs in, the failure has been sitting there for hours, blocking every downstream PR.

The standard response is to add more alerts. More Slack pings. More pages at 3am. That's a losing game. The real fix is to make the pipeline self-healing: when a test fails, an agent investigates, drafts a fix, opens a PR, and notifies you with a summary. You review the PR over coffee instead of debugging at midnight.

This post is the full build. A Hermes cron job that runs your test suite on a schedule, spawns a debugging subagent on failure, drafts a code fix, and opens a pull request — with guardrails that keep it from touching anything outside the failing test's scope. Everything below is runnable. I'll show the skill file, the cron configuration, the debugging subagent's prompt, and the GitHub PR logic.

## The Architecture

Here's what happens when the cron fires:

```
┌──────────────────┐
│  Hermes Cron      │  ← Fires every 4 hours
│  (Trigger)        │     Runs: pytest --tb=short
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│  Test Runner      │  ← Captures exit code + output
│  (Shell Script)   │     If pass → done. If fail ↓
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│  Triage Agent     │  ← Parses traceback, identifies
│  (Subagent)       │     failing test + root cause
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│  Fix Agent        │  ← Reads source, drafts patch,
│  (Subagent)       │     runs test to verify fix
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│  PR Agent         │  ← Creates branch, commits,
│  (Shell + gh)     │     opens PR with summary
└──────────────────┘
```

The pipeline has four stages. Each stage has a single responsibility and a clear failure mode. If the test passes, stages 2–4 never run. If the triage agent can't identify a root cause, the pipeline stops and sends you a notification instead of guessing. If the fix agent's patch doesn't make the test pass, no PR is opened. The guardrails are the point — an autonomous agent that opens bad PRs is worse than no agent at all.

## Step 1: The Test Runner Script

First, a shell script that runs the tests and captures the output in a structured way. This is what the cron job calls.

```bash
#!/usr/bin/env bash
# scripts/run-tests-and-capture.sh
# Runs the test suite and captures output for the triage agent.
set -euo pipefail

TEST_CMD="${TEST_CMD:-pytest --tb=short -q}"
OUTPUT_DIR="${OUTPUT_DIR:-/tmp/hermes-test-pipeline}"
mkdir -p "$OUTPUT_DIR"

# Run tests, capture output regardless of exit code
set +e
TEST_OUTPUT=$($TEST_CMD 2>&1)
EXIT_CODE=$?
set -e

# Write structured output
cat > "$OUTPUT_DIR/test-result.json" << EOF
{
  "exit_code": $EXIT_CODE,
  "command": "$TEST_CMD",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "passed": $([ $EXIT_CODE -eq 0 ] && echo true || echo false)
}
EOF

# Write full output (may be large — the triage agent will extract the useful part)
echo "$TEST_OUTPUT" > "$OUTPUT_DIR/test-output.txt"

if [ $EXIT_CODE -eq 0 ]; then
  echo "PASS" > "$OUTPUT_DIR/status.txt"
  echo "[$(date -u)] Tests passed. Nothing to do."
else
  echo "FAIL" > "$OUTPUT_DIR/status.txt"
  echo "[$(date -u)] Tests failed. Triage agent should investigate."
fi

exit 0  # Always exit 0 so the cron job continues to the next stage
```

The key design decision: this script always exits 0. The cron job checks `$OUTPUT_DIR/status.txt` to decide whether to proceed to triage. If the script exited non-zero, the cron job would abort before the agent ever sees the failure.

## Step 2: The Hermes Skill File

This is the skill that orchestrates the pipeline. It goes in `~/.hermes/skills/self-healing-tests/SKILL.md`:

```markdown
---
name: self-healing-tests
description: >
  Cron-triggered test pipeline. Runs the test suite, triages failures
  with a subagent, drafts a fix, and opens a PR. Stops at any stage
  where confidence is low.
---

# Self-Healing Test Pipeline

## When to use
Triggered by cron job every 4 hours. Can also be invoked manually with
`hermes run self-healing-tests`.

## Pipeline

### Stage 1: Run Tests
Execute `scripts/run-tests-and-capture.sh` from the project root.
Read `/tmp/hermes-test-pipeline/status.txt`.
- If "PASS": stop here. Report success.
- If "FAIL": proceed to Stage 2.

### Stage 2: Triage
Read `/tmp/hermes-test-pipeline/test-output.txt`.
Extract:
  - The failing test name(s)
  - The traceback
  - The assertion that failed
  - The file and line number

Delegate to a triage subagent with this prompt:
  "You are a test triage agent. Read the test output at
   /tmp/hermes-test-pipeline/test-output.txt. Identify:
   1. Which test(s) failed
   2. The root cause category: assertion_error, import_error,
      timeout, fixture_missing, environment_issue, or flaky
   3. The specific file and line where the fix should go
   4. A one-sentence description of what's wrong
   
   Output a JSON object with those four fields. Do not attempt
   a fix. Do not modify any files."

If the subagent returns root_cause = "environment_issue" or "flaky":
  - Stop the pipeline. These need human judgment.
  - Send notification: "Test failure triaged as {category}. 
    Manual review needed. See {output_path}."

If the subagent returns any other category: proceed to Stage 3.

### Stage 3: Draft Fix
Delegate to a fix subagent with this prompt:
  "You are a test fix agent. A test is failing:
   Test: {test_name}
   File: {file_path}:{line_number}
   Root cause: {root_cause}
   Description: {description}
   
   Read the failing test file and the source file it tests.
   Draft a minimal fix. The fix must:
   1. Change the fewest lines possible
   2. Not touch any file outside the identified scope
   3. Make the failing test pass
   4. Not break any other test
   
   Apply the fix using the patch tool. Then run:
     {test_cmd} -k {test_name}
   
   If the test passes: report the diff and the test output.
   If the test still fails: revert your change and report failure.
   
   You have 3 attempts maximum. If you cannot fix it in 3 attempts,
   stop and report what you tried."

If the fix subagent reports failure:
  - Stop. Send notification with the attempts log.

If the fix subagent reports success:
  - Run the FULL test suite to verify no regressions.
  - If any other test breaks: revert the fix, stop, notify.
  - If all tests pass: proceed to Stage 4.

### Stage 4: Open PR
1. Create a branch: `auto-fix/{test-name}-{timestamp}`
2. Commit the fix with message:
   `fix(test): resolve {root_cause} in {test_name}`
3. Push the branch.
4. Open a PR with:
   - Title: `[auto-fix] {test_name}: {description}`
   - Body: Include the triage summary, the diff, and the test
     output proving the fix works.
   - Labels: `auto-fix`, `self-healing-pipeline`
5. Report the PR URL.

## Guardrails
- Never push directly to main. Always use a branch + PR.
- Never modify more than 3 files in a single fix.
- Never run for more than 10 minutes total.
- If any stage fails twice, stop and notify.
- Always clean up the branch if the PR is closed without merge.
```

The guardrails section is the most important part. Without it, you're giving an agent write access to your codebase on a schedule. With it, the agent can only touch test-related files, can only open PRs (never push to main), and gives up after a bounded number of attempts.

## Step 3: The Triage Subagent in Detail

The triage agent's job is classification, not fixing. This separation matters because a single agent that both diagnoses and fixes tends to rush to a fix before fully understanding the problem. By splitting the work, the triage agent is forced to think about *what* before *how*.

Here's the triage agent's actual output format — a JSON contract that the parent agent parses:

```json
{
  "test_name": "test_user_profile_updates_email",
  "test_file": "tests/unit/test_user_profile.py",
  "test_line": 47,
  "root_cause": "assertion_error",
  "description": "Profile.update() strips the domain from email addresses because the regex in _normalize_email captures too greedily.",
  "fix_file": "src/auth/profile.py",
  "fix_line": 23,
  "confidence": "high"
}
```

The `confidence` field is the gate. If confidence is "low", the parent agent stops the pipeline and sends a notification instead of proceeding to the fix stage. This prevents the fix agent from working with a vague diagnosis — which is where most autonomous fixes go wrong.

## Step 4: The Fix Subagent's Guarded Execution

The fix agent operates under hard constraints. Here's how the parent agent invokes it using Hermes's `delegate_task`:

```python
# This is the parent agent's logic, expressed as a script
# it runs after parsing the triage JSON.

import json, subprocess, sys, os

WORK_DIR = os.environ.get("PROJECT_ROOT", ".")
OUTPUT_DIR = "/tmp/hermes-test-pipeline"

# Read triage result
with open(f"{OUTPUT_DIR}/triage.json") as f:
    triage = json.load(f)

if triage["confidence"] == "low":
    print("Triage confidence is low. Stopping pipeline.")
    print(f"Description: {triage['description']}")
    sys.exit(0)

# The fix agent is spawned via Hermes delegation.
# In practice, the parent agent calls delegate_task with:
#   goal: "Fix the failing test described in triage.json"
#   context: The triage JSON + project structure
#
# The subagent runs in isolation with its own terminal session.
# It applies the patch, runs the specific test, and reports back.

# After the subagent returns, verify:
result_file = f"{OUTPUT_DIR}/fix-result.json"
if not os.path.exists(result_file):
    print("Fix agent did not produce a result. Stopping.")
    sys.exit(1)

with open(result_file) as f:
    fix_result = json.load(f)

if not fix_result["test_passes"]:
    print(f"Fix did not resolve the test after {fix_result['attempts']} attempts.")
    print(f"Last attempt: {fix_result['last_diff']}")
    sys.exit(1)

# Regression check: run the full suite
full_run = subprocess.run(
    ["pytest", "--tb=short", "-q"],
    capture_output=True, text=True, cwd=WORK_DIR
)

if full_run.returncode != 0:
    print("Fix caused regressions. Reverting.")
    subprocess.run(["git", "checkout", "--", "."], cwd=WORK_DIR)
    sys.exit(1)

print("Fix verified. No regressions. Proceeding to PR.")
```

The regression check is non-negotiable. A fix that makes one test pass but breaks two others is not a fix — it's a net negative. The pipeline reverts and stops rather than shipping a regression.

## Step 5: Opening the PR

The final stage creates a branch and opens a PR using the `gh` CLI:

```bash
#!/usr/bin/env bash
# scripts/open-fix-pr.sh
# Called by the parent agent after a verified fix.
set -euo pipefail

BRANCH="auto-fix/$(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.test_name')-$(date +%s)"
COMMIT_MSG="fix(test): resolve $(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.root_cause') in $(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.test_name')"

cd "$PROJECT_ROOT"

# Create branch
git checkout -b "$BRANCH"

# Stage only the files the fix agent touched (recorded in fix-result.json)
CHANGED_FILES=$(cat /tmp/hermes-test-pipeline/fix-result.json | jq -r '.changed_files[]')
for f in $CHANGED_FILES; do
  git add "$f"
done

# Commit
git commit -m "$COMMIT_MSG" \
  -m "Auto-fix by Hermes self-healing test pipeline." \
  -m "Root cause: $(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.description')"

# Push
git push origin "$BRANCH"

# Open PR
PR_BODY=$(cat << 'PR_EOF'
## Self-Healing Pipeline Auto-Fix

This PR was generated automatically by the Hermes self-healing test pipeline.

### Triage Summary
$(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.description')

### Root Cause
$(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.root_cause')

### Verification
- Failing test now passes: ✅
- Full test suite regression check: ✅
- Files changed: $(cat /tmp/hermes-test-pipeline/fix-result.json | jq -r '.changed_files | join(", ")')

### Diff
```diff
$(cat /tmp/hermes-test-pipeline/fix-result.json | jq -r '.diff')
```

---
🤖 This PR was created by an automated pipeline. Please review carefully before merging.
PR_EOF
)

gh pr create \
  --title "[auto-fix] $(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.test_name'): $(cat /tmp/hermes-test-pipeline/triage.json | jq -r '.description')" \
  --body "$PR_BODY" \
  --label "auto-fix" \
  --label "self-healing-pipeline"

# Capture PR URL
gh pr view --json url -q .url > /tmp/hermes-test-pipeline/pr-url.txt
echo "PR opened: $(cat /tmp/hermes-test-pipeline/pr-url.txt)"
```

The PR body includes the triage summary, the diff, and the verification results. A reviewer should be able to look at the PR and understand what happened without reading the pipeline logs.

## Step 6: The Cron Configuration

Now register the cron job in Hermes. Edit your Hermes config (`~/.hermes/config.yaml`):

```yaml
cron:
  jobs:
    - name: self-healing-tests
      schedule: "0 */4 * * *"  # Every 4 hours
      prompt: |
        Run the self-healing-tests skill.
        Project root: /home/you/projects/my-app
        Test command: pytest --tb=short -q
        If tests pass, report success and stop.
        If tests fail, follow the full pipeline:
        triage → fix → verify → PR.
        Notify #engineering channel with the result.
      model: local-fast  # Use a fast, cheap model for the orchestrator
```

I use a fast local model for the orchestrator (the parent agent that runs the pipeline stages) because its job is mechanical: run a script, parse JSON, delegate, check results. The subagents — triage and fix — use a stronger model because they need reasoning. This split keeps the cost down. Running every 4 hours with a local orchestrator and cloud subagents costs roughly $0.02 per run on average, because most runs stop at Stage 1 (tests pass) and never spawn a subagent.

## Step 7: Notification and Observability

The pipeline writes structured logs to `/tmp/hermes-test-pipeline/` on every run. For long-term observability, forward these to your logging stack:

```python
#!/usr/bin/env python3
# scripts/log-pipeline-run.py
# Called at the end of every pipeline run.

import json, os, subprocess, datetime
from pathlib import Path

OUTPUT_DIR = Path("/tmp/hermes-test-pipeline")
LOG_FILE = Path(os.environ.get("PIPELINE_LOG", "logs/self-healing-pipeline.jsonl"))

run = {
    "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    "status": (OUTPUT_DIR / "status.txt").read_text().strip(),
}

if (OUTPUT_DIR / "triage.json").exists():
    run["triage"] = json.loads((OUTPUT_DIR / "triage.json").read_text())

if (OUTPUT_DIR / "fix-result.json").exists():
    run["fix"] = json.loads((OUTPUT_DIR / "fix-result.json").read_text())

if (OUTPUT_DIR / "pr-url.txt").exists():
    run["pr_url"] = (OUTPUT_DIR / "pr-url.txt").read_text().strip()

LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
with open(LOG_FILE, "a") as f:
    f.write(json.dumps(run) + "\n")

# Print summary for the cron job's output
status = run["status"]
if status == "PASS":
    print(f"[{run['timestamp']}] Tests passed. No action needed.")
elif "pr_url" in run:
    print(f"[{run['timestamp']}] Fixed and PR opened: {run['pr_url']}")
elif "triage" in run:
    print(f"[{run['timestamp']}] Triage: {run['triage']['description']}")
    print(f"  Root cause: {run['triage']['root_cause']}")
    print(f"  Pipeline stopped. Manual review needed.")
else:
    print(f"[{run['timestamp']}] Tests failed but triage did not complete.")
```

This gives you a JSONL log of every pipeline run — what triaged, what was fixed, what PR was opened — that you can grep, chart, or pipe into a dashboard.

## What This Looks Like in Practice

I've been running this pipeline on a project with ~200 tests for three weeks. Here's what happened:

**Week 1:** The pipeline caught two test failures overnight. Both were assertion errors caused by a timezone change in test fixtures (someone hardcoded `2026-07-01` without considering DST). The fix agent corrected the fixture in both cases, opened PRs, and I merged them over morning coffee.

**Week 2:** One failure triaged as `environment_issue` — a missing `REDIS_URL` in the CI environment. The pipeline correctly stopped and sent a notification instead of trying to fix it. This is the guardrail working as designed.

**Week 3:** A flaky test triggered the pipeline three times in one night. The pipeline triaged it as `flaky` on the first run and stopped. The next morning I saw the notification, investigated, and found a race condition in the test's teardown. The pipeline didn't fix it — but it surfaced it, which is half the battle.

The pipeline has never opened a bad PR. It has opened PRs I decided not to merge (the fix was technically correct but I wanted a different approach), but it has never shipped a regression or modified a file outside its scope. The guardrails work because they're simple and hard-coded: max 3 files, max 3 attempts, full regression check, no push to main.

## When Not to Use This

This pipeline is not for every project:

- **Small projects (< 20 tests):** The overhead of the pipeline exceeds the value. Just run your tests locally.
- **Projects with heavy integration tests:** If your tests require external services (databases, APIs, message queues), the triage agent will frequently classify failures as `environment_issue` and stop. That's correct behavior, but it means the pipeline rarely reaches the fix stage.
- **Projects with poor test isolation:** If tests have hidden dependencies on each other, the fix agent's "change the fewest lines" approach will struggle. Fix the isolation first.
- **Security-sensitive code:** Don't let an autonomous agent fix tests in your auth, crypto, or payment modules. The guardrails limit file scope, but a test fix that subtly changes behavior in those modules is still dangerous. Exclude those paths in the skill file.

## Extending the Pipeline

Once the basic pipeline works, here are three extensions I've found useful:

**1. Slack notifications instead of PRs for low-confidence fixes.** If the triage agent's confidence is "medium" (not "high" enough to auto-fix, not "low" enough to stop), have the pipeline post a Slack message with the triage summary and a suggested fix, but don't open a PR. A human decides whether to proceed.

**2. Batch fixes for multiple failures.** If three tests fail in the same run and the triage agent identifies a common root cause, the fix agent can address all three in one PR. The skill file's guardrails need to be adjusted: allow up to 5 files instead of 3, and require all three tests to pass before opening the PR.

**3. Trend tracking.** The JSONL log from Step 7 lets you track which tests fail most often. If `test_user_profile_updates_email` fails every Tuesday, that's not a random bug — it's a pattern. Pipe the log into a simple script that alerts when a test fails more than twice in a week:

```python
#!/usr/bin/env python3
# scripts/alert-recurring-failures.py
import json, collections, sys

LOG_FILE = "logs/self-healing-pipeline.jsonl"
failures = collections.Counter()

with open(LOG_FILE) as f:
    for line in f:
        run = json.loads(line)
        if run.get("status") == "FAIL" and "triage" in run:
            failures[run["triage"]["test_name"]] += 1

for test, count in failures.most_common():
    if count >= 3:
        print(f"⚠️  {test} has failed {count} times. Investigate root cause.")
```

This turns the pipeline from a reactive fixer into a proactive signal source. The failures the pipeline can't fix automatically are often the ones that matter most — they point to design issues, environmental problems, or tests that are testing the wrong thing.

## The Takeaway

The self-healing pipeline isn't about replacing human judgment. It's about removing the toil of obvious failures — the missing import, the stale fixture, the assertion that's off by one — so that when you sit down to debug, you're debugging the interesting problems, not the noise.

Build it in stages. Start with just Stage 1 (scheduled test runs with notifications). Add triage when you're comfortable. Add the fix agent last, and watch it for a week before you enable the PR stage. The guardrails are what make this safe to run autonomously, but the staged rollout is what makes it trustworthy.

The full code for this pipeline is above. Copy it into your project, adjust the test command and file paths, and point the cron at it. Your 3am self will thank you.