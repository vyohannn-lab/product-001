class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.render();
        this.applyTheme();
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        const btn = this.shadowRoot.querySelector('.theme-toggle');
        if (btn) btn.textContent = this.isDark ? '☀️ 라이트 모드' : '🌙 다크 모드';

        const container = this.shadowRoot.querySelector('.lotto-container');
        if (container) {
            container.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        }
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        this.applyTheme();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .lotto-container {
                    text-align: center;
                    padding: 2rem;
                    border-radius: 10px;
                    background-color: #f0f0f0;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s, color 0.3s;
                }
                .lotto-container[data-theme="dark"] {
                    background-color: #16213e;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                }
                h1 {
                    color: #333;
                    transition: color 0.3s;
                }
                .lotto-container[data-theme="dark"] h1 {
                    color: #e0e0e0;
                }
                .numbers {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin: 2rem 0;
                }
                .number {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white;
                }
                .actions {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }
                button {
                    padding: 0.75rem 2rem;
                    font-size: 1.1rem;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                .generate-btn {
                    background-color: #4CAF50;
                    color: white;
                }
                .generate-btn:hover {
                    background-color: #45a049;
                }
                .theme-toggle {
                    background-color: transparent;
                    color: #555;
                    border: 1px solid #aaa !important;
                    font-size: 0.9rem;
                    padding: 0.4rem 1rem;
                }
                .lotto-container[data-theme="dark"] .theme-toggle {
                    color: #bbb;
                    border-color: #555 !important;
                }
                .theme-toggle:hover {
                    background-color: rgba(0,0,0,0.05);
                }
                .lotto-container[data-theme="dark"] .theme-toggle:hover {
                    background-color: rgba(255,255,255,0.05);
                }
            </style>
            <div class="lotto-container">
                <h1>로또 번호 추첨기</h1>
                <div class="numbers"></div>
                <div class="actions">
                    <button class="generate-btn">번호 생성</button>
                    <button class="theme-toggle"></button>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.generate-btn').addEventListener('click', () => this.generateNumbers());
        this.shadowRoot.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    generateNumbers() {
        const numbersContainer = this.shadowRoot.querySelector('.numbers');
        numbersContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        Array.from(numbers).sort((a, b) => a - b).forEach(number => {
            const circle = document.createElement('div');
            circle.className = 'number';
            circle.textContent = number;
            circle.style.backgroundColor = this.getColor(number);
            numbersContainer.appendChild(circle);
        });
    }

    getColor(number) {
        if (number <= 10) return '#fbc400';
        if (number <= 20) return '#69c8f2';
        if (number <= 30) return '#ff7272';
        if (number <= 40) return '#aaa';
        return '#b0d840';
    }
}

customElements.define('lotto-generator', LottoGenerator);
