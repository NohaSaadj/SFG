#!/usr/bin/env python3
"""Build one self-contained HTML file from site/, for sharing or opening straight from disk.

    python3 tools/build_standalone.py            ->  dist/sfg-standalone.html

Every stylesheet and script is inlined in its original order, and every local image (in HTML, CSS and JS
strings) becomes a data URI. The deployable site is site/ itself; this file is only a convenience copy.
"""
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT = ROOT / "dist" / "sfg-standalone.html"
MIME = {".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml"}


def data_uri(path: Path) -> str:
    return f"data:{MIME[path.suffix.lower()]};base64," + base64.b64encode(path.read_bytes()).decode()


def inline_images(text: str, base: Path) -> str:
    """Replace "assets/..." and "../assets/..." image paths (quoted, or inside url()) with data URIs."""
    def swap(m):
        rel = m.group(2)
        path = (base / rel).resolve()
        if path.suffix.lower() not in MIME:
            return m.group(0)
        if not path.is_file():
            sys.exit(f"missing image: {rel}")
        return m.group(1) + data_uri(path) + m.group(3)
    return re.sub(r'(["\'(])((?:\.\./)?assets/[\w./-]+)(["\')])', swap, text)


def main() -> None:
    html = (SITE / "index.html").read_text()
    # strip the security meta's script-src limits: everything is inline in the standalone copy
    html = re.sub(r'\s*<meta http-equiv="Content-Security-Policy"[^>]*>', "", html)

    def css(m):
        f = SITE / m.group(1)
        return "<style>\n" + inline_images(f.read_text(), f.parent) + "</style>"

    def js(m):
        f = SITE / m.group(1)
        return "<script>\n" + inline_images(f.read_text(), SITE) + "</script>"

    html, n_css = re.subn(r'<link rel="stylesheet" href="(css/[\w.-]+)"\s*/?>', css, html)
    html, n_js = re.subn(r'<script src="(js/[\w./-]+)"></script>', js, html)
    html = inline_images(html, SITE)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html)
    print(f"{OUT.relative_to(ROOT)}: {n_css} stylesheets, {n_js} scripts inlined, {len(html) // 1024} KB")


if __name__ == "__main__":
    main()
