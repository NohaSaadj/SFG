# Deploy

`site/` is a static folder: upload it as the web root. There is no build step and no server code.

## Before the first deploy

1. **Domain.** Replace `https://www.scholarshipsforghazza.org/` everywhere (search for `SITE_URL`): `site/index.html` (canonical, hreflang, Open Graph, JSON-LD), `site/robots.txt` and `site/sitemap.xml`.
2. **Team.** Replace the five placeholder cards in `#our-team` (names, roles, photos in `assets/images/team/`, LinkedIn URLs) and add their Arabic in `js/i18n-ar.js`.
3. **HTTPS** must be on, and every HTTP request must redirect to HTTPS.

## Hosts

### Netlify or Cloudflare Pages (recommended)
- Publish directory: `site`. No build command.
- `site/_headers` is read automatically and sets every security and cache header.
- Compression (brotli or gzip) is on by default.

### GitHub Pages
- Serve `site/` (for example with a workflow that uploads `site/` as the Pages artifact).
- GitHub Pages cannot set custom headers. The CSP and referrer policy still apply through their `<meta>` tags, but `frame-ancestors`, HSTS, `X-Frame-Options` and `Permissions-Policy` will be missing. For full security headers, put Cloudflare in front of it and add a Transform Rule with the headers below.

### Nginx
```nginx
root /var/www/sfg/site;
gzip on; gzip_types text/css application/javascript image/svg+xml application/json;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; media-src 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
```

### Apache (`.htaccess`)
Set the same headers with `Header always set …` and enable `mod_deflate`.

## After deploy

- [ ] Open `/` and `/?lang=ar`. Both render, and the console shows no errors.
- [ ] Check https://securityheaders.com/?q=your-domain (target grade A).
- [ ] Run Lighthouse on the live URL (A11y, Best practices and SEO should be 100).
- [ ] Add the domain in Google Search Console and Bing Webmaster Tools, and submit `sitemap.xml`.
- [ ] Share the URL in a chat app and check that the social card shows the image and title.

## Caching and updates

Images (`/assets/*`) are cached for a year as immutable. **If you replace an image, give it a new file name.** CSS and JS revalidate on every visit, so changes show immediately.
