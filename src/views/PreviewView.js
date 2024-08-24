import View from "./View";

class PreviewView extends View {
  _generateMarkUp() {
    return `
          <li class="preview ${
            this._data.id == location.hash.slice(1) ? "active" : ""
          }">
            <a class="preview__link" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
          
          
          
              <h4 class="preview__name">
                  ${this._data.title}
                </h4>
                <p class="preview__publisher">${this._data.publisher}n</p>
                 <div class="recipe__user-generated ${
                   this._data.key ? "" : "hidden"
                 }">
            <svg>
              <use xlink:href="icons.svg#icon-user"></use>
            </svg>
          </div>
              </div>
            </a>
          </li>
      `;
  }
}

export default new PreviewView();
