---
slug: "2026-08-08-skill-md-custom-skills-powerpoint-copilot"
title: "Custom Skills with SKILL.md in Microsoft 365 Copilot for PowerPoint"
excerpt: "Microsoft 365 Copilot now supports user-defined custom skills stored as SKILL.md files in OneDrive. Learn the exact frontmatter format, creation workflow, @mention invocation, and how this extends the reusable skills pattern across Copilot Studio, Agent Framework, and Foundry for consistent, governed productivity in presentations."
date: "2026-08-08"
author: "Jeff"
authorKey: "jeff"
series: "clearinghouse"
canonicalUrl: "https://www.smfclearinghouse.com/blog/2026-08-08-skill-md-custom-skills-powerpoint-copilot"
categories: ["Microsoft", "AI Agents", "Microsoft 365"]
tags: ["Microsoft 365 Copilot", "PowerPoint", "SKILL.md", "Custom Skills", "Agent Skills", "OneDrive", "Productivity", "Copilot Studio"]
readTime: 14
image: "/images/blog/2026-08-08-skill-md-custom-skills-powerpoint-copilot-hero.png"
---

Microsoft 365 Copilot in PowerPoint now supports personal custom skills defined in SKILL.md files stored in OneDrive. This brings the reusable instruction pattern—already central to Copilot Studio agents and Microsoft Agent Framework toolboxes—directly into the presentation workflow where many knowledge workers spend their days.

The feature rolled out starting late July 2026 for PowerPoint for the web (with desktop and other clients following platform patterns). Users create a folder containing a `SKILL.md` file, upload it via the Copilot pane or directly to OneDrive, and then invoke the skill by name or through the Choose skills menu. No admin action is required.

This is more than a convenience. It formalizes how domain expertise and repeatable presentation tasks become portable, versionable, and composable instructions that the underlying model applies consistently.

## What SKILL.md Delivers in PowerPoint

A skill is a reusable, instruction-based capability that gives Copilot in PowerPoint domain expertise or a specific workflow. Instead of re-explaining the same process in every prompt ("always use our brand colors, put the summary on slide 2, follow the executive template"), you encode it once.

Key benefits observed in the Microsoft ecosystem:

- **Consistency**: The same instructions produce similar structure and tone across decks.
- **Speed**: Common tasks (executive summaries, theme application, accessibility passes) become one-line or menu selections.
- **Personalization**: Skills live in your OneDrive Skills folder and are private by default.
- **Iterability**: Edit the markdown, refresh in Copilot, and the change takes effect immediately.

The implementation follows the industry standard documented at agentskills.io/specification, the same foundation used by Copilot Studio skills and emerging patterns in Agent Framework.

## The Exact SKILL.md Format

Each skill lives in its own folder. The folder name must match the `name` value in the frontmatter. Inside the folder is a single required file: `SKILL.md`.

The file has two required sections separated by `---`:

**Frontmatter (YAML between the delimiters):**

- `name`: The identifier used for @mentions and menu display. Use kebab-case or clear words.
- `description`: A concise statement telling Copilot *when* to use this skill. This is critical for automatic selection and the Choose skills experience.

**Body (everything after the second `---`):**

Free-form instructions. Use markdown headings, numbered steps, examples, and constraints. The more precise and example-rich the body, the better the model follows the intent.

Example from the official guidance for a simple executive summary skill:

```markdown
---
name: create-executive-summary-slide
description: Use when I ask Copilot to create an executive summary slide of a given deck. After the summary is created, add it to a new slide.
---

# Create Executive Summary

When Copilot creates executive summary content, add it to a new slide and follow the design style of the existing presentation.

## Steps
1. Create the summary as requested.
2. Analyze design style of existing deck (colors, fonts, layout density).
3. Add summary in a new slide but following the existing presentation design style.
4. Keep the summary concise (bullet points or short paragraphs) and place it early in the deck unless instructed otherwise.
```

You can add more structure: "Do not invent data", "Always cite the source slide numbers in speaker notes", "Use the organization's approved color palette from the brand kit if available".

## How to Create, Upload, and Manage Skills

There are three primary paths, all resulting in the skill appearing in your personal OneDrive Skills folder.

**Path 1: Upload directly in the Copilot pane (fastest for testing)**

1. Open a presentation in PowerPoint for the web.
2. Open the Copilot pane.
3. Select the **+** menu in the prompt field → **Choose skills**.
4. Scroll to the bottom and select **Manage skills** → **Add skill**.
5. Upload or drag the folder (or the SKILL.md inside) or paste the content.
6. Copilot saves it to OneDrive and makes it available immediately.

**Path 2: Use the Add skill form**

In the same Add skill dialog, paste the full SKILL.md content. Copilot writes the folder and file for you.

**Path 3: Direct OneDrive management (best for iteration)**

1. In Copilot pane → Settings (...) → Manage skills → Custom skills → **Create OneDrive folder**.
2. Select **Open skills folder**.
3. In OneDrive, create a subfolder named exactly after the skill `name`.
4. Place `SKILL.md` inside it.
5. Back in Copilot, use **Refresh** in the Manage skills pane if the new skill does not appear.

**Managing skills at runtime**

- Open **Manage skills** to toggle individual skills on or off.
- Turning a skill off removes it from the default dropdown and prevents automatic use while keeping the file in OneDrive.
- Renaming the OneDrive folder or the frontmatter `name` requires a refresh; mismatched names are ignored.

## Invocation Patterns

Once uploaded:

- **Menu selection**: + → Choose skills → pick the skill → type your specific request.
- **@mention**: In the prompt box type `@create-executive-summary-slide summarize the Q3 results deck` .
- Copilot respects the description for context-aware activation even without explicit mention.

The skill instructions are combined with the current presentation context (slides, notes, selection) and any additional user prompt.

## How This Fits the Broader Microsoft AI Stack

The arrival of SKILL.md in PowerPoint is not an isolated Office feature. It is the latest surface for a consistent "skills as instructions" pattern across the Microsoft AI portfolio:

| Surface              | Skill Mechanism                  | Typical Author          | Primary Use Case                     |
|----------------------|----------------------------------|-------------------------|--------------------------------------|
| Copilot Studio      | Skills (often SKILL.md or visual) | Makers / low-code      | Agent behavior, tool calling, workflows |
| Microsoft Agent Framework | Skills + Toolboxes             | Developers             | Multi-agent orchestration, MCP tools |
| Microsoft Foundry   | Toolboxes, Routines, Skills     | Pro devs + ops         | Production agents, governed execution |
| PowerPoint Copilot  | User SKILL.md in OneDrive       | Knowledge workers      | Presentation-specific repeatable tasks |

This convergence means a skill written for PowerPoint can inspire (or be adapted from) a more powerful agent skill in Copilot Studio or a toolbox entry in Foundry. The frontmatter + instruction body pattern is the common language.

For organizations already investing in Microsoft Agent Framework declarative workflows or Foundry hosted agents, PowerPoint SKILL.md provides a lightweight on-ramp for end users to capture tribal knowledge that later feeds into governed agent definitions.

## Practical Examples to Build Today

**1. Executive Summary Generator** (shown earlier)

**2. Brand-Compliant Theme Applier**

```markdown
---
name: apply-brand-theme
description: Apply the organization's approved brand colors, fonts, and layout conventions to new or existing slides.
---
# Apply Brand Theme

1. Retrieve the current brand kit guidance (colors: primary #003366, accent #00A3E0; fonts: Segoe UI / Calibri).
2. Update slide master or individual slides to use these values.
3. Ensure charts use brand palette and high contrast.
4. Add subtle footer with approved logo placement if the deck does not already contain it.
5. Never override user-specified exceptions unless explicitly asked.
```

**3. Accessibility Pass**

A skill that walks through alt text, reading order, color contrast, and caption recommendations, then proposes fixes as new slides or notes.

**4. Data-to-Chart Recommender**

"Given selected data or a table, recommend the best chart type for the story, create the chart, and write accompanying speaker notes that highlight the insight."

These skills compound. A user can chain them: first apply brand theme, then generate executive summary, then run accessibility pass.

## What to Do This Week

1. Create your Skills folder via the Manage skills flow.
2. Write one SKILL.md for the task you explain to Copilot most often.
3. Test it on three different decks.
4. Refine the description and steps based on results (add "always preserve existing speaker notes" or "limit to 5 bullets").
5. Share the folder structure with a colleague (copy/paste the folder) so they can adopt it quickly.
6. Consider extracting the most valuable personal skills into a small team library that can later be turned into Copilot Studio declarative agents or Foundry toolboxes.

## Troubleshooting

- **Skill does not appear**: Refresh in Manage skills. Confirm the folder name exactly matches the `name:` value (case sensitive in some contexts).
- **Wrong behavior**: Strengthen the description and add negative examples ("Do not add a title slide unless asked").
- **OneDrive sync delay**: The skill is local to your account; allow a moment after upload or edit.
- **Desktop vs web**: The initial rollout emphasized web; desktop clients surface the same OneDrive-backed skills as they update.
- **Format issues**: The frontmatter must be valid YAML between the first two `---` delimiters. Use simple key: value pairs.

## Sources

- Microsoft Support: "Use custom skills with Copilot in PowerPoint" — detailed UI flows and format specification (https://support.microsoft.com/en-us/powerpoint/copilot/copilot-in-powerpoint-skills)
- Microsoft 365 Message Center MC1434580 — "Use OneDrive stored user defined custom skills in PowerPoint Copilot (web)", rollout late July 2026, no admin action required.
- Microsoft Tech Community: "What’s New in Microsoft 365 Copilot | July 2026" — context on rollout timing and related skills features.
- Agent Skills Specification (referenced by Microsoft documentation): https://agentskills.io/specification
- Related platform context: Microsoft Agent Framework orchestration patterns, Foundry Toolboxes (July 2026 DevBlog), and Copilot Studio skill authoring experiences.

This capability lowers the barrier to capturing and reusing expertise exactly where the work happens. In the Microsoft ecosystem, skills written once in the right format become portable across chat, agents, and now the core productivity canvas of presentations. Start with one focused SKILL.md this week and see how quickly the pattern spreads to your other daily tasks.

---

*Body word count verified post-write.*
