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
  [2, '', '플레이 가능한 개인 게임', 'World of Plant · Wordless Mage'],
  [3800, '', '절차 생성 행성', '5개 유형 규칙 + 희귀 변형 5%'],
  [5, '종', '마법', '슬롯 3개 안에서 조합'],
  [6, '단계', 'AI 협업 루프', '설계부터 문서 대조까지']
];

const STAGES = ['설계', '요청', '구현', '플레이', '조정', '기록'];
const SPLIT = {
  wop: {
    name: 'World of Plant',
    rows: [
      { me: ['커서 파동 → 꽃 → 장치 → 로봇 → 로켓으로 이어지는 성장 단계 결정', '자원 3단계(에너지·원석·제련)와 업그레이드 트리의 연결 설계'],
        ai: ['규칙 문서를 바탕으로 시스템 구조와 데이터 테이블 초안 제안'], out: '핵심 규칙 · 업그레이드 노드 표' },
      { me: ['바꿀 것과 유지할 것을 나눠 요청 작성', '예외 조건(에너지 부족, 설치 대기, 중복 차감)을 요청에 포함'],
        ai: ['요청을 작업 단위로 쪼개 변경 범위 제시'], out: '목적 · 조건 · 예외 · 확인 항목' },
      { me: ['큰 구조 변경만 AI에 맡기고 결과 코드 검토'],
        ai: ['GPU 인스턴싱 렌더링, 은하 3,800개 행성, 로봇 작업 배정 구현', '행성 외형 생성 규칙을 C#과 셰이더에 동일하게 구현'], out: 'Unity 6 URP 빌드' },
      { me: ['빌드를 직접 플레이하며 끊김·동선·가독성 확인', '체감 문제를 인게임 프로파일러로 수치화'],
        ai: ['프로파일러 로그에서 스파이크 구간 분류'], out: '0.1초 이상 프레임 기록 로그' },
      { me: ['비용·배수·주기는 밸런스 툴에서 직접 조정', '플레이 피드백으로 규칙 변경: 업그레이드 비용을 기본 원석으로, 로봇 속도 업그레이드 추가'],
        ai: ['조정된 규칙을 코드·UI 문구에 반영'], out: '로봇 속도 Lv당 +25%, 최대 8레벨' },
      { me: ['문서와 실제 빌드를 대조해 폐기된 설계(생태 시뮬레이션) 분리'],
        ai: ['기획서·포트폴리오 문서 정리'], out: '게임 기획서 · 이 페이지' }
    ]
  },
  ww: {
    name: 'Wordless Mage',
    rows: [
      { me: ['로봇의 대사에서 마법을 얻는다는 핵심 규칙 결정', '자모 조합 대신 마법 5종 · 슬롯 3개로 범위 조정'],
        ai: ['마법과 대상의 반응 규칙을 표로 정리'], out: '마법 × 대상 반응표' },
      { me: ['조준 안내와 실제 결과가 일치해야 한다는 기준을 요청에 명시'],
        ai: ['공통 장애물 판정 구조 제안'], out: '조준 · 충돌 판정 기준' },
      { me: ['레벨 구조와 학습 순서를 정하고 구현 결과 검토'],
        ai: ['로봇 AI, 마법 효과, 레벨 에디터 구현'], out: '레벨 · 지도 · 결과 화면' },
      { me: ['직접 플레이로 퍼즐 전달과 조작감 확인', '자동 검증과 직접 플레이를 구분해 기록'],
        ai: ['level-review 기능으로 해금·재도전·별 조건 자동 점검'], out: '검증 보고서 + 캡처' },
      { me: ['레벨 에디터로 장치·지형 배치를 직접 수정', '체력·효과·도전 조건 수치 조정'],
        ai: ['구조 변경이 필요할 때만 코드 수정'], out: '조정된 레벨 데이터' },
      { me: ['실제 화면과 설명이 일치하는지 확인'],
        ai: ['기획서 형식 정리'], out: '게임 기획서' }
    ]
  }
};

const CASES = [
  { tag: 'wop', label: 'WoP · 최적화', title: '행성이 늘수록 생기는 끊김', metric: '360', unit: 'ms', mlabel: '개선 전 최대 스파이크',
    steps: [
      ['증상', '행성 수가 늘자 플레이 중 주기적으로 화면이 멈칫했습니다. 체감만으로는 원인을 특정할 수 없었습니다.'],
      ['측정', '게임 안에 프레임 프로파일러를 직접 넣어 0.1초 이상 걸린 프레임과 구간을 기록했습니다. 로봇 작업 배정이 100~360ms, 53MB 세이브 저장이 약 280ms였습니다.'],
      ['조치', '작업 배정에 프레임당 검사 예산을 두고, 자주 쓰는 집계는 2초 캐시로 바꾸고, 매 프레임 생기던 메모리 할당을 없앴습니다.'],
      ['결과', '작업 배정 스파이크는 사라졌습니다. 30초마다 생기는 저장 끊김은 남아 있어, 행성별 분할 저장을 다음 과제로 두었습니다.']
    ] },
  { tag: 'wop', label: 'WoP · 회귀 버그', title: '최적화 뒤 로봇이 건설을 멈춤', metric: '705', unit: '건', mlabel: '대기 작업 · 출동 로봇 0',
    steps: [
      ['증상', '어느 시점부터 로봇이 땅을 열거나 설치하지 않았습니다.'],
      ['원인', '앞선 최적화에서 넣은 검사 횟수 제한(16회)과 재시도 지연이 겹쳐, 대기 작업 705건이 쌓이는 동안 배정이 한 건도 일어나지 않았습니다.'],
      ['조치', '행성마다 한 건씩 공평하게 배정하고 검사 예산을 32로 늘렸습니다. 자리를 못 찾은 작업만 3초 뒤 재시도하고, 가까운 칸부터 짓도록 순서를 바꿨습니다.'],
      ['배운 점', '성능 개선이 게임 규칙을 깨지 않는지 다시 플레이로 확인하는 단계를 루프에 추가했습니다.']
    ] },
  { tag: 'build', label: 'WoP · 빌드', title: '빌드에서만 꽃과 장치가 보이지 않음', metric: '0', unit: '개', mlabel: '빌드에서 보인 설치물',
    steps: [
      ['증상', '에디터에서는 정상인데, 빌드에서는 설치한 꽃과 장치가 모두 보이지 않았습니다. 에너지는 계속 모였습니다.'],
      ['범위 좁히기', '로직은 돌고 있으니 렌더링 문제로 범위를 좁혔습니다.'],
      ['원인', '빌드 과정에서 GPU 인스턴싱용 셰이더 변형이 제거되고 있었습니다. 이전 기획의 씬이 첫 씬으로 잡혀 있던 문제도 함께 찾았습니다.'],
      ['조치', '인스턴싱 변형을 유지하도록 설정하고, 에디터 스크립트가 씬 순서와 설정을 자동으로 복구하게 했습니다.']
    ] },
  { tag: 'ww', label: 'WM · 범위 판단', title: '자모 조합 마법 → 마법 5종', metric: '5', unit: '종', mlabel: '최종 마법 수 · 슬롯 3개',
    steps: [
      ['초안', '처음에는 대사에서 자모를 모아 마법을 조합하는 구조였습니다.'],
      ['문제', '조합 경우의 수가 늘수록 퍼즐마다 확인할 예외가 늘어, 개인 제작 기간 안에 레벨을 설계·검증하기 어려웠습니다.'],
      ['판단', '문자 조합이 아니라 효과가 분명한 마법 5종으로 줄이고, 슬롯 3개 안에서 고르는 구조로 바꿨습니다.'],
      ['결과', '마법마다 역할(시간·무게·위치·제거)이 분리되어, 조합할 이유가 레벨 안에서 드러나게 되었습니다.']
    ] },
  { tag: 'ww', label: 'WM · 일관성', title: '조준선과 실제 결과 일치', metric: '3', unit: '곳', mlabel: '같은 판정을 쓰게 한 곳 · 대상·조준선·투사체',
    steps: [
      ['기준', '플레이어가 본 조준 안내와 실제 마법 결과가 같아야 퍼즐 규칙을 신뢰할 수 있습니다.'],
      ['조치', '대상 판정·조준선·투사체가 같은 장애물 판정을 쓰게 했습니다. 벽에 막히면 안내와 투사체가 모두 벽에서 멈춥니다.'],
      ['예외', '트리거와 대상 자신의 콜라이더는 벽으로 보지 않고, 컨베이어에는 별도 조준 지점을 두었습니다.']
    ] },
  { tag: 'wop', label: 'WoP · 플레이 피드백', title: '비효율적인 로봇 동선', metric: '25', unit: '%', mlabel: '로봇 속도 업그레이드 Lv당',
    steps: [
      ['관찰', '로봇이 멀리 떨어진 칸을 오가며 지어 건설이 느리게 느껴졌습니다.'],
      ['조치', '현재 위치에서 가까운 칸부터 순서대로 짓게 하고, 로봇 속도 업그레이드(Lv당 +25%, 최대 8레벨)를 추가했습니다.'],
      ['함께 바꾼 규칙', '업그레이드 비용을 제련 자원이 아닌 기본 원석으로 바꿔, 초반 성장 흐름이 막히지 않게 했습니다.']
    ] }
];

const TOOLS = [
  ['balance', '밸런스 툴', 'World of Plant', '비용·배수·주기·사거리를 실시간으로 조정하고 바로 플레이로 확인합니다. 수치 조정에는 토큰을 쓰지 않습니다.'],
  ['editor', '레벨 에디터', 'Wordless Mage', '장치·지형·로봇 배치를 직접 수정합니다. 레벨 구조 변경만 AI에 요청합니다.'],
  ['profiler', '프레임 프로파일러', 'World of Plant', '0.1초 이상 걸린 프레임을 구간별로 기록합니다. 끊김의 원인을 감이 아니라 로그로 판단합니다.'],
  ['review', 'level-review', 'Wordless Mage', '해금·재도전 초기화·별 조건을 자동으로 점검합니다. 결과는 직접 플레이와 구분해 기록합니다.']
];

const PLANETS = [
  { name: 'Sprout Cradle', kind: '초원', a: '#3f7d4a', b: '#8fc46b', c: '#d8e8a6', sea: '#2c5d78', clouds: .5 },
  { name: 'White Night Ice', kind: '빙원', a: '#9fb9c9', b: '#dfeef3', c: '#ffffff', sea: '#3d6f8f', clouds: .35 },
  { name: 'Red Sands', kind: '사막', a: '#8d3f2a', b: '#c86d3f', c: '#e6b07a', sea: null, clouds: .12 },
  { name: 'Sleeping Night', kind: '가스', a: '#2a2c55', b: '#5a4f8e', c: '#b3a6d9', sea: null, clouds: 0, bands: true },
  { name: 'Ember Garden', kind: '용암', a: '#231512', b: '#4a2318', c: '#ff8a3c', sea: null, clouds: 0, lava: true }
];

const TIMELINE = [
  ['2026', '2026.11', 'World of Plant', '개인 · Unity', '커서 파동 증분형 게임. 기획, AI 협업 구현, 최적화와 밸런스를 직접 진행.', 'wop'],
  ['2026', '2026.11', 'Wordless Mage', '개인 · Unity', '로봇의 대사에서 마법을 얻는 환경 퍼즐. 레벨 에디터로 레벨 설계.', 'ww'],
  ['2026', '2026.10 – 11', 'Galactica', '개인', '개인 프로젝트.', ''],
  ['2024', '2024.04 – 11', 'Lone Lantern', 'O2CUBE · 학과 게임 개발 동아리', '동아리 팀 프로젝트.', ''],
  ['2019', '2019.03 – 11', '디페어', '넷마블게임아카데미 4기', '아카데미 팀 프로젝트.', '']
];

/* ---------- markup ---------- */
function hero() {
  return `<section class="nx-hero" id="nx-hero">
  <div class="nx-hero-copy">
    <span class="eyebrow">GAME DESIGNER × AI</span>
    <h1>규칙은 제가 정하고,<br>구현은 AI와 함께,<br><em>판단은 플레이로.</em></h1>
    <p class="nx-lead">두 개의 게임을 혼자 기획하고 AI와 함께 만들었습니다. 큰 구조 변경은 AI에 맡기고, 세부 수치는 직접 만든 툴로 조정하며, 결과는 측정과 플레이로 확인합니다.</p>
    <div class="nx-actions">
      <a class="button primary" href="#" data-scroll="nx-projects">프로젝트 보기</a>
      <a class="button quiet" href="#" data-scroll="nx-verify">검증 사례</a>
      <a class="button quiet" href="#ai-development">AI 활용 과정 →</a>
    </div>
  </div>
  <figure class="nx-toy" aria-label="World of Plant의 파동 규칙을 축소한 체험">
    <canvas id="nx-toy-canvas"></canvas>
    <figcaption><span class="nx-dot"></span><span id="nx-toy-hint">커서를 움직이거나 터치해 보세요</span><b><span id="nx-bloom">0</span> 송이</b></figcaption>
  </figure>
</section>
<section class="nx-stats" aria-label="주요 수치">${STATS.map(([n, u, l, s]) => `<div class="nx-stat nx-reveal"><strong><span data-count="${n}">0</span>${u ? `<small>${u}</small>` : ''}</strong><span>${l}</span><em>${s}</em></div>`).join('')}</section>
<nav class="nx-jump" aria-label="소개 페이지 내 이동">${[['nx-projects','프로젝트'],['nx-split','나와 AI'],['nx-verify','검증 사례'],['nx-tools','툴과 생성 규칙'],['nx-career','이력']].map(([id, t], i) => `<a href="#" data-scroll="${id}"><span>${String(i + 1).padStart(2, '0')}</span>${t}</a>`).join('')}</nav>`;
}

function split() {
  return `<section class="nx-section nx-reveal" id="nx-split">
  <header class="nx-head"><span class="eyebrow">ROLE SPLIT</span><h2>무엇을 제가 하고, 무엇을 AI에 맡겼나</h2><p>단계를 눌러 프로젝트별 역할과 산출물을 확인하세요.</p></header>
  <div class="nx-split-controls">
    <div class="nx-seg" role="group" aria-label="프로젝트 선택">${Object.entries(SPLIT).map(([id, p], i) => `<button type="button" data-nx-proj="${id}" aria-pressed="${i === 0}" class="${id}">${p.name}</button>`).join('')}</div>
    <ol class="nx-stages" role="group" aria-label="협업 단계">${STAGES.map((s, i) => `<li><button type="button" data-nx-stage="${i}" aria-pressed="${i === 0}"><span>${String(i + 1).padStart(2, '0')}</span>${s}</button></li>`).join('')}</ol>
  </div>
  <div class="nx-split-panel" id="nx-split-panel" aria-live="polite"></div>
</section>`;
}
function splitPanel(proj, stage) {
  const r = SPLIT[proj].rows[stage];
  return `<article class="nx-col me"><header><span class="nx-who">ME</span><h3>직접 판단</h3></header><ul>${r.me.map(t => `<li>${e(t)}</li>`).join('')}</ul></article>
  <div class="nx-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></div>
  <article class="nx-col ai"><header><span class="nx-who">AI</span><h3>AI에 맡긴 작업</h3></header><ul>${r.ai.map(t => `<li>${e(t)}</li>`).join('')}</ul></article>
  <p class="nx-out"><span>산출물</span>${e(r.out)}</p>`;
}

function verify() {
  return `<section class="nx-section nx-reveal" id="nx-verify">
  <header class="nx-head"><span class="eyebrow">VERIFY & PROBLEM SOLVING</span><h2>문제를 숫자로 확인하고 고쳤습니다</h2><p>카드를 열면 증상 → 원인 → 조치 → 결과 순서로 볼 수 있습니다.</p></header>
  <div class="nx-filter" role="group" aria-label="사례 분류">${[['all','전체'],['wop','World of Plant'],['ww','Wordless Mage'],['build','빌드']].map(([id, t], i) => `<button type="button" data-nx-case="${id}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>
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
  <header class="nx-head"><span class="eyebrow">TOOLS & RULES</span><h2>큰 변경은 AI로, 세부 조정은 직접 만든 툴로</h2><p>토큰은 구조를 바꿀 때만 씁니다. 수치와 배치는 툴에서 바로 고치고 플레이로 확인합니다.</p></header>
  <div class="nx-route" aria-label="변경 요청 분기">
    <div class="nx-node">변경이 필요함</div><span class="nx-line"></span>
    <div class="nx-node q">구조가 바뀌는가?</div>
    <div class="nx-fork"><div class="nx-branch"><span>예</span><div class="nx-node ai">AI에 요청<small>목적 · 조건 · 예외 · 확인</small></div></div><div class="nx-branch"><span>아니오</span><div class="nx-node me">툴에서 직접 조정<small>수치 · 배치 · 주기</small></div></div></div>
    <span class="nx-line"></span><div class="nx-node end">직접 플레이로 확인</div>
  </div>
  <div class="nx-tool-wrap">
    <div class="nx-tool-grid">${TOOLS.map(([k, t, p, d]) => `<article class="nx-tool ${k}"><span class="nx-tool-proj">${p}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
    <figure class="nx-planet">
      <canvas id="nx-planet-canvas" width="320" height="320" aria-label="절차 생성 행성 미리보기"></canvas>
      <figcaption><span class="eyebrow">PLANET RULES</span><h3 id="nx-planet-name">—</h3><p id="nx-planet-meta">World of Plant 행성은 5개 유형 규칙과 5% 희귀 변형으로 만들어집니다. 외부 외형과 내부 타일이 같은 노이즈를 씁니다.</p><button type="button" class="button" id="nx-planet-roll">다른 행성 생성 ↻</button></figcaption>
    </figure>
  </div>
</section>`;
}

function career() {
  const years = [...new Set(TIMELINE.map(r => r[0]))];
  return `<section class="nx-section nx-reveal" id="nx-career">
  <header class="nx-head"><span class="eyebrow">TIMELINE</span><h2>이력</h2></header>
  <div class="nx-filter" role="group" aria-label="연도 선택"><button type="button" data-nx-year="all" aria-pressed="true">전체</button>${years.map(y => `<button type="button" data-nx-year="${y}" aria-pressed="false">${y}</button>`).join('')}</div>
  <ol class="nx-timeline">${TIMELINE.map(([y, d, t, org, desc, link]) => `<li data-year="${y}"><time>${d}</time><div><h3>${link ? `<a href="#project/${link}">${e(t)} <span aria-hidden="true">→</span></a>` : e(t)}</h3><span class="nx-org">${e(org)}</span><p>${e(desc)}</p></div></li>`).join('')}</ol>
  <div class="nx-contact"><p>함께 이야기할 기회를 기다리고 있습니다.</p><a class="button primary" href="mailto:dngus0822@gmail.com">dngus0822@gmail.com</a></div>
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
  $('#nx-planet-meta').textContent = `${type.kind} 유형 · 시드 ${Math.round(seed)}. 실제 게임은 5개 유형 규칙과 5% 희귀 변형으로 행성 3,800개를 만들고, 외형과 내부 타일이 같은 노이즈를 씁니다.`;
}

function mount() {
  const main = $('#main'); const page = (location.hash.slice(1) || 'overview').split(/[/?]/)[0];
  document.body.classList.toggle('nx-overview', page === 'overview');
  if (page !== 'overview' || $('#nx-hero', main)) return;
  const heading = $('.collection-heading', main), grid = $('.project-grid', main); if (!heading || !grid) return;
  if (toyStop) toyStop();
  heading.id = 'nx-projects';
  heading.insertAdjacentHTML('beforebegin', hero());
  grid.insertAdjacentHTML('afterend', split() + verify() + tools() + career());
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
  const y = ev.target.closest('[data-nx-year]');
  if (y) { $$('[data-nx-year]').forEach(b => b.setAttribute('aria-pressed', b === y)); $$('.nx-timeline li').forEach(li => li.hidden = !(y.dataset.nxYear === 'all' || li.dataset.year === y.dataset.nxYear)); return; }
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
