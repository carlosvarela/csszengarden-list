from pathlib import Path
import re, json, shutil, os

root = Path('/Users/carlosvarela/Dev/csszengarden/css-zen-garden-deploy-vercel')
upstream = Path('/tmp/csszengarden-upstream')
text = (upstream / 'includes/masterlist.php').read_text()
rows = re.findall(r'array\(\s*"([0-9]+)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)"\s*,?\s*\)', text, re.S)

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

    preview = root / 'previews' / f'{ident}.webp'
    themes.append({
        'id': ident,
        'title': title,
        'author': author,
        'url': url or '#',
        'css': str(primary.relative_to(root)).replace(os.sep, '/'),
        'variants': variants,
        'preview': str(preview.relative_to(root)).replace(os.sep, '/')
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
    'preview': 'previews/222.webp',
    'highlight': True,
    'badge': 'Carlos Varela · AI Edition',
    'source': '184'
})

(root / 'themes-full.json').write_text(json.dumps(themes, ensure_ascii=False, indent=1) + '\n')
print(f'Imported {len(themes)-1} upstream designs plus AI edition')
