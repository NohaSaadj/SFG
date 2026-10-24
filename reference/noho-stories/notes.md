# Noho stories — reference notes

Source: https://noho.ink/#blog-section (`section#blog-section.blog-section-parent`).
Captured 2026-10-24 from the live CSS (`webflow.shared.min.css`, `noho.webflow.overrides.min.css`,
`noho.bundle.min.css`) and JS (`noho.bundle.deferred-heavy.min.js`, the `blogSection` block).
Screenshots (live vs clone): `screenshots/{live,build}-1440-p{0,50,100}.png` (deck progress),
`{live,build}-1440-hover.png`, `{live,build}-390-section.png`. Computed styles: `screenshots/live-{1440,390}.json`.

## Units
`.page{font-size:1vw}` — every `em` below is a percentage of the viewport width
(14.4px at 1440, 3.9px at 390). The whole section scales with the viewport.

## Tokens
| token | value |
|---|---|
| `--bg-page` | `#F1EEE9` |
| `--txt-main` | `#3C3C3C` |
| `--txt-main-opacity-max` | `#3c3c3c66` (card theme label) |
| `--bg-element` | `#E7E2DA` (cards 3, 6…) |
| `--bg-element-second` | `#D7D1C7` (cards 2, 5…) |
| `--bg-element-third` | `#CDC0B0` (cards 1, 4…) |
| `--bg-btn-pm` / `--txt-btn-pm` | `#3C3C3C` / `#FFFFFF` (cursor bubble) |
| font | Switzer 400 / 600 (Fontshare, licensed — loaded from noho.ink, not committed) |
| ease `custom-our` | `cubic-bezier(.17,.17,0,1)` |

## Type
| class | desktop (>991) | tablet (480–991) | mobile (≤479) |
|---|---|---|---|
| `.h1` section title | 4.17em, 600, lh 100%, ls −.04em | 6.25vw, lh 95% | 13.333em, lh 95% |
| `.h2_sb` card title | 2.08em, 600, lh 100%, ls −.03em | 3.255em | 6.944em, lh 95%, ls −.04em |
| `.primary_txt` card text | .94em, lh 120% | 1.953em | 1.953em (from tablet) |
| `.descriptor_sb` date / theme | .94em, 600, lh 100%, ls −.02em | 1.953em, ls 0 | same |

## Layout
**Desktop (>991px)**
- Section: flex column, gap 6.2963vh, padding-left 2.0833vw, z-index 50, bg `--bg-page`.
- Title mask `.title-parent`: height 4.6em, overflow hidden.
- Collection: height 24.7396vw, overflow hidden, width 100% (= 100vw − 2.0833vw).
- Card: 44.167vw × 24.7396vw, padding 2.0833vw, flex column space-between.
  - Content column 31vw wide, gap 1.25vw; title then rich text (paragraph gap ≈ 1em).
  - Dot `.blog-card-icon`: .9375vw circle, top/right 2.0833vw, `--txt-main`.
  - Footer: date + theme with 4.2708vw gap on the left; "Read article ›" on the right (.313vw chevron, .417vw gap).
- Card colours cycle third → second → element (`nth-child(3n+…)`).

**Tablet (480–991)** — native horizontal scroll, no pin. Card 39.063vw × 52.083vw, padding 1.302vw,
content 32vw, gap 1.302vw, list padding 2.604vw both sides, theme shown above the title, footer theme hidden.

**Mobile (≤479)** — native horizontal scroll. Card 83.333vw × 111.111vw, padding 2.778vw,
gap 2.778vw, title 70.556vw wide, dot 3.333vw, section gap 3.75vh, title mask 14.233em.

## Motion
### 1. Title reveal
`.section-title` starts at `y:108%` inside the overflow-hidden `.title-parent`; when the title
enters (`top 100%`, `+80` tstart offset), it tweens to `y:0`, 1s, ease `custom-our`, once.

### 2. Pinned card deck (desktop only)
ScrollTrigger: `trigger: .blog_collection-parent`, `start: "center center"`, `end: "+=400%"`
(4 viewport heights), `pin: .blog-section-parent`, progress drives a paused timeline directly
(Lenis supplies the smoothing; no scrub lag).
- Cards are absolutely positioned at `left = i × cardWidth` (a flush row, 3 visible at 1440).
- Timeline of `n−1` one-second segments. In segment `t−1→t` (t = 1…n−1) card `t` and every card
  after it move together to `x = −0.8 × cardWidth × t`, so card t slides over card t−1 and leaves
  20% of it showing. Each segment is its own tween → default GSAP ease `power1.out` per segment.
- The last card instead lands flush with the collection's right edge
  (`x = −0.8wt + collectionWidth − itsLeft − 0.2w`, evaluated when its tween starts).
- End state at 1440: cards 0–3 peek in 127px (0.2w) strips; card 3 shows ~363px; card 4 is fully visible.
- Later cards are stacked on top (DOM order). Covered text is simply cut by the next card.

### 3. Hover peek (desktop, cards 1…n−2)
If the pointer is on a card that the next card covers (`left + w − 0.1w > next.left`), the card
widens by 10% and shifts left 10% (`width:+=0.1w, x:−=0.1w`, 0.4s, power1.out), uncovering
10% more of its text. Reversed on mouseleave.

### 4. Magnet cursor (pointer devices)
- Default: 1.0417vw dark dot, centred on the pointer, follows with `quickTo` 0.4s `power2.out`.
- Over any `.layout` element it tweens to `data-size` (8.854vw for cards), `data-bg-color`
  (`--bg-btn-pm`), `data-text-color` (`--txt-btn-pm`) over 0.4s, and fades in `data-text`
  ("Open", 1.3em Switzer) over 0.2s. Leaving reverses to the default dot.
- Mousedown pulses scale .9 → 1 (0.2s + 0.2s).
- Native cursor stays `pointer` on the cards.

### 5. Click
Any card opens the article popup (`openBlogArticlePopup(index)`), a full-screen panel sliding in
from the right with prev/next and close. Out of scope for this section clone — cards are inert
except for the cursor; noted for the SFG decision (no destination = no "Open" cursor).

### Tablet / mobile
No pin and no hover; the collection is `overflow:auto` horizontally (scrollbar hidden), the
cursor is hidden on touch.

## Round 1 diff (clone/noho-stories/index.html vs live)
- Deck positions at progress 0 / 0.5 / 1: match to the pixel (strips at 0.2w, last card flush right).
- Hover peek on card 2: matches (card widens 10% left, cursor bubble "Open" 8.854vw).
- Rich-text paragraph gap was 1em; Webflow's default is `margin-bottom:10px` → fixed.
- Mobile body/date/link were 1.953em (tablet value); live uses 4.167em at ≤479 → fixed.
- Smoothing: the original uses Lenis on the whole page; the clone has no dependencies and lerps
  the deck progress (0.1) instead, so page scroll is native but the cards ease the same way.
- Not cloned: site header, article popup (no destination in this section).
