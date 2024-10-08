import View from "./View";
import PreviewView from "./PreviewView";

class ResutlsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipe Found for you query ";

  _generateMarkUp() {
    return this._data.map((el) => PreviewView.render(el, false)).join("");
  }
}

export default new ResutlsView();
