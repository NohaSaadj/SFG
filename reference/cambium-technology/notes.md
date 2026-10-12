# Reference notes: cambium.com/technology, section 2 (`how_wrap`, `data-module="process-line"`)

Source: page source pasted by the user (structure below) and the user's screenshot `original-how-section.jpg`
(two captures stitched: "Sourcing" on top, "Transport" below). The live page, its Webflow CSS
(`cambium-staging.webflow.shared.*.css`) and its motion bundle (`cambium-eight.vercel.app/app.js`) could not be
reached from the build sandbox (network policy), so sizes come from the screenshot and motion from the
data attributes plus what the screenshot shows. Inferred details are marked *(inferred)*.

## Structure (verbatim from the source)
```
section.how_wrap.u-section [data-module="process-line"][data-process-start="top center"][data-process-end="bottom center"]
  .u-section-spacer (large)
  .how_contain.u-container
    .how_layout.u-grid-autofill            × 5, alternating sides
      .how_content.u-alignment-center
        .how_content_anchor [data-process-dot]
        .how_text_wrap
          h2 (H1 text style)               Sourcing / Transport / Processing / Buy and build / An industry that grows back
          p  (text-main)
          .u-button-wrapper                secondary button on rows 3, 4, 5 (Become a Partner, Our Materials, Impact)
          .how_text_bg                     hides the line behind the text
      .how_visual > .u-image-wrapper(cover) > img     product shots, landscape
  .u-section-spacer (large)
```
Row order: text | picture, picture | text, text | picture, picture | text, text | picture.

## Measurements (screenshot ≈ 1920 px wide; values at 1440 are ×0.75)
| Item | Reference | At 1440 | SFG mapping |
|---|---|---|---|
| Background | #FAF2E7 | | `--color-bg-page` (linen #F7F2E9) |
| Step heading | ~62 px grotesk, dark brown, centred | ~46 px | `.h2` (48 px), `--color-text-heading` |
| Paragraph | ~20/28 px, ~467 px wide, centred | ~18/28, ~350 px | `.body1`, 36ch, `--color-text-secondary` |
| Dot | solid accent circle ~13 px | 12 px | 12 px, `--color-pen-default` (the mentor's red pen) |
| Dot → heading | ~30 px | ~24 px | `--space-24` |
| Heading → paragraph | ~16 px | ~12–16 px | `--space-16` |
| Line | 1.5 px, ink at ~24 % (rendered rgb 200,192,181) | | `--color-line-process` |
| Picture | ~48.5 % of the width, ~24 px from the page edge, own ratio (1.65, 1.5) | ~700 px | columns 7–12 plus the margin, 24 px from the edge |
| Text vs picture | text block vertically centred on the picture | | `align-items:center` |
| Row gap | ~198 px between pictures | ~150 px | `--space-128` |

## Motion spec
| Element | Trigger | Movement | Notes |
|---|---|---|---|
| Line | scroll, section top at mid-screen → bottom at mid-screen (`top center` → `bottom center`) | drawn from the first dot to the last, scrubbed | one path through every dot, vertical at each dot, S-curve between sides |
| Line behind text | always | hidden by a soft patch of the background behind each text block, so it fades out under the dot and back in below the text | visible in the screenshot as a short tick under each dot |
| Pictures | scroll *(inferred)* | drift outwards near the screen edges and settle when centred (the "Transport" picture sits ~70 px further out while entering, cropped by the page edge) | about 64 px |
| Dots | none seen | static | |
| Text | none in this section | static (the page's split-text module is only on the next section) | SFG keeps its page-wide line reveal for consistency |
| Mobile | | one column, centred text, picture under it *(inferred)* | |
