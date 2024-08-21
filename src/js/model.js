import { getJson, getRecipeInfo } from './views/helpers';
import { API_URL } from './config';
const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
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

    console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export { loadRecipe, state  ,loadSearchResults};

