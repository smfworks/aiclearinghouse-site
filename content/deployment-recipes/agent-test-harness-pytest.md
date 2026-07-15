---
slug: agent-test-harness-with-pytest
title: Build an Agent Test Harness with Pytest
excerpt: Treat your agent's behavior like production code — write repeatable tests that catch regressions before they reach users. No more "it worked yesterday" debugging.
category: Testing
tags:
  - testing
  - pytest
  - agents
  - regression
  - ci-cd
  - python
order: 20
last_verified: "2026-07-15"
difficulty: Intermediate
estimated_time: "35 min"
---

# Build an Agent Test Harness with Pytest

## The promise

Agents are notoriously hard to test because their outputs are non-deterministic. But "non-deterministic" does not mean "untestable." This recipe shows you how to build a pytest-based test harness that catches behavioral regressions in your agent workflows — the same way you test application code.

By the end, you will have a test suite that runs your agent against predefined scenarios, checks outputs against structured assertions, and fails loudly when behavior changes.

## What you'll get

- A pytest test suite for agent workflows
- Structured assertions that work with non-deterministic outputs
- A CI-ready test runner that exits non-zero on regressions
- A pattern for testing tool-use sequences, not just final text

## Prerequisites

- Python 3.11+
- An agent framework or custom agent loop (examples use a generic interface)
- Pytest installed (`pip install pytest`)
- An API key for your model provider (or a local model endpoint)

## Step 1: Define your agent interface

Create `agent.py`:

```python
import json
from openai import OpenAI

class Agent:
    def __init__(self, model="gpt-4o-mini", system_prompt=""):
        self.client = OpenAI()
        self.model = model
        self.system_prompt = system_prompt

    def run(self, user_input: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_input},
            ],
        )
        return response.choices[0].message.content
```

## Step 2: Write your first agent test

Create `tests/test_agent.py`:

```python
import pytest
import json
import os
from agent import Agent

# Skip tests if no API key is set
pytestmark = pytest.mark.skipif(
    not os.getenv("OPENAI_API_KEY"),
    reason="OPENAI_API_KEY not set"
)

@pytest.fixture
def summarizer():
    return Agent(
        model="gpt-4o-mini",
        system_prompt="Summarize the input in exactly one sentence."
    )

def test_summarizer_returns_single_sentence(summarizer):
    result = summarizer.run("The Apollo program landed humans on the Moon between 1969 and 1972. Twelve men walked on the lunar surface.")
    sentence_count = result.strip().count(".") 
    assert sentence_count == 1, f"Expected 1 sentence, got {sentence_count}: {result}"

def test_summarizer_preserves_key_facts(summarizer):
    result = summarizer.run("OpenAI released GPT-4 in March 2023 with a 128K context window.")
    result_lower = result.lower()
    assert "gpt-4" in result_lower or "gpt4" in result_lower
    assert "128" in result or "context" in result_lower
```

## Step 3: Test structured output

Agents that return JSON need schema validation, not string matching:

```python
def test_json_extraction_returns_valid_schema():
    agent = Agent(
        system_prompt="Extract person data as JSON with keys: name, age, role."
    )
    result = agent.run("Jane Smith is 34 and works as a senior engineer.")
    
    data = json.loads(result)
    
    assert "name" in data
    assert "age" in data
    assert "role" in data
    assert isinstance(data["age"], int)
    assert data["name"] == "Jane Smith"
```

## Step 4: Test tool-use sequences

For agents that call tools, test the sequence, not just the final answer:

```python
def test_research_agent_calls_search_before_synthesizing():
    calls = []
    
    def mock_search(query):
        calls.append({"tool": "search", "query": query})
        return "Result: Qwen3.5 72B scores 84 on MMLU."
    
    agent = Agent(system_prompt="Research the topic using search, then summarize.")
    agent.tools = {"search": mock_search}
    
    agent.run("What is Qwen3.5 72B's MMLU score?")
    
    assert len(calls) >= 1, "Agent should have called search at least once"
    assert any("qwen" in c["query"].lower() for c in calls)
```

## Step 5: Handle non-determinism with run thresholds

Not every test passes 100% of the time with LLMs. Use a "pass rate" pattern:

```python
@pytest.mark.flaky(reruns=3)
def test_code_generation_is_syntactically_valid():
    agent = Agent(system_prompt="Write a Python function that reverses a string.")
    result = agent.run("reverse a string")
    
    # Extract code from the response
    code = extract_code_block(result)
    
    # This should compile every time
    compile(code, "<test>", "exec")
```

## Step 6: Run in CI

Create `.github/workflows/agent-tests.yml`:

```yaml
name: Agent Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install pytest openai
      - run: pytest tests/ -v
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Verification

```bash
pytest tests/ -v
```

You should see each test pass (or skip if no API key). Tests that fail indicate a behavioral regression — either in your agent logic or in model updates.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Tests pass locally but fail in CI | Model version may differ. Pin the model ID in your agent config. |
| Flaky tests with non-deterministic output | Use `@pytest.mark.flaky(reruns=3)` and assert on structure, not exact wording. |
| API costs from running tests | Use a cheaper model (gpt-4o-mini) for tests. Cache responses with `vcrpy` for replay. |
| JSON parsing fails intermittently | Add retry logic or use structured output mode (`response_format={"type": "json_object"}`). |

## Next steps

- Add a regression test every time you find a bug in production
- Set up a nightly job that runs tests against the latest model version to catch silent regressions
- Use `pytest --cov` to measure which agent code paths your tests actually exercise