// Mock generation (v2). C3 is single-select: one site type -> one prompt + one template.
// Pipeline mirrors the schema: buildPrompt -> mock structured content -> validate + CLAMP -> fallback.
// The model never returns markup; our renderer composes the page from clamped content only.

import { PROFESSIONS } from './data.js';

export const SCHEMA_VERSION = 2;

const LIMITS = {
  hero:    { kicker: 24, headline: 60, subhead: 140, cta: 22 },
  bullets: { count: 3, item: 96 },
  cards:   { count: 3, title: 30, body: 88 },
  stats:   { count: 3, num: 8, label: 20 },
  quote:   { text: 150, author: 40 },
  cta:     { headline: 46, button: 22 },
};
const clip = (s, n) => (s == null ? '' : String(s)).replace(/\s+/g, ' ').trim().slice(0, n);
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Which blocks each site type draws, in order (schema_id).
export const SCHEMAS = {
  profile: ['hero', 'bullets', 'stats', 'cta'],
  service: ['hero', 'cards', 'quote', 'cta'],
  launch:  ['hero', 'bullets', 'stats', 'cta'],
};

// Read-only prompt shown on C4, interpolated from onboarding.
export function buildPrompt(siteTypeId, onb) {
  const p = PROFESSIONS.find(x => x.id === onb.profession) || PROFESSIONS[0];
  const intro = `I'm a ${p.noun} and my goal is to ${onb.goal.toLowerCase()}.`;
  const T = {
    profile: `Build a one-page professional profile site for ${p.topic}.\n\n${intro}\n\nSections: a bold intro, three things that set me apart, a few proof numbers, and a way to get in touch.\n\nTone: warm, confident, plain language. Headline about the result my clients get, not about me.`,
    service: `Build a one-page local-service site for ${p.topic}.\n\n${intro}\n\nSections: a bold intro, the services I offer, a short client testimonial, and a clear booking call-to-action.\n\nTone: friendly and local. Make people feel they can trust me with the job.`,
    launch:  `Build a one-page launch site for a new offer from ${p.topic}.\n\n${intro}\n\nSections: a bold intro announcing the offer, the key benefits, a few proof numbers, and a strong call-to-action.\n\nTone: exciting but honest. Create momentum without hype.`,
  };
  return T[siteTypeId] || T.profile;
}

// Mock "LLM": structured content per site type, personalized by profession + name.
function mockLLM(siteTypeId, onb) {
  const p = PROFESSIONS.find(x => x.id === onb.profession) || PROFESSIONS[0];
  const noun = p.noun, Noun = cap(noun), name = onb.name || 'Your name';
  const base = {
    profile: {
      brand: name,
      hero: { kicker: Noun, headline: `Hi, I’m ${name}`, subhead: `I’m a ${noun} helping people get real results — clearly, and without the jargon.`, cta: 'Work with me' },
      bullets: ['Clear work, explained in plain language', 'A partner who actually replies', 'Results you can point to'],
      stats: [{ num: '5+ yrs', label: 'experience' }, { num: '50+', label: 'clients helped' }, { num: '24h', label: 'reply time' }],
      cta: { headline: 'Let’s work together.', button: 'Get in touch' },
    },
    service: {
      brand: `${Noun} — local`,
      hero: { kicker: 'Near you', headline: 'Help you can count on, close to home', subhead: `A trusted ${noun} in your area. Friendly, reliable, and easy to book.`, cta: 'Book now' },
      cards: [
        { title: 'What I do', body: 'The core service, done properly the first time.' },
        { title: 'How it works', body: 'Message me, we agree a time, I handle the rest.' },
        { title: 'Why me', body: 'Local, reliable, and genuinely care about the result.' },
      ],
      quote: { text: 'Turned up on time, did a brilliant job, fair price. Couldn’t recommend more.', author: 'A local client' },
      cta: { headline: 'Ready when you are.', button: 'Book a time' },
    },
    launch: {
      brand: `${Noun} — launch`,
      hero: { kicker: 'Just launched', headline: 'Something new, made for you', subhead: `A new offer from a ${noun} who’s done the work. Get in early.`, cta: 'Get early access' },
      bullets: ['Built from real experience, not theory', 'Everything you need, nothing you don’t', 'A price that makes sense today'],
      stats: [{ num: 'New', label: 'this week' }, { num: '100+', label: 'on the list' }, { num: '48h', label: 'early-bird window' }],
      cta: { headline: 'Be one of the first.', button: 'Claim your spot' },
    },
  };
  return base[siteTypeId] || base.profile;
}

const FALLBACK = mockLLM('profile', { profession: 'marketer', name: 'Your name', goal: '' });

export function validateAndClamp(raw, orderedBlocks) {
  const src = raw || {}, fb = FALLBACK, content = {};
  for (const id of orderedBlocks) {
    if (id === 'hero') {
      const h = src.hero || fb.hero, L = LIMITS.hero;
      content.hero = { kicker: clip(h.kicker, L.kicker), headline: clip(h.headline, L.headline), subhead: clip(h.subhead, L.subhead), cta: clip(h.cta, L.cta) };
    } else if (id === 'bullets') {
      const a = (Array.isArray(src.bullets) ? src.bullets : fb.bullets).slice(0, LIMITS.bullets.count);
      while (a.length < LIMITS.bullets.count) a.push(fb.bullets[a.length]);
      content.bullets = a.map(x => clip(x, LIMITS.bullets.item));
    } else if (id === 'cards') {
      const a = (Array.isArray(src.cards) ? src.cards : fb.cards || []).slice(0, LIMITS.cards.count);
      content.cards = a.map(c => ({ title: clip(c && c.title, LIMITS.cards.title), body: clip(c && c.body, LIMITS.cards.body) }));
    } else if (id === 'stats') {
      const a = (Array.isArray(src.stats) ? src.stats : fb.stats).slice(0, LIMITS.stats.count);
      while (a.length < LIMITS.stats.count) a.push(fb.stats[a.length]);
      content.stats = a.map(s => ({ num: clip(s && s.num, LIMITS.stats.num), label: clip(s && s.label, LIMITS.stats.label) }));
    } else if (id === 'quote') {
      const q = src.quote || fb.cta, L = LIMITS.quote;
      content.quote = { text: clip((src.quote || {}).text, L.text), author: clip((src.quote || {}).author, L.author) };
    } else if (id === 'cta') {
      const c = src.cta || fb.cta, L = LIMITS.cta;
      content.cta = { headline: clip(c.headline, L.headline), button: clip(c.button, L.button) };
    }
  }
  return { blocks: orderedBlocks.slice(), content, brand: clip(src.brand || fb.brand, 40) };
}

export function generateArtifact(siteTypeId, onb) {
  const blocks = SCHEMAS[siteTypeId] || SCHEMAS.profile;
  let raw; try { raw = mockLLM(siteTypeId, onb); } catch (_) { raw = null; }
  const clamped = validateAndClamp(raw, blocks);
  return { id: 'a_' + Math.random().toString(36).slice(2, 9), schema_version: SCHEMA_VERSION, siteType: siteTypeId, createdAt: Date.now(), theme: 'sqills-warm', layout: 'scroll', ...clamped };
}
