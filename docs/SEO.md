# SEO audit

**Date:** 14 November 2026. **Tools:** Lighthouse 12 (mobile and desktop), html-validate, a Playwright crawl (headings, links, IDs, images), a manual review against Google Search Central guidance and schema.org.

**Result:** Lighthouse SEO is **100** on mobile and desktop, in English and in Arabic.

## What is in place

| Area | Standard | Implementation |
|---|---|---|
| Title | Unique, under 60 characters, brand plus purpose | "Scholarships for Ghazza · Mentorship for students from Gaza", and in Arabic "منح لغزة · إرشاد لطلاب غزة" |
| Meta description | 120–160 characters, says what the page offers | 151 characters: mentorship, Gaza, fully funded scholarships, free |
| Canonical | One preferred URL | `<link rel="canonical">` |
| Languages | hreflang between language versions | `en`, `ar` (`?lang=ar`), `x-default`, in the HTML and in `sitemap.xml` |
| Language of the page | `lang` and `dir` on `<html>` | `en`/`ltr`, switched to `ar`/`rtl` before content renders; English names inside Arabic are marked `lang="en"` |
| Crawling | robots.txt and sitemap | `robots.txt` allows everything and points to `sitemap.xml` |
| Structured data | schema.org JSON-LD | `NGO` with name, alternate names (SFG, منح لغزة), logo, founder, email, area served, languages and `sameAs` social profiles |
| Sharing | Open Graph, X/Twitter card | 1200×630 social card, title, description, alt text, locale and alternate locale |
| Headings | One `h1`, a logical outline | One `h1` (site name), an `h2` for each section, an `h3` for each card or step; no skipped levels |
| Links | Crawlable, descriptive | Real `<a href>` for all navigation; every link text says where it goes; no broken in-page links |
| Images | `alt`, dimensions, modern formats | Every `<img>` has `alt` (empty for decorative ones), `width` and `height` (no layout shift: CLS 0), WebP, lazy below the fold |
| Mobile | Mobile-first indexing | Responsive from 320px, 44px+ tap targets, no text under 14px, no horizontal scroll |
| Speed | Core Web Vitals | CLS 0, TBT 40–80 ms; LCP 1.3s on desktop and 5.3s on mobile (the intro's 2s opening, see below) |
| Icons | favicon, touch icon, manifest | `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, `theme-color` |
| Accessibility | It helps ranking and reach | Lighthouse Accessibility 100, axe-core 0 violations |

## Findings and fixes in this pass

| # | Finding | Fix |
|---|---|---|
| SEO-1 | The Arabic version had no URL of its own: it lived only in the reader's saved choice, so search engines could never see it. | `?lang=ar` loads Arabic and is linked with hreflang, so Google renders and indexes it. The language switch updates the address. |
| SEO-2 | No canonical, Open Graph, social card or structured data | Added (see the table above). |
| SEO-3 | Generic title ("Scholarships for Ghazza") | It now says what the site does, in both languages. |
| SEO-4 | No favicon (a 404 in the console), no robots.txt, no sitemap | Added. |
| SEO-5 | Mobile images were heavier than needed (2.8 MB page) | Story photos converted from JPEG to WebP (−50%), intro photos get a 960px phone size, partner logos converted to WebP, lazy loading on the timeline. Page down to about 2.2 MB. |
| SEO-6 | "Become a partner" pointed at a missing anchor (`#partner-with-us`) | It now opens an email to SFG with the subject "Partnering with SFG". |
| SEO-7 | The visible label of the language switch was not in its accessible name (WCAG 2.5.3) | The name is now "EN ع, Switch to Arabic". |

## Known limits and next steps

1. **Set the real domain.** Every absolute URL uses `https://www.scholarshipsforghazza.org/` as a placeholder (search for `SITE_URL`).
2. **Mobile LCP (5.3s).** The intro deliberately holds a dark screen for 2s before the story starts, and Lighthouse counts that. To improve it without changing the design, shorten the opening on repeat visits, or self-host the fonts so text paints sooner.
3. **One page.** All content is on one URL. For more search reach, give the main topics their own pages later: How to apply, Become a mentor, Student stories (one page per story), and Our team. Each would have its own title, description and `Article` or `Person` schema.
4. **Search Console.** After launch, verify the domain in Google Search Console and Bing Webmaster Tools, and submit `sitemap.xml`.
5. **Compression and caching.** Turn on gzip or brotli on the host (Lighthouse estimates 325 KB saved). Cache headers are in `_headers`.
6. **Arabic content review.** Search engines rank text that reads naturally. Have a native editor review `js/i18n-ar.js`.
