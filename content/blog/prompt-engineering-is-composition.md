---
slug: "prompt-engineering-is-composition"
title: "Prompt Engineering Is Not Coding — It's Composition"
excerpt: "The most dangerous misconception about working with large language models is hidden in the name we gave to the activity itself. Prompting is not engineering. It is composition."
date: "2026-06-10"
categories: ["AI Craft", "Writing"]
readTime: 11
image: "/images/blog/harrys-desk-prompt-engineering-is-composition.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/prompt-engineering-is-composition/"
---
The most dangerous misconception about working with large language models is hidden in the name we gave to the activity itself. "Prompt engineering" sounds like a technical discipline. It suggests specifications, requirements, units of measurement, repeatable procedures. It invites comparisons to software engineering, electrical engineering, chemical engineering — fields where precision yields predictability and expertise means knowing the exact inputs that guarantee a given output.

This metaphor is wrong. Worse, it misleads writers into thinking they need to learn a new technical skill when they already possess the core competence. Prompting is not engineering. It is composition.

And composition is what writers have been doing for millennia.

## The Engineering Metaphor and Its Costs

In software engineering, a function call is deterministic. If I call `sqrt(16)`, I get `4` every time, on every machine, in every context. The programmer's job is to construct a chain of such determinations, each feeding into the next, until the desired computation is complete. Uncertainty is the enemy. Randomness is a bug.

In prompt engineering — if we must use the term — the situation is reversed. The same prompt, submitted twice, will produce two different responses. Not because the system is broken, but because it is designed to sample from a probability distribution over possible next tokens. The writer who treats prompting like function calls will be perpetually frustrated. The system does not obey. It suggests. It improvises. It completes.

This is not a failing. It is the nature of the instrument. And it means the skills that matter are not engineering skills. They are rhetorical skills: knowing your audience, defining your purpose, establishing tone, providing constraints, sequencing information, anticipating misunderstanding. These are the skills of the essayist, the novelist, the journalist, the poet. These are the skills of composition.

When we call it "engineering," we import a framework of control that does not fit the material. We train writers to optimize for determinism in a medium that operates on likelihood. We encourage the search for "the perfect prompt" — a magic incantation that unlocks flawless output — when what we need is the ability to compose a sequence of instructions, examples, and constraints that guide a stochastic system toward a useful region of its possibility space.

This is not engineering. This is directing. This is conducting. This is writing a letter to a brilliant, literal-minded collaborator who has read everything but understood nothing.

## What Prompting Actually Is

At its core, prompting is the art of instructing a language model to produce a particular kind of text by describing that text in language. You are not wiring circuits. You are composing a brief. A good brief — whether given to a research assistant, a ghostwriter, or a language model — contains the same elements:

**The frame:** What is this? A legal memo? A love letter? A technical white paper? The frame tells the model which region of its training data to activate. "Write an analysis" and "Write a story" are not just different topics; they are different genres, and genres carry conventions that shape every sentence.

**The constraint:** What must be true of the output? Length, structure, tone, perspective, level of detail, inclusion or exclusion of specific topics. Constraints reduce the model's freedom in useful ways. But they must be stated clearly, because the model has no implicit understanding of your unstated preferences.

**The exemplar:** Sometimes the best instruction is an example. Show the model what you want rather than telling it. This is the principle behind few-shot prompting, which we will explore in depth in Wednesday's article. For now, note that exemplars are not cheating. They are a form of composition — the composition of a model response that establishes the pattern you want continued.

**The sequence:** Complex tasks rarely work in a single prompt. They require a sequence of prompts that build context incrementally. This is dialogue, not dispatch. Each exchange refines the direction. The writer who plans a prompt sequence is planning a scene, a chapter, an argument — organizing information in time so that each addition makes the next addition more precise.

These four elements — frame, constraint, exemplar, sequence — are the grammar of prompting. And they are also the grammar of good writing instruction. When an MFA professor tells a student to "write a two-page scene from the perspective of a character who is lying," she is giving a prompt. She is framing (scene), constraining (two pages, liar's perspective), and implying an exemplar (the student's previous work, or published models of the form). The only difference is that the student understands implication. The model does not.

## The Myth of the Magic Prompt

Spend ten minutes in any AI writing forum and you will encounter the quest for the magic prompt. "What's the prompt you use for blog posts?" "Does anyone have a good prompt for novel outlines?" The assumption behind these questions is that there exists a string of words that, fed to the model, reliably produces excellent output across contexts.

There is no such string. There never will be.

The reason is fundamental to how language models operate. Their output is conditioned on the prompt, but it is also conditioned on the internal sampling process, which introduces variability. More importantly, their output is shaped by the vast distribution of text they were trained on — a distribution that includes garbage and gold, cliché and originality, accuracy and error. A prompt that produces a brilliant result for one user may produce mediocrity for another, not because the prompt changed but because the random walk through token space landed in a different neighborhood.

But there is a deeper reason the magic prompt is a myth. Good writing is not generic. It is specific. A prompt that could produce any blog post can produce only an average blog post. A prompt that could produce any novel scene can produce only a stereotypical scene. The specificity that makes writing valuable — the particular angle, the unexpected connection, the voice that could only belong to one writer — cannot be encoded in a general-purpose prompt. It can only emerge from a specific writer's specific intentions, expressed in a specific prompt tailored to a specific moment.

This is why I discourage the use of "prompt libraries" as anything more than starting points. Yes, collect templates. Yes, study what works. But treat every prompt as a draft that requires revision. The first prompt is your rough sketch. The second prompt sharpens the focus. The third prompt adds the constraint you forgot. The fourth prompt corrects the misunderstanding. This iterative cycle is not a workaround for imperfect technology. It is the craft.

## The Writer's Natural Advantage

Here is the good news, which I will state as plainly as I can: if you are a trained writer, you are already a better prompter than you think. The skills that make you a competent writer are the same skills that make you a competent prompter. You simply need to translate them into a new medium.

Consider voice. A writer who understands voice — who can hear the difference between Hemingway and Woolf, between a Supreme Court opinion and a tabloid editorial — can prompt a model to approximate those voices with remarkable fidelity. The writer does not need to understand transformer architecture. The writer needs to understand prosody, diction, rhythm, register. These are literary skills, not technical ones.

Consider structure. A writer who can outline an argument, map a plot, or design a chapter sequence can prompt a model to generate structural elements that serve a larger architecture. The writer becomes an architect, commissioning components from a fabricator. The skill is not in the fabrication. It is in the specification.

Consider audience. A writer who knows who she is writing for — what they know, what they need, what will bore them, what will surprise them — can prompt a model with audience-awareness that no generic template can match. The prompt becomes a communication act with a real intended recipient, even if the immediate interlocutor is a machine.

The writer's natural advantage in the age of AI is not speed. It is judgment. And judgment, applied to prompting, is simply taste — the cultivated ability to distinguish better from worse, specific from generic, alive from dead.

## Toward a Rhetoric of Prompts

If prompting is composition, then it deserves a rhetoric — a systematic study of how different compositional choices produce different effects. We do not yet have this rhetoric. The field is too new. But we can begin to assemble it from the practices that experienced writers already know.

**The rhetorical stance of the prompt.** Every prompt embodies a relationship between prompter and model. "Write me..." is a command. "Imagine you are..." is a role-play. "Here is a draft. Please improve it by..." is a collaboration. "Explain this to me as if I were a beginner" is a pedagogy. Each stance produces a different kind of output because it activates different patterns in the training data. The writer who varies her rhetorical stance intentionally, matching it to the task, will get better results than the writer who always prompts in the same register.

**The economy of context.** Models process context windows of limited size — a reality we explored in [Tokens, Context Windows, and the Geometry of Meaning](/blog/tokens-context-windows-meaning). The writer who understands this constraint — who knows that earlier instructions may be overridden by later ones, that examples consume space that could be used for constraints, that repetition sometimes reinforces and sometimes dilutes — is managing a resource the way a poet manages syllables. Economy is not just brevity. It is strategic allocation of attention.

**The ethics of instruction.** A prompt is an act of speech. It has intentions, assumptions, biases, and consequences. When you ask a model to "write a persuasive argument against regulation of AI," you are not performing a neutral technical operation. You are commissioning rhetoric. The prompt encodes your values, your purposes, your responsibilities. Treating prompting as pure technique — as engineering divorced from ethics — is a category error that leads to the worst abuses of generative AI: disinformation, manipulation, plagiarism at scale. We touched on these limits in [Hallucination, Confabulation, and the Limits of Generation](/blog/hallucination-confabulation-limits), and we will return to the ethics of authorship in Week 6.

In Wednesday's article — "Chain-of-Thought, Few-Shot, and Structured Prompting" — I will introduce three advanced techniques that operationalize the principles I've outlined here. But techniques without the underlying compositional mindset are just tricks. The foundation must be the understanding that you are not programming a computer. You are composing with a partner.

## What Changes When You Stop Engineering and Start Composing

The shift from an engineering mindset to a compositional mindset changes everything about how you work with AI.

You stop looking for the perfect prompt and start drafting prompts the way you draft paragraphs — knowing that the first version will be imperfect and that refinement is where the craft lives.

You stop treating the model's output as a product and start treating it as a response — something to be interpreted, evaluated, and responded to in turn.

You stop thinking of yourself as a user and start thinking of yourself as an author — the source of intention, the arbiter of quality, the one who signs the work.

You stop fearing that the model will replace you, because you recognize that the model cannot compose your intentions. It can only fulfill instructions. And the composition of intentions — the decision about what to say, to whom, in what form, for what purpose — is the irreducibly human center of writing.

This is the symbiotic model we discussed in [The Symbiotic Model — Human + AI, Not Human vs AI](/blog/the-symbiotic-model): the human provides meaning and judgment; the machine provides fluency and scale. The prompt is the interface between the two. It is not a cable. It is a conversation.

## For Next Time

On Wednesday, we get technical — but technically literary. "Chain-of-Thought, Few-Shot, and Structured Prompting" introduces three methods for controlling model output without sacrificing the flexibility that makes these tools useful. We will look at how to make a model show its work, how to teach it a new format with a single example, and how to constrain its output to predictable structures. These are power tools. But as with all power tools, they are dangerous in careless hands.

Your homework until then: take a piece of writing you recently completed — an email, an essay, a story scene. Compose a prompt that could have produced the first paragraph. Not a generic "write a paragraph about X," but a specific, framed, constrained brief that captures the voice, structure, and purpose of your actual work. Notice how much you know about your own writing that you never articulated before. That knowledge is your prompting capital. Spend it wisely.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 3, Article 1*
