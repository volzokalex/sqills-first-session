# First Session Experience (Lesson 0) — prototype

Web prototype of the very first session after onboarding: welcome → guided tour → Lesson 0,
where the user turns one prompt into a finished one-page website. Standalone HTML/JS (no build),
matching the `tech/features-dev/` prototype pattern. **Not the production runtime** — the real app
is Flutter (`shi-app`); this proves the experience so we can review, edit, then write the spec.

## Run

```bash
cd tech/features-dev/first-session
python3 -m http.server 8177
# open http://localhost:8177/
```

Best viewed in a mobile-width window; the page draws its own 390×844 phone frame.
A **DEV** toolbar (top-left) switches the mocked onboarding profession and resets state.

## The 14 steps

- **A1–A3** Welcome (outside the lesson shell): intro animation · certificate anchor · "what's inside".
- **B1–B3** Guided tour: coach-marks (dimmed backdrop + cut-out) over *fake* Mission Map / Mission Page
  stand-ins (in production they overlay the real screens). Skippable; completion persisted.
- **C1–C8** Lesson 0 (lesson shell): framing · setup+preview · **multi-select blocks** · **AI Box**
  (prompt prefilled from onboarding, editable) · **loader** · **artifact result** · **rendered site**
  (own route, "Back to lesson") · **congratulation + rating**.

## Architecture

- `js/data.js` — onboarding mock, block catalog (= the C3 options), screen copy, step list.
- `js/generate.js` — the pipeline: `buildPrompt` → mock "LLM" (structured content only, shaped by
  profession + a light read of the prompt) → **validate + clamp every field to a max length** →
  fallback. The LLM never returns markup.
- `js/renderer.js` — fixed block registry `hero | bullets | cards | stats | quote | cta`; composes
  the page from clamped content; all text escaped. Layout/typography/colour locked here.
- `js/store.js` — IndexedDB keyed by artifact id (sessionStorage fallback). No server persistence.
- `js/coachmarks.js` — fake surfaces + coach-mark overlay with a highlighted, tappable cut-out.
- `js/app.js` — state, router, lesson shell, all screens, dev bar.

## What is mocked / decided (prototype defaults)

- **Generation is fully mocked** — no API key. Content is a per-profession library, lightly
  personalized (e.g. a business name in quotes). It still runs through the real
  validate→clamp→fallback path, so "template cannot break" is demonstrated, not faked.
- **§9 defaults:** topic derived from onboarding (AI Box = override) · blocks min 2 / max 5, primary
  disabled at 0 · regeneration allowed (Run it again) · tour skippable · anonymous (no auth) ·
  PDF export deferred (fast-follow) · rating captured locally · loader has a min display + rotating
  status. These are prototype choices to be confirmed when the spec is written.

## Verified

Full A1→C8 walkthrough with no JS errors; profession switch changes the C4 prefill; adversarial
prompt input (`<script>`, 400× emoji) produces no markup in the render and stays within field limits.

## Not yet

- GitHub Pages deploy (needs a repo — Alex pushes).
- Real LLM path, PDF export, sharing (server persistence tradeoff — see brief §7), Flutter integration.
