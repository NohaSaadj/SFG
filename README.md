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
Laid out like Cambium's "Associated sustainability organizations" band, made as compact as possible: one centred row of four 192×64px tiles: the label "Our partners", the two logos, and "Become a partner". 4px gaps show the background. The band is 128px tall on desktop (32px above and below) and 180px on phones (a 2×2 grid). The background is the traced tatreez band tiled in offset rows over the whole band (a vector `<pattern>`), in two quiet neutrals (`--color-pattern-stitch` = border, `--color-pattern-stitch-soft` = sand), so it reads as texture like Cambium's wood grain and the logos keep their contrast.
- Logos: Phoenix Space and the Amjad & Suha Bseisu Foundation (`assets/partners/`). Both are single-colour masks filled with `--color-text-primary`, so they are ink in light mode and linen in dark mode.
- The third tile, "Become a partner", is a green text link (`#partner-with-us`, placeholder until there is a partner page or address). Add more partners as new tiles.
The caption and link are translated for Arabic.

## About SFG (new, before section 2)
A two-part editorial block on the 12-column grid, laid out like Cambium's split sections: the eyebrow "About SFG" and the H2 "A Palestinian-led mentorship initiative" lead on the left (columns 1 to 5), and the description sits on the right (columns 7 to 11), top-aligned with the headline, in Body1 (Thmanyah Serif Text Regular, 18/28) in the neutral muted tone (`--color-text-secondary`), like Cambium's faded large text. On phones the title sits above the description. Its text appears like cambium.com (see "Reveals" below). The copy is a draft for review.

## Reveals (after cambium.com)
Cambium's own animation scripts can't be reached from this environment, so the motion was rebuilt from the `data-module="split-text"` / `data-reveal-*` markup on their home page:
- **Text (`data-split`):** headings and paragraphs are split into lines. Each line rises out of a mask (1.1s, ease-out-expo), 0.08s after the line before it. Inside a `data-split-group` the stagger carries on from heading to text. It plays once, when the block enters the screen; afterwards the text goes back to plain text so it reflows normally.
- **Section 2 steps:** the year, title and text rise line by line each time a step becomes active, on desktop and in the mobile slider.
- **Photos (`data-reveal-media`):** each frame uncovers from the bottom while the photo settles from 118% to 100%.
- **Details:** the tatreez band wipes in from the start side (`data-reveal-wipe`); the pager fades up (`data-reveal`).
- With reduced motion turned on, everything is shown at once. Without JavaScript nothing is hidden.

## Section 2: How SFG began (horizontal timeline, after De Coene)
- **Tatreez hem:** the band opens the section as a full-width stitched edge between About and the story, away from the heading and pager, so the head reads calmly.
- **Head:** "Our story", H2 "How SFG began", and the subtitle with the pager on its right. 96px of space separate the head from the steps and photos (48px on phones); the photo height is fitted to the room left under the head, so the gap holds on shorter laptop screens too.
- **Desktop:** the timeline pins to the screen and scrolling down moves the steps sideways. The section's height is set from the track's width, so a scroll down of X moves the track by X; scrolling up plays it back. The next step always peeks in from the right.
- **Each step:** the year in H1 ochre (`--color-text-achievement`), faded until its step is current, then the title (Title1) and text (Body1), then the photo. Text and year rise in with the split-text reveal; photos uncover as they come in.
- **Photos:** every photo has the same height (`min(52vh, 480px)`) and its own width, so portraits are narrow, Al Jazeera (cropped to the video frame only, without the phone screen beside it) is wide and the 135 step shows the four scholars as a 2×2 square. Nothing is cropped, stretched or matted.
- **Pager (from the previous version):** "01 / 06" with previous/next buttons (48px), a progress line and the next step's name ("Next · Back to Gaza"). It sits on the right of the section description ("One scholarship, one promise…"), ending on the right grid margin (on the left in Arabic). The whole section head is part of the pinned area, so the pager stays in view while the steps move. The arrows point sideways (the steps move sideways), flipped in Arabic; on phones the pager sits under the description.
- **Phones and tablets (under 992px):** the pager sits on top and the steps are a swipe track; photos show full width at their own shape.
- **Arabic:** the track runs right to left and the arrow keys swap.
- The background is linen, the same as About; the tatreez hem marks where the story begins. The steps' text is English only for now.

## What we do / What we don't do (straight after the story)
Two sheets in one pinned section (after cambium.com "What we do"):
- **Proportions (after Cambium's "What we do" section, mapped to the design system):** H1 heading, 96px to the cards; each card has a thin start-side rule, 32px inner padding, a 48px line icon in red (red 400 on the dark sheet for 3:1 contrast, red 600 on linen), 64px to the title (Title size at regular weight), 16px to a Body2 (16px) description in a faded tone (linen at 72% on green), max 38 characters per line.
- **Sheet 1, What we do:** dark green (`--color-bg-inverse`), the H1 "What we do", then three columns divided by thin lines: Mentor, Guide, Connect. Each has a line icon (two people, a document with a pen, a link), a title and a description.
- **Sheet 2, What we don't do:** linen, rounded top corners. As you keep scrolling it slides up over the first sheet, which shrinks to 96% and darkens like a stack of paper. When it arrives, the mentor's red pen (`--color-pen-default`) underlines "don't", an ink stroke crosses out each red icon (a banknote, a pen, a medal), and the three columns rise in: Charge students, Write applications for students, Award or promise scholarships.
- Scrolling up plays it back. On phones, with reduced motion, or when a sheet's content is taller than the screen, the two sheets simply follow each other (no overlap), and the red-pen marks draw as the second sheet comes into view.

## Design system alignment
- **Grid:** the header, intro sentence, closing line, "Skip Intro" and every section start on the design-system margin (`--grid-margin`: 160px at 1440, scaling down to 20px on phones). The old 1180px container is gone.
- **Spacing:** only the scale values (2 to 128px). The off-scale 28, 40, 88, 120 and 160px steps were removed.
- **Type:** every text uses a scale class or token. The full scale (H1 to H6, Title to Title3, Body1 to Body3) is defined. On phones the intro paragraph uses H4 and the sentence H5.
- **Touch targets:** nav links, the button, the language toggle, the menu button and "Skip Intro" are all 48px tall.
- **Navbar:** once the page scrolls, the header turns to light glass above the sections: linen at 55% with a 24px blur (`--color-bg-glass`), ink text and the full-colour logo. In dark mode the glass is night green with light text. With the menu open it goes back to the dark header. Browsers without backdrop blur get solid linen.
- **Section separation:** About and "How SFG began" share the linen background; the full-width tatreez hem marks the change, with 128px above and below each heading block. Both sections open the same way: eyebrow ("About SFG", "Our story"), H2, then text.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The header now uses the official SFG logo (`assets/logo.png`), reversed to linen for the dark header (`assets/logo-linen.png`). An SVG version would be sharper on high-density screens.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
