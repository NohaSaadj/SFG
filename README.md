# SFG: header + intro (cloned from the Boulder County climate guide)

Built with the clone-to-webflow workflow, Stage A (local build). Nothing has been built in Webflow yet.

| Folder | What it is |
|---|---|
| `clone/index.html` | Faithful local clone of the reference header and scroll intro, kept as the reference. Images and logo are hot-linked from the original site for study only. Do not publish. |
| `sfg-header/index.html` | The SFG page, as one self-contained file: navbar, the intro (section 1) and "How SFG began" (section 2). Built from `index.src.html` with `python3 build.py`. |
| `sfg-header/assets/` | Intro photos (WebP) and the section 2 photos in `assets/story/`. `build.py` embeds them all into `index.html`, so that file works on its own. |
| `reference/` | Reference screenshot, motion notes (`notes.md`) and build screenshots. |

Open locally: `python3 -m http.server` in this folder, then visit `/sfg-header/` or `/clone/`.

## How the SFG intro works (v8)
The intro **plays on its own**. The four photos get the same time on screen and every photo change is a quick 0.7s crossfade (`AUTO.photoChangeSeconds`; before, the third change was quicker than the others because it overlapped the sentence moving left). Each part runs at its own pace: the paragraph rolls at about one line every 1.3s so it can be read (about 30s on desktop, longer on phones where it has more lines), the sentence moves left in 1.0s, holds for 0.8s, then the fade to the closing line takes 1.6s. Scrolling down (mouse wheel, trackpad, touch or arrow keys) speeds it up; through the paragraph, scrolling is damped a little so it stays readable. Scrolling up plays it back, and after 1.4 seconds without input it carries on forward again. The pace values sit together in `AUTO` at the top of the script.

1. **Opening (2s):** a dark screen with only the first sentence, in the middle of the page. Then the rest of the paragraph, the photos, the navbar and "Skip Intro" fade in.
2. **Roll:** the paragraph rises and hides from the middle of the screen up. Each hidden-sentence word lifts out where the paragraph starts to hide and builds the sentence above, at full paragraph size and on two lines.
3. **Photos:** each one gets an equal share of the time until the sentence is complete. Each one slowly zooms in, then crossfades into the next. The order is Imperial, Sussex, Aberdeen, LSE.
4. **Sentence and zoom-out together:** once the roll is done, the sentence moves in one go to its left-aligned place, still on two lines. At the same time the LSE photo zooms out. On phones the sentence is set at 24px so it stays on two lines.
5. **Hold:** the sentence holds briefly on the settled photo.
6. **Ending:** the photo fades to 15% and the sentence to 0%. Halfway through, "Here’s how the story begins." rises from the bottom into the place the sentence left.
7. **Next section:** the page unlocks. Scrolling back to the top re-enters the intro and plays it backwards.

**Arabic:** the text sits on the right, so Arabic shows the same LSE photo mirrored, with the student on the left. This keeps «فلسطين متعلّمة» and «هكذا تبدأ الحكاية» clear of her face. Because it is mirrored, the LSE signs read backwards in the Arabic version.

The photos are wide 1920×1080 frames. Each is shown at its real resolution, and the sides are filled from the photo's own edge colours with a light blur. There are no ghosted copies and nothing is pixelated. `index.html` has them embedded, so it works as a single file. `index.src.html` is the same page with links to `assets/` instead, for editing.

## Partners (after the intro, before About)
Laid out like Cambium's "Trusted by" band: a caption tile across the top, then logo tiles, with 4px gaps showing the background. The background is the traced tatreez band tiled in offset rows over the whole band (a vector `<pattern>`), in two quiet neutrals (`--color-pattern-stitch` = border, `--color-pattern-stitch-soft` = sand), so it reads as texture like Cambium's wood grain and the logos keep their contrast.
- Logos: Phoenix Space and the Amjad & Suha Bseisu Foundation (`assets/partners/`). Both are single-colour masks filled with `--color-text-primary`, so they are ink in light mode and linen in dark mode.
- The third tile, "Become a partner", is a green text link (`#partner-with-us`, placeholder until there is a partner page or address). Add more partners as new tiles.
- Desktop: 3 tiles in a row. Phones: the two logos side by side, the link tile below. The caption and link are translated for Arabic.

## About SFG (new, before section 2)
A two-part editorial block on the 12-column grid, laid out like Cambium's split sections: the eyebrow "About SFG" and the H2 "A Palestinian-led mentorship initiative" lead on the left (columns 1 to 5), and the description sits on the right (columns 7 to 11), top-aligned with the headline, in Body1 (Thmanyah Serif Text Regular, 18/28) in the neutral muted tone (`--color-text-secondary`), like Cambium's faded large text. On phones the title sits above the description. Its text appears like cambium.com (see "Reveals" below). The copy is a draft for review.

## Reveals (after cambium.com)
Cambium's own animation scripts can't be reached from this environment, so the motion was rebuilt from the `data-module="split-text"` / `data-reveal-*` markup on their home page:
- **Text (`data-split`):** headings and paragraphs are split into lines. Each line rises out of a mask (1.1s, ease-out-expo), 0.08s after the line before it. Inside a `data-split-group` the stagger carries on from heading to text. It plays once, when the block enters the screen; afterwards the text goes back to plain text so it reflows normally.
- **Section 2 steps:** the year, title and text rise line by line each time a step becomes active, on desktop and in the mobile slider.
- **Photos (`data-reveal-media`):** each frame uncovers from the bottom while the photo settles from 118% to 100%.
- **Details:** the tatreez band wipes in from the start side (`data-reveal-wipe`); the pager fades up (`data-reveal`).
- With reduced motion turned on, everything is shown at once. Without JavaScript nothing is hidden.

## Section 2: How SFG began
The structure and motion follow the setup.sa "Giga Projects" pattern. It was brought over from the "Scholarships for Ghazza · Intro" artifact.
- **Desktop:** the left column (year, title, text and the "01 / 06" pager with arrows, progress line and next-step caption) stays pinned while the steps scroll on the right. The panel crossing the middle of the screen sets the active step.
- **Photos at their own shape:** every photo is shown whole, at its original proportions (3:4 portraits, the 4:5 Instagram story, the wide Al Jazeera frame), as large as the right column and the screen allow. The left column is 5 grid columns, the photos get the other 7.
- **One grade for every photo:** slightly muted, warm, with lifted shadows (ImageMagick: `-modulate 100,82 -sigmoidal-contrast 2x50%`, R ×1.025, B ×0.95, `+level 3%,100%`). Screenshots are left ungraded so their text stays crisp.
- **Mobile (under 992px):** a swipe slider with the same pager and frame.
- **Steps:** 2020 A Chevening scholar (Ahmed with his certificate at Warwick Business School) · 2022 Back to Gaza (light blue shirt at the desk) · 04.2024 A promise (notebook and teapot) · 08.2024 SFG begins (the "Want to help Ghazawi students…" Instagram story) · 03.2026 On Al Jazeera · 135 Scholarships, and counting.
- **Section head:** no divider lines. The spacing uses design-system steps: 96px above the title, and 96px from the title block to the first step.
- **Tatreez band:** next to "How SFG began", running to the right edge of the page. It was traced stitch by stitch from the supplied band (7 rows, 376 squares) into vector squares, then repeated to fill the rest of the title row. The colours are `--color-tatreez-primary` (red 500) and `--color-tatreez-secondary` (ochre 400).
- The section is English only for now; the EN ⇄ ع toggle does not translate it yet.

## Design system alignment
- **Grid:** the header, intro sentence, closing line, "Skip Intro" and every section start on the design-system margin (`--grid-margin`: 160px at 1440, scaling down to 20px on phones). The old 1180px container is gone.
- **Spacing:** only the scale values (2 to 128px). The off-scale 28, 40, 88, 120 and 160px steps were removed.
- **Type:** every text uses a scale class or token. The full scale (H1 to H6, Title to Title3, Body1 to Body3) is defined. On phones the intro paragraph uses H4 and the sentence H5.
- **Touch targets:** nav links, the button, the language toggle, the menu button and "Skip Intro" are all 48px tall.
- **Navbar:** once the page scrolls, the header turns to light glass above the sections: linen at 55% with a 24px blur (`--color-bg-glass`), ink text and the full-colour logo. In dark mode the glass is night green with light text. With the menu open it goes back to the dark header. Browsers without backdrop blur get solid linen.
- **Section separation:** About sits on linen and "How SFG began" on sand (`--color-bg-surface-alt`), with 128px above and below each heading block. Both sections open the same way: eyebrow ("About SFG", "Our story"), H2, then text.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The header now uses the official SFG logo (`assets/logo.png`), reversed to linen for the dark header (`assets/logo-linen.png`). An SVG version would be sharper on high-density screens.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
