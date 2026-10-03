# SFG: header + intro (cloned from the Boulder County climate guide)

Built with the clone-to-webflow workflow, Stage A (local build). Nothing has been built in Webflow yet.

| Folder | What it is |
|---|---|
| `clone/index.html` | Faithful local clone of the reference header and scroll intro, kept as the reference. Images and logo are hot-linked from the original site for study only. Do not publish. |
| `sfg-header/index.html` | The SFG version: your four photos, the SFG paragraph and hidden sentence, the SFG navbar, and an EN ⇄ ع toggle. |
| `sfg-header/assets/` | Your four photos, compressed to WebP (100–270 KB each). |
| `reference/` | Reference screenshot, motion notes (`notes.md`) and build screenshots. |

Open locally: `python3 -m http.server` in this folder, then visit `/sfg-header/` or `/clone/`.

## How the SFG intro works (v2, time-driven, after `Scholarships_for_Ghazza___Intro.html`)
1. **Opening:** the screen stays dark and only the first sentence shows. After 2.6s the photo, header and "Skip Intro" fade in.
2. **The paragraph rolls:** the page locks and the paragraph rises on its own. Scrolling, swiping or the arrow keys speed it up. Text styles are unchanged: H1 type, with words dim until read and brighter once they pass the reading line.
3. **Photos:** they change as lines pass the middle of the screen, in order (Imperial, Sussex, Aberdeen, LSE), each with a slow zoom.
4. **Keywords fly up:** as each word of the hidden sentence crosses 55% of the screen height, it flies into a centred row near the top. Once the row is complete, the mentor's red pen underlines it.
5. **The sentence:** the row hands off to a large version of the sentence on the left. The final photo (LSE) settles from zoomed-in to full size beside it.
6. **Closing:** "Here’s how the story begins." rises in over the LSE photo with a Scroll cue, and the page unlocks so you can scroll to the next section.
7. **Controls:** "Skip Intro" jumps straight to step 6 and scrolls on when clicked again. Switching EN ⇄ ع replays the intro in the other language. With reduced motion turned on, the page shows the final state at once.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The logo is a single-colour open-book mark with the wordmark, redrawn for use on photography. Swap in the official SVG when you have it.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
