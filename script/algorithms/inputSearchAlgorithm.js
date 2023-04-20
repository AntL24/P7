import { tagSearchAlgorithm } from "./tagSearchAlgorithm.js";

function searchAlgorithm(query, recipes, tags) {
  let searchResults = [];
  
  //Query, return recipes that match the query
  if (query.length > 0) {
    const queryLowerCase = query.toLowerCase();

    searchResults = recipes.filter((recipe) => {
      const recipeName = recipe.name.toLowerCase();
      const recipeDescription = recipe.description.toLowerCase();

      if (
        recipeName.includes(queryLowerCase) ||
        recipeDescription.includes(queryLowerCase)
      ) {
        return true;
      }

      return recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(queryLowerCase)
      );
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
