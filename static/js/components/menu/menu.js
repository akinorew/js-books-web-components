(async () => {
    const res = await fetch('/js/components/menu/menu.html');
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

    class Menu extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const instance = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);

            this.numberOfPagesSort = this.shadowRoot.querySelectorAll('input')[0];
            this.releaseDateSort = this.shadowRoot.querySelectorAll('input')[1];
            this.authorSort = this.shadowRoot.querySelectorAll('input')[2];
            this.numberOfPagesFilter = this.shadowRoot.querySelectorAll('input')[3];
            this.clearButton = this.shadowRoot.querySelectorAll('button')[0];

            this.fillData();

            this.addEvents();
        }

        addEvents() {
            this.numberOfPagesSort.addEventListener('click', (e) => this.sortBy('pages'));
            this.releaseDateSort.addEventListener('click', (e) => this.sortBy('releaseDate'));
            this.authorSort.addEventListener('click', (e) => this.sortBy('author'));
            this.numberOfPagesFilter.oninput = (e) => this.filterBy(e, 'pagesNumber');
            this.clearButton.addEventListener('click', (e) => this.clear());
            document.onkeypress = (e) => {
                if (e.keyCode === 163) {
                    this.clear();
                }
            }
        }

        clear() {
            localStorage.removeItem('sort');
            localStorage.removeItem('filter');
            this.numberOfPagesFilter.value = '';
            this.authorSort.checked = false;
            this.releaseDateSort.checked = false;
            this.numberOfPagesSort.checked = false;
            this.shadowRoot.dispatchEvent(new CustomEvent('clear', {
                bubbles: true,
                composed: true,
            }));
        }

        fillData() {
            const sort = localStorage.getItem('sort');
            const filter = localStorage.getItem('filter');

            if (sort === 'author') {
                this.authorSort.setAttribute('checked', 'checked');
            } else if (sort === 'releaseDate') {
                this.releaseDateSort.setAttribute('checked', 'checked');
            } else if (sort === 'pages') {
                this.numberOfPagesSort.setAttribute('checked', 'checked');
            }

            if (filter) {
                this.numberOfPagesFilter.value = filter;
            }
        }

        filterBy(e) {
            if (e.target.value) {
                this.shadowRoot.dispatchEvent(new CustomEvent('filter', {
                    bubbles: true,
                    composed: true,
                    detail: e.target.value
                }));
            }
        }

        sortBy(type) {
            this.shadowRoot.dispatchEvent(new CustomEvent('sort', {
                bubbles: true,
                composed: true,
                detail: type
            }));

        }
    }

    customElements.define('app-menu', Menu);
})();