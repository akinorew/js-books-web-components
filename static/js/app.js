import { BooksService } from './services/books.service.js';

(async () => {
    const res = await fetch('/js/app.html');
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

    class App extends HTMLElement {
        constructor() {
            super();
            this.getBooks();
        }

        connectedCallback() {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const instance = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);
            this.app = this.shadowRoot.querySelector('ol');

            this.addEvents();
        }

        addEvents() {
            const menu = document.querySelector('app-menu');
            menu.addEventListener('sort', e => this.sortBooks(e.detail));
            menu.addEventListener('filter', e => this.filterBooks(e.detail));
            menu.addEventListener('clear', e => this.clear());
        }

        getBooks() {
            BooksService.getData().then((books) => {
                this.books = books;
                this.allBooks = books;
                this.renderDefined();
            });
        }

        clear() {
            this.getBooks();
        }

        filterBooks(pages) {
            this.books = this.allBooks;
            this.books = this.books.filter((book) => parseInt(book.pages, 10) > parseInt(pages, 10));
            localStorage.setItem('filter', pages);
            this.render();
        }

        render() {
            this.app.innerHTML = '';
            this.books.map((book) => {
                this.app.innerHTML += "<app-book data=" + encodeURIComponent(JSON.stringify(book)) + "></app-book>";
            });
        }

        renderDefined() {
            const sort = localStorage.getItem('sort');
            const filter = localStorage.getItem('filter');

            if (filter) {
                this.filterBooks(filter);
            }
            if (sort) {
                this.sortBooks(sort);
            } else {
                this.render();
            }
        }

        sortBooks(type) {
            if (type === 'pages') {
                this.books.sort((a, b) => a.pages - b.pages);
            } else if (type === 'releaseDate') {
                this.books.sort((a, b) => {
                    const aReleaseDate = new Date(a.releaseDate.split('/')[1], a.releaseDate.split('/')[0] - 1);
                    const bReleaseDate = new Date(b.releaseDate.split('/')[1], b.releaseDate.split('/')[0] - 1);
                    return bReleaseDate - aReleaseDate;
                });
            } else if (type === 'author') {
                this.books.sort((a, b) => a.author.split(' ')[1] < b.author.split(' ')[1] ? -1 : 0) ;
            }
            localStorage.setItem('sort', type);
            this.render();
        }
    }

    customElements.define('app-main', App);
})();