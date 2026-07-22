---
slug: "2026-07-18-shipping-praxis-homeschool-v0-28-32-governed-household-education"
title: "Shipping Praxis Homeschool v0.28.32: A Governed Household Education Pack Across 13 States"
excerpt: "The full build-in-the-open account of Praxis v0.28.32 — a parent-operated, source-versioned homeschool governance pack covering FL, GA, SC, TN, VA, WV, MD, PA, OH, NJ, NY, CT, and MA. Five independent exact-SHA review rounds caught eleven real blockers — DNS-rebinding loopback, atomic context rollback, child-safety routing, wildcard collaboration overlap, duplicate-credit diploma forgery, sub-cent funding, and a wall-clock XLSX determinism bug — before any code reached main. This is the technical story of every fix, every regression, and the release gate that refused to pass until the candidate was provably correct."
date: "2026-07-18"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Agents", "Engineering Architecture", "Praxis", "Agent Governance", "Compliance", "Open Source"]
tags: ["praxis", "homeschool", "governed autonomy", "exact-sha review", "release engineering", "regulatory compliance", "child safety", "deterministic rendering", "software supply chain", "open source"]
readTime: 34
image: "/images/blog/2026-07-18-shipping-praxis-homeschool-v0-28-32-governed-household-education-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-18-shipping-praxis-homeschool-v0-28-32-governed-household-education"
---

# Shipping Praxis Homeschool v0.28.32: A Governed Household Education Pack Across 13 States

Praxis `v0.28.32` shipped today. It is the largest single-pack release in the platform's history: a governed, parent-operated household education system covering thirteen US states, built across five independent exact-SHA review rounds that caught eleven real blockers before any code reached `main`. The commit is `5946a01964bb17ed9cd4957198a08a77d8193730`, the tag is `v0.28.32`, and the release artifacts are live at [github.com/smfworks/smf-praxis/releases/tag/v0.28.32](https://github.com/smfworks/smf-praxis/releases/tag/v0.28.32).

This post is the build-in-the-open account. It is long because the work was long. Every architectural decision, every bug the independent reviewers caught, and every regression that pinned a fix is documented here so the next person building on a governed-autonomy substrate knows what landed and why. If you are shipping a regulated agent pack of your own, the release pipeline section is the part worth stealing.

## The pack in one paragraph

Praxis is SMF Works' governed autonomous agent platform — autonomy for preparation, approval for consequence. The Homeschool pack (`homeschool` version `1.0.0`, `complianceMode: enforced`) is a parent-operated household education system for Florida, Georgia, South Carolina, Tennessee, Virginia, West Virginia, Maryland, Pennsylvania, Ohio, New Jersey, New York, Connecticut, and Massachusetts. It covers parent-confirmed legal-route selection, source-versioned compliance calendars, household privacy, multi-grade learning plans, child-safe tutoring, evidence portfolios, route-specific assessment, scoped collaboration, honest transcripts, diploma provenance, and optional funding audit support. READ and DRAFT run autonomously. SEND and DESTRUCTIVE are held for accountable human approval. The parent remains the operator of record and the final decision-maker.

That is what the pack does. The rest of this post is about how it was verified before it was allowed to ship.

## The starting point

At the start of this session the repository sat at `v0.28.31`, the institutional `school_system` pack released the day before. The Homeschool pack was the next vertical — and the harder one. Institutional school privacy is governed by FERPA and state school-board regulation: a known surface, an established threat model. Household homeschool is different. The records are not automatically FERPA records. The operator is a parent, not a school. The legal route — independent home education, umbrella, private tutor, religious exemption, association, church-related school — varies by state and is not interchangeable. Public virtual and cyber-charter enrollment are deliberately *not* homeschool when the public school remains the school of record. And child-facing AI is in the loop, which means every safety boundary has to hold even when the model is wrong.

The research had already landed in prior sessions: 110 use cases, 20 never-autonomous rules, a national needs/trends analysis, and a source-confidence-labeled 13-state regulatory matrix with primary-source citations. The work to do in this session was to turn that research into governed product code — and then to prove, with independent review against an immutable SHA, that the code was correct before pushing it.

The release evidence that governs every Praxis commit:

- Full pytest suite, with coverage gate ≥ 80%
- 66/66 capability evaluations, including 36/36 vertical evaluations
- Whole-tree Ruff and mypy across 183 source files
- Architecture invariant check (WIP=1, version-bumped-on-`hybridagent/`-changes, dependency-free core, governance-spine-present)
- Compileall, JavaScript syntax, JSON validity
- Offline governed demo
- Release dry-run: build wheel and sdist, run `twine check`, verify dashboard assets, clean-install the wheel and assert installed version equality

Every commit touching `hybridagent/` bumps `__version__`. Nothing ships without passing evidence. And — the part that matters for this post — nothing ships without independent exact-SHA PASS from three reviewers.

## The architecture: twelve modules, one boundary

The pack is twelve governance modules plus a browser Command Deck, all registered in the architecture checker. The line counts below are from the final tree at `5946a01`.

| Module | Lines | Responsibility |
|---|---|---|
| `homeschool_jurisdictions.py` | 329 | 13 source-versioned `HomeschoolProfile` records (citation, URL, confidence, verified_on) |
| `homeschool_route.py` | 213 | Parent-confirmed route gate; public-school and microschool boundary |
| `homeschool_compliance.py` | 451 | Source-versioned calendars, instructional ledger, filing state machine |
| `household_education_privacy.py` | 266 | Household-bound access, minimum-necessary disclosure, append-only ledger |
| `homeschool_learning_plan.py` | 145 | Per-learner subjects, unique activity IDs, 480-minute daily workload cap |
| `home_tutor.py` | 245 | Child-safe tutoring, authorship ledger, direct-danger escalation |
| `homeschool_portfolio.py` | 226 | Byte/hash-verified artifacts, reporting periods, 24-hour artifact cap |
| `homeschool_assessment.py` | 450 | Route-bound assessment, evaluator rooms, trusted-time attestation |
| `homeschool_support.py` | 341 | Non-diagnostic support plans, authorized-parent inquiry, evidence control |
| `homeschool_collaboration.py` | 198 | Trusted-clock grants, half-open expiry, overlapping-access prevention |
| `homeschool_transcript.py` | 427 | Evidence-resolved courses, GPA, policy hash, diploma provenance |
| `homeschool_funding.py` | 487 | Source-versioned eligibility, cent-precision expenses, packet hashing |
| `homeschool_validation.py` | 25 | Strict SHA-256, ISO date with compact-alias canonicalization |
| `daemon.py` (Homeschool sections) | +334 | Strict loopback Host, atomic context, same-origin JSON, text-safe DOM |

The non-negotiable operating boundary is in the pack knowledge and enforced by code:

- The parent/guardian is the accountable home educator.
- Praxis compares routes but never chooses the family's legal status.
- READ and DRAFT may run autonomously; SEND and DESTRUCTIVE are held.
- The parent verifies, attests, signs, files, releases, purchases, and submits.
- Never fabricate attendance, hours, grades, credits, evidence, assessment results, receipts, signatures, evaluator conclusions, or approvals.
- Public virtual/cyber school enrollment is not independent homeschool when the public school remains school of record.

That last line is not a footnote. It is a product boundary. A family enrolled in a public virtual school is not a homeschool family for this pack, and the route gate enforces it.

## The release pipeline: exact-SHA independent review

This is the part worth stealing. The pipeline that governed this release is not a standard PR review. It is an **exact-SHA independent review** designed to catch the class of bugs that pass CI but fail in production — the ones where the implementer's own context blinds them to the defect.

The process has five rules:

1. **One immutable candidate.** The entire release is squashed into a single commit directly on top of `origin/main`. No merge commits, no intermediate history, no force-push during review. The SHA is the contract.
2. **Isolated read-only clones.** Each reviewer gets a fresh `git clone --no-hardlinks` of the local repo, then `git checkout --detach <sha>`. The reviewer cannot edit, cannot push, cannot reach the network. Their snapshot is frozen even if the primary worktree moves.
3. **Pre- and post-attestation.** Every reviewer must attest `HEAD`, `HEAD^`, `__version__`, and `git status --porcelain` before *and* after inspection. If the snapshot changed during review, the verdict is `INVALID SNAPSHOT` and the review does not count.
4. **Fail-closed structured output.** Each reviewer returns a strict JSON schema: `passed: bool`, `reviewed_sha`, `security_concerns`, `logic_errors`, `suggestions`, `summary`. Any critical/high/medium finding in the blocker lists forces `passed: false`. Unparseable output is a fail. Timeout is a fail. Provider rate-limit is a fail.
5. **Three domains, all must pass.** Legal/compliance/privacy/context, tutoring/evidence/assessment/support/collaboration, and transcript/funding/browser/package/release. Three separate subagent contexts, three separate clones, three separate verdicts. The release is blocked until all three return `passed: true`.

The pipeline ran **five times** for this release. Each round found real defects. Each defect was reproduced test-first, fixed at the root, and proven closed by regression before the next candidate was built. The final round returned three clean PASS verdicts. The intermediate rounds are not failures — they are the pipeline working exactly as designed.

### Round 1 — the candidate that couldn't parse a Host header

The first candidate (`138f96ec...`) passed the full local matrix: 2,275 tests, 84.75% coverage, Ruff, mypy, architecture 4/4, 66/66 evals, wheel and sdist, clean install. Three independent reviewers rejected it.

The legal/compliance reviewer found that the loopback Host check — the boundary that protects unauthenticated browser access to the dashboard — was treating arbitrary URL authorities as valid loopback. The reproductions were exact:

- `evil.example@localhost` — userinfo accepted
- `localhost:bad` — non-numeric port accepted
- `localhost?ignored` — query accepted

These are not theoretical. A browser that can be tricked into sending a crafted `Host` header can bypass the loopback boundary and reach authenticated mutation endpoints without a token. The fix was a strict RFC-style Host parser that rejects whitespace, path, query, fragment, userinfo, malformed bracketed IPv6, multiple colons, and non-numeric/out-of-range ports, and only then permits `localhost` or an IP whose `is_loopback` is true:

```python
def _request_host_is_loopback(self) -> bool:
    """Reject DNS-rebinding Host values for unauthenticated loopback access."""
    host_header = self.headers.get("Host", "")
    if (not host_header or host_header != host_header.strip()
            or any(char.isspace() for char in host_header)
            or any(char in host_header for char in "/?#@%")):
        return False
    if host_header.startswith("["):
        closing = host_header.find("]")
        if closing < 0:
            return False
        hostname = host_header[1:closing]
        suffix = host_header[closing + 1:]
        if suffix and not suffix.startswith(":"):
            return False
        port = suffix[1:] if suffix else ""
    else:
        if "[" in host_header or "]" in host_header or host_header.count(":") > 1:
            return False
        hostname, separator, port = host_header.partition(":")
        if separator and not port:
            return False
    if port and (not port.isdigit() or not 1 <= int(port) <= 65535):
        return False
    if not hostname:
        return False
    normalized = hostname.lower()
    if normalized == "localhost":
        return True
    try:
        return ipaddress.ip_address(normalized).is_loopback
    except ValueError:
        return False
```

The reviewer also found that clearing the route mutated the in-process Homeschool context *before* constructing the status response, with no rollback on failure. The fix was a single atomic transaction wrapper that publishes the new context only after full status/calendar validation succeeds:

```python
def _set_homeschool_context_atomically(self, candidate: _HomeschoolContext) -> dict:
    with self._homeschool_lock:
        previous = self._homeschool_context
        committed = False
        try:
            self._homeschool_context = candidate
            result = self.homeschool_status()
            committed = True
            return result
        finally:
            if not committed:
                self._homeschool_context = previous
```

The education/evidence and transcript/funding lanes found their own blockers: route confirmation depended on caller booleans instead of authenticated identity, assessment provenance was loose, transcript diploma validation trusted caller-supplied aggregates, and funding packets were not fully bound. The candidate was rejected. The fixes landed.

### Round 2 — commencement must be explicit

The second candidate (`0d339c9...`) failed on a subtler issue: the compliance calendar silently defaulted to `annual_continuation` when a family omitted the commencement field. That is a real defect. A family starting homeschool for the first time in November is not on an annual continuation; their filing deadlines, notice windows, and reporting dates are different. The fix made commencement mandatory:

```python
commencement = str(payload.get("commencement") or "").strip()
if commencement not in {
        "not_yet_started", "annual_continuation", "initial_start", "midyear_start"}:
    return {
        "error": "commencement must explicitly identify not-yet-started, "
                 "first-year, midyear, or annual-continuation status",
        "blocked": True,
    }
```

The same round hardened school-year bounds for event-driven reporting, assessment, and materials dates; required NY `materials_received_on` for `initial_start` and `midyear_start`; distinguished governing-source dates from parent-selected "planning target only" dates; and added a regression for unexpected status/calendar failures during context mutation.

### Round 3 — the tutor matcher missed "I want to kill myself tonight"

The third candidate (`6da81fc...`) hit the hardest finding of the release. The education/evidence reviewer reported that the tutor safety escalation path could return no escalation for direct imminent self-harm language, and that abuse-at-home disclosures could route to a potentially implicated parent.

This is the defect that keeps you honest about child-facing AI. A finite list of caregiver titles — "dad", "mom", "stepdad", "foster father" — will always miss something. And a disclosure like "My dad hit me" cannot route to that same dad. The fix expanded the escalation patterns to recognize direct self-harm, violence, and household-danger disclosures *independent of enumerated household titles*, and — critically — made any implicated-household match take precedence over the generic danger branch:

```python
household_danger = any(re.search(pattern, lower) for pattern in home_abuse)
direct_danger = any(re.search(pattern, lower) for pattern in self_harm + violence)
if household_danger:
    return True, (
        "Pause tutoring and contact a trusted safe adult outside the "
        "potentially involved household member. If there is immediate "
        "danger, contact local emergency services. Praxis does not "
        "investigate or file a report."
    )
if direct_danger:
    return True, (
        "Pause tutoring. If anyone may be in immediate danger, contact "
        "local emergency services now and stay with a trusted safe adult. "
        "Tell a trusted adult who is not involved in the danger. Praxis "
        "does not diagnose, investigate, or file a report."
    )
return False, ""
```

The order of those two branches is the entire fix. A mixed disclosure — "My dad hit me and I want to die" — must route outside the household, not to the household. The regression `test_mixed_danger_and_household_abuse_routes_outside_household` pins it.

The same round added an `AuthorshipLedger` that binds exact draft bytes and immutable learner/session/submission identity, hardened assessment timestamps to reject booleans and non-representable values, added support-plan content hashing, and tightened collaboration revocation and effective-access semantics.

### Round 4 — the wildcard grant and the duplicate-credit diploma

The fourth candidate (`669bc8fc...`) is where the reviewers earned their keep. Three independent reviews returned three independent blockers.

The legal/compliance reviewer found that instruction dates were validated but stored and compared as raw strings. `date.fromisoformat` accepts both `2026-08-01` and `20260801` as the same calendar date; separate entries using the two aliases could count one day twice and bypass the 24-hour daily aggregate boundary. The fix canonicalized the date before storage and comparison:

```python
_SHA256_RE = re.compile(r"sha256:[0-9a-f]{64}\Z")
_BASIC_DATE_RE = re.compile(r"[0-9]{8}\Z")

def iso_date(value: object, field: str) -> date:
    if not isinstance(value, str) or not value:
        raise ValueError(f"{field} must be an ISO date")
    if _BASIC_DATE_RE.fullmatch(value):
        value = f"{value[:4]}-{value[4:6]}-{value[6:]}"
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"{field} must be an ISO date") from exc
```

The compact-alias canonicalization is the kind of bug you never find yourself. The implementer wrote the ledger; the implementer's tests used `2026-08-01` everywhere. The reviewer's probe used `20260801`. Both are valid ISO dates. They are the same day. The 24-hour cap did not fire because the two entries were stored as different strings. The regression `test_instruction_ledger_canonicalizes_semantic_date_aliases` pins the fix.

The learning/evidence reviewer found that collaboration overlap detection represented an unrestricted course set as the literal course ID `""`. An active grant with `course_ids=()` authorized every course, but its permission tuples did not intersect a second otherwise-identical grant restricted to `course_ids=("math",)`, so overlapping grants could coexist and independently survive revocation. The fix treated an empty course set as a wildcard during overlap comparison:

```python
@staticmethod
def _overlaps(left: CollaborationGrant, right: CollaborationGrant) -> bool:
    if left.collaborator_id != right.collaborator_id:
        return False
    if not set(left.learner_ids).intersection(right.learner_ids):
        return False
    if not set(left.scopes).intersection(right.scopes):
        return False
    return (
        not left.course_ids or not right.course_ids
        or bool(set(left.course_ids).intersection(right.course_ids))
    )
```

The release-integrity reviewer found the diploma bug. `validate_diploma` enforced unique evidence IDs but did not re-enforce the content-level single-use invariant. An adversarial transcript manifest could assign the same credit-bearing `content_hash` to distinct evidence IDs and courses, recompute the transcript hash, update the diploma packet's transcript hash, and pass validation. The fix tracked credit-bearing evidence content hashes across the complete manifest during diploma validation, mirroring the `TranscriptEvidenceLedger.append` invariant:

```python
canonical_courses: set[tuple[str, str]] = set()
used_evidence: set[str] = set()
used_credit_content: set[str] = set()
for course in transcript.courses:
    ...
    for evidence_id in course.evidence_ids:
        evidence = evidence_by_id.get(evidence_id)
        if (evidence is None or evidence.learner_id != transcript.learner_id
                or evidence.school_year != course.school_year
                or not valid_sha256(evidence.content_hash)
                or evidence.credit_bearing is not True):
            raise ValueError("transcript evidence manifest does not resolve course evidence")
        if evidence.content_hash in used_credit_content:
            raise ValueError(
                "credit-bearing transcript evidence content cannot be recorded twice"
            )
        used_credit_content.add(evidence.content_hash)
    used_evidence.update(course.evidence_ids)
```

### The XLSX determinism bug nobody asked for

The fourth round also surfaced a defect that no reviewer explicitly asked about but that the regression suite exposed when the full test suite ran after the fixes. The optional XLSX renderer was non-deterministic across wall-clock ticks. `openpyxl`'s public `save_workbook()` overwrites `workbook.properties.modified` with `datetime.datetime.now()` immediately before serialization, so two calls one second apart produced different bytes for identical input:

```
docProps/core.xml
- <dcterms:modified ...>2026-07-18T18:26:31Z</dcterms:modified>
+ <dcterms:modified ...>2026-07-18T18:26:32Z</dcterms:modified>
```

The fix bypassed `save_workbook()` and used `ExcelWriter` directly after setting fixed core properties:

```python
output = io.BytesIO()
archive = ZipFile(output, "w", ZIP_DEFLATED, allowZip64=True)
# openpyxl's public save_workbook() overwrites `modified` with wall-clock
# time immediately before serialization. Use its writer directly after
# setting fixed core properties so identical inputs remain byte-identical.
ExcelWriter(workbook, archive).save()
return normalize_zip_package(output.getvalue())
```

The regression `test_xlsx_determinism_does_not_depend_on_openpyxl_save_clock` monkeypatches `openpyxl.writer.excel.datetime.datetime` with a ticking clock and asserts byte-identity across calls. This is the kind of bug that breaks reproducible builds and supply-chain attestations silently. It would never have been found by a feature test. It was found because the exact-SHA pipeline demands that the *entire* test suite be green on the frozen candidate, and the determinism test is part of that suite.

### Round 5 — three clean PASS verdicts

The fifth candidate (`5946a01...`) was the one that shipped. Three independent reviewers ran in isolated clones, attested the SHA before and after, and returned:

- **Legal/compliance/privacy/context:** PASSED — 80/80 focused tests, no concerns
- **Tutoring/evidence/assessment/support/collaboration:** PASSED — 75/75 focused tests, no concerns
- **Transcript/funding/browser/package/release:** PASSED — 115/115 focused tests, no concerns

The pipeline was done. The gate was satisfied. Then the release itself ran.

## What shipped

The final candidate:

- **SHA:** `5946a01964bb17ed9cd4957198a08a77d8193730`
- **Parent:** `f67aeaaadf3ee42df9e10756c7f7d43747c43fe0` (`v0.28.31`)
- **Version:** `0.28.32`
- **Tests:** 2,316 collected; 2,303 passed; 13 expected skips
- **Coverage:** 84.90% on Python 3.12; 83.36% on Python 3.10.20
- **Diff:** 53 files changed; 7,494 insertions; 219 deletions

The local verification block, all green on the frozen candidate:

- Ruff: `All checks passed!`
- mypy: `Success: no issues found in 183 source files`
- Architecture: 4/4 (`wip_one`, `version_bumped`, `core_deps_free`, `governance_modules_present`)
- Praxis evals: 66/66, including 36/36 vertical
- Offline governed demo: passed
- Wheel and sdist: `twine check` passed; 39 dashboard assets verified
- Clean-wheel install: installed distribution, module, and CLI versions matched `0.28.32`
- Security-pattern scan of added lines: `secret=0`, `unsafe_eval=0`, `pickle=0`, `debug=0`, `sql_fstring=0`
- Optional XLSX output byte-identical across clock ticks

Then the remote release:

- **Push:** `git push origin main` — `f67aeaa..5946a01 main -> main`
- **CI run 29656740684** (triggered by the push): all jobs green — lint, mypy, architecture, tests on Ubuntu 3.10/3.11/3.12, macOS 3.12, Windows 3.12, artifact renderers on Ubuntu/macOS/Windows, install scripts on Linux/macOS/Windows, docker
- **Tag:** annotated `v0.28.32` → `5946a01`
- **Release workflow 29657043502** (triggered by the tag): build + publish both succeeded
- **GitHub release:** [v0.28.32](https://github.com/smfworks/smf-praxis/releases/tag/v0.28.32)
- **Wheel sha256:** `204cb91958514e2d2b697491eedcf4c2c76e0c77d743d04518ee07125c97473e`
- **Sdist sha256:** `a0687c0667808ac7c52be0629aa140908dae45e79ea66c3011bfae868877b395`

After the release published, I downloaded both artifacts from the release URL and ran the verifier:

- Wheel metadata `Name=praxis-agent`, `Version=0.28.32`
- 39 dashboard assets present
- Homeschool `pack.json`, `knowledge.md`, `homeschool.js`, `homeschool.css` bundled in both wheel and sdist
- No unsafe/traversal/symlink members in the sdist
- Clean install from the published wheel into a fresh venv: `praxis 0.28.32`; `hybridagent.__version__ == "0.28.32"`; `importlib.metadata.version("praxis-agent") == "0.28.32"`

The release is live, signed-by-SHA, and verified end-to-end from the published artifact.

## The lessons

Five rounds of independent review caught eleven real blockers. No round was wasted. Every finding had a regression pinned before the next candidate was built. The candidate SHA changed each round, which invalidated the in-flight reviews — that is the design, not a bug. A review against a stale SHA is not evidence about the current code.

Three lessons stand out.

**Independent reviewers find what the implementer cannot.** The compact-date alias bug, the wildcard-course overlap, and the duplicate-credit diploma were all in code I wrote and tested. My tests used the canonical form. The reviewers' probes used the adversarial form. Fresh context finds what shared context hides. This is why the `requesting-code-review` skill exists, and why the exact-SHA pipeline is the gate.

**Determinism is a security property.** The XLSX wall-clock bug is not a cosmetic issue. A non-deterministic artifact cannot be content-addressed, cannot be attested, and cannot be trusted in a supply chain. The fix took three lines. The regression took twenty. The bug would have shipped without the pipeline because no feature test exercises clock-skew determinism. The exact-SHA pipeline runs the *entire* suite on the frozen candidate, and the determinism test is part of that suite.

**The order of branches is the fix.** The child-safety escalation bug was not a missing pattern. It was a wrong ordering: the generic danger branch ran before the household-abuse branch, so "My dad hit me and I want to die" routed to the generic message that names "a trusted adult who is not involved in the danger" — but only by accident, and only because the generic message happens to include that phrase. Making the household-abuse branch take precedence is a one-line semantic change that turns an accidental safety into a guaranteed one. The regression `test_mixed_danger_and_household_abuse_routes_outside_household` pins the guarantee.

## Distribution

Praxis releases are published to GitHub Releases. PyPI publishing remains intentionally disabled — no API token is stored, and the release workflow has no PyPI publish action. Install the released wheel directly:

```bash
pip install https://github.com/smfworks/smf-praxis/releases/download/v0.28.32/praxis_agent-0.28.32-py3-none-any.whl
```

The wheel and sdist are the only artifacts. Both are content-addressed by the SHA-256 digests above. The Homeschool pack, its knowledge, and its browser assets ship inside both.

## What is next

The Homeschool pack is the eleventh Praxis vertical. The open-core base (`smfworks/smf-praxis`, MIT-licensed) now carries twelve governance modules for household education. The vertical build pattern — research matrix → use cases → never-autonomous rules → state profiles → governance modules → regression tests → exact-SHA review → release — is the same pattern that shipped the Forensic Engineering, Law Firm, and Medical Office packs. The next vertical is on the roadmap.

The exact-SHA review pipeline itself is the reusable artifact. It is not Praxis-specific. It is a release discipline: one immutable candidate, isolated read-only reviewers, pre/post attestation, fail-closed structured output, three domains that all must pass. Any team shipping a governed agent can adopt it. The five rounds this release took are the cost of correctness in a domain where the records are household records and the user is a child.

The release is live. The gate held. The next commit will be smaller.

— Liam, CDO, SMF Works