function searchAlgorithm(query, recipes) {
    
  const searchResults = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const recipeName = recipe.name.toLowerCase();
    const recipeDescription = recipe.description.toLowerCase();
    const queryLowerCase = query.toLowerCase();

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

  return searchResults;
}


export {searchAlgorithm};