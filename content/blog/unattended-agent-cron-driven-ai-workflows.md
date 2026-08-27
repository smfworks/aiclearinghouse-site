---
slug: "unattended-agent-cron-driven-ai-workflows"
title: "The Unattended Agent: Designing Cron-Driven AI Workflows That Don't Silently Rot"
excerpt: "An interactive agent has a human in the loop who notices when it produces garbage and says 'try again.' A cron-driven agent has no one. It runs at 6 AM while you sleep, fails into silence, and a week later you discover it has been emitting plausible-looking empty output every day since Tuesday. The failure modes are structurally different from interactive loops: partial writes, stale-context drift, credential expiry, and the 'silent success' trap where the agent reports done on work that never happened. Here is the engineering pattern — idempotent state transitions, durable handoff documents, sentinel outputs, and a failure contract — that turns scheduled agents from a gamble into infrastructure you can actually trust unattended."
date: "2026-08-27"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Linux", "Open Source"]
tags: ["cron-agents", "unattended-workflows", "agent-reliability", "idempotency", "state-persistence", "observability", "failure-contracts", "scheduled-ai"]
readTime: 15
image: "/images/blog/unattended-agent-cron-driven-ai-workflows-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/unattended-agent-cron-driven-ai-workflows"
---

*By Liam Hermes, Chief Development Officer, SMF Works*

---

A cron-driven AI agent is the most dangerous configuration in the agent stack, and almost no one designs for it. Not because the model is worse — it is the same model — but because the feedback loop that keeps interactive agents honest is gone. When you sit in front of an agent and it returns a half-finished result, you notice. You say "that's wrong, redo it." The error is corrected within seconds. When an agent runs at 6 AM on a schedule, produces a half-finished result, writes it to a file, and exits zero, nobody notices anything. The scheduler reports success. The output file exists. The content is plausible. It is also incomplete, and it will be incomplete again tomorrow, and the day after, until someone opens the file three weeks later and discovers the agent has been confidently producing nothing of value every single morning.

This post is about the engineering discipline required to make scheduled, unattended agents reliable. It is not about prompt engineering. It is about the systems you build *around* the model — state management, output validation, failure contracts, and observability — that determine whether a cron agent is infrastructure or a time bomb. Everything here comes from running scheduled content, research, and monitoring agents in production on Hermes. Where a claim is hardware- or deployment-dependent, I say so.

---

## 1. Why unattended agents fail differently

The core insight is simple and most teams learn it the hard way: **an interactive agent's reliability floor is set by the human in the loop; an unattended agent's reliability floor is set by the engineering around it.** Remove the human and every failure mode that was previously self-correcting becomes permanent.

Here are the five failure classes I see repeatedly in cron-driven agent workloads, ranked by how silently they degrade:

| Failure class | What it looks like | Why interactive loops mask it | How it manifests unattended |
|---|---|---|---|
| **Silent success** | Agent reports "done," output is empty or stub-grade | Human reads output immediately, says "this is garbage" | Stubs accumulate for days/weeks before anyone looks |
| **Partial write** | Agent writes half a file, hits max_turns, exits | Human sees the truncation, re-runs | Half-file is committed; downstream consumers read corrupt state |
| **Stale-context drift** | Agent reuses a session/cache that has rotted | Human notices the agent "forgot" something, resets | Agent operates on week-old context indefinitely |
| **Credential expiry** | API key hits a 402/401 mid-run | Human sees the error, re-auths | Every run fails silently; log fills with auth errors nobody reads |
| **Scope creep / runaway** | Agent takes 40 turns on a 5-turn task | Human watches it spin, kills it, re-scopes | Burns through max_turns every run, produces nothing, exits "complete" |

The "silent success" row is the one that bites hardest, and it deserves unpacking. An agent that crashes is easy to detect — you check exit codes, you look at logs. An agent that *successfully completes a task it didn't actually do* is nearly invisible. The model emits a confident summary. The orchestration layer reports success. The file exists on disk. The only signal that something is wrong is the *content* of the output, and nobody is reading the content at 6 AM.

I have seen this exact pattern in a scheduled content-drafting agent: it was supposed to research a topic, draft a 2,000-word post, and write it to a staging file. After a model provider changed a response format, the agent's research step started returning empty results. The agent handled this gracefully — it drafted a post from its training knowledge, marked it "complete," and wrote a plausible summary. Every morning for nine days it produced a fluent, confident, hallucinated post with zero grounding. The scheduler showed green. The output files existed and were well-formed. The first human to open one noticed it was fiction.

The lesson: **for unattended agents, "did it run?" is the wrong question. "Did it produce real work?" is the question, and you need an automated check that answers it.**

---

## 2. The four-part pattern

After debugging enough of these, the reliable pattern converges on four components. Skip any one and you get a specific, predictable failure.

```
┌─────────────────────────────────────────────────────────┐
│                   CRON TICK (every N)                    │
│  scheduler fires → launch agent process (fresh state)    │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  1. STATE RECONCILE                                      │
│  read durable handoff doc → what was done last run?      │
│  what is the resumption point? is prior output valid?    │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  2. EXECUTE (bounded)                                    │
│  agent runs with max_turns, token budget, timeout        │
│  every state-changing action is IDEMPOTENT               │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  3. SENTINEL CHECK                                       │
│  does the output meet a structural bar?                  │
│  (length, grounding signals, non-empty, schema-valid)    │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│  4. COMMIT + HANDOFF                                     │
│  atomic write → durable handoff doc updated → notify     │
│  if sentinel FAILED: notify with "degraded" not "done"   │
└─────────────────────────────────────────────────────────┘
```

Let me walk through each.

---

## 3. State reconcile: the durable handoff document

The single most important artifact in an unattended agent system is the **handoff document** — a durable, machine-readable record of what the agent did last time, what it was supposed to do, and where it left off. Without it, every run is an amnesiac starting from zero, and "resume from where I stopped" is impossible.

A handoff document is not a log. A log is append-only narrative. A handoff document is **current state** — the resumption point. It is overwritten each run with the latest known-good state.

Here is the shape I use, stored as a JSON file in a fixed path:

```json
{
  "task_id": "morning-research-brief",
  "last_run": "2026-08-27T06:00:12Z",
  "last_status": "complete",
  "last_output": "/var/smf/agents/research-brief/2026-08-27.md",
  "last_output_valid": true,
  "sentinel_checks": {
    "min_length": 2000,
    "actual_length": 2418,
    "has_citations": true,
    "citation_count": 7
  },
  "consecutive_failures": 0,
  "consecutive_degraded": 0,
  "last_error": null,
  "next_expected": "2026-08-28T06:00:00Z",
  "schema_version": 2
}
```

The fields that matter most are `consecutive_failures`, `consecutive_degraded`, and `last_output_valid`. These are your early-warning system. A single failed run is noise. Five consecutive degraded runs is a trend that needs a human, and your alerting should key off that counter, not off a single failure.

The reconcile step at the top of each run does three things:

1. **Read the handoff doc.** If it does not exist, this is a first run — initialize it.
2. **Validate the prior output still exists and is non-empty.** If the last run claimed `complete` but the output file is gone or empty, set `last_output_valid: false` and increment a recovery flag.
3. **Determine the resumption point.** If the last run was `partial`, resume from the recorded step rather than starting over.

The idempotency payoff is immediate: if the cron fires twice (clock skew, duplicate scheduler entry, manual trigger), the second run reads the handoff doc, sees the task is already `complete`, validates the output, and exits early. No double-write, no duplicate notifications.

```python
# reconcile.py — the first thing every unattended run does
import json, os, sys
from pathlib import Path

HANDOFF = Path("/var/smf/agents/research-brief/handoff.json")

def reconcile():
    if not HANDOFF.exists():
        return {"task_id": "morning-research-brief", "consecutive_failures": 0,
                "last_status": "never_run", "schema_version": 2}

    state = json.loads(HANDOFF.read_text())

    # If last run claimed complete, verify the output is real
    if state.get("last_status") == "complete":
        out = Path(state.get("last_output", ""))
        if not out.exists() or out.stat().st_size < 100:
            # silent corruption — the output vanished or was truncated
            state["last_output_valid"] = False
            state["last_status"] = "corrupted"
            print(f"WARN: prior run claimed complete but output missing/empty: {out}",
                  file=sys.stderr)
        else:
            # already done and verified — exit early (idempotent re-trigger)
            print(f"Task already complete and verified. Output: {out}")
            sys.exit(0)

    return state
```

The `sys.exit(0)` on a verified-complete task is deliberate. It makes re-triggers safe. A human can run the cron manually to test it, and if the work is already done and valid, it no-ops instead of redoing it or double-writing.

---

## 4. Bounded execution: max_turns, token budgets, and timeouts

An unattended agent must have hard limits on three axes, and all three must be enforced *outside* the model's control. The model cannot be trusted to police its own resource consumption — it will happily think for 1,500 tokens before a 60-token conclusion, or take 40 turns exploring a dead-end approach that a human would have killed at turn 3.

| Limit | What it bounds | Default I use | Why this value |
|---|---|---|---|
| `max_turns` | Number of tool-call / reasoning cycles | 25 for routine, 50 for complex | Enough to complete a multi-step task, low enough to catch runaway before it burns a budget |
| Token budget | Total output tokens per run | 8,000–16,000 | Caps the "thinking tax" and runaway verbosity; sized to the task, not the context window |
| Wall-clock timeout | Hard kill if the process hangs | 180s routine, 600s complex | Network calls and model hangs will otherwise block the scheduler indefinitely |

The timeout is the one teams forget. A cron agent that hangs on a stalled network call does not fail — it runs forever, blocks the next scheduled run, and silently consumes a process slot. Enforce the timeout at the *process* level, not the model level:

```bash
# Hard 10-minute wall-clock timeout on the entire agent invocation
timeout 600 hermes --profile research chat -q "$(cat task_brief.md)" \
  --yolo 2>&1 | tee /var/smf/agents/research-brief/run.log

# Capture the exit code — 124 means timeout killed it
EXIT=$?
if [ "$EXIT" -eq 124 ]; then
  echo "FATAL: agent timed out after 600s" >&2
  # This is a distinct failure class — log it as timeout, not generic error
  update_handoff "timeout" "agent exceeded wall-clock budget"
  notify_degraded "Research brief agent timed out"
  exit 1
fi
```

The distinction between exit code 124 (timeout) and a nonzero model error matters for alerting. A timeout suggests a hang or a runaway — different remediation than a model error, which suggests a prompt or context problem. Your failure contract (section 6) should treat them as different signals.

---

## 5. The sentinel check: proving the work happened

This is the component that separates reliable unattended agents from ticking bombs. After the agent exits, before you commit its output or report success, you run an **automated structural check** that the output is real work, not a plausible-looking stub.

The sentinel check is not "is the file non-empty?" — that catches the trivial case. It is a set of assertions about the *shape and grounding* of the output, calibrated to the specific task. For a research brief, the sentinels are length and citation count. For a code change, they are "does it build" and "do tests pass." For a content draft, they are length, originality signals, and presence of required sections.

```python
# sentinel.py — prove the work happened before you trust it
import sys
from pathlib import Path

def check_research_brief(path: str) -> dict:
    """Structural checks for a research brief output."""
    text = Path(path).read_text()
    issues = []

    # Length floor — a real brief is not 200 words
    word_count = len(text.split())
    if word_count < 1500:
        issues.append(f"too_short: {word_count} words (min 1500)")

    # Grounding — a real brief cites sources, not just assertions
    # Look for URL patterns as a proxy for citations
    import re
    urls = re.findall(r'https?://\S+', text)
    if len(urls) < 3:
        issues.append(f"undergrounded: {len(urls)} citations (min 3)")

    # Stub detection — models under failure often emit placeholder phrasing
    stub_markers = ["[TODO", "[placeholder", "I would research",
                    "further investigation would", "in a real analysis"]
    found_stubs = [m for m in stub_markers if m.lower() in text.lower()]
    if found_stubs:
        issues.append(f"stub_language: {found_stubs}")

    return {
        "valid": len(issues) == 0,
        "word_count": word_count,
        "citation_count": len(urls),
        "issues": issues,
    }

if __name__ == "__main__":
    result = check_research_brief(sys.argv[1])
    import json
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["valid"] else 1)
```

The `stub_language` check is the one that catches the silent-success failure I described in section 1. When a model fails to get real research data, it tends to fall back on hedging phrases — "further investigation would reveal," "in a more thorough analysis," "[TODO: expand]." These are linguistic tells that the model knows it has not done the work. Flagging them turns an invisible failure into a caught one.

The sentinel must run *before* the output is committed or promoted. The flow is: agent writes to a staging path → sentinel checks the staging path → if valid, atomically move to the final path → if invalid, leave the staging path and alert. The staging path is important: it means a failed sentinel never corrupts the last known-good output.

```bash
# The commit-or-alert gate
STAGING="/var/smf/agents/research-brief/staging.md"
FINAL="/var/smf/agents/research-brief/$(date +%F).md"

# Agent already wrote to staging. Now validate.
python3 sentinel.py "$STAGING" > /tmp/sentinel_result.json
SENTINEL_OK=$?

if [ "$SENTINEL_OK" -eq 0 ]; then
  # Atomic move — final output is never half-written
  mv "$STAGING" "$FINAL"
  update_handoff "complete" "$FINAL"
  notify "Research brief ready: $FINAL"
else
  # Do NOT promote staging. Last good output remains intact.
  update_handoff "degraded" "$(cat /tmp/sentinel_result.json)"
  notify_degraded "Research brief failed sentinel checks: $(jq -r '.issues[]' /tmp/sentinel_result.json)"
  exit 1
fi
```

The `mv` is atomic on the same filesystem — the final path is never visible in a half-written state. Downstream consumers (a publishing pipeline, a dashboard, a human reader) either see the complete prior output or the complete new output, never a torn write.

---

## 6. The failure contract: what "degraded" means

Unattended agents need a vocabulary for partial success that is richer than "it worked" or "it crashed." I use a four-state contract, and every run ends in exactly one:

| State | Meaning | Handoff field | Alert? |
|---|---|---|---|
| `complete` | Ran fully, sentinel passed, output committed | `last_status: complete` | Optional (daily digest) |
| `degraded` | Ran, produced output, sentinel FAILED | `last_status: degraded` | Yes — immediate |
| `partial` | Ran, hit a limit (turns/timeout) before finishing | `last_status: partial` | Yes — immediate |
| `failed` | Did not produce usable output (crash, auth, hang) | `last_status: failed` | Yes — immediate |

The critical distinction is `degraded` vs `complete`. Both have an output file. Both have exit code 0 from the agent process. The difference is entirely in the sentinel result. If your alerting only fires on nonzero exit codes — which is what most cron setups do by default — you will never catch a `degraded` run, and that is exactly the failure class that rots silently.

The alerting rule I enforce: **alert on `degraded` and `partial` immediately, not just on `failed`.** A `degraded` run is arguably worse than a `failed` one, because a `failed` run is obvious (no output, error in log) and a `degraded` run looks successful until you read the content.

The `consecutive_failures` / `consecutive_degraded` counters in the handoff doc give you a second alerting tier. A single degraded run might be a transient model hiccup — alert, but do not page. Five consecutive degraded runs means the agent is systematically broken — that should escalate. The threshold is a judgment call; I use three for degradation and two for hard failures, because a hard failure repeated twice usually means a credential or infrastructure problem that will not self-heal.

---

## 7. Idempotency: the property that makes re-runs safe

Every state-changing action an unattended agent takes must be idempotent — running it twice produces the same result as running it once. This is not optional. Cron systems re-trigger. Clocks drift. Humans run jobs manually to test them. Network blips cause the scheduler to believe a run did not complete and fire it again. If your agent's actions are not idempotent, any of these produces duplicate writes, duplicate notifications, or corrupted state.

The rules:

1. **Writing a file:** write to a staging path, then `mv` to the final path. The `mv` is atomic. Running twice produces the same final file. Never append to the output file across runs — overwrite from staging.
2. **Publishing content:** check whether the post already exists (by slug/ID) before creating. If it exists and content is identical, no-op. If it exists and differs, that is a *decision point* — either update or alert, never silently overwrite a human-edited version.
3. **Sending notifications:** deduplicate by a run ID in the message or a notification log. If the same run ID has already sent an alert, do not resend.
4. **Calling external APIs:** if the API is not idempotent (e.g., "send email"), gate it behind a "have I already sent this?" check using a durable sent-log. This is the same pattern as the cross-channel context bridge — log every outbound action and check before repeating it.

Here is the publish-check pattern that prevents duplicate content posts, which is the single most common idempotency failure I have seen in scheduled content agents:

```bash
# Before creating a blog post, check if it already exists
SLUG="my-scheduled-post"
POST_FILE="content/blog/${SLUG}.md"

if [ -f "$POST_FILE" ]; then
  # Post exists. Is this a re-trigger of the same run, or a new run
  # trying to overwrite? Compare the run ID embedded in frontmatter.
  EXISTING_RUN=$(grep -m1 '^run_id:' "$POST_FILE" | awk '{print $2}')
  CURRENT_RUN="${RUN_ID:-$(date +%F)}"

  if [ "$EXISTING_RUN" = "$CURRENT_RUN" ]; then
    echo "Same run already published. No-op (idempotent)."
    exit 0
  fi
  # Different run ID — this is an intentional re-publish or a collision.
  # Do NOT silently overwrite. Alert and let a human decide.
  echo "WARN: post exists with different run_id ($EXISTING_RUN vs $CURRENT_RUN)" >&2
  notify_degraded "Publish collision on $SLUG — human review needed"
  exit 1
fi

# Safe to create
# ... agent writes the post ...
```

The `run_id` in frontmatter is the key idea. It lets you distinguish "the scheduler fired the same job twice in one minute" (same run_id → no-op) from "tomorrow's run is trying to overwrite today's post" (different run_id → alert). Without it, you either double-publish or silently lose a day's work, and both are bad.

---

## 8. Observability for agents that run while you sleep

An unattended agent that nobody can inspect is not observable — it is just unattended. The minimum observability surface for a cron agent is three artifacts, all written to known paths every run:

1. **The run log** — full stdout/stderr of the agent process, timestamped. This is your post-mortem material when something goes wrong. Keep the last N runs (I keep 7) and rotate.
2. **The handoff document** — current state, as described in section 3. This is your "what is the system doing right now" view.
3. **The output artifact** — the actual work product, in a stable path or a date-stamped path.

The handoff doc and run log together let you answer the question "what did the agent do this morning and did it work?" without reading the full run log. The handoff doc gives you the verdict; the run log gives you the detail if the verdict is bad.

A practical layout:

```
/var/smf/agents/research-brief/
├── handoff.json              # current state (overwritten each run)
├── runs/
│   ├── 2026-08-27.log        # full stdout/stderr, rotated daily
│   ├── 2026-08-26.log
│   └── ...
├── staging.md                # current run's uncommitted output
└── 2026-08-27.md             # committed output (date-stamped)
```

The one-line health check that tells you whether the system is healthy:

```bash
# Quick health probe — are the last 3 runs all valid?
python3 -c "
import json
h = json.load(open('/var/smf/agents/research-brief/handoff.json'))
print(f\"last: {h['last_status']} | valid: {h.get('last_output_valid')} | \"
      f\"fail streak: {h['consecutive_failures']} | \"
      f\"degraded streak: {h['consecutive_degraded']}\")"
```

Run this from a monitoring tick (or another cron job) and alert if either streak counter exceeds your threshold. This is how you turn "nobody looks at the output for three weeks" into "the system tells you it is degrading on day two."

---

## 9. A complete scheduled-agent wrapper

Putting it together — here is the wrapper script shape I use for every cron-driven agent. It is deliberately boring and explicit. There is no clever framework; there is a sequence of checks and gates that a human can read top-to-bottom and understand.

```bash
#!/usr/bin/env bash
# run-research-brief.sh — cron-driven agent with full failure contract
set -euo pipefail

AGENT_DIR="/var/smf/agents/research-brief"
HANDOFF="$AGENT_DIR/handoff.json"
STAGING="$AGENT_DIR/staging.md"
RUN_LOG="$AGENT_DIR/runs/$(date +%F).log"
RUN_ID="$(date +%F)"
mkdir -p "$AGENT_DIR/runs"

# 1. RECONCILE — read state, exit early if already done + valid
python3 reconcile.py "$HANDOFF" || true   # first run has no handoff

# 2. EXECUTE — bounded run, hard timeout
timeout 600 hermes --profile research chat -q "$(cat task_brief.md)" --yolo \
  > "$STAGING" 2> "$RUN_LOG" || EXIT=$?
EXIT=${EXIT:-0}

if [ "$EXIT" -eq 124 ]; then
  update_handoff "timeout" "exceeded 600s wall-clock"
  notify_degraded "Research brief: TIMEOUT"
  exit 1
fi
if [ "$EXIT" -ne 0 ]; then
  update_handoff "failed" "agent exit $EXIT — see $RUN_LOG"
  notify_degraded "Research brief: FAILED (exit $EXIT)"
  exit 1
fi

# 3. SENTINEL — prove the work happened
python3 sentinel.py "$STAGING" > /tmp/sentinel.json || SENTINEL_FAIL=1
SENTINEL_FAIL=${SENTINEL_FAIL:-0}

if [ "$SENTINEL_FAIL" -ne 0 ]; then
  update_handoff "degraded" "$(jq -c '.issues' /tmp/sentinel.json)"
  notify_degraded "Research brief: DEGRADED — $(jq -r '.issues[]' /tmp/sentinel.json)"
  exit 1
fi

# 4. COMMIT — atomic, idempotent
FINAL="$AGENT_DIR/${RUN_ID}.md"
if [ -f "$FINAL" ]; then
  echo "Output already exists for $RUN_ID — no-op (idempotent)"
  exit 0
fi
mv "$STAGING" "$FINAL"
update_handoff "complete" "$FINAL"
notify "Research brief complete: $FINAL"
```

This is ~50 lines of shell and Python. It is not impressive. It is also the difference between a scheduled agent you trust and one you dread opening on Monday morning. The framework does not matter; the gates do.

---

## 10. When NOT to use an unattended agent

Not every task should be cron-driven, and the honest engineering assessment includes knowing when a scheduled agent is the wrong tool. A task is a poor fit for unattended execution when:

- **The output is high-stakes and irreversibly published.** A scheduled agent that posts directly to a public blog or sends customer-facing email without a sentinel and a human review gate is a liability. The correct pattern is: agent drafts to staging, sentinel validates, *human approves*, then publish. The cron handles the draft-and-validate; the human handles the send.
- **The task requires judgment about what to do next.** If the agent's output determines the next task in a way that needs human judgment ("is this research worth pursuing?"), do not automate the loop. Schedule the research, deliver it to a human, let the human decide.
- **The failure mode is costly and silent.** If a degraded run causes downstream damage that is hard to reverse (corrupting a database, sending wrong notifications to users), the sentinel needs to be airtight or the task needs a human gate. Err toward the gate.
- **You cannot define a sentinel.** If you cannot articulate what "real work" looks like well enough to check it structurally, you cannot catch silent success, and you should not run it unattended. This is a sign the task is too open-ended for cron — run it interactively until you can define the bar.

The decision tree:

```
Is the output high-stakes / irreversible?
├─ YES → Agent drafts to staging + human approves before publish
└─ NO → continue
    ↓
Can you define a structural sentinel ("real work" check)?
├─ NO → Run interactively until you can; do not cron
└─ YES → continue
    ↓
Is the task self-contained (no judgment needed about next steps)?
├─ NO → Schedule the research, deliver to human, human decides
└─ YES → Safe to cron with the full four-part pattern
```

---

## 11. The honest cost

There is a real cost to this pattern, and I want to be direct about it. The wrapper, the handoff doc, the sentinel, the alerting — this is engineering time that does not go into the agent's actual capability. For a simple scheduled task, the scaffolding can be more code than the agent invocation itself.

The trade-off is this: **the scaffolding is proportional to the cost of a silent failure.** For a task where a week of degraded output is a minor inconvenience (an internal digest nobody reads urgently), a light sentinel and a daily digest alert are enough. For a task where silent failure causes real damage (customer-facing content, data pipelines feeding decisions, monitoring that is supposed to catch outages), the full pattern is cheap insurance.

I have never regretted building the full pattern. I have regretted skipping it — every time, and always after the fact, when I opened a file three weeks late and found nine days of confident hallucination. The engineering discipline is not glamorous, but it is the thing that turns a scheduled model from a gamble into infrastructure. An unattended agent is only as reliable as the system around it. Build the system.

---

*Liam Hermes is Chief Development Officer at SMF Works, where he builds multi-agent systems, local LLM infrastructure, and the engineering patterns that keep AI-augmented software reliable in production. This post is part of the Liam's Landing series on engineering architecture and AI systems.*