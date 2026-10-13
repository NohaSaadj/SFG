---
name: sfg-design-system
description: Design tokens and visual rules for the Scholarships for Ghazza (SFG) website, covering the color palette (light and dark), Thmanyah typography, the H1–Body3 type scale, the 12/4-column grid, spacing, radius, the 48px touch target, and how to load the Thmanyah font correctly under its licence. Use this skill whenever building, styling, refactoring or reviewing any SFG page, section or component (HTML, CSS, Tailwind config, React/Next.js), and whenever the user mentions SFG, Scholarships for Ghazza, the landing page, "on-brand", brand colors, fonts or type styles for this project, even if they don't explicitly ask for the design system.
---

# SFG Design System

Single source of truth for how the Scholarships for Ghazza website looks. Always read `references/tokens.md` before writing styles: it contains every color value, the full type scale, layout tokens and ready-to-paste CSS.

## Workflow

1. Read `references/tokens.md`.
2. Put the CSS custom properties from section 3 of that file into the global stylesheet once (or map them into `tailwind.config` `theme.extend` if the project uses Tailwind). Never hard-code hex values in components.
3. Load the fonts exactly as described in "Font loading" in `references/tokens.md`.
4. Build components with semantic tokens (`--color-*`) and type classes (`.h1`…`.body3`), not primitives.
5. Before finishing, run the checklist at the bottom of this file.

## Rules that matter most

**Color**
- Use semantic tokens in components (`--color-bg-page`, `--color-text-heading`, …). Primitives (`--red-500`, `--green-600`, …) exist only to define semantic tokens.
- Red means action. `--color-action-primary` (red 600) is reserved for the primary call to action, "Become a mentor". Don't use red decoratively; the only exception is the mentor's red-pen marks (`--color-pen-*`).
- Approximate ratio across a page: 60% linen/neutrals, 30% green + ink, 10% red.
- Ochre (`--color-accent-achievement`) is for numbers, scholarship names and map pins. For ochre *text* on light backgrounds use `--color-text-achievement` (ochre 700) for contrast.
- Support dark mode through the provided `prefers-color-scheme` block and `[data-theme]` overrides.
- The "In their memory" section uses sand background, ink/muted text and `--color-pen-soft` only: no ochre, no strong red, no buttons or CTAs.

**Typography**
- Headings H1–H6: Thmanyah Serif Display, Bold. Titles: Thmanyah Sans, Medium. Body1–3: Thmanyah Serif Text, Regular.
- Use the type-scale classes or tokens; don't invent new sizes. H1–H3 use the fluid `clamp()` sizes on smaller screens.
- All three Thmanyah families support Arabic. For the Arabic (RTL) version use the same families with `dir="rtl"` and mirrored layouts.

**Font licence (must follow)**
- Bundle the font through the build pipeline (e.g. `next/font/local`), so it ships as part of the built product.
- Never place the raw font files in a public folder, link to them for download, upload them to a CDN, or commit them to a public repository.
- Don't modify, rename or re-publish the font files.

**Layout and accessibility**
- Grid: Desktop 1440px, 12 columns, gutter 20px, margin 160px (columns stretch to 75px). Mobile 390px, 4 columns, gutter 24px, margin 20px. Lay sections out on this grid.
- Spacing scale: 2, 4, 8, 12, 16, 20, 24, 32, 48, 56, 64, 96, 128 px only, plus the section scale 160, 192, 256 px for space between large blocks (steps in a sequence, sections). On phones step the section scale down: 256 → 160, 192 → 128, 160 → 96. Radius: 4, 6, 8, 10, 999.
- Every interactive element is at least 48px tall, with a visible focus ring using `--color-border-focus`.
- Primary buttons use red 600 with white text (red 500 fails contrast for normal text).
- Respect `prefers-reduced-motion`: show final states without animation.

## Checklist before finishing

- [ ] No hard-coded hex colors in components; only `--color-*` tokens.
- [ ] Only one red primary button per view ("Become a mentor").
- [ ] Every text uses a type-scale class or token.
- [ ] Fonts bundled per the licence; no public font files.
- [ ] Dark mode checked; text contrast ≥ 4.5:1.
- [ ] Layout follows the 12/4-column grid; spacing uses only the scale values.
- [ ] Interactive elements ≥ 48px; focus visible; reduced motion respected.
