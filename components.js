import {state, LANGS, setLang, setTheme, step, random} from './app.js';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CSS = `:host{all:initial}*{box-sizing:border-box;font:14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif}
:host{--bg:#fff;--fg:#1d1d1f;--bd:#d0d0d5;--ac:#2f6f4f;--sh:0 6px 24px #0003}
@media (prefers-color-scheme:dark){:host{--bg:#1c1c1e;--fg:#f2f2f7;--bd:#3a3a3f;--ac:#6fcf97}}
.bar{position:fixed;inset:0 0 auto 0;z-index:2147483000;height:52px;display:flex;align-items:center;gap:8px;padding:0 12px;background:var(--bg);color:var(--fg);border-bottom:1px solid var(--bd);box-shadow:var(--sh);overflow-x:auto;scrollbar-width:none}
.logo{font-weight:700;letter-spacing:.02em;white-space:nowrap;margin-right:4px}.sp{flex:1}
button,select{height:34px;padding:0 10px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--fg);cursor:pointer;white-space:nowrap}
button:hover,select:hover{border-color:var(--ac)}button:focus-visible,select:focus-visible{outline:2px solid var(--ac);outline-offset:1px}
button[aria-pressed=true]{background:var(--ac);color:var(--bg);border-color:var(--ac)}
select{max-width:200px}.mob{display:none}@media (min-width:900px){.mob{display:inline-block}}
.pv{position:fixed;z-index:2147482999;top:64px;right:16px;display:none;flex-direction:column;align-items:center;gap:6px;padding:12px 10px 10px;background:#111;border-radius:34px;box-shadow:var(--sh);border:2px solid #444}
.pv.on{display:flex}@media (max-width:899px){.pv{display:none!important}}
.pv iframe{width:390px;height:min(780px,calc(100vh - 150px));border:0;border-radius:20px;background:#fff}
.pv header{display:flex;width:100%;justify-content:space-between;color:#ddd;font-size:12px;padding:0 8px}.pv header button{height:24px;font-size:12px}
dialog{width:min(1000px,94vw);max-height:88vh;border:1px solid var(--bd);border-radius:14px;background:var(--bg);color:var(--fg);padding:0;box-shadow:var(--sh)}
dialog::backdrop{background:#0009}.dh{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--bd)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:16px}
.card{display:flex;flex-direction:column;gap:6px;padding:0;height:auto;text-align:left;overflow:hidden}.card img{width:100%;height:130px;object-fit:cover;object-position:top;background:#8883}
.card span{padding:0 10px}.card span:last-child{padding-bottom:8px;opacity:.7;font-size:12px}.card[aria-current=true]{outline:2px solid var(--ac)}`;
class ZenToolbar extends HTMLElement {
  connectedCallback() {
    this.r = this.attachShadow({mode:'open'});
    this.r.innerHTML = `<style>${CSS}</style><div class="bar" role="toolbar"><span class="logo">☯ Zen Garden</span>
<button id="prev">‹</button><select id="theme"></select><button id="next">›</button><button id="rnd">🎲</button><button id="gal">▦</button><span class="sp"></span>
<select id="lang"></select><button class="mob" id="mob" aria-pressed="false">📱</button></div>
<div class="pv" id="pv"><header><span></span><button id="cl">✕</button></header><iframe title="Mobile preview"></iframe></div><dialog id="dlg"><div class="dh"><strong id="dt"></strong><button id="dc">✕</button></div><div class="grid" id="grid"></div></dialog>`;
    const $ = s => this.r.querySelector(s), on = (s, f) => $(s).addEventListener('click', f);
    $('#lang').innerHTML = Object.entries(LANGS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
    $('#lang').onchange = e => setLang(e.target.value); $('#theme').onchange = e => setTheme(e.target.value);
    on('#prev', () => step(-1)); on('#next', () => step(1)); on('#rnd', random);
    const open = () => $('#dlg').showModal(); on('#gal', open); document.addEventListener('zen:gallery', open); on('#dc', () => $('#dlg').close());
    $('#dlg').addEventListener('click', e => { if (e.target === $('#dlg')) $('#dlg').close(); });
    const tog = v => { $('#pv').classList.toggle('on', v); $('#mob').setAttribute('aria-pressed', v); if (v) this.frame(); localStorage.setItem('zen-mobile', v ? '1' : '0'); };
    on('#mob', () => tog(!$('#pv').classList.contains('on'))); on('#cl', () => tog(false));
    document.addEventListener('zen:change', () => this.update()); this.update();
    try { if (localStorage.getItem('zen-mobile') === '1' && matchMedia('(min-width:900px)').matches) tog(true); } catch {}
  }
  frame() { const f = this.r.querySelector('iframe'), u = `?embed=1&theme=${state.theme.id}&lang=${state.lang}`; if (f.dataset.u !== u) { f.dataset.u = u; f.src = u; } }
  update() {
    const $ = s => this.r.querySelector(s), u = state.ui;
    $('#theme').innerHTML = state.themes.map(t => `<option value="${t.id}"${t === state.theme ? ' selected' : ''}>${esc(t.title)} — ${esc(t.author)}</option>`).join('');
    $('#lang').value = state.lang;
    const tips = {prev:u.prev,next:u.next,rnd:u.random,gal:u.gallery,mob:u.mobile,cl:u.close,dc:u.close,theme:u.theme,lang:u.lang};
    for (const [k, v] of Object.entries(tips)) { const e = $('#' + k); e.title = v; e.setAttribute('aria-label', v); }
    $('#mob').textContent = '📱 ' + u.mobile; $('#gal').textContent = '▦ ' + u.gallery; $('#dt').textContent = u.gallery;
    $('#grid').innerHTML = state.themes.map(t => `<button class="card" data-id="${t.id}"${t === state.theme ? ' aria-current="true"' : ''}><img loading="lazy" src="${t.preview}" alt=""><span><b>${esc(t.title)}</b></span><span>${esc(t.author)}</span></button>`).join('');
    $('#grid').onclick = e => { const b = e.target.closest('.card'); if (b) { setTheme(b.dataset.id); $('#dlg').close(); } };
    if ($('#pv').classList.contains('on')) this.frame();
  }
}
customElements.define('zen-toolbar', ZenToolbar);
