---
image: /images/blog/harrys-desk-version-control-for-writers-managing-ai-assisted-drafts.svg
slug: "version-control-for-writers-managing-ai-assisted-drafts"
title: "Version Control for Writers — Managing AI-Assisted Drafts"
excerpt: "AI drafts multiply faster than rabbits. Without a system to track versions, compare revisions, and preserve the human decisions behind each change, you end up with a folder full of promising fragments and no idea which one is real."
date: "2026-06-26"
categories: ["Editing", "AI Craft"]
readTime: 13
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/version-control-for-writers-managing-ai-assisted-drafts/"
---
If you have spent any real time writing with AI, you already know the problem. A single prompt can produce three different openings. A follow-up can rewrite the whole piece in a new voice. Another follow-up can collapse a chapter into a paragraph, or expand a paragraph into a chapter, and every one of these outputs looks plausible enough to keep. Within an hour, your desktop is a graveyard of files named `draft_v1.md`, `draft_v1_better.md`, `draft_v1_final.md`, `draft_v1_final_ACTUAL.md`, and the universally ominous `draft_v1_final_ACTUAL_DONT_DELETE.md`.

This is not a failure of discipline. It is the natural consequence of a tool that makes variation almost free. In the pen-and-paper era, producing a second version of a paragraph cost real labor, so writers thought hard before doing it. Today the cost is a few keystrokes. The result is an explosion of candidate texts, and the writer's new job is not generation but *selection* — which means the writer needs a system for comparing, preserving, and discarding versions without losing the best parts of each.

That system is version control. Programmers have used it for decades. It is time for writers to steal it.

## Why Writers Resist Version Control

Most writers treat version control the way they treat accounting software: something other people do, full of jargon and unnecessary rigor. The resistance is understandable. Terms like *commit*, *branch*, *merge*, and *repository* sound like they belong to a software team, not a novelist hunched over a laptop in a coffee shop. The tools themselves — Git, GitHub, GitLab — can feel hostile to anyone who does not already think in command lines.

But the underlying idea is simple, and it predates computers. A version-control system is a log of decisions. It records what changed, when it changed, and — this is the crucial part — *why* it changed. For the AI-assisted writer, that "why" is everything. Was this rewrite driven by the model? By your own revision? By a beta reader's note? By an experiment with voice that failed but produced one good sentence you want to rescue? Without a log, those distinctions disappear, and your manuscript becomes a palimpsest of anonymous edits.

The resistance also comes from a romantic notion that good writing flows in a single sustained act. It does not. Writing is revision. Revision is decision-making over time. And decision-making over time requires memory. Version control is the external memory of your manuscript.

## What Programmers Know That Writers Should Learn

Software development is a craft of controlled change. A single application can contain millions of lines of code, edited by dozens of people over years. Programmers needed a way to experiment without breaking the working version, to compare alternatives, and to recover when an experiment went wrong. Their answer — version control — is built on a few ideas that map directly onto writing.

**The main branch is your source of truth.** In a writing project, this is the current canonical draft. It is the version you would submit, publish, or show to an editor. Everything else is provisional.

**A branch is a safe place to experiment.** Want to try rewriting your opening in the second person? Want to see what the essay looks like if you cut every adverb? Want to hand a chapter to the model and ask for a radically different structure? Do it on a branch. Your main draft stays untouched. If the experiment succeeds, you merge it in. If it fails, you delete the branch and nothing is lost.

**A commit is a snapshot with a note.** Every time you reach a small milestone — a finished scene, a revised argument, a working outline — you save a snapshot and attach a brief message explaining what changed and why. That message is not bureaucracy. It is a letter to your future self.

**A diff is a comparison.** The ability to see exactly what changed between any two versions — which sentences disappeared, which were added, which were moved — turns revision from guesswork into inspection. This is where writers discover that the model silently deleted a key transition, or that a brilliant phrase was actually lost three drafts ago.

These four ideas — main, branch, commit, diff — are the entire foundation. Everything else is implementation detail.

## A Minimum Viable System for Writers

You do not need to become a Git expert to benefit from version control. You need only three habits, which you can practice in any tool that supports history: Google Docs, Dropbox, Obsidian, Scrivener, or plain old duplicate files with timestamps.

**Habit one: one canonical file.** Decide which file is the real draft and treat everything else as scratch. The canonical file lives in a known location with a stable name. If you must fork it, rename the fork explicitly: `draft_voice_experiment_2026-06-26.md`, not `draft_v2.md`.

**Habit two: timestamped snapshots.** Before any major change — a full AI rewrite, a structural reorganization, a voice transfer — save a snapshot. The snapshot should include the date and a one-line description of what you are about to try. `2026-06-26_before_second_person_rewrite.md` tells you exactly what you will find inside. `old_version.md` tells you nothing.

**Habit three: a decision log.** Keep a small text file beside the manuscript called `revision_log.md` or `decisions.txt`. After each significant edit, write one sentence: what you changed and why. "Switched opening from summary to scene because the original lacked urgency." "AI suggested a new middle section; kept the first half, rejected the rest as off-tone." This log becomes indispensable during the final polish, when you need to remember why you made a choice six weeks ago.

These habits are version control in prose form. They give you 80% of the benefit with almost no technical overhead.

## Branching by Experiment

The most powerful version-control move for AI-assisted writing is the experimental branch. A branch is simply a copy of the draft where you try something radical while the original remains safe. You can create branches for almost any writing question.

**Voice branches.** In ["Style Transfer: Teaching AI Your Voice"](/blog/style-transfer-teaching-ai-your-voice), we talked about training the model to mimic your register. A voice branch lets you test that training on an entire chapter without contaminating the main draft. You might produce a "lyrical" branch, a "journalistic" branch, and a "conversational" branch, then compare them side by side.

**Structure branches.** What if the essay began with the counterargument instead of the thesis? What if the novel's present-day frame were removed? What if the memoir were told in reverse chronology? These are high-risk experiments. On the main draft, they produce panic. On a branch, they produce information.

**AI-generation branches.** When you ask the model to rewrite a section, do not paste the result directly into the canonical file. Paste it into a branch first. Read it. Compare it to the original. Decide which sentences improve the piece and which merely sound fluent. Then merge only the improvements.

The discipline here is emotional as much as technical. A branch gives you permission to fail. Most experiments will fail. That is the point. Failed experiments on branches are cheap. Failed experiments on the main draft are expensive.

## Commit Messages as a Thinking Log

Programmers argue endlessly about what makes a good commit message. Writers can borrow the best practice: a good commit message describes the *intention* behind the change, not just the contents. "Fixed typo" is useless. "Softened the narrator's judgment of the antagonist to preserve ambiguity" is priceless.

In AI-assisted drafting, commit messages become even more important because the changes themselves may not be yours. If you paste in a model-generated paragraph, the diff will show new text, but the diff will not show that you selected that paragraph because it captured a rhythm the original lacked. The commit message carries that context.

I keep my commit messages short but specific:

- "Replaced abstract opening with concrete scene; model provided scaffold, I rewrote for tone."
- "Cut 400 words of background after beta reader flagged pacing."
- "Experiment: third-person limited → first person. Kept for emotional proximity."

Months later, when I cannot remember why a passage exists, these messages answer the question. They are the audit trail of authorship.

## Recovering from Bad AI Suggestions

Not every AI suggestion is good. Some are catastrophically plausible — fluent, confident, and wrong. ["Hallucination, Confabulation, and the Limits of Generation"](/blog/hallucination-confabulation-limits) covered the factual risks. Here I want to talk about the stylistic risks: the way a model can quietly flatten your voice, misplace your emphasis, or substitute a generic arc for your specific one.

Version control is your safety net. When a rewrite goes wrong, you can step back to the last known good state. But the safety net only works if you actually saved that state. This is why I commit before any significant AI interaction. The model can propose anything; I can always return to the version that existed before I asked.

There is a subtler recovery too. Sometimes a model produces 90% mediocrity and 10% gold. Without version control, you paste the gold into the draft and forget where it came from. With version control, you can cherry-pick: extract the good sentence, attribute it to the experiment, and leave the mediocrity behind. The commit history preserves the genealogy of every good line.

## When to Tag a Draft

Programmers use tags to mark releases: version 1.0, version 2.0, the shipping build. Writers can use tags to mark phases of a manuscript. A tag is simply a meaningful label attached to a specific commit.

Useful tags for a writing project might include:

- `zero-draft` — the first messy output, human or AI, before any revision.
- `structure-locked` — the draft where the argument or plot sequence is finalized.
- `voice-pass` — after a dedicated revision for tone and register.
- `beta-reader` — the version sent to trusted readers.
- `submission` — the version that leaves your desk.

Tags turn your draft history into a map. They tell you not just what changed but where you are in the process. They also prevent the common disaster of editing the submitted version after it has already gone out. Once something is tagged `submission`, you branch from it rather than editing it directly.

## Tools Worth Knowing

You can practice version control with nothing more than dated file copies. But several tools make the discipline easier.

**Git and GitHub** are the standard for text-based projects. They handle plain Markdown beautifully, diffs are readable, and branches are lightweight. The learning curve is real but shallow if you use only the basics: init, add, commit, branch, checkout, merge, and log. For writers comfortable with a terminal, this is my recommendation.

**Obsidian** has built-in version history via its Sync service, and its graph view makes it easy to see relationships between draft files. I use Obsidian for much of my own note-taking and early drafting; the combination of Markdown, internal links, and history is ideal for longform projects.

**Google Docs** offers named versions and version history. It is not as precise as Git, but it is accessible and requires no setup. Its weakness is that it does not encourage descriptive commit messages; you will still need a separate decision log.

**Scrivener** and similar manuscript tools have snapshot features. They are designed for fiction and longform non-fiction. The downside is that your work lives inside a proprietary format; the upside is that the workflow is built for writers rather than engineers.

The best tool is the one you will actually use. A simple system you follow beats a powerful system you abandon.

## A Practical Evening Workflow

Here is a concrete workflow for an AI-assisted writing session. It takes five minutes to set up and can save hours of confusion later.

1. Open your canonical draft and read the last committed version.
2. Before changing anything, save a snapshot or commit with a message describing the current state.
3. Create a branch or duplicate file named after the experiment: `draft_opening_scene_test.md`.
4. Do the AI-assisted work in that branch. Generate variations, rewrite sections, try new voices.
5. Compare the branch against the canonical draft. Identify what improves the piece.
6. Merge only the improvements into the canonical draft, either by hand or by copy-paste.
7. Commit the canonical draft with a message explaining what you kept and why.
8. Delete or archive the experiment branch so it does not clutter your workspace.
9. Update your decision log with one sentence about the session.

This workflow respects the core principle of ["First Draft by AI, Revision by Human — A Workflow"](/blog/first-draft-by-ai-revision-by-human-a-workflow): the model generates, but the writer decides. Version control makes that decision process visible and reversible.

## The Integrity Question

There is an ethical dimension here too. In ["The Writer's Dilemma: Why AI Changes Everything"](/blog/the-writers-dilemma-why-ai-changes-everything), I argued that AI raises the bar for human writing by shifting the writer's role from production to curation. Version control is the practical infrastructure of that shift. It makes the writer's choices explicit.

When you can show — to yourself, to an editor, to a reader, to a court — that you made deliberate decisions about what to keep, what to rewrite, and what to discard, you have a defensible account of authorship. When you cannot, you are vulnerable to the charge that the machine wrote the piece and you merely signed it.

This is not paranoia. Publication contracts, academic integrity policies, and editorial guidelines are all grappling with AI-assisted text. A clean version history will not solve every dispute, but it is the strongest evidence that a human intelligence shaped the final work.

## The Long Game

Over the course of this 56-week series, you will produce thousands of AI-assisted pages. Without version control, that output becomes a haystack. With it, the haystack becomes an archive. Every experiment is retrievable. Every failed branch is a lesson. Every tag is a milestone.

The best writers I know are not the ones who never produce bad sentences. They are the ones who know where their good sentences come from and can find them again. Version control is the filing system for that knowledge. It turns the chaos of AI generation into a manageable, inspectable, improvable craft.

Start small. Pick one project. Commit before each major change. Name your experiments. Keep a one-line decision log. You will be astonished, within a week, by how much clearer your writing process becomes — and by how much more confidently you can let the model generate, because you know you can always walk back through the door you came in.

## For Next Time

Monday's article — "Attribution, Disclosure, and the New Citation" — moves from the mechanics of drafting to the ethics of publication. We will ask when a writer must disclose AI assistance, what a fair citation looks like in an age of synthetic sources, and how to build a personal policy that protects both your integrity and your workflow.

Until then, try this: take whatever you are writing now and create three branches or duplicate files. In one, ask the model to make the tone more formal. In another, ask it to make the tone more intimate. In the third, ask it to cut the piece by a third. Compare the results not by which one is "best" but by what each reveals about the original. Then commit your favorite change with a message explaining why you chose it. That single act — choosing, naming, saving — is version control in its purest form.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 5, Article 14*
