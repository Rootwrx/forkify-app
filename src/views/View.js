class View {
  _data;

  /**
   * Renders the view with the provided data.
   *
   * @param {Object|Array} data - The data to be rendered.
   * @param {boolean} [render=true] - A flag indicating whether to render the view immediately.
   *
   * @returns {void|string} If `render` is set to `false`, returns the generated markup as a string.
   *                        Otherwise, renders the view and returns nothing.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data;
    const markUp = this._generateMarkUp();

    if (!render) return markUp;

    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

  /**
   * Clears the content of the parent element by setting its innerHTML to an empty string.
   *
   * @returns {void} This method does not return any value.
   */
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

  /**
   * Updates the view with new data by comparing and applying changes to the existing DOM elements.
   *
   * @param {Object} data - The new data to be rendered.
   *
   * @returns {void} This method does not return any value.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkUp();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    const newElements = Array.from(newDom.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!curEl) return;

      // Update text content only if it differs and is not empty
      const newTextContent = newEl?.firstChild?.nodeValue?.trim();
      const curTextContent = curEl?.firstChild?.nodeValue?.trim();
      if (newTextContent && newTextContent !== curTextContent) {
        curEl.textContent = newEl.textContent;
      }

      // Update attributes if they differ
      if (!newEl.isEqualNode(curEl)) {
        // Update or add new attributes
        Array.from(newEl.attributes).forEach((attr) => {
          if (curEl.getAttribute(attr.name) !== attr.value) {
            curEl.setAttribute(attr.name, attr.value);
          }
        });

        // Remove any attributes not present in the new element
        Array.from(curEl.attributes).forEach((attr) => {
          if (!newEl.hasAttribute(attr.name)) {
            curEl.removeAttribute(attr.name);
          }
        });
      }
    });
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
  renderMessage(message = this._message) {
    const markUp = `
        <div class="error">
            <div>
              <svg>
                <use xlink:href="icons.svg#icon-smile"></use>
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
