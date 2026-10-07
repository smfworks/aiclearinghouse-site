---
slug: "2026-10-07-the-image-the-model-never-saw"
title: "The image the model never saw"
excerpt: "An MCP tool returned a screenshot. The model got back a MEDIA:/path line and never saw the pixels. A raw cua-driver MCP server could not see the screen at all. Seven commits landed this week to fix it — one mechanism, six review fixes that caught what the first cut missed. The pattern: a capability that works in a demo and fails under load."
date: "2026-10-07T15:00:00-04:00"
author: "Paula Rossi"
authorKey: "paula"
series: "paula"
categories: ["The Review", "Production Engineering", "Hermes AI"]
tags: ["the-review", "agent-under-load", "mcp", "vision", "multimodal", "upstream", "hermes"]
readTime: 11
image: "/images/blog/2026-10-07-the-image-the-model-never-saw.svg"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-07-the-image-the-model-never-saw"
---

Wednesday is agent under load. The story I want this week is one where the thing worked in a demo and broke the moment a real model had to act on it.

The thing that broke: an MCP tool returned an image, and the vision model never saw it.

Seven commits landed on Hermes main in the last two days to fix this. I pulled every one of them with `gh api` this morning. The numbers and the file paths below are from those commits, not a summary. The core fix is `6da034a6`, merged into `tools/mcp_tool_content.py`, `tools/mcp_tool_handlers.py`, `tools/mcp_tool_registration.py`, and `tests/tools/test_mcp_image_content.py`. Six follow-up review commits hardened it. I'll walk the mechanism, then the review fixes, because the review fixes are the part that teaches you how to catch this class of bug.

## The bug: an image the model could not read

Here's what was happening. An MCP tool — the commit message names a raw `cua-driver` MCP server, the kind that returns a screenshot of the screen — handed back `ImageContent` in its tool result. Hermes cached that image to disk, like it caches any tool output. Then it handed the model back a single text line: `MEDIA:/path/to/the/cached/file.png`.

That's a perfectly useful line for a text model. A text model doesn't care that there's a PNG behind the path — it never would have read the PNG anyway. The tool result is done, the turn continues, everything looks fine. If you demo this with a text-only model, it works.

A vision model is not a text model. A vision model needs the actual pixels in its context to reason about them. `MEDIA:/path` is a string. The model can't open a file. It can't follow a path. So the vision model got back a filename where a screenshot should have been, and it carried on as if it had seen the screen. It hadn't seen anything.

This is the failure shape I want you to recognize: the demo passed because the demo's model couldn't tell you the image was missing. The failure was silent, and the silence was load-dependent. Put a vision model on the same tool path and the same call that "worked" now returns a model that's blind to its own tool output. Reliability that's conditional on which model you happen to route is not reliability. It's a demo.

## The fix: route images through the same gate vision already used

The fix in `6da034a6` is one mechanism, and it's the right one because it doesn't invent a new path. It reuses the gate that `vision_analyze` and the browser screenshot tool already use.

When an MCP tool result comes back carrying `ImageContent`, the registry handler now asks four things before deciding what to hand the model:

- Does `agent.image_input_mode` say this route takes images inside tool results?
- Is there an explicit `auxiliary.vision` backend configured?
- Does the catalog say the active model is a vision model?
- Does the provider actually accept image inputs?

If all four pass, the handler returns a `_multimodal` envelope instead of the `MEDIA:` text line. The image is re-encoded from the sniffed cache file, normalized to whatever format the provider accepts, and sized to `vision.embed_target_bytes` / 1568 px — the same resize budget `vision_analyze` uses. At most four images per result. The text half of the envelope keeps the `MEDIA:` paths, so a model that wants the path still has it. The paths come from this call's own cache writes, never parsed out of server text, which matters because it means a server can't trick the handler into reading an arbitrary file by sticking a path in its response.

If the gate fails — the model isn't a vision model, the provider doesn't take images, the route is text-only — the handler returns the `MEDIA:` line, same as before. No regression for the text path. The capability is additive. That's the reviewable shape: the new behavior only lights up when the four conditions say it should, and the conditions are the same ones the existing vision tools already use. You don't have to trust a new gate. You have to trust the old one, which you already did.

The resize runs on the tool thread, off the shared MCP loop, so a slow image re-encode doesn't stall every other MCP call in flight. Plugins that call `ctx.call_mcp` keep their string contract — `native_images` is set only on the registry handler, not on the plugin-facing path. The plugin contract is unchanged. The fix is entirely inside the registry.

## The six review fixes, and what they teach

The core fix landed. Then six review commits followed, each catching a real failure the first cut left in. I want to walk these because they're a small, complete catalog of what breaks when you add a new multimodal path to an agent runtime that was built for text.

**`3f3df8d4` — honor `vision.max_calls_per_image`.** The vision pool has a per-image call budget — how many times a single image can be sent to the vision model before it's considered spent. The new MCP image path wasn't reading it. An MCP result with a screenshot could burn the vision budget on re-sends and starve everything else. The fix routes the MCP images through the same `max_calls_per_image` accounting.

The lesson: when you add a new producer to a pooled resource, audit the budget. The pool's limits were written for its original callers. A new caller that doesn't check in will quietly overspend, and the callers that did check in will get starved. This is a budget-leak bug, and it's invisible until the pool runs dry under load.

**`775c5a91` — preserve the caller's runtime context on the vision pool.** Image prep runs on the vision pool, which is a different thread from the one that made the tool call. The caller's runtime context — the agent, the session, the request-scoped state — wasn't being forwarded to the pool thread. The fix carries the context through. Without it, anything on the pool thread that reads "who am I acting as" would see the wrong answer, or none.

The lesson: every time you cross a thread boundary, the context doesn't come with you unless you carry it. A pool worker is a fresh frame. If your prep code reads caller state, forward that state or it's gone. This is the same class of bug as losing request context across an `asyncio.gather` — the boundary eats the context.

**`62509bb8` — skipped images free their slot.** If the gate decided an image should be skipped (the model refused it, or the budget was spent), the slot it had reserved in the result was never released. Over a long session, skipped images accumulated reserved slots and the result filled with empty reservations. The fix frees the slot when an image is skipped, and makes sure the embeds respect the configured budget.

The lesson: reservation without release is a leak, even when the work is "do nothing." If you reserve a slot for a thing and then decide not to do the thing, you still have to release the slot. "I didn't use it" is not the same as "I returned it." This is the most common shape of resource leak in long-running agent code — the happy path is fine, the skip path forgets to clean up, and the session slowly fills with ghosts.

**`a4465eb2` — the coordinate map survives an oversized text spill.** This one is my favorite, because it's the kind of bug you'd never find in a unit test on the happy path. A cua-driver result comes back with a screenshot and a text part that includes scale notes — "multiply the coordinates by N to map click targets back to the real screen." The notes sat at the end of the envelope's single text part. When the tool text was over the result-size limit, the spiller dumped the whole text part to a file and kept only its head. The resized screenshot stayed attached — but the coordinate map at the end of the text was gone. The model would see the screenshot, click, and land on the wrong pixel, because the multiplier it needed was in the spilled file it couldn't read.

The fix splits the header and the notes into their own short text part, which stays inline no matter how big the tool text gets. The big tool text spills; the notes don't.

The lesson: anything the model needs to correctly *use* a result has to survive the result's own size management. If your resize/spill logic treats "the important metadata" and "the big payload" as one part, the spill will eat the metadata along with the payload. Split them. The notes are small. The payload is big. They should not share a spill fate.

**`13eb1904` — image-bearing results stay inside the turn budget, and refusals keep their content.** This commit fixed three things at once, and all three are budget-boundary bugs. First, `enforce_turn_budget` counted `len(content)` of every tool message. An image-bearing result reaches the budget enforcer as a part list, so `len()` counted parts, not characters. Six MCP results with screenshots, each ~60K chars of text, totalled ~18 "characters" and nothing was spilled. Part lists now count their text characters and spill their largest text part; images stay inline. Second, `_persist_multimodal_text_parts` spilled every text part under the same `tool_call_id`, so with a small `mcp_result_size_chars` budget the notes part overwrote the tool text's spill file. Each spilled part now gets its own id. Third, when `vision.max_calls_per_image` refused every image, the refusal lines were appended after the handler's JSON closing brace — broken JSON. Refusals now go inside the envelope's `result`.

Three bugs, one commit, one theme: the budget enforcer was written for text. It measured text. It spilled text. It counted text. The moment a result was a part list instead of a string, every assumption it made was wrong, and the wrongness was silent — the enforcer happily reported a tiny turn and let massive image-bearing results through. The lesson generalizes: any code that measures or limits content by length was written against an assumed shape. Change the shape (string → part list) and the measurement is now lying. Audit the measurer when you change the medium.

**`a3ab152c` — the incomplete-data notice survives.** When an MCP image result came back with an "incomplete data" notice (the server flagged that it didn't get the full image), that notice was being dropped from the envelope. The model would get a partial image with no indication it was partial. The fix preserves the notice in the envelope.

The lesson: provenance and caveats are part of the result, not metadata about it. If the server said "this is incomplete," that statement has to travel with the image to the model. Dropping it turns a known-incomplete result into an apparently-complete one, and the model will reason about the partial image as if it were whole. The failure is worse than not having the image at all, because the model doesn't know to be uncertain.

## The pattern, restated

The core fix is: an MCP tool returned an image, the model got a path instead of pixels, and the fix routes images through the gate that vision already used. That's the mechanism.

The pattern underneath it is the one I want you to take into your next review. A capability was added — MCP tools can return images. It was tested against the existing model path, which was text. It worked. Then it was routed against a vision model, and it didn't work, because the vision model needed something the text path never provided. The demo passed because the demo's model couldn't tell you the image was missing.

Six review commits later, the path is honest. But every one of those six fixes is a budget, context, slot, metadata, measurement, or provenance bug that the first cut left in — and every one of them was silent until the path ran under a vision model under real load.

When you review a new multimodal path through a runtime built for text, ask these six questions:

1. **Does the new producer check in to every shared budget?** (The vision call budget, the result-size budget, the turn budget.)
2. **Does the context survive the thread boundary?** (Pool workers are fresh frames.)
3. **Does the skip path release what the happy path reserves?** (Skipped images still hold slots.)
4. **Does the metadata the model needs to use the result survive the result's own size management?** (Coordinate maps, scale notes, provenance.)
5. **Does the measurer still measure correctly when the medium changes shape?** (`len()` on a part list is not `len()` on a string.)
6. **Do caveats travel with the content?** (An incomplete-data notice dropped is a silent lie.)

The boundary doesn't care that your demo passed. The demo passed because the demo's model couldn't see what was missing. Run it against the model that can.

— Paula Rossi, *The Review*