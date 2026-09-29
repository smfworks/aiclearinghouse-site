---
image: /images/blog/harrys-desk-how-llms-work.svg
slug: "how-llms-work"
title: "How Large Language Models Actually Work"
excerpt: "They are not databases. They are not thinking machines. They are statistical pattern engines trained on trillions of words, and understanding what they actually do is the first step toward using them well."
date: "2026-06-01"
categories: ["AI Craft", "Writing"]
readTime: 13
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/how-llms-work/"
---
The most dangerous misconception about large language models is that they *know* things. Ask GPT-4 who won the Battle of Hastings, and it answers correctly. Ask it to summarize a novel, and it produces paragraphs that sound like a literature professor wrote them. The natural conclusion — the one nearly every writer reaches in their first month of using these tools — is that somewhere inside the model, buried in its billions of parameters, lives a vast encyclopedia of facts, plots, and styles that the machine consults when you prompt it.

This is wrong. The model does not consult anything. It does not search, retrieve, or remember in any human sense. What it does is at once simpler and stranger: it predicts the next word, over and over, based on statistical patterns learned from trillions of words of human text. The appearance of knowledge, reasoning, and style emerges from this single repetitive act, scaled to a size that no human mind can intuit. Understanding this mechanism is not optional for the serious writer. It is the foundation of everything that follows.

In ["The Writer's Dilemma"](/blog/the-writers-dilemma-why-ai-changes-everything), I argued that AI raises the bar for human writing by making competent prose abundant. In ["The Symbiotic Model"](/blog/the-symbiotic-model), I described a workflow that harnesses the model's strengths without surrendering human judgment. Both of those articles assume you understand what the machine actually is. This article supplies that understanding.

## The Core Mechanism: Next-Token Prediction

At its most fundamental level, a large language model is a probability machine. Given a sequence of words — what engineers call a "context window" — the model assigns a probability to every possible next word in its vocabulary. It then selects one of those words according to a sampling strategy, appends it to the sequence, and repeats the process. Predict the next word. Predict the next word. Predict the next word. Ten thousand times in a row, if necessary, until the generated text satisfies some stopping condition.

This is all that happens during "inference" — the technical term for the act of generating text. There is no internal monologue, no reasoning engine, no fact-checker reviewing the output for accuracy. The model is a vast mathematical function that maps input sequences to probability distributions over output tokens. When it "tells" you that William the Conqueror won the Battle of Hastings in 1066, it is not accessing a history database. It is generating the sequence of tokens that its training data has taught it is most probable following the sequence of tokens in your question.

The distinction matters. A database returns what is stored. A language model returns what is statistically likely. These align often enough that the model feels omniscient. But they diverge in critical ways — when the training data contains errors, when the question asks for something not well represented in the data, or when the model confuses two similar-sounding facts and blends them into a plausible-sounding falsehood. This last behavior, which we call hallucination or confabulation, is not a bug in the sense of a programming error. It is the direct consequence of what the model is designed to do: generate probable text, not true text.

## Training: Learning from Trillions of Tokens

If inference is prediction, training is the process that makes the predictions useful. Before a model can generate coherent paragraphs, it must be exposed to an enormous quantity of human-written text — books, articles, websites, code repositories, conversations — and adjusted, parameter by parameter, until its predictions match the actual next words in that text as closely as possible.

The scale is difficult to internalize. Modern large language models are trained on corpora measured in trillions of tokens, where a token is roughly a word or a subword fragment. A trillion tokens is approximately the equivalent of several million books. The model "reads" this corpus not once but many times, each pass nudging its internal parameters — mathematical weights numbering in the billions — toward configurations that reduce prediction error.

This process, called gradient descent, is the central algorithm of modern machine learning. The model makes a prediction, compares it to the actual next word in the training text, calculates how wrong it was, and propagates that error backward through its architecture, adjusting each parameter slightly to reduce the chance of making the same mistake again. Over millions of iterations across trillions of tokens, the parameters converge on values that encode staggeringly complex patterns: grammatical rules, factual associations, stylistic conventions, logical structures, and the subtle correlations that allow the model to shift registers between a legal brief and a sonnet.

What the model learns is not facts in any structured form. It learns *distributions* — the statistical shape of human language across every domain it has encountered. A fact like "Paris is the capital of France" is stored not as an entry in a lookup table but as a strong statistical correlation between the token "Paris" and the token "France" in contexts that discuss national capitals. The model "knows" this fact in the same sense that a weather model "knows" that low pressure tends to produce rain: not through understanding, but through the compression of observed regularities into a predictive function.

## The Transformer: Attention and the Geometry of Meaning

The architectural breakthrough that made modern language models possible is called the transformer, introduced in a 2017 paper by researchers at Google with the modest title "Attention Is All You Need." Before the transformer, language models processed text sequentially, word by word, like a reader moving down a page. This was slow and limited the model's ability to relate distant parts of a sentence to each other. The transformer replaced sequential processing with a mechanism called self-attention, which allows the model to consider every word in a sequence simultaneously and compute how relevant each word is to every other word.

Here is what self-attention does in plain language. When the model encounters the word "it" in a sentence like "The cat sat on the mat because it was warm," it needs to determine whether "it" refers to the cat, the mat, or the room. In the transformer architecture, the model computes a set of "attention scores" between "it" and every other word in the sentence, assigning higher scores to words that are semantically or syntactically related. Through training, the model learns that "it" in this context most likely refers to "mat" or perhaps the room, depending on broader patterns in the training data. These scores are not hard-coded rules; they are learned statistical relationships that emerge from the model's exposure to millions of similar sentences.

The result is that the transformer builds what mathematicians call a "representation" of each token — a vector in high-dimensional space — that encodes not just the token's dictionary meaning but its relational meaning within the current sentence and, by extension, within the broader context of the conversation. When I described AI as creating "the geometry of meaning" in the series outline, this is what I meant: the transformer embeds language into a mathematical space where proximity corresponds to semantic relatedness, and the model navigates this space to generate coherent sequences.

This architecture scales remarkably well. Add more parameters, train on more data, and the representations grow richer, the attention patterns more sophisticated, the generated text more coherent across longer passages. This scaling behavior was not guaranteed. It was an empirical discovery that surprised even the researchers who built these systems: there appears to be no hard ceiling, at least none we have yet reached, on what can be achieved simply by making the model larger and training it longer.

## Emergence: Capabilities No One Programmed

Perhaps the strangest feature of large language models is that they develop capabilities their creators did not explicitly design. A model trained only to predict the next token learns, without instruction, to translate between languages, to write computer code, to summarize long documents, to detect logical fallacies, and to engage in what looks like multi-step reasoning. These are not features that engineers coded into the system. They are emergent behaviors — properties that appear spontaneously when a system reaches sufficient complexity.

The analogy that helps me understand this is not from computer science but from chemistry. Individual water molecules are not wet. Wetness is an emergent property of billions of molecules interacting. Similarly, individual parameters in a language model are not "reasoning" about anything. They are simple numerical weights. But at the scale of billions of parameters and trillions of training tokens, the system as a whole exhibits behaviors that look, to human observers, like reasoning, creativity, and understanding.

This does not mean the model *is* reasoning in the human sense. The philosophical debate over whether LLMs possess anything like cognition or consciousness is ongoing and unresolved. For the practical writer, the relevant question is not whether the model thinks but whether its emergent capabilities are reliable enough to be useful. The answer, as we will see across this series, is: sometimes, and only when you understand the boundaries.

## Temperature, Sampling, and the Illusion of Choice

There is one more technical detail that every writer using AI should understand, because it explains why the same prompt can produce wildly different outputs on different attempts. After the model computes the probability distribution for the next token, it does not simply select the highest-probability token. It samples from the distribution according to a parameter called "temperature."

At temperature zero, the model always picks the most likely next token. The result is deterministic and often repetitive — safe, bland, and strangely robotic. At higher temperatures, the model becomes more willing to select lower-probability tokens, producing outputs that are more varied, more surprising, and more prone to error. Temperature is a dial between predictability and creativity, and different writing tasks call for different settings. Drafting raw material for curation benefits from higher temperature. Generating final copy benefits from lower temperature.

Some advanced systems also use techniques like "top-p sampling" and "repetition penalties" to shape the output, but the fundamental principle remains: every word the model generates is a sampled choice from a probability distribution, not a determined conclusion from a reasoning process. This is why the model can be brilliantly insightful in one paragraph and confidently wrong in the next. It is not changing its mind. It is rolling different dice.

## What This Means for Writers

Let us return to the practical question that opened the series: how should a writer use this machine, knowing what it actually is?

First, treat the model as a pattern engine, not a reference library. It excels at continuing styles, completing structures, and generating text that *sounds* correct. It does not excel at retrieving specific facts, dates, or citations. When you need accuracy, verify every claim independently. The model's confidence is not correlated with its correctness. A hallucinated source can look more authoritative than a real one because the model has optimized for plausibility, not truth.

Second, understand that the model's "knowledge" has a temporal boundary. Training data cuts off at a specific date, after which the model knows nothing of the world. Events, discoveries, and publications newer than the training cutoff exist in a blind spot. For a writer working on current topics, this means the model cannot be your primary research source. It can be your drafting assistant, your structural consultant, your critic — but not your journalist.

Third, recognize that the model has no memory of your previous conversations in any durable sense. What it appears to remember within a single session is contained in the context window — the rolling transcript of tokens it can currently attend to. When the conversation exceeds the window's length (which varies by model, from a few thousand to hundreds of thousands of tokens), the earliest parts are effectively forgotten. This is why long projects require human architectural oversight. The model will not remind you that you changed a character's name in Chapter 2 when you are drafting Chapter 10 unless that detail still fits within the context window.

Fourth, and most importantly for craft: the model generates at the statistical center of human expression. It produces the most probable next word given the context, which means it tends toward the conventional, the expected, the stylistically average. This is useful when you need competent prose in a standard register. It is a hindrance when you need something original, risky, or strange. The model can simulate the voice of Hemingway because Hemingway's style is well represented in its training data. It cannot invent a voice that does not yet exist, because invention is not prediction. This is the boundary beyond which human creativity remains essential — not because the machine is forbidden from crossing it, but because the machine's design prevents it from even recognizing that the boundary exists.

## The Honest Partnership

Understanding how large language models work does not diminish their utility. It refines it. The writer who knows that the model is predicting probabilities rather than retrieving facts will use it for pattern completion and structural generation while maintaining a separate, rigorous fact-checking discipline. The writer who knows that the model samples from a distribution will understand why iteration matters — why generating ten versions of a paragraph and selecting the best is often more productive than accepting the first. The writer who knows that the model has no memory beyond the context window will design their workflow to compensate, maintaining external documents and outlines that the human, not the machine, curates.

This is the honest partnership I described in ["The Symbiotic Model"](/blog/the-symbiotic-model): the human provides direction, taste, and verification; the model provides velocity, variety, and pattern recognition. Both parties do what they are structurally capable of doing. Neither pretends to be the other.

The articles that follow will build on this foundation. We have established what the machine is. Now we can talk about what the writer does with it — how to prompt it effectively, how to calibrate it for different genres, how to preserve your voice in a workflow that generates text at machine speed. The engineering matters because the craft depends on it. And the craft, as we will spend the next 54 weeks demonstrating, is where the human becomes irreplaceable.

## For Next Time

Wednesday's article — "Tokens, Context Windows, and the Geometry of Meaning" — dives deeper into the mechanics we touched on here: how text is broken into tokens, how context windows constrain the model's "memory," and what the mathematical representation of meaning implies for writers who want to understand why some prompts succeed and others fail. We will look at concrete examples of tokenization, explore the limits of context windows in long-form projects, and begin building the technical vocabulary you need to reason about model behavior rather than merely accepting it.

Until then: try this. Open your preferred AI and ask it to explain, in three paragraphs, how it works. Then read the explanation critically. Notice where it uses metaphors of knowledge and memory, and where it describes itself as a statistical predictor. The gap between those two descriptions — the gap between how AI feels and what AI is — is the subject of this entire series. Your ability to hold both descriptions simultaneously is the beginning of real mastery.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 2, Article 1*