import { PROFESSIONS, DEFAULT_ONBOARDING, SITE_TYPES, STEPS, LESSON_STEP_IDS, COPY, LOGOS } from './data.js';
import { buildPrompt, generateArtifact } from './generate.js';
import { renderPage } from './renderer.js';
import { saveArtifact, loadArtifact } from './store.js';
import { icon } from './icons.js';

const app = document.getElementById('app');

// ---- State ----
const LS = 'sqills-fs-state';
const persisted = JSON.parse(localStorage.getItem(LS) || '{}');
const state = {
  i: 0,
  onboarding: { ...DEFAULT_ONBOARDING, ...(persisted.onboarding || {}) },
  siteType: 'profile', // single default template — the build is always a one-page site now
  guess: null,         // C3 "how long would it take" answer (for the wow payoff)
  artifactId: null,
  rating: 0,
};
const savePersist = () => localStorage.setItem(LS, JSON.stringify({ onboarding: state.onboarding }));

// ---- Router ----
const idIndex = id => STEPS.findIndex(s => s.id === id);
const goto = id => { state.i = idIndex(id); render(); };
const go = d => { state.i = Math.max(0, Math.min(STEPS.length - 1, state.i + d)); render(); };
function render() {
  const step = STEPS[state.i];
  app.innerHTML = '';
  app.appendChild(SCREENS[step.id]());
}

// ---- Helpers ----
function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function progressPct() {
  const idx = LESSON_STEP_IDS.indexOf(STEPS[state.i].id);
  return idx < 0 ? 0 : Math.round(((idx + 1) / LESSON_STEP_IDS.length) * 100);
}
function lessonShell({ backEnabled = true, body, buttonLabel, buttonEnabled = true, onButton }) {
  const s = h(`<div class="screen">
    <div class="brand-band"></div>
    <div class="shell-top">
      <button class="icon-btn" data-back ${backEnabled ? '' : 'disabled'}>${icon('chevron-left', 22)}</button>
      <div class="progress"><i style="width:${progressPct()}%"></i></div>
      <button class="icon-btn" data-close>${icon('x', 22)}</button>
    </div>
    <div class="shell-body"><div class="pad"></div></div>
    <div class="shell-bottom"></div>
  </div>`);
  s.querySelector('.shell-body .pad').appendChild(body);
  const btn = h(`<button class="btn btn-primary" ${buttonEnabled ? '' : 'disabled'}>${buttonLabel}</button>`);
  btn.addEventListener('click', onButton);
  s.querySelector('.shell-bottom').appendChild(btn);
  s.querySelector('[data-back]').addEventListener('click', () => go(-1));
  s.querySelector('[data-close]').addEventListener('click', () => { if (confirm('Leave the lesson? Progress here will reset.')) goto('A1'); });
  s._btn = btn;
  return s;
}
// Non-shell screen with a bottom primary button (welcome + video blocks).
function plainScreen(inner, buttonLabel, onButton) {
  const s = h(`<div class="screen"><div class="brand-band"></div><div class="brand-head"><img class="wordmark-sm" src="assets/wordmark.svg" alt="sqills.ai"></div><div class="scroll pad">${inner}</div><div class="shell-bottom"><button class="btn btn-primary" data-next>${buttonLabel}</button></div></div>`);
  s.querySelector('[data-next]').addEventListener('click', onButton);
  return s;
}
function videoStage(caption) {
  return `<div class="videostage"><div class="vplay">${icon('play', 26)}</div><div class="vcap">${caption}</div></div>`;
}
function videoEmbed(src) {
  return `<div class="videostage"><video src="${src}" autoplay muted loop playsinline preload="metadata"></video></div>`;
}
// Knock out light backgrounds (white / transparency-checkerboard baked into a JPG) so every
// logo sits with no background. Same-origin images → canvas is not tainted.
function knockoutLogo(img) {
  if (img.dataset.ko) return;
  const run = () => {
    if (img.dataset.ko) return; img.dataset.ko = '1';
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
      for (let i = 0; i < p.length; i += 4) {
        const lum = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        if (lum > 216) p[i + 3] = 0; // light bg / checker → transparent
      }
      x.putImageData(d, 0, 0);
      img.src = c.toDataURL('image/png');
    } catch (e) {}
  };
  if (img.complete && img.naturalWidth) run();
  else img.addEventListener('load', run, { once: true });
}

// ================= SCREENS =================
const SCREENS = {
  A1() {
    const c = COPY.A1;
    const s = h(`<div class="screen intro">
      <div class="bg"></div>
      <img class="wordmark-lg" src="assets/wordmark-light.svg" alt="sqills.ai" />
      <div class="intro-text">${c.text.replace(/\n/g, '<br>')}</div>
      <div class="cont"><button class="btn btn-secondary" data-next>Let's go</button></div>
    </div>`);
    s.querySelector('[data-next]').addEventListener('click', () => go(1));
    return s;
  },

  A2() {
    const c = COPY.A2;
    return plainScreen(`
      <div class="cert-img"><img src="assets/cert.png" alt="AI Mastery Certification" /></div>
      <h1 class="d mt24 center">${c.title}</h1>
      <p class="lede mt12 center">${c.body}</p>`, 'Continue', () => go(1));
  },

  A3() {
    const c = COPY.A3;
    const feats = c.chain.map((n, i) => `
      <div class="feature in" style="animation-delay:${0.15 + i * 0.18}s">
        <span class="ic-chip">${icon(n.icon, 22)}</span>
        <span class="grow"><b>${n.name}</b><div class="fd">${n.desc}</div></span>
      </div>`).join('');
    return plainScreen(`
      <div class="eyebrow">${c.eyebrow}</div>
      <h1 class="d mt8">${c.title}</h1>
      <p class="lede mt8">${c.body}</p>
      <div class="features">${feats}</div>`, c.cta, () => go(1));
  },

  // ---- Block B: looping video tutorial ----
  B1: () => videoScreen('B1'),
  B2: () => videoScreen('B2'),
  B3: () => videoScreen('B3'),
  B4() {
    const c = COPY.B4;
    const tile = l => `<div class="logo-tile"><img src="${l.src}" alt="${l.alt}"></div>`;
    const top = LOGOS.slice(0, 3).map(tile).join('');
    const bottom = LOGOS.slice(3).map(tile).join('');
    const s = plainScreen(`
      <div class="eyebrow">${c.eyebrow}</div>
      <h1 class="d mt8">${c.title}</h1>
      <p class="lede mt16">${c.body}</p>
      <div class="logos">
        <div class="logo-row">${top}</div>
        <div class="logo-row">${bottom}</div>
      </div>
      <p class="muted small center mt16">${c.caption}</p>`, c.cta, () => go(1));
    s.querySelectorAll('.logo-tile img').forEach(knockoutLogo);
    return s;
  },
  B5() {
    const c = COPY.B5;
    return plainScreen(`
      <div class="eyebrow">${c.eyebrow}</div>
      <h1 class="d mt8">${c.title}</h1>
      <p class="lede mt16">${c.body}</p>`, c.cta, () => goto('C1')); // straight into Lesson 0, skips the map
  },

  // ---- Block C: Lesson 0 ----
  C1() {
    const c = COPY.C1;
    const body = h(`<div>
      <div class="eyebrow">${c.eyebrow}</div><h1 class="d mt8">${c.title}</h1>
      <p class="lede mt16">${c.body}</p>
      <p class="lede mt12"><b>${c.sub}</b></p>
      <div class="vcap-label mt16">${c.vcaption}</div>
      ${videoEmbed(c.video)}
    </div>`);
    return lessonShell({ backEnabled: false, body, buttonLabel: c.cta, onButton: () => go(1) });
  },

  C3() {
    const c = COPY.C3;
    const opts = c.options.map((o, i) => `
      <button class="type-opt" data-i="${i}" aria-pressed="${state.guess === o}">
        <span class="grow"><span class="to-name">${o}</span></span>
        <span class="to-radio"></span>
      </button>`).join('');
    const body = h(`<div>
      <div class="eyebrow">${c.eyebrow}</div><h1 class="d mt8">${c.title}</h1>
      <p class="lede mt8">${c.body}</p>
      <div class="types">${opts}</div>
    </div>`);
    const shell = lessonShell({ body, buttonLabel: c.cta, buttonEnabled: !!state.guess, onButton: () => go(1) });
    body.querySelectorAll('.type-opt').forEach(el => el.addEventListener('click', () => {
      state.guess = c.options[+el.dataset.i];
      body.querySelectorAll('.type-opt').forEach(x => x.setAttribute('aria-pressed', c.options[+x.dataset.i] === state.guess));
      shell._btn.disabled = false;
    }));
    return shell;
  },

  C4() {
    const c = COPY.C4;
    const promptText = buildPrompt(state.siteType || 'profile', state.onboarding);
    const body = h(`<div>
      <div class="eyebrow">${c.eyebrow}</div><h1 class="d mt8">${c.title}</h1>
      <p class="lede mt8">${c.body}</p>
      <div class="aibox ro">
        <div class="label"><span>Prompt</span><span>read-only</span></div>
        <textarea class="sandbox" rows="8" readonly spellcheck="false"></textarea>
        <div class="lockrow">${icon('lock', 14)} ${c.note}</div>
      </div>
    </div>`);
    body.querySelector('.sandbox').value = promptText;
    return lessonShell({ body, buttonLabel: c.cta, onButton: () => go(1) });
  },

  C5() {
    const c = COPY.C5;
    const s = h(`<div class="screen cook">
      <div class="ring"></div>
      <div class="status">${c.statuses[0]}…</div>
      <div class="sub">${c.sub}</div>
    </div>`);
    let idx = 0; const statusEl = s.querySelector('.status');
    const iv = setInterval(() => { idx = (idx + 1) % c.statuses.length; statusEl.textContent = c.statuses[idx] + '…'; }, 620);
    const started = Date.now();
    const artifact = generateArtifact(state.siteType || 'profile', state.onboarding);
    saveArtifact(artifact).then(id => { state.artifactId = id; });
    setTimeout(() => { clearInterval(iv); go(1); }, Math.max(0, 2400 - (Date.now() - started)) + 400);
    return s;
  },

  C6() {
    const c = COPY.C6;
    const s = h(`<div class="screen result pad scroll">
      <div class="illus" data-robot-slot>${icon('sparkles', 40)}</div>
      <div class="headline">${c.headline}</div>
      <div class="say">${c.say1}</div>
      <div class="linkchip mt16" data-view>
        ${icon('globe', 18)}
        <span class="lc-url">my-site.sqills.ai</span>
        ${icon('external-link', 16)}
      </div>
      <div class="say mt16">${c.say2}</div>
      <div style="width:100%;margin-top:auto;padding-top:22px"><button class="btn btn-primary" data-complete>${c.cta}</button></div>
    </div>`);
    s.querySelector('[data-view]').addEventListener('click', () => go(1));          // link → view the site (C7)
    s.querySelector('[data-complete]').addEventListener('click', () => goto('C8')); // button → complete the lesson
    return s;
  },

  C7() {
    // The generated result is the real running site (Alex's dev server).
    const s = h(`<div class="screen"><div class="site">
      <div class="back-to-lesson" data-back>${icon('chevron-left', 18)} Back to lesson</div>
      <iframe class="siteframe" src="https://volzokalex.github.io/own-product/" title="My site" loading="eager"></iframe>
    </div></div>`);
    s.querySelector('[data-back]').addEventListener('click', () => go(-1)); // back to C6
    return s;
  },

  C8() {
    const c = COPY.C8;
    const body = h(`<div class="congrats">
      <div class="term"><span class="g">${icon('terminal', 15)} ${c.term}</span></div>
      <div class="cap">${c.capability}</div>
      <div class="muted small">${c.ratingQ}</div>
      <div class="stars">${[1,2,3,4,5].map(n => `<span class="star" data-n="${n}">${icon('star', 32)}</span>`).join('')}</div>
      <div class="feedback" hidden><textarea class="sandbox" placeholder="${c.feedbackLabel}" style="min-height:80px"></textarea></div>
    </div>`);
    const stars = body.querySelectorAll('.star'); const fb = body.querySelector('.feedback');
    stars.forEach(st => st.addEventListener('click', () => {
      state.rating = +st.dataset.n;
      stars.forEach(x => x.classList.toggle('on', +x.dataset.n <= state.rating));
      fb.hidden = state.rating > 3;
    }));
    return lessonShell({ body, buttonLabel: c.cta, onButton: finishLesson });
  },
};

function videoScreen(step) {
  const c = COPY[step];
  return plainScreen(`
    <div class="eyebrow">${c.eyebrow}</div>
    <h1 class="d mt8">${c.title}</h1>
    ${c.video ? videoEmbed(c.video) : videoStage('Loop video · asset coming')}
    <p class="lede mt16">${c.body}</p>`, c.cta, () => go(1));
}

function finishLesson() {
  savePersist();
  const done = h(`<div class="screen result pad" style="justify-content:center;text-align:center">
    <div class="illus">${icon('check', 44)}</div>
    <h1 class="d">Lesson 0 complete</h1>
    <p class="lede mt16 muted">You built and kept a real artifact${state.rating ? ` · rated ${state.rating}/5` : ''}. This is where the real missions begin.</p>
    <div style="width:100%;margin-top:28px" class="stack">
      <button class="btn btn-primary" data-restart>Run it again</button>
      <button class="btn btn-ghost" data-map>Back to the start</button>
    </div>
  </div>`);
  done.querySelector('[data-restart]').addEventListener('click', () => { state.siteType = null; state.artifactId = null; state.rating = 0; goto('C1'); });
  done.querySelector('[data-map]').addEventListener('click', () => goto('A1'));
  app.innerHTML = ''; app.appendChild(done);
}

// Deep-link: ?step=<STEP> (or ?cap=<STEP>) jumps straight to a step.
(function initRoute() {
  const p = new URLSearchParams(location.search);
  const id = p.get('step') || p.get('cap');
  if (id) {
    const idx = idIndex(id);
    if (idx >= 0) state.i = idx;
  }
})();

render();
