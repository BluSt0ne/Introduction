# Project Archive · WOP & WW

World of Plant와 Wordless Mage를 소개하는 면접관용 프로젝트 아카이브입니다.

## 화면 구성

World of Plant는 밝은 식물·행성 테마, Wordless Mage는 어두운 황동·마법 테마를 사용합니다. 기본 화면은 두 프로젝트를 고르는 간결한 갤러리입니다.

- 프로젝트별 한 페이지: 컨셉 → 플레이 흐름 → 제작 방식 → 관련 기획서
- 상세 문서: 팝업 열람, 개별 링크, 원본 PPTX / DOCX 다운로드
- 리소스: 실제 기획 문서 이미지와 출처, 사용 문서, 버전·이용 조건
- 변경 기록: 프로젝트별 버전과 추가 / 변경 / 수정 내역
- 기록 관리: 브라우저 로컬 초안, 가져오기, 데이터 파일 내보내기

현재 문서 34개와 중복을 제외한 문서 이미지 14개를 수록했습니다. 게임의 배포 이력이나 개인 담당 범위는 추정해서 넣지 않았습니다. 사이트의 v0.1.0은 아카이브 버전입니다.

## GitHub Pages 배포

배포 저장소: https://github.com/BluSt0ne/Introduction.github.io

1. 저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 선택합니다.
2. main 브랜치에 파일을 올리면 `.github/workflows/pages.yml`이 `public/`을 배포합니다.
3. Actions에서 성공 여부를 확인합니다. 배포 주소는 `https://blust0ne.github.io/Introduction.github.io/`입니다.

프로젝트 저장소이므로 주소에 `Introduction.github.io/` 경로가 포함됩니다. 루트 경로가 바뀌어도 동작하도록 사이트 파일 링크를 상대 경로로 작성했습니다.

워크플로는 GitHub 공식 문서의 Pages 구성을 따릅니다: [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 변경 기록·리소스 추가

1. 사이트의 **기록 관리**를 엽니다.
2. 변경 기록 또는 리소스를 작성해 **초안에 추가**를 누릅니다.
3. **초안 미리보기**에서 내용을 확인합니다. 초안은 현재 브라우저에만 저장됩니다.
4. **데이터 파일 내려받기**로 `site-data.js`를 저장합니다.
5. 저장소 `public/data/site-data.js`를 새 파일로 교체한 후 커밋합니다.
6. 배포가 완료되면 모든 방문자에게 변경 사항이 보입니다.

리소스에 로컬 파일을 연결했다면 해당 파일도 `public/assets/`에 추가합니다. 외부 URL은 전체 주소를 입력할 수 있습니다. 파일을 저장했다고 사이트에 업로드되지는 않으며, 공개 반영은 저장소 커밋을 통해 이뤄집니다.

기존 데이터 파일은 실행하지 않고 JSON 부분만 파싱해 가져옵니다. 초기화는 브라우저의 초안만 되돌리며, 공개 데이터는 변경하지 않습니다.

## 프로젝트 소개 수정

- 프로젝트 한 줄 소개, 썸네일: `public/data/site-data.js`의 `projects`
- 컨셉·플레이 흐름·제작 방식: `public/app.js`의 `BRIEFS`
- 기획 문서와 리소스, 변경 기록: `public/data/site-data.js`
- 레이아웃과 반응형 스타일: `public/styles.css`

기획서 원본은 `public/downloads/`, 문서에 포함된 이미지는 `public/assets/media/`에 있습니다. 리소스의 미기록 항목(출처·이용 조건·버전)은 실제 정보를 확인해 보완합니다. 문서 텍스트는 웹 열람을 위해 추출했으며 원본의 시각적 레이아웃은 다운로드 파일에서 확인합니다.

## 로컬 실행·검증

별도 설치나 빌드가 필요하지 않습니다. Node.js로 실행합니다.

```sh
node scripts/serve.mjs
```

브라우저에서 http://127.0.0.1:4173 을 엽니다. `public/index.html`을 직접 열어 읽는 것도 가능하지만 초안 저장·복사 기능은 HTTP 미리보기를 권장합니다.

```sh
node --check public/app.js
node --check public/editor.js
node scripts/test.mjs
```

Google Fonts가 연결되지 않아도 시스템 폰트로 표시됩니다. 모든 문서·이미지 파일은 저장소에 함께 포함됩니다.
