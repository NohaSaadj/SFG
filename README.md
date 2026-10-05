# SFG: header + intro (cloned from the Boulder County climate guide)

Built with the clone-to-webflow workflow, Stage A (local build). Nothing has been built in Webflow yet.

| Folder | What it is |
|---|---|
| `clone/index.html` | Faithful local clone of the reference header and scroll intro, kept as the reference. Images and logo are hot-linked from the original site for study only. Do not publish. |
| `sfg-header/index.html` | The SFG version: your four photos, the SFG paragraph and hidden sentence, the SFG navbar, and an EN ⇄ ع toggle. |
| `sfg-header/assets/` | Your four photos, compressed to WebP (100–270 KB each). They are also embedded in `index.html`, so that file works on its own. |
| `reference/` | Reference screenshot, motion notes (`notes.md`) and build screenshots. |

Open locally: `python3 -m http.server` in this folder, then visit `/sfg-header/` or `/clone/`.

## How the SFG intro works (v7)
The intro **plays on its own** and takes about 34 seconds. Scrolling down (mouse wheel, trackpad, touch or arrow keys) speeds it up. Scrolling up plays it back, and after 1.4 seconds without input it carries on forward again.

1. **Opening (2s):** a dark screen with only the first sentence, in the middle of the page. Then the rest of the paragraph, the photos, the navbar and "Skip Intro" fade in.
2. **Roll:** the paragraph rises and hides from the middle of the screen up. Each hidden-sentence word lifts out where the paragraph starts to hide and builds the sentence above, at full paragraph size and on two lines.
3. **Photos:** each one gets an equal share of the time until the sentence is complete. Each one slowly zooms in, then crossfades into the next. The order is Imperial, Sussex, Aberdeen, LSE.
4. **Sentence and zoom-out together:** once the roll is done, the sentence moves in one go to its left-aligned place, still on two lines, over the same length the old move to the middle had. At the same time the LSE photo zooms out. On phones the sentence is set at 24px so it stays on two lines.
5. **Hold:** the sentence holds briefly on the settled photo.
6. **Ending:** the photo fades to 15% and the sentence to 0%. Halfway through, "Here’s how the story begins." rises from the bottom into the place the sentence left.
7. **Next section:** the page unlocks. Scrolling back to the top re-enters the intro and plays it backwards.

**Arabic:** the text sits on the right, so Arabic shows the same LSE photo mirrored, with the student on the left. This keeps «فلسطين متعلّمة» and «هكذا تبدأ الحكاية» clear of her face. Because it is mirrored, the LSE signs read backwards in the Arabic version.

The photos are wide 1920×1080 frames. Each is shown at its real resolution, and the sides are filled from the photo's own edge colours with a light blur. There are no ghosted copies and nothing is pixelated. `index.html` has them embedded, so it works as a single file. `index.src.html` is the same page with links to `assets/` instead, for editing.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The logo is a single-colour open-book mark with the wordmark, redrawn for use on photography. Swap in the official SVG when you have it.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
