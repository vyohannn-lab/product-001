class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
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
                }
                h1 {
                    color: #333;
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
                button {
                    padding: 1rem 2rem;
                    font-size: 1.2rem;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    background-color: #4CAF50;
                    color: white;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #45a049;
                }
            </style>
            <div class="lotto-container">
                <h1>로또 번호 추첨기</h1>
                <div class="numbers"></div>
                <button>번호 생성</button>
            </div>
        `;

        this.shadowRoot.querySelector('button').addEventListener('click', () => this.generateNumbers());
    }

    generateNumbers() {
        const numbersContainer = this.shadowRoot.querySelector('.numbers');
        numbersContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach(number => {
            const circle = document.createElement('div');
            circle.className = 'number';
            circle.textContent = number;
            circle.style.backgroundColor = this.getColor(number);
            numbersContainer.appendChild(circle);
        });
    }

    getColor(number) {
        if (number <= 10) return '#fbc400'; // 노란색
        if (number <= 20) return '#69c8f2'; // 파란색
        if (number <= 30) return '#ff7272'; // 빨간색
        if (number <= 40) return '#aaa'; // 회색
        return '#b0d840'; // 녹색
    }
}

customElements.define('lotto-generator', LottoGenerator);