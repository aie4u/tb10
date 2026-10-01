# CLAUDE.md

TechByte10 정적 페이지 Repository. GitHub Pages(https://aie4u.github.io/tb10/)로 호스팅하며 GitHub가 Source of Truth다. 기존 서버(52.78.195.223)는 사용하지 않는다.

## 프로젝트 요약

- `index.html` + `assets/css/techbyte10.css` + `assets/js/techbyte10.js`
- 미팅 일정은 `data/sessions.json`에서만 관리하고, JS가 렌더링한다.
- 빌드 없음, package.json 없음. 프레임워크·빌드 도구는 사용자 요청 시에만 도입한다.

## 작업 전 확인

```bash
git status
find . -maxdepth 3 -type f -not -path './.git/*'
```

README.md와 관련 파일을 먼저 읽는다.

## 자주 하는 작업: 일정 추가·수정

- `data/sessions.json`만 수정한다. HTML에 세션을 하드코딩하지 않는다.
- 필수: `date`(YYYY-MM-DD), `tag`, `title`, `speaker` / 선택: `subtitle`, `time`, `link`, `status`
- `subtitle`에 "부제:" 접두어를 넣지 않는다 (렌더링 시 자동 추가).
- `status`는 취소·연기 등 예외에만 쓴다. 기본은 날짜 기준 자동 판정.
- 발표자료는 `presentations/`에 두고 `link`는 `presentations/파일명.html` 상대경로로 건다.
- `presentations/` 파일은 발표 원본 보관용이다. 인라인 CSS/JS 규칙을 적용하지 않고, 요청 없이 수정하지 않는다.
- 수정 후 `node scripts/validate-sessions.mjs`로 검사한다.

## 수정 원칙

- 요구사항 분석 → 관련 파일 확인 → 최소 변경 → `git diff` 확인 → 결과 보고
- 기존 디자인·기능을 유지한다. 디자인 변경은 요청이 있을 때만 한다.
- CSS/JS를 HTML에 인라인으로 넣지 않는다.
- Conventional Commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `ci:`
- 일정 데이터 수정은 main 직접 커밋 가능. 구조·디자인 변경은 `feature/*` 브랜치 → PR

## 금지 (사용자 요청 없이)

- Repository 구조·프레임워크 변경
- `git push --force`, `git reset --hard`, history rewrite
- 계정·키·비밀번호 등 민감정보 커밋
