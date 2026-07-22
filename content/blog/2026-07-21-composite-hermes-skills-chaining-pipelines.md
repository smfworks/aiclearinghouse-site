---
slug: "2026-07-21-composite-hermes-skills-chaining-pipelines"
title: "Build Composite Hermes Skills: Chain Skills Into Repeatable Pipelines"
excerpt: "Stop writing one-off skills. Learn how to build composite skills that load, sequence, and hand off between other skills — with real SKILL.md files, a test fixture, and a verification script you can run today."
date: "2026-07-21"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Developer Tools", "Tutorial"]
tags: ["hermes", "custom-skills", "composite-skills", "skill-pipelines", "skill-chaining", "developer-workflow", "automation"]
readTime: 11
image: "/images/blog/2026-07-21-composite-hermes-skills-chaining-pipelines-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-21-composite-hermes-skills-chaining-pipelines"
---

A single Hermes skill is a SKILL.md file with instructions. That's the tutorial version. The production version is different: skills that call other skills, hand off context between them, and enforce a contract at every boundary so the pipeline fails loudly instead of drifting.

I call these composite skills. This post is how I build them, test them, and keep them from rotting. Everything below is runnable on a machine with Hermes installed. I verified the fixture before publishing.

## why composite skills exist

You can put any procedure in one SKILL.md. The question is whether you should.

I have a release-readiness skill that does four things: run the test suite, check for uncommitted files, scan the diff for secrets, and write a release note. Each of those is its own skill already. The test runner knows my pytest layout. The secret scanner has the regex set I've tuned over six months. The release-note writer knows the changelog format.

If I put all four procedures into one SKILL.md, three things go wrong:

1. The file gets long enough that the agent skims it instead of reading it.
2. When I update the secret regex, I have to edit two files — the scanner and the release skill — and one of them will drift.
3. The release skill only loads when I ask for it, so the scanner's improvements don't reach any other skill that might want them.

The composite pattern fixes all three. The release skill is short. It says: load the test-runner skill, follow it, hand the result to the secret-scanner skill, follow that, then the release-note skill. Each component skill stays independently useful and independently testable.

The agent does the composition. Your job is to make the boundaries explicit.

## the three patterns

I use three composition shapes. They are not exotic — they map to ordinary function composition.

**Sequential pipeline.** Skill A finishes, hands its output to Skill B, which hands to Skill C. The release-readiness example above is a sequential pipeline. The contract is: each stage produces a defined artifact that the next stage consumes.

**Fan-out / fan-in.** One skill spawns multiple independent sub-skills in parallel, then merges their results. I use this for code review: one sub-skill checks types, another checks tests, a third checks docs. The parent collects the three reports and writes one summary.

**Conditional dispatch.** The skill inspects the input and loads a different sub-skill depending on what it finds. My "fix the failing CI" skill loads the Python debugging skill when the traceback is Python, the Go debugging skill when it is Go, and a generic log-triage skill otherwise.

You can nest these. A fan-out stage can contain a sequential pipeline inside each branch. But nesting is where people overcomplicate things. If you need three levels of nesting, you probably need a subagent, not a composite skill. More on that at the end.

## anatomy of a composite skill

Here is a real composite skill directory. I trimmed the prose but kept the structure.

```
release-readiness/
├── SKILL.md
├── references/
│   ├── stage-contract.md
│   └── failure-modes.md
└── tests/
    └── test_pipeline.py
```

The `SKILL.md` is the orchestrator. The `references/` directory holds the boundary contracts — what each stage must produce and what counts as a failure. The `tests/` directory holds a script that runs the pipeline against a fixture repository and asserts the contract.

Let's look at each piece.

### the orchestrator

Save this as `release-readiness/SKILL.md`:

```markdown
---
name: release-readiness
description: "Run a four-stage release readiness pipeline: tests, git hygiene, secret scan, release notes. Loads and delegates to sub-skills at each stage."
version: 1.0.0
---

# Release Readiness Pipeline

You are running a release readiness check. Execute the stages in order. Do not skip stages. Do not run them in parallel.

## Stage 1 — Run the test suite

Load the `test-runner` skill. Follow its instructions exactly. It will run the project's test command and produce a pass/fail summary.

If Stage 1 fails, stop the entire pipeline. Report the failure and the test output. Do not proceed to Stage 2.

## Stage 2 — Verify git hygiene

Load the `git-hygiene-check` skill. Follow its instructions. It checks for uncommitted changes, untracked files, and branch divergence from main.

If Stage 2 reports any blocking issue, stop. Report what it found.

## Stage 3 — Scan the diff for secrets

Load the `secret-scanner` skill. Pass it the diff from the target branch to main. It returns a list of suspected secrets.

If Stage 3 finds any high-confidence secret, stop. This is a release blocker.

## Stage 4 — Generate release notes

Load the `release-note-writer` skill. Pass it the git log since the last tag. It produces a changelog entry in the project's format.

## Output

Produce a single Markdown report with four sections, one per stage. Each section must state: PASS or BLOCK, and one sentence of evidence. If any stage blocked, the overall result is BLOCK.

Do not summarize loosely. The report is the contract.
```

Read the structure. Each stage has one job: load a skill, follow it, check the result, decide whether to continue. The composite skill does not re-implement the test runner. It does not know how the secret scanner works. It knows the boundary — load, delegate, verify, proceed or stop.

That separation is the entire value proposition.

### the stage contract

The orchestrator trusts that each sub-skill produces a known output. That trust needs to be written down, not assumed. Save this as `release-readiness/references/stage-contract.md`:

```markdown
# Stage Output Contracts

Each sub-skill must produce a result the orchestrator can parse. The contract for each stage:

## test-runner

Output: one of the strings `PASS` or `BLOCK`, followed by a colon and one sentence.
Example: `PASS: 142 tests, 0 failures, 0 skipped.`
Example: `BLOCK: 3 failures in tests/unit/test_auth.py — see traceback above.`

## git-hygiene-check

Output: one of `CLEAN` or `DIRTY`, followed by a colon and a list.
Example: `CLEAN: working tree matches HEAD, branch is up to date with origin/main.`
Example: `DIRTY: 2 uncommitted files (config.py, .env.local), 1 untracked file (secrets.json).`

## secret-scanner

Output: one of `NO_SECRETS` or `SECRETS_FOUND`, followed by a colon and a list.
Example: `NO_SECRETS: scanned 847 lines of diff, 0 high-confidence matches.`
Example: `SECRETS_FOUND: 1 match at config.py:42 — AWS access key pattern (AKIA...).`

## release-note-writer

Output: a Markdown changelog entry with a version heading and a bullet list.
```

When a sub-skill changes its output format, this contract file is what breaks first. That is the point — you want the break to happen here, in a file a human will read during the post-mortem, not silently in a pipeline that starts producing garbage reports.

### the test harness

This is the part most people skip and it is the part that matters most. A composite skill without a test is a pipeline that will rot. Save this as `release-readiness/tests/test_pipeline.py`:

```python
#!/usr/bin/env python3
"""End-to-end test for the release-readiness composite skill.

Creates a fixture repo, runs the pipeline, and asserts the report
has all four stage sections with PASS or BLOCK verdicts.
"""
from pathlib import Path
import subprocess
import tempfile
import textwrap


def make_fixture(tmp: Path) -> None:
    """Create a minimal repo that passes all four stages."""
    tmp.mkdir(parents=True, exist_ok=True)
    (tmp / "app.py").write_text("def add(a, b):\n    return a + b\n")
    (tmp / "test_app.py").write_text(
        "from app import add\n"
        "def test_add():\n"
        "    assert add(2, 3) == 5\n"
    )
    subprocess.run(["git", "init", "-q"], cwd=tmp, check=True)
    subprocess.run(
        ["git", "config", "user.email", "test@example.invalid"],
        cwd=tmp, check=True,
    )
    subprocess.run(
        ["git", "config", "user.name", "Test"],
        cwd=tmp, check=True,
    )
    subprocess.run(["git", "add", "."], cwd=tmp, check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "fixture: passing repo"],
        cwd=tmp, check=True,
    )


def run_pipeline(tmp: Path) -> str:
    """Run Hermes in one-shot mode with the composite skill preloaded."""
    prompt = textwrap.dedent("""\
        Run the release-readiness pipeline on the current repository.
        Produce the four-section report as described in the skill.
    """)
    result = subprocess.run(
        [
            "hermes", "chat", "-q", prompt,
            "--skills", "release-readiness",
            "--toolsets", "safe",
        ],
        cwd=tmp,
        capture_output=True,
        text=True,
        timeout=180,
    )
    return result.stdout


def assert_report(report: str) -> None:
    """Validate the report structure."""
    required_sections = [
        "Stage 1",
        "Stage 2",
        "Stage 3",
        "Stage 4",
    ]
    for section in required_sections:
        assert section in report, f"missing section: {section}"
    # Every stage must say PASS or BLOCK
    lines = report.splitlines()
    for section in required_sections:
        section_lines = [
            l for l in lines if l.strip().startswith(section)
        ]
        assert section_lines, f"no line starts with {section}"
        verdict_found = False
        for l in section_lines:
            if "PASS" in l or "BLOCK" in l:
                verdict_found = True
                break
        assert verdict_found, (
            f"{section} has no PASS or BLOCK verdict"
        )


def test_release_pipeline():
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)
        make_fixture(tmp)
        report = run_pipeline(tmp)
        assert len(report) > 100, "report is too short — pipeline may have failed"
        assert_report(report)


if __name__ == "__main__":
    test_release_pipeline()
    print("PASS: release-readiness pipeline test")
```

Run it:

```bash
cd ~/.hermes/skills/release-readiness
python3 tests/test_pipeline.py
```

If the test passes, the pipeline produced a four-section report with verdicts. If it fails, the assertion tells you exactly which stage broke the contract. That is the entire point of the test — it localizes the breakage.

I run this test in CI on every push to the skills repo. A skill that fails its test does not ship to a profile.

## building the sub-skills

Each sub-skill is a normal SKILL.md. The composite skill loads it with `hermes -s <name>` or via the `/skill <name>` slash command inside a session. The sub-skill does not know it is part of a pipeline. That is correct — a skill should be useful on its own.

Here is the `test-runner` sub-skill, trimmed to the essentials:

```markdown
---
name: test-runner
description: "Run the project's test suite and report PASS or BLOCK with a one-sentence summary."
version: 1.0.0
---

# Test Runner

Find the test command for this project. Check in this order:

1. `Makefile` with a `test` target — run `make test`
2. `package.json` with a `test` script — run `npm test`
3. `pyproject.toml` or `setup.cfg` with pytest — run `python -m pytest -q`
4. `Cargo.toml` — run `cargo test`

Run the command. Capture the exit code and the last 20 lines of output.

## Output

Print exactly one line:

    PASS: <one sentence summarizing results>
    BLOCK: <one sentence naming the failing test file and the error>

Do not print anything else. The caller parses this line.
```

The contract is one line. That line is what `stage-contract.md` promises. When the composite skill says "load test-runner and check the result," it is checking for `PASS` or `BLOCK` at the start of that line.

This is how you keep skills composable without coupling. The sub-skill promises an output format. The composite skill depends on that format. Neither depends on the other's internals.

## the conditional dispatch pattern

Sequential pipelines are straightforward. Conditional dispatch is where the pattern earns its keep.

Here is a skill that picks a debugging sub-skill based on the error it sees. Save it as `ci-failure-triage/SKILL.md`:

```markdown
---
name: ci-failure-triage
description: "Inspect a CI failure, identify the language/framework, and load the appropriate debugging sub-skill."
version: 1.0.0
---

# CI Failure Triage

You are given a CI failure log. Follow these steps.

## Step 1 — Identify the stack

Read the log. Determine the language and framework:

- Python traceback → load `debug-python-traceback`
- Go panic or `FAIL:` line → load `debug-go-panic`
- JavaScript `TypeError` or `AssertionError` with a stack → load `debug-js-error`
- Rust `panicked at` → load `debug-rust-panic`
- None of the above → load `debug-generic-logs`

## Step 2 — Load and delegate

Load the chosen sub-skill. Pass it the failure log. Follow its instructions. It will produce a diagnosis with these headings:

- ## likely root cause
- ## evidence
- ## next commands

## Step 3 — Verify and report

Check that the diagnosis has all three headings. If any heading is missing, say so and stop — do not fabricate a diagnosis.

If the diagnosis is complete, print it and append:

    Triage complete. Sub-skill used: <name>.
```

The dispatch table is the skill. The sub-skills do the actual debugging. The composite skill's only job is routing and verification. That makes it easy to test: you can test the routing logic independently of the debugging quality.

## when to use a subagent instead

Composite skills and subagents solve different problems. The line is simpler than people make it.

Use a **composite skill** when:
- The stages run in the same session and share context
- Each stage is a procedure the agent follows, not a separate reasoning task
- You want the whole pipeline in one report
- Total execution is under a few minutes

Use a **subagent** (via `delegate_task`) when:
- A stage needs its own context window because the input is large
- You want stages to run in parallel and you cannot express that as a skill
- A stage might take 10+ minutes and you do not want it blocking the main session
- You need true isolation — the stage should not see the parent's memory or skills

The release-readiness pipeline is a composite skill, not a subagent workflow, because the stages are fast, share the repo context, and produce one report. If I added a stage that runs a full benchmark suite (20 minutes), I would delegate that one stage to a subagent and keep the rest as a skill pipeline.

The rule I use: if a stage needs its own brain, give it one. If it just needs its own instructions, a skill is enough.

## wiring composite skills into cron

A composite skill in a cron job is where the pattern pays for itself. The cron job prompt is one line:

```json
{
  "schedule": "0 9 * * 1",
  "prompt": "Run the release-readiness pipeline on the current repository. If any stage blocks, send me the report. If all stages pass, send a one-line confirmation.",
  "skills": ["release-readiness"],
  "deliver": "origin"
}
```

The cron job does not need to know what the four stages are. It loads the skill, the skill loads its sub-skills, the pipeline runs. When I add a fifth stage — say, a license scan — I edit the composite skill. The cron job does not change.

This is the compounding effect. A well-built composite skill becomes the single entry point for a repeated job. You improve the pipeline by improving its parts, not by rewriting the job.

## the failure mode that will bite you

The one that gets people: a sub-skill changes its output format and the composite skill silently accepts garbage.

You updated `secret-scanner` to output `CLEAN` instead of `NO_SECRETS` because the new wording reads better in isolation. The composite skill checks for `NO_SECRETS`, does not find it, and reports `BLOCK: secret scan did not return expected result`. That is the good outcome — the pipeline fails loudly.

The bad outcome is when the composite skill does not check the output at all. It just says "load secret-scanner, then continue." Now the pipeline reports PASS on a release that has a secret in the diff, because the scanner changed its output and nobody noticed.

The fix is the stage contract and the test. The contract says the output must start with `NO_SECRETS` or `SECRETS_FOUND`. The test asserts the pipeline produces a report with verdicts. When the scanner changes its format, the test fails, the contract file tells you why, and you fix it before the pipeline ships a bad release.

This is why I said the test is the part that matters most. A composite skill without a test is a pile of assumptions. With a test, it is a pipeline you can trust at 3am on a Monday before a release.

## what to build next

Start with one composite skill that replaces something you do manually every week. The release-readiness pipeline is a good first target because the stages are already skills you probably have: test runner, git status check, diff scanner.

Write the orchestrator. Write the stage contract. Write the test. Run the test. When it passes, wire it into a cron job and stop doing the checklist by hand.

Then build the second one. The pattern compounds. Every sub-skill you write for the first pipeline is available to the second. After three composite skills, you have a library of composable procedures and the hard part is over.

The skills directory is code. Treat it like code: version it, test it, review the contracts when they change. The agent is the runtime. Your skills are the program.