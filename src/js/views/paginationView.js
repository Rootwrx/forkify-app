import View from './View';
import icons from '../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const page = +btn.dataset.page;

      handler(page);
    });
  }
  _generateMarkUp() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const { page } = this._data;

    if (page == 1 && numPages > 1)
      return `
        <button data-page="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>

    `;
    if (page == numPages && numPages > 1)
      return `
        <button data-page="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${page - 1}</span>
        </button>
    `;

    if (page < numPages)
      return `
         <button data-page="${
           page - 1
         }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${page - 1}</span>
          </button>
          <button data-page="${
            page + 1
          }" class="btn--inline pagination__btn--next">
            <span>${page + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
         </button>
    `;
    return '';
  }
}

export default new PaginationView();
