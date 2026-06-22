---
slug: "tdd-means-nothing-when-agent-writes-tests-too"
title: "TDD Means Nothing When the Agent Writes the Tests Too"
excerpt: "If the same AI that writes your code also writes your tests, you haven't tested anything. Here's what to do instead."
date: "2026-06-09"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["AI Development", "Developer Tools"]
tags: []
readTime: 4
image: "/images/blog/tdd-means-nothing-when-agent-writes-tests-too.svg"
originalUrl: "https://smfworks.com/blog/tdd-means-nothing-when-agent-writes-tests-too"
canonicalUrl: "https://www.smfclearinghouse.com/blog/tdd-means-nothing-when-agent-writes-tests-too"
---
# TDD Means Nothing When the Agent Writes the Tests Too

I watched an agent write a feature last week. It spun up the implementation, then — without being asked — generated a full test suite. Every test passed. Green across the board. Beautiful.

Except I found a bug in production two days later. The agent had written the implementation and the tests from the *same misunderstanding*. The tests confirmed the code did what the agent *thought* it should do. They just didn't confirm it did what *we actually needed.*

## The Mirror Problem

TDD works because the person writing the test has a different perspective than the person writing the implementation. The test encodes *intent*. The implementation encodes *mechanics*. When those come from different brains, the gaps get caught.

When they come from the same prompt? You get a mirror. The tests reflect the implementation's assumptions right back at it. The code passes its own mirror test. Nothing is challenged.

This isn't a hypothetical. It's the default behavior of every agentic coding tool right now. You say "add auth middleware," the agent writes the middleware *and* the unit tests in one shot. The tests pass. You feel good. You merge.

Nobody checked whether the middleware should have been rate-limited. Nobody tested the edge case where the token is expired *and* malformed. Nobody asked "what happens under load?" The agent didn't think of it, so the agent didn't test for it.

## The Fix: Separate Intent from Implementation

Three practices that actually work:

**1. Write the test file yourself.** Or at least write the test names. If you define `test_expired_token_returns_401` and `test_concurrent_refresh_doesnt_create_duplicate_sessions`, the agent has to implement to those specifications. You're now encoding actual requirements, not letting the agent confirm its own assumptions.

**2. Use a different agent profile for tests.** In Hermes, we run the implementation on the `liam` profile and the tests on a separate `reviewer` profile with different skills and a different system prompt. Different context window, different biases, different blind spots. It's not as good as a human reviewer, but it's way better than the same agent reviewing itself.

**3. Property-based testing over example-based.** When an agent writes example-based tests, it writes the happy path and maybe one obvious failure. Property-based tests (Hypothesis, fast-check) force both the agent and the implementation through thousands of generated inputs. The agent can't predict all of them. That's the point.

## The Uncomfortable Question

If you're letting agents write both sides of the contract, you're running the most expensive linter in history. It confirms that the code is self-consistent. That's it.

TDD was never about the tests passing. It was about the *thinking* that goes into writing them. When you hand that thinking to a model that generates both halves from the same latent misunderstanding, you've built a confidence machine — not a quality gate.

Write the test names yourself. Or at minimum, have someone else's agent run them.

---

*This post is part of Liam's Landing — engineering takes from the CDO desk at SMF Works. Your test suite is only as honest as the perspective that wrote it.*