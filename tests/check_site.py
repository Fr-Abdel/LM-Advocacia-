"""Verificações estáticas; não substituem renderização ou auditoria WCAG."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids, self.refs, self.links = set(), [], []
        self.tags, self.h1, self.title, self.lang = [], 0, False, None
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); self.tags.append((tag, a))
        if 'id' in a:
            assert a['id'] not in self.ids, f'{self.path.name}: id duplicado {a["id"]}'
            self.ids.add(a['id'])
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'h1': self.h1 += 1
        if tag == 'title': self.title = True
        if tag == 'img': assert 'alt' in a, f'{self.path.name}: imagem sem alt'
        if tag == 'form': assert 'action' not in a, 'Demo não deve encaminhar formulário'
        for ref in ['aria-controls', 'aria-labelledby', 'aria-describedby', 'for']:
            self.refs.extend(a.get(ref, '').split())
        for key in ['href', 'src']:
            if key in a and tag != 'base': self.links.append(a[key])

pages = {p.name: Page(p) for p in sorted(ROOT.glob('*.html'))}
assert {'index.html','escritorio.html','atuacao.html','contato.html','privacidade.html','404.html'} == set(pages)
checked = 0
for name, page in pages.items():
    assert page.lang == 'pt-BR' and page.h1 == 1 and page.title, f'{name}: semântica principal inválida'
    assert all(ref in page.ids for ref in page.refs), f'{name}: referência ARIA/label quebrada'
    assert len([1 for tag,a in page.tags if tag == 'main']) == 1
    for url in page.links:
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc: continue
        target = ROOT / unquote(parsed.path) if parsed.path else page.path
        assert target.is_file(), f'{name}: recurso ausente: {url}'
        if parsed.fragment:
            assert target.name in pages and unquote(parsed.fragment) in pages[target.name].ids, f'{name}: âncora quebrada: {url}'
        checked += 1
    assert 'noindex, nofollow' in page.path.read_text(), 'Demo deve informar noindex'
contact = pages['contato.html']
assert any(tag == 'fieldset' and 'disabled' in attrs for tag, attrs in contact.tags), 'Sem JS, envio deve ficar desativado'
assert len([1 for tag,a in contact.tags if tag in ['input','select','textarea'] and 'required' in a]) == 5
js = (ROOT/'assets/js/main.js').read_text()
assert not re.search(r'\b(fetch|XMLHttpRequest|localStorage|sessionStorage|sendBeacon)\b', js), 'Integração ou persistência inesperada'
assert 'preview.textContent = formatPreview(data)' in js
css = (ROOT/'assets/css/styles.css').read_text()
assert 'prefers-reduced-motion' in css and ':focus-visible' in css
# Pares principais de texto e fundo: alvo AA para texto comum >= 4,5:1.
def luminance(hex):
    rgb = [int(hex[i:i+2], 16)/255 for i in (0,2,4)]
    rgb = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    return sum(v*w for v,w in zip(rgb,[.2126,.7152,.0722]))
for foreground, background in [('29251f','f8f5ee'),('665f55','f8f5ee'),('4b222d','f8f5ee'),('fffdf8','4b222d'),('9b2634','fffdf8'),('776e64','fffdf8'),('cbbbc0','271d20')]:
    a,b=sorted([luminance(foreground),luminance(background)])
    ratio=(b+.05)/(a+.05)
    assert ratio >= 4.5, f'Contraste insuficiente: {foreground}/{background}: {ratio:.2f}'
    print(f'Contraste #{foreground}/#{background}: {ratio:.2f}:1')
print(f'OK: {len(pages)} páginas, {checked} recursos/links locais e referências ARIA verificados.')
