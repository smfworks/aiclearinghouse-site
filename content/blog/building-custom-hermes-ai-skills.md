---
slug: "building-custom-hermes-ai-skills"
title: "Building Custom Skills for Hermes AI: Teach Your Agent New Tricks"
excerpt: "Hermes AI gets smarter when you give it skills — reusable, versioned instruction sets that turn a general-purpose agent into a specialist. Here's how to build, test, and iterate on your own custom skills from scratch."
date: "2026-05-22"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI", "Engineering", "Hermes AI", "Tutorial"]
tags: []
readTime: 10
originalUrl: "https://smfworks.com/blog/building-custom-hermes-ai-skills"
canonicalUrl: "https://www.smfclearinghouse.com/blog/building-custom-hermes-ai-skills"
---
# Building Custom Skills for Hermes AI: Teach Your Agent New Tricks

You've got Hermes AI installed. You've configured a model provider. You've run a few prompts and watched it write code, search files, and deploy changes. That's the baseline — a capable generalist that can reason about anything you throw at it.

But the real power kicks in when you stop treating it like a chatbot and start treating it like an engineer you're onboarding. New hires don't start from scratch every day. You give them runbooks, checklists, playbooks. In Hermes, those are **skills** — structured, versioned instruction sets that the agent loads before tackling a task.

This post walks through building a custom skill from scratch: what goes in one, how to test it, and the patterns that separate a useful skill from a glorified prompt.

## What a Skill Actually Is

A skill is a directory under `~/.hermes/skills/` (or your profile's skills directory) containing at minimum a `SKILL.md` file. That's it. No code compilation, no plugin registry, no installation step. You write markdown, you drop it in the right folder, it's live.

Here's the skeleton:

```
~/.hermes/skills/
└── my-custom-skill/
    └── SKILL.md
```

The `SKILL.md` file has two parts:

1. **YAML frontmatter** — metadata the system reads to index and classify the skill
2. **Markdown body** — the actual instructions the agent follows when the skill is loaded

Let's build one.

## The Skill We're Building: API Endpoint Generator

We're going to build a skill that guides Hermes through creating a new REST API endpoint in a Flask application. Not just "write an endpoint" — a structured process that handles validation, error handling, tests, and documentation.

### Step 1: Create the Skill Directory

```bash
mkdir -p ~/.hermes/skills/flask-api-endpoint
```

### Step 2: Write the SKILL.md

This is where the real work happens. A good skill isn't a single instruction — it's a process.

```markdown
---
name: flask-api-endpoint
description: Structured workflow for adding a new REST API endpoint to a Flask application — route definition, validation, error handling, tests, and docs.
category: software-development
tags: [flask, api, rest, python, testing]
---

# Flask API Endpoint Generator

When asked to add a new REST API endpoint to a Flask application, follow this workflow in order.

## 1. Gather Requirements

Before writing any code, confirm these details with the user:
- HTTP method (GET, POST, PUT, PATCH, DELETE)
- URL path (e.g., `/api/v1/users`)
- Request body schema (fields, types, required/optional)
- Response schema (what the endpoint returns on success)
- Auth requirements (none, API key, JWT, session)
- Which Flask app/blueprint to add it to

## 2. Locate the Application Entry Point

Find the Flask app factory or blueprint registration:
- Look for `create_app()`, `app = Flask(__name__)`, or blueprint files
- Identify where routes are currently defined
- Match the project's existing pattern (blueprints vs. single file)

## 3. Implement the Route

Create the route following the project's existing conventions:

```python
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

class UserCreateSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(load_default='member')

@api_bp.route('/users', methods=['POST'])
def create_user():
    """Create a new user."""
    try:
        data = UserCreateSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    # Business logic here
    user = create_user_in_db(data)

    return jsonify({"data": user}), 201
```

Key rules:
- Always use schema validation (Marshmallow, Pydantic, or equivalent)
- Return consistent error format: `{"errors": {...}}`
- Return consistent success format: `{"data": {...}}`
- Use proper HTTP status codes (201 for creation, 204 for deletion, etc.)
- Add a docstring to every route function

## 4. Write Tests

For each endpoint, write tests that cover:
- Happy path (valid request, expected response)
- Validation failure (missing/invalid fields)
- Edge cases (empty body, extra fields, boundary values)
- Auth enforcement (if applicable)

Use pytest with the Flask test client:

```python
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client

class TestCreateUser:
    def test_success(self, client):
        response = client.post('/api/v1/users', json={
            'name': 'Ada Lovelace',
            'email': 'ada@example.com',
        })
        assert response.status_code == 201
        assert response.json['data']['name'] == 'Ada Lovelace'

    def test_missing_required_field(self, client):
        response = client.post('/api/v1/users', json={
            'name': 'Grace Hopper',
            # email missing
        })
        assert response.status_code == 400
        assert 'email' in response.json['errors']

    def test_invalid_email(self, client):
        response = client.post('/api/v1/users', json={
            'name': 'Test',
            'email': 'not-an-email',
        })
        assert response.status_code == 400

    def test_empty_body(self, client):
        response = client.post('/api/v1/users',
                               data='',
                               content_type='application/json')
        assert response.status_code == 400
```

## 5. Verify the Build

After implementation:
- Run the full test suite: `pytest`
- Run linting: `ruff check .` or `flake8`
- If the project has a `Makefile`, run `make test` or `make check`
- Do not mark the task complete until tests pass

## 6. Document the Endpoint

Add an entry to the project's API documentation (README, OpenAPI spec, or docs folder) with:
- Endpoint path and method
- Request body schema
- Response schema
- Error responses
- Example request/response pairs

## Pitfalls

| Pitfall | What Happens | Fix |
|---------|-------------|-----|
| No schema validation | Malformed data hits your database | Always validate before processing |
| Inconsistent error format | Frontend can't parse errors reliably | Use the same `{"errors": ...}` shape everywhere |
| Forgetting the test client | Tests try to hit a running server | Use Flask's built-in test client with `app.test_client()` |
| Hardcoded status codes | `return jsonify(data), 200` everywhere | Use `201` for creation, `204` for deletion, `404` for not found |
| Skipping auth on new routes | Security hole | Check auth requirements in step 1 and enforce in step 3 |
```

That's a real, useful skill. It's not one prompt — it's a multi-step process with code templates, rules, pitfalls, and verification steps. That's the difference between a skill and a system prompt.

### Step 3: Verify the Skill Loads

You don't need to restart anything. Hermes skills are loaded on demand. But you can verify the file is in the right place:

```bash
ls -la ~/.hermes/skills/flask-api-endpoint/SKILL.md
```

And check that Hermes sees it:

```bash
hermes skills list
```

You should see `flask-api-endpoint` in the output. If you do, you're live.

## What Makes a Good Skill

I've been writing skills for a while now. Here's what separates the ones that actually help from the ones that collect dust.

### Be Specific About When to Use It

The frontmatter `description` field is what Hermes reads when deciding which skill to load. If you write "helps with Python stuff," it won't trigger when it should. Write what the skill does and when:

```yaml
# Bad
description: Python helper

# Good
description: Structured workflow for adding a new REST API endpoint to a Flask application — route definition, validation, error handling, tests, and docs.
```

### Include Code Templates, Not Just Instructions

A skill that says "write validation logic" is less useful than one that says "here's the exact pattern." The agent will follow the template and adapt it to the specific task. Code templates in skills act like scaffolding — they give the agent a structure to fill in rather than making it start from a blank page.

### Add a Pitfalls Section

Every experienced engineer knows the gotchas. Your skill should too. The pitfalls table at the end of the Flask skill above isn't decoration — it's the most valuable part. When the agent hits an edge case, it checks the pitfalls first. This is the difference between an agent that makes the same mistakes every time and one that learns.

### Keep Skills Composable

Our Flask API endpoint skill assumes you already have a Flask project with a certain structure. That's fine — it's specific. But if you find yourself repeating setup steps across multiple skills, extract those into their own skill. Hermes can load multiple skills per task.

For example, if you have a skill for setting up Flask projects and a skill for adding endpoints, the endpoint skill doesn't need to explain how to create the project. It can just say "if the project doesn't exist, load the `flask-project-setup` skill first."

### Version Your Skills Like Code

Skills live in directories that can be git-tracked. When you update a skill — fix a pitfall, add a template, improve the description — commit it. You can (and should) keep your skills in a repo alongside your project code.

```bash
cd ~/.hermes/skills
git init
git add .
git commit -m "skills: initial skill definitions"
```

If something goes wrong, you can always roll back.

## Advanced Patterns

Once you've written a few skills, you'll start seeing patterns. Here are three that work well.

### Skills with Linked Files

A SKILL.md can reference scripts, templates, and config files stored alongside it:

```
~/.hermes/skills/flask-api-endpoint/
├── SKILL.md
├── templates/
│   ├── route.py.j2
│   └── test.py.j2
├── scripts/
│   └── generate.py
└── references/
    └── api-conventions.md
```

The agent reads `SKILL.md` first, then can access linked files when it needs them. This keeps the main instruction document concise while giving the agent deep references when the task requires them.

### Skills That Run Scripts

Some skills need to execute code, not just read instructions. The `scripts/` directory is for exactly this. For example, our image generation skill has a Python script that calls the Together AI API:

```markdown
## Generate an Image

Run the generation script:

\`\`\`bash
python3 ~/.hermes/skills/together-image-gen/scripts/generate.py \\
  "Your prompt here" \\
  --key "$TOGETHER_API_KEY" \\
  --model "black-forest-labs/FLUX.1-schnell" \\
  --width 1024 --height 576
\`\`\`
```

The script handles the API call, error handling, and output parsing. The skill just tells the agent when and how to invoke it.

### Skills as Process Checklists

Not every skill needs to generate code. Some enforce process. Our code review skill isn't a code generator — it's a checklist that the agent follows step by step:

```markdown
## Code Review Checklist

Before approving any pull request, verify:

1. **Tests pass**: Run the full test suite. Zero failures.
2. **No regressions**: Check that existing tests still pass with the new changes.
3. **Security scan**: No secrets, tokens, or API keys in the diff.
4. **Type safety**: If the project uses type hints, run mypy or pyright.
5. **Documentation**: Public functions have docstrings. README updated if behavior changed.
6. **Performance**: No N+1 queries, no unbounded result sets, no missing pagination.
```

This is arguably more valuable than a code-generation skill because it catches things the agent (or you) might forget in the moment.

## Testing Your Skills

The best way to test a skill is to use it. But here's a structured approach:

1. **Write the skill** based on a task you actually need to do
2. **Start a fresh session** so no context bleeds over
3. **Give Hermes a prompt that should trigger the skill** — something like "add a POST /api/v1/users endpoint to my Flask app"
4. **Watch what it loads**: Hermes will tell you which skills it loaded before starting
5. **Check the output** against each step in your skill
6. **Patch the skill** if the agent missed a step or produced output you didn't expect

Here's the loop:

```
Write skill → Use it → Observe gaps → Patch skill → Repeat
```

Skills aren't write-once. They're living documents that get sharper with every use. The best skills I have went through 5-10 iterations before they felt reliable.

## The Skill Author's Mindset

Writing skills is not prompt engineering. It's closer to writing onboarding documentation for a new team member. Think about it:

- A new hire doesn't need you to say "write good code." They need you to say "here's how we validate inputs, here's our error format, here's where tests go, and here's what happens if you forget step 3."
- A new hire doesn't need you to repeat the same instructions every day. They need a document they can reference.
- A new hire will make mistakes your documentation didn't cover. When they do, you update the docs.

That's exactly how skills work. You write the process once, the agent follows it every time, and when something goes wrong, you patch the skill so it never happens again.

## Quick Reference

| Task | Command |
|------|---------|
| List all skills | `hermes skills list` |
| View a skill | `hermes skills view <name>` |
| Create a skill | `hermes skills create <name>` |
| Edit a skill | Edit `~/.hermes/skills/<name>/SKILL.md` |
| Delete a skill | `rm -rf ~/.hermes/skills/<name>` |
| Test a skill | Start a fresh session, give a triggering prompt |

## Wrapping Up

Skills are the multiplier that turns a general-purpose AI agent into a team member that actually knows how your project works. They're version-controlled, composable, and they get better over time. Start with one skill for a task you find yourself repeating, iterate on it, and build from there.

The Flask API endpoint skill above is a real, working example. Drop it into your `~/.hermes/skills/` directory, start a session, and ask Hermes to add an endpoint to your Flask app. Watch it follow the process.

Then write your own. That's the whole point — Hermes becomes what you teach it.

---

*This post is part of Liam's Landing — where I share practical engineering guides for working with AI agents.*