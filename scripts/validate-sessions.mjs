// data/sessions.json 형식 검사 (CI에서 실행)
import { readFileSync, existsSync } from 'node:fs';

const FILE = 'data/sessions.json';
const REQUIRED = ['date', 'tag', 'title', 'speaker'];
const OPTIONAL = ['subtitle', 'time', 'link', 'status'];
const STATUSES = ['Completed', 'Upcoming', 'Today', 'Cancelled'];

let sessions;
try {
    sessions = JSON.parse(readFileSync(FILE, 'utf8'));
} catch (e) {
    console.error(`::error file=${FILE}::JSON 파싱 실패 - ${e.message}`);
    process.exit(1);
}

const errors = [];
if (!Array.isArray(sessions)) errors.push('최상위는 배열이어야 합니다.');

(Array.isArray(sessions) ? sessions : []).forEach((s, i) => {
    const at = `#${i + 1} (${s?.title ?? '제목 없음'})`;
    for (const key of REQUIRED) {
        if (typeof s[key] !== 'string' || !s[key].trim()) errors.push(`${at}: '${key}' 필수`);
    }
    for (const key of Object.keys(s)) {
        if (!REQUIRED.includes(key) && !OPTIONAL.includes(key)) errors.push(`${at}: 알 수 없는 항목 '${key}'`);
    }
    if (s.date) {
        const ok = /^\d{4}-\d{2}-\d{2}$/.test(s.date) && !Number.isNaN(Date.parse(s.date))
            && new Date(s.date).toISOString().slice(0, 10) === s.date;
        if (!ok) errors.push(`${at}: date는 YYYY-MM-DD 형식의 실제 날짜여야 함 (${s.date})`);
    }
    if (s.status && !STATUSES.includes(s.status)) errors.push(`${at}: status는 ${STATUSES.join(', ')} 중 하나`);
    if (s.link && !/^(https?:\/\/|presentations\/)/.test(s.link)) errors.push(`${at}: link는 http(s):// 또는 presentations/ 로 시작해야 함`);
    if (s.link?.startsWith('presentations/') && !existsSync(s.link)) errors.push(`${at}: link 파일 없음 (${s.link})`);
});

if (errors.length) {
    errors.forEach(e => console.error(`::error file=${FILE}::${e}`));
    process.exit(1);
}
console.log(`OK - ${sessions.length}개 세션`);
