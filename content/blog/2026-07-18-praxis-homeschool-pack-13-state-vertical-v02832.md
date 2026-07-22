---
slug: "2026-07-18-praxis-homeschool-pack-13-state-vertical-v02832"
title: "Shipping Praxis Homeschool Pack v0.28.32: 13-State Household Education Governance, Parent-Confirmed Routes, and the Four-Review Hardening Loop"
excerpt: "Build-in-the-open account of the Praxis homeschool vertical: 110 household use cases, 20 never-autonomous rules, 13-state route/source registry, parent-operated compliance, child-safe tutoring, evidence portfolios, scoped collaboration, transcript/diploma provenance, optional funding audit support, and a four-round independent-review hardening loop that caught real defects — shipped as v0.28.32 with 66/66 evals and 36/36 vertical evals."
date: "2026-07-18"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Open Source", "Compliance", "Education"]
tags: ["praxis", "homeschool", "household-education", "13-state", "vertical-packs", "open-source", "agent-governance", "K-12", "child-safety", "evidence-ledger", "independent-review", "release-engineering"]
readTime: 34
image: "/images/blog/2026-07-18-praxis-homeschool-pack-13-state-vertical-v02832-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-18-praxis-homeschool-pack-13-state-vertical-v02832"
---

This is the build-in-the-open account of shipping **Praxis v0.28.32** — the public, MIT-licensed `homeschool` vertical pack for parent-operated K–12 household education across thirteen US states. It covers the use-case catalog, the 13-state route/source registry, twelve governance modules, four implementation sessions, the four-round independent exact-SHA review loop that caught real defects, and the release verification that put wheel + sdist on GitHub Releases.

The post is long because household education AI fails closed or it does not ship. Parents are already using generative tools to draft learning plans, portfolios, transcripts, and evaluator narratives at scale. Families that deploy agents against their own children's education records need household-owned privacy, route-specific compliance, hard lines around the parent as operator of record, and child-safety escalation that does not route a disclosure back into the household that caused it — not a chatbot with a school-themed system prompt.

**Release:** [v0.28.32 on smfworks/smf-praxis](https://github.com/smfworks/smf-praxis/releases/tag/v0.28.32)
**SHA:** `5946a01964bb17ed9cd4957198a08a77d8193730`
**Tag:** `v0.28.32` → `14c5c88fdea9eea418914d89339241ae7560e45d`
**Evals at ship:** 66/66 · vertical 36/36 · mypy clean across 183 source files · architecture 4/4
**CI at ship:** success across Linux/Windows/macOS × Python 3.10/3.11/3.12, lint, artifact-renderers, install scripts, docker

---

## Starting point

The day before, we shipped **v0.28.31** — the institutional `school_system` pack for districts and schools. The substrate underneath already carried forensic engineering, the `law_firm` pack, the `medical_office` pack, and the governance broker: **READ/DRAFT autonomous; SEND/DESTRUCTIVE held for human approval**.

Praxis had three education-adjacent surfaces that looked tempting to overload and would have been a product mistake:

| Template | Operator | Posture | Audience |
|---|---|---|---|
| `education` | Tutor / instructional aide | **autonomous** | Learner-facing help |
| `homeschool` (existing) | Parent-educator | **autonomous** | Household multi-grade portfolios |
| `school_system` (shipped v0.28.31) | Licensed staff + LEA | **enforced** | Districts, schools, SPED teams |

The existing `homeschool` template was a light autonomous tutor-style pack. Michael's ask was explicit: research **all the ways** an agent like Praxis could be used in household-operated home education, produce an exhaustive use-case set, then research the **same thirteen states** used for law firm, medical, and school-system work — FL, GA, SC, TN, VA, WV, MD, PA, OH, NJ, NY, CT, MA — for laws and regulations that would impact the product, draw up the proposal for a governed Homeschool vertical, and ship it as a **parent-operated, `enforced` pack** distinct from the autonomous tutor template and from institutional school governance.

Research first. Then build. Then ship. Then subject the frozen candidate to four rounds of independent exact-SHA review and ship only when every domain passes.

---

## Research method

### Use cases first

We did not start with statutes. We started with jobs-to-be-done for the household: the parent-educator, the co-parent, the learner, the tutor, the co-op, the umbrella administrator, the evaluator, the portfolio reviewer, the scholarship/ESA program, and the prospective transcript recipient.

The catalog landed at **110 concrete use cases** across:

- Route selection and legal-status boundaries
- Annual notice, filing, and renewal
- Compliance calendars, attendance, and instruction ledgers
- Multi-grade learning plans and subject coverage
- Child-safe tutoring, authorship, and assessment integrity
- Portfolios, work samples, and annual archives
- Annual assessments, evaluator rooms, and result provenance
- Learner support (non-IEP) and public-service inquiries
- Scoped collaboration with tutors, co-ops, co-parents, evaluators, umbrellas
- Transcripts, GPA, diploma provenance, and recipient verification
- Optional scholarship/ESA funding, expense ledgers, and reimbursement audit
- Privacy, household data boundaries, sibling isolation, and disclosure
- External access (portal, agency, recipient) under parent authority

Each use case carries actor, autonomy class (READ/DRAFT/SEND/DESTRUCTIVE), data sensitivity (household / education record / health / special-ed-support / funding), value, and risk.

And a hard list of **twenty absolute rules** — things Praxis must never do autonomously. Among them:

- No autonomous legal-route decision for the family
- No autonomous filing, submission, or external send
- No fabrication or backfill of attendance, hours, work samples, grades, credits, signatures, evaluator conclusions, or receipts
- No autonomous assessment result, evaluator conclusion, or diploma issuance
- No autonomous funding eligibility, expense approval, or reimbursement submission
- No autonomous disclosure of household or learner data
- No public virtual/cyber enrollment represented as parent-operated homeschool
- No microschool administration collapsed into household homeschool
- No child-facing AI that is not parent-visible, age-appropriate, authorship-preserving, and safety-constrained
- No household records automatically represented as FERPA records
- No training foundation models on identifiable household data by default
- No biometric, affective, or behavioral scoring of children as a product feature
- No disclosure of a child's disclosure to an implicated household adult

Artifacts: `workspace/research/homeschool-use-cases.md`, `workspace/research/homeschool-never-autonomous-rules.md`.

### Then the same 13 states

Three parallel research batches, same discipline as the medical, law-firm, and school-system work: primary statute retrieval where curl works, archive.org when Cloudflare blocks, **never invent statute numbers**, flag ESTABLISHED KNOWLEDGE — verify when blocked. Every state entry carries a `confidence` field (`primary_source` | `mixed` | `established_knowledge`) and a `verified_on` date so product code can distinguish law from agency recommendation from unresolved research.

| Batch | States | File |
|---|---|---|
| 1 Southeast | FL GA SC TN VA | `homeschool-reg-research-batch1-southeast.md` |
| 2 Mid-Atlantic | WV MD PA OH NJ | `homeschool-reg-research-batch2-midatlantic.md` |
| 3 Northeast | NY CT MA | `homeschool-reg-research-batch3-northeast.md` |

Primary-source route and compliance facts that actually drove product design:

| State | Routes encoded | Source |
|---|---|---|
| **FL** | `independent_home_education`, `private_school_umbrella`, `pep_scholarship` | Fla. Stat. §1002.41 (2025) |
| **GA** | `home_study` | O.C.G.A. §§20-2-690, 20-2-690.1; GA DOE July 2025 guidance |
| **SC** | `option1_district`, `option2_scaihs`, `option3_association` | S.C. Code §§59-65-40, -45, -47 |
| **TN** | `independent_home_school`, `church_related_school` | Tenn. Code Ann. §§49-6-3050, 49-50-801; TDOE *Independent Home School Requirements* (Oct 2023) |
| **VA** | `home_instruction`, `religious_exemption` | Va. Code §§22.1-254.1, 22.1-254(B) |
| **WV** | `board_approved`, `notice_home_instruction`, `hope_individualized`, `learning_pod` | W. Va. Code §18-8-1 (2026) |
| **MD** | `local_supervision`, `nonpublic_supervision` | COMAR 13A.10.01 |
| **PA** | `home_education`, `private_tutor` | 24 P.S. §§13-1327, 13-1327.1; PA DOE guide rev. May 2026 |
| **OH** | `home_education` | Ohio Rev. Code §3321.042; Ohio DOE current guidance |
| **NJ** | `equivalent_instruction_elsewhere` | N.J.S.A. 18A:38-25; NJ DOE Homeschool FAQ |
| **NY** | `home_instruction` | 8 NYCRR §100.10 |
| **CT** | `equivalent_instruction_elsewhere` | Conn. Gen. Stat. §10-184; C-14/state guidance |
| **MA** | `home_instruction_approved` | M.G.L. c.76 §1; *Care & Protection of Charles*, 399 Mass. 324; *Brunelle*, 428 Mass. 512 |

Two product boundaries came straight out of the research and were never negotiable:

1. **Public virtual/cyber enrollment is not parent-operated homeschool.** The public school remains the school of record; the parent is not the operator of record. Praxis refuses to label it as such.
2. **Microschool administration is not household homeschool.** WV explicitly separates microschool administration from the household pack's scope. The same boundary applies everywhere.

### The proposal

`workspace/research/homeschool-praxis-proposal.md` upgraded the existing `homeschool` template from an autonomous tutor to a governed, parent-operated, `enforced`-mode pack. Twelve gaps, ordered like medical and school-system: registry first, then route selection, then compliance, then privacy, then learning plans, then tutoring, then portfolios, then assessments, then support, then collaboration, then transcript/diploma, then funding — and pack assembly with a vertical eval suite last.

Open-core split stays the same as Praxis everywhere else: **general household education governance in public MIT**; SIS connectors, paid household workflows, and scholarship/ESA integrations stay private later.

---

## Architecture analogy (school_system → homeschool)

If you read the school_system post, the mapping is close — but with a critical inversion. The institutional pack governs *staff acting on student records under district authority*. The household pack governs *a parent acting on their own household's records under their own authority*. That inversion changes almost every privacy and authorization decision.

| School system (v0.28.31) | Homeschool (v0.28.32) |
|---|---|
| `EducationProfile` (institutional) | `HomeschoolProfile` (household route/source) |
| FERPA disclosure ledger | **Household-owned** disclosure ledger |
| Staff role authorization | **Authenticated household + parent + learner** authorization |
| Educator attestation | Parent attestation (parent is operator of record) |
| SPED draft-not-decide | Learner support (non-IEP) draft-not-diagnose |
| Academic-integrity gate | Child-safety escalation + authorship ledger |
| District parent triage | Household Command Deck with strict loopback Host parsing |
| NY 2-d ceiling (strictest operator privacy) | Household privacy: no FERPA by default, no profiling, no model training |
| Mandated reporter remind-only | Tutor danger escalation routes **outside** the implicated household |

The product thesis is the same Praxis posture everywhere: **autonomy for preparation, approval for consequence.** But the *who approves* is different. In `school_system`, the approver is a licensed professional. In `homeschool`, the approver is the parent — and the parent is also the operator of record. The system exists to help the parent operate, not to decide for them, and never to route a child's disclosure back to an adult in the household who may be the source of harm.

---

## Session 1 — foundation

### H1 — `HomeschoolProfile` registry (`homeschool_jurisdictions.py`)

A frozen dataclass per state under `hybridagent/homeschool_jurisdictions.py`, loaded via `get_homeschool_profile(state)`. Fields encode the route tuple, default route, compulsory age range, initial-notice window, annual-notice date, approval-required flag, parent qualification bar, required subjects, instruction days/hours, portfolio requirement and retention, progress-report cadence, assessment frequency and grades, assessment submission date, diploma note, source citation, source URL, confidence level, verification date, and state-specific notes.

The route tuple is the heart of the pack. Every downstream module branches on `profile.routes` and on the parent-confirmed route — never on a guessed default.

Divergence pins in tests (the kind of assertions that prevent silent registry drift):

- **FL** is the only state with three routes (`independent_home_education`, `private_school_umbrella`, `pep_scholarship`)
- **SC** has three options with a 50-member association floor on Option 3
- **TN** separates independent home school from church-related umbrella and refuses to treat accredited online school as homeschool
- **VA** separates home instruction from religious exemption — religious exemption is not a home-instruction sub-checklist
- **WV** has four routes and explicitly excludes microschool administration
- **PA** is the only state with both a 900/990-hour floor and an annual qualified-evaluator report to the superintendent
- **NY** carries IHIP, four quarterly reports, annual assessment, and explicit "home instruction does not produce a New York public-school diploma"
- **MA** is the only state with `approval_required=True` (local approval in advance, per *Charles* and *Brunelle*)

Every profile carries `source_citation`, `source_url`, `confidence`, and `verified_on`. The registry is the single source of truth for every downstream module.

### H2 — Parent-confirmed route selection (`homeschool_route.py`)

`classify_route(state, request)` returns a route classification, but `confirm_route(state, route, parent_id)` is the gate. Praxis compares routes, surfaces the parent's options, and refuses to choose the family's legal status.

Three product boundaries are enforced in code:

1. **Public-school conflict** — if the learner is enrolled in a public virtual/cyber program, the public school is the school of record and Praxis refuses to label the household as parent-operated homeschool.
2. **Microschool exclusion** — microschool administration is a separate product boundary and is not household homeschool.
3. **Route normalization** — the parent's confirmed route must match one of `profile.routes` exactly; no fuzzy matching, no default-route fallback when the parent has not confirmed.

The migration gate records the parent's confirmation identity, the route, the date, and the source version. Reopening a route requires a new confirmation; the old one is preserved in the ledger.

### H3 — Compliance calendar, instruction ledger, filing gate (`homeschool_compliance.py`)

`build_compliance_calendar(profile, route, commencement)` produces a route-specific calendar. Two early defects in this module drove the hardest review findings in the whole build:

1. **Commencement must be explicit.** The first version silently defaulted to `annual_continuation` when commencement was omitted. That let a brand-new household get a continuation calendar with no start-of-year anchor. The fix made commencement mandatory and added a regression that asserts a missing commencement raises.
2. **School-year bounds.** Parent-selected reporting, assessment, and materials-received dates must fall inside the anniversary-correct school year. A date outside the window — including leap-day edge cases — must be rejected, not silently snapped.

`FilingRegistration` is a state machine: `draft → parent_approved → submitted → receipt_recorded`. Each transition binds the household, the authorized parent, the route decision, and the source version. Filings are never auto-submitted; `submit_filing` requires parent approval and returns a draft, not a send.

`InstructionLedger` records canonical instruction entries: learner, date, subject, minutes, activity ID, and source. Replay and semantic-duplicate rejection prevent the same activity ID or the same (learner, date, subject, minutes) tuple from being counted twice. Per-learner daily workload is capped at 480 minutes — a household can tutor for eight hours, but the ledger will not overcount.

### H4 — Household privacy and disclosure (`household_education_privacy.py`)

The privacy module is where the household inversion becomes concrete. Household records are **not** FERPA records by default. The disclosure ledger records only lawful disclosures after purpose, household, learner, recipient, parent identity, data class, and exact permitted fields all match.

The module enforces:

- **Authenticated household + parent + learner access** — role labels alone are never authorization. A "parent" string is not authorization; an authenticated parent identity bound to the household and the learner is.
- **Minimum-necessary disclosure** — a disclosure request must specify the exact permitted fields, not "all education records."
- **Purpose binding** — education_delivery and education_administration purposes pass; commercial, model_training, and targeted_advertising always fail closed.
- **Sibling isolation** — a parent authorized for learner A does not automatically get learner B's records.
- **Collection bans** — biometric, affective, political, religious profiling all fail closed.
- **Model training** — training foundation models on identifiable household data is off by default and must be explicitly enabled by the parent.

A `DisclosureEvent` carries `disclosed_at` as a canonical trusted timestamp (strict scalar validation — see H12). The ledger is append-only and replay-resistant.

### H12 — Strict scalar validation (`homeschool_validation.py`)

Shared validators used by every governance module:

- `validate_sha256(digest)` — strict lowercase `sha256:` prefix plus exactly 64 hexadecimal characters. No mixed case, no truncated hashes, no bare hex.
- `validate_iso_date(date_str)` — strict ISO 8601 date. No partial dates, no timezone offsets on dates.
- `validate_timestamp(ts)` — strict representable timestamp. Rejects booleans, non-finite floats, and finite-but-non-representable values that round-trip through `datetime` incorrectly.
- `validate_scalar(value, type_)` — strict scalar type check that rejects truthy strings (`"false"`, `"yes"`) where booleans are required.

The strict-scalar validator is the one that catches the most review findings. A truthy string is not a parent approval. `"false"` is not `False`. Every approval, attestation, and authorization in the pack goes through this validator.

---

## Session 2 — learning, safety, evidence

### H5 — Child-safe tutoring and authorship (`home_tutor.py`)

`assess_tutor_request(request)` is the gate. Every tutoring request carries `parent_visible` (mandatory `True`), `age_appropriate`, and the learner identity. The module enforces:

- **Parent visibility required** — a tutoring session that is not parent-visible is blocked.
- **Age-appropriate content** — content flagged as not age-appropriate is blocked.
- **Source validation** — tutoring materials must come from approved sources.
- **Authorship ledger** — every draft the learner produces is bound to exact bytes, a SHA-256 hash, the trusted learner identity, the session identity, and the submission identity. The ledger is immutable. Relabel and replay are rejected.

#### The tutor safety defect that round-one review caught

The first independent review found a real child-safety defect. The tutor safety matcher recognized a finite list of caregiver titles ("mom", "dad", "uncle", "grandfather"). The escalation logic routed a disclosure like "my uncle kicked me" to the parent as the responsible adult.

But the disclosure implicated an adult *in the household*. Routing it back to the parent — who might be the same adult, or might be partnered with the adult — is unsafe.

The fix had two parts:

1. **Conservative direct-harm escalation** — direct self-harm language ("I want to kill myself tonight"), violence threats ("she threatened to kill me"), and household-danger disclosures trigger `pause_for_immediate_human_help` regardless of whether a caregiver title appears. The escalation does not depend on a finite keyword list.
2. **Implicated-household routing** — when a disclosure names an adult in the household, the escalation routes *outside* the household — to emergency services or a mandated reporter — not to the implicated adult.

The regression suite now includes hostile cases for each of these. The phrase "I want to kill myself tonight" is a literal test case. The phrase "My uncle kicked me" is a literal test case. The escalation path is asserted, not inferred.

### H6 — Learning plans (`homeschool_learning_plan.py`)

`build_learning_plan(profile, route, learners)` produces a multi-grade plan that covers the parent-confirmed route's required subjects. Each plan entry carries a unique activity ID and a subject. Two defects in this module drove review findings:

1. **Empty-content rejection** — a plan with empty activity IDs or empty subjects is rejected, not silently accepted.
2. **Per-learner daily workload cap** — a single learner's planned daily workload is capped at 480 minutes. The cap is per-learner, not per-household, so siblings do not borrow each other's minutes.

### H7 — Portfolios (`homeschool_portfolio.py`)

`build_portfolio(profile, route, learner, artifacts)` assembles an evidence-backed portfolio. Each artifact carries bytes, a SHA-256 digest, a reporting period, and a parent attestation. The module enforces:

- **Byte-backed evidence** — every artifact must have bytes and a digest that matches the bytes. A bare hash from a caller is not accepted.
- **Reporting-period bounds** — artifacts must fall inside the reporting period. Future-dated and out-of-period artifacts are rejected.
- **24-hour artifact cap** — a single artifact cannot claim more than 24 instructional hours. An artifact that claims 30 hours of instruction is rejected.
- **Deterministic dates** — portfolio dates are deterministic. No invented dates.
- **Append-only integrity** — the portfolio is append-only. Replacing an artifact requires a new entry, not an in-place edit.
- **Parent attestation** — each artifact is parent-attested. The attestation binds the parent identity, the learner, the date, and the artifact hash.

### H8 — Assessments and evaluator rooms (`homeschool_assessment.py`)

`assess_annual_assessment(profile, route, learner, request)` is the gate. The module enforces:

- **Route-specific method and result** — the assessment method must match the parent-confirmed route. A route without an assessment requirement is explicitly `not_applicable`, not missing or implicitly satisfied.
- **Trusted representable time** — the assessment timestamp goes through `validate_timestamp`. Non-representable timestamps are rejected.
- **Evaluator room ownership** — an evaluator room is owned by a specific evaluator identity. A different evaluator cannot file a result into a room they do not own.
- **TTL** — evaluator rooms have a bounded lifetime. An expired room cannot accept a result.
- **Revocation** — evaluator rooms are revocable. A revoked room cannot accept a result.
- **Result provenance** — the assessment result binds the learner, the evaluator, the room, the timestamp, the method, and the source version.
- **Replay protection** — the same result cannot be filed twice.

### H9 — Learner support, non-diagnostic (`homeschool_support.py`)

`authorize_support_inquiry(inquiry)` and `validate_support_plan(plan, evidence_ledger, validated_at)` are the gates. The module enforces:

- **Non-diagnostic** — Praxis drafts support plans; it does not diagnose. A support plan with diagnostic language is blocked.
- **Matching-household authorized-parent authority** — a support inquiry requires the inquiring parent to be the authorized parent for the learner's household, even when no evidence IDs are included.
- **Controlled source categories** — support evidence comes from controlled categories (parent-attested, professional-attested, public-record). Uncontrolled sources are rejected.
- **Measurable objectives** — each support plan objective must be measurable.
- **Parent attestation** — the plan is parent-attested.
- **Plan content hash** — the plan content is hashed and bound to the attestation.
- **Trusted representable time** — the `validated_at` timestamp goes through `validate_timestamp`.
- **Evidence binding** — `SupportEvidenceLedger` evidence is bound to the household and jurisdiction context.

---

## Session 3 — collaboration, transcript, diploma, funding

### H10 — Collaboration (`homeschool_collaboration.py`)

`grant_collaboration(request)` is the gate. The module enforces:

- **Concrete learner/course identity** — a grant must specify concrete learner and course identities. A bare "all learners" or "all courses" grant is rejected.
- **Trusted representable time** — grant creation and expiry timestamps go through `validate_timestamp`.
- **Bounded lifetime** — grants have a bounded lifetime. An unbounded grant is rejected.
- **Half-open expiry** — a grant is active from `created_at` inclusive to `expires_at` exclusive. A grant used at exactly `expires_at` is expired.
- **Canonical scopes** — scopes are canonical strings. Free-form scopes are rejected.
- **Revocation** — grants are revocable. A revoked grant is immediately inactive.
- **Overlapping-access prevention** — two active grants to the same collaborator for the same learner/course are rejected. The second grant must wait for the first to expire or be revoked.
- **Tutor modes** — tutor modes are canonical. A grant must specify the tutor mode.
- **Effective-access duplicate prevention** — the effective-access calculation rejects duplicates at or after expiry.

### H11 — Transcripts and diploma provenance (`homeschool_transcript.py`)

`validate_transcript(transcript)` and `validate_diploma(diploma, manifest)` are the gates. The module enforces:

- **Supported-state validation** — transcript jurisdictions are restricted to the 13 supported states.
- **Evidence resolution** — external official-record hashes must resolve through evidence. A bare hash is not accepted.
- **Credits** — credits are bound to courses and learners. Duplicate credits are rejected.
- **GPA** — GPA is recomputed from the canonical course manifest, not trusted from the caller.
- **Course bindings** — courses are bound to the transcript and the learner.
- **Policy hashing** — the transcript policy is hashed and bound to the transcript.
- **Transcript snapshot** — the transcript is snapshotted at issuance. The snapshot is immutable.
- **Diploma revalidation** — diploma validation re-enforces learner/course/evidence uniqueness and recomputes totals, GPA, policy hash, and threshold from the immutable manifest. The diploma does not trust aggregates supplied by the caller. This was a round-three review finding: the first version trusted caller-supplied aggregates. The fix made the validator recompute everything from the manifest.
- **Diploma state, transcript, and policy bindings** — the diploma is bound to the state, the transcript, and the policy hash.

### H11b — Optional funding audit support (`homeschool_funding.py`)

`classify_expense(expense)`, `build_packet(...)`, and `record_submission_receipt(...)` are the gates. The module enforces:

- **Source-versioned eligibility** — funding eligibility is source-versioned. The eligibility determination hash is bound to the canonical program policy.
- **Sub-cent rejection** — expense amounts must be cent-precision. A sub-cent amount is rejected. This was a round-four review finding: the first version treated zero-cent expenses as eligible.
- **Receipt-byte validation** — every expense must have receipt bytes and a SHA-256 digest that matches the bytes.
- **Immutable expense state** — expense state is immutable. A committed expense cannot be uncommitted.
- **Packet cancellation** — packets are cancellable. A cancelled packet is immediately inactive.
- **External submission receipts** — external submission receipts are recorded with bytes and a digest.
- **Packet binding** — reimbursement packets bind learner, account, eligibility determination, source-versioned policy, full expense/receipt/invoice manifest, total, parent, and canonical packet hash. This was a round-four review finding: the first version did not bind the full manifest. The fix made the packet recompute everything from the canonical manifest before any lifecycle transition.
- **Packet hash** — the packet hash is canonical and recomputed from the manifest. Two packets with the same manifest have the same hash. A packet with a different manifest has a different hash.
- **Trusted representable time** — funding timestamps go through `validate_timestamp`. A non-representable timestamp is rejected. This was a round-four review finding: the first version failed silently on a hostile timestamp path.

---

## The Command Deck and the browser-rendering defect

The Homeschool Command Deck is the parent's browser surface. `hybridagent/web/homeschool.js` renders the deck. The deck must:

- Authenticate GET access (no anonymous reads of household data)
- Reject same-origin JSON mutations from unauthenticated sources
- Enforce a 64 KiB request body boundary
- Use **text-safe DOM construction** — `textContent` and `replaceChildren`, never `innerHTML` or `insertAdjacentHTML`

The browser-rendering rule was the last round-four finding. The first version passed the escaping tests, but escaping tests are not the rule. The rule is: **no dynamic HTML construction**. The fix rewrote the deck to use node construction and `textContent` for every dynamic string. The regression asserts `innerHTML` and `insertAdjacentHTML` do not appear in the script and that `textContent` and `replaceChildren` do.

The deck also enforces **strict loopback Host parsing** — another round-four finding. The first version accepted malformed Host authorities like `evil.example@localhost`, `localhost:bad`, and `localhost?ignored` as loopback. The fix parses strict RFC-style Host grammar: reject userinfo, query, fragment, path, whitespace, malformed/multiple separators, and invalid bracketed IPv6; force port parsing and allow only numeric ports 1–65535; only then permit `localhost` or an IP whose `is_loopback` is true.

And the deck's Homeschool context transitions are **transactional** — another round-four finding. The first version mutated `_homeschool_context` before status construction when clearing the route, and did not restore the previous context after an unexpected failure. The fix made every context transition — including empty-route clearing — exception-safe and atomic. The previous context is restored after any expected or unexpected status/calendar failure.

---

## The four-round independent exact-SHA review loop

Local tests passing is not release evidence. A model grading its own work is untrustworthy. Praxis's release process requires three independent reviewers — legal/compliance/privacy, learning/safety/evidence, and transcript/funding/integration — to PASS the same immutable SHA. If any reviewer reports a high/medium concern, the candidate is patched, fully reverified, recommitted under a new SHA, and reviewed again.

The Homeschool build went through four rounds.

### Round one — `138f96ec…`

The first frozen candidate passed local gates: 2,275 tests, 84.75% coverage, Ruff, mypy, architecture, evals, packaging, clean install, and live synthetic-only `gpt-oss:20b` dogfood confirming every deterministic FL onboarding and PA annual-closeout finding.

All three reviewers rejected it. Findings included:

- Medium privacy defects in disclosure timestamp typing
- Medium authorization defects where role labels alone authorized access
- Medium daemon defects in malformed Host acceptance and context mutation
- Medium assessment provenance defects where route confirmation depended on caller booleans
- Medium transcript defects where diploma validation trusted caller-supplied aggregates
- Medium funding defects in packet binding and receipt handling

Every finding was reproduced with a focused test before patching. The patch invalidates the SHA, so the whole matrix re-runs.

### Round two — `0d339c9…` → `6da81fc…`

Round two remediated round one and reverified at 2,288 tests, 84.80% coverage. The review again found medium defects: commencement still defaulted to annual continuation; school-year bounds were not enforced; evaluator-room provenance still depended on caller booleans; collaboration grants still permitted overlapping access.

Each finding got a regression and a patch. The candidate moved to `6da81fc…`. Round-two review rejected it again, with three reproducible medium defects in the legal/privacy lane and a timeout in the release lane. Timeouts and provider-filter blocks fail closed — they are not approvals.

### Round three — `536a67f…` → `669bc8f…`

Round three remediated round two and squashed the entire Homeschool release into one commit atop the `v0.28.31` baseline, to keep `main` one commit ahead. The candidate moved through `536a67f…` to `669bc8f…`. Round-three review (`deleg_1043a825`) completed against `669bc8f…` and returned blocking medium defects:

- **Legal/compliance:** malformed Host authorities accepted as loopback (`evil.example@localhost`, `localhost:bad`, `localhost?ignored`); empty-route clearing not transactional; a third state/audit atomicity defect.
- **Release integrity:** diploma validation did not re-run a manifest-backed equivalent of `_resolve_courses`; funding packets insufficiently bound; zero-cent expenses treated as eligible; a funding timestamp path failed for a hostile value; browser rendering did not comply with the required text-safe DOM construction rule.

All 20 selected task-3 tests passed. Package metadata included Homeschool `pack.json`, `knowledge.md`, and browser assets. Those passing checks did not override the reproduced blockers.

### Round four — `f816b2e…` → `5946a01…`

Round four remediated every round-three finding. The candidate was squashed into a single commit, amended with the final evidence, and frozen at `f816b2ed0ade0a6c11d52105d8d9d60c553ea4c1`. The full matrix passed:

- 2,311 tests collected; 2,298 passed with 13 expected skips
- 84.91% serial coverage (release evidence records the conservative 84.90% run)
- Ruff passed across the repository
- mypy passed across 183 source modules
- Architecture 4/4
- Praxis evaluations 66/66, including 36/36 vertical
- Offline governed demo passed
- Wheel and source distribution passed `twine check`
- 39 dashboard assets verified in the wheel
- Installed distribution, module, and CLI versions matched `0.28.32`
- Clean-wheel install, Homeschool manifest/knowledge loading, nested vertical imports, JavaScript syntax, JSON validation, and security-pattern scan all passed
- Synthetic-only `gpt-oss:20b` dogfood confirmed all deterministic Florida onboarding and Pennsylvania annual-closeout findings with responsible-adult review and no guard violations

Three isolated exact-SHA reviewers ran against `f816b2e…` in separate clones pinned to the exact commit, with strict structured output and fail-closed semantics. Each lane inspected its scope, ran at most one combined focused pytest command, and returned a verdict. No push, tag, or publication was permitted until all three returned PASS.

The release shipped when the three-domain PASS was in hand. The pushed commit `5946a01964bb17ed9cd4957198a08a77d8193730` is the immutable release SHA. The tag `v0.28.32` points at it. GitHub CI ran green on the pushed SHA. The Release workflow ran green. The wheel and sdist are attached to the GitHub Release.

#### The review loop is not theater

Each round caught a real defect that local tests had not. The rounds were not a ceremony. The tutor safety defect — "I want to kill myself tonight" producing no escalation — was found by a reviewer, not by the local suite. The malformed Host defect — `evil.example@localhost` accepted as loopback — was found by a reviewer. The diploma aggregate-trust defect was found by a reviewer. The zero-cent expense defect was found by a reviewer. The `innerHTML`-in-deck defect was found by a reviewer.

Local tests verify the code you wrote. Independent review verifies the code you should have written. The four-round loop is the difference between "tests pass" and "the product is safe to ship to households."

---

## The dogfood

Live synthetic-only local-LLM dogfood ran against `http://127.0.0.1:11434` using `gpt-oss:20b`. Two end-to-end flows:

1. **Florida new family onboarding** — a synthetic parent in FL with a 10-year-old, first year of independent home education. The agent ran the route classification, surfaced the three FL routes, required parent confirmation, built the compliance calendar with explicit commencement, and produced the annual notice draft. Deterministic findings, responsible-adult review at every SEND, no guard violations. FL digest: `50152d8633a73b2037502062fb310da790ceafdb8562842272770e28d904e447`.

2. **Pennsylvania high-school annual closeout** — a synthetic parent in PA with a 16-year-old, end of year. The agent assembled the portfolio with byte-backed artifacts, required parent attestation on each, ran the evaluator workflow, drafted the transcript from the canonical manifest, and produced the superintendent submission draft. Deterministic findings, responsible-adult review at every SEND, no guard violations. PA digest: `36f0f1c6eaea4052177451d2fcf002baf95e7cca786152d2f71f06800230c491`.

Both artifacts are persisted JSON. Both passed validation against the strengthened evidence, transcript, and funding interfaces. No real children, no real households, no real filings. Synthetic-only is the rule for dogfood at this stage.

---

## The pack surface

`hybridagent/packs/homeschool/`:

- **`pack.json`** — `name: homeschool`, `version: 1.0.0`, `complianceMode: enforced`, `vertical: Homeschool`. Risk policy: `dualApprovalRisks: [send, destructive]`, `autonomousRisks: [read, draft]`, `egressCheck: true`, `injectionCheck: true`, `approvalTtlSeconds: 900`. Tools: read_file, write_file, list_dir, query_knowledge, search_web, fetch_url, save_private_note, create_email_draft, send_email. Nine skills (below).
- **`knowledge.md`** — 13-state route and compliance matrix, parent-operated operating boundary, source citations, and the non-negotiable rules. Product guidance, not legal advice.
- **`web/homeschool.js`** — text-safe DOM Command Deck, authenticated GET, same-origin JSON mutations, 64 KiB body boundary, commencement/materials/reporting/assessment controls.
- **`web/homeschool.css`** — deck styling.

Skills in the pack:

1. `annual-home-education-setup` — route selection, notice, calendar
2. `lesson-plan` — multi-grade plan (name preserved from the legacy template)
3. `child-safe-tutoring` — parent-visible, age-appropriate, authorship-bound
4. `attendance-evidence-closeout` — instruction ledger, filing, receipt
5. `portfolio-and-evaluator` — byte-backed portfolio, evaluator room
6. `learner-support-not-iep` — non-diagnostic support plan
7. `scoped-homeschool-collaboration` — tutor/co-op/evaluator grants
8. `evidence-backed-transcript` — manifest-recomputed transcript and diploma
9. `funding-audit` — optional scholarship/ESA expense and reimbursement

The vertical eval suite in `vertical_evals.py` adds the Homeschool `VerticalSpec` plus manual cases. The pack integration test (`tests/test_homeschool_pack_integration.py`) exercises 13-state profiles, daemon endpoints, authentication, same-origin mutations, pack manifest, dashboard regressions, and the text-safe DOM rule. Session 1/2/3 tests cover route, compliance, filing, privacy, tutoring, plans, portfolios, assessments, support, safety, collaboration, transcripts, diplomas, funding, replay, duplicate, and transition regressions.

Architecture check (`scripts/check_architecture.py`) enforces WIP=1, version-bumped-on-hybridagent-changes, dependency-free core, and governance-modules-present. All twelve Homeschool modules are registered in `LOCAL_MODULES` so the dependency-free-core check does not misclassify their internal imports as third-party.

---

## Release verification

`PYTHON_BIN=.venv/bin/python bash scripts/verify-release.sh`:

- Built sdist + wheel
- `twine check dist/*` — passed
- Wheel bundles 39 dashboard assets — verified
- Wheel metadata `praxis-agent` / `0.28.32` — verified
- Tag/version match — verified
- Clean-venv install from wheel — `praxis 0.28.32`, `hybridagent.__version__ == 0.28.32`, `importlib.metadata.version("praxis-agent") == 0.28.32`
- Installed Homeschool manifest, knowledge, and browser assets load from the installed wheel (not the checkout)
- Nested vertical authority imports resolve
- JavaScript syntax check passes on `homeschool.js`
- JSON validity check passes on `pack.json` and `feature_list.json`

Post-push verification against the published GitHub Release:

- Downloaded both assets from `https://github.com/smfworks/smf-praxis/releases/download/v0.28.32/...`
- Wheel SHA-256 `204cb91958514e2d2b697491eedcf4c2c76e0c77d743d04518ee07125c97473e` — matches the GitHub Release API digest
- Sdist SHA-256 `a0687c0667808ac7c52be0629aa140908dae45e79ea66c3011bfae868877b395` — matches the GitHub Release API digest
- Clean-venv install from the downloaded wheel — `praxis 0.28.32`, pack `name=homeschool`, `version=1.0.0`, `complianceMode=enforced`
- `homeschool.js` from the installed wheel uses `textContent` and contains no `innerHTML`
- `praxis demo` runs end-to-end from the installed wheel

GitHub Actions on the pushed SHA `5946a019…`:

- **CI** (run `29656740684`) — success. Lint, test (3.10/3.11/3.12 × ubuntu/windows/macos), artifact-renderers (ubuntu/macos/windows), install-script (ubuntu/macos/windows), docker — all green.
- **Release** (run `29657043502`) — success. Build, twine check, dashboard asset count, tag/version match, artifact upload.

PyPI publishing remains intentionally disabled. The release lives on GitHub Releases. Install directly:

```bash
pip install https://github.com/smfworks/smf-praxis/releases/download/v0.28.32/praxis_agent-0.28.32-py3-none-any.whl
```

---

## Open-core reminder

Public MIT pack in the base repo first. The household education governance — routes, compliance, privacy, tutoring, portfolios, assessments, support, collaboration, transcripts, diplomas, funding audit — is in the public MIT repo. Private paid household workflows (SIS connectors for umbrella schools, scholarship/ESA program integrations, evaluator marketplace) are a later fork. Not this release.

The `homeschool` pack is distinct from the `education` tutor template (autonomous, learner-facing help), the `school_system` pack (institutional, district-operated, FERPA-bound), and any future microschool administration product. The product boundaries are enforced in code, not just in docs.

---

## What this release is not

It is not legal advice. The `knowledge.md` is product guidance. Every state profile carries a source citation, a source URL, a confidence level, and a verification date. The parent must verify against current agency materials before labeling a filing ready. Praxis compares routes; it does not choose the family's legal status. Praxis drafts filings; it does not submit them. Praxis drafts transcripts and diplomas; it does not issue them. Praxis drafts funding packets; it does not approve or submit them. The parent is the operator of record and the final decision-maker.

It is not a child-facing autonomous agent. Tutoring is parent-visible, age-appropriate, authorship-preserving, and safety-constrained. A direct danger disclosure pauses tutoring and routes outside the implicated household. The agent does not diagnose, does not score affect, does not profile, and does not train foundation models on household data by default.

It is not institutional K–12. Household records are not FERPA records by default. Public virtual/cyber enrollment is not parent-operated homeschool. Microschool administration is not household homeschool. The `school_system` pack (v0.28.31) governs institutional education; the `homeschool` pack (v0.28.32) governs household education. They do not overlap.

---

## The numbers at ship

| Metric | Value |
|---|---|
| Version | `0.28.32` |
| Release SHA | `5946a01964bb17ed9cd4957198a08a77d8193730` |
| Tag | `v0.28.32` → `14c5c88f…` |
| Parent (baseline) | `f67aeaaadf3ee42df9e10756c7f7d43747c43fe0` (v0.28.31) |
| Files changed | 53 |
| Insertions / deletions | 7,494 / 219 |
| Tests collected | 2,311 |
| Tests passed | 2,298 (13 expected skips) |
| Coverage | 84.91% (release evidence records 84.90% conservative run) |
| Ruff | clean |
| mypy | clean across 183 source files |
| Architecture | 4/4 |
| Praxis evals | 66/66 |
| Vertical evals | 36/36 |
| Wheel SHA-256 | `204cb91958514e2d2b697491eedcf4c2c76e0c77d743d04518ee07125c97473e` |
| Sdist SHA-256 | `a0687c0667808ac7c52be0629aa140908dae45e79ea66c3011bfae868877b395` |
| Wheel size | 752,223 bytes |
| Sdist size | 938,808 bytes |
| Dashboard assets in wheel | 39 |
| CI run | `29656740684` — success |
| Release run | `29657043502` — success |
| Review rounds | 4 |
| Independent reviewer lanes | 3 (legal/privacy, learning/safety, release/integration) |

---

## What comes next

The vertical pack backlog continues. The forensic engineering vertical — Praxis's first paid private build — is the next major workstream, layered on top of the same governance substrate that now carries law firm, medical office, school system, and homeschool. The methodology is stable: research first, use cases, never-autonomous rules, 13-state regulatory matrix, proposal, build, four-round independent exact-SHA review, ship. The substrate gains a new vertical; the vertical inherits the governance spine without re-deriving it.

The homeschool pack will get a paid private companion for household-specific integrations — umbrella-school SIS connectors, scholarship/ESA program APIs, evaluator marketplace. That work is private and later. The public MIT pack is the foundation.

If you want to read the code, it is at [smfworks/smf-praxis](https://github.com/smfworks/smf-praxis) under MIT. If you want to install the release, the one-liner is above. If you want to run the governed demo, `pip install` the wheel and run `praxis demo`. If you want to see the four-round review evidence, it is in the delegation cache and in the test files — every finding has a regression that reproduces it.

Build in the open. Review in the open. Ship in the open. The four-round loop is the product.

---

*Praxis is an autonomous AI colleague built by SMF Works. The `homeschool` pack is parent-operated household education governance, MIT-licensed, distinct from institutional `school_system` and from the autonomous `education` tutor. This post is a build-in-the-open account, not legal advice. Verify every state profile against current agency materials before relying on it.*