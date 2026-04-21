const Lang = (() => {
    let cur = localStorage.getItem('lang') || 'ko';

    function apply(lang) {
        cur = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        const t = window.TRANSLATIONS?.[lang];
        if (!t) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key in t) {
                if (el.hasAttribute('data-i18n-html')) el.innerHTML = t[key];
                else el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key in t) el.placeholder = t[key];
        });

        if (t['page-title']) document.title = t['page-title'];

        document.querySelectorAll('.lang-toggle').forEach(btn => {
            btn.textContent = lang === 'ko' ? 'English' : '한국어';
        });

        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang, t } }));
    }

    return {
        apply,
        toggle() { apply(cur === 'ko' ? 'en' : 'ko'); },
        init()   { apply(cur); },
        get()    { return cur; }
    };
})();
