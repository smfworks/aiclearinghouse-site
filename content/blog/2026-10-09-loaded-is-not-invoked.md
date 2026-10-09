---
slug: "2026-10-09-loaded-is-not-invoked"
title: "Loaded is not invoked. Invoked is not applied."
excerpt: "The AX Practitioner Playbook, published 9 October 2026, treats a headline score as unfinished work. Subtract the bare baseline, then split the miss into discovery, invocation, or application."
date: "2026-10-09"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-10-09-loaded-is-not-invoked"
categories: ["Microsoft", "AI Agents"]
tags: ["Agent Experience", "GitHub Copilot", "evaluation", "skills", "Microsoft DevRel"]
readTime: 11
image: "/images/blog/2026-10-09-loaded-is-not-invoked-hero.png"
---

Microsoft published the Agent Experience Practitioner Playbook this morning. Waldek Mastykarz's post on Microsoft for Developers carries `article:published_time` of 9 October 2026, 09:44 UTC, and the page itself says October 9th, 2026. The useful claim is not the download link. A skill that loaded is not a skill the agent used, and a skill the agent used is not a skill it applied correctly.

If you own an SDK, a CLI, an MCP server, a skill, or the docs behind them, that split is the job. A failed readout does not mean "write another skill." It means find which stage broke, change that surface, and rerun the same evaluation before you ship new wording because it sounds better.

I did not run an evaluation this morning. I followed the links and read the method. `aka.ms/ax-playbook` returns a 301 to `github.com/microsoft/scope`, path `docs/ax-playbook/ax-playbook.pdf`. The file I downloaded is 39 pages, 423,147 bytes, author Microsoft, created 8 October 2026 at 09:53 EDT. The cover line is "aka.ms/ax-playbook, v1.0 October '26." `aka.ms/ax-playbook/skill` returns a 301 to `docs/ax-playbook/ax-practitioner`. The `SKILL.md` on that tree is 9,894 bytes, and its first rule is that the playbook is the only source. The blog's "46 improvements" to the Azure Cosmos DB Agent Kit matches a GitHub search I ran against closed issues labeled `SCOPE` in `AzureCosmosDB/cosmosdb-agent-kit`: `total_count` 46, `incomplete_results` false. The first issue the API returned is a package correction, not a model review: use `Microsoft.Azure.Cosmos`, not the abandoned `Azure.Cosmos` v4-preview.

That is the artifact. Use it as a subtraction, not as a headline score.

## A score without a bare baseline is a story

Chapter 2 is blunt about what an evaluation can hide. The playbook says Microsoft has seen perfect scores for code that never compiled, because nobody tried to build it. It has seen a "used Platform X" check pass whether or not the agent used Platform X, because the check matched the words. A confident wrong result is worse than no result, because you will act on it.

The evaluation is four objects.

A scenario is the prompt a developer would type. No scoring rubric, and no hint about the right answer. If your developers type vague prompts, that is the prompt you test. Propensity is discovery when the prompt does not name the product. Efficacy is correct use once it does. A new product starts on the first. A known product starts on the second.

Criteria judge meaning: pass, fail, or skip. Gates are separate. They are mechanical, they stack, and each one runs only if the previous one passed. First, did the agent pick the right technology? If you asked for Cosmos DB and it built on MongoDB, nothing else is worth measuring. Then build, then tests if you have them, then run, then deploy. Deploy is last. Skip the gates and you get the lie the playbook is trying to kill: a perfect criteria score for a project that does not compile.

A profile is the environment: operating system, harness, model and its settings, and the extensions loaded, including versions. One harness the playbook names is GitHub Copilot in Visual Studio Code. Two surfaces from the same vendor can run different harnesses, so a strong result on one does not carry to the other even on the same model. Run the profile your developers actually use.

The comparison is a subtraction. Pass rate with the extension, minus pass rate of the bare baseline. Bare means harness plus model, no extensions. That difference is lift, or it is drag. If the bare profile scores 4 out of 5 on a criterion and the skill profile scores 2 out of 5, the skill is making things worse. Calling the tool is not success. If the numbers do not move, the extension is token cost without benefit.

Run each scenario-profile pair at least five times. Five runs will not give you statistical significance. A fail once in five is variance. A fail five times in five is a problem you can fix. Do not treat one run as a finding.

Count cost per task, not token count. The playbook's trap is a profile that lifts quality at three times the price. That figure is the shape of the trap in Chapter 2, not a result from a named run, and not a number I measured.

| Readout | What the playbook says to do |
| --- | --- |
| 5 of 5 on a criterion | Strong. Keep the trajectory anyway. |
| 2 of 5 or 3 of 5 | The agent is on the edge. A small source change can tip it. |
| 0 of 5 across profiles | A gap no extension is filling. |
| Bare beats the extension | Active drag. Investigate before you add anything. |
| Similar quality, large cost gap | Expense without value. |

Chapter 8 says the readout cannot tell you why. Keep the trajectory: every tool call, every file read, every decision. ATIF, the Agent Trajectory Interchange Format, is one way to store it. Without that record you will fix the wrong thing.

## Three misses, three fixes

Chapter 9 splits a failure into three stages, and the fixes are not interchangeable. Discovery means it never entered context. Invocation means it loaded and the agent did not call it. Application means it was called and applied wrong. Chapter 10's table says where to look first. I shortened the row labels. The instruction under the table is the one worth keeping: change one surface at a time and rerun. Otherwise you will not know which change caused the result.

| What you observe | First surface to inspect |
| --- | --- |
| The extension never loads | Packaging, registration, startup, harness limits |
| It loads and is never invoked | Tool or skill name, description, vocabulary |
| It is invoked and the output is wrong | Returned content, response shape, docs, instructions |
| The agent edits files instead of running the CLI | Docs examples, tool response, CLI output format |
| The full stack is worse than baseline | Overlapping descriptions, conflicting guidance, context cost |
| The agent confidently uses an old version | Docs versions, deprecation signals, runtime version resolution |

Pattern 3 is the one teams skip. The agent already has a plan before it reads your content. It treats docs as confirmation, not instruction. The playbook's SPFx case is specific. Docs included a tip pointing developers to the CLI for Microsoft 365 with the exact upgrade command. No run used the CLI, because the agent had already formed a plan from training data. Replacing the tip with a warning that manually updating `package.json` alone will result in build failures, and rewriting the migration guide, made every run use the CLI. The agent did not need encouragement. It needed the existing plan invalidated. Use that move sparingly. If you put plan-breaking language everywhere, it becomes noise.

Pattern 5 punishes "install everything." The playbook says they measured it: loading several overlapping extensions for the same platform used 4 times the tokens and produced the worst results across 2 of 3 scenarios. None of those extensions was the problem alone. For a team starting out, bare plus one extension is enough.

Two quieter misses are not model failures. An example that hardcodes `npm install @azure/cosmos@4.1.0` becomes the version the agent installs, because retrieved content is treated as authoritative. SPFx notes named `release-1.22.md` looked, to an agent hunting 1.22.2, like the page already covered that version. Renaming the file to `release-1.22.0.md` made the gap obvious. Before the change, none of the four runs that read the notes continued to the 1.22.2 page. After it shipped, 4 of 5 runs did. That is a filename, not a new skill. The deprecation line the playbook wants in sources you control is "DEPRECATED: Do not use X. Use Y instead." An extension is a bridge while that ships, not a substitute.

## Write the criterion yourself, then lock the version

Do not hand the model your scenarios and ask it to generate the criteria. Chapter 5 lists three failure modes. The model's knowledge cutoff bakes stale patterns into what you are measuring. It cannot know what you actually care about. And what it writes is either biased, when the same model also judges, or too vague for a different judge to score the same way twice. Draft the criterion yourself. Then you may ask a model whether the wording is ambiguous. That is a different job.

The playbook walks one criterion through three drafts. "Uses current SDK version" means nothing to the judge. "Uses `@azure/cosmos`" is better, and still ambiguous about prereleases. The third draft names the bounds. Passes: `package.json` specifies a stable version from 4.0.0 up to, but not including, 5.0.0. Fails: an earlier major, a prerelease, or the deprecated `documentdb` package. Skipped: the application does not use Cosmos DB.

Each criterion needs those four fields: what you are checking, what passes, what fails, and when to skip. Split a sentence that checks SDK, authentication, and error handling into three criteria. If you would not accept "correct," "current," or "best practices" in a code review, do not put those words in a criterion. Do not penalize the agent for a tool the harness never loaded.

Calibrate against a known-good artifact and a known-bad one, score the same artifacts more than once, and keep those runs out of the production numbers. Once the set is locked, do not rewrite it because a score surprised you. When the product changes what "correct" means, version the criteria set and keep old results tied to the version that produced them. A different criteria version is not a trend. A judge-model change is the same kind of boundary.

## Ship the source change, not a new layer

Chapter 11 is what keeps this from becoming a scoreboard. An evaluation has no impact until someone changes the source of the behavior.

If you own the surface, start with failures that stop the agent from selecting the technology at all. Then active drag, where an extension loses to the bare baseline. Then the inconsistent 2-of-5 and 3-of-5 results, because the agent is close. Trace each result to a surface you control. Do not build another extension on top of a source problem. Everyone without the new extension stays on the broken path.

Treat the change as a hypothesis. Change one thing. Rerun the same scenarios and profiles. Compare with the original baseline. If it does not improve the outcome, do not ship it because the new wording sounds better.

If you do not own the surface, bring the bare baseline, not a verdict. Waiting for the next model leaves today's experience unchanged. The PDF says a knowledge cutoff is a poor proxy, and that a newer model can know less about a technology than its predecessor. Test the baseline. The smallest useful demo is to intercept the agent's requests, serve the modified content, and show whether the result gets better, more consistent, or cheaper before anyone commits a change.

A public issue needs the scenario, the profile, the criteria, the run count, the results, a minimal reproduction, and the baseline. Strip credentials from trajectories. If nothing can move, revisit in two to three months. A temporary skill is a labeled bridge with a retirement condition, not a second product. Scope, from Microsoft DevRel, implements the method. You do not need it if your runner already resets each run, repeats the pair, separates gates from the judge, and keeps the trajectory.

## The 95% is about the skill, not your SDK

The same post releases the AX Practitioner skill. I read `SKILL.md` on `main`. It answers from verbatim chapter fragments, cites the chapter, and stops to ask before it uses any other source when the fragments do not cover the question. The blog says that across 330 questions, its answers scored 95% on average against what the playbook says. That sentence is about the skill's fidelity to the PDF. It is not a score for Cosmos DB, SPFx, or any SDK you ship.

The skill is instructed, for "which model is best," to report only what the playbook measured. The SPFx filename change and the CLI warning are cases in the PDF. They are not a ranking of models.

I have not installed the skill in an agent session, and I have not run Scope. If you already have a trajectory where the extension loaded and the agent never called it, which words in the tool description failed to match the prompt the developer actually typed?

## Sources

- Waldek Mastykarz, "Introducing the Agent Experience (AX) Practitioner Playbook," Microsoft for Developers, published 9 October 2026, 09:44 UTC. [devblogs.microsoft.com](https://devblogs.microsoft.com/blog/introducing-the-agent-experience-ax-practitioner-playbook/)
- Microsoft, *The Agent Experience Practitioner Playbook*, v1.0 October 2026. PDF created 8 October 2026, 09:53 EDT, 39 pages. [aka.ms/ax-playbook](https://aka.ms/ax-playbook)
- AX Practitioner skill, `SKILL.md` on `microsoft/scope` `main`. [aka.ms/ax-playbook/skill](https://aka.ms/ax-playbook/skill)
- Closed issues labeled `SCOPE` in `AzureCosmosDB/cosmosdb-agent-kit`. GitHub search `total_count` 46 at the time of this run. [Issue search](https://github.com/AzureCosmosDB/cosmosdb-agent-kit/issues?q=is%3Aissue+state%3Aclosed+label%3ASCOPE)
