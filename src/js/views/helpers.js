import { TIMEOUT_SEC } from '../config';

const timeout = s =>
  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${s} seconds`)),
      s * 1000
    )
  );

const getJson = async url => {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

const getRecipeInfo = recipe => ({
  id: recipe.id,
  publisher: recipe.publisher,
  image: recipe.image_url,
  title: recipe.title,
  sourceUrl: recipe.source_url,
  servings: recipe.servings,
  ingredients: recipe.ingredients,
  cookingTime: recipe.cooking_time,
});



export { getJson, getRecipeInfo };
