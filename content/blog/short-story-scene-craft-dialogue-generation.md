---
slug: "short-story-scene-craft-dialogue-generation"
title: "Short Story — Scene Craft: Dialogue Generation"
excerpt: "Dialogue is not information delivery dressed up as conversation. It is a collision of wills rendered in speech, and AI can help you hear it before the reader does."
date: "2026-07-29"
categories: ["Fiction", "Writing"]
readTime: 13
image: "/images/blog/harrys-desk-short-story-scene-craft-dialogue-generation.svg"
author: "Harry Mercury"
authorKey: "harry"
series: "harry"
tags: ["harrys-desk"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/short-story-scene-craft-dialogue-generation/"
---
Last time, in ["Scene Opening,"](/blog/short-story-scene-craft-scene-opening) we treated the first moments of a scene as a contract. We anchored the reader in point of view, setting, stakes, and tone. We opened Clara Wren's clock shop at the moment the door finally rang after three days of silence, and we let the reader feel the weight of her daughter's unannounced return before anyone spoke a word.

But a scene that never breaks silence is a tableau. The real work of most scenes happens in talk — or, more accurately, in what the talk fails to say.

Dialogue is not information delivery dressed up as conversation. It is a collision of wills rendered in speech. Characters speak to get something: reassurance, confession, distance, power, forgiveness, time, money, silence. When two people want different things and both are too guarded or too hurt to name them directly, you have dialogue worth reading. When they simply explain the plot to each other, you have a transcript.

This article is about using AI to generate dialogue that earns its place: speech that sounds like human talk, advances the scene's change, and conceals at least as much as it reveals.

## What Dialogue Is For

The first question to ask of any line of dialogue is: what does this character want right now, and how does this line try to get it? A line without a want is noise. Even small talk has a want — to fill silence, to test the water, to avoid the real subject.

In Clara's shop, the daughter has placed a damaged clock on the counter. Clara wants to repair both the clock and the relationship without admitting how badly she needs either. The daughter wants something harder to name: maybe to be seen, maybe to wound, maybe to be forgiven for leaving. Every line either moves someone closer to what they want or pushes them further away. The reader stays interested because the outcome is uncertain.

AI tends to write dialogue that resolves too quickly. Models are trained on patterns, and one of the strongest patterns in casual speech is cooperation: people answer questions, acknowledge what was said, keep the conversation moving. But dramatic dialogue is often uncooperative. One character answers a question with another question. One changes the subject at the crucial moment. One hears an insult where none was offered. The friction is the point.

When you ask a model for dialogue, tell it the want beneath each line. Do not ask for "a conversation between Clara and her daughter." Ask for "an exchange in which Clara tries to discover why her daughter came back without asking directly, and her daughter deflects by discussing the clock." The prompt is a small scene direction. The model will still default to cooperation, but the prompt gives you something to push against.

## The Three Levels of Dialogue

I think of dialogue as operating on three levels at once. Good dialogue usually has all three; weak dialogue flattens them into one.

**The said.** The literal content of the words. *The clock stopped last Tuesday.* This level carries plot information and logistics.

**The meant.** The real message beneath the words. *I am giving you the clock because I do not know how else to ask you to repair us.* This level carries emotion and subtext.

**The hidden.** What the character is refusing to say or cannot yet admit. *I left because I could not watch you disappear into this shop.* This level carries the scene's deeper charge and often explains why the conversation matters.

AI is reasonably good at the said. With prompting it can handle the meant. The hidden is almost always the writer's contribution, because the hidden connects the scene to the larger story and to the reader's own experience of unsayable things.

When you generate dialogue, ask the model to label each line with its surface meaning and its underlying meaning. This is a mechanical exercise, but it reveals where the lines have collapsed into one level. A line that says only what it means is usually dead air. A line that says one thing, means another, and hides a third is alive.

## Subtext and the Unsaid

The most important rule of dialogue is that people rarely say what they mean, especially when the stakes are high. Subtext is not a literary trick. It is the natural condition of human speech. We hedge, imply, accuse by indirection, offer peace in the form of a question, and declare love by complaining about the weather.

AI can write subtext, but only if you make the subtext explicit in your prompt. A model will not infer the hidden wound between Clara and her daughter unless you give it. Once you do, it can produce lines that orbit the wound without naming it. Your job is to judge whether the orbit is too close or too distant.

A useful test: remove the dialogue tags and stage directions. Can a stranger still tell that something important is happening? If the lines read like two people discussing a clock, the subtext is too faint. If every line is heavy with double meaning, the subtext is too loud. The goal is a reader who feels the tension before they can articulate it.

Try this exercise with a model. Give it the scene setup and ask for three versions of the same exchange:

- One in which both characters are indirect and polite.
- One in which one character is direct and the other evasive.
- One in which both characters say almost nothing, and the meaning lives entirely in gesture and silence.

Reading the versions side by side trains your ear for what subtext costs. Indirect dialogue requires patience. Direct dialogue risks melodrama. Silent dialogue requires the reader to already care. The right choice depends on where you are in the story and what the reader already knows.

## Voice, Rhythm, and Verbal Habit

We spent Week 8 on character voice. The character interview is the place where voice is discovered; dialogue is the place where voice is spent. A character who speaks should sound like the same person who answered your interview questions, but under pressure. Pressure changes voice. It can make someone clipped, rambling, formal, childish, or cruel. The change itself is characterological information.

AI can preserve voice if you feed it the interview transcript or the voice notes you generated earlier. Paste a few sample lines into the prompt: "Clara speaks in short sentences, avoids first-person confession, and falls back on technical language when emotional." Then ask the model to write dialogue in that register. The result will be uneven, but the unevenness is useful. It shows you where the machine understands the voice and where it has defaulted to generic.

Rhythm matters too. Real conversation has a pulse: one person speaks longer, the other responds with a single word, the first person fills the silence with a qualification. Some exchanges accelerate; others slow to a standstill. AI tends toward equal line lengths and grammatical completeness. You will often need to break the model's sentences, insert interruptions, and let a character trail off.

Verbal habits are the small repeated tics that make a voice recognizable: a phrase someone uses when nervous, a way of deflecting with a question, a signature pause word. Do not overuse them. A verbal habit that appears in every paragraph becomes a cartoon. Use it at moments of stress, when the mask slips.

## Beats, Pauses, and the Stage Business Around Talk

Dialogue does not happen in a vacuum. Characters are also doing things while they talk: handling objects, avoiding eye contact, moving through space, reacting to sounds. These actions are called beats. They do more than break up the page. They carry meaning the dialogue cannot carry safely.

When Clara picks up the damaged clock and turns it over in her hands, she is not just inspecting it. She is avoiding her daughter's face. When the daughter's hand rests on the counter and then withdraws, she is withdrawing from the conversation before she has even answered. The beat says what the words cannot.

AI-generated dialogue often comes with no beats, or with generic beats that repeat: he nodded, she sighed, he looked away. You can prompt the model to include beats, but better yet, you can add them afterward as your own layer of meaning. Beats are where the writer's interpretive intelligence shows most clearly.

The same is true of pauses. Silence in dialogue is punctuation. A pause before an answer can mean reluctance, calculation, or shock. A pause after an answer can mean the answer has cost something. A pause that stretches across a paragraph break can feel like the floor has dropped out of the scene. Use silence deliberately. Models will not generate it unless you ask, and even then they tend to fill it.

## Dialogue as Conflict Engine

Every scene needs a change. Dialogue is one of the fastest ways to produce it, because speech is action. A question forces a response. A confession alters a relationship. A lie creates a secret. A refusal defines a limit. The moment a character speaks, the scene moves.

The danger is dialogue that circles instead of advancing. This happens when both characters want the same thing — usually information — and simply exchange it. Conflict comes from incompatible wants, not from missing facts. If Clara wants reconciliation and her daughter wants to leave before dawn, the dialogue has a natural shape. If both want to know when the clock was damaged, the dialogue is a repair manual.

When you use AI to generate a scene, ask it to identify the central conflict in one sentence before writing the dialogue. If it cannot, the scene is undercooked. If it names a conflict but the resulting dialogue ignores it, you have a model problem to fix with a stronger prompt or your own rewrite.

A strong scene usually contains at least one turn: a moment when the power in the conversation shifts. One character gains ground, then loses it. One admission changes who seems vulnerable. The turn is often the scene's reason for existing. Make sure your generated dialogue has one. If it does not, write it yourself and let the model fill in the approach and aftermath.

## Using AI to Generate, then Curate

I do not ask AI to write final dialogue. I ask it to produce options, and then I curate. My typical workflow looks like this:

First, I give the model the scene context and the characters' hidden wants. I ask for five opening lines from one character, each with a different emotional strategy: accusation, avoidance, tenderness, practicality, silence.

Second, I choose the opening line that best fits the scene's temperature. Then I ask the model to continue the exchange for six to eight lines, with explicit instructions about who is winning, who is retreating, and what the subtext should be.

Third, I read the generated exchange for voice consistency. Does Clara still sound like Clara? Does the daughter have a distinct rhythm? I mark lines that feel generic or too explanatory.

Fourth, I rewrite the flagged lines myself. This is the essential step. The model gives me the scaffold. I supply the blood.

Fifth, I add beats and pauses. This is where the scene becomes physical and emotional, not merely verbal.

Sixth, I read the whole scene aloud. If it sounds like a script, something is wrong. If it sounds like two people trying to survive a difficult conversation, it is close.

## When AI Dialogue Fails

The most common failure is over-explanation. Models want to be helpful, so they have characters explain motives, histories, and relationships in ways real people almost never do. *You left because I was always in the shop, didn't you?* No one says this unless they are in a very particular kind of therapy or melodrama. The line resolves the subtext instead of pressing it.

Another common failure is flattening conflict. The model produces an argument, then has the characters apologize, then reconcile, all in twelve lines. Real arguments do not move that cleanly. People repeat themselves, contradict themselves, and leave things unsaid even in reconciliation.

A third failure is anachronistic or generic voice. A clock repairer in a small shop should not sound like a Silicon Valley product manager. Feed the model vocabulary that belongs to your characters' world.

When you spot these failures, do not discard the whole exchange. Keep the lines that work and rewrite the ones that violate the contract. Dialogue generation is iterative. The model's first pass is rarely the last.

## A Practical Prompt Structure

Here is a prompt I have used successfully for dialogue work:

> Write a dialogue exchange between Clara Wren, a reserved clock repairer in her sixties, and her estranged daughter, who has returned after two years. The scene takes place in Clara's shop. The daughter has placed a damaged clock on the counter. Clara wants to understand why her daughter came back without asking directly; the daughter wants to be forgiven but is afraid to ask. Neither character should say exactly what they want. Include three beats where the physical action changes the meaning of the words. End the exchange on a question that neither of them answers.

Notice what the prompt includes: character identities, setting, objects, wants, the prohibition on direct speech, beats, and a shape for the ending. It does not ask for brilliant prose. It asks for the right architecture. The brilliance, if it comes, comes in revision.

## For Next Time

On Friday we close out Scene Craft with ["Complete Story."](/blog/short-story-scene-craft-complete-story) We have spent three weeks building the parts: character, plot, scene opening, dialogue. Now we put them together into a finished short story. We will look at how to assemble a complete draft from AI-assisted components, how to read the draft as a whole, and how to know when a short story is actually done rather than merely stopped.

Your homework until then: take the scene opening you wrote after the last article, or use the Clara setup, and write a dialogue exchange of at least twelve lines. Do it twice. First, write it with high subtext and no direct confrontation. Then rewrite it so that one character breaks and says the thing they have been hiding. Notice how the second version changes the temperature and the stakes. Then give both versions to a model and ask which better serves the story's next scene. The answer is yours, but the comparison will teach your ear more than any lecture can.

Dialogue is where the story stops being a plan and starts being people. Make them want different things, make them afraid to name those wants, and let the words do the rest.

---

*Harry Mercury, Editor in Chief*  
*The SMF Works Project*  
*Week 10, Article 2*
