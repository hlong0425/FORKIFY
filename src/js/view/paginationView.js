import View from "./View";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {

    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            const gotoPage = Number(btn.dataset.goto);
            handler(gotoPage);
        })
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        if (currentPage === 1) {
            if (currentPage < numPages) return this._pageOneOtherPage(currentPage);
            return '';
        }

        if (currentPage > 1) {
            if (currentPage === numPages) {
                return this._lastPage(currentPage);
            }
            // Other Page
            return this._otherPage(currentPage);
        }
    }
    _pageOneOtherPage(currentPage) {
        return `
        <button data-goto=${currentPage + 1} class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`
    }
    _otherPage(currentPage) {
        return `
            <button data-goto=${currentPage - 1} class="btn--inline pagination__btn--prev" >
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button >

            <button data-goto=${currentPage + 1} class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`
    }

    _lastPage(currentPage) {
        return `
        <button data-goto=${currentPage - 1} class="btn--inline pagination__btn--prev" >
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>    
        </button > `;
    }
}

export default new PaginationView;


/*
    return `
            < button class="btn--inline pagination__btn--prev" >
            <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page 1</span>
        </button >

            <button class="btn--inline pagination__btn--next">
                <span>Page 3</span>
                <svg class="search__icon">
                    <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
            </button>`
*/