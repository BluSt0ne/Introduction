/* Showcase layer: sections added on top of the archive overview.
   Text and numbers live in data/showcase-data.js (edit with showcase-editor.html).
   Runs after app.js and showcase-anim.js; re-inserts itself whenever app.js re-renders #main. */
'use strict';
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PREVIEW = new URLSearchParams(location.search).has('showcase-preview');
let D = window.SHOWCASE_DATA || {};
if (PREVIEW) { try { const draft = JSON.parse(localStorage.getItem('showcase-draft-v1')); if (draft && typeof draft === 'object') D = draft; } catch {} }

/* line pictograms (24x24, stroke) */
const ICON = {
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  rules: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  scale: '<path d="M12 4v16M6 20h12M5 8h14"/><path d="m5 8-3 6h6zM19 8l-3 6h6z"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v4M5 13h4"/><circle cx="16" cy="12" r=".8"/><circle cx="18" cy="14" r=".8"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  shadedCube: '<ellipse cx="13" cy="21" rx="9" ry="2" fill="currentColor" fill-opacity=".18" stroke="none"/><path d="m12 2 8 4.5-8 4.5-8-4.5z" fill="currentColor" fill-opacity=".8"/><path d="m4 6.5 8 4.5v9l-8-4.5z" fill="currentColor" fill-opacity=".4"/><path d="m12 11 8-4.5v9l-8 4.5z" fill="currentColor" fill-opacity=".12"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  robot: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V4M10 4h4"/><circle cx="9.5" cy="13" r="1"/><circle cx="14.5" cy="13" r="1"/>',
  wrench: '<path d="M15 4a4 4 0 0 0-5 5L4 15l5 5 6-6a4 4 0 0 0 5-5l-3 3-3-3z"/>',
  bug: '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8v12M7 13H3M21 13h-4M8 9 5 6M16 9l3-3M7 18l-3 2M17 18l3 2"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  sync: '<path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2"/><path d="M20 4v5h-5M4 20v-5h5"/>',
  scissors: '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.5 8.5 11 9M8.5 15.5l11-9"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  hash: '<path d="M9 3 7 21M17 3l-2 18M4 8h17M3 16h17"/>',
  magic: '<path d="m4 20 11-11M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM19 13l.5 1.5L21 15l-1.5.5L19 17l-.5-1.5L17 15l1.5-.5z"/>',
  ai: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 15l2-6 2 6M9.3 13h2.4M15.5 9v6"/>',
  flower: '<circle cx="12" cy="10" r="2.5"/><path d="M12 7.5a3 3 0 1 1 2.6 1.6M12 7.5a3 3 0 1 0-2.6 1.6M9.5 10.5a3 3 0 1 0 2.5 2M14.5 10.5a3 3 0 1 1-2.5 2M12 13v8"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-9 8"/>',
  wave: '<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8"/><path d="m12 13 .8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-.6-.3-1-.6-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4c0-4.3-4-7.8-9-7.8z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="14.5" cy="7" r="1.2"/><circle cx="17" cy="10.5" r="1.2"/>',
  me: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
};
const ico = (k, cls = '') => `<svg class="nx-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ''}</svg>`;
window.NXIcons = ICON;





/* ---------- markup (all text comes from data/showcase-data.js) ---------- */
const head = (s, extra = '') => `<header class="nx-head"><span class="eyebrow">${e(s?.eyebrow || '')}</span><h2>${e(s?.title || '')}</h2>${extra}</header>`;
const list = v => Array.isArray(v) ? v : [];

function animCard(id, cls, d, steps) {
  return `<article class="nx-anim ${cls}" id="${id}">
    <header><span class="nx-anim-label">${e(d?.label || '')}</span></header>
    ${ytId(d?.video || '') ? `<div class="nx-play-video"><iframe src="https://www.youtube-nocookie.com/embed/${ytId(d.video)}" title="${e(d?.label || '')} 플레이 영상" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div>` : ''}
    <div class="nx-anim-stage"><canvas aria-label="${e(d?.label || '')} 게임 흐름 애니메이션"></canvas></div>
    <div class="nx-anim-bar" aria-hidden="true"><i></i></div>
    <ol class="nx-anim-phases" aria-hidden="true">${steps.map(([, s]) => `<li data-phase>${s}</li>`).join('')}</ol>
  </article>`;
}
function play() {
  const A = window.NXAnim, P = D.play || {};
  return `<section class="nx-play" id="nx-play" data-nx>
  ${head(P)}
  <div class="nx-anim-grid">
    ${animCard('nx-anim-wop', 'wop', P.wop, A ? A.wopScene().steps : [])}
    ${animCard('nx-anim-ww', 'ww', P.ww, A ? A.wmScene().steps : [])}
  </div>
</section>`;
}
function intro() {
  const I = D.intro || {};
  return `<section class="nx-intro nx-reveal" id="nx-intro" data-nx>
  <div class="nx-intro-copy">
    <span class="eyebrow">${e(I.eyebrow || '')}</span>
    <h1>${list(I.lines).map(l => e(l) + '<br>').join('')}<strong>${e(I.highlight || '')}</strong></h1>
    ${I.lead ? `<p class="nx-lead">${e(I.lead)}</p>` : ''}
    <div class="nx-intro-tags">${list(I.tags).map(t => `<span>${ico(t.icon)}${e(t.text)}</span>`).join('')}</div>
  </div>
  ${profile(I.profile)}
</section>`;
}

function profileTools(items) {
  const groups=new Map();
  list(items).forEach(t=>{const group=t.group||'기타';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(t);});
  return `<div class="nx-tool-groups">${[...groups].map(([name,tools])=>`<section class="nx-tool-group" aria-label="${e(name)} 도구"><h3>${e(name)}</h3><ul class="nx-tool-tiles">${tools.map(t=>`<li>${t.logo?`<img class="nx-logo" src="${e(t.logo)}" alt="">`:ico(t.icon)}<span>${e(t.name)}</span></li>`).join('')}</ul></section>`).join('')}</div>`;
}
function historyMarks(h) {
  const marks=list(h.marks);
  if(marks.length)return `<span class="nx-h-media">${marks.map(m=>`<span class="nx-history-mark"><img src="${e(m.src)}" alt="${e(m.label)}"></span>`).join('')}</span>`;
  return `<span class="nx-h-media">${list(h.images).length?list(h.images).map(src=>`<img src="${e(src)}" alt="" loading="lazy">`).join(''):`<i>${ico(h.icon||'check')}</i>`}</span>`;
}
function profile(P) {
  if (!P) return '';
  return `<aside class="nx-profile">
    <div class="nx-profile-id">${P.photo ? `<img src="${e(P.photo)}" alt="${e(P.name)} 사진">` : ''}<div><b>${e(P.name)}</b><p>${e(P.sub).replace(/\n/g, '<br>')}</p></div></div>
    <div class="nx-profile-block"><span class="eyebrow">${e(P.toolsTitle || 'TOOLS')}</span>${profileTools(P.tools)}</div>
    <div class="nx-profile-block"><span class="eyebrow">${e(P.historyTitle || 'HISTORY')}</span><ol class="nx-history">${list(P.history).map(h => `<li><time>${e(h.year)}</time>${historyMarks(h)}<span class="nx-h-text">${e(h.text)}</span></li>`).join('')}</ol></div>
  </aside>`;
}

function split() {
  const R = D.role || {}, tile = (t, who) => `<li class="nx-role-tile ${who}">${ico(t.icon)}<span>${e(t.text)}</span></li>`;
  const side = (who, big) => `<div class="nx-role ${who}"><header>${ico(big, 'big')}<div><h3>${e(R[who]?.title || '')}</h3><small>${e(R[who]?.sub || '')}</small></div></header><ul>${list(R[who]?.items).map(t => tile(t, who)).join('')}</ul></div>`;
  return `<section class="nx-section nx-reveal" id="nx-split" data-nx>
  ${head(R)}
  <div class="nx-roles">${side('me', 'me')}${side('ai', 'ai')}</div>
</section>`;
}

const rich = v => e(v).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
function psCard(it, extra = '', L = {}) {
  return `<article class="nx-ps">
    <span class="nx-ps-bar" aria-hidden="true"></span>${extra}
    <h3>${e(it.title)}</h3>
    <h4>${e(L.problem || '문제')}</h4><p>${rich(it.problem)}</p>
    <hr>
    <h4 class="sol">${e(L.solution || '해결')}</h4><p>${rich(it.solution)}</p>
    ${it.reason ? `<div class="nx-ps-reason"><h4>${e(L.reason || '수정 사유')}</h4><p>${rich(it.reason)}</p></div>` : ''}
    ${it.anim ? `<div class="nx-ps-clip" data-mini="${e(it.anim)}" aria-hidden="true"><canvas></canvas></div>` : list(it.images).length ? `<div class="nx-ps-shots" style="--n:${Math.min(list(it.images).length, 2)}">${list(it.images).map(im => `<figure><button type="button" class="nx-zoom" data-full="${e(im.full || im.src)}" data-cap="${e(im.caption)}" aria-label="${e(im.caption)} 크게 보기"><img src="${e(im.src)}" alt="${e(im.caption)}" loading="lazy"><span class="nx-zoom-ico" aria-hidden="true">⤢</span></button><figcaption>${e(im.caption)}</figcaption></figure>`).join('')}</div>` : ''}
  </article>`;
}
function aiIssues() {
  const A = D.ai || {};
  return `<section class="nx-section nx-reveal" id="nx-ai" data-nx>
  ${head(A)}
  <div class="nx-way-grid">${list(A.items).map((it, i) => `<article class="nx-way">
    <span class="nx-way-ico">${ico(it.icon || 'ai')}</span>
    <h3>${e(it.title)}</h3>
    <p>${rich(it.text)}</p>
  </article>`).join('')}</div>
</section>`;
}

function verify() {
  const C = D.cases || {};
  return `<section class="nx-section nx-reveal" id="nx-verify" data-nx>
  ${head(C)}
  ${list(C.projects).map(pj => `<div class="nx-pj ${e(pj.id)}">
    <header class="nx-pj-head"><span class="nx-pj-mark">${pj.logo ? `<img src="${e(pj.logo)}" alt="${e(pj.name)} 아이콘" loading="lazy">` : ico(pj.id === 'ww' ? 'magic' : 'flower')}</span><div><h3>${e(pj.name)}</h3><small>${e(pj.sub)}</small></div></header>
    <div class="nx-ps-grid">${list(pj.items).map(it => psCard(it, '', C.labels || {})).join('')}</div>
  </div>`).join('')}
</section>`;
}

function tools() {
  const T = D.tools || {}, r = T.route || {};
  return `<section class="nx-section nx-reveal" id="nx-tools" data-nx>
  ${head(T)}
  <div class="nx-route" aria-label="수정 요청 분기">
    <div class="nx-node">${ico('alert')}${e(r.start)}</div><span class="nx-line"></span>
    <div class="nx-node q">${ico('scale')}${e(r.question)}</div>
    <div class="nx-fork"><div class="nx-branch"><span>Y</span><div class="nx-node ai">${ico('code')}${e(r.yes)}<small>${e(r.yesNote)}</small></div></div><div class="nx-branch"><span>N</span><div class="nx-node me">${ico('sliders')}${e(r.no)}<small>${e(r.noNote)}</small></div></div></div>
    <span class="nx-line"></span><div class="nx-node end">${ico('gamepad')}${e(r.end)}</div>
  </div>
  <div class="nx-tool-grid">${list(T.items).map(t => `<article class="nx-tool${t.image ? ' has-shot' : ''}">${t.image ? `<button type="button" class="nx-zoom nx-tool-shot" data-full="${e(t.image)}" data-cap="${e(t.title)}" aria-label="${e(t.title)} 화면 크게 보기"><img src="${e(t.image)}" alt="${e(t.title)} Unity 화면" loading="lazy"><span class="nx-zoom-ico" aria-hidden="true">⤢</span></button>` : ''}${ico(t.icon, 'tool')}<span class="nx-tool-proj">${e(t.project)}</span><h3>${e(t.title)}</h3><p>${e(t.text)}</p></article>`).join('')}</div>
</section>`;
}

/* earlier projects: a row of cards after the AI games; details open in a dialog */
const ytId = u => (String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
function archive() {
  const A = D.archive || {}; if (!list(A.items).length) return '';
  return `<section class="nx-section nx-reveal" id="nx-archive" data-nx>
  ${head(A)}
  <div class="nx-arc-grid">${list(A.items).map((it, i) => `<button type="button" class="nx-arc" data-arc="${i}">
    <span class="nx-arc-img"><img src="${e(it.cover)}" alt="" loading="lazy">${list(it.videos).length ? `<span class="nx-arc-play" aria-hidden="true">▶</span>` : ''}</span>
    <span class="nx-arc-body"><small>${e(it.period)}</small><b>${e(it.title)}</b><em>${e(it.genre)}</em><em>${e(it.team)}</em><span>${e(it.summary)}</span><i>${e(A.more || '자세히 보기')} →</i></span>
  </button>`).join('')}</div>
</section>`;
}
function openArchive(i) {
  const it = list(D.archive?.items)[i]; if (!it) return;
  const vids = list(it.videos).map(v => ({ ...v, id: ytId(v.url) })).filter(v => v.id);
  const dlg = document.createElement('dialog'); dlg.className = 'nx-arc-dialog';
  dlg.innerHTML = `<header><div><small>${e(it.period)}, ${e(it.platform)}</small><h2>${e(it.title)}</h2><p>${e(it.genre)}<br>${e(it.team)}</p></div><button type="button" class="nx-arc-close" aria-label="닫기">✕</button></header>
    <p class="nx-arc-sum">${e(it.summary)}</p>
    ${vids.length ? `<div class="nx-arc-video"><iframe src="https://www.youtube-nocookie.com/embed/${vids[0].id}" title="${e(vids[0].label || it.title)}" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div>${vids.length > 1 ? `<div class="nx-arc-vtabs">${vids.map((v, k) => `<button type="button" data-vid="${v.id}" aria-pressed="${k === 0}">▶ ${e(v.label || '영상 ' + (k + 1))}</button>`).join('')}</div>` : ''}` : ''}
    <ul class="nx-arc-points">${list(it.points).map(p => `<li><b>${e(p.title)}</b><span>${e(p.text)}</span></li>`).join('')}</ul>
    ${list(it.images).length ? `<div class="nx-ps-shots" style="--n:${Math.min(list(it.images).length, 3)}">${list(it.images).map(im => `<figure><button type="button" class="nx-zoom" data-full="${e(im.src)}" data-cap="${e(im.caption)}" aria-label="${e(im.caption)} 크게 보기"><img src="${e(im.src)}" alt="${e(im.caption)}" loading="lazy"><span class="nx-zoom-ico" aria-hidden="true">⤢</span></button><figcaption>${e(im.caption)}</figcaption></figure>`).join('')}</div>` : ''}`;
  document.body.append(dlg);
  dlg.addEventListener('close', () => dlg.remove());
  dlg.addEventListener('click', ev => {
    if (ev.target === dlg || ev.target.closest('.nx-arc-close')) dlg.close();
    const t = ev.target.closest('[data-vid]'); if (t) { $('iframe', dlg).src = 'https://www.youtube-nocookie.com/embed/' + t.dataset.vid; $$('[data-vid]', dlg).forEach(b => b.setAttribute('aria-pressed', b === t)); }
  });
  dlg.showModal();
}

/* ---------- behaviour ---------- */
function countUp(root = document) {
  $$('[data-count]:not([data-done])', root).forEach(el => {
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return; io.disconnect(); el.dataset.done = '1';
      const to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 0 : 1100;
      const tick = t => { const k = dur ? Math.min(1, (t - t0) / dur) : 1; el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('ko-KR'); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: .4 });
    io.observe(el);
  });
}
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('nx-in'); io.unobserve(en.target); } }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  $$('.nx-reveal:not(.nx-in)').forEach(el => reduce ? el.classList.add('nx-in') : io.observe(el));
}


/* side rail: shows how far down the page you are, so it's clear there is more below */
let railEl = null;
function rail() {
  if (!railEl) {
    railEl = document.createElement('div'); railEl.className = 'nx-rail'; railEl.setAttribute('aria-hidden', 'true');
    railEl.innerHTML = '<i><b></b></i>'; document.body.append(railEl);
    const upd = () => { const max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? Math.min(1, scrollY / max) : 1; railEl.style.setProperty('--k', k.toFixed(3)); railEl.classList.toggle('done', k > .98); };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); railEl._upd = upd;
  }
  railEl._upd();
}

let cleanups = [];
function mount(force) {
  const main = $('#main'); const page = (location.hash.slice(1) || 'overview').split(/[/?]/)[0];
  document.body.classList.toggle('nx-overview', page === 'overview');
  if (page !== 'overview') { cleanups.forEach(f => f()); cleanups = []; rail(); return; }
  if ($('#nx-play', main) && !force) return;
  cleanups.forEach(f => f()); cleanups = [];
  const g0 = $('.project-grid', main), h0 = $('.collection-heading', main);
  if (g0 && h0 && g0.closest('[data-nx]')) h0.after(g0); // put the cards back before the intro is rebuilt
  $$('[data-nx]', main).forEach(n => n.remove());
  const heading = $('.collection-heading', main), grid = $('.project-grid', main); if (!heading || !grid) return;
  heading.id = 'nx-projects';
  heading.insertAdjacentHTML('beforebegin', intro());
  // the two main projects sit in the hero, so the page goes straight on to the summary below
  const slot = $('#nx-intro .nx-intro-copy', main); if (slot) { slot.append(grid); heading.classList.add('nx-moved'); }
  heading.insertAdjacentHTML('afterend', play() + split() + aiIssues() + verify() + archive());
  if (window.NXAnim) cleanups.push(NXAnim.mount($('#nx-anim-wop'), NXAnim.wopScene()), NXAnim.mount($('#nx-anim-ww'), NXAnim.wmScene()));
  if (window.NXAnim && NXAnim.mini) $$('[data-mini]', main).forEach(el => { const make = NXAnim.mini[el.dataset.mini]; if (make) cleanups.push(NXAnim.mount(el, make())); });
  countUp(); reveal(); rail();
  if (force) $$('.nx-reveal', main).forEach(n => n.classList.add('nx-in'));
}

/* live preview for showcase-editor.html: ?showcase-preview=1 reads the draft and listens for edits */
if (PREVIEW) {
  window.addEventListener('message', ev => {
    if (ev.origin !== location.origin || ev.data?.type !== 'showcase-data' || !ev.data.data) return;
    D = ev.data.data; const y = scrollY; mount(true); scrollTo(0, y);
    if (ev.data.focus) document.getElementById(ev.data.focus)?.scrollIntoView({ block: 'start' });
  });
  window.parent?.postMessage({ type: 'showcase-preview-ready' }, location.origin);
}

document.addEventListener('click', ev => {
  const top = ev.target.closest('.nx-case-top');
  if (top) { const open = top.getAttribute('aria-expanded') !== 'true'; top.setAttribute('aria-expanded', open); $('#' + top.getAttribute('aria-controls')).hidden = !open; top.closest('.nx-case').classList.toggle('open', open); return; }
  const f = ev.target.closest('[data-nx-case]');
  if (f) { $$('[data-nx-case]').forEach(b => b.setAttribute('aria-pressed', b === f)); $$('.nx-case').forEach(c => c.hidden = !(f.dataset.nxCase === 'all' || c.dataset.tag === f.dataset.nxCase)); return; }
  const cue = ev.target.closest('[data-scroll-to]'); if (cue) { document.getElementById(cue.dataset.scrollTo)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); return; }
  const arc = ev.target.closest('[data-arc]'); if (arc) { openArchive(+arc.dataset.arc); return; }
  const z = ev.target.closest('.nx-zoom');
  if (z) {
    const ov = document.createElement('div'); ov.className = 'nx-lightbox'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', z.dataset.cap || '이미지');
    ov.innerHTML = `<figure><img src="${e(z.dataset.full)}" alt="${e(z.dataset.cap)}"><figcaption>${e(z.dataset.cap)}</figcaption></figure><button type="button" aria-label="닫기">✕</button>`;
    const close = () => { ov.remove(); document.removeEventListener('keydown', esc); z.focus(); }, esc = k => { if (k.key === 'Escape') close(); };
    ov.addEventListener('click', close); document.addEventListener('keydown', esc); document.body.append(ov); ov.querySelector('button').focus(); return;
  }
});

new MutationObserver(() => mount()).observe($('#main'), { childList: true });
mount();
})();
