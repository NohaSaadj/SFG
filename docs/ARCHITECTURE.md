# Architecture

How the code in `site/` is organised, why, and how to change it without breaking anything.

## Principles

1. **No build step.** What is in `site/` is what ships. You can open any file and read the real code.
2. **One file per concern.** Each section has one CSS file and, when it moves, one JS file. Shared systems (tokens, base, text reveal, buttons) have their own files.
3. **Tokens only.** Colours, type, spacing, radius and easing come from `css/tokens.css` (the SFG design system). Components use semantic tokens such as `--color-text-primary`, never raw hex values.
4. **Progressive enhancement.** The page reads fully without JavaScript. `js/boot.js` adds `html.js` before first paint, and only then does CSS hide what the scripts will reveal.
5. **Logical properties.** Layout uses `inline-start` and `inline-end`, never `left` and `right`, so the Arabic page mirrors on its own.
6. **Motion is optional.** Every animation is skipped under `prefers-reduced-motion: reduce`.
7. **No inline JavaScript.** Scripts are files, which lets the Content Security Policy use `script-src 'self'`. The one inline `<script>` is JSON-LD data, which never runs.

## Load order

Order matters, because the CSS cascade and the scripts depend on what came before them.

### CSS (`<head>`)

| # | File | What it holds |
|---|---|---|
| 1 | `tokens.css` | Design tokens: primitives, semantic colours (light and dark), type scale, spacing, radius, grid. Arabic type overrides. |
| 2 | `base.css` | Reset, body, skip link, `.padding-global` |
| 3 | `header.css` | Fixed header, glass state, nav cascade hover, language switch, menu panel, primary-button motion, link draw |
| 4 | `intro.css` | The scroll-told intro: photo stack, paragraph, gathered sentence, Skip and Scroll cues |
| 5 | `partners.css` | Partner tiles on a tatreez field |
| 6 | `what-we-do.css` | Two sheets; the second slides over the first |
| 7 | `about.css` | About SFG |
| 8 | `motion.css` | Section label dot, text reveal masks (`.st-line`, `.st-in`), media and wipe reveals, reduced-motion overrides |
| 9 | `story.css` | How SFG's story began: header, pager, horizontal timeline |
| 10 | `how-it-works.css` | Steps, process line, illustrations |
| 11 | `results.css` | Stat cards, number roll, university list, globe, markers |
| 12 | `student-voices.css` | Card deck, Read cursor, story panel |
| 13 | `in-remembrance.css` | Letter and prints |
| 14 | `mentor-voices.css` | Quotes and stitch-field backdrop |
| 15 | `team.css` | Team marquee |
| 16 | `become-a-mentor.css` | Ask, accordion, tatreez band |
| 17 | `footer.css` | Footer |

### JavaScript (end of `<body>`)

| # | File | Exposes | Depends on |
|---|---|---|---|
| — | `boot.js` (in `<head>`) | `html.js` class | — |
| 1 | `i18n-ar.js` | `SFG_AR_MAP`, `SFGLang`, `SFGT(text)` | — (**must run first**) |
| 2 | `intro.js` | — | `SFGLang`, `SFGCascade`, `SFGScrollTo` (both optional) |
| 3 | `reveal.js` | `SFGReveal.play()`, `.observe()` | — |
| 4 | `scroll-to.js` | `SFGScrollTo(el, done)` | — |
| 5 | `nav-cascade.js` | `SFGCascade()` | — |
| 6 | `button-motion.js` | — | — |
| 7 | `team-marquee.js` | — | `SFGT` |
| 8 | `accordion.js` | — | `SFGReveal` |
| 9 | `what-we-do.js` | — | `SFGReveal` |
| 10 | `story-timeline.js` | — | `SFGT`, `SFGReveal` |
| 11 | `tatreez-bands.js` | — | — |
| 12 | `how-illustrations.js` | — | — |
| 13 | `how-process-line.js` | — | — |
| 14 | `lib/dot-globe.js` | `DotGlobe(canvas, options)` | WebGL |
| 15 | `results.js` | — | `DotGlobe`, `SFGT` |
| 16 | `student-voices.js` | — | `SFGT`, `SFGReveal` |
| 17 | `in-remembrance.js` | — | — |
| 18 | `mentor-voices.js` | — | `SFGReveal` |
| 19 | `footer-reveal.js` | — | — |

Every module is an IIFE that finds its section with a `data-*` hook and returns early if the section is missing. Removing a section from the HTML therefore never breaks another script. The only globals are the `SFG*` helpers listed above and `DotGlobe`.

## Conventions

**Class names.** `section_<name>` for each section's root, `<block>_<element>` inside it (for example `team_card` and `team_name`), and `is-<state>` for states (`is-in`, `is-open`, `is-pinned`). A JS hook is a `data-*` attribute (`data-team-marquee`), not a class, so styling and behaviour can change independently.

**Text reveal.** Add `data-split` to any text element; it writes in line by line when it scrolls into view. Wrap related elements in `data-split-group` and they play in one sequence. Inside `data-split-manual`, the section's own script decides when to play. A section label is `class="title2 sec-dot"` with `data-split`.

**Colour.** Red (`--color-action-primary`) is only for "Become a mentor" and the mentor's red-pen marks. Ochre is for numbers and achievements. Contrast is at least 4.5:1 for text.

**Type.** Medium (500) is the heaviest weight; nothing is bold. Sizes come from the classes in `tokens.css` (`.h1`–`.h6`, `.title`, `.title1`–`.title3`, `.body1`–`.body3`).

**Arabic.** Never use `left` or `right` for layout. Never set letter-spacing on Arabic text. A script that builds visible text must pass it through `window.SFGT`.

## Adding a section

1. Add the markup in `index.html`, in reading order, with `id`, `aria-labelledby` and `data-*` hooks.
2. Create `css/<section>.css`, using tokens only, and link it in `<head>` in the same position as the section.
3. If it moves, create `js/<section>.js` as an IIFE that guards for its root element and respects `prefers-reduced-motion`. Add its `<script>` in the same position.
4. Add its Arabic strings to `js/i18n-ar.js`.
5. Add a footer link if it is a main section, and a row to the table in the README.
6. Run the QA checks ([docs/QA.md](QA.md)).

## Images

Images are WebP, sized to their largest display size. Below the fold they use `loading="lazy"`, and every image has `width` and `height` set so nothing shifts while it loads. The intro photos have a 960px version for phones (`srcset`). New photos go in `assets/images/<section>/`.

## Third-party code

There is none at runtime. `lib/dot-globe.js` is first-party; it was written for this site after studying iventions.com. Google Fonts serves only the fallback fonts' CSS and font files.
