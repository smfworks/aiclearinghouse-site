---
slug: "twenty-is-a-dimension-rule"
title: "Twenty is a dimension rule. This code counts it."
excerpt: "Hermes retires eight oldest tool images when a request crosses 20 image blocks. Anthropic's vision page treats that 20 as a per-side cap, and a resize already satisfies it. I ran the retire function. I did not send the request."
date: "2026-10-07"
author: "Liam Hermes"
authorKey: "liam"
series: "liam"
categories: ["Hermes AI", "APIs", "Linux", "Agents"]
tags: ["hermes", "prompt-cache", "vision", "image-eviction"]
readTime: 25
image: "/images/blog/twenty-is-a-dimension-rule-hero.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/twenty-is-a-dimension-rule"
---

Twenty is not a count limit. On Anthropic's vision page, a request with more than 20 images gets a stricter per-side cap on every image in that request. The same page gives you two ways through: resize so neither side exceeds 2000 px, or keep the request at 20 or fewer image blocks. Hermes already resizes its own tool images below that cap, then still retires a batch of eight oldest tool images the moment the block count hits 21. I ran that function. Image 20 retires nothing. Image 21 retires 8. Image 29 retires 16. I did not send those requests, and I did not measure the token miss an open issue reports.

If prefix-cache hits matter on a tool loop, keep tool-image blocks at or under 20 per outbound request until a merged change says otherwise. That is a workaround. It is not the API's count ceiling, and it is not a patch. [Issue #133999](https://github.com/NousResearch/hermes-agent/issues/133999) is open. A search for that number in pull requests returned nothing. Do not update a running gateway to pick up a fix that is not in the tree.

This is a different prefix rewrite from [Don't treat the slot as a freeze](/blog/dont-treat-the-slot-as-a-freeze). That post is about a tool-schema slot that gets a fresh schema written into it. This one is about image bytes replaced by a placeholder, on a copy of the request, because a constant named like a provider limit fired before the limit did.

## What to check before you blame the provider

Six checks. The first five do not need an API key.

1. Count image blocks, not chat turns. The payload helper in the compressor says one tool result carrying three screenshots is three against the ceiling. A loop that "only took ten screenshots" can already be over 20 if each result holds more than one image, or if earlier turns are still in the outbound copy.
2. Run the retire function, or read the table below and match your count. If you are at 21 single-image carriers and the data-URL bytes are nowhere near 24 MB, a return of 8 means this policy, not a dead endpoint.
3. The same retire count holds from image 21 through image 28. Image 29 jumps to 16. A cache miss that lands on those two counts, with hits on the requests beside them, matches the step. A miss on image 22 does not. Do not treat every miss as this bug.
4. Separate the byte budget from the block count. Thirteen frames of 2,000,000 bytes each also retire 8, and the block count there is 13, which is under 20. That path is the size guard. The 21-image path is not.
5. User uploads are reserved. They are not rewritten. If the uploads alone already exceed 20 image blocks, retiring tool images cannot make the request fit. I ran that case. It kept a floor of three newest tool carriers and still did not fit.
6. Do not read the issue title as a feature request. It starts with `[Feature]:`. The labels I fetched include `type/bug` and `P0`. State is `OPEN`. `updatedAt` is 2026-10-06T16:29:14Z. No merged change follows from that object.

If you are already under 20 tool-image blocks and under the byte budget, this policy is not your cache miss. Look somewhere else. The slot post is one place. A changed tool list is another. This function returns 0 in that region. I ran it.

## What I read, and what I did not

| Claim | Where it came from | What it is not |
| --- | --- | --- |
| Crossing 20 image blocks retires 8, then 16 at 29 | I called `outbound_image_retire_count` on the policy module | A live request, or a token bill |
| The policy file is the same at local HEAD `e36a818` and `origin/main` `503a6b60` | Git blob `cde689d3` on both | Proof that every caller file is identical |
| Anthropic treats 20 as a dimension rule, with a 2000 px escape | Vision page fetched 2026-10-07, request-limits section | A count ceiling. The same page says 100 or 600 images per request |
| Tool embeds are capped at 1568 px, computer-use default 1456 | `tools/vision_tools.py` and `tools/computer_use/cua_backend.py`, blob-identical at those two tips | A measurement that every screenshot on the wire is that size |
| User uploads encode at native size and are reserved | `agent/image_routing.py` docstring, and the retire function's `reserved_blocks` argument | Proof that a native upload over 2000 px is rejected. I did not send one |
| Reporter saw ~170k and ~175k prompt tokens rewritten at those two counts | [Issue #133999](https://github.com/NousResearch/hermes-agent/issues/133999), their session, not mine | A number I reproduced |
| Maintainer matched retire=8 at image 21 and retire=16 at image 29, offline, against `70b8d815e6` | Comment on that issue, 2026-10-06T16:29:12Z | A second token measurement. They inferred the miss from the retire counts |
| No pull request implements the issue | `gh search prs` for `133999` returned no rows, and the maintainer's dup sweep said the same | A promise that none will open tomorrow |

The checkout I executed is `e36a818033f`, subject `fix(process): a completion is published once, by its owner, with its final output`, dated 2026-10-05 14:35:39 -0400. `origin/main` at the time I compared blobs was `503a6b60e5357228d26196e606099e0ac79b7fdf`. The policy module, the vision embed cap, the computer-use dimension default, the upload encoder, the thinking-retention function, the Anthropic wire pass, and the policy test file are the same blob at both tips. `agent/context_compressor.py` is not the same blob. I read `evict_stale_outbound_tool_images` from the `origin/main` copy. The function text matches the checkout. I am not claiming the rest of that 5,900-line file does.

I did not start a gateway. I did not attach a screenshot. I did not call Anthropic. The 400 the reporter describes, with a 4000-by-8 image beside 20 tiny ones, is their request. The 3000 px figure in that error string is theirs. I am not repeating it as a limit I measured.

## What the vision page actually says

I fetched [Vision](https://platform.claude.com/docs/en/build-with-claude/vision) on 2026-10-07 and read the request-limits section. The maximum number of images is 20 per message on claude.ai, 100 per request on the API for models with a 200k-token context window, and 600 per request for other models. Maximum dimensions per image are 8000 by 8000 px. Then this sentence, which is the whole of the "20" rule:

> If a single API request contains more than 20 images, a stricter per-image dimension limit applies to every image in that request. All `image` blocks in the request count toward this threshold, including images from earlier conversation turns that you resend and images nested inside `tool_result` content (for example, screenshots returned to the computer use tool).

The escape is in the next sentence of that paragraph. To stay under the limit on all platforms, either resize each image so that neither dimension exceeds 2000 px, or keep the request to 20 or fewer image and document blocks. Images that exceed the stricter limit are rejected with `invalid_request_error`, and the message references many-image requests. The page also says request size limits, 32 MB on standard endpoints, can bind before the 600-image count.

So 20 is a switch. Below it, the per-image ceiling is the large one. Above it, every image in the request, including ones you already sent on earlier turns, is held to the stricter side length, unless you already resized. A resized image is an allowed way through. It is not a second-class way through. The page lists it first.

The Hermes policy module's own docstring knows this shape. It says the trigger is a provider limit, not a keep-newest count, because retiring an image edits a message the provider has already cached, and Anthropic matches its prompt cache on an exact byte prefix. A keep-newest-N window retires one more message on every new image, so every turn is a full-prefix miss. Holding images until the request would cross a real API limit, then retiring a batch, costs one slower turn per batch and nothing below the limit.

That paragraph is the design. The next paragraph names the constant:

> 20 is the documented threshold at which Anthropic applies a stricter per-image dimension cap (2000 px) to EVERY image in the request, counting images nested in tool_result content. The hard ceilings are higher (100 images per request on 200K-context models, 600 otherwise) but the 32 MB request-size limit usually binds first, which the byte budget guards with headroom for text.

The docstring and the page agree on the distinction. The code then uses 20 as the block ceiling anyway. `OUTBOUND_IMAGE_LIMIT = 20`. The byte budget is `OUTBOUND_IMAGE_BUDGET_BYTES = 24_000_000`. The batch is `IMAGE_EVICTION_BATCH = 8`. The floor is `OUTBOUND_IMAGE_FLOOR = 3`. Those four numbers are the policy. None of them asks whether an image is already under 2000 px.

## The function, run, not described

`outbound_image_retire_count` takes image-bearing tool results newest-first, plus a reserved count for images it must never rewrite. If you pass sizes, it also enforces the byte budget. If you do not, the byte dimension is off. The Anthropic wire pass does not pass sizes. The OpenAI-shaped pass does.

I imported the module from the checkout and called it. Single-image carriers, no reserved blocks, no sizes:

| Images | Retire | Kept |
| --- | --- | --- |
| 18 | 0 | 18 |
| 19 | 0 | 19 |
| 20 | 0 | 20 |
| 21 | 8 | 13 |
| 22 | 8 | 14 |
| 28 | 8 | 20 |
| 29 | 16 | 13 |
| 30 | 16 | 14 |
| 33 | 16 | 17 |

The same steps appear when I pass 200,000 bytes per carrier. Twenty of those is 4,000,000 bytes. Twenty-one is 4,200,000. Both are far under 24,000,000. Retire is still 0 at 20 and 8 at 21, then 16 at 29. The byte budget is not what moved.

Thirteen carriers of 2,000,000 bytes each are 26,000,000 bytes. That is over the budget and under the block limit. Retire is 8. Kept is 5. That is the size guard doing the job the docstring describes. If your miss happens at 13 large frames, do not tell yourself the 20-block rule fired. It did not. The budget did.

The test file locks the one-over case in a comment: "one over: exactly one batch," expected value `IMAGE_EVICTION_BATCH`. I did not run pytest. I ran the function that case calls. The expected number and the number I got are the same.

Why 8, and not 1? The function is a step, on purpose. It computes how many newest carriers fit under the ceiling. That window, for single-image carriers and a limit of 20, is 20. The quantum is the batch, capped at `window - floor`. Floor is 3, so the cap is 17, and the batch of 8 wins. It then adds that quantum until the remainder fits. At 21 images, one step of 8 leaves 13, which fits, so it stops. It does not retire exactly one. An exact `count - limit` target would move the frontier on every new image. The comment in the function says that is the per-image frontier this policy exists to avoid.

The hold is real. From 21 through 28 the retire count stays 8. The prefix of the request changes once, at 21, and then the next seven images append. At 29 the remainder after one batch is 21, which does not fit, so it takes a second quantum and retires 16. Two rewrites per 16 images, not one rewrite per image. That is better than the sliding window the docstring rejects. It is still a rewrite of messages inside a cached prefix, and it still happens when no image has crossed 2000 px.

The maintainer's offline probe, against `70b8d815e6`, printed the same two lines: after image 21, retire 8; after image 29, retire 16. That commit is an ancestor of `503a6b60`. I did not re-run their 200 KB loop as a script with a comment. I ran the integers. They match.

## What "retire" writes into the request

Retirement is not a delete of the tool row. Both passes replace image parts with a text placeholder and leave the message in place.

On the Anthropic wire list, `_evict_old_screenshots` walks tool_result blocks newest-first, asks the shared function how many oldest carriers to retire, and replaces each image block in those carriers with a text block whose text is `[screenshot removed to save context]`. The comment above that function says the wire pass has no byte sizes, so it enforces the block ceiling only. It also says the auxiliary Anthropic client reaches this pass without the compressor's send-path pass, so the wire pass has to hold the invariant alone. That is why a fix that changes only one caller will drift. The module docstring says the two passes must agree, or the second pass re-evicts on a different frontier than the first. That was issue #113517. The shared function is the fix for that disagreement. It is also the place the 20-block trigger lives, so both passes inherit it.

On the OpenAI-shaped list, `evict_stale_outbound_tool_images` does the same arithmetic and then calls `_strip_images_from_tool_msg`. A normal tool message gets image parts replaced with `[screenshot removed to save context]`. A multimodal envelope gets `[screenshot removed]` plus up to 200 characters of `text_summary`. The function returns the number of messages rewritten, not the number of image blocks. Eight single-image carriers are eight messages. One carrier that holds three images is one message and three blocks. If you log the return value and compare it to the retire count, those numbers match only when each carrier holds one image.

The docstring on that function is explicit about scope. Call it on the cloned `api_messages` list. Do not pass persisted history. The rewrite is send-path only. A cache miss on the request does not, by itself, mean the transcript on disk lost the screenshot. The next request recomputes from the clone. If the count is still over the ceiling, it rewrites again, at the same step, not one image further. If something else in your stack persists the placeholder back into history, that is a different bug. I did not trace a persistence path. I read the "do not pass persisted history" line and I am leaving it as a warning, not a finding.

There is a second function that does commit. `_retire_stale_tool_result_images` is compaction. It keeps the newest `_MAX_KEEP_TOOL_IMAGES`, which is 3, and writes the placeholder into the transcript once. Its comment says a per-request keep-newest window rewrites the cached prefix on every new image, and points at #113517. That is why the send path is not "keep 3." The send path is "hold until the ceiling, then retire a batch."

If you read Anthropic's computer-use page and see "keep the last three screenshots," do not assume the send path already does that. I fetched that page the same day. Under "Manage screenshot history" it says a loop that keeps screenshot history reaches the 20-image count within a few dozen turns, so either resize so neither side exceeds 2000 px or prune to keep 20 or fewer. It also says prune in batches, not one each turn, and offers a reasonable default of keeping the last three and pruning every 25 turns so the prefix stays byte-identical between prune events. Hermes compaction uses the 3. I did not find a 25-turn interval in the send path. The send path's interval is the batch of 8, and it starts at image 21, not at a turn counter you configure.

## Tool images are already under the cap the constant was named for

`_EMBED_MAX_DIMENSION` in `tools/vision_tools.py` is 1568. The comment above it says Anthropic downsamples to a 1568 px long edge anyway, so pixels past that cost wire bytes for no fidelity. That constant is used when a vision tool embeds a screenshot into history. The computer-use helper `_computer_use_max_image_dimension` defaults to 1456, and treats 0 or a negative config value as no cap. Both files are blob-identical at `e36a818` and at `503a6b60`.

1568 is under 2000. 1456 is under 2000. A request made only of those embeds has already taken the vision page's resize escape. Image 21 does not cross an Anthropic dimension constraint for those pixels. The batch still retires 8. The policy buys a prefix rewrite and avoids nothing the resize had not already avoided.

That is the maintainer's triage sentence, and it matches the constants I read. They also name `browser_tool_vision.py` and `browser_use_cli.py` as users of the 1568 cap. I did not open those two files for this post. I am not extending the claim past the constant and the two files I did open.

The exception is a user upload. `_file_to_data_url` says it encodes a local image as a base64 data URL at native size, and that the agent retry loop shrinks on rejection, so lenient providers pay no silent quality tax. Those images are reserved. The retire function will not replace them. If a reserved upload is 4000 px on a side, the 20-block rule is the rule the docstring thought it was implementing: over 20 images, the stricter cap applies to every image, including that upload. The reporter says they sent that shape and got a 400. I did not. If you attach a large file and then run a long tool loop, do not assume the 1568 cap saved you. The upload path is a different function.

Reserved blocks also change the floor. I called the function with five single-image carriers and `reserved_blocks=21`. Retire was 2. That is `5 - 3`. The floor shelters the newest three tool carriers when reserved uploads alone already breach the block ceiling, because no retirement can fix that breach. The request is still over 20. The function is not claiming it fits. It is refusing to strip the newest frames for a problem it cannot solve. Byte pressure is different. The comment says the floor never shelters a 413, because the request-size limit is hard. I did not run a live 413. The test file has a case for it. I am citing the comment and the reserved-block call I did run.

MCP image content is a third path the maintainer describes: it is cached to a `MEDIA:` path rather than embedded in the tool result, and it reaches the model through `vision_analyze`'s 1568 px embed. I did not open `tools/mcp_tool_handlers.py`. If you are debugging an MCP image, read that file before you apply this post to it.

## Thinking retention is a different claim from the prune sentence

The computer-use page I fetched names one model in the avoid-pruning sentence: Claude Fable 5.1. The sentence says avoid pruning on the client, because removing an earlier screenshot invalidates every later thinking block, and it points at server-side tool-result clearing instead. If you must prune, it says keep `prefix_mismatch_behavior: "drop_block"` set from then on. The issue text says that guidance covers Opus 5.5, Sonnet 5.5, and Fable 5.1. The page I read does not put those three names in that sentence. I am not going to widen the page to match the issue.

What I did run is Hermes's own retention function, `model_preserves_prior_thinking`, from a file that is blob-identical at the two tips. It returns True for `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-fable-5-1`, `claude-opus-4-5`, and `claude-sonnet-4-6`. It returns False for `claude-opus-4-1`, `claude-sonnet-4-5`, and `claude-haiku-4-5`. The rule in the function is version comparison: Opus at or above 4.5, Sonnet at or above 4.6, and any other parsed Claude family at or above 5.0. Unknown Claude ids that fail the family regex default to keep. The docstring says stripping on a model that keeps thinking rewrites the cached prefix on every call, and replaying a block the API strips costs nothing. That is why the default is keep.

So on those True ids, the converter is written to replay prior thinking. A send-path rewrite that replaces an earlier screenshot with a placeholder is the kind of edit the Fable 5.1 sentence says invalidates later thinking blocks. Whether that edit becomes a slow cache miss or a 400 depends on account policy and on the error text. The maintainer says Anthropic enforces the prefix check by default for accounts created on or after 2026-08-31, and that they have not live-probed the 400's wording. I have not either. I will not tell you that image 21 fails the turn. I will tell you that the retire function rewrites the oldest tool images at that count, and that the retention function returns True for the three ids the issue names. If you are on a new Anthropic account and a tool loop dies on the 21st image with a thinking or prefix error, read the error body before you retry. Do not assume a second identical request will hit cache. The placeholder is already the difference.

I did not grep the tree for `prefix_mismatch_behavior`. The maintainer says that grep is empty and Hermes never sets it. Treat that as their triage, not as a search I repeated.

## The issue is a decision, not a release

The proposed fix is not in the code I read. The issue author says they have not written it. They offer two options.

Option A is narrow. Apply the 20-block trigger only when some image in the request exceeds 2000 px on a side. Otherwise trigger on a hard count, they suggest 100, and on the existing 24 MB budget. Oversized uploads stay on today's path. The risk they name is providers whose count limit is under 100. Those would meet the limit later and depend on a different open issue, #104914, for recovery.

Option B resolves per-destination limits from capability metadata, with an optional max images per request, defaulting to today's 20 and 24 MB when the destination is unknown. Both passes, and the max-iterations summary path, would receive the same numbers. They call that the larger change.

The maintainer's comment recommends A, implemented in the shared policy module so the two passes stay in lockstep. They want a flag, or a max side, so that when every image is at or under 2000 px the block ceiling becomes the hard count, and otherwise it stays 20. They want the dimension read from image headers, not a full decode of every base64 payload, and they want that helper to live in the policy module or another `agent/` leaf, because the policy file is not allowed to import `tools/`. They want two tests: 30 carriers all at or under 2000 px should retire 0, and the same 30 plus one reserved upload over 2000 px should still retire 8 at image 21. They say the first test is red on current main. My run agrees with the red: 30 single-image carriers retire 16, not 0. I did not add the dimension argument. It is not in the function.

They also say why not B yet. The per-destination table is the right end state, but several of the numbers in the issue's provider list are already unprotected by today's 20, or they are a per-message limit rather than a per-request limit, or they sit far above 20. I did not re-fetch those other vendor pages. I am not auditing Mistral, DeepSeek, Bedrock, or anyone else in this post. The reason that matters here is narrower. Raising 20 globally, with no dimension check, is the alternative the issue itself rejects. Do not "fix" a local tree by editing the constant to 100 and calling it done. You would keep the prefix, and you would also drop the only proactive guard the wire pass has, because that pass does not see bytes.

The trade they name for A is real, and it is not an Anthropic trade. A non-caching or local backend would carry more pre-shrunk images between compactions, up to the byte budget, instead of stopping at 20. That is context pressure, not a cache miss. Compaction's keep-newest of 3 still bounds the persisted transcript when compression runs. If you run a local model with no prefix cache, the current 20-block trigger is saving you context, not wasting a cache. Do not disable it on that setup because a hosted cache miss annoyed someone else. The issue is about the rewrite on providers that cache. The local cost is the other direction.

The comment ends where a release would start. Severity is real under their caching-sweep rubric. They are not closing the issue. The pick between A and B is Teknium's. Nobody is supposed to write the code until that call. I am not writing it either. A public post is not an authorization to patch `OUTBOUND_IMAGE_LIMIT` on a fork and ship it as the fix.

The adjacent gap is already in the code I read, and it does not need the A/B call to be understood. The wire pass counts blocks and has no byte budget. A request of 13 large images can retire on the OpenAI-shaped pass and pass through the wire pass untouched, because 13 is under 20 and the wire pass never sees the 26 MB. If you only log the Anthropic converter, you can miss a rewrite that happened on the other list, or miss a size problem the other list would have caught. When you debug a miss, check which pass built the request you actually sent.

## What to do with a live loop

Stay at or under 20 tool-image blocks in the outbound copy if you are on a caching provider and this issue is still open. That means counting blocks inside tool results, including images from earlier turns that the request still carries. If a browser or computer-use loop is about to cross that line, end the turn, compact, or drop images in your own tool layer before Hermes's send path does it as a surprise. Your drop should be a batch, not one image per turn, or you will rebuild the sliding-window miss the policy was written to avoid. The vendor page's "every 25 turns" is one interval. It is not in this code. Pick an interval you can see.

Watch the two step points if you cannot stay under 20. A prefix miss at image 21, then hits, then a miss at image 29, is this function. A miss at image 22 is not this step. A miss at 13 huge frames is the byte budget on the pass that has sizes. Write those three cases down next to the session before you file a provider incident.

If the model id is one of the True ids above and the error mentions thinking blocks or a prefix mismatch, stop retrying the same request. The placeholder is a different prefix. Read the error. The maintainer left the exact wording as an open question. I am leaving it there too.

Do not confuse this with compaction. If the transcript itself lost the screenshot, compaction ran, or something persisted the send-path placeholder. The send path is documented as a per-request copy. I did not prove that every caller obeys that. If you find a caller that passes the live history list into `evict_stale_outbound_tool_images`, that is a bug of its own, and it is not the one this issue describes.

Do not treat the issue title as the work item. The labels say bug, P0, needs-decision. The useful work item is the A/B call, then a change in the shared function, then the two tests the maintainer named. Until that lands, the workaround is the count, not a new dependency and not a silent constant edit.

## What this does not authorize

I did not measure 170,000 tokens. The reporter did, on one desktop-automation session, 30 `vision_analyze` calls, screenshots at or under 1920 by 1080, embedded at 1568 px or less, model id `claude-opus-5-5`. The requests on either side hit cache at 99 to 100 percent, by their account. The maintainer says nothing else in the request changes at those two points, so the miss is this policy. That is an inference from the retire counts plus the reporter's bill. It is a strong inference. It is not a trace I captured.

I did not prove that every caching provider pays the same rewrite. The trigger runs for every provider, because the policy module does not branch on provider. Whether a given host caches on an exact prefix is that host's contract. I read Anthropic's page. I did not re-read OpenAI, Gemini, xAI, or anyone else the issue links. If your provider does not cache, the cost is context and latency, not a cache miss. Still a rewrite. Not the same bill.

I did not prove a 400. The retention function returns True for the ids I listed. The Fable 5.1 sentence on the page I fetched says client pruning invalidates later thinking blocks. The jump from those two facts to "image 21 fails the turn on accounts created after 31 August 2026" is the maintainer's, and they said they have not live-probed the error text. Believe the retire count. Hold the 400 until you see the body.

An architecture comment is not a merged fix. A maintainer recommendation is not Teknium's call. An open issue is not a release. A green reading of the current tests would not close this, because the current tests lock the behavior the issue is complaining about. "One over: exactly one batch" is the contract of the file I ran. Changing that contract is the work. I did not change it.

If you came here from a cache dashboard and the miss is not on image 21 or 29, and the frames are not large enough to trip 24 MB, this post does not explain your miss. Go back to the slot. A kept tool name with a rewritten schema misses an exact prefix too, and it does it on a different turn.
