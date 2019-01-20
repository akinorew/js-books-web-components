(async () => {
    const res = await fetch('/js/components/book/book.html');
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

    class Book extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const instance = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);
            this.render(this.book);

            this.addEvents()
        }

        static get observedAttributes() { return ["data"]; }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                try {
                    this.book = JSON.parse(decodeURIComponent(newValue));
                } catch(e) {
                    console.log(`Couldn't parse JSON: ${e}`);
                }
            }
        }

        render(book) {
            this.shadowRoot.querySelector('.book__title').innerHTML = book.title;
            this.shadowRoot.querySelector('.book__image').src = book.cover.small;
            this.shadowRoot.querySelector('.book__author').innerHTML = `By ${book.author}`;
            this.shadowRoot.querySelector('.book__release-date').innerHTML = `Release Date:  ${book.releaseDate}`;
            this.shadowRoot.querySelector('.book__pages').innerHTML = `Pages: ${book.pages}`;
            this.shadowRoot.querySelector('.book__link').href = `${book.link}`;
        }

        addEvents() {
            this.bookCover = this.shadowRoot.querySelectorAll('img')[0];
            this.bookCover.addEventListener('click', (e) => this.showCover());
        }

        showCover() {
            this.shadowRoot.dispatchEvent(new CustomEvent('showCover', {
                bubbles: true,
                composed: true,
                detail: this.book,
            }));
        }
    }

    customElements.define('app-book', Book);
})();