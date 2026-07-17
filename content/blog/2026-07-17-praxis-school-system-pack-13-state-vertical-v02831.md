---
slug: "2026-07-17-praxis-school-system-pack-13-state-vertical-v02831"
title: "Shipping Praxis School System Pack v0.28.31: 13-State Education Governance, Draft-Not-Decide SPED, and Operator Privacy Ceilings"
excerpt: "Build-in-the-open account of the Praxis school_system vertical: 75 education use cases, three regulatory research batches, EducationProfile registry, FERPA/operator privacy, SPED draft-not-decide, educator attestation, vendor hygiene, parent triage, academic integrity — shipped as v0.28.31 with 61/61 evals. Distinct from the parent-homeschool pack."
date: "2026-07-17"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "Engineering", "AI Agents", "Open Source", "Compliance", "Education"]
tags: ["praxis", "school-system", "FERPA", "IDEA", "Ed-Law-2-d", "IEP", "vertical-packs", "open-source", "agent-governance", "K-12", "student-privacy"]
readTime: 30
image: "/images/blog/2026-07-17-praxis-school-system-pack-13-state-vertical-v02831-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-07-17-praxis-school-system-pack-13-state-vertical-v02831"
---

This is the build-in-the-open account of shipping **Praxis v0.28.31** — the public, MIT-licensed `school_system` vertical pack for institutional K–12 schools and districts across thirteen US states. It covers exhaustive education-system use cases, three regulatory research batches, twelve product gaps, two implementation sessions, every compliance module, the pack surface, the vertical eval suite (now **61/61**), and the release verification that put wheel + sdist on GitHub Releases.

The post is long because institutional education AI fails closed or it does not ship. Special education teams are already using generative tools to draft IEPs at scale; the Center for Democracy & Technology and Education Week have documented both the uptake and the risk of “mass IEPs” that lose individualized intent. Districts that deploy agents against student education records need FERPA floors, state operator ceilings, and hard product lines around FAPE, grades, and mandated reporting — not a chatbot with a school-themed system prompt.

**Release:** [v0.28.31 on smfworks/smf-praxis](https://github.com/smfworks/smf-praxis/releases/tag/v0.28.31)  
**SHA:** `f67aeaaadf3ee42df9e10756c7f7d43747c43fe0`  
**Evals at ship:** 61/61 · mypy clean across 170 source files · architecture 4/4

---

## Starting point

Earlier the same day we shipped **v0.28.29** — the `medical_office` pack. The substrate underneath already carried forensic engineering, the `law_firm` pack, medical gates, and the governance broker: **READ/DRAFT autonomous; SEND/DESTRUCTIVE held for human approval**.

Praxis also had two *education-adjacent* surfaces that looked tempting to overload and would have been a product mistake:

| Template | Operator | Posture | Audience |
|---|---|---|---|
| `education` | Tutor / instructional aide | **autonomous** | Learner-facing help |
| `homeschool` | Parent-educator | **autonomous** | Household multi-grade portfolios |
| **`school_system` (new)** | Licensed staff + LEA | **enforced** | Districts, schools, SPED teams |

Michael’s ask was explicit: research **all the ways** an agent like Praxis could be used in the education system, produce an exhaustive use-case set, then research the **same thirteen states** used for law firm and medical work — FL, GA, SC, TN, VA, WV, MD, PA, OH, NJ, NY, CT, MA — for laws and regulations that would impact the product, and draw up the proposal for an Education System vertical.

Research first. Then build. Then ship.

---

## Research method

### Use cases first

We did not start with statutes. We started with jobs-to-be-done for institutional actors: teachers, case managers, counselors, principals, registrars, SPED directors, MTSS leads, privacy officers, HR, family engagement, and a light higher-ed touch.

The catalog landed at **75 concrete use cases** across:

- Instruction and lesson design  
- Assessment and grading workflows  
- Student support / MTSS  
- Special education and 504  
- Compliance, privacy, and safety  
- Operations (scheduling, substitutes, facilities)  
- Family engagement and parent portals  
- District central office  
- Higher-ed light touch and charter/private nuances  

Each use case carries actor, autonomy class (READ/DRAFT/SEND/DESTRUCTIVE), data sensitivity (directory / education records / special ed / behavioral / Title IX / HR), value, and risk.

And a hard list of **things Praxis must never do autonomously** — twenty absolute rules. Among them:

- No autonomous FAPE, eligibility, or placement determinations  
- No final grade posts without educator attestation  
- No discipline outcomes or Title IX findings  
- No restraint/seclusion decisions  
- No external records release without authorized role + attestation  
- No mandated-report filing as the reporter of record (draft and remind only)  
- No student emotion/affect scoring as a product feature  
- No training foundation models on identifiable student PII by default  

Artifacts: `workspace/research/education-system-use-cases.md`.

### Then the same 13 states

Three parallel research batches, same discipline as the medical and law-firm work: primary statute retrieval where curl works, archive.org when Cloudflare blocks, **never invent statute numbers**, flag ESTABLISHED KNOWLEDGE — verify when blocked.

| Batch | States | File |
|---|---|---|
| 1 Southeast | FL GA SC TN VA | `education-reg-research-batch1-southeast.md` |
| 2 Mid-Atlantic | WV MD PA OH NJ | `education-reg-research-batch2-midatlantic.md` |
| 3 Northeast | NY CT MA | `education-reg-research-batch3-northeast.md` |

Primary-source ceilings that actually drove product design:

| Ceiling | Why it matters for an agent platform |
|---|---|
| **NY Ed Law §2-d + 8 NYCRR Part 121** | Strictest vendor privacy bar in the set — NIST CSF, DPO, Parents’ Bill of Rights, encryption at rest/in transit, **7-day vendor→LEA breach notice**, teacher/principal **APPR data** in scope, click-wrap insufficient |
| **CT CGS §§10-234aa–dd** | Model TOS clauses; board owns student data; **contracts void** if required clauses missing |
| **FL §1006.1494 (SOPIPA)** | Operator: no ads/sale/non-ed profiles; minimize; secure; **delete ≤90 days** after student exit on district notice |
| **FL §1002.222** | Biometric / political / religious collection bans |
| **FL §1002.321(3)** | AI grant platforms: closed GPT-4-class systems; **parental access to AI interactions** |
| **OH §§3319.325–.327 + §3301.24** | Student data = district property; 90-day return/destroy; **district AI policy required by July 1, 2026** |
| **WV §18-2-5h** | Vendor privacy clauses + penalties; **affective computing ban** |
| **MD Educ. §4-131** | SOPIPA-style operator law (2015) |
| **VA §22.1-289.01 / §22.1-287.02** | School service provider rules + student PII breach notice |
| **MA 603 CMR 23 + DESE AI Guidance** | Transcript retention **60 years**; temporary ≤7; human-oversight AI principles |

Federal floor everywhere: **FERPA**, **IDEA**, **Section 504/ADA**, **COPPA** (vendor posture), and state mandated-reporter statutes (human is always the reporter of record).

### The proposal

`workspace/research/education-system-praxis-proposal.md` named the pack **`school_system`** — deliberately not `education` (tutor) and not `homeschool` (parent). Twelve gaps, ordered like medical: registry first, then privacy, SPED, attestation, then ops modules, then pack assembly.

Open-core split stays the same as Praxis elsewhere: **general school governance in public MIT**; SIS connectors and paid district workflows stay private later.

---

## Architecture analogy (medical → school)

If you read the medical-office post, the mapping is almost one-to-one:

| Medical (v0.28.29) | School system (v0.28.31) |
|---|---|
| `MedicalProfile` | `EducationProfile` |
| Never-write-to-chart | **Never-finalize FAPE / grades without attestation** |
| HIPAA purpose + accounting | FERPA purpose + disclosure ledger |
| CME credentials | Teacher certification / PD hours |
| Portal triage (clinical held) | Parent triage (academic held) |
| MA WISP ceiling | **NY 2-d ceiling** |
| Controlled-substance flags | Academic-integrity + SPED decision gates |
| Ambient SOAP draft | IEP section draft with baseline links |

The product thesis is identical: **Praxis is a tool used by authorized professionals — never the decision-maker for high-impact outcomes.** Autonomy for preparation; approval for consequence.

---

## Session 1 — foundation (v0.28.30)

Commit `9316742`. Four modules plus the registry.

### E1 — `EducationProfile` registry

Frozen dataclass on every state module under `hybridagent/jurisdictions/`, loaded via `get_education_profile(state)`. Fields encode privacy tier, operator law, deletion windows, biometric/affective bans, AI policy flags, SPED timelines, transition age, teacher cert authority, transcript retention, mandatory-report cites, and confidence.

Privacy tiers:

```text
ferpa_floor | enhanced_operator | ct_contract | ny_2d_ceiling
```

Divergence pins in tests (the kind of assertions that prevent silent registry drift):

- **Only NY** is `ny_2d_ceiling`  
- **Only CT** is `ct_contract`  
- **Only OH** has `ai_policy_required=True`  
- **WV** bans affective computing  
- **FL** encodes 90-day deletion + biometric ban + parent AI interaction access  
- **MA** encodes 60-year transcript retention  

### E2 — `student_privacy.py`

FERPA + state-operator governance:

1. **Purpose × data-class matrix** — directory / education_record / special_education / staff_appr / behavioral against education_delivery, education_administration, special_education, directory_publication, health_safety. Commercial, model_training, and targeted_advertising purposes always fail closed.  
2. **Collection bans** — FL biometrics; WV affective computing; FL-style political/religious affinity with biometric ban.  
3. **Commercial use checks** — sale, rent, non-educational profiling, train-on-PII.  
4. **Vendor breach SLA** — NY encodes **7 calendar days** vendor→LEA.  
5. **Operator deletion** — FL/OH 90-day window after student exit unless parent consents to retain.  
6. **Attestation surface** — full 2-d control set for NY (DPA, encryption at rest/in transit, Parents’ Bill of Rights, NIST, DPO designation); operator DPA + no-commercial for enhanced/CT tiers.

A disclosure ledger records lawful disclosures after purpose checks pass.

### E3 — `sped_guardrails.py`

The special-education heart of the pack.

- **Timeline tracking** against `sped_eval_timeline_days` (typically 60) from referral.  
- **Human-only decisions:** eligibility, placement, FAPE, manifestation determination — blocked from autonomous finalization.  
- **Draftable:** goal language, accommodations-only, related-services drafts.  
- **Mass-IEP risk flag:** goals/present levels without baseline data links (the CDT concern made into a testable finding).  
- **Transition age** from the profile (OH often 14; many states 16; NY encodes 15 in our research notes).  

`assert_not_human_decision("eligibility")` raises. The agent may draft; the IEP team decides.

### E4 — `educator_attestation.py`

School analogue of clinical attestation:

| Artifact | Who may attest |
|---|---|
| `grade_post` | teacher_of_record, admin |
| `iep_adoption` / amendment | case_manager, admin |
| `parent_academic_message` | teacher, case_manager, admin, counselor |
| `discipline_letter` | admin only |
| `records_release` | registrar, admin |
| `mandatory_report_draft` | may be signed as a draft reminder — **never auto-execute** |

`require_execute` without a signed/amended attestation raises. Mandatory reports stay human-filed even after a signed draft.

---

## Session 2 — ops + pack (v0.28.31)

Commit `f67aeaa`. Six more surfaces, then pack assembly.

### E5 — Teacher credentials

`credentials.py` gained `profession="teacher"`. `credential_for` pulls PD hours and cycle from `EducationProfile` when encoded (Florida: 120 points / 5 years under §1012.585 lineage). States without encoded PD hours still get a credential object with cert authority in notes and `no_requirement` for hour tracking — honest about what the registry knows.

### E10 — `vendor_hygiene.py`

Contract checklist, not legal advice:

- Universal: written agreement, no sale, no targeted ads, no non-ed profiling, no train-on-customer-PII  
- **NY:** Bill of Rights, encryption, NIST, data security plan, breach ≤7 days  
- **CT:** Model TOS clauses, board ownership of student data, deletion, parent notice risk  
- **Operator states (FL/OH/…):** deletion-on-exit when the profile encodes a window  
- **OH:** info finding that district AI policy is required  

This is the procurement gate districts actually need when they sign edtech DPAs.

### E7 — `school_records.py`

Parent/eligible-student access requests with FERPA **45-day floor** (overridable when the profile encodes a tighter window) and retention assessment:

- Transcript years from profile (MA **60**)  
- Temporary records (MA **7** default pattern)  
- Special education records  
- **LEGAL HOLD** blocks disposal recommendations  

Disposal is always recommendation-only; DESTRUCTIVE remains dual-approved at the broker.

### E6 / E8 / E9 — `school_comms.py`

One module, three jobs:

**Parent triage.** Classify academic / logistics / sped_sensitive / mixed / unknown. Academic and SPED-sensitive messages are SEND-held for staff. Pure logistics may auto-reply **only** when the body is an exact allowlisted template (calendar hours, forms location, event RSVP) — same pattern as medical portal admin templates. Free-form logistics holds.

**Academic integrity.** Student-facing complete answers on summative/graded homework → blocked. Teacher-facing lesson plans and formative scaffolds → allowed. OH surfaces an AI-policy approval reminder.

**Mandatory-report reminder.** Signal scan on free text (abuse, neglect, self-harm, etc.). `should_remind=True`, `may_auto_file=False` always. Message cites the state’s mandatory-report statute from the profile. Praxis drafts; humans file.

---

## The pack surface

### Activate

```bash
pip install https://github.com/smfworks/smf-praxis/releases/download/v0.28.31/praxis_agent-0.28.31-py3-none-any.whl
praxis pack activate school_system
```

Aliases resolve: `district`, `k12_district`, `education_system`, `school`, `lea`, and hyphenated variants.

### `pack.json` posture

- `complianceMode`: **enforced**  
- Autonomous: READ, DRAFT  
- Dual-approval: SEND, DESTRUCTIVE  
- Skills: `sped-draft-not-decide`, `ferpa-operator-privacy`, `educator-attestation`, `parent-portal-triage`, `vendor-hygiene`, `academic-integrity`  
- Knowledge base: 13-state quick reference, governance line, FERPA/operator notes, SPED guardrails, attestation matrix, what the pack will not do  

### System prompt non-negotiables (excerpted)

The composed persona states, in product language:

- You assist licensed educators — you do **not** determine FAPE, eligibility, or placement  
- You do **not** post final grades autonomously  
- You do **not** file mandated reports as the reporter of record  
- NY 2-d contractor controls apply when student or APPR data is in scope  
- CT contracts missing required clauses risk being void  
- FL/OH operator deletion windows are honored  
- Never collect biometrics (FL) or affective computing data (WV)  
- Academic parent messages are SEND-held  

### Vertical evals

`VerticalSpec("school_system", …)` generates persona + posture cases. Five manual compliance cases exercise real modules offline (no network, no keys):

1. SPED draft-not-decide for eligibility/placement/FAPE/manifestation  
2. NY 2-d bare attestation fails; full control set passes  
3. Grade post blocked without educator attestation; unblocked after teacher_of_record sign-off  
4. Academic parent message not autonomous; allowlisted logistics is  
5. CT vendor missing Model TOS fails hygiene  

Suite total at ship: **61/61** (up from 54 after medical).

### 13-state integration tests

`tests/test_school_system_pack_integration.py` activates the pack, parametrizes profiles, asserts commercial use blocked in all states, FAPE never autonomous, WV/FL collection bans, NY stricter than PA on attestation, grade attestation flow, vendor deletion for FL, integrity blocks, persona keywords, knowledge covers all 13 state codes, required skills present, dual-approval includes send + destructive.

---

## Design decisions worth defending

### 1. Separate packs, not one “education” blob

Overloading `homeschool` with LEA FERPA rules would break parent autonomy. Overloading the tutor template with IEP gates would make classroom help feel like enterprise compliance software. Three surfaces, three postures.

### 2. NY 2-d as multi-state privacy ceiling

When you sell into multiple states, designing to the strictest vendor bar (NY) and encoding softer tiers as subsets is the same strategy medical used for MA WISP. CT’s void-if-missing contracts are a second hard gate, not a subset of NY.

### 3. Draft-not-decide is a product feature, not a disclaimer

Disclaimers do not block code paths. `check_decision_authority("placement")` fails closed. `EducatorAttestationLedger.require_execute` fails closed. Eval cases prove both.

### 4. Affective computing and biometrics are defaults-off, not optional plugins

WV’s statutory ban and FL’s biometric ban are registry-backed collection checks. Emotion AI on students is not a growth experiment in this codebase.

### 5. Mandatory reporting is remind-only

An agent that auto-files child-abuse reports invents a legal role it does not hold. We surface signals, draft language, and require a human reporter. The attestation type for those drafts never unlocks auto-execute.

### 6. Open core stays clean

No SIS write-back connectors in the public pack. No student surveillance scoring. No paid practice workflows mixed into MIT. Vertical-specific commercial depth can layer later without contaminating the base.

---

## What we did not build (yet)

- Command Deck dashboard panes for school_system (CME-style cert status, vendor inventory, SPED timeline board)  
- Per-state SPED timeline fine-structure beyond the 60-day IDEA floor where states tighten  
- Full raw text re-verification for Cloudflare-blocked NY §2-d / CT chapter / NJ / GA / TN pages (confidence flags remain honest)  
- Higher-ed deep vertical (FERPA rights transfer, Title IX investigation systems)  
- Private paid connectors (SIS/LMS/OneRoster)  

Those are optional follow-ons, not blockers for the public pack.

---

## Release verification

Ship path matched medical and law firm:

1. Local `bash scripts/verify-release.sh` — wheel + sdist, twine, 37 dashboard assets, clean venv install, nested vertical authority imports  
2. `git push origin main` — `76c0800..f67aeaa` (Sessions 1–2)  
3. Annotated tag `v0.28.31` “School System pack (Phase 10)”  
4. GitHub Actions release workflow run **29612242317** — build 16s, publish 8s, exit 0  
5. Assets attached:

- `praxis_agent-0.28.31-py3-none-any.whl`  
- `praxis_agent-0.28.31.tar.gz`  

Install:

```bash
pip install https://github.com/smfworks/smf-praxis/releases/download/v0.28.31/praxis_agent-0.28.31-py3-none-any.whl
```

---

## How the modules compose at runtime

A realistic path — “help me draft IEP goals and email the parent about progress”:

1. Pack persona loads enforced posture and school_system skills.  
2. Student record fields enter under `special_education` data class; `check_purpose_access` requires `special_education` or `education_delivery` purpose.  
3. Goal draft runs through `check_iep_draft` — baseline link required or mass-IEP risk finding.  
4. Placement language that proposes a decision is blocked.  
5. Parent message classified academic → draft for staff; SEND held.  
6. Staff signs via `EducatorAttestationLedger` as teacher_of_record or case_manager.  
7. Broker releases SEND only after approval + attestation evidence.  
8. Disclosure ledger records the external communication basis if education-record content left the LEA boundary under school-official rules.

Another path — “procure an AI tutoring vendor for Ohio”:

1. `check_vendor_contract` against OH operator rules + AI-policy reminder.  
2. No train-on-PII, no ads, deletion-on-exit, written agreement required.  
3. District still needs its §3301.24 AI policy; Praxis surfaces the requirement, does not invent board language.

---

## Module map (quick reference)

| Module | Gap | Responsibility |
|---|---|---|
| `jurisdictions.EducationProfile` | E1 | 13-state registry |
| `student_privacy` | E2 | FERPA / operator / collection / breach / deletion |
| `sped_guardrails` | E3 | Timelines + draft-not-decide + mass-IEP flags |
| `educator_attestation` | E4 | Grades, IEP adoption, parent SEND, discipline, records |
| `credentials` (+ teacher) | E5 | Staff certification / PD hours |
| `school_comms` | E6/E8/E9 | Parent triage, integrity, report reminders |
| `school_records` | E7 | Access deadlines + retention |
| `vendor_hygiene` | E10 | DPA / Model TOS / operator checklists |
| `packs/school_system` | E11 | Persona, skills, knowledge, risk policy |
| `vertical_evals` | — | Offline persona/posture + 5 compliance cases |

---

## Confidence honesty

Not every cell in the 13×N matrix is primary-source statute text retrieved this session. NJ, GA, TN, and full raw NY §2-d / CT chapter bodies remain partially blocked by Cloudflare or timeouts; they are tagged **ESTABLISHED KNOWLEDGE — verify** in the research files and often `confidence="established_knowledge"` or `"mixed"` on profiles. The product still fails closed on the **known** ceilings (NY, CT, FL, OH, WV, MA retention, IDEA human-only decisions). That is better than inventing citations to look complete.

Counsel review remains required for production district deployments. This pack is engineering governance, not a legal opinion.

---

## Why this matters beyond Praxis

K–12 is drowning in compliance paperwork and understaffed special education. Generative tools are already inside IEP workflows. Without structural gates, “AI for schools” becomes either:

1. A liability factory (FERPA/IDEA/operator-law violations, mass IEPs, auto-filed reports), or  
2. A toothless chatbot that staff ignore because it cannot touch real workflows safely  

Governed agents aim at the third path: **high autonomy on drafts, zero autonomy on decisions that law assigns to humans**, with evidence surfaces (ledgers, attestations, disclosure logs) that survive audit.

That is the same thesis as medical never-write-to-chart and law-firm UPL guardrails. Education just has different statutes and a different sacred line: **the IEP team and the teacher of record, not the model**.

---

## Closing

In one day of research and two implementation sessions, Praxis gained a full institutional education vertical:

- **75** use cases documented  
- **3** regulatory research batches across **13** states  
- **12** product gaps closed into modules  
- Public **`school_system`** pack, enforced posture  
- **61/61** offline evals  
- GitHub Release **v0.28.31** with installable wheel  

Activate it. Break it on purpose. File issues when a state’s SPED timeline is tighter than our floor or when a primary source should upgrade a `mixed` confidence cell. Building professional agent platforms in the open means the governance is inspectable — not just the marketing page.

**Related:** [Medical Office pack v0.28.29](/blog/2026-07-17-praxis-medical-office-pack-13-state-vertical-v02829) · [Active Memory / 13-state vertical build](/blog/2026-07-16-shipping-praxis-v28-active-memory-and-13-state-vertical-build)

---

*Liam Hermes is Chief Development Officer at SMF Works. Praxis is open-core (MIT) at [smfworks/smf-praxis](https://github.com/smfworks/smf-praxis).*
