# Reference notes: iventions.com home, "produced" section (`#produced-section`)

Sources:
- The page source pasted by the user.
- The user's screenshot `original-produced-section.jpg` (2000 × 928).

The section renders only on the client. The server HTML holds just `<div id="produced-section" class="css-skg1zc">` (`height:100vh; background:var(--purple)`). Its content comes from the page data (`producedBlock` and `producedLocations`, quoted below).

Update (live access): iventions.com is now reachable. The motion spec below is read from the site's own code
(`static/chunks/6685.*.js` ProducedEarth, `6715.*.js` the markers, and the lazy CSS chunks), so nothing is inferred any more.
`live-1440-list.jpg` is a live capture at 1440 × 900. The live WebGL globe would not mount in the headless browser: drei's GPU check
fetches from a blocked CDN. The globe is therefore rebuilt from its source and checked against `original-produced-section.jpg`.

## Data (verbatim from the source)
```
producedBlock.label        "We’ve produced\r\nevents in Europe’s\r\nmost iconic cities."
producedBlock.description  "Bringing together audiences, cultures and ideas.\r\nBoundless reach. Seamless delivery. We bring the spotlight anywhere you need it."
producedLocations[0]  area "Western Europe"      lat 45.5190165 lon -1.5558989   25 cities: Toulouse, Glasgow, Copenhagen, Rome, Birmingham, Brussels, Manchester, Edinburgh, Dublin, Luxembourg, Venice, London, Amsterdam, Madrid, Berlin, Vienna, Lisbon, Paris, Barcelona, Munich, Milan, Cardiff, Newcastle, Rotterdam, Vitoria
producedLocations[1]  area "Eastern Europe"      lat 46.8146553 lon 21.0171655   17 cities: Riga, Sofia, Bratislava, Ljubljana, Bucharest, Helsinki, Athens, Kaunas, Prague, Budapest, Stockholm, Belgrade, Nicosia, Tallinn, Valletta, Vilnius, Warsaw
producedLocations[2]  area "Middle East & Asia"  lat 25.2048 lon 55.2708         3 cities: Abu Dhabi, Istanbul, Shanghai
```

## Tokens (sampled from the screenshot and the page CSS)
| Token | Value | Source |
|---|---|---|
| `--purple` (section background) | #8073FF (sampled #7F73FB) | screenshot |
| `--primary-black` (text) | #1E1E1E | page CSS / screenshot |
| `--primary-yellow` (marker) | #E0FF98 | screenshot |
| Globe dots | near white, about 90 % | screenshot |
| `--font-soehne` | Söhne (licensed) → **Inter Tight** stand-in | page CSS |
| `--font-abc-arizona-mix` | ABC Arizona Mix (licensed) → **Newsreader** stand-in | page CSS |
| rem | 10px at 1920 wide, so `100vw / 192` on desktop | the rest of the page CSS |

## Measurements (screenshot 2000 px wide; rem ≈ 10.4px)
| Item | Reference | Clone |
|---|---|---|
| Grid | 12 columns, `--padding-x` ≈ 2rem, gap ≈ 2rem | same |
| City names | Söhne 500, step ≈ 167px, so 16rem / 1.0, tracking −0.48rem, flush to the left margin, cut off by the top and bottom of the screen | 16rem / 1, columns 1–7 |
| Heading | Söhne 500, 8rem / 1.0, tracking −0.24rem, columns 8–12, top ≈ 5rem | same |
| Paragraph | Söhne 300, 2.4rem / 1.4, ≈ 55rem wide, ≈ 2.4rem below the heading | same |
| Globe | dotted land (dots only, no outlines), diameter ≈ 33 % of the width (64rem), left edge ≈ 2.5rem before column 8, top ≈ 3.6rem under the paragraph, running past the bottom of the screen | canvas, orthographic, centred near 20°N 13°E |
| Region labels | ABC Arizona Mix light, ≈ 2.8rem, underlined, ink; label left of the marker for Western Europe, right of it for the other two | same |
| Markers | white 8px dot in a translucent white halo of about 4.4rem; one marker is a solid yellow dot (Middle East & Asia in the shot) | same; yellow = active or hovered *(inferred)* |

## Motion spec (from the source)
| Element | Behaviour | Source values |
|---|---|---|
| Section | one screen tall, **not pinned**; grid `1fr 1fr`, gap `--gap-x`, padding `--padding-x`, `overflow:hidden`, bg `--primary-purple` #8072ff | `H` component |
| City list | Embla carousel, `axis:y`, `loop`, `align:center`, `startIndex` = number of areas; the areas are repeated ×3. The AutoScroll plugin runs at `speed:0.3` (px per frame, about 18 px/s), forward, and never stops on hover or interaction | `y` component |
| Active area | Embla's selected snap, i.e. the area group nearest the centre; its cities turn `--primary-yellow`, the rest `--primary-black`; `transition: color .8s var(--easeOutQuart)` | `g` component |
| City type | Söhne 500, 16rem, line-height 100%, tracking −0.48rem | |
| Heading | Söhne 500, 8rem/100%, −0.24rem; sub Söhne 300, 2.4rem/140%, max 59.8rem; 2.4rem gap; column padding-top 3.2rem | `w` component |
| Globe box | `calc(min(100vw,100vh)*.8)` square, `margin-bottom:min(-22rem, -22/1080*100vh)` so it runs off the bottom | |
| Globe | three.js `points` on `icosahedronGeometry(1, 64)`, masked by `/upload/earthspec_new.jpg` (`1 - step(.4, r)`); dot colour #f2f2f2; `gl_PointSize = .125*30*(len(mv)-.7)/-mv.z`; group scale 2.8; camera fov 40 at distance 9, start lat/lng 29.28/31.27 | `D`, `B` |
| Spin | OrbitControls: drag to rotate, polar angle locked at π/2.8, no zoom or pan, `autoRotate` at speed 0.65; auto-rotate stops while a marker is hovered | `B` |
| Pointer tilt | the group rotation eases (lerp .05) to `x = 2.5e-4*clientY`, `y = −2.5e-4*clientX` | `B` |
| Markers | drei `<Html distanceFactor={6}>` at radius 1.025; shown only on the front (`dot(view, normal) < −0.45`), otherwise opacity 0 and scale .25 over .2s. Core 3.6rem with a rgba(229,226,255,.2) halo and blur 2.5px, a 1rem white dot. Active: core scale .5 and dot scale 4 in yellow, no underline. Hover: core grows to 4.2rem and the other markers fade to .2. The Western Europe label sits to the left (`right:5rem`) | `6715` + CSS |
| Marker click | scrolls the list to the nearest copy of that area, pauses auto-scroll and resumes it after 1s | `y.scrollTo` |
| Mobile (< 1200) | another component: bg #9C93E8, stacked heading and sub, an accordion of areas, the globe below (no controls) | page chunk |
