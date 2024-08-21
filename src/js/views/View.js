import icons from '../../img/icons.svg';
import recipeUI from './recipeUI';

class View {
  _data;

  render(data) {
    this._data = data;
    const markUp = recipeUI({ ...this._data });
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
