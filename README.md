# SFG: header + intro (cloned from the Boulder County climate guide)

Built with the clone-to-webflow workflow, Stage A (local build). Nothing has been built in Webflow yet.

| Folder | What it is |
|---|---|
| `clone/index.html` | Faithful local clone of the reference header and scroll intro, kept as the reference. Images and logo are hot-linked from the original site for study only. Do not publish. |
| `sfg-header/index.html` | The SFG version: your four photos, the SFG paragraph and hidden sentence, the SFG navbar, and an EN ⇄ ع toggle. |
| `sfg-header/assets/` | Your four photos, compressed to WebP (100–270 KB each). They are also embedded in `index.html`, so that file works on its own. |
| `reference/` | Reference screenshot, motion notes (`notes.md`) and build screenshots. |

Open locally: `python3 -m http.server` in this folder, then visit `/sfg-header/` or `/clone/`.

## How the SFG intro works (v3)
1. **Opening:** the first sentence shows alone on a dark screen for 1.6s. Then the photos, the navbar and "Skip Intro" fade in.
2. **The paragraph rolls:** the page is locked and the text rises on its own from the middle of the page, at about 90px/s on desktop and never slower than 10% of the screen height per second. Scrolling or swiping speeds it up.
3. **One steady text tone:** ordinary words stay at a constant 72% white and never darken as they're read. The hidden-sentence words are full white the whole time.
4. **Photos:** they change as lines pass the middle of the screen: Imperial, Sussex, Aberdeen, then LSE. The overlay is lighter now, so the photos show through.
5. **Keywords:** as each hidden-sentence word reaches the top of the text area, it moves up into a small white row and waits there.
6. **The sentence in the middle:** when the paragraph has finished, the waiting words come down together into the middle of the page, in the paragraph's own type. The LSE photo is behind them.
7. **Zoom:** the sentence holds for 2.2s, then the photo zooms out.
8. **The ending follows your scrolling:** scrolling fades the photo to 12% and the sentence to 0, and "Here’s how the story begins." rises from the bottom. Scrolling up reverses it. At the end the page unlocks and the next scroll moves to the next section.
9. **Skip Intro and language:** "Skip Intro" jumps to the final state. Switching EN ⇄ ع replays the intro. With reduced motion turned on, the page shows the sentence and the closing line without animation.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The logo is a single-colour open-book mark with the wordmark, redrawn for use on photography. Swap in the official SVG when you have it.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
