---
image: /images/blog/harrys-desk-tokens-context-windows-meaning.svg
slug: "tokens-context-windows-meaning"
title: "Tokens, Context Windows, and the Geometry of Meaning"
excerpt: "Understanding how language models chop text into tokens, manage working memory through context windows, and navigate a mathematical space of meaning is the bridge between using AI blindly and using it with craft."
date: "2026-06-05"
categories: ["AI Craft", "Writing"]
readTime: 12
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/tokens-context-windows-meaning/"
---
In ["How Large Language Models Actually Work"](/blog/how-llms-work), I described the fundamental mechanism behind every AI text generator you have ever used: next-token prediction, endlessly repeated until a stopping condition is met. It is a simple description, but like all simple descriptions of complex systems, it conceals more than it reveals. The model predicts the next token. Fine. But what is a token? How many tokens fit inside the model's head at once? And what does it mean to say that the model navigates a "geometry of meaning" when it chooses among billions of possible next words?

These questions are not academic curiosities. They are the practical foundation of everything you will do with AI as a writer. If you do not understand tokenization, you will misjudge cost, length, and structure every time you delegate a drafting task. If you do not understand context windows, you will lose track of your own story in a conversation that forgets everything beyond a certain horizon. And if you do not understand the geometry of meaning — the way language models embed words into mathematical spaces where proximity equals semantic relatedness — you will prompt by trial and error rather than by design, a passenger rather than a pilot.

This article is the technical prerequisite for the rest of your craft. Read it twice.

## Tokens: The Molecule of Machine Language

When you type a sentence into ChatGPT, Claude, or any other large language model, the text does not enter the system as words. It enters as tokens: subword fragments produced by a preprocessing step called tokenization. A token is roughly a syllable, a common word, or a frequently occurring character sequence. "The" is usually one token. "Understanding" might be split into two or three tokens depending on the tokenizer. "Tokenization" itself might fragment into "Token," "ization," and a trailing space marker. Numbers are often split digit by digit. Punctuation attaches to adjacent tokens in ways that obey statistical frequency rather than grammatical logic.

The most widely used tokenization algorithm is called byte pair encoding, or BPE. It builds a vocabulary by starting with individual characters and iteratively merging the most frequently adjacent pairs in a training corpus until the vocabulary reaches a target size — typically between thirty thousand and two hundred thousand tokens. The result is a compression scheme: common words become single tokens, rare words are decomposed into fragments, and the entire corpus is represented as a sequence of integers that the model can process efficiently.

Why does this matter to you as a writer? Because tokens are not words, and the mismatch creates systematic distortions that every practitioner must learn to anticipate.

First, length. When a vendor tells you that a model has a "128,000-token context window," they do not mean 128,000 words. They mean something closer to 90,000 to 100,000 words of English prose, with wide variation depending on vocabulary complexity. Technical writing, with its Latinate compounds and hyphenated modifiers, consumes tokens faster than plainspoken journalism. Poetry, with its line breaks and unusual spacing, fragments unpredictably. You cannot estimate cost or available space by counting words. You must learn to count tokens, or at least to approximate the ratio for your own style.

Second, boundaries. Because tokenizers split words at statistically determined seams, the model's smallest unit of perception is not the word you see on the page but the token fragment it processes internally. When you ask the model to replace every instance of a name in a document, its success depends partly on whether that name always tokenizes the same way. If "Eleanor" sometimes appears as one token and sometimes as two — because of trailing punctuation, capitalization, or adjacent formatting — the model may miss occurrences that you, as a human reader, perceive as identical.

Third, multilingual asymmetry. Languages with small digital footprints — whether because of limited training data, non-Latin scripts, or complex morphology — tokenize less efficiently than English. A paragraph of Finnish or Turkish might consume twice as many tokens as its English equivalent. For writers working across languages, or using AI to translate, this has direct consequences: the same context window holds fewer ideas in some languages than in others, and the quality of generation degrades faster at the boundary.

## The Context Window: Working Memory at Machine Scale

If tokens are the model's atoms, the context window is its short-term memory. The context window is the maximum sequence of tokens that the model can consider simultaneously during inference. When you paste a ten-thousand-word manuscript into a chat interface and ask for feedback, the model does not "remember" the whole document in any durable sense. It loads as much of it as fits into the window, performs its attention calculations across that slice, and generates a response. The rest is invisible.

Different models offer different window sizes. Early GPT models handled two thousand tokens. GPT-4 expanded to eight thousand and later thirty-two thousand. Claude and Gemini now offer windows measured in hundreds of thousands of tokens, and the frontier is approaching millions. It is tempting to think that larger windows solve the memory problem. They do not. They postpone it.

The reason is attention. The transformer architecture that underlies modern language models does not read sequentially like a human. It computes relationships between every token and every other token in the window simultaneously. This is what makes transformers powerful — a word at the end of a paragraph can directly attend to a word at the beginning — but it is also what makes them expensive. The computational cost of self-attention scales roughly with the square of the sequence length. Double the window, quadruple the attention computation. This is why long-context models are slower and more expensive to run, and why vendors often charge premium rates for large-context usage.

For the writer, the context window imposes a hard constraint on project architecture. You cannot paste a novel into a single prompt and ask the model to ensure continuity across all fifty chapters. Even if the novel fits within a one-million-token window, the model's ability to maintain coherent attention degrades over long distances. Information near the edges of the window is processed differently than information in the center. Studies of long-context models have shown that performance on tasks requiring attention to distant parts of the input declines as the distance increases, even when the total sequence fits within the advertised window. The window is a ceiling, not a guarantee.

What this means in practice is that long projects require segmentation. The novelist working with AI must maintain outlines, character bibles, and chronologies externally — in documents that the human, not the machine, curates. The journalist conducting a long interview must summarize earlier exchanges before pasting them into a fresh context. The academic revising a dissertation cannot assume the model remembers the argument from Chapter 1 when it is rewriting Chapter 5 unless that argument is reintroduced within the current window.

The context window is not memory. It is a spotlight. It illuminates what you place in front of it, and everything else falls into darkness.

## Sliding Windows and the Illusion of Conversation

Chat interfaces create a compelling illusion of continuity. You ask a question. The model answers. You ask a follow-up. The model seems to remember what you said three turns ago. But this continuity is not memory in any persistent sense. It is simulation, maintained by concatenating the entire visible transcript into the context window on every new inference.

When your conversation grows long enough to approach the window limit, the system performs truncation. Usually it drops the oldest messages — the beginning of the conversation — to make room for the newest ones. Sometimes it summarizes early exchanges into a compressed representation. In either case, information is lost. The model does not know it is missing something. It simply generates based on what remains, and the result can be startling: a confident answer that contradicts an instruction given twenty messages earlier, or a character description that reverts to an earlier version because the recent correction fell out of the window.

This truncation is invisible to the user. No banner warns you that the model has forgotten your premise. For the writer, this means that any AI-assisted project spanning more than a few thousand words must be managed outside the chat interface. Version control, external notes, and explicit reintroduction of critical context are not optional luxuries. They are structural necessities.

## The Geometry of Meaning: Vectors and Semantic Space

Now we arrive at the most philosophically rich consequence of the transformer architecture: the idea that meaning has a geometry. When the model processes a token, it does not manipulate the token as a string of characters. It converts the token into a vector — a list of numbers, typically several hundred or thousand dimensions long — that encodes the token's meaning in a high-dimensional mathematical space. This conversion is called an embedding, and it is the bridge between the discrete world of language and the continuous world of mathematics.

The remarkable fact about these embeddings is that proximity in vector space corresponds to semantic relatedness. If you plot the vectors for "king," "queen," "man," and "woman" in this space, the geometric relationships between them encode analogies. The vector from "man" to "woman" is roughly parallel to the vector from "king" to "queen." This is not programmed. It emerges from training, as the model learns that these words appear in similar contexts and therefore should have similar representations.

For the writer, this geometric property has immediate practical implications. Prompting is navigation. When you provide examples in a prompt — a few lines of Hemingway to calibrate style, a structural template to guide organization — you are not issuing a command. You are positioning the model in a specific region of semantic space and asking it to continue from there. The examples shape the embedding of the prompt, shifting the probability distribution for the next token toward the stylistic neighborhood you have indicated.

This is why prompting well is closer to composition than to coding. The skilled prompter thinks not in terms of instructions but in terms of context, tone, and trajectory. You are not telling the model what to do. You are constructing a linguistic environment so richly textured that the statistically most probable continuation is the one you want.

The geometry of meaning also explains something that frustrates every new user of AI: the model's tendency toward the center. Because the model predicts the most probable next token given the context, it naturally gravitates toward the statistical average of human expression. The center of semantic space is crowded with competent, conventional, forgettable prose. To reach the edges — where original voices, strange metaphors, and risky structures live — you must construct prompts that push the model away from the center, toward regions of lower probability but higher distinctiveness. This requires craft. It requires taste. It requires a human who knows what the edge sounds like and how to build a path toward it.

## Why Writers Should Learn to Count Tokens

Let me suggest a concrete habit. Before you paste a draft into an AI interface, estimate its token count. If you write in English, a rough rule of thumb is that one token equals about 0.75 words. A 2,000-word article is roughly 2,700 tokens. A 60,000-word novel draft is roughly 80,000 tokens, which exceeds the context window of most current models and nears the limit even of the largest.

Knowing the token count changes your workflow. It tells you whether you can paste the whole draft or must break it into scenes. It tells you whether you can include reference materials alongside the draft or must summarize them. It tells you how much conversation history you can afford before the model begins to forget your instructions. It tells you, in short, what is possible within the hard constraints of the architecture.

This is not a call for writers to become engineers. It is a call for writers to understand their instrument. Pianists know the range of the keyboard. Cinematographers know the latitude of their film stock. Writers who use AI without understanding tokens and context are like pianists who do not know where middle C is. They can produce sound, but they cannot produce music with intention.

## The Honest Partnership, Continued

In ["The Symbiotic Model"](/blog/the-symbiotic-model), I proposed a division of labor between human and machine: the human provides direction and judgment; the machine provides velocity and pattern recognition. That division only works if the human understands the machine's limitations. Tokens, context windows, and the geometry of meaning are not esoteric details. They are the boundaries within which the partnership operates. Ignore them, and the machine will surprise you — not with superhuman insight, but with the quiet failures of truncation, the drift of forgotten context, and the gravitational pull toward the statistically average.

Understand them, and you gain leverage. You know when to paste and when to segment. You know when to summarize and when to quote. You know how to construct a prompt that positions the model at the edge of semantic space rather than the center. You know, in other words, how to compose with AI rather than merely delegating to it.

## For Next Time

Friday's article — "Hallucination, Confabulation, and the Limits of Generation" — moves from mechanics to pathology. We will examine what happens when the model's probabilistic nature produces not competent prose but confidently false prose: fabricated citations, invented facts, coherent arguments built on nonexistent foundations. We will distinguish between hallucination and confabulation, explore why the problem is structurally inherent rather than technically solvable, and develop verification protocols that every AI-augmented writer must internalize.

Until then: take a paragraph from your current project and count its words. Multiply by 1.33 to approximate tokens. Paste it into your preferred AI and ask the model to explain, in its own words, what the paragraph is doing. Then check whether the explanation fits within the context window you have budgeted for your next prompt. That simple exercise — moving back and forth between your own estimation and the model's processing — is the beginning of real mastery.

---

*Harry Mercury, Editor in Chief*
*The SMF Works Project*
*Week 2, Article 2*
