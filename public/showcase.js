/* Showcase layer: sections added on top of the archive overview.
   Runs after app.js and showcase-anim.js; re-inserts itself whenever app.js re-renders #main. */
'use strict';
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- content ---------- */
const STATS = [
  [2, '', '개인 제작 게임', 'World of Plant · Wordless Mage'],
  [3800, '', '절차 생성 행성', '유형 규칙 5종, 희귀 변형 5%'],
  [5, '종', '마법', '슬롯 3칸 기반 조합'],
  [4, '종', '자체 제작 도구', '밸런스 · 레벨 · 프로파일링 · 검수']
];

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
  me: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
};
const ico = (k, cls = '') => `<svg class="nx-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ''}</svg>`;

const ROLE = {
  me: [['compass', '컨셉·핵심 규칙'], ['map', '레벨·콘텐츠 설계'], ['scale', '범위·우선순위 판단'], ['sliders', '수치 폴리싱'], ['gamepad', '플레이 검수'], ['doc', '기획 문서화']],
  ai: [['code', '기능 구현'], ['cube', '렌더링·셰이더'], ['gear', '시스템 로직'], ['robot', '로봇 동작'], ['wrench', '에디터·툴 제작'], ['bug', '버그 수정']]
};
const LOOP = [['compass', '기획', 'me'], ['code', 'AI 구현', 'ai'], ['gamepad', '플레이 검수', 'me'], ['sliders', '수치 폴리싱', 'me']];

/* AI 협업 과정의 시행착오 — 실제 작업 중 발생한 사례 */
const AI_ISSUES = [
  { title: '성능 개선 요청이 게임 규칙을 손상', tag: '회귀 오류', icon: 'gauge',
    what: '프레임 저하를 줄이기 위해 AI가 작업 배정에 검사 횟수 제한(16회)과 재시도 대기를 도입. 프레임은 안정됐으나 대기 작업 705건이 쌓이는 동안 출동한 로봇은 0대.',
    fix: '행성 단위 순환 배정, 검사 한도 32회, 실패 작업만 3초 후 재시도하도록 재설계. 가까운 칸부터 시공하도록 순서 변경.',
    rule: '성능 관련 수정 후에는 반드시 플레이 회귀 테스트로 핵심 규칙 동작을 재확인.' },
  { title: '다른 프로젝트의 로그를 근거로 원인 분석', tag: '잘못된 근거', icon: 'chart',
    what: '끊김 원인 분석 과정에서 AI가 참조한 Editor.log가 World of Plant가 아닌 Wordless Mage 프로젝트의 로그였음. 분석 결과 자체가 무의미.',
    fix: '게임 내부에 프레임 프로파일러를 직접 삽입하여 해당 빌드의 구간별 소요 시간을 기록. 작업 배정 100~360ms, 저장 약 280ms 확인.',
    rule: '원인 분석은 해당 빌드에서 직접 수집한 데이터만 근거로 사용.' },
  { title: '수정본 전달 과정에서 이전 버전으로 회귀', tag: '파일 동기화', icon: 'sync',
    what: '수정 파일을 로컬 프로젝트로 전달하는 과정에서 같은 경로를 재사용하자 이전 버전이 덮어써짐. 은하·게임 코드가 되돌아가고, 1회는 괄호가 깨진 코드가 반영됨.',
    fix: '전달마다 새 경로를 사용하고, 전달 후 프로젝트 파일을 다시 읽어 해시(md5) 값으로 실제 반영 여부를 대조.',
    rule: '“수정 완료” 보고가 아니라 실제 파일 내용으로 반영을 확인.' },
  { title: '일괄 수정 스크립트가 필요한 코드까지 삭제', tag: '수정 범위', icon: 'scissors',
    what: '불필요한 연출 코드를 제거하는 블록 삭제 스크립트의 범위 판정 오류로 은하 렌더링 코드 일부가 함께 삭제됨.',
    fix: '직전 사본에서 파일 복원 후, 줄 번호를 지정한 삭제로 범위를 한정해 재작업.',
    rule: '자동 삭제·치환은 범위를 명시하고, 적용 직후 컴파일로 확인한 뒤 다음 단계 진행.' },
  { title: '컴파일되지 않는 코드와 단위 누락', tag: '검증 누락', icon: 'alert',
    what: '행성 후광 크기 계산에서 화면 배율 계수(GK) 누락, 선언 전 변수 사용으로 컴파일 오류 발생.',
    fix: 'Unity 컴파일 오류 메시지를 그대로 전달해 수정. 수정 단위를 작게 나누어 단계별 컴파일 확인.',
    rule: '변경 범위가 넓을수록 요청을 분할하고 단계별로 실행 확인.' },
  { title: '폐기한 기획이 빌드와 문서에 잔존', tag: '문서 불일치', icon: 'layers',
    what: '개발 방향 전환 후에도 이전 기획(생태 시뮬레이션)의 씬이 빌드 첫 씬으로 남아 있었고, 기존 문서가 남아 AI가 이전 내용을 기준으로 설명하는 문제 발생.',
    fix: '빌드 씬 순서를 자동 복구하는 에디터 스크립트 추가, 폐기 기획 문서는 별도 보관 처리.',
    rule: '문서 작성 및 수정 요청 전 최신 빌드와 기획 문서를 대조.' }
];
const AI_RULES = [
  ['rules', '요청서', '목적·변경 조건·유지 조건·예외·확인 항목을 구분해 작성'],
  ['chart', '근거', '해당 빌드에서 직접 수집한 로그와 수치만 사용'],
  ['hash', '반영 확인', '보고 내용이 아닌 실제 파일 내용과 해시로 확인'],
  ['check', '검증 순서', '컴파일 → 플레이 회귀 테스트 → 로그 확인'],
  ['scale', '역할 구분', '구조 변경은 AI, 수치·배치 조정은 자체 툴']
];

const CASES = [
  { tag: 'wop', label: 'WoP · 최적화', icon: 'gauge', title: '행성 증가에 따른 주기적 프레임 정지', metric: '360', unit: 'ms', mlabel: '개선 전 최대 지연',
    steps: [
      ['현상', '행성 수 증가에 따라 수 초 간격으로 화면 정지 발생. 체감만으로는 원인 구간 특정 불가.'],
      ['분석', '인게임 프로파일러로 100ms 이상 프레임을 구간별로 기록. 로봇 작업 배정 100~360ms, 53MB 세이브 저장 약 280ms 확인.'],
      ['조치', '프레임당 검사 예산 도입, 집계값 2초 캐시, 매 프레임 메모리 할당 제거.'],
      ['결과 및 과제', '작업 배정 지연 해소. 30초 주기 저장 지연은 잔존하여 행성별 분할 저장을 후속 과제로 설정.']
    ] },
  { tag: 'build', label: 'WoP · 빌드', icon: 'layers', title: '빌드 환경에서 설치물 미표시', metric: '0', unit: '개', mlabel: '빌드에서 표시된 설치물',
    steps: [
      ['현상', '에디터에서는 정상이나 빌드에서 꽃·장치가 모두 미표시. 에너지 수집은 정상 진행.'],
      ['분석', '게임 로직은 정상 동작하므로 렌더링 단계로 범위 한정.'],
      ['원인', '빌드 시 GPU 인스턴싱 셰이더 변형이 제거됨. 첫 씬이 이전 기획 씬으로 지정된 문제도 함께 발견.'],
      ['조치', '인스턴싱 변형 유지 설정, 씬 순서·설정 자동 복구 에디터 스크립트 추가.']
    ] },
  { tag: 'ww', label: 'WM · 범위 조정', icon: 'magic', title: '자모 조합 마법의 마법 5종 전환', metric: '5', unit: '종', mlabel: '최종 마법 수 · 슬롯 3칸',
    steps: [
      ['초기 구조', '로봇 대사에서 자모를 수집해 마법을 조합하는 방식.'],
      ['문제', '조합 수 증가에 비례해 퍼즐별 예외 검증 비용 증가. 개인 제작 일정 내 레벨 설계·검증이 불가능한 수준.'],
      ['결정', '효과가 명확한 마법 5종으로 축소, 슬롯 3칸 내 선택 구조로 전환.'],
      ['효과', '시간·무게·위치·제거로 역할이 분리되어 레벨 안에서 마법 선택의 근거가 명확해짐.']
    ] },
  { tag: 'ww', label: 'WM · 판정', icon: 'eye', title: '조준 안내와 실제 적용 위치 불일치', metric: '3', unit: '곳', mlabel: '공통 판정 적용 (대상·조준선·투사체)',
    steps: [
      ['기준', '조준 안내와 실제 결과가 일치해야 퍼즐 규칙에 대한 신뢰 확보 가능.'],
      ['조치', '대상 판정·조준선·투사체에 동일 장애물 판정 적용. 벽에 막히면 안내선과 투사체 모두 벽에서 정지.'],
      ['예외 처리', '트리거 및 대상 자신의 콜라이더는 장애물에서 제외, 컨베이어는 별도 조준점 지정.']
    ] },
  { tag: 'wop', label: 'WoP · 플레이 피드백', icon: 'robot', title: '로봇 시공 동선 비효율', metric: '25', unit: '%', mlabel: '로봇 속도 업그레이드 레벨당 증가',
    steps: [
      ['현상', '원거리 칸을 오가는 시공 순서로 건설 속도가 체감상 저하.'],
      ['조치', '현재 위치 기준 최근접 순서 시공, 로봇 속도 업그레이드(레벨당 +25%, 최대 8레벨) 추가.'],
      ['연계 변경', '업그레이드 재화를 제련 자원에서 기본 원석으로 변경해 초반 진행 정체 해소.']
    ] }
];

const TOOLS = [
  ['balance', 'sliders', '밸런스 툴', 'World of Plant', '비용·배수·주기·사거리를 실행 중 조정하고 즉시 플레이로 확인. 수치 조정에는 AI를 사용하지 않음.'],
  ['editor', 'map', '레벨 에디터', 'Wordless Mage', '장치·지형·로봇 배치를 직접 편집. 레벨 구조 변경이 필요한 경우에만 AI에 요청.'],
  ['profiler', 'chart', '프레임 프로파일러', 'World of Plant', '100ms 이상 소요된 프레임을 구간별로 기록. 프레임 저하 분석의 1차 근거.'],
  ['review', 'check', 'level-review', 'Wordless Mage', '해금·재도전 초기화·별 조건 자동 점검. 수동 플레이 결과와 분리 기록.']
];

const PLANETS = [
  { name: 'Sprout Cradle', kind: '초원', a: '#3f7d4a', b: '#8fc46b', c: '#d8e8a6', sea: '#2c5d78', clouds: .5 },
  { name: 'White Night Ice', kind: '빙원', a: '#9fb9c9', b: '#dfeef3', c: '#ffffff', sea: '#3d6f8f', clouds: .35 },
  { name: 'Red Sands', kind: '사막', a: '#8d3f2a', b: '#c86d3f', c: '#e6b07a', sea: null, clouds: .12 },
  { name: 'Sleeping Night', kind: '가스', a: '#2a2c55', b: '#5a4f8e', c: '#b3a6d9', sea: null, clouds: 0, bands: true },
  { name: 'Ember Garden', kind: '용암', a: '#231512', b: '#4a2318', c: '#ff8a3c', sea: null, clouds: 0, lava: true }
];


/* ---------- markup ---------- */
function animCard(id, cls, label, title, desc, steps) {
  return `<article class="nx-anim ${cls}" id="${id}">
    <header><span class="nx-anim-label">${label}</span><h3>${title}</h3></header>
    <div class="nx-anim-stage"><canvas aria-label="${e(title)} 진행 애니메이션"></canvas></div>
    <div class="nx-anim-bar" aria-hidden="true"><i></i></div>
    <ol class="nx-anim-phases" aria-hidden="true">${steps.map(([, s]) => `<li data-phase>${s}</li>`).join('')}</ol>
    <p>${desc}</p>
  </article>`;
}
function play() {
  const A = window.NXAnim;
  return `<section class="nx-play" id="nx-play">
  <header class="nx-head"><span class="eyebrow">GAME FLOW</span><h2>게임 흐름</h2></header>
  <div class="nx-anim-grid">
    ${animCard('nx-anim-wop', 'wop', 'World of Plant', '꽃에서 은하로', '커서 파동으로 꽃을 피워 에너지를 모으고 장치로 생산을 자동화합니다. 블루프린트를 로켓으로 보내 새 행성을 개척한 뒤, 은하로 시야를 넓혀 여러 행성 사이의 운송망을 연결합니다.', A ? A.wopScene().steps : [])}
    ${animCard('nx-anim-ww', 'ww', 'Wordless Mage', '로봇 처치에서 길 열기까지', '플레이어를 발견한 로봇이 정지 신호를 보내면, 스위치로 낙하 장치를 작동시켜 로봇을 처치합니다. 떨어진 정지 마법을 획득해 거대 팬에 발동하고, 멈춘 날개 사이로 통과합니다.', A ? A.wmScene().steps : [])}
  </div>
</section>`;
}
function intro() {
  return `<section class="nx-intro nx-reveal" id="nx-intro">
  <div class="nx-intro-copy">
    <span class="eyebrow">LEE WOOHYEON · GAME DESIGN × AI</span>
    <h1>규칙을 설계하고,<br>플레이로 다듬는<br><strong>이우현입니다.</strong></h1>
    <p class="nx-lead">시스템과 콘텐츠를 기획하고, AI와 협업해 직접 플레이할 수 있는 게임으로 만듭니다. 컨셉·핵심 규칙·레벨과 밸런스는 직접 정하고, 구현 결과는 플레이로 확인합니다.</p>
    <div class="nx-intro-tags"><span>시스템·콘텐츠 기획</span><span>AI 협업 구현</span><span>직접 플레이 검수</span></div>
  </div>
  <div class="nx-stats" aria-label="주요 수치">${STATS.map(([n, u, l, s]) => `<div class="nx-stat"><strong><span data-count="${n}">0</span>${u ? `<small>${u}</small>` : ''}</strong><span>${l}</span><em>${s}</em></div>`).join('')}</div>
</section>
<nav class="nx-jump" aria-label="페이지 내 이동">${[['nx-intro','소개'],['nx-projects','프로젝트'],['nx-play','게임 흐름'],['nx-split','역할 분담'],['nx-ai','AI 협업 시행착오'],['nx-verify','문제 해결'],['nx-tools','제작 도구']].map(([id, t], i) => `<a href="#" data-scroll="${id}"><span>${String(i + 1).padStart(2, '0')}</span>${t}</a>`).join('')}</nav>`;
}

function split() {
  const tile = ([k, t], who) => `<li class="nx-role-tile ${who}">${ico(k)}<span>${t}</span></li>`;
  return `<section class="nx-section nx-reveal" id="nx-split">
  <header class="nx-head"><span class="eyebrow">ROLE</span><h2>역할 분담</h2></header>
  <div class="nx-roles">
    <div class="nx-role me"><header>${ico('me', 'big')}<div><h3>직접</h3><small>기획 · 판단 · 수치 폴리싱</small></div></header><ul>${ROLE.me.map(r => tile(r, 'me')).join('')}</ul></div>
    <div class="nx-role ai"><header>${ico('ai', 'big')}<div><h3>AI</h3><small>기능 구현</small></div></header><ul>${ROLE.ai.map(r => tile(r, 'ai')).join('')}</ul></div>
  </div>
  <ol class="nx-loop" aria-label="작업 순환">${LOOP.map(([k, t, who]) => `<li class="${who}">${ico(k)}<span>${t}</span></li>`).join('')}</ol>
</section>`;
}

function aiIssues() {
  return `<section class="nx-section nx-reveal" id="nx-ai">
  <header class="nx-head"><span class="eyebrow">AI COLLABORATION</span><h2>AI 협업 시행착오</h2><p>AI와 작업하며 실제로 발생한 문제와 대응, 이후 작업 방식에 반영한 원칙.</p></header>
  <ol class="nx-issues">${AI_ISSUES.map((it, i) => `<li class="nx-issue">
    <div class="nx-issue-head">${ico(it.icon, 'issue')}<span class="nx-issue-no">${String(i + 1).padStart(2, '0')}</span><span class="nx-issue-tag">${e(it.tag)}</span><h3>${e(it.title)}</h3></div>
    <dl><div><dt>발생</dt><dd>${e(it.what)}</dd></div><div><dt>대응</dt><dd>${e(it.fix)}</dd></div><div class="rule"><dt>반영 원칙</dt><dd>${e(it.rule)}</dd></div></dl>
  </li>`).join('')}</ol>
  <div class="nx-rules"><h3>정리된 협업 원칙</h3><ul>${AI_RULES.map(([i, k, v]) => `<li>${ico(i)}<b>${e(k)}</b><span>${e(v)}</span></li>`).join('')}</ul></div>
</section>`;
}

function verify() {
  return `<section class="nx-section nx-reveal" id="nx-verify">
  <header class="nx-head"><span class="eyebrow">PROBLEM SOLVING</span><h2>문제 해결</h2><p>현상 → 분석 → 조치 → 결과 순으로 정리한 개발 중 주요 문제.</p></header>
  <div class="nx-filter" role="group" aria-label="분류">${[['all','전체'],['wop','World of Plant'],['ww','Wordless Mage'],['build','빌드']].map(([id, t], i) => `<button type="button" data-nx-case="${id}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>
  <div class="nx-cases">${CASES.map((c, i) => `<article class="nx-case ${c.tag}" data-tag="${c.tag}">
    <button type="button" class="nx-case-top" aria-expanded="false" aria-controls="nx-case-${i}">
      <span class="nx-case-label">${ico(c.icon)}${e(c.label)}</span>
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
  <header class="nx-head"><span class="eyebrow">TOOLS</span><h2>제작 도구</h2><p>구조 변경은 AI에 요청하고, 수치·배치 조정은 자체 제작 툴로 처리하는 이원화 방식.</p></header>
  <div class="nx-route" aria-label="수정 요청 분기">
    <div class="nx-node">${ico('alert')}수정 필요</div><span class="nx-line"></span>
    <div class="nx-node q">${ico('scale')}구조 변경 여부</div>
    <div class="nx-fork"><div class="nx-branch"><span>예</span><div class="nx-node ai">${ico('code')}AI 요청<small>목적 · 조건 · 예외 · 확인</small></div></div><div class="nx-branch"><span>아니오</span><div class="nx-node me">${ico('sliders')}툴 직접 조정<small>수치 · 배치 · 주기</small></div></div></div>
    <span class="nx-line"></span><div class="nx-node end">${ico('gamepad')}플레이 검증</div>
  </div>
  <div class="nx-tool-wrap">
    <div class="nx-tool-grid">${TOOLS.map(([k, i, t, p, d]) => `<article class="nx-tool ${k}">${ico(i, 'tool')}<span class="nx-tool-proj">${p}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
    <figure class="nx-planet">
      <canvas id="nx-planet-canvas" width="320" height="320" aria-label="행성 생성 미리보기"></canvas>
      <figcaption><span class="eyebrow">PLANET RULES</span><h3 id="nx-planet-name">—</h3><p id="nx-planet-meta"></p><button type="button" class="button" id="nx-planet-roll">다른 행성 생성 ↻</button></figcaption>
    </figure>
  </div>
</section>`;
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
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('nx-in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.nx-reveal:not(.nx-in)').forEach(el => reduce ? el.classList.add('nx-in') : io.observe(el));
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
  $('#nx-planet-meta').textContent = `${type.kind} 유형 · 시드 ${Math.round(seed)}. 실제 게임은 유형 규칙 5종과 5% 희귀 변형으로 행성 3,800개를 생성하며, 외부 외형과 내부 타일이 동일한 노이즈를 공유합니다.`;
}



let cleanups = [];
function mount() {
  const main = $('#main'); const page = (location.hash.slice(1) || 'overview').split(/[/?]/)[0];
  document.body.classList.toggle('nx-overview', page === 'overview');
  if (page !== 'overview') { cleanups.forEach(f => f()); cleanups = []; return; }
  if ($('#nx-play', main)) return;
  cleanups.forEach(f => f()); cleanups = [];
  const heading = $('.collection-heading', main), grid = $('.project-grid', main); if (!heading || !grid) return;
  heading.id = 'nx-projects';
  heading.insertAdjacentHTML('beforebegin', intro());
  grid.insertAdjacentHTML('afterend', play() + split() + aiIssues() + verify() + tools());
  if (window.NXAnim) cleanups.push(NXAnim.mount($('#nx-anim-wop'), NXAnim.wopScene()), NXAnim.mount($('#nx-anim-ww'), NXAnim.wmScene()));
  drawPlanet(0); countUp(); reveal();
}

let rolls = 0;
document.addEventListener('click', ev => {
  const top = ev.target.closest('.nx-case-top');
  if (top) { const open = top.getAttribute('aria-expanded') !== 'true'; top.setAttribute('aria-expanded', open); $('#' + top.getAttribute('aria-controls')).hidden = !open; top.closest('.nx-case').classList.toggle('open', open); return; }
  const f = ev.target.closest('[data-nx-case]');
  if (f) { $$('[data-nx-case]').forEach(b => b.setAttribute('aria-pressed', b === f)); $$('.nx-case').forEach(c => c.hidden = !(f.dataset.nxCase === 'all' || c.dataset.tag === f.dataset.nxCase)); return; }
  if (ev.target.closest('#nx-planet-roll')) drawPlanet(++rolls);
});

new MutationObserver(mount).observe($('#main'), { childList: true });
mount();
})();
