# TechByte10

## Overview

Metanet DL E4U의 사내 지식 공유 세션 **Tech Byte 10** 소개·일정 페이지입니다.
기존 `http://52.78.195.223/techbyte10.html`의 화면과 콘텐츠를 그대로 옮겨 **GitHub Pages**로 호스팅합니다. 기존 서버는 사용하지 않습니다.

- 사이트: https://aie4u.github.io/tb10/
- 미팅 일정: [`data/sessions.json`](data/sessions.json) 파일 하나만 수정하면 반영됩니다.

## 미팅 일정 업데이트 방법

### GitHub 웹에서 (가장 간단)

1. Repository에서 `data/sessions.json` 열기 → 연필(✏️) 아이콘 클릭
2. 배열 맨 끝에 세션 추가 (앞 항목 뒤에 쉼표 `,` 필수)
3. **Commit changes** → 1~2분 뒤 사이트 반영 (Actions 탭에서 진행 상황 확인)

### 세션 항목 형식

```json
{
  "date": "2026-10-20",
  "tag": "AI Coding",
  "title": "세션 제목",
  "subtitle": "부제 (없으면 이 줄 삭제)",
  "speaker": "홍길동 대리"
}
```

| 항목 | 필수 | 설명 |
|---|---|---|
| `date` | ✅ | `YYYY-MM-DD`. 화면에는 `10. 20 (화)`처럼 요일까지 자동 표시 |
| `tag` | ✅ | 제목 위 주황색 분류 라벨 |
| `title` | ✅ | 세션 제목 |
| `speaker` | ✅ | 발표자 + 직급 |
| `subtitle` |  | 부제. 화면에 `부제: ...`로 표시 |
| `time` |  | 시간 (예: `12:50 - 13:00`) |
| `link` |  | 클릭 시 이동할 발표자료. 외부 URL 또는 `presentations/파일명.html` |
| `folder` |  | OneDrive 세션 폴더(녹화·회의록) 링크. 발표자 옆에 📁 자료로 표시 |
| `status` |  | 상태 강제 지정: `Completed` / `Upcoming` / `Today` / `Cancelled` |

- **상태(Completed/Upcoming)는 날짜로 자동 표시**됩니다 (한국 시간 기준 지난 날짜 → Completed, 당일 → Today, 이후 → Upcoming). 일정이 취소되거나 연기된 경우만 `status`를 직접 넣으세요.
- 순서는 날짜순으로 자동 정렬되므로 파일 내 위치는 상관없습니다.
- 세션 폴더 링크: OneDrive에서 세션 폴더 열기 → 주소창 URL(또는 "링크 복사")을 `folder`에 넣습니다. 회사 계정 로그인 후 열립니다.
- 발표자료 HTML이 있으면 `presentations/`에 올리고 `link`에 `presentations/파일명.html`을 넣습니다.
- 형식이 잘못되면 배포 단계에서 검사가 실패하고, 기존 사이트는 그대로 유지됩니다.

## Architecture

```text
data/sessions.json 수정 → main push
→ GitHub Actions (JSON 검사 · HTML lint → GitHub Pages 배포 → Health check)
→ https://aie4u.github.io/tb10/
```

- HTML5 + CSS3 + Vanilla JS, 빌드 도구 없음
- 외부 리소스: Google Fonts(Fraunces, Inter), Lucide 아이콘(unpkg CDN)
- 원본 분석: [docs/site-analysis.md](docs/site-analysis.md)

## Local Development

`fetch`로 JSON을 읽기 때문에 파일을 직접 열면(file://) 일정이 보이지 않습니다. 간단한 로컬 서버로 확인하세요.

```bash
git clone https://github.com/aie4u/tb10.git
cd tb10
python3 -m http.server 8080        # http://localhost:8080
node scripts/validate-sessions.mjs # 일정 데이터 형식 검사
```

## GitHub Pages 최초 설정 (1회)

Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions** 선택

## GitHub Actions

| Workflow | 트리거 | 내용 |
|---|---|---|
| `ci.yml` | Pull Request | sessions.json 검사, HTML lint |
| `pages.yml` | main push, 수동 | 검사 → Pages 배포 → Health check |

## Rollback

```bash
git revert <문제 commit>
git push origin main
```

또는 GitHub 웹에서 이전 버전의 `data/sessions.json` 내용을 붙여넣어 커밋합니다.

## Directory Structure

```text
tb10/
├── .github/workflows/
│   ├── ci.yml
│   └── pages.yml
├── assets/
│   ├── css/techbyte10.css
│   └── js/techbyte10.js      # sessions.json 읽어 일정 렌더링
├── data/
│   └── sessions.json         # ← 미팅 일정
├── docs/site-analysis.md
├── presentations/            # 세션 발표자료 (원본 그대로 보관)
├── scripts/validate-sessions.mjs
├── index.html
├── CLAUDE.md
└── README.md
```

## Troubleshooting

| 증상 | 확인 |
|---|---|
| "일정을 불러오지 못했습니다" | `data/sessions.json` JSON 문법(쉼표, 따옴표), Actions 실패 여부 |
| 수정했는데 반영 안 됨 | Actions 탭에서 `Deploy to GitHub Pages` 실패 여부, 브라우저 강력 새로고침 |
| 아이콘이 안 보임 | unpkg CDN 접근 가능 여부 |
| 404 | Settings → Pages Source가 GitHub Actions인지 확인 |
