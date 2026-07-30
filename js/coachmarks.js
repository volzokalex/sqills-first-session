// Fake Map / Mission Page surfaces + a coach-mark overlay with a cut-out around the target.
// In production these coach marks sit above the REAL Mission Map / Mission Page; here we
// stand in lightweight fakes so the tour has something real-looking to point at.

export function fakeSurfaceHTML(step) {
  if (step === 'B1') {
    return `
      <div class="fake">
        <div class="topbar"><div class="title">Your Journey</div><div>🔥 1 · ⭐ Lvl 1</div></div>
        <div class="map">
          <div class="mnode first" id="coach-target"><span class="num">1</span>🌅</div>
          <div class="trail"></div>
          <div class="mnode">🔒</div>
          <div class="trail"></div>
          <div class="mnode">🔒</div>
          <div class="trail"></div>
          <div class="mnode">🏆</div>
        </div>
      </div>`;
  }
  if (step === 'B2') {
    return `
      <div class="fake">
        <div class="topbar"><div>‹ Back</div><div class="title" style="font-size:16px">Mission 1</div><div>×</div></div>
        <div class="mission-hero" id="coach-target"><div class="play">▶</div></div>
        <div class="pad"><h2 class="d">Build your first website</h2><p class="lede mt8 muted">A quick preview of what you’ll make.</p></div>
        <div class="lesson-row"><div class="n">0</div><div class="grow"><b>Lesson 0</b><div class="small muted">Your first real result</div></div><div>›</div></div>
      </div>`;
  }
  // B3
  return `
    <div class="fake">
      <div class="topbar"><div>‹ Back</div><div class="title" style="font-size:16px">Mission 1</div><div>×</div></div>
      <div class="mission-hero"><div class="play">▶</div></div>
      <div class="pad"><h2 class="d">Build your first website</h2><p class="lede mt8 muted">Start below.</p></div>
      <div class="lesson-row" id="coach-target"><div class="n">0</div><div class="grow"><b>Lesson 0</b><div class="small muted">Your first real result</div></div><div>›</div></div>
    </div>`;
}

// Mount the dimmed overlay + highlight over `targetEl` inside `appEl`.
export function mountCoach(appEl, targetEl, copy, onTap, onSkip) {
  const appRect = appEl.getBoundingClientRect();
  const r = targetEl.getBoundingClientRect();
  const pad = 8;
  const x = r.left - appRect.left - pad;
  const y = r.top - appRect.top - pad;
  const w = r.width + pad * 2;
  const h = r.height + pad * 2;

  const overlay = document.createElement('div');
  overlay.className = 'coach-overlay';

  // Cut-out: an element the size of the target whose massive box-shadow dims everything else.
  const hole = document.createElement('div');
  hole.className = 'coach-hole';
  Object.assign(hole.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });

  // Transparent hotspot — only the target is tappable.
  const hot = document.createElement('div');
  hot.className = 'coach-hot';
  Object.assign(hot.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', cursor: 'pointer', zIndex: '61' });
  hot.addEventListener('click', onTap);

  // Coach card, placed below the hole unless it would overflow.
  const card = document.createElement('div');
  card.className = 'coach-card';
  const below = y + h + 16;
  if (below + 130 < appRect.height) card.style.top = below + 'px';
  else card.style.bottom = (appRect.height - y + 16) + 'px';
  card.innerHTML = `<div class="ct">${copy.title}</div><div class="cb">${copy.body}</div><div class="cta-tap">👆 ${copy.target}</div>`;

  const skip = document.createElement('button');
  skip.className = 'coach-skip';
  skip.textContent = 'Skip tour';
  skip.addEventListener('click', onSkip);

  overlay.appendChild(hole);
  overlay.appendChild(hot);
  overlay.appendChild(card);
  overlay.appendChild(skip);
  return overlay;
}
