class MyTiles extends HTMLElement {
    constructor() {
        super();

        // Установка значений по умолчанию
        this.state = {
            content: 'default',
            layout: 'inline',
            order: 'direct',
        }

    }

    connectedCallback() {
        // Инициализация разметки
        // Shadow DOM в данном случае нужен для инкапсуляции CSS
        console.log('connected');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host > .tiles {
                    display: flex;
                    flex-wrap: wrap;
                }
                :host .cell {
                    height: 5em;
                    width: 5em;
                    text-align: center;
                    line-height: 5em;
                }
            </style>
            <div class="tiles"></div>
        `;

        this.render();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        // Обработка изменений атрибутов
        switch (attrName) {
            case 'content':
                this.state.content = newVal;
                this.render();
                break;
            case 'layout':
                this.state.layout = newVal;
                this.render();
                break;
            case 'order':
                this.state.order = newVal;
                this.render();
                break;
        }
    }

    static get observedAttributes() {
        return [
            'content',
            'layout',
            'order',
        ];
    }

    render() {
        let { content, layout, order } = this.state;
        this.shadowRoot.querySelector('.tiles').innerHTML = '';

        // Устанавливаем разметку
        this.shadowRoot.querySelector('.tiles').style.flexDirection = layout == 'column' ? 'column' : 'row';

        // Устанавливаем порядок букв
        if (order == 'reversed') {
            content = [...content].reverse().join('');
        } else if (order == 'randomized') {
            content = [...content].sort(_ => Math.random() - 0.5).join('');
        }

        // Убираем пробелы и переводим в верхний регистр
        let upperCased = content.toUpperCase().replace(/ /g, '');

        // Для каждой буквы создаём свою ячейку
        [...upperCased].forEach(letter => {
            let cell = document.createElement('div');
            cell.textContent = letter;
            cell.classList.add('cell');
            
            // Добавляем случайный цвет
            let randomColor = '#' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16).padStart(6, '0');
            cell.style.backgroundColor = randomColor;

            this.shadowRoot.querySelector('.tiles').appendChild(cell);
        });

    }
}

customElements.define('my-tiles', MyTiles);
