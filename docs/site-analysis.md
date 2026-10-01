# 기존 사이트 분석 — techbyte10.html

- 분석 대상: `http://52.78.195.223/techbyte10.html`
- 분석일: 2026-10-01
- 원본 크기: 단일 HTML 약 28KB (CSS·JS 모두 인라인)

## 1. 구성 요약

| 항목 | 내용 |
|---|---|
| 유형 | 단일 정적 페이지 (서버 렌더링·API 호출 없음) |
| 빌드 | 없음 |
| 프레임워크 | 없음 (HTML5 + CSS3 + Vanilla JS) |
| 외부 리소스 | Google Fonts (Fraunces, Inter), Lucide 아이콘 (`unpkg.com/lucide@latest`) |
| 이미지 | 없음 (아이콘은 Lucide가 SVG로 런타임 생성) |
| 외부 링크 | Session 4 → `http://52.78.195.223/techbyte10/20260224_4th_presentation.html` |

## 2. HTML 구조

```text
<body>
├── section.hero            # 라벨 / 타이틀 / 소개 문구
├── div.content-section
│   ├── h2.section-title    # 운영 원칙
│   ├── div.principles-list # 3단 카드 (자율적 참여 / 준비 Zero / 실무 중심)
│   ├── div.schedule-divider
│   ├── h2.section-title    # Session Schedule
│   └── div.schedule-list   # div.session-row × 30 (Session 4만 a.session-link로 감쌈)
│       └── session-row
│           ├── .session-date
│           ├── .session-main  (.session-tag, h4, p(부제, 선택), .session-meta)
│           └── .session-indicator (Completed / Upcoming)
└── footer
```

header, nav, modal, iframe, table, form, button 요소는 없습니다.

## 3. CSS

- 인라인 `<style>` 1개, 외부 CSS 프레임워크 없음
- CSS 변수: `--bg-page #F7F2ED`, `--text-primary #1D1916`, `--text-secondary #5C5551`, `--text-meta #8B837E`, `--accent #C66B44`, `--max-width 1100px`
- 폰트: 제목·날짜는 Fraunces(serif), 본문은 Inter
- 레이아웃: grid (원칙 3열, 세션 행 `180px 1fr auto`)
- 반응형: `@media (max-width: 850px)`에서 1열로 전환하고 hero 타이틀은 3.5rem
- 애니메이션: `[data-reveal]` 요소가 fade + translateY(20px)로 나타남, `.session-row:hover`는 opacity 0.7
- 미사용 스타일: `.cta`, `.btn`, `.session-indicator.live` (원본 유지 차원에서 보존)

## 4. JavaScript

- 인라인 `<script>` 1개
  1. `lucide.createIcons()` — `<i data-lucide="user|clock">`를 SVG로 변환
  2. `IntersectionObserver`(threshold 0.1)로 `[data-reveal]` 요소에 `.visible` 클래스 추가
- AJAX/fetch, API 호출, 폼 처리 없음

## 5. 재구성 결정

- 기술 스택: **HTML + CSS + Vanilla JS 유지** (빌드 도구 불필요)
- 변경 사항: 인라인 CSS/JS를 `assets/css/techbyte10.css`, `assets/js/techbyte10.js`로 분리
- 마크업·스타일 값은 원본과 동일 (공백을 제외하고 비교했을 때 body와 CSS 모두 일치 확인)

## 6. 개선 후보 (미적용, 별도 결정 필요)

| 항목 | 내용 |
|---|---|
| Lucide 버전 고정 | `lucide@latest`는 신규 릴리스 시 동작이 바뀔 수 있음. `lucide@<버전>`으로 고정 권장 |
| 세션 데이터 분리 | 세션 30개가 HTML에 반복 하드코딩되어 있음. 세션 추가가 잦으면 JSON + 렌더링 방식 검토 |
| 접근성 | 아이콘 `<i>`에 `aria-hidden`이 없음, Session 4 링크 외 세션은 키보드 포커스 대상이 아님 |
| 절대 URL | Session 4 링크가 IP 절대경로라 도메인이 바뀌면 깨짐. 상대경로 `/techbyte10/...`로 변경 가능 |
| no-cache meta | `http-equiv` 캐시 meta는 대부분 브라우저가 무시함. 서버 헤더로 제어 권장 |
