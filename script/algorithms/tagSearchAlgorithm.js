//Alternative search algorithm for tags
function tagSearchAlgorithm(recipes, tags) {

  recipes = recipes.filter(recipe => {
    return tags.every(tag => {
      const tagCategory = tag.category;
      const tagText = tag.name.toLowerCase();

      if (tagCategory === "ingredients") {
        return recipe.ingredients.some(ingredient =>
          ingredient.ingredient.toLowerCase().includes(tagText)
        );
      } else if (tagCategory === "appliance") {
        return recipe.appliance.toLowerCase().includes(tagText);
      } else if (tagCategory === "tools") {
        return recipe.ustensils.some(ustensil =>
          ustensil.toLowerCase().includes(tagText)
        );
      }
      return false;
    });
  });

  return recipes;
}

export { tagSearchAlgorithm };
