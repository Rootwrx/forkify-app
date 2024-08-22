import View from "./View";

class SearchView extends View {
  _parentElement = document.querySelector(".search");
  _input = this._parentElement.querySelector(".search__field");

  getQuery() {
    return this._input.value.trim();
  }

  setQuery(query) {
    this._input.value = query;
  }

  _clear() {
    this._input.value = "";
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
      this._clear();
    });
  }
}

export default new SearchView();
