// Import polyfills and runtime
import "regenerator-runtime/runtime.js";
import "core-js/stable";

// Import views
import RecipeView from "./views/recipeView";
import SearchView from "./views/searchView";
import ResultsView from "./views/resultsView";
import PaginationView from "./views/paginationView";

// Import model functions
import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateRecipe,
  getCorrectPage,
} from "./model";

// Import utility functions
import { getUrlSearchParam } from "./utils/helpers";
import { logger } from "./utils/logger";

// Enable hot module replacement if available
if (module.hot) {
  module.hot.accept();
}

class Controller {
  constructor() {
    this.recipeView = RecipeView;
    this.searchView = SearchView;
    this.resultsView = ResultsView;
    this.paginationView = PaginationView;

    this.init();
  }

  init() {
    this.recipeView.addHandlerRender(this.controlRecipe.bind(this));
    this.searchView.addHandlerSearch(this.controlSearch.bind(this));
    this.paginationView.addHandlerClick(this.controlPagination.bind(this));
    this.recipeView.addHandlerServings(this.controlServings.bind(this));
    this.initialLoad();
  }

  async controlRecipe() {
    try {
      const id = location.hash.slice(1);
      if (!id) return;

      this.recipeView.renderSpinner();

      await loadRecipe(id);
      this.recipeView.render(state.recipe);
      this.loadPage(true);
    } catch (error) {
      this.recipeView.renderError();
      logger.error("Error in controlRecipe:", error);
    }
  }

  // //? why this function
  // //* i want when the page reload with a hash of a recipe to  to get the page where the 'preview' element is !

  loadPage(update) {
    getCorrectPage();
    if (update) {
      this.paginationView.update(state.search);
      this.resultsView.update(getSearchResultsPage(state.search.page));
      return;
    }
    this.paginationView.render(state.search);
    this.resultsView.render(getSearchResultsPage(state.search.page));
  }

  initialLoad() {
    const query = getUrlSearchParam();
    if (query) {
      this.searchView.setQuery(query);
      this.controlSearch(query);
    }
    if (location.hash) {
      this.controlRecipe();
    }
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

      // this.resultsView.render(getSearchResultsPage());
      // this.paginationView.render(state.search);

      this.loadPage();

      return query;
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
}

new Controller();
