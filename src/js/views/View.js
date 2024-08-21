import icons from '../../img/icons.svg';

class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();
    this._data = data;
    const markUp = this._generateMarkUp();
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  renderspinner() {
    const markUp = `
    <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
    </div>
  `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}

export default View;
