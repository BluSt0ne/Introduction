/* Showcase layer: interactive intro sections added on top of the archive overview.
   Runs after app.js; re-inserts itself whenever app.js re-renders #main. */
'use strict';
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


/* ---------- content ---------- */
const STATS = [
  [2, '', '혼자 만든 게임', 'World of Plant · Wordless Mage'],
  [3800, '', '은하의 행성 수', '유형 5개, 희귀 변형 5%'],
  [5, '종', '마법', '슬롯 3칸에 넣어서 씀'],
  [4, '개', '직접 만든 툴', '밸런스·레벨·프로파일러·검수']
];

const STAGES = ['기획', '요청', '구현', '플레이', '조정', '정리'];
const SPLIT = {
  wop: {
    name: 'World of Plant',
    rows: [
      { me: ['커서 → 꽃 → 장치 → 로봇 → 로켓 순서로 손이 덜 가게 되는 흐름을 잡음', '자원은 에너지·원석·제련 세 단계, 업그레이드 트리 연결'],
        ai: ['규칙 문서 보고 구조랑 데이터 표 초안'], out: '핵심 규칙, 업그레이드 노드 표' },
      { me: ['바꿀 것과 건드리면 안 되는 것을 나눠서 적음', '에너지 부족·설치 대기·비용 두 번 빠짐 같은 예외도 같이 적음'],
        ai: ['작업 단위로 쪼개서 어디를 고칠지 먼저 알려 줌'], out: '요청서 (목적 / 조건 / 예외 / 확인)' },
      { me: ['큰 구조 바꿀 때만 맡기고, 나온 코드는 읽어 보고 받음'],
        ai: ['GPU 인스턴싱 렌더링, 행성 3,800개 은하, 로봇 작업 배정', '행성 외형 규칙을 C#이랑 셰이더 양쪽에 똑같이'], out: 'Unity 6 URP 빌드' },
      { me: ['빌드 돌려 보면서 끊김, 로봇 동선, 화면 읽히는지 확인', '느낌으로 끊기는 건 프로파일러 붙여서 숫자로 봄'],
        ai: ['로그에서 튀는 구간 분류'], out: '0.1초 넘은 프레임 기록' },
      { me: ['비용·배수·주기는 밸런스 툴에서 직접 만짐', '플레이해 보고 규칙 변경: 업그레이드는 원석으로, 로봇 속도 업그레이드 추가'],
        ai: ['바뀐 규칙을 코드랑 UI 문구에 반영'], out: '로봇 속도 레벨당 +25%, 최대 8' },
      { me: ['문서랑 실제 빌드 비교해서 접은 기획(생태 시뮬레이션) 따로 뺌'],
        ai: ['기획서, 이 페이지 정리'], out: '게임 기획서' }
    ]
  },
  ww: {
    name: 'Wordless Mage',
    rows: [
      { me: ['로봇이 한 말을 뺏어서 마법으로 쓴다는 규칙', '자모 조합은 접고 마법 5종 + 슬롯 3칸으로 줄임'],
        ai: ['마법이랑 대상 반응을 표로 정리'], out: '마법 × 대상 반응표' },
      { me: ['조준선에 보이는 대로 맞아야 한다는 기준을 요청에 박아 둠'],
        ai: ['조준·충돌을 한 판정으로 묶는 구조 제안'], out: '조준·충돌 기준' },
      { me: ['레벨 순서랑 배울 순서 정하고 결과 확인'],
        ai: ['로봇 AI, 마법 효과, 레벨 에디터'], out: '레벨, 지도, 결과 화면' },
      { me: ['직접 깨 보면서 퍼즐이 읽히는지, 조작이 답답한지 봄', '자동 검사 결과랑 직접 플레이한 결과는 따로 적음'],
        ai: ['level-review로 해금·재도전·별 조건 자동 점검'], out: '검수 기록 + 캡처' },
      { me: ['장치·지형 배치는 레벨 에디터에서 직접', '체력, 효과 시간, 도전 조건 숫자 조정'],
        ai: ['구조를 바꿔야 할 때만 코드 수정'], out: '레벨 데이터' },
      { me: ['화면이랑 설명이 맞는지 다시 확인'],
        ai: ['기획서 형식 정리'], out: '게임 기획서' }
    ]
  }
};

const CASES = [
  { tag: 'wop', label: 'WoP · 최적화', title: '행성이 많아지면 끊김', metric: '360', unit: 'ms', mlabel: '고치기 전 제일 길게 멈춘 프레임',
    steps: [
      ['증상', '행성이 늘어나니까 몇 초마다 화면이 툭툭 멈췄습니다. 어디서 멈추는지는 눈으로는 알 수가 없었습니다.'],
      ['확인', '게임 안에 프로파일러를 직접 붙여서 0.1초 넘는 프레임만 남겼습니다. 로봇 작업 배정이 100~360ms, 53MB짜리 저장이 280ms 정도 걸리고 있었습니다.'],
      ['수정', '작업 배정은 한 프레임에 검사할 양을 정해 두고, 자주 세는 값은 2초에 한 번만 다시 세고, 매 프레임 새로 만들던 메모리를 없앴습니다.'],
      ['남은 것', '배정 때문에 멈추는 건 없어졌습니다. 30초마다 저장할 때 끊기는 건 아직 남아 있어서, 행성별로 나눠 저장하는 쪽으로 고칠 예정입니다.']
    ] },
  { tag: 'wop', label: 'WoP · 수정 후 버그', title: '최적화하고 나니 로봇이 안 움직임', metric: '705', unit: '건', mlabel: '쌓인 작업 / 나간 로봇 0대',
    steps: [
      ['증상', '어느 순간부터 로봇이 땅을 안 열고 설치도 안 했습니다.'],
      ['원인', '위에서 끊김 잡으려고 넣은 검사 제한(16번)이랑 재시도 대기가 겹쳐서, 작업이 705건 쌓이는 동안 하나도 배정이 안 되고 있었습니다.'],
      ['수정', '행성마다 하나씩 돌아가며 배정하고 검사 한도를 32로 올렸습니다. 자리 못 찾은 작업만 3초 뒤 다시 보고, 가까운 칸부터 짓게 바꿨습니다.'],
      ['이후', '성능 손본 다음에는 꼭 다시 플레이해서 게임 규칙이 안 깨졌는지 보는 걸 순서에 넣었습니다.']
    ] },
  { tag: 'build', label: 'WoP · 빌드', title: '빌드하면 꽃이랑 장치가 안 보임', metric: '0', unit: '개', mlabel: '빌드에서 보인 설치물',
    steps: [
      ['증상', '에디터에선 멀쩡한데 빌드하면 설치한 게 전부 안 보였습니다. 그런데 에너지는 계속 들어왔습니다.'],
      ['좁히기', '로직은 돌고 있으니 그리는 쪽 문제라고 보고 렌더링만 봤습니다.'],
      ['원인', '빌드할 때 GPU 인스턴싱용 셰이더가 빠지고 있었습니다. 첫 씬도 예전 기획 씬으로 잡혀 있었습니다.'],
      ['수정', '인스턴싱 셰이더가 빠지지 않게 설정하고, 에디터 스크립트가 씬 순서랑 설정을 알아서 되돌리게 했습니다.']
    ] },
  { tag: 'ww', label: 'WM · 범위', title: '자모 조합 마법을 5종으로 줄임', metric: '5', unit: '종', mlabel: '최종 마법 수, 슬롯 3칸',
    steps: [
      ['처음', '로봇 대사에서 자모를 모아서 마법을 조합하는 구조였습니다.'],
      ['문제', '조합 수가 늘수록 퍼즐마다 확인할 예외가 늘어서, 혼자서 정해진 기간 안에 레벨을 만들고 검수하기 어려웠습니다.'],
      ['결정', '효과가 확실한 마법 5종으로 줄이고, 슬롯 3칸 안에서 고르게 했습니다.'],
      ['결과', '시간·무게·위치·제거로 역할이 나뉘니까 레벨 안에서 뭘 써야 할지가 보이게 됐습니다.']
    ] },
  { tag: 'ww', label: 'WM · 판정', title: '조준선이랑 실제로 맞는 곳이 다름', metric: '3', unit: '곳', mlabel: '판정을 하나로 묶은 곳 (대상·조준선·투사체)',
    steps: [
      ['기준', '조준선에 보인 대로 맞아야 퍼즐을 믿고 풀 수 있습니다.'],
      ['수정', '대상 판정, 조준선, 투사체가 같은 장애물 판정을 쓰게 했습니다. 벽에 막히면 조준선도 투사체도 벽에서 멈춥니다.'],
      ['예외', '트리거나 대상 자기 콜라이더는 벽으로 안 치고, 컨베이어는 조준점을 따로 뒀습니다.']
    ] },
  { tag: 'wop', label: 'WoP · 플레이 피드백', title: '로봇이 멀리 왔다 갔다 함', metric: '25', unit: '%', mlabel: '로봇 속도 업그레이드 1레벨당',
    steps: [
      ['본 것', '로봇이 멀리 떨어진 칸을 오가면서 지어서 건설이 느리게 느껴졌습니다.'],
      ['수정', '지금 있는 곳에서 가까운 칸부터 짓게 하고, 로봇 속도 업그레이드(레벨당 +25%, 최대 8)를 넣었습니다.'],
      ['같이 바꾼 것', '업그레이드 비용을 제련 자원 말고 기본 원석으로 받게 해서 초반에 막히지 않게 했습니다.']
    ] }
];

const TOOLS = [
  ['balance', '밸런스 툴', 'World of Plant', '비용, 배수, 주기, 사거리를 켜 둔 채로 바꾸고 바로 플레이해 봅니다. 숫자 하나 바꾸는 데 AI는 안 씁니다.'],
  ['editor', '레벨 에디터', 'Wordless Mage', '장치, 지형, 로봇 위치는 여기서 직접 옮깁니다. 레벨 구조 자체를 바꿀 때만 AI에 요청합니다.'],
  ['profiler', '프레임 프로파일러', 'World of Plant', '0.1초 넘게 걸린 프레임을 구간별로 남깁니다. 끊김 잡을 때 이 로그부터 봤습니다.'],
  ['review', 'level-review', 'Wordless Mage', '해금, 재도전 초기화, 별 조건을 자동으로 돌려 봅니다. 직접 해 본 결과랑은 따로 적어 둡니다.']
];

const PLANETS = [
  { name: 'Sprout Cradle', kind: '초원', a: '#3f7d4a', b: '#8fc46b', c: '#d8e8a6', sea: '#2c5d78', clouds: .5 },
  { name: 'White Night Ice', kind: '빙원', a: '#9fb9c9', b: '#dfeef3', c: '#ffffff', sea: '#3d6f8f', clouds: .35 },
  { name: 'Red Sands', kind: '사막', a: '#8d3f2a', b: '#c86d3f', c: '#e6b07a', sea: null, clouds: .12 },
  { name: 'Sleeping Night', kind: '가스', a: '#2a2c55', b: '#5a4f8e', c: '#b3a6d9', sea: null, clouds: 0, bands: true },
  { name: 'Ember Garden', kind: '용암', a: '#231512', b: '#4a2318', c: '#ff8a3c', sea: null, clouds: 0, lava: true }
];


/* ---------- markup ---------- */
function hero() {
  return `<section class="nx-hero" id="nx-hero">
  <div class="nx-hero-copy">
    <span class="eyebrow">GAME DESIGN · AI</span>
    <h1>기획한 게임을<br>AI랑 끝까지<br><em>만들어 봤습니다.</em></h1>
    <p class="nx-lead">World of Plant와 Wordless Mage 둘 다 혼자 기획하고 AI랑 같이 구현했습니다. 구조를 크게 바꿀 때만 AI한테 맡기고, 숫자나 레벨 배치는 직접 만든 툴로 맞췄습니다. 끊기거나 이상하면 로그부터 찍어 봤습니다.</p>
    <div class="nx-actions">
      <a class="button primary" href="#" data-scroll="nx-play">게임 흐름 보기</a>
      <a class="button quiet" href="#" data-scroll="nx-verify">고친 문제들</a>
      <a class="button quiet" href="#ai-development">AI 활용 →</a>
    </div>
  </div>
  <figure class="nx-toy" aria-label="World of Plant 파동 체험">
    <canvas id="nx-toy-canvas"></canvas>
    <figcaption><span class="nx-dot"></span><span id="nx-toy-hint">마우스를 움직이면 꽃이 핍니다</span><b><span id="nx-bloom">0</span> 송이</b></figcaption>
  </figure>
</section>
<section class="nx-stats" aria-label="숫자로 보기">${STATS.map(([n, u, l, s]) => `<div class="nx-stat nx-reveal"><strong><span data-count="${n}">0</span>${u ? `<small>${u}</small>` : ''}</strong><span>${l}</span><em>${s}</em></div>`).join('')}</section>
<nav class="nx-jump" aria-label="페이지 안 이동">${[['nx-play','게임 흐름'],['nx-projects','프로젝트'],['nx-split','나 / AI'],['nx-verify','고친 문제들'],['nx-tools','툴']].map(([id, t], i) => `<a href="#" data-scroll="${id}"><span>${String(i + 1).padStart(2, '0')}</span>${t}</a>`).join('')}</nav>`;
}

function animCard(id, cls, label, title, desc, steps) {
  return `<article class="nx-anim ${cls}" id="${id}">
    <header><div><span class="nx-anim-label">${label}</span><h3>${title}</h3></div><button type="button" class="nx-anim-play" data-anim-play aria-pressed="false">일시정지</button></header>
    <div class="nx-anim-stage"><canvas aria-label="${e(title)} 진행 애니메이션"></canvas></div>
    <div class="nx-anim-bar" aria-hidden="true"><i></i></div>
    <ol class="nx-anim-steps">${steps.map(([, s], i) => `<li><button type="button" data-step="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s}</button></li>`).join('')}</ol>
    <p>${desc}</p>
  </article>`;
}
function play() {
  const W = window.NXAnim;
  return `<section class="nx-section nx-play nx-reveal" id="nx-play">
  <header class="nx-head"><span class="eyebrow">HOW IT PLAYS</span><h2>두 게임, 한 판 흐름</h2><p>단계 이름을 누르면 그 장면으로 넘어갑니다.</p></header>
  <div class="nx-anim-grid">
    ${animCard('nx-anim-wop', 'wop', 'World of Plant', '꽃밭이 다른 행성으로 퍼질 때까지', '꽃을 키워 모은 자원으로 배치를 블루프린트로 저장하고, 로켓에 실어 다른 행성에 그대로 깔아요. 행성이 늘수록 손은 덜 갑니다.', W ? W.wopScene().steps : [])}
    ${animCard('nx-anim-ww', 'ww', 'Wordless Mage', '로봇의 말로 거대 팬 멈추기', '로봇을 쓰러뜨리면 걔가 하던 말("멈춰!")이 마법이 됩니다. 그걸로 길을 막던 회전 팬을 세우고 날개 사이로 지나갑니다.', W ? W.wmScene().steps : [])}
  </div>
</section>`;
}

function split() {
  return `<section class="nx-section nx-reveal" id="nx-split">
  <header class="nx-head"><span class="eyebrow">ROLE SPLIT</span><h2>제가 한 것, AI가 한 것</h2><p>프로젝트랑 단계를 바꿔 가며 보세요.</p></header>
  <div class="nx-split-controls">
    <div class="nx-seg" role="group" aria-label="프로젝트 선택">${Object.entries(SPLIT).map(([id, p], i) => `<button type="button" data-nx-proj="${id}" aria-pressed="${i === 0}" class="${id}">${p.name}</button>`).join('')}</div>
    <ol class="nx-stages" role="group" aria-label="작업 단계">${STAGES.map((s, i) => `<li><button type="button" data-nx-stage="${i}" aria-pressed="${i === 0}"><span>${String(i + 1).padStart(2, '0')}</span>${s}</button></li>`).join('')}</ol>
  </div>
  <div class="nx-split-panel" id="nx-split-panel" aria-live="polite"></div>
</section>`;
}
function splitPanel(proj, stage) {
  const r = SPLIT[proj].rows[stage];
  return `<article class="nx-col me"><header><span class="nx-who">ME</span><h3>제가 한 것</h3></header><ul>${r.me.map(t => `<li>${e(t)}</li>`).join('')}</ul></article>
  <div class="nx-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></div>
  <article class="nx-col ai"><header><span class="nx-who">AI</span><h3>AI가 한 것</h3></header><ul>${r.ai.map(t => `<li>${e(t)}</li>`).join('')}</ul></article>
  <p class="nx-out"><span>남은 것</span>${e(r.out)}</p>`;
}

function verify() {
  return `<section class="nx-section nx-reveal" id="nx-verify">
  <header class="nx-head"><span class="eyebrow">PROBLEMS</span><h2>만들다가 막혔던 것들</h2><p>카드를 누르면 어떻게 찾고 고쳤는지 나옵니다.</p></header>
  <div class="nx-filter" role="group" aria-label="분류">${[['all','전체'],['wop','World of Plant'],['ww','Wordless Mage'],['build','빌드']].map(([id, t], i) => `<button type="button" data-nx-case="${id}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>
  <div class="nx-cases">${CASES.map((c, i) => `<article class="nx-case ${c.tag}" data-tag="${c.tag}">
    <button type="button" class="nx-case-top" aria-expanded="false" aria-controls="nx-case-${i}">
      <span class="nx-case-label">${e(c.label)}</span>
      <h3>${e(c.title)}</h3>
      <span class="nx-metric"><b data-count="${c.metric}">0</b><small>${e(c.unit)}</small></span>
      <span class="nx-mlabel">${e(c.mlabel)}</span>
      <span class="nx-plus" aria-hidden="true">+</span>
    </button>
    <ol class="nx-case-body" id="nx-case-${i}" hidden>${c.steps.map(([k, v]) => `<li><span>${e(k)}</span><p>${e(v)}</p></li>`).join('')}</ol>
  </article>`).join('')}</div>
</section>`;
}

function tools() {
  return `<section class="nx-section nx-reveal" id="nx-tools">
  <header class="nx-head"><span class="eyebrow">TOOLS</span><h2>숫자는 툴로, 구조는 AI로</h2><p>수치 하나 바꾸자고 AI를 부르진 않았습니다. 구조를 바꿔야 할 때만 요청하고, 나머지는 툴에서 고쳐서 바로 돌려 봤습니다.</p></header>
  <div class="nx-route" aria-label="수정할 때 고르는 길">
    <div class="nx-node">고칠 게 생김</div><span class="nx-line"></span>
    <div class="nx-node q">구조가 바뀌나?</div>
    <div class="nx-fork"><div class="nx-branch"><span>예</span><div class="nx-node ai">AI에 요청<small>목적 · 조건 · 예외 · 확인</small></div></div><div class="nx-branch"><span>아니오</span><div class="nx-node me">툴에서 직접<small>수치 · 배치 · 주기</small></div></div></div>
    <span class="nx-line"></span><div class="nx-node end">플레이해서 확인</div>
  </div>
  <div class="nx-tool-wrap">
    <div class="nx-tool-grid">${TOOLS.map(([k, t, p, d]) => `<article class="nx-tool ${k}"><span class="nx-tool-proj">${p}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
    <figure class="nx-planet">
      <canvas id="nx-planet-canvas" width="320" height="320" aria-label="행성 생성 미리보기"></canvas>
      <figcaption><span class="eyebrow">PLANET RULES</span><h3 id="nx-planet-name">—</h3><p id="nx-planet-meta"></p><button type="button" class="button" id="nx-planet-roll">다른 행성 뽑기 ↻</button></figcaption>
    </figure>
  </div>
</section>`;
}

/* ---------- behaviour ---------- */
let state = { proj: 'wop', stage: 0 };
let toyStop = null;

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
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('nx-in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.nx-reveal:not(.nx-in)').forEach(el => reduce ? el.classList.add('nx-in') : io.observe(el));
}

/* hero toy: World of Plant cursor wave, scaled down */
function startToy() {
  const cv = $('#nx-toy-canvas'); if (!cv) return null;
  const ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const COLORS = ['#c2dc89', '#f2d27a', '#e99bb4', '#9fd3e6'];
  let W = 0, H = 0, seeds = [], waves = [], bloomed = 0, last = 0, ptr = null, lastMove = 0, raf = 0, idleT = 0;
  const counter = $('#nx-bloom');
  function layout() {
    const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seeds = []; const gap = 26;
    for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2 + ((y / gap | 0) % 2) * gap / 2; x < W; x += gap) {
      const jx = x + (Math.random() - .5) * 8, jy = y + (Math.random() - .5) * 8;
      seeds.push({ x: jx, y: jy, life: 0, c: COLORS[Math.random() * 4 | 0], ph: Math.random() * 6.28 });
    }
  }
  function emit(x, y) { waves.push({ x, y, r: 0, max: Math.max(120, Math.min(W, H) * .42) }); }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
    if (ptr && t - lastMove < 1200 && (!waves.length || waves[waves.length - 1].r > 46)) emit(ptr.x, ptr.y);
    if (t - lastMove > 2600) { idleT += dt; if (idleT > 1.1) { idleT = 0; emit(W * (.2 + Math.random() * .6), H * (.2 + Math.random() * .6)); } }
    ctx.clearRect(0, 0, W, H);
    for (const w of waves) {
      w.r += dt * 210; const k = w.r / w.max;
      ctx.strokeStyle = `rgba(194,220,137,${.5 * (1 - k)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, 6.283); ctx.stroke();
      for (const s of seeds) { if (s.life > .6) continue; const d = Math.hypot(s.x - w.x, s.y - w.y); if (Math.abs(d - w.r) < 7) { if (s.life <= 0) { bloomed++; counter.textContent = bloomed.toLocaleString('ko-KR'); } s.life = 1; } }
    }
    waves = waves.filter(w => w.r < w.max);
    for (const s of seeds) {
      if (s.life > 0) {
        s.life = Math.max(0, s.life - dt * .3); const g = Math.min(1, s.life * 3), sw = Math.sin(t / 700 + s.ph) * 1.2;
        ctx.strokeStyle = 'rgba(120,170,100,' + (.6 * g) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(s.x, s.y + 6); ctx.lineTo(s.x + sw, s.y); ctx.stroke();
        ctx.fillStyle = s.c; ctx.globalAlpha = g; const R = 2.2 + 2.6 * g;
        for (let p = 0; p < 5; p++) { const a = p * 1.2566 + t / 3000; ctx.beginPath(); ctx.arc(s.x + sw + Math.cos(a) * R, s.y + Math.sin(a) * R, R * .62, 0, 6.283); ctx.fill(); }
        ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.arc(s.x + sw, s.y, R * .45, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
      } else { ctx.fillStyle = 'rgba(161,179,164,.28)'; ctx.beginPath(); ctx.arc(s.x, s.y, 1.3, 0, 6.283); ctx.fill(); }
    }
  }
  const move = ev => { const r = cv.getBoundingClientRect(); ptr = { x: ev.clientX - r.left, y: ev.clientY - r.top }; lastMove = performance.now(); };
  cv.addEventListener('pointermove', move); cv.addEventListener('pointerdown', ev => { move(ev); emit(ptr.x, ptr.y); });
  const ro = new ResizeObserver(layout); ro.observe(cv); layout();
  if (reduce) { seeds.forEach((s, i) => { if (i % 3 === 0) s.life = .9; }); frame(0); cancelAnimationFrame(raf); }
  else raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

/* planet preview: same idea as the in-game rules (type palette + noise + rare variant) */
function hash(x, y, s) { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); }
function noise(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, s) { let v = 0, a = .5; for (let i = 0; i < 5; i++) { v += a * noise(x, y, s + i * 13); x *= 2; y *= 2; a *= .5; } return v; }
function mix(h1, h2, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(h1), B = p(h2); return A.map((v, i) => Math.round(v + (B[i] - v) * k)); }
function drawPlanet(count) {
  const cv = $('#nx-planet-canvas'); if (!cv) return; const ctx = cv.getContext('2d'), S = cv.width, R = S * .42, cx = S / 2, cy = S / 2;
  const type = PLANETS[count % PLANETS.length], seed = Math.random() * 1000, rare = Math.random() < .05;
  const img = ctx.createImageData(S, S), L = [-.55, -.45, .7];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = (x - cx) / R, dy = (y - cy) / R, d2 = dx * dx + dy * dy, i = (y * S + x) * 4; if (d2 > 1) continue;
    const dz = Math.sqrt(1 - d2), lon = Math.atan2(dx, dz) + seed, lat = Math.asin(dy);
    const nx = Math.cos(lat) * Math.cos(lon) * 2.2, ny = Math.sin(lat) * 2.2 + Math.cos(lat) * Math.sin(lon);
    let h = type.bands ? .5 + .5 * Math.sin(lat * 9 + fbm(nx, ny, seed) * 3) : fbm(nx + 5, ny + 5, seed);
    let col;
    if (type.sea && h < .47) col = mix(type.sea, '#1b3a55', (.47 - h) * 2);
    else if (type.lava) col = h > .58 ? mix('#ff6a2a', type.c, (h - .58) * 4) : mix(type.a, type.b, h * 1.6);
    else col = h < .55 ? mix(type.a, type.b, (h - .3) * 3) : mix(type.b, type.c, (h - .55) * 2.5);
    if (type.name === 'White Night Ice' && Math.abs(lat) > 1.0) col = col.map(v => v + (255 - v) * .8);
    if (type.clouds) { const cl = fbm(nx * 1.6 + 9, ny * 1.6, seed + 40); if (cl > .62) { const k = Math.min(1, (cl - .62) * 4) * type.clouds * 1.6; col = col.map(v => v + (255 - v) * k); } }
    if (rare) col = [col[1], col[2], col[0]];
    const lit = Math.max(0, dx * L[0] + dy * L[1] + dz * L[2]), sh = .18 + .95 * lit, rim = Math.pow(1 - dz, 3) * .5;
    img.data[i] = Math.min(255, col[0] * sh + 140 * rim); img.data[i + 1] = Math.min(255, col[1] * sh + 200 * rim); img.data[i + 2] = Math.min(255, col[2] * sh + 255 * rim);
    img.data[i + 3] = Math.min(255, (1 - d2) * 2600);
  }
  ctx.clearRect(0, 0, S, S); ctx.putImageData(img, 0, 0);
  $('#nx-planet-name').textContent = type.name + (rare ? ' · 희귀 변형' : '');
  $('#nx-planet-meta').textContent = `${type.kind} · 시드 ${Math.round(seed)}. 게임에선 이런 규칙 5개에 5% 확률 희귀 변형을 섞어서 행성 3,800개를 만듭니다. 밖에서 본 모습이랑 안에 들어갔을 때 타일이 같은 노이즈를 써서 맞아떨어집니다.`;
}

function mount() {
  const main = $('#main'); const page = (location.hash.slice(1) || 'overview').split(/[/?]/)[0];
  document.body.classList.toggle('nx-overview', page === 'overview');
  if (page !== 'overview' || $('#nx-hero', main)) return;
  const heading = $('.collection-heading', main), grid = $('.project-grid', main); if (!heading || !grid) return;
  if (toyStop) toyStop();
  heading.id = 'nx-projects';
  heading.insertAdjacentHTML('beforebegin', hero());
  heading.insertAdjacentHTML('beforebegin', play());
  grid.insertAdjacentHTML('afterend', split() + verify() + tools());
  if (window.NXAnim) { NXAnim.mount($('#nx-anim-wop'), NXAnim.wopScene()); NXAnim.mount($('#nx-anim-ww'), NXAnim.wmScene()); }
  $('#nx-split-panel').innerHTML = splitPanel(state.proj, state.stage);
  toyStop = startToy(); drawPlanet(0); countUp(); reveal();
}

let rolls = 0;
document.addEventListener('click', ev => {
  const p = ev.target.closest('[data-nx-proj]'), s = ev.target.closest('[data-nx-stage]');
  if (p || s) {
    if (p) state.proj = p.dataset.nxProj; if (s) state.stage = +s.dataset.nxStage;
    $$('[data-nx-proj]').forEach(b => b.setAttribute('aria-pressed', b.dataset.nxProj === state.proj));
    $$('[data-nx-stage]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.nxStage === state.stage));
    const panel = $('#nx-split-panel'); panel.dataset.theme = state.proj; panel.innerHTML = splitPanel(state.proj, state.stage);
    panel.classList.remove('nx-swap'); void panel.offsetWidth; panel.classList.add('nx-swap'); return;
  }
  const top = ev.target.closest('.nx-case-top');
  if (top) { const open = top.getAttribute('aria-expanded') !== 'true'; top.setAttribute('aria-expanded', open); $('#' + top.getAttribute('aria-controls')).hidden = !open; top.closest('.nx-case').classList.toggle('open', open); return; }
  const f = ev.target.closest('[data-nx-case]');
  if (f) { $$('[data-nx-case]').forEach(b => b.setAttribute('aria-pressed', b === f)); $$('.nx-case').forEach(c => c.hidden = !(f.dataset.nxCase === 'all' || c.dataset.tag === f.dataset.nxCase)); return; }
  if (ev.target.closest('#nx-planet-roll')) drawPlanet(++rolls);
});
document.addEventListener('keydown', ev => {
  const s = ev.target.closest('[data-nx-stage]'); if (!s || !['ArrowLeft', 'ArrowRight'].includes(ev.key)) return;
  ev.preventDefault(); const n = (+s.dataset.nxStage + (ev.key === 'ArrowRight' ? 1 : STAGES.length - 1)) % STAGES.length;
  const b = $(`[data-nx-stage="${n}"]`); b.click(); b.focus();
});

new MutationObserver(mount).observe($('#main'), { childList: true });
mount();
})();
