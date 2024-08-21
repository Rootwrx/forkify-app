import 'core-js/stable';
import recipeView from './views/recipeView';
import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
} from './model';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

if (module.hot) module.hot.accept();

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
    console.log(_);
  }
};

const controlSearch = async _ => {
  try {
    resultsView.renderspinner();
    const searchQuery = searchView.getQuery();

    if (!searchQuery.trim())
      throw new Error('Please enter a valid search query');
    // await for the server th send back search results
    await loadSearchResults(searchQuery);
    resultsView.render(getSearchResultsPage(1));
    paginationView.render(state.search);
  } catch (err) {
    resultsView.renderError(err);
    console.log(err);
  }
};

const controlPagination = page => {
  resultsView.render(getSearchResultsPage(page));

  paginationView.render(state.search);
};
const init = () => {
  // using Publisher - Subscriber  design patter to pass 'controlRecipe' to the View (RecipeView) ;
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  // controlSearch(STARTUP_QUERY);
};

init();
