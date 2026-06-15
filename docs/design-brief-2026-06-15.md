# SMF Clearinghouse — Design Direction Brief

**Date:** 2026-06-15
**Goal:** Replace the current light/emoji-heavy design with a cutting-edge, responsive, AI-forward look and feel.
**Mood:** serious, engineered, high-tech, fast, trustworthy — **not** playful, not kiddy, no cartoon icons.

---

## What the best AI/dev-tool sites do in 2026

From Linear, Vercel, Anthropic, Perplexity, Cursor, OpenAI, Zed, Replicate, Runway:

1. **Dark-first canvas.** Almost every top AI/dev brand defaults to near-black (`#010102`–`#0a0a0a`) with cool neutrals. It reads as infrastructure, not consumer.
2. **Single disciplined accent.** Linear uses lavender `#5e6ad2`. Vercel uses ink `#171717` with one mesh gradient. Anthropic uses warm clay/coral. Cursor uses burnt orange. Perplexity uses teal-cyan. Pick one hero accent and use it sparingly.
3. **Exposed technical grid.** Thin blueprint/grid lines as a background layer are the dominant 2026 AI design metaphor — "this was built to spec."
4. **Engineering typography.** Geometric sans + monospace for labels/chips/code. Tight/negative tracking on big headlines. Sentence case, not title case.
5. **Surface hierarchy, not shadows.** Cards lift via subtle background steps (`#0f1011` → `#141516` → `#18191a`) and hairline borders, not drop shadows.
6. **Bento grids.** Modular, asymmetric card layouts for features/density.
7. **Kinetic UI.** Motion as meaning: smooth hover states, staggered entrances, subtle scroll-linked effects — but never spectacle.
8. **No emoji.** Use abstract iconography, glyphs, or no icon at all.

---

## Recommended direction for SMF Clearinghouse

### 1. Palette

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Canvas | `--bg-canvas` | `#050507` | Page background |
| Surface 1 | `--bg-panel` | `#0b0c0f` | Cards, nav |
| Surface 2 | `--bg-elevated` | `#111216` | Hover panels, dropdowns |
| Hairline | `--border` | `#1e2026` | Borders, dividers, grid lines |
| Text primary | `--text-primary` | `#f2f2f5` | Headlines, body |
| Text secondary | `--text-secondary` | `#8a8f98` | Captions, meta |
| Accent | `--accent` | `#5e6ad2` | CTAs, focus, links, active states |
| Accent glow | `--accent-glow` | `rgba(94,106,210,0.25)` | Hover auras, subtle gradients |
| Success | `--success` | `#22c55e` | Open source, verified |
| Warning | `--warning` | `#f59e0b` | Paid/hybrid markers |

*Why this palette:* near-black is the 2026 default for AI tooling. Lavender/blue is high-tech without the cliché neon-purple cyberpunk look. It differentiates from SMF Works (navy/cyan/ember) cleanly.

### 2. Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headlines | `Geist` or `Inter` | 500–600 | Tight tracking (`-0.02em` to `-0.04em` on H1) |
| Body | `Geist` or `Inter` | 400–450 | `1.5` line-height, `16–18px` |
| Mono | `Geist Mono` or `JetBrains Mono` | 400 | Eyebrow labels, version chips, code snippets, stat numbers |

*Avoid:* display serifs (too editorial like Anthropic/Claude), overly decorative fonts.

### 3. Layout / Components

- **Persistent blueprint grid** behind the hero and section backgrounds (`1px` lines at `var(--border)` opacity, fading at edges).
- **Bento directory grid** on the homepage: 3-column asymmetric cards instead of uniform emoji cards.
- **Glass/navy panels** with `backdrop-blur`, hairline borders, and subtle lift on hover.
- **Mono eyebrow labels** above section titles (e.g., `AGENT DIRECTORY`, `LATEST VERIFIED`).
- **Pill CTAs** with `9999px` radius or 8px radius — one clear primary action per section.
- **Code/data surfaces** for recipes/tests/tips using Geist Mono on a slightly elevated panel.

### 4. Motion

- **Hero grid:** slow ambient drift or subtle pulse on intersection.
- **Cards:** `transform` + `border-color` transition on hover (not box-shadow).
- **Staggered entrances:** section children fade/slide up with `0.05s` stagger.
- **Search/dropdowns:** instant open with slight scale/spring.

*Avoid:* Lottie animations, confetti, bouncing emojis, parallax scroll jank, heavy shader backgrounds that hurt performance.

### 5. Icon strategy

- Replace all emoji icons (`🤖`, `⚡`, `🧪`) with a single icon family.
- **Recommendation:** `lucide-react` (already common in Next.js) or custom 1.5px stroke line icons.
- Use abstract glyphs where possible: network nodes for agents, server racks for hosting, microscope for tests, shield for safety, etc.

### 6. Specific page recommendations

| Page | Change |
|------|--------|
| Home | Full-bleed dark hero with grid, headline + mono subhead + search, bento section grid below |
| Agents | Keep filter bar, but use dark panels, mono chips, status badges with subtle glow |
| Agent detail | Elevated header panel with mono metadata row, code-block features |
| Recipes/Guides/Tips | Code-like card list, monospace tags, syntax-highlighted markdown blocks |
| LLMs | Data table on dark canvas with monospace pricing columns, heat-map styling |
| All detail pages | "Last verified" as a mono badge, abstract category glyph |

### 7. Brand separation from SMF Works

- No navy, no forge ember, no steel imagery.
- No shared SMF visual DNA beyond the name itself.
- This site should feel like a standalone AI tooling directory, not a subsite.

---

## Implementation notes

- We are already on Next.js + Tailwind + `shadcn/tailwind.css` — this fits the 2026 stack.
- Use CSS variables in `globals.css` for the full dark palette.
- `next-themes` can remain but default to dark and optionally hide light toggle.
- Static export must keep `images.unoptimized: true` — any generated SVG/PNG assets must live in `/public`.
- Keep performance first: no heavy WebGL, no large Lotties, no third-party animation libraries unless necessary.

---

## Next steps

1. Michael approves palette + direction.
2. I update `globals.css` with new design tokens.
3. I rebuild `Nav`, `Footer`, `HubClient`, and `AgentsDirectoryClient` with the new look.
4. I replace emoji icons with Lucide icons.
5. I add a subtle grid background + ambient motion.
6. Build, verify, push.

