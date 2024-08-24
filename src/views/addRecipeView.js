import View from "./View";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _overlay = document.querySelector(".overlay");
  _btnClose = document.querySelector(".btn--close-modal");
  _message = "Recipe was successfuly created";
  constructor() {
    super();
    this._addHandlerShowWindow();
    this.addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
  }
  addHanlderUpload(handler) {
    this._parentElement.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        const data = [...new FormData(this._parentElement)];
        handler(Object.fromEntries(data));
      }.bind(this)
    );
  }
}

export default new AddRecipeView();
