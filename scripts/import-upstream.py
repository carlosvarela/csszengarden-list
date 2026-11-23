from pathlib import Path
import re, json, shutil, os, subprocess

root = Path('/Users/carlosvarela/Dev/csszengarden/css-zen-garden-deploy-vercel')
upstream = Path('/tmp/csszengarden-upstream')
text = (upstream / 'includes/masterlist.php').read_text()
rows = re.findall(r'array\(\s*"([0-9]+)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)"\s*,?\s*\)', text, re.S)

def preview_for(ident, css_file):
    screenshot = root / 'previews' / f'{ident}.webp'
    if screenshot.is_file():
        return str(screenshot.relative_to(root)).replace(os.sep, '/')

    css = css_file.read_text(errors='ignore')
    assets = []
    for raw in re.findall(r'url\(\s*[\'"]?([^\)\'"\s]+)', css, re.I):
        if raw.startswith(('data:', 'http:', 'https:', '#')):
            continue
        asset = (css_file.parent / raw.split('?')[0].split('#')[0]).resolve()
        if asset.is_file() and asset.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'}:
            assets.append(asset)
    if assets:
        target = root / 'previews' / f'{ident}.jpg'
        for asset in sorted(set(assets), key=lambda path: path.stat().st_size, reverse=True):
            result = subprocess.run(
                ['sips', '-Z', '360', '-s', 'format', 'jpeg', str(asset), '--out', str(target)],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                return str(target.relative_to(root)).replace(os.sep, '/')
    return 'previews/222.png'

themes = []
for ident, title, author, url in rows:
    src = upstream / ident
    if not src.is_dir():
        continue
    dst = root / 'themes' / ident
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns('legacy.css'))

    css_files = sorted(p for p in dst.glob('*.css') if p.name != 'legacy.css')
    primary = next((p for p in css_files if p.name.startswith(ident + '.')), None) or next((p for p in css_files if p.name == ident + '-base.css'), None) or (css_files[0] if css_files else None)
    if not primary:
        continue

    variants = {}
    for p in css_files:
        suffix = p.stem[len(ident):].lstrip('-')
        if suffix and suffix not in ('base',):
            key = suffix.lower()
            variants[key] = str(p.relative_to(root)).replace(os.sep, '/')

    themes.append({
        'id': ident,
        'title': title,
        'author': author,
        'url': url or '#',
        'css': str(primary.relative_to(root)).replace(os.sep, '/'),
        'variants': variants,
        'preview': preview_for(ident, primary)
    })

# Highlight Peace of Mind and append the AI-optimized duplicate.
peace = next((t for t in themes if t['id'] == '184'), None)
if peace:
    peace['highlight'] = True
    peace['badge'] = 'Carlos Varela'

themes.append({
    'id': '222',
    'title': 'Peace of Mind — AI Edition',
    'author': 'Carlos Varela',
    'url': 'https://www.carlosvarela.net/',
    'css': 'themes/222/222.css',
    'variants': {},
    'preview': 'previews/222.png',
    'highlight': True,
    'badge': 'Carlos Varela · AI Edition',
    'source': '184'
})

(root / 'themes-full.json').write_text(json.dumps(themes, ensure_ascii=False, indent=1) + '\n')
print(f'Imported {len(themes)-1} upstream designs plus AI edition')
