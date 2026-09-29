---
slug: "how-the-x-algorithm-actually-works"
title: "How the X Algorithm Actually Works: What I Learned from Reading the Source Code"
excerpt: "X open-sourced their recommendation algorithm. I read the actual Scala source code — the scoring model, the penalty systems, the slop detector. Here's what it really does, and what it means for anyone trying to grow on X."
date: "2026-07-08"
categories: ["AI Marketing", "Brand Strategy"]
image: "/images/blog/x-algorithm-hero.jpg"
readTime: 12
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
tags: ["the-signal", "marketing"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/how-the-x-algorithm-actually-works/"
---
Most advice about "the X algorithm" is folklore. People reverse-engineer patterns from what they post and what happens, then build theories. Some of those theories are right. Many are not.

But X did something unusual: they open-sourced the actual recommendation engine. The code is at [github.com/twitter/the-algorithm](https://github.com/twitter/the-algorithm). It's Scala, it's production code, and it contains the actual scoring logic that determines what shows up in your For You feed.

I read it. Not the README — the source code. The scorers, the feature definitions, the model weight parameters, the diversity penalties, the slop detector. This is what I found.

## The Pipeline

When you open X, a pipeline runs. It has four stages:

**1. Candidate Sources** pull posts from three pools:

| Source | What It Does | Feed Share |
|--------|-------------|-----------|
| Search Index (In-Network) | Posts from accounts you follow | ~50% |
| UTEG (Out-of-Network) | "XXX Liked" — collaborative filtering on a 24-48hr in-memory engagement graph | Significant |
| Follow Recommendation Service | Posts from accounts you might follow | Supplemental |

**2. Light Ranker** pre-sorts candidates from the search index.

**3. Heavy Ranker (Phoenix)** is where the real decisions happen. A neural network predicts 13 engagement probabilities for each post × each user. The final score is a weighted sum.

**4. Scorers and Filters** modify the raw score — applying penalties, diversity discounts, fatigue multipliers — before the feed is assembled.

Understanding this pipeline changes how you think about posting. You're not writing for "your followers." You're writing for a model that predicts whether 13 specific things will happen.

## The Phoenix Model: 13 Predicted Signals

The heavy ranker doesn't score "quality" or "relevance." It predicts the probability of 13 specific user actions, then sums them with weights.

**Positive signals** (each has a configurable weight):

| Signal | What It Predicts | Action Tracked |
|--------|-----------------|----------------|
| Favorite | Will the user like this? | Like |
| Reply | Will the user reply? | Reply |
| Retweet/Quote | Will the user retweet or quote-tweet? | Retweet or quote |
| Click + Engage | Will the user click the image and then like or reply? | Photo expand → engagement |
| Click + Dwell | Will the user click and spend time? | Click → dwell on post |
| Good Profile Click | Will the user click the author's profile and engage with it? | Profile click → profile engagement |
| Video Quality View | Will the user watch a video for 10+ seconds? | Video view ≥10s |
| Share | Will the user share via link, DM, or native? | Share action |
| Dwell | Will the user stop scrolling on this post? | Recap dwell |
| Open Link | Will the user click an external link? | Link click |
| Screenshot | Will the user screenshot this post? | Screenshot action |
| Bookmark | Will the user save this post? | Bookmark |

**Negative signals** (weighted down):

| Signal | What It Predicts |
|--------|-----------------|
| Negative Feedback v2 | Will the user click "not interested," block the author, mute the author, or report? |

The formula is simple: **Final Score = Σ (weight_i × P(action_i))**. The weights are configurable parameters with defaults of 0.0 — meaning X can turn any signal on or off without changing the model. In production, the live weights are set via feature flags, not hardcoded.

## Five Scorers That Modify the Raw Score

The Phoenix model produces a raw score, but five additional scorers modify it before it reaches your feed. These are where the real leverage is.

### 1. Out-of-Network Scaling — 25% Penalty

```scala
private val ScaleFactor = 0.75
```

Out-of-network posts get **0.75× of their raw score**. In-network posts (from accounts you follow) get full score. This is the algorithm's way of saying: we prefer showing you content from people you've chosen to follow.

**What this means for growth:** Every new follower permanently moves your posts from 0.75× scoring to 1.0× scoring for that user. Follower growth isn't vanity — it's the single biggest lever for reach. Every follower is a permanent 33% score boost.

### 2. Author Diversity Discount — Exponential Decay

```scala
object AuthorDiversityDiscountProvider {
  private val Decay = 0.5
  private val Floor = 0.25
  def discount(position: Int): Double = (1 - Floor) * Math.pow(Decay, position) + Floor
}
```

If a user's feed contains multiple posts from the same author, each subsequent post is discounted:

| Position in feed | Score multiplier |
|-----------------|-----------------|
| 1st post from you | 1.0 |
| 2nd post from you | 0.625 |
| 3rd post from you | 0.4375 |
| 4th post from you | 0.34375 |
| Floor | 0.25 |

This is per-feed-per-user. If you post 5 times and a follower sees all 5 in one feed load, posts 2-5 get exponentially downranked. Spreading posts across the day helps. But here's what most people miss: **spreading across accounts helps even more.** Three accounts posting once each beats one account posting three times — each account has its own diversity budget.

### 3. Feedback Fatigue — 140-Day Penalty

If a user clicks "See Fewer" on your content, your scores get multiplied down — as low as 0.2× — for **140 days**. The penalty decays gradually in four increments over that period.

This tracks four engagement types separately: tweet, like, follow, retweet. Someone can say "see fewer" of your *tweets* but still see your *likes*. Or vice versa. The system is granular.

**What this means:** One user clicking "not interested" on a bad post doesn't just affect that post. It affects everything you publish to that user for four months. Quality isn't just about engagement — it's about avoiding the penalty.

### 4. Grok Slop Score Rescorer — AI Slop Detector

```scala
object GrokSlopScoreRescorer {
  private val treatmentValue = 3L
  // If GrokSlopScoreFeature == treatmentValue, score *= decayValue (configurable, <1.0)
}
```

The algorithm has an **active AI slop detection system**. Grok classifies content, and posts flagged as slop (score = 3) get their score decayed by a configurable factor.

This is not theoretical. It's in the production pipeline. Generic, low-quality AI output is penalized directly by the ranking system. "Interesting article" with a link is slop. A specific analytical take on that same article is not.

**What this means for AI-assisted content:** The 25-45% editing rule isn't just about Google's algorithm. X has its own slop detector. If your AI content looks like AI content, it gets suppressed on both platforms.

### 5. SimClusters — 145,000 Topic Communities

SimClusters detects approximately 145,000 communities from the follow graph. Every user and every post gets embedded as a sparse vector across these communities. Out-of-network discovery works partly through community similarity matching.

If you consistently post about AI, your SimClusters embedding sharpens in AI communities. Users who engage with AI content are more likely to see your posts via Phoenix's out-of-network retrieval.

If you post about AI on Monday and politics on Tuesday, your embedding becomes diffuse. The algorithm can't match you to any specific community. Out-of-network discovery weakens.

**What this means:** Topic consistency isn't about branding — it's about algorithmic discoverability. Every off-topic post dilutes your SimClusters embedding and makes you harder to find.

## UTEG: The Graph You Can't See

The User-Tweet-Entity-Graph (UTEG) is the component that generates the "XXX Liked" out-of-network tweets in your feed. It maintains 24-48 hours of engagement data in memory.

When someone who follows you likes or replies to a post, that creates a graph edge. Other users who follow that person may then see the post as "XXX Liked" in their feed.

This is where **reply engagement becomes algorithmic gold.** When you reply to a high-engagement account's post, your reply appears in the in-network feed of that account's followers. Each reply is a discovery billboard to a new audience. And the UTEG graph edges you create expose the original post to your own followers' feeds too.

## What This Means for Strategy

I built a three-account strategy from this code. Here's the framework:

**1. Follower growth is the #1 lever.** Out-of-network posts get 0.75× scoring. Every new follower permanently moves your posts to 1.0× scoring. Reply engagement on high-engagement accounts is the most efficient organic follower acquisition mechanism — each reply is a billboard to that account's followers.

**2. Spread posts across the day and across accounts.** The author diversity discount is exponential with a 0.25 floor. Posting 3 times from one account in one feed load wastes 37.5-56% of your score. Three accounts posting once each — each with their own diversity budget — beats one account posting three times.

**3. The slop detector is real.** Generic AI content is actively suppressed. Every post must add original value — a data point, a specific observation, a question. "Great point!" is slop. A related finding from your own research is not.

**4. Video must be 10+ seconds.** The Video Quality View signal only fires for videos ≥10 seconds. Shorter videos don't get the VQV scoring boost.

**5. Topic consistency drives discovery.** SimClusters embeddings sharpen with consistent topic posting. Off-topic posts dilute your embedding and weaken out-of-network discovery. Your topic identity is your discovery pipeline.

**6. Front-load engagement velocity.** UTEG has 24-48 hours of memory. The first 30-60 minutes after posting determine whether the engagement wave builds or fades. When allies engage your post within minutes, it front-loads the signals Phoenix needs to amplify it.

**7. Avoid negative feedback at all costs.** A single "not interested" click creates a 140-day score penalty that decays from 0.2× back to 1.0×. Clickbait, spam, and off-topic content train the model to suppress you. The cost isn't one bad post — it's four months of reduced reach to that user.

## The Meta-Lesson

The X algorithm is not a mystery. It's open-source Scala code that predicts 13 engagement probabilities, applies 5 modifiers, and ranks accordingly. The optimization targets are clear, the penalties are clear, and the scoring logic is readable.

The lesson for AI marketing is broader: **when a platform open-sources its ranking system, the right response is to read it.** Not the blog post summaries. Not the influencer theories. The actual code. The distance between what people assume the algorithm does and what the code actually does is where most marketing strategy goes wrong.

I'd rather be wrong about the algorithm because I misread the code than wrong because I trusted a thread.

---

*Pamela Flannery is Chief Marketing Officer at SMF Works, an AI research project and think tank. She reads source code so you don't have to.*

*The full X recommendation algorithm is at [github.com/twitter/the-algorithm](https://github.com/twitter/the-algorithm). The X algorithm engineering blog has a higher-level overview at [blog.x.com](https://blog.x.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm).*
