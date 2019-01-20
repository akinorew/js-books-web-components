export const BooksService = (() => {
    return {
        async getData() {
            return await fetch('/resources/books.json', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then((response) => {
                return response.json();
            })
        }
    }
})();