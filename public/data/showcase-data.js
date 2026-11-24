window.SHOWCASE_DATA = {
  "nav": [
    {
      "id": "nx-intro",
      "label": "소개"
    },
    {
      "id": "nx-projects",
      "label": "프로젝트"
    },
    {
      "id": "nx-play",
      "label": "게임 흐름"
    },
    {
      "id": "nx-split",
      "label": "역할 분담"
    },
    {
      "id": "nx-ai",
      "label": "AI 협업"
    },
    {
      "id": "nx-verify",
      "label": "플레이 개선"
    },
    {
      "id": "nx-tools",
      "label": "제작 도구"
    }
  ],
  "intro": {
    "eyebrow": "LEE WOOHYEON · GAME DESIGN × AI",
    "lines": [
      "규칙을 설계하고,",
      "플레이로 다듬는"
    ],
    "highlight": "이우현입니다.",
    "lead": "",
    "tags": [
      {
        "icon": "compass",
        "text": "시스템·콘텐츠 기획"
      },
      {
        "icon": "code",
        "text": "AI 협업 구현"
      },
      {
        "icon": "gamepad",
        "text": "직접 플레이 검수"
      }
    ]
  },
  "stats": [
    {
      "value": 2,
      "unit": "",
      "label": "개인 제작 게임",
      "note": "World of Plant · Wordless Mage"
    },
    {
      "value": 3800,
      "unit": "",
      "label": "절차 생성 행성",
      "note": "유형 5종 · 희귀 5%"
    },
    {
      "value": 5,
      "unit": "종",
      "label": "마법",
      "note": "슬롯 3칸"
    },
    {
      "value": 4,
      "unit": "종",
      "label": "자체 제작 도구",
      "note": "밸런스 · 레벨 · 프로파일러 · 검수"
    }
  ],
  "play": {
    "eyebrow": "GAME FLOW",
    "title": "게임 흐름",
    "wop": {
      "label": "World of Plant",
      "title": "꽃에서 은하로"
    },
    "ww": {
      "label": "Wordless Mage",
      "title": "로봇의 말로 길 열기"
    }
  },
  "role": {
    "eyebrow": "ROLE",
    "title": "역할 분담",
    "me": {
      "title": "직접",
      "sub": "기획 · 판단 · 수치 폴리싱",
      "items": [
        {
          "icon": "compass",
          "text": "컨셉·핵심 규칙"
        },
        {
          "icon": "map",
          "text": "레벨·콘텐츠 설계"
        },
        {
          "icon": "scale",
          "text": "범위·우선순위 판단"
        },
        {
          "icon": "sliders",
          "text": "수치 폴리싱"
        },
        {
          "icon": "gamepad",
          "text": "플레이 검수"
        },
        {
          "icon": "doc",
          "text": "기획 문서화"
        }
      ]
    },
    "ai": {
      "title": "AI",
      "sub": "기능 구현",
      "items": [
        {
          "icon": "code",
          "text": "기능 구현"
        },
        {
          "icon": "cube",
          "text": "렌더링·셰이더"
        },
        {
          "icon": "gear",
          "text": "시스템 로직"
        },
        {
          "icon": "robot",
          "text": "로봇 동작"
        },
        {
          "icon": "wrench",
          "text": "에디터·툴 제작"
        },
        {
          "icon": "bug",
          "text": "버그 수정"
        }
      ]
    },
    "loop": [
      {
        "icon": "compass",
        "text": "기획",
        "who": "me"
      },
      {
        "icon": "code",
        "text": "AI 구현",
        "who": "ai"
      },
      {
        "icon": "gamepad",
        "text": "플레이 검수",
        "who": "me"
      },
      {
        "icon": "sliders",
        "text": "수치 폴리싱",
        "who": "me"
      }
    ]
  },
  "ai": {
    "eyebrow": "AI COLLABORATION",
    "title": "AI와 일하며 바꾼 방식",
    "items": [
      {
        "tag": "소통",
        "title": "요청 범위를 벗어난 수정 막기",
        "problem": "끊김을 줄여 달라는 요청에 AI가 검사 횟수 제한을 넣었습니다. 프레임은 안정됐지만, 대기 작업이 705건 쌓이는 동안 로봇이 한 대도 출동하지 않았습니다.",
        "solution": "요청서에 **바꿀 것**과 **유지해야 할 규칙**을 나눠 적었습니다. 성능을 고친 뒤에는 **플레이로 핵심 규칙을 다시 확인**하는 단계를 넣었습니다."
      },
      {
        "tag": "소통",
        "title": "같은 빌드의 근거로 판단하게 하기",
        "problem": "끊김 원인을 분석할 때 AI가 다른 프로젝트(Wordless Mage)의 로그를 근거로 삼았습니다.",
        "solution": "게임 안에 **프레임 프로파일러**를 넣어, 해당 빌드에서 0.1초 이상 걸린 구간을 직접 기록해 전달했습니다."
      },
      {
        "tag": "소통",
        "title": "'완료' 보고 대신 파일로 확인하기",
        "problem": "수정 완료로 받은 파일이 실제로는 이전 버전이었고, 한 번은 괄호가 깨진 코드가 반영됐습니다.",
        "solution": "전달할 때마다 새 경로를 쓰고 **해시 값으로 실제 반영 여부를 대조**했습니다. Unity 컴파일 오류는 **원문 그대로** 전달했습니다."
      },
      {
        "tag": "소통",
        "title": "폐기한 기획이 다시 섞이지 않게 하기",
        "problem": "방향을 바꾼 뒤에도 이전 기획 문서와 씬이 남아, AI가 옛 내용을 기준으로 설명하고 빌드도 이전 씬으로 시작했습니다.",
        "solution": "폐기한 문서는 **분리 보관**하고, 빌드 씬 순서는 **에디터 스크립트로 자동 복구**했습니다. 요청 전에는 최신 빌드와 문서를 대조했습니다."
      },
      {
        "tag": "직접 조정",
        "title": "작은 수치는 AI 대신 직접 다루기",
        "problem": "비용·배수·주기나 장치 위치처럼 작은 값을 바꿀 때마다 요청하면, 의도를 설명하는 데 시간이 더 걸렸습니다.",
        "solution": "**밸런스 툴**과 **레벨 에디터**로 빼서 직접 조정하고 바로 플레이했습니다. 구조가 바뀌는 작업만 AI에 맡겼습니다."
      }
    ]
  },
  "cases": {
    "eyebrow": "PROBLEM SOLVING",
    "title": "플레이 불편 개선",
    "projects": [
      {
        "id": "wop",
        "name": "World of Plant",
        "sub": "증분형 경영 · 자동화",
        "items": [
          {
            "title": "초반 업그레이드에서 막히지 않게 하기",
            "problem": "업그레이드 비용이 제련 자원이라, 초반에 원석을 모아도 투자할 곳이 없었습니다.",
            "solution": "비용을 **기본 원석**으로 바꿨습니다. 비용·배수·주기는 **밸런스 툴**에서 직접 맞추며 플레이로 확인했습니다.",
            "images": [
              {
                "src": "assets/media/ac36edcd3b8cbe68-thumb.webp",
                "full": "assets/media/ac36edcd3b8cbe68.png",
                "caption": "업그레이드 트리"
              }
            ]
          },
          {
            "title": "로봇이 가까운 곳부터 짓게 하기",
            "problem": "로봇이 멀리 떨어진 칸을 오가며 지어, 자동화를 맡겨도 건설이 답답하게 느려 보였습니다.",
            "solution": "현재 위치에서 **가까운 칸부터** 짓도록 순서를 바꾸고, **로봇 속도 업그레이드**(레벨당 +25%, 최대 8레벨)를 추가했습니다.",
            "images": [
              {
                "src": "assets/media/0dc65b88dfe883b3-thumb.webp",
                "full": "assets/media/0dc65b88dfe883b3.png",
                "caption": "장치와 로봇이 돌아가는 행성"
              }
            ]
          },
          {
            "title": "파동이 퍼지는 게 보이게 하기",
            "problem": "파동이 두꺼워 화면을 가렸고, 주기를 최대로 올리면 파동이 겹쳐 퍼진다는 느낌이 사라졌습니다.",
            "solution": "파동을 **얇은 선이 점점 흐려지는** 형태로 바꾸고, 최대 주기에서도 **간격이 보이도록** 지속 시간을 주기에 맞춰 줄였습니다.",
            "images": [
              {
                "src": "assets/screenshots/2026-11-24/wop-world.webp",
                "full": "assets/screenshots/2026-11-24/wop-world.webp",
                "caption": "꽃과 장치가 깔린 생산 화면"
              }
            ]
          },
          {
            "title": "행성마다 다르게 보이게 하기",
            "problem": "행성이 모두 비슷한 텍스처라, 은하에서 어디로 갈지 고르는 재미가 없었고 안에 들어가면 겉모습과도 달랐습니다.",
            "solution": "**유형별 생성 규칙 5종**과 **희귀 변형 5%**를 정하고, 겉모습과 내부 타일이 **같은 노이즈**를 쓰게 맞췄습니다.",
            "images": [
              {
                "src": "assets/media/12f902212a8f50bb-thumb.webp",
                "full": "assets/media/12f902212a8f50bb.png",
                "caption": "유형별로 생성된 은하의 행성들"
              }
            ]
          }
        ]
      },
      {
        "id": "ww",
        "name": "Wordless Mage",
        "sub": "마법 조합 · 환경 퍼즐",
        "items": [
          {
            "title": "마법 수를 줄여 퍼즐이 읽히게 하기",
            "problem": "대사에서 자모를 모아 조합하는 방식은 조합 수가 너무 많아, 어떤 마법을 만들어야 하는지 읽기 어려웠습니다.",
            "solution": "효과가 분명한 **마법 5종**과 **슬롯 3칸**으로 줄였습니다. 시간·무게·위치·제거로 역할이 나뉘어, 어떤 마법을 써야 할지 레벨에서 드러납니다.",
            "images": [
              {
                "src": "assets/media/7fa78a6d70078339-thumb.webp",
                "full": "assets/media/7fa78a6d70078339.png",
                "caption": "로봇의 말풍선에서 얻는 마법"
              },
              {
                "src": "assets/media/48d9a3cd08414a2c-thumb.webp",
                "full": "assets/media/48d9a3cd08414a2c.png",
                "caption": "마법 휠과 슬롯"
              }
            ]
          },
          {
            "title": "재도전을 바로 시작할 수 있게 하기",
            "problem": "레벨과 컷신이 이어져 있으면, 다시 도전할 때마다 흐름이 끊깁니다.",
            "solution": "컷신은 **지도에서 따로 볼 수 있게** 분리해, 레벨 플레이와 재도전은 **바로 시작**되게 했습니다.",
            "images": [
              {
                "src": "assets/screenshots/2026-11-24/ww-map.webp",
                "full": "assets/screenshots/2026-11-24/ww-map.webp",
                "caption": "레벨 선택 지도"
              }
            ]
          },
          {
            "title": "기본 진행과 추가 도전 나누기",
            "problem": "다시 들어간 레벨에 이전 시도의 상태가 남으면 처음부터 풀 수 없고, 별 기록까지 지워지면 재도전할 이유가 줄어듭니다.",
            "solution": "재진입 시 **지형·로봇·장치·체력·마법은 초기화**하고 **클리어와 별 기록은 보존**했습니다. 다음 레벨 해금과 **추가 별 도전**을 나눠 목표를 구분했습니다.",
            "images": [
              {
                "src": "assets/screenshots/2026-11-24/ww-result.webp",
                "full": "assets/screenshots/2026-11-24/ww-result.webp",
                "caption": "별 달성과 재도전 화면"
              }
            ]
          }
        ]
      }
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
      {
        "icon": "sliders",
        "project": "World of Plant",
        "title": "밸런스 툴",
        "text": "비용 · 배수 · 주기 실시간 조정"
      },
      {
        "icon": "map",
        "project": "Wordless Mage",
        "title": "레벨 에디터",
        "text": "장치 · 지형 · 로봇 배치"
      },
      {
        "icon": "chart",
        "project": "World of Plant",
        "title": "프레임 프로파일러",
        "text": "100ms 이상 프레임 기록"
      },
      {
        "icon": "check",
        "project": "Wordless Mage",
        "title": "level-review",
        "text": "해금 · 재도전 · 별 조건 자동 점검"
      }
    ],
    "planetLabel": "PLANET RULES",
    "planetNote": "유형 5종 · 희귀 5% · 행성 3,800개",
    "planetButton": "다른 행성 생성 ↻"
  }
};
