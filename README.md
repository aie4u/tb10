# TechByte10

## Overview

Metanet DL E4U의 사내 지식 공유 세션 **Tech Byte 10** 소개·일정 페이지입니다.
운영 중인 `http://52.78.195.223/techbyte10.html`을 Git 기반으로 옮긴 것으로, 화면과 동작은 원본과 동일합니다.

## Architecture

- 단일 정적 페이지 (HTML5 + CSS3 + Vanilla JS), 빌드 단계 없음
- 외부 리소스: Google Fonts(Fraunces, Inter), Lucide 아이콘(unpkg CDN)
- 상세 분석: [docs/site-analysis.md](docs/site-analysis.md)

```text
GitHub (main) → GitHub Actions (CI → Deploy) → rsync/SSH → 52.78.195.223 웹서버
```

## Requirements

- 최신 브라우저
- (선택) 로컬 미리보기용 Python 3 또는 Node.js

## Local Development

```bash
git clone https://github.com/aie4u/tb10.git
cd tb10
python3 -m http.server 8080
# http://localhost:8080/techbyte10.html
```

`techbyte10.html`을 브라우저로 바로 열어도 동작합니다.

## Build

빌드 과정이 없습니다. Repository 파일이 그대로 배포됩니다.

## Deployment

[docs/deployment.md](docs/deployment.md) 참고. 요약:

1. 서버 DocumentRoot·배포 계정 확인
2. GitHub `production` Environment에 Secrets 등록
3. Actions → **Deploy** → Run workflow

## GitHub Actions

| Workflow | 트리거 | 내용 |
|---|---|---|
| `ci.yml` | PR, main push | htmlhint 검사, 로컬 asset 참조 확인 |
| `deploy.yml` | 수동 실행 (서버 확인 후 main push로 전환) | 서버 백업 → rsync → Health check |

## Environment Variables

| 이름 | 종류 | 설명 |
|---|---|---|
| `DEPLOY_HOST` | Secret | 운영 서버 주소 |
| `DEPLOY_PORT` | Secret | SSH 포트 |
| `DEPLOY_USER` | Secret | 배포 계정 |
| `DEPLOY_PATH` | Secret | 웹서버 DocumentRoot |
| `DEPLOY_SSH_KEY` | Secret | 배포용 SSH 개인키 |
| `HEALTHCHECK_URL` | Variable | 배포 후 확인할 URL |

민감정보는 Repository에 커밋하지 않습니다.

## Directory Structure

```text
tb10/
├── .github/workflows/
│   ├── ci.yml
│   └── deploy.yml
├── assets/
│   ├── css/techbyte10.css
│   └── js/techbyte10.js
├── docs/
│   ├── deployment.md
│   └── site-analysis.md
├── techbyte10.html
├── CLAUDE.md
└── README.md
```

## 세션 추가 방법

`techbyte10.html`의 `.schedule-list` 마지막에 `session-row` 블록을 복사해 추가하고, 지난 세션의 `session-indicator`를 `Completed`로 바꿉니다.

```html
<!-- Session N -->
<div class="session-row" data-reveal>
    <div class="session-date">MM. DD (요일)</div>
    <div class="session-main">
        <span class="session-tag">Tag</span>
        <h4>제목</h4>
        <p>부제: ...</p>
        <div class="session-meta">
            <span><i data-lucide="user" size="14"></i> 발표자 직급</span>
        </div>
    </div>
    <div class="session-indicator">Upcoming</div>
</div>
```

## Troubleshooting

| 증상 | 확인 |
|---|---|
| 아이콘이 안 보임 | unpkg CDN 접근 가능 여부, `lucide@latest` 버전 변경 여부 |
| 콘텐츠가 보이지 않음 | JS 로드 실패 시 `[data-reveal]` 요소가 opacity 0으로 남음. `assets/js` 경로 확인 |
| 배포 후 CSS 미적용 | 서버 `assets/` 경로 권한·SELinux 컨텍스트 확인 |
| Deploy 실패 | Secrets 값, 서버의 `authorized_keys`, 방화벽(SSH 포트) 확인 |
