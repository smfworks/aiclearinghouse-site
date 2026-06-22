---
slug: "writing-implementation-plans-hermes-ai"
title: "Writing Implementation Plans with Hermes AI: From Vague Idea to Shippable Code"
excerpt: "Most dev projects fail before the first commit. The implementation plan is where that failure happens. Here's how to use Hermes AI to write plans that actually get executed — with real examples from the SMF Works build pipeline."
date: "2026-06-04"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Hermes AI", "Tutorial"]
tags: []
readTime: 10
image: "/images/blog/writing-implementation-plans-hermes-ai.png"
originalUrl: "https://smfworks.com/blog/writing-implementation-plans-hermes-ai"
canonicalUrl: "https://www.smfclearinghouse.com/blog/writing-implementation-plans-hermes-ai"
---
# Writing Implementation Plans with Hermes AI: From Vague Idea to Shippable Code

You've got an idea for a feature. Maybe it's a new API endpoint, a data migration, or swapping out your auth system. You could start coding immediately. Most developers do. And most of those projects end up in the "almost done" graveyard — 80% finished, blocked on some edge case nobody thought about, dependencies in a broken state, the dev who started it moved on to something else.

The failure point isn't the code. It's the plan. Or the lack of one.

This post is about using Hermes AI to write implementation plans that actually work. Not vague Jira tickets or "we'll figure it out" Slack threads. Actual plans — bite-sized tasks, defined success criteria, explicit dependencies, and verification steps. The kind of plan that lets you stop when you're done instead of wondering if you're done.

I use this system at SMF Works. Every feature we ship starts with a Hermes-generated plan. Here's how it works.

## Why Most Plans Fail

Let's start with what not to do. These are the plan formats that kill projects:

**The Novel**: A 2,000-word document describing the vision. Beautiful prose. No actual steps. Nobody reads it, so nobody executes it.

**The Single Ticket**: "Implement user authentication." That's the ticket. The dev assigned to it has to figure out: OAuth or JWT? Sessions or stateless? Password requirements? Email verification? It balloons into a 3-week death march because the scope was never defined.

**The Brain Dump**: A list of 47 things that need to happen, in no particular order, with no indication of which depend on which. Dev picks item #12, gets blocked on item #3, switches to item #28.

**The Architecture Astronaut Plan**: Spends 80% of the words on abstract system design, 20% on implementation, 0% on migration strategy. Looks great in a diagram. Falls apart the first time someone has to update production data.

The fix isn't more planning. It's structured planning. And this is where Hermes AI shines — if you know how to ask.

## The Hermes Implementation Plan Format

I use a specific structure for all implementation plans. It's not rocket science, but every element has a purpose:

```
Feature: [Clear, one-line description]
Goal: [What done looks like]
Priority: [P0/P1/P2 — must have/nice to have/defer]

## Prerequisites
- [ ] Thing that must exist before we start
- [ ] Another prerequisite

## Breakdown
Phase 1: [Thing that can be deployed independently]
- [ ] Task with clear completion criteria
- [ ] Next task

Phase 2: [Next logical chunk]
- [ ] Task
- [ ] Task

## Dependencies
- External: [Service, team, or API we depend on]
- Internal: [Work that must complete first]

## Verification
How do we know this works:
- [ ] Test case 1
- [ ] Test case 2
- [ ] Check to run after deployment

## Rollback
If something goes wrong:
- [ ] Step to revert
- [ ] Step to verify rollback
```

That's the template. Now here's how to get Hermes to generate it.

## Prompting Hermes for Plans That Ship

Don't ask "plan this feature for me." That's the novel problem — you get back a beautiful, useless wall of text. Instead, use structured prompts that force Hermes into disciplined thinking.

### The Setup Prompt

```text
I need an implementation plan for: [brief description]

Format the plan using this structure:
- Prerequisites (what must exist first)
- Breakdown into phases (independent deployable chunks)
- Dependencies (internal and external)
- Verification steps (how we confirm it works)
- Rollback steps (how we unwind if needed)

Each task should:
- Be completable in 2-4 hours
- Have clear completion criteria
- Not depend on future tasks

Be specific. Name actual files, functions, and endpoints I'll need to create or modify.
```

That's the starting prompt. But here's where it gets interesting — Hermes has access to your codebase. You can make this prompt more powerful:

```text
First explore the codebase to understand:
1. What the current structure looks like
2. Where similar features live
3. What patterns are already established

Then write the plan.
```

Hermes will search your files, read the existing code, and write a plan that actually fits your architecture. Not a generic plan. Your plan.

### Working Example: Adding a New Feature

Let me walk through a real example from SMF Works. We needed to add a new field to our content scoring pipeline — a difficulty rating that gets calculated based on topic complexity.

**My prompt:**

```text
I need an implementation plan to add a "difficulty_score" field to our content scoring pipeline. 

Explore the codebase first to understand:
1. Where the current scoring pipeline lives
2. How scores are calculated and stored
3. Where the API returns scoring data
4. What tests exist

Then write a plan with:
- Prerequisites
- Phase breakdown (data model, calculation logic, API update, tests)
- Dependencies
- Verification
- Rollback

Keep tasks small. I want to ship this in a single day.
```

Hermes explored the codebase and found:

```
content/
├── scoring/
│   ├── calculator.ts      # Where scores are calculated
│   ├── models.ts          # Type definitions
│   └── __tests__/
├── api/
│   └── scores/
│       └── route.ts       # API endpoint
```

Then it generated this plan:

## Phase 1: Add Difficulty Score Model

- [ ] Add `difficulty_score: number (0-100)` to `content/scoring/models.ts` interface
- [ ] Update database schema (migration): add nullable `difficulty_score` column
- [ ] Verify types compile: `npx tsc --noEmit`
- Verification: `select difficulty_score from content_scores limit 1` returns NULL (new column exists)

## Phase 2: Implement Difficulty Calculation

- [ ] In `content/scoring/calculator.ts`, add `calculateDifficulty(content: string): number`
- [ ] Algorithm: Use word complexity (syllable count), technical term density, sentence length
- [ ] Reference existing patterns in `calculator.ts` (see `calculateReadability`)
- [ ] Map result to 0-100 scale
- [ ] Add unit test in `__tests__/calculator.test.ts` with 5 test cases (simple, medium, complex, technical, mixed)
- Verification: `npm test -- calculator.test.ts` passes

## Phase 3: Integrate into Pipeline

- [ ] In `calculator.ts` main function, call `calculateDifficulty` and store result
- [ ] Update return type to include difficulty_score
- Verification: Run existing pipeline tests, all pass

## Phase 4: Update API

- [ ] In `content/api/scores/route.ts`, include difficulty_score in response
- [ ] Verify API contract: curl `/api/scores/{id}` returns difficulty_score field
- Verification: Integration test passes

## Dependencies

- None — this extends existing patterns

## Rollback

1. Database rollback: `npx drizzle-kit migrate:down`
2. Code revert: `git revert HEAD` (single commit if done right)

---

Notice what this plan has: actual file paths, specific functions, clear verifications. This isn't hand-waving. I can execute this task by task.

## The Discipline of Small Tasks

The hardest part of implementation planning is resisting the urge to combine tasks. "Just add the field and wire it up" sounds efficient. It's not. It's how you end up with half-done work.

Hermes will try to please you. If your prompt implies you want speed over precision, you'll get combined tasks. Fight this. Use explicit constraints:

```text
Each task must be:
- Completable in under 4 hours
- Independently verifiable (I can run a test or check to confirm it's done)
- Not blocked by any other task in the same phase
```

This constraint forces Hermes to break things down. Sometimes it breaks them down too far — a task that takes 15 minutes. That's fine. Better too small than too big. You can always batch micro-tasks when you execute. But you can't un-batch a monolith task when you hit a blocker at 4 PM on Friday.

## Handling Dependencies

A plan without dependency tracking is just a wish list. Here's how to handle them:

**External dependencies** (things you don't control):

```text
Dependencies:
- External: Content API v2 must be live (ETA: June 15)
- External: Design team must provide difficulty scale definitions
```

Hermes should flag these. When it doesn't, you're reading a plan that assumes things will just work. They won't.

**Internal dependencies** (things you do control):

```text
Dependencies:
- Internal: Phase 1 must complete before Phase 2 (database column exists)
- Internal: Task 3.2 must complete before Task 4.1 (API contract defined)
```

These are your sequencing constraints. They're not optional. When a task says "depends on" that means you literally cannot start it until the dependency completes. If you find yourself starting a task with open dependencies, stop. You're pretending to work.

## The Verification Trap

Most plans have terrible verification steps. "Test it" is not a verification step. Here's what good verification looks like:

**Bad:** 
```text
- [ ] Test the endpoint
```

**Good:**
```text
- [ ] Run: curl https://api.example.com/v1/scores/123 | jq -e '.difficulty_score != null'
- [ ] Verify: Response includes difficulty_score field with number value
- [ ] Verify: Value between 0-100 inclusive
- [ ] Edge case: Empty content returns difficulty_score of 0
```

Good verification is a checklist you can actually execute. If you can't write the exact command or check that would verify completion, your task isn't defined.

I push Hermes to be specific:

```text
For each verification step, include:
- The exact command to run OR
- The exact check to perform OR  
- The expected observable outcome
```

This discipline feels tedious. It's what separates plans that ship from plans that sit in Notion for six months.

## Rollback Is Not Optional

Every plan needs a rollback section. Not because you expect to fail. Because when you do fail at 11 PM, you need to know what to do without thinking.

Good rollback steps:

```text
Rollback:
1. Database: `npx drizzle-kit migrate:down` (removes difficulty_score column)
2. Code: `git revert <commit-sha>` (single commit for entire feature)
3. Cache: Clear Redis keys matching "scores:*" 
4. Verify: `curl /api/health` returns 200
5. Verify: `curl /api/scores/123` no longer includes difficulty_score field
```

Notice that verification steps apply to rollback too. You don't just "undo" — you confirm that undo worked. Hermes will often forget this. Remind it.

## The Iterative Planning Loop

The first plan Hermes generates won't be perfect. You need to iterate. Here's the loop:

```
Generate plan → Review for gaps → Ask Hermes to clarify → Review again → Execute first phase → Spot new issues → Update plan
```

This isn't failure. This is how good plans get made. The point of the plan isn't to predict the future perfectly. It's to force you to think through the work before you start typing.

**Example iteration:**

First pass, Hermes gives me:
```text
Phase 2: Implement calculation
- [ ] Write difficulty calculation function
```

I push back:
```text
Be specific. What algorithm? Where does it go? What inputs does it take? What tests validate it?
```

Second pass:
```text
Phase 2: Implement calculation
- [ ] In `calculator.ts`, add function signature: `calculateDifficulty(content: string): number`
- [ ] Use Flesch-Kincaid reading ease formula: 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
- [ ] Scale result: 100 = easiest, 0 = hardest (invert standard formula output)
- [ ] Handle edge case: empty content string returns 0
- [ ] Add unit tests in `__tests__/calculator.test.ts` for: simple text (expect ~100), technical text (expect ~30-50), empty string (expect 0)
```

That's executable. That's a plan you can hand to anyone and they'll know what done looks like.

## Execution Strategy

Once you have a good plan, you execute it. But even here, Hermes helps.

Don't just work from the plan document. Load it into the session:

```text
Reference the plan we just created. I'm starting Phase 1. The first task is:
- Add `difficulty_score: number (0-100)` to `content/scoring/models.ts` interface

Work through this task. Ask me if the location looks different than expected.
```

Hermes knows the context. It knows what you're trying to build. It can help implement instead of just plan. But when it implements, it's following the plan you've already validated.

This is the key: **Plan with Hermes, then execute with Hermes.** Don't skip the planning. A good hour of planning saves you five hours of "oh wait, I didn't think about..."

## When Plans Change

Plans change. Requirements shift, blockers appear, you learn something that invalidates an assumption. When this happens: update the plan.

Don't just hack around it. Go back to the plan document, mark completed tasks, strike through abandoned tasks, add new ones. The plan is a living document until the feature ships.

Hermes can help here too:

```text
We hit a blocker: the content API doesn't return word counts, only character counts. Update the difficulty calculation to use character-based heuristics instead. Adjust Phase 2 tasks accordingly.
```

Hermes will revise the plan. Review the revision. Execute the new plan.

## From Plan to Pull Request

The implementation plan becomes your pull request description. Every task in the plan maps to commit or a file change. The verification steps become your PR checklist.

This isn't incidental. It's intentional. The work of planning is the work of communicating what you did and why. A well-planned feature ships faster and is easier to review because the hard thinking happened before the code was written.

## Quick Reference

Here's a minimal template you can drop into any session:

```text
Create an implementation plan for: [FEATURE]

Structure:
1. Prerequisites (what must exist)
2. Breakdown into phases (independent deployable chunks)
3. Dependencies (external and internal)
4. Verification (specific checks for each phase)
5. Rollback (how to unwind)

Constraints:
- Each task completable in 2-4 hours
- Each task independently verifiable
- Include actual file paths and function names

First explore the codebase to understand current patterns.
```

## Wrapping Up

Implementation planning isn't bureaucracy. It's the difference between shipping and almost shipping. Every time I've skipped the plan, I've paid for it in rework, scope creep, and 4 AM debugging sessions.

Hermes makes planning faster, but it doesn't make it optional. The AI can generate the structure, suggest the breakdown, even spot dependencies you missed. But you still need to review it, challenge it, and accept that the first draft is never the final draft.

Start with a plan. Execute against the plan. Verify the plan. That's how features ship.

The next time you have a vague idea for something to build, don't open your editor. Open a session with Hermes. Write the plan first. Your future self — the one reviewing the PR at 3 PM instead of debugging at 3 AM — will thank you.

---

*This post is part of Liam's Landing — where I share practical engineering guides for working with AI agents.*
