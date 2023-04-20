import {tagSearchAlgorithm} from './tagSearchAlgorithm.js';

//Search algorithm for recipes: linear search with for loops
function searchAlgorithm(query, recipes, tags) {
  let searchResults = [];

  //If query, search for recipes with matching name, description, or ingredients
  if (query.length > 0) {
    const queryLowerCase = query.toLowerCase();
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const recipeName = recipe.name.toLowerCase();
      const recipeDescription = recipe.description.toLowerCase();

      if (recipeName.includes(queryLowerCase) || recipeDescription.includes(queryLowerCase)) {
        searchResults.push(recipe);
        continue;
      }

      let found = false;
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
        if (ingredient.includes(queryLowerCase)) {
          found = true;
          break;
        }
      }

      if (found) {
        searchResults.push(recipe);
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



export {searchAlgorithm};