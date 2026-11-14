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
- [ ] **Menu (below 1280px):** opens and closes; Esc closes it; focus moves into the menu and back to the button
- [ ] **Intro:** plays on its own, scroll and arrow keys move it, *Skip intro* jumps to About
- [ ] **About, Story, What we do, How it works:** text writes in once; the label dot grows and the label slides in
- [ ] **Story timeline:** arrows and swipe move one step; the counter and caption update; the last step shows *Watch on Al Jazeera’s The Stream*
- [ ] **Our team:** the row drifts (to the left in English, to the right in Arabic), stops on hover or focus, can be dragged, and *Pause* stops it; LinkedIn icons open in a new tab
- [ ] **Results:** the numbers roll; the globe turns; on phones ten universities show, then *Show all universities*
- [ ] **Student voices:** the deck slides as you scroll (desktop) or swipes (phone); *Read full story* opens the panel; next/previous swap stories with the curtain; Esc and × close it and focus returns to the card
- [ ] **Mentor voices:** next/previous; every quote has the same number of lines on desktop
- [ ] **Become a mentor:** the accordion opens and closes smoothly; a hovered question draws its underline
- [ ] **Footer:** every link works, and the icons open the right profiles

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

- **Placeholder content:** five Our team cards (*Name Surname / Role*) and Saher's photo and surname.
- **Domain placeholder:** `https://www.scholarshipsforghazza.org/` until the real domain is set (search for `SITE_URL`).
- **Arabic copy** is a draft for a native editor.
- **Results:** the drifting university list and spinning globe have no pause control. They count as decoration, and the same names are in the list, but strictly this is WCAG 2.2.2. Adding a pause button like the one in Our team is a small follow-up.
- **`file://`:** opening `site/index.html` straight from disk leaves the globe empty and blocks the partner logos. That is browser policy. Use `npm run serve` or `dist/sfg-standalone.html`.
