import {state, LANGS, setLang, setTheme, step, random} from './app.js';
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CSS = `:host{all:initial;color-scheme:light;--bg:#f4f8eb;--paper:#fff;--fg:#28780A;--muted:#496c36;--bd:#d5e2c7;--ac:#5EA936;--pine:#28780A;--lime:#ABD550;--sh:0 18px 48px #28780a26}
*{box-sizing:border-box;font:14px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif}
.bar{position:fixed;inset:auto 0 0;z-index:2147483000;display:flex;align-items:center;gap:12px;min-height:76px;padding:10px 18px calc(10px + env(safe-area-inset-bottom));background:var(--bg);color:var(--fg);border-top:1px solid var(--bd);box-shadow:0 -8px 30px #152a1c20;}
.brand{display:flex;align-items:center;gap:10px;min-width:max-content}.brand-mark{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--pine);color:#f5f4e9}.brand-mark svg{width:23px;height:23px}.brand-copy{display:grid;gap:2px}.logo{font-size:13px;font-weight:800;letter-spacing:.075em;white-space:nowrap}.edition{font-size:10px;font-weight:650;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.current{max-width:170px;min-width:0;padding-inline:12px;border-inline-start:1px solid var(--bd)}.current-label{display:block;margin-bottom:3px;color:var(--muted);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.current-title{display:block;overflow:hidden;color:var(--fg);font-size:13px;font-weight:650;text-overflow:ellipsis;white-space:nowrap}
.steps{display:flex;align-items:center;gap:4px;padding:4px;border:1px solid var(--bd);border-radius:12px;background:#fffdf5}
button,select{min-height:42px;padding:0 12px;border:1px solid var(--bd);border-radius:10px;background:var(--paper);color:var(--fg);cursor:pointer;white-space:nowrap}
button:hover,select:hover{border-color:#5EA936;background:#fff}button:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #28780A;outline-offset:2px}
button[aria-pressed=true]{background:var(--pine);color:#fff;border-color:var(--pine)}button svg{width:18px;height:18px;flex:none;stroke:currentColor;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
.icon-button{display:grid;place-items:center;width:40px;min-width:40px;height:40px;min-height:40px;padding:0;border-color:transparent;background:transparent}.icon-button:hover{background:#e9eddd;border-color:transparent}
.search{position:relative;flex:1;min-width:190px;max-width:420px;margin-inline:auto}.search-label{display:block;margin:0 0 4px 2px;color:var(--muted);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.search-field{display:flex;align-items:center;gap:9px;height:42px;padding:0 12px;border:1px solid #c8d9bb;border-radius:12px;background:var(--paper);transition:border-color .16s,box-shadow .16s}.search-field:focus-within{border-color:#5EA936;box-shadow:0 0 0 3px #5EA9362e}.search-field svg{width:17px;height:17px;flex:none;stroke:#5EA936;stroke-width:1.8;fill:none;stroke-linecap:round}.search-field input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--fg);font:inherit;font-size:max(1rem,1em)}.search-field input::placeholder{color:#496c36;opacity:1}.search-field input:focus-visible{outline:0}.search-field input::-webkit-search-cancel-button{cursor:pointer}
.suggestions{position:absolute;inset:auto 0 calc(100% + 11px);z-index:5;max-height:min(56dvh,460px);overflow-y:auto;padding:8px;border:1px solid #c8d9bb;border-radius:18px;background:var(--paper);box-shadow:var(--sh);overscroll-behavior:contain;scrollbar-color:#5EA936 #edf4e2;scrollbar-gutter:stable;scrollbar-width:thin;opacity:1;transform:translateY(0) scale(1);transition:opacity .18s ease,transform .18s ease,display .18s;transition-behavior:allow-discrete}.suggestions[hidden]{display:none;opacity:0;transform:translateY(8px) scale(.985)}@starting-style{.suggestions:not([hidden]){opacity:0;transform:translateY(8px) scale(.985)}}.suggestion{display:flex;width:100%;align-items:center;gap:11px;min-height:64px;padding:8px;border:1px solid transparent;border-radius:12px;background:transparent;text-align:left;white-space:normal}.suggestion:hover,.suggestion[aria-selected=true]{border-color:#dce9ca;background:#f4f9ec}.suggestion[data-current=true]{border-color:#96CB18;background:#f4f9ec}.suggestion img{width:54px;height:50px;flex:none;border-radius:9px;object-fit:cover;object-position:top;background:#eaf1de}.suggestion-copy{display:grid;gap:3px;min-width:0;flex:1}.suggestion-title{overflow:hidden;font-size:13px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}.suggestion-author{overflow:hidden;color:var(--muted);font-size:12px;text-overflow:ellipsis;white-space:nowrap}.suggestion-current{flex:none;padding:4px 7px;border-radius:999px;background:#edf5dc;color:var(--fg);font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}.empty{margin:0;padding:14px 12px;color:var(--muted);font-size:13px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.actions{display:flex;align-items:center;gap:6px}.action{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding-inline:12px;font-size:12px;font-weight:650}.action svg{width:17px;height:17px}.lang{max-width:138px;min-width:108px;font-size:12px}.mob{display:inline-flex}
.pv{position:fixed;z-index:2147482999;right:16px;bottom:calc(88px + env(safe-area-inset-bottom));display:none;flex-direction:column;gap:8px;width:max-content;max-width:calc(100vw - 32px);padding:10px;border:1px solid #5EA936;border-radius:24px;background:#28780A;box-shadow:0 22px 70px #173e1166;color:#fff}.pv.on{display:flex}.pv[hidden]{display:none}
.pv header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:2px 5px}.pv-caption{display:grid;gap:2px;min-width:0}.pv-caption strong{overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pv-caption span{color:#eaf1de;font-size:10px}.pv-links{display:flex;align-items:center;gap:9px}.pv-links a{color:#fff;font-size:11px;text-underline-offset:3px;white-space:nowrap}.pv header button{width:34px;min-width:34px;min-height:34px;height:34px;padding:0;border-color:#96CB18;border-radius:50%;background:#5EA936;color:#fff}.pv iframe{display:block;width:min(390px,calc(100vw - 56px));height:min(760px,calc(100dvh - 205px));border:0;border-radius:16px;background:#fff}
dialog{width:min(1100px,94vw);max-height:88dvh;overflow:hidden;border:1px solid var(--bd);border-radius:18px;background:var(--bg);color:var(--fg);padding:0;box-shadow:var(--sh);opacity:1;transform:translateY(0) scale(1);transition:opacity .22s ease,transform .22s ease,display .22s,overlay .22s;transition-behavior:allow-discrete}dialog:not([open]){opacity:0;transform:translateY(12px) scale(.985)}dialog::backdrop{background:#07150eaa;backdrop-filter:blur(3px);transition:opacity .22s ease,display .22s,overlay .22s;transition-behavior:allow-discrete}dialog:not([open])::backdrop{opacity:0}@starting-style{dialog[open]{opacity:0;transform:translateY(12px) scale(.985)}dialog[open]::backdrop{opacity:0}}
.dh{position:sticky;top:0;z-index:1;display:flex;justify-content:space-between;align-items:center;min-height:58px;padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--bd)}.dh strong{font-size:15px;letter-spacing:.01em}.dh button{min-width:38px;width:38px;min-height:38px;height:38px;padding:0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;max-height:calc(88dvh - 58px);overflow:auto;padding:14px;overscroll-behavior:contain;scrollbar-color:#8ca65c #edeedf;scrollbar-width:thin}
.card{display:flex;min-width:0;flex-direction:column;gap:6px;padding:0;height:auto;text-align:left;overflow:hidden}.card img{width:100%;height:130px;object-fit:cover;object-position:top;background:#eaf1de}.card span{padding:0 10px}.card span:last-child{padding-bottom:9px;color:var(--muted);font-size:12px}.card[aria-current=true]{outline:2px solid var(--ac)}.card.featured{position:relative;border-color:#96CB18;outline:1px solid #96CB18}.card.featured::after{content:attr(data-badge);position:absolute;top:8px;right:8px;padding:4px 8px;border-radius:999px;background:#28780A;color:#fff;font-size:10px;font-weight:700}
@media(max-width:1050px){.bar{gap:8px;padding-inline:12px}.current{max-width:130px;padding-inline:9px}.edition{display:none}.lang{max-width:118px;min-width:100px}.action{padding-inline:10px}.action-label{display:none}}
@media(max-width:760px){.bar{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;gap:8px 10px;min-height:0;padding:8px 10px calc(8px + env(safe-area-inset-bottom))}.brand{grid-column:1;grid-row:1}.brand-mark{width:36px;height:36px;border-radius:10px}.current{display:none}.steps{grid-column:1;grid-row:2}.search{grid-column:2;grid-row:1;min-width:0;width:100%;margin:0}.search-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.search-field{height:40px;padding-inline:10px}.suggestions{max-height:52dvh}.actions{grid-column:2 / 4;grid-row:2;justify-content:flex-end;gap:5px}.action{width:40px;min-width:40px;height:40px;min-height:40px;padding:0}.lang{grid-column:3;grid-row:1;width:112px;min-width:0;height:40px;min-height:40px;padding-inline:8px;font-size:11px}.pv{right:8px;bottom:calc(108px + env(safe-area-inset-bottom));max-width:calc(100vw - 16px);border-radius:19px}.pv iframe{width:min(390px,calc(100vw - 38px));height:min(680px,calc(100dvh - 235px))}.grid{grid-template-columns:repeat(2,minmax(0,1fr));max-height:calc(88dvh - 58px);gap:9px;padding:10px}.card img{height:110px}}
@media(max-width:420px){.bar{grid-template-columns:auto minmax(0,1fr) auto;gap:7px 8px}.brand-copy{display:none}.brand-mark{width:34px;height:34px}.steps{gap:0;padding:2px}.icon-button{width:35px;min-width:35px;height:35px;min-height:35px}.actions{gap:3px}.action{width:36px;min-width:36px;height:38px;min-height:38px}.lang{width:98px;font-size:10px}.search-field{gap:6px;padding-inline:8px}.suggestion img{width:42px;height:40px}}
@media(max-width:760px) and (pointer:coarse){.bar button,.bar select{min-height:48px}.bar .icon-button{width:48px;min-width:48px;height:48px}.bar .action{width:48px;min-width:48px;height:48px}.bar .steps{padding:4px}.bar .lang{height:48px}.search-field{height:48px}.pv header button{width:44px;min-width:44px;min-height:44px;height:44px}}
@media(prefers-reduced-motion:no-preference){.suggestion{transition:background-color .16s ease,border-color .16s ease,transform .16s ease}.suggestion:hover,.suggestion[aria-selected=true]{transform:translateX(2px)}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.suggestions,dialog,dialog::backdrop,.suggestion{transition:none}}
`;
class ZenToolbar extends HTMLElement {
  connectedCallback() {
    this.r = this.attachShadow({mode:'open',delegatesFocus:true});
    this.r.innerHTML = `<style>${CSS}</style><div class="bar" role="toolbar" aria-label="CSS Zen Garden controls">
<div class="brand"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3.2c4.9 0 8.8 3.9 8.8 8.8s-3.9 8.8-8.8 8.8S3.2 16.9 3.2 12 7.1 3.2 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3.4c2.5 2.3 2.5 5.1 0 8.6-2.5 3.5-2.5 6.3 0 8.6M12 3.4c-2.5 2.3-2.5 5.1 0 8.6 2.5 3.5 2.5 6.3 0 8.6" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="7.1" r="1.2" fill="currentColor"/><circle cx="12" cy="16.9" r="1.2" fill="currentColor"/></svg></span><span class="brand-copy"><span class="logo">CSS ZEN GARDEN</span><span class="edition">The design archive</span></span></div>
<div class="current"><span class="current-label"></span><span class="current-title" id="current"></span></div>
<div class="steps" aria-label="Browse designs"><button class="icon-button" id="prev" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14.5 18-6-6 6-6"/></svg></button><button class="icon-button" id="next" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 18 6-6-6-6"/></svg></button></div>
<search class="search"><label class="search-label" for="search"></label><div class="search-field"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.2 4.2"/></svg><input id="search" type="search" name="theme-search" maxlength="100" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="suggestions"></div><div class="suggestions" id="suggestions" role="listbox" aria-label="Design suggestions" hidden></div></search>
<div class="actions"><button class="action" id="rnd" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h3.5c4.7 0 4.3 10 9 10H20"/><path d="m16.5 13 3.5 4-3.5 4M4 17h3.5c2 0 3-1.6 4-3.5M16.5 3 20 7l-3.5 4"/><path d="M16.5 7H20"/></svg><span class="action-label"></span></button><button class="action" id="gal" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg><span class="action-label"></span></button><button class="action mob" id="mob" type="button" aria-pressed="false"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="6.5" y="2.8" width="11" height="18.4" rx="2.2"/><path d="M10 5.5h4M11 18.3h2"/></svg><span class="action-label"></span></button></div>
<select class="lang" id="lang"></select></div>
<section class="pv" id="pv" role="dialog" aria-label="Mobile design preview" aria-modal="false" hidden><header><div class="pv-caption"><strong id="pv-title"></strong><span id="pv-status"></span></div><div class="pv-links"><a id="pv-open" target="_blank" rel="noopener"></a><button id="cl" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div></header><iframe title="Mobile preview" loading="lazy"></iframe></section>
<dialog id="dlg" aria-labelledby="dt"><div class="dh"><strong id="dt"></strong><button id="dc" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="grid" id="grid"></div></dialog>`;
    const $ = s => this.r.querySelector(s), on = (s, f) => $(s).addEventListener('click', f);
    $('#lang').innerHTML = Object.entries(LANGS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
    $('#lang').onchange = e => { this.closeSuggestions(); setLang(e.target.value); };
    on('#prev', () => { this.closeSuggestions(); step(-1); }); on('#next', () => { this.closeSuggestions(); step(1); }); on('#rnd', () => { this.closeSuggestions(); random(); });
    const open = () => { this.closeSuggestions(); $('#dlg').showModal(); }; on('#gal', open); document.addEventListener('zen:gallery', open); on('#dc', () => $('#dlg').close());
    $('#dlg').addEventListener('click', e => { if (e.target === $('#dlg')) $('#dlg').close(); });
    const tog = v => { this.closeSuggestions(); $('#pv').hidden = !v; $('#pv').classList.toggle('on', v); $('#mob').setAttribute('aria-pressed', v); if (v) this.frame(); try { localStorage.setItem('zen-mobile', v ? '1' : '0'); } catch {} };
    on('#mob', () => tog(!$('#pv').classList.contains('on'))); on('#cl', () => tog(false));
    const search = $('#search');
    search.addEventListener('focus', () => { this.searchOpen = true; this.renderSuggestions(); });
    search.addEventListener('input', () => { this.searchOpen = true; this.activeIndex = -1; this.renderSuggestions(); });
    search.addEventListener('blur', () => setTimeout(() => { if (!this.r.querySelector('.search').contains(this.r.activeElement)) this.closeSuggestions(); }, 0));
    search.addEventListener('keydown', e => this.searchKeydown(e));
    $('#suggestions').addEventListener('click', e => { const option = e.target.closest('[data-id]'); if (option) this.chooseTheme(option.dataset.id); });
    this.onOutsidePointer = e => { if (!e.composedPath().includes(this)) this.closeSuggestions(); };
    document.addEventListener('pointerdown', this.onOutsidePointer);
    this.onShortcut = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); search.focus(); search.select(); }
    };
    document.addEventListener('keydown', this.onShortcut);
    const frame = $('iframe');
    frame.addEventListener('load', () => { frame.setAttribute('aria-busy', 'false'); $('#pv-status').textContent = '390 px viewport'; });
    frame.addEventListener('error', () => { frame.setAttribute('aria-busy', 'false'); $('#pv-status').textContent = state.ui.previewFailed; });
    document.addEventListener('zen:change', () => this.update()); this.update();
    try { if (localStorage.getItem('zen-mobile') === '1' && matchMedia('(min-width:760px)').matches) tog(true); } catch {}
  }
  frame() {
    const f = this.r.querySelector('iframe'), url = new URL(location.href);
    url.searchParams.set('embed', '1'); url.searchParams.set('theme', state.theme.id); url.searchParams.set('lang', state.lang);
    const href = url.href;
    this.r.querySelector('#pv-open').href = href;
    if (f.dataset.u !== href) { f.dataset.u = href; f.setAttribute('aria-busy', 'true'); this.r.querySelector('#pv-status').textContent = state.ui.loadingPreview; f.src = href; }
  }
  normalized(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(); }
  matches(query) {
    const q = this.normalized(query).trim();
    if (!q) return [state.theme, ...state.themes.filter(t => t.highlight && t !== state.theme)].slice(0, 6);
    return state.themes.map(theme => {
      const title = this.normalized(theme.title), author = this.normalized(theme.author);
      const score = title === q ? 0 : title.startsWith(q) ? 1 : title.includes(q) ? 2 : author.startsWith(q) ? 3 : author.includes(q) ? 4 : (title.split(/\s+/).some(word => word.startsWith(q)) ? 5 : 99);
      return {theme, score};
    }).filter(result => result.score < 99).sort((a, b) => a.score - b.score || a.theme.title.localeCompare(b.theme.title)).slice(0, 7).map(result => result.theme);
  }
  renderSuggestions() {
    const input = this.r.querySelector('#search'), list = this.r.querySelector('#suggestions');
    const query = input.value.trim(), themes = this.matches(query);
    this.currentMatches = themes; this.activeIndex = -1;
    list.innerHTML = themes.map(theme => `<button class="suggestion" type="button" tabindex="-1" role="option" id="suggestion-${esc(theme.id)}" data-id="${esc(theme.id)}" data-current="${theme.id === state.theme.id}" aria-selected="false"><img src="${esc(theme.preview)}" alt="" loading="lazy"><span class="suggestion-copy"><span class="suggestion-title">${esc(theme.title)}</span><span class="suggestion-author">${esc(theme.author)}</span></span>${theme.id === state.theme.id ? `<span class="suggestion-current">${esc(state.ui.currentDesign)}</span>` : ''}</button>`).join('') || `<div class="empty" role="option" aria-disabled="true" aria-selected="false" tabindex="-1">${esc(state.ui.noResults)}</div>`;
    const visible = this.searchOpen;
    list.hidden = !visible; input.setAttribute('aria-expanded', String(visible)); input.removeAttribute('aria-activedescendant');
    if (!visible) list.innerHTML = '';
  }
  closeSuggestions() {
    this.searchOpen = false;
    const input = this.r?.querySelector('#search'), list = this.r?.querySelector('#suggestions');
    if (input) { input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
    if (list) { list.hidden = true; list.innerHTML = ''; }
  }
  searchKeydown(e) {
    if (!this.searchOpen || !this.currentMatches?.length) { if (e.key === 'Escape') this.closeSuggestions(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); const delta = e.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex = this.activeIndex < 0 ? (delta > 0 ? 0 : this.currentMatches.length - 1) : (this.activeIndex + delta + this.currentMatches.length) % this.currentMatches.length;
      const input = this.r.querySelector('#search'), list = this.r.querySelector('#suggestions');
      list.querySelectorAll('[role=option]').forEach((option, index) => option.setAttribute('aria-selected', String(index === this.activeIndex)));
      const active = list.querySelectorAll('[role=option]')[this.activeIndex];
      input.setAttribute('aria-activedescendant', active.id); active.scrollIntoView({block:'nearest'});
    } else if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault(); this.chooseTheme(this.currentMatches[this.activeIndex < 0 ? 0 : this.activeIndex].id);
    } else if (e.key === 'Escape') this.closeSuggestions();
  }
  chooseTheme(id) { this.closeSuggestions(); this.r.querySelector('#search').value = ''; setTheme(id); }
  update() {
    const $ = s => this.r.querySelector(s), u = state.ui;
    $('#lang').value = state.lang;
    const tips = {prev:u.prev,next:u.next,rnd:u.random,gal:u.gallery,mob:u.mobile,cl:u.close,dc:u.close,lang:u.lang};
    for (const [k, v] of Object.entries(tips)) { const e = $('#' + k); e.title = v; e.setAttribute('aria-label', v); }
    $('.search-label').textContent = u.search; $('#search').setAttribute('aria-label', u.search); $('#search').placeholder = u.searchHint;
    $('.current-label').textContent = u.theme; $('#current').textContent = state.theme.title;
    $('#rnd .action-label').textContent = u.random; $('#gal .action-label').textContent = u.gallery; $('#mob .action-label').textContent = u.mobile;
    $('#dt').textContent = u.gallery; $('#pv-open').textContent = u.openPreview;
    $('#pv-title').textContent = state.theme.title;
    $('#pv').setAttribute('aria-label', u.mobile); $('iframe').title = `${u.mobile}: ${state.theme.title}`;
    $('#grid').innerHTML = state.themes.map(t => `<button class="card${t.highlight ? ' featured' : ''}" data-id="${t.id}" data-badge="${esc(t.badge || 'Featured')}"${t === state.theme ? ' aria-current="true"' : ''}><img loading="lazy" src="${t.preview}" alt="${esc(t.title)} by ${esc(t.author)}"><span><b>${esc(t.title)}</b></span><span>${esc(t.author)}</span></button>`).join('');
    $('#grid').onclick = e => { const b = e.target.closest('.card'); if (b) { setTheme(b.dataset.id); $('#dlg').close(); } };
    if ($('#pv').classList.contains('on')) this.frame();
    if (this.searchOpen) this.renderSuggestions();
  }
}
customElements.define('zen-toolbar', ZenToolbar);
