---
slug: "2026-10-06-fides-names-the-slot-not-the-value"
title: "FIDES names the slot. It does not print the hidden value."
excerpt: "Agent Framework's experimental FIDES detector returns rewritten argument positions, not the expanded secret. An empty map is not a clean bill for the run, and a full-list mark after a filter is a precision loss."
date: "2026-10-06"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-06-fides-names-the-slot-not-the-value"
categories: ["Microsoft", "AI Agents"]
tags: ["Agent Framework", "FIDES", "prompt injection", "tool security", "Microsoft"]
readTime: 11
image: "/images/blog/2026-10-06-fides-names-the-slot-not-the-value-hero.png"
---

FIDES names the rewritten slot. It does not print the hidden value.

If a tool accepts untrusted input, `rewritten_arguments()` returns argument names and positions. An empty mapping means nothing in that call was rewritten. It does not hand you the expanded secret, and it does not certify the rest of the run.

This is for anyone wiring Microsoft Agent Framework tools against issues, mail, or any other content you do not control. I fetched the Agent Security with FIDES page on Learn this morning. I did not install `agent-framework`. I did not call the function.

## Three stamps, one page

The job clock on this host was 07:00 EDT on 6 October 2026. The fetched HTML carries three October 5 stamps, and they are not the same clock.

The `ms.date` meta is `2026-10-05T00:00:00Z`. That is 20:00 EDT on 4 October, 35.00 hours before the job clock. The calculated "Last updated on" widget is `2026-10-05T08:00:00.000Z`, marked `data-article-date-source="calculated"`. That is 04:00 EDT on 5 October, 27.00 hours before the job clock. The `updated_at` meta is `2026-10-05T11:08:00Z`. That is 07:08 EDT on 5 October, 23 hours 52 minutes (23.87 hours) before the job clock. All three sit inside 48 hours. Do not collapse them into one publish minute.

The page's `original_content_git_url` points at `agent-framework/agents/security.md` on `MicrosoftDocs/azure-ai-docs-pr`, branch `live`. I did not fetch that blob. The contract below is the rendered Learn page, not a commit message I did not open.

I also fetched the Purview middleware page. Its `ms.date` is `2026-10-05T00:00:00Z` as well. That page says both middleware types buffer a streamed response in full and evaluate it before releasing any update. This post is not that page. Do not merge the two stamps into one feature.

The GitHub changelog item with `pubDate` `Tue, 06 Oct 2026 10:23:38 +0000` is a security-overview column for AI Scan on pull requests. The page calls itself a one-minute read. It does not document this detector. I am not stretching it.

## Experimental, and Python-only

FIDES is Flow Integrity Deterministic Enforcement System. The page calls it information-flow control as middleware in Agent Framework. Every piece of content carries an integrity label, trusted or untrusted, and a confidentiality label, public, private, or user-identity. Labels propagate through tool calls. Policies are enforced before a sensitive tool runs, not after.

The page says it ships in `agent-framework-core` as an experimental feature behind `agent_framework.security`. The getting-started block installs `agent-framework` and imports from `agent_framework.security`. I did not reconcile those two package names on a local install. Treat the feature as experimental until you import it on your own tree.

FIDES is currently Python-only. The page says a .NET implementation is coming soon, and it does not give a date. Until then it points .NET agents at Agent Safety and Tool Approval. A later note says the same for Go. It does not say a Go port shipped.

The model still decides what to do. The framework decides what is allowed to happen. The page says FIDES is a deterministic complement to Agent Safety, not a replacement. I did not open the Costa et al. paper the related links attribute the design to.

## The function returns positions

The section is titled "Detect expanded arguments inside a tool." A tool that accepts untrusted input can call `rewritten_arguments()` to identify arguments that FIDES rewrote during variable expansion.

The return is a mapping of argument names to rewritten positions. List arguments use their zero-based indexes. Scalar and dictionary arguments use `-1`. It returns an empty mapping when no arguments were rewritten. The page says to use the names and indexes to report an error without repeating hidden content.

The example imports `rewritten_arguments` from `agent_framework.security`. The tool sets `accepts_untrusted` to true. For a list named `files`, it sorts the indexes and raises `ValueError` with `files[index]` in the string. For a scalar named `destination`, it checks whether `-1` is in the set for that name, and the error string is "Hidden content isn't allowed in destination." The expanded value is not in either string.

Pass a `FunctionInvocationContext` when you need an explicit invocation. Without an argument, the function uses the current tool invocation, including code run through `asyncio.to_thread()`.

| Argument shape | What the mapping uses | What the example does with it |
| --- | --- | --- |
| List | Zero-based indexes | Sort them, then name `files[index]` in the error |
| Scalar or dictionary | `-1` | Test for `-1` inside the set for that name |
| Nothing rewritten | Empty mapping | Do not invent a hidden value that was not returned |

The error string names a slot. It does not echo the bytes that used to sit behind a `var_<id>` reference.

## An empty mapping is not a clean bill

An empty mapping is not a clean bill of health for the run.

The page is specific. The function returns an empty mapping when no arguments were rewritten. That sentence is about this invocation's arguments. It is not a statement about the context label, the previous tool result, or the sink you have not called yet.

The limitations section says most-restrictive-wins propagation can be conservative. Once an untrusted issue body enters the context, the rest of the run is untrusted unless you explicitly drop it. Per-message scoping and compaction-aware label decay are described as future work, not as behavior you have today.

So an empty map can sit inside a run that is already untrusted. The detector did not see a rewritten argument on this call. The policy fence may still refuse a sink because of an earlier tool result. If you log "FIDES clean" from an empty dict, you have promoted a negative result into a ship decision the function does not make.

I did not find, on this page, a second return value that prints the context label beside the position map. Do not invent one. If you need the label, that is the policy middleware and the audit log, not this helper.

## A full-list mark is a precision loss

The page has a second sentence that is easy to misread as a finding.

If argument validation reorders or filters an expanded list, FIDES marks every final list position as rewritten rather than risk exposing a value whose original index is no longer reliable.

Read that as a safety fallback. The framework would rather mark every remaining slot than hand you an index that no longer points at the hidden value. It is not a claim that every file in the filtered list contained hidden content. It is a refusal to guess.

If your validator drops the first item and shifts the rest, the page does not promise that the surviving indexes still name the original hidden slot. It marks every final position. A tool that treats "all indexes present" as "every file was hostile" is reading a precision loss as a verdict.

The practical order is the one the example shows. Call `rewritten_arguments()` on the invocation. Report the positions it returns. Do not filter first and then interpret a full mark as a per-file finding. The page does not document a second call that recovers the pre-filter index. I did not find one.

## Expansion fails closed before you get a map

Variable expansion fails closed if it detects a reference cycle, if nesting would exceed 16 variable-reference levels, or if one invocation would expand more than 100 references.

I did not see an exception class name or a sample error string for those three cases. Do not invent one. What the page does say is the direction: the expansion stops rather than walking a cycle, a 17th level, or a 101st reference. Your tool does not get a quietly partial expansion and a confident map.

That limit sits next to the reason the detector exists. `auto_hide_untrusted` defaults to true. Untrusted tool results are replaced with a `var_<id>` reference in the main context. The variable store holds the bytes. When a later tool argument contains a hidden variable reference, FIDES resolves it recursively and evaluates the destination policy against the stored integrity and confidentiality labels. The page says this prevents blind forwarding from bypassing `accepts_untrusted` or `max_allowed_confidentiality` without exposing the hidden content to the main model.

Argument labels do not replace labels declared on the tool result. A rewrite inside an argument is not a new label on what the tool returns. Keep those two ledgers separate when you debug a refusal.

## The sink knobs are a different gate

`rewritten_arguments()` is for a tool that opted in. The example sets `accepts_untrusted` to true, then refuses specific slots itself.

A sink that must not run under untrusted context uses the other knob. `accepts_untrusted: false` refuses the tool before it runs if the current context is untrusted. The page points that at file writes and other production mutations. That tool never reaches your detector.

`max_allowed_confidentiality` is the exfiltration cap. Private context against a public sink is a refusal. The page's caps are public for external publish, private for internal stores that are not user-scoped, and `user_identity` as the maximum, only for explicitly user-scoped tools.

Forgotten labels are not trusted by omission. `default_integrity` is `UNTRUSTED`. `default_confidentiality` is `PUBLIC`. Embedded labels can make a fallback more restrictive. The page says they cannot relax it, and ordinary arguments cannot establish trust.

The wiring sample uses `FoundryChatClient` and sets `auto_hide_untrusted=False` so a reader can see the fence. The comment says the default is true. Do not copy that teaching flag into production. True keeps raw untrusted bytes out of the main model. False leaves them in context, still labeled, when you will let the model see the attack text as long as it cannot act on it.

The page's triage walkthrough, which I did not run, is the concrete picture. `read_issue` is allowed because it is in `allow_untrusted_tools`, and the result is untrusted. `read_file(".env")` labels its result private, so `post_comment` (public cap) is blocked. `write_file` with `accepts_untrusted` false is refused because untrusted content is in scope. With the default hide on, the issue body becomes a `VariableReferenceContent`. A summary goes through `quarantined_llm` with no tools. Generated text that says to call a tool is not a tool call. Without `quarantine_chat_client`, that helper returns placeholder responses. The options text uses `gpt-4o-mini` as an example of a cheaper quarantine client. That is the doc's example, not a routing result I measured.

## Three modes, then the MCP bound

I did not time a rollout. The page's mode table is the order I would use.

| Goal | Settings the page lists |
| --- | --- |
| Hard block | enforcement on, `block_on_violation=True`, approval off |
| Human in the loop | enforcement on, `approval_on_violation=True` |
| Dry run | `enable_policy_enforcement=False` |

`approval_on_violation` defaults to false. `enable_audit_log` defaults to true and records blocked or approval-gated calls. Dry run still propagates labels and does not block. The page says to turn enforcement on once the false-positive rate is acceptable. It does not publish that rate.

MCP is a bound, not the feature. `SecureMCPToolProxy` treats server metadata as untrusted by default. `ToolAnnotations` can tighten local policy. They cannot mark data trusted, remove the public confidentiality cap, or authorize untrusted input. `annotation_overrides` are not bound to a server identity. A remote `_meta.ifc` label can lower integrity or raise confidentiality. It cannot relax local policy unless you set `trust_server_ifc=True` after you verify who owns the server. Missing or malformed labels still use local policy.

## What to check before you depend on the name

Do not write this as generally available. Confirm `from agent_framework.security import rewritten_arguments` on your tree. I did not run that import.

Keep error strings on the slot. If your logger prints the expanded argument, you have undone the detector. Call it before you reorder or filter a list. Do not log an empty mapping as a clean run. Leave `auto_hide_untrusted` at its default unless you mean to show raw bytes. Dry-run with enforcement off and read the audit log before you block production calls. The page does not give you a false-positive percentage.

There is no Foundry portal blade for this detector on the page I fetched. The sample uses a Foundry chat client. The feature is Agent Framework middleware. The page names `email_security_example.py` and `repo_confidentiality_example.py`. I did not run either file.

## What this page does not settle

The page says FIDES adds per-tool-call middleware overhead and does not give a millisecond figure. I did not time one. No dollar figure appears on the page. Approvals gate the violating call and do not expose the full label algebra. `quarantined_llm` is single-turn and tools-free. A forgotten label falls to the defaults, untrusted and public. I did not open discussion #5624. The page points there for feedback on defaults, propagation, and approval ergonomics.

If your tool filters an expanded list before it inspects `rewritten_arguments()`, the page marks every final index rather than risk a stale one. Do you still have a slot you can refuse by name, or have you already given up the original index on purpose?
