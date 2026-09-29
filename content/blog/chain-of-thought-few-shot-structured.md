---
slug: "chain-of-thought-few-shot-structured"
title: "Chain-of-Thought, Few-Shot, and Structured Prompting"
excerpt: "Three techniques that transform prompting from guesswork into craft: making the model show its work, teaching it with examples, and constraining it to useful shapes."
date: "2026-06-12"
categories: ["AI Craft", "Writing"]
readTime: 11
image: "/images/blog/harrys-desk-chain-of-thought-few-shot-structured.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/chain-of-thought-few-shot-structured/"
---
In Monday's article — ["Prompt Engineering Is Not Coding — It's Composition"](/blog/prompt-engineering-is-composition) — I argued that the writer's advantage in the age of AI is not technical fluency but rhetorical judgment. The prompt is a brief, a commission, a letter to a brilliant collaborator. Its quality depends on the same compositional skills that make a good writer: framing, constraint, exemplar, and sequence.

Today I want to show you what those principles look like in practice. Not in the abstract. Not in theory. I want to walk you through three specific techniques — chain-of-thought, few-shot, and structured prompting — that operationalize the compositional mindset. These are not tricks. They are not hacks. They are the grammar of advanced collaboration with a language model, and they will change the quality of your output more than any single "magic prompt" ever could.

If you have been treating the model like a vending machine — insert prompt, receive paragraph — this article is your invitation to start treating it like a workshop. These techniques are your tools. Learn to use them well, and the work you produce will be sharper, more consistent, and more genuinely yours.

## Chain-of-Thought: Making the Model Show Its Work

The first technique is deceptively simple. You ask the model to think step by step before giving its final answer.

That is the whole idea. But its implications are profound.

In standard prompting, you submit a question and receive an answer. The model's reasoning — if there is any — is hidden inside the statistical machinery. You have no access to the path it took from prompt to completion, which means you have no way to verify whether the answer emerged from sound reasoning or from a lucky guess across the probability landscape. In ["Hallucination, Confabulation, and the Limits of Generation"](/blog/hallucination-confabulation-limits), I described how models can produce confident nonsense. Chain-of-thought prompting is one of the most effective antidotes.

Here is how it works. Instead of asking "What is the theme of this passage?" you ask: "Analyze this passage step by step. First, identify the key images and symbols. Then, trace how they recur and transform. Finally, state the theme that emerges from this pattern." The model is forced to generate intermediate reasoning before committing to a conclusion. And because language models generate text left to right — each token conditioned on all previous tokens — the reasoning it articulates shapes the conclusion that follows. A well-reasoned middle produces a well-reasoned end.

The pedagogical analogy is direct. When a professor asks a student to "show your work," she is not asking for bureaucracy. She is creating a checkpoint. The student who writes the correct answer by accident will flounder in the middle steps. The student who understands the material will produce a coherent chain. The same principle applies to the model. Its "showing of work" is not a window into a soul — there is no soul — but it is a window into the sequence of associations that led to the output. And that sequence can be evaluated, corrected, and redirected.

Chain-of-thought is especially powerful for tasks that require analysis, comparison, or synthesis. Ask a model to "summarize these three articles" and you may get a superficial collage. Ask it to "first summarize each article separately, then identify two points of agreement and two points of disagreement, then synthesize a conclusion that accounts for the disagreement" and you get something that resembles actual thought. The intermediate steps are not scaffolding to be discarded. They are load-bearing structures.

A word of caution. Chain-of-thought increases the length of the output, which consumes context window space. In ["Tokens, Context Windows, and the Geometry of Meaning"](/blog/tokens-context-windows-meaning), I explained how context windows function as working memory. A long chain-of-thought can crowd out the very material you are analyzing. Use it strategically, not reflexively. For simple tasks, it is overkill. For complex tasks, it is indispensable.

## Few-Shot Prompting: Teaching by Example

The second technique is older than the transformer architecture itself. It is the idea that the best instruction is often an example.

In few-shot prompting, you provide the model with one or more examples of the input-output pattern you want, then ask it to complete a new instance. The examples serve as a template, a genre marker, and a quality benchmark all at once. The model generalizes from the examples to the new case, and the quality of that generalization depends almost entirely on the quality of the examples you provide.

Here is a concrete writing application. Suppose you want the model to convert your rough plot summaries into polished scene openings. A zero-shot prompt — "turn this summary into a scene opening" — will produce generic prose. But a few-shot prompt gives the model three examples of your actual summaries paired with your actual scene openings, then presents a fourth summary and asks for the opening. The result will be dramatically closer to your voice, your rhythm, your level of detail. Not because the model has learned you in any deep sense, but because the examples narrow the probability space to a neighborhood that sounds like your work.

The craft lies in selecting and formatting the examples. Each example should be:

**Representative.** It should capture the kind of task you actually need, not an idealized version. If your scene openings vary widely in tone, include examples that show that range. Otherwise the model will homogenize.

**Consistently formatted.** The model detects patterns in structure as well as content. If Example 1 uses a dash to separate summary from output, and Example 2 uses a colon, the model may become confused. Consistency in formatting produces consistency in output.

**Appropriately difficult.** Do not use your best work as the only exemplar unless you want the model to aim for brilliance every time. If you need functional, workmanlike output, show functional, workmanlike examples. The model will match the bar you set.

I think of few-shot prompting as casting. When a director shows an actor clips of performances to establish the tone of a scene, she is not trying to make the actor imitate those clips exactly. She is calibrating. She is saying: this neighborhood of affect, this register of intensity, this pace of delivery. The actor generalizes. The model generalizes too. Its generalization is statistical, not intuitive, but the effect is remarkably similar.

The risk in few-shot prompting is the risk of all pedagogy: bad examples teach bad habits. If your exemplars contain clichés, the model will amplify them. If they contain factual errors, the model will replicate them. If they are structurally ambiguous, the model will invent its own structure — and you may not like what it invents. Curating your examples is as important as curating your prompts. Treat your example set as a portfolio. Edit it. Refine it. Update it as your needs evolve.

## Structured Prompting: Constraining the Shape

The third technique addresses a problem the first two do not solve: unpredictability of form.

Chain-of-thought and few-shot prompting improve the quality of what the model generates, but they do not guarantee the shape. A model asked to "analyze a character" might respond with a paragraph, a bullet list, a dialogue, or a table. Each of these might be excellent in isolation, but if you are building a workflow — populating a spreadsheet, feeding outputs into another tool, assembling a structured document — you need consistency. Structured prompting gives you that consistency by constraining the output format.

The simplest form of structured prompting is explicit formatting instruction: "Respond in three paragraphs." "Use bullet points." "Organize your response as a table with columns for Strength, Weakness, and Evidence." These instructions work because they activate patterns in the model's training data. It has seen millions of tables, lists, and structured documents. When you name a format, you are invoking that experience.

A more powerful form uses markup. You can ask the model to output JSON, XML, or Markdown with specific headers. For writers, XML-style tags are often more readable than JSON: `<analysis>`, `<strength>`, `<weakness>`, `<conclusion>`. The model understands these tags because it has seen them in training data — in HTML, in markup languages, in technical documentation. The tags create explicit slots that you can parse, validate, and transform.

Here is a practical writing workflow. You are drafting a novel and want the model to generate character notes for each new figure. Instead of asking for "a character description," you use a structured prompt:

```
For each character, provide:
<name>Character name</name>
<role>Protagonist, antagonist, supporting, or cameo</role>
<want>What the character wants, in one sentence</want>
<need>What the character actually needs, in one sentence</need>
<obstacle>The primary obstacle, in one sentence</obstacle>
<voice>Three adjectives describing speech pattern</voice>
```

The model will respond in that structure. You can then extract the fields programmatically, compare them across characters, identify gaps (everyone wants the same thing), and refine. The structure makes the output machine-readable without sacrificing literary nuance. The `<want>` and `<need>` fields still require the model to perform dramatic analysis. The constraint is formal, not substantive.

Structured prompting is particularly valuable when you are using the model as part of a pipeline. If you are generating metadata, summaries, or structured notes that will be fed into another system — a database, a CMS, a formatting script — you need predictability. Unstructured brilliance is a liability in a pipeline. Structured adequacy is an asset.

The trade-off is flexibility. A model constrained to JSON may refuse a task that does not fit the schema. A model asked for three paragraphs may struggle with a genuinely complex idea that needs five. Use structure when the shape matters more than the content's variability. Loosen the structure when you need room for surprise.

## The Composite Workflow

These three techniques are not mutually exclusive. In fact, their power multiplies when combined. A sophisticated prompt might include:

- **Few-shot examples** that establish the desired tone and level of detail
- **Chain-of-thought instruction** that requires the model to reason through its analysis before producing the final output
- **Structured format** that constrains the final output to a specific shape

Here is what that looks like in practice for a writing task: generating editorial feedback on a draft chapter.

**The few-shot component:** You provide two examples of past editorial comments you have written, showing the model the voice, specificity, and balance of praise and critique you prefer.

**The chain-of-thought component:** You instruct the model to "first identify the chapter's strongest paragraph and explain why it works. Then identify the weakest paragraph and explain what undermines it. Then suggest one structural change and one line-level change."

**The structured component:** You wrap the final output in tags: `<strength>`, `<weakness>`, `<structural_suggestion>`, `<line_suggestion>`, `<overall_assessment>`.

The result is feedback that sounds like you, demonstrates actual engagement with the text, and arrives in a format you can import into your revision notes. This is not automation replacing judgment. It is judgment, encoded in compositional choices, directing a capable tool toward a specific purpose.

This composite approach is what I mean when I say that prompting is composition. You are not writing a command. You are designing an experience for the model — a sequence of inputs that, taken together, narrow the possibility space to a neighborhood where useful text lives. The techniques are your palette. The art is in how you combine them.

## The Limits of Technique

I want to end this discussion with a warning, because every tool article risks becoming a catalog of tricks, and tricks without judgment are dangerous.

Chain-of-thought can make bad reasoning look rigorous. A model that generates a plausible-sounding step-by-step argument is not necessarily right. It is just articulate. The steps can be flawed, the premises false, the conclusions unwarranted. Chain-of-thought is a transparency technique, not a truth technique. It shows you the model's reasoning so you can evaluate it, not so you can trust it blindly.

Few-shot prompting can trap you in your own habits. If all your examples come from one phase of your career, the model will reinforce that phase. It will resist evolution. It will make your new work sound like your old work. The writer who uses few-shot prompting without self-awareness risks becoming a cover band for her earlier self.

Structured prompting can produce the illusion of rigor. A beautifully formatted JSON object containing fabricated citations is still a fabrication. Structure does not verify content. It only organizes it. The verification protocols I outlined in ["Hallucination, Confabulation, and the Limits of Generation"](/blog/hallucination-confabulation-limits) still apply, no matter how elegant the output's shape.

These techniques are amplifiers. They amplify your skill when you have it, and they amplify your carelessness when you do not. The question is never "what prompt should I use?" The question is "what am I trying to achieve, and does this compositional choice serve that aim?"

## For Next Time

On Friday — the final article of Week 3 — we turn from techniques to infrastructure. "Building Reusable Prompt Templates for Writers" will show you how to catalog, version, and refine your prompts over time, turning improvised experimentation into a sustainable practice. We will discuss prompt libraries, version control for prompts, and the difference between a template that saves time and a template that calcifies your thinking.

Your homework until then: take one prompt you have used recently — something you return to, like "summarize this article" or "improve this paragraph." Rewrite it using all three techniques we discussed today. Add a chain-of-thought step. Include one or two examples of the output quality you want. Constrain the format with explicit structure. Then test both versions — the original and the composite — on the same input. Notice the difference. That difference is your craft, improving.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 3, Article 2*
