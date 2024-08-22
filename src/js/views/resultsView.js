import View from "./View";

class ResutlsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipe Found for you query ";

 

  _generateMarkUp() {
    return this._data
      .map(
        (el) => `
        <li class="preview loader">
            <a class="preview__link" href="#${el.id}">
              <figure class="preview__fig">
                <img src="${el.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__name">
                  ${el.title}
                </h4>
                <p class="preview__publisher">${el.publisher}</p>
              </div>
            </a>
          </li>
      `
      )
      .join("");
  }
}

export default new ResutlsView();
