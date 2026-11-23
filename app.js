// CSS Zen Garden — modern re-implementation. Same HTML, swappable CSS + i18n.
const LANGS = {en:'English',es:'Español','pt-br':'Português (BR)',fr:'Français',de:'Deutsch',nl:'Nederlands',ru:'Русский','zh-cn':'简体中文','zh-tw':'繁體中文'};
const UI = {
 en:{theme:'Theme',lang:'Language',mobile:'Mobile preview',desktop:'Desktop',random:'Random design',gallery:'All designs',prev:'Previous design',next:'Next design',close:'Close',search:'Find a design',searchHint:'Title or designer',noResults:'No matching designs',openPreview:'Open preview in a new tab',loadingPreview:'Loading preview…',previewFailed:'Preview unavailable',currentDesign:'On this page'},
 es:{theme:'Tema',lang:'Idioma',mobile:'Vista móvil',desktop:'Escritorio',random:'Diseño aleatorio',gallery:'Todos los diseños',prev:'Diseño anterior',next:'Diseño siguiente',close:'Cerrar',search:'Buscar diseño',searchHint:'Título o diseñador',noResults:'No hay diseños coincidentes',openPreview:'Abrir vista previa en otra pestaña',loadingPreview:'Cargando vista previa…',previewFailed:'Vista previa no disponible',currentDesign:'En esta página'},
 'pt-br':{theme:'Tema',lang:'Idioma',mobile:'Prévia mobile',desktop:'Desktop',random:'Design aleatório',gallery:'Todos os designs',prev:'Design anterior',next:'Próximo design',close:'Fechar',search:'Buscar um design',searchHint:'Título ou designer',noResults:'Nenhum design encontrado',openPreview:'Abrir prévia em outra aba',loadingPreview:'Carregando prévia…',previewFailed:'Prévia indisponível',currentDesign:'Nesta página'},
 fr:{theme:'Thème',lang:'Langue',mobile:'Aperçu mobile',desktop:'Bureau',random:'Design aléatoire',gallery:'Tous les designs',prev:'Design précédent',next:'Design suivant',close:'Fermer',search:'Rechercher un design',searchHint:'Titre ou designer',noResults:'Aucun design correspondant',openPreview:'Ouvrir l’aperçu dans un nouvel onglet',loadingPreview:'Chargement de l’aperçu…',previewFailed:'Aperçu indisponible',currentDesign:'Sur cette page'},
 de:{theme:'Design',lang:'Sprache',mobile:'Mobilvorschau',desktop:'Desktop',random:'Zufälliges Design',gallery:'Alle Designs',prev:'Vorheriges Design',next:'Nächstes Design',close:'Schließen',search:'Design suchen',searchHint:'Titel oder Designer',noResults:'Keine passenden Designs',openPreview:'Vorschau in neuem Tab öffnen',loadingPreview:'Vorschau wird geladen…',previewFailed:'Vorschau nicht verfügbar',currentDesign:'Diese Seite'},
 nl:{theme:'Thema',lang:'Taal',mobile:'Mobiel voorbeeld',desktop:'Desktop',random:'Willekeurig ontwerp',gallery:'Alle ontwerpen',prev:'Vorig ontwerp',next:'Volgend ontwerp',close:'Sluiten',search:'Ontwerp zoeken',searchHint:'Titel of ontwerper',noResults:'Geen overeenkomende ontwerpen',openPreview:'Voorbeeld openen in nieuw tabblad',loadingPreview:'Voorbeeld laden…',previewFailed:'Voorbeeld niet beschikbaar',currentDesign:'Op deze pagina'},
 ru:{theme:'Тема',lang:'Язык',mobile:'Мобильный просмотр',desktop:'Десктоп',random:'Случайный дизайн',gallery:'Все дизайны',prev:'Предыдущий дизайн',next:'Следующий дизайн',close:'Закрыть',search:'Найти дизайн',searchHint:'Название или автор',noResults:'Подходящих дизайнов нет',openPreview:'Открыть предпросмотр в новой вкладке',loadingPreview:'Загрузка предпросмотра…',previewFailed:'Предпросмотр недоступен',currentDesign:'На этой странице'},
 'zh-cn':{theme:'主题',lang:'语言',mobile:'手机预览',desktop:'桌面',random:'随机设计',gallery:'全部设计',prev:'上一个设计',next:'下一个设计',close:'关闭',search:'查找设计',searchHint:'标题或设计者',noResults:'没有匹配的设计',openPreview:'在新标签页中打开预览',loadingPreview:'正在加载预览…',previewFailed:'预览无法显示',currentDesign:'当前页面'},
 'zh-tw':{theme:'主題',lang:'語言',mobile:'手機預覽',desktop:'桌面',random:'隨機設計',gallery:'全部設計',prev:'上一個設計',next:'下一個設計',close:'關閉',search:'尋找設計',searchHint:'標題或設計者',noResults:'沒有符合的設計',openPreview:'在新分頁開啟預覽',loadingPreview:'正在載入預覽…',previewFailed:'無法顯示預覽',currentDesign:'目前頁面'}};
const VAR = {de:'de',fr:'fr','zh-cn':'zh','zh-tw':'zh'};
const qs = new URLSearchParams(location.search), embed = qs.has('embed');
const $ = (s, r = document) => r.querySelector(s);
const state = {themes:[], theme:null, lang:'en', strings:{}, ui:UI.en};
const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const load = k => { try { return localStorage.getItem(k); } catch { return null; } };
const emit = () => document.dispatchEvent(new CustomEvent('zen:change', {detail:state}));

function pickLang() {
  const c = [qs.get('lang'), load('zen-lang'), ...(navigator.languages || [])].filter(Boolean).map(l => l.toLowerCase());
  for (const l of c) { if (LANGS[l]) return l; if (l === 'pt' || l.startsWith('pt-')) return 'pt-br'; if (l === 'zh' || l === 'zh-hans') return 'zh-cn'; if (l.startsWith('zh-')) return 'zh-tw'; const b = l.split('-')[0]; if (LANGS[b]) return b; }
  return 'en';
}
function cssFor(t) { return t.variants[VAR[state.lang]] || t.css; }

export async function setLang(lang) {
  state.lang = lang; state.ui = UI[lang] || UI.en; save('zen-lang', lang);
  state.strings = await (await fetch(`locales/${lang}.json`)).json();
  document.documentElement.lang = lang === 'pt-br' ? 'pt-BR' : lang;
  document.title = state.strings.title; $('meta[name=description]').content = state.strings.description;
  document.querySelectorAll('[data-i18n]').forEach(el => { const v = state.strings[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { const v = state.strings[el.dataset.i18nTitle]; if (v) el.title = v.replace(/&#8217;/g, '’').replace(/<[^>]+>/g, ''); });
  const by = state.strings['design-selection-by']; renderList(by);
  linkFooter(); applyCss(); sync();
}
function linkFooter() {
  const s = state.strings, L = {'zen-validate-html':'https://validator.w3.org/check?uri=' + encodeURIComponent(location.href),'zen-validate-css':'https://jigsaw.w3.org/css-validator/validator?uri=' + encodeURIComponent(location.href),'zen-license':'https://creativecommons.org/licenses/by-nc-sa/3.0/','zen-accessibility':'https://www.csszengarden.com/pages/faq/','zen-github':'https://github.com/mezzoblue/csszengarden.com'};
  for (const [c, u] of Object.entries(L)) { const a = $('.' + c); if (a) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; } }
  const R = {'css-resources':'pages/resources/','zen-faq':'pages/faq/','zen-submit':'pages/submit/','zen-translations':'pages/translations/'};
  for (const [c, p] of Object.entries(R)) { const a = $('.' + c + ' a'); if (a) { a.href = 'https://www.csszengarden.com/' + p; a.target = '_blank'; a.rel = 'noopener'; } }
  document.querySelectorAll('.page-wrapper a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
}
function renderList(by) {
  $('#theme-list').innerHTML = state.themes.map(t => `<li class="${[t === state.theme ? 'current' : '', t.highlight ? 'highlighted' : ''].filter(Boolean).join(' ')}"><a class="design-name" href="?theme=${encodeURIComponent(t.id)}" data-id="${esc(t.id)}"${t === state.theme ? ' aria-current="page"' : ''}><img src="${esc(t.preview)}" alt="" loading="lazy"><span class="entry-copy"><span class="entry-title">${esc(t.title)}</span></span></a><span class="entry-by">${esc(by)} <a class="designer-name" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.author)}</a></span>${t.highlight ? `<span class="highlight-badge">${esc(t.badge || 'Featured')}</span>` : ''}</li>`).join('');
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function applyCss() {
  const link = $('#theme-css'), href = cssFor(state.theme);
  if (link.getAttribute('href') === href) return;
  const next = link.cloneNode(); next.removeAttribute('id'); next.href = href;
  next.onload = () => { link.remove(); next.id = 'theme-css'; };
  next.onerror = () => { next.remove(); };
  link.after(next);
}
export function setTheme(id, push = true) {
  const t = state.themes.find(x => x.id === id) || state.themes[0];
  const go = () => { state.theme = t; save('zen-theme', t.id); applyCss(); $('#view-css').href = cssFor(t);
    document.querySelectorAll('#theme-list li').forEach(li => {
      const link = li.querySelector('a.design-name'), current = link?.dataset.id === t.id;
      li.classList.toggle('current', current);
      if (current) link.setAttribute('aria-current', 'page'); else link?.removeAttribute('aria-current');
    });
    sync(); };
  document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches ? document.startViewTransition(go) : go();
}
function sync() {
  const u = new URL(location.href); u.searchParams.set('theme', state.theme.id); u.searchParams.set('lang', state.lang);
  if (embed) u.searchParams.set('embed', '1'); history.replaceState(null, '', u); emit();
}
export const step = d => { const i = state.themes.indexOf(state.theme); setTheme(state.themes[(i + d + state.themes.length) % state.themes.length].id); };
export const random = () => { let t; do t = state.themes[Math.random() * state.themes.length | 0]; while (t === state.theme && state.themes.length > 1); setTheme(t.id); };

async function init() {
  state.themes = await (await fetch('themes-full.json')).json();
  state.theme = state.themes.find(t => t.id === (qs.get('theme') || load('zen-theme') || '222')) || state.themes[0];
  if (embed) { document.documentElement.classList.add('embed'); $('.zen-spacer').remove(); }
  $('#theme-list').addEventListener('click', e => { const a = e.target.closest('a.design-name'); if (a) { e.preventDefault(); setTheme(a.dataset.id); } });
  $('#open-gallery').addEventListener('click', e => { e.preventDefault(); document.dispatchEvent(new Event('zen:gallery')); });
  addEventListener('keydown', e => { if (e.target.closest?.('input,select,textarea') || e.altKey || e.ctrlKey || e.metaKey) return; if (e.key === 'ArrowRight' && e.shiftKey) step(1); if (e.key === 'ArrowLeft' && e.shiftKey) step(-1); });
  await setLang(pickLang());
  if (!embed) await import('./components.js');
  await import('./credit.js');
}
Object.assign(globalThis, {}); export { state, LANGS, embed };
init();
