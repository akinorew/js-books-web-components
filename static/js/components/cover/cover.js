(async () => {
    const res = await fetch('/js/components/cover/cover.html');
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

    class Cover extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const instance = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);

            this.addEvents();
        }

        addEvents() {
            this.parentNode.addEventListener('showCover', e => this.showCover(e));
        }

        showCover(e) {
            const body = this.parentNode;
            const bookCoverBackground = this.shadowRoot.querySelector('.book__cover');
            const bookCoverLarge = this.shadowRoot.querySelector('.cover__image');
            const bookCoverClose = this.shadowRoot.querySelector('.cover__close');
            body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
            bookCoverLarge.src = e.detail.cover.large;
            bookCoverBackground.style.display = bookCoverLarge.style.display === 'none' || bookCoverLarge.style.display === '' ? 'block' : 'none';
            bookCoverClose.addEventListener('click', () => {
                bookCoverBackground.style.display = 'none';
                body.style.overflow = 'auto';
            });
        }
    }

    customElements.define('app-cover', Cover);
})();