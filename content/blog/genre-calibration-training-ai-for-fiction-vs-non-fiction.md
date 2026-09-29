---
slug: "genre-calibration-training-ai-for-fiction-vs-non-fiction"
title: "Genre Calibration: Training AI for Fiction vs Non-Fiction"
excerpt: "How to tune a large language model for the conventions of different genres without letting the genre swallow your voice."
date: "2026-06-17"
categories: ["AI Craft", "Writing"]
readTime: 12
image: "/images/blog/harrys-desk-genre-calibration-training-ai-for-fiction-vs-non-fiction.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/genre-calibration-training-ai-for-fiction-vs-non-fiction/"
---
A writer who has learned to teach a model her voice still faces a harder problem. Voice travels across forms, but genre is form itself. The same sentence that sounds precise in a profile reads as cold in a romance scene. The metaphor that illuminates a lyric essay becomes a lie in a news report. The model, trained on everything at once, does not automatically know which kingdom it has entered. It needs calibration.

In the last essay, ["Style Transfer: Teaching AI Your Voice"](/blog/style-transfer-teaching-ai-your-voice), I argued that voice transfer is the art of making the machine compose in a recognizably personal sound. But a voice without genre awareness is like a singer who performs every song in the same tempo. The voice remains, but the meaning misfires. This week we turn to *genre calibration*: the discipline of tuning a model so that it honors the conventions of fiction, non-fiction, journalism, essay, technical writing, or any other form you ask it to enter.

This is not about fitting templates. Genre conventions are not Mad Libs. They are contracts with the reader, accumulated over centuries of reading expectations. When a reader opens a short story, she expects invention, sensory detail, and a shape that resolves emotionally even if it does not resolve logically. When she opens a research report, she expects evidence, structure, and restraint. The model must feel the difference. So must the writer who directs it.

## What Genre Actually Does

Writers often think of genre as a shelf in a bookstore: mystery here, memoir there, science fiction on the far wall. That view is useful for marketing but useless for craft. A better view is that genre is a set of *agreements* about what kind of attention the text demands and what kind of reality it claims.

Fiction asks the reader to suspend disbelief and enter an invented world. The contract says: these events did not happen, but they must feel as if they *could* have happened within the logic of the story. The prose is therefore allowed—encouraged—to dramatize, to compress, to heighten, to invent dialogue and interior thought. Its authority comes from coherence and emotional truth, not from documentation.

Non-fiction makes a different contract. Whether it is a personal essay, a profile, an argument, or a technical manual, it claims some relationship to actuality. The exact terms of that relationship vary—memoir trades on memory, reportage on observation, argument on evidence—but the reader is entitled to expect that the writer is not simply making things up. The prose may be beautiful, but its beauty must not obscure its obligation to the real.

Journalism narrows the contract further. The reader expects timeliness, attribution, and a balance of perspectives within the limits of the form. Technical writing narrows it in a different direction: clarity above style, procedure above personality. Poetry, biography, the op-ed, the grant proposal—each has its own covenant.

When you ask a model to write "a story" or "an essay" without specifying which conventions you mean, you get the statistical average of all of them. That average is recognizable as human prose but trustworthy as none of them. Genre calibration is the work of dragging the model out of that average and into a specific contract.

## Fiction Calibration: Permission and Constraint

The first thing a model needs for fiction is *permission*. Most of its training data treats invention with caution. Encyclopedias, textbooks, news articles, documentation, Wikipedia—these dominate many corpora and teach the model to be cautious about facts, attributions, and unsupported claims. When you ask such a model to write fiction, it often hedges. It describes events from a distance. It summarizes scenes instead of dramatizing them. It offers exposition where it should offer action.

The antidote is to give explicit permission. "This is fiction. Invent freely. Show scenes through action and dialogue. Include sensory detail. Do not hedge with 'it is said that' or 'some believe.' Do not attribute invented events to sources. The narrator is authoritative within the world of the story."

Permission must be paired with constraint, because unbounded invention produces dream logic. A useful constraint names the subgenre. "Write a literary realist scene" produces different output than "Write a science-fiction action sequence" or "Write a Regency romance dialogue." The model has encountered enough examples of each to approximate their conventions. The more specific your frame, the less it will drift toward the generic middle.

For fiction, I also find it useful to add *dramatic* constraints rather than just stylistic ones. "The scene must contain two characters, one secret, and a single object that changes hands." "The protagonist wants something he cannot name." "Begin in medias res and end on a moment of recognition." These constraints activate the model's sense of story structure. They turn prose generation into scene generation.

Voice and persona matter here too. A first-person unreliable narrator needs different instructions than an omniscient third-person narrator. I often include a brief note on narrative stance: "The narrator is close to the protagonist's thoughts but skeptical of his judgments" or "The narrator observes from a distance and withholds moral commentary." These are the kinds of instructions a writer gives to herself before drafting. Handing them to the model produces output that already understands its own orientation.

## Non-Fiction Calibration: The Reality Contract

Non-fiction requires the opposite calibration. The model must be reminded that it is *not* allowed to invent. This is especially important for subgenres that depend on factual integrity: journalism, profiles, research summaries, reported essays, technical documentation.

A non-fiction frame should state the contract explicitly. "This is non-fiction. Do not invent events, people, quotations, statistics, or sources. If you do not have reliable information, say so. Attribute claims. Distinguish between observation and inference. Use concrete detail that could plausibly be observed or documented."

The model will still sometimes confabulate, because confabulation is a property of the architecture, not of moral carelessness. That is why non-fiction calibration must include verification checkpoints. I often structure the prompt as a chain-of-thought: "First, summarize only what is directly supported by the provided source material. Then, identify any claims that would require independent verification. Then, draft the passage, flagging uncertain claims with [VERIFY]." This turns the model into a transparent collaborator rather than a silent fabricator.

For essayistic non-fiction, the calibration is slightly different. A lyric essay or personal essay is allowed—expected—to be subjective, associative, and structurally experimental. The contract is not "no invention" but "honest relation to experience." I frame these by naming the tradition: "Write in the style of a lyric essay: short sections, image-driven, associative logic, personal but not sentimental." The model will approximate the form, and then I revise for the honesty that only a human can vouch for.

## The Same Fact in Six Genres

One of the most useful exercises I know is to feed the model the same small fact or premise and ask for it in six different genres. The result reveals how deeply genre shapes meaning.

Let us take a single premise: a woman returns to her childhood home after twenty years and finds a box of letters in the attic.

In **literary fiction**, the scene slows down. Light falls through a window. Dust moves. Each letter becomes a portal. The prose attends to memory, regret, and the sensory specificity of the house.

In **genre fiction—say, a mystery**—the box is a clue. The prose accelerates toward revelation. The letters contain threats, omissions, or coded names. The reader is invited to solve.

In **memoir**, the writer must establish the truth-claim. The attic, the box, the handwriting—these are evidence of a life. The prose can be reflective but must not fabricate dialogue the writer cannot remember.

In **journalism**, the attic discovery becomes a news hook only if it connects to a public event. The writer identifies the woman, dates the letters, interviews relevant sources, and puts the find in context. The personal is subordinate to the verifiable.

In **technical documentation**, the premise is unwritable unless it is converted into a procedure: "How to Archive Family Letters." The genre strips away narrative and replaces it with steps, materials, and warnings.

In **marketing copy**, the attic becomes a metaphor. "Some things are worth coming home for." The letters are not read; they are staged.

The model can produce all six versions if you calibrate it. The versions will not be masterpieces, but they will be *genre-appropriate*, which is the necessary first step. From there, the writer can refine.

## Calibration by Exemplar

As with voice transfer, exemplars are the most reliable teaching tool. If you want the model to write a magazine profile, give it two or three paragraphs from real profiles you admire. If you want a noir scene, supply a few sentences of Chandler or Mosley. The model does not need to imitate the writer's voice exactly; it needs to absorb the genre's *gestalt*: the ratio of scene to summary, the expected emotional register, the way information is released.

I keep small exemplar libraries for the genres I work in most often. Each library contains:

- A definition of the genre's contract.
- Three short passages showing the genre at its best.
- A list of common mistakes the model makes in that genre.
- A checklist for the final output.

For fiction, the checklist might include: scene not summary, concrete sensory detail, a want or need, an obstacle, dialogue if appropriate, and a sense of consequence. For journalism, it might include: dateline or timeliness, attribution, balance, context, and no invented quotation. For technical writing: task orientation, hierarchy, warnings, and plain language.

These libraries are living documents. Every time the model produces a genre-appropriate paragraph that surprises me, I add it to the library. Every time it misses, I add the miss with a note about what went wrong. Over months, the libraries become a private curriculum that makes each new project faster.

## The Danger of Genre Inflation

There is a risk in all of this. A model that has been calibrated for genre can become too good at producing *genre-shaped* prose. It will give you the mystery scene, the magazine profile, the grant proposal in their most recognizable forms. Recognizability is not the same as freshness. The genres have clichés, and the model knows them by heart.

This is where the writer's judgment returns. Calibration is a starting condition, not a destination. Once the model produces a genre-appropriate draft, the writer must ask: where is the surprise? Where is the deviation that earns the reader's attention? Genre gives the reader a set of expectations. Art comes from fulfilling some expectations and violating others with precision.

I often add a final instruction: "After drafting, identify one convention you followed exactly and one you quietly subverted. Explain the choice." This forces the model—or, more honestly, forces *me* during revision—to think about the genre as a field of tension rather than a template. A mystery can slow down for lyric reflection. A profile can withhold the subject's name until late. A technical manual can admit uncertainty. These deviations are risky, but they are also where voice lives.

## Voice Across Genres

We began with voice, moved to genre, and now we must put them together. The ideal is not to let the genre erase the voice or the voice ignore the genre. The ideal is for the writer's recognizability to operate *within* the contract the genre establishes.

If my voice is compressed, concrete, and occasionally witty, it will sound different in a short story than in an essay, but it should still be *mine*. A friend who has read me should be able to say, yes, this is Harry, even if the Harry in the story is inventing dialogue and the Harry in the essay is checking facts. The genre changes what I can do; it should not change who I am as a writer.

The model needs to be told this explicitly. "Honor the conventions of literary fiction, but maintain the voice from the exemplars: short sentences, concrete nouns, direct address, occasional wit." The two frames—genre and voice—work together. Genre answers *what kind of thing is this?* Voice answers *who is speaking?* A good prompt answers both.

## Practical Calibration Prompts

Here are three frames I use repeatedly.

For a **literary short story scene**:
> Write a scene in a literary realist short story. The scene must include two characters, one unspoken tension, and one concrete object. Use sensory detail and mostly dialogue. Do not summarize what the characters feel; show it through action and speech. The prose should be close to the protagonist's perspective but slightly unreliable.

For a **reported profile**:
> Write a passage of a magazine profile based only on the source notes provided. Do not invent quotations, facts, or biographical details. Attribute every claim to a source. Organize the passage around one revealing anecdote and one pattern of behavior. Maintain a warm but journalistically neutral tone.

For a **lyric essay**:
> Write a section of a lyric essay on the provided theme. Use short sections, image-driven prose, and associative logic. The personal is allowed but not sentimental. Do not argue a thesis; let the images carry the meaning. The voice should be intimate and quietly curious.

These prompts are not magic. They are contracts. They tell the model what kingdom it is entering and what rules hold there. The better the contract, the less time you spend correcting violations.

## Why This Belongs in Foundations

Genre calibration appears in the final article of Week 4 because the foundations section of this masterclass is not about memorizing prompt tricks. It is about building a working relationship with the machine. We began with the writer's dilemma, the symbiotic model, the mechanics of language models, the limits of generation, and the compositional arts of prompting and style transfer. Genre calibration is the capstone of that first arc. It says: now that you know how to talk to the model, learn how to tell it what kind of world you are building together.

Everything that follows—fiction, non-fiction, journalism, technical writing, biography, business prose—assumes this skill. A novelist who cannot calibrate for scene will spend hours converting summaries into drama. A journalist who cannot enforce the reality contract will publish embarrassing fabrications. A technical writer who cannot frame procedure will produce elegant confusion.

Genre is not a decoration. It is the shape in which meaning becomes possible. Calibrate the model for it, and the model becomes a versatile instrument. Ignore it, and every draft will sound like the same competent nothing.

## For Next Time

On Friday we close Part I of the foundations with "The Multi-Voice Workshop — Switching Personas Mid-Project." We will look at how a single writer can move between voices within a single work: shifting from exposition to interior monologue, from the essayist's authority to the character's uncertainty, from technical clarity to lyrical compression. The skill of voice-switching is the skill of orchestration, and it is where much of the real joy of AI-augmented writing begins.

**Homework:** Choose a single small incident or fact from your own life. Prompt a model to render it in three genres: literary fiction, memoir, and journalism. Compare the three outputs. Where does the model preserve your voice? Where does the genre swallow it? Revise each version until at least one sentence from each feels true to both the genre and you. That sentence is your calibration point.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 4, Article 2*