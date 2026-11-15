# QA checklist

Run the automated checks first, then the manual pass. Test both languages: `/` (English) and `/?lang=ar` (Arabic).

## Automated

```bash
npm install                 # once: QA tools only; the site itself has no dependencies
npm run serve               # http://localhost:8080 (keep it running in another terminal)
npm run qa:a11y             # axe-core: EN + AR × desktop, dark mode, phone. Expect "0 violations" ×6
npm run qa:mobile           # 360px: tap targets ≥ 44px, text ≥ 14px, no horizontal scroll. Expect empty lists
npm run qa:structure        # duplicate IDs, broken #links, heading outline, images without alt. Expect empty lists, h1: 1
npm run qa:html             # HTML validity. Expect 0 errors
npm run qa:lighthouse       # Expect A11y 100, Best practices 100, SEO 100
```

The scripts accept `BASE=https://staging.example/` to test a deployed copy.

## Manual

### Devices and browsers
- [ ] iPhone Safari (iOS 16+) and Android Chrome, at 360px and 414px
- [ ] Desktop Chrome, Firefox, Safari and Edge at 1280px, 1440px and 1920px
- [ ] A throttled "Slow 4G" profile in DevTools: the intro text appears, images load in place, nothing jumps

### Every section, in both languages
- [ ] **Header:** links go to their sections with the glide; *Student handbook* and *Become a mentor* open in a new tab; the language switch shows the current language in the filled circle and changes the address (`?lang=`)
- [ ] **Header in Arabic:** tabs start at the right beside the logo; the button and language switch sit at the far left
- [ ] **Menu (below 1366px):** opens and closes; Esc closes it; focus moves into the menu and back to the button; the *Save battery* switches sit under the links
- [ ] **Intro:** plays on its own, scroll and arrow keys move it, *Skip intro* jumps to About
- [ ] **About, Story, What we do, How it works:** text writes in once; the label dot grows and the label slides in
- [ ] **Story timeline:** arrows and swipe move one step; the counter and caption update; the last step shows *Watch on Al Jazeera’s The Stream*
- [ ] **Our team:** the row drifts (to the left in English, to the right in Arabic), stops on hover or focus, can be dragged, and with *Save battery › Reduce motion* it becomes a still row you can scroll; LinkedIn icons open in a new tab
- [ ] **Results:** the numbers roll; the globe turns; on phones and tablets a row of country chips filters the list in place (the page never jumps up), *All* clears it, and ten universities show until *Show all universities*
- [ ] **Student voices:** the deck slides as you scroll (desktop) or swipes (phone); *Read full story* opens the panel; next/previous swap stories with the curtain; Esc and × close it and focus returns to the card
- [ ] **Mentor voices:** next/previous; a sideways swipe on the quote also moves one mentor (towards the reading direction); every quote has the same number of lines on desktop
- [ ] **In Remembrance (phones):** the three photos sit in one row that swipes sideways, the next one peeking; the row can be focused and scrolled with the arrow keys
- [ ] **Become a mentor:** the accordion opens and closes smoothly; a hovered question draws its underline
- [ ] **Footer:** every link works, and the icons open the right profiles

### Save battery panel
- [ ] From 1366px the header shows a *Save battery* button (with words); it opens the panel under the header; Esc, × and a click outside close it. Below 1366px the same switches are in the menu
- [ ] *Reduce motion* reloads at the same place, and every section is still afterwards (no text reveal, the team row and globe stop); the badge reads *Medium* or *Low*; turning it off restores motion
- [ ] *Dark mode* switches at once and is remembered after a reload; the system theme is used until it is changed
- [ ] With the browser's *Data saver* on, motion starts reduced

### Accessibility
- [ ] Keyboard only: Tab reaches every control in order; focus is always visible; nothing traps focus except the open story panel and menu
- [ ] Screen reader (VoiceOver, NVDA): headings make a sensible outline; the language switch says "EN ع, Switch to Arabic"; story changes are announced
- [ ] Reduced motion (OS setting): no animation; every text is visible at once; the team row is a plain scroller
- [ ] Zoom 200% and 400%: nothing overlaps or is cut off
- [ ] Dark mode (OS setting): every text is readable

### Security (see SECURITY.md)
- [ ] No CSP errors in the console on load
- [ ] Response headers on the live site match `site/_headers` (securityheaders.com grade A)

## Known items (not bugs)

- **Missing content:** LinkedIn links for the team, and Saher's photo and surname.
- **Domain placeholder:** `https://www.scholarshipsforghazza.org/` until the real domain is set (search for `SITE_URL`).
- **Arabic copy** is a draft for a native editor.
- **Motion that runs on its own** (team row, university list, globe) has no pause button in its section: the page-wide *Save battery › Reduce motion* switch stops all of it at once, which meets WCAG 2.2.2.
- **`file://`:** opening `site/index.html` straight from disk leaves the globe empty and blocks the partner logos. That is browser policy. Use `npm run serve` or `dist/sfg-standalone.html`.
