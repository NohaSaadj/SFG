"""Build the single-file index.html from index.src.html by inlining every local image as a data URI."""
import base64, re
from pathlib import Path

HERE = Path(__file__).parent
MIME = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}

def data_uri(rel):
    p = HERE / rel
    return f'data:{MIME[p.suffix]};base64,' + base64.b64encode(p.read_bytes()).decode()

src = (HERE / 'index.src.html').read_text()
out, n = re.subn(r'"(assets/[\w/-]+\.(?:webp|jpe?g|png))"', lambda m: '"' + data_uri(m.group(1)) + '"', src)
# local scripts (the Results globe data) are inlined too
out, k = re.subn(r'<script src="(assets/[\w/-]+\.js)"></script>', lambda m: '<script>' + (HERE / m.group(1)).read_text() + '</script>', out)  # SCRIPT
(HERE / 'index.html').write_text(out)
print(f'index.html built: {n} images and {k} scripts inlined, {len(out) // 1024} KB')
