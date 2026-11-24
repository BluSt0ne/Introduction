/* Editor for data/showcase-data.js with a live preview (index.html?showcase-preview=1). No build step, no backend. */
'use strict';
const DRAFT_KEY = 'showcase-draft-v1';
const PUBLISHED = JSON.parse(JSON.stringify(window.SHOWCASE_DATA || {}));
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = v => JSON.parse(JSON.stringify(v));

let data = (() => { try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY)); if (d && typeof d === 'object') return d; } catch {} return clone(PUBLISHED); })();
let history = [], saved = JSON.stringify(data) === JSON.stringify(PUBLISHED), fileHandle = null, icons = {};

const SECTIONS = [
  ['intro', '소개', 'nx-intro'],
  ['play', '게임 흐름', 'nx-play'], ['role', '역할 분담', 'nx-split'], ['ai', 'AI와 일하는 방식', 'nx-ai'],
  ['cases', '설계 의도', 'nx-verify'], ['tools', '제작 도구', 'nx-tools'], ['archive', '이전 프로젝트', 'nx-archive']
];
const LABEL = {
  eyebrow: '작은 제목(영문)', title: '제목', lines: '제목 줄', highlight: '강조 문구', lead: '한 줄 소개(비우면 숨김)', tags: '태그',
  icon: '아이콘', text: '문구', value: '숫자', unit: '단위', label: '이름', note: '보조 설명', id: '연결 섹션 ID',
  wop: 'World of Plant 카드', ww: 'Wordless Mage 카드', me: '직접 담당', ai: 'AI 담당', sub: '부제', items: '항목', loop: '작업 순환', who: '담당',
  issues: '사례', tag: '분류', what: '발생', fix: '대응', rule: '반영 원칙', rulesTitle: '원칙 제목', rules: '협업 원칙',
  filters: '필터 버튼', metric: '큰 숫자', metricLabel: '숫자 설명', steps: '단계', k: '단계 이름', v: '내용',
  route: '수정 분기도', start: '시작', question: '질문', yes: '예 →', yesNote: '예 설명', no: '아니오 →', noNote: '아니오 설명', end: '끝',
  problem: '문제', solution: '해결 (**굵게** 표시 가능)', images: '스크린샷', src: '이미지 경로(썸네일)', full: '클릭 시 열 원본', caption: '캡션', name: '프로젝트 이름', projects: '프로젝트', 
  more: '카드 버튼 문구', period: '기간', genre: '장르', team: '인원·역할', platform: '플랫폼', summary: '한 줄 소개', cover: '대표 이미지', videos: '유튜브 영상', url: '유튜브 링크', points: '핵심 설계',
  project: '프로젝트', image: 'Unity 스크린샷 경로(비우면 숨김)', scroll: '스크롤 안내 문구', labels: '카드 머리말', profile: '오른쪽 프로필', photo: '사진 경로', toolsTitle: '툴 제목', group: '분류', historyTitle: '연혁 제목', history: '연혁', year: '연도', logo: '대표 로고 이미지 경로', marks: '연혁 아이콘'
};
const CHOICES = { tag: [['wop', 'World of Plant'], ['ww', 'Wordless Mage'], ['build', '빌드']], who: [['me', '직접'], ['ai', 'AI']] };

/* ---------- path helpers ---------- */
const getAt = (obj, path) => path.reduce((o, k) => o?.[k], obj);
function setAt(path, value) { const last = path[path.length - 1]; getAt(data, path.slice(0, -1))[last] = value; }

/* ---------- form ---------- */
function iconOptions(current) {
  const names = Object.keys(icons).length ? Object.keys(icons) : [current];
  return names.map(n => `<option value="${esc(n)}" ${n === current ? 'selected' : ''}>${esc(n)}</option>`).join('');
}
function iconSvg(name) { return `<svg viewBox="0 0 24 24">${icons[name] || ''}</svg>`; }
function field(key, value, path) {
  const p = esc(JSON.stringify(path)), label = esc(LABEL[key] ?? key);
  if (key === 'icon') return `<div class="field"><label>${label}</label><div class="iconpick">${iconSvg(value)}<select data-path="${p}">${iconOptions(value)}</select></div></div>`;
  if (CHOICES[key] && typeof value === 'string' && ((key === 'tag' && path[0] === 'cases') || key === 'who')) return `<div class="field"><label>${label}</label><select data-path="${p}">${CHOICES[key].map(([v, t]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`;
  if (typeof value === 'number') return `<div class="field"><label>${label}</label><input type="number" data-num data-path="${p}" value="${esc(value)}"></div>`;
  const long = String(value).length > 34;
  return `<div class="field"><label>${label}</label>${long ? `<textarea rows="2" data-path="${p}">${esc(value)}</textarea>` : `<input type="text" data-path="${p}" value="${esc(value)}">`}</div>`;
}
function summaryOf(v) { if (typeof v !== 'object' || !v) return String(v); return v.title || v.text || v.label || v.k || v.id || ''; }
function node(key, value, path) {
  if (Array.isArray(value)) {
    const p = esc(JSON.stringify(path));
    const items = value.map((v, i) => {
      const ip = [...path, i], ips = esc(JSON.stringify(ip));
      const ctrl = `<button class="mini" data-move="${ips}" data-dir="-1" title="위로">↑</button><button class="mini" data-move="${ips}" data-dir="1" title="아래로">↓</button><button class="mini del" data-del="${ips}" title="삭제">✕</button>`;
      if (typeof v !== 'object' || v === null) return `<div class="item"><div class="item-head"><b>${i + 1}</b>${ctrl}</div>${field(key === 'lines' ? 'text' : key, v, ip)}</div>`;
      return `<div class="item"><div class="item-head"><b>${String(i + 1).padStart(2, '0')} · ${esc(summaryOf(v))}</b>${ctrl}</div>${Object.entries(v).map(([k, vv]) => node(k, vv, [...ip, k])).join('')}</div>`;
    }).join('');
    return `<div class="group"><div class="gtitle">${esc(LABEL[key] ?? key)}</div>${items}<button class="add" data-add="${p}">+ 추가</button></div>`;
  }
  if (value && typeof value === 'object') return `<div class="group"><div class="gtitle">${esc(LABEL[key] ?? key)}</div>${Object.entries(value).map(([k, v]) => node(k, v, [...path, k])).join('')}</div>`;
  return field(key, value, path);
}
function renderForm() {
  const open = new Set([...document.querySelectorAll('details.sec[open]')].map(d => d.dataset.key));
  const scroll = $('#panel').scrollTop;
  $('#form').innerHTML = SECTIONS.filter(([k]) => k in data).map(([k, title, target]) => {
    const v = data[k], inner = Array.isArray(v) ? node(k, v, [k]) : Object.entries(v).map(([kk, vv]) => node(kk, vv, [k, kk])).join('');
    return `<details class="sec" data-key="${k}" data-target="${target}" ${open.has(k) ? 'open' : ''}><summary>${title}</summary><div class="body">${inner}</div></details>`;
  }).join('');
  $('#panel').scrollTop = scroll;
}

/* ---------- state ---------- */
let pushTimer = 0, sendTimer = 0;
function snapshot() { history.push(JSON.stringify(data)); if (history.length > 80) history.shift(); }
function changed(structural) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch {}
  saved = false; status();
  if (structural) renderForm();
  clearTimeout(sendTimer); sendTimer = setTimeout(send, 60);
}
function status(msg, ok) {
  const el = $('#status');
  el.textContent = msg || (saved ? '저장된 내용과 같음' : '저장 안 된 변경 있음 · 브라우저에 자동 보관 중');
  el.className = 'status' + (ok || (saved && !msg) ? ' ok' : '');
}
function send(focus) { $('#frame').contentWindow?.postMessage({ type: 'showcase-data', data, focus }, location.origin); }
function serialise() { return 'window.SHOWCASE_DATA = ' + JSON.stringify(data, null, 2) + ';\n'; }

/* ---------- events ---------- */
document.addEventListener('input', ev => {
  const el = ev.target.closest('[data-path]'); if (!el) return;
  clearTimeout(pushTimer); if (!pushTimer) snapshot(); pushTimer = setTimeout(() => { pushTimer = 0; }, 800);
  const path = JSON.parse(el.dataset.path);
  setAt(path, el.hasAttribute('data-num') ? Number(el.value) || 0 : el.value);
  if (el.tagName === 'SELECT' && path[path.length - 1] === 'icon') el.previousElementSibling.innerHTML = icons[el.value] || '';
  changed(false);
});
document.addEventListener('click', ev => {
  const add = ev.target.closest('[data-add]'), del = ev.target.closest('[data-del]'), mv = ev.target.closest('[data-move]');
  if (add) {
    snapshot(); const arr = getAt(data, JSON.parse(add.dataset.add)), tpl = arr[arr.length - 1];
    const blank = v => typeof v === 'string' ? '' : typeof v === 'number' ? 0 : Array.isArray(v) ? v.slice(0, 1).map(blank) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'icon' || k === 'tag' || k === 'who' ? x : blank(x)])) : v;
    arr.push(tpl === undefined ? '' : blank(clone(tpl))); changed(true); return;
  }
  if (del) { const path = JSON.parse(del.dataset.del), arr = getAt(data, path.slice(0, -1)); if (!confirm('이 항목을 삭제할까요?')) return; snapshot(); arr.splice(path[path.length - 1], 1); changed(true); return; }
  if (mv) { const path = JSON.parse(mv.dataset.move), arr = getAt(data, path.slice(0, -1)), i = path[path.length - 1], j = i + Number(mv.dataset.dir); if (j < 0 || j >= arr.length) return; snapshot(); [arr[i], arr[j]] = [arr[j], arr[i]]; changed(true); return; }
  const sum = ev.target.closest('details.sec>summary'); if (sum) setTimeout(() => send(sum.parentElement.dataset.target), 0);
  const jump = ev.target.closest('[data-jump]'); if (jump) send(jump.dataset.jump);
  const size = ev.target.closest('[data-size]');
  if (size) { document.querySelectorAll('[data-size]').forEach(b => b.classList.toggle('on', b === size)); $('#frame').classList.toggle('mobile', size.dataset.size === 'mobile'); }
});
document.addEventListener('keydown', ev => { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'z' && !ev.target.closest('input,textarea')) { ev.preventDefault(); undo(); } });
function undo() { const prev = history.pop(); if (!prev) return status('되돌릴 내용이 없습니다.'); data = JSON.parse(prev); changed(true); }
$('#undo').onclick = undo;
$('#reset').onclick = () => { if (!confirm('편집 내용을 지우고 현재 공개된 내용으로 되돌릴까요?')) return; snapshot(); data = clone(PUBLISHED); changed(true); saved = true; status(); };
$('#download').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([serialise()], { type: 'text/javascript' })); a.download = 'showcase-data.js'; a.click(); URL.revokeObjectURL(a.href); status('다운로드한 파일을 public/data/showcase-data.js에 덮어쓰세요.', true); };
$('#save').onclick = async () => {
  if (!window.showSaveFilePicker) return $('#download').onclick();
  try {
    if (!fileHandle) fileHandle = await showSaveFilePicker({ suggestedName: 'showcase-data.js', types: [{ description: 'JavaScript', accept: { 'text/javascript': ['.js'] } }] });
    const w = await fileHandle.createWritable(); await w.write(serialise()); await w.close();
    saved = true; status('저장했습니다. GitHub Desktop에서 커밋·푸시하면 사이트에 반영됩니다.', true);
  } catch (err) { if (err?.name !== 'AbortError') status('저장하지 못했습니다: ' + err.message); }
};
$('#import').onclick = () => $('#file').click();
$('#file').onchange = async ev => {
  const f = ev.target.files[0]; if (!f) return;
  try { const txt = await f.text(), json = txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1); snapshot(); data = JSON.parse(json); changed(true); status('불러왔습니다.', true); }
  catch { status('파일 형식을 읽지 못했습니다.'); }
  ev.target.value = '';
};
window.addEventListener('message', ev => {
  if (ev.origin !== location.origin || ev.data?.type !== 'showcase-preview-ready') return;
  icons = $('#frame').contentWindow?.NXIcons || icons; renderForm(); send();
});
window.addEventListener('beforeunload', ev => { if (!saved) { ev.preventDefault(); ev.returnValue = ''; } });

/* preview jump bar */
$('#jump').insertAdjacentHTML('afterbegin', (data.nav || []).map(n => `<button data-jump="${esc(n.id)}">${esc(n.label)}</button>`).join(''));
renderForm(); status();
