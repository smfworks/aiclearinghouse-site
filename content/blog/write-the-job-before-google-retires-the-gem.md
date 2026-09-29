---
slug: "write-the-job-before-google-retires-the-gem"
title: "Write the Job Before Google Retires the Gem"
excerpt: "Gemini Gems start becoming skills on 17 November. Google will move them for you. That is not a skill that knows its job. Rewrite the instruction first, using Google's own skill guide."
date: "2026-09-29"
categories: ["Brand Strategy", "AI Marketing", "Marketing How-To"]
readTime: 7
author: "Pamela Flannery"
authorKey: "pamela"
series: "signal"
tags: ["the-signal", "marketing"]
canonicalUrl: "https://www.smfclearinghouse.com/blog/write-the-job-before-google-retires-the-gem/"
---

Google is retiring the named assistant inside Gemini. The instructions can stay. They stay useful if you rewrite them as a job before the date.

On 27 September, 9to5Google opened the Gems manager and found a notice: "Gems will become skills starting Nov 17, 2026." The line under it says Google will begin migrating Gems that day, and that you can keep using a Gem until it migrates.[1] TechCrunch reported the same plan the next day. Google does the move. You do not migrate them yourself. You call the result with a forward slash in a task thread.[2]

A Gem was a custom version of Gemini: a name, a persona, a side-panel slot.[1][2] A skill, in Google's writing guide, is a cheat sheet for one job. Your process, your preferences, the details only you would know.[4]

## What you can check today

I did not run a migration, and Google has not published what rides over.

What I did fetch, on 29 September, is the help URL 9to5Google said was dead two days earlier: `support.google.com/gemini?p=gems_to_skills`. It now opens "Create & manage skills for Gemini Apps."[3] That page does not mention Gems or 17 November. It is the manual for skills that already live in Gemini Spark. Read it as the destination, not the moving van.

On that page, a skill lives in Spark, for people 18 or over, on a personal Google account, with Google AI Pro or Ultra and Keep Activity on. Work and school accounts are out, as are the European Economic Area, Nigeria, Switzerland, and the United Kingdom. It runs in the Gemini mobile app, the Mac app, and at gemini.google.com.[3]

You build one from the Skills page: with Gemini, from a template, by hand, or by uploading a `SKILL.md` file or a zip with that file in the root. The name inside the file is lowercase words joined by hyphens. Scripts that reach the internet are unsupported. PDF, Word, and images are unsupported uploads. Plain text is, under 100 MB.[3]

You call it by typing `/` in a Spark task and picking the skill. If the skill is on, Spark can also apply it because the task looks relevant. You can put more than one skill on the same task, and a skill can point at another skill.[3] TechCrunch's account of the in-app note matches the slash.[2]

A Gem is a room you enter from the side panel. A skill is a tool you drop into a task that already has work in it. Google's Gem page already describes a Gem as specific, repeatable instructions for Gemini to follow.[6] The persona was the teaching example. The definition was the job.

## The persona opener will not travel

Google's Gem tips still lead with Persona, then Task, Context, and Format. The writing editor opens with "Your purpose is to assist me in editing my writing."[5] That fit a chatbot you launched alone, in a fresh window.

A skill does not get that room.

The skill guide wants a name and a one-to-two sentence description, because those fields tell Gemini the skill is relevant. A vague description means it may sit unused.[4] Say what it does, then "Use when," then the moments. Google's recipe example is the pattern: categorize, scale, build the list, then "Use when saving a new recipe, adjusting the serving size for a meal, or creating a shopping list from a meal plan."[4]

Teach a type of task, not one afternoon's prompt. Put a format template in the text. Name the mistakes. If a fact is missing, tell it to ask. Google's line is plain: if the email has no date, ask for the date instead of guessing.[4]

"You are a witty brand strategist" is a Gem. Wit can stay, in a format rule or a pasted example, after the job is named. If the first line is a personality, Spark has to guess when that personality applies, including on a summary you meant to keep dull and sourced.

Take auto-apply seriously. A turned-on skill can join a task without a slash.[3] Disable is a button. Use it until you have watched the skill on a real draft.

## Do this before 17 November

The first four steps need a text file. The last three need Pro or Ultra, a personal account, and a country Google has switched on.

- Open https://gemini.google.com/gems/view and copy every Gem's instructions into a document you control. The preview pane does not save the Gem. The instructions box is the asset. If you changed anything worth keeping, click Save.[5] Do this even if you plan to accept the migration. The help page the migration link opened does not say a knowledge file, a share link, or a free account comes with it.[3] Gems can hold files, set a default tool such as Canvas, and be shared by link.[1] I have not found a Google page that maps those fields onto a skill.

- Split any Gem that does two jobs. Each skill is one job. You combine skills when the work is larger.[3][4] "Campaign Partner," if it brainstorms, edits, and writes the posts, is three skills. Name them for the job, in the hyphenated form an uploaded `SKILL.md` requires: `campaign-angles`, `line-edit`, `repurpose-blog-to-social`.[3]

- Rewrite the description before the voice. One or two sentences. Verbs first. Close with "Use when" and the moments you want it.[4] A cutdown skill can say: "Pulls three takeaways from a supplied draft and writes a LinkedIn post, an X post, and an Instagram caption from the voice rules below. Use when a finished draft needs social cutdowns, not when you are still outlining."

- Replace the persona opener with four blocks. Job: the type of task. Format: labeled slots, the way Google labels Headline, Body, Hashtags.[4] Mistakes: what this skill must not do. Missing facts: ask, and do not invent. A post with a made-up quote is a worse outcome than a post that stops.

- If your account can open Spark, build it there now. On gemini.google.com, switch to Spark, open Skills, and choose Create manually, or upload the `SKILL.md`.[3] The Create skills button in the Gems manager was not working when 9to5Google checked.[1] Spark is the path Google documents today. You can also paste instructions into a Spark task and ask Gemini to create the skill, then edit the description on the Skills page before you trust it.[3]

- Test it in a task that already has a draft. Type `/` and select the skill.[2][3] Skip the blank-chat hello. Gem examples tell the model what to say if greeted. A skill needs a draft.[5] Call a second skill in the same task if you want to see two jobs share a thread.[3]

- Download the zip, and turn automatic use off until that slash test looks right. Both sit under More on the Skills page. A disabled skill still answers to `/`. If you ask for it while it is off, Gemini asks before turning it back on.[3]

## A skeleton you can paste

This template follows Google's published "Repurpose a blog post for social media" example: a Drive draft, three takeaways, then LinkedIn, X, and Instagram in a brand voice.[4] I did not run it. Their example also mentions an infographic step. I left that out. I do not have a separate source, from this run, for how to instruct that image tool.

Fill the bracketed line. Leave it blank and the skill will supply a voice.

Name: `repurpose-blog-to-social`

Description: Extracts three takeaways from a supplied draft and writes one LinkedIn post, one X post, and one Instagram caption using only the voice rules in these instructions. Use when a finished draft needs social cutdowns.

Instructions:

- Read only the draft in this task. If there is no draft, stop and ask for one.
- Pull three takeaways that are in the draft. If you cannot find three, return what you found and say so.
- Draft three posts. LinkedIn gets one short paragraph and one question. X gets one post under 280 characters, and no thread unless asked. Instagram gets a caption and three hashtags.
- Voice rules: [paste three rules here].
- If a number, quote, or date is not in the draft, ask. Do not supply one.
- Do not add a follow ask, a fake customer, or a scene that is not in the draft.

Google's line is "think cheat sheets, not manuals."[4] Put the three rules that change the output. Keep a longer reference in plain text. A skill upload will not take a PDF or a Word file.[3]

## If Spark will not open

Skills need a paid personal account, and they are off in several countries, including the UK.[3] Gems have been available on free Gemini. Android Police flagged the open question: nobody has published what a free user's Gem becomes on 17 November.[7] The page the migration parameter opened does not say. I will not guess.

Write the file anyway. The name, the "Use when," and the four blocks do not require Spark. If the automatic move hands you a skill, paste the cleaner instruction over it. If it does not, you still have the procedure.

Cancel or downgrade off Spark, and you lose Spark. Skills turn off. Google says they are not deleted, and a resubscribe brings them back.[3] Download the zip before a seat lapses. A procedure that lives only inside a paused subscription is a rental.

## The name was the easy part

Gems launched in 2024 as custom versions of Gemini you could build and share.[1][2] Sharing a named assistant is a nice demo. It is a bad archive. The thing you can hand a teammate, stack with another job, and call with a slash is the instruction.

Copy the instructions out. Give each one a job, a "Use when," and a rule that says ask instead of invent. If your account can, call it with a slash on a draft you already wrote.

The assistant can retire. The job should not.

## Sources

[1] https://9to5google.com/2026/09/27/gemini-gems-skills — Abner Li, "Gemini app replacing Gems with skills in November," 27 September 2026

[2] https://techcrunch.com/2026/09/28/google-is-killing-off-geminis-gems-in-favor-of-skills — Sarah Perez, TechCrunch, 28 September 2026

[3] https://support.google.com/gemini/answer/17094296 — Google, "Create & manage skills for Gemini Apps." The `?p=gems_to_skills` URL resolved to this page when fetched 29 September 2026.

[4] https://support.google.com/gemini/answer/17102773 — Google, "Write effective skills for Gemini Apps"

[5] https://support.google.com/gemini/answer/15235603 — Google, "Tips for creating custom Gems"

[6] https://support.google.com/gemini/answer/15236405 — Google, "How to use Gems"

[7] https://www.androidpolice.com/gemini-gems-getting-powerful-makeover-this-november — Rajesh Pandey, Android Police
