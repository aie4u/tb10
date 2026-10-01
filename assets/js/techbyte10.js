// Tech Byte 10 — 세션 일정 렌더링
// 일정 데이터는 data/sessions.json 에서 관리한다.

const SESSIONS_URL = 'data/sessions.json';
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 스크롤 등장 애니메이션
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

function observeReveal(root) {
    root.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
function todayKST() {
    return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// "2026-02-05" → "02. 05 (목)"
function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
    return `${String(m).padStart(2, '0')}. ${String(d).padStart(2, '0')} (${weekday})`;
}

// status 값이 있으면 그대로, 없으면 날짜로 자동 판단
function resolveStatus(session, today) {
    if (session.status) return session.status;
    if (session.date < today) return 'Completed';
    if (session.date === today) return 'Today';
    return 'Upcoming';
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function metaItem(icon, text) {
    const span = el('span');
    const i = document.createElement('i');
    i.setAttribute('data-lucide', icon);
    i.setAttribute('size', '14');
    span.append(i, ` ${text}`);
    return span;
}

// OneDrive 세션 폴더(녹화·회의록) 링크
function folderLink(url) {
    const a = el('a', 'session-folder');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', '세션 자료 폴더 열기 (새 창)');
    const i = document.createElement('i');
    i.setAttribute('data-lucide', 'folder-open');
    i.setAttribute('size', '14');
    a.append(i, ' 자료');
    // 발표자료 링크(session-link)로 감싼 행 안에서도 폴더 링크만 열리도록
    a.addEventListener('click', e => e.stopPropagation());
    return a;
}

function renderSession(session, today) {
    const row = el('div', 'session-row');
    row.setAttribute('data-reveal', '');

    row.append(el('div', 'session-date', formatDate(session.date)));

    const main = el('div', 'session-main');
    main.append(el('span', 'session-tag', session.tag));
    main.append(el('h4', null, session.title));
    if (session.subtitle) {
        main.append(el('p', null, `부제: ${session.subtitle}`));
    }
    const meta = el('div', 'session-meta');
    meta.append(metaItem('user', session.speaker));
    if (session.time) meta.append(metaItem('clock', session.time));
    if (session.folder) meta.append(folderLink(session.folder));
    main.append(meta);
    row.append(main);

    const status = resolveStatus(session, today);
    const indicator = el('div', 'session-indicator', status);
    indicator.classList.add(`is-${status.toLowerCase()}`);
    if (status === 'Today') indicator.classList.add('live');
    row.append(indicator);

    if (session.link) {
        const a = el('a', 'session-link');
        a.href = session.link;
        a.append(row);
        return a;
    }
    return row;
}

async function renderSchedule() {
    const list = document.getElementById('schedule-list');
    try {
        const res = await fetch(SESSIONS_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const sessions = await res.json();
        const today = todayKST();

        sessions
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .forEach(s => list.append(renderSession(s, today)));
    } catch (err) {
        console.error('[TechByte10] 일정 로드 실패:', err);
        list.append(el('p', 'schedule-error', '일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'));
    }

    lucide.createIcons();
    observeReveal(list);
}

observeReveal(document);
renderSchedule();
