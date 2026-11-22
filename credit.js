class ZenCredit extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode:'open'}).innerHTML = `<style>:host{display:block;position:relative;z-index:1;padding:24px 16px;text-align:center}
p{all:initial;display:inline-block;font:13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#f2f2f7;background:#1c1c1ee6;padding:10px 16px;border-radius:999px;box-shadow:0 2px 12px #0004;max-width:100%}
a{color:#9ad9b4}</style><footer><p>Side Project: <a href="https://github.com/mezzoblue/csszengarden.com" target="_blank" rel="noopener">CSS Zen Garden</a> by <a href="https://daveshea.com/" target="_blank" rel="noopener">David Shea</a>. All credits for David Shea.</p></footer>`;
  }
}
customElements.define('zen-credit', ZenCredit);
