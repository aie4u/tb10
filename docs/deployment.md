# 배포 가이드

## 1. 배포 전 서버 확인 (최초 1회)

운영 서버(`52.78.195.223`)에서 아래 명령으로 확인하고 결과를 `docs/server-inventory.md`에 기록합니다. (비밀번호·키·토큰은 기록하지 않습니다.)

```bash
cat /etc/os-release
nginx -v 2>&1; apachectl -v 2>/dev/null
ss -ntlp | grep -E ':(22|80|443)\b'
ps -ef | grep -E 'nginx|httpd' | grep -v grep
# DocumentRoot 확인
grep -R "root\|DocumentRoot" /etc/nginx/ /etc/httpd/ /etc/apache2/ 2>/dev/null | grep -v '#'
# 현재 파일 위치·소유자
ls -la <DocumentRoot>/techbyte10.html <DocumentRoot>/assets 2>&1
getenforce 2>/dev/null
```

확인 포인트:

- DocumentRoot 경로
- DocumentRoot에 `assets/` 디렉터리가 이미 있는지 (있으면 경로 충돌 여부 검토)
- 배포 계정이 DocumentRoot에 쓰기 권한을 갖는지
- SELinux가 Enforcing이면 업로드 파일의 컨텍스트(`httpd_sys_content_t`)

## 2. 배포 계정 / SSH 키

```bash
# 로컬(또는 관리 PC)에서 배포 전용 키 생성
ssh-keygen -t ed25519 -C "github-actions-tb10" -f ./tb10_deploy

# 서버의 배포 계정에 공개키 등록
cat tb10_deploy.pub >> ~<deploy_user>/.ssh/authorized_keys
```

## 3. GitHub 설정

Repository → **Settings → Environments → New environment** 에서 `production` 생성 후:

| 종류 | 이름 | 예시 |
|---|---|---|
| Secret | `DEPLOY_HOST` | 52.78.195.223 |
| Secret | `DEPLOY_PORT` | 22 |
| Secret | `DEPLOY_USER` | deploy |
| Secret | `DEPLOY_PATH` | 서버의 DocumentRoot |
| Secret | `DEPLOY_SSH_KEY` | `tb10_deploy` 개인키 전체 |
| Variable | `HEALTHCHECK_URL` | http://52.78.195.223/techbyte10.html |

## 4. 배포 흐름

```text
feature/* → PR → CI(htmlhint, asset 확인) → main merge
→ Deploy workflow
   ├─ 서버의 현재 버전 백업 (~/tb10-backups/techbyte10_<시각>.tar.gz, 최근 10개 유지)
   ├─ rsync: assets/ (해당 폴더만 --delete), techbyte10.html
   └─ Health check: HTML·CSS·JS 200 응답 + 페이지 문구 확인
```

- 현재는 **수동 실행(Actions → Deploy → Run workflow)만** 가능합니다.
- 1~3단계를 마치고 수동 배포가 성공하면 `deploy.yml`의 `push` 트리거 주석을 해제합니다.
- DocumentRoot에는 다른 페이지(`/techbyte10/` 발표자료 등)도 있으므로 루트 전체에는 `--delete`를 쓰지 않습니다.

## 5. Rollback

### 방법 A — Git으로 되돌리기 (권장)

```bash
git revert <문제 commit>
git push origin main   # 이후 Deploy workflow 실행
```

### 방법 B — 서버 백업으로 즉시 복구

```bash
ls -1t ~/tb10-backups/
cd <DocumentRoot>
tar xzf ~/tb10-backups/techbyte10_<시각>.tar.gz
curl -I http://52.78.195.223/techbyte10.html
```

방법 B로 복구했다면 Git에도 같은 상태를 반영해 Source of Truth를 맞춥니다.

## 6. 향후 개선 (선택)

`releases/<시각>` + `current` 심볼릭 링크 방식으로 바꾸면 무중단 전환과 즉시 롤백이 가능합니다. 단, 웹서버 DocumentRoot 변경이 필요하므로 서버 담당자와 협의한 뒤 진행합니다.
