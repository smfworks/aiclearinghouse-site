---
slug: "2026-07-16-hermes-repo-doctor-oneshot-terminal-automation"
title: "Build a Hermes Repo Doctor: One-Shot Terminal Triage with Bounded Context"
excerpt: "Turn Hermes into a repeatable terminal diagnostic: capture a failing test, bound the context, get a verified fix brief, and record token usage."
date: "2026-07-16"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "Developer Tools", "Terminal Automation", "Debugging"]
tags: ["hermes", "terminal-automation", "oneshot", "debugging", "bash", "git", "developer-workflow"]
readTime: 11
image: "/images/blog/2026-07-16-hermes-repo-doctor-oneshot-terminal-automation-hero.png"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-16-hermes-repo-doctor-oneshot-terminal-automation"
---

A failing test is rarely the expensive part of debugging. The expensive part is assembling the evidence: the exact command, its exit code, the useful end of the traceback, the dirty files, and the diff that may have caused the regression. I watch developers paste those pieces into an agent one at a time, then spend another turn correcting assumptions the agent made between pastes.

I wanted a single command instead:

```bash
hermes-repo-doctor -- python -m pytest -q tests/unit/test_auth.py
```

That command should run the test, capture a bounded slice of repository state, ask Hermes for a diagnosis, reject a malformed answer, and leave two artifacts behind:

- `.hermes/repo-doctor.md` — the fix brief
- `.hermes/repo-doctor-usage.json` — model, token, cost, and completion metadata

The tool below does exactly that. I ran it against a real Git fixture with a deliberately broken `add()` function before publishing this article. Hermes identified the changed operator, cited the assertion, and returned three focused verification commands in one API call.

This is a terminal automation pattern, not a prompt trick. The shell controls evidence collection, isolation, limits, and validation. Hermes does the part a model is good at: turning a small evidence packet into a ranked hypothesis.

## why use one-shot mode

Hermes has two useful command-line modes for coding work.

Interactive `hermes` is the right tool when you want a long session, follow-up questions, tool calls, and edits. `hermes --oneshot` (short form: `hermes -z`) is built for scripts and pipes. It prints only the final response to stdout. No banner, spinner, tool previews, or session footer. The `--usage-file` option writes a JSON receipt even when the run fails.

You can confirm both options on your installed version:

```bash
hermes --help | grep -E -- '--oneshot|--usage-file'
```

One detail matters: one-shot mode bypasses approval prompts because it is meant to run without a TTY. Do not point it at an untrusted repository with the full terminal toolset and hope the prompt behaves. The repo doctor runs Hermes from a temporary directory and selects the `safe` toolset, which has no terminal access. The model gets copied evidence, not a writable checkout.

That separation is the core design:

1. Bash runs the test and reads Git state.
2. The script truncates large inputs before model inference.
3. Hermes diagnoses from the captured packet in a temporary directory.
4. Python validates the report contract before the command succeeds.

## install the repo doctor

Save this as `~/.local/bin/hermes-repo-doctor`:

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

usage() {
  cat <<'EOF'
Usage: hermes-repo-doctor -- <test command> [args...]
Example: hermes-repo-doctor -- python -m pytest -q tests/unit
EOF
}

if [[ "${1:-}" != "--" || $# -lt 2 ]]; then
  usage >&2
  exit 64
fi
shift
test_cmd=("$@")

for dep in git hermes python3 timeout; do
  command -v "$dep" >/dev/null || {
    printf 'missing dependency: %s\n' "$dep" >&2
    exit 69
  }
done

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "run this inside a Git repository" >&2
  exit 69
}
cd "$root"

out_dir="$root/.hermes"
mkdir -p "$out_dir"
report="$out_dir/repo-doctor.md"
usage_json="$out_dir/repo-doctor-usage.json"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/hermes-repo-doctor.XXXXXX")
trap 'rm -rf "$tmp"' EXIT

max_chars=${HERMES_DOCTOR_MAX_CHARS:-24000}
test_timeout=${HERMES_DOCTOR_TEST_TIMEOUT:-180}

printf '%q ' "${test_cmd[@]}" > "$tmp/test-command.txt"
printf '\n' >> "$tmp/test-command.txt"
git status --short --branch > "$tmp/git-status.txt"
git log -5 --oneline > "$tmp/git-log.txt"
git diff --stat > "$tmp/diff-stat.txt"
git diff --no-ext-diff --unified=3 \
  | head -c "$max_chars" > "$tmp/diff.patch" || true

set +e
timeout "$test_timeout" "${test_cmd[@]}" > "$tmp/test-full.log" 2>&1
test_rc=$?
set -e
tail -c "$max_chars" "$tmp/test-full.log" > "$tmp/test-tail.log"

{
  cat <<EOF
You are diagnosing one failing test run. Work only from the captured evidence below.
Do not edit files, call tools, or invent missing output.

Return Markdown with exactly these headings:
## likely root cause
## evidence
## next commands
## stop conditions

Rules:
- Name one primary hypothesis and at most one alternative.
- Cite exact filenames, symbols, or error lines from the evidence.
- Under "next commands", give 1-4 shell commands in execution order.
- Commands must gather evidence or run a focused test. Do not include destructive commands.
- Under "stop conditions", say what result would falsify the primary hypothesis.

Test exit code: $test_rc

### test command
EOF
  cat "$tmp/test-command.txt"
  printf '\n### git status\n'
  cat "$tmp/git-status.txt"
  printf '\n### recent commits\n'
  cat "$tmp/git-log.txt"
  printf '\n### diff stat\n'
  cat "$tmp/diff-stat.txt"
  printf '\n### bounded diff\n```diff\n'
  cat "$tmp/diff.patch"
  printf '\n```\n\n### bounded test output (last %s bytes)\n```text\n' "$max_chars"
  cat "$tmp/test-tail.log"
  printf '\n```\n'
} > "$tmp/prompt.md"

(
  cd "$tmp"
  hermes --oneshot "$(cat "$tmp/prompt.md")" \
    --usage-file "$usage_json" \
    --toolsets safe \
    --ignore-rules
) | tee "$report"

python3 - "$report" <<'PY'
from pathlib import Path
import sys

text = Path(sys.argv[1]).read_text(encoding="utf-8")
required = (
    "## likely root cause",
    "## evidence",
    "## next commands",
    "## stop conditions",
)
missing = [heading for heading in required if heading not in text.lower()]
if len(text) < 200 or missing:
    raise SystemExit(
        f"invalid Hermes report; missing={missing}, chars={len(text)}"
    )
print(f"verified report: {sys.argv[1]} ({len(text)} chars)")
PY

printf 'test exit code: %s\n' "$test_rc"
printf 'usage receipt: %s\n' "$usage_json"
```

Make it executable:

```bash
chmod +x ~/.local/bin/hermes-repo-doctor
```

If `~/.local/bin` is not already on your path:

```bash
printf '\nexport PATH="$HOME/.local/bin:$PATH"\n' >> ~/.bashrc
source ~/.bashrc
```

The script takes the test command after a literal `--`. That is deliberate. It stores the command as a Bash array and executes `"${test_cmd[@]}"`. There is no `eval`, so spaces and quoted arguments stay arguments instead of turning into a second shell program.

## run it on a controlled failure

You can test the whole path in a disposable repository. This fixture commits a correct function, changes `+` to `-`, then asks the repo doctor to diagnose the failure.

```bash
work=$(mktemp -d)
cd "$work"
git init -q
git config user.name "Repo Doctor Test"
git config user.email "repo-doctor@example.invalid"
git config commit.gpgSign false

cat > calc.py <<'PY'
def add(left: int, right: int) -> int:
    return left + right
PY

cat > test_calc.py <<'PY'
from calc import add

assert add(2, 3) == 5, f"expected 5, got {add(2, 3)}"
print("ok")
PY

git add calc.py test_calc.py
git commit -q -m "fixture: working calculator"
python3 - <<'PY'
from pathlib import Path
p = Path("calc.py")
p.write_text(p.read_text().replace("left + right", "left - right"))
PY

hermes-repo-doctor -- python3 test_calc.py
```

My verification run returned this primary diagnosis:

```markdown
## likely root cause

The uncommitted change in `calc.py` introduced a regression in `add`: it now
subtracts `right` from `left` instead of adding them.

## evidence

- `git status` shows `calc.py` is modified: `M calc.py`.
- The bounded diff changes `add` from `return left + right` to `return left - right`.
- The exact failure is `AssertionError: expected 5, got -1`, which matches `2 - 3`.
```

The run used one model call. Its usage receipt recorded 3,966 input tokens, 213 output tokens, the selected model and provider, and `completed: true`. Your numbers will differ because your Hermes config and repository evidence differ. The point is that you get a receipt you can inspect instead of treating agent cost as fog.

## what each guardrail is doing

The script is longer than a clever pipe because clever pipes are where debugging automation starts lying to you.

### it preserves the test result

`set -e` normally kills a script when the test fails. A repo doctor expects failure, so it temporarily disables that behavior, captures `$?`, then enables it again:

```bash
set +e
timeout "$test_timeout" "${test_cmd[@]}" > "$tmp/test-full.log" 2>&1
test_rc=$?
set -e
```

Exit code `124` means GNU `timeout` stopped the test. That is useful evidence. A hung integration test and an assertion failure are different bugs.

### it bounds noisy context before inference

A full test log can be megabytes. A generated lockfile diff can be worse. Sending all of it costs tokens and often lowers diagnostic quality because the useful traceback is buried.

The defaults are intentionally asymmetric:

- Diff: first 24,000 bytes, where file headers and changed hunks begin.
- Test log: last 24,000 bytes, where Python, Node, and Rust usually print the final failure and summary.
- Git log: five commit subjects.

You can raise or lower the limit without editing the script:

```bash
HERMES_DOCTOR_MAX_CHARS=48000 \
HERMES_DOCTOR_TEST_TIMEOUT=300 \
hermes-repo-doctor -- npm test -- auth
```

This is a byte limit, not a token limit. It is crude and predictable. For a local developer tool, predictable wins.

### it separates collection from reasoning

Hermes runs inside `$tmp`, not the repository. The selected `safe` toolset excludes terminal access. `--ignore-rules` also prevents repository instructions, personal memory, and preloaded skills from changing the report contract for this isolated pass.

The model only needs the prompt packet. Giving it terminal access during diagnosis would collapse two phases — evidence gathering and code modification — back into one opaque action. I want the report first. I decide whether to start an editing session after reading it.

### it validates structure, not truth

The Python check cannot prove the hypothesis is correct. It can prove the response is non-empty and has the sections the next step expects. That distinction matters.

Validation catches provider errors, truncated replies, conversational filler, and output that ignored the contract. Truth still comes from the `next commands` and `stop conditions`. A useful diagnosis must tell you how to falsify it.

## wire it into your normal workflow

Add the generated files to `.gitignore` unless your team wants diagnostic briefs committed:

```gitignore
.hermes/repo-doctor.md
.hermes/repo-doctor-usage.json
```

A Make target gives the team one stable entry point:

```make
.PHONY: doctor-auth
doctor-auth:
	@hermes-repo-doctor -- python -m pytest -q tests/unit/test_auth.py
```

Now the command is the same on every machine:

```bash
make doctor-auth
```

For a JavaScript project:

```bash
hermes-repo-doctor -- npm test -- --runInBand src/auth
```

For Rust:

```bash
hermes-repo-doctor -- cargo test auth::token::tests -- --nocapture
```

For Go:

```bash
hermes-repo-doctor -- go test ./internal/auth -run TestRefreshToken -count=1
```

Do not run the entire test suite by habit. The doctor is strongest when the command reproduces one failure. Focused commands make the evidence packet smaller and the stop condition sharper.

## add a token budget gate

The usage file is regular JSON, so CI or a local wrapper can reject unexpectedly large diagnostic runs:

```bash
python3 - <<'PY'
import json
from pathlib import Path

usage = json.loads(Path(".hermes/repo-doctor-usage.json").read_text())
if not usage.get("completed") or usage.get("failed"):
    raise SystemExit("Hermes did not complete the diagnostic")
if usage.get("total_tokens", 0) > 12_000:
    raise SystemExit(f"diagnostic exceeded token budget: {usage['total_tokens']}")
print(
    f"{usage['model']}: {usage['total_tokens']} tokens, "
    f"${usage.get('estimated_cost_usd', 0):.4f} estimated"
)
PY
```

A budget gate will not make the diagnosis better. It will tell you when context capture has drifted. If a focused test suddenly needs 40,000 tokens, inspect what the shell is collecting before blaming the model.

## keep diagnosis and repair as two commands

Once the brief looks sound, start an interactive Hermes session for the repair:

```bash
hermes chat --checkpoints --skills systematic-debugging
```

Then tell it:

```text
Read .hermes/repo-doctor.md. Re-run the first evidence-gathering command.
If the primary hypothesis survives, make the smallest fix and run the focused test.
Do not change unrelated files.
```

`--checkpoints` gives you `/rollback` for filesystem changes. Loading `systematic-debugging` makes the repair session follow a root-cause-first workflow. The repo doctor stays read-only; the repair session is explicitly allowed to edit.

That boundary is the part worth keeping. A terminal agent is most reliable when the shell owns deterministic work and the model owns judgment under a narrow contract. Capture the facts in code. Bound them before inference. Require a falsifiable answer. Only then hand Hermes the wrench.
