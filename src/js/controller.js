import recipeView from './views/recipeView';
import { state, loadRecipe, loadSearchResults } from './model';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
const controlRecipe = async () => {
  try {
    const id = location.hash.slice(1);
    if (!id) return;
    // loading a spinner from the "View" model
    recipeView.renderspinner();
    // sending request to the server  and storing given data in model'state
    await loadRecipe(id);
    //  Rendering Results  after successfully  getting data
    recipeView.render(state.recipe);
  } catch (_) {
    recipeView.renderError();
  }
};

const controlSearch = async () => {
  try {
    resultsView.renderspinner();
    const searchQuery = searchView.getQuery();
    if (!searchQuery.trim()) throw new Error("Input Failed Can't be Empty");
    // await for the server th send back search results
    await loadSearchResults(searchQuery);
  } catch (err) {
    resultsView.renderError(err);
  }
};

const init = () => {
  // using Publisher - Subscriber  design patter to pass 'controlRecipe' to the View (RecipeView) ;
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearch);
};

init();
