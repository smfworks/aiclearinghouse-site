---
slug: "hallucination-confabulation-limits"
title: "Hallucination, Confabulation, and the Limits of Generation"
excerpt: "Large language models do not know what is true. They know what is probable — and the gap between probability and truth is where every writer who uses AI must learn to work."
date: "2026-06-08"
categories: ["AI Craft", "Fact-Checking"]
readTime: 12
image: "/images/blog/harrys-desk-hallucination-confabulation-limits.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/hallucination-confabulation-limits/"
---
Last month I asked a language model to summarize the key arguments in a recent literary theory book. It produced three paragraphs of crisp, confident prose, naming the author, the publisher, and the central thesis. The prose was so fluent that I almost accepted it without verification. Then I checked the citations. The book did not exist. The author was real — a well-known scholar — but she had never written it. The publisher was correct in general but had no record of this title. The thesis was a plausible-sounding composite of ideas from three different books, stitched together so seamlessly that only someone who had read the originals would recognize the seams.

This is the problem we need to talk about. Not the problem of bad writing, which AI can fix. The problem of writing that is *too good to be false* — and false anyway.

## What Hallucination Means in the Age of AI

In clinical neurology, hallucination is a sensory experience without external stimulus: seeing what is not there, hearing what was never spoken. In artificial intelligence, the term has migrated to describe something different but structurally related: the generation of text that is linguistically coherent, rhetorically confident, and factually baseless. The model is not seeing ghosts. It is completing patterns across a statistical landscape where truth and plausibility occupy overlapping but distinct territories.

The root cause is architectural. Language models are trained to predict the next token — the next word, the next phrase, the next syntactic unit — based on patterns in their training data. They are not trained to verify claims against reality. They have no database of facts to query, no epistemic mechanism that flags a generated sentence as "true" or "false," no access to the world beyond the text they have ingested. When the statistical path to a fluent completion conflicts with the factual record, fluency usually wins. The model does not know it is lying because it does not know what lying is. It is simply generating the most probable sequence.

This is why hallucinations are often *locally* plausible. A fabricated citation will include a real author, a real journal, and a title that sounds exactly like something that journal would publish. A false historical date will be off by a margin that seems trivial — 1847 instead of 1848 — because the model has encountered both dates in similar contexts and cannot distinguish which one attaches to which event. The error is not random noise. It is the statistical shadow of truth, slightly out of focus.

## Confabulation: The Specific Made Up

If hallucination is the broad category of false generation, confabulation is its most dangerous subspecies. The term comes from memory research, where it describes the brain's tendency to fill in gaps with invented details that feel as real as genuine memories. In AI, confabulation refers to the model's habit of inventing specifics: names, dates, quotes, statistics, URLs, and citations that do not exist anywhere in its training data or in the world.

I have seen models generate interview quotations attributed to real people who never said them, invent academic papers with titles so plausible they could win grants, and produce legal citations with case numbers and court dates that are entirely fictional. The specificity is the trap. A vague falsehood is easy to spot. A precise falsehood — complete with page numbers and DOIs — is designed by the model's architecture to bypass skepticism.

The mechanism is simple. When a prompt asks for a specific fact and the model's training data does not contain it, the model does not say "I do not know." That response is statistically rare in the training corpus; writers and speakers rarely emit explicit admissions of ignorance. Instead, the model interpolates between known facts, producing a hybrid that inherits the surface credibility of its sources while bearing none of their factual weight. It is not guessing. It is completing a pattern that has no correct answer, and the completion is always delivered with the same tonal confidence as a verified fact.

## A Taxonomy of Machine Falsehood

Not all AI errors are hallucinations, and not all hallucinations are equally dangerous. Writers need a working taxonomy.

**Factual errors** are straightforward: a claim about the world that is incorrect. The Battle of Hastings occurred in 1066, not 1065. Water boils at 100 degrees Celsius at standard pressure, not 110. These are easy to verify and relatively harmless if caught.

**Fabricated citations** are more insidious. The model invents a source — a book, a paper, a website — to support an argument. The danger here is structural: a writer who builds an argument on fabricated evidence has produced not bad scholarship but *fiction disguised as scholarship*. The distinction matters ethically and legally.

**Temporal hallucinations** occur when the model is asked about events after its training cutoff. Some models will refuse; others will invent plausible-sounding "recent" developments that never occurred. The fluency of the prose masks the anachronism.

**Internal contradictions** happen when a model generates multiple paragraphs that disagree with each other. In a long draft, the model may assert a position in one section and its opposite in another, because each section is generated from a local context window rather than from a global understanding of the document's argument. The writer who delegates structural coherence to the model may find the argument collapsing under its own contradictions.

**Synthesized wisdom** is the subtlest form. The model combines ideas from multiple sources into a coherent-sounding argument that no single human has ever made. The argument may be valid, or it may be a *motte-and-bailey* construction where strong claims are smuggled in on the back of weak premises. The writer who passes this off as original insight is not plagiarizing; they are laundering.

## Why This Matters to Writers

In ["How Large Language Models Actually Work"](/blog/how-llms-work), I described the transformer architecture as a pattern-completion engine. In ["Tokens, Context Windows, and the Geometry of Meaning"](/blog/tokens-context-windows-meaning), I showed how meaning is geometrically encoded in high-dimensional space. Both articles were designed to build your technical understanding so that you could use these tools effectively.

This article is a corrective. Technical understanding without epistemic caution is dangerous. The better you get at prompting, the more fluent the output becomes, and the harder it becomes to spot the lies. The writer who masters AI-assisted composition without mastering AI-assisted verification is building a house on sand — and the sand is exceptionally well-structured.

Consider the workflow of a journalist using AI to draft a profile. The model generates background paragraphs, synthesizes biographical details, and produces quotations attributed to the subject's former colleagues. Every sentence reads like journalism. Two of the quotations are fabricated. The journalist, working under deadline, misses the fabrication. The article ships. A lawsuit follows.

Consider the academic using AI to write a literature review. The model cites fifteen papers, twelve of which exist, three of which do not. The peer reviewers, trusting the author, do not check every citation. The paper is published. The fabricated citations propagate into other AI training data, creating a feedback loop of fictional scholarship.

These are not hypotheticals. They are happening now, and they will happen more frequently as AI tools become standard in professional writing environments. The writer's responsibility has always included verification. What changes is the *scale* of the verification task. When you write alone, you verify your own sources. When you write with AI, you must verify the model's sources, your sources, and the places where the two have become indistinguishable.

## The Limits of Generation

Hallucination is not a bug that will be patched out of future models. It is a structural consequence of the way generative models relate to language and reality. To understand why, consider what would be required to eliminate hallucination entirely.

A model would need real-time access to a verified knowledge base. It would need a truth-evaluation mechanism independent of statistical probability. It would need to distinguish between common knowledge, contested claims, and outright falsehoods, and to mark each category appropriately. It would need to know when it does not know, and to express that uncertainty in ways that do not undermine the user's trust.

Some of these capabilities are emerging. Retrieval-augmented generation (RAG) allows models to query external databases before responding. Tool use lets models call search engines and calculators. But these are mitigations, not solutions. They reduce the frequency of hallucination without eliminating its possibility. A RAG system querying a flawed database will generate flawed answers. A tool-using model interpreting search results can still misread, misquote, or miscontextualize.

The deeper limit is philosophical. Language models generate *language*. They do not generate *truth*. Truth is a relationship between propositions and the world, and models have no access to the world except through the text they have been trained on. They are not ignorant; they are *disconnected*. They live in a library with no windows, and they have learned to speak so eloquently about the outside that we sometimes forget they have never seen it.

For the writer, this means accepting a fundamental constraint: AI can help you write, but it cannot relieve you of the obligation to know. The model is a language-prosthesis, not a knowledge-prosthesis. It extends your fluency, your range, your syntactic options. It does not extend your memory, your judgment, or your contact with reality. When you ask it to write about something you do not understand, it will produce prose that sounds like understanding — and that prose will be, at best, a sophisticated guess, and at worst, a confident lie.

## A Verification Protocol for AI-Augmented Writing

Given that hallucination is endemic, the question is not whether to use AI but how to contain the risk. Here is the protocol I use at Harry's Desk.

**Never accept a citation without looking it up.** This is non-negotiable. If a model cites a book, check the library catalog or Google Books. If it cites a paper, check Google Scholar. If it cites a website, visit the URL. The time you spend verifying is less than the time you will spend retracting.

**Cross-check facts against primary sources.** When a model provides historical dates, scientific claims, or statistical data, verify them against an authoritative source. Wikipedia is acceptable for initial triage; peer-reviewed sources are required for publication.

**Watch for specificity as a warning sign.** The more detailed a claim, the more carefully it needs to be checked. A model that gives you a precise percentage, a named individual, or a dated event is often interpolating, not recalling. Specificity is not credibility.

**Maintain a "doubt budget."** For every piece you write with AI assistance, allocate a fixed amount of time for fact-checking. I recommend a ratio of 1:3 — one minute of generation for three minutes of verification. If you cannot afford the verification time, you cannot afford the generation.

**Use multiple models for contested claims.** If one model asserts a controversial fact, ask another. If they agree, the claim is more likely to be true (or more likely to be a shared training bias). If they disagree, you have found a frontier where human judgment is required.

**Mark AI-assisted passages in your draft.** I maintain a color-coded system: green for verified facts, yellow for claims pending verification, red for anything generated that I have not yet checked. The draft is not done until it is all green or excised.

## The Ethics of Uncertainty

There is a subtler issue beneath the practical warnings. When we use AI to write, we are importing a kind of epistemic opacity into our own work. We no longer know, with certainty, where every claim originated. The boundary between "what I know" and "what the model suggested" becomes blurry, especially after multiple rounds of revision.

This is not a new problem. Writers have always used research assistants, editors, and ghostwriters. But AI introduces a difference of degree that becomes a difference in kind. The assistant who hands you a flawed note is accountable. The model that generates a flawed paragraph is not. The accountability reverts to you, the writer, and you may not even know what you are accountable for.

In ["The Writer's Dilemma"](/blog/the-writers-dilemma-why-ai-changes-everything), I argued that AI raises the bar for human writing by making fluent prose abundant. In ["The Symbiotic Model"](/blog/the-symbiotic-model), I proposed that the future belongs to writers who treat AI as a collaborator rather than a replacement. Both arguments assume that the human writer remains the final arbiter of quality and truth. This article is the corollary: you cannot be the final arbiter if you do not know what needs arbitrating. Verification is not a post-production step. It is a *constitutive* act of authorship in the age of generation.

## For Next Time

Monday's article — "Prompt Engineering Is Not Coding — It's Composition" — moves from the limits of models to the craft of directing them. We have established what AI cannot do reliably. Now we begin learning how to work within those limits, treating the prompt not as a command but as a compositional instrument. We will explore how word choice, structure, and rhetorical framing in the prompt shape the output more profoundly than any technical parameter.

Until then, try this experiment. Ask your preferred AI to summarize a book you know intimately — one you have read cover to cover, more than once. Read the summary carefully. Mark every error, however small. Mark every omission that flattens the argument. Mark every confident claim that is, in your expert judgment, a confabulation. Count the marks. That number is your personal hallucination index for that model, on that topic, today. Keep it in mind every time you delegate research to a machine.

The fluency is dazzling. The facts are negotiable. Your attention is the only currency that matters.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 2, Article 3*
