import View from "./View";
import PreviewView from "./PreviewView";

class ResutlsView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";

  _generateMarkUp() {
    return this._data.map((el) => PreviewView.render(el, false)).join("");
  }
}

export default new ResutlsView();
