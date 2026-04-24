class LottoGenerator extends HTMLElement {
    static TEXTS = {
        ko: {
            title: '로또 번호 추첨기',
            btn1: '1게임 추첨',
            btn5: '5게임 추첨',
            gameLabel: (n) => `${n}게임`,
            dark: '🌙 다크 모드',
            light: '☀️ 라이트 모드'
        },
        en: {
            title: 'Power Ball Generator',
            btn1: 'Draw 1 Game',
            btn5: 'Draw 5 Games',
            gameLabel: (n) => `Game ${n}`,
            dark: '🌙 Dark Mode',
            light: '☀️ Light Mode'
        }
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.currentLang = localStorage.getItem('lang') || 'ko';
        this.render();
        this.applyTheme();
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        const t = LottoGenerator.TEXTS[this.currentLang] || LottoGenerator.TEXTS.ko;
        const btn = this.shadowRoot.querySelector('.theme-toggle');
        const container = this.shadowRoot.querySelector('.lotto-container');
        if (btn) btn.textContent = this.isDark ? t.light : t.dark;
        if (container) container.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        this.applyTheme();
    }

    setLang(lang) {
        this.currentLang = lang;
        const t = LottoGenerator.TEXTS[lang] || LottoGenerator.TEXTS.ko;
        const h1 = this.shadowRoot.querySelector('h1');
        const btn1 = this.shadowRoot.querySelector('.gen-btn-1');
        const btn5 = this.shadowRoot.querySelector('.gen-btn-5');
        const themeBtn = this.shadowRoot.querySelector('.theme-toggle');
        if (h1) h1.textContent = t.title;
        if (btn1) btn1.textContent = t.btn1;
        if (btn5) btn5.textContent = t.btn5;
        if (themeBtn) themeBtn.textContent = this.isDark ? t.light : t.dark;
    }

    render() {
        const t = LottoGenerator.TEXTS[this.currentLang] || LottoGenerator.TEXTS.ko;
        this.shadowRoot.innerHTML = `
        <style>
            .lotto-container {
                text-align: center;
                padding: 2rem;
                border-radius: 10px;
                background-color: #f0f0f0;
                box-shadow: 0 4px 8px rgba(0,0,0,.1);
                transition: background-color .3s, color .3s;
            }
            .lotto-container[data-theme=dark] {
                background-color: #16213e;
                box-shadow: 0 4px 8px rgba(0,0,0,.5);
            }
            h1 { color: #333; transition: color .3s; }
            .lotto-container[data-theme=dark] h1 { color: #e0e0e0; }
            .games {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin: 1.5rem 0;
                min-height: 52px;
            }
            .game-row {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
            }
            .game-label {
                font-size: 0.78rem;
                font-weight: 600;
                color: #888;
                width: 48px;
                text-align: right;
                flex-shrink: 0;
            }
            .lotto-container[data-theme=dark] .game-label { color: #aaa; }
            .numbers { display: flex; gap: 7px; }
            .number {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: 700;
                color: #fff;
            }
            .actions {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: .75rem;
            }
            .btn-row {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            button {
                padding: .7rem 1.3rem;
                font-size: 1rem;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                transition: background-color .3s;
            }
            .gen-btn { background-color: #4CAF50; color: #fff; }
            .gen-btn:hover { background-color: #45a049; }
            .theme-toggle {
                background-color: transparent;
                color: #555;
                border: 1px solid #aaa !important;
                font-size: .9rem;
                padding: .4rem 1rem;
            }
            .lotto-container[data-theme=dark] .theme-toggle { color: #bbb; border-color: #555 !important; }
            .theme-toggle:hover { background-color: rgba(0,0,0,.05); }
            .lotto-container[data-theme=dark] .theme-toggle:hover { background-color: rgba(255,255,255,.05); }
        </style>
        <div class="lotto-container">
            <h1>${t.title}</h1>
            <div class="games"></div>
            <div class="actions">
                <div class="btn-row">
                    <button class="gen-btn gen-btn-1">${t.btn1}</button>
                    <button class="gen-btn gen-btn-5">${t.btn5}</button>
                </div>
                <button class="theme-toggle"></button>
            </div>
        </div>`;

        this.shadowRoot.querySelector('.gen-btn-1').addEventListener('click', () => this.generateGames(1));
        this.shadowRoot.querySelector('.gen-btn-5').addEventListener('click', () => this.generateGames(5));
        this.shadowRoot.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    generateGames(count) {
        const t = LottoGenerator.TEXTS[this.currentLang] || LottoGenerator.TEXTS.ko;
        const gamesEl = this.shadowRoot.querySelector('.games');
        gamesEl.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const nums = this.pickNumbers();
            const row = document.createElement('div');
            row.className = 'game-row';
            if (count > 1) {
                const label = document.createElement('span');
                label.className = 'game-label';
                label.textContent = t.gameLabel(i + 1);
                row.appendChild(label);
            }
            const numsDiv = document.createElement('div');
            numsDiv.className = 'numbers';
            nums.forEach(n => {
                const d = document.createElement('div');
                d.className = 'number';
                d.textContent = n;
                d.style.backgroundColor = this.getColor(n);
                numsDiv.appendChild(d);
            });
            row.appendChild(numsDiv);
            gamesEl.appendChild(row);
        }
    }

    pickNumbers() {
        const s = new Set();
        while (s.size < 6) s.add(Math.floor(Math.random() * 45) + 1);
        return Array.from(s).sort((a, b) => a - b);
    }

    getColor(n) {
        return n <= 10 ? '#fbc400' : n <= 20 ? '#69c8f2' : n <= 30 ? '#ff7272' : n <= 40 ? '#aaa' : '#b0d840';
    }
}

customElements.define('lotto-generator', LottoGenerator);

document.addEventListener('langchange', e => {
    const el = document.querySelector('lotto-generator');
    if (el) el.setLang(e.detail.lang);
});
