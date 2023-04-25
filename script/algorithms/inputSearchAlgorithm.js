import { tagSearchAlgorithm } from "./tagSearchAlgorithm.js";

function searchAlgorithm(query, recipes, tags) {
  
let searchResults = [];
const regex = new RegExp(query, "i");//case insensitive regex is far quicker than toLowerCase()

if (query.length >= 3) {
  recipes.forEach(recipe => {
    if (regex.test(recipe.name) || regex.test(recipe.description)) {
      searchResults.push(recipe);
    } else {
      const found = recipe.ingredients.some(ingredient => regex.test(ingredient.ingredient));
      if (found) {
        searchResults.push(recipe);
      }
    }
  });
} else {
    //No query, return all recipes for tag search
    searchResults = [...recipes];
  }

  if (tags.length > 0) {
    searchResults = tagSearchAlgorithm(searchResults, tags);
  }

  return searchResults;
}

export { searchAlgorithm };
