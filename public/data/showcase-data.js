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
      "label": "설계 인사이트"
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
    "eyebrow": "DESIGN INSIGHT",
    "title": "설계 인사이트",
    "projects": [
      {
        "id": "wop",
        "name": "World of Plant",
        "sub": "증분형 경영 · 자동화",
        "items": [
          {
            "title": "자동화를 새 규칙이 아닌 '내 행동의 복제'로",
            "problem": "증분형 게임은 자동화 단계마다 새 규칙이 붙으면서, 손으로 하던 플레이와 자동화가 따로 놀기 쉽습니다. 자동화가 열리는 순간 플레이어가 배운 것이 쓸모없어집니다.",
            "solution": "장치가 **커서와 같은 파동·생산 규칙**을 쓰게 했습니다. 손으로 꽃을 깨우던 행동이 그대로 장치의 동작이 되므로, 자동화를 따로 가르치지 않아도 **이미 아는 규칙의 확장**으로 읽힙니다.",
            "images": [
              {
                "src": "assets/screenshots/2026-11-24/wop-world.webp",
                "full": "assets/screenshots/2026-11-24/wop-world.webp",
                "caption": "커서와 같은 파동을 내는 장치"
              }
            ]
          },
          {
            "title": "성장을 숫자보다 공간으로 느끼게",
            "problem": "방치형의 성장은 숫자가 커지는 것만으로는 체감이 약하고, 수치가 커질수록 차이를 읽기 어려워집니다.",
            "solution": "업그레이드를 **사거리와 주기**로 나눴습니다. 성장이 '파동이 닿는 범위'와 '퍼지는 빈도'로 화면에 드러나, 숫자를 읽지 않아도 **넓어지고 빨라지는 것**이 보입니다.",
            "images": [
              {
                "src": "assets/media/ac36edcd3b8cbe68-thumb.webp",
                "full": "assets/media/ac36edcd3b8cbe68.png",
                "caption": "사거리·주기로 나뉜 업그레이드"
              }
            ]
          },
          {
            "title": "설계와 시공을 분리해 실험을 부담 없게",
            "problem": "행성이 늘면 같은 배치를 반복해 놓는 작업이 지루해지고, 배치를 고치는 동안 생산이 멈추면 플레이어는 새 배치를 시도하지 않습니다.",
            "solution": "블루프린트를 **원본과 작업 사본**으로 나눴습니다. 설계를 고쳐도 진행 중인 시공은 그대로 이어지고, 완성한 배치는 로켓으로 보내 **다른 행성에 그대로 복제**합니다.",
            "images": [
              {
                "src": "assets/media/0dc65b88dfe883b3-thumb.webp",
                "full": "assets/media/0dc65b88dfe883b3.png",
                "caption": "배치를 저장하고 옮기는 행성"
              }
            ]
          },
          {
            "title": "은하에서 본 모습이 곧 약속이 되게",
            "problem": "행성을 고를 때 본 겉모습과 들어간 뒤의 지형이 다르면, 행성을 고르는 판단이 의미를 잃습니다.",
            "solution": "행성 **유형별 생성 규칙 5종**과 **희귀 변형 5%**를 정하고, 겉모습과 내부 타일이 **같은 노이즈**를 쓰게 맞췄습니다. 은하에서 본 그대로의 행성에 내립니다.",
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
            "title": "마법을 얻는 과정 자체를 퍼즐로",
            "problem": "마법을 레벨 시작에 쥐여 주면, 퍼즐은 '어디에 쓸까' 한 단계만 남습니다.",
            "solution": "마법은 **로봇의 대사**에서 얻습니다. 어떤 로봇이 어떤 말을 하게 만들지 **관찰하고 유도하는 과정**이 퍼즐의 앞 단계가 되어, 획득 → 조합 → 해결로 이어집니다.",
            "images": [
              {
                "src": "assets/media/7fa78a6d70078339-thumb.webp",
                "full": "assets/media/7fa78a6d70078339.png",
                "caption": "로봇의 말풍선에서 얻는 마법"
              }
            ]
          },
          {
            "title": "적은 마법으로 깊이 만들기",
            "problem": "마법 종류를 늘리면 무엇을 써야 할지 읽기 어렵고, 줄이면 해법이 단조로워집니다.",
            "solution": "마법은 **5종**으로 줄이고, 대신 **대상마다 정지·운반·가연 여부와 무게**를 정의했습니다. 같은 마법도 대상에 따라 다르게 작동해, 적은 마법으로도 조합할 이유가 생깁니다.",
            "images": [
              {
                "src": "assets/media/48d9a3cd08414a2c-thumb.webp",
                "full": "assets/media/48d9a3cd08414a2c.png",
                "caption": "마법 휠과 슬롯"
              },
              {
                "src": "assets/media/51d1b8617e53e536-thumb.webp",
                "full": "assets/media/51d1b8617e53e536.png",
                "caption": "거대 팬에 거는 정지 마법"
              }
            ]
          },
          {
            "title": "클리어와 도전을 다른 목표로",
            "problem": "모든 플레이어에게 같은 목표만 주면, 퍼즐을 빨리 넘기고 싶은 사람과 완벽히 풀고 싶은 사람 중 한쪽은 지루해집니다.",
            "solution": "**클리어는 다음 레벨 해금**으로, **별은 추가 도전**으로 나눴습니다. 재진입하면 레벨 상태는 초기화하고 **클리어·별 기록은 보존**해 언제든 다시 도전할 수 있습니다.",
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
