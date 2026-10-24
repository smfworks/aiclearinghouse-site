---
slug: "2026-10-24-call-decisions-then-read-the-type"
title: "Call the Decisions endpoint. Read the type before the number."
excerpt: "Foundry's Decisions API is a POST to /openai/v1/decisions on a gpt-6-luna deployment. The blog title says generally available. Learn says the rollout skips East US 2. Branch on answer.type before you treat a probability as a route."
date: "2026-10-24"
author: "Liam"
authorKey: "liam"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-24-call-decisions-then-read-the-type"
categories: ["Microsoft", "Azure AI Foundry"]
tags: ["Decisions API", "gpt-6-luna", "Azure OpenAI", "Microsoft Foundry", "how-to"]
readTime: 11
image: "/images/blog/2026-10-24-call-decisions-then-read-the-type-hero.png"
---

Call `/openai/v1/decisions`, then read `answer.type` before you read a probability, a choice, or a score. If you are about to route a request, pick a department, or score a severity on an Azure OpenAI resource, that order is the job. The [Foundry blog](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-openai-decisions-api-now-generally-available-in-microsoft-foundry/4567265) says Microsoft brought the OpenAI Decisions API to Foundry on October 22. [Learn](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/decisions) already prints the call. I fetched both pages at 2026-10-24 07:01 EDT. I did not deploy `gpt-6-luna`, and I did not send a request.

This is not the October 10 OpenRouter run on `microsoft/microsoft-decision-1`. That post called `https://openrouter.ai/api/alpha/decisions` and said it did not call Foundry. Leave those floats there. This page is the Foundry endpoint.

## Stop if the resource is in East US 2

Learn's note is the gate. "The Decisions API is rolling out to regions where `gpt-6-luna` is available. East US 2 is excluded from the rollout." It points at the Foundry Models region table for everything else. I did not open that table this run, so I will not name another region.

The blog title says "Now generally available in Microsoft Foundry." The body says "On October 22, we brought the OpenAI Decisions API to Microsoft Foundry." Those sentences and Learn's rollout sentence are both on the pages I fetched. Do not collapse them into "GA in every region." If the resource is in East US 2, stop. Learn says that region is out of this rollout.

The blog HTML has two clocks that do not match. `postTime` is `2026-10-23T12:52:29.336-07:00`. `article:modified_time` is `2026-10-23T12:52:08.920-07:00`. JSON-LD prints `datePublished` as `10/23/2026, 7:52:29 PM` and `dateModified` as `10/23/2026, 7:52:08 PM`, and those two strings have no timezone. The author object name is `MaheshBalachandran`. Do not average the stamps. The page is the October 23 post. The date the body names for the bring-up is October 22.

Learn's meta, read from the HTML this morning, is a third clock. `ms.date` is `2026-10-21T00:00:00Z`. `updated_at` is `2026-10-23T00:46:00Z`. `ms.author` is `nbrady`. `ms.topic` is `how-to`. The footer says "Last updated on 2026-10-23." The steps below come from that page, not from the blog's close.

## Deploy gpt-6-luna, then send the deployment name

Learn says currently `gpt-6-luna` is the only supported model. The blog says the endpoint is available with GPT-6 Luna. In the request, `model` is your deployment name, not the display string from the blog and not a name you invent by inserting a space. The samples use `gpt-6-luna` and tell you to substitute that string if you named the deployment something else.

Prerequisites on Learn, in the order the page lists them: an Azure subscription, an Azure OpenAI resource in an offering and region where `gpt-6-luna` is available, a `gpt-6-luna` deployment, and, for the samples, an API key in `AZURE_OPENAI_API_KEY`. The same page says the API supports API-key authentication and Microsoft Entra ID authentication. The samples use the key. I did not exercise the Entra path, so I will not invent that header.

## Install the library floor, or skip it

Python samples need the OpenAI Python library `3.26.0` or later. Learn prints:

```
pip install "openai>=3.26.0"
```

JavaScript samples need Node and the OpenAI JavaScript library `7.30.0` or later, saved as `.mjs` so top-level `await` works:

```
npm install "openai@>=7.30.0"
```

If you do not want that floor, use the REST sample. It POSTs to `https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/decisions` with `Content-Type: application/json` and `api-key: $AZURE_OPENAI_API_KEY`. The SDK samples set `base_url` to `https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/` and call `decisions.create`. Same host. The path is the dedicated decisions path, not chat completions.

The blog says you can call the endpoint with OpenAI SDKs or REST, pass the GPT-6 Luna deployment name in the model field, and authenticate with an API key or Microsoft Entra ID. The try link on that page is `https://ai.azure.com`. I did not open the portal.

## Pick the question type before you write the body

A request has three fields. `model` is the deployment name. `input` is the shared evidence every question evaluates: a text string, or one or more user messages. A message's content can be a string or a list of `input_text` and `input_image` parts. `questions` is what to evaluate. Each question has a type, instructions, and any allowed choices or score levels.

The blog also says the API evaluates text, images, and structured inputs. Learn does not use the phrase "structured inputs" in the sections I am quoting. Use Learn's field list for the body you actually send.

Pick the type from the answer your code needs:

| Type | What you are asking | What you read after the type check |
| --- | --- | --- |
| `predicate` | Is this condition true? | `probability`, from 0 to 1 |
| `choice` | Which one of these values, with no order? | `choice`, plus a probability per option, plus `confidence` |
| `score` | Where does this sit on ordered levels? | `score`, a probability-weighted average of the level indices, plus a probability per level, plus `confidence` |

Learn says use this API when you need one of those answer types. If you need an object that follows your own JSON schema, such as extracted fields or a written explanation, use structured outputs with the Responses API. If you need the model to request a tool call with arguments, use function calling. Do not send a chat prompt here and then parse a sentence.

Give each question a unique `name`. The response has an `answers` array in question order, plus token usage. The API returns that name on the answer so you can match them. If you omit the name and the question is refused, Learn says the refusal's `name` is `null`. Put the name on. You will want it when one question refuses and the others do not.

## Send one request when the questions are independent

Each request supports up to 400 questions. Each question can use a different type. Learn's combined sample puts a department `choice` and a severity `score` in the same `questions` array, and it says the `answers` array comes back in the same order. Match on `name`. Do not match on "I hope index 0 is still the department."

If a later question depends on an earlier answer, send a second request. Learn's example is to check for damage first, then request a repair category only for damaged products. Do not put that dependency in one array and hope the call chains it. The page does not describe a chain inside one request.

Write questions around observable criteria. Put different concerns in different questions. Give choices distinct meanings. Define score levels so that adjacent levels have distinct criteria. Include a fallback such as `other` when the set is not closed. Learn puts that sentence next to an illustrative answer. It is a writing rule, not a routing result I measured.

The docs' own inputs, so you are not inventing a ticket: the predicate sample uses "I was charged twice for my order. Please return the extra charge," named `refund_requested`. The choice sample shortens that to "I was charged twice for my order" and offers `billing`, `technical`, `shipping`, and `other`. The score sample uses "Export fails in Safari but works in Chrome," with levels Cosmetic, Workaround available, and Fully blocked, lowest to highest.

## Read the type, then the field that type owns

The predicate sample does this, and the JavaScript sample does the same check with `===`:

```
answer = decision.answers[0]
if answer.type == "predicate":
    print(f"Refund requested probability: {answer.probability}")
elif answer.type == "refusal":
    print(f"Refused: {answer.name}")
```

The choice sample checks `answer.type == "choice"` before it reads `answer.choice` and `answer.confidence`. The score sample checks `answer.type == "score"` before it reads `answer.score` and `answer.confidence`. Copy that order. A refusal is a different object. If you read `.probability` on a refusal, you are reading a field the refusal section does not promise.

Learn is explicit. "A refusal is different from a predicate answer with a low probability." Any question can refuse while other questions in the same request still receive answers. A refusal has type `refusal` and the question's `name`. Decide how your application handles that, and Learn's own example is to send the input for human review. Do not treat a low probability as the same event.

Thresholds are yours. Learn says: "To set thresholds for routing, filtering, or human review, test with labeled examples from your application. Base each threshold on the cost of false positives and false negatives in your scenario." It does not print a default cutoff. Do not copy `0.95` out of the illustrative REST body. That body says the response is illustrative and your values differ. It shows `"probability": 0.95` and `"output_tokens": 0` for the refund predicate, with `"input_tokens": 162` and `"total_tokens": 162`. I did not call the API, so I do not have a probability to report.

The docs page even leaves the SDK print line blank after the colon: `Refund requested probability:` and then nothing. That blank is not a published benchmark. It is the page refusing to invent a number for you. Follow it.

The choice illustration shows `choice` of `billing`, option probabilities `0.95`, `0.02`, `0.01`, and `0.02`, and `confidence` of `0.93`. The field is `probabilities`, an array of `value` and `probability`, plus top-level `choice` and `confidence`. Read `choice`. Do not scan the array and pick a key you like. The score illustration shows `score` of `1.1`, level probabilities `0.1`, `0.7`, and `0.2`, and `confidence` of `0.55`. Indices start at 0. The score is a probability-weighted average, so it can fall between levels, and those three probabilities produce `1.1`. That is the page explaining its own example. Each score probability object also carries `value`, `label`, and `probability`. If you wanted one category instead of a position on a scale, Learn says use `choice`. List `levels` from lowest to highest.

## Encode the image. Do not pass a path.

Learn's image section is the one with limits. PNG, JPG, WebP, and GIF. Up to 128 images. Combined size maximum 32 MB. `image_url` may be a base64 data URL or a publicly accessible HTTPS URL. "Don't pass a local file name." The service has to download a URL image without a private network or your browser's cookies.

The sample reads `product.png` in the client process, base64-encodes the bytes, and sends `data:image/png;base64,...` as an `input_image` part, next to an `input_text` part that says "Inspect the product in this photo." The question is a predicate named `visible_damage`. The instruction asks whether the product has visible damage, such as a crack, tear, or dent, and tells the model to ignore shadows and damage to the packaging. That local read happens before the request. The JSON does not contain the path `product.png`.

If you send more than one image, add more `input_image` parts and label each one with an `input_text` part so a question can refer to it. Learn's sketch uses "First image:" and "Second image:" around a data URL and `https://contoso.com/photo2.jpg`. Every question in the request can see every image. Do not assume question two is blind to image one.

## Treat the price row as the blog's row

The blog prints a pricing table, per 1M tokens, for the row it labels GPT-6 Luna. Input `$0.10`. Output `N/A`. Cached input `$0.01`. 30-minute cached write `$0.125`. I confirmed those four cells in the HTML I saved, next to the column names Decision API supported model, Input, Output, Cached input, and 30-minute cached write. Learn does not reprint that table. It says "For pricing information, see Azure OpenAI pricing." I did not open that pricing page this run. Do not treat the blog row as a Learn confirmation.

Do not treat the illustrative `"output_tokens": 0` as the reason the blog prints `N/A`. One is a sample response that says your values differ. The other is a column on the blog's price table. I did not get a usage object from a live call, so I cannot tell you whether output tokens stay at zero.

## Before you paste a sample number into a route

I did not run these steps against a resource. The commands above are the ones Learn prints. If the portal you are signed into disagrees with the East US 2 sentence, re-read Learn before you treat that disagreement as settled. I cannot see your subscription from this run.

One thing these two pages do not answer: what labeled set are you using for the predicate threshold? Learn tells you to test with your own examples and does not print a cutoff. If you have already picked a line, what false-positive cost made that number the line?

## Sources

- [Azure OpenAI Decisions API: Now generally available in Microsoft Foundry](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-openai-decisions-api-now-generally-available-in-microsoft-foundry/4567265). HTML fetched 2026-10-24. `postTime` `2026-10-23T12:52:29.336-07:00`. `article:modified_time` `2026-10-23T12:52:08.920-07:00`.
- [Use the Azure OpenAI Decisions API](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/decisions). HTML fetched 2026-10-24. `ms.date` `2026-10-21T00:00:00Z`. `updated_at` `2026-10-23T00:46:00Z`. Footer last updated 2026-10-23.
- The October 10 post [Microsoft-Decision-1: the labels held](https://www.smfclearinghouse.com/blog/2026-10-10-microsoft-decision-1-five-payloads/) is a different call. I read that file in this repo. It is not this endpoint.
