// Fixed renderer. Composes the page from the block registry using clamped content only.
// Layout, typography and colour live here (locked) — no input can alter them.

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const REGISTRY = {
  hero: (c) => `
    <section class="blk blk-hero">
      <div class="kicker">${esc(c.kicker)}</div>
      <h1>${esc(c.headline)}</h1>
      <p>${esc(c.subhead)}</p>
      <span class="cta">${esc(c.cta)} →</span>
    </section>`,

  bullets: (c) => `
    <section class="blk">
      <h3 class="sec">Why it works</h3>
      <ul class="bullets">
        ${c.map((b) => `<li>${esc(b)}</li>`).join('')}
      </ul>
    </section>`,

  cards: (c) => `
    <section class="blk">
      <h3 class="sec">What you get</h3>
      <div class="cards">
        ${c.map((card) => `
          <div class="card">
            <div class="ci">${esc(card.icon)}</div>
            <h4>${esc(card.title)}</h4>
            <p>${esc(card.body)}</p>
          </div>`).join('')}
      </div>
    </section>`,

  stats: (c) => `
    <section class="blk">
      <div class="stats">
        ${c.map((s) => `<div class="stat"><div class="num">${esc(s.num)}</div><div class="lab">${esc(s.label)}</div></div>`).join('')}
      </div>
    </section>`,

  quote: (c) => `
    <section class="blk blk-quote">
      <div class="quote"><span class="mark">“</span>${esc(c.text)}
        <div class="by">${esc(c.author)}</div>
      </div>
    </section>`,

  cta: (c) => `
    <section class="blk blk-cta">
      <h3>${esc(c.headline)}</h3>
      <span class="btn2">${esc(c.button)}</span>
    </section>`,
};

// Returns the inner HTML of the rendered site (no chrome).
export function renderPage(artifact) {
  const body = artifact.blocks
    .map((id) => (REGISTRY[id] ? REGISTRY[id](artifact.content[id]) : ''))
    .join('');
  return `${body}<div class="footer">${esc(artifact.brand)} · built with Sqills</div>`;
}
