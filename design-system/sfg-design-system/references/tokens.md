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
| `action/primary-hover` | red/700 | red/700 | Primary button hover |
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

| Style | Family | Weight | Size | Line height | Letter spacing |
|---|---|---|---|---|---|
| **H1** | Thmanyah Serif Display | Bold 700 | 64px | 72px | -1px |
| **H2** | Thmanyah Serif Display | Bold 700 | 48px | 56px | -0.8px |
| **H3** | Thmanyah Serif Display | Bold 700 | 40px | 48px | -0.6px |
| **H4** | Thmanyah Serif Display | Bold 700 | 32px | 40px | -0.4px |
| **H5** | Thmanyah Serif Display | Bold 700 | 24px | 32px | -0.2px |
| **H6** | Thmanyah Serif Display | Bold 700 | 20px | 28px | 0 |
| **Title** | Thmanyah Sans | Medium 500 | 28px | 36px | 0 |
| **Title1** | Thmanyah Sans | Medium 500 | 20px | 28px | 0 |
| **Title2** | Thmanyah Sans | Medium 500 | 18px | 26px | 0 |
| **Title3** | Thmanyah Sans | Medium 500 | 16px | 24px | 0 |
| **Body1** | Thmanyah Serif Text | Regular 400 | 18px | 28px | 0 |
| **Body2** | Thmanyah Serif Text | Regular 400 | 16px | 26px | 0 |
| **Body3** | Thmanyah Serif Text | Regular 400 | 14px | 22px | 0 |

Line heights sit on a 4px grid. On mobile, scale H1–H3 down fluidly (suggested `clamp()` values are in the CSS below).

---

## 3. CSS (ready to paste)

**Font loading (bundled, per the licence).** Example with Next.js; any bundler that fingerprints and packages the files works the same way. Keep the font files in a private source folder (e.g. `src/fonts/`), not in `public/`.

```ts
// src/app/fonts.ts
import localFont from "next/font/local";

export const sfgDisplay = localFont({
  src: [{ path: "../fonts/thmanyahserifdisplay-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-sfg-display", display: "swap",
});
export const sfgText = localFont({
  src: [{ path: "../fonts/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-sfg-text", display: "swap",
});
export const sfgSans = localFont({
  src: [
    { path: "../fonts/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/thmanyahsans-Medium.woff2",  weight: "500", style: "normal" },
    { path: "../fonts/thmanyahsans-Bold.woff2",    weight: "700", style: "normal" },
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

  --h1-size:clamp(40px,4.5vw,64px);--h1-lh:1.125;--h1-ls:-1px;
  --h2-size:clamp(34px,3.4vw,48px);--h2-lh:1.167;--h2-ls:-0.8px;
  --h3-size:clamp(30px,2.8vw,40px);--h3-lh:1.2;--h3-ls:-0.6px;
  --h4-size:32px;--h4-lh:40px;--h4-ls:-0.4px;
  --h5-size:24px;--h5-lh:32px;--h5-ls:-0.2px;
  --h6-size:20px;--h6-lh:28px;
  --title-size:28px;--title-lh:36px;
  --title1-size:20px;--title1-lh:28px;
  --title2-size:18px;--title2-lh:26px;
  --title3-size:16px;--title3-lh:24px;
  --body1-size:18px;--body1-lh:28px;
  --body2-size:16px;--body2-lh:26px;
  --body3-size:14px;--body3-lh:22px;
}

/* Semantic: dark (system preference, unless forced light) */
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --color-bg-page:#101B16;--color-bg-surface:#16241D;--color-bg-surface-alt:#1B2B23;--color-bg-inverse:#0B1510;
  --color-text-primary:#EFE8DB;--color-text-secondary:#B9AE9F;--color-text-heading:#A9CBB9;--color-text-on-inverse:#EFE8DB;
  --color-text-achievement:#DBBA80;--color-action-secondary:#A9CBB9;--color-border-subtle:#2E4238;--color-border-focus:#A9CBB9;
  --color-accent-achievement:#DBBA80;--color-accent-number:var(--red-400);--color-pen-default:#E27760;--color-pen-soft:#7D4A3E;
}}
:root[data-theme="dark"]{
  --color-bg-page:#101B16;--color-bg-surface:#16241D;--color-bg-surface-alt:#1B2B23;--color-bg-inverse:#0B1510;
  --color-text-primary:#EFE8DB;--color-text-secondary:#B9AE9F;--color-text-heading:#A9CBB9;--color-text-on-inverse:#EFE8DB;
  --color-text-achievement:#DBBA80;--color-action-secondary:#A9CBB9;--color-border-subtle:#2E4238;--color-border-focus:#A9CBB9;
  --color-accent-achievement:#DBBA80;--color-accent-number:var(--red-400);--color-pen-default:#E27760;--color-pen-soft:#7D4A3E;
}

/* Type scale classes */
.h1{font:700 var(--h1-size)/var(--h1-lh) var(--font-display);letter-spacing:var(--h1-ls)}
.h2{font:700 var(--h2-size)/var(--h2-lh) var(--font-display);letter-spacing:var(--h2-ls)}
.h3{font:700 var(--h3-size)/var(--h3-lh) var(--font-display);letter-spacing:var(--h3-ls)}
.h4{font:700 var(--h4-size)/var(--h4-lh) var(--font-display);letter-spacing:var(--h4-ls)}
.h5{font:700 var(--h5-size)/var(--h5-lh) var(--font-display);letter-spacing:var(--h5-ls)}
.h6{font:700 var(--h6-size)/var(--h6-lh) var(--font-display)}
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
