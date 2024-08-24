import { Ajax, getRecipeInfo } from "./utils/helpers";
import { API_KEY, API_URL, RES_PER_PAGE } from "./utils/config";
import { logger } from "./utils/logger";
const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: JSON.parse(localStorage.getItem("bookmarks")) || [],
};

const loadRecipe = async (id) => {
  try {
    const data = await Ajax(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = getRecipeInfo(data.data.recipe);

    const found = state.bookmarks.some((el) => el.id == id);
    if (found) state.recipe.bookmarked = true;
  } catch (err) {
    throw err;
  }
};

const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    const data = await Ajax(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(getRecipeInfo);
    resetSearch();
  } catch (err) {
    throw err;
  }
};

const updateRecipe = (newServings) => {
  const { recipe } = state;

  recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / recipe.servings;
  });
  recipe.originalServings = recipe.servings;
  recipe.servings = newServings;
};

const addBookMark = (recipe) => {
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
    state.bookmarks.unshift(recipe);
    saveToLS();
  }
};

const deleteBookMark = (id) => {
  const index = state.bookmarks.findIndex((el) => el.id == id);
  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);
  if (id == state.recipe.id) state.recipe.bookmarked = false;
  saveToLS();
};

const saveToLS = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const getCorrectPage = () => {
  const index = state.search.results.findIndex(
    (el) => el.id == location.hash.slice(1)
  );

  if (index == -1) return;
  const page = Math.max(Math.ceil((index + 1) / state.search.resultsPerPage));
  state.search.page = page;
};

//? why resetting
//* when we search for something else when we already searched  and moved in pagination, the pagination does not change with the new search results (UI)
const resetSearch = () => {
  state.search.page = 1;
};

const getSearchResultsPage = (pageNumber = state.search.page) => {
  let start = (pageNumber - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  state.search.page = pageNumber;
  return state.search.results.slice(start, end);
};

const uploadRecipe = async (newRecipe) => {
  try {
    const ingredients = extractIngredients(newRecipe);
    const recipe = {
      publisher: newRecipe.publisher,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    const data = await Ajax(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = getRecipeInfo(data.data.recipe);
    addBookMark(state.recipe);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const extractIngredients = (newRecipe) => {
  return Object.entries(newRecipe)
    .filter(
      (entry) => entry[0].startsWith("ingredient") && entry[1].trim() !== ""
    )
    .map((ing) => {
      // const array = ing[1].replaceAll(" ", "").split(",");
      const array = ing[1].split(",").map(el=>el.trim())
      if (array.length !== 3)
        throw new Error(
          "Wrong ingredients format, please use the corrected one!"
        );
      const [quantity, unit, description] = array;

      return {
        quantity: +quantity || null,
        unit,
        description,
      };
    });
};

export {
  loadRecipe,
  state,
  loadSearchResults,
  updateRecipe,
  getSearchResultsPage,
  getCorrectPage,
  resetSearch,
  addBookMark,
  deleteBookMark,
  uploadRecipe,
};
