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
    },
    {
      "id": "nx-archive",
      "label": "이전 프로젝트"
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
  },
  "archive": {
    "eyebrow": "EARLIER WORK",
    "title": "이전 프로젝트",
    "more": "자세히 보기",
    "items": [
      {
        "id": "galactica-pc",
        "title": "Galactica PC",
        "period": "2026.10 – 현재",
        "genre": "싱글플레이 턴제 우주 전략",
        "team": "1인 개발 · AI 활용",
        "platform": "PC · Unity 6",
        "summary": "공개 맵에서 행성을 확장하고 AI와 교전하는 턴제 우주 전략. 함선 부위 조준과 피해 예측, 8개 작전 캠페인.",
        "cover": "assets/archive/galactica-pc-cover.webp",
        "videos": [],
        "points": [
          {
            "title": "세 가지 승리 전략",
            "text": "300Cr 확보 · 보물 3개 전달 · 적 전멸 또는 본성 점령"
          },
          {
            "title": "생산과 함대 운용",
            "text": "아군 행성당 생산 1슬롯, 다음 자기 턴에 완성 · 기본 8척 운용"
          },
          {
            "title": "공개 맵과 점령",
            "text": "8·12·16 공개 맵 · 중립 행성 주둔 1회, 적 행성 2회 갱신 후 점령"
          },
          {
            "title": "교전과 후퇴의 대가",
            "text": "같은 칸 도착 시 교전 · 일반 후퇴에 기회공격 1회"
          },
          {
            "title": "역할별 생산 비용",
            "text": "기본 45 · 모함 70 · 전투기 65 · 탐사선 50 · 호위함 75Cr"
          }
        ],
        "images": [
          {
            "src": "assets/archive/galactica-pc-cover.webp",
            "caption": "공개 맵과 함대"
          },
          {
            "src": "assets/archive/galactica-pc-1.webp",
            "caption": "부위 조준과 예상 피해"
          }
        ]
      },
      {
        "id": "triple",
        "title": "Triple Showdown",
        "period": "2025.05 – 2026",
        "genre": "로그라이크 덱 빌딩",
        "team": "1인 개발",
        "platform": "Unity",
        "summary": "카드 배치 순서와 주사위 배분이 공격·방어 결과를 바꾸는 로그라이크 전투.",
        "cover": "assets/archive/triple-cover.webp",
        "videos": [],
        "points": [
          {
            "title": "카드 3장으로 한 턴",
            "text": "배치 순서와 효과 연결로 적은 손패에서도 여러 조합"
          },
          {
            "title": "주사위 소켓 배분",
            "text": "카드별 소켓 1~3칸 · 높은 눈을 어디에 쓸지 선택"
          },
          {
            "title": "증폭 카드는 단계형",
            "text": "주사위 합계 4 / 8 / 12 이상 → +1 / +2 / +3"
          },
          {
            "title": "성장과 전투 템포",
            "text": "주사위 기본 3개 → 유물로 최대 9개"
          },
          {
            "title": "적 스킬 예고",
            "text": "방어 · 디버프 · 선제 처치 중 대응 선택"
          }
        ],
        "images": [
          {
            "src": "assets/archive/triple-1.webp",
            "caption": "카드 배치와 주사위 소켓"
          },
          {
            "src": "assets/archive/triple-2.webp",
            "caption": "경로 선택"
          },
          {
            "src": "assets/archive/triple-3.webp",
            "caption": "전투 중 선택 화면"
          }
        ]
      },
      {
        "id": "lone-lantern",
        "title": "Lone Lantern",
        "period": "2024.04 – 2024.11",
        "genre": "2D 퍼즐 어드벤처 RPG",
        "team": "5인 · 기획 / 팀장",
        "platform": "Unity",
        "summary": "시야와 연결된 '밝기'를 소모 자원으로 써서 기믹을 푸는 퍼즐 어드벤처 RPG.",
        "cover": "assets/archive/lone-lantern-cover.webp",
        "videos": [],
        "points": [
          {
            "title": "행동으로 배우는 튜토리얼",
            "text": "화톳불 점화 → 시야 확장 · 광원이 이롭다는 규칙을 직접 확인"
          },
          {
            "title": "목적지 선공개",
            "text": "절벽 너머 핵심 오브젝트를 먼저 보여 지시 없이 경로 추론"
          },
          {
            "title": "팀 작업 기준 유지",
            "text": "Google Drive로 기획·코드·아트 자료 분류 · 회의록과 결정 사항 아카이빙"
          }
        ],
        "images": [
          {
            "src": "assets/archive/lone-lantern-1.webp",
            "caption": "인게임 화면"
          },
          {
            "src": "assets/archive/lone-lantern-2.webp",
            "caption": "튜토리얼 동선 설계"
          }
        ]
      },
      {
        "id": "hook",
        "title": "Hook Adventure",
        "period": "2021.11 – 2021.12",
        "genre": "3D 필드 탐색 플랫포머",
        "team": "2인 · 기획 / 프로그래밍",
        "platform": "Unity",
        "summary": "훅샷 액션으로 3D 공간을 탐험하며 퀘스트를 수행. 1지역 레벨과 플레이어·포탈·이벤트·카메라 설계.",
        "cover": "assets/archive/hook-cover.webp",
        "videos": [],
        "points": [
          {
            "title": "단계별 조작 학습",
            "text": "1-1 점프·2단 점프 → 1-2 훅샷 → 1-3 상승 용암 → 1-4 불꽃 구체"
          },
          {
            "title": "미니맵 추가",
            "text": "테스트에서 리스폰 후 남은 마나 구슬 위치 파악이 어려워 탐색 부담을 줄임"
          }
        ],
        "images": [
          {
            "src": "assets/archive/hook-1.webp",
            "caption": "퀘스트 안내"
          },
          {
            "src": "assets/archive/hook-2.webp",
            "caption": "1지역 레벨 구성"
          }
        ]
      },
      {
        "id": "galactica-board",
        "title": "Galactica Board Game",
        "period": "2021.03 – 2021.06",
        "genre": "2:2 팀 전략 보드게임",
        "team": "4인 팀",
        "platform": "Tabletop Simulator",
        "summary": "함선·함장 카드를 조합해 300Cr 축적 또는 보물 3개 운송으로 승리하는 2:2 우주 전략 보드게임.",
        "cover": "assets/archive/galactica-board-cover.webp",
        "videos": [
          {
            "url": "https://youtu.be/cZERSXZhfTY",
            "label": "플레이 영상 1"
          },
          {
            "url": "https://youtu.be/-53CEQUkygg",
            "label": "플레이 영상 2"
          }
        ],
        "points": [
          {
            "title": "승리 방식 분리",
            "text": "재화 축적과 보물 운송 · 자원 확보와 중앙 교전 사이의 선택"
          },
          {
            "title": "구매와 배치의 시차",
            "text": "구매한 전력은 다음 턴에 배치 · 다음 턴 위치까지 고려"
          },
          {
            "title": "보물 운송의 위험",
            "text": "운반 중 이동 제한 · 귀환 경로를 두고 추격과 호위"
          },
          {
            "title": "실질 생존력 밸런싱",
            "text": "체력 ÷ (1 − 회피율) · 모선 23.0 · 전투함 21.6 · 호위함 22.5"
          },
          {
            "title": "공개 정보와 카드 추첨",
            "text": "배치·버린 카드로 남은 카드 확률 추정"
          }
        ],
        "images": [
          {
            "src": "assets/archive/galactica-board-1.webp",
            "caption": "Tabletop Simulator 플레이"
          }
        ]
      },
      {
        "id": "defair",
        "title": "Defair",
        "period": "2019.03 – 2019.11",
        "genre": "2D 횡스크롤 러닝 액션",
        "team": "6인 · 기획 / 팀장 · 넷마블 게임 아카데미 4기",
        "platform": "Unity",
        "summary": "적 배치를 채보처럼 익히고, 색상별 대응으로 퍼펙트를 노리는 러닝 액션.",
        "cover": "assets/archive/defair-cover.webp",
        "videos": [
          {
            "url": "https://www.youtube.com/watch?v=LXx7EADXEOQ",
            "label": "플레이 영상"
          }
        ],
        "points": [
          {
            "title": "모바일 조작 단순화",
            "text": "탭과 좌우 스와이프로 입력 제한 · 달리는 흐름 유지"
          },
          {
            "title": "색상으로 공격 구분",
            "text": "적 색상과 스와이프 방향을 1:1 연결"
          },
          {
            "title": "플레이테스트 난이도 조정",
            "text": "라인과 공격 유형 수를 조절해 부담 완화"
          },
          {
            "title": "Speed Up 구간",
            "text": "2배속 구간 · 자체 테스트 클리어율 80% 이상까지 조정"
          },
          {
            "title": "채보 관리",
            "text": "Google Sheets로 적 배치와 타이밍 공유"
          }
        ],
        "images": [
          {
            "src": "assets/archive/defair-1.webp",
            "caption": "색상별 적 배치"
          },
          {
            "src": "assets/archive/defair-2.webp",
            "caption": "Speed Up 구간"
          }
        ]
      }
    ]
  }
};
