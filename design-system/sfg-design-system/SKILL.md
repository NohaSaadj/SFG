---
name: sfg-design-system
description: Design tokens and visual rules for the Scholarships for Ghazza (SFG) website, covering the color palette (light and dark), Thmanyah typography, the H1–Body3 type scale, the 12/4-column grid, spacing, radius, the 48px touch target, and how to load the Thmanyah font correctly under its licence. Use this skill whenever building, styling, refactoring or reviewing any SFG page, section or component (HTML, CSS, Tailwind config, React/Next.js), and whenever the user mentions SFG, Scholarships for Ghazza, the landing page, "on-brand", brand colors, fonts or type styles for this project, even if they don't explicitly ask for the design system.
---

# SFG Design System

**Version 1.3 (final, locked).** v1.3: bare 24px chevrons everywhere, a thin (14px) tatreez band beside the Student voices and Become a mentor labels, page-colour glass results cards, the links' drawn underline on accordion questions, noho.ink's letter cascade on nav hover, In Remembrance at H2. v1.2: Cambium eyebrow motion for labels, nav links glide to their section, noho.ink story-panel transitions, 8px button corners, smaller arrows, tatreez band in the Student voices header, no testimonial photos. v1.1 (owner sign-off): section dots only on top-level sections, ochre line icons at the arrows' weight, round student photos, five-link navigation, results back to cards. v1.1.1: glass results cards, What we do / don't headlines at H2 with Regular column titles, face cut-outs on a plain circle, the navigation's "Become a mentor" opens the mentor form. The colours, fonts and the motion catalogue below are fixed. A new page or section reuses them as they are; it does not add a new colour, weight or animation type. Change them only with the owner's sign-off, then bump the version and note it in the README.

## Locked catalogue (summary)
- **Colours:** green ink (green 800) for all text, faded to 76% for details; linen / paper / sand backgrounds; green 700 for inverse sections and the footer; **red 600 only** for "Become a mentor" (plus the red-pen marks); **ochre** for numbers and achievements; **green 500** (`text/highlight`) for the key words in a headline; **ochre 300** for the footer column labels; **ochre** for line icons (ochre 300 on green, ochre 600 on light). Dark mode uses the night tokens.
- **Fonts:** Thmanyah Serif Display (headings, numbers), Thmanyah Serif Text (body, quotes), Thmanyah Sans (labels, buttons, navigation). Weights: **Regular 400** and **Medium 500** only. Navigation links and large lead paragraphs are Regular; headings, labels and buttons are Medium.
- **Motion (one of each, nothing else):**
  1. Text: *Text reveal animation* (lines rise out of a mask), on first appearance while scrolling. Every content text, every card, every section.
  2. Section label (after cambium.com's eyebrow): the dot scales in from its start edge and the label slides in from the dot, 0.9s `--ease-smooth`; the headline's lines follow.
  2a. Navigation links on hover (after noho.ink): each letter rolls up and its copy rises from below, 25ms apart, 0.6s `cubic-bezier(.2,0,.1,1)`. Arabic rolls word by word so letters stay joined.
  2b. In-page links (navigation): the page glides to the section in 1–1.6s on `--ease-smooth`, then its text plays. Wheel or touch stops it.
  3. Images: *media uncover* (clip from 18% below + 1.18 → 1 zoom, 1.3s / 1.8s). Patterns and bands: *wipe* (clip from the reading start, 1.4s). Small blocks (logos, tiles): *fade-up* (24px, 0.9s).
  4. Illustrations: their parts play in order once 40% in view.
  5. Primary buttons: panel slides up, label shrinks and rises. Secondary links: underline draws in.
  6. Accordion: body opens/closes by grid rows 0fr ↔ 1fr, 0.6s `--ease-smooth`; the + turns into − (vertical line rotates −90°).
  7. Numbers: *number roll* (odometer), 2.5s.
  8. Carousels: the new slide's text re-plays the text reveal.
  9. Story panel (after noho.ink): slides in from the side in 0.7s `--ease-smooth`, out in 0.65s in-out. Next / previous story: the text fades up and out (0.3s), a green-700 curtain rises over the photo (0.5s), the story swaps, the curtain leaves through the top (0.6s) uncovering the new photo, and the name writes in again.
  All of it is skipped under `prefers-reduced-motion`.

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
- Red means action. `--color-action-primary` (red 600) is reserved for the primary call to action, "Become a mentor". Don't use red decoratively. The only exception is the mentor's red-pen marks (`--color-pen-*`).
- Approximate ratio across a page: 60% linen/neutrals, 30% green + ink, 10% red.
- Ochre (`--color-accent-achievement`) is for numbers, scholarship names and map pins. For ochre *text* on light backgrounds use `--color-text-achievement` (ochre 700) for contrast.
- Support dark mode through the provided `prefers-color-scheme` block and `[data-theme]` overrides.
- The "In their memory" section uses sand background, ink/muted text and `--color-pen-soft` only: no ochre, no strong red, no buttons or CTAs.

**Text colour (after cambium.com)**
- All text is one dark green ink (`text/primary` = `text/heading` = green 800). Details (body copy under a title, captions) use the same ink faded to 76% (`text/secondary`). On inverse sections it is linen, faded to 72% for details. Red and ochre stay accents only.

**Typography**
- **Nothing is Bold: Medium (500) is the heaviest weight used anywhere.** Headings H1–H6: Thmanyah Serif Display, Medium. Display (one very large statement): Serif Display, Medium. Quote (large testimonials): Serif Text, Medium. Titles: Thmanyah Sans, Medium (no Regular titles). Body1–3: Thmanyah Serif Text, Regular.
- Heading sizes descend with level: every section title is H2, and a heading inside a section is H3 or smaller, never the same size as its H2.
- Sizes in `rem`, line heights unitless, letter spacing in `em`. Cap body text at 60–75 characters a line.
- Load every weight you use (Display 500, Text 400 and 500, Sans 400 and 500); a missing face makes the browser show a different weight.
- Use the type-scale classes or tokens; don't invent new sizes. H1–H4, Display and Quote use the fluid `clamp()` sizes on smaller screens.
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

**Icons, photos and navigation**
- **Line icons** match the arrows: drawn on a 24px grid with a 1.5px stroke, round caps and joins, `fill:none`. Colour: ochre (`--color-icon-accent-on-inverse` ochre 300 on green sheets, `--color-icon-accent` ochre 600 on light ones; both ≥ 3:1).
- **No people photos** beside testimonial names: the name and university stand alone.
- **Navigation:** About · How it works · Testimonials · Mentors · Student handbook ↗ (external, opens the Arabic handbook in a new tab), then "Become a mentor", which opens the mentor application form in a new tab. Links are Title3 Regular (16/24). Below 1280px the links fold into the menu.

**Motion and icons** (details in section 5 of `references/tokens.md`)
- **Text reveal animation:** every piece of content text appears the same way, with its lines rising out of a mask (1.1s, 0.08s apart, ease-out-expo). Hidden content plays when it is shown.
- **Top-level sections** (About, How it works, Student voices, Mentor voices, Become a mentor) open with a label (Title2, 18px) with a dot on its reading-start side, then the headline (H2), then details if needed. **The parts of About** (Our story, What we do / What we don't) have no label and no dot: just the headline (H2) and its details, since About already carries the dot. Our results keeps its label and dot above *What mentorship made possible*. Every section headline is H2, the size of *How SFG’s story began*. Card titles under an H2 (What we do / don't columns) are Regular. In Remembrance has no dot. The label and headline share one colour. The dot sits on the content line (where the headline and details start) and the label text follows it, as on cambium.com. The label and its dot move as one (Cambium eyebrow), then the headline and details write in. Spacing is fixed: label → headline 16px, headline → details 24px.
- **Primary buttons:** a darker panel slides up from below while the label shrinks and rises (after cambium.com). **Secondary text links:** no underline at rest, and on hover it draws in from the left.
- **Number roll (odometer):** stat figures roll up digit by digit from 0 (after cambium.com/impact).
- **Arrows:** one full-arrow SVG (rotated for ↗ and ↓) at 14px in links and buttons, and a bare 24px chevron (no circle; the 48px button stays the touch target) for every previous / next and the panel's close, nudging 3px in its direction on hover. No text arrows or emoji.
- **Buttons:** 8px corners (`--radius-button` = `radius-card`), not pills. A thin tatreez band (14px tall, whole motifs) can run from a section label to the edge of its row (Become a mentor) or to 32px before its arrows (Student voices), after cambium.com's "Get inspired". Accordion questions use the links' drawn underline on hover.

## Checklist before finishing

- [ ] No hard-coded hex colors in components; only `--color-*` tokens.
- [ ] Only one red primary button per view ("Become a mentor").
- [ ] Every text uses a type-scale class or token; heading sizes descend with level; body lines are 60–75 characters.
- [ ] Fonts bundled per the licence; no public font files.
- [ ] Dark mode checked; text contrast ≥ 4.5:1.
- [ ] Layout follows the 12/4-column grid; spacing uses only the scale values.
- [ ] Interactive elements ≥ 48px; focus visible; reduced motion respected.
- [ ] No Bold anywhere; text uses the text reveal animation; section titles have the dot; arrows use the shared SVGs.
