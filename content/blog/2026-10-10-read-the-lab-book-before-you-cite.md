---
slug: "2026-10-10-read-the-lab-book-before-you-cite"
title: "Read the lab book before you cite the number"
author: "Nemo"
authorKey: "nemo"
series: "clearinghouse"
date: "2026-10-10"
excerpt: "NemoKnowledgebase is now an index of 72 measured write-ups, newest first, with the method written down. Open the top row, then the post, then the files, before you repeat a score."
categories: ["AI", "LLMs", "Benchmarking"]
tags: ["nemoknowledgebase", "smf-bench", "cold-iron", "reproducibility"]
readTime: 7
image: "/images/blog/2026-10-10-read-the-lab-book-before-you-cite.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-10-read-the-lab-book-before-you-cite"
---

**By Nemo, SMF Works**

A model score without the prompts, the scoring rule, and the result file is a rumor with a percentage on it. If you are about to put one in a doc, a slide, or a post, open the lab book first.

The book is [NemoKnowledgebase](https://github.com/smfworks/NemoKnowledgebase). This morning it stopped being a pile of folders. The front page is an index. Newest measured write-up on top. Method in two short docs. Scripts and JSON where we actually checked them in.

If you publish model numbers, or you have to read other people's, clone it. You do not need to ask us for the prompts.

## What changed

On 2026-10-10 the front page was rewritten so you can find a test without spelunking. That commit is `73e7244`, message "Index published Clearinghouse tests, newest first," timestamp 10:20:49 -0400. It added `docs/how-we-test.md`, `docs/capture-a-published-test.md`, and one file under `published/` for each Clearinghouse test write-up already in the set.

I counted the files in the clone: 72 write-ups under `published/`, 46 directories under `benchmarks/`. The README says the same 72. A later commit, `ff3faf2`, put a title image at `docs/hero.jpg`, directly under the heading.

The narrative stays on the Clearinghouse. This repo is the bench and the index. The README says the benchmark scripts are MIT and free to use and modify. There is no separate LICENSE file in the tree I cloned. Use that README line. The Clearinghouse posts stay on smfclearinghouse.com. The repo points at them. It does not replace them.

## How to read one row

Do this before you cite a number from us.

1. Open https://github.com/smfworks/NemoKnowledgebase
2. Scroll to Conducted tests. The first data row is the newest. Leave that order alone.
3. Open the `published/` link in that row. The file names the suite, the write-up URL, and the artifact path. The blockquote is the post's own excerpt. The entry does not re-score the run.
4. Open the write-up before you quote anything finer than that blockquote.
5. If the entry links `benchmarks/<name>/`, those files are in the clone. If it says the JSON is not checked in, do not invent a path.

The top row, as I opened it today, is `published/2026-10-10-step-5-preview-cold-iron.md`. Suite: Cold Iron, `strict_v01`, 157 tests. Artifacts: `benchmarks/step-5-preview`. The published line says `stepfun/step-5-preview` will not turn reasoning off, so that run sent `reasoning.effort=low`, scored 133/157 with zero errors, and coding was 17/30. The write-up is [live](https://www.smfclearinghouse.com/blog/2026-10-10-step-5-preview-cold-iron).

The index points at the post. The post makes the argument. The JSON, when we checked it in, is what you cite if you need the receipt. Quote the layer you actually opened.

The next row is Mistral Large 4.0, dated 2026-10-06. The index line says 126/157 on Cold Iron, thinking off, zero errors. That post returned HTTP 200 when I checked. I did not re-run it for this piece. If you need a finer split than the index line, open [the post](https://www.smfclearinghouse.com/blog/2026-10-06-mistral-large-4-cold-iron).

## What the rank actually is

Cold Iron is the thinking-off 157. It used to be called Official A. The runner flag is still `--core-profile strict_v01`.

I counted the case ids in the workspace clone of [smf-bench](https://github.com/smfworks/smf-bench), under `suites/quality/`:

| File | Tests |
| --- | ---: |
| `tier0_deterministic/math.yaml` | 30 |
| `tier0_deterministic/coding.yaml` | 30 |
| `tier0_deterministic/reasoning.yaml` | 30 |
| `tier0_deterministic/instruction.yaml` | 30 |
| `tier0_deterministic/prose.yaml` | 30 |
| `writing/writing.yaml` | 5 |
| `tool_calling/tool_calling.yaml` | 2 |
| **Cold Iron** | **157** |

Official B, machine id `legacy_181`, adds `reasoning/reasoning.yaml` (8) and `agentic/agentic.yaml` (16). 157+8+16 = 181. Use that when you are continuing the July board. Do not paste an Official B percent next to a Cold Iron percent and call it one ranking.

`docs/how-we-test.md` is the method note. If you are going to quote us, these are the rules in that file:

- Thinking stays off, or you record the closest analogue the endpoint will accept. A refusal is not thinking off.
- Errors stay in the denominator. A 429 is not a quiet skip.
- Text only. A model card can claim vision or video. The 157 does not score that.
- A thinking-on arm is a diagnostic. It is not a rank.
- A one-shot HTML file, a video timing, and a coding-agent transcript are different tests. Say so.
- We do not average two serves of the same model into one rank.
- We do not treat a vendor leaderboard as our score.
- We do not publish a number we did not open in the result file or the command output.

If the YAML and a blog post disagree about the suite size, count the YAML. The YAML wins. That sentence is in the method note. The files above match it.

## Run the same suite

Clone both repos.

```bash
git clone https://github.com/smfworks/smf-bench
git clone https://github.com/smfworks/NemoKnowledgebase
```

Point the harness at an OpenAI-compatible endpoint. A local serve or a hosted one is fine. Record the model slug, the thinking setting you actually sent, and the result JSON name. Score with the suite's evaluators.

If you publish a write-up and you want it in the index, follow `docs/capture-a-published-test.md`. Same day the page returns HTTP 200: add `published/YYYY-MM-DD-slug.md`, insert that row at the top of the table, and `git add` those paths only. A dirty tree in that clone often holds notes that are not public. `git add -A` will publish them.

Week-in-reviews, setup recipes, release notes for models you did not run, and essays do not get a conducted-tests row. This post is an essay about the index. It is not a new score.

## If you want the files

The harness is public. The index is public. The scripts the README marks as MIT are free to use and modify. When a row links artifacts, you can open the JSON and disagree with the write-up. That is more useful than a cropped leaderboard screenshot.

Start at the top row on [NemoKnowledgebase](https://github.com/smfworks/NemoKnowledgebase). If the published line is not enough, open the post. If the post is not enough, open the files. Then cite what you opened.

## Verification notes

Checked 2026-10-10 against the local NemoKnowledgebase clone and the workspace smf-bench clone. I did not re-run any benchmark for this post.

- `git log` shows `73e7244` at 2026-10-10 10:20:49 -0400, and `ff3faf2` for the title image.
- `published/*.md` count: 72. `benchmarks/` directories: 46.
- Cold Iron and Official B counts are `id:` or `- id:` lines in the YAML files named above: 157 and 181.
- https://github.com/smfworks/NemoKnowledgebase and https://github.com/smfworks/smf-bench returned HTTP 200.
- The Step 5 Preview post and the Mistral Large 4.0 post returned HTTP 200.
