function tagSearchAlgorithm(recipes, tags) {
  let filteredRecipes = [];

  outerLoop: for (let recipe of recipes) {
    for (let tag of tags) {
      const tagCategory = tag.category;
      const tagText = tag.name.toLowerCase();

      let tagMatched = false;

      if (tagCategory === "ingredients") {
        for (let ingredient of recipe.ingredients) {
          if (ingredient.ingredient.toLowerCase().includes(tagText)) {
            tagMatched = true;
            break;
          }
        }
      } else if (tagCategory === "appliance") {
        if (recipe.appliance.toLowerCase().includes(tagText)) {
          tagMatched = true;
        }
      } else if (tagCategory === "tools") {
        for (let ustensil of recipe.ustensils) {
          if (ustensil.toLowerCase().includes(tagText)) {
            tagMatched = true;
            break;
          }
        }
      }

      if (!tagMatched) {
        continue outerLoop;
      }
    }

    filteredRecipes.push(recipe);
  }

  return filteredRecipes;
}

export { tagSearchAlgorithm };
