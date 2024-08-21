import View from './View';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _succesMessage = ''; 
  addHandlerRender(handler) {
    ['hashchange', 'DOMContentLoaded'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }
}

export default new RecipeView();
