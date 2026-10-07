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
The intro **plays on its own**, at a different pace for each part: the paragraph rolls at about one line every 1.3s so it can be read (about 30s on desktop, longer on phones where it has more lines), the sentence moves left in 1.4s, holds for 1.2s, then the fade to the closing line takes 2.4s. Scrolling down (mouse wheel, trackpad, touch or arrow keys) speeds it up; through the paragraph, scrolling is damped a little so it stays readable. Scrolling up plays it back, and after 1.4 seconds without input it carries on forward again. The pace values sit together in `AUTO` at the top of the script.

1. **Opening (2s):** a dark screen with only the first sentence, in the middle of the page. Then the rest of the paragraph, the photos, the navbar and "Skip Intro" fade in.
2. **Roll:** the paragraph rises and hides from the middle of the screen up. Each hidden-sentence word lifts out where the paragraph starts to hide and builds the sentence above, at full paragraph size and on two lines.
3. **Photos:** each one gets an equal share of the time until the sentence is complete. Each one slowly zooms in, then crossfades into the next. The order is Imperial, Sussex, Aberdeen, LSE.
4. **Sentence and zoom-out together:** once the roll is done, the sentence moves in one go to its left-aligned place, still on two lines. At the same time the LSE photo zooms out. On phones the sentence is set at 24px so it stays on two lines.
5. **Hold:** the sentence holds briefly on the settled photo.
6. **Ending:** the photo fades to 15% and the sentence to 0%. Halfway through, "Here’s how the story begins." rises from the bottom into the place the sentence left.
7. **Next section:** the page unlocks. Scrolling back to the top re-enters the intro and plays it backwards.

**Arabic:** the text sits on the right, so Arabic shows the same LSE photo mirrored, with the student on the left. This keeps «فلسطين متعلّمة» and «هكذا تبدأ الحكاية» clear of her face. Because it is mirrored, the LSE signs read backwards in the Arabic version.

The photos are wide 1920×1080 frames. Each is shown at its real resolution, and the sides are filled from the photo's own edge colours with a light blur. There are no ghosted copies and nothing is pixelated. `index.html` has them embedded, so it works as a single file. `index.src.html` is the same page with links to `assets/` instead, for editing.

## Section 2: How SFG began
Brought over from the "Scholarships for Ghazza · Intro" artifact, where it was built in another chat. The structure and motion follow the setup.sa "Giga Projects" pattern.
- **Desktop:** the left column (year, title, text and the "01 / 06" pager with arrows, progress line and next-step caption) stays pinned while the photos scroll on the right, each filling its panel edge to edge with no texture or frame. The panel crossing the middle of the screen sets the active step.
- **Mobile (under 992px):** a swipe slider with the same pager.
- **Steps:** 2020 A Chevening scholar · 2022 Back to Gaza · 04.2024 A promise · 08.2024 SFG begins · 03.2026 On Al Jazeera (with a link to The Stream) · 135 Scholarships, and counting.
- The Al Jazeera screenshot is shown whole: it sits in a taller 968×1210 frame (gold border trimmed), with its own edge colours stretched above and below, so the crop to the panel never cuts Ahmed or the SFG website.
- The section is English only for now; the EN ⇄ ع toggle does not translate it yet.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The logo is a single-colour open-book mark with the wordmark, redrawn for use on photography. Swap in the official SVG when you have it.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
