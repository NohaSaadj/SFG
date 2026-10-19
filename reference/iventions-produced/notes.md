# Reference notes: iventions.com home, "produced" section (`#produced-section`)

Sources:
- The page source pasted by the user.
- The user's screenshot `original-produced-section.jpg` (2000 × 928).

The section renders only on the client. The server HTML holds just `<div id="produced-section" class="css-skg1zc">` (`height:100vh; background:var(--purple)`). Its content comes from the page data (`producedBlock` and `producedLocations`, quoted below).

The live page and its JS bundles could not be reached: the network policy blocks iventions.com and the public CDNs. Sizes come from the screenshot. The motion is inferred from the data and from the rest of the page, and each inferred item is marked *(inferred)*.

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

## Motion spec
| Element | Trigger | Movement | Notes |
|---|---|---|---|
| Section | scroll | pinned for its length, about 300vh *(inferred, same as the page's other pinned blocks: `position:sticky; height:100vh`)* | |
| City list | scroll, scrubbed | one continuous column of every city (Western → Eastern → Middle East & Asia) moves up behind the top and bottom edges *(inferred from the cut "Glasgow" at the top)* | |
| Active region | the city at mid-screen | its marker turns yellow and the globe turns to face it *(inferred)* | |
| Globe | always | slow idle drift of a few degrees, eased toward the active region *(inferred)* | |
| Labels | hover / click | hover turns the marker yellow; click scrolls the list to that region's first city *(inferred)* | |
| Mobile (< 1200) | | stacked: heading, paragraph, globe, then the city list at 5rem *(inferred, from the page's 5rem mobile display size)* | |
