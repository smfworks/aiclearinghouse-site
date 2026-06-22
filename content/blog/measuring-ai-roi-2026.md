---
slug: "measuring-ai-roi-2026"
title: "Most Companies Can't Tell You If Their AI Is Working. Here's How to Fix That."
excerpt: "Enterprise AI spending is surging past $300 billion, but when you ask most leaders what they're getting back, the answer is hand-waving and demo metrics. Here's a practical framework for measuring AI ROI that doesn't require a data science team."
date: "2026-05-07"
author: "Aiona Edge"
authorKey: "aiona"
series: "clearinghouse"
categories: ["AI Strategy", "Business", "ROI"]
tags: []
readTime: 7
image: "/images/blog/measuring-ai-roi-2026.png"
originalUrl: "https://smfworks.com/blog/measuring-ai-roi-2026"
canonicalUrl: "https://www.smfclearinghouse.com/blog/measuring-ai-roi-2026"
---
# Most Companies Can't Tell You If Their AI Is Working. Here's How to Fix That.

**By Aiona Edge | CIO, The SMF Works Project*

---

There's a question I've started asking in every AI strategy conversation, and the responses tell me more than any slide deck ever could.

The question is: "What would you lose if you turned off all your AI tools tomorrow?"

The most common answer, after a pause? "I'm not sure."

That's a problem. Not because these leaders are bad at their jobs — most of them are sharp, experienced, and have spent millions on AI over the last two years. The problem is that they were sold AI on promise and have been tracking it on vibes.

Global enterprise AI spending is projected to exceed $300 billion in 2026. Consulting firms are raking in billions on AI transformation engagements. Every vendor demo now ships with a "productivity gains" slide that would make you think AI is printing money while you sleep.

And yet, when I ask the basic question — "prove it" — almost nobody can.

This isn't a post about why AI is worth the investment. We've covered that ground. This is a post about how to measure whether it actually is, using numbers you can defend in a boardroom.

---

## Stop Measuring What's Easy. Start Measuring What Matters.

The most common AI "ROI" metrics I see in the wild are:

- Number of Copilot licenses deployed
- Number of prompts run
- Percentage of employees who have "tried" an AI tool
- Survey responses asking people if AI "makes them more productive"

These are not ROI metrics. They are deployment metrics and sentiment data in nice clothes.

Here's what happens when you rely on them. You get a dashboard that says 72% of employees report feeling more productive with AI — and you have no idea whether that means the company is actually producing more output, closing deals faster, or spending less on operations. You have a feeling, dressed up as a number.

The fix is not more sophisticated measurement. It's measuring the right things in the first place.

---

## The Only Three AI ROI Metrics That Matter

After watching dozens of organizations wrestle with this — and getting it wrong myself before getting it right — I've landed on a framework that works across industries and team sizes. Three categories. Pick one metric in each. Track it relentlessly.

### 1. Throughput: Are we producing more output per unit of input?

This is the most direct measure of whether AI is doing anything useful. It answers: with the same people and the same time, are we producing more?

Examples that actually work:

- **Customer support:** Tickets resolved per agent per day, before and after AI assist
- **Sales:** Qualified opportunities generated per rep per month
- **Software:** Story points delivered per sprint per team
- **Content:** Published pieces per writer per week
- **HR:** Cases closed per specialist per month
- **Legal:** Contracts reviewed per attorney per week

The key is that you're measuring output volume, not effort. Number of prompts run is effort. Number of tickets resolved is output. They are not the same thing.

One organization I worked with was proud of running 50,000 Copilot prompts a month in their legal department. When we actually measured contract throughput, the number was flat. The lawyers were using AI — they just weren't using it on work that moved the needle. Prompts are not productivity.

### 2. Cycle Time: How much faster are we completing end-to-end processes?

Throughput measures volume. Cycle time measures speed. Both matter, but for different reasons.

Cycle time is the metric that tells you whether AI is compressing work that used to take days into hours, or hours into minutes. It's also the metric most likely to make your CFO sit up and pay attention, because time is the one resource you can't buy more of.

Pick an end-to-end process, not a task:

- **Bad:** "AI makes writing emails 40% faster." Great. What does that actually unlock? If the email still sits in a review queue for three days, the 40% speedup on drafting is irrelevant.
- **Good:** "Average deal cycle from first contact to signed contract dropped from 34 days to 22 days after implementing AI-assisted proposal generation and follow-up sequencing."

The Accenture Copilot rollout I wrote about yesterday showed 97% of users reporting tasks completed up to 15 times faster. That's a compelling number, but the real question their leadership is asking is: does that task-level speed translate to process-level acceleration? Task speed without process speed is a treadmill, not a racecar.

### 3. Cost Per Outcome: Are we spending less to achieve the same or better results?

This is where ROI becomes actual ROI — return on investment in the accounting sense of the term.

The formula is simple: total AI spend (licenses + implementation + training + change management + ongoing maintenance) divided by the number of outcomes produced.

But here's where most organizations trip: they define "outcome" too broadly or not at all. You need a denominator.

- **Customer support:** Cost per resolved ticket
- **Sales:** Cost per qualified opportunity generated
- **Recruiting:** Cost per qualified hire through pipeline
- **Software development:** Cost per feature shipped
- **Content marketing:** Cost per engaged reader or qualified lead

The magic of cost-per-outcome is that it forces honesty. If your AI tools cost $200,000 a year and you're generating incremental outcomes worth $180,000, the answer isn't "AI is failing" — it's "we need to adjust where and how we're applying it." But you can't have that conversation without the number.

---

## The Trap: Confusing Activity With Progress

There's a particular pathology I see in enterprises that have spent heavily on AI. I call it the Activity Trap.

It works like this: leadership announces an AI initiative. Budget gets allocated. Licenses get purchased. A center of excellence gets formed. Internal newsletters start going out with AI tips. Somebody builds a dashboard showing prompt volume trending up and to the right.

Everyone feels like progress is happening because there's so much activity.

But activity is not output. And feeling productive is not the same as being productive — a distinction that should be obvious but gets lost the moment a vendor starts showing you sentiment survey data.

The test is brutally simple. Pick any function where you've deployed AI. Take the month before deployment and the most recent full month. Compare:

- Total output volume (not AI usage volume — actual work completed)
- Average time to completion for end-to-end processes
- Total cost of that function as a percentage of revenue or output

If none of those have moved in the right direction, the AI is not working. It doesn't matter how many prompts were run or how positive the survey responses were.

This isn't cynicism. It's the same standard you'd apply to any other investment. You wouldn't accept "employees report enjoying the new ERP system" as proof the ERP was worth seven figures. Don't accept it for AI.

---

## How to Start Measuring Tomorrow Morning

You don't need a data warehouse migration or a six-month measurement strategy engagement from a consulting firm. You need three things:

### 1. Pick one workflow. One.

Not your entire AI portfolio. The one process where you have the strongest hypothesis that AI should be driving measurable improvement. Customer ticket resolution. Sales proposal generation. Code review turnaround. One thing.

### 2. Get the baseline.

Go back and pull the numbers for that workflow from the pre-AI period. Monthly output volume. Average cycle time. Total cost. Write them down somewhere public. If you didn't collect these before deploying AI, use the earliest data you have — but be honest about the gap.

### 3. Measure monthly. Report quarterly.

Set up a simple tracker — a spreadsheet is fine — that compares current numbers against baseline every month. Share the results with leadership quarterly, in a format that fits on one page. No caveats. No narrative about "building momentum." Just the numbers and the direction they're moving.

If the numbers aren't moving after two quarters, you have a real conversation to have. It might mean the AI tool is wrong for the workflow. It might mean adoption is the bottleneck. It might mean the workflow itself needs redesign. But you'll be having the conversation with data instead of opinions.

---

## The Bottom Line

$300 billion is a lot of money to spend without knowing what you're getting back.

The organizations that will win the AI era are not the ones with the most sophisticated models or the biggest license counts. They're the ones that can answer the question — "what happens if we turn it off?" — with a specific, quantified answer they can defend.

Everything else is vibes dressed as strategy.

Vibes don't survive board meetings.

---

*Aiona Edge is CIO of The SMF Works Project, where she helps organizations bridge the gap between AI investment and measurable business value. She believes spreadsheets are infrastructure and has never met an ROI metric she couldn't make useful.*
