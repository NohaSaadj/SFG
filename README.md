# Scholarships for Ghazza · Website

The website of **Scholarships for Ghazza (SFG)**, a Palestinian-led mentorship initiative. Volunteer mentors help students from Gaza apply for, and win, fully funded scholarships to study abroad.

This is a one-page site in English and Arabic (right to left). It is built with plain HTML, CSS and JavaScript, so there is no framework, no build step and no runtime dependency. Many of its readers are students in Gaza on phones and weak connections, so it is built for small screens and slow networks first.

| | |
|---|---|
| **Languages** | English, Arabic (`?lang=ar`, right to left) |
| **Stack** | HTML5, CSS (custom properties, logical properties), vanilla ES5+ JavaScript, one WebGL globe |
| **Design system** | [`design-system/sfg-design-system`](design-system/sfg-design-system/SKILL.md), v1.5 (locked) |
| **Accessibility** | WCAG 2.2 AA target: axe-core 0 violations, Lighthouse 100 |
| **SEO** | Lighthouse 100: canonical, hreflang, Open Graph, schema.org `NGO`, sitemap |
| **Security** | Strict CSP, no inline scripts, no third-party JavaScript; see [docs/SECURITY.md](docs/SECURITY.md) |

---

## Quick start

```bash
# serve the site locally (any static server works)
cd site
python3 -m http.server 8080
# open http://localhost:8080  ·  Arabic: http://localhost:8080/?lang=ar
```

Use a local server, not `file://`. Browsers block some features on `file://` (the globe reads its land mask from an image). To get a single file you can open from disk or send to someone, build the standalone copy:

```bash
python3 tools/build_standalone.py      # -> dist/sfg-standalone.html (inlines all CSS, JS and images)
```

## Project structure

```
.
├── site/                    ← the website (deploy this folder as is)
│   ├── index.html           one page, every section in reading order
│   ├── css/                 one file per section, loaded in cascade order (tokens → base → … → footer)
│   ├── js/                  one file per behaviour, loaded in run order (i18n-ar → intro → reveal → …)
│   │   └── lib/             third-party-style helpers written for this site (dot-globe.js, WebGL)
│   ├── assets/
│   │   ├── images/          brand · intro · story · team · voices · memory · partners (WebP)
│   │   ├── icons/           favicons and app icons
│   │   └── data/            land-mask.png (the globe's land/sea map)
│   ├── favicon.ico  robots.txt  sitemap.xml  site.webmanifest
│   └── _headers             HTTP security and cache headers (Netlify, Cloudflare Pages)
├── design-system/           SFG design system (tokens, type, motion, Arabic rules) and its zip
├── docs/                    architecture, deploy, security, SEO, QA checklist, changelog
├── tools/                   build_standalone.py
└── research/                reference clones and screenshots used during design (not deployed)
```

What each CSS and JS file does, the order they load in, and the rules for changing them are in **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

## Page sections

| # | Section | `id` | CSS | JS |
|---|---|---|---|---|
| 1 | Header and menu | `site-header` | header.css | intro.js, nav-cascade.js, scroll-to.js |
| 2 | Intro (scroll-told story) | — | intro.css | intro.js |
| 3 | Partners | `partners` | partners.css | — |
| 4 | About SFG | `about` | about.css | reveal.js |
| 5 | How SFG's story began | `how-it-began` | story.css | story-timeline.js, tatreez-bands.js |
| 6 | Our team | `our-team` | team.css | team-marquee.js |
| 7 | What we do / don't do | `what-we-do` | what-we-do.css | what-we-do.js |
| 8 | How it works | `how-it-works` | how-it-works.css | how-illustrations.js, how-process-line.js |
| 9 | Our results and the globe | `results` | results.css | results.js, lib/dot-globe.js |
| 10 | Student voices and story panel | `student-voices` | student-voices.css | student-voices.js |
| 11 | In Remembrance | `in-remembrance` | in-remembrance.css | in-remembrance.js |
| 12 | Mentor voices | `mentor-voices` | mentor-voices.css | mentor-voices.js |
| 13 | Become a mentor | `become-a-mentor` | become-a-mentor.css | accordion.js |
| 14 | Footer | — | footer.css | footer-reveal.js |

Shared across sections: `tokens.css` (design tokens), `base.css`, `motion.css` with `reveal.js` (the text reveal), and `button-motion.js`.

## Languages

English is written in `index.html`. Arabic lives in **`js/i18n-ar.js`**, a map from each English text to its Arabic. With `?lang=ar`, or when the reader picked Arabic before, the script runs before every other script. It sets `lang="ar" dir="rtl"`, swaps the text, alt texts and labels, and gives the other scripts `SFGT()` for the text they build. Layout mirrors through CSS logical properties. Names that are English in origin (universities, scholarships, programmes, organisations, mentors) stay in English. The Arabic is a **draft** and needs a native editor before launch.

To change a text in English, edit `index.html`, then add the same key with its Arabic to `js/i18n-ar.js`. An English text with no Arabic stays English in the Arabic page.

## Fonts

The brand typeface is **Thmanyah** (Serif Display, Serif Text, Sans). Its licence does not allow the font files to be put in a repository or hosted publicly, so they are **not** here. The site uses Thmanyah when it is installed or provided, and otherwise falls back to Newsreader, Readex Pro and Noto Naskh Arabic from Google Fonts. See [design-system tokens](design-system/sfg-design-system/references/tokens.md#2-typography).

## Quality checks

| Check | Tool | Result (14 Nov 2026) |
|---|---|---|
| Accessibility | axe-core 4.10 (desktop, dark, phone; EN and AR) | 0 violations |
| Lighthouse, mobile | Lighthouse 12 | Perf 70 · A11y 100 · Best practices 100 · SEO 100 |
| Lighthouse, desktop | Lighthouse 12 | Perf 92 · A11y 100 · Best practices 100 · SEO 100 |
| HTML | html-validate 9 (recommended) | 0 errors |
| Mobile, 360px | custom Playwright audit | No tap target under 44px, no text under 14px, no horizontal scroll |
| Links and IDs | Playwright | No duplicate IDs, no broken in-page links, one `h1` |

Mobile performance is held back by the intro by design: its opening holds for 2s before the story plays, which counts against Largest Contentful Paint. How to repeat every check is in [docs/QA.md](docs/QA.md).

## Deploy

`site/` is a static folder that works on any static host. Before launch:

1. Replace `https://www.scholarshipsforghazza.org/` with the real domain (search for `SITE_URL`). It appears in `index.html`, `robots.txt` and `sitemap.xml`.
2. Serve over HTTPS with the headers in `site/_headers`, and turn on gzip or brotli compression.
3. Fill in the Our team placeholders (names, roles, photos, LinkedIn links).

Hosting options and the header settings for each host are in [docs/DEPLOY.md](docs/DEPLOY.md).

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): file map, load order, conventions, how to add a section
- [docs/SECURITY.md](docs/SECURITY.md): security audit, findings and fixes
- [docs/SEO.md](docs/SEO.md): SEO audit, what is in place, what to do after launch
- [docs/QA.md](docs/QA.md): test checklist and how to run the automated checks
- [docs/DEPLOY.md](docs/DEPLOY.md): hosting and headers
- [docs/CHANGELOG.md](docs/CHANGELOG.md): design and build history

## Credits

Design and content: Scholarships for Ghazza. Motion and layout ideas are adapted from cambium.com, noho.ink, iventions.com and others. Each is credited in the CSS file that uses it. No code or assets from those sites are shipped.

Contact: [scholarshipsforghazza@gmail.com](mailto:scholarshipsforghazza@gmail.com)
