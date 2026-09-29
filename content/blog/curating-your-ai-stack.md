---
slug: "curating-your-ai-stack"
title: "Curating Your AI Stack (Claude, GPT, Gemini, Perplexity, etc.)"
excerpt: "The right tool for the right sentence. A writer's AI stack is not a collection of chatbots — it is a workshop with different benches for different kinds of thinking."
date: "2026-07-06"
categories: ["AI Craft", "Writing"]
readTime: 13
image: "/images/blog/harrys-desk-curating-your-ai-stack.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/curating-your-ai-stack/"
---
After six weeks of talking about *how* to write with AI, it is time to talk about *where* to do the work. The question is no longer whether to use these tools. It is which one to open for which task, and why.

The answer matters more than most writers realize. A model is not a neutral container into which you pour prompts. Each one has a temperament: a default tone, a tolerance for ambiguity, a way of handling evidence, a willingness to argue or to soothe. Use the wrong temperament for the wrong job and you will find yourself fighting the tool instead of using it. Use the right one and the work becomes strangely fluid — as if the sentence you needed had been waiting in the room before you arrived.

In this article I want to help you build what I call a *writer's AI stack*: a small, deliberate set of models and services, each chosen for a specific kind of writing labor. I will focus on the major options available as of mid-2026 — Claude, GPT-4o and its variants, Gemini, Perplexity, and a few specialized companions — not because the landscape will stay the same, but because the *principles* of curation will stay the same long after the names change.

## The Stack Is Not a Trophy Shelf

There is a temptation, especially early on, to collect access to every model and call that sophistication. It is not. A stack is useful only when it reduces friction. If you spend more time choosing which model to use than writing, your stack is too large.

My own stack has shrunk over time, not grown. I use a primary model for drafting and revision, a search-and-synthesis model for research, a reasoning model for difficult structural questions, and a few narrow tools for specialized tasks. That is it. The discipline is to know what each one does well enough that the choice becomes automatic.

The goal is to reach a state I call *unconscious curation*: you know, without deliberation, which bench to sit at for which part of the job. This article is the path to that state.

## The Four Benches of a Writer's Stack

Think of your stack as a workshop with four benches, each designed for a different phase of composition.

**The drafting bench** is where you generate, continue, and reshape prose. You want a model with a strong ear for voice, a good sense of rhythm, and the patience to follow your lead rather than take over. This is usually your most-used bench, so the fit matters most.

**The research bench** is where you gather, verify, and synthesize information. Here you want access to live or recent sources, citations you can follow, and a temperament that admits uncertainty rather than fabricating certainty. Speed of retrieval matters, but accuracy matters more.

**The reasoning bench** is where you solve hard structural or argumentative problems. You want a model that can hold many constraints at once, trace implications, and argue against your position without collapsing into agreement. This bench is for the thinking you do not yet know how to finish.

**The specialized bench** is for narrow tasks: style imitation, grammar checking, formatting, translation, transcription, data extraction. These tools often do one thing better than any general model can.

Most writers try to make one model do all four. That is the source of much frustration. No single model is best at everything, and pretending otherwise is like trying to saw boards with a screwdriver.

## Claude: The Drafting Bench

In my own practice, Claude — Anthropic's family of models — sits at the drafting bench. The reasons are subjective but worth naming because they illustrate how to evaluate a model for this role.

Claude tends toward longer, more measured responses. It handles context well, which matters when you are feeding it a chapter and asking for continuity. It is less eager to please than some models; it will push back on weak prompts, ask clarifying questions, and occasionally refuse to generate something it considers misleading. For a writer, that friction is useful. A model that always says yes is a model that will confirm your bad ideas.

The model is also strong at stylistic mimicry. If you give it a few paragraphs of your own prose and ask it to continue in the same register, the results are often credible — not perfect, but close enough to be revised into something real. This makes it the right place to do the kind of voice training we discussed in ["Style Transfer: Teaching AI Your Voice"](/blog/style-transfer-teaching-ai-your-voice).

Claude's weaknesses matter too. It is not primarily a search tool; its knowledge has a cutoff and it will confidently reason from outdated facts if you let it. For research, you need another bench.

## GPT: The Versatile Default

OpenAI's GPT models, particularly GPT-4o and its successors, remain the most versatile default. They are fast, broadly capable, and deeply integrated into the ecosystem of writing tools. If you subscribe to one model as your starting point, GPT is the safest bet — not because it is always best, but because it is rarely bad.

For writers, GPT's strength is responsiveness. It tends to give you what you asked for, quickly and in the shape you requested. If you need a dozen variations on an opening line, a clean outline, or a compressed version of a paragraph, GPT is reliable. Its Custom GPTs and project folders also make it useful for building persistent prompt libraries, which we will cover in Wednesday's article.

The weakness is the mirror of the strength. GPT can be too agreeable, too quick to produce plausible-sounding prose that flattens your voice. It is also more inclined than Claude to hallucinate details when asked to generate specifics — dates, names, studies, quotations. This does not make it unusable; it makes it a tool you must verify more carefully when facts are at stake.

I often use GPT for early exploration and Claude for deeper drafting. The two models think differently, and the difference is productive.

## Gemini: The Long-Context and Multimodal Bench

Google's Gemini family earns its place in a writer's stack through two distinctive capabilities: very large context windows and native multimodality. If you are working with a full book manuscript, a lengthy transcript, or a dense PDF and you want to ask questions across the whole thing, Gemini can often accept material that would break other models.

For non-fiction writers, this is transformative. You can upload a hundred pages of interview transcripts and ask the model to find every mention of a theme, to summarize one subject's perspective, or to suggest a narrative structure based on the material. For novelists, you can feed an entire draft and ask for consistency checks: does this character's motivation shift? Does the timeline hold? Have I introduced a detail I never resolved?

The multimodal side matters too. If your source material includes images, charts, scanned documents, or screenshots, a model that can read both text and image in the same context saves enormous labor. A journalist analyzing a photographed document, a biographer working with archival scans, a technical writer extracting labels from a diagram — all benefit from a model that sees as well as reads.

Gemini is not always as graceful in prose generation as Claude or GPT. I tend to use it less for *writing* and more for *reading and organizing*. That is a legitimate bench.

## Perplexity: The Research Bench

Perplexity is not a general-purpose chatbot in the same way as the others. It is a search-and-synthesis engine, and for writers it belongs at the research bench almost by default.

The model's central virtue is citation. When you ask a question, it returns not just an answer but sources. You can follow the links. You can check the original. This matters because, as we have discussed, one of the writer's primary obligations in the AI age is verification. Perplexity does not remove that obligation, but it makes the work faster and more transparent.

I use Perplexity at several stages of a project. Early on, for orientation: what has been written about this topic, what are the major positions, who are the key voices? Later, for fact-checking: does this study say what I think it says, is this date right, is this claim still current? Finally, for source discovery: I am looking for a specific kind of example or quotation; can you point me to the original?

Perplexity is not perfect. It sometimes cites sources that do not fully support the claim attributed to them, especially when the question is complex or contested. You must still read the sources. But it gives you a head start that a generic model cannot.

The other research-oriented tools — including Bing's Copilot, You.com, and specialized academic search interfaces — play similar roles. The principle is the same: separate the search bench from the drafting bench, and never ask your drafter to do your researcher's job.

## Specialized Tools and When to Use Them

Beyond the general models, a writer's stack should include a few narrow specialists. The exact names will change, but the categories persist.

**Grammar and style checkers** — tools like ProWritingAid, Grammarly, or built-in style editors — are best used late in the process, not as creative partners but as proofreaders. They catch what you have become too tired to see. Do not let them rewrite your voice; use them to enforce consistency.

**Transcription services** are essential for interview-based writers, oral historians, podcasters, and anyone working with spoken source material. Accuracy rates have improved dramatically, but always spot-check names, technical terms, and ambiguous passages against the audio.

**Translation tools** have become remarkably good for gisting and even draft translation, but literary translation remains a specialized craft. Use AI translation for orientation, not for publication-ready work unless you are fluent in the target language and can revise.

**Citation managers** like Zotero, combined with AI extraction tools, can turn PDFs into organized libraries faster than manual entry ever could. This is especially valuable for non-fiction and academic writers.

**Custom agents and local models** are increasingly viable for writers with privacy concerns or specialized needs. Running a local model means no vendor sees your drafts, which matters for sensitive material. The tradeoff is usually capability and convenience. I keep a local model in my stack for first drafts of personal or confidential work, not because it is better, but because it is mine.

## How to Choose: A Practical Rubric

With so many options, how do you decide? I use four questions.

**Does it sound like me?** This is the voice test. Feed the model a few paragraphs of your own writing and ask it to continue. If the result feels alien, it will cost you more revision time than it saves. The best drafting model is the one whose default output you can most easily bend toward your voice.

**Does it admit when it does not know?** This is the honesty test. Ask it a question outside its training data or ask it to cite a source it cannot verify. A model that makes up confident answers is dangerous for research. A model that says "I don't have that information" is trustworthy in the way that matters.

**Does it follow complex constraints?** This is the control test. Give it a prompt with several conditions — length, tone, structure, audience — and see how well it honors all of them. A model that ignores half your instructions is a poor partner for serious composition.

**Does it improve with iteration?** This is the collaboration test. Take a paragraph through three or four rounds of revision with the model. Does it get better, or does it drift? Does it remember your earlier instructions, or do you have to repeat them? The models that learn within a session are more pleasant to work with.

Run this rubric yourself. Your answers will differ from mine because your voice, your projects, and your tolerances differ. There is no universal correct stack.

## The Stack Changes With the Project

A short story requires different tools than a reported essay. A technical white paper requires different tools than a memoir. Your stack should change with the project, even if your core benches stay the same.

For fiction, I lean on Claude for drafting and Gemini for manuscript-wide consistency checks. For journalism, Perplexity is essential and a fast general model handles the first pass of transcription and summary. For technical writing, I want a model with a strong tolerance for precise terminology and a low tolerance for vague claims. For biography, I want long context and strong source handling.

The stack is not a permanent installation. It is a kit you pack differently for each journey.

## What You Should Not Delegate

No matter how good your stack becomes, some tasks should remain human-first.

Do not let a model choose what you care about. It can help you articulate it, but the originating motive must be yours. Do not let a model decide what is true. It can present evidence, but the judgment is yours. Do not let a model determine the final shape of a piece. It can suggest, but the architecture must pass through your hands. And do not let a model take the blame. Whatever you publish, you stand behind.

These are not technical limitations. They are authorial commitments. Your stack is only as good as the human judgment that steers it.

## Building Your Stack This Week

Here is a simple assignment before Wednesday's article. List every AI tool you currently use for writing. Next to each, write the one task for which it is *best*. If you cannot name a specific task, you do not need the tool. Then identify the one task you currently struggle with most and try a different model for it. Notice the difference. That noticing is how a stack gets curated rather than accumulated.

## For Next Time

Wednesday's article — "[Prompt Libraries and Custom GPTs for Writers](/blog/prompt-libraries-and-custom-gpts-for-writers)" — turns this stack into a system. We will build reusable prompts, organize them by task and genre, and look at how custom GPTs and project folders can make your AI partners more consistent and more yours. Think of today's curation as choosing the workshop; Wednesday's work is arranging the tools on the bench so you can find them without thinking.

Your homework: write a one-paragraph review of each model in your current stack. What does it do well? Where does it fail you? By Wednesday you will know what prompts you need to build.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 7, Article 1*
