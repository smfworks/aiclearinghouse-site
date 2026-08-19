---
slug: score-trajectory-not-just-outcome
title: Score the Trajectory, Not Just the Outcome
category: Evaluation
excerpt: An agent that returns the right answer through wrong reasoning will fail unpredictably. Score the path — tool calls, retries, decisions — not just the final output.
tags:
  - evaluation
  - trajectory
  - testing
  - agents
  - reliability
order: 99
last_verified: "2026-08-19"
---

# Score the Trajectory, Not Just the Outcome

## The principle

An agent that returns the correct answer can still fail trajectory evaluation. It might have called unnecessary tools, used wrong parameters, repeated the same step, or taken a convoluted route to get there. Outcome-only scoring gives that agent a perfect score. Trajectory scoring reveals the structural flaw.

This is not a theoretical concern. Studies show that agents evaluated only on final-output quality pass 20-40% more test cases than full trajectory evaluation reveals. The gap between outcome and trajectory scores is where production risk lives.

## Why it matters

Agents run the same workflow hundreds of times a day. An agent that "gets lucky" once may fail on the next run because the reasoning path was wrong — it just happened to arrive at the right answer through a fragile sequence. When the task changes slightly, the wrong reasoning breaks and the agent fails unpredictably.

Trajectory evaluation catches three failure types that outcome scoring misses:

1. **Right answer, wrong reasoning** — the agent skipped the diagnosis step and guessed correctly; next time it guesses wrong
2. **Unnecessary tool calls** — the agent called an expensive API it did not need, wasting cost and latency
3. **Looping and recovery failures** — the agent retried a failed call 5 times before succeeding; one more failure and it would have given up

## How to apply it

1. **Log every tool call, input, and output.** Not just the final response. Your trace should show the full path.
2. **Score each step independently.** Did the agent select the right tool? Did it pass the right parameters? Did it interpret the output correctly?
3. **Use pass-k, not pass@1.** Pass^1 records whether an agent completes a task once. Pass^4 requires it to complete the same task correctly on four independent runs. The gap between them is where production risk lives.
4. **Flag scrappy wins.** An agent that succeeds but took 15 steps when 3 would suffice is not reliable — it is expensive and fragile.
5. **Replay test with mocks.** Use replay testing and mock environments to make trajectory evaluation affordable — running the full agent against live APIs for every eval is too expensive at scale.

## Key trajectory metrics (2026 standard)

- **Tool selection accuracy**: Did the agent pick the right tool for the job?
- **Parameter precision**: Were the arguments correct and complete?
- **Step efficiency**: How many steps did it take vs. the minimum needed?
- **Recovery quality**: When a tool call failed, did the agent recover gracefully or loop?
- **Restraint**: Did the agent call a tool when it should have answered from context?

## Red flags

- Your eval suite only checks the final output
- You have never looked at a failed agent run's tool call sequence
- Pass@1 looks good but pass@4 drops significantly — and you do not know because you do not measure it
- An agent passes your eval but fails in production on slightly different inputs

## Quick win

This week, pull the trace from your last 5 failed agent runs in production. Score the trajectory — not the outcome. If the agent was doing something structurally wrong before it failed, your eval suite should have caught it. If it did not, you are evaluating outcomes, not trajectories.