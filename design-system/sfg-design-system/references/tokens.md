# Scholarships for Ghazza: Design Tokens

Source of truth: Figma file "SFG Landing page" (variables: `Primitives`, `Color`, `Layout`; text styles: `SFG Type Scale/*`).
Use the **semantic tokens** in components. Primitives are raw values and should not be used directly in UI code.

---

## 1. Color

### 1.1 Primitives

| Scale | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| **red** (tatreez red) | #FAF2F0 | #F3E1DD | #EFBEB3 | #E69A89 | #E27760 | **#D94F30** | #C24124 | #9F351D | #7D2A17 | #5A1E11 |
| **green** (olive) | #EEF4F1 | #D8E6DF | #B7D3C6 | #8DB5A3 | #5E927B | #3A7560 | **#1F5D46** | #184937 | #123628 | #0D261D |
| **ochre** | #F7F4ED | #EEE6D8 | #E6D1AD | #DBBA80 | #CFA458 | **#C8963E** | #A77C30 | #876426 | #674C1D | #473514 |

Bold = base brand value (red 500 and green 600 are sampled from SFG's own brand assets).

**Neutrals:** white #FFFFFF · paper #FBF8F2 · linen #F7F2E9 · sand #EDE4D3 · border #DDD2BF · muted #6B6158 · ink #1E1A16

**Night (dark mode):** bg #101B16 · surface #16241D · surface-alt #1B2B23 · border #2E4238 · text #EFE8DB · text-2 #B9AE9F · heading #A9CBB9 · inverse #0B1510 · thread #E27760 · thread-soft #7D4A3E · achieve #DBBA80

**Feedback:** error #B42318

### 1.2 Semantic tokens (Light / Dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg/page` | linen | night/bg | Page background |
| `bg/surface` | paper | night/surface | Cards, panels |
| `bg/surface-alt` | sand | night/surface-alt | Alternating sections |
| `bg/inverse` | green/700 | night/inverse | Dark feature sections, footer |
| `bg/field` | white | white | Inputs |
| `bg/selected` | green/50 | green/50 | Selected states |
| `text/primary` | ink | night/text | Body text |
| `text/secondary` | muted | night/text-2 | Captions, metadata |
| `text/heading` | green/600 | night/heading | Headlines, chapter labels |
| `text/on-inverse` | linen | night/text | Text on dark sections |
| `text/on-action` | white | white | Text on red buttons |
| `text/on-panel` | ink | ink | Text on light panels inside dark sections |
| `text/achievement` | ochre/700 | night/achieve | Ochre text (contrast-safe) |
| `text/error` | feedback/error | feedback/error | Form errors |
| `action/primary` | red/600 | red/600 | Primary button fill (Become a mentor) |
| `action/primary-hover` | red/700 | red/700 | Primary button hover (the panel that slides up) |
| `action/secondary-hover` | green/700 | green/100 | Green filled button hover |
| `action/secondary` | green/600 | night/heading | Outline buttons, text links |
| `border/subtle` | border | night/border | Dividers, card borders |
| `border/selected` | green/600 | green/600 | Selected outline |
| `border/focus` | green/600 | night/heading | Focus ring |
| `accent/achievement` | ochre/500 | night/achieve | Numbers, map pins, scholarship names |
| `accent/number` | red/600 | red/400 | Large stat numbers |
| `pen/default` | red/500 | night/thread | Mentor's red-pen marks (signature motion) |
| `pen/soft` | red/200 | night/thread-soft | Faded marks (memorial section) |

> Note: in Figma these two are named `thread/default` and `thread/soft` (legacy names). In code, use `pen/*`.

### 1.3 Color rules
- **Ratio:** about 60% linen/neutrals, 30% green + ink, 10% red.
- **Red means action.** `action/primary` is used only for "Become a mentor". Don't use red decoratively, except the red-pen motion.
- **Contrast:** white on red/500 is 4.1:1 (fails for normal text), so buttons use **red/600** (5.2:1). Ochre fails as text on light backgrounds, so use `text/achievement` (ochre/700, 4.9:1).
- **Memorial section:** sand background, ink and muted text, `pen/soft` only. No ochre, no strong red, no CTAs.

---

## 2. Typography

### 2.1 Families

| Role | Family | Fallback stack |
|---|---|---|
| Headings (H1–H6), large display | **Thmanyah Serif Display** | "Newsreader", Georgia, serif |
| Body (Body1–3) | **Thmanyah Serif Text** | "Newsreader", Georgia, serif |
| Titles, UI, buttons, labels, Arabic UI | **Thmanyah Sans** | "Readex Pro", system-ui, sans-serif |

Thmanyah weights available: Light 300 · Regular 400 · Medium 500 · Bold 700 · Black 900. All three families support Arabic and Latin.

> **Licence (font.thmanyah.com/licenses):** Commercial use on websites and apps is allowed, and the font may be embedded in a website **only as part of a bundled, packaged or obfuscated product**. Implementation rules:
> - Bundle the fonts through the build pipeline (e.g. `next/font/local` in Next.js, or Vite's asset pipeline with hashed filenames), so they ship as part of the built product.
> - Do **not** expose the raw font files: no public `/fonts` folder with original filenames, no download links, no CDN copy, no committing the font files to a public repository.
> - Do **not** modify, rename, subset-and-republish or convert the fonts into a "new" font, and keep the copyright metadata intact.
> - Source the files only from font.thmanyah.com.
> - Optional: a short email to Ask@thmanyah.com for written confirmation, since this is a third-party project.

### 2.2 Type scale

Sizes are in `rem` (1rem = 16px), line heights are unitless and letter spacing is in `em`, so text follows the reader's browser font size. The px values are what they render at by default.

| Style | Family | Weight | Size (desktop → phone) | Line height | Letter spacing | Use |
|---|---|---|---|---|---|---|
| **Display** | Thmanyah Serif Display | Medium 500 | 64px → 40px (fluid, the H1 size) | 1.1 | -0.02em | One very large statement per page, e.g. a list of university names. Not a heading level. In a long list on phones, step down to the H4 size. |
| **H1** | Thmanyah Serif Display | Medium 500 | 64px → 40px (fluid) | 1.125 (72px) | -0.0156em (-1px) | The page's main heading |
| **H2** | Thmanyah Serif Display | Medium 500 | 48px → 34px (fluid) | 1.167 (56px) | -0.0167em (-0.8px) | Every section title, one size across the page |
| **H3** | Thmanyah Serif Display | Medium 500 | 40px → 30px (fluid) | 1.2 (48px) | -0.015em (-0.6px) | A heading inside a section, below its H2 |
| **H4** | Thmanyah Serif Display | Medium 500 | 32px → 28px (fluid) | 1.25 (40px) | -0.0125em (-0.4px) | |
| **H5** | Thmanyah Serif Display | Medium 500 | 24px | 1.333 (32px) | -0.0083em (-0.2px) | |
| **H6** | Thmanyah Serif Display | Medium 500 | 20px | 1.4 (28px) | 0 | |
| **Quote** | Thmanyah Serif Text | Medium 500 | 40px → 30px (fluid) | 1.2 | -0.015em | A large pull quote (testimonials). Serif Text rather than Display, so it reads as a voice rather than a heading. |
| **Title** | Thmanyah Sans | Medium 500 | 28px | 1.286 (36px) | 0 | |
| **Title1** | Thmanyah Sans | Medium 500 | 20px | 1.4 (28px) | 0 | |
| **Title2** | Thmanyah Sans | Medium 500 | 18px | 1.444 (26px) | 0 | |
| **Title3** | Thmanyah Sans | Medium 500 | 16px | 1.5 (24px) | 0 | Eyebrows, labels, buttons |
| **Body1** | Thmanyah Serif Text | Regular 400 | 18px | 1.556 (28px) | 0 | |
| **Body2** | Thmanyah Serif Text | Regular 400 | 16px | 1.625 (26px) | 0 | |
| **Body3** | Thmanyah Serif Text | Regular 400 | 14px | 1.571 (22px) | 0 | |

Line heights sit on a 4px grid. On phones H1–H4 and Quote scale down fluidly (the `clamp()` values are in the CSS below); each heading level stays smaller than the one above it at every width.

**Rules for using the scale**
- Heading sizes descend with level: an H3 is never the same size as the H2 it sits under. All section titles use H2.
- Weights: **Medium 500 is the heaviest weight anywhere; nothing is Bold.** Serif Display Medium (H1–H6, Display); Serif Text Regular (body) and Medium (Quote); Sans Medium (titles, buttons). Don't set a weight the font loading below doesn't include, or the browser shows a different one.
- Cap body text at 60–75 characters a line (about `54ch`–`62ch` for Serif Text at 18px).
- Body copy uses `text-wrap: pretty`; headings and short lines use `text-wrap: balance`.

---

## 3. CSS (ready to paste)

**Font loading (bundled, per the licence).** Example with Next.js; any bundler that fingerprints and packages the files works the same way. Keep the font files in a private source folder (e.g. `src/fonts/`), not in `public/`.

```ts
// src/app/fonts.ts
import localFont from "next/font/local";

export const sfgDisplay = localFont({
  src: [
    { path: "../fonts/thmanyahserifdisplay-Medium.woff2", weight: "500", style: "normal" },  // H1–H6 and Display
  ],
  variable: "--font-sfg-display", display: "swap",
});
export const sfgText = localFont({
  src: [
    { path: "../fonts/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" },  // Body1–3
    { path: "../fonts/thmanyahseriftext-Medium.woff2",  weight: "500", style: "normal" },  // Quote
  ],
  variable: "--font-sfg-text", display: "swap",
});
export const sfgSans = localFont({
  src: [
    { path: "../fonts/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/thmanyahsans-Medium.woff2",  weight: "500", style: "normal" },
  ],
  variable: "--font-sfg-sans", display: "swap",
});
// Apply on <html>: className={`${sfgDisplay.variable} ${sfgText.variable} ${sfgSans.variable}`}
```

File names above match the Thmanyah download (adjust if the Serif files are named differently). Add the font folder to `.gitignore` if the repository is public.

```css
:root{
  /* Primitives */
  --red-50:#FAF2F0;--red-100:#F3E1DD;--red-200:#EFBEB3;--red-300:#E69A89;--red-400:#E27760;
  --red-500:#D94F30;--red-600:#C24124;--red-700:#9F351D;--red-800:#7D2A17;--red-900:#5A1E11;
  --green-50:#EEF4F1;--green-100:#D8E6DF;--green-200:#B7D3C6;--green-300:#8DB5A3;--green-400:#5E927B;
  --green-500:#3A7560;--green-600:#1F5D46;--green-700:#184937;--green-800:#123628;--green-900:#0D261D;
  --ochre-50:#F7F4ED;--ochre-100:#EEE6D8;--ochre-200:#E6D1AD;--ochre-300:#DBBA80;--ochre-400:#CFA458;
  --ochre-500:#C8963E;--ochre-600:#A77C30;--ochre-700:#876426;--ochre-800:#674C1D;--ochre-900:#473514;
  --neutral-white:#FFFFFF;--neutral-paper:#FBF8F2;--neutral-linen:#F7F2E9;--neutral-sand:#EDE4D3;
  --neutral-border:#DDD2BF;--neutral-muted:#6B6158;--neutral-ink:#1E1A16;
  --feedback-error:#B42318;

  /* Semantic: light */
  --color-bg-page:var(--neutral-linen);
  --color-bg-surface:var(--neutral-paper);
  --color-bg-surface-alt:var(--neutral-sand);
  --color-bg-inverse:var(--green-700);
  --color-bg-field:var(--neutral-white);
  --color-bg-selected:var(--green-50);
  --color-text-primary:var(--neutral-ink);
  --color-text-secondary:var(--neutral-muted);
  --color-text-heading:var(--green-600);
  --color-text-on-inverse:var(--neutral-linen);
  --color-text-on-action:var(--neutral-white);
  --color-text-on-panel:var(--neutral-ink);
  --color-text-achievement:var(--ochre-700);
  --color-text-error:var(--feedback-error);
  --color-action-primary:var(--red-600);
  --color-action-primary-hover:var(--red-700);
  --color-action-secondary:var(--green-600);
  --color-action-secondary-hover:var(--green-700);
  --color-border-subtle:var(--neutral-border);
  --color-border-selected:var(--green-600);
  --color-border-focus:var(--green-600);
  --color-accent-achievement:var(--ochre-500);
  --color-accent-number:var(--red-600);
  --color-pen-default:var(--red-500);
  --color-pen-soft:var(--red-200);

  /* Typography */
  --font-display:var(--font-sfg-display),"Newsreader",Georgia,serif;
  --font-text:var(--font-sfg-text),"Newsreader",Georgia,serif;
  --font-sans:var(--font-sfg-sans),"Readex Pro",system-ui,-apple-system,"Segoe UI",sans-serif;

  /* rem sizes, unitless line heights, em tracking: same render as the px values, but they follow the browser font size */
  --display-size:var(--h1-size);--display-lh:1.1;--display-ls:-.02em;   /* the H1 size (40 → 64) in Medium */
  --h1-size:clamp(2.5rem,4.5vw,4rem);--h1-lh:1.125;--h1-ls:-.0156em;        /* 64/72 */
  --h2-size:clamp(2.125rem,3.4vw,3rem);--h2-lh:1.167;--h2-ls:-.0167em;      /* 48/56 */
  --h3-size:clamp(1.875rem,2.8vw,2.5rem);--h3-lh:1.2;--h3-ls:-.015em;       /* 40/48 */
  --h4-size:clamp(1.75rem,2.2vw,2rem);--h4-lh:1.25;--h4-ls:-.0125em;        /* 32/40, 28 on phones so it stays below H3 */
  --h5-size:1.5rem;--h5-lh:1.3333;--h5-ls:-.0083em;                         /* 24/32 */
  --h6-size:1.25rem;--h6-lh:1.4;                                            /* 20/28 */
  --quote-size:var(--h3-size);--quote-lh:1.2;--quote-ls:-.015em;            /* 40 → 30 */
  --title-size:1.75rem;--title-lh:1.2857;      /* 28/36 */
  --title1-size:1.25rem;--title1-lh:1.4;       /* 20/28 */
  --title2-size:1.125rem;--title2-lh:1.4444;   /* 18/26 */
  --title3-size:1rem;--title3-lh:1.5;          /* 16/24 */
  --body1-size:1.125rem;--body1-lh:1.5556;     /* 18/28 */
  --body2-size:1rem;--body2-lh:1.625;          /* 16/26 */
  --body3-size:.875rem;--body3-lh:1.5714;      /* 14/22 */
}

/* Semantic: dark (system preference, unless forced light) */
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --color-bg-page:#101B16;--color-bg-surface:#16241D;--color-bg-surface-alt:#1B2B23;--color-bg-inverse:#0B1510;
  --color-text-primary:#EFE8DB;--color-text-secondary:#B9AE9F;--color-text-heading:#A9CBB9;--color-text-on-inverse:#EFE8DB;
  --color-text-achievement:#DBBA80;--color-action-secondary:#A9CBB9;--color-action-secondary-hover:#D8E6DF;--color-border-subtle:#2E4238;--color-border-focus:#A9CBB9;
  --color-accent-achievement:#DBBA80;--color-accent-number:var(--red-400);--color-pen-default:#E27760;--color-pen-soft:#7D4A3E;
}}
:root[data-theme="dark"]{
  --color-bg-page:#101B16;--color-bg-surface:#16241D;--color-bg-surface-alt:#1B2B23;--color-bg-inverse:#0B1510;
  --color-text-primary:#EFE8DB;--color-text-secondary:#B9AE9F;--color-text-heading:#A9CBB9;--color-text-on-inverse:#EFE8DB;
  --color-text-achievement:#DBBA80;--color-action-secondary:#A9CBB9;--color-action-secondary-hover:#D8E6DF;--color-border-subtle:#2E4238;--color-border-focus:#A9CBB9;
  --color-accent-achievement:#DBBA80;--color-accent-number:var(--red-400);--color-pen-default:#E27760;--color-pen-soft:#7D4A3E;
}

/* Type scale classes */
.display{font:500 var(--display-size)/var(--display-lh) var(--font-display);letter-spacing:var(--display-ls)}
.h1{font:500 var(--h1-size)/var(--h1-lh) var(--font-display);letter-spacing:var(--h1-ls)}
.h2{font:500 var(--h2-size)/var(--h2-lh) var(--font-display);letter-spacing:var(--h2-ls)}
.h3{font:500 var(--h3-size)/var(--h3-lh) var(--font-display);letter-spacing:var(--h3-ls)}
.h4{font:500 var(--h4-size)/var(--h4-lh) var(--font-display);letter-spacing:var(--h4-ls)}
.h5{font:500 var(--h5-size)/var(--h5-lh) var(--font-display);letter-spacing:var(--h5-ls)}
.h6{font:500 var(--h6-size)/var(--h6-lh) var(--font-display)}
.quote{font:500 var(--quote-size)/var(--quote-lh) var(--font-text);letter-spacing:var(--quote-ls)}
.title{font:500 var(--title-size)/var(--title-lh) var(--font-sans)}
.title1{font:500 var(--title1-size)/var(--title1-lh) var(--font-sans)}
.title2{font:500 var(--title2-size)/var(--title2-lh) var(--font-sans)}
.title3{font:500 var(--title3-size)/var(--title3-lh) var(--font-sans)}
.body1{font:400 var(--body1-size)/var(--body1-lh) var(--font-text)}
.body2{font:400 var(--body2-size)/var(--body2-lh) var(--font-text)}
.body3{font:400 var(--body3-size)/var(--body3-lh) var(--font-text)}
```

---

## 4. Grid, spacing and touch targets

### 4.1 Grid

| Breakpoint | Screen | Columns | Gutter | Margin | Column width |
|---|---|---|---|---|---|
| **Desktop** | 1440px | 12 | 20px | 160px | 75px (stretch) |
| **Mobile** | 390px | 4 | 24px | 20px | 69.5px (stretch) |

Columns stretch to fill the space between the margins. Figma grid styles: `SFG Grid/Desktop 1440`, `SFG Grid/Mobile 390`.

```css
:root{--grid-columns:12;--grid-gutter:20px;--grid-margin:160px}
@media (max-width:767px){:root{--grid-columns:4;--grid-gutter:24px;--grid-margin:20px}}
.container{padding-inline:var(--grid-margin);display:grid;grid-template-columns:repeat(var(--grid-columns),minmax(0,1fr));column-gap:var(--grid-gutter)}
```
Between 768px and 1439px, scale the margin fluidly (e.g. `--grid-margin: clamp(20px, 11vw, 160px)`) so content never touches the edges.

### 4.2 Spacing scale

**2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 56 · 64 · 96 · 128** (px). Use only these values for padding, gaps and margins between elements.

**Section scale: 160 · 192 · 256** (px). Only for space between large blocks: the rows of a step-by-step sequence (picture beside text), or between sections. On phones (≤ 991px) step down one level: 256 → 160, 192 → 128, 160 → 96.

```css
:root{--space-2:2px;--space-4:4px;--space-8:8px;--space-12:12px;--space-16:16px;--space-20:20px;--space-24:24px;--space-32:32px;--space-48:48px;--space-56:56px;--space-64:64px;--space-96:96px;--space-128:128px;
  /* section scale */
  --space-160:160px;--space-192:192px;--space-256:256px}
```

### 4.3 Radius
sm 4 · media 6 · card 8 · panel 10 · full 999 (px)

### 4.4 Touch targets
**Minimum height 48px** for every interactive element: buttons, link-buttons, toggle options, inputs and icon controls (`--size-touch-min: 48px`). Buttons: Small 48px, Large 52px.

---

## 5. Motion and icons

Easing tokens (add to `:root`): `--ease-out:cubic-bezier(.22,1,.36,1)`, `--ease-out-expo:cubic-bezier(.16,1,.3,1)`, `--ease-smooth:cubic-bezier(.38,.005,.215,1)`. Under `prefers-reduced-motion: reduce` every effect below shows its final state with no movement.

### 5.1 Text reveal animation
The one way text appears on the page (After cambium.com; used by About and Our story first). **Every piece of content text uses it**: eyebrows, headings, body copy, card names and quotes, list points, footer text. Controls (buttons, links, pagers, form mock-ups) don't.
- The text is split into its rendered lines; each line sits in a mask (`overflow:hidden`) and rises from `translateY(110%)` to `0`.
- **Duration 1.1s**, `--ease-out-expo`, **0.08s between lines**. Elements revealed together (eyebrow → title → text) continue one stagger, so the block reads top to bottom.
- Starts when the element is 12% inside the viewport (the page's last lines start once the page is scrolled to the bottom). Plays once.
- Hidden-until-shown content (an accordion topic, the next slide of a carousel) plays when it is shown.
- Markup that must stay whole (a word with a pen mark) rises as one block.
- After the animation the original markup is restored, so text reflows normally on resize. Screen readers get the full text throughout (`aria-label` on the element while split).

```css
.st-line{display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
.st-in{display:block;transform:translate3d(0,110%,0);transition:transform 1.1s var(--ease-out-expo) var(--d,0s)}
.is-in .st-in{transform:none}
```

### 5.2 Section-title dot
Every section title (the H2 of a section) has a small round dot on its reading-start side (left in English, right in Arabic) in the title's colour.
- Size `max(8px, .25em)`, gap `max(8px, .33em)`, centred on the first line (`top: calc(.5lh - size / 2)`).
- Desktop: it hangs in the margin, so the title stays on the grid line. Phones: the title steps in by dot + gap.
- **Motion:** the dot scales in first (0.5s, `--ease-out-expo`), and the title's lines start 0.32s later (4 stagger steps). The dot stays.

### 5.3 Button motion: primary (filled) buttons
After cambium.com. The button clips two layers:
- **Default layer** (the label): on hover it moves up 25% and scales to 0.85 over 0.95s.
- **Hover layer** (`action/*-hover` background and a copy of the label): it starts one full height below and slides up to cover the button over 0.45s, after 50ms. Its label starts 25% low and settles after 65ms.
- Easing `--ease-smooth`. Leaving reverses the motion in 0.45s.
- Only on devices with hover and a fine pointer and with motion allowed. Otherwise the button just switches to the hover colour. Press: scale 0.96.

### 5.4 Button motion: secondary (text links with an arrow)
After cambium.com's "Arbor Wood Co. →". No underline at rest. On hover a 1/16em line in the text colour draws in from the reading start (`scaleX` 0 → 1, or a background-size sweep for links that wrap), 0.735s, `--ease-smooth`. On leave it retracts toward the end. On touch screens the line stays visible, since there is no hover.

### 5.5 Arrows
One arrow shape everywhere, as inline SVG with `fill="currentColor"`: **Full arrow** (→) for links and buttons, rotated −45° for an external link (↗), 90° for "scroll down". **Chevron** for carousel previous / next. Sizes 16, 20 or 28px. Flip with `scaleX(-1)` in RTL.

```html
<!-- Full arrow (right) -->
<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.6709 4.66504C14.7728 6.86859 16.4363 8.53812 17.8438 9.66406C18.5448 10.2249 19.1754 10.6453 19.6279 10.9238C19.8538 11.0628 20.0347 11.1668 20.1572 11.2344C20.2184 11.2681 20.2657 11.2927 20.2959 11.3086C20.3106 11.3163 20.3214 11.3218 20.3281 11.3252C20.3313 11.3268 20.3337 11.3285 20.335 11.3291L21.6768 12L20.335 12.6699L20.3359 12.6709H20.335C20.3337 12.6715 20.3313 12.6732 20.3281 12.6748C20.3214 12.6782 20.3106 12.6837 20.2959 12.6914C20.2657 12.7073 20.2184 12.7319 20.1572 12.7656C20.0347 12.8332 19.8538 12.9372 19.6279 13.0762C19.1754 13.3547 18.5448 13.7751 17.8438 14.3359C16.4363 15.4619 14.7728 17.1314 13.6709 19.335L12.3291 18.665C13.5606 16.2021 15.3971 14.3714 16.9062 13.1641C17.0903 13.0168 17.2706 12.8793 17.4443 12.75H4V11.25H17.4443C17.2706 11.1207 17.0903 10.9832 16.9062 10.8359C15.3971 9.62861 13.5606 7.79788 12.3291 5.33496L13.6709 4.66504Z"/></svg>
<!-- Chevron (right; rotate 180 for previous) -->
<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8.6709 4.66504C9.77277 6.86859 11.4363 8.53812 12.8438 9.66406C13.5448 10.2249 14.1754 10.6453 14.6279 10.9238C14.8538 11.0628 15.0347 11.1668 15.1572 11.2344C15.2184 11.2681 15.2657 11.2927 15.2959 11.3086C15.3106 11.3163 15.3214 11.3218 15.3281 11.3252C15.3313 11.3268 15.3337 11.3285 15.335 11.3291L16.6768 12L15.335 12.6699L15.3359 12.6709H15.335C15.3337 12.6715 15.3313 12.6732 15.3281 12.6748C15.3214 12.6782 15.3106 12.6837 15.2959 12.6914C15.2657 12.7073 15.2184 12.7319 15.1572 12.7656C15.0347 12.8332 14.8538 12.9372 14.6279 13.0762C14.1754 13.3547 13.5448 13.7751 12.8438 14.3359C11.4363 15.4619 9.77277 17.1314 8.6709 19.335L7.3291 18.665C8.56056 16.2021 10.3971 14.3714 11.9062 13.1641C12.5123 12.6793 13.0708 12.292 13.5234 12C13.0708 11.708 12.5123 11.3207 11.9062 10.8359C10.3971 9.62861 8.56056 7.79788 7.3291 5.33496L8.6709 4.66504Z"/></svg>
```
