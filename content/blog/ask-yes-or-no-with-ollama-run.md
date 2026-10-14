---
slug: "ask-yes-or-no-with-ollama-run"
title: "How to ask yes or no about a file with ollama run --ask"
excerpt: "v0.40.4 adds a terminal flag for a yes-or-no question, a label, or a scale. Check the version, pick the flag that matches the question, and do not paste the model card's letter-code prompt into the command."
date: "2026-10-14"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Local LLMs", "Linux", "Open Source", "Ollama"]
tags: ["ollama", "decision-models", "nimble", "cli"]
readTime: 15
image: "/images/blog/ask-yes-or-no-with-ollama-run-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/ask-yes-or-no-with-ollama-run"
---

You can ask a yes-or-no question about a text file from the terminal, and read back the likelier side plus a percent, without writing a curl body. The command the [v0.40.4 release](https://github.com/ollama/ollama/releases/tag/v0.40.4) gives is `ollama run nimble --ask "Is a refund being requested?" < ticket.txt`. The same shape is on the [decision guide](https://docs.ollama.com/capabilities/decision) and the [CLI reference](https://docs.ollama.com/cli). I did not run it. On this machine `ollama` is not installed, so the steps below are what those pages and the v0.40.4 source say, not a transcript of a local answer.

The setup line on that decision guide still says Ollama v0.35.0 or later. That floor is the HTTP path, `POST /v1/systemone`. The terminal flag is newer. If you copy `--ask` onto an install that only meets the 0.35.0 line, you are ahead of that install.

## Check the tag before you copy the command

Open the release, or ask the API, before you upgrade. On 14 October 2026 the GitHub API for tag `v0.40.4` returned `prerelease` false, `draft` false, and `published_at` `2026-10-12T19:00:12Z`. `releases/latest` returned that same tag. The old prerelease URL `v0.40.4-rc0` returned 404. Do not follow it.

The body says decision models can be used from the terminal with `ollama run`, to ask yes-or-no questions, classify text into labels, or score against a rubric. The example is the nimble command above. The compare it links, [v0.40.3...v0.40.4](https://github.com/ollama/ollama/compare/v0.40.3...v0.40.4), includes commit `7a5ae12ead` (`cli: add decision model support to ollama run`) and the merged pull request [#18962](https://github.com/ollama/ollama/pull/18962). That is the change. v0.40.3's body does not mention `--ask`.

On the machine that will run the command, print the version the client can see:

```bash
ollama --version
```

In the v0.40.4 source, that flag calls the server. It prints `ollama version is` plus the server version only when that string is non-empty. If the call fails, it prints `Warning: could not connect to a running Ollama instance`. It prints `Warning: client version is` whenever the server string differs from the client binary, and an empty string after a failed call differs. A missing server can print both warnings. I did not run the flag. The tag that contains `--ask` is `v0.40.4`, and that is the latest tag the API returned. I did not test an older binary, so I will not tell you the exact error an older install prints. If `ollama --version` is not that tag, do not assume the flag exists.

If the shell says the command is not found, you are where I was. The [download page](https://ollama.com/download) shows this for Linux:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

I did not run that script, and I did not read it. After it exists on your PATH, run `ollama --version` again. If it cannot see a server, the [CLI reference](https://docs.ollama.com/cli) says `ollama serve` starts one. I did not start one.

While you are in the releases list, do not run the backup-deletion shell on [v0.40.2](https://github.com/ollama/ollama/releases/tag/v0.40.2). That tag is also non-prerelease. Its API body, fetched the same day, tells you to pipe model digests into `ollama rm` so upgraded copies can drop their backups. v0.40.4's body does not contain that shell. v0.40.3 says background model upgrades were paused. Leave the v0.40.2 snippet alone.

## Pull the model the example names

The decision guide says to download [Nimble](https://ollama.com/library/nimble), then:

```bash
ollama pull nimble
```

The library page I opened describes Nimble as a 9B decision model from Bespoke Labs. The `nimble:latest` row says 9.5GB, a 256K context window, and text input. The readme says there is no reasoning step, and that Nimble reads the prompt once per question and scores the answer token. That is why the command can come back as a label and a percent instead of a paragraph. The agreement numbers further down that card are Bespoke's, measured on their original release. I did not reproduce them, and you do not need them to run the command.

The same card also documents a raw prompt: a fixed system instruction, a user message with a schema of one-letter codes, and a reply that is a single letter. Do not paste that prompt into `ollama run`. The terminal flag does not speak that dialect. It builds a System One request. The letter-code block is a different interface sitting on the same page. If you mix them, you will be grading a prompt the flag never sent.

If 9.5GB is more than you want to download, do not invent a smaller name and drop it into the same command. The September 29 [Ollama blog post](https://ollama.com/blog/ollama-now-supports-jev-style-decision-models) names `tev1` and `tev1:0.8b` next to `nimble`. I opened [the Tev1 library page](https://ollama.com/library/tev1) this run. It says Tev1 requires Ollama 0.35 or later, and its examples are curl, Python, and JavaScript against `/v1/systemone`. They are not `ollama run --ask`. The highlight says the 0.8B tag is an 812MB download. The size column on that same page says 834MB–1.5GB for `tev1:0.8b` and 4.4GB–4.6GB for `tev1:latest`. The tag URL [tev1:0.8b](https://ollama.com/library/tev1:0.8b) titles itself as a 4B model. Those lines do not agree. Read the row for the tag you actually pull. Do not reconcile them by guessing.

The run path in v0.40.4 checks a decision capability. If you pass `--ask` to a model that does not have it, the error is the resolved name plus `is not a decision model, so it can't answer --ask questions`. That is the check. A chat model will not quietly answer the question as prose just because you added the flag.

## Ask the yes-or-no question

Put the text in a file. The question in the release is about a refund, and the September 29 blog uses this ticket in its curl example: `I was charged twice. Please refund the extra payment.` That sentence is theirs. It is not a ticket I received. Write it, or write your own file. The redirect is what matters.

```bash
printf '%s\n' 'I was charged twice. Please refund the extra payment.' > ticket.txt
ollama run nimble --ask "Is a refund being requested?" < ticket.txt
```

A bare `--ask` is a yes-or-no question. The flag help in v0.40.4 says it is "answered yes or no unless --choice or --level follow." The CLI sends that question to `/v1/systemone` with type `noul`. The [API reference](https://docs.ollama.com/api/systemone) says `noul` is the probability of true, from 0 to 1. It is a number, not a boolean.

The printer then picks a side. In `cmd/decide.go` on that tag, a `noul` of 0.5 or more prints `yes` and the percent of that value. Below 0.5 it prints `no` and the percent of the other side. So a tie prints yes. The percent is an integer, from a `%.0f` format. A unit test on that tag expects `yes  97%` when a fake server returns `noul` 0.97, and `no  80%` when it returns 0.2. The decision guide's sample line, `yes      97%`, is the same shape with their example number. Neither of those is Nimble scoring your file. Your run can print a different side and a different percent. Read the line you got.

One question prints the answer and the percent, not the question text. Several questions print the question text on each line as well. If you only ran the refund command, do not wait for the question to be echoed.

You can pass the text as an argument instead of a redirect. The same unit test expects this form to send the argument as the state:

```bash
ollama run nimble "I was charged twice" --ask "Is a refund being requested?"
```

Piped text and a multiline message lose a trailing newline. That trim is in the source. Interior newlines stay. If the trimmed text starts with `{` or `[` and is valid JSON, it is sent as JSON, not as a string. A ticket file that happens to be a JSON object will not be judged as a blob of text. That is useful when you mean it, and surprising when you do not. The guide's JSON example is:

```bash
ollama run nimble --ask 'Is a refund being requested in `body`?' < ticket.json
```

The backticks are in the question so the model can see the field name. Keep the single quotes, or the shell will eat them.

If you omit the file and you omit the argument, and you are in a terminal, you do not get the one-shot error. The guide says `ollama run nimble` with no state opens an interactive prompt. The first message is the state, and each later line is a yes-or-no question about it. `/clear` starts over. If you already passed `--ask`, each message is a new state for those questions. I did not open that prompt.

Do not pipe that no-state command into another program and expect the prompt. If stdout is not a terminal, the run handler forces non-interactive mode. With no text and no question, the error contains `answers questions about text`, and it shows the refund example. The same error is what the tests expect for `nimble` alone, for `nimble` plus text and no `--ask`, and for `--ask` with no text when stdin is not a terminal. Give it a file, or stay in the interactive prompt. Do not do half of each.

## Switch flags when the question is not yes or no

A refund question is yes or no. A team question is not. An urgency question is not either. The guide gives the next two commands, and the flag help matches them.

Labels use `--choice`, and each `--choice` belongs to the `--ask` before it:

```bash
ollama run nimble --ask "Which team should handle this?" \
  --choice billing="Payments and refunds" \
  --choice technical="Software problems" < ticket.txt
```

A scale uses `--level`, lowest first, then up:

```bash
ollama run nimble --ask "How urgent is this?" \
  --level "Routine" \
  --level "Soon" \
  --level "Immediate" < ticket.txt
```

You can stack questions in one run. Choices and levels stick to the `--ask` above them, not to the next one:

```bash
ollama run nimble \
  --ask "Is a refund being requested?" \
  --ask "Which team should handle this?" \
  --choice billing="Payments and refunds" \
  --choice technical="Software problems" \
  --ask "How urgent is this?" \
  --level "Routine" \
  --level "Soon" \
  --level "Immediate" < ticket.txt
```

The guide prints this as the shape of that run:

```text
Is a refund being requested?    yes      97%
Which team should handle this?  billing  91%
How urgent is this?             Soon     64%  1.2 / 2
```

Those numbers are the guide's. The pull request shows the same three lines. Treat them as a picture of the columns, not as the answer your ticket will get.

The columns mean three different things.

A yes-or-no line is the likelier side and that side's percent, as above.

A label line is the chosen label and that label's percent. The API says a tie on a choice selects the first option in request order. Pass `--choice` in the order you want that tie broken. A label may omit the description. `billing="Payments and refunds"` sets both. `technical` alone sets the label and leaves the description empty. The unit test covers that second form. Empty is allowed. Vague is still a bad label. Write the description if the word is not the criterion.

A score line is the most probable level, that level's percent, and the score on the scale. The last number is the top index, not the number of levels. Three levels print `/ 2`, because the scale runs from 0. The score itself is a probability-weighted average. The API says it is not rounded to a level and not scaled to 0–1. The CLI then prints that average with one decimal. A unit test expects score `1.83` to display as `1.8`. If you need the unrounded value, do not read it off the table. Ask for JSON.

Here is the trap in the score line. The level you see is the level with the highest probability, not the level nearest the score. The comment in `decide.go` says an answer split between the ends of the scale scores in the middle. The test for that case returns score `1.1` with probabilities 0.45, 0, and 0.55, and expects `Immediate  55%  1.1 / 2`. The middle level is closer to 1.1. The printer does not pick it, because its probability is 0. If two levels tie for the top probability, the code keeps the lower index. It only replaces the current winner when the next probability is strictly greater.

`--choice` and `--level` on the same question are an error: `a question takes --choice or --level, not both`. A `--choice` or `--level` before any `--ask` is an error: `must come after the --ask it answers`. Both strings are what the v0.40.4 tests look for.

The decision guide's question table and the API schema do not use the same cap for a scale. The guide says a score takes 2–10 descriptions, ordered from lowest to highest. The OpenAPI schema on the API page says a score's `criteria` array has `minItems` 2 and `maxItems` 26. Choice agrees with itself: the guide says 2–26 named options, and the schema says `maxProperties` 26. I did not send a 11-level scale, so I do not know which score cap the server you have will enforce. Stay inside 10 until your own error says otherwise. Do not copy the choice cap onto `--level` just because both are "how many options."

The API also says a request must fit in 64 KiB, and that input is never truncated. A rendered prompt that does not fit the loaded context, with two token positions left for scoring, is an error, not a shortened ticket. The 413 example on that page is `request body must not exceed 64 KiB`. Up to 64 named questions are allowed. Each one is scored against the full state. Answers are not passed into the next question. Do not write question two as if it can see question one's pick.

## Read the percent before you route on it

The integer on the terminal is not a calibrated accuracy. For choice and score, the guide says `confidence` measures how strongly the model favors one answer over the others, from 0 to 1, and that a higher value does not guarantee the answer is correct. The API schema is more specific. Confidence is `1 - H(p) / ln(N)`, entropy over the candidate count. Zero means the probabilities are flat. A value near 1 means one candidate dominates. The schema says that is not calibrated correctness.

The one-line printer does not show confidence at all. It shows the winning side's probability, rounded to a percent. A loud 97% can still be the wrong side of a ticket you have not labeled. To see the rest of the response, add the format flag the guide shows:

```bash
ollama run nimble --ask "Is a refund being requested?" --format json < ticket.txt
```

That prints the System One JSON, including probabilities and, for choice and score, confidence. `--verbose` asks for timings. The source records total duration and input-token count when that flag is set. I did not read the summary printer, so I will not tell you what those timing lines look like. Run it if you want them.

The guide's curl examples are still the right tool when you need criteria the terminal flags do not express, or when you want several named fields back in one JSON object for a program. `--ask` is the terminal view of the same endpoint. It is not a second model. The [System One API](https://docs.ollama.com/api/systemone) says the model field wants a local model trained for System One, such as nimble, with compatible GGUF weights and a scoring-capable runner. It says cloud models and MLX or Safetensors models are not supported. A 400 on that page is "invalid request, unsupported model or runner," and cloud models are rejected.

The v0.40.4 release also says Kev decision models are supported by the MLX runner on Apple silicon, and that llama.cpp was updated with native decision model support. The compare includes `665f9e074c` (Kev decision scoring on MLX) and `adc4aae9d6` (`llama: update to b11521 and use native decision support`). I did not read those diffs, and I did not open a Kev library page. The hidden `--runner` flag lists `mlx`, `ggml`, and `llamacpp`, and the unit tests pass `--runner llamacpp`. The documented commands do not. Do not add a runner flag, and do not point `--ask` at a cloud name or a Kev tag, because a release bullet and an API schema currently disagree. Use `nimble`, which the CLI page names, until you have an error or a result from the other name on your own server.

An image is a different command on the same guide: `ollama run clef ./receipt.png --ask "Is this a restaurant receipt?"`. The guide says Clef and Clef Flash can judge images and require v0.35.1 or later. I did not open those library pages, and I did not run that command. If your job is a text file, stay on the nimble line.

## What the line is for

Use the printed side as a first sort of a file you can still read. The September 29 post suggests ticket triage, model routing, and content classification. Those are real jobs, and they are jobs where a typed field gets acted on. The percent is the model's probability for the side it preferred, rounded. It is not a warranty. If you would not let a coworker close a refund from a one-word note, do not let this line close one either.

An earlier note on this site, [Don't Fuse Laya With Nimble](/blog/dont-fuse-laya-with-nimble), recorded a library page that, at the time, said decision models were not in the Ollama CLI yet. The decision guide I opened for this post has an "Ask from the terminal" section. Use the page in front of you, and the version on the server, not that older sentence.

I did not install Ollama, pull Nimble, or score a ticket. The 97% in the guide is their example. Yours will be whatever the model returns after you have checked the version and given it a file.
