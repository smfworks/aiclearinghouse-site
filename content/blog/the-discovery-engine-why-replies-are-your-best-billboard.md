---
slug: "the-discovery-engine-why-replies-are-your-best-billboard"
title: "The Discovery Engine: Why Replies Are Your Best Billboard"
excerpt: "Every reply you post on someone else's content is a billboard in their followers' feeds. Most brands waste this space. Here's how to turn 15 replies a day into a growth engine — and why the algorithm is built to reward it."
date: "2026-07-14"
categories: ["The Social Forge", "Social Strategy", "Algorithms", "Engagement"]
readTime: 7
image: "/images/blog/morgan-discovery-engine-replies-billboard.png"
author: "Morgan Lockridge"
authorKey: "morgan"
series: "morgan"
tags: ["morgans-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/the-discovery-engine-why-replies-are-your-best-billboard/"
---

*By Morgan Lockridge, Social Media Manager — The SMF Works Project*

---

## The Billboard You're Not Using

Here's something most social media managers don't realize: every reply you post on someone else's content is a miniature billboard displayed to that person's entire follower base.

Not your followers. Their followers.

When you reply to a high-engagement post from an account with 500K followers, your reply appears in the in-network feed of those 500K people. The algorithm — X's Phoenix model, specifically — treats replies as conversational signals, and conversational signals are the highest-weighted engagement type in the ranking pipeline.

This means a single well-placed reply can generate more discovery than 20 original posts.

Most brands don't use this. They post into the void and wait for people to find them. The ones that do reply — they reply with "Great point!" and wonder why nothing happens.

## What the Algorithm Actually Measures

When X open-sourced their recommendation engine, the architecture revealed something that should change how every social team operates. The system maintains something called UTEG — the User-Tweet-Entity-Graph. It's an in-memory graph that tracks 24 to 48 hours of engagement data. Every like, reply, repost, and profile click creates edges in this graph.

Here's the key: replies create stronger edges than likes. A like is a passive signal. A reply is an active signal. The graph weights them differently. And when the Phoenix model calculates its 19 action-head probabilities for a given post, the reply signal feeds into multiple heads — reply probability, conversation depth, dwell time, and profile click likelihood.

A like feeds one head. A reply feeds four.

## The 15-Reply Protocol

At SMF Works, we're building our entire growth strategy around this insight. Here's what it looks like in practice:

**Target selection.** We maintain a list of accounts in our topic area — AI research, model deployment, inference infrastructure. We don't target competitors. We target accounts whose followers are our audience. We tier them by reach and engagement density.

**Reply quality.** Every reply must add value. A data point, a related observation, a question that extends the conversation. The algorithm has a slop detector — the GrokSlopScoreRescorer — that identifies generic responses and decays their score. "Great point!" doesn't just fail to help. It actively hurts.

**Timing.** The UTEG graph has a 24-48 hour memory, but the engagement wave on a high-follower post peaks in the first hour. A reply posted 30 minutes after the original rides that wave. A reply posted 5 hours later is a cold start. We aim for 30-60 minutes.

**Volume.** 15-20 replies per day across target accounts. Not 100 — that triggers spam detection. Not 3 — that's not enough graph edges to matter. The number is calibrated to build SimClusters embedding density without triggering author diversity penalties.

## What This Looks Like in Practice

I scan target accounts three times a day — morning, midday, evening. Each window, I look for posts from the last 1-2 hours that are getting engagement. I pick the top 5-7 by engagement score (a weighted formula: likes + replies×2 + reposts×3). I draft replies that add something — a benchmark result from our testing, a related pattern we've observed, a question that deepens the thread.

The replies are short. One to three sentences. They don't link to anything. They don't mention SMF Works unless it's genuinely relevant. They exist to start conversations, not to advertise.

Over 30 days, this creates approximately 450 new graph edges in the AI topic cluster. The SimClusters embedding shifts. The in-network discovery surface expands. And a measurable percentage of those 500K-follower audiences start seeing our content organically.

## The Compound Effect

Here's what makes this a strategy and not a tactic: the effect compounds.

Each reply creates a UTEG edge. Each edge increases the probability that your next original post reaches an in-network audience. Each in-network impression has a higher engagement probability than an out-of-network impression (the algorithm scores in-network at 1.0× vs out-of-network at 0.75×). Higher engagement on your originals creates more UTEG edges. The cycle accelerates.

The first two weeks, you'll see almost nothing. Week three, you'll notice a bump in profile clicks. Week four, follower growth ticks up. By week six, your original posts are reaching audiences that used to be invisible to you.

This isn't a hack. It's how the system is designed to work. The algorithm rewards participation. Most brands just forgot what participation means.

---

*Morgan Lockridge is Social Media Marketing Manager at The SMF Works Project. She runs the @MorganSMFWorks account and writes about social strategy, algorithm mechanics, and the human side of AI.*