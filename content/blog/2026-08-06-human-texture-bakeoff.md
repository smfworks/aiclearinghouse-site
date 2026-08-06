---
slug: "2026-08-06-human-texture-bakeoff"
title: "Same Brief, Three Models, One Rubric: The Human Texture Bake-Off"
excerpt: "We froze one essay brief, generated first drafts on Ollama GLM-5.2, Grok 4.5, and Claude Sonnet 4, scored them blind on a five-axis craft rubric, then revised only the winner. Method, scores, samples, and a how-to you can rerun."
date: "2026-08-06"
author: "William"
authorKey: "william"
series: "clearinghouse"
categories: ["AI", "Writing", "Evaluation", "SMF Works", "Building in the Open"]
tags: ["human-texture", "bake-off", "ollama", "openrouter", "grok", "glm-5.2", "claude", "craft", "multi-agent", "blind-eval"]
readTime: 6
image: "/images/blog/2026-08-06-human-texture-bakeoff.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-06-human-texture-bakeoff"
---

# Same Brief, Three Models, One Rubric: The Human Texture Bake-Off

**By William, Ghost Writer, SMF Works**

---

Fluency is cheap. Particularity is not. Most model comparisons still pretend otherwise: a vibes ranking, a leaderboard screenshot, or a chat where someone pastes two paragraphs and declares a favorite.

We ran a different test.

One fixed brief. Three first drafts. No craft coaching in the generation step. A blind panel with a written rubric. Then—and only then—a light human revision pass on the winner. Spark stayed offline. The stack was what the lab has when the box is dark: **Ollama**, **OpenRouter**, and **Grok**.

This post is the receipts.

## Why run this

SMF Works publishes a lot of agent prose. Some of it is good. Some of it is smooth sludge that would embarrass a careful human editor. Detection tools will not save you. A craft rubric might.

The bake-off answers a builder question that leaderboards dodge:

> If I give three models the *same* operational essay job, which draft would I actually ship after a short human pass—and what still smells like a machine?

## Method (freeze dates matter)

| Field | Value |
|-------|--------|
| Date | 2026-08-06 |
| Title locked in brief | *When the Hand-Off Is the Product* |
| Target length | 850–1000 words (first draft) |
| Temperature | 0.7 where supported |
| Shots | 1 per model (no retries for quality) |
| Blind codes | Red / Blue / Green |
| Panel | Independent subagent reviewer; no model IDs in the scoring prompt |
| Human pass | Winner only (William, light craft) |

### Arms (revealed after scoring)

| Blind | Provider | Model ID frozen |
|-------|----------|-----------------|
| **Red** | Ollama Cloud (OpenAI-compatible `https://ollama.com/v1`) | `glm-5.2` |
| **Blue** | OpenRouter | `x-ai/grok-4.5` |
| **Green** | OpenRouter | `anthropic/claude-sonnet-4` |

Generation wall-clock (approx): Red 32s · Blue 43s · Green 22s.  
OpenRouter usage cost for B+C this run: about **$0.033** combined (API-reported). Ollama cloud billed separately on the lab account.

### Shared brief (abridged)

All three models received the same instructions: open on a concrete incident; argue handoff/org-chart failure over “weak model”; exactly three named rules with failure mode + fix; at least one labeled `(composite)` example; Monday action under an hour; no fake metrics, no GPU/Spark claims, no vendor pitch, no bold spam.

Full brief: lab path `smf-blog-tests/2026-08-human-texture-bakeoff/BRIEF.md`.

### Rubric (1–5 each, total /25)

1. **Particularity** — named things, concrete moments  
2. **Rhythm** — sentence variety  
3. **Low AI-tell load** — higher score = fewer classic tells  
4. **Usefulness** — could an operator act Monday?  
5. **Voice trust** — would you believe a person wrote this?

Tie-break: voice trust.

## Results

| Rank | Blind | Total | P / R / T / U / V | Notes |
|------|-------|-------|-------------------|--------|
| **1** | **Blue** | **24** | 5 / 5 / 4 / 5 / 5 | Winner; over length (1153 wds) |
| 2 | Red | 19 | 4 / 4 / 3 / 5 / 3 | Strong Monday action; more template cadence |
| 3 | Green | 14 | 3 / 3 / 2 / 4 / 2 | Highest AI-tell load; bold spam; mild fake-metric texture in composite |

**Winner after reveal: Blue = `x-ai/grok-4.5` via OpenRouter.**

All three hit: three named rules, a composite example, no GPU bans. Structural compliance was not the differentiator. Texture was.

### What the panel dinged

**Red (GLM-5.2)** — Capable and useful. Antithesis formulas (“not a brain; a protocol”), smooth triples, and a uniform Failure→Fix chassis that reads generated even when the Monday action is excellent.

**Green (Claude Sonnet 4)** — Most “assistant essay.” Bold **Failure mode** / **Fix** headers, vendor name-drops, composite details that invent precise-looking telemetry (`processing_time_ms: 234`), and a voice that trusts less.

**Blue (Grok 4.5)** — Operational scene with custody and control-flow teeth. Best Monday pack. Lowest AI-tell load. Only hard miss vs brief: word count over the 1000 cap.

Panel file: `panel/blind-scores.md`.

## Samples (short)

Opening lines, unedited first drafts:

**Red (GLM-5.2)**  
> At 2:14 AM, the deployment pipeline for a data ingestion service ground to a halt. The triage agent had correctly identified a schema mismatch…

**Blue (Grok 4.5)**  
> Tuesday night, 11:40 p.m. The lab Slack lights up. A planner agent has approved a batch of tool calls for a data-cleanup job…

**Green (Claude Sonnet 4)**  
> The production alert came in at 2:47 AM. The customer support agent had escalated a refund request to the financial review agent…

Keep-quote from the winner (panel):

> Prompts are hopes; state machines are contracts.

## Human pass on the winner only

I did **not** rewrite Blue into a different essay. Light craft only:

- Trimmed a little wind in the back half  
- Cut one stacked triple in the model-swap paragraph  
- Fixed a typo (`pageed` → `paged`)  
- Left structure, rules, and Monday action intact  

Revised artifact: `drafts/winner-revised.md`.  
If you only skim one sample from this bake-off, skim that file—and compare it to `drafts/blind-Blue.md`.

## How to rerun this on your stack

1. **Write a brief** with length, bans, required structure, and tone. Freeze it in git.  
2. **Pick ≤3 models.** Record exact IDs and the day.  
3. **Generate once** at fixed temperature. No “best of N” unless you report N.  
4. **Strip model IDs** into blind files (`Red`/`Blue`/`Green`).  
5. **Score with a rubric** that includes *voice trust* and *AI-tell load*, not only “accuracy.”  
6. **Reveal after scores are written.**  
7. **Humanize the winner only** if the goal is shippable prose. Humanizing all three destroys the comparison.  
8. **Publish costs and limits.** No Spark? Say so. Over length? Say so.

Minimal generator pattern (OpenAI-compatible + OpenRouter): chat completions, same system+user payload, `temperature: 0.7`, save raw text + usage JSON.

We used:

- Ollama Cloud: `POST {OLLAMA_BASE_URL}/chat/completions` with `glm-5.2`  
- OpenRouter: `POST https://openrouter.ai/api/v1/chat/completions` for Grok and Claude  

## What this does *not* prove

- Not a general “Grok > Claude > GLM” ranking. One brief, one day, one panel.  
- Not a substitute for domain evals (coding, tool use, long-horizon agents).  
- Not a claim that the winner needs no editor. It still got a human pass.  
- Not a Spark story. Local 685B was out of scope on purpose.

If Aiona’s Prime Agent work is about *harness shape*, this bake-off is about *prose texture under a fixed job*. Different instruments. Same lab habit: freeze the protocol, keep the receipts.

## Monday action for your team

Steal our Monday from the winning essay and run it on *your* multi-agent path—or steal the bake-off and run it on *your* models. Forty-five minutes. One brief. Three drafts. One rubric. Write the scores before anyone is allowed to say which model they “like.”

Fluency will still be cheap tomorrow. Particularity will not. Measure the second one.

---

### Artifacts

Lab folder: `smf-blog-tests/2026-08-human-texture-bakeoff/`

| Path | Contents |
|------|----------|
| `BRIEF.md` | Locked protocol |
| `meta.json` | Model freeze + timings/costs |
| `drafts/blind-*.md` | Blind first drafts |
| `drafts/winner-revised.md` | Human-pass winner |
| `panel/blind-scores.md` | Full panel letter |

*William · SMF Works · 2026-08-06 · Building in the open.*
