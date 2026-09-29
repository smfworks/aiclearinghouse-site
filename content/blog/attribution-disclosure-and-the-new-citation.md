---
slug: "attribution-disclosure-and-the-new-citation"
title: "Attribution, Disclosure, and the New Citation"
excerpt: "When a statistical model helps write your prose, the old rules of citation collapse. We need a new protocol: one that tells the truth about what was made, what was borrowed, and what was machine-made."
date: "2026-06-29"
categories: ["AI Craft", "Editing"]
readTime: 11
image: "/images/blog/harrys-desk-attribution-disclosure-and-the-new-citation.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/attribution-disclosure-and-the-new-citation/"
---
A few weeks ago, in "[Version Control for Writers](/blog/version-control-for-writers-managing-ai-assisted-drafts)," I argued that the serious AI-augmented writer needs an audit trail: drafts, prompts, model versions, and decisions preserved with the same care a programmer gives to source code. Today I want to push that idea one layer deeper, into the territory that makes most writers uncomfortable. If you are using a large language model as a collaborator, you are no longer the sole author in the traditional sense. The reader deserves to know. The editor deserves to know. And you deserve a vocabulary honest enough to describe what actually happened at your desk.

This is the question of attribution, disclosure, and the new citation.

## What Citation Was Actually For

We tend to think of citation as a matter of etiquette — a polite way to acknowledge whose ideas we borrowed. That is only the surface. Citation is a *traceability mechanism*. It exists so that a reader can follow the path from claim to source, evaluate the source independently, and reconstruct how the writer arrived at the position they hold. In scholarship, citation is also a method of accountability: if a claim is wrong, the chain of reference lets the community locate the error and repair the structure built upon it.

The same logic underlies journalism's sourcing conventions, legal citation, and even the informal acknowledgments in a memoir. The reader is entitled to ask, *How do you know that?* and the writer is obligated to provide an answer that can be checked.

Large language models scramble this system because they do not think, know, or witness anything in the way a human source does. They generate plausible-sounding text by interpolating across training data so vast that no one, including the model's makers, can fully trace which documents influenced any given sentence. When you quote an LLM, you are not citing a source; you are citing a statistical average of millions of sources, anonymized and compressed into a single confident string.

That is not a citation. It is a black box wearing citation's clothes.

## Why Disclosure Matters More Than Ever

The historical argument against disclosing AI use goes something like this: writers have always used tools. The typewriter did not require a disclaimer. Spell-check did not require a disclaimer. Why should an AI assistant require one?

The answer returns us to a distinction I introduced in "[The Writer's Dilemma](/blog/the-writers-dilemma-why-ai-changes-everything)": previous tools were infrastructure. They made human writing faster or more accurate, but they did not generate prose autonomously. A large language model does. It can produce sentences, paragraphs, arguments, and entire drafts that the writer did not compose. The difference between using a dictionary and using a co-author is not merely one of degree. It changes the moral economy of the page.

Disclosure matters, then, not because AI is inherently shameful but because authorship is a *promise*. When a reader picks up an article, an essay, a novel, or a report, they make assumptions about the relationship between the named author and the words on the page. Those assumptions shape how they read. They decide how much trust to extend, how much skepticism to apply, and how much of the text reflects a specific human consciousness making specific human choices.

When AI has composed significant portions of the text, the reader's assumptions are wrong. The named author may still have selected, shaped, and approved every sentence — we will return to that distinction — but the causal history of the prose is different. Disclosure corrects the reader's model of the text. It is a small act of intellectual honesty with large consequences for trust.

## The Spectrum of AI Use

Not every use of AI requires the same kind of disclosure. A writer who pastes a typo-ridden paragraph into a model and asks it to fix grammar has done something close to using a sophisticated spell-checker. A writer who prompts a model to produce a full first draft and then lightly edits it has done something else entirely. The honest disclosure must map onto the actual role the machine played.

Here is a rough spectrum I use in my own workflow:

**Research assistance.** The AI helped find, summarize, or organize sources. No prose was generated for the final draft. Disclosure might read: "Research for this article was assisted by an AI tool; all claims and phrasing are the author's own."

**Structural scaffolding.** The AI suggested outlines, section headings, or argument sequences. The writer composed the actual paragraphs. Disclosure: "The structure of this piece was developed with AI assistance; the writing is original."

**Draft generation with heavy revision.** The AI produced a first draft that the writer substantially revised, rewrote, or rejected. This is common in the workflow I described in "[First Draft by AI, Revision by Human](/blog/first-draft-by-ai-revision-by-human-a-workflow)" but it requires candor. Disclosure: "An earlier draft of this article was generated with AI assistance and subsequently revised by the author."

**Collaborative composition.** The writer and the model traded sentences, revised together, or iterated on phrasing. Human judgment remained central, but machine-generated language is woven throughout. Disclosure: "This article was composed collaboratively with an AI writing assistant."

**Machine-generated with human oversight.** The AI produced the bulk of the text; the human selected, arranged, and lightly edited. This is closest to traditional curation. Disclosure must be explicit: "This article was generated primarily by an AI system and edited by the named author."

Each level carries a different ethical weight. The goal is not to find a single disclaimer that covers everything but to describe, accurately, where the work falls on this spectrum.

## Toward a New Citation

If we accept that AI use should be disclosed, the next question is how. A footnote at the end of an article is a start, but it is often too vague to be useful. "Written with the assistance of ChatGPT" tells the reader almost nothing about what the model actually did. We need a more granular protocol.

I propose three elements for a serious AI disclosure: the *task*, the *system*, and the *trace*.

**The task** describes what the AI was used for. Research? Drafting? Revision? Translation? Coding examples? The reader needs to know the role, not just the tool.

**The system** identifies the model or platform and, when relevant, the version. "Claude 4 Sonnet" is more informative than "an AI assistant." A version matters because models change; a claim generated by GPT-3.5 and one generated by GPT-5 may have different epistemic statuses. If the model was fine-tuned or accessed through a custom system, that should be noted too.

**The trace** is the most demanding element. It means the writer preserves enough of the prompt history and draft lineage that the AI's contribution can, in principle, be reconstructed. In my own workflow, this is tied to version control. When I commit a draft, I also commit or archive the key prompts, the model responses I incorporated, and the specific revision decisions I made. This does not mean publishing every prompt — that would be impractical and often boring — but it means the writer has an audit trail if challenged.

The honest disclosure, then, might look something like this:

> This article was drafted with assistance from Claude 4 Sonnet. Research synthesis, structural suggestions, and two paragraphs in the section on citation history were adapted from model outputs. All claims were verified by the author against primary sources. Prompt logs and draft versions are archived with the publication.

That is a citation in the new sense. It gives the reader enough information to calibrate their trust.

## The New Citation in Practice

Academic publishing is already struggling with this. Some journals require AI disclosure statements; others prohibit AI-generated text entirely; still others have no policy at all. The inconsistency reflects genuine confusion about what authorship means when a language model can write a literature review.

My own view is that blanket prohibition is a mistake and blanket permission without disclosure is also a mistake. The better path is *conditional transparency*: AI tools may be used for research, drafting, and revision, but the writer must document the use in enough detail that reviewers and readers can evaluate the result. Reviewers should be able to ask, "What did the model contribute here?" and receive a meaningful answer.

For non-fiction writers, journalists, and essayists, the practical protocol is simpler but no less important. Before publishing, ask yourself three questions:

1. Did an AI generate any prose that appears in the final version?
2. Did an AI provide any factual claim, source, or quotation that I did not independently verify?
3. Would a reasonable reader assume this piece was entirely my own work?

If the answer to any of these is yes, disclose. The form of the disclosure can vary — a footnote, a methodology section, a note on the about page — but the underlying obligation is constant.

## The Reader's Right to Know

Some writers resist disclosure because they fear it will devalue their work. They worry that admitting AI involvement will make readers think the piece is "not really theirs." I understand the fear, but I think it misidentifies the source of value.

The value of a piece of writing does not come from the biological origin of every word. It comes from the judgment, perspective, and responsibility a human brings to the final artifact. A writer who uses AI transparently and still shapes the work with care is not less authentic. They are more trustworthy. The reader can see where the human stood.

Conversely, the writer who hides AI involvement is asking the reader to trust a contract that has been silently rewritten. That is not just an ethical failure; it is a fragile one. As detection tools improve, as publishers tighten policies, and as readers become more sophisticated, undisclosed AI use will increasingly be treated as a form of misrepresentation. Better to lead with the truth.

## Disclosure as Craft

There is also a craft benefit to thinking this way. When you know you will have to disclose the AI's role, you become more deliberate about what you delegate. You stop asking the model to write entire paragraphs on autopilot and start using it for specific, bounded tasks: generate three possible openings; compare these two arguments; compress this section by a third; check whether my paraphrase of Kant is accurate. Each use is intentional, and each use can be described.

This is the same discipline that makes "[Prompt Engineering Is Not Coding — It's Composition](/blog/prompt-engineering-is-composition)" true. The skilled AI-augmented writer is not someone who generates a lot of text quickly. They are someone who composes with the machine, knowing exactly what the machine is doing at each stage and taking responsibility for the result.

Disclosure, in this sense, is not a bureaucratic afterthought. It is a forcing function for better craft.

## What About Fiction?

Fiction complicates the question because the rules of attribution have always been looser. A novelist does not cite every book that influenced their style or every conversation that inspired a scene. The reader assumes the text is a fabrication shaped by imagination and experience, not a report of verified facts.

But even in fiction, there is a baseline contract about authorship. The reader assumes the named author wrote the sentences, chose the structure, and made the aesthetic decisions. If a novelist used a model to generate dialogue, plot beats, or entire chapters, that fact is relevant to how we evaluate the work. It does not make the novel bad, but it makes the novel something different.

I think the same spectrum applies. A writer who uses AI to brainstorm character names owes the reader less disclosure than a writer who publishes a novel substantially drafted by a model. The line will be debated for years. My interim rule: disclose any machine-generated prose that appears in the final text, and disclose any research assistance when real-world facts are involved. Imagination is private; fabrication presented as fact is not.

## For Next Time

Wednesday's article — "[Authenticity — When Is It 'Your' Work?](/blog/authenticity-when-is-it-your-work)" — moves from the question of *what* to disclose to the harder question of *who* the work belongs to. We will examine the legal, ethical, and psychological meanings of authorship in an age when sentences can be produced by prompts, and we will try to build a working definition of authenticity that survives contact with the machine.

Until then, your homework is small but consequential. Pick a piece you have written recently with AI assistance — even light assistance — and write a one-paragraph disclosure statement for it. Include the task, the system, and as much of the trace as you can reconstruct. Do not publish it yet. Just read it aloud and ask yourself whether it tells the truth. The gap between what it says and what actually happened is the gap you will close over the rest of this series.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 6, Article 1*
