---
slug: "prompt-libraries-and-custom-gpts-for-writers"
title: "Prompt Libraries and Custom GPTs for Writers"
excerpt: "A prompt you use once is a trick. A prompt you refine, name, and return to is a craft asset. Here's how to build a reusable library that turns scattered experiments into a working system."
date: "2026-07-08"
categories: ["AI Craft", "Editing"]
readTime: 12
image: "/images/blog/harrys-desk-prompt-libraries-and-custom-gpts-for-writers.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/prompt-libraries-and-custom-gpts-for-writers/"
---
On Monday we chose the workshop. Today we arrange the tools on the bench.

A writer's AI stack is only as good as the prompts that activate it. In the early days of using these models, most of us treat prompting like a conversation at a party: improvised, forgettable, and rarely repeatable. We ask, we receive, we move on. The result is a drawer full of one-off exchanges — useful in the moment, lost to memory an hour later.

There is a better way. A prompt you use once is a trick. A prompt you refine, name, and return to is a *craft asset*. It becomes part of your working memory as a writer, something you can hand to a collaborator, adapt for a new project, or teach to a student. In this article I want to show you how to build a prompt library — and, where it makes sense, how to turn those prompts into custom GPTs or project-bound assistants that preserve your conventions across sessions.

This is the discipline that separates dabbling from practice.

## Why Prompt Libraries Matter

The difference between an amateur and a professional, in almost any craft, is the presence of reusable patterns. A carpenter has jigs. A chef has mise en place. A programmer has functions. A writer has templates, outlines, and now — prompts.

A prompt library does three things. It *saves time*, because you are not rewriting the same instructions every morning. It *improves quality*, because each prompt is the product of multiple rounds of refinement. And it *preserves intention*, because a saved prompt encodes not just what you asked for but *why* — the problem it solves, the project it belongs to, the voice it should serve.

Without a library, your best prompts live in chat history, buried under newer conversations, dependent on a vendor's memory. With a library, you own them. You can version them. You can review them quarterly and retire the ones that no longer serve you.

Most importantly, a library trains you to think about prompting as *design*. You stop asking "what should I say to the machine?" and start asking "what instruction, precisely stated, reliably produces the result I want?" That shift is the heart of the craft.

## What Belongs in a Prompt Library

Not every prompt deserves to be saved. The casual queries — "explain this paragraph," "give me a synonym," "what do you think of this title?" — can stay ephemeral. Save only the prompts that do recurring work.

Here are the categories that tend to accumulate in a working writer's library:

**Voice and style prompts.** Instructions that teach a model to sound like you or like a specific project. These often include sample paragraphs, a list of stylistic rules, and explicit prohibitions. The prompt from ["Style Transfer: Teaching AI Your Voice"](/blog/style-transfer-teaching-ai-your-voice) belongs here, once generalized.

**Structural prompts.** Prompts that generate outlines, beat sheets, chapter maps, or revision plans. These are the blueprints of composition. A good structural prompt does not write the piece for you; it gives you a scaffold you can climb.

**Genre prompts.** Instructions calibrated to fiction, non-fiction, journalism, technical writing, and their sub-genres. A mystery opening prompt differs from a profile opening prompt, and both differ from a white-paper abstract prompt.

**Revision and editing prompts.** Prompts that compress, clarify, sharpen, or expand. These are some of the most valuable assets in the library because revision is where AI assistance pays the clearest dividends.

**Research and verification prompts.** Prompts for summarizing sources, extracting claims, finding contradictions, or checking facts. These should always be paired with source-handling rules, as we discussed in ["Attribution, Disclosure, and the New Citation"](/blog/attribution-disclosure-and-the-new-citation).

**Dialogue and exploration prompts.** Prompts for thinking out loud with the model, testing arguments, or exploring alternatives. These are less polished than revision prompts but just as reusable.

If a prompt does not fit a category, it is either too specific to one project or too vague to be useful. Either refine it or discard it.

## The Anatomy of a Reusable Prompt

A saved prompt should be more than a question. It should be a small document with a predictable shape. I use the following structure for every prompt in my own library:

1. **Name.** A short, memorable title. "Fiction Opening — Atmospheric," "Non-Fiction Lead — Problem-Solution," "Voice Mirror — Formal Academic."

2. **Purpose.** One sentence describing what the prompt is for. This prevents you from using the wrong tool for the job.

3. **The Prompt Itself.** The actual text, written to be copy-pasted or templated. It should include any variables in brackets, like `[GENRE]` or `[AUDIENCE]`.

4. **Example Input and Output.** A real or representative example showing how the prompt behaves when fed material. This is how you test whether the prompt still works after a model update.

5. **Notes.** When to use it, when to avoid it, known failure modes, and any companion prompts that should follow it.

This format takes a few extra minutes to maintain, but it turns a prompt from a fragile utterance into a durable instrument. You can store these documents in a note-taking app, a folder of markdown files, a Notion database, or even a simple spreadsheet. The technology matters less than the consistency.

## Storing and Organizing the Library

Where should the library live? The answer depends on how you already work.

If you live in plain text, a folder of markdown files — one per prompt, organized by category — is clean, portable, and version-controllable. If you live in Notion or Obsidian, a database with tags for category, project, and status works well. If you collaborate, a shared repository or wiki lets the whole team refine prompts together.

My own library lives in an Obsidian vault, organized by genre and task. Each prompt is a note with the five-part structure above. I review the library at the start of each quarter, archive prompts that no longer work, and add new ones only after they have proven themselves across at least three uses.

The discipline is not to build the largest library. It is to build the smallest library that covers your recurring work. A hundred prompts you never use is clutter. Twelve prompts you use constantly is power.

## From Prompts to Custom GPTs

Once a prompt becomes reliable, you can often elevate it into a custom GPT — a persistent assistant with instructions baked into its system context. The advantage is consistency: instead of pasting the prompt every time, you open a dedicated environment that already knows the rules.

Custom GPTs are especially useful in three situations.

First, when the prompt includes a large body of context that you do not want to repeat — sample chapters, style guides, project constraints, reference materials. A custom GPT can hold this context across conversations, which makes it feel more like a collaborator who remembers the project.

Second, when the task is narrow and repeated often. A "Style Mirror" GPT that rewrites anything in your voice. A "Chapter Analyst" GPT that checks manuscript consistency. A "Lead Generator" GPT that produces ten opening options for any article. These narrow specialists outperform general chat sessions because they are designed for one thing.

Third, when you are collaborating with other writers. A shared custom GPT ensures everyone is using the same instructions, the same voice rules, the same definition of quality. It becomes a team standard rather than a personal habit.

The danger of custom GPTs is the same as the danger of any automation: you can forget that you are using a tool. A custom GPT should be an instrument, not an oracle. It should still be questioned, still be corrected, still be overridden by your judgment.

## Designing a Custom GPT: A Checksheet

If you decide to build a custom GPT, start with a clear design. Here is the checksheet I use before creating one.

What is the single task this GPT should do better than a general prompt? If you cannot answer precisely, do not build it.

What voice or tone should it adopt? Should it be direct, encouraging, Socratic, formal, irreverent? The tone shapes the usefulness of the output.

What knowledge does it need? Sample texts, style guides, constraints, reference documents. Upload only what is necessary; too much context can dilute focus.

What should it refuse to do? Every good assistant has boundaries. A revision GPT should not rewrite so aggressively that it erases the author's voice. A research GPT should not fabricate sources. Name the boundaries explicitly in the instructions.

How will you know it is working? Define a test case — a real piece of input and a clear standard for the output. Run the test after every adjustment.

A custom GPT built without this checksheet is usually a generic chatbot with a fancy name. A custom GPT built with it becomes a reliable member of your stack.

## Prompt Libraries and the Stages of Writing

The best way to organize a library is not alphabetically but by where the prompt appears in your workflow. I think of writing in four phases — generative, structural, revision, and finishing — and I keep prompts grouped under each.

In the **generative phase**, you are producing raw material: ideas, scenes, fragments, first drafts. Prompts here should lower inhibition and increase volume. They are permission-givers, not perfectionists.

In the **structural phase**, you are shaping the mass into architecture. Outlines, chapter maps, argument diagrams, scene sequences. Prompts here should be analytical and constraint-honoring.

In the **revision phase**, you are refining what exists. Compression, clarity, voice alignment, fact-checking. Prompts here should be precise and critical.

In the **finishing phase**, you are preparing for readers. Headlines, summaries, meta descriptions, social copy, final proofreading. Prompts here should be concise and audience-aware.

A prompt that works beautifully in one phase may be useless or harmful in another. Knowing where each prompt belongs is part of the discipline.

## The Refinement Habit

A prompt library is never finished. It is a garden. Some prompts flourish; others need pruning; a few should be uprooted entirely.

I review my library at the end of every project and at the start of every quarter. I ask three questions of each prompt:

Did it produce useful output the last three times I used it? If not, it is a candidate for revision or retirement.

Has the underlying model changed in ways that affect its behavior? Model updates can quietly break old prompts. Test the reliable ones periodically.

Is there a simpler version that does the same work? A shorter prompt is usually a better prompt, provided it retains its precision.

This habit protects you from the most common failure mode of prompt libraries: accumulating instructions that no longer match the tools they are meant to control.

## A Sample Entry from My Library

Here is a real prompt from my own library, included not because you should copy it exactly but because you should see what a finished entry looks like.

**Name:** Voice Mirror — Formal Public Essay  
**Purpose:** Rewrite an informal or rough passage in the register of a serious public essay without losing the original meaning.  
**Prompt:** "Rewrite the following passage as a formal public essay paragraph of approximately [TARGET_WORDS] words. Maintain the original argument. Elevate the diction but avoid pomposity. Remove clichés and vague intensifiers. Preserve any specific examples or data. Output only the rewritten paragraph, followed by a one-sentence explanation of the main change you made."  
**Example Input:** "AI is basically changing everything for writers, which is kind of scary but also really cool."  
**Example Output:** "Artificial intelligence is reshaping the material conditions of writing — a transformation that promises genuine gains in velocity and reach while demanding a renewed vigilance about authorship, accuracy, and voice."  
**Notes:** Best used after a first draft exists. Do not use for dialogue, lyric prose, or deliberately plainspoken passages. Companion prompt: "Voice Mirror — Conversational."

Notice that the prompt is specific enough to be repeatable and general enough to be reusable. That balance is the design target.

## What a Library Cannot Do

A prompt library cannot replace taste. It cannot decide whether an idea is worth pursuing, whether a sentence is true, whether a structure is honest. It can only make your existing judgment more efficient and more consistent.

It also cannot save you from the hard work of writing. A perfect prompt will not produce a perfect essay. It will produce a better starting point, a clearer outline, a cleaner draft. The final decisions — what to keep, what to cut, what to rewrite entirely — remain yours.

This is why the library must stay subordinate to the writer. If you find yourself running prompts instead of writing, you have inverted the relationship. The tools should amplify your labor, not substitute for it.

## Your Assignment This Week

Create your first formal prompt library entry. Choose one recurring writing task — any task — and write a prompt for it using the five-part structure above. Then use it three times across the next week, noting what worked and what did not. After the third use, revise the prompt. You now have a craft asset.

If you already have a collection of scattered prompts, spend an hour sorting them into categories and discarding the ones you cannot remember using. A small, honest library is more valuable than a large, forgotten one.

## For Next Time

Friday's article — "[Workshop Capstone — Your Personal AI Writing Manifesto](/blog/workshop-capstone-your-personal-ai-writing-manifesto)" — closes Part I of the series and opens a door. We will synthesize everything from the past seven weeks into a short, personal document: your principles, your stack, your boundaries, your goals. Think of it as the writer's equivalent of a constitution — a statement of how you intend to work with AI, signed by you and addressed to your future self.

Your homework until then: draft one sentence that could serve as the first line of your manifesto. It should answer this question: *When I use AI as a writer, what am I unwilling to delegate?*

Carry that sentence with you. On Friday we build the rest.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 7, Article 2*
