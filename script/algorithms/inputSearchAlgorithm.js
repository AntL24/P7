import { tagSearchAlgorithm } from "./tagSearchAlgorithm.js";

//Search algorithm for recipes: linear search with for loops
function searchAlgorithm(query, recipes, tags) {
  let searchResults = [];
  //If query, search for recipes with matching name, description, or ingredients
  if (query.length > 0) {
    const regex = new RegExp(query, "i");

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      if (regex.test(recipe.name) || regex.test(recipe.description)) {
        searchResults.push(recipe);
      } else {
        let found = false;
        for (let j = 0; j < recipe.ingredients.length; j++) {
          const ingredient = recipe.ingredients[j].ingredient;
          if (regex.test(ingredient)) {
            found = true;
            break;
          }
        }
        if (found) {
          searchResults.push(recipe);
        }
      }
    }
  } else {
    searchResults = [...recipes];
  }

  // If tags are selected, filter the recipes based on those tags
  if (tags.length > 0) {
    searchResults = tagSearchAlgorithm(searchResults, tags);
  }

  return searchResults;
}

export { searchAlgorithm };
