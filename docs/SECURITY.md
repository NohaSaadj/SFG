# Security audit

**Scope:** everything the site serves: `site/index.html`, `site/css/*`, `site/js/*`, `site/assets/*` and the HTTP headers in `site/_headers`.
**Date:** 14 November 2026
**Method:** manual code review of every script (DOM sinks, URL and storage inputs, external links), a check of every external origin, Lighthouse's Best Practices and CSP (`csp-xss`) audits, and browser tests confirming that the policy blocks inline script.

## Summary

The site is static. It has no forms, no accounts, no cookies, no analytics, no backend and no third-party JavaScript. That leaves a small attack surface: what the browser runs and loads, how external links behave, and how the site can be framed. Eight findings were fixed in this pass and five residual items are recorded below, none of them high risk.

| Severity | Found | Fixed | Accepted / for the host |
|---|---|---|---|
| High | 0 | – | – |
| Medium | 3 | 3 | – |
| Low | 5 | 5 | – |
| Info | 5 | – | 5 |

## Findings and fixes

| # | Severity | Finding | Risk | Fix |
|---|---|---|---|---|
| S-1 | Medium | **No Content Security Policy.** Inline `<script>` blocks made a strict policy impossible. | If an injection were ever introduced (a future CMS field, a careless edit), any script could run on the page. | All JavaScript moved into files under `js/`, with no inline handlers. A CSP is set as a `<meta>` tag (works on any host) and as an HTTP header (`_headers`): `script-src 'self'`, `object-src 'none'`, `frame-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `upgrade-insecure-requests`. Verified: the browser now refuses injected inline script. |
| S-2 | Medium | **Clickjacking.** Nothing stopped another site from framing the page. | A hostile page could frame SFG and overlay fake buttons, for example over "Become a mentor". | `frame-ancestors 'none'` in the CSP header and `X-Frame-Options: DENY` (`_headers`). A `<meta>` tag cannot set either, so the host must send the headers ([DEPLOY.md](DEPLOY.md)). |
| S-3 | Medium | **No HTTPS enforcement.** | On a first visit over HTTP the page could be altered on the network. That is a real risk on shared or controlled networks. | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` in `_headers`, plus `upgrade-insecure-requests` in the CSP. |
| S-4 | Low | **External links sent the full page address as the referrer.** 13 `target="_blank"` links had `rel="noopener"` only. | Google Forms, Docs and social sites learned which page and section a reader came from. | Every external link now has `rel="noopener noreferrer"`, and the page sets `Referrer-Policy: strict-origin-when-cross-origin` (meta and header). This includes the links that scripts build (the Al Jazeera credit) and the team LinkedIn links. |
| S-5 | Low | **MIME sniffing.** | A file could be read as a different type than intended. | `X-Content-Type-Options: nosniff`. |
| S-6 | Low | **Browser features were not limited.** | An injected script could ask for the camera, microphone or location. | `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`. |
| S-7 | Low | **Cross-window and cross-origin isolation.** | Popups could keep a reference to the page, and other sites could embed its files. | `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`. |
| S-8 | Low | **The language could be set from the address.** `?lang=` is new in this pass. | Any input taken from the URL is a possible injection point. | Only the exact values `ar` and `en` are accepted (`/[?&]lang=(ar\|en)(?![a-z])/`). Nothing from the URL is written into the page. |

## Reviewed and safe (no change needed)

- **`innerHTML` and `insertAdjacentHTML`** (reveal.js, nav-cascade.js, results.js, story-timeline.js, i18n-ar.js, student-voices.js). Every value written comes from the page's own markup, the static Arabic map, or numbers the script computes. None comes from the URL, from storage or from another site.
- **Stored values.** `localStorage["sfg-lang"]` is only ever compared with `"ar"`. `sessionStorage["sfg-restore"]` is converted to a number before `scrollTo`.
- **Hash links.** `scroll-to.js` looks the target up with `getElementById` and never writes it into the page.
- **Story panel.** Full stories come from `<template>` elements in the page itself.
- **Globe.** `land-mask.png` is same-origin and read through a canvas. The read is wrapped in try/catch, so a tainted canvas (on `file://`) leaves the globe empty instead of throwing an error.
- **External origins** (complete list): `fonts.googleapis.com` and `fonts.gstatic.com` (fonts); `secure.lglforms.com` (the application and mentor forms); `docs.google.com` (the student handbook); `youtube.com` and `youtu.be`, `instagram.com`, `linkedin.com` (links only). Only Google Fonts is loaded by the page; the rest are links the reader chooses to follow.
- **No `eval`, `new Function`, `document.write`, inline event handlers or `javascript:` URLs.**

## Residual items (accepted, or for the host)

| # | Item | Why it stays | Recommendation |
|---|---|---|---|
| R-1 | `style-src 'unsafe-inline'` | The motion system writes CSS variables into `style` attributes (`--d`, `--i`), and Google Fonts injects a stylesheet. | Low risk: there is no injection point, and CSS alone cannot run script. Revisit if fonts are self-hosted. |
| R-2 | Google Fonts has no Subresource Integrity | Google serves its CSS per browser, so a fixed hash cannot match. | Self-host the fallback fonts (Newsreader, Readex Pro, Noto Naskh Arabic, all under the OFL licence) to remove the third party entirely. |
| R-3 | The public email address can be scraped | The address is meant to be public (mailto). | Expect spam, and use a filtered inbox or a contact form behind CAPTCHA later. |
| R-4 | Personal data in images | The site shows photos and names of students and of martyred mentees. | Keep written consent from each person or family on file. Images carry no location metadata (re-encoded WebP). |
| R-5 | Headers depend on the host | `frame-ancestors`, HSTS and the other headers only take effect when the host sends them. | Use `_headers` (Netlify, Cloudflare Pages) or the equivalent in [DEPLOY.md](DEPLOY.md), then check the live site at securityheaders.com (target grade A). |

## Re-testing

1. Serve `site/` and confirm in DevTools › Console that loading the page shows **no** CSP violations.
2. In the console, run `document.body.insertAdjacentHTML("beforeend","<img src=x onerror=alert(1)>")`. No alert should appear, because the CSP blocks the inline handler.
3. Run Lighthouse; Best Practices should be 100, and "Ensure CSP is effective against XSS attacks" should pass.
4. After deploy, check `https://securityheaders.com/?q=<domain>` and `https://observatory.mozilla.org`.
