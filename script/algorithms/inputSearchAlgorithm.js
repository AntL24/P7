import {tagSearchAlgorithm} from './tagSearchAlgorithm.js';

function searchAlgorithm(query, recipes, tags) {
  let searchResults = [];

  // Si un texte est saisi dans le champ de recherche, recherchez dans le nom et la description de la recette
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

  // Si des tags sont présents, utilisez l'algorithme de recherche approprié
  if (tags.length > 0) {
    console.log("searching with tags")
    searchResults = tagSearchAlgorithm(searchResults, tags);
  }

  return searchResults;
}



export {searchAlgorithm};