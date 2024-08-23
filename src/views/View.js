import DomUpdater from "dom-rerender";

class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();
    this._data = data;
    const markUp = this._generateMarkUp();
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

  clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markUp = `
    <div class="spinner">
        <svg>
            <use xlink:href="icons.svg#icon-loader"></use>
        </svg>
    </div>
  `;
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkUp();
    DomUpdater(this._parentElement, newMarkup);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
        <div class="error">
            <div>
              <svg>
                <use xlink:href="icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }
}

export default View;
