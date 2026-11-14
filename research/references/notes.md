# Reference notes: climateguide.bouldercounty.gov intro

Source: page source supplied by the user and `original-desktop-1440.webp` (user screenshot).
The live site could not be reached from the build sandbox, so motion is reconstructed from the
source (Astro + Svelte `Intro` island, `tw-scroller` CSS) and the screenshot.

## Layout (1440 desktop)
- Header: sticky, `py-8` (32px), container ~1180px. Left: round logo (37px tall, inverted to white)
  + title "A Guide to Climate Action" (fluid-xl, ~28px, line-height 1.2), 18px gap.
  Right: language pill (80x32, white 70% fill, 1px #292721 border, white knob 24px, label "esp")
  + "Menu" label + 3-line hamburger (40px wide, 3px lines), 24px gap.
- Header starts at `opacity-0` and fades in; text colour spring-wood (#F6F3EF-ish) on the dark intro.
- Intro: full-viewport background photo with a dark scrim (~50% black), 6 photos.
- Poem: Degular Medium 500, 64px / 1.2 (32px under 768px), left aligned in the container,
  starts ~60% down the viewport and scrolls up.
- Keywords (`keyword: true`) render pure white; other text is dimmed white (~0.55);
  unread text dims further (`--scroller-dim-text-opacity: .15`).
  Keywords can be partial words ("can" + "ary"), so the hidden sentence reads:
  "We can rewrite the story to one where we ALL work together to fight for a liveable future."
- "Skip Intro →" bottom-right, ~28px, white.
- Outro line: "Here's how we rewrite the story..." then the card grid.

## Motion spec (as rebuilt)
| Element | Trigger | Movement | Duration / easing |
|---|---|---|---|
| Header | page load | opacity 0 → 1 | 1s ease |
| Poem block | scroll (scrubbed) | translateY from 60vh to above the fold | linear to scroll |
| Words | crossing a reading line at 60% vh | dim .15 → read .55 (keywords → 1) | 400ms ease-out |
| Backgrounds | scroll progress buckets | crossfade + slow 1.08 → 1 scale | 1.2s ease |
| End reveal | poem finished | non-keywords → .06 so the keyword sentence remains | 800ms |
| Outro | final 12% of scroll | poem fades, outro line fades + rises 24px | 800ms |
| Skip Intro | click | jumps to the next section | smooth scroll |

Fonts: Degular is a commercial font that we do not have, so the clone uses Instrument Sans 500 as the nearest free match.
