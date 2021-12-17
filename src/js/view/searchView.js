class searchView {
    _parentEl = document.querySelector('.search');
    _searchEl = this._parentEl.querySelector('.search__field');

    _clearInput() {
        this._searchEl.value = "";
    }

    getQuery() {
        const query = this._searchEl.value;
        this._clearInput();
        return query;
    }

    addHandlerSearch(process) {
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            process();
        });
    }

}

export default new searchView();  