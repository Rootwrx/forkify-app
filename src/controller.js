// Import views
import RecipeView from "./views/recipeView";
import SearchView from "./views/searchView";
import ResultsView from "./views/resultsView";
import PaginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView";

// Import model functions
import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateRecipe,
  getCorrectPage,
  addBookMark,
  deleteBookMark,
  uploadRecipe,
} from "./model";

// Import utility functions
import { getUrlSearchParam } from "./utils/helpers";
import { logger } from "./utils/logger";
import { MODAL_CLOSE_SEC, STARTUP_QUERY } from "./utils/config";

class Controller {
  constructor() {
    this.recipeView = RecipeView;
    this.searchView = SearchView;
    this.resultsView = ResultsView;
    this.paginationView = PaginationView;
    this.boomarksView = bookmarksView;
    this.addRecipeView = addRecipeView;

    this.init();
  }

  init() {
    this.recipeView.addHandlerRender(this.controlRecipe.bind(this));
    this.searchView.addHandlerSearch(this.controlSearch.bind(this));
    this.paginationView.addHandlerClick(this.controlPagination.bind(this));
    this.recipeView.addHandlerServings(this.controlServings.bind(this));
    this.recipeView.addHandlerBookMark(this.constrolBookMark.bind(this));
    this.addRecipeView.addHanlderUpload(this.controlUpload.bind(this));

    this.initialLoad();
  }

  async controlRecipe() {
    try {
      const id = location.hash.slice(1);
      if (!id) return;

      this.recipeView.renderSpinner();

      await loadRecipe(id);
      this.recipeView.render(state.recipe);

      this.resultsView.update(getSearchResultsPage());

      bookmarksView.update(state.bookmarks);
    } catch (error) {
      this.recipeView.renderError();
      logger.error("Error in controlRecipe:", error);
    }
  }

  // //? why this function
  // //* i want when the page reload with a hash of a recipe  to get the page where the 'preview' element is !

  loadPage(q) {
    // if q comming from page url(after loading)
    if (q) getCorrectPage();
    this.controlPagination(state.search.page);
  }

  initialLoad() {
    const query = getUrlSearchParam();
    if (query) {
      this.searchView.setQuery(query);
      this.controlSearch(query);
    } else {
      this.controlSearch(STARTUP_QUERY);
    }
    if (location.hash) this.controlRecipe();

    this.boomarksView.render(state.bookmarks);
  }

  async controlSearch(q) {
    try {
      let query = q || this.searchView.getQuery();
      query;

      if (!query?.trim())
        throw new Error("No search query provided by user or URL");

      this.resultsView.renderSpinner();

      history.pushState(
        null,
        "",
        `?search=${encodeURIComponent(query)}${location.hash}`
      );
      await loadSearchResults(query);
      this.loadPage(q);
    } catch (error) {
      this.resultsView.renderError();
      logger.error("Error in controlSearch:", error);
    }
  }

  controlPagination(page) {
    this.resultsView.renderSpinner();
    this.resultsView.render(getSearchResultsPage(page));
    this.paginationView.render(state.search);
  }

  controlServings(newServings) {
    updateRecipe(newServings);
    this.recipeView.update(state.recipe);
  }

  constrolBookMark() {
    if (state.recipe.bookmarked) deleteBookMark(state.recipe.id);
    // bookmarksView.remove(state.recipe.id);
    else addBookMark(state.recipe);
    this.recipeView.update(state.recipe);

    // render bookmarks
    bookmarksView.render(state.bookmarks);
  }

  async controlUpload(newRecipe) {
    try {
      this.addRecipeView.renderSpinner();
      await uploadRecipe(newRecipe);

      this.recipeView.render(state.recipe);
      this.boomarksView.render(state.bookmarks);
      location.hash = state.recipe.id;
      this.addRecipeView.renderMessage();

      setTimeout(
        () => this.addRecipeView.toggleWindow(),
        MODAL_CLOSE_SEC * 1000
      );
    } catch (error) {
      this.addRecipeView.renderError(error.message);
    }
  }
}

export default Controller;
