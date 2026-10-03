# SFG: header + intro (cloned from the Boulder County climate guide)

Built with the clone-to-webflow workflow, Stage A (local build). Nothing has been built in Webflow yet.

| Folder | What it is |
|---|---|
| `clone/index.html` | Faithful local clone of the reference header and scroll intro, kept as the reference. Images and logo are hot-linked from the original site for study only. Do not publish. |
| `sfg-header/index.html` | The SFG version: your four photos, the SFG paragraph and hidden sentence, the SFG navbar, and an EN ⇄ ع toggle. |
| `sfg-header/assets/` | Your four photos, compressed to WebP (100–270 KB each). |
| `reference/` | Reference screenshot, motion notes (`notes.md`) and build screenshots. |

Open locally: `python3 -m http.server` in this folder, then visit `/sfg-header/` or `/clone/`.

## How the SFG intro works
1. The header fades in. The paragraph enters at about 60% of the viewport height and scrolls up as you scroll.
2. Words brighten once they pass a reading line. Each word of the hidden sentence ("A highly educated Palestine, rebuilt by its own students.") turns fully white and gets the mentor's red-pen underline (`--color-pen-default`).
3. The photos crossfade in order: Imperial, Sussex, Aberdeen, LSE.
4. All other words fade, leaving only the hidden-sentence words. The paragraph then gives way to the full sentence.
5. "Here’s how the story begins." appears over the last photo (LSE), and the page then scrolls into the next section.
6. "Skip Intro" jumps straight to the next section. If the visitor has reduced motion turned on, the page shows the final state without animation.

## Fonts (Thmanyah licence)
The page uses `Thmanyah Serif Display`, `Thmanyah Serif Text` and `Thmanyah Sans` whenever they are available. These come from installed fonts, or from the `--font-sfg-*` variables set by a bundler such as `next/font/local`. Otherwise it falls back to Newsreader, Readex Pro and Noto Naskh Arabic. The Thmanyah font files are deliberately **not** in this repository, as the licence requires.

## Open items
- The Arabic paragraph is a draft translation and needs review by a native editor. Its hidden sentence reads «فلسطين متعلّمة يعيد بناءها طلابها».
- The logo is a single-colour open-book mark with the wordmark, redrawn for use on photography. Swap in the official SVG when you have it.
- Two photos (Sussex, LSE) have the SFG logo burned into the corner. Clean originals would look better behind the header.
