window.SHOWCASE_DATA = {
  "nav": [
    { "id": "nx-intro", "label": "소개" },
    { "id": "nx-projects", "label": "프로젝트" },
    { "id": "nx-play", "label": "게임 흐름" },
    { "id": "nx-split", "label": "역할 분담" },
    { "id": "nx-ai", "label": "AI 협업 시행착오" },
    { "id": "nx-verify", "label": "문제 해결" },
    { "id": "nx-tools", "label": "제작 도구" }
  ],
  "intro": {
    "eyebrow": "LEE WOOHYEON · GAME DESIGN × AI",
    "lines": ["규칙을 설계하고,", "플레이로 다듬는"],
    "highlight": "이우현입니다.",
    "lead": "",
    "tags": [
      { "icon": "compass", "text": "시스템·콘텐츠 기획" },
      { "icon": "code", "text": "AI 협업 구현" },
      { "icon": "gamepad", "text": "직접 플레이 검수" }
    ]
  },
  "stats": [
    { "value": 2, "unit": "", "label": "개인 제작 게임", "note": "World of Plant · Wordless Mage" },
    { "value": 3800, "unit": "", "label": "절차 생성 행성", "note": "유형 5종 · 희귀 5%" },
    { "value": 5, "unit": "종", "label": "마법", "note": "슬롯 3칸" },
    { "value": 4, "unit": "종", "label": "자체 제작 도구", "note": "밸런스 · 레벨 · 프로파일러 · 검수" }
  ],
  "play": {
    "eyebrow": "GAME FLOW",
    "title": "게임 흐름",
    "wop": { "label": "World of Plant", "title": "꽃에서 은하로" },
    "ww": { "label": "Wordless Mage", "title": "로봇의 말로 길 열기" }
  },
  "role": {
    "eyebrow": "ROLE",
    "title": "역할 분담",
    "me": {
      "title": "직접",
      "sub": "기획 · 판단 · 수치 폴리싱",
      "items": [
        { "icon": "compass", "text": "컨셉·핵심 규칙" },
        { "icon": "map", "text": "레벨·콘텐츠 설계" },
        { "icon": "scale", "text": "범위·우선순위 판단" },
        { "icon": "sliders", "text": "수치 폴리싱" },
        { "icon": "gamepad", "text": "플레이 검수" },
        { "icon": "doc", "text": "기획 문서화" }
      ]
    },
    "ai": {
      "title": "AI",
      "sub": "기능 구현",
      "items": [
        { "icon": "code", "text": "기능 구현" },
        { "icon": "cube", "text": "렌더링·셰이더" },
        { "icon": "gear", "text": "시스템 로직" },
        { "icon": "robot", "text": "로봇 동작" },
        { "icon": "wrench", "text": "에디터·툴 제작" },
        { "icon": "bug", "text": "버그 수정" }
      ]
    },
    "loop": [
      { "icon": "compass", "text": "기획", "who": "me" },
      { "icon": "code", "text": "AI 구현", "who": "ai" },
      { "icon": "gamepad", "text": "플레이 검수", "who": "me" },
      { "icon": "sliders", "text": "수치 폴리싱", "who": "me" }
    ]
  },
  "ai": {
    "eyebrow": "AI COLLABORATION",
    "title": "AI 협업 시행착오",
    "issues": [
      { "icon": "gauge", "tag": "회귀 오류", "title": "성능 개선 후 로봇 정지", "what": "검사 제한 16회 + 재시도 대기 → 대기 705건 · 출동 0", "fix": "행성 순환 배정 · 한도 32 · 실패 시 3초 재시도", "rule": "성능 수정 후 플레이 회귀 테스트" },
      { "icon": "chart", "tag": "잘못된 근거", "title": "다른 프로젝트 로그로 분석", "what": "WM의 Editor.log를 WoP 분석에 사용", "fix": "인게임 프로파일러 → 배정 100~360ms · 저장 280ms", "rule": "해당 빌드 데이터만 근거" },
      { "icon": "sync", "tag": "파일 동기화", "title": "수정본이 구버전으로 회귀", "what": "같은 경로 재사용 → 구버전 덮어씀", "fix": "전달마다 새 경로 · md5 대조", "rule": "보고가 아닌 파일로 확인" },
      { "icon": "scissors", "tag": "수정 범위", "title": "일괄 삭제가 필요한 코드까지 제거", "what": "블록 삭제 범위 오류 → 은하 렌더링 일부 소실", "fix": "사본 복원 · 줄 단위 삭제", "rule": "자동 치환 직후 컴파일" },
      { "icon": "alert", "tag": "검증 누락", "title": "컴파일 오류 · 단위 누락", "what": "배율 계수 누락 · 선언 전 변수 사용", "fix": "오류 원문 전달 · 단계별 컴파일", "rule": "큰 변경은 분할 요청" },
      { "icon": "layers", "tag": "문서 불일치", "title": "폐기한 기획이 빌드에 잔존", "what": "구 기획 씬이 첫 씬 · 구 문서 참조", "fix": "씬 순서 자동 복구 · 구 문서 분리", "rule": "요청 전 빌드·문서 대조" }
    ],
    "rulesTitle": "정리된 협업 원칙",
    "rules": [
      { "icon": "rules", "title": "요청서", "text": "목적 · 조건 · 예외 · 확인" },
      { "icon": "chart", "title": "근거", "text": "해당 빌드의 로그 · 수치" },
      { "icon": "hash", "title": "반영 확인", "text": "실제 파일 · 해시" },
      { "icon": "check", "title": "검증 순서", "text": "컴파일 → 플레이 → 로그" },
      { "icon": "scale", "title": "역할 구분", "text": "구조 = AI · 수치 = 툴" }
    ]
  },
  "cases": {
    "eyebrow": "PROBLEM SOLVING",
    "title": "문제 해결",
    "filters": [
      { "id": "all", "label": "전체" },
      { "id": "wop", "label": "World of Plant" },
      { "id": "ww", "label": "Wordless Mage" },
      { "id": "build", "label": "빌드" }
    ],
    "items": [
      { "tag": "wop", "icon": "gauge", "label": "WoP · 최적화", "title": "행성 증가 → 주기적 프레임 정지", "metric": 360, "unit": "ms", "metricLabel": "개선 전 최대 지연",
        "steps": [ { "k": "현상", "v": "행성 증가 → 수 초마다 정지" }, { "k": "분석", "v": "배정 100~360ms · 저장 280ms" }, { "k": "조치", "v": "검사 예산 · 2초 캐시 · 할당 제거" }, { "k": "결과", "v": "배정 지연 해소 · 저장은 분할 예정" } ] },
      { "tag": "build", "icon": "layers", "label": "WoP · 빌드", "title": "빌드에서만 설치물 미표시", "metric": 0, "unit": "개", "metricLabel": "빌드에 표시된 설치물",
        "steps": [ { "k": "현상", "v": "에디터 정상 · 빌드 미표시" }, { "k": "분석", "v": "로직 정상 → 렌더링 한정" }, { "k": "원인", "v": "인스턴싱 셰이더 제거 · 구 씬 지정" }, { "k": "조치", "v": "변형 유지 · 자동 복구 스크립트" } ] },
      { "tag": "ww", "icon": "magic", "label": "WM · 범위 조정", "title": "자모 조합 → 마법 5종", "metric": 5, "unit": "종", "metricLabel": "최종 마법 · 슬롯 3칸",
        "steps": [ { "k": "초기", "v": "자모 수집 → 조합" }, { "k": "문제", "v": "조합 수만큼 검증 비용 증가" }, { "k": "결정", "v": "마법 5종 · 슬롯 3칸" }, { "k": "효과", "v": "시간 · 무게 · 위치 · 제거 역할 분리" } ] },
      { "tag": "ww", "icon": "eye", "label": "WM · 판정", "title": "조준선 ≠ 실제 적용 위치", "metric": 3, "unit": "곳", "metricLabel": "공통 판정 적용",
        "steps": [ { "k": "기준", "v": "조준선 = 실제 결과" }, { "k": "조치", "v": "대상 · 조준선 · 투사체 공통 판정" }, { "k": "예외", "v": "트리거 제외 · 컨베이어 별도 조준점" } ] },
      { "tag": "wop", "icon": "robot", "label": "WoP · 플레이 피드백", "title": "로봇 시공 동선 비효율", "metric": 25, "unit": "%", "metricLabel": "속도 업그레이드 / Lv",
        "steps": [ { "k": "현상", "v": "원거리 왕복 시공" }, { "k": "조치", "v": "최근접 순서 · 속도 +25%/Lv" }, { "k": "연계", "v": "업그레이드 재화 → 기본 원석" } ] }
    ]
  },
  "tools": {
    "eyebrow": "TOOLS",
    "title": "제작 도구",
    "route": {
      "start": "수정 필요",
      "question": "구조 변경?",
      "yes": "AI 요청",
      "yesNote": "목적 · 조건 · 예외 · 확인",
      "no": "툴 직접 조정",
      "noNote": "수치 · 배치 · 주기",
      "end": "플레이 검증"
    },
    "items": [
      { "icon": "sliders", "project": "World of Plant", "title": "밸런스 툴", "text": "비용 · 배수 · 주기 실시간 조정" },
      { "icon": "map", "project": "Wordless Mage", "title": "레벨 에디터", "text": "장치 · 지형 · 로봇 배치" },
      { "icon": "chart", "project": "World of Plant", "title": "프레임 프로파일러", "text": "100ms 이상 프레임 기록" },
      { "icon": "check", "project": "Wordless Mage", "title": "level-review", "text": "해금 · 재도전 · 별 조건 자동 점검" }
    ],
    "planetLabel": "PLANET RULES",
    "planetNote": "유형 5종 · 희귀 5% · 행성 3,800개",
    "planetButton": "다른 행성 생성 ↻"
  }
};
