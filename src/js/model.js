import { getJson, getRecipeInfo } from './views/helpers';
import { API_URL, RES_PER_PAGE } from './config';
const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

const loadRecipe = async id => {
  try {
    const data = await getJson(`${API_URL}${id}`);
    state.recipe = getRecipeInfo(data.data.recipe);
  } catch (err) {
    throw err;
  }
};

const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await getJson(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(getRecipeInfo);
  } catch (err) {
    throw err;
  }
};

const getSearchResultsPage = (pageNumber = state.search.page) => {
  const start = (pageNumber - 1) * state.search.resultsPerPage;
  const end = pageNumber * state.search.resultsPerPage;
  state.search.page = pageNumber;
  return state.search.results.slice(start, end);
};

export { loadRecipe, state, loadSearchResults, getSearchResultsPage };
