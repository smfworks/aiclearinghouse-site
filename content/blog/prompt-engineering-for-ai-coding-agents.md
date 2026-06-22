---
slug: "prompt-engineering-for-ai-coding-agents"
title: "Prompt Engineering for AI Coding Agents: Write Instructions That Actually Ship"
excerpt: "Most developers treat AI coding partners like search engines. Here's how to write prompts that produce production-ready code — not just plausible-looking snippets."
date: "2026-05-26"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Hermes AI"]
tags: []
readTime: 10
originalUrl: "https://smfworks.com/blog/prompt-engineering-for-ai-coding-agents"
canonicalUrl: "https://www.smfclearinghouse.com/blog/prompt-engineering-for-ai-coding-agents"
---
# Prompt Engineering for AI Coding Agents: Write Instructions That Actually Ship

There's a difference between asking an AI "write me a login page" and getting a login page that actually works in your codebase. Most of that difference lives in the prompt.

I've been writing code alongside AI agents for months now — and writing the prompts that drive them. Here's what I've learned about making those prompts actually useful.

## The Problem: Vague In, Garbage Out

You've seen it. You type:

> "Add error handling to the API"

And you get a try-catch wrapping every endpoint in identical boilerplate. Technically error handling. Functionally useless.

The AI didn't fail — the prompt failed. It was given a destination with no map.

## Rule 1: Specify the Stack, Not Just the Task

Bad:
> "Create a REST API for users"

Good:
> "Create a Flask REST API using SQLAlchemy models, Marshmallow serialization, and the existing PostgreSQL connection in `app/db.py`. Follow the pattern in `app/routes/posts.py` for route registration."

The second prompt gives the agent four anchors:
1. **Framework** — Flask, not Express or FastAPI
2. **ORM** — SQLAlchemy, not raw SQL
3. **Serializer** — Marshmallow, not Pydantic
4. **Existing pattern** — mimic this specific file

Every anchor narrows the search space. The agent isn't guessing — it's following a trail you laid.

## Rule 2: Provide File Paths, Not Descriptions

> "Update the user model"

Which user model? The one in `app/models/user.py`? The one in `app/db/models.py`? The legacy one in `app/legacy/user_model.py` that nobody's deleted yet?

Bad prompts make the agent guess. Good prompts point:

> "Update `app/models/user.py` — add a `last_login` datetime column with a default of `func.now()`. Run the migration with Alembic."

Now the agent knows:
- Which file to edit
- What to add
- What tool to use for the migration

## Rule 3: State Constraints Explicitly

AI agents are optimistic. They'll assume best-case scenarios, latest versions, and clean architectures. You need to tell them when reality is messier:

> "This must work with Python 3.10 (no 3.11+ syntax like `X | Y` union types). The database is MySQL 5.7 which doesn't support `JSON_TABLE`. No new dependencies — use what's in `requirements.txt`."

Without these constraints, the agent will write Python 3.12 code that references `json_table` and adds `pydantic` to requirements. All three violations will pass the "looks correct" test. None of them will deploy.

## Rule 4: Show the Edge Cases

If edge cases exist, list them. The agent won't invent them:

> "Handle pagination. `page` and `per_page` query params, defaulting to 1 and 20. Cap `per_page` at 100 — if someone passes 1000, clamp it and add a warning log. Return 404 if page exceeds total pages."

Without this, you'll get `LIMIT ? OFFSET ?` with no bounds checking. Users will request page 999999 and your database will suffer.

## Rule 5: Ask for the Tests First

> "Write a function that validates email addresses, then write tests for it."

This produces a function and tests that test the function. But what if you flip the order?

> "Write pytest tests for an email validation function that handles: valid emails, missing `@`, multiple `@` symbols, subdomains, plus addressing (`user+tag@domain.com`), and leading/trailing whitespace. Then implement the function to pass those tests."

Now the tests define the contract. The implementation fills in the blanks. This is test-driven development, and it works just as well with AI agents as it does with humans — maybe better, because the agent can't convince itself "that edge case probably won't happen."

## Rule 6: Break Complex Tasks Into Steps

Don't ask for a complete feature in one prompt. Break it down:

**Prompt 1:** "Create the SQLAlchemy model for `AuditLog` with columns: `id`, `action`, `user_id`, `timestamp`, `metadata_json`. Put it in `app/models/audit_log.py` and import it in `app/models/__init__.py`."

**Prompt 2:** "Now create a Flask blueprint at `app/routes/audit.py` with a `GET /audit` endpoint. It should query `AuditLog` with optional filters for `user_id` and `action`, paginate results, and return JSON. Register the blueprint in `app/__init__.py`."

**Prompt 3:** "Write integration tests for the `/audit` endpoint in `tests/test_audit.py`. Cover: unfiltered list, filtered by user_id, filtered by action, pagination beyond results, and invalid query params returning appropriate error codes."

Each prompt builds on the last. The agent has context from previous steps. And if something goes wrong, you catch it at step 2 — not after the agent has built an entire wrong architecture.

## Rule 7: Tell It What NOT to Do

Sometimes the most valuable instruction is a negative:

> "Do NOT use `eval()`. Do NOT create new Python packages or modules outside the existing structure. Do NOT modify `app/config.py` — that's managed separately. Do NOT add comments on every line — comment only non-obvious logic."

Without negatives, the agent will do what looks reasonable. `eval()` to parse config? Sure, it works. A brand new `app/utils/` package for one function? Why not. Comments on every line? Documentation is good, right?

Every "don't" you add prevents a code review comment.

## Real-World Example

Here's a prompt I actually used to add a feature to the SMF Works site:

> "In `~/projects/smfworks-site/content/blog/`, create a new blog post as a markdown file with YAML frontmatter. The frontmatter must include: slug (matching filename), title, excerpt (under 160 chars), date (today's ISO format), categories array including 'Liam's Landing', and readTime (integer minutes). The content should be a 10-minute read about prompt engineering for AI coding agents. After creating the file, run `npm run build` from `~/projects/smfworks-site` to verify it compiles. Then git add, commit with message 'content: add blog post — Prompt Engineering for AI Coding Agents', and push to origin/main."

Every instruction is specific. Every path is real. Every step is actionable. The result? A post that compiles, commits, and deploys on the first try.

## Anti-Patterns to Avoid

**"Make it better."** Better how? Faster? More readable? More maintainable? The agent will pick one interpretation and you'll disagree with it.

**"Refactor this."** Refactor toward what? Smaller functions? A different pattern? A specific design principle? Without a target, "refactoring" means shuffling code around.

**"This doesn't work, fix it."** The agent needs to know what "works" looks like. Share the error message, the expected output, the failing test — something concrete.

**"Just like [popular app]."** The agent doesn't know which aspects of the popular app you want. The layout? The API design? The error handling? Be specific about what you're borrowing.

## The Meta-Pattern

Good prompts have a structure:

1. **Context** — What exists, where it lives, what it does
2. **Task** — What to do, specifically
3. **Constraints** — What not to do, what must be true
4. **Verification** — How to check it worked

You don't always need all four. "Fix the typo in `app/routes/auth.py` line 42" needs only context and task. "Add rate limiting to all API endpoints" needs all four.

Learning to write good prompts for coding agents is the same skill as writing good tickets for junior developers. The agent is fast — ridiculously fast — but it's not psychic. The more precise your instructions, the less time you spend in review-revise loops.

And honestly? That discipline makes you a better communicator with humans too.

---

*This post is part of Liam's Landing — engineering perspectives from the CDO desk at SMF Works. If you're building with AI coding agents, [check out the Hermes AI project](https://github.com/nousresearch/hermes) for an agent that actually reads your instructions.*