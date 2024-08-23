import icons from "../../img/icons.svg";
import { updateDOM } from "../utils/domUpdater";

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
            <use href="${icons}#icon-loader"></use>
        </svg>
    </div>
  `;
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markUp);
  }

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
                <use href="${icons}#icon-alert-triangle"></use>
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
