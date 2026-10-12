---
slug: "2026-10-12-four-buckets-before-you-spawn"
title: "How to sort the pile into four buckets before you spawn an agent"
excerpt: "Daily AI use is not a management system. Sort the open list into four lines, and spawn an agent only from the line that already has a name."
date: "2026-10-12"
author: "Gabriel"
authorKey: "gabriel"
series: "clearinghouse"
categories: ["Operations", "Multi-agent"]
tags: ["triage", "ownership", "multi-agent", "delegation"]
readTime: 6
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-12-four-buckets-before-you-spawn"
---

Using AI every day doesn't make you an AI leader. It makes you a power user.[2]

Scott Amenta wrote that on 13 May 2026.[2] The page draws on a sample of 250-plus chiefs of staff and senior operators, and he says it isn't a consumer poll.[2] It's a specialized executive sample, built for depth, not breadth.[2] On that diagnostic, 86% use AI daily across multiple tools.[2] 5.2% have agents actively managing part of the project workflow.[2] The other 92.7% are using AI. They haven't become what he calls Chief of AI.[2]

If you're in the big number, don't open with a spawn. Sort the open list into four lines first.

## four lines, then stop

Chief of Staff Network published the sort on 19 January 2026.[1] The byline is the network. No person is named on the page.[1] They describe a chief of staff whose project tracker had dozens of items, none with clear owners or deadlines.[1] That's their illustration. Don't paste it onto your week.

Their daily prompt uses four categories.[1] Urgent, needs the CEO today. Important, you should handle it this week. Delegate, someone else should own it. FYI only.[1]

Write those four lines on your own list before you open a chat.

Line 1 is the principal today. Their category is urgent, and it needs the CEO.[1] If your principal has a different title, it's still the person who has to decide today. Don't send an agent to draft around that decision.

Line 2 is you this week.[1] You close it. The healthy version on their page closes loops by owning outcomes, not calendars, and drives work to done rather than scheduled or discussed.[1]

Line 3 is a named owner. Their wording is someone else should own this.[1] For that category, they tell you to suggest who should own it.[1] Someone else is not a name. If you can't name them, it isn't delegated. It stays with you.

Line 4 is FYI only.[1] Don't schedule it. Don't put it on a board and call it in progress.

No name and no deadline means the item looks like the tracker in their illustration.[1] It is not in progress.

Their plan sequences the rest. Week 1 is just triage.[1] Set up the daily categorization habit.[1] Don't add anything else yet.[1] Week 2 adds the follow-up infrastructure.[1] Week 3 is the dashboard. They call that step build visibility.[1] Week 4 tackles meetings.[1] Do the sort for a week before you add those.

They say the habit takes less than 10 minutes a day.[1] That's their timing, not a clock on your inbox.

## review it before you act

If you hand the pile to a model, keep their warnings. AI triage isn't infallible. It doesn't understand political context.[1] Your CEO might need you to drop everything for something the model marked low priority, because it involves a board member's pet concern or a relationship that needs protecting.[1] Always review before acting.[1]

Board materials, sensitive HR issues, and proprietary strategy stay out of third-party AI tools unless you're on an enterprise version with the security controls.[1] When in doubt, leave it out.[1]

Systems aren't a substitute for judgment.[1] The goal they name is to free up mental energy for the work that actually requires you.[1]

## spawn only from line 3

Line 3 is the only line whose definition is someone else.[1] That's the only line that gets an agent. If the owner is a person, suggest who should own it and write the handoff.[1] If the owner is an agent, write the packet before you launch.

Jeremy Hadfield, Barry Zhang, Kenneth Lien, Florian Scholz, Jeremy Fox, and Daniel Ford wrote the Research piece, published 13 June 2025.[3] Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries.[3] Without detailed task descriptions, agents duplicate work, leave gaps, or fail to find necessary information.[3]

They started with a short instruction, research the semiconductor shortage.[3] One subagent explored the 2021 automotive chip crisis. Two others duplicated work investigating current 2025 supply chains.[3]

Put a stop on the packet. They embedded scaling rules in the prompts.[3] Simple fact-finding requires just 1 agent with 3-10 tool calls.[3] A direct comparison might need 2-4 subagents with 10-15 calls each.[3] Complex research might use more than 10 subagents, and only with clearly divided responsibilities.[3] An early failure they name is spawning 50 subagents for simple queries.[3]

Those numbers are rules they put in a prompt for their Research system. They are not a measurement of your fleet.

Write the result to a file. Their lead writes the plan out, because if the context window exceeds 200,000 tokens it will be truncated.[3] They tell you to implement artifact systems, so the output persists without passing through the coordinator.[3] They call the pass-it-up version a game of telephone.[3] The parent's summary is not the record.

## the sort is not the system

54% of Amenta's sample write detailed prompts and iterate on outputs, and he calls that real skill.[2] He also says there's a big difference between prompting well and building systems.[2] Connecting tools, multi-step automations, and agents on recurring workflows is the ceiling he names.[2] Most people in that sample haven't gotten close to it.[2] 12.5% connect AI into multi-step workflows.[2] 7.3% scored as AI-Native.[2] His definition is operators who have built systems where AI runs continuously, surfaces insights they'd otherwise miss, and manages parts of the workflow without them.[2]

Pasting the four-category prompt into a chat is still daily use.[2] You have not put an agent on a recurring workflow.[2] If line 3's only agent is you prompting, move it back to line 2. You are still the owner.

He names three risks to manage: hallucination, data exposure, and over-reliance.[2] The briefing is a point of view, not a summary of what's out there.[2] If none of those risks has a name next to it, that item needs the principal today. Don't spawn a research pass and call the risk owned.

His Chief of AI is three things at once.[2] Nobody hands out that mandate.[2] The first question he gives you is where human judgment is genuinely required, and where you're doing something an agent could do better.[2] The four lines are that question, written on a list. The other two, a real workflow and a point of view, wait until the sort is a habit. That's the week-1 rule on the other page.[1]

Don't quote 86% or 5.2% as a fact about your team.[2] He already said the sample isn't a census.[2]

## what to do next

Take the open list and write four lines: principal today, you this week, a named owner, FYI.[1]

Move anything without a name and a deadline off in progress.[1] If a model helped you sort, read the four lines yourself before you act.[1] Leave the sensitive pile out.[1]

Spawn only from line 3, and only after the owner is a name. If that owner is an agent, the packet has an objective, an output format, the tools and sources, a boundary, and a stop.[3] One agent for a fact. 3 to 10 tool calls.[3] Don't open with 50.[3]

Write the output to a file before you close the run.[3] Then stop. Their week 1 says don't add anything else yet.[1] The follow-up tool, the dashboard, and the meeting notes wait until the sort has been the habit for a week.[1]

## Sources

[1] https://www.chiefofstaff.network/blog/from-radar-jammer-to-air-traffic-controller-use-ai-to-stop-scrambling-signals-and-start-orchestrating-success — From Radar Jammer to Air-Traffic Controller
[2] https://www.chiefofstaff.network/blog/ai-era-chief-of-staff-chief-of-ai-2026 — The AI-era Chief of Staff
[3] https://www.anthropic.com/engineering/multi-agent-research-system — How we built our multi-agent research system
