# CLAUDE.md

TechByte10 정적 페이지 Repository. GitHub가 Source of Truth이며, 운영 서버 파일을 직접 수정하지 않는다.

## 프로젝트 요약

- 단일 정적 페이지: `techbyte10.html` + `assets/css/techbyte10.css` + `assets/js/techbyte10.js`
- 빌드 없음, package.json 없음 (프레임워크·빌드 도구 도입 금지, 사용자 요청 시에만)
- 원본 분석: `docs/site-analysis.md`, 배포: `docs/deployment.md`

## 작업 전 확인

```bash
git status
find . -maxdepth 3 -type f -not -path './.git/*'
```

README.md와 관련 HTML/CSS/JS를 먼저 읽는다.

## 수정 원칙

- 요구사항 분석 → 관련 파일 확인 → 최소 변경 → `git diff` 확인 → 결과 보고
- 기존 디자인·기능을 유지한다. 디자인 변경은 요청이 있을 때만 한다.
- CSS/JS를 HTML 안에 다시 인라인으로 넣지 않는다.
- 세션 추가는 `.schedule-list`에 `session-row` 블록을 추가하는 방식으로 한다 (README "세션 추가 방법").
- Conventional Commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `ci:`
- main에 직접 대규모 작업하지 않는다. `feature/*`, `fix/*` 브랜치 → PR

## 검증

- 빌드·테스트 스크립트 없음. CI(`ci.yml`)가 htmlhint와 asset 경로를 검사한다.
- 로컬 확인이 필요하면 실행할 명령을 제시만 한다: `python3 -m http.server 8080`

## 금지 (사용자 요청 없이)

- Repository 구조·프레임워크 변경
- 운영 서버 설정(nginx/httpd) 변경, 서버 파일 직접 수정·삭제
- `git push --force`, `git reset --hard`, history rewrite
- 서버 IP 외 계정·키·비밀번호 등 민감정보 커밋
- `deploy.yml`에서 DocumentRoot 전체에 `rsync --delete` 적용 (다른 페이지가 함께 있음)
